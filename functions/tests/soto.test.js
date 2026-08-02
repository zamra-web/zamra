"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  SOTO_FARE_KEYS,
  DEFAULT_CURRENCY,
  normalizeIata,
  resolveCurrency,
  isValidDepartDate,
  isRouteEligible,
  buildCacheKey,
  splitProviderTimestamp,
  normalizeProviderRows,
  projectSotoFare,
} = require("../soto/normalize");

const { resolvePlace, searchPlaces, airlineName } = require("../soto/places");
const { parseSearchRequest } = require("../soto/index");

const NOW = new Date("2026-08-02T09:00:00Z");

/**
 * @param {object} [overrides]
 * @return {object} a Travelpayouts v3 prices_for_dates row
 */
function providerRow(overrides = {}) {
  return Object.assign({
    origin: "DXB",
    destination: "BKK",
    origin_airport: "DXB",
    destination_airport: "BKK",
    price: 21500,
    airline: "EK",
    flight_number: 372,
    departure_at: "2026-09-12T03:45:00+04:00",
    return_at: "",
    transfers: 0,
    duration: 380,
    link: "/search/DXB1209BKK?marker=zamra-secret-marker",
    currency: "inr",
  }, overrides);
}

const CONFIG = { markup: 0, blockIndiaDestinations: false };


// ── Currency ─────────────────────────────────────────────────────────────────
// The provider answers in ROUBLES when no currency is passed, silently. These
// two tests are the guard against shipping rouble prices to the page.

test("resolveCurrency defaults to INR rather than the provider's rouble default", () => {
  assert.equal(resolveCurrency(undefined), "inr");
  assert.equal(resolveCurrency(""), "inr");
  assert.equal(resolveCurrency(null), "inr");
  assert.equal(DEFAULT_CURRENCY, "inr");
  assert.notEqual(resolveCurrency(undefined), "rub");
});

test("resolveCurrency lower-cases valid codes and rejects junk", () => {
  assert.equal(resolveCurrency("AED"), "aed");
  assert.equal(resolveCurrency(" usd "), "usd");
  assert.equal(resolveCurrency("rupees"), "inr");
  assert.equal(resolveCurrency("12"), "inr");
});


// ── IATA codes ───────────────────────────────────────────────────────────────

test("normalizeIata accepts three letters in any case and rejects anything else", () => {
  assert.equal(normalizeIata("dxb"), "DXB");
  assert.equal(normalizeIata(" Jed "), "JED");
  assert.equal(normalizeIata("DXBX"), "");
  assert.equal(normalizeIata("D1B"), "");
  assert.equal(normalizeIata(""), "");
  assert.equal(normalizeIata(null), "");
});


// ── Departure date window ────────────────────────────────────────────────────

test("isValidDepartDate accepts today through 11 months out", () => {
  assert.equal(isValidDepartDate("2026-08-02", NOW), true, "today is allowed");
  assert.equal(isValidDepartDate("2026-09-12", NOW), true);
  assert.equal(isValidDepartDate("2027-06-15", NOW), true, "inside the 11-month horizon");
});

test("isValidDepartDate rejects past, far-future and malformed dates", () => {
  assert.equal(isValidDepartDate("2026-08-01", NOW), false, "yesterday");
  assert.equal(isValidDepartDate("2028-01-01", NOW), false, "beyond the horizon");
  assert.equal(isValidDepartDate("2026-02-31", NOW), false, "not a real day");
  assert.equal(isValidDepartDate("12-09-2026", NOW), false, "wrong format");
  assert.equal(isValidDepartDate("", NOW), false);
});


// ── SOTO eligibility ─────────────────────────────────────────────────────────

test("isRouteEligible rejects India origins — that is what makes a fare SOTO", () => {
  const result = isRouteEligible({ originCountry: "IN", destinationCountry: "AE" }, CONFIG);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "ORIGIN_IN_INDIA");
});

test("isRouteEligible allows an India destination by default", () => {
  // DXB→COK sold in Kerala is a genuine SOTO ticket: the journey starts abroad.
  assert.equal(isRouteEligible({ originCountry: "AE", destinationCountry: "IN" }, CONFIG).ok, true);
});

test("isRouteEligible blocks India destinations when config says so", () => {
  const strict = { markup: 0, blockIndiaDestinations: true };
  const result = isRouteEligible({ originCountry: "AE", destinationCountry: "IN" }, strict);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "DESTINATION_IN_INDIA");
  assert.equal(isRouteEligible({ originCountry: "AE", destinationCountry: "TH" }, strict).ok, true);
});

test("isRouteEligible allows an ordinary third-country route", () => {
  assert.equal(isRouteEligible({ originCountry: "AE", destinationCountry: "TH" }, CONFIG).ok, true);
  assert.equal(isRouteEligible({ originCountry: "SA", destinationCountry: "EG" }, CONFIG).ok, true);
});


// ── Cache key ────────────────────────────────────────────────────────────────

