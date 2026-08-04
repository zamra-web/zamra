/**
 * B2B agent portal (b2b.zamratravels.com).
 *
 * All fare data comes from the getB2BPortalContext / getB2BFares Cloud
 * Functions — prices are computed server-side per agent, and this page never
 * reads agent_fares from Firestore directly.
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../admin/firebase-config.js';
import { onAuthChange, logoutUser, reauthenticateCurrentUser } from '../admin/auth.js';
import { getAirlines, getVisas, getVisaStampings, getAttestations, getVisaRateCards } from '../admin/db.js';
import { splitFlightTimeRange } from '../web/flight-results.js';
import { resolveAirlineBrand, wireFlightResultLogos } from '../web/airline-brand.js';
import { buildCompactFlightCardHtml } from '../web/flight-card.js';
import { wireFlightCardSheet } from '../web/flight-details-sheet.js';
import { initSiteChrome } from '../web/site-chrome.js';
import {
  formatCheckInBaggageText,
  formatHandBaggageText,
  formatBaggageAllowanceShort,
} from '../shared/airline-baggage.js';
import {
  normaliseCountryKey,
  indexRateCardsByCountry,
  formatVisaRate,
  lowestRate,
} from '../shared/visa-rate-cards.js';
import {
  normaliseOffer,
  isOfferComplete,
  buildOfferCardHtml,
  formatOfferDate,
  formatOfferPrice,
  formatOfferBaggage,
} from '../shared/b2b-offers.js';

const getB2BPortalContext = httpsCallable(functions, 'getB2BPortalContext');
const getB2BFares = httpsCallable(functions, 'getB2BFares');
const recordB2BAgentActivity = httpsCallable(functions, 'recordB2BAgentActivity');
const changeB2BAgentPassword = httpsCallable(functions, 'changeB2BAgentPassword');

let _context = null;        // { agent, whatsappNumber, defaultOrigin, sectors }
let _airlineMap = new Map();
let _cityByCode = new Map(); // IATA code → city name, for friendly select labels
let _rateCards = new Map();  // normalised country key → tourist visa rate card

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
  renderFeaturedOffers();
  loadVisaServices();
  startActivityHeartbeat();
  wireAccountControls();
}

// ── Featured offers ──────────────────────────────────────────────────────────
// Promo cards beside the welcome banner. The list arrives already filtered and
// sorted by getB2BPortalContext — active, unexpired, and minus any origin this
// agent cannot see — so nothing here decides whether a deal still runs.

/** Deep-link the offer's route into the search box, then scroll to it. */
function offerSearchLink(offer) {
  return `?from=${encodeURIComponent(offer.originCode)}&to=${encodeURIComponent(offer.destCode)}#b2b-search`;
}

function offerWhatsAppLink(offer) {
  const waNumber = _context?.whatsappNumber || '919846606738';
  const agent = _context?.agent || {};
  const route = `${offer.originCity || offer.originCode} (${offer.originCode}) → ${offer.destCity || offer.destCode} (${offer.destCode})`;
  const price = formatOfferPrice(offer);
  const lines = [
    `Hello Zamra Travels, B2B enquiry from *${agent.name || agent.loginId || 'Agent'}* (${agent.loginId || ''}) about a featured offer:`,
    '',
    offer.badge ? `🏷️ *${offer.badge}*` : '',
    `✈️ ${route}`,
    offer.airlineName ? `🛩️ Airline: *${offer.airlineName}*` : '',
    offer.travelDate ? `📅 Date: *${formatOfferDate(offer.travelDate)}*` : '',
    `🧳 Baggage: ${formatOfferBaggage(offer)}`,
    price ? `💵 Offer price: *${price}*${offer.priceNote ? ` (${offer.priceNote})` : ''}` : '',
    '',
    'Please confirm availability!',
  ].filter(Boolean);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function renderFeaturedOffers() {
  const wrap = document.getElementById('b2b-offers');
  const rail = document.getElementById('b2b-offers-rail');
  if (!wrap || !rail) return;

  const offers = (_context?.offers || []).map(normaliseOffer).filter(isOfferComplete);
  wrap.hidden = !offers.length;
  if (!offers.length) return;

  rail.innerHTML = offers.map((offer) => {
    const brand = resolveAirlineBrand(_airlineMap.get(offer.airlineId) || {
      name: offer.airlineName,
      code: offer.airlineCode,
    });
    const link = offer.ctaType === 'search'
      ? { href: offerSearchLink(offer) }
      : { href: offerWhatsAppLink(offer), target: '_blank' };
    return buildOfferCardHtml(offer, brand, link);
  }).join('');

  wireFlightResultLogos(rail);
  wireOfferRail(rail);
}

/**
 * Arrows appear only once the rail actually overflows — with three or fewer
 * cards they share the width evenly and there is nothing to scroll to.
 */
function wireOfferRail(rail) {
  const nav = document.getElementById('b2b-offers-nav');
  if (!nav) return;

  // A few px of slack: sub-pixel column widths otherwise report a permanent
  // 1px overflow and leave the arrows showing with nowhere to go.
  const syncNav = () => { nav.hidden = rail.scrollWidth <= rail.clientWidth + 4; };
  syncNav();

  if (nav.dataset.wired) return;
  nav.dataset.wired = '1';

  // The rail lives in a grid column, so what overflows changes with the window.
  window.addEventListener('resize', syncNav);

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-offer-scroll]');
    if (!btn) return;
    const card = rail.firstElementChild;
    const step = card ? card.offsetWidth + 12 : 200; // + the rail's gap-3
    rail.scrollBy({ left: Number(btn.dataset.offerScroll) * step, behavior: 'smooth' });
  });
}

