/**
 * admin/main.js — Zamra Travels Admin Dashboard
 *
 * Full Firebase-wired admin dashboard. All tabs read from / write to Firestore
 * via the db.js service layer. Cloud Functions handle bulk operations.
 */

import '../../styles/admin/style.css';
import { onAuthChange, logoutUser } from './auth.js';
import {
  getAgents, addAgent, updateAgent, deleteAgent,
  getSectors, addSector, updateSector, deleteSector,
  getAirlines, addAirline, updateAirline, deleteAirline,
  getFares, saveFares, deleteFare, updateFare,
  callBulkDeleteFares, callToggleAgentVisibility, callToggleSectorVisibility,
  callGenerateAgentReport,
} from './db.js';

import { downloadVideoPoster } from './video-export.js';

// ── Global State ──────────────────────────────────────────────────────────────
let _agents = [];
let _sectors = [];
let _airlines = [];
let _dashboardFares = []; // Kept for any stale references
let _reportFares = [];

// ── Sorting & Search State ────────────────────────────────────────────────────
let tableSort = {
  agents: { key: 'id', asc: true },
  sectors: { key: 'id', asc: true },
  airlines: { key: 'name', asc: true },
  reportFares: { key: 'flightDate', asc: true }
};
let tableSearch = { sectors: '', airlines: '' };
let tableLimit = { agents: 10, sectors: 10, airlines: 10, reportFares: 20 };
let tablePage = { agents: 1, sectors: 1, airlines: 1, reportFares: 1 };

/**
 * Sort + filter data for a given tab. Does NOT slice/paginate — returns the
 * full sorted+filtered array.  Pagination is always applied by the caller.
 */
function applySortAndFilter(data, tab) {
  let filtered = data;
  const q = tableSearch[tab]?.toLowerCase();
  
  if (q && tab === 'agents') {
    filtered = filtered.filter(a =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.contactPhone || '').toLowerCase().includes(q) ||
      (a.id || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'sectors') {
    filtered = filtered.filter(s => 
      (s.sectorFrom || '').toLowerCase().includes(q) || 
      (s.sectorTo || '').toLowerCase().includes(q) || 
      (s.sectorCode || '').toLowerCase().includes(q)
    );
  } else if (q && tab === 'airlines') {
    filtered = filtered.filter(s => 
      (s.name || '').toLowerCase().includes(q) || 
      (s.code || '').toLowerCase().includes(q)
    );
  }

  const { key, asc } = tableSort[tab];
  if (key) {
    filtered = [...filtered].sort((a, b) => {
      let valA = a[key], valB = b[key];
      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
      // Numeric ID sort — treat '1','2'...'27' as numbers
      if (key === 'id') {
        const na = parseInt(valA), nb = parseInt(valB);
        if (!isNaN(na) && !isNaN(nb)) return asc ? na - nb : nb - na;
      }
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  }

  // NOTE: No slice here — callers paginate manually so page-number buttons work
  return filtered;
}

function updateSortIcons(tab) {
  document.querySelectorAll(`th[data-sort-tab="${tab}"] i`).forEach(i => {
    i.className = 'bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]';
  });
  const activeTh = document.querySelector(`th[data-sort-tab="${tab}"][data-sort-key="${tableSort[tab].key}"]`);
  if (activeTh) {
    const icon = activeTh.querySelector('i');
    if (icon) icon.className = `bi bi-arrow-${tableSort[tab].asc ? 'up' : 'down'} opacity-100 ml-1 text-[11px] text-primary`;
  }
}

// Global click delegation for sorters
document.addEventListener('click', (e) => {
  const th = e.target.closest('th[data-sort-tab]');
  if (!th) return;

  const tab = th.dataset.sortTab;
  const key = th.dataset.sortKey;

  if (tableSort[tab].key === key) {
    tableSort[tab].asc = !tableSort[tab].asc;
  } else {
    tableSort[tab].key = key;
    tableSort[tab].asc = true;
  }

  if (tab === 'agents') renderAgentsTab(false);
  else if (tab === 'sectors') renderSectorsTab(false);
  else if (tab === 'airlines') renderFlightsTab(false);
  else if (tab === 'reportFares' && _reportFares.length) renderReportFaresTable(_reportFares);
});

// ── Auth Guard ────────────────────────────────────────────────────────────────
document.documentElement.style.visibility = 'hidden';

onAuthChange(async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  document.documentElement.style.visibility = 'visible';
  const adminNameEl = document.getElementById('admin-user-name');
  if (adminNameEl) adminNameEl.textContent = user.email.split('@')[0];

  // Pre-load lookup data then build chips
  await loadGlobalData();
  buildChips();
  // Boot the active tab
  await renderActiveTab();
});


// ── Logout ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const result = await logoutUser();
      if (result.success) window.location.href = '/login.html';
    });
  }
  initModal();
  initTabs();
  initAgentSheets();
});

// ── Pre-load global lookup data ───────────────────────────────────────────────
async function loadGlobalData() {
  try {
    [_agents, _sectors, _airlines] = await Promise.all([
      getAgents(),
      getSectors(),
      getAirlines(),
    ]);
  } catch (e) {
    console.error('loadGlobalData error:', e);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
function initTabs() {
  const navLinks = document.querySelectorAll('.nav-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      navLinks.forEach(l => { l.classList.remove('active', 'text-primary'); l.classList.add('text-gray-500'); });
      link.classList.remove('text-gray-500');
      link.classList.add('active', 'text-primary');

      const targetId = link.getAttribute('data-tab');
      const targetTitle = link.getAttribute('data-title');
      tabContents.forEach(c => c.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
      if (pageTitle && targetTitle) pageTitle.textContent = targetTitle;

      // Render the newly active tab
      await renderActiveTab();
    });
  });
}

async function renderActiveTab() {
  const active = document.querySelector('.tab-content.active');
  if (!active) return;
  const id = active.id;
  if (id === 'agents-tab') await renderAgentsTab();
  else if (id === 'sectors-tab') await renderSectorsTab();
  else if (id === 'flights-tab') await renderFlightsTab();
  else if (id === 'dashboard-tab') await renderDashboardTab();
  else if (id === 'reports-tab') await renderReportsTab();
  else if (id === 'eticket-tab') await renderETicketTab();
}


// ══════════════════════════════════════════════════════════════════════════════
// MODAL HELPER
// ══════════════════════════════════════════════════════════════════════════════
function initModal() {
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
}

/**
 * Open the admin modal with a title and body HTML.
 * @param {string} title
 * @param {string} bodyHtml
 * @param {function} onSubmit — called with formData when the form inside is submitted
 */
function openModal(title, bodyHtml) {
  const modal = document.getElementById('admin-modal');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  modal.showModal();
}


// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB — Poster Generator
// ══════════════════════════════════════════════════════════════════════════════
async function renderDashboardTab() {
  const tab = document.getElementById('dashboard-tab');
  if (!tab) return;

  // Populate sector dropdown from live Firestore data
  const sectorSel = document.getElementById('poster-sector-sel');
  if (sectorSel && sectorSel.options.length <= 1) {
    _sectors.forEach(s => {
      const opt = new Option(s.sectorCode, s.id);
      sectorSel.appendChild(opt);
    });
  }

  // Hook up Generate Poster button
  const generateBtn = document.getElementById('poster-generate-btn');
  if (generateBtn && !generateBtn.dataset.wired) {
    generateBtn.dataset.wired = '1';
    generateBtn.addEventListener('click', async () => {
      const startInput = document.getElementById('poster-start-date');
      const endInput = document.getElementById('poster-end-date');
      const sectorId = sectorSel?.value;
      const startDate = startInput?.value || null;
      const endDate = endInput?.value || null;

      if (!sectorId) {
        toast('warning', 'Validation Error', 'Please select a sector to generate the poster.');
        return;
      }

      generateBtn.disabled = true;
      generateBtn.textContent = 'Generating…';
      try {
        const fares = await getFares({ sectorId, startDate, endDate, includeHidden: false });
        if (!fares || !fares.length) {
          toast('warning', 'No Fares', 'No live fares found for the selected sector and dates.');
          document.getElementById('poster-preview-container').classList.add('hidden');
          return;
        }
        await renderPoster(fares, sectorId);
      } catch (e) {
        toast('error', 'Generation Failed', e.message);
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Poster';
      }
    });

    // Wire up download buttons
    document.getElementById('poster-download-jpg')?.addEventListener('click', () => downloadPoster('jpeg'));
    document.getElementById('poster-download-pdf')?.addEventListener('click', () => downloadPoster('pdf'));
    
    // Wire up video download buttons
    document.getElementById('poster-download-vid-1x1')?.addEventListener('click', () => handleVideoPoster('1x1'));
    document.getElementById('poster-download-vid-9x16')?.addEventListener('click', () => handleVideoPoster('9x16'));
    document.getElementById('poster-download-vid-16x9')?.addEventListener('click', () => handleVideoPoster('16x9'));
  }
}

async function handleVideoPoster(ratio) {
  const sectorSel = document.getElementById('poster-sector-sel');
  const startInput = document.getElementById('poster-start-date');
  const endInput = document.getElementById('poster-end-date');
  const sectorId = sectorSel?.value;
  const startDate = startInput?.value || null;
  const endDate = endInput?.value || null;

  if (!sectorId) {
    toast('warning', 'Validation Error', 'Please select a sector to generate the poster.');
    return;
  }
  
  try {
    const fares = await getFares({ sectorId, startDate, endDate, includeHidden: false });
    if (!fares || !fares.length) {
      toast('warning', 'No Fares', 'No live fares found for the selected sector and dates.');
      return;
    }
    await downloadVideoPoster(ratio, fares, sectorId, _sectors, _airlines);
  } catch (e) {
    console.error('Video generation failed', e);
  }
}


