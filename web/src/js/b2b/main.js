/**
 * B2B agent portal (b2b.zamratravels.com).
 *
 * All fare data comes from the getB2BPortalContext / getB2BFares Cloud
 * Functions — prices are computed server-side per agent, and this page never
 * reads agent_fares from Firestore directly.
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../admin/firebase-config.js';
import { onAuthChange, logoutUser } from '../admin/auth.js';
import { getAirlines, getVisas, getVisaStampings, getAttestations } from '../admin/db.js';
import { splitFlightTimeRange } from '../web/flight-results.js';
import { resolveAirlineBrand, wireFlightResultLogos } from '../web/airline-brand.js';
import { buildFlightCardHtml } from '../web/flight-card.js';
import { initSiteChrome } from '../web/site-chrome.js';
import {
  formatCheckInBaggageText,
  formatHandBaggageText,
  formatBaggageAllowanceShort,
} from '../shared/airline-baggage.js';

const getB2BPortalContext = httpsCallable(functions, 'getB2BPortalContext');
const getB2BFares = httpsCallable(functions, 'getB2BFares');

let _context = null;        // { agent, whatsappNumber, defaultOrigin, sectors }
let _airlineMap = new Map();
let _cityByCode = new Map(); // IATA code → city name, for friendly select labels

// Last search kept in memory so sort/filter re-render without another callable.
let _results = { fares: [], sectorInfo: null, origin: '', dest: '' };
let _view = { sort: 'date-asc', airline: 'all' };

// Hide until the agent claim is verified to avoid flashing portal content.
document.documentElement.style.visibility = 'hidden';

onAuthChange(async (user) => {
  if (!user) {
    window.location.href = '/b2b-login';
    return;
  }
  const { claims } = await user.getIdTokenResult();
  if (!claims.agent) {
    window.location.href = claims.admin ? '/admin' : '/b2b-login';
    return;
  }
  document.documentElement.style.visibility = 'visible';
  await boot();
});

async function forceLogout(message) {
  try { await logoutUser(); } catch { /* redirect regardless */ }
  if (message) sessionStorage.setItem('b2bLogoutReason', message);
  window.location.href = '/b2b-login';
}

function isAgentBlockedError(err) {
  return err?.code === 'functions/permission-denied' || /AGENT_INACTIVE/.test(err?.message || '');
}

async function boot() {
  initSiteChrome({ enableSmoothScroll: false });
  renderServiceSkeletons();

  try {
    const [contextRes, airlines] = await Promise.all([
      getB2BPortalContext(),
      getAirlines().catch(() => []),
    ]);
    _context = contextRes.data;
    _airlineMap = new Map(airlines.map((airline) => [airline.id, airline]));
  } catch (err) {
    console.error('Portal boot failed:', err);
    if (isAgentBlockedError(err)) {
      await forceLogout('Your account is not active. Contact Zamra Travels.');
      return;
    }
    const list = document.getElementById('flightList');
    if (list) list.innerHTML = `<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Could not load your portal data. Please refresh or contact support.</div>`;
    return;
  }

  buildCityLookup();

  const nameEl = document.getElementById('b2b-agent-name');
  const agencyEl = document.getElementById('b2b-agency-name');
  const heroNameEl = document.getElementById('b2b-hero-agent');
  const routeCountEl = document.getElementById('b2b-route-count');
  const displayName = _context.agent?.name || _context.agent?.loginId || 'Agent';
  if (nameEl) nameEl.textContent = displayName;
  if (agencyEl) agencyEl.textContent = _context.agent?.agencyName || '';
  if (heroNameEl) heroNameEl.textContent = displayName;
  if (routeCountEl) {
    const n = (_context.sectors || []).length;
    routeCountEl.textContent = `${n} route${n === 1 ? '' : 's'} available`;
  }

  const waLink = document.getElementById('b2b-footer-whatsapp');
  if (waLink && _context.whatsappNumber) {
    waLink.href = `https://wa.me/${_context.whatsappNumber}`;
  }

  initRouteSelects();
  loadVisaServices();
}

