"use strict";

// Airline baggage policy for Cloud Functions — CommonJS mirror of
// `web/src/js/shared/airline-baggage.js`. Any rule change must be made in BOTH
// files; the browser bundle cannot import from `functions/`.
//
// Rules:
//   Hand baggage     — 7 kg for every airline, except G9 = 10 kg and OV = 5 kg.
//   Check-in baggage — 30 kg for every airline, except OV = 20/40 and SV = 20/30/40.

const DEFAULT_HAND_BAGGAGE_KG = 7;
const DEFAULT_CHECKIN_BAGGAGE_KG = 30;

const HAND_BAGGAGE_BY_CODE = {
  G9: 10,
  OV: 5,
};

const CHECKIN_BAGGAGE_BY_CODE = {
  OV: [20, 40],
  SV: [20, 30, 40],
};

const STANDARD_AIRLINE_CODES = [
  "IX", "6E", "G9", "XY", "WY", "OV", "AI", "SV", "QP", "FZ", "J9", "SG",
];

function normalizeAirlineCode(value) {
  return String(value === null || value === undefined ? "" : value).trim().toUpperCase();
}

function parseKg(value) {
  if (value === null || value === undefined || value === "") return 0;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function handBaggageKg(airlineCode) {
  const override = HAND_BAGGAGE_BY_CODE[normalizeAirlineCode(airlineCode)];
  return override === undefined ? DEFAULT_HAND_BAGGAGE_KG : override;
}

function checkInBaggageOptions(airlineCode) {
  const allowed = CHECKIN_BAGGAGE_BY_CODE[normalizeAirlineCode(airlineCode)];
  return allowed ? allowed.slice() : [DEFAULT_CHECKIN_BAGGAGE_KG];
}

function hasVariableCheckInBaggage(airlineCode) {
  return checkInBaggageOptions(airlineCode).length > 1;
}

function defaultCheckInBaggageKg(airlineCode) {
  const options = checkInBaggageOptions(airlineCode);
  return options.includes(DEFAULT_CHECKIN_BAGGAGE_KG) ? DEFAULT_CHECKIN_BAGGAGE_KG : options[0];
}

function resolveCheckInBaggageKg(airlineCode, requested) {
  const options = checkInBaggageOptions(airlineCode);
  const kg = parseKg(requested);
  return options.includes(kg) ? kg : defaultCheckInBaggageKg(airlineCode);
}

function formatCheckInBaggageLabel(airlineCode) {
  return checkInBaggageOptions(airlineCode).join(", ");
}

// ── Display formatting ───────────────────────────────────────────────────────
// One spelling of the unit everywhere: a space before it, lowercase "kg".

/**
 * A bare weight with its unit, e.g. "30 kg".
 * @param {*} kg
 * @return {string} "" when there is no usable weight.
 */
function formatBaggageKg(kg) {
  const n = parseKg(kg);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))} kg`;
}

/**
 * Labelled check-in allowance, e.g. "Check-in 30 kg".
 * @param {*} airlineCode
 * @param {*} requested
 * @return {string}
 */
function formatCheckInBaggageText(airlineCode, requested) {
  const text = formatBaggageKg(resolveCheckInBaggageKg(airlineCode, requested));
  return text ? `Check-in ${text}` : "Check-in as per airline";
}

/**
 * Labelled cabin allowance, e.g. "Hand 7 kg".
 * @param {*} airlineCode
 * @return {string}
 */
function formatHandBaggageText(airlineCode) {
  const text = formatBaggageKg(handBaggageKg(airlineCode));
  return text ? `Hand ${text}` : "Hand as per airline";
}

/**
 * Compact badge for tight layouts, e.g. "30 + 7 kg".
 * @param {*} airlineCode
 * @param {*} requested
 * @return {string}
 */
function formatBaggageAllowanceShort(airlineCode, requested) {
  const checkIn = parseKg(resolveCheckInBaggageKg(airlineCode, requested));
  const hand = parseKg(handBaggageKg(airlineCode));
  const parts = [checkIn, hand].filter((n) => Number.isFinite(n) && n > 0);
  if (!parts.length) return "As per airline";
  return `${parts.join(" + ")} kg`;
}

function baggageSummary(codes) {
  return (codes || STANDARD_AIRLINE_CODES).map((code) => ({
    code: normalizeAirlineCode(code),
    checkInBaggage: checkInBaggageOptions(code),
    handBaggage: handBaggageKg(code),
  }));
}

module.exports = {
  DEFAULT_HAND_BAGGAGE_KG,
  DEFAULT_CHECKIN_BAGGAGE_KG,
  STANDARD_AIRLINE_CODES,
  normalizeAirlineCode,
  handBaggageKg,
  checkInBaggageOptions,
  hasVariableCheckInBaggage,
  defaultCheckInBaggageKg,
  resolveCheckInBaggageKg,
  formatCheckInBaggageLabel,
  formatBaggageKg,
  formatCheckInBaggageText,
  formatHandBaggageText,
  formatBaggageAllowanceShort,
  baggageSummary,
};
