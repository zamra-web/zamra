import test from 'node:test';
import assert from 'node:assert/strict';

import {
  dedupeAndSortFares,
  splitFlightTimeRange,
} from '../src/js/web/flight-results.js';

test('dedupeAndSortFares keeps the cheapest matching fare per sector-airline-date-time', () => {
  const fares = [
    { id: 'fare-1', sectorId: 'sector-1', airlineId: 'airline-1', flightDate: new Date('2026-05-01T00:00:00.000Z'), flightTime: '09:00 - 12:00', finalRate: 18000 },
    { id: 'fare-2', sectorId: 'sector-1', airlineId: 'airline-1', flightDate: new Date('2026-05-01T00:00:00.000Z'), flightTime: '09:00 - 12:00', finalRate: 16500 },
    { id: 'fare-3', sectorId: 'sector-1', airlineId: 'airline-2', flightDate: new Date('2026-05-01T00:00:00.000Z'), flightTime: '09:00 - 12:00', finalRate: 17000 },
  ];

  const normalized = dedupeAndSortFares(fares);

  assert.deepEqual(
    normalized.map((fare) => fare.id),
    ['fare-2', 'fare-3'],
  );
});

test('dedupeAndSortFares sorts by flight date then final rate', () => {
  const fares = [
    { id: 'fare-1', sectorId: 'sector-1', airlineId: 'airline-1', flightDate: new Date('2026-05-02T00:00:00.000Z'), flightTime: '09:00 - 12:00', finalRate: 15500 },
    { id: 'fare-2', sectorId: 'sector-1', airlineId: 'airline-2', flightDate: new Date('2026-05-01T00:00:00.000Z'), flightTime: '09:00 - 12:00', finalRate: 19000 },
    { id: 'fare-3', sectorId: 'sector-1', airlineId: 'airline-3', flightDate: new Date('2026-05-02T00:00:00.000Z'), flightTime: '11:00 - 14:00', finalRate: 14900 },
  ];

  const normalized = dedupeAndSortFares(fares);

  assert.deepEqual(
    normalized.map((fare) => fare.id),
    ['fare-2', 'fare-3', 'fare-1'],
  );
});

test('splitFlightTimeRange handles missing and partial flight times safely', () => {
  assert.deepEqual(splitFlightTimeRange(''), { departure: 'TBA', arrival: 'TBA' });
  assert.deepEqual(splitFlightTimeRange('08:30'), { departure: '08:30', arrival: 'TBA' });
  assert.deepEqual(splitFlightTimeRange('08:30 - '), { departure: '08:30', arrival: 'TBA' });
  assert.deepEqual(splitFlightTimeRange('- 12:45'), { departure: 'TBA', arrival: '12:45' });
});