// ── Route selects (built from the agent's allowed sectors only) ─────────────

/** Map IATA codes to city names so selects can read "Kozhikode (CCJ)". */
function buildCityLookup() {
  (_context?.sectors || []).forEach((s) => {
    if (s.originCode && s.sectorFrom) _cityByCode.set(s.originCode, s.sectorFrom);
    if (s.destCode && s.sectorTo) _cityByCode.set(s.destCode, s.sectorTo);
  });
}

/** "CCJ" → "Kozhikode (CCJ)", falling back to the bare code when unnamed. */
function routeLabel(code) {
  const city = _cityByCode.get(code);
  return city ? `${city} (${code})` : code;
}

function allowedOrigins() {
  return [...new Set((_context?.sectors || []).map(s => s.originCode).filter(Boolean))];
}

function destinationsFor(originCode) {
  return [...new Set((_context?.sectors || [])
    .filter(s => s.originCode === originCode)
    .map(s => s.destCode)
    .filter(Boolean))];
}

function fillSelect(select, codes, preferred) {
  select.innerHTML = codes
    .map(code => `<option value="${escHtml(code)}">${escHtml(routeLabel(code))}</option>`)
    .join('');
  if (preferred && codes.includes(preferred)) select.value = preferred;
}

function initRouteSelects() {
  const originSel = document.getElementById('origin');
  const destSel = document.getElementById('destination');
  const searchBtn = document.getElementById('live-search-btn');
  if (!originSel || !destSel) return;

  const origins = allowedOrigins();
  if (!origins.length) {
    const list = document.getElementById('flightList');
    if (list) list.innerHTML = `<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No routes are currently assigned to your account. Contact Zamra Travels.</div>`;
    if (searchBtn) searchBtn.disabled = true;
    return;
  }

  // A shared/bookmarked ?from=&to= wins over the default, when still permitted.
  const params = new URLSearchParams(window.location.search);
  const wantFrom = (params.get('from') || '').toUpperCase();
  const wantTo = (params.get('to') || '').toUpperCase();
  const deepLinked = origins.includes(wantFrom) && destinationsFor(wantFrom).includes(wantTo);

  fillSelect(originSel, origins, deepLinked ? wantFrom : _context.defaultOrigin);
  fillSelect(destSel, destinationsFor(originSel.value), deepLinked ? wantTo : undefined);

  originSel.addEventListener('change', () => {
    fillSelect(destSel, destinationsFor(originSel.value));
  });

  const swap = () => {
    const o = originSel.value;
    const d = destSel.value;
    if (!allowedOrigins().includes(d)) return;
    originSel.value = d;
    fillSelect(destSel, destinationsFor(d), o);
  };
  document.getElementById('swap-locations')?.addEventListener('click', swap);
  document.getElementById('swap-locations-mobile')?.addEventListener('click', swap);

  searchBtn?.addEventListener('click', () => searchFlights());

  if (deepLinked) {
    searchFlights();
  } else {
    renderSearchPrompt();
  }
}

// ── Flight search ────────────────────────────────────────────────────────────

/** "09:45" → 585, for sorting. Unparseable times sink to the bottom. */
function timeToMinutes(value) {
  const match = String(value || '').match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]) * 60 + Number(match[2]);
}

function fareDepartureMinutes(fare) {
  return timeToMinutes(splitFlightTimeRange(fare.flightTime).departure);
}

/**
 * Fares are shown rounded to the nearest ₹100 so agents never quote an odd
 * number like ₹21,501. Sorting uses the same rounded value, otherwise two
 * cards displaying the same price could sit in an apparently random order.
 */
function roundFare(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num / 100) * 100;
}

