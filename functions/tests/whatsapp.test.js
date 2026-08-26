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
  MAX_INBOUND_TEXT_LENGTH,
  chatIdFromPayload,
  senderFromPayload,
  isAllowedGroup,
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
  // Bounded at the INBOUND cap, not the outbound send limit. A body just over
  // 4096 is an ordinary supplier rate sheet and must arrive whole.
  const justOverSendLimit = buildMessageMirror(messageEvent({ body: "x".repeat(MAX_TEXT_LENGTH + 500) }));
  assert.equal(justOverSendLimit.body.length, MAX_TEXT_LENGTH + 500);

  const long = buildMessageMirror(messageEvent({ body: "x".repeat(MAX_INBOUND_TEXT_LENGTH + 500) }));
  assert.equal(long.body.length, MAX_INBOUND_TEXT_LENGTH);

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

// ── inbound body length ─────────────────────────────────────────────────────

test("a full supplier rate sheet survives the mirror intact", () => {
  // Regression: inbound bodies were sliced at the OUTBOUND send limit of 4096.
  // A real sheet from one supplier runs past 6000 characters — roughly forty
  // sectors — so the last third was dropped and those sectors were never
  // ingested, with nothing anywhere reporting a loss.
  const sheet = Array.from({ length: 300 }, (_, i) => `25 AUG : ${12000 + i}/-`).join("\n");
  assert.ok(sheet.length > 4096, "fixture must exceed the old cap to be meaningful");

  const mirror = buildMessageMirror({
    event: "message",
    session: "zamra",
    payload: { id: "m1", timestamp: 1750000000, from: "919812345678@c.us", body: sheet },
  });

  assert.equal(mirror.body.length, sheet.length, "the whole sheet must be mirrored");
  assert.ok(mirror.body.endsWith("/-"), "the tail of the sheet must survive");
});

test("the inbound cap is far above the outbound send limit, and they are separate", () => {
  // They measure different things: 4096 is WhatsApp's send limit, while inbound
  // text can reach 65536. Collapsing them back into one constant is the bug.
  assert.ok(MAX_INBOUND_TEXT_LENGTH > 4096);
  assert.ok(MAX_INBOUND_TEXT_LENGTH <= 65536);

  const huge = "x".repeat(MAX_INBOUND_TEXT_LENGTH + 500);
  const mirror = buildMessageMirror({
    event: "message", session: "zamra",
    payload: { id: "m2", timestamp: 1750000000, from: "919812345678@c.us", body: huge },
  });
  assert.equal(mirror.body.length, MAX_INBOUND_TEXT_LENGTH, "still bounded, just not at 4096");
});

// ── WAHA NOWEB address formats ──────────────────────────────────────────────
// The single defect that stopped this integration working at all. WAHA's NOWEB
// engine speaks raw WhatsApp JIDs (@s.whatsapp.net), and WhatsApp has begun
// addressing some contacts by LID — an opaque id that is not a phone number.
// Only @c.us was accepted, so normalizeChatId threw, isMirrorableEvent returned
// false, and every inbound message was dropped with a 200 and no error anywhere.

test("a NOWEB direct chat id is canonicalised to the @c.us form", () => {
  assert.equal(normalizeChatId("919846606755@s.whatsapp.net"), "919846606755@c.us");
  assert.equal(normalizeChatId("919846606755@S.WhatsApp.Net"), "919846606755@c.us");
  // @c.us stays canonical: it is what is already stored, what
  // agents.whatsappChatId holds, and what /api/sendText takes.
  assert.equal(normalizeChatId("919846606755@c.us"), "919846606755@c.us");
  assert.equal(isDirectChat(normalizeChatId("919846606755@s.whatsapp.net")), true);
});

test("a LID chat id is accepted rather than thrown away", () => {
  assert.equal(normalizeChatId("224876132614243@lid"), "224876132614243@lid");
  // It is not a phone number, so it must not read as a direct chat — nothing
  // may attribute it to a supplier.
  assert.equal(isDirectChat("224876132614243@lid"), false);
  assert.equal(isGroupChat("224876132614243@lid"), false);
});

test("a LID-addressed message resolves to the sender's real number", () => {
  // Verbatim shape of the payload WAHA delivered for a real supplier sheet.
  const chatId = chatIdFromPayload({
    from: "224876132614243@lid",
    to: null,
    fromMe: false,
    _data: { key: {
      remoteJid: "224876132614243@lid",
      remoteJidAlt: "919846606755@s.whatsapp.net",
      addressingMode: "lid",
    } },
  });
  assert.equal(chatId, "919846606755@c.us", "the LID must resolve to the phone JID");
});

test("remoteJidAlt is ignored for a group, where it is the sender not the chat", () => {
  // In a group, remoteJidAlt carries the individual sender's number. Swapping it
  // in would file group traffic under a person — and could route a group
  // message to a supplier's intake.
  const chatId = chatIdFromPayload({
    from: "120363412290751035@g.us",
    fromMe: false,
    _data: { key: { remoteJidAlt: "919846606755@s.whatsapp.net" } },
  });
  assert.equal(chatId, "120363412290751035@g.us");
});

