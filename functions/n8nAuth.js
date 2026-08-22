/**
 * Bearer auth for the n8n-facing onRequest endpoints.
 *
 * Pure: no Firestore, no firebase-functions, no network. That is what lets the
 * whole thing be unit tested, and it is why this lives beside airlineBaggage.js
 * rather than inside index.js.
 *
 * These endpoints are not decorative. `ingestFaresFromN8n` writes `agent_fares`,
 * which feeds getPublicFares / getPublicDeals / getB2BFares — so whoever holds
 * this token can publish fares on zamratravels.com. It was a literal string
 * committed to a public repo until this module replaced it.
 */

"use strict";

const crypto = require("crypto");

/**
 * The token this project shipped with, in plaintext, in a public repo.
 *
 * Kept only so a deploy cannot break the live Rate Upload tab in the window
 * between shipping the secret and rotating the n8n credential. Callers pass
 * allowLegacy explicitly and the accepting endpoint logs a warning, so the
 * remaining users are visible in Cloud Logging. Delete this constant — and the
 * allowLegacy branch — once those warnings stop.
 */
const LEGACY_TOKEN = "ZamraFirestore";

/** Pull the token out of `Authorization: Bearer <token>`, case-insensitively. */
function extractBearer(headerValue) {
  const match = /^Bearer\s+(.+)$/i.exec(String(headerValue ?? "").trim());
  return match ? match[1].trim() : "";
}

/**
 * Constant-time compare of two secrets of unknown length.
 *
 * Digesting first is the point: timingSafeEqual THROWS on a length mismatch, so
 * comparing raw tokens would leak the expected length through an exception and
 * crash the handler on a short one. Two SHA-256 digests are always 32 bytes.
 */
function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;
  const a = crypto.createHash("sha256").update(provided, "utf8").digest();
  const b = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * @param {string|undefined} authorizationHeader  raw Authorization header
 * @param {object} options
 * @param {string} options.secret        expected token (N8N_INGEST_TOKEN)
 * @param {boolean} [options.allowLegacy] also accept the old public literal
 * @returns {{ok: boolean, legacy: boolean}}
 */
function verifyN8nBearer(authorizationHeader, { secret, allowLegacy = false } = {}) {
  const provided = extractBearer(authorizationHeader);
  if (!provided) return { ok: false, legacy: false };

  // No configured secret means the deploy is misconfigured. Fail closed: a
  // missing secret must never widen access, only narrow it.
  if (typeof secret === "string" && secret && secretsMatch(provided, secret)) {
    return { ok: true, legacy: false };
  }

  if (allowLegacy && secretsMatch(provided, LEGACY_TOKEN)) {
    return { ok: true, legacy: true };
  }

  return { ok: false, legacy: false };
}

module.exports = { verifyN8nBearer, extractBearer, LEGACY_TOKEN };
