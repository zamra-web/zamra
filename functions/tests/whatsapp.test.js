"use strict";

// Guards the two things in the WAHA integration that fail silently and badly:
// the webhook signature check (a public endpoint that writes to Firestore) and
// the session projection (which stands between the browser and our own webhook
// signing secret).

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");

const {
  normalizeChatId,
  isDirectChat,
  isGroupChat,
  docIdForMessage,
  projectSession,
  projectQr,
  verifyWebhookSignature,
  isMirrorableEvent,
  buildMessageMirror,
  buildChatSummary,
  whatsappRetentionCutoff,
  sendGuard,
  MAX_TEXT_LENGTH,
} = require("../whatsapp/normalize");

const SECRET = "webhook-signing-secret";
const sign = (body, secret = SECRET, algo = "sha512") =>
  crypto.createHmac(algo, secret).update(Buffer.from(body, "utf8")).digest("hex");

// ── the projection is the whole premise of the proxy ────────────────────────

test("projectSession never leaks the webhook HMAC key back to the browser", () => {
  // This is the exact shape WAHA returns from GET /api/sessions/{name}: the
  // session config, including our own webhook signing secret. A passthrough
  // proxy would hand this to the dashboard on the first status poll.
  const wahaBody = {
    name: "zamra",
    status: "WORKING",
    engine: { engine: "NOWEB" },
    me: { id: "919846606731@c.us", pushName: "Zamra Travels" },
    config: {
      webhooks: [{
        url: "https://asia-south1-zamra-web-01.cloudfunctions.net/whatsappWebhook",
        events: ["message"],
        hmac: { key: "SUPER_SECRET_HMAC_KEY" },
        customHeaders: [{ name: "X-Internal", value: "ANOTHER_SECRET" }],
      }],
      proxy: { server: "localhost:3128", username: "u", password: "PROXY_PASSWORD" },
    },
  };

  const projected = projectSession(wahaBody);
  const serialised = JSON.stringify(projected);

  assert.ok(!("config" in projected), "the whole config key must be dropped");
  for (const secret of ["SUPER_SECRET_HMAC_KEY", "ANOTHER_SECRET", "PROXY_PASSWORD"]) {
    assert.ok(!serialised.includes(secret), `${secret} leaked through projectSession`);
  }
  assert.deepEqual(projected, {
    name: "zamra",
    status: "WORKING",
    engine: "NOWEB",
    me: { id: "919846606731@c.us", pushName: "Zamra Travels" },
    assignedWorker: null,
  });
});

test("projectSession is an allow-list, so new WAHA fields cannot leak by default", () => {
  const projected = projectSession({
    name: "zamra", status: "WORKING",
    somethingNewAndSensitive: "TOKEN",
  });
  assert.ok(!JSON.stringify(projected).includes("TOKEN"));
});

test("projectSession falls back safely on junk", () => {
  assert.equal(projectSession(null).status, "STOPPED");
  assert.equal(projectSession({ status: "NONSENSE" }).status, "STOPPED");
  assert.equal(projectSession({}).me, null);
});

test("projectQr returns base64 only, and rejects a non-image payload", () => {
  assert.deepEqual(projectQr({ mimetype: "image/png", data: "AAAA" }), { mimetype: "image/png", data: "AAAA" });
  assert.equal(projectQr({ data: "" }), null);
  assert.equal(projectQr({ mimetype: "application/json", data: "AAAA" }), null);
  assert.equal(projectQr(null), null);
});

// ── webhook signature ───────────────────────────────────────────────────────

test("verifyWebhookSignature accepts a correctly signed body", () => {
  const body = JSON.stringify({ event: "message", payload: { id: "x" } });
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body), "sha512", SECRET), true);
  // Header casing from the wire should not matter.
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body).toUpperCase(), "SHA512", SECRET), true);
});

test("verifyWebhookSignature rejects a body tampered by a single byte", () => {
  const body = JSON.stringify({ event: "message", payload: { id: "x" } });
  const signature = sign(body);
  const tampered = body.replace("\"x\"", "\"y\"");
  assert.equal(tampered !== body, true);
  assert.equal(verifyWebhookSignature(Buffer.from(tampered), signature, "sha512", SECRET), false);
});

test("verifyWebhookSignature refuses a downgraded algorithm", () => {
  // Trusting the sender's algorithm header is algorithm confusion: an attacker
  // picks the weakest one the library will honour.
  const body = "{}";
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body, SECRET, "sha256"), "sha256", SECRET), false);
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body), "md5", SECRET), false);
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body), "", SECRET), false);
});

