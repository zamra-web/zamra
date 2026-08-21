/**
 * whatsapp.js — the /admin/whatsapp tab controller.
 *
 * Extracted from main.js the way social-publishing.js is: everything arrives
 * through a dependency bag, so this module imports nothing but the shared HTML
 * escaper and can be unit-tested with `node --test`.
 *
 * The dashboard never talks to WAHA directly — the API key would have to ship
 * in the bundle. Every call here goes through an admin-gated callable that
 * projects the response server-side.
 */

import { escapeHtml } from '../shared/escape-html.js';

/** How often to re-fetch the QR while the link modal is open. WAHA rotates it. */
const QR_REFRESH_MS = 20000;

/** Session states, and how each should read to a human. */
const STATUS_LABELS = Object.freeze({
  STOPPED: 'Not connected',
  STARTING: 'Starting…',
  SCAN_QR_CODE: 'Waiting for QR scan',
  PASSKEY_REQUIRED: 'Passkey required',
  PASSKEY_CONFIRMATION_REQUIRED: 'Confirm on phone',
  WORKING: 'Connected',
  FAILED: 'Failed',
});

/**
 * Coerce what a human types into a WhatsApp chat id.
 *
 * Mirrors normalizeChatId in functions/whatsapp/normalize.js — the server
 * validates again, this is only so the UI can reject obvious junk without a
 * round-trip. A bare 10-digit number is assumed Indian, matching how
 * config/b2b.whatsappNumber is stored.
 *
 * @param {string} input
 * @returns {string|null} a chat id, or null when it cannot be one
 */
export function toChatId(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return null;

  if (raw.includes('@')) {
    const lowered = raw.toLowerCase();
    if (/^\d{7,15}@c\.us$/.test(lowered) || /^[\d-]{5,40}@g\.us$/.test(lowered)) return lowered;
    return null;
  }

  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  return /^\d{7,15}$/.test(withCountry) ? `${withCountry}@c.us` : null;
}

/**
 * @param {string} status
 * @returns {{label: string, tone: 'ok'|'warn'|'bad'}}
 */
export function describeStatus(status) {
  const key = String(status ?? '').toUpperCase();
  const label = STATUS_LABELS[key] || 'Unknown';
  if (key === 'WORKING') return { label, tone: 'ok' };
  if (key === 'FAILED' || key === 'STOPPED') return { label, tone: 'bad' };
  return { label, tone: 'warn' };
}

/**
 * Render a message body for display: escaped first, then linkified.
 *
 * The order matters and is the point. These bodies are typed by strangers on
 * the internet — the highest-trust-boundary text the dashboard renders — so
 * every character is escaped before any markup is introduced. Linkifying first
 * would let `<img src=x onerror=…>` through.
 *
 * @param {string} body
 * @returns {string} HTML
 */
export function renderMessageBody(body) {
  const escaped = escapeHtml(body);
  return escaped.replace(
    /\bhttps?:\/\/[^\s<]+/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline">${url}</a>`,
  );
}

/**
 * @param {object} deps
 * @param {Function} deps.toast
 * @param {Function} deps.openModal
 * @param {Function} deps.callGetWhatsappSessionStatus
 * @param {Function} deps.callGetWhatsappQr
 * @param {Function} deps.callSetWhatsappSessionState
 * @param {Function} deps.callEnsureWhatsappSession
 * @param {Function} deps.callSendWhatsappMessage
 * @param {Function} deps.subscribeWhatsappConfig
 * @returns {{render: Function, destroy: Function}}
 */
