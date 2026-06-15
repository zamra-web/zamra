const RETRY_DELAYS_MS = [
  2 * 60 * 1000,
  10 * 60 * 1000,
  30 * 60 * 1000,
];

const QUEUE_TERMINAL_STATUSES = new Set(["posted", "partial", "failed", "skipped"]);

function isTerminalQueueState(status) {
  const normalizedStatus = String(status || "").toLowerCase();
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
  const rateLimited = ["rate limit", "retry after", "http 429"].some((term) => lower.includes(term));
  const retryable = rateLimited || [
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
    rateLimited,
  };
}

function isRenderedItem(item = {}) {
  if (item.renderedAt) return true;
  const stage = String(item.stage || "").toLowerCase();
  return [
    "uploading",
    "waiting_dispatch",
    "dispatching",
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
    createdItems: 0,
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
  counters.createdItems = Math.max(list.length - counters.postedItems, 0);
  const status = list.length
    ? (counters.postedItems === list.length ? "posted" : "created")
    : (active ? "created" : "pending");

  return {
    ...counters,
    status,
    lastMessage: latest && latest.lastMessage ? latest.lastMessage : "",
    currentStage: latest && latest.stage ? latest.stage : "",
    currentItemLabel: latest && (latest.sectorCode || latest.label || latest.ratio || "") ? (latest.sectorCode || latest.label || latest.ratio || "") : "",
    lastError: latest && latest.lastError ? latest.lastError : null,
  };
}

module.exports = {
  RETRY_DELAYS_MS,
  QUEUE_TERMINAL_STATUSES,
  toIsoString,
  toMillis,
  getRetryDelayMs,
  classifyDispatchError,
  isTerminalQueueState,
  summarizeSocialJobItems,
};
