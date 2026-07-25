const test = require("node:test");
const assert = require("node:assert/strict");

// CommonJS mirror of web/src/js/shared/deal-links.js.
// web/tests/deal-links.test.js asserts the same behaviour against the ESM copy
// — update both when a rule changes.
const {
  normalizeDealSlug,
  resolveDealWindow,
  chunkSectorIds,
  FIRESTORE_IN_LIMIT,
} = require("../dealLinks");

test("slugs are lowercased and punctuation collapses to single hyphens", () => {
  assert.equal(normalizeDealSlug("All Saudi Offers"), "all-saudi-offers");
  assert.equal(normalizeDealSlug("  Calicut → Jeddah!!  "), "calicut-jeddah");
  assert.equal(normalizeDealSlug("UAE___Deals"), "uae-deals");
});

test("slugs too short to be useful are rejected", () => {
  assert.equal(normalizeDealSlug("ab"), "");
  assert.equal(normalizeDealSlug("!!"), "");
  assert.equal(normalizeDealSlug(""), "");
  assert.equal(normalizeDealSlug(null), "");
  assert.equal(normalizeDealSlug(undefined), "");
});

test("slugs are capped and never end on a hyphen", () => {
  assert.equal(normalizeDealSlug("a".repeat(80)).length, 48);
  assert.ok(!normalizeDealSlug(`${"b".repeat(47)} tail`).endsWith("-"));
});

test("a rolling window re-anchors to today on every request", () => {
  const now = new Date("2026-08-01T09:30:00");
  const { startDate, endDate } = resolveDealWindow({ windowMode: "rolling", rollingDays: 30 }, now);

  assert.equal(startDate.getDate(), 1);
  assert.equal(startDate.getHours(), 0);
  assert.equal(endDate.getDate(), 31);
  assert.equal(endDate.getHours(), 23);
});

test("rolling defaults to 30 days when unset or nonsense", () => {
  const now = new Date("2026-08-01T00:00:00");
  const days = (link) => {
    const window = resolveDealWindow(link, now);
    return Math.floor((window.endDate - window.startDate) / 86400000);
  };

  assert.equal(days({}), 30);
  assert.equal(days({ rollingDays: 0 }), 30);
  assert.equal(days({ rollingDays: "soon" }), 30);
  assert.equal(days({ rollingDays: 7 }), 7);
});

test("a fixed window is passed through, spanning whole days", () => {
  const { startDate, endDate } = resolveDealWindow({
    windowMode: "fixed",
    startDate: new Date("2026-09-10T14:00:00"),
    endDate: new Date("2026-09-20T08:00:00"),
  }, new Date("2026-08-01T00:00:00"));

  assert.equal(startDate.getDate(), 10);
  assert.equal(startDate.getHours(), 0);
  assert.equal(endDate.getDate(), 20);
  assert.equal(endDate.getHours(), 23);
});

test("a fixed window missing its dates falls back to rolling", () => {
  const now = new Date("2026-08-01T00:00:00");
  assert.equal(resolveDealWindow({ windowMode: "fixed", startDate: null }, now).startDate.getDate(), 1);
});

test("a Firestore Timestamp is accepted for fixed window dates", () => {
  const { startDate } = resolveDealWindow({
    windowMode: "fixed",
    startDate: { toDate: () => new Date("2026-09-10T00:00:00") },
    endDate: { toDate: () => new Date("2026-09-20T00:00:00") },
  }, new Date("2026-08-01T00:00:00"));

  assert.equal(startDate.getDate(), 10);
});

test("sector ids chunk at the Firestore `in` limit", () => {
  const ids = Array.from({ length: 30 }, (_, i) => `sec-${i}`);
  assert.equal(chunkSectorIds(ids).length, 1);

  const chunks = chunkSectorIds(Array.from({ length: 31 }, (_, i) => `sec-${i}`));
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, FIRESTORE_IN_LIMIT);
  assert.equal(chunks[1].length, 1);
});

test("chunking dedupes and drops blanks", () => {
  assert.deepEqual(chunkSectorIds(["a", "a", " b ", "", null, "c"]), [["a", "b", "c"]]);
  assert.deepEqual(chunkSectorIds([]), []);
  assert.deepEqual(chunkSectorIds(null), []);
});

test("a chunk size can never exceed the Firestore limit", () => {
  const ids = Array.from({ length: 40 }, (_, i) => `sec-${i}`);
  assert.equal(chunkSectorIds(ids, 100)[0].length, FIRESTORE_IN_LIMIT);
});
