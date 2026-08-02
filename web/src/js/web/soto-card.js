/**
 * soto-card.js — result card markup for the SOTO live-fares page.
 *
 * WHY THIS IS NOT buildFlightCardHtml
 *
 * 1. Baggage. That card renders `formatCheckInBaggageText()`, and
 *    shared/airline-baggage.js answers 30 kg for any code it does not know.
 *    Its table is calibrated to Zamra's India/Gulf carriers; on a worldwide
 *    low-cost carrier that default is simply wrong. SOTO cards therefore show
 *    no baggage at all — an absent allowance is recoverable, a confidently
 *    wrong one is not. web/tests/soto-card.test.js enforces this.
 *
 * 2. Escaping. buildFlightCardHtml interpolates every value raw, which is safe
 *    for admin-controlled Firestore rows. Everything here comes from a
 *    third-party API, so every field goes through escapeHtml().
 *
 * 3. The data is different. The provider gives a departure time but no arrival,
 *    a stop count, and a duration — not the dep/arr pair the shared card is
 *    built around.
 *
 * Pure string builders, no DOM, so the tests can call them directly.
 */

const CURRENCY_SYMBOLS = { INR: '₹', AED: 'AED ', SAR: 'SAR ', USD: '$', GBP: '£', EUR: '€' };

/**
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

/**
 * @param {number} price
 * @param {string} currency ISO code, e.g. 'INR'
 * @returns {string}
 */
export function formatSotoPrice(price, currency) {
  const numeric = Number(price);
  const code = String(currency || 'INR').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] || `${code} `;
  if (!Number.isFinite(numeric)) return `${symbol}—`;
  return `${symbol}${Math.round(numeric).toLocaleString('en-IN')}`;
}

/**
 * `2026-09-12` -> `12 Sep 2026`. Parsed by hand rather than through Date so the
 * calendar day never shifts for a viewer west of UTC.
 *
 * @param {string} key
 * @returns {string}
 */
export function formatSotoDate(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || '').trim());
  if (!match) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[Number(match[2]) - 1];
  return month ? `${match[3]} ${month} ${match[1]}` : '';
}

/**
 * @param {number} stops
 * @returns {string}
 */
export function formatStops(stops) {
  const count = Number(stops);
  if (!Number.isFinite(count) || count <= 0) return 'Non-stop';
  return count === 1 ? '1 stop' : `${count} stops`;
}

/**
 * @param {number} minutes
 * @returns {string} '' when the provider did not give a duration
 */
