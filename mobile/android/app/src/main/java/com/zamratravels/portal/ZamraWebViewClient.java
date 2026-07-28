package com.zamratravels.portal;

import android.graphics.Bitmap;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Keeps {@link ZamraNative} told about where the WebView currently is, and re-installs the
 * download shim after every navigation.
 *
 * The shim can't simply be bundled with the site: the app loads the live production build, so
 * anything app-specific has to be injected from the native side after the page settles.
 */
public class ZamraWebViewClient extends BridgeWebViewClient {

    private final Bridge bridge;
    private final ZamraNative nativeBridge;
    private String shimSource;

    ZamraWebViewClient(Bridge bridge, ZamraNative nativeBridge) {
        super(bridge);
        this.bridge = bridge;
        this.nativeBridge = nativeBridge;
    }

    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        nativeBridge.setCurrentUrl(url);
        super.onPageStarted(view, url, favicon);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        nativeBridge.setCurrentUrl(url);
        super.onPageFinished(view, url);
        injectShim(view);
    }

    private void injectShim(WebView view) {
        String source = shimSource();
        if (source != null) {
            view.evaluateJavascript(source, null);
        }
    }

    private String shimSource() {
        if (shimSource != null) return shimSource;
        try (InputStream in = bridge.getContext().getResources().openRawResource(R.raw.zamra_shim)) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] chunk = new byte[8192];
            int read;
            while ((read = in.read(chunk)) != -1) {
                buffer.write(chunk, 0, read);
            }
            shimSource = buffer.toString(StandardCharsets.UTF_8.name());
        } catch (IOException e) {
            // Without the shim, exports quietly do nothing — worth a log line.
            android.util.Log.e("ZamraShell", "Could not read the download shim", e);
        }
        return shimSource;
    }
}
