/**
 * Query upcoming fares for a sector and return the top N cheapest rows,
 * deduplicated by (airline, flightDate, flightTime) keeping the cheapest.
 */

const { getFirestore, Timestamp } = require("firebase-admin/firestore");

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

  const snap = await db.collection("agent_fares")
    .where("sectorId", "==", sectorId)
    .where("flightDate", ">=", Timestamp.fromDate(from))
    .where("flightDate", "<", Timestamp.fromDate(to))
    .get();

  const dedup = new Map();
  for (const doc of snap.docs) {
    const f = doc.data();
    const date = f.flightDate?.toDate?.() || f.flightDate;
    if (!date) continue;
    const key = `${f.airlineId}_${date.getTime()}_${normalizeTime(f.flightTime)}`;
    const rate = Number(f.finalRate) || Infinity;
    const existing = dedup.get(key);
    if (!existing || rate < existing._rate) {
      dedup.set(key, { ...f, _date: date, _rate: rate });
    }
  }

  const rows = Array.from(dedup.values())
    .sort((a, b) => a._rate - b._rate)
    .slice(0, maxRows)
    .sort((a, b) => a._date.getTime() - b._date.getTime());

  return rows;
}

module.exports = { fetchDailyFares };
