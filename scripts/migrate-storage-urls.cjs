#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Bulk migrate Firestore image URLs from the old Firebase Storage bucket to the new bucket.
 *
 * - Downloads each old file via its download URL (tokened).
 * - Uploads to the new bucket at the same object path.
 * - Generates a new download URL and updates Firestore docs.
 *
 * Required env:
 *   SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS (path to new project service account JSON)
 *
 * Optional env:
 *   OLD_BUCKET   (default: zamra-web.firebasestorage.app)
 *   NEW_BUCKET   (default: zamra-web-01.firebasestorage.app)
 *   DRY_RUN=1    (log only, no writes)
 *   LIMIT=100    (max docs per collection, for testing)
 */

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const admin = require('firebase-admin');

const serviceAccountPath =
  process.env.SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error('Missing SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS.');
  process.exit(1);
}

const resolvedServicePath = path.resolve(serviceAccountPath);
if (!fs.existsSync(resolvedServicePath)) {
  console.error(`Service account JSON not found at: ${resolvedServicePath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedServicePath, 'utf8'));
const OLD_BUCKET = process.env.OLD_BUCKET || 'zamra-web.firebasestorage.app';
const NEW_BUCKET = process.env.NEW_BUCKET || 'zamra-web-01.firebasestorage.app';
const DRY_RUN = process.env.DRY_RUN === '1';
const LIMIT = Number(process.env.LIMIT || 0) || null;

if (OLD_BUCKET === NEW_BUCKET) {
  console.error('OLD_BUCKET and NEW_BUCKET are the same. Nothing to migrate.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
  storageBucket: NEW_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket(NEW_BUCKET);

const COLLECTIONS = [
  { name: 'airlines', fields: ['logoUrl'] },
  { name: 'agents', fields: ['logoUrl'] },
  { name: 'visas', fields: ['flagUrl'] },
  { name: 'tours', fields: ['coverImageUrl'] },
  { name: 'hajj_umrah_packages', fields: ['coverImageUrl'] },
];

function parseStorageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(
    /^https?:\/\/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)(\?.*)?$/
  );
  if (!match) return null;
  return {
    bucket: match[1],
    objectPath: decodeURIComponent(match[2]),
  };
}

function buildDownloadUrl(bucketName, objectPath, token) {
  const encodedPath = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
}

async function ensureDownloadUrl(objectPath, sourceUrl) {
  const cacheKey = objectPath;
  if (ensureDownloadUrl.cache.has(cacheKey)) {
    return ensureDownloadUrl.cache.get(cacheKey);
  }

  const file = bucket.file(objectPath);
  const [exists] = await file.exists();
  let token;

  if (!exists) {
    const res = await fetch(sourceUrl);
    if (!res.ok) {
      throw new Error(`Fetch failed (${res.status}) for ${sourceUrl}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    token = randomUUID();

    if (!DRY_RUN) {
      await file.save(buffer, {
        contentType,
        resumable: false,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });
    }
  } else {
    if (!DRY_RUN) {
      const [meta] = await file.getMetadata();
      const customMeta = meta.metadata || {};
      token = (customMeta.firebaseStorageDownloadTokens || '').split(',')[0];
      if (!token) {
        token = randomUUID();
        customMeta.firebaseStorageDownloadTokens = token;
        await file.setMetadata({ metadata: customMeta });
      }
    } else {
      token = 'dry-run-token';
    }
  }

  const newUrl = buildDownloadUrl(NEW_BUCKET, objectPath, token);
  ensureDownloadUrl.cache.set(cacheKey, newUrl);
  return newUrl;
}
ensureDownloadUrl.cache = new Map();

async function migrateCollection(collection) {
  console.log(`\n→ ${collection.name}`);
  let query = db.collection(collection.name);
  if (LIMIT) query = query.limit(LIMIT);
  const snap = await query.get();

  let updated = 0;
  let scanned = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of snap.docs) {
    scanned += 1;
    const data = doc.data() || {};
    const updates = {};

    for (const field of collection.fields) {
      const url = data[field];
      const parsed = parseStorageUrl(url);
      if (!parsed || parsed.bucket !== OLD_BUCKET) {
        skipped += 1;
        continue;
      }

      try {
        const newUrl = await ensureDownloadUrl(parsed.objectPath, url);
        if (newUrl && newUrl !== url) {
          updates[field] = newUrl;
        }
      } catch (err) {
        failed += 1;
        console.warn(`  ! ${doc.id}.${field}: ${err.message}`);
      }
    }

    if (Object.keys(updates).length > 0) {
      updated += 1;
      if (!DRY_RUN) {
        await doc.ref.update(updates);
      }
      console.log(`  ✓ ${doc.id}: ${Object.keys(updates).join(', ')}`);
    }
  }

  console.log(
    `  scanned=${scanned} updated=${updated} skipped=${skipped} failed=${failed}`
  );
}

async function main() {
  console.log('Starting Storage URL migration...');
  console.log(`OLD_BUCKET: ${OLD_BUCKET}`);
  console.log(`NEW_BUCKET: ${NEW_BUCKET}`);
  console.log(`DRY_RUN: ${DRY_RUN ? 'yes' : 'no'}`);
  if (LIMIT) console.log(`LIMIT: ${LIMIT}`);

  for (const collection of COLLECTIONS) {
    await migrateCollection(collection);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
