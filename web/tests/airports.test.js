import test from 'node:test';
import assert from 'node:assert/strict';

import {
  AIRPORTS,
  AIRPORT_ALIASES,
  airportCity,
  airportName,
  normalizeAirportLabel,
  resolveAirportCode,
} from '../src/js/shared/airports.js';
import { getSectorRouteCodes } from '../src/js/admin/social-markets.js';

test('every airport entry carries a city and a full airport name', () => {
  for (const [code, airport] of Object.entries(AIRPORTS)) {
    assert.match(code, /^[A-Z]{3}$/, `${code} is not a 3-letter IATA code`);
    assert.ok(airport.city, `${code} is missing a city`);
    assert.ok(airport.name, `${code} is missing an airport name`);
  }
});

test('city labels resolve to the IATA code the e-ticket prints', () => {
  // The regression this guards: "Calicut" used to print CAL and "Dubai" DUB,
  // because the ticket fell back to the first three letters of the city.
  assert.equal(resolveAirportCode('Calicut'), 'CCJ');
  assert.equal(resolveAirportCode('Kozhikode'), 'CCJ');
  assert.equal(resolveAirportCode('Dubai'), 'DXB');
  assert.equal(resolveAirportCode('Dammam'), 'DMM');
  assert.equal(resolveAirportCode('Abu Dhabi'), 'AUH');
  assert.notEqual(resolveAirportCode('Calicut'), 'CAL');
  assert.notEqual(resolveAirportCode('Dubai'), 'DUB');
});

test('labels resolve regardless of case, padding and the Damam typo', () => {
  assert.equal(resolveAirportCode('  calicut '), 'CCJ');
  assert.equal(resolveAirportCode('ABU  DHABI'), 'AUH');
  assert.equal(resolveAirportCode('Damam'), 'DMM');
  assert.equal(resolveAirportCode('abudhabi'), 'AUH');
});

test('a parenthesised code in the label always wins', () => {
  assert.equal(resolveAirportCode('Kozhikode (CCJ)'), 'CCJ');
  assert.equal(resolveAirportCode('Somewhere New (XYZ)'), 'XYZ');
});

test('a bare 3-letter label passes through, unknown labels resolve to empty', () => {
  assert.equal(resolveAirportCode('CCJ'), 'CCJ');
  assert.equal(resolveAirportCode('ZZZ'), 'ZZZ');
  assert.equal(resolveAirportCode('Some Unmapped City'), '');
  assert.equal(resolveAirportCode(''), '');
  assert.equal(resolveAirportCode(null), '');
});

test('airportName falls back to "<CODE> Airport" for unmapped codes', () => {
  assert.equal(airportName('DMM'), 'King Fahd International Airport');
  assert.equal(airportName('ccj'), 'Calicut International Airport');
  assert.equal(airportName('ZZZ'), 'ZZZ Airport');
  assert.equal(airportName(''), '');
});

test('airportCity prefers the directory and falls back to the raw label', () => {
  assert.equal(airportCity('CCJ'), 'Kozhikode');
  assert.equal(airportCity('ZZZ', 'Some City (ZZZ)'), 'Some City');
  assert.equal(airportCity('ZZZ'), 'ZZZ');
});

test('normalizeAirportLabel collapses whitespace and dashes', () => {
  assert.equal(normalizeAirportLabel('  ras  al   khaimah '), 'RAS AL KHAIMAH');
  assert.equal(normalizeAirportLabel('CCJ–JED'), 'CCJ-JED');
});

test('every alias maps to a code that exists in the directory', () => {
  for (const [alias, code] of Object.entries(AIRPORT_ALIASES)) {
    assert.ok(AIRPORTS[code], `alias "${alias}" points at unknown code ${code}`);
  }
});

test('sector route codes come from sectorCode first, then the airport directory', () => {
  assert.deepEqual(
    getSectorRouteCodes({ sectorCode: 'CCJ JED', sectorFrom: 'Calicut', sectorTo: 'Jeddah' }),
    { fromCode: 'CCJ', toCode: 'JED' },
  );
  // No sectorCode — the labels alone must still resolve, which is what keeps a
  // freshly created sector from printing a guessed code on the ticket.
  assert.deepEqual(
    getSectorRouteCodes({ sectorFrom: 'Calicut', sectorTo: 'Dubai' }),
    { fromCode: 'CCJ', toCode: 'DXB' },
  );
});
