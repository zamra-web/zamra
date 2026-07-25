// Curated public deal links — the shared rules behind /deals/<slug>.
//
// A deal_links doc is a saved curation ("All Saudi Offers"): which sectors it
// covers and how far ahead it looks. The doc ID *is* the slug, so the public
// page resolves a link with a single getDoc — no query, no composite index.
//
// The page pulls fares live on every load, so an admin editing a rate is
// reflected without reissuing the link. That is the whole point of the feature.

/** Firestore rejects an `in` filter with more than 30 values. */
export const FIRESTORE_IN_LIMIT = 30;

const SLUG_MIN = 3;
const SLUG_MAX = 48;

/**
 * Normalize a title or hand-typed slug into a URL-safe one.
 * Returns '' when nothing usable survives — callers must treat that as invalid.
 */
export function normalizeDealSlug(raw) {
  const slug = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, '');

  return slug.length >= SLUG_MIN ? slug : '';
}

export function isValidDealSlug(raw) {
  return normalizeDealSlug(raw) === String(raw ?? '').trim().toLowerCase();
}

function startOfDay(date) {
  const copy = new Date(date.getTime());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date) {
  const copy = new Date(date.getTime());
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value.toDate === 'function') {
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
 * re-anchors to today on every visit, so a link posted in a WhatsApp group in
 * March is still showing live dates in June.
 *
 * `rollingDays` counts days AHEAD of today; the final day runs to 23:59:59.
 *
 * @param {object} link  { windowMode, rollingDays, startDate, endDate }
 * @param {Date}  [now]
 * @returns {{startDate: Date, endDate: Date}}
 */
export function resolveDealWindow(link, now = new Date()) {
  const today = startOfDay(now);

  if (link?.windowMode === 'fixed') {
    const start = toDate(link.startDate);
    const end = toDate(link.endDate);
    if (start && end) {
      return { startDate: startOfDay(start), endDate: endOfDay(end) };
    }
  }

  const days = Number(link?.rollingDays);
  const rollingDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 30;
  const end = new Date(today.getTime());
  end.setDate(end.getDate() + rollingDays);

  return { startDate: today, endDate: endOfDay(end) };
}

/**
 * Split sector ids into Firestore-safe `in` chunks.
 *
 * A shortcut like "Calicut → Saudi" can resolve to more sectors than Firestore
 * allows in one `in` filter, and exceeding it fails the whole query rather than
 * truncating it.
 */
export function chunkSectorIds(ids, size = FIRESTORE_IN_LIMIT) {
  const unique = [...new Set((Array.isArray(ids) ? ids : []).map((id) => String(id ?? '').trim()).filter(Boolean))];
  const chunkSize = Math.max(1, Math.min(Number(size) || FIRESTORE_IN_LIMIT, FIRESTORE_IN_LIMIT));

  const chunks = [];
  for (let i = 0; i < unique.length; i += chunkSize) {
    chunks.push(unique.slice(i, i + chunkSize));
  }
  return chunks;
}

/** Read the slug out of `/deals/<slug>` or `/deals?s=<slug>`. */
export function parseDealSlugFromLocation({ pathname = '', search = '' } = {}) {
  const fromPath = String(pathname).match(/\/deals\/([^/?#]+)/i);
  if (fromPath && fromPath[1]) return normalizeDealSlug(decodeURIComponent(fromPath[1]));

  const match = String(search).match(/[?&]s=([^&#]+)/i);
  if (match && match[1]) return normalizeDealSlug(decodeURIComponent(match[1]));

  return '';
}

/** The canonical shareable URL for a link. */
export function buildDealLinkUrl(slug, origin = '') {
  const safeSlug = normalizeDealSlug(slug);
  if (!safeSlug) return '';
  return `${String(origin).replace(/\/+$/, '')}/deals/${safeSlug}`;
}
