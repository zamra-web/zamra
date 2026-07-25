import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFareGroupKey,
  annotateFarePriceDrops,
  formatRelativeTime,
} from '../src/js/shared/fare-price-history.js';

const NOW = new Date('2026-08-01T12:00:00Z');
const FLIGHT_DATE = new Date('2026-09-12T00:00:00Z');

function hoursAgo(hours) {
  return new Date(NOW.getTime() - hours * 60 * 60 * 1000);
}

function fare(overrides = {}) {
  return {
    id: 'f1',
    sectorId: 'sec-ccj-jed',
    airlineId: 'air-ix',
    flightDate: FLIGHT_DATE,
    flightTime: '04:05 - 11:10',
    finalRate: 18500,
    createdAt: hoursAgo(48),
    ...overrides,
  };
}

test('group key ignores whitespace and case in the flight time', () => {
  const a = buildFareGroupKey(fare({ flightTime: '04:05 - 11:10' }));
  const b = buildFareGroupKey(fare({ flightTime: '04:05-11:10' }));
  const c = buildFareGroupKey(fare({ flightTime: '  04:05 - 11:10  ' }));

  assert.equal(a, b);
  assert.equal(a, c);
});

test('group key separates different dates, airlines and times', () => {
  const base = buildFareGroupKey(fare());

  assert.notEqual(base, buildFareGroupKey(fare({ airlineId: 'air-6e' })));
  assert.notEqual(base, buildFareGroupKey(fare({ flightTime: '09:00 - 14:00' })));
  assert.notEqual(base, buildFareGroupKey(fare({ flightDate: new Date('2026-09-13T00:00:00Z') })));
});

test('an edited fare reports its drop from previousFinalRate', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'edited', finalRate: 15800, previousFinalRate: 17200, rateChangedAt: hoursAgo(1) }),
  ], { now: NOW });

  const drop = drops.get('edited');
  assert.ok(drop);
  assert.equal(drop.kind, 'edit');
  assert.equal(drop.previousRate, 17200);
  assert.equal(drop.currentRate, 15800);
  assert.equal(drop.delta, 1400);
});

test('a rate that went UP is not a drop', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'raised', finalRate: 19000, previousFinalRate: 17200, rateChangedAt: hoursAgo(1) }),
  ], { now: NOW });

  assert.equal(drops.size, 0);
});

test('a cheaper re-uploaded duplicate is flagged against its older sibling', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'old', finalRate: 18500, createdAt: hoursAgo(48) }),
    fare({ id: 'new', finalRate: 16900, createdAt: hoursAgo(1) }),
  ], { now: NOW });

  const drop = drops.get('new');
  assert.ok(drop, 'the newer, cheaper row should be flagged');
  assert.equal(drop.kind, 'reupload');
  assert.equal(drop.previousRate, 18500);
  assert.equal(drop.delta, 1600);
  assert.ok(!drops.has('old'), 'the older row is not itself a drop');
});

test('no drop when the older sibling was already cheaper', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'old', finalRate: 16000, createdAt: hoursAgo(48) }),
    fare({ id: 'new', finalRate: 18500, createdAt: hoursAgo(1) }),
  ], { now: NOW });

  assert.equal(drops.size, 0);
});

test('duplicates on a different date or time are not compared', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'old', finalRate: 18500, createdAt: hoursAgo(48) }),
    fare({
      id: 'other-day',
      finalRate: 16900,
      createdAt: hoursAgo(1),
      flightDate: new Date('2026-09-13T00:00:00Z'),
    }),
  ], { now: NOW });

  assert.equal(drops.size, 0);
});

test('the drop is measured against the cheapest older sibling, not the newest', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'a', finalRate: 20000, createdAt: hoursAgo(72) }),
    fare({ id: 'b', finalRate: 17000, createdAt: hoursAgo(48) }),
    fare({ id: 'c', finalRate: 16000, createdAt: hoursAgo(1) }),
  ], { now: NOW });

  assert.equal(drops.get('c').previousRate, 17000);
  assert.equal(drops.get('c').delta, 1000);
});

test('stale drops fall outside the default age window', () => {
  const stale = [
    fare({ id: 'old', finalRate: 18500, createdAt: new Date('2026-01-01T00:00:00Z') }),
    fare({ id: 'new', finalRate: 16900, createdAt: new Date('2026-01-02T00:00:00Z') }),
  ];

  assert.equal(annotateFarePriceDrops(stale, { now: NOW }).size, 0);
  assert.equal(annotateFarePriceDrops(stale, { now: NOW, maxAgeMs: null }).size, 1);
});

test('an edit drop wins over a re-upload drop for the same row', () => {
  const drops = annotateFarePriceDrops([
    fare({ id: 'old', finalRate: 18500, createdAt: hoursAgo(48) }),
    fare({
      id: 'new',
      finalRate: 16000,
      createdAt: hoursAgo(2),
      previousFinalRate: 16900,
      rateChangedAt: hoursAgo(1),
    }),
  ], { now: NOW });

  assert.equal(drops.get('new').kind, 'edit');
  assert.equal(drops.get('new').previousRate, 16900);
});

test('rows without ids or rates are skipped safely', () => {
  assert.equal(annotateFarePriceDrops(null).size, 0);
  assert.equal(annotateFarePriceDrops([]).size, 0);
  assert.equal(annotateFarePriceDrops([{ finalRate: 100 }]).size, 0);
});

test('formatRelativeTime covers the display boundaries', () => {
  assert.equal(formatRelativeTime(NOW, NOW), 'just now');
  assert.equal(formatRelativeTime(new Date(NOW.getTime() - 30 * 1000), NOW), 'just now');
  assert.equal(formatRelativeTime(new Date(NOW.getTime() - 5 * 60 * 1000), NOW), '5m ago');
  assert.equal(formatRelativeTime(hoursAgo(2), NOW), '2h ago');
  assert.equal(formatRelativeTime(hoursAgo(72), NOW), '3d ago');
  assert.equal(formatRelativeTime(new Date('2026-01-01T00:00:00Z'), NOW), '01 Jan 2026');
  assert.equal(formatRelativeTime(null, NOW), '');
});

test('a Firestore-style Timestamp is accepted anywhere a Date is', () => {
  const timestamp = { toDate: () => hoursAgo(2) };
  assert.equal(formatRelativeTime(timestamp, NOW), '2h ago');

  const drops = annotateFarePriceDrops([
    fare({ id: 'old', finalRate: 18500, createdAt: { toDate: () => hoursAgo(48) } }),
    fare({ id: 'new', finalRate: 16900, createdAt: timestamp }),
  ], { now: NOW });

  assert.equal(drops.get('new').delta, 1600);
});
