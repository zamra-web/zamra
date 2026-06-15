import test from 'node:test';
import assert from 'node:assert/strict';

import {
  appendCarouselItemsLimited,
  appendVideoSlidesLimited,
  buildMarketCountryGroups,
  formatCountryCarouselCaption,
  formatCountryVideoCaption,
  formatCountryVideoYouTubeTitle,
  POSTER_SOCIAL_IMAGE_MAX_ITEMS,
  POSTER_SOCIAL_VIDEO_MAX_SLIDES,
} from '../src/js/admin/social-image-carousels.js';
import {
  resolveSectorCountryKey,
  resolveSectorMarketKey,
} from '../src/js/admin/social-markets.js';

test('resolveSectorCountryKey maps supported routes in both directions', () => {
  // Test resolveSectorMarketKey (resolves Gulf-side country)
  assert.equal(resolveSectorMarketKey({ sectorCode: 'CCJ JED' }), 'saudi');
  assert.equal(resolveSectorMarketKey({ sectorCode: 'JED CCJ' }), 'saudi');
  assert.equal(resolveSectorMarketKey({ sectorCode: 'COK DXB' }), 'uae');
  assert.equal(resolveSectorMarketKey({ sectorCode: 'MCT TRV' }), 'oman');
  assert.equal(resolveSectorMarketKey({ sectorCode: 'CCJ COK' }), null);
  assert.equal(resolveSectorMarketKey({ sectorCode: 'CCJ SIN' }), null);

  // Test resolveSectorCountryKey (resolves India-side airport)
  assert.equal(resolveSectorCountryKey({ sectorCode: 'CCJ JED' }), 'ccj');
  assert.equal(resolveSectorCountryKey({ sectorCode: 'JED CCJ' }), 'ccj');
  assert.equal(resolveSectorCountryKey({ sectorCode: 'COK DXB' }), 'cok');
  assert.equal(resolveSectorCountryKey({ sectorCode: 'MCT TRV' }), 'trv');
  assert.equal(resolveSectorCountryKey({ sectorCode: 'CCJ COK' }), null);
  assert.equal(resolveSectorCountryKey({ sectorCode: 'CCJ SIN' }), 'ccj');
});

test('buildMarketCountryGroups keeps fixed country order and skips empty countries', () => {
  const sectors = [
    { id: 'saudi-ccj', sectorCode: 'CCJ JED', sectorFrom: 'Calicut', sectorTo: 'Jeddah' },
    { id: 'saudi-cok', sectorCode: 'COK JED', sectorFrom: 'Kochi', sectorTo: 'Jeddah' },
    { id: 'saudi-cnn', sectorCode: 'CNN RUH', sectorFrom: 'Kannur', sectorTo: 'Riyadh' },
    { id: 'uae-ccj', sectorCode: 'CCJ DXB', sectorFrom: 'Calicut', sectorTo: 'Dubai' },
    { id: 'saudi-empty', sectorCode: 'TRV JED', sectorFrom: 'Trivandrum', sectorTo: 'Jeddah' },
  ];

  const faresBySector = new Map([
    ['saudi-ccj', [{ id: 'fare-1' }]],
    ['saudi-cok', [{ id: 'fare-2' }]],
    ['saudi-cnn', [{ id: 'fare-3' }]],
    ['uae-ccj', [{ id: 'fare-4' }]],
    ['saudi-empty', []],
  ]);

  const groups = buildMarketCountryGroups({
    marketKey: 'saudi',
    sectors,
    faresBySector,
  });

  assert.deepEqual(
    groups.map((group) => ({
      countryKey: group.countryKey,
      sectorIds: group.sectors.map((sector) => sector.id),
    })),
    [
      { countryKey: 'ccj', sectorIds: ['saudi-ccj'] },
      { countryKey: 'cok', sectorIds: ['saudi-cok'] },
      { countryKey: 'cnn', sectorIds: ['saudi-cnn'] },
    ],
  );
});

