import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSotoCardHtml,
  buildSotoBookingLink,
  formatSotoPrice,
  formatSotoDate,
  formatStops,
  formatDuration,
  formatFreshness,
  escapeHtml,
} from '../src/js/web/soto-card.js';

const NOW = new Date('2026-08-02T09:00:00Z');

const CONTEXT = {
  origin: { code: 'DXB', city: 'Dubai', countryName: 'United Arab Emirates' },
  destination: { code: 'BKK', city: 'Bangkok', countryName: 'Thailand' },
  whatsappNumber: '919846606739',
  cachedAt: '2026-08-02T08:30:00Z',
  now: NOW,
};

/**
 * @param {object} [overrides]
 * @returns {object} a projected fare as searchSotoFares returns it
 */
function fare(overrides = {}) {
  return {
    origin: 'DXB',
    destination: 'BKK',
    departDate: '2026-09-12',
    departTime: '03:45',
    returnDate: '',
    airlineCode: 'EK',
    airlineName: 'Emirates',
    flightNumber: 'EK372',
    stops: 0,
    durationMinutes: 380,
    price: 21500,
    currency: 'INR',
    foundAt: '2026-08-02T06:00:00Z',
    ...overrides,
  };
}


// ── The baggage rule ─────────────────────────────────────────────────────────

test('a SOTO card never prints a baggage allowance', () => {
  // shared/airline-baggage.js answers 30 kg for any code it does not know. Its
  // table is calibrated to Zamra's India/Gulf carriers, so on a worldwide LCC
  // that default would be a confident lie. The provider tells us nothing about
  // baggage, so the card says nothing about it.
  const html = buildSotoCardHtml(fare(), CONTEXT);
  assert.doesNotMatch(html, /\bkg\b/i);
  assert.doesNotMatch(html, /baggage/i);
  assert.doesNotMatch(html, /luggage/i);
  assert.doesNotMatch(html, /check-?in/i);
});

test('an unknown carrier still gets no invented baggage line', () => {
  const html = buildSotoCardHtml(fare({ airlineCode: 'Q0', airlineName: 'Q0' }), CONTEXT);
  assert.doesNotMatch(html, /\bkg\b/i);
});


// ── Escaping ─────────────────────────────────────────────────────────────────

test('third-party strings are escaped, unlike the admin-fed flight card', () => {
  const html = buildSotoCardHtml(fare({
    airlineName: '<script>alert(1)</script>',
    flightNumber: '"><img src=x onerror=alert(1)>',
  }), CONTEXT);

  // The hazard is a tag forming, not the substring surviving: once `<`, `>` and
  // `"` are escaped, `onerror=` is inert text in a text node.
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&quot;&gt;&lt;img/);
});

test('a hostile city name in the context cannot break out of the markup', () => {
  const html = buildSotoCardHtml(fare(), {
    ...CONTEXT,
    origin: { code: 'DXB', city: '</span><script>alert(1)</script>' },
  });
  assert.doesNotMatch(html, /<script>/);
});

