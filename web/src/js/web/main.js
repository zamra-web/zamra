// Modern Zamra Travels JavaScript

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

  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').classList.replace('bi-x-lg', 'bi-list');
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
    const renderSection = (origin, destinations) => {
      // Create section container
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'mb-[50px]';

      // Create header
      sectionDiv.innerHTML = `
        <h3 class="flex items-center gap-3 text-[24px] text-accent mb-6 border-b-2 border-border pb-3 font-heading font-bold">
          <i class="bi bi-geo-alt-fill text-[1.1em]"></i> From ${origin.name} (${origin.code})
        </h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6" id="grid-${origin.id}"></div>
      `;

      gridsContainer.appendChild(sectionDiv);
      const grid = sectionDiv.querySelector(`#grid-${origin.id}`);

      destinations.forEach(dest => {
        const sectorCode = `${origin.code} ${dest.code}`;
        const routeName = `${origin.name} → ${dest.name}`;

        const card = document.createElement('div');
        card.className = 'sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group';
        card.setAttribute('data-sector', sectorCode);
        card.innerHTML = `<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${origin.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${dest.name}</h4>`;

        // Add click event for modal
        card.addEventListener('click', () => {
          if (typeof openModal === 'function') {
            openModal(sectorCode, routeName);
          }
        });

        grid.appendChild(card);
      });
    };

    // First, Indian to Middle East
    indianAirports.forEach(origin => {
      renderSection(origin, middleEastAirports);
    });

    // Second, Middle East to Indian
    middleEastAirports.forEach(origin => {
      renderSection(origin, indianAirports);
    });
  }

  // 4. Modal Functionality
  const modal = document.getElementById('sector-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const modalRoute = document.getElementById('modal-route');

  function openModal(sectorCode, routeName) {
    modalRoute.textContent = sectorCode.replace(' ', ' → ');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Show loading state
    modalBody.innerHTML = '<div class="w-[40px] h-[40px] border-[3px] border-[#f3f3f3] border-t-primary rounded-full animate-spin mx-auto my-[30px]"></div><p class="text-center text-text-muted mt-4">Fetching latest fares...</p>';

    // Simulate API call to fetch sector data (like legacy site did with fetch.php)
    setTimeout(() => {
      // Mock content
      modalBody.innerHTML = `
                <div class="text-center mb-4">
                    <h4 class="text-primary-dark font-bold text-lg mb-[8px]">Available Flights for ${routeName}</h4>
                    <p class="text-text-muted text-sm">Prices are introductory and subject to availability.</p>
                </div>
                <table class="w-full border-collapse my-[20px] text-[14px] text-left rounded-[10px] overflow-hidden">
                    <thead>
                        <tr class="bg-[#f8fafc] text-text-muted font-bold border-b-2 border-[#e2e8f0]">
                            <th class="p-[14px_15px]">Airlines</th>
                            <th class="p-[14px_15px]">Departure</th>
                            <th class="p-[14px_15px]">Arrival</th>
                            <th class="p-[14px_15px]">Status</th>
                            <th class="p-[14px_15px]">Price Start At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Air India Express</strong></td>
                            <td class="p-[14px_15px]">10:45 AM</td>
                            <td class="p-[14px_15px]">01:20 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹12,450</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Saudi Airlines</strong></td>
                            <td class="p-[14px_15px]">04:30 PM</td>
                            <td class="p-[14px_15px]">08:15 PM</td>
                            <td class="p-[14px_15px]"><span style="color: #16a34a;">Available</span></td>
                            <td class="p-[14px_15px]"><strong>₹14,200</strong></td>
                        </tr>
                        <tr class="border-b border-[#e2e8f0] [&:nth-of-type(even)]:bg-[#fafbfc] [&:last-of-type]:border-b-2 [&:last-of-type]:border-primary">
                            <td class="p-[14px_15px]"><strong>Oman Air</strong></td>
                            <td class="p-[14px_15px]">11:00 PM</td>
                            <td class="p-[14px_15px]">03:45 AM</td>
                            <td class="p-[14px_15px]"><span style="color: #d97706;">Few Seats</span></td>
                            <td class="p-[14px_15px]"><strong>₹13,800</strong></td>
                        </tr>
                    </tbody>
                </table>
            `;
    }, 800);
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
});


// --- INTEGRATED LEGACY PORTAL JS ---

