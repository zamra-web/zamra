#!/usr/bin/env node
/**
 * One-off cleanup script: delete all tours where category is Hajj/Umrah.
 *
 * Usage (from the zamra/ project root):
 *   node scripts/delete-hajj-umrah-tours.cjs          # dry run (no deletes)
 *   node scripts/delete-hajj-umrah-tours.cjs --delete # actually delete
 *
 * Auth: Uses your Firebase CLI login token.
 *   npx firebase-tools@latest login
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'zamra-web-01';
const COLLECTION = 'tours';
const PAGE_SIZE = 1000;
const DO_DELETE = process.argv.includes('--delete');

const TARGET_CATEGORIES = new Set(['hajj umrah']);

function normalizeCategory(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isHajjUmrah(category) {
  return TARGET_CATEGORIES.has(normalizeCategory(category));
}

function getAccessToken() {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Firebase CLI config not found. Please run `firebase login` first.');
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const token = config.tokens && config.tokens.access_token;
  if (!token) {
    throw new Error('Access token not found in Firebase config. Please run `firebase login` again.');
  }
  return token;
}

function request(method, url, token, body = null) {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const options = {
      method,
      hostname,
      path: pathname + search,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : null);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function listAllTours(token) {
  let pageToken;
  const docs = [];

  do {
    const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const listUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=${PAGE_SIZE}${pageParam}`;
    const listData = await request('GET', listUrl, token);
    docs.push(...(listData.documents || []));
    pageToken = listData.nextPageToken || '';
  } while (pageToken);

  return docs;
}

async function deleteTours(token, targets) {
  for (const doc of targets) {
    const docUrl = `https://firestore.googleapis.com/v1/${doc.name}`;
    await request('DELETE', docUrl, token);
    const docId = doc.name.split('/').pop();
    console.log(`  - Deleted: ${docId}`);
  }
}

async function main() {
  try {
    const token = getAccessToken();
    console.log(`\n🔥 Connecting to Firestore project: ${PROJECT_ID}`);
    console.log(`Collection: ${COLLECTION}`);
    console.log(DO_DELETE ? 'Mode: DELETE (will remove documents)\n' : 'Mode: DRY RUN (no deletes)\n');

    const docs = await listAllTours(token);
    if (!docs.length) {
      console.log('No tour documents found.');
      process.exit(0);
    }

    const targets = docs.filter(doc => {
      const category = doc.fields?.category?.stringValue || '';
      return isHajjUmrah(category);
    });

    if (!targets.length) {
      console.log('No Hajj/Umrah tours found — nothing to delete.\n');
      process.exit(0);
    }

    console.log(`Found ${targets.length} Hajj/Umrah tour(s):`);
    targets.forEach(doc => {
      const docId = doc.name.split('/').pop();
      const title = doc.fields?.title?.stringValue || 'Untitled';
      const category = doc.fields?.category?.stringValue || '—';
      console.log(`  • ${docId} — ${title} (${category})`);
    });

    if (!DO_DELETE) {
      console.log('\nDry run complete. Re-run with `--delete` to remove these documents.\n');
      process.exit(0);
    }

    console.log('\nDeleting...\n');
    await deleteTours(token, targets);
    console.log('\n✅ Cleanup complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Script failed:', err.message);
    if (err.message.includes('HTTP 401')) {
      console.error('   Your Firebase token may be expired. Run `npx firebase-tools@latest login --reauth` and try again.');
    }
    process.exit(1);
  }
}

main();
