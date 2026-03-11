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

// ── Global State ──────────────────────────────────────────────────────────────
let _agents = [];
let _sectors = [];
let _airlines = [];
let _dashboardFares = [];

// ── Sorting & Search State ────────────────────────────────────────────────────
let tableSort = {
  agents: { key: 'id', asc: true },
  sectors: { key: 'id', asc: true },
  airlines: { key: 'name', asc: true },
  dashboard: { key: 'finalRate', asc: true }
};
let tableSearch = { sectors: '', airlines: '' };
let tableLimit = { sectors: 10, airlines: 10 };

function applySortAndFilter(data, tab) {
  let filtered = data;
  const q = tableSearch[tab]?.toLowerCase();
  
  if (q && tab === 'sectors') {
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
  
  const limit = tableLimit[tab] || 999999;
  return filtered.slice(0, limit);
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
  else if (tab === 'dashboard' && _dashboardFares.length) renderDashboardResults(_dashboardFares, document.getElementById('dashboard-tab'));
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
  // agent-charts-tab removed
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
// DASHBOARD TAB — Live fare search by sector + date range
// ══════════════════════════════════════════════════════════════════════════════
async function renderDashboardTab() {
  const tab = document.getElementById('dashboard-tab');
  if (!tab) return;

  // Populate sector dropdown from live Firestore data
  const sectorSel = document.getElementById('dashboard-sector-sel');
  if (sectorSel && sectorSel.options.length <= 1) {
    _sectors.forEach(s => {
      const opt = new Option(s.sectorCode, s.id);
      sectorSel.appendChild(opt);
    });
  }

  // Hook up Fetch button
  const fetchBtn = document.getElementById('dashboard-fetch-btn');
  if (fetchBtn && !fetchBtn.dataset.wired) {
    fetchBtn.dataset.wired = '1';
    fetchBtn.addEventListener('click', async () => {
      const startInput = document.getElementById('dashboard-start-date');
      const endInput = document.getElementById('dashboard-end-date');
      const sectorId = sectorSel?.value || 'all';
      const startDate = startInput?.value;
      const endDate = endInput?.value;

      if (!startDate || !endDate) { toast('warning', 'Missing Dates', 'Please select start and end dates.'); return; }

      fetchBtn.disabled = true;
      fetchBtn.textContent = 'Loading…';
      try {
        const fares = await getFares({ sectorId, startDate, endDate, includeHidden: true });
        _dashboardFares = fares;
        renderDashboardResults(_dashboardFares, tab);
      } catch (e) {
        toast('error', 'Fetch Failed', e.message);
      } finally {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Fetch';
      }
    });
  }
}

function renderDashboardResults(fares, tab) {
  let target = document.getElementById('dashboard-results');
  if (!target) {
    target = document.createElement('div');
    target.id = 'dashboard-results';
    target.className = 'mt-8';
    tab.appendChild(target);
  }

  if (!fares.length) {
    target.innerHTML = `<div class="text-center text-text-muted border-2 border-dashed border-border/20 rounded-xl py-12">
      <i class="bi bi-inbox text-4xl opacity-50 mb-3 block"></i><p>No fares found for this selection.</p></div>`;
    return;
  }

  // Build agent & sector lookup maps
  const agentMap = Object.fromEntries(_agents.map(a => [a.id, a.name]));
  const sectorMap = Object.fromEntries(_sectors.map(s => [s.id, s.sectorCode]));
  const airlineMap = Object.fromEntries(_airlines.map(a => [a.id, a.code]));

  target.innerHTML = `
    <div class="bg-white rounded-2xl shadow-[var(--shadow-premium-soft)] border border-slate-100 overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-border/50">
        <p class="font-bold text-navy text-sm">${fares.length} Fare${fares.length !== 1 ? 's' : ''} Found</p>
      </div>
      <div class="admin-table-container overflow-x-auto w-full">
        <table class="admin-table w-full text-sm">
          <thead><tr>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="flightDate">Date <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="flightTime">Time <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="sectorId">Sector <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="airlineId">Airline <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="agentId">Agent <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="specialRate">SP Rate (₹) <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="finalRate">Rate (₹) <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="commission">Comm <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="baggage">Baggage <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="extraBaggage">Ex.Bag <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="cursor-pointer group whitespace-nowrap" data-sort-tab="dashboard" data-sort-key="isHidden">Status <i class="bi bi-arrow-down-up opacity-30 group-hover:opacity-100 transition-opacity ml-1 text-[11px]"></i></th>
            <th class="whitespace-nowrap">Actions</th>
          </tr></thead>
          <tbody>
            ${applySortAndFilter(fares, 'dashboard').map(f => `
              <tr class="hover:bg-slate-50 border-b border-border/20 last:border-0 transition-colors">
                <td class="whitespace-nowrap">${f.flightDate instanceof Date ? f.flightDate.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : f.flightDate}</td>
                <td class="whitespace-nowrap text-text-muted">${f.flightTime || '—'}</td>
                <td class="whitespace-nowrap font-medium text-navy">${sectorMap[f.sectorId] || f.sectorId}</td>
                <td class="whitespace-nowrap">${airlineMap[f.airlineId] || f.airlineId}</td>
                <td class="whitespace-nowrap text-text-muted">${agentMap[f.agentId] || f.agentId}</td>
                <td class="whitespace-nowrap font-semibold opacity-60">₹${(f.specialRate || 0).toLocaleString()}</td>
                <td class="whitespace-nowrap font-bold text-navy">₹${(f.finalRate || 0).toLocaleString()}</td>
                <td class="whitespace-nowrap opacity-70">₹${(f.commission || 0).toLocaleString()}</td>
                <td class="whitespace-nowrap">${f.baggage ? f.baggage + 'kg' : '—'}</td>
                <td class="whitespace-nowrap">${f.extraBaggage ? f.extraBaggage + 'kg' : '—'}</td>
                <td class="whitespace-nowrap"><span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${f.isHidden ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}">${f.isHidden ? 'Hidden' : 'Live'}</span></td>
                <td class="whitespace-nowrap">
                  <button onclick="window.__deleteFare('${f.id}')"
                    class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded shadow-sm text-[11px] font-bold hover:bg-red-500 hover:text-white transition-colors">Del</button>
                  <button onclick="window.__toggleFare('${f.id}', ${!f.isHidden})"
                    class="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded shadow-sm text-[11px] font-bold hover:bg-slate-500 hover:text-white transition-colors ml-1">${f.isHidden ? 'Show' : 'Hide'}</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  // Expose global handlers for inline onclick
  window.__deleteFare = async (fareId) => {
    if (!confirm('Delete this fare?')) return;
    try { await deleteFare(fareId); toast('success', 'Deleted', 'Fare removed.'); renderActiveTab(); }
    catch (e) { toast('error', 'Error', e.message); }
  };
  window.__toggleFare = async (fareId, isHidden) => {
    try {
      await updateFare(fareId, { isHidden });
      toast('success', 'Updated', `Fare ${isHidden ? 'hidden' : 'shown'}.`);
      renderActiveTab();
    } catch (e) { toast('error', 'Error', e.message); }
  };

  updateSortIcons('dashboard');
}


// ══════════════════════════════════════════════════════════════════════════════
// AGENTS TAB — Full CRUD + Bulk Delete + Toggle Active
// ══════════════════════════════════════════════════════════════════════════════
async function renderAgentsTab(fetchData = true) {
  if (fetchData) _agents = await getAgents();
  const tbody = document.querySelector('#agents-tab .admin-table tbody');
  if (!tbody) return;

  const data = applySortAndFilter(_agents, 'agents');
  tbody.innerHTML = data.length
    ? data.map(a => agentRow(a)).join('')
    : `<tr><td colspan="6" class="text-center py-8 text-text-muted">No agents yet. Click "+ Add Agent" to get started.</td></tr>`;

  wireAgentActions();
  wireAgentsBulkForm();
  populateAgentSelects();

  // Wire "+ Add Agent" button
  const addBtn = document.querySelector('#agents-tab button:first-of-type');
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
  return `<tr data-agent-id="${a.id}">
    <td class="font-mono text-xs text-text-muted">${a.id.slice(0, 8)}…</td>
    <td class="font-semibold">${a.name}</td>
    <td>${a.email || '—'}</td>
    <td>${a.contactPhone || '—'}</td>
    <td>${statusBadge}</td>
    <td class="flex gap-1 flex-wrap">
      <button data-action="edit-agent" data-id="${a.id}" class="bg-yellow-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-yellow-500">Edit</button>
      <button data-action="delete-agent" data-id="${a.id}" class="bg-red-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600">Delete</button>
      <button data-action="toggle-agent" data-id="${a.id}" data-active="${a.isActive !== false}"
        class="px-3 py-1 rounded text-[12px] font-bold ${a.isActive !== false ? 'bg-slate-400 text-white hover:bg-slate-500' : 'bg-green-500 text-white hover:bg-green-600'}">
        ${a.isActive !== false ? 'Hide All' : 'Show All'}</button>
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
  const tab = document.getElementById('agents-tab');
  if (!tab || tab.dataset.bulkWired) return;
  tab.dataset.bulkWired = '1';

  const bulkForm = tab.querySelector('.grid.grid-cols-1.md\\:grid-cols-4');
  if (!bulkForm) return;
  const [agentSel, startInput, endInput] = bulkForm.querySelectorAll('select, input[type=date]');
  const bulkBtn = bulkForm.querySelector('button');
  if (bulkBtn) {
    bulkBtn.addEventListener('click', async () => {
      const agentId = agentSel?.value;
      const startDate = startInput?.value;
      const endDate = endInput?.value;
      if (!agentId || !startDate || !endDate) { toast('warning', 'Incomplete', 'Select agent and both dates.'); return; }
      if (!confirm(`Delete ALL fares for this agent from ${startDate} to ${endDate}? This cannot be undone.`)) return;
      bulkBtn.disabled = true; bulkBtn.textContent = 'Deleting…';
      try {
        const res = await callBulkDeleteFares(agentId, startDate, endDate);
        toast('success', 'Bulk Delete Complete', res.message);
      } catch (e) { toast('error', 'Bulk Delete Failed', e.message); }
      finally { bulkBtn.disabled = false; bulkBtn.textContent = 'Bulk Delete'; }
    });
  }
}

function populateAgentSelects() {
  document.querySelectorAll('select').forEach(sel => {
    const firstOpt = sel.querySelector('option');
    if (firstOpt?.textContent?.trim() === 'Select Agent' && sel.options.length === 1) {
      _agents.forEach(a => sel.appendChild(new Option(a.name, a.id)));
    }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTORS TAB — Full CRUD
// ══════════════════════════════════════════════════════════════════════════════
async function renderSectorsTab(fetchData = true) {
  if (fetchData) _sectors = await getSectors();
  
  // Wire up filter inputs if not already
  const searchInp = document.getElementById('sectors-search');
  const limitSel = document.getElementById('sectors-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.sectors = e.target.value; renderSectorsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.sectors = parseInt(e.target.value); renderSectorsTab(false); });
  }

  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody) return;

  const data = applySortAndFilter(_sectors, 'sectors');
  tbody.innerHTML = data.length
    ? data.map(s => sectorRow(s)).join('')
    : `<tr><td colspan="5" class="text-center py-8 text-text-muted">No sectors yet. Click "+ Add Sector".</td></tr>`;

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
      <button data-action="hide-sector" data-id="${s.id}" class="bg-slate-400 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-slate-500">Hide Fares</button>
      <button data-action="show-sector" data-id="${s.id}" class="bg-green-500 text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-green-600">Show Fares</button>
    </td>
  </tr>`;
}

function wireSectorActions() {
  const tbody = document.querySelector('#sectors-tab .admin-table tbody');
  if (!tbody || tbody.dataset.actionsWired) return;
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
    if (action === 'hide-sector' || action === 'show-sector') {
      const isHidden = action === 'hide-sector';
      btn.disabled = true; btn.textContent = 'Working…';
      try {
        const res = await callToggleSectorVisibility(id, isHidden);
        toast('success', `Sector Fares ${isHidden ? 'Hidden' : 'Shown'}`, res.message);
      } catch (e) { toast('error', 'Toggle Failed', e.message); }
      finally { btn.disabled = false; btn.textContent = isHidden ? 'Hide Fares' : 'Show Fares'; }
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
  if (fetchData) _airlines = await getAirlines();

  // Wire up filter inputs if not already
  const searchInp = document.getElementById('airlines-search');
  const limitSel = document.getElementById('airlines-limit');
  if (searchInp && !searchInp.dataset.wired) {
    searchInp.dataset.wired = '1'; limitSel.dataset.wired = '1';
    searchInp.addEventListener('input', (e) => { tableSearch.airlines = e.target.value; renderFlightsTab(false); });
    limitSel.addEventListener('change', (e) => { tableLimit.airlines = parseInt(e.target.value); renderFlightsTab(false); });
  }

  const tbody = document.querySelector('#flights-tab .admin-table tbody');
  if (!tbody) return;

  const data = applySortAndFilter(_airlines, 'airlines');
  tbody.innerHTML = data.length
    ? data.map(a => airlineRow(a)).join('')
    : `<tr><td colspan="4" class="text-center py-8 text-text-muted">No airlines yet. Click "+ Add Flight".</td></tr>`;

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
  if (!tbody || tbody.dataset.actionsWired) return;
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
      const startDate = startInput?.value;
      const endDate = endInput?.value;
      if (!startDate || !endDate) { toast('warning', 'Missing Dates', 'Select a date range.'); return; }
      fetchBtn.disabled = true; fetchBtn.textContent = 'Generating…';
      try {
        const report = await callGenerateAgentReport(startDate, endDate, sectorSel?.value || 'all');
        renderReportCharts(report, tab);
      } catch (e) { toast('error', 'Report Failed', e.message); }
      finally { fetchBtn.disabled = false; fetchBtn.textContent = 'Generate Report'; }
    });
  }
}

