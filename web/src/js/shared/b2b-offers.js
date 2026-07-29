// Featured offers — the promotional fare cards pinned beside the "Welcome
// back" banner in the B2B portal.
//
// `functions/b2bOffers.js` is the CommonJS mirror of the liveness rules for
// getB2BPortalContext. Any change to isOfferLive()/offerLastLiveDate() must be
// made in BOTH files, or a deal will keep showing on one surface after the
// other has dropped it.
//
// Shape of one `b2b_offers` document:
//
//   {
//     badge:        'VERY LOW FARE',   // free text, printed uppercase
//     badgeTone:    'hot',             // hot | low | limited | new — colour + icon
//     originCity:   'Kozhikode',  originCode: 'CCJ',
//     destCity:     'Jeddah',     destCode:   'JED',
//     airlineId:    '<airlines doc id>',   // resolves the logo at render time
//     airlineName:  'Air India Express',   // snapshot, used when the id is gone
//     airlineCode:  'IX',                  // drives the baggage policy
//     travelDate:   '2026-08-02',     // date-only ISO — no timezone to get wrong
//     checkInBaggageKg: 30,           // snapped onto the airline's allowed values
//     price:        0,                // 0 / empty hides the price line
//     priceNote:    'per adult',
//     ctaType:      'whatsapp' | 'search',
//     ctaLabel:     'Book Now',
//     isActive:     true,
//     expiresAt:    '',               // optional last day the card shows
//     order:        0,
//   }
//
// Nothing here is hardcoded into a renderer: SAMPLE_OFFER only pre-fills the
// admin "Add offer" form, exactly like the visa rate-card template.

import {
  normalizeAirlineCode,
  resolveCheckInBaggageKg,
  formatBaggageAllowanceShort,
} from './airline-baggage.js';

/** Badge presets offered in the admin form. `tone` drives colour and icon. */
export const OFFER_BADGE_PRESETS = Object.freeze([
  { label: 'VERY LOW FARE', tone: 'hot' },
  { label: 'HOT DEAL', tone: 'hot' },
  { label: 'LIMITED SEATS', tone: 'limited' },
  { label: 'SPECIAL FARE', tone: 'low' },
  { label: 'NEW ROUTE', tone: 'new' },
]);

/**
 * Colour + icon per tone. Full literal Tailwind class strings so the v4 scanner
 * can see them, and shared with the admin preview so both surfaces agree.
 */
const BADGE_TONES = Object.freeze({
  hot: { icon: '🔥', chip: 'bg-[#fff1e6] text-[#c2410c] border-[#fed7aa]' },
  low: { icon: '💸', chip: 'bg-[#e8f8ef] text-[#0f7a44] border-[#bbe7cd]' },
  limited: { icon: '⏳', chip: 'bg-[#fef6e0] text-[#92650b] border-[#fae3a4]' },
  new: { icon: '✨', chip: 'bg-[#e8f1fe] text-[#1558c0] border-[#c7dcfb]' },
});

export const OFFER_TONES = Object.freeze(Object.keys(BADGE_TONES));

export function badgeTone(tone) {
  return BADGE_TONES[tone] || BADGE_TONES.hot;
}

export function isOfferTone(value) {
  return Object.prototype.hasOwnProperty.call(BADGE_TONES, String(value));
}

function cleanText(value) {
  return String(value ?? '').trim();
}

function cleanCode(value) {
  return cleanText(value).toUpperCase().slice(0, 4);
}

/** Any date-ish value → 'YYYY-MM-DD', or '' when it cannot be read. */
export function toDateKey(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
  }
  // Firestore Timestamp, Date, or epoch ms — all read in UTC, which is how
  // flightDate is stored elsewhere in this codebase.
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** '2026-08-02' → '02 AUG 2026'. Parsed by hand so no timezone can shift it. */
export function formatOfferDate(value) {
  const key = toDateKey(value);
  if (!key) return '';
  const [year, month, day] = key.split('-');
  return `${day} ${MONTHS[Number(month) - 1] || month} ${year}`;
}

/**
 * The day an offer stops showing, inclusive.
 *
 * An explicit `expiresAt` wins; otherwise the travel date is the natural
 * expiry — a deal for a flight that has already left is not a deal.
 */
export function offerLastLiveDate(offer) {
  return toDateKey(offer?.expiresAt) || toDateKey(offer?.travelDate);
}

/**
 * @param {object} offer   normalised offer
 * @param {string} todayKey 'YYYY-MM-DD' for the day being judged
 */
