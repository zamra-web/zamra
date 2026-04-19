const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveSectorMarketKey,
  getFallbackChannelId,
  isConfiguredChannelId,
} = require("../buffer/marketConfig");

test("resolveSectorMarketKey only matches India <-> market routes", () => {
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ JED" }), "saudi");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DXB CCJ" }), "uae");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DOH DXB" }), null);
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ COK" }), null);
});

test("fallback Buffer channel ids stay unconfigured until real ids are supplied", () => {
  assert.equal(isConfiguredChannelId(getFallbackChannelId("saudi", "instagram")), false);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("uae", "youtube")), false);
});
