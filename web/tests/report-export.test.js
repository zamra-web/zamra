import test from 'node:test';
import assert from 'node:assert/strict';

import {
  sortFaresForExport,
  buildFaresCsv,
  buildExportFileName,
  departureMinutes,
  escapeCsvValue,
} from '../src/js/admin/report-export.js';

// Sectors arrive from getSectors() already in POS display order.
const SECTORS = [
  { id: 'ccj-jed', sectorCode: 'CCJ JED' },
  { id: 'ccj-ruh', sectorCode: 'CCJ RUH' },
  { id: 'cok-dxb', sectorCode: 'COK DXB' },
];

const CTX = {
  sectors: SECTORS,
  sectorCodeById: { 'ccj-jed': 'CCJ JED', 'ccj-ruh': 'CCJ RUH', 'cok-dxb': 'COK DXB' },
  airlineCodeById: { 'air-ix': 'IX', 'air-sg': 'SG', 'air-sv': 'SV' },
  agentNameById: { 'agent-1': 'Skyline Consolidators' },
  checkInKg: () => 30,
  handKg: () => 7,
};

test('sortFaresForExport groups by sector in POS display order', () => {
  const fares = [
    { id: 'c', sectorId: 'cok-dxb', flightDate: new Date('2026-08-01T00:00:00Z') },
    { id: 'a', sectorId: 'ccj-jed', flightDate: new Date('2026-08-01T00:00:00Z') },
    { id: 'b', sectorId: 'ccj-ruh', flightDate: new Date('2026-08-01T00:00:00Z') },
  ];

  assert.deepEqual(
    sortFaresForExport(fares, CTX).map(f => f.id),
    ['a', 'b', 'c'],
  );
});

test('sortFaresForExport orders chronologically inside a sector', () => {
  const fares = [
    { id: 'later', sectorId: 'ccj-jed', flightDate: new Date('2026-08-09T00:00:00Z') },
    { id: 'earlier', sectorId: 'ccj-jed', flightDate: new Date('2026-08-02T00:00:00Z') },
    { id: 'middle', sectorId: 'ccj-jed', flightDate: new Date('2026-08-05T00:00:00Z') },
  ];

  assert.deepEqual(
    sortFaresForExport(fares, CTX).map(f => f.id),
    ['earlier', 'middle', 'later'],
  );
});

test('sortFaresForExport breaks same-day ties on departure time', () => {
  const day = new Date('2026-08-02T00:00:00Z');
  const fares = [
    { id: 'evening', sectorId: 'ccj-jed', flightDate: day, flightTime: '19:40 - 22:55' },
    { id: 'dawn', sectorId: 'ccj-jed', flightDate: day, flightTime: '01:30 - 06:50' },
    { id: 'noon', sectorId: 'ccj-jed', flightDate: day, flightTime: '12:05 - 15:20' },
  ];

  assert.deepEqual(
    sortFaresForExport(fares, CTX).map(f => f.id),
    ['dawn', 'noon', 'evening'],
  );
});

test('sortFaresForExport puts untimed rows last within their day, not first', () => {
  const day = new Date('2026-08-02T00:00:00Z');
  const fares = [
    { id: 'untimed', sectorId: 'ccj-jed', flightDate: day, flightTime: '' },
    { id: 'timed', sectorId: 'ccj-jed', flightDate: day, flightTime: '19:40 - 22:55' },
  ];

  assert.deepEqual(
    sortFaresForExport(fares, CTX).map(f => f.id),
    ['timed', 'untimed'],
  );
});

test('sortFaresForExport ranks unknown sectors after every known one', () => {
  const fares = [
    { id: 'ghost', sectorId: 'not-in-list', flightDate: new Date('2026-01-01T00:00:00Z') },
    { id: 'known', sectorId: 'cok-dxb', flightDate: new Date('2026-12-31T00:00:00Z') },
  ];

  assert.deepEqual(
    sortFaresForExport(fares, CTX).map(f => f.id),
    ['known', 'ghost'],
  );
});

