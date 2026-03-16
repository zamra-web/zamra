/**
 * hajj-umrah.js — Public Hajj & Umrah Listing Page
 * Fetches active packages from Firestore and renders card grid.
 * Supports client-side category filter + text search.
 */

import '../shared/vercel-insights.js';
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

const app = initializeApp(firebaseConfig, 'hajj-umrah-public');
const db = getFirestore(app);

let _allPackages = [];
let _activeCategory = 'all';
let _searchText = '';

// ── Fetch Packages ───────────────────────────────────────────────────────────
async function loadPackages() {
  try {
    const snap = await getDocs(query(
      collection(db, 'hajj_umrah_packages'),
      where('isActive', '==', true)
    ));
    _allPackages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort client-side by departureDate so no composite index is needed
    _allPackages.sort((a, b) => (a.departureDate || '').localeCompare(b.departureDate || ''));
  } catch (e) {
    console.error('Error loading packages:', e);
    _allPackages = [];
  }
  renderGrid();
}

// ── Filter + Render ──────────────────────────────────────────────────────────
function getFiltered() {
  let packages = _allPackages;

  if (_activeCategory !== 'all') {
    packages = packages.filter(p => p.type === _activeCategory);
  }

  const q = _searchText.toLowerCase().trim();
  if (q) {
    packages = packages.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q) ||
      (p.departureCity || '').toLowerCase().includes(q) ||
      (p.airline || '').toLowerCase().includes(q) ||
      (p.highlights || []).some(h => h.toLowerCase().includes(q))
    );
  }

  return packages;
}

function renderGrid() {
  const loading = document.getElementById('hajjumrah-loading');
  const grid = document.getElementById('hajjumrah-grid');
  const empty = document.getElementById('hajjumrah-empty');
  const countEl = document.getElementById('hajjumrah-count');

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
    countEl.textContent = `Showing ${filtered.length} package${filtered.length !== 1 ? 's' : ''}`;
    countEl.classList.remove('hidden');
  }

  grid.innerHTML = filtered.map(pkg => packageCard(pkg)).join('');
}

