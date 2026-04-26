/**
 * admin/main.js — Zamra Travels Admin Dashboard
 *
 * Full Firebase-wired admin dashboard. All tabs read from / write to Firestore
 * via the db.js service layer. Cloud Functions handle bulk operations.
 */

import '../../styles/admin/style.css';
import '../shared/vercel-insights.js';
import { onAuthChange, logoutUser } from './auth.js';
import {
  getAgents, addAgent, updateAgent, deleteAgent,
  getSectors, addSector, updateSector, deleteSector,
  getAirlines, addAirline, updateAirline, deleteAirline,
  getFares, addFare, saveFares, deleteFare, updateFare,
  getVisas, addVisa, updateVisa, deleteVisa,
  getVisaStampings, addVisaStamping, updateVisaStamping, deleteVisaStamping,
  getAttestations, addAttestation, updateAttestation, deleteAttestation,
  getPassportServices, addPassportService, updatePassportService, deletePassportService,
  getTours, addTour, updateTour, deleteTour,
  getHajjUmrahPackages, addHajjUmrahPackage, updateHajjUmrahPackage, deleteHajjUmrahPackage,
  callToggleAgentVisibility, callToggleSectorVisibility, callReorderSectors,
  callGenerateAgentReport,
  uploadAndQueueForSocial, uploadAndQueueCarousel,
  createSocialJob, updateSocialJob,
  createSocialJobItem, updateSocialJobItem,
  subscribeSocialPublishingConfig, subscribeRecentSocialJobs, subscribeSocialJobItems,
  callRefreshSocialPublishingHealth, callRunSocialQueueNow, callRetrySocialJobItem,
} from './db.js';

import { downloadVideoPoster as renderVideoPoster } from './video-export.js';
import { formatPosterBaggageDisplay } from './poster-baggage-display.js';
import { getPosterRateDisplay } from './poster-rate-display.js';
import { createSocialPublishingController } from './social-publishing.js';
import {
  listPosterSocialCountries,
  getPosterSocialMarket,
  getPosterSocialMarketPlatforms,
  listPosterSocialMarkets,
  resolveSectorCountryKey,
  resolveSectorMarketKey,
  getSectorRouteCodes,
} from './social-markets.js';

// ── Global State ──────────────────────────────────────────────────────────────
let _agents = [];
let _sectors = [];
let _airlines = [];
let _visas = [];
let _visaStampings = [];
let _attestations = [];
let _passportServices = [];
let _tours = [];
let _hajjUmrahPackages = [];
let _reportFares = [];
let _lastReportSummary = null;
let _databaseFares = [];
let _databaseDrafts = {};
let _databaseSelected = new Set();
let _databaseEditing = new Set();
let _lastPosterPreview = null;
let _activePosterSocialMarketKey = '';
let _currentAdminUser = null;
let _socialPublishingController = null;
let _isSectorReorderMode = false;
let _isSectorReorderSaving = false;
let _sectorDragState = { draggedId: '', overId: '', position: 'before' };

// ── Theme Toggle ─────────────────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'zamra-admin-theme';
let _activeTheme = 'light';
const POSTER_SOCIAL_TIME_ZONE = 'Asia/Kolkata';
const POSTER_SOCIAL_SITE = 'zamratravels.com';
const POSTER_SOCIAL_CONTACT = '9846606739';
const POSTER_SOCIAL_MARKET_LABEL = 'Zamra Travels';
const POSTER_SHORTCUT_SELECTION_PREFIX = 'shortcut:';
const POSTER_AIRPORT_SHORTCUT_KEYWORDS = {
  ccj: ['CALICUT', 'KOZHIKODE'],
  cok: ['KOCHI', 'COCHIN'],
  cnn: ['KANNUR'],
  trv: ['TRIVANDRUM', 'THIRUVANANTHAPURAM'],
  ixe: ['MANGALORE'],
};
const POSTER_SECTOR_SHORTCUTS = [
  ...listPosterSocialCountries().map((country) => ({
    key: country.key,
    label: country.label,
    groupLabel: country.groupLabel || 'Country Shortcuts',
    airportCodes: Array.isArray(country.airportCodes) ? country.airportCodes : [],
    keywords: Array.isArray(country.keywords) ? country.keywords : [],
  })),
  ...listPosterSocialMarkets().map((market) => ({
    key: `airport-${market.key}`,
    label: market.label,
    groupLabel: 'Airport Shortcuts',
    airportCodes: Array.isArray(market.airports) ? market.airports : [],
    keywords: POSTER_AIRPORT_SHORTCUT_KEYWORDS[market.key] || [],
  })),
];
const POSTER_SECTOR_SHORTCUT_BY_KEY = new Map(
  POSTER_SECTOR_SHORTCUTS.map((shortcut) => [
    shortcut.key,
    {
      ...shortcut,
      airportCodeSet: new Set(shortcut.airportCodes.map((code) => String(code || '').trim().toUpperCase())),
      keywordList: [...new Set((shortcut.keywords || []).map((keyword) => String(keyword || '').trim().toUpperCase()).filter(Boolean))],
    },
  ]),
);

function getStoredTheme() {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; }
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  _activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const toggle = document.getElementById('admin-theme-toggle');
  if (toggle) {
    toggle.classList.toggle('is-dark', theme === 'dark');
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (_lastReportSummary && _reportFares) {
    const tab = document.getElementById('reports-tab');
    renderReportCharts(_lastReportSummary, tab, { silent: true });
  }
}

function initThemeToggle() {
  const toggle = document.getElementById('admin-theme-toggle');
  if (!toggle || toggle.dataset.wired) return;
  toggle.dataset.wired = '1';
  toggle.addEventListener('click', () => {
    const nextTheme = _activeTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch { /* ignore */ }
    applyTheme(nextTheme);
  });
  applyTheme(_activeTheme);
}

const storedTheme = getStoredTheme();
applyTheme(storedTheme || getSystemTheme());

if (!storedTheme && window.matchMedia) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change', (e) => {
    if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
  });
}

function normalizeDamammText(value) {
  if (value === null || value === undefined) return value;
  return String(value).replace(/damamm/gi, (match) => {
    if (match === match.toUpperCase()) return 'DAMMAM';
    if (match === match.toLowerCase()) return 'dammam';
    return 'Dammam';
  });
}

function normalizeSectorSortOrder(value) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  return numeric;
}

function normalizeSectorRecord(sector = {}) {
  return {
    ...sector,
    sortOrder: normalizeSectorSortOrder(sector.sortOrder),
    sectorFrom: normalizeDamammText(sector.sectorFrom || ''),
    sectorTo: normalizeDamammText(sector.sectorTo || ''),
    sectorCode: normalizeDamammText(sector.sectorCode || ''),
  };
}

function normalizeSectors(list = []) {
  return list.map((sector) => normalizeSectorRecord(sector));
}

function getPosterShortcutValue(key) {
  return `${POSTER_SHORTCUT_SELECTION_PREFIX}${key}`;
}

function getPosterShortcut(shortcutKey = '') {
  return POSTER_SECTOR_SHORTCUT_BY_KEY.get(String(shortcutKey || '').trim().toLowerCase()) || null;
}

function sortPosterSectorIds(sectorIds = []) {
  const seen = new Set();
  const uniqueSectorIds = sectorIds.filter((sectorId) => {
    const key = String(sectorId || '').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const order = new Map(_sectors.map((sector, idx) => [sector.id, idx]));
  return uniqueSectorIds.sort((a, b) => {
    const oa = order.get(a) ?? Number.MAX_SAFE_INTEGER;
    const ob = order.get(b) ?? Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    return String(a).localeCompare(String(b));
  });
}

function sectorMatchesPosterShortcut(sector, shortcut) {
  if (!sector || !shortcut) return false;

  const { fromCode, toCode } = getSectorRouteCodes(sector);
  const routeCodes = [fromCode, toCode]
    .map((code) => String(code || '').trim().toUpperCase())
    .filter(Boolean);
  if (routeCodes.some((code) => shortcut.airportCodeSet.has(code))) return true;

  if (!shortcut.keywordList?.length) return false;
  const haystack = [
    sector.sectorFrom,
    sector.sectorTo,
    sector.sectorCode,
  ]
    .map((value) => normalizeDamammText(String(value || '').trim().toUpperCase()))
    .filter(Boolean);
  return haystack.some((value) => shortcut.keywordList.some((keyword) => value.includes(keyword)));
}

function getPosterShortcutSectorIds(shortcutKey) {
  const shortcut = getPosterShortcut(shortcutKey);
  if (!shortcut) return [];
  return sortPosterSectorIds(
    _sectors
      .filter((sector) => sectorMatchesPosterShortcut(sector, shortcut))
      .map((sector) => sector.id)
  );
}

function resolvePosterSectorSelection(rawValue) {
  const value = String(rawValue || '').trim();
  if (!value) {
    return { rawValue: '', kind: 'none', label: '', sectorIds: [] };
  }

  if (value === 'all') {
    return {
      rawValue: value,
      kind: 'all',
      label: 'All Sectors',
      sectorIds: sortPosterSectorIds(_sectors.map((sector) => sector.id)),
    };
  }

  if (value.startsWith(POSTER_SHORTCUT_SELECTION_PREFIX)) {
    const key = value.slice(POSTER_SHORTCUT_SELECTION_PREFIX.length);
    const shortcut = getPosterShortcut(key);
    return {
      rawValue: value,
      kind: 'shortcut',
      key,
      label: shortcut?.label || 'Shortcut',
      sectorIds: getPosterShortcutSectorIds(key),
    };
  }

  const sector = _sectors.find((item) => item.id === value);
  return {
    rawValue: value,
    kind: 'sector',
    label: sector?.sectorCode || value,
    sectorIds: value ? [value] : [],
  };
}

function getPosterSelectionRenderSectorIds(faresBySector, selection) {
  const normalizedSelection = selection?.kind ? selection : resolvePosterSectorSelection(selection);
  const sectorIds = normalizedSelection.kind === 'all'
    ? Array.from(faresBySector.keys())
    : normalizedSelection.sectorIds;
  if (!sectorIds?.length) return [];

  const availableIds = new Set(faresBySector.keys());
  return sortPosterSectorIds(sectorIds.filter((sectorId) => availableIds.has(sectorId)));
}

async function getPosterSelectionFares(selection, { startDate, endDate, includeHidden = false } = {}) {
  const normalizedSelection = selection?.kind ? selection : resolvePosterSectorSelection(selection);
  if (normalizedSelection.kind === 'none') return [];
  if (normalizedSelection.kind !== 'all' && !normalizedSelection.sectorIds.length) return [];

  const fares = await getFares({
    sectorId: normalizedSelection.kind === 'sector' ? normalizedSelection.rawValue : 'all',
    startDate,
    endDate,
    includeHidden,
  });

  if (normalizedSelection.kind === 'all') return fares;

  const allowedSectorIds = new Set(normalizedSelection.sectorIds);
  return fares.filter((fare) => allowedSectorIds.has(fare.sectorId));
}

function populatePosterSectorSelect(selectEl) {
  if (!selectEl) return;

  const currentValue = selectEl.value;
  const fragment = document.createDocumentFragment();
  fragment.appendChild(new Option('Choose Sector, Country, or Airport', ''));
  fragment.appendChild(new Option('All Sectors', 'all'));

  ['Country Shortcuts', 'Airport Shortcuts'].forEach((groupLabel) => {
    const shortcuts = POSTER_SECTOR_SHORTCUTS.filter((shortcut) => shortcut.groupLabel === groupLabel);
    if (!shortcuts.length) return;
    const group = document.createElement('optgroup');
    group.label = groupLabel;
    shortcuts.forEach((shortcut) => {
      group.appendChild(new Option(shortcut.label, getPosterShortcutValue(shortcut.key)));
    });
    fragment.appendChild(group);
  });

  const sectorGroup = document.createElement('optgroup');
  sectorGroup.label = 'Sectors';
  _sectors.forEach((sector) => {
    sectorGroup.appendChild(new Option(sector.sectorCode || sector.id, sector.id));
  });
  fragment.appendChild(sectorGroup);

  selectEl.innerHTML = '';
  selectEl.appendChild(fragment);

  const nextValue = Array.from(selectEl.options).some((option) => option.value === currentValue)
    ? currentValue
    : '';
  selectEl.value = nextValue;
}

function populateReportsSectorSelect(selectEl = document.getElementById('reports-sector-sel')) {
  if (!selectEl) return;

  const currentValue = selectEl.value || 'all';
  selectEl.innerHTML = '<option value="all">All Sectors</option>' +
    _sectors.map((sector) =>
      `<option value="${escapeHtml(sector.id)}">${escapeHtml(sector.sectorCode || sector.id)}</option>`
    ).join('');

  const nextValue = Array.from(selectEl.options).some((option) => option.value === currentValue)
    ? currentValue
    : 'all';
  selectEl.value = nextValue;
}

function refreshSectorDrivenControls() {
  populatePosterSectorSelect(document.getElementById('poster-sector-sel'));
  populateReportsSectorSelect();
  populateDatabaseFilterSelects();

  if (document.getElementById('database-tab')?.classList.contains('active') && _databaseFares.length) {
    renderDatabaseTable();
  }
}

function formatPosterSocialDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: POSTER_SOCIAL_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date).replaceAll('/', '.');
}

function buildPosterSocialRouteLabel(sector) {
  const from = String(sector?.sectorFrom || '').trim().toUpperCase();
  const to = String(sector?.sectorTo || '').trim().toUpperCase();
  if (from && to) return `${from} → ${to}`;
  if (from) return from;
  if (to) return to;
  return 'FLIGHT DEALS';
}

function uniquePosterHashtags(...groups) {
  return [...new Set(groups.flat().filter(Boolean))];
}

function formatPosterSocialMarketLabel(marketKey, fallback = 'Unknown airport group') {
  const market = getPosterSocialMarket(marketKey);
  if (market?.label) return market.label;
  const raw = String(marketKey || '').trim();
  return raw ? raw.toUpperCase() : fallback;
}

function formatPosterSocialMarketSummary(marketKey) {
  const market = getPosterSocialMarket(marketKey);
  if (!market) return '';
  return market.summary || (Array.isArray(market.airports) ? market.airports.join(' · ') : '');
}

function getPosterSocialHashtags(marketKey, type = 'image') {
  const market = getPosterSocialMarket(marketKey);
  const base = market?.hashtags || ['#TravelDeals', '#ZamraTravels'];
  if (type === 'story') return uniquePosterHashtags(base.slice(0, 3));
  if (type === 'video9x16') return uniquePosterHashtags(base, ['#Reels', '#Shorts', '#FlightDeals']);
  if (type === 'video16x9') return uniquePosterHashtags(base, ['#YouTubeTravel', '#FlightDeals', '#TravelUpdates']);
  return uniquePosterHashtags(base, ['#FlightDeals', '#BookNow']);
}

function formatPosterSocialCaption(sector, marketKey, type = 'image', date = new Date()) {
  const routeLabel = buildPosterSocialRouteLabel(sector);
  const market = getPosterSocialMarket(marketKey);
  const marketLabel = market?.label || POSTER_SOCIAL_MARKET_LABEL;
  const hashtags = getPosterSocialHashtags(marketKey, type).join(' ');

  if (type === 'video16x9') {
    return [
      `${routeLabel} flight deals for ${marketLabel}.`,
      `Fresh fares for ${formatPosterSocialDate(date)} from ${POSTER_SOCIAL_MARKET_LABEL}.`,
      `Book now at ${POSTER_SOCIAL_SITE} or call ${POSTER_SOCIAL_CONTACT}.`,
      hashtags,
    ].join('\n\n');
  }

  const lines = [
    `TODAY (${formatPosterSocialDate(date)})`,
    `${routeLabel} live fares available now!`,
    `Book now at ${POSTER_SOCIAL_SITE}`,
    `Contact: ${POSTER_SOCIAL_CONTACT}`,
  ];

  if (type === 'video9x16') {
    lines.splice(2, 0, `${marketLabel} reels + shorts ready to publish.`);
  }

  lines.push(hashtags);
  return lines.join('\n');
}

