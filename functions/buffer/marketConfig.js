const BUFFER_MARKET_CONFIG = {
  ccj: {
    key: "ccj",
    label: "Calicut (CCJ)",
    airports: ["CCJ"],
    channels: {
      instagram: "__SET_CCJ_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_CCJ_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_CCJ_YOUTUBE_CHANNEL_ID__",
    },
  },
  cok: {
    key: "cok",
    label: "Kochi (COK)",
    airports: ["COK"],
    channels: {
      instagram: "__SET_COK_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_COK_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_COK_YOUTUBE_CHANNEL_ID__",
    },
  },
  cnn: {
    key: "cnn",
    label: "Kannur (CNN)",
    airports: ["CNN"],
    channels: {
      instagram: "__SET_CNN_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_CNN_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_CNN_YOUTUBE_CHANNEL_ID__",
    },
  },
  trv: {
    key: "trv",
    label: "Trivandrum (TRV)",
    airports: ["TRV"],
    channels: {
      instagram: "__SET_TRV_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_TRV_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_TRV_YOUTUBE_CHANNEL_ID__",
    },
  },
  ixe: {
    key: "ixe",
    label: "Mangalore (IXE)",
    airports: ["IXE"],
    channels: {
      instagram: "__SET_IXE_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_IXE_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_IXE_YOUTUBE_CHANNEL_ID__",
    },
  },
};

const PLATFORM_KEYS = ["instagram", "facebook", "youtube"];
const INDIA_AIRPORT_CODES = new Set(["CCJ", "COK", "CNN", "TRV", "IXE"]);
const INDIA_AIRPORT_KEY_BY_CODE = {
  CCJ: "ccj",
  COK: "cok",
  CNN: "cnn",
  TRV: "trv",
  IXE: "ixe",
};
const VALID_MARKET_KEYS = new Set(Object.keys(BUFFER_MARKET_CONFIG));

const LOCATION_CODE_MAP = {
  KOZHIKODE: "CCJ",
  CALICUT: "CCJ",
  KOCHI: "COK",
  COCHIN: "COK",
  KANNUR: "CNN",
  TRIVANDRUM: "TRV",
  THIRUVANANTHAPURAM: "TRV",
  MANGALORE: "IXE",
  JEDDAH: "JED",
  RIYADH: "RUH",
  DAMMAM: "DMM",
  DAMAM: "DMM",
  DMM: "DMM",
  DOHA: "DOH",
  MUSCAT: "MCT",
  BAHRAIN: "BAH",
  KUWAIT: "KWI",
  DUBAI: "DXB",
  SHARJAH: "SHJ",
  "ABU DHABI": "AUH",
  AUH: "AUH",
  "RAS AL KHAIMAH": "RKT",
  "AL AIN": "AAN",
  FUJAIRAH: "FJR",
};

function normalizeToken(value = "") {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[–—]/g, "-")
    .replace(/\bDAMAM\b/g, "DAMMAM")
    .replace(/\s+/g, " ");
}

function tokenizeSectorCode(value = "") {
  const normalized = normalizeToken(value).replace(/[^A-Z0-9]+/g, " ").trim();
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

function resolveCodeFromLabel(value = "") {
  const normalized = normalizeToken(value);
  if (!normalized) return "";
  if (LOCATION_CODE_MAP[normalized]) return LOCATION_CODE_MAP[normalized];
  const compact = normalized.replace(/\s+/g, "");
  if (LOCATION_CODE_MAP[compact]) return LOCATION_CODE_MAP[compact];
  if (/^[A-Z0-9]{3}$/.test(normalized)) return normalized;
  return "";
}

function getSectorRouteCodes(sector = {}) {
  const tokens = tokenizeSectorCode(sector.sectorCode || "");
  if (tokens.length >= 2) {
    return {
      fromCode: tokens[0],
      toCode: tokens[1],
    };
  }

  return {
    fromCode: resolveCodeFromLabel(sector.sectorFrom || ""),
    toCode: resolveCodeFromLabel(sector.sectorTo || ""),
  };
}

function resolveSectorMarketKey(sector = {}) {
  const { fromCode, toCode } = getSectorRouteCodes(sector);
  if (!fromCode || !toCode) return null;

  const fromIndia = INDIA_AIRPORT_CODES.has(fromCode);
  const toIndia = INDIA_AIRPORT_CODES.has(toCode);
  if (fromIndia === toIndia) return null;

  const indiaCode = fromIndia ? fromCode : toCode;
  return INDIA_AIRPORT_KEY_BY_CODE[indiaCode] || null;
}

function normalizeMarketKey(value = "") {
  const key = String(value || "").trim().toLowerCase();
  return VALID_MARKET_KEYS.has(key) ? key : "";
}

function resolveNormalizedMarketKey(data = {}) {
  return normalizeMarketKey(data.marketKey) || resolveSectorMarketKey(data) || "";
}

function isConfiguredChannelId(value) {
  const id = String(value || "").trim();
  if (!id) return false;
  if (id.startsWith("__SET_")) return false;
  return true;
}

function getFallbackChannels(marketKey) {
  const market = BUFFER_MARKET_CONFIG[String(marketKey || "").trim().toLowerCase()];
  return market && market.channels ? market.channels : {};
}

function getFallbackChannelId(marketKey, platform) {
  return getFallbackChannels(marketKey)[String(platform || "").trim().toLowerCase()] || "";
}

module.exports = {
  BUFFER_MARKET_CONFIG,
  PLATFORM_KEYS,
  VALID_MARKET_KEYS,
  getSectorRouteCodes,
  resolveSectorMarketKey,
  normalizeMarketKey,
  resolveNormalizedMarketKey,
  isConfiguredChannelId,
  getFallbackChannels,
  getFallbackChannelId,
};