async function renderPoster(fares, sectorId) {
  const container = document.getElementById('poster-preview-container');
  const tbody = document.getElementById('poster-fares-tbody');
  const titleEl = document.getElementById('poster-sector-title');

  if (!container || !tbody || !titleEl) return;

  // Set header title
  const sector = _sectors.find(s => s.id === sectorId);
  const originName = sector ? (sector.sectorFrom || 'DEP').toUpperCase() : 'DEP';
  const destName = sector ? (sector.sectorTo || 'ARR').toUpperCase() : 'ARR';
  titleEl.innerHTML = `${originName} <span style="color:#60a5fa;font-weight:900;">&#8594;</span> ${destName}`;

  // Sort fares by date, limit to 10
  const sortedFares = [...fares].sort((a, b) => {
    let valA = a.flightDate, valB = b.flightDate;
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    return valA - valB;
  }).slice(0, 10);

  const airlineMap = {};
  _airlines.forEach(a => {
    if (a.id) airlineMap[a.id] = a;
    if (a.code) airlineMap[a.code] = a;
    if (a.name) airlineMap[a.name] = a;
  });

  // Pre-fetch airline logos as blob URLs — sidesteps CORS for html2canvas
  async function fetchLogoBlob(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch { return null; }
  }

  const uniqueAirlines = [...new Set(sortedFares.map(f => f.airlineId))]
    .map(id => airlineMap[id])
    .filter(a => a?.logoUrl);
  const blobUrlMap = {};
  await Promise.all(uniqueAirlines.map(async a => {
    const blobUrl = await fetchLogoBlob(a.logoUrl);
    if (blobUrl) blobUrlMap[a.id] = blobUrl;
  }));

  // Render table rows — use only explicit hex/rgb inline styles; no Tailwind classes
  // that would resolve to oklch() (which html2canvas 1.4.x cannot parse).
  tbody.innerHTML = sortedFares.map((f, i) => {
    const dt = f.flightDate instanceof Date
      ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
      : f.flightDate;
    const airline = airlineMap[f.airlineId];
    const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    const logoSrc = blobUrlMap[f.airlineId] || null;

    // Airline cell: logo if available; airline name as fallback
    const airlineCell = logoSrc
      ? `<img src="${logoSrc}" style="height:40px;max-width:100px;object-fit:contain;display:block;margin:0 auto;" alt="${airline?.name || ''}">`
      : `<span style="font-weight:700;color:#0f172a;display:block;text-align:center;font-size:15px;white-space:nowrap;">${airline?.name || f.airlineId || '—'}</span>`;

    // Time cell: parse "HH:MM - HH:MM" or "HH:MM" from flightTime
    let timeCell = '<span style="color:#94a3b8;font-size:14px;">—</span>';
    if (f.flightTime) {
      const parts = f.flightTime.split('-').map(s => s.trim());
      if (parts.length >= 2) {
        timeCell = `<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${parts[0]} - ${parts[1]}</span>`;
      } else {
        timeCell = `<span style="font-weight:800;font-size:17px;color:#0f172a;white-space:nowrap;">${f.flightTime}</span>`;
      }
    }

    return `
      <tr style="background-color:${rowBg};border-bottom:1px solid #f1f5f9;">
        <td style="padding:16px 12px;font-weight:900;color:#0f172a;font-size:22px;white-space:nowrap;">${dt}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${airlineCell}</td>
        <td style="padding:16px 12px;text-align:center;vertical-align:middle;">${timeCell}</td>
        <td style="padding:16px 12px;text-align:right;vertical-align:middle;">
          <div style="display:inline-block;background-color:#0f172a;color:#ffffff;padding:8px 18px;border-radius:12px;font-weight:900;font-size:22px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            &#8377;${(f.finalRate || 0).toLocaleString()}
          </div>
        </td>
      </tr>`;
  }).join('');

  container.classList.remove('hidden');
  container.classList.add('flex');
}

/**
 * Recursively inline computed CSS color values onto an element tree so that
 * html2canvas (which cannot parse oklch()) sees plain rgb() values instead.
 * We only touch the properties that html2canvas reads for rendering.
 */
function inlineColorsForCanvas(el) {
  if (!el || el.nodeType !== 1) return;
  const cs = window.getComputedStyle(el);
  const props = [
    'color', 'backgroundColor', 'borderTopColor', 'borderBottomColor',
    'borderLeftColor', 'borderRightColor', 'outlineColor',
  ];
  for (const prop of props) {
    const val = cs.getPropertyValue(prop);
    // Only override if the value isn't already a plain rgb/rgba/hex value
    if (val && !val.startsWith('rgb') && !val.startsWith('#') && val !== 'transparent' && val !== 'initial') {
      try { el.style[prop] = val; } catch (_) {}
    }
  }
  // Recursively handle children
  for (const child of el.children) inlineColorsForCanvas(child);
}

