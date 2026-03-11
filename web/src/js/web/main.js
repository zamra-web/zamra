// Modern Zamra Travels JavaScript
import { getSectors, getFares, getAirlines } from '../admin/db.js';

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
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.querySelector('i').classList.replace('bi-x-lg', 'bi-list');
        }
      }

      // Perform smooth scrolling
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault(); // Prevent default jump / refresh
          
          const headerOffset = 80; // height of the sticky header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          
          // Optionally update URL hash without scrolling
          window.history.pushState(null, '', targetId);
        }
      }
    });
  });

  // 3. Populate Sectors Dynamically
  const indianAirports = [
    { id: 'kozhikode', code: 'CCJ', name: 'Kozhikode' },
    { id: 'kochi', code: 'COK', name: 'Kochi' },
    { id: 'kannur', code: 'CNN', name: 'Kannur' },
    { id: 'trivandrum', code: 'TRV', name: 'Trivandrum' },
    { id: 'mangalore', code: 'IXE', name: 'Mangalore' }
  ];

  const middleEastAirports = [
    { id: 'jeddah', code: 'JED', name: 'Jeddah' },
    { id: 'riyadh', code: 'RUH', name: 'Riyadh' },
    { id: 'dammam', code: 'DMM', name: 'Dammam' },
    { id: 'doha', code: 'DOH', name: 'Doha' },
    { id: 'muscat', code: 'MCT', name: 'Muscat' },
    { id: 'bahrain', code: 'BAH', name: 'Bahrain' },
    { id: 'kuwait', code: 'KWI', name: 'Kuwait' },
    { id: 'dubai', code: 'DXB', name: 'Dubai' },
    { id: 'sharjah', code: 'SHJ', name: 'Sharjah' },
    { id: 'abudhabi', code: 'AUH', name: 'Abu Dhabi' },
    { id: 'rasalkhaimah', code: 'RKT', name: 'Ras Al Khaimah' },
    { id: 'alain', code: 'AAN', name: 'Al Ain' },
    { id: 'fujairah', code: 'FJR', name: 'Fujairah' }
  ];

  const gridsContainer = document.getElementById('flight-grids-container');

  if (gridsContainer) {
    const renderSection = (origins, destinations, label) => {
      // Create section container
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'mb-[50px]';

      // Create header
      sectionDiv.innerHTML = `
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> Flights From ${label}
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${label.replace(/\s+/g, '-').toLowerCase()}"></div>
      `;

      gridsContainer.appendChild(sectionDiv);
      const grid = sectionDiv.querySelector(`#grid-${label.replace(/\s+/g, '-').toLowerCase()}`);

      origins.forEach(origin => {
        const card = document.createElement('div');
        card.className = 'sector-card bg-gradient-to-r from-primary to-[#1558c0] p-[18px_24px] rounded-[16px] shadow-[var(--shadow-premium-soft)] cursor-pointer hover:shadow-[0_8px_25px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center relative overflow-hidden group';
        card.innerHTML = `<h4 class="text-[17px] font-heading font-extrabold text-white m-0 flex items-center justify-between z-[2] relative w-full">${origin.name} (${origin.code}) <i class="bi bi-arrow-right-circle text-white/80 text-[22px]"></i></h4>`;

        // Add click event to open Routes Modal
        card.addEventListener('click', () => {
          if (typeof openRoutesModal === 'function') {
            openRoutesModal(origin, destinations);
          }
        });

        grid.appendChild(card);
      });
    };

    // First, Indian to Middle East
    renderSection(indianAirports, middleEastAirports, 'India');

    // Second, Middle East to Indian
    renderSection(middleEastAirports, indianAirports, 'Middle East');
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
        <span class="font-bold text-navy text-[15px]">${dest.name}</span>
        <i class="bi bi-chevron-right text-text-muted group-hover:text-primary transition-colors"></i>
      `;
      routeBtn.onclick = () => {
        openModal(sectorCode, routeName);
      };
      routesGrid.appendChild(routeBtn);
    });
  }

  function openModal(sectorCode, routeName) {
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
        const sector = sectors.find(s => s.sectorCode === sectorCode);
        
        const airlines = await getAirlines();
        const airlineMap = {};
        airlines.forEach(a => airlineMap[a.id] = a.name);

        let faresHtml = '';

        if (sector) {
          const today = new Date();
          today.setHours(0,0,0,0);

          let fares = await getFares({
            sectorId: sector.id,
            startDate: today.toISOString()
          });

          fares.sort((a, b) => {
             if (a.flightDate.getTime() === b.flightDate.getTime()) {
                return a.finalRate - b.finalRate;
             }
             return a.flightDate.getTime() - b.flightDate.getTime();
          });

          if (fares.length === 0) {
             faresHtml = `<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>`;
          } else {
             faresHtml = fares.map(fare => {
                const airlineName = airlineMap[fare.airlineId] || 'Unknown Airline';
                const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
                const dateStr = fare.flightDate.toLocaleDateString('en-GB', dateOptions);
                const dep = (fare.flightTime && fare.flightTime.split('-')[0]) ? fare.flightTime.split('-')[0].trim() : 'TBA';
                const arr = (fare.flightTime && fare.flightTime.includes('-')) ? fare.flightTime.split('-')[1].trim() : 'TBA';
                
                return `
                          <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary hover:bg-[#f1f5f9] transition-colors">
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${dateStr}</strong></td>
                              <td class="p-[14px_15px] whitespace-nowrap"><strong>${airlineName}</strong></td>
                              <td class="p-[14px_15px]">${dep}</td>
                              <td class="p-[14px_15px]">${arr}</td>
                              <td class="p-[14px_15px] text-right"><strong>₹${fare.finalRate.toLocaleString('en-IN')}</strong></td>
                          </tr>`;
             }).join('');
          }
        } else {
          faresHtml = `<tr><td colspan="5" class="p-[14px_15px] text-center text-text-muted">No flights available currently.</td></tr>`;
        }

        modalBody.innerHTML = `
                <div class="text-center mb-4">
                    <button class="mb-4 text-primary font-bold text-[14px] hover:underline flex items-center gap-2 justify-center mx-auto" id="back-to-routes">
                      <i class="bi bi-arrow-left"></i> Back to Destinations
                    </button>
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${routeName}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <div class="overflow-x-auto w-full pb-2">
                  <table class="w-full min-w-[500px] border-collapse my-[10px] text-[14px] text-left rounded-[10px] overflow-hidden">
                      <thead>
                          <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                              <th class="p-[14px_15px]">Date</th>
                              <th class="p-[14px_15px]">Airlines</th>
                              <th class="p-[14px_15px]">Departure</th>
                              <th class="p-[14px_15px]">Arrival</th>
                              <th class="p-[14px_15px] text-right">Price</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${faresHtml}
                      </tbody>
                  </table>
                </div>
            `;
      
        const backBtn = document.getElementById('back-to-routes');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            // Determine origin/destinations based on routeName for back navigation
            const originCode = sectorCode.split(' ')[0];
            let originObj = indianAirports.find(a => a.code === originCode);
            let destList = middleEastAirports;
            
            if (!originObj) {
              originObj = middleEastAirports.find(a => a.code === originCode);
              destList = indianAirports;
            }
            
            if (originObj) {
              openRoutesModal(originObj, destList);
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
    if (originSelect && destSelect) {
      const temp = originSelect.value;
      originSelect.value = destSelect.value;
      destSelect.value = temp;
    }
  };

  if (swapBtn) swapBtn.addEventListener('click', swapLocations);
  if (swapBtnMobile) swapBtnMobile.addEventListener('click', swapLocations);
});




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
    const sectorCode = `${origin} ${dest}`;
    const sector = sectors.find(s => s.sectorCode === sectorCode);
    
    let data = [];
    if (sector) {
      const today = new Date();
      today.setHours(0,0,0,0);

      let fares = await getFares({
        sectorId: sector.id,
        startDate: today.toISOString()
      });
      
      fares.sort((a, b) => {
         if (a.flightDate.getTime() === b.flightDate.getTime()) {
            return a.finalRate - b.finalRate;
         }
         return a.flightDate.getTime() - b.flightDate.getTime();
      });
      
      const airlines = await getAirlines();
      const airlineMap = {};
      airlines.forEach(a => airlineMap[a.id] = a.name);
      
      data = fares.map(fare => {
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const dateStr = fare.flightDate.toLocaleDateString('en-GB', dateOptions).replace(/,/g, ''); 
        
        const dep = (fare.flightTime && fare.flightTime.split('-')[0]) ? fare.flightTime.split('-')[0].trim() : 'TBA';
        const arr = (fare.flightTime && fare.flightTime.includes('-')) ? fare.flightTime.split('-')[1].trim() : 'TBA';
        
        return {
          airline: airlineMap[fare.airlineId] || 'Unknown Airline',
          origin: sector.sectorFrom,
          originCode: origin,
          destination: sector.sectorTo,
          destinationCode: dest,
          date: dateStr,
          departure: dep,
          arrival: arr,
          price: "₹" + fare.finalRate.toLocaleString('en-IN'),
          seats: fare.seatsAvailable || 0
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

    let htmlContent = '';
    data.forEach(item => {

      // Parse Date (e.g., "06 Mar 2026" -> "06", "Mar")
      let day = "00", month = "MTH";
      if (item.date) {
        const dParts = item.date.split(' ');
        if (dParts.length >= 2) {
          day = dParts[0];
          month = dParts[1];
        } else {
          day = item.date;
          month = "";
        }
      }

      const waMsg = encodeURIComponent(`Hello Zamra Travels, I'm interested in booking this flight:\n\n✈️ *${item.airline}*\n🛫 From: *${item.origin}*\n🛬 To: *${item.destination}*\n📅 Date: *${item.date}*\n⏰ Dep: ${item.departure} | Arr: ${item.arrival}\n💵 Price: *${item.price}*\n\nPlease confirm availability!`);
      const waLink = `https://wa.me/919846606739?text=${waMsg}`;

      let airlineName = (item.airline || "").toUpperCase().trim();
      let matchedLogo = "";

      const zamraLogos = {
        "INDIGO": "/assets/img/flights/indigo.png",
        "AIR INDIA EXPRESS": "/assets/img/flights/air-india-express.png",
        "AIR ARABIA": "/assets/img/flights/air-arabia.png",
        "FLYNAS": "/assets/img/flights/flynas.png",
        "OMAN AIR": "/assets/img/flights/oman-air.png",
        "SALAM AIR": "/assets/img/flights/salam-air.png",
        "AIR INDIA": "/assets/img/flights/air-india.png",
        "SAUDIA": "/assets/img/flights/saudia.png"
      };

      if (airlineName.includes("EXPRESS") || airlineName === "IX") matchedLogo = zamraLogos["AIR INDIA EXPRESS"];
      else if (airlineName.includes("INDIA") || airlineName === "AI") matchedLogo = zamraLogos["AIR INDIA"];
      else if (airlineName.includes("SAUD") || airlineName.includes("SOUD") || airlineName === "SV") matchedLogo = zamraLogos["SAUDIA"];
      else if (airlineName.includes("INDIGO") || airlineName === "6E") matchedLogo = zamraLogos["INDIGO"];
      else if (airlineName.includes("ARABIA") || airlineName === "G9") matchedLogo = zamraLogos["AIR ARABIA"];
      else if (airlineName.includes("FLYNAS") || airlineName === "XY") matchedLogo = zamraLogos["FLYNAS"];
      else if (airlineName.includes("OMAN") || airlineName === "WY") matchedLogo = zamraLogos["OMAN AIR"];
      else if (airlineName.includes("SALAM") || airlineName === "OV") matchedLogo = zamraLogos["SALAM AIR"];
      else matchedLogo = `https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${item.airline}.png`;

      htmlContent += `
        <div class="bg-white rounded-[16px] p-4 lg:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative">
          
          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <!-- Mobile Top Section -->
            <div class="flex items-center justify-start gap-4 border-b border-border pb-4">
              <div class="w-[60px] h-[60px] shrink-0 bg-[#f8fafc] rounded-xl border border-border/50 flex items-center justify-center p-2">
                <img src="${matchedLogo}" onerror="this.style.display='none'" class="max-h-full max-w-full object-contain">
              </div>
              <div>
                <div class="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-1">${item.airline}</div>
                <div class="text-[18px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                  ${day} <span class="text-primary text-[14px]">${month}</span>
                </div>
              </div>
            </div>

            <!-- Mobile Middle Section -->
            <div class="flex flex-row items-center justify-between gap-2 px-2">
              <div class="text-left flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${item.originCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Dep: ${item.departure}</div>
              </div>
              
              <!-- Mobile Connector -->
              <div class="flex flex-col items-center px-2">
                <i class="bi bi-arrow-right text-primary text-[24px]"></i>
                <div class="text-[10px] text-text-muted font-bold mt-1">37KG</div>
              </div>

              <div class="text-right flex-none">
                <div class="text-[20px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${item.destinationCode}</div>
                <div class="text-[12px] font-medium text-text-muted uppercase">Arr: ${item.arrival}</div>
              </div>
            </div>

            <!-- Mobile Bottom Section -->
            <div class="flex sm:flex-row flex-col items-center justify-between w-full border-t border-border pt-4 gap-3 sm:gap-0">
              <div class="flex flex-col items-center sm:items-start w-full sm:w-auto">
                <span class="text-[24px] font-heading font-bold text-navy leading-none tracking-tight">${item.price}</span>
                <div class="text-[11px] text-green-600 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="bi bi-person-check-fill text-[14px]"></i> ${item.seats} Seats Left
                </div>
              </div>
              <a href="${waLink}" target="_blank" class="w-full sm:w-auto bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                Book Now
              </a>
            </div>
          </div>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${day}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${month}</div>
              </div>
              
              <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
                <img src="${matchedLogo}" onerror="this.style.display='none'" class="max-h-[35px] max-w-full object-contain">
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center justify-between gap-8 px-6">
              
              <!-- Route -->
              <div class="flex items-center gap-6 lg:gap-8 mx-0">
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${item.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${item.originCode}</div>
                </div>
                
                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>
                
                <div class="text-left w-[100px]">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-none tracking-tight break-words truncate w-[100px]">${item.destination}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${item.destinationCode}</div>
                </div>
              </div>

              <!-- Times & Info -->
              <div class="flex gap-10 lg:gap-14 text-sm mx-0">
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Flight time</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">Dep- ${item.departure}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">Arr- ${item.arrival}</div>
                </div>
                <div class="text-left">
                  <div class="text-[14px] font-bold text-navy mb-3">Luggage</div>
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">30 KG</div>
                  <div class="text-[14px] font-bold text-navy flex items-center">+ 7 KG</div>
                </div>
              </div>
              
            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${item.price}
                </span>
                <a href="${waLink}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
                <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                  <i class="bi bi-person-check-fill"></i> ${item.seats} Seats Left
                </div>
              </div>
            </div>

          </div>

        </div>
      `;
    });

    list.innerHTML = htmlContent;

  } catch (error) {
    loader.style.display = 'none';
    if (list) list.innerHTML = `<div class="text-center text-red-500 p-10 font-bold border-2 border-dashed border-red-200 rounded-[24px] mt-6 bg-red-50">Error connection. Failed to fetch live flights. Please ensure the server is active.</div>`;
    console.error(error);
  }
}

// Expose to global scope for inline onclick handler from HTML
window.searchFlights = searchFlights;
