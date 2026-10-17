// Look at a CodePen: save its rendered source and screenshots down the scroll.
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2];
fs.mkdirSync('out/pen', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(6000);
const frame = page.frames().find((f) => f !== page.mainFrame() && /cdpn|codepen/.test(f.url())) ?? page.mainFrame();
console.log('frame', frame.url());
const html = await frame.evaluate(() => document.documentElement.outerHTML);
fs.writeFileSync('out/pen/source.html', html);
const scripts = await frame.evaluate(() => [...document.scripts].map((s) => s.src || `[inline ${s.textContent.length}]`));
console.log('scripts', JSON.stringify(scripts));
const h = await frame.evaluate(() => document.documentElement.scrollHeight);
console.log('scrollHeight', h);
const el = await frame.frameElement().catch(() => null);
for (let i = 0; i <= 8; i++) {
  await frame.evaluate((y) => window.scrollTo(0, y), (h - 900) * (i / 8));
  await page.waitForTimeout(1200);
  if (el) await el.screenshot({ path: `out/pen/s${i}.jpg`, type: 'jpeg', quality: 75 });
  else await page.screenshot({ path: `out/pen/s${i}.jpg`, type: 'jpeg', quality: 75 });
}
await browser.close();
