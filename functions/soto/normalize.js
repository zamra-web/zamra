"use strict";

// Pure logic for the SOTO fare endpoint. No Firestore, no network, no
// firebase-admin — everything here is exercised directly by
// functions/tests/soto.test.js with plain object fixtures, the same way
// b2b.js and publicDeals.js split their I/O half from their logic half.

const crypto = require("crypto");

/** Currency the provider falls back to when none is asked for. */
const PROVIDER_DEFAULT_CURRENCY = "rub";

/** What we always ask for instead. See resolveCurrency(). */
const DEFAULT_CURRENCY = "inr";

/** Furthest out a search is allowed to look. Airlines rarely load beyond this. */
const MAX_DEPART_MONTHS_AHEAD = 11;

/**
 * The exact keys a projected SOTO fare carries.
 *
 * Adding a key here publishes it to every visitor. The provider payload also
 * contains `link` — an Aviasales deep link carrying our affiliate marker — and
 * that must never appear in a response. See projectSotoFare().
 */
const SOTO_FARE_KEYS = Object.freeze([
  "origin",
  "destination",
  "departDate",
  "departTime",
  "returnDate",
  "airlineCode",
  "airlineName",
  "flightNumber",
  "stops",
  "durationMinutes",
  "price",
  "currency",
  "foundAt",
]);

/**
 * Normalize an IATA code to upper-case, or "" when it is not three letters.
 *
 * @param {*} value
 * @return {string}
 */
function normalizeIata(value) {
  const code = String(value === null || value === undefined ? "" : value)
    .trim()
    .toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : "";
}

/**
 * Resolve the currency to request from the provider.
 *
 * THIS IS LOAD-BEARING. The Travelpayouts API returns **roubles** when the
 * `currency` parameter is absent, and it does so silently — the numbers simply
 * come back roughly 2.5x too large with `"currency": "rub"` on each row. Every
 * call must pass a currency explicitly.
 *
 * @param {*} raw
 * @return {string} lower-case 3-letter code, never empty
 */
function resolveCurrency(raw) {
  const code = String(raw === null || raw === undefined ? "" : raw)
    .trim()
    .toLowerCase();
  return /^[a-z]{3}$/.test(code) ? code : DEFAULT_CURRENCY;
}

/**
 * Parse a `YYYY-MM-DD` string into its parts without going through Date.
 *
 * Deliberately not `new Date(str)`: that yields a UTC instant, and every
 * downstream `getDate()` west of UTC then reports the previous day. Same
 * reasoning as toDateKey() in b2bOffers.js.
 *
 * @param {*} value
 * @return {{year: number, month: number, day: number}|null}
 */
function parseDateKey(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || "").trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  // Reject 2026-02-31 and friends by round-tripping through UTC.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;

  return { year, month, day };
}

/**
 * `YYYY-MM-DD` for a Date, read in UTC.
 *
 * @param {Date} date
 * @return {string}
 */
function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Is this a departure date we are willing to spend a provider call on?
 *
 * Rejecting here is both correct behaviour and the cheapest abuse guard the
 * endpoint has: a malformed or absurd date never reaches the provider.
 *
 * @param {*} value `YYYY-MM-DD`
 * @param {Date} now
 * @return {boolean}
 */
function isValidDepartDate(value, now) {
  if (!parseDateKey(value)) return false;

  const todayKey = toDateKey(now);
  if (value < todayKey) return false;

  const horizon = new Date(now.getTime());
  horizon.setUTCMonth(horizon.getUTCMonth() + MAX_DEPART_MONTHS_AHEAD);
  return value <= toDateKey(horizon);
}

/**
 * Decide whether a route belongs on the SOTO page.
 *
 * SOTO — "Sold Outside, Ticketed Outside" — means the journey *starts* outside
 * the country of sale. Zamra sells from India, so the rule is: the origin must
 * not be in India. An India destination is fine (DXB→COK sold in Kerala is a
 * genuine SOTO ticket), which is why only the origin is checked by default.
 *
 * `blockIndiaDestinations` on config/soto tightens this to "must not touch
 * India at all" without needing a deploy.
 *
 * @param {{originCountry: string, destinationCountry: string}} route
 * @param {{blockIndiaDestinations?: boolean}} [config]
 * @return {{ok: boolean, reason: string}}
 */
function isRouteEligible(route, config) {
  const originCountry = String((route && route.originCountry) || "").toUpperCase();
  const destinationCountry = String((route && route.destinationCountry) || "").toUpperCase();
  const blockDestinations = Boolean(config && config.blockIndiaDestinations);

  if (originCountry === "IN") {
    return { ok: false, reason: "ORIGIN_IN_INDIA" };
  }
  if (blockDestinations && destinationCountry === "IN") {
    return { ok: false, reason: "DESTINATION_IN_INDIA" };
  }
  return { ok: true, reason: "" };
}

/**
 * Deterministic cache document id for one search.
 *
 * Every parameter that changes the provider response has to be in the key,
 * `currency` and `direct` included — otherwise a rupee search serves a cached
 * rouble result.
 *
 * @param {object} query
 * @return {string} 40-char hex
 */
