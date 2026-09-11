import test from 'node:test';
import assert from 'node:assert';

import {
  fareKey,
  fareSignature,
  summarizeFareChange,
  describeFareChange,
  shouldRefresh,
  isStaleOnResume,
  formatUpdatedLabel,
  FARE_REFRESH_MS,
  REFRESH_RETRY_MS,
  RESUME_STALE_MS,
} from '../src/js/shared/b2b-freshness.js';

const NOW = Date.UTC(2026, 8, 12, 9, 0, 0);

/** One entry shaped exactly as computeB2BFares emits it. */
function fare(over = {}) {
  return {
    airlineId: 'air-6e',
    flightDate: '2026-09-20T00:00:00.000Z',
    flightTime: '09:45 - 12:30',
    baggage: 30,
    extraBaggage: 0,
    price: 21500,
    ...over,
  };
}

// ── fareKey / fareSignature ──────────────────────────────────────────────────

test('fareKey ignores price, so a reprice stays the same flight', () => {
  assert.strictEqual(fareKey(fare()), fareKey(fare({ price: 24000 })));
});

test('fareKey separates flights that differ by airline, date or time', () => {
  const base = fareKey(fare());
  assert.notStrictEqual(base, fareKey(fare({ airlineId: 'air-sg' })));
  assert.notStrictEqual(base, fareKey(fare({ flightDate: '2026-09-21T00:00:00.000Z' })));
  assert.notStrictEqual(base, fareKey(fare({ flightTime: '18:00 - 20:45' })));
});

test('fareSignature is order-independent', () => {
  const a = fare();
  const b = fare({ airlineId: 'air-sg', price: 19900 });
  assert.strictEqual(fareSignature([a, b]), fareSignature([b, a]));
});

test('fareSignature moves when price, baggage or extra baggage moves', () => {
  const base = fareSignature([fare()]);
  assert.notStrictEqual(base, fareSignature([fare({ price: 21600 })]));
  assert.notStrictEqual(base, fareSignature([fare({ baggage: 40 })]));
  assert.notStrictEqual(base, fareSignature([fare({ extraBaggage: 10 })]));
});

test('fareSignature survives an empty or missing set', () => {
  assert.strictEqual(fareSignature([]), '');
  assert.strictEqual(fareSignature(null), '');
  assert.strictEqual(fareSignature(undefined), '');
});

// ── summarizeFareChange ──────────────────────────────────────────────────────

test('an identical refetch reports no change, so the DOM is left alone', () => {
  const fares = [fare(), fare({ airlineId: 'air-sg', price: 19900 })];
  const change = summarizeFareChange(fares, fares.map((f) => ({ ...f })));
  assert.deepStrictEqual(change, { changed: false, added: 0, removed: 0, repriced: 0 });
  assert.strictEqual(describeFareChange(change), '');
});

test('a reprice counts as repriced, not as an add plus a remove', () => {
  const change = summarizeFareChange([fare()], [fare({ price: 23000 })]);
  assert.deepStrictEqual(change, { changed: true, added: 0, removed: 0, repriced: 1 });
  assert.strictEqual(describeFareChange(change), '1 price updated');
});

test('a sold-out flight vanishing from the refetch is reported as removed', () => {
  const change = summarizeFareChange([fare(), fare({ airlineId: 'air-sg' })], [fare()]);
  assert.deepStrictEqual(change, { changed: true, added: 0, removed: 1, repriced: 0 });
  assert.strictEqual(describeFareChange(change), '1 removed');
});

test('a fresh upload landing mid-session is reported as added', () => {
  const change = summarizeFareChange([fare()], [fare(), fare({ flightDate: '2026-09-21T00:00:00.000Z' })]);
  assert.deepStrictEqual(change, { changed: true, added: 1, removed: 0, repriced: 0 });
  assert.strictEqual(describeFareChange(change), '1 new');
});

