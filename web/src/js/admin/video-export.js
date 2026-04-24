import { getPosterRateDisplay } from './poster-rate-display.js';
import { formatPosterBaggageDisplay } from './poster-baggage-display.js';
import {
  VIDEO_MAX_ROWS,
  clamp,
  getScenePreset,
  normalizeRatioKey,
  planVideoScene
} from './video-scene-planner.js';

let lastVideoThemeHue = null;

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

function pickMimeType({ forceMimeType, candidates } = {}) {
  if (forceMimeType && MediaRecorder.isTypeSupported(forceMimeType)) return forceMimeType;
  const fallback = candidates?.length ? candidates : [...MP4_MIME_CANDIDATES, ...WEBM_MIME_CANDIDATES];
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
    return response.arrayBuffer();
  })();
  try {
    return await backgroundMusicDataPromise;
  } catch (error) {
    backgroundMusicDataPromise = null;
    throw error;
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
        (error) => finish(reject, error || new Error('Failed to decode audio data.'))
      );
      if (promise?.then) {
        promise.then(
          (decoded) => finish(resolve, decoded),
          (error) => finish(reject, error)
        );
      }
    } catch (error) {
      finish(reject, error);
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
      try { await audioCtx.close(); } catch (_) {}
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
  } catch (error) {
    try { await audioCtx?.close(); } catch (_) {}
    console.warn('Background music could not be attached. Falling back to silent audio track.', error);
    return attachSilentAudioTrack(stream);
  }
}

let ffmpegLoadPromise = null;
let ffmpegCorePath = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js';
let ffmpegClient = null;

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
    for (let index = 0; index < FFMPEG_SCRIPT_URLS.length; index += 1) {
      try {
        await loadScriptFrom(FFMPEG_SCRIPT_URLS[index]);
        ffmpegCorePath = FFMPEG_CORE_URLS[index] || ffmpegCorePath;
        if (window.FFmpeg?.createFFmpeg && window.FFmpeg?.fetchFile) {
          return window.FFmpeg;
        }
      } catch (_) {}
    }
    throw new Error('Unable to load FFmpeg.');
  })();
  try {
    return await ffmpegLoadPromise;
  } catch (error) {
    ffmpegLoadPromise = null;
    ffmpegClient = null;
    throw error;
  }
}

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
    try { ffmpeg.FS('unlink', inputName); } catch (_) {}
    try { ffmpeg.FS('unlink', outputName); } catch (_) {}
    return new Blob([data], { type: 'video/mp4' });
  } catch (error) {
    ffmpegClient = null;
    throw error;
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

function drawRoundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}

function easeInOutCubic(value) {
  const t = clamp(value, 0, 1);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0];
  }
  return Math.floor(Math.random() * 1_000_000_000);
}

