/**
 * WhatsApp → agent_fares rate intake.
 *
 * A supplier WhatsApps their rate sheet; the fares appear in the Database tab
 * with no human retyping them. This module is the stateful half — Firestore
 * reads, the lease, the endpoint. The decisions live in rateIntakeRules.js.
 *
 * The design in one line: THE BATCH IS NOT A QUEUE DOCUMENT. Every inbound
 * message is already one document in whatsapp_messages with exactly one writer,
 * so intake adds three fields to a write that was happening anyway and groups
 * them by chatId at claim time. An append-to-items[] queue doc would be a hot
 * document, would need a transaction on the webhook hot path, and — because it
 * would have to bucket by time — would split one supplier's screenshot burst
 * across two vision calls, which is the exact failure this exists to prevent.
 *
 * Messaging logic still belongs in n8n. This is plumbing: flag, lease, hand
 * over, record. The extraction is the existing zamra-rates workflow, unchanged.
 */

"use strict";

const { onRequest } = require("firebase-functions/v2/https");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const { verifyN8nBearer } = require("../n8nAuth");
const { isDirectChat } = require("./normalize");
const {
  looksLikeRateMessage,
  groupPendingMessages,
  buildIntakePayload,
  isUsableDocId,
  INTAKE_MODES,
  DEFAULT_QUIET_MS,
  DEFAULT_MAX_HOLD_MS,
  DEFAULT_MAX_ITEMS,
} = require("./rateIntakeRules");

const REGION = "asia-south1";
const BATCHES_COLLECTION = "whatsapp_rate_batches";
const AGENTS_COLLECTION = "agents";

/** How long a claimed batch may stay claimed before it is called stale. */
const DEFAULT_LEASE_MINUTES = 15;
/** Per-chat vision-call ceiling per day. A runaway-cost brake, not a policy. */
const DEFAULT_MAX_BATCHES_PER_CHAT_PER_DAY = 12;
/** Batch docs are an audit trail, not data. 60 days is plenty. */
const BATCH_RETENTION_DAYS = 60;
/** WAHA's WHATSAPP_FILES_LIFETIME is 7 days; warn n8n a day before that. */
const MEDIA_LIKELY_EXPIRED_DAYS = 6;

const SUPPLIER_CACHE_MS = 5 * 60 * 1000;
const CLAIM_CANDIDATE_LIMIT = 300;
const PURGE_LIMIT = 1000;

const TERMINAL_STATUSES = Object.freeze(["done", "failed", "empty", "discarded"]);

function futureTimestamp(ms) {
  return Timestamp.fromDate(new Date(Date.now() + ms));
}

/**
 * @param {FirebaseFirestore.Firestore} db
 * @param {object} deps
 * @param {() => Promise<object>} deps.readConfig  config/whatsapp with defaults
 * @param {object|string} deps.n8nToken            N8N_INGEST_TOKEN secret
 * @param {string} deps.messagesCollection
 * @param {string} deps.configDoc
 */
