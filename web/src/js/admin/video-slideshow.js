export const VIDEO_SLIDESHOW_TIMINGS = Object.freeze({
  fadeInMs: 200,
  holdMs: 4200,
  transitionMs: 300,
  fadeOutMs: 200,
});

export const VIDEO_SLIDESHOW_PRESETS = Object.freeze({
  '1x1': Object.freeze({
    width: 1080,
    height: 1080,
    paddingX: 52,
    paddingY: 48,
    cardRadius: 36,
    shadowBlur: 52,
    shadowOffsetY: 20,
    backdropScale: 1.16,
    backdropBlur: 18,
    backdropBrightness: 0.72,
    backdropSaturation: 1.02,
    overlayAlpha: 0.34,
    cardAspectMinScale: 0.82,
    cardAspectMaxScale: 1.1,
    cardFocusX: 0.5,
    cardFocusY: 0.7,
  }),
  '9x16': Object.freeze({
    width: 1080,
    height: 1920,
    paddingX: 44,
    paddingY: 52,
    cardRadius: 36,
    shadowBlur: 56,
    shadowOffsetY: 22,
    backdropScale: 1.18,
    backdropBlur: 18,
    backdropBrightness: 0.7,
    backdropSaturation: 1.04,
    overlayAlpha: 0.36,
    cardAspectMinScale: 0.82,
    cardAspectMaxScale: 1.08,
    cardFocusX: 0.5,
    cardFocusY: 0.68,
  }),
  '16x9': Object.freeze({
    width: 1920,
    height: 1080,
    paddingX: 56,
    paddingY: 36,
    cardRadius: 30,
    shadowBlur: 56,
    shadowOffsetY: 20,
    backdropScale: 1.18,
    backdropBlur: 20,
    backdropBrightness: 0.74,
    backdropSaturation: 1.03,
    overlayAlpha: 0.36,
    cardAspectMinScale: 0.82,
    cardAspectMaxScale: 1.1,
    cardFocusX: 0.5,
    cardFocusY: 0.72,
  }),
});

const DEFAULT_RATIO_KEY = '1x1';

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

export function normalizeRatioKey(value) {
  const cleaned = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[xX:×]/g, 'x')
    .replace(/\s+/g, '');
  return VIDEO_SLIDESHOW_PRESETS[cleaned] ? cleaned : DEFAULT_RATIO_KEY;
}

export function getSlideshowPreset(ratioKey) {
  return VIDEO_SLIDESHOW_PRESETS[normalizeRatioKey(ratioKey)];
}

export function containRect(sourceWidth, sourceHeight, maxWidth, maxHeight) {
  const width = Math.max(1, Number(sourceWidth) || 1);
  const height = Math.max(1, Number(sourceHeight) || 1);
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: width * scale,
    height: height * scale,
  };
}

export function fitRectToAspect(maxWidth, maxHeight, aspectRatio) {
  const width = Math.max(1, Number(maxWidth) || 1);
  const height = Math.max(1, Number(maxHeight) || 1);
  const ratio = Math.max(0.01, Number(aspectRatio) || 1);

  let fittedWidth = width;
  let fittedHeight = fittedWidth / ratio;
  if (fittedHeight > height) {
    fittedHeight = height;
    fittedWidth = fittedHeight * ratio;
  }

  return {
    width: fittedWidth,
    height: fittedHeight,
  };
}

export function coverImageRect(sourceWidth, sourceHeight, targetWidth, targetHeight, options = {}) {
  const width = Math.max(1, Number(sourceWidth) || 1);
  const height = Math.max(1, Number(sourceHeight) || 1);
  const sourceRatio = width / height;
  const targetRatio = Math.max(1, Number(targetWidth) || 1) / Math.max(1, Number(targetHeight) || 1);
  const focusX = clamp(options.focusX ?? 0.5, 0, 1);
  const focusY = clamp(options.focusY ?? 0.5, 0, 1);

  let sw = width;
  let sh = height;
  let sx = 0;
  let sy = 0;

  if (sourceRatio > targetRatio) {
    sw = height * targetRatio;
    sx = (width - sw) * focusX;
  } else {
    sh = width / targetRatio;
    sy = (height - sh) * focusY;
  }

  return { sx, sy, sw, sh };
}

