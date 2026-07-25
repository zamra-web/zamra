// Detecting "this fare just got cheaper".
//
// A price drop reaches the database two different ways, and only one of them is
// visible on a single document:
//
//   1. EDIT     — an admin lowers finalRate on an existing row. `updateFare`
//                 stamps `previousFinalRate` + `rateChangedAt`, so the drop is
//                 readable straight off the doc.
//
//   2. RE-UPLOAD— `ingestFaresFromN8n` writes a BRAND-NEW auto-ID doc for every
//                 row of every rate sheet (functions/index.js — `.doc()` with no
//                 id). It never updates or dedupes. So a cheaper re-upload is a
//                 *new duplicate row* sitting beside the old one, and the drop
//                 only exists as a relationship BETWEEN rows.
//
// Case 2 is why this module groups rows the same way the poster and the public
// site do (sector + airline + date + time) and compares each row against its
// strictly older siblings.

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Milliseconds for a Date, Firestore Timestamp, epoch number, or date string. */
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

function normalizeTimeKey(flightTime) {
  return String(flightTime ?? '').replace(/\s+/g, '').toLowerCase();
}

function toRate(value) {
  // Number(null) and Number('') are 0 — treat the empties as "no rate" so a
  // missing previousFinalRate can never look like a drop to zero.
  if (value === null || value === undefined || value === '') return null;
  const rate = Number(value);
  return Number.isFinite(rate) ? rate : null;
}

/**
 * Group key for "the same flight on the same day".
 *
 * Matches the grouping used by `dedupeAndSortPosterFares` in admin/main.js and
 * `dedupeAndSortFares` in web/flight-results.js, so what the staff see flagged
 * lines up with what the poster and the public site collapse together.
 */
export function buildFareGroupKey(fare) {
  if (!fare) return '';
  const dateMs = toMillis(fare.flightDate);
  return [
    String(fare.sectorId ?? '').trim().toLowerCase(),
    String(fare.airlineId ?? '').trim().toLowerCase(),
    dateMs === null ? '' : String(dateMs),
    normalizeTimeKey(fare.flightTime),
  ].join('|');
}

/**
 * Flag every fare whose rate has recently come down.
 *
 * @param {object[]} fares
 * @param {object}  [options]
 * @param {Date}    [options.now]        clock, for testing
 * @param {number}  [options.maxAgeMs]   ignore drops older than this (default 7d,
 *                                       pass null to keep every drop)
 * @returns {Map<string, {kind: 'edit'|'reupload', previousRate: number,
 *                        currentRate: number, delta: number, changedAt: Date|null}>}
 */
export function annotateFarePriceDrops(fares, { now = new Date(), maxAgeMs = DEFAULT_MAX_AGE_MS } = {}) {
  const drops = new Map();
  const rows = Array.isArray(fares) ? fares.filter((fare) => fare && fare.id) : [];
  if (!rows.length) return drops;

  const nowMs = toMillis(now) ?? Date.now();
  const withinWindow = (ms) => {
    if (maxAgeMs === null || maxAgeMs === undefined) return true;
    if (ms === null) return false;
    return nowMs - ms <= maxAgeMs;
  };

  // ── 1. Edits — the drop is stored on the document itself ───────────────────
  rows.forEach((fare) => {
    const previousRate = toRate(fare.previousFinalRate);
    const currentRate = toRate(fare.finalRate);
    if (previousRate === null || currentRate === null) return;
    if (currentRate >= previousRate) return;

    const changedAtMs = toMillis(fare.rateChangedAt);
    if (!withinWindow(changedAtMs)) return;

    drops.set(fare.id, {
      kind: 'edit',
      previousRate,
      currentRate,
      delta: previousRate - currentRate,
      changedAt: changedAtMs === null ? null : new Date(changedAtMs),
    });
  });

  // ── 2. Re-uploads — the drop only exists between sibling rows ──────────────
  const groups = new Map();
  rows.forEach((fare) => {
    const key = buildFareGroupKey(fare);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(fare);
  });

  groups.forEach((siblings) => {
    if (siblings.length < 2) return;

    const ordered = siblings
      .map((fare, index) => ({ fare, index, createdMs: toMillis(fare.createdAt) ?? 0 }))
      .sort((a, b) => (a.createdMs - b.createdMs) || (a.index - b.index));

    let cheapestSoFar = null;

    ordered.forEach(({ fare, createdMs }) => {
      const currentRate = toRate(fare.finalRate);
      if (currentRate === null) return;

      if (cheapestSoFar !== null && currentRate < cheapestSoFar && withinWindow(createdMs)) {
        // An edit-derived drop is more precise, so never overwrite one.
        if (!drops.has(fare.id)) {
          drops.set(fare.id, {
            kind: 'reupload',
            previousRate: cheapestSoFar,
            currentRate,
            delta: cheapestSoFar - currentRate,
            changedAt: createdMs ? new Date(createdMs) : null,
          });
        }
      }

      if (cheapestSoFar === null || currentRate < cheapestSoFar) cheapestSoFar = currentRate;
    });
  });

  return drops;
}

/** 'just now' · '5m ago' · '2h ago' · '3d ago' · '12 Aug 2026' beyond a month. */
export function formatRelativeTime(value, now = new Date()) {
  const ms = toMillis(value);
  if (ms === null) return '';

  const nowMs = toMillis(now) ?? Date.now();
  const diff = nowMs - ms;

  if (diff < 0) return 'just now';
  if (diff < 60 * 1000) return 'just now';

  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days <= 30) return `${days}d ago`;

  return new Date(ms).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Absolute stamp for a `title=` tooltip. */
export function formatAbsoluteTime(value) {
  const ms = toMillis(value);
  if (ms === null) return '';
  return new Date(ms).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
