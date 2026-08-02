import '../shared/vercel-insights.js';
import { initSiteChrome } from './site-chrome.js';
import { buildSotoCardHtml, escapeHtml } from './soto-card.js';

// Like /deals, this page talks to endpoints and never touches Firestore.
//
// The Travelpayouts token is quota-metered and tied to our affiliate account,
// so the provider call has to happen server-side. Everything else follows from
// that: no Firebase SDK in this bundle, and the SOTO eligibility rule lives
// somewhere a visitor cannot route around.
const FN_BASE = 'https://asia-south1-zamra-web-01.cloudfunctions.net';
const FARES_ENDPOINT = `${FN_BASE}/searchSotoFares`;
const AIRPORTS_ENDPOINT = `${FN_BASE}/searchSotoAirports`;

const FALLBACK_NUMBER = '919846606739';
const TYPEAHEAD_DEBOUNCE_MS = 250;

/** Selected place per field, so a search sends codes rather than free text. */
const _picked = { origin: null, destination: null };

/** AbortControllers for the in-flight typeahead calls, one per field. */
const _typeaheadAbort = { origin: null, destination: null };

let _searchAbort = null;
let _searching = false;

function el(id) {
  return document.getElementById(id);
}

/* ── Airport typeahead ───────────────────────────────────────────────────── */

function fieldIds(field) {
  return field === 'origin'
    ? { input: 'soto-origin', list: 'soto-origin-list' }
    : { input: 'soto-destination', list: 'soto-dest-list' };
}

function closeList(field) {
  const list = el(fieldIds(field).list);
  if (!list) return;
  list.innerHTML = '';
  list.hidden = true;
}

function renderList(field, places) {
  const list = el(fieldIds(field).list);
  if (!list) return;

  if (!places.length) {
    list.innerHTML = '<div class="soto-suggest-empty">No matching airports</div>';
    list.hidden = false;
    return;
  }

  list.innerHTML = places.map((place) => `
    <button type="button" class="soto-suggest" data-code="${escapeHtml(place.code)}"
      data-city="${escapeHtml(place.city)}" data-country="${escapeHtml(place.countryName)}">
      <span class="soto-suggest-code">${escapeHtml(place.code)}</span>
      <span class="soto-suggest-text">
        <span class="soto-suggest-city">${escapeHtml(place.city)}</span>
        <span class="soto-suggest-meta">${escapeHtml(place.name)} · ${escapeHtml(place.countryName)}</span>
      </span>
    </button>
  `).join('');
  list.hidden = false;
}

function selectPlace(field, place) {
  _picked[field] = place;
  const input = el(fieldIds(field).input);
  if (input) input.value = `${place.city} (${place.code})`;
  closeList(field);
  syncSearchState();
}

