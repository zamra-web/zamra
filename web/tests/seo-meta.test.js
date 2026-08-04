// Guards the SEO contract of the public pages.
//
// Everything asserted here is invisible in the browser: a page renders and
// behaves identically whether or not it has a canonical, an OG image, or a
// robots directive. That is exactly why it rots — a page gets copy-pasted from
// another one, the canonical comes along pointing at the wrong URL, and nothing
// fails until the two URLs start competing in search months later.
//
// The nastiest failure this catches is a noindex page appearing in the sitemap
// (or the reverse). Google treats that pair as a contradiction and resolves it
// unpredictably, and neither file looks wrong on its own.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SITEMAP_URLS, ORIGIN, buildSitemap } from '../scripts/generate-sitemap.mjs';

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

/** Public pages that must be fully optimised and indexable. */
const INDEXABLE = SITEMAP_URLS.map(({ file, path }) => ({ file, url: `${ORIGIN}${path}` }));

/** Pages that must never be indexed: auth surfaces and ephemeral fare links. */
const NOINDEX = ['admin.html', 'login.html', 'b2b.html', 'b2b-login.html', 'soto.html', 'deals.html'];

const tag = (html, re) => {
    const m = html.match(re);
    return m ? m[1] : null;
};

for (const { file, url } of INDEXABLE) {
    test(`${file} — title and meta description are present and sanely sized`, () => {
        const html = read(file);

        const title = tag(html, /<title>([^<]+)<\/title>/);
        assert.ok(title, 'no <title>');
        // Not a hard Google limit — a guard against the two failure modes that
        // actually happen: an empty placeholder, and a title so long the
        // differentiating half is truncated out of the SERP.
        assert.ok(title.length >= 20 && title.length <= 75, `title is ${title.length} chars: ${title}`);

        const desc = tag(html, /<meta name="description"\s+content="([^"]+)"/s)
            ?? tag(html, /<meta name="description"\n\s*content="([^"]+)"/s);
        assert.ok(desc, 'no meta description');
        assert.ok(desc.length >= 70 && desc.length <= 200, `description is ${desc.length} chars`);
    });

    test(`${file} — canonical points at its own live URL`, () => {
        const html = read(file);
        const canonical = tag(html, /<link rel="canonical" href="([^"]+)"/);
        assert.equal(canonical, url);
    });

    test(`${file} — is indexable`, () => {
        const html = read(file);
        const robots = tag(html, /<meta name="robots" content="([^"]+)"/);
        assert.ok(robots, 'no robots meta');
        assert.doesNotMatch(robots, /noindex/, 'page is in the sitemap but tagged noindex');
    });

    test(`${file} — has a complete Open Graph card`, () => {
        const html = read(file);
        // WhatsApp is this business's main sharing surface and it renders the OG
        // card. A missing og:image ships a bare grey link into every group chat.
        for (const prop of ['og:type', 'og:title', 'og:description', 'og:image', 'og:url']) {
            assert.match(html, new RegExp(`property="${prop}"`), `missing ${prop}`);
        }
        assert.match(html, /name="twitter:card" content="summary_large_image"/);

        const ogUrl = tag(html, /<meta property="og:url" content="([^"]+)"/);
        assert.equal(ogUrl, url, 'og:url disagrees with the canonical');
    });

    test(`${file} — carries parseable JSON-LD wired to the shared organization`, () => {
        const html = read(file);
        const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
        assert.ok(blocks.length > 0, 'no JSON-LD block');

        const nodes = blocks.flatMap(([, body]) => {
            const parsed = JSON.parse(body); // throws on malformed markup
            return parsed['@graph'] ?? [parsed];
        });

        assert.ok(nodes.every((n) => n['@type']), 'a JSON-LD node has no @type');

        // Every page's graph must reference the single TravelAgency entity
        // defined on the homepage, so the NAP exists in exactly one place.
        const serialized = JSON.stringify(nodes);
        assert.match(serialized, /https:\/\/www\.zamratravels\.com\/#organization/,
            'page does not reference the shared #organization entity');
    });

    test(`${file} — has exactly one H1`, () => {
        const html = read(file);
        const h1s = [...html.matchAll(/<h1[\s>]/g)];
        assert.equal(h1s.length, 1, `found ${h1s.length} H1 elements`);
    });

    test(`${file} — links to other pages without the .html redirect hop`, () => {
        const html = read(file);
        // cleanUrls 308-redirects /tours.html to /tours. Linking to the .html
        // form makes every internal click and every crawl a two-hop request.
        const hops = [...html.matchAll(/href="(\/[a-z-]*\.html)"/g)].map((m) => m[1]);
        assert.deepEqual(hops, [], `internal links still redirect: ${hops.join(', ')}`);
    });
}

for (const file of NOINDEX) {
    test(`${file} — is excluded from search`, () => {
        const html = read(file);
        const robots = tag(html, /<meta name="robots" content="([^"]+)"/);
        assert.ok(robots, `${file} has no robots meta and would be indexed`);
        assert.match(robots, /noindex/);
    });

    test(`${file} — is absent from the sitemap`, () => {
        assert.ok(
            !SITEMAP_URLS.some((entry) => entry.file === file),
            `${file} is noindex but listed in the sitemap — a direct contradiction`,
        );
    });
}

test('robots.txt allows the AI search crawlers and blocks the private surfaces', () => {
    const robots = read('public/robots.txt');

    // These four are the ones with a search product behind them; blocking any of
    // them removes Zamra from that assistant's answers entirely.
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot']) {
        assert.match(robots, new RegExp(`User-agent: ${bot}\\nAllow: /`),
            `${bot} is not explicitly allowed`);
    }

    for (const path of ['/admin', '/b2b', '/login', '/deals', '/soto']) {
        assert.match(robots, new RegExp(`Disallow: ${path}$`, 'm'), `${path} is not disallowed`);
    }

    assert.match(robots, /^Sitemap: https:\/\/www\.zamratravels\.com\/sitemap\.xml$/m);
});

test('the committed sitemap.xml matches what the generator produces', () => {
    // The build regenerates it, so a stale committed copy is harmless in
    // production — but a mismatch means someone edited it by hand and expects
    // that edit to survive, which it will not.
    const committed = read('public/sitemap.xml');
    for (const { path } of SITEMAP_URLS) {
        assert.match(committed, new RegExp(`<loc>${ORIGIN}${path.replace('/', '\\/')}</loc>`));
    }
    assert.equal(
        (committed.match(/<url>/g) || []).length,
        SITEMAP_URLS.length,
        'sitemap.xml has a different number of URLs than the generator',
    );
    assert.match(buildSitemap(), /<\/urlset>/);
});
