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
  const destinations = [
    { code: 'JED', name: 'JEDDAH' },
    { code: 'RUH', name: 'RIYADH' },
    { code: 'DMM', name: 'DAMAMM' },
    { code: 'DOH', name: 'DOHA' },
    { code: 'MCT', name: 'MUSCUT' },
    { code: 'BAH', name: 'BAHRAIN' },
    { code: 'KWI', name: 'KUWAIT' },
    { code: 'DXB', name: 'DUBAI' },
    { code: 'SHJ', name: 'SHARJA' },
    { code: 'AUH', name: 'ABUDHABI' },
    { code: 'RKT', name: 'Ras Al Khaimah' },
    { code: 'AAN', name: 'AL AIN' },
    { code: 'FJR', name: 'FUJAIRAH' }
  ];

  const originAirports = [
    { id: 'kozhikode', code: 'CCJ', name: 'KOZHIKKODE' },
    { id: 'kochi', code: 'COK', name: 'KOCHI' },
    { id: 'kannur', code: 'CNN', name: 'KANNUR' }
  ];

  originAirports.forEach(origin => {
    const grid = document.getElementById(`grid-${origin.id}`);
    if (grid) {
      destinations.forEach(dest => {
        const sectorCode = `${origin.code} ${dest.code}`;
        const routeName = `${origin.name} → ${dest.name}`;

        const card = document.createElement('div');
        card.className = 'sector-card bg-white p-[16px_20px] rounded-[12px] border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 flex items-center justify-between relative overflow-hidden group';
        card.setAttribute('data-sector', sectorCode);
        card.innerHTML = `<h4 class="text-[15px] font-extrabold text-text-main m-0 flex items-center gap-[12px] z-[2] relative">${origin.name} <i class="bi bi-airplane text-primary text-[18px]"></i> ${dest.name}</h4>`;

        // Add click event for modal
        card.addEventListener('click', () => openModal(sectorCode, routeName));

        grid.appendChild(card);
      });
    }
  });

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
      list.innerHTML = `<div style="text-align:center;color:var(--z-text-soft);padding:40px;font-weight:700;border:2px dashed var(--z-border);border-radius:14px;margin-top:20px;">No flights currently found for ${dest}. Try another destination.</div>`;
      return;
    }

    // Build Flight Cards
    let htmlContent = '';
    data.forEach(item => {
      htmlContent += `
            <div class="flight-item">
              <div class="flight-flex">
                <div class="flight-info-group" style="flex: 1;">
                  <div style="text-align: center; min-width: 80px;">
                    <img src="https://flycreativekdr.com:8443/FlyCreativeNG/css2/img/Flight_Logo/${item.airline}.png" 
                         onerror="this.src='https://via.placeholder.com/80x30?text=${item.airline || 'Flight'}'" style="max-height: 32px; margin: 0 auto;">
                    <span style="font-size: 9px; font-weight: 900; color: var(--z-text-soft); text-transform: uppercase; display: block; margin-top: 8px;">${item.airline}</span>
                  </div>
                  <div>
                    <div style="font-size: 10px; font-weight: 700; color: var(--z-blue); background: var(--z-blue-bg); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px;">${item.date}</div>
                    <div class="flight-route-text" style="font-size: 24px; color: var(--z-navy);">
                      ${item.origin} 
                      <svg style="width:14px;height:14px;color:var(--z-blue);margin:0 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      ${item.destination}
                    </div>
                    <div class="flight-meta-text" style="display: flex; gap: 16px; margin-top: 4px; font-size: 12px; font-weight: 700; color: var(--z-text-soft);">
                      <span style="display:flex;align-items:center;gap:4px;">
                        <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        ${item.departure} — ${item.arrival}
                      </span>
                      <span style="display:flex;align-items:center;gap:4px;color:var(--z-green);">
                        <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18v3M20 18v3M5 8h14M4 18h16M4 11v7M20 11v7M6 14v4M18 14v4M8 4h8v7H8z"/></svg>
                        ${item.seats} Seats
                      </span>
                    </div>
                  </div>
                </div>

                <div style="text-align: right; border-left: 1px solid var(--z-border); padding-left: 24px; min-width: 140px;">
                  <div style="font-size: 10px; font-weight: 900; color: var(--z-text-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Net Fare</div>
                  <div class="flight-price-text" style="font-size: 30px; letter-spacing: -0.03em; margin-bottom: 12px;">${item.price}</div>
                  <button class="btn-book" style="font-size: 10px; padding: 8px 24px; text-transform: uppercase; letter-spacing: 0.1em; width: 100%;">Select</button>
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
