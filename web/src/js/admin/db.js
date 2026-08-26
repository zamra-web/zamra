/**
 * db.js — Firestore & Cloud Functions service layer for Zamra Admin
 *
 * Exports clean async helpers for every CRUD operation needed by the
 * admin dashboard, plus wrappers for each Cloud Function.
 */

import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, Timestamp, serverTimestamp, writeBatch, onSnapshot, limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from './firebase-config.js';
import { getEnquirySectorIds } from '../shared/enquiry-alerts.js';
import { normalizeAgentWhatsapp, normalizeAgentGroupId, normalizeSenderId, parseAddressList } from './whatsapp.js';

const SOCIAL_RETENTION_MS = 72 * 60 * 60 * 1000;

function normalizeSectorSortOrder(value) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  return numeric;
}

function compareLegacySectorOrder(a, b) {
  const na = parseInt(a.id, 10);
  const nb = parseInt(b.id, 10);
  if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;

  const sectorCompare = String(a.sectorCode || '').localeCompare(String(b.sectorCode || ''), undefined, {
    sensitivity: 'base',
  });
  if (sectorCompare !== 0) return sectorCompare;

  return String(a.id || '').localeCompare(String(b.id || ''), undefined, {
    sensitivity: 'base',
  });
}

function resolveSectorDisplayOrder(sectors = []) {
  const ordered = [...sectors].sort((a, b) => {
    const sa = normalizeSectorSortOrder(a.sortOrder);
    const sb = normalizeSectorSortOrder(b.sortOrder);

    if (sa !== null && sb !== null && sa !== sb) return sa - sb;
    if (sa !== null && sb === null) return -1;
    if (sa === null && sb !== null) return 1;

    return compareLegacySectorOrder(a, b);
  });

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


// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reject a WhatsApp number already linked to a different supplier.
 *
 * agents.whatsappChatId is the join key rate intake matches inbound messages
 * on. Two suppliers sharing one number would attribute a sheet to whichever
 * document Firestore returned first, stamping the wrong commission onto real
 * selling prices. The Cloud Function refuses an ambiguous number outright, so
 * a collision would silently switch intake off for both — better to refuse it
 * here, where someone is looking at the form.
 */
async function assertWhatsappChatIdFree(chatId, ownAgentId) {
  if (!chatId) return;
  const clash = await getDocs(query(collection(db, 'agents'), where('whatsappChatId', '==', chatId)));
  const other = clash.docs.find(d => d.id !== ownAgentId);
  if (other) {
    throw new Error(`That WhatsApp number is already linked to agent ${other.id} (${other.data().name || 'unnamed'}).`);
  }
}

/**
 * Reject an announcement group already linked to a different supplier.
 *
 * Same reasoning as assertWhatsappChatIdFree, and the same server-side
 * consequence: refreshSupplierCache drops a group claimed by two agents
 * entirely rather than guessing, so an unchecked collision switches intake off
 * for both suppliers with nothing in the UI to explain it.
 */
async function assertGroupIdsFree(groupIds, ownAgentId) {
  for (const groupId of groupIds || []) {
    const clash = await getDocs(query(
      collection(db, 'agents'), where('rateIntakeGroupIds', 'array-contains', groupId),
    ));
    const other = clash.docs.find(d => d.id !== ownAgentId);
    if (other) {
      throw new Error(`That WhatsApp group is already linked to agent ${other.id} (${other.data().name || 'unnamed'}).`);
    }
  }
}

/**
 * Tell the webhook its supplier cache is stale.
 *
 * The Cloud Function caches the group allow-list for five minutes, and a group
 * that is not on it is not mirrored at all — so without this stamp a sheet
 * posted in the minutes after linking would never reach Firestore, not merely
 * arrive late. The webhook reads config/whatsapp on every event, so this costs
 * one write here and no reads there.
 */
async function stampRateIntakeGroups() {
  try {
    await setDoc(doc(db, 'config', 'whatsapp'), {
      rateIntakeGroupsUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    // Non-fatal: the agent WAS saved, and the cache expires on its own within
    // five minutes. Failing the save here would be the worse outcome.
    console.warn('Could not stamp rateIntakeGroupsUpdatedAt; the link takes effect within 5 minutes.', err);
  }
}

/**
 * Normalise the WhatsApp intake fields out of an agent form payload.
 * Returns only the keys that should be written, so an untouched form does not
 * clobber a number saved earlier.
 */
function agentWhatsappFields(data) {
  const fields = {};
  if (data.whatsappNumber !== undefined) {
    const raw = String(data.whatsappNumber || '').trim();
    const chatId = raw ? normalizeAgentWhatsapp(raw) : null;
    if (raw && !chatId) throw new Error(`"${raw}" is not a WhatsApp number this can dial.`);
    fields.whatsappNumber = raw;
    fields.whatsappChatId = chatId;
  }
  if (data.rateIntakeMode !== undefined) {
    fields.rateIntakeMode = ['auto', 'images_only', 'off'].includes(data.rateIntakeMode)
      ? data.rateIntakeMode : 'off';
  }
  if (data.rateIntakeGroupIds !== undefined) {
    const { ids, rejected } = parseAddressList(data.rateIntakeGroupIds, normalizeAgentGroupId);
    if (rejected.length) {
      throw new Error(`Not a WhatsApp group id: ${rejected.join(', ')}. A group id ends in @g.us.`);
    }
    fields.rateIntakeGroupIds = ids;
  }
  if (data.rateIntakeSenderIds !== undefined) {
    const { ids, rejected } = parseAddressList(data.rateIntakeSenderIds, normalizeSenderId);
    if (rejected.length) {
      throw new Error(`Not a WhatsApp address: ${rejected.join(', ')}. Use a number, or the @lid shown on a skipped message.`);
    }
    fields.rateIntakeSenderIds = ids;
  }
  return fields;
}

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
  const whatsapp = agentWhatsappFields(data);
  await assertWhatsappChatIdFree(whatsapp.whatsappChatId, data.id);
  await assertGroupIdsFree(whatsapp.rateIntakeGroupIds, data.id);
  const docRef = doc(db, 'agents', data.id);
  await setDoc(docRef, {
    name: data.name || '',
    contactPhone: data.contactPhone || '',
    email: data.email || '',
    isActive: data.isActive !== undefined ? data.isActive : true,
    commission: data.commission !== undefined ? Number(data.commission) : 500,
    // Automatic WhatsApp rate intake is opt-in per supplier. A new agent never
    // starts ingesting just because someone filled in a phone number.
    whatsappNumber: whatsapp.whatsappNumber || '',
    whatsappChatId: whatsapp.whatsappChatId || null,
    rateIntakeMode: whatsapp.rateIntakeMode || 'off',
    // Announcement groups this supplier posts rate sheets into, and the
    // addresses they are verified to post from. Both empty by default: a group
    // link is worthless without an approved sender, and vice versa.
    rateIntakeGroupIds: whatsapp.rateIntakeGroupIds || [],
    rateIntakeSenderIds: whatsapp.rateIntakeSenderIds || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  if (whatsapp.rateIntakeGroupIds?.length) await stampRateIntakeGroups();
  return data.id;
}

/** Update an existing agent */
export async function updateAgent(agentId, data) {
  const { id, ...updates } = data;
  const whatsapp = agentWhatsappFields(updates);
  await assertWhatsappChatIdFree(whatsapp.whatsappChatId, agentId);
  await assertGroupIdsFree(whatsapp.rateIntakeGroupIds, agentId);
  Object.assign(updates, whatsapp);
  const hasCommission = updates.commission !== undefined && updates.commission !== null && updates.commission !== '';
  let updatedFares = 0;
  if (hasCommission) {
    updates.commission = Number(updates.commission) || 0;
  }

  await updateDoc(doc(db, 'agents', agentId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (whatsapp.rateIntakeGroupIds !== undefined) await stampRateIntakeGroups();

  if (hasCommission) {
    try {
      const res = await callSyncAgentCommission(agentId, updates.commission);
      updatedFares = res?.updated ?? 0;
    } catch (err) {
      console.warn('bulkSyncAgentCommission failed; falling back to client sync.', err);
      updatedFares = await syncAgentFareCommission(agentId, updates.commission);
    }
  }

  return { updatedFares, commissionSynced: hasCommission };
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

/** Fetch all sectors — sorted by persisted sortOrder with legacy fallback safety */
export async function getSectors() {
  const snap = await getDocs(collection(db, 'sectors'));
  const sectors = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return resolveSectorDisplayOrder(sectors);
}

/** Add a new sector */
export async function addSector(data) {
  const sectors = await getSectors();
  const nextSortOrder = sectors.reduce((max, sector) => {
    const value = normalizeSectorSortOrder(sector.sortOrder);
    return value !== null && value > max ? value : max;
  }, 0) + 1;

  const docRef = await addDoc(collection(db, 'sectors'), {
    sectorFrom: data.sectorFrom || '',
    sectorTo: data.sectorTo || '',
    sectorCode: data.sectorCode || '',
    sortOrder: nextSortOrder,
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
// FLIGHT DETAILS (Airline + Sector Mapping)
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all flight details configurations */
export async function getFlightDetails() {
  const snap = await getDocs(collection(db, 'flight_details'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Strips a `schedules` array down to what Firestore should store: plain
 * `{ startDate, endDate, flightTime }` objects with no undefined members
 * (Firestore rejects `undefined` inside arrays).
 */
function sanitizeFlightSchedules(schedules) {
  if (!Array.isArray(schedules)) return [];
  return schedules
    .map(w => ({
      startDate: String(w?.startDate || '').trim(),
      endDate: String(w?.endDate || '').trim(),
      flightTime: String(w?.flightTime || '').trim(),
    }))
    .filter(w => w.flightTime && (w.startDate || w.endDate));
}

/** Add a new flight detail mapping */
export async function addFlightDetail(data) {
  if (!data.airlineId || !data.sectorId) throw new Error("Airline and Sector are required");
  const docId = `${data.airlineId}_${data.sectorId}`;
  const docRef = doc(db, 'flight_details', docId);
  await setDoc(docRef, {
    airlineId: data.airlineId,
    sectorId: data.sectorId,
    flightTime: data.flightTime || '',
    // Date-ranged overrides of `flightTime`; empty means "same time year-round".
    schedules: sanitizeFlightSchedules(data.schedules),
    baggage: data.baggage || '',
    extraBaggage: Number(data.extraBaggage) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docId;
}

/** Update an existing flight detail mapping */
export async function updateFlightDetail(id, data) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  if ('schedules' in payload) payload.schedules = sanitizeFlightSchedules(payload.schedules);
  await updateDoc(doc(db, 'flight_details', id), payload);
}

/** Delete a flight detail mapping */
export async function deleteFlightDetail(id) {
  await deleteDoc(doc(db, 'flight_details', id));
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
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      // Convert Timestamp to JS Date for easy use. The audit stamps matter as
      // much as flightDate now — the Database tab prints them and the
      // price-drop detection orders duplicate rows by createdAt.
      flightDate: data.flightDate?.toDate?.() || data.flightDate,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      rateChangedAt: data.rateChangedAt?.toDate?.() || data.rateChangedAt,
    };
  });
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

/**
 * Update a single fare record.
 *
 * Pass `opts.previousFinalRate` (the rate the row held before this edit) to
 * record the change on the document. The Database tab reads it back to badge
 * fares whose price just came down. `serverTimestamp` lives here rather than in
 * main.js so the tab controllers stay off the Firestore SDK.
 *
 * @param {string} fareId
 * @param {object} data
 * @param {{ previousFinalRate?: number }} [opts]
 */
export async function updateFare(fareId, data, opts = {}) {
  const payload = { ...data, updatedAt: serverTimestamp() };

  const previous = Number(opts.previousFinalRate);
  const next = Number(data?.finalRate);
  if (Number.isFinite(previous) && Number.isFinite(next) && previous !== next) {
    payload.previousFinalRate = previous;
    payload.rateChangedAt = serverTimestamp();
  }

  await updateDoc(doc(db, 'agent_fares', fareId), payload);
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
// VISAS
// ─────────────────────────────────────────────────────────────────────────────

export async function getVisas() {
  const snap = await getDocs(query(collection(db, 'visas'), orderBy('countryName')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addVisa(data, flagFile = null) {
  let flagUrl = data.flagUrl || '';
  if (flagFile) {
    flagUrl = await uploadLogo('country_flags', flagFile);
  }
  const docRef = await addDoc(collection(db, 'visas'), {
    countryName: data.countryName || '',
    visaType: data.visaType || '',
    rate: Number(data.rate) || 0,
    flagUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVisa(visaId, data, flagFile = null) {
  let updates = {
    ...data,
    updatedAt: serverTimestamp()
  };
  if (updates.rate !== undefined) updates.rate = Number(updates.rate);
  delete updates.processingTime; // field removed — strip it from any update payload
  if (flagFile) {
    updates.flagUrl = await uploadLogo('country_flags', flagFile);
  }
  await updateDoc(doc(db, 'visas', visaId), updates);
}

export async function deleteVisa(visaId) {
  await deleteDoc(doc(db, 'visas', visaId));
}

// ─────────────────────────────────────────────────────────────────────────────
// VISA RATE CARDS
// ─────────────────────────────────────────────────────────────────────────────
// Structured price sheets behind the "Rates" button on the B2B portal's tourist
// visa cards. Unlike `visas` these are NOT world-readable — the rules restrict
// reads to admins and signed-in B2B agents, because they are agent pricing.

export async function getVisaRateCards() {
  const snap = await getDocs(collection(db, 'visa_rate_cards'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Payload is normalised by the caller (shared/visa-rate-cards.js). */
export async function addVisaRateCard(data) {
  const docRef = await addDoc(collection(db, 'visa_rate_cards'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVisaRateCard(id, data) {
  await updateDoc(doc(db, 'visa_rate_cards', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteVisaRateCard(id) {
  await deleteDoc(doc(db, 'visa_rate_cards', id));
}

// ─────────────────────────────────────────────────────────────────────────────
// VISA STAMPING
// ─────────────────────────────────────────────────────────────────────────────
export async function getVisaStampings() {
  const snap = await getDocs(query(collection(db, 'visa_stamping'), orderBy('country')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addVisaStamping(data, posterFile = null) {
  let posterUrl = data.posterUrl || '';
  if (posterFile) {
    posterUrl = await uploadLogo('service_posters', posterFile);
  }
  const docRef = await addDoc(collection(db, 'visa_stamping'), {
    country: data.country || '',
    description: data.description || '',
    cost: Number(data.cost) || 0,
    posterUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateVisaStamping(id, data, posterFile = null) {
  let updates = { ...data, updatedAt: serverTimestamp() };
  if (updates.cost !== undefined) updates.cost = Number(updates.cost);
  delete updates.processingTime; // field removed — strip it from any update payload
  if (posterFile) {
    updates.posterUrl = await uploadLogo('service_posters', posterFile);
  }
  await updateDoc(doc(db, 'visa_stamping', id), updates);
}

export async function deleteVisaStamping(id) {
  await deleteDoc(doc(db, 'visa_stamping', id));
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTESTATIONS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAttestations() {
  const snap = await getDocs(query(collection(db, 'attestations'), orderBy('country')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addAttestation(data, posterFile = null) {
  let posterUrl = data.posterUrl || '';
  if (posterFile) {
    posterUrl = await uploadLogo('service_posters', posterFile);
  }
  const docRef = await addDoc(collection(db, 'attestations'), {
    country: data.country || '',
    certificate: data.certificate || '',
    cost: Number(data.cost) || 0,
    posterUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAttestation(id, data, posterFile = null) {
  let updates = { ...data, updatedAt: serverTimestamp() };
  if (updates.cost !== undefined) updates.cost = Number(updates.cost);
  if (posterFile) {
    updates.posterUrl = await uploadLogo('service_posters', posterFile);
  }
  await updateDoc(doc(db, 'attestations', id), updates);
}

export async function deleteAttestation(id) {
  await deleteDoc(doc(db, 'attestations', id));
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSPORT SERVICES
// ─────────────────────────────────────────────────────────────────────────────
export async function getPassportServices() {
  const snap = await getDocs(query(collection(db, 'passport_services'), orderBy('type')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addPassportService(data) {
  const docRef = await addDoc(collection(db, 'passport_services'), {
    type: data.type || '',
    description: data.description || '',
    cost: Number(data.cost) || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePassportService(id, data) {
  let updates = { ...data, updatedAt: serverTimestamp() };
  if (updates.cost !== undefined) updates.cost = Number(updates.cost);
  await updateDoc(doc(db, 'passport_services', id), updates);
}

export async function deletePassportService(id) {
  await deleteDoc(doc(db, 'passport_services', id));
}

// ─────────────────────────────────────────────────────────────────────────────
// TOURS
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all active (isActive=true) tours — public listing */
export async function getTours({ includeInactive = false } = {}) {
  const snap = await getDocs(query(collection(db, 'tours'), orderBy('title')));
  const tours = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return includeInactive ? tours : tours.filter(t => t.isActive !== false);
}

/** Add a new tour package. Optionally upload a cover image. */
export async function addTour(data, imageFile = null) {
  let coverImageUrl = data.coverImageUrl || '';
  if (imageFile) {
    coverImageUrl = await uploadLogo('tour_images', imageFile);
  }
  const docRef = await addDoc(collection(db, 'tours'), {
    title: data.title || '',
    duration: data.duration || '',
    description: data.description || '',
    category: data.category || 'International',
    price: Number(data.price) || 0,
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
    isActive: data.isActive !== false,
    coverImageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing tour. Optionally replace the cover image. */
export async function updateTour(tourId, data, imageFile = null) {
  const updates = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  if (updates.price !== undefined) updates.price = Number(updates.price) || 0;
  if (imageFile) {
    updates.coverImageUrl = await uploadLogo('tour_images', imageFile);
  }
  await updateDoc(doc(db, 'tours', tourId), updates);
}

/** Delete a tour document */
export async function deleteTour(tourId) {
  await deleteDoc(doc(db, 'tours', tourId));
}

/** Fetch a single tour by doc ID */
export async function getTourById(tourId) {
  const docSnap = await getDoc(doc(db, 'tours', tourId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}


// ─────────────────────────────────────────────────────────────────────────────
// HAJJ & UMRAH PACKAGES
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch Hajj/Umrah packages. Pass { includeInactive: true } in admin. */
export async function getHajjUmrahPackages({ includeInactive = false } = {}) {
  const snap = await getDocs(query(collection(db, 'hajj_umrah_packages'), orderBy('departureDate')));
  const pkgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return includeInactive ? pkgs : pkgs.filter(p => p.isActive !== false);
}

/** Add a new Hajj/Umrah package. Optionally upload a cover image. */
export async function addHajjUmrahPackage(data, imageFile = null) {
  let coverImageUrl = data.coverImageUrl || '';
  if (imageFile) {
    coverImageUrl = await uploadLogo('hajj_umrah_images', imageFile);
  }
  const docRef = await addDoc(collection(db, 'hajj_umrah_packages'), {
    title: data.title || '',
    type: data.type || 'Umrah',
    departureCity: data.departureCity || '',
    airline: data.airline || '',
    departureDate: data.departureDate || '',
    days: Number(data.days) || 15,
    nights: Number(data.nights) || 14,
    price: Number(data.price) || 0,
    description: data.description || '',
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    isActive: data.isActive !== false,
    coverImageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Update an existing Hajj/Umrah package. Optionally replace the cover image. */
export async function updateHajjUmrahPackage(pkgId, data, imageFile = null) {
  const updates = { ...data, updatedAt: serverTimestamp() };
  if (updates.price !== undefined) updates.price = Number(updates.price) || 0;
  if (updates.days !== undefined) updates.days = Number(updates.days) || 15;
  if (updates.nights !== undefined) updates.nights = Number(updates.nights) || 14;
  if (imageFile) {
    updates.coverImageUrl = await uploadLogo('hajj_umrah_images', imageFile);
  }
  await updateDoc(doc(db, 'hajj_umrah_packages', pkgId), updates);
}

/** Delete a Hajj/Umrah package document */
export async function deleteHajjUmrahPackage(pkgId) {
  await deleteDoc(doc(db, 'hajj_umrah_packages', pkgId));
}


// ─────────────────────────────────────────────────────────────────────────────
// B2B AGENTS (portal customers — separate from supplier `agents`)
// Auth-touching operations (create/reset password/status/delete) go through
// Cloud Functions; profile & pricing-control edits write Firestore directly.
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all B2B agents ordered by login ID */
export async function getB2BAgents() {
  const snap = await getDocs(query(collection(db, 'b2b_agents'), orderBy('loginIdLower')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Update a B2B agent's profile / pricing controls.
 * @param {string} agentId
 * @param {{ name?, agencyName?, phone?, place?, markupOverride?: number|null,
 *           hiddenOrigins?: string[], hiddenSectorIds?: string[],
 *           routeAdjustments?: Object<string, number> }} data
 */
export async function updateB2BAgent(agentId, data) {
  await updateDoc(doc(db, 'b2b_agents', agentId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Live-subscribe to the B2B agent list.
 *
 * Presence (lastActiveAt) is written by the recordB2BAgentActivity heartbeat,
 * so the admin table only shows an accurate "Online" badge if it is watching the
 * collection rather than polling — hence a snapshot listener here.
 *
 * @param {(agents: Array<object>) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void} unsubscribe
 */
export function subscribeB2BAgents(onData, onError) {
  return onSnapshot(
    query(collection(db, 'b2b_agents'), orderBy('loginIdLower')),
    (snap) => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => { if (onError) onError(err); else console.error('B2B agents listener failed:', err); },
  );
}

/**
 * Create a B2B agent (Auth account + Firestore doc) via Cloud Function.
 * @param {object} data  profile + pricing fields; optional `password` sets a
 *   custom password instead of a generated one.
 * @returns {Promise<{agentId, loginId, email, password, isCustom, stored}>}
 */
export async function callCreateB2BAgent(data) {
  const fn = httpsCallable(functions, 'createB2BAgent');
  const result = await fn(data);
  return result.data;
}

/**
 * Set a B2B agent's password. Omit `password` to generate one.
 * @returns {Promise<{loginId, password, isCustom, stored}>}
 */
export async function callResetB2BAgentPassword(agentId, password) {
  const fn = httpsCallable(functions, 'resetB2BAgentPassword');
  const result = await fn(password ? { agentId, password } : { agentId });
  return result.data;
}

/**
 * Re-read a B2B agent's login ID and current password.
 *
 * Only resolves for passwords set since credential storage shipped — older
 * accounts come back `{ available: false, reason }` and need a reset first,
 * because Firebase Auth stores hashes and cannot return the original.
 *
 * @returns {Promise<{available: boolean, loginId, password?, reason?, updatedAt?, changedBy?}>}
 */
export async function callGetB2BAgentCredentials(agentId) {
  const fn = httpsCallable(functions, 'getB2BAgentCredentials');
  const result = await fn({ agentId });
  return result.data;
}

/** Activate/deactivate a B2B agent (disables the Auth account + revokes tokens). */
export async function callSetB2BAgentStatus(agentId, isActive) {
  const fn = httpsCallable(functions, 'setB2BAgentStatus');
  const result = await fn({ agentId, isActive });
  return result.data;
}

/** Delete a B2B agent's Auth account and Firestore doc. */
export async function callDeleteB2BAgent(agentId) {
  const fn = httpsCallable(functions, 'deleteB2BAgent');
  const result = await fn({ agentId });
  return result.data;
}

/** Read global B2B settings (config/b2b) with defaults. */
export async function getB2BConfig() {
  const snap = await getDoc(doc(db, 'config', 'b2b'));
  const data = snap.exists() ? snap.data() : {};
  return {
    defaultMarkup: data.defaultMarkup !== undefined ? Number(data.defaultMarkup) : 200,
    whatsappNumber: data.whatsappNumber || '919846606738',
    supplierDefaults: data.supplierDefaults && typeof data.supplierDefaults === 'object'
      ? data.supplierDefaults
      : {},
  };
}

/** Save global B2B settings (config/b2b). Supplier defaults save separately. */
export async function saveB2BConfig({ defaultMarkup, whatsappNumber }) {
  await setDoc(doc(db, 'config', 'b2b'), {
    defaultMarkup: Number(defaultMarkup) || 0,
    whatsappNumber: String(whatsappNumber || '').replace(/[^\d]/g, ''),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/**
 * Replace the global per-supplier rule map on config/b2b.
 *
 * Uses updateDoc, which overwrites a map field wholesale — setDoc({merge:true})
 * merges nested maps key-by-key, so removed suppliers would linger forever and
 * keep pricing fares. Falls back to setDoc the first time, before config/b2b
 * has ever been written.
 *
 * @param {Object<string, number>} supplierDefaults  supplierId → signed ₹ amount
 */
export async function saveB2BSupplierDefaults(supplierDefaults = {}) {
  const clean = {};
  for (const [supplierId, amount] of Object.entries(supplierDefaults)) {
    const num = Number(amount);
    const key = String(supplierId).trim();
    if (!key || !Number.isFinite(num) || num === 0) continue;
    clean[key] = num;
  }
  const payload = { supplierDefaults: clean, updatedAt: serverTimestamp() };
  const configRef = doc(db, 'config', 'b2b');
  try {
    await updateDoc(configRef, payload);
  } catch (err) {
    if (err.code !== 'not-found') throw err;
    await setDoc(configRef, payload, { merge: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// B2B FEATURED OFFERS
// ─────────────────────────────────────────────────────────────────────────────
// Promo cards pinned beside the welcome banner in the B2B portal. Admin-only in
// firestore.rules — agents receive them through getB2BPortalContext, so these
// helpers are the dashboard's side of the collection only.

export async function getB2BOffers() {
  const snap = await getDocs(collection(db, 'b2b_offers'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Payload is normalised by the caller (shared/b2b-offers.js). */
export async function addB2BOffer(data) {
  const docRef = await addDoc(collection(db, 'b2b_offers'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateB2BOffer(id, data) {
  await updateDoc(doc(db, 'b2b_offers', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteB2BOffer(id) {
  await deleteDoc(doc(db, 'b2b_offers', id));
}

/**
 * Rewrite `order` across every offer from the id list's position, so the rail
 * matches the admin table exactly. One batch, because a half-applied reorder
 * would leave two cards fighting for the same slot.
 *
 * @param {string[]} orderedIds  offer ids, first = leftmost card
 */
export async function saveB2BOfferOrder(orderedIds = []) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, 'b2b_offers', id), { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
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
 * Sync commission across all fares for an agent via Cloud Function.
 * @param {string} agentId
 * @param {number} commission
 */
export async function callSyncAgentCommission(agentId, commission) {
  const fn = httpsCallable(functions, 'bulkSyncAgentCommission');
  const result = await fn({ agentId, commission });
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
 * Persist a full custom sector display order.
 * Uses direct batched Firestore writes so sector reordering does not depend
 * on a separately deployed callable function.
 * @param {string[]} sectorIds
 */
export async function callReorderSectors(sectorIds = []) {
  const normalizedSectorIds = Array.isArray(sectorIds)
    ? sectorIds.map((id) => String(id || '').trim()).filter(Boolean)
    : [];

  if (!normalizedSectorIds.length) {
    throw new Error('sectorIds must be a non-empty array.');
  }

  if (new Set(normalizedSectorIds).size !== normalizedSectorIds.length) {
    throw new Error('sectorIds must contain unique values only.');
  }

  const currentSectors = await getSectors();
  const existingIds = currentSectors
    .map((sector) => String(sector.id || '').trim())
    .filter(Boolean);

  if (existingIds.length !== normalizedSectorIds.length) {
    throw new Error('The provided sector order is stale. Refresh the sector list and try again.');
  }

  const existingIdSet = new Set(existingIds);
  const requestedIdSet = new Set(normalizedSectorIds);
  const unknownIds = normalizedSectorIds.filter((id) => !existingIdSet.has(id));
  const missingIds = existingIds.filter((id) => !requestedIdSet.has(id));

  if (unknownIds.length || missingIds.length) {
    throw new Error('The provided sector order must include every current sector exactly once.');
  }

  const CHUNK = 400;

  for (let i = 0; i < normalizedSectorIds.length; i += CHUNK) {
    const batch = writeBatch(db);
    normalizedSectorIds.slice(i, i + CHUNK).forEach((id, offset) => {
      batch.update(doc(db, 'sectors', id), {
        sortOrder: i + offset + 1,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }

  return {
    success: true,
    updated: normalizedSectorIds.length,
    message: `Updated display priority for ${normalizedSectorIds.length} sector${normalizedSectorIds.length !== 1 ? 's' : ''}.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL QUEUE
// ─────────────────────────────────────────────────────────────────────────────

export async function createSocialJob(data = {}) {
  const plannedItems = Number(data.plannedItems || 0);
  const postedItems = Number(data.postedItems || 0);
  const createdItems = data.createdItems ?? Math.max(plannedItems - postedItems, 0);
  const docRef = await addDoc(collection(db, 'social_jobs'), {
    source: data.source || 'admin',
    marketKey: data.marketKey || '',
    mediaType: data.mediaType || 'image',
    filters: data.filters || {},
    requestedBy: data.requestedBy || {},
    status: data.status || 'created',
    currentStage: data.currentStage || 'rendering',
    currentItemLabel: data.currentItemLabel || '',
    lastMessage: data.lastMessage || 'Preparing social publishing job.',
    plannedItems,
    createdItems: Number(createdItems || 0),
    renderedItems: Number(data.renderedItems || 0),
    uploadedItems: Number(data.uploadedItems || 0),
    queuedItems: Number(data.queuedItems || 0),
    postedItems,
    failedItems: Number(data.failedItems || 0),
    partialItems: Number(data.partialItems || 0),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSocialJob(jobId, data = {}) {
  await setDoc(doc(db, 'social_jobs', jobId), {
    ...data,
    expiresAt: data.expiresAt || Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS)),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function createSocialJobItem(jobId, data = {}) {
  const docRef = await addDoc(collection(db, 'social_jobs', jobId, 'items'), {
    source: data.source || 'admin',
    label: data.label || data.sectorCode || '',
    sectorId: data.sectorId || '',
    sectorCode: data.sectorCode || '',
    marketKey: data.marketKey || '',
    mediaType: data.mediaType || 'image',
    ratio: data.ratio || null,
    status: data.status || 'pending',
    stage: data.stage || 'rendering',
    lastMessage: data.lastMessage || 'Preparing media.',
    lastError: data.lastError || null,
    platforms: Array.isArray(data.platforms) ? data.platforms : [],
    includeStories: data.includeStories === true,
    mediaUrl: data.mediaUrl || '',
    mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
    storyMediaUrl: data.storyMediaUrl || '',
    filename: data.filename || '',
    filenames: Array.isArray(data.filenames) ? data.filenames : [],
    caption: data.caption || '',
    youtubeTitle: data.youtubeTitle || '',
    retryOfItemId: data.retryOfItemId || '',
    queueId: data.queueId || '',
    renderedAt: data.renderedAt || null,
    uploadedAt: data.uploadedAt || null,
    expiresAt: Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS)),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSocialJobItem(jobId, itemId, data = {}) {
  await setDoc(doc(db, 'social_jobs', jobId, 'items', itemId), {
    ...data,
    expiresAt: data.expiresAt || Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS)),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function subscribeSocialPublishingConfig(callback) {
  const ref = doc(db, 'config', 'socialPublishing');
  getDoc(ref).then((snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }).catch((err) => console.error('[social] config initial fetch error:', err));
  return onSnapshot(
    ref,
    (snap) => { callback(snap.exists() ? { id: snap.id, ...snap.data() } : null); },
    (err) => console.error('[social] config listener error:', err),
  );
}

export function subscribeRecentSocialJobs(callback, maxItems = 25) {
  const q = query(collection(db, 'social_jobs'), orderBy('createdAt', 'desc'), limit(maxItems));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function subscribeSocialJobItems(jobId, callback) {
  const q = query(collection(db, 'social_jobs', jobId, 'items'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function callRefreshSocialPublishingHealth(marketKey = '') {
  const fn = httpsCallable(functions, 'refreshSocialPublishingHealth');
  const result = await fn(marketKey ? { marketKey } : {});
  return result.data;
}

export async function callRunSocialQueueNow() {
  const fn = httpsCallable(functions, 'runSocialQueueNow');
  const result = await fn({});
  return result.data;
}

export async function callRetrySocialJobItem(jobId, itemId) {
  const fn = httpsCallable(functions, 'retrySocialJobItem');
  const result = await fn({ jobId, itemId });
  return result.data;
}

/**
 * Upload a poster or video blob to Firebase Storage, then enqueue it in
 * the `social_queue` Firestore collection. The scheduled dispatcher picks it
 * up and posts it to Buffer.
 *
 * @param {Blob}   blob     — The JPEG image or MP4 video blob
 * @param {string} filename — Destination filename (e.g. 'ccj-jed-1x1-1234567890.mp4')
 * @param {{ sectorId: string, sectorCode: string, mediaType: 'image'|'video',
 *            ratio: string|null, caption: string, platforms: string[],
 *            marketKey?: string, youtubeTitle?: string }} meta
 * @returns {Promise<{ mediaUrl: string, queueId: string }>}
 */
export async function uploadAndQueueForSocial(blob, filename, meta) {
  const fileRef = ref(storage, `generated_posters/${filename}`);
  await uploadBytes(fileRef, blob, {
    contentType: blob.type || (meta.mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
  });
  const mediaUrl = await getDownloadURL(fileRef);

  const mediaType = meta.mediaType || 'image';
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS));

  const docRef = await addDoc(collection(db, 'social_queue'), {
    source: meta.source || 'admin',
    jobId: meta.jobId || '',
    jobItemId: meta.jobItemId || '',
    label: meta.label || meta.sectorCode || filename || '',
    sectorId: meta.sectorId || '',
    sectorCode: meta.sectorCode || '',
    marketKey: meta.marketKey || '',
    mediaType,
    ratio: meta.ratio || null,
    mediaUrl,
    mediaUrls: [mediaUrl],
    filename,
    caption: meta.caption || '',
    youtubeTitle: meta.youtubeTitle || '',
    status: 'pending',
    stage: 'waiting_dispatch',
    attemptCount: 0,
    nextAttemptAt: Timestamp.fromDate(new Date()),
    leaseExpiresAt: null,
    bufferPosts: {},
    lastError: null,
    lastMessage: meta.lastMessage || 'Uploaded and waiting for Buffer dispatch.',
    lastCheckedAt: null,
    processedAt: null,
    platforms: meta.platforms || ['instagram', 'facebook', 'youtube'],
    includeStories: false,
    storyMediaUrl: '',
    expiresAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { mediaUrl, queueId: docRef.id };
}


/**
 * Upload multiple image blobs and enqueue them as a single carousel post.
 * Produces ONE `social_queue` doc with `mediaUrls` (array) so the dispatcher
 * publishes a single multi-image post (Instagram/Facebook carousel).
 *
 * @param {Array<{ blob: Blob, filename: string }>} items — 1..10 images
 * @param {{ sectorId: string, sectorCode: string, caption: string,
 *            platforms: string[], marketKey?: string }} meta
 * @returns {Promise<{ mediaUrls: string[], queueId: string }>}
 */
export async function uploadAndQueueCarousel(items, meta) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('uploadAndQueueCarousel: items is empty');
  }

  const mediaUrls = [];
  const filenames = [];
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + SOCIAL_RETENTION_MS));
  for (const { blob, filename } of items) {
    const fileRef = ref(storage, `generated_posters/${filename}`);
    await uploadBytes(fileRef, blob, { contentType: blob.type || 'image/jpeg' });
    mediaUrls.push(await getDownloadURL(fileRef));
    filenames.push(filename);
  }

  const docRef = await addDoc(collection(db, 'social_queue'), {
    source: meta.source || 'admin',
    jobId: meta.jobId || '',
    jobItemId: meta.jobItemId || '',
    label: meta.label || meta.sectorCode || filenames[0] || '',
    sectorId: meta.sectorId || '',
    sectorCode: meta.sectorCode || '',
    marketKey: meta.marketKey || '',
    mediaType: 'image',
    ratio: null,
    mediaUrl: mediaUrls[0],
    mediaUrls,
    filename: filenames[0],
    filenames,
    caption: meta.caption || '',
    status: 'pending',
    stage: 'waiting_dispatch',
    attemptCount: 0,
    nextAttemptAt: Timestamp.fromDate(new Date()),
    leaseExpiresAt: null,
    bufferPosts: {},
    lastError: null,
    lastMessage: meta.lastMessage || 'Uploaded and waiting for Buffer dispatch.',
    lastCheckedAt: null,
    processedAt: null,
    platforms: meta.platforms || ['instagram', 'facebook'],
    includeStories: false,
    storyMediaUrl: '',
    expiresAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { mediaUrls, queueId: docRef.id };
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

/** Update agent rates upload timestamp */
export async function updateAgentRatesUploadedTimestamp(agentId) {
  if (!agentId) return;
  await updateDoc(doc(db, 'agents', agentId), {
    lastRatesUploadedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// ENQUIRIES
// Customer fare requests. Admin-only in firestore.rules — these documents hold
// customer names and phone numbers.
// ─────────────────────────────────────────────────────────────────────────────

function toEnquiryDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function getEnquiries() {
  const snap = await getDocs(query(collection(db, 'enquiries'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      // Normalised here so every caller can read `sectorIds` — documents written
      // before multi-sector enquiries only carry the single `sectorId`.
      sectorIds: getEnquirySectorIds(data),
      startDate: data.startDate?.toDate?.() || data.startDate,
      endDate: data.endDate?.toDate?.() || data.endDate,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    };
  });
}

function buildEnquiryPayload(data) {
  const startDate = toEnquiryDate(data.startDate);
  const endDate = toEnquiryDate(data.endDate);
  const targetFare = data.targetFare === '' || data.targetFare === null || data.targetFare === undefined
    ? null
    : Number(data.targetFare);
  const sectorIds = getEnquirySectorIds(data);

  return {
    customerName: String(data.customerName || '').trim(),
    customerPhone: String(data.customerPhone || '').trim(),
    sectorIds,
    // The legacy single-sector field is kept in step with the first route so an
    // older dashboard build still shows a valid enquiry rather than a blank one.
    sectorId: sectorIds[0] || '',
    startDate: startDate ? Timestamp.fromDate(startDate) : null,
    endDate: endDate ? Timestamp.fromDate(endDate) : null,
    targetFare: Number.isFinite(targetFare) ? targetFare : null,
    status: data.status || 'open',
    notes: String(data.notes || '').trim(),
  };
}

export async function addEnquiry(data) {
  if (!data?.customerName) throw new Error('Customer name is required.');
  if (!getEnquirySectorIds(data).length) throw new Error('At least one sector is required.');

  const docRef = await addDoc(collection(db, 'enquiries'), {
    ...buildEnquiryPayload(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEnquiry(enquiryId, data) {
  // Guarded on update too: saving an enquiry with every sector row cleared would
  // leave a record that can never match a fare again.
  if (!getEnquirySectorIds(data).length) throw new Error('At least one sector is required.');

  await updateDoc(doc(db, 'enquiries', enquiryId), {
    ...buildEnquiryPayload(data),
    updatedAt: serverTimestamp(),
  });
}

/** Flip just the workflow status without rewriting the whole enquiry. */
export async function setEnquiryStatus(enquiryId, status) {
  await updateDoc(doc(db, 'enquiries', enquiryId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEnquiry(enquiryId) {
  await deleteDoc(doc(db, 'enquiries', enquiryId));
}


// ─────────────────────────────────────────────────────────────────────────────
// DEAL LINKS
// Curated public deal pages. The document id IS the slug, so /deals/<slug>
// resolves with one getDoc and needs no index.
// ─────────────────────────────────────────────────────────────────────────────

export async function getDealLinks() {
  const snap = await getDocs(collection(db, 'deal_links'));
  return snap.docs
    .map(d => {
      const data = d.data();
      return {
        slug: d.id,
        id: d.id,
        ...data,
        startDate: data.startDate?.toDate?.() || data.startDate,
        endDate: data.endDate?.toDate?.() || data.endDate,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    })
    .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
}

/**
 * Create or update a deal link. `setDoc` with merge keeps createdAt intact on
 * an edit while letting the slug stay the document id.
 */
export async function saveDealLink(slug, data, { isNew = false } = {}) {
  if (!slug) throw new Error('A link slug is required.');

  const startDate = toEnquiryDate(data.startDate);
  const endDate = toEnquiryDate(data.endDate);

  const payload = {
    title: String(data.title || '').trim(),
    subtitle: String(data.subtitle || '').trim(),
    selectionKind: data.selectionKind === 'sectors' ? 'sectors' : 'shortcut',
    shortcutKey: String(data.shortcutKey || '').trim(),
    sectorIds: Array.isArray(data.sectorIds) ? data.sectorIds.filter(Boolean) : [],
    windowMode: data.windowMode === 'fixed' ? 'fixed' : 'rolling',
    rollingDays: Number(data.rollingDays) || 30,
    startDate: startDate ? Timestamp.fromDate(startDate) : null,
    endDate: endDate ? Timestamp.fromDate(endDate) : null,
    maxPerSector: Number(data.maxPerSector) || 0,
    isActive: data.isActive !== false,
    updatedAt: serverTimestamp(),
  };

  if (isNew) payload.createdAt = serverTimestamp();

  await setDoc(doc(db, 'deal_links', slug), payload, { merge: true });
  return slug;
}

/** True when a slug is already taken — the create form checks before writing. */
export async function dealLinkExists(slug) {
  if (!slug) return false;
  const snap = await getDoc(doc(db, 'deal_links', slug));
  return snap.exists();
}

export async function deleteDealLink(slug) {
  await deleteDoc(doc(db, 'deal_links', slug));
}


// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP (WAHA)
//
// The dashboard never talks to WAHA directly — the API key would have to ship
// in the bundle. Everything goes through admin-gated callables that project the
// response server-side. Reads come from the Firestore mirror the webhook keeps.
// ─────────────────────────────────────────────────────────────────────────────

/** Current WAHA session state, projected (never carries the session config). */
export async function callGetWhatsappSessionStatus() {
  const fn = httpsCallable(functions, 'getWhatsappSessionStatus');
  const result = await fn({});
  return result.data;
}

/** Base64 QR for linking the number. Expires — re-fetch while the modal is open. */
export async function callGetWhatsappQr() {
  const fn = httpsCallable(functions, 'getWhatsappQr');
  const result = await fn({});
  return result.data;
}

/**
 * @param {'start'|'stop'|'restart'|'logout'} action
 */
export async function callSetWhatsappSessionState(action) {
  const fn = httpsCallable(functions, 'setWhatsappSessionState');
  const result = await fn({ action });
  return result.data;
}

/**
 * Create or repair the session, including the webhook URL and HMAC key WAHA
 * must call back on. Never create the session by hand — one without a webhook
 * drops every inbound message silently.
 */
export async function callEnsureWhatsappSession() {
  const fn = httpsCallable(functions, 'ensureWhatsappSession');
  const result = await fn({});
  return result.data;
}

/**
 * @param {string} chatId — a number in any format, or a full `…@c.us` / `…@g.us` id
 * @param {string} text
 */
export async function callSendWhatsappMessage(chatId, text) {
  const fn = httpsCallable(functions, 'sendWhatsappMessage');
  const result = await fn({ chatId, text });
  return result.data;
}

/** Live session status / counters. getDoc first so the pill paints immediately. */
export function subscribeWhatsappConfig(callback) {
  const ref = doc(db, 'config', 'whatsapp');
  getDoc(ref).then((snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }).catch((err) => console.error('[whatsapp] config initial fetch error:', err));
  return onSnapshot(
    ref,
    (snap) => { callback(snap.exists() ? { id: snap.id, ...snap.data() } : null); },
    (err) => console.error('[whatsapp] config listener error:', err),
  );
}

/** Most recently active conversations. */
export function subscribeWhatsappChats(callback, maxItems = 40) {
  const q = query(collection(db, 'whatsapp_chats'), orderBy('lastMessageAt', 'desc'), limit(maxItems));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
    (err) => console.error('[whatsapp] chats listener error:', err),
  );
}

/**
 * One conversation's messages, newest first — the caller reverses for display.
 * Needs the composite index on (chatId ASC, timestamp DESC).
 */
export function subscribeWhatsappMessages(chatId, callback, maxItems = 100) {
  const q = query(
    collection(db, 'whatsapp_messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'desc'),
    limit(maxItems),
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
    (err) => console.error('[whatsapp] messages listener error:', err),
  );
}

/**
 * The most recent automated rate-intake batches.
 *
 * Read-only by rule: whatsapp_rate_batches is written only by
 * whatsappRateIntakeForN8n on the Admin SDK, because a browser able to mark a
 * batch "done" could hide an ingestion that actually failed.
 */
export function subscribeWhatsappRateBatches(callback, maxItems = 20) {
  const q = query(collection(db, 'whatsapp_rate_batches'), orderBy('claimedAt', 'desc'), limit(maxItems));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
    (err) => console.error('[whatsapp] rate batch listener error:', err),
  );
}

/**
 * Change the rate-intake settings on config/whatsapp.
 *
 * Filtered to the intake keys so a stray field cannot overwrite sessionStatus
 * or the mirror's own bookkeeping, which live on the same document.
 */
export async function setWhatsappRateIntakeConfig(patch = {}) {
  const allowed = [
    'rateIntakeEnabled', 'rateIntakeAutoReply', 'rateIntakeQuietSeconds',
    'rateIntakeMaxHoldMinutes', 'rateIntakeMaxItems', 'rateIntakeLeaseMinutes',
    'rateIntakeMaxBatchesPerChatPerDay',
  ];
  const update = { updatedAt: serverTimestamp() };
  for (const key of allowed) {
    if (patch[key] !== undefined) update[key] = patch[key];
  }
  await setDoc(doc(db, 'config', 'whatsapp'), update, { merge: true });
}

/**
 * Undo one automated upload.
 *
 * Every row ingestFaresFromN8n writes carries the batch id that produced it, so
 * this deletes exactly the fares one WhatsApp sheet created. It is the guard
 * for the failure mode nobody else catches: the vision step misreads 15500 as
 * 16500, every validator passes, and — on this path — no human clicked Submit.
 *
 * @param {string} ingestBatchId
 */
export async function callDeleteFaresByIngestBatch(ingestBatchId) {
  const fn = httpsCallable(functions, 'bulkDeleteFares');
  const res = await fn({ ingestBatchId });
  return res.data;
}

/**
 * Update a conversation's triage state.
 *
 * Restricted to the five keys firestore.rules allows the client to touch —
 * everything else on the doc is written by the mirror. Sending anything outside
 * this set fails the rule and rejects the whole write, so it is filtered here
 * rather than trusted from the caller.
 *
 * @param {string} chatId
 * @param {{unreadCount?: number, assignedTo?: string|null, status?: string, tags?: string[]}} patch
 */
export async function updateWhatsappChatMeta(chatId, patch = {}) {
  const allowed = ['unreadCount', 'assignedTo', 'status', 'tags'];
  const update = { updatedAt: serverTimestamp() };
  for (const key of allowed) {
    if (patch[key] !== undefined) update[key] = patch[key];
  }
  await updateDoc(doc(db, 'whatsapp_chats', chatId), update);
}
