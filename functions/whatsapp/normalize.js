/**
 * normalize.js — the pure half of the WAHA integration.
 *
 * Everything here is a plain function over plain data: no Firestore, no
 * firebase-functions, no network. That is deliberate — it lets
 * functions/tests/whatsapp.test.js exercise the security-critical logic
 * (webhook signature verification and the session-response projection)
 * directly, the same way soto/normalize.js is tested.
 */

"use strict";

const crypto = require("crypto");

/** The one WhatsApp session. WAHA supports many; Zamra runs one number. */
const SESSION_NAME = "zamra";

/** WAHA session lifecycle states. */
const WAHA_STATUSES = Object.freeze([
  "STOPPED", "STARTING", "SCAN_QR_CODE",
  "PASSKEY_REQUIRED", "PASSKEY_CONFIRMATION_REQUIRED",
  "WORKING", "FAILED",
]);

/** WhatsApp's own limit for a text message body. */
/**
 * Ceiling on an OUTBOUND message. 4096 is WhatsApp's own send limit, so this
 * is a real constraint, not a policy choice.
 */
const MAX_TEXT_LENGTH = 4096;

/**
 * Ceiling on a MIRRORED inbound body.
 *
 * Deliberately much larger than the send limit, because the two are unrelated:
 * WhatsApp accepts inbound text up to 65536 characters and a supplier's daily
 * rate sheet routinely runs past 6000 — around forty sectors, a couple of
 * hundred fares. Slicing those at 4096 silently dropped the last third of the
 * sheet, so entire sectors were never ingested and nothing anywhere said so.
 *
 * Still bounded: a Firestore document is capped at 1 MiB and the whole body is
 * handed to a model downstream.
 */
const MAX_INBOUND_TEXT_LENGTH = 32768;

/** Events we mirror. Anything else is acknowledged and dropped. */
const MIRRORED_EVENTS = Object.freeze(["message", "message.any", "message.ack"]);

/** Delivery-ack codes, WAHA's numbering. */
const ACK_NAMES = Object.freeze({
  "-1": "ERROR", 0: "PENDING", 1: "SERVER", 2: "DEVICE", 3: "READ", 4: "PLAYED",
});

// ── chat ids ────────────────────────────────────────────────────────────────

const DIRECT_CHAT_RE = /^\d{7,15}@c\.us$/;
const GROUP_CHAT_RE = /^[\d-]{5,40}@g\.us$/;

/**
 * Coerce user input into a WAHA chat id.
 *
 * Accepts a bare number, a formatted number, or an already-suffixed id. A bare
 * 10-digit number is assumed Indian and gets a 91 prefix, matching how
 * config/b2b.whatsappNumber is stored.
 *
 * Throws rather than returning null: every caller is a send path, and silently
 * coercing a malformed number into a valid-looking one is how a message goes
 * to a stranger.
 *
 * @param {string} input
 * @returns {string} e.g. "919846606731@c.us"
 */
function normalizeChatId(input) {
  const raw = String(input ?? "").trim();
  if (!raw) throw new Error("chatId is required");

  // Already suffixed — validate the shape and pass through.
  if (raw.includes("@")) {
    const lowered = raw.toLowerCase();
    // status@broadcast is a real WAHA target and is never a legitimate one
    // here: posting to Status is not something this dashboard should do.
    if (lowered === "status@broadcast") throw new Error("status@broadcast is not a permitted target");
    if (DIRECT_CHAT_RE.test(lowered) || GROUP_CHAT_RE.test(lowered)) return lowered;
    throw new Error(`unrecognised chatId: ${raw}`);
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) throw new Error(`unrecognised chatId: ${raw}`);
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  if (!/^\d{7,15}$/.test(withCountry)) throw new Error(`unrecognised chatId: ${raw}`);
  return `${withCountry}@c.us`;
}

/** @param {string} chatId @returns {boolean} */
function isGroupChat(chatId) {
  return GROUP_CHAT_RE.test(String(chatId ?? "").toLowerCase());
}

/** @param {string} chatId @returns {boolean} */
function isDirectChat(chatId) {
  return DIRECT_CHAT_RE.test(String(chatId ?? "").toLowerCase());
}

/**
 * A WAHA message id used as a Firestore document id.
 *
 * Firestore forbids "/", ".", ".." and anything matching __*__ in a doc id, and
 * WAHA ids routinely contain slashes. Getting this wrong fails at write time,
 * in production, inside a webhook — so it is guarded and tested rather than
 * assumed.
 *
 * @param {string} wahaMessageId
 * @returns {string}
 */
