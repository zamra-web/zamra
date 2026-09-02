/**
 * Rate-intake rules and the n8n bearer.
 *
 * The three things worth guarding here are the three that fail quietly:
 * a media URL that lets n8n be aimed at something other than WAHA, a chatter
 * message that spends a vision call, and a burst of messages that gets split
 * into one call each. None of those throw — they just cost money or leak.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  looksLikeRateMessage,
  wahaMediaPath,
  groupPendingMessages,
  buildIntakePayload,
  isUsableDocId,
  isVerifiedSender,
} = require("../whatsapp/rateIntakeRules");
const { verifyN8nBearer, LEGACY_TOKEN } = require("../n8nAuth");

// ── fixtures ────────────────────────────────────────────────────────────────

const CHAT = "919812345678@c.us";
const OTHER_CHAT = "919899999999@c.us";
/** A supplier's announcement community, allow-listed via rateIntakeGroupIds. */
const GROUP = "120363000000000000@g.us";
/** The supplier's own number, as it appears in a group message's sender. */
const SUPPLIER_SENDER = "919812345678@c.us";
const T0 = new Date("2026-08-22T09:00:00.000Z");

function msg(overrides = {}) {
  return {
    id: overrides.messageId || "m1",
    messageId: overrides.messageId || "m1",
    chatId: CHAT,
    rateIntakeAgentId: "102",
    timestamp: T0,
    body: "",
    hasMedia: false,
    ...overrides,
  };
}

const SHEET = "*CCJ JED IX FARES*\n04 MAR 15500\n05 MAR 15800\n06 MAR 16200";

// ── wahaMediaPath: the SSRF boundary ────────────────────────────────────────

test("wahaMediaPath keeps the path from both hostnames WAHA might emit", () => {
  // Production stores the localhost form, because WHATSAPP_API_HOSTNAME is unset.
  assert.equal(wahaMediaPath("http://localhost:3000/api/files/a.jpg"), "/api/files/a.jpg");
  assert.equal(wahaMediaPath("https://waha.zamratravels.com/api/files/a.jpg"), "/api/files/a.jpg");
  assert.equal(wahaMediaPath("/api/files/a.jpg"), "/api/files/a.jpg");
});

test("wahaMediaPath refuses every URL that is not a WAHA file", () => {
  // n8n shares a Docker network with Traefik and WAHA, so a followed URL is an
  // SSRF primitive pointed inside the trusted network.
  assert.equal(wahaMediaPath("http://n8n:5678/rest/login"), null);
  assert.equal(wahaMediaPath("http://localhost:3000/api/sessions"), null);
  assert.equal(wahaMediaPath("http://169.254.169.254/latest/meta-data/"), null);
  assert.equal(wahaMediaPath("file:///etc/passwd"), null);
  assert.equal(wahaMediaPath("//evil.com/api/files/x.jpg"), null);
  assert.equal(wahaMediaPath("http://localhost:3000/api/files/"), null);
  assert.equal(wahaMediaPath(""), null);
  assert.equal(wahaMediaPath(undefined), null);
});

test("wahaMediaPath resolves traversal before testing the prefix", () => {
  assert.equal(wahaMediaPath("http://localhost:3000/api/files/../../../etc/passwd"), null);
  assert.equal(wahaMediaPath("http://localhost:3000/api/files/../sessions"), null);
});

test("wahaMediaPath drops the query rather than echoing a key into the dashboard", () => {
  assert.equal(
    wahaMediaPath("http://localhost:3000/api/files/a.jpg?x-api-key=super-secret"),
    "/api/files/a.jpg",
  );
  assert.equal(wahaMediaPath("http://localhost:3000/api/files/a.jpg#frag"), "/api/files/a.jpg");
});

test("wahaMediaPath preserves the characters a real WAHA message id contains", () => {
  const url = "http://localhost:3000/api/files/false_919812345678@c.us_3EB0F1A2B3.jpg";
  assert.equal(wahaMediaPath(url), "/api/files/false_919812345678@c.us_3EB0F1A2B3.jpg");
});

// ── looksLikeRateMessage ────────────────────────────────────────────────────

test("looksLikeRateMessage accepts a text rate sheet", () => {
  assert.equal(looksLikeRateMessage({ body: SHEET }, { mode: "auto" }), true);
});

