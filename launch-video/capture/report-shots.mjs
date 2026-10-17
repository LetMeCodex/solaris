// Screenshots of the technical report, for review: node capture/report-shots.mjs [selector...]
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.REPORT_URL || 'http://localhost:5199/solaris/report/';
const sels = process.argv.slice(2);
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 900);
fs.mkdirSync('out/report', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(4500);
await page.screenshot({ path: 'out/report/00-hero.jpg', type: 'jpeg', quality: 80 });
let i = 1;
for (const sel of sels) {
  const ok = await page.evaluate(async (sel) => {
    const el = sel.startsWith('fig:') ? document.querySelectorAll('.fig')[Number(sel.slice(4)) - 1] : document.querySelector(sel);
    if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    // Step there so scroll-driven animations play as they would for a reader
    const from = window.scrollY;
    for (let k = 1; k <= 20; k++) { window.scrollTo(0, from + ((y - from) * k) / 20); await new Promise((r) => setTimeout(r, 40)); }
    return true;
  }, sel);
  if (!ok) { console.log('missing', sel); continue; }
  await page.waitForTimeout(2600);
  const name = `out/report/${String(i++).padStart(2, '0')}-${sel.replace(/[^a-z0-9]+/gi, '_')}.jpg`;
  await page.screenshot({ path: name, type: 'jpeg', quality: 80 });
  console.log(name);
}
console.log('errors:', errors.length ? errors.slice(0, 8) : 'none');
await browser.close();
