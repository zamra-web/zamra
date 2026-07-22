"use strict";

/**
 * b2b.js — B2B agent portal Cloud Functions.
 *
 * Admin callables manage the `b2b_agents` collection and their Firebase Auth
 * accounts (synthetic emails, reset-and-reveal passwords). Agent callables
 * serve the portal: fares are priced server-side from the raw supplier rate
 * so B2B agents never see specialRate/finalRate/commission or supplier ids.
 */

const crypto = require("node:crypto");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { compareSectorDisplayOrder } = require("./sectorOrdering");
const { normalizeFlightTimeRange } = require("./flightTime");
const {
  buildFlightDetailIndex,
  buildFlightDetailKey,
  resolveScheduledFlightTime,
} = require("./flightSchedule");

const B2B_EMAIL_DOMAIN = "b2b.zamratravels.com";
const DEFAULT_B2B_MARKUP = 200;
const DEFAULT_B2B_WHATSAPP = "919846606738";
const LOGIN_ID_PATTERN = /^[A-Za-z0-9]{3,20}$/;
// Excludes lookalikes: 0/O/o, 1/l/I/i
const PASSWORD_ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
const PASSWORD_LENGTH = 10;

// ── Pure helpers (unit-tested) ───────────────────────────────────────────────

function loginIdToEmail(loginId) {
  return `${String(loginId || "").trim().toLowerCase()}@${B2B_EMAIL_DOMAIN}`;
}

function generatePassword(length = PASSWORD_LENGTH) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_ALPHABET[crypto.randomInt(PASSWORD_ALPHABET.length)];
  }
  return out;
}

/**
 * Parses "CCJ RUH" / "CCJ-RUH" into origin/destination codes,
 * matching the normalization used by ingestFaresFromN8n.
 */
function parseSectorCodes(sectorCode) {
  const parts = String(sectorCode || "").replace("-", " ").trim().toUpperCase().split(/\s+/);
  return { originCode: parts[0] || "", destCode: parts[1] || "" };
}

function isSectorVisibleToAgent(sector, agent) {
  const hiddenOrigins = (agent.hiddenOrigins || []).map((c) => String(c).toUpperCase());
  const hiddenSectorIds = agent.hiddenSectorIds || [];
  const { originCode } = parseSectorCodes(sector.sectorCode);
  return !hiddenOrigins.includes(originCode) && !hiddenSectorIds.includes(sector.id);
}

/** Filters + sorts sectors an agent may see, returning sanitized entries. */
function filterSectorsForAgent(sectors, agent) {
  return [...sectors]
    .sort(compareSectorDisplayOrder)
    .filter((sector) => isSectorVisibleToAgent(sector, agent))
    .map((sector) => {
      const { originCode, destCode } = parseSectorCodes(sector.sectorCode);
      return {
        id: sector.id,
        sectorCode: sector.sectorCode || "",
        sectorFrom: sector.sectorFrom || "",
        sectorTo: sector.sectorTo || "",
        originCode,
        destCode,
      };
    });
}

/** Effective markup for an agent: explicit numeric override (0 allowed) or global default. */
function resolveAgentMarkup(agent, config) {
  if (typeof agent.markupOverride === "number" && Number.isFinite(agent.markupOverride)) {
    return agent.markupOverride;
  }
  const fallback = Number(config?.defaultMarkup);
  return Number.isFinite(fallback) ? fallback : DEFAULT_B2B_MARKUP;
}

/**
 * Per-supplier price rule, signed (positive = markup, negative = discount).
 * Stacks ON TOP of the agent markup rather than replacing it, so a discount
 * rule can never drop the price below the supplier's raw rate on its own.
 *
 * Most specific wins:
 *   1. agent.supplierAdjustments[supplierId]  — this agent, this supplier
 *   2. config.supplierDefaults[supplierId]    — this supplier, every agent
 *   3. 0                                      — no rule
 *
 * An explicit 0 at tier 1 is a real value: it cancels a tier-2 default for one
 * agent. Only null/undefined/non-numeric falls through to the next tier.
 *
 * @param {string} supplierId  agent_fares.agentId — the `agents` (supplier) doc id
 */
function resolveSupplierAdjustment(supplierId, agent, config) {
  const id = String(supplierId || "").trim();
  if (!id) return 0;

  const perAgent = agent?.supplierAdjustments?.[id];
  if (typeof perAgent === "number" && Number.isFinite(perAgent)) return perAgent;

  const supplierDefault = config?.supplierDefaults?.[id];
  if (typeof supplierDefault === "number" && Number.isFinite(supplierDefault)) return supplierDefault;

  return 0;
}

