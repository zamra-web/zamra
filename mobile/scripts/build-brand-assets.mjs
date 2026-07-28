/**
 * Regenerates the launcher icons and splash screens for both flavours.
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Everything is derived from the site's own logo (web/public/assets/img/apple-touch-icon.png) so
 * the apps can't drift from the brand. That logo is a white wordmark plus a light-blue swoosh on
 * transparency; we take its alpha channel and re-fill it flat white, which reads cleanly on both
 * flavour colours and stays legible at 48dp — where the arrow detail inside the swoosh would be
 * about four pixels wide and lost anyway.
 *
 * Three steps: build the source images @capacitor/assets expects, let it expand them into every
 * density, then correct the adaptive-icon XML it writes (see fixAdaptiveIcons below).
 */
import { execFile } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);

const here = dirname(fileURLToPath(import.meta.url));
const mobileRoot = resolve(here, '..');
const repoRoot = resolve(mobileRoot, '..');
const SOURCE_LOGO = resolve(repoRoot, 'web/public/assets/img/apple-touch-icon.png');
const OUT_ROOT = resolve(mobileRoot, 'assets');

const BRAND_NAVY = '#0c4a8a';   // --color-primary
const BRAND_ORANGE = '#f97316'; // --color-accent

const FLAVOURS = [
    { name: 'admin', iconBackground: BRAND_NAVY, splashBackground: BRAND_NAVY },
    { name: 'b2b', iconBackground: BRAND_ORANGE, splashBackground: BRAND_NAVY },
];

const ICON_SIZE = 1024;
const SPLASH_SIZE = 2732;

/**
 * @capacitor/assets insets the foreground layer by 16.7%, leaving the central 66.6% of the
 * 108dp canvas — exactly the area a launcher mask keeps. Sizing the mark at 62% of the source
 * therefore lands it at roughly 45dp inside the 72dp visible circle, which matches the Material
 * icon keyline.
 */
const MARK_COVERAGE = 0.62;
const LOCKUP_COVERAGE = 0.3;

/** The swoosh sits above the wordmark, separated by a fully transparent band (rows 594-652). */
const MARK_ROWS = { top: 248, bottom: 593 };
const LOCKUP_ROWS = { top: 248, bottom: 971 };

/** Tightest opaque bounding box within a horizontal band of the source image. */
function boundsWithin(raw, width, channels, top, bottom) {
    let minX = width;
    let maxX = -1;
    let minY = bottom;
    let maxY = -1;

    for (let y = top; y <= bottom; y++) {
        for (let x = 0; x < width; x++) {
            if (raw[(y * width + x) * channels + 3] > 16) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    if (maxX < 0) throw new Error(`No opaque pixels between rows ${top} and ${bottom}`);
    return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Re-fills a cropped region in flat white, keeping its silhouette. */
async function whiteSilhouette(region) {
    const { data, info } = await sharp(SOURCE_LOGO)
        .ensureAlpha()
        .extract(region)
        .extractChannel('alpha')
        .raw()
        .toBuffer({ resolveWithObject: true });

    return sharp({
        create: { width: info.width, height: info.height, channels: 3, background: '#ffffff' },
    })
        .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
        .png()
        .toBuffer();
}

/** Centres `art` on a canvas, scaled so its longest edge covers `coverage` of the canvas. */
async function centred(art, canvasSize, coverage, background) {
    const { width, height } = await sharp(art).metadata();
    const scale = Math.round(canvasSize * coverage) / Math.max(width, height);

    const resized = await sharp(art)
        .resize({
            width: Math.max(1, Math.round(width * scale)),
            height: Math.max(1, Math.round(height * scale)),
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: canvasSize,
            height: canvasSize,
            channels: 4,
            background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite([{ input: resized, gravity: 'centre' }])
        .png()
        .toBuffer();
}

function solid(size, colour) {
    return sharp({ create: { width: size, height: size, channels: 4, background: colour } })
        .png()
        .toBuffer();
}

/**
 * @capacitor/assets points the adaptive icon's background layer at a PNG and insets it by 16.7%,
 * so the background stops exactly at the mask edge — any launcher that scales the icon (most do,
 * during the open animation) briefly shows transparent corners. Our background is one flat colour,
 * so a <color> drawable with no inset is both correct and smaller.
 */
async function fixAdaptiveIcons(flavour) {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<!-- Written by scripts/build-brand-assets.mjs; re-run it rather than editing by hand. -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground>
        <inset android:drawable="@mipmap/ic_launcher_foreground" android:inset="16.7%" />
    </foreground>
</adaptive-icon>
`;
    const dir = resolve(mobileRoot, 'android/app/src', flavour.name, 'res/mipmap-anydpi-v26');
    await writeFile(resolve(dir, 'ic_launcher.xml'), xml);
    await writeFile(resolve(dir, 'ic_launcher_round.xml'), xml);

    // The background is now a colour, so the generated background bitmaps are dead weight.
    await Promise.all(
        ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].map((density) =>
            rm(
                resolve(mobileRoot, 'android/app/src', flavour.name, `res/mipmap-${density}/ic_launcher_background.png`),
                { force: true }
            )
        )
    );

    await writeFile(
        resolve(mobileRoot, 'android/app/src', flavour.name, 'res/values/colors.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<!-- Written by scripts/build-brand-assets.mjs; re-run it rather than editing by hand. -->
<resources>
    <color name="ic_launcher_background">${flavour.iconBackground}</color>
</resources>
`
    );
}

// ---- run ----------------------------------------------------------------------------------

const { data: raw, info } = await sharp(SOURCE_LOGO)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

const mark = await whiteSilhouette(
    boundsWithin(raw, info.width, info.channels, MARK_ROWS.top, MARK_ROWS.bottom)
);
const lockup = await whiteSilhouette(
    boundsWithin(raw, info.width, info.channels, LOCKUP_ROWS.top, LOCKUP_ROWS.bottom)
);

for (const flavour of FLAVOURS) {
    const dir = resolve(OUT_ROOT, flavour.name);
    await mkdir(dir, { recursive: true });

    await writeFile(resolve(dir, 'icon-foreground.png'), await centred(mark, ICON_SIZE, MARK_COVERAGE));
    await writeFile(resolve(dir, 'icon-background.png'), await solid(ICON_SIZE, flavour.iconBackground));

    // Legacy square icon (pre-adaptive launchers): no mask, so the mark can sit a little wider.
    await writeFile(
        resolve(dir, 'icon-only.png'),
        await centred(mark, ICON_SIZE, 0.62, flavour.iconBackground)
    );

    const splash = await centred(lockup, SPLASH_SIZE, LOCKUP_COVERAGE, flavour.splashBackground);
    await writeFile(resolve(dir, 'splash.png'), splash);
    await writeFile(resolve(dir, 'splash-dark.png'), splash);

    await run(
        'npx',
        [
            'capacitor-assets', 'generate',
            '--android',
            '--assetPath', `assets/${flavour.name}`,
            '--androidFlavor', flavour.name,
        ],
        { cwd: mobileRoot }
    );

    await fixAdaptiveIcons(flavour);

    console.log(`✔ ${flavour.name}: icons and splash screens regenerated`);
}