async function runTypeahead(field, query) {
  // Cancel the previous keystroke's request — otherwise a slow early response
  // can land after a fast later one and repaint a stale list.
  if (_typeaheadAbort[field]) _typeaheadAbort[field].abort();
  const controller = new AbortController();
  _typeaheadAbort[field] = controller;

  try {
    const response = await fetch(`${AIRPORTS_ENDPOINT}?q=${encodeURIComponent(query)}&limit=8`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Airport lookup failed with ${response.status}`);

    const payload = await response.json();
    renderList(field, Array.isArray(payload.places) ? payload.places : []);
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error('Airport lookup failed:', err);
    closeList(field);
  }
}

function wireTypeahead(field) {
  const { input, list } = fieldIds(field);
  const inputEl = el(input);
  const listEl = el(list);
  if (!inputEl || !listEl) return;

  let timer = null;

  inputEl.addEventListener('input', () => {
    // Typing after a pick invalidates it — the code must always match the text.
    _picked[field] = null;
    syncSearchState();

    const query = inputEl.value.trim();
    clearTimeout(timer);
    if (query.length < 2) {
      closeList(field);
      return;
    }
    timer = setTimeout(() => runTypeahead(field, query), TYPEAHEAD_DEBOUNCE_MS);
  });

  listEl.addEventListener('click', (event) => {
    const button = event.target.closest('.soto-suggest');
    if (!button) return;
    selectPlace(field, {
      code: button.dataset.code,
      city: button.dataset.city,
      countryName: button.dataset.country,
    });
  });

  inputEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const first = listEl.querySelector('.soto-suggest');
    if (!first || listEl.hidden) return;
    event.preventDefault();
    selectPlace(field, {
      code: first.dataset.code,
      city: first.dataset.city,
      countryName: first.dataset.country,
    });
  });

  inputEl.addEventListener('blur', () => {
    // Let a click on a suggestion land before the list disappears.
    setTimeout(() => closeList(field), 150);
  });
}

/* ── Search form ─────────────────────────────────────────────────────────── */

function isReturnTrip() {
  return el('soto-trip')?.value === 'return';
}

function syncSearchState() {
  const button = el('soto-search-btn');
  if (!button) return;
  const ready = Boolean(_picked.origin && _picked.destination && el('soto-depart')?.value);
  button.disabled = !ready || _searching;
}

function syncTripState() {
  const returnInput = el('soto-return');
  if (!returnInput) return;
  const isReturn = isReturnTrip();
  returnInput.disabled = !isReturn;
  if (!isReturn) returnInput.value = '';
  returnInput.closest('.soto-field')?.classList.toggle('soto-field--disabled', !isReturn);
}

function setDateBounds() {
  const today = new Date();
  const horizon = new Date(today.getTime());
  horizon.setMonth(horizon.getMonth() + 11);

  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  ['soto-depart', 'soto-return'].forEach((id) => {
    const input = el(id);
    if (!input) return;
    input.min = key(today);
    input.max = key(horizon);
  });
}

function swapRoute() {
  const origin = _picked.origin;
  const destination = _picked.destination;
  const originInput = el('soto-origin');
  const destInput = el('soto-destination');

  const originText = originInput?.value || '';
  const destText = destInput?.value || '';

  _picked.origin = destination;
  _picked.destination = origin;
  if (originInput) originInput.value = destText;
  if (destInput) destInput.value = originText;

  syncSearchState();
}

/* ── Results ─────────────────────────────────────────────────────────────── */

function showOnly(id) {
  ['soto-prompt', 'soto-loading', 'soto-results', 'soto-empty', 'soto-error'].forEach((section) => {
    const node = el(section);
    if (node) node.hidden = section !== id;
  });
}

function showError(message) {
  const node = el('soto-error-text');
  if (node) node.textContent = message;
  showOnly('soto-error');
}

function renderSummary(payload) {
  const summary = el('soto-results-summary');
  if (!summary) return;

  const { origin, destination, departDate } = payload.query;
  const count = payload.fares.length;
  summary.innerHTML = `
    <span class="soto-summary-route">${escapeHtml(origin.city)} → ${escapeHtml(destination.city)}</span>
    <span class="soto-summary-meta">${count} fare${count === 1 ? '' : 's'} · ${escapeHtml(departDate)}</span>
  `;

  const notice = el('soto-stale-notice');
  if (notice) notice.hidden = !payload.stale;
}

function renderResults(payload) {
  const list = el('soto-results-list');
  if (!list) return;

  const context = {
    origin: payload.query.origin,
    destination: payload.query.destination,
    whatsappNumber: payload.whatsappNumber || FALLBACK_NUMBER,
    cachedAt: payload.cachedAt,
    now: new Date(),
  };

  list.innerHTML = payload.fares.map((fare) => buildSotoCardHtml(fare, context)).join('');
  renderSummary(payload);
  showOnly('soto-results');
}

/* ── The search itself ───────────────────────────────────────────────────── */

function syncUrl(params) {
  const url = new URL(window.location.href);
  url.searchParams.set('from', params.origin);
  url.searchParams.set('to', params.destination);
  url.searchParams.set('date', params.departDate);
  if (params.returnDate) url.searchParams.set('return', params.returnDate);
  else url.searchParams.delete('return');
  window.history.replaceState({}, '', url);
}

async function searchFares() {
  if (!_picked.origin || !_picked.destination) return;

  const departDate = el('soto-depart')?.value || '';
  if (!departDate) return;

  const params = {
    origin: _picked.origin.code,
    destination: _picked.destination.code,
    departDate,
    returnDate: isReturnTrip() ? (el('soto-return')?.value || '') : '',
    direct: el('soto-direct')?.checked ? 'true' : 'false',
  };

  syncUrl(params);

  if (_searchAbort) _searchAbort.abort();
  _searchAbort = new AbortController();

  _searching = true;
  syncSearchState();
  showOnly('soto-loading');

  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${FARES_ENDPOINT}?${query}`, {
      headers: { Accept: 'application/json' },
      signal: _searchAbort.signal,
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.success) {
      // The server writes the visitor-facing wording — it is the only side that
      // knows why a route was refused (India origin, bad date, provider down).
      showError(payload.message || 'We could not load fares for that route. Please try again.');
      return;
    }

    if (!Array.isArray(payload.fares) || !payload.fares.length) {
      renderSummary(payload);
      showOnly('soto-empty');
      return;
    }

    renderResults(payload);
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error('SOTO search failed:', err);
    showError('Could not reach our fare service. Check your connection and try again.');
  } finally {
    _searching = false;
    syncSearchState();
  }
}

/* ── Deep links ──────────────────────────────────────────────────────────── */

async function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const from = (params.get('from') || '').trim().toUpperCase();
  const to = (params.get('to') || '').trim().toUpperCase();
  const date = (params.get('date') || '').trim();
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || !date) return;

  try {
    const [originHits, destHits] = await Promise.all([
      fetch(`${AIRPORTS_ENDPOINT}?q=${from}&limit=1`).then((r) => r.json()),
      fetch(`${AIRPORTS_ENDPOINT}?q=${to}&limit=1`).then((r) => r.json()),
    ]);

    const origin = (originHits.places || [])[0];
    const destination = (destHits.places || [])[0];
    if (!origin || !destination || origin.code !== from || destination.code !== to) return;

    selectPlace('origin', origin);
    selectPlace('destination', destination);

    const departInput = el('soto-depart');
    if (departInput) departInput.value = date;

    const returnDate = (params.get('return') || '').trim();
    if (returnDate) {
      const trip = el('soto-trip');
      if (trip) trip.value = 'return';
      syncTripState();
      const returnInput = el('soto-return');
      if (returnInput) returnInput.value = returnDate;
    }

    syncSearchState();
    await searchFares();
  } catch (err) {
    console.error('SOTO deep link failed:', err);
  }
}

/* ── Boot ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initSiteChrome({ enableSmoothScroll: false });

  setDateBounds();
  syncTripState();
  wireTypeahead('origin');
  wireTypeahead('destination');

  el('soto-swap')?.addEventListener('click', swapRoute);
  el('soto-trip')?.addEventListener('change', syncTripState);
  el('soto-depart')?.addEventListener('change', syncSearchState);
  el('soto-search-btn')?.addEventListener('click', searchFares);
  el('soto-retry-btn')?.addEventListener('click', searchFares);

  el('soto-search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    searchFares();
  });

  syncSearchState();
  hydrateFromUrl();
});
