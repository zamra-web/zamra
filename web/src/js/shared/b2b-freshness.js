/**
 * b2b-freshness.js — when the B2B portal refetches, and whether anything moved.
 *
 * WHY THIS EXISTS
 *
 * The admin dashboard is genuinely live: it reads `agent_fares` through
 * `onSnapshot`, so an upload lands on screen by itself. The portal cannot do
 * that — `agent_fares` is admin-only and prices are computed per agent inside
 * `getB2BFares` (see CLAUDE.md), so the portal's only window on the data is a
 * callable it has to choose to call again.
 *
 * It never chose to. Routes were fetched once per page load and results once per
 * Search click, with no timer, no refetch on tab focus, and no invalidation. The
 * data was correct at the instant of the call and then froze: an agent who
 * searched at 09:00 and left the tab — or the Android app, whose WebView keeps
 * the page alive across resumes — was quoting 09:00's prices at 17:00.
 *
 * So the portal polls, and these are the pure decisions behind it, kept here so
 * web/tests can exercise them without a DOM.
 *
 * Polling is only worth what it costs, which is why `fareSignature` matters as
 * much as the interval: a refetch that returns identical fares must not re-render.
 * Re-rendering swaps the DOM under whatever the agent is reading and resets their
 * scroll, so a silent poll that changed nothing has to be invisible.
 */

/**
 * How often an on-screen result set refetches while the tab is visible.
 *
 * Two minutes is chosen against what the agent is doing with the number: they
 * are reading a price off the screen and typing it into a WhatsApp quote. The
 * cost is one `getB2BFares` per open portal per two minutes, which is the same
 * order as the presence heartbeat already running at 60s.
 */
export const FARE_REFRESH_MS = 2 * 60 * 1000;

/**
 * How often the route list + offers refetch. Longer than the fare interval on
 * purpose: a route appearing or disappearing entirely is a much rarer event than
 * a price moving, and `getB2BPortalContext` is the expensive call of the two
 * (whole `sectors` collection, whole `b2b_offers`, and a count sweep per sector).
 */
export const CONTEXT_REFRESH_MS = 10 * 60 * 1000;

/**
 * On returning to a hidden tab (or resuming the Android app), refetch
 * immediately if the data is older than this rather than waiting out the
 * interval. The whole failure this module exists to fix is an agent coming back
 * to a page that stopped updating while they were away, so the return itself is
 * the strongest signal there is that a refresh is wanted.
 */
export const RESUME_STALE_MS = 30 * 1000;

/**
 * After a failed refresh, wait this long before retrying instead of the normal
 * interval. Short, because a failure here is usually one dropped request on a
 * hotel wifi rather than an outage — but not zero, or a genuinely down backend
 * gets hammered by every open portal at once.
 */
export const REFRESH_RETRY_MS = 20 * 1000;

/** Below this age the label reads "just now" rather than "0 min ago". */
const JUST_NOW_MS = 45 * 1000;

/** Past this age the label switches from relative to an absolute clock time. */
const ABSOLUTE_AFTER_MS = 60 * 60 * 1000;

/**
 * Identity of one fare within a single route's results.
 *
 * `computeB2BFares` has already deduped by sector + airline + date + time, so
 * within one sector those three fields are unique per row. Price is deliberately
 * NOT part of the key — a reprice has to read as the same flight costing
 * something different, not as one flight vanishing and another appearing.
 *
 * @param {object} fare  one entry from getB2BFares
 * @returns {string}
 */
export function fareKey(fare) {
  return [
    String(fare?.airlineId || ''),
    String(fare?.flightDate || ''),
    String(fare?.flightTime || ''),
  ].join('|');
}

/**
 * A stable fingerprint of everything the portal renders from a fare set.
 *
 * Compared against the previous fingerprint to decide whether a refresh is worth
 * a re-render. It covers baggage as well as price because baggage is printed on
 * the card and in the WhatsApp quote — a row whose allowance changed but whose
 * price did not is still a row the agent must not keep quoting from.
 *
 * Sorted so a backend that returns the same fares in a different order does not
 * read as a change.
 *
 * @param {Array<object>} fares
 * @returns {string}
 */
export function fareSignature(fares) {
  if (!Array.isArray(fares)) return '';
  return fares
    .map((fare) => [
      fareKey(fare),
      Number(fare?.price) || 0,
      String(fare?.baggage ?? ''),
      Number(fare?.extraBaggage) || 0,
    ].join('~'))
    .sort()
    .join(';');
}

