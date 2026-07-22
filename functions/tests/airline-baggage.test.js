"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  STANDARD_AIRLINE_CODES,
  handBaggageKg,
  checkInBaggageOptions,
  defaultCheckInBaggageKg,
  resolveCheckInBaggageKg,
  hasVariableCheckInBaggage,
  formatBaggageKg,
  formatCheckInBaggageText,
  formatHandBaggageText,
  formatBaggageAllowanceShort,
  baggageSummary,
} = require("../airlineBaggage");

// Same table as web/tests/airline-baggage.test.js. These two suites are what
// catch the CommonJS mirror drifting from the ES module source.
const EXPECTED = {
  "IX": { checkIn: [30], hand: 7 },
  "6E": { checkIn: [30], hand: 7 },
  "G9": { checkIn: [30], hand: 10 },
  "XY": { checkIn: [30], hand: 7 },
  "WY": { checkIn: [30], hand: 7 },
  "OV": { checkIn: [20, 40], hand: 5 },
  "AI": { checkIn: [30], hand: 7 },
  "SV": { checkIn: [20, 30, 40], hand: 7 },
  "QP": { checkIn: [30], hand: 7 },
  "FZ": { checkIn: [30], hand: 7 },
  "J9": { checkIn: [30], hand: 7 },
  "SG": { checkIn: [30], hand: 7 },
};

test("every standard airline code matches the agreed baggage table", () => {
  assert.deepEqual(STANDARD_AIRLINE_CODES, Object.keys(EXPECTED));
  for (const [code, expected] of Object.entries(EXPECTED)) {
    assert.equal(handBaggageKg(code), expected.hand, `hand baggage for ${code}`);
    assert.deepEqual(checkInBaggageOptions(code), expected.checkIn, `check-in baggage for ${code}`);
  }
});

test("unknown or missing airline codes fall back to the defaults", () => {
  for (const code of ["ZZ", "", null, undefined]) {
    assert.equal(handBaggageKg(code), 7);
    assert.deepEqual(checkInBaggageOptions(code), [30]);
  }
});

test("the default check-in weight is 30 kg wherever the airline allows it", () => {
  assert.equal(defaultCheckInBaggageKg("IX"), 30);
  assert.equal(defaultCheckInBaggageKg("SV"), 30);
  assert.equal(defaultCheckInBaggageKg("OV"), 20);
});

test("resolveCheckInBaggageKg keeps allowed weights and snaps the rest", () => {
  assert.equal(resolveCheckInBaggageKg("OV", 40), 40);
  assert.equal(resolveCheckInBaggageKg("OV", "20kg"), 20);
  assert.equal(resolveCheckInBaggageKg("OV", 30), 20);
  assert.equal(resolveCheckInBaggageKg("SV", 25), 30);
  assert.equal(resolveCheckInBaggageKg("IX", 45), 30);
  assert.equal(resolveCheckInBaggageKg("IX", ""), 30);
});

test("only OV and SV have a variable check-in allowance", () => {
  assert.deepEqual(STANDARD_AIRLINE_CODES.filter(hasVariableCheckInBaggage), ["OV", "SV"]);
});

test("baggageSummary renders one row per airline in table order", () => {
  const rows = baggageSummary();
  assert.equal(rows.length, STANDARD_AIRLINE_CODES.length);
  assert.deepEqual(rows[5], { code: "OV", checkInBaggage: [20, 40], handBaggage: 5 });
  assert.deepEqual(rows[7], { code: "SV", checkInBaggage: [20, 30, 40], handBaggage: 7 });
});

// The display helpers are mirrored too — same expectations as the ESM suite.
test("formatBaggageKg spells the unit one way and drops empty weights", () => {
  assert.equal(formatBaggageKg(30), "30 kg");
  assert.equal(formatBaggageKg("30kg"), "30 kg");
  assert.equal(formatBaggageKg(7.5), "7.5 kg");
  assert.equal(formatBaggageKg(0), "");
  assert.equal(formatBaggageKg(null), "");
});

test("baggage display text is labelled and consistently spelled", () => {
  assert.equal(formatCheckInBaggageText("IX", 30), "Check-in 30 kg");
  assert.equal(formatCheckInBaggageText("IX", 45), "Check-in 30 kg");
  assert.equal(formatCheckInBaggageText("SV", 40), "Check-in 40 kg");
  assert.equal(formatHandBaggageText("IX"), "Hand 7 kg");
  assert.equal(formatHandBaggageText("G9"), "Hand 10 kg");
  assert.equal(formatHandBaggageText("OV"), "Hand 5 kg");
});

test("formatBaggageAllowanceShort shares one trailing unit", () => {
  assert.equal(formatBaggageAllowanceShort("IX", 30), "30 + 7 kg");
  assert.equal(formatBaggageAllowanceShort("G9", 30), "30 + 10 kg");
  assert.equal(formatBaggageAllowanceShort("OV", 20), "20 + 5 kg");
});
