const test = require("node:test");
const assert = require("node:assert/strict");

const {
  computeB2BFares,
  filterSectorsForAgent,
  isSectorVisibleToAgent,
  parseSectorCodes,
  resolveAgentMarkup,
  loginIdToEmail,
  generatePassword,
} = require("../b2b");

const DAY = new Date("2026-08-01T00:00:00Z");

function fare(overrides = {}) {
  return {
    sectorId: "s1",
    airlineId: "air-ix",
    flightDate: DAY,
    flightTime: "10:00 - 13:00",
    baggage: "30",
    extraBaggage: 0,
    specialRate: 10000,
    finalRate: 10500,
    commission: 500,
    ...overrides,
  };
}

test("computeB2BFares keeps the minimum base per sector+airline+date+time group", () => {
  const fares = computeB2BFares(
    [
      fare({ specialRate: 10200 }),
      fare({ specialRate: 9800 }),
      fare({ specialRate: 10000 }),
    ],
    {},
    { defaultMarkup: 200 },
  );

  assert.equal(fares.length, 1);
  assert.equal(fares[0].price, 10000); // 9800 + 200
});

test("computeB2BFares separates groups by airline, date, and time", () => {
  const fares = computeB2BFares(
    [
      fare(),
      fare({ airlineId: "air-g9" }),
      fare({ flightDate: new Date("2026-08-02T00:00:00Z") }),
      fare({ flightTime: "22:00 - 01:00" }),
    ],
    {},
    { defaultMarkup: 200 },
  );

  assert.equal(fares.length, 4);
});

test("computeB2BFares falls back to finalRate - commission when specialRate is 0", () => {
  const fares = computeB2BFares(
    [fare({ specialRate: 0, finalRate: 10500, commission: 500 })],
    {},
    { defaultMarkup: 200 },
  );

  assert.equal(fares.length, 1);
  assert.equal(fares[0].price, 10200); // (10500 - 500) + 200
});

test("computeB2BFares skips fares with no positive base", () => {
  const fares = computeB2BFares(
    [
      fare({ specialRate: 0, finalRate: 0, commission: 0 }),
      fare({ specialRate: 0, finalRate: 300, commission: 500 }),
    ],
    {},
    { defaultMarkup: 200 },
  );

  assert.equal(fares.length, 0);
});

test("computeB2BFares honors markupOverride 0 while null uses the global default", () => {
  const withZero = computeB2BFares([fare()], { markupOverride: 0 }, { defaultMarkup: 200 });
  assert.equal(withZero[0].price, 10000);

  const withNull = computeB2BFares([fare()], { markupOverride: null }, { defaultMarkup: 200 });
  assert.equal(withNull[0].price, 10200);
});

test("computeB2BFares applies positive and negative route adjustments per sector", () => {
  const agent = { routeAdjustments: { s1: 500, s2: -300 } };
  const fares = computeB2BFares(
    [fare(), fare({ sectorId: "s2" }), fare({ sectorId: "s3" })],
    agent,
    { defaultMarkup: 200 },
  );

  const bySector = Object.fromEntries(
    [500, -300, 0].map((adj, i) => [["s1", "s2", "s3"][i], 10200 + adj]),
  );
  assert.equal(fares.length, 3);
  for (const price of fares.map((f) => f.price)) {
    assert.ok(Object.values(bySector).includes(price));
  }
});

test("computeB2BFares never exposes raw rate fields", () => {
  const [result] = computeB2BFares([fare()], {}, { defaultMarkup: 200 });

  assert.deepEqual(
    Object.keys(result).sort(),
    ["airlineId", "baggage", "extraBaggage", "flightDate", "flightTime", "price"],
  );
});

test("computeB2BFares sorts by date then price", () => {
  const later = new Date("2026-08-05T00:00:00Z");
  const fares = computeB2BFares(
    [
      fare({ flightDate: later, airlineId: "b", specialRate: 9000 }),
      fare({ airlineId: "a", specialRate: 12000 }),
      fare({ airlineId: "c", specialRate: 8000 }),
    ],
    {},
    { defaultMarkup: 200 },
  );

  assert.deepEqual(fares.map((f) => f.price), [8200, 12200, 9200]);
});

test("resolveAgentMarkup uses defaults when config is missing", () => {
  assert.equal(resolveAgentMarkup({}, {}), 200);
  assert.equal(resolveAgentMarkup({}, { defaultMarkup: 350 }), 350);
  assert.equal(resolveAgentMarkup({ markupOverride: 50 }, { defaultMarkup: 350 }), 50);
});

test("parseSectorCodes handles space and hyphen separators", () => {
  assert.deepEqual(parseSectorCodes("CCJ RUH"), { originCode: "CCJ", destCode: "RUH" });
  assert.deepEqual(parseSectorCodes("ccj-dxb"), { originCode: "CCJ", destCode: "DXB" });
  assert.deepEqual(parseSectorCodes(""), { originCode: "", destCode: "" });
});

test("filterSectorsForAgent hides origins and specific sectors", () => {
  const sectors = [
    { id: "s1", sectorCode: "CCJ RUH", sectorFrom: "Kozhikode", sectorTo: "Riyadh", sortOrder: 1 },
    { id: "s2", sectorCode: "CNN DXB", sectorFrom: "Kannur", sectorTo: "Dubai", sortOrder: 2 },
    { id: "s3", sectorCode: "COK JED", sectorFrom: "Kochi", sectorTo: "Jeddah", sortOrder: 3 },
    { id: "s4", sectorCode: "CCJ DXB", sectorFrom: "Kozhikode", sectorTo: "Dubai", sortOrder: 4 },
  ];
  const agent = { hiddenOrigins: ["cnn"], hiddenSectorIds: ["s4"] };

  const visible = filterSectorsForAgent(sectors, agent);

  assert.deepEqual(visible.map((s) => s.id), ["s1", "s3"]);
  assert.deepEqual(visible[0], {
    id: "s1",
    sectorCode: "CCJ RUH",
    sectorFrom: "Kozhikode",
    sectorTo: "Riyadh",
    originCode: "CCJ",
    destCode: "RUH",
  });
});

test("isSectorVisibleToAgent allows everything when agent has no restrictions", () => {
  assert.ok(isSectorVisibleToAgent({ id: "s1", sectorCode: "CCJ RUH" }, {}));
});

test("loginIdToEmail normalizes to the synthetic B2B domain", () => {
  assert.equal(loginIdToEmail(" ZMR001 "), "zmr001@b2b.zamratravels.com");
});

test("generatePassword produces distinct 10-char passwords from the safe alphabet", () => {
  const a = generatePassword();
  const b = generatePassword();
  assert.equal(a.length, 10);
  assert.match(a, /^[abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789]+$/);
  assert.notEqual(a, b);
});
