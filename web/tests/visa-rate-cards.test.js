import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normaliseCountryKey,
  parseRateValue,
  formatVisaRate,
  normaliseRateCard,
  countRateCardRows,
  lowestRate,
  indexRateCardsByCountry,
  sortRateCards,
  buildTemplateRateCard,
  buildEmptyRateCard,
  UAE_RATE_CARD_TEMPLATE,
} from '../src/js/shared/visa-rate-cards.js';

test('country keys normalise case and whitespace so cards link to visa rows', () => {
  assert.equal(normaliseCountryKey('  UAE '), 'uae');
  assert.equal(normaliseCountryKey('United  Arab   Emirates'), 'united arab emirates');
  assert.equal(normaliseCountryKey(undefined), '');
});

test('rate values parse from numbers, digit strings, and typed ₹ amounts', () => {
  assert.equal(parseRateValue(7070), 7070);
  assert.equal(parseRateValue('7070'), 7070);
  assert.equal(parseRateValue('₹7,070'), 7070);
  assert.equal(parseRateValue(''), null);
  assert.equal(parseRateValue(null), null);
  assert.equal(parseRateValue('abc'), null);
});

test('rates render as Indian-grouped rupees, and free text wins over the number', () => {
  assert.equal(formatVisaRate({ rate: 7070 }), '₹7,070');
  assert.equal(formatVisaRate({ rate: 12500 }), '₹12,500');
  // Abu Dhabi transit is quoted, not listed.
  assert.equal(formatVisaRate({ rate: 999, rateText: 'Special rate' }), 'Special rate');
  assert.equal(formatVisaRate({ rate: null, rateText: '' }), 'On request');
});

test('normalising drops blank rows, groups, and sections', () => {
  const card = normaliseRateCard({
    countryName: '  UAE ',
    note: ' 3000 AED ABS ',
    sections: [
      {
        title: 'Normal Visa',
        groups: [{ title: '', rows: [{ label: '30 Days Adult', rate: '7070' }, { label: '', rate: '99' }] }],
      },
      // Every row blank → the whole section goes.
      { title: 'Empty', groups: [{ title: 'X', rows: [{ label: '  ', rate: '' }] }] },
    ],
  });

  assert.equal(card.countryName, 'UAE');
  assert.equal(card.countryKey, 'uae');
  assert.equal(card.note, '3000 AED ABS');
  assert.equal(card.isActive, true);
  assert.equal(card.sections.length, 1);
  assert.deepEqual(card.sections[0].groups[0].rows, [{ label: '30 Days Adult', rate: 7070, rateText: '' }]);
});

test('a free-text row clears its numeric rate so a stale number cannot resurface', () => {
  const card = normaliseRateCard({
    countryName: 'UAE',
    sections: [{ title: 'Transit', groups: [{ title: 'ABU DHABI', rows: [{ label: '48 HRS', rate: 1700, rateText: 'Special rate' }] }] }],
  });
  const row = card.sections[0].groups[0].rows[0];
  assert.equal(row.rate, null);
  assert.equal(row.rateText, 'Special rate');
  assert.equal(formatVisaRate(row), 'Special rate');
});

test('normalising tolerates junk input rather than throwing', () => {
  const card = normaliseRateCard(null);
  assert.deepEqual(card.sections, []);
  assert.equal(card.countryName, '');
  assert.equal(countRateCardRows(card), 0);
  assert.deepEqual(normaliseRateCard({ sections: 'nope' }).sections, []);
});