function buildCacheKey(query) {
  const parts = [
    normalizeIata(query && query.origin),
    normalizeIata(query && query.destination),
    String((query && query.departDate) || ""),
    String((query && query.returnDate) || ""),
    (query && query.direct) ? "1" : "0",
    resolveCurrency(query && query.currency),
  ];
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 40);
}

/**
 * Split a provider timestamp into its local date and time as written.
 *
 * `departure_at` arrives as "2026-09-19T10:50:00+04:00" — that offset is the
 * departure airport's, so the wall-clock in the string is already the local
 * departure time. Parsing it into a Date and formatting it back would rebase it
 * onto the server's zone and print the wrong hour (and sometimes the wrong day).
 * So it is read with a regex and left exactly as the provider wrote it.
 *
 * @param {*} value
 * @return {{date: string, time: string}}
 */
function splitProviderTimestamp(value) {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(String(value || "").trim());
  if (!match) return { date: "", time: "" };
  return { date: match[1], time: match[2] };
}

/**
 * Non-negative integer, or `fallback` when the value is not usable.
 *
 * @param {*} value
 * @param {number|null} fallback
 * @return {number|null}
 */
function toCount(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return Math.round(num);
}

/**
 * Clean, dedupe and sort the provider's rows.
 *
 * The provider returns cached prices harvested from Aviasales searches, so the
 * same flight shows up more than once at different prices and some rows are
 * already past their own `expires_at` by the time we read them. Rows that have
 * expired are dropped rather than shown — a price the provider has itself
 * disowned is worse than one fare fewer.
 *
 * (`expires_at` is present on the v1 endpoints and absent on v3. A row without
 * one is kept; only a row that carries an expiry *and* has passed it is cut.)
 *
 * @param {*} payload the provider's parsed JSON body
 * @param {{now?: Date}} [options]
 * @return {Array<object>} raw rows, cheapest first
 */
function normalizeProviderRows(payload, options) {
  const rows = payload && Array.isArray(payload.data) ? payload.data : [];
  const nowMs = ((options && options.now) || new Date()).getTime();
  const cheapest = new Map();

  rows.forEach((row) => {
    if (!row || typeof row !== "object") return;

    const price = Number(row.price);
    if (!Number.isFinite(price) || price <= 0) return;

    const departure = splitProviderTimestamp(row.departure_at);
    if (!departure.date) return;

    if (row.expires_at) {
      const expiresMs = new Date(row.expires_at).getTime();
      if (Number.isFinite(expiresMs) && expiresMs <= nowMs) return;
    }

    const key = [
      String(row.airline || "").toUpperCase(),
      String(row.flight_number || ""),
      departure.date,
      departure.time,
    ].join("|");

    const existing = cheapest.get(key);
    if (!existing || price < Number(existing.price)) cheapest.set(key, row);
  });

  return Array.from(cheapest.values())
    .sort((a, b) => Number(a.price) - Number(b.price));
}

/**
 * Reduce a provider row to exactly what the page renders.
 *
 * The allow-list is the point. The provider row also carries `link`, an
 * Aviasales deep link with our affiliate marker embedded — publishing it would
 * hand every visitor a working referral URL that is not ours to give away.
 * Anything not on SOTO_FARE_KEYS does not leave the server.
 *
 * @param {object} row
 * @param {{origin: string, destination: string, currency: string,
 *          airlineName?: string, markup?: number}} context
 * @return {object}
 */
function projectSotoFare(row, context) {
  const ctx = context || {};
  const departure = splitProviderTimestamp(row.departure_at);
  const returnLeg = splitProviderTimestamp(row.return_at);

  const markup = Number(ctx.markup);
  const base = Number(row.price);
  const price = Math.max(0, Math.round(base + (Number.isFinite(markup) ? markup : 0)));

  const airlineCode = String(row.airline || "").trim().toUpperCase();
  const flightNumber = String(row.flight_number || "").trim();

  return {
    origin: normalizeIata(row.origin) || normalizeIata(ctx.origin),
    destination: normalizeIata(row.destination) || normalizeIata(ctx.destination),
    departDate: departure.date,
    departTime: departure.time,
    returnDate: returnLeg.date,
    airlineCode,
    airlineName: String(ctx.airlineName || "").trim() || airlineCode || "Airline",
    flightNumber: flightNumber ? `${airlineCode}${flightNumber}` : "",
    stops: toCount(row.transfers, 0),
    durationMinutes: toCount(row.duration, null),
    price,
    currency: String(ctx.currency || DEFAULT_CURRENCY).toUpperCase(),
    foundAt: String(row.found_at || "").trim(),
  };
}

module.exports = {
  DEFAULT_CURRENCY,
  PROVIDER_DEFAULT_CURRENCY,
  MAX_DEPART_MONTHS_AHEAD,
  SOTO_FARE_KEYS,
  normalizeIata,
  resolveCurrency,
  parseDateKey,
  toDateKey,
  isValidDepartDate,
  isRouteEligible,
  buildCacheKey,
  splitProviderTimestamp,
  normalizeProviderRows,
  projectSotoFare,
};
