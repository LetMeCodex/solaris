// Screenshots through the report's scroll hero: node capture/report-hero.mjs [W H]
import { chromium } from 'playwright';
import fs from 'node:fs';

const W = Number(process.argv[2] || 1440);
const H = Number(process.argv[3] || 900);
fs.mkdirSync('out/report-hero', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:5199/solaris/report/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `out/report-hero/${W}-pre.jpg`, type: 'jpeg', quality: 78 });
await page.waitForTimeout(5000);
const total = await page.evaluate(() => document.querySelector('.sh').offsetHeight - innerHeight);
const ps = [0, 0.1, 0.24, 0.44, 0.58, 0.72, 0.85, 0.97, 1.0];
let k = 0;
for (const p of ps) {
  await page.evaluate(async (y) => {
    const from = scrollY;
    for (let j = 1; j <= 12; j++) { window.scrollTo(0, from + ((y - from) * j) / 12); await new Promise((r) => setTimeout(r, 50)); }
  }, total * p);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `out/report-hero/${W}-${String(k++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 78 });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
