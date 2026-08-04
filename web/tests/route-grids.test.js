import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRouteMap } from '../src/js/web/public-routes.js';
import { buildOriginCards, splitOriginSections } from '../src/js/web/route-grids.js';

const ROUTES = [
  { id: 's1', originCode: 'CCJ', destCode: 'JED' },
  { id: 's2', originCode: 'CCJ', destCode: 'DXB' },
  { id: 's3', originCode: 'JED', destCode: 'CCJ' },
  { id: 's4', originCode: 'JED', destCode: 'COK' },
];

test('each origin card carries only its own destinations', () => {
  // The bug: every card in a section shared one destination list, so the CCJ
  // card offered all thirteen Gulf airports and the JED card all five Indian.
  const cards = buildOriginCards(buildRouteMap(ROUTES));
  const byCode = Object.fromEntries(cards.map((c) => [c.code, c]));

  assert.deepEqual(byCode.CCJ.destinations.map((d) => d.code), ['JED', 'DXB']);
  assert.deepEqual(byCode.JED.destinations.map((d) => d.code), ['CCJ', 'COK']);
});

test('a card never offers a destination with no fare behind it', () => {
  const cards = buildOriginCards(buildRouteMap(ROUTES));
  const jed = cards.find((c) => c.code === 'JED');

  assert.equal(jed.destinations.some((d) => d.code === 'TRV'), false);
  assert.equal(cards.some((c) => c.code === 'TRV'), false, 'TRV flies nowhere, so it gets no card');
});

test('cards carry display city names and the sector id for the fare modal', () => {
  const [ccj] = buildOriginCards(buildRouteMap([ROUTES[0]]));
  assert.equal(ccj.name, 'Kozhikode');
  assert.deepEqual(ccj.destinations[0], { code: 'JED', name: 'Jeddah', sectorId: 's1' });
});

test('an origin with no reachable destination gets no card', () => {
  const emptyMap = {
    origins: ['CCJ'],
    destinationsFor: () => [],
    sectorIdFor: () => '',
  };
  assert.deepEqual(buildOriginCards(emptyMap), []);
});

test('a missing or malformed route map yields no cards rather than throwing', () => {
  for (const input of [null, undefined, {}, { origins: 'nope' }]) {
    assert.deepEqual(buildOriginCards(input), []);
  }
});

test('sections split India from the Gulf on the airport directory', () => {
  const sections = splitOriginSections(buildOriginCards(buildRouteMap(ROUTES)));

  assert.deepEqual(sections.map((s) => s.label), ['India', 'Middle East']);
  assert.deepEqual(sections[0].origins.map((o) => o.code), ['CCJ']);
  assert.deepEqual(sections[1].origins.map((o) => o.code), ['JED']);
});

test('a section with no origins is dropped, not rendered empty', () => {
  const indiaOnly = splitOriginSections([{ code: 'CCJ' }, { code: 'COK' }]);
  assert.deepEqual(indiaOnly.map((s) => s.label), ['India']);

  const gulfOnly = splitOriginSections([{ code: 'JED' }]);
  assert.deepEqual(gulfOnly.map((s) => s.label), ['Middle East']);
});

test('no routes means no sections, which is what triggers the empty state', () => {
  assert.deepEqual(splitOriginSections(buildOriginCards(buildRouteMap([]))), []);
  assert.deepEqual(splitOriginSections([]), []);
  assert.deepEqual(splitOriginSections(null), []);
});

test('an unmapped origin code lands in the Gulf section rather than vanishing', () => {
  const sections = splitOriginSections([{ code: 'ZZZ' }]);
  assert.deepEqual(sections.map((s) => s.label), ['Middle East']);
});
