"use strict";

// SOTO live fares — the endpoints behind zamratravels.com/soto.
//
// WHY AN ENDPOINT RATHER THAN A DIRECT CLIENT CALL
//
// Same reasoning as getPublicDeals. The Travelpayouts token identifies our
// affiliate account and is quota-metered, so it can never ship to a browser.
// Serving through a function also puts the Firestore cache, the SOTO
// eligibility rule and the response allow-list on the server where a visitor
// cannot route around them — and keeps the page free of the Firebase SDK.
//
// WHAT SOTO MEANS HERE. "Sold Outside, Ticketed Outside": a ticket for a
// journey that starts outside the country of sale. Zamra sells from India, so
// this page covers routes whose *origin* is not India. India-origin routes have
// contracted rates and belong on the homepage search instead.

const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { Timestamp } = require("firebase-admin/firestore");

const {
  SOTO_FARE_KEYS,
  normalizeIata,
  resolveCurrency,
  isValidDepartDate,
  isRouteEligible,
  buildCacheKey,
  normalizeProviderRows,
  projectSotoFare,
} = require("./normalize");
const { resolvePlace, searchPlaces, airlineName } = require("./places");
const { fetchTravelpayoutsPrices } = require("./provider");

const CACHE_COLLECTION = "soto_cache";
const CONFIG_DOC = "soto";

const DEFAULT_CACHE_TTL_MINUTES = 45;
const DEFAULT_WHATSAPP_NUMBER = "919846606739";
const MAX_FARES_RETURNED = 20;

/** How long a stale cache entry may still be served when the provider is down. */
const STALE_FALLBACK_MS = 24 * 60 * 60 * 1000;

/**
 * Read the secret's value lazily. Same shape the Buffer pipeline uses — the
 * param object only resolves inside a request.
 *
 * @param {*} secret
 * @return {string}
 */
function secretValue(secret) {
  if (!secret) return "";
  if (typeof secret === "string") return secret;
  return typeof secret.value === "function" ? secret.value() : "";
}

/**
 * Load config/soto, falling back to defaults when the document is absent.
 *
 * The document is optional on purpose: the feature works with no admin setup,
 * and each field can be tuned from the Firestore console without a deploy.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @return {Promise<{markup: number, blockIndiaDestinations: boolean,
 *                   cacheTtlMinutes: number, whatsappNumber: string}>}
 */
async function readSotoConfig(db) {
  let data = {};
  try {
    const snap = await db.collection("config").doc(CONFIG_DOC).get();
    if (snap.exists) data = snap.data() || {};
  } catch (error) {
    console.error("readSotoConfig failed, using defaults:", error);
  }

  const markup = Number(data.markup);
  const ttl = Number(data.cacheTtlMinutes);

  return {
    // Defaults to 0: prices are shown as the indicative market figure they are.
    markup: Number.isFinite(markup) && markup >= 0 ? Math.round(markup) : 0,
    blockIndiaDestinations: data.blockIndiaDestinations === true,
    cacheTtlMinutes: Number.isFinite(ttl) && ttl > 0 ? Math.min(Math.round(ttl), 720) : DEFAULT_CACHE_TTL_MINUTES,
    whatsappNumber: String(data.whatsappNumber || "").trim() || DEFAULT_WHATSAPP_NUMBER,
  };
}

/**
 * Trim a resolved place to what the page displays.
 *
 * @param {object} place
 * @return {object}
 */
function publicPlace(place) {
  return {
    code: place.code,
    city: place.city,
    name: place.name,
    country: place.country,
    countryName: place.countryName,
  };
}

/**
 * Validate the query string and resolve both endpoints.
 *
 * @param {object} query
 * @param {object} config
 * @param {Date} now
 * @return {{error: string, message: string}|{origin: object, destination: object,
 *          departDate: string, returnDate: string, direct: boolean, currency: string}}
 */
