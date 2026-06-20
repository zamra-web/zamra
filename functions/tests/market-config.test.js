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

test("live markets expose configured fallback channel ids while pending markets stay unconfigured", () => {
  assert.equal(isConfiguredChannelId(getFallbackChannelId("saudi", "instagram")), true);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("uae", "youtube")), true);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("kuwait", "instagram")), false);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("bahrain", "youtube")), false);
});
