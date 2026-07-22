// Airport directory — the single source of truth for IATA codes, city names and
// airport names across the browser surfaces (admin dashboard, public site, B2B).
//
// Sector documents store free-text labels (`sectorFrom: "Calicut"`), so anything
// that needs a 3-letter code has to resolve it from a label. Resolving it ad-hoc
// with "first three letters" is the bug that printed CAL instead of CCJ and DUB
// instead of DXB on downloaded e-tickets — always go through `resolveAirportCode()`.
//
// `social-markets.js` derives its label→code map from `AIRPORT_ALIASES` here, so a
// new airport only has to be added once, in this file.

/**
 * IATA code → airport record.
 *   city    — display city name ("Kozhikode")
 *   name    — full airport name, as printed on the e-ticket
 *   aliases — alternate spellings/city names that must resolve to this code
 */
export const AIRPORTS = {
  // ── India ────────────────────────────────────────────────────────────────
  CCJ: { city: 'Kozhikode', name: 'Calicut International Airport', aliases: ['CALICUT', 'KOZHIKODE'] },
  COK: { city: 'Kochi', name: 'Cochin International Airport', aliases: ['KOCHI', 'COCHIN', 'ERNAKULAM'] },
  CNN: { city: 'Kannur', name: 'Kannur International Airport', aliases: ['KANNUR'] },
  TRV: { city: 'Thiruvananthapuram', name: 'Trivandrum International Airport', aliases: ['TRIVANDRUM', 'THIRUVANANTHAPURAM'] },
  IXE: { city: 'Mangaluru', name: 'Mangaluru International Airport', aliases: ['MANGALORE', 'MANGALURU'] },
  BLR: { city: 'Bengaluru', name: 'Kempegowda International Airport', aliases: ['BANGALORE', 'BENGALURU'] },
  MAA: { city: 'Chennai', name: 'Chennai International Airport', aliases: ['CHENNAI', 'MADRAS'] },
  BOM: { city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', aliases: ['MUMBAI', 'BOMBAY'] },
  DEL: { city: 'Delhi', name: 'Indira Gandhi International Airport', aliases: ['DELHI', 'NEW DELHI'] },
  HYD: { city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', aliases: ['HYDERABAD'] },

  // ── Saudi Arabia ─────────────────────────────────────────────────────────
  JED: { city: 'Jeddah', name: 'King Abdulaziz International Airport', aliases: ['JEDDAH', 'JEDDA'] },
  RUH: { city: 'Riyadh', name: 'King Khalid International Airport', aliases: ['RIYADH'] },
  DMM: { city: 'Dammam', name: 'King Fahd International Airport', aliases: ['DAMMAM', 'DAMAM', 'DAMAMM', 'DAMMAMM'] },
  MED: { city: 'Madinah', name: 'Prince Mohammad Bin Abdulaziz International Airport', aliases: ['MADINAH', 'MEDINA'] },

  // ── UAE ──────────────────────────────────────────────────────────────────
  DXB: { city: 'Dubai', name: 'Dubai International Airport', aliases: ['DUBAI'] },
  SHJ: { city: 'Sharjah', name: 'Sharjah International Airport', aliases: ['SHARJAH'] },
  AUH: { city: 'Abu Dhabi', name: 'Zayed International Airport', aliases: ['ABU DHABI', 'ABUDHABI'] },
  RKT: { city: 'Ras Al Khaimah', name: 'Ras Al Khaimah International Airport', aliases: ['RAS AL KHAIMAH', 'RAK'] },
  AAN: { city: 'Al Ain', name: 'Al Ain International Airport', aliases: ['AL AIN'] },
  FJR: { city: 'Fujairah', name: 'Fujairah International Airport', aliases: ['FUJAIRAH'] },

  // ── Rest of the Gulf ─────────────────────────────────────────────────────
  DOH: { city: 'Doha', name: 'Hamad International Airport', aliases: ['DOHA'] },
  MCT: { city: 'Muscat', name: 'Muscat International Airport', aliases: ['MUSCAT'] },
  SLL: { city: 'Salalah', name: 'Salalah International Airport', aliases: ['SALALAH'] },
  KWI: { city: 'Kuwait', name: 'Kuwait International Airport', aliases: ['KUWAIT', 'KUWAIT CITY'] },
  BAH: { city: 'Bahrain', name: 'Bahrain International Airport', aliases: ['BAHRAIN', 'MANAMA'] },
};

/** Uppercased alias (and city name, and the code itself) → IATA code. */
export const AIRPORT_ALIASES = Object.freeze(
  Object.entries(AIRPORTS).reduce((map, [code, airport]) => {
    map[code] = code;
    map[normalizeAirportLabel(airport.city)] = code;
    for (const alias of airport.aliases || []) map[normalizeAirportLabel(alias)] = code;
    return map;
  }, {}),
);

/** Uppercase, collapse whitespace and normalise the recurring "Damam" typo. */
export function normalizeAirportLabel(value = '') {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ');
}

/**
 * Resolve a free-text location label to a 3-letter IATA code, '' when unknown.
 * Accepts "CCJ", "Calicut", "Kozhikode (CCJ)", "calicut " — in that order of
 * preference an explicit parenthesised code always wins.
 */
export function resolveAirportCode(value = '') {
  const normalized = normalizeAirportLabel(value);
  if (!normalized) return '';

  // "Kozhikode (CCJ)" — an explicit code in the label is authoritative.
  const parenthesised = normalized.match(/\(([A-Z0-9]{3})\)\s*$/);
  if (parenthesised) return parenthesised[1];

  const bare = normalized.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (AIRPORT_ALIASES[bare]) return AIRPORT_ALIASES[bare];

  const compact = bare.replace(/\s+/g, '');
  if (AIRPORT_ALIASES[compact]) return AIRPORT_ALIASES[compact];

  // Unknown airport, but the label is already a bare code (e.g. a new sector).
  if (/^[A-Z0-9]{3}$/.test(bare)) return bare;
  return '';
}

/** Airport record for a code, or null. Codes are matched case-insensitively. */
export function getAirport(code = '') {
  return AIRPORTS[normalizeAirportLabel(code)] || null;
}

/** Full airport name for a code, falling back to `<CODE> Airport`. */
export function airportName(code = '') {
  const normalized = normalizeAirportLabel(code);
  return getAirport(normalized)?.name || (normalized ? `${normalized} Airport` : '');
}

/**
 * Display city for a code, falling back to a supplied label (title-cased) so an
 * unmapped sector still prints something readable.
 */
export function airportCity(code = '', fallbackLabel = '') {
  const airport = getAirport(code);
  if (airport) return airport.city;
  const cleaned = String(fallbackLabel || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  return cleaned || normalizeAirportLabel(code);
}
