"use strict";

// Exercises the `fetchAndFormat` Code node inside
// n8n/book4air-live-data.workflow.json against a mocked eapi.book4air.com —
// the only thing standing between that supplier's API and agent_fares, same
// role zamra-rates.workflow.json plays for portal uploads. Unlike that
// workflow's Code nodes, this one makes its own HTTP calls
// (`this.helpers.httpRequest`) rather than transforming input items, so the
// harness mocks that call instead of stubbing `$json`/`$`.

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const workflow = require(path.join(__dirname, "..", "..", "n8n", "book4air-live-data.workflow.json"));

const jsCode = (() => {
  const node = workflow.nodes.find((n) => n.name === "fetchAndFormat");
  assert.ok(node, "workflow has no node named \"fetchAndFormat\"");
  return node.parameters.jsCode;
})();

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

/** Runs the Code node body with `this.helpers.httpRequest` mocked. */
function runNode(mockHttpRequest) {
  const runner = new AsyncFunction(jsCode);
  return runner.call({ helpers: { httpRequest: mockHttpRequest } });
}

const AUTH_RESPONSE = { token: "Bearer test-token" };

function datesResponse(rows) {
  return { success: true, data: { data: rows } };
}

function searchResponse(flight) {
  return { success: true, data: { search: flight ? [flight] : [] } };
}

const CCJ_DXB_FLIGHT = {
  airline: "SG",
  deparTime: "18:40",
  arrTime: "21:10",
  checkInWeight: "30",
  cabinWeight: "7",
};

test("fetchAndFormat builds one row per date, carrying the sector's flight metadata", async () => {
  const calls = [];
  const result = await runNode(async (opts) => {
    calls.push(opts);
    if (opts.url.endsWith("/api/Authenticate")) return AUTH_RESPONSE;
    if (opts.url.endsWith("/available-dates-with-deatils")) {
      if (opts.body.origin === "CCJ") {
        return datesResponse([
          { availableDate: "2026-10-01", availableSeats: 5, price: 16000 },
          { availableDate: "2026-10-02", availableSeats: 0, price: 16500 },
        ]);
      }
      return datesResponse([]); // every other sector has no inventory in this test
    }
    if (opts.url.endsWith("/api/Sector/search")) {
      return searchResponse(opts.body.origin === "CCJ" ? CCJ_DXB_FLIGHT : null);
    }
    throw new Error("unexpected call to " + opts.url);
  });

  const rows = result[0].json.firebaseData;
  assert.deepEqual(rows, [
    {
      agent_id: "24",
      sector_code: "CCJ DXB",
      flight_code: "SG",
      date: "2026-10-01",
      time_start: "18:40",
      time_end: "21:10",
      baggage: "30",
      extra_baggage: "7",
      sp_rate: 16000,
      show: "yes",
    },
    {
      agent_id: "24",
      sector_code: "CCJ DXB",
      flight_code: "SG",
      date: "2026-10-02",
      time_start: "18:40",
      time_end: "21:10",
      baggage: "30",
      extra_baggage: "7",
      sp_rate: 16500,
      show: "no", // availableSeats: 0
    },
  ]);

  // Authenticate once, then dates+search for every one of the 4 sectors.
  assert.equal(calls.filter((c) => c.url.endsWith("/api/Authenticate")).length, 1);
  assert.equal(calls.filter((c) => c.url.endsWith("/available-dates-with-deatils")).length, 4);

  // commission/rate are never asserted here — ingestFaresFromN8n must derive
  // them from agents.commission, same contract as every other ingest path.
  for (const row of rows) {
    assert.equal("commission" in row, false);
    assert.equal("rate" in row, false);
  }
});

test("fetchAndFormat skips a sector with no available dates without calling search", async () => {
  const searchCalls = [];
  const result = await runNode(async (opts) => {
    if (opts.url.endsWith("/api/Authenticate")) return AUTH_RESPONSE;
    if (opts.url.endsWith("/available-dates-with-deatils")) return datesResponse([]);
    if (opts.url.endsWith("/api/Sector/search")) {
      searchCalls.push(opts);
      return searchResponse(null);
    }
    throw new Error("unexpected call to " + opts.url);
  });

  assert.deepEqual(result[0].json.firebaseData, []);
  assert.equal(searchCalls.length, 0);
});

test("fetchAndFormat skips a sector whose search call returns no bookable flight", async () => {
  const result = await runNode(async (opts) => {
    if (opts.url.endsWith("/api/Authenticate")) return AUTH_RESPONSE;
    if (opts.url.endsWith("/available-dates-with-deatils")) {
      return datesResponse([{ availableDate: "2026-10-01", availableSeats: 5, price: 16000 }]);
    }
    if (opts.url.endsWith("/api/Sector/search")) return searchResponse(null);
    throw new Error("unexpected call to " + opts.url);
  });

  assert.deepEqual(result[0].json.firebaseData, []);
});

test("fetchAndFormat throws when authentication returns no token", async () => {
  await assert.rejects(
    runNode(async () => ({ success: false })),
    /did not return a token/,
  );
});
