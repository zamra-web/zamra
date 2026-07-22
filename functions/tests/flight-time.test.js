"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeClock,
  joinFlightTime,
  normalizeFlightTimeRange,
  resolveFlightTime,
  buildFlightTimeMap,
} = require("../flightTime");

// Stands in for a Firestore QuerySnapshot: only `.forEach(doc => doc.data())`
// is used by buildFlightTimeMap.
function snapshotOf(docs) {
  return { forEach: (fn) => docs.forEach((data) => fn({ data: () => data })) };
}

test("normalizeClock accepts the shapes n8n and admins actually produce", () => {
  assert.equal(normalizeClock("19:40"), "19:40");
  assert.equal(normalizeClock("1940"), "19:40");
  assert.equal(normalizeClock("19.40"), "19:40");
  assert.equal(normalizeClock(" 9:05 "), "09:05");
  assert.equal(normalizeClock("940"), "09:40");
  assert.equal(normalizeClock("7:40 PM"), "19:40");
  assert.equal(normalizeClock("7pm"), "19:00");
  assert.equal(normalizeClock("12:15 AM"), "00:15");
  assert.equal(normalizeClock("12:15 PM"), "12:15");
});

test("normalizeClock rejects junk instead of storing it", () => {
  for (const bad of ["", "   ", null, undefined, "TBA", "25:00", "10:75", "abc"]) {
    assert.equal(normalizeClock(bad), "", `expected "" for ${JSON.stringify(bad)}`);
  }
});

test("normalizeFlightTimeRange collapses every separator to ' - '", () => {
  assert.equal(normalizeFlightTimeRange("19:40-22:55"), "19:40 - 22:55");
  assert.equal(normalizeFlightTimeRange("19:40 – 22:55"), "19:40 - 22:55");
  assert.equal(normalizeFlightTimeRange("19:40 — 22:55"), "19:40 - 22:55");
  assert.equal(normalizeFlightTimeRange("7:40 PM to 10:55 PM"), "19:40 - 22:55");
  assert.equal(normalizeFlightTimeRange("1940 - 2255"), "19:40 - 22:55");
  assert.equal(normalizeFlightTimeRange(""), "");
  assert.equal(normalizeFlightTimeRange(undefined), "");
});

test("a half-known range keeps the side it has", () => {
  assert.equal(joinFlightTime("19:40", ""), "19:40");
  assert.equal(joinFlightTime("", "22:55"), "22:55");
  assert.equal(joinFlightTime("", ""), "");
  assert.equal(normalizeFlightTimeRange("19:40 - TBA"), "19:40");
});

test("resolveFlightTime prefers the split payload keys", () => {
  assert.equal(
    resolveFlightTime({ time_start: "19:40", time_end: "22:55", flight_time: "01:00 - 02:00" }),
    "19:40 - 22:55",
  );
  assert.equal(resolveFlightTime({ timeStart: "1940", timeEnd: "2255" }), "19:40 - 22:55");
});

test("resolveFlightTime falls back to a combined payload key", () => {
  // The regression: n8n echoed the combined string back, ingest only read
  // time_start/time_end, and every fare stored "" — so posters printed "—".
  assert.equal(resolveFlightTime({ flight_time: "19:40 - 22:55" }), "19:40 - 22:55");
  assert.equal(resolveFlightTime({ flightTime: "19:40-22:55" }), "19:40 - 22:55");
  assert.equal(resolveFlightTime({ timing: "1940 - 2255" }), "19:40 - 22:55");
});

test("resolveFlightTime falls back to the configured flight_details time", () => {
  assert.equal(resolveFlightTime({}, "19:40 - 22:55"), "19:40 - 22:55");
  assert.equal(resolveFlightTime({ time_start: "", time_end: "" }, "1940-2255"), "19:40 - 22:55");
  assert.equal(resolveFlightTime({ flight_time: "TBA" }, "19:40 - 22:55"), "19:40 - 22:55");
});

test("resolveFlightTime returns empty when nothing anywhere has a time", () => {
  assert.equal(resolveFlightTime({}), "");
  assert.equal(resolveFlightTime({ flight_time: "" }, ""), "");
  assert.equal(resolveFlightTime(null, undefined), "");
});

test("buildFlightTimeMap keys on airlineId_sectorId and skips blanks", () => {
  const map = buildFlightTimeMap(snapshotOf([
    { airlineId: "air1", sectorId: "sec1", flightTime: "19:40-22:55" },
    { airlineId: "air2", sectorId: "sec1", flightTime: "" },
    { airlineId: "air3", flightTime: "10:00 - 12:00" },
    { airlineId: "air4", sectorId: "sec2", flightTime: "TBA" },
  ]));

  assert.deepEqual(map, { "air1_sec1": "19:40 - 22:55" });
});

test("buildFlightTimeMap tolerates a missing snapshot", () => {
  assert.deepEqual(buildFlightTimeMap(null), {});
});
