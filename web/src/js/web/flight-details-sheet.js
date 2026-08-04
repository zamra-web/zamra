/**
 * flight-details-sheet.js — the expanded view behind a compact flight card.
 *
 * The mobile card in flight-card.js is one row and carries no Book Now button,
 * so everything it leaves out lives here: airline name, full city names, both
 * baggage allowances, seats, and the WhatsApp booking CTA. It opens as a bottom
 * sheet on phones and as a centred dialog from `sm` up.
 *
 * The overlay is built in JS rather than added to index.html and b2b.html
 * because the card is shared by both pages — one implementation, no markup to
 * keep in sync. It is created once on first open and then reused.
 *
 * `buildFlightDetailsSheetHtml` is a pure string builder so web/tests can call
 * it without a DOM. Unlike flight-card.js it escapes every field: the sheet is
 * newer, and there is no reason for a new surface to inherit the raw-
 * interpolation trust assumption.
 */

import { escapeHtml } from '../shared/escape-html.js';

const SHEET_ID = 'flight-details-sheet';

let sheetEl = null;

/**
 * Panel contents for one fare.
 *
 * @param {object} item the same object passed to buildFlightCardHtml, plus waLink
 * @returns {string} inner HTML for the sheet panel
 */
export function buildFlightDetailsSheetHtml(item = {}) {
  const seats = Number(item.seats) || 0;

  return `
    <div class="sm:hidden pt-2.5 pb-1 flex justify-center">
      <span class="w-10 h-1 rounded-full bg-border"></span>
    </div>

    <div class="px-5 pt-3 sm:pt-5 pb-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="w-[46px] h-[46px] shrink-0 bg-[#f8fafc] rounded-2xl border border-border/50 flex items-center justify-center p-2">
            ${item.airlineLogo
              ? `<img
                  src="${escapeHtml(item.airlineLogo)}"
                  data-airline-logo
                  data-fallback-src="${escapeHtml(item.airlineLogoFallback || '')}"
                  alt="${escapeHtml(item.airline)}"
                  class="max-h-full max-w-full object-contain"
                >`
              : ''
            }
            <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[12px] font-black tracking-[0.12em] text-primary">
              ${escapeHtml(item.airlineInitials)}
            </span>
          </span>
          <span class="min-w-0">
            <span class="block text-[15px] font-heading font-bold text-navy leading-tight truncate">${escapeHtml(item.airline)}</span>
            <span class="block text-[12px] font-semibold text-text-muted mt-0.5">${escapeHtml(item.date)}</span>
          </span>
        </div>
        <button
          type="button"
          data-sheet-close
          aria-label="Close flight details"
          class="shrink-0 w-9 h-9 rounded-full bg-[#f1f5f9] border-0 flex items-center justify-center text-[15px] text-[#64748b] cursor-pointer transition-all hover:bg-[#e2e8f0] hover:text-[#1e293b]"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="mt-5 grid grid-cols-[1fr_auto_1fr] items-start gap-2 rounded-2xl bg-[#f8fafc] border border-border/50 p-4">
        <div class="min-w-0">
          <div class="text-[20px] font-heading font-black text-navy leading-none tracking-tight">${escapeHtml(item.originCode)}</div>
          <div class="text-[12px] font-semibold text-text-muted mt-1 truncate">${escapeHtml(item.origin)}</div>
          <div class="text-[13px] font-bold text-navy mt-2">${escapeHtml(item.departure)}</div>
          <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Departs</div>
        </div>

        <div class="flex flex-col items-center pt-1.5 px-1">
          <span class="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center">
            <i class="bi bi-arrow-right text-primary text-[16px]"></i>
          </span>
        </div>

        <div class="min-w-0 text-right">
          <div class="text-[20px] font-heading font-black text-navy leading-none tracking-tight">${escapeHtml(item.destinationCode)}</div>
          <div class="text-[12px] font-semibold text-text-muted mt-1 truncate">${escapeHtml(item.destination)}</div>
          <div class="text-[13px] font-bold text-navy mt-2">${escapeHtml(item.arrival)}</div>
          <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Arrives</div>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">Baggage</div>
        <div class="mt-2 grid grid-cols-2 gap-2.5">
          <div class="rounded-xl border border-border/60 px-3 py-2.5 text-[13px] font-bold text-navy flex items-center gap-2">
            <i class="bi bi-luggage text-primary text-[15px]"></i>${escapeHtml(item.checkInBaggage)}
          </div>
          <div class="rounded-xl border border-border/60 px-3 py-2.5 text-[13px] font-bold text-navy flex items-center gap-2">
            <i class="bi bi-backpack2 text-primary text-[15px]"></i>${escapeHtml(item.cabinBaggage)}
          </div>
        </div>
      </div>

      ${seats > 0
        ? `<div class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-bold text-accent">
             <i class="bi bi-people-fill"></i> ${seats} seat${seats === 1 ? '' : 's'} available
           </div>`
        : ''
      }

      <div class="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-4 py-3">
        <span class="text-[11px] uppercase tracking-[0.14em] text-text-muted font-semibold">Fare per person</span>
        <span class="text-[24px] font-heading font-black text-navy leading-none">${escapeHtml(item.price)}</span>
      </div>

      <a
        href="${escapeHtml(item.waLink || '#')}"
        target="_blank"
        rel="noopener"
        class="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-3.5 rounded-xl no-underline hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] transition-all"
      >
        <i class="bi bi-whatsapp"></i> Book Now
      </a>

      <p class="text-[11px] text-text-muted text-center mt-3 mb-0">Fares are subject to live availability at the time of booking.</p>
    </div>
  `;
}

