#!/usr/bin/env node
"use strict";

// build-soto-reference.cjs — regenerates the airport/airline lookup data the
// SOTO page searches against.
//
//   node scripts/build-soto-reference.cjs
//
// Writes:
//   functions/soto/places.json    cities + airports the typeahead searches
//   functions/soto/airlines.json  IATA code -> airline name
//
// Both outputs are COMMITTED. The alternative — fetching ~4.7 MB of reference
// JSON on every cold start — would put a multi-second stall in front of the
// first search of the day, for data that changes a few times a year.
//
// Travelpayouts serves these files without a token, so this script needs no
// credentials. Re-run it when airports or carriers are obviously missing.
//
// This deliberately does NOT touch web/src/js/shared/airports.js. That module
// is the e-ticket IATA resolver for Zamra's 25 India/Gulf airports, its job is
// printing CCJ instead of CAL, and it ships to every page — widening it to
// several thousand worldwide entries would bloat the public bundle and break
// the tests that assert its exact table.

const fs = require("fs");
const path = require("path");

const BASE = "https://api.travelpayouts.com/data";
const OUT_DIR = path.join(__dirname, "..", "functions", "soto");

/**
 * @param {string} url
 * @return {Promise<Array<object>>}
 */
async function fetchJson(url) {
  const response = await fetch(url, { headers: { "Accept-Encoding": "gzip, deflate" } });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  const body = await response.json();
  if (!Array.isArray(body)) throw new Error(`${url} did not return an array`);
  return body;
}

/**
 * @param {*} value
 * @return {string}
 */
function englishName(value) {
  if (!value || typeof value !== "object") return "";
  return String(value.en || "").trim();
}

async function main() {
  console.log("Fetching Travelpayouts reference data…");
  const [airports, cities, countries, airlines] = await Promise.all([
    fetchJson(`${BASE}/en/airports.json`),
    fetchJson(`${BASE}/en/cities.json`),
    fetchJson(`${BASE}/en/countries.json`),
    fetchJson(`${BASE}/en/airlines.json`),
  ]);
  console.log(
    `  airports=${airports.length} cities=${cities.length} ` +
    `countries=${countries.length} airlines=${airlines.length}`,
  );

  const countryNameByCode = new Map();
  countries.forEach((row) => {
    const code = String(row.code || "").toUpperCase();
    const name = englishName(row.name_translations) || String(row.name || "");
    if (/^[A-Z]{2}$/.test(code) && name) countryNameByCode.set(code, name);
  });

  const cityNameByCode = new Map();
  cities.forEach((row) => {
    const code = String(row.code || "").toUpperCase();
    const name = englishName(row.name_translations) || String(row.name || "");
    if (/^[A-Z]{3}$/.test(code) && name) cityNameByCode.set(code, name);
  });

  // Codes are keyed once. A city entry beats an airport entry on a collision
  // (DXB is both) because searching a city is what a customer actually means,
  // and the provider accepts city codes anywhere it accepts airport codes.
  const places = new Map();

  /**
   * @param {object} row
   * @param {"city"|"airport"} type
   */
  function add(row, type) {
    const code = String(row.code || "").toUpperCase();
    if (!/^[A-Z]{3}$/.test(code)) return;

    const country = String(row.country_code || "").toUpperCase();
    if (!countryNameByCode.has(country)) return;

    const name = englishName(row.name_translations) || String(row.name || "");
    if (!name) return;

    const city = type === "city"
      ? name
      : (cityNameByCode.get(String(row.city_code || "").toUpperCase()) || name);

    const existing = places.get(code);
    if (existing && existing.t === "city") return;

    places.set(code, { c: code, n: name, ci: city, co: country, t: type });
  }

  cities.forEach((row) => {
    if (row.has_flightable_airport) add(row, "city");
  });
  airports.forEach((row) => {
    if (row.flightable) add(row, "airport");
  });

  const placeList = Array.from(places.values()).sort((a, b) => a.c.localeCompare(b.c));

  const airlineNames = {};
  airlines.forEach((row) => {
    const code = String(row.code || "").toUpperCase();
    const name = englishName(row.name_translations) || String(row.name || "");
    if (/^[A-Z0-9]{2}$/.test(code) && name) airlineNames[code] = name;
  });

  const usedCountries = {};
  placeList.forEach((place) => {
    usedCountries[place.co] = countryNameByCode.get(place.co);
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const placesPath = path.join(OUT_DIR, "places.json");
  fs.writeFileSync(placesPath, `${JSON.stringify({
    generatedAt: new Date().toISOString().slice(0, 10),
    countries: usedCountries,
    places: placeList,
  })}\n`);

  const airlinesPath = path.join(OUT_DIR, "airlines.json");
  fs.writeFileSync(airlinesPath, `${JSON.stringify(airlineNames)}\n`);

  const kb = (p) => `${Math.round(fs.statSync(p).size / 1024)} kB`;
  console.log(`Wrote ${placesPath} — ${placeList.length} places, ${kb(placesPath)}`);
  console.log(`Wrote ${airlinesPath} — ${Object.keys(airlineNames).length} airlines, ${kb(airlinesPath)}`);

  // A missing hub means the filters above went wrong; fail loudly rather than
  // committing a dataset that quietly cannot find Dubai.
  const missing = ["DXB", "JED", "BKK", "LHR", "SIN", "IST", "COK"].filter((c) => !places.has(c));
  if (missing.length) throw new Error(`Sanity check failed — missing ${missing.join(", ")}`);
  console.log("Sanity check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
