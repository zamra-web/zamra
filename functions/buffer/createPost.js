/**
 * Creates a Buffer post on a single channel.
 * Buffer's createPost mutation accepts only one channelId per call, so we fan out
 * from the Firestore trigger.
 *
 * Each platform requires its own `metadata` shape:
 *   - instagram: { type: post|reel, shouldShareToFeed: true }
 *                { type: story, shouldShareToFeed: false }
 *   - facebook:  { type: post } // story publishing intentionally disabled
 *   - youtube:   { title, categoryId }
 */

const { bufferQuery } = require("./client");

const CREATE_POST_MUTATION = `
  mutation CreatePost(
    $channelId: ChannelId!
    $text: String!
    $assets: AssetsInput
    $metadata: PostInputMetaData
  ) {
    createPost(input: {
      channelId: $channelId
      text: $text
      schedulingType: automatic
      mode: shareNow
      assets: $assets
      metadata: $metadata
    }) {
      ... on PostActionSuccess {
        post { id }
      }
      ... on MutationError {
        message
      }
    }
  }
`;

// YouTube category 22 = "People & Blogs" (widely accepted, safe default).
const YOUTUBE_DEFAULT_CATEGORY = "22";

function buildAssets({ mediaType, mediaUrls }) {
  const urls = Array.isArray(mediaUrls) ? mediaUrls.filter(Boolean) : [];
  if (urls.length === 0) return null;
  if (mediaType === "video") {
    return { videos: urls.map((url) => ({ url })) };
  }
  return { images: urls.map((url) => ({ url })) };
}

/**
 * Build per-platform metadata. `ratio` is the video aspect ("1x1", "9x16",
 * "16x9"); null for images. `postType` is "feed" (default) or "story".
 */
function buildMetadata({ platform, mediaType, text, postType, youtubeTitle }) {
  const normalizedPlatform = String(platform || "").trim().toLowerCase();

  if (normalizedPlatform === "instagram") {
    if (postType === "story") {
      return { instagram: { type: "story", shouldShareToFeed: false } };
    }
    // All IG videos publish as Reels; images as feed posts.
    const type = mediaType === "video" ? "reel" : "post";
    return { instagram: { type, shouldShareToFeed: true } };
  }
  if (normalizedPlatform === "facebook") {
    return { facebook: { type: "post" } };
  }
  if (normalizedPlatform === "youtube") {
    // YouTube requires title + categoryId. Fall back to a sensible title.
    const title = (youtubeTitle || text || "").trim().slice(0, 100) || "Zamra Travels";
    return {
      youtube: {
        title,
        categoryId: YOUTUBE_DEFAULT_CATEGORY,
      },
    };
  }
  return null;
}

/**
 * Create a post on a single Buffer channel.
 * Retries once on 429 after the server-indicated delay.
 * When mediaUrls has more than one image, it's posted as a carousel (IG/FB).
 *
 * @param {object} params
 * @param {string} params.apiKey
 * @param {string} params.channelId
 * @param {string} params.platform    — 'instagram' | 'facebook' | 'youtube'
 * @param {string} params.text
 * @param {string[]} params.mediaUrls — one or more media URLs
 * @param {'image'|'video'} params.mediaType
 * @param {'feed'|'story'} [params.postType='feed']
 * @param {string} [params.youtubeTitle]
 * @returns {Promise<{ ok: boolean, postId?: string, error?: string }>}
 */
async function createPostOnChannel({
  apiKey,
  channelId,
  platform,
  text,
  mediaUrls,
  mediaType,
  postType = "feed",
  youtubeTitle = "",
}) {
  const normalizedPlatform = String(platform || "").trim().toLowerCase();

  if (normalizedPlatform === "facebook" && postType === "story") {
    return { ok: false, error: "Facebook story publishing is disabled for Zamra social jobs." };
  }

  const variables = {
    channelId,
    text: text || "",
    assets: buildAssets({ mediaType, mediaUrls }),
    metadata: buildMetadata({ platform: normalizedPlatform, mediaType, text, postType, youtubeTitle }),
  };

  try {
    const data = await runWithRateLimitRetry(apiKey, variables);
    const result = data && data.createPost;
    if (result && result.post && result.post.id) {
      return { ok: true, postId: result.post.id };
    }
    const msg = (result && result.message) || "Unknown Buffer response";
    return { ok: false, error: msg };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

async function runWithRateLimitRetry(apiKey, variables) {
  try {
    return await bufferQuery(apiKey, CREATE_POST_MUTATION, variables);
  } catch (err) {
    if (err.rateLimited) {
      const waitMs = Math.min(Number(err.retryAfter) || 15, 60) * 1000;
      await new Promise((r) => setTimeout(r, waitMs));
      return await bufferQuery(apiKey, CREATE_POST_MUTATION, variables);
    }
    throw err;
  }
}

module.exports = { createPostOnChannel, buildMetadata };
