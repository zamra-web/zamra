// Date-ranged flight schedules — the single source of truth for the browser
// surfaces (admin dashboard, public site, B2B portal).
//
// `functions/flightSchedule.js` is the CommonJS mirror of this file for Cloud
// Functions / the n8n endpoints. Any rule change must be made in BOTH files.
//
// A `flight_details` doc holds the default `flightTime` for an airline+sector
// plus an optional `schedules` array of date-ranged overrides:
//
//   {
//     airlineId, sectorId,
//     flightTime: '01:30 - 06:50',                 // default, used outside every window
//     schedules: [
//       { startDate: '2026-07-22', endDate: '2026-08-01', flightTime: '01:30 - 06:50' },
//       { startDate: '2026-08-01', endDate: '2026-08-30', flightTime: '14:20 - 19:35' },
//     ]
//   }
//
// Resolution for a given travel date is **narrowest window first**: a short
// window is treated as a deliberate override of a longer one that surrounds it.
// Windows of equal span tie-break on the later `startDate`, so the airline's
// newer schedule wins the changeover day. Overlaps are legal but ambiguous —
// `findScheduleOverlaps()` surfaces them so an admin can resolve them by hand.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Normalizes an id for lookup — ids differing only by case/padding must match. */
export function normalizeLookupId(value) {
  return String(value ?? '').trim().toLowerCase();
}

/** `<airlineId>_<sectorId>`, case- and whitespace-insensitive. */
export function buildFlightDetailKey(airlineId, sectorId) {
  const airline = normalizeLookupId(airlineId);
  const sector = normalizeLookupId(sectorId);
  if (!airline || !sector) return '';
  return `${airline}_${sector}`;
}

/**
 * Coerces any supported date shape to a `YYYY-MM-DD` string in local time.
 * Firestore Timestamps, Dates, ISO strings and plain date strings all work.
 */
export function toDateKey(value) {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (DATE_RE.test(trimmed)) return trimmed;
  }

  let date = value;
  if (typeof date?.toDate === 'function') date = date.toDate();
  else if (!(date instanceof Date)) date = new Date(date);

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Whole days spanned by a window, inclusive of both ends. */
function windowSpanDays(startKey, endKey) {
  const start = Date.parse(`${startKey}T00:00:00Z`);
  const end = Date.parse(`${endKey}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.MAX_SAFE_INTEGER;
  return Math.round((end - start) / MS_PER_DAY) + 1;
}

/**
 * Cleans a raw `schedules` array: drops entries without a usable time or an
 * unparseable range, swaps reversed ranges, and sorts by start date.
 * @param {Array} list
 * @param {(value: any) => string} [formatTime] normalizer for the time string
 * @return {Array<{startDate: string, endDate: string, flightTime: string}>}
 */
export function normalizeScheduleWindows(list = [], formatTime = (v) => String(v ?? '').trim()) {
  if (!Array.isArray(list)) return [];

  return list
    .map((entry) => {
      const flightTime = formatTime(entry?.flightTime);
      if (!flightTime) return null;

      let startDate = toDateKey(entry?.startDate);
      let endDate = toDateKey(entry?.endDate);
      // A one-sided window is still meaningful: it pins the time from (or until)
      // a date. Mirror the known side so downstream comparisons stay simple.
      if (!startDate && !endDate) return null;
      if (!startDate) startDate = endDate;
      if (!endDate) endDate = startDate;
      if (startDate > endDate) [startDate, endDate] = [endDate, startDate];

      return { startDate, endDate, flightTime };
    })
    .filter(Boolean)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}

/**
 * Picks the window covering `dateValue`. Narrowest wins; equal spans tie-break
 * on the later start date.
 * @return {{startDate: string, endDate: string, flightTime: string}|null}
 */
export function findScheduleWindowForDate(windows = [], dateValue) {
  const dateKey = toDateKey(dateValue);
  if (!dateKey) return null;

  let best = null;
  let bestSpan = Number.MAX_SAFE_INTEGER;

  for (const window of windows) {
    if (dateKey < window.startDate || dateKey > window.endDate) continue;

    const span = windowSpanDays(window.startDate, window.endDate);
    if (span < bestSpan || (span === bestSpan && best && window.startDate > best.startDate)) {
      best = window;
      bestSpan = span;
    }
  }

  return best;
}

/**
 * Flight time for an airline+sector on a specific date.
 * Date-ranged window → the doc's default `flightTime` → ''.
 * @param {object} detail a `flight_details` doc
 * @param {*} dateValue travel date in any supported shape
 * @param {(value: any) => string} [formatTime]
 */
export function resolveScheduledFlightTime(detail, dateValue, formatTime = (v) => String(v ?? '').trim()) {
  if (!detail) return '';

  const windows = normalizeScheduleWindows(detail.schedules, formatTime);
  const match = findScheduleWindowForDate(windows, dateValue);
  if (match) return match.flightTime;

  return formatTime(detail.flightTime);
}

/**
 * Builds a `(fare) => flightTime` resolver over a `flight_details` collection.
 * Lookup is case-insensitive on both ids, which is what fixes routes whose
 * fares carry a differently-cased `airlineId` than their configured default.
 * @param {Array} flightDetails
 * @param {(value: any) => string} [formatTime]
 */
export function buildFlightTimeResolver(flightDetails = [], formatTime = (v) => String(v ?? '').trim()) {
  const byKey = new Map();
  for (const detail of flightDetails) {
    const key = buildFlightDetailKey(detail?.airlineId, detail?.sectorId);
    if (key) byKey.set(key, detail);
  }

  return function resolveFlightTime(fare) {
    const stored = formatTime(fare?.flightTime);
    if (stored) return stored;

    const detail = byKey.get(buildFlightDetailKey(fare?.airlineId, fare?.sectorId));
    if (!detail) return '';

    return resolveScheduledFlightTime(detail, fare?.flightDate, formatTime);
  };
}

/**
 * Pairs of windows that cover at least one shared day. The admin UI warns on
 * these because the narrowest-wins rule, while deterministic, is rarely what
 * the person editing actually meant.
 * @return {Array<{a: object, b: object, from: string, to: string}>}
 */
export function findScheduleOverlaps(windows = []) {
  const overlaps = [];
  for (let i = 0; i < windows.length; i += 1) {
    for (let j = i + 1; j < windows.length; j += 1) {
      const a = windows[i];
      const b = windows[j];
      const from = a.startDate > b.startDate ? a.startDate : b.startDate;
      const to = a.endDate < b.endDate ? a.endDate : b.endDate;
      if (from <= to) overlaps.push({ a, b, from, to });
    }
  }
  return overlaps;
}

/** Every `YYYY-MM-DD` between two dates, inclusive. Caps at `maxDays`. */
export function eachDateKeyInRange(startValue, endValue, maxDays = 400) {
  const startKey = toDateKey(startValue);
  const endKey = toDateKey(endValue);
  if (!startKey || !endKey || startKey > endKey) return [];

  const keys = [];
  let cursor = Date.parse(`${startKey}T00:00:00Z`);
  const end = Date.parse(`${endKey}T00:00:00Z`);
  while (cursor <= end && keys.length < maxDays) {
    keys.push(new Date(cursor).toISOString().slice(0, 10));
    cursor += MS_PER_DAY;
  }
  return keys;
}
