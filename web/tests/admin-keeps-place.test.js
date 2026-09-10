// Guards the two ways a save used to throw the admin back to the top of a tab.
//
// 1. Scroll. A browser clamps a scroll offset as soon as the content behind it
//    is too short to hold it, and never returns it when the content grows back.
//    A re-render that is even briefly shorter than what it replaced therefore
//    spends the admin's position for good — measured in Chrome, a 5000px page
//    shrunk to 600px while scrolled to 1200 reports scrollY 147 from then on.
//    Both the window and `.admin-database-wrap` (`overflow: auto`,
//    `max-height: 72vh`) are exposed. `keepPlace()` captures before the render
//    and restores after, so every renderer that repaints a table must go
//    through it.
//
// 2. Pagination. Every `renderXxxTab()` refetch used to reset `tablePage` to 1,
//    so editing the fourth row of page seven landed on page one. The refetch
//    blocks must leave `tablePage` alone — the search/limit/filter handlers
//    still reset it, and every renderer clamps it to the last page, so a page
//    a delete emptied still resolves on its own.
//
// Neither shows up at build time: the module parses, the table renders, and the
// only symptom is a lost place after a save.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/js/admin/main.js', import.meta.url), 'utf8');

/** Body of a module-level `function name(...) { ... }`, braces matched. */
function functionBody(code, name) {
  const header = new RegExp(`^(?:async\\s+)?function\\s+${name}\\s*\\(`, 'm');
  const match = header.exec(code);
  if (!match) return null;
  return balancedBlock(code, code.indexOf('{', match.index));
}

/** The `{ ... }` starting at `open`, including both braces. */
function balancedBlock(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i += 1) {
    if (code[i] === '{') depth += 1;
    else if (code[i] === '}') {
      depth -= 1;
      if (depth === 0) return code.slice(open, i + 1);
    }
  }
  return null;
}

// Every renderer that repaints a table the admin edits in place. The tab-level
// renderers that only refetch and delegate (renderDatabaseTab, renderEnquiryTab,
// renderDealLinksPanel) are covered by the table renderer they call.
const PLACE_KEEPING_RENDERERS = [
  'renderAgentsTab',
  'renderB2BAgentsTab',
  'renderSectorsTab',
  'renderFlightsTab',
  'renderDatabaseTable',
  'renderEnquiryTable',
  'renderDealLinksTable',
  'renderVisasTab',
  'renderToursTab',
  'renderHajjUmrahTab',
];

test('keepPlace() captures the page and both kinds of scroller', () => {
  const body = functionBody(source, 'keepPlace');
  assert.ok(body, 'keepPlace() is still declared');
  assert.match(body, /capturePlace\(\)/, 'keepPlace() captures before rendering');
  assert.match(body, /restorePlace\(place\)/, 'keepPlace() restores after rendering');
  assert.match(body, /\.then\(/, 'keepPlace() restores after an async renderer too');

  const capture = functionBody(source, 'capturePlace');
  assert.match(capture, /SCROLL_KEEPERS/, 'independent scrollers are captured');
  assert.match(capture, /window\.scrollY/, 'the window scroll is captured');
  assert.match(
    source,
    /const SCROLL_KEEPERS = '[^']*\.admin-database-wrap[^']*'/,
    'the Database tab wrap is one of the captured scrollers',
  );
});

test('every table renderer keeps the admin\'s place', () => {
  const missing = PLACE_KEEPING_RENDERERS.filter((name) => {
    const body = functionBody(source, name);
    assert.ok(body, `${name}() is still declared`);
    return !body.includes('keepPlace(');
  });

  assert.deepEqual(
    missing,
    [],
    `these renderers repaint a table without keepPlace(), so a save scrolls the admin away: ${missing.join(', ')}`,
  );
});

test('a refetch never resets the table back to page 1', () => {
  const offenders = [];
  for (const match of source.matchAll(/if \(fetchData\) \{/g)) {
    const block = balancedBlock(source, source.indexOf('{', match.index));
    const reset = /tablePage\.[A-Za-z]+\s*=/.exec(block ?? '');
    if (reset) {
      const line = source.slice(0, match.index + reset.index).split('\n').length;
      offenders.push(`main.js:${line} resets ${reset[0].trim()} inside an if (fetchData) block`);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `a refetch after a save must leave the page where it was:\n${offenders.join('\n')}`,
  );
});

test('the filter controls still do reset to page 1', () => {
  // The mirror image of the rule above: jumping to page 1 is exactly what a new
  // search or filter should do, so the fix must not have swept those away.
  assert.match(
    source,
    /tableSearch\.agents = e\.target\.value; tablePage\.agents = 1;/,
    'the agents search box still resets to page 1',
  );
  assert.match(
    source,
    /databaseFilters\.search = e\.target\.value \|\| '';\s*\n\s*tablePage\.databaseFares = 1;/,
    'the Database search box still resets to page 1',
  );
});
