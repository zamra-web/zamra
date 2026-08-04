#!/usr/bin/env node
/**
 * Writes web/public/sitemap.xml before every Vite build.
 *
 * Generated rather than hand-maintained for one reason: `lastmod` has to be
 * true. A hardcoded date drifts within a week and then actively misinforms
 * crawlers about which pages are worth recrawling. Here it comes from the
 * source file's last commit, so it is always the date the page really changed.
 *
 * SITEMAP_URLS is the single list of indexable public pages. A page that is
 * noindex (soto, deals) or auth-gated (admin, login, b2b) must not appear —
 * listing a noindex URL is a self-contradicting signal. `seo-meta.test.js`
 * cross-checks this list against the `robots` meta tags in the HTML entries,
 * so the two can never disagree silently.
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const ORIGIN = 'https://www.zamratravels.com';

/** Indexable public pages: source file → canonical path served by Vercel. */
export const SITEMAP_URLS = [
    { file: 'index.html', path: '/' },
    { file: 'visa.html', path: '/visa' },
    { file: 'tours.html', path: '/tours' },
    { file: 'hajj-umrah.html', path: '/hajj-umrah' },
    // connect.html is served at /gcc by a vercel.json rewrite; /connect also
    // resolves via cleanUrls, so only the rewrite target is listed and the
    // page canonicals to it.
    { file: 'connect.html', path: '/gcc' },
];

function lastModified(file) {
    try {
        const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
            cwd: WEB_ROOT,
            encoding: 'utf8',
        }).trim();
        if (iso) return iso.slice(0, 10);
    } catch {
        // Not a git checkout (or the file is untracked) — fall through.
    }
    return new Date().toISOString().slice(0, 10);
}

export function buildSitemap(urls = SITEMAP_URLS) {
    const entries = urls
        .map(({ file, path }) => {
            const loc = `${ORIGIN}${path}`;
            return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastModified(file)}</lastmod>\n  </url>`;
        })
        .join('\n');

    const ns = 'http://www.sitemaps.org/schemas/sitemap/0.9';
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${ns}">\n${entries}\n</urlset>\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const out = resolve(WEB_ROOT, 'public/sitemap.xml');
    writeFileSync(out, buildSitemap(), 'utf8');
    console.log(`sitemap.xml → ${SITEMAP_URLS.length} URLs`);
}
