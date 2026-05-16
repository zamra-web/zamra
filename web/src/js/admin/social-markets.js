export const POSTER_SOCIAL_MARKET_ORDER = ['ccj', 'cok', 'cnn', 'trv', 'ixe'];
export const POSTER_SOCIAL_COUNTRY_ORDER = ['saudi', 'uae', 'oman', 'qatar', 'bahrain', 'kuwait'];

export const POSTER_SOCIAL_MARKETS = {
  ccj: {
    key: 'ccj',
    label: 'Calicut (CCJ)',
    airports: ['CCJ'],
    summary: 'Flights from or to Calicut',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#CalicutFlights', '#CCJDeals', '#KeralaTravel', '#ZamraTravels'],
  },
  cok: {
    key: 'cok',
    label: 'Kochi (COK)',
    airports: ['COK'],
    summary: 'Flights from or to Kochi',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#KochiFlights', '#COKDeals', '#CochinFlights', '#ZamraTravels'],
  },
  cnn: {
    key: 'cnn',
    label: 'Kannur (CNN)',
    airports: ['CNN'],
    summary: 'Flights from or to Kannur',
    platforms: { instagram: false, facebook: false, youtube: false },
    hashtags: ['#KannurFlights', '#CNNDeals', '#NorthKeralaTravel', '#ZamraTravels'],
  },
  trv: {
    key: 'trv',
    label: 'Trivandrum (TRV)',
    airports: ['TRV'],
    summary: 'Flights from or to Trivandrum',
    platforms: { instagram: false, facebook: false, youtube: false },
    hashtags: ['#TrivandrumFlights', '#TRVDeals', '#SouthKeralaTravel', '#ZamraTravels'],
  },
  ixe: {
    key: 'ixe',
    label: 'Mangalore (IXE)',
    airports: ['IXE'],
    summary: 'Flights from or to Mangalore',
    platforms: { instagram: false, facebook: false, youtube: false },
    hashtags: ['#MangaloreFlights', '#IXEDeals', '#CoastalTravel', '#ZamraTravels'],
  },
};

export const POSTER_SOCIAL_COUNTRIES = {
  saudi: {
    key: 'saudi',
    label: 'Saudi',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['JED', 'RUH', 'DMM'],
    keywords: ['SAUDI', 'SAUDI ARABIA'],
  },
  uae: {
    key: 'uae',
    label: 'UAE',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['DXB', 'SHJ', 'AUH', 'RKT', 'AAN', 'FJR'],
    keywords: ['UAE', 'UNITED ARAB EMIRATES', 'DUBAI', 'SHARJAH', 'ABU DHABI', 'RAS AL KHAIMAH', 'AL AIN', 'FUJAIRAH'],
  },
  oman: {
    key: 'oman',
    label: 'Oman',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['MCT'],
    keywords: ['OMAN', 'MUSCAT'],
  },
  qatar: {
    key: 'qatar',
    label: 'Qatar',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['DOH'],
    keywords: ['QATAR', 'DOHA'],
  },
  bahrain: {
    key: 'bahrain',
    label: 'Bahrain',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['BAH'],
    keywords: ['BAHRAIN'],
  },
  kuwait: {
    key: 'kuwait',
    label: 'Kuwait',
    groupLabel: 'Country Shortcuts',
    airportCodes: ['KWI'],
    keywords: ['KUWAIT'],
  },
};

export const INDIA_AIRPORT_CODES = ['CCJ', 'COK', 'CNN', 'TRV', 'IXE'];

const INDIA_AIRPORT_SET = new Set(INDIA_AIRPORT_CODES);
const INDIA_AIRPORT_KEY_BY_CODE = Object.fromEntries(
  INDIA_AIRPORT_CODES.map((code) => [code, code.toLowerCase()]),
);
const COUNTRY_KEY_BY_AIRPORT_CODE = Object.fromEntries(
  POSTER_SOCIAL_COUNTRY_ORDER.flatMap((key) => {
    const country = POSTER_SOCIAL_COUNTRIES[key];
    return (country?.airportCodes || []).map((code) => [code, key]);
  }),
);

