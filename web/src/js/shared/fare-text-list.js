// Plain-text fare lists — the shape Zamra broadcasts on WhatsApp.
//
// The poster "Copy Text" button and the standalone text generator in the Poster
// tab both render through here, so a list pasted into WhatsApp always has the
// same columns and the same lowest-fare call-out.
//
// Layout rules, learned from what the staff type by hand:
//   · Columns are padded to equal width and wrapped in a ``` fence so WhatsApp
//     renders them monospaced and they actually line up on a phone.
//   · The lowest-fare marker is appended at the END of the line. A prefix would
//     shift every other column out of alignment.
//   · The bold "LOWEST" summary sits OUTSIDE the fence — WhatsApp does not
//     render *bold* inside a code block.

const LOWEST_MARKER = '<<';

/** '₹12,345' — Indian digit grouping, no decimals unless the rate has them. */
export function formatFareTextRate(rate) {
  const numericRate = Number(rate);
  if (!Number.isFinite(numericRate)) return '₹0';
  if (Number.isInteger(numericRate)) return `₹${numericRate.toLocaleString('en-IN')}`;
  return `₹${numericRate.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function padTo(value, width) {
  const text = String(value ?? '');
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

function maxWidth(values, floor) {
  return values.reduce((widest, value) => Math.max(widest, String(value ?? '').length), floor);
}

/**
 * Build one sector's block.
 *
 * @param {object}   input
 * @param {string}   input.heading          e.g. 'CALICUT TO JEDDAH'
 * @param {object[]} input.rows             { dateLabel, airlineLabel, baggageLabel, rate }
 * @param {boolean} [input.includeBaggage]  add the baggage column
 * @param {boolean} [input.highlightLowest] mark the cheapest row(s)
 * @returns {{heading: string, lines: string[], lowestRate: number|null, lowestRows: object[]}}
 */
export function buildFareTextSection({
  heading,
  rows,
  includeBaggage = false,
  highlightLowest = false,
} = {}) {
  const safeRows = Array.isArray(rows) ? rows.filter(Boolean) : [];
  if (!safeRows.length) {
    return { heading: heading || '', lines: [], lowestRate: null, lowestRows: [] };
  }

  const rates = safeRows
    .map((row) => Number(row.rate))
    .filter((rate) => Number.isFinite(rate));
  const lowestRate = rates.length ? Math.min(...rates) : null;
  const lowestRows = lowestRate === null
    ? []
    : safeRows.filter((row) => Number(row.rate) === lowestRate);

  const dateWidth = maxWidth(safeRows.map((r) => r.dateLabel), 6);
  const airlineWidth = maxWidth(safeRows.map((r) => r.airlineLabel), 'AIRLINE'.length);
  const baggageWidth = includeBaggage
    ? maxWidth(safeRows.map((r) => r.baggageLabel), 'BAGGAGE'.length)
    : 0;

  const lines = safeRows.map((row) => {
    const parts = [
      padTo(row.dateLabel, dateWidth),
      padTo(row.airlineLabel, airlineWidth),
    ];
    if (includeBaggage) parts.push(padTo(row.baggageLabel, baggageWidth));

    let line = `${parts.join(' ')} = ${formatFareTextRate(row.rate)}`;
    if (highlightLowest && lowestRate !== null && Number(row.rate) === lowestRate) {
      line += ` ${LOWEST_MARKER}`;
    }
    return line;
  });

  return { heading: heading || '', lines, lowestRate, lowestRows };
}

/**
 * Join sections into the WhatsApp message body.
 *
 * Each section becomes `*HEADING*` followed by a fenced monospace block. When
 * `highlightLowest` is on, a bold lowest-fare summary is appended after the
 * fence so the bold actually renders.
 */
export function buildFareTextBlocks(sections, { highlightLowest = false } = {}) {
  const usable = (Array.isArray(sections) ? sections : []).filter(
    (section) => section && Array.isArray(section.lines) && section.lines.length,
  );
  if (!usable.length) return '';

  return usable.map((section) => {
    let block = `*${section.heading}*\n\`\`\`\n${section.lines.join('\n')}\n\`\`\``;

    if (highlightLowest && section.lowestRate !== null && section.lowestRows?.length) {
      const where = section.lowestRows
        .map((row) => [row.dateLabel, row.airlineLabel].filter(Boolean).join(' · '))
        .filter(Boolean)
        .join('  |  ');
      const rate = formatFareTextRate(section.lowestRate);
      block += where
        ? `\n🔥 *LOWEST: ${rate} — ${where}*`
        : `\n🔥 *LOWEST: ${rate}*`;
    }

    return block;
  }).join('\n\n');
}
