export const POSTER_RATE_MASK_LABEL = 'SPECIAL RATE';
export const POSTER_SHOW_LIVE_RATES = false;

export function getPosterRateDisplay(rate) {
  const numericRate = Number.isFinite(Number(rate)) ? Number(rate) : 0;
  const actualLabel = `₹${numericRate.toLocaleString()}`;

  return {
    numericRate,
    actualLabel,
    displayLabel: POSTER_SHOW_LIVE_RATES ? actualLabel : POSTER_RATE_MASK_LABEL,
    isMasked: !POSTER_SHOW_LIVE_RATES,
  };
}