// ── Presence heartbeat ───────────────────────────────────────────────────────
// Feeds the "Online" badge and the last-login column in the admin dashboard.
// The server throttles the writes (see recordB2BAgentActivity), so this can beat
// steadily without turning into a write storm.

const HEARTBEAT_MS = 60 * 1000;
let _heartbeatTimer = null;

/** Fire-and-forget: presence must never break, or interrupt, the portal. */
async function sendActivity(event) {
  try {
    await recordB2BAgentActivity({ event });
  } catch (err) {
    // A deactivated agent gets permission-denied here first — the next search
    // would hit the same wall, so log them out now rather than let them work
    // in a portal that will refuse every query.
    if (isAgentBlockedError(err)) {
      stopActivityHeartbeat();
      await forceLogout('Your account is not active. Contact Zamra Travels.');
      return;
    }
    console.debug('Activity ping failed (ignored):', err?.message || err);
  }
}

function stopActivityHeartbeat() {
  if (_heartbeatTimer) clearInterval(_heartbeatTimer);
  _heartbeatTimer = null;
}

function startActivityHeartbeat() {
  if (_heartbeatTimer) return;
  sendActivity('login');
  _heartbeatTimer = setInterval(() => {
    // A hidden tab is not an agent using the portal — skipping the beat is what
    // makes the badge drop to Offline a few minutes after they walk away.
    if (document.visibilityState === 'visible') sendActivity('heartbeat');
  }, HEARTBEAT_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sendActivity('heartbeat');
  });
}

// ── Self-service password change ─────────────────────────────────────────────