function hslToHex(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs((2 * light) - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) {
    r = c; g = x;
  } else if (hue < 120) {
    r = x; g = c;
  } else if (hue < 180) {
    g = c; b = x;
  } else if (hue < 240) {
    g = x; b = c;
  } else if (hue < 300) {
    r = x; b = c;
  } else {
    r = c; b = x;
  }
  const toHex = (value) => Math.round((value + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const raw = String(hex || '').replace('#', '').trim();
  const full = raw.length === 3
    ? raw.split('').map((char) => char + char).join('')
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
  const accentSoft = hslToHex(hue, 70, 64);
  const accentAlt = hslToHex((hue + 28) % 360, 85, 56);
  const headerBg = hslToHex(hue, 42, 17);
  const rowAlt = hslToHex(hue, 70, 97);
  return {
    accent,
    accentSoft,
    accentAlt,
    headerBg,
    headerOverlayFrom: headerBg,
    headerOverlayTo: rgbaFromHex(headerBg, 0),
    badgeBg: rgbaFromHex(accent, 0.24),
    badgeBorder: rgbaFromHex(accentAlt, 0.42),
    badgeText: hslToHex(hue, 70, 92),
    heroGlow: rgbaFromHex(accentSoft, 0.16),
    subtitle: hslToHex(hue, 70, 88),
    bodyBg: '#f8fafc',
    bodyAlt: '#edf4fb',
    tableHeadText: '#64748b',
    rowAlt,
    rowBorder: rgbaFromHex(accent, 0.08),
    baggageBg: rgbaFromHex(accent, 0.1),
    baggageText: hslToHex(hue, 76, 34),
    fareBadgeBg: hslToHex(hue, 50, 20),
    fareBadgeText: '#ffffff',
    summaryBorder: rgbaFromHex(accent, 0.16),
    footerBg: '#ffffff',
    footerBorder: '#e2e8f0',
    footerText: '#1e293b',
    footerAccent: accent,
    __hue: hue
  };
}

function pickRandomTheme() {
  const seed = randomSeed();
  const theme = generateVideoTheme(seed, lastVideoThemeHue);
  if (typeof theme.__hue === 'number') {
    lastVideoThemeHue = theme.__hue;
  }
  return theme;
}

function normalizeFlightTime(value) {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  const cleaned = raw.replace(/[–—]/g, '-').replace(/\s+/g, ' ');
  if (!cleaned.includes('-')) return cleaned;
  const parts = cleaned.split('-').map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]} - ${parts[1]}`;
  return parts[0] || cleaned;
}

function fileSafeSlug(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function flightDateSortValue(value) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) return parsed;
  return String(value || '');
}

function formatFlightDateLabel(value) {
  if (value instanceof Date) {
    return value.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }
  const parsed = Date.parse(value);
  if (Number.isFinite(parsed)) {
    return new Date(parsed).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }
  return String(value || '').toUpperCase();
}

async function loadImageFromSrc(src, { crossOrigin = false } = {}) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

async function fetchImageAsset(url) {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const image = await loadImageFromSrc(objectUrl);
    return {
      image,
      cleanup() {
        URL.revokeObjectURL(objectUrl);
      }
    };
  } catch {
    return null;
  }
}

function buildAirlineHelpers(airlines = []) {
  const airlineMap = {};
  airlines.forEach((airline) => {
    if (airline.id) airlineMap[String(airline.id).trim().toLowerCase()] = airline;
    if (airline.code) airlineMap[String(airline.code).trim().toLowerCase()] = airline;
    if (airline.name) airlineMap[String(airline.name).trim().toLowerCase()] = airline;
  });
  return {
    getAirline(rawId) {
      if (!rawId) return null;
      return airlineMap[String(rawId).trim().toLowerCase()] || null;
    },
    toAirlineKey(rawId) {
      const airline = rawId ? airlineMap[String(rawId).trim().toLowerCase()] : null;
      return airline?.id || String(rawId || '').trim().toLowerCase();
    }
  };
}

function dedupeAndSortFares(fares = [], toAirlineKey) {
  const groupedFaresMap = new Map();
  fares.forEach((fare) => {
    const airlineKey = toAirlineKey(fare.airlineId);
    const timeKey = normalizeFlightTime(fare.flightTime).replace(/\s+/g, '');
    const dateKey = flightDateSortValue(fare.flightDate);
    const dedupeKey = `${fare.sectorId}_${airlineKey}_${dateKey}_${timeKey}`;
    const existing = groupedFaresMap.get(dedupeKey);
    if (!existing || Number(fare.finalRate) < Number(existing.finalRate)) {
      groupedFaresMap.set(dedupeKey, fare);
    }
  });

  return Array.from(groupedFaresMap.values()).sort((a, b) => {
    const valueA = flightDateSortValue(a.flightDate);
    const valueB = flightDateSortValue(b.flightDate);
    if (typeof valueA === 'number' && typeof valueB === 'number') return valueA - valueB;
    return String(valueA).localeCompare(String(valueB));
  });
}

function chunkItems(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function resolveSectorMeta(sectorId, sectors = []) {
  const sector = sectors.find((item) => item.id === sectorId);
  if (!sector) {
    const raw = String(sectorId || '').trim().toUpperCase();
    return {
      sector,
      titleText: raw || 'DEP → ARR',
      sectorSlug: fileSafeSlug(raw) || 'sector'
    };
  }
  const originName = String(sector.sectorFrom || 'DEP').toUpperCase();
  const destName = String(sector.sectorTo || 'ARR').toUpperCase();
  const rawSlug = sector.sectorCode || `${originName}-${destName}`;
  return {
    sector,
    titleText: `${originName} → ${destName}`,
    sectorSlug: fileSafeSlug(rawSlug) || fileSafeSlug(sectorId) || 'sector'
  };
}

async function loadVideoAssets(sortedFares, getAirline) {
  const cleanupFns = [];
  const bgImg = await loadImageFromSrc('/assets/img/hero-banner-bg.png').catch(() => null);
  const logoImg = await loadImageFromSrc('/assets/img/logo.webp').catch(() => null);

  const airlineLogos = {};
  const seen = new Set();
  const uniqueAirlines = sortedFares
    .map((fare) => getAirline(fare.airlineId))
    .filter((airline) => airline?.id && airline.logoUrl && !seen.has(airline.id));

  uniqueAirlines.forEach((airline) => seen.add(airline.id));

  await Promise.all(uniqueAirlines.map(async (airline) => {
    const asset = await fetchImageAsset(airline.logoUrl);
    if (!asset?.image) return;
    airlineLogos[airline.id] = asset.image;
    cleanupFns.push(() => asset.cleanup?.());
  }));

  return {
    bgImg,
    logoImg,
    airlineLogos,
    cleanup() {
      cleanupFns.forEach((fn) => {
        try { fn(); } catch (_) {}
      });
    }
  };
}

async function prepareVideoPages({ ratioKey, fares, sectorId, sectors, airlines }) {
  const normalizedRatio = normalizeRatioKey(ratioKey);
  const preset = getScenePreset(normalizedRatio);
  const theme = pickRandomTheme();
  const { getAirline, toAirlineKey } = buildAirlineHelpers(airlines);
  const { titleText, sectorSlug } = resolveSectorMeta(sectorId, sectors);
  const sortedFares = dedupeAndSortFares(fares, toAirlineKey);
  const sampleScene = planVideoScene({
    ratioKey: normalizedRatio,
    rowCount: preset.maxRows || VIDEO_MAX_ROWS,
    titleText,
    maxRows: preset.maxRows || VIDEO_MAX_ROWS
  });
  const rowsPerPage = Math.max(1, sampleScene.recommendedRowsPerPage);
  const pageFares = chunkItems(sortedFares, rowsPerPage);
  const pages = (pageFares.length ? pageFares : [[]]).map((page, index, items) => {
    const scene = planVideoScene({
      ratioKey: normalizedRatio,
      rowCount: page.length,
      titleText,
      maxRows: preset.maxRows || VIDEO_MAX_ROWS
    });
    return {
      pageIndex: index + 1,
      pageTotal: items.length,
      fares: page,
      scene
    };
  });
  const assets = await loadVideoAssets(sortedFares, getAirline);
  return {
    ratioKey: normalizedRatio,
    titleText,
    sectorSlug,
    theme,
    pages,
    assets,
    getAirline
  };
}

function coverImageSize(image, targetWidth, targetHeight) {
  if (!image?.width || !image?.height) {
    return {
      sx: 0,
      sy: 0,
      sw: 0,
      sh: 0,
      dx: 0,
      dy: 0,
      dw: targetWidth,
      dh: targetHeight
    };
  }
  const sourceRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;
  let sw = image.width;
  let sh = image.height;
  let sx = 0;
  let sy = 0;

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }

  return {
    sx,
    sy,
    sw,
    sh,
    dx: 0,
    dy: 0,
    dw: targetWidth,
    dh: targetHeight
  };
}

function drawImageCover(ctx, image, x, y, width, height) {
  if (!image?.width || !image?.height) return;
  const draw = coverImageSize(image, width, height);
  ctx.drawImage(
    image,
    draw.sx,
    draw.sy,
    draw.sw,
    draw.sh,
    x + draw.dx,
    y + draw.dy,
    draw.dw,
    draw.dh
  );
}

function drawSceneBackdrop(ctx, width, height, theme, elapsedMs) {
  const baseGradient = ctx.createLinearGradient(0, 0, width, height);
  baseGradient.addColorStop(0, '#eef5fc');
  baseGradient.addColorStop(0.45, '#f8fbff');
  baseGradient.addColorStop(1, theme.bodyAlt);
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, width, height);

  const drift = Math.sin(elapsedMs / 2200);
  const glowA = ctx.createRadialGradient(
    width * (0.18 + (drift * 0.012)),
    height * 0.14,
    0,
    width * 0.18,
    height * 0.14,
    width * 0.42
  );
  glowA.addColorStop(0, 'rgba(255,255,255,0.95)');
  glowA.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(
    width * 0.84,
    height * (0.84 - (drift * 0.018)),
    0,
    width * 0.84,
    height * 0.84,
    width * 0.46
  );
  glowB.addColorStop(0, rgbaFromHex(theme.accentSoft, 0.14));
  glowB.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);
}

function drawTopBar(ctx, scene, theme) {
  const gradient = ctx.createLinearGradient(0, 0, scene.canvas.width, 0);
  gradient.addColorStop(0, theme.accent);
  gradient.addColorStop(0.5, theme.accentAlt);
  gradient.addColorStop(1, theme.accentSoft);
  ctx.fillStyle = gradient;
  ctx.fillRect(scene.topBar.x, scene.topBar.y, scene.topBar.width, scene.topBar.height);
}

function drawTitleLine(ctx, scene, theme, alpha, liftY) {
  const { title } = scene;
  const arrow = '→';
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${title.fontSize}px Arial, sans-serif`;

  if (title.text.includes(arrow)) {
    const [leftRaw, rightRaw] = title.text.split(arrow);
    const left = leftRaw.trim();
    const right = rightRaw.trim();
    const arrowText = ` ${arrow} `;
    const leftWidth = ctx.measureText(left).width;
    const arrowWidth = ctx.measureText(arrowText).width;
    const rightWidth = ctx.measureText(right).width;
    const totalWidth = leftWidth + arrowWidth + rightWidth;
    const startX = title.x - (totalWidth / 2);
    const y = title.y - liftY;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(left, startX, y);
    ctx.fillStyle = theme.accentAlt;
    ctx.fillText(arrowText, startX + leftWidth, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(right, startX + leftWidth + arrowWidth, y);
  } else {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title.text, title.x, title.y - liftY);
  }

  ctx.restore();
}

