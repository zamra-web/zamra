/**
 * whatsapp/index.js — the WAHA integration's Cloud Functions.
 *
 * Two surfaces:
 *
 *  - Admin callables, gated on the `admin` claim, that the /admin/whatsapp tab
 *    uses to pair the number and send a message. These are a WHITELIST, not a
 *    generic proxy: every WAHA response goes through a projection in
 *    normalize.js before it reaches the browser, because GET /api/sessions
 *    returns our own webhook signing secret inside the session config.
 *
 *  - whatsappWebhook, a public onRequest endpoint WAHA posts events to. It is
 *    authenticated by HMAC-SHA512 over the raw request body and mirrors
 *    messages into Firestore so the dashboard inbox can read them live.
 *
 * Messaging LOGIC — auto-replies, AI answers, scheduled broadcasts — lives in
 * n8n on the same VPS, reaching WAHA over the internal Docker network. Nothing
 * here should grow into a bulk sender; see the note on sendWhatsappMessage.
 */

"use strict";

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const { wahaFetch, WahaError } = require("./client");
const rateIntakeModule = require("./rateIntake");
const {
  SESSION_NAME,
  projectSession,
  projectQr,
  verifyWebhookSignature,
  isMirrorableEvent,
  buildMessageMirror,
  buildChatSummary,
  docIdForMessage,
  sendGuard,
} = require("./normalize");

const REGION = "asia-south1";
const CONFIG_DOC = "config/whatsapp";
const MESSAGES_COLLECTION = "whatsapp_messages";
const CHATS_COLLECTION = "whatsapp_chats";
const META_COLLECTION = "whatsapp_meta";

/** Session lifecycle verbs the dashboard may invoke. */
const SESSION_ACTIONS = Object.freeze(["start", "stop", "restart", "logout"]);

/** Events WAHA is asked to deliver. Everything else is dropped on receipt. */
const SUBSCRIBED_EVENTS = Object.freeze(["message", "message.any", "message.ack", "session.status"]);

const DEFAULT_RETENTION_DAYS = 90;
/** Outbound ceiling per minute. Not a business limit — a runaway-loop brake. */
const SEND_RATE_LIMIT_PER_MINUTE = 20;
/** Cap deletions per maintenance run so one backlog day cannot blow the timeout. */
const PURGE_LIMIT = 2000;

/**
 * @param {unknown} secret a defineSecret param, or a plain string in tests
 * @returns {string}
 */
function secretValue(secret) {
  if (!secret) return "";
  return typeof secret === "object" && typeof secret.value === "function" ? secret.value() : String(secret);
}

/**
 * Map an upstream WAHA failure onto a callable error without echoing the
 * upstream body, which repeats the request config back to the caller.
 *
 * @param {unknown} error
 * @returns {HttpsError}
 */
function toHttpsError(error) {
  if (error instanceof HttpsError) return error;
  if (error instanceof WahaError) {
    console.error("WAHA call failed:", error.status, error.message, JSON.stringify(error.body ?? null));
    if (error.status === 401 || error.status === 403) {
      return new HttpsError("failed-precondition", "WAHA rejected our API key. Check the WAHA_API_KEY secret.");
    }
    if (error.status === 404) {
      return new HttpsError("not-found", "No WhatsApp session exists yet. Use Connect to create one.");
    }
    if (error.status === 504 || error.status === 502) {
      return new HttpsError("unavailable", "WAHA is not reachable. Check the container on the VPS.");
    }
    return new HttpsError("internal", "WAHA rejected the request.");
  }
  console.error("WhatsApp function error:", error);
  return new HttpsError("internal", "Something went wrong talking to WhatsApp.");
}

/**
 * Build the WhatsApp Cloud Functions.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @param {(request: object) => void} requireAdmin
 * @param {object|string} wahaApiKey       WAHA_API_KEY secret
 * @param {object|string} wahaWebhookSecret WAHA_WEBHOOK_SECRET secret
 * @returns {object} the exported functions plus purgeExpiredWhatsapp
 */
