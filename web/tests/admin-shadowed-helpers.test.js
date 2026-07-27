// Guards against a shadowing bug that killed the Database tab's Edit button.
//
// admin/main.js declares module-level helpers like airlineCodeById(id). Several
// lookup-map builders (getDatabaseLookupMaps, buildReportExportContext) return
// objects with keys of the SAME name holding a plain map. Destructuring one of
// those without an alias binds `airlineCodeById` to an object for the rest of
// the function — every helper call in that scope then throws
// "airlineCodeById is not a function".
//
// Nothing catches this at build time: it parses fine, the module loads fine,
// and the table renders fine until a row enters edit mode (the only branch that
// calls the helper). The throw aborts renderDatabaseTable() mid-run, so the
// table silently never repaints and Edit looks dead.
//
// Aliasing on destructure (`{ airlineCodeById: airlineCodeMap }`) is the fix.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/js/admin/main.js', import.meta.url), 'utf8');

/** Names declared as module-level `function foo(...)` (column 0 only). */
function moduleLevelFunctionNames(code) {
  const names = new Set();
  for (const match of code.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) {
    names.add(match[1]);
  }
  return names;
}

/**
 * Binding names introduced by object-destructuring declarations. `{ a }` binds
 * `a`; `{ a: b }` binds `b` and leaves `a` free, which is exactly the escape
 * hatch this test is pushing callers toward.
 */
function destructuredBindings(code) {
  const bindings = [];
  for (const match of code.matchAll(/\b(?:const|let|var)\s*\{([^{}]*)\}\s*=/g)) {
    const line = code.slice(0, match.index).split('\n').length;
    for (const part of match[1].split(',')) {
      const piece = part.trim();
      if (!piece || piece.startsWith('...')) continue;
      // Alias form `key: local` binds the right-hand name; drop any `= default`.
      const bound = (piece.includes(':') ? piece.split(':')[1] : piece)
        .split('=')[0]
        .trim();
      if (/^[A-Za-z_$][\w$]*$/.test(bound)) bindings.push({ name: bound, line });
    }
  }
  return bindings;
}

test('no destructured binding shadows a module-level helper function', () => {
  const helpers = moduleLevelFunctionNames(source);
  assert.ok(helpers.has('airlineCodeById'), 'sanity: the helper this rule exists for is still declared');

  const collisions = destructuredBindings(source)
    .filter(({ name }) => helpers.has(name))
    .map(({ name, line }) => `main.js:${line} destructures "${name}", shadowing function ${name}()`);

  assert.deepEqual(
    collisions,
    [],
    `Alias these bindings on destructure (e.g. { ${'airlineCodeById'}: airlineCodeMap }):\n  ${collisions.join('\n  ')}`,
  );
});