test('escapeHtml covers every character that can break an attribute', () => {
  assert.equal(escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#39;');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});


// ── Card content ─────────────────────────────────────────────────────────────

test('the card shows the airline, route, price and stop count', () => {
  const html = buildSotoCardHtml(fare(), CONTEXT);
  assert.match(html, /Emirates/);
  assert.match(html, /EK372/);
  assert.match(html, /DXB/);
  assert.match(html, /BKK/);
  assert.match(html, /Dubai/);
  assert.match(html, /Bangkok/);
  assert.match(html, /₹21,500/);
  assert.match(html, /Non-stop/);
  assert.match(html, /12 Sep 2026/);
});

test('every card carries the Indicative chip', () => {
  // These are cached market prices, not live availability. A visitor must never
  // read one as a firm quote.
  assert.match(buildSotoCardHtml(fare(), CONTEXT), /Indicative/);
});

test('a return leg renders and a one-way does not print undefined', () => {
  const oneWay = buildSotoCardHtml(fare(), CONTEXT);
  assert.doesNotMatch(oneWay, /Returns/);
  assert.doesNotMatch(oneWay, /undefined/);

  const roundTrip = buildSotoCardHtml(fare({ returnDate: '2026-09-20' }), CONTEXT);
  assert.match(roundTrip, /Returns 20 Sep 2026/);
});

test('a fare missing optional fields still renders cleanly', () => {
  const html = buildSotoCardHtml(fare({
    departTime: '', durationMinutes: null, flightNumber: '', foundAt: '',
  }), { ...CONTEXT, cachedAt: '' });

  assert.doesNotMatch(html, /undefined/);
  assert.doesNotMatch(html, /NaN/);
  assert.match(html, /Emirates/);
});


// ── Booking link ─────────────────────────────────────────────────────────────

test('the WhatsApp link quotes the same price shown on the card', () => {
  const link = buildSotoBookingLink(fare(), CONTEXT);
  assert.ok(link.startsWith('https://wa.me/919846606739?text='));

  const message = decodeURIComponent(link.split('text=')[1]);
  assert.match(message, /Indicative fare: ₹21,500/);
  assert.match(message, /Dubai \(DXB\) → Bangkok \(BKK\)/);
  assert.match(message, /12 Sep 2026/);
  assert.match(message, /Emirates · EK372 · Non-stop/);
});

test('the booking number falls back and is stripped of punctuation', () => {
  assert.ok(buildSotoBookingLink(fare(), { origin: {}, destination: {} })
    .startsWith('https://wa.me/919846606739'));
  assert.ok(buildSotoBookingLink(fare(), { whatsappNumber: '+91 98466 06738' })
    .startsWith('https://wa.me/919846606738'));
});


// ── Formatters ───────────────────────────────────────────────────────────────

test('formatSotoPrice uses the rupee symbol and Indian grouping', () => {
  assert.equal(formatSotoPrice(21500, 'INR'), '₹21,500');
  assert.equal(formatSotoPrice(125000, 'INR'), '₹1,25,000');
  assert.equal(formatSotoPrice(1200, 'AED'), 'AED 1,200');
  assert.equal(formatSotoPrice(999, 'XYZ'), 'XYZ 999');
  assert.equal(formatSotoPrice('nope', 'INR'), '₹—');
});

test('formatSotoDate parses the key by hand so the day never shifts', () => {
  // Going through Date would print 11 Sep for anyone west of UTC.
  assert.equal(formatSotoDate('2026-09-12'), '12 Sep 2026');
  assert.equal(formatSotoDate('2026-01-01'), '01 Jan 2026');
  assert.equal(formatSotoDate(''), '');
  assert.equal(formatSotoDate('12/09/2026'), '');
  assert.equal(formatSotoDate('2026-13-01'), '');
});

test('formatStops names the count', () => {
  assert.equal(formatStops(0), 'Non-stop');
  assert.equal(formatStops(1), '1 stop');
  assert.equal(formatStops(2), '2 stops');
  assert.equal(formatStops(null), 'Non-stop');
});

test('formatDuration renders hours and minutes, and nothing when unknown', () => {
  assert.equal(formatDuration(380), '6h 20m');
  assert.equal(formatDuration(120), '2h');
  assert.equal(formatDuration(45), '45m');
  assert.equal(formatDuration(0), '');
  assert.equal(formatDuration(null), '');
});

test('formatFreshness reports how old the price is', () => {
  assert.equal(formatFreshness('2026-08-02T08:59:30Z', NOW), 'Checked just now');
  assert.equal(formatFreshness('2026-08-02T08:30:00Z', NOW), 'Checked 30m ago');
  assert.equal(formatFreshness('2026-08-02T03:00:00Z', NOW), 'Checked 6h ago');
  assert.equal(formatFreshness('2026-07-31T09:00:00Z', NOW), 'Checked 2d ago');
  assert.equal(formatFreshness('', NOW), '');
  assert.equal(formatFreshness('not a date', NOW), '');
});