test("verifyWebhookSignature never fails open", () => {
  const body = "{}";
  const good = sign(body);
  // No secret configured must reject, not wave everything through.
  assert.equal(verifyWebhookSignature(Buffer.from(body), good, "sha512", ""), false);
  assert.equal(verifyWebhookSignature(Buffer.from(body), good, "sha512", undefined), false);
  // Missing or malformed signature.
  assert.equal(verifyWebhookSignature(Buffer.from(body), "", "sha512", SECRET), false);
  assert.equal(verifyWebhookSignature(Buffer.from(body), "not-hex", "sha512", SECRET), false);
  assert.equal(verifyWebhookSignature(Buffer.from(body), null, "sha512", SECRET), false);
  // Wrong secret.
  assert.equal(verifyWebhookSignature(Buffer.from(body), sign(body, "other"), "sha512", SECRET), false);
});

test("verifyWebhookSignature returns false rather than throwing on a short signature", () => {
  // crypto.timingSafeEqual throws on a length mismatch, and an attacker picks
  // the length. Returning false is the only safe answer.
  const body = "{}";
  assert.doesNotThrow(() => verifyWebhookSignature(Buffer.from(body), "ab", "sha512", SECRET));
  assert.equal(verifyWebhookSignature(Buffer.from(body), "ab", "sha512", SECRET), false);
  // Odd-length hex would silently truncate in Buffer.from(..., 'hex').
  assert.equal(verifyWebhookSignature(Buffer.from(body), "abc", "sha512", SECRET), false);
});

test("verifyWebhookSignature is computed over raw bytes, not a re-serialised body", () => {
  // The bug this exists to catch: JSON.stringify(req.body) re-emits the JSON in
  // canonical form, dropping whatever whitespace the sender actually signed, so
  // the digest never byte-matches.
  const raw = "{ \"event\": \"message\",  \"payload\": { \"id\": \"x\" } }";
  const reserialised = JSON.stringify(JSON.parse(raw));
  assert.notEqual(raw, reserialised);
  assert.equal(verifyWebhookSignature(Buffer.from(raw), sign(raw), "sha512", SECRET), true);
  assert.equal(verifyWebhookSignature(Buffer.from(reserialised), sign(raw), "sha512", SECRET), false);
});

// ── chat ids ────────────────────────────────────────────────────────────────

test("normalizeChatId accepts the shapes a human types", () => {
  assert.equal(normalizeChatId("+91 98466 06731"), "919846606731@c.us");
  assert.equal(normalizeChatId("9846606731"), "919846606731@c.us");     // bare 10-digit → India
  assert.equal(normalizeChatId("919846606731"), "919846606731@c.us");
  assert.equal(normalizeChatId("919846606731@c.us"), "919846606731@c.us");
  assert.equal(normalizeChatId("120363001234567890@g.us"), "120363001234567890@g.us");
});

test("normalizeChatId throws rather than guessing", () => {
  for (const bad of ["", "   ", "abc", "1/2@c.us", "123@unknown", null, undefined, "12@c.us"]) {
    assert.throws(() => normalizeChatId(bad), `${JSON.stringify(bad)} should throw`);
  }
});

test("normalizeChatId refuses status@broadcast", () => {
  // A valid WAHA target, but posting to Status is never what this dashboard means.
  assert.throws(() => normalizeChatId("status@broadcast"), /not a permitted target/);
});

test("isDirectChat and isGroupChat separate the two suffixes", () => {
  assert.equal(isDirectChat("919846606731@c.us"), true);
  assert.equal(isGroupChat("919846606731@c.us"), false);
  assert.equal(isGroupChat("120363001234567890@g.us"), true);
  assert.equal(isDirectChat("120363001234567890@g.us"), false);
});

test("docIdForMessage produces a Firestore-legal id", () => {
  assert.equal(docIdForMessage("true_919846606731@c.us_AAA"), "true_919846606731@c.us_AAA");
  // WAHA ids routinely contain slashes, which Firestore forbids in a doc id.
  assert.equal(docIdForMessage("false_1@c.us_A/B/C"), "false_1@c.us_A_B_C");
  for (const bad of ["", "   ", ".", "..", "__proto__", null]) {
    assert.throws(() => docIdForMessage(bad), `${JSON.stringify(bad)} should throw`);
  }
});

