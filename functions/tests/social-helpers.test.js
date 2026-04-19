const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getRetryDelayMs,
  classifyDispatchError,
  deriveQueueStatusFromBufferPosts,
  summarizeSocialJobItems,
} = require("../social/helpers");

test("getRetryDelayMs follows the 2m -> 10m -> 30m backoff", () => {
  assert.equal(getRetryDelayMs(1), 2 * 60 * 1000);
  assert.equal(getRetryDelayMs(2), 10 * 60 * 1000);
  assert.equal(getRetryDelayMs(3), 30 * 60 * 1000);
  assert.equal(getRetryDelayMs(5), 30 * 60 * 1000);
});

test("classifyDispatchError marks transient Buffer/network failures as retryable", () => {
  assert.equal(classifyDispatchError(new Error("Buffer HTTP 429: Too many requests")).retryable, true);
  assert.equal(classifyDispatchError(new Error("instagram queue is paused in Buffer")).retryable, true);
  assert.equal(classifyDispatchError(new Error("Invalid media URL")).retryable, false);
});

test("deriveQueueStatusFromBufferPosts maps final publish states correctly", () => {
  assert.equal(deriveQueueStatusFromBufferPosts({
    instagram: { state: "sent" },
    facebook: { state: "sent" },
  }).status, "posted");

  const partial = deriveQueueStatusFromBufferPosts({
    instagram: { state: "sent" },
    facebook: { state: "error" },
  });
  assert.equal(partial.status, "partial");
  assert.equal(partial.stage, "published");

  const waiting = deriveQueueStatusFromBufferPosts({
    instagram: { state: "queued" },
  });
  assert.equal(waiting.status, "queued");
  assert.equal(waiting.stage, "awaiting_publish_confirmation");
});

test("summarizeSocialJobItems keeps awaiting confirmation jobs active and finalizes mixed outcomes", () => {
  const processing = summarizeSocialJobItems([
    {
      status: "partial",
      stage: "awaiting_publish_confirmation",
      label: "CCJ JED",
      lastMessage: "Waiting for Buffer publish confirmation…",
      updatedAt: new Date(),
    },
  ]);
  assert.equal(processing.status, "processing");

  const completed = summarizeSocialJobItems([
    {
      status: "posted",
      stage: "published",
      label: "CCJ JED",
      updatedAt: new Date("2026-04-19T00:00:00Z"),
    },
    {
      status: "failed",
      stage: "failed",
      label: "COK DXB",
      lastMessage: "Video upload failed",
      updatedAt: new Date("2026-04-19T00:01:00Z"),
    },
  ]);
  assert.equal(completed.status, "completed_with_failures");
  assert.equal(completed.failedItems, 1);
  assert.equal(completed.postedItems, 1);
});
