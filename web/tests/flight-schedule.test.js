import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFlightDetailKey,
  toDateKey,
  normalizeScheduleWindows,
  findScheduleWindowForDate,
  resolveScheduledFlightTime,
  buildFlightTimeResolver,
  findScheduleOverlaps,
  eachDateKeyInRange,
} from '../src/js/shared/flight-schedule.js';

test('buildFlightDetailKey matches regardless of case or padding', () => {
  assert.equal(buildFlightDetailKey('Air-SG', 'CCJ-DXB'), 'air-sg_ccj-dxb');
  assert.equal(buildFlightDetailKey('  air-sg  ', 'ccj-dxb'), 'air-sg_ccj-dxb');
  assert.equal(buildFlightDetailKey('', 'ccj-dxb'), '');
  assert.equal(buildFlightDetailKey('air-sg', null), '');
});

test('toDateKey accepts strings, Dates and Firestore Timestamps', () => {
  assert.equal(toDateKey('2026-07-22'), '2026-07-22');
  assert.equal(toDateKey(new Date(2026, 6, 22)), '2026-07-22');
  assert.equal(toDateKey({ toDate: () => new Date(2026, 6, 22) }), '2026-07-22');
  assert.equal(toDateKey(''), '');
  assert.equal(toDateKey('not a date'), '');
});

test('normalizeScheduleWindows drops timeless entries and sorts by start', () => {
  const windows = normalizeScheduleWindows([
    { startDate: '2026-08-01', endDate: '2026-08-30', flightTime: '14:20 - 19:35' },
    { startDate: '2026-07-22', endDate: '2026-08-01', flightTime: '01:30 - 06:50' },
    { startDate: '2026-09-01', endDate: '2026-09-30', flightTime: '' },
  ]);

  assert.equal(windows.length, 2);
  assert.deepEqual(windows.map(w => w.startDate), ['2026-07-22', '2026-08-01']);
});

test('normalizeScheduleWindows repairs a reversed range', () => {
  const [window] = normalizeScheduleWindows([
    { startDate: '2026-08-30', endDate: '2026-08-01', flightTime: '14:20 - 19:35' },
  ]);

  assert.equal(window.startDate, '2026-08-01');
  assert.equal(window.endDate, '2026-08-30');
});

test('normalizeScheduleWindows mirrors a one-sided range', () => {
  const [onlyStart] = normalizeScheduleWindows([{ startDate: '2026-08-01', flightTime: '09:00 - 12:00' }]);
  assert.deepEqual([onlyStart.startDate, onlyStart.endDate], ['2026-08-01', '2026-08-01']);

  const [onlyEnd] = normalizeScheduleWindows([{ endDate: '2026-08-05', flightTime: '09:00 - 12:00' }]);
  assert.deepEqual([onlyEnd.startDate, onlyEnd.endDate], ['2026-08-05', '2026-08-05']);
});

test('findScheduleWindowForDate picks the window covering the date', () => {
  const windows = normalizeScheduleWindows([
    { startDate: '2026-07-22', endDate: '2026-07-31', flightTime: '01:30 - 06:50' },
    { startDate: '2026-08-02', endDate: '2026-08-30', flightTime: '14:20 - 19:35' },
  ]);

  assert.equal(findScheduleWindowForDate(windows, '2026-07-25').flightTime, '01:30 - 06:50');
  assert.equal(findScheduleWindowForDate(windows, '2026-08-10').flightTime, '14:20 - 19:35');
  assert.equal(findScheduleWindowForDate(windows, '2026-08-01'), null);
});

test('findScheduleWindowForDate lets the narrowest window win an overlap', () => {
  const windows = normalizeScheduleWindows([
    { startDate: '2026-07-01', endDate: '2026-09-30', flightTime: '09:00 - 12:00' },
    { startDate: '2026-08-10', endDate: '2026-08-12', flightTime: '23:45 - 04:10' },
  ]);

  assert.equal(findScheduleWindowForDate(windows, '2026-08-11').flightTime, '23:45 - 04:10');
  assert.equal(findScheduleWindowForDate(windows, '2026-08-20').flightTime, '09:00 - 12:00');
});

test('findScheduleWindowForDate gives the changeover day to the later schedule', () => {
  // The brief's case: 22 Jul–1 Aug, then 1 Aug–30 Aug. Both cover 1 Aug and
  // neither is narrower, so the newer schedule takes the shared day.
  const windows = normalizeScheduleWindows([
    { startDate: '2026-07-22', endDate: '2026-08-01', flightTime: '01:30 - 06:50' },
    { startDate: '2026-08-01', endDate: '2026-08-11', flightTime: '14:20 - 19:35' },
  ]);

  assert.equal(findScheduleWindowForDate(windows, '2026-08-01').flightTime, '14:20 - 19:35');
  assert.equal(findScheduleWindowForDate(windows, '2026-07-31').flightTime, '01:30 - 06:50');
});

