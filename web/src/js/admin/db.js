/**
 * db.js — Firestore & Cloud Functions service layer for Zamra Admin
 *
 * Exports clean async helpers for every CRUD operation needed by the
 * admin dashboard, plus wrappers for each Cloud Function.
 */

import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, Timestamp, serverTimestamp, writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from './firebase-config.js';


// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all agents — returned unsorted; callers sort by numeric ID */
export async function getAgents() {
  const snap = await getDocs(collection(db, 'agents'));
  const agents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort by numeric ID (1, 2, 3…) with fallback to lexicographic
  return agents.sort((a, b) => {
    const na = parseInt(a.id), nb = parseInt(b.id);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.id.localeCompare(b.id);
  });
}

/** Add a new agent. Returns the new document ID. */
export async function addAgent(data) {
  if (!data.id) throw new Error("Agent ID is required.");
  const docRef = doc(db, 'agents', data.id);
  await setDoc(docRef, {
    name: data.name || '',
    contactPhone: data.contactPhone || '',
    email: data.email || '',
    isActive: data.isActive !== undefined ? data.isActive : true,
    commission: data.commission !== undefined ? Number(data.commission) : 500,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return data.id;
}

/** Update an existing agent */
export async function updateAgent(agentId, data) {
  const { id, ...updates } = data;
  const hasCommission = updates.commission !== undefined && updates.commission !== null && updates.commission !== '';
  if (hasCommission) {
    updates.commission = Number(updates.commission) || 0;
  }

  await updateDoc(doc(db, 'agents', agentId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (hasCommission) {
    await syncAgentFareCommission(agentId, updates.commission);
  }
}

/** Delete an agent */
export async function deleteAgent(agentId) {
  await deleteDoc(doc(db, 'agents', agentId));
}

/** Toggle an agent's isActive status (calls Cloud Function for bulk fare update) */
export async function toggleAgentActive(agentId, isActive) {
  return callToggleAgentVisibility(agentId, isActive);
}


// ─────────────────────────────────────────────────────────────────────────────
// SECTORS
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all sectors — sorted by numeric ID with fallback to sectorCode */
export async function getSectors() {
  const snap = await getDocs(collection(db, 'sectors'));
  const sectors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Sort by numeric ID first; fall back to sectorCode alphabetically
  return sectors.sort((a, b) => {
    const na = parseInt(a.id), nb = parseInt(b.id);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return (a.sectorCode || '').localeCompare(b.sectorCode || '');
  });
}

/** Add a new sector */
export async function addSector(data) {
  const docRef = await addDoc(collection(db, 'sectors'), {
    sectorFrom: data.sectorFrom || '',
    sectorTo: data.sectorTo || '',
    sectorCode: data.sectorCode || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing sector */
export async function updateSector(sectorId, data) {
  await updateDoc(doc(db, 'sectors', sectorId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a sector */
export async function deleteSector(sectorId) {
  await deleteDoc(doc(db, 'sectors', sectorId));
}


// ─────────────────────────────────────────────────────────────────────────────
// AIRLINES
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all airlines ordered by name */
export async function getAirlines() {
  const snap = await getDocs(query(collection(db, 'airlines'), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Add a new airline. Optionally upload a logo file. */
export async function addAirline(data, logoFile = null) {
  let logoUrl = data.logoUrl || '';
  if (logoFile) {
    logoUrl = await uploadLogo('airline_logos', logoFile);
  }
  const docRef = await addDoc(collection(db, 'airlines'), {
    name: data.name || '',
    code: data.code || '',
    logoUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing airline */
export async function updateAirline(airlineId, data, logoFile = null) {
  let updates = { ...data, updatedAt: serverTimestamp() };
  if (logoFile) {
    updates.logoUrl = await uploadLogo('airline_logos', logoFile);
  }
  await updateDoc(doc(db, 'airlines', airlineId), updates);
}

/** Delete an airline */
export async function deleteAirline(airlineId) {
  await deleteDoc(doc(db, 'airlines', airlineId));
}


// ─────────────────────────────────────────────────────────────────────────────
// AGENT FARES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a single fare row.
 * @param {{
 *   agentId: string,
 *   sectorId: string,
 *   airlineId?: string,
 *   flightDate: Date|string,
 *   specialRate?: number,
 *   finalRate?: number,
 *   baggage?: number|string,
 *   extraBaggage?: number,
 *   commission?: number,
 *   supplierRate?: number,
 *   flightTime?: string,
 *   isHidden?: boolean
 * }} data
 */
export async function addFare(data) {
  if (!data?.agentId) throw new Error('Agent is required.');
  if (!data?.sectorId) throw new Error('Sector is required.');
  if (!data?.flightDate) throw new Error('Flight date is required.');

  const rawDate = data.flightDate instanceof Date ? data.flightDate : new Date(data.flightDate);
  if (Number.isNaN(rawDate.getTime())) throw new Error('Invalid flight date.');

  const specialRate = Number(data.specialRate) || 0;
  const finalRate = Number(data.finalRate) || 0;

  const docRef = await addDoc(collection(db, 'agent_fares'), {
    agentId: data.agentId,
    sectorId: data.sectorId,
    airlineId: data.airlineId || '',
    flightDate: Timestamp.fromDate(rawDate),
    specialRate,
    finalRate,
    baggage: data.baggage !== undefined && data.baggage !== null ? Number(data.baggage) || 0 : 0,
    extraBaggage: Number(data.extraBaggage) || 0,
    commission: data.commission !== undefined
      ? Number(data.commission) || 0
      : Math.max(0, finalRate - specialRate),
    supplierRate: Number(data.supplierRate) || 0,
    flightTime: data.flightTime || '',
    isHidden: data.isHidden === true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Fetch fares with optional filters.
 * @param {{ agentId?, sectorId?, startDate?, endDate?, includeHidden? }} filters
 */
export async function getFares(filters = {}) {
  let q = collection(db, 'agent_fares');
  const constraints = [];

  if (filters.agentId && filters.agentId !== 'all') {
    constraints.push(where('agentId', '==', filters.agentId));
  }
  if (filters.sectorId && filters.sectorId !== 'all') {
    constraints.push(where('sectorId', '==', filters.sectorId));
  }
  if (filters.startDate) {
    constraints.push(where('flightDate', '>=', Timestamp.fromDate(new Date(filters.startDate))));
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    constraints.push(where('flightDate', '<=', Timestamp.fromDate(end)));
  }
  if (!filters.includeHidden) {
    constraints.push(where('isHidden', '==', false));
  }

  constraints.push(orderBy('flightDate', 'asc'));

  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    // Convert Timestamp to JS Date for easy use
    flightDate: d.data().flightDate?.toDate?.() || d.data().flightDate,
  }));
}

/**
 * Save parsed rate portal rows as agent_fares documents.
 * Uses batched writes for efficiency.
 * @param {Array<{sector, date, airline, rate}>} parsedRows   — from quickParse()
 * @param {string} agentId
 * @param {object} sectorMap  — { 'CCJ-JED': sectorId, ... }
 * @param {object} airlineMap — { 'IX': airlineId, ... }
 */
export async function saveFares(parsedRows, agentId, sectorMap, airlineMap) {
  if (!parsedRows.length) return 0;

  const CHUNK = 400;
  let saved = 0;

  for (let i = 0; i < parsedRows.length; i += CHUNK) {
    const batch = writeBatch(db);
    parsedRows.slice(i, i + CHUNK).forEach(row => {
      const newRef = doc(collection(db, 'agent_fares'));
      const sectorId = sectorMap[row.sector] || row.sector;
      const airlineId = airlineMap[row.airline] || row.airline;
      const flightDate = Timestamp.fromDate(new Date(row.date));

      batch.set(newRef, {
        agentId,
        sectorId,
        airlineId,
        flightDate,
        specialRate: row.rate,
        finalRate: row.rate,
        baggage: '',
        extraBaggage: 0,
        commission: 0,
        supplierRate: 0,
        flightTime: '',
        isHidden: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    saved += Math.min(CHUNK, parsedRows.length - i);
  }

  return saved;
}

/** Update a single fare record */
export async function updateFare(fareId, data) {
  await updateDoc(doc(db, 'agent_fares', fareId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a single fare record */
export async function deleteFare(fareId) {
  await deleteDoc(doc(db, 'agent_fares', fareId));
}

/**
 * Sync commission across all fares for a given agent.
 * Updates both commission and finalRate (specialRate + commission).
 */
async function syncAgentFareCommission(agentId, commission) {
  if (!agentId) return 0;
  const normalizedCommission = Number(commission) || 0;
  const snap = await getDocs(query(collection(db, 'agent_fares'), where('agentId', '==', agentId)));
  if (snap.empty) return 0;

  const CHUNK = 400;
  let batch = writeBatch(db);
  let count = 0;
  let updated = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data() || {};
    const specialRate = Number(data.specialRate) || 0;
    const finalRate = Math.max(0, specialRate + normalizedCommission);
    batch.update(docSnap.ref, {
      commission: normalizedCommission,
      finalRate,
      updatedAt: serverTimestamp(),
    });
    count += 1;
    if (count >= CHUNK) {
      await batch.commit();
      updated += count;
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    updated += count;
  }

  return updated;
}


// ─────────────────────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────────────────────

export async function getServices() {
  const snap = await getDocs(collection(db, 'services'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addService(data) {
  const docRef = await addDoc(collection(db, 'services'), {
    ...data,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(serviceId, data) {
  await updateDoc(doc(db, 'services', serviceId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(serviceId) {
  await deleteDoc(doc(db, 'services', serviceId));
}


// ─────────────────────────────────────────────────────────────────────────────
// STORAGE HELPERS — Firebase Storage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload a logo file to Firebase Storage.
 * @param {string} folder  — e.g. 'airline_logos' or 'agent_logos'
 * @param {File} file
 * @returns {Promise<string>} public download URL
 */
export async function uploadLogo(folder, file) {
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

/**
 * Delete a file from Firebase Storage by its download URL.
 */
export async function deleteLogo(downloadUrl) {
  try {
    const fileRef = ref(storage, downloadUrl);
    await deleteObject(fileRef);
  } catch (e) {
    console.warn('Could not delete storage file:', e.message);
  }
}



// ─────────────────────────────────────────────────────────────────────────────
// CLOUD FUNCTION WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bulk delete fares matching any combination of optional filters.
 * At least one filter must be meaningful (non-null / non-'all').
 * @param {string|null} agentId
 * @param {string|null} startDate  — 'YYYY-MM-DD'
 * @param {string|null} endDate    — 'YYYY-MM-DD'
 * @param {string|null} sectorId
 */
export async function callBulkDeleteFares(agentId = null, startDate = null, endDate = null, sectorId = null) {
  const fn = httpsCallable(functions, 'bulkDeleteFares');
  const payload = {};
  if (agentId && agentId !== 'all') payload.agentId = agentId;
  if (sectorId && sectorId !== 'all') payload.sectorId = sectorId;
  if (startDate) payload.startDate = startDate;
  if (endDate) payload.endDate = endDate;
  const result = await fn(payload);
  return result.data;
}

/**
 * Hide or show all fares for an agent. Also updates the agent's isActive status.
 * @param {string} agentId
 * @param {boolean} isActive  — true = show, false = hide
 */
export async function callToggleAgentVisibility(agentId, isActive) {
  const fn = httpsCallable(functions, 'bulkToggleAgentVisibility');
  const result = await fn({ agentId, isActive });
  return result.data;
}

/**
 * Hide or show all fares for a sector.
 * @param {string} sectorId
 * @param {boolean} isHidden  — true = hide, false = show
 */
export async function callToggleSectorVisibility(sectorId, isHidden) {
  const fn = httpsCallable(functions, 'bulkToggleSectorVisibility');
  const result = await fn({ sectorId, isHidden });
  return result.data;
}

/**
 * Generate an aggregated agent report.
 * @param {string|null} startDate  — optional 'YYYY-MM-DD'
 * @param {string|null} endDate    — optional 'YYYY-MM-DD'
 * @param {string}      sectorId   — optional, defaults to 'all'
 * @param {string}      agentId    — optional, defaults to 'all'
 */
export async function callGenerateAgentReport(startDate = null, endDate = null, sectorId = 'all', agentId = 'all') {
  const fn = httpsCallable(functions, 'generateAgentReport');
  const payload = { sectorId, agentId };
  if (startDate) payload.startDate = startDate;
  if (endDate) payload.endDate = endDate;
  const result = await fn(payload);
  return result.data;
}
