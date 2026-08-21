# Zamra Android apps

Two Android apps built from one Capacitor project:

| App | Package | Opens | Icon |
|---|---|---|---|
| **Zamra Admin** | `com.zamratravels.admin` | `https://zamratravels.com/admin` | navy `#0c4a8a` |
| **Zamra B2B** | `com.zamratravels.b2b` | `https://b2b.zamratravels.com/b2b-login` | orange `#f97316` |

They are Android **product flavours** of a single native shell, not two projects. Everything that
differs lives in `android/app/src/admin/` and `android/app/src/b2b/`: the Capacitor config (which
decides the start URL), the launcher name, the icons and the splash screen. All the Java is shared.

## Build

```bash
cd mobile && npm install
./scripts/build-apks.sh              # both, signed, into mobile/dist/
./scripts/build-apks.sh admin        # one flavour
npm test                             # config guards (see tests/flavors.test.js)
```

Needs JDK 21 and an Android SDK with platform 35 (`ANDROID_HOME` must be set). Gradle tasks are
`:app:assembleAdminRelease` and `:app:assembleB2bRelease`; debug variants install alongside release
ones because they carry a `.debug` application-id suffix.

## The apps load the live site

There is no bundled copy of `web/dist` in the APKs. `server.url` in each flavour's
`capacitor.config.json` points at production, so:

- **a Vercel deploy updates both apps immediately** — no APK re-release for web changes;
- Firebase authorized domains and API-key referrer restrictions keep working unchanged, because
  requests still come from the real origin;
- clean URLs (`/admin`, `/b2b`, `/b2b-login`) resolve through Vercel, which a bundled `webDir`
  would 404 on.

The trade-off is that the apps need a connection. When there isn't one, `server.errorPath` shows
`www/offline.html` with a retry button.

`mobile/capacitor.config.json` at the root is only what the Capacitor CLI reads (and what
`npx cap copy` writes into `android/app/src/main/assets/`). At build time the flavour config
overrides it, so **editing the root config alone changes nothing** — edit
`android/app/src/<flavour>/assets/capacitor.config.json`.

## Safe areas — the status bar overlaps the WebView

Android 15 forces edge-to-edge, so the WebView starts *behind* the status bar and the top of the
page is drawn under it — this is what sliced the Zamra logo in half in the B2B app. The fix is on
the web side, not native:

- every page the apps can reach ships `viewport-fit=cover` in its viewport meta — without it
  `env(safe-area-inset-*)` always resolves to `0`, so the padding below does nothing;
- `.site-header` in [web/src/styles/web/style.css](../web/src/styles/web/style.css) carries
  `padding-top: calc(env(safe-area-inset-top, 0px) + 4px)` (8px under 640px). It is sticky but
  still in flow, so that padding pushes the whole page down as well, and the glass background
  keeps painting behind the status bar, which is what edge-to-edge should look like;
- `b2b-login.html` pads `body` on all four insets instead, since it has no site header.

Anything new that sits flush against the top or bottom of the viewport (sticky bars, bottom
sheets, floating action buttons) needs the matching inset — see the existing
`env(safe-area-inset-bottom)` uses on the WhatsApp FAB and the flight details sheet.

## Downloads — the part that needed native code

An Android WebView silently ignores `<a download>` when the href is a `blob:` or `data:` URL, which
is how every export in this codebase works. Without a bridge, "Download PDF" in the dashboard does
nothing at all — no error, no file.

`res/raw/zamra_shim.js` is injected into every page after load and catches all three ways this app
clicks a download link:

| Vector | Used by |
|---|---|
| `link.click()` | html2canvas / canvas exports, CSV blobs |
| `node.dispatchEvent(new MouseEvent('click'))` on a **detached** anchor | jsPDF's `save()` |
| a real tap on an `a[download]` in the page | ticket and report links |

It reads the blob, slices it into 512 KB base64 chunks and streams them through
`window.ZamraNative` (`ZamraNative.java`) into `SaveSession.java`, which writes to the shared
Downloads folder via MediaStore on API 29+ and the public directory below that. Chunking is what
keeps a 40 MB video export from materialising as one enormous Java string. Ordinary `http(s)`
downloads skip all of this and go straight to Android's `DownloadManager`.

If you add an export path to the web app that produces files some other way, check it here.

## Signing

Release signing reads `android/keystore.properties`, which is **not in git**:

```properties
storeFile=zamra-release.jks
storePassword=…
keyAlias=zamra
keyPassword=…
```

⚠️ **Back up `android/zamra-release.jks` and `android/keystore.properties` somewhere off this
machine.** Android identifies an app by its signature: lose the keystore and no future build can
ever update an installed app or a Play Store listing — every user has to uninstall and reinstall,
losing their session. The current key is RSA-4096, valid ~27 years,
`CN=Zamra Travels, O=Zamra Travels, C=IN`.

Without the properties file Gradle still builds, but the APKs are unsigned and Android refuses to
install them.

## Icons and splash screens

`npm run assets` regenerates everything from `web/public/assets/img/apple-touch-icon.png`, so the
apps can't drift from the site's branding. The script takes the logo's alpha channel, re-fills it
flat white, and expands it into every density via `@capacitor/assets` — then rewrites the
adaptive-icon XML to use a flat colour background instead of an inset bitmap (the generated version
leaves transparent corners when a launcher scales the icon).

Re-run it after changing the logo or the flavour colours in `scripts/build-brand-assets.mjs`.

## Distribution

The APKs in `mobile/dist/` install by sideloading — send them to staff and agents, who need to
allow "install unknown apps" once. Bump `versionCode` **and** `versionName` in
`android/app/build.gradle` for every release you hand out; Android refuses to install an APK whose
`versionCode` is lower than the installed one.

For Play Store distribution you'd want `bundleAdminRelease` / `bundleB2bRelease` (AAB) instead, plus
a privacy policy URL and Play App Signing.

## What is deliberately not here

- **Push notifications.** The shell has no Firebase Messaging; `android/app/google-services.json`
  is absent and the Gradle file skips the plugin when it is. Adding enquiry alerts to the admin app
  would start here.
- **iOS.** Only the Android platform is installed. `npx cap add ios` plus a matching pair of Xcode
  schemes would be the equivalent work.

## Hardware back button and admin tab history

The admin dashboard now pushes a history entry on every tab switch (`/admin/reports`,
`/admin/whatsapp`, …). Capacitor's hardware-back handler calls `webView.goBack()` whenever
history exists, so **back now walks tab history before exiting the app**. Previously the admin
app had zero history entries and back exited immediately.

This needs no APK release — the apps load the live production URL — but it is a real behaviour
change to expect when testing.