test("looksLikeRateMessage accepts an image and refuses other media", () => {
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "image/jpeg" }, { mode: "auto" }), true);
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "image/png" }, { mode: "auto" }), true);
  // A voice note and a PDF are not things the vision step can read.
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "audio/ogg" }, { mode: "auto" }), false);
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "application/pdf" }, { mode: "auto" }), false);
});

test("looksLikeRateMessage does not spend a vision call on chatter", () => {
  for (const body of [
    "ok bro",
    "sent 👍",
    "how many seats available?",
    "9846606731",
    "Please confirm the booking for tomorrow morning flight thanks",
  ]) {
    assert.equal(looksLikeRateMessage({ body }, { mode: "auto" }), false, body);
  }
});

test("looksLikeRateMessage accepts the short updates suppliers actually send", () => {
  // Regression: the first draft demanded 40+ chars and two prices, which reads
  // like a rate sheet but is not how a supplier messages. Each of these is a
  // legitimate rate update and every one of them was being thrown away.
  for (const body of [
    "CCJ JED IX\n04 MAR 15500",
    "CCJ DXB 24MAR 12500",
    "IX CCJ RUH 18 APR 14200",
    "*CCJ JED* 15500",
  ]) {
    assert.equal(looksLikeRateMessage({ body }, { mode: "auto" }), true, body);
  }
});

test("looksLikeRateMessage reads prices written with a thousands comma", () => {
  // Travel Wallet writes nearly its whole sheet this way and Jubair mixes both
  // styles. Before the comma alternative these carried no price token at all and
  // were dropped as chatter, which is invisible: the rate-shape check runs before
  // the sender check, so nothing is recorded for an admin to notice.
  for (const body of [
    "*CCJ -  DOH* IX  (30+7kg)\n06 SEP : 46,700/-\n07 SEP : 46,200/-",
    "\u{1F6EB} COK \u279C RUH \u2013 SV775\n10 Sep \u2013 44,000",
    "CCJ BAH 06 SEP : 32,200/-",
  ]) {
    assert.equal(looksLikeRateMessage({ body }, { mode: "auto" }), true, body);
  }
});

test("the comma alternative does not turn a phone number into a price", () => {
  // The whole reason RATE_TOKEN_RE anchors on \b..\b. A comma cannot appear
  // inside a bare number, so the guard survives the widening — but a supplier
  // quoting a landline with separators must not read as a fare either.
  assert.equal(looksLikeRateMessage({ body: "9846606731" }, { mode: "auto" }), false);
  // A comma between short runs is a list, not a thousands separator: the
  // alternative requires exactly three digits after the comma.
  assert.equal(looksLikeRateMessage({ body: "CCJ seats 1,2 and 3 left" }, { mode: "auto" }), false);
  assert.equal(looksLikeRateMessage({ body: "CCJ JED on 6,7,8 SEP?" }, { mode: "auto" }), false);
});

test("looksLikeRateMessage still needs a price AND something route-shaped", () => {
  // A price with no route reads as prose, not a fare.
  assert.equal(
    looksLikeRateMessage({ body: "Booking reference 15500 confirmed for the passenger today" }, { mode: "auto" }),
    false,
  );
  assert.equal(looksLikeRateMessage({ body: "please send 12500 to my account" }, { mode: "auto" }), false);
  // A route with no price is a question, not a quote.
  assert.equal(looksLikeRateMessage({ body: "any seats CCJ JED next week?" }, { mode: "auto" }), false);
});

test("looksLikeRateMessage honours the per-supplier mode", () => {
  assert.equal(looksLikeRateMessage({ body: SHEET }, { mode: "images_only" }), false);
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "image/jpeg" }, { mode: "images_only" }), true);
  assert.equal(looksLikeRateMessage({ body: SHEET }, { mode: "off" }), false);
  assert.equal(looksLikeRateMessage({ hasMedia: true, mimetype: "image/jpeg" }, { mode: "off" }), false);
  // An unrecognised mode must read as off, never as on.
  assert.equal(looksLikeRateMessage({ body: SHEET }, { mode: "whatever" }), false);
});

// ── groupPendingMessages ────────────────────────────────────────────────────