function docIdForMessage(wahaMessageId) {
  const raw = String(wahaMessageId ?? "").trim();
  if (!raw) throw new Error("message id is required");
  const safe = raw.replace(/\//g, "_");
  if (safe === "." || safe === "..") throw new Error(`unusable message id: ${raw}`);
  if (/^__.*__$/.test(safe)) throw new Error(`unusable message id: ${raw}`);
  if (safe.length > 1500) throw new Error(`message id too long: ${raw.slice(0, 40)}…`);
  return safe;
}

// ── projections ─────────────────────────────────────────────────────────────

/**
 * Project a WAHA session body down to what the browser may see.
 *
 * This is the reason the admin surface proxies WAHA instead of talking to it
 * directly. GET /api/sessions/{name} returns the full session `config`, and
 * that config contains `webhooks[].hmac.key` — our own webhook signing secret —
 * plus any customHeaders. A passthrough proxy would hand all of it to the
 * browser on the first status poll.
 *
 * Allow-list, never deny-list: a new WAHA release adding another sensitive
 * config field must not silently start leaking it.
 *
 * @param {object} body
 * @returns {{name:string,status:string,engine:string|null,me:object|null,assignedWorker:string|null}}
 */
function projectSession(body) {
  const src = body && typeof body === "object" ? body : {};
  const me = src.me && typeof src.me === "object" ? src.me : null;
  const engine = src.engine && typeof src.engine === "object" ? src.engine.engine : src.engine;

  return {
    name: typeof src.name === "string" ? src.name : SESSION_NAME,
    status: WAHA_STATUSES.includes(src.status) ? src.status : "STOPPED",
    engine: typeof engine === "string" ? engine : null,
    me: me ? { id: String(me.id ?? ""), pushName: String(me.pushName ?? "") } : null,
    assignedWorker: typeof src.assignedWorker === "string" ? src.assignedWorker : null,
  };
}

/**
 * Project WAHA's QR response. Base64 only — never echo the raw body, which can
 * carry the session config alongside it.
 *
 * @param {object} body
 * @returns {{mimetype:string,data:string}|null}
 */
function projectQr(body) {
  const src = body && typeof body === "object" ? body : {};
  const data = typeof src.data === "string" ? src.data : null;
  if (!data) return null;
  const mimetype = typeof src.mimetype === "string" ? src.mimetype : "image/png";
  if (!/^image\//.test(mimetype)) return null;
  return { mimetype, data };
}

// ── webhook signature ───────────────────────────────────────────────────────

/**
 * Verify WAHA's webhook HMAC.
 *
 * Three ways this fails open, all of them guarded here:
 *
 *  1. The digest must be computed over the RAW request bytes. Re-stringifying
 *     the parsed body will not byte-match — key order and whitespace differ.
 *     Callers must pass req.rawBody, never JSON.stringify(req.body).
 *  2. The algorithm header must be exactly sha512. Trusting whatever the
 *     sender names is algorithm confusion.
 *  3. crypto.timingSafeEqual THROWS on a length mismatch, so lengths are
 *     compared first — an attacker-controlled short signature must return
 *     false, not crash into whatever the caller's catch does.
 *
 * A missing secret returns false. This endpoint writes to Firestore; there is
 * no configuration under which it should accept an unsigned request.
 *
 * @param {Buffer|string} rawBody
 * @param {string} signatureHeader  X-Webhook-Hmac
 * @param {string} algorithmHeader  X-Webhook-Hmac-Algorithm
 * @param {string} secret
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signatureHeader, algorithmHeader, secret) {
  if (!secret || typeof secret !== "string") return false;
  if (String(algorithmHeader ?? "").toLowerCase() !== "sha512") return false;

  const provided = String(signatureHeader ?? "").trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(provided) || provided.length % 2 !== 0) return false;

  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody ?? ""), "utf8");
  const expected = crypto.createHmac("sha512", secret).update(body).digest("hex");

  const a = Buffer.from(provided, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ── event mirroring ─────────────────────────────────────────────────────────

/**
 * Should this WAHA event become a Firestore document?
 *
 * Group traffic is dropped by default: Zamra runs six community WhatsApp
 * groups, and mirroring those turns a quiet collection into thousands of
 * writes a day for messages nobody triages in the dashboard.
 *
 * @param {object} event
 * @param {{mirrorGroups?: boolean}} [options]
 * @returns {boolean}
 */
function isMirrorableEvent(event, { mirrorGroups = false } = {}) {
  const src = event && typeof event === "object" ? event : {};
  if (!MIRRORED_EVENTS.includes(src.event)) return false;

  const payload = src.payload && typeof src.payload === "object" ? src.payload : null;
  if (!payload) return false;

  const chatId = chatIdFromPayload(payload);
  if (!chatId) return false;
  if (isGroupChat(chatId) && !mirrorGroups) return false;
  return isDirectChat(chatId) || isGroupChat(chatId);
}

/**
 * The conversation a payload belongs to. For an inbound message that is
 * `from`; for one we sent, `to`.
 *
 * @param {object} payload
 * @returns {string|null}
 */
function chatIdFromPayload(payload) {
  const src = payload && typeof payload === "object" ? payload : {};
  const raw = src.fromMe ? (src.to || src.from) : (src.from || src.to);
  const chatId = String(raw ?? "").trim().toLowerCase();
  return chatId || null;
}

/**
 * Build the Firestore mirror document for a WAHA message event.
 *
 * The doc id is the WAHA message id (see docIdForMessage), which is what makes
 * the whole pipeline idempotent: sendWhatsappMessage writes the outbound doc,
 * WAHA then fires message.any for that same id, and the webhook merges into the
 * existing doc rather than creating a duplicate. WAHA's own retries are safe
 * for the same reason.
 *
 * @param {object} event
 * @param {{now?: Date, retentionDays?: number}} [options]
 * @returns {object}
 */
function buildMessageMirror(event, { now = new Date(), retentionDays = 90 } = {}) {
  const src = event && typeof event === "object" ? event : {};
  const payload = src.payload && typeof src.payload === "object" ? src.payload : {};

  const chatId = chatIdFromPayload(payload);
  const fromMe = Boolean(payload.fromMe);
  const media = payload.media && typeof payload.media === "object" ? payload.media : null;

  // WAHA timestamps are unix SECONDS. Treating them as ms puts every message
  // in 1970 and silently breaks ordering.
  const seconds = Number(payload.timestamp);
  const timestamp = Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000) : now;

  const body = String(payload.body ?? "").slice(0, MAX_INBOUND_TEXT_LENGTH);
  const ack = Number.isFinite(Number(payload.ack)) ? Number(payload.ack) : null;

  return {
    messageId: String(payload.id ?? ""),
    chatId,
    session: String(src.session ?? SESSION_NAME),
    direction: fromMe ? "out" : "in",
    fromMe,
    from: String(payload.from ?? ""),
    to: String(payload.to ?? ""),
    body,
    type: String(payload.type ?? (payload.hasMedia ? "media" : "chat")),
    hasMedia: Boolean(payload.hasMedia),
    mediaUrl: media && typeof media.url === "string" ? media.url : null,
    mimetype: media && typeof media.mimetype === "string" ? media.mimetype : null,
    isGroup: isGroupChat(chatId),
    participant: String(payload.participant ?? "") || null,
    ack,
    ackName: ack !== null ? (ACK_NAMES[String(ack)] ?? null) : null,
    timestamp,
    expiresAt: new Date(timestamp.getTime() + retentionDays * 24 * 60 * 60 * 1000),
  };
}

/**
 * The whatsapp_chats summary derived from a mirror doc. Merged, never
 * overwritten, so triage fields (assignedTo, status, tags) survive.
 *
 * @param {object} mirror  the output of buildMessageMirror
 * @returns {object}
 */
function buildChatSummary(mirror) {
  const chatId = String(mirror.chatId ?? "");
  return {
    chatId,
    phone: chatId.split("@")[0] || "",
    isGroup: Boolean(mirror.isGroup),
    lastMessageAt: mirror.timestamp,
    lastMessageBody: String(mirror.body ?? "").slice(0, 200),
    lastMessageFromMe: Boolean(mirror.fromMe),
  };
}

/**
 * @param {Date} now
 * @param {number} retentionDays
 * @returns {Date} the cutoff below which mirrored messages are swept
 */
function whatsappRetentionCutoff(now, retentionDays) {
  const days = Number.isFinite(Number(retentionDays)) ? Number(retentionDays) : 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

/**
 * Validate an outbound message before it reaches WAHA. Returns the cleaned
 * values or throws — the caller maps the throw to invalid-argument.
 *
 * @param {{chatId?: string, text?: string}} input
 * @returns {{chatId: string, text: string}}
 */
function sendGuard(input) {
  const src = input && typeof input === "object" ? input : {};
  const chatId = normalizeChatId(src.chatId);
  const text = String(src.text ?? "").trim();
  if (!text) throw new Error("text is required");
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`text exceeds ${MAX_TEXT_LENGTH} characters`);
  }
  return { chatId, text };
}

module.exports = {
  SESSION_NAME,
  WAHA_STATUSES,
  MAX_TEXT_LENGTH,
  MAX_INBOUND_TEXT_LENGTH,
  MIRRORED_EVENTS,
  ACK_NAMES,
  normalizeChatId,
  isDirectChat,
  isGroupChat,
  docIdForMessage,
  projectSession,
  projectQr,
  verifyWebhookSignature,
  isMirrorableEvent,
  chatIdFromPayload,
  buildMessageMirror,
  buildChatSummary,
  whatsappRetentionCutoff,
  sendGuard,
};
