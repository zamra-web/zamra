// Visa page JavaScript
import { getVisas, getVisaStampings, getAttestations, getPassportServices } from '../admin/db.js';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Sticky Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.replace('bi-list', 'bi-x-lg');
      } else {
        icon.classList.replace('bi-x-lg', 'bi-list');
      }
    });
  }

  // Smooth scrolling for anchor links & close mobile menu
  const anchorLinks = document.querySelectorAll('a[href^="/index.html#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.querySelector('i').classList.replace('bi-x-lg', 'bi-list');
        }
      }
    });
  });

  // 3. Modal Setup
  const modal = document.getElementById('visa-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBanner = document.getElementById('modal-banner');
  const modalCountry = document.getElementById('modal-country');
  const modalType = document.getElementById('modal-type');
  const modalTime = document.getElementById('modal-time');
  const modalRate = document.getElementById('modal-rate');
  const modalEnquireBtn = document.getElementById('modal-enquire-btn');

  // Helper to format rate
  const formatRate = (rate) => {
    if (!rate && rate !== 0) return 'N/A';
    const num = parseFloat(rate);
    return isNaN(num) ? rate : `₹${num.toLocaleString('en-IN')}`;
  };

  const openModal = (data, serviceType) => {
    let title = '';
    let typeLabel = 'Type';
    let typeValue = '';
    let timeLabel = 'Processing Time';
    let timeValue = '';
    let rateValue = formatRate(data.rate);
    let waText = '';

    if (serviceType === 'visa') {
      title = data.country;
      typeValue = data.visaType || 'Tourist';
      timeValue = data.processingTime || 'N/A';
      
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-cover bg-center blur-[2px] opacity-40 scale-105" style="background-image: url('${data.flagUrl || '/assets/img/placeholder.jpg'}')"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center">
          <img src="${data.flagUrl || '/assets/img/placeholder.jpg'}" alt="${title}" class="w-full h-full object-cover">
        </div>
      `;
      
      waText = `Hello Zamra Travels, I am interested in exploring visa details for:\n\n🌍 Country: *${title}*\n📄 Visa Type: *${typeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide me with more information and the required documents.`;
      
    } else if (serviceType === 'stamping') {
      title = data.country || 'Unknown';
      typeValue = data.description || 'Visa Stamping';
      timeValue = data.processingTime || data.processing_time || 'N/A';
      
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-stamp"></i>
        </div>
      `;
      
      waText = `Hello Zamra Travels, I am interested in Visa Stamping details for:\n\n🌍 Country: *${title}*\n⏱️ Processing Time: *${timeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide me with more information.`;
      
    } else if (serviceType === 'attestation') {
      title = data.country || 'Unknown';
      typeValue = data.certificate || 'Attestation';
      timeLabel = 'Details';
      timeValue = data.description || 'N/A';
      
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-patch-check"></i>
        </div>
      `;
      
      waText = `Hello Zamra Travels, I am interested in Certificate Attestation for:\n\n🌍 Country: *${title}*\n📄 Certificate: *${typeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide me with more information.`;
      
    } else if (serviceType === 'passport') {
      title = data.type || 'Unknown';
      typeValue = 'Passport Service';
      timeValue = data.description || data.processing_time || 'N/A';
      
      modalBanner.innerHTML = `
        <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-80"></div>
        <div class="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 bg-white flex items-center justify-center text-primary text-[36px]">
          <i class="bi bi-journal-bookmark"></i>
        </div>
      `;
      
      waText = `Hello Zamra Travels, I am interested in Passport Services for:\n\n📄 Type: *${title}*\n⏱️ Details: *${timeValue}*\n💵 Rate: *${rateValue}*\n\nPlease provide me with more information.`;
    }

    modalCountry.textContent = title;
    
    // Update labels and values
    document.querySelector('#modal-type').previousElementSibling.querySelector('span').textContent = typeLabel;
    modalType.textContent = typeValue;
    
    document.querySelector('#modal-time').previousElementSibling.querySelector('span').textContent = timeLabel;
    if (serviceType === 'attestation') {
      document.querySelector('#modal-time').previousElementSibling.querySelector('i').className = 'bi bi-info-circle text-primary text-[18px]';
    } else {
      document.querySelector('#modal-time').previousElementSibling.querySelector('i').className = 'bi bi-hourglass-split text-primary text-[18px]';
    }
    modalTime.textContent = timeValue;
    
    modalRate.textContent = rateValue;

    // WA Button
    modalEnquireBtn.href = `https://wa.me/919846606739?text=${encodeURIComponent(waText)}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Fetch and Render Visas
  const loadVisas = async () => {
    const loadingState = document.getElementById('visas-loading');
    const emptyState = document.getElementById('visas-empty');
    const grid = document.getElementById('visas-grid');

    try {
      const visas = await getVisas();
      loadingState.style.display = 'none';

      if (visas.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        grid.innerHTML = '';
        grid.classList.remove('hidden');

        visas.sort((a, b) => a.country.localeCompare(b.country));

        visas.forEach(visa => {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-premium-soft)] overflow-hidden hover:shadow-[0_12px_32px_rgba(13,31,60,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group';
          
          card.innerHTML = `
            <div class="h-[140px] w-full relative overflow-hidden bg-slate-100 flex items-center justify-center p-6">
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
              <img src="${visa.flagUrl || '/assets/img/placeholder.jpg'}" alt="${visa.country}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute inset-0">
              <h3 class="text-white text-[22px] font-heading font-bold relative z-10 self-end w-full tracking-wide drop-shadow-md">${visa.country}</h3>
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">${visa.visaType || 'Tourist'}</span>
                <span class="text-text-muted text-[13px] font-medium flex items-center gap-1.5"><i class="bi bi-clock"></i> ${visa.processingTime || 'N/A'}</span>
              </div>
              <div class="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
                <div>
                  <div class="text-[12px] text-text-muted font-medium mb-0.5">Starting from</div>
                  <div class="text-[18px] font-black text-navy leading-none tracking-tight">${formatRate(visa.rate)}</div>
                </div>
                <button class="w-[40px] h-[40px] rounded-full bg-primary/5 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white view-details-btn">
                  <i class="bi bi-arrow-right text-[18px]"></i>
                </button>
              </div>
            </div>
          `;

          const btn = card.querySelector('.view-details-btn');
          btn.addEventListener('click', () => openModal(visa, 'visa'));

          grid.appendChild(card);
        });
      }
    } catch (error) {
      console.error('Error fetching visas:', error);
      loadingState.style.display = 'none';
      emptyState.classList.remove('hidden');
      emptyState.innerHTML = `
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="text-[20px] font-bold text-navy mb-2">Failed to load</h3>
        <p class="text-text-muted">An error occurred while loading visas. Please try again later.</p>
      `;
    }
  };

  // 5. Generic renderer for new services
  const renderServices = async (fetchFn, containerIdPrefix, serviceType, iconClass) => {
    const loadingState = document.getElementById(`${containerIdPrefix}-loading`);
    const emptyState = document.getElementById(`${containerIdPrefix}-empty`);
    const grid = document.getElementById(`${containerIdPrefix}-grid`);

    try {
      const items = await fetchFn();
      loadingState.style.display = 'none';

      if (!items || items.length === 0) {
        emptyState.classList.remove('hidden');
      } else {
        grid.innerHTML = '';
        grid.classList.remove('hidden');

        // Sort alphabetically by type
        items.sort((a, b) => (a.type || '').localeCompare(b.type || ''));

        items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-premium-soft)] p-6 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(13,31,60,0.08)] transition-all duration-300 flex flex-col group';
          
          let metaHtml = '';
          if (serviceType === 'attestation') {
            metaHtml = `<span class="text-text-muted text-[13px] font-medium flex-1 line-clamp-2" title="${item.certificate || ''}">${item.certificate || 'N/A'}</span>`;
          } else {
            metaHtml = `<span class="text-text-muted text-[13px] font-medium flex items-center gap-1.5"><i class="bi bi-clock"></i> ${item.processing_time || item.processingTime || 'N/A'}</span>`;
          }

          const rateToDisplay = item.cost !== undefined ? item.cost : item.rate;

          card.innerHTML = `
            <div class="flex items-start gap-4 mb-4">
              <div class="w-[50px] h-[50px] rounded-xl bg-primary/5 text-primary flex items-center justify-center text-[24px] shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <i class="${iconClass}"></i>
              </div>
              <div>
                <h3 class="text-[18px] font-bold text-navy leading-tight mb-2">${item.type || item.country}</h3>
                ${metaHtml}
              </div>
            </div>
            
            <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
              <div>
                <div class="text-[12px] text-text-muted font-medium mb-0.5">Rate</div>
                <div class="text-[18px] font-black text-navy leading-none tracking-tight">${formatRate(rateToDisplay)}</div>
              </div>
              <button class="w-[40px] h-[40px] rounded-full bg-primary/5 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white view-details-btn shrink-0">
                <i class="bi bi-arrow-right text-[18px]"></i>
              </button>
            </div>
          `;

          const btn = card.querySelector('.view-details-btn');
          btn.addEventListener('click', () => openModal({...item, rate: rateToDisplay}, serviceType));

          grid.appendChild(card);
        });
      }
    } catch (error) {
      console.error(`Error fetching ${serviceType}:`, error);
      loadingState.style.display = 'none';
      emptyState.classList.remove('hidden');
      emptyState.innerHTML = `<div class="text-red-500"><i class="bi bi-exclamation-triangle mr-2"></i> Failed to load data</div>`;
    }
  };

  // Run initializations
  loadVisas();
  renderServices(getVisaStampings, 'visa-stamping', 'stamping', 'bi bi-stamp');
  renderServices(getAttestations, 'attestations', 'attestation', 'bi bi-patch-check');
  renderServices(getPassportServices, 'passport-services', 'passport', 'bi bi-journal-bookmark');

});
