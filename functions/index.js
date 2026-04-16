/**
 * Zamra Travels — Firebase Cloud Functions
 * Callable (onCall) functions require admin auth.
 * ingestFaresFromN8n is an onRequest endpoint secured via Bearer token.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// ── Auth Guard ──────────────────────────────────────────────────────────────
/**
 * Verifies the caller is authenticated and has admin custom claim.
 * @param {import("firebase-functions/v2/https").CallableRequest} request
 */
function requireAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in to call this function.");
  }
  if (!request.auth.token.admin) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }
}

// ── Firestore helpers ────────────────────────────────────────────────────────
const BATCH_SIZE = 400; // Firestore max batch write is 500

/**
 * Deletes documents in chunks of BATCH_SIZE using batched writes.
 * @param {FirebaseFirestore.QuerySnapshot} snapshot
 */
async function deleteDocs(snapshot) {
  if (snapshot.empty) return 0;
  const docs = snapshot.docs;
  let deleted = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_SIZE).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += Math.min(BATCH_SIZE, docs.length - i);
  }
  return deleted;
}

/**
 * Updates documents in chunks of BATCH_SIZE.
 * @param {FirebaseFirestore.QuerySnapshot} snapshot
 * @param {object} updateData
 */
async function updateDocs(snapshot, updateData) {
  if (snapshot.empty) return 0;
  const docs = snapshot.docs;
  let updated = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_SIZE).forEach((doc) => batch.update(doc.ref, updateData));
    await batch.commit();
    updated += Math.min(BATCH_SIZE, docs.length - i);
  }
  return updated;
}

/**
 * Returns midnight UTC for "today - N days".
 * This matches how flightDate is stored (UTC midnight from YYYY-MM-DD strings).
 * @param {number} daysAgo
 */
function getUtcMidnightNDaysAgo(daysAgo) {
  const now = new Date();
  const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  utcMidnight.setUTCDate(utcMidnight.getUTCDate() - Number(daysAgo || 0));
  return utcMidnight;
}


// ══════════════════════════════════════════════════════════════════════════════
// 1. bulkDeleteFares
//    Deletes agent_fares matching any combination of optional filters:
//    agentId, sectorId, startDate, endDate. At least one must be provided.
// ══════════════════════════════════════════════════════════════════════════════
exports.bulkDeleteFares = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { agentId, sectorId, startDate, endDate } = request.data;

  // Require at least one meaningful filter to prevent accidental full wipes
  const hasFilter = (agentId && agentId !== "all") ||
                    (sectorId && sectorId !== "all") ||
                    startDate || endDate;

  if (!hasFilter) {
    throw new HttpsError("invalid-argument", "Provide at least one filter: agentId, sectorId, or a date range.");
  }

  // Build query dynamically from whatever filters are supplied
  let query = db.collection("agent_fares");

  if (agentId && agentId !== "all") {
    query = query.where("agentId", "==", agentId);
  }
  if (sectorId && sectorId !== "all") {
    query = query.where("sectorId", "==", sectorId);
  }
  if (startDate) {
    query = query.where("flightDate", ">=", Timestamp.fromDate(new Date(startDate)));
  }
  if (endDate) {
    query = query.where("flightDate", "<=", Timestamp.fromDate(new Date(endDate + "T23:59:59")));
  }

  const snapshot = await query.get();
  const deleted = await deleteDocs(snapshot);

  return { success: true, deleted, message: `Deleted ${deleted} fare record${deleted !== 1 ? "s" : ""}.` };
});


// ══════════════════════════════════════════════════════════════════════════════
// 2. bulkToggleAgentVisibility
//    Hides or shows all fares for a specific agent.
//    Also updates the isActive flag on the agent document itself.
// ══════════════════════════════════════════════════════════════════════════════
exports.bulkToggleAgentVisibility = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { agentId, isActive } = request.data;

  if (!agentId || typeof isActive !== "boolean") {
    throw new HttpsError("invalid-argument", "agentId (string) and isActive (boolean) are required.");
  }

  // 1. Update the agent doc
  const agentRef = db.collection("agents").doc(agentId);
  await agentRef.update({ isActive, updatedAt: FieldValue.serverTimestamp() });

  // 2. Update all fares: isHidden is the OPPOSITE of isActive
  const snapshot = await db.collection("agent_fares")
    .where("agentId", "==", agentId)
    .get();

  const updated = await updateDocs(snapshot, {
    isHidden: !isActive,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    updated,
    message: `Agent ${agentId} is now ${isActive ? "active" : "hidden"}. ${updated} fares updated.`,
  };
});