test("buildCacheKey is deterministic and normalizes its inputs", () => {
  const a = buildCacheKey({ origin: "dxb", destination: "bkk", departDate: "2026-09-12", currency: "INR" });
  const b = buildCacheKey({ origin: "DXB", destination: "BKK", departDate: "2026-09-12", currency: "inr" });
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{40}$/);
});

test("buildCacheKey separates every parameter that changes the provider answer", () => {
  const base = { origin: "DXB", destination: "BKK", departDate: "2026-09-12" };
  const keys = new Set([
    buildCacheKey(base),
    buildCacheKey(Object.assign({}, base, { returnDate: "2026-09-20" })),
    buildCacheKey(Object.assign({}, base, { direct: true })),
    // A rupee search must never be served a cached rouble result.
    buildCacheKey(Object.assign({}, base, { currency: "aed" })),
    buildCacheKey(Object.assign({}, base, { destination: "SIN" })),
  ]);
  assert.equal(keys.size, 5, "each variation gets its own cache entry");
});


// ── Provider timestamps ──────────────────────────────────────────────────────

test("splitProviderTimestamp keeps the local wall clock the provider wrote", () => {
  // The offset belongs to the departure airport, so the time in the string is
  // already local. Round-tripping through Date would rebase it onto the server
  // zone and print the wrong hour — and sometimes the wrong day.
  assert.deepEqual(
    splitProviderTimestamp("2026-09-12T03:45:00+04:00"),
    { date: "2026-09-12", time: "03:45" },
  );
  assert.deepEqual(splitProviderTimestamp(""), { date: "", time: "" });
  assert.deepEqual(splitProviderTimestamp(null), { date: "", time: "" });
  assert.deepEqual(splitProviderTimestamp("not a date"), { date: "", time: "" });
});


// ── Normalizing the provider payload ─────────────────────────────────────────

test("normalizeProviderRows keeps the cheapest row per flight and sorts by price", () => {
  const rows = normalizeProviderRows({
    data: [
      providerRow({ price: 24000 }),
      providerRow({ price: 21500 }),
      providerRow({ airline: "TG", flight_number: 518, price: 19800 }),
    ],
  }, { now: NOW });

  assert.equal(rows.length, 2, "the two EK rows collapse to one");
  assert.deepEqual(rows.map((r) => r.price), [19800, 21500]);
});

test("normalizeProviderRows drops rows the provider has already expired", () => {
  const rows = normalizeProviderRows({
    data: [
      providerRow({ airline: "TG", expires_at: "2026-08-01T00:00:00Z" }),
      providerRow({ airline: "EK", expires_at: "2026-08-09T00:00:00Z" }),
      providerRow({ airline: "QR", flight_number: 1 }),
    ],
  }, { now: NOW });

  // A price the provider has itself disowned is worse than one fare fewer.
  assert.deepEqual(rows.map((r) => r.airline).sort(), ["EK", "QR"]);
});

test("normalizeProviderRows discards unusable rows without throwing", () => {
  const rows = normalizeProviderRows({
    data: [
      providerRow({ price: 0 }),
      providerRow({ price: -100 }),
      providerRow({ price: "not a number" }),
      providerRow({ departure_at: "" }),
      null,
      "nonsense",
    ],
  }, { now: NOW });

  assert.deepEqual(rows, []);
});

test("normalizeProviderRows survives an empty or malformed payload", () => {
  assert.deepEqual(normalizeProviderRows({ data: [] }, { now: NOW }), []);
  assert.deepEqual(normalizeProviderRows({}, { now: NOW }), []);
  assert.deepEqual(normalizeProviderRows(null, { now: NOW }), []);
  assert.deepEqual(normalizeProviderRows({ data: "oops" }, { now: NOW }), []);
});


// ── The response allow-list ──────────────────────────────────────────────────

test("projectSotoFare emits exactly the allow-listed keys", () => {
  const fare = projectSotoFare(providerRow(), {
    origin: "DXB", destination: "BKK", currency: "inr", airlineName: "Emirates",
  });
  assert.deepEqual(Object.keys(fare).sort(), [...SOTO_FARE_KEYS].sort());
});

test("projectSotoFare never publishes the affiliate deep link", () => {
  const fare = projectSotoFare(providerRow(), {
    origin: "DXB", destination: "BKK", currency: "inr", airlineName: "Emirates",
  });

  // `link` carries our Travelpayouts marker — a working referral URL that is
  // not ours to hand out. Naming the forbidden fields explicitly means widening
  // the projection fails here instead of quietly publishing them.
  ["link", "currency_rate", "origin_airport", "destination_airport", "token", "marker"]
    .forEach((forbidden) => {
      assert.equal(Object.hasOwn(fare, forbidden), false, `${forbidden} must not be published`);
    });

  assert.equal(JSON.stringify(fare).includes("zamra-secret-marker"), false);
});