test("six messages twenty seconds apart are ONE batch, not six", () => {
  const messages = Array.from({ length: 6 }, (_, i) => msg({
    messageId: `m${i}`,
    timestamp: new Date(T0.getTime() + i * 20000),
    hasMedia: true,
    mimetype: "image/jpeg",
  }));

  const now = new Date(T0.getTime() + 6 * 60000);
  const batches = groupPendingMessages(messages, { now, quietMs: 90000 });

  assert.equal(batches.length, 1);
  assert.equal(batches[0].messages.length, 6);
  assert.equal(batches[0].reason, "quiet");
});

test("a chat still being typed into is withheld until it goes quiet", () => {
  const messages = [msg({ messageId: "m1", timestamp: T0, body: SHEET })];
  const stillTyping = groupPendingMessages(messages, {
    now: new Date(T0.getTime() + 30000), quietMs: 90000,
  });
  assert.equal(stillTyping.length, 0);

  const settled = groupPendingMessages(messages, {
    now: new Date(T0.getTime() + 120000), quietMs: 90000,
  });
  assert.equal(settled.length, 1);
});

test("a supplier who drips a line a minute still flushes at max-hold", () => {
  // Never quiet for 90s, so only the max-hold rule can release this.
  const messages = Array.from({ length: 25 }, (_, i) => msg({
    messageId: `m${i}`, body: SHEET, timestamp: new Date(T0.getTime() + i * 60000),
  }));
  const now = new Date(T0.getTime() + 25 * 60000);

  const batches = groupPendingMessages(messages, {
    now, quietMs: 90000, maxHoldMs: 20 * 60000, maxItems: 100,
  });
  assert.equal(batches.length, 1);
  assert.equal(batches[0].reason, "max-hold");
});

test("two suppliers messaging at once are two batches", () => {
  const messages = [
    msg({ messageId: "a1", body: SHEET }),
    msg({ messageId: "b1", body: SHEET, chatId: OTHER_CHAT, rateIntakeAgentId: "205",
      timestamp: new Date(T0.getTime() + 5000) }),
  ];
  const batches = groupPendingMessages(messages, { now: new Date(T0.getTime() + 300000) });

  assert.equal(batches.length, 2);
  assert.deepEqual(batches.map((b) => b.chatId), [CHAT, OTHER_CHAT]);
  // Oldest chat first, so a backlog drains in arrival order.
  assert.deepEqual(batches.map((b) => b.agentId), ["102", "205"]);
});

test("an oversized window is truncated and flagged, not silently trimmed", () => {
  const messages = Array.from({ length: 20 }, (_, i) => msg({
    messageId: `m${i}`, body: SHEET, timestamp: new Date(T0.getTime() + i * 1000),
  }));
  const batches = groupPendingMessages(messages, {
    now: new Date(T0.getTime() + 300000), maxItems: 12,
  });

  assert.equal(batches[0].messages.length, 12);
  assert.equal(batches[0].truncated, true);
});

test("batch members come back oldest first, so raw_text reads in typed order", () => {
  const messages = [
    msg({ messageId: "third", body: "06 MAR 16200", timestamp: new Date(T0.getTime() + 2000) }),
    msg({ messageId: "first", body: "*CCJ JED IX*", timestamp: T0 }),
    msg({ messageId: "second", body: "04 MAR 15500", timestamp: new Date(T0.getTime() + 1000) }),
  ];
  const [batch] = groupPendingMessages(messages, { now: new Date(T0.getTime() + 300000) });

  assert.deepEqual(batch.messageIds, ["first", "second", "third"]);
  assert.equal(buildIntakePayload(batch.messages).rawText, "*CCJ JED IX*\n04 MAR 15500\n06 MAR 16200");
});

test("groupPendingMessages ignores anything it cannot attribute to a supplier", () => {
  const messages = [
    msg({ messageId: "no-agent", rateIntakeAgentId: "" }),
    msg({ messageId: "no-chat", chatId: "" }),
    // Neither a direct chat nor a group — a LID reaching here would be an
    // upstream bug, and forming a batch from one would attribute a sheet to a
    // supplier nothing actually matched.
    msg({ messageId: "lid", chatId: "224876132614243@lid" }),
  ];
  assert.deepEqual(groupPendingMessages(messages, { now: new Date(T0.getTime() + 300000) }), []);
});