function parseSearchRequest(query, config, now) {
  const originCode = normalizeIata(query.origin);
  const destinationCode = normalizeIata(query.destination);
  const departDate = String(query.departDate || "").trim();

  if (!originCode || !destinationCode || !departDate) {
    return { error: "MISSING_PARAMS", message: "Choose where you are flying from, where to, and a departure date." };
  }
  if (originCode === destinationCode) {
    return { error: "SAME_AIRPORT", message: "Origin and destination cannot be the same airport." };
  }

  const origin = resolvePlace(originCode);
  const destination = resolvePlace(destinationCode);
  if (!origin || !destination) {
    return {
      error: "UNKNOWN_AIRPORT",
      message: `We do not recognise the airport code ${origin ? destinationCode : originCode}.`,
    };
  }

  if (!isValidDepartDate(departDate, now)) {
    return { error: "BAD_DATE", message: "Pick a departure date between today and 11 months from now." };
  }

  const returnDate = String(query.returnDate || "").trim();
  if (returnDate) {
    if (!isValidDepartDate(returnDate, now) || returnDate < departDate) {
      return { error: "BAD_DATE", message: "The return date must be on or after the departure date." };
    }
  }

  const eligibility = isRouteEligible(
    { originCountry: origin.country, destinationCountry: destination.country },
    config,
  );
  if (!eligibility.ok) {
    return {
      error: "NOT_SOTO",
      message: eligibility.reason === "ORIGIN_IN_INDIA"
        ? "This route starts in India, so it is not a SOTO fare. Use the flight search on our homepage for India departures."
        : "This route touches India. Use the flight search on our homepage instead.",
    };
  }

  return {
    origin,
    destination,
    departDate,
    returnDate,
    direct: String(query.direct || "") === "true" || query.direct === true,
    currency: resolveCurrency(query.currency),
  };
}

/**
 * Build the three SOTO functions.
 *
 * @param {FirebaseFirestore.Firestore} db
 * @param {*} travelpayoutsToken a defineSecret param (or a plain string in tests)
 * @return {{searchSotoFares: *, searchSotoAirports: *, purgeSotoCache: *}}
 */
