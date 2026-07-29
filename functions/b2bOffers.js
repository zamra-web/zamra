"use strict";

/**
 * b2bOffers.js — featured-offer serving rules for getB2BPortalContext.
 *
 * CommonJS mirror of the liveness half of `web/src/js/shared/b2b-offers.js`.
 * Any change to isOfferLive()/offerLastLiveDate() must be made in BOTH files,
 * or the portal and the admin dashboard will disagree about which deals are
 * still running.
 *
 * Offers are served through the callable rather than read from Firestore by
 * the portal so that expiry is enforced server-side and a stale browser tab
 * cannot keep an expired deal on screen.
 */

const { normalizeAirlineCode, resolveCheckInBaggageKg } = require("./airlineBaggage");

function cleanText(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function cleanCode(value) {
  return cleanText(value).toUpperCase().slice(0, 4);
}

/** Any date-ish value → 'YYYY-MM-DD', or "" when it cannot be read. */
function toDateKey(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
  }
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Today in IST — offers are sold on Indian calendar days. */
function todayKeyIST(now) {
  const base = now instanceof Date ? now : new Date();
  return new Date(base.getTime() + (5.5 * 60 * 60 * 1000)).toISOString().slice(0, 10);
}

/**
 * The day an offer stops showing, inclusive: an explicit expiry wins, otherwise
 * the travel date — a deal for a flight that has already left is not a deal.
 */
function offerLastLiveDate(offer) {
  return toDateKey(offer && offer.expiresAt) || toDateKey(offer && offer.travelDate);
}

function isOfferLive(offer, todayKey) {
  if (!offer || offer.isActive === false) return false;
  const last = offerLastLiveDate(offer);
  // No date at all is an evergreen card — it runs until switched off.
  if (!last) return true;
  return last >= String(todayKey || "");
}

/**
 * Strips a raw document down to what the portal is allowed to see. Everything
 * on an offer is admin-authored promotional copy, so nothing here is secret —
 * but going through an explicit allow-list keeps a future internal field
 * (cost, supplier, notes) from leaking the moment it is added.
 */
function sanitizeOffer(doc) {
  const airlineCode = normalizeAirlineCode(doc.airlineCode);
  const price = Number(doc.price);
  return {
    id: doc.id || "",
    badge: cleanText(doc.badge).toUpperCase(),
    badgeTone: cleanText(doc.badgeTone) || "hot",
    originCity: cleanText(doc.originCity),
    originCode: cleanCode(doc.originCode),
    destCity: cleanText(doc.destCity),
    destCode: cleanCode(doc.destCode),
    airlineId: cleanText(doc.airlineId),
    airlineName: cleanText(doc.airlineName),
    airlineCode,
    travelDate: toDateKey(doc.travelDate),
    checkInBaggageKg: resolveCheckInBaggageKg(airlineCode, doc.checkInBaggageKg),
    price: Number.isFinite(price) && price > 0 ? Math.round(price) : 0,
    priceNote: cleanText(doc.priceNote),
    ctaType: doc.ctaType === "search" ? "search" : "whatsapp",
    ctaLabel: cleanText(doc.ctaLabel),
    order: Number.isFinite(Number(doc.order)) ? Number(doc.order) : 0,
  };
}

/**
 * Live offers for one agent, in display order.
 *
 * An offer departing from an origin the agent cannot see is dropped: promoting
 * a route they are not allowed to search would be an advert for a dead end.
 * Route-level (`hiddenSectorIds`) restrictions are deliberately NOT applied —
 * an offer is a marketing card, not a sector, and has no sector id to match.
 *
 * @param {Array<object>} docs   raw b2b_offers documents (with `id`)
 * @param {object} agent         b2b_agents doc data
 * @param {string} todayKey      'YYYY-MM-DD' in IST
 */
function filterOffersForAgent(docs, agent, todayKey) {
  const hiddenOrigins = ((agent && agent.hiddenOrigins) || [])
    .map((code) => String(code).trim().toUpperCase());

  return (Array.isArray(docs) ? docs : [])
    .filter((doc) => isOfferLive(doc, todayKey))
    .map(sanitizeOffer)
    .filter((offer) => offer.originCode && offer.destCode)
    .filter((offer) => !hiddenOrigins.includes(offer.originCode))
    .sort((a, b) =>
      a.order - b.order ||
      a.travelDate.localeCompare(b.travelDate) ||
      `${a.originCode}${a.destCode}`.localeCompare(`${b.originCode}${b.destCode}`));
}

module.exports = {
  toDateKey,
  todayKeyIST,
  offerLastLiveDate,
  isOfferLive,
  sanitizeOffer,
  filterOffersForAgent,
};
