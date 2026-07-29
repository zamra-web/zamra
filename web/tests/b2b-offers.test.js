import test from 'node:test';
import assert from 'node:assert/strict';

import {
  toDateKey,
  formatOfferDate,
  offerLastLiveDate,
  isOfferLive,
  todayKeyIST,
  normaliseOffer,
  formatOfferBaggage,
  formatOfferPrice,
  offerCtaLabel,
  isOfferComplete,
  sortOffers,
  liveOffers,
  buildSampleOffer,
  buildOfferCardHtml,
  badgeTone,
} from '../src/js/shared/b2b-offers.js';

test('toDateKey reads strings, Dates and Firestore Timestamps', () => {
  assert.equal(toDateKey('2026-08-02'), '2026-08-02');
  assert.equal(toDateKey('2026-08-02T18:30:00.000Z'), '2026-08-02');
  assert.equal(toDateKey(new Date(Date.UTC(2026, 7, 2))), '2026-08-02');
  assert.equal(toDateKey({ toDate: () => new Date(Date.UTC(2026, 7, 2)) }), '2026-08-02');
  assert.equal(toDateKey(''), '');
  assert.equal(toDateKey('not a date'), '');
});

test('formatOfferDate prints the card headline without a timezone shift', () => {
  // A naive `new Date('2026-08-02')` in IST prints 2 Aug; west of UTC it prints
  // 1 Aug. Parsing the key by hand is what keeps this stable everywhere.
  assert.equal(formatOfferDate('2026-08-02'), '02 AUG 2026');
  assert.equal(formatOfferDate('2026-01-31'), '31 JAN 2026');
  assert.equal(formatOfferDate(''), '');
});

test('offerLastLiveDate prefers an explicit expiry over the travel date', () => {
  assert.equal(offerLastLiveDate({ travelDate: '2026-08-02' }), '2026-08-02');
  assert.equal(offerLastLiveDate({ travelDate: '2026-08-02', expiresAt: '2026-07-25' }), '2026-07-25');
  assert.equal(offerLastLiveDate({}), '');
});

test('isOfferLive covers active, paused, expiring and evergreen offers', () => {
  const today = '2026-07-29';
  assert.equal(isOfferLive({ isActive: true, travelDate: '2026-08-02' }, today), true);
  // Inclusive: an offer is still live on its last day.
  assert.equal(isOfferLive({ isActive: true, travelDate: '2026-07-29' }, today), true);
  assert.equal(isOfferLive({ isActive: true, travelDate: '2026-07-28' }, today), false);
  assert.equal(isOfferLive({ isActive: false, travelDate: '2026-08-02' }, today), false);
  assert.equal(isOfferLive({ isActive: true, travelDate: '2026-08-02', expiresAt: '2026-07-20' }, today), false);
  // No dates at all = evergreen, runs until switched off.
  assert.equal(isOfferLive({ isActive: true }, today), true);
});

test('todayKeyIST rolls over at Indian midnight, not UTC midnight', () => {
  // 18:45 UTC on 28 Jul is already 00:15 on 29 Jul in IST.
  assert.equal(todayKeyIST(new Date('2026-07-28T18:45:00Z')), '2026-07-29');
  assert.equal(todayKeyIST(new Date('2026-07-28T18:15:00Z')), '2026-07-28');
});

test('normaliseOffer cleans a raw document into render-ready shape', () => {
  const offer = normaliseOffer({
    id: 'abc',
    badge: '  very low fare ',
    badgeTone: 'nonsense',
    originCode: ' ccj ',
    originCity: ' Kozhikode ',
    destCode: 'jed',
    destCity: 'Jeddah',
    airlineCode: 'ix',
    travelDate: '2026-08-02',
    price: '18500.4',
    ctaType: 'whatever',
  });

  assert.equal(offer.badge, 'VERY LOW FARE');
  assert.equal(offer.badgeTone, 'hot', 'an unknown tone falls back rather than breaking the chip');
  assert.equal(offer.originCode, 'CCJ');
  assert.equal(offer.originCity, 'Kozhikode');
  assert.equal(offer.destCode, 'JED');
  assert.equal(offer.airlineCode, 'IX');
  assert.equal(offer.price, 18500);
  assert.equal(offer.ctaType, 'whatsapp');
  assert.equal(offer.isActive, true);
});

test('baggage is snapped onto airline policy, never taken as typed', () => {
  // 25 kg is not a weight any airline sells, so IX falls back to its 30.
  assert.equal(normaliseOffer({ airlineCode: 'IX', checkInBaggageKg: 25 }).checkInBaggageKg, 30);
  // SV does sell 40, so an explicit 40 survives.
  assert.equal(normaliseOffer({ airlineCode: 'SV', checkInBaggageKg: 40 }).checkInBaggageKg, 40);

  assert.equal(formatOfferBaggage(normaliseOffer({ airlineCode: 'IX' })), '30 + 7 kg');
  // G9 carries 10 kg hand baggage — the card must not print the 7 kg default.
  assert.equal(formatOfferBaggage(normaliseOffer({ airlineCode: 'G9' })), '30 + 10 kg');
});

