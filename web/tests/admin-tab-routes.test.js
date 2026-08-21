// Guards the admin dashboard's URL contract.
//
// admin.html is one page with N tab panels. Vercel rewrites /admin(.*) onto it,
// so /admin/reports and /admin/whatsapp are virtual paths that only resolve
// because tab-routes.js maps the slug to a panel id and initTabs() reads
// location.pathname at boot. Three separate lists have to agree for that to
// work — the route map, the desktop nav links, and the mobile <select> — and
// nothing in the build notices when they drift. The failure is silent and
// asymmetric: a tab missing from the <select> is invisible on desktop and
// unreachable on mobile, which is exactly the bug DASHBOARD.md warns about.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ADMIN_TAB_ROUTES,
  DEFAULT_TAB_ID,
  tabIdFromPath,
  pathFromTabId,
  isKnownTabId,
} from '../src/js/admin/tab-routes.js';

const adminHtml = readFileSync(new URL('../admin.html', import.meta.url), 'utf8');

test('tabIdFromPath resolves every canonical admin path', () => {
  assert.equal(tabIdFromPath('/admin'), DEFAULT_TAB_ID);
  assert.equal(tabIdFromPath('/admin/'), DEFAULT_TAB_ID);
  // The logo anchor and the Vite dev server both use the literal file path.
  assert.equal(tabIdFromPath('/admin.html'), DEFAULT_TAB_ID);
  assert.equal(tabIdFromPath('/admin/reports'), 'reports-tab');
  assert.equal(tabIdFromPath('/admin/reports/'), 'reports-tab');
  // Slugs deliberately differ from panel ids where the id is awkward.
  assert.equal(tabIdFromPath('/admin/rate-upload'), 'agent-sheets-tab');
  assert.equal(tabIdFromPath('/admin/hajj-umrah'), 'hajjumrah-tab');
});

test('tabIdFromPath ignores query strings and hashes', () => {
  assert.equal(tabIdFromPath('/admin/reports?from=2026-01-01'), 'reports-tab');
  assert.equal(tabIdFromPath('/admin/reports#top'), 'reports-tab');
  assert.equal(tabIdFromPath('/admin/reports?a=1#top'), 'reports-tab');
});

test('tabIdFromPath returns null — not the default — for anything unrecognised', () => {
  // The caller needs to tell "no route" from "the default route" so it can
  // replaceState the URL onto something canonical instead of leaving it.
  for (const path of ['/admin/bogus', '/admin/a/b', '/other', '', '/', null, undefined, 42]) {
    assert.equal(tabIdFromPath(path), null, `${JSON.stringify(path)} should not resolve`);
  }
});

test('pathFromTabId gives the default tab exactly one URL', () => {
  // Two spellings would let the same tab stack duplicate history entries.
  assert.equal(pathFromTabId(DEFAULT_TAB_ID), '/admin');
  assert.equal(pathFromTabId('unknown-tab'), '/admin');
});

test('every slug round-trips through path and back', () => {
  for (const [slug, tabId] of Object.entries(ADMIN_TAB_ROUTES)) {
    const path = pathFromTabId(tabId);
    assert.equal(tabIdFromPath(path), tabId, `${slug} did not round-trip`);
    assert.ok(isKnownTabId(tabId));
    assert.doesNotMatch(path, /-tab(\/|$)/, `${path} leaks the internal -tab suffix into the URL`);
  }
});

test('route map, desktop nav links and mobile select all cover the same tabs', () => {
  const navTabs = [...adminHtml.matchAll(/<a\b[^>]*\bclass="nav-link[^"]*"[^>]*>/g)]
    .map((m) => /data-tab="([^"]+)"/.exec(m[0])?.[1])
    .filter(Boolean);

  const selectBlock = /<select[^>]*id="admin-tab-select"[\s\S]*?<\/select>/.exec(adminHtml);
  assert.ok(selectBlock, '#admin-tab-select must exist — it is the only mobile navigation');
  const selectTabs = [...selectBlock[0].matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);

  const routeTabs = Object.values(ADMIN_TAB_ROUTES);

  assert.ok(navTabs.length > 0, 'no .nav-link[data-tab] found — the selector drifted');
  assert.deepEqual(
    [...navTabs].sort(),
    [...routeTabs].sort(),
    'nav links and ADMIN_TAB_ROUTES disagree — a tab is unreachable by URL, or routed to nothing',
  );
  assert.deepEqual(
    [...selectTabs].sort(),
    [...routeTabs].sort(),
    'the mobile <select> disagrees with ADMIN_TAB_ROUTES — a tab is unreachable on mobile',
  );
});

test('every nav link points at its own canonical path', () => {
  // href="#" would still work (the handler preventDefault()s) but breaks
  // cmd-click, middle-click and "copy link address".
  const anchors = [...adminHtml.matchAll(/<a\b[^>]*\bclass="nav-link[^"]*"[^>]*>/g)].map((m) => m[0]);

  for (const anchor of anchors) {
    const tabId = /data-tab="([^"]+)"/.exec(anchor)?.[1];
    const href = /href="([^"]+)"/.exec(anchor)?.[1];
    assert.ok(tabId, `nav link without data-tab: ${anchor}`);
    assert.equal(href, pathFromTabId(tabId), `nav link for ${tabId} has the wrong href`);
  }
});
