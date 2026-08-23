// The connection rule: "CCJ - MCT – DXB" is a Calicut→Dubai fare that changes
// planes in Muscat, not a Calicut→Muscat fare.
//
// Getting this wrong is expensive in a specific way — the sector it invents
// (CCJ-MCT) is usually a real sellable sector, so nothing downstream rejects
// it. A Dubai price goes on sale as a Muscat price and the first sign of
// trouble is a booking Zamra cannot honour.
//
// The n8n half of the same rule is covered by
// functions/tests/n8n-workflow.test.js.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { readPrintedRoute, printedRouteStops } from '../src/js/shared/rate-route.js';

test('a connection is not the destination', () => {
  const route = readPrintedRoute('CCJ - MCT – DXB  (30+7kg)');
  assert.equal(route.origin, 'CCJ');
  assert.equal(route.destination, 'DXB');
  assert.deepEqual(route.via, ['MCT']);
});

test('reads plain and dashed two-airport routes', () => {
  for (const printed of ['CCJ JED IX FARES', 'CCJ-JED', 'CCJ/JED', 'CCJ > JED', 'CCJ TO JED']) {
    const route = readPrintedRoute(printed);
    assert.deepEqual(
      [route?.origin, route?.destination, route?.via],
      ['CCJ', 'JED', []],
      `misread "${printed}"`,
    );
  }
});

test('a connection printed after the sector is still a connection', () => {
  // "via" moves the stop to the end of the line, where the last-code rule would
  // otherwise read Muscat as the destination.
  const route = readPrintedRoute('CCJ-DXB via MCT');
  assert.equal(route.origin, 'CCJ');
  assert.equal(route.destination, 'DXB');
  assert.deepEqual(route.via, ['MCT']);
});

test('two stops with no separator at all still chain', () => {
  const route = readPrintedRoute('CCJ MCT DXB 30+7');
  assert.equal(route.origin, 'CCJ');
  assert.equal(route.destination, 'DXB');
});

test('slashed alternatives share one stop', () => {
  // "CCJ/COK - DXB" is two origins for one destination. Kochi is an alternative
  // departure, not somewhere the passenger changes planes.
  const route = readPrintedRoute('CCJ/COK - DXB');
  assert.equal(route.origin, 'CCJ');
  assert.equal(route.destination, 'DXB');
  assert.deepEqual(route.via, []);
  assert.deepEqual(route.stops, [['CCJ', 'COK'], ['DXB']]);
});

test('a round trip sells its outbound sector', () => {
  const route = readPrintedRoute('CCJ - DXB - CCJ');
  assert.equal(route.origin, 'CCJ');
  assert.equal(route.destination, 'DXB');
});

test('direction is preserved, never normalised', () => {
  const route = readPrintedRoute('DXB - MCT - CCJ');
  assert.equal(route.origin, 'DXB');
  assert.equal(route.destination, 'CCJ');
});

test('three-letter tokens that are not airports are ignored', () => {
  // Months and weekdays are the dangerous ones: "31 AUG WED" would otherwise
  // read as two more stops and move the destination.
  assert.equal(readPrintedRoute('31 AUG WED 15500'), null);
  assert.deepEqual(printedRouteStops('CCJ - DXB 31 AUG WED'), [['CCJ'], ['DXB']]);
});

test('returns null when no route is printed', () => {
  for (const text of ['DXB RATES', 'Calicut to Jeddah', 'INFANT FARE : 6,500/-', '', null]) {
    assert.equal(readPrintedRoute(text), null, `expected no route in "${text}"`);
  }
});

// ── the admin upload preview ────────────────────────────────────────────────
// quickParse lives inside admin/main.js, which cannot be imported under node
// (it touches `document` at module scope), so lift it out of the source the way
// admin-shadowed-helpers.test.js does and run it against real declarations.

const adminSource = readFileSync(new URL('../src/js/admin/main.js', import.meta.url), 'utf8');

function loadQuickParse() {
  const consts = ['MONTHS', 'AIR_RX', 'RATE_AMOUNT_RX'].map((name) => {
    const match = adminSource.match(new RegExp(`^const ${name} = .*$`, 'm'));
    assert.ok(match, `admin/main.js no longer declares ${name}`);
    return match[0];
  });
  const start = adminSource.indexOf('function quickParse(text) {');
  assert.notEqual(start, -1, 'admin/main.js no longer declares quickParse');
  const end = adminSource.indexOf('\n}\n', start);
  const body = adminSource.slice(start, end + 2);
  return new Function('readPrintedRoute', `${consts.join('\n')}\n${body}\nreturn quickParse;`)(readPrintedRoute);
}

test('the upload preview reads a connecting sheet as the through sector', () => {
  const quickParse = loadQuickParse();
  const rows = quickParse([
    'CCJ - MCT – DXB  (30+7kg)',
    'INFANT FARE : 6,500/-(10 KG check in Baggage)',
    '',
    '31 AUG : 40,200/-  WY 298/609',
  ].join('\n'));

  // The infant line carries no date, so it is not a fare row.
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], { sector: 'CCJ-DXB', date: '2026-08-31', airline: 'WY', rate: 40200 });
});

test('the upload preview still reads a plain sheet', () => {
  const quickParse = loadQuickParse();
  const rows = quickParse('*CCJ JED IX FARES*\n04 MAR 15500\n05 MAR 15500');
  assert.deepEqual(rows.map((r) => r.sector), ['CCJ-JED', 'CCJ-JED']);
  assert.deepEqual(rows.map((r) => r.rate), [15500, 15500]);
  assert.deepEqual(rows.map((r) => r.airline), ['IX', 'IX']);
});