test('the UAE template carries the agreed rates, sections, and sub-groups', () => {
  const card = normaliseRateCard(buildTemplateRateCard());
  assert.equal(card.countryName, 'UAE');
  assert.equal(card.note, '3000 AED ABS');
  assert.deepEqual(card.sections.map(s => s.title), ['Normal Visa', 'DUBAI Multiple', 'Transit Visa']);

  const priceOf = (sectionTitle, groupTitle, label) => {
    const section = card.sections.find(s => s.title === sectionTitle);
    const group = section.groups.find(g => g.title === groupTitle);
    return formatVisaRate(group.rows.find(r => r.label === label));
  };

  assert.equal(card.sections[0].note, 'Same Day Posting | Processing Time: 1–2 Working Days');
  assert.equal(priceOf('Normal Visa', '', '30 Days Adult'), '₹7,070');
  assert.equal(priceOf('Normal Visa', '', '30 Days Child'), '₹580');
  assert.equal(priceOf('Normal Visa', '', '60 Days Adult'), '₹10,090');
  assert.equal(priceOf('Normal Visa', '', '60 Days Child'), '₹1,080');

  assert.equal(priceOf('DUBAI Multiple', '', '30 Days Multi Adult'), '₹12,500');
  assert.equal(priceOf('DUBAI Multiple', '', '30 Days Multi Child'), '₹3,200');
  assert.equal(priceOf('DUBAI Multiple', '', '60 Days Multi Adult'), '₹17,900');
  assert.equal(priceOf('DUBAI Multiple', '', '60 Days Multi Child'), '₹6,000');

  assert.deepEqual(card.sections[2].groups.map(g => g.title), ['DUBAI', 'ABU DHABI']);
  assert.equal(priceOf('Transit Visa', 'DUBAI', '48 HRS'), '₹1,700');
  assert.equal(priceOf('Transit Visa', 'DUBAI', '96 HRS'), '₹4,400');
  assert.equal(priceOf('Transit Visa', 'ABU DHABI', '48 HRS'), 'Special rate');
  assert.equal(priceOf('Transit Visa', 'ABU DHABI', '96 HRS'), 'Special rate');

  assert.equal(countRateCardRows(card), 12);
});

test('the template is copied, not shared, so form edits cannot mutate it', () => {
  const first = buildTemplateRateCard();
  first.sections[0].groups[0].rows[0].rate = 1;
  assert.equal(buildTemplateRateCard().sections[0].groups[0].rows[0].rate, 7070);
  assert.equal(UAE_RATE_CARD_TEMPLATE.sections[0].groups[0].rows[0].rate, 7070);
});

test('lowestRate reports the cheapest numeric row and ignores quoted ones', () => {
  const card = normaliseRateCard(buildTemplateRateCard());
  assert.equal(lowestRate(card), 580);

  const quotedOnly = normaliseRateCard({
    countryName: 'X',
    sections: [{ title: 'T', groups: [{ title: '', rows: [{ label: '48 HRS', rateText: 'Special rate' }] }] }],
  });
  assert.equal(lowestRate(quotedOnly), null);
});

test('the country index keeps active, populated cards only', () => {
  const index = indexRateCardsByCountry([
    { id: 'uae', countryName: ' UAE ', sections: buildTemplateRateCard().sections },
    { id: 'qatar', countryName: 'Qatar', isActive: false, sections: buildTemplateRateCard().sections },
    { id: 'oman', countryName: 'Oman', sections: [] },
  ]);

  assert.deepEqual([...index.keys()], ['uae']);
  assert.equal(index.get('uae').id, 'uae');
  assert.equal(index.get(normaliseCountryKey('uae')).countryName, 'UAE');
});

test('cards sort by explicit order, then alphabetically', () => {
  const sorted = sortRateCards([
    { countryName: 'Qatar', order: 1 },
    { countryName: 'Oman', order: 1 },
    { countryName: 'UAE', order: 0 },
  ]);
  assert.deepEqual(sorted.map(c => c.countryName), ['UAE', 'Oman', 'Qatar']);
});

test('a blank card starts with one editable section, group, and row', () => {
  const blank = buildEmptyRateCard();
  assert.equal(blank.sections.length, 1);
  assert.equal(blank.sections[0].groups.length, 1);
  assert.equal(blank.sections[0].groups[0].rows.length, 1);
  // Nothing is filled in, so normalising it yields no saveable rows.
  assert.equal(countRateCardRows(normaliseRateCard(blank)), 0);
});
