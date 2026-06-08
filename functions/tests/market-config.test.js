const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveSectorMarketKey,
  getFallbackChannelId,
  isConfiguredChannelId,
} = require("../buffer/marketConfig");

test("resolveSectorMarketKey matches Gulf-linked airport routes", () => {
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ JED" }), "saudi");
  assert.equal(resolveSectorMarketKey({ sectorCode: "JED CCJ" }), "saudi");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DXB COK" }), "uae");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DOH DXB" }), null);
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ COK" }), null);
});

test("fallback Buffer channel ids stay unconfigured until real ids are supplied", () => {
  assert.equal(isConfiguredChannelId(getFallbackChannelId("saudi", "instagram")), false);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("uae", "youtube")), false);
});