async function downloadPoster(format) {
    const posterEl = document.getElementById('poster-render-frame');
    if (!posterEl) return;

    // Disable both buttons while exporting
    const jpgBtn = document.getElementById('poster-download-jpg');
    const pdfBtn = document.getElementById('poster-download-pdf');
    if (jpgBtn) jpgBtn.disabled = true;
    if (pdfBtn) pdfBtn.disabled = true;

    const origTransform = posterEl.style.transform;
    posterEl.style.transform = 'none';
    toast('info', 'Generating Export', 'Please wait while we render your poster…');

    try {
        // Wait for any images that aren't yet fully decoded
        await Promise.all(
            Array.from(posterEl.querySelectorAll('img')).map(img =>
                img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })
            )
        );

        // Render to canvas at 2× resolution for crisp output.
        // The poster element uses only explicit hex/rgb inline styles (no oklch).
        // inlineColorsForCanvas is kept in onclone as a last-resort safety net.
        const canvas = await html2canvas(posterEl, {
            scale: 2,
            useCORS: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (doc) => {
              const clonedEl = doc.getElementById('poster-render-frame');
              if (clonedEl) inlineColorsForCanvas(clonedEl);
            }
        });

        posterEl.style.transform = origTransform;

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (format === 'jpeg') {
            const link = document.createElement('a');
            link.download = `zamra-poster-${Date.now()}.jpg`;
            link.href = imgData;
            link.click();
            toast('success', 'Downloaded!', 'JPEG poster saved successfully.');

        } else if (format === 'pdf') {
            // Resolve jsPDF regardless of UMD binding name
            const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF)
                || window.jsPDF
                || (window.jspdf);
            if (!jsPDFCtor) throw new Error('jsPDF library not loaded.');

            // Convert canvas px → mm (96 dpi screen, scale:2 → 192 dpi effective)
            const PX_PER_MM = 96 / 25.4;           // ~3.779 px/mm at 1×
            const widthMm  = (canvas.width  / 2) / PX_PER_MM;
            const heightMm = (canvas.height / 2) / PX_PER_MM;

            const pdf = new jsPDFCtor({
                orientation: widthMm > heightMm ? 'landscape' : 'portrait',
                unit: 'mm',
                format: [widthMm, heightMm]
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm);
            pdf.save(`zamra-poster-${Date.now()}.pdf`);
            toast('success', 'Downloaded!', 'PDF poster saved successfully.');
        }

    } catch (e) {
        console.error('Poster export error:', e);
        posterEl.style.transform = origTransform;
        toast('error', 'Export Failed', e.message || 'There was an error generating the export.');
    } finally {
        if (jpgBtn) jpgBtn.disabled = false;
        if (pdfBtn) pdfBtn.disabled = false;
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT FARES TABLE (Moved from Dashboard)
// ══════════════════════════════════════════════════════════════════════════════
function renderReportFaresTable(fares) {
  const target = document.getElementById('report-fares-results');
  if (!target) return;

  if (!fares || !fares.length) {
    target.innerHTML = `<div class="text-center text-text-muted py-14 px-4">
      <div class="inline-flex flex-col items-center gap-3 opacity-50">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <i class="bi bi-inbox text-3xl text-slate-400"></i>
        </div>
        <p class="font-semibold text-[14px]">No fares found</p>
        <p class="text-[12px]">Try adjusting your filters.</p>
      </div>
    </div>`;
    return;
  }

  // Build lookup maps
  const agentMap   = Object.fromEntries(_agents.map(a => [a.id, a.name]));
  const sectorMap  = Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode]));
  const airlineMap = Object.fromEntries(_airlines.map(a => [a.id, a.code]));

  // Sort (pagination-safe — no limit slice here)
  const { key, asc } = tableSort.reportFares;
  const sorted = [...fares].sort((a, b) => {
    let valA = a[key], valB = b[key];
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return asc ? -1 : 1;
    if (valA > valB) return asc ? 1 : -1;
    return 0;
  });

  const limit = tableLimit.reportFares;
  const totalPages = Math.max(1, Math.ceil(fares.length / limit));
  if (tablePage.reportFares > totalPages) tablePage.reportFares = totalPages;
  const start = (tablePage.reportFares - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  const TH = (key, label) =>
    `<th class="cursor-pointer group whitespace-nowrap" data-sort-tab="reportFares" data-sort-key="${key}">${label} <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>`;

  target.innerHTML = `
    <div class="admin-table-container overflow-x-auto w-full rounded-none border-0 shadow-none">
      <table class="admin-table w-full text-sm">
        <thead><tr>
          ${TH('flightDate','Date')}
          ${TH('flightTime','Time')}
          ${TH('sectorId','Sector')}
          ${TH('airlineId','Airline')}
          ${TH('agentId','Agent')}
          ${TH('specialRate','SP Rate (₹)')}
          ${TH('finalRate','Rate (₹)')}
          ${TH('commission','Comm (₹)')}
          ${TH('baggage','Bag')}
          ${TH('extraBaggage','Ex.Bag')}
          ${TH('isHidden','Status')}
          <th class="whitespace-nowrap">Actions</th>
        </tr></thead>
        <tbody>
          ${pageData.map((f, idx) => {
            const dateStr = f.flightDate instanceof Date
              ? f.flightDate.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
              : (f.flightDate || '—');
            const rowBg = idx % 2 === 1 ? 'bg-slate-50/60' : '';
            return `<tr class="${rowBg} hover:bg-blue-50/40 transition-colors">
              <td class="whitespace-nowrap font-semibold text-navy text-[13px]">${dateStr}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${f.flightTime || '—'}</td>
              <td class="whitespace-nowrap">
                <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[12px]">${sectorMap[f.sectorId] || f.sectorId}</span>
              </td>
              <td class="whitespace-nowrap font-semibold text-[13px]">${airlineMap[f.airlineId] || f.airlineId}</td>
              <td class="whitespace-nowrap text-text-muted text-[12px]">${agentMap[f.agentId] || f.agentId}</td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-text-muted text-[13px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${f.specialRate || 0}"
                    onblur="window.__updateFareRate('${f.id}', 'specialRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 text-[13px] text-text-muted outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-navy font-black text-[14px] mr-0.5">₹</span>
                  <input type="number" 
                    value="${f.finalRate || 0}"
                    onblur="window.__updateFareRate('${f.id}', 'finalRate', this.value)"
                    class="bg-transparent border border-transparent hover:border-slate-200 focus:border-primary/50 focus:bg-white rounded px-1 font-black text-navy text-[14px] outline-none w-20 transition-colors shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </td>
              <td class="whitespace-nowrap text-[12px] text-text-muted" id="comm-${f.id}">₹${(f.commission || 0).toLocaleString()}</td>
              <td class="whitespace-nowrap text-[12px]">${f.baggage ? f.baggage + ' kg' : '—'}</td>
              <td class="whitespace-nowrap text-[12px]">${f.extraBaggage ? f.extraBaggage + ' kg' : '—'}</td>
              <td class="whitespace-nowrap">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${f.isHidden ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}">
                  ${f.isHidden ? '● Hidden' : '● Live'}
                </span>
              </td>
              <td class="whitespace-nowrap">
                <div class="flex gap-1">
                  <button onclick="window.__openEditFareModal('${f.id}')"
                    class="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-colors">Edit</button>
                  <button onclick="window.__toggleFare('${f.id}', ${!f.isHidden})"
                    class="${f.isHidden ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-500' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-500'} border px-2.5 py-1 rounded-lg text-[11px] font-bold hover:text-white transition-colors">
                    ${f.isHidden ? 'Show' : 'Hide'}
                  </button>
                  <button onclick="window.__deleteFare('${f.id}')"
                    class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors">Del</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div id="reportFares-pagination-footer" class="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl"></div>`;

  renderPaginationFooter('reportFares', fares.length, totalPages, start, limit);

  // Global action handlers — re-render in-place using cached fares
  window.__deleteFare = async (fareId) => {
    if (!confirm('Delete this fare?')) return;
    try {
      await deleteFare(fareId);
      _reportFares = _reportFares.filter(f => f.id !== fareId);
      toast('success', 'Deleted', 'Fare removed.');
      renderReportFaresTable(_reportFares);
    } catch (e) { toast('error', 'Error', e.message); }
  };
  window.__toggleFare = async (fareId, isHidden) => {
    try {
      await updateFare(fareId, { isHidden });
      _reportFares = _reportFares.map(f => f.id === fareId ? { ...f, isHidden } : f);
      toast('success', 'Updated', `Fare ${isHidden ? 'hidden' : 'shown'}.`);
      renderReportFaresTable(_reportFares);
    } catch (e) { toast('error', 'Error', e.message); }
  };

  window.__updateFareRate = async (fareId, field, valueStr) => {
    const newVal = parseFloat(valueStr) || 0;
    const fare = _reportFares.find(f => f.id === fareId);
    if (!fare || fare[field] === newVal) return;

    try {
      const updateData = { [field]: newVal };
      if (field === 'specialRate') {
        updateData.commission = Math.max(0, fare.finalRate - newVal);
        fare.commission = updateData.commission;
      } else if (field === 'finalRate') {
        updateData.commission = Math.max(0, newVal - fare.specialRate);
        fare.commission = updateData.commission;
      }

      await updateFare(fareId, updateData);
      fare[field] = newVal;
      
      toast('success', 'Rate Updated', 'Fare successfully updated.');
      
      // Update DOM for commission text safely and re-render only if sorting changes, 
      // but to keep it simple and ensure pagination/sorting works, we re-render everything
      renderReportFaresTable(_reportFares);
    } catch (e) {
      toast('error', 'Update Failed', e.message);
      renderReportFaresTable(_reportFares); // reset input
    }
  };

  updateSortIcons('reportFares');

  window.__openEditFareModal = (fareId) => {
    const fare = _reportFares.find(f => f.id === fareId);
    if (!fare) return;

    let dateVal = '';
    if (fare.flightDate instanceof Date) {
      // Need local date string as YYYY-MM-DD
      const offset = fare.flightDate.getTimezoneOffset();
      dateVal = new Date(fare.flightDate.getTime() - (offset*60*1000)).toISOString().split('T')[0];
    } else if (typeof fare.flightDate === 'string') {
      dateVal = fare.flightDate.split('T')[0];
    }

    const html = `
      <form id="edit-fare-form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Date</label>
            <input type="date" id="ef-date" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${dateVal}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Time</label>
            <input type="text" id="ef-time" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. 04:05 - 11:10" value="${fare.flightTime || ''}">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Sector</label>
            <select id="ef-sector" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              ${_sectors.map(s => `<option value="${s.id}" ${s.id === fare.sectorId ? 'selected' : ''}>${s.sectorCode}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Airline</label>
            <select id="ef-airline" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${_airlines.map(a => `<option value="${a.id}" ${a.id === fare.airlineId ? 'selected' : ''}>${a.code}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Agent</label>
            <select id="ef-agent" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" required>
              <option value="">-- None --</option>
              ${_agents.map(a => `<option value="${a.id}" ${a.id === fare.agentId ? 'selected' : ''}>${a.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">SP Rate (₹)</label>
            <input type="number" id="ef-sprate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${fare.specialRate || 0}" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Final Rate (₹)</label>
            <input type="number" id="ef-finalrate" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${fare.finalRate || 0}" required>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Baggage (kg)</label>
            <input type="number" id="ef-bag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${fare.baggage || 0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Ex. Baggage (kg)</label>
            <input type="number" id="ef-exbag" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" value="${fare.extraBaggage || 0}">
          </div>
          <div>
            <label class="block text-xs font-bold text-navy mb-1">Status</label>
            <select id="ef-status" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
              <option value="live" ${!fare.isHidden ? 'selected' : ''}>Live</option>
              <option value="hidden" ${fare.isHidden ? 'selected' : ''}>Hidden</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="document.getElementById('admin-modal').close()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-text-muted bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg shadow-primary/20">Save Changes</button>
        </div>
      </form>
    `;

    openModal('Edit Fare', html);

    document.getElementById('edit-fare-form').onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const ogText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Saving...';

      try {
        let fdDateStr = document.getElementById('ef-date').value;
        const updates = {
          flightDate: fdDateStr ? new Date(fdDateStr + 'T00:00:00') : null,
          flightTime: document.getElementById('ef-time').value.trim(),
          sectorId: document.getElementById('ef-sector').value,
          airlineId: document.getElementById('ef-airline').value,
          agentId: document.getElementById('ef-agent').value,
          specialRate: parseFloat(document.getElementById('ef-sprate').value) || 0,
          finalRate: parseFloat(document.getElementById('ef-finalrate').value) || 0,
          baggage: parseFloat(document.getElementById('ef-bag').value) || 0,
          extraBaggage: parseFloat(document.getElementById('ef-exbag').value) || 0,
          isHidden: document.getElementById('ef-status').value === 'hidden'
        };
        updates.commission = Math.max(0, updates.finalRate - updates.specialRate);

        await updateFare(fareId, updates);
        
        // Update local cache
        const idx = _reportFares.findIndex(f => f.id === fareId);
        if (idx !== -1) {
          _reportFares[idx] = { ..._reportFares[idx], ...updates };
        }

        document.getElementById('admin-modal').close();
        toast('success', 'Updated', 'Fare updated successfully.');
        renderReportFaresTable(_reportFares);
      } catch (err) {
        toast('error', 'Error', err.message);
        btn.disabled = false;
        btn.textContent = ogText;
      }
    };
  };
}


// ══════════════════════════════════════════════════════════════════════════════
// AGENTS TAB — Full CRUD + Bulk Delete + Toggle Active
// ══════════════════════════════════════════════════════════════════════════════
async function renderAgentsTab(fetchData = true) {
  if (fetchData) { _agents = await getAgents(); tablePage.agents = 1; }
  const tbody = document.querySelector('#agents-tab .admin-table tbody');
  if (!tbody) return;

  // Wire up filter inputs if not already (same pattern as sectors/airlines)
  const searchInp = document.getElementById('agents-search');
  const limitSel = document.getElementById('agents-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1';
    if (limitSel) limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.agents = e.target.value; tablePage.agents = 1; renderAgentsTab(false); });
    if (limitSel) limitSel.addEventListener('change', (e) => { tableLimit.agents = parseInt(e.target.value); tablePage.agents = 1; renderAgentsTab(false); });
  }

  // Sort ALL agents first, then paginate from the full sorted array
  const sorted = applySortAndFilter(_agents, 'agents');
  const limit = tableLimit.agents;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.agents > totalPages) tablePage.agents = totalPages;
  const start = (tablePage.agents - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(a => agentRow(a)).join('')
    : `<tr><td colspan="7" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>`;

  // Render pagination footer (use sorted.length so filtered count is accurate)
  renderPaginationFooter('agents', sorted.length, totalPages, start, limit);

  // Remove stale wired flag so delegation re-attaches after innerHTML replacement
  delete tbody.dataset.actionsWired;
  wireAgentActions();
  wireAgentsBulkForm();
  populateAgentBulkSelect();

  // Wire "+ Add Agent" button (by stable ID)
  const addBtn = document.getElementById('agents-add-btn');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openAgentModal(null));
  }

  updateSortIcons('agents');
}

function agentRow(a) {
  const statusBadge = a.isActive !== false
    ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">Active</span>`
    : `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">Hidden</span>`;
  const comm = a.commission !== undefined ? `₹${Number(a.commission).toLocaleString()}` : '—';
  return `<tr data-agent-id="${a.id}">
    <td class="font-mono text-xs text-text-muted">${a.id.slice(0, 8)}…</td>
    <td class="font-semibold">${a.name}</td>
    <td>${a.email || '—'}</td>
    <td>${a.contactPhone || '—'}</td>
    <td class="font-semibold text-navy">${comm}</td>
    <td>${statusBadge}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${a.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-agent" data-id="${a.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-agent" data-id="${a.id}" data-active="${a.isActive !== false}"
        class="px-3 py-1 rounded text-[12px] font-bold ${a.isActive !== false ? 'bg-slate-400 text-white hover:bg-slate-500' : 'bg-green-500 text-white hover:bg-green-600'}">
        ${a.isActive !== false ? 'Hide Fares' : 'Show Fares'}</button>
    </td>
  </tr>`;
}

function wireAgentActions() {
  const tbody = document.querySelector('#agents-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const agent = _agents.find(a => a.id === id);

    if (action === 'edit-agent') openAgentModal(agent);
    if (action === 'delete-agent') {
      if (!confirm(`Delete agent "${agent?.name}"? This does NOT delete their fares.`)) return;
      try { await deleteAgent(id); toast('success', 'Deleted', `Agent "${agent?.name}" removed.`); await renderAgentsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
    if (action === 'toggle-agent') {
      const isCurrentlyActive = btn.dataset.active === 'true';
      const newStatus = !isCurrentlyActive;
      btn.disabled = true; btn.textContent = 'Working…';
      try {
        const res = await callToggleAgentVisibility(id, newStatus);
        toast('success', newStatus ? 'Agent Shown' : 'Agent Hidden', res.message);
        await renderAgentsTab();
      } catch (e) { toast('error', 'Toggle Failed', e.message); await renderAgentsTab(); }
    }
  });
}

function renderPaginationFooter(tabName, total, totalPages, start, limit) {
  const footer = document.getElementById(`${tabName}-pagination-footer`);
  if (!footer) return;
  const end = Math.min(start + limit, total);
  const currentPage = tablePage[tabName];

  footer.innerHTML = `
    <div class="flex items-center justify-between px-2 py-3 text-sm text-text-muted overflow-x-auto whitespace-nowrap">
      <span>Showing ${total ? start + 1 : 0} to ${end} of ${total} entries</span>
      <div class="flex items-center gap-1 ml-4 shadow-[var(--shadow-premium-soft)] rounded">
        <button data-pg-action="prev" class="px-3 py-1.5 border border-border rounded-l bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
          `<button data-pg-action="goto" data-pg="${p}" class="px-3 py-1.5 border-y border-r border-border text-sm font-bold bg-white premium-transition ${
            p === currentPage ? 'text-primary bg-primary-light shadow-inner border-primary/20 relative z-10' : 'text-text-mid hover:bg-slate-50 hover:text-navy'
          }">${p}</button>`
        ).join('')}
        <button data-pg-action="next" class="px-3 py-1.5 border-y border-r border-border rounded-r bg-white text-sm font-semibold hover:bg-slate-50 hover:text-navy disabled:opacity-40 premium-transition" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
      </div>
    </div>`;

  if (!footer.dataset.wired) {
    footer.dataset.wired = '1';
    footer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-pg-action]');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.pgAction;
      if (action === 'prev') tablePage[tabName] = Math.max(1, tablePage[tabName] - 1);
      else if (action === 'next') tablePage[tabName]++;
      else if (action === 'goto') tablePage[tabName] = parseInt(btn.dataset.pg);
      if (tabName === 'agents') renderAgentsTab(false);
      else if (tabName === 'sectors') renderSectorsTab(false);
      else if (tabName === 'airlines') renderFlightsTab(false);
      else if (tabName === 'reportFares') renderReportFaresTable(_reportFares);
    });
  }
}

function openAgentModal(agent) {
  const isEdit = !!agent;
  openModal(isEdit ? 'Edit Agent' : 'Add New Agent', `
    <form id="agent-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Agent ID *</label>
        <input name="id" required value="${agent?.id || ''}" placeholder="e.g. AGENT1"
          ${isEdit ? 'readonly class="w-full bg-slate-100 border border-border rounded-lg h-11 px-3 text-sm focus:outline-none cursor-not-allowed text-slate-500"' : 'class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"'}>
        ${isEdit ? '<p class="text-[11px] text-text-soft mt-1">Agent ID cannot be changed after creation.</p>' : ''}
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Name *</label>
        <input name="name" required value="${agent?.name || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Email</label>
        <input name="email" type="email" value="${agent?.email || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Phone</label>
        <input name="contactPhone" value="${agent?.contactPhone || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Commission (₹) *</label>
        <input name="commission" type="number" min="0" required value="${agent?.commission !== undefined ? agent.commission : 500}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          placeholder="e.g. 500">
        <p class="text-[11px] text-text-soft mt-1">This commission is auto-applied to all fares ingested for this agent.</p>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit"
          class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 transition-all text-sm">
          ${isEdit ? 'Save Changes' : 'Add Agent'}
        </button>
        <button type="button" id="modal-cancel"
          class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('agent-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) { await updateAgent(agent.id, data); toast('success', 'Updated', `Agent "${data.name}" updated.`); }
      else { await addAgent(data); toast('success', 'Added', `Agent "${data.name}" added.`); }
      document.getElementById('admin-modal').close();
      await renderAgentsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Agent'; }
  });
}

function wireAgentsBulkForm() {
  const bulkBtn = document.getElementById('agents-bulk-delete-btn');
  if (!bulkBtn || bulkBtn.dataset.wired) return;
  bulkBtn.dataset.wired = '1';

  bulkBtn.addEventListener('click', async () => {
    const agentSel  = document.getElementById('agents-bulk-agent-sel');
    const sectorSel = document.getElementById('agents-bulk-sector-sel');
    const startInput = document.getElementById('agents-bulk-start');
    const endInput  = document.getElementById('agents-bulk-end');

    const agentId  = agentSel?.value  || null;
    const sectorId = sectorSel?.value || null;
    const startDate = startInput?.value || null;
    const endDate  = endInput?.value  || null;

    // At least one meaningful filter must be set
    const hasFilter = (agentId && agentId !== 'all') ||
                      (sectorId && sectorId !== 'all') ||
                      startDate || endDate;
    if (!hasFilter) {
      toast('warning', 'No Filter', 'Select at least an agent, a sector, or a date range before deleting.');
      return;
    }

    // Build a human-readable summary for the confirm dialog
    const parts = [];
    if (agentId  && agentId  !== 'all') parts.push(`Agent: ${agentSel.options[agentSel.selectedIndex].text}`);
    if (sectorId && sectorId !== 'all') parts.push(`Sector: ${sectorSel.options[sectorSel.selectedIndex].text}`);
    if (startDate) parts.push(`from ${startDate}`);
    if (endDate)   parts.push(`to ${endDate}`);

    if (!confirm(`Delete ALL matching fares?\n${parts.join(' · ')}\n\nThis cannot be undone.`)) return;

    bulkBtn.disabled = true; bulkBtn.textContent = 'Deleting…';
    try {
      const res = await callBulkDeleteFares(agentId, startDate, endDate, sectorId);
      toast('success', 'Bulk Delete Complete', res.message);
    } catch (e) { toast('error', 'Bulk Delete Failed', e.message); }
    finally { bulkBtn.disabled = false; bulkBtn.textContent = 'Bulk Delete'; }
  });
}

function populateAgentBulkSelect() {
  // Agent dropdown
  const agentSel = document.getElementById('agents-bulk-agent-sel');
  if (agentSel) {
    const currentAgent = agentSel.value;
    agentSel.innerHTML = '<option value="">All Agents</option>';
    _agents.forEach(a => agentSel.appendChild(new Option(a.name, a.id)));
    if (currentAgent) agentSel.value = currentAgent;
  }

  // Sector dropdown
  const sectorSel = document.getElementById('agents-bulk-sector-sel');
  if (sectorSel) {
    const currentSector = sectorSel.value;
    sectorSel.innerHTML = '<option value="">All Sectors</option>';
    _sectors.forEach(s => sectorSel.appendChild(new Option(s.sectorCode, s.id)));
    if (currentSector) sectorSel.value = currentSector;
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTORS TAB — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
async function renderSectorsTab(fetchData = true) {
  if (fetchData) { _sectors = await getSectors(); tablePage.sectors = 1; }
  
  // Wire up filter inputs if not already
  const searchInp = document.getElementById('sectors-search');
  const limitSel = document.getElementById('sectors-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.sectors = e.target.value; tablePage.sectors = 1; renderSectorsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.sectors = parseInt(e.target.value); tablePage.sectors = 1; renderSectorsTab(false); });
  }

  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody) return;

  const sorted = applySortAndFilter(_sectors, 'sectors');
  const limit = tableLimit.sectors;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.sectors > totalPages) tablePage.sectors = totalPages;
  const start = (tablePage.sectors - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(s => sectorRow(s)).join('')
    : `<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>`;

  renderPaginationFooter('sectors', sorted.length, totalPages, start, limit);

  wireSectorActions();

  const addBtn = document.querySelector('#sectors-tab .flex.justify-between button');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openSectorModal(null));
  }
  
  updateSortIcons('sectors');
}

function sectorRow(s) {
  return `<tr data-sector-id="${s.id}">
    <td class="font-mono text-xs text-text-muted">${s.id.slice(0,8)}…</td>
    <td class="font-semibold">${s.sectorFrom}</td>
    <td class="font-semibold">${s.sectorTo}</td>
    <td><span class="font-mono font-bold text-primary">${s.sectorCode}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-sector" data-id="${s.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-sector" data-id="${s.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-sector" data-id="${s.id}" data-hidden="${s.isHidden === true}"
        class="px-3 py-1 rounded text-[12px] font-bold ${s.isHidden === true ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-400 text-white hover:bg-slate-500'}">
        ${s.isHidden === true ? 'Show Fares' : 'Hide Fares'}</button>
    </td>
  </tr>`;
}

function wireSectorActions() {
  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody) return;
  // Reset wired flag so listener rebinds after tbody innerHTML is replaced
  delete tbody.dataset.actionsWired;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const sector = _sectors.find(s => s.id === id);

    if (action === 'edit-sector') openSectorModal(sector);
    if (action === 'delete-sector') {
      if (!confirm(`Delete sector "${sector?.sectorCode}"?`)) return;
      try { await deleteSector(id); toast('success', 'Deleted', `Sector "${sector?.sectorCode}" removed.`); await renderSectorsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
    if (action === 'toggle-sector') {
      const isCurrentlyHidden = btn.dataset.hidden === 'true';
      const newHiddenStatus = !isCurrentlyHidden;
      btn.disabled = true; btn.textContent = 'Working…';
      try {
        const res = await callToggleSectorVisibility(id, newHiddenStatus);
        toast('success', `Sector Fares ${newHiddenStatus ? 'Hidden' : 'Shown'}`, res.message);
        await renderSectorsTab(); // Auto-refresh UI to fetch isHidden updates
      } catch (e) { toast('error', 'Toggle Failed', e.message); await renderSectorsTab(); }
    }
  });
}

