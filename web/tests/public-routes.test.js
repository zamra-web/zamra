import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRouteMap, getPublicRoutes } from '../src/js/web/public-routes.js';

const ROUTES = [
  { id: 's1', sectorCode: 'CCJ JED', originCode: 'CCJ', destCode: 'JED' },
  { id: 's2', sectorCode: 'CCJ DXB', originCode: 'CCJ', destCode: 'DXB' },
  { id: 's3', sectorCode: 'JED CCJ', originCode: 'JED', destCode: 'CCJ' },
  { id: 's4', sectorCode: 'JED COK', originCode: 'JED', destCode: 'COK' },
];

test('destinations are scoped to the selected origin', () => {
  // The reported bug: picking JED offered every airport in the system, including
  // TRV, which has no JED route at all.
  const map = buildRouteMap(ROUTES);
  assert.deepEqual(map.destinationsFor('JED'), ['CCJ', 'COK']);
  assert.equal(map.destinationsFor('JED').includes('TRV'), false);
});

test('an origin with no routes yields an empty destination list, not every airport', () => {
  const map = buildRouteMap(ROUTES);
  assert.deepEqual(map.destinationsFor('TRV'), []);
  assert.deepEqual(map.destinationsFor(''), []);
});

test('origins are only airports something actually departs from', () => {
  assert.deepEqual(buildRouteMap(ROUTES).origins, ['CCJ', 'JED']);
});

test('lookups are case-insensitive', () => {
  const map = buildRouteMap(ROUTES);
  assert.deepEqual(map.destinationsFor('ccj'), ['JED', 'DXB']);
  assert.equal(map.hasRoute('ccj', 'jed'), true);
  assert.equal(map.hasRoute('CCJ', 'MED'), false);
});

test('the sector id travels with the pair, so the search never re-derives it', () => {
  // Matching `"${origin} ${dest}"` against sectorCode misses the CCJ-JED form.
  const map = buildRouteMap([
    { id: 'dashed', sectorCode: 'CCJ-JED', originCode: 'CCJ', destCode: 'JED' },
  ]);
  assert.equal(map.sectorIdFor('CCJ', 'JED'), 'dashed');
  assert.equal(map.sectorIdFor('CCJ', 'MED'), '');
});

test('a duplicated city pair appears once, keeping the highest-ranked sector', () => {
  const map = buildRouteMap([
    { id: 'first', originCode: 'CCJ', destCode: 'JED' },
    { id: 'second', originCode: 'CCJ', destCode: 'JED' },
  ]);
  assert.deepEqual(map.destinationsFor('CCJ'), ['JED']);
  assert.equal(map.sectorIdFor('CCJ', 'JED'), 'first');
});

test('a malformed or empty route list produces an empty map, not a throw', () => {
  for (const input of [null, undefined, [], [null, {}, { originCode: 'CCJ' }]]) {
    assert.equal(buildRouteMap(input).size, 0);
  }
});

/** Swap in a fetch that returns `payload`, restoring the original afterwards. */
async function withFetch(impl, run) {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

test('a successful fetch returns only well-formed routes', async () => {
  const routes = await withFetch(
    async () => ({
      ok: true,
      json: async () => ({ success: true, routes: [...ROUTES, { id: 'junk' }] }),
    }),
    getPublicRoutes,
  );
  assert.deepEqual(routes.map((r) => r.id), ['s1', 's2', 's3', 's4']);
});

test('every failure mode resolves to [] so the static options survive', async () => {
  // An empty result is the caller's signal to leave the hardcoded lists alone.
  // Rejecting instead would blank the search out on any blip.
  const failures = [
    async () => { throw new Error('offline'); },
    async () => ({ ok: false, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => ({ success: false }) }),
    async () => ({ ok: true, json: async () => ({ success: true, routes: 'nope' }) }),
    async () => ({ ok: true, json: async () => { throw new Error('bad json'); } }),
  ];

  for (const impl of failures) {
    assert.deepEqual(await withFetch(impl, getPublicRoutes), []);
  }
});
