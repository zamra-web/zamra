"use strict";

function normalizeSectorSortOrder(value) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  return numeric;
}

function compareStringValues(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, {
    sensitivity: "base",
  });
}

function compareLegacySectorOrder(a = {}, b = {}) {
  const na = Number.parseInt(a.id, 10);
  const nb = Number.parseInt(b.id, 10);
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;

  const sectorCodeCompare = compareStringValues(a.sectorCode, b.sectorCode);
  if (sectorCodeCompare !== 0) return sectorCodeCompare;

  return compareStringValues(a.id, b.id);
}

function compareSectorDisplayOrder(a = {}, b = {}) {
  const sa = normalizeSectorSortOrder(a.sortOrder);
  const sb = normalizeSectorSortOrder(b.sortOrder);

  if (sa !== null && sb !== null && sa !== sb) return sa - sb;
  if (sa !== null && sb === null) return -1;
  if (sa === null && sb !== null) return 1;

  return compareLegacySectorOrder(a, b);
}

function resolveSectorDisplayOrder(sectors = []) {
  const ordered = [...sectors].sort(compareSectorDisplayOrder);
  const maxExisting = ordered.reduce((max, sector) => {
    const value = normalizeSectorSortOrder(sector.sortOrder);
    return value !== null && value > max ? value : max;
  }, 0);

  let nextFallbackSortOrder = maxExisting;

  return ordered.map((sector) => {
    const current = normalizeSectorSortOrder(sector.sortOrder);
    if (current !== null) {
      return { ...sector, sortOrder: current };
    }

    nextFallbackSortOrder += 1;
    return { ...sector, sortOrder: nextFallbackSortOrder };
  });
}

function planSectorSortOrderBackfill(sectors = []) {
  const ordered = [...sectors].sort(compareSectorDisplayOrder);
  const maxExisting = ordered.reduce((max, sector) => {
    const value = normalizeSectorSortOrder(sector.sortOrder);
    return value !== null && value > max ? value : max;
  }, 0);

  const updates = [];
  let nextFallbackSortOrder = maxExisting;

  ordered.forEach((sector) => {
    if (normalizeSectorSortOrder(sector.sortOrder) !== null) return;
    nextFallbackSortOrder += 1;
    updates.push({
      id: sector.id,
      sortOrder: nextFallbackSortOrder,
      sectorCode: sector.sectorCode || "",
    });
  });

  return updates;
}

function buildSequentialSectorSortUpdates(sectorIds = []) {
  return sectorIds.map((id, index) => ({
    id: String(id || "").trim(),
    sortOrder: index + 1,
  }));
}

module.exports = {
  buildSequentialSectorSortUpdates,
  compareLegacySectorOrder,
  compareSectorDisplayOrder,
  normalizeSectorSortOrder,
  planSectorSortOrderBackfill,
  resolveSectorDisplayOrder,
};
