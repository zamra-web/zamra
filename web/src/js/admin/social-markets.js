export const POSTER_SOCIAL_MARKET_ORDER = ['saudi', 'uae', 'qatar', 'oman'];
export const POSTER_SOCIAL_COUNTRY_ORDER = ['ccj', 'cok', 'cnn', 'trv', 'ixe'];

export const POSTER_SOCIAL_MARKETS = {
  saudi: {
    key: 'saudi',
    label: 'Saudi',
    airports: ['JED', 'RUH', 'DMM'],
    summary: 'Flights from or to Saudi',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#SaudiFlights', '#JeddahDeals', '#RiyadhDeals', '#ZamraTravels'],
  },
  uae: {
    key: 'uae',
    label: 'UAE',
    airports: ['DXB', 'SHJ', 'AUH', 'RKT', 'AAN', 'FJR'],
    summary: 'Flights from or to UAE',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#UAEFlights', '#DubaiDeals', '#SharjahDeals', '#ZamraTravels'],
  },
  qatar: {
    key: 'qatar',
    label: 'Qatar',
    airports: ['DOH'],
    summary: 'Flights from or to Qatar',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#QatarFlights', '#DohaDeals', '#ZamraTravels'],
  },
  oman: {
    key: 'oman',
    label: 'Oman',
    airports: ['MCT'],
    summary: 'Flights from or to Oman',
    platforms: { instagram: true, facebook: true, youtube: true },
    hashtags: ['#OmanFlights', '#MuscatDeals', '#ZamraTravels'],
  },
};

export const POSTER_SOCIAL_COUNTRIES = {
  ccj: {
    key: 'ccj',
    label: 'Calicut (CCJ)',
    groupLabel: 'Destinations',
    airportCodes: ['CCJ'],
    keywords: ['CALICUT', 'KOZHIKODE'],
  },
  cok: {
    key: 'cok',
    label: 'Kochi (COK)',
    groupLabel: 'Destinations',
    airportCodes: ['COK'],
    keywords: ['KOCHI', 'COCHIN'],
  },
  cnn: {
    key: 'cnn',
    label: 'Kannur (CNN)',
    groupLabel: 'Destinations',
    airportCodes: ['CNN'],
    keywords: ['KANNUR'],
  },
  trv: {
    key: 'trv',
    label: 'Trivandrum (TRV)',
    groupLabel: 'Destinations',
    airportCodes: ['TRV'],
    keywords: ['TRIVANDRUM', 'THIRUVANANTHAPURAM'],
  },
  ixe: {
    key: 'ixe',
    label: 'Mangalore (IXE)',
    groupLabel: 'Destinations',
    airportCodes: ['IXE'],
    keywords: ['MANGALORE'],
  },
};

const GULF_COUNTRY_KEY_BY_CODE = Object.fromEntries(
  POSTER_SOCIAL_MARKET_ORDER.flatMap((key) => {
    const market = POSTER_SOCIAL_MARKETS[key];
    return (market?.airports || []).map((code) => [code, key]);
  }),
);

const INDIA_COUNTRY_KEY_BY_CODE = Object.fromEntries(
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

  const fromGulf = GULF_COUNTRY_KEY_BY_CODE[fromCode];
  const toGulf = GULF_COUNTRY_KEY_BY_CODE[toCode];

  if (fromGulf && !toGulf) return fromGulf;
  if (!fromGulf && toGulf) return toGulf;
  return null;
}

export function resolveSectorCountryKey(sector = {}) {
  const { fromCode, toCode } = getSectorRouteCodes(sector);
  if (!fromCode || !toCode) return null;

  const fromIndia = INDIA_COUNTRY_KEY_BY_CODE[fromCode];
  const toIndia = INDIA_COUNTRY_KEY_BY_CODE[toCode];

  if (fromIndia && !toIndia) return fromIndia;
  if (!fromIndia && toIndia) return toIndia;
  return null;
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
    marketKey: 'saudi',
    airportCode: 'JED',
    cityLabel: 'Saudi',
    cityLabelMl: 'സൗദി',
    groupLabel: 'Saudi Routes',
  },
  {
    marketKey: 'uae',
    airportCode: 'DXB',
    cityLabel: 'UAE',
    cityLabelMl: 'യു.എ.ഇ',
    groupLabel: 'UAE Routes',
  },
  {
    marketKey: 'qatar',
    airportCode: 'DOH',
    cityLabel: 'Qatar',
    cityLabelMl: 'ഖത്തർ',
    groupLabel: 'Qatar Routes',
  },
  {
    marketKey: 'oman',
    airportCode: 'MCT',
    cityLabel: 'Oman',
    cityLabelMl: 'ഒമാൻ',
    groupLabel: 'Oman Routes',
  },
];

export const POSTER_COUNTRY_ML_LABELS = {
  ccj: { label: 'CALICUT', labelMl: 'കോഴിക്കോട്', flag: '🇮🇳' },
  cok: { label: 'KOCHI', labelMl: 'കൊച്ചി', flag: '🇮🇳' },
  cnn: { label: 'KANNUR', labelMl: 'കണ്ണൂർ', flag: '🇮🇳' },
  trv: { label: 'TRIVANDRUM', labelMl: 'തിരുവനന്തപുരം', flag: '🇮🇳' },
  ixe: { label: 'MANGALORE', labelMl: 'മംഗലാപുരം', flag: '🇮🇳' },
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