function build(db, travelpayoutsToken) {
  const searchSotoAirports = onRequest(
    { region: "asia-south1", cors: true, maxInstances: 5 },
    async (req, res) => {
      if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
      }

      const q = (req.query && req.query.q) || (req.body && req.body.q) || "";
      const limit = (req.query && req.query.limit) || (req.body && req.body.limit);

      // The dataset is committed and only changes when the generator is re-run,
      // so this can sit in a shared cache for a day.
      res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
      return res.status(200).json({ success: true, places: searchPlaces(q, limit) });
    },
  );

  const searchSotoFares = onRequest(
    {
      region: "asia-south1",
      cors: true,
      maxInstances: 10,
      secrets: travelpayoutsToken && typeof travelpayoutsToken === "object" ? [travelpayoutsToken] : [],
    },
    async (req, res) => {
      if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
      }

      const now = new Date();
      const input = Object.assign({}, req.query || {}, req.body || {});

      try {
        const config = await readSotoConfig(db);
        const parsed = parseSearchRequest(input, config, now);

        if (parsed.error) {
          const status = parsed.error === "NOT_SOTO" ? 409 : 400;
          return res.status(status).json({ success: false, error: parsed.error, message: parsed.message });
        }

        const cacheKey = buildCacheKey({
          origin: parsed.origin.code,
          destination: parsed.destination.code,
          departDate: parsed.departDate,
          returnDate: parsed.returnDate,
          direct: parsed.direct,
          currency: parsed.currency,
        });
        const cacheRef = db.collection(CACHE_COLLECTION).doc(cacheKey);

        const envelope = {
          success: true,
          query: {
            origin: publicPlace(parsed.origin),
            destination: publicPlace(parsed.destination),
            departDate: parsed.departDate,
            returnDate: parsed.returnDate,
            direct: parsed.direct,
            currency: parsed.currency.toUpperCase(),
          },
          whatsappNumber: config.whatsappNumber,
          // Never let a caller forget what these prices are. The client renders
          // this as an "Indicative" chip on every card.
          indicative: true,
        };

        let cacheSnap = null;
        try {
          cacheSnap = await cacheRef.get();
        } catch (error) {
          console.error("soto cache read failed:", error);
        }

        const cached = cacheSnap && cacheSnap.exists ? cacheSnap.data() : null;
        const cachedExpiryMs = cached && cached.expiresAt && cached.expiresAt.toMillis
          ? cached.expiresAt.toMillis()
          : 0;

        // A markup change has to invalidate the cache — otherwise the page keeps
        // quoting the old selling price until every entry ages out.
        const cacheUsable = Boolean(cached) && Number(cached.markup || 0) === config.markup;

        if (cacheUsable && cachedExpiryMs > now.getTime()) {
          res.set("Cache-Control", "public, max-age=0, s-maxage=300");
          return res.status(200).json(Object.assign(envelope, {
            fares: Array.isArray(cached.fares) ? cached.fares : [],
            cachedAt: cached.cachedAt && cached.cachedAt.toDate
              ? cached.cachedAt.toDate().toISOString()
              : null,
            stale: false,
          }));
        }

        let payload;
        try {
          payload = await fetchTravelpayoutsPrices({
            origin: parsed.origin.code,
            destination: parsed.destination.code,
            departDate: parsed.departDate,
            returnDate: parsed.returnDate,
            direct: parsed.direct,
            currency: parsed.currency,
          }, secretValue(travelpayoutsToken));
        } catch (error) {
          console.error("Travelpayouts lookup failed:", error);

          // A recently expired cache entry beats an error page. The client shows
          // a "prices may be out of date" note when `stale` is true.
          if (cacheUsable && cachedExpiryMs > now.getTime() - STALE_FALLBACK_MS) {
            res.set("Cache-Control", "no-store");
            return res.status(200).json(Object.assign(envelope, {
              fares: Array.isArray(cached.fares) ? cached.fares : [],
              cachedAt: cached.cachedAt && cached.cachedAt.toDate
                ? cached.cachedAt.toDate().toISOString()
                : null,
              stale: true,
            }));
          }

          return res.status(502).json({
            success: false,
            error: "PROVIDER_FAILED",
            message: "Live fares are unavailable right now. Message us on WhatsApp and we will quote you.",
          });
        }

        const fares = normalizeProviderRows(payload, { now })
          .slice(0, MAX_FARES_RETURNED)
          .map((row) => projectSotoFare(row, {
            origin: parsed.origin.code,
            destination: parsed.destination.code,
            currency: parsed.currency,
            airlineName: airlineName(row.airline),
            markup: config.markup,
          }));

        const expiresAt = new Date(now.getTime() + config.cacheTtlMinutes * 60 * 1000);

        // Fire-and-forget: a cache write that fails must not cost the visitor
        // their results.
        cacheRef.set({
          key: cacheKey,
          provider: "travelpayouts",
          route: `${parsed.origin.code}-${parsed.destination.code}`,
          departDate: parsed.departDate,
          returnDate: parsed.returnDate,
          direct: parsed.direct,
          currency: parsed.currency,
          markup: config.markup,
          fares,
          cachedAt: Timestamp.fromDate(now),
          expiresAt: Timestamp.fromDate(expiresAt),
        }).catch((error) => console.error(`soto cache write failed for ${cacheKey}:`, error));

        res.set("Cache-Control", "public, max-age=0, s-maxage=300");
        return res.status(200).json(Object.assign(envelope, {
          fares,
          cachedAt: now.toISOString(),
          stale: false,
        }));
      } catch (error) {
        console.error("searchSotoFares failed:", error);
        return res.status(500).json({
          success: false,
          error: "LOOKUP_FAILED",
          message: "Something went wrong looking up fares. Please try again.",
        });
      }
    },
  );

  const purgeSotoCache = onSchedule(
    { region: "asia-south1", schedule: "every day 03:00", timeZone: "UTC" },
    async () => {
      let deleted = 0;

      // Batched loop rather than one big read — a busy month of searches can
      // leave more expired docs than a single query should pull into memory.
      for (;;) {
        const snapshot = await db.collection(CACHE_COLLECTION)
          .where("expiresAt", "<=", Timestamp.now())
          .limit(400)
          .get();
        if (snapshot.empty) break;

        const batch = db.batch();
        snapshot.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        deleted += snapshot.size;

        if (snapshot.size < 400) break;
      }

      console.log(`purgeSotoCache: deleted ${deleted} expired entr${deleted === 1 ? "y" : "ies"}`);
    },
  );

  return { searchSotoFares, searchSotoAirports, purgeSotoCache };
}

module.exports = {
  build,
  CACHE_COLLECTION,
  DEFAULT_CACHE_TTL_MINUTES,
  DEFAULT_WHATSAPP_NUMBER,
  MAX_FARES_RETURNED,
  SOTO_FARE_KEYS,
  parseSearchRequest,
  readSotoConfig,
};
