import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCompactFlightCardHtml, buildFlightCardHtml } from '../src/js/web/flight-card.js';
import { buildFlightDetailsSheetHtml } from '../src/js/web/flight-details-sheet.js';

/**
 * @param {object} [overrides]
 * @returns {object} a fare item as web/main.js and b2b/main.js build it
 */
function item(overrides = {}) {
  return {
    airline: 'Air India Express',
    airlineLogo: '/assets/img/flights/air-india-express.png',
    airlineLogoFallback: '',
    airlineInitials: 'IX',
    origin: 'Calicut',
    originCode: 'CCJ',
    destination: 'Dubai',
    destinationCode: 'DXB',
    date: '06 Mar 2026',
    departure: '09:15',
    arrival: '12:05',
    price: '₹12,450',
    checkInBaggage: 'Check-in 30 kg',
    cabinBaggage: 'Hand 7 kg',
    baggageLabel: '30 + 7 kg',
    waLink: 'https://wa.me/919846606739?text=hello',
    ...overrides,
  };
}

/** The compact row, i.e. everything before the desktop block. */
function mobileHtml(overrides) {
  const html = buildFlightCardHtml(item(overrides));
  const desktopAt = html.indexOf('DESKTOP VIEW');
  assert.ok(desktopAt > 0, 'card should still carry the desktop layout');
  return html.slice(0, desktopAt);
}

test('compact card carries the tap hook the details sheet listens for', () => {
  const html = mobileHtml();

  assert.match(html, /data-flight-card/);
  assert.match(html, /<button/);
});

test('compact card shows the logo but not the airline name', () => {
  const html = mobileHtml();

  assert.match(html, /air-india-express\.png/);
  // The name survives only as the alt text / accessible label, never as
  // rendered copy next to the logo.
  assert.ok(
    !/>\s*Air India Express\s*</.test(html),
    'airline name should not be printed beside the compact logo',
  );
});

test('compact card holds route, times, baggage and price on one row', () => {
  const html = mobileHtml();

  for (const field of ['CCJ', 'DXB', '09:15', '12:05', '30 + 7 kg', '₹12,450', '06 Mar']) {
    assert.ok(html.includes(field), `compact row should show ${field}`);
  }
});

test('compact card has no Book Now button', () => {
  const html = mobileHtml();

  assert.ok(!/Book Now/i.test(html), 'Book Now belongs in the details sheet, not the list row');
  assert.ok(!html.includes('wa.me'), 'the booking link belongs in the details sheet');
});

test('desktop card keeps its inline Book Now', () => {
  const html = buildFlightCardHtml(item());
  const desktop = html.slice(html.indexOf('DESKTOP VIEW'));

  assert.match(desktop, /Book Now/);
  assert.match(desktop, /wa\.me/);
});

test('falls back to airline initials when there is no logo', () => {
  const html = mobileHtml({ airlineLogo: '' });

  assert.ok(!html.includes('<img'), 'no logo means no broken image');
  assert.match(html, /IX/);
});

test('B2B compact card keeps every field and the CTA on the row', () => {
  const html = buildCompactFlightCardHtml(item());

  for (const field of [
    'Air India Express', 'air-india-express.png', 'CCJ', 'DXB',
    '09:15', '12:05', '30 + 7 kg', '₹12,450', '06', 'Mar', 'Book Now',
  ]) {
    assert.ok(html.includes(field), `compact B2B card should show ${field}`);
  }
  assert.match(html, /href="https:\/\/wa\.me\/919846606739\?text=hello"/);
});

test('B2B compact card opens the sheet from one hook, separate from the CTA', () => {
  const html = buildCompactFlightCardHtml(item());

  // wireFlightCardSheet matches fares by index, so a second hook per card
  // would shift every card after it onto the wrong fare.
  assert.equal(html.match(/data-flight-card/g).length, 1);
  // A booking link nested inside the tap target would open the sheet too.
  assert.ok(
    html.indexOf('</button>') < html.indexOf('wa.me'),
    'the Book Now link must sit outside the [data-flight-card] button',
  );
});

test('B2B compact card carries no dark outline', () => {
  const html = buildCompactFlightCardHtml(item());

  assert.match(html, /border-border/);
  assert.ok(
    !/border-(black|navy|slate-[789]00|gray-[789]00)/.test(html),
    'the card border stays the light slate token',
  );
});

test('B2B compact card escapes its fields', () => {
  const html = buildCompactFlightCardHtml(item({ airline: 'Air "X" <script>' }));

  assert.ok(!html.includes('<script>'));
  assert.match(html, /Air &quot;X&quot; &lt;script&gt;/);
});

test('B2B compact card falls back to airline initials when there is no logo', () => {
  const html = buildCompactFlightCardHtml(item({ airlineLogo: '' }));

  assert.ok(!html.includes('<img'), 'no logo means no broken image');
  assert.match(html, /data-airline-fallback/);
  assert.match(html, /IX/);
});

test('details sheet carries the expanded detail and the booking CTA', () => {
  const html = buildFlightDetailsSheetHtml(item());

  assert.match(html, /Book Now/);
  assert.match(html, /wa\.me/);
  assert.match(html, /Air India Express/);
  assert.match(html, /Calicut/);
  assert.match(html, /Dubai/);
  assert.match(html, /Check-in 30 kg/);
  assert.match(html, /Hand 7 kg/);
  assert.match(html, /₹12,450/);
  assert.match(html, /data-sheet-close/);
});

test('details sheet shows seat count only when the surface supplies one', () => {
  assert.match(buildFlightDetailsSheetHtml(item({ seats: 4 })), /4 seats available/);
  assert.match(buildFlightDetailsSheetHtml(item({ seats: 1 })), /1 seat available/);
  // The B2B portal sends no seat count.
  assert.ok(!/seats? available/.test(buildFlightDetailsSheetHtml(item())));
});

test('details sheet escapes its fields', () => {
  const html = buildFlightDetailsSheetHtml(item({ airline: 'Air "X" <script>' }));

  assert.ok(!html.includes('<script>'));
  assert.match(html, /Air &quot;X&quot; &lt;script&gt;/);
});
