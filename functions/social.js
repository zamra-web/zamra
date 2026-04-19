/**
 * Zamra Travels — Social Auto-Post
 *
 * Consumes Firestore `social_queue` docs created by the admin dashboard and
 * posts the media to Instagram (feed/Reels), Facebook (Page photo/Reels),
 * and YouTube Shorts (video only). YouTube is skipped for images — the
 * YouTube Data API does not support community/image post creation.
 *
 * Secrets are read at invocation time (not module scope) so that the code
 * works even when the file is required before secrets are bound.
 */

const { FieldValue } = require("firebase-admin/firestore");
const { google } = require("googleapis");
const { Readable } = require("stream");

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";
const IG_POLL_INTERVAL_MS = 10000;
const IG_POLL_MAX_ATTEMPTS = 18; // ~3 minutes

function requireSecret(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing secret: ${name}`);
  return value;
}

async function graphPost(url, params) {
  const body = new URLSearchParams(params);
  const res = await fetch(url, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const msg = json.error?.message || `HTTP ${res.status}`;
    throw new Error(`Graph POST ${url} failed: ${msg}`);
  }
  return json;
}

async function graphGet(url) {
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const msg = json.error?.message || `HTTP ${res.status}`;
    throw new Error(`Graph GET ${url} failed: ${msg}`);
  }
  return json;
}

// ── Instagram ───────────────────────────────────────────────────────────────

async function postToInstagramImage(mediaUrl, caption) {
  const igId = requireSecret("IG_BUSINESS_ACCOUNT_ID");
  const token = requireSecret("META_PAGE_ACCESS_TOKEN");

  const container = await graphPost(`${GRAPH_API_BASE}/${igId}/media`, {
    image_url: mediaUrl,
    caption,
    access_token: token,
  });
  if (!container.id) throw new Error("IG image container missing id");

  const publish = await graphPost(`${GRAPH_API_BASE}/${igId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  });
  return { mediaId: publish.id };
}

async function pollIgContainer(containerId, token) {
  for (let i = 0; i < IG_POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, IG_POLL_INTERVAL_MS));
    const { status_code: status } = await graphGet(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${token}`
    );
    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") {
      throw new Error(`IG container status=${status}`);
    }
  }
  throw new Error(`IG container still processing after ${IG_POLL_MAX_ATTEMPTS * IG_POLL_INTERVAL_MS / 1000}s`);
}

async function postToInstagramReel(mediaUrl, caption) {
  const igId = requireSecret("IG_BUSINESS_ACCOUNT_ID");
  const token = requireSecret("META_PAGE_ACCESS_TOKEN");

  const container = await graphPost(`${GRAPH_API_BASE}/${igId}/media`, {
    media_type: "REELS",
    video_url: mediaUrl,
    caption,
    share_to_feed: "true",
    access_token: token,
  });
  if (!container.id) throw new Error("IG reel container missing id");

  await pollIgContainer(container.id, token);

  const publish = await graphPost(`${GRAPH_API_BASE}/${igId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  });
  return { mediaId: publish.id };
}

// ── Facebook Page ───────────────────────────────────────────────────────────

async function postToFacebookImage(mediaUrl, caption) {
  const pageId = requireSecret("FB_PAGE_ID");
  const token = requireSecret("META_PAGE_ACCESS_TOKEN");

  const result = await graphPost(`${GRAPH_API_BASE}/${pageId}/photos`, {
    url: mediaUrl,
    message: caption,
    access_token: token,
  });
  return { postId: result.post_id || result.id };
}

