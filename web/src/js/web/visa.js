// Visa page JavaScript — Premium redesign
import { getVisas, getVisaStampings, getAttestations, getPassportServices } from '../admin/db.js';
import { initSiteChrome } from './site-chrome.js';

document.addEventListener('DOMContentLoaded', () => {

  initSiteChrome({ enableSmoothScroll: false });

  const header = document.getElementById('header');
  const escHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // ── 1. Tab Navigation ──────────────────────────────────────────────────────
  const tabMap = {
    visas: 'panel-visas',
    stamping: 'panel-stamping',
    attestations: 'panel-attestations',
    passport: 'panel-passport',
  };

  document.querySelectorAll('.visa-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update buttons
      document.querySelectorAll('.visa-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      document.querySelectorAll('.visa-section-panel').forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(tabMap[targetTab]);
      targetPanel?.classList.add('active');

      // Scroll to the active panel and keep it pinned below header + tab bar
      const tabBar = document.querySelector('.tab-bar-sticky');
      if (targetPanel) {
        const headerHeight = header?.offsetHeight || 0;
        const tabBarHeight = tabBar?.offsetHeight || 0;
        const offset = headerHeight + tabBarHeight + 8;
        const top = targetPanel.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      }
    });
  });

  // ── 4. Modal Setup ─────────────────────────────────────────────────────────
  const modal = document.getElementById('visa-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBanner = document.getElementById('modal-banner');
  const modalCountry = document.getElementById('modal-country');
  const modalTypeLabel = document.getElementById('modal-type-label');
  const modalType = document.getElementById('modal-type');
  const modalRate = document.getElementById('modal-rate');
  const modalEnquireBtn = document.getElementById('modal-enquire-btn');

  const formatRate = (rate) => {
    if (!rate && rate !== 0) return 'N/A';
    const num = parseFloat(rate);
    return isNaN(num) ? rate : `₹${num.toLocaleString('en-IN')}`;
  };

  const openModal = (data, serviceType) => {
    let title = '';
    let typeLabel = 'Type';
    let typeValue = '';
    let rateValue = formatRate(data.rate);
    let waText = '';
    let safeFlagUrl = '';

    if (serviceType === 'visa') {
      title = data.countryName || data.country || 'Unknown';
      typeValue = data.visaType || 'Tourist';
      safeFlagUrl = escHtml(data.flagUrl || '');
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-cover bg-center scale-105" style="background-image: url('${safeFlagUrl}'); filter: brightness(0.65) blur(2px);"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden relative z-10 bg-white">
          <img src="${safeFlagUrl}" alt="${escHtml(title)}" class="w-full h-full object-cover">
        </div>
      `;
      waText = `Hello Zamra Travels, I am interested in a visa for:\n\n🌍 Country: *${title}*\n📄 Visa Type: *${typeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide more information.`;

    } else if (serviceType === 'stamping') {
      title = data.country || 'Unknown';
      typeValue = data.description || 'Visa Stamping';
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-file-earmark-check"></i>
        </div>
      `;
      waText = `Hello Zamra Travels, I need visa stamping for:\n\n🌍 Country: *${title}*\n📋 Service: *${typeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide more details.`;

    } else if (serviceType === 'attestation') {
      title = data.country || 'Unknown';
      typeLabel = 'Certificate';
      typeValue = data.certificate || 'Attestation';
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-[#073160] to-primary opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `;
      waText = `Hello Zamra Travels, I need attestation for:\n\n🌍 Country: *${title}*\n📄 Certificate: *${typeValue}*\n💵 Rate: *${rateValue}*\n\nPlease get in touch.`;

    } else if (serviceType === 'passport') {
      title = data.type || 'Passport Service';
      typeLabel = 'Service';
      typeValue = data.description || 'Passport Service';
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#1e67c2] opacity-90"></div>
        <div class="w-[76px] h-[76px] rounded-2xl border-4 border-white/25 shadow-2xl relative z-10 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[34px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `;
      waText = `Hello Zamra Travels, I need:\n\n📄 Service: *${title}*\n💵 Rate: *${rateValue}*\n\nPlease get in touch.`;
    }

    modalCountry.textContent = title;
    modalTypeLabel.textContent = typeLabel;
    modalType.textContent = typeValue;
    modalRate.textContent = rateValue;
    modalEnquireBtn.href = `https://wa.me/919846606739?text=${encodeURIComponent(waText)}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ── 5. Render Tourist Visas ────────────────────────────────────────────────
  const loadVisas = async () => {
    const loadingEl = document.getElementById('visas-loading');
    const emptyEl = document.getElementById('visas-empty');
      const grid = document.getElementById('visas-grid');

    try {
      const visas = await getVisas();
      loadingEl.style.display = 'none';

      if (!visas || visas.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
      }

      visas.sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''));
      grid.innerHTML = '';
      grid.classList.remove('hidden');

      visas.forEach(visa => {
        const card = document.createElement('div');
        card.className = 'visa-card';
        const safeCountry = escHtml(visa.countryName || '');
        const safeVisaType = escHtml(visa.visaType || 'Tourist');
        const flagImg = visa.flagUrl
          ? `<img src="${escHtml(visa.flagUrl)}" alt="${safeCountry}" loading="lazy">`
          : `<div class="w-full h-full bg-gradient-to-br from-primary/60 to-blue-400/60"></div>`;

        card.innerHTML = `
          <div class="visa-card-image">
            ${flagImg}
            <div class="visa-card-image-overlay"></div>
            <h3>${safeCountry}</h3>
          </div>
          <div class="visa-card-body">
            <div class="flex items-center justify-between mb-3">
              <span class="visa-type-chip">${safeVisaType}</span>
            </div>
            <div class="visa-rate-row">
              <div>
                <small class="visa-rate small">Starting from</small>
                <div class="visa-rate">${escHtml(formatRate(visa.rate))}</div>
              </div>
              <button class="visa-enquire-btn view-btn">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        `;

        card.querySelectorAll('.view-btn').forEach(btn =>
          btn.addEventListener('click', () => openModal(visa, 'visa'))
        );
        grid.appendChild(card);
      });
    } catch (err) {
      console.error('Error fetching visas:', err);
      loadingEl.style.display = 'none';
      emptyEl.classList.remove('hidden');
      emptyEl.innerHTML = `
        <div class="w-20 h-20 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"><i class="bi bi-exclamation-triangle"></i></div>
        <h3 class="text-[18px] font-bold text-navy mb-2">Failed to Load</h3>
        <p class="text-text-muted">An error occurred. Please try again later.</p>
      `;
    }
  };

  // ── 6. Generic Service Renderer ────────────────────────────────────────────
  const renderServices = async (fetchFn, containerIdPrefix, serviceType, iconClass) => {
    const loadingEl = document.getElementById(`${containerIdPrefix}-loading`);
    const emptyEl = document.getElementById(`${containerIdPrefix}-empty`);
    const grid = document.getElementById(`${containerIdPrefix}-grid`);

    try {
      const items = await fetchFn();
      loadingEl.style.display = 'none';

      if (!items || items.length === 0) {
        emptyEl.classList.remove('hidden');
        return;
      }

      items.sort((a, b) => (a.country || a.type || '').localeCompare(b.country || b.type || ''));
      grid.innerHTML = '';
      grid.classList.remove('hidden');

      items.forEach(item => {
        const rateToDisplay = item.cost !== undefined ? item.cost : item.rate;
        const card = document.createElement('div');
        card.className = 'service-card';

        let titleLine = item.country || item.type || 'Service';
        let subLine = '';
        if (serviceType === 'attestation') {
          subLine = `<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${escHtml(item.certificate || '')}</p>`;
        } else {
          subLine = `<p class="text-text-muted text-[13px] leading-snug mt-1 line-clamp-2">${escHtml(item.description || '')}</p>`;
        }
        if (serviceType === 'stamping') {
          card.classList.add('service-card--stamping');
        }

        card.innerHTML = `
          <div class="flex items-start gap-4 mb-4">
            <div class="service-icon-wrap"><i class="${iconClass}"></i></div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[17px] font-bold text-navy leading-snug">${escHtml(titleLine)}</h3>
              ${subLine}
            </div>
          </div>
          <div class="service-rate-section">
            <div>
              <small class="service-rate small">Rate</small>
              <div class="service-rate">${escHtml(formatRate(rateToDisplay))}</div>
            </div>
            <button class="service-arrow-btn view-btn"><i class="bi bi-arrow-right"></i></button>
          </div>
        `;

        card.querySelector('.view-btn').addEventListener('click', () =>
          openModal({ ...item, rate: rateToDisplay }, serviceType)
        );
        grid.appendChild(card);
      });
    } catch (err) {
      console.error(`Error fetching ${serviceType}:`, err);
      loadingEl.style.display = 'none';
      emptyEl.classList.remove('hidden');
      emptyEl.innerHTML = `<div class="text-red-500 flex items-center justify-center gap-2"><i class="bi bi-exclamation-triangle"></i> Failed to load. Please try again.</div>`;
    }
  };

  // ── Init ───────────────────────────────────────────────────────────────────
  loadVisas();
  renderServices(getVisaStampings, 'visa-stamping', 'stamping', 'bi bi-file-earmark-check');
  renderServices(getAttestations, 'attestations', 'attestation', 'bi bi-patch-check');
  renderServices(getPassportServices, 'passport-services', 'passport', 'bi bi-journal-bookmark');

});