function renderSearchPrompt() {
  const list = document.getElementById('flightList');
  if (!list) return;
  setControlsVisible(false);
  list.innerHTML = `
    <div class="text-center px-6 py-12 max-sm:py-10 rounded-[24px] border-2 border-dashed border-border bg-white/60">
      <div class="w-[56px] h-[56px] mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-[26px] mb-4">
        <i class="bi bi-airplane-engines"></i>
      </div>
      <p class="text-[17px] font-heading font-bold text-navy">Pick a route to see your fares</p>
      <p class="text-[14px] text-text-muted font-medium mt-1.5 max-w-[420px] mx-auto">
        Choose a departure and destination above, then hit Search. Prices shown are your agent rates.
      </p>
    </div>`;
}

function setControlsVisible(visible) {
  const bar = document.getElementById('b2b-results-controls');
  if (bar) bar.hidden = !visible;
}

async function searchFlights() {
  const origin = document.getElementById('origin').value;
  const dest = document.getElementById('destination').value;
  const list = document.getElementById('flightList');
  const loader = document.getElementById('loading');
  const header = document.getElementById('resultsHeader');
  const origName = document.getElementById('origName');
  const locName = document.getElementById('locName');

  list.innerHTML = '';
  loader.style.display = 'block';
  header.style.display = 'none';
  setControlsVisible(false);

  // Keep the URL shareable — the server still authorises every sector itself.
  const url = new URL(window.location.href);
  url.searchParams.set('from', origin);
  url.searchParams.set('to', dest);
  window.history.replaceState({}, '', url);

  try {
    const sector = (_context?.sectors || []).find(s => s.originCode === origin && s.destCode === dest);

    let fares = [];
    let sectorInfo = null;
    if (sector) {
      const res = await getB2BFares({ sectorId: sector.id });
      fares = res.data?.fares || [];
      sectorInfo = res.data?.sector || sector;
    }

    loader.style.display = 'none';
    header.style.display = 'block';
    if (origName) origName.innerText = origin;
    if (locName) locName.innerText = dest;

    if (!fares.length) {
      list.innerHTML = `
        <div class="text-center px-6 py-12 max-sm:py-10 rounded-[24px] border-2 border-dashed border-border bg-[#f8fafc]">
          <div class="w-[56px] h-[56px] mx-auto rounded-2xl bg-slate-200/70 text-slate-500 flex items-center justify-center text-[26px] mb-4">
            <i class="bi bi-calendar-x"></i>
          </div>
          <p class="text-[17px] font-heading font-bold text-navy">No fares loaded for ${escHtml(origin)} → ${escHtml(dest)}</p>
          <p class="text-[14px] text-text-muted font-medium mt-1.5 max-w-[420px] mx-auto">
            Try another route, or message us on WhatsApp and we will quote it for you.
          </p>
        </div>`;
      return;
    }

    _results = { fares, sectorInfo: sectorInfo || sector, origin, dest };
    _view.airline = 'all';
    buildAirlineFilter();
    renderResults();

  } catch (err) {
    console.error(err);
    loader.style.display = 'none';
    if (isAgentBlockedError(err)) {
      await forceLogout('Your account is not active. Contact Zamra Travels.');
      return;
    }
    list.innerHTML = `<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error fetching flights. Please try again.</div>`;
  }
}

function airlineNameFor(fare) {
  return resolveAirlineBrand(_airlineMap.get(fare.airlineId)).name;
}

/** Populate the airline filter from whatever this route actually returned. */
function buildAirlineFilter() {
  const sel = document.getElementById('b2b-filter-airline');
  if (!sel) return;
  const names = [...new Set(_results.fares.map(airlineNameFor))].sort((a, b) => a.localeCompare(b));
  sel.innerHTML = `<option value="all">All airlines (${_results.fares.length})</option>` +
    names.map(n => `<option value="${escHtml(n)}">${escHtml(n)}</option>`).join('');
  sel.value = 'all';
}

function visibleFares() {
  const rows = _view.airline === 'all'
    ? [..._results.fares]
    : _results.fares.filter(f => airlineNameFor(f) === _view.airline);

  const sorters = {
    'price-asc': (a, b) => roundFare(a.price) - roundFare(b.price),
    'price-desc': (a, b) => roundFare(b.price) - roundFare(a.price),
    'time-asc': (a, b) => fareDepartureMinutes(a) - fareDepartureMinutes(b),
    'date-asc': (a, b) => new Date(a.flightDate) - new Date(b.flightDate),
  };
  return rows.sort(sorters[_view.sort] || sorters['date-asc']);
}

