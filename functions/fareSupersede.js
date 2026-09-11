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
 * Both halves of this file DELETE the rows they name. index.js applies them
 * with `batch.delete()`; nothing here hides any more.
 *
 * A supersede hid its row until 2026-09-12, to keep "what were we selling at
 * 11:00" readable when a customer disputes a price. That reasoning assumed the
 * collection was cleared daily. It was not: the hidden rows accumulated — 5,509
 * of them against 2,191 live, every one a price with its own replacement
 * sitting beside it — and nothing but the audit story ever read one. The audit
 * story moved to Cloud Logging, which keeps it for 30 days without growing a
 * collection every projection has to filter.
 *
 * Deleting the replaced row costs one thing that mattered, and it is paid for
 * separately: `annotateFarePriceDrops` detected a re-upload price drop by
 * comparing a new row against its older siblings, which are exactly the rows a
 * supersede now removes. priorFinalRates() below is what replaces them — ingest
 * stamps the old price onto the NEW row as `previousFinalRate`, so the drop is
 * readable off one document instead of a relationship between two.
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
 * Hidden rows are included. A row carrying isHidden is still a quote for a
 * flight this upload has just re-priced, and since nothing collects hidden rows
 * any more, skipping one would strand it in the collection forever. It also
 * changes nothing an admin can see: ingest writes the replacement visible
 * regardless, so a hide on the row being replaced was already being undone by
 * the same upload.
 *
 * @param {Array<object>} incoming  resolved rows about to be written
 * @param {Array<object>} existing  stored docs, each with an `id`
 * @returns {Array<string>} ids to delete
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

    const key = fareIdentityKey(doc);
    if (!key || !keys.has(key)) continue;

    seen.add(id);
    ids.push(id);
  }
  return ids;
}

/**
 * What each flight was selling at before this upload.
 *
 * The price-drop half of supersede-by-delete. `annotateFarePriceDrops` used to
 * read a re-upload drop as a relationship between a new row and its older
 * siblings; those siblings are exactly what planSupersede now deletes, so the
 * relationship has to be written onto the surviving row instead. index.js looks
 * each incoming row up here and, when it is cheaper than what was stored,
 * stamps `previousFinalRate` + `rateChangedAt` — the same two fields an admin
 * edit writes, read by the same branch of the same function, so nothing
 * downstream needed changing.
 *
 * The MINIMUM is the right "before" price, not the newest: every projection
 * dedupes a group by minimum price, so the lowest stored row is what the public
 * site, the posters and the portal were actually showing.
 *
 * @param {Array<object>} existing  stored docs for one supplier
 * @returns {Map<string, number>} identity key → lowest stored finalRate
 */