test("projectSotoFare maps a provider row onto display fields", () => {
  const fare = projectSotoFare(providerRow(), {
    origin: "DXB", destination: "BKK", currency: "inr", airlineName: "Emirates",
  });

  assert.equal(fare.origin, "DXB");
  assert.equal(fare.destination, "BKK");
  assert.equal(fare.departDate, "2026-09-12");
  assert.equal(fare.departTime, "03:45");
  assert.equal(fare.returnDate, "", "a one-way row has no return date");
  assert.equal(fare.airlineCode, "EK");
  assert.equal(fare.airlineName, "Emirates");
  assert.equal(fare.flightNumber, "EK372");
  assert.equal(fare.stops, 0);
  assert.equal(fare.durationMinutes, 380);
  assert.equal(fare.price, 21500);
  assert.equal(fare.currency, "INR");
});

test("projectSotoFare adds the configured markup and rounds to whole units", () => {
  const fare = projectSotoFare(providerRow({ price: 21500.4 }), {
    origin: "DXB", destination: "BKK", currency: "inr", airlineName: "Emirates", markup: 750,
  });
  assert.equal(fare.price, 22250);
});

test("projectSotoFare falls back to the airline code when no name is known", () => {
  const fare = projectSotoFare(providerRow({ airline: "q0" }), {
    origin: "DXB", destination: "BKK", currency: "inr",
  });
  assert.equal(fare.airlineName, "Q0");
  assert.equal(fare.airlineCode, "Q0");
});

test("projectSotoFare carries the return date for a round trip", () => {
  const fare = projectSotoFare(providerRow({ return_at: "2026-09-20T22:10:00+07:00" }), {
    origin: "DXB", destination: "BKK", currency: "inr",
  });
  assert.equal(fare.returnDate, "2026-09-20");
});


// ── Place directory ──────────────────────────────────────────────────────────

test("resolvePlace finds hubs and reports their country", () => {
  assert.equal(resolvePlace("DXB").country, "AE");
  assert.equal(resolvePlace("jed").country, "SA");
  assert.equal(resolvePlace("BKK").country, "TH");
  // The India check depends on this being right, so pin one.
  assert.equal(resolvePlace("COK").country, "IN");
});

test("resolvePlace returns null for codes that are not real airports", () => {
  assert.equal(resolvePlace("ZZZ"), null);
  assert.equal(resolvePlace("XX"), null);
  assert.equal(resolvePlace(""), null);
});

test("searchPlaces matches on city name and IATA code", () => {
  const byCity = searchPlaces("dubai", 8);
  assert.ok(byCity.some((p) => p.code === "DXB"), "Dubai finds DXB");

  const byCode = searchPlaces("BKK", 8);
  assert.equal(byCode[0].code, "BKK", "an exact code ranks first");
});

test("searchPlaces ignores queries that are too short and honours the limit", () => {
  assert.deepEqual(searchPlaces("d", 8), []);
  assert.deepEqual(searchPlaces("", 8), []);
  assert.ok(searchPlaces("lon", 3).length <= 3);
});

test("airlineName resolves known carriers and falls back to the code", () => {
  assert.equal(airlineName("EK"), "Emirates");
  assert.equal(airlineName("q0"), "Q0", "an unlisted code stands in for itself");
  assert.equal(airlineName(""), "");
});


// ── Request parsing ──────────────────────────────────────────────────────────

test("parseSearchRequest accepts a valid third-country search", () => {
  const parsed = parseSearchRequest(
    { origin: "dxb", destination: "bkk", departDate: "2026-09-12" }, CONFIG, NOW,
  );
  assert.equal(parsed.error, undefined);
  assert.equal(parsed.origin.code, "DXB");
  assert.equal(parsed.destination.code, "BKK");
  assert.equal(parsed.currency, "inr");
  assert.equal(parsed.direct, false);
});

test("parseSearchRequest rejects an India-origin route as not SOTO", () => {
  const parsed = parseSearchRequest(
    { origin: "COK", destination: "DXB", departDate: "2026-09-12" }, CONFIG, NOW,
  );
  assert.equal(parsed.error, "NOT_SOTO");
  assert.match(parsed.message, /homepage/i, "the visitor is told where India fares live");
});

test("parseSearchRequest rejects missing, identical and unknown airports", () => {
  assert.equal(parseSearchRequest({ origin: "DXB" }, CONFIG, NOW).error, "MISSING_PARAMS");
  assert.equal(
    parseSearchRequest({ origin: "DXB", destination: "DXB", departDate: "2026-09-12" }, CONFIG, NOW).error,
    "SAME_AIRPORT",
  );
  assert.equal(
    parseSearchRequest({ origin: "DXB", destination: "ZZZ", departDate: "2026-09-12" }, CONFIG, NOW).error,
    "UNKNOWN_AIRPORT",
  );
});

test("parseSearchRequest rejects a return date before departure", () => {
  const parsed = parseSearchRequest({
    origin: "DXB", destination: "BKK", departDate: "2026-09-12", returnDate: "2026-09-01",
  }, CONFIG, NOW);
  assert.equal(parsed.error, "BAD_DATE");
});

test("parseSearchRequest reads the direct flag from a query string", () => {
  const parsed = parseSearchRequest({
    origin: "DXB", destination: "BKK", departDate: "2026-09-12", direct: "true",
  }, CONFIG, NOW);
  assert.equal(parsed.direct, true);
});
