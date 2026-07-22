"use strict";

// Flight time helpers for Cloud Functions.
//
// `agent_fares.flightTime` is a single display string ("19:40 - 22:55") that
// posters and the public site render verbatim. The canonical per-route value
// lives in `flight_details`, keyed `<airlineId>_<sectorId>`.
//
// n8n hands times back in whichever shape its parser produced — split
// `time_start`/`time_end`, a combined `flight_time` string, or nothing at all
// when the source paste had no times. Normalize every shape here and fall back
// to `flight_details`, otherwise the fare stores "" and the poster prints "—".

const RANGE_SEPARATOR_RE = /\s*(?:-|–|—|\bto\b)\s*/i;
const CLOCK_RE = /^(\d{1,2})[:.\s]?(\d{2})?\s*([ap])\.?m?\.?$|^(\d{1,2})[:.\s]?(\d{2})?$/i;

const PAYLOAD_RANGE_KEYS = [
  "flight_time",
  "flightTime",
  "flight_timing",
  "timing",
  "time",
];

/**
 * Parses one clock value into canonical 24h "HH:MM".
 * Accepts "19:40", "1940", "19.40", "7:40 PM", "7pm".
 * @param {*} value
 * @return {string} "HH:MM", or "" when unparseable.
 */
function normalizeClock(value) {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const match = raw.match(CLOCK_RE);
  if (!match) return "";

  const meridiem = (match[3] || "").toLowerCase();
  let hours = Number(match[1] !== undefined ? match[1] : match[4]);
  const minutes = Number((match[1] !== undefined ? match[2] : match[5]) || 0);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";
  if (minutes > 59) return "";

  if (meridiem === "p" && hours < 12) hours += 12;
  if (meridiem === "a" && hours === 12) hours = 0;
  if (hours > 23) return "";

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Joins a departure/arrival pair into the stored display format.
 * A half-known range keeps the side it has rather than dropping both.
 * @param {*} start
 * @param {*} end
 * @return {string}
 */
function joinFlightTime(start, end) {
  const from = normalizeClock(start);
  const to = normalizeClock(end);
  if (from && to) return `${from} - ${to}`;
  return from || to || "";
}

/**
 * Normalizes a combined range string ("19:40-22:55", "7:40 PM to 10:55 PM").
 * @param {*} value
 * @return {string}
 */
function normalizeFlightTimeRange(value) {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  const parts = raw.split(RANGE_SEPARATOR_RE).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return joinFlightTime(parts[0], parts[1]);
  return normalizeClock(parts[0] || raw);
}

/**
 * Resolves the flight time to store on a fare, most-specific-first:
 * split payload keys → combined payload key → configured `flight_details`.
 * @param {object} row n8n payload row
 * @param {string} [fallback] `flight_details.flightTime` for this airline+sector
 * @return {string}
 */
function resolveFlightTime(row, fallback) {
  const source = row || {};

  const split = joinFlightTime(
    source.time_start !== undefined ? source.time_start : source.timeStart,
    source.time_end !== undefined ? source.time_end : source.timeEnd,
  );
  if (split) return split;

  for (const key of PAYLOAD_RANGE_KEYS) {
    const normalized = normalizeFlightTimeRange(source[key]);
    if (normalized) return normalized;
  }

  return normalizeFlightTimeRange(fallback);
}

/**
 * Builds an `<airlineId>_<sectorId>` → flightTime lookup from `flight_details`.
 * @param {FirebaseFirestore.QuerySnapshot} snapshot
 * @return {Object<string, string>}
 */
function buildFlightTimeMap(snapshot) {
  const map = {};
  if (!snapshot) return map;
  snapshot.forEach((doc) => {
    const data = doc.data();
    const time = normalizeFlightTimeRange(data.flightTime);
    if (!time || !data.airlineId || !data.sectorId) return;
    map[`${data.airlineId}_${data.sectorId}`] = time;
  });
  return map;
}

module.exports = {
  normalizeClock,
  joinFlightTime,
  normalizeFlightTimeRange,
  resolveFlightTime,
  buildFlightTimeMap,
};