/**
 * What actually moved between two fare sets.
 *
 * The counts drive the one-line notice the agent sees after a silent refresh.
 * Telling them *what* changed is the point: a price that silently rewrites
 * itself while they are mid-quote is worse than a stale one, because a stale
 * price at least matches the number they just read aloud.
 *
 * @param {Array<object>} prev
 * @param {Array<object>} next
 * @returns {{changed: boolean, added: number, removed: number, repriced: number}}
 */
export function summarizeFareChange(prev, next) {
  const before = new Map((Array.isArray(prev) ? prev : []).map((f) => [fareKey(f), f]));
  const after = new Map((Array.isArray(next) ? next : []).map((f) => [fareKey(f), f]));

  let added = 0;
  let repriced = 0;
  for (const [key, fare] of after) {
    const old = before.get(key);
    if (!old) {
      added += 1;
    } else if ((Number(old.price) || 0) !== (Number(fare.price) || 0)) {
      repriced += 1;
    }
  }

  let removed = 0;
  for (const key of before.keys()) if (!after.has(key)) removed += 1;

  // Signature rather than the counts above, so a change the counts cannot see
  // (baggage moving on an otherwise identical row) still forces a re-render.
  const changed = fareSignature(prev) !== fareSignature(next);
  return { changed, added, removed, repriced };
}

/**
 * Human sentence for a change summary, or '' when nothing moved.
 *
 * Deliberately does not enumerate every combination — "3 fares updated" is
 * enough for the agent to know to re-read the screen, and the cards themselves
 * carry the detail.
 *
 * @param {{added: number, removed: number, repriced: number}} change
 * @returns {string}
 */
export function describeFareChange(change) {
  const parts = [];
  if (change?.repriced) parts.push(`${change.repriced} price${change.repriced === 1 ? '' : 's'} updated`);
  if (change?.added) parts.push(`${change.added} new`);
  if (change?.removed) parts.push(`${change.removed} removed`);
  return parts.join(' · ');
}

/**
 * Should a refetch run right now?
 *
 * Every reason to hold off lives here rather than being scattered across the
 * timer, the visibility handler and the manual button, so all three agree.
 *
 * @param {object} opts
 * @param {number} opts.lastAt      ms timestamp of the last successful fetch (0 = never)
 * @param {number} opts.now
 * @param {number} opts.intervalMs  normal cadence
 * @param {boolean} [opts.visible]  document.visibilityState === 'visible'
 * @param {boolean} [opts.online]   navigator.onLine
 * @param {boolean} [opts.inFlight] a refresh is already running
 * @param {boolean} [opts.blocked]  the agent is reading an open details sheet
 * @param {number} [opts.failedAt]  ms timestamp of the last failure (0 = none)
 * @returns {boolean}
 */
export function shouldRefresh({
  lastAt,
  now,
  intervalMs,
  visible = true,
  online = true,
  inFlight = false,
  blocked = false,
  failedAt = 0,
}) {
  // A hidden tab is not an agent reading prices. Polling it would burn a
  // callable a minute for a screen nobody is looking at — the resume handler
  // covers the moment they come back, which is the only moment that matters.
  if (!visible || !online || inFlight || blocked) return false;
  if (!lastAt) return true;

  // Back off after a failure, but never *extend* a wait that was already longer.
  const wait = failedAt > lastAt ? Math.min(intervalMs, REFRESH_RETRY_MS) : intervalMs;
  const since = now - Math.max(lastAt, failedAt);
  return since >= wait;
}

/**
 * Is data fetched at `lastAt` stale enough that returning to the tab should
 * refetch immediately instead of waiting for the next tick?
 *
 * @param {number} lastAt
 * @param {number} now
 * @param {number} [staleMs]
 * @returns {boolean}
 */
export function isStaleOnResume(lastAt, now, staleMs = RESUME_STALE_MS) {
  if (!lastAt) return true;
  return now - lastAt >= staleMs;
}

/**
 * "just now" / "4 min ago" / "09:12" — how old the prices on screen are.
 *
 * Switches to an absolute clock time past an hour because "73 min ago" is a
 * number the agent has to do arithmetic on, while "09:12" is one they can
 * compare to the clock. An empty string means nothing has loaded yet, and the
 * caller hides the label entirely rather than printing "never".
 *
 * @param {number} lastAt
 * @param {number} now
 * @returns {string}
 */
export function formatUpdatedLabel(lastAt, now) {
  if (!lastAt || !Number.isFinite(lastAt)) return '';
  const age = Math.max(0, now - lastAt);
  if (age < JUST_NOW_MS) return 'just now';
  if (age < ABSOLUTE_AFTER_MS) {
    const mins = Math.round(age / 60000);
    return `${mins} min ago`;
  }
  return new Date(lastAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