export function isOfferLive(offer, todayKey) {
  if (!offer || offer.isActive === false) return false;
  const last = offerLastLiveDate(offer);
  // No date at all means an evergreen card — it runs until switched off.
  if (!last) return true;
  return last >= String(todayKey || '');
}

/** Today in IST ('YYYY-MM-DD') — offers are sold on Indian calendar days. */
export function todayKeyIST(now = new Date()) {
  const ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  return ist.toISOString().slice(0, 10);
}

/**
 * Coerce a raw Firestore document into the shape every renderer expects.
 * Baggage is snapped onto the airline's allowed weights here so a stale manual
 * entry can never print an allowance the airline does not sell.
 */
export function normaliseOffer(doc) {
  const airlineCode = normalizeAirlineCode(doc?.airlineCode);
  const price = Number(doc?.price);
  return {
    id: doc?.id || '',
    badge: cleanText(doc?.badge).toUpperCase(),
    badgeTone: isOfferTone(doc?.badgeTone) ? doc.badgeTone : 'hot',
    originCity: cleanText(doc?.originCity),
    originCode: cleanCode(doc?.originCode),
    destCity: cleanText(doc?.destCity),
    destCode: cleanCode(doc?.destCode),
    airlineId: cleanText(doc?.airlineId),
    airlineName: cleanText(doc?.airlineName),
    airlineCode,
    travelDate: toDateKey(doc?.travelDate),
    checkInBaggageKg: resolveCheckInBaggageKg(airlineCode, doc?.checkInBaggageKg),
    price: Number.isFinite(price) && price > 0 ? Math.round(price) : 0,
    priceNote: cleanText(doc?.priceNote),
    ctaType: doc?.ctaType === 'search' ? 'search' : 'whatsapp',
    ctaLabel: cleanText(doc?.ctaLabel),
    isActive: doc?.isActive !== false,
    expiresAt: toDateKey(doc?.expiresAt),
    order: Number.isFinite(Number(doc?.order)) ? Number(doc.order) : 0,
  };
}

/** '30 + 7 kg' — check-in from the offer, hand baggage from airline policy. */
export function formatOfferBaggage(offer) {
  return formatBaggageAllowanceShort(offer?.airlineCode, offer?.checkInBaggageKg);
}

/** '₹18,500', or '' when the offer carries no price. */
export function formatOfferPrice(offer) {
  return offer?.price > 0 ? `₹${Number(offer.price).toLocaleString('en-IN')}` : '';
}

export function offerCtaLabel(offer) {
  return offer?.ctaLabel || (offer?.ctaType === 'search' ? 'View fares' : 'Book Now');
}

/** An offer needs a route to be worth rendering; everything else is optional. */
export function isOfferComplete(offer) {
  return Boolean(offer?.originCode && offer?.destCode);
}

/** Admin display order: `order` first, then travel date, then route. */
export function sortOffers(offers) {
  return [...(offers || [])].sort((a, b) =>
    (Number(a.order) || 0) - (Number(b.order) || 0) ||
    String(a.travelDate || '').localeCompare(String(b.travelDate || '')) ||
    `${a.originCode}${a.destCode}`.localeCompare(`${b.originCode}${b.destCode}`));
}

/** Normalised, sorted, live-only — what the portal rail actually renders. */
export function liveOffers(docs, todayKey = todayKeyIST()) {
  return sortOffers((Array.isArray(docs) ? docs : []).map(normaliseOffer))
    .filter((offer) => isOfferComplete(offer) && isOfferLive(offer, todayKey));
}

/**
 * Pre-fill for "Add featured offer" in the admin form — the CCJ → JED sample.
 * Convenience only: once saved it is ordinary editable Firestore data.
 */
export const SAMPLE_OFFER = Object.freeze({
  badge: 'VERY LOW FARE',
  badgeTone: 'hot',
  originCity: 'Kozhikode',
  originCode: 'CCJ',
  destCity: 'Jeddah',
  destCode: 'JED',
  airlineName: 'Air India Express',
  airlineCode: 'IX',
  travelDate: '2026-08-02',
  checkInBaggageKg: 30,
  price: 0,
  priceNote: '',
  ctaType: 'whatsapp',
  ctaLabel: 'Book Now',
  isActive: true,
  expiresAt: '',
  order: 0,
});

export function buildSampleOffer() {
  return { ...SAMPLE_OFFER };
}

// ── Card markup ──────────────────────────────────────────────────────────────
// One builder for both surfaces: the portal rail and the admin form's live
// preview. Two copies of this markup would drift, and the whole point of the
// preview is that an admin sees exactly what the agent will.

