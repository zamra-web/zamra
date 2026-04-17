/**
 * Puppeteer renderer: launches headless Chromium (via @sparticuz/chromium),
 * loads an HTML string, and screenshots the viewport to a JPEG Buffer.
 *
 * Browser is launched per-invocation. For multiple sectors in one scheduled
 * run, call renderHtmlBatch to reuse the browser across renders.
 */

const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

async function launch() {
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1080, height: 1350, deviceScaleFactor: 1 },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

/**
 * Renders a batch of HTML strings. Reuses one browser across all pages.
 * @param {string[]} htmlDocs
 * @returns {Promise<Buffer[]>} JPEG buffers, same order as input
 */
async function renderHtmlBatch(htmlDocs) {
  const browser = await launch();
  try {
    const results = [];
    for (const html of htmlDocs) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
      const buf = await page.screenshot({ type: "jpeg", quality: 92, fullPage: false });
      await page.close();
      results.push(buf);
    }
    return results;
  } finally {
    await browser.close();
  }
}

module.exports = { renderHtmlBatch };
