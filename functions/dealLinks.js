"use strict";

// Deal-link rules for Cloud Functions — CommonJS mirror of
// `web/src/js/shared/deal-links.js`. Any rule change must be made in BOTH
// files; the browser bundle cannot import from `functions/`.
//
// The admin dashboard uses the ESM copy to create links; `getPublicDeals` uses
// this copy to serve them. Paired test suites assert the same behaviour on both
// sides — `web/tests/deal-links.test.js` and `functions/tests/deal-links.test.js`.

/** Firestore rejects an `in` filter with more than 30 values. */
const FIRESTORE_IN_LIMIT = 30;

const SLUG_MIN = 3;
const SLUG_MAX = 48;

/**
 * Normalize a title or hand-typed slug into a URL-safe one.
 * Returns "" when nothing usable survives — callers must treat that as invalid.
 * @param {*} raw
 * @return {string}
 */
function normalizeDealSlug(raw) {
  const slug = String(raw === null || raw === undefined ? "" : raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");

  return slug.length >= SLUG_MIN ? slug : "";
}

/**
 * @param {Date} date
 * @return {Date}
 */
function startOfDay(date) {
  const copy = new Date(date.getTime());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * @param {Date} date
 * @return {Date}
 */
function endOfDay(date) {
  const copy = new Date(date.getTime());
  copy.setHours(23, 59, 59, 999);
  return copy;
}

/**
 * @param {*} value
 * @return {Date|null}
 */
function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value.toDate === "function") {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * The travel window a link should show right now.
 *
 * A `rolling` window is what makes a shared link stay useful: "next 30 days"
 * re-anchors to today on every request, so a link posted in a WhatsApp group in
 * March is still showing live dates in June. `rollingDays` counts days AHEAD of
 * today; the final day runs to 23:59.
 *
 * @param {object} link
 * @param {Date} [now]
 * @return {{startDate: Date, endDate: Date}}
 */
function resolveDealWindow(link, now) {
  const clock = now instanceof Date ? now : new Date();
  const today = startOfDay(clock);

  if (link && link.windowMode === "fixed") {
    const start = toDate(link.startDate);
    const end = toDate(link.endDate);
    if (start && end) {
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    }
  }

  const days = Number(link && link.rollingDays);
  const rollingDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 30;
  const end = new Date(today.getTime());
  end.setDate(end.getDate() + rollingDays);

  return { startDate: today, endDate: endOfDay(end) };
}

/**
 * Split sector ids into Firestore-safe `in` chunks.
 *
 * Exceeding the limit fails the whole query rather than truncating it, so this
 * is not optional for a country-wide link.
 *
 * @param {Array<string>} ids
 * @param {number} [size]
 * @return {Array<Array<string>>}
 */
function chunkSectorIds(ids, size) {
  const source = Array.isArray(ids) ? ids : [];
  const unique = [];
  const seen = new Set();

  source.forEach((id) => {
    const trimmed = String(id === null || id === undefined ? "" : id).trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    unique.push(trimmed);
  });

  const requested = Number(size) || FIRESTORE_IN_LIMIT;
  const chunkSize = Math.max(1, Math.min(requested, FIRESTORE_IN_LIMIT));

  const chunks = [];
  for (let i = 0; i < unique.length; i += chunkSize) {
    chunks.push(unique.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  FIRESTORE_IN_LIMIT,
  normalizeDealSlug,
  resolveDealWindow,
  chunkSectorIds,
};
