/**
 * flight-card.js — flight result card markup shared by the public flight
 * search and the B2B portal.
 *
 * @param {{
 *   airline, airlineLogo, airlineLogoFallback, airlineInitials,
 *   origin, originCode, destination, destinationCode,
 *   date, departure, arrival, price,
 *   checkInBaggage, cabinBaggage, baggageLabel, waLink
 * }} item
 * @returns {string} card HTML
 */
export function buildFlightCardHtml(item) {
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

  return `
        <div class="bg-white rounded-[18px] max-sm:rounded-[22px] p-4 lg:p-6 shadow-[0_2px_12px_rgba(13,31,60,0.06)] border border-border transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,31,60,0.1)] relative overflow-hidden">

          <!-- MOBILE VIEW (< lg) -->
          <div class="flex flex-col gap-4 lg:hidden">
            <div class="flex items-start justify-between gap-3 border-b border-border pb-3">
              <div class="flex items-center gap-3">
                <div class="w-[54px] h-[54px] shrink-0 bg-[#f8fafc] rounded-2xl border border-border/50 flex items-center justify-center p-2">
                  ${item.airlineLogo
                    ? `<img
                        src="${item.airlineLogo}"
                        data-airline-logo
                        data-fallback-src="${item.airlineLogoFallback}"
                        alt="${item.airline} logo"
                        loading="lazy"
                        class="max-h-full max-w-full object-contain"
                      >`
                    : ''
                  }
                  <span data-airline-fallback class="${item.airlineLogo ? 'hidden ' : ''}text-[13px] font-black tracking-[0.16em] text-primary">
                    ${item.airlineInitials}
                  </span>
                </div>
                <div>
                  <div class="text-[11px] font-bold text-text-muted uppercase tracking-[0.16em] mb-1">${item.airline}</div>
                  <div class="text-[17px] font-heading font-bold text-navy flex items-baseline gap-1.5 leading-none">
                    ${day} <span class="text-primary text-[13px]">${month}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">Price</div>
                <div class="text-[20px] font-heading font-black text-navy leading-none">${item.price}</div>
              </div>
            </div>

            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-1">
              <div class="text-left">
                <div class="text-[18px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${item.originCode}</div>
                <div class="text-[11px] font-semibold text-text-muted uppercase">Dep ${item.departure}</div>
              </div>

              <div class="flex flex-col items-center px-2">
                <div class="w-9 h-9 rounded-full bg-[#f8fafc] border border-border flex items-center justify-center">
                  <i class="bi bi-arrow-right text-primary text-[18px]"></i>
                </div>
                <div class="text-[10px] text-text-muted font-bold mt-1">${item.baggageLabel}</div>
              </div>

              <div class="text-right">
                <div class="text-[18px] font-heading font-bold text-navy leading-none tracking-tight mb-1">${item.destinationCode}</div>
                <div class="text-[11px] font-semibold text-text-muted uppercase">Arr ${item.arrival}</div>
              </div>
            </div>

            <a href="${item.waLink}" target="_blank" class="w-full bg-gradient-to-r from-primary to-[#1558c0] text-white font-heading font-bold text-[14px] px-6 py-3 rounded-xl hover:shadow-[0_4px_14px_rgba(26,115,232,0.3)] hover:-translate-y-1 transition-all text-center whitespace-nowrap">
              Book Now
            </a>
          </div>

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
                  <div class="text-[14px] font-bold text-navy flex items-center">${item.cabinBaggage}</div>
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