function formatPosterSocialYouTubeTitle(sector, marketKey, type = 'video9x16') {
  const routeLabel = buildPosterSocialRouteLabel(sector).replace(/\s*→\s*/g, ' to ');
  const market = getPosterSocialMarket(marketKey);
  const marketLabel = market?.label || POSTER_SOCIAL_MARKET_LABEL;
  if (type === 'video16x9') {
    return `${routeLabel} flight deals | ${marketLabel} | ${POSTER_SOCIAL_MARKET_LABEL}`;
  }
  return `${routeLabel} Shorts | ${marketLabel} | ${POSTER_SOCIAL_MARKET_LABEL}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toSafeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const ETICKET_CABIN_BAG_OPTIONS = [5, 7, 10];
const ETICKET_CHECKIN_BAG_OPTIONS = [20, 25, 30, 35, 40];

function buildKgOptionsHtml(options = [], selectedValue = 0) {
  const selected = Math.max(0, parseBaggageNumber(selectedValue));
  const unique = [...new Set(options.map(v => Math.max(0, parseBaggageNumber(v))))]
    .filter(v => v > 0)
    .sort((a, b) => a - b);
  if (!unique.length) return '';
  const resolvedSelected = unique.includes(selected) ? selected : unique[0];
  return unique
    .map(v => `<option value="${v}" ${v === resolvedSelected ? 'selected' : ''}>${v} Kg</option>`)
    .join('');
}

function parseBaggageNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function toKgDisplay(value, fallback = '—') {
  if (value === null || value === undefined || value === '') return fallback;
  const raw = String(value).trim();
  if (!raw) return fallback;
  const isNumericKg = /^\d+(\.\d+)?(\s*kg)?$/i.test(raw);
  if (isNumericKg) return `${parseBaggageNumber(raw)} Kg`;
  return raw.toUpperCase();
}

function asDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDateInputValue(value) {
  const d = asDate(value);
  if (!d) return '';
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
}

function parseDateInputValue(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDayMs(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function endOfDayMs(value) {
  if (!value) return null;
  const d = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function normalizeFlightTime(value) {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  const cleaned = raw.replace(/[–—]/g, '-').replace(/\s+/g, ' ');
  if (!cleaned.includes('-')) return cleaned;
  const parts = cleaned.split('-').map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
  return parts[0] || cleaned;
}

function getPosterDateRange(startInput, endInput) {
  const todayStr = toDateInputValue(new Date());

  if (startInput) {
    startInput.min = todayStr;
    if (!startInput.value || startInput.value < todayStr) {
      startInput.value = todayStr;
    }
  }

  if (endInput) {
    endInput.min = todayStr;
    if (endInput.value && endInput.value < todayStr) {
      endInput.value = '';
    }
  }

  const startDate = startInput?.value || todayStr;
  let endDate = endInput?.value || null;

  if (endDate && endDate < startDate) {
    endDate = null;
    if (endInput) endInput.value = '';
  }

  return { startDate, endDate };
}

// ── Sorting & Search State ────────────────────────────────────────────────────
let tableSort = {
  agents: { key: 'id', asc: true },
  sectors: { key: 'sortOrder', asc: true },
  airlines: { key: 'name', asc: true },
  visas: { key: 'countryName', asc: true },
  visaStampings: { key: 'country', asc: true },
  attestations: { key: 'country', asc: true },
  passportServices: { key: 'type', asc: true },
  tours: { key: 'title', asc: true },
  hajjUmrah: { key: 'title', asc: true },
  reportFares: { key: 'flightDate', asc: true },
  databaseFares: { key: 'flightDate', asc: true },
};
let tableSearch = { agents: '', sectors: '', airlines: '', visas: '', visaStampings: '', attestations: '', passportServices: '', tours: '', hajjUmrah: '' };
let tablePage = { agents: 1, sectors: 1, airlines: 1, visas: 1, visaStampings: 1, attestations: 1, passportServices: 1, tours: 1, hajjUmrah: 1, reportFares: 1, databaseFares: 1 };
let tableLimit = { agents: 10, sectors: 25, airlines: 10, visas: 10, visaStampings: 10, attestations: 10, passportServices: 10, tours: 10, hajjUmrah: 10, reportFares: 10, databaseFares: 25 };

const databaseFilters = {
  search: '',
  agentId: 'all',
  sectorId: 'all',
  airlineId: 'all',
  status: 'all',
  startDate: '',
  endDate: '',
};

/**
 * Sort + filter data for a given tab. Does NOT slice/paginate — returns the
 * full sorted+filtered array.  Pagination is always applied by the caller.
 */
function applySortAndFilter(data, tab) {
  let filtered = data;
  const q = tableSearch[tab]?.toLowerCase();

  if (q && tab === 'agents') {
    filtered = filtered.filter(a =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.contactPhone || '').toLowerCase().includes(q) ||
      (a.id || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'sectors') {
    filtered = filtered.filter(s =>
      (s.sectorFrom || '').toLowerCase().includes(q) ||
      (s.sectorTo || '').toLowerCase().includes(q) ||
      (s.sectorCode || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'airlines') {
    filtered = filtered.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.code || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'visas') {
    filtered = filtered.filter(v =>
      (v.countryName || '').toLowerCase().includes(q) ||
      (v.visaType || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'visaStampings') {
    filtered = filtered.filter(v =>
      (v.country || '').toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'attestations') {
    filtered = filtered.filter(v =>
      (v.country || '').toLowerCase().includes(q) ||
      (v.certificate || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'passportServices') {
    filtered = filtered.filter(v =>
      (v.type || '').toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'tours') {
    filtered = filtered.filter(t =>
      (t.title || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.duration || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'hajjUmrah') {
    filtered = filtered.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q) ||
      (p.departureCity || '').toLowerCase().includes(q) ||
      (p.airline || '').toLowerCase().includes(q)
    );
  }

  const { key, asc } = tableSort[tab];
  if (key) {
    filtered = [...filtered].sort((a, b) => {
      let valA = a[key], valB = b[key];
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
      if (key === 'sortOrder') {
        const sa = normalizeSectorSortOrder(valA) ?? Number.MAX_SAFE_INTEGER;
        const sb = normalizeSectorSortOrder(valB) ?? Number.MAX_SAFE_INTEGER;
        if (sa !== sb) return asc ? sa - sb : sb - sa;
      }
      // Numeric ID sort — treat '1','2'...'27' as numbers
      if (key === 'id') {
        const na = parseInt(valA), nb = parseInt(valB);
        if (!isNaN(na) && !isNaN(nb)) return asc ? na - nb : nb - na;
      }
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  }

  // NOTE: No slice here — callers paginate manually so page-number buttons work
  return filtered;
}

function updateSortIcons(tab) {
  document.querySelectorAll(`th[data-sort-tab="${tab}"] i`).forEach(i => {
    i.className = 'bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]';
  });
  const activeTh = document.querySelector(`th[data-sort-tab="${tab}"][data-sort-key="${tableSort[tab].key}"]`);
  if (activeTh) {
    const icon = activeTh.querySelector('i');
    if (icon) icon.className = `bi bi-arrow-${tableSort[tab].asc ? 'up' : 'down'} opacity-100 ml-1 text-[11px] text-primary`;
  }
}

// Global click delegation for sorters
document.addEventListener('click', (e) => {
  const th = e.target.closest('th[data-sort-tab]');
  if (!th) return;

  const tab = th.dataset.sortTab;
  const key = th.dataset.sortKey;
  if (tab === 'sectors' && _isSectorReorderMode) return;

  if (tableSort[tab].key === key) {
    tableSort[tab].asc = !tableSort[tab].asc;
  } else {
    tableSort[tab].key = key;
    tableSort[tab].asc = true;
  }

  if (tab === 'agents') renderAgentsTab(false);
  else if (tab === 'sectors') renderSectorsTab(false);
  else if (tab === 'airlines') renderFlightsTab(false);
  else if (tab === 'visas') renderVisasTab(false);
  else if (tab === 'tours') renderToursTab(false);
  else if (tab === 'hajjUmrah') renderHajjUmrahTab(false);
  else if (tab === 'reportFares' && _reportFares.length) renderReportFaresTable(_reportFares);
  else if (tab === 'databaseFares') renderDatabaseTable();
});

// ── Auth Guard ────────────────────────────────────────────────────────────────
document.documentElement.style.visibility = 'hidden';

onAuthChange(async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  _currentAdminUser = user;
  document.documentElement.style.visibility = 'visible';
  const adminNameEl = document.getElementById('admin-user-name');
  if (adminNameEl) adminNameEl.textContent = user.email.split('@')[0];

  // Pre-load lookup data then build chips
  await loadGlobalData();
  buildChips();
  // Boot the active tab
  await renderActiveTab();
});


// ── Logout ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const result = await logoutUser();
      if (result.success) window.location.href = '/login.html';
    });
  }
  initThemeToggle();
  initModal();
  initTabs();
  initAgentSheets();
});

// ── Pre-load global lookup data ───────────────────────────────────────────────
async function loadGlobalData() {
  try {
    const [agents, sectors, airlines, visas] = await Promise.all([
      getAgents(),
      getSectors(),
      getAirlines(),
      getVisas()
    ]);
    _agents = agents;
    _sectors = normalizeSectors(sectors);
    _airlines = airlines;
    _visas = visas;
    refreshSectorDrivenControls();
  } catch (e) {
    console.error('loadGlobalData error:', e);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
function initTabs() {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');
  const tabSelect = document.getElementById('admin-tab-select');

  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      navLinks.forEach(l => { l.classList.remove('active', 'text-primary'); l.classList.add('text-text-muted'); });
      link.classList.remove('text-text-muted');
      link.classList.add('active', 'text-primary');

      const targetId = link.getAttribute('data-tab');
      const targetTitle = link.getAttribute('data-title');
      tabContents.forEach(c => c.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
      if (pageTitle && targetTitle) pageTitle.textContent = targetTitle;
      if (tabSelect && targetId) tabSelect.value = targetId;

      // Render the newly active tab
      await renderActiveTab();
    });
  });

  if (tabSelect) {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink?.dataset?.tab) {
      tabSelect.value = activeLink.dataset.tab;
    }

    tabSelect.addEventListener('change', () => {
      const targetId = tabSelect.value;
      const targetLink = document.querySelector(`.nav-link[data-tab="${targetId}"]`);
      if (targetLink) {
        targetLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
  }
}

async function renderActiveTab() {
  const active = document.querySelector('.tab-content.active');
  if (!active) return;
  const id = active.id;
  if (id === 'agents-tab') await renderAgentsTab();
  else if (id === 'sectors-tab') await renderSectorsTab();
  else if (id === 'flights-tab') await renderFlightsTab();
  else if (id === 'dashboard-tab') await renderDashboardTab();
  else if (id === 'socials-tab') await renderSocialsTab();
  else if (id === 'reports-tab') await renderReportsTab();
  else if (id === 'database-tab') await renderDatabaseTab();
  else if (id === 'visas-tab') await renderVisasTab();
  else if (id === 'tours-tab') await renderToursTab();
  else if (id === 'hajjumrah-tab') await renderHajjUmrahTab();
  else if (id === 'agent-sheets-tab') {
    buildChips();
    syncPill();
    validate();
  }
  else if (id === 'eticket-tab') await renderETicketTab();
}


// ══════════════════════════════════════════════════════════════════════════════
// MODAL HELPER
// ══════════════════════════════════════════════════════════════════════════════
function initModal() {
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
}

/**
 * Open the admin modal with a title and body HTML.
 * @param {string} title
 * @param {string} bodyHtml
 * @param {function} onSubmit — called with formData when the form inside is submitted
 */
function openModal(title, bodyHtml, wide = false) {
  const modal = document.getElementById('admin-modal');
  document.getElementById('modal-title').textContent = title;
  // Adjust modal width for wide forms (e.g. tour, hajj with many fields)
  modal.classList.toggle('max-w-lg', !wide);
  modal.classList.toggle('max-w-2xl', wide);
  const body = document.getElementById('modal-body');
  body.innerHTML = bodyHtml;
  modal.showModal();
}


// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB — Poster Generator
// ══════════════════════════════════════════════════════════════════════════════
const POSTER_MAX_ROWS = 12;

function getPosterLayoutProfile(rowCount = 0) {
  if (rowCount >= POSTER_MAX_ROWS) {
    return {
      key: 'capacity',
      topBarHeight: 12,
      headerHeight: 212,
      headerPadX: 30,
      badgePadding: '6px 18px',
      badgeFont: 13,
      badgeMarginBottom: 12,
      titleFont: 48,
      titleLineHeight: 1.06,
      titleMarginBottom: 6,
      subtitleFont: 16,
      bodyPadding: '22px 24px 18px',
      cardPadding: 18,
      cardRadius: 18,
      thPadding: '10px 8px',
      thFont: 12,
      rowPadY: 7,
      rowPadX: 8,
      dateFont: 13,
      airlineTextFont: 12,
      logoHeight: 24,
      logoMaxWidth: 88,
      timeFont: 13,
      baggageFont: 12,
      baggagePadding: '4px 8px',
      fareFont: 17,
      footerPadding: '18px 24px',
      footerGap: 12,
      footerBrandGap: 12,
      footerLogoHeight: 38,
      footerDividerHeight: 30,
      footerTitleFont: 18,
      footerMetaFont: 15,
      footerMetaGap: 16,
    };
  }

  if (rowCount >= 10) {
    return {
      key: 'dense',
      topBarHeight: 14,
      headerHeight: 232,
      headerPadX: 34,
      badgePadding: '7px 22px',
      badgeFont: 14,
      badgeMarginBottom: 14,
      titleFont: 52,
      titleLineHeight: 1.08,
      titleMarginBottom: 8,
      subtitleFont: 18,
      bodyPadding: '30px 34px 26px',
      cardPadding: 24,
      cardRadius: 18,
      thPadding: '12px 10px',
      thFont: 13,
      rowPadY: 10,
      rowPadX: 10,
      dateFont: 14,
      airlineTextFont: 13,
      logoHeight: 28,
      logoMaxWidth: 96,
      timeFont: 14,
      baggageFont: 13,
      baggagePadding: '5px 10px',
      fareFont: 18,
      footerPadding: '22px 34px',
      footerGap: 16,
      footerBrandGap: 14,
      footerLogoHeight: 42,
      footerDividerHeight: 34,
      footerTitleFont: 20,
      footerMetaFont: 17,
      footerMetaGap: 22,
    };
  }

  if (rowCount >= 6) {
    return {
      key: 'balanced',
      topBarHeight: 14,
      headerHeight: 220,
      headerPadX: 34,
      badgePadding: '7px 22px',
      badgeFont: 14,
      badgeMarginBottom: 14,
      titleFont: 54,
      titleLineHeight: 1.08,
      titleMarginBottom: 8,
      subtitleFont: 18,
      bodyPadding: '28px 32px 24px',
      cardPadding: 22,
      cardRadius: 18,
      thPadding: '12px 10px',
      thFont: 13,
      rowPadY: 12,
      rowPadX: 10,
      dateFont: 14,
      airlineTextFont: 13,
      logoHeight: 30,
      logoMaxWidth: 102,
      timeFont: 14,
      baggageFont: 13,
      baggagePadding: '5px 11px',
      fareFont: 19,
      footerPadding: '22px 32px',
      footerGap: 16,
      footerBrandGap: 14,
      footerLogoHeight: 42,
      footerDividerHeight: 34,
      footerTitleFont: 20,
      footerMetaFont: 17,
      footerMetaGap: 22,
    };
  }

  return {
    key: 'sparse',
    topBarHeight: 14,
    headerHeight: 208,
    headerPadX: 30,
    badgePadding: '6px 20px',
    badgeFont: 13,
    badgeMarginBottom: 12,
    titleFont: 56,
    titleLineHeight: 1.08,
    titleMarginBottom: 8,
    subtitleFont: 17,
    bodyPadding: '24px 28px 22px',
    cardPadding: 20,
    cardRadius: 18,
    thPadding: '11px 10px',
    thFont: 13,
    rowPadY: 14,
    rowPadX: 10,
    dateFont: 15,
    airlineTextFont: 14,
    logoHeight: 34,
    logoMaxWidth: 110,
    timeFont: 15,
    baggageFont: 13,
    baggagePadding: '6px 12px',
    fareFont: 21,
    footerPadding: '20px 28px',
    footerGap: 14,
    footerBrandGap: 12,
    footerLogoHeight: 40,
    footerDividerHeight: 32,
    footerTitleFont: 19,
    footerMetaFont: 16,
    footerMetaGap: 18,
  };
}

function resolvePosterTitleFontSize(originName, destName, layout) {
  const totalLength = `${originName || ''}${destName || ''}`.replace(/\s+/g, '').length;
  if (totalLength >= 24) return Math.max(layout.titleFont - 12, 40);
  if (totalLength >= 18) return Math.max(layout.titleFont - 8, 44);
  if (totalLength >= 14) return Math.max(layout.titleFont - 4, 46);
  return layout.titleFont;
}
const POSTER_THEMES = [
  {
    id: 'classic',
    topBar: ['#0c4a8a', '#1e67c2', '#60a5fa'],
    headerBg: '#0f172a',
    headerOverlayFrom: '#0f172a',
    headerOverlayTo: 'rgba(15, 23, 42, 0)',
    badgeBg: 'rgba(12, 74, 138, 0.22)',
    badgeBorder: 'rgba(96, 165, 250, 0.35)',
    badgeText: '#dbeafe',
    subtitle: '#dbeafe',
    accent: '#60a5fa',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#eef4ff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#f3f6ff',
    sectorChipBg: 'rgba(37, 99, 235, 0.12)',
    sectorChipText: '#2563eb',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#2563eb'
  },
  {
    id: 'deep',
    topBar: ['#073160', '#0c4a8a', '#1e67c2'],
    headerBg: '#111827',
    headerOverlayFrom: '#111827',
    headerOverlayTo: 'rgba(17, 24, 39, 0)',
    badgeBg: 'rgba(12, 74, 138, 0.24)',
    badgeBorder: 'rgba(30, 103, 194, 0.38)',
    badgeText: '#e0efff',
    subtitle: '#cfe1ff',
    accent: '#1e67c2',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#eef4ff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#f4f7ff',
    sectorChipBg: 'rgba(30, 103, 194, 0.12)',
    sectorChipText: '#1e67c2',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#1e67c2'
  },
  {
    id: 'royal',
    topBar: ['#0f4f9e', '#1e67c2', '#60a5fa'],
    headerBg: '#0c1f3a',
    headerOverlayFrom: '#0c1f3a',
    headerOverlayTo: 'rgba(12, 31, 58, 0)',
    badgeBg: 'rgba(15, 79, 158, 0.22)',
    badgeBorder: 'rgba(96, 165, 250, 0.35)',
    badgeText: '#dbeafe',
    subtitle: '#dbeafe',
    accent: '#0f4f9e',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#ecf3ff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#f0f7ff',
    sectorChipBg: 'rgba(15, 79, 158, 0.12)',
    sectorChipText: '#0f4f9e',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#0f4f9e'
  },
  {
    id: 'sunset',
    topBar: ['#f97316', '#f43f5e', '#8b5cf6'],
    headerBg: '#3b1020',
    headerOverlayFrom: '#3b1020',
    headerOverlayTo: 'rgba(59, 16, 32, 0)',
    badgeBg: 'rgba(249, 115, 22, 0.22)',
    badgeBorder: 'rgba(248, 113, 113, 0.45)',
    badgeText: '#ffe4e6',
    subtitle: '#fee2e2',
    accent: '#f97316',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#fff7ed',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#fff1f2',
    sectorChipBg: 'rgba(249, 115, 22, 0.12)',
    sectorChipText: '#ea580c',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#f97316'
  },
  {
    id: 'orchid',
    topBar: ['#8b5cf6', '#d946ef', '#f43f5e'],
    headerBg: '#2a1240',
    headerOverlayFrom: '#2a1240',
    headerOverlayTo: 'rgba(42, 18, 64, 0)',
    badgeBg: 'rgba(217, 70, 239, 0.22)',
    badgeBorder: 'rgba(216, 180, 254, 0.45)',
    badgeText: '#f5d0fe',
    subtitle: '#f5d0fe',
    accent: '#d946ef',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#fdf2ff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#fdf2ff',
    sectorChipBg: 'rgba(217, 70, 239, 0.12)',
    sectorChipText: '#c026d3',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#d946ef'
  },
  {
    id: 'emerald',
    topBar: ['#10b981', '#22c55e', '#06b6d4'],
    headerBg: '#083a2e',
    headerOverlayFrom: '#083a2e',
    headerOverlayTo: 'rgba(8, 58, 46, 0)',
    badgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeBorder: 'rgba(94, 234, 212, 0.4)',
    badgeText: '#ccfbf1',
    subtitle: '#ccfbf1',
    accent: '#10b981',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#ecfdf5',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#ecfdf5',
    sectorChipBg: 'rgba(16, 185, 129, 0.12)',
    sectorChipText: '#059669',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#10b981'
  },
  {
    id: 'aqua',
    topBar: ['#0ea5e9', '#22d3ee', '#14b8a6'],
    headerBg: '#0b2d44',
    headerOverlayFrom: '#0b2d44',
    headerOverlayTo: 'rgba(11, 45, 68, 0)',
    badgeBg: 'rgba(14, 165, 233, 0.22)',
    badgeBorder: 'rgba(34, 211, 238, 0.4)',
    badgeText: '#cffafe',
    subtitle: '#cffafe',
    accent: '#22d3ee',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#ecfeff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#ecfeff',
    sectorChipBg: 'rgba(34, 211, 238, 0.12)',
    sectorChipText: '#0891b2',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#22d3ee'
  },
  {
    id: 'citrus',
    topBar: ['#facc15', '#f59e0b', '#f97316'],
    headerBg: '#422006',
    headerOverlayFrom: '#422006',
    headerOverlayTo: 'rgba(66, 32, 6, 0)',
    badgeBg: 'rgba(245, 158, 11, 0.22)',
    badgeBorder: 'rgba(251, 191, 36, 0.45)',
    badgeText: '#fef3c7',
    subtitle: '#fef3c7',
    accent: '#f59e0b',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#fffbeb',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#fffbeb',
    sectorChipBg: 'rgba(245, 158, 11, 0.12)',
    sectorChipText: '#d97706',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#f59e0b'
  },
  {
    id: 'rose',
    topBar: ['#fb7185', '#f43f5e', '#e11d48'],
    headerBg: '#3a0b17',
    headerOverlayFrom: '#3a0b17',
    headerOverlayTo: 'rgba(58, 11, 23, 0)',
    badgeBg: 'rgba(244, 63, 94, 0.22)',
    badgeBorder: 'rgba(251, 113, 133, 0.45)',
    badgeText: '#ffe4e6',
    subtitle: '#ffe4e6',
    accent: '#f43f5e',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#fff1f2',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#fff1f2',
    sectorChipBg: 'rgba(244, 63, 94, 0.12)',
    sectorChipText: '#e11d48',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#f43f5e'
  },
  {
    id: 'forest',
    topBar: ['#16a34a', '#22c55e', '#84cc16'],
    headerBg: '#0b2a1a',
    headerOverlayFrom: '#0b2a1a',
    headerOverlayTo: 'rgba(11, 42, 26, 0)',
    badgeBg: 'rgba(34, 197, 94, 0.22)',
    badgeBorder: 'rgba(132, 204, 22, 0.4)',
    badgeText: '#dcfce7',
    subtitle: '#dcfce7',
    accent: '#22c55e',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#f0fdf4',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#f0fdf4',
    sectorChipBg: 'rgba(34, 197, 94, 0.12)',
    sectorChipText: '#15803d',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#22c55e'
  },
  {
    id: 'ocean',
    topBar: ['#06b6d4', '#0ea5e9', '#6366f1'],
    headerBg: '#0a2440',
    headerOverlayFrom: '#0a2440',
    headerOverlayTo: 'rgba(10, 36, 64, 0)',
    badgeBg: 'rgba(14, 165, 233, 0.22)',
    badgeBorder: 'rgba(99, 102, 241, 0.4)',
    badgeText: '#dbeafe',
    subtitle: '#dbeafe',
    accent: '#0ea5e9',
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: '#eff6ff',
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: '#eff6ff',
    sectorChipBg: 'rgba(14, 165, 233, 0.12)',
    sectorChipText: '#0284c7',
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: '#0ea5e9'
  }
];

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSeed() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  return Math.floor(Math.random() * 1_000_000_000);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const raw = hex.replace('#', '').trim();
  const full = raw.length === 3
    ? raw.split('').map(c => c + c).join('')
    : raw.padEnd(6, '0');
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbaFromHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function pickHue(rand, lastHue) {
  let hue = Math.floor(rand() * 360);
  let guard = 0;
  while (lastHue !== null) {
    const diff = Math.abs(hue - lastHue);
    const wrapped = Math.min(diff, 360 - diff);
    if (wrapped >= 32) break;
    hue = Math.floor(rand() * 360);
    guard += 1;
    if (guard > 8) break;
  }
  return hue;
}

function generatePosterTheme(seed, lastHue) {
  const rand = mulberry32(seed);
  const hue = pickHue(rand, lastHue);
  const accent = hslToHex(hue, 82, 54);
  const accentSoft = hslToHex(hue, 72, 62);
  const accentAlt = hslToHex((hue + 28) % 360, 85, 56);
  const headerBg = hslToHex(hue, 42, 17);
  return {
    id: `gen-${hue}`,
    __hue: hue,
    topBar: [accent, accentAlt, accentSoft],
    headerBg,
    headerOverlayFrom: headerBg,
    headerOverlayTo: rgbaFromHex(headerBg, 0),
    badgeBg: rgbaFromHex(accent, 0.22),
    badgeBorder: rgbaFromHex(accentAlt, 0.45),
    badgeText: hslToHex(hue, 70, 92),
    subtitle: hslToHex(hue, 70, 88),
    accent: accentAlt,
    bodyBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    tableHeadBg: hslToHex(hue, 70, 96),
    tableHeadText: '#475569',
    tableBorder: '#e2e8f0',
    rowAlt: hslToHex(hue, 70, 97),
    sectorChipBg: rgbaFromHex(accent, 0.12),
    sectorChipText: hslToHex(hue, 78, 36),
    fareText: '#0f172a',
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerAccent: accent
  };
}

function buildPosterThemeOrder(count) {
  const themes = [];
  let lastHue = null;
  const baseSeed = randomSeed();
  for (let i = 0; i < count; i += 1) {
    const theme = generatePosterTheme(baseSeed + (i * 131071), lastHue);
    lastHue = theme.__hue ?? lastHue;
    themes.push(theme);
  }
  return themes;
}

let isVideoPosterGenerating = false;
let isMarketSocialQueueGenerating = false;

function applyPosterLayout(frameEl, layout) {
  if (!frameEl || !layout) return;

  const topBar = frameEl.querySelector('[data-poster-top-bar]');
  if (topBar) topBar.style.height = `${layout.topBarHeight ?? 14}px`;

  const header = frameEl.querySelector('[data-poster-header]');
  if (header) header.style.height = `${layout.headerHeight}px`;

  const headerContent = frameEl.querySelector('[data-poster-header-content]');
  if (headerContent) {
    headerContent.style.paddingLeft = `${layout.headerPadX}px`;
    headerContent.style.paddingRight = `${layout.headerPadX}px`;
  }

  const badge = frameEl.querySelector('[data-poster-badge]');
  if (badge) {
    badge.style.padding = layout.badgePadding;
    badge.style.fontSize = `${layout.badgeFont}px`;
    badge.style.marginBottom = `${layout.badgeMarginBottom}px`;
  }

  const title = frameEl.querySelector('[data-poster-title]');
  if (title) {
    title.style.lineHeight = String(layout.titleLineHeight ?? 1.08);
    title.style.marginBottom = `${layout.titleMarginBottom ?? 8}px`;
  }

  const subtitle = frameEl.querySelector('[data-poster-subtitle]');
  if (subtitle) {
    subtitle.style.fontSize = `${layout.subtitleFont}px`;
    subtitle.style.fontWeight = '600';
  }

  const body = frameEl.querySelector('[data-poster-body]');
  if (body) {
    body.style.padding = layout.bodyPadding;
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
  }

  const card = frameEl.querySelector('[data-poster-card]');
  if (card) {
    card.style.padding = `${layout.cardPadding}px`;
    card.style.borderRadius = `${layout.cardRadius}px`;
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.flex = '1';
  }

  const tableShell = frameEl.querySelector('[data-poster-table-shell]');
  if (tableShell) {
    tableShell.style.display = 'flex';
    tableShell.style.flexDirection = 'column';
    tableShell.style.flex = '1';
    tableShell.style.justifyContent = 'flex-start';
  }

  frameEl.querySelectorAll('[data-poster-th]').forEach((th) => {
    th.style.padding = layout.thPadding;
    th.style.fontSize = `${layout.thFont}px`;
  });

  const footer = frameEl.querySelector('[data-poster-footer]');
  if (footer) {
    footer.style.padding = layout.footerPadding;
    footer.style.gap = `${layout.footerGap}px`;
  }

  const footerBrand = frameEl.querySelector('[data-poster-footer-brand]');
  if (footerBrand) footerBrand.style.gap = `${layout.footerBrandGap}px`;

  const footerLogo = frameEl.querySelector('[data-poster-footer-logo]');
  if (footerLogo) footerLogo.style.height = `${layout.footerLogoHeight}px`;

  const footerDivider = frameEl.querySelector('[data-poster-footer-divider]');
  if (footerDivider) footerDivider.style.height = `${layout.footerDividerHeight}px`;

  const footerTitle = frameEl.querySelector('[data-poster-footer-title]');
  if (footerTitle) footerTitle.style.fontSize = `${layout.footerTitleFont}px`;

  const footerMeta = frameEl.querySelector('[data-poster-footer-meta]');
  if (footerMeta) {
    footerMeta.style.gap = `${layout.footerMetaGap}px`;
    footerMeta.style.fontSize = `${layout.footerMetaFont}px`;
  }
}

function applyPosterTheme(frameEl, theme) {
  if (!frameEl || !theme) return;

  const topBar = frameEl.querySelector('[data-poster-top-bar]');
  if (topBar) topBar.style.background = `linear-gradient(to right, ${theme.topBar.join(', ')})`;

  const header = frameEl.querySelector('[data-poster-header]');
  if (header) header.style.backgroundColor = theme.headerBg;

  const headerOverlay = frameEl.querySelector('[data-poster-header-overlay]');
  if (headerOverlay) headerOverlay.style.background = `linear-gradient(to top, ${theme.headerOverlayFrom}, ${theme.headerOverlayTo})`;

  const badge = frameEl.querySelector('[data-poster-badge]');
  if (badge) {
    badge.style.backgroundColor = theme.badgeBg;
    badge.style.borderColor = theme.badgeBorder;
    badge.style.color = theme.badgeText;
  }

  const subtitle = frameEl.querySelector('[data-poster-subtitle]');
  if (subtitle) subtitle.style.color = theme.subtitle;

  const body = frameEl.querySelector('[data-poster-body]');
  if (body) body.style.backgroundColor = theme.bodyBg;

  const card = frameEl.querySelector('[data-poster-card]');
  if (card) {
    card.style.backgroundColor = theme.cardBg;
    card.style.borderColor = theme.cardBorder;
  }

  const headRow = frameEl.querySelector('[data-poster-table-head]');
  if (headRow) {
    headRow.style.borderBottom = `2px solid ${theme.tableBorder}`;
    headRow.style.backgroundColor = theme.tableHeadBg;
  }
  frameEl.querySelectorAll('[data-poster-th]').forEach(th => {
    th.style.color = theme.tableHeadText;
  });

  const footer = frameEl.querySelector('[data-poster-footer]');
  if (footer) {
    footer.style.backgroundColor = theme.footerBg;
    footer.style.borderTopColor = theme.footerBorder;
  }
  frameEl.querySelectorAll('[data-poster-footer-accent]').forEach(el => {
    el.style.color = theme.footerAccent;
  });
}

function fileSafeSlug(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function buildPosterAirlineHelpers() {
  const airlineMap = {};
  _airlines.forEach((airline) => {
    if (airline.id) airlineMap[airline.id.trim().toLowerCase()] = airline;
    if (airline.code) airlineMap[airline.code.trim().toLowerCase()] = airline;
    if (airline.name) airlineMap[airline.name.trim().toLowerCase()] = airline;
  });

  const getAirline = (rawId) => {
    if (!rawId) return null;
    return airlineMap[String(rawId).trim().toLowerCase()] || null;
  };

  const toAirlineKey = (rawId) => {
    const airline = getAirline(rawId);
    if (airline?.id) return airline.id;
    return String(rawId || '').trim().toLowerCase();
  };

  return { getAirline, toAirlineKey };
}

function dedupeAndSortPosterFares(fares, toAirlineKey) {
  const groupedFaresMap = new Map();
  fares.forEach((fare) => {
    const dtTime = fare.flightDate instanceof Date ? fare.flightDate.getTime() : fare.flightDate;
    const airlineKey = toAirlineKey(fare.airlineId);
    const timeKey = normalizeFlightTime(fare.flightTime).replace(/\s+/g, '');
    const key = `${fare.sectorId}_${airlineKey}_${dtTime}_${timeKey}`;
    if (!groupedFaresMap.has(key) || Number(fare.finalRate) < Number(groupedFaresMap.get(key).finalRate)) {
      groupedFaresMap.set(key, fare);
    }
  });

  return Array.from(groupedFaresMap.values()).sort((a, b) => {
    let valA = a.flightDate;
    let valB = b.flightDate;
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    return valA - valB;
  });
}

async function buildPosterLogoBlobMap(sortedFares, getAirline) {
  async function fetchLogoBlob(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  }

  const uniqueAirlines = [...new Set(sortedFares.map((fare) => fare.airlineId))]
    .map((id) => getAirline(id))
    .filter((airline) => airline && airline.logoUrl);

  const blobUrlMap = {};
  await Promise.all(uniqueAirlines.map(async (airline) => {
    const blobUrl = await fetchLogoBlob(airline.logoUrl);
    if (blobUrl) blobUrlMap[airline.id] = blobUrl;
  }));
  return blobUrlMap;
}

function releasePosterLogoBlobMap(blobUrlMap = {}) {
  Object.values(blobUrlMap).forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore cleanup errors
    }
  });
}

async function writeTextToClipboard(text, html = '') {
  if (!text) {
    throw new Error('Nothing to copy.');
  }

  if (html && navigator?.clipboard?.write && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([text], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ]);
      return;
    } catch {
      // Fall back to plain-text clipboard APIs below.
    }
  }

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Clipboard access is unavailable.');
  }
}

function chunkPosterFares(list, size) {
  const source = Array.isArray(list) ? list : [];
  if (!source.length || !Number.isFinite(size) || size <= 0) return [];

  const chunks = [];
  for (let cursor = 0; cursor < source.length; cursor += size) {
    chunks.push(source.slice(cursor, cursor + size));
  }

  return chunks;
}

function formatPosterClipboardDate(flightDate) {
  const dt = flightDate instanceof Date ? flightDate : new Date(flightDate);
  if (Number.isNaN(dt.getTime())) {
    return String(flightDate || 'TBA').trim().toUpperCase();
  }
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
}

function formatPosterClipboardRate(rate) {
  const numericRate = Number(rate);
  if (!Number.isFinite(numericRate)) return '₹0';
  if (Number.isInteger(numericRate)) return `₹${numericRate.toLocaleString('en-IN')}`;
  return `₹${numericRate.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function getPosterClipboardSectorHeading(sectorId) {
  const sector = _sectors.find((item) => item.id === sectorId);
  if (sector) {
    const origin = String(sector.sectorFrom || '').trim().toUpperCase();
    const dest = String(sector.sectorTo || '').trim().toUpperCase();
    if (origin && dest) return `${origin} TO ${dest}`;
    if (sector.sectorCode) return String(sector.sectorCode).trim().toUpperCase();
  }

  const raw = String(sectorId || '').trim();
  const match = raw.match(/^\s*([A-Za-z0-9 ]+)\s*[-→>]\s*([A-Za-z0-9 ]+)\s*$/);
  if (match) {
    return `${match[1].trim().toUpperCase()} TO ${match[2].trim().toUpperCase()}`;
  }
  return raw.toUpperCase() || 'SECTOR';
}

function formatPosterClipboardAirlineLabel(rawLabel) {
  const normalized = String(rawLabel || 'AIRLINE')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();

  if (normalized === 'AIR INDIA EXPRESS') return 'AIR IN X';
  if (normalized === 'SRILANKAN AIRLINES') return 'SRILANKAN AIR';
  if (normalized === 'SAUDI AIRLINES') return 'SAUDI AIR';
  return normalized || 'AIRLINE';
}

function buildPosterClipboardSections(fares, selection) {
  if (!Array.isArray(fares) || !fares.length) return [];

  const { getAirline, toAirlineKey } = buildPosterAirlineHelpers();
  const sortedFares = dedupeAndSortPosterFares(fares, toAirlineKey);
  const faresBySector = new Map();
  sortedFares.forEach((fare) => {
    const sectorId = fare.sectorId || 'unknown';
    if (!faresBySector.has(sectorId)) faresBySector.set(sectorId, []);
    faresBySector.get(sectorId).push(fare);
  });

  const sectorIds = getPosterSelectionRenderSectorIds(faresBySector, selection);

  return sectorIds.map((sectorId) => {
    const sectionFares = faresBySector.get(sectorId) || [];
    if (!sectionFares.length) return null;

    const heading = getPosterClipboardSectorHeading(sectorId);
    const maxDateLabelLength = Math.max(
      6,
      ...sectionFares.map((fare) => formatPosterClipboardDate(fare.flightDate).length),
    );
    const maxAirlineLabelLength = Math.max(
      'AIRLINE'.length,
      ...sectionFares.map((fare) => {
        const airline = getAirline(fare.airlineId);
        return formatPosterClipboardAirlineLabel(airline?.name || fare.airlineId || 'AIRLINE').length;
      }),
    );
    const lines = sectionFares.map((fare) => {
      const airline = getAirline(fare.airlineId);
      const airlineLabel = formatPosterClipboardAirlineLabel(airline?.name || fare.airlineId || 'AIRLINE');
      const dateLabel = formatPosterClipboardDate(fare.flightDate).padEnd(maxDateLabelLength, ' ');
      return `${dateLabel} ${airlineLabel.padEnd(maxAirlineLabelLength, ' ')} = ${formatPosterClipboardRate(fare.finalRate)}`;
    });

    return { heading, lines };
  }).filter(Boolean);
}

function buildPosterClipboardPayload(fares, selection) {
  const sections = buildPosterClipboardSections(fares, selection);
  if (!sections.length) return { text: '', html: '' };

  const text = sections.map(({ heading, lines }) => {
    return `*${heading}*\n\`\`\`\n${lines.join('\n')}\n\`\`\``;
  }).join('\n\n');

  const html = `<div>${sections.map(({ heading, lines }) => `
    <section style="margin:0 0 16px;">
      <p style="margin:0 0 6px;font-weight:700;">${escapeHtml(heading)}</p>
      <pre style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;">${escapeHtml(lines.join('\n'))}</pre>
    </section>
  `).join('')}</div>`;

  return { text, html };
}

function countPosterClipboardRoutes(fares = []) {
  return new Set(
    fares
      .map((fare) => String(fare?.sectorId || '').trim())
      .filter(Boolean)
  ).size;
}

function buildPosterClipboardScopes(preview = _lastPosterPreview) {
  if (!preview?.fares?.length) return [];

  const fares = Array.isArray(preview.fares) ? preview.fares.filter(Boolean) : [];
  if (!fares.length) return [];

  const selection = preview.selection?.kind ? preview.selection : resolvePosterSectorSelection(preview.selection);
  const routeCount = countPosterClipboardRoutes(fares);
  const scopes = [{
    key: 'all',
    label: 'Copy All Routes',
    meta: `${routeCount} route${routeCount === 1 ? '' : 's'} · ${fares.length} fare${fares.length === 1 ? '' : 's'}`,
    successMessage: 'Poster text copied to clipboard.',
    fares,
    selection,
  }];

  const shortcutKey = String(selection?.key || '').trim().toLowerCase();
  if (selection?.kind !== 'shortcut' || !shortcutKey.startsWith('airport-')) {
    return scopes;
  }

  const marketKey = shortcutKey.slice('airport-'.length);
  const airportCode = String(getPosterSocialMarket(marketKey)?.airports?.[0] || '').trim().toUpperCase();
  if (!marketKey || !airportCode) return scopes;

  const sectorById = new Map(_sectors.map((sector) => [sector.id, sector]));
  listPosterSocialCountries().forEach((country) => {
    const scopedFares = fares.filter((fare) => {
      const sector = sectorById.get(fare.sectorId);
      if (!sector) return false;
      return resolveSectorMarketKey(sector) === marketKey && resolveSectorCountryKey(sector) === country.key;
    });
    if (!scopedFares.length) return;

    const scopedRouteCount = countPosterClipboardRoutes(scopedFares);
    if (scopedRouteCount === routeCount && scopedFares.length === fares.length) return;

    scopes.push({
      key: `country:${country.key}`,
      label: `Copy ${airportCode} to ${country.label}`,
      meta: `${scopedRouteCount} route${scopedRouteCount === 1 ? '' : 's'} · ${scopedFares.length} fare${scopedFares.length === 1 ? '' : 's'}`,
      successMessage: `${airportCode} to ${country.label} text copied to clipboard.`,
      fares: scopedFares,
      selection,
    });
  });

  return scopes;
}

function renderPosterCopyMenu() {
  const wrapper = document.querySelector('[data-poster-copy-menu]');
  const toggle = wrapper?.querySelector('[data-poster-copy-toggle]');
  const caret = wrapper?.querySelector('[data-poster-copy-caret]');
  const menu = wrapper?.querySelector('[data-poster-copy-options]');
  const scopes = buildPosterClipboardScopes();
  const hasScopedOptions = scopes.length > 1;

  if (toggle) {
    toggle.setAttribute('aria-haspopup', hasScopedOptions ? 'menu' : 'false');
    if (!hasScopedOptions) toggle.setAttribute('aria-expanded', 'false');
  }
  if (caret) caret.classList.toggle('hidden', !hasScopedOptions);

  if (!menu) return scopes;

  if (!hasScopedOptions) {
    menu.classList.add('hidden');
    menu.innerHTML = '';
    return scopes;
  }

  const [allScope, ...countryScopes] = scopes;
  const renderScopeButton = (scope) => `
    <button type="button"
      class="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
      data-poster-copy-scope="${escapeHtml(scope.key)}">
      <span class="block text-sm font-semibold text-navy">${escapeHtml(scope.label)}</span>
      <span class="block text-[11px] font-medium text-slate-500 mt-0.5">${escapeHtml(scope.meta)}</span>
    </button>
  `;

  menu.innerHTML = `
    <div class="py-1">
      ${renderScopeButton(allScope)}
      <div class="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Country Copy
      </div>
      ${countryScopes.map(renderScopeButton).join('')}
    </div>
  `;

  return scopes;
}

async function copyPosterText(scopeKey = 'all') {
  if (!_lastPosterPreview?.fares?.length) {
    toast('warning', 'No Poster', 'Generate a poster first before copying its text.');
    return;
  }

  const btn = document.getElementById('poster-copy-text');
  const originalHtml = btn?.innerHTML || '<i class="bi bi-clipboard"></i> Copy Text';
  const scopes = buildPosterClipboardScopes();
  const scope = scopes.find((item) => item.key === scopeKey) || scopes[0];
  const { text, html } = buildPosterClipboardPayload(scope?.fares || [], scope?.selection || _lastPosterPreview.selection);

  if (!text) {
    toast('warning', 'No Poster', 'Generate a poster first before copying its text.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-clipboard-check"></i> Copying…';
  }

  try {
    await writeTextToClipboard(text, html);
    toast('success', 'Copied!', scope?.successMessage || 'Poster text copied to clipboard.');
  } catch (err) {
    toast('error', 'Copy Failed', err.message || 'Clipboard access is unavailable.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
    renderPosterCopyMenu();
  }
}

async function populatePosterRenderStack(fares, selection, stack, templateFrame) {
  if (!stack || !templateFrame) return [];

  if (stack.__posterLogoBlobMap) {
    releasePosterLogoBlobMap(stack.__posterLogoBlobMap);
  }
  stack.querySelectorAll('[data-poster-clone="1"]').forEach((el) => el.remove());

  const { getAirline, toAirlineKey } = buildPosterAirlineHelpers();
  const sortedFares = dedupeAndSortPosterFares(fares, toAirlineKey);
  const blobUrlMap = await buildPosterLogoBlobMap(sortedFares, getAirline);
  stack.__posterLogoBlobMap = blobUrlMap;

  const sectorMap = {};
  _sectors.forEach((sector) => {
    sectorMap[sector.id] = sector.sectorCode;
  });

    const renderIntoFrame = (frameEl, frameFares, frameSectorId, theme) => {
      const titleEl = frameEl.querySelector('[data-poster-title]') || frameEl.querySelector('#poster-sector-title');
      const tbody = frameEl.querySelector('[data-poster-tbody]') || frameEl.querySelector('#poster-fares-tbody');
      if (!titleEl || !tbody) return;

      const layout = getPosterLayoutProfile(frameFares.length);
      applyPosterLayout(frameEl, layout);
      applyPosterTheme(frameEl, theme);

      const sector = _sectors.find((item) => item.id === frameSectorId);
      let originName = sector ? (sector.sectorFrom || 'DEP').toUpperCase() : 'DEP';
      let destName = sector ? (sector.sectorTo || 'ARR').toUpperCase() : 'ARR';
      if (!sector) {
        const raw = sectorMap[frameSectorId] || frameSectorId;
        const m = String(raw).match(/^\s*([A-Za-z0-9]+)\s*[-→>]\s*([A-Za-z0-9]+)\s*$/);
        if (m) {
          originName = m[1].toUpperCase();
          destName = m[2].toUpperCase();
        } else {
          originName = String(raw).toUpperCase();
          destName = '';
        }
      }
      const accent = theme?.accent || '#60a5fa';
      titleEl.innerHTML = destName
        ? `${originName} <span style="color:${accent};font-weight:900;">&#8594;</span> ${destName}`
        : `${originName}`;
      titleEl.style.fontSize = `${resolvePosterTitleFontSize(originName, destName, layout)}px`;

      const rows = [];
      const rowAlt = theme?.rowAlt || '#f8fafc';
      const rowBorder = theme?.tableBorder || '#f1f5f9';
      const sectorChipBg = theme?.sectorChipBg || 'rgba(37,99,235,0.1)';
      const sectorChipText = theme?.sectorChipText || '#2563eb';
      const fareText = theme?.fareText || '#0f172a';

      frameFares.forEach((fare, index) => {
        const dt = fare.flightDate instanceof Date
          ? fare.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
          : fare.flightDate;

        const airline = getAirline(fare.airlineId);
        const rowBg = index % 2 === 0 ? '#ffffff' : rowAlt;
        const logoSrc = airline ? blobUrlMap[airline.id] : null;

        const airlineCell = logoSrc
          ? `<img src="${logoSrc}" style="height:${layout.logoHeight}px;max-width:${layout.logoMaxWidth}px;object-fit:contain;display:block;margin:0 auto;" alt="${airline?.name || ''}">`
          : `<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:${layout.airlineTextFont}px;white-space:nowrap;">${airline?.name || fare.airlineId || '—'}</span>`;

        let timeCell = `<span style="color:#94a3b8;font-size:${Math.max(layout.timeFont - 2, 12)}px;">—</span>`;
        if (fare.flightTime) {
          const parts = fare.flightTime.split('-').map((part) => part.trim());
          if (parts.length >= 2) {
            timeCell = `<span style="font-weight:700;font-size:${layout.timeFont}px;color:#0f172a;white-space:nowrap;">${parts[0]} - ${parts[1]}</span>`;
          } else {
            timeCell = `<span style="font-weight:700;font-size:${layout.timeFont}px;color:#0f172a;white-space:nowrap;">${fare.flightTime}</span>`;
          }
        }

        const baggageLabel = formatPosterBaggageDisplay(fare.baggage, fare.extraBaggage);
        const baggageCell = baggageLabel === '—'
          ? `<span style="color:#94a3b8;font-size:${Math.max(layout.baggageFont - 1, 12)}px;">—</span>`
          : `<span style="font-weight:700;color:${sectorChipText};background-color:${sectorChipBg};padding:${layout.baggagePadding};border-radius:999px;font-size:${layout.baggageFont}px;text-align:center;white-space:nowrap;">${escapeHtml(baggageLabel)}</span>`;

        const posterRate = getPosterRateDisplay(fare.finalRate, fare.flightDate);

        rows.push(`
          <tr style="background-color:${rowBg};border-bottom:1px solid ${rowBorder};">
            <td style="padding:${layout.rowPadY}px ${layout.rowPadX}px;font-weight:700;color:#0f172a;font-size:${layout.dateFont}px;white-space:nowrap;">${dt}</td>
            <td style="padding:${layout.rowPadY}px ${layout.rowPadX}px;text-align:center;vertical-align:middle;">${airlineCell}</td>
            <td style="padding:${layout.rowPadY}px ${layout.rowPadX}px;text-align:center;vertical-align:middle;">${timeCell}</td>
            <td style="padding:${layout.rowPadY}px ${layout.rowPadX}px;text-align:center;vertical-align:middle;">${baggageCell}</td>
            <td style="padding:${layout.rowPadY}px ${layout.rowPadX}px;text-align:right;vertical-align:middle;">
              <div
                data-rate-mode="${posterRate.isMasked ? 'masked' : 'live'}"
                data-actual-rate="${escapeHtml(posterRate.actualLabel)}"
                style="display:inline-block;color:${fareText};font-weight:900;font-size:${layout.fareFont}px;white-space:nowrap;"
              >
                ${escapeHtml(posterRate.displayLabel)}
              </div>
            </td>
          </tr>`);
      });

      tbody.innerHTML = rows.join('');
    };

    const faresBySector = new Map();
    sortedFares.forEach((fare) => {
      const sid = fare.sectorId || 'unknown';
      if (!faresBySector.has(sid)) faresBySector.set(sid, []);
      faresBySector.get(sid).push(fare);
    });

    const sectorIdsToRender = getPosterSelectionRenderSectorIds(faresBySector, selection);

    const framesToRender = [];
    sectorIdsToRender.forEach((sid) => {
      const frameFares = faresBySector.get(sid) || [];
      if (!frameFares.length) return;
      const chunks = chunkPosterFares(frameFares, POSTER_MAX_ROWS);
      const totalPages = chunks.length || 1;
      chunks.forEach((chunk, idx) => {
        framesToRender.push({ sid, fares: chunk, page: idx + 1, pages: totalPages });
      });
    });

    const themePool = buildPosterThemeOrder(sectorIdsToRender.length || 1);
    const themeBySector = new Map();
    sectorIdsToRender.forEach((sid, idx) => {
      themeBySector.set(sid, themePool[idx] || themePool[0]);
    });

    const frames = [];
    framesToRender.forEach((entry, idx) => {
      const { sid, fares: frameFares, page, pages } = entry;
      let frameEl = templateFrame;
      if (idx > 0) {
        frameEl = templateFrame.cloneNode(true);
        frameEl.dataset.posterClone = '1';
        frameEl.removeAttribute('data-poster-template');
        frameEl.querySelectorAll('#poster-sector-title, #poster-fares-tbody').forEach((el) => el.removeAttribute('id'));
        const sectorCode = sectorMap[sid] || sid;
        const slug = fileSafeSlug(sectorCode) || `sector-${idx + 1}`;
        frameEl.id = `poster-render-frame-${slug}-${page}-${idx + 1}`;
        stack.appendChild(frameEl);
      } else {
        frameEl.id = 'poster-render-frame';
      }

      frameEl.dataset.posterFrame = '1';
      frameEl.dataset.sectorId = sid;
      frameEl.dataset.sectorCode = sectorMap[sid] || sid;
      frameEl.dataset.posterPage = String(page);
      frameEl.dataset.posterPageCount = String(pages);
      frameEl.dataset.posterRowCount = String(frameFares.length);

      const theme = themeBySector.get(sid) || themePool[0];
      renderIntoFrame(frameEl, frameFares, sid, theme);
      frames.push(frameEl);
    });

  return frames;
}

function createOffscreenPosterWorkspace() {
  const sourceTemplate = document.querySelector('[data-poster-template="1"]') || document.getElementById('poster-render-frame');
  if (!sourceTemplate) {
    throw new Error('Poster template not found.');
  }

  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.position = 'fixed';
  host.style.left = '-100000px';
  host.style.top = '0';
  host.style.width = '1400px';
  host.style.opacity = '0';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';

  const stack = document.createElement('div');
  stack.style.display = 'flex';
  stack.style.flexDirection = 'column';
  stack.style.gap = '40px';
  stack.style.alignItems = 'flex-start';
  host.appendChild(stack);

  const templateFrame = sourceTemplate.cloneNode(true);
  templateFrame.removeAttribute('data-poster-clone');
  templateFrame.setAttribute('data-poster-template', '1');
  templateFrame.id = 'poster-render-frame-workspace';
  stack.appendChild(templateFrame);
  document.body.appendChild(host);

  return {
    host,
    stack,
    templateFrame,
    destroy() {
      if (stack.__posterLogoBlobMap) {
        releasePosterLogoBlobMap(stack.__posterLogoBlobMap);
        delete stack.__posterLogoBlobMap;
      }
      host.remove();
    },
  };
}

async function renderPosterFrameToBlob(posterEl) {
  const origTransform = posterEl.style.transform;
  posterEl.style.transform = 'none';
  try {
    await Promise.all(
      Array.from(posterEl.querySelectorAll('img')).map((img) =>
        img.complete ? Promise.resolve() : new Promise((res) => {
          img.onload = res;
          img.onerror = res;
        })
      )
    );
    const canvas = await html2canvas(posterEl, {
      scale: 2,
      useCORS: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (doc) => {
        const target = posterEl.id ? doc.getElementById(posterEl.id) : null;
        if (target) inlineColorsForCanvas(target);
      },
    });
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
  } finally {
    posterEl.style.transform = origTransform;
  }
}

function getVideoProgressMessage(progress = {}) {
  if (progress?.message) return progress.message;
  switch (progress?.phase) {
    case 'preparing':
      return 'Preparing slides…';
    case 'converting':
      return 'Converting to MP4…';
    case 'encoding':
      return 'Encoding slideshow…';
    default:
      return 'Processing video…';
  }
}

async function buildVideoPosterSlides(fares, sectorId, sectors, { onProgress } = {}) {
  const workspace = createOffscreenPosterWorkspace();
  try {
    const frames = await populatePosterRenderStack(fares, sectorId, workspace.stack, workspace.templateFrame);
    if (!frames.length) {
      throw new Error('No poster slides were generated for this video.');
    }

    const sectorCode = frames[0]?.dataset.sectorCode
      || sectors?.find?.((sector) => sector.id === sectorId)?.sectorCode
      || sectorId;
    const total = frames.length;
    const slides = [];

    reportVideoProgress(onProgress, {
      phase: 'preparing',
      current: 0,
      total,
      message: total > 1 ? `Preparing slides 0/${total}…` : 'Preparing slide…',
    });

    for (let index = 0; index < total; index += 1) {
      const frame = frames[index];
      reportVideoProgress(onProgress, {
        phase: 'preparing',
        current: index + 1,
        total,
        message: total > 1 ? `Preparing slides ${index + 1}/${total}…` : 'Preparing slide…',
      });
      const blob = await renderPosterFrameToBlob(frame);
      if (!blob) {
        throw new Error(`Failed to render poster slide ${index + 1}.`);
      }
      slides.push({
        blob,
        page: Number(frame.dataset.posterPage || index + 1),
        pageTotal: Number(frame.dataset.posterPageCount || total),
        sectorId: frame.dataset.sectorId || sectorId,
        sectorCode: frame.dataset.sectorCode || sectorCode,
      });
    }

    return {
      sectorSlug: fileSafeSlug(sectorCode) || fileSafeSlug(sectorId) || 'sector',
      slides,
    };
  } finally {
    workspace.destroy();
  }
}

function reportVideoProgress(callback, payload) {
  if (typeof callback === 'function') callback(payload);
}

async function downloadVideoPoster(ratio, fares, sectorId, sectors, airlines, options = {}) {
  const { onProgress, ...videoOptions } = options || {};
  const preparedSlides = await buildVideoPosterSlides(fares, sectorId, sectors, { onProgress });
  return renderVideoPoster({
    ratio,
    slides: preparedSlides.slides,
    sectorSlug: preparedSlides.sectorSlug,
    options: {
      ...videoOptions,
      onProgress,
    },
  });
}

function getRequestedBy() {
  return {
    type: 'user',
    uid: _currentAdminUser?.uid || '',
    email: _currentAdminUser?.email || '',
    label: _currentAdminUser?.email || 'admin',
  };
}

function getSocialPublishingController() {
  if (_socialPublishingController) return _socialPublishingController;
  _socialPublishingController = createSocialPublishingController({
    toast,
    openModal,
    getFares,
    uploadAndQueueForSocial,
    uploadAndQueueCarousel,
    createSocialJob,
    updateSocialJob,
    createSocialJobItem,
    updateSocialJobItem,
    subscribeSocialPublishingConfig,
    subscribeRecentSocialJobs,
    subscribeSocialJobItems,
    callRefreshSocialPublishingHealth,
    callRunSocialQueueNow,
    callRetrySocialJobItem,
    getPosterSocialMarket,
    getPosterSocialMarketPlatforms,
    listPosterSocialMarkets,
    resolveSectorMarketKey,
    getPosterSocialDateFilters,
    getMarketSectorIds,
    formatPosterSocialCaption,
    formatPosterSocialYouTubeTitle,
    createOffscreenPosterWorkspace,
    populatePosterRenderStack,
    renderPosterFrameToBlob,
    downloadVideoPoster,
    fileSafeSlug,
    getSectors: () => _sectors,
    getAirlines: () => _airlines,
    getRequestedBy,
    isBlockedByOtherWork: () => isVideoPosterGenerating || isMarketSocialQueueGenerating,
    setVideoExportBusy: (value) => { isVideoPosterGenerating = !!value; },
    setMarketQueueBusy: (value) => { isMarketSocialQueueGenerating = !!value; },
  });
  return _socialPublishingController;
}

function getPosterSocialDateFilters() {
  const startInput = document.getElementById('social-publishing-start-date')
    || document.getElementById('poster-start-date');
  const endInput = document.getElementById('social-publishing-end-date')
    || document.getElementById('poster-end-date');
  return getPosterDateRange(startInput, endInput);
}

function getMarketSectorIds(marketKey) {
  return _sectors
    .filter((sector) => resolveSectorMarketKey(sector) === marketKey)
    .map((sector) => sector.id);
}

function renderPosterSocialMarketCards() {
  const grid = document.getElementById('poster-social-market-grid');
  if (!grid) return;

  const markets = listPosterSocialMarkets();
  if (_activePosterSocialMarketKey && !markets.some((market) => market.key === _activePosterSocialMarketKey)) {
    _activePosterSocialMarketKey = '';
  }

  const activeMarket = getPosterSocialMarket(_activePosterSocialMarketKey);
  grid.innerHTML = `
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        ${markets.map((market) => {
          const isActive = market.key === _activePosterSocialMarketKey;
          const activeClasses = isActive
            ? 'border-primary bg-linear-to-br from-primary to-[#1b63b9] text-white shadow-[0_20px_36px_rgba(12,74,138,0.28)]'
            : 'border-slate-200 bg-white/90 text-navy shadow-[0_14px_28px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_32px_rgba(15,23,42,0.1)]';

          return `
            <button
              type="button"
              class="group min-h-[92px] rounded-[22px] border px-4 py-3 text-left transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 ${activeClasses}"
              data-market-social-select="1"
              data-market-key="${market.key}"
              aria-pressed="${isActive ? 'true' : 'false'}"
            >
              <span class="flex items-start justify-between gap-2">
                <span class="text-[15px] font-bold">${market.label}</span>
              </span>
              <span class="mt-3 block text-[10px] font-semibold uppercase tracking-[0.2em] ${isActive ? 'text-white/72' : 'text-text-muted'}">
                ${formatPosterSocialMarketSummary(market.key)}
              </span>
            </button>
          `;
        }).join('')}
      </div>
      ${activeMarket ? `
        <div class="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_34px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <i class="bi bi-share-fill"></i>
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-navy">${activeMarket.label}</p>
              <p class="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">${formatPosterSocialMarketSummary(activeMarket.key)}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              class="admin-btn admin-btn-soft min-w-[126px] justify-center"
              data-market-social-action="images"
              data-market-key="${activeMarket.key}"
            >
              <i class="bi bi-images"></i> Images
            </button>
            <button
              type="button"
              class="admin-btn admin-btn-primary min-w-[126px] justify-center"
              data-market-social-action="videos"
              data-market-key="${activeMarket.key}"
            >
              <i class="bi bi-camera-video"></i> Videos
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function setMarketSocialButtonsDisabled(disabled, activeButton = null, busyLabel = '') {
  document.querySelectorAll('[data-market-social-select], [data-market-social-action]').forEach((button) => {
    const btn = button;
    btn.disabled = disabled;
    if (!btn.matches('[data-market-social-action]')) return;
    if (!btn.dataset.defaultLabel) {
      btn.dataset.defaultLabel = btn.innerHTML;
    }
    if (disabled && activeButton === btn) {
      btn.innerHTML = busyLabel || btn.dataset.defaultLabel;
    } else if (!disabled) {
      btn.innerHTML = btn.dataset.defaultLabel;
    }
  });
}

async function queueMarketImagesForSocial(marketKey, triggerButton) {
  const market = getPosterSocialMarket(marketKey);
  if (!market) {
    toast('error', 'Queue Failed', 'Unknown airport group.');
    return;
  }

  if (isVideoPosterGenerating || isMarketSocialQueueGenerating) {
    toast('warning', 'Please Wait', 'Another poster export or social queue job is already running.');
    return;
  }

  const sectorIds = getMarketSectorIds(marketKey);
  if (!sectorIds.length) {
    toast('warning', 'No Sectors', `No routes touching ${market.label} are configured yet.`);
    return;
  }

  const { startDate, endDate } = getPosterSocialDateFilters();
  isMarketSocialQueueGenerating = true;
  setMarketSocialButtonsDisabled(true, triggerButton, '<i class="bi bi-arrow-repeat animate-spin"></i> Queuing…');

  try {
    const fares = await getFares({ sectorId: 'all', startDate, endDate, includeHidden: false });
    const faresBySector = new Map();
    fares.forEach((fare) => {
      if (!sectorIds.includes(fare.sectorId)) return;
      if (!faresBySector.has(fare.sectorId)) faresBySector.set(fare.sectorId, []);
      faresBySector.get(fare.sectorId).push(fare);
    });

    const eligibleSectors = sectorIds
      .map((sid) => _sectors.find((sector) => sector.id === sid))
      .filter((sector) => sector && (faresBySector.get(sector.id)?.length || 0) > 0);

    if (!eligibleSectors.length) {
      toast('warning', 'No Fares', `No live ${market.label} fares found for the selected date range.`);
      return;
    }

    const workspace = createOffscreenPosterWorkspace();
    let queuedCarousels = 0;
    let totalImages = 0;
    let failedSectors = 0;
    try {
      for (let index = 0; index < eligibleSectors.length; index += 1) {
        const sector = eligibleSectors[index];
        try {
          const sectorFares = faresBySector.get(sector.id) || [];
          const frames = await populatePosterRenderStack(sectorFares, sector.id, workspace.stack, workspace.templateFrame);
          if (!frames.length) continue;

          const items = [];
          for (const frame of frames) {
            const blob = await renderPosterFrameToBlob(frame);
            if (!blob) continue;
            const page = Number(frame.dataset.posterPage || 1);
            const pageCount = Number(frame.dataset.posterPageCount || 1);
            const pageSuffix = pageCount > 1 ? `-p${page}` : '';
            items.push({
              blob,
              filename: `${fileSafeSlug(sector.sectorCode || sector.id) || 'poster'}${pageSuffix}-${Date.now()}.jpg`,
            });
          }
          if (!items.length) continue;

          await uploadAndQueueCarousel(items, {
            sectorId: sector.id,
            sectorCode: sector.sectorCode || sector.id,
            marketKey,
            caption: formatPosterSocialCaption(sector, marketKey, 'image'),
            platforms: ['instagram', 'facebook'],
          });

          queuedCarousels += 1;
          totalImages += items.length;
        } catch (error) {
          failedSectors += 1;
          console.error('Market image queue failed for sector', sector.id, error);
        }
      }
    } finally {
      workspace.destroy();
    }

    if (!queuedCarousels) {
      toast('warning', 'No Fares', `No live ${market.label} fares found for the selected date range.`);
      return;
    }

    const carouselLabel = queuedCarousels === 1 ? 'sector batch' : 'sector batches';
    const imageLabel = totalImages === 1 ? 'image' : 'images';
    const failureNote = failedSectors ? ` ${failedSectors} sector${failedSectors > 1 ? 's' : ''} failed.` : '';
    toast('success', 'Queued for Social', `${queuedCarousels} ${market.label} ${carouselLabel} (${totalImages} ${imageLabel}) queued for Instagram/Facebook feed posts.${failureNote}`);
  } catch (error) {
    console.error('Market image queue failed:', error);
    toast('error', 'Queue Failed', error.message || 'Failed to queue airport images.');
  } finally {
    isMarketSocialQueueGenerating = false;
    setMarketSocialButtonsDisabled(false);
  }
}

async function queueMarketVideosForSocial(marketKey, triggerButton) {
  const market = getPosterSocialMarket(marketKey);
  if (!market) {
    toast('error', 'Queue Failed', 'Unknown airport group.');
    return;
  }

  if (isVideoPosterGenerating || isMarketSocialQueueGenerating) {
    toast('warning', 'Please Wait', 'Another poster export or social queue job is already running.');
    return;
  }

  const sectorIds = getMarketSectorIds(marketKey);
  if (!sectorIds.length) {
    toast('warning', 'No Sectors', `No routes touching ${market.label} are configured yet.`);
    return;
  }

  const { startDate, endDate } = getPosterSocialDateFilters();
  const progressEl = document.getElementById('poster-video-progress');
  const setProgress = (message) => {
    if (!progressEl) return;
    if (message) {
      progressEl.textContent = message;
      progressEl.classList.remove('hidden');
    } else {
      progressEl.classList.add('hidden');
    }
  };

  isVideoPosterGenerating = true;
  isMarketSocialQueueGenerating = true;
  setMarketSocialButtonsDisabled(true, triggerButton, '<i class="bi bi-arrow-repeat animate-spin"></i> Rendering…');
  setProgress(`Preparing ${market.label} video queue…`);

  try {
    const fares = await getFares({ sectorId: 'all', startDate, endDate, includeHidden: false });
    const faresBySector = new Map();
    fares.forEach((fare) => {
      if (!sectorIds.includes(fare.sectorId)) return;
      if (!faresBySector.has(fare.sectorId)) faresBySector.set(fare.sectorId, []);
      faresBySector.get(fare.sectorId).push(fare);
    });

    const eligibleSectors = sectorIds
      .map((sid) => _sectors.find((sector) => sector.id === sid))
      .filter((sector) => sector && (faresBySector.get(sector.id)?.length || 0) > 0);

    if (!eligibleSectors.length) {
      toast('warning', 'No Fares', `No live ${market.label} fares found for the selected date range.`);
      return;
    }

    let queuedVideos = 0;
    let failedSectors = 0;
    for (let index = 0; index < eligibleSectors.length; index += 1) {
      const sector = eligibleSectors[index];
      try {
        const sectorFares = faresBySector.get(sector.id) || [];
        const sectorCode = sector.sectorCode || sector.id;

        const shortPrefix = `Rendering ${index + 1}/${eligibleSectors.length} · ${sectorCode} · 9:16`;
        setProgress(shortPrefix);
        const shortResult = await downloadVideoPoster('9x16', sectorFares, sector.id, _sectors, _airlines, {
          autoDownload: false,
          returnBlob: true,
          requireMp4: true,
          onProgress: (progress) => setProgress(`${shortPrefix} · ${getVideoProgressMessage(progress)}`),
        });
        if (shortResult?.blob) {
          await uploadAndQueueForSocial(shortResult.blob, `${fileSafeSlug(sectorCode)}-9x16-${Date.now()}.mp4`, {
            sectorId: sector.id,
            sectorCode,
            marketKey,
            mediaType: 'video',
            ratio: '9x16',
            caption: formatPosterSocialCaption(sector, marketKey, 'video9x16'),
            youtubeTitle: formatPosterSocialYouTubeTitle(sector, marketKey, 'video9x16'),
            platforms: ['instagram', 'facebook', 'youtube'],
          });
          queuedVideos += 1;
        }

        const widePrefix = `Rendering ${index + 1}/${eligibleSectors.length} · ${sectorCode} · 16:9`;
        setProgress(widePrefix);
        const widescreenResult = await downloadVideoPoster('16x9', sectorFares, sector.id, _sectors, _airlines, {
          autoDownload: false,
          returnBlob: true,
          requireMp4: true,
          onProgress: (progress) => setProgress(`${widePrefix} · ${getVideoProgressMessage(progress)}`),
        });
        if (widescreenResult?.blob) {
          await uploadAndQueueForSocial(widescreenResult.blob, `${fileSafeSlug(sectorCode)}-16x9-${Date.now()}.mp4`, {
            sectorId: sector.id,
            sectorCode,
            marketKey,
            mediaType: 'video',
            ratio: '16x9',
            caption: formatPosterSocialCaption(sector, marketKey, 'video16x9'),
            youtubeTitle: formatPosterSocialYouTubeTitle(sector, marketKey, 'video16x9'),
            platforms: ['youtube'],
          });
          queuedVideos += 1;
        }
      } catch (error) {
        failedSectors += 1;
        console.error('Market video queue failed for sector', sector.id, error);
      }
    }

    if (!queuedVideos) {
      toast('warning', 'Queue Failed', `No ${market.label} videos were queued.${failedSectors ? ` ${failedSectors} sector${failedSectors > 1 ? 's' : ''} failed.` : ''}`);
      return;
    }

    const failureNote = failedSectors ? ` ${failedSectors} sector${failedSectors > 1 ? 's' : ''} failed.` : '';
    toast('success', 'Queued for Social', `${queuedVideos} ${market.label} video uploads queued for Buffer.${failureNote}`);
  } catch (error) {
    console.error('Market video queue failed:', error);
    toast('error', 'Queue Failed', error.message || 'Failed to queue airport videos.');
  } finally {
    isVideoPosterGenerating = false;
    isMarketSocialQueueGenerating = false;
    setProgress('');
    setMarketSocialButtonsDisabled(false);
  }
}

function wirePosterVideoMenu() {
  const wrapper = document.querySelector('[data-poster-video-menu]');
  if (!wrapper || wrapper.dataset.wired) return;
  wrapper.dataset.wired = '1';

  const toggle = wrapper.querySelector('[data-poster-video-toggle]');
  const menu = wrapper.querySelector('[data-poster-video-options]');
  if (!toggle || !menu) return;

  const isOpen = () => !menu.classList.contains('hidden');
  const closeMenu = () => {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    menu.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.addEventListener('click', (e) => {
    if (e.target && e.target.closest('button')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function wirePosterCopyMenu() {
  const wrapper = document.querySelector('[data-poster-copy-menu]');
  if (!wrapper || wrapper.dataset.wired) return;
  wrapper.dataset.wired = '1';

  const toggle = wrapper.querySelector('[data-poster-copy-toggle]');
  const menu = wrapper.querySelector('[data-poster-copy-options]');
  if (!toggle || !menu) return;

  const isOpen = () => !menu.classList.contains('hidden');
  const closeMenu = () => {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  };

  renderPosterCopyMenu();

  toggle.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const scopes = renderPosterCopyMenu();
    if (scopes.length <= 1) {
      closeMenu();
      await copyPosterText();
      return;
    }

    if (isOpen()) closeMenu();
    else {
      menu.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  menu.addEventListener('click', async (e) => {
    const actionBtn = e.target?.closest?.('[data-poster-copy-scope]');
    if (!actionBtn) return;

    e.preventDefault();
    e.stopPropagation();
    closeMenu();
    await copyPosterText(actionBtn.dataset.posterCopyScope || 'all');
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

function wirePosterSocialMenu() {
  const wrapper = document.querySelector('[data-poster-social-menu]');
  if (!wrapper || wrapper.dataset.wired) return;
  wrapper.dataset.wired = '1';

  const toggle = wrapper.querySelector('[data-poster-social-toggle]');
  const menu = wrapper.querySelector('[data-poster-social-options]');
  if (!toggle || !menu) return;

  const isOpen = () => !menu.classList.contains('hidden');
  const closeMenu = () => {
    menu.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    menu.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) closeMenu();
    else openMenu();
  });

  menu.addEventListener('click', (e) => {
    if (e.target && e.target.closest('button')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/** Renders every visible poster frame to a JPEG blob and queues it for Buffer.
 *  Multi-page sectors are uploaded as a single carousel post (one queue doc
 *  with `mediaUrls` containing all page URLs). */
async function queuePosterForSocial() {
  const stack = document.getElementById('poster-render-stack');
  const frames = stack ? Array.from(stack.querySelectorAll('[data-poster-frame="1"]')) : [];
  if (!frames.length) {
    toast('warning', 'No Poster', 'Generate a poster first before queuing it.');
    return;
  }

  const btn = document.getElementById('poster-queue-social-img');
  if (btn) { btn.disabled = true; btn.textContent = 'Queuing…'; }

  const fileSafe = (s) => String(s || '').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();

  // Group frames by sector so multi-page sectors become one carousel.
  const groups = new Map();
  for (const frame of frames) {
    const sid = frame.dataset.sectorId || '';
    if (!groups.has(sid)) groups.set(sid, []);
    groups.get(sid).push(frame);
  }
  // Preserve page order within each sector group.
  for (const list of groups.values()) {
    list.sort((a, b) => Number(a.dataset.posterPage || 1) - Number(b.dataset.posterPage || 1));
  }

  const renderFrame = async (posterEl) => {
    const origTransform = posterEl.style.transform;
    posterEl.style.transform = 'none';
    try {
      await Promise.all(
        Array.from(posterEl.querySelectorAll('img')).map(img =>
          img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
        )
      );
      const canvas = await html2canvas(posterEl, {
        scale: 2,
        useCORS: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (doc) => {
          const target = posterEl.id ? doc.getElementById(posterEl.id) : null;
          if (target) inlineColorsForCanvas(target);
        },
      });
      return await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92));
    } finally {
      posterEl.style.transform = origTransform;
    }
  };

  let carousels = 0;
  let totalImages = 0;
  try {
    for (const [sidRaw, group] of groups) {
      const first = group[0];
      const sectorCode = first.dataset.sectorCode || sidRaw;
      const sector = _sectors.find(s => s.id === sidRaw);
      const caption = formatPosterSocialCaption(sector);

      const items = [];
      for (const frame of group) {
        const blob = await renderFrame(frame);
        if (!blob) continue;
        const page = Number(frame.dataset.posterPage || 1);
        const pageSuffix = group.length > 1 ? `-p${page}` : '';
        const filename = `${fileSafe(sectorCode) || 'poster'}${pageSuffix}-${Date.now()}.jpg`;
        items.push({ blob, filename });
      }
      if (!items.length) continue;

      await uploadAndQueueCarousel(items, {
        sectorId: sidRaw,
        sectorCode,
        caption,
        platforms: ['instagram', 'facebook'],
      });
      carousels++;
      totalImages += items.length;
    }

    const carouselLabel = carousels === 1 ? 'carousel' : 'carousels';
    const imgLabel = totalImages === 1 ? 'image' : 'images';
    toast('success', 'Queued for Social', `${carousels} ${carouselLabel} (${totalImages} ${imgLabel}) sent to Buffer.`);
  } catch (e) {
    console.error('Social queue failed:', e);
    toast('error', 'Queue Failed', e.message || 'Failed to upload poster.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Queue Image'; }
  }
}

/** Generates a video for the current sector/date selection and uploads it to
 *  Firebase Storage as a pending social_queue item. */
async function queueVideoForSocial(ratio) {
  const sectorSel = document.getElementById('poster-sector-sel');
  const startInput = document.getElementById('poster-start-date');
  const endInput = document.getElementById('poster-end-date');
  const selection = resolvePosterSectorSelection(sectorSel?.value);
  const { startDate, endDate } = getPosterDateRange(startInput, endInput);

  if (selection.kind === 'none') {
    toast('warning', 'Validation Error', 'Please select a sector, country, or airport before queuing a video.');
    return;
  }

  if (selection.kind === 'shortcut' && !selection.sectorIds.length) {
    toast('warning', 'No Sectors', `No sectors are mapped to ${selection.label} yet.`);
    return;
  }

  if (isVideoPosterGenerating) {
    toast('warning', 'Video Generation', 'A video export is already running. Please wait…');
    return;
  }

  const ratioLabel = ratio.replace('x', ':');
  const progressEl = document.getElementById('poster-video-progress');
  const setProgress = (msg) => {
    if (!progressEl) return;
    if (msg) { progressEl.textContent = msg; progressEl.classList.remove('hidden'); }
    else { progressEl.classList.add('hidden'); }
  };

  const fileSafe = (s) => String(s || '').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();

  isVideoPosterGenerating = true;
  setProgress(`Generating ${ratioLabel} video…`);

  try {
    const fares = await getPosterSelectionFares(selection, { startDate, endDate, includeHidden: false });
    if (!fares || !fares.length) {
      toast('warning', 'No Fares', `No live fares found for ${selection.label || 'the selected option'} in the selected date range.`);
      return;
    }

    if (selection.kind !== 'sector') {
      const faresBySector = new Map();
      fares.forEach(f => {
        const sid = f.sectorId || 'unknown';
        if (!faresBySector.has(sid)) faresBySector.set(sid, []);
        faresBySector.get(sid).push(f);
      });

      const sectorIds = getPosterSelectionRenderSectorIds(faresBySector, selection);

      toast('info', 'Queue Videos', `Generating ${sectorIds.length} video${sectorIds.length > 1 ? 's' : ''} for ${selection.label}…`);
      let ok = 0;
      for (let idx = 0; idx < sectorIds.length; idx++) {
        const sid = sectorIds[idx];
        const sectorFares = faresBySector.get(sid) || [];
        if (!sectorFares.length) continue;
        const sector = _sectors.find(s => s.id === sid);
        const sectorLabel = sector?.sectorCode || sid;
        const prefix = `Rendering ${idx + 1}/${sectorIds.length} · ${sectorLabel}`;
        setProgress(prefix);
        try {
          const result = await downloadVideoPoster(ratio, sectorFares, sid, _sectors, _airlines, {
            autoDownload: false, returnBlob: true, requireMp4: true,
            onProgress: (progress) => setProgress(`${prefix} · ${getVideoProgressMessage(progress)}`),
          });
          if (result?.blob) {
            const filename = `${fileSafe(sectorLabel)}-${ratio}-${Date.now()}.mp4`;
            const caption = formatPosterSocialCaption(sector);
            await uploadAndQueueForSocial(result.blob, filename, {
              sectorId: sid,
              sectorCode: sectorLabel,
              mediaType: 'video',
              ratio,
              caption,
              platforms: ['instagram', 'facebook', 'youtube'],
            });
            ok++;
          }
        } catch (e) {
          console.error('Video queue failed for sector', sid, e);
        }
        await new Promise(res => setTimeout(res, 250));
      }
      if (ok) toast('success', 'Queued for Social', `${ok} video${ok > 1 ? 's' : ''} added to the posting queue.`);
    } else {
      const sectorId = selection.rawValue;
      const sector = _sectors.find(s => s.id === sectorId);
      const sectorLabel = sector?.sectorCode || selection.label || sectorId;
      const prefix = `Rendering ${ratioLabel} video`;
      setProgress(`${prefix}…`);
      const result = await downloadVideoPoster(ratio, fares, sectorId, _sectors, _airlines, {
        autoDownload: false, returnBlob: true, requireMp4: true,
        onProgress: (progress) => setProgress(`${prefix} · ${getVideoProgressMessage(progress)}`),
      });
      if (result?.blob) {
        const filename = `${fileSafe(sectorLabel)}-${ratio}-${Date.now()}.mp4`;
        const caption = formatPosterSocialCaption(sector);
        await uploadAndQueueForSocial(result.blob, filename, {
          sectorId,
          sectorCode: sectorLabel,
          mediaType: 'video',
          ratio,
          caption,
          platforms: ['instagram', 'facebook', 'youtube'],
        });
        toast('success', 'Queued for Social', `${ratioLabel} video for ${sectorLabel} added to the posting queue.`);
      }
    }
  } catch (e) {
    console.error('Video queue failed:', e);
    toast('error', 'Queue Failed', e.message || 'Failed to generate or upload video.');
  } finally {
    isVideoPosterGenerating = false;
    setProgress(null);
  }
}

async function renderDashboardTab() {
  const tab = document.getElementById('dashboard-tab');
  if (!tab) return;

  // Populate sector dropdown from live Firestore data
  const sectorSel = document.getElementById('poster-sector-sel');
  populatePosterSectorSelect(sectorSel);

  const startInput = document.getElementById('poster-start-date');
  const endInput = document.getElementById('poster-end-date');
  getPosterDateRange(startInput, endInput);
  wirePosterVideoMenu();
  wirePosterCopyMenu();
  renderPosterCopyMenu();

  // Hook up Generate Poster button
  const generateBtn = document.getElementById('poster-generate-btn');
  if (generateBtn && !generateBtn.dataset.wired) {
    generateBtn.dataset.wired = '1';
    generateBtn.addEventListener('click', async () => {
      const startInput = document.getElementById('poster-start-date');
      const endInput = document.getElementById('poster-end-date');
      const selection = resolvePosterSectorSelection(sectorSel?.value);
      const { startDate, endDate } = getPosterDateRange(startInput, endInput);

      if (selection.kind === 'none') {
        toast('warning', 'Validation Error', 'Please select a sector, country, or airport to generate the poster.');
        return;
      }

      if (selection.kind === 'shortcut' && !selection.sectorIds.length) {
        toast('warning', 'No Sectors', `No sectors are mapped to ${selection.label} yet.`);
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating…';
      try {
        const fares = await getPosterSelectionFares(selection, { startDate, endDate, includeHidden: false });
        if (!fares || !fares.length) {
          _lastPosterPreview = null;
          renderPosterCopyMenu();
          toast('warning', 'No Fares', `No live fares found for ${selection.label || 'the selected option'} in the selected date range.`);
          document.getElementById('poster-preview-container').classList.add('hidden');
          return;
        }
        await renderPoster(fares, selection);
      } catch (e) {
        toast('error', 'Generation Failed', e.message);
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Poster';
      }
    });

    // Wire up download buttons
    document.getElementById('poster-download-jpg')?.addEventListener('click', () => downloadPoster('jpeg'));
    document.getElementById('poster-download-pdf')?.addEventListener('click', () => downloadPoster('pdf'));

    // Wire up video download buttons
    document.getElementById('poster-download-vid-1x1')?.addEventListener('click', () => handleVideoPoster('1x1'));
    document.getElementById('poster-download-vid-9x16')?.addEventListener('click', () => handleVideoPoster('9x16'));
    document.getElementById('poster-download-vid-16x9')?.addEventListener('click', () => handleVideoPoster('16x9'));
  }
}

async function renderSocialsTab() {
  const tab = document.getElementById('socials-tab');
  if (!tab) return;

  const startInput = document.getElementById('social-publishing-start-date');
  const endInput = document.getElementById('social-publishing-end-date');
  getPosterDateRange(startInput, endInput);
  getSocialPublishingController().render();
}

async function handleVideoPoster(ratio) {
  const sectorSel = document.getElementById('poster-sector-sel');
  const startInput = document.getElementById('poster-start-date');
  const endInput = document.getElementById('poster-end-date');
  const selection = resolvePosterSectorSelection(sectorSel?.value);
  const { startDate, endDate } = getPosterDateRange(startInput, endInput);

  if (selection.kind === 'none') {
    toast('warning', 'Validation Error', 'Please select a sector, country, or airport to generate the poster.');
    return;
  }

  if (selection.kind === 'shortcut' && !selection.sectorIds.length) {
    toast('warning', 'No Sectors', `No sectors are mapped to ${selection.label} yet.`);
    return;
  }

  if (isVideoPosterGenerating) {
    toast('warning', 'Video Generation', 'A video export is already running. Please wait…');
    return;
  }

  const progressEl = document.getElementById('poster-video-progress');
  const setProgress = (msg) => {
    if (!progressEl) return;
    if (msg) {
      progressEl.textContent = msg;
      progressEl.classList.remove('hidden');
    } else {
      progressEl.classList.add('hidden');
    }
  };

  const videoBtns = [
    document.getElementById('poster-download-vid-1x1'),
    document.getElementById('poster-download-vid-9x16'),
    document.getElementById('poster-download-vid-16x9')
  ].filter(Boolean);
  videoBtns.forEach(btn => { btn.disabled = true; });
  isVideoPosterGenerating = true;
  setProgress('Preparing video…');

  try {
    const fares = await getPosterSelectionFares(selection, { startDate, endDate, includeHidden: false });
    if (!fares || !fares.length) {
      toast('warning', 'No Fares', `No live fares found for ${selection.label || 'the selected option'} in the selected date range.`);
      return;
    }
    if (selection.kind !== 'sector') {
      // Generate one video per sector (same as multi-poster behavior)
      const faresBySector = new Map();
      fares.forEach(f => {
        const sid = f.sectorId || 'unknown';
        if (!faresBySector.has(sid)) faresBySector.set(sid, []);
        faresBySector.get(sid).push(f);
      });

      const sectorIds = getPosterSelectionRenderSectorIds(faresBySector, selection);

      toast('info', 'Video Generation', `Generating ${sectorIds.length} video${sectorIds.length > 1 ? 's' : ''} for ${selection.label}. This may take a while…`);
      const downloads = [];
      let ok = 0;
      let fail = 0;
      for (let idx = 0; idx < sectorIds.length; idx += 1) {
        const sid = sectorIds[idx];
        const sectorFares = faresBySector.get(sid) || [];
        if (!sectorFares.length) continue;
        const sectorLabel = _sectors.find(s => s.id === sid)?.sectorCode || sid;
        const prefix = `Rendering ${idx + 1}/${sectorIds.length} · ${sectorLabel}`;
        setProgress(prefix);
        try {
          const result = await downloadVideoPoster(
            ratio,
            sectorFares,
            sid,
            _sectors,
            _airlines,
            {
              autoDownload: true,
              returnBlob: true,
              requireMp4: true,
              onProgress: (progress) => setProgress(`${prefix} · ${getVideoProgressMessage(progress)}`),
            },
          );
          if (result?.blob) downloads.push(result);
          ok += 1;
        } catch (e) {
          fail += 1;
          console.error('Video generation failed for sector', sid, e);
        }
        await new Promise(res => setTimeout(res, 250));
      }
      if (ok) toast('success', 'Video Generation', `Generated ${ok} videos successfully.`);
      if (fail) toast('error', 'Video Generation', `${fail} videos failed to generate. Check console for details.`);

      if (downloads.length > 1) {
        const listHtml = downloads.map((item, idx) => `
          <button type="button" class="admin-btn admin-btn-secondary w-full" data-video-download="${idx}">
            Download ${item.filename}
          </button>
        `).join('');

        openModal('Video Downloads', `
          <div class="space-y-3">
            <p class="text-sm text-text-muted">
              If your browser blocked multiple downloads, use these buttons to save each video.
            </p>
            ${listHtml}
          </div>
        `);

        const body = document.getElementById('modal-body');
        body.querySelectorAll('[data-video-download]').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.videoDownload);
            const item = downloads[idx];
            if (!item?.blob) return;
            const url = URL.createObjectURL(item.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 200);
          });
        });
      }
      return;
    }

    const sectorId = selection.rawValue;
    const singleLabel = _sectors.find(s => s.id === sectorId)?.sectorCode || selection.label || sectorId;
    const prefix = `Rendering 1/1 · ${singleLabel}`;
    setProgress(prefix);
    await downloadVideoPoster(ratio, fares, sectorId, _sectors, _airlines, {
      requireMp4: true,
      onProgress: (progress) => setProgress(`${prefix} · ${getVideoProgressMessage(progress)}`),
    });
  } catch (e) {
    console.error('Video generation failed', e);
    toast('error', 'Generation Failed', e.message || 'Video generation failed.');
  } finally {
    isVideoPosterGenerating = false;
    videoBtns.forEach(btn => { btn.disabled = false; });
    setProgress('');
  }
}


async function renderPoster(fares, selection) {
  const container = document.getElementById('poster-preview-container');
  const stack = document.getElementById('poster-render-stack');
  const templateFrame = document.querySelector('[data-poster-template="1"]') || document.getElementById('poster-render-frame');

  if (!container || !stack || !templateFrame) return;

  await populatePosterRenderStack(fares, selection, stack, templateFrame);
  _lastPosterPreview = {
    fares: Array.isArray(fares) ? [...fares] : [],
    selection: selection?.kind ? { ...selection, sectorIds: [...(selection.sectorIds || [])] } : selection,
  };
  renderPosterCopyMenu();

  container.classList.remove('hidden');
  container.classList.add('flex');
}

const COLOR_FUNC_RE = /(oklch|oklab|lab|lch|color-mix|color\()/i;

function normalizeCanvasColor(value) {
  if (!value) return value;
  const val = value.trim();
  if (!val) return val;
  if (val.startsWith('rgb') || val.startsWith('#') || val === 'transparent' || val === 'initial' || val === 'inherit') {
    return val;
  }
  try {
    // Prefer CSSColorValue if available (modern browsers)
    if (typeof CSSColorValue !== 'undefined' && typeof CSSColorValue.parse === 'function') {
      try {
        const parsed = CSSColorValue.parse(val);
        const out = parsed?.toString?.();
        if (out && !COLOR_FUNC_RE.test(out)) return out;
      } catch (_) { }
    }

    // Use a temporary element to resolve computed color to rgb()
    const doc = document;
    if (doc?.body) {
      const tmp = normalizeCanvasColor._el || (normalizeCanvasColor._el = doc.createElement('span'));
      tmp.style.color = '#000';
      tmp.style.color = val;
      doc.body.appendChild(tmp);
      const computed = doc.defaultView?.getComputedStyle(tmp)?.color;
      tmp.remove();
      if (computed && !COLOR_FUNC_RE.test(computed)) return computed;
    }

    // Fallback to canvas normalization
    const ctx = normalizeCanvasColor._ctx || (normalizeCanvasColor._ctx = document.createElement('canvas').getContext('2d'));
    const baseline = ctx.fillStyle;
    ctx.fillStyle = '#000';
    const marker = ctx.fillStyle;
    ctx.fillStyle = val;
    const out = ctx.fillStyle;
    if (out && !COLOR_FUNC_RE.test(out)) return out;
    if (out === marker && val !== marker) {
      ctx.fillStyle = baseline;
      return val;
    }
    return out || val;
  } catch (_) {
    return val;
  }
}

function sanitizeForCanvas(el, cs) {
  const bgImg = cs.getPropertyValue('background-image');
  if (bgImg && bgImg !== 'none' && COLOR_FUNC_RE.test(bgImg)) {
    el.style.backgroundImage = 'none';
    const bgc = normalizeCanvasColor(cs.getPropertyValue('background-color'));
    if (!bgc || bgc === 'transparent' || bgc === 'rgba(0, 0, 0, 0)') {
      el.style.backgroundColor = '#ffffff';
    } else {
      el.style.backgroundColor = bgc;
    }
  }

  const boxShadow = cs.getPropertyValue('box-shadow');
  if (boxShadow && boxShadow !== 'none' && COLOR_FUNC_RE.test(boxShadow)) {
    el.style.boxShadow = 'none';
  }

  const textShadow = cs.getPropertyValue('text-shadow');
  if (textShadow && textShadow !== 'none' && COLOR_FUNC_RE.test(textShadow)) {
    el.style.textShadow = 'none';
  }
}

function sanitizeUnsupportedColorFunctions(root) {
  if (!root) return;
  const doc = root.ownerDocument || document;
  const elements = [root, ...root.querySelectorAll('*')];
  elements.forEach((el) => {
    const cs = doc.defaultView?.getComputedStyle(el);
    if (!cs) return;
    for (let i = 0; i < cs.length; i++) {
      const prop = cs[i];
      const val = cs.getPropertyValue(prop);
      if (!val || !COLOR_FUNC_RE.test(val)) continue;

      if (prop.includes('color')) {
        const rgb = normalizeCanvasColor(val);
        el.style.setProperty(prop, rgb && !COLOR_FUNC_RE.test(rgb) ? rgb : '#000000');
        continue;
      }

      if (prop === 'background-image' || prop === 'background') {
        el.style.backgroundImage = 'none';
        const bgc = normalizeCanvasColor(cs.getPropertyValue('background-color'));
        el.style.backgroundColor = bgc && !COLOR_FUNC_RE.test(bgc) ? bgc : '#ffffff';
        continue;
      }

      if (prop.includes('shadow') || prop === 'filter') {
        el.style.setProperty(prop, 'none');
        continue;
      }

      if (prop.includes('border-image')) {
        el.style.setProperty(prop, 'none');
        continue;
      }

      try { el.style.setProperty(prop, 'initial'); } catch (_) { }
    }
  });
}

function injectCanvasSafeStyles(doc, scopeSelector) {
  if (!doc) return;
  const style = doc.createElement('style');
  const scope = scopeSelector ? `${scopeSelector}, ${scopeSelector} *` : '*';
  style.textContent = `
    ${scope} {
      box-shadow: none !important;
      text-shadow: none !important;
      filter: none !important;
    }
    ${scope}::before,
    ${scope}::after {
      content: none !important;
      box-shadow: none !important;
      filter: none !important;
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Recursively inline computed CSS color values onto an element tree so that
 * html2canvas (which cannot parse oklch()) sees plain rgb() values instead.
 * We only touch the properties that html2canvas reads for rendering.
 */
function inlineColorsForCanvas(el) {
  if (!el || el.nodeType !== 1) return;
  const cs = window.getComputedStyle(el);
  const props = [
    'color', 'backgroundColor', 'borderTopColor', 'borderBottomColor',
    'borderLeftColor', 'borderRightColor', 'outlineColor',
  ];
  for (const prop of props) {
    const val = cs.getPropertyValue(prop);
    if (!val) continue;
    const normalized = normalizeCanvasColor(val);
    if (normalized && normalized !== val) {
      try { el.style[prop] = normalized; } catch (_) { }
    } else if (!val.startsWith('rgb') && !val.startsWith('#') && val !== 'transparent' && val !== 'initial') {
      try { el.style[prop] = normalized || val; } catch (_) { }
    }
  }

  sanitizeForCanvas(el, cs);

  // Recursively handle children
  for (const child of el.children) inlineColorsForCanvas(child);
}

async function downloadPoster(format) {
  const stack = document.getElementById('poster-render-stack');
  const frames = stack ? Array.from(stack.querySelectorAll('[data-poster-frame="1"]')) : [];
  if (!frames.length) return;

  // Disable both buttons while exporting
  const jpgBtn = document.getElementById('poster-download-jpg');
  const pdfBtn = document.getElementById('poster-download-pdf');
  if (jpgBtn) jpgBtn.disabled = true;
  if (pdfBtn) pdfBtn.disabled = true;

  const fileSafe = (s) =>
    String(s || '')
      .trim()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

  const ts = Date.now();
  const multi = frames.length > 1;
  toast(
    'info',
    'Generating Export',
    multi ? `Rendering ${frames.length} posters. Your browser may ask to allow multiple downloads…` : 'Please wait while we render your poster…'
  );

  let ok = 0;
  let firstErr = null;

  for (let i = 0; i < frames.length; i++) {
    const posterEl = frames[i];
    const origTransform = posterEl.style.transform;
    posterEl.style.transform = 'none';

    try {
      // Wait for any images that aren't yet fully decoded
      await Promise.all(
        Array.from(posterEl.querySelectorAll('img')).map(img =>
          img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
        )
      );

      // Render to canvas at 2× resolution for crisp output.
      // The poster element uses only explicit hex/rgb inline styles (no oklch).
      // inlineColorsForCanvas is kept in onclone as a last-resort safety net.
      const canvas = await html2canvas(posterEl, {
        scale: 2,
        useCORS: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (doc) => {
          const target = posterEl.id ? doc.getElementById(posterEl.id) : null;
          if (target) inlineColorsForCanvas(target);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const sectorPart = posterEl.dataset.sectorCode || posterEl.dataset.sectorId || `poster-${i + 1}`;
      const slug = fileSafe(sectorPart) || `poster-${i + 1}`;
      const page = Number(posterEl.dataset.posterPage || 1);
      const pageCount = Number(posterEl.dataset.posterPageCount || 1);
      const pageSuffix = pageCount > 1 ? `-p${page}` : '';
      const baseName = `zamra-poster-${slug}${pageSuffix}-${ts}`;

      if (format === 'jpeg') {
        const link = document.createElement('a');
        link.download = `${baseName}.jpg`;
        link.href = imgData;
        link.click();
      } else if (format === 'pdf') {
        // Resolve jsPDF regardless of UMD binding name
        const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF)
          || window.jsPDF
          || (window.jspdf);
        if (!jsPDFCtor) throw new Error('jsPDF library not loaded.');

        // Convert canvas px → mm (96 dpi screen, scale:2 → 192 dpi effective)
        const PX_PER_MM = 96 / 25.4;           // ~3.779 px/mm at 1×
        const widthMm = (canvas.width / 2) / PX_PER_MM;
        const heightMm = (canvas.height / 2) / PX_PER_MM;

        const pdf = new jsPDFCtor({
          orientation: widthMm > heightMm ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [widthMm, heightMm]
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm);
        pdf.save(`${baseName}.pdf`);
      }

      ok += 1;
    } catch (e) {
      console.error('Poster export error:', e);
      if (!firstErr) firstErr = e;
    } finally {
      posterEl.style.transform = origTransform;
    }
  }

  if (ok) {
    const msg = multi
      ? `Downloaded ${ok} ${format === 'pdf' ? 'PDFs' : 'JPEGs'} successfully.`
      : `${format === 'pdf' ? 'PDF' : 'JPEG'} poster saved successfully.`;
    toast('success', 'Downloaded!', msg);
  }
  if (firstErr) {
    toast('error', 'Export Failed', firstErr.message || 'There was an error generating the export.');
  }

  if (jpgBtn) jpgBtn.disabled = false;
  if (pdfBtn) pdfBtn.disabled = false;
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT FARES TABLE (Moved from Dashboard)
// ══════════════════════════════════════════════════════════════════════════════
function renderReportFaresTable(fares) {
  const target = document.getElementById('report-fares-results');
  if (!target) return;

  if (!fares || !fares.length) {
    target.innerHTML = `<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-inbox"></i>
        </div>
        <p class="admin-empty-state-title">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;
    return;
  }

  // Build lookup maps
  const agentMap = Object.fromEntries(_agents.map(a => [a.id, a.name]));
  const sectorMap = Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode]));
  const airlineMap = Object.fromEntries(_airlines.map(a => [a.id, a.code]));

  // Sort (pagination-safe — no limit slice here)
  const { key, asc } = tableSort.reportFares;
  const sorted = [...fares].sort((a, b) => {
    let valA = a[key], valB = b[key];
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  });

  const limit = tableLimit.reportFares;
  const totalPages = Math.max(1, Math.ceil(fares.length / limit));
  if (tablePage.reportFares > totalPages) tablePage.reportFares = totalPages;
  const start = (tablePage.reportFares - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  const TH = (key, label) =>
    `<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${key}">${label} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;

  target.innerHTML = `
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${TH('flightDate', 'Date')}
          ${TH('flightTime', 'Time')}
          ${TH('sectorId', 'Sector')}
          ${TH('airlineId', 'Airline')}
          ${TH('agentId', 'Agent')}
          ${TH('specialRate', 'SP Rate (₹)')}
          ${TH('finalRate', 'Rate (₹)')}
          ${TH('commission', 'Comm (₹)')}
          ${TH('baggage', 'Bag')}
          ${TH('extraBaggage', 'Ex.Bag')}
          ${TH('isHidden', 'Status')}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${pageData.map((f, idx) => {
    const dateStr = f.flightDate instanceof Date
      ? f.flightDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : (f.flightDate || '—');
    const rowBg = idx % 2 === 1 ? 'bg-slate-50/60' : '';
    return `<tr class="${rowBg} hover:bg-slate-100/80 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${dateStr}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${f.flightTime || '—'}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${sectorMap[f.sectorId] || f.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${airlineMap[f.airlineId] || f.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${agentMap[f.agentId] || f.agentId}</td>
              <td class="whitespace-nowrap text-[13px] text-text-muted">₹${(f.specialRate || 0).toLocaleString()}</td>
              <td class="whitespace-nowrap font-black text-navy text-[14px]">₹${(f.finalRate || 0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${f.id}">₹${(f.commission || 0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${f.baggage ? f.baggage + ' kg' : '—'}</td>
              <td class="whitespace-nowrap text-[12px]">${f.extraBaggage ? f.extraBaggage + ' kg' : '—'}</td>
              <td class="whitespace-nowrap">
                <span class="admin-status-pill ${f.isHidden ? 'admin-status-hidden' : 'admin-status-live'}">
                  ${f.isHidden ? '● Hidden' : '● Live'}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__toggleFare('${f.id}', ${!f.isHidden})"
                    class="admin-action-btn ${f.isHidden ? 'admin-action-show' : 'admin-action-toggle'}">
                    <i class="bi ${f.isHidden ? 'bi-eye' : 'bi-eye-slash'}"></i>${f.isHidden ? 'Show' : 'Hide'}
                  </button>
                  <button onclick="window.__deleteFare('${f.id}')"
                    class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`;

  renderPaginationFooter('reportFares', fares.length, totalPages, start, limit);

  // Global action handlers — re-render in-place using cached fares
  window.__deleteFare = async (fareId) => {
    if (!confirm('Delete this fare?')) return;
    try {
      await deleteFare(fareId);
      _reportFares = _reportFares.filter(f => f.id !== fareId);
      toast('success', 'Deleted', 'Fare removed.');
      renderReportFaresTable(_reportFares);
    } catch (e) { toast('error', 'Error', e.message); }
  };
  window.__toggleFare = async (fareId, isHidden) => {
    try {
      await updateFare(fareId, { isHidden });
      _reportFares = _reportFares.map(f => f.id === fareId ? { ...f, isHidden } : f);
      toast('success', 'Updated', `Fare ${isHidden ? 'hidden' : 'shown'}.`);
      renderReportFaresTable(_reportFares);
    } catch (e) { toast('error', 'Error', e.message); }
  };

  updateSortIcons('reportFares');
}


// ══════════════════════════════════════════════════════════════════════════════
// AGENTS TAB — Full CRUD + Toggle Active
// ══════════════════════════════════════════════════════════════════════════════
async function renderAgentsTab(fetchData = true) {
  if (fetchData) { _agents = await getAgents(); tablePage.agents = 1; }
  const tbody = document.querySelector('#agents-tab .admin-table tbody');
  if (!tbody) return;

  // Wire up filter inputs if not already (same pattern as sectors/airlines)
  const searchInp = document.getElementById('agents-search');
  const limitSel = document.getElementById('agents-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1';
    if (limitSel) limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.agents = e.target.value; tablePage.agents = 1; renderAgentsTab(false); });
    if (limitSel) limitSel.addEventListener('change', (e) => { tableLimit.agents = parseInt(e.target.value); tablePage.agents = 1; renderAgentsTab(false); });
  }

  // Sort ALL agents first, then paginate from the full sorted array
  const sorted = applySortAndFilter(_agents, 'agents');
  const limit = tableLimit.agents;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.agents > totalPages) tablePage.agents = totalPages;
  const start = (tablePage.agents - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(a => agentRow(a)).join('')
    : `<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>`;

  // Render pagination footer (use sorted.length so filtered count is accurate)
  renderPaginationFooter('agents', sorted.length, totalPages, start, limit);

  wireAgentActions();

  // Wire "+ Add Agent" button (by stable ID)
  const addBtn = document.getElementById('agents-add-btn');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openAgentModal(null));
  }

  updateSortIcons('agents');
}

function agentRow(a) {
  const statusBadge = a.isActive !== false
    ? `<span class="admin-status-pill admin-status-active">Active</span>`
    : `<span class="admin-status-pill admin-status-inactive">Hidden</span>`;
  const comm = a.commission !== undefined ? `₹${Number(a.commission).toLocaleString()}` : '—';
  return `<tr data-agent-id="${a.id}">
    <td class="font-mono text-xs text-text-muted">${a.id || '—'}</td>
    <td class="font-semibold">${a.name}</td>
    <td>${a.email || '—'}</td>
    <td>${a.contactPhone || '—'}</td>
    <td class="font-semibold text-navy">${comm}</td>
    <td>${statusBadge}</td>
    <td>
      <div class="flex gap-1 flex-wrap items-center">
        <button data-action="edit-agent" data-id="${a.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-agent" data-id="${a.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
        <button data-action="toggle-agent" data-id="${a.id}" data-active="${a.isActive !== false}"
          class="admin-action-btn ${a.isActive !== false ? 'admin-action-toggle' : 'admin-action-show'}">
          <i class="bi ${a.isActive !== false ? 'bi-eye-slash' : 'bi-eye'}"></i>${a.isActive !== false ? 'Hide Fares' : 'Show Fares'}</button>
      </div>
    </td>
  </tr>`;
}

function wireAgentActions() {
  const tbody = document.querySelector('#agents-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const agent = _agents.find(a => a.id === id);

    if (action === 'edit-agent') openAgentModal(agent);
    if (action === 'delete-agent') {
      if (!confirm(`Delete agent "${agent?.name}"? This does NOT delete their fares.`)) return;
      try { await deleteAgent(id); toast('success', 'Deleted', `Agent "${agent?.name}" removed.`); await renderAgentsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
    if (action === 'toggle-agent') {
      const isCurrentlyActive = btn.dataset.active === 'true';
      const newStatus = !isCurrentlyActive;
      btn.disabled = true; btn.textContent = 'Working…';
      try {
        const res = await callToggleAgentVisibility(id, newStatus);
        toast('success', newStatus ? 'Agent Shown' : 'Agent Hidden', res.message);
        await renderAgentsTab();
      } catch (e) { toast('error', 'Toggle Failed', e.message); await renderAgentsTab(); }
    }
  });
}

function renderPaginationFooter(tabName, total, totalPages, start, limit) {
  const footer = document.getElementById(`${tabName}-pagination-footer`);
  if (!footer) return;
  const end = Math.min(start + limit, total);
  const currentPage = tablePage[tabName];

  footer.innerHTML = `
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${total ? start + 1 : 0} to ${end} of ${total} entries</span>
      <div class="admin-pagination-wrap">
        <button data-pg-action="prev" class="admin-pagination-btn" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
        ${(function () {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
      if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    })().map(p =>
      p === '...'
        ? `<span class="admin-pagination-btn" style="cursor:default;opacity:0.5;background:transparent;">...</span>`
        : `<button data-pg-action="goto" data-pg="${p}" class="admin-pagination-btn ${p === currentPage ? 'admin-pagination-btn-active' : ''
        }">${p}</button>`
    ).join('')}
        <button data-pg-action="next" class="admin-pagination-btn" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
      </div>
    </div>`;

  if (!footer.dataset.wired) {
    footer.dataset.wired = '1';
    footer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pg-action]');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.pgAction;
      if (action === 'prev') tablePage[tabName] = Math.max(1, tablePage[tabName] - 1);
      else if (action === 'next') tablePage[tabName]++;
      else if (action === 'goto') tablePage[tabName] = parseInt(btn.dataset.pg);
      if (tabName === 'agents') renderAgentsTab(false);
      else if (tabName === 'sectors') renderSectorsTab(false);
      else if (tabName === 'airlines') renderFlightsTab(false);
      else if (tabName === 'reportFares') renderReportFaresTable(_reportFares);
      else if (tabName === 'databaseFares') renderDatabaseTable();
    });
  }
}

function openAgentModal(agent) {
  const isEdit = !!agent;
  openModal(isEdit ? 'Edit Agent' : 'Add New Agent', `
    <form id="agent-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Agent Profile</p>
            <p class="admin-form-section-desc">Details used across fares and reports.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field sm:col-span-2">
            <label class="admin-label">Agent ID *</label>
            <input name="id" required value="${agent?.id || ''}" placeholder="e.g. AGENT1"
              ${isEdit ? 'readonly class="admin-control cursor-not-allowed bg-slate-100 text-slate-500"' : 'class="admin-control"'}>
            ${isEdit ? '<p class="admin-help">Agent ID cannot be changed after creation.</p>' : ''}
          </div>
          <div class="admin-field">
            <label class="admin-label">Name *</label>
            <input name="name" required value="${agent?.name || ''}" class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Email</label>
            <input name="email" type="email" value="${agent?.email || ''}" class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Phone</label>
            <input name="contactPhone" value="${agent?.contactPhone || ''}" class="admin-control">
          </div>
          <div class="admin-field sm:col-span-2">
            <label class="admin-label">Commission (₹) *</label>
            <input name="commission" type="number" min="0" required value="${agent?.commission !== undefined ? agent.commission : 500}"
              class="admin-control" placeholder="e.g. 500">
            <p class="admin-help">This commission is auto-applied to all fares ingested for this agent.</p>
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${isEdit ? 'Save Changes' : 'Add Agent'}
        </button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('agent-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) {
        const res = await updateAgent(agent.id, data);
        const updatedFares = res?.updatedFares ?? 0;
        const suffix = updatedFares ? ` Updated ${updatedFares} existing fare${updatedFares !== 1 ? 's' : ''}.` : '';
        toast('success', 'Updated', `Agent "${data.name}" updated.${suffix}`);
        if (res?.commissionSynced) {
          await refreshAgentCommissionViews(agent.id, data.commission);
        }
      }
      else { await addAgent(data); toast('success', 'Added', `Agent "${data.name}" added.`); }
      document.getElementById('admin-modal').close();
      await renderAgentsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Agent'; }
  });
}

function isTabActive(tabId) {
  return document.getElementById(tabId)?.classList.contains('active');
}

function syncCommissionToDatabaseCache(agentId, commission) {
  if (!_databaseFares?.length || !agentId) return 0;
  const normalized = Math.max(0, toSafeNumber(commission, 0));
  let updated = 0;

  _databaseFares = _databaseFares.map((fare) => {
    if (fare.agentId !== agentId) return fare;
    updated += 1;
    const specialRate = toSafeNumber(fare.specialRate, 0);
    const finalRate = getCalculatedFinalRate(specialRate, normalized);
    return { ...fare, commission: normalized, finalRate };
  });

  Object.entries(_databaseDrafts).forEach(([fareId, draft]) => {
    const baseFare = _databaseFares.find(f => f.id === fareId);
    const draftAgentId = draft.agentId !== undefined ? draft.agentId : baseFare?.agentId;
    if (draftAgentId !== agentId) return;
    draft.commission = normalized;
    if (draft.finalRate !== undefined) {
      const draftSpecialRate = draft.specialRate !== undefined
        ? toSafeNumber(draft.specialRate, 0)
        : toSafeNumber(baseFare?.specialRate, 0);
      draft.finalRate = getCalculatedFinalRate(draftSpecialRate, normalized);
    }
  });

  if (updated && isTabActive('database-tab')) {
    renderDatabaseTable();
  }

  return updated;
}

async function refreshReportsAfterCommissionChange() {
  const tab = document.getElementById('reports-tab');
  if (!tab || tab.dataset.wired !== '1' || !_lastReportSummary) return false;

  const sectorSel = document.getElementById('reports-sector-sel');
  const agentSel = document.getElementById('reports-agent-sel');
  const startInput = document.getElementById('reports-start-date');
  const endInput = document.getElementById('reports-end-date');

  const sectorId = sectorSel?.value || 'all';
  const agentId = agentSel?.value || 'all';
  const startDate = startInput?.value || null;
  const endDate = endInput?.value || null;

  try {
    const [report, fares] = await Promise.all([
      callGenerateAgentReport(startDate, endDate, sectorId, agentId),
      getFares({ sectorId, agentId, startDate, endDate, includeHidden: true })
    ]);
    _reportFares = fares;
    renderReportCharts(report, tab, { silent: true });
    renderReportFaresTable(_reportFares);
    return true;
  } catch (e) {
    console.warn('Report refresh failed after commission update:', e);
    if (isTabActive('reports-tab')) {
      toast('error', 'Report Refresh Failed', e.message);
    }
    return false;
  }
}

async function refreshAgentCommissionViews(agentId, commission) {
  syncCommissionToDatabaseCache(agentId, commission);
  await refreshReportsAfterCommissionChange();
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTORS TAB — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
function resetSectorDragState() {
  _sectorDragState = { draggedId: '', overId: '', position: 'before' };
}

function getSectorDropPosition(row, clientY) {
  const rect = row.getBoundingClientRect();
  return clientY > rect.top + rect.height / 2 ? 'after' : 'before';
}

function reorderSectorList(list, draggedId, targetId, position = 'before') {
  if (!draggedId || !targetId || draggedId === targetId) return null;

  const nextList = [...list];
  const fromIndex = nextList.findIndex((sector) => sector.id === draggedId);
  const targetIndex = nextList.findIndex((sector) => sector.id === targetId);
  if (fromIndex === -1 || targetIndex === -1) return null;

  const [draggedSector] = nextList.splice(fromIndex, 1);
  let insertionIndex = targetIndex;
  if (fromIndex < targetIndex) insertionIndex -= 1;
  if (position === 'after') insertionIndex += 1;
  insertionIndex = Math.max(0, Math.min(insertionIndex, nextList.length));
  nextList.splice(insertionIndex, 0, draggedSector);

  const changed = nextList.some((sector, index) => sector.id !== list[index]?.id);
  return changed ? nextList : null;
}

function syncSectorDragClasses(tbody) {
  if (!tbody) return;

  tbody.querySelectorAll('tr[data-sector-id]').forEach((row) => {
    const sectorId = row.dataset.sectorId || '';
    const isDragged = _isSectorReorderMode && sectorId === _sectorDragState.draggedId;
    const isDropTarget = _isSectorReorderMode &&
      sectorId === _sectorDragState.overId &&
      sectorId !== _sectorDragState.draggedId;

    row.classList.toggle('sector-row-dragging', isDragged);
    row.classList.toggle('sector-row-drop-before', isDropTarget && _sectorDragState.position === 'before');
    row.classList.toggle('sector-row-drop-after', isDropTarget && _sectorDragState.position === 'after');
  });
}

function syncSectorTableUi() {
  const searchInp = document.getElementById('sectors-search');
  const limitSel = document.getElementById('sectors-limit');
  const reorderBtn = document.getElementById('sector-reorder-toggle');
  const addBtn = document.getElementById('sector-add-btn');
  const noteEl = document.getElementById('sector-mode-note');

  if (searchInp) {
    searchInp.disabled = _isSectorReorderMode || _isSectorReorderSaving;
    searchInp.placeholder = _isSectorReorderMode
      ? 'Search is paused while reordering'
      : 'From, to, or code...';
  }

  if (limitSel) {
    limitSel.disabled = _isSectorReorderMode || _isSectorReorderSaving;
  }

  if (reorderBtn) {
    const canEnterReorderMode = _sectors.length > 1;
    reorderBtn.disabled = _isSectorReorderSaving || (!_isSectorReorderMode && !canEnterReorderMode);
    reorderBtn.classList.toggle('admin-btn-primary', !_isSectorReorderMode);
    reorderBtn.classList.toggle('admin-btn-ghost', _isSectorReorderMode);
    reorderBtn.innerHTML = _isSectorReorderSaving
      ? '<i class="bi bi-arrow-repeat animate-spin"></i>Saving Order…'
      : _isSectorReorderMode
        ? '<i class="bi bi-check2-square"></i>Done Reordering'
        : '<i class="bi bi-grip-vertical"></i>Reorder Mode';
  }

  if (addBtn) {
    addBtn.disabled = _isSectorReorderSaving;
  }

  if (noteEl) {
    noteEl.textContent = _isSectorReorderMode
      ? (_isSectorReorderSaving
        ? 'Saving the new sector priority…'
        : 'Drag rows above or below each other to set the live sector priority.')
      : 'Custom priority controls how sectors appear across the admin and public sector consumers.';
  }

  document.querySelectorAll('#sectors-tab th[data-sort-tab="sectors"]').forEach((th) => {
    th.classList.toggle('admin-table-sort-disabled', _isSectorReorderMode);
  });
}

function renderSectorFooter(totalCount, totalPages, start, limit) {
  const footer = document.getElementById('sectors-pagination-footer');
  if (!footer) return;

  if (_isSectorReorderMode) {
    footer.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm text-text-muted">
        <span class="font-semibold text-text-main">Showing the full saved priority list (${totalCount} sector${totalCount !== 1 ? 's' : ''}).</span>
        <span>${_isSectorReorderSaving ? 'Saving order changes…' : 'Drop a row to persist the new order immediately.'}</span>
      </div>`;
    return;
  }

  renderPaginationFooter('sectors', totalCount, totalPages, start, limit);
}

async function renderSectorsTab(fetchData = true) {
  if (fetchData) {
    _sectors = normalizeSectors(await getSectors());
    tablePage.sectors = 1;
    refreshSectorDrivenControls();
  }

  // Wire up filter inputs if not already
  const searchInp = document.getElementById('sectors-search');
  const limitSel = document.getElementById('sectors-limit');
  const reorderBtn = document.getElementById('sector-reorder-toggle');
  const addBtn = document.getElementById('sector-add-btn');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.sectors = e.target.value; tablePage.sectors = 1; renderSectorsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.sectors = parseInt(e.target.value); tablePage.sectors = 1; renderSectorsTab(false); });
  }
  if (reorderBtn && !reorderBtn.dataset.wired) {
    reorderBtn.dataset.wired = '1';
    reorderBtn.addEventListener('click', () => {
      if (_isSectorReorderSaving) return;
      _isSectorReorderMode = !_isSectorReorderMode;
      if (_isSectorReorderMode) {
        tableSort.sectors.key = 'sortOrder';
        tableSort.sectors.asc = true;
      }
      resetSectorDragState();
      renderSectorsTab(false);
    });
  }
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openSectorModal(null));
  }

  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody) return;

  syncSectorTableUi();

  const sorted = _isSectorReorderMode
    ? [..._sectors]
    : applySortAndFilter(_sectors, 'sectors');
  const limit = tableLimit.sectors;
  const totalPages = _isSectorReorderMode ? 1 : Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.sectors > totalPages) tablePage.sectors = totalPages;
  const start = _isSectorReorderMode ? 0 : (tablePage.sectors - 1) * limit;
  const pageData = _isSectorReorderMode ? sorted : sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map((sector, index) => sectorRow(sector, start + index)).join('')
    : `<tr><td colspan="6" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>`;

  renderSectorFooter(sorted.length, totalPages, start, limit);

  wireSectorActions();
  wireSectorReorderInteractions();

  updateSortIcons('sectors');
  syncSectorTableUi();
  syncSectorDragClasses(tbody);
}

function sectorRow(s, rowIndex = 0) {
  const sector = normalizeSectorRecord(s);
  const priority = sector.sortOrder || rowIndex + 1;
  const rowClasses = [
    _isSectorReorderMode ? 'sector-row-draggable' : '',
    _isSectorReorderSaving ? 'sector-row-reorder-locked' : '',
  ].filter(Boolean).join(' ');

  return `<tr data-sector-id="${s.id}" class="${rowClasses}" ${_isSectorReorderMode && !_isSectorReorderSaving ? 'draggable="true"' : ''}>
    <td class="whitespace-nowrap">
      ${_isSectorReorderMode ? `
        <div class="sector-priority-cell">
          <span class="sector-drag-handle" aria-hidden="true"><i class="bi bi-grip-vertical"></i></span>
          <span class="sector-priority-pill">#${priority}</span>
        </div>
      ` : `<span class="sector-priority-pill">#${priority}</span>`}
    </td>
    <td class="font-mono text-xs text-text-muted">${s.id || '—'}</td>
    <td class="font-semibold">${sector.sectorFrom}</td>
    <td class="font-semibold">${sector.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${sector.sectorCode}</span></td>
    <td>
      ${_isSectorReorderMode
        ? `<span class="text-xs font-semibold ${_isSectorReorderSaving ? 'text-primary' : 'text-text-muted'}">
            ${_isSectorReorderSaving ? 'Saving updated priority…' : 'Drag to move this sector'}
          </span>`
        : `<div class="flex gap-1 items-center">
            <button data-action="edit-sector" data-id="${s.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
            <button data-action="delete-sector" data-id="${s.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
            <button data-action="toggle-sector" data-id="${s.id}" data-hidden="${s.isHidden === true}"
              class="admin-action-btn ${s.isHidden === true ? 'admin-action-show' : 'admin-action-toggle'}">
              <i class="bi ${s.isHidden === true ? 'bi-eye' : 'bi-eye-slash'}"></i>${s.isHidden === true ? 'Show Fares' : 'Hide Fares'}</button>
          </div>`}
    </td>
  </tr>`;
}

function wireSectorActions() {
  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const sector = _sectors.find(s => s.id === id);

    if (action === 'edit-sector') openSectorModal(sector);
    if (action === 'delete-sector') {
      if (!confirm(`Delete sector "${sector?.sectorCode}"?`)) return;
      try { await deleteSector(id); toast('success', 'Deleted', `Sector "${sector?.sectorCode}" removed.`); await renderSectorsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
    if (action === 'toggle-sector') {
      const isCurrentlyHidden = btn.dataset.hidden === 'true';
      const newHiddenStatus = !isCurrentlyHidden;
      btn.disabled = true; btn.textContent = 'Working…';
      try {
        const res = await callToggleSectorVisibility(id, newHiddenStatus);
        toast('success', `Sector Fares ${newHiddenStatus ? 'Hidden' : 'Shown'}`, res.message);
        await renderSectorsTab(); // Auto-refresh UI to fetch isHidden updates
      } catch (e) { toast('error', 'Toggle Failed', e.message); await renderSectorsTab(); }
    }
  });
}

function wireSectorReorderInteractions() {
  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody || tbody.dataset.reorderWired) return;
  tbody.dataset.reorderWired = '1';

  tbody.addEventListener('dragstart', (e) => {
    if (!_isSectorReorderMode || _isSectorReorderSaving) {
      e.preventDefault();
      return;
    }

    const row = e.target.closest('tr[data-sector-id]');
    if (!row) return;

    _sectorDragState.draggedId = row.dataset.sectorId || '';
    _sectorDragState.overId = row.dataset.sectorId || '';
    _sectorDragState.position = 'before';

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', _sectorDragState.draggedId);
    }

    syncSectorDragClasses(tbody);
  });

  tbody.addEventListener('dragover', (e) => {
    if (!_isSectorReorderMode || _isSectorReorderSaving || !_sectorDragState.draggedId) return;

    const row = e.target.closest('tr[data-sector-id]');
    if (!row) return;

    e.preventDefault();
    _sectorDragState.overId = row.dataset.sectorId || '';
    _sectorDragState.position = getSectorDropPosition(row, e.clientY);
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    syncSectorDragClasses(tbody);
  });

  tbody.addEventListener('drop', async (e) => {
    if (!_isSectorReorderMode || _isSectorReorderSaving || !_sectorDragState.draggedId) return;

    const row = e.target.closest('tr[data-sector-id]');
    if (!row) return;

    e.preventDefault();
    const draggedId = _sectorDragState.draggedId;
    const targetId = row.dataset.sectorId || '';
    const position = getSectorDropPosition(row, e.clientY);
    const previousSectors = _sectors.map((sector) => ({ ...sector }));
    const reordered = reorderSectorList(previousSectors, draggedId, targetId, position);

    resetSectorDragState();
    if (!reordered) {
      syncSectorDragClasses(tbody);
      renderSectorsTab(false);
      return;
    }

    _sectors = reordered.map((sector, index) => ({
      ...sector,
      sortOrder: index + 1,
    }));
    _isSectorReorderSaving = true;
    refreshSectorDrivenControls();
    renderSectorsTab(false);

    try {
      const res = await callReorderSectors(_sectors.map((sector) => sector.id));
      _isSectorReorderSaving = false;
      refreshSectorDrivenControls();
      renderSectorsTab(false);
      toast('success', 'Order Saved', res.message || 'Sector order updated.');
    } catch (err) {
      _isSectorReorderSaving = false;
      _sectors = previousSectors;
      refreshSectorDrivenControls();
      renderSectorsTab(false);
      toast('error', 'Reorder Failed', err.message || 'Failed to save the new sector order.');
      await renderSectorsTab(true);
    }
  });

  tbody.addEventListener('dragend', () => {
    resetSectorDragState();
    syncSectorDragClasses(tbody);
    if (_isSectorReorderMode && !_isSectorReorderSaving) renderSectorsTab(false);
  });
}

function openSectorModal(sector) {
  const isEdit = !!sector;
  openModal(isEdit ? 'Edit Sector' : 'Add New Sector', `
    <form id="sector-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Sector Details</p>
            <p class="admin-form-section-desc">Define the route and sector code.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="admin-field">
            <label class="admin-label">From City *</label>
            <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${sector?.sectorFrom || ''}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">To City *</label>
            <input name="sectorTo" required placeholder="e.g. Jeddah" value="${sector?.sectorTo || ''}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">Sector Code *</label>
            <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${sector?.sectorCode || ''}"
              class="admin-control font-mono tracking-wide">
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${isEdit ? 'Save Changes' : 'Add Sector'}
        </button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('sector-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.sectorCode = normalizeDamammText(data.sectorCode.toUpperCase());
    data.sectorFrom = normalizeDamammText(data.sectorFrom.toUpperCase());
    data.sectorTo = normalizeDamammText(data.sectorTo.toUpperCase());
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) { await updateSector(sector.id, data); toast('success', 'Updated', 'Sector updated.'); }
      else { await addSector(data); toast('success', 'Added', `Sector "${data.sectorCode}" added.`); }
      document.getElementById('admin-modal').close();
      await renderSectorsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Sector'; }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// FLIGHTS TAB (Airlines) — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
async function renderFlightsTab(fetchData = true) {
  if (fetchData) { _airlines = await getAirlines(); tablePage.airlines = 1; }

  // Wire up filter inputs if not already
  const searchInp = document.getElementById('airlines-search');
  const limitSel = document.getElementById('airlines-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.airlines = e.target.value; tablePage.airlines = 1; renderFlightsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.airlines = parseInt(e.target.value); tablePage.airlines = 1; renderFlightsTab(false); });
  }

  const tbody = document.querySelector('#flights-tab .admin-table tbody');
  if (!tbody) return;

  const sorted = applySortAndFilter(_airlines, 'airlines');
  const limit = tableLimit.airlines;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.airlines > totalPages) tablePage.airlines = totalPages;
  const start = (tablePage.airlines - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(a => airlineRow(a)).join('')
    : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "Add Airline".</td></tr>`;

  renderPaginationFooter('airlines', sorted.length, totalPages, start, limit);

  wireAirlineActions();

  const addBtn = document.querySelector('#flights-tab .flex.justify-between button');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openAirlineModal(null));
  }

  updateSortIcons('airlines');
}

function airlineRow(a) {
  const logo = a.logoUrl
    ? `<span class="admin-logo-wrap"><img src="${a.logoUrl}" alt="${escapeHtml(a.name || 'Airline')}"></span>`
    : `<span class="admin-logo-wrap"><span class="admin-logo-fallback">${escapeHtml((a.code || 'NA').slice(0, 3))}</span></span>`;
  return `<tr data-airline-id="${a.id}">
    <td>${logo}</td>
    <td class="font-semibold">${a.name}</td>
    <td><span class="font-mono font-bold text-primary">${a.code}</span></td>
    <td>
      <div class="flex gap-1 items-center">
        <button data-action="edit-airline" data-id="${a.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-airline" data-id="${a.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireAirlineActions() {
  const tbody = document.querySelector('#flights-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const airline = _airlines.find(a => a.id === id);

    if (action === 'edit-airline') openAirlineModal(airline);
    if (action === 'delete-airline') {
      if (!confirm(`Delete airline "${airline?.name}" (${airline?.code})?`)) return;
      try { await deleteAirline(id); toast('success', 'Deleted', `Airline "${airline?.name}" removed.`); await renderFlightsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openAirlineModal(airline) {
  const isEdit = !!airline;
  openModal(isEdit ? 'Edit Airline' : 'Add New Airline', `
    <form id="airline-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Airline Details</p>
            <p class="admin-form-section-desc">Name, IATA code, and logo.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="admin-field">
            <label class="admin-label">Airline Name *</label>
            <input name="name" required placeholder="e.g. Air India Express" value="${airline?.name || ''}"
              class="admin-control">
          </div>
          <div class="admin-field">
            <label class="admin-label">IATA Code *</label>
            <input name="code" required maxlength="3" placeholder="e.g. IX" value="${airline?.code || ''}"
              class="admin-control font-mono tracking-widest uppercase">
          </div>
          <div class="admin-field">
            <label class="admin-label">Logo (optional)</label>
            <div class="admin-file">
              <input type="file" name="logoFile" accept="image/*">
              ${airline?.logoUrl ? `<img src="${airline.logoUrl}" class="mt-3 h-9 object-contain rounded" alt="current logo">` : ''}
            </div>
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" id="modal-cancel" class="admin-btn admin-btn-ghost px-6 text-sm">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary text-sm">
          ${isEdit ? 'Save Changes' : 'Add Airline'}
        </button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('airline-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const logoFile = fd.get('logoFile')?.size > 0 ? fd.get('logoFile') : null;
    const data = { name: fd.get('name'), code: fd.get('code').toUpperCase() };
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) { await updateAirline(airline.id, data, logoFile); toast('success', 'Updated', 'Airline updated.'); }
      else { await addAirline(data, logoFile); toast('success', 'Added', `Airline "${data.name}" added.`); }
      document.getElementById('admin-modal').close();
      await renderFlightsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Airline'; }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// REPORTS TAB — Live charts powered by generateAgentReport Cloud Function
// ══════════════════════════════════════════════════════════════════════════════
async function renderReportsTab() {
  const tab = document.getElementById('reports-tab');
  if (!tab) return;

  const sectorSel = document.getElementById('reports-sector-sel');
  populateReportsSectorSelect(sectorSel);

  if (tab.dataset.wired) return;
  tab.dataset.wired = '1';

  // Populate agent filter (informational only — Cloud Function aggregates all)
  const agentSel = document.getElementById('reports-agent-sel');
  if (agentSel && agentSel.options.length <= 1) {
    _agents.forEach(a => agentSel.appendChild(new Option(a.name, a.id)));
  }

  // Wire Generate Report button
  const fetchBtn = document.getElementById('generate-report-btn');
  const startInput = document.getElementById('reports-start-date');
  const endInput = document.getElementById('reports-end-date');
  const limitSel = document.getElementById('report-fares-limit');

  if (fetchBtn && !fetchBtn.dataset.wired) {
    fetchBtn.dataset.wired = '1';
    fetchBtn.addEventListener('click', async () => {
      const sectorId = sectorSel?.value || 'all';
      const agentId = agentSel?.value || 'all';
      const startDate = startInput?.value || null;
      const endDate = endInput?.value || null;


      fetchBtn.disabled = true; fetchBtn.textContent = 'Generating…';
      try {
        const [report, fares] = await Promise.all([
          callGenerateAgentReport(startDate, endDate, sectorId, agentId),
          getFares({ sectorId, agentId, startDate, endDate, includeHidden: true })
        ]);

        // ★ Must set _reportFares BEFORE renderReportCharts — it reads it for avg/live/hidden stats
        _reportFares = fares;
        renderReportCharts(report, tab);

        // Render the detailed fares table
        tablePage.reportFares = 1;
        renderReportFaresTable(_reportFares);

      } catch (e) { toast('error', 'Report Failed', e.message); }
      finally {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report';
      }
    });
  }

  if (limitSel && !limitSel.dataset.wired) {
    limitSel.dataset.wired = '1';
    limitSel.value = String(tableLimit.reportFares);
    limitSel.addEventListener('change', (e) => {
      tableLimit.reportFares = parseInt(e.target.value, 10);
      tablePage.reportFares = 1;
      if (_reportFares && _reportFares.length) {
        renderReportFaresTable(_reportFares);
      }
    });
  }
}

function renderReportCharts(report, tab, opts = {}) {
  _lastReportSummary = report;
  const { agentReport, sectorReport, totalFares } = report;

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const statsRow = document.getElementById('report-stats-row');
  if (statsRow) {
    statsRow.classList.remove('hidden');
    const liveFares = (_reportFares || []).filter(f => !f.isHidden).length;
    const hiddenFares = (_reportFares || []).filter(f => f.isHidden).length;
    const agentsCount = new Set((_reportFares || []).map(f => f.agentId)).size;
    const rates = (_reportFares || []).map(f => f.finalRate || 0).filter(r => r > 0);
    const avgFare = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString(); };
    setEl('stat-total-fares', totalFares);
    setEl('stat-live-fares', liveFares);
    setEl('stat-hidden-fares', hiddenFares);
    setEl('stat-agents-count', agentsCount);
    const avgEl = document.getElementById('stat-avg-fare');
    if (avgEl) avgEl.textContent = avgFare > 0 ? `₹${avgFare.toLocaleString()}` : '—';
  }

  // ── Fares table subtitle ────────────────────────────────────────────────────
  const totalEl = document.getElementById('report-total-fares');
  if (totalEl) totalEl.textContent = `${totalFares} fare${totalFares !== 1 ? 's' : ''} matched your filter`;

  // ── Bar Chart (SVG) — Fares per Agent ──────────────────────────────────────
  const barContainer = document.getElementById('bar-chart-container');
  if (barContainer && agentReport.length) {
    renderBarChart(agentReport.slice(0, 8), barContainer);
  }

  // ── Donut Chart (SVG) — Fares per Sector ────────────────────────────────────
  const donutSvg = document.getElementById('donut-chart-svg');
  const legendEl = document.getElementById('pie-legend');
  if (donutSvg && sectorReport.length) {
    renderDonutChart(sectorReport.slice(0, 8), donutSvg, legendEl);
  }

  // ── Leaderboards ─────────────────────────────────────────────────────────────
  const lbRow = document.getElementById('report-leaderboards');
  if (lbRow) {
    lbRow.classList.remove('hidden');
    renderLeaderboards(agentReport, sectorReport);
  }

  // ── Wire CSV export button ───────────────────────────────────────────────────
  const csvBtn = document.getElementById('download-report-csv');
  if (csvBtn) {
    const newBtn = csvBtn.cloneNode(true);
    csvBtn.parentNode.replaceChild(newBtn, csvBtn);
    newBtn.addEventListener('click', () => downloadReportCSV(_reportFares));
    if (_reportFares && _reportFares.length) {
      newBtn.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      newBtn.classList.add('opacity-50', 'pointer-events-none');
    }
  }

  // ── Wire PDF export button ───────────────────────────────────────────────────
  const pdfBtn = document.getElementById('download-report-pdf');
  if (pdfBtn) {
    const newBtn = pdfBtn.cloneNode(true);
    pdfBtn.parentNode.replaceChild(newBtn, pdfBtn);
    newBtn.addEventListener('click', () => downloadReportPDF());
    if (_reportFares && _reportFares.length) {
      newBtn.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      newBtn.classList.add('opacity-50', 'pointer-events-none');
    }
  }

  if (!opts.silent) {
    toast('success', 'Report Ready', `${totalFares} fare${totalFares !== 1 ? 's' : ''} aggregated.`);
  }
}

function isDarkTheme() {
  return document.documentElement.dataset.theme === 'dark';
}

// ── SVG Bar Chart ─────────────────────────────────────────────────────────────
function renderBarChart(data, container) {
  const isDark = isDarkTheme();
  const W = container.clientWidth || 480;
  const H = 260;
  const PAD = { top: 32, right: 16, bottom: 48, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const BRAND_COLORS = isDark
    ? [
      ['#60a5fa', '#93c5fd'], ['#34d399', '#6ee7b7'], ['#fbbf24', '#fde68a'],
      ['#fb7185', '#fecdd3'], ['#a78bfa', '#c4b5fd'], ['#2dd4bf', '#5eead4'],
      ['#fb923c', '#fdba74'], ['#94a3b8', '#cbd5e1'],
    ]
    : [
      ['#0c4a8a', '#3b82f6'], ['#065f46', '#22c55e'], ['#78350f', '#f59e0b'],
      ['#7f1d1d', '#ef4444'], ['#4c1d95', '#8b5cf6'], ['#134e4a', '#14b8a6'],
      ['#7c2d12', '#f97316'], ['#1e293b', '#64748b'],
    ];
  const gridColor = isDark ? '#22324a' : '#f1f5f9';
  const axisColor = isDark ? '#2f415c' : '#cbd5e1';
  const tickColor = isDark ? '#9fb1cb' : '#94a3b8';
  const labelColor = isDark ? '#cbd5e1' : '#64748b';
  const tooltipBg = isDark ? '#0b1324' : '#0f172a';

  // Y-axis ticks
  const ticks = 4;
  const tickStep = Math.ceil(maxCount / ticks);
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => i * tickStep);
  const yTickLines = yTicks.map(v => {
    const y = PAD.top + chartH - (v / (yTicks[yTicks.length - 1] || 1)) * chartH;
    return `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${W - PAD.right}" y2="${y.toFixed(1)}" stroke="${gridColor}" stroke-width="1"/>
            <text x="${PAD.left - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="${tickColor}" font-weight="600">${v}</text>`;
  }).join('');

  const barW = Math.min(48, (chartW / data.length) * 0.6);
  const barSpacing = chartW / data.length;

  const bars = data.map((d, i) => {
    const barH = Math.max(4, (d.count / (yTicks[yTicks.length - 1] || 1)) * chartH);
    const x = PAD.left + i * barSpacing + barSpacing / 2 - barW / 2;
    const y = PAD.top + chartH - barH;
    const [c1, c2] = BRAND_COLORS[i % BRAND_COLORS.length];
    const gradId = `bg${i}`;
    const avgTip = d.avgRate ? `avg ₹${Math.round(d.avgRate).toLocaleString()}` : '';
    return `<defs><linearGradient id="${gradId}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${c1}"/>
              <stop offset="100%" stop-color="${c2}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${d.name}" data-count="${d.count}" data-avg="${avgTip}" style="cursor:pointer;">
              <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${barH.toFixed(1)}"
                rx="6" fill="url(#${gradId})" opacity="0.92"
                style="transform-origin:${(x + barW / 2).toFixed(1)}px ${(PAD.top + chartH).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${i * 0.07}s both;"/>
              <text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${c2}">${d.count}</text>
              <text x="${(x + barW / 2).toFixed(1)}" y="${(PAD.top + chartH + 16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="${labelColor}">${(d.name || '').split(' ')[0].slice(0, 8)}</text>
            </g>`;
  }).join('');

  const tooltipId = 'bar-tooltip';
  container.innerHTML = `
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${tooltipId}" style="position:absolute;display:none;background:${tooltipBg};color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible;">
      ${yTickLines}
      <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="${axisColor}" stroke-width="1.5"/>
      <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="${axisColor}" stroke-width="1.5"/>
      ${bars}
    </svg>`;

  // Wire hover tooltip
  const svg = container.querySelector('#bar-svg');
  const tip = container.querySelector(`#${tooltipId}`);
  if (svg && tip) {
    svg.querySelectorAll('.bar-group').forEach(g => {
      g.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        tip.style.display = 'block';
        tip.style.left = (e.clientX - rect.left + 12) + 'px';
        tip.style.top = (e.clientY - rect.top - 40) + 'px';
        const avg = g.dataset.avg ? `<br><span style="opacity:.7;font-weight:500;">${g.dataset.avg}</span>` : '';
        tip.innerHTML = `${g.dataset.name}<br><span style="color:#60a5fa;">${g.dataset.count} fares</span>${avg}`;
      });
      g.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  }
}

// ── SVG Donut Chart ───────────────────────────────────────────────────────────
function renderDonutChart(data, svg, legendEl) {
  const isDark = isDarkTheme();
  const COLORS = isDark
    ? ['#60a5fa', '#93c5fd', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#2dd4bf', '#fb923c']
    : ['#1558c0', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316'];
  const centerFill = isDark ? '#0f172a' : '#ffffff';
  const centerCountColor = isDark ? '#e2e8f0' : '#0f172a';
  const centerLabelColor = isDark ? '#9fb1cb' : '#64748b';
  const segmentStroke = isDark ? '#0b1324' : 'white';
  const legendNameColor = isDark ? '#cbd5e1' : '#64748b';
  const legendCountColor = isDark ? '#e2e8f0' : '#0f172a';
  const legendPctColor = isDark ? '#9fb1cb' : '#94a3b8';
  const legendHoverBg = isDark ? '#1e2a44' : '#f1f5f9';
  const CX = 110, CY = 110, R_OUTER = 95, R_INNER = 60;
  const total = data.reduce((s, r) => s + r.count, 0);

  const segGroup = svg.getElementById ? svg.getElementById('donut-segments') : svg.querySelector('#donut-segments');
  const centerCount = svg.querySelector('#donut-center-count');
  const centerLabel = svg.querySelector('#donut-center-label');
  const centerCircle = svg.querySelector('circle');
  if (!segGroup) return;

  if (centerCount) centerCount.textContent = total;
  if (centerLabel) centerLabel.textContent = 'FARES';
  if (centerCircle) centerCircle.setAttribute('fill', centerFill);
  if (centerCount) centerCount.setAttribute('fill', centerCountColor);
  if (centerLabel) centerLabel.setAttribute('fill', centerLabelColor);

  // Helper: polar to cartesian
  const polar = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos((deg - 90) * Math.PI / 180),
    y: cy + r * Math.sin((deg - 90) * Math.PI / 180),
  });

  // Build arc paths
  let startDeg = 0;
  const paths = data.map((d, i) => {
    const sweep = total > 0 ? (d.count / total) * 360 : 0;
    const endDeg = startDeg + sweep;
    const large = sweep > 180 ? 1 : 0;
    const s = polar(CX, CY, R_OUTER, startDeg);
    const e = polar(CX, CY, R_OUTER, endDeg);
    const si = polar(CX, CY, R_INNER, startDeg);
    const ei = polar(CX, CY, R_INNER, endDeg);
    const pathD = [
      `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
      `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
      `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
      'Z',
    ].join(' ');
    const mid = startDeg + sweep / 2;
    startDeg = endDeg;
    const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : '0.0';
    return { pathD, color: COLORS[i % COLORS.length], name: d.name, count: d.count, pct, mid };
  });

  // Render paths
  const NS = 'http://www.w3.org/2000/svg';
  segGroup.innerHTML = '';
  const pathEls = paths.map((p, i) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', p.pathD);
    el.setAttribute('fill', p.color);
    el.setAttribute('stroke', segmentStroke);
    el.setAttribute('stroke-width', '2');
    el.style.cursor = 'pointer';
    el.style.transition = 'transform 0.2s, filter 0.2s';
    el.style.transformOrigin = `${CX}px ${CY}px`;
    el.setAttribute('data-index', i);
    segGroup.appendChild(el);
    return el;
  });

  // Highlight helper
  const highlight = (idx) => {
    pathEls.forEach((el, j) => {
      if (j === idx) {
        el.style.transform = 'scale(1.04)';
        el.style.filter = 'brightness(1.1)';
        el.setAttribute('stroke-width', '3');
      } else {
        el.style.transform = 'scale(1)';
        el.style.filter = 'brightness(1)';
        el.setAttribute('stroke-width', '2');
      }
    });
    if (idx >= 0 && idx < paths.length) {
      if (centerCount) centerCount.textContent = paths[idx].count;
      if (centerLabel) centerLabel.textContent = paths[idx].name.split(' ')[0].toUpperCase().slice(0, 7);
    } else {
      if (centerCount) centerCount.textContent = total;
      if (centerLabel) centerLabel.textContent = 'FARES';
    }
  };

  pathEls.forEach((el, i) => {
    el.addEventListener('mouseover', () => { highlight(i); highlightLegend(i); });
    el.addEventListener('mouseout', () => { highlight(-1); highlightLegend(-1); });
  });

  // Legend
  if (legendEl) {
    legendEl.innerHTML = paths.map((p, i) => `
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${i}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:${legendNameColor};flex:1;">${p.name}</span>
        <span style="font-weight:900;color:${legendCountColor};margin-left:auto;">${p.count}</span>
        <span style="color:${legendPctColor};font-size:10px;width:36px;text-align:right;">${p.pct}%</span>
      </div>`).join('');

    const highlightLegendRows = (idx) => {
      legendEl.querySelectorAll('.legend-row').forEach((row, j) => {
        row.style.background = j === idx ? legendHoverBg : '';
      });
    };
    // Expose so segment hover can call it
    window._highlightLegendRows = highlightLegendRows;

    legendEl.querySelectorAll('.legend-row').forEach((row, i) => {
      row.addEventListener('mouseover', () => { highlight(i); highlightLegendRows(i); });
      row.addEventListener('mouseout', () => { highlight(-1); highlightLegendRows(-1); });
    });
  }

  function highlightLegend(idx) {
    if (window._highlightLegendRows) window._highlightLegendRows(idx);
  }
}

// ── Leaderboard Cards ─────────────────────────────────────────────────────────
function renderLeaderboards(agentReport, sectorReport) {
  const isDark = isDarkTheme();
  const BRAND = isDark
    ? ['#60a5fa', '#93c5fd', '#34d399', '#fbbf24', '#fb7185']
    : ['#1558c0', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
  const textMain = isDark ? '#e2e8f0' : '#0f172a';
  const textMuted = isDark ? '#9fb1cb' : '#94a3b8';
  const barBg = isDark ? '#1e2a44' : '#f1f5f9';
  const rankBg = isDark ? '#111c31' : '#f8fafc';
  const rankBorder = isDark ? '#24324d' : '#e2e8f0';
  const trophyBg = isDark ? '#2a1d0e' : '#fff7ed';
  const trophyBorder = isDark ? '#5a3b14' : '#fed7aa';
  const avgColor = isDark ? '#fbbf24' : '#f59e0b';

  // Top agents by count
  const agentsEl = document.getElementById('leaderboard-agents');
  if (agentsEl && agentReport.length) {
    const top = [...agentReport].sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCount = top[0].count || 1;
    agentsEl.innerHTML = top.map((a, i) => {
      const pct = Math.max(6, Math.round((a.count / maxCount) * 100));
      const rankBadge = i === 0
        ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:${trophyBg};color:#f59e0b;border:1px solid ${trophyBorder};"><i class="bi bi-trophy-fill" style="font-size:12px;"></i></span>`
        : `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;background:${rankBg};color:${textMuted};border:1px solid ${rankBorder};font-size:11px;font-weight:800;">#${i + 1}</span>`;
      return `<div style="display:flex;align-items:center;gap:10px;">
        <span style="width:28px;text-align:center;flex-shrink:0;">${rankBadge}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:${textMain};margin-bottom:4px;">
            <span class="truncate">${a.name}</span>
            <span style="color:${BRAND[i]};margin-left:8px;">${a.count} fares</span>
          </div>
          <div style="background:${barBg};border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${BRAND[i]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // Cheapest sectors by avg rate
  const sectorsEl = document.getElementById('leaderboard-sectors');
  if (sectorsEl && sectorReport.length) {
    const withAvg = sectorReport.filter(s => s.avgRate > 0);
    const sorted = [...withAvg].sort((a, b) => a.avgRate - b.avgRate).slice(0, 5);
    const minRate = sorted[0]?.avgRate || 1;
    const maxRate = sorted[sorted.length - 1]?.avgRate || 1;
    sectorsEl.innerHTML = sorted.map((s, i) => {
      const pct = maxRate > minRate ? Math.max(6, Math.round(((s.avgRate - minRate) / (maxRate - minRate)) * 100)) : 50;
      return `<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:${textMuted};width:20px;text-align:center;flex-shrink:0;">${i + 1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:${textMain};margin-bottom:4px;">
            <span class="truncate">${s.name}</span>
            <span style="color:${avgColor};margin-left:8px;">avg ₹${Math.round(s.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:${barBg};border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(to right,#22c55e,${avgColor});border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }
}

function downloadReportCSV(fares) {
  if (!fares || !fares.length) {
    toast('warning', 'No Data', 'No fares to export. Apply filters and fetch first.');
    return;
  }

  const agentMap = Object.fromEntries(_agents.map(a => [a.id, a.name]));
  const sectorMap = Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode]));
  const airlineMap = Object.fromEntries(_airlines.map(a => [a.id, a.code || a.name]));

  // Helper: escape a value for CSV (wrap in quotes, escape internal quotes)
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const headers = ['Date', 'Time', 'Sector', 'Airline', 'Agent', 'SP Rate (INR)', 'Rate (INR)', 'Commission (INR)', 'Baggage (kg)', 'Extra Baggage (kg)', 'Status'];
  const rows = fares.map(f => {
    const dt = f.flightDate instanceof Date
      ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : (f.flightDate || '');
    return [
      esc(dt),
      esc(f.flightTime || ''),
      esc(sectorMap[f.sectorId] || f.sectorId),
      esc(airlineMap[f.airlineId] || f.airlineId),
      esc(agentMap[f.agentId] || f.agentId),
      esc(f.specialRate || 0),
      esc(f.finalRate || 0),
      esc(f.commission || 0),
      esc(f.baggage || ''),
      esc(f.extraBaggage || ''),
      esc(f.isHidden ? 'Hidden' : 'Live')
    ].join(',');
  });

  const csv = [headers.map(esc).join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `zamra-fares-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast('success', 'CSV Downloaded', `${fares.length} fares exported.`);
}

async function downloadReportPDF() {
  if (!_reportFares || !_reportFares.length) {
    toast('warning', 'No Data', 'No fares to export. Apply filters and fetch first.');
    return;
  }

  const card = document.getElementById('report-fares-card');
  if (!card) {
    toast('error', 'Export Failed', 'Report results not found.');
    return;
  }

  const btn = document.getElementById('download-report-pdf');
  if (btn) btn.disabled = true;

  try {
    if (typeof html2canvas !== 'function') {
      throw new Error('html2canvas library not loaded.');
    }

    toast('info', 'Generating PDF', 'Please wait while we render your report...');

    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (doc) => {
        injectCanvasSafeStyles(doc, '#report-fares-card');
        sanitizeUnsupportedColorFunctions(doc.body);
        const clonedCard = doc.getElementById('report-fares-card');
        if (!clonedCard) return;

        // Hide action buttons inside the export
        clonedCard.querySelectorAll('#download-report-csv, #download-report-pdf').forEach(el => {
          el.style.display = 'none';
        });
        const toolbar = clonedCard.querySelector('#report-fares-toolbar');
        if (toolbar) toolbar.style.display = 'none';

        // Ensure wide tables are fully visible in export
        const tableWrap = clonedCard.querySelector('.admin-table-container');
        if (tableWrap) {
          tableWrap.style.overflow = 'visible';
          tableWrap.style.width = `${tableWrap.scrollWidth}px`;
        }
        const results = clonedCard.querySelector('#report-fares-results');
        if (results && tableWrap) {
          results.style.width = `${tableWrap.scrollWidth}px`;
        }

        sanitizeUnsupportedColorFunctions(clonedCard);
        inlineColorsForCanvas(clonedCard);
      }
    });

    const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF)
      || window.jsPDF
      || window.jspdf;
    if (!jsPDFCtor) throw new Error('jsPDF library not loaded.');

    const isLandscape = canvas.width > canvas.height;
    const pdf = new jsPDFCtor({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth
      ? pdf.internal.pageSize.getWidth()
      : pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.getHeight
      ? pdf.internal.pageSize.getHeight()
      : pdf.internal.pageSize.height;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeightPx = Math.max(1, Math.floor((canvas.width * pageHeight) / pageWidth));

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedHeight);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, -renderedHeight);

      const pageData = pageCanvas.toDataURL('image/jpeg', 0.95);
      if (pageIndex > 0) pdf.addPage();
      const pageImgHeight = (sliceHeight * imgWidth) / pageCanvas.width;
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, pageImgHeight);

      renderedHeight += sliceHeight;
      pageIndex += 1;
    }

    const fileName = `zamra-report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    toast('success', 'Downloaded!', 'Report PDF saved successfully.');
  } catch (err) {
    console.error('Report PDF export failed:', err);
    toast('error', 'Download Failed', err?.message || 'Unable to generate the PDF.');
  } finally {
    if (btn) btn.disabled = false;
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// DATABASE TAB — Sheet-style fare editor
// ══════════════════════════════════════════════════════════════════════════════
function getDatabaseDraftCount() {
  return Object.keys(_databaseDrafts).length;
}

function getDatabaseLookupMaps() {
  return {
    agentNameById: Object.fromEntries(_agents.map(a => [a.id, a.name || a.id])),
    sectorCodeById: Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode || `${s.sectorFrom || ''} ${s.sectorTo || ''}`.trim() || s.id])),
    airlineLabelById: Object.fromEntries(_airlines.map(a => [a.id, a.code ? `${a.code} - ${a.name || ''}`.trim() : (a.name || a.id)])),
    airlineCodeById: Object.fromEntries(_airlines.map(a => [a.id, a.code || a.name || a.id])),
  };
}

function getAgentCommissionValue(agentId, fallback = 0) {
  if (!agentId) return fallback;
  const agent = _agents.find(a => a.id === agentId);
  const commission = Number(agent?.commission);
  return Number.isFinite(commission) ? Math.max(0, commission) : fallback;
}

function normalizeFieldForDraft(field, value) {
  if (field === 'specialRate' || field === 'finalRate' || field === 'commission' || field === 'extraBaggage') {
    return value === '' ? '' : toSafeNumber(value, 0);
  }
  if (field === 'baggage') {
    return value === '' ? '' : parseBaggageNumber(value);
  }
  if (field === 'isHidden') {
    return value === true || value === 'hidden' || value === 'true';
  }
  if (field === 'flightTime') {
    return String(value || '').trim();
  }
  if (field === 'flightDate') {
    return value || '';
  }
  return String(value || '');
}

function normalizeFieldForBase(field, value) {
  if (field === 'specialRate' || field === 'finalRate' || field === 'extraBaggage') {
    return toSafeNumber(value, 0);
  }
  if (field === 'commission') {
    return value === undefined || value === null || value === ''
      ? ''
      : Math.max(0, toSafeNumber(value, 0));
  }
  if (field === 'baggage') {
    return parseBaggageNumber(value);
  }
  if (field === 'isHidden') {
    return value === true;
  }
  if (field === 'flightTime') {
    return String(value || '').trim();
  }
  if (field === 'flightDate') {
    return toDateInputValue(value);
  }
  return String(value || '');
}

function getCommissionValue(fare) {
  if (!fare) return 0;
  if (fare.commission !== undefined && fare.commission !== null && fare.commission !== '') {
    return Math.max(0, toSafeNumber(fare.commission, 0));
  }
  return Math.max(0, toSafeNumber(fare.finalRate, 0) - toSafeNumber(fare.specialRate, 0));
}

function getCalculatedFinalRate(specialRate, commission) {
  return Math.max(0, toSafeNumber(specialRate, 0) + Math.max(0, toSafeNumber(commission, 0)));
}

function getMergedDatabaseFare(fare) {
  const draft = _databaseDrafts[fare.id] || {};
  const merged = { ...fare, ...draft };
  const baseCommission = getCommissionValue(fare);
  merged.flightDate = draft.flightDate !== undefined ? parseDateInputValue(draft.flightDate) : asDate(fare.flightDate);
  merged.specialRate = toSafeNumber(merged.specialRate, 0);
  merged.commission = draft.commission !== undefined
    ? Math.max(0, toSafeNumber(draft.commission, 0))
    : baseCommission;
  merged.finalRate = getCalculatedFinalRate(merged.specialRate, merged.commission);
  merged.baggage = parseBaggageNumber(merged.baggage);
  merged.extraBaggage = toSafeNumber(merged.extraBaggage, 0);
  merged.isHidden = merged.isHidden === true || merged.isHidden === 'hidden' || merged.isHidden === 'true';
  merged.flightTime = String(merged.flightTime || '').trim();
  merged.agentId = merged.agentId || '';
  merged.sectorId = merged.sectorId || '';
  merged.airlineId = merged.airlineId || '';
  return merged;
}

function updateDatabaseToolbarState() {
  const unsaved = getDatabaseDraftCount();
  const selected = _databaseSelected.size;

  const unsavedEl = document.getElementById('database-unsaved-pill');
  if (unsavedEl) unsavedEl.textContent = `Unsaved: ${unsaved}`;

  const saveAllBtn = document.getElementById('database-save-all-btn');
  if (saveAllBtn) saveAllBtn.disabled = unsaved === 0;

  const deleteSelectedBtn = document.getElementById('database-delete-selected-btn');
  if (deleteSelectedBtn) deleteSelectedBtn.disabled = selected === 0;

  const selectedCount = document.getElementById('database-selected-count');
  if (selectedCount) selectedCount.textContent = String(selected);
}

function populateDatabaseFilterSelects() {
  const agentSel = document.getElementById('database-agent-filter');
  const sectorSel = document.getElementById('database-sector-filter');
  const airlineSel = document.getElementById('database-airline-filter');

  if (agentSel) {
    const current = databaseFilters.agentId;
    agentSel.innerHTML = '<option value="all">All Agents</option>' +
      _agents.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.id)} · ${escapeHtml(a.name || 'Unnamed')}</option>`).join('');
    agentSel.value = current;
  }

  if (sectorSel) {
    const current = databaseFilters.sectorId;
    sectorSel.innerHTML = '<option value="all">All Sectors</option>' +
      _sectors.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.sectorCode || s.id)}</option>`).join('');
    sectorSel.value = current;
  }

  if (airlineSel) {
    const current = databaseFilters.airlineId;
    airlineSel.innerHTML = '<option value="all">All Airlines</option>' +
      _airlines.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.code || '—')} · ${escapeHtml(a.name || 'Unnamed')}</option>`).join('');
    airlineSel.value = current;
  }
}

function wireDatabaseTableEvents() {
  const wrap = document.getElementById('database-table-wrap');
  if (!wrap || wrap.dataset.wired) return;
  wrap.dataset.wired = '1';

  const syncRowDirtyState = (fareId) => {
    const row = wrap.querySelector(`tr[data-fare-id="${fareId}"]`);
    if (!row) return;
    const dirty = !!_databaseDrafts[fareId];
    row.classList.toggle('admin-database-row-dirty', dirty);
    const saveBtn = row.querySelector('[data-db-action="save"]');
    const resetBtn = row.querySelector('[data-db-action="reset"]');
    if (saveBtn) saveBtn.disabled = !dirty;
    if (resetBtn) resetBtn.disabled = !dirty;
  };

  const updateDerivedRateInRow = (row) => {
    if (!row) return;
    const spInput = row.querySelector('[data-db-field="specialRate"]');
    const commInput = row.querySelector('[data-db-field="commission"]');
    const rateInput = row.querySelector('[data-db-field="finalRate"]');
    if (!spInput || !commInput || !rateInput) return;
    const specialRate = toSafeNumber(spInput.value, 0);
    const commission = Math.max(0, toSafeNumber(commInput.value, 0));
    rateInput.value = String(getCalculatedFinalRate(specialRate, commission));
  };

  const onFieldChange = (e) => {
    const el = e.target.closest('[data-db-field]');
    if (!el) return;
    const row = el.closest('tr[data-fare-id]');
    if (!row) return;
    const fareId = row.dataset.fareId;
    const field = el.dataset.dbField;
    const baseFare = _databaseFares.find(f => f.id === fareId);
    if (!baseFare || !field) return;

    const rawValue = field === 'isHidden' ? el.value : el.value;
    const draftValue = normalizeFieldForDraft(field, rawValue);
    const baseValue = field === 'commission'
      ? getCommissionValue(baseFare)
      : normalizeFieldForBase(field, baseFare[field]);
    const changed = draftValue !== baseValue;

    const nextDraft = { ...(_databaseDrafts[fareId] || {}) };
    if (changed) nextDraft[field] = draftValue;
    else delete nextDraft[field];

    if (field === 'agentId') {
      const commissionInput = row.querySelector('[data-db-field="commission"]');
      const agentCommission = getAgentCommissionValue(draftValue, 0);
      if (commissionInput) commissionInput.value = String(agentCommission);
      const baseCommission = getCommissionValue(baseFare);
      if (agentCommission !== baseCommission) nextDraft.commission = agentCommission;
      else delete nextDraft.commission;
      updateDerivedRateInRow(row);
    }

    if (Object.keys(nextDraft).length) _databaseDrafts[fareId] = nextDraft;
    else delete _databaseDrafts[fareId];

    if (field === 'specialRate' || field === 'commission') {
      updateDerivedRateInRow(row);
    }

    syncRowDirtyState(fareId);
    updateDatabaseToolbarState();
  };

  wrap.addEventListener('input', onFieldChange);
  wrap.addEventListener('change', (e) => {
    onFieldChange(e);

    const selectAll = e.target.closest('#database-select-all');
    if (selectAll) {
      wrap.querySelectorAll('input[data-db-select]').forEach((cb) => {
        cb.checked = selectAll.checked;
        const id = cb.dataset.dbSelect;
        if (!id) return;
        if (selectAll.checked) _databaseSelected.add(id);
        else _databaseSelected.delete(id);
      });
      updateDatabaseToolbarState();
      return;
    }

    const rowCb = e.target.closest('input[data-db-select]');
    if (rowCb) {
      const id = rowCb.dataset.dbSelect;
      if (!id) return;
      if (rowCb.checked) _databaseSelected.add(id);
      else _databaseSelected.delete(id);
      updateDatabaseToolbarState();
    }
  });

  wrap.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-db-action]');
    if (!btn) return;
    const action = btn.dataset.dbAction;
    const fareId = btn.dataset.id;
    if (!fareId) return;

    if (action === 'edit') {
      _databaseEditing.add(fareId);
      renderDatabaseTable();
      return;
    }

    if (action === 'cancel_edit') {
      _databaseEditing.delete(fareId);
      renderDatabaseTable();
      return;
    }

    if (action === 'save') {
      btn.disabled = true;
      const ok = await persistDatabaseRow(fareId);
      if (!ok) btn.disabled = false;
      else _databaseEditing.delete(fareId);
      renderDatabaseTable();
      return;
    }

    if (action === 'share') {
      const dbFare = _databaseFares.find(f => f.id === fareId) || _databaseDrafts[fareId] || {};
      const merged = getMergedDatabaseFare(dbFare) || dbFare;

      const sector = _sectors.find(s => s.id === merged.sectorId) || {};
      const airline = _airlines.find(a => a.id === merged.airlineId) || {};

      const airlineName = airline.name || merged.airlineId || 'Unknown Airline';
      const originName = sector.sectorFrom || 'TBA';
      const destName = sector.sectorTo || 'TBA';

      const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      let dateStr = 'TBA';
      if (merged.flightDate) {
        const dt = merged.flightDate instanceof Date ? merged.flightDate : new Date(merged.flightDate);
        if (!isNaN(dt)) {
          dateStr = dt.toLocaleDateString('en-GB', dateOptions).replace(/,/g, '');
        }
      }

      const dep = (merged.flightTime && merged.flightTime.split('-')[0]) ? merged.flightTime.split('-')[0].trim() : 'TBA';
      const arr = (merged.flightTime && merged.flightTime.includes('-')) ? merged.flightTime.split('-')[1].trim() : 'TBA';
      const price = "₹" + (Number(merged.finalRate) || 0).toLocaleString('en-IN');

      const waMsg = `Hello Zamra Travels, I'm interested in booking this flight:\n\n✈️ *${airlineName.toUpperCase()}*\n🛫 From: *${originName}*\n🛬 To: *${destName}*\n📅 Date: *${dateStr}*\n⏰ Dep: ${dep} | Arr: ${arr}\n💵 Price: *${price}*\n\nPlease confirm availability!`;

      try {
        await writeTextToClipboard(waMsg);
        toast('success', 'Copied!', 'Flight details copied to clipboard.');
      } catch (err) {
        toast('error', 'Copy failed', err.message);
      }
      return;
    }

    if (action === 'reset') {
      delete _databaseDrafts[fareId];
      _databaseEditing.delete(fareId);
      renderDatabaseTable();
      return;
    }

    if (action === 'delete') {
      if (!confirm('Delete this fare row? This cannot be undone.')) return;
      btn.disabled = true;
      try {
        await deleteFare(fareId);
        _databaseFares = _databaseFares.filter(f => f.id !== fareId);
        delete _databaseDrafts[fareId];
        _databaseSelected.delete(fareId);
        _databaseEditing.delete(fareId);
        toast('success', 'Deleted', 'Fare row removed.');
        renderDatabaseTable();
      } catch (err) {
        toast('error', 'Delete Failed', err.message);
        btn.disabled = false;
      }
    }
  });
}

function wireDatabaseControls(tab) {
  if (!tab || tab.dataset.controlsWired) return;
  tab.dataset.controlsWired = '1';

  const searchInput = document.getElementById('database-search');
  const agentSel = document.getElementById('database-agent-filter');
  const sectorSel = document.getElementById('database-sector-filter');
  const airlineSel = document.getElementById('database-airline-filter');
  const statusSel = document.getElementById('database-status-filter');
  const startDateInput = document.getElementById('database-start-date');
  const endDateInput = document.getElementById('database-end-date');
  const limitSel = document.getElementById('database-limit');
  const clearBtn = document.getElementById('database-clear-filters');
  const refreshBtn = document.getElementById('database-refresh-btn');
  const saveAllBtn = document.getElementById('database-save-all-btn');
  const deleteSelectedBtn = document.getElementById('database-delete-selected-btn');
  const addRowBtn = document.getElementById('database-add-row-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      databaseFilters.search = e.target.value || '';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (agentSel) {
    agentSel.addEventListener('change', (e) => {
      databaseFilters.agentId = e.target.value || 'all';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (sectorSel) {
    sectorSel.addEventListener('change', (e) => {
      databaseFilters.sectorId = e.target.value || 'all';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (airlineSel) {
    airlineSel.addEventListener('change', (e) => {
      databaseFilters.airlineId = e.target.value || 'all';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (statusSel) {
    statusSel.addEventListener('change', (e) => {
      databaseFilters.status = e.target.value || 'all';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (startDateInput) {
    startDateInput.addEventListener('change', (e) => {
      databaseFilters.startDate = e.target.value || '';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (endDateInput) {
    endDateInput.addEventListener('change', (e) => {
      databaseFilters.endDate = e.target.value || '';
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (limitSel) {
    limitSel.value = String(tableLimit.databaseFares);
    limitSel.addEventListener('change', (e) => {
      tableLimit.databaseFares = parseInt(e.target.value, 10) || 20;
      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      databaseFilters.search = '';
      databaseFilters.agentId = 'all';
      databaseFilters.sectorId = 'all';
      databaseFilters.airlineId = 'all';
      databaseFilters.status = 'all';
      databaseFilters.startDate = '';
      databaseFilters.endDate = '';

      if (searchInput) searchInput.value = '';
      if (agentSel) agentSel.value = 'all';
      if (sectorSel) sectorSel.value = 'all';
      if (airlineSel) airlineSel.value = 'all';
      if (statusSel) statusSel.value = 'all';
      if (startDateInput) startDateInput.value = '';
      if (endDateInput) endDateInput.value = '';

      tablePage.databaseFares = 1;
      renderDatabaseTable();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      const current = refreshBtn.innerHTML;
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Refreshing...';
      await renderDatabaseTab(true);
      refreshBtn.disabled = false;
      refreshBtn.innerHTML = current;
    });
  }

  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', saveAllDatabaseRows);
  }

  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', deleteSelectedDatabaseRows);
  }

  if (addRowBtn) {
    addRowBtn.addEventListener('click', openDatabaseAddFareModal);
  }
}

async function renderDatabaseTab(fetchData = true) {
  const tab = document.getElementById('database-tab');
  if (!tab) return;

  wireDatabaseControls(tab);
  wireDatabaseTableEvents();
  populateDatabaseFilterSelects();

  const shouldFetch = fetchData || !tab.dataset.loaded;
  if (shouldFetch) {
    try {
      _databaseFares = await getFares({ includeHidden: true });
      _databaseDrafts = {};
      _databaseSelected = new Set();
      _databaseEditing = new Set();
      tablePage.databaseFares = 1;
      tab.dataset.loaded = '1';
    } catch (err) {
      toast('error', 'Load Failed', err.message);
      _databaseFares = [];
    }
  }

  renderDatabaseTable();
}

function getFilteredDatabaseRows() {
  const { agentNameById, sectorCodeById, airlineLabelById } = getDatabaseLookupMaps();
  const q = databaseFilters.search.trim().toLowerCase();
  const fromMs = startOfDayMs(databaseFilters.startDate);
  const toMs = endOfDayMs(databaseFilters.endDate);

  const filtered = _databaseFares
    .map(f => getMergedDatabaseFare(f))
    .filter((f) => {
      if (databaseFilters.agentId !== 'all' && f.agentId !== databaseFilters.agentId) return false;
      if (databaseFilters.sectorId !== 'all' && f.sectorId !== databaseFilters.sectorId) return false;
      if (databaseFilters.airlineId !== 'all' && f.airlineId !== databaseFilters.airlineId) return false;
      if (databaseFilters.status === 'live' && f.isHidden) return false;
      if (databaseFilters.status === 'hidden' && !f.isHidden) return false;

      const dtMs = asDate(f.flightDate)?.getTime?.() || null;
      if (fromMs !== null && (dtMs === null || dtMs < fromMs)) return false;
      if (toMs !== null && (dtMs === null || dtMs > toMs)) return false;

      if (!q) return true;
      const haystack = [
        f.id,
        toDateInputValue(f.flightDate),
        f.flightTime,
        f.specialRate,
        f.finalRate,
        f.commission,
        f.baggage,
        f.extraBaggage,
        f.isHidden ? 'hidden' : 'live',
        f.agentId,
        f.sectorId,
        f.airlineId,
        agentNameById[f.agentId] || '',
        sectorCodeById[f.sectorId] || '',
        airlineLabelById[f.airlineId] || '',
      ].join(' ').toLowerCase();

      return haystack.includes(q);
    });

  const { key, asc } = tableSort.databaseFares;
  return filtered.sort((a, b) => {
    const toSortValue = (row) => {
      if (key === 'agentId') return (agentNameById[row.agentId] || row.agentId || '').toLowerCase();
      if (key === 'sectorId') return (sectorCodeById[row.sectorId] || row.sectorId || '').toLowerCase();
      if (key === 'airlineId') return (airlineLabelById[row.airlineId] || row.airlineId || '').toLowerCase();
      if (key === 'flightDate') return asDate(row.flightDate)?.getTime?.() || 0;
      if (key === 'isHidden') return row.isHidden ? 1 : 0;
      return row[key];
    };

    let valA = toSortValue(a);
    let valB = toSortValue(b);
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  });
}

function renderDatabaseTable() {
  const wrap = document.getElementById('database-table-wrap');
  if (!wrap) return;

  const rows = getFilteredDatabaseRows();
  const { agentNameById, sectorCodeById, airlineLabelById, airlineCodeById } = getDatabaseLookupMaps();
  const totalEl = document.getElementById('database-total-count');
  if (totalEl) totalEl.textContent = rows.length.toLocaleString();

  const limit = tableLimit.databaseFares;
  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  if (tablePage.databaseFares > totalPages) tablePage.databaseFares = totalPages;
  const start = (tablePage.databaseFares - 1) * limit;
  const pageData = rows.slice(start, start + limit);

  if (!pageData.length) {
    wrap.innerHTML = `<div class="admin-empty-state">
      <div class="admin-empty-state-card">
        <div class="admin-empty-state-icon">
          <i class="bi bi-database"></i>
        </div>
        <p class="admin-empty-state-title">No fares matched your filter</p>
      </div>
    </div>`;
    renderPaginationFooter('databaseFares', rows.length, totalPages, start, limit);
    updateDatabaseToolbarState();
    return;
  }

  const TH = (key, label) =>
    `<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="databaseFares" data-sort-key="${key}">
      ${label} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i>
    </th>`;

  const buildAgentOptions = (selectedId) => _agents.map(a =>
    `<option value="${escapeHtml(a.id)}" ${a.id === selectedId ? 'selected' : ''}>${escapeHtml(a.id)} · ${escapeHtml(a.name || 'Unnamed')}</option>`
  ).join('');

  const buildSectorOptions = (selectedId) => _sectors.map(s =>
    `<option value="${escapeHtml(s.id)}" ${s.id === selectedId ? 'selected' : ''}>${escapeHtml(s.sectorCode || s.id)}</option>`
  ).join('');

  const buildAirlineOptions = (selectedId) => _airlines.map(a =>
    `<option value="${escapeHtml(a.id)}" ${a.id === selectedId ? 'selected' : ''}>${escapeHtml(a.code || '—')} · ${escapeHtml(a.name || 'Unnamed')}</option>`
  ).join('');

  const allSelectedOnPage = pageData.length > 0 && pageData.every(r => _databaseSelected.has(r.id));

  wrap.innerHTML = `
    <table class="admin-database-table">
      <thead>
        <tr>
          <th class="w-[36px] text-center"><input id="database-select-all" type="checkbox" ${allSelectedOnPage ? 'checked' : ''}></th>
          <th class="w-[56px]">#</th>
          ${TH('agentId', 'Agent')}
          ${TH('sectorId', 'Sector Code')}
          ${TH('flightDate', 'Date')}
          ${TH('flightTime', 'Time')}
          ${TH('airlineId', 'Flight')}
          ${TH('baggage', 'Baggage')}
          ${TH('extraBaggage', 'Extra')}
          ${TH('specialRate', 'SP Rate')}
          ${TH('commission', 'Commission')}
          ${TH('finalRate', 'Rate')}
          ${TH('isHidden', 'Status')}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pageData.map((fare, idx) => {
    const dirty = !!_databaseDrafts[fare.id];
    const selected = _databaseSelected.has(fare.id);
    const isEditing = _databaseEditing.has(fare.id) || dirty;

    const agentName = agentNameById[fare.agentId] || fare.agentId;
    const sectorName = sectorCodeById[fare.sectorId] || fare.sectorId;
    const airlineName = airlineLabelById[fare.airlineId] || fare.airlineId;
    const airlineCode = airlineCodeById[fare.airlineId] || fare.airlineId;

    const dateStr = fare.flightDate instanceof Date
      ? fare.flightDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : (fare.flightDate ? toDateInputValue(fare.flightDate) : '—');

    const fareRowBg = idx % 2 === 1 ? 'bg-slate-50/60' : '';

    return `
            <tr data-fare-id="${fare.id}" class="${dirty ? 'admin-database-row-dirty' : fareRowBg} hover:bg-slate-100/80 transition-colors">
              <td class="text-center">
                <input type="checkbox" data-db-select="${fare.id}" ${selected ? 'checked' : ''}>
              </td>
              <td class="font-mono text-[11px] text-text-soft">${start + idx + 1}</td>
              <td class="whitespace-nowrap ${isEditing ? '' : 'text-[12px]'}">
                ${isEditing ? `
                <select data-db-field="agentId" class="db-cell-select min-w-[150px]">
                  <option value="">Select Agent</option>
                  ${buildAgentOptions(fare.agentId)}
                </select>
                ` : `<span class="text-text-muted">${escapeHtml(agentName)}</span>`}
              </td>
              <td class="whitespace-nowrap ${isEditing ? '' : 'text-[12px]'}">
                ${isEditing ? `
                <select data-db-field="sectorId" class="db-cell-select min-w-[120px]">
                  <option value="">Select Sector</option>
                  ${buildSectorOptions(fare.sectorId)}
                </select>
                ` : `<span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${escapeHtml(sectorName)}</span>`}
              </td>
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">
                ${isEditing ? `
                <input type="date" data-db-field="flightDate" class="db-cell-input" value="${toDateInputValue(fare.flightDate)}">
                ` : escapeHtml(dateStr)}
              </td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">
                ${isEditing ? `
                <input type="text" data-db-field="flightTime" class="db-cell-input min-w-[110px]" value="${escapeHtml(fare.flightTime || '')}" placeholder="04:05 - 11:10">
                ` : escapeHtml(fare.flightTime || '—')}
              </td>
              <td class="whitespace-nowrap ${isEditing ? '' : 'font-semibold text-[13px]'}">
                ${isEditing ? `
                <select data-db-field="airlineId" class="db-cell-select min-w-[150px]">
                  <option value="">No Airline</option>
                  ${buildAirlineOptions(fare.airlineId)}
                </select>
                ` : escapeHtml(airlineCode)}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${isEditing ? `
                <select data-db-field="baggage" class="db-cell-select min-w-[90px]">
                  ${buildKgOptionsHtml(ETICKET_CHECKIN_BAG_OPTIONS, parseBaggageNumber(fare.baggage))}
                </select>
                ` : (fare.baggage ? fare.baggage + ' kg' : '—')}
              </td>
              <td class="whitespace-nowrap text-[12px]">
                ${isEditing ? `
                <select data-db-field="extraBaggage" class="db-cell-select min-w-[90px]">
                  ${buildKgOptionsHtml(ETICKET_CABIN_BAG_OPTIONS, toSafeNumber(fare.extraBaggage, 0))}
                </select>
                ` : (fare.extraBaggage ? fare.extraBaggage + ' kg' : '—')}
              </td>
              <td class="whitespace-nowrap">
                ${isEditing ? `
                <input type="number" data-db-field="specialRate" class="db-cell-input db-cell-num" value="${toSafeNumber(fare.specialRate, 0)}" min="0" step="1">
                ` : `<span class="text-[13px] text-text-muted">₹${(fare.specialRate || 0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${isEditing ? `
                <input type="number" data-db-field="commission" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${toSafeNumber(fare.commission, 0)}" min="0" step="1" readonly tabindex="-1">
                ` : `<span class="text-[12px] text-text-muted" id="comm-${fare.id}">₹${(fare.commission || 0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${isEditing ? `
                <input type="number" data-db-field="finalRate" class="db-cell-input db-cell-num bg-slate-50 text-slate-500" value="${toSafeNumber(fare.finalRate, 0)}" min="0" step="1" readonly tabindex="-1">
                ` : `<span class="font-black text-navy text-[14px]">₹${(fare.finalRate || 0).toLocaleString()}</span>`}
              </td>
              <td class="whitespace-nowrap">
                ${isEditing ? `
                <select data-db-field="isHidden" class="db-cell-select min-w-[94px]">
                  <option value="live" ${fare.isHidden ? '' : 'selected'}>Live</option>
                  <option value="hidden" ${fare.isHidden ? 'selected' : ''}>Hidden</option>
                </select>
                ` : `
                <span class="admin-status-pill ${fare.isHidden ? 'admin-status-hidden' : 'admin-status-live'}">
                  ${fare.isHidden ? '● Hidden' : '● Live'}
                </span>
                `}
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  ${isEditing ? `
                  <button data-db-action="save" data-id="${fare.id}" class="admin-action-btn admin-action-edit" ${dirty ? '' : 'disabled'}><i class="bi bi-check2-circle"></i>Save</button>
                  <button data-db-action="${dirty ? 'reset' : 'cancel_edit'}" data-id="${fare.id}" class="admin-action-btn admin-action-toggle"><i class="bi ${dirty ? 'bi-arrow-counterclockwise' : 'bi-x'}"></i>${dirty ? 'Reset' : 'Cancel'}</button>
                  ` : `
                  <button data-db-action="edit" data-id="${fare.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil"></i>Edit</button>
                  `}
                  <button data-db-action="share" data-id="${fare.id}" class="admin-action-btn admin-action-show"><i class="bi bi-box-arrow-up"></i>Share</button>
                  <button data-db-action="delete" data-id="${fare.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Del</button>
                </div>
              </td>
            </tr>
          `;
  }).join('')}
      </tbody>
    </table>
  `;

  renderPaginationFooter('databaseFares', rows.length, totalPages, start, limit);
  updateSortIcons('databaseFares');
  updateDatabaseToolbarState();
}

async function persistDatabaseRow(fareId, { silent = false } = {}) {
  const baseFare = _databaseFares.find(f => f.id === fareId);
  if (!baseFare) return false;
  const draft = _databaseDrafts[fareId];
  if (!draft) return true;

  const merged = getMergedDatabaseFare(baseFare);
  const flightDate = asDate(merged.flightDate);

  if (!merged.agentId) {
    if (!silent) toast('warning', 'Missing Agent', 'Please select an agent before saving.');
    return false;
  }
  if (!merged.sectorId) {
    if (!silent) toast('warning', 'Missing Sector', 'Please select a sector before saving.');
    return false;
  }
  if (!flightDate) {
    if (!silent) toast('warning', 'Missing Date', 'Please set a valid flight date before saving.');
    return false;
  }

  const specialRate = toSafeNumber(merged.specialRate, 0);
  const commission = Math.max(0, toSafeNumber(merged.commission, 0));
  const finalRate = getCalculatedFinalRate(specialRate, commission);

  const payload = {
    agentId: merged.agentId,
    sectorId: merged.sectorId,
    airlineId: merged.airlineId || '',
    flightDate,
    flightTime: merged.flightTime || '',
    specialRate,
    finalRate,
    commission,
    baggage: parseBaggageNumber(merged.baggage),
    extraBaggage: toSafeNumber(merged.extraBaggage, 0),
    isHidden: merged.isHidden === true,
  };

  try {
    await updateFare(fareId, payload);
    _databaseFares = _databaseFares.map(f => f.id === fareId ? { ...f, ...payload } : f);
    delete _databaseDrafts[fareId];
    _databaseEditing.delete(fareId);
    if (!silent) toast('success', 'Saved', 'Fare row updated.');
    return true;
  } catch (err) {
    if (!silent) toast('error', 'Save Failed', err.message);
    return false;
  }
}

async function saveAllDatabaseRows() {
  const ids = Object.keys(_databaseDrafts);
  if (!ids.length) return;

  const btn = document.getElementById('database-save-all-btn');
  const original = btn?.innerHTML;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Saving...';
  }

  let success = 0;
  let failed = 0;
  for (const id of ids) {
    const ok = await persistDatabaseRow(id, { silent: true });
    if (ok) success += 1;
    else failed += 1;
  }

  renderDatabaseTable();

  if (btn) {
    btn.disabled = getDatabaseDraftCount() === 0;
    btn.innerHTML = original || 'Save All';
  }

  if (failed === 0) {
    toast('success', 'Saved', `${success} row${success !== 1 ? 's' : ''} updated.`);
  } else {
    toast('warning', 'Partial Save', `${success} saved, ${failed} failed. Fix invalid rows and retry.`);
  }
}

async function deleteSelectedDatabaseRows() {
  const ids = Array.from(_databaseSelected);
  if (!ids.length) return;
  if (!confirm(`Delete ${ids.length} selected fare row${ids.length !== 1 ? 's' : ''}? This cannot be undone.`)) return;

  const btn = document.getElementById('database-delete-selected-btn');
  const original = btn?.innerHTML;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Deleting...';
  }

  const results = await Promise.allSettled(ids.map(id => deleteFare(id)));
  const successIds = [];
  let failed = 0;
  results.forEach((r, idx) => {
    if (r.status === 'fulfilled') successIds.push(ids[idx]);
    else failed += 1;
  });

  if (successIds.length) {
    const successSet = new Set(successIds);
    _databaseFares = _databaseFares.filter(f => !successSet.has(f.id));
    successIds.forEach(id => {
      delete _databaseDrafts[id];
      _databaseSelected.delete(id);
      _databaseEditing.delete(id);
    });
  }

  renderDatabaseTable();

  if (btn) btn.innerHTML = original || 'Delete Selected';

  if (failed === 0) {
    toast('success', 'Deleted', `${successIds.length} row${successIds.length !== 1 ? 's' : ''} deleted.`);
  } else {
    toast('warning', 'Partial Delete', `${successIds.length} deleted, ${failed} failed.`);
  }
}

function openDatabaseAddFareModal() {
  const dateDefault = toDateInputValue(new Date());
  openModal('Add Fare Row', `
    <form id="database-add-form" class="admin-modal-form">
      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Flight Details</p>
            <p class="admin-form-section-desc">Date, time, agent, sector, and airline.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field">
            <label class="admin-label">Date *</label>
            <input id="db-add-date" type="date" class="admin-control" value="${dateDefault}" required>
          </div>
          <div class="admin-field">
            <label class="admin-label">Time</label>
            <input id="db-add-time" type="text" class="admin-control" placeholder="e.g. 04:05 - 11:10">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="admin-field">
            <label class="admin-label">Agent *</label>
            <select id="db-add-agent" class="admin-control" required>
              <option value="">Select Agent</option>
              ${_agents.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.id)} · ${escapeHtml(a.name || 'Unnamed')}</option>`).join('')}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Sector *</label>
            <select id="db-add-sector" class="admin-control" required>
              <option value="">Select Sector</option>
              ${_sectors.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.sectorCode || s.id)}</option>`).join('')}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Airline</label>
            <select id="db-add-airline" class="admin-control">
              <option value="">No Airline</option>
              ${_airlines.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.code || '—')} · ${escapeHtml(a.name || 'Unnamed')}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Pricing</p>
            <p class="admin-form-section-desc">Rates and commission.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="admin-field">
            <label class="admin-label">SP Rate (₹)</label>
            <input id="db-add-sp" type="number" class="admin-control" min="0" step="1" value="0">
          </div>
          <div class="admin-field">
            <label class="admin-label">Commission (₹)</label>
            <input id="db-add-comm" type="number" class="admin-control bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
          </div>
          <div class="admin-field">
            <label class="admin-label">Final Rate (₹)</label>
            <input id="db-add-rate" type="number" class="admin-control bg-slate-50 text-slate-500" min="0" step="1" value="0" readonly tabindex="-1">
          </div>
        </div>
        <p class="admin-help mt-2">Rate is auto-calculated as <strong>SP Rate + Commission</strong>.</p>
      </div>

      <div class="admin-form-section">
        <div class="admin-form-section-head">
          <div>
            <p class="admin-form-section-title">Baggage &amp; Status</p>
            <p class="admin-form-section-desc">Check-in, extra baggage, and visibility.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="admin-field">
            <label class="admin-label">Baggage (kg)</label>
            <select id="db-add-bag" class="admin-control">
              ${buildKgOptionsHtml(ETICKET_CHECKIN_BAG_OPTIONS, 30)}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Extra Baggage (kg)</label>
            <select id="db-add-exbag" class="admin-control">
              ${buildKgOptionsHtml(ETICKET_CHECKIN_BAG_OPTIONS, 20)}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="admin-field">
            <label class="admin-label">Status</label>
            <select id="db-add-status" class="admin-control">
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      <div class="admin-modal-footer">
        <button type="button" onclick="document.getElementById('admin-modal').close()" class="admin-btn admin-btn-ghost px-5">Cancel</button>
        <button type="submit" class="admin-btn admin-btn-primary px-5">Add Fare</button>
      </div>
    </form>
  `, true);

  const form = document.getElementById('database-add-form');
  if (!form) return;

  const spInput = document.getElementById('db-add-sp');
  const commInput = document.getElementById('db-add-comm');
  const rateInput = document.getElementById('db-add-rate');
  const agentSelect = document.getElementById('db-add-agent');
  const syncAddRate = () => {
    if (!rateInput) return;
    const specialRate = toSafeNumber(spInput?.value, 0);
    const commission = Math.max(0, toSafeNumber(commInput?.value, 0));
    rateInput.value = String(getCalculatedFinalRate(specialRate, commission));
  };
  const syncAddCommission = () => {
    if (!commInput) return;
    const agentCommission = getAgentCommissionValue(agentSelect?.value, 0);
    commInput.value = String(agentCommission);
    syncAddRate();
  };
  spInput?.addEventListener('input', syncAddRate);
  agentSelect?.addEventListener('change', syncAddCommission);
  syncAddCommission();
  syncAddRate();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn?.textContent || 'Add Fare';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding...';
    }

    try {
      const dateValue = document.getElementById('db-add-date')?.value || '';
      const flightDate = parseDateInputValue(dateValue);
      if (!flightDate) throw new Error('Please provide a valid flight date.');

      const specialRate = toSafeNumber(document.getElementById('db-add-sp')?.value, 0);
      const commission = Math.max(0, toSafeNumber(document.getElementById('db-add-comm')?.value, 0));
      const finalRate = getCalculatedFinalRate(specialRate, commission);

      await addFare({
        agentId: document.getElementById('db-add-agent')?.value || '',
        sectorId: document.getElementById('db-add-sector')?.value || '',
        airlineId: document.getElementById('db-add-airline')?.value || '',
        flightDate,
        flightTime: document.getElementById('db-add-time')?.value?.trim() || '',
        specialRate,
        finalRate,
        commission,
        baggage: parseBaggageNumber(document.getElementById('db-add-bag')?.value),
        extraBaggage: toSafeNumber(document.getElementById('db-add-exbag')?.value, 0),
        isHidden: (document.getElementById('db-add-status')?.value || 'live') === 'hidden',
      });

      document.getElementById('admin-modal')?.close();
      await renderDatabaseTab(true);
      toast('success', 'Added', 'New fare row added.');
    } catch (err) {
      toast('error', 'Add Failed', err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// AGENT SHEETS TAB — Submit rate data to Firestore (+ legacy n8n webhook)
// ══════════════════════════════════════════════════════════════════════════════
const WEBHOOK = 'https://n8n.srv1491832.hstgr.cloud/webhook/zamra-rates';
const MONTHS = { JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06', JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12' };
const AIR_RX = /\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;

let selAgent = null;
let rateHistory = JSON.parse(localStorage.getItem('zt_hist') || '[]');

function initAgentSheets() {
  // Agent chips will be built after global data is loaded (called from onAuthChange)
  const ta = document.getElementById('rateData');
  if (ta) {
    ta.addEventListener('input', function () {
      const n = this.value.length;
      const cc = document.getElementById('charCount');
      if (cc) cc.textContent = n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
      validate();
      clearTimeout(window._previewTimer);
      if (n > 15) window._previewTimer = setTimeout(() => doPreview(this.value), 500);
      else hidePrev();
    });
  }

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (ta) ta.value = '';
    const cc = document.getElementById('charCount');
    if (cc) cc.textContent = '0 characters';
    hidePrev(); validate();
  });

  document.getElementById('clearBtn')?.addEventListener('click', () => {
    rateHistory = [];
    saveHistory(); renderHistory(); updateStats();
  });

  document.getElementById('manualAgent')?.addEventListener('input', function () {
    const v = parseInt(this.value);
    selAgent = (v > 0) ? String(v) : null;
    document.querySelectorAll('.rp-chip').forEach(c => c.classList.remove('on'));
    syncPill(); validate();
  });

  document.getElementById('submitBtn')?.addEventListener('click', handleSheetSubmit);

  updateStats();
  renderHistory();
}

// Build agent chips from Firestore agents list
function buildChips() {
  const cGrid = document.getElementById('chipGrid');
  if (!cGrid) return;
  cGrid.innerHTML = '';

  const chipAgents = _agents.length ? [..._agents].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.id.localeCompare(b.id);
  }) : [];

  if (!chipAgents.length) {
    selAgent = null;
    cGrid.innerHTML = `<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>`;
    syncPill();
    validate();
    return;
  }

  if (selAgent && !chipAgents.some(agent => agent.id === selAgent)) {
    selAgent = null;
  }

  chipAgents.forEach(agent => {
    const c = document.createElement('div');
    c.className = 'rp-chip';
    c.dataset.agentId = agent.id;
    c.textContent = agent.id;
    if (agent.id === selAgent) c.classList.add('on');
    c.addEventListener('click', () => pickAgent(agent.id, agent.name, c));
    cGrid.appendChild(c);
  });

  syncPill();
  validate();
}


function pickAgent(agentId, agentName, el) {
  selAgent = agentId;
  document.getElementById('manualAgent').value = '';
  document.querySelectorAll('.rp-chip').forEach(c => {
    c.classList.remove('on');
  });
  if (el) {
    el.classList.add('on');
  }
  syncPill(); validate();
}

function syncPill() {
  const p = document.getElementById('agentPill');
  if (!p) return;
  if (selAgent) {
    const agent = _agents.find(a => a.id === selAgent);
    p.textContent = `Agent ${agent?.id || selAgent} selected ✓`;
    p.classList.remove('empty');
  } else {
    p.textContent = 'Select an agent to continue';
    p.classList.add('empty');
  }
}

function validate() {
  const ta = document.getElementById('rateData');
  const btn = document.getElementById('submitBtn');
  if (btn) btn.disabled = !(selAgent && ta && ta.value.trim().length > 10);
}

// Quick client-side parser
function quickParse(text) {
  const rows = [];
  let sector = null, airline = 'IX';
  for (const raw of text.split('\n')) {
    const line = raw.replace(/[*_~`]/g, '').trim();
    if (!line) continue;
    const sm = line.match(/([A-Z]{3})\s+([A-Z]{3})/);
    if (sm && line.length < 70 && !line.match(/\d{4,6}/)) {
      sector = sm[1] + '-' + sm[2];
      const am = line.match(AIR_RX);
      if (am) airline = am[1];
      continue;
    }
    if (sector) {
      const am = line.match(AIR_RX);
      if (am && !line.match(/\d{4,6}/)) { airline = am[1]; continue; }
      const m = line.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);
      if (m) {
        const rate = parseInt(m[3]);
        if (rate >= 1000 && rate <= 99999) {
          rows.push({ sector, date: `2026-${MONTHS[m[2].toUpperCase()]}-${m[1].padStart(2, '0')}`, airline: am ? am[1] : airline, rate });
        }
      }
    }
  }
  return rows;
}

function doPreview(text) {
  const rows = quickParse(text);
  if (!rows.length) { hidePrev(); return; }
  const pb = document.getElementById('prevBox');
  if (pb) pb.classList.add('on');
  const pc = document.getElementById('prevCount');
  if (pc) pc.textContent = rows.length + ' entr' + (rows.length === 1 ? 'y' : 'ies');
  const tbody = document.getElementById('prevBody');
  if (!tbody) return;
  tbody.innerHTML = rows.slice(0, 60).map(r => `
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${r.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${r.rate.toLocaleString()}</td></tr>`).join('');
  if (rows.length > 60) tbody.innerHTML += `<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${rows.length - 60} more</td></tr>`;
}

function hidePrev() { document.getElementById('prevBox')?.classList.remove('on'); }

async function handleSheetSubmit() {
  const ta = document.getElementById('rateData');
  if (!selAgent || !ta?.value.trim()) return;

  const btn = document.getElementById('submitBtn');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing in n8n...`;

  const bar = document.getElementById('progBar');
  const fill = document.getElementById('progFill');
  if (bar) bar.classList.add('on');
  let prog = 0;
  const iv = setInterval(() => { prog = Math.min(prog + Math.random() * 13, 85); if (fill) fill.style.width = prog + '%'; }, 280);

  const parsedRows = quickParse(ta.value);

  const hEntry = {
    id: Date.now(), agent: selAgent,
    time: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    rows: parsedRows.length, saved: null, status: 'pen',
  };
  rateHistory.unshift(hEntry);
  if (rateHistory.length > 15) rateHistory.pop();
  saveHistory(); renderHistory();

  try {
    const n8nResp = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: selAgent,
        raw_text: ta.value.trim(),
        parsed_rows: parsedRows,
        parsed_count: parsedRows.length,
        timestamp: new Date().toISOString(),
        source: 'zamra-portal',
      }),
    });

    let n8nPayload = null;
    try {
      n8nPayload = await n8nResp.json();
    } catch {
      n8nPayload = null;
    }
    const n8nResult = Array.isArray(n8nPayload) ? n8nPayload[0] : n8nPayload;
    const n8nSuccess = n8nResult?.success === true;
    const savedCount = Number.isFinite(Number(n8nResult?.saved)) ? Number(n8nResult.saved) : null;

    clearInterval(iv);
    if (fill) fill.style.width = '100%';

    if (!n8nResp.ok) {
      throw new Error('N8N webhook rejected payload');
    }
    if (!n8nSuccess) {
      throw new Error('N8N workflow reported failure');
    }
    if (savedCount === null) {
      throw new Error('N8N response missing saved count');
    }

    hEntry.status = 'ok';
    hEntry.saved = savedCount;
    saveHistory(); renderHistory(); updateStats();
    toast('success', 'Saved', `${savedCount} row${savedCount === 1 ? '' : 's'} added to Firestore.`);
    setTimeout(() => { ta.value = ''; const cc = document.getElementById('charCount'); if (cc) cc.textContent = '0 characters'; hidePrev(); validate(); }, 500);
  } catch (err) {
    clearInterval(iv);
    if (fill) fill.style.width = '100%';
    hEntry.status = 'err';
    saveHistory(); renderHistory();
    toast('error', 'Submission Failed', err.message);
  }

  setTimeout(() => { if (bar) bar.classList.remove('on'); if (fill) fill.style.width = '0%'; btn.innerHTML = orig; validate(); }, 900);
}

function updateStats() {
  const ss = document.getElementById('statSubs');
  if (ss) ss.textContent = rateHistory.length;
  const se = document.getElementById('statEntries');
  if (se) {
    const totalSaved = rateHistory.reduce((sum, h) => sum + (Number.isFinite(Number(h.saved)) ? Number(h.saved) : 0), 0);
    se.textContent = totalSaved;
  }
}

function saveHistory() { localStorage.setItem('zt_hist', JSON.stringify(rateHistory)); }

function renderHistory() {
  const wrap = document.getElementById('historyWrap');
  if (!wrap) return;
  if (!rateHistory.length) {
    wrap.innerHTML = `<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;
    return;
  }
  wrap.innerHTML = rateHistory.map(h => {
    const agentName = _agents.find(a => a.id === h.agent)?.name || `Agent ${h.agent}`;
    const savedCount = Number.isFinite(Number(h.saved)) ? Number(h.saved) : null;
    const countValue = (h.status === 'ok' && savedCount !== null) ? savedCount : (h.rows || 0);
    const countLabel = (h.status === 'ok' && savedCount !== null) ? 'saved' : 'entries';
    const statusText = h.status === 'ok'
      ? `Saved ${savedCount ?? countValue}`
      : h.status === 'err'
        ? 'Failed'
        : 'Processing';
    const statusClass = h.status === 'ok'
      ? 'text-emerald-600'
      : h.status === 'err'
        ? 'text-red-500'
        : 'text-amber-600';
    return `<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${agentName.split(' ')[0].slice(0, 3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${agentName}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${h.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${countValue}</div><div class="text-[10px] font-bold uppercase text-text-muted">${countLabel}</div></div>
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full ${h.status === 'ok' ? 'bg-green-500' : h.status === 'err' ? 'bg-red-500' : 'bg-yellow-400'}"></div>
        <div class="text-[10px] font-bold uppercase tracking-[0.08em] ${statusClass}">${statusText}</div>
      </div>
    </div>`;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════════════════
// E-TICKET GENERATOR
// ══════════════════════════════════════════════════════════════════════════════

const ETICKET_A4_WIDTH_PX = (210 / 25.4) * 96;
const ETICKET_A4_HEIGHT_PX = (297 / 25.4) * 96;

function applyETicketPrintFit() {
  const wrapper = document.getElementById('eticket-output-wrapper');
  const printArea = document.getElementById('eticket-print-area');
  if (!wrapper || !printArea) return;
  if (wrapper.classList.contains('hidden')) return;

  // Reset first so measurements are based on the full preview size.
  printArea.style.zoom = '1';
  printArea.style.removeProperty('--eticket-print-scale');

  const contentWidth = Math.max(printArea.scrollWidth, printArea.offsetWidth);
  const contentHeight = Math.max(printArea.scrollHeight, printArea.offsetHeight);
  if (!contentWidth || !contentHeight) return;

  const widthScale = ETICKET_A4_WIDTH_PX / contentWidth;
  const heightScale = ETICKET_A4_HEIGHT_PX / contentHeight;
  let scale = Math.min(1, widthScale, heightScale);
  if (scale < 1) scale = Math.max(0.7, scale * 0.985);

  printArea.style.zoom = String(scale);
  printArea.style.setProperty('--eticket-print-scale', String(scale));
}

function resetETicketPrintFit() {
  const printArea = document.getElementById('eticket-print-area');
  if (!printArea) return;
  printArea.style.zoom = '1';
  printArea.style.removeProperty('--eticket-print-scale');
}

async function downloadETicketPDF() {
  const wrapper = document.getElementById('eticket-output-wrapper');
  const printArea = document.getElementById('eticket-print-area');
  if (!wrapper || !printArea) return;
  if (wrapper.classList.contains('hidden')) {
    toast('info', 'No Preview Yet', 'Generate an e-ticket first, then download the PDF.');
    return;
  }

  const btn = document.getElementById('et-download-btn');
  if (btn) btn.disabled = true;

  try {
    resetETicketPrintFit();

    if (typeof html2canvas !== 'function') {
      throw new Error('html2canvas library not loaded.');
    }

    toast('info', 'Generating PDF', 'Please wait while we render your ticket...');

    await Promise.all(
      Array.from(printArea.querySelectorAll('img')).map(img =>
        img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
      )
    );

    const canvas = await html2canvas(printArea, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (doc) => {
        injectCanvasSafeStyles(doc, '#eticket-print-area');
        sanitizeUnsupportedColorFunctions(doc.body);
        const target = printArea.id ? doc.getElementById(printArea.id) : null;
        if (target) {
          sanitizeUnsupportedColorFunctions(target);
          inlineColorsForCanvas(target);
          const statusPill = target.querySelector('#t-status-pill');
          if (statusPill) {
            statusPill.style.backgroundColor = '#d1fae5';
            statusPill.style.color = '#047857';
            statusPill.style.borderColor = '#a7f3d0';
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF)
      || window.jsPDF
      || window.jspdf;
    if (!jsPDFCtor) throw new Error('jsPDF library not loaded.');

    const pdf = new jsPDFCtor({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth
      ? pdf.internal.pageSize.getWidth()
      : pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.getHeight
      ? pdf.internal.pageSize.getHeight()
      : pdf.internal.pageSize.height;

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height / canvas.width) * imgWidth;
    let x = 0;
    let y = 0;

    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      imgWidth *= scale;
      imgHeight *= scale;
      x = (pageWidth - imgWidth) / 2;
      y = 0;
    } else {
      y = (pageHeight - imgHeight) / 2;
    }

    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

    const fileSafe = (s) =>
      String(s || '')
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    const pnrText = document.getElementById('t-pnr')?.textContent || 'ticket';
    const ts = Date.now();
    const fileName = `zamra-eticket-${fileSafe(pnrText) || 'ticket'}-${ts}.pdf`;

    pdf.save(fileName);
    toast('success', 'Downloaded!', 'E-ticket PDF saved successfully.');
  } catch (err) {
    console.error('E-ticket PDF export failed:', err);
    toast('error', 'Download Failed', err?.message || 'Unable to generate the PDF. Try Print / Save as PDF.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function renderETicketTab() {
  const tab = document.getElementById('eticket-tab');
  if (!tab) return;

  const form = document.getElementById('eticket-form');
  const addPaxBtn = document.getElementById('et-add-passenger');
  const paxContainer = document.getElementById('et-passengers-container');
  const airlineSelect = document.getElementById('et-airline');
  const originSelect = document.getElementById('et-origin');
  const destinationSelect = document.getElementById('et-destination');

  // Ensure data is loaded
  if (_airlines.length === 0) _airlines = await getAirlines();
  if (_sectors.length === 0) _sectors = normalizeSectors(await getSectors());

  // Prevent double-binding by checking dataset.wired
  if (!tab.dataset.wired) {
    tab.dataset.wired = '1';

    // Populate dropdowns with current global data
    if (airlineSelect && _airlines) {
      airlineSelect.innerHTML = '<option value="">Select Airline</option>' +
        _airlines.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
    }

    if (originSelect && _sectors) {
      const uniqueOrigins = [...new Set(_sectors.map(s => s.sectorFrom).filter(Boolean))].sort();
      originSelect.innerHTML = '<option value="">Select Origin</option>' +
        uniqueOrigins.map(o => `<option value="${o}">${o}</option>`).join('');
    }

    if (destinationSelect && _sectors) {
      const uniqueDests = [...new Set(_sectors.map(s => s.sectorTo).filter(Boolean))].sort();
      destinationSelect.innerHTML = '<option value="">Select Destination</option>' +
        uniqueDests.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    const syncPassengerRows = () => {
      const rows = Array.from(paxContainer.querySelectorAll('.et-pax-row'));
      rows.forEach((row, index) => {
        const title = row.querySelector('.et-passenger-index');
        if (title) title.textContent = `Passenger ${index + 1}`;

        const removeBtn = row.querySelector('.et-remove-passenger');
        if (!removeBtn) return;
        if (rows.length <= 1) {
          removeBtn.classList.add('opacity-40', 'pointer-events-none');
          removeBtn.setAttribute('aria-disabled', 'true');
        } else {
          removeBtn.classList.remove('opacity-40', 'pointer-events-none');
          removeBtn.removeAttribute('aria-disabled');
        }
      });
    };

    // Add Passenger Row Logic
    addPaxBtn?.addEventListener('click', () => {
      const rowHtml = `
        <div class="et-pax-row relative rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <div class="flex items-center justify-between mb-3 pr-8">
            <p class="et-passenger-index text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Passenger</p>
          </div>
          <button type="button" class="et-remove-passenger absolute top-3 right-3 w-7 h-7 rounded-full border border-red-200 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-colors" title="Remove passenger" aria-label="Remove passenger">
            <i class="bi bi-x-lg text-[11px]"></i>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Title</label>
              <select name="paxTitle[]" class="admin-control h-10">
                <option value="MR">MR</option>
                <option value="MRS">MRS</option>
                <option value="MS">MS</option>
                <option value="MSTR">MSTR</option>
                <option value="MISS">MISS</option>
              </select>
            </div>

            <div class="md:col-span-4">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Passenger Name *</label>
              <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="admin-control h-10 uppercase placeholder:normal-case">
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Category</label>
              <select name="paxType[]" class="admin-control h-10">
                <option value="ADT">Adult</option>
                <option value="CHD">Child</option>
                <option value="INF">Infant</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Cabin Bag</label>
              <select name="paxCarryBag[]" class="admin-control h-10">
                ${buildKgOptionsHtml(ETICKET_CABIN_BAG_OPTIONS, 7)}
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-[11px] font-semibold text-text-muted mb-1 uppercase tracking-[0.08em]">Check-in Bag</label>
              <select name="paxCheckBag[]" class="admin-control h-10">
                ${buildKgOptionsHtml(ETICKET_CHECKIN_BAG_OPTIONS, 30)}
              </select>
            </div>
          </div>
        </div>
      `;
      paxContainer.insertAdjacentHTML('beforeend', rowHtml);
      syncPassengerRows();
    });

    paxContainer?.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('.et-remove-passenger');
      if (!removeBtn) return;
      removeBtn.closest('.et-pax-row')?.remove();
      syncPassengerRows();
    });

    // Add first row default
    if (paxContainer.children.length === 0) {
      addPaxBtn?.click();
    }
    syncPassengerRows();

    // Form submission wrapper to build and show the preview
    // Note: Use 'submit' event to leverage native form validation
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await generateETicket(new FormData(form));
    });

    // Wire Print Ticket Button (inside preview action bar)
    document.getElementById('et-print-btn')?.addEventListener('click', () => {
      applyETicketPrintFit();
      requestAnimationFrame(() => window.print());
    });

    // Wire Download PDF Button
    document.getElementById('et-download-btn')?.addEventListener('click', () => {
      downloadETicketPDF();
    });

    window.addEventListener('beforeprint', applyETicketPrintFit);
    window.addEventListener('afterprint', resetETicketPrintFit);

    // Wire Reset form button
    form?.addEventListener('reset', () => {
      // Small timeout allows native reset to happen, then we clean up passenger rows
      setTimeout(() => {
        // Keep only first passenger row
        Array.from(paxContainer.children).forEach((child, index) => {
          if (index > 0) child.remove();
        });
        if (paxContainer.children.length === 0) addPaxBtn?.click();
        syncPassengerRows();
        document.getElementById('eticket-output-wrapper')?.classList.add('hidden');
      }, 10);
      toast('info', 'Form Reset', 'The E-Ticket form has been cleared.');
    });
  }
}

async function generateETicket(formData) {
  const pnr = formData.get('etPnr')?.toUpperCase();
  const airline = formData.get('etAirline')?.toUpperCase();
  const flightNo = formData.get('etFlightNo')?.toUpperCase();
  const dateRaw = formData.get('etDate');
  const depTime = formData.get('etDepTime');
  const arrTime = formData.get('etArrTime');
  const phone = formData.get('etPhone');

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const parseTimeToMinutes = (value) => {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value || '');
    if (!match) return null;
    return (Number(match[1]) * 60) + Number(match[2]);
  };

  const cityToCode = (city = '') => {
    const letters = city.replace(/[^A-Za-z]/g, '').toUpperCase();
    return letters.slice(0, 3) || '---';
  };

  // Parse origin and destination into array to split city and airport code if formatted like "Kozhikode (CCJ)"
  const parseLoc = (val) => {
    const raw = (val || '').trim();
    let city = raw;
    let code = '';
    const match = raw.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      city = match[1].trim();
      code = match[2].trim();
    }
    return { city, code };
  };

  const origin = parseLoc(formData.get('etOrigin'));
  const dest = parseLoc(formData.get('etDest'));
  const fullOrg = formData.get('etOrigin') || '—';
  const fullDst = formData.get('etDest') || '—';

  // Format date to "SAT, 03 MAY 2025"
  let formattedDate = '—';
  if (dateRaw) {
    const d = new Date(dateRaw);
    if (!isNaN(d.getTime())) {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      formattedDate = `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  const el = (id) => document.getElementById(id);

  // Find codes if not present in dropdown value
  let originCode = origin.code;
  let destCode = dest.code;
  let matchedSector = null;

  if (typeof _sectors !== 'undefined') {
    matchedSector = _sectors.find(s => s.sectorFrom === fullOrg && s.sectorTo === fullDst);
    if (!matchedSector && fullOrg) {
      const match = _sectors.find(s => s.sectorFrom === fullOrg);
      if (match && match.sectorCode) originCode = match.sectorCode.split(/[ -]+/)[0];
    }
    if (!matchedSector && fullDst) {
      const match = _sectors.find(s => s.sectorTo === fullDst);
      if (match && match.sectorCode) destCode = match.sectorCode.split(/[ -]+/).pop();
    }
  }

  const resolvedOriginCode = (originCode || cityToCode(origin.city)).toUpperCase();
  const resolvedDestCode = (destCode || cityToCode(dest.city)).toUpperCase();
  const routeCode = `${resolvedOriginCode} - ${resolvedDestCode}`;
  const routeLong = `${(origin.city || fullOrg || 'ORIGIN').toUpperCase()} to ${(dest.city || fullDst || 'DESTINATION').toUpperCase()}`;
  const originDisplay = (origin.city || fullOrg || '—').toUpperCase();
  const destDisplay = (dest.city || fullDst || '—').toUpperCase();

  const depMinutes = parseTimeToMinutes(depTime);
  const arrMinutes = parseTimeToMinutes(arrTime);
  let durationText = 'N/A';
  if (depMinutes !== null && arrMinutes !== null) {
    let diff = arrMinutes - depMinutes;
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    durationText = `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }

  if (el('t-pnr')) el('t-pnr').textContent = pnr || '—';
  if (el('t-issued-by')) el('t-issued-by').textContent = airline || '—';
  if (el('t-customer-phone')) el('t-customer-phone').textContent = phone || '—';
  if (el('t-flight-code')) el('t-flight-code').textContent = flightNo || '—';
  if (el('t-travel-date')) el('t-travel-date').textContent = formattedDate || '—';
  if (el('t-route-code')) el('t-route-code').textContent = routeCode;
  if (el('t-route-long')) el('t-route-long').textContent = routeLong;
  // duration text was removed, we use t-top-pax-count below

  // Booked on - today
  const today = new Date();
  const dmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const bookedOnText = `${String(today.getDate()).padStart(2, '0')} ${dmonths[today.getMonth()]} ${today.getFullYear()} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
  if (el('t-booked-on')) el('t-booked-on').textContent = bookedOnText;

  // Set airline logo (requires looking up _airlines array)
  const logoEl = el('t-airline-logo');
  const logoFallbackEl = el('t-issued-by-fallback');
  if (logoEl) {
    const matchedAirline = typeof _airlines !== 'undefined' ? _airlines.find(a => a.name.toUpperCase() === airline) : null;
    if (matchedAirline && matchedAirline.logoUrl) {
      logoEl.src = matchedAirline.logoUrl;
      logoEl.classList.remove('hidden');
      if (logoFallbackEl) logoFallbackEl.classList.add('hidden');
    } else {
      logoEl.removeAttribute('src');
      logoEl.classList.add('hidden');
      if (logoFallbackEl) {
        logoFallbackEl.classList.remove('hidden');
        logoFallbackEl.textContent = (airline || 'No logo').toUpperCase();
      }
    }
  }

  // Extract passenger arrays
  const paxTitles = formData.getAll('paxTitle[]');
  const paxNames = formData.getAll('paxName[]');
  const paxTypes = formData.getAll('paxType[]');
  const paxCheckBag = formData.getAll('paxCheckBag[]');
  const paxCarryBag = formData.getAll('paxCarryBag[]');
  if (el('t-pax-count')) el('t-pax-count').textContent = String(paxNames.length);
  if (el('t-top-pax-count')) el('t-top-pax-count').textContent = String(paxNames.length);

  const paxTbody = document.getElementById('t-passengers-tbody');
  if (paxTbody) {
    const rowHtml = paxNames.map((_, i) => {
      const title = escapeHtml((paxTitles[i] || 'MR').toUpperCase());
      const name = escapeHtml((paxNames[i] || '').toUpperCase());
      const type = escapeHtml((paxTypes[i] || 'ADT').toUpperCase());
      const checkBag = escapeHtml(toKgDisplay(paxCheckBag[i]));
      const carryBag = escapeHtml(toKgDisplay(paxCarryBag[i]));
      const segment = matchedSector && matchedSector.sectorCode
        ? escapeHtml(matchedSector.sectorCode.toUpperCase())
        : escapeHtml(routeCode);
      const rowShade = i % 2 === 0 ? 'bg-white' : 'bg-slate-50/80';

      return `
        <tr class="${rowShade} text-slate-800">
          <td class="p-2.5 border-t border-slate-200 align-top font-semibold">${i + 1}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${title}. ${name}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${type}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${segment}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${escapeHtml(flightNo || '—')}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top font-semibold">${escapeHtml(pnr || '—')}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${carryBag}</td>
          <td class="p-2.5 border-l border-t border-slate-200 align-top">${checkBag}</td>
        </tr>
      `;
    }).join('');

    paxTbody.innerHTML = rowHtml || `
      <tr>
        <td colspan="8" class="p-3 text-center text-slate-500 border-t border-slate-200">No passengers found.</td>
      </tr>
    `;
  }

  // Travel Details Row
  const travelTbody = document.getElementById('t-travel-tbody');
  if (travelTbody) {
    travelTbody.innerHTML = `
      <tr class="text-slate-800">
        <td class="p-2.5 border-t border-slate-200 align-top">
          <div class="font-semibold">${escapeHtml(flightNo || '—')}</div>
          <div class="text-[10px] text-slate-500 mt-1">Economy | Non-Refundable</div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${escapeHtml(originDisplay)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${escapeHtml(resolvedOriginCode)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${escapeHtml(depTime || '—')}</span> <span class="text-slate-500 ml-1 text-[11px]">${escapeHtml(formattedDate || '—')}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-top">
          <div class="font-semibold uppercase">${escapeHtml(destDisplay)}</div>
          <div class="text-[10px] text-slate-500 uppercase">${escapeHtml(resolvedDestCode)}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${escapeHtml(arrTime || '—')}</span> <span class="text-slate-500 ml-1 text-[11px]">${escapeHtml(formattedDate || '—')}</span></div>
        </td>
        <td class="p-2.5 border-l border-t border-slate-200 align-middle text-center">
          <span id="t-status-pill" class="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-1">Confirmed</span>
        </td>
      </tr>
    `;
  }

  // Show the preview wrapper
  const wrapper = document.getElementById('eticket-output-wrapper');
  if (wrapper) {
    wrapper.classList.remove('hidden');
    wrapper.scrollIntoView({ behavior: 'smooth' });
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
const TICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  info: `<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
};

function toast(type, title, msg) {
  const tEl = document.getElementById('toastsEl');
  if (!tEl) return;
  const el = document.createElement('div');
  const styles = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/95 text-rose-900',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-900',
    info: 'border-blue-200 bg-blue-50/95 text-blue-900'
  };
  el.className = `flex items-start gap-3 p-4 border rounded-xl shadow-md w-80 pointer-events-auto backdrop-blur-sm ${styles[type] || styles.error}`;
  el.innerHTML = `<div class="mt-0.5">${TICONS[type] || TICONS.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${title}</div><div class="text-xs opacity-90 mt-1">${msg}</div></div>
    <button class="opacity-50 hover:opacity-100 transition-opacity" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`;
  tEl.appendChild(el);
  setTimeout(() => el.isConnected && el.remove(), 7000);
}

// Ensure the toast function is globally available for video-export.js and other external modules
window.toast = toast;

// ── Rebuild chips when the sheets tab becomes active ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Chips built after auth resolves in the onAuthChange handler above
});

// ══════════════════════════════════════════════════════════════════════════════
// VISAS TAB — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
async function renderVisasTab(fetchData = true) {
  if (fetchData) {
    try {
      const [v, vs, att, ps] = await Promise.all([
        getVisas(),
        getVisaStampings(),
        getAttestations(),
        getPassportServices()
      ]);
      _visas = v;
      _visaStampings = vs;
      _attestations = att;
      _passportServices = ps;

      tablePage.visas = 1;
      tablePage.visaStampings = 1;
      tablePage.attestations = 1;
      tablePage.passportServices = 1;
    } catch (e) {
      toast('error', 'Error loading Visas tab data', e.message);
    }
  }

  // 1. Render Tourist Visas
  const tbodyVisas = document.querySelector('#visas-tab #visas-table-body');
  if (tbodyVisas) {
    const sorted = applySortAndFilter(_visas, 'visas');
    const limit = tableLimit.visas;
    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    if (tablePage.visas > totalPages) tablePage.visas = totalPages;
    const start = (tablePage.visas - 1) * limit;
    const pageData = sorted.slice(start, start + limit);

    tbodyVisas.innerHTML = pageData.length
      ? pageData.map(v => visaRow(v)).join('')
      : `<tr><td colspan="5" class="text-center py-8 text-text-muted">No tourist visas yet. Click "Add Tourist Visa".</td></tr>`;
    wireVisaActions();
  }

  // 2. Render Visa Stamping
  const tbodyStamping = document.querySelector('#visa-stamping-table-body');
  if (tbodyStamping) {
    const sorted = applySortAndFilter(_visaStampings, 'visaStampings');
    const limit = tableLimit.visaStampings;
    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    if (tablePage.visaStampings > totalPages) tablePage.visaStampings = totalPages;
    const start = (tablePage.visaStampings - 1) * limit;
    const pageData = sorted.slice(start, start + limit);

    tbodyStamping.innerHTML = pageData.length
      ? pageData.map(v => visaStampingRow(v)).join('')
      : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No visa stampings yet. Click "Add Visa Stamping".</td></tr>`;
    wireVisaStampingActions();
  }

  // 3. Render Attestations
  const tbodyAtt = document.querySelector('#attestations-table-body');
  if (tbodyAtt) {
    const sorted = applySortAndFilter(_attestations, 'attestations');
    const limit = tableLimit.attestations;
    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    if (tablePage.attestations > totalPages) tablePage.attestations = totalPages;
    const start = (tablePage.attestations - 1) * limit;
    const pageData = sorted.slice(start, start + limit);

    tbodyAtt.innerHTML = pageData.length
      ? pageData.map(v => attestationRow(v)).join('')
      : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No attestations yet. Click "Add Attestation".</td></tr>`;
    wireAttestationActions();
  }

  // 4. Render Passport Services
  const tbodyPass = document.querySelector('#passport-services-table-body');
  if (tbodyPass) {
    const sorted = applySortAndFilter(_passportServices, 'passportServices');
    const limit = tableLimit.passportServices;
    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
    if (tablePage.passportServices > totalPages) tablePage.passportServices = totalPages;
    const start = (tablePage.passportServices - 1) * limit;
    const pageData = sorted.slice(start, start + limit);

    tbodyPass.innerHTML = pageData.length
      ? pageData.map(v => passportServiceRow(v)).join('')
      : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No passport services yet. Click "Add Passport Service".</td></tr>`;
    wirePassportServiceActions();
  }

  // Add wiring for the static add buttons
  wireVisasAddButtons();
}

function wireVisasAddButtons() {
  const btnVisa = document.getElementById('visas-add-btn');
  if (btnVisa && !btnVisa.dataset.wired) {
    btnVisa.dataset.wired = '1';
    btnVisa.addEventListener('click', () => openVisaModal(null));
  }

  const btnStamping = document.getElementById('visa-stamping-add-btn');
  if (btnStamping && !btnStamping.dataset.wired) {
    btnStamping.dataset.wired = '1';
    btnStamping.addEventListener('click', () => openVisaStampingModal(null));
  }

  const btnAttestation = document.getElementById('attestation-add-btn');
  if (btnAttestation && !btnAttestation.dataset.wired) {
    btnAttestation.dataset.wired = '1';
    btnAttestation.addEventListener('click', () => openAttestationModal(null));
  }

  const btnPassport = document.getElementById('passport-service-add-btn');
  if (btnPassport && !btnPassport.dataset.wired) {
    btnPassport.dataset.wired = '1';
    btnPassport.addEventListener('click', () => openPassportServiceModal(null));
  }
}

function visaRow(v) {
  const flag = v.flagUrl
    ? `<span class="admin-logo-wrap"><img src="${v.flagUrl}" alt="${escapeHtml(v.countryName || 'Country')}"></span>`
    : `<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-flag"></i></span></span>`;
  return `<tr data-visa-id="${v.id}">
    <td class="w-16">${flag}</td>
    <td class="font-bold text-navy">${escapeHtml(v.countryName)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(v.visaType)}</td>
    <td class="font-black text-[15px] text-navy">₹${(v.rate || 0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa" data-id="${v.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa" data-id="${v.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireVisaActions() {
  const tbody = document.querySelector('#visas-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const visa = _visas.find(v => v.id === id);

    if (action === 'edit-visa') openVisaModal(visa);
    if (action === 'delete-visa') {
      if (!confirm(`Delete visa for "${visa?.countryName}"?`)) return;
      try {
        await deleteVisa(id);
        toast('success', 'Deleted', `Visa for "${visa?.countryName}" removed.`);
        await renderVisasTab();
      }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openVisaModal(visa) {
  const tpl = document.getElementById('modal-visa-form');
  if (!tpl) return;

  openModal(visa ? 'Edit Visa' : 'Add New Visa', tpl.innerHTML);

  // Re-fetch elements from the newly cloned form in the modal!
  const modalForm = document.getElementById('visa-form');
  const idInput = document.getElementById('visa-id');
  const countryInput = document.getElementById('visa-country');
  const typeInput = document.getElementById('visa-type');
  const rateInput = document.getElementById('visa-rate');

  if (visa) {
    idInput.value = visa.id;
    countryInput.value = visa.countryName || '';
    typeInput.value = visa.visaType || '';
    rateInput.value = visa.rate || 0;
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const vId = idInput.value;
      const data = {
        countryName: countryInput.value.trim(),
        visaType: typeInput.value.trim(),
        rate: Number(rateInput.value),
      };

      const fileInput = document.getElementById('visa-flag');
      const file = fileInput.files[0];

      if (vId) await updateVisa(vId, data, file);
      else await addVisa(data, file);

      toast('success', 'Saved!', `Visa for ${data.countryName} saved.`);
      document.getElementById('admin-modal').close();
      await renderVisasTab();
    } catch (err) {
      toast('error', 'Error', err.message);
      btn.disabled = false;
      btn.textContent = 'Save Visa';
    }
  });
}

// --- Visa Stamping ---

function visaStampingRow(v) {
  return `<tr data-id="${v.id}">
    <td class="font-bold text-navy">${escapeHtml(v.country)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(v.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(v.cost || 0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-visa-stamping" data-id="${v.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-visa-stamping" data-id="${v.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireVisaStampingActions() {
  const tbody = document.getElementById('visa-stamping-table-body');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const item = _visaStampings.find(i => i.id === id);

    if (action === 'edit-visa-stamping') openVisaStampingModal(item);
    if (action === 'delete-visa-stamping') {
      if (!confirm(`Delete visa stamping for "${item?.country}"?`)) return;
      try {
        await deleteVisaStamping(id);
        toast('success', 'Deleted', `Visa Stamping for "${item?.country}" removed.`);
        await renderVisasTab(true);
      }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openVisaStampingModal(item) {
  const tpl = document.getElementById('modal-visa-stamping-form');
  if (!tpl) return;

  openModal(item ? 'Edit Visa Stamping' : 'Add Visa Stamping', tpl.innerHTML);

  const modalForm = document.getElementById('visa-stamping-form');
  const idInput = document.getElementById('visa-stamping-id');
  const countryInput = document.getElementById('visa-stamping-country');
  const descInput = document.getElementById('visa-stamping-desc');
  const costInput = document.getElementById('visa-stamping-cost');

  if (item) {
    idInput.value = item.id;
    countryInput.value = item.country || '';
    descInput.value = item.description || '';
    costInput.value = item.cost || 0;
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const vId = idInput.value;
      const data = {
        country: countryInput.value.trim(),
        description: descInput.value.trim(),
        cost: Number(costInput.value),
      };

      if (vId) await updateVisaStamping(vId, data);
      else await addVisaStamping(data);

      toast('success', 'Saved!', `Visa stamping for ${data.country} saved.`);
      document.getElementById('admin-modal').close();
      await renderVisasTab(true);
    } catch (err) {
      toast('error', 'Error', err.message);
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

// --- Attestations ---

function attestationRow(v) {
  return `<tr data-id="${v.id}">
    <td class="font-bold text-navy">${escapeHtml(v.country)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(v.certificate)}</td>
    <td class="font-black text-[15px] text-navy">₹${(v.cost || 0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-attestation" data-id="${v.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-attestation" data-id="${v.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireAttestationActions() {
  const tbody = document.getElementById('attestations-table-body');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const item = _attestations.find(i => i.id === id);

    if (action === 'edit-attestation') openAttestationModal(item);
    if (action === 'delete-attestation') {
      if (!confirm(`Delete attestation for "${item?.country}"?`)) return;
      try {
        await deleteAttestation(id);
        toast('success', 'Deleted', `Attestation for "${item?.country}" removed.`);
        await renderVisasTab(true);
      }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openAttestationModal(item) {
  const tpl = document.getElementById('modal-attestation-form');
  if (!tpl) return;

  openModal(item ? 'Edit Attestation' : 'Add Attestation', tpl.innerHTML);

  const modalForm = document.getElementById('attestation-form');
  const idInput = document.getElementById('attestation-id');
  const countryInput = document.getElementById('attestation-country');
  const certInput = document.getElementById('attestation-cert');
  const costInput = document.getElementById('attestation-cost');

  if (item) {
    idInput.value = item.id;
    countryInput.value = item.country || '';
    certInput.value = item.certificate || '';
    costInput.value = item.cost || 0;
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const vId = idInput.value;
      const data = {
        country: countryInput.value.trim(),
        certificate: certInput.value.trim(),
        cost: Number(costInput.value),
      };

      if (vId) await updateAttestation(vId, data);
      else await addAttestation(data);

      toast('success', 'Saved!', `Attestation for ${data.country} saved.`);
      document.getElementById('admin-modal').close();
      await renderVisasTab(true);
    } catch (err) {
      toast('error', 'Error', err.message);
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

// --- Passport Services ---

function passportServiceRow(v) {
  return `<tr data-id="${v.id}">
    <td class="font-bold text-navy">${escapeHtml(v.type)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(v.description)}</td>
    <td class="font-black text-[15px] text-navy">₹${(v.cost || 0).toLocaleString()}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-passport-service" data-id="${v.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-passport-service" data-id="${v.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wirePassportServiceActions() {
  const tbody = document.getElementById('passport-services-table-body');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const item = _passportServices.find(i => i.id === id);

    if (action === 'edit-passport-service') openPassportServiceModal(item);
    if (action === 'delete-passport-service') {
      if (!confirm(`Delete passport service "${item?.type}"?`)) return;
      try {
        await deletePassportService(id);
        toast('success', 'Deleted', `Passport service "${item?.type}" removed.`);
        await renderVisasTab(true);
      }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openPassportServiceModal(item) {
  const tpl = document.getElementById('modal-passport-service-form');
  if (!tpl) return;

  openModal(item ? 'Edit Passport Service' : 'Add Passport Service', tpl.innerHTML);

  const modalForm = document.getElementById('passport-service-form');
  const idInput = document.getElementById('passport-service-id');
  const typeInput = document.getElementById('passport-service-type');
  const descInput = document.getElementById('passport-service-desc');
  const costInput = document.getElementById('passport-service-cost');

  if (item) {
    idInput.value = item.id;
    typeInput.value = item.type || '';
    descInput.value = item.description || '';
    costInput.value = item.cost || 0;
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = modalForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const vId = idInput.value;
      const data = {
        type: typeInput.value.trim(),
        description: descInput.value.trim(),
        cost: Number(costInput.value),
      };

      if (vId) await updatePassportService(vId, data);
      else await addPassportService(data);

      toast('success', 'Saved!', `Passport service ${data.type} saved.`);
      document.getElementById('admin-modal').close();
      await renderVisasTab(true);
    } catch (err) {
      toast('error', 'Error', err.message);
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// TOURS TAB
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Render the Tours admin tab. Fetches all tours (including inactive) from Firestore
 * and displays them in the admin table.
 * @param {boolean} fetchData — skip the Firestore round-trip when re-rendering after sort
 */
async function renderToursTab(fetchData = true) {
  if (fetchData) {
    try {
      _tours = await getTours({ includeInactive: true });
      tablePage.tours = 1;
    } catch (e) {
      toast('error', 'Error loading Tours', e.message);
    }
  }

  const tbody = document.getElementById('tours-table-body');
  if (!tbody) return;

  const sorted = applySortAndFilter(_tours, 'tours');
  const limit = tableLimit.tours;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.tours > totalPages) tablePage.tours = totalPages;
  const start = (tablePage.tours - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(t => tourRow(t)).join('')
    : `<tr><td colspan="7" class="text-center py-8 text-text-muted">No tour packages yet. Click "Add Tour Package".</td></tr>`;

  wireTourActions();
  wireToursAddButton();
}

function wireToursAddButton() {
  const btn = document.getElementById('tours-add-btn');
  if (btn && !btn.dataset.wired) {
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => openTourModal(null));
  }
}

function tourRow(t) {
  const img = t.coverImageUrl
    ? `<span class="admin-logo-wrap"><img src="${t.coverImageUrl}" alt="${escapeHtml(t.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`
    : `<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>`;

  const priceDisplay = (!t.price || t.price === 0)
    ? `<span class="text-text-muted text-[12px] italic">Call for Price</span>`
    : `<span class="font-black text-[15px] text-navy">₹${Number(t.price).toLocaleString()}</span>`;

  const statusBadge = t.isActive !== false
    ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>`
    : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>`;

  return `<tr data-tour-id="${t.id}">
    <td class="w-16">${img}</td>
    <td class="font-bold text-navy">${escapeHtml(t.title)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(t.category)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(t.duration)}</td>
    <td>${priceDisplay}</td>
    <td>${statusBadge}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-tour" data-id="${t.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-tour" data-id="${t.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireTourActions() {
  const tbody = document.getElementById('tours-table-body');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const tour = _tours.find(t => t.id === id);

    if (action === 'edit-tour') openTourModal(tour);
    if (action === 'delete-tour') {
      if (!confirm(`Delete tour package "${tour?.title}"?`)) return;
      try {
        await deleteTour(id);
        toast('success', 'Deleted', `Tour "${tour?.title}" removed.`);
        await renderToursTab();
      } catch (err) {
        toast('error', 'Error', err.message);
      }
    }
  });
}

/** Helpers to convert newline-separated text ↔ array */
function linesToArray(text = '') {
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}
function arrayToLines(arr = []) {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

function _tourItineraryDayHtml(index, dayLabel = '', activities = []) {
  const activityLines = activities.length ? activities.join('\n') : '';
  return `
    <div class="tour-day-row admin-form-section relative bg-white" data-day-index="${index}">
      <div class="flex items-center justify-between mb-3 pr-8">
        <span class="tour-day-number admin-label text-primary">Day ${index + 1}</span>
      </div>
      <button type="button" class="tour-remove-day absolute top-3 right-3 w-7 h-7 rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center" title="Remove day">
        <i class="bi bi-x-lg text-[11px]"></i>
      </button>
      <div class="grid grid-cols-1 gap-3">
        <div class="admin-field">
          <label class="admin-label">Day Label / Title *</label>
          <input type="text" class="tour-day-label admin-control" placeholder="e.g. Day 1 – Arrival" value="${escapeHtml(dayLabel)}" required>
        </div>
        <div class="admin-field">
          <label class="admin-label">Activities</label>
          <p class="admin-help">One activity per line.</p>
          <textarea class="tour-day-activities admin-control" rows="3" placeholder="Airport pickup&#10;Hotel check-in&#10;Welcome dinner">${escapeHtml(activityLines)}</textarea>
        </div>
      </div>
    </div>`;
}

function _syncTourDayNumbers(container) {
  const rows = container.querySelectorAll('.tour-day-row');
  rows.forEach((row, i) => {
    const numEl = row.querySelector('.tour-day-number');
    if (numEl) numEl.textContent = `Day ${i + 1}`;
    row.dataset.dayIndex = i;
    const removeBtn = row.querySelector('.tour-remove-day');
    if (removeBtn) {
      if (rows.length <= 1) {
        removeBtn.classList.add('opacity-40', 'pointer-events-none');
      } else {
        removeBtn.classList.remove('opacity-40', 'pointer-events-none');
      }
    }
  });
}

function _readTourItinerary(container) {
  const rows = container.querySelectorAll('.tour-day-row');
  return Array.from(rows).map(row => ({
    day: row.querySelector('.tour-day-label')?.value.trim() || '',
    activities: (row.querySelector('.tour-day-activities')?.value || '')
      .split('\n').map(l => l.trim()).filter(Boolean),
  })).filter(d => d.day);
}

function openTourModal(tour) {
  const tpl = document.getElementById('modal-tour-form');
  if (!tpl) return;

  openModal(tour ? 'Edit Tour Package' : 'Add Tour Package', tpl.innerHTML, true);

  const modalForm = document.getElementById('tour-form');
  const idInput = document.getElementById('tour-id');
  const titleInput = document.getElementById('tour-title');
  const catInput = document.getElementById('tour-category');
  const durInput = document.getElementById('tour-duration');
  const priceInput = document.getElementById('tour-price');
  const activeInput = document.getElementById('tour-active');
  const descInput = document.getElementById('tour-description');
  const hlInput = document.getElementById('tour-highlights');
  const inclInput = document.getElementById('tour-inclusions');
  const exclInput = document.getElementById('tour-exclusions');

  // Itinerary container + add-day button
  const itinContainer = document.getElementById('tour-itinerary-container');
  const addDayBtn = document.getElementById('tour-add-day-btn');

  // Helper: add a day card
  const addDayCard = (dayLabel = '', activities = []) => {
    const idx = itinContainer.querySelectorAll('.tour-day-row').length;
    itinContainer.insertAdjacentHTML('beforeend', _tourItineraryDayHtml(idx, dayLabel, activities));
    _syncTourDayNumbers(itinContainer);
  };

  // Wire "Add Day" button
  addDayBtn?.addEventListener('click', () => {
    addDayCard();
    // Scroll new card into view smoothly
    itinContainer.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Wire remove buttons via event delegation on the container
  itinContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.tour-remove-day');
    if (!removeBtn) return;
    removeBtn.closest('.tour-day-row')?.remove();
    _syncTourDayNumbers(itinContainer);
  });

  // Populate fields when editing
  if (tour) {
    idInput.value = tour.id;
    titleInput.value = tour.title || '';
    catInput.value = tour.category || 'International';
    durInput.value = tour.duration || '';
    priceInput.value = tour.price || 0;
    activeInput.checked = tour.isActive !== false;
    descInput.value = tour.description || '';
    hlInput.value = arrayToLines(tour.highlights);
    inclInput.value = arrayToLines(tour.inclusions);
    exclInput.value = arrayToLines(tour.exclusions);

    // Render existing itinerary days
    const itin = Array.isArray(tour.itinerary) ? tour.itinerary : [];
    itin.forEach(day => addDayCard(day.day || '', day.activities || []));
  }

  // If no days were added yet (new tour), add one blank day to get the admin started
  if (itinContainer.querySelectorAll('.tour-day-row').length === 0) {
    addDayCard();
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = modalForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    try {
      const tId = idInput.value;

      // Read itinerary from the dynamic UI
      const itinerary = _readTourItinerary(itinContainer);

      const data = {
        title: titleInput.value.trim(),
        category: catInput.value,
        duration: durInput.value.trim(),
        price: Number(priceInput.value) || 0,
        isActive: activeInput.checked,
        description: descInput.value.trim(),
        highlights: linesToArray(hlInput.value),
        itinerary,
        inclusions: linesToArray(inclInput.value),
        exclusions: linesToArray(exclInput.value),
      };

      const imageFile = document.getElementById('tour-image')?.files[0] || null;

      if (tId) await updateTour(tId, data, imageFile);
      else await addTour(data, imageFile);

      toast('success', 'Saved!', `Tour "${data.title}" saved.`);
      document.getElementById('admin-modal').close();
      await renderToursTab();
    } catch (err) {
      toast('error', 'Error', err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Tour';
    }
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Hajj & Umrah Tab
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Render the Hajj/Umrah admin tab. Fetches all packages (including inactive)
 * and displays them in the admin table.
 * @param {boolean} fetchData — skip the Firestore round-trip when re-rendering
 */
async function renderHajjUmrahTab(fetchData = true) {
  if (fetchData) {
    try {
      _hajjUmrahPackages = await getHajjUmrahPackages({ includeInactive: true });
      tablePage.hajjUmrah = 1;
    } catch (e) {
      toast('error', 'Error loading Hajj & Umrah', e.message);
    }
  }

  const tbody = document.getElementById('hajjumrah-table-body');
  if (!tbody) return;

  const sorted = applySortAndFilter(_hajjUmrahPackages, 'hajjUmrah');
  const limit = tableLimit.hajjUmrah;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.hajjUmrah > totalPages) tablePage.hajjUmrah = totalPages;
  const start = (tablePage.hajjUmrah - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(p => hajjUmrahRow(p)).join('')
    : `<tr><td colspan="10" class="text-center py-8 text-text-muted">No packages yet. Click "Add Package".</td></tr>`;

  wireHajjUmrahActions();
  wireHajjUmrahAddButton();
}

function wireHajjUmrahAddButton() {
  const btn = document.getElementById('hajjumrah-add-btn');
  if (btn && !btn.dataset.wired) {
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => openHajjUmrahModal(null));
  }
}

function hajjUmrahRow(p) {
  const img = p.coverImageUrl
    ? `<span class="admin-logo-wrap"><img src="${p.coverImageUrl}" alt="${escapeHtml(p.title)}" style="object-fit:cover;width:44px;height:36px;border-radius:6px;"></span>`
    : `<span class="admin-logo-wrap"><span class="admin-logo-fallback"><i class="bi bi-image"></i></span></span>`;

  const priceDisplay = (!p.price || p.price === 0)
    ? `<span class="text-text-muted text-[12px] italic">Call for Price</span>`
    : `<span class="font-black text-[15px] text-navy">₹${Number(p.price).toLocaleString()}</span>`;

  const statusBadge = p.isActive !== false
    ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold"><i class="bi bi-check-circle-fill text-[9px]"></i>Active</span>`
    : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold"><i class="bi bi-dash-circle text-[9px]"></i>Hidden</span>`;

  const typeBadge = p.type === 'Hajj'
    ? `<span class="px-2 py-0.5 rounded bg-blue-50 text-primary text-[11px] font-semibold">Hajj</span>`
    : `<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[11px] font-semibold">Umrah</span>`;

  return `<tr data-hajjumrah-id="${p.id}">
    <td class="w-16">${img}</td>
    <td class="font-bold text-navy truncate max-w-[150px]" title="${escapeHtml(p.title)}">${escapeHtml(p.title)}</td>
    <td>${typeBadge}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(p.departureCity)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(p.airline)}</td>
    <td class="text-text-muted text-[13px]">${escapeHtml(p.departureDate)}</td>
    <td class="text-navy font-medium text-[13px]">${p.days}D/${p.nights}N</td>
    <td>${priceDisplay}</td>
    <td>${statusBadge}</td>
    <td>
      <div class="flex justify-end gap-1.5 items-center">
        <button data-action="edit-hajjumrah" data-id="${p.id}" class="admin-action-btn admin-action-edit"><i class="bi bi-pencil-square"></i>Edit</button>
        <button data-action="delete-hajjumrah" data-id="${p.id}" class="admin-action-btn admin-action-delete"><i class="bi bi-trash3"></i>Delete</button>
      </div>
    </td>
  </tr>`;
}

function wireHajjUmrahActions() {
  const tbody = document.getElementById('hajjumrah-table-body');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const pkg = _hajjUmrahPackages.find(p => p.id === id);

    if (action === 'edit-hajjumrah') openHajjUmrahModal(pkg);
    if (action === 'delete-hajjumrah') {
      if (!confirm(`Delete package "${pkg?.title}"?`)) return;
      try {
        await deleteHajjUmrahPackage(id);
        toast('success', 'Deleted', `Package "${pkg?.title}" removed.`);
        await renderHajjUmrahTab();
      } catch (err) {
        toast('error', 'Error', err.message);
      }
    }
  });
}

function openHajjUmrahModal(pkg) {
  const tpl = document.getElementById('modal-hajjumrah-form');
  if (!tpl) return;

  openModal(pkg ? 'Edit Package' : 'Add Package', tpl.innerHTML, true);

  const modalForm = document.getElementById('hajjumrah-form');
  const idInput = document.getElementById('hajjumrah-id');
  const titleInput = document.getElementById('hajjumrah-title');
  const typeInput = document.getElementById('hajjumrah-type');
  const cityInput = document.getElementById('hajjumrah-city');
  const airlineInput = document.getElementById('hajjumrah-airline');
  const dateInput = document.getElementById('hajjumrah-date');
  const daysInput = document.getElementById('hajjumrah-days');
  const nightsInput = document.getElementById('hajjumrah-nights');
  const priceInput = document.getElementById('hajjumrah-price');
  const activeInput = document.getElementById('hajjumrah-active');
  const descInput = document.getElementById('hajjumrah-description');
  const hlInput = document.getElementById('hajjumrah-highlights');
  const inclInput = document.getElementById('hajjumrah-inclusions');

  if (pkg) {
    idInput.value = pkg.id;
    titleInput.value = pkg.title || '';
    typeInput.value = pkg.type || 'Umrah';
    cityInput.value = pkg.departureCity || '';
    airlineInput.value = pkg.airline || '';
    dateInput.value = pkg.departureDate || '';
    daysInput.value = pkg.days || 15;
    nightsInput.value = pkg.nights || 14;
    priceInput.value = pkg.price || 0;
    activeInput.checked = pkg.isActive !== false;
    descInput.value = pkg.description || '';
    hlInput.value = arrayToLines(pkg.highlights);
    inclInput.value = arrayToLines(pkg.inclusions);
  }

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = modalForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    try {
      const pId = idInput.value;

      const data = {
        title: titleInput.value.trim(),
        type: typeInput.value,
        departureCity: cityInput.value.trim(),
        airline: airlineInput.value.trim(),
        departureDate: dateInput.value.trim(),
        days: Number(daysInput.value) || 1,
        nights: Number(nightsInput.value) || 1,
        price: Number(priceInput.value) || 0,
        isActive: activeInput.checked,
        description: descInput.value.trim(),
        highlights: linesToArray(hlInput.value),
        inclusions: linesToArray(inclInput.value),
      };

      const imageFile = document.getElementById('hajjumrah-image')?.files[0] || null;

      if (pId) await updateHajjUmrahPackage(pId, data, imageFile);
      else await addHajjUmrahPackage(data, imageFile);

      toast('success', 'Saved!', `Package "${data.title}" saved.`);
      document.getElementById('admin-modal').close();
      await renderHajjUmrahTab();
    } catch (err) {
      toast('error', 'Error', err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Package';
    }
  });
}
