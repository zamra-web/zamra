import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeDealSlug,
  isValidDealSlug,
  resolveDealWindow,
  chunkSectorIds,
  parseDealSlugFromLocation,
  buildDealLinkUrl,
  FIRESTORE_IN_LIMIT,
} from '../src/js/shared/deal-links.js';

test('slugs are lowercased and punctuation collapses to single hyphens', () => {
  assert.equal(normalizeDealSlug('All Saudi Offers'), 'all-saudi-offers');
  assert.equal(normalizeDealSlug('  Calicut → Jeddah!!  '), 'calicut-jeddah');
  assert.equal(normalizeDealSlug('UAE___Deals'), 'uae-deals');
});

test('slugs too short to be useful are rejected', () => {
  assert.equal(normalizeDealSlug('ab'), '');
  assert.equal(normalizeDealSlug('!!'), '');
  assert.equal(normalizeDealSlug(''), '');
  assert.equal(normalizeDealSlug(null), '');
});

test('slugs are capped and never end on a hyphen', () => {
  const slug = normalizeDealSlug('a'.repeat(80));
  assert.equal(slug.length, 48);

  const trimmed = normalizeDealSlug(`${'b'.repeat(47)} tail`);
  assert.ok(!trimmed.endsWith('-'));
});

test('isValidDealSlug accepts an already-normalized slug only', () => {
  assert.equal(isValidDealSlug('all-saudi-offers'), true);
  assert.equal(isValidDealSlug('All Saudi Offers'), false);
});

test('a rolling window re-anchors to today on every visit', () => {
  const now = new Date('2026-08-01T09:30:00');
  const { startDate, endDate } = resolveDealWindow({ windowMode: 'rolling', rollingDays: 30 }, now);

  assert.equal(startDate.getHours(), 0);
  assert.equal(startDate.getDate(), 1);
  assert.equal(endDate.getDate(), 31);
  assert.equal(endDate.getHours(), 23);
});

test('rolling defaults to 30 days when unset or nonsense', () => {
  const now = new Date('2026-08-01T00:00:00');
  // rollingDays counts days AHEAD of today, and the last day runs to 23:59:59,
  // so floor() of the span is the number of days ahead.
  const days = (link) => Math.floor(
    (resolveDealWindow(link, now).endDate - resolveDealWindow(link, now).startDate) / 86400000,
  );

  assert.equal(days({}), 30);
  assert.equal(days({ rollingDays: 0 }), 30);
  assert.equal(days({ rollingDays: 'soon' }), 30);
  assert.equal(days({ rollingDays: 7 }), 7);
});

test('a fixed window is passed through, spanning whole days', () => {
  const { startDate, endDate } = resolveDealWindow({
    windowMode: 'fixed',
    startDate: new Date('2026-09-10T14:00:00'),
    endDate: new Date('2026-09-20T08:00:00'),
  }, new Date('2026-08-01T00:00:00'));

  assert.equal(startDate.getDate(), 10);
  assert.equal(startDate.getHours(), 0);
  assert.equal(endDate.getDate(), 20);
  assert.equal(endDate.getHours(), 23);
});

test('a fixed window missing its dates falls back to rolling', () => {
  const now = new Date('2026-08-01T00:00:00');
  const { startDate } = resolveDealWindow({ windowMode: 'fixed', startDate: null }, now);
  assert.equal(startDate.getDate(), 1);
});

test('sector ids chunk at the Firestore `in` limit', () => {
  const ids = Array.from({ length: 30 }, (_, i) => `sec-${i}`);
  assert.equal(chunkSectorIds(ids).length, 1);

  const overflow = Array.from({ length: 31 }, (_, i) => `sec-${i}`);
  const chunks = chunkSectorIds(overflow);
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, FIRESTORE_IN_LIMIT);
  assert.equal(chunks[1].length, 1);
});

test('chunking dedupes and drops blanks', () => {
  const chunks = chunkSectorIds(['a', 'a', ' b ', '', null, 'c']);
  assert.deepEqual(chunks, [['a', 'b', 'c']]);
  assert.deepEqual(chunkSectorIds([]), []);
  assert.deepEqual(chunkSectorIds(null), []);
});

test('a chunk size can never exceed the Firestore limit', () => {
  const ids = Array.from({ length: 40 }, (_, i) => `sec-${i}`);
  assert.equal(chunkSectorIds(ids, 100)[0].length, FIRESTORE_IN_LIMIT);
});

test('the slug is read from a path or a query fallback', () => {
  assert.equal(parseDealSlugFromLocation({ pathname: '/deals/all-saudi-offers' }), 'all-saudi-offers');
  assert.equal(parseDealSlugFromLocation({ pathname: '/deals/all-saudi-offers/' }), 'all-saudi-offers');
  assert.equal(parseDealSlugFromLocation({ pathname: '/deals', search: '?s=uae-deals' }), 'uae-deals');
  assert.equal(parseDealSlugFromLocation({ pathname: '/deals' }), '');
  assert.equal(parseDealSlugFromLocation({}), '');
});

test('the shareable URL is built from the origin and slug', () => {
  assert.equal(
    buildDealLinkUrl('all-saudi-offers', 'https://zamratravels.com'),
    'https://zamratravels.com/deals/all-saudi-offers',
  );
  assert.equal(
    buildDealLinkUrl('all-saudi-offers', 'https://zamratravels.com/'),
    'https://zamratravels.com/deals/all-saudi-offers',
  );
  assert.equal(buildDealLinkUrl('ab', 'https://zamratravels.com'), '');
});
