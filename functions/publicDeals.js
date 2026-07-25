"use strict";

// getPublicDeals — serves a curated /deals/<slug> page.
//
// WHY THIS EXISTS RATHER THAN A DIRECT FIRESTORE READ
//
// `agent_fares` documents carry `specialRate`, `commission` and the supplier's
// `agentId`. A browser reading that collection directly receives all of it, even
// though the page only ever displays the selling price. The rest of the public
// site has always read fares directly and carries that exposure; a link designed
// to be broadcast to thousands of people on WhatsApp is the wrong place to keep
// repeating it. This endpoint projects each fare down to display fields only, so
// supplier economics never leave the server.
//
// Serving the page from here also makes view counting possible without giving
// the public write access to a document it can also read.

const { onRequest } = require("firebase-functions/v2/https");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

const { normalizeFlightTimeRange } = require("./flightTime");
const {
  buildFlightDetailIndex,
  buildFlightDetailKey,
  resolveScheduledFlightTime,
} = require("./flightSchedule");
const {
  resolveCheckInBaggageKg,
  handBaggageKg,
} = require("./airlineBaggage");
const {
  normalizeDealSlug,
  resolveDealWindow,
  chunkSectorIds,
} = require("./dealLinks");

/**
 * @param {*} value
 * @return {string}
 */
function normalizeTimeKey(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/\s+/g, "")
    .toLowerCase();
}

/**
 * Collapse fares to the cheapest per sector + airline + date + time.
 *
 * Same grouping the poster and the public site use. `ingestFaresFromN8n` writes
 * a new document per row on every upload, so duplicates are normal and this is
 * what makes the page show one price per flight.
 *
 * @param {Array<object>} fares  rows carrying a JS Date `flightDate`
 * @return {Array<object>}
 */
function dedupeDealFares(fares) {
  const rows = Array.isArray(fares) ? fares : [];
  const cheapest = new Map();

  rows.forEach((fare) => {
    if (!fare || !(fare.flightDate instanceof Date)) return;
    const price = Number(fare.finalRate);
    if (!Number.isFinite(price) || price <= 0) return;

    const key = [
      String(fare.sectorId || ""),
      String(fare.airlineId || ""),
      fare.flightDate.getTime(),
      normalizeTimeKey(fare.flightTime),
    ].join("|");

    const existing = cheapest.get(key);
    if (!existing || price < Number(existing.finalRate)) cheapest.set(key, fare);
  });

  return Array.from(cheapest.values()).sort((a, b) => {
    const dateDiff = a.flightDate.getTime() - b.flightDate.getTime();
    if (dateDiff !== 0) return dateDiff;
    return Number(a.finalRate) - Number(b.finalRate);
  });
}

/**
 * Reduce a fare document to exactly what the page renders.
 *
 * The allow-list is deliberate: adding a field here publishes it. `specialRate`,
 * `commission`, `finalRate`, `supplierRate` and `agentId` must never appear.
 *
 * @param {object} fare
 * @param {object|null} airline
 * @return {object}
 */
function projectDealFare(fare, airline) {
  const code = airline && airline.code ? airline.code : "";

  return {
    date: fare.flightDate.toISOString(),
    time: String(fare.flightTime || ""),
    airlineName: (airline && airline.name) || String(fare.airlineId || "") || "Airline",
    airlineCode: code,
    airlineLogo: (airline && airline.logoUrl) || "",
    checkInBaggageKg: resolveCheckInBaggageKg(code, fare.baggage),
    handBaggageKg: handBaggageKg(code),
    price: Math.round(Number(fare.finalRate)),
  };
}

/**
 * Group projected fares into the sector cards the page renders, keeping the
 * curator's sector order and dropping sectors that came back empty.
 *
 * @param {Array<object>} fares
 * @param {Map<string, object>} sectors
 * @param {Map<string, object>} airlines
 * @param {Array<string>} orderedSectorIds
 * @param {number} maxPerSector
 * @return {Array<object>}
 */
function buildDealSections(fares, sectors, airlines, orderedSectorIds, maxPerSector) {
  const bySector = new Map();
  fares.forEach((fare) => {
    const sectorId = String(fare.sectorId || "");
    if (!bySector.has(sectorId)) bySector.set(sectorId, []);
    bySector.get(sectorId).push(fare);
  });

  const ordered = [];
  const seen = new Set();
  (Array.isArray(orderedSectorIds) ? orderedSectorIds : []).forEach((id) => {
    if (bySector.has(id) && !seen.has(id)) {
      seen.add(id);
      ordered.push(id);
    }
  });
  bySector.forEach((_rows, id) => {
    if (!seen.has(id)) ordered.push(id);
  });

  const cap = Number(maxPerSector) > 0 ? Math.floor(Number(maxPerSector)) : 0;

  return ordered.map((sectorId) => {
    const sector = sectors.get(sectorId) || {};
    const rows = bySector.get(sectorId) || [];
    const shown = cap > 0 ? rows.slice(0, cap) : rows;
    const projected = shown.map((fare) => projectDealFare(fare, airlines.get(fare.airlineId) || null));
    if (!projected.length) return null;

    return {
      sectorCode: String(sector.sectorCode || ""),
      from: String(sector.sectorFrom || ""),
      to: String(sector.sectorTo || ""),
      lowestPrice: projected.reduce((low, row) => Math.min(low, row.price), Infinity),
      fares: projected,
    };
  }).filter(Boolean);
}

