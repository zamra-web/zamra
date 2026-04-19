/**
 * Scheduled function: generates daily posters for configured sectors and
 * queues them to Buffer via the existing social_queue flow.
 *
 * Configured by the Firestore doc `posting_schedule/daily`:
 *   {
 *     enabled:        boolean,
 *     sectorIds:      string[],            // which sectors to post today
 *     platforms:      string[],            // ["instagram","facebook"] — default
 *     captionTemplate:string,              // optional; {from},{to},{code},{cheapest}
 *     maxRows:        number,              // default 8
 *     dateWindowDays: number,              // default 30
 *     includeStories: boolean,             // default true
 *   }
 *
 * Schedule is fixed at 10:00 Asia/Kolkata at deploy time. If you want to
 * change the hour, update the `schedule` option below and redeploy.
 */

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions/v2");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const { fetchDailyFares } = require("../poster/fetchFares");
const { fetchLogos } = require("../poster/fetchLogos");
const { buildDailyPosterHtml, buildCaption } = require("../poster/dailyTemplate");
const { renderHtmlBatch } = require("../poster/render");
const { uploadAndQueue } = require("../poster/queueSocial");
const { resolveSectorMarketKey } = require("../buffer/marketConfig");
const {
  createSocialJob,
  createSocialJobItem,
  updateSocialJobItem,
  syncSocialJobSummary,
} = require("../social/pipeline");

const fileSafe = (s) =>
  String(s || "")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

async function readConfig() {
  const snap = await getFirestore().doc("posting_schedule/daily").get();
  if (!snap.exists) return null;
  return snap.data();
}

async function loadSectors(sectorIds) {
  const db = getFirestore();
  const snaps = await Promise.all(sectorIds.map((id) => db.collection("sectors").doc(id).get()));
  const map = {};
  snaps.forEach((s) => {
    if (s.exists) map[s.id] = { id: s.id, ...s.data() };
  });
  return map;
}

