// Matching customer enquiries against live fares.
//
// An enquiry records what a customer asked for — one or more sectors, a travel
// window, and optionally the price they want to pay. These helpers answer two
// questions:
//
//   · "Show me the fares that match this enquiry"   → matchFaresToEnquiry
//   · "Has anything dropped below their target?"    → evaluateEnquiryAlerts
//
// Both are pure so the admin can run them client-side over already-loaded fares
// without a round trip.

function toMillis(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.getTime();
  }
  if (typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.getTime() : null;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

/** Start-of-day in local time, so a date-only window includes the whole day. */
function startOfDayMs(value) {
  const ms = toMillis(value);
  if (ms === null) return null;
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function endOfDayMs(value) {
  const ms = toMillis(value);
  if (ms === null) return null;
  const date = new Date(ms);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

function toRate(value) {
  // Guard the empties explicitly: Number(null) and Number('') are both 0, which
  // would turn "no target set" into "target of ₹0" and alert on every fare.
  if (value === null || value === undefined || value === '') return null;
  const rate = Number(value);
  return Number.isFinite(rate) ? rate : null;
}

/**
 * The sectors an enquiry covers, in the order they were entered.
 *
 * One customer often asks about several routes at once ("CCJ–JED or COK–JED"),
 * so `sectorIds` is the field of record. Enquiries logged before that existed
 * carry a single `sectorId` and nothing rewrites them, so every reader must go
 * through here rather than touching either field directly.
 *
 * @param {object} enquiry
 * @returns {string[]}  trimmed, de-duplicated, empties dropped
 */
export function getEnquirySectorIds(enquiry) {
  if (!enquiry) return [];

  const raw = Array.isArray(enquiry.sectorIds) && enquiry.sectorIds.length
    ? enquiry.sectorIds
    : [enquiry.sectorId];

  const ids = [];
  const seen = new Set();
  raw.forEach((value) => {
    const id = String(value ?? '').trim();
    if (!id || seen.has(id)) return;
    seen.add(id);
    ids.push(id);
  });
  return ids;
}

/**
 * Fares that satisfy an enquiry, cheapest first.
 *
 * A fare on *any* of the enquiry's sectors counts — the customer asked about
 * all of them, so the cheapest across the set is the answer they want.
 *
 * Hidden fares never match — they are not sellable, so quoting one to a customer
 * would be worse than showing nothing.
 *
 * @param {object}   enquiry  { sectorIds (or legacy sectorId), startDate, endDate }
 * @param {object[]} fares
 * @returns {object[]}
 */
export function matchFaresToEnquiry(enquiry, fares) {
  const sectorIds = getEnquirySectorIds(enquiry);
  if (!sectorIds.length) return [];
  const rows = Array.isArray(fares) ? fares.filter(Boolean) : [];
  if (!rows.length) return [];

  const wantedSectors = new Set(sectorIds);
  const fromMs = startOfDayMs(enquiry.startDate);
  const toMs = endOfDayMs(enquiry.endDate);

  return rows
    .filter((fare) => {
      if (fare.isHidden) return false;
      if (!wantedSectors.has(String(fare.sectorId ?? '').trim())) return false;

      const flightMs = toMillis(fare.flightDate);
      if (flightMs === null) return false;
      if (fromMs !== null && flightMs < fromMs) return false;
      if (toMs !== null && flightMs > toMs) return false;

      return toRate(fare.finalRate) !== null;
    })
    .sort((a, b) => {
      const rateDiff = toRate(a.finalRate) - toRate(b.finalRate);
      if (rateDiff !== 0) return rateDiff;
      return (toMillis(a.flightDate) ?? 0) - (toMillis(b.flightDate) ?? 0);
    });
}

/**
 * Score every open enquiry against the current fares.
 *
 * Only enquiries that are still open AND carry a numeric target can raise an
 * alert — a logged enquiry with no target is a record, not a watch.
 *
 * @returns {{enquiryId: string, matchCount: number, bestRate: number|null,
 *            targetFare: number|null, meetsTarget: boolean}[]}
 */
export function evaluateEnquiryAlerts(enquiries, fares) {
  const rows = Array.isArray(enquiries) ? enquiries.filter(Boolean) : [];
  if (!rows.length) return [];

  return rows.map((enquiry) => {
    const matches = matchFaresToEnquiry(enquiry, fares);
    const bestRate = matches.length ? toRate(matches[0].finalRate) : null;
    const targetFare = toRate(enquiry.targetFare);
    const isOpen = (enquiry.status ?? 'open') === 'open';

    return {
      enquiryId: enquiry.id,
      matchCount: matches.length,
      bestRate,
      targetFare,
      meetsTarget: Boolean(
        isOpen && targetFare !== null && bestRate !== null && bestRate <= targetFare,
      ),
    };
  });
}

/** How many enquiries are currently below their target — drives the nav dot. */
export function countEnquiryAlerts(enquiries, fares) {
  return evaluateEnquiryAlerts(enquiries, fares).filter((row) => row.meetsTarget).length;
}