function drawHero(ctx, scene, theme, assets, elapsedMs, progress) {
  const heroAlpha = 0.55 + (progress * 0.45);
  ctx.save();
  ctx.globalAlpha = heroAlpha;
  ctx.fillStyle = theme.headerBg;
  ctx.fillRect(scene.hero.x, scene.hero.y, scene.hero.width, scene.hero.height);

  if (assets.bgImg) {
    ctx.save();
    const parallax = Math.sin(elapsedMs / 1600) * 6;
    ctx.beginPath();
    ctx.rect(scene.hero.x, scene.hero.y, scene.hero.width, scene.hero.height);
    ctx.clip();
    ctx.globalAlpha = 0.24;
    drawImageCover(
      ctx,
      assets.bgImg,
      scene.hero.x,
      scene.hero.y + parallax,
      scene.hero.width,
      scene.hero.height
    );
    ctx.restore();
  }

  const heroOverlay = ctx.createLinearGradient(0, scene.hero.y, 0, scene.hero.y + scene.hero.height);
  heroOverlay.addColorStop(0, rgbaFromHex(theme.headerBg, 0.18));
  heroOverlay.addColorStop(0.55, rgbaFromHex(theme.headerBg, 0.52));
  heroOverlay.addColorStop(1, rgbaFromHex(theme.headerBg, 0.82));
  ctx.fillStyle = heroOverlay;
  ctx.fillRect(scene.hero.x, scene.hero.y, scene.hero.width, scene.hero.height);

  const heroGlow = ctx.createRadialGradient(
    scene.canvas.width / 2,
    scene.hero.height * 0.68,
    0,
    scene.canvas.width / 2,
    scene.hero.height * 0.68,
    scene.canvas.width * 0.55
  );
  heroGlow.addColorStop(0, theme.heroGlow);
  heroGlow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = heroGlow;
  ctx.fillRect(scene.hero.x, scene.hero.y, scene.hero.width, scene.hero.height);
  ctx.restore();

  drawTopBar(ctx, scene, theme);

  const badgePulse = 1 + (Math.sin(elapsedMs / 900) * 0.012);
  const badgeWidth = scene.badge.width * badgePulse;
  const badgeX = scene.badge.x - ((badgeWidth - scene.badge.width) / 2);
  ctx.save();
  ctx.globalAlpha = 0.72 + (progress * 0.28);
  ctx.fillStyle = theme.badgeBg;
  drawRoundedRectPath(ctx, badgeX, scene.badge.y, badgeWidth, scene.badge.height, scene.badge.height / 2);
  ctx.fill();
  ctx.strokeStyle = theme.badgeBorder;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = theme.badgeText;
  ctx.font = `800 ${scene.badge.textSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EXCLUSIVE DEALS', scene.canvas.width / 2, scene.badge.y + (scene.badge.height / 2));
  ctx.restore();

  drawTitleLine(ctx, scene, theme, progress, 14 * (1 - progress));

  ctx.save();
  ctx.globalAlpha = progress;
  ctx.fillStyle = theme.subtitle;
  ctx.font = `800 ${scene.subtitle.fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE FARES AVAILABLE NOW', scene.subtitle.x, scene.subtitle.y - (10 * (1 - progress)));
  ctx.restore();
}

function drawCardShell(ctx, scene, theme, progress) {
  if (progress <= 0) return;
  const currentY = scene.card.y + (24 * (1 - progress));
  ctx.save();
  ctx.globalAlpha = progress;
  ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
  ctx.shadowBlur = scene.ratioKey === '9x16' ? 58 : 44;
  ctx.shadowOffsetY = scene.ratioKey === '9x16' ? 24 : 18;
  ctx.fillStyle = 'rgba(255,255,255,0.985)';
  drawRoundedRectPath(ctx, scene.card.x, currentY, scene.card.width, scene.card.height, scene.card.radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = progress;
  const borderGradient = ctx.createLinearGradient(scene.card.x, currentY, scene.card.x + scene.card.width, currentY);
  borderGradient.addColorStop(0, rgbaFromHex(theme.accentAlt, 0.2));
  borderGradient.addColorStop(1, 'rgba(255,255,255,0.95)');
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 1.5;
  drawRoundedRectPath(ctx, scene.card.x, currentY, scene.card.width, scene.card.height, scene.card.radius);
  ctx.stroke();

  const accentStrip = ctx.createLinearGradient(scene.card.x, currentY, scene.card.x + scene.card.width, currentY);
  accentStrip.addColorStop(0, theme.accent);
  accentStrip.addColorStop(0.5, theme.accentAlt);
  accentStrip.addColorStop(1, theme.accentSoft);
  ctx.fillStyle = accentStrip;
  drawRoundedRectPath(ctx, scene.card.x + 20, currentY + 18, scene.card.width - 40, 8, 999);
  ctx.fill();
  ctx.restore();
}

function drawTableHead(ctx, scene, theme, progress) {
  if (progress <= 0) return;
  ctx.save();
  ctx.globalAlpha = progress;
  ctx.fillStyle = theme.tableHeadText;
  ctx.font = `800 ${scene.typography.tableHead}px Arial, sans-serif`;
  ctx.textBaseline = 'alphabetic';

  ctx.textAlign = 'left';
  ctx.fillText('DATE', scene.columns.dateLeft, scene.tableHead.y);
  ctx.textAlign = 'center';
  ctx.fillText('AIRLINE', scene.columns.airlineCenter, scene.tableHead.y);
  ctx.fillText('TIME', scene.columns.timeCenter, scene.tableHead.y);
  ctx.fillText('BAGGAGE', scene.columns.baggageCenter, scene.tableHead.y);
  ctx.textAlign = 'right';
  ctx.fillText('FARE', scene.columns.fareRight, scene.tableHead.y);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(scene.tableHead.x, scene.tableHead.y + 16);
  ctx.lineTo(scene.tableHead.x + scene.tableHead.width, scene.tableHead.y + 16);
  ctx.stroke();
  ctx.restore();
}

function drawRow(ctx, fare, rowRect, rowIndex, scene, theme, getAirline, assets, opacity, translateY) {
  const rowY = rowRect.y + translateY;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = rowIndex % 2 === 0 ? '#ffffff' : theme.rowAlt;
  drawRoundedRectPath(ctx, rowRect.x, rowY, rowRect.width, rowRect.height - scene.preset.rowInset, rowRect.radius);
  ctx.fill();
  ctx.strokeStyle = theme.rowBorder;
  ctx.lineWidth = 1;
  drawRoundedRectPath(ctx, rowRect.x, rowY, rowRect.width, rowRect.height - scene.preset.rowInset, rowRect.radius);
  ctx.stroke();

  const centerY = rowY + ((rowRect.height - scene.preset.rowInset) / 2);
  const airline = getAirline(fare.airlineId);
  const airlineLogo = airline ? assets.airlineLogos[airline.id] : null;
  const dateLabel = formatFlightDateLabel(fare.flightDate);
  const timeLabel = normalizeFlightTime(fare.flightTime) || '—';
  const baggageLabel = formatPosterBaggageDisplay(fare.baggage, fare.extraBaggage);
  const posterRate = getPosterRateDisplay(fare.finalRate, fare.flightDate);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${scene.typography.date}px Arial, sans-serif`;
  ctx.fillText(dateLabel, scene.columns.dateLeft, centerY);

  if (airlineLogo?.width > 0) {
    const logoWidth = Math.min(scene.logo.rowMaxWidth, airlineLogo.width);
    const logoHeight = scene.logo.rowHeight;
    ctx.drawImage(
      airlineLogo,
      scene.columns.airlineCenter - (logoWidth / 2),
      centerY - (logoHeight / 2),
      logoWidth,
      logoHeight
    );
  } else {
    ctx.textAlign = 'center';
    ctx.font = `800 ${scene.typography.airlineFallback}px Arial, sans-serif`;
    ctx.fillText(airline?.name || fare.airlineId || '—', scene.columns.airlineCenter, centerY);
  }

  ctx.textAlign = 'center';
  ctx.font = `800 ${scene.typography.time}px Arial, sans-serif`;
  ctx.fillText(timeLabel, scene.columns.timeCenter, centerY);

  if (baggageLabel === '—') {
    ctx.fillStyle = '#94a3b8';
    ctx.font = `700 ${scene.typography.baggage}px Arial, sans-serif`;
    ctx.fillText('—', scene.columns.baggageCenter, centerY);
  } else {
    ctx.font = `700 ${scene.typography.baggage}px Arial, sans-serif`;
    const baggageTextWidth = ctx.measureText(baggageLabel).width;
    const pillWidth = baggageTextWidth + 22;
    const pillHeight = Math.max(24, scene.typography.baggage + 10);
    ctx.fillStyle = theme.baggageBg;
    drawRoundedRectPath(ctx, scene.columns.baggageCenter - (pillWidth / 2), centerY - (pillHeight / 2), pillWidth, pillHeight, pillHeight / 2);
    ctx.fill();
    ctx.fillStyle = theme.baggageText;
    ctx.fillText(baggageLabel, scene.columns.baggageCenter, centerY);
  }

  ctx.textAlign = 'right';
  ctx.font = `900 ${scene.typography.fare}px Arial, sans-serif`;
  const fareText = posterRate.displayLabel;
  const textWidth = ctx.measureText(fareText).width;
  const badgeWidth = textWidth + (scene.fareBadge.padX * 2);
  const badgeHeight = scene.fareBadge.height;
  ctx.fillStyle = theme.fareBadgeBg;
  drawRoundedRectPath(
    ctx,
    scene.columns.fareRight - badgeWidth,
    centerY - (badgeHeight / 2),
    badgeWidth,
    badgeHeight,
    Math.min(18, badgeHeight / 2)
  );
  ctx.fill();
  ctx.fillStyle = theme.fareBadgeText;
  ctx.fillText(fareText, scene.columns.fareRight - scene.fareBadge.padX, centerY);
  ctx.restore();
}

function drawSummary(ctx, page, scene, theme, opacity) {
  if (opacity <= 0) return;
  const summaryLabel = page.pageTotal > 1
    ? `PAGE ${page.pageIndex} OF ${page.pageTotal}`
    : 'FRESH FARES READY TO SHARE';
  const summaryCaption = page.pageTotal > 1
    ? 'Swipe-worthy fare motion for faster daily sharing.'
    : 'Built for instant status, story, and reel posting.';

  ctx.save();
  ctx.globalAlpha = opacity;
  const fill = ctx.createLinearGradient(scene.summary.x, scene.summary.y, scene.summary.x + scene.summary.width, scene.summary.y);
  fill.addColorStop(0, rgbaFromHex(theme.accent, 0.12));
  fill.addColorStop(1, 'rgba(255,255,255,0.98)');
  ctx.fillStyle = fill;
  drawRoundedRectPath(ctx, scene.summary.x, scene.summary.y, scene.summary.width, scene.summary.height, scene.summary.radius);
  ctx.fill();
  ctx.strokeStyle = theme.summaryBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.footerAccent;
  ctx.font = `800 ${scene.typography.summaryMeta}px Arial, sans-serif`;
  ctx.fillText(summaryLabel, scene.summary.x + 24, scene.summaryCopy.metaY);

  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${scene.typography.summaryTitle}px Arial, sans-serif`;
  ctx.fillText('Book now with Zamra Travels', scene.summary.x + 24, scene.summaryCopy.titleY);

  ctx.fillStyle = '#475569';
  ctx.font = `700 ${scene.typography.summaryMeta}px Arial, sans-serif`;
  ctx.fillText(summaryCaption, scene.summary.x + 24, scene.summaryCopy.infoY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${scene.typography.summaryTitle}px Arial, sans-serif`;
  ctx.fillText('+91 9846606739', scene.summary.x + scene.summary.width - 24, scene.summaryCopy.titleY);

  ctx.fillStyle = '#475569';
  ctx.font = `700 ${scene.typography.summaryMeta}px Arial, sans-serif`;
  ctx.fillText('zamratravels.com', scene.summary.x + scene.summary.width - 24, scene.summaryCopy.infoY);
  ctx.restore();
}

function drawFooter(ctx, scene, theme, assets, opacity) {
  if (opacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = theme.footerBg;
  ctx.fillRect(scene.footer.x, scene.footer.y, scene.footer.width, scene.footer.height);
  ctx.fillStyle = theme.footerBorder;
  ctx.fillRect(scene.footer.x, scene.footer.y, scene.footer.width, 2);

  if (assets.logoImg?.width > 0) {
    ctx.drawImage(
      assets.logoImg,
      scene.footerContent.leftX,
      scene.footerContent.centerY - (scene.footerContent.logoSize / 2),
      scene.footerContent.logoSize,
      scene.footerContent.logoSize
    );
  }

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = theme.footerText;
  ctx.font = `900 ${scene.typography.footerTitle}px Arial, sans-serif`;
  ctx.fillText(
    'Zamra Travels',
    scene.footerContent.leftX + scene.footerContent.logoSize + 18,
    scene.footerContent.centerY
  );

  ctx.textAlign = 'right';
  ctx.font = `700 ${scene.typography.footerInfo}px Arial, sans-serif`;
  ctx.fillText(
    'zamratravels.com  |  +91 9846606739',
    scene.footerContent.rightX,
    scene.footerContent.centerY
  );
  ctx.restore();
}

function drawPagination(ctx, count, progress, scene) {
  if (!Number.isFinite(count) || count <= 1) return;
  const dotWidth = scene.ratioKey === '9x16' ? 24 : 20;
  const dotGap = 12;
  const inactiveWidth = 10;
  const totalWidth = (count * inactiveWidth) + ((count - 1) * dotGap);
  const startX = (scene.canvas.width - totalWidth) / 2;
  const y = scene.footer.y - 32;

  for (let index = 0; index < count; index += 1) {
    const distance = Math.abs(progress - index);
    const strength = Math.max(0, 1 - Math.min(distance, 1));
    const currentWidth = inactiveWidth + ((dotWidth - inactiveWidth) * strength);
    const x = startX + (index * (inactiveWidth + dotGap)) - ((currentWidth - inactiveWidth) / 2);
    ctx.fillStyle = strength > 0.12
      ? `rgba(15, 23, 42, ${0.28 + (strength * 0.42)})`
      : 'rgba(148, 163, 184, 0.32)';
    drawRoundedRectPath(ctx, x, y, currentWidth, 10, 999);
    ctx.fill();
  }
}

function drawVideoScene(ctx, prepared, page, elapsedMs, alpha = 1) {
  const scene = page.scene;
  const timeline = scene.timeline;

  const heroProgress = easeOutCubic((elapsedMs - timeline.heroStart) / timeline.heroReveal);
  const cardProgress = easeOutCubic((elapsedMs - timeline.cardStart) / timeline.cardReveal);
  const headProgress = easeOutCubic((elapsedMs - (timeline.cardStart + 120)) / 220);
  const footerProgress = easeInOutCubic((elapsedMs - timeline.footerStart) / timeline.footerReveal);

  ctx.save();
  ctx.globalAlpha = alpha;
  drawHero(ctx, scene, prepared.theme, prepared.assets, elapsedMs, heroProgress);
  drawCardShell(ctx, scene, prepared.theme, cardProgress);
  drawTableHead(ctx, scene, prepared.theme, Math.min(cardProgress, headProgress));

  page.fares.forEach((fare, index) => {
    const rowRect = scene.rows[index];
    if (!rowRect) return;
    const rowProgress = easeInOutCubic(
      (elapsedMs - (timeline.rowsStart + (index * timeline.rowStagger))) / timeline.rowReveal
    );
    if (rowProgress <= 0) return;
    drawRow(
      ctx,
      fare,
      rowRect,
      index,
      scene,
      prepared.theme,
      prepared.getAirline,
      prepared.assets,
      rowProgress,
      16 * (1 - rowProgress)
    );
  });

  drawSummary(ctx, page, scene, prepared.theme, footerProgress);
  drawFooter(ctx, scene, prepared.theme, prepared.assets, footerProgress);
  ctx.restore();
}

function buildPageTimeline(pages) {
  const timeline = [];
  let cursor = 0;
  pages.forEach((page) => {
    const duration = page.scene.timeline.pageDuration;
    timeline.push({
      start: cursor,
      end: cursor + duration,
      page
    });
    cursor += duration;
  });
  return { pages: timeline, totalDuration: cursor };
}

function resolveActivePage(timeline, elapsedMs) {
  const active = timeline.pages.find((entry) => elapsedMs <= entry.end) || timeline.pages[timeline.pages.length - 1];
  const pageElapsed = elapsedMs - (active?.start || 0);
  return { active, pageElapsed };
}

export async function downloadVideoPoster(ratio, fares, sectorId, sectors, airlines, options = {}) {
  const ratioKey = normalizeRatioKey(ratio);
  const ratioLabel = ratioKey.replace('x', ':');

  if (window.toast) {
    window.toast('info', 'Video Generation', `Generating ${ratioLabel} Video... Please remain on this tab.`);
  }

  if (typeof MediaRecorder === 'undefined') {
    if (window.toast) window.toast('error', 'Video Generation', 'Your browser does not support MediaRecorder.');
    throw new Error('MediaRecorder is not supported in this browser.');
  }

  const {
    autoDownload = true,
    returnBlob = false,
    renderScale,
    forceMimeType,
    mimeCandidates,
    retryAttempt = 0,
    requireMp4 = false
  } = options || {};

  let prepared = null;
  let cleanupPreparedAssets = () => {};

  return new Promise(async (resolve, reject) => {
    let safeResolve = resolve;
    let safeReject = reject;

    try {
      prepared = await prepareVideoPages({ ratioKey, fares, sectorId, sectors, airlines });
      cleanupPreparedAssets = () => {
        try { prepared?.assets?.cleanup?.(); } catch (_) {}
      };

      const preset = getScenePreset(ratioKey);
      const { width, height } = preset;
      const canvas = document.createElement('canvas');
      const targetScale = clamp(renderScale ?? 1, 0.5, 1);
      const rawWidth = Math.round(width * targetScale);
      const rawHeight = Math.round(height * targetScale);
      let canvasWidth = Math.max(2, rawWidth - (rawWidth % 2));
      let canvasHeight = Math.max(2, rawHeight - (rawHeight % 2));
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

      const pageTimeline = buildPageTimeline(prepared.pages);
      const transitionDuration = prepared.pages.length > 1 ? 420 : 0;
      const fps = 30;
      const frameDuration = 1000 / fps;
      let elapsed = 0;
      let lastTick = performance.now();
      let settled = false;
      let stopped = false;
      const stream = canvas.captureStream(fps);
      const audioState = await attachBackgroundAudioTrack(stream, { durationMs: pageTimeline.totalDuration });
      const mimeType = pickMimeType({
        forceMimeType,
        candidates: mimeCandidates || getMimeCandidates()
      });

      if (!mimeType) {
        throw new Error('No supported video mime type available for this browser.');
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      const cleanupAudio = () => {
        try { audioState?.source?.stop(); } catch (_) {}
        try { audioState?.oscillator?.stop(); } catch (_) {}
        try { audioState?.audioTrack?.stop(); } catch (_) {}
        try { audioState?.audioCtx?.close(); } catch (_) {}
      };

      const cleanupStream = () => {
        try { stream.getTracks().forEach((track) => track.stop()); } catch (_) {}
      };

      safeResolve = (value) => {
        if (settled) return;
        settled = true;
        cleanupPreparedAssets();
        resolve(value);
      };

      safeReject = (error) => {
        if (settled) return;
        settled = true;
        cleanupPreparedAssets();
        reject(error);
      };

      const stopRecorder = () => {
        if (stopped) return;
        stopped = true;
        try {
          if (recorder.state === 'recording') recorder.stop();
        } catch (error) {
          console.error('Error stopping recorder', error);
        }
      };

      const renderFrame = (elapsedMs) => {
        const safeElapsed = Math.max(0, Math.min(elapsedMs, Math.max(0, pageTimeline.totalDuration - 1)));
      const { active, pageElapsed } = resolveActivePage(pageTimeline, safeElapsed);
      drawSceneBackdrop(ctx, width, height, prepared.theme, safeElapsed);

      const nextIndex = pageTimeline.pages.indexOf(active) + 1;
      const nextEntry = pageTimeline.pages[nextIndex];
      if (nextEntry && transitionDuration > 0) {
        const transitionStart = active.page.scene.timeline.pageDuration - transitionDuration;
        if (pageElapsed >= transitionStart) {
          const progress = clamp((pageElapsed - transitionStart) / transitionDuration, 0, 1);
          drawVideoScene(ctx, prepared, active.page, pageElapsed, 1 - progress);
          drawVideoScene(ctx, prepared, nextEntry.page, progress * 360, progress);
          drawPagination(ctx, prepared.pages.length, (nextIndex - 1) + progress, active.page.scene);
          return;
        }
      }

      drawVideoScene(ctx, prepared, active.page, pageElapsed, 1);
      drawPagination(ctx, prepared.pages.length, pageTimeline.pages.indexOf(active), active.page.scene);
    };

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        cleanupAudio();
        const blob = new Blob(chunks, { type: mimeType });
        if (!blob || !blob.size) {
          if (retryAttempt < 1) {
            if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed. Retrying at a smaller size…');
            try {
              cleanupStream();
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
          cleanupStream();
          if (window.toast) window.toast('error', 'Generation Error', 'No video data was produced.');
          safeReject(new Error('No video data generated.'));
          return;
        }

        if (!requireMp4) {
          const isValid = await validateVideoBlob(blob, ratioKey);
          if (!isValid) {
            if (retryAttempt < 1) {
              if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed validation. Retrying at a smaller size…');
              try {
                cleanupStream();
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
            cleanupStream();
            if (window.toast) window.toast('error', 'Generation Error', 'Video validation failed.');
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
            } catch (error) {
              console.error('MP4 optimization failed:', error);
              if (window.toast) window.toast('warning', 'Video Processing', 'Could not convert to MP4. Downloading in original format.');
            }
          }
        }

        const extension = finalMimeType.includes('mp4') ? 'mp4' : 'webm';
        const filename = `zamra-video-${ratioKey}-${prepared.sectorSlug}-${Date.now()}.${extension}`;

        if (autoDownload) {
          const url = URL.createObjectURL(finalBlob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          setTimeout(() => {
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
          }, 100);
          if (window.toast) window.toast('success', 'Video Generated', `Your ${ratioLabel} video has been downloaded!`);
        }

        cleanupStream();
        safeResolve(returnBlob ? { blob: finalBlob, filename, mimeType: finalMimeType } : undefined);
      };

      recorder.onerror = async (event) => {
        console.error('Recorder Error:', event);
        cleanupAudio();
        if (retryAttempt < 1) {
          if (window.toast) window.toast('warning', 'Video Retry', 'Video export failed. Retrying at a smaller size…');
          try {
            cleanupStream();
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
        cleanupStream();
        if (window.toast) window.toast('error', 'Generation Error', 'Failed to encode the video stream.');
        safeReject(new Error('Failed to encode the video stream.'));
      };

      recorder.start(1000);

      function drawLoop(now) {
        if (stopped) return;
        const delta = Math.min(Math.max(0, now - lastTick), frameDuration);
        lastTick = now;
        elapsed += delta;
        let shouldStop = false;

        if (elapsed > pageTimeline.totalDuration) {
          elapsed = pageTimeline.totalDuration;
          shouldStop = true;
        }

        renderFrame(elapsed);

        if (shouldStop) {
          stopRecorder();
          return;
        }

        requestAnimationFrame(drawLoop);
      }

      const safetyStop = setTimeout(() => {
        if (!stopped && recorder.state === 'recording') {
          stopRecorder();
        }
      }, pageTimeline.totalDuration + 1500);

      const originalOnStop = recorder.onstop;
      recorder.onstop = async (...args) => {
        clearTimeout(safetyStop);
        await originalOnStop?.(...args);
      };

      requestAnimationFrame(drawLoop);
    } catch (error) {
      console.error('Video generation failed:', error);
      if (window.toast) window.toast('error', 'Generation Error', error.message || 'Video generation failed.');
      safeReject(error);
    }
  });
}
