"use strict";

// Date-ranged flight schedules for Cloud Functions — CommonJS mirror of
// `web/src/js/shared/flight-schedule.js`. Any rule change must be made in BOTH
// files; the browser bundle cannot import from `functions/`.
//
// A `flight_details` doc holds the default `flightTime` for an airline+sector
// plus an optional `schedules` array of date-ranged overrides:
//
//   {
//     airlineId, sectorId,
//     flightTime: "01:30 - 06:50",                 // default, used outside every window
//     schedules: [
//       { startDate: "2026-07-22", endDate: "2026-08-01", flightTime: "01:30 - 06:50" },
//       { startDate: "2026-08-01", endDate: "2026-08-30", flightTime: "14:20 - 19:35" },
//     ]
//   }
//
// Resolution for a given travel date is narrowest window first, tie-broken on
// the later startDate. See the ESM twin for the full rationale.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Normalizes an id for lookup so case/padding differences still match.
 * @param {*} value
 * @return {string}
 */
function normalizeLookupId(value) {
  return String(value === null || value === undefined ? "" : value).trim().toLowerCase();
}

/**
 * Builds a case-insensitive `<airlineId>_<sectorId>` key.
 * @param {*} airlineId
 * @param {*} sectorId
 * @return {string}
 */
function buildFlightDetailKey(airlineId, sectorId) {
  const airline = normalizeLookupId(airlineId);
  const sector = normalizeLookupId(sectorId);
  if (!airline || !sector) return "";
  return `${airline}_${sector}`;
}

/**
 * Coerces any supported date shape to `YYYY-MM-DD` in local time.
 * @param {*} value Firestore Timestamp, Date, ISO string or date string
 * @return {string}
 */
function toDateKey(value) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (DATE_RE.test(trimmed)) return trimmed;
  }

  let date = value;
  if (date && typeof date.toDate === "function") date = date.toDate();
  else if (!(date instanceof Date)) date = new Date(date);

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Whole days spanned by a window, inclusive of both ends.
 * @param {string} startKey
 * @param {string} endKey
 * @return {number}
 */
function windowSpanDays(startKey, endKey) {
  const start = Date.parse(`${startKey}T00:00:00Z`);
  const end = Date.parse(`${endKey}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.MAX_SAFE_INTEGER;
  return Math.round((end - start) / MS_PER_DAY) + 1;
}

/**
 * Cleans and sorts a raw `schedules` array.
 * @param {Array} list
 * @param {function(*): string} [formatTime]
 * @return {Array<{startDate: string, endDate: string, flightTime: string}>}
 */
function normalizeScheduleWindows(list, formatTime) {
  const format = formatTime || ((v) => String(v === null || v === undefined ? "" : v).trim());
  if (!Array.isArray(list)) return [];

  return list
    .map((entry) => {
      const flightTime = format(entry && entry.flightTime);
      if (!flightTime) return null;

      let startDate = toDateKey(entry && entry.startDate);
      let endDate = toDateKey(entry && entry.endDate);
      if (!startDate && !endDate) return null;
      if (!startDate) startDate = endDate;
      if (!endDate) endDate = startDate;
      if (startDate > endDate) {
        const swap = startDate;
        startDate = endDate;
        endDate = swap;
      }

      return { startDate, endDate, flightTime };
    })
    .filter(Boolean)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
}

/**
 * Picks the window covering a date — narrowest wins, later start breaks ties.
 * @param {Array} windows
 * @param {*} dateValue
 * @return {?object}
 */
function findScheduleWindowForDate(windows, dateValue) {
  const dateKey = toDateKey(dateValue);
  if (!dateKey) return null;

  let best = null;
  let bestSpan = Number.MAX_SAFE_INTEGER;

  (windows || []).forEach((window) => {
    if (dateKey < window.startDate || dateKey > window.endDate) return;

    const span = windowSpanDays(window.startDate, window.endDate);
    if (span < bestSpan || (span === bestSpan && best && window.startDate > best.startDate)) {
      best = window;
      bestSpan = span;
    }
  });

  return best;
}

/**
 * Flight time for one `flight_details` doc on a specific date.
 * @param {object} detail
 * @param {*} dateValue
 * @param {function(*): string} [formatTime]
 * @return {string}
 */
function resolveScheduledFlightTime(detail, dateValue, formatTime) {
  const format = formatTime || ((v) => String(v === null || v === undefined ? "" : v).trim());
  if (!detail) return "";

  const windows = normalizeScheduleWindows(detail.schedules, format);
  const match = findScheduleWindowForDate(windows, dateValue);
  if (match) return match.flightTime;

  return format(detail.flightTime);
}

/**
 * Builds a `<airlineId>_<sectorId>` → doc index from a `flight_details`
 * snapshot, keyed case-insensitively.
 * @param {FirebaseFirestore.QuerySnapshot} snapshot
 * @return {Map<string, object>}
 */
function buildFlightDetailIndex(snapshot) {
  const index = new Map();
  if (!snapshot) return index;
  snapshot.forEach((doc) => {
    const data = doc.data();
    const key = buildFlightDetailKey(data.airlineId, data.sectorId);
    if (key) index.set(key, data);
  });
  return index;
}

/**
 * Pairs of windows sharing at least one day.
 * @param {Array} windows
 * @return {Array<{a: object, b: object, from: string, to: string}>}
 */
function findScheduleOverlaps(windows) {
  const list = windows || [];
  const overlaps = [];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i];
      const b = list[j];
      const from = a.startDate > b.startDate ? a.startDate : b.startDate;
      const to = a.endDate < b.endDate ? a.endDate : b.endDate;
      if (from <= to) overlaps.push({ a, b, from, to });
    }
  }
  return overlaps;
}

module.exports = {
  normalizeLookupId,
  buildFlightDetailKey,
  toDateKey,
  normalizeScheduleWindows,
  findScheduleWindowForDate,
  resolveScheduledFlightTime,
  buildFlightDetailIndex,
  findScheduleOverlaps,
};