function wireAccountControls() {
  const modal = document.getElementById('b2b-password-modal');
  const openBtn = document.getElementById('b2b-account-btn');
  const form = document.getElementById('b2b-password-form');
  if (!modal || !openBtn || !form) return;

  const errorBox = document.getElementById('b2b-password-error');
  const successBox = document.getElementById('b2b-password-success');
  const submitBtn = document.getElementById('b2b-password-submit');

  const setMessage = (box, text) => {
    box.textContent = text || '';
    box.classList.toggle('hidden', !text);
  };
  const clearMessages = () => { setMessage(errorBox, ''); setMessage(successBox, ''); };

  const close = () => { modal.close(); form.reset(); clearMessages(); };

  openBtn.addEventListener('click', () => {
    clearMessages();
    form.reset();
    modal.showModal();
    document.getElementById('b2b-current-password')?.focus();
  });
  document.getElementById('b2b-password-close')?.addEventListener('click', close);
  document.getElementById('b2b-password-cancel')?.addEventListener('click', close);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const current = form.elements.currentPassword.value;
    const next = form.elements.newPassword.value;
    const confirm = form.elements.confirmPassword.value;

    // Mirrors validateCustomPassword() in functions/b2bCredentials.js so a
    // typo is caught before a round trip; the server still enforces it.
    if (next !== confirm) return setMessage(errorBox, 'The two new passwords do not match.');
    if (next.length < 8) return setMessage(errorBox, 'New password must be at least 8 characters.');
    if (/\s/.test(next)) return setMessage(errorBox, 'New password cannot contain spaces.');
    if (!/[A-Za-z]/.test(next) || !/[0-9]/.test(next)) {
      return setMessage(errorBox, 'New password must contain at least one letter and one number.');
    }
    if (next === current) return setMessage(errorBox, 'Choose a password different from your current one.');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating…';
    try {
      // Proves the current password, and refreshes auth_time for the callable's
      // freshness check.
      const reauth = await reauthenticateCurrentUser(current);
      if (!reauth.success) {
        setMessage(errorBox, reauth.error);
        return;
      }
      await changeB2BAgentPassword({ newPassword: next });
      form.reset();
      setMessage(successBox, 'Password updated. Use it the next time you sign in.');
    } catch (err) {
      setMessage(errorBox, /REAUTH_REQUIRED/.test(err?.message || '')
        ? 'That took too long. Please re-enter your current password and try again.'
        : (err?.message || 'Could not update your password. Please try again.'));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update password';
    }
  });
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

  // The compact card carries the CTA itself; the same items still go to the
  // details sheet, which adds what the row leaves out (full city names, both
  // baggage allowances spelled out).
  const cards = fares.map((fare) => {
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

    return { ...item, waLink: `https://wa.me/${waNumber}?text=${waMsg}` };
  });

  list.innerHTML = cards.map((item) => buildCompactFlightCardHtml(item)).join('');
  wireFlightResultLogos(list);
  wireFlightCardSheet(list, cards, wireFlightResultLogos);
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
 *
 * `rateCardId` swaps the WhatsApp enquiry button for the "Rates" button that
 * opens the full price sheet. Countries without a rate card configured keep the
 * enquiry button, so nothing is stranded while other countries are being added.
 */
