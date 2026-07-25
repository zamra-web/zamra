const test = require("node:test");
const assert = require("node:assert/strict");

const {
  dedupeDealFares,
  projectDealFare,
  buildDealSections,
} = require("../publicDeals");

const FLIGHT_DATE = new Date("2026-09-12T00:00:00Z");

function fare(overrides) {
  return Object.assign({
    sectorId: "sec-ccj-jed",
    airlineId: "air-ix",
    flightDate: FLIGHT_DATE,
    flightTime: "04:05 - 11:10",
    baggage: 30,
    finalRate: 18500,
  }, overrides || {});
}

test("duplicate rows collapse to the cheapest for the same flight", () => {
  const rows = dedupeDealFares([
    fare({ finalRate: 18500 }),
    fare({ finalRate: 16900 }),
    fare({ finalRate: 21000 }),
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].finalRate, 16900);
});

test("flight time whitespace and case do not split a group", () => {
  const rows = dedupeDealFares([
    fare({ flightTime: "04:05 - 11:10", finalRate: 18500 }),
    fare({ flightTime: "04:05-11:10", finalRate: 16900 }),
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].finalRate, 16900);
});

test("different date, airline or time stay separate flights", () => {
  const rows = dedupeDealFares([
    fare({ finalRate: 18500 }),
    fare({ airlineId: "air-6e", finalRate: 17000 }),
    fare({ flightTime: "09:00 - 15:00", finalRate: 17500 }),
    fare({ flightDate: new Date("2026-09-13T00:00:00Z"), finalRate: 16000 }),
  ]);

  assert.equal(rows.length, 4);
});

test("results are ordered by date, then price", () => {
  const rows = dedupeDealFares([
    fare({ flightDate: new Date("2026-09-14T00:00:00Z"), finalRate: 15000 }),
    fare({ flightDate: FLIGHT_DATE, airlineId: "air-6e", finalRate: 19000 }),
    fare({ flightDate: FLIGHT_DATE, airlineId: "air-ix", finalRate: 17000 }),
  ]);

  assert.deepEqual(rows.map((r) => r.finalRate), [17000, 19000, 15000]);
});

test("unusable rows are dropped rather than rendered as zero", () => {
  const rows = dedupeDealFares([
    fare({ finalRate: 0 }),
    fare({ airlineId: "air-6e", finalRate: null }),
    fare({ airlineId: "air-ai", finalRate: "not a number" }),
    fare({ airlineId: "air-sv", flightDate: null }),
  ]);

  assert.equal(rows.length, 0);
  assert.deepEqual(dedupeDealFares(null), []);
});

test("a projected fare exposes ONLY display fields", () => {
  const projected = projectDealFare(
    fare({ specialRate: 12000, commission: 500, supplierRate: 0, agentId: "supplier-7" }),
    { name: "Air India Express", code: "IX", logoUrl: "https://example.test/ix.png" },
  );

  // The allow-list, in full.
  assert.deepEqual(Object.keys(projected).sort(), [
    "airlineCode",
    "airlineLogo",
    "airlineName",
    "checkInBaggageKg",
    "date",
    "handBaggageKg",
    "price",
    "time",
  ]);

  // The fields that must never be published, named explicitly so a future
  // change to the projection fails loudly here.
  ["specialRate", "commission", "finalRate", "supplierRate", "agentId", "isHidden"]
    .forEach((field) => assert.equal(projected[field], undefined, `${field} must not be published`));
});

test("projection resolves baggage from airline policy, not the stored value", () => {
  // SV allows 20/30/40 — a stored 25 is not a legal weight and snaps to 30.
  const sv = projectDealFare(fare({ baggage: 25 }), { name: "Saudia", code: "SV" });
  assert.equal(sv.checkInBaggageKg, 30);
  assert.equal(sv.handBaggageKg, 7);

  // G9 carries a 10 kg cabin allowance.
  const g9 = projectDealFare(fare({ baggage: 30 }), { name: "Air Arabia", code: "G9" });
  assert.equal(g9.handBaggageKg, 10);
});

test("projection survives a missing airline document", () => {
  const projected = projectDealFare(fare({ airlineId: "air-unknown" }), null);

  assert.equal(projected.airlineName, "air-unknown");
  assert.equal(projected.airlineCode, "");
  assert.equal(projected.airlineLogo, "");
  assert.equal(projected.checkInBaggageKg, 30);
  assert.equal(projected.price, 18500);
});

test("sections keep the curator's sector order", () => {
  const sectors = new Map([
    ["sec-a", { sectorCode: "CCJ JED", sectorFrom: "Calicut", sectorTo: "Jeddah" }],
    ["sec-b", { sectorCode: "COK DXB", sectorFrom: "Kochi", sectorTo: "Dubai" }],
  ]);
  const airlines = new Map([["air-ix", { name: "Air India Express", code: "IX" }]]);

  const sections = buildDealSections(
    [fare({ sectorId: "sec-b" }), fare({ sectorId: "sec-a" })],
    sectors,
    airlines,
    ["sec-a", "sec-b"],
    0,
  );

  assert.deepEqual(sections.map((s) => s.sectorCode), ["CCJ JED", "COK DXB"]);
  assert.equal(sections[0].from, "Calicut");
});

test("sections report the lowest price and respect maxPerSector", () => {
  const sectors = new Map([["sec-a", { sectorCode: "CCJ JED" }]]);
  const airlines = new Map();

  const rows = [
    fare({ sectorId: "sec-a", finalRate: 19000 }),
    fare({ sectorId: "sec-a", finalRate: 16000 }),
    fare({ sectorId: "sec-a", finalRate: 17000 }),
  ];

  assert.equal(buildDealSections(rows, sectors, airlines, ["sec-a"], 0)[0].fares.length, 3);
  assert.equal(buildDealSections(rows, sectors, airlines, ["sec-a"], 2)[0].fares.length, 2);
  assert.equal(buildDealSections(rows, sectors, airlines, ["sec-a"], 0)[0].lowestPrice, 16000);
});

test("a sector with no fares produces no card", () => {
  const sections = buildDealSections(
    [fare({ sectorId: "sec-a" })],
    new Map([["sec-a", { sectorCode: "CCJ JED" }], ["sec-empty", { sectorCode: "CNN DOH" }]]),
    new Map(),
    ["sec-a", "sec-empty"],
    0,
  );

  assert.equal(sections.length, 1);
  assert.equal(sections[0].sectorCode, "CCJ JED");
});

test("a sector the curation did not list still renders, after the ordered ones", () => {
  const sections = buildDealSections(
    [fare({ sectorId: "sec-extra" }), fare({ sectorId: "sec-a" })],
    new Map([["sec-a", { sectorCode: "CCJ JED" }], ["sec-extra", { sectorCode: "CNN DOH" }]]),
    new Map(),
    ["sec-a"],
    0,
  );

  assert.deepEqual(sections.map((s) => s.sectorCode), ["CCJ JED", "CNN DOH"]);
});