export function createWhatsappController(deps) {
  const {
    toast, openModal,
    callGetWhatsappSessionStatus, callGetWhatsappQr, callSetWhatsappSessionState,
    callEnsureWhatsappSession, callSendWhatsappMessage, subscribeWhatsappConfig,
  } = deps;

  const state = {
    session: null,
    config: null,
    unsubs: [],
    qrTimer: null,
    wired: false,
  };

  function el(id) {
    return document.getElementById(id);
  }

  function paintStatus() {
    const pill = el('whatsapp-status-pill');
    if (!pill) return;
    const { label, tone } = describeStatus(state.session?.status ?? state.config?.sessionStatus);
    pill.textContent = label;
    pill.classList.remove('admin-pill-ok', 'admin-pill-warn', 'admin-pill-bad');
    pill.classList.add(`admin-pill-${tone}`);
  }

  function paintConnection() {
    const host = el('whatsapp-connection');
    if (!host) return;

    const status = state.session?.status ?? state.config?.sessionStatus ?? 'STOPPED';
    const me = state.session?.me ?? state.config?.me ?? null;
    const { label } = describeStatus(status);
    const connected = status === 'WORKING';

    host.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Connection</p>
          <h3 class="mt-1 text-lg font-semibold text-navy">${escapeHtml(label)}</h3>
          ${me ? `<p class="mt-1 text-sm text-text-muted">${escapeHtml(me.pushName || '')} · ${escapeHtml(String(me.id || '').split('@')[0])}</p>` : ''}
          ${state.config?.lastWebhookEvent ? `<p class="mt-2 text-xs text-text-muted">Last event: ${escapeHtml(state.config.lastWebhookEvent)}</p>` : ''}
        </div>
        <div class="flex flex-wrap gap-2">
          ${connected
    ? `<button data-wa-action="logout" class="admin-btn admin-btn-danger h-[38px] px-4">Unlink</button>
               <button data-wa-action="restart" class="admin-btn admin-btn-soft h-[38px] px-4">Restart</button>`
    : `<button data-wa-action="connect" class="admin-btn admin-btn-primary h-[38px] px-4"><i class="bi bi-qr-code"></i> Connect</button>`}
        </div>
      </div>`;
  }

  function paintComposer() {
    const host = el('whatsapp-composer');
    if (!host) return;
    host.innerHTML = `
      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">Send a message</p>
      <p class="mt-1 text-sm text-text-muted">One-off replies only. Bulk sending is deliberately not available here — broadcasts run in n8n, which paces them so the number does not get banned.</p>
      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
        <div>
          <label class="admin-label text-[11px]" for="whatsapp-send-to">To</label>
          <input id="whatsapp-send-to" class="admin-control" placeholder="9846606731" autocomplete="off">
          <p id="whatsapp-send-hint" class="admin-help mt-1">Indian numbers may omit +91.</p>
        </div>
        <div>
          <label class="admin-label text-[11px]" for="whatsapp-send-text">Message</label>
          <textarea id="whatsapp-send-text" class="admin-control" rows="4" maxlength="4096"></textarea>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button id="whatsapp-send-btn" class="admin-btn admin-btn-primary h-[40px] px-6"><i class="bi bi-send"></i> Send</button>
      </div>`;
  }

  function stopQrTimer() {
    if (state.qrTimer) {
      clearInterval(state.qrTimer);
      state.qrTimer = null;
    }
  }

  async function paintQr() {
    const slot = document.getElementById('whatsapp-qr-slot');
    // The modal was closed, or replaced by another one — stop polling WAHA.
    if (!slot) { stopQrTimer(); return; }
    try {
      const qr = await callGetWhatsappQr();
      slot.innerHTML = `<img src="data:${escapeHtml(qr.mimetype)};base64,${escapeHtml(qr.data)}" alt="WhatsApp QR code" class="mx-auto h-64 w-64">`;
    } catch (error) {
      slot.innerHTML = `<p class="text-sm text-text-muted">${escapeHtml(error?.message || 'Could not load the QR code.')}</p>`;
    }

    try {
      const session = await callGetWhatsappSessionStatus();
      state.session = session;
      paintStatus();
      if (session.status === 'WORKING') {
        stopQrTimer();
        paintConnection();
        toast('success', 'WhatsApp linked', 'The number is connected.');
      }
    } catch { /* the next tick retries */ }
  }

  async function connect() {
    try {
      await callEnsureWhatsappSession();
    } catch (error) {
      toast('error', 'Could not start session', error?.message || 'WAHA rejected the request.');
      return;
    }

    openModal('Link WhatsApp', `
      <div class="text-center">
        <div id="whatsapp-qr-slot" class="min-h-[16rem] flex items-center justify-center">
          <p class="text-sm text-text-muted">Loading QR…</p>
        </div>
        <p class="admin-help mt-4">On the phone: WhatsApp → Settings → Linked devices → Link a device.</p>
      </div>`, false);

    stopQrTimer();
    await paintQr();
    state.qrTimer = setInterval(paintQr, QR_REFRESH_MS);
  }

  async function refresh() {
    try {
      state.session = await callGetWhatsappSessionStatus();
    } catch (error) {
      state.session = null;
      toast('error', 'WhatsApp unreachable', error?.message || 'Could not reach WAHA.');
    }
    paintStatus();
    paintConnection();
  }

  async function send() {
    const toInput = el('whatsapp-send-to');
    const textInput = el('whatsapp-send-text');
    const button = el('whatsapp-send-btn');
    if (!toInput || !textInput || !button) return;

    const chatId = toChatId(toInput.value);
    const text = textInput.value.trim();
    if (!chatId) { toast('error', 'Check the number', 'That is not a WhatsApp number.'); return; }
    if (!text) { toast('error', 'Nothing to send', 'Type a message first.'); return; }

    button.disabled = true;
    const original = button.innerHTML;
    button.textContent = 'Sending…';
    try {
      await callSendWhatsappMessage(chatId, text);
      textInput.value = '';
      toast('success', 'Sent', `Delivered to ${chatId.split('@')[0]}.`);
    } catch (error) {
      toast('error', 'Send failed', error?.message || 'WhatsApp rejected the message.');
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  }

  /**
   * Idempotent by contract: renderActiveTab() calls this on every entry to the
   * tab and there is no teardown hook, so it must tear down its own listeners
   * before re-subscribing or it leaks an onSnapshot per visit.
   */
  async function render() {
    destroy();

    paintStatus();
    paintConnection();
    paintComposer();

    const tab = document.getElementById('whatsapp-tab');
    if (tab && !state.wired) {
      state.wired = true;
      // Delegated, and wired exactly once — the panels' innerHTML is replaced
      // on every paint, so per-button listeners would stack.
      tab.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-wa-action], #whatsapp-send-btn, #whatsapp-refresh-btn');
        if (!button) return;
        if (button.id === 'whatsapp-send-btn') return send();
        if (button.id === 'whatsapp-refresh-btn') return refresh();

        const action = button.getAttribute('data-wa-action');
        if (action === 'connect') return connect();
        try {
          await callSetWhatsappSessionState(action);
          toast('success', 'Done', `Session ${action} sent.`);
          await refresh();
        } catch (error) {
          toast('error', 'Action failed', error?.message || 'WAHA rejected the request.');
        }
      });
    }

    state.unsubs.push(subscribeWhatsappConfig((config) => {
      state.config = config;
      paintStatus();
      if (!state.session) paintConnection();
    }));

    await refresh();
  }

  function destroy() {
    stopQrTimer();
    state.unsubs.forEach((unsub) => { try { unsub(); } catch { /* already gone */ } });
    state.unsubs = [];
  }

  return { render, destroy };
}
