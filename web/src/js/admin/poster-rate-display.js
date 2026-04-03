export const POSTER_RATE_MASK_LABEL = 'SPECIAL RATE';
export const POSTER_SHOW_LIVE_RATES = false;
export const POSTER_SPECIAL_RATE_WINDOW_DAYS = 7;

function asPosterDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === 'function') {
    const dateValue = value.toDate();
    return dateValue instanceof Date && !Number.isNaN(dateValue.getTime()) ? dateValue : null;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    const dateValue = new Date(`${value}T00:00:00`);
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }
  const dateValue = new Date(value);
  return Number.isNaN(dateValue.getTime()) ? null : dateValue;
}

function startOfLocalDay(date) {
  const value = asPosterDate(date);
  if (!value) return null;
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function shouldMaskPosterRate(flightDate, now = new Date()) {
  if (POSTER_SHOW_LIVE_RATES) return false;

  const departureDay = startOfLocalDay(flightDate);
  const currentDay = startOfLocalDay(now);
  if (!departureDay || !currentDay) return false;

  const endDay = new Date(currentDay);
  endDay.setDate(endDay.getDate() + POSTER_SPECIAL_RATE_WINDOW_DAYS);

  return departureDay >= currentDay && departureDay <= endDay;
}

export function getPosterRateDisplay(rate, flightDate) {
  const numericRate = Number.isFinite(Number(rate)) ? Number(rate) : 0;
  const actualLabel = `₹${numericRate.toLocaleString()}`;
  const isMasked = shouldMaskPosterRate(flightDate);

  return {
    numericRate,
    actualLabel,
    displayLabel: isMasked ? POSTER_RATE_MASK_LABEL : actualLabel,
    isMasked,
  };
}
