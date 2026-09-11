const test = require("node:test");
const assert = require("node:assert/strict");

const {
  fareIdentityKey,
  fareCoverageKey,
  planSupersede,
  planAbsenceSoldOut,
  priorFinalRates,
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

test("planSupersede takes already-hidden rows too", () => {
  // A hidden row is still a quote for the flight this upload just re-priced,
  // and nothing collects hidden rows any more — skipping one would strand it in
  // the collection forever. The replacement is written visible either way, so
  // this changes nothing an admin can see.
  const existing = [fare({ id: "old", isHidden: true })];
  assert.deepEqual(planSupersede([fare()], existing), ["old"]);
});

// ── priorFinalRates ─────────────────────────────────────────────────────────
//
// Deleting the replaced row costs the older sibling that annotateFarePriceDrops
// read a re-upload drop from. This is what carries the price forward instead.

test("priorFinalRates reports the lowest stored price per flight", () => {
  // Every projection dedupes a group by minimum price, so the lowest row is
  // what the public site was actually showing — that is the "before" price.
  const rates = priorFinalRates([
    fare({ id: "a", finalRate: 48000 }),
    fare({ id: "b", finalRate: 44000 }),
    fare({ id: "c", finalRate: 46000 }),
  ]);
  assert.equal(rates.get(fareIdentityKey(fare())), 44000);
});

test("priorFinalRates keys by flight, not by supplier's whole book", () => {
  const rates = priorFinalRates([
    fare({ id: "a", finalRate: 44000 }),
    fare({ id: "b", airlineId: "IX", finalRate: 39000 }),
  ]);
  assert.equal(rates.get(fareIdentityKey(fare())), 44000);
  assert.equal(rates.get(fareIdentityKey(fare({ airlineId: "IX" }))), 39000);
});

test("priorFinalRates counts a hidden row's price", () => {
  // It is about to be deleted with the rest of the group either way, and it
  // priced this flight — leaving it out would understate the drop.
  const rates = priorFinalRates([fare({ id: "a", finalRate: 44000, isHidden: true })]);
  assert.equal(rates.get(fareIdentityKey(fare())), 44000);
});

test("priorFinalRates ignores rows it cannot price or place", () => {
  assert.equal(priorFinalRates([fare({ finalRate: 0 })]).size, 0);
  assert.equal(priorFinalRates([fare({ finalRate: "" })]).size, 0);
  assert.equal(priorFinalRates([fare({ finalRate: -100 })]).size, 0);
  assert.equal(priorFinalRates([fare({ agentId: "" , finalRate: 44000 })]).size, 0);
  assert.equal(priorFinalRates(null).size, 0);
});

test("a re-upload price drop survives the replaced row being deleted", () => {
  // The regression this pairs with: the old row used to prove the drop by
  // existing. Now the new row carries it, and the SAME branch of
  // annotateFarePriceDrops — the one that reads previousFinalRate off one
  // document — reports it.
  const existing = [fare({ id: "old", finalRate: 48000 })];
  const incoming = fare({ id: "new", finalRate: 44000 });

  assert.deepEqual(planSupersede([incoming], existing), ["old"], "the old row goes");
  const before = priorFinalRates(existing).get(fareIdentityKey(incoming));
  assert.equal(before, 48000);
  assert.ok(incoming.finalRate < before, "so ingest stamps previousFinalRate");
  assert.equal(before - incoming.finalRate, 4000, "and the badge reads ₹4,000 off");
});

test("a price RISE stamps nothing", () => {
  // Only a drop was ever badged, so only a drop is carried forward.
  const existing = [fare({ id: "old", finalRate: 44000 })];
  const incoming = fare({ id: "new", finalRate: 48000 });
  const before = priorFinalRates(existing).get(fareIdentityKey(incoming));
  assert.ok(incoming.finalRate >= before, "no drop, nothing to stamp");
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

  // Supersede deletes the original, so the projection never sees it.
  const replaced = planSupersede([revised], [original]);
  assert.deepEqual(replaced, ["old"]);
  const visible = [original, revised].filter((f) => !replaced.includes(f.id));

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


// ── absence as a sold-out signal ────────────────────────────────────────────
//
// The case the exact-match half cannot see: a supplier sends tomorrow's list,
// and a flight that was on yesterday's is simply gone from it. No "SOLD OUT"
// message is ever sent — the omission IS the message.
//
// Every id this half returns is a document index.js DELETES, where a supersede
// only hides. There is no un-hide to undo a wrong call, so the guards below are
// not tidiness — they are the whole safety story.

const NOW = new Date("2026-09-09T09:00:00Z");
const YESTERDAY = new Date("2026-09-08T09:05:00Z");
const MINUTES_AGO = new Date("2026-09-09T08:52:00Z");

/** A stored row, dated — the absence sweep refuses to judge an undated one. */
function stored(overrides = {}) {
  return fare({ createdAt: YESTERDAY, ...overrides });
}

/**
 * A sheet big enough to clear the minRows guard, on sectors that are
 * deliberately NOT the one under test, so it contributes coverage for itself
 * and nothing else.
 */
function padding(count = 6, overrides = {}) {
  return Array.from({ length: count }, (_, i) => fare({
    id: `pad${i}`,
    sectorId: `PAD-${i}`,
    ...overrides,
  }));
}

const sweep = (incoming, existing, opts = {}) =>
  planAbsenceSoldOut(incoming, existing, { now: NOW, ...opts });

// ── fareCoverageKey ─────────────────────────────────────────────────────────

test("fareCoverageKey groups a route and date, ignoring airline and time", () => {
  const base = fareCoverageKey(fare());
  assert.equal(fareCoverageKey(fare({ airlineId: "IX" })), base);
  assert.equal(fareCoverageKey(fare({ flightTime: "08:00" })), base);
  assert.equal(fareCoverageKey(fare({ specialRate: 1 })), base);
});

test("fareCoverageKey separates supplier, route and date", () => {
  const base = fareCoverageKey(fare());
  assert.notEqual(fareCoverageKey(fare({ agentId: "airguide" })), base);
  assert.notEqual(fareCoverageKey(fare({ sectorId: "CCJ-DXB" })), base);
  assert.notEqual(fareCoverageKey(fare({ flightDate: SEP_12 })), base);
});

test("fareCoverageKey refuses a row it cannot place", () => {
  assert.equal(fareCoverageKey(fare({ agentId: "" })), null);
  assert.equal(fareCoverageKey(fare({ sectorId: "  " })), null);
  assert.equal(fareCoverageKey(fare({ flightDate: null })), null);
  assert.equal(fareCoverageKey(null), null);
});

// ── the behaviour being added ───────────────────────────────────────────────

test("a flight dropped from today's sheet is sold out", () => {
  // Yesterday the supplier sold this route on two carriers. Today's list
  // re-quotes the IX and says nothing about the G9 — that is the sold-out.
  const existing = [
    stored({ id: "ix", airlineId: "IX", flightTime: "20:15" }),
    stored({ id: "g9", airlineId: "G9", flightTime: "11:30" }),
  ];
  const incoming = [
    fare({ airlineId: "IX", flightTime: "20:15", specialRate: 46700 }),
    ...padding(5),
  ];
  assert.deepEqual(sweep(incoming, existing), ["g9"]);
});

test("the re-quoted flight is left to planSupersede, not swept twice", () => {
  const existing = [
    stored({ id: "ix", airlineId: "IX", flightTime: "20:15" }),
    stored({ id: "g9", airlineId: "G9", flightTime: "11:30" }),
  ];
  const incoming = [
    fare({ airlineId: "IX", flightTime: "20:15", specialRate: 46700 }),
    ...padding(5),
  ];
  const replaced = planSupersede(incoming, existing);
  const absent = sweep(incoming, existing);
  assert.deepEqual(replaced, ["ix"], "the revision is a supersede");
  assert.deepEqual(absent, ["g9"], "the omission is a sold-out");
  assert.equal(replaced.filter((id) => absent.includes(id)).length, 0, "disjoint");
});

// ── guard 1: coverage ───────────────────────────────────────────────────────

test("a route the sheet never mentions is never touched", () => {
  // A CCJ-DXB-only sheet is not a statement about CCJ-JED.
  const existing = [stored({ id: "other", sectorId: "CCJ-JED" })];
  assert.deepEqual(sweep([...padding(6, { sectorId: "CCJ-DXB" })], existing), []);
});

test("a date the sheet never mentions is never touched", () => {
  const existing = [stored({ id: "later", flightDate: SEP_12 })];
  assert.deepEqual(sweep(padding(6, { sectorId: fare().sectorId }), existing), []);
});

test("absence never crosses suppliers", () => {
  // One supplier's complete list must not delist a competitor's quote on the
  // same route and date — the same rule agentId enforces in fareIdentityKey.
  const existing = [stored({ id: "theirs", agentId: "airguide" })];
  assert.deepEqual(sweep(padding(6, { sectorId: fare().sectorId }), existing), []);
});

// ── guard 2: minRows ────────────────────────────────────────────────────────

test("a one-line correction sells nothing out", () => {
  // "CCJ DXB IX 46700" at 20:00 is one price, not a claim that the G9 is gone.
  const existing = [stored({ id: "g9", airlineId: "G9", flightTime: "11:30" })];
  const correction = [fare({ airlineId: "IX", specialRate: 46700 })];
  assert.deepEqual(sweep(correction, existing), []);
});

test("minRows is the line between a correction and a list", () => {
  const existing = [stored({ id: "g9", airlineId: "G9", flightTime: "11:30" })];
  const five = [fare({ airlineId: "IX" }), ...padding(4)];
  assert.deepEqual(sweep(five, existing), [], "five rows is still a correction");
  assert.deepEqual(sweep([...five, fare({ id: "pad9", sectorId: "PAD-9" })], existing), ["g9"]);
  // And a supplier who sends genuinely large partial sheets can raise the bar.
  assert.deepEqual(sweep([...five, fare({ id: "pad9", sectorId: "PAD-9" })], existing, { minRows: 20 }), []);
});

// ── guard 3: minAge ─────────────────────────────────────────────────────────

test("a sibling batch from the same session is protected", () => {
  // Intake splits one sheet into batches on a 90s quiet window. Batch 1 must
  // not delist what batch 2 wrote three minutes ago — that is flapping, and it
  // would take a live fare off sale for no reason at all.
  const existing = [stored({ id: "g9", airlineId: "G9", flightTime: "11:30", createdAt: MINUTES_AGO })];
  const incoming = [fare({ airlineId: "IX" }), ...padding(5)];
  assert.deepEqual(sweep(incoming, existing), []);
});

test("yesterday's row is old enough to sweep, this morning's is not", () => {
  const incoming = [fare({ airlineId: "IX" }), ...padding(5)];
  const old = [stored({ id: "g9", airlineId: "G9", createdAt: YESTERDAY })];
  const fresh = [stored({ id: "g9", airlineId: "G9", createdAt: new Date("2026-09-09T05:00:00Z") })];
  assert.deepEqual(sweep(incoming, old), ["g9"]);
  assert.deepEqual(sweep(incoming, fresh), [], "four hours old is the same session");
  // A supplier who revises late into the evening can be given a wider window.
  assert.deepEqual(sweep(incoming, old, { minAgeMs: 48 * 60 * 60 * 1000 }), []);
});

test("a row that cannot be dated is protected, not swept", () => {
  // Fails closed, for the reason stated throughout this file: a missed
  // sold-out leaves a row an admin can see; an over-eager sweep silently
  // removes a fare that was still for sale.
  const incoming = [fare({ airlineId: "IX" }), ...padding(5)];
  for (const createdAt of [undefined, null, "", "not a date", NaN]) {
    assert.deepEqual(sweep(incoming, [stored({ id: "g9", airlineId: "G9", createdAt })]), [],
      `createdAt=${String(createdAt)}`);
  }
});

test("createdAt is read from a Firestore Timestamp as well as a Date", () => {
  const incoming = [fare({ airlineId: "IX" }), ...padding(5)];
  const existing = [stored({ id: "g9", airlineId: "G9", createdAt: timestamp(YESTERDAY) })];
  assert.deepEqual(sweep(incoming, existing), ["g9"]);
});

// ── the rest of the contract ────────────────────────────────────────────────

test("an already-hidden row is swept too", () => {
  // Whoever hid it was saying "not for sale"; the new sheet says the flight is
  // gone. Leaving it behind kept a dead row that an un-hide could put back on
  // sale, so it goes with the rest.
  const existing = [stored({ id: "g9", airlineId: "G9", isHidden: true })];
  assert.deepEqual(sweep([fare({ airlineId: "IX" }), ...padding(5)], existing), ["g9"]);
});

test("a hidden row the sheet re-quotes is left to planSupersede", () => {
  // Hidden but still sold — the flight is on the new sheet. That is a revision,
  // not an absence, and the sweep must not reach into the other half's group.
  const existing = [stored({ id: "ix", airlineId: "IX", flightTime: "20:15", isHidden: true })];
  const incoming = [fare({ airlineId: "IX", flightTime: "20:15", specialRate: 46700 }), ...padding(5)];
  assert.deepEqual(sweep(incoming, existing), []);
});

test("a sold-out line inside a sheet still covers its own route", () => {
  // n8n turns "CCJ DXB 10 SEP SOLD OUT" inside a sheet into show:"no", which
  // reaches ingest as a hidden row. It is a statement about that route, so it
  // establishes coverage — and every other carrier on it that the sheet did
  // not restate goes too.
  const existing = [stored({ id: "g9", airlineId: "G9", flightTime: "11:30" })];
  const incoming = [fare({ airlineId: "IX", isHidden: true }), ...padding(5)];
  assert.deepEqual(sweep(incoming, existing), ["g9"]);
});

test("each id is returned once even if the sheet repeats a route", () => {
  const existing = [stored({ id: "g9", airlineId: "G9" })];
  const incoming = [fare({ airlineId: "IX" }), fare({ airlineId: "IX" }), ...padding(5)];
  assert.deepEqual(sweep(incoming, existing), ["g9"]);
});

test("absence is a no-op on empty or unusable input", () => {
  assert.deepEqual(sweep([], [stored()]), []);
  assert.deepEqual(sweep(padding(6), []), []);
  assert.deepEqual(sweep(null, null), []);
  // Six rows that cannot be placed give no coverage, so nothing is swept.
  assert.deepEqual(sweep(padding(6, { sectorId: "" }), [stored({ id: "g9", airlineId: "G9" })]), []);
});

// ── the regression this exists for ──────────────────────────────────────────

test("a sold-out flight stops being bookable once it drops off the sheet", () => {
  const agent = { markupOverride: 0 };
  const config = { defaultMarkup: 0 };

  // Yesterday: the cheap G9 and the pricier IX, both on sale.
  const g9 = stored({ id: "g9", airlineId: "G9", flightTime: "11:30", specialRate: 39000 });
  const ix = stored({ id: "ix", airlineId: "IX", flightTime: "20:15", specialRate: 46000 });

  // Today's list re-quotes only the IX. The G9 sold out and was never announced.
  const incoming = [fare({ airlineId: "IX", flightTime: "20:15", specialRate: 46700 }), ...padding(5)];

  const before = computeB2BFares([g9, ix], agent, config);
  assert.equal(before.length, 2);
  assert.equal(before[0].price, 39000, "the bug: the sold-out G9 is the headline price");

  const replaced = new Set(planSupersede(incoming, [g9, ix]));
  const deleted = new Set(sweep(incoming, [g9, ix]));
  assert.deepEqual([...replaced], ["ix"], "the re-quoted flight is superseded");
  assert.deepEqual([...deleted], ["g9"], "the dropped flight is swept");

  // Applied the way ingest applies them: both passes delete, so neither row is
  // in the collection afterwards. This is the assertion that would catch either
  // one regressing to a hide.
  //
  // Only the route under test reaches the projection; the padding rows exist
  // solely to make this upload a list rather than a correction.
  const live = [g9, ix, ...incoming]
    .filter((f) => f.sectorId === fare().sectorId)
    .filter((f) => !deleted.has(f.id) && !replaced.has(f.id));
  const after = computeB2BFares(live, agent, config);
  assert.equal(after.length, 1, "only the flight still on the sheet survives");
  assert.equal(after[0].price, 46700, "at today's price");
});