/**
 * Build the onRequest handler.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @return {import("firebase-functions/v2/https").HttpsFunction}
 */
function buildGetPublicDeals(db) {
  return onRequest({ region: "asia-south1", cors: true }, async (req, res) => {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    const rawSlug = (req.query && req.query.slug) || (req.body && req.body.slug) || "";
    const slug = normalizeDealSlug(rawSlug);
    if (!slug) {
      return res.status(400).json({ success: false, error: "MISSING_SLUG" });
    }

    try {
      const linkSnap = await db.collection("deal_links").doc(slug).get();

      // A missing link and a switched-off link are the same thing to a visitor:
      // the offer is gone. 404 both so the page shows one honest state.
      if (!linkSnap.exists || linkSnap.data().isActive !== true) {
        return res.status(404).json({ success: false, error: "LINK_NOT_AVAILABLE" });
      }

      const link = linkSnap.data();
      const sectorIds = Array.isArray(link.sectorIds) ? link.sectorIds : [];
      if (!sectorIds.length) {
        return res.status(200).json({
          success: true,
          link: { title: link.title || "", subtitle: link.subtitle || "" },
          sections: [],
        });
      }

      const { startDate, endDate } = resolveDealWindow(link);
      const chunks = chunkSectorIds(sectorIds);

      const [fareSnaps, sectorsSnap, airlinesSnap, detailsSnap] = await Promise.all([
        Promise.all(chunks.map((chunk) => db.collection("agent_fares")
          .where("isHidden", "==", false)
          .where("sectorId", "in", chunk)
          .where("flightDate", ">=", Timestamp.fromDate(startDate))
          .where("flightDate", "<=", Timestamp.fromDate(endDate))
          .get())),
        db.collection("sectors").get(),
        db.collection("airlines").get(),
        db.collection("flight_details").get(),
      ]);

      const sectors = new Map();
      sectorsSnap.forEach((doc) => sectors.set(doc.id, doc.data()));

      const airlines = new Map();
      airlinesSnap.forEach((doc) => airlines.set(doc.id, doc.data()));

      // Rows ingested before the flight-time round-trip was fixed store "", so
      // fall back to the configured route time. Resolve BEFORE deduping —
      // flight time is part of the grouping key.
      const flightDetailIndex = buildFlightDetailIndex(detailsSnap);

      const rows = [];
      fareSnaps.forEach((snap) => {
        snap.forEach((doc) => {
          const data = doc.data();
          const flightDate = data.flightDate && data.flightDate.toDate ? data.flightDate.toDate() : null;
          if (!flightDate) return;

          const flightTime = normalizeFlightTimeRange(data.flightTime) ||
            resolveScheduledFlightTime(
              flightDetailIndex.get(buildFlightDetailKey(data.airlineId, data.sectorId)),
              flightDate,
              normalizeFlightTimeRange,
            );

          rows.push({
            sectorId: data.sectorId,
            airlineId: data.airlineId,
            flightDate,
            flightTime,
            baggage: data.baggage,
            finalRate: data.finalRate,
          });
        });
      });

      const sections = buildDealSections(
        dedupeDealFares(rows),
        sectors,
        airlines,
        sectorIds,
        link.maxPerSector,
      );

      // Fire-and-forget: a failed counter must never cost the visitor a page.
      linkSnap.ref.update({
        viewCount: FieldValue.increment(1),
        lastViewedAt: FieldValue.serverTimestamp(),
      }).catch((err) => console.error(`viewCount bump failed for ${slug}:`, err));

      // Short shared cache: fares change through the day, but a link that just
      // went out to a WhatsApp group gets opened hundreds of times in a minute.
      res.set("Cache-Control", "public, max-age=0, s-maxage=60");

      return res.status(200).json({
        success: true,
        link: {
          title: link.title || "",
          subtitle: link.subtitle || "",
          windowStart: startDate.toISOString(),
          windowEnd: endDate.toISOString(),
        },
        sections,
      });
    } catch (error) {
      console.error("getPublicDeals failed:", error);
      return res.status(500).json({ success: false, error: "LOOKUP_FAILED" });
    }
  });
}

module.exports = {
  buildGetPublicDeals,
  dedupeDealFares,
  projectDealFare,
  buildDealSections,
};