function serviceCardHtml({ title, subtitle, rate, poster, icon, waText, rateCardId = '', rateLabel = 'Agent rate' }) {
  const waNumber = _context?.whatsappNumber || '919846606738';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
  const action = rateCardId
    ? `<button type="button" data-rate-card-id="${escHtml(rateCardId)}"
         class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-[12px] font-bold hover:opacity-90 transition-opacity cursor-pointer">
         <i class="bi bi-list-columns-reverse"></i> Rates
       </button>`
    : `<a href="${waLink}" target="_blank" rel="noopener"
         class="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/10 text-[#1da851] text-[12px] font-bold hover:bg-[#25D366]/20 transition-colors">
         <i class="bi bi-whatsapp"></i> Enquire
       </a>`;
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
            <div class="text-[11px] text-text-muted font-semibold uppercase tracking-[0.6px]">${escHtml(rateLabel)}</div>
            <div class="text-[17px] max-sm:text-[15px] font-heading font-black text-navy">${escHtml(formatRate(rate))}</div>
          </div>
          ${action}
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
    const [visas, stampings, attestations, rateCards] = await Promise.all([
      getVisas().catch(() => []),
      getVisaStampings().catch(() => []),
      getAttestations().catch(() => []),
      getVisaRateCards().catch(() => []),
    ]);

    _rateCards = indexRateCardsByCountry(rateCards);

    // Umrah first, then UAE, Qatar, Saudi Arabia, Kuwait — anything else A–Z.
    visas.sort((a, b) =>
      visaOrderIndex(a.countryName) - visaOrderIndex(b.countryName) ||
      (a.countryName || '').localeCompare(b.countryName || ''));
    renderServiceList(document.getElementById('b2b-visas-list'), visas.map((v) => {
      const card = _rateCards.get(normaliseCountryKey(v.countryName));
      // With a rate card the headline becomes the cheapest row on the sheet, so
      // the card and the sheet behind it can never disagree.
      const cheapest = card ? lowestRate(card) : null;
      return serviceCardHtml({
        title: v.countryName || 'Unknown',
        subtitle: card
          ? `${card.sections.length} rate section${card.sections.length === 1 ? '' : 's'}${card.note ? ` · ${card.note}` : ''}`
          : (v.visaType || 'Tourist Visa'),
        rate: cheapest === null ? v.rate : cheapest,
        rateLabel: card && cheapest !== null ? 'From' : 'Agent rate',
        rateCardId: card?.id || '',
        // A purpose-made poster reads better than a bare flag, so it wins here.
        poster: localPoster('visa', v.countryName) || v.flagUrl || '',
        icon: 'bi bi-globe-americas',
        waText: `Hello Zamra Travels, ${agentTag} I am interested in a visa for:\n\n🌍 Country: *${v.countryName || ''}*\n📄 Visa Type: *${v.visaType || 'Tourist'}*\n\nPlease provide details.`,
      });
    }));

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

// ── Tourist visa rate sheet ─────────────────────────────────────────────────
// The "Rates" button on a tourist-visa card opens this. Every section, group,
// row and price is read from the country's `visa_rate_cards` document — the
// renderer holds no prices of its own, so an admin edit is live immediately.

/** One priced line: label on the left, rate (or free text) on the right. */
function rateRowHtml(row) {
  return `
    <div class="flex items-baseline justify-between gap-4 py-2.5 border-b border-border/70 last:border-0">
      <span class="text-[13px] font-semibold text-text-main">${escHtml(row.label)}</span>
      <span class="shrink-0 text-[14px] font-heading font-black text-navy tabular-nums">${escHtml(formatVisaRate(row))}</span>
    </div>`;
}

/** A named group (DUBAI / ABU DHABI) prints its heading; an unnamed one does not. */
function rateGroupHtml(group) {
  const heading = group.title
    ? `<div class="text-[11px] font-bold text-primary uppercase tracking-[1px] mb-1 mt-3 first:mt-0">${escHtml(group.title)}</div>`
    : '';
  return `${heading}<div>${group.rows.map(rateRowHtml).join('')}</div>`;
}

function rateSectionHtml(section, index) {
  const note = section.note
    ? `<p class="text-[12px] text-text-muted font-semibold mt-1">${escHtml(section.note)}</p>`
    : '';
  return `
    <section class="rounded-[16px] border border-border bg-bg-card overflow-hidden">
      <header class="px-4 py-3 bg-bg-main border-b border-border">
        <div class="flex items-center gap-2.5">
          <span class="w-[22px] h-[22px] shrink-0 rounded-md bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">${index + 1}</span>
          <h4 class="text-[15px] font-heading font-black text-navy">${escHtml(section.title || 'Rates')}</h4>
        </div>
        ${note}
      </header>
      <div class="px-4 pb-3 pt-1">${section.groups.map(rateGroupHtml).join('')}</div>
    </section>`;
}

function openRatesModal(card) {
  const modal = document.getElementById('b2b-rates-modal');
  const body = document.getElementById('b2b-rates-body');
  const titleEl = document.getElementById('b2b-rates-title');
  const noteEl = document.getElementById('b2b-rates-note');
  const waEl = document.getElementById('b2b-rates-whatsapp');
  if (!modal || !body || !card) return;

  if (titleEl) titleEl.textContent = `${card.countryName} Tourist Visa Rates`;
  if (noteEl) {
    noteEl.textContent = card.note;
    noteEl.classList.toggle('hidden', !card.note);
  }
  if (waEl) {
    const waNumber = _context?.whatsappNumber || '919846606738';
    const agentTag = `(B2B agent: ${_context?.agent?.loginId || ''})`;
    const msg = `Hello Zamra Travels, ${agentTag} I would like to book a *${card.countryName}* tourist visa.\n\nPlease confirm availability and requirements.`;
    waEl.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  }

  body.innerHTML = card.sections.length
    ? card.sections.map(rateSectionHtml).join('')
    : `<p class="text-center text-text-muted text-[13px] font-medium py-8">No rates published yet. Message us on WhatsApp for a quote.</p>`;

  modal.showModal();
}

function wireRateCardButtons() {
  const list = document.getElementById('b2b-visas-list');
  if (!list || list.dataset.ratesWired) return;
  list.dataset.ratesWired = '1';
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-rate-card-id]');
    if (!btn) return;
    const card = [..._rateCards.values()].find(c => c.id === btn.dataset.rateCardId);
    if (card) openRatesModal(card);
  });

  const modal = document.getElementById('b2b-rates-modal');
  document.getElementById('b2b-rates-close')?.addEventListener('click', () => modal?.close());
  // Click outside the panel (i.e. on the ::backdrop) closes it, matching the
  // password dialog's behaviour.
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
}

// ── Logout ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  wireResultControls();
  wireRateCardButtons();
  document.getElementById('b2b-logout-btn')?.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = '/b2b-login';
  });
});
