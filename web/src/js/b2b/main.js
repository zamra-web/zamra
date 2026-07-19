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

const getB2BPortalContext = httpsCallable(functions, 'getB2BPortalContext');
const getB2BFares = httpsCallable(functions, 'getB2BFares');

let _context = null;        // { agent, whatsappNumber, defaultOrigin, sectors }
let _airlineMap = new Map();
let _cityByCode = new Map(); // IATA code → city name, for friendly select labels

// Last search kept in memory so sort/filter re-render without another callable.
let _results = { fares: [], sectorInfo: null, origin: '', dest: '' };
let _view = { sort: 'price-asc', airline: 'all' };

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
    'price-asc': (a, b) => Number(a.price) - Number(b.price),
    'price-desc': (a, b) => Number(b.price) - Number(a.price),
    'time-asc': (a, b) => fareDepartureMinutes(a) - fareDepartureMinutes(b),
    'date-asc': (a, b) => new Date(a.flightDate) - new Date(b.flightDate),
  };
  return rows.sort(sorters[_view.sort] || sorters['price-asc']);
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

    const baggageVal = Number(fare.baggage) || 0;
    const extraBaggageVal = Number(fare.extraBaggage) || 0;
    const checkInBaggageStr = baggageVal ? `${baggageVal} KG` : 'No Check-in';
    const cabinBaggageStr = extraBaggageVal ? `+ ${extraBaggageVal} KG` : '';
    const totalBaggage = baggageVal + extraBaggageVal;
    const baggageLabelStr = totalBaggage > 0 ? `${totalBaggage}KG` : '0KG';
    const airlineBrand = resolveAirlineBrand(_airlineMap.get(fare.airlineId));
    const price = '₹' + Number(fare.price).toLocaleString('en-IN');

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

// ── Visa & Immigration services (3 categories only) ─────────────────────────

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

function serviceRowHtml({ title, subtitle, rate, waText }) {
  const waNumber = _context?.whatsappNumber || '919846606738';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
  return `
    <div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-[#f8fafc] hover:border-primary/40 hover:bg-white transition-colors">
      <div class="min-w-0">
        <div class="text-[14px] font-bold text-navy truncate">${escHtml(title)}</div>
        <div class="text-[12px] text-text-muted font-medium truncate">${escHtml(subtitle)} · ${escHtml(formatRate(rate))}</div>
      </div>
      <a href="${waLink}" target="_blank"
        class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#1da851] text-[12px] font-bold hover:bg-[#25D366]/20 transition-colors">
        <i class="bi bi-whatsapp"></i> Enquire
      </a>
    </div>`;
}

/** Shimmer placeholders so the three service cards do not sit on bare text. */
function renderServiceSkeletons() {
  const rows = Array.from({ length: 4 }, () => `
    <div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-[#f8fafc]">
      <div class="min-w-0 flex-1 space-y-2">
        <div class="h-[13px] w-1/2 rounded bg-slate-200 animate-pulse"></div>
        <div class="h-[11px] w-3/4 rounded bg-slate-200/70 animate-pulse"></div>
      </div>
      <div class="h-[28px] w-[76px] shrink-0 rounded-lg bg-slate-200/70 animate-pulse"></div>
    </div>`).join('');

  ['b2b-visas-list', 'b2b-stamping-list', 'b2b-attestations-list'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = rows;
  });
}

function renderServiceList(el, rows) {
  if (!el) return;
  el.innerHTML = rows.length
    ? rows.join('')
    : `<div class="text-center text-text-muted text-sm py-6">No services listed right now. Enquire on WhatsApp.</div>`;
}

async function loadVisaServices() {
  const agentTag = `(B2B agent: ${_context?.agent?.loginId || ''})`;

  try {
    const [visas, stampings, attestations] = await Promise.all([
      getVisas().catch(() => []),
      getVisaStampings().catch(() => []),
      getAttestations().catch(() => []),
    ]);

    visas.sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''));
    renderServiceList(document.getElementById('b2b-visas-list'), visas.map(v => serviceRowHtml({
      title: v.countryName || 'Unknown',
      subtitle: v.visaType || 'Tourist Visa',
      rate: v.rate,
      waText: `Hello Zamra Travels, ${agentTag} I am interested in a visa for:\n\n🌍 Country: *${v.countryName || ''}*\n📄 Visa Type: *${v.visaType || 'Tourist'}*\n\nPlease provide details.`,
    })));

    stampings.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    renderServiceList(document.getElementById('b2b-stamping-list'), stampings.map(s => serviceRowHtml({
      title: s.country || 'Unknown',
      subtitle: s.description || 'Visa Stamping',
      rate: s.cost !== undefined ? s.cost : s.rate,
      waText: `Hello Zamra Travels, ${agentTag} I need visa stamping for:\n\n🌍 Country: *${s.country || ''}*\n📋 Service: *${s.description || 'Visa Stamping'}*\n\nPlease provide details.`,
    })));

    attestations.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
    renderServiceList(document.getElementById('b2b-attestations-list'), attestations.map(a => serviceRowHtml({
      title: a.country || 'Unknown',
      subtitle: a.certificate || 'Attestation',
      rate: a.cost !== undefined ? a.cost : a.rate,
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
