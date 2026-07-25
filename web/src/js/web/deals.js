import '../shared/vercel-insights.js';
import { initSiteChrome } from './site-chrome.js';
import { parseDealSlugFromLocation } from '../shared/deal-links.js';

// This page talks to one endpoint and never touches Firestore.
//
// Reading `agent_fares` from the browser would hand every visitor the supplier
// economics on each row — `specialRate`, `commission`, the supplier `agentId`.
// `getPublicDeals` projects fares down to display fields on the server, so a
// link broadcast to a WhatsApp group publishes prices and nothing else. It also
// means no Firebase SDK in this bundle, which matters when the page is opened
// on mobile data.
const DEALS_ENDPOINT = 'https://asia-south1-zamra-web-01.cloudfunctions.net/getPublicDeals';

const BOOKING_NUMBER = '919846606739';
const STALE_AFTER_MS = 5 * 60 * 1000;

let _lastLoadedAt = 0;
let _loading = false;

function el(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

function formatRate(price) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return '₹0';
  return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderState(iconClass, message) {
  const content = el('deals-content');
  if (!content) return;
  content.innerHTML = `
    <div class="deals-state">
      <i class="bi ${iconClass}"></i>
      <p class="mt-3 font-semibold">${escapeHtml(message)}</p>
    </div>
  `;
}

function sectorHeading(section) {
  const from = String(section.from || '').trim();
  const to = String(section.to || '').trim();
  if (from && to) return `${from} → ${to}`;
  return String(section.sectorCode || 'Flight Deals').trim();
}

function buildBookingLink(section, fare) {
  const message = [
    'Hello Zamra Travels, I saw this fare on your deals page:',
    '',
    sectorHeading(section),
    `${fare.airlineName} · ${formatDate(fare.date)}`,
    `Fare: ${formatRate(fare.price)}`,
    '',
    'Please confirm availability.',
  ].join('\n');

  return `https://wa.me/${BOOKING_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderAirlineCell(fare) {
  const name = escapeHtml(fare.airlineName || 'Airline');
  if (!fare.airlineLogo) return name;

  return `
    <span class="deals-airline">
      <img src="${escapeHtml(fare.airlineLogo)}" alt="" class="deals-airline-logo" loading="lazy"
        onerror="this.remove()">
      <span>${name}</span>
    </span>
  `;
}

function renderSectorCard(section) {
  const fares = Array.isArray(section.fares) ? section.fares : [];
  if (!fares.length) return '';

  const rows = fares.map((fare) => {
    const isLowest = Number(fare.price) === Number(section.lowestPrice);
    const baggage = `${fare.checkInBaggageKg} + ${fare.handBaggageKg} kg`;

    return `
      <tr>
        <td data-label="Date"><strong>${escapeHtml(formatDate(fare.date))}</strong></td>
        <td data-label="Airline">${renderAirlineCell(fare)}</td>
        <td data-label="Time">${escapeHtml(fare.time || '—')}</td>
        <td data-label="Baggage"><span class="deals-baggage-chip">${escapeHtml(baggage)}</span></td>
        <td data-label="Fare">
          <span class="deals-fare">${escapeHtml(formatRate(fare.price))}</span>
          ${isLowest ? '<span class="deals-lowest-tag"><i class="bi bi-fire"></i>Lowest</span>' : ''}
        </td>
        <td data-label="Book">
          <a class="deals-book-btn" href="${escapeHtml(buildBookingLink(section, fare))}" target="_blank" rel="noopener">
            <i class="bi bi-whatsapp"></i> Book
          </a>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <section class="deals-sector-card">
      <div class="deals-sector-head">
        <h2 class="deals-sector-title">${escapeHtml(sectorHeading(section))}</h2>
        <span class="deals-sector-count">${fares.length} fare${fares.length === 1 ? '' : 's'} · from ${escapeHtml(formatRate(section.lowestPrice))}</span>
      </div>
      <div style="overflow-x:auto;">
        <table class="deals-table">
          <thead>
            <tr>
              <th>Date</th><th>Airline</th><th>Time</th><th>Baggage</th><th>Fare</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

async function loadDeals({ silent = false } = {}) {
  if (_loading) return;
  _loading = true;

  try {
    const slug = parseDealSlugFromLocation(window.location);
    if (!slug) {
      el('deals-title').textContent = 'Deals link not found';
      renderState('bi-question-circle', 'This address is missing a deal link. Ask us for a fresh link.');
      return;
    }

    if (!silent) renderState('bi-airplane-engines', 'Loading live fares…');

    const response = await fetch(`${DEALS_ENDPOINT}?slug=${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    });

    // A deleted link and a switched-off link are the same thing to a visitor:
    // the offer is gone. The endpoint 404s both, and so does this.
    if (response.status === 404) {
      el('deals-title').textContent = 'This link is no longer available';
      el('deals-subtitle').textContent = '';
      el('deals-updated').textContent = '';
      renderState('bi-slash-circle', 'The offer has ended or the link was turned off. Message us for current fares.');
      return;
    }

    if (!response.ok) throw new Error(`Request failed with ${response.status}`);

    const payload = await response.json();
    if (!payload.success) throw new Error(payload.error || 'Lookup failed');

    const link = payload.link || {};
    document.title = `${link.title || 'Live Flight Deals'} – Zamra Travels`;
    el('deals-title').textContent = link.title || 'Live Flight Deals';
    el('deals-subtitle').textContent = link.subtitle || '';

    const sections = Array.isArray(payload.sections) ? payload.sections : [];
    const html = sections.map(renderSectorCard).filter(Boolean).join('');

    if (!html) {
      renderState('bi-calendar-x', 'No fares are loaded for these dates right now. Message us and we will quote you.');
    } else {
      el('deals-content').innerHTML = html;
    }

    const updated = el('deals-updated');
    if (updated) {
      const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      updated.textContent = link.windowStart && link.windowEnd
        ? `Prices as at ${time} · ${formatDate(link.windowStart)} – ${formatDate(link.windowEnd)}`
        : `Prices as at ${time}`;
    }

    _lastLoadedAt = Date.now();
  } catch (err) {
    console.error('Deals load failed:', err);
    renderState('bi-exclamation-triangle', 'Could not load fares. Please check your connection and try again.');
  } finally {
    _loading = false;
  }
}

initSiteChrome({ enableSmoothScroll: false });
loadDeals();

el('deals-refresh-btn')?.addEventListener('click', () => loadDeals());

// Someone who leaves the page open in a WhatsApp browser and comes back later
// should not be looking at a stale price.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (Date.now() - _lastLoadedAt < STALE_AFTER_MS) return;
  loadDeals({ silent: true });
});
