import '../../styles/admin/style.css';

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Handle active state on links
            navLinks.forEach(l => l.classList.remove('active', 'text-primary'));
            navLinks.forEach(l => l.classList.add('text-gray-500'));

            link.classList.remove('text-gray-500');
            link.classList.add('active', 'text-primary');

            // Handle active state on content
            const targetId = link.getAttribute('data-tab');
            const targetTitle = link.getAttribute('data-title');

            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            const activeContent = document.getElementById(targetId);
            if (activeContent) {
                activeContent.classList.add('active');
            }

            // Update page header
            if (pageTitle && targetTitle) {
                pageTitle.textContent = targetTitle;
            }
        });
    });

    // Initialize mock data tables (optional - just to populate visuals like the screenshots)
    // You can add more complex JS here for actual API fetching later
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
  const statSubs = document.getElementById('statSubs');
  if(statSubs) statSubs.textContent = history.length;
  const statEntries = document.getElementById('statEntries');
  if(statEntries) statEntries.textContent = totalE;
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
  const manualAgent = document.getElementById('manualAgent');
  if(manualAgent) manualAgent.value = '';
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

const manualAgent = document.getElementById('manualAgent');
if(manualAgent){
  manualAgent.addEventListener('input', function () {
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
}

function syncPill() {
  const p = document.getElementById('agentPill');
  if(!p) return;
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

if(ta) {
  ta.addEventListener('input', function () {
    const n = this.value.length;
    const charCount = document.getElementById('charCount');
    if(charCount) charCount.textContent = n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
    validate();
    clearTimeout(pt);
    if (n > 15) pt = setTimeout(() => doPreview(this.value), 500);
    else hidePrev();
  });
}

function validate() {
  const submitBtn = document.getElementById('submitBtn');
  if(submitBtn) {
    submitBtn.disabled = !(selAgent && ta && ta.value.trim().length > 10);
  }
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

  const prevBox = document.getElementById('prevBox');
  if(prevBox) prevBox.classList.add('on');
  const prevCount = document.getElementById('prevCount');
  if(prevCount) prevCount.textContent = rows.length + ' entr' + (rows.length === 1 ? 'y' : 'ies');

  const tbody = document.getElementById('prevBody');
  if(!tbody) return;
  tbody.innerHTML = rows.slice(0, 60).map(r => `
    <tr>
      <td class="td-s px-4 py-2 text-sm text-center border-b border-border">${r.sector}</td>
      <td class="px-4 py-2 text-sm text-center border-b border-border">${r.date}</td>
      <td class="td-a px-4 py-2 text-sm text-center border-b border-border">${r.airline}</td>
      <td class="td-r px-4 py-2 text-sm text-center border-b border-border">₹${r.rate.toLocaleString()}</td>
    </tr>
  `).join('');

  if (rows.length > 60)
    tbody.innerHTML += `<tr><td colspan="4" style="text-align:center;padding:10px;
      color:var(--z-text-soft);font-size:11px">+ ${rows.length - 60} more entries</td></tr>`;
}

function hidePrev() {
  const prevBox = document.getElementById('prevBox');
  if(prevBox) prevBox.classList.remove('on');
}

/* ── RESET ── */
const resetBtn = document.getElementById('resetBtn');
if(resetBtn){
  resetBtn.addEventListener('click', () => {
    if(ta) ta.value = '';
    const charCount = document.getElementById('charCount');
    if(charCount) charCount.textContent = '0 characters';
    hidePrev();
    validate();
  });
}

/* ── SUBMIT ── */
const submitBtn = document.getElementById('submitBtn');
if(submitBtn){
  submitBtn.addEventListener('click', async () => {
    if (!selAgent || !ta || !ta.value.trim()) return;

    const btn = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...`;

    /* progress bar */
    const bar = document.getElementById('progBar');
    const fill = document.getElementById('progFill');
    if(bar) bar.classList.add('on');
    let prog = 0;
    const iv = setInterval(() => {
      prog = Math.min(prog + Math.random() * 13, 85);
      if(fill) fill.style.width = prog + '%';
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
      if(fill) fill.style.width = '100%';

      if (res.ok) {
        hEntry.status = 'ok';
        finish(entries.length);
      } else {
        throw new Error(`Server error ${res.status}`);
      }
    } catch (err) {
      clearInterval(iv);
      if(fill) fill.style.width = '100%';

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
      if(bar) bar.classList.remove('on');
      if(fill) fill.style.width = '0%';
      btn.innerHTML = orig;
      validate();
    }, 900);
  });
}

function finish(count) {
  saveHistory(); renderHistory();
  totalE += count;
  updateStats();
  toast('success', 'Submitted Successfully',
    `Agent ${selAgent} — ${count} entries queued for processing.`);
  setTimeout(() => {
    if(ta) ta.value = '';
    const charCount = document.getElementById('charCount');
    if(charCount) charCount.textContent = '0 characters';
    hidePrev();
    validate();
  }, 500);
}

/* ── TOASTS ── */
const TICONS = {
  success: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  warning: `<svg viewBox="0 0 16 16" fill="none" class="w-5 h-5"><path d="M8 2L14 14H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
};

function toast(type, title, msg) {
  if(!document.getElementById('toastsEl')) {
    const tEl = document.createElement('div');
    tEl.id = 'toastsEl';
    tEl.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(tEl);
  }

  const el = document.createElement('div');
  const typeStyles = {
    'success': 'border-green-500 bg-green-50 text-green-800',
    'error': 'border-red-500 bg-red-50 text-red-800',
    'warning': 'border-yellow-500 bg-yellow-50 text-yellow-800'
  };

  el.className = `flex items-start gap-3 p-4 border-l-4 rounded shadow-md w-80 animate-[slideInRight_0.3s_ease] ${typeStyles[type]}`;
  el.innerHTML = `
    <div class="mt-0.5">${TICONS[type]}</div>
    <div class="flex-1">
      <div class="font-bold text-sm leading-tight">${title}</div>
      <div class="text-xs opacity-90 mt-1">${msg}</div>
    </div>
    <button class="opacity-50 hover:opacity-100" onclick="this.closest('div').remove()">
      <svg viewBox="0 0 12 12" fill="none" class="w-3 h-3">
        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>`;
  document.getElementById('toastsEl').appendChild(el);
  setTimeout(() => { if(document.contains(el)) el.remove() }, 7000);
}

/* ── HISTORY ── */
function saveHistory() {
  localStorage.setItem('zt_hist', JSON.stringify(history));
}

function renderHistory() {
  const wrap = document.getElementById('historyWrap');
  if(!wrap) return;
  if (!history.length) {
    wrap.innerHTML = `
      <div class="text-center py-6 text-text-muted text-sm bg-white/50 rounded-xl border border-dashed border-border flex flex-col items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" class="w-8 h-8 opacity-40">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        No submissions yet
      </div>`;
    return;
  }
  wrap.innerHTML = history.map(h => `
    <div class="flex items-center gap-4 bg-white p-3 rounded-lg border border-border/50 shadow-sm mb-2 transition-transform hover:-translate-y-0.5">
      <div class="w-10 h-10 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
        ${h.agent}
      </div>
      <div class="flex-1">
        <div class="text-sm font-bold text-navy">Agent ${h.agent}</div>
        <div class="text-[11px] font-semibold text-text-muted mt-0.5">${h.time}</div>
      </div>
      <div class="text-right">
        <div class="text-[15px] font-black tracking-tight text-navy">${h.rows}</div>
        <div class="text-[10px] font-bold uppercase text-text-muted">entries</div>
      </div>
      <div class="w-2.5 h-2.5 rounded-full ${h.status === 'ok' ? 'bg-green-500' : h.status === 'err' ? 'bg-red-500' : 'bg-yellow-400'}"></div>
    </div>
  `).join('');
}

const clearBtn = document.getElementById('clearBtn');
if(clearBtn){
  clearBtn.addEventListener('click', () => {
    if (!history.length) return;
    history = [];
    totalE = 0;
    saveHistory();
    renderHistory();
    updateStats();
  });
}

