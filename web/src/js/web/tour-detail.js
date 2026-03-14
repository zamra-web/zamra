/**
 * tour-detail.js — Tour Detail Page
 * Fetches a single tour by ?id= param from Firestore, renders full detail.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXVaGrWYqKwJBh7ow1GVCzTqnJJJDLlcM",
  authDomain: "zamra-web.firebaseapp.com",
  projectId: "zamra-web",
  storageBucket: "zamra-web.firebasestorage.app",
  messagingSenderId: "1087844474513",
  appId: "1:1087844474513:web:a6e8dcf6e3d0b4b5bc3671"
};

const app = initializeApp(firebaseConfig, 'tour-detail-public');
const db = getFirestore(app);

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Load single tour + all active tours ─────────────────────────────────────
async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get('id');

  if (!tourId) {
    showNotFound();
    return;
  }

  try {
    // Fetch current tour by ID
    const tourRef = doc(db, 'tours', tourId);
    const tourSnap = await getDoc(tourRef);

    if (!tourSnap.exists() || tourSnap.data().isActive === false) {
      showNotFound();
      return;
    }

    const tour = { id: tourSnap.id, ...tourSnap.data() };

    // Fetch all other active tours for sidebar
    const allSnap = await getDocs(query(
      collection(db, 'tours'),
      where('isActive', '==', true),
      orderBy('title')
    ));
    const otherTours = allSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(t => t.id !== tourId);

    renderDetail(tour, otherTours);
  } catch (e) {
    console.error('Error loading tour detail:', e);
    showNotFound();
  }
}

// ── Show / Hide states ───────────────────────────────────────────────────────
function showNotFound() {
  document.getElementById('detail-loading')?.classList.add('hidden');
  document.getElementById('detail-not-found')?.classList.remove('hidden');
}

function showContent() {
  document.getElementById('detail-loading')?.classList.add('hidden');
  document.getElementById('detail-content')?.classList.remove('hidden');
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderDetail(tour, otherTours) {
  // Page meta
  document.title = `${tour.title} – Zamra Travels`;
  document.getElementById('page-title').textContent = `${tour.title} Tour Package – Zamra Travels`;
  document.getElementById('page-desc')?.setAttribute('content', tour.description?.slice(0, 155) || '');

  // Breadcrumb
  const bcTitle = document.getElementById('breadcrumb-title');
  if (bcTitle) bcTitle.textContent = tour.title;

  // Category badge
  const catBadge = document.getElementById('detail-cat-badge');
  if (catBadge && tour.category) {
    catBadge.textContent = tour.category;
    catBadge.classList.remove('hidden');
  }

  // Hero
  const heroEl = document.getElementById('detail-hero');
  const coverImg = document.getElementById('detail-cover-img');
  if (tour.coverImageUrl && coverImg) {
    coverImg.src = tour.coverImageUrl;
    coverImg.alt = tour.title;
    coverImg.classList.remove('hidden');
  } else if (heroEl) {
    heroEl.style.background = 'linear-gradient(135deg, #0c4a8a, #073160)';
  }

  // Title + Duration
  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = tour.title;

  const durationEl = document.getElementById('detail-duration');
  if (durationEl) durationEl.innerHTML = `<i class="bi bi-clock"></i> ${esc(tour.duration || '')}`;

  // Description
  const descEl = document.getElementById('detail-description');
  if (descEl) descEl.textContent = tour.description || '';
  const descCard = document.getElementById('section-desc');
  if (descCard && !tour.description) descCard.classList.add('hidden');

  // Itinerary
  renderItinerary(tour.itinerary || []);

  // Inclusions
  renderList(document.getElementById('detail-inclusions'), tour.inclusions || [], 'inc');
  renderList(document.getElementById('detail-exclusions'), tour.exclusions || [], 'exc');
  // Hide exclusions section if empty
  if (!(tour.exclusions || []).length) {
    document.getElementById('section-excl-wrap')?.classList.add('hidden');
  }
  // Hide itinerary section if empty
  if (!(tour.itinerary || []).length) {
    document.getElementById('section-itinerary')?.classList.add('hidden');
  }
  // Hide inclusions section if both empty
  if (!(tour.inclusions || []).length && !(tour.exclusions || []).length) {
    document.getElementById('section-inc-exc')?.classList.add('hidden');
  }

  // Sidebar price
  const priceVal = document.getElementById('sidebar-price');
  const priceLabel = document.getElementById('sidebar-price-label');
  if (priceVal) {
    if (tour.price && tour.price > 0) {
      priceVal.textContent = `₹${Number(tour.price).toLocaleString()}`;
      if (priceLabel) priceLabel.textContent = 'Starting from';
    } else {
      priceVal.textContent = 'Call for Price';
      priceVal.classList.add('call');
      if (priceLabel) priceLabel.textContent = 'Price';
    }
  }

  // Sidebar info rows
  const sdDuration = document.getElementById('sidebar-duration');
  if (sdDuration) sdDuration.textContent = tour.duration || '—';
  const sdCat = document.getElementById('sidebar-category');
  if (sdCat) sdCat.textContent = tour.category || '—';

  // Sidebar WhatsApp link
  const waBtn = document.getElementById('sidebar-wa-btn');
  if (waBtn) {
    const msg = encodeURIComponent(`Hello Zamra Travels, I am interested in the ${tour.title} tour package (${tour.duration}). Please share more details.`);
    waBtn.href = `https://wa.me/919846606739?text=${msg}`;
  }

  // Other Tours sidebar
  renderOtherTours(otherTours.slice(0, 5));

  showContent();
}

function renderItinerary(days) {
  const container = document.getElementById('detail-itinerary');
  if (!container) return;
  if (!days.length) return;

  container.innerHTML = days.map((day, i) => {
    const acts = (day.activities || []).map(a =>
      `<div class="day-activity"><i class="bi bi-check-circle-fill"></i><span>${esc(a)}</span></div>`
    ).join('');

    return `
      <div class="itinerary-day">
        <div class="day-line"></div>
        <div class="day-badge-col">
          <div class="day-badge">Day ${i + 1}</div>
        </div>
        <div class="day-content">
          <div class="day-title">${esc(day.dayTitle || `Day ${i + 1}`)}</div>
          <div class="day-activities">${acts || '<div class="day-activity"><i class="bi bi-dot"></i><span>Details coming soon</span></div>'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderList(el, items, type) {
  if (!el) return;
  el.innerHTML = items.map(item =>
    `<div class="inclusion-item ${type}">
      <i class="bi ${type === 'inc' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
      <span>${esc(item)}</span>
    </div>`
  ).join('');
}

function renderOtherTours(tours) {
  const el = document.getElementById('other-tours-list');
  if (!el) return;
  if (!tours.length) {
    el.innerHTML = '<p class="text-[13px] text-text-muted">No other packages available.</p>';
    return;
  }

  el.innerHTML = tours.map(t => {
    const imgHtml = t.coverImageUrl
      ? `<img src="${esc(t.coverImageUrl)}" alt="${esc(t.title)}" class="other-tour-img" loading="lazy">`
      : `<div class="other-tour-img-placeholder"><i class="bi bi-image"></i></div>`;

    return `
      <a href="/tour-detail.html?id=${encodeURIComponent(t.id)}" class="other-tour-link">
        ${imgHtml}
        <div>
          <div class="other-tour-name">${esc(t.title)}</div>
          <div class="other-tour-duration">${esc(t.duration)}</div>
        </div>
        <i class="bi bi-arrow-right-short ml-auto text-text-muted text-[18px]"></i>
      </a>
    `;
  }).join('');
}

// ── Mobile Nav ───────────────────────────────────────────────────────────────
document.getElementById('mobile-toggle')?.addEventListener('click', () => {
  document.getElementById('nav-menu')?.classList.toggle('mobile-open');
});

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadData);
