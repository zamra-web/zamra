// Report export — row ordering and CSV assembly.
//
// Exports used to inherit whatever order Firestore returned, which reads as
// random. Rows now come out grouped by sector in the POS display order (the
// persisted `sortOrder` on `sectors`, which is what the dashboard, the posters
// and the POS all render), and chronologically inside each sector.
//
// Kept free of DOM and Firebase imports so `web/tests/report-export.test.js`
// can exercise it under `node --test`.

/** Agency identity columns dropped from a white-label export. */
export const WHITE_LABEL_OMITTED_COLUMNS = ['Agent', 'SP Rate (INR)', 'Commission (INR)'];

const AGENCY_NAME = 'Zamra Travels';
const AGENCY_PHONE = '+91 98466 06739';
const AGENCY_EMAIL = 'zamratravelsmlp@gmail.com';

function toMillis(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value?.toDate === 'function') return value.toDate().getTime();
  if (value === null || value === undefined || value === '') return Number.POSITIVE_INFINITY;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

/**
 * Minutes past midnight for the departure half of a "HH:MM - HH:MM" range.
 * Unparseable or missing times sort last within their day rather than first,
 * so a row with no time never jumps ahead of scheduled flights.
 */
export function departureMinutes(flightTime) {
  const match = String(flightTime || '').match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return Number.POSITIVE_INFINITY;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return Number.POSITIVE_INFINITY;
  if (hours > 23 || minutes > 59) return Number.POSITIVE_INFINITY;
  return hours * 60 + minutes;
}

/**
 * Builds `sectorId → rank` from sectors already in display order.
 * Unknown sectors rank after every known one, ordered by id so the result is
 * still deterministic.
 */
export function buildSectorRankMap(sectors = []) {
  const ranks = new Map();
  sectors.forEach((sector, index) => {
    if (sector?.id) ranks.set(sector.id, index);
  });
  return ranks;
}

/**
 * Orders fares for export: sector (POS order) → date → departure time →
 * airline → rate → id. Every tier is a total order, so the same input always
 * produces byte-identical output.
 *
 * @param {Array} fares
 * @param {{ sectors?: Array, sectorCodeById?: Record<string,string>, airlineCodeById?: Record<string,string> }} [ctx]
 */
export function sortFaresForExport(fares = [], ctx = {}) {
  const ranks = buildSectorRankMap(ctx.sectors);
  const sectorCodeById = ctx.sectorCodeById || {};
  const airlineCodeById = ctx.airlineCodeById || {};

  const sectorRank = (fare) => {
    const rank = ranks.get(fare?.sectorId);
    return rank === undefined ? Number.MAX_SAFE_INTEGER : rank;
  };
  const sectorLabel = (fare) => String(sectorCodeById[fare?.sectorId] || fare?.sectorId || '');
  const airlineLabel = (fare) => String(airlineCodeById[fare?.airlineId] || fare?.airlineId || '');

  return [...fares].sort((a, b) => {
    const rankDelta = sectorRank(a) - sectorRank(b);
    if (rankDelta !== 0) return rankDelta;

    // Two sectors missing from the rank map still need a stable relative order.
    const labelDelta = sectorLabel(a).localeCompare(sectorLabel(b), undefined, { sensitivity: 'base' });
    if (labelDelta !== 0) return labelDelta;

    const dateDelta = toMillis(a?.flightDate) - toMillis(b?.flightDate);
    if (dateDelta !== 0) return dateDelta;

    const timeDelta = departureMinutes(a?.flightTime) - departureMinutes(b?.flightTime);
    if (timeDelta !== 0) return timeDelta;

    const airlineDelta = airlineLabel(a).localeCompare(airlineLabel(b), undefined, { sensitivity: 'base' });
    if (airlineDelta !== 0) return airlineDelta;

    const rateDelta = (Number(a?.finalRate) || 0) - (Number(b?.finalRate) || 0);
    if (rateDelta !== 0) return rateDelta;

    return String(a?.id || '').localeCompare(String(b?.id || ''));
  });
}

/** Wraps a value for CSV — quoted, with internal quotes doubled. */
export function escapeCsvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

/**
 * Assembles the fares CSV.
 *
 * `whiteLabel` produces a sheet safe to forward to a sub-agent or customer: the
 * agency letterhead is dropped, and so are the columns that expose Zamra's
 * buying position (supplier name, special rate, commission). Hiding the header
 * text while leaving the margin columns in place would defeat the point.
 *
 * @param {Array} fares
 * @param {{
 *   sectors?: Array,
 *   sectorCodeById?: Record<string,string>,
 *   airlineCodeById?: Record<string,string>,
 *   agentNameById?: Record<string,string>,
 *   checkInKg?: (fare: object) => number|string,
 *   handKg?: (fare: object) => number|string,
 *   whiteLabel?: boolean,
 *   generatedAt?: Date,
 * }} ctx
 */
export function buildFaresCsv(fares = [], ctx = {}) {
  const {
    sectorCodeById = {},
    airlineCodeById = {},
    agentNameById = {},
    checkInKg = () => '',
    handKg = () => '',
    whiteLabel = false,
    generatedAt = new Date(),
  } = ctx;

  const sorted = sortFaresForExport(fares, ctx);

  const headers = ['Date', 'Time', 'Sector', 'Airline'];
  if (!whiteLabel) headers.push('Agent', 'SP Rate (INR)');
  headers.push('Rate (INR)');
  if (!whiteLabel) headers.push('Commission (INR)');
  headers.push('Check-in Baggage (kg)', 'Hand Baggage (kg)', 'Status');

  const rows = sorted.map((fare) => {
    const date = fare?.flightDate instanceof Date
      ? fare.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : (fare?.flightDate || '');

    const cells = [
      date,
      fare?.flightTime || '',
      sectorCodeById[fare?.sectorId] || fare?.sectorId || '',
      airlineCodeById[fare?.airlineId] || fare?.airlineId || '',
    ];
    if (!whiteLabel) {
      cells.push(agentNameById[fare?.agentId] || fare?.agentId || '', fare?.specialRate || 0);
    }
    cells.push(fare?.finalRate || 0);
    if (!whiteLabel) cells.push(fare?.commission || 0);
    cells.push(checkInKg(fare), handKg(fare), fare?.isHidden ? 'Hidden' : 'Live');

    return cells.map(escapeCsvValue).join(',');
  });

  // A standard export is letterheaded; a white-label one opens straight on the
  // header row so nothing identifies who produced it.
  const preamble = whiteLabel ? [] : [
    escapeCsvValue(`${AGENCY_NAME} — Fare Report`),
    [escapeCsvValue(AGENCY_PHONE), escapeCsvValue(AGENCY_EMAIL)].join(','),
    escapeCsvValue(`Generated ${generatedAt.toLocaleString('en-GB')}`),
    '',
  ];

  return [...preamble, headers.map(escapeCsvValue).join(','), ...rows].join('\n');
}

/** File name for a fares export, e.g. `zamra-fares-2026-07-23.csv`. */
export function buildExportFileName(extension, { whiteLabel = false, date = new Date() } = {}) {
  const stamp = date.toISOString().split('T')[0];
  const prefix = whiteLabel ? 'fare-report' : 'zamra-fares';
  return `${prefix}-${stamp}.${extension}`;
}
