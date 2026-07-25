import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFareTextSection,
  buildFareTextBlocks,
  formatFareTextRate,
} from '../src/js/shared/fare-text-list.js';

const ROWS = [
  { dateLabel: '12 AUG', airlineLabel: 'IX', baggageLabel: '30Kg + 7Kg', rate: 18500 },
  { dateLabel: '3 SEP', airlineLabel: 'AIR IN X', baggageLabel: '30Kg + 7Kg', rate: 16900 },
  { dateLabel: '21 SEP', airlineLabel: 'SAUDI AIR', baggageLabel: '40Kg + 7Kg', rate: 17400 },
];

test('formatFareTextRate uses Indian digit grouping', () => {
  assert.equal(formatFareTextRate(18500), '₹18,500');
  assert.equal(formatFareTextRate(1234567), '₹12,34,567');
  assert.equal(formatFareTextRate('not a number'), '₹0');
});

test('columns are padded to a common width so the block lines up', () => {
  const { lines } = buildFareTextSection({ heading: 'CALICUT TO JEDDAH', rows: ROWS });

  // Every '=' must land in the same column.
  const separatorColumns = new Set(lines.map((line) => line.indexOf('=')));
  assert.equal(separatorColumns.size, 1);
});

test('baggage column is off by default and adds a third column when enabled', () => {
  const without = buildFareTextSection({ rows: ROWS });
  const withBaggage = buildFareTextSection({ rows: ROWS, includeBaggage: true });

  assert.ok(!without.lines[0].includes('30Kg'));
  assert.ok(withBaggage.lines[0].includes('30Kg + 7Kg'));

  const separatorColumns = new Set(withBaggage.lines.map((line) => line.indexOf('=')));
  assert.equal(separatorColumns.size, 1);
});

test('lowest fare is reported and marked only on the cheapest row', () => {
  const section = buildFareTextSection({ rows: ROWS, highlightLowest: true });

  assert.equal(section.lowestRate, 16900);
  assert.equal(section.lowestRows.length, 1);
  assert.equal(section.lowestRows[0].dateLabel, '3 SEP');

  const marked = section.lines.filter((line) => line.trimEnd().endsWith('<<'));
  assert.equal(marked.length, 1);
  assert.ok(marked[0].includes('₹16,900'));
});

test('a tie marks every row that shares the lowest rate', () => {
  const section = buildFareTextSection({
    rows: [
      { dateLabel: '01 AUG', airlineLabel: 'IX', rate: 15000 },
      { dateLabel: '02 AUG', airlineLabel: '6E', rate: 15000 },
      { dateLabel: '03 AUG', airlineLabel: 'AI', rate: 19000 },
    ],
    highlightLowest: true,
  });

  assert.equal(section.lowestRows.length, 2);
  assert.equal(section.lines.filter((line) => line.trimEnd().endsWith('<<')).length, 2);
});

test('the lowest marker never breaks column alignment', () => {
  const { lines } = buildFareTextSection({ rows: ROWS, includeBaggage: true, highlightLowest: true });
  const separatorColumns = new Set(lines.map((line) => line.indexOf('=')));
  assert.equal(separatorColumns.size, 1);
});

test('empty rows produce an empty section rather than throwing', () => {
  const section = buildFareTextSection({ heading: 'X', rows: [] });
  assert.deepEqual(section.lines, []);
  assert.equal(section.lowestRate, null);
  assert.equal(buildFareTextBlocks([section]), '');
});

test('blocks wrap each section in a WhatsApp code fence', () => {
  const section = buildFareTextSection({ heading: 'CALICUT TO JEDDAH', rows: ROWS });
  const body = buildFareTextBlocks([section]);

  assert.ok(body.startsWith('*CALICUT TO JEDDAH*\n```\n'));
  assert.ok(body.endsWith('```'));
});

test('the bold LOWEST summary sits outside the code fence', () => {
  const section = buildFareTextSection({ heading: 'CALICUT TO JEDDAH', rows: ROWS, highlightLowest: true });
  const body = buildFareTextBlocks([section], { highlightLowest: true });

  const summaryIndex = body.indexOf('🔥 *LOWEST:');
  const fenceCloseIndex = body.lastIndexOf('```');

  assert.ok(summaryIndex > fenceCloseIndex, 'summary must follow the closing fence');
  assert.ok(body.includes('₹16,900'));
  assert.ok(body.includes('3 SEP · AIR IN X'));
});

test('multiple sections are separated by a blank line', () => {
  const a = buildFareTextSection({ heading: 'CALICUT TO JEDDAH', rows: ROWS });
  const b = buildFareTextSection({ heading: 'KOCHI TO DUBAI', rows: ROWS });
  const body = buildFareTextBlocks([a, b]);

  assert.ok(body.includes('```\n\n*KOCHI TO DUBAI*'));
});
