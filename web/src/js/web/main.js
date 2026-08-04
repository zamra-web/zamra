// Modern Zamra Travels JavaScript
import '../shared/vercel-insights.js';
// Sectors, airlines and flight_details are world-readable reference data and are
// still read directly. Fares are not: they come back projected from the server so
// specialRate / commission / supplier agentId never reach the browser.
import { getSectors, getAirlines, getFlightDetails } from '../admin/db.js';
import { getPublicFares } from './public-fares.js';
// Which origin→destination pairs a search can actually answer. Only the server
// can tell, because deciding it means reading admin-only `agent_fares`.
import { getPublicRoutes, buildRouteMap } from './public-routes.js';
import { airportCity } from '../shared/airports.js';
import { buildOriginCards, splitOriginSections } from './route-grids.js';
import { escapeHtml } from '../shared/escape-html.js';
import { buildFlightTimeResolver } from '../shared/flight-schedule.js';
import { dedupeAndSortFares, splitFlightTimeRange } from './flight-results.js';
import { initSiteChrome } from './site-chrome.js';
import { resolveAirlineBrand, wireFlightResultLogos } from './airline-brand.js';
import { buildFlightCardHtml } from './flight-card.js';
import { wireFlightCardSheet } from './flight-details-sheet.js';
import {
  handBaggageKg,
  resolveCheckInBaggageKg,
  formatCheckInBaggageText,
  formatHandBaggageText,
  formatBaggageAllowanceShort,
} from '../shared/airline-baggage.js';

const ENQUIRY_WEBHOOK = 'https://n8n.srv1491832.hstgr.cloud/webhook/enquiry';

// `flight_details` is world-readable and small (one doc per airline+sector), so
// one lazy fetch per page load backs every fare list on the site.
let _flightTimeResolverPromise = null;
function loadFlightTimeResolver() {
  if (!_flightTimeResolverPromise) {
    _flightTimeResolverPromise = getFlightDetails()
      .then(details => buildFlightTimeResolver(details))
      // A failed read must not blank out the fare list — fall back to whatever
      // the fare itself stores.
      .catch(() => (fare => String(fare?.flightTime || '').trim()));
  }
  return _flightTimeResolverPromise;
}

