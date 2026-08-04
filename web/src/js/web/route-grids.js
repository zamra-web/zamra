// Shape of the homepage's "Lowest Fare Flight Tickets" origin cards.
//
// Kept apart from main.js so the decisions here — which airports get a card,
// which destinations hang under each one, and which section they land in — are
// testable without a DOM. main.js does the rendering and nothing else.
//
// The rule these encode: a card and a route exist only if `getPublicRoutes` said
// a fare backs them. The grids used to be a cross-product of two hardcoded
// airport arrays, which is why every India card offered all thirteen Gulf
// airports (Kozhikode → Madinah) and every Gulf card all five Indian ones
// (Jeddah → Trivandrum), regardless of whether a fare had ever existed.

import { airportCity, isIndianAirport } from '../shared/airports.js';

/**
 * One card per origin, each carrying only its own reachable destinations.
 *
 * @param {{origins: string[], destinationsFor: (code: string) => string[],
 *   sectorIdFor: (origin: string, dest: string) => string}} routeMap
 * @returns {Array<{code: string, name: string, destinations:
 *   Array<{code: string, name: string, sectorId: string}>}>}
 */
export function buildOriginCards(routeMap) {
  if (!routeMap || !Array.isArray(routeMap.origins)) return [];

  return routeMap.origins
    .map((code) => ({
      code,
      name: airportCity(code),
      destinations: routeMap.destinationsFor(code).map((destCode) => ({
        code: destCode,
        name: airportCity(destCode),
        sectorId: routeMap.sectorIdFor(code, destCode),
      })),
    }))
    // An origin with nothing to fly to would open an empty destination modal.
    .filter((origin) => origin.destinations.length > 0);
}

/**
 * Group origin cards into the two rendered sections, dropping empty ones.
 *
 * The split is `country === 'India'` from the airport directory. An unmapped code
 * has no country and lands in "Middle East" — the safe default, since every
 * Indian airport Zamra flies is in the directory, so an unknown code is far more
 * likely to be a new Gulf station.
 *
 * @param {Array<{code: string}>} origins
 * @returns {Array<{label: string, origins: Array<object>}>}
 */
export function splitOriginSections(origins) {
  const cards = origins || [];

  return [
    { label: 'India', origins: cards.filter((origin) => isIndianAirport(origin.code)) },
    { label: 'Middle East', origins: cards.filter((origin) => !isIndianAirport(origin.code)) },
  ].filter((section) => section.origins.length > 0);
}