function renderResults() {
  const list = document.getElementById('flightList');
  if (!list) return;

  const fares = visibleFares();
  setControlsVisible(true);

  const countEl = document.getElementById('b2b-results-count');
  if (countEl) {
    countEl.textContent = `${fares.length} fare${fares.length === 1 ? '' : 's'}`;
  }

  if (!fares.length) {
    list.innerHTML = `
      <div class="text-center px-6 py-10 rounded-[24px] border-2 border-dashed border-border bg-[#f8fafc]">
        <p class="text-[15px] font-heading font-bold text-navy">No fares match this filter</p>
        <p class="text-[13px] text-text-muted font-medium mt-1">Switch back to All airlines to see every result.</p>
      </div>`;
    return;
  }

  const waNumber = _context.whatsappNumber || '919846606738';
  const { sectorInfo, origin, dest } = _results;
  let htmlContent = '';

  fares.forEach((fare) => {
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateStr = new Date(fare.flightDate).toLocaleDateString('en-GB', dateOptions).replace(/,/g, '');
    const { departure: dep, arrival: arr } = splitFlightTimeRange(fare.flightTime);

    const airlineBrand = resolveAirlineBrand(_airlineMap.get(fare.airlineId));

    // Baggage is airline policy, not fare data — legacy rows are corrected here.
    // Formatting lives in shared/airline-baggage.js so every surface agrees on
    // the unit spelling.
    const checkInBaggageStr = formatCheckInBaggageText(airlineBrand.code, fare.baggage);
    const cabinBaggageStr = formatHandBaggageText(airlineBrand.code);
    const baggageLabelStr = formatBaggageAllowanceShort(airlineBrand.code, fare.baggage);
    const price = '₹' + roundFare(fare.price).toLocaleString('en-IN');

    const item = {
      airline: airlineBrand.name,
      airlineLogo: airlineBrand.logoUrl,
      airlineLogoFallback: airlineBrand.fallbackLogoUrl,
      airlineInitials: airlineBrand.initials,
      origin: sectorInfo?.sectorFrom || origin,
      originCode: origin,
      destination: sectorInfo?.sectorTo || dest,
      destinationCode: dest,
      date: dateStr,
      departure: dep,
      arrival: arr,
      price,
      checkInBaggage: checkInBaggageStr,
      cabinBaggage: cabinBaggageStr,
      baggageLabel: baggageLabelStr,
    };

    const waMsg = encodeURIComponent(`Hello Zamra Travels, B2B booking request from *${_context.agent?.name || _context.agent?.loginId}* (${_context.agent?.loginId}):\n\n✈️ *${item.airline}*\n🛫 From: *${item.origin}*\n🛬 To: *${item.destination}*\n📅 Date: *${item.date}*\n⏰ Dep: ${item.departure} | Arr: ${item.arrival}\n💵 Price: *${item.price}*\n\nPlease confirm availability!`);
    const waLink = `https://wa.me/${waNumber}?text=${waMsg}`;

    htmlContent += buildFlightCardHtml({ ...item, waLink });
  });

  list.innerHTML = htmlContent;
  wireFlightResultLogos(list);
}

function wireResultControls() {
  document.getElementById('b2b-sort')?.addEventListener('change', (e) => {
    _view.sort = e.target.value;
    renderResults();
  });
  document.getElementById('b2b-filter-airline')?.addEventListener('change', (e) => {
    _view.airline = e.target.value;
    renderResults();
  });
  document.getElementById('b2b-copy-link')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const original = btn.innerHTML;
    try {
      await navigator.clipboard.writeText(window.location.href);
      btn.innerHTML = `<i class="bi bi-check-lg"></i> Copied`;
    } catch {
      btn.innerHTML = `<i class="bi bi-exclamation-triangle"></i> Copy failed`;
    }
    setTimeout(() => { btn.innerHTML = original; }, 1800);
  });
}

