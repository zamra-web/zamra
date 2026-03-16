#!/usr/bin/env node
/**
 * One-off cleanup script: remove the `processingTime` field from all
 * documents in the `visas` and `visa_stamping` Firestore collections.
 *
 * Usage (from the zamra/ project root):
 *   node scripts/remove-processing-time.js
 *
 * Requires: firebase-admin (already a dependency in functions/package.json)
 * Auth:     Uses Application Default Credentials — make sure you are logged in:
 *   npx firebase-tools@latest login
 *   gcloud auth application-default login   ← if that doesn't work
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'zamra-web-01';
const COLLECTIONS = ['visas', 'visa_stamping'];

// Initialise admin SDK using Application Default Credentials
if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID });
}

const db = getFirestore();

async function removeFieldFromCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`  [${collectionName}] No documents found — skipping.`);
    return;
  }

  // Process in batches of 500 (Firestore write limit per batch)
  const BATCH_SIZE = 500;
  let batch = db.batch();
  let batchCount = 0;
  let totalUpdated = 0;

  for (const doc of snapshot.docs) {
    if (!Object.prototype.hasOwnProperty.call(doc.data(), 'processingTime')) {
      continue; // Field already absent — nothing to do
    }

    batch.update(doc.ref, { processingTime: FieldValue.delete() });
    batchCount++;
    totalUpdated++;

    // Commit when batch is full
    if (batchCount === BATCH_SIZE) {
      await batch.commit();
      console.log(`  [${collectionName}] Committed batch of ${batchCount} updates...`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  // Commit any remaining writes
  if (batchCount > 0) {
    await batch.commit();
  }

  if (totalUpdated === 0) {
    console.log(`  [${collectionName}] All ${snapshot.size} documents already clean — nothing to update.`);
  } else {
    console.log(`  [${collectionName}] ✓ Removed processingTime from ${totalUpdated} / ${snapshot.size} document(s).`);
  }
}

async function main() {
  console.log(`\n🔥 Connecting to Firestore project: ${PROJECT_ID}\n`);

  for (const col of COLLECTIONS) {
    console.log(`Processing collection: ${col}`);
    await removeFieldFromCollection(col);
  }

  console.log('\n✅ Cleanup complete!\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Script failed:', err.message);
  process.exit(1);
});