document.addEventListener('DOMContentLoaded', () => {

  initSiteChrome({ enableSmoothScroll: true });

  // 1. Populate Sectors Dynamically
  //
  // The origins, and each origin's destinations, come from `getPublicRoutes` via
  // `loadRouteMap()`. This used to be two hardcoded airport arrays rendered as a
  // full cross-product, which is why clicking Kozhikode offered Madinah and
  // clicking Jeddah offered Trivandrum — pairs no fare has ever backed.
  const gridsContainer = document.getElementById('flight-grids-container');

  if (gridsContainer) {
    const renderSection = (origins, label) => {
      // Create section container
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'mb-[50px]';

      // Create header
      sectionDiv.innerHTML = `
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${label}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="grid-${label.replace(/\s+/g, '-').toLowerCase()}"></div>
      `;

      gridsContainer.appendChild(sectionDiv);
      const grid = sectionDiv.querySelector(`#grid-${label.replace(/\s+/g, '-').toLowerCase()}`);

      origins.forEach(origin => {
        const card = document.createElement('div');
        card.className = 'sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] max-sm:px-4 max-sm:py-4 rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group';
        card.innerHTML = `<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${escapeHtml(origin.name)} (${escapeHtml(origin.code)}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`;

        // Each origin carries its own destination list now, rather than every
        // card in a section sharing one — that shared list is what offered
        // CCJ → MED and JED → TRV, routes no fare can answer.
        card.addEventListener('click', () => {
          if (typeof openRoutesModal === 'function') {
            openRoutesModal(origin, origin.destinations);
          }
        });

        grid.appendChild(card);
      });
    };

    // The grids are JS-rendered into an empty container, so unlike the From/To
    // selects there is no static copy to fall back on and nothing a crawler ever
    // sees. That means they can wait for the live routes rather than painting
    // the full airport cross-product first — showing dead routes for a second
    // and then yanking them is worse than a brief loader.
    gridsContainer.innerHTML = `
      <div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div>
      <p class="text-center text-text-muted">Loading routes…</p>
    `;

    loadRouteMap().then((routeMap) => {
      const sections = splitOriginSections(buildOriginCards(routeMap));
      gridsContainer.innerHTML = '';

      // No sections means the fetch failed or nothing is on sale. Falling back to
      // the old hardcoded cross-product would reinstate exactly the dead routes
      // this removes, so the honest answer is the empty state.
      if (!sections.length) {
        gridsContainer.innerHTML = `
          <div class="rounded-2xl border border-dashed border-border bg-[#f8fafc] p-8 text-center text-text-muted font-semibold">
            No routes are loaded right now. Please check back shortly.
          </div>
        `;
        return;
      }

      sections.forEach((section) => renderSection(section.origins, section.label));
    });
  }

  // 4. Modal Functionality
  const modal = document.getElementById('sector-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const modalRoute = document.getElementById('modal-route');
  const modalTitle = document.getElementById('modal-title');

  function openRoutesModal(origin, destinations) {
    modalTitle.textContent = 'Select Destination';
    modalRoute.textContent = `Flying from ${origin.name}`;
    modalRoute.classList.remove('bg-primary-light', 'text-primary');
    modalRoute.classList.add('bg-slate-100', 'text-slate-600');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Render routes options
    modalBody.innerHTML = `
      <div class="text-center mb-6">
        <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Routes</h4>
        <p class="text-text-muted text-sm">Select a destination to view flight options</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-1" id="routes-grid">
      </div>
    `;

    const routesGrid = document.getElementById('routes-grid');
    destinations.forEach(dest => {
      const sectorCode = `${origin.code} ${dest.code}`;
      const routeName = `${origin.name} → ${dest.name}`;

      const routeBtn = document.createElement('button');
      routeBtn.className = 'bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary transition-all flex items-center justify-between group cursor-pointer w-full text-left';
      routeBtn.innerHTML = `
        <span class="font-bold text-navy text-[15px]">${escapeHtml(origin.name)} to ${escapeHtml(dest.name)}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `;
      routeBtn.onclick = () => {
        openModal(dest.sectorId, sectorCode, routeName, origin);
      };
      routesGrid.appendChild(routeBtn);
    });
  }

  /**
   * Fare table for one route.
   *
   * `sectorId` comes from the route map, so the sector never has to be recovered
   * by matching a rebuilt `"CCJ JED"` against `sectorCode` — a match that misses
   * the equally valid `CCJ-JED` form. `origin` is carried through only so "Back
   * to Destinations" can reopen the list it came from instead of re-deriving it.
   */
  function openModal(sectorId, sectorCode, routeName, origin) {
    modalTitle.textContent = 'Flight Details';
    modalRoute.textContent = sectorCode.replace(' ', ' → ');
    modalRoute.classList.add('bg-primary-light', 'text-primary');
    modalRoute.classList.remove('bg-slate-100', 'text-slate-600');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Show loading state
    modalBody.innerHTML = '<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';

    // Load data dynamically
    async function loadFares() {
      try {
        const sectors = await getSectors();
        const sector = (sectorId && sectors.find(s => s.id === sectorId))
          || sectors.find(s => s.sectorCode === sectorCode);

        const airlines = await getAirlines();
        const airlineMap = {};
        airlines.forEach(a => airlineMap[a.id] = a.name);

        const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
        let tableRows = '';
        let cardRows = '';
        let hasFares = false;

        if (sector) {
          const today = new Date();
          today.setHours(0,0,0,0);

          const [rawFares, resolveFlightTime] = await Promise.all([
            getPublicFares({ sectorId: sector.id, startDate: today.toISOString() }),
            loadFlightTimeResolver(),
          ]);
          const fares = dedupeAndSortFares(rawFares, { resolveFlightTime });

          if (fares.length > 0) {
            hasFares = true;
            const normalizedFares = fares.map(fare => {
              const airlineName = airlineMap[fare.airlineId] || 'Unknown Airline';
              const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
              const dateStr = fare.flightDate.toLocaleDateString('en-GB', dateOptions);
              const { departure: dep, arrival: arr } = splitFlightTimeRange(fare.flightTime);
              const price = `\u20b9${fare.finalRate.toLocaleString('en-IN')}`;
              const waMsg = encodeURIComponent(`Hello Zamra Travels, I'd like to book this flight:\n\n\u2708\ufe0f *${airlineName}*\n\ud83d\uddef\ufe0f Route: *${routeName}*\n\ud83d\udcc5 Date: *${dateStr}*\n\u23f0 Dep: ${dep} | Arr: ${arr}\n\ud83d\udcb5 Price: *${price}*\n\nPlease confirm availability!`);
              const waLink = `https://wa.me/919846606739?text=${waMsg}`;
              return { airlineName, dateStr, dep, arr, price, waLink };
            });

            tableRows = normalizedFares.map(fare => `
              <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                  <td class="p-[12px_15px] whitespace-nowrap"><strong>${fare.dateStr}</strong></td>
                  <td class="p-[12px_15px] whitespace-nowrap"><strong>${fare.airlineName}</strong></td>
                  <td class="p-[12px_15px]">${fare.dep}</td>
                  <td class="p-[12px_15px]">${fare.arr}</td>
                  <td class="p-[12px_15px] text-right"><strong>${fare.price}</strong></td>
                  <td class="p-[12px_10px] text-center">
                    <a href="${fare.waLink}" target="_blank" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#1558c0] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap hover:shadow-[0_3px_10px_rgba(26,115,232,0.35)] hover:-translate-y-0.5 transition-all">
                      <i class="bi bi-whatsapp"></i> Book Now
                    </a>
                  </td>
              </tr>
            `).join('');

            cardRows = normalizedFares.map(fare => `
              <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-premium-soft)]">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Date</div>
                    <div class="text-[15px] font-bold text-navy">${fare.dateStr}</div>
                    <div class="text-[12px] font-semibold text-text-muted mt-1">${fare.airlineName}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Price</div>
                    <div class="text-[18px] font-black text-navy">${fare.price}</div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 mt-3">
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Departure</div>
                    <div class="text-[13px] font-semibold text-navy">${fare.dep}</div>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Arrival</div>
                    <div class="text-[13px] font-semibold text-navy">${fare.arr}</div>
                  </div>
                </div>
                <a href="${fare.waLink}" target="_blank" class="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-[#1558c0] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(26,115,232,0.25)]">
                  <i class="bi bi-whatsapp"></i> Book Now
                </a>
              </div>
            `).join('');
          }
        } else {
          hasFares = false;
        }

        const emptyState = `
          <div class="rounded-2xl border border-dashed border-border bg-[#f8fafc] p-6 text-center text-text-muted font-semibold">
            No flights available currently.
          </div>
        `;

        modalBody.innerHTML = `
          <div class="text-center mb-4">
              <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                <i class="bi bi-arrow-left"></i> Back to Destinations
              </button>
              <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${routeName}</h4>
              <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
          </div>
          ${hasFares
            ? (isMobile
              ? `<div class="space-y-4">${cardRows}</div>`
              : `<div class="overflow-x-auto w-full pb-2">
                  <table class="w-full min-w-[680px] border-collapse my-[10px] text-[14px] text-left rounded-[10px] overflow-hidden">
                      <thead>
                          <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                              <th class="p-[12px_15px]">Date</th>
                              <th class="p-[12px_15px]">Airlines</th>
                              <th class="p-[12px_15px]">Departure</th>
                              <th class="p-[12px_15px]">Arrival</th>
                              <th class="p-[12px_15px] text-right">Price</th>
                              <th class="p-[12px_15px]"></th>
                          </tr>
                      </thead>
                      <tbody>
                          ${tableRows}
                      </tbody>
                  </table>
                </div>`
            )
            : emptyState
          }
        `;
      
        const backBtn = document.getElementById('back-to-routes');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            // The origin travelled with the click, so going back reopens the exact
            // destination list the user came from. Re-deriving it meant guessing
            // which hardcoded array the origin belonged to and handing back every
            // airport on the far side, live route or not.
            if (origin?.destinations?.length) {
              openRoutesModal(origin, origin.destinations);
            } else {
              closeModal();
            }
          });
        }
      } catch (error) {
         console.error("Error fetching fares:", error);
         modalBody.innerHTML = '<p class="text-center text-red-500 my-4">Error loading flights. Please try again later.</p>';
      }
    }

    loadFares();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Partners Slider Auto-scroll
  const setupPartnersSlider = () => {
    const slider = document.querySelector('.partners-slider');
    if (!slider) return;

    // Clone items for infinite scroll effect if needed
    // For now, we rely on CSS flexbox and just added simple hover effects
  };

  // Initialize remaining components
  setupPartnersSlider();

  // Enquiry Form Submission
  const initEnquiryForm = () => {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const statusEl = document.getElementById('enquiry-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    const setStatus = (state, message) => {
      if (!statusEl) return;
      statusEl.classList.remove('hidden', 'text-emerald-600', 'text-red-600', 'text-primary', 'border-emerald-200', 'border-red-200', 'border-primary/30', 'bg-emerald-50', 'bg-red-50', 'bg-primary/5');

      if (state === 'success') {
        statusEl.classList.add('text-emerald-600', 'border-emerald-200', 'bg-emerald-50');
        statusEl.innerHTML = `<i class="bi bi-check-circle-fill mr-2"></i>${message}`;
      } else if (state === 'error') {
        statusEl.classList.add('text-red-600', 'border-red-200', 'bg-red-50');
        statusEl.innerHTML = `<i class="bi bi-x-circle-fill mr-2"></i>${message}`;
      } else {
        statusEl.classList.add('text-primary', 'border-primary/30', 'bg-primary/5');
        statusEl.innerHTML = `<span class="inline-flex items-center gap-2"><span class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>${message}</span>`;
      }

      statusEl.classList.remove('hidden');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="inline-flex items-center gap-2"><span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>Sending...</span>`;
      }

      setStatus('processing', 'Sending your enquiry...');

      const payload = Object.fromEntries(new FormData(form).entries());
      payload.source = 'zamra-web';
      payload.submitted_at = new Date().toISOString();
      payload.page = window.location.href;

      try {
        const resp = await fetch(ENQUIRY_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          throw new Error('Webhook rejected the enquiry');
        }

        setStatus('success', 'Thanks! Your enquiry has been sent. We will contact you shortly.');
        form.reset();
      } catch (err) {
        setStatus('error', 'Something went wrong. Please try again or contact us on WhatsApp.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultBtnHtml;
        }
      }
    });
  };

  initEnquiryForm();

  // 5. Live Search Button Event Listener
  const liveSearchBtn = document.getElementById('live-search-btn');
  if (liveSearchBtn) {
    liveSearchBtn.addEventListener('click', () => {
      if (typeof searchFlights === 'function') {
        searchFlights();
      }
    });
  }

  // 6. Location Swap Logic
  const swapBtn = document.getElementById('swap-locations');
  const swapBtnMobile = document.getElementById('swap-locations-mobile');
  const originSelect = document.getElementById('origin');
  const destSelect = document.getElementById('destination');

  const swapLocations = () => {
    if (!originSelect || !destSelect) return;

    const temp = originSelect.value;
    originSelect.value = destSelect.value;

    // Once the route map has loaded the destination list belongs to whichever
    // origin is selected, so the swapped-in origin has to re-derive it. Setting
    // `.value` alone would silently no-op when the old origin is not a
    // destination of the new one, leaving the two selects describing a route the
    // search cannot answer — the bug this whole cascade exists to remove.
    if (_routeMap) {
      fillRouteSelect(destSelect, _routeMap.destinationsFor(originSelect.value), temp);
    } else {
      destSelect.value = temp;
    }
  };

  if (swapBtn) swapBtn.addEventListener('click', swapLocations);
  if (swapBtnMobile) swapBtnMobile.addEventListener('click', swapLocations);

  // 7. Cascade the destination select off the origin, once the live routes land.
  initRouteCascade(originSelect, destSelect);
});


/* ── CASCADING ROUTE SELECTS ── */

// Set once `getPublicRoutes` answers; stays null if the fetch failed, which is
// the signal to leave the hardcoded option lists exactly as they are.
let _routeMap = null;

// Both consumers of the route map — the From/To cascade and the sector-card
// grids — load on the same page, so the fetch is shared. Two calls would be two
// cold starts against the same cached answer.
let _routeMapPromise = null;
function loadRouteMap() {
  if (!_routeMapPromise) {
    _routeMapPromise = getPublicRoutes().then(buildRouteMap);
  }
  return _routeMapPromise;
}

/**
 * City labels already rendered in the HTML, keyed by IATA code.
 *
 * The static options are the source of the wording the site has always shown
 * ("Trivandrum (TRV)", "Mangalore (IXE)"), which differs from the canonical city
 * names in shared/airports.js ("Thiruvananthapuram", "Mangaluru"). Rebuilding the
 * options from the directory would silently rename airports in the UI, so the
 * existing labels are reused and the directory only fills in codes the HTML has
 * never listed.
 *
 * @param {...HTMLSelectElement} selects
 * @returns {Map<string, string>} IATA code → option label
 */
function snapshotOptionLabels(...selects) {
  const labels = new Map();
  for (const select of selects) {
    if (!select) continue;
    for (const option of select.options) {
      const code = String(option.value || '').toUpperCase();
      if (code && !labels.has(code)) labels.set(code, option.textContent.trim());
    }
  }
  return labels;
}

let _optionLabels = new Map();

/** "Kozhikode (CCJ)" for a code, falling back to the airport directory. */
function routeOptionLabel(code) {
  const known = _optionLabels.get(code);
  if (known) return known;
  const city = airportCity(code);
  return city && city !== code ? `${city} (${code})` : code;
}

/**
 * Replace a select's options with `codes`, keeping `preferred` selected when it
 * survives the new list.
 *
 * @param {HTMLSelectElement} select
 * @param {string[]} codes
 * @param {string} [preferred]
 */
function fillRouteSelect(select, codes, preferred) {
  if (!select || !codes.length) return;

  select.innerHTML = codes
    .map((code) => `<option value="${escapeHtml(code)}">${escapeHtml(routeOptionLabel(code))}</option>`)
    .join('');

  if (preferred && codes.includes(String(preferred).toUpperCase())) {
    select.value = String(preferred).toUpperCase();
  }
}

/**
 * Narrow both selects to routes that can actually return fares, and keep the
 * destination list in step with the origin from then on.
 *
 * @param {HTMLSelectElement} originSelect
 * @param {HTMLSelectElement} destSelect
 */
async function initRouteCascade(originSelect, destSelect) {
  if (!originSelect || !destSelect) return;

  _optionLabels = snapshotOptionLabels(originSelect, destSelect);

  // The change handler is wired before the fetch resolves so a fast click cannot
  // land between the options being narrowed and the cascade going live.
  originSelect.addEventListener('change', () => {
    if (!_routeMap) return;
    fillRouteSelect(destSelect, _routeMap.destinationsFor(originSelect.value));
  });

  const routeMap = await loadRouteMap();

  // No routes means the fetch failed or the fare table is genuinely empty. Either
  // way, narrowing to nothing would leave an unusable search — keep the static
  // lists and let the search report the empty result as it does today.
  if (!routeMap.size) return;

  _routeMap = routeMap;

  const wantedOrigin = originSelect.value.toUpperCase();
  const wantedDest = destSelect.value.toUpperCase();

  fillRouteSelect(originSelect, routeMap.origins, wantedOrigin);
  fillRouteSelect(destSelect, routeMap.destinationsFor(originSelect.value), wantedDest);
}




/* ── FLIGHT SEARCH LOGIC ── */
async function searchFlights() {
  const origin = document.getElementById('origin').value;
  const dest = document.getElementById('destination').value;
  const list = document.getElementById('flightList');
  const loader = document.getElementById('loading');
  const header = document.getElementById('resultsHeader');
  const origName = document.getElementById('origName');
  const locName = document.getElementById('locName');

  // Reset UI
  list.innerHTML = '';
  loader.style.display = 'block';
  header.style.display = 'none';

  try {
    const sectors = await getSectors();
    // The route map already knows the sector id for every pair it offered, and it
    // got that id from the sector document rather than by reassembling a code.
    // Matching on `"CCJ JED"` alone misses a sector stored as `CCJ-JED`, which
    // would strand a route the dropdown had just advertised as searchable.
    const sectorId = _routeMap ? _routeMap.sectorIdFor(origin, dest) : '';
    const sectorCode = `${origin} ${dest}`;
    const sector = (sectorId && sectors.find(s => s.id === sectorId))
      || sectors.find(s => s.sectorCode === sectorCode);


    let data = [];
    if (sector) {
      const today = new Date();
      today.setHours(0,0,0,0);

      const [rawFares, resolveFlightTime, airlines] = await Promise.all([
        getPublicFares({ sectorId: sector.id, startDate: today.toISOString() }),
        loadFlightTimeResolver(),
        getAirlines(),
      ]);
      const fares = dedupeAndSortFares(rawFares, { resolveFlightTime });

      const airlineMap = new Map(airlines.map((airline) => [airline.id, airline]));
      
      data = fares.map(fare => {
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const dateStr = fare.flightDate.toLocaleDateString('en-GB', dateOptions).replace(/,/g, ''); 
        
        const { departure: dep, arrival: arr } = splitFlightTimeRange(fare.flightTime);
        
        const airlineBrand = resolveAirlineBrand(airlineMap.get(fare.airlineId));

        // Baggage is airline policy, not fare data — legacy rows are corrected here.
        // Formatting lives in shared/airline-baggage.js so every surface agrees
        // on the unit spelling.
        const checkInBaggageStr = formatCheckInBaggageText(airlineBrand.code, fare.baggage);
        const cabinBaggageStr = formatHandBaggageText(airlineBrand.code);
        const baggageLabelStr = formatBaggageAllowanceShort(airlineBrand.code, fare.baggage);

        return {
          airline: airlineBrand.name,
          airlineCode: airlineBrand.code,
          airlineLogo: airlineBrand.logoUrl,
          airlineLogoFallback: airlineBrand.fallbackLogoUrl,
          airlineInitials: airlineBrand.initials,
          origin: sector.sectorFrom,
          originCode: origin,
          destination: sector.sectorTo,
          destinationCode: dest,
          date: dateStr,
          departure: dep,
          arrival: arr,
          price: "₹" + fare.finalRate.toLocaleString('en-IN'),
          seats: fare.seatsAvailable || 0,
          checkInBaggage: checkInBaggageStr,
          cabinBaggage: cabinBaggageStr,
          baggageLabel: baggageLabelStr
        };
      });
    }

    loader.style.display = 'none';
    header.style.display = 'block';
    if (origName) origName.innerText = origin;
    if (locName) locName.innerText = dest;

    if (!data || data.length === 0) {
      list.innerHTML = `<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found from ${origin} to ${dest}. Try another destination.</div>`;
      return;
    }

    // The compact mobile card drops the Book Now button, so the same items are
    // handed to the details sheet — it renders the CTA and the full detail.
    const cards = data.map(item => {
      const waMsg = encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:\n\n✈️ *${item.airline}*\n🛫 From: *${item.origin}*\n🛬 To: *${item.destination}*\n📅 Date: *${item.date}*\n⏰ Dep: ${item.departure} | Arr: ${item.arrival}\n💵 Price: *${item.price}*\n\nPlease confirm availability!`);
      return { ...item, waLink: `https://wa.me/919846606739?text=${waMsg}` };
    });

    list.innerHTML = cards.map(item => buildFlightCardHtml(item)).join('');
    wireFlightResultLogos(list);
    wireFlightCardSheet(list, cards, wireFlightResultLogos);

  } catch (error) {
    loader.style.display = 'none';
    if (list) list.innerHTML = `<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>`;
    console.error(error);
  }
}

// Expose to global scope for inline onclick handler from HTML
window.searchFlights = searchFlights;
