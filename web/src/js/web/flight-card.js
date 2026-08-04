/**
 * flight-card.js — flight result card markup for the public flight search and
 * the B2B portal.
 *
 * Two builders, because the two surfaces want different amounts of the fare on
 * the row itself:
 *
 * `buildFlightCardHtml` — the public site. Two layouts from one call:
 *
 * - Below `lg` (phones, and therefore both Android apps) the card is a single
 *   compact row — logo, date, route with times, baggage, price — and nothing
 *   else. There is deliberately no airline name and no Book Now button here:
 *   the whole row is one `[data-flight-card]` button that opens the details
 *   sheet in flight-details-sheet.js, which carries the expanded detail and the
 *   booking CTA. Keep the `data-flight-card` hook and the row's field set in
 *   agreement with `buildFlightDetailsSheetHtml`.
 * - From `lg` up the wide card is unchanged: it already has room for the full
 *   detail, so it keeps its inline Book Now and never opens the sheet.
 *
 * `buildCompactFlightCardHtml` — the B2B portal. Agents scan long result lists
 * and book straight from them, so this one keeps every field *and* the CTA on
 * the card at every width, and gets its height back by packing them instead of
 * by hiding them. It still exposes `data-flight-card`, so the details sheet
 * remains available for the fields that do not fit (full city names, the two
 * baggage allowances spelled out, seats).
 *
 * The compact markup escapes its values; the wide block in
 * `buildFlightCardHtml` is untouched legacy that still interpolates raw. Both
 * read the same admin-controlled Firestore rows, so this is belt-and-braces,
 * not a fix for a live hole.
 */

import { escapeHtml as esc } from '../shared/escape-html.js';

/**
 * Splits a rendered fare date into the parts the cards show.
 *
 * @param {string} date e.g. "06 Mar 2026"
 * @returns {{day: string, month: string}} e.g. `{ day: '06', month: 'Mar' }`
 */
function splitCardDate(date) {
  if (!date) return { day: '00', month: 'MTH' };

  const parts = date.split(' ');
  if (parts.length >= 2) return { day: parts[0], month: parts[1] };
  return { day: date, month: '' };
}

/**
 * @param {{
 *   airline, airlineLogo, airlineLogoFallback, airlineInitials,
 *   origin, originCode, destination, destinationCode,
 *   date, departure, arrival, price, seats,
 *   checkInBaggage, cabinBaggage, baggageLabel, waLink
 * }} item
 * @returns {string} card HTML
 */
