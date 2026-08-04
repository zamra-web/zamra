// Keeps the homepage's crawlable answer block honest.
//
// The #travel-answers section on index.html exists because AI search crawlers do
// not run JavaScript: every fare, route and baggage figure the page normally
// shows is fetched from getPublicFares at runtime and is therefore invisible to
// GPTBot, PerplexityBot and ClaudeBot. The section restates those facts as
// static HTML so the page can actually be cited.
//
// That makes it a second copy of data whose source of truth lives in
// src/js/shared/. A second copy silently going stale is worse than no copy at
// all — the site would be publishing wrong baggage allowances to the exact
// systems that quote it verbatim. These tests fail when the two drift.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { AIRPORTS } from '../src/js/shared/airports.js';
import {
    DEFAULT_HAND_BAGGAGE_KG,
    DEFAULT_CHECKIN_BAGGAGE_KG,
    STANDARD_AIRLINE_CODES,
    handBaggageKg,
    checkInBaggageOptions,
} from '../src/js/shared/airline-baggage.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const section = (() => {
    const start = html.indexOf('id="travel-answers"');
    assert.notEqual(start, -1, 'the #travel-answers GEO section is gone from index.html');
    const end = html.indexOf('</section>', start);
    return html.slice(start, end);
})();

/** Section text with tags stripped, whitespace collapsed, entities resolved. */
const text = section
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

test('every airport named in the answer block still exists in airports.js', () => {
    // Codes are written as "Kozhikode (CCJ)" — pull them back out and confirm
    // the site has not stopped serving one of them.
    const cited = [...text.matchAll(/\(([A-Z]{3})\)/g)].map((m) => m[1]);
    assert.ok(cited.length >= 15, `only ${cited.length} airport codes cited; the block looks truncated`);

    for (const code of new Set(cited)) {
        // Airline codes are two characters, so anything three-long here is an airport.
        assert.ok(AIRPORTS[code], `index.html advertises ${code}, which airports.js does not define`);
    }
});

test('the standard baggage allowance matches airline-baggage.js', () => {
    assert.match(
        text,
        new RegExp(`${DEFAULT_HAND_BAGGAGE_KG} kg of hand baggage and ${DEFAULT_CHECKIN_BAGGAGE_KG} kg of check-in baggage`),
        `the block no longer states the ${DEFAULT_HAND_BAGGAGE_KG}/${DEFAULT_CHECKIN_BAGGAGE_KG} kg default`,
    );
});

test('every airline with a non-default allowance is listed in the table', () => {
    const exceptions = STANDARD_AIRLINE_CODES.filter((code) => {
        const checkIn = checkInBaggageOptions(code);
        return handBaggageKg(code) !== DEFAULT_HAND_BAGGAGE_KG
            || checkIn.length > 1
            || checkIn[0] !== DEFAULT_CHECKIN_BAGGAGE_KG;
    });

    // If this fires, a carrier gained a special allowance and the public table
    // is now quoting it the default weight.
    for (const code of exceptions) {
        assert.match(text, new RegExp(`\\(${code}\\)`),
            `${code} has a non-standard baggage allowance but is missing from the homepage table`);
    }

    for (const code of exceptions) {
        const hand = handBaggageKg(code);
        const checkIn = checkInBaggageOptions(code);
        const row = text.slice(text.indexOf(`(${code})`));
        assert.match(row, new RegExp(`^\\(${code}\\)\\s*${hand} kg`),
            `${code} hand baggage is ${hand} kg in airline-baggage.js but the table disagrees`);
        for (const kg of checkIn) {
            assert.match(row.slice(0, 80), new RegExp(`\\b${kg}\\b`),
                `${code} check-in option ${kg} kg is missing from the table`);
        }
    }
});

test('every airline code in the answer block is one Zamra actually ticket', () => {
    const cited = [...text.matchAll(/\(([A-Z0-9]{2})\)/g)].map((m) => m[1]);
    assert.ok(cited.length >= 12, `only ${cited.length} airline codes cited; the list looks truncated`);

    for (const code of new Set(cited)) {
        assert.ok(
            STANDARD_AIRLINE_CODES.includes(code),
            `index.html advertises airline ${code}, which is not in STANDARD_AIRLINE_CODES`,
        );
    }
});

test('the answer block stays server-rendered, not injected by JavaScript', () => {
    // The entire point is that it exists without a JS runtime. If someone moves
    // this into a module the way the rest of the page works, it becomes
    // invisible to every AI crawler again and this test is the only warning.
    assert.doesNotMatch(section, /<script/, 'the GEO block must not depend on JavaScript');
    assert.match(section, /Which routes does Zamra Travels\s+book\?/);
});
