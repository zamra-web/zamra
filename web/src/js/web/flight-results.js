function resolveFlightDateMs(flightDate) {
  if (flightDate instanceof Date) return flightDate.getTime();

  const parsed = new Date(flightDate).getTime();
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function resolveFareRate(fare) {
  return Number(fare?.finalRate) || 0;
}

export function splitFlightTimeRange(flightTime = '') {
  const normalized = String(flightTime || '');
  const parts = normalized.split('-');

  const departure = parts[0]?.trim() || 'TBA';
  const arrival = parts.length > 1 ? (parts[1]?.trim() || 'TBA') : 'TBA';

  return { departure, arrival };
}

/**
 * Dedupes fares to the cheapest per (sector, airline, date, time) and sorts by
 * date then price.
 *
 * `resolveFlightTime` fills in a fare's missing `flightTime` from the configured
 * `flight_details` default before grouping. Rows ingested before the n8n time
 * round-trip was fixed store an empty `flightTime`, and without this the public
 * site printed "TBA" for routes whose time was configured all along. Resolving
 * before grouping also keeps the dedupe key in agreement with what renders.
 *
 * @param {Array} fares
 * @param {{ resolveFlightTime?: (fare: object) => string }} [options]
 */
export function dedupeAndSortFares(fares = [], options = {}) {
  const resolveFlightTime = typeof options.resolveFlightTime === 'function'
    ? options.resolveFlightTime
    : (fare) => String(fare?.flightTime || '').trim();

  const groupedFaresMap = new Map();

  fares.forEach((rawFare) => {
    const flightTime = String(resolveFlightTime(rawFare) || '').trim();
    const fare = flightTime === rawFare?.flightTime ? rawFare : { ...rawFare, flightTime };

    const key = [
      fare?.sectorId || '',
      fare?.airlineId || '',
      resolveFlightDateMs(fare?.flightDate),
      flightTime,
    ].join('_');

    const existing = groupedFaresMap.get(key);
    if (!existing || resolveFareRate(fare) < resolveFareRate(existing)) {
      groupedFaresMap.set(key, fare);
    }
  });

  return Array.from(groupedFaresMap.values()).sort((a, b) => {
    const dateDelta = resolveFlightDateMs(a?.flightDate) - resolveFlightDateMs(b?.flightDate);
    if (dateDelta !== 0) return dateDelta;
    return resolveFareRate(a) - resolveFareRate(b);
  });
}
