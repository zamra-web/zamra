package com.zamratravels.portal;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

/**
 * Shared shell for both portals. Which site it opens, what it's called and how it's branded all
 * come from the product flavour (see app/build.gradle and app/src/{admin,b2b}); the behaviour
 * below is identical for the two apps.
 */
public class MainActivity extends BridgeActivity {

    private ZamraNative nativeBridge;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();

        // The portals keep auth state and drafts in web storage; without these a cold start
        // would sign the user out every time.
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        nativeBridge = new ZamraNative(this, getBridge());
        webView.addJavascriptInterface(nativeBridge, "ZamraNative");

        ZamraWebViewClient client = new ZamraWebViewClient(getBridge(), nativeBridge);
        getBridge().setWebViewClient(client);
        webView.setWebViewClient(client);

        // Catches ordinary http(s) downloads; the injected shim covers blob:/data: exports.
        webView.setDownloadListener(nativeBridge.downloadListener());
    }
}
