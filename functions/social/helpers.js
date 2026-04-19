const RETRY_DELAYS_MS = [
  2 * 60 * 1000,
  10 * 60 * 1000,
  30 * 60 * 1000,
];

const QUEUE_TERMINAL_STATUSES = new Set(["posted", "partial", "failed", "skipped"]);
const JOB_TERMINAL_STATUSES = new Set(["completed", "completed_with_failures", "failed"]);

function isTerminalQueueState(status, stage) {
  const normalizedStatus = String(status || "").toLowerCase();
  const normalizedStage = String(stage || "").toLowerCase();
  if (normalizedStatus === "partial" && normalizedStage === "awaiting_publish_confirmation") {
    return false;
  }
  return QUEUE_TERMINAL_STATUSES.has(normalizedStatus);
}

function toIsoString(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.toMillis === "function") return new Date(value.toMillis()).toISOString();
  if (typeof value === "string") return new Date(value).toISOString();
  return null;
}

function toMillis(value) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getRetryDelayMs(attemptCount) {
  const idx = Math.max(0, Math.min(RETRY_DELAYS_MS.length - 1, Number(attemptCount || 1) - 1));
  return RETRY_DELAYS_MS[idx];
}

function classifyDispatchError(error) {
  const message = String(error && (error.message || error.error || error) || "").trim();
  const lower = message.toLowerCase();
  const retryable = [
    "rate limit",
    "retry after",
    "http 429",
    "http 408",
    "http 500",
    "http 502",
    "http 503",
    "http 504",
    "econnreset",
    "enotfound",
    "network",
    "fetch failed",
    "timeout",
    "temporarily unavailable",
    "queue paused",
    "queue is paused",
  ].some((term) => lower.includes(term));

  return {
    message: message || "Unknown dispatch error",
    retryable,
  };
}

function deriveQueueStatusFromBufferPosts(bufferPosts = {}) {
  const posts = Object.values(bufferPosts || {}).filter(Boolean);
  if (!posts.length) {
    return {
      status: "failed",
      stage: "failed",
      unresolvedCount: 0,
      sentCount: 0,
      errorCount: 0,
    };
  }

  let unresolvedCount = 0;
  let sentCount = 0;
  let errorCount = 0;

  posts.forEach((post) => {
    const state = String(post.state || "").toLowerCase();
    if (state === "sent") sentCount += 1;
    else if (state === "error") errorCount += 1;
    else unresolvedCount += 1;
  });

  if (unresolvedCount > 0) {
    return {
      status: errorCount > 0 || sentCount > 0 ? "partial" : "queued",
      stage: "awaiting_publish_confirmation",
      unresolvedCount,
      sentCount,
      errorCount,
    };
  }

  if (sentCount > 0 && errorCount === 0) {
    return { status: "posted", stage: "published", unresolvedCount, sentCount, errorCount };
  }

  if (sentCount > 0 && errorCount > 0) {
    return { status: "partial", stage: "published", unresolvedCount, sentCount, errorCount };
  }

  return { status: "failed", stage: "failed", unresolvedCount, sentCount, errorCount };
}

function isRenderedItem(item = {}) {
  if (item.renderedAt) return true;
  const stage = String(item.stage || "").toLowerCase();
  return [
    "uploading",
    "waiting_dispatch",
    "dispatching",
    "awaiting_publish_confirmation",
    "published",
  ].includes(stage);
}

function isUploadedItem(item = {}) {
  if (item.uploadedAt) return true;
  return !!(item.queueId || (Array.isArray(item.queueIds) && item.queueIds.length) || item.mediaUrl || (Array.isArray(item.mediaUrls) && item.mediaUrls.length));
}

function summarizeSocialJobItems(items = []) {
  const list = Array.isArray(items) ? items : [];
  const counters = {
    plannedItems: list.length,
    renderedItems: 0,
    uploadedItems: 0,
    queuedItems: 0,
    postedItems: 0,
    failedItems: 0,
    partialItems: 0,
  };

  let latest = null;
  let active = false;

  list.forEach((item) => {
    const status = String(item.status || "pending").toLowerCase();
    if (isRenderedItem(item)) counters.renderedItems += 1;
    if (isUploadedItem(item)) counters.uploadedItems += 1;
    if (["queued", "posted", "partial"].includes(status)) counters.queuedItems += 1;
    if (status === "posted") counters.postedItems += 1;
    if (status === "failed") counters.failedItems += 1;
    if (status === "partial") {
      counters.partialItems += 1;
      counters.failedItems += 1;
    }
    if (!isTerminalQueueState(status, item.stage)) active = true;

    const latestMs = latest ? toMillis(latest.updatedAt || latest.createdAt) : 0;
    const itemMs = toMillis(item.updatedAt || item.createdAt);
    if (!latest || itemMs >= latestMs) {
      latest = item;
    }
  });

  let status = "pending";
  if (list.length) {
    const allTerminal = list.every((item) => isTerminalQueueState(item.status, item.stage));
    if (allTerminal) {
      if (counters.postedItems === list.length) status = "completed";
      else if (counters.failedItems === list.length && counters.postedItems === 0) status = "failed";
      else status = "completed_with_failures";
    } else if (active) {
      status = "processing";
    }
  }

  return {
    ...counters,
    status,
    lastMessage: latest && latest.lastMessage ? latest.lastMessage : "",
    currentStage: latest && latest.stage ? latest.stage : "",
    currentItemLabel: latest && (latest.sectorCode || latest.label || latest.ratio || "") ? (latest.sectorCode || latest.label || latest.ratio || "") : "",
  };
}

module.exports = {
  RETRY_DELAYS_MS,
  QUEUE_TERMINAL_STATUSES,
  JOB_TERMINAL_STATUSES,
  toIsoString,
  toMillis,
  getRetryDelayMs,
  classifyDispatchError,
  deriveQueueStatusFromBufferPosts,
  isTerminalQueueState,
  summarizeSocialJobItems,
};