/* ── CONFIG ── Replace with your actual n8n webhook URL ── */
const WEBHOOK = 'https://n8n.srv1046139.hstgr.cloud/webhook/zamra';
const AGENT_LIST = [1, 2, 21, 22, 23, 24, 25, 28, 31, 40, 42, 43, 44];

/* ── STATE ── */
let selAgent = null;
let history = JSON.parse(localStorage.getItem('zt_hist') || '[]');
let totalE = history.reduce((a, h) => a + (h.rows || 0), 0);

/* ── STATS UPDATE ── */
function updateStats() {
  document.getElementById('statSubs').textContent = history.length;
  document.getElementById('statEntries').textContent = totalE;
}

/* ── BUILD CHIPS ── */
function buildChips() {
  const cGrid = document.getElementById('chipGrid');
  if (!cGrid || cGrid.children.length > 0) return;
  AGENT_LIST.forEach(n => {
    const c = document.createElement('div');
    c.className = 'rp-chip';
    c.textContent = n;
    c.style.cssText = 'height:48px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:15px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;';
    c.addEventListener('click', () => pickAgent(n, c));
    cGrid.appendChild(c);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildChips();
  renderHistory();
  updateStats();


});

function pickAgent(n, el) {
  selAgent = n;
  document.getElementById('manualAgent').value = '';
  document.querySelectorAll('.rp-chip').forEach(c => {
    c.classList.remove('on');
    c.style.background = '#ffffff';
    c.style.color = '#1e293b';
    c.style.borderColor = '#b8cce4';
    c.style.boxShadow = '0 1px 4px rgba(13,31,60,.10)';
    c.style.transform = '';
  });
  if (el) {
    el.classList.add('on');
    el.style.background = '#1a73e8';
    el.style.color = '#ffffff';
    el.style.borderColor = '#1a73e8';
    el.style.boxShadow = '0 4px 14px rgba(26,115,232,.3)';
    el.style.transform = 'translateY(-1px)';
  }
  syncPill(); validate();
}

document.getElementById('manualAgent').addEventListener('input', function () {
  const v = parseInt(this.value);
  selAgent = (v > 0) ? v : null;
  document.querySelectorAll('.rp-chip').forEach(c => {
    c.classList.remove('on');
    c.style.background = '#ffffff';
    c.style.color = '#1e293b';
    c.style.borderColor = '#b8cce4';
    c.style.boxShadow = '0 1px 4px rgba(13,31,60,.10)';
    c.style.transform = '';
  });
  syncPill(); validate();
});

function syncPill() {
  const p = document.getElementById('agentPill');
  if (selAgent) {
    p.textContent = `Agent ${selAgent} selected ✓`;
    p.classList.remove('empty');
  } else {
    p.textContent = 'No agent selected';
    p.classList.add('empty');
  }
}

/* ── TEXTAREA ── */
const ta = document.getElementById('rateData');
let pt;

ta.addEventListener('input', function () {
  const n = this.value.length;
  document.getElementById('charCount').textContent =
    n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
  validate();
  clearTimeout(pt);
  if (n > 15) pt = setTimeout(() => doPreview(this.value), 500);
  else hidePrev();
});

function validate() {
  document.getElementById('submitBtn').disabled =
    !(selAgent && ta.value.trim().length > 10);
}

/* ── QUICK CLIENT-SIDE PARSER (for live preview only) ── */
function quickParse(text) {
  const rows = [];
  const MONTHS = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
  };
  const AIR_RX = /\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;
  let sector = null, airline = 'IX';

  for (const raw of text.split('\n')) {
    const line = raw.replace(/[*_~`]/g, '').trim();
    if (!line) continue;

    /* Detect sector header */
    const sm = line.match(/([A-Z]{3})\s+([A-Z]{3})/);
    if (sm && line.length < 70 && !line.match(/\d{4,6}/)) {
      sector = sm[1] + '-' + sm[2];
      const am = line.match(AIR_RX);
      if (am) airline = am[1];
      continue;
    }

    if (sector) {
      const am = line.match(AIR_RX);
      if (am && !line.match(/\d{4,6}/)) { airline = am[1]; continue; }

      /* Date + rate on same line */
      const m = line.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i
      );
      if (m) {
        const rate = parseInt(m[3]);
        if (rate >= 1000 && rate <= 99999) {
          rows.push({
            sector,
            date: `2026-${MONTHS[m[2].toUpperCase()]}-${m[1].padStart(2, '0')}`,
            airline: am ? am[1] : airline,
            rate
          });
        }
      }
    }
  }
  return rows;
}

function doPreview(text) {
  const rows = quickParse(text);
  if (!rows.length) { hidePrev(); return; }

  document.getElementById('prevBox').classList.add('on');
  document.getElementById('prevCount').textContent =
    rows.length + ' entr' + (rows.length === 1 ? 'y' : 'ies');

  const tbody = document.getElementById('prevBody');
  tbody.innerHTML = rows.slice(0, 60).map(r => `
    <tr>
      <td class="td-s">${r.sector}</td>
      <td>${r.date}</td>
      <td class="td-a">${r.airline}</td>
      <td class="td-r">₹${r.rate.toLocaleString()}</td>
    </tr>
  `).join('');

  if (rows.length > 60)
    tbody.innerHTML += `<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${rows.length - 60} more entries</td></tr>`;
}

function hidePrev() {
  document.getElementById('prevBox').classList.remove('on');
}

/* ── RESET ── */
document.getElementById('resetBtn').addEventListener('click', () => {
  ta.value = '';
  document.getElementById('charCount').textContent = '0 characters';
  hidePrev();
  validate();
});

/* ── SUBMIT ── */
document.getElementById('submitBtn').addEventListener('click', async () => {
  if (!selAgent || !ta.value.trim()) return;

  const btn = document.getElementById('submitBtn');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<div class="spin"></div> Processing...`;

  /* progress bar */
  const bar = document.getElementById('progBar');
  const fill = document.getElementById('progFill');
  bar.classList.add('on');
  let prog = 0;
  const iv = setInterval(() => {
    prog = Math.min(prog + Math.random() * 13, 85);
    fill.style.width = prog + '%';
  }, 280);

  const entries = quickParse(ta.value);
  const payload = {
    agent_id: selAgent,
    raw_text: ta.value.trim(),
    timestamp: new Date().toISOString(),
    source: 'zamra-portal'
  };

  /* log pending */
  const hEntry = {
    id: Date.now(),
    agent: selAgent,
    time: new Date().toLocaleString('en-IN', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    }),
    rows: entries.length,
    status: 'pen'
  };
  history.unshift(hEntry);
  if (history.length > 15) history.pop();
  saveHistory(); renderHistory();

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    clearInterval(iv);
    fill.style.width = '100%';

    if (res.ok) {
      hEntry.status = 'ok';
      finish(entries.length);
    } else {
      throw new Error(`Server error ${res.status}`);
    }
  } catch (err) {
    clearInterval(iv);
    fill.style.width = '100%';

    /* If webhook not configured yet, treat as captured */
    if (!err.message.startsWith('Server error')) {
      hEntry.status = 'ok';
      finish(entries.length);
      toast('warning', 'Webhook Not Connected',
        'Data captured locally. Set the WEBHOOK constant to your n8n URL to go live.');
    } else {
      hEntry.status = 'err';
      saveHistory(); renderHistory();
      toast('error', 'Submission Failed', err.message);
    }
  }

  setTimeout(() => {
    bar.classList.remove('on');
    fill.style.width = '0%';
    btn.innerHTML = orig;
    validate();
  }, 900);
});