const LOCATION_CODE_MAP = {
  KOZHIKODE: 'CCJ',
  CALICUT: 'CCJ',
  KOCHI: 'COK',
  COCHIN: 'COK',
  KANNUR: 'CNN',
  TRIVANDRUM: 'TRV',
  THIRUVANANTHAPURAM: 'TRV',
  MANGALORE: 'IXE',
  JEDDAH: 'JED',
  RIYADH: 'RUH',
  DAMMAM: 'DMM',
  DAMAM: 'DMM',
  DMM: 'DMM',
  DOHA: 'DOH',
  MUSCAT: 'MCT',
  BAHRAIN: 'BAH',
  KUWAIT: 'KWI',
  DUBAI: 'DXB',
  SHARJAH: 'SHJ',
  'ABU DHABI': 'AUH',
  AUH: 'AUH',
  'RAS AL KHAIMAH': 'RKT',
  'AL AIN': 'AAN',
  FUJAIRAH: 'FJR',
};

function normalizeToken(value = '') {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, '-')
    .replace(/\bDAMAM\b/g, 'DAMMAM')
    .replace(/\s+/g, ' ');
}

function tokenizeSectorCode(value = '') {
  const normalized = normalizeToken(value).replace(/[^A-Z0-9]+/g, ' ').trim();
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

function resolveCodeFromLabel(value = '') {
  const normalized = normalizeToken(value);
  if (!normalized) return '';
  if (LOCATION_CODE_MAP[normalized]) return LOCATION_CODE_MAP[normalized];
  const compact = normalized.replace(/\s+/g, '');
  if (LOCATION_CODE_MAP[compact]) return LOCATION_CODE_MAP[compact];
  if (/^[A-Z0-9]{3}$/.test(normalized)) return normalized;
  return '';
}

export function getSectorRouteCodes(sector = {}) {
  const tokens = tokenizeSectorCode(sector.sectorCode || '');
  if (tokens.length >= 2) {
    return {
      fromCode: tokens[0],
      toCode: tokens[1],
    };
  }

  return {
    fromCode: resolveCodeFromLabel(sector.sectorFrom || ''),
    toCode: resolveCodeFromLabel(sector.sectorTo || ''),
  };
}

export function resolveSectorMarketKey(sector = {}) {
  const { fromCode, toCode } = getSectorRouteCodes(sector);
  if (!fromCode || !toCode) return null;

  const fromIndia = INDIA_AIRPORT_SET.has(fromCode);
  const toIndia = INDIA_AIRPORT_SET.has(toCode);
  if (fromIndia === toIndia) return null;

  const indiaCode = fromIndia ? fromCode : toCode;
  return INDIA_AIRPORT_KEY_BY_CODE[indiaCode] || null;
}

export function resolveSectorCountryKey(sector = {}) {
  const { fromCode, toCode } = getSectorRouteCodes(sector);
  if (!fromCode || !toCode) return null;

  const fromIndia = INDIA_AIRPORT_SET.has(fromCode);
  const toIndia = INDIA_AIRPORT_SET.has(toCode);
  if (fromIndia === toIndia) return null;

  const nonIndiaCode = fromIndia ? toCode : fromCode;
  return COUNTRY_KEY_BY_AIRPORT_CODE[nonIndiaCode] || null;
}

export function getPosterSocialMarket(key) {
  return POSTER_SOCIAL_MARKETS[key] || null;
}

export function getPosterSocialCountry(key) {
  return POSTER_SOCIAL_COUNTRIES[key] || null;
}

export function getPosterSocialMarketPlatforms(key) {
  return POSTER_SOCIAL_MARKETS[key]?.platforms || null;
}

export function listPosterSocialMarkets() {
  return POSTER_SOCIAL_MARKET_ORDER
    .map((key) => POSTER_SOCIAL_MARKETS[key])
    .filter(Boolean);
}

export function listPosterSocialCountries() {
  return POSTER_SOCIAL_COUNTRY_ORDER
    .map((key) => POSTER_SOCIAL_COUNTRIES[key])
    .filter(Boolean);
}

// ── Origin-Country Shortcuts ──────────────────────────────────────────────────
// Each entry represents a specific origin airport paired with a destination
// country (e.g. "Calicut to Saudi"). The matching logic includes both forward
// and return legs (CCJ→JED and JED→CCJ both appear under "Calicut to Saudi").

const ORIGIN_COUNTRY_ORIGIN_CONFIGS = [
  {
    marketKey: 'ccj',
    airportCode: 'CCJ',
    cityLabel: 'Calicut',
    cityLabelMl: 'കോഴിക്കോട്',
    groupLabel: 'Calicut Routes',
  },
  {
    marketKey: 'cok',
    airportCode: 'COK',
    cityLabel: 'Kochi',
    cityLabelMl: 'കൊച്ചി',
    groupLabel: 'Kochi Routes',
  },
  {
    marketKey: 'cnn',
    airportCode: 'CNN',
    cityLabel: 'Kannur',
    cityLabelMl: 'കണ്ണൂർ',
    groupLabel: 'Kannur Routes',
  },
  {
    marketKey: 'trv',
    airportCode: 'TRV',
    cityLabel: 'Trivandrum',
    cityLabelMl: 'തിരുവനന്തപുരം',
    groupLabel: 'Trivandrum Routes',
  },
  {
    marketKey: 'ixe',
    airportCode: 'IXE',
    cityLabel: 'Mangalore',
    cityLabelMl: 'മംഗലാപുരം',
    groupLabel: 'Mangalore Routes',
  },
];

export const POSTER_COUNTRY_ML_LABELS = {
  saudi:   { label: 'SAUDI',   labelMl: 'സൗദി',    flag: '🇸🇦' },
  uae:     { label: 'UAE',     labelMl: 'യു.എ.ഇ',  flag: '🇦🇪' },
  oman:    { label: 'OMAN',    labelMl: 'ഒമാൻ',    flag: '🇴🇲' },
  qatar:   { label: 'QATAR',   labelMl: 'ഖത്തർ',   flag: '🇶🇦' },
  bahrain: { label: 'BAHRAIN', labelMl: 'ബഹ്‌റൈൻ', flag: '🇧🇭' },
  kuwait:  { label: 'KUWAIT',  labelMl: 'കുവൈത്ത്', flag: '🇰🇼' },
};

export const POSTER_ORIGIN_COUNTRY_SHORTCUTS = ORIGIN_COUNTRY_ORIGIN_CONFIGS.flatMap((origin) =>
  POSTER_SOCIAL_COUNTRY_ORDER.map((countryKey) => {
    const country = POSTER_SOCIAL_COUNTRIES[countryKey];
    const ml = POSTER_COUNTRY_ML_LABELS[countryKey];
    return {
      key: `${origin.marketKey}-${countryKey}`,
      kind: 'origin-country',
      label: `${origin.cityLabel} to ${ml?.label || country.label}`,
      groupLabel: origin.groupLabel,
      originAirport: origin.airportCode,
      originMarketKey: origin.marketKey,
      originCityLabel: origin.cityLabel,
      originCityLabelMl: origin.cityLabelMl,
      countryKey,
      countryLabel: ml?.label || country.label,
      countryLabelMl: ml?.labelMl || '',
      countryFlag: ml?.flag || '',
      airportCodes: country.airportCodes || [],
    };
  })
);

const POSTER_ORIGIN_COUNTRY_SHORTCUT_BY_KEY = new Map(
  POSTER_ORIGIN_COUNTRY_SHORTCUTS.map((s) => [s.key, s])
);

export function listPosterOriginCountryShortcuts() {
  return POSTER_ORIGIN_COUNTRY_SHORTCUTS;
}

export function getOriginCountryShortcut(key) {
  return POSTER_ORIGIN_COUNTRY_SHORTCUT_BY_KEY.get(String(key || '').trim().toLowerCase()) || null;
}
