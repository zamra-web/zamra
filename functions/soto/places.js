"use strict";

// Airport/city lookup for the SOTO page, backed by the committed dataset that
// scripts/build-soto-reference.cjs generates.
//
// The index is built once per function instance and reused. Both the typeahead
// and the fare endpoint go through resolvePlace(), which is what lets an
// unknown code be rejected before it costs a provider call.

const PLACES = require("./places.json");
const AIRLINE_NAMES = require("./airlines.json");

const { normalizeIata } = require("./normalize");

/** @type {Map<string, object>|null} */
let _byCode = null;
/** @type {Array<object>|null} */
let _searchable = null;

/**
 * Build the in-memory index on first use.
 *
 * @return {{byCode: Map<string, object>, searchable: Array<object>}}
 */
function index() {
  if (_byCode && _searchable) return { byCode: _byCode, searchable: _searchable };

  const countries = PLACES.countries || {};
  const byCode = new Map();
  const searchable = [];

  (PLACES.places || []).forEach((row) => {
    const place = {
      code: row.c,
      name: row.n,
      city: row.ci,
      country: row.co,
      countryName: countries[row.co] || row.co,
      type: row.t,
    };
    byCode.set(place.code, place);
    searchable.push({
      place,
      haystack: `${place.code} ${place.city} ${place.name} ${place.countryName}`.toLowerCase(),
      cityLower: place.city.toLowerCase(),
    });
  });

  _byCode = byCode;
  _searchable = searchable;
  return { byCode, searchable };
}

/**
 * Look up one place by IATA code.
 *
 * @param {*} code
 * @return {object|null} `{ code, name, city, country, countryName, type }`
 */
function resolvePlace(code) {
  const iata = normalizeIata(code);
  if (!iata) return null;
  return index().byCode.get(iata) || null;
}

/**
 * Airline name for a marketing carrier code, falling back to the code itself.
 *
 * @param {*} code
 * @return {string}
 */
function airlineName(code) {
  const key = String(code || "").trim().toUpperCase();
  if (!key) return "";
  return AIRLINE_NAMES[key] || key;
}

/**
 * Typeahead search over cities, airports and country names.
 *
 * Ranking, best first: exact IATA code, then city-name prefix, then any prefix,
 * then a substring match anywhere. Cities outrank airports at equal rank so
 * "Dubai" offers DXB the city before Dubai's individual terminals.
 *
 * @param {*} query
 * @param {number} [limit]
 * @return {Array<object>}
 */
function searchPlaces(query, limit) {
  const q = String(query === null || query === undefined ? "" : query).trim().toLowerCase();
  if (q.length < 2) return [];

  const cap = Number.isFinite(Number(limit)) && Number(limit) > 0
    ? Math.min(Math.floor(Number(limit)), 25)
    : 8;

  const { searchable } = index();
  const hits = [];

  for (const entry of searchable) {
    let rank;
    if (entry.place.code.toLowerCase() === q) rank = 0;
    else if (entry.cityLower.startsWith(q)) rank = 1;
    else if (entry.haystack.startsWith(q)) rank = 2;
    else if (entry.haystack.includes(q)) rank = 3;
    else continue;

    hits.push({ rank: rank * 2 + (entry.place.type === "city" ? 0 : 1), place: entry.place });
  }

  hits.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.place.city.localeCompare(b.place.city);
  });

  return hits.slice(0, cap).map((hit) => ({
    code: hit.place.code,
    city: hit.place.city,
    name: hit.place.name,
    country: hit.place.country,
    countryName: hit.place.countryName,
    type: hit.place.type,
  }));
}

module.exports = {
  resolvePlace,
  searchPlaces,
  airlineName,
};