async function runDailyPost() {
  const cfg = await readConfig();
  if (!cfg) {
    logger.info("autoPostDaily: no posting_schedule/daily doc — skipping");
    return;
  }
  if (cfg.enabled === false) {
    logger.info("autoPostDaily: disabled — skipping");
    return;
  }
  const sectorIds = Array.isArray(cfg.sectorIds) ? cfg.sectorIds.filter(Boolean) : [];
  if (!sectorIds.length) {
    logger.info("autoPostDaily: no sectorIds configured — skipping");
    return;
  }

  const platforms = Array.isArray(cfg.platforms) && cfg.platforms.length
    ? cfg.platforms
    : ["instagram", "facebook"];
  const maxRows = cfg.maxRows || 8;
  const dateWindowDays = cfg.dateWindowDays || 30;
  const includeStories = cfg.includeStories !== false;

  const sectorMap = await loadSectors(sectorIds);

  // Step 1: gather fares + logos for every sector.
  const jobs = [];
  for (const sectorId of sectorIds) {
    const sector = sectorMap[sectorId];
    if (!sector) {
      logger.warn(`autoPostDaily: sector ${sectorId} not found — skipping`);
      continue;
    }
    const fares = await fetchDailyFares(sectorId, { maxRows, dateWindowDays });
    if (!fares.length) {
      logger.info(`autoPostDaily: no fares for sector ${sectorId} (${sector.sectorCode}) — skipping`);
      continue;
    }
    const airlineIds = fares.map((f) => f.airlineId);
    const { airlineMap, logoMap } = await fetchLogos(airlineIds);
    const html = buildDailyPosterHtml({ sector, fares, airlineMap, logoMap });
    const caption = buildCaption({ sector, fares, customTemplate: cfg.captionTemplate });
    jobs.push({ sector, fares, html, caption });
  }

  if (!jobs.length) {
    logger.info("autoPostDaily: nothing to render");
    return;
  }

  // Step 2: batch-render all HTMLs with a single browser.
  logger.info(`autoPostDaily: rendering ${jobs.length} poster(s)`);
  const jobId = await createSocialJob({
    source: "autoPostDaily",
    mediaType: "image",
    status: "processing",
    currentStage: "rendering",
    lastMessage: `Rendering ${jobs.length} scheduled poster${jobs.length > 1 ? "s" : ""}.`,
    requestedBy: { type: "system", label: "autoPostDaily" },
    plannedItems: jobs.length,
  });

  const itemIds = [];
  for (const job of jobs) {
    const itemId = await createSocialJobItem(jobId, {
      source: "autoPostDaily",
      label: job.sector.sectorCode || job.sector.id,
      sectorId: job.sector.id,
      sectorCode: job.sector.sectorCode || "",
      marketKey: resolveSectorMarketKey(job.sector) || "",
      mediaType: "image",
      ratio: "4x5",
      status: "pending",
      stage: "rendering",
      lastMessage: "Waiting for server-side poster render.",
      platforms,
      includeStories,
      caption: job.caption,
    });
    itemIds.push(itemId);
  }

  const buffers = await renderHtmlBatch(jobs.map((j) => j.html));

  // Step 3: upload each + enqueue to social_queue. Existing trigger does the rest.
  const ts = Date.now();
  for (let i = 0; i < jobs.length; i++) {
    const { sector, caption } = jobs[i];
    const itemId = itemIds[i];
    const buf = buffers[i];
    const filename = `daily-${fileSafe(sector.sectorCode || sector.id)}-4x5-${ts}-${i}.jpg`;
    const marketKey = resolveSectorMarketKey(sector);
    if (!marketKey) {
      await updateSocialJobItem(jobId, itemId, {
        status: "failed",
        stage: "failed",
        lastMessage: `Airport group could not be resolved for ${sector.sectorCode || sector.id}.`,
        lastError: { message: `Airport group could not be resolved for ${sector.sectorCode || sector.id}.`, retryable: false },
      });
      logger.warn(`autoPostDaily: airport group not resolved for ${sector.sectorCode || sector.id} — skipping`);
      continue;
    }
    try {
      await updateSocialJobItem(jobId, itemId, {
        status: "pending",
        stage: "uploading",
        renderedAt: FieldValue.serverTimestamp(),
        lastMessage: "Rendered successfully. Uploading poster media…",
      });
      const { queueId } = await uploadAndQueue(buf, filename, {
        source: "autoPostDaily",
        jobId,
        jobItemId: itemId,
        sectorId: sector.id,
        sectorCode: sector.sectorCode || "",
        marketKey,
        ratio: "4x5",
        caption,
        platforms,
        includeStories,
      });
      await updateSocialJobItem(jobId, itemId, {
        queueId,
        status: "pending",
        stage: "waiting_dispatch",
        uploadedAt: FieldValue.serverTimestamp(),
        mediaUrl: "",
        mediaUrls: [],
        filename,
        filenames: [filename],
        lastMessage: "Uploaded and waiting for Buffer dispatch.",
      });
      logger.info(`autoPostDaily: queued ${sector.sectorCode || sector.id} → ${queueId}`);
    } catch (e) {
      await updateSocialJobItem(jobId, itemId, {
        status: "failed",
        stage: "failed",
        lastMessage: e.message || `Failed to enqueue ${sector.sectorCode || sector.id}.`,
        lastError: { message: e.message || String(e), retryable: false },
      });
      logger.error(`autoPostDaily: enqueue failed for ${sector.id}`, e);
    }
  }

  await syncSocialJobSummary(jobId);
}

function build() {
  return onSchedule(
    {
      region: "asia-south1",
      schedule: "0 10 * * *",
      timeZone: "Asia/Kolkata",
      memory: "2GiB",
      timeoutSeconds: 540,
    },
    runDailyPost,
  );
}

module.exports = { build, runDailyPost };
