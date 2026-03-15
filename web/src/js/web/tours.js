/**
 * tours.js — Public Tours Listing Page
 * Fetches active tours from Firestore and renders card grid.
 * Supports client-side category filter + text search.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXVaGrWYqKwJBh7ow1GVCzTqnJJJDLlcM",
  authDomain: "zamra-web.firebaseapp.com",
  projectId: "zamra-web",
  storageBucket: "zamra-web.firebasestorage.app",
  messagingSenderId: "1087844474513",
  appId: "1:1087844474513:web:a6e8dcf6e3d0b4b5bc3671"
};

const app = initializeApp(firebaseConfig, 'tours-public');
const db = getFirestore(app);

let _allTours = [];
let _activeCategory = 'all';
let _searchText = '';

// ── Fetch Tours ──────────────────────────────────────────────────────────────
async function loadTours() {
  try {
    const snap = await getDocs(query(
      collection(db, 'tours'),
      where('isActive', '==', true)
    ));
    _allTours = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

  const highlights = (tour.highlights || []).slice(0, 3).map(h =>
    `<div class="tour-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${escHtml(h)}</span></div>`
  ).join('');

  const categoryColors = {
    'International': 'rgba(12,74,138,0.75)',
    'Domestic': 'rgba(5,122,85,0.75)',
    'Hajj-Umrah': 'rgba(120,60,5,0.75)',
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
          <a href="/tour-detail.html?id=${encodeURIComponent(tour.id)}" class="tour-view-btn">
            View Details <i class="bi bi-arrow-right"></i>
          </a>
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

  // Mobile nav toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-menu')?.classList.toggle('mobile-open');
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  loadTours();
});