export function buildFlightCardHtml(item) {
  const { day, month } = splitCardDate(item.date);

  return `
        <div class="bg-white rounded-[14px] lg:rounded-[18px] p-2.5 lg:p-6 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative overflow-hidden">

          <!-- MOBILE VIEW (< lg) — one row, tap to open the details sheet -->
          <button
            type="button"
            data-flight-card
            aria-label="${esc(item.airline)} ${esc(item.originCode)} to ${esc(item.destinationCode)}, ${esc(item.price)}. View details"
            class="lg:hidden w-full flex items-center gap-2 text-left bg-transparent border-0 p-0 m-0 cursor-pointer transition-opacity active:opacity-60"
          >
            <span class="shrink-0 flex flex-col items-center gap-1 w-[40px]">
              <span class="w-[34px] h-[34px] bg-[#f8fafc] rounded-[10px] border border-border/50 flex items-center justify-center p-1">
                ${item.airlineLogo
                  ? `<img
                      src="${esc(item.airlineLogo)}"
                      data-airline-logo
                      data-fallback-src="${esc(item.airlineLogoFallback || '')}"
                      alt="${esc(item.airline)}"
                      loading="lazy"
                      class="max-h-full max-w-full object-contain"
                    >`
                  : ''
                }
                <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[10px] font-black tracking-[0.08em] text-primary">
                  ${esc(item.airlineInitials)}
                </span>
              </span>
              <span class="text-[9px] font-bold text-text-muted leading-none whitespace-nowrap">${esc(day)}${month ? ` ${esc(month)}` : ''}</span>
            </span>

            <span class="flex-1 min-w-0 flex items-center gap-1.5">
              <span class="shrink-0">
                <span class="block text-[14px] font-heading font-bold text-navy leading-none tracking-tight">${esc(item.originCode)}</span>
                <span class="block text-[10px] font-semibold text-text-muted leading-none mt-1">${esc(item.departure)}</span>
              </span>

              <span class="flex-1 min-w-[42px] flex flex-col items-center gap-1 px-0.5">
                <span class="w-full flex items-center gap-1">
                  <span class="h-px flex-1 bg-border"></span>
                  <i class="bi bi-airplane-fill text-primary text-[9px] leading-none"></i>
                  <span class="h-px flex-1 bg-border"></span>
                </span>
                <span class="text-[9px] font-bold text-text-muted leading-none whitespace-nowrap">${esc(item.baggageLabel)}</span>
              </span>

              <span class="shrink-0 text-right">
                <span class="block text-[14px] font-heading font-bold text-navy leading-none tracking-tight">${esc(item.destinationCode)}</span>
                <span class="block text-[10px] font-semibold text-text-muted leading-none mt-1">${esc(item.arrival)}</span>
              </span>
            </span>

            <span class="shrink-0 flex items-center gap-0.5 pl-2.5">
              <span class="text-[15px] font-heading font-black text-navy leading-none whitespace-nowrap">${esc(item.price)}</span>
              <i class="bi bi-chevron-right text-text-muted text-[10px] leading-none"></i>
            </span>
          </button>

          <!-- DESKTOP VIEW (>= lg) -->
          <div class="hidden lg:flex flex-row items-center justify-between gap-6">
            <!-- Left side: Date & Airline -->
            <div class="flex items-center gap-6 lg:gap-8 w-auto">
              <div class="text-center font-heading leading-tight shrink-0 flex flex-col items-center">
                <div class="text-[42px] font-medium text-navy tracking-tight" style="line-height: 1;">${day}</div>
                <div class="text-[20px] font-medium text-navy capitalize">${month}</div>
              </div>

              <div class="w-[100px] shrink-0 text-center flex items-center justify-center min-h-[40px]">
                ${item.airlineLogo
                  ? `<img
                      src="${item.airlineLogo}"
                      data-airline-logo
                      data-fallback-src="${item.airlineLogoFallback}"
                      alt="${item.airline} logo"
                      loading="lazy"
                      class="max-h-[35px] max-w-full object-contain"
                    >`
                  : ''
                }
                <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[16px] font-black tracking-[0.18em] text-primary">
                  ${item.airlineInitials}
                </span>
              </div>
            </div>

            <!-- Middle side: Routes & Details -->
            <div class="flex flex-1 flex-row items-center gap-8 px-6 min-w-0">

              <!-- Route -->
              <div class="flex flex-1 min-w-0 items-center gap-6 lg:gap-8">
                <div class="text-left flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">From</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-tight tracking-tight break-words whitespace-normal">${item.origin}</div>
                  <div class="text-[13px] font-medium text-text-muted mt-1 uppercase">${item.originCode}</div>
                </div>

                <div class="w-[46px] h-[46px] rounded-full bg-[#f8fafc] border border-border flex items-center justify-center shrink-0 shadow-sm relative">
                  <i class="bi bi-arrow-right text-primary text-[20px]"></i>
                </div>

                <div class="text-left flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-text-muted mb-1 capitalize">To</div>
                  <div class="text-[20px] font-bold text-navy uppercase leading-tight tracking-tight break-words whitespace-normal">${item.destination}</div>
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
                  <div class="text-[13px] text-text-muted font-medium mb-1.5 flex items-center">${item.checkInBaggage}</div>
                  <div class="text-[13px] text-text-muted font-medium flex items-center">${item.cabinBaggage}</div>
                </div>
              </div>

            </div>

            <!-- Right side: Price & Action -->
            <div class="flex flex-col items-center justify-center lg:w-[180px] shrink-0">
              <div class="bg-[#f8fafc] rounded-xl p-4 w-full flex flex-col items-center border border-border/50">
                <span class="text-[32px] font-medium text-navy tracking-tight mb-3 leading-none flex items-center">
                  ${item.price}
                </span>
                <a href="${item.waLink}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[15px] px-6 py-2.5 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
                  Book Now
                </a>
              </div>
            </div>

          </div>

        </div>
      `;
}

/**
 * The B2B portal's flight row: one dense card at every width.
 *
 * Below `md` it wraps onto two lines — details, then price and CTA — and from
 * `md` up the whole fare sits on a single line. Anything narrower than `md`
 * squeezes the route connector down to a stub, which is why the split is there
 * and not at `sm`.
 *
 * The Book Now anchor is a sibling of the `[data-flight-card]` button rather
 * than a child of it, so the two targets stay separate: tapping the details
 * opens the sheet, tapping the CTA goes to WhatsApp. `wireFlightCardSheet`
 * matches cards to fares by their index among `[data-flight-card]` elements,
 * so keep exactly one per card.
 *
 * @param {object} item the same shape `buildFlightCardHtml` takes
 * @returns {string} card HTML
 */
