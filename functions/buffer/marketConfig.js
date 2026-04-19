const BUFFER_MARKET_CONFIG = {
  saudi: {
    key: "saudi",
    label: "Saudi",
    airports: ["JED", "RUH", "DMM"],
    channels: {
      instagram: "__SET_SAUDI_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_SAUDI_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_SAUDI_YOUTUBE_CHANNEL_ID__",
    },
  },
  uae: {
    key: "uae",
    label: "UAE",
    airports: ["DXB", "SHJ", "AUH", "RKT", "AAN", "FJR"],
    channels: {
      instagram: "__SET_UAE_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_UAE_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_UAE_YOUTUBE_CHANNEL_ID__",
    },
  },
  bahrain: {
    key: "bahrain",
    label: "Bahrain",
    airports: ["BAH"],
    channels: {
      instagram: "__SET_BAHRAIN_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_BAHRAIN_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_BAHRAIN_YOUTUBE_CHANNEL_ID__",
    },
  },
  oman: {
    key: "oman",
    label: "Oman",
    airports: ["MCT"],
    channels: {
      instagram: "__SET_OMAN_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_OMAN_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_OMAN_YOUTUBE_CHANNEL_ID__",
    },
  },
  kuwait: {
    key: "kuwait",
    label: "Kuwait",
    airports: ["KWI"],
    channels: {
      instagram: "__SET_KUWAIT_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_KUWAIT_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_KUWAIT_YOUTUBE_CHANNEL_ID__",
    },
  },
  qatar: {
    key: "qatar",
    label: "Qatar",
    airports: ["DOH"],
    channels: {
      instagram: "__SET_QATAR_INSTAGRAM_CHANNEL_ID__",
      facebook: "__SET_QATAR_FACEBOOK_CHANNEL_ID__",
      youtube: "__SET_QATAR_YOUTUBE_CHANNEL_ID__",
    },
  },
};

const INDIA_AIRPORT_CODES = new Set(["CCJ", "COK", "CNN", "TRV", "IXE"]);

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

const MARKET_CODE_TO_KEY = Object.values(BUFFER_MARKET_CONFIG)
  .flatMap((market) => market.airports.map((code) => [code, market.key]));

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

  const marketCode = fromIndia ? toCode : fromCode;
  const match = MARKET_CODE_TO_KEY.find(([code]) => code === marketCode);
  return match ? match[1] : null;
}

function isConfiguredChannelId(value) {
  const id = String(value || "").trim();
  if (!id) return false;
  if (id.startsWith("__SET_")) return false;
  return true;
}

module.exports = {
  BUFFER_MARKET_CONFIG,
  resolveSectorMarketKey,
  isConfiguredChannelId,
};
