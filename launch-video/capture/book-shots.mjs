// Screenshots of the book's spreads: node capture/book-shots.mjs [page numbers...] (env W, H, WAIT)
import { chromium } from 'playwright';
import fs from 'node:fs';
const URL = process.env.BOOK_URL || 'http://localhost:5199/solaris/book/';
const pages = process.argv.slice(2);
const W = Number(process.env.W || 1600), H = Number(process.env.H || 1000);
fs.mkdirSync('out/book', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', (e) => errors.push(`${p}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${p}: ${m.text()}`));
  await page.goto(`${URL}#p${p}`, { waitUntil: 'load' });
  await page.waitForTimeout(Number(process.env.WAIT || 4000));
  await page.screenshot({ path: `out/book/s${String(p).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 88 });
  await page.close();
}
console.log('errors:', errors.length ? [...new Set(errors)].slice(0, 8) : 'none');
await browser.close();
