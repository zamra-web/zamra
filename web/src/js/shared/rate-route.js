// Reading the printed route off a rate sheet line.
//
// Suppliers print the journey, not the sector they are selling:
//
//   CCJ - MCT – DXB  (30+7kg)
//   31 AUG : 40,200/-  WY 298/609
//
// That is one Calicut→Dubai fare flown on WY with a change of plane in Muscat.
// Read as "the first two codes on the line" it becomes CCJ→MCT — a Muscat fare
// at a Dubai price, on a sector the supplier never quoted. So:
//
//   the FIRST airport is the origin,
//   the LAST  airport is the destination,
//   everything between them is a connection and belongs to neither.
//
// Two printed shapes need their own handling. A slash separates alternatives
// within one stop ("CCJ/COK - DXB" is two origins for one destination, not a
// connection through Kochi), and the word "via" moves the connection to the end
// of the line ("CCJ-DXB via MCT"), where the last-code rule would otherwise
// mistake it for the destination.
//
// The same rule is enforced a second time inside n8n — `Build Firebase Payload`
// in n8n/zamra-rates.workflow.json guards the model's `sector_code` against the
// route the sheet printed. That Code node runs in n8n's sandbox and cannot
// import this module, so the two are deliberate copies: change one, change the
// other, and keep both sets of tests green.

import { AIRPORTS } from './airports.js';

/**
 * Stop boundaries as rate sheets print them: whitespace, hyphen, en/em dash,
 * arrow, comma. A slash is NOT one — it separates alternatives at a single
 * stop, so "CCJ/COK" stays one token.
 */
const STOP_SEPARATOR_RE = /[\s\-–—>→⇒,;:|]+/;

/** Everything after this word is a connection, however the line ends. */
const VIA_RE = /\bVIA\b/;

/** A standalone three-letter token. Anchored, so "CALICUT" yields nothing. */
const CODE_RE = /\b[A-Z]{3}\b/g;

/**
 * Known IATA codes only. A rate sheet is full of three-letter tokens that are
 * not airports — "31 AUG", "WED", "KGS" — and every one of them would otherwise
 * lengthen the route and shift the destination.
 *
 * @param {string} segment
 * @returns {string[]} airport codes, in printed order, duplicates kept
 */
function airportCodesIn(segment) {
  const found = String(segment ?? '').toUpperCase().match(CODE_RE) || [];
  return found.filter(code => Object.prototype.hasOwnProperty.call(AIRPORTS, code));
}

/**
 * Split printed route text into stops, each holding the airport codes printed
 * there. Stops naming no airport are dropped, which is what removes dates,
 * baggage notes and the word "via" itself.
 *
 *   "CCJ - MCT – DXB" → [['CCJ'], ['MCT'], ['DXB']]
 *   "CCJ JED IX"      → [['CCJ'], ['JED']]
 *   "CCJ/COK - DXB"   → [['CCJ', 'COK'], ['DXB']]
 *
 * @param {string} text
 * @returns {string[][]}
 */
export function printedRouteStops(text) {
  const stops = String(text ?? '')
    .toUpperCase()
    .split(STOP_SEPARATOR_RE)
    .map(airportCodesIn)
    .filter(codes => codes.length > 0);

  // A slash means "either of these" only when the route has another stop to
  // travel to: "CCJ/COK - DXB" is two origins, but "CCJ/JED" and "CCJ/MCT/DXB"
  // are the whole route, slash-separated. One stop holding several codes is
  // therefore a chain, not a choice.
  if (stops.length === 1 && stops[0].length > 1) return stops[0].map(code => [code]);

  return stops;
}

/**
 * Read a printed route as an origin, a destination, and the stops in between.
 *
 * Returns null when the text does not name two different airports — a bare
 * "DXB RATES" header, a city-name route, or a line that is not a route at all.
 *
 * @param {string} text
 * @returns {{origin: string, destination: string, via: string[], stops: string[][]}|null}
 */
export function readPrintedRoute(text) {
  const raw = String(text ?? '').toUpperCase();
  const viaAt = raw.search(VIA_RE);
  const stops = printedRouteStops(viaAt === -1 ? raw : raw.slice(0, viaAt));
  // "CCJ-DXB via MCT" states the connection after the sector. Those codes are
  // never candidates for the destination, only for `via`.
  const trailingVia = viaAt === -1
    ? []
    : printedRouteStops(raw.slice(viaAt)).reduce((all, stop) => all.concat(stop), []);

  if (stops.length < 2) return null;

  const origin = stops[0][0];

  // Walk in from the end for the destination. A round trip printed
  // "CCJ - DXB - CCJ" ends where it started; the sector being sold is the
  // outbound one, so skip any trailing return to the origin.
  let destAt = -1;
  for (let i = stops.length - 1; i > 0; i -= 1) {
    if (stops[i].some(code => code !== origin)) { destAt = i; break; }
  }
  if (destAt === -1) return null;

  const destination = stops[destAt].find(code => code !== origin);
  const via = stops
    .slice(1, destAt)
    .reduce((all, stop) => all.concat(stop), [])
    .concat(trailingVia)
    .filter((code, i, all) => code !== origin && code !== destination && all.indexOf(code) === i);

  return { origin, destination, via, stops };
}