async function postToFacebookReel(mediaUrl, caption) {
  const pageId = requireSecret("FB_PAGE_ID");
  const token = requireSecret("META_PAGE_ACCESS_TOKEN");

  // Phase 1 — start: obtain video_id + upload_url
  const start = await graphPost(`${GRAPH_API_BASE}/${pageId}/video_reels`, {
    upload_phase: "start",
    access_token: token,
  });
  if (!start.video_id || !start.upload_url) {
    throw new Error("FB reel start phase missing video_id or upload_url");
  }

  // Phase 2 — transfer: tell FB to fetch the media from our Storage URL
  const uploadRes = await fetch(start.upload_url, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      file_url: mediaUrl,
    },
  });
  const uploadJson = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok || uploadJson.success === false) {
    throw new Error(`FB reel transfer failed: ${uploadJson.error?.message || `HTTP ${uploadRes.status}`}`);
  }

  // Phase 3 — finish: publish
  await graphPost(`${GRAPH_API_BASE}/${pageId}/video_reels`, {
    upload_phase: "finish",
    video_id: start.video_id,
    video_state: "PUBLISHED",
    description: caption,
    access_token: token,
  });
  return { postId: start.video_id };
}

// ── YouTube Shorts ──────────────────────────────────────────────────────────

async function postToYouTubeShort(mediaUrl, caption) {
  const clientId = requireSecret("YOUTUBE_CLIENT_ID");
  const clientSecret = requireSecret("YOUTUBE_CLIENT_SECRET");
  const refreshToken = requireSecret("YOUTUBE_REFRESH_TOKEN");

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2 });

  // Download MP4 into memory — posters are short 9:16 clips so size is small.
  const videoRes = await fetch(mediaUrl);
  if (!videoRes.ok) throw new Error(`Failed to fetch video: HTTP ${videoRes.status}`);
  const arrayBuf = await videoRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);

  const title = (caption || "Zamra Travels").slice(0, 90) + " #Shorts";

  const insertRes = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description: caption || "",
        tags: ["Shorts", "Zamra", "Travel"],
        categoryId: "19", // Travel & Events
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: Readable.from(buffer),
    },
  });

  const videoId = insertRes.data?.id;
  if (!videoId) throw new Error("YouTube insert returned no id");
  return { videoId };
}

// ── Dispatcher ──────────────────────────────────────────────────────────────

const DISPATCH = {
  instagram: { image: postToInstagramImage, video: postToInstagramReel },
  facebook:  { image: postToFacebookImage,  video: postToFacebookReel  },
  youtube:   { image: null,                 video: postToYouTubeShort  },
};

async function runPlatform(platform, mediaType, mediaUrl, caption) {
  const fn = DISPATCH[platform]?.[mediaType];
  if (!fn) return { success: false, skipped: true, reason: `No ${platform} handler for ${mediaType}` };
  try {
    const out = await fn(mediaUrl, caption);
    return { success: true, ...out, postedAt: new Date().toISOString() };
  } catch (e) {
    return { success: false, error: String(e?.message || e) };
  }
}

/**
 * Process a single social_queue document. Meant to be called from the
 * Firestore onCreate trigger — expects the raw snapshot.
 */
async function processSocialQueueItem(snap) {
  const data = snap.data() || {};
  const ref = snap.ref;

  // Idempotency guard: only process docs that are still pending.
  if (data.status && data.status !== "pending") {
    console.log(`[social] skip ${ref.id}: status=${data.status}`);
    return;
  }

  const { mediaUrl, mediaType, caption, platforms } = data;
  if (!mediaUrl || !mediaType || !Array.isArray(platforms) || !platforms.length) {
    await ref.update({
      status: "failed",
      results: { _: { success: false, error: "Invalid queue item: missing mediaUrl/mediaType/platforms" } },
      updatedAt: FieldValue.serverTimestamp(),
    });
    return;
  }

  await ref.update({
    status: "processing",
    processingStartedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const entries = await Promise.all(
    platforms.map(async (p) => [p, await runPlatform(p, mediaType, mediaUrl, caption || "")])
  );
  const results = Object.fromEntries(entries);

  // Ignore skipped platforms (e.g. youtube for images) when computing status.
  const real = entries.filter(([, r]) => !r.skipped);
  const allOk = real.length > 0 && real.every(([, r]) => r.success);
  const anyOk = real.some(([, r]) => r.success);
  const status = allOk ? "posted" : anyOk ? "partial" : "failed";

  await ref.update({
    status,
    results,
    postedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`[social] ${ref.id} → ${status}`, results);
}

module.exports = { processSocialQueueItem };
