import test from 'node:test';
import assert from 'node:assert/strict';

import { getPublicFares } from '../src/js/web/public-fares.js';

// The endpoint hands back `flightDate` as an ISO string, but the render path
// calls `.toLocaleDateString()` on it and `dedupeAndSortFares` groups on it — so
// the client wrapper has to rehydrate it into a real Date.

function stubFetch(payload, { ok = true, status = 200 } = {}) {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return { ok, status, json: async () => payload };
  };
  return calls;
}

test.afterEach(() => { delete globalThis.fetch; });

test('flightDate is rehydrated into a Date the render path can format', async () => {
  stubFetch({
    success: true,
    fares: [{ sectorId: 's1', airlineId: 'a1', flightDate: '2026-09-12T04:05:00.000Z', finalRate: 18500 }],
  });

  const fares = await getPublicFares({ sectorId: 's1' });

  assert.equal(fares.length, 1);
  assert.ok(fares[0].flightDate instanceof Date);
  assert.equal(fares[0].flightDate.toISOString(), '2026-09-12T04:05:00.000Z');
  assert.equal(fares[0].finalRate, 18500);
});

test('a row the server could not date is dropped, never rendered as Invalid Date', async () => {
  stubFetch({
    success: true,
    fares: [
      { sectorId: 's1', flightDate: null, finalRate: 1000 },
      { sectorId: 's1', flightDate: '2026-09-12T04:05:00.000Z', finalRate: 2000 },
    ],
  });

  const fares = await getPublicFares({ sectorId: 's1' });

  assert.equal(fares.length, 1);
  assert.equal(fares[0].finalRate, 2000);
});

test('filters are sent as query parameters', async () => {
  const calls = stubFetch({ success: true, fares: [] });

  await getPublicFares({ sectorId: 'sec-ccj-jed', startDate: '2026-09-01T00:00:00.000Z' });

  assert.match(calls[0], /getPublicFares\?/);
  assert.match(calls[0], /sectorId=sec-ccj-jed/);
  assert.match(calls[0], /startDate=2026-09-01/);
});

test('no sector means no request at all', async () => {
  const calls = stubFetch({ success: true, fares: [] });

  assert.deepEqual(await getPublicFares({}), []);
  assert.deepEqual(await getPublicFares(), []);
  assert.equal(calls.length, 0);
});

test('a failed request throws rather than rendering an empty flight list as truth', async () => {
  // The caller has a try/catch that shows an error state; silently returning []
  // would claim the route has no flights.
  stubFetch({}, { ok: false, status: 500 });
  await assert.rejects(() => getPublicFares({ sectorId: 's1' }), /500/);
});

test('an unexpected payload shape throws', async () => {
  stubFetch({ success: false });
  await assert.rejects(() => getPublicFares({ sectorId: 's1' }), /unexpected payload/);
});
