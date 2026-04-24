export const VIDEO_MAX_ROWS = 12;

const DEFAULT_RATIO_KEY = '1x1';

export const RATIO_SCENE_PRESETS = {
  '1x1': {
    width: 1080,
    height: 1080,
    maxRows: VIDEO_MAX_ROWS,
    safeX: 84,
    safeTop: 56,
    safeBottom: 30,
    topBarHeight: 16,
    heroHeight: 314,
    cardInset: 44,
    cardOverlap: 78,
    cardPadX: 38,
    cardPadTop: 36,
    cardPadBottom: 30,
    cardRadius: 32,
    headerBand: 48,
    summaryHeight: 120,
    summaryGap: 24,
    summaryMinY: 0.54,
    footerHeight: 102,
    footerGap: 16,
    rowTargetHeight: 62,
    rowMinHeight: 36,
    rowMaxHeight: 86,
    rowGap: 10,
    rowInset: 10,
    rowRadius: 14,
    badgeWidth: 236,
    badgeHeight: 44,
    badgeY: 64,
    badgeTextSize: 15,
    titleBaseSize: 62,
    titleMinSize: 40,
    titleY: 170,
    subtitleSize: 22,
    subtitleY: 222,
    badgeTitleGap: 22,
    titleSubtitleGap: 18,
    subtitleCardGap: 28,
    titleMaxWidthFactor: 0.7,
    columns: { airline: 0.39, time: 0.6, baggage: 0.75 },
    typeScale: {
      tableHead: 18,
      date: 22,
      airlineFallback: 17,
      time: 18,
      baggage: 16,
      fare: 22,
      summaryMeta: 16,
      summaryTitle: 28,
      footerTitle: 22,
      footerInfo: 18
    },
    logo: {
      rowMaxWidth: 98,
      rowHeight: 34,
      footerSize: 44
    },
    fareBadge: {
      height: 42,
      padX: 16
    },
    timing: {
      heroReveal: 560,
      cardDelay: 90,
      cardReveal: 500,
      rowsDelay: 240,
      rowStagger: 180,
      rowReveal: 420,
      footerDelay: 260,
      footerReveal: 460,
      hold: 1200
    },
    minPageDuration: 6200
  },
  '9x16': {
    width: 1080,
    height: 1920,
    maxRows: VIDEO_MAX_ROWS,
    safeX: 54,
    safeTop: 54,
    safeBottom: 48,
    topBarHeight: 16,
    heroHeight: 470,
    cardInset: 40,
    cardOverlap: 96,
    cardPadX: 40,
    cardPadTop: 42,
    cardPadBottom: 36,
    cardRadius: 36,
    headerBand: 58,
    summaryHeight: 160,
    summaryGap: 28,
    summaryMinY: 0.52,
    footerHeight: 136,
    footerGap: 22,
    rowTargetHeight: 86,
    rowMinHeight: 38,
    rowMaxHeight: 104,
    rowGap: 12,
    rowInset: 10,
    rowRadius: 16,
    badgeWidth: 264,
    badgeHeight: 48,
    badgeY: 88,
    badgeTextSize: 16,
    titleBaseSize: 68,
    titleMinSize: 44,
    titleY: 196,
    subtitleSize: 24,
    subtitleY: 262,
    badgeTitleGap: 28,
    titleSubtitleGap: 24,
    subtitleCardGap: 34,
    titleMaxWidthFactor: 0.74,
    columns: { airline: 0.39, time: 0.595, baggage: 0.748 },
    typeScale: {
      tableHead: 18,
      date: 24,
      airlineFallback: 18,
      time: 20,
      baggage: 18,
      fare: 24,
      summaryMeta: 18,
      summaryTitle: 30,
      footerTitle: 24,
      footerInfo: 19
    },
    logo: {
      rowMaxWidth: 112,
      rowHeight: 38,
      footerSize: 50
    },
    fareBadge: {
      height: 46,
      padX: 18
    },
    timing: {
      heroReveal: 600,
      cardDelay: 80,
      cardReveal: 540,
      rowsDelay: 220,
      rowStagger: 190,
      rowReveal: 430,
      footerDelay: 320,
      footerReveal: 520,
      hold: 1300
    },
    minPageDuration: 7000
  },
  '16x9': {
    width: 1920,
    height: 1080,
    maxRows: VIDEO_MAX_ROWS,
    safeX: 86,
    safeTop: 42,
    safeBottom: 36,
    topBarHeight: 16,
    heroHeight: 306,
    cardInset: 72,
    maxCardWidth: 1708,
    cardOverlap: 70,
    cardPadX: 48,
    cardPadTop: 34,
    cardPadBottom: 30,
    cardRadius: 30,
    headerBand: 44,
    summaryHeight: 124,
    summaryGap: 24,
    summaryMinY: 0.5,
    footerHeight: 96,
    footerGap: 16,
    rowTargetHeight: 62,
    rowMinHeight: 36,
    rowMaxHeight: 76,
    rowGap: 10,
    rowInset: 10,
    rowRadius: 14,
    badgeWidth: 248,
    badgeHeight: 40,
    badgeY: 54,
    badgeTextSize: 15,
    titleBaseSize: 64,
    titleMinSize: 44,
    titleY: 154,
    subtitleSize: 22,
    subtitleY: 212,
    badgeTitleGap: 20,
    titleSubtitleGap: 16,
    subtitleCardGap: 24,
    titleMaxWidthFactor: 0.55,
    columns: { airline: 0.39, time: 0.615, baggage: 0.79 },
    typeScale: {
      tableHead: 17,
      date: 20,
      airlineFallback: 16,
      time: 18,
      baggage: 16,
      fare: 22,
      summaryMeta: 15,
      summaryTitle: 24,
      footerTitle: 22,
      footerInfo: 17
    },
    logo: {
      rowMaxWidth: 110,
      rowHeight: 34,
      footerSize: 42
    },
    fareBadge: {
      height: 40,
      padX: 16
    },
    timing: {
      heroReveal: 520,
      cardDelay: 70,
      cardReveal: 470,
      rowsDelay: 220,
      rowStagger: 170,
      rowReveal: 390,
      footerDelay: 280,
      footerReveal: 430,
      hold: 1150
    },
    minPageDuration: 5600
  }
};

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

