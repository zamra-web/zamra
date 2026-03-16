#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Set admin custom claim for a Firebase Auth user by email or UID.
 *
 * Required env:
 *   SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS
 *
 * Usage:
 *   node scripts/set-admin-claim.cjs --email you@example.com
 *   node scripts/set-admin-claim.cjs --uid USER_UID
 */

const fs = require('fs');
const path = require('path');
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

const args = process.argv.slice(2);
let email = null;
let uid = null;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--email') email = args[i + 1];
  if (args[i] === '--uid') uid = args[i + 1];
}

if (!email && !uid) {
  console.error('Provide --email or --uid.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedServicePath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

async function main() {
  const auth = admin.auth();
  let targetUid = uid;

  if (!targetUid) {
    const user = await auth.getUserByEmail(email);
    targetUid = user.uid;
  }

  await auth.setCustomUserClaims(targetUid, { admin: true });
  console.log(`✅ Set admin claim for ${email || targetUid}`);
  console.log('Note: user must sign out/in (or refresh token) for claim to take effect.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
