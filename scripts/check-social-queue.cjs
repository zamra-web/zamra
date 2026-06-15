const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  initializeApp({ credential: cert(require(serviceAccountPath)) });
} catch (e) {
  console.error('Failed to init Firebase. Set SERVICE_ACCOUNT_PATH env var.', e.message);
  process.exit(1);
}

const db = getFirestore();

(async () => {
  // Check social_queue docs
  console.log('=== social_queue docs ===');
  const queueSnap = await db.collection('social_queue').orderBy('createdAt', 'desc').limit(10).get();
  console.log(`Found ${queueSnap.size} queue docs`);
  queueSnap.forEach(doc => {
    const d = doc.data();
    console.log(`\nQueue ID: ${doc.id}`);
    console.log(`  marketKey: "${d.marketKey}"`);
    console.log(`  status: "${d.status}"`);
    console.log(`  stage: "${d.stage}"`);
    console.log(`  mediaType: "${d.mediaType}"`);
    console.log(`  sectorId: "${d.sectorId}"`);
    console.log(`  sectorCode: "${d.sectorCode}"`);
    console.log(`  label: "${d.label}"`);
    console.log(`  lastMessage: "${d.lastMessage}"`);
    console.log(`  lastError: ${JSON.stringify(d.lastError)}`);
    console.log(`  attemptCount: ${d.attemptCount}`);
    console.log(`  mediaUrls count: ${(d.mediaUrls || []).length}`);
    console.log(`  platforms: ${JSON.stringify(d.platforms)}`);
  });

  // Check social_jobs
  console.log('\n=== social_jobs docs ===');
  const jobSnap = await db.collection('social_jobs').orderBy('createdAt', 'desc').limit(5).get();
  console.log(`Found ${jobSnap.size} jobs`);
  for (const jobDoc of jobSnap.docs) {
    const j = jobDoc.data();
    console.log(`\nJob ID: ${jobDoc.id}`);
    console.log(`  marketKey: "${j.marketKey}"`);
    console.log(`  status: "${j.status}"`);
    console.log(`  mediaType: "${j.mediaType}"`);
    console.log(`  plannedItems: ${j.plannedItems}, createdItems: ${j.createdItems}, postedItems: ${j.postedItems}`);
    console.log(`  lastMessage: "${j.lastMessage}"`);

    const itemsSnap = await jobDoc.ref.collection('items').get();
    console.log(`  Items: ${itemsSnap.size}`);
    itemsSnap.forEach(itemDoc => {
      const item = itemDoc.data();
      console.log(`    Item ${itemDoc.id}: marketKey="${item.marketKey}" status="${item.status}" stage="${item.stage}" label="${item.label}"`);
      console.log(`      lastMessage: "${item.lastMessage}"`);
      console.log(`      lastError: ${JSON.stringify(item.lastError)}`);
    });
  }

  // Check config/socialPublishing
  console.log('\n=== config/socialPublishing ===');
  const configSnap = await db.doc('config/socialPublishing').get();
  if (configSnap.exists) {
    const c = configSnap.data();
    console.log('Markets:');
    const markets = c.markets || {};
    Object.entries(markets).forEach(([key, market]) => {
      console.log(`  ${key}: status=${market.status}, message="${market.message}"`);
      const channels = market.channels || {};
      Object.entries(channels).forEach(([platform, ch]) => {
        console.log(`    ${platform}: id="${String(ch.id || '').slice(0,20)}..." source="${ch.source}" status="${ch.status}"`);
      });
    });
  } else {
    console.log('  config/socialPublishing does not exist!');
  }

  // Check config/buffer
  console.log('\n=== config/buffer ===');
  const bufferSnap = await db.doc('config/buffer').get();
  if (bufferSnap.exists) {
    console.log(JSON.stringify(bufferSnap.data(), null, 2));
  } else {
    console.log('  config/buffer does not exist');
  }
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
