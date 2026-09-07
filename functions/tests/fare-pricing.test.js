"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { roundToNearestThousand } = require("../farePricing");

test("roundToNearestThousand rounds up when closer to the next thousand", () => {
  assert.equal(roundToNearestThousand(8999), 9000);
});

test("roundToNearestThousand rounds down when closer to the prior thousand", () => {
  assert.equal(roundToNearestThousand(10001), 10000);
});

test("roundToNearestThousand leaves an exact multiple untouched", () => {
  assert.equal(roundToNearestThousand(15000), 15000);
});

test("roundToNearestThousand rounds a .5 remainder up", () => {
  assert.equal(roundToNearestThousand(8500), 9000);
});

test("roundToNearestThousand treats non-finite input as zero", () => {
  assert.equal(roundToNearestThousand(undefined), 0);
  assert.equal(roundToNearestThousand(NaN), 0);
  assert.equal(roundToNearestThousand("not a number"), 0);
});
