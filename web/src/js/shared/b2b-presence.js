/**
 * b2b-presence.js — turns B2B agent activity stamps into what the admin table
 * actually renders: an Online/Idle/Offline state and human "last seen" text.
 *
 * The thresholds here MUST match ONLINE_WINDOW_MS / IDLE_WINDOW_MS in
 * functions/b2bCredentials.js — the server decides how often a heartbeat lands,
 * and this decides how long a missing heartbeat still counts as present. Drift
 * between the two shows up as agents flickering offline while the portal is
 * open.
 */

/** A heartbeat lands every ~60s; fresher than this means the portal is open. */
export const ONLINE_WINDOW_MS = 3 * 60 * 1000;
/** Seen recently, but the tab is likely backgrounded or closed. */
export const IDLE_WINDOW_MS = 20 * 60 * 1000;

/**
 * Epoch ms from anything Firestore or a callable might hand back: a Timestamp
 * (`.toDate()` in the SDK, `{seconds}` when it has been through JSON), a Date,
 * an ISO string, or raw ms.
 * @returns {number|null}
 */
export function toMillis(value) {
  if (value == null) return null;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime();
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'object' && Number.isFinite(Number(value.seconds))) {
    return Number(value.seconds) * 1000 + Math.round(Number(value.nanoseconds || 0) / 1e6);
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * @param {*} lastActiveAt  Firestore Timestamp / Date / ms / ISO
 * @param {number} [now]
 * @returns {'online'|'idle'|'offline'}
 */
export function resolvePresence(lastActiveAt, now = Date.now()) {
  const last = toMillis(lastActiveAt);
  if (last == null || last <= 0) return 'offline';
  // Client/server clock skew can put `last` marginally in the future — that is
  // still "just seen", so a negative age stays online rather than wrapping.
  const age = now - last;
  if (age < ONLINE_WINDOW_MS) return 'online';
  if (age < IDLE_WINDOW_MS) return 'idle';
  return 'offline';
}

/**
 * Compact relative time: "just now", "12 min ago", "3 hr ago", "2 days ago",
 * then an absolute date once it stops being useful as a duration.
 * @param {*} value
 * @param {number} [now]
 * @returns {string} '' when there is no usable stamp
 */
export function formatRelativeTime(value, now = Date.now()) {
  const ms = toMillis(value);
  if (ms == null || ms <= 0) return '';

  const diff = now - ms;
  if (diff < 0) return 'just now';           // clock skew
  if (diff < 60 * 1000) return 'just now';

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  return new Date(ms).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Absolute stamp for tooltips — "28 Jul 2026, 14:20". '' when unset. */
export function formatAbsoluteTime(value) {
  const ms = toMillis(value);
  if (ms == null || ms <= 0) return '';
  return new Date(ms).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Everything the admin table needs for one agent's activity cell.
 *
 * `lastLoginAt` is when they last signed in; `lastActiveAt` is the last
 * heartbeat. An agent who never logged in reports 'never', which reads very
 * differently from 'offline' when chasing an agent who says the portal is broken.
 *
 * @param {{lastActiveAt?: *, lastLoginAt?: *}} agent
 * @param {number} [now]
 */
export function describeAgentActivity(agent, now = Date.now()) {
  const lastActive = toMillis(agent?.lastActiveAt);
  const lastLogin = toMillis(agent?.lastLoginAt);
  const presence = resolvePresence(agent?.lastActiveAt, now);

  return {
    presence,
    label: { online: 'Online', idle: 'Idle', offline: 'Offline' }[presence],
    everSeen: lastActive != null || lastLogin != null,
    lastActiveText: formatRelativeTime(lastActive, now),
    lastActiveTitle: formatAbsoluteTime(lastActive),
    lastLoginText: formatRelativeTime(lastLogin, now),
    lastLoginTitle: formatAbsoluteTime(lastLogin),
  };
}
