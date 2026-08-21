/**
 * tab-routes.js — the URL contract for the admin dashboard's tabs.
 *
 * `admin.html` is one page with N tab panels, and Vercel rewrites `/admin(.*)`
 * to it, so every path below is served by the same bundle. This module is the
 * single source of truth mapping the URL slug to the panel id; `initTabs()` in
 * main.js reads it at boot and on popstate, and a drift test asserts it stays
 * in sync with both the nav links and the mobile `<select>` in admin.html.
 *
 * Slugs are the public contract, so they deliberately do not carry the internal
 * `-tab` suffix, and five of them differ from the panel id outright
 * (`rate-upload` → `agent-sheets-tab`, `hajj-umrah` → `hajjumrah-tab`, …).
 *
 * Pure: no DOM, no Firebase, no imports — so `node --test` can load it directly.
 */

/** @type {Readonly<Record<string, string>>} URL slug → tab panel id. */
export const ADMIN_TAB_ROUTES = Object.freeze({
  '': 'dashboard-tab',
  'socials': 'socials-tab',
  'whatsapp': 'whatsapp-tab',
  'rate-upload': 'agent-sheets-tab',
  'eticket': 'eticket-tab',
  'design': 'design-tab',
  'reports': 'reports-tab',
  'database': 'database-tab',
  'enquiry': 'enquiry-tab',
  'agents': 'agents-tab',
  'b2b-agents': 'b2b-agents-tab',
  'sectors': 'sectors-tab',
  'flights': 'flights-tab',
  'visas': 'visas-tab',
  'tours': 'tours-tab',
  'hajj-umrah': 'hajjumrah-tab',
});

/** The tab shown for `/admin`, and the fallback for any unknown path. */
export const DEFAULT_TAB_ID = 'dashboard-tab';

/** Base path every admin URL hangs off. */
export const ADMIN_BASE_PATH = '/admin';

const TAB_ID_TO_SLUG = Object.freeze(
  Object.fromEntries(Object.entries(ADMIN_TAB_ROUTES).map(([slug, tabId]) => [tabId, slug])),
);

/**
 * Resolve a browser pathname to a tab panel id.
 *
 * Accepts `/admin`, `/admin/`, `/admin.html` (the logo anchor, and what Vite
 * dev serves) and `/admin/<slug>` with any query or hash attached. Returns
 * null — not the default — for anything it does not recognise, so callers can
 * tell "no route" apart from "the default route" and decide to replaceState.
 *
 * @param {string} pathname
 * @returns {string|null} tab panel id, or null when unrecognised
 */
export function tabIdFromPath(pathname) {
  if (typeof pathname !== 'string') return null;

  // Strip query and hash first — `/admin/reports?from=x#top` is still Reports.
  const path = pathname.split('?')[0].split('#')[0].trim().toLowerCase();
  if (!path) return null;

  // Normalise `/admin/`, `/admin.html` and `/admin/index.html` onto `/admin`.
  const withoutTrailingSlash = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const base = withoutTrailingSlash.replace(/(\/admin)(?:\.html|\/index\.html)$/, '$1');
  if (base === ADMIN_BASE_PATH) return ADMIN_TAB_ROUTES[''];
  if (!base.startsWith(ADMIN_BASE_PATH + '/')) return null;

  const slug = base.slice(ADMIN_BASE_PATH.length + 1);
  // Only a single path segment is a route; `/admin/a/b` is not.
  if (!slug || slug.includes('/')) return null;

  return ADMIN_TAB_ROUTES[slug] ?? null;
}

/**
 * The canonical URL for a tab panel id. The default tab has exactly one URL
 * (`/admin`, never `/admin/`), so history entries never double up on it.
 *
 * @param {string} tabId
 * @returns {string}
 */
export function pathFromTabId(tabId) {
  const slug = TAB_ID_TO_SLUG[tabId];
  if (slug === undefined) return ADMIN_BASE_PATH;
  return slug ? `${ADMIN_BASE_PATH}/${slug}` : ADMIN_BASE_PATH;
}

/**
 * @param {string} tabId
 * @returns {boolean} whether this panel id has a route at all
 */
export function isKnownTabId(tabId) {
  return Object.prototype.hasOwnProperty.call(TAB_ID_TO_SLUG, tabId);
}
