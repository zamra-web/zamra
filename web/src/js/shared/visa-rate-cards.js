// Tourist-visa rate cards — the structured price sheet behind the "Rates"
// button on the B2B portal's Tourist Visa cards.
//
// Shape of one `visa_rate_cards` document:
//
//   {
//     countryName: 'UAE',
//     countryKey:  'uae',            // normalised, links the card to a `visas` row
//     note:        '3000 AED ABSCONDING',  // banner note shown above every section
//     isActive:    true,
//     order:       0,
//     sections: [{
//       title: 'DUBAI Normal Visa',
//       note:  'Same Day Posting | Processing Time: 1–2 Working Days',
//       groups: [{
//         title: '',                 // '' = ungrouped; 'DUBAI' / 'ABU DHABI' for transit
//         rows:  [{ label: '30 Days Adult', rate: 7200, rateText: '' }],
//       }],
//     }],
//   }
//
// No rate is ever hardcoded in a renderer: every price on screen comes from
// this document. `UAE_RATE_CARD_TEMPLATE` below is only a starting point the
// admin form pre-fills — once saved, it is ordinary editable Firestore data.

/** `'  United Arab Emirates '` → `'united arab emirates'`. */
export function normaliseCountryKey(name) {
  return String(name ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Numeric rate, or null when the row is priced as free text ("Special rate").
 * Stripping the currency symbol and separators first means an admin can paste
 * "₹7,070" straight into the number field. A value with no digits at all is
 * null rather than 0 — an unparseable rate must never print as ₹0.
 */
export function parseRateValue(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^\d.-]/g, '').trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * What to print in the price column. A row's `rateText` always wins — that is
 * how "Special rate" (Abu Dhabi transit) is expressed without a number.
 */
export function formatVisaRate(row) {
  const text = String(row?.rateText ?? '').trim();
  if (text) return text;
  const num = parseRateValue(row?.rate);
  if (num === null) return 'On request';
  return `₹${num.toLocaleString('en-IN')}`;
}

function cleanText(value) {
  return String(value ?? '').trim();
}

function normaliseRow(row) {
  const rateText = cleanText(row?.rateText);
  const rate = parseRateValue(row?.rate);
  return {
    label: cleanText(row?.label),
    // A free-text row keeps rate null so a stale number can never leak back
    // into the display if the text is later cleared.
    rate: rateText ? null : rate,
    rateText,
  };
}

function normaliseGroup(group) {
  return {
    title: cleanText(group?.title),
    rows: (Array.isArray(group?.rows) ? group.rows : [])
      .map(normaliseRow)
      .filter((row) => row.label),
  };
}

function normaliseSection(section) {
  const groups = (Array.isArray(section?.groups) ? section.groups : [])
    .map(normaliseGroup)
    .filter((group) => group.rows.length);
  return {
    title: cleanText(section?.title),
    note: cleanText(section?.note),
    groups,
  };
}

/**
 * Coerce a raw Firestore document into the shape every renderer expects.
 * Empty rows/groups/sections are dropped so a half-filled admin form cannot
 * render as blank table rows on the portal.
 */
export function normaliseRateCard(doc) {
  const countryName = cleanText(doc?.countryName);
  return {
    id: doc?.id || '',
    countryName,
    countryKey: normaliseCountryKey(doc?.countryKey || countryName),
    note: cleanText(doc?.note),
    isActive: doc?.isActive !== false,
    order: Number.isFinite(Number(doc?.order)) ? Number(doc.order) : 0,
    // A section with no priced rows would render as an empty box on the
    // portal, so a half-filled admin form drops it rather than shipping it.
    sections: (Array.isArray(doc?.sections) ? doc.sections : [])
      .map(normaliseSection)
      .filter((section) => section.groups.length),
  };
}

/** Total priced rows across a card — used for the admin table's summary column. */
export function countRateCardRows(card) {
  return (card?.sections || []).reduce(
    (total, section) => total + (section.groups || []).reduce((n, g) => n + (g.rows || []).length, 0),
    0,
  );
}

/**
 * Cheapest numeric rate on a card, for the "From ₹x" line on the portal card.
 * Free-text rows ("Special rate") have no number and are skipped; a card made
 * up entirely of them returns null and the caller falls back to the visa row.
 */
export function lowestRate(card) {
  let min = null;
  (card?.sections || []).forEach((section) => {
    (section.groups || []).forEach((group) => {
      (group.rows || []).forEach((row) => {
        const num = row.rateText ? null : parseRateValue(row.rate);
        if (num === null || num <= 0) return;
        if (min === null || num < min) min = num;
      });
    });
  });
  return min;
}

/** Active cards only, indexed by country key, for `visas` → rate-card lookup. */
export function indexRateCardsByCountry(docs) {
  const map = new Map();
  (Array.isArray(docs) ? docs : [])
    .map(normaliseRateCard)
    .filter((card) => card.isActive && card.countryKey && card.sections.length)
    .forEach((card) => {
      if (!map.has(card.countryKey)) map.set(card.countryKey, card);
    });
  return map;
}

/** Sort for the admin table and any future multi-country portal listing. */
export function sortRateCards(cards) {
  return [...(cards || [])].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) ||
      (a.countryName || '').localeCompare(b.countryName || ''),
  );
}

/**
 * Pre-fill for "Add rate card → UAE template" in the admin form. These numbers
 * are a convenience so the first card does not have to be typed row by row;
 * the saved document is the only thing any renderer reads.
 */
export const UAE_RATE_CARD_TEMPLATE = Object.freeze({
  countryName: 'UAE',
  note: '3000 AED ABSCONDING',
  sections: [
    {
      title: 'DUBAI Normal Visa',
      note: 'Same Day Posting | Processing Time: 1–2 Working Days',
      groups: [{
        title: '',
        rows: [
          { label: '30 Days Adult', rate: 7200, rateText: '' },
          { label: '30 Days Child', rate: 700, rateText: '' },
          { label: '60 Days Adult', rate: 10390, rateText: '' },
          { label: '60 Days Child', rate: 1180, rateText: '' },
        ],
      }],
    },
    {
      title: 'DUBAI Multiple',
      note: '',
      groups: [{
        title: '',
        rows: [
          { label: '30 Days Multi Adult', rate: 12500, rateText: '' },
          { label: '30 Days Multi Child', rate: 3200, rateText: '' },
          { label: '60 Days Multi Adult', rate: 17900, rateText: '' },
          { label: '60 Days Multi Child', rate: 6000, rateText: '' },
        ],
      }],
    },
    {
      title: 'Transit Visa',
      note: '',
      groups: [
        {
          title: 'DUBAI',
          rows: [
            { label: '48 HRS', rate: 1700, rateText: '' },
            { label: '96 HRS', rate: 4400, rateText: '' },
          ],
        },
        {
          title: 'ABU DHABI',
          rows: [
            { label: '48 HRS', rate: null, rateText: 'Special rate' },
            { label: '96 HRS', rate: null, rateText: 'Special rate' },
          ],
        },
      ],
    },
  ],
});

/** Deep copy of the template — the form mutates it, so callers need their own. */
export function buildTemplateRateCard() {
  return JSON.parse(JSON.stringify(UAE_RATE_CARD_TEMPLATE));
}

/** A blank card with one empty section, for "start from scratch". */
export function buildEmptyRateCard() {
  return {
    countryName: '',
    note: '',
    sections: [{ title: '', note: '', groups: [{ title: '', rows: [{ label: '', rate: null, rateText: '' }] }] }],
  };
}