test("an announcement group forms a batch — sender verification happened upstream", () => {
  const batches = groupPendingMessages([
    msg({ messageId: "g1", chatId: GROUP, senderId: SUPPLIER_SENDER }),
    msg({ messageId: "g2", chatId: GROUP, senderId: SUPPLIER_SENDER, timestamp: new Date(T0.getTime() + 20000) }),
  ], { now: new Date(T0.getTime() + 300000) });

  assert.equal(batches.length, 1);
  assert.equal(batches[0].chatId, GROUP);
  assert.equal(batches[0].messages.length, 2);
});

test("one group carrying two suppliers splits, rather than merging their sheets", () => {
  // Only verified senders reach this function, so in the announcement groups
  // this was built for both keys agree. The split matters when they do not: a
  // merged batch would be one vision call filed under whichever agent's message
  // sorted first, stamping the wrong commission onto real selling prices.
  const batches = groupPendingMessages([
    msg({ messageId: "a", chatId: GROUP, rateIntakeAgentId: "101" }),
    msg({ messageId: "b", chatId: GROUP, rateIntakeAgentId: "102" }),
  ], { now: new Date(T0.getTime() + 300000) });

  assert.equal(batches.length, 2);
  assert.deepEqual(batches.map((b) => b.agentId).sort(), ["101", "102"]);
  assert.ok(batches.every((b) => b.chatId === GROUP && b.messages.length === 1));
});

// ── isVerifiedSender ────────────────────────────────────────────────────────
//
// The check that makes group intake safe. Everything here is about it failing
// CLOSED: a group message whose sender cannot be established must be skipped,
// never attributed to the group's owner.

test("a supplier's own number is verified without being restated", () => {
  assert.equal(isVerifiedSender(SUPPLIER_SENDER, { chatId: SUPPLIER_SENDER }), true);
});

test("an approved LID is verified, because for some suppliers it is all there is", () => {
  const supplier = { chatId: SUPPLIER_SENDER, senderIds: ["224876132614243@lid"] };
  assert.equal(isVerifiedSender("224876132614243@lid", supplier), true);
});

test("another member of the group is NOT verified", () => {
  // The attack this exists to stop: anyone in a supplier's community forwarding
  // a screenshot would otherwise set Zamra's public selling prices.
  assert.equal(isVerifiedSender("919899999999@c.us", { chatId: SUPPLIER_SENDER }), false);
});

test("an unresolvable sender fails closed rather than falling back to the owner", () => {
  const supplier = { chatId: SUPPLIER_SENDER, senderIds: ["224876132614243@lid"] };
  for (const sender of [null, undefined, "", "   "]) {
    assert.equal(isVerifiedSender(sender, supplier), false, `${JSON.stringify(sender)} must not verify`);
  }
});

test("isVerifiedSender survives a supplier with no addresses at all", () => {
  assert.equal(isVerifiedSender(SUPPLIER_SENDER, {}), false);
  assert.equal(isVerifiedSender(SUPPLIER_SENDER, null), false);
  assert.equal(isVerifiedSender(SUPPLIER_SENDER, { chatId: null, senderIds: [] }), false);
});

test("verification is case-insensitive and ignores stray whitespace", () => {
  const supplier = { chatId: SUPPLIER_SENDER, senderIds: ["  224876132614243@LID  "] };
  assert.equal(isVerifiedSender("224876132614243@lid", supplier), true);
  assert.equal(isVerifiedSender(SUPPLIER_SENDER.toUpperCase(), supplier), true);
});

// ── buildIntakePayload ──────────────────────────────────────────────────────

test("buildIntakePayload joins text and collects only fetchable images", () => {
  const { rawText, media } = buildIntakePayload([
    msg({ messageId: "a", body: "*CCJ JED IX*" }),
    msg({ messageId: "b", body: "   " }),
    msg({ messageId: "c", body: "04 MAR 15500", hasMedia: true, mimetype: "image/jpg",
      mediaUrl: "http://localhost:3000/api/files/c.jpg" }),
    msg({ messageId: "d", hasMedia: true, mimetype: "audio/ogg",
      mediaUrl: "http://localhost:3000/api/files/d.ogg" }),
    // An image whose URL is not a WAHA file is dropped, not passed through.
    msg({ messageId: "e", hasMedia: true, mimetype: "image/png",
      mediaUrl: "http://n8n:5678/rest/login" }),
  ]);

  assert.equal(rawText, "*CCJ JED IX*\n04 MAR 15500");
  assert.equal(media.length, 1);
  assert.equal(media[0].path, "/api/files/c.jpg");
  // image/jpg is normalised, matching what the zamra-rates workflow accepts.
  assert.equal(media[0].mimetype, "image/jpeg");
});

