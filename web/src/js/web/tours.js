/**
 * tours.js — Public Tours Listing Page
 * Fetches active tours from Firestore and renders card grid.
 * Supports client-side category filter + text search.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initSiteChrome } from './site-chrome.js';

const firebaseConfig = {
  apiKey: "AIzaSyAktrHNfNsRzZQpt2KuyDFjmkDt48vBauA",
  authDomain: "zamra-web-01.firebaseapp.com",
  projectId: "zamra-web-01",
  storageBucket: "zamra-web-01.firebasestorage.app",
  messagingSenderId: "871356823310",
  appId: "1:871356823310:web:ca0d35ef2d21c6f602895f"
};

const app = initializeApp(firebaseConfig, 'tours-public');
const db = getFirestore(app);

let _allTours = [];
let _activeCategory = 'all';
let _searchText = '';
const HIDDEN_CATEGORIES = new Set(['hajj-umrah', 'hajj umrah', 'hajj/umrah']);

// ── Fetch Tours ──────────────────────────────────────────────────────────────
async function loadTours() {
  try {
    const snap = await getDocs(query(
      collection(db, 'tours'),
      where('isActive', '==', true)
    ));
    _allTours = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    _allTours = _allTours.filter(t => !HIDDEN_CATEGORIES.has(normalizeCategory(t.category)));
    _allTours.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } catch (e) {
    console.error('Error loading tours:', e);
    _allTours = [];
  }
  renderGrid();
}

// ── Filter + Render ──────────────────────────────────────────────────────────
function getFiltered() {
  let tours = _allTours;

  if (_activeCategory !== 'all') {
    tours = tours.filter(t => t.category === _activeCategory);
  }

  const q = _searchText.toLowerCase().trim();
  if (q) {
    tours = tours.filter(t =>
      (t.title || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.duration || '').toLowerCase().includes(q) ||
      (t.highlights || []).some(h => h.toLowerCase().includes(q))
    );
  }

  return tours;
}

function renderGrid() {
  const loading = document.getElementById('tours-loading');
  const grid = document.getElementById('tours-grid');
  const empty = document.getElementById('tours-empty');
  const countEl = document.getElementById('tours-count');

  if (!grid) return;

  const filtered = getFiltered();

  loading?.classList.add('hidden');

  if (filtered.length === 0) {
    grid.classList.add('hidden');
    empty?.classList.remove('hidden');
    if (countEl) countEl.classList.add('hidden');
    return;
  }

  empty?.classList.add('hidden');
  grid.classList.remove('hidden');

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} tour package${filtered.length !== 1 ? 's' : ''}`;
    countEl.classList.remove('hidden');
  }

  grid.innerHTML = filtered.map(tour => tourCard(tour)).join('');
}

function tourCard(tour) {
  const imgHtml = tour.coverImageUrl
    ? `<img src="${escHtml(tour.coverImageUrl)}" alt="${escHtml(tour.title)}" loading="lazy">`
    : `<div class="tour-card-image-placeholder"><i class="bi bi-image"></i></div>`;

  const price = tour.price && tour.price > 0
    ? `<div class="tour-price-value">₹${Number(tour.price).toLocaleString()}</div>`
    : `<div class="tour-price-value call"><i class="bi bi-telephone-fill"></i> Call for Price</div>`;

  const highlights = normalizeList(tour.highlights).slice(0, 3).map(h =>
    `<div class="tour-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${escHtml(h)}</span></div>`
  ).join('');

  const categoryColors = {
    'International': 'rgba(12,74,138,0.75)',
    'Domestic': 'rgba(5,122,85,0.75)',
  };
  const badgeBg = categoryColors[tour.category] || 'rgba(12,74,138,0.75)';

  return `
    <div class="tour-card">
      <div class="tour-card-image">
        ${imgHtml}
        <div class="tour-card-image-overlay"></div>
        <div class="tour-card-badges">
          <span class="tour-category-badge" style="background:${badgeBg};">${escHtml(tour.category || 'Tour')}</span>
        </div>
        <div class="tour-card-meta">
          <div class="tour-card-title">${escHtml(tour.title)}</div>
          <div class="tour-card-duration"><i class="bi bi-clock"></i> ${escHtml(tour.duration)}</div>
        </div>
      </div>
      <div class="tour-card-body">
        ${highlights ? `<div class="tour-highlights">${highlights}</div>` : '<div class="tour-highlights"><p class="text-[13px] text-text-muted">' + escHtml((tour.description || '').slice(0, 100)) + '…</p></div>'}
        <div class="tour-card-footer">
          <div class="tour-price">
            <span class="tour-price-label">${tour.price && tour.price > 0 ? 'Starting from' : 'Price'}</span>
            ${price}
          </div>
          <button type="button" class="tour-view-btn border-0 cursor-pointer" data-tour-id="${tour.id}">
            View Details <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeCategory(value = '') {
  return String(value).toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split('\n').map(v => v.trim()).filter(Boolean);
  }
  return [];
}

function buildIconList(items, iconClass) {
  if (!items.length) return '';
  return items.map(item =>
    `<div class="flex items-start gap-2 text-[13px] text-text-muted">
      <i class="${iconClass} text-[14px] mt-[2px]"></i>
      <span>${escHtml(item)}</span>
    </div>`
  ).join('');
}

function renderTourModal(tour) {
  const modal = document.getElementById('tour-modal');
  if (!modal) return;

  const hero = document.getElementById('tour-modal-hero');
  const titleEl = document.getElementById('tour-modal-title');
  const categoryEl = document.getElementById('tour-modal-category');
  const durationEl = document.querySelector('#tour-modal-duration span');
  const descEl = document.getElementById('tour-modal-description');
  const highlightsEl = document.getElementById('tour-modal-highlights');
  const itineraryEl = document.getElementById('tour-modal-itinerary');
  const inclusionsEl = document.getElementById('tour-modal-inclusions');
  const exclusionsEl = document.getElementById('tour-modal-exclusions');
  const priceEl = document.getElementById('tour-modal-price');
  const priceLabelEl = document.getElementById('tour-modal-price-label');
  const priceNoteEl = document.getElementById('tour-modal-price-note');
  const quickDurationEl = document.getElementById('tour-modal-quick-duration');
  const quickCategoryEl = document.getElementById('tour-modal-quick-category');
  const waBtn = document.getElementById('tour-modal-wa');

  const descBlock = document.getElementById('tour-modal-description-block');
  const highlightsBlock = document.getElementById('tour-modal-highlights-block');
  const itineraryBlock = document.getElementById('tour-modal-itinerary-block');
  const incExcBlock = document.getElementById('tour-modal-inc-exc');
  const inclusionsBlock = document.getElementById('tour-modal-inclusions-block');
  const exclusionsBlock = document.getElementById('tour-modal-exclusions-block');

  if (hero) {
    hero.style.backgroundImage = tour.coverImageUrl ? `url("${tour.coverImageUrl}")` : '';
  }
  if (titleEl) titleEl.textContent = tour.title || 'Tour Package';
  if (categoryEl) categoryEl.textContent = tour.category || 'Tour';
  if (durationEl) durationEl.textContent = tour.duration || '—';
  if (descEl) descEl.textContent = tour.description || '';
  if (descBlock) descBlock.classList.toggle('hidden', !tour.description);

  const highlights = normalizeList(tour.highlights);
  if (highlightsEl) highlightsEl.innerHTML = buildIconList(highlights, 'bi bi-check-circle-fill text-emerald-500');
  if (highlightsBlock) highlightsBlock.classList.toggle('hidden', !highlights.length);

  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  if (itineraryEl) {
    itineraryEl.innerHTML = itinerary.map((day, idx) => {
      const dayLabel = day?.day ? escHtml(day.day) : `Day ${idx + 1}`;
      const activities = Array.isArray(day?.activities) ? day.activities.filter(Boolean) : [];
      const actsHtml = activities.length
        ? `<ul class="list-disc pl-4 mt-1 space-y-1 text-[13px] text-text-muted">
            ${activities.map(a => `<li>${escHtml(a)}</li>`).join('')}
          </ul>`
        : '';
      return `
        <div class="relative pl-2">
          <div class="absolute -left-[9px] top-[6px] w-2.5 h-2.5 rounded-full bg-primary"></div>
          <div class="text-[14px] font-semibold text-navy">${dayLabel}</div>
          ${actsHtml}
        </div>
      `;
    }).join('');
  }
  if (itineraryBlock) itineraryBlock.classList.toggle('hidden', itinerary.length === 0);

  const inclusions = normalizeList(tour.inclusions);
  const exclusions = normalizeList(tour.exclusions);
  if (inclusionsEl) inclusionsEl.innerHTML = buildIconList(inclusions, 'bi bi-check-circle-fill text-emerald-500');
  if (exclusionsEl) exclusionsEl.innerHTML = buildIconList(exclusions, 'bi bi-x-circle-fill text-rose-500');

  if (inclusionsBlock) inclusionsBlock.classList.toggle('hidden', !inclusions.length);
  if (exclusionsBlock) exclusionsBlock.classList.toggle('hidden', !exclusions.length);
  if (incExcBlock) incExcBlock.classList.toggle('hidden', !inclusions.length && !exclusions.length);

  if (priceEl && priceLabelEl) {
    if (tour.price && tour.price > 0) {
      priceLabelEl.textContent = 'Starting from';
      priceEl.textContent = `₹${Number(tour.price).toLocaleString()}`;
      if (priceNoteEl) priceNoteEl.textContent = 'Per person';
    } else {
      priceLabelEl.textContent = 'Price';
      priceEl.textContent = 'Call for Price';
      if (priceNoteEl) priceNoteEl.textContent = '';
    }
  }

  if (quickDurationEl) quickDurationEl.textContent = tour.duration || '—';
  if (quickCategoryEl) quickCategoryEl.textContent = tour.category || '—';

  if (waBtn) {
    const msg = encodeURIComponent(`Hello Zamra Travels, I am interested in the ${tour.title} tour package (${tour.duration}). Please share full details.`);
    waBtn.href = `https://wa.me/919846606739?text=${msg}`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeTourModal() {
  const modal = document.getElementById('tour-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ── Event Wiring ─────────────────────────────────────────────────────────────
function wireEvents() {
  // Category chips
  document.getElementById('category-chips')?.addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;

    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    _activeCategory = chip.dataset.cat;
    renderGrid();
  });

  // Search input
  let debounce;
  document.getElementById('tours-search')?.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      _searchText = e.target.value;
      renderGrid();
    }, 220);
  });

  // Tour modal (view details)
  document.getElementById('tours-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tour-id]');
    if (!btn) return;
    const tour = _allTours.find(t => t.id === btn.dataset.tourId);
    if (tour) renderTourModal(tour);
  });

  document.getElementById('tour-modal-close')?.addEventListener('click', closeTourModal);
  document.getElementById('tour-modal-close-btn')?.addEventListener('click', closeTourModal);
  document.getElementById('tour-modal-backdrop')?.addEventListener('click', closeTourModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTourModal();
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSiteChrome({ enableSmoothScroll: false });
  wireEvents();
  loadTours();
});
