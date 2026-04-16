/**
 * Callable function: syncBufferChannels
 * Admin-only. Discovers connected channels in Buffer and caches their IDs to
 * Firestore config/buffer. Run once after connecting accounts in Buffer,
 * and again whenever channels are added/removed/reconnected.
 *
 * Input:
 *   - organizationId (string, optional if already cached)
 * Output:
 *   - { success, organizationId, channels: { instagram, facebook, youtube } }
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { refreshChannelCache, readCachedChannels } = require("../buffer/channels");

function build(requireAdmin, bufferApiKeySecret) {
  return onCall(
    { region: "asia-south1", secrets: [bufferApiKeySecret] },
    async (request) => {
      requireAdmin(request);

      const apiKey = bufferApiKeySecret.value();
      if (!apiKey) {
        throw new HttpsError("failed-precondition", "BUFFER_API_KEY secret is not set.");
      }

      let organizationId = (request.data && request.data.organizationId) || null;
      if (!organizationId) {
        const cached = await readCachedChannels();
        organizationId = cached && cached.organizationId;
      }
      if (!organizationId) {
        throw new HttpsError(
          "invalid-argument",
          "organizationId is required on the first run. Find it in Buffer's URL after logging in.",
        );
      }

      const result = await refreshChannelCache(apiKey, organizationId);
      return {
        success: true,
        organizationId: result.organizationId,
        channels: result.channels,
        rawCount: result.rawCount,
      };
    },
  );
}

module.exports = { build };