export function formatDuration(minutes) {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return '';
  const hours = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  if (!hours) return `${mins}m`;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * How long ago the provider last saw this price.
 *
 * These fares are cached market prices, not a live availability check, so the
 * age is part of the quote and is always shown.
 *
 * @param {string} isoTimestamp
 * @param {Date} [now]
 * @returns {string} '' when unknown
 */
export function formatFreshness(isoTimestamp, now = new Date()) {
  const seen = new Date(String(isoTimestamp || ''));
  if (Number.isNaN(seen.getTime())) return '';

  const minutes = Math.round((now.getTime() - seen.getTime()) / 60000);
  if (minutes < 0) return 'Checked just now';
  if (minutes < 2) return 'Checked just now';
  if (minutes < 60) return `Checked ${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Checked ${hours}h ago`;

  const days = Math.round(hours / 24);
  return `Checked ${days}d ago`;
}

/**
 * Pre-filled WhatsApp enquiry for one fare.
 *
 * The message quotes the same figure printed on the card and says plainly that
 * it is indicative, so the conversation starts from an honest number.
 *
 * @param {object} fare
 * @param {{origin: object, destination: object, whatsappNumber: string}} context
 * @returns {string}
 */
export function buildSotoBookingLink(fare, context) {
  const ctx = context || {};
  const origin = ctx.origin || {};
  const destination = ctx.destination || {};
  const number = String(ctx.whatsappNumber || '919846606739').replace(/\D/g, '');

  const lines = [
    'Hello Zamra Travels, I would like a quote for this international (SOTO) fare:',
    '',
    `✈️ ${origin.city || fare.origin} (${fare.origin}) → ${destination.city || fare.destination} (${fare.destination})`,
    `📅 ${formatSotoDate(fare.departDate)}${fare.departTime ? ` · ${fare.departTime}` : ''}`,
  ];

  if (fare.returnDate) lines.push(`🔁 Returning ${formatSotoDate(fare.returnDate)}`);

  lines.push(
    `🛫 ${fare.airlineName}${fare.flightNumber ? ` · ${fare.flightNumber}` : ''} · ${formatStops(fare.stops)}`,
    `💰 Indicative fare: ${formatSotoPrice(fare.price, fare.currency)}`,
    '',
    'Please confirm the current price and availability.',
  );

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * One result card.
 *
 * @param {object} fare a projected fare from searchSotoFares
 * @param {{origin: object, destination: object, whatsappNumber: string,
 *          cachedAt?: string, now?: Date}} context
 * @returns {string} card HTML
 */
export function buildSotoCardHtml(fare, context) {
  const ctx = context || {};
  const origin = ctx.origin || {};
  const destination = ctx.destination || {};

  const duration = formatDuration(fare.durationMinutes);
  const freshness = formatFreshness(fare.foundAt || ctx.cachedAt, ctx.now || new Date());
  const initials = String(fare.airlineCode || '??').slice(0, 2).toUpperCase();

  return `
    <article class="soto-card">
      <div class="soto-card-main">
        <div class="soto-airline">
          <span class="soto-airline-badge">${escapeHtml(initials)}</span>
          <span class="soto-airline-text">
            <span class="soto-airline-name">${escapeHtml(fare.airlineName)}</span>
            ${fare.flightNumber ? `<span class="soto-airline-flight">${escapeHtml(fare.flightNumber)}</span>` : ''}
          </span>
        </div>

        <div class="soto-route">
          <div class="soto-route-end">
            <span class="soto-route-code">${escapeHtml(fare.origin)}</span>
            <span class="soto-route-city">${escapeHtml(origin.city || '')}</span>
          </div>
          <div class="soto-route-mid">
            <span class="soto-route-line"><i class="bi bi-airplane-fill"></i></span>
            <span class="soto-route-meta">${escapeHtml(formatStops(fare.stops))}${duration ? ` · ${escapeHtml(duration)}` : ''}</span>
          </div>
          <div class="soto-route-end soto-route-end--right">
            <span class="soto-route-code">${escapeHtml(fare.destination)}</span>
            <span class="soto-route-city">${escapeHtml(destination.city || '')}</span>
          </div>
        </div>

        <div class="soto-when">
          <span class="soto-when-date">${escapeHtml(formatSotoDate(fare.departDate))}</span>
          ${fare.departTime ? `<span class="soto-when-time">Departs ${escapeHtml(fare.departTime)}</span>` : ''}
          ${fare.returnDate ? `<span class="soto-when-return">Returns ${escapeHtml(formatSotoDate(fare.returnDate))}</span>` : ''}
        </div>
      </div>

      <div class="soto-card-price">
        <span class="soto-indicative-chip" title="Market price from our fare feed — confirm with us before booking">
          <i class="bi bi-info-circle"></i> Indicative
        </span>
        <span class="soto-price">${escapeHtml(formatSotoPrice(fare.price, fare.currency))}</span>
        ${freshness ? `<span class="soto-freshness">${escapeHtml(freshness)}</span>` : ''}
        <a class="soto-book-btn" href="${escapeHtml(buildSotoBookingLink(fare, ctx))}" target="_blank" rel="noopener">
          <i class="bi bi-whatsapp"></i> Get this fare
        </a>
      </div>
    </article>
  `;
}
