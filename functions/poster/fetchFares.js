/**
 * Query upcoming fares for a sector and return the top N cheapest rows,
 * deduplicated by (airline, flightDate, flightTime) keeping the cheapest.
 */

const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { normalizeFlightTimeRange } = require("../flightTime");
const {
  buildFlightDetailIndex,
  buildFlightDetailKey,
  resolveScheduledFlightTime,
} = require("../flightSchedule");

function startOfTodayUTC() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function normalizeTime(t) {
  return String(t || "").replace(/\s+/g, "").toLowerCase();
}

/**
 * @param {string} sectorId
 * @param {{ maxRows?: number, dateWindowDays?: number }} opts
 * @returns {Promise<Array<object>>}
 */
async function fetchDailyFares(sectorId, opts = {}) {
  const maxRows = opts.maxRows || 8;
  const windowDays = opts.dateWindowDays || 30;
  const db = getFirestore();

  const from = startOfTodayUTC();
  const to = new Date(from.getTime() + windowDays * 24 * 60 * 60 * 1000);

  const [snap, flightDetailsSnap] = await Promise.all([
    db.collection("agent_fares")
      .where("sectorId", "==", sectorId)
      .where("flightDate", ">=", Timestamp.fromDate(from))
      .where("flightDate", "<", Timestamp.fromDate(to))
      .get(),
    db.collection("flight_details").get(),
  ]);

  // Fares uploaded before the flight time round-trip was fixed store "", so
  // fall back to the configured per-route time rather than printing "—".
  // The fallback is date-aware: a seasonal window beats the doc default.
  const flightDetailIndex = buildFlightDetailIndex(flightDetailsSnap);

  const dedup = new Map();
  for (const doc of snap.docs) {
    const f = doc.data();
    const date = f.flightDate?.toDate?.() || f.flightDate;
    if (!date) continue;
    const flightTime = normalizeFlightTimeRange(f.flightTime) ||
      resolveScheduledFlightTime(
        flightDetailIndex.get(buildFlightDetailKey(f.airlineId, f.sectorId || sectorId)),
        date,
        normalizeFlightTimeRange,
      );
    const key = `${f.airlineId}_${date.getTime()}_${normalizeTime(flightTime)}`;
    const rate = Number(f.finalRate) || Infinity;
    const existing = dedup.get(key);
    if (!existing || rate < existing._rate) {
      dedup.set(key, { ...f, flightTime, _date: date, _rate: rate });
    }
  }

  const rows = Array.from(dedup.values())
    .sort((a, b) => a._rate - b._rate)
    .slice(0, maxRows)
    .sort((a, b) => a._date.getTime() - b._date.getTime());

  return rows;
}

module.exports = { fetchDailyFares };