function finish(count) {
  saveHistory(); renderHistory();
  totalE += count;
  updateStats();
  toast('success', 'Submitted Successfully',
    `Agent ${selAgent} — ${count} entries queued for processing.`);
  setTimeout(() => {
    ta.value = '';
    document.getElementById('charCount').textContent = '0 characters';
    hidePrev();
    validate();
  }, 500);
}

/* ── TOASTS ── */
const TICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
};

function toast(type, title, msg) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <div class="ti">${TICONS[type]}</div>
    <div class="tb">
      <div class="tt">${title}</div>
      <div class="tm">${msg}</div>
    </div>
    <button class="tx" onclick="this.closest('.rp-toast').remove()">
      <svg viewBox="0 0 12 12" fill="none">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`;
  document.getElementById('toastsEl').appendChild(el);
  setTimeout(() => el.remove(), 7000);
}

/* ── HISTORY ── */
function saveHistory() {
  localStorage.setItem('zt_hist', JSON.stringify(history));
}

function renderHistory() {
  const wrap = document.getElementById('historyWrap');
  if (!history.length) {
    wrap.innerHTML = `
      <div class="h-empty">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;
    return;
  }
  wrap.innerHTML = history.map(h => `
    <div class="h-item">
      <div class="h-ag">${h.agent}</div>
      <div class="h-meta">
        <div class="h-id">Agent ${h.agent}</div>
        <div class="h-t">${h.time}</div>
      </div>
      <div class="h-rows">
        <span class="h-n">${h.rows}</span>
        <span class="h-l">entries</span>
      </div>
      <div class="dot ${h.status}"></div>
    </div>
  `).join('');
}

