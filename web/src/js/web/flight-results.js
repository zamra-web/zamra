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

export function dedupeAndSortFares(fares = []) {
  const groupedFaresMap = new Map();

  fares.forEach((fare) => {
    const key = [
      fare?.sectorId || '',
      fare?.airlineId || '',
      resolveFlightDateMs(fare?.flightDate),
      String(fare?.flightTime || '').trim(),
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
