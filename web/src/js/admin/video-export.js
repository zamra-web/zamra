import {
  buildSlideTimeline,
  clamp,
  coverImageRect,
  getSlideshowPreset,
  normalizeRatioKey,
  planSlideshowLayout,
  resolveSlideRenderState,
} from './video-slideshow.js';

const MP4_MIME_CANDIDATES = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  'video/mp4;codecs="avc1.42E01E"',
  'video/mp4',
];

const WEBM_MIME_CANDIDATES = [
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
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
        (error) => finish(reject, error || new Error('Failed to decode audio data.')),
      );
      if (promise?.then) {
        promise.then(
          (decoded) => finish(resolve, decoded),
          (error) => finish(reject, error),
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
  'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js',
];

const FFMPEG_CORE_URLS = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
  'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
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
      corePath: ffmpegCorePath,
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
      outputName,
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

async function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

async function loadSlideImage(blob) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await loadImageFromSrc(objectUrl);
    return {
      image,
      cleanup() {
        URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function drawSlideBackground(ctx, preset, image) {
  ctx.fillStyle = '#081120';
  ctx.fillRect(0, 0, preset.width, preset.height);

  const coverWidth = preset.width * preset.backdropScale;
  const coverHeight = preset.height * preset.backdropScale;
  const coverX = (preset.width - coverWidth) / 2;
  const coverY = (preset.height - coverHeight) / 2;
  const cover = coverImageRect(image.width, image.height, coverWidth, coverHeight);

  ctx.save();
  try {
    const brightness = Number(preset.backdropBrightness) || 0.58;
    const saturation = Number(preset.backdropSaturation) || 0.9;
    ctx.filter = `blur(${preset.backdropBlur}px) brightness(${brightness}) saturate(${saturation})`;
  } catch (_) {}
  ctx.drawImage(
    image,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    coverX,
    coverY,
    coverWidth,
    coverHeight,
  );
  ctx.restore();

  const gradient = ctx.createLinearGradient(0, 0, 0, preset.height);
  gradient.addColorStop(0, `rgba(8, 17, 32, ${preset.overlayAlpha})`);
  gradient.addColorStop(0.5, 'rgba(8, 17, 32, 0.12)');
  gradient.addColorStop(1, `rgba(8, 17, 32, ${preset.overlayAlpha + 0.08})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, preset.width, preset.height);

  const spotlight = ctx.createRadialGradient(
    preset.width / 2,
    preset.height * 0.42,
    preset.width * 0.1,
    preset.width / 2,
    preset.height * 0.45,
    preset.width * 0.72,
  );
  spotlight.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  spotlight.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
  spotlight.addColorStop(1, 'rgba(8, 17, 32, 0)');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, preset.width, preset.height);
}

function drawSlideCard(ctx, layout, image) {
  ctx.save();
  ctx.shadowColor = 'rgba(8, 15, 29, 0.38)';
  ctx.shadowBlur = layout.preset.shadowBlur;
  ctx.shadowOffsetY = layout.preset.shadowOffsetY;
  ctx.fillStyle = '#ffffff';
  drawRoundedRectPath(ctx, layout.card.x, layout.card.y, layout.card.width, layout.card.height, layout.card.radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, layout.card.x, layout.card.y, layout.card.width, layout.card.height, layout.card.radius);
  ctx.clip();
  const crop = layout.card.crop || {
    sx: 0,
    sy: 0,
    sw: image.width,
    sh: image.height,
  };
  ctx.drawImage(
    image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    layout.card.x,
    layout.card.y,
    layout.card.width,
    layout.card.height,
  );
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.lineWidth = 2;
  drawRoundedRectPath(ctx, layout.card.x, layout.card.y, layout.card.width, layout.card.height, layout.card.radius);
  ctx.stroke();
  ctx.restore();
}

function renderSlideCanvas(layout, image) {
  const canvas = document.createElement('canvas');
  canvas.width = layout.canvas.width;
  canvas.height = layout.canvas.height;
  const ctx = canvas.getContext('2d');
  drawSlideBackground(ctx, layout.preset, image);
  drawSlideCard(ctx, layout, image);
  return canvas;
}

async function prepareSlides(ratioKey, slides = []) {
  const preset = getSlideshowPreset(ratioKey);
  const preparedSlides = [];
  try {
    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index];
      if (!slide?.blob) {
        throw new Error(`Poster slide ${index + 1} is missing image data.`);
      }
      const asset = await loadSlideImage(slide.blob);
      const layout = planSlideshowLayout({
        ratioKey,
        slideWidth: asset.image.width,
        slideHeight: asset.image.height,
      });
      preparedSlides.push({
        ...slide,
        image: asset.image,
        canvas: renderSlideCanvas(layout, asset.image),
        layout,
        cleanup: asset.cleanup,
      });
    }
    return {
      preset,
      slides: preparedSlides,
      timeline: buildSlideTimeline(preparedSlides.length),
    };
  } catch (error) {
    preparedSlides.forEach((slide) => {
      try { slide.cleanup?.(); } catch (_) {}
    });
    throw error;
  }
}

function cleanupPreparedSlides(prepared) {
  prepared?.slides?.forEach((slide) => {
    try { slide.cleanup?.(); } catch (_) {}
  });
}

function drawSlideshowFrame(ctx, prepared, elapsedMs) {
  const state = resolveSlideRenderState(prepared.timeline, elapsedMs);
  ctx.fillStyle = '#081120';
  ctx.fillRect(0, 0, prepared.preset.width, prepared.preset.height);

  state.slides.forEach((slideState) => {
    const slide = prepared.slides[slideState.index];
    if (!slide?.canvas) return;
    ctx.save();
    ctx.globalAlpha = slideState.alpha;
    ctx.drawImage(slide.canvas, 0, 0, prepared.preset.width, prepared.preset.height);
    ctx.restore();
  });

  return state;
}

function reportProgress(callback, payload) {
  if (typeof callback === 'function') callback(payload);
}

export async function downloadVideoPoster({
  ratio,
  slides,
  sectorSlug,
  options = {},
} = {}) {
  const ratioKey = normalizeRatioKey(ratio);
  const ratioLabel = ratioKey.replace('x', ':');

  if (window.toast) {
    window.toast('info', 'Video Generation', `Generating ${ratioLabel} Video... Please remain on this tab.`);
  }

  if (typeof MediaRecorder === 'undefined') {
    if (window.toast) window.toast('error', 'Video Generation', 'Your browser does not support MediaRecorder.');
    throw new Error('MediaRecorder is not supported in this browser.');
  }

  const slideDeck = Array.isArray(slides) ? slides : [];
  if (!slideDeck.length) {
    throw new Error('No poster slides were provided for video export.');
  }

  const {
    autoDownload = true,
    returnBlob = false,
    renderScale,
    forceMimeType,
    mimeCandidates,
    retryAttempt = 0,
    requireMp4 = false,
    onProgress,
  } = options || {};

  let prepared = null;

  return new Promise(async (resolve, reject) => {
    let safeResolve = resolve;
    let safeReject = reject;

    try {
      prepared = await prepareSlides(ratioKey, slideDeck);

      const { width, height } = prepared.preset;
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

      const fps = 30;
      const frameDuration = 1000 / fps;
      let elapsed = 0;
      let lastTick = performance.now();
      let settled = false;
      let stopped = false;
      let lastReportedSlide = -1;
      const stream = canvas.captureStream(fps);
      const audioState = await attachBackgroundAudioTrack(stream, { durationMs: prepared.timeline.totalDuration });
      const mimeType = pickMimeType({
        forceMimeType,
        candidates: mimeCandidates || getMimeCandidates(),
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
        cleanupPreparedSlides(prepared);
        resolve(value);
      };

      safeReject = (error) => {
        if (settled) return;
        settled = true;
        cleanupPreparedSlides(prepared);
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
        const safeElapsed = Math.max(
          0,
          Math.min(elapsedMs, Math.max(0, prepared.timeline.totalDuration - 1)),
        );
        const state = drawSlideshowFrame(ctx, prepared, safeElapsed);
        if (state.primaryIndex !== lastReportedSlide) {
          lastReportedSlide = state.primaryIndex;
          reportProgress(onProgress, {
            phase: 'encoding',
            current: state.primaryIndex + 1,
            total: prepared.slides.length,
            message: prepared.slides.length > 1
              ? `Encoding slideshow ${state.primaryIndex + 1}/${prepared.slides.length}…`
              : 'Encoding slideshow…',
          });
        }
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
              const retry = await downloadVideoPoster({
                ratio: ratioKey,
                slides: slideDeck,
                sectorSlug,
                options: {
                  ...options,
                  renderScale: Math.min(scale, 0.8),
                  forceMimeType: null,
                  mimeCandidates: getMimeCandidates(),
                  retryAttempt: retryAttempt + 1,
                  requireMp4,
                },
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
                const retry = await downloadVideoPoster({
                  ratio: ratioKey,
                  slides: slideDeck,
                  sectorSlug,
                  options: {
                    ...options,
                    renderScale: Math.min(scale, 0.8),
                    forceMimeType: null,
                    mimeCandidates: getMimeCandidates(),
                    retryAttempt: retryAttempt + 1,
                    requireMp4,
                  },
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
              reportProgress(onProgress, {
                phase: 'converting',
                current: prepared.slides.length,
                total: prepared.slides.length,
                message: 'Converting to MP4…',
              });
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
        const filename = `zamra-video-${ratioKey}-${sectorSlug || 'sector'}-${Date.now()}.${extension}`;

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
            const retry = await downloadVideoPoster({
              ratio: ratioKey,
              slides: slideDeck,
              sectorSlug,
              options: {
                ...options,
                renderScale: Math.min(scale, 0.8),
                forceMimeType: null,
                mimeCandidates: getMimeCandidates(),
                retryAttempt: retryAttempt + 1,
                requireMp4,
              },
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

      reportProgress(onProgress, {
        phase: 'encoding',
        current: 1,
        total: prepared.slides.length,
        message: prepared.slides.length > 1 ? `Encoding slideshow 1/${prepared.slides.length}…` : 'Encoding slideshow…',
      });
      recorder.start(1000);

      function drawLoop(now) {
        if (stopped) return;
        const delta = Math.min(Math.max(0, now - lastTick), frameDuration);
        lastTick = now;
        elapsed += delta;
        let shouldStop = false;

        if (elapsed > prepared.timeline.totalDuration) {
          elapsed = prepared.timeline.totalDuration;
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
      }, prepared.timeline.totalDuration + 1500);

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