function openSectorModal(sector) {
  const isEdit = !!sector;
  openModal(isEdit ? 'Edit Sector' : 'Add New Sector', `
    <form id="sector-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">From City *</label>
        <input name="sectorFrom" required placeholder="e.g. Kozhikode" value="${sector?.sectorFrom || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">To City *</label>
        <input name="sectorTo" required placeholder="e.g. Jeddah" value="${sector?.sectorTo || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Sector Code *</label>
        <input name="sectorCode" required placeholder="e.g. CCJ JED" value="${sector?.sectorCode || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-wide">
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${isEdit ? 'Save Changes' : 'Add Sector'}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('sector-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.sectorCode = data.sectorCode.toUpperCase();
    data.sectorFrom = data.sectorFrom.toUpperCase();
    data.sectorTo = data.sectorTo.toUpperCase();
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) { await updateSector(sector.id, data); toast('success', 'Updated', 'Sector updated.'); }
      else { await addSector(data); toast('success', 'Added', `Sector "${data.sectorCode}" added.`); }
      document.getElementById('admin-modal').close();
      await renderSectorsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Sector'; }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// FLIGHTS TAB (Airlines) — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
async function renderFlightsTab(fetchData = true) {
  if (fetchData) { _airlines = await getAirlines(); tablePage.airlines = 1; }

  // Wire up filter inputs if not already
  const searchInp = document.getElementById('airlines-search');
  const limitSel = document.getElementById('airlines-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.airlines = e.target.value; tablePage.airlines = 1; renderFlightsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.airlines = parseInt(e.target.value); tablePage.airlines = 1; renderFlightsTab(false); });
  }

  const tbody = document.querySelector('#flights-tab .admin-table tbody');
  if (!tbody) return;

  const sorted = applySortAndFilter(_airlines, 'airlines');
  const limit = tableLimit.airlines;
  const totalPages = Math.max(1, Math.ceil(sorted.length / limit));
  if (tablePage.airlines > totalPages) tablePage.airlines = totalPages;
  const start = (tablePage.airlines - 1) * limit;
  const pageData = sorted.slice(start, start + limit);

  tbody.innerHTML = pageData.length
    ? pageData.map(a => airlineRow(a)).join('')
    : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>`;

  renderPaginationFooter('airlines', sorted.length, totalPages, start, limit);

  wireAirlineActions();

  const addBtn = document.querySelector('#flights-tab .flex.justify-between button');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.addEventListener('click', () => openAirlineModal(null));
  }
  
  updateSortIcons('airlines');
}

