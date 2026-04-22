export function getPosterRateDisplay(rate, flightDate) {
  const numericRate = Number.isFinite(Number(rate)) ? Number(rate) : 0;
  const actualLabel = `₹${numericRate.toLocaleString()}`;

  return {
    numericRate,
    actualLabel,
    displayLabel: actualLabel,
    isMasked: false,
  };
}
