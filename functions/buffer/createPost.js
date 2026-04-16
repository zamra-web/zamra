/**
 * Creates a Buffer post on a single channel.
 * Buffer's createPost mutation accepts only one channelId per call, so we fan out
 * from the Firestore trigger.
 */

const { bufferQuery } = require("./client");

const CREATE_POST_MUTATION = `
  mutation CreatePost(
    $channelId: ChannelId!
    $text: String!
    $assets: AssetsInput
  ) {
    createPost(input: {
      channelId: $channelId
      text: $text
      schedulingType: automatic
      mode: addToQueue
      assets: $assets
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

/**
 * Build the assets input based on mediaType.
 * Buffer references media by URL — no direct upload needed.
 */
function buildAssets({ mediaType, mediaUrl }) {
  if (!mediaUrl) return null;
  if (mediaType === "video") {
    return { videos: [{ url: mediaUrl }] };
  }
  return { images: [{ url: mediaUrl }] };
}

/**
 * Create a post on a single Buffer channel.
 * Retries once on 429 after the server-indicated delay.
 *
 * @param {object} params
 * @param {string} params.apiKey
 * @param {string} params.channelId
 * @param {string} params.text
 * @param {string} params.mediaUrl
 * @param {'image'|'video'} params.mediaType
 * @returns {Promise<{ ok: boolean, postId?: string, error?: string }>}
 */
async function createPostOnChannel({ apiKey, channelId, text, mediaUrl, mediaType }) {
  const variables = {
    channelId,
    text: text || "",
    assets: buildAssets({ mediaType, mediaUrl }),
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

module.exports = { createPostOnChannel };