function airlineRow(a) {
  const logo = a.logoUrl
    ? `<img src="${a.logoUrl}" class="h-7 w-7 object-contain rounded" alt="${a.name}">`
    : `<span class="w-7 h-7 bg-primary-light text-primary text-xs font-bold rounded flex items-center justify-center">${a.code}</span>`;
  return `<tr data-airline-id="${a.id}">
    <td>${logo}</td>
    <td class="font-semibold">${a.name}</td>
    <td><span class="font-mono font-bold text-primary">${a.code}</span></td>
    <td class="flex gap-1">
      <button data-action="edit-airline" data-id="${a.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-airline" data-id="${a.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
    </td>
  </tr>`;
}

function wireAirlineActions() {
  const tbody = document.querySelector('#flights-tab .admin-table tbody');
  if (!tbody) return;
  // Reset wired flag so listener rebinds after tbody innerHTML is replaced
  delete tbody.dataset.actionsWired;
  tbody.dataset.actionsWired = '1';
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;
    const airline = _airlines.find(a => a.id === id);

    if (action === 'edit-airline') openAirlineModal(airline);
    if (action === 'delete-airline') {
      if (!confirm(`Delete airline "${airline?.name}" (${airline?.code})?`)) return;
      try { await deleteAirline(id); toast('success', 'Deleted', `Airline "${airline?.name}" removed.`); await renderFlightsTab(); }
      catch (e) { toast('error', 'Error', e.message); }
    }
  });
}

function openAirlineModal(airline) {
  const isEdit = !!airline;
  openModal(isEdit ? 'Edit Airline' : 'Add New Airline', `
    <form id="airline-form" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Airline Name *</label>
        <input name="name" required placeholder="e.g. Air India Express" value="${airline?.name || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">IATA Code *</label>
        <input name="code" required maxlength="3" placeholder="e.g. IX" value="${airline?.code || ''}"
          class="w-full border border-border rounded-lg h-11 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono tracking-widest uppercase">
      </div>
      <div>
        <label class="block text-sm font-semibold text-text-muted mb-1">Logo (optional)</label>
        <input type="file" name="logoFile" accept="image/*"
          class="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary cursor-pointer">
        ${airline?.logoUrl ? `<img src="${airline.logoUrl}" class="mt-2 h-8 object-contain rounded" alt="current logo">` : ''}
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-primary text-white font-semibold h-11 rounded-lg hover:bg-blue-600 text-sm">
          ${isEdit ? 'Save Changes' : 'Add Airline'}
        </button>
        <button type="button" id="modal-cancel" class="px-6 h-11 rounded-lg border border-border text-text-muted hover:bg-slate-50 text-sm">Cancel</button>
      </div>
    </form>`);

  document.getElementById('modal-cancel')?.addEventListener('click', () => document.getElementById('admin-modal').close());
  document.getElementById('airline-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const logoFile = fd.get('logoFile')?.size > 0 ? fd.get('logoFile') : null;
    const data = { name: fd.get('name'), code: fd.get('code').toUpperCase() };
    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if (isEdit) { await updateAirline(airline.id, data, logoFile); toast('success', 'Updated', 'Airline updated.'); }
      else { await addAirline(data, logoFile); toast('success', 'Added', `Airline "${data.name}" added.`); }
      document.getElementById('admin-modal').close();
      await renderFlightsTab();
    } catch (err) { toast('error', 'Save Failed', err.message); btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add Airline'; }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// REPORTS TAB — Live charts powered by generateAgentReport Cloud Function
// ══════════════════════════════════════════════════════════════════════════════
async function renderReportsTab() {
  const tab = document.getElementById('reports-tab');
  if (!tab || tab.dataset.wired) return;
  tab.dataset.wired = '1';

  // Populate sector filter
  const sectorSel = document.getElementById('reports-sector-sel');
  if (sectorSel && sectorSel.options.length <= 1) {
    _sectors.forEach(s => sectorSel.appendChild(new Option(s.sectorCode, s.id)));
  }

  // Populate agent filter (informational only — Cloud Function aggregates all)
  const agentSel = document.getElementById('reports-agent-sel');
  if (agentSel && agentSel.options.length <= 1) {
    _agents.forEach(a => agentSel.appendChild(new Option(a.name, a.id)));
  }

  // Wire Generate Report button
  const fetchBtn = document.getElementById('generate-report-btn');
  const startInput = document.getElementById('reports-start-date');
  const endInput = document.getElementById('reports-end-date');

  if (fetchBtn && !fetchBtn.dataset.wired) {
    fetchBtn.dataset.wired = '1';
    fetchBtn.addEventListener('click', async () => {
      const sectorId = sectorSel?.value || 'all';
      const agentId = agentSel?.value || 'all';
      const startDate = startInput?.value || null;
      const endDate = endInput?.value || null;

      // Sector is the primary filter; dates and agent are optional
      if (sectorId === 'all' && !startDate && !endDate && agentId === 'all') {
        toast('warning', 'No Filter Selected', 'Select at least a sector, an agent, or a date range.');
        return;
      }

      fetchBtn.disabled = true; fetchBtn.textContent = 'Generating…';
      try {
        const [report, fares] = await Promise.all([
          callGenerateAgentReport(startDate, endDate, sectorId, agentId),
          getFares({ sectorId, agentId, startDate, endDate, includeHidden: true })
        ]);

        // ★ Must set _reportFares BEFORE renderReportCharts — it reads it for avg/live/hidden stats
        _reportFares = fares;
        renderReportCharts(report, tab);

        // Render the detailed fares table
        tablePage.reportFares = 1;
        renderReportFaresTable(_reportFares);
        
      } catch (e) { toast('error', 'Report Failed', e.message); }
      finally {
        fetchBtn.disabled = false;
        fetchBtn.innerHTML = '<i class="bi bi-lightning-fill text-[13px]"></i> Generate Report';
      }
    });
  }
}

function renderReportCharts(report, tab) {
  const { agentReport, sectorReport, totalFares } = report;

  // ── Stat Cards ──────────────────────────────────────────────────────────────
  const statsRow = document.getElementById('report-stats-row');
  if (statsRow) {
    statsRow.classList.remove('hidden');
    const liveFares   = (_reportFares || []).filter(f => !f.isHidden).length;
    const hiddenFares = (_reportFares || []).filter(f => f.isHidden).length;
    const agentsCount = new Set((_reportFares || []).map(f => f.agentId)).size;
    const rates = (_reportFares || []).map(f => f.finalRate || 0).filter(r => r > 0);
    const avgFare = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val.toLocaleString(); };
    setEl('stat-total-fares',  totalFares);
    setEl('stat-live-fares',   liveFares);
    setEl('stat-hidden-fares', hiddenFares);
    setEl('stat-agents-count', agentsCount);
    const avgEl = document.getElementById('stat-avg-fare');
    if (avgEl) avgEl.textContent = avgFare > 0 ? `₹${avgFare.toLocaleString()}` : '—';
  }

  // ── Fares table subtitle ────────────────────────────────────────────────────
  const totalEl = document.getElementById('report-total-fares');
  if (totalEl) totalEl.textContent = `${totalFares} fare${totalFares !== 1 ? 's' : ''} matched your filter`;

  // ── Bar Chart (SVG) — Fares per Agent ──────────────────────────────────────
  const barContainer = document.getElementById('bar-chart-container');
  if (barContainer && agentReport.length) {
    renderBarChart(agentReport.slice(0, 8), barContainer);
  }

  // ── Donut Chart (SVG) — Fares per Sector ────────────────────────────────────
  const donutSvg    = document.getElementById('donut-chart-svg');
  const legendEl    = document.getElementById('pie-legend');
  if (donutSvg && sectorReport.length) {
    renderDonutChart(sectorReport.slice(0, 8), donutSvg, legendEl);
  }

  // ── Leaderboards ─────────────────────────────────────────────────────────────
  const lbRow = document.getElementById('report-leaderboards');
  if (lbRow) {
    lbRow.classList.remove('hidden');
    renderLeaderboards(agentReport, sectorReport);
  }

  // ── Wire CSV export button ───────────────────────────────────────────────────
  const csvBtn = document.getElementById('download-report-csv');
  if (csvBtn) {
    const newBtn = csvBtn.cloneNode(true);
    csvBtn.parentNode.replaceChild(newBtn, csvBtn);
    newBtn.addEventListener('click', () => downloadReportCSV(_reportFares));
    if (_reportFares && _reportFares.length) {
      newBtn.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      newBtn.classList.add('opacity-50', 'pointer-events-none');
    }
  }

  toast('success', 'Report Ready', `${totalFares} fare${totalFares !== 1 ? 's' : ''} aggregated.`);
}

// ── SVG Bar Chart ─────────────────────────────────────────────────────────────
function renderBarChart(data, container) {
  const W = container.clientWidth || 480;
  const H = 260;
  const PAD = { top: 32, right: 16, bottom: 48, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const BRAND_COLORS = [
    ['#0c4a8a','#3b82f6'],['#065f46','#22c55e'],['#78350f','#f59e0b'],
    ['#7f1d1d','#ef4444'],['#4c1d95','#8b5cf6'],['#134e4a','#14b8a6'],
    ['#7c2d12','#f97316'],['#1e293b','#64748b'],
  ];

  // Y-axis ticks
  const ticks = 4;
  const tickStep = Math.ceil(maxCount / ticks);
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => i * tickStep);
  const yTickLines = yTicks.map(v => {
    const y = PAD.top + chartH - (v / (yTicks[yTicks.length - 1] || 1)) * chartH;
    return `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${W - PAD.right}" y2="${y.toFixed(1)}" stroke="#f1f5f9" stroke-width="1"/>
            <text x="${PAD.left - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-weight="600">${v}</text>`;
  }).join('');

  const barW = Math.min(48, (chartW / data.length) * 0.6);
  const barSpacing = chartW / data.length;

  const bars = data.map((d, i) => {
    const barH = Math.max(4, (d.count / (yTicks[yTicks.length - 1] || 1)) * chartH);
    const x = PAD.left + i * barSpacing + barSpacing / 2 - barW / 2;
    const y = PAD.top + chartH - barH;
    const [c1, c2] = BRAND_COLORS[i % BRAND_COLORS.length];
    const gradId = `bg${i}`;
    const avgTip = d.avgRate ? `avg ₹${Math.round(d.avgRate).toLocaleString()}` : '';
    return `<defs><linearGradient id="${gradId}" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="${c1}"/>
              <stop offset="100%" stop-color="${c2}"/>
            </linearGradient></defs>
            <g class="bar-group" data-name="${d.name}" data-count="${d.count}" data-avg="${avgTip}" style="cursor:pointer;">
              <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${barH.toFixed(1)}"
                rx="6" fill="url(#${gradId})" opacity="0.92"
                style="transform-origin:${(x + barW/2).toFixed(1)}px ${(PAD.top+chartH).toFixed(1)}px;
                       animation:barGrow 0.6s cubic-bezier(.34,1.56,.64,1) ${i*0.07}s both;"/>
              <text x="${(x + barW/2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle"
                font-size="11" font-weight="900" fill="${c2}">${d.count}</text>
              <text x="${(x + barW/2).toFixed(1)}" y="${(PAD.top + chartH + 16).toFixed(1)}" text-anchor="middle"
                font-size="10" font-weight="700" fill="#64748b">${(d.name || '').split(' ')[0].slice(0,8)}</text>
            </g>`;
  }).join('');

  const tooltipId = 'bar-tooltip';
  container.innerHTML = `
    <style>
      @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      #bar-svg .bar-group:hover rect { opacity: 1; filter: brightness(1.1); }
    </style>
    <div id="${tooltipId}" style="position:absolute;display:none;background:#0f172a;color:#fff;font-size:12px;font-weight:700;
      padding:8px 12px;border-radius:10px;pointer-events:none;z-index:10;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);
      line-height:1.6;"></div>
    <svg id="bar-svg" width="100%" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible;">
      ${yTickLines}
      <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="#cbd5e1" stroke-width="1.5"/>
      <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="#cbd5e1" stroke-width="1.5"/>
      ${bars}
    </svg>`;

  // Wire hover tooltip
  const svg = container.querySelector('#bar-svg');
  const tip = container.querySelector(`#${tooltipId}`);
  if (svg && tip) {
    svg.querySelectorAll('.bar-group').forEach(g => {
      g.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        tip.style.display = 'block';
        tip.style.left = (e.clientX - rect.left + 12) + 'px';
        tip.style.top  = (e.clientY - rect.top  - 40) + 'px';
        const avg = g.dataset.avg ? `<br><span style="opacity:.7;font-weight:500;">${g.dataset.avg}</span>` : '';
        tip.innerHTML = `${g.dataset.name}<br><span style="color:#60a5fa;">${g.dataset.count} fares</span>${avg}`;
      });
      g.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  }
}

// ── SVG Donut Chart ───────────────────────────────────────────────────────────
function renderDonutChart(data, svg, legendEl) {
  const COLORS = ['#1558c0','#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#f97316'];
  const CX = 110, CY = 110, R_OUTER = 95, R_INNER = 60;
  const total = data.reduce((s, r) => s + r.count, 0);

  const segGroup = svg.getElementById ? svg.getElementById('donut-segments') : svg.querySelector('#donut-segments');
  const centerCount = svg.querySelector('#donut-center-count');
  const centerLabel = svg.querySelector('#donut-center-label');
  if (!segGroup) return;

  if (centerCount) centerCount.textContent = total;
  if (centerLabel) centerLabel.textContent = 'FARES';

  // Helper: polar to cartesian
  const polar = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos((deg - 90) * Math.PI / 180),
    y: cy + r * Math.sin((deg - 90) * Math.PI / 180),
  });

  // Build arc paths
  let startDeg = 0;
  const paths = data.map((d, i) => {
    const sweep = total > 0 ? (d.count / total) * 360 : 0;
    const endDeg = startDeg + sweep;
    const large = sweep > 180 ? 1 : 0;
    const s = polar(CX, CY, R_OUTER, startDeg);
    const e = polar(CX, CY, R_OUTER, endDeg);
    const si = polar(CX, CY, R_INNER, startDeg);
    const ei = polar(CX, CY, R_INNER, endDeg);
    const pathD = [
      `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
      `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
      `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
      `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
      'Z',
    ].join(' ');
    const mid = startDeg + sweep / 2;
    startDeg = endDeg;
    const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : '0.0';
    return { pathD, color: COLORS[i % COLORS.length], name: d.name, count: d.count, pct, mid };
  });

  // Render paths
  const NS = 'http://www.w3.org/2000/svg';
  segGroup.innerHTML = '';
  const pathEls = paths.map((p, i) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', p.pathD);
    el.setAttribute('fill', p.color);
    el.setAttribute('stroke', 'white');
    el.setAttribute('stroke-width', '2');
    el.style.cursor = 'pointer';
    el.style.transition = 'transform 0.2s, filter 0.2s';
    el.style.transformOrigin = `${CX}px ${CY}px`;
    el.setAttribute('data-index', i);
    segGroup.appendChild(el);
    return el;
  });

  // Highlight helper
  const highlight = (idx) => {
    pathEls.forEach((el, j) => {
      if (j === idx) {
        el.style.transform = 'scale(1.04)';
        el.style.filter = 'brightness(1.1)';
        el.setAttribute('stroke-width', '3');
      } else {
        el.style.transform = 'scale(1)';
        el.style.filter = 'brightness(1)';
        el.setAttribute('stroke-width', '2');
      }
    });
    if (idx >= 0 && idx < paths.length) {
      if (centerCount) centerCount.textContent = paths[idx].count;
      if (centerLabel) centerLabel.textContent = paths[idx].name.split(' ')[0].toUpperCase().slice(0, 7);
    } else {
      if (centerCount) centerCount.textContent = total;
      if (centerLabel) centerLabel.textContent = 'FARES';
    }
  };

  pathEls.forEach((el, i) => {
    el.addEventListener('mouseover', () => { highlight(i); highlightLegend(i); });
    el.addEventListener('mouseout',  () => { highlight(-1); highlightLegend(-1); });
  });

  // Legend
  if (legendEl) {
    legendEl.innerHTML = paths.map((p, i) => `
      <div class="flex items-center gap-2 text-[12px] cursor-default legend-row" data-legend-idx="${i}"
        style="padding:4px 6px;border-radius:8px;transition:background 0.15s;">
        <span style="width:10px;height:10px;border-radius:50%;background:${p.color};flex-shrink:0;"></span>
        <span class="truncate" style="color:#64748b;flex:1;">${p.name}</span>
        <span style="font-weight:900;color:#0f172a;margin-left:auto;">${p.count}</span>
        <span style="color:#94a3b8;font-size:10px;width:36px;text-align:right;">${p.pct}%</span>
      </div>`).join('');

    const highlightLegendRows = (idx) => {
      legendEl.querySelectorAll('.legend-row').forEach((row, j) => {
        row.style.background = j === idx ? '#f1f5f9' : '';
      });
    };
    // Expose so segment hover can call it
    window._highlightLegendRows = highlightLegendRows;

    legendEl.querySelectorAll('.legend-row').forEach((row, i) => {
      row.addEventListener('mouseover', () => { highlight(i); highlightLegendRows(i); });
      row.addEventListener('mouseout',  () => { highlight(-1); highlightLegendRows(-1); });
    });
  }

  function highlightLegend(idx) {
    if (window._highlightLegendRows) window._highlightLegendRows(idx);
  }
}

