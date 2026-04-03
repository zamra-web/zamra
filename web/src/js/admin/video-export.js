import { getPosterRateDisplay } from './poster-rate-display.js';

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
        return { audioCtx, oscillator, audioTrack };
    } catch {
        return null;
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

let mp4MuxerModule = null;
async function loadMp4Muxer() {
    if (mp4MuxerModule) return mp4MuxerModule;
    mp4MuxerModule = await import('https://cdn.jsdelivr.net/npm/mp4-muxer@5/build/mp4-muxer.mjs');
    return mp4MuxerModule;
}

function canUseWebCodecs() {
    return typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';
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
            table: { headSize: 18, headOffset: 20, dateSize: 24, sectorSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 96, h: 36 },
            footer: { logo: 44, titleSize: 22, infoSize: 18 },
            columns: { sector: 0.28, airline: 0.5, time: 0.72 },
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
            table: { headSize: 19, headOffset: 24, dateSize: 26, sectorSize: 22, timeSize: 22, fareSize: 26 },
            logo: { maxW: 110, h: 40 },
            footer: { logo: 48, titleSize: 24, infoSize: 20 },
            columns: { sector: 0.29, airline: 0.5, time: 0.71 },
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
            table: { headSize: 18, headOffset: 18, dateSize: 22, sectorSize: 20, timeSize: 20, fareSize: 24 },
            logo: { maxW: 110, h: 36 },
            footer: { logo: 42, titleSize: 22, infoSize: 18 },
            columns: { sector: 0.3, airline: 0.55, time: 0.75 },
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
                requireMp4 = false
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

            // Load hero background
            const bgImg = new Image();
            await new Promise((res) => {
                bgImg.onload = res;
                bgImg.onerror = res;
                bgImg.src = '/assets/img/hero-banner-bg.png';
            });

            // Load Zamra logo
            const logoImg = new Image();
            await new Promise((res) => {
                logoImg.onload = res;
                logoImg.onerror = res;
                logoImg.src = '/assets/img/logo.webp';
            });

            // Preload Airline Logos
            const loadedLogos = {};
            const uniqueAirlines = [...new Set(sortedFares.map(f => f.airlineId))].map(id => getAirline(id)).filter(a => a && a.logoUrl);
            await Promise.all(uniqueAirlines.map(async a => {
                const img = await fetchLogoImage(a.logoUrl);
                if (img) {
                    loadedLogos[a.id] = img;
                }
            }));

            // 3. Start Recording
            const stream = canvas.captureStream(30); // 30 FPS
            const audioState = attachSilentAudioTrack(stream);
            
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
            const safeResolve = (value) => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            const safeReject = (error) => {
                if (settled) return;
                settled = true;
                reject(error);
            };
            recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };
            const cleanupAudio = () => {
                try { audioState?.oscillator?.stop(); } catch (_) { }
                try { audioState?.audioTrack?.stop(); } catch (_) { }
                try { audioState?.audioCtx?.close(); } catch (_) { }
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

            // Start Recorder
            const timeslice = 1000;
            recorder.start(timeslice); // Flush chunks regularly to reduce corruption risk

            // 4. Animation loop
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
                sectorSize: Math.max(12, Math.round(preset.table.sectorSize * rowScale)),
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
            let totalDuration = 0;
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
            const fps = 30;
            const frameDuration = 1000 / fps;
            let elapsed = 0;
            let lastTick = performance.now();

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

            function drawRoundedRect(x, y, w, h, r) {
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

            function renderFrame(elapsedMs) {
                const activePage = pageMeta.find(meta => elapsedMs <= meta.end) || pageMeta[pageMeta.length - 1];
                const pageElapsed = elapsedMs - (activePage?.start || 0);
                const visibleFares = activePage?.page || [];
                const footerEntryTime = activePage?.footerEntryTime || 0;
                const rowCount = activePage?.rowCount || 1;
                const listOffset = Math.max(0, (availableHeight - (rowCount * rowHeight)) / 2);
                const listStartY = startY + listOffset;

                // --- Draw Background ---
                ctx.fillStyle = theme.bodyBg;
                ctx.fillRect(0, 0, width, height);

                // Ambient gradient wash for premium depth
                const wash = ctx.createLinearGradient(0, 0, width, height);
                wash.addColorStop(0, 'rgba(255,255,255,0.35)');
                wash.addColorStop(0.5, 'rgba(255,255,255,0)');
                wash.addColorStop(1, 'rgba(37,99,235,0.06)');
                ctx.fillStyle = wash;
                ctx.fillRect(0, 0, width, height);

                // --- Draw Header Area ---
                // Depending on ratio, header height changes
                // Use precomputed headerHeight
                
                // Draw Hero Image with overlay
                ctx.fillStyle = theme.headerBg;
                ctx.fillRect(0, 0, width, headerHeight);
                if (bgImg.complete && bgImg.width > 0) {
                    const parallax = motion.parallaxAmp * Math.sin(pageElapsed / motion.parallaxSpeed);
                    ctx.globalAlpha = 0.22;
                    // Cover logic
                    const scale = Math.max(width / bgImg.width, headerHeight / bgImg.height);
                    const dw = bgImg.width * scale;
                    const dh = bgImg.height * scale;
                    const dx = (width - dw) / 2;
                    const dy = (headerHeight - dh) / 2 + parallax;
                    ctx.drawImage(bgImg, dx, dy, dw, dh);
                    ctx.globalAlpha = 1.0;
                }

                // Gradient overlay
                const grad = ctx.createLinearGradient(0, 0, 0, headerHeight);
                grad.addColorStop(0, theme.headerOverlayFrom);
                grad.addColorStop(1, theme.headerOverlayTo);
                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.8;
                ctx.fillRect(0, 0, width, headerHeight);
                ctx.globalAlpha = 1.0;

                // Header Text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Top Decor
                const topShift = (Math.sin(pageElapsed / motion.topShiftSpeed) + 1) / 2;
                const topGrad = ctx.createLinearGradient(-width * motion.topShiftAmp * topShift, 0, width * (1 + motion.topShiftAmp * topShift), 0);
                topGrad.addColorStop(0, theme.topBar[0]);
                topGrad.addColorStop(0.5, theme.topBar[1]);
                topGrad.addColorStop(1, theme.topBar[2]);
                ctx.fillStyle = topGrad;
                ctx.fillRect(0, 0, width, preset.topBarHeight);

                // Badge
                const badgeW = preset.badge.w, badgeH = preset.badge.h;
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
                ctx.fillText('EXCLUSIVE DEALS', width/2, badgeY + (badgeH/2));

                // Title
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
                    ctx.fillText(titleText, width/2, titleY);
                }
                
                // Subtitle
                const subtitleT = easeOutCubic(Math.min(1, Math.max(0, (pageElapsed - 120) / (motion.headerFade + 200))));
                ctx.fillStyle = theme.subtitle;
                ctx.font = `700 ${preset.subtitle.size}px Arial, sans-serif`;
                const subtitleY = badgeY + preset.subtitle.offset - (motion.subtitleRise * (1 - subtitleT));
                ctx.globalAlpha = subtitleT;
                ctx.fillText('SPECIAL FARES AVAILABLE NOW', width/2, subtitleY);
                ctx.globalAlpha = 1.0;

                // --- Draw Fares ---
                // Layout calculations
                const marginX = preset.marginX;
                const listWidth = width - (marginX * 2);

                // Draw Table Header
                ctx.fillStyle = theme.tableHeadText;
                ctx.font = `bold ${tableSizes.headSize}px Arial, sans-serif`;
                ctx.textAlign = 'left';
                ctx.fillText('DATE', marginX + 20, listStartY - tableSizes.headOffset);
                
                ctx.textAlign = 'center';
                ctx.fillText('SECTOR', marginX + (listWidth * preset.columns.sector), listStartY - tableSizes.headOffset);
                ctx.fillText('AIRLINE', marginX + (listWidth * preset.columns.airline), listStartY - tableSizes.headOffset);
                ctx.fillText('TIME', marginX + (listWidth * preset.columns.time), listStartY - tableSizes.headOffset);
                
                ctx.textAlign = 'right';
                ctx.fillText('FARE', marginX + listWidth - 20, listStartY - tableSizes.headOffset);

                // Draw rows (animated entrance)
                for (let i = 0; i < visibleFares.length; i++) {
                    const f = visibleFares[i];
                    const entryTime = rowsStart + (i * motion.rowStagger);
                    
                    if (pageElapsed < entryTime) continue; // Not yet visible
                    
                    // Fade in effect
                    const fadeDuration = motion.rowReveal;
                    const progress = Math.min(1, (pageElapsed - entryTime) / fadeDuration);
                    const opacity = easeInOut(progress);
                    
                    // Slide up effect
                    const slideOffset = motion.rowSlide * (1 - opacity);
                    const y = listStartY + (i * rowHeight) + slideOffset;
                    
                    ctx.globalAlpha = opacity;
                    
                    // Row Background
                    const rowBg = i % 2 === 0 ? '#ffffff' : theme.rowAlt;
                    ctx.fillStyle = rowBg;
                    drawRoundedRect(marginX, y, listWidth, rowHeight - rowInset, cornerRadius);
                    ctx.fill();

                    // Content
                    ctx.fillStyle = '#0f172a';
                    ctx.textBaseline = 'middle';
                    
                    // Date
                    const dt = f.flightDate instanceof Date
                        ? f.flightDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()
                        : f.flightDate;
                    ctx.textAlign = 'left';
                    ctx.font = `900 ${tableSizes.dateSize}px Arial, sans-serif`;
                    ctx.fillText(dt, marginX + 20, y + (rowHeight/2) - rowTextOffset);

                    // Sector
                    ctx.font = `700 ${tableSizes.sectorSize}px Arial, sans-serif`;
                    ctx.fillStyle = theme.sectorText;
                    ctx.textAlign = 'center';
                    const sName = sectorMap[f.sectorId] || f.sectorId;
                    ctx.fillText(sName, marginX + (listWidth * preset.columns.sector), y + (rowHeight/2) - rowTextOffset);
                    ctx.fillStyle = '#0f172a'; // reset

                    // Airline Logo/Text
                    const centerX = marginX + (listWidth * preset.columns.airline);
                    const airlineObj = getAirline(f.airlineId);
                    const logo = airlineObj ? loadedLogos[airlineObj.id] : null;
                    if (logo && logo.width > 0) {
                        const logoW = Math.min(logoDims.maxW, logo.width);
                        const logoH = logoDims.h;
                        ctx.drawImage(logo, centerX - (logoW/2), y + (rowHeight/2) - rowTextOffset - (logoH/2), logoW, logoH);
                    } else {
                        ctx.font = `700 ${Math.max(14, tableSizes.sectorSize - 2)}px Arial, sans-serif`;
                        ctx.textAlign = 'center';
                        const aName = airlineObj?.name || f.airlineId || '—';
                        ctx.fillText(aName, centerX, y + (rowHeight/2) - rowTextOffset);
                    }

                    // Time
                    let timeText = normalizeFlightTime(f.flightTime) || '—';
                    ctx.font = `800 ${tableSizes.timeSize}px Arial, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(timeText, marginX + (listWidth * preset.columns.time), y + (rowHeight/2) - rowTextOffset);

                    // Fare Badge
                    const posterRate = getPosterRateDisplay(f.finalRate, f.flightDate);
                    const fareText = posterRate.displayLabel;
                    ctx.font = `900 ${tableSizes.fareSize}px Arial, sans-serif`;
                    ctx.textAlign = 'right';
                    
                    const textW = ctx.measureText(fareText).width;
                    const badgeRight = marginX + listWidth - 20;
                    const badgeW = textW + (fareBadge.padX * 2);
                    const badgeH = fareBadge.height;
                    
                    ctx.fillStyle = theme.fareBadgeBg;
                    drawRoundedRect(badgeRight - badgeW, y + (rowHeight/2) - rowTextOffset - (badgeH/2), badgeW, badgeH, cornerRadius);
                    ctx.fill();
                    
                    ctx.fillStyle = theme.fareBadgeText;
                    ctx.fillText(fareText, badgeRight - fareBadge.padX, y + (rowHeight/2) - rowTextOffset);

                    ctx.globalAlpha = 1.0;
                }

                // --- Draw Footer ---
                // Slide up footer at the very end
                if (pageElapsed > footerEntryTime) {
                    const footerOpacity = easeInOut(Math.min(1, (pageElapsed - footerEntryTime) / motion.footerReveal));
                    ctx.globalAlpha = footerOpacity;
                    
                    const fHeight = footerHeight;
                    const fY = height - fHeight + (20 * (1 - footerOpacity));
                    
                    ctx.fillStyle = theme.footerBg;
                    ctx.fillRect(0, height - fHeight, width, fHeight); // Fixed bg
                    ctx.fillRect(0, fY, width, fHeight); // Moving bg inside
                    
                    ctx.fillStyle = theme.footerBorder;
                    ctx.fillRect(0, height - fHeight, width, 2);

                    // Logo
                    if (logoImg.complete && logoImg.width > 0) {
                        ctx.drawImage(logoImg, marginX, height - (fHeight/2) - 24, preset.footer.logo, preset.footer.logo);
                    }
                    
                    ctx.fillStyle = theme.footerText;
                    ctx.font = `900 ${preset.footer.titleSize}px Arial, sans-serif`;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('Zamra Travels', marginX + (preset.footer.logo + 16), height - (fHeight/2));
                    
                    // Contact
                    ctx.font = `700 ${preset.footer.infoSize}px Arial, sans-serif`;
                    ctx.textAlign = 'right';
                    ctx.fillStyle = theme.footerText;
                    ctx.fillText('zamratravels.com  |  +91 9846606739', width - marginX, height - (fHeight/2));

                    ctx.globalAlpha = 1.0;
                }

            }

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
                        let converted = false;
                        if (canUseWebCodecs()) {
                            try {
                                if (window.toast) window.toast('info', 'Video Processing', 'Optimizing for WhatsApp…');
                                const mp4Mod = await loadMp4Muxer();
                                const target = new mp4Mod.ArrayBufferTarget();
                                const muxer = new mp4Mod.Muxer({
                                    target,
                                    video: { codec: 'avc', width: canvasWidth, height: canvasHeight },
                                    fastStart: 'in-memory',
                                });
                                const encoder = new VideoEncoder({
                                    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                                    error: (e) => console.error('VideoEncoder error:', e),
                                });
                                encoder.configure({
                                    codec: 'avc1.420028',
                                    width: canvasWidth,
                                    height: canvasHeight,
                                    bitrate: 4_000_000,
                                    framerate: fps,
                                });
                                const totalFrames = Math.ceil((totalDuration / 1000) * fps);
                                for (let i = 0; i <= totalFrames; i++) {
                                    const t = Math.min(i * frameDuration, totalDuration);
                                    renderFrame(t);
                                    const vf = new VideoFrame(canvas, { timestamp: Math.round(t * 1000) });
                                    encoder.encode(vf, { keyFrame: i % 90 === 0 });
                                    vf.close();
                                    while (encoder.encodeQueueSize > 10) {
                                        await new Promise(r => setTimeout(r, 1));
                                    }
                                }
                                await encoder.flush();
                                encoder.close();
                                muxer.finalize();
                                finalBlob = new Blob([target.buffer], { type: 'video/mp4' });
                                finalMimeType = 'video/mp4';
                                converted = true;
                            } catch (wcErr) {
                                console.warn('WebCodecs MP4 encoding failed:', wcErr);
                            }
                        }
                        if (!converted) {
                            try {
                                if (!canUseWebCodecs() && window.toast) window.toast('info', 'Video Processing', 'Converting to MP4…');
                                finalBlob = await transcodeToMp4(blob, mimeType);
                                finalMimeType = 'video/mp4';
                            } catch (err) {
                                console.error('MP4 optimization failed:', err);
                                if (window.toast) window.toast('warning', 'Video Processing', 'Could not convert to MP4. Downloading in original format.');
                            }
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

                safeResolve(returnBlob ? { blob: finalBlob, filename, mimeType: finalMimeType } : undefined);
            };

            recorder.onerror = async (e) => {
                console.error("Recorder Error:", e);
                cleanupAudio();
                if (retryAttempt < 1) {
                    if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed. Retrying at a smaller size…');
                    try {
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
                safeReject(e);
            };

        } catch (error) {
            console.error(error);
            if (window.toast) window.toast('error', 'Generation Failed', error.message);
            safeReject(error);
        }
    });
}
