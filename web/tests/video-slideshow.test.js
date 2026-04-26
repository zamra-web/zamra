import test from 'node:test';
import assert from 'node:assert/strict';

import {
  VIDEO_SLIDESHOW_TIMINGS,
  buildSlideTimeline,
  getSlideshowPreset,
  planSlideshowLayout,
  resolveSlideRenderState,
} from '../src/js/admin/video-slideshow.js';

const RATIOS = ['1x1', '9x16', '16x9'];
const POSTER_WIDTH = 800;
const POSTER_HEIGHT = 1040;

test('slideshow layout keeps the poster card inside every ratio canvas', () => {
  RATIOS.forEach((ratioKey) => {
    const preset = getSlideshowPreset(ratioKey);
    const layout = planSlideshowLayout({
      ratioKey,
      slideWidth: POSTER_WIDTH,
      slideHeight: POSTER_HEIGHT,
    });

    assert.ok(layout.card.x >= 0, `${ratioKey} card starts outside canvas on x`);
    assert.ok(layout.card.y >= 0, `${ratioKey} card starts outside canvas on y`);
    assert.ok(layout.card.x + layout.card.width <= preset.width, `${ratioKey} card exceeds canvas width`);
    assert.ok(layout.card.y + layout.card.height <= preset.height, `${ratioKey} card exceeds canvas height`);
    assert.ok(layout.card.width <= preset.width - (preset.paddingX * 2) + 0.001, `${ratioKey} card ignores horizontal padding`);
    assert.ok(layout.card.height <= preset.height - (preset.paddingY * 2) + 0.001, `${ratioKey} card ignores vertical padding`);
  });
});

test('slide timeline durations match the simple slideshow contract', () => {
  const single = buildSlideTimeline(1);
  assert.equal(single.slideCount, 1);
  assert.equal(
    single.totalDuration,
    VIDEO_SLIDESHOW_TIMINGS.fadeInMs + VIDEO_SLIDESHOW_TIMINGS.holdMs + VIDEO_SLIDESHOW_TIMINGS.fadeOutMs,
  );

  const multi = buildSlideTimeline(3);
  assert.equal(multi.slideCount, 3);
  assert.equal(
    multi.totalDuration,
    VIDEO_SLIDESHOW_TIMINGS.fadeInMs
      + (VIDEO_SLIDESHOW_TIMINGS.holdMs * 3)
      + (VIDEO_SLIDESHOW_TIMINGS.transitionMs * 2)
      + VIDEO_SLIDESHOW_TIMINGS.fadeOutMs,
  );
  multi.slides.forEach((slide, index) => {
    assert.ok(slide.enterStart >= 0, `slide ${index + 1} enterStart is negative`);
    assert.ok(slide.enterEnd >= slide.enterStart, `slide ${index + 1} enterEnd is invalid`);
    assert.ok(slide.holdStart >= slide.enterEnd, `slide ${index + 1} holdStart is invalid`);
    assert.ok(slide.holdEnd >= slide.holdStart, `slide ${index + 1} holdEnd is invalid`);
    assert.ok(slide.exitStart >= slide.holdEnd, `slide ${index + 1} exitStart is invalid`);
    assert.ok(slide.exitEnd >= slide.exitStart, `slide ${index + 1} exitEnd is invalid`);
  });
});

test('slide handoff only activates the expected slides during crossfades', () => {
  const timeline = buildSlideTimeline(3);
  const transitionStart = timeline.slides[0].exitStart;
  const middleOfTransition = transitionStart + (VIDEO_SLIDESHOW_TIMINGS.transitionMs / 2);

  const firstHold = resolveSlideRenderState(timeline, timeline.slides[0].holdStart + 100);
  assert.deepEqual(firstHold.slides.map((slide) => slide.index), [0]);
  assert.equal(firstHold.primaryIndex, 0);

  const crossfade = resolveSlideRenderState(timeline, middleOfTransition);
  assert.deepEqual(crossfade.slides.map((slide) => slide.index), [0, 1]);
  assert.ok(crossfade.slides[0].alpha > 0 && crossfade.slides[0].alpha < 1);
  assert.ok(crossfade.slides[1].alpha > 0 && crossfade.slides[1].alpha < 1);
  assert.equal(crossfade.primaryIndex, 1);

  const secondHold = resolveSlideRenderState(timeline, timeline.slides[1].holdStart + 100);
  assert.deepEqual(secondHold.slides.map((slide) => slide.index), [1]);
  assert.equal(secondHold.primaryIndex, 1);
});