// ── Visa & Immigration services (3 categories, poster-card layout) ──────────

/**
 * Promo posters shipped with the site, keyed by normalised country name per
 * category. A Firestore `posterUrl` (uploaded from the admin dashboard) always
 * wins; these are the built-in fallbacks for the artwork we already have.
 * Posters stay local under /assets/posters — never reference external URLs.
 */
const LOCAL_POSTERS = {
  visa: {
    'umrah': '/assets/posters/umrah-visa.jpg',
    'umrah visa': '/assets/posters/umrah-visa.jpg',
    'uae': '/assets/posters/uae-visa.jpg',
    'united arab emirates': '/assets/posters/uae-visa.jpg',
    'qatar': '/assets/posters/qatar-visa.jpg',
    'oman': '/assets/posters/oman-visa.jpg',
  },
  stamping: {
    'kuwait': '/assets/posters/kuwait-visa-stamping.jpg',
  },
  attestation: {},
};

/** Fixed display order for tourist visas; unlisted countries follow, A–Z. */
const VISA_ORDER = ['umrah', 'umrah visa', 'uae', 'united arab emirates', 'qatar', 'saudi arabia', 'kuwait'];

function normaliseCountry(name) {
  return String(name || '').trim().toLowerCase();
}

function localPoster(category, name) {
  return LOCAL_POSTERS[category]?.[normaliseCountry(name)] || '';
}

/** Uploaded artwork wins over the shipped poster for a country. */
function posterFor(category, name, uploadedUrl) {
  return uploadedUrl || localPoster(category, name);
}

function visaOrderIndex(name) {
  const idx = VISA_ORDER.indexOf(normaliseCountry(name));
  return idx === -1 ? VISA_ORDER.length : idx;
}

function formatRate(rate) {
  if (!rate && rate !== 0) return 'N/A';
  const num = parseFloat(rate);
  return isNaN(num) ? rate : `₹${num.toLocaleString('en-IN')}`;
}

function escHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * One poster card. Falls back to a branded gradient tile with the category
 * icon when no poster has been uploaded for that country yet, so a half-filled
 * poster set still renders as a clean grid.
 */
function serviceCardHtml({ title, subtitle, rate, poster, icon, waText }) {
  const waNumber = _context?.whatsappNumber || '919846606738';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
  const media = poster
    ? `<img src="${escHtml(poster)}" alt="${escHtml(title)} poster" loading="lazy"
         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]">`
    : `<div class="w-full h-full bg-gradient-to-br from-primary/80 to-blue-400/70 flex items-center justify-center text-white/90 text-[40px]">
         <i class="${icon}"></i>
       </div>`;

  return `
    <div class="group bg-bg-card rounded-[20px] max-sm:rounded-[16px] border border-border shadow-[var(--shadow-premium-soft)] overflow-hidden flex flex-col premium-hover-lift">
      <div class="relative aspect-[4/5] overflow-hidden bg-slate-100">
        ${media}
        <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent"></div>
        <h4 class="absolute left-4 right-4 bottom-3 text-white font-heading font-bold text-[16px] max-sm:text-[14px] leading-tight drop-shadow">
          ${escHtml(title)}
        </h4>
      </div>
      <div class="p-4 max-sm:p-3 flex flex-col flex-1 gap-3">
        <p class="text-[12px] text-text-muted font-medium leading-snug line-clamp-2">${escHtml(subtitle)}</p>
        <div class="mt-auto flex items-end justify-between gap-2">
          <div>
            <div class="text-[11px] text-text-muted font-semibold uppercase tracking-[0.6px]">Agent rate</div>
            <div class="text-[17px] max-sm:text-[15px] font-heading font-black text-navy">${escHtml(formatRate(rate))}</div>
          </div>
          <a href="${waLink}" target="_blank" rel="noopener"
            class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/10 text-[#1da851] text-[12px] font-bold hover:bg-[#25D366]/20 transition-colors">
            <i class="bi bi-whatsapp"></i> Enquire
          </a>
        </div>
      </div>
    </div>`;
}