export function buildCompactFlightCardHtml(item) {
  const { day, month } = splitCardDate(item.date);

  return `
        <article class="bg-white rounded-2xl border border-border shadow-[0_1px_4px_rgba(13,31,60,0.05)] px-3 py-2.5 md:px-4 md:py-3 transition-shadow hover:shadow-[0_4px_16px_rgba(13,31,60,0.09)] flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">

          <button
            type="button"
            data-flight-card
            aria-label="${esc(item.airline)} ${esc(item.originCode)} to ${esc(item.destinationCode)} on ${esc(item.date)}, ${esc(item.price)}. View details"
            class="flex-1 min-w-0 flex items-center gap-2 md:gap-3 text-left bg-transparent border-0 p-0 m-0 cursor-pointer transition-opacity active:opacity-60"
          >
            <span class="w-[38px] h-[38px] shrink-0 bg-[#f8fafc] rounded-[10px] border border-border/60 flex items-center justify-center p-1">
              ${item.airlineLogo
                ? `<img
                    src="${esc(item.airlineLogo)}"
                    data-airline-logo
                    data-fallback-src="${esc(item.airlineLogoFallback || '')}"
                    alt="${esc(item.airline)}"
                    loading="lazy"
                    class="max-h-full max-w-full object-contain"
                  >`
                : ''
              }
              <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[10px] font-black tracking-[0.08em] text-primary">
                ${esc(item.airlineInitials)}
              </span>
            </span>

            <span class="shrink-0 min-w-0 w-[72px] sm:w-[130px]">
              <span class="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.14em] text-text-muted leading-none truncate">${esc(item.airline)}</span>
              <span class="block text-[13px] md:text-[15px] font-heading font-bold text-navy leading-none mt-1.5 whitespace-nowrap">${esc(day)}${month ? ` <span class="text-primary">${esc(month)}</span>` : ''}</span>
            </span>

            <span class="shrink-0">
              <span class="block text-[15px] md:text-[17px] font-heading font-bold text-navy leading-none tracking-tight">${esc(item.originCode)}</span>
              <span class="block text-[10px] font-semibold text-text-muted leading-none mt-1.5 whitespace-nowrap">DEP ${esc(item.departure)}</span>
            </span>

            <span class="flex-1 min-w-[46px] flex flex-col items-center gap-1 px-0.5">
              <span class="text-[9px] md:text-[10px] font-bold text-text-muted leading-none whitespace-nowrap">${esc(item.baggageLabel)}</span>
              <span class="w-full flex items-center gap-1">
                <span class="h-px flex-1 bg-border"></span>
                <span class="w-[22px] h-[22px] shrink-0 rounded-full bg-[#f8fafc] border border-border flex items-center justify-center">
                  <i class="bi bi-arrow-right text-primary text-[11px] leading-none"></i>
                </span>
                <span class="h-px flex-1 bg-border"></span>
              </span>
            </span>

            <span class="shrink-0 text-right">
              <span class="block text-[15px] md:text-[17px] font-heading font-bold text-navy leading-none tracking-tight">${esc(item.destinationCode)}</span>
              <span class="block text-[10px] font-semibold text-text-muted leading-none mt-1.5 whitespace-nowrap">ARR ${esc(item.arrival)}</span>
            </span>
          </button>

          <div class="shrink-0 flex items-center justify-between gap-3 border-t border-border/70 pt-2 md:border-t-0 md:pt-0 md:border-l md:pl-4">
            <span class="text-[19px] md:text-[20px] font-heading font-black text-navy leading-none whitespace-nowrap">${esc(item.price)}</span>
            <a
              href="${esc(item.waLink || '#')}"
              target="_blank"
              rel="noopener"
              class="flex-1 max-w-[320px] md:flex-none md:min-w-[124px] bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[13px] md:text-[14px] px-5 md:px-6 py-2 md:py-2.5 rounded-[10px] md:rounded-xl no-underline text-center whitespace-nowrap transition-shadow hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)]"
            >
              Book Now
            </a>
          </div>

        </article>
      `;
}
