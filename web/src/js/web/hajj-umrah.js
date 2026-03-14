/**
 * hajj-umrah.js — Public Hajj & Umrah Listing Page
 * Fetches active packages from Firestore and renders card grid.
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

  const highlights = (pkg.highlights || []).slice(0, 2).map(h =>
    `<div class="hajjumrah-highlight-item"><i class="bi bi-check-circle-fill"></i><span>${escHtml(h)}</span></div>`
  ).join('');

  const badgeBg = pkg.type === 'Hajj' ? 'rgba(7, 49, 96, 0.75)' : 'rgba(217, 119, 6, 0.75)';

  const whatsappMessage = encodeURIComponent(`Hello Zamra Travels, I am interested in the ${pkg.title} package.`);

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

        ${highlights ? `<div class="hajjumrah-highlights">${highlights}</div>` : '<div class="hajjumrah-highlights"><p class="text-[13px] text-text-muted">' + escHtml((pkg.description || '').slice(0, 100)) + '…</p></div>'}
        
        <div class="hajjumrah-card-footer">
          <div class="hajjumrah-price">
            <span class="hajjumrah-price-label">${pkg.price && pkg.price > 0 ? 'Cost from' : 'Price'}</span>
            ${price}
          </div>
          <a href="https://wa.me/919846606739?text=${whatsappMessage}" target="_blank" class="hajjumrah-view-btn bg-[#25D366] hover:bg-[#1ea855]">
            <i class="bi bi-whatsapp"></i> Book
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
  document.getElementById('hajjumrah-search')?.addEventListener('input', e => {
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
  loadPackages();
});
