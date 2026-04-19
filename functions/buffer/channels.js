/**
 * Buffer channel discovery + caching.
 * Maps Zamra's platform slugs (instagram/facebook/youtube) to Buffer channel IDs.
 */

const { getFirestore } = require("firebase-admin/firestore");
const { bufferQuery } = require("./client");

const CONFIG_DOC = "config/buffer";

const GET_CHANNELS_QUERY = `
  query GetChannels($organizationId: OrganizationId!) {
    channels(input: { organizationId: $organizationId }) {
      id
      name
      displayName
      service
      isQueuePaused
    }
  }
`;

const GET_ORGANIZATIONS_QUERY = `
  query GetOrganizations {
    account {
      organizations {
        id
      }
    }
  }
`;

const GET_CHANNEL_QUERY = `
  query GetChannel($id: ChannelId!) {
    channel(input: { id: $id }) {
      id
      name
      displayName
      service
      avatar
      isQueuePaused
    }
  }
`;

/**
 * Fetch all channels for an org directly from Buffer.
 * @param {string} apiKey
 * @param {string} organizationId
 */
async function fetchBufferChannels(apiKey, organizationId) {
  const data = await bufferQuery(apiKey, GET_CHANNELS_QUERY, { organizationId });
  return Array.isArray(data.channels) ? data.channels : [];
}

/**
 * Fetch organizations for the current Buffer account.
 * @param {string} apiKey
 * @returns {Promise<string[]>}
 */
async function fetchOrganizations(apiKey) {
  const data = await bufferQuery(apiKey, GET_ORGANIZATIONS_QUERY);
  const orgs = data && data.account && Array.isArray(data.account.organizations)
    ? data.account.organizations
    : [];
  return orgs.map((org) => String(org.id || "").trim()).filter(Boolean);
}

/**
 * Fetch a single Buffer channel by id.
 * @param {string} apiKey
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function fetchChannelById(apiKey, id) {
  const data = await bufferQuery(apiKey, GET_CHANNEL_QUERY, { id });
  return data && data.channel ? data.channel : null;
}

/**
 * Build the { instagram, facebook, youtube } → { id, name } map.
 * Buffer's `service` field is lowercase (`instagram`, `facebook`, `youtube`).
 */
function channelsByService(channels) {
  const out = {};
  for (const ch of channels) {
    const key = String(ch.service || "").toLowerCase();
    if (!out[key]) {
      out[key] = { id: ch.id, name: ch.displayName || ch.name || "" };
    }
  }
  return out;
}

/**
 * Read cached channel map from Firestore `config/buffer`.
 * Returns { organizationId, channels: { instagram, facebook, youtube } } or null.
 */
async function readCachedChannels() {
  const snap = await getFirestore().doc(CONFIG_DOC).get();
  if (!snap.exists) return null;
  const data = snap.data() || {};
  if (!data.channels) return null;
  return data;
}

/**
 * Refresh the cache: query Buffer, write to Firestore. Returns the new map.
 * @param {string} apiKey
 * @param {string} organizationId
 */
async function refreshChannelCache(apiKey, organizationId) {
  const channels = await fetchBufferChannels(apiKey, organizationId);
  const byService = channelsByService(channels);
  const payload = {
    organizationId,
    channels: byService,
    rawCount: channels.length,
    updatedAt: new Date().toISOString(),
  };
  await getFirestore().doc(CONFIG_DOC).set(payload, { merge: true });
  return payload;
}

module.exports = {
  fetchBufferChannels,
  fetchOrganizations,
  fetchChannelById,
  channelsByService,
  readCachedChannels,
  refreshChannelCache,
};