// ── mirroring ───────────────────────────────────────────────────────────────

const messageEvent = (overrides = {}) => ({
  event: "message",
  session: "zamra",
  payload: {
    id: "false_919846606731@c.us_ABC",
    timestamp: 1767225600, // seconds
    from: "919846606731@c.us",
    to: "918888888888@c.us",
    fromMe: false,
    body: "Fare for CCJ-DXB?",
    hasMedia: false,
    ack: 1,
    ...overrides,
  },
});

test("buildMessageMirror reads WAHA timestamps as seconds, not milliseconds", () => {
  const mirror = buildMessageMirror(messageEvent());
  assert.equal(mirror.timestamp.getTime(), 1767225600 * 1000);
  assert.equal(mirror.timestamp.getUTCFullYear(), 2026);
});

test("buildMessageMirror derives direction and chat from fromMe", () => {
  const inbound = buildMessageMirror(messageEvent());
  assert.equal(inbound.direction, "in");
  assert.equal(inbound.chatId, "919846606731@c.us");

  const outbound = buildMessageMirror(messageEvent({ fromMe: true }));
  assert.equal(outbound.direction, "out");
  assert.equal(outbound.chatId, "918888888888@c.us", "an outbound message belongs to the recipient's chat");
});

test("buildMessageMirror truncates an oversized body and handles a media message", () => {
  const long = buildMessageMirror(messageEvent({ body: "x".repeat(MAX_TEXT_LENGTH + 500) }));
  assert.equal(long.body.length, MAX_TEXT_LENGTH);

  const media = buildMessageMirror(messageEvent({
    body: undefined, hasMedia: true,
    media: { url: "https://waha.example/f.jpg", mimetype: "image/jpeg" },
  }));
  assert.equal(media.body, "");
  assert.equal(media.hasMedia, true);
  assert.equal(media.mediaUrl, "https://waha.example/f.jpg");
});

test("buildMessageMirror sets expiresAt from the retention window", () => {
  const mirror = buildMessageMirror(messageEvent(), { retentionDays: 30 });
  const days = (mirror.expiresAt - mirror.timestamp) / (24 * 60 * 60 * 1000);
  assert.equal(days, 30);
});

test("isMirrorableEvent drops group traffic unless it is switched on", () => {
  const group = { event: "message", payload: { from: "120363001234567890@g.us", fromMe: false } };
  assert.equal(isMirrorableEvent(group), false, "six community groups would drown the collection");
  assert.equal(isMirrorableEvent(group, { mirrorGroups: true }), true);
});

test("isMirrorableEvent ignores events we do not store", () => {
  assert.equal(isMirrorableEvent(messageEvent()), true);
  assert.equal(isMirrorableEvent({ ...messageEvent(), event: "presence.update" }), false);
  assert.equal(isMirrorableEvent({ event: "message" }), false, "no payload");
  assert.equal(isMirrorableEvent(null), false);
});

test("buildChatSummary carries only derived fields, so triage state survives a merge", () => {
  const summary = buildChatSummary(buildMessageMirror(messageEvent()));
  assert.equal(summary.chatId, "919846606731@c.us");
  assert.equal(summary.phone, "919846606731");
  assert.equal(summary.lastMessageFromMe, false);
  for (const owned of ["assignedTo", "status", "tags", "unreadCount"]) {
    assert.ok(!(owned in summary), `${owned} is triage state and must not be overwritten by the mirror`);
  }
});

// ── send guard + retention ──────────────────────────────────────────────────

test("sendGuard normalises and bounds an outbound message", () => {
  assert.deepEqual(sendGuard({ chatId: "9846606731", text: "  hi  " }),
    { chatId: "919846606731@c.us", text: "hi" });
  assert.throws(() => sendGuard({ chatId: "9846606731", text: "   " }), /text is required/);
  assert.throws(() => sendGuard({ chatId: "9846606731", text: "x".repeat(MAX_TEXT_LENGTH + 1) }), /exceeds/);
  assert.throws(() => sendGuard({ chatId: "nope", text: "hi" }));
});

test("whatsappRetentionCutoff walks back the configured window", () => {
  const now = new Date("2026-08-22T00:00:00Z");
  assert.equal(whatsappRetentionCutoff(now, 90).toISOString(), "2026-05-24T00:00:00.000Z");
  assert.equal(whatsappRetentionCutoff(now, undefined).toISOString(), "2026-05-24T00:00:00.000Z");
});
