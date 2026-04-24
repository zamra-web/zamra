import test from 'node:test';
import assert from 'node:assert/strict';

import {
  estimateTextWidth,
  getScenePreset,
  planVideoScene
} from '../src/js/admin/video-scene-planner.js';

const RATIOS = ['1x1', '9x16', '16x9'];
const LONG_TITLE = 'KOZHIKKODE → JEDDAH SPECIAL SUMMER FARE UPDATE';

test('scene geometry stays inside the canvas for every ratio', () => {
  RATIOS.forEach((ratioKey) => {
    const scene = planVideoScene({ ratioKey, rowCount: 8, titleText: LONG_TITLE });
    const { width, height } = scene.canvas;

    [scene.hero, scene.card, scene.summary, scene.footer].forEach((box) => {
      assert.ok(box.x >= 0, `${ratioKey} box starts outside canvas on x`);
      assert.ok(box.y >= 0, `${ratioKey} box starts outside canvas on y`);
      assert.ok(box.x + box.width <= width, `${ratioKey} box exceeds canvas width`);
      assert.ok(box.y + box.height <= height, `${ratioKey} box exceeds canvas height`);
    });
  });
});

test('rows never overlap the summary block or footer', () => {
  RATIOS.forEach((ratioKey) => {
    for (let rowCount = 1; rowCount <= 12; rowCount += 1) {
      const scene = planVideoScene({ ratioKey, rowCount, titleText: LONG_TITLE });
      assert.equal(scene.rows.length, rowCount, `${ratioKey} row count mismatch for ${rowCount}`);
      scene.rows.forEach((row, index) => {
        assert.ok(row.y >= scene.tableHead.y, `${ratioKey} row ${index + 1} starts above the table head`);
        assert.ok(
          row.y + row.height <= scene.summary.y,
          `${ratioKey} row ${index + 1} overlaps the summary block`
        );
      });
      assert.ok(
        scene.summary.y + scene.summary.height <= scene.footer.y,
        `${ratioKey} summary overlaps footer`
      );
    }
  });
});

test('timeline values remain ordered and non-negative', () => {
  RATIOS.forEach((ratioKey) => {
    const scene = planVideoScene({ ratioKey, rowCount: 12, titleText: LONG_TITLE });
    const { timeline } = scene;
    assert.ok(timeline.heroStart >= 0, `${ratioKey} heroStart is negative`);
    assert.ok(timeline.cardStart >= timeline.heroStart, `${ratioKey} card starts before hero`);
    assert.ok(timeline.rowsStart >= timeline.cardStart, `${ratioKey} rows start before card`);
    assert.ok(timeline.footerStart >= timeline.rowsStart, `${ratioKey} footer starts before rows`);
    assert.ok(timeline.pageDuration >= timeline.footerStart + timeline.footerReveal, `${ratioKey} page duration is too short`);
  });
});

test('title fitting stays within the safe header width', () => {
  RATIOS.forEach((ratioKey) => {
    const preset = getScenePreset(ratioKey);
    const scene = planVideoScene({ ratioKey, rowCount: 6, titleText: LONG_TITLE });
    assert.ok(scene.title.fontSize <= preset.titleBaseSize, `${ratioKey} title font grew larger than base`);
    assert.ok(
      estimateTextWidth(scene.title.text, scene.title.fontSize) <= scene.title.maxWidth,
      `${ratioKey} title estimate exceeds safe width`
    );
  });
});
