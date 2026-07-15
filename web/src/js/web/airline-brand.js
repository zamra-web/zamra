/**
 * airline-brand.js — airline logo/name/initials resolution shared by the
 * public flight search and the B2B portal.
 */

const AIRLINE_LOGO_FALLBACKS = {
  'AIR INDIA EXPRESS': '/assets/img/flights/air-india-express.png',
  'OMAN AIR': '/assets/img/flights/oman-air.png',
  'AIR INDIA': '/assets/img/flights/air-india.png',
  'SAUDIA': '/assets/img/flights/saudia.png'
};

function normalizeAirlineValue(value = '') {
  return String(value).toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

function getFallbackAirlineLogo({ name = '', code = '' } = {}) {
  const airlineName = normalizeAirlineValue(name);
  const airlineCode = normalizeAirlineValue(code);

  if (airlineName.includes('EXPRESS') || airlineCode === 'IX') return AIRLINE_LOGO_FALLBACKS['AIR INDIA EXPRESS'];
  if (airlineName.includes('INDIA') || airlineCode === 'AI') return AIRLINE_LOGO_FALLBACKS['AIR INDIA'];
  if (airlineName.includes('SAUD') || airlineName.includes('SOUD') || airlineCode === 'SV') return AIRLINE_LOGO_FALLBACKS['SAUDIA'];
  if (airlineName.includes('OMAN') || airlineCode === 'WY') return AIRLINE_LOGO_FALLBACKS['OMAN AIR'];

  return '';
}

function getAirlineInitials(name = '', code = '') {
  const normalizedCode = String(code || '').trim().toUpperCase();
  if (normalizedCode) return normalizedCode.slice(0, 3);

  const initials = String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials.slice(0, 3) || 'AIR';
}

export function resolveAirlineBrand(airline = null) {
  const fallbackLogoUrl = getFallbackAirlineLogo(airline || {});
  const primaryLogoUrl = airline?.logoUrl || fallbackLogoUrl || '';

  return {
    name: airline?.name || 'Unknown Airline',
    code: String(airline?.code || '').toUpperCase(),
    logoUrl: primaryLogoUrl,
    fallbackLogoUrl: airline?.logoUrl && fallbackLogoUrl && airline.logoUrl !== fallbackLogoUrl ? fallbackLogoUrl : '',
    initials: getAirlineInitials(airline?.name, airline?.code)
  };
}

export function wireFlightResultLogos(root) {
  root.querySelectorAll('[data-airline-logo]').forEach((img) => {
    const handleError = () => {
      const fallbackSrc = img.dataset.fallbackSrc;
      if (fallbackSrc && img.src !== fallbackSrc) {
        img.src = fallbackSrc;
        img.dataset.fallbackSrc = '';
        return;
      }

      img.classList.add('hidden');
      const fallbackText = img.parentElement?.querySelector('[data-airline-fallback]');
      if (fallbackText) fallbackText.classList.remove('hidden');
    };

    img.addEventListener('error', handleError);
    if (img.complete && img.naturalWidth === 0) handleError();
  });
}
