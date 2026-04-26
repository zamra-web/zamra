const test = require("node:test");
const assert = require("node:assert/strict");

const {
  inspectMarketHealth,
  getConfiguredChannelForMarket,
  resolveQueueMarketKey,
  buildQueueCreatePayload,
} = require("../social/pipeline");

test("getConfiguredChannelForMarket prefers Firestore ids and otherwise falls back", () => {
  const explicit = getConfiguredChannelForMarket({
    channels: {
      instagram: {
        configuredId: "ig-live-channel",
        source: "firestore",
      },
    },
  }, "ccj", "instagram");
  assert.deepEqual(explicit, { id: "ig-live-channel", source: "firestore" });

  const missing = getConfiguredChannelForMarket({}, "cnn", "instagram");
  assert.equal(missing.id, "");
});

test("inspectMarketHealth reports missing config as blocked", async () => {
  const health = await inspectMarketHealth("cnn", "token", {});
  assert.equal(health.status, "blocked");
  assert.match(health.message, /No instagram channel configured/i);
});

test("inspectMarketHealth uses configured channels without any Buffer verification calls", async () => {
  const health = await inspectMarketHealth("ccj", "token", {
    channels: {
      instagram: { configuredId: "ig-live", source: "firestore" },
      facebook: { configuredId: "fb-live", source: "firestore" },
      youtube: { configuredId: "yt-live", source: "firestore" },
    },
  });

  assert.equal(health.status, "ready");
  assert.equal(health.channels.instagram.status, "ready");
  assert.equal(health.channels.facebook.status, "ready");
});

test("resolveQueueMarketKey normalizes legacy country keys to airport keys", () => {
  assert.equal(resolveQueueMarketKey({ marketKey: "saudi", sectorCode: "JED CCJ" }), "ccj");
  assert.equal(resolveQueueMarketKey({ marketKey: "uae", sectorCode: "DXB COK" }), "cok");
  assert.equal(resolveQueueMarketKey({ marketKey: "", sectorCode: "CCJ COK" }), "");
});

test("buildQueueCreatePayload seeds queue docs with retry and visibility fields", () => {
  const payload = buildQueueCreatePayload({
    source: "admin",
    jobId: "job-1",
    jobItemId: "item-1",
    marketKey: "saudi",
    sectorCode: "JED CCJ",
    mediaType: "video",
    ratio: "9x16",
    mediaUrl: "https://example.com/video.mp4",
    filename: "video.mp4",
    platforms: ["instagram", "facebook", "youtube"],
  });

  assert.equal(payload.status, "pending");
  assert.equal(payload.stage, "waiting_dispatch");
  assert.equal(payload.jobId, "job-1");
  assert.equal(payload.jobItemId, "item-1");
  assert.equal(payload.marketKey, "ccj");
  assert.equal(payload.mediaType, "video");
  assert.equal(payload.mediaUrls.length, 1);
  assert.equal(payload.includeStories, false);
  assert.equal(payload.storyMediaUrl, "");
  assert.equal(payload.attemptCount, 0);
});
