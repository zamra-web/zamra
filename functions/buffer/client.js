/**
 * Thin GraphQL client for the Buffer API.
 * Uses Node 22 native fetch. No deps.
 * Docs: https://developers.buffer.com
 */

const { getFirestore } = require("firebase-admin/firestore");

const BUFFER_ENDPOINT = "https://api.buffer.com";
const RATE_LIMIT_DOC = "config/buffer";

// The rate-limit floor is cached in-memory for the lifetime of this function
// invocation so we don't pay a Firestore read on every bufferQuery call.
let cachedRateLimitedUntilMs = 0;
let cachedRateLimitedFetchedAtMs = 0;

async function readRateLimitedUntilMs() {
  if (cachedRateLimitedUntilMs && Date.now() < cachedRateLimitedUntilMs) {
    return cachedRateLimitedUntilMs;
  }
  if (Date.now() - cachedRateLimitedFetchedAtMs < 30 * 1000) {
    return cachedRateLimitedUntilMs;
  }
  try {
    const snap = await getFirestore().doc(RATE_LIMIT_DOC).get();
    const data = snap.exists ? snap.data() || {} : {};
    const raw = data.rateLimitedUntilMs;
    cachedRateLimitedUntilMs = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
    cachedRateLimitedFetchedAtMs = Date.now();
  } catch {
    cachedRateLimitedFetchedAtMs = Date.now();
  }
  return cachedRateLimitedUntilMs;
}

async function writeRateLimitedUntilMs(untilMs) {
  cachedRateLimitedUntilMs = untilMs;
  cachedRateLimitedFetchedAtMs = Date.now();
  try {
    await getFirestore().doc(RATE_LIMIT_DOC).set({
      rateLimitedUntilMs: untilMs,
      rateLimitedUpdatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch {
    // Non-fatal: the in-memory cache still protects this invocation.
  }
}

function buildRateLimitedError(retryAfterSeconds) {
  const err = new Error(`Buffer rate limit exceeded (retry after ${retryAfterSeconds}s)`);
  err.retryAfter = retryAfterSeconds;
  err.rateLimited = true;
  return err;
}

/**
 * Execute a GraphQL query/mutation against Buffer.
 * Throws on network failure, non-2xx status, or GraphQL errors.
 * If Buffer has told us to back off recently, short-circuits without an HTTP call.
 * @param {string} apiKey  — Buffer personal access token
 * @param {string} query
 * @param {object} [variables]
 * @returns {Promise<object>} the `data` payload
 */
async function bufferQuery(apiKey, query, variables = {}) {
  if (!apiKey) {
    throw new Error("bufferQuery: missing apiKey");
  }

  const floorMs = await readRateLimitedUntilMs();
  if (floorMs && Date.now() < floorMs) {
    const retryAfter = Math.max(1, Math.ceil((floorMs - Date.now()) / 1000));
    throw buildRateLimitedError(retryAfter);
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
    await writeRateLimitedUntilMs(Date.now() + retryAfter * 1000);
    throw buildRateLimitedError(retryAfter);
  }

  if (!res.ok) {
    const body = await res.text();
    // Try to extract clean GraphQL error messages from 4xx responses.
    if (res.status >= 400 && res.status < 500) {
      try {
        const parsed = JSON.parse(body);
        if (parsed.errors && parsed.errors.length) {
          const msg = parsed.errors.map((e) => e.message).join("; ");
          throw new Error(`Buffer GraphQL error (HTTP ${res.status}): ${msg}`);
        }
      } catch (parseErr) {
        if (parseErr.message.startsWith("Buffer GraphQL")) throw parseErr;
        // Fall through to generic error below.
      }
    }
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