test('sortFaresForExport does not mutate its input', () => {
  const fares = [
    { id: 'b', sectorId: 'cok-dxb', flightDate: new Date('2026-08-01T00:00:00Z') },
    { id: 'a', sectorId: 'ccj-jed', flightDate: new Date('2026-08-01T00:00:00Z') },
  ];
  sortFaresForExport(fares, CTX);
  assert.deepEqual(fares.map(f => f.id), ['b', 'a']);
});

test('departureMinutes reads the departure half and rejects nonsense', () => {
  assert.equal(departureMinutes('19:40 - 22:55'), 19 * 60 + 40);
  assert.equal(departureMinutes('01:30'), 90);
  assert.equal(departureMinutes(''), Number.POSITIVE_INFINITY);
  assert.equal(departureMinutes('99:99'), Number.POSITIVE_INFINITY);
});

test('escapeCsvValue doubles embedded quotes', () => {
  assert.equal(escapeCsvValue('Al "Sky" Travel'), '"Al ""Sky"" Travel"');
  assert.equal(escapeCsvValue(null), '""');
});

test('buildFaresCsv writes a letterhead and the full column set by default', () => {
  const csv = buildFaresCsv(
    [{ id: 'f1', sectorId: 'ccj-jed', airlineId: 'air-ix', agentId: 'agent-1', flightDate: new Date('2026-08-02T00:00:00Z'), specialRate: 15000, finalRate: 15500, commission: 500 }],
    CTX,
  );

  assert.match(csv, /Zamra Travels/);
  assert.match(csv, /\+91 98466 06739/);
  assert.match(csv, /"Agent"/);
  assert.match(csv, /"Commission \(INR\)"/);
  assert.match(csv, /Skyline Consolidators/);
  assert.match(csv, /"15000"/);
});

test('buildFaresCsv white-label drops the letterhead and every margin column', () => {
  const csv = buildFaresCsv(
    [{ id: 'f1', sectorId: 'ccj-jed', airlineId: 'air-ix', agentId: 'agent-1', flightDate: new Date('2026-08-02T00:00:00Z'), specialRate: 15000, finalRate: 15500, commission: 500 }],
    { ...CTX, whiteLabel: true },
  );

  assert.doesNotMatch(csv, /Zamra/i);
  assert.doesNotMatch(csv, /98466/);
  assert.doesNotMatch(csv, /zamratravelsmlp/);
  assert.doesNotMatch(csv, /"Agent"/);
  assert.doesNotMatch(csv, /Skyline Consolidators/);
  assert.doesNotMatch(csv, /Commission/);
  assert.doesNotMatch(csv, /SP Rate/);
  // The supplier's raw buying rate must not survive anywhere in the sheet.
  assert.doesNotMatch(csv, /15000/);
  // The customer-facing price still does.
  assert.match(csv, /"15500"/);
  assert.equal(csv.split('\n')[0], '"Date","Time","Sector","Airline","Rate (INR)","Check-in Baggage (kg)","Hand Baggage (kg)","Status"');
});

test('buildFaresCsv emits rows in sector-then-date order', () => {
  const csv = buildFaresCsv([
    { id: 'x', sectorId: 'cok-dxb', airlineId: 'air-sg', flightDate: new Date('2026-08-01T00:00:00Z'), finalRate: 1 },
    { id: 'y', sectorId: 'ccj-jed', airlineId: 'air-ix', flightDate: new Date('2026-08-09T00:00:00Z'), finalRate: 2 },
    { id: 'z', sectorId: 'ccj-jed', airlineId: 'air-ix', flightDate: new Date('2026-08-02T00:00:00Z'), finalRate: 3 },
  ], { ...CTX, whiteLabel: true });

  const dataRows = csv.split('\n').slice(1);
  assert.match(dataRows[0], /02 Aug 2026.*CCJ JED/);
  assert.match(dataRows[1], /09 Aug 2026.*CCJ JED/);
  assert.match(dataRows[2], /01 Aug 2026.*COK DXB/);
});

test('buildExportFileName distinguishes white-label downloads', () => {
  const date = new Date('2026-07-23T10:00:00Z');
  assert.equal(buildExportFileName('csv', { date }), 'zamra-fares-2026-07-23.csv');
  assert.equal(buildExportFileName('pdf', { whiteLabel: true, date }), 'fare-report-2026-07-23.pdf');
});
