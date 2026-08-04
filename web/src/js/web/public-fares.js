// Public flight-list fares, read through the server projection.
//
// The public site used to call `getFares()` from admin/db.js, which queries
// `agent_fares` straight from the browser and spreads `...data` — handing every
// visitor `specialRate`, `commission` and the supplier `agentId` while the page
// rendered only the selling price. `getPublicFares` projects each row down to
// display fields on the server, so supplier economics never leave it. See
// functions/publicFares.js.
//
// The returned shape matches what `getFares()` produced for the fields this page
// consumes — including a real `Date` for `flightDate` — so `dedupeAndSortFares`
// and the flight-time resolver work unchanged.

const FARES_ENDPOINT = 'https://asia-south1-zamra-web-01.cloudfunctions.net/getPublicFares';

/**
 * Fetch the upcoming fares for one sector.
 *
 * @param {{ sectorId: string, startDate?: string, endDate?: string }} filters
 * @returns {Promise<Array<object>>} projected fares, `flightDate` as a Date
 */
export async function getPublicFares({ sectorId, startDate, endDate } = {}) {
  if (!sectorId) return [];

  const params = new URLSearchParams({ sectorId });
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  const response = await fetch(`${FARES_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`getPublicFares failed: ${response.status}`);
  }

  const payload = await response.json();
  if (!payload || payload.success !== true || !Array.isArray(payload.fares)) {
    throw new Error('getPublicFares returned an unexpected payload');
  }

  // `flightDate` crosses the wire as an ISO string; the render path calls
  // `.toLocaleDateString()` on it, so it is rehydrated here rather than at every
  // call site. Rows the server could not date are already dropped there, but the
  // guard is kept so a bad row can never reach the page.
  //
  // The null check is separate from the NaN check on purpose: `new Date(null)`
  // is the epoch, not an invalid date, so a null would survive a NaN-only filter
  // and render as "01 Jan 1970" — a plausible-looking wrong answer.
  return payload.fares
    .filter((fare) => fare && fare.flightDate !== null && fare.flightDate !== undefined)
    .map((fare) => ({ ...fare, flightDate: new Date(fare.flightDate) }))
    .filter((fare) => !Number.isNaN(fare.flightDate.getTime()));
}
