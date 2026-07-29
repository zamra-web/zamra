"use strict";

const test = require("node:test");
const assert = require("node:assert");

const {
  validateCustomPassword,
  resolvePresence,
  shouldWriteActivity,
  encryptSecret,
  decryptSecret,
  ONLINE_WINDOW_MS,
  IDLE_WINDOW_MS,
  ACTIVITY_WRITE_INTERVAL_MS,
} = require("../b2bCredentials");

const { resolveRequestedPassword } = require("../b2b");

// ── Password policy ──────────────────────────────────────────────────────────

test("validateCustomPassword accepts a normal agent-chosen password", () => {
  const result = validateCustomPassword("Zamra2026");
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.password, "Zamra2026");
});

test("validateCustomPassword keeps the password byte-for-byte", () => {
  // Not trimmed, not normalised — the stored copy has to be exactly what the
  // agent will type at the login box.
  const result = validateCustomPassword("aB3$_x!Zq9");
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.password, "aB3$_x!Zq9");
});

test("validateCustomPassword rejects short, spaced, and single-class passwords", () => {
  const cases = [
    ["Ab3xy", "too short"],
    ["abcdefghij", "letters only"],
    ["1234567890", "digits only"],
    ["Zamra 2026", "internal space"],
    [" Zamra2026", "leading space"],
    ["Zamra2026 ", "trailing space"],
    ["a1".repeat(40), "too long"],
  ];
  for (const [password, why] of cases) {
    const result = validateCustomPassword(password);
    assert.strictEqual(result.ok, false, `expected rejection: ${why}`);
    assert.ok(result.reason.length > 0, `expected a reason for ${why}`);
  }
});

test("validateCustomPassword rejects non-strings", () => {
  for (const value of [undefined, null, 12345678, {}, []]) {
    assert.strictEqual(validateCustomPassword(value).ok, false);
  }
});

test("resolveRequestedPassword generates when no custom password is supplied", () => {
  for (const blank of [undefined, null, ""]) {
    const { password, isCustom } = resolveRequestedPassword(blank);
    assert.strictEqual(isCustom, false);
    assert.strictEqual(password.length, 10);
  }
});

test("resolveRequestedPassword passes a valid custom password through", () => {
  const { password, isCustom } = resolveRequestedPassword("Malabar77");
  assert.strictEqual(isCustom, true);
  assert.strictEqual(password, "Malabar77");
});

test("resolveRequestedPassword throws on an invalid custom password", () => {
  assert.throws(() => resolveRequestedPassword("short1"), /at least 8/);
});

// ── Presence ─────────────────────────────────────────────────────────────────

test("resolvePresence buckets by heartbeat age", () => {
  const now = 1800000000000;
  assert.strictEqual(resolvePresence(now - 1000, now), "online");
  assert.strictEqual(resolvePresence(now - (ONLINE_WINDOW_MS - 1), now), "online");
  assert.strictEqual(resolvePresence(now - ONLINE_WINDOW_MS, now), "idle");
  assert.strictEqual(resolvePresence(now - (IDLE_WINDOW_MS - 1), now), "idle");
  assert.strictEqual(resolvePresence(now - IDLE_WINDOW_MS, now), "offline");
});

test("resolvePresence treats a never-seen agent as offline", () => {
  const now = 1800000000000;
  for (const value of [null, undefined, 0, "", NaN]) {
    assert.strictEqual(resolvePresence(value, now), "offline");
  }
});

test("resolvePresence tolerates a clock ahead of the server", () => {
  const now = 1800000000000;
  assert.strictEqual(resolvePresence(now + 5000, now), "online");
});

// ── Activity write throttle ──────────────────────────────────────────────────

test("shouldWriteActivity throttles beats inside the interval", () => {
  const now = 1800000000000;
  assert.strictEqual(shouldWriteActivity(now - 1000, now, false), false);
  assert.strictEqual(shouldWriteActivity(now - ACTIVITY_WRITE_INTERVAL_MS, now, false), true);
});

test("shouldWriteActivity always writes for a login, and for a first-ever beat", () => {
  const now = 1800000000000;
  assert.strictEqual(shouldWriteActivity(now - 1000, now, true), true);
  assert.strictEqual(shouldWriteActivity(null, now, false), true);
});

// ── Encryption ───────────────────────────────────────────────────────────────

test("encryptSecret/decryptSecret round-trips a password", () => {
  const key = "test-key-material-0123456789";
  const payload = encryptSecret("Zamra2026", key);
  assert.strictEqual(decryptSecret(payload, key), "Zamra2026");
});

test("encryptSecret never emits the plaintext", () => {
  const payload = encryptSecret("Zamra2026", "k".repeat(32));
  assert.ok(!JSON.stringify(payload).includes("Zamra2026"));
});

test("encryptSecret uses a fresh IV per call", () => {
  const key = "k".repeat(32);
  const a = encryptSecret("Zamra2026", key);
  const b = encryptSecret("Zamra2026", key);
  assert.notStrictEqual(a.iv, b.iv);
  assert.notStrictEqual(a.data, b.data);
});

test("decryptSecret returns null for the wrong key rather than throwing", () => {
  const payload = encryptSecret("Zamra2026", "key-one-0123456789012345");
  assert.strictEqual(decryptSecret(payload, "key-two-0123456789012345"), null);
});

test("decryptSecret returns null for tampered ciphertext (GCM auth tag)", () => {
  const key = "k".repeat(32);
  const payload = encryptSecret("Zamra2026", key);
  const tampered = { ...payload, data: Buffer.from("not-the-real-bytes").toString("base64") };
  assert.strictEqual(decryptSecret(tampered, key), null);
});

test("decryptSecret returns null for malformed payloads", () => {
  const key = "k".repeat(32);
  for (const bad of [null, undefined, {}, { alg: "aes-256-gcm" }, { alg: "rot13", iv: "a", tag: "b", data: "c" }]) {
    assert.strictEqual(decryptSecret(bad, key), null);
  }
});

test("unicode passwords survive the round trip", () => {
  const key = "k".repeat(32);
  const secret = "Zamra2026€ß";
  assert.strictEqual(decryptSecret(encryptSecret(secret, key), key), secret);
});