test('resolveScheduledFlightTime falls back to the doc default outside every window', () => {
  const detail = {
    flightTime: '19:40 - 22:55',
    schedules: [{ startDate: '2026-08-01', endDate: '2026-08-30', flightTime: '14:20 - 19:35' }],
  };

  assert.equal(resolveScheduledFlightTime(detail, '2026-08-15'), '14:20 - 19:35');
  assert.equal(resolveScheduledFlightTime(detail, '2026-12-25'), '19:40 - 22:55');
  assert.equal(resolveScheduledFlightTime(null, '2026-08-15'), '');
});

test('resolveScheduledFlightTime handles a doc with no schedules at all', () => {
  assert.equal(resolveScheduledFlightTime({ flightTime: '19:40 - 22:55' }, '2026-08-15'), '19:40 - 22:55');
  assert.equal(resolveScheduledFlightTime({ flightTime: '' }, '2026-08-15'), '');
});

test('buildFlightTimeResolver fills a blank fare time from flight_details', () => {
  // The SpiceJet CCJ-DXB case: the time was configured all along, but the fare
  // rows ingested before the n8n round-trip was fixed store an empty string.
  const resolve = buildFlightTimeResolver([
    { airlineId: 'air-sg', sectorId: 'ccj-dxb', flightTime: '04:05 - 11:10' },
  ]);

  assert.equal(resolve({ airlineId: 'air-sg', sectorId: 'ccj-dxb', flightTime: '' }), '04:05 - 11:10');
  assert.equal(resolve({ airlineId: 'air-sg', sectorId: 'ccj-dxb' }), '04:05 - 11:10');
});

test('buildFlightTimeResolver matches ids case-insensitively', () => {
  const resolve = buildFlightTimeResolver([
    { airlineId: 'Air-SG', sectorId: 'CCJ-DXB', flightTime: '04:05 - 11:10' },
  ]);

  assert.equal(resolve({ airlineId: 'air-sg', sectorId: 'ccj-dxb', flightTime: '' }), '04:05 - 11:10');
});

test('buildFlightTimeResolver prefers what the fare already stores', () => {
  const resolve = buildFlightTimeResolver([
    { airlineId: 'air-sg', sectorId: 'ccj-dxb', flightTime: '04:05 - 11:10' },
  ]);

  assert.equal(resolve({ airlineId: 'air-sg', sectorId: 'ccj-dxb', flightTime: '06:00 - 13:00' }), '06:00 - 13:00');
});

test('buildFlightTimeResolver uses the window covering the travel date', () => {
  const resolve = buildFlightTimeResolver([
    {
      airlineId: 'air-fz',
      sectorId: 'dxb-ccj',
      flightTime: '01:30 - 06:50',
      schedules: [{ startDate: '2026-08-02', endDate: '2026-08-30', flightTime: '14:20 - 19:35' }],
    },
  ]);

  assert.equal(resolve({ airlineId: 'air-fz', sectorId: 'dxb-ccj', flightDate: new Date(2026, 7, 15) }), '14:20 - 19:35');
  assert.equal(resolve({ airlineId: 'air-fz', sectorId: 'dxb-ccj', flightDate: new Date(2026, 6, 25) }), '01:30 - 06:50');
});

test('buildFlightTimeResolver returns empty for an unconfigured route', () => {
  const resolve = buildFlightTimeResolver([]);
  assert.equal(resolve({ airlineId: 'air-sg', sectorId: 'ccj-dxb' }), '');
});

test('findScheduleOverlaps reports the shared span', () => {
  const windows = normalizeScheduleWindows([
    { startDate: '2026-07-01', endDate: '2026-08-15', flightTime: '09:00 - 12:00' },
    { startDate: '2026-08-10', endDate: '2026-09-01', flightTime: '14:00 - 17:00' },
  ]);

  const [overlap] = findScheduleOverlaps(windows);
  assert.equal(overlap.from, '2026-08-10');
  assert.equal(overlap.to, '2026-08-15');
});

test('findScheduleOverlaps stays quiet on adjacent ranges', () => {
  const windows = normalizeScheduleWindows([
    { startDate: '2026-07-01', endDate: '2026-07-31', flightTime: '09:00 - 12:00' },
    { startDate: '2026-08-01', endDate: '2026-08-31', flightTime: '14:00 - 17:00' },
  ]);

  assert.deepEqual(findScheduleOverlaps(windows), []);
});

test('eachDateKeyInRange enumerates inclusive days and caps runaway ranges', () => {
  assert.deepEqual(
    eachDateKeyInRange('2026-08-01', '2026-08-04'),
    ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04'],
  );
  assert.deepEqual(eachDateKeyInRange('2026-08-04', '2026-08-01'), []);
  assert.equal(eachDateKeyInRange('2020-01-01', '2030-01-01').length, 400);
});