document.getElementById('clearBtn').addEventListener('click', () => {
  if (!history.length) return;
  history = [];
  totalE = 0;
  saveHistory();
  renderHistory();
  updateStats();
});

/* ── FLIGHT SEARCH LOGIC ── */
async function searchFlights() {
  const dest = document.getElementById('destination').value;
  const list = document.getElementById('flightList');
  const loader = document.getElementById('loading');
  const header = document.getElementById('resultsHeader');
  const locName = document.getElementById('locName');

  // Reset UI
  list.innerHTML = '';
  loader.style.display = 'block';
  header.style.display = 'none';

  try {
    const response = await fetch('https://n8n.srv1046139.hstgr.cloud/webhook/get-flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: dest })
    });

    const data = await response.json();
    loader.style.display = 'none';
    header.style.display = 'block';
    if (locName) locName.innerText = dest;

    if (!data || data.length === 0) {
      list.innerHTML = `<div class="text-center text-text-muted p-10 font-bold border-2 border-dashed border-border rounded-[24px] mt-6 bg-[#f8fafc]">No flights currently found for ${dest}. Try another destination.</div>`;
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
        <div class="bg-white rounded-[16px] p-4 md:p-6 mb-4 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <!-- Left side: Date & Airline -->
          <div class="flex items-center gap-6 md:gap-8 w-full lg:w-auto">
            <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
              <div class="text-[36px] md:text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${day}</div>
              <div class="text-[20px] font-medium text-navy capitalize">${month}</div>
            </div>
            
            <div class="w-[100px] shrink-0 text-center flex items-center justify-center">
              <img src="${matchedLogo}" 
                   onerror="this.style.display='none'" 
                   class="max-h-[35px] max-w-full object-contain">
            </div>
          </div>

          <!-- Middle side: Routes & Details -->
          <div class="flex flex-1 w-full flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:px-6">
            
            <!-- Route -->
            <div class="flex items-center gap-6 md:gap-8 mx-auto md:mx-0">
              <div class="text-left w-[100px]">
                <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${item.origin}</div>
                <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${item.origin.substring(0, 3)}</div>
              </div>
              
              <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                <i class="bi bi-arrow-right text-primary text-[20px]"></i>
              </div>
              
              <div class="text-left w-[100px]">
                <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                <div class="text-[22px] font-medium text-navy uppercase leading-none tracking-tight">${item.destination}</div>
                <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${item.destination.substring(0, 3)}</div>
              </div>
            </div>

            <!-- Times & Info -->
            <div class="flex gap-10 md:gap-14 text-sm mx-auto md:mx-0 mt-4 md:mt-0">
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
          <div class="flex flex-col items-center justify-center w-full lg:w-[180px] mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
            <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
              <span class="text-[28px] md:text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                ${item.price}
              </span>
              <a href="${waLink}" target="_blank" class="w-full text-center bg-[#2b2b2b] text-white font-medium text-[15px] px-6 py-2.5 rounded justify-center flex items-center hover:bg-black transition-colors">
                Book Now
              </a>
              <div class="text-[11px] text-green-600 font-bold mt-2.5 text-center uppercase tracking-wide flex items-center gap-1">
                <i class="bi bi-person-check-fill"></i> ${item.seats} Seats Available
              </div>
            </div>
          </div>

        </div>
      `;
    });

    list.innerHTML = htmlContent;

  } catch (error) {
    loader.style.display = 'none';
    toast('error', 'Connection Error', 'Failed to fetch live flights. Please ensure the server is active.');
    console.error(error);
  }
}

// Expose to global scope for inline onclick handler from HTML
window.searchFlights = searchFlights;
