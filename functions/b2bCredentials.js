"use strict";

/**
 * b2bCredentials.js — password custody + presence helpers for the B2B portal.
 *
 * Admins asked to be able to re-read an agent's current password at any time,
 * not just at creation. Firebase Auth stores password hashes and cannot give
 * one back, so the only way to satisfy that is to keep our own copy. This
 * module holds everything that makes keeping that copy defensible:
 *
 *   - the copy is AES-256-GCM ciphertext, never plaintext, and lives in
 *     `b2b_credentials/{agentId}` which Firestore rules deny to every client
 *     (see firestore.rules) — it is reachable only through the admin-gated
 *     getB2BAgentCredentials callable, which runs on the Admin SDK;
 *   - the key never ships to a browser. It comes from the B2B_CRED_KEY env var
 *     when one is set, otherwise from a server-generated key parked in
 *     `config/b2b_secure`, which the same rules deny to clients.
 *
 * This is deliberately reversible encryption, so treat it as "protected at
 * rest and behind an admin claim", NOT as a password hash. Anyone who holds
 * both the Firestore data and the key can read agent passwords.
 *
 * Everything here is pure except loadCredentialKey(), so it unit-tests without
 * Firestore.
 */

const crypto = require("node:crypto");

const CIPHER_ALG = "aes-256-gcm";
const IV_BYTES = 12;
const CRED_KEY_ENV = "B2B_CRED_KEY";
const SECURE_CONFIG_DOC = "b2b_secure";
const CREDENTIALS_COLLECTION = "b2b_credentials";

// Agents pick these themselves, so the floor has to be defensible without
// being hostile. Firebase Auth itself rejects anything under 6.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

// A heartbeat lands every ~60s; anything fresher than this window means the
// agent has the portal open right now.
const ONLINE_WINDOW_MS = 3 * 60 * 1000;
const IDLE_WINDOW_MS = 20 * 60 * 1000;
// Floor on activity writes so a chatty tab cannot turn presence into a
// write-amplification bill.
const ACTIVITY_WRITE_INTERVAL_MS = 45 * 1000;

// ── Password policy ──────────────────────────────────────────────────────────

/**
 * Validates an admin- or agent-chosen password.
 * @param {unknown} value
 * @returns {{ ok: true, password: string } | { ok: false, reason: string }}
 */
function validateCustomPassword(value) {
  if (typeof value !== "string") {
    return { ok: false, reason: "Password must be text." };
  }
  // Not trimmed: a password is taken exactly as typed. Leading/trailing spaces
  // are rejected outright rather than silently stripped, because stripping
  // would make the stored copy differ from what the agent typed.
  if (value !== value.trim()) {
    return { ok: false, reason: "Password cannot start or end with a space." };
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, reason: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, reason: `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.` };
  }
  if (/\s/.test(value)) {
    return { ok: false, reason: "Password cannot contain spaces." };
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return { ok: false, reason: "Password must contain at least one letter and one number." };
  }
  return { ok: true, password: value };
}

// ── Presence ─────────────────────────────────────────────────────────────────

/**
 * Buckets an agent by how recently they were seen.
 * @param {number|null|undefined} lastActiveMs  epoch ms of the last heartbeat
 * @param {number} nowMs
 * @returns {"online"|"idle"|"offline"}
 */
function resolvePresence(lastActiveMs, nowMs = Date.now()) {
  const last = Number(lastActiveMs);
  if (!Number.isFinite(last) || last <= 0) return "offline";
  const age = nowMs - last;
  // Clock skew between the client and the server can put `last` slightly in the
  // future; that is still "just seen", not offline.
  if (age < ONLINE_WINDOW_MS) return "online";
  if (age < IDLE_WINDOW_MS) return "idle";
  return "offline";
}

/**
 * Throttles activity writes — true when the stored stamp is stale enough that
 * a fresh write is worth a Firestore operation.
 * @param {number|null|undefined} lastActiveMs
 * @param {number} nowMs
 * @param {boolean} force  login events always write
 */
function shouldWriteActivity(lastActiveMs, nowMs = Date.now(), force = false) {
  if (force) return true;
  const last = Number(lastActiveMs);
  if (!Number.isFinite(last) || last <= 0) return true;
  return (nowMs - last) >= ACTIVITY_WRITE_INTERVAL_MS;
}

// ── Encryption ───────────────────────────────────────────────────────────────

/** 32-byte AES key derived from arbitrary key material. */
function deriveKey(keyMaterial) {
  return crypto.createHash("sha256").update(String(keyMaterial || ""), "utf8").digest();
}

/**
 * @param {string} plaintext
 * @param {string} keyMaterial
 * @returns {{alg: string, iv: string, tag: string, data: string}}
 */
function encryptSecret(plaintext, keyMaterial) {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(CIPHER_ALG, deriveKey(keyMaterial), iv);
  const data = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
  return {
    alg: CIPHER_ALG,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

/**
 * Reverses encryptSecret. Returns null rather than throwing when the payload is
 * malformed or the key has changed — callers surface that as "unavailable, reset
 * the password" instead of a 500.
 * @returns {string|null}
 */
function decryptSecret(payload, keyMaterial) {
  if (!payload || payload.alg !== CIPHER_ALG || !payload.iv || !payload.tag || !payload.data) {
    return null;
  }
  try {
    const decipher = crypto.createDecipheriv(
      CIPHER_ALG,
      deriveKey(keyMaterial),
      Buffer.from(payload.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(payload.data, "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

// ── Key custody ──────────────────────────────────────────────────────────────

/**
 * Resolves the credential encryption key.
 *
 * B2B_CRED_KEY wins when present (rotate it by setting the env var and resetting
 * every password). Otherwise a random key is generated once and stored on
 * `config/b2b_secure`, which firestore.rules denies to every client — this keeps
 * the feature working straight after deploy with no manual secret setup.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @returns {Promise<string>}
 */
async function loadCredentialKey(db) {
  const fromEnv = process.env[CRED_KEY_ENV];
  if (typeof fromEnv === "string" && fromEnv.trim().length >= 16) return fromEnv.trim();

  const ref = db.collection("config").doc(SECURE_CONFIG_DOC);
  const snap = await ref.get();
  const existing = snap.exists ? snap.data()?.credKey : null;
  if (typeof existing === "string" && existing.length >= 16) return existing;

  const generated = crypto.randomBytes(32).toString("base64");
  // merge:true — never clobber anything else parked on the secure config doc.
  await ref.set({ credKey: generated, credKeyCreatedAt: new Date() }, { merge: true });
  return generated;
}

module.exports = {
  CREDENTIALS_COLLECTION,
  SECURE_CONFIG_DOC,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  ONLINE_WINDOW_MS,
  IDLE_WINDOW_MS,
  ACTIVITY_WRITE_INTERVAL_MS,
  validateCustomPassword,
  resolvePresence,
  shouldWriteActivity,
  encryptSecret,
  decryptSecret,
  deriveKey,
  loadCredentialKey,
};
