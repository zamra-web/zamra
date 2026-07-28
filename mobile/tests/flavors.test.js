/**
 * Guards the two things that silently produce a working-but-wrong APK:
 *
 *   1. A flavour pointing at the other portal's host (or at a path Vercel doesn't serve), which
 *      only shows up when someone installs the app and sees the wrong login screen.
 *   2. A start URL whose host is missing from server.allowNavigation, which makes Capacitor open
 *      the portal in Chrome instead of the app on the very first navigation.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const MOBILE_ROOT = path.resolve(__dirname, '..');
const ANDROID_APP = path.join(MOBILE_ROOT, 'android/app');

const FLAVOURS = {
    admin: {
        applicationId: 'com.zamratravels.admin',
        host: 'zamratravels.com',
        // login.js sends admins to /admin.html and agents away to /b2b.
        pathname: '/admin',
    },
    b2b: {
        applicationId: 'com.zamratravels.b2b',
        host: 'b2b.zamratravels.com',
        // vercel.json redirects this host's root here anyway; starting here skips a hop.
        pathname: '/b2b-login',
    },
};

function readFlavourConfig(flavour) {
    return JSON.parse(
        fs.readFileSync(path.join(ANDROID_APP, 'src', flavour, 'assets/capacitor.config.json'), 'utf8')
    );
}

const buildGradle = fs.readFileSync(path.join(ANDROID_APP, 'build.gradle'), 'utf8');

for (const [flavour, expected] of Object.entries(FLAVOURS)) {
    test(`${flavour}: start URL points at its own portal`, () => {
        const url = new URL(readFlavourConfig(flavour).server.url);
        assert.equal(url.protocol, 'https:', 'portals must never be loaded over cleartext');
        assert.equal(url.host, expected.host);
        assert.equal(url.pathname, expected.pathname);
    });

    test(`${flavour}: start host is allowed to navigate in-app`, () => {
        const config = readFlavourConfig(flavour);
        const host = new URL(config.server.url).host;
        assert.ok(
            config.server.allowNavigation.includes(host),
            `${host} missing from allowNavigation — Capacitor would kick it out to the browser`
        );
    });

    test(`${flavour}: does not allow navigating into the other portal`, () => {
        const config = readFlavourConfig(flavour);
        const otherHost = Object.entries(FLAVOURS)
            .find(([name]) => name !== flavour)[1].host;
        assert.ok(
            !config.server.allowNavigation.includes(otherHost),
            `${otherHost} should open externally, not inside the ${flavour} app`
        );
    });

    test(`${flavour}: appId matches the Gradle applicationId`, () => {
        assert.equal(readFlavourConfig(flavour).appId, expected.applicationId);
        assert.match(
            buildGradle,
            new RegExp(`${flavour}\\s*\\{[^}]*applicationId\\s+"${expected.applicationId}"`, 's'),
            `build.gradle should declare applicationId "${expected.applicationId}" for ${flavour}`
        );
    });

    test(`${flavour}: the offline fallback it names actually ships`, () => {
        const errorPath = readFlavourConfig(flavour).server.errorPath;
        assert.ok(errorPath, 'server.errorPath keeps a dropped connection from showing a raw error');
        assert.ok(
            fs.existsSync(path.join(MOBILE_ROOT, 'www', errorPath)),
            `www/${errorPath} is missing — the WebView would show its own error page instead`
        );
    });
}

test('both flavours are declared in build.gradle', () => {
    for (const flavour of Object.keys(FLAVOURS)) {
        assert.match(buildGradle, new RegExp(`\\n\\s*${flavour}\\s*\\{`));
    }
});

test('the download shim is wired to the raw resource the client reads', () => {
    const shimPath = path.join(ANDROID_APP, 'src/main/res/raw/zamra_shim.js');
    assert.ok(fs.existsSync(shimPath), 'res/raw/zamra_shim.js is missing');

    const client = fs.readFileSync(
        path.join(ANDROID_APP, 'src/main/java/com/zamratravels/portal/ZamraWebViewClient.java'),
        'utf8'
    );
    assert.match(client, /R\.raw\.zamra_shim/);

    // jsPDF fires a synthetic MouseEvent on a detached anchor, html2canvas exports call
    // link.click(), and users tap real links — the shim has to cover all three.
    const shim = fs.readFileSync(shimPath, 'utf8');
    assert.match(shim, /HTMLAnchorElement\.prototype\.click/);
    assert.match(shim, /EventTarget\.prototype\.dispatchEvent/);
    assert.match(shim, /addEventListener\('click'/);
});
