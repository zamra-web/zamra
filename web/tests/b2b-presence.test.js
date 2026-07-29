import test from 'node:test';
import assert from 'node:assert';

import {
  toMillis,
  resolvePresence,
  formatRelativeTime,
  formatAbsoluteTime,
  describeAgentActivity,
  ONLINE_WINDOW_MS,
  IDLE_WINDOW_MS,
} from '../src/js/shared/b2b-presence.js';

const NOW = Date.UTC(2026, 6, 29, 12, 0, 0); // 29 Jul 2026, 12:00 UTC

/** Stand-in for a Firestore Timestamp as the client SDK hands it over. */
function timestamp(ms) {
  return {
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1e6,
    toMillis: () => ms,
    toDate: () => new Date(ms),
  };
}

/** Same value after a callable has JSON-serialised it — no methods left. */
function plainTimestamp(ms) {
  return { seconds: Math.floor(ms / 1000), nanoseconds: (ms % 1000) * 1e6 };
}

// ── toMillis ─────────────────────────────────────────────────────────────────

test('toMillis reads every shape a stamp reaches the UI in', () => {
  assert.strictEqual(toMillis(timestamp(NOW)), NOW);
  assert.strictEqual(toMillis(plainTimestamp(NOW)), NOW);
  assert.strictEqual(toMillis(new Date(NOW)), NOW);
  assert.strictEqual(toMillis(NOW), NOW);
  assert.strictEqual(toMillis(new Date(NOW).toISOString()), NOW);
});

test('toMillis returns null for missing or unparseable values', () => {
  for (const value of [null, undefined, '', 'not a date', {}, NaN, new Date('nope')]) {
    assert.strictEqual(toMillis(value), null, `expected null for ${JSON.stringify(value)}`);
  }
});

// ── resolvePresence ──────────────────────────────────────────────────────────

test('resolvePresence matches the server windows', () => {
  assert.strictEqual(resolvePresence(timestamp(NOW - 30_000), NOW), 'online');
  assert.strictEqual(resolvePresence(timestamp(NOW - (ONLINE_WINDOW_MS - 1)), NOW), 'online');
  assert.strictEqual(resolvePresence(timestamp(NOW - ONLINE_WINDOW_MS), NOW), 'idle');
  assert.strictEqual(resolvePresence(timestamp(NOW - (IDLE_WINDOW_MS - 1)), NOW), 'idle');
  assert.strictEqual(resolvePresence(timestamp(NOW - IDLE_WINDOW_MS), NOW), 'offline');
});

test('resolvePresence reports offline when the agent has never been seen', () => {
  assert.strictEqual(resolvePresence(null, NOW), 'offline');
  assert.strictEqual(resolvePresence(undefined, NOW), 'offline');
});

test('resolvePresence keeps a slightly-future stamp online (clock skew)', () => {
  assert.strictEqual(resolvePresence(timestamp(NOW + 10_000), NOW), 'online');
});

// ── Formatting ───────────────────────────────────────────────────────────────

test('formatRelativeTime steps through the useful units', () => {
  assert.strictEqual(formatRelativeTime(NOW - 5_000, NOW), 'just now');
  assert.strictEqual(formatRelativeTime(NOW - 12 * 60_000, NOW), '12 min ago');
  assert.strictEqual(formatRelativeTime(NOW - 3 * 3_600_000, NOW), '3 hr ago');
  assert.strictEqual(formatRelativeTime(NOW - 26 * 3_600_000, NOW), 'yesterday');
  assert.strictEqual(formatRelativeTime(NOW - 4 * 86_400_000, NOW), '4 days ago');
});

test('formatRelativeTime falls back to an absolute date past a week', () => {
  const out = formatRelativeTime(NOW - 30 * 86_400_000, NOW);
  assert.match(out, /2026/);
  assert.doesNotMatch(out, /ago/);
});

test('formatRelativeTime returns empty string for no stamp', () => {
  assert.strictEqual(formatRelativeTime(null, NOW), '');
  assert.strictEqual(formatRelativeTime(0, NOW), '');
});

test('formatAbsoluteTime renders a stamp and empties when unset', () => {
  assert.match(formatAbsoluteTime(NOW), /Jul 2026/);
  assert.strictEqual(formatAbsoluteTime(null), '');
});

// ── describeAgentActivity ────────────────────────────────────────────────────

test('describeAgentActivity flags an agent with the portal open', () => {
  const info = describeAgentActivity({
    lastActiveAt: timestamp(NOW - 20_000),
    lastLoginAt: timestamp(NOW - 40 * 60_000),
  }, NOW);

  assert.strictEqual(info.presence, 'online');
  assert.strictEqual(info.label, 'Online');
  assert.strictEqual(info.everSeen, true);
  assert.strictEqual(info.lastLoginText, '40 min ago');
});

test('describeAgentActivity separates never-logged-in from offline', () => {
  const never = describeAgentActivity({}, NOW);
  assert.strictEqual(never.presence, 'offline');
  assert.strictEqual(never.everSeen, false);

  // Logged in once long ago but no heartbeat since — offline, yet clearly a
  // real user, which is the distinction the admin table needs to draw.
  const lapsed = describeAgentActivity({ lastLoginAt: timestamp(NOW - 10 * 86_400_000) }, NOW);
  assert.strictEqual(lapsed.presence, 'offline');
  assert.strictEqual(lapsed.everSeen, true);
});

test('describeAgentActivity works off JSON-shaped timestamps', () => {
  const info = describeAgentActivity({ lastActiveAt: plainTimestamp(NOW - 10_000) }, NOW);
  assert.strictEqual(info.presence, 'online');
});
