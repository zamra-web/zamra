"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildRouteList,
  createSectorsWithFaresCache,
  findSectorsWithFares,
  projectPublicRoute,
} = require("../publicRoutes");

const SECTORS = [
  { id: "s1", sectorCode: "CCJ JED", sectorFrom: "Calicut", sectorTo: "Jeddah", sortOrder: 2 },
  { id: "s2", sectorCode: "CCJ-DXB", sectorFrom: "Calicut", sectorTo: "Dubai", sortOrder: 1 },
  { id: "s3", sectorCode: "JED TRV", sectorFrom: "Jeddah", sectorTo: "Trivandrum", sortOrder: 3 },
];

test("a route is projected to codes, labels and the sector id, and nothing else", () => {
  const route = projectPublicRoute(SECTORS[0]);
  assert.deepEqual(route, {
    id: "s1",
    sectorCode: "CCJ JED",
    sectorFrom: "Calicut",
    sectorTo: "Jeddah",
    originCode: "CCJ",
    destCode: "JED",
  });
});

test("the dash form of a sector code parses into the same pair as the space form", () => {
  // The dropdown offers whatever this returns, so a sector stored as "CCJ-DXB"
  // has to yield CCJ → DXB or the route silently disappears from the site.
  const route = projectPublicRoute(SECTORS[1]);
  assert.equal(route.originCode, "CCJ");
  assert.equal(route.destCode, "DXB");
});

test("only sectors holding a fare survive, in admin display order", () => {
  const routes = buildRouteList(SECTORS, new Set(["s1", "s2"]));
  assert.deepEqual(routes.map((r) => r.id), ["s2", "s1"]);
});

test("a sector with no upcoming fare is dropped, so the pair is never offered", () => {
  // This is the whole point: JED → TRV exists as a sector but has no fares, and
  // selecting it used to produce an empty result page.
  const routes = buildRouteList(SECTORS, new Set(["s1"]));
  assert.deepEqual(routes.map((r) => `${r.originCode}${r.destCode}`), ["CCJJED"]);
});

test("a sector whose code does not parse into two airports is dropped", () => {
  // It has no origin to cascade under and would render as a blank option.
  const routes = buildRouteList(
    [{ id: "bad", sectorCode: "CCJ", sortOrder: 1 }],
    new Set(["bad"]),
  );
  assert.deepEqual(routes, []);
});

/** Minimal Firestore double: records the queries and answers count(). */
function fakeDb(countsBySectorId, calls = []) {
  return {
    collection(name) {
      const state = { name, sectorId: "" };
      const chain = {
        where(field, _op, value) {
          if (field === "sectorId") state.sectorId = value;
          return chain;
        },
        count() {
          return {
            async get() {
              calls.push(state.sectorId);
              return { data: () => ({ count: countsBySectorId[state.sectorId] || 0 }) };
            },
          };
        },
      };
      return chain;
    },
  };
}

test("findSectorsWithFares reports only sectors with a non-zero count", async () => {
  const db = fakeDb({ s1: 12, s2: 0, s3: 4 });
  const ids = await findSectorsWithFares(db, SECTORS, new Date("2026-08-04T00:00:00Z"));
  assert.deepEqual([...ids].sort(), ["s1", "s3"]);
});

test("the fare sweep counts rather than reads, one aggregation per sector", async () => {
  // Guards the cost decision: scanning agent_fares for distinct sector ids would
  // bill a read per future fare on a public endpoint.
  const calls = [];
  await findSectorsWithFares(fakeDb({ s1: 1 }, calls), SECTORS, new Date());
  assert.deepEqual(calls, ["s1", "s2", "s3"]);
});

test("the cache serves a second call without re-querying, and expires", async () => {
  const calls = [];
  const db = fakeDb({ s1: 1 }, calls);
  const sectorsWithFares = createSectorsWithFaresCache(db, 50);

  await sectorsWithFares(SECTORS);
  await sectorsWithFares(SECTORS);
  assert.equal(calls.length, 3, "second call should have been served from cache");

  await new Promise((resolve) => setTimeout(resolve, 60));
  await sectorsWithFares(SECTORS);
  assert.equal(calls.length, 6, "an expired cache should re-query");
});
