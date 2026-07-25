import test from 'node:test';
import assert from 'node:assert/strict';

import {
  matchFaresToEnquiry,
  evaluateEnquiryAlerts,
  countEnquiryAlerts,
} from '../src/js/shared/enquiry-alerts.js';

const ENQUIRY = {
  id: 'enq-1',
  customerName: 'Rashid',
  sectorId: 'sec-ccj-jed',
  startDate: new Date('2026-08-10T00:00:00'),
  endDate: new Date('2026-08-20T00:00:00'),
  targetFare: 17000,
  status: 'open',
};

function fare(overrides = {}) {
  return {
    id: 'f1',
    sectorId: 'sec-ccj-jed',
    airlineId: 'air-ix',
    flightDate: new Date('2026-08-15T00:00:00'),
    finalRate: 18000,
    isHidden: false,
    ...overrides,
  };
}

test('only fares on the enquiry sector match', () => {
  const matches = matchFaresToEnquiry(ENQUIRY, [
    fare({ id: 'right' }),
    fare({ id: 'wrong', sectorId: 'sec-ccj-dxb' }),
  ]);

  assert.deepEqual(matches.map((f) => f.id), ['right']);
});

test('the date window is inclusive at both ends', () => {
  const matches = matchFaresToEnquiry(ENQUIRY, [
    fare({ id: 'before', flightDate: new Date('2026-08-09T23:00:00') }),
    fare({ id: 'first-day', flightDate: new Date('2026-08-10T06:00:00') }),
    fare({ id: 'last-day', flightDate: new Date('2026-08-20T22:00:00') }),
    fare({ id: 'after', flightDate: new Date('2026-08-21T01:00:00') }),
  ]);

  assert.deepEqual(matches.map((f) => f.id).sort(), ['first-day', 'last-day']);
});

test('hidden fares never match — they are not sellable', () => {
  const matches = matchFaresToEnquiry(ENQUIRY, [
    fare({ id: 'hidden', isHidden: true, finalRate: 12000 }),
    fare({ id: 'live', finalRate: 18000 }),
  ]);

  assert.deepEqual(matches.map((f) => f.id), ['live']);
});

test('matches come back cheapest first', () => {
  const matches = matchFaresToEnquiry(ENQUIRY, [
    fare({ id: 'pricey', finalRate: 21000 }),
    fare({ id: 'cheap', finalRate: 15500 }),
    fare({ id: 'mid', finalRate: 18000 }),
  ]);

  assert.deepEqual(matches.map((f) => f.id), ['cheap', 'mid', 'pricey']);
});

test('an enquiry with no sector matches nothing', () => {
  assert.deepEqual(matchFaresToEnquiry({ ...ENQUIRY, sectorId: '' }, [fare()]), []);
  assert.deepEqual(matchFaresToEnquiry(null, [fare()]), []);
});

test('an alert fires when the best rate reaches the target', () => {
  const [alert] = evaluateEnquiryAlerts([ENQUIRY], [
    fare({ id: 'a', finalRate: 18000 }),
    fare({ id: 'b', finalRate: 16500 }),
  ]);

  assert.equal(alert.enquiryId, 'enq-1');
  assert.equal(alert.matchCount, 2);
  assert.equal(alert.bestRate, 16500);
  assert.equal(alert.meetsTarget, true);
});

test('a rate exactly on the target counts as met', () => {
  const [alert] = evaluateEnquiryAlerts([ENQUIRY], [fare({ finalRate: 17000 })]);
  assert.equal(alert.meetsTarget, true);
});

test('no alert while every fare is above the target', () => {
  const [alert] = evaluateEnquiryAlerts([ENQUIRY], [fare({ finalRate: 19000 })]);
  assert.equal(alert.meetsTarget, false);
  assert.equal(alert.bestRate, 19000);
});

test('an enquiry without a target is a record, not a watch', () => {
  const [alert] = evaluateEnquiryAlerts(
    [{ ...ENQUIRY, targetFare: null }],
    [fare({ finalRate: 9000 })],
  );

  assert.equal(alert.meetsTarget, false);
  assert.equal(alert.targetFare, null);
});

test('closed enquiries never alert', () => {
  const [alert] = evaluateEnquiryAlerts(
    [{ ...ENQUIRY, status: 'closed' }],
    [fare({ finalRate: 12000 })],
  );

  assert.equal(alert.meetsTarget, false);
});

test('countEnquiryAlerts counts only the enquiries below target', () => {
  const enquiries = [
    { ...ENQUIRY, id: 'hit', targetFare: 17000 },
    { ...ENQUIRY, id: 'miss', targetFare: 12000 },
    { ...ENQUIRY, id: 'closed', targetFare: 17000, status: 'closed' },
  ];

  assert.equal(countEnquiryAlerts(enquiries, [fare({ finalRate: 16500 })]), 1);
  assert.equal(countEnquiryAlerts([], [fare()]), 0);
  assert.equal(countEnquiryAlerts(enquiries, []), 0);
});
