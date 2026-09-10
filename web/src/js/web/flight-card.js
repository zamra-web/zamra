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
 * The B2B portal's flight row: one fare, three layouts from one markup.
 *
 * - Below `md` it is two lines — who and how much, then the route and the CTA.
 *   The price sits on the first line rather than beside the button so the route
 *   gets a line to itself: five fields on one phone line is what made the old
 *   row read as cramped.
 * - From `md` the whole fare is a single line: airline, route, price, CTA.
 * - From `lg` the row earns the extra width with content instead of stretching
 *   the connector across it — city names under the airport codes and both
 *   baggage allowances spelled out in their own column.
 *
 * The reflow is done with `md:contents`: the two wrappers below dissolve at
 * `md`, so identity/price/route/baggage/CTA become direct children of the row
 * and `md:order-*` puts them in reading order. Keep the orders in sync if you
 * add a column.
 *
 * The `[data-flight-card]` hook is a stretched, transparent button covering the
 * card, with the visible content laid over it and `pointer-events-none` so taps
 * fall through. That keeps exactly one hook per card — `wireFlightCardSheet`
 * matches cards to fares by index — while leaving the Book Now anchor outside
 * it, so tapping details opens the sheet and tapping the CTA goes to WhatsApp.
 * The anchor needs `relative z-10` + `pointer-events-auto` to stay above and
 * clickable; without those the sheet swallows the booking tap.
 *
 * @param {object} item the same shape `buildFlightCardHtml` takes
 * @returns {string} card HTML
 */
export function buildCompactFlightCardHtml(item) {
  const { day, month } = splitCardDate(item.date);

  // Rendered twice, one hidden per breakpoint: the price belongs beside the
  // airline on a phone and beside the CTA on a wide row, and `md:contents`
  // reorders columns but cannot move a node between the two rows.
  const priceHtml = (cls) =>
    `<span class="${cls} font-heading font-black text-navy leading-none tabular-nums tracking-[-0.01em] whitespace-nowrap">${esc(item.price)}</span>`;

  const endpoint = (code, timeLabel, time, city, side) => `
            <span class="shrink-0 min-w-0 ${side === 'from' ? 'text-left md:text-right' : 'text-right md:text-left'} lg:w-[104px]">
              <span class="block text-[15px] md:text-[19px] lg:text-[21px] font-heading font-bold text-navy leading-none tracking-tight">${esc(code)}</span>
              <span class="block text-[10.5px] md:text-[12px] font-semibold text-text-muted leading-none mt-1.5 tabular-nums whitespace-nowrap">
                <span class="hidden lg:inline text-text-light">${timeLabel} </span>${esc(time)}
              </span>
              <span class="hidden lg:block text-[11px] font-medium text-text-light leading-none mt-1.5 truncate">${esc(city)}</span>
            </span>`;

  return `
        <article class="group relative bg-white rounded-2xl border border-border/80 shadow-[0_1px_3px_rgba(13,31,60,0.04)] px-3 py-2.5 md:px-5 md:py-3 flex flex-col md:flex-row md:items-center gap-0 md:gap-4 lg:gap-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/35 hover:shadow-[0_10px_28px_-14px_rgba(13,31,60,0.35)] focus-within:border-primary/35">

          <button
            type="button"
            data-flight-card
            aria-label="${esc(item.airline)} ${esc(item.originCode)} to ${esc(item.destinationCode)} on ${esc(item.date)}, ${esc(item.price)}. View details"
            class="absolute inset-0 w-full h-full rounded-2xl bg-transparent border-0 p-0 m-0 cursor-pointer"
          ></button>

          <div class="relative pointer-events-none flex items-center gap-3 min-w-0 md:contents">
            <span class="flex-1 min-w-0 flex items-center gap-2.5 md:gap-3 md:flex-none md:order-1 md:w-[156px] lg:w-[206px]">
              <span class="w-[36px] h-[36px] md:w-[42px] md:h-[42px] shrink-0 bg-[#f8fafc] rounded-[11px] md:rounded-xl border border-border/60 flex items-center justify-center p-1 md:p-1.5">
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
                <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[10px] md:text-[11px] font-black tracking-[0.08em] text-primary">
                  ${esc(item.airlineInitials)}
                </span>
              </span>
              <span class="min-w-0">
                <span class="block text-[10px] md:text-[10.5px] font-bold uppercase tracking-[0.13em] text-text-muted leading-none truncate">${esc(item.airline)}</span>
                <span class="block text-[15px] md:text-[16px] font-heading font-bold text-navy leading-none mt-1.5 whitespace-nowrap">${esc(day)}${month ? ` <span class="text-primary">${esc(month)}</span>` : ''}</span>
              </span>
            </span>

            <span class="shrink-0 md:hidden text-right">
              ${priceHtml('block text-[18px]')}
              <span class="block text-[10px] font-semibold text-text-muted leading-none mt-1.5">${esc(item.baggageLabel)}</span>
            </span>
          </div>

          <div class="relative pointer-events-none flex items-center gap-3 pt-3 border-t border-border/60 md:gap-5 md:contents">
            <span class="flex-1 min-w-0 md:order-2 flex items-center justify-center gap-2.5 md:gap-4 lg:gap-5">
              ${endpoint(item.originCode, 'DEP', item.departure, item.origin, 'from')}

              <span class="flex-1 min-w-[44px] md:max-w-[220px] flex flex-col items-center gap-1.5">
                <span class="hidden md:block lg:hidden text-[10.5px] font-bold text-text-muted leading-none whitespace-nowrap">${esc(item.baggageLabel)}</span>
                <span class="w-full flex items-center gap-1.5">
                  <span class="h-px flex-1 bg-[linear-gradient(to_right,transparent,var(--color-border))]"></span>
                  <i class="bi bi-airplane-fill text-primary/70 text-[10px] md:text-[11px] leading-none"></i>
                  <span class="h-px flex-1 bg-[linear-gradient(to_left,transparent,var(--color-border))]"></span>
                </span>
              </span>

              ${endpoint(item.destinationCode, 'ARR', item.arrival, item.destination, 'to')}
            </span>

            <span class="hidden lg:block shrink-0 md:order-3 w-[124px] xl:w-[140px] border-l border-border/70 pl-4">
              <span class="block text-[11.5px] font-semibold text-text-muted leading-none truncate">${esc(item.checkInBaggage)}</span>
              <span class="block text-[11.5px] font-medium text-text-light leading-none mt-1.5 truncate">${esc(item.cabinBaggage)}</span>
            </span>

            ${priceHtml('hidden md:block md:order-4 shrink-0 md:w-[96px] lg:w-[112px] md:text-right text-[20px] lg:text-[22px]')}

            <a
              href="${esc(item.waLink || '#')}"
              target="_blank"
              rel="noopener"
              class="relative z-10 pointer-events-auto shrink-0 md:order-5 inline-flex items-center justify-center w-[102px] h-[36px] md:w-[118px] lg:w-[134px] md:h-[42px] rounded-[10px] md:rounded-xl bg-gradient-to-r from-[var(--color-primary-gradient-start)] to-[var(--color-primary-gradient-end)] text-white font-heading font-bold text-[12.5px] md:text-[14px] no-underline whitespace-nowrap transition-shadow hover:shadow-[0_6px_18px_-4px_rgba(12,74,138,0.55)]"
            >
              Book Now
            </a>
          </div>

        </article>
      `;
}
