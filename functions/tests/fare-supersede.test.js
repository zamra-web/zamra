const test = require("node:test");
const assert = require("node:assert/strict");

const {
  fareIdentityKey,
  planSupersede,
  supersedeDateRange,
  flightDateMs,
} = require("../fareSupersede");
const { computeB2BFares } = require("../b2b");

const SEP_10 = new Date("2026-09-10T00:00:00Z");
const SEP_12 = new Date("2026-09-12T00:00:00Z");

/** A stored agent_fares document, in the shape Firestore hands back. */
function fare(overrides = {}) {
  return {
    id: "doc1",
    agentId: "glansa",
    sectorId: "COK-RUH-LHR",
    airlineId: "SV",
    flightDate: SEP_10,
    flightTime: "20:15",
    specialRate: 44000,
    commission: 500,
    isHidden: false,
    ...overrides,
  };
}

/** Firestore returns Timestamps, not Dates. */
function timestamp(date) {
  return { toDate: () => date };
}

// ── fareIdentityKey ─────────────────────────────────────────────────────────

test("fareIdentityKey matches the tuple the dedupes key on", () => {
  // If this drifts from computeB2BFares/dedupeAndSortFares, superseding either
  // hides a row they consider a separate flight or fails to find its target.
  assert.equal(fareIdentityKey(fare()), fareIdentityKey(fare({ id: "other" })));
  // Price is not part of identity — a revision is the same flight, cheaper or
  // dearer, and that is the whole point.
  assert.equal(fareIdentityKey(fare()), fareIdentityKey(fare({ specialRate: 48000 })));
});

test("fareIdentityKey separates every field that makes a different flight", () => {
  const base = fareIdentityKey(fare());
  for (const differing of [
    { agentId: "airguide" },
    { sectorId: "COK-RUH" },
    { airlineId: "IX" },
    { flightDate: SEP_12 },
    { flightTime: "10:00" },
  ]) {
    assert.notEqual(fareIdentityKey(fare(differing)), base, JSON.stringify(differing));
  }
});

test("fareIdentityKey reads a Timestamp, a Date and an ISO string alike", () => {
  // The ingest path builds a Timestamp, Firestore returns one, and the tests
  // pass Dates. Comparing these as strings would make a Timestamp never match
  // its own Date, and nothing would ever supersede.
  const asDate = fareIdentityKey(fare({ flightDate: SEP_10 }));
  assert.equal(fareIdentityKey(fare({ flightDate: timestamp(SEP_10) })), asDate);
  assert.equal(fareIdentityKey(fare({ flightDate: "2026-09-10T00:00:00Z" })), asDate);
  assert.equal(fareIdentityKey(fare({ flightDate: SEP_10.getTime() })), asDate);
});

test("fareIdentityKey refuses a row it cannot identify", () => {
  // Fails closed: no key means no supersede, which leaves a duplicate rather
  // than guessing and delisting a fare that is still for sale.
  assert.equal(fareIdentityKey(fare({ agentId: "" })), null);
  assert.equal(fareIdentityKey(fare({ sectorId: "  " })), null);
  assert.equal(fareIdentityKey(fare({ airlineId: undefined })), null);
  assert.equal(fareIdentityKey(fare({ flightDate: null })), null);
  assert.equal(fareIdentityKey(fare({ flightDate: "not a date" })), null);
  assert.equal(fareIdentityKey(null), null);
});

test("an empty flightTime is its own identity, not a wildcard", () => {
  assert.notEqual(fareIdentityKey(fare({ flightTime: "" })), fareIdentityKey(fare()));
});

// ── planSupersede ───────────────────────────────────────────────────────────

test("planSupersede replaces the prior quote for the same flight", () => {
  const incoming = [fare({ specialRate: 48000 })];
  const existing = [fare({ id: "old", specialRate: 44000 })];
  assert.deepEqual(planSupersede(incoming, existing), ["old"]);
});

test("planSupersede never touches another supplier's fares", () => {
  // The property that matters most. Without agentId in the key, one supplier's
  // morning sheet would delist every competitor quoting the same flight.
  const incoming = [fare({ agentId: "glansa" })];
  const existing = [
    fare({ id: "rival", agentId: "airguide" }),
    fare({ id: "mine", agentId: "glansa" }),
  ];
  assert.deepEqual(planSupersede(incoming, existing), ["mine"]);
});