// ══════════════════════════════════════════════════════════════════════════════
// 3. bulkToggleSectorVisibility
//    Hides or shows all fares for a specific sector.
// ══════════════════════════════════════════════════════════════════════════════
exports.bulkToggleSectorVisibility = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { sectorId, isHidden } = request.data;

  if (!sectorId || typeof isHidden !== "boolean") {
    throw new HttpsError("invalid-argument", "sectorId (string) and isHidden (boolean) are required.");
  }

  // 1. Update the sector doc
  const sectorRef = db.collection("sectors").doc(sectorId);
  try {
    await sectorRef.update({ isHidden, updatedAt: FieldValue.serverTimestamp() });
  } catch (e) {
    if (e.code === 5) { // NOT_FOUND
      await sectorRef.set({ isHidden, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      throw e;
    }
  }

  // 2. Update all fares:
  const snapshot = await db.collection("agent_fares")
    .where("sectorId", "==", sectorId)
    .get();

  const updated = await updateDocs(snapshot, {
    isHidden,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    updated,
    message: `Sector ${sectorId} fares are now ${isHidden ? "hidden" : "visible"}. ${updated} fares updated.`,
  };
});


// ══════════════════════════════════════════════════════════════════════════════
// 4. bulkSyncAgentCommission
//    Updates commission + finalRate across all fares for a specific agent.
// ══════════════════════════════════════════════════════════════════════════════
exports.bulkSyncAgentCommission = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { agentId, commission } = request.data || {};

  if (!agentId) {
    throw new HttpsError("invalid-argument", "agentId is required.");
  }

  if (commission === undefined || commission === null || commission === "") {
    throw new HttpsError("invalid-argument", "commission is required.");
  }

  const normalizedCommission = Number(commission);
  if (!Number.isFinite(normalizedCommission)) {
    throw new HttpsError("invalid-argument", "commission must be a valid number.");
  }

  const snapshot = await db.collection("agent_fares")
    .where("agentId", "==", agentId)
    .get();

  if (snapshot.empty) {
    return { success: true, updated: 0, message: `No fares found for agent ${agentId}.` };
  }

  const docs = snapshot.docs;
  let updated = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_SIZE).forEach((doc) => {
      const data = doc.data() || {};
      const specialRate = Number(data.specialRate) || 0;
      const finalRate = Math.max(0, specialRate + normalizedCommission);
      batch.update(doc.ref, {
        commission: normalizedCommission,
        finalRate,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    updated += Math.min(BATCH_SIZE, docs.length - i);
  }

  return {
    success: true,
    updated,
    message: `Updated ${updated} fare record${updated !== 1 ? "s" : ""} for agent ${agentId}.`,
  };
});


// ══════════════════════════════════════════════════════════════════════════════
// 5. generateAgentReport
//    Aggregates agent_fares → returns per-agent stats for charts.
// ══════════════════════════════════════════════════════════════════════════════
exports.generateAgentReport = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { startDate, endDate, sectorId, agentId } = request.data;

  // All filters are optional — when none are supplied, the full dataset is aggregated.

  // Build query dynamically — only add constraints that were supplied
  let query = db.collection("agent_fares");

  if (startDate) {
    query = query.where("flightDate", ">=", Timestamp.fromDate(new Date(startDate)));
  }
  if (endDate) {
    query = query.where("flightDate", "<=", Timestamp.fromDate(new Date(endDate + "T23:59:59")));
  }
  if (sectorId && sectorId !== "all") {
    query = query.where("sectorId", "==", sectorId);
  }
  if (agentId && agentId !== "all") {
    query = query.where("agentId", "==", agentId);
  }

  const snapshot = await query.get();

  // Fetch all agents for name resolution
  const agentsSnap = await db.collection("agents").get();
  const agentMap = {};
  agentsSnap.forEach((doc) => {
    agentMap[doc.id] = doc.data().name || doc.id;
  });

  // Fetch all sectors for name resolution
  const sectorsSnap = await db.collection("sectors").get();
  const sectorMap = {};
  sectorsSnap.forEach((doc) => {
    const d = doc.data();
    sectorMap[doc.id] = d.sectorCode || `${d.sectorFrom}-${d.sectorTo}`;
  });

  // Aggregate by agent
  const agentStats = {};
  // Aggregate by sector
  const sectorStats = {};

  snapshot.forEach((doc) => {
    const fare = doc.data();
    const aid = fare.agentId;
    const sid = fare.sectorId;
    const rate = fare.finalRate || fare.specialRate || 0;

    // Per-agent aggregation
    if (!agentStats[aid]) {
      agentStats[aid] = { agentId: aid, name: agentMap[aid] || aid, count: 0, totalRate: 0, minRate: Infinity, maxRate: 0 };
    }
    agentStats[aid].count += 1;
    agentStats[aid].totalRate += rate;
    if (rate < agentStats[aid].minRate) agentStats[aid].minRate = rate;
    if (rate > agentStats[aid].maxRate) agentStats[aid].maxRate = rate;

    // Per-sector aggregation
    if (!sectorStats[sid]) {
      sectorStats[sid] = { sectorId: sid, name: sectorMap[sid] || sid, count: 0, totalRate: 0 };
    }
    sectorStats[sid].count += 1;
    sectorStats[sid].totalRate += rate;
  });

  // Grouped detailed data payload
  const agentDetailedMap = {};
  snapshot.forEach((doc) => {
    const fare = doc.data();
    const aid = fare.agentId;
    const sid = fare.sectorId;
    
    if(!agentDetailedMap[aid]) {
        agentDetailedMap[aid] = {
            agentId: aid,
            agentName: agentMap[aid] || aid,
            sectorsMap: {}
        };
    }
    if(!agentDetailedMap[aid].sectorsMap[sid]) {
        agentDetailedMap[aid].sectorsMap[sid] = {
            sectorId: sid,
            sectorCode: sectorMap[sid] || sid,
            fares: []
        };
    }
    agentDetailedMap[aid].sectorsMap[sid].fares.push({
        id: doc.id,
        flightDate: fare.flightDate ? fare.flightDate.toDate().toISOString() : null,
        airlineId: fare.airlineId || "",
        rate: fare.finalRate || 0,
        splr: fare.specialRate || 0,
        flightTime: fare.flightTime || ""
    });
  });

  const detailedPayload = Object.values(agentDetailedMap).map(a => {
      return {
          agentId: a.agentId,
          agentName: a.agentName,
          sectors: Object.values(a.sectorsMap)
      };
  });

  // Compute averages and clean up Infinity
  const agentReport = Object.values(agentStats).map((a) => ({
    ...a,
    avgRate: a.count > 0 ? Math.round(a.totalRate / a.count) : 0,
    minRate: a.minRate === Infinity ? 0 : a.minRate,
  })).sort((a, b) => b.count - a.count);

  const sectorReport = Object.values(sectorStats).map((s) => ({
    ...s,
    avgRate: s.count > 0 ? Math.round(s.totalRate / s.count) : 0,
  })).sort((a, b) => b.count - a.count);

  return {
    success: true,
    totalFares: snapshot.size,
    agentReport,
    sectorReport,
    detailedPayload,
    generatedAt: new Date().toISOString(),
  };
});


