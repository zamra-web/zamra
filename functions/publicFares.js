"use strict";

// getPublicFares — serves the public site's per-sector flight results.
//
// WHY THIS EXISTS RATHER THAN A DIRECT FIRESTORE READ
//
// `agent_fares` documents carry `specialRate`, `commission` and the supplier's
// `agentId`. The homepage used to read the collection straight from the browser
// through `getFares()` in admin/db.js, which spreads `...data` — so every
// visitor received Zamra's buying rate, its margin, and which consolidator
// supplies each route, while the page rendered only the selling price. Firestore
// has no field-level security, so no rule could trim that; the read had to move
// behind a projection. This is the same reasoning `publicDeals.js` already
// applies to /deals/<slug>, and with this endpoint in place the `agent_fares`
// read rule closes to admin-only.
//
// The projection deliberately keeps the *shape* the client already consumed, so
// `dedupeAndSortFares` and the flight-time resolver work unchanged.

const { onRequest } = require("firebase-functions/v2/https");
const { Timestamp } = require("firebase-admin/firestore");

// A sector's future fares are bounded in practice (purgeOldFaresDaily sweeps the
// past, and uploads cover months, not years). The cap is here so an anonymous
// caller cannot make the endpoint read an unbounded collection; rows are ordered
// by flightDate ascending, so if it ever bites it drops the furthest-out dates
// rather than the ones the page actually shows.
const MAX_ROWS = 1000;

/**
 * Reduce a fare document to exactly what the public flight list renders.
 *
 * The allow-list is deliberate: adding a field here publishes it. `specialRate`,
 * `commission` and the supplier `agentId` must never appear.
 *
 * `finalRate` keeps its name rather than becoming `price` (as it does in the
 * deals projection) because it is the customer-facing selling price already
 * printed on the card, and `dedupeAndSortFares` — shared, tested client code —
 * reads it under that name. Publishing the value is the whole point of the page;
 * only the supplier economics behind it are secret.
 *
 * @param {object} fare  raw agent_fares document data
 * @return {object}
 */
function projectPublicFare(fare) {
  const flightDate = fare.flightDate && typeof fare.flightDate.toDate === "function"
    ? fare.flightDate.toDate()
    : new Date(fare.flightDate);

  // toISOString() throws a RangeError on an unparseable date rather than
  // returning something falsy, so it is guarded here — one malformed row must
  // not turn the whole request into a 500.
  const isoDate = Number.isNaN(flightDate.getTime()) ? null : flightDate.toISOString();

  return {
    sectorId: String(fare.sectorId || ""),
    airlineId: String(fare.airlineId || ""),
    flightDate: isoDate,
    flightTime: String(fare.flightTime || ""),
    finalRate: Number(fare.finalRate) || 0,
    baggage: fare.baggage ?? "",
    seatsAvailable: Number(fare.seatsAvailable) || 0,
  };
}

/**
 * Parse the request into a validated query.
 *
 * `startDate` is passed through as an instant, matching what the old client-side
 * `getFares({ startDate })` did — the browser sends its local midnight as ISO and
 * the comparison happens on the same instant it always did.
 *
 * @param {object} req
 * @return {{ sectorId: string, startDate: Date|null, endDate: Date|null }|null}
 */
function parsePublicFaresRequest(req) {
  const query = (req && req.query) || {};
  const body = (req && req.body) || {};

  const sectorId = String(query.sectorId || body.sectorId || "").trim();
  if (!sectorId) return null;

  const readDate = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  return {
    sectorId,
    startDate: readDate(query.startDate || body.startDate),
    endDate: readDate(query.endDate || body.endDate),
  };
}

/**
 * Build the onRequest handler.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @return {import("firebase-functions/v2/https").HttpsFunction}
 */
function buildGetPublicFares(db) {
  return onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    const parsed = parsePublicFaresRequest(req);
    if (!parsed) {
      return res.status(400).json({ success: false, error: "MISSING_SECTOR_ID" });
    }

    try {
      // isHidden is filtered here for the same reason the old rule required it:
      // a hidden fare is one an admin has pulled from sale.
      let query = db.collection("agent_fares")
        .where("isHidden", "==", false)
        .where("sectorId", "==", parsed.sectorId);

      if (parsed.startDate) {
        query = query.where("flightDate", ">=", Timestamp.fromDate(parsed.startDate));
      }
      if (parsed.endDate) {
        query = query.where("flightDate", "<=", Timestamp.fromDate(parsed.endDate));
      }

      const snap = await query.orderBy("flightDate", "asc").limit(MAX_ROWS).get();

      const fares = [];
      snap.forEach((doc) => {
        const projected = projectPublicFare(doc.data());
        // A row whose date will not parse cannot be grouped or rendered; drop it
        // rather than emitting `null` and letting the client format "Invalid Date".
        if (projected.flightDate !== null) fares.push(projected);
      });

      return res.status(200).json({ success: true, fares });
    } catch (err) {
      console.error("getPublicFares failed:", err);
      return res.status(500).json({ success: false, error: "INTERNAL" });
    }
  });
}

module.exports = {
  MAX_ROWS,
  projectPublicFare,
  parsePublicFaresRequest,
  buildGetPublicFares,
};
