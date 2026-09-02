/**
 * Rate-intake decision rules — the pure half.
 *
 * No Firestore, no network, no firebase-functions. Everything here is a
 * function of its arguments, which is what lets the interesting decisions
 * (is this a rate sheet? do these six messages belong together? is this media
 * URL safe to fetch?) be tested without a project.
 *
 * The stateful half lives in rateIntake.js.
 */

"use strict";

const { isDirectChat, isGroupChat } = require("./normalize");

// ── tuning defaults ─────────────────────────────────────────────────────────
// Overridable from config/whatsapp; these are the values a missing config
// falls back to, and the values the tests pin.

const DEFAULT_QUIET_MS = 90 * 1000;
const DEFAULT_MAX_HOLD_MS = 20 * 60 * 1000;
const DEFAULT_MAX_ITEMS = 12;

/** Vision models here take images only. A voice note or PDF is not a rate sheet. */
const INGESTIBLE_MEDIA_RE = /^image\/(jpeg|jpg|png|gif|webp)$/i;

/**
 * The same band `Build Firebase Payload` enforces in n8n (₹1,000–99,999),
 * written either plainly (`44000`) or with a thousands comma (`44,000`).
 * Matching it here means the gate and the validator agree about what a fare
 * looks like, so a message that passes this cannot be rejected downstream for
 * having no plausible prices in it.
 *
 * The comma alternative is not cosmetic. Travel Wallet writes most of its sheet
 * that way and Jubair mixes both styles, so without it a per-sector update like
 * "06 SEP : 46,700/-" carries no price token at all and is dropped as chatter —
 * silently, because looksLikeRateMessage runs before the sender check and so
 * records no rateIntakeSeenSender to show in the dashboard. A supplier's whole
 * house style can fail this way without producing one visible symptom.
 *
 * A 10-digit phone number still does not match: \b..\b anchors on the whole run
 * of digits, so "9846606731" yields nothing rather than a false price.
 */
const RATE_TOKEN_RE = /\b\d{1,2},\d{3}\b|\b\d{4,5}\b/g;

/**
 * A three-letter uppercase token — an airport code, or a month like MAR. Rate
 * messages always carry at least one; ordinary prose almost never does.
 */
const ROUTE_TOKEN_RE = /\b[A-Z]{3}\b/;

const INTAKE_MODES = ["auto", "images_only", "off"];

/**
 * Does this message look like part of a rate sheet?
 *
 * Deliberately cheap and deliberately conservative. Its only job is to keep
 * "ok bro" from spending a vision call; it is not a parser, and it is not the
 * thing that decides what reaches agent_fares — the closed sector/airline
 * vocabulary in n8n does that.
 *
 * Note the asymmetry with groupPendingMessages: only ONE message in a window
 * has to pass this for the window to be claimed. Ordinary chatter alongside a
 * real sheet then rides along as context, which is what you want — a supplier
 * who writes "revised rates 👇" on its own line is giving the model a useful
 * hint, not noise.
 *
 * @param {{body?: string, hasMedia?: boolean, mimetype?: string}} message
 * @param {{mode?: string}} [options]
 * @returns {boolean}
 */
function looksLikeRateMessage(message, { mode = "auto" } = {}) {
  const resolvedMode = INTAKE_MODES.includes(mode) ? mode : "off";
  if (resolvedMode === "off") return false;

  const src = message && typeof message === "object" ? message : {};

  if (src.hasMedia && INGESTIBLE_MEDIA_RE.test(String(src.mimetype ?? ""))) {
    return true;
  }

  // images_only exists for suppliers who screenshot their sheets and chat in
  // the same thread. Their prose never qualifies, so a conversation about
  // seat availability can't be mistaken for a rate sheet.
  if (resolvedMode === "images_only") return false;

  // One price AND one route-ish token. The first draft of this demanded 40+
  // characters and two prices, which reads like a rate sheet but is not how
  // suppliers actually message: "CCJ JED IX / 04 MAR 15500" is 23 characters
  // with a single price, and was being thrown away.
  //
  // The bar is deliberately low for text because the costs are asymmetric. A
  // text-only extraction is one or two thousand tokens — a fraction of a cent —
  // while a detail:high screenshot is the real expense. And a false positive is
  // nearly free: the closed sector/airline vocabulary downstream rejects
  // anything that is not a real route, and the batch completes with saved: 0.
  const body = String(src.body ?? "");
  const hasRate = (body.match(RATE_TOKEN_RE) || []).length >= 1;
  return hasRate && ROUTE_TOKEN_RE.test(body);
}

