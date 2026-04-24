function normalizePosterBaggagePart(value) {
  if (value === null || value === undefined || value === '') return '';
  const raw = String(value).trim();
  if (!raw || /^[-–—]+$/.test(raw)) return '';

  const isNumericKg = /^\d+(\.\d+)?(\s*kg)?$/i.test(raw);
  if (isNumericKg) {
    const parsed = parseFloat(raw.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(parsed) || parsed <= 0) return '';
    return `${parsed}Kg`;
  }

  return raw.replace(/\s*kg\b/ig, 'Kg').replace(/\s+/g, ' ').trim();
}

export function formatPosterBaggageDisplay(baggage, extraBaggage) {
  const parts = [
    normalizePosterBaggagePart(baggage),
    normalizePosterBaggagePart(extraBaggage),
  ].filter(Boolean);

  return parts.length ? parts.join(' + ') : '—';
}