function renderReportCharts(report, tab) {
  const { agentReport, sectorReport, totalFares } = report;

  // Agent bar chart — targeted by stable ID
  const barChartContainer = document.getElementById('bar-chart-container');
  if (barChartContainer && agentReport.length) {
    const maxCount = Math.max(...agentReport.map(a => a.count));
    barChartContainer.innerHTML = agentReport.slice(0, 8).map(a => {
      const pct = maxCount > 0 ? Math.max(2, Math.round((a.count / maxCount) * 95)) : 2;
      return `<div class="flex flex-col items-center gap-1 flex-1 min-w-0">
        <span class="text-[10px] font-bold text-navy">${a.count}</span>
        <div class="w-full bg-[#99d7d1] rounded-t" style="height:${pct}%" title="${a.name}: ${a.count} fares, avg ₹${a.avgRate?.toLocaleString()}"></div>
        <span class="text-[9px] text-text-muted truncate w-full text-center">${a.name?.split(' ')[0]}</span>
      </div>`;
    }).join('');
    // Show total fares count
    const totalEl = document.getElementById('report-total-fares');
    if (totalEl) {
      totalEl.textContent = `${totalFares} total fares`;
      totalEl.classList.remove('hidden');
    }
  }

  // Sector pie chart (CSS conic-gradient) — targeted by stable ID
  const pieContainer = document.getElementById('pie-chart-container');
  if (pieContainer && sectorReport.length) {
    const total = sectorReport.reduce((s, r) => s + r.count, 0);
    const COLORS = ['#007bff','#28a745','#ffc107','#dc3545','#6f42c1','#17a2b8','#fd7e14','#6c757d'];
    let deg = 0;
    const segments = sectorReport.slice(0, 8).map((s, i) => {
      const pct = total > 0 ? (s.count / total) * 100 : 0;
      const start = deg; deg += pct;
      return `${COLORS[i % COLORS.length]} ${start.toFixed(1)}% ${deg.toFixed(1)}%`;
    });
    pieContainer.style.background = `conic-gradient(${segments.join(', ')})`;
    pieContainer.title = sectorReport.map(s => `${s.name}: ${s.count}`).join('\n');

    // Legend
    const legendEl = document.getElementById('pie-legend');
    if (legendEl) {
      legendEl.innerHTML = sectorReport.slice(0, 8).map((s, i) =>
        `<div class="flex items-center gap-2 text-[12px]">
          <span class="inline-block w-3 h-3 rounded-sm shrink-0" style="background:${COLORS[i % COLORS.length]}"></span>
          <span class="truncate text-text-muted">${s.name}</span>
          <span class="font-bold text-navy ml-auto">${s.count}</span>
        </div>`
      ).join('');
    }
  }

  toast('success', 'Report Ready', `${totalFares} fares aggregated.`);
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

// ── Rebuild chips once agents load (called from loadGlobalData resolved via onAuthChange)
const origLoadGlobal = loadGlobalData;

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
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
const TICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

function toast(type, title, msg) {
  const tEl = document.getElementById('toastsEl');
  if (!tEl) return;
  const el = document.createElement('div');
  const styles = { success:'border-green-500 bg-green-50 text-green-800', error:'border-red-500 bg-red-50 text-red-800', warning:'border-yellow-500 bg-yellow-50 text-yellow-800' };
  el.className = `flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 pointer-events-auto ${styles[type] || styles.error}`;
  el.innerHTML = `<div class="mt-0.5">${TICONS[type]||TICONS.error}</div>
    <div class="flex-1"><div class="font-bold text-sm leading-tight">${title}</div><div class="text-xs opacity-90 mt-1">${msg}</div></div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>`;
  tEl.appendChild(el);
  setTimeout(() => el.isConnected && el.remove(), 7000);
}

// ── Rebuild chips when the sheets tab becomes active ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Chips built after auth resolves in the onAuthChange handler above
});

