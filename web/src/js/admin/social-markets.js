export const POSTER_SOCIAL_MARKET_ORDER = ['saudi', 'uae', 'bahrain', 'oman', 'kuwait', 'qatar'];

export const POSTER_SOCIAL_MARKETS = {
  saudi: {
    key: 'saudi',
    label: 'Saudi',
    airports: ['JED', 'RUH', 'DMM'],
    summary: 'India ↔ JED / RUH / DMM',
    hashtags: ['#SaudiFlights', '#SaudiDeals', '#UmrahTravel', '#ZamraTravels'],
  },
  uae: {
    key: 'uae',
    label: 'UAE',
    airports: ['DXB', 'SHJ', 'AUH', 'RKT', 'AAN', 'FJR'],
    summary: 'India ↔ DXB / SHJ / AUH / RKT / AAN / FJR',
    hashtags: ['#UAEFlights', '#DubaiDeals', '#SharjahFlights', '#ZamraTravels'],
  },
  bahrain: {
    key: 'bahrain',
    label: 'Bahrain',
    airports: ['BAH'],
    summary: 'India ↔ BAH',
    hashtags: ['#BahrainFlights', '#BahrainDeals', '#TravelDeals', '#ZamraTravels'],
  },
  oman: {
    key: 'oman',
    label: 'Oman',
    airports: ['MCT'],
    summary: 'India ↔ MCT',
    hashtags: ['#OmanFlights', '#MuscatDeals', '#TravelDeals', '#ZamraTravels'],
  },
  kuwait: {
    key: 'kuwait',
    label: 'Kuwait',
    airports: ['KWI'],
    summary: 'India ↔ KWI',
    hashtags: ['#KuwaitFlights', '#KuwaitDeals', '#TravelDeals', '#ZamraTravels'],
  },
  qatar: {
    key: 'qatar',
    label: 'Qatar',
    airports: ['DOH'],
    summary: 'India ↔ DOH',
    hashtags: ['#QatarFlights', '#DohaDeals', '#TravelDeals', '#ZamraTravels'],
  },
};

export const INDIA_AIRPORT_CODES = ['CCJ', 'COK', 'CNN', 'TRV', 'IXE'];

const INDIA_AIRPORT_SET = new Set(INDIA_AIRPORT_CODES);
const MARKET_CODE_TO_KEY = Object.values(POSTER_SOCIAL_MARKETS)
  .flatMap((market) => market.airports.map((code) => [code, market.key]));

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

  const marketCode = fromIndia ? toCode : fromCode;
  const match = MARKET_CODE_TO_KEY.find(([code]) => code === marketCode);
  return match ? match[1] : null;
}

export function getPosterSocialMarket(key) {
  return POSTER_SOCIAL_MARKETS[key] || null;
}

export function listPosterSocialMarkets() {
  return POSTER_SOCIAL_MARKET_ORDER
    .map((key) => POSTER_SOCIAL_MARKETS[key])
    .filter(Boolean);
}
