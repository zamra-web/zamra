"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  toDateKey,
  todayKeyIST,
  offerLastLiveDate,
  isOfferLive,
  sanitizeOffer,
  filterOffersForAgent,
} = require("../b2bOffers");

function offer(overrides) {
  return Object.assign({
    id: "o1",
    isActive: true,
    badge: "VERY LOW FARE",
    badgeTone: "hot",
    originCode: "CCJ",
    originCity: "Kozhikode",
    destCode: "JED",
    destCity: "Jeddah",
    airlineId: "air-1",
    airlineName: "Air India Express",
    airlineCode: "IX",
    travelDate: "2026-08-02",
    checkInBaggageKg: 30,
    order: 0,
  }, overrides);
}

test("toDateKey reads strings, Dates and Firestore Timestamps", () => {
  assert.equal(toDateKey("2026-08-02"), "2026-08-02");
  assert.equal(toDateKey("2026-08-02T18:30:00.000Z"), "2026-08-02");
  assert.equal(toDateKey({ toDate: () => new Date(Date.UTC(2026, 7, 2)) }), "2026-08-02");
  assert.equal(toDateKey(null), "");
  assert.equal(toDateKey("soon"), "");
});

test("todayKeyIST rolls over at Indian midnight", () => {
  assert.equal(todayKeyIST(new Date("2026-07-28T18:45:00Z")), "2026-07-29");
  assert.equal(todayKeyIST(new Date("2026-07-28T18:15:00Z")), "2026-07-28");
});

test("liveness matches the browser mirror in shared/b2b-offers.js", () => {
  const today = "2026-07-29";
  assert.equal(offerLastLiveDate({ travelDate: "2026-08-02", expiresAt: "2026-07-25" }), "2026-07-25");
  assert.equal(isOfferLive(offer({}), today), true);
  assert.equal(isOfferLive(offer({ travelDate: today }), today), true, "live on its final day");
  assert.equal(isOfferLive(offer({ travelDate: "2026-07-28" }), today), false);
  assert.equal(isOfferLive(offer({ isActive: false }), today), false);
  assert.equal(isOfferLive(offer({ expiresAt: "2026-07-20" }), today), false);
  assert.equal(isOfferLive({ isActive: true }, today), true, "no dates = evergreen");
});

test("sanitizeOffer emits only the allow-listed portal fields", () => {
  const clean = sanitizeOffer(offer({
    internalCost: 15000,
    supplierId: "supplier-9",
    notes: "bought from Mushtaq",
    originCode: " ccj ",
    price: "18500.6",
  }));

  assert.equal(clean.internalCost, undefined);
  assert.equal(clean.supplierId, undefined);
  assert.equal(clean.notes, undefined);
  assert.equal(clean.originCode, "CCJ");
  assert.equal(clean.price, 18501);
  assert.deepEqual(Object.keys(clean).sort(), [
    "airlineCode", "airlineId", "airlineName", "badge", "badgeTone",
    "checkInBaggageKg", "ctaLabel", "ctaType", "destCity", "destCode", "id",
    "order", "originCity", "originCode", "price", "priceNote", "travelDate",
  ]);
});

test("sanitizeOffer snaps baggage onto airline policy", () => {
  assert.equal(sanitizeOffer(offer({ airlineCode: "IX", checkInBaggageKg: 25 })).checkInBaggageKg, 30);
  assert.equal(sanitizeOffer(offer({ airlineCode: "SV", checkInBaggageKg: 40 })).checkInBaggageKg, 40);
});

test("filterOffersForAgent drops paused, expired and routeless offers", () => {
  const docs = [
    offer({ id: "live", order: 1 }),
    offer({ id: "paused", isActive: false }),
    offer({ id: "expired", travelDate: "2026-07-01" }),
    offer({ id: "routeless", originCode: "", destCode: "" }),
  ];
  const out = filterOffersForAgent(docs, {}, "2026-07-29");
  assert.deepEqual(out.map((o) => o.id), ["live"]);
});

test("an offer from an origin the agent cannot see is not advertised to them", () => {
  const docs = [
    offer({ id: "ccj" }),
    offer({ id: "cok", originCode: "COK", order: 1 }),
  ];
  assert.deepEqual(
    filterOffersForAgent(docs, { hiddenOrigins: ["ccj"] }, "2026-07-29").map((o) => o.id),
    ["cok"],
    "hiddenOrigins is matched case-insensitively",
  );
  assert.deepEqual(
    filterOffersForAgent(docs, { hiddenOrigins: [] }, "2026-07-29").map((o) => o.id),
    ["ccj", "cok"],
  );
});

test("offers come back in admin order, then travel date", () => {
  const docs = [
    offer({ id: "c", order: 1, travelDate: "2026-08-01" }),
    offer({ id: "a", order: 0, travelDate: "2026-09-01" }),
    offer({ id: "b", order: 0, travelDate: "2026-08-15" }),
  ];
  assert.deepEqual(filterOffersForAgent(docs, {}, "2026-07-29").map((o) => o.id), ["b", "a", "c"]);
});

test("a missing or malformed offer list is an empty rail, not a crash", () => {
  assert.deepEqual(filterOffersForAgent(undefined, {}, "2026-07-29"), []);
  assert.deepEqual(filterOffersForAgent([], undefined, "2026-07-29"), []);
});