test('describeFareChange combines every kind of movement', () => {
  const prev = [fare(), fare({ airlineId: 'air-sg' }), fare({ airlineId: 'air-uk' })];
  const next = [
    fare({ price: 22000 }),
    fare({ airlineId: 'air-sg' }),
    fare({ flightTime: '22:10 - 00:55' }),
  ];
  const change = summarizeFareChange(prev, next);
  assert.deepStrictEqual(change, { changed: true, added: 1, removed: 1, repriced: 1 });
  assert.strictEqual(describeFareChange(change), '1 price updated · 1 new · 1 removed');
});

test('a baggage-only change re-renders even though no count moves', () => {
  const change = summarizeFareChange([fare()], [fare({ baggage: 40 })]);
  assert.strictEqual(change.changed, true);
  assert.strictEqual(change.added + change.removed + change.repriced, 0);
});

// ── shouldRefresh ────────────────────────────────────────────────────────────

const base = { lastAt: NOW - FARE_REFRESH_MS, now: NOW, intervalMs: FARE_REFRESH_MS };

test('refreshes once the interval has elapsed', () => {
  assert.strictEqual(shouldRefresh(base), true);
});

test('holds off inside the interval', () => {
  assert.strictEqual(shouldRefresh({ ...base, lastAt: NOW - 1000 }), false);
});

test('never polls a hidden tab, an offline browser, or over itself', () => {
  assert.strictEqual(shouldRefresh({ ...base, visible: false }), false);
  assert.strictEqual(shouldRefresh({ ...base, online: false }), false);
  assert.strictEqual(shouldRefresh({ ...base, inFlight: true }), false);
});

test('holds off while the agent has a details sheet open', () => {
  assert.strictEqual(shouldRefresh({ ...base, blocked: true }), false);
});

test('fetches immediately when nothing has loaded yet', () => {
  assert.strictEqual(shouldRefresh({ ...base, lastAt: 0 }), true);
});

test('a failure backs off to the short retry, not the full interval', () => {
  const failedAt = NOW - 5000;
  const lastAt = NOW - FARE_REFRESH_MS;
  assert.strictEqual(shouldRefresh({ ...base, lastAt, failedAt }), false);
  assert.strictEqual(
    shouldRefresh({ ...base, lastAt, failedAt, now: failedAt + REFRESH_RETRY_MS }),
    true,
  );
});

test('a stale failure does not force a refresh the interval has not earned', () => {
  // Failure older than the last success: the success reset the clock.
  assert.strictEqual(
    shouldRefresh({ ...base, lastAt: NOW - 1000, failedAt: NOW - 90_000 }),
    false,
  );
});

// ── isStaleOnResume ──────────────────────────────────────────────────────────

test('returning to a tab refetches only when the data has aged past the window', () => {
  assert.strictEqual(isStaleOnResume(NOW - (RESUME_STALE_MS - 1), NOW), false);
  assert.strictEqual(isStaleOnResume(NOW - RESUME_STALE_MS, NOW), true);
  assert.strictEqual(isStaleOnResume(0, NOW), true);
});

test('an app resumed after a night away is stale', () => {
  assert.strictEqual(isStaleOnResume(NOW - 12 * 60 * 60 * 1000, NOW), true);
});

// ── formatUpdatedLabel ───────────────────────────────────────────────────────

test('formatUpdatedLabel reads as relative, then absolute past an hour', () => {
  assert.strictEqual(formatUpdatedLabel(NOW, NOW), 'just now');
  assert.strictEqual(formatUpdatedLabel(NOW - 30_000, NOW), 'just now');
  assert.strictEqual(formatUpdatedLabel(NOW - 4 * 60_000, NOW), '4 min ago');
  assert.strictEqual(formatUpdatedLabel(NOW - 59 * 60_000, NOW), '59 min ago');
  assert.match(formatUpdatedLabel(NOW - 3 * 60 * 60_000, NOW), /^\d{2}:\d{2}$/);
});

test('formatUpdatedLabel is empty before the first load, so the label can hide', () => {
  assert.strictEqual(formatUpdatedLabel(0, NOW), '');
  assert.strictEqual(formatUpdatedLabel(null, NOW), '');
});
