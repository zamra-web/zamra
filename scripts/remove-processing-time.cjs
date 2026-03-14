#!/usr/bin/env node
/**
 * One-off cleanup script: remove the `processingTime` field from all
 * documents in the `visas` and `visa_stamping` Firestore collections.
 * 
 * Uses the Firestore REST API and your existing Firebase CLI login token.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = 'zamra-web';
const COLLECTIONS = ['visas', 'visa_stamping'];

// Get the access token from the Firebase CLI config
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

// Minimal wrapper for HTTPS requests
function request(method, url, token, body = null) {
  return new Promise((resolve, reject) => {
    const { protocol, hostname, pathname, search } = new URL(url);
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
          // If token expired, error will reflect it
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

async function removeProcessingTime(collectionName, token) {
  console.log(`\nFetching documents from collection: ${collectionName}...`);
  
  // 1. Fetch all documents in the collection
  const listUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}?pageSize=1000`;
  const listData = await request('GET', listUrl, token);
  
  const docs = listData.documents || [];
  if (docs.length === 0) {
    console.log(`  [${collectionName}] No documents found — skipping.`);
    return;
  }

  let totalUpdated = 0;

  // 2. Iterate and check for processingTime
  for (const doc of docs) {
    if (doc.fields && doc.fields.processingTime) {
      // 3. Delete the processingTime field using the updateMask
      // By specifying processingTime in the mask but NOT in the body, it gets deleted.
      const docUrl = `https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=processingTime`;
      
      // Empty fields object means "set everything in the mask to null/deleted"
      await request('PATCH', docUrl, token, { fields: {} });
      
      const docId = doc.name.split('/').pop();
      console.log(`  - Cleaned doc: ${docId}`);
      totalUpdated++;
    }
  }

  if (totalUpdated === 0) {
    console.log(`  [${collectionName}] All ${docs.length} document(s) already clean.`);
  } else {
    console.log(`  [${collectionName}] ✓ Removed processingTime from ${totalUpdated} / ${docs.length} document(s).`);
  }
}

async function main() {
  try {
    const token = getAccessToken();
    console.log(`🔥 Connecting to Firestore project: ${PROJECT_ID}`);
    
    for (const col of COLLECTIONS) {
      await removeProcessingTime(col, token);
    }
    
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
