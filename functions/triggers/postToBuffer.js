/**
 * Firestore trigger: social_queue/{queueId} onDocumentCreated.
 * Fans out a newly queued image/video to the configured Buffer channels
 * (one GraphQL mutation per platform). Writes results back to the doc.
 *
 * Platform mapping:
 *   - instagram → Buffer IG channel (images + videos)
 *   - facebook  → Buffer FB channel (images + videos)
 *   - youtube   → Buffer YT channel (videos only; skipped for images)
 *
 * Status transitions:
 *   pending → queued   (at least one channel succeeded)
 *   pending → failed   (all channels failed, or no eligible channels)
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { FieldValue } = require("firebase-admin/firestore");
const { readCachedChannels } = require("../buffer/channels");
const { createPostOnChannel } = require("../buffer/createPost");

const ELIGIBLE_PLATFORMS = ["instagram", "facebook", "youtube"];
const STORY_PLATFORMS = ["instagram", "facebook"];

function build(bufferApiKeySecret) {
  return onDocumentCreated(
    {
      document: "social_queue/{queueId}",
      region: "asia-south1",
      secrets: [bufferApiKeySecret],
    },
    async (event) => {
      const snap = event.data;
      if (!snap) return;
      const doc = snap.data() || {};

      if (doc.status !== "pending") {
        console.log(`[postToBuffer] skip ${snap.id}: status=${doc.status}`);
        return;
      }

      const mediaType = doc.mediaType === "video" ? "video" : "image";
      const mediaUrls = Array.isArray(doc.mediaUrls) && doc.mediaUrls.length
        ? doc.mediaUrls.filter(Boolean)
        : (doc.mediaUrl ? [doc.mediaUrl] : []);
      const caption = doc.caption || "";
      const ratio = doc.ratio || null;
      const requestedPlatforms = Array.isArray(doc.platforms) ? doc.platforms : [];
      const includeStories = doc.includeStories === true && mediaType === "image";
      const storyMediaUrl = typeof doc.storyMediaUrl === "string" && doc.storyMediaUrl ? doc.storyMediaUrl : null;

      if (mediaUrls.length === 0) {
        await snap.ref.update({
          status: "failed",
          errors: [{ platform: null, message: "mediaUrl(s) missing on queue doc" }],
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const apiKey = bufferApiKeySecret.value();
      if (!apiKey) {
        await snap.ref.update({
          status: "failed",
          errors: [{ platform: null, message: "BUFFER_API_KEY secret not set" }],
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const cached = await readCachedChannels();
      if (!cached || !cached.channels) {
        await snap.ref.update({
          status: "failed",
          errors: [{ platform: null, message: "Buffer channel cache empty — run syncBufferChannels first" }],
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const targets = [];
      for (const platform of requestedPlatforms) {
        const key = String(platform).toLowerCase();
        if (!ELIGIBLE_PLATFORMS.includes(key)) continue;
        if (key === "youtube" && mediaType !== "video") continue;
        const channel = cached.channels[key];
        if (!channel || !channel.id) {
          continue;
        }
        targets.push({ platform: key, channelId: channel.id });
      }

      if (targets.length === 0) {
        await snap.ref.update({
          status: "failed",
          errors: [{ platform: null, message: "No eligible channels for this queue item" }],
          processedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const bufferPostIds = {};
      const errors = [];

      for (const target of targets) {
        const result = await createPostOnChannel({
          apiKey,
          channelId: target.channelId,
          platform: target.platform,
          text: caption,
          mediaUrls,
          mediaType,
          ratio,
        });
        if (result.ok) {
          bufferPostIds[target.platform] = result.postId;
          console.log(`[postToBuffer] ${snap.id} → ${target.platform}: ok postId=${result.postId}`);
        } else {
          errors.push({ platform: target.platform, message: result.error });
          console.error(`[postToBuffer] ${snap.id} → ${target.platform}: ${result.error}`);
        }

        if (includeStories && STORY_PLATFORMS.includes(target.platform)) {
          // Stories don't support carousels — post only one image.
          // Prefer the 9:16 story render when the producer uploaded one;
          // otherwise fall back to the first feed image.
          const storyUrl = storyMediaUrl || mediaUrls[0];
          const storyResult = await createPostOnChannel({
            apiKey,
            channelId: target.channelId,
            platform: target.platform,
            text: caption,
            mediaUrls: [storyUrl],
            mediaType,
            ratio: storyMediaUrl ? "9x16" : ratio,
            postType: "story",
          });
          const storyKey = `${target.platform}_story`;
          if (storyResult.ok) {
            bufferPostIds[storyKey] = storyResult.postId;
            console.log(`[postToBuffer] ${snap.id} → ${storyKey}: ok postId=${storyResult.postId}`);
          } else {
            errors.push({ platform: storyKey, message: storyResult.error });
            console.error(`[postToBuffer] ${snap.id} → ${storyKey}: ${storyResult.error}`);
          }
        }
      }

      const anySuccess = Object.keys(bufferPostIds).length > 0;
      await snap.ref.update({
        status: anySuccess ? "queued" : "failed",
        bufferPostIds,
        errors,
        processedAt: FieldValue.serverTimestamp(),
      });
    },
  );
}

module.exports = { build };
