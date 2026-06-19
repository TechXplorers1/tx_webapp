import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const result = { console: [], errors: [], timings: {} };
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  page.on('console', msg => {
    result.console.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => {
    result.errors.push({ message: err.message, stack: err.stack });
  });

  const start = Date.now();
  try {
    await page.goto('http://localhost:5174/managerworksheet', { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    result.errors.push({ message: 'Navigation failed: ' + e.message });
  }
  const afterLoad = Date.now();

  // Wait additional time to let JS processing happen
  // Click Applications tab to reproduce heavy filtering/rendering
  try {
    await page.click('text=Applications', { timeout: 5000 }).catch(() => {});
  } catch (e) {}

  await page.waitForTimeout(15000);
  const afterProcessing = Date.now();

  // Capture some metrics from the page
  try {
    const perf = await page.evaluate(() => {
      const p = window.performance || {};
      const timing = p.timing || {};
      return {
        navigationStart: timing.navigationStart || 0,
        loadEventEnd: timing.loadEventEnd || 0,
        domComplete: timing.domComplete || 0,
        entries: (performance.getEntries && performance.getEntries().length) || 0,
      };
    });
    result.timings = perf;
  } catch (e) {
    result.errors.push({ message: 'Perf eval failed: ' + e.message });
  }

  // Take a screenshot
  try {
    const screenshotPath = 'c:\\Users\\Mannila Sandeep\\Desktop\\Techxplorers_New\\tx_webapp\\tests\\manager_page.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;
  } catch (e) {
    result.errors.push({ message: 'Screenshot failed: ' + e.message });
  }

  result.wallTime = {
    goto: afterLoad - start,
    processingWait: afterProcessing - afterLoad,
    total: afterProcessing - start
  };

  await browser.close();

  // Output results
  console.log('TEST_RESULT_JSON_START');
  console.log(JSON.stringify(result, null, 2));
  console.log('TEST_RESULT_JSON_END');

  // Also write to file
  fs.writeFileSync('c:\\Users\\Mannila Sandeep\\Desktop\\Techxplorers_New\\tx_webapp\\tests\\manager_test_result.json', JSON.stringify(result, null, 2));
})();
