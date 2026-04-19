const test = require("node:test");
const assert = require("node:assert/strict");

const {
  resolveSectorMarketKey,
  getFallbackChannelId,
  isConfiguredChannelId,
} = require("../buffer/marketConfig");

test("resolveSectorMarketKey only matches India-linked airport routes", () => {
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ JED" }), "ccj");
  assert.equal(resolveSectorMarketKey({ sectorCode: "JED CCJ" }), "ccj");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DXB COK" }), "cok");
  assert.equal(resolveSectorMarketKey({ sectorCode: "DOH DXB" }), null);
  assert.equal(resolveSectorMarketKey({ sectorCode: "CCJ COK" }), null);
});

test("fallback Buffer channel ids stay unconfigured until real ids are supplied", () => {
  assert.equal(isConfiguredChannelId(getFallbackChannelId("ccj", "instagram")), false);
  assert.equal(isConfiguredChannelId(getFallbackChannelId("cok", "youtube")), false);
});