/**
 * Computes sanitized B2B fares from raw agent_fares docs.
 *
 * base = specialRate, falling back to finalRate - commission when specialRate
 * is missing/0 (n8n writes specialRate: 0 when sp_rate is absent). Fares with
 * no positive base are skipped.
 *
 * Pricing waterfall, per fare:
 *   base + agentMarkup + supplierAdjustment + routeAdjustment  (floored at 0)
 *
 * Groups by sector+airline+date+time keeping the MIN FINAL PRICE. Comparing
 * final price rather than raw base matters as soon as per-supplier rules exist:
 * a supplier with a slightly higher raw rate but a discount rule can undercut a
 * cheaper supplier that carries a markup, and the agent must be shown the
 * genuinely cheapest option.
 *
 * @param {Array<object>} fareDocs  plain objects; flightDate may be a Firestore
 *   Timestamp, Date, or ms number. `agentId` is the supplier id.
 * @param {object} agent   b2b_agents doc data (markupOverride, supplierAdjustments,
 *   routeAdjustments)
 * @param {object} config  config/b2b doc data (defaultMarkup, supplierDefaults)
 * @returns {Array<{airlineId, flightDate, flightTime, baggage, extraBaggage, price}>}
 */
function computeB2BFares(fareDocs, agent, config) {
  const markup = resolveAgentMarkup(agent, config);
  const groups = new Map();

  for (const fare of fareDocs || []) {
    const specialRate = Number(fare.specialRate) || 0;
    const base = specialRate > 0
      ? specialRate
      : (Number(fare.finalRate) || 0) - (Number(fare.commission) || 0);
    if (base <= 0) continue;

    const rawDate = fare.flightDate;
    const date = typeof rawDate?.toDate === "function" ? rawDate.toDate() : new Date(rawDate);
    if (Number.isNaN(date.getTime())) continue;

    const supplierAdjustment = resolveSupplierAdjustment(fare.agentId, agent, config);
    const routeAdjustment = Number(agent.routeAdjustments?.[fare.sectorId]) || 0;
    const price = Math.max(0, Math.round(base + markup + supplierAdjustment + routeAdjustment));

    const key = [fare.sectorId, fare.airlineId, date.getTime(), fare.flightTime || ""].join("|");
    const existing = groups.get(key);
    if (existing && existing.price <= price) continue;

    groups.set(key, {
      airlineId: fare.airlineId || "",
      flightDate: date.toISOString(),
      flightTime: fare.flightTime || "",
      baggage: fare.baggage ?? "",
      extraBaggage: Number(fare.extraBaggage) || 0,
      price,
    });
  }

  return [...groups.values()]
    .sort((a, b) =>
      a.flightDate === b.flightDate
        ? a.price - b.price
        : a.flightDate.localeCompare(b.flightDate));
}

// ── Input sanitizers ─────────────────────────────────────────────────────────

function sanitizeProfileFields(data) {
  return {
    name: String(data.name || "").trim(),
    agencyName: String(data.agencyName || "").trim(),
    phone: String(data.phone || "").trim(),
    place: String(data.place || "").trim(),
  };
}

function sanitizeMarkupOverride(value) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    throw new HttpsError("invalid-argument", "markupOverride must be a non-negative number or empty.");
  }
  return num;
}

function sanitizeCodeArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((v) => String(v).trim().toUpperCase()).filter(Boolean))];
}

function sanitizeIdArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
}

function sanitizeRouteAdjustments(value) {
  const out = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [sectorId, amount] of Object.entries(value)) {
    const num = Number(amount);
    const key = String(sectorId).trim();
    if (!key || !Number.isFinite(num) || num === 0) continue;
    out[key] = num;
  }
  return out;
}

/**
 * Per-agent supplier rules ({ supplierId: signedAmount }).
 *
 * Unlike route adjustments, an explicit 0 is KEPT: it is how an admin cancels a
 * global supplierDefaults entry for one agent. To drop a rule entirely the
 * client omits the key.
 */
function sanitizeSupplierAdjustments(value) {
  const out = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [supplierId, amount] of Object.entries(value)) {
    const key = String(supplierId).trim();
    if (!key || amount === null || amount === undefined || amount === "") continue;
    const num = Number(amount);
    if (!Number.isFinite(num)) continue;
    out[key] = num;
  }
  return out;
}

/**
 * Global per-supplier defaults ({ supplierId: signedAmount }) on config/b2b.
 * 0 is dropped here — with no tier below it, "0" and "unset" are the same rule.
 */
function sanitizeSupplierDefaults(value) {
  const out = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [supplierId, amount] of Object.entries(value)) {
    const num = Number(amount);
    const key = String(supplierId).trim();
    if (!key || !Number.isFinite(num) || num === 0) continue;
    out[key] = num;
  }
  return out;
}

// ── Builder ──────────────────────────────────────────────────────────────────

