const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions/v2");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const bufferChannels = require("../buffer/channels");
const bufferCreatePost = require("../buffer/createPost");
const bufferPostQueries = require("../buffer/posts");
const {
  BUFFER_MARKET_CONFIG,
  PLATFORM_KEYS,
  getFallbackChannelId,
  isConfiguredChannelId,
} = require("../buffer/marketConfig");
const {
  toMillis,
  getRetryDelayMs,
  classifyDispatchError,
  deriveQueueStatusFromBufferPosts,
  summarizeSocialJobItems,
} = require("./helpers");

const CONFIG_COLLECTION = "config";
const CONFIG_DOC_ID = "socialPublishing";
const SOCIAL_JOBS_COLLECTION = "social_jobs";
const SOCIAL_QUEUE_COLLECTION = "social_queue";

const RETENTION_MS = 72 * 60 * 60 * 1000;
const LEASE_MS = 8 * 60 * 1000;
const STALE_CONFIRMATION_MS = 2 * 60 * 60 * 1000;
const DISPATCH_BATCH_LIMIT = 6;
const DISPATCH_CANDIDATE_LIMIT = 20;
const MAX_ATTEMPTS = 3;
const HEALTH_MAX_AGE_MS = 30 * 60 * 1000;
const STORY_PLATFORMS = ["instagram", "facebook"];
const QUEUE_TERMINAL_STATUSES = new Set(["posted", "partial", "failed", "skipped"]);

function db() {
  return getFirestore();
}

function socialConfigRef() {
  return db().collection(CONFIG_COLLECTION).doc(CONFIG_DOC_ID);
}

function socialJobsRef() {
  return db().collection(SOCIAL_JOBS_COLLECTION);
}

function socialQueueRef() {
  return db().collection(SOCIAL_QUEUE_COLLECTION);
}

function futureDate(ms) {
  return new Date(Date.now() + ms);
}

function futureTimestamp(ms) {
  return Timestamp.fromDate(futureDate(ms));
}

function timestampNow() {
  return Timestamp.fromDate(new Date());
}

function cleanObject(input = {}) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

function pathFromStorageUrl(url) {
  if (typeof url !== "string" || !url) return null;
  const marker = "/o/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  const tail = url.slice(i + marker.length).split("?")[0];
  try {
    return decodeURIComponent(tail);
  } catch {
    return null;
  }
}

