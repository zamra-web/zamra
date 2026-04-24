import { getPosterRateDisplay } from './poster-rate-display.js';
import { formatPosterBaggageDisplay } from './poster-baggage-display.js';

let lastVideoThemeHue = null;
const VIDEO_MAX_ROWS = 12;
const MP4_MIME_CANDIDATES = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    'video/mp4;codecs="avc1.42E01E"',
    'video/mp4'
];
const WEBM_MIME_CANDIDATES = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
];
const VIDEO_BACKGROUND_MUSIC_URL = '/assets/music/bg_music.mp3';
const VIDEO_BACKGROUND_MUSIC_GAIN = 0.18;

function normalizeRatioKey(value) {
    const cleaned = String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[×:]/g, 'x')
        .replace(/\s+/g, '');
    if (cleaned === '9x16' || cleaned === '16x9' || cleaned === '1x1') return cleaned;
    return '1x1';
}

function pickMimeType({ forceMimeType, candidates } = {}) {
    if (forceMimeType && MediaRecorder.isTypeSupported(forceMimeType)) return forceMimeType;
    const fallback = candidates && candidates.length
        ? candidates
        : [...MP4_MIME_CANDIDATES, ...WEBM_MIME_CANDIDATES];
    for (const type of fallback) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
}

function getMimeCandidates() {
    return [...MP4_MIME_CANDIDATES, ...WEBM_MIME_CANDIDATES];
}

function attachSilentAudioTrack(stream) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0;
        oscillator.connect(gain);
        const dest = audioCtx.createMediaStreamDestination();
        gain.connect(dest);
        oscillator.start();
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
        return { audioCtx, oscillator, audioTrack, hasRealAudio: false };
    } catch {
        return null;
    }
}

let backgroundMusicDataPromise = null;

async function loadBackgroundMusicData() {
    if (backgroundMusicDataPromise) return backgroundMusicDataPromise;
    backgroundMusicDataPromise = (async () => {
        const response = await fetch(VIDEO_BACKGROUND_MUSIC_URL, { cache: 'force-cache' });
        if (!response.ok) {
            throw new Error(`Failed to load background music (${response.status}).`);
        }
        return await response.arrayBuffer();
    })();
    try {
        return await backgroundMusicDataPromise;
    } catch (err) {
        backgroundMusicDataPromise = null;
        throw err;
    }
}

function decodeAudioDataCompat(audioCtx, arrayBuffer) {
    return new Promise((resolve, reject) => {
        let settled = false;
        const finish = (fn, value) => {
            if (settled) return;
            settled = true;
            fn(value);
        };
        try {
            const promise = audioCtx.decodeAudioData(
                arrayBuffer.slice(0),
                (decoded) => finish(resolve, decoded),
                (err) => finish(reject, err || new Error('Failed to decode audio data.'))
            );
            if (promise && typeof promise.then === 'function') {
                promise.then(
                    (decoded) => finish(resolve, decoded),
                    (err) => finish(reject, err)
                );
            }
        } catch (err) {
            finish(reject, err);
        }
    });
}

async function attachBackgroundAudioTrack(stream, { durationMs, volume = VIDEO_BACKGROUND_MUSIC_GAIN } = {}) {
    let audioCtx = null;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return attachSilentAudioTrack(stream);
        audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume().catch(() => {});
        }
        const musicData = await loadBackgroundMusicData();
        const decodedBuffer = await decodeAudioDataCompat(audioCtx, musicData);
        if (!decodedBuffer) {
            try { await audioCtx.close(); } catch (_) { }
            return attachSilentAudioTrack(stream);
        }

        const source = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        const dest = audioCtx.createMediaStreamDestination();
        const playDurationSec = Math.max(0.75, Number(durationMs || 0) / 1000);
        const fadeLeadSec = Math.min(0.75, Math.max(0.2, playDurationSec * 0.1));
        const fadeStartSec = Math.max(0, playDurationSec - fadeLeadSec);

        source.buffer = decodedBuffer;
        source.loop = true;
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.setValueAtTime(volume, audioCtx.currentTime + fadeStartSec);
        gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + playDurationSec);

        source.connect(gain);
        gain.connect(dest);
        source.start(0);
        source.stop(audioCtx.currentTime + playDurationSec + 0.05);

        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
        return { audioCtx, source, gain, audioTrack, hasRealAudio: Boolean(audioTrack) };
    } catch (err) {
        try { await audioCtx?.close(); } catch (_) { }
        console.warn('Background music could not be attached. Falling back to silent audio track.', err);
        return attachSilentAudioTrack(stream);
    }
}

let ffmpegLoadPromise = null;
let ffmpegCorePath = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js';
const FFMPEG_SCRIPT_URLS = [
    'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js',
    'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js'
];
const FFMPEG_CORE_URLS = [
    'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js'
];

function loadScriptFrom(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(url);
        script.onerror = () => reject(new Error(`Failed to load ${url}`));
        document.head.appendChild(script);
    });
}

async function loadFfmpeg() {
    if (ffmpegLoadPromise) return ffmpegLoadPromise;
    ffmpegLoadPromise = (async () => {
        if (window.FFmpeg?.createFFmpeg && window.FFmpeg?.fetchFile) {
            return window.FFmpeg;
        }
        for (let i = 0; i < FFMPEG_SCRIPT_URLS.length; i += 1) {
            try {
                await loadScriptFrom(FFMPEG_SCRIPT_URLS[i]);
                ffmpegCorePath = FFMPEG_CORE_URLS[i] || ffmpegCorePath;
                const api = window.FFmpeg;
                if (api?.createFFmpeg && api?.fetchFile) return api;
            } catch (_) { }
        }
        throw new Error('Unable to load FFmpeg.');
    })();
    try {
        return await ffmpegLoadPromise;
    } catch (err) {
        ffmpegLoadPromise = null;
        ffmpegClient = null;
        throw err;
    }
}

let ffmpegClient = null;
async function transcodeToMp4(blob, inputMime) {
    const api = await loadFfmpeg();
    if (!ffmpegClient) {
        const ffmpeg = api.createFFmpeg({
            log: false,
            corePath: ffmpegCorePath
        });
        await ffmpeg.load();
        ffmpegClient = { ffmpeg, fetchFile: api.fetchFile };
    }
    const { ffmpeg, fetchFile } = ffmpegClient;
    const inputExt = inputMime?.includes('webm') ? 'webm' : 'mp4';
    const inputName = `input.${inputExt}`;
    const outputName = 'output.mp4';
    try {
        ffmpeg.FS('writeFile', inputName, await fetchFile(blob));
        await ffmpeg.run(
            '-i', inputName,
            '-c:v', 'libx264',
            '-profile:v', 'baseline',
            '-level', '4.0',
            '-pix_fmt', 'yuv420p',
            '-r', '30',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            outputName
        );
        const data = ffmpeg.FS('readFile', outputName);
        try { ffmpeg.FS('unlink', inputName); } catch (_) { }
        try { ffmpeg.FS('unlink', outputName); } catch (_) { }
        return new Blob([data], { type: 'video/mp4' });
    } catch (err) {
        ffmpegClient = null;
        throw err;
    }
}

function getExpectedAspectRatio(ratioKey) {
    if (ratioKey === '9x16') return 9 / 16;
    if (ratioKey === '16x9') return 16 / 9;
    return 1;
}

function validateVideoBlob(blob, ratioKey, { timeoutMs = 8000 } = {}) {
    return new Promise((resolve) => {
        if (!blob || !blob.size) {
            resolve(false);
            return;
        }
        const url = URL.createObjectURL(blob);
        const video = document.createElement('video');
        let settled = false;
        const cleanup = (ok) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            URL.revokeObjectURL(url);
            resolve(ok);
        };
        const timer = setTimeout(() => cleanup(false), timeoutMs);
        video.preload = 'metadata';
        video.muted = true;
        video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;
            const duration = video.duration;
            if (!width || !height || !Number.isFinite(duration) || duration <= 0) {
                cleanup(false);
                return;
            }
            const expected = getExpectedAspectRatio(ratioKey);
            const actual = width / height;
            const tolerance = expected === 1 ? 0.18 : 0.22;
            cleanup(Math.abs(actual - expected) <= tolerance);
        };
        video.onerror = () => cleanup(false);
        video.src = url;
        video.load();
    });
}

function drawRoundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

async function loadPosterFrameAsset(frame = {}) {
    const blob = frame?.blob;
    if (!blob) return null;

    if (typeof createImageBitmap === 'function') {
        try {
            const bitmap = await createImageBitmap(blob);
            return {
                ...frame,
                image: bitmap,
                width: bitmap.width,
                height: bitmap.height,
                cleanup() {
                    try { bitmap.close?.(); } catch (_) { }
                }
            };
        } catch (_) { }
    }

    const objectUrl = URL.createObjectURL(blob);
    try {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load poster frame image.'));
            img.src = objectUrl;
        });
        return {
            ...frame,
            image,
            width: image.naturalWidth || image.width,
            height: image.naturalHeight || image.height,
            cleanup() {
                try { URL.revokeObjectURL(objectUrl); } catch (_) { }
            }
        };
    } catch (err) {
        try { URL.revokeObjectURL(objectUrl); } catch (_) { }
        console.warn('Poster frame image could not be prepared for video export.', err);
        return null;
    }
}

function cleanupPosterFrameAssets(assets = []) {
    assets.forEach((asset) => {
        try { asset?.cleanup?.(); } catch (_) { }
    });
}

function fitDimensionsWithin(sourceWidth, sourceHeight, maxWidth, maxHeight) {
    const safeWidth = Math.max(1, Number(sourceWidth || 0));
    const safeHeight = Math.max(1, Number(sourceHeight || 0));
    const scale = Math.min(maxWidth / safeWidth, maxHeight / safeHeight);
    return {
        width: safeWidth * scale,
        height: safeHeight * scale
    };
}

function getPosterFrameSlideshowLayout(ratioKey, width, height) {
    if (ratioKey === '9x16') {
        return {
            pageDuration: 5200,
            transition: 540,
            maxWidth: width * 0.91,
            maxHeight: height * 0.84,
            yBias: -height * 0.015,
            floatY: 18,
            floatSpeed: 1800,
            zoomStart: 0.985,
            zoomEnd: 1.015,
            framePad: 12,
            frameRadius: 34,
            shadowBlur: 72,
            shadowOffsetY: 28,
            indicatorY: height - 84
        };
    }
    if (ratioKey === '16x9') {
        return {
            pageDuration: 4200,
            transition: 500,
            maxWidth: width * 0.54,
            maxHeight: height * 0.9,
            yBias: 0,
            floatY: 14,
            floatSpeed: 1700,
            zoomStart: 0.987,
            zoomEnd: 1.012,
            framePad: 14,
            frameRadius: 30,
            shadowBlur: 64,
            shadowOffsetY: 22,
            indicatorY: height - 58
        };
    }
    return {
        pageDuration: 4800,
        transition: 520,
        maxWidth: width * 0.84,
        maxHeight: height * 0.9,
        yBias: 0,
        floatY: 12,
        floatSpeed: 1700,
        zoomStart: 0.988,
        zoomEnd: 1.012,
        framePad: 12,
        frameRadius: 32,
        shadowBlur: 66,
        shadowOffsetY: 24,
        indicatorY: height - 66
    };
}

function drawPosterVideoBackdrop(ctx, width, height, elapsedMs) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#dde8f5');
    gradient.addColorStop(0.32, '#f7faff');
    gradient.addColorStop(1, '#e9eff6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const drift = Math.sin(elapsedMs / 2200);
    const glowA = ctx.createRadialGradient(
        width * (0.18 + drift * 0.015),
        height * 0.14,
        0,
        width * 0.18,
        height * 0.14,
        width * 0.42
    );
    glowA.addColorStop(0, 'rgba(255,255,255,0.92)');
    glowA.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glowA;
    ctx.fillRect(0, 0, width, height);

    const glowB = ctx.createRadialGradient(
        width * 0.82,
        height * (0.82 - drift * 0.02),
        0,
        width * 0.82,
        height * 0.82,
        width * 0.48
    );
    glowB.addColorStop(0, 'rgba(203, 213, 225, 0.42)');
    glowB.addColorStop(1, 'rgba(203, 213, 225, 0)');
    ctx.fillStyle = glowB;
    ctx.fillRect(0, 0, width, height);

    const accentBar = ctx.createLinearGradient(0, 0, width, 0);
    accentBar.addColorStop(0, '#2563eb');
    accentBar.addColorStop(0.5, '#60a5fa');
    accentBar.addColorStop(1, '#0f172a');
    ctx.fillStyle = accentBar;
    ctx.fillRect(0, 0, width, 14);
}

function drawPosterFrameScene(ctx, asset, ratioKey, width, height, elapsedMs, alpha = 1) {
    if (!asset?.image || alpha <= 0) return;

    const layout = getPosterFrameSlideshowLayout(ratioKey, width, height);
    const fitted = fitDimensionsWithin(asset.width, asset.height, layout.maxWidth, layout.maxHeight);
    const t = Math.max(0, Math.min(1, elapsedMs / Math.max(1, layout.pageDuration - layout.transition)));
    const zoom = layout.zoomStart + ((layout.zoomEnd - layout.zoomStart) * t);
    const floatOffset = layout.floatY * Math.sin((elapsedMs / layout.floatSpeed) + (Number(asset.page || 1) * 0.65));
    const drawWidth = fitted.width * zoom;
    const drawHeight = fitted.height * zoom;
    const x = (width - drawWidth) / 2;
    const y = ((height - drawHeight) / 2) + layout.yBias + floatOffset;
    const frameX = x - layout.framePad;
    const frameY = y - layout.framePad;
    const frameWidth = drawWidth + (layout.framePad * 2);
    const frameHeight = drawHeight + (layout.framePad * 2);

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.save();
    ctx.shadowColor = `rgba(15, 23, 42, ${0.18 * alpha})`;
    ctx.shadowBlur = layout.shadowBlur;
    ctx.shadowOffsetY = layout.shadowOffsetY;
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    drawRoundedRectPath(ctx, frameX, frameY, frameWidth, frameHeight, layout.frameRadius);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    drawRoundedRectPath(ctx, frameX, frameY, frameWidth, frameHeight, layout.frameRadius);
    ctx.stroke();

    ctx.drawImage(asset.image, x, y, drawWidth, drawHeight);
    ctx.restore();
}

function drawPosterFramePagination(ctx, width, height, count, activeProgress, ratioKey) {
    if (!Number.isFinite(count) || count <= 1) return;

    const layout = getPosterFrameSlideshowLayout(ratioKey, width, height);
    const dotWidth = ratioKey === '9x16' ? 24 : 20;
    const dotGap = 12;
    const inactiveWidth = 10;
    const totalWidth = (count * inactiveWidth) + ((count - 1) * dotGap);
    const startX = (width - totalWidth) / 2;
    const y = layout.indicatorY;

    for (let index = 0; index < count; index += 1) {
        const distance = Math.abs(activeProgress - index);
        const strength = Math.max(0, 1 - Math.min(distance, 1));
        const currentWidth = inactiveWidth + ((dotWidth - inactiveWidth) * strength);
        const x = startX + (index * (inactiveWidth + dotGap)) - ((currentWidth - inactiveWidth) / 2);
        ctx.fillStyle = strength > 0.12
            ? `rgba(15, 23, 42, ${0.28 + (strength * 0.42)})`
            : 'rgba(148, 163, 184, 0.36)';
        drawRoundedRectPath(ctx, x, y, currentWidth, 10, 999);
        ctx.fill();
    }
}