test("planSupersede keeps a different departure time alive", () => {
  // Travel Wallet prints MRNG and EVENING blocks for one sector. Revising the
  // evening price must not delist the morning flight.
  const incoming = [fare({ flightTime: "18:15" })];
  const existing = [
    fare({ id: "morning", flightTime: "10:00" }),
    fare({ id: "evening", flightTime: "18:15" }),
  ];
  assert.deepEqual(planSupersede(incoming, existing), ["evening"]);
});

test("planSupersede leaves already-hidden rows alone", () => {
  // Re-hiding burns a write and churns updatedAt, and the row may have been
  // hidden by an admin for a reason of their own.
  const existing = [fare({ id: "old", isHidden: true })];
  assert.deepEqual(planSupersede([fare()], existing), []);
});

test("planSupersede returns each id once even if the sheet repeats a flight", () => {
  const incoming = [fare({ specialRate: 48000 }), fare({ specialRate: 47000 })];
  assert.deepEqual(planSupersede(incoming, [fare({ id: "old" })]), ["old"]);
});

test("planSupersede is a no-op on empty or unidentifiable input", () => {
  assert.deepEqual(planSupersede([], [fare()]), []);
  assert.deepEqual(planSupersede([fare()], []), []);
  assert.deepEqual(planSupersede([fare({ agentId: "" })], [fare()]), []);
  assert.deepEqual(planSupersede(null, null), []);
});

// ── supersedeDateRange ──────────────────────────────────────────────────────

test("supersedeDateRange bounds the lookup to the dates actually quoted", () => {
  const range = supersedeDateRange([
    fare({ flightDate: SEP_12 }),
    fare({ flightDate: SEP_10 }),
    fare({ flightDate: "nonsense" }),
  ]);
  assert.equal(range.min.getTime(), SEP_10.getTime());
  assert.equal(range.max.getTime(), SEP_12.getTime());
});

test("supersedeDateRange returns null when nothing is dateable", () => {
  assert.equal(supersedeDateRange([]), null);
  assert.equal(supersedeDateRange([fare({ flightDate: null })]), null);
});

test("flightDateMs rejects the values that would silently become epoch 0", () => {
  assert.equal(flightDateMs(""), null);
  assert.equal(flightDateMs(undefined), null);
  assert.equal(flightDateMs(NaN), null);
  assert.equal(flightDateMs(new Date("nope")), null);
});

// ── the regression this exists for ──────────────────────────────────────────

test("an upward revision now reaches the customer instead of the stale price", () => {
  // Glansa sent four *REVISED FARE* messages in five on one morning, twice for
  // the same sector. Ingest appends and computeB2BFares keeps the MINIMUM
  // price, so before supersede the superseded cheaper row won forever.
  const agent = { markupOverride: 0 };
  const config = { defaultMarkup: 0 };

  const original = fare({ id: "old", specialRate: 44000 });
  const revised = fare({ id: "new", specialRate: 48000 });

  const withoutSupersede = computeB2BFares([original, revised], agent, config);
  assert.equal(withoutSupersede.length, 1);
  assert.equal(withoutSupersede[0].price, 44000, "the bug: cheapest wins, not newest");

  // Supersede hides the original, so the projection never sees it.
  assert.deepEqual(planSupersede([revised], [original]), ["old"]);
  const hidden = { ...original, isHidden: true };
  const visible = [hidden, revised].filter((f) => !f.isHidden);

  const withSupersede = computeB2BFares(visible, agent, config);
  assert.equal(withSupersede.length, 1);
  assert.equal(withSupersede[0].price, 48000, "the fix: the live price is quoted");
});

test("a downward revision still wins, as it always did", () => {
  const agent = { markupOverride: 0 };
  const config = { defaultMarkup: 0 };
  const original = fare({ id: "old", specialRate: 48000 });
  const revised = fare({ id: "new", specialRate: 44000 });

  assert.deepEqual(planSupersede([revised], [original]), ["old"]);
  const priced = computeB2BFares([revised], agent, config);
  assert.equal(priced[0].price, 44000);
});
