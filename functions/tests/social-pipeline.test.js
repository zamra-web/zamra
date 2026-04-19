const test = require("node:test");
const assert = require("node:assert/strict");

const bufferChannels = require("../buffer/channels");
const {
  inspectMarketHealth,
  getConfiguredChannelForMarket,
  buildQueueCreatePayload,
} = require("../social/pipeline");

const originalFetchOrganizations = bufferChannels.fetchOrganizations;
const originalFetchChannelById = bufferChannels.fetchChannelById;

test.afterEach(() => {
  bufferChannels.fetchOrganizations = originalFetchOrganizations;
  bufferChannels.fetchChannelById = originalFetchChannelById;
});

test("getConfiguredChannelForMarket prefers Firestore ids and otherwise falls back", () => {
  const explicit = getConfiguredChannelForMarket({
    channels: {
      instagram: {
        configuredId: "ig-live-channel",
        source: "firestore",
      },
    },
  }, "saudi", "instagram");
  assert.deepEqual(explicit, { id: "ig-live-channel", source: "firestore" });

  const missing = getConfiguredChannelForMarket({}, "saudi", "instagram");
  assert.equal(missing.id, "");
});

test("inspectMarketHealth reports missing config as blocked", async () => {
  bufferChannels.fetchOrganizations = async () => ["org-1"];
  bufferChannels.fetchChannelById = async () => {
    throw new Error("should not fetch channel when no ids are configured");
  };

  const health = await inspectMarketHealth("saudi", "token", {});
  assert.equal(health.status, "blocked");
  assert.match(health.message, /No instagram channel configured/i);
});

test("inspectMarketHealth marks paused Buffer channels as warnings", async () => {
  bufferChannels.fetchOrganizations = async () => ["org-1"];
  bufferChannels.fetchChannelById = async (_apiKey, id) => {
    const service = id.startsWith("ig") ? "instagram" : id.startsWith("fb") ? "facebook" : "youtube";
    return {
      id,
      service,
      displayName: `${service} channel`,
      isQueuePaused: service === "instagram",
    };
  };

  const health = await inspectMarketHealth("saudi", "token", {
    organizationId: "org-1",
    channels: {
      instagram: { configuredId: "ig-live", source: "firestore" },
      facebook: { configuredId: "fb-live", source: "firestore" },
      youtube: { configuredId: "yt-live", source: "firestore" },
    },
  });

  assert.equal(health.status, "warning");
  assert.equal(health.channels.instagram.status, "warning");
  assert.equal(health.channels.facebook.status, "ready");
});

test("buildQueueCreatePayload seeds queue docs with retry and visibility fields", () => {
  const payload = buildQueueCreatePayload({
    source: "admin",
    jobId: "job-1",
    jobItemId: "item-1",
    marketKey: "saudi",
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
  assert.equal(payload.mediaType, "video");
  assert.equal(payload.mediaUrls.length, 1);
  assert.equal(payload.attemptCount, 0);
});
