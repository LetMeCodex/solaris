import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(pathToFileURL(path.resolve('out/readme/preview.html')).href, { waitUntil: 'load' });
await page.waitForTimeout(2000);
for (const alt of ['Meet Vela', 'Vela: Hi', 'Inside the code']) {
  await page.evaluate((a) => document.querySelector(`img[alt*="${a}"]`).scrollIntoView({ block: 'center' }), alt);
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `out/readme/scroll-${alt.replace(/[^a-z]/gi, '')}.png` });
}
await browser.close();
