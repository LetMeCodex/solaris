// Screenshot of the main site's HUD: node capture/main-shot.mjs [name] (env W, H, WAIT)
import { chromium } from 'playwright';
const W = Number(process.env.W || 1440), H = Number(process.env.H || 900);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => { try { localStorage.setItem('solaris.tour.done', '1'); } catch {} });
await page.goto(process.env.URL || 'http://localhost:5199/solaris/', { waitUntil: 'load' });
await page.waitForTimeout(Number(process.env.WAIT || 14000));
for (const t of ['Enter', 'Begin', 'Skip']) { const b = page.getByRole('button', { name: new RegExp(t, 'i') }).first(); if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(3000); } }
await page.screenshot({ path: `out/${process.argv[2] || 'main'}.jpg`, type: 'jpeg', quality: 82 });
if (process.env.HOVER) { await page.hover(process.env.HOVER).catch((e) => console.log('hover', e.message)); await page.waitForTimeout(1500); await page.screenshot({ path: `out/${process.argv[2] || 'main'}-hover.jpg`, type: 'jpeg', quality: 82 }); }
if (process.env.CLICK) {
  await page.click(process.env.CLICK);
  for (const t of [250, 450, 700]) { await page.waitForTimeout(t === 250 ? 250 : t - (t === 450 ? 250 : 450)); await page.screenshot({ path: `out/${process.argv[2] || 'main'}-click-${t}.jpg`, type: 'jpeg', quality: 82 }); }
  await page.waitForTimeout(2500); console.log('url after click:', page.url());
}
console.log('errors:', errors.length ? errors.slice(0, 5) : 'none');
await browser.close();