test("a LID with no resolvable phone JID stays a LID instead of guessing", () => {
  assert.equal(chatIdFromPayload({ from: "224876132614243@lid", fromMe: false }), "224876132614243@lid");
  assert.equal(
    chatIdFromPayload({ from: "224876132614243@lid", fromMe: false, _data: { key: { remoteJidAlt: "" } } }),
    "224876132614243@lid",
  );
});

test("a NOWEB message mirrors end to end under the supplier's number", () => {
  const mirror = buildMessageMirror({
    event: "message",
    session: "zamra",
    payload: {
      id: "false_224876132614243@lid_A599706896C1DFB98318607F20FC1E6E",
      from: "224876132614243@lid",
      fromMe: false,
      timestamp: 1787419194,
      body: "*SLL -  CCJ*   IX (30+7kg)\n25 AUG : 12200/-",
      _data: { key: { remoteJidAlt: "919846606755@s.whatsapp.net", addressingMode: "lid" } },
    },
  });

  assert.equal(mirror.chatId, "919846606755@c.us");
  assert.equal(mirror.isGroup, false);
  assert.equal(mirror.direction, "in");
  assert.equal(buildChatSummary(mirror).phone, "919846606755", "the inbox must show a dialable number");
});

test("a NOWEB message is mirrorable, which is what silently failed before", () => {
  const event = {
    event: "message",
    session: "zamra",
    payload: {
      id: "false_224876132614243@lid_ABC",
      from: "224876132614243@lid",
      fromMe: false,
      timestamp: 1787419194,
      body: "25 AUG : 12200/-",
      _data: { key: { remoteJidAlt: "919846606755@s.whatsapp.net" } },
    },
  };
  assert.equal(isMirrorableEvent(event, { mirrorGroups: false }), true);
});

// ── group senders and the intake allow-list ─────────────────────────────────
//
// Group intake rests entirely on these two: which groups are stored at all, and
// who inside one is allowed to set Zamra's selling prices. Both fail closed, and
// both are easy to "simplify" into failing open.

const GROUP_ID = "120363000000000000@g.us";
const SUPPLIER = "919812345678@c.us";

/** A group message as NOWEB delivers it, addressed by LID with the PN beside. */
function groupMessage(overrides = {}) {
  return {
    event: "message",
    session: "default",
    payload: {
      id: "false_120363000000000000@g.us_3EB0",
      timestamp: 1755855600,
      from: GROUP_ID,
      fromMe: false,
      body: "CCJ JED IX 04 MAR 15500",
      participant: "224876132614243@lid",
      _data: { key: { participantAlt: "919812345678@s.whatsapp.net" } },
      ...overrides,
    },
  };
}

test("senderFromPayload prefers the phone JID over the LID beside it", () => {
  // The whole point: agents.whatsappChatId is a phone number, so reading the
  // LID would leave a supplier unmatchable even though the payload named them.
  assert.equal(senderFromPayload(groupMessage().payload), SUPPLIER);
});

test("senderFromPayload keeps a LID when no phone form is present anywhere", () => {
  const payload = groupMessage({ _data: { key: {} } }).payload;
  assert.equal(senderFromPayload(payload), "224876132614243@lid");
});

test("senderFromPayload returns null rather than inventing a sender", () => {
  assert.equal(senderFromPayload({}), null);
  assert.equal(senderFromPayload(null), null);
  assert.equal(senderFromPayload({ participant: "not-an-address" }), null);
});

test("buildMessageMirror resolves senderId for a group and leaves it null for a direct chat", () => {
  const group = buildMessageMirror(groupMessage());
  assert.equal(group.isGroup, true);
  assert.equal(group.senderId, SUPPLIER);
  // The raw value survives untouched, so the inbox still shows what WAHA sent.
  assert.equal(group.participant, "224876132614243@lid");

  const direct = buildMessageMirror({
    event: "message", session: "default",
    payload: { id: "x", timestamp: 1755855600, from: SUPPLIER, fromMe: false, body: "hi" },
  });
  assert.equal(direct.isGroup, false);
  assert.equal(direct.senderId, null, "a direct chat's sender IS its chat id");
});

test("an allow-listed group mirrors without opening every group", () => {
  const event = groupMessage();
  // The regression this guards: linking one supplier community must not require
  // mirrorGroups, which would drag in all six of Zamra's own groups.
  assert.equal(isMirrorableEvent(event, { mirrorGroups: false }), false);
  assert.equal(
    isMirrorableEvent(event, { mirrorGroups: false, mirrorGroupIds: new Set([GROUP_ID]) }),
    true,
  );
});

test("a group nobody linked is still dropped", () => {
  const event = groupMessage({ from: "120363999999999999@g.us" });
  assert.equal(
    isMirrorableEvent(event, { mirrorGroups: false, mirrorGroupIds: new Set([GROUP_ID]) }),
    false,
  );
});

test("isAllowedGroup takes a Set or an Array and is case-insensitive", () => {
  assert.equal(isAllowedGroup(new Set([GROUP_ID]), GROUP_ID.toUpperCase()), true);
  assert.equal(isAllowedGroup([GROUP_ID], GROUP_ID), true);
  assert.equal(isAllowedGroup(null, GROUP_ID), false);
  assert.equal(isAllowedGroup([], GROUP_ID), false);
});
