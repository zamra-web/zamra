/**
 * Which already-stored fares does a new upload replace?
 *
 * The pure half of supersede-on-ingest. No Firestore, no network — index.js
 * supplies the documents it read and applies the ids this returns.
 *
 * The problem this exists for: ingestFaresFromN8n writes a new auto-id document
 * per row and never updates one, while every projection that reads those rows
 * (getPublicFares, getPublicDeals, getB2BFares) dedupes a sector+airline+date+
 * time group by MINIMUM price. Those two behaviours are individually reasonable
 * and jointly wrong. A supplier who revises a fare downward is served correctly
 * by accident; a supplier who revises upward is not served at all, because the
 * superseded cheaper row keeps winning the dedupe forever.
 *
 * That is not a rare shape. Glansa sent four revisions in five messages on a
 * single morning, twice for the same sector; Airguide revised three times in
 * twenty minutes. Automating intake multiplies the frequency of exactly the
 * update this pipeline handles worst, which is why the fix landed alongside it.
 *
 * Hiding rather than deleting is deliberate. `ingestBatchId` and the one-click
 * batch delete in the dashboard both assume a row is a historical record of what
 * a supplier quoted, and reconstructing "what were we selling at 11:00" matters
 * when a customer disputes a price. isHidden already means "exists, not for
 * sale", and all four projections filter on it.
 */

"use strict";

/**
 * Identity of a quoted flight: one supplier's price for one sector, on one
 * airline, on one date, leaving at one time.
 *
 * Deliberately the same tuple the dedupes key on — `[sectorId, airlineId,
 * date, flightTime]` in computeB2BFares and dedupeAndSortFares — plus agentId.
 * If this key were coarser than theirs, superseding would hide a row they treat
 * as a separate flight; if it were finer, a revision would not find its target.
 *
 * agentId is non-negotiable. Two suppliers quoting the same flight are two
 * offers, and Zamra picks between them on price — a key without agentId would
 * let one supplier's morning sheet silently delist a competitor's.
 *
 * flightTime is included even though it is the field most likely to drift
 * between a sheet and its revision, and that costs us some supersedes. It is the
 * right trade: suppliers really do sell the same sector twice a day at different
 * prices (Travel Wallet prints MRNG and EVENING blocks), so a key without it
 * would let an evening revision delist the morning flight. Missing a supersede
 * leaves a duplicate an admin can see and delete; over-superseding silently
 * removes a fare that was still for sale.
 *
 * @param {{agentId?: string, sectorId?: string, airlineId?: string,
 *          flightDate?: object|Date|number|string, flightTime?: string}} fare
 * @returns {string|null} null when the fare is too incomplete to be identified
 */
function fareIdentityKey(fare) {
  const src = fare && typeof fare === "object" ? fare : {};

  const agentId = String(src.agentId ?? "").trim();
  const sectorId = String(src.sectorId ?? "").trim();
  const airlineId = String(src.airlineId ?? "").trim();
  // A row missing any of these cannot be matched to a revision with confidence,
  // and guessing is how the wrong fare gets delisted. Fail closed: no key means
  // no supersede, which leaves a duplicate rather than removing a live price.
  if (!agentId || !sectorId || !airlineId) return null;

  const dateMs = flightDateMs(src.flightDate);
  if (dateMs === null) return null;

  // "" and "20:15" are different flights, not a missing value to be filled in.
  const flightTime = String(src.flightTime ?? "").trim();

  return [agentId, sectorId, airlineId, dateMs, flightTime].join("|");
}

/**
 * Normalise the several shapes flightDate arrives in to epoch ms.
 *
 * Firestore hands back a Timestamp, the ingest path builds one from an ISO
 * date, and the tests pass Dates and numbers. Comparing them as strings would
 * make a Timestamp and its own Date never match.
 *
 * @param {object|Date|number|string} value
 * @returns {number|null}
 */
function flightDateMs(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value.toDate === "function") {
    const asDate = value.toDate();
    return Number.isNaN(asDate.getTime()) ? null : asDate.getTime();
  }
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Which of the stored fares are replaced by this upload?
 *
 * @param {Array<object>} incoming  resolved rows about to be written
 * @param {Array<object>} existing  stored docs, each with an `id`
 * @returns {Array<string>} ids to hide; never includes an already-hidden doc
 */
function planSupersede(incoming, existing) {
  const keys = new Set();
  for (const fare of Array.isArray(incoming) ? incoming : []) {
    const key = fareIdentityKey(fare);
    if (key) keys.add(key);
  }
  if (keys.size === 0) return [];

  const ids = [];
  const seen = new Set();
  for (const doc of Array.isArray(existing) ? existing : []) {
    const id = String(doc?.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    // Already invisible — hiding it again would only churn updatedAt and burn a
    // write, and it may have been hidden by an admin for a reason of their own.
    if (doc?.isHidden === true) continue;

    const key = fareIdentityKey(doc);
    if (!key || !keys.has(key)) continue;

    seen.add(id);
    ids.push(id);
  }
  return ids;
}

/**
 * The date window an upload can possibly supersede within.
 *
 * Lets index.js read one bounded query per supplier — `agentId ==` plus a
 * flightDate range, which the existing agentId+flightDate composite index
 * already serves — instead of a query per row.
 *
 * @param {Array<object>} incoming
 * @returns {{min: Date, max: Date}|null} null when nothing is dateable
 */
function supersedeDateRange(incoming) {
  let min = null;
  let max = null;
  for (const fare of Array.isArray(incoming) ? incoming : []) {
    const ms = flightDateMs(fare?.flightDate);
    if (ms === null) continue;
    if (min === null || ms < min) min = ms;
    if (max === null || ms > max) max = ms;
  }
  return min === null ? null : { min: new Date(min), max: new Date(max) };
}

module.exports = {
  fareIdentityKey,
  planSupersede,
  supersedeDateRange,
  flightDateMs,
};
