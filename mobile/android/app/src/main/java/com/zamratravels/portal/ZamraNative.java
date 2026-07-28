package com.zamratravels.portal;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.Bridge;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * The {@code window.ZamraNative} object injected into the portal's pages.
 *
 * It exists because an Android WebView silently drops the two ways this codebase produces files:
 * {@code URL.createObjectURL(blob)} on an anchor with a {@code download} attribute, and
 * {@code canvas.toDataURL()} on the same. Neither reaches {@link DownloadListener}. The JS shim in
 * {@code res/raw/zamra_shim.js} catches those clicks and streams the bytes here instead.
 *
 * Every entry point is reachable by whatever page the WebView has loaded, so each one re-checks
 * that we are still on a Zamra host before touching the file system.
 */
public class ZamraNative {

    private static final String CHANNEL_ID = "zamra_downloads";
    private static final int CHUNK_LIMIT = 4 * 1024 * 1024; // generous ceiling; shim sends 512 KB
    private static final long MAX_FILE_BYTES = 512L * 1024 * 1024;

    private final Activity activity;
    private final Bridge bridge;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final Map<String, SaveSession> sessions = new ConcurrentHashMap<>();
    private final AtomicLong tokenSeq = new AtomicLong();

    private final String appHost;
    private final String userAgent;
    private volatile String currentHost;
    private volatile boolean askedForNotifications;

    ZamraNative(Activity activity, Bridge bridge) {
        this.activity = activity;
        this.bridge = bridge;
        this.appHost = hostOf(bridge.getAppUrl());
        this.currentHost = appHost;
        // WebSettings may only be touched on the UI thread, and the @JavascriptInterface methods
        // below run on a WebView worker thread — so read it once, here.
        this.userAgent = bridge.getWebView().getSettings().getUserAgentString();
        createNotificationChannel();
    }

    /** Called from the WebViewClient on the UI thread as navigation happens. */
    void setCurrentUrl(String url) {
        String host = hostOf(url);
        if (host != null) currentHost = host;
    }

    // ---- JS surface -----------------------------------------------------------------------

    /**
     * Opens a download. Returns an opaque token for the follow-up chunk calls, or an empty string
     * if the save could not be started.
     */
    @JavascriptInterface
    public String beginSave(String filename, String mimeType) {
        if (!isTrustedCaller()) return "";
        if (!ensureLegacyStorageAccess()) return "";
        requestNotificationPermissionOnce();
        try {
            SaveSession session = new SaveSession(activity, filename, mimeType);
            String token = "s" + tokenSeq.incrementAndGet();
            sessions.put(token, session);
            return token;
        } catch (IOException | SecurityException e) {
            toastOnMain("Couldn't start the download — storage is unavailable.");
            return "";
        }
    }

    /** Appends one base64-encoded slice. Returns false if the caller should stop and clean up. */
    @JavascriptInterface
    public boolean appendChunk(String token, String base64Chunk) {
        if (!isTrustedCaller()) return false;
        SaveSession session = sessions.get(token);
        if (session == null) return false;

        if (base64Chunk == null || base64Chunk.length() > CHUNK_LIMIT) {
            discard(token);
            return false;
        }
        try {
            byte[] data = Base64.decode(base64Chunk, Base64.DEFAULT);
            if (session.bytesWritten() + data.length > MAX_FILE_BYTES) {
                discard(token);
                toastOnMain("That file is too large to save.");
                return false;
            }
            session.write(data);
            return true;
        } catch (IOException | IllegalArgumentException e) {
            discard(token);
            return false;
        }
    }

    /** Publishes the finished file and tells the user where it went. */
    @JavascriptInterface
    public boolean endSave(String token) {
        if (!isTrustedCaller()) return false;
        SaveSession session = sessions.remove(token);
        if (session == null) return false;

        try {
            Uri uri = session.finish();
            announceSaved(session.displayName(), session.mimeType(), uri);
            return true;
        } catch (IOException e) {
            session.cancel();
            toastOnMain("Couldn't finish saving " + session.displayName() + ".");
            return false;
        }
    }

    @JavascriptInterface
    public void cancelSave(String token) {
        if (!isTrustedCaller()) return;
        discard(token);
    }

    /**
     * Hands an ordinary http(s) file URL to Android's DownloadManager, which streams it to disk
     * and shows the usual system download notification.
     */
    @JavascriptInterface
    public boolean downloadUrl(String url, String filename, String mimeType) {
        if (!isTrustedCaller()) return false;
        if (!URLUtil.isHttpUrl(url) && !URLUtil.isHttpsUrl(url)) return false;
        requestNotificationPermissionOnce();

        try {
            String name = URLUtil.guessFileName(url, null, mimeType);
            if (filename != null && !filename.trim().isEmpty()) {
                name = filename.trim().replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_");
            }

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle(name);
            request.setDescription("Downloading from Zamra Travels");
            if (mimeType != null && mimeType.contains("/")) {
                request.setMimeType(mimeType.split(";")[0].trim());
            }
            request.setNotificationVisibility(
                DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            );
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
            request.addRequestHeader("User-Agent", userAgent);

            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null) request.addRequestHeader("Cookie", cookie);

            DownloadManager manager =
                (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
            if (manager == null) return false;
            manager.enqueue(request);
            toastOnMain("Downloading " + name + "…");
            return true;
        } catch (IllegalStateException | SecurityException | IllegalArgumentException e) {
            toastOnMain("Couldn't start the download.");
            return false;
        }
    }

