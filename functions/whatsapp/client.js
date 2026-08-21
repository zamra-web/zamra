/**
 * client.js — thin HTTP client for the self-hosted WAHA instance.
 *
 * Node 22 native fetch, no deps, same shape as functions/buffer/client.js.
 * WAHA runs on the Hostinger VPS beside n8n (see infra/README.md) and is
 * reached over HTTPS with an X-Api-Key header.
 */

"use strict";

// Not a secret — it is a public hostname, and an active secret version is
// billed monthly. The env override exists so the emulator can point at a local
// container.
const WAHA_BASE_URL = (process.env.WAHA_BASE_URL || "https://waha.zamratravels.com").replace(/\/+$/, "");

// A hung VPS must not pin a Cloud Run instance open for the full 60s default.
const WAHA_TIMEOUT_MS = 15000;

/**
 * Error carrying the upstream status so the callable layer can map it.
 * `body` is for logs only — WAHA error bodies echo the request config back,
 * which is exactly what must not reach the browser.
 */
class WahaError extends Error {
  /**
   * @param {string} message
   * @param {{status?: number, body?: unknown}} [options]
   */
  constructor(message, { status = 0, body = null } = {}) {
    super(message);
    this.name = "WahaError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Call the WAHA REST API.
 *
 * @param {string} apiKey  plaintext key; the VPS stores only its sha512 hash
 * @param {"GET"|"POST"|"PUT"|"DELETE"} method
 * @param {string} path    e.g. "/api/sessions/zamra"
 * @param {object|null} [body]
 * @returns {Promise<{status: number, body: any}>}
 * @throws {WahaError} on timeout, network failure, or a non-2xx response
 */
async function wahaFetch(apiKey, method, path, body = null) {
  if (!apiKey || typeof apiKey !== "string") {
    throw new WahaError("WAHA API key is not configured");
  }

  const url = `${WAHA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const init = {
    method,
    headers: {
      "X-Api-Key": apiKey,
      "Accept": "application/json",
    },
    signal: AbortSignal.timeout(WAHA_TIMEOUT_MS),
  };
  if (body !== null && body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    throw new WahaError(
      timedOut ? `WAHA did not respond within ${WAHA_TIMEOUT_MS}ms` : `WAHA is unreachable: ${error?.message || error}`,
      { status: timedOut ? 504 : 502 },
    );
  }

  const text = await response.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    throw new WahaError(`WAHA responded ${response.status}`, { status: response.status, body: parsed });
  }

  return { status: response.status, body: parsed };
}

module.exports = { wahaFetch, WahaError, WAHA_BASE_URL, WAHA_TIMEOUT_MS };