/**
 * Builds the six B2B callables.
 * @param {FirebaseFirestore.Firestore} db
 * @param {(request: object) => void} requireAdmin
 */
function build(db, requireAdmin) {
  const REGION = { region: "asia-south1" };

  /** Loads config/b2b with safe defaults. */
  async function getB2BConfig() {
    const snap = await db.collection("config").doc("b2b").get();
    const data = snap.exists ? snap.data() : {};
    return {
      defaultMarkup: Number.isFinite(Number(data.defaultMarkup))
        ? Number(data.defaultMarkup)
        : DEFAULT_B2B_MARKUP,
      whatsappNumber: String(data.whatsappNumber || DEFAULT_B2B_WHATSAPP),
      supplierDefaults: sanitizeSupplierDefaults(data.supplierDefaults),
    };
  }

  /**
   * Verifies the caller is an active B2B agent. Re-reads the agent doc on
   * every call so deactivation cuts access immediately (ID tokens live ~1h).
   */
  async function requireAgent(request) {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in to call this function.");
    }
    const { agent, b2bAgentId } = request.auth.token;
    if (!agent || typeof b2bAgentId !== "string") {
      throw new HttpsError("permission-denied", "B2B agent access required.");
    }
    const snap = await db.collection("b2b_agents").doc(b2bAgentId).get();
    if (!snap.exists || snap.data().isActive !== true) {
      throw new HttpsError("permission-denied", "AGENT_INACTIVE");
    }
    return { id: snap.id, ...snap.data() };
  }

  async function loadAgentDocForAdmin(agentId) {
    if (!agentId || typeof agentId !== "string") {
      throw new HttpsError("invalid-argument", "agentId is required.");
    }
    const snap = await db.collection("b2b_agents").doc(agentId).get();
    if (!snap.exists) {
      throw new HttpsError("not-found", "B2B agent not found.");
    }
    return { ref: snap.ref, data: snap.data() };
  }

  const createB2BAgent = onCall(REGION, async (request) => {
    requireAdmin(request);
    const data = request.data || {};

    const loginId = String(data.loginId || "").trim();
    if (!LOGIN_ID_PATTERN.test(loginId)) {
      throw new HttpsError("invalid-argument", "Login ID must be 3-20 letters/digits (e.g. ZMR001).");
    }
    const profile = sanitizeProfileFields(data);
    if (!profile.name) {
      throw new HttpsError("invalid-argument", "Agent name is required.");
    }

    const loginIdLower = loginId.toLowerCase();
    const email = loginIdToEmail(loginId);

    const dupSnap = await db.collection("b2b_agents")
      .where("loginIdLower", "==", loginIdLower).limit(1).get();
    if (!dupSnap.empty) {
      throw new HttpsError("already-exists", `Login ID "${loginId}" is already in use.`);
    }
    const auth = getAuth();
    try {
      await auth.getUserByEmail(email);
      throw new HttpsError("already-exists", `An account for "${loginId}" already exists.`);
    } catch (err) {
      if (err instanceof HttpsError) throw err;
      if (err.code !== "auth/user-not-found") {
        throw new HttpsError("internal", `Failed to check existing accounts: ${err.message}`);
      }
    }

    const password = generatePassword();
    const docRef = db.collection("b2b_agents").doc();

    const userRecord = await auth.createUser({ email, password, displayName: profile.name });
    try {
      await auth.setCustomUserClaims(userRecord.uid, { agent: true, b2bAgentId: docRef.id });
      await docRef.set({
        loginId,
        loginIdLower,
        authUid: userRecord.uid,
        ...profile,
        isActive: true,
        markupOverride: sanitizeMarkupOverride(data.markupOverride),
        hiddenOrigins: sanitizeCodeArray(data.hiddenOrigins),
        hiddenSectorIds: sanitizeIdArray(data.hiddenSectorIds),
        routeAdjustments: sanitizeRouteAdjustments(data.routeAdjustments),
        supplierAdjustments: sanitizeSupplierAdjustments(data.supplierAdjustments),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      // Roll back the Auth account so a failed create can be retried cleanly.
      await auth.deleteUser(userRecord.uid).catch(() => {});
      if (err instanceof HttpsError) throw err;
      throw new HttpsError("internal", `Failed to create agent record: ${err.message}`);
    }

    return { agentId: docRef.id, loginId, email, password };
  });

  const resetB2BAgentPassword = onCall(REGION, async (request) => {
    requireAdmin(request);
    const { ref, data } = await loadAgentDocForAdmin(request.data?.agentId);

    const password = generatePassword();
    const auth = getAuth();
    await auth.updateUser(data.authUid, { password });
    await auth.revokeRefreshTokens(data.authUid);
    await ref.update({ updatedAt: FieldValue.serverTimestamp() });

    return { loginId: data.loginId, password };
  });

  const setB2BAgentStatus = onCall(REGION, async (request) => {
    requireAdmin(request);
    const isActive = request.data?.isActive === true;
    const { ref, data } = await loadAgentDocForAdmin(request.data?.agentId);

    const auth = getAuth();
    try {
      await auth.updateUser(data.authUid, { disabled: !isActive });
      if (!isActive) await auth.revokeRefreshTokens(data.authUid);
    } catch (err) {
      if (err.code !== "auth/user-not-found") {
        throw new HttpsError("internal", `Failed to update account status: ${err.message}`);
      }
    }
    await ref.update({ isActive, updatedAt: FieldValue.serverTimestamp() });

    return { agentId: ref.id, isActive };
  });

  const deleteB2BAgent = onCall(REGION, async (request) => {
    requireAdmin(request);
    const { ref, data } = await loadAgentDocForAdmin(request.data?.agentId);

    try {
      await getAuth().deleteUser(data.authUid);
    } catch (err) {
      if (err.code !== "auth/user-not-found") {
        throw new HttpsError("internal", `Failed to delete agent account: ${err.message}`);
      }
    }
    await ref.delete();

    return { deleted: true };
  });

  const getB2BPortalContext = onCall(REGION, async (request) => {
    const agent = await requireAgent(request);

    const [config, sectorsSnap] = await Promise.all([
      getB2BConfig(),
      db.collection("sectors").get(),
    ]);
    const sectors = filterSectorsForAgent(
      sectorsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      agent,
    );

    return {
      agent: { name: agent.name || "", agencyName: agent.agencyName || "", loginId: agent.loginId || "" },
      whatsappNumber: config.whatsappNumber,
      defaultOrigin: sectors[0]?.originCode || "",
      sectors,
    };
  });

  const getB2BFares = onCall(REGION, async (request) => {
    const agent = await requireAgent(request);

    const sectorId = String(request.data?.sectorId || "").trim();
    if (!sectorId) {
      throw new HttpsError("invalid-argument", "sectorId is required.");
    }
    const sectorSnap = await db.collection("sectors").doc(sectorId).get();
    // Never trust the client's sectorId — hidden/unknown sectors are denied.
    if (!sectorSnap.exists || !isSectorVisibleToAgent({ id: sectorSnap.id, ...sectorSnap.data() }, agent)) {
      throw new HttpsError("permission-denied", "This route is not available.");
    }
    const sectorData = sectorSnap.data();
    const { originCode, destCode } = parseSectorCodes(sectorData.sectorCode);

    const [config, faresSnap, flightDetailsSnap] = await Promise.all([
      getB2BConfig(),
      db.collection("agent_fares")
        .where("sectorId", "==", sectorId)
        .where("isHidden", "==", false)
        .where("flightDate", ">=", Timestamp.fromDate(getUtcMidnightToday()))
        .orderBy("flightDate", "asc")
        .get(),
      db.collection("flight_details").get(),
    ]);

    // Fares ingested before the n8n time round-trip was fixed store an empty
    // flightTime, which renders as "TBA" in the portal. Fill it from the
    // configured per-route default (date-aware) before pricing, so the dedupe
    // key and what the agent sees agree.
    const flightDetailIndex = buildFlightDetailIndex(flightDetailsSnap);
    const fareDocs = faresSnap.docs.map((d) => {
      const fare = d.data();
      if (normalizeFlightTimeRange(fare.flightTime)) return fare;
      const detail = flightDetailIndex.get(buildFlightDetailKey(fare.airlineId, fare.sectorId));
      return {
        ...fare,
        flightTime: resolveScheduledFlightTime(detail, fare.flightDate, normalizeFlightTimeRange),
      };
    });

    const fares = computeB2BFares(fareDocs, agent, config);

    return {
      sector: {
        id: sectorSnap.id,
        sectorCode: sectorData.sectorCode || "",
        sectorFrom: sectorData.sectorFrom || "",
        sectorTo: sectorData.sectorTo || "",
        originCode,
        destCode,
      },
      fares,
    };
  });

  return {
    createB2BAgent,
    resetB2BAgentPassword,
    setB2BAgentStatus,
    deleteB2BAgent,
    getB2BPortalContext,
    getB2BFares,
  };
}

/** Midnight UTC today — matches how flightDate is stored (UTC midnight). */
function getUtcMidnightToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

module.exports = {
  build,
  // Pure helpers exported for unit tests
  computeB2BFares,
  filterSectorsForAgent,
  isSectorVisibleToAgent,
  parseSectorCodes,
  resolveAgentMarkup,
  resolveSupplierAdjustment,
  sanitizeSupplierAdjustments,
  sanitizeSupplierDefaults,
  loginIdToEmail,
  generatePassword,
};