// ── Leaderboard Cards ─────────────────────────────────────────────────────────
function renderLeaderboards(agentReport, sectorReport) {
  const BRAND = ['#1558c0','#3b82f6','#22c55e','#f59e0b','#ef4444'];

  // Top agents by count
  const agentsEl = document.getElementById('leaderboard-agents');
  if (agentsEl && agentReport.length) {
    const top = [...agentReport].sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCount = top[0].count || 1;
    agentsEl.innerHTML = top.map((a, i) => {
      const pct = Math.max(6, Math.round((a.count / maxCount) * 100));
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`;
      return `<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;width:28px;text-align:center;flex-shrink:0;">${medal}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${a.name}</span>
            <span style="color:${BRAND[i]};margin-left:8px;">${a.count} fares</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${BRAND[i]};border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // Cheapest sectors by avg rate
  const sectorsEl = document.getElementById('leaderboard-sectors');
  if (sectorsEl && sectorReport.length) {
    const withAvg = sectorReport.filter(s => s.avgRate > 0);
    const sorted = [...withAvg].sort((a, b) => a.avgRate - b.avgRate).slice(0, 5);
    const minRate = sorted[0]?.avgRate || 1;
    const maxRate = sorted[sorted.length - 1]?.avgRate || 1;
    sectorsEl.innerHTML = sorted.map((s, i) => {
      const pct = maxRate > minRate ? Math.max(6, Math.round(((s.avgRate - minRate) / (maxRate - minRate)) * 100)) : 50;
      return `<div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:12px;font-weight:900;color:#94a3b8;width:20px;text-align:center;flex-shrink:0;">${i+1}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">
            <span class="truncate">${s.name}</span>
            <span style="color:#f59e0b;margin-left:8px;">avg ₹${Math.round(s.avgRate).toLocaleString()}</span>
          </div>
          <div style="background:#f1f5f9;border-radius:99px;height:6px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(to right,#22c55e,#f59e0b);border-radius:99px;transition:width 0.8s cubic-bezier(.34,1.56,.64,1);"></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }
}

function downloadReportCSV(fares) {
    if (!fares || !fares.length) {
        toast('warning', 'No Data', 'No fares to export. Apply filters and fetch first.');
        return;
    }

    const agentMap  = Object.fromEntries(_agents.map(a  => [a.id, a.name]));
    const sectorMap = Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode]));
    const airlineMap = Object.fromEntries(_airlines.map(a => [a.id, a.code || a.name]));

    // Helper: escape a value for CSV (wrap in quotes, escape internal quotes)
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const headers = ['Date', 'Time', 'Sector', 'Airline', 'Agent', 'SP Rate (INR)', 'Rate (INR)', 'Commission (INR)', 'Baggage (kg)', 'Extra Baggage (kg)', 'Status'];
    const rows = fares.map(f => {
        const dt = f.flightDate instanceof Date
            ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : (f.flightDate || '');
        return [
            esc(dt),
            esc(f.flightTime || ''),
            esc(sectorMap[f.sectorId] || f.sectorId),
            esc(airlineMap[f.airlineId] || f.airlineId),
            esc(agentMap[f.agentId] || f.agentId),
            esc(f.specialRate || 0),
            esc(f.finalRate || 0),
            esc(f.commission || 0),
            esc(f.baggage || ''),
            esc(f.extraBaggage || ''),
            esc(f.isHidden ? 'Hidden' : 'Live')
        ].join(',');
    });

    const csv = [headers.map(esc).join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zamra-fares-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast('success', 'CSV Downloaded', `${fares.length} fares exported.`);
}


// ══════════════════════════════════════════════════════════════════════════════
// AGENT SHEETS TAB — Submit rate data to Firestore (+ legacy n8n webhook)
// ══════════════════════════════════════════════════════════════════════════════
const WEBHOOK = 'https://n8n.srv1046139.hstgr.cloud/webhook/zamra';
const MONTHS = { JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12' };
const AIR_RX = /\b(IX|6E|G9|SV|WY|XY|QP|FZ|OV|AI|J9|SG)\b/;

let selAgent = null;
let rateHistory = JSON.parse(localStorage.getItem('zt_hist') || '[]');
let totalEntries = rateHistory.reduce((a, h) => a + (h.rows || 0), 0);

function initAgentSheets() {
  // Agent chips will be built after global data is loaded (called from onAuthChange)
  const ta = document.getElementById('rateData');
  if (ta) {
    ta.addEventListener('input', function () {
      const n = this.value.length;
      const cc = document.getElementById('charCount');
      if (cc) cc.textContent = n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
      validate();
      clearTimeout(window._previewTimer);
      if (n > 15) window._previewTimer = setTimeout(() => doPreview(this.value), 500);
      else hidePrev();
    });
  }

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (ta) ta.value = '';
    const cc = document.getElementById('charCount');
    if (cc) cc.textContent = '0 characters';
    hidePrev(); validate();
  });

  document.getElementById('clearBtn')?.addEventListener('click', () => {
    rateHistory = []; totalEntries = 0;
    saveHistory(); renderHistory(); updateStats();
  });

  document.getElementById('manualAgent')?.addEventListener('input', function () {
    const v = parseInt(this.value);
    selAgent = (v > 0) ? String(v) : null;
    document.querySelectorAll('.rp-chip').forEach(c => c.classList.remove('on'));
    syncPill(); validate();
  });

  document.getElementById('submitBtn')?.addEventListener('click', handleSheetSubmit);

  updateStats();
  renderHistory();
}

// Build agent chips from Firestore agents list
function buildChips() {
  const cGrid = document.getElementById('chipGrid');
  if (!cGrid || cGrid.children.length > 0) return;

  const chipAgents = _agents.length ? [..._agents].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.id.localeCompare(b.id);
  }) : [];

  if (!chipAgents.length) {
    cGrid.innerHTML = `<p class="text-sm text-text-muted">No agents found. Add agents in the Agents tab first.</p>`;
    return;
  }

  chipAgents.forEach(agent => {
    const c = document.createElement('div');
    c.className = 'rp-chip';
    c.dataset.agentId = agent.id;
    c.textContent = agent.id;
    c.style.cssText = 'height:48px;padding:0 12px;display:flex;align-items:center;justify-content:center;border:2px solid #b8cce4;border-radius:10px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer;background:#ffffff;user-select:none;box-shadow:0 1px 4px rgba(13,31,60,.10);transition:all .16s ease;white-space:nowrap;';
    c.addEventListener('click', () => pickAgent(agent.id, agent.name, c));
    cGrid.appendChild(c);
  });
}


function pickAgent(agentId, agentName, el) {
  selAgent = agentId;
  document.getElementById('manualAgent').value = '';
  document.querySelectorAll('.rp-chip').forEach(c => {
    c.classList.remove('on');
    c.style.background = '#ffffff'; c.style.color = '#1e293b';
    c.style.borderColor = '#b8cce4'; c.style.boxShadow = '0 1px 4px rgba(13,31,60,.10)'; c.style.transform = '';
  });
  if (el) {
    el.classList.add('on');
    el.style.background = '#1a73e8'; el.style.color = '#ffffff';
    el.style.borderColor = '#1a73e8'; el.style.boxShadow = '0 4px 14px rgba(26,115,232,.3)'; el.style.transform = 'translateY(-1px)';
  }
  syncPill(); validate();
}

function syncPill() {
  const p = document.getElementById('agentPill');
  if (!p) return;
  if (selAgent) {
    const agent = _agents.find(a => a.id === selAgent);
    p.textContent = `Agent ${agent?.id || selAgent} selected ✓`;
    p.classList.remove('empty');
  } else {
    p.textContent = 'No agent selected';
    p.classList.add('empty');
  }
}

function validate() {
  const ta = document.getElementById('rateData');
  const btn = document.getElementById('submitBtn');
  if (btn) btn.disabled = !(selAgent && ta && ta.value.trim().length > 10);
}

// Quick client-side parser
function quickParse(text) {
  const rows = [];
  let sector = null, airline = 'IX';
  for (const raw of text.split('\n')) {
    const line = raw.replace(/[*_~`]/g, '').trim();
    if (!line) continue;
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
      const m = line.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*?(\d{4,6})/i);
      if (m) {
        const rate = parseInt(m[3]);
        if (rate >= 1000 && rate <= 99999) {
          rows.push({ sector, date: `2026-${MONTHS[m[2].toUpperCase()]}-${m[1].padStart(2,'0')}`, airline: am ? am[1] : airline, rate });
        }
      }
    }
  }
  return rows;
}

function doPreview(text) {
  const rows = quickParse(text);
  if (!rows.length) { hidePrev(); return; }
  const pb = document.getElementById('prevBox');
  if (pb) pb.classList.add('on');
  const pc = document.getElementById('prevCount');
  if (pc) pc.textContent = rows.length + ' entr' + (rows.length === 1 ? 'y' : 'ies');
  const tbody = document.getElementById('prevBody');
  if (!tbody) return;
  tbody.innerHTML = rows.slice(0, 60).map(r => `
    <tr><td class="px-4 py-2 text-sm text-center border-b border-border">${r.sector}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.date}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">${r.airline}</td>
    <td class="px-4 py-2 text-sm text-center border-b border-border">₹${r.rate.toLocaleString()}</td></tr>`).join('');
  if (rows.length > 60) tbody.innerHTML += `<tr><td colspan="4" class="text-center p-3 text-xs text-text-muted">+ ${rows.length-60} more</td></tr>`;
}

function hidePrev() { document.getElementById('prevBox')?.classList.remove('on'); }

async function handleSheetSubmit() {
  const ta = document.getElementById('rateData');
  if (!selAgent || !ta?.value.trim()) return;

  const btn = document.getElementById('submitBtn');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending to AI...`;

  const bar = document.getElementById('progBar');
  const fill = document.getElementById('progFill');
  if (bar) bar.classList.add('on');
  let prog = 0;
  const iv = setInterval(() => { prog = Math.min(prog + Math.random() * 13, 85); if (fill) fill.style.width = prog + '%'; }, 280);

  const parsedRows = quickParse(ta.value);

  const hEntry = {
    id: Date.now(), agent: selAgent,
    time: new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }),
    rows: parsedRows.length, status: 'pen',
  };
  rateHistory.unshift(hEntry);
  if (rateHistory.length > 15) rateHistory.pop();
  saveHistory(); renderHistory();

  try {
    const n8nResp = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: selAgent, raw_text: ta.value.trim(), timestamp: new Date().toISOString(), source: 'zamra-portal' }),
    });

    clearInterval(iv);
    if (fill) fill.style.width = '100%';

    if (n8nResp.ok) {
      hEntry.status = 'ok';
      // Use estimated rows just for UI stat
      totalEntries += parsedRows.length; 
      saveHistory(); renderHistory(); updateStats();
      toast('success', 'Submitted', 'Rates dispatched to AI Agent. The database will reflect parsing results momentarily.');
      setTimeout(() => { ta.value = ''; const cc = document.getElementById('charCount'); if (cc) cc.textContent = '0 characters'; hidePrev(); validate(); }, 500);
    } else {
      throw new Error('N8N webhook rejected payload');
    }
  } catch (err) {
    clearInterval(iv);
    if (fill) fill.style.width = '100%';
    hEntry.status = 'err';
    saveHistory(); renderHistory();
    toast('error', 'Submission Failed', err.message);
  }

  setTimeout(() => { if (bar) bar.classList.remove('on'); if (fill) fill.style.width = '0%'; btn.innerHTML = orig; validate(); }, 900);
}

function updateStats() {
  const ss = document.getElementById('statSubs');
  if (ss) ss.textContent = rateHistory.length;
  const se = document.getElementById('statEntries');
  if (se) se.textContent = totalEntries;
}

function saveHistory() { localStorage.setItem('zt_hist', JSON.stringify(rateHistory)); }

function renderHistory() {
  const wrap = document.getElementById('historyWrap');
  if (!wrap) return;
  if (!rateHistory.length) {
    wrap.innerHTML = `<div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
      <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      No submissions yet</div>`;
    return;
  }
  wrap.innerHTML = rateHistory.map(h => {
    const agentName = _agents.find(a => a.id === h.agent)?.name || `Agent ${h.agent}`;
    return `<div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0 text-xs text-center">${agentName.split(' ')[0].slice(0,3)}</div>
      <div class="flex-1"><div class="text-sm font-bold text-navy">${agentName}</div><div class="text-[11px] font-semibold text-text-muted mt-0.5">${h.time}</div></div>
      <div class="text-right"><div class="text-[15px] font-black tracking-tight text-navy">${h.rows}</div><div class="text-[10px] font-bold uppercase text-text-muted">entries</div></div>
      <div class="w-2.5 h-2.5 rounded-full ${h.status==='ok'?'bg-green-500':h.status==='err'?'bg-red-500':'bg-yellow-400'}"></div>
    </div>`;
  }).join('');
}


// ══════════════════════════════════════════════════════════════════════════════
// E-TICKET GENERATOR
// ══════════════════════════════════════════════════════════════════════════════

async function renderETicketTab() {
  const tab = document.getElementById('eticket-tab');
  if (!tab) return;

  const form = document.getElementById('eticket-form');
  const addPaxBtn = document.getElementById('et-add-passenger');
  const paxContainer = document.getElementById('et-passengers-container');
  const airlineSelect = document.getElementById('et-airline');
  const originSelect = document.getElementById('et-origin');
  const destinationSelect = document.getElementById('et-destination');

  // Ensure data is loaded
  if (_airlines.length === 0) _airlines = await getAirlines();
  if (_sectors.length === 0) _sectors = await getSectors();

  // Prevent double-binding by checking dataset.wired
  if (!tab.dataset.wired) {
    tab.dataset.wired = '1';

    // Populate dropdowns with current global data
    if (airlineSelect && _airlines) {
      airlineSelect.innerHTML = '<option value="">Select Airline</option>' + 
        _airlines.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
    }
    
    if (originSelect && _sectors) {
      const uniqueOrigins = [...new Set(_sectors.map(s => s.sectorFrom).filter(Boolean))].sort();
      originSelect.innerHTML = '<option value="">Select Origin</option>' + 
        uniqueOrigins.map(o => `<option value="${o}">${o}</option>`).join('');
    }

    if (destinationSelect && _sectors) {
      const uniqueDests = [...new Set(_sectors.map(s => s.sectorTo).filter(Boolean))].sort();
      destinationSelect.innerHTML = '<option value="">Select Destination</option>' + 
        uniqueDests.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    // Add Passenger Row Logic
    addPaxBtn?.addEventListener('click', () => {
      const idx = paxContainer.children.length;
      const rowHtml = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg bg-white et-pax-row relative">
          <button type="button" class="absolute -top-3 -right-3 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-200" onclick="this.closest('.et-pax-row').remove()" title="Remove passenger">×</button>
          
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Title</label>
            <select name="paxTitle[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="MR">MR</option>
              <option value="MRS">MRS</option>
              <option value="MS">MS</option>
              <option value="MSTR">MSTR</option>
              <option value="MISS">MISS</option>
            </select>
          </div>

          <div class="md:col-span-3">
            <label class="block text-xs font-semibold text-text-muted mb-1">Passenger Name *</label>
            <input type="text" name="paxName[]" required placeholder="e.g. JOHN DOE" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none uppercase placeholder:normal-case">
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-text-muted mb-1">Category</label>
            <select name="paxType[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
              <option value="ADT">Adult</option>
              <option value="CHD">Child</option>
              <option value="INF">Infant</option>
            </select>
          </div>

          <div class="md:col-span-5 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Check-in Bag</label>
              <select name="paxCheckBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="15 Kilograms">15 Kilograms</option>
                <option value="20 Kilograms">20 Kilograms</option>
                <option value="25 Kilograms">25 Kilograms</option>
                <option value="30 Kilograms" selected>30 Kilograms</option>
                <option value="35 Kilograms">35 Kilograms</option>
                <option value="40 Kilograms">40 Kilograms</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-muted mb-1">Carry-on</label>
              <select name="paxCarryBag[]" class="w-full border border-border rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                <option value="7 Kilograms" selected>7 Kilograms</option>
                <option value="10 Kilograms">10 Kilograms</option>
              </select>
            </div>
          </div>
        </div>
      `;
      paxContainer.insertAdjacentHTML('beforeend', rowHtml);
    });

    // Add first row default
    if (paxContainer.children.length === 0) {
      addPaxBtn?.click();
    }

    // Form submission wrapper to build and show the preview
    // Note: Use 'submit' event to leverage native form validation
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await generateETicket(new FormData(form));
    });

    // Wire Print Ticket Button (inside preview action bar)
    document.getElementById('et-print-btn')?.addEventListener('click', () => {
      window.print();
    });

    // Wire Reset form button
    form?.addEventListener('reset', () => {
      // Small timeout allows native reset to happen, then we clean up passenger rows
      setTimeout(() => {
        // Keep only first passenger row
        Array.from(paxContainer.children).forEach((child, index) => {
          if (index > 0) child.remove();
        });
        document.getElementById('eticket-output-wrapper')?.classList.add('hidden');
      }, 10);
      toast('info', 'Form Reset', 'The E-Ticket form has been cleared.');
    });
  }
}

