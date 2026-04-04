export const POSTER_RATE_MASK_LABEL = 'SPECIAL FARE';
export const POSTER_SHOW_LIVE_RATES = false;

function shouldMaskPosterRate() {
  if (POSTER_SHOW_LIVE_RATES) return false;
  return true;
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