test("buildIntakePayload does not pay for the same image twice", () => {
  const url = "http://localhost:3000/api/files/same.jpg";
  const { media } = buildIntakePayload([
    msg({ messageId: "a", hasMedia: true, mimetype: "image/jpeg", mediaUrl: url }),
    msg({ messageId: "b", hasMedia: true, mimetype: "image/jpeg", mediaUrl: url }),
  ]);
  assert.equal(media.length, 1);
});

// ── verifyN8nBearer ─────────────────────────────────────────────────────────

test("verifyN8nBearer accepts the configured secret", () => {
  assert.deepEqual(
    verifyN8nBearer("Bearer s3cr3t-token", { secret: "s3cr3t-token" }),
    { ok: true, legacy: false },
  );
  assert.deepEqual(
    verifyN8nBearer("bearer s3cr3t-token", { secret: "s3cr3t-token" }),
    { ok: true, legacy: false },
  );
});

test("verifyN8nBearer never fails open on a missing secret", () => {
  // A deploy without the secret bound must reject everything, including an
  // empty header — the endpoint it guards writes fares to the public site.
  assert.equal(verifyN8nBearer("Bearer anything", { secret: "" }).ok, false);
  assert.equal(verifyN8nBearer("Bearer anything", { secret: undefined }).ok, false);
  assert.equal(verifyN8nBearer("", { secret: "" }).ok, false);
  assert.equal(verifyN8nBearer(undefined, { secret: "" }).ok, false);
});

test("verifyN8nBearer compares unequal lengths without throwing", () => {
  // timingSafeEqual throws on a length mismatch; digesting first is what stops
  // a one-character token from 500ing the handler.
  assert.equal(verifyN8nBearer("Bearer x", { secret: "a-much-longer-secret" }).ok, false);
  assert.equal(verifyN8nBearer(`Bearer ${"x".repeat(5000)}`, { secret: "short" }).ok, false);
});

test("verifyN8nBearer accepts the legacy public token only when asked to", () => {
  assert.equal(verifyN8nBearer(`Bearer ${LEGACY_TOKEN}`, { secret: "new" }).ok, false);
  assert.deepEqual(
    verifyN8nBearer(`Bearer ${LEGACY_TOKEN}`, { secret: "new", allowLegacy: true }),
    { ok: true, legacy: true },
  );
});

test("verifyN8nBearer rejects a bare token with no Bearer scheme", () => {
  assert.equal(verifyN8nBearer("s3cr3t-token", { secret: "s3cr3t-token" }).ok, false);
  assert.equal(verifyN8nBearer("Basic s3cr3t-token", { secret: "s3cr3t-token" }).ok, false);
});

// ── isUsableDocId ───────────────────────────────────────────────────────────

test("isUsableDocId rejects the ids Firestore throws on rather than 404s on", () => {
  // Found in production: `complete` with a reserved-pattern batchId returned a
  // 500, and n8n's Complete Batch node retries a 500 three times for something
  // that can never succeed. Firestore rejects these by THROWING in the client.
  assert.equal(isUsableDocId("__probe__"), false);
  assert.equal(isUsableDocId("a/b"), false);
  assert.equal(isUsableDocId("."), false);
  assert.equal(isUsableDocId(".."), false);
  assert.equal(isUsableDocId("x".repeat(1501)), false);
  assert.equal(isUsableDocId(""), false);
  assert.equal(isUsableDocId("   "), false);
  assert.equal(isUsableDocId(null), false);
});

test("isUsableDocId accepts a real Firestore auto-id", () => {
  assert.equal(isUsableDocId("9f3cKq2mZpLr8Xt1vBnQ"), true);
  assert.equal(isUsableDocId("abc123"), true);
  // Underscores are fine; only the __wrapped__ form is reserved.
  assert.equal(isUsableDocId("_leading"), true);
  assert.equal(isUsableDocId("__only_leading"), true);
});
