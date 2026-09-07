"use strict";

// Final selling-price rounding, applied to every fare ingestFaresFromN8n writes
// — portal upload, WhatsApp intake and any scraped feed alike — so a supplier
// rate plus commission never lands on the public site as an odd number like
// 8,999 or 10,001.

/** Nearest multiple of 1000, e.g. 8999 -> 9000, 10001 -> 10000. */
function roundToNearestThousand(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n / 1000) * 1000;
}

module.exports = { roundToNearestThousand };