function queueDocToItemUpdate(queueId, data = {}) {
  return cleanObject({
    queueId,
    status: data.status || "pending",
    stage: data.stage || "waiting_dispatch",
    marketKey: data.marketKey || "",
    mediaType: data.mediaType || "image",
    ratio: data.ratio || null,
    sectorId: data.sectorId || "",
    sectorCode: data.sectorCode || "",
    label: data.label || data.sectorCode || data.filename || data.jobItemId || "",
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    mediaUrl: data.mediaUrl || "",
    mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
    storyMediaUrl: data.storyMediaUrl || "",
    filename: data.filename || "",
    filenames: Array.isArray(data.filenames) ? data.filenames : [],
    caption: data.caption || "",
    youtubeTitle: data.youtubeTitle || "",
    includeStories: data.includeStories === true,
    bufferPosts: data.bufferPosts || {},
    lastError: data.lastError || null,
    lastMessage: data.lastMessage || "",
    attemptCount: Number(data.attemptCount || 0),
    nextAttemptAt: data.nextAttemptAt || null,
    leaseExpiresAt: data.leaseExpiresAt || null,
    lastCheckedAt: data.lastCheckedAt || null,
    expiresAt: data.expiresAt || futureTimestamp(RETENTION_MS),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function readSocialPublishingConfig() {
  const snap = await socialConfigRef().get();
  return snap.exists ? (snap.data() || {}) : { markets: {} };
}

function getConfiguredChannelForMarket(existingMarket = {}, marketKey, platform) {
  const channel = existingMarket && existingMarket.channels && existingMarket.channels[platform]
    ? existingMarket.channels[platform]
    : {};
  const explicitId = String(
    channel.configuredId ||
    (channel.source && channel.source !== "fallback" ? channel.id : channel.id || ""),
  ).trim();
  if (isConfiguredChannelId(explicitId)) {
    return { id: explicitId, source: "firestore" };
  }

  const fallbackId = String(getFallbackChannelId(marketKey, platform) || "").trim();
  if (isConfiguredChannelId(fallbackId)) {
    return { id: fallbackId, source: "fallback" };
  }

  return { id: "", source: "missing" };
}

async function inspectMarketHealth(marketKey, apiKey, existingMarket = {}) {
  const market = BUFFER_MARKET_CONFIG[marketKey];
  if (!market) {
    return {
      key: marketKey,
      label: marketKey,
      status: "blocked",
      message: `Unknown market "${marketKey}"`,
      warnings: [],
      blockers: [`Unknown market "${marketKey}"`],
      channels: {},
      verifiedAt: new Date().toISOString(),
    };
  }

  if (!apiKey) {
    return {
      key: market.key,
      label: market.label,
      airports: market.airports,
      status: "blocked",
      message: `Buffer API key secret is missing for ${market.label}.`,
      warnings: [],
      blockers: [`Buffer API key secret is missing for ${market.label}.`],
      channels: {},
      verifiedAt: new Date().toISOString(),
    };
  }

  const warnings = [];
  const blockers = [];
  const channels = {};
  let organizationId = String(existingMarket.organizationId || "").trim();

  try {
    const organizations = await bufferChannels.fetchOrganizations(apiKey);
    if (!organizationId && organizations.length === 1) {
      organizationId = organizations[0];
    } else if (!organizationId && organizations.length > 1) {
      blockers.push("Multiple Buffer organizations detected. Set organizationId in config/socialPublishing.");
    } else if (!organizationId && organizations.length === 0) {
      blockers.push("No Buffer organizations available for this market account.");
    }
  } catch (error) {
    blockers.push(`Failed to read Buffer organizations: ${error.message || error}`);
  }

  for (const platform of PLATFORM_KEYS) {
    const configured = getConfiguredChannelForMarket(existingMarket, marketKey, platform);
    if (!configured.id) {
      channels[platform] = {
        id: "",
        configuredId: "",
        source: configured.source,
        status: "blocked",
        message: `No ${platform} channel configured for ${market.label}.`,
      };
      blockers.push(`No ${platform} channel configured for ${market.label}.`);
      continue;
    }

    try {
      const channel = await bufferChannels.fetchChannelById(apiKey, configured.id);
      if (!channel) {
        channels[platform] = {
          id: configured.id,
          configuredId: configured.source === "firestore" ? configured.id : "",
          source: configured.source,
          status: "blocked",
          message: `Buffer channel ${configured.id} could not be loaded.`,
        };
        blockers.push(`Buffer channel ${configured.id} could not be loaded for ${market.label} ${platform}.`);
        continue;
      }

      const service = String(channel.service || "").toLowerCase();
      if (service !== platform) {
        channels[platform] = {
          id: configured.id,
          configuredId: configured.source === "firestore" ? configured.id : "",
          source: configured.source,
          name: channel.displayName || channel.name || "",
          service,
          isQueuePaused: !!channel.isQueuePaused,
          status: "blocked",
          message: `Expected ${platform} but Buffer returned ${service || "unknown"}.`,
        };
        blockers.push(`Configured ${market.label} ${platform} channel is actually ${service || "unknown"}.`);
        continue;
      }

      if (channel.isQueuePaused) {
        warnings.push(`${market.label} ${platform} channel queue is paused in Buffer.`);
      }

      channels[platform] = {
        id: configured.id,
        configuredId: configured.source === "firestore" ? configured.id : "",
        source: configured.source,
        name: channel.displayName || channel.name || "",
        service,
        isQueuePaused: !!channel.isQueuePaused,
        status: channel.isQueuePaused ? "warning" : "ready",
        message: channel.isQueuePaused
          ? `${market.label} ${platform} queue is paused in Buffer.`
          : `${market.label} ${platform} channel verified.`,
      };
    } catch (error) {
      channels[platform] = {
        id: configured.id,
        configuredId: configured.source === "firestore" ? configured.id : "",
        source: configured.source,
        status: "blocked",
        message: error.message || String(error),
      };
      blockers.push(`Failed to validate ${market.label} ${platform}: ${error.message || error}`);
    }
  }

  const status = blockers.length ? "blocked" : warnings.length ? "warning" : "ready";
  return {
    key: market.key,
    label: market.label,
    airports: market.airports,
    organizationId,
    warnings,
    blockers,
    status,
    message: blockers[0] || warnings[0] || `${market.label} social publishing is ready.`,
    channels,
    verifiedAt: new Date().toISOString(),
  };
}

async function refreshSocialPublishingHealth(bufferApiKeySecretsByMarket, marketKeys = null) {
  const existing = await readSocialPublishingConfig();
  const existingMarkets = existing.markets || {};
  const keys = Array.isArray(marketKeys) && marketKeys.length
    ? marketKeys
    : Object.keys(BUFFER_MARKET_CONFIG);

  const refreshedMarkets = {};
  for (const marketKey of keys) {
    const secret = bufferApiKeySecretsByMarket[marketKey];
    const apiKey = secret && typeof secret.value === "function" ? secret.value() : "";
    refreshedMarkets[marketKey] = await inspectMarketHealth(
      marketKey,
      apiKey,
      existingMarkets[marketKey] || {},
    );
  }

  await socialConfigRef().set({
    version: 1,
    retentionHours: RETENTION_MS / (60 * 60 * 1000),
    markets: refreshedMarkets,
    updatedAt: FieldValue.serverTimestamp(),
    lastHealthRefreshAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  return refreshedMarkets;
}

async function ensureMarketHealth(bufferApiKeySecretsByMarket, marketKey) {
  const existing = await readSocialPublishingConfig();
  const market = existing && existing.markets ? existing.markets[marketKey] : null;
  const ageMs = toMillis(market && market.verifiedAt ? market.verifiedAt : 0);
  if (!market || !ageMs || (Date.now() - ageMs) > HEALTH_MAX_AGE_MS) {
    const refreshed = await refreshSocialPublishingHealth(bufferApiKeySecretsByMarket, [marketKey]);
    return refreshed[marketKey] || null;
  }
  return market;
}

function buildQueueCreatePayload(meta = {}) {
  const mediaType = meta.mediaType === "video" ? "video" : "image";
  const mediaUrls = Array.isArray(meta.mediaUrls) && meta.mediaUrls.length
    ? meta.mediaUrls.filter(Boolean)
    : (meta.mediaUrl ? [meta.mediaUrl] : []);

  return cleanObject({
    source: meta.source || "admin",
    jobId: meta.jobId || "",
    jobItemId: meta.jobItemId || "",
    retryOfQueueId: meta.retryOfQueueId || "",
    retryOfItemId: meta.retryOfItemId || "",
    sectorId: meta.sectorId || "",
    sectorCode: meta.sectorCode || "",
    label: meta.label || meta.sectorCode || meta.filename || meta.jobItemId || "",
    marketKey: meta.marketKey || "",
    mediaType,
    ratio: meta.ratio || null,
    mediaUrl: mediaUrls[0] || "",
    mediaUrls,
    filename: meta.filename || "",
    filenames: Array.isArray(meta.filenames) ? meta.filenames : (meta.filename ? [meta.filename] : []),
    caption: meta.caption || "",
    youtubeTitle: meta.youtubeTitle || "",
    storyMediaUrl: meta.storyMediaUrl || "",
    includeStories: mediaType === "image" ? meta.includeStories === true : false,
    platforms: Array.isArray(meta.platforms) && meta.platforms.length
      ? meta.platforms
      : (mediaType === "video" ? ["instagram", "facebook", "youtube"] : ["instagram", "facebook"]),
    status: "pending",
    stage: "waiting_dispatch",
    attemptCount: Number(meta.attemptCount || 0),
    nextAttemptAt: meta.nextAttemptAt || timestampNow(),
    leaseExpiresAt: null,
    bufferPosts: meta.bufferPosts || {},
    organizationId: meta.organizationId || "",
    lastError: null,
    lastMessage: meta.lastMessage || "Waiting to dispatch to Buffer.",
    lastCheckedAt: null,
    processedAt: null,
    expiresAt: meta.expiresAt || futureTimestamp(RETENTION_MS),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function enqueueExistingMedia(meta = {}) {
  const payload = buildQueueCreatePayload(meta);
  const docRef = await socialQueueRef().add(payload);
  if (payload.jobId && payload.jobItemId) {
    await socialJobsRef()
      .doc(payload.jobId)
      .collection("items")
      .doc(payload.jobItemId)
      .set(queueDocToItemUpdate(docRef.id, payload), { merge: true });
    await syncSocialJobSummary(payload.jobId);
  }
  return { queueId: docRef.id, payload };
}

async function createSocialJob(data = {}) {
  const docRef = await socialJobsRef().add({
    source: data.source || "admin",
    marketKey: data.marketKey || "",
    mediaType: data.mediaType || "image",
    filters: data.filters || {},
    requestedBy: data.requestedBy || {},
    status: data.status || "pending",
    lastMessage: data.lastMessage || "Preparing social publishing job.",
    currentStage: data.currentStage || "rendering",
    currentItemLabel: data.currentItemLabel || "",
    plannedItems: Number(data.plannedItems || 0),
    renderedItems: Number(data.renderedItems || 0),
    uploadedItems: Number(data.uploadedItems || 0),
    queuedItems: Number(data.queuedItems || 0),
    postedItems: Number(data.postedItems || 0),
    failedItems: Number(data.failedItems || 0),
    partialItems: Number(data.partialItems || 0),
    expiresAt: futureTimestamp(RETENTION_MS),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

async function createSocialJobItem(jobId, data = {}) {
  const docRef = await socialJobsRef().doc(jobId).collection("items").add({
    source: data.source || "admin",
    label: data.label || data.sectorCode || "",
    sectorId: data.sectorId || "",
    sectorCode: data.sectorCode || "",
    marketKey: data.marketKey || "",
    mediaType: data.mediaType || "image",
    ratio: data.ratio || null,
    status: data.status || "pending",
    stage: data.stage || "rendering",
    lastMessage: data.lastMessage || "Preparing media.",
    lastError: data.lastError || null,
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    mediaUrl: data.mediaUrl || "",
    mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
    storyMediaUrl: data.storyMediaUrl || "",
    filename: data.filename || "",
    filenames: Array.isArray(data.filenames) ? data.filenames : [],
    caption: data.caption || "",
    youtubeTitle: data.youtubeTitle || "",
    includeStories: data.includeStories === true,
    retryOfItemId: data.retryOfItemId || "",
    queueId: data.queueId || "",
    renderedAt: data.renderedAt || null,
    uploadedAt: data.uploadedAt || null,
    expiresAt: futureTimestamp(RETENTION_MS),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await syncSocialJobSummary(jobId);
  return docRef.id;
}

async function updateSocialJobItem(jobId, itemId, updates = {}) {
  await socialJobsRef().doc(jobId).collection("items").doc(itemId).set({
    ...updates,
    expiresAt: updates.expiresAt || futureTimestamp(RETENTION_MS),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  await syncSocialJobSummary(jobId);
}

async function syncQueueToJob(queueId, data = {}) {
  if (!data.jobId || !data.jobItemId) return;
  await socialJobsRef()
    .doc(data.jobId)
    .collection("items")
    .doc(data.jobItemId)
    .set(queueDocToItemUpdate(queueId, data), { merge: true });
  await syncSocialJobSummary(data.jobId);
}

async function syncSocialJobSummary(jobId) {
  const jobRef = socialJobsRef().doc(jobId);
  const snap = await jobRef.collection("items").get();
  const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const summary = summarizeSocialJobItems(items);
  await jobRef.set({
    ...summary,
    expiresAt: futureTimestamp(RETENTION_MS),
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  return summary;
}

async function reclaimExpiredProcessingItems() {
  const staleCutoff = Timestamp.fromDate(new Date(Date.now() - LEASE_MS));
  const snap = await socialQueueRef()
    .where("status", "==", "processing")
    .where("updatedAt", "<=", staleCutoff)
    .orderBy("updatedAt", "asc")
    .limit(20)
    .get();

  for (const doc of snap.docs) {
    const data = doc.data() || {};
    const attemptCount = Number(data.attemptCount || 0);
    if (attemptCount >= MAX_ATTEMPTS) {
      await doc.ref.update({
        status: "failed",
        stage: "failed",
        lastError: {
          message: "Queue lease expired too many times.",
          retryable: false,
        },
        lastMessage: "Queue lease expired too many times.",
        processedAt: FieldValue.serverTimestamp(),
        expiresAt: futureTimestamp(RETENTION_MS),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await doc.ref.update({
        status: "pending",
        stage: "waiting_dispatch",
        leaseExpiresAt: null,
        nextAttemptAt: timestampNow(),
        lastError: {
          message: "Queue lease expired. Re-queued for dispatch.",
          retryable: true,
        },
        lastMessage: "Queue lease expired. Re-queued for dispatch.",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    await syncQueueToJob(doc.id, { ...data, ...(await doc.ref.get()).data() });
  }
}

async function claimDueQueueItems(limit = DISPATCH_BATCH_LIMIT) {
  const candidates = await socialQueueRef()
    .where("status", "==", "pending")
    .where("nextAttemptAt", "<=", timestampNow())
    .orderBy("nextAttemptAt", "asc")
    .limit(DISPATCH_CANDIDATE_LIMIT)
    .get();

  const claimed = [];
  const marketsUsed = new Set();

  for (const doc of candidates.docs) {
    if (claimed.length >= limit) break;
    const marketKey = String(doc.data().marketKey || "").trim().toLowerCase();
    if (marketsUsed.has(marketKey)) continue;

    const claimedData = await db().runTransaction(async (tx) => {
      const fresh = await tx.get(doc.ref);
      if (!fresh.exists) return null;
      const data = fresh.data() || {};
      const dueAt = toMillis(data.nextAttemptAt || 0);
      if (data.status !== "pending" || (dueAt && dueAt > Date.now())) return null;
      const attemptCount = Number(data.attemptCount || 0) + 1;
      tx.update(doc.ref, {
        status: "processing",
        stage: "dispatching",
        attemptCount,
        leaseExpiresAt: futureTimestamp(LEASE_MS),
        lastMessage: "Dispatching to Buffer…",
        updatedAt: FieldValue.serverTimestamp(),
      });
      return {
        id: fresh.id,
        ...data,
        attemptCount,
        status: "processing",
        stage: "dispatching",
      };
    });

    if (claimedData) {
      marketsUsed.add(marketKey);
      claimed.push(claimedData);
    }
  }

  return claimed;
}

function getRequiredPlatformState(marketHealth, platform) {
  return marketHealth && marketHealth.channels ? marketHealth.channels[platform] : null;
}

async function dispatchQueueDoc(bufferApiKeySecretsByMarket, queueDoc) {
  const ref = socialQueueRef().doc(queueDoc.id);
  const freshSnap = await ref.get();
  if (!freshSnap.exists) return;
  const doc = { id: freshSnap.id, ...freshSnap.data() };

  const mediaType = doc.mediaType === "video" ? "video" : "image";
  const mediaUrls = Array.isArray(doc.mediaUrls) && doc.mediaUrls.length
    ? doc.mediaUrls.filter(Boolean)
    : (doc.mediaUrl ? [doc.mediaUrl] : []);
  if (!mediaUrls.length) {
    await ref.update({
      status: "failed",
      stage: "failed",
      lastError: { message: "No media URL available for dispatch.", retryable: false },
      lastMessage: "No media URL available for dispatch.",
      processedAt: FieldValue.serverTimestamp(),
      expiresAt: futureTimestamp(RETENTION_MS),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(ref.id, { ...doc, status: "failed", stage: "failed", lastMessage: "No media URL available for dispatch." });
    return;
  }

  const marketKey = String(doc.marketKey || "").trim().toLowerCase();
  const secret = bufferApiKeySecretsByMarket[marketKey];
  const apiKey = secret && typeof secret.value === "function" ? secret.value() : "";
  const marketHealth = await ensureMarketHealth(bufferApiKeySecretsByMarket, marketKey);

  if (!apiKey) {
    await ref.update({
      status: "failed",
      stage: "failed",
      lastError: { message: `No Buffer API key configured for market "${marketKey}".`, retryable: false },
      lastMessage: `No Buffer API key configured for market "${marketKey}".`,
      processedAt: FieldValue.serverTimestamp(),
      expiresAt: futureTimestamp(RETENTION_MS),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(ref.id, { ...doc, status: "failed", stage: "failed", lastMessage: `No Buffer API key configured for market "${marketKey}".` });
    return;
  }

  const requestedPlatforms = [...new Set((Array.isArray(doc.platforms) ? doc.platforms : []).map((key) => String(key || "").toLowerCase()).filter(Boolean))];
  const targets = [];
  const setupErrors = [];

  for (const platform of requestedPlatforms) {
    if (platform === "youtube" && mediaType !== "video") continue;
    const state = getRequiredPlatformState(marketHealth, platform);
    if (!state || !isConfiguredChannelId(state.id)) {
      setupErrors.push({ platform, message: `No configured ${platform} channel for ${marketKey}.`, retryable: false });
      continue;
    }
    if (state.status === "blocked") {
      setupErrors.push({ platform, message: state.message || `Blocked ${platform} channel for ${marketKey}.`, retryable: false });
      continue;
    }
    if (state.isQueuePaused) {
      setupErrors.push({ platform, message: state.message || `${platform} queue is paused in Buffer.`, retryable: true });
      continue;
    }
    targets.push({
      platform,
      channelId: state.id,
      channelName: state.name || "",
    });
  }

  const retryableSetupError = setupErrors.find((item) => item.retryable);
  if (!targets.length) {
    const attemptCount = Number(doc.attemptCount || 0);
    const blocking = setupErrors[0] || { message: "No eligible channels for this queue item.", retryable: false };
    if (blocking.retryable && attemptCount < MAX_ATTEMPTS) {
      await ref.update({
        status: "pending",
        stage: "waiting_dispatch",
        leaseExpiresAt: null,
        nextAttemptAt: futureTimestamp(getRetryDelayMs(attemptCount)),
        lastError: blocking,
        lastMessage: blocking.message,
        updatedAt: FieldValue.serverTimestamp(),
      });
      await syncQueueToJob(ref.id, { ...doc, status: "pending", stage: "waiting_dispatch", lastMessage: blocking.message, lastError: blocking });
      return;
    }

    await ref.update({
      status: "failed",
      stage: "failed",
      bufferPosts: Object.fromEntries(setupErrors.map((error) => [
        error.platform,
        {
          platform: error.platform,
          state: "error",
          error: error.message,
          retryable: !!error.retryable,
        },
      ])),
      lastError: blocking,
      lastMessage: blocking.message,
      processedAt: FieldValue.serverTimestamp(),
      expiresAt: futureTimestamp(RETENTION_MS),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(ref.id, { ...doc, status: "failed", stage: "failed", lastMessage: blocking.message });
    return;
  }

  const bufferPosts = { ...(doc.bufferPosts || {}) };
  let acceptedCount = 0;
  let retryableFailure = retryableSetupError || null;
  let terminalFailure = setupErrors.find((item) => !item.retryable) || null;

  for (const target of targets) {
    const result = await bufferCreatePost.createPostOnChannel({
      apiKey,
      channelId: target.channelId,
      platform: target.platform,
      text: doc.caption || "",
      mediaUrls,
      mediaType,
      postType: "feed",
      youtubeTitle: doc.youtubeTitle || "",
    });

    if (result.ok) {
      acceptedCount += 1;
      bufferPosts[target.platform] = {
        platform: target.platform,
        channelId: target.channelId,
        channelName: target.channelName,
        postId: result.postId,
        state: "queued",
        acceptedAt: new Date().toISOString(),
        retryable: false,
      };
    } else {
      const classified = classifyDispatchError(result.error);
      bufferPosts[target.platform] = {
        platform: target.platform,
        channelId: target.channelId,
        channelName: target.channelName,
        state: "error",
        error: classified.message,
        retryable: classified.retryable,
      };
      if (classified.retryable && !retryableFailure) retryableFailure = { platform: target.platform, ...classified };
      if (!classified.retryable && !terminalFailure) terminalFailure = { platform: target.platform, ...classified };
    }

    if (doc.includeStories === true && mediaType === "image" && STORY_PLATFORMS.includes(target.platform)) {
      const storyUrl = doc.storyMediaUrl || mediaUrls[0];
      const storyKey = `${target.platform}_story`;
      const storyResult = await bufferCreatePost.createPostOnChannel({
        apiKey,
        channelId: target.channelId,
        platform: target.platform,
        text: doc.caption || "",
        mediaUrls: [storyUrl],
        mediaType,
        postType: "story",
        youtubeTitle: doc.youtubeTitle || "",
      });
      if (storyResult.ok) {
        acceptedCount += 1;
        bufferPosts[storyKey] = {
          platform: storyKey,
          channelId: target.channelId,
          channelName: target.channelName,
          postId: storyResult.postId,
          state: "queued",
          acceptedAt: new Date().toISOString(),
          retryable: false,
        };
      } else {
        const classified = classifyDispatchError(storyResult.error);
        bufferPosts[storyKey] = {
          platform: storyKey,
          channelId: target.channelId,
          channelName: target.channelName,
          state: "error",
          error: classified.message,
          retryable: classified.retryable,
        };
        if (classified.retryable && !retryableFailure) retryableFailure = { platform: storyKey, ...classified };
        if (!classified.retryable && !terminalFailure) terminalFailure = { platform: storyKey, ...classified };
      }
    }
  }

  if (acceptedCount === 0 && retryableFailure && Number(doc.attemptCount || 0) < MAX_ATTEMPTS) {
    await ref.update({
      status: "pending",
      stage: "waiting_dispatch",
      leaseExpiresAt: null,
      nextAttemptAt: futureTimestamp(getRetryDelayMs(Number(doc.attemptCount || 0))),
      bufferPosts,
      lastError: retryableFailure,
      lastMessage: retryableFailure.message,
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(ref.id, { ...doc, status: "pending", stage: "waiting_dispatch", bufferPosts, lastMessage: retryableFailure.message, lastError: retryableFailure });
    return;
  }

  const lastError = terminalFailure || retryableFailure || null;
  const status = acceptedCount > 0
    ? (lastError ? "partial" : "queued")
    : "failed";
  const stage = acceptedCount > 0 ? "awaiting_publish_confirmation" : "failed";
  const lastMessage = acceptedCount > 0
    ? (lastError ? "Queued in Buffer with some channel failures." : "Queued in Buffer. Waiting for publish confirmation.")
    : (lastError ? lastError.message : "Dispatch failed.");

  await ref.update({
    status,
    stage,
    organizationId: doc.organizationId || marketHealth.organizationId || "",
    leaseExpiresAt: null,
    bufferPosts,
    lastError,
    lastMessage,
    lastCheckedAt: FieldValue.serverTimestamp(),
    processedAt: status === "failed" ? FieldValue.serverTimestamp() : null,
    expiresAt: futureTimestamp(RETENTION_MS),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await syncQueueToJob(ref.id, {
    ...doc,
    status,
    stage,
    organizationId: doc.organizationId || marketHealth.organizationId || "",
    bufferPosts,
    lastError,
    lastMessage,
  });
}

async function dispatchDueQueueItems(bufferApiKeySecretsByMarket, limit = DISPATCH_BATCH_LIMIT) {
  await reclaimExpiredProcessingItems();
  const claimed = await claimDueQueueItems(limit);
  for (const doc of claimed) {
    await dispatchQueueDoc(bufferApiKeySecretsByMarket, doc);
  }
  return { processed: claimed.length };
}

async function reconcileQueueDoc(bufferApiKeySecretsByMarket, snap) {
  if (!snap.exists) return;
  const doc = { id: snap.id, ...snap.data() };
  if (doc.status === "partial" && doc.stage !== "awaiting_publish_confirmation") {
    return;
  }
  const marketKey = String(doc.marketKey || "").trim().toLowerCase();
  const secret = bufferApiKeySecretsByMarket[marketKey];
  const apiKey = secret && typeof secret.value === "function" ? secret.value() : "";
  const marketHealth = await ensureMarketHealth(bufferApiKeySecretsByMarket, marketKey);
  const organizationId = doc.organizationId || (marketHealth && marketHealth.organizationId) || "";
  if (!apiKey || !organizationId) {
    const isStale = Date.now() - toMillis(doc.updatedAt || doc.createdAt || 0) > STALE_CONFIRMATION_MS;
    if (!isStale) return;
    await snap.ref.update({
      status: "failed",
      stage: "failed",
      lastError: {
        message: "Buffer organizationId is missing; publish confirmation could not be completed.",
        retryable: false,
      },
      lastMessage: "Buffer organizationId is missing; publish confirmation could not be completed.",
      processedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(snap.id, {
      ...doc,
      status: "failed",
      stage: "failed",
      lastMessage: "Buffer organizationId is missing; publish confirmation could not be completed.",
    });
    return;
  }

  const bufferPosts = { ...(doc.bufferPosts || {}) };
  const groupedByChannel = {};
  Object.entries(bufferPosts).forEach(([key, post]) => {
    if (!post || !post.postId || post.state === "error" || post.state === "sent") return;
    const channelId = String(post.channelId || "").trim();
    if (!channelId) return;
    if (!groupedByChannel[channelId]) groupedByChannel[channelId] = [];
    groupedByChannel[channelId].push({ key, postId: post.postId });
  });

  for (const [channelId, posts] of Object.entries(groupedByChannel)) {
    const states = await bufferPostQueries.getPostStatesById(apiKey, {
      organizationId,
      channelId,
      postIds: posts.map((post) => post.postId),
    });

    posts.forEach(({ key, postId }) => {
      const matched = states[postId];
      if (!matched) return;
      if (matched.status === "sent") {
        bufferPosts[key] = {
          ...bufferPosts[key],
          state: "sent",
          sentAt: matched.createdAt || new Date().toISOString(),
        };
      } else if (matched.status === "error") {
        bufferPosts[key] = {
          ...bufferPosts[key],
          state: "error",
          error: "Buffer reported a publish error.",
          retryable: false,
        };
      } else {
        bufferPosts[key] = {
          ...bufferPosts[key],
          state: matched.status,
        };
      }
    });
  }

  const stale = Date.now() - toMillis(doc.updatedAt || doc.createdAt || 0) > STALE_CONFIRMATION_MS;
  if (stale) {
    Object.keys(bufferPosts).forEach((key) => {
      if (bufferPosts[key] && !["sent", "error"].includes(String(bufferPosts[key].state || "").toLowerCase())) {
        bufferPosts[key] = {
          ...bufferPosts[key],
          state: "error",
          error: "Publish confirmation timed out after 2 hours.",
          retryable: false,
        };
      }
    });
  }

  const outcome = deriveQueueStatusFromBufferPosts(bufferPosts);
  if (!QUEUE_TERMINAL_STATUSES.has(outcome.status) && !stale) {
    await snap.ref.update({
      bufferPosts,
      lastCheckedAt: FieldValue.serverTimestamp(),
      lastMessage: "Waiting for Buffer publish confirmation…",
      updatedAt: FieldValue.serverTimestamp(),
    });
    await syncQueueToJob(snap.id, {
      ...doc,
      bufferPosts,
      lastMessage: "Waiting for Buffer publish confirmation…",
    });
    return;
  }

  const errorEntry = Object.values(bufferPosts).find((post) => post && post.state === "error");
  await snap.ref.update({
    status: outcome.status,
    stage: outcome.stage,
    bufferPosts,
    lastCheckedAt: FieldValue.serverTimestamp(),
    lastError: errorEntry ? { message: errorEntry.error || "Buffer reported a publish error.", retryable: false } : null,
    lastMessage: outcome.status === "posted"
      ? "Publishing completed successfully."
      : outcome.status === "partial"
        ? "Publishing completed with some failures."
        : "Publishing failed.",
    processedAt: FieldValue.serverTimestamp(),
    expiresAt: futureTimestamp(RETENTION_MS),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await syncQueueToJob(snap.id, {
    ...doc,
    status: outcome.status,
    stage: outcome.stage,
    bufferPosts,
    lastMessage: outcome.status === "posted"
      ? "Publishing completed successfully."
      : outcome.status === "partial"
        ? "Publishing completed with some failures."
        : "Publishing failed.",
  });
}

async function reconcileQueuedItems(bufferApiKeySecretsByMarket) {
  const [queuedSnap, partialSnap] = await Promise.all([
    socialQueueRef().where("status", "==", "queued").get(),
    socialQueueRef().where("status", "==", "partial").get(),
  ]);

  const docs = [...queuedSnap.docs, ...partialSnap.docs];
  for (const doc of docs) {
    await reconcileQueueDoc(bufferApiKeySecretsByMarket, doc);
  }
  return { processed: docs.length };
}

async function deleteStorageFiles(paths = []) {
  const bucket = getStorage().bucket();
  const unique = [...new Set(paths.filter(Boolean))];
  await Promise.all(unique.map(async (path) => {
    try {
      await bucket.file(path).delete({ ignoreNotFound: true });
    } catch (error) {
      logger.warn(`purgeSocialPublishing: failed to delete ${path}: ${error.message}`);
    }
  }));
}

async function purgeExpiredSocialPublishing() {
  const queueStatuses = ["posted", "partial", "failed", "skipped"];
  let deletedDocs = 0;
  let deletedFiles = 0;

  for (const status of queueStatuses) {
    const snap = await socialQueueRef()
      .where("status", "==", status)
      .where("expiresAt", "<=", timestampNow())
      .get();

    for (const doc of snap.docs) {
      const data = doc.data() || {};
      const paths = [];
      if (Array.isArray(data.filenames) && data.filenames.length) {
        data.filenames.forEach((name) => paths.push(`generated_posters/${name}`));
      } else if (data.filename) {
        paths.push(`generated_posters/${data.filename}`);
      } else if (Array.isArray(data.mediaUrls)) {
        data.mediaUrls.forEach((url) => {
          const path = pathFromStorageUrl(url);
          if (path) paths.push(path);
        });
      } else if (data.mediaUrl) {
        const path = pathFromStorageUrl(data.mediaUrl);
        if (path) paths.push(path);
      }
      if (data.storyMediaUrl) {
        const path = pathFromStorageUrl(data.storyMediaUrl);
        if (path) paths.push(path);
      }

      await deleteStorageFiles(paths);
      deletedFiles += paths.length;
      await doc.ref.delete();
      deletedDocs += 1;
    }
  }

  const expiredJobs = await socialJobsRef()
    .where("expiresAt", "<=", timestampNow())
    .get();

  for (const jobDoc of expiredJobs.docs) {
    const itemsSnap = await jobDoc.ref.collection("items").get();
    const batch = db().batch();
    itemsSnap.docs.forEach((itemDoc) => batch.delete(itemDoc.ref));
    batch.delete(jobDoc.ref);
    await batch.commit();
  }

  return {
    deletedDocs,
    deletedFiles,
    deletedJobs: expiredJobs.size,
  };
}

function buildRefreshSocialPublishingHealth(requireAdmin, bufferApiKeySecretsByMarket) {
  const secrets = Object.values(bufferApiKeySecretsByMarket).filter(Boolean);
  return onCall(
    { region: "asia-south1", secrets },
    async (request) => {
      requireAdmin(request);
      const marketKey = String(request.data && request.data.marketKey || "").trim().toLowerCase();
      const keys = marketKey ? [marketKey] : null;
      const markets = await refreshSocialPublishingHealth(bufferApiKeySecretsByMarket, keys);
      return { success: true, markets };
    },
  );
}

function buildRunSocialQueueNow(requireAdmin, bufferApiKeySecretsByMarket) {
  const secrets = Object.values(bufferApiKeySecretsByMarket).filter(Boolean);
  return onCall(
    { region: "asia-south1", timeoutSeconds: 540, secrets },
    async (request) => {
      requireAdmin(request);
      const result = await dispatchDueQueueItems(bufferApiKeySecretsByMarket);
      return { success: true, ...result };
    },
  );
}

function buildRetrySocialJobItem(requireAdmin, bufferApiKeySecretsByMarket) {
  const secrets = Object.values(bufferApiKeySecretsByMarket).filter(Boolean);
  return onCall(
    { region: "asia-south1", timeoutSeconds: 540, secrets },
    async (request) => {
      requireAdmin(request);
      const jobId = String(request.data && request.data.jobId || "").trim();
      const itemId = String(request.data && request.data.itemId || "").trim();
      if (!jobId || !itemId) {
        throw new HttpsError("invalid-argument", "jobId and itemId are required.");
      }

      const itemSnap = await socialJobsRef().doc(jobId).collection("items").doc(itemId).get();
      if (!itemSnap.exists) {
        throw new HttpsError("not-found", "Social job item not found.");
      }

      const item = itemSnap.data() || {};
      const mediaUrls = Array.isArray(item.mediaUrls) && item.mediaUrls.length
        ? item.mediaUrls
        : (item.mediaUrl ? [item.mediaUrl] : []);
      if (!mediaUrls.length) {
        throw new HttpsError("failed-precondition", "This job item has no retained media to retry.");
      }

      const newItemId = await createSocialJobItem(jobId, {
        source: "retry",
        label: item.label || item.sectorCode || "",
        sectorId: item.sectorId || "",
        sectorCode: item.sectorCode || "",
        marketKey: item.marketKey || "",
        mediaType: item.mediaType || "image",
        ratio: item.ratio || null,
        status: "pending",
        stage: "waiting_dispatch",
        lastMessage: "Retry queued and waiting for dispatch.",
        platforms: Array.isArray(item.platforms) ? item.platforms : [],
        includeStories: item.includeStories === true,
        caption: item.caption || "",
        youtubeTitle: item.youtubeTitle || "",
        retryOfItemId: itemId,
        mediaUrl: item.mediaUrl || "",
        mediaUrls,
        storyMediaUrl: item.storyMediaUrl || "",
        filename: item.filename || "",
        filenames: Array.isArray(item.filenames) ? item.filenames : [],
        uploadedAt: FieldValue.serverTimestamp(),
      });

      const { queueId } = await enqueueExistingMedia({
        source: "retry",
        jobId,
        jobItemId: newItemId,
        retryOfItemId: itemId,
        marketKey: item.marketKey || "",
        mediaType: item.mediaType || "image",
        ratio: item.ratio || null,
        sectorId: item.sectorId || "",
        sectorCode: item.sectorCode || "",
        label: item.label || item.sectorCode || "",
        mediaUrl: item.mediaUrl || mediaUrls[0] || "",
        mediaUrls,
        storyMediaUrl: item.storyMediaUrl || "",
        filename: item.filename || "",
        filenames: Array.isArray(item.filenames) ? item.filenames : [],
        caption: item.caption || "",
        youtubeTitle: item.youtubeTitle || "",
        includeStories: item.includeStories === true,
        platforms: Array.isArray(item.platforms) ? item.platforms : [],
        lastMessage: "Retry queued and waiting for dispatch.",
      });

      await dispatchDueQueueItems(bufferApiKeySecretsByMarket, 1);
      return { success: true, jobId, itemId: newItemId, queueId };
    },
  );
}

function buildScheduledDispatcher(bufferApiKeySecretsByMarket) {
  const secrets = Object.values(bufferApiKeySecretsByMarket).filter(Boolean);
  return onSchedule(
    {
      region: "asia-south1",
      schedule: "every 1 minutes",
      timeoutSeconds: 540,
      secrets,
    },
    async () => {
      const result = await dispatchDueQueueItems(bufferApiKeySecretsByMarket);
      logger.info(`socialQueueDispatcher: processed ${result.processed}`);
    },
  );
}

function buildScheduledReconciler(bufferApiKeySecretsByMarket) {
  const secrets = Object.values(bufferApiKeySecretsByMarket).filter(Boolean);
  return onSchedule(
    {
      region: "asia-south1",
      schedule: "every 5 minutes",
      timeoutSeconds: 540,
      secrets,
    },
    async () => {
      const result = await reconcileQueuedItems(bufferApiKeySecretsByMarket);
      logger.info(`socialQueueReconciler: processed ${result.processed}`);
    },
  );
}

function buildPurgeSocialPublishing() {
  return onSchedule(
    {
      region: "asia-south1",
      schedule: "every 5 minutes",
      timeoutSeconds: 540,
    },
    async () => {
      const result = await purgeExpiredSocialPublishing();
      logger.info(`purgeSocialPublishing: deleted ${result.deletedDocs} queue docs, ${result.deletedFiles} files, ${result.deletedJobs} jobs`);
    },
  );
}

module.exports = {
  RETENTION_MS,
  buildRefreshSocialPublishingHealth,
  buildRunSocialQueueNow,
  buildRetrySocialJobItem,
  buildScheduledDispatcher,
  buildScheduledReconciler,
  buildPurgeSocialPublishing,
  createSocialJob,
  createSocialJobItem,
  updateSocialJobItem,
  syncSocialJobSummary,
  enqueueExistingMedia,
  refreshSocialPublishingHealth,
  dispatchDueQueueItems,
  reconcileQueuedItems,
  purgeExpiredSocialPublishing,
  inspectMarketHealth,
  getConfiguredChannelForMarket,
  buildQueueCreatePayload,
};