export function normalizeRatioKey(value) {
  const cleaned = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[xX:×]/g, 'x')
    .replace(/\s+/g, '');
  return RATIO_SCENE_PRESETS[cleaned] ? cleaned : DEFAULT_RATIO_KEY;
}

export function getScenePreset(ratioKey) {
  return RATIO_SCENE_PRESETS[normalizeRatioKey(ratioKey)];
}

export function estimateTextWidth(text, fontSize) {
  const input = String(text || '');
  let width = 0;
  for (const ch of input) {
    if (ch === ' ') {
      width += fontSize * 0.28;
    } else if (/[A-Z0-9]/.test(ch)) {
      width += fontSize * 0.66;
    } else if (/[a-z]/.test(ch)) {
      width += fontSize * 0.56;
    } else if (/[^\w\s]/.test(ch)) {
      width += fontSize * 0.46;
    } else {
      width += fontSize * 0.58;
    }
  }
  return width;
}

export function fitTitleFontSize(titleText, maxWidth, baseSize, minSize) {
  let size = Math.max(minSize, baseSize);
  while (size > 12 && estimateTextWidth(titleText, size) > maxWidth) {
    size -= 2;
  }
  return size;
}

function scaleType(value, rowHeight, targetRowHeight, minimum) {
  const scaled = value * (rowHeight / targetRowHeight);
  return Math.max(minimum, Math.round(scaled));
}