function priorFinalRates(existing) {
  const rates = new Map();
  for (const doc of Array.isArray(existing) ? existing : []) {
    const key = fareIdentityKey(doc);
    if (!key) continue;
    // A hidden row still priced this flight, and it is about to be deleted with
    // the rest of the group — its price is part of the "before" either way.
    const rate = Number(doc?.finalRate);
    if (!Number.isFinite(rate) || rate <= 0) continue;
    const seen = rates.get(key);
    if (seen === undefined || rate < seen) rates.set(key, rate);
  }
  return rates;
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

// ── absence as a sold-out signal ────────────────────────────────────────────
//
// The half above handles a supplier who RE-QUOTES a flight: the new row hides
// the old one. It cannot handle the other half of the same daily habit — a
// flight that was on yesterday's sheet and is simply GONE from today's.
//
// Most suppliers never write "sold out". They send tomorrow's list, and the
// flights they have stopped selling are absent from it. Nothing in the pipeline
// read that absence, so those fares stayed live and bookable at yesterday's
// price forever — the single worst failure this system can produce, because it
// sells a seat that does not exist.
//
// Reading absence is dangerous in a way reading a revision is not. A revision
// is evidence about one flight; absence is evidence only if the new sheet
// actually COVERS the flight it omits. Three things can each make that false,
// and each one would silently delist fares that are still for sale:
//
//   scope     A sheet that quotes only CCJ-DXB says nothing about CCJ-JED.
//   session   Suppliers send one sheet as several messages, and intake splits
//             those into separate batches on a 90s quiet window. Batch 1
//             (CCJ-DXB) must not delist what batch 2 (CCJ-JED) is about to
//             restate — nor what batch 2 already restated three minutes ago.
//   intent    A one-line correction at 20:00 ("CCJ DXB IX 46700") is not a
//             claim that the G9 on that route sold out. It is one price.
//
// So absence is only read where all three are answered, by three guards that
// each fail closed:
//
//   coverage  Only a sector+date group the incoming sheet actually quoted is
//             swept. An unmentioned route is never touched.
//   minRows   The upload must carry enough rows to be a LIST rather than a
//             correction. A supplier who sends one message per sector never
//             trips this, and that is the right answer for them: their sheet
//             arrives across many batches, so per-batch absence measures
//             nothing.
//   minAge    Only rows older than the current sheet-sending session are
//             sweepable. This is what makes `session` safe, and it is why the
//             feature matches the habit it was built for — "the next day, they
//             send the next list". Yesterday's row is ~24h old; a sibling
//             batch's row is minutes old and protected.
//
// On top of those it is opt-in per supplier (`agents.rateIntakeAbsenceSoldOut`)
// behind a global switch (`config/whatsapp.rateIntakeAbsenceSoldOut`), because
// "absence means sold out" is a fact about a supplier's habits, not about fares.
//
// What index.js does with the ids this returns is DELETE the documents, not
// hide them — the one place in this file where that is true. A superseded row
// is history: the price a supplier quoted before the one that replaced it, and
// the replacement is right there to read it against. A row that dropped off the
// sheet has no successor and is not a price at all any more; hiding it left
// `agent_fares` accumulating rows no projection will ever read again, each one
// an un-hide away from putting a seat that does not exist back on sale.
//
// That makes the sweep irreversible, which changes nothing about the algorithm
// and everything about its defaults: every ambiguous case below already fails
// closed, and it must keep doing so — there is no un-hide to recover from a
// wrong call now, only the supplier's next sheet.

/**
 * How many rows one supplier must quote in a single upload before absence
 * within it is treated as evidence.
 *
 * Six is chosen to sit above a correction and below a daily sheet. The desks
 * this is for print a dozen-plus rows; a supplier fixing one price sends one.
 * Set it higher for a supplier who sends large partial sheets.
 */
const DEFAULT_ABSENCE_MIN_ROWS = 6;

/**
 * How old a stored row must be before absence may hide it.
 *
 * Six hours, which is the gap between "another message in this morning's
 * sheet" and "yesterday's sheet". It has to clear the whole of a
 * sheet-sending session — intake's own max-hold is 20 minutes, but a supplier
 * who revises all morning keeps producing batches for hours, and every one of
 * those batches must leave the others' rows alone.
 */
const DEFAULT_ABSENCE_MIN_AGE_MS = 6 * 60 * 60 * 1000;

/**
 * The scope a fare sits inside: one supplier, one route, one date.
 *
 * Deliberately coarser than fareIdentityKey by exactly airline and flightTime —
 * those are what an absent row differs from a quoted one BY. It is also exactly
 * the granularity applySoldOut deletes on for an explicit notice, so a flight
 * that vanishes from a sheet and a flight named in a "SOLD OUT" message are
 * treated as the same claim about the same thing, and removed the same way.
 *
 * @param {object} fare
 * @returns {string|null} null when the fare cannot be placed in a group
 */
function fareCoverageKey(fare) {
  const src = fare && typeof fare === "object" ? fare : {};

  const agentId = String(src.agentId ?? "").trim();
  const sectorId = String(src.sectorId ?? "").trim();
  if (!agentId || !sectorId) return null;

  const dateMs = flightDateMs(src.flightDate);
  if (dateMs === null) return null;

  return [agentId, sectorId, dateMs].join("|");
}

/**
 * Which stored fares has this upload implicitly sold out by omitting them?
 *
 * Pure, and deliberately given the SAME `existing` array planSupersede reads,
 * so index.js answers both questions from one query per supplier. The two
 * results are disjoint by construction: a row whose identity key is in the
 * upload is a revision, and is excluded here.
 *
 * The caller DELETES these documents. Returning an id is therefore a decision
 * that cannot be walked back, which is why every branch below prefers keeping
 * a row over sweeping one.
 *
 * @param {Array<object>} incoming  resolved rows about to be written, one supplier
 * @param {Array<object>} existing  stored docs for that supplier, each with `id`
 * @param {object} [options]
 * @param {Date|number} [options.now]      evaluated against each row's createdAt
 * @param {number} [options.minRows]       DEFAULT_ABSENCE_MIN_ROWS
 * @param {number} [options.minAgeMs]      DEFAULT_ABSENCE_MIN_AGE_MS
 * @returns {Array<string>} ids to delete as sold out, hidden rows included
 */
function planAbsenceSoldOut(incoming, existing, {
  now = new Date(),
  minRows = DEFAULT_ABSENCE_MIN_ROWS,
  minAgeMs = DEFAULT_ABSENCE_MIN_AGE_MS,
} = {}) {
  const rows = Array.isArray(incoming) ? incoming : [];

  // Guard 2 (minRows): too small to be a list. Note this counts ROWS, not
  // identifiable ones — a sheet of twenty rows that resolved badly enough to
  // leave five keyed is not a sheet we should be reading absence from either,
  // and the coverage set below is what enforces that.
  if (rows.length < Math.max(1, Number(minRows) || 0)) return [];

  const covered = new Set();
  const quoted = new Set();
  for (const fare of rows) {
    // Every row is a statement about its route and date, including one carrying
    // show:"no". A supplier who writes "CCJ DXB 15 SEP SOLD OUT" inside a sheet
    // is covering that group, not staying silent about it.
    const coverage = fareCoverageKey(fare);
    if (coverage) covered.add(coverage);
    const identity = fareIdentityKey(fare);
    if (identity) quoted.add(identity);
  }
  if (covered.size === 0) return [];

  const nowMs = now instanceof Date ? now.getTime() : Number(now);
  const ageCutoff = Number.isFinite(nowMs)
    ? nowMs - Math.max(0, Number(minAgeMs) || 0)
    : null;

  const ids = [];
  const seen = new Set();
  for (const doc of Array.isArray(existing) ? existing : []) {
    const id = String(doc?.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    // A hidden row is swept too, and that is deliberate. Whoever hid it — an
    // admin, a supersede, a `show: "no"` line — was saying "not for sale"; this
    // sheet is saying the flight is gone. Leaving it behind only kept a dead row
    // in the collection that an un-hide could put back on sale.

    // Guard 1 (coverage): the sheet said nothing about this route and date.
    const coverage = fareCoverageKey(doc);
    if (!coverage || !covered.has(coverage)) continue;

    // Re-quoted, so alive. planSupersede hides the row this one replaces.
    const identity = fareIdentityKey(doc);
    if (identity && quoted.has(identity)) continue;

    // Guard 3 (minAge). A row we cannot date is NOT swept: unlike a missed
    // revision, an over-eager sweep deletes a fare that was still for sale, and
    // there is no undo — that asymmetry decides every ambiguous case here.
    if (ageCutoff === null) continue;
    const createdMs = flightDateMs(doc?.createdAt);
    if (createdMs === null || createdMs > ageCutoff) continue;

    seen.add(id);
    ids.push(id);
  }
  return ids;
}

module.exports = {
  fareIdentityKey,
  fareCoverageKey,
  planSupersede,
  priorFinalRates,
  planAbsenceSoldOut,
  supersedeDateRange,
  flightDateMs,
  DEFAULT_ABSENCE_MIN_ROWS,
  DEFAULT_ABSENCE_MIN_AGE_MS,
};