test('price and CTA label degrade sensibly when unset', () => {
  assert.equal(formatOfferPrice(normaliseOffer({ price: 18500 })), '₹18,500');
  assert.equal(formatOfferPrice(normaliseOffer({ price: 0 })), '', 'a zero price hides the line entirely');
  assert.equal(formatOfferPrice(normaliseOffer({ price: -5 })), '');
  assert.equal(offerCtaLabel(normaliseOffer({})), 'Book Now');
  assert.equal(offerCtaLabel(normaliseOffer({ ctaType: 'search' })), 'View fares');
  assert.equal(offerCtaLabel(normaliseOffer({ ctaLabel: 'Grab it' })), 'Grab it');
});

test('isOfferComplete requires both ends of the route', () => {
  assert.equal(isOfferComplete(normaliseOffer({ originCode: 'CCJ', destCode: 'JED' })), true);
  assert.equal(isOfferComplete(normaliseOffer({ originCode: 'CCJ' })), false);
  assert.equal(isOfferComplete(normaliseOffer({})), false);
});

test('sortOffers puts admin order first, then travel date', () => {
  const sorted = sortOffers([
    { id: 'c', order: 1, travelDate: '2026-08-01', originCode: 'CCJ', destCode: 'DXB' },
    { id: 'a', order: 0, travelDate: '2026-09-01', originCode: 'CCJ', destCode: 'JED' },
    { id: 'b', order: 0, travelDate: '2026-08-15', originCode: 'CCJ', destCode: 'RUH' },
  ]);
  assert.deepEqual(sorted.map(o => o.id), ['b', 'a', 'c']);
});

test('liveOffers drops paused, expired and half-filled cards', () => {
  const docs = [
    { id: 'live', isActive: true, originCode: 'CCJ', destCode: 'JED', travelDate: '2026-08-02', order: 1 },
    { id: 'paused', isActive: false, originCode: 'CCJ', destCode: 'DXB', travelDate: '2026-08-02', order: 0 },
    { id: 'expired', isActive: true, originCode: 'CCJ', destCode: 'RUH', travelDate: '2026-07-01', order: 0 },
    { id: 'no-route', isActive: true, travelDate: '2026-08-02', order: 0 },
    { id: 'evergreen', isActive: true, originCode: 'COK', destCode: 'JED', order: 0 },
  ];
  assert.deepEqual(liveOffers(docs, '2026-07-29').map(o => o.id), ['evergreen', 'live']);
  assert.deepEqual(liveOffers(null, '2026-07-29'), []);
});

test('the sample offer is the CCJ → JED card and survives normalisation', () => {
  const offer = normaliseOffer(buildSampleOffer());
  assert.equal(offer.originCode, 'CCJ');
  assert.equal(offer.destCode, 'JED');
  assert.equal(offer.airlineName, 'Air India Express');
  assert.equal(formatOfferDate(offer.travelDate), '02 AUG 2026');
  assert.equal(formatOfferBaggage(offer), '30 + 7 kg');
  assert.equal(offer.badge, 'VERY LOW FARE');
  assert.equal(badgeTone(offer.badgeTone).icon, '🔥');
  // buildSampleOffer() must hand back a fresh object — the admin form mutates it.
  assert.notEqual(buildSampleOffer(), buildSampleOffer());
});

test('buildOfferCardHtml renders every field the brief asks for', () => {
  const offer = normaliseOffer(buildSampleOffer());
  const html = buildOfferCardHtml(
    offer,
    { name: 'Air India Express', logoUrl: '/assets/img/flights/air-india-express.png', initials: 'IX' },
    { href: 'https://wa.me/919846606738?text=hi', target: '_blank' },
  );

  assert.match(html, /VERY LOW FARE/);
  assert.match(html, />CCJ</);
  assert.match(html, />JED</);
  assert.match(html, /Air India Express/);
  assert.match(html, /02 AUG 2026/);
  assert.match(html, /30 \+ 7 kg/);
  assert.match(html, /Book Now/);
  assert.match(html, /href="https:\/\/wa\.me/);
  assert.match(html, /data-airline-logo/, 'the logo needs the hook wireFlightResultLogos() binds to');
});

test('offer card markup escapes admin-authored text', () => {
  const offer = normaliseOffer({
    originCode: 'CCJ', destCode: 'JED',
    originCity: '<img src=x onerror=alert(1)>',
    badge: 'deal " & <b>',
    airlineName: 'Air "India"',
  });
  const html = buildOfferCardHtml(offer, {});
  assert.ok(!html.includes('<img src=x'), 'city name must not inject markup');
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /DEAL &quot; &amp; &lt;B&gt;/);
});

test('a card with no CTA link renders a dead button for the admin preview', () => {
  const html = buildOfferCardHtml(normaliseOffer(buildSampleOffer()), {});
  assert.ok(!html.includes('<a href'), 'the preview must not be clickable');
  assert.match(html, /Book Now/);
});

test('a card with no price omits the price line entirely', () => {
  const withoutPrice = buildOfferCardHtml(normaliseOffer(buildSampleOffer()), {});
  assert.ok(!withoutPrice.includes('₹'));

  const withPrice = buildOfferCardHtml(normaliseOffer({ ...buildSampleOffer(), price: 18500, priceNote: 'per adult' }), {});
  assert.match(withPrice, /₹18,500/);
  assert.match(withPrice, /per adult/);
});