// ══════════════════════════════════════════════════════════════════════════════
// 6. ingestFaresFromN8n
//    Accepts parsed 'firebaseData' JSON from n8n webhook and stores it in Firestore.
// ══════════════════════════════════════════════════════════════════════════════
const { onRequest } = require("firebase-functions/v2/https");

exports.ingestFaresFromN8n = onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer ZamraFirestore") {
    return res.status(401).send("Unauthorized");
  }

  const fares = req.body.firebaseData;
  if (!fares || !Array.isArray(fares)) {
    return res.status(400).send("Invalid payload: expected { firebaseData: [...] }");
  }

  // Load Sectors mapping
  const sectorMap = {};
  const sectorsSnap = await db.collection("sectors").get();
  sectorsSnap.forEach(d => {
      const dbCode = d.data().sectorCode || "";
      sectorMap[dbCode.replace("-", " ").trim()] = d.id;
  });

  // Load Airlines mapping
  const airlineMap = {};
  const airlinesSnap = await db.collection("airlines").get();
  airlinesSnap.forEach(a => {
      airlineMap[a.data().code] = a.id;
  });

  // Load Agents commission map — commission value is stored per-agent in Firestore
  const agentCommissionMap = {};
  const agentsSnap = await db.collection("agents").get();
  agentsSnap.forEach(a => {
      const d = a.data();
      agentCommissionMap[a.id] = d.commission !== undefined ? Number(d.commission) : 500;
  });

  const BATCH_LIMIT = 400;
  let saved = 0;
  
  for (let i = 0; i < fares.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    const chunk = fares.slice(i, i + BATCH_LIMIT);
    
    chunk.forEach(row => {
      const newRef = db.collection("agent_fares").doc();
      const n8nSectorCode = String(row.sector_code || "").trim();
      const sectorId = sectorMap[n8nSectorCode] || n8nSectorCode;
      
      const n8nFlightCode = String(row.flight_code || "").trim();
      const airlineId = airlineMap[n8nFlightCode] || n8nFlightCode;
      
      const agentIdStr = String(row.agent_id);
      const flightDate = Timestamp.fromDate(new Date(row.date + "T00:00:00Z"));
      const flightTimeStr = (row.time_start && row.time_end) ? `${row.time_start} - ${row.time_end}` : "";

      // Use agent's stored commission; n8n payload can override if explicitly provided
      const commission = (row.commission !== undefined && row.commission !== null)
        ? Number(row.commission)
        : (agentCommissionMap[agentIdStr] ?? 500);

      batch.set(newRef, {
        agentId: agentIdStr,
        sectorId,
        airlineId,
        flightDate,
        specialRate: row.sp_rate ? Number(row.sp_rate) : 0,
        finalRate: row.rate ? Number(row.rate) : 0,
        baggage: String(row.baggage || ""),
        extraBaggage: row.extra_baggage ? Number(row.extra_baggage) : 0,
        commission,
        supplierRate: 0,
        isHidden: row.show === "no",
        flightTime: flightTimeStr,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    
    await batch.commit();
    saved += chunk.length;
  }

  res.status(200).json({ success: true, saved });
});


// ══════════════════════════════════════════════════════════════════════════════
// 7. getSocialQueue
//    Returns pending items from social_queue for n8n to process and post.
//    GET  /getSocialQueue?sectorId=X&mediaType=image&limit=50
// ══════════════════════════════════════════════════════════════════════════════
const N8N_SOCIAL_TOKEN = "ZamraSocialQueue2024";

exports.getSocialQueue = onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${N8N_SOCIAL_TOKEN}`) {
    return res.status(401).send("Unauthorized");
  }

  const { sectorId, mediaType, limit: limitParam } = req.query;
  let query = db.collection("social_queue").where("status", "==", "pending");
  if (sectorId) query = query.where("sectorId", "==", sectorId);
  if (mediaType) query = query.where("mediaType", "==", mediaType);
  query = query.orderBy("createdAt", "asc").limit(Number(limitParam) || 50);

  const snap = await query.get();
  const items = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null,
  }));

  res.status(200).json({ success: true, count: items.length, items });
});


// ══════════════════════════════════════════════════════════════════════════════
// 8. markSocialPosted
//    Called by n8n after posting to update a social_queue item's status.
//    POST /markSocialPosted  { id, status, platforms?, postedAt? }
// ══════════════════════════════════════════════════════════════════════════════
exports.markSocialPosted = onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${N8N_SOCIAL_TOKEN}`) {
    return res.status(401).send("Unauthorized");
  }

  const { id, status, platforms, postedAt } = req.body || {};
  if (!id || !status) {
    return res.status(400).json({ error: "id and status are required." });
  }

  const validStatuses = ["posted", "failed", "skipped"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
  }

  const docRef = db.collection("social_queue").doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: "Queue item not found." });

  await docRef.update({
    status,
    postedAt: postedAt ? new Date(postedAt) : FieldValue.serverTimestamp(),
    postedToPlatforms: platforms || [],
    updatedAt: FieldValue.serverTimestamp(),
  });

  res.status(200).json({ success: true, id, status });
});


// ══════════════════════════════════════════════════════════════════════════════
// 9. purgeOldFaresDaily (Scheduled)
//    Deletes fares older than 2 days (by flightDate, UTC midnight).
// ══════════════════════════════════════════════════════════════════════════════
exports.purgeOldFaresDaily = onSchedule(
  { region: "asia-south1", schedule: "every day 00:15", timeZone: "UTC" },
  async () => {
    const cutoff = getUtcMidnightNDaysAgo(2);
    const snapshot = await db.collection("agent_fares")
      .where("flightDate", "<", Timestamp.fromDate(cutoff))
      .get();
    const deleted = await deleteDocs(snapshot);
    console.log(
      `purgeOldFaresDaily: deleted ${deleted} fare record${deleted !== 1 ? "s" : ""} before ${cutoff.toISOString().slice(0, 10)}`
    );
  }
);