export async function downloadVideoPoster(ratio, fares, sectorId, sectors, airlines, options = {}) {
    const ratioKey = normalizeRatioKey(ratio);
    const ratioLabel = ratioKey.replace('x', ':');
    // Show loading toast (assuming toast is globally available or we can just use basic UI feedback)
    const toastMessage = `Generating ${ratioLabel} Video... Please remain on this tab.`;
    if (window.toast) window.toast('info', 'Video Generation', toastMessage);

    if (typeof MediaRecorder === 'undefined') {
        if (window.toast) window.toast('error', 'Video Generation', 'Your browser does not support MediaRecorder.');
        throw new Error('MediaRecorder is not supported in this browser.');
    }

    const VIDEO_THEMES = [
        {
            id: 'classic',
            topBar: ['#0c4a8a', '#1e67c2', '#60a5fa'],
            headerBg: '#0f172a',
            headerOverlayFrom: '#0f172a',
            headerOverlayTo: 'rgba(15, 23, 42, 0)',
            badgeBg: 'rgba(12, 74, 138, 0.25)',
            badgeBorder: 'rgba(96, 165, 250, 0.4)',
            badgeText: '#dbeafe',
            subtitle: '#dbeafe',
            accent: '#60a5fa',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f3f6ff',
            sectorText: '#2563eb',
            fareBadgeBg: '#0f172a',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#2563eb'
        },
        {
            id: 'deep',
            topBar: ['#073160', '#0c4a8a', '#1e67c2'],
            headerBg: '#111827',
            headerOverlayFrom: '#111827',
            headerOverlayTo: 'rgba(17, 24, 39, 0)',
            badgeBg: 'rgba(12, 74, 138, 0.28)',
            badgeBorder: 'rgba(30, 103, 194, 0.45)',
            badgeText: '#e0efff',
            subtitle: '#cfe1ff',
            accent: '#1e67c2',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f4f7ff',
            sectorText: '#1e67c2',
            fareBadgeBg: '#111827',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#1e67c2'
        },
        {
            id: 'royal',
            topBar: ['#0f4f9e', '#1e67c2', '#60a5fa'],
            headerBg: '#0c1f3a',
            headerOverlayFrom: '#0c1f3a',
            headerOverlayTo: 'rgba(12, 31, 58, 0)',
            badgeBg: 'rgba(15, 79, 158, 0.25)',
            badgeBorder: 'rgba(96, 165, 250, 0.4)',
            badgeText: '#dbeafe',
            subtitle: '#dbeafe',
            accent: '#0f4f9e',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f0f7ff',
            sectorText: '#0f4f9e',
            fareBadgeBg: '#0c1f3a',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#0f4f9e'
        },
        {
            id: 'sunset',
            topBar: ['#f97316', '#f43f5e', '#8b5cf6'],
            headerBg: '#3b1020',
            headerOverlayFrom: '#3b1020',
            headerOverlayTo: 'rgba(59, 16, 32, 0)',
            badgeBg: 'rgba(249, 115, 22, 0.25)',
            badgeBorder: 'rgba(248, 113, 113, 0.45)',
            badgeText: '#ffe4e6',
            subtitle: '#fee2e2',
            accent: '#f97316',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#fff1f2',
            sectorText: '#ea580c',
            fareBadgeBg: '#3b1020',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#f97316'
        },
        {
            id: 'orchid',
            topBar: ['#8b5cf6', '#d946ef', '#f43f5e'],
            headerBg: '#2a1240',
            headerOverlayFrom: '#2a1240',
            headerOverlayTo: 'rgba(42, 18, 64, 0)',
            badgeBg: 'rgba(217, 70, 239, 0.25)',
            badgeBorder: 'rgba(216, 180, 254, 0.45)',
            badgeText: '#f5d0fe',
            subtitle: '#f5d0fe',
            accent: '#d946ef',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#fdf2ff',
            sectorText: '#c026d3',
            fareBadgeBg: '#2a1240',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#d946ef'
        },
        {
            id: 'emerald',
            topBar: ['#10b981', '#22c55e', '#06b6d4'],
            headerBg: '#083a2e',
            headerOverlayFrom: '#083a2e',
            headerOverlayTo: 'rgba(8, 58, 46, 0)',
            badgeBg: 'rgba(16, 185, 129, 0.25)',
            badgeBorder: 'rgba(94, 234, 212, 0.4)',
            badgeText: '#ccfbf1',
            subtitle: '#ccfbf1',
            accent: '#10b981',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#ecfdf5',
            sectorText: '#059669',
            fareBadgeBg: '#083a2e',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#10b981'
        },
        {
            id: 'aqua',
            topBar: ['#0ea5e9', '#22d3ee', '#14b8a6'],
            headerBg: '#0b2d44',
            headerOverlayFrom: '#0b2d44',
            headerOverlayTo: 'rgba(11, 45, 68, 0)',
            badgeBg: 'rgba(14, 165, 233, 0.25)',
            badgeBorder: 'rgba(34, 211, 238, 0.4)',
            badgeText: '#cffafe',
            subtitle: '#cffafe',
            accent: '#22d3ee',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#ecfeff',
            sectorText: '#0891b2',
            fareBadgeBg: '#0b2d44',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#22d3ee'
        },
        {
            id: 'citrus',
            topBar: ['#facc15', '#f59e0b', '#f97316'],
            headerBg: '#422006',
            headerOverlayFrom: '#422006',
            headerOverlayTo: 'rgba(66, 32, 6, 0)',
            badgeBg: 'rgba(245, 158, 11, 0.25)',
            badgeBorder: 'rgba(251, 191, 36, 0.45)',
            badgeText: '#fef3c7',
            subtitle: '#fef3c7',
            accent: '#f59e0b',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#fffbeb',
            sectorText: '#d97706',
            fareBadgeBg: '#422006',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#f59e0b'
        },
        {
            id: 'rose',
            topBar: ['#fb7185', '#f43f5e', '#e11d48'],
            headerBg: '#3a0b17',
            headerOverlayFrom: '#3a0b17',
            headerOverlayTo: 'rgba(58, 11, 23, 0)',
            badgeBg: 'rgba(244, 63, 94, 0.25)',
            badgeBorder: 'rgba(251, 113, 133, 0.45)',
            badgeText: '#ffe4e6',
            subtitle: '#ffe4e6',
            accent: '#f43f5e',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#fff1f2',
            sectorText: '#e11d48',
            fareBadgeBg: '#3a0b17',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#f43f5e'
        },
        {
            id: 'forest',
            topBar: ['#16a34a', '#22c55e', '#84cc16'],
            headerBg: '#0b2a1a',
            headerOverlayFrom: '#0b2a1a',
            headerOverlayTo: 'rgba(11, 42, 26, 0)',
            badgeBg: 'rgba(34, 197, 94, 0.25)',
            badgeBorder: 'rgba(132, 204, 22, 0.4)',
            badgeText: '#dcfce7',
            subtitle: '#dcfce7',
            accent: '#22c55e',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#f0fdf4',
            sectorText: '#15803d',
            fareBadgeBg: '#0b2a1a',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#22c55e'
        },
        {
            id: 'ocean',
            topBar: ['#06b6d4', '#0ea5e9', '#6366f1'],
            headerBg: '#0a2440',
            headerOverlayFrom: '#0a2440',
            headerOverlayTo: 'rgba(10, 36, 64, 0)',
            badgeBg: 'rgba(14, 165, 233, 0.25)',
            badgeBorder: 'rgba(99, 102, 241, 0.4)',
            badgeText: '#dbeafe',
            subtitle: '#dbeafe',
            accent: '#0ea5e9',
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt: '#eff6ff',
            sectorText: '#0284c7',
            fareBadgeBg: '#0a2440',
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: '#0ea5e9'
        }
    ];

    const RATIO_PRESETS = {
        '1x1': {
            width: 1080,
            height: 1080,
            headerHeight: 280,
            headerGap: 44,
            footerHeight: 100,
            footerGap: 14,
            marginX: 90,
            rowHeight: 86,
            rowInset: 10,
            maxRows: VIDEO_MAX_ROWS,
            minRowHeight: 48,
            topBarHeight: 16,
            badge: { w: 220, h: 42, y: 64, textSize: 15 },
            title: { size: 56, offset: 82 },
            subtitle: { size: 21, offset: 132 },
            table: { headSize: 18, headOffset: 20, dateSize: 24, bagSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 96, h: 36 },
            footer: { logo: 44, titleSize: 22, infoSize: 18 },
            columns: { airline: 0.4, time: 0.62, baggage: 0.78 },
            minDuration: 9000,
            motion: {
                rowsStart: 1300,
                rowStagger: 700,
                rowReveal: 650,
                rowSlide: 18,
                footerDelay: 600,
                footerReveal: 700,
                hold: 2000,
                parallaxAmp: 4,
                parallaxSpeed: 2200,
                topShiftAmp: 0.12,
                topShiftSpeed: 2200,
                badgePulseAmp: 0.015,
                badgePulseSpeed: 1200,
                headerFade: 900,
                titleRise: 8,
                subtitleRise: 10
            }
        },
        '9x16': {
            width: 1080,
            height: 1920,
            headerHeight: 400,
            headerGap: 60,
            footerHeight: 110,
            footerGap: 18,
            marginX: 70,
            rowHeight: 92,
            rowInset: 10,
            maxRows: VIDEO_MAX_ROWS,
            minRowHeight: 54,
            topBarHeight: 16,
            badge: { w: 240, h: 44, y: 76, textSize: 16 },
            title: { size: 58, offset: 92 },
            subtitle: { size: 22, offset: 148 },
            table: { headSize: 19, headOffset: 24, dateSize: 26, bagSize: 22, timeSize: 22, fareSize: 26 },
            logo: { maxW: 110, h: 40 },
            footer: { logo: 48, titleSize: 24, infoSize: 20 },
            columns: { airline: 0.4, time: 0.62, baggage: 0.78 },
            minDuration: 10000,
            motion: {
                rowsStart: 1500,
                rowStagger: 760,
                rowReveal: 700,
                rowSlide: 20,
                footerDelay: 650,
                footerReveal: 760,
                hold: 2200,
                parallaxAmp: 5,
                parallaxSpeed: 2400,
                topShiftAmp: 0.14,
                topShiftSpeed: 2400,
                badgePulseAmp: 0.015,
                badgePulseSpeed: 1300,
                headerFade: 1000,
                titleRise: 10,
                subtitleRise: 12
            }
        },
        '16x9': {
            width: 1920,
            height: 1080,
            headerHeight: 260,
            headerGap: 44,
            footerHeight: 88,
            footerGap: 14,
            marginX: 200,
            rowHeight: 78,
            rowInset: 10,
            maxRows: VIDEO_MAX_ROWS,
            minRowHeight: 50,
            topBarHeight: 16,
            badge: { w: 240, h: 40, y: 48, textSize: 15 },
            title: { size: 64, offset: 70 },
            subtitle: { size: 20, offset: 118 },
            table: { headSize: 18, headOffset: 18, dateSize: 22, bagSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 110, h: 36 },
            footer: { logo: 42, titleSize: 22, infoSize: 18 },
            columns: { airline: 0.4, time: 0.62, baggage: 0.78 },
            minDuration: 8000,
            motion: {
                rowsStart: 1100,
                rowStagger: 620,
                rowReveal: 600,
                rowSlide: 16,
                footerDelay: 520,
                footerReveal: 650,
                hold: 1800,
                parallaxAmp: 3,
                parallaxSpeed: 2000,
                topShiftAmp: 0.12,
                topShiftSpeed: 2200,
                badgePulseAmp: 0.012,
                badgePulseSpeed: 1100,
                headerFade: 850,
                titleRise: 8,
                subtitleRise: 10
            }
        }
    };

    function getPreset(ratioKey) {
        return RATIO_PRESETS[ratioKey] || RATIO_PRESETS['1x1'];
    }

    function mulberry32(seed) {
        let t = seed >>> 0;
        return () => {
            t += 0x6D2B79F5;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }

    function randomSeed() {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const buf = new Uint32Array(1);
            crypto.getRandomValues(buf);
            return buf[0];
        }
        return Math.floor(Math.random() * 1_000_000_000);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function hslToHex(h, s, l) {
        const hue = ((h % 360) + 360) % 360;
        const sat = clamp(s, 0, 100) / 100;
        const light = clamp(l, 0, 100) / 100;
        const c = (1 - Math.abs(2 * light - 1)) * sat;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = light - c / 2;
        let r = 0, g = 0, b = 0;
        if (hue < 60) { r = c; g = x; }
        else if (hue < 120) { r = x; g = c; }
        else if (hue < 180) { g = c; b = x; }
        else if (hue < 240) { g = x; b = c; }
        else if (hue < 300) { r = x; b = c; }
        else { r = c; b = x; }
        const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function hexToRgb(hex) {
        const raw = hex.replace('#', '').trim();
        const full = raw.length === 3
            ? raw.split('').map(c => c + c).join('')
            : raw.padEnd(6, '0');
        const num = parseInt(full, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    function rgbaFromHex(hex, alpha) {
        const { r, g, b } = hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
    }

    function pickHue(rand, lastHue) {
        let hue = Math.floor(rand() * 360);
        let guard = 0;
        while (lastHue !== null) {
            const diff = Math.abs(hue - lastHue);
            const wrapped = Math.min(diff, 360 - diff);
            if (wrapped >= 32) break;
            hue = Math.floor(rand() * 360);
            guard += 1;
            if (guard > 8) break;
        }
        return hue;
    }

    function generateVideoTheme(seed, lastHue) {
        const rand = mulberry32(seed);
        const hue = pickHue(rand, lastHue);
        const accent = hslToHex(hue, 82, 54);
        const accentSoft = hslToHex(hue, 72, 62);
        const accentAlt = hslToHex((hue + 28) % 360, 85, 56);
        const headerBg = hslToHex(hue, 42, 17);
        const rowAlt = hslToHex(hue, 70, 96);
        return {
            id: `gen-${hue}`,
            __hue: hue,
            topBar: [accent, accentAlt, accentSoft],
            headerBg,
            headerOverlayFrom: headerBg,
            headerOverlayTo: rgbaFromHex(headerBg, 0),
            badgeBg: rgbaFromHex(accent, 0.22),
            badgeBorder: rgbaFromHex(accentAlt, 0.45),
            badgeText: hslToHex(hue, 70, 92),
            subtitle: hslToHex(hue, 70, 88),
            accent: accentAlt,
            bodyBg: '#f8fafc',
            tableHeadText: '#64748b',
            rowAlt,
            sectorText: hslToHex(hue, 78, 36),
            fareBadgeBg: hslToHex(hue, 48, 20),
            fareBadgeText: '#ffffff',
            footerBg: '#ffffff',
            footerBorder: '#f1f5f9',
            footerText: '#1e293b',
            footerAccent: accent
        };
    }

    function normalizeFlightTime(value) {
        if (!value) return '';
        const raw = String(value).trim();
        if (!raw) return '';
        const cleaned = raw.replace(/[–—]/g, '-').replace(/\s+/g, ' ');
        if (!cleaned.includes('-')) return cleaned;
        const parts = cleaned.split('-').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
        return parts[0] || cleaned;
    }

    function pickRandomTheme() {
        const seed = randomSeed();
        const theme = generateVideoTheme(seed, lastVideoThemeHue);
        if (theme && theme.__hue !== undefined) lastVideoThemeHue = theme.__hue;
        return theme;
    }

    return new Promise(async (resolve, reject) => {
        let safeResolve = resolve;
        let safeReject = reject;
        let cleanupPosterAssets = () => { };
        try {
            // 1. Dimensions setup
            const preset = getPreset(ratioKey);
            const {
                autoDownload = true,
                returnBlob = false,
                renderScale,
                forceMimeType,
                mimeCandidates,
                retryAttempt = 0,
                requireMp4 = false,
                posterFrames = []
            } = options || {};
            const { width, height } = preset;

            const canvas = document.createElement('canvas');
            const targetScale = clamp(renderScale ?? 1, 0.5, 1);
            const rawWidth = Math.round(width * targetScale);
            const rawHeight = Math.round(height * targetScale);
            let canvasWidth = rawWidth - (rawWidth % 2);
            let canvasHeight = rawHeight - (rawHeight % 2);
            canvasWidth = Math.max(2, canvasWidth);
            canvasHeight = Math.max(2, canvasHeight);
            let scale = Math.min(canvasWidth / width, canvasHeight / height);
            canvasWidth = Math.max(2, Math.round(width * scale));
            canvasHeight = Math.max(2, Math.round(height * scale));
            if (canvasWidth % 2 !== 0) canvasWidth -= 1;
            if (canvasHeight % 2 !== 0) canvasHeight -= 1;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            const finalScale = canvas.width / width;
            scale = finalScale;
            if (finalScale !== 1) {
                ctx.setTransform(finalScale, 0, 0, finalScale, 0, 0);
            }

            // 2. Pre-load assets
            let titleText = 'MULTIPLE → SECTORS';
            if (sectorId !== 'all') {
                const sector = sectors.find(s => s.id === sectorId);
                const originName = sector ? (sector.sectorFrom || 'DEP').toUpperCase() : 'DEP';
                const destName = sector ? (sector.sectorTo || 'ARR').toUpperCase() : 'ARR';
                titleText = `${originName} → ${destName}`;
            }
            const theme = pickRandomTheme();
            const motion = preset.motion;

            const airlineMap = {};
            airlines.forEach(a => {
                if (a.id) airlineMap[a.id.trim().toLowerCase()] = a;
                if (a.code) airlineMap[a.code.trim().toLowerCase()] = a;
                if (a.name) airlineMap[a.name.trim().toLowerCase()] = a;
            });

            const getAirline = (rawId) => {
                if (!rawId) return null;
                return airlineMap[String(rawId).trim().toLowerCase()];
            };

            const toAirlineKey = (rawId) => {
                const airline = getAirline(rawId);
                if (airline?.id) return airline.id;
                return String(rawId || '').trim().toLowerCase();
            };

            const toTimeKey = (rawTime) => normalizeFlightTime(rawTime).replace(/\s+/g, '');

            // Deduplicate flights (same sector, airline, date, time) taking the cheapest rate
            const groupedFaresMap = new Map();
            fares.forEach(fare => {
                const dtTime = fare.flightDate instanceof Date ? fare.flightDate.getTime() : fare.flightDate;
                const airlineKey = toAirlineKey(fare.airlineId);
                const timeKey = toTimeKey(fare.flightTime);
                const key = `${fare.sectorId}_${airlineKey}_${dtTime}_${timeKey}`;
                if (!groupedFaresMap.has(key)) {
                    groupedFaresMap.set(key, fare);
                } else {
                    if (fare.finalRate < groupedFaresMap.get(key).finalRate) {
                        groupedFaresMap.set(key, fare);
                    }
                }
            });
            const uniqueLowestFares = Array.from(groupedFaresMap.values());

            const sortedFares = uniqueLowestFares.sort((a, b) => {
                let valA = a.flightDate, valB = b.flightDate;
                if (valA instanceof Date) valA = valA.getTime();
                if (valB instanceof Date) valB = valB.getTime();
                return valA - valB;
            });

            const sectorMap = {};
            sectors.forEach(s => {
                sectorMap[s.id] = s.sectorCode || s.id;
            });

            const fileSafe = (s) =>
                String(s || '')
                    .trim()
                    .replace(/[^a-z0-9]+/gi, '-')
                    .replace(/^-+|-+$/g, '')
                    .toLowerCase();

            let sectorSlug = 'all-sectors';
            if (sectorId !== 'all') {
                const sector = sectors.find(s => s.id === sectorId);
                const raw = sector?.sectorCode
                    || (sector ? `${sector.sectorFrom || ''}-${sector.sectorTo || ''}` : '')
                    || sectorMap[sectorId]
                    || sectorId;
                sectorSlug = fileSafe(raw) || fileSafe(sectorId) || 'sector';
            }

            const providedPosterFrames = Array.isArray(posterFrames)
                ? posterFrames.filter((frame) => frame?.blob)
                : [];
            let posterFrameAssets = [];
            if (providedPosterFrames.length) {
                posterFrameAssets = (await Promise.all(providedPosterFrames.map((frame) => loadPosterFrameAsset(frame))))
                    .filter(Boolean);
            }
            const usePosterFrameSlideshow = posterFrameAssets.length > 0;

            const arrow = '→';
            const maxTitleWidth = width - (preset.marginX * 1.4);
            let fittedTitleSize = preset.title.size;
            const measureTitleWidth = (size) => {
                ctx.font = `900 ${size}px Arial, sans-serif`;
                if (titleText.includes(arrow)) {
                    const parts = titleText.split(arrow);
                    const left = parts[0].trim();
                    const right = parts[1].trim();
                    const arrowText = ` ${arrow} `;
                    return ctx.measureText(left).width + ctx.measureText(arrowText).width + ctx.measureText(right).width;
                }
                return ctx.measureText(titleText).width;
            };
            while (fittedTitleSize > 42 && measureTitleWidth(fittedTitleSize) > maxTitleWidth) {
                fittedTitleSize -= 2;
            }

            async function fetchLogoImage(url) {
                if (!url) return null;
                try {
                    const res = await fetch(url);
                    if (!res.ok) return null;
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    return new Promise((res, rej) => {
                        const img = new Image();
                        img.onload = () => res(img);
                        img.onerror = () => res(null); // Return null on error so we don't break
                        img.src = objectUrl;
                    });
                } catch { return null; }
            }

            let bgImg = null;
            let logoImg = null;
            const loadedLogos = {};
            if (!usePosterFrameSlideshow) {
                bgImg = new Image();
                await new Promise((res) => {
                    bgImg.onload = res;
                    bgImg.onerror = res;
                    bgImg.src = '/assets/img/hero-banner-bg.png';
                });

                logoImg = new Image();
                await new Promise((res) => {
                    logoImg.onload = res;
                    logoImg.onerror = res;
                    logoImg.src = '/assets/img/logo.webp';
                });

                const uniqueAirlines = [...new Set(sortedFares.map(f => f.airlineId))]
                    .map(id => getAirline(id))
                    .filter(a => a && a.logoUrl);
                await Promise.all(uniqueAirlines.map(async a => {
                    const img = await fetchLogoImage(a.logoUrl);
                    if (img) {
                        loadedLogos[a.id] = img;
                    }
                }));
            }

            // 3. Animation timing + layout
            let totalDuration = 0;
            let renderFrame = () => { };
            const fps = 30;
            const frameDuration = 1000 / fps;
            let elapsed = 0;
            let lastTick = performance.now();

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
            const drawRoundedRect = (x, y, w, h, r) => drawRoundedRectPath(ctx, x, y, w, h, r);

            if (usePosterFrameSlideshow) {
                const slideshowLayout = getPosterFrameSlideshowLayout(ratioKey, width, height);
                const pageDuration = Math.max(
                    slideshowLayout.pageDuration,
                    Math.ceil((preset.minDuration || slideshowLayout.pageDuration) / posterFrameAssets.length)
                );
                const transitionDuration = Math.min(
                    slideshowLayout.transition,
                    Math.max(360, Math.floor(pageDuration * 0.22))
                );
                totalDuration = pageDuration * posterFrameAssets.length;

                renderFrame = (elapsedMs) => {
                    const safeElapsed = Math.max(0, Math.min(elapsedMs, Math.max(0, totalDuration - 1)));
                    const currentIndex = Math.min(
                        posterFrameAssets.length - 1,
                        Math.floor(safeElapsed / pageDuration)
                    );
                    const currentStart = currentIndex * pageDuration;
                    const pageElapsed = safeElapsed - currentStart;
                    const nextIndex = currentIndex + 1;
                    const hasNext = nextIndex < posterFrameAssets.length;
                    const transitionStart = pageDuration - transitionDuration;
                    const transitionProgress = hasNext && pageElapsed >= transitionStart
                        ? Math.max(0, Math.min(1, (pageElapsed - transitionStart) / transitionDuration))
                        : 0;

                    drawPosterVideoBackdrop(ctx, width, height, safeElapsed);
                    drawPosterFrameScene(
                        ctx,
                        posterFrameAssets[currentIndex],
                        ratioKey,
                        width,
                        height,
                        pageElapsed,
                        1 - transitionProgress
                    );

                    if (hasNext && transitionProgress > 0) {
                        drawPosterFrameScene(
                            ctx,
                            posterFrameAssets[nextIndex],
                            ratioKey,
                            width,
                            height,
                            pageElapsed - transitionStart,
                            transitionProgress
                        );
                    }

                    drawPosterFramePagination(
                        ctx,
                        width,
                        height,
                        posterFrameAssets.length,
                        currentIndex + transitionProgress,
                        ratioKey
                    );
                };
            } else {
                const headerHeight = preset.headerHeight;
                const footerHeight = preset.footerHeight;
                const startY = headerHeight + preset.headerGap;
                const availableHeight = height - startY - footerHeight - preset.footerGap;
                const desiredRows = Math.min(sortedFares.length || 1, preset.maxRows || VIDEO_MAX_ROWS);
                const minRowHeight = preset.minRowHeight || 44;
                let rowsPerPage = Math.max(1, desiredRows);
                let rawRowHeight = Math.floor(availableHeight / rowsPerPage);
                if (rawRowHeight < minRowHeight) {
                    rowsPerPage = Math.max(1, Math.floor(availableHeight / minRowHeight));
                    rowsPerPage = Math.min(rowsPerPage, desiredRows);
                    rawRowHeight = Math.floor(availableHeight / rowsPerPage);
                }
                const rowHeight = Math.min(preset.rowHeight, rawRowHeight);
                const rowScale = Math.min(1, rowHeight / preset.rowHeight);
                const rowInset = Math.max(6, Math.round(preset.rowInset * rowScale));
                const cornerRadius = Math.max(8, Math.round(12 * rowScale));
                const maxRows = Math.max(1, Math.min(rowsPerPage, Math.floor(availableHeight / rowHeight)));
                rowsPerPage = maxRows;
                const pages = [];
                for (let i = 0; i < sortedFares.length; i += rowsPerPage) {
                    pages.push(sortedFares.slice(i, i + rowsPerPage));
                }
                if (!pages.length) pages.push([]);
                const tableSizes = {
                    headSize: Math.max(12, Math.round(preset.table.headSize * rowScale)),
                    headOffset: Math.round(preset.table.headOffset * rowScale),
                    dateSize: Math.max(14, Math.round(preset.table.dateSize * rowScale)),
                    bagSize: Math.max(12, Math.round(preset.table.bagSize * rowScale)),
                    timeSize: Math.max(12, Math.round(preset.table.timeSize * rowScale)),
                    fareSize: Math.max(14, Math.round(preset.table.fareSize * rowScale))
                };
                const logoDims = {
                    maxW: Math.max(70, Math.round(preset.logo.maxW * rowScale)),
                    h: Math.max(22, Math.round(preset.logo.h * rowScale))
                };
                const fareBadge = {
                    height: Math.max(30, Math.round(50 * rowScale)),
                    padX: Math.max(14, Math.round(20 * rowScale))
                };
                const rowTextOffset = Math.round(5 * rowScale);

                const rowsStart = motion.rowsStart;
                const pageMeta = [];
                pages.forEach((page) => {
                    const rowCount = Math.max(1, page.length);
                    const footerEntryTime = rowsStart + (rowCount * motion.rowStagger) + motion.footerDelay;
                    const duration = Math.max(
                        footerEntryTime + motion.footerReveal + motion.hold,
                        preset.minDuration || 0
                    );
                    pageMeta.push({
                        page,
                        rowCount,
                        footerEntryTime,
                        start: totalDuration,
                        end: totalDuration + duration
                    });
                    totalDuration += duration;
                });

                renderFrame = (elapsedMs) => {
                    const activePage = pageMeta.find(meta => elapsedMs <= meta.end) || pageMeta[pageMeta.length - 1];
                    const pageElapsed = elapsedMs - (activePage?.start || 0);
                    const visibleFares = activePage?.page || [];
                    const footerEntryTime = activePage?.footerEntryTime || 0;
                    const rowCount = activePage?.rowCount || 1;
                    const listOffset = Math.max(0, (availableHeight - (rowCount * rowHeight)) / 2);
                    const listStartY = startY + listOffset;

                    ctx.fillStyle = theme.bodyBg;
                    ctx.fillRect(0, 0, width, height);

                    const wash = ctx.createLinearGradient(0, 0, width, height);
                    wash.addColorStop(0, 'rgba(255,255,255,0.35)');
                    wash.addColorStop(0.5, 'rgba(255,255,255,0)');
                    wash.addColorStop(1, 'rgba(37,99,235,0.06)');
                    ctx.fillStyle = wash;
                    ctx.fillRect(0, 0, width, height);

                    ctx.fillStyle = theme.headerBg;
                    ctx.fillRect(0, 0, width, headerHeight);
                    if (bgImg?.complete && bgImg.width > 0) {
                        const parallax = motion.parallaxAmp * Math.sin(pageElapsed / motion.parallaxSpeed);
                        ctx.globalAlpha = 0.22;
                        const bgScale = Math.max(width / bgImg.width, headerHeight / bgImg.height);
                        const dw = bgImg.width * bgScale;
                        const dh = bgImg.height * bgScale;
                        const dx = (width - dw) / 2;
                        const dy = (headerHeight - dh) / 2 + parallax;
                        ctx.drawImage(bgImg, dx, dy, dw, dh);
                        ctx.globalAlpha = 1.0;
                    }

                    const grad = ctx.createLinearGradient(0, 0, 0, headerHeight);
                    grad.addColorStop(0, theme.headerOverlayFrom);
                    grad.addColorStop(1, theme.headerOverlayTo);
                    ctx.fillStyle = grad;
                    ctx.globalAlpha = 0.8;
                    ctx.fillRect(0, 0, width, headerHeight);
                    ctx.globalAlpha = 1.0;

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const topShift = (Math.sin(pageElapsed / motion.topShiftSpeed) + 1) / 2;
                    const topGrad = ctx.createLinearGradient(
                        -width * motion.topShiftAmp * topShift,
                        0,
                        width * (1 + motion.topShiftAmp * topShift),
                        0
                    );
                    topGrad.addColorStop(0, theme.topBar[0]);
                    topGrad.addColorStop(0.5, theme.topBar[1]);
                    topGrad.addColorStop(1, theme.topBar[2]);
                    ctx.fillStyle = topGrad;
                    ctx.fillRect(0, 0, width, preset.topBarHeight);

                    const badgeW = preset.badge.w;
                    const badgeH = preset.badge.h;
                    const badgeY = preset.badge.y;
                    const badgePulse = 1 + motion.badgePulseAmp * Math.sin(pageElapsed / motion.badgePulseSpeed);
                    const badgeWidth = badgeW * badgePulse;
                    const badgeX = (width / 2) - (badgeWidth / 2);
                    ctx.fillStyle = theme.badgeBg;
                    drawRoundedRect(badgeX, badgeY, badgeWidth, badgeH, 20);
                    ctx.fill();
                    ctx.strokeStyle = theme.badgeBorder;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    ctx.fillStyle = theme.badgeText;
                    ctx.font = `bold ${preset.badge.textSize}px Arial, sans-serif`;
                    ctx.fillText('EXCLUSIVE DEALS', width / 2, badgeY + (badgeH / 2));

                    const titleSize = fittedTitleSize;
                    ctx.font = `900 ${titleSize}px Arial, sans-serif`;
                    ctx.textBaseline = 'middle';
                    const headerT = easeOutCubic(Math.min(1, pageElapsed / motion.headerFade));
                    if (titleText.includes(arrow)) {
                        const parts = titleText.split(arrow);
                        const left = parts[0].trim();
                        const right = parts[1].trim();
                        const arrowText = ` ${arrow} `;
                        ctx.textAlign = 'left';
                        const leftWidth = ctx.measureText(left).width;
                        const arrowWidth = ctx.measureText(arrowText).width;
                        const rightWidth = ctx.measureText(right).width;
                        const totalWidth = leftWidth + arrowWidth + rightWidth;
                        const startX = (width - totalWidth) / 2;
                        const titleY = badgeY + preset.title.offset - (motion.titleRise * (1 - headerT));
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(left, startX, titleY);
                        ctx.fillStyle = theme.accent;
                        ctx.fillText(arrowText, startX + leftWidth, titleY);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(right, startX + leftWidth + arrowWidth, titleY);
                        ctx.textAlign = 'center';
                    } else {
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        const titleY = badgeY + preset.title.offset - (motion.titleRise * (1 - headerT));
                        ctx.fillText(titleText, width / 2, titleY);
                    }

                    const subtitleT = easeOutCubic(Math.min(1, Math.max(0, (pageElapsed - 120) / (motion.headerFade + 200))));
                    ctx.fillStyle = theme.subtitle;
                    ctx.font = `700 ${preset.subtitle.size}px Arial, sans-serif`;
                    const subtitleY = badgeY + preset.subtitle.offset - (motion.subtitleRise * (1 - subtitleT));
                    ctx.globalAlpha = subtitleT;
                    ctx.fillText('LIVE FARES AVAILABLE NOW', width / 2, subtitleY);
                    ctx.globalAlpha = 1.0;

                    const marginX = preset.marginX;
                    const listWidth = width - (marginX * 2);

                    ctx.fillStyle = theme.tableHeadText;
                    ctx.font = `bold ${tableSizes.headSize}px Arial, sans-serif`;
                    ctx.textAlign = 'left';
                    ctx.fillText('DATE', marginX + 20, listStartY - tableSizes.headOffset);

                    ctx.textAlign = 'center';
                    ctx.fillText('AIRLINE', marginX + (listWidth * preset.columns.airline), listStartY - tableSizes.headOffset);
                    ctx.fillText('TIME', marginX + (listWidth * preset.columns.time), listStartY - tableSizes.headOffset);
                    ctx.fillText('BAGGAGE', marginX + (listWidth * preset.columns.baggage), listStartY - tableSizes.headOffset);

                    ctx.textAlign = 'right';
                    ctx.fillText('FARE', marginX + listWidth - 20, listStartY - tableSizes.headOffset);

                    for (let i = 0; i < visibleFares.length; i++) {
                        const f = visibleFares[i];
                        const entryTime = rowsStart + (i * motion.rowStagger);
                        if (pageElapsed < entryTime) continue;

                        const fadeDuration = motion.rowReveal;
                        const progress = Math.min(1, (pageElapsed - entryTime) / fadeDuration);
                        const opacity = easeInOut(progress);
                        const slideOffset = motion.rowSlide * (1 - opacity);
                        const rowY = listStartY + (i * rowHeight) + slideOffset;

                        ctx.globalAlpha = opacity;

                        const rowBg = i % 2 === 0 ? '#ffffff' : theme.rowAlt;
                        ctx.fillStyle = rowBg;
                        drawRoundedRect(marginX, rowY, listWidth, rowHeight - rowInset, cornerRadius);
                        ctx.fill();

                        ctx.fillStyle = '#0f172a';
                        ctx.textBaseline = 'middle';

                        const dt = f.flightDate instanceof Date
                            ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
                            : f.flightDate;
                        ctx.textAlign = 'left';
                        ctx.font = `900 ${tableSizes.dateSize}px Arial, sans-serif`;
                        ctx.fillText(dt, marginX + 20, rowY + (rowHeight / 2) - rowTextOffset);

                        const centerX = marginX + (listWidth * preset.columns.airline);
                        const airlineObj = getAirline(f.airlineId);
                        const logo = airlineObj ? loadedLogos[airlineObj.id] : null;
                        if (logo && logo.width > 0) {
                            const logoW = Math.min(logoDims.maxW, logo.width);
                            const logoH = logoDims.h;
                            ctx.drawImage(logo, centerX - (logoW / 2), rowY + (rowHeight / 2) - rowTextOffset - (logoH / 2), logoW, logoH);
                        } else {
                            ctx.font = `700 ${Math.max(14, tableSizes.bagSize - 2)}px Arial, sans-serif`;
                            ctx.textAlign = 'center';
                            const aName = airlineObj?.name || f.airlineId || '—';
                            ctx.fillText(aName, centerX, rowY + (rowHeight / 2) - rowTextOffset);
                        }

                        const timeText = normalizeFlightTime(f.flightTime) || '—';
                        ctx.font = `800 ${tableSizes.timeSize}px Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillText(timeText, marginX + (listWidth * preset.columns.time), rowY + (rowHeight / 2) - rowTextOffset);

                        const baggageText = formatPosterBaggageDisplay(f.baggage, f.extraBaggage);
                        ctx.font = `700 ${tableSizes.bagSize}px Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.fillStyle = baggageText === '—' ? '#94a3b8' : theme.sectorText;
                        ctx.fillText(baggageText, marginX + (listWidth * preset.columns.baggage), rowY + (rowHeight / 2) - rowTextOffset);
                        ctx.fillStyle = '#0f172a';

                        const posterRate = getPosterRateDisplay(f.finalRate, f.flightDate);
                        const fareText = posterRate.displayLabel;
                        ctx.font = `900 ${tableSizes.fareSize}px Arial, sans-serif`;
                        ctx.textAlign = 'right';

                        const textW = ctx.measureText(fareText).width;
                        const badgeRight = marginX + listWidth - 20;
                        const badgeW = textW + (fareBadge.padX * 2);
                        const badgeH = fareBadge.height;

                        ctx.fillStyle = theme.fareBadgeBg;
                        drawRoundedRect(badgeRight - badgeW, rowY + (rowHeight / 2) - rowTextOffset - (badgeH / 2), badgeW, badgeH, cornerRadius);
                        ctx.fill();

                        ctx.fillStyle = theme.fareBadgeText;
                        ctx.fillText(fareText, badgeRight - fareBadge.padX, rowY + (rowHeight / 2) - rowTextOffset);

                        ctx.globalAlpha = 1.0;
                    }

                    if (pageElapsed > footerEntryTime) {
                        const footerOpacity = easeInOut(Math.min(1, (pageElapsed - footerEntryTime) / motion.footerReveal));
                        ctx.globalAlpha = footerOpacity;

                        const fHeight = footerHeight;
                        const fY = height - fHeight + (20 * (1 - footerOpacity));

                        ctx.fillStyle = theme.footerBg;
                        ctx.fillRect(0, height - fHeight, width, fHeight);
                        ctx.fillRect(0, fY, width, fHeight);

                        ctx.fillStyle = theme.footerBorder;
                        ctx.fillRect(0, height - fHeight, width, 2);

                        if (logoImg?.complete && logoImg.width > 0) {
                            ctx.drawImage(logoImg, marginX, height - (fHeight / 2) - 24, preset.footer.logo, preset.footer.logo);
                        }

                        ctx.fillStyle = theme.footerText;
                        ctx.font = `900 ${preset.footer.titleSize}px Arial, sans-serif`;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('Zamra Travels', marginX + (preset.footer.logo + 16), height - (fHeight / 2));

                        ctx.font = `700 ${preset.footer.infoSize}px Arial, sans-serif`;
                        ctx.textAlign = 'right';
                        ctx.fillStyle = theme.footerText;
                        ctx.fillText('zamratravels.com  |  +91 9846606739', width - marginX, height - (fHeight / 2));

                        ctx.globalAlpha = 1.0;
                    }
                };
            }

            // 4. Start recording after the full render duration is known so audio can
            // loop cleanly across multi-page slideshow exports.
            const stream = canvas.captureStream(fps);
            const audioState = await attachBackgroundAudioTrack(stream, { durationMs: totalDuration });
            const mimeType = pickMimeType({
                forceMimeType,
                candidates: mimeCandidates || getMimeCandidates()
            });
            if (!mimeType) {
                throw new Error('No supported video mime type available for this browser.');
            }

            const recorder = new MediaRecorder(stream, { mimeType });
            const chunks = [];
            let settled = false;
            let stopped = false;
            safeResolve = (value) => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            safeReject = (error) => {
                if (settled) return;
                settled = true;
                reject(error);
            };
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };
            const cleanupAudio = () => {
                try { audioState?.source?.stop(); } catch (_) { }
                try { audioState?.oscillator?.stop(); } catch (_) { }
                try { audioState?.audioTrack?.stop(); } catch (_) { }
                try { audioState?.audioCtx?.close(); } catch (_) { }
            };
            cleanupPosterAssets = () => {
                cleanupPosterFrameAssets(posterFrameAssets);
                posterFrameAssets = [];
            };
            const stopRecorder = () => {
                if (stopped) return;
                stopped = true;
                try {
                    if (recorder.state === 'recording') recorder.stop();
                } catch (err) {
                    console.error('Error stopping recorder', err);
                }
            };

            const timeslice = 1000;
            recorder.start(timeslice);

            function drawFrame(now) {
                if (stopped) return;
                const delta = Math.min(Math.max(0, now - lastTick), frameDuration);
                lastTick = now;
                elapsed += delta;
                let shouldStop = false;

                if (elapsed > totalDuration) {
                    elapsed = totalDuration;
                    shouldStop = true;
                }

                renderFrame(elapsed);

                if (shouldStop) {
                    stopRecorder();
                    return;
                }
                requestAnimationFrame(drawFrame);
            }

            const safetyStop = setTimeout(() => {
                if (!stopped && recorder.state === 'recording') {
                    stopRecorder();
                }
            }, totalDuration + 1500);

            // Start loop
            requestAnimationFrame(drawFrame);

            // 5. Handle recording completion
            recorder.onstop = async () => {
                clearTimeout(safetyStop);
                cleanupAudio();
                const blob = new Blob(chunks, { type: mimeType });
                if (!blob || !blob.size) {
                    if (retryAttempt < 1) {
                        if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed. Retrying at a smaller size…');
                        try {
                            try {
                                stream.getTracks().forEach(track => track.stop());
                            } catch (_) { }
                            cleanupPosterAssets();
                            const retry = await downloadVideoPoster(ratioKey, fares, sectorId, sectors, airlines, {
                                ...options,
                                renderScale: Math.min(scale, 0.8),
                                forceMimeType: null,
                                mimeCandidates: getMimeCandidates(),
                                retryAttempt: retryAttempt + 1,
                                requireMp4
                            });
                            safeResolve(retry);
                            return;
                        } catch (retryError) {
                            console.error('Video retry failed:', retryError);
                        }
                    }
                    if (window.toast) window.toast('error', 'Generation Error', 'No video data was produced.');
                    try {
                        stream.getTracks().forEach(track => track.stop());
                    } catch (_) { }
                    cleanupPosterAssets();
                    safeReject(new Error('No video data generated.'));
                    return;
                }

                if (!requireMp4) {
                    const isValid = await validateVideoBlob(blob, ratioKey);
                    if (!isValid) {
                        if (retryAttempt < 1) {
                            if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed validation. Retrying at a smaller size…');
                            try {
                                try {
                                    stream.getTracks().forEach(track => track.stop());
                                } catch (_) { }
                                cleanupPosterAssets();
                                const retry = await downloadVideoPoster(ratioKey, fares, sectorId, sectors, airlines, {
                                    ...options,
                                    renderScale: Math.min(scale, 0.8),
                                    forceMimeType: null,
                                    mimeCandidates: getMimeCandidates(),
                                    retryAttempt: retryAttempt + 1,
                                    requireMp4
                                });
                                safeResolve(retry);
                                return;
                            } catch (retryError) {
                                console.error('Video retry failed:', retryError);
                            }
                        }
                        if (window.toast) window.toast('error', 'Generation Error', 'Video validation failed.');
                        try {
                            stream.getTracks().forEach(track => track.stop());
                        } catch (_) { }
                        cleanupPosterAssets();
                        safeReject(new Error('Video validation failed.'));
                        return;
                    }
                }
                let finalBlob = blob;
                let finalMimeType = mimeType;
                if (requireMp4) {
                    if (mimeType.includes('mp4')) {
                        finalMimeType = 'video/mp4';
                    } else {
                        try {
                            if (window.toast) window.toast('info', 'Video Processing', 'Converting to MP4…');
                            finalBlob = await transcodeToMp4(blob, mimeType);
                            finalMimeType = 'video/mp4';
                        } catch (err) {
                            console.error('MP4 optimization failed:', err);
                            if (window.toast) window.toast('warning', 'Video Processing', 'Could not convert to MP4. Downloading in original format.');
                        }
                    }
                }

                const ext = finalMimeType.includes('mp4') ? 'mp4' : 'webm';
                const filename = `zamra-video-${ratioKey}-${sectorSlug}-${Date.now()}.${ext}`;

                if (autoDownload) {
                    const url = URL.createObjectURL(finalBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                    if (window.toast) window.toast('success', 'Video Generated', `Your ${ratioLabel} video has been downloaded!`);
                }

                try {
                    stream.getTracks().forEach(track => track.stop());
                } catch (_) { }
                cleanupAudio();
                cleanupPosterAssets();

                safeResolve(returnBlob ? { blob: finalBlob, filename, mimeType: finalMimeType } : undefined);
            };

            recorder.onerror = async (e) => {
                console.error("Recorder Error:", e);
                cleanupAudio();
                if (retryAttempt < 1) {
                    if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed. Retrying at a smaller size…');
                    try {
                        cleanupPosterAssets();
                        const retry = await downloadVideoPoster(ratioKey, fares, sectorId, sectors, airlines, {
                            ...options,
                            renderScale: Math.min(scale, 0.8),
                            forceMimeType: null,
                            mimeCandidates: getMimeCandidates(),
                            retryAttempt: retryAttempt + 1,
                            requireMp4
                        });
                        safeResolve(retry);
                        return;
                    } catch (retryError) {
                        console.error('Video retry failed:', retryError);
                    }
                }
                if (window.toast) window.toast('error', 'Generation Error', 'Failed to encode the video stream.');
                try {
                    stream.getTracks().forEach(track => track.stop());
                } catch (_) { }
                cleanupPosterAssets();
                safeReject(e);
            };

        } catch (error) {
            console.error(error);
            if (window.toast) window.toast('error', 'Generation Failed', error.message);
            cleanupPosterAssets();
            safeReject(error);
        }
    });
}