/**
 * Reduce a WAHA media URL to the path n8n may fetch, or null.
 *
 * This is a security boundary, not tidiness. Two facts make it one:
 *
 *  1. WAHA builds media.url from WHATSAPP_API_HOSTNAME, which our deployment
 *     never sets — so the stored value is literally "http://localhost:3000/...",
 *     meaningless to anything outside that container. The host must be
 *     replaced, so it may as well be dropped here.
 *  2. n8n shares the n8n_default Docker network with Traefik and WAHA. A URL
 *     followed verbatim by the download node is an SSRF primitive aimed at
 *     http://n8n:5678/rest/... from inside the trusted network — and the value
 *     originates in a webhook payload.
 *
 * So: allow-list the path, never the host. Query and fragment are stripped
 * rather than preserved, because a "?x-api-key=" riding along would otherwise
 * be echoed into the admin panel.
 *
 * @param {string} mediaUrl
 * @returns {string|null} e.g. "/api/files/false_9198…_3EB0.jpg"
 */
function wahaMediaPath(mediaUrl) {
  const raw = String(mediaUrl ?? "").trim();
  if (!raw) return null;

  // A protocol-relative "//evil.com/api/files/x.jpg" would resolve against the
  // base below and pass the prefix test with a foreign host, so reject the
  // shape outright rather than relying on the parse.
  if (raw.startsWith("//")) return null;

  let parsed;
  try {
    // A base is supplied so a bare path parses; an absolute URL ignores it.
    parsed = new URL(raw, "http://waha.invalid");
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  // URL normalises "/api/files/../../etc/passwd" to "/etc/passwd" before this
  // test, so traversal fails the prefix check rather than needing its own rule.
  const pathname = parsed.pathname;
  if (!pathname.startsWith("/api/files/")) return null;
  if (pathname.length <= "/api/files/".length) return null;
  if (pathname.includes("..")) return null;

  return pathname;
}

/**
 * Is this string usable as a Firestore document id?
 *
 * Firestore rejects "." and "..", anything matching __*__, slashes, and ids
 * over 1500 bytes — and it rejects them by THROWING inside the client, not by
 * returning an empty snapshot. Without this guard a malformed batchId turns a
 * "no such batch" answer into a 500, which n8n's Complete Batch node then
 * retries three times for something that can never succeed.
 *
 * docIdForMessage() in normalize.js guards the same cases for message ids.
 *
 * @param {string} value
 * @returns {boolean}
 */
function isUsableDocId(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw.length > 1500) return false;
  if (raw.includes("/")) return false;
  if (raw === "." || raw === "..") return false;
  if (/^__.*__$/.test(raw)) return false;
  return true;
}

/**
 * Is this message's sender one of the addresses this supplier is verified on?
 *
 * The whole reason group intake is safe. A direct chat needs no such check —
 * the chat id IS the sender, and matching it already identified the supplier.
 * A group is the opposite: membership says nothing about who typed, so linking
 * a community would otherwise mean trusting every member of it to set Zamra's
 * selling prices.
 *
 * Fails closed in every ambiguous case. An unresolvable sender returns false
 * rather than falling back to the group's owner, because "we could not tell who
 * sent this" and "the supplier sent this" must never collapse into each other —
 * that collapse is exactly how a member's forwarded screenshot would get
 * ingested under the supplier's commission.
 *
 * @param {string|null} sender    canonical address from senderFromPayload
 * @param {{chatId?: string|null, senderIds?: Array<string>}} supplier
 * @returns {boolean}
 */
function isVerifiedSender(sender, supplier) {
  const address = String(sender ?? "").trim().toLowerCase();
  if (!address) return false;

  const src = supplier && typeof supplier === "object" ? supplier : {};
  // The supplier's own WhatsApp number counts without being restated: an admin
  // who linked the number and the group should not have to type the number
  // twice for the obvious case to work.
  if (address === String(src.chatId ?? "").trim().toLowerCase()) return true;

  const extra = Array.isArray(src.senderIds) ? src.senderIds : [];
  return extra.some((entry) => String(entry ?? "").trim().toLowerCase() === address);
}

/**
 * Group pending messages into claimable batches, one per chat.
 *
 * The batch is derived here rather than accumulated in a queue document, and
 * that is the whole trick. Six screenshots three seconds apart are one batch
 * because they share a chatId — not because they happened to land in the same
 * time bucket. A bucketing scheme would split 11:59:58 from 12:00:02, which is
 * exactly the "one sheet, six vision calls" failure this exists to prevent.
 *
 * Group chats are grouped by chat AND supplier, never chat alone. Only verified
 * senders reach this function, so in the announcement groups this was built for
 * the two keys are the same thing — but if a group ever resolves to two
 * suppliers, the extra key splits them into separate batches instead of merging
 * two rate sheets into one vision call filed under whichever arrived first.
 *
 * A chat is released when any of these is true, checked in order:
 *   quiet     — nothing new for quietMs; the supplier has stopped typing
 *   max-hold  — the oldest message is older than maxHoldMs; a supplier who
 *               drips a line every minute still gets ingested eventually
 *   max-items — the window is full; the rest wait for the next pass
 *
 * @param {Array<object>} messages  flattened pending docs, any order
 * @param {object} options
 * @returns {Array<object>} one entry per releasable chat, oldest chat first
 */
