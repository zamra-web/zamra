const admin = require('firebase-admin');

async function main() {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    const snap = await db.collection('agents').limit(1).get();
    console.log("Success! Found agents:", snap.docs.length);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
