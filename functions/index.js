/**
 * Zamra Travels — Firebase Cloud Functions
 * Callable (onCall) functions require admin auth.
 * ingestFaresFromN8n is an onRequest endpoint secured via Bearer token.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { buildSequentialSectorSortUpdates } = require("./sectorOrdering");
const {
  handBaggageKg,
  checkInBaggageOptions,
  resolveCheckInBaggageKg,
  baggageSummary,
} = require("./airlineBaggage");
const {
  resolveFlightTime,
  normalizeFlightTimeRange,
} = require("./flightTime");
const {
  buildFlightDetailIndex,
  buildFlightDetailKey,
  normalizeScheduleWindows,
  resolveScheduledFlightTime,
} = require("./flightSchedule");

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
// 5. reorderSectors
//    Persists a custom admin-defined display order for all sectors.
// ══════════════════════════════════════════════════════════════════════════════
exports.reorderSectors = onCall({ region: "asia-south1" }, async (request) => {
  requireAdmin(request);

  const rawSectorIds = Array.isArray(request.data?.sectorIds) ? request.data.sectorIds : [];
  const sectorIds = rawSectorIds
    .map((id) => String(id || "").trim())
    .filter(Boolean);

  if (!sectorIds.length) {
    throw new HttpsError("invalid-argument", "sectorIds must be a non-empty array.");
  }

  const uniqueSectorIds = new Set(sectorIds);
  if (uniqueSectorIds.size !== sectorIds.length) {
    throw new HttpsError("invalid-argument", "sectorIds must contain unique values only.");
  }

  const sectorsSnap = await db.collection("sectors").get();
  const existingDocs = sectorsSnap.docs;
  const existingIds = existingDocs.map((doc) => doc.id);

  if (existingIds.length !== sectorIds.length) {
    throw new HttpsError(
      "failed-precondition",
      "The provided sector order is stale. Refresh the sector list and try again.",
    );
  }

  const existingIdSet = new Set(existingIds);
  const unknownIds = sectorIds.filter((id) => !existingIdSet.has(id));
  const missingIds = existingIds.filter((id) => !uniqueSectorIds.has(id));

  if (unknownIds.length || missingIds.length) {
    throw new HttpsError(
      "failed-precondition",
      "The provided sector order must include every current sector exactly once.",
    );
  }

  const docById = new Map(existingDocs.map((doc) => [doc.id, doc]));
  const updates = buildSequentialSectorSortUpdates(sectorIds);
  let updated = 0;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = db.batch();
    updates.slice(i, i + BATCH_SIZE).forEach(({ id, sortOrder }) => {
      const sectorDoc = docById.get(id);
      if (!sectorDoc) return;
      batch.update(sectorDoc.ref, {
        sortOrder,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    updated += Math.min(BATCH_SIZE, updates.length - i);
  }

  return {
    success: true,
    updated,
    message: `Updated display priority for ${updated} sector${updated !== 1 ? "s" : ""}.`,
  };
});


// ══════════════════════════════════════════════════════════════════════════════
// 6. generateAgentReport
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

  // Configured flight times per airline+sector. n8n only echoes times back when
  // its parser found them in the paste, so this is the fallback that keeps
  // agent_fares.flightTime populated — posters render the stored value verbatim.
  // Indexed case-insensitively and resolved per travel date, so a seasonal
  // schedule window beats the doc's default `flightTime`.
  const flightDetailIndex = buildFlightDetailIndex(await db.collection("flight_details").get());

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
      const configuredDetail = flightDetailIndex.get(buildFlightDetailKey(airlineId, sectorId));
      const flightTimeStr = resolveFlightTime(
        row,
        resolveScheduledFlightTime(configuredDetail, row.date, normalizeFlightTimeRange),
      );

      // Use agent's stored commission; n8n payload can override if explicitly provided
      const commission = (row.commission !== undefined && row.commission !== null)
        ? Number(row.commission)
        : (agentCommissionMap[agentIdStr] ?? 500);

      // A rate sheet quotes the supplier's special rate. The B2C selling price
      // is that plus commission — derive it here so the n8n parser only has to
      // extract what is actually printed. An explicit `rate` still wins.
      const specialRate = row.sp_rate ? Number(row.sp_rate) : 0;
      const finalRate = row.rate ? Number(row.rate) : specialRate + commission;

      batch.set(newRef, {
        agentId: agentIdStr,
        sectorId,
        airlineId,
        flightDate,
        specialRate,
        finalRate,
        // Baggage weights are fixed policy, not payload. Hand baggage is always
        // the airline's rule value; check-in is snapped onto the airline's
        // allowed weights so a bad upload can never reach the public site.
        baggage: resolveCheckInBaggageKg(n8nFlightCode, row.baggage),
        extraBaggage: handBaggageKg(n8nFlightCode),
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

  // Update lastRatesUploadedAt on the agents documents
  try {
    const uniqueAgentIds = [...new Set(fares.map(row => String(row.agent_id)).filter(Boolean))];
    const agentUpdates = uniqueAgentIds.map(async (agentId) => {
      try {
        const agentRef = db.collection("agents").doc(agentId);
        await agentRef.update({
          lastRatesUploadedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      } catch (agentErr) {
        console.error(`Failed to update lastRatesUploadedAt for agent ${agentId}:`, agentErr);
      }
    });
    await Promise.all(agentUpdates);
  } catch (err) {
    console.error("Failed to update agents lastRatesUploadedAt timestamps:", err);
  }

  res.status(200).json({ success: true, saved });
});


// ══════════════════════════════════════════════════════════════════════════════
// 6b. exportFlightDetailsForN8n
//     Returns all flight details configurations from Firestore so n8n can use them.
// ══════════════════════════════════════════════════════════════════════════════
exports.exportFlightDetailsForN8n = onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer ZamraFirestore") {
    return res.status(401).send("Unauthorized");
  }

  try {
    const [flightDetailsSnap, airlinesSnap, sectorsSnap] = await Promise.all([
      db.collection("flight_details").get(),
      db.collection("airlines").get(),
      db.collection("sectors").get()
    ]);

    const airlineMap = {};
    airlinesSnap.forEach(doc => { airlineMap[doc.id] = String(doc.data().code || "").toUpperCase(); });
    
    const sectorMap = {};
    sectorsSnap.forEach(doc => { 
      const code = doc.data().sectorCode || "";
      sectorMap[doc.id] = String(code).replace(/[\s-]/g, "").trim().toUpperCase(); 
    });

    const details = {};
    flightDetailsSnap.forEach(doc => {
      const d = doc.data();
      const airlineCode = airlineMap[d.airlineId];
      const sectorCode = sectorMap[d.sectorId];
      
      if (airlineCode && sectorCode) {
        // Create key like "IX_CCJJED"
        const key = `${airlineCode}_${sectorCode}`;
        const flightTime = normalizeFlightTimeRange(d.flightTime);
        const [timeStart = "", timeEnd = ""] = flightTime.split(" - ");
        // Seasonal overrides. n8n picks the window covering each parsed travel
        // date; when it doesn't, ingestFaresFromN8n resolves the same windows
        // server-side, so the payload only ever needs to carry them.
        const schedules = normalizeScheduleWindows(d.schedules, normalizeFlightTimeRange)
          .map((window) => {
            const [start = "", end = ""] = window.flightTime.split(" - ");
            return {
              start_date: window.startDate,
              end_date: window.endDate,
              flightTime: window.flightTime,
              time_start: start,
              time_end: end,
            };
          });
        details[key] = {
          airlineId: d.airlineId,
          sectorId: d.sectorId,
          // Both shapes, because n8n echoes back whichever one it kept and
          // ingestFaresFromN8n accepts either (plus this map as its fallback).
          flightTime,
          time_start: timeStart,
          time_end: timeEnd,
          schedules,
          hasSchedules: schedules.length > 0,
          // Baggage comes from the airline rules, not the stored free-text
          // value — ingestFaresFromN8n enforces the same weights on the way in.
          baggage: resolveCheckInBaggageKg(airlineCode, d.baggage),
          extraBaggage: handBaggageKg(airlineCode),
          checkInBaggageOptions: checkInBaggageOptions(airlineCode),
          handBaggage: handBaggageKg(airlineCode)
        };
      }
    });

    res.status(200).json({ success: true, details, baggageRules: baggageSummary() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// ══════════════════════════════════════════════════════════════════════════════
// 7. purgeOldFares
//    Deletes fares older than 2 days (by flightDate, UTC midnight).
//    Driven by the `dailyMaintenance` schedule at the bottom of this file.
// ══════════════════════════════════════════════════════════════════════════════
async function purgeOldFares() {
  const cutoff = getUtcMidnightNDaysAgo(2);
  const snapshot = await db.collection("agent_fares")
    .where("flightDate", "<", Timestamp.fromDate(cutoff))
    .get();
  const deleted = await deleteDocs(snapshot);
  return { deleted, cutoff };
}


// ══════════════════════════════════════════════════════════════════════════════
// Buffer social publishing pipeline
//   - refreshSocialPublishingHealth: refreshes saved per-airport posting setup
//   - runSocialQueueNow: admin callable to dispatch pending queue work
//   - socialQueueDispatcher: scheduled queue worker (every 5 minutes)
//   Secrets: one Buffer API key per Gulf region account.
// ══════════════════════════════════════════════════════════════════════════════
const { defineSecret } = require("firebase-functions/params");
const BUFFER_API_KEY_SAUDI = defineSecret("BUFFER_API_KEY_SAUDI");
const BUFFER_API_KEY_UAE = defineSecret("BUFFER_API_KEY_UAE");
const BUFFER_API_KEY_QATAR = defineSecret("BUFFER_API_KEY_QATAR");
const BUFFER_API_KEY_OMAN = defineSecret("BUFFER_API_KEY_OMAN");

// Only markets with a real Buffer account appear here. Kuwait and Bahrain are
// defined in buffer/marketConfig.js but have placeholder channel ids, so they
// get no secret — every active secret version is billed monthly, and an unused
// one is pure cost. A queue item for an unkeyed market fails cleanly in
// dispatchQueueDoc ("No Buffer API key configured for ..."), which is a better
// signal than the old placeholder that failed later at the Buffer API.
// To launch one: create the secret, add it here, redeploy.
const BUFFER_API_KEYS_BY_MARKET = {
  saudi: BUFFER_API_KEY_SAUDI,
  uae: BUFFER_API_KEY_UAE,
  qatar: BUFFER_API_KEY_QATAR,
  oman: BUFFER_API_KEY_OMAN,
};

const socialPipeline = require("./social/pipeline");

exports.refreshSocialPublishingHealth =
  socialPipeline.buildRefreshSocialPublishingHealth(requireAdmin, BUFFER_API_KEYS_BY_MARKET);

exports.runSocialQueueNow =
  socialPipeline.buildRunSocialQueueNow(requireAdmin, BUFFER_API_KEYS_BY_MARKET);

exports.retrySocialJobItem =
  socialPipeline.buildRetrySocialJobItem(requireAdmin, BUFFER_API_KEYS_BY_MARKET);

exports.socialQueueDispatcher =
  socialPipeline.buildScheduledDispatcher(BUFFER_API_KEYS_BY_MARKET);


// ══════════════════════════════════════════════════════════════════════════════
// autoPostDaily (Scheduled, 10:00 Asia/Kolkata)
//   Renders a simplified daily poster for each sector in
//   `posting_schedule/daily` and enqueues it into the shared social_queue/job
//   pipeline. The scheduled dispatcher handles Buffer delivery.
//
//   Also exports `runDailyPostNow` — an admin-only callable that runs the
//   same logic on demand, for testing without waiting for the cron.
// ══════════════════════════════════════════════════════════════════════════════
exports.autoPostDaily = require("./scheduled/autoPostDaily").build();

exports.runDailyPostNow = onCall(
  { region: "asia-south1", memory: "2GiB", timeoutSeconds: 540 },
  async (request) => {
    requireAdmin(request);
    const { runDailyPost } = require("./scheduled/autoPostDaily");
    await runDailyPost();
    return { ok: true };
  },
);


// ══════════════════════════════════════════════════════════════════════════════
// B2B agent portal (b2b.zamratravels.com)
//   Admin: createB2BAgent / resetB2BAgentPassword / setB2BAgentStatus /
//          deleteB2BAgent (manage b2b_agents docs + their Auth accounts), plus
//          getB2BAgentCredentials to re-read an agent's current password.
//   Agent: getB2BPortalContext / getB2BFares (server-side pricing so agents
//          never see raw supplier rates), changeB2BAgentPassword for
//          self-service passwords, recordB2BAgentActivity for the presence
//          heartbeat that drives the admin "Online" badge.
// ══════════════════════════════════════════════════════════════════════════════
const b2b = require("./b2b").build(db, requireAdmin);

exports.createB2BAgent = b2b.createB2BAgent;
exports.resetB2BAgentPassword = b2b.resetB2BAgentPassword;
exports.getB2BAgentCredentials = b2b.getB2BAgentCredentials;
exports.changeB2BAgentPassword = b2b.changeB2BAgentPassword;
exports.recordB2BAgentActivity = b2b.recordB2BAgentActivity;
exports.setB2BAgentStatus = b2b.setB2BAgentStatus;
exports.deleteB2BAgent = b2b.deleteB2BAgent;
exports.getB2BPortalContext = b2b.getB2BPortalContext;
exports.getB2BFares = b2b.getB2BFares;


// ══════════════════════════════════════════════════════════════════════════════
// 9. PUBLIC DEALS
//    Serves /deals/<slug>. Unauthenticated by design — the gate is the link's
//    own `isActive` flag. Fares are projected to display fields only, so
//    specialRate / commission / supplier agentId never reach the browser.
// ══════════════════════════════════════════════════════════════════════════════
exports.getPublicDeals = require("./publicDeals").buildGetPublicDeals(db);

// getPublicFares serves the homepage/search flight list for one sector. Same
// reasoning as getPublicDeals: the browser used to read `agent_fares` directly
// and received specialRate / commission / supplier agentId with every row. This
// is what allows the `agent_fares` read rule to stay admin-only.
exports.getPublicFares = require("./publicFares").buildGetPublicFares(db);

// getPublicRoutes tells the homepage which origin→destination pairs are actually
// searchable, so the "To" select can cascade off "From" instead of offering every
// airport in the directory. Deciding that needs a look at `agent_fares` — a
// sector with no upcoming fare searches just as empty as one that does not
// exist — so it is answered here and only the route metadata is published.
exports.getPublicRoutes = require("./publicRoutes").buildGetPublicRoutes(db);


// ══════════════════════════════════════════════════════════════════════════════
// 10. SOTO LIVE FARES
//     Serves /soto. Unauthenticated by design — the page is public and the
//     data is third-party market pricing, not Zamra's contracted rates.
//
//     The endpoint exists so the Travelpayouts token (quota-metered, tied to
//     our affiliate account) never reaches a browser, and so the SOTO
//     eligibility rule and the response allow-list live somewhere a visitor
//     cannot route around.
// ══════════════════════════════════════════════════════════════════════════════
const TRAVELPAYOUTS_TOKEN = defineSecret("TRAVELPAYOUTS_TOKEN");

const soto = require("./soto").build(db, TRAVELPAYOUTS_TOKEN);

exports.searchSotoFares = soto.searchSotoFares;
exports.searchSotoAirports = soto.searchSotoAirports;


// ══════════════════════════════════════════════════════════════════════════════
// 11. dailyMaintenance (Scheduled, 00:15 UTC)
//     One job running all three retention sweeps in sequence. They were once
//     three separate schedules (purgeOldFaresDaily 00:15, purgeSotoCache 03:00,
//     purgeSocialPublishing every 5 min); Cloud Scheduler bills per job beyond
//     the first three, so folding them in keeps the project inside the free
//     tier. Retention windows are unchanged — each sweep evaluates its own
//     cutoff at run time, so cadence never defined what gets kept.
//
//     Each sweep is independently try/caught: one failing must not stop the
//     rest, or a single bad collection would silently stall all retention.
// ══════════════════════════════════════════════════════════════════════════════
exports.dailyMaintenance = onSchedule(
  { region: "asia-south1", schedule: "every day 00:15", timeZone: "UTC", timeoutSeconds: 540 },
  async () => {
    try {
      const { deleted, cutoff } = await purgeOldFares();
      console.log(
        `dailyMaintenance/fares: deleted ${deleted} fare record${deleted !== 1 ? "s" : ""} before ${cutoff.toISOString().slice(0, 10)}`
      );
    } catch (error) {
      console.error("dailyMaintenance/fares failed:", error);
    }

    try {
      const r = await socialPipeline.purgeExpiredSocialPublishing();
      console.log(
        `dailyMaintenance/social: deleted ${r.deletedDocs} queue docs, ${r.deletedFiles} files, ${r.deletedJobs} jobs`
      );
    } catch (error) {
      console.error("dailyMaintenance/social failed:", error);
    }

    try {
      const deleted = await soto.purgeExpiredSotoCache();
      console.log(`dailyMaintenance/soto: deleted ${deleted} expired entr${deleted === 1 ? "y" : "ies"}`);
    } catch (error) {
      console.error("dailyMaintenance/soto failed:", error);
    }
  }
);

