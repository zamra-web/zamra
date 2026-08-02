"use strict";

// The one outbound call the SOTO feature makes.
//
// Node 22 native fetch — this repo has no axios or node-fetch, and
// functions/buffer/client.js is the pattern being followed here.
//
// WHAT THIS DATA IS. Travelpayouts serves prices harvested from Aviasales
// searches, not a live availability check. A row can be up to seven days old.
// It is good enough to quote "from" figures against and to open a WhatsApp
// conversation with; it is not a guaranteed bookable price, and every surface
// that renders it says so. Swapping in a live provider (Duffel) means
// reimplementing this one function and nothing else.

const { resolveCurrency } = require("./normalize");

const PRICES_ENDPOINT = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

/** Provider calls are cheap but not free, and a hung one holds a function instance. */
const REQUEST_TIMEOUT_MS = 12000;

/** Plenty for one route+date; the page shows far fewer. */
const RESULT_LIMIT = 30;

/**
 * Fetch cached prices for one route and date.
 *
 * @param {{origin: string, destination: string, departDate: string,
 *          returnDate?: string, direct?: boolean, currency?: string}} params
 * @param {string} token Travelpayouts API token
 * @return {Promise<object>} the parsed provider body
 */
async function fetchTravelpayoutsPrices(params, token) {
  if (!token) {
    const error = new Error("TRAVELPAYOUTS_TOKEN is not configured");
    error.code = "NO_TOKEN";
    throw error;
  }

  const oneWay = !params.returnDate;

  const url = new URL(PRICES_ENDPOINT);
  url.searchParams.set("origin", params.origin);
  url.searchParams.set("destination", params.destination);
  url.searchParams.set("departure_at", params.departDate);
  if (!oneWay) url.searchParams.set("return_at", params.returnDate);
  url.searchParams.set("one_way", oneWay ? "true" : "false");
  url.searchParams.set("direct", params.direct ? "true" : "false");
  url.searchParams.set("sorting", "price");
  url.searchParams.set("limit", String(RESULT_LIMIT));
  // Never omit this. Without an explicit currency the API answers in roubles,
  // silently, and the page prints numbers ~2.5x too large.
  url.searchParams.set("currency", resolveCurrency(params.currency));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      // The token goes in the header, never the query string — a query string
      // ends up in access logs and error reports.
      headers: {
        "X-Access-Token": token,
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(`Travelpayouts responded ${response.status}`);
      error.code = "PROVIDER_HTTP";
      error.status = response.status;
      throw error;
    }

    const body = await response.json();
    if (body && body.success === false) {
      const error = new Error(String(body.error || "Provider reported failure"));
      error.code = "PROVIDER_ERROR";
      throw error;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  PRICES_ENDPOINT,
  REQUEST_TIMEOUT_MS,
  RESULT_LIMIT,
  fetchTravelpayoutsPrices,
};