function packageCard(pkg) {
  const imgHtml = pkg.coverImageUrl
    ? `<img src="${escHtml(pkg.coverImageUrl)}" alt="${escHtml(pkg.title)}" loading="lazy">`
    : `<div class="hajjumrah-card-image-placeholder"><i class="bi bi-image"></i></div>`;

  const price = pkg.price && pkg.price > 0
    ? `<div class="hajjumrah-price-value">₹${Number(pkg.price).toLocaleString()}</div>`
    : `<div class="hajjumrah-price-value call"><i class="bi bi-telephone-fill"></i> Call for Price</div>`;

  const highlightsPreview = normalizeList(pkg.highlights).slice(0, 3);
  const highlightsHtml = highlightsPreview.map(h =>
    `<div class="hajjumrah-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${escHtml(h)}</span></div>`
  ).join('');

  const descSnippet = (pkg.description || '').trim();
  const detailsPreview = highlightsHtml
    ? `<div class="hajjumrah-highlights">${highlightsHtml}</div>`
    : descSnippet
      ? `<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">${escHtml(descSnippet.slice(0, 100))}…</p></div>`
      : '<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">Contact us for full package details.</p></div>';

  const badgeBg = pkg.type === 'Hajj' ? 'rgba(7, 49, 96, 0.75)' : 'rgba(217, 119, 6, 0.75)';

  return `
    <div class="hajjumrah-card">
      <div class="hajjumrah-card-image">
        ${imgHtml}
        <div class="hajjumrah-card-image-overlay"></div>
        <div class="hajjumrah-card-badges">
          <span class="hajjumrah-category-badge" style="background:${badgeBg};">${escHtml(pkg.type || 'Umrah')}</span>
        </div>
        <div class="hajjumrah-card-meta">
          <div class="hajjumrah-card-title">${escHtml(pkg.title)}</div>
          <div class="hajjumrah-card-duration"><i class="bi bi-clock"></i> ${pkg.days} Days / ${pkg.nights} Nights</div>
        </div>
      </div>
      <div class="hajjumrah-card-body">
        
        <div class="hajjumrah-details-grid">
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Departure</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-geo-alt text-primary opacity-80"></i> ${escHtml(pkg.departureCity)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Airline</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-airplane text-primary opacity-80"></i> ${escHtml(pkg.airline)}</span>
          </div>
          <div class="hajjumrah-detail-item">
            <span class="hajjumrah-detail-label">Date</span>
            <span class="hajjumrah-detail-value"><i class="bi bi-calendar3 text-primary opacity-80"></i> ${escHtml(pkg.departureDate)}</span>
          </div>
        </div>

        ${detailsPreview}
        
        <div class="hajjumrah-card-footer">
          <div class="hajjumrah-price">
            <span class="hajjumrah-price-label">${pkg.price && pkg.price > 0 ? 'Cost from' : 'Price'}</span>
            ${price}
          </div>
          <button type="button" class="hajjumrah-view-btn border-0 cursor-pointer" data-hajjumrah-id="${pkg.id}">
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

function renderHajjUmrahModal(pkg) {
  const modal = document.getElementById('hajjumrah-modal');
  if (!modal) return;

  const hero = document.getElementById('hajjumrah-modal-hero');
  const typeEl = document.getElementById('hajjumrah-modal-type');
  const titleEl = document.getElementById('hajjumrah-modal-title');
  const durationEl = document.querySelector('#hajjumrah-modal-duration span');
  const descEl = document.getElementById('hajjumrah-modal-description');
  const highlightsEl = document.getElementById('hajjumrah-modal-highlights');
  const inclusionsEl = document.getElementById('hajjumrah-modal-inclusions');
  const priceEl = document.getElementById('hajjumrah-modal-price');
  const priceLabelEl = document.getElementById('hajjumrah-modal-price-label');
  const priceNoteEl = document.getElementById('hajjumrah-modal-price-note');
  const waBtn = document.getElementById('hajjumrah-modal-wa');

  const depEl = document.getElementById('hajjumrah-modal-departure');
  const airlineEl = document.getElementById('hajjumrah-modal-airline');
  const dateEl = document.getElementById('hajjumrah-modal-date');
  const quickDepEl = document.getElementById('hajjumrah-modal-quick-departure');
  const quickAirlineEl = document.getElementById('hajjumrah-modal-quick-airline');
  const quickDateEl = document.getElementById('hajjumrah-modal-quick-date');

  const descBlock = document.getElementById('hajjumrah-modal-description-block');
  const highlightsBlock = document.getElementById('hajjumrah-modal-highlights-block');
  const inclusionsBlock = document.getElementById('hajjumrah-modal-inclusions-block');

  if (hero) {
    hero.style.backgroundImage = pkg.coverImageUrl ? `url("${pkg.coverImageUrl}")` : '';
  }
  if (typeEl) typeEl.textContent = pkg.type || 'Umrah';
  if (titleEl) titleEl.textContent = pkg.title || 'Package';
  if (durationEl) durationEl.textContent = `${pkg.days || '—'} Days / ${pkg.nights || '—'} Nights`;

  if (depEl) depEl.textContent = pkg.departureCity || '—';
  if (airlineEl) airlineEl.textContent = pkg.airline || '—';
  if (dateEl) dateEl.textContent = pkg.departureDate || '—';
  if (quickDepEl) quickDepEl.textContent = pkg.departureCity || '—';
  if (quickAirlineEl) quickAirlineEl.textContent = pkg.airline || '—';
  if (quickDateEl) quickDateEl.textContent = pkg.departureDate || '—';

  if (descEl) descEl.textContent = pkg.description || '';
  if (descBlock) descBlock.classList.toggle('hidden', !pkg.description);

  const highlights = normalizeList(pkg.highlights);
  const inclusions = normalizeList(pkg.inclusions);
  if (highlightsEl) highlightsEl.innerHTML = buildIconList(highlights, 'bi bi-check-circle-fill text-emerald-500');
  if (inclusionsEl) inclusionsEl.innerHTML = buildIconList(inclusions, 'bi bi-check-circle-fill text-emerald-500');
  if (highlightsBlock) highlightsBlock.classList.toggle('hidden', !highlights.length);
  if (inclusionsBlock) inclusionsBlock.classList.toggle('hidden', !inclusions.length);

  if (priceEl && priceLabelEl) {
    if (pkg.price && pkg.price > 0) {
      priceLabelEl.textContent = 'Cost from';
      priceEl.textContent = `₹${Number(pkg.price).toLocaleString()}`;
      if (priceNoteEl) priceNoteEl.textContent = 'Per person';
    } else {
      priceLabelEl.textContent = 'Price';
      priceEl.textContent = 'Call for Price';
      if (priceNoteEl) priceNoteEl.textContent = '';
    }
  }

  if (waBtn) {
    const msg = encodeURIComponent(`Hello Zamra Travels, I am interested in the ${pkg.title} ${pkg.type ? `(${pkg.type})` : ''} package from ${pkg.departureCity || 'your city'} on ${pkg.departureDate || 'your upcoming date'}. Please share full details.`);
    waBtn.href = `https://wa.me/919846606739?text=${msg}`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeHajjUmrahModal() {
  const modal = document.getElementById('hajjumrah-modal');
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
  document.getElementById('hajjumrah-search')?.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      _searchText = e.target.value;
      renderGrid();
    }, 220);
  });

  // Hajj/Umrah modal (view details)
  document.getElementById('hajjumrah-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hajjumrah-id]');
    if (!btn) return;
    const pkg = _allPackages.find(p => p.id === btn.dataset.hajjumrahId);
    if (pkg) renderHajjUmrahModal(pkg);
  });

  document.getElementById('hajjumrah-modal-close')?.addEventListener('click', closeHajjUmrahModal);
  document.getElementById('hajjumrah-modal-close-btn')?.addEventListener('click', closeHajjUmrahModal);
  document.getElementById('hajjumrah-modal-backdrop')?.addEventListener('click', closeHajjUmrahModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHajjUmrahModal();
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSiteChrome({ enableSmoothScroll: false });
  wireEvents();
  loadPackages();
});
