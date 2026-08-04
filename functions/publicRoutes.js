"use strict";

// getPublicRoutes — the set of routes the public search is allowed to offer.
//
// WHY THIS EXISTS
//
// The homepage "From" and "To" selects used to be two hardcoded, independent
// lists of every airport Zamra has ever touched. Picking CCJ → MED or JED → TRV
// produced a search that could only ever come back empty, because no sector (or
// no live fare) backs that pair. The fix is to let the origin drive the
// destination list, which means the browser needs to know which pairs are real.
//
// It cannot work that out for itself. `sectors` is world-readable, so the client
// could filter to pairs that *exist* — but "a sector exists" is not the question
// a traveller is asking. A sector with no upcoming fare searches just as empty as
// one that was never created. Answering properly means reading `agent_fares`,
// which is admin-only for the reasons spelled out in publicFares.js, so the
// question has to be answered on the server and only the answer published.
//
// The response is deliberately route metadata only — codes, city labels and the
// sector id the client already passes to getPublicFares. No prices, no counts:
// a per-route fare count would leak how thin a sector's inventory is, and
// nothing on the page renders it.

const { onRequest } = require("firebase-functions/v2/https");
const { Timestamp } = require("firebase-admin/firestore");
const { compareSectorDisplayOrder, parseSectorCodes } = require("./sectorOrdering");

// Every visitor's first search hits this, and the answer changes only when an
// admin uploads or expires fares. Recomputing it per request would spend a
// count-aggregation per sector on data that is stable for hours, so a warm
// instance serves from memory. Ten minutes bounds how long a newly uploaded
// sector stays missing from the dropdown.
const ROUTE_CACHE_TTL_MS = 10 * 60 * 1000;

// Browser/CDN cache window. Shorter than the in-memory TTL on purpose: a stale
// tab should recover on the next navigation rather than hold yesterday's route
// list for as long as the server is entitled to.
const ROUTE_CACHE_CONTROL = "public, max-age=300";

/** UTC midnight today — the same cutoff getB2BFares uses for "upcoming". */
function getUtcMidnightToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Reduce a sector document to the route fields the search UI needs.
 *
 * `id` is included because the client turns the chosen pair straight back into a
 * `getPublicFares({ sectorId })` call — without it the browser would have to
 * re-derive the sector by string-matching `sectorCode`, which is exactly the
 * lookup that made a typo'd sector code silently unsearchable.
 *
 * @param {object} sector  raw sectors document, with `id`
 * @return {{id: string, sectorCode: string, sectorFrom: string, sectorTo: string,
 *           originCode: string, destCode: string}}
 */
function projectPublicRoute(sector) {
  const { originCode, destCode } = parseSectorCodes(sector.sectorCode);
  return {
    id: String(sector.id || ""),
    sectorCode: String(sector.sectorCode || ""),
    sectorFrom: String(sector.sectorFrom || ""),
    sectorTo: String(sector.sectorTo || ""),
    originCode,
    destCode,
  };
}

/**
 * Drop sectors that cannot produce a search result.
 *
 * A sector whose `sectorCode` does not parse into two codes is unusable to a
 * cascading dropdown — it has no origin to hang under — and would otherwise
 * render as a blank option.
 *
 * @param {Array<object>} sectors  raw sectors documents, each with `id`
 * @param {Set<string>} sectorIdsWithFares  ids holding >=1 upcoming visible fare
 * @return {Array<object>} projected routes in admin display order
 */
function buildRouteList(sectors, sectorIdsWithFares) {
  return [...sectors]
    .sort(compareSectorDisplayOrder)
    .filter((sector) => sectorIdsWithFares.has(String(sector.id)))
    .map(projectPublicRoute)
    .filter((route) => route.originCode && route.destCode);
}

/**
 * Which sectors currently hold at least one bookable fare.
 *
 * This runs one `count()` aggregation per sector rather than one big scan of
 * `agent_fares`. A scan would have to read every future fare document — hundreds
 * to thousands of billed reads on a public, unauthenticated endpoint — just to
 * collect the distinct sector ids. A count is billed per 1000 index entries
 * matched, so the whole sweep is roughly one read per sector, and it rides the
 * existing (isHidden, sectorId, flightDate) composite index that getPublicFares
 * already needs.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @param {Array<object>} sectors
 * @param {Date} since
 * @return {Promise<Set<string>>}
 */
async function findSectorsWithFares(db, sectors, since) {
  const cutoff = Timestamp.fromDate(since);

  const results = await Promise.all(sectors.map(async (sector) => {
    const sectorId = String(sector.id || "");
    if (!sectorId) return null;

    const snap = await db.collection("agent_fares")
      .where("isHidden", "==", false)
      .where("sectorId", "==", sectorId)
      .where("flightDate", ">=", cutoff)
      .count()
      .get();

    return snap.data().count > 0 ? sectorId : null;
  }));

  return new Set(results.filter(Boolean));
}

/**
 * A per-instance memo over `findSectorsWithFares`.
 *
 * Which sectors hold fares is the same answer for every caller — it does not
 * vary by agent or by request — so both the public route list and the B2B portal
 * boot share this shape. Each function is its own Cloud Run service, so each gets
 * its own warm cache; the point is to avoid re-running the sweep for every
 * request an instance serves, not to share state between them.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @param {number} [ttlMs]
 * @return {(sectors: Array<object>) => Promise<Set<string>>}
 */
function createSectorsWithFaresCache(db, ttlMs = ROUTE_CACHE_TTL_MS) {
  let cache = null; // { at: number, ids: Set<string> }

  return async (sectors) => {
    if (cache && Date.now() - cache.at <= ttlMs) return cache.ids;
    const ids = await findSectorsWithFares(db, sectors, getUtcMidnightToday());
    cache = { at: Date.now(), ids };
    return ids;
  };
}

/**
 * Build the onRequest handler.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @return {import("firebase-functions/v2/https").HttpsFunction}
 */
function buildGetPublicRoutes(db) {
  const sectorsWithFares = createSectorsWithFaresCache(db);

  // maxInstances 20 matches getPublicFares: this is public and unauthenticated,
  // so the cap is blast radius rather than throughput.
  return onRequest({ region: "asia-south1", cors: true, maxInstances: 20 }, async (req, res) => {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    try {
      const sectorsSnap = await db.collection("sectors").get();
      const sectors = sectorsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const withFares = await sectorsWithFares(sectors);

      res.set("Cache-Control", ROUTE_CACHE_CONTROL);
      return res.status(200).json({ success: true, routes: buildRouteList(sectors, withFares) });
    } catch (err) {
      console.error("getPublicRoutes failed:", err);
      return res.status(500).json({ success: false, error: "INTERNAL" });
    }
  });
}

module.exports = {
  ROUTE_CACHE_TTL_MS,
  buildGetPublicRoutes,
  buildRouteList,
  createSectorsWithFaresCache,
  findSectorsWithFares,
  getUtcMidnightToday,
  projectPublicRoute,
};