async function generateETicket(formData) {
  const pnr = formData.get('etPnr')?.toUpperCase();
  const airline = formData.get('etAirline')?.toUpperCase();
  const flightNo = formData.get('etFlightNo')?.toUpperCase();
  let dateRaw = formData.get('etDate');
  const depTime = formData.get('etDepTime');
  const arrTime = formData.get('etArrTime');
  const phone = formData.get('etPhone');

  // Parse origin and destination into array to split city and airport code if formatted like "Kozhikode (CCJ)"
  const parseLoc = (val) => {
    let raw = (val || '').trim();
    let city = raw, code = '';
    const match = raw.match(/^(.*?)\\s*\\((.*?)\\)$/);
    if (match) {
      city = match[1].trim();
      code = match[2].trim();
    }
    return { city, code };
  };

  const origin = parseLoc(formData.get('etOrigin'));
  const dest = parseLoc(formData.get('etDest'));

  // Format date to "SAT, 03 MAY 2025"
  let formattedDate = dateRaw;
  if (dateRaw) {
    const d = new Date(dateRaw);
    if (!isNaN(d.getTime())) {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      formattedDate = `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  // Inject top-level flight details
  const el = (id) => document.getElementById(id);

  if (el('t-pnr')) el('t-pnr').textContent = pnr || '—';
  if (el('t-crs-pnr')) el('t-crs-pnr').textContent = pnr || '—';
  if (el('t-booking-ref')) el('t-booking-ref').textContent = pnr || '—';
  if (el('t-airline-tollfree')) el('t-airline-tollfree').textContent = '';
  
  const fullOrg = formData.get('etOrigin') || '—';
  const fullDst = formData.get('etDest') || '—';

  if (el('t-issued-by')) el('t-issued-by').textContent = airline || '—';
  if (el('t-customer-phone')) el('t-customer-phone').textContent = phone || '—';
  
  // Booked on - today
  const today = new Date();
  const ddays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (el('t-booked-on')) el('t-booked-on').textContent = `${String(today.getDate()).padStart(2, '0')}-${dmonths[today.getMonth()]}-${today.getFullYear()} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  // Set airline logo (requires looking up _airlines array)
  if (el('t-airline-logo')) {
    const matchedAirline = typeof _airlines !== 'undefined' ? _airlines.find(a => a.name.toUpperCase() === airline) : null;
    if (matchedAirline && matchedAirline.logoUrl && el('t-airline-logo')) {
      el('t-airline-logo').src = matchedAirline.logoUrl;
      el('t-airline-logo').classList.remove('hidden');
      if (el('t-issued-by')) {
          el('t-issued-by').classList.remove('mt-1');
          el('t-issued-by').textContent = airline;
      }
    } else {
      el('t-airline-logo').classList.add('hidden');
      if(el('t-issued-by')) {
          el('t-issued-by').classList.add('mt-1');
          el('t-issued-by').textContent = airline;
      }
    }
  }

  // Find codes if not present in dropdown value
  let originCode = origin.code;
  let destCode = dest.code;
  let matchedSector = null;

  if (typeof _sectors !== 'undefined') {
    matchedSector = _sectors.find(s => s.sectorFrom === fullOrg && s.sectorTo === fullDst);
    if (!matchedSector && fullOrg) {
      const match = _sectors.find(s => s.sectorFrom === fullOrg);
      if (match && match.sectorCode) originCode = match.sectorCode.split(/[ -]+/)[0];
    }
    if (!matchedSector && fullDst) {
      const match = _sectors.find(s => s.sectorTo === fullDst);
      if (match && match.sectorCode) destCode = match.sectorCode.split(/[ -]+/).pop();
    }
  }

  const originDisplay = origin.city.toUpperCase();
  const destDisplay = dest.city.toUpperCase();

  // Extract passenger arrays
  const paxTitles = formData.getAll('paxTitle[]');
  const paxNames = formData.getAll('paxName[]');
  const paxTypes = formData.getAll('paxType[]');
  const paxCheckBag = formData.getAll('paxCheckBag[]');
  const paxCarryBag = formData.getAll('paxCarryBag[]');

  const paxTbody = document.getElementById('t-passengers-tbody');
  if (paxTbody) paxTbody.innerHTML = '';

  for (let i = 0; i < paxNames.length; i++) {
    const title = (paxTitles[i] || 'MR').toUpperCase();
    const name = (paxNames[i] || '').toUpperCase();
    const type = (paxTypes[i] || 'ADT').toUpperCase();
    const checkbag = (paxCheckBag[i] || '').toUpperCase();
    const carrybag = (paxCarryBag[i] || '').toUpperCase();

    const formattedName = `${title}. ${name} (${type})`;
    let segString = '';
    if (matchedSector && matchedSector.sectorCode) {
        segString = matchedSector.sectorCode.toUpperCase();
    } else {
        segString = `${originCode || origin.city || '—'} - ${destCode || dest.city || '—'}`.toUpperCase();
    }

    // Generate inner row markup
    const tr = document.createElement('tr');
    tr.style.borderBottom = 'none'; // border handled at td layer
    
    tr.innerHTML = `
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${title}. ${name}<br><span class="text-gray-500 text-[10px] uppercase"></span></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${segString}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800">${flightNo || ''}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-[#1e3a8a] text-center font-bold">${pnr || ''}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 text-center">${carrybag}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2">${checkbag}</td>
      <td class="border-b border-r border-gray-200 p-2 align-top text-gray-800 px-2 border-r-0"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800"></td>
      <td class="border-b border-gray-200 p-2 align-top text-gray-800">Confirmed</td>
    `;
    if (paxTbody) paxTbody.appendChild(tr);
  }

  // Travel Details Row
  const travelTbody = document.getElementById('t-travel-tbody');
  if (travelTbody) {
    travelTbody.innerHTML = `
      <tr class="text-black">
        <td class="p-2 border-b border-gray-300 align-top">
          <div class="font-normal text-[11px]">${flightNo || '—'}</div>
          <div class="text-[10px] text-gray-600 mt-0.5">Non-Refundable</div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${originDisplay}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${depTime || '—'}</span> <span class="text-gray-600 ml-1 text-[11px]">${formattedDate || '—'}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top">
          <div class="font-bold uppercase">${destDisplay}</div>
          <div class="text-[13px] mt-1"><span class="font-bold">${arrTime || '—'}</span> <span class="text-gray-600 ml-1 text-[11px]">${formattedDate || '—'}</span></div>
        </td>
        <td class="p-2 border-l border-b border-gray-300 align-top text-center text-[12px]">
          Confirmed
        </td>
      </tr>
    `;
  }

  // Show the preview wrapper
  const wrapper = document.getElementById('eticket-output-wrapper');
  if (wrapper) {
    wrapper.classList.remove('hidden');
    wrapper.scrollIntoView({ behavior: 'smooth' });
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
const TICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  info: `<svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
};

function toast(type, title, msg) {
  const tEl = document.getElementById('toastsEl');
  if (!tEl) return;
  const el = document.createElement('div');
  const styles = { 
    success:'border-green-500 bg-green-50 text-green-800', 
    error:'border-red-500 bg-red-50 text-red-800', 
    warning:'border-yellow-500 bg-yellow-50 text-yellow-800',
    info:'border-primary bg-primary/10 text-[var(--color-primary-dark)]'
  };
  el.className = `flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${styles[type] || styles.error}`;
  el.innerHTML = `<div class="mt-0.5">${TICONS[type]||TICONS.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${title}</div><div class="text-xs opacity-90 mt-1">${msg}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`;
  tEl.appendChild(el);
  setTimeout(() => el.isConnected && el.remove(), 7000);
}

// Ensure the toast function is globally available for video-export.js and other external modules
window.toast = toast;

// ── Rebuild chips when the sheets tab becomes active ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Chips built after auth resolves in the onAuthChange handler above
});

