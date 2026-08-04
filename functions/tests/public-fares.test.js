const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MAX_ROWS,
  projectPublicFare,
  parsePublicFaresRequest,
} = require("../publicFares");

const FLIGHT_DATE = new Date("2026-09-12T04:05:00Z");

// A realistic raw agent_fares document — including the three fields that must
// never reach the browser.
function fareDoc(overrides) {
  return Object.assign({
    sectorId: "sec-ccj-jed",
    airlineId: "air-ix",
    flightDate: FLIGHT_DATE,
    flightTime: "04:05 - 11:10",
    baggage: 30,
    seatsAvailable: 6,
    finalRate: 18500,
    isHidden: false,
    specialRate: 15200,
    commission: 900,
    agentId: "supplier-7",
  }, overrides || {});
}

// ── The projection is the whole point of the endpoint ────────────────────────

test("the projection never publishes supplier economics", () => {
  const row = projectPublicFare(fareDoc());

  assert.equal(row.specialRate, undefined);
  assert.equal(row.commission, undefined);
  assert.equal(row.agentId, undefined);
  assert.equal(row.isHidden, undefined);
});

test("the projection emits exactly the allow-listed keys", () => {
  const row = projectPublicFare(fareDoc());

  assert.deepEqual(Object.keys(row).sort(), [
    "airlineId",
    "baggage",
    "finalRate",
    "flightDate",
    "flightTime",
    "sectorId",
    "seatsAvailable",
  ].sort());
});

test("an unknown field added to a fare document is not passed through", () => {
  const row = projectPublicFare(fareDoc({ supplierRate: 14000, internalNote: "x" }));

  assert.equal(row.supplierRate, undefined);
  assert.equal(row.internalNote, undefined);
});

test("the projection keeps the fields the public flight list renders", () => {
  const row = projectPublicFare(fareDoc());

  assert.equal(row.sectorId, "sec-ccj-jed");
  assert.equal(row.airlineId, "air-ix");
  assert.equal(row.flightTime, "04:05 - 11:10");
  assert.equal(row.finalRate, 18500);
  assert.equal(row.baggage, 30);
  assert.equal(row.seatsAvailable, 6);
});

test("flightDate crosses the wire as an ISO string", () => {
  const row = projectPublicFare(fareDoc());
  assert.equal(row.flightDate, "2026-09-12T04:05:00.000Z");
});

test("a Firestore Timestamp is unwrapped like a Date", () => {
  const row = projectPublicFare(fareDoc({
    flightDate: { toDate: () => FLIGHT_DATE },
  }));
  assert.equal(row.flightDate, "2026-09-12T04:05:00.000Z");
});

test("an unparseable date yields null rather than throwing", () => {
  // toISOString() raises RangeError on an invalid date, which would turn one bad
  // row into a 500 for the whole sector.
  assert.doesNotThrow(() => projectPublicFare(fareDoc({ flightDate: "not-a-date" })));
  assert.equal(projectPublicFare(fareDoc({ flightDate: "not-a-date" })).flightDate, null);
  assert.equal(projectPublicFare(fareDoc({ flightDate: undefined })).flightDate, null);
});

test("missing optional fields fall back to renderable defaults", () => {
  const row = projectPublicFare({ flightDate: FLIGHT_DATE });

  assert.equal(row.sectorId, "");
  assert.equal(row.airlineId, "");
  assert.equal(row.flightTime, "");
  assert.equal(row.finalRate, 0);
  assert.equal(row.baggage, "");
  assert.equal(row.seatsAvailable, 0);
});

test("a baggage value of 0 survives rather than becoming an empty string", () => {
  // `??` not `||` — 0kg is a real allowance and must not read as unknown.
  assert.equal(projectPublicFare(fareDoc({ baggage: 0 })).baggage, 0);
});

// ── Request parsing ──────────────────────────────────────────────────────────

test("a request without a sectorId is rejected", () => {
  assert.equal(parsePublicFaresRequest({ query: {} }), null);
  assert.equal(parsePublicFaresRequest({ query: { sectorId: "   " } }), null);
  assert.equal(parsePublicFaresRequest({}), null);
});

test("sectorId and dates are read from the query string", () => {
  const parsed = parsePublicFaresRequest({
    query: { sectorId: "sec-ccj-jed", startDate: "2026-09-01T00:00:00.000Z" },
  });

  assert.equal(parsed.sectorId, "sec-ccj-jed");
  assert.equal(parsed.startDate.toISOString(), "2026-09-01T00:00:00.000Z");
  assert.equal(parsed.endDate, null);
});

test("a POST body works as well as a query string", () => {
  const parsed = parsePublicFaresRequest({ body: { sectorId: "sec-ccj-jed" } });
  assert.equal(parsed.sectorId, "sec-ccj-jed");
});

test("a malformed date is dropped rather than poisoning the query", () => {
  const parsed = parsePublicFaresRequest({
    query: { sectorId: "sec-ccj-jed", startDate: "yesterday" },
  });

  // A NaN date passed to Timestamp.fromDate would throw; treating it as absent
  // returns the unfiltered sector instead of failing the page.
  assert.equal(parsed.startDate, null);
});

test("the row cap is bounded so an anonymous caller cannot read the collection dry", () => {
  assert.ok(Number.isInteger(MAX_ROWS) && MAX_ROWS > 0 && MAX_ROWS <= 5000);
});