export function planSlideshowLayout({
  ratioKey,
  slideWidth = 800,
  slideHeight = 1040,
} = {}) {
  const normalizedRatio = normalizeRatioKey(ratioKey);
  const preset = getSlideshowPreset(normalizedRatio);
  const canvas = { width: preset.width, height: preset.height };
  const maxCardWidth = canvas.width - (preset.paddingX * 2);
  const maxCardHeight = canvas.height - (preset.paddingY * 2);
  const safeSlideWidth = Math.max(1, Number(slideWidth) || 1);
  const safeSlideHeight = Math.max(1, Number(slideHeight) || 1);
  const sourceRatio = safeSlideWidth / safeSlideHeight;
  const stageRatio = maxCardWidth / maxCardHeight;
  const aspectMinScale = Math.max(0.4, Number(preset.cardAspectMinScale) || 1);
  const aspectMaxScale = Math.max(aspectMinScale, Number(preset.cardAspectMaxScale) || aspectMinScale);
  const targetRatio = clamp(stageRatio, sourceRatio * aspectMinScale, sourceRatio * aspectMaxScale);
  const fitted = fitRectToAspect(maxCardWidth, maxCardHeight, targetRatio);
  const card = {
    x: (canvas.width - fitted.width) / 2,
    y: (canvas.height - fitted.height) / 2,
    width: fitted.width,
    height: fitted.height,
    radius: preset.cardRadius,
    crop: coverImageRect(safeSlideWidth, safeSlideHeight, fitted.width, fitted.height, {
      focusX: preset.cardFocusX ?? 0.5,
      focusY: preset.cardFocusY ?? 0.5,
    }),
  };

  return {
    ratioKey: normalizedRatio,
    canvas,
    preset,
    source: {
      width: safeSlideWidth,
      height: safeSlideHeight,
    },
    card,
  };
}

export function buildSlideTimeline(slideCount, timings = VIDEO_SLIDESHOW_TIMINGS) {
  const count = Math.max(1, Number(slideCount) || 0);
  const slides = [];
  let enterStart = 0;

  for (let index = 0; index < count; index += 1) {
    const enterDuration = index === 0 ? timings.fadeInMs : timings.transitionMs;
    const enterEnd = enterStart + enterDuration;
    const holdStart = enterEnd;
    const holdEnd = holdStart + timings.holdMs;
    const exitDuration = index === count - 1 ? timings.fadeOutMs : timings.transitionMs;
    const exitStart = holdEnd;
    const exitEnd = exitStart + exitDuration;

    slides.push({
      index,
      enterStart,
      enterEnd,
      holdStart,
      holdEnd,
      exitStart,
      exitEnd,
      enterDuration,
      exitDuration,
    });

    enterStart = holdEnd;
  }

  return {
    slideCount: count,
    slides,
    totalDuration: slides[slides.length - 1]?.exitEnd || 0,
    timings,
  };
}

export function resolveSlideRenderState(timeline, elapsedMs) {
  const totalDuration = Math.max(0, Number(timeline?.totalDuration) || 0);
  const safeElapsed = clamp(elapsedMs, 0, Math.max(0, totalDuration - 0.0001));
  const activeSlides = [];

  (timeline?.slides || []).forEach((slide) => {
    if (safeElapsed < slide.enterStart || safeElapsed >= slide.exitEnd) return;

    let alpha = 1;
    if (safeElapsed < slide.enterEnd) {
      alpha = slide.enterDuration
        ? clamp((safeElapsed - slide.enterStart) / slide.enterDuration, 0, 1)
        : 1;
    } else if (safeElapsed >= slide.exitStart) {
      const progress = slide.exitDuration
        ? clamp((safeElapsed - slide.exitStart) / slide.exitDuration, 0, 1)
        : 1;
      alpha = 1 - progress;
    }

    if (alpha > 0) {
      activeSlides.push({ index: slide.index, alpha });
    }
  });

  const primarySlide = activeSlides.reduce((best, slide) => (
    !best || slide.alpha >= best.alpha ? slide : best
  ), null);

  return {
    elapsedMs: safeElapsed,
    slides: activeSlides,
    primaryIndex: primarySlide?.index ?? 0,
  };
}
