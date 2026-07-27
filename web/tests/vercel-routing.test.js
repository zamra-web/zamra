// Guards the one vercel.json rule that fails silently in production.
//
// `cleanUrls` registers every built page in the routing filesystem WITHOUT its
// .html, which is why /deals.html 308-redirects to /deals. Rewrites are matched
// only after the filesystem misses, and their destination is resolved against
// that same extensionless table — so a destination of "/deals.html" points at a
// path that does not exist and Vercel answers 404 NOT_FOUND. Vercel's docs say
// it outright: with cleanUrls, "do not include the file extension in the source
// or destination path".
//
// Nothing in the build catches this: the config stays valid, the page still
// builds, and only the deep link (/deals/<slug>, /gcc) 404s once deployed.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('no rewrite or redirect path carries a .html extension under cleanUrls', () => {
  assert.equal(config.cleanUrls, true, 'this rule only applies while cleanUrls is on');

  const paths = [...(config.rewrites || []), ...(config.redirects || [])]
    .flatMap((rule) => [rule.source, rule.destination]);

  for (const path of paths) {
    assert.doesNotMatch(
      String(path),
      /\.html(\?|#|$)/,
      `"${path}" ends in .html — cleanUrls makes that path unresolvable, so it 404s`,
    );
  }
});

test('shareable deal links resolve to the deals page', () => {
  const rule = (config.rewrites || []).find((r) => r.source.startsWith('/deals/'));

  assert.ok(rule, '/deals/<slug> must be rewritten — no file exists at that path');
  assert.equal(rule.destination, '/deals');
});
