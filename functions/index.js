/**
 * Zamra Travels — Firebase Cloud Functions
 * All functions are HTTPS Callable (v2) and require admin auth.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
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


// ══════════════════════════════════════════════════════════════════════════════
// 1. bulkDeleteFares
//    Deletes all agent_fares docs for a given agent within a date range.
// ══════════════════════════════════════════════════════════════════════════════
exports.bulkDeleteFares = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { agentId, startDate, endDate } = request.data;

  if (!agentId || !startDate || !endDate) {
    throw new HttpsError("invalid-argument", "agentId, startDate, and endDate are required.");
  }

  const start = Timestamp.fromDate(new Date(startDate));
  const end = Timestamp.fromDate(new Date(endDate + "T23:59:59"));

  const snapshot = await db.collection("agent_fares")
    .where("agentId", "==", agentId)
    .where("flightDate", ">=", start)
    .where("flightDate", "<=", end)
    .get();

  const deleted = await deleteDocs(snapshot);

  return { success: true, deleted, message: `Deleted ${deleted} fare records.` };
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
// 4. generateAgentReport
//    Aggregates agent_fares → returns per-agent stats for charts.
// ══════════════════════════════════════════════════════════════════════════════
exports.generateAgentReport = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const { startDate, endDate, sectorId } = request.data;

  if (!startDate || !endDate) {
    throw new HttpsError("invalid-argument", "startDate and endDate are required.");
  }

  const start = Timestamp.fromDate(new Date(startDate));
  const end = Timestamp.fromDate(new Date(endDate + "T23:59:59"));

  // Build query
  let query = db.collection("agent_fares")
    .where("flightDate", ">=", start)
    .where("flightDate", "<=", end);

  if (sectorId && sectorId !== "all") {
    query = query.where("sectorId", "==", sectorId);
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
      sectorStats[sid] = { sectorId: sid, name: sectorMap[sid] || sid, count: 0 };
    }
    sectorStats[sid].count += 1;
  });

  // Compute averages and clean up Infinity
  const agentReport = Object.values(agentStats).map((a) => ({
    ...a,
    avgRate: a.count > 0 ? Math.round(a.totalRate / a.count) : 0,
    minRate: a.minRate === Infinity ? 0 : a.minRate,
  })).sort((a, b) => b.count - a.count);

  const sectorReport = Object.values(sectorStats).sort((a, b) => b.count - a.count);

  return {
    success: true,
    totalFares: snapshot.size,
    agentReport,
    sectorReport,
    generatedAt: new Date().toISOString(),
  };
});