export function planVideoScene({
  ratioKey,
  rowCount = 0,
  titleText = '',
  maxRows = VIDEO_MAX_ROWS
} = {}) {
  const normalizedRatio = normalizeRatioKey(ratioKey);
  const preset = getScenePreset(normalizedRatio);
  const width = preset.width;
  const height = preset.height;
  const safe = {
    x: preset.safeX,
    y: preset.safeTop,
    width: width - (preset.safeX * 2),
    height: height - preset.safeTop - preset.safeBottom
  };
  const availableCardWidth = width - (preset.cardInset * 2);
  const cardWidth = Math.min(availableCardWidth, preset.maxCardWidth || availableCardWidth);
  const cardX = Math.round((width - cardWidth) / 2);
  const cardY = preset.heroHeight - preset.cardOverlap;

  const topBar = {
    x: 0,
    y: 0,
    width,
    height: preset.topBarHeight
  };
  const hero = {
    x: 0,
    y: 0,
    width,
    height: preset.heroHeight
  };
  const badge = {
    width: preset.badgeWidth,
    height: preset.badgeHeight,
    x: (width - preset.badgeWidth) / 2,
    y: preset.badgeY,
    textSize: preset.badgeTextSize
  };
  const titleMaxWidth = Math.min(safe.width, cardWidth) * preset.titleMaxWidthFactor;
  const titleSize = fitTitleFontSize(
    titleText,
    titleMaxWidth,
    preset.titleBaseSize,
    preset.titleMinSize
  );
  const titleHalf = titleSize / 2;
  const subtitleHalf = preset.subtitleSize / 2;
  const badgeBottom = badge.y + badge.height;
  const badgeTitleGap = preset.badgeTitleGap ?? Math.max(20, Math.round(titleSize * 0.3));
  const titleSubtitleGap = preset.titleSubtitleGap ?? Math.max(16, Math.round(titleSize * 0.16));
  const subtitleCardGap = preset.subtitleCardGap ?? Math.max(20, Math.round(preset.subtitleSize * 1.1));
  const titleMinY = badgeBottom + badgeTitleGap + titleHalf;
  const subtitleMinY = titleMinY + titleHalf + titleSubtitleGap + subtitleHalf;
  const subtitleMaxY = cardY - subtitleCardGap - subtitleHalf;
  const subtitleY = clamp(
    preset.subtitleY,
    titleMinY + titleHalf + titleSubtitleGap + subtitleHalf,
    Math.max(subtitleMinY, subtitleMaxY)
  );
  const titleMaxY = subtitleY - subtitleHalf - titleSubtitleGap - titleHalf;
  const titleY = clamp(
    preset.titleY,
    titleMinY,
    Math.max(titleMinY, titleMaxY)
  );
  const title = {
    text: titleText,
    x: width / 2,
    y: titleY,
    maxWidth: titleMaxWidth,
    fontSize: titleSize
  };
  const subtitle = {
    x: width / 2,
    y: subtitleY,
    fontSize: preset.subtitleSize
  };

  const footer = {
    x: 0,
    y: height - preset.footerHeight,
    width,
    height: preset.footerHeight
  };

  const card = {
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: height - cardY - preset.footerGap - preset.footerHeight - preset.safeBottom,
    radius: preset.cardRadius
  };

  const content = {
    x: card.x + preset.cardPadX,
    y: card.y + preset.cardPadTop,
    width: card.width - (preset.cardPadX * 2),
    height: card.height - preset.cardPadTop - preset.cardPadBottom
  };

  const tableHead = {
    x: content.x,
    y: content.y,
    width: content.width,
    height: preset.headerBand
  };

  const renderRows = Math.max(0, Number(rowCount || 0));
  const rowGap = preset.rowGap;
  const maxRowBlockHeight = Math.max(
    0,
    content.height - preset.headerBand - preset.summaryHeight - preset.summaryGap
  );
  const targetRowsPerPage = Math.max(
    1,
    Math.min(
      maxRows,
      Math.floor((maxRowBlockHeight + rowGap) / (preset.rowTargetHeight + rowGap))
    )
  );
  const effectiveCount = Math.max(renderRows, 1);
  const rowHeight = clamp(
    (maxRowBlockHeight - (rowGap * Math.max(0, effectiveCount - 1))) / effectiveCount,
    Math.min(24, preset.rowMinHeight),
    preset.rowMaxHeight
  );
  const rowRects = [];
  const rowStartY = tableHead.y + tableHead.height + 12;
  const rowBlockHeight = renderRows > 0
    ? (renderRows * rowHeight) + (Math.max(0, renderRows - 1) * rowGap)
    : 0;
  const summaryYMin = rowStartY + Math.max(120, maxRowBlockHeight * preset.summaryMinY);
  const summaryYMax = content.y + content.height - preset.summaryHeight;
  const summaryY = clamp(
    rowStartY + rowBlockHeight + preset.summaryGap,
    summaryYMin,
    summaryYMax
  );

  for (let index = 0; index < renderRows; index += 1) {
    rowRects.push({
      x: content.x,
      y: rowStartY + (index * (rowHeight + rowGap)),
      width: content.width,
      height: rowHeight,
      radius: preset.rowRadius
    });
  }

  const summary = {
    x: content.x,
    y: summaryY,
    width: content.width,
    height: preset.summaryHeight,
    radius: Math.max(18, preset.rowRadius + 4)
  };

  const columns = {
    tableX: content.x,
    tableWidth: content.width,
    dateLeft: content.x + 18,
    airlineCenter: content.x + (content.width * preset.columns.airline),
    timeCenter: content.x + (content.width * preset.columns.time),
    baggageCenter: content.x + (content.width * preset.columns.baggage),
    fareRight: content.x + content.width - 18
  };

  const typography = {
    tableHead: scaleType(preset.typeScale.tableHead, rowHeight, preset.rowTargetHeight, 13),
    date: scaleType(preset.typeScale.date, rowHeight, preset.rowTargetHeight, 14),
    airlineFallback: scaleType(preset.typeScale.airlineFallback, rowHeight, preset.rowTargetHeight, 13),
    time: scaleType(preset.typeScale.time, rowHeight, preset.rowTargetHeight, 13),
    baggage: scaleType(preset.typeScale.baggage, rowHeight, preset.rowTargetHeight, 12),
    fare: scaleType(preset.typeScale.fare, rowHeight, preset.rowTargetHeight, 14),
    summaryMeta: preset.typeScale.summaryMeta,
    summaryTitle: preset.typeScale.summaryTitle,
    footerTitle: preset.typeScale.footerTitle,
    footerInfo: preset.typeScale.footerInfo
  };

  const footerContent = {
    leftX: card.x,
    rightX: width - card.x,
    centerY: footer.y + (footer.height / 2),
    logoSize: preset.logo.footerSize
  };

  const listTimelineStart = preset.timing.rowsDelay;
  const footerStart = listTimelineStart + (Math.max(0, renderRows - 1) * preset.timing.rowStagger) + preset.timing.footerDelay;
  const pageDuration = Math.max(
    preset.minPageDuration,
    footerStart + preset.timing.footerReveal + preset.timing.hold
  );

  return {
    ratioKey: normalizedRatio,
    canvas: { width, height },
    preset,
    safe,
    topBar,
    hero,
    badge,
    title,
    subtitle,
    card,
    content,
    tableHead,
    columns,
    rows: rowRects,
    rowHeight,
    rowGap,
    summary,
    footer,
    footerContent,
    recommendedRowsPerPage: targetRowsPerPage,
    typography,
    logo: {
      rowMaxWidth: Math.round(preset.logo.rowMaxWidth * (rowHeight / preset.rowTargetHeight)),
      rowHeight: Math.round(preset.logo.rowHeight * (rowHeight / preset.rowTargetHeight))
    },
    fareBadge: {
      height: Math.max(28, Math.round(preset.fareBadge.height * (rowHeight / preset.rowTargetHeight))),
      padX: Math.max(12, Math.round(preset.fareBadge.padX * (rowHeight / preset.rowTargetHeight)))
    },
    summaryCopy: {
      metaY: summary.y + 34,
      titleY: summary.y + Math.round(summary.height * 0.58),
      infoY: summary.y + summary.height - 28
    },
    timeline: {
      heroStart: 0,
      heroReveal: preset.timing.heroReveal,
      cardStart: preset.timing.cardDelay,
      cardReveal: preset.timing.cardReveal,
      rowsStart: listTimelineStart,
      rowStagger: preset.timing.rowStagger,
      rowReveal: preset.timing.rowReveal,
      footerStart,
      footerReveal: preset.timing.footerReveal,
      hold: preset.timing.hold,
      pageDuration
    }
  };
}
