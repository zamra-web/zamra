const BUFFER_MARKET_CONFIG = {
  saudi: {
    key: "saudi",
    label: "Saudi",
    airports: ["JED", "RUH", "DMM"],
    channels: {
      instagram: "6a2729a28f1d11f9b2663fe6",
      facebook: "6a2729c58f1d11f9b266408b",
      youtube: "6a2729e78f1d11f9b266410f",
    },
  },
  uae: {
    key: "uae",
    label: "UAE",
    airports: ["DXB", "SHJ", "AUH", "RKT", "AAN", "FJR"],
    channels: {
      instagram: "6a272ff18f1d11f9b26667b4",
      facebook: "6a2730058f1d11f9b266682e",
      youtube: "6a27b04f8f1d11f9b2686da7",
    },
  },
  qatar: {
    key: "qatar",
    label: "Qatar",
    airports: ["DOH"],
    channels: {
      instagram: "6a272b848f1d11f9b26646d6",
      facebook: "6a272ba48f1d11f9b2664736",
      youtube: "6a272bb88f1d11f9b2664774",
    },
  },
  oman: {
    key: "oman",
    label: "Oman",
    airports: ["MCT"],
    channels: {
      instagram: "6a27b31b8f1d11f9b2687667",
      facebook: "6a272e848f1d11f9b2665d35",
      youtube: "6a272eaf8f1d11f9b2665ee8",
    },
  },
  kuwait: {
    key: "kuwait",
    label: "Kuwait",
    airports: ["KWI"],
    channels: {
      instagram: "__SET_ME__",
      facebook: "__SET_ME__",
      youtube: "__SET_ME__",
    },
  },
  bahrain: {
    key: "bahrain",
    label: "Bahrain",
    airports: ["BAH"],
    channels: {
      instagram: "__SET_ME__",
      facebook: "__SET_ME__",
      youtube: "__SET_ME__",
    },
  },
};

const PLATFORM_KEYS = ["instagram", "facebook", "youtube"];

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

const VALID_MARKET_KEYS = new Set(Object.keys(BUFFER_MARKET_CONFIG));

// Build a reverse mapping from Gulf airport code to market key
const GULF_COUNTRY_KEY_BY_CODE = {};
for (const [marketKey, marketConfig] of Object.entries(BUFFER_MARKET_CONFIG)) {
  for (const code of marketConfig.airports) {
    GULF_COUNTRY_KEY_BY_CODE[code] = marketKey;
  }
}

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

  const fromGulf = GULF_COUNTRY_KEY_BY_CODE[fromCode];
  const toGulf = GULF_COUNTRY_KEY_BY_CODE[toCode];

  if (fromGulf && !toGulf) return fromGulf;
  if (!fromGulf && toGulf) return toGulf;

  return null;
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