function build(db, { readConfig, n8nToken, messagesCollection, configDoc }) {
  // ── supplier lookup ───────────────────────────────────────────────────────

  let supplierCache = null;
  let supplierCacheAt = 0;

  /**
   * chatId → supplier, cached in module memory for five minutes.
   *
   * Tens of agents, a projected read, on a warm Cloud Run instance: cheaper
   * than maintaining a denormalized index document that can silently drift out
   * of sync with the agents collection.
   *
   * A chat id claimed by two agents resolves to NOTHING. Guessing which
   * supplier's fares these are would attribute them to the wrong commission,
   * which is the wrong selling price on the public site — strictly worse than
   * not ingesting. addAgent/updateAgent already refuse the collision; this is
   * the second line in case one was created before that check existed.
   */
  async function supplierByChatId(chatId) {
    if (!supplierCache || Date.now() - supplierCacheAt > SUPPLIER_CACHE_MS) {
      const snap = await db.collection(AGENTS_COLLECTION)
        .select("whatsappChatId", "isActive", "name", "rateIntakeMode")
        .get();

      const map = new Map();
      const duplicates = new Set();
      snap.forEach((doc) => {
        const data = doc.data() || {};
        const id = String(data.whatsappChatId || "").toLowerCase();
        if (!id || !isDirectChat(id)) return;
        if (map.has(id)) {
          duplicates.add(id);
          return;
        }
        map.set(id, {
          agentId: doc.id,
          name: String(data.name || ""),
          isActive: data.isActive !== false,
          mode: INTAKE_MODES.includes(data.rateIntakeMode) ? data.rateIntakeMode : "off",
        });
      });
      for (const id of duplicates) {
        console.error(`rateIntake: ${id} is claimed by more than one agent; ignoring it entirely.`);
        map.delete(id);
      }

      supplierCache = map;
      supplierCacheAt = Date.now();
    }
    return supplierCache.get(String(chatId ?? "").toLowerCase()) || null;
  }

  /** Drop the cache so a just-saved agent number works without a 5-minute wait. */
  function invalidateSupplierCache() {
    supplierCache = null;
  }

  // ── the webhook hook ──────────────────────────────────────────────────────

  /**
   * Decide the intake fields for one mirrored inbound message.
   *
   * Returns `null` when nothing should be written, so the caller can spread the
   * result into writeMirror's `extra` and leave the document untouched
   * otherwise. It never writes: the point is to ride along on the mirror write
   * the webhook was already doing.
   *
   * @returns {Promise<object|null>}
   */
  async function intakeFieldsFor(mirror, config) {
    if (!config?.rateIntakeEnabled) return null;
    if (!mirror || mirror.fromMe || mirror.isGroup) return null;
    // Independent of mirrorGroups on purpose: flipping that config on to mirror
    // Zamra's community groups must not also open an ingestion path.
    if (!isDirectChat(mirror.chatId)) return null;

    const supplier = await supplierByChatId(mirror.chatId);
    if (!supplier) return null;

    // ingestFaresFromN8n sets isHidden from row.show and never consults
    // agents.isActive, so ingesting for a deactivated supplier would publish
    // visible fares for a supplier someone deliberately switched off.
    if (!supplier.isActive) {
      return {
        rateIntakeStatus: "skipped",
        rateIntakeAgentId: supplier.agentId,
        rateIntakeReason: "agent-inactive",
        rateIntakeAt: FieldValue.serverTimestamp(),
      };
    }

    if (!looksLikeRateMessage(mirror, { mode: supplier.mode })) return null;

    return {
      rateIntakeStatus: "pending",
      rateIntakeAgentId: supplier.agentId,
      rateIntakeBatchId: null,
      rateIntakeAt: FieldValue.serverTimestamp(),
    };
  }

  // ── claim ─────────────────────────────────────────────────────────────────

  /**
   * Mark leases that never completed as stale. Deliberately does NOT re-queue.
   *
   * social_queue re-queues an expired lease up to MAX_ATTEMPTS, and that is
   * right for a Buffer post. It is wrong here: ingestFaresFromN8n writes a new
   * auto-id document per row and never dedupes, so if n8n ingested forty rows
   * and only the completion call timed out, an automatic retry republishes all
   * forty at whatever price the model read the second time. A human clicking
   * Retry in the admin panel is cheaper than a duplicated public price.
   */
  async function reclaimExpiredLeases(now = new Date()) {
    const snap = await db.collection(BATCHES_COLLECTION)
      .where("status", "==", "claimed")
      .where("leaseExpiresAt", "<=", Timestamp.fromDate(now))
      .orderBy("leaseExpiresAt", "asc")
      .limit(20)
      .get();

    for (const doc of snap.docs) {
      const messageIds = (doc.data() || {}).messageIds || [];
      const batch = db.batch();
      batch.update(doc.ref, {
        status: "stale",
        error: "Lease expired before n8n reported back. Retry or discard from the dashboard.",
        updatedAt: FieldValue.serverTimestamp(),
      });
      // Messages stay "claimed", not "pending": nothing may pick them up again
      // without a human deciding whether the first attempt already landed.
      for (const id of messageIds) {
        batch.set(db.collection(messagesCollection).doc(id), {
          rateIntakeStatus: "stale",
        }, { merge: true });
      }
      await batch.commit();
    }

    return snap.size;
  }

  /** Batches this chat has already had claimed today (UTC). */
  async function claimsToday(chatId, now) {
    const dayStart = Timestamp.fromDate(new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    )));
    const snap = await db.collection(BATCHES_COLLECTION)
      .where("chatId", "==", chatId)
      .where("claimedAt", ">=", dayStart)
      .count()
      .get();
    return snap.data().count || 0;
  }

  /**
   * Lease releasable batches to n8n.
   *
   * The create-and-flip is one db.batch(), so a crash cannot half-claim a
   * group: either the batch document exists and every member points at it, or
   * neither happened.
   */
  async function claimBatches(limit, config, now = new Date()) {
    const quietMs = Number(config.rateIntakeQuietSeconds) > 0
      ? Number(config.rateIntakeQuietSeconds) * 1000 : DEFAULT_QUIET_MS;
    const maxHoldMs = Number(config.rateIntakeMaxHoldMinutes) > 0
      ? Number(config.rateIntakeMaxHoldMinutes) * 60 * 1000 : DEFAULT_MAX_HOLD_MS;
    const maxItems = Number(config.rateIntakeMaxItems) > 0
      ? Number(config.rateIntakeMaxItems) : DEFAULT_MAX_ITEMS;
    const leaseMs = (Number(config.rateIntakeLeaseMinutes) > 0
      ? Number(config.rateIntakeLeaseMinutes) : DEFAULT_LEASE_MINUTES) * 60 * 1000;
    const maxPerChat = Number(config.rateIntakeMaxBatchesPerChatPerDay) > 0
      ? Number(config.rateIntakeMaxBatchesPerChatPerDay) : DEFAULT_MAX_BATCHES_PER_CHAT_PER_DAY;

    const pending = await db.collection(messagesCollection)
      .where("rateIntakeStatus", "==", "pending")
      .orderBy("timestamp", "asc")
      .limit(CLAIM_CANDIDATE_LIMIT)
      .get();

    const candidates = pending.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));
    const groups = groupPendingMessages(candidates, { now, quietMs, maxHoldMs, maxItems });

    const claimed = [];
    const mediaCutoff = now.getTime() - MEDIA_LIKELY_EXPIRED_DAYS * 24 * 60 * 60 * 1000;

    for (const group of groups) {
      if (claimed.length >= limit) break;

      if (await claimsToday(group.chatId, now) >= maxPerChat) {
        console.warn(`rateIntake: ${group.chatId} hit the daily batch cap (${maxPerChat}); holding.`);
        continue;
      }

      const supplier = await supplierByChatId(group.chatId);
      // Re-checked at claim time, not just at flag time: a supplier can be
      // deactivated or unlinked in the minutes a batch sits waiting.
      if (!supplier || !supplier.isActive || supplier.agentId !== group.agentId) {
        const skip = db.batch();
        for (const message of group.messages) {
          skip.set(db.collection(messagesCollection).doc(message.id), {
            rateIntakeStatus: "skipped",
            rateIntakeReason: supplier ? "agent-changed" : "agent-unlinked",
          }, { merge: true });
        }
        await skip.commit();
        continue;
      }

      const { rawText, media } = buildIntakePayload(group.messages);
      if (!rawText && media.length === 0) {
        const skip = db.batch();
        for (const message of group.messages) {
          skip.set(db.collection(messagesCollection).doc(message.id), {
            rateIntakeStatus: "skipped",
            rateIntakeReason: "empty",
          }, { merge: true });
        }
        await skip.commit();
        continue;
      }

      const ref = db.collection(BATCHES_COLLECTION).doc();
      const leaseExpiresAt = futureTimestamp(leaseMs);
      const batch = db.batch();

      batch.set(ref, {
        agentId: supplier.agentId,
        agentName: supplier.name,
        chatId: group.chatId,
        phone: group.chatId.split("@")[0] || "",
        status: "claimed",
        attempt: 1,
        source: "whatsapp",
        reason: group.reason,
        truncated: group.truncated,
        itemCount: group.messages.length,
        imageCount: media.length,
        textLength: rawText.length,
        rawTextPreview: rawText.slice(0, 1000),
        messageIds: group.messages.map((m) => m.id),
        firstMessageAt: Timestamp.fromDate(group.firstAt),
        lastMessageAt: Timestamp.fromDate(group.lastAt),
        claimedAt: FieldValue.serverTimestamp(),
        leaseExpiresAt,
        expiresAt: futureTimestamp(BATCH_RETENTION_DAYS * 24 * 60 * 60 * 1000),
        saved: null,
        error: null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      for (const message of group.messages) {
        batch.set(db.collection(messagesCollection).doc(message.id), {
          rateIntakeStatus: "claimed",
          rateIntakeBatchId: ref.id,
        }, { merge: true });
      }

      await batch.commit();

      claimed.push({
        batchId: ref.id,
        agentId: supplier.agentId,
        agentName: supplier.name,
        chatId: group.chatId,
        attempt: 1,
        reason: group.reason,
        truncated: group.truncated,
        itemCount: group.messages.length,
        leaseExpiresAt: leaseExpiresAt.toDate().toISOString(),
        firstMessageAt: group.firstAt.toISOString(),
        lastMessageAt: group.lastAt.toISOString(),
        rawText,
        media: media.map((item) => ({
          ...item,
          likelyExpired: new Date(item.capturedAt).getTime() < mediaCutoff,
        })),
      });
    }

    return { claimed, pendingChats: groups.length };
  }

  // ── complete ──────────────────────────────────────────────────────────────

  async function completeBatch(payload) {
    const batchId = String(payload.batchId || "").trim();
    if (!batchId) return { ok: false, error: "batchId is required" };
    // Checked before it is used as a document id: Firestore throws on a
    // malformed id rather than returning an empty snapshot, which would turn
    // this 400 into a 500 that n8n retries three times.
    if (!isUsableDocId(batchId)) return { ok: false, error: "unusable batchId" };

    const status = ["done", "failed", "empty"].includes(payload.status) ? payload.status : "failed";
    const ref = db.collection(BATCHES_COLLECTION).doc(batchId);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "unknown batchId" };

    const data = snap.data() || {};
    // Idempotent: n8n retries the completion call, and a retry must not
    // re-stamp a batch a human may already have acted on.
    if (TERMINAL_STATUSES.includes(data.status)) {
      return { ok: true, alreadyCompleted: true, status: data.status };
    }

    const saved = Number.isFinite(Number(payload.saved)) ? Number(payload.saved) : 0;
    const messageIds = data.messageIds || [];

    const batch = db.batch();
    batch.update(ref, {
      status,
      saved,
      notes: String(payload.notes || "").slice(0, 500),
      rejected: Array.isArray(payload.rejected) ? payload.rejected.slice(0, 50) : [],
      skippedImages: Array.isArray(payload.skippedImages) ? payload.skippedImages.slice(0, 20) : [],
      error: payload.error ? String(payload.error).slice(0, 500) : null,
      n8nExecutionId: payload.n8nExecutionId ? String(payload.n8nExecutionId) : null,
      ingestBatchId: batchId,
      completedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    for (const id of messageIds) {
      batch.set(db.collection(messagesCollection).doc(id), {
        rateIntakeStatus: status,
      }, { merge: true });
    }
    await batch.commit();

    await db.doc(configDoc).set({
      rateIntakeSavedTotal: FieldValue.increment(saved),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    return {
      ok: true,
      batchId,
      status,
      saved,
      agentId: data.agentId || null,
      chatId: data.chatId || null,
      // n8n needs this to decide whether to send the supplier an ack, so the
      // toggle is read here rather than duplicated as an n8n environment flag.
      autoReply: Boolean((await readConfig()).rateIntakeAutoReply),
    };
  }

  // ── endpoint ──────────────────────────────────────────────────────────────

  /**
   * One endpoint, two verbs. Two endpoints would be two Cloud Run services and
   * two cold starts for a caller that always does both in sequence — the same
   * reasoning as setWhatsappSessionState's four verbs.
   */
  const secrets = [n8nToken].filter((s) => s && typeof s === "object");
  const rateIntakeForN8n = onRequest(
    { region: REGION, cors: false, secrets, maxInstances: 3, memory: "256MiB" },
    async (req, res) => {
      if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

      const auth = verifyN8nBearer(req.headers.authorization, {
        secret: typeof n8nToken === "object" ? n8nToken.value() : String(n8nToken || ""),
      });
      if (!auth.ok) return res.status(401).send("Unauthorized");

      const action = String(req.body?.action || "").trim();

      try {
        if (action === "complete") {
          const result = await completeBatch(req.body || {});
          return res.status(result.ok ? 200 : 400).json(result);
        }

        if (action !== "claim") {
          return res.status(400).json({ ok: false, error: "action must be 'claim' or 'complete'" });
        }

        const config = await readConfig();
        if (!config.rateIntakeEnabled) {
          // 200, not an error: the n8n cron runs every three minutes and a
          // deliberately-off feature must not page anyone 480 times a day.
          return res.status(200).json({ ok: true, enabled: false, batches: [] });
        }

        const now = new Date();
        const reclaimed = await reclaimExpiredLeases(now);
        const limit = Math.min(5, Math.max(1, Number(req.body?.limit) || 2));
        const { claimed, pendingChats } = await claimBatches(limit, config, now);

        await db.doc(configDoc).set({
          rateIntakeLastClaimAt: FieldValue.serverTimestamp(),
          ...(claimed.length ? { rateIntakeClaimedTotal: FieldValue.increment(claimed.length) } : {}),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });

        return res.status(200).json({
          ok: true,
          enabled: true,
          reclaimed,
          pendingChats,
          batches: claimed,
        });
      } catch (error) {
        console.error("whatsappRateIntakeForN8n failed:", error);
        return res.status(500).json({ ok: false, error: "internal" });
      }
    },
  );

  // ── retention ─────────────────────────────────────────────────────────────

  /** Folded into dailyMaintenance — a fourth onSchedule starts Scheduler billing. */
  async function purgeExpiredRateBatches(now = new Date()) {
    const snap = await db.collection(BATCHES_COLLECTION)
      .where("expiresAt", "<", Timestamp.fromDate(now))
      .limit(PURGE_LIMIT)
      .get();

    let deleted = 0;
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = db.batch();
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deleted += Math.min(400, snap.docs.length - i);
    }
    return { deletedRateBatches: deleted };
  }

  return {
    rateIntakeForN8n,
    intakeFieldsFor,
    purgeExpiredRateBatches,
    invalidateSupplierCache,
    // exported for tests
    claimBatches,
    completeBatch,
    reclaimExpiredLeases,
  };
}

module.exports = {
  build,
  BATCHES_COLLECTION,
  DEFAULT_LEASE_MINUTES,
  DEFAULT_MAX_BATCHES_PER_CHAT_PER_DAY,
  BATCH_RETENTION_DAYS,
  MEDIA_LIKELY_EXPIRED_DAYS,
  TERMINAL_STATUSES,
};
