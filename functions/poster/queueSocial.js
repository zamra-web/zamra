/**
 * Server-side port of web/src/js/admin/db.js `uploadAndQueueForSocial`.
 * Uploads a JPEG buffer to Firebase Storage and writes a `social_queue` doc.
 * The shared scheduled dispatcher picks it up from there.
 */

const { getStorage } = require("firebase-admin/storage");
const { enqueueExistingMedia } = require("../social/pipeline");

/**
 * @param {Buffer} jpegBuffer
 * @param {string} filename  e.g. "daily-ccj-jed-1x1-1729834200000.jpg"
 * @param {{ sectorId: string, sectorCode: string, ratio: string,
 *            caption: string, platforms: string[],
 *            marketKey?: string, youtubeTitle?: string }} meta
 * @returns {Promise<{ mediaUrl: string, queueId: string }>}
 */
async function uploadAndQueue(jpegBuffer, filename, meta) {
  const bucket = getStorage().bucket();
  const path = `generated_posters/${filename}`;
  const file = bucket.file(path);

  // Firebase Storage download tokens match the client SDK's getDownloadURL format.
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await file.save(jpegBuffer, {
    contentType: "image/jpeg",
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    resumable: false,
  });

  const mediaUrl =
    `https://firebasestorage.googleapis.com/v0/b/${bucket.name}` +
    `/o/${encodeURIComponent(path)}?alt=media&token=${token}`;

  const { queueId } = await enqueueExistingMedia({
    source: meta.source || "autoPostDaily",
    jobId: meta.jobId || "",
    jobItemId: meta.jobItemId || "",
    sectorId: meta.sectorId || "",
    sectorCode: meta.sectorCode || "",
    marketKey: meta.marketKey || "",
    mediaType: "image",
    ratio: meta.ratio || "4x5",
    mediaUrl,
    mediaUrls: [mediaUrl],
    filename,
    filenames: [filename],
    caption: meta.caption || "",
    youtubeTitle: meta.youtubeTitle || "",
    platforms: meta.platforms && meta.platforms.length
      ? meta.platforms
      : ["instagram", "facebook"],
    lastMessage: "Uploaded and waiting for Buffer dispatch.",
  });

  return { mediaUrl, queueId };
}

module.exports = { uploadAndQueue };
