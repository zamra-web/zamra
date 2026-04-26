import {
  getPosterSocialCountry,
  getPosterSocialMarket,
  POSTER_SOCIAL_COUNTRY_ORDER,
  resolveSectorCountryKey,
  resolveSectorMarketKey,
} from './social-markets.js';

export const POSTER_SOCIAL_IMAGE_MAX_ITEMS = 10;

const POSTER_SOCIAL_TIME_ZONE = 'Asia/Kolkata';
const POSTER_SOCIAL_SITE = 'zamratravels.com';
const POSTER_SOCIAL_CONTACT = '+91 9846606739';

function toMarketCityLabel(marketLabel = '') {
  return String(marketLabel || '')
    .split('(')[0]
    .trim() || 'Zamra Travels';
}

export function formatPosterSocialDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: POSTER_SOCIAL_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date).replaceAll('/', '.');
}

export function formatCountryCarouselCaption(marketKey, countryKey, date = new Date()) {
  const market = getPosterSocialMarket(marketKey);
  const country = getPosterSocialCountry(countryKey);
  const marketCity = toMarketCityLabel(market?.label);
  const countryLabel = country?.label || String(countryKey || '').trim().toUpperCase() || 'International';

  return [
    `TODAY (${formatPosterSocialDate(date)})`,
    `Special fares from ${marketCity} to ${countryLabel}!`,
    'Swipe through today\'s live options from Zamra Travels.',
    `Book now at ${POSTER_SOCIAL_SITE}`,
    `Contact: ${POSTER_SOCIAL_CONTACT}`,
  ].join('\n');
}

export function buildMarketCountryGroups({ marketKey, sectors = [], faresBySector = new Map() }) {
  const groups = new Map();

  sectors.forEach((sector) => {
    if (!sector || resolveSectorMarketKey(sector) !== marketKey) return;

    const fares = faresBySector instanceof Map
      ? (faresBySector.get(sector.id) || [])
      : [];
    if (!fares.length) return;

    const countryKey = resolveSectorCountryKey(sector);
    if (!countryKey) return;

    const country = getPosterSocialCountry(countryKey);
    if (!country) return;

    if (!groups.has(countryKey)) {
      groups.set(countryKey, {
        countryKey,
        countryLabel: country.label,
        sectors: [],
      });
    }

    groups.get(countryKey).sectors.push(sector);
  });

  return POSTER_SOCIAL_COUNTRY_ORDER
    .map((countryKey) => groups.get(countryKey))
    .filter((group) => group?.sectors?.length);
}

export function appendCarouselItemsLimited(existingItems = [], nextItems = [], maxItems = POSTER_SOCIAL_IMAGE_MAX_ITEMS) {
  const currentItems = Array.isArray(existingItems) ? existingItems : [];
  if (currentItems.length >= maxItems) return currentItems.slice(0, maxItems);

  const incomingItems = Array.isArray(nextItems) ? nextItems : [];
  const remaining = Math.max(0, maxItems - currentItems.length);
  if (!remaining || !incomingItems.length) return currentItems.slice(0, maxItems);

  return currentItems.concat(incomingItems.slice(0, remaining));
}