/** Shimmer placeholders so the poster grids do not pop in from empty space. */
function renderServiceSkeletons() {
  const cards = Array.from({ length: 4 }, () => `
    <div class="bg-bg-card rounded-[20px] max-sm:rounded-[16px] border border-border overflow-hidden">
      <div class="aspect-[4/5] bg-slate-200 animate-pulse"></div>
      <div class="p-4 max-sm:p-3 space-y-2">
        <div class="h-[11px] w-3/4 rounded bg-slate-200/70 animate-pulse"></div>
        <div class="h-[16px] w-1/2 rounded bg-slate-200 animate-pulse"></div>
      </div>
    </div>`).join('');

  ['b2b-visas-list', 'b2b-stamping-list', 'b2b-attestations-list'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = cards;
  });
}

function renderServiceList(el, cards) {
  if (!el) return;
  el.innerHTML = cards.length
    ? cards.join('')
    : `<div class="col-span-full text-center text-text-muted text-sm py-8 rounded-[20px] border-2 border-dashed border-border bg-[#f8fafc]">No services listed right now. Enquire on WhatsApp.</div>`;
}

async function loadVisaServices() {
  const agentTag = `(B2B agent: ${_context?.agent?.loginId || ''})`;

  try {
    const [visas, stampings, attestations] = await Promise.all([
      getVisas().catch(() => []),
      getVisaStampings().catch(() => []),
      getAttestations().catch(() => []),
    ]);

    // Umrah first, then UAE, Qatar, Saudi Arabia, Kuwait — anything else A–Z.
    visas.sort((a, b) =>
      visaOrderIndex(a.countryName) - visaOrderIndex(b.countryName) ||
      (a.countryName || '').localeCompare(b.countryName || ''));
    renderServiceList(document.getElementById('b2b-visas-list'), visas.map(v => serviceCardHtml({
      title: v.countryName || 'Unknown',
      subtitle: v.visaType || 'Tourist Visa',
      rate: v.rate,
      // A purpose-made poster reads better than a bare flag, so it wins here.
      poster: localPoster('visa', v.countryName) || v.flagUrl || '',
      icon: 'bi bi-globe-americas',
      waText: `Hello Zamra Travels, ${agentTag} I am interested in a visa for:\n\n🌍 Country: *${v.countryName || ''}*\n📄 Visa Type: *${v.visaType || 'Tourist'}*\n\nPlease provide details.`,
    })));

    stampings.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    renderServiceList(document.getElementById('b2b-stamping-list'), stampings.map(s => serviceCardHtml({
      title: s.country || 'Unknown',
      subtitle: s.description || 'Visa Stamping',
      rate: s.cost !== undefined ? s.cost : s.rate,
      poster: posterFor('stamping', s.country, s.posterUrl),
      icon: 'bi bi-file-earmark-check',
      waText: `Hello Zamra Travels, ${agentTag} I need visa stamping for:\n\n🌍 Country: *${s.country || ''}*\n📋 Service: *${s.description || 'Visa Stamping'}*\n\nPlease provide details.`,
    })));

    attestations.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    renderServiceList(document.getElementById('b2b-attestations-list'), attestations.map(a => serviceCardHtml({
      title: a.country || 'Unknown',
      subtitle: a.certificate || 'Attestation',
      rate: a.cost !== undefined ? a.cost : a.rate,
      poster: posterFor('attestation', a.country, a.posterUrl),
      icon: 'bi bi-patch-check',
      waText: `Hello Zamra Travels, ${agentTag} I need attestation for:\n\n🌍 Country: *${a.country || ''}*\n📄 Certificate: *${a.certificate || 'Attestation'}*\n\nPlease provide details.`,
    })));
  } catch (err) {
    console.error('Visa services failed to load:', err);
  }
}

// ── Logout ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  wireResultControls();
  document.getElementById('b2b-logout-btn')?.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = '/b2b-login';
  });
});