function build(db, requireAdmin, wahaApiKey, wahaWebhookSecret, n8nIngestToken) {
  // Only real defineSecret params can be bound; tests inject plain strings.
  const secrets = [wahaApiKey, wahaWebhookSecret].filter((s) => s && typeof s === "object");
  const callOptions = { region: REGION, secrets, maxInstances: 5 };

  /** @returns {Promise<object>} the config/whatsapp doc, with defaults applied */
  async function readConfig() {
    const snap = await db.doc(CONFIG_DOC).get();
    const data = snap.exists ? snap.data() || {} : {};
    return {
      mirrorGroups: data.mirrorGroups === true,
      retentionDays: Number.isFinite(Number(data.retentionDays)) ? Number(data.retentionDays) : DEFAULT_RETENTION_DAYS,
      ...data,
      // Explicit opt-in, and after the spread so a missing field can never read
      // as enabled. Automatic fare ingestion must be switched on deliberately.
      rateIntakeEnabled: data.rateIntakeEnabled === true,
      rateIntakeAutoReply: data.rateIntakeAutoReply === true,
    };
  }

  const rateIntake = rateIntakeModule.build(db, {
    readConfig,
    n8nToken: n8nIngestToken,
    messagesCollection: MESSAGES_COLLECTION,
    configDoc: CONFIG_DOC,
  });

  // ── admin callables ───────────────────────────────────────────────────────

  const getWhatsappSessionStatus = onCall(callOptions, async (request) => {
    requireAdmin(request);
    try {
      const { body } = await wahaFetch(secretValue(wahaApiKey), "GET", `/api/sessions/${SESSION_NAME}`);
      const session = projectSession(body);

      // Cache it so the tab can paint a status pill before the first poll.
      await db.doc(CONFIG_DOC).set({
        sessionName: session.name,
        sessionStatus: session.status,
        sessionStatusAt: FieldValue.serverTimestamp(),
        me: session.me,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      return session;
    } catch (error) {
      if (error instanceof WahaError && error.status === 404) {
        return { name: SESSION_NAME, status: "STOPPED", engine: null, me: null, assignedWorker: null, exists: false };
      }
      throw toHttpsError(error);
    }
  });

  const getWhatsappQr = onCall(callOptions, async (request) => {
    requireAdmin(request);
    try {
      const { body } = await wahaFetch(secretValue(wahaApiKey), "GET", `/api/${SESSION_NAME}/auth/qr`);
      const qr = projectQr(body);
      if (!qr) throw new HttpsError("failed-precondition", "No QR code available. The session may already be linked.");
      return qr;
    } catch (error) {
      throw toHttpsError(error);
    }
  });

  // One callable, four verbs. Four separate callables would be four Cloud Run
  // services and four cold starts for no benefit.
  const setWhatsappSessionState = onCall(callOptions, async (request) => {
    requireAdmin(request);
    const action = String(request.data?.action ?? "");
    if (!SESSION_ACTIONS.includes(action)) {
      throw new HttpsError("invalid-argument", `action must be one of: ${SESSION_ACTIONS.join(", ")}`);
    }
    try {
      await wahaFetch(secretValue(wahaApiKey), "POST", `/api/sessions/${SESSION_NAME}/${action}`);
      const { body } = await wahaFetch(secretValue(wahaApiKey), "GET", `/api/sessions/${SESSION_NAME}`);
      const session = projectSession(body);
      await db.doc(CONFIG_DOC).set({
        sessionStatus: session.status,
        sessionStatusAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return { ok: true, ...session };
    } catch (error) {
      throw toHttpsError(error);
    }
  });

  /**
   * Create (or repair) the session with the webhook WAHA must call back on.
   *
   * This is why the session is never created by hand: a hand-curled session
   * carries no webhook URL and no HMAC key, so inbound messages vanish with no
   * error anywhere.
   */
  const ensureWhatsappSession = onCall(callOptions, async (request) => {
    requireAdmin(request);

    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "zamra-web-01";
    const webhookUrl = `https://${REGION}-${projectId}.cloudfunctions.net/whatsappWebhook`;
    const payload = {
      name: SESSION_NAME,
      start: true,
      config: {
        webhooks: [{
          url: webhookUrl,
          events: [...SUBSCRIBED_EVENTS],
          hmac: { key: secretValue(wahaWebhookSecret) },
          retries: { policy: "linear", delaySeconds: 2, attempts: 3 },
        }],
        // NOWEB needs the store on to expose chats/contacts/history at all.
        // fullSync would pull a year of an aged business number's history for
        // no benefit — the mirror only cares about messages from link time on.
        // Neither value may change after the QR is scanned: WAHA loses history.
        noweb: { store: { enabled: true, fullSync: false } },
      },
    };

    const apiKey = secretValue(wahaApiKey);
    let body;
    try {
      ({ body } = await wahaFetch(apiKey, "POST", "/api/sessions", payload));
    } catch (error) {
      // Already exists — update it so a config change still lands.
      if (error instanceof WahaError && (error.status === 409 || error.status === 422)) {
        ({ body } = await wahaFetch(apiKey, "PUT", `/api/sessions/${SESSION_NAME}`, { config: payload.config })
          .catch((e) => { throw toHttpsError(e); }));
      } else {
        throw toHttpsError(error);
      }
    }

    const session = projectSession(body);
    await db.doc(CONFIG_DOC).set({
      sessionName: SESSION_NAME,
      sessionStatus: session.status,
      sessionStatusAt: FieldValue.serverTimestamp(),
      webhookUrl,
      subscribedEvents: [...SUBSCRIBED_EVENTS],
      mirrorGroups: false,
      retentionDays: DEFAULT_RETENTION_DAYS,
      updatedAt: FieldValue.serverTimestamp(),
      // NOTE: the WAHA API key is deliberately absent. This doc is
      // admin-readable from the browser; putting the key here would defeat the
      // entire point of proxying WAHA through these callables.
    }, { merge: true });

    return session;
  });

  /**
   * Send one text message.
   *
   * There is no bulk variant and there must never be one. Broadcasting from a
   * single number is what gets it banned, so pacing belongs in n8n where the
   * delays and jitter live. The per-minute counter here is a brake on a runaway
   * loop, not a business rule.
   */
  const sendWhatsappMessage = onCall(callOptions, async (request) => {
    requireAdmin(request);

    let chatId; let text;
    try {
      ({ chatId, text } = sendGuard(request.data));
    } catch (error) {
      throw new HttpsError("invalid-argument", error.message);
    }

    const minuteKey = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
    const rateRef = db.collection(META_COLLECTION).doc(`rate-${minuteKey}`);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(rateRef);
      const sent = snap.exists ? Number(snap.data()?.sent || 0) : 0;
      if (sent >= SEND_RATE_LIMIT_PER_MINUTE) {
        throw new HttpsError("resource-exhausted", "Too many messages this minute. Wait and retry.");
      }
      tx.set(rateRef, {
        sent: sent + 1,
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      }, { merge: true });
    });

    let body;
    try {
      ({ body } = await wahaFetch(secretValue(wahaApiKey), "POST", "/api/sendText", {
        session: SESSION_NAME, chatId, text,
      }));
    } catch (error) {
      throw toHttpsError(error);
    }

    const messageId = String(body?.id?._serialized || body?.id || "");
    const now = new Date();

    // Mirror the outbound message under the WAHA message id. WAHA will also
    // fire message.any for this same id moments later; sharing the doc id makes
    // that a merge instead of a duplicate.
    if (messageId) {
      const auth = request.auth || {};
      const mirror = buildMessageMirror({
        event: "message", session: SESSION_NAME,
        payload: { id: messageId, timestamp: Math.floor(now.getTime() / 1000), from: "", to: chatId, fromMe: true, body: text },
      }, { now, retentionDays: DEFAULT_RETENTION_DAYS });

      await writeMirror(mirror, {
        sentBy: { uid: auth.uid || null, email: auth.token?.email || null },
      });
    }

    return { messageId, chatId };
  });

  // ── mirror writes, shared by the send path and the webhook ────────────────

  /**
   * @param {object} mirror  output of buildMessageMirror
   * @param {object} [extra] fields only the send path knows
   */
  async function writeMirror(mirror, extra = {}) {
    const docId = docIdForMessage(mirror.messageId);
    const batch = db.batch();

    batch.set(db.collection(MESSAGES_COLLECTION).doc(docId), {
      ...mirror,
      ...extra,
      timestamp: Timestamp.fromDate(mirror.timestamp),
      expiresAt: Timestamp.fromDate(mirror.expiresAt),
      receivedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    const summary = buildChatSummary(mirror);
    batch.set(db.collection(CHATS_COLLECTION).doc(summary.chatId), {
      ...summary,
      lastMessageAt: Timestamp.fromDate(mirror.timestamp),
      messageCount: FieldValue.increment(1),
      // Only an inbound message is unread. Everything else here is derived, so
      // the merge never clobbers assignedTo / status / tags.
      ...(mirror.fromMe ? {} : { unreadCount: FieldValue.increment(1) }),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    await batch.commit();
  }

  /** Update an existing message's delivery ack. Must never create a doc. */
  async function applyAck(mirror) {
    const docId = docIdForMessage(mirror.messageId);
    const ref = db.collection(MESSAGES_COLLECTION).doc(docId);
    const snap = await ref.get();
    // An ack for a message we never mirrored must not conjure a phantom.
    if (!snap.exists) return false;
    await ref.set({ ack: mirror.ack, ackName: mirror.ackName }, { merge: true });
    return true;
  }

  // ── webhook ───────────────────────────────────────────────────────────────

  const whatsappWebhook = onRequest(
    // cors:false — a webhook has no browser caller. The public onRequest
    // endpoints in this project set cors:true because pages fetch them; doing
    // that here would be wrong.
    { region: REGION, cors: false, secrets, maxInstances: 10, memory: "256MiB" },
    async (req, res) => {
      if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

      // The digest must cover the RAW bytes. JSON.stringify(req.body) re-emits
      // canonical JSON and will never byte-match what WAHA signed.
      const ok = verifyWebhookSignature(
        req.rawBody,
        req.get("X-Webhook-Hmac"),
        req.get("X-Webhook-Hmac-Algorithm"),
        secretValue(wahaWebhookSecret),
      );
      if (!ok) {
        // Nothing but the event name — a detailed body is an oracle, and this
        // endpoint writes to Firestore.
        console.warn("whatsappWebhook: rejected unsigned or mis-signed request", {
          event: String(req.body?.event || "unknown"),
        });
        return res.status(401).send("Unauthorized");
      }

      const event = req.body || {};
      try {
        const config = await readConfig();

        if (event.event === "session.status") {
          await db.doc(CONFIG_DOC).set({
            sessionStatus: String(event.payload?.status || "UNKNOWN"),
            sessionStatusAt: FieldValue.serverTimestamp(),
            lastWebhookAt: FieldValue.serverTimestamp(),
            lastWebhookEvent: "session.status",
            updatedAt: FieldValue.serverTimestamp(),
          }, { merge: true });
          return res.status(200).json({ ok: true });
        }

        // Supplier announcement groups mirror even with mirrorGroups off — but
        // only while intake is switched on, since reading rate sheets is the
        // only reason to store that traffic at all. With the master toggle off
        // the allow-list is not even consulted and the feature stays fully dark.
        const mirrorGroupIds = config.rateIntakeEnabled
          ? await rateIntake.intakeGroupIds(config)
          : null;

        if (!isMirrorableEvent(event, { mirrorGroups: config.mirrorGroups, mirrorGroupIds })) {
          // 200, not 4xx: a rejection would sit in WAHA's retry queue forever
          // for events we simply do not store.
          await db.doc(CONFIG_DOC).set({
            [`droppedEventCounts.${String(event.event || "unknown").replace(/\./g, "_")}`]: FieldValue.increment(1),
            lastWebhookAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          }, { merge: true });
          return res.status(200).json({ ok: true, mirrored: false });
        }

        const mirror = buildMessageMirror(event, { retentionDays: config.retentionDays });

        if (event.event === "message.ack") {
          await applyAck(mirror);
        } else {
          // Rate-intake flags ride along on the mirror write, and ONLY on the
          // "message" event. WAHA fires message.any for the same id into the
          // same document moments later; merging "pending" a second time would
          // reset an already-claimed message and ingest the sheet twice.
          const intake = event.event === "message"
            ? await rateIntake.intakeFieldsFor(mirror, config)
            : null;
          await writeMirror(mirror, intake || {});
        }

        await db.doc(CONFIG_DOC).set({
          lastWebhookAt: FieldValue.serverTimestamp(),
          lastWebhookEvent: String(event.event),
          ...(mirror.fromMe || event.event === "message.ack" ? {} : { unreadTotal: FieldValue.increment(1) }),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });

        return res.status(200).json({ ok: true, mirrored: true });
      } catch (error) {
        console.error("whatsappWebhook failed:", error);
        // 500 so WAHA retries a genuine transient failure.
        return res.status(500).json({ ok: false });
      }
    },
  );

  // ── retention, folded into dailyMaintenance ───────────────────────────────

  /**
   * Delete mirrored messages past their expiry, and spent rate-limit counters.
   *
   * Called from dailyMaintenance rather than its own onSchedule: Google bills
   * per Cloud Scheduler job beyond the first three, and this project runs
   * exactly three on purpose. Chats are never purged — they are the CRM value
   * and they are tiny.
   *
   * @returns {Promise<{deletedMessages: number, deletedRateDocs: number}>}
   */
  async function purgeExpiredWhatsapp(now = new Date()) {
    const cutoff = Timestamp.fromDate(now);
    let deletedMessages = 0;
    let deletedRateDocs = 0;

    const messages = await db.collection(MESSAGES_COLLECTION)
      .where("expiresAt", "<", cutoff).limit(PURGE_LIMIT).get();
    for (let i = 0; i < messages.docs.length; i += 400) {
      const batch = db.batch();
      messages.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deletedMessages += Math.min(400, messages.docs.length - i);
    }

    const rateDocs = await db.collection(META_COLLECTION)
      .where("expiresAt", "<", cutoff).limit(PURGE_LIMIT).get();
    for (let i = 0; i < rateDocs.docs.length; i += 400) {
      const batch = db.batch();
      rateDocs.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deletedRateDocs += Math.min(400, rateDocs.docs.length - i);
    }

    const { deletedRateBatches } = await rateIntake.purgeExpiredRateBatches(now);

    return { deletedMessages, deletedRateDocs, deletedRateBatches };
  }

  return {
    getWhatsappSessionStatus,
    getWhatsappQr,
    setWhatsappSessionState,
    ensureWhatsappSession,
    sendWhatsappMessage,
    whatsappWebhook,
    whatsappRateIntakeForN8n: rateIntake.rateIntakeForN8n,
    purgeExpiredWhatsapp,
    rateIntake,
  };
}

module.exports = {
  build,
  SESSION_ACTIONS,
  SUBSCRIBED_EVENTS,
  DEFAULT_RETENTION_DAYS,
  SEND_RATE_LIMIT_PER_MINUTE,
  MESSAGES_COLLECTION,
  CHATS_COLLECTION,
  CONFIG_DOC,
};
