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

const getB2BPortalContext = httpsCallable(functions, 'getB2BPortalContext');
const getB2BFares = httpsCallable(functions, 'getB2BFares');

let _context = null;        // { agent, whatsappNumber, defaultOrigin, sectors }
let _airlineMap = new Map();

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

  const nameEl = document.getElementById('b2b-agent-name');
  const agencyEl = document.getElementById('b2b-agency-name');
  if (nameEl) nameEl.textContent = _context.agent?.name || _context.agent?.loginId || 'Agent';
  if (agencyEl) agencyEl.textContent = _context.agent?.agencyName || '';

  initRouteSelects();
  loadVisaServices();
}

// ── Route selects (built from the agent's allowed sectors only) ─────────────

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
  select.innerHTML = codes.map(code => `<option value="${code}">${code}</option>`).join('');
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

  fillSelect(originSel, origins, _context.defaultOrigin);
  fillSelect(destSel, destinationsFor(originSel.value));

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

  searchBtn?.addEventListener('click', searchFlights);
}

// ── Flight search ────────────────────────────────────────────────────────────

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
      list.innerHTML = `<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${origin} to ${dest}. Try another route.</div>`;
      return;
    }

    const waNumber = _context.whatsappNumber || '919846606738';
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
        origin: sectorInfo.sectorFrom || origin,
        originCode: origin,
        destination: sectorInfo.sectorTo || dest,
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
    <div class="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-[#f8fafc] hover:border-primary/40 transition-colors">
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
  document.getElementById('b2b-logout-btn')?.addEventListener('click', async () => {
    await logoutUser();
    window.location.href = '/b2b-login';
  });
});