test('appendCarouselItemsLimited preserves order and caps at ten images', () => {
  const firstSectorPages = ['s1-p1', 's1-p2', 's1-p3', 's1-p4', 's1-p5', 's1-p6'];
  const secondSectorPages = ['s2-p1', 's2-p2', 's2-p3', 's2-p4', 's2-p5'];

  const combined = appendCarouselItemsLimited(
    appendCarouselItemsLimited([], firstSectorPages, POSTER_SOCIAL_IMAGE_MAX_ITEMS),
    secondSectorPages,
    POSTER_SOCIAL_IMAGE_MAX_ITEMS,
  );

  assert.deepEqual(combined, [
    's1-p1',
    's1-p2',
    's1-p3',
    's1-p4',
    's1-p5',
    's1-p6',
    's2-p1',
    's2-p2',
    's2-p3',
    's2-p4',
  ]);
});

test('appendVideoSlidesLimited preserves slide order and caps country reels at nineteen slides', () => {
  const saudiSlides = Array.from({ length: 11 }, (_, index) => `saudi-p${index + 1}`);
  const uaeSlides = Array.from({ length: 12 }, (_, index) => `uae-p${index + 1}`);

  const combined = appendVideoSlidesLimited(
    appendVideoSlidesLimited([], saudiSlides, POSTER_SOCIAL_VIDEO_MAX_SLIDES),
    uaeSlides,
    POSTER_SOCIAL_VIDEO_MAX_SLIDES,
  );

  assert.equal(combined.length, POSTER_SOCIAL_VIDEO_MAX_SLIDES);
  assert.deepEqual(combined, [
    'saudi-p1',
    'saudi-p2',
    'saudi-p3',
    'saudi-p4',
    'saudi-p5',
    'saudi-p6',
    'saudi-p7',
    'saudi-p8',
    'saudi-p9',
    'saudi-p10',
    'saudi-p11',
    'uae-p1',
    'uae-p2',
    'uae-p3',
    'uae-p4',
    'uae-p5',
    'uae-p6',
    'uae-p7',
    'uae-p8',
  ]);
});

test('formatCountryCarouselCaption uses the professional India-time template', () => {
  const caption = formatCountryCarouselCaption(
    'saudi',
    'ccj',
    new Date('2026-04-18T06:00:00.000Z'),
  );

  assert.equal(caption, [
    'TODAY (18.04.2026)',
    'Special fares from Calicut to Saudi!',
    'Swipe through today\'s live options from Zamra Travels.',
    'Book now at zamratravels.com',
    'Contact: +91 9846606739',
  ].join('\n'));
});

test('formatCountryVideoCaption uses country-level copy for reels and widescreen videos', () => {
  const reelsCaption = formatCountryVideoCaption(
    'saudi',
    'ccj',
    'video9x16',
    new Date('2026-04-18T06:00:00.000Z'),
  );
  const widescreenCaption = formatCountryVideoCaption(
    'saudi',
    'ccj',
    'video16x9',
    new Date('2026-04-18T06:00:00.000Z'),
  );

  assert.equal(reelsCaption, [
    'TODAY (18.04.2026)',
    'Special fares from Calicut to Saudi!',
    'Reels + Shorts ready from Zamra Travels.',
    'Book now at zamratravels.com',
    'Contact: +91 9846606739',
  ].join('\n'));

  assert.equal(widescreenCaption, [
    'Calicut to Saudi flight deals from Zamra Travels.',
    'Fresh fares for 18.04.2026.',
    'Book now at zamratravels.com.',
    'Contact: +91 9846606739',
  ].join('\n\n'));
});

test('formatCountryVideoYouTubeTitle creates country-level shorts and widescreen titles', () => {
  assert.equal(
    formatCountryVideoYouTubeTitle('saudi', 'ccj', 'video9x16'),
    'Calicut to Saudi Shorts | Zamra Travels',
  );
  assert.equal(
    formatCountryVideoYouTubeTitle('saudi', 'ccj', 'video16x9'),
    'Calicut to Saudi Flight Deals | Zamra Travels',
  );
});