    /** Used by offline.html to retry the original portal URL rather than reloading itself. */
    @JavascriptInterface
    public void reload() {
        main.post(() -> bridge.getWebView().loadUrl(bridge.getAppUrl()));
    }

    @JavascriptInterface
    public String getStartUrl() {
        return bridge.getAppUrl();
    }

    @JavascriptInterface
    public void toast(String message) {
        if (!isTrustedCaller() || message == null || message.isEmpty()) return;
        toastOnMain(message);
    }

    // ---- the WebView's own download hook --------------------------------------------------

    /** Handles real http(s) downloads (Content-Disposition responses, Storage links). */
    DownloadListener downloadListener() {
        return (url, userAgent, contentDisposition, mimeType, contentLength) -> {
            if (url != null && url.startsWith("data:")) {
                // Small data: URLs can arrive here; the shim handles the large ones.
                toastOnMain("Preparing download…");
                return;
            }
            String name = URLUtil.guessFileName(url, contentDisposition, mimeType);
            downloadUrl(url, name, mimeType);
        };
    }

    // ---- internals ------------------------------------------------------------------------

    private void discard(String token) {
        SaveSession session = sessions.remove(token);
        if (session != null) session.cancel();
    }

    /**
     * The JS interface is attached to the WebView, not to an origin, so a page we did not write
     * could in principle call it. Navigation is already restricted to Zamra hosts, and this is the
     * second lock on that door.
     */
    private boolean isTrustedCaller() {
        String host = currentHost;
        if (host == null || appHost == null) return false;
        if (host.equalsIgnoreCase(appHost)) return true;
        // Tolerate the apex/www pair, which Vercel serves interchangeably.
        return host.equalsIgnoreCase("www." + appHost) || appHost.equalsIgnoreCase("www." + host);
    }

    private static String hostOf(String url) {
        if (url == null) return null;
        try {
            return URI.create(url).getHost();
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private void toastOnMain(String message) {
        main.post(() -> Toast.makeText(activity, message, Toast.LENGTH_SHORT).show());
    }

    private void announceSaved(String name, String mimeType, Uri uri) {
        toastOnMain("Saved to Downloads: " + name);
        main.post(() -> postNotification(name, mimeType, uri));
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = activity.getSystemService(NotificationManager.class);
        if (manager == null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Downloads",
            NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Files exported from the portal");
        manager.createNotificationChannel(channel);
    }

    /**
     * Before API 29, writing into the public Downloads folder needs an explicit grant. The
     * permission dialog is asynchronous and beginSave has to answer immediately, so we ask now and
     * let the user repeat the export once they've allowed it.
     */
    private boolean ensureLegacyStorageAccess() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) return true;
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE)
            == PackageManager.PERMISSION_GRANTED) {
            return true;
        }
        main.post(() -> ActivityCompat.requestPermissions(
            activity,
            new String[] { Manifest.permission.WRITE_EXTERNAL_STORAGE },
            1002
        ));
        toastOnMain("Allow storage access, then try the download again.");
        return false;
    }

    private void requestNotificationPermissionOnce() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU || askedForNotifications) return;
        askedForNotifications = true;
        main.post(() -> {
            boolean granted = ContextCompat.checkSelfPermission(
                activity, Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED;
            if (!granted) {
                ActivityCompat.requestPermissions(
                    activity,
                    new String[] { Manifest.permission.POST_NOTIFICATIONS },
                    1001
                );
            }
        });
    }

    private void postNotification(String name, String mimeType, Uri uri) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && ContextCompat.checkSelfPermission(activity, Manifest.permission.POST_NOTIFICATIONS)
               != PackageManager.PERMISSION_GRANTED) {
            return; // The toast already told them; a silent failure here is fine.
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(activity, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.stat_sys_download_done)
            .setContentTitle(name)
            .setContentText("Saved to Downloads")
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setAutoCancel(true);

        if (uri != null) {
            Intent view = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, mimeType)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);

            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            try {
                builder.setContentIntent(
                    PendingIntent.getActivity(activity, (int) System.nanoTime(), view, flags)
                );
            } catch (ActivityNotFoundException ignored) {
                // Leave the notification tappable-but-inert rather than dropping it.
            }
        }

        NotificationManager manager = activity.getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.notify((int) (System.nanoTime() % Integer.MAX_VALUE), builder.build());
        }
    }
}
