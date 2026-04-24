const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildSequentialSectorSortUpdates,
  planSectorSortOrderBackfill,
  resolveSectorDisplayOrder,
} = require("../sectorOrdering");

test("resolveSectorDisplayOrder keeps valid sortOrder values before legacy fallback entries", () => {
  const ordered = resolveSectorDisplayOrder([
    { id: "b", sectorCode: "DXB COK" },
    { id: "7", sectorCode: "CCJ JED", sortOrder: 2 },
    { id: "3", sectorCode: "CCJ RUH" },
    { id: "8", sectorCode: "CCJ DMM", sortOrder: 1 },
  ]);

  assert.deepEqual(
    ordered.map((sector) => ({ id: sector.id, sortOrder: sector.sortOrder })),
    [
      { id: "8", sortOrder: 1 },
      { id: "7", sortOrder: 2 },
      { id: "3", sortOrder: 3 },
      { id: "b", sortOrder: 4 },
    ],
  );
});

test("planSectorSortOrderBackfill only fills missing sortOrder values without renumbering existing ones", () => {
  const updates = planSectorSortOrderBackfill([
    { id: "10", sectorCode: "CCJ JED", sortOrder: 4 },
    { id: "2", sectorCode: "CCJ RUH" },
    { id: "alpha", sectorCode: "COK DXB" },
    { id: "15", sectorCode: "CCJ DMM", sortOrder: 2 },
  ]);

  assert.deepEqual(updates, [
    { id: "2", sortOrder: 5, sectorCode: "CCJ RUH" },
    { id: "alpha", sortOrder: 6, sectorCode: "COK DXB" },
  ]);
});

test("buildSequentialSectorSortUpdates creates contiguous ordering starting at one", () => {
  assert.deepEqual(
    buildSequentialSectorSortUpdates(["sector-b", "sector-a", "sector-c"]),
    [
      { id: "sector-b", sortOrder: 1 },
      { id: "sector-a", sortOrder: 2 },
      { id: "sector-c", sortOrder: 3 },
    ],
  );
});
