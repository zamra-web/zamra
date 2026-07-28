package com.zamratravels.portal;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.webkit.MimeTypeMap;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Locale;

/**
 * A single "save this blob to the Downloads folder" operation, written incrementally.
 *
 * The web app builds files in memory (jsPDF, html2canvas, CSV blobs, recorded video) and hands
 * them to us base64-encoded in chunks, so a 40 MB video export never has to exist as one giant
 * Java string. Chunks are streamed straight to the destination as they arrive.
 *
 * On API 29+ the file is created through MediaStore as a pending entry and only published once
 * every chunk landed, so a failed export never leaves a truncated file in the user's Downloads.
 */
final class SaveSession {

    private final Context context;
    private final String displayName;
    private final String mimeType;

    private OutputStream out;
    private Uri mediaUri;      // API 29+
    private File legacyFile;   // API 23-28
    private long bytesWritten;
    private boolean closed;

    SaveSession(Context context, String requestedName, String requestedMime) throws IOException {
        this.context = context.getApplicationContext();
        this.mimeType = normaliseMime(requestedMime, requestedName);
        this.displayName = sanitiseName(requestedName, this.mimeType);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            openViaMediaStore();
        } else {
            openViaPublicDirectory();
        }
    }

    private void openViaMediaStore() throws IOException {
        ContentResolver resolver = context.getContentResolver();
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, displayName);
        values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
        values.put(MediaStore.Downloads.IS_PENDING, 1);

        // MediaStore de-duplicates display names for us (report.pdf -> report (1).pdf).
        mediaUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
        if (mediaUri == null) {
            throw new IOException("MediaStore refused to create " + displayName);
        }
        out = resolver.openOutputStream(mediaUri);
        if (out == null) {
            resolver.delete(mediaUri, null, null);
            mediaUri = null;
            throw new IOException("Could not open a stream for " + displayName);
        }
    }

    private void openViaPublicDirectory() throws IOException {
        File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Downloads directory is unavailable");
        }
        legacyFile = uniqueFile(dir, displayName);
        out = new FileOutputStream(legacyFile);
    }

    void write(byte[] data) throws IOException {
        if (closed) throw new IOException("Session already finished");
        out.write(data);
        bytesWritten += data.length;
    }

    long bytesWritten() {
        return bytesWritten;
    }

    String displayName() {
        return displayName;
    }

    String mimeType() {
        return mimeType;
    }

    /** Publishes the file and returns a URI other apps can open, or null if that isn't possible. */
    Uri finish() throws IOException {
        if (closed) return viewUri();
        closed = true;

        out.flush();
        out.close();
        out = null;

        if (mediaUri != null) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            context.getContentResolver().update(mediaUri, values, null, null);
        } else if (legacyFile != null) {
            // Make the file visible to the Files app / MTP without a reboot.
            MediaScannerConnection.scanFile(
                context,
                new String[] { legacyFile.getAbsolutePath() },
                new String[] { mimeType },
                null
            );
        }
        return viewUri();
    }

    private Uri viewUri() {
        if (mediaUri != null) return mediaUri;
        if (legacyFile == null) return null;
        try {
            return FileProvider.getUriForFile(
                context,
                context.getPackageName() + ".fileprovider",
                legacyFile
            );
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /** Aborts the save and removes any partial file. */
    void cancel() {
        if (closed) return;
        closed = true;
        try {
            if (out != null) out.close();
        } catch (IOException ignored) {
            // Nothing useful to do — we're discarding the file anyway.
        }
        out = null;

        if (mediaUri != null) {
            context.getContentResolver().delete(mediaUri, null, null);
            mediaUri = null;
        } else if (legacyFile != null && legacyFile.exists()) {
            //noinspection ResultOfMethodCallIgnored
            legacyFile.delete();
            legacyFile = null;
        }
    }

    // ---- naming helpers -------------------------------------------------------------------

    /**
     * Strips path separators and control characters so a filename coming from the web layer can
     * never escape the Downloads directory, and makes sure there is a usable extension.
     */
    private static String sanitiseName(String requested, String mimeType) {
        String name = requested == null ? "" : requested.trim();

        // Keep only the last path segment, then remove anything illegal on FAT/ext4.
        int slash = Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\'));
        if (slash >= 0) name = name.substring(slash + 1);
        name = name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        while (name.startsWith(".")) name = name.substring(1);

        if (name.isEmpty()) name = "zamra-download";
        if (name.length() > 120) name = name.substring(0, 120);

        if (!name.contains(".")) {
            String ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType);
            if (ext != null && !ext.isEmpty()) name = name + "." + ext;
        }
        return name;
    }

    private static String normaliseMime(String requested, String filename) {
        if (requested != null && !requested.trim().isEmpty() && requested.contains("/")) {
            // Blob types can carry parameters, e.g. "text/csv;charset=utf-8".
            return requested.split(";")[0].trim().toLowerCase(Locale.US);
        }
        if (filename != null) {
            int dot = filename.lastIndexOf('.');
            if (dot >= 0 && dot < filename.length() - 1) {
                String guessed = MimeTypeMap.getSingleton()
                    .getMimeTypeFromExtension(filename.substring(dot + 1).toLowerCase(Locale.US));
                if (guessed != null) return guessed;
            }
        }
        return "application/octet-stream";
    }

    private static File uniqueFile(File dir, String name) {
        File candidate = new File(dir, name);
        if (!candidate.exists()) return candidate;

        int dot = name.lastIndexOf('.');
        String stem = dot > 0 ? name.substring(0, dot) : name;
        String ext = dot > 0 ? name.substring(dot) : "";

        for (int i = 1; i < 1000; i++) {
            candidate = new File(dir, stem + " (" + i + ")" + ext);
            if (!candidate.exists()) return candidate;
        }
        return new File(dir, stem + "-" + System.currentTimeMillis() + ext);
    }
}