function groupPendingMessages(messages, {
  now = new Date(),
  quietMs = DEFAULT_QUIET_MS,
  maxHoldMs = DEFAULT_MAX_HOLD_MS,
  maxItems = DEFAULT_MAX_ITEMS,
} = {}) {
  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const byChat = new Map();

  for (const message of Array.isArray(messages) ? messages : []) {
    const chatId = String(message?.chatId ?? "").toLowerCase();
    const agentId = String(message?.rateIntakeAgentId ?? "");
    // A message with no resolvable supplier is not ingestable, and an address
    // that is neither a direct chat nor a group must never reach here even if
    // some upstream check is later relaxed.
    if (!chatId || !agentId) continue;
    if (!isDirectChat(chatId) && !isGroupChat(chatId)) continue;
    const key = `${chatId}|${agentId}`;
    if (!byChat.has(key)) byChat.set(key, []);
    byChat.get(key).push(message);
  }

  const batches = [];

  for (const [key, items] of byChat) {
    const chatId = key.slice(0, key.lastIndexOf("|"));
    // Oldest first, so raw_text reads in the order the supplier typed it — a
    // sector header above its own rate lines, which is what the model expects.
    items.sort((a, b) => toMs(a?.timestamp) - toMs(b?.timestamp));

    const firstAt = toMs(items[0]?.timestamp);
    const lastAt = toMs(items[items.length - 1]?.timestamp);

    const quiet = nowMs - lastAt >= quietMs;
    const held = nowMs - firstAt >= maxHoldMs;
    const full = items.length >= maxItems;
    if (!quiet && !held && !full) continue;

    const window = items.slice(0, maxItems);
    batches.push({
      chatId,
      agentId: String(window[0]?.rateIntakeAgentId ?? ""),
      messages: window,
      messageIds: window.map((m) => String(m?.messageId ?? m?.id ?? "")).filter(Boolean),
      firstAt: new Date(toMs(window[0]?.timestamp)),
      lastAt: new Date(toMs(window[window.length - 1]?.timestamp)),
      truncated: items.length > window.length,
      reason: quiet ? "quiet" : (held ? "max-hold" : "max-items"),
    });
  }

  // Oldest chat first, so a backlog drains in the order it arrived rather than
  // by whatever order Firestore handed the documents back.
  batches.sort((a, b) => a.firstAt - b.firstAt);
  return batches;
}

/** Accept a Firestore Timestamp, a Date, or an ISO string. */
function toMs(value) {
  if (!value) return 0;
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Flatten a batch's messages into the shape the zamra-rates webhook takes.
 *
 * @param {Array<object>} messages  oldest first
 * @returns {{rawText: string, media: Array<object>}}
 */
function buildIntakePayload(messages) {
  const lines = [];
  const media = [];
  const seenPaths = new Set();

  for (const message of Array.isArray(messages) ? messages : []) {
    const body = String(message?.body ?? "").trim();
    if (body) lines.push(body);

    if (!message?.hasMedia) continue;
    const mimetype = String(message?.mimetype ?? "");
    if (!INGESTIBLE_MEDIA_RE.test(mimetype)) continue;

    const path = wahaMediaPath(message?.mediaUrl);
    // Same image delivered twice (message + message.any raced a doc rewrite)
    // would otherwise cost a second detail:high vision tile for no new pixels.
    if (!path || seenPaths.has(path)) continue;
    seenPaths.add(path);

    media.push({
      messageId: String(message?.messageId ?? ""),
      path,
      mimetype: mimetype.toLowerCase() === "image/jpg" ? "image/jpeg" : mimetype.toLowerCase(),
      capturedAt: new Date(toMs(message?.timestamp)).toISOString(),
    });
  }

  return { rawText: lines.join("\n"), media };
}

module.exports = {
  looksLikeRateMessage,
  isUsableDocId,
  wahaMediaPath,
  isVerifiedSender,
  groupPendingMessages,
  buildIntakePayload,
  INTAKE_MODES,
  INGESTIBLE_MEDIA_RE,
  DEFAULT_QUIET_MS,
  DEFAULT_MAX_HOLD_MS,
  DEFAULT_MAX_ITEMS,
};