function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * @param {object} offer  normalised offer (see normaliseOffer)
 * @param {object} brand  resolved airline brand — { name, logoUrl, fallbackLogoUrl, initials }
 * @param {object} [link] { href, target } for the CTA; omitted renders a dead
 *   button, which is what the admin preview wants.
 * @returns {string} card HTML
 */
export function buildOfferCardHtml(offer, brand = {}, link = null) {
  const tone = badgeTone(offer.badgeTone);
  const airline = offer.airlineName || brand.name || '';
  const price = formatOfferPrice(offer);
  const dateText = formatOfferDate(offer.travelDate);

  const badge = offer.badge
    ? `<span class="inline-flex items-center gap-1 self-start px-2 py-[3px] rounded-md border text-[9.5px] font-black uppercase tracking-[0.7px] leading-none ${tone.chip}">
         <span aria-hidden="true">${tone.icon}</span>${esc(offer.badge)}
       </span>`
    : '';

  const logo = brand.logoUrl
    ? `<img src="${esc(brand.logoUrl)}" data-airline-logo data-fallback-src="${esc(brand.fallbackLogoUrl || '')}"
         alt="${esc(airline)} logo" loading="lazy" class="max-h-full max-w-full object-contain">`
    : '';

  const priceBlock = price
    ? `<div class="flex items-baseline gap-1.5">
         <span class="text-[19px] font-heading font-black text-navy leading-none">${esc(price)}</span>
         ${offer.priceNote ? `<span class="text-[10px] font-semibold text-text-muted">${esc(offer.priceNote)}</span>` : ''}
       </div>`
    : '';

  const cta = link?.href
    ? `<a href="${esc(link.href)}"${link.target ? ` target="${esc(link.target)}" rel="noopener"` : ''}
         class="mt-auto w-full inline-flex items-center justify-center gap-1.5 h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-primary-gradient-start)] to-[var(--color-primary-gradient-end)] text-white text-[12.5px] font-bold hover:opacity-90 transition-opacity">
         <i class="bi ${offer.ctaType === 'search' ? 'bi-search' : 'bi-whatsapp'}"></i>${esc(offerCtaLabel(offer))}
       </a>`
    : `<span class="mt-auto w-full inline-flex items-center justify-center gap-1.5 h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-primary-gradient-start)] to-[var(--color-primary-gradient-end)] text-white text-[12.5px] font-bold opacity-70">
         <i class="bi ${offer.ctaType === 'search' ? 'bi-search' : 'bi-whatsapp'}"></i>${esc(offerCtaLabel(offer))}
       </span>`;

  return `
    <article class="b2b-offer-card snap-start shrink-0 grow basis-0 min-w-[196px] max-w-[300px] flex flex-col gap-2.5 p-3.5 rounded-[16px] bg-white/85 border border-white/70 backdrop-blur-sm shadow-[0_4px_16px_rgba(13,31,60,0.08)] hover:shadow-[0_10px_28px_rgba(13,31,60,0.14)] hover:-translate-y-0.5 transition-all">
      ${badge}

      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <div class="text-[17px] font-heading font-black text-navy leading-none tracking-tight">${esc(offer.originCode)}</div>
          <div class="text-[10px] font-semibold text-text-muted truncate mt-1">${esc(offer.originCity)}</div>
        </div>
        <i class="bi bi-airplane-fill text-primary text-[13px] rotate-90 shrink-0"></i>
        <div class="min-w-0 text-right">
          <div class="text-[17px] font-heading font-black text-navy leading-none tracking-tight">${esc(offer.destCode)}</div>
          <div class="text-[10px] font-semibold text-text-muted truncate mt-1">${esc(offer.destCity)}</div>
        </div>
      </div>

      <div class="flex items-center gap-2 pt-2.5 border-t border-border/60">
        <span class="w-[26px] h-[26px] shrink-0 rounded-lg bg-[#f8fafc] border border-border/60 flex items-center justify-center p-[3px]">
          ${logo}
          <span data-airline-fallback class="${logo ? 'hidden ' : ''}text-[8px] font-black tracking-[0.1em] text-primary">${esc(brand.initials || '')}</span>
        </span>
        <span class="text-[11.5px] font-bold text-text-main truncate">${esc(airline)}</span>
      </div>

      <div class="flex flex-wrap gap-1.5">
        ${dateText ? `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/8 text-[10px] font-bold text-navy"><i class="bi bi-calendar-event text-primary"></i>${esc(dateText)}</span>` : ''}
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/8 text-[10px] font-bold text-navy"><i class="bi bi-luggage text-primary"></i>${esc(formatOfferBaggage(offer))}</span>
      </div>

      ${priceBlock}
      ${cta}
    </article>`;
}
