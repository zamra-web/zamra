const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getRetryDelayMs,
  classifyDispatchError,
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

test("summarizeSocialJobItems collapses mixed queue outcomes into created", () => {
  const created = summarizeSocialJobItems([
    {
      status: "pending",
      stage: "waiting_dispatch",
      label: "CCJ JED",
      lastMessage: "Waiting to dispatch to Buffer.",
      updatedAt: new Date(),
    },
    {
      status: "failed",
      stage: "failed",
      label: "COK DXB",
      lastMessage: "Video upload failed",
      updatedAt: new Date("2026-04-19T00:01:00Z"),
    },
  ]);
  assert.equal(created.status, "created");
  assert.equal(created.createdItems, 2);
  assert.equal(created.postedItems, 0);
  assert.equal(created.failedItems, 1);
});

test("summarizeSocialJobItems reports posted only when every item is accepted", () => {
  const posted = summarizeSocialJobItems([
    {
      status: "posted",
      stage: "published",
      label: "CCJ JED",
      updatedAt: new Date("2026-04-19T00:00:00Z"),
    },
    {
      status: "posted",
      stage: "published",
      label: "COK DXB",
      updatedAt: new Date("2026-04-19T00:01:00Z"),
    },
  ]);
  assert.equal(posted.status, "posted");
  assert.equal(posted.createdItems, 0);
  assert.equal(posted.postedItems, 2);
});
