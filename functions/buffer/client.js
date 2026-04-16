/**
 * Thin GraphQL client for the Buffer API.
 * Uses Node 22 native fetch. No deps.
 * Docs: https://developers.buffer.com
 */

const BUFFER_ENDPOINT = "https://api.buffer.com";

/**
 * Execute a GraphQL query/mutation against Buffer.
 * Throws on network failure, non-2xx status, or GraphQL errors.
 * @param {string} apiKey  — Buffer personal access token
 * @param {string} query
 * @param {object} [variables]
 * @returns {Promise<object>} the `data` payload
 */
async function bufferQuery(apiKey, query, variables = {}) {
  if (!apiKey) {
    throw new Error("bufferQuery: missing apiKey");
  }

  const res = await fetch(BUFFER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after")) || 15;
    const err = new Error(`Buffer rate limit exceeded (retry after ${retryAfter}s)`);
    err.retryAfter = retryAfter;
    err.rateLimited = true;
    throw err;
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Buffer HTTP ${res.status}: ${body.slice(0, 500)}`);
  }

  const payload = await res.json();
  if (payload.errors && payload.errors.length) {
    const msg = payload.errors.map((e) => e.message).join("; ");
    throw new Error(`Buffer GraphQL error: ${msg}`);
  }
  return payload.data || {};
}

module.exports = { bufferQuery };
