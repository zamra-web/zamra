"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildFlightDetailKey,
  toDateKey,
  normalizeScheduleWindows,
  findScheduleWindowForDate,
  resolveScheduledFlightTime,
  buildFlightDetailIndex,
  findScheduleOverlaps,
} = require("../flightSchedule");

// Minimal QuerySnapshot stand-in — buildFlightDetailIndex only calls forEach.
function snapshotOf(docs) {
  return { forEach: (fn) => docs.forEach((data) => fn({ data: () => data })) };
}

test("buildFlightDetailKey matches regardless of case or padding", () => {
  assert.equal(buildFlightDetailKey("Air-SG", "CCJ-DXB"), "air-sg_ccj-dxb");
  assert.equal(buildFlightDetailKey("  air-sg ", "ccj-dxb"), "air-sg_ccj-dxb");
  assert.equal(buildFlightDetailKey("", "ccj-dxb"), "");
});

test("toDateKey accepts strings, Dates and Firestore Timestamps", () => {
  assert.equal(toDateKey("2026-07-22"), "2026-07-22");
  assert.equal(toDateKey(new Date(2026, 6, 22)), "2026-07-22");
  assert.equal(toDateKey({ toDate: () => new Date(2026, 6, 22) }), "2026-07-22");
  assert.equal(toDateKey("nonsense"), "");
});

test("normalizeScheduleWindows drops timeless entries, repairs and sorts ranges", () => {
  const windows = normalizeScheduleWindows([
    { startDate: "2026-08-30", endDate: "2026-08-02", flightTime: "14:20 - 19:35" },
    { startDate: "2026-07-22", endDate: "2026-08-01", flightTime: "01:30 - 06:50" },
    { startDate: "2026-09-01", endDate: "2026-09-30", flightTime: "" },
  ]);

  assert.equal(windows.length, 2);
  assert.deepEqual(windows.map((w) => w.startDate), ["2026-07-22", "2026-08-02"]);
  assert.equal(windows[1].endDate, "2026-08-30");
});

test("findScheduleWindowForDate lets the narrowest window win an overlap", () => {
  const windows = normalizeScheduleWindows([
    { startDate: "2026-07-01", endDate: "2026-09-30", flightTime: "09:00 - 12:00" },
    { startDate: "2026-08-10", endDate: "2026-08-12", flightTime: "23:45 - 04:10" },
  ]);

  assert.equal(findScheduleWindowForDate(windows, "2026-08-11").flightTime, "23:45 - 04:10");
  assert.equal(findScheduleWindowForDate(windows, "2026-08-20").flightTime, "09:00 - 12:00");
});

test("findScheduleWindowForDate gives the changeover day to the later schedule", () => {
  const windows = normalizeScheduleWindows([
    { startDate: "2026-07-22", endDate: "2026-08-01", flightTime: "01:30 - 06:50" },
    { startDate: "2026-08-01", endDate: "2026-08-11", flightTime: "14:20 - 19:35" },
  ]);

  assert.equal(findScheduleWindowForDate(windows, "2026-08-01").flightTime, "14:20 - 19:35");
  assert.equal(findScheduleWindowForDate(windows, "2026-07-31").flightTime, "01:30 - 06:50");
});

test("resolveScheduledFlightTime falls back to the doc default outside every window", () => {
  const detail = {
    flightTime: "19:40 - 22:55",
    schedules: [{ startDate: "2026-08-01", endDate: "2026-08-30", flightTime: "14:20 - 19:35" }],
  };

  assert.equal(resolveScheduledFlightTime(detail, "2026-08-15"), "14:20 - 19:35");
  assert.equal(resolveScheduledFlightTime(detail, "2026-12-25"), "19:40 - 22:55");
  assert.equal(resolveScheduledFlightTime(null, "2026-08-15"), "");
});

test("buildFlightDetailIndex keys docs case-insensitively", () => {
  const index = buildFlightDetailIndex(snapshotOf([
    { airlineId: "Air-SG", sectorId: "CCJ-DXB", flightTime: "04:05 - 11:10" },
    { airlineId: "", sectorId: "ccj-jed", flightTime: "09:00 - 12:00" },
  ]));

  assert.equal(index.size, 1);
  assert.equal(index.get("air-sg_ccj-dxb").flightTime, "04:05 - 11:10");
});

test("buildFlightDetailIndex tolerates a missing snapshot", () => {
  assert.equal(buildFlightDetailIndex(null).size, 0);
});

test("findScheduleOverlaps reports the shared span and ignores adjacency", () => {
  const overlapping = normalizeScheduleWindows([
    { startDate: "2026-07-01", endDate: "2026-08-15", flightTime: "09:00 - 12:00" },
    { startDate: "2026-08-10", endDate: "2026-09-01", flightTime: "14:00 - 17:00" },
  ]);
  const [overlap] = findScheduleOverlaps(overlapping);
  assert.equal(overlap.from, "2026-08-10");
  assert.equal(overlap.to, "2026-08-15");

  const adjacent = normalizeScheduleWindows([
    { startDate: "2026-07-01", endDate: "2026-07-31", flightTime: "09:00 - 12:00" },
    { startDate: "2026-08-01", endDate: "2026-08-31", flightTime: "14:00 - 17:00" },
  ]);
  assert.deepEqual(findScheduleOverlaps(adjacent), []);
});