function ensureSheet() {
  if (sheetEl && document.body.contains(sheetEl)) return sheetEl;

  sheetEl = document.createElement('div');
  sheetEl.id = SHEET_ID;
  sheetEl.className = 'group fixed inset-0 z-[2000] flex items-end sm:items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200 [&.active]:opacity-100 [&.active]:pointer-events-auto';
  sheetEl.setAttribute('aria-hidden', 'true');
  sheetEl.innerHTML = `
    <div data-sheet-backdrop class="absolute inset-0 bg-[#0d1f3c]/50 backdrop-blur-[6px]"></div>
    <div
      data-sheet-panel
      role="dialog"
      aria-modal="true"
      aria-label="Flight details"
      class="relative w-full sm:w-[92%] sm:max-w-[440px] bg-white rounded-t-[24px] sm:rounded-[24px] shadow-[0_-8px_32px_rgba(13,31,60,0.18)] sm:shadow-[0_8px_32px_rgba(13,31,60,0.18)] max-h-[90vh] overflow-y-auto pb-[env(safe-area-inset-bottom)] translate-y-full sm:translate-y-4 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-[.active]:translate-y-0"
    ></div>
  `;

  sheetEl.addEventListener('click', (event) => {
    if (event.target.closest('[data-sheet-backdrop]') || event.target.closest('[data-sheet-close]')) {
      closeFlightDetailsSheet();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFlightDetailsSheet();
  });

  document.body.appendChild(sheetEl);
  return sheetEl;
}

/**
 * @param {object} item a fare item plus its waLink
 * @param {(root: Element) => void} [onRender] hook to wire logo fallbacks
 */
export function openFlightDetailsSheet(item, onRender) {
  const sheet = ensureSheet();
  const panel = sheet.querySelector('[data-sheet-panel]');
  if (!panel) return;

  panel.innerHTML = buildFlightDetailsSheetHtml(item);
  if (typeof onRender === 'function') onRender(panel);

  panel.scrollTop = 0;
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Next frame, so the panel animates in from its off-screen start position.
  requestAnimationFrame(() => sheet.classList.add('active'));
}

export function closeFlightDetailsSheet() {
  if (!sheetEl || !sheetEl.classList.contains('active')) return;
  sheetEl.classList.remove('active');
  sheetEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// One listener per result list; the fares it renders change on every search, so
// they are looked up here rather than captured in the closure.
const listFares = new WeakMap();

/**
 * Makes every compact card in `listEl` open the details sheet.
 *
 * `items` must be the same array, in the same order, that produced the cards —
 * the tapped card is matched by its position among the list's
 * `[data-flight-card]` elements.
 *
 * @param {Element} listEl the results container
 * @param {Array<object>} items fare items including waLink
 * @param {(root: Element) => void} [onRender] runs on the rendered panel
 */
export function wireFlightCardSheet(listEl, items, onRender) {
  if (!listEl) return;

  listFares.set(listEl, Array.isArray(items) ? items : []);

  if (listEl.dataset.flightSheetWired) return;
  listEl.dataset.flightSheetWired = 'true';

  listEl.addEventListener('click', (event) => {
    const card = event.target.closest('[data-flight-card]');
    if (!card || !listEl.contains(card)) return;

    const cards = Array.from(listEl.querySelectorAll('[data-flight-card]'));
    const item = (listFares.get(listEl) || [])[cards.indexOf(card)];
    if (item) openFlightDetailsSheet(item, onRender);
  });
}
