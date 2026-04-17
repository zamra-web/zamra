/**
 * Fetches airline logos over HTTP and returns them as base64 data URIs,
 * so Puppeteer can render them without extra network requests or CORS.
 */

async function fetchAsDataUri(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") || "image/png";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * @param {string[]} airlineIds
 * @returns {Promise<{ airlineMap: Record<string, object>, logoMap: Record<string, string> }>}
 */
async function fetchLogos(airlineIds) {
  const { getFirestore } = require("firebase-admin/firestore");
  const db = getFirestore();
  const unique = [...new Set(airlineIds.filter(Boolean))];

  const airlineDocs = await Promise.all(
    unique.map((id) => db.collection("airlines").doc(id).get())
  );

  const airlineMap = {};
  const logoMap = {};
  await Promise.all(
    airlineDocs.map(async (snap) => {
      if (!snap.exists) return;
      const data = { id: snap.id, ...snap.data() };
      airlineMap[snap.id] = data;
      if (data.logoUrl) {
        const dataUri = await fetchAsDataUri(data.logoUrl);
        if (dataUri) logoMap[snap.id] = dataUri;
      }
    })
  );

  return { airlineMap, logoMap };
}

module.exports = { fetchLogos };
