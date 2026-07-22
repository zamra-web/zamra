// Airline baggage policy — the single source of truth for the browser surfaces
// (admin dashboard, public site, B2B portal).
//
// `functions/airlineBaggage.js` is the CommonJS mirror of this file for Cloud
// Functions / the n8n endpoints. Any rule change must be made in BOTH files.
//
// Rules:
//   Hand baggage    — 7 kg for every airline, except G9 = 10 kg and OV = 5 kg.
//   Check-in baggage — 30 kg for every airline, except OV = 20/40 and SV = 20/30/40.
// These weights are fixed policy: they are never taken from a fare upload or
// typed in by hand, only selected from the allowed values below.

export const DEFAULT_HAND_BAGGAGE_KG = 7;
export const DEFAULT_CHECKIN_BAGGAGE_KG = 30;

const HAND_BAGGAGE_BY_CODE = {
  G9: 10,
  OV: 5,
};

const CHECKIN_BAGGAGE_BY_CODE = {
  OV: [20, 40],
  SV: [20, 30, 40],
};

/** Airline codes Zamra sells, in the order they appear on the baggage summary. */
export const STANDARD_AIRLINE_CODES = [
  'IX', '6E', 'G9', 'XY', 'WY', 'OV', 'AI', 'SV', 'QP', 'FZ', 'J9', 'SG',
];

export function normalizeAirlineCode(value) {
  return String(value ?? '').trim().toUpperCase();
}

function parseKg(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Fixed hand baggage allowance in kg for an airline code. */
export function handBaggageKg(airlineCode) {
  return HAND_BAGGAGE_BY_CODE[normalizeAirlineCode(airlineCode)] ?? DEFAULT_HAND_BAGGAGE_KG;
}

/** Allowed check-in weights in kg, ascending. Always at least one entry. */
export function checkInBaggageOptions(airlineCode) {
  const allowed = CHECKIN_BAGGAGE_BY_CODE[normalizeAirlineCode(airlineCode)];
  return allowed ? [...allowed] : [DEFAULT_CHECKIN_BAGGAGE_KG];
}

/** True when the airline offers more than one check-in weight (OV, SV). */
export function hasVariableCheckInBaggage(airlineCode) {
  return checkInBaggageOptions(airlineCode).length > 1;
}

/** Preferred check-in weight: 30 kg when the airline allows it, else the lowest. */
export function defaultCheckInBaggageKg(airlineCode) {
  const options = checkInBaggageOptions(airlineCode);
  return options.includes(DEFAULT_CHECKIN_BAGGAGE_KG) ? DEFAULT_CHECKIN_BAGGAGE_KG : options[0];
}

/** Snap a requested check-in weight onto the airline's allowed values. */
export function resolveCheckInBaggageKg(airlineCode, requested) {
  const options = checkInBaggageOptions(airlineCode);
  const kg = parseKg(requested);
  return options.includes(kg) ? kg : defaultCheckInBaggageKg(airlineCode);
}

/** e.g. '20, 30, 40' — for help text next to a check-in selector. */
export function formatCheckInBaggageLabel(airlineCode) {
  return checkInBaggageOptions(airlineCode).join(', ');
}

// ── Display formatting ───────────────────────────────────────────────────────
// One spelling of the unit everywhere: a space before it, lowercase "kg".
// Every surface that prints an allowance goes through these so the site, the
// posters, the e-ticket and the exports can't drift apart again.

/** '30 kg' — a bare weight with its unit. Empty string when there is none. */
export function formatBaggageKg(kg) {
  const n = parseKg(kg);
  if (!Number.isFinite(n) || n <= 0) return '';
  // Drop a trailing ".0" so 30 prints as "30 kg", not "30.0 kg".
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))} kg`;
}

/** 'Check-in 30 kg' — the labelled check-in allowance for a fare. */
export function formatCheckInBaggageText(airlineCode, requested) {
  const text = formatBaggageKg(resolveCheckInBaggageKg(airlineCode, requested));
  return text ? `Check-in ${text}` : 'Check-in as per airline';
}

/** 'Hand 7 kg' — the labelled cabin allowance for a fare. */
export function formatHandBaggageText(airlineCode) {
  const text = formatBaggageKg(handBaggageKg(airlineCode));
  return text ? `Hand ${text}` : 'Hand as per airline';
}

/**
 * '30 + 7 kg' — the compact badge used where space is tight (mobile fare card,
 * poster chips). Both numbers share the single trailing unit.
 */
export function formatBaggageAllowanceShort(airlineCode, requested) {
  const checkIn = parseKg(resolveCheckInBaggageKg(airlineCode, requested));
  const hand = parseKg(handBaggageKg(airlineCode));
  const parts = [checkIn, hand].filter(n => Number.isFinite(n) && n > 0);
  if (!parts.length) return 'As per airline';
  return `${parts.join(' + ')} kg`;
}

/** Rows for a baggage summary table, one per airline code. */
export function baggageSummary(codes = STANDARD_AIRLINE_CODES) {
  return codes.map((code) => ({
    code: normalizeAirlineCode(code),
    checkInBaggage: checkInBaggageOptions(code),
    handBaggage: handBaggageKg(code),
  }));
}
