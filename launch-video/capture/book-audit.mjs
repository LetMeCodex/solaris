// Opens every spread of the book and reports text that overflows its box or the page.
import { chromium } from 'playwright';
const URL = process.env.BOOK_URL || 'http://localhost:5199/solaris/book/';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.querySelectorAll('.sheet').length);
console.log('sheets', total);
for (let s = 0; s <= total; s++) {
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.pg').forEach((pg) => {
      if (!pg.children.length || !pg.dataset.page) return;
      const rect = pg.getBoundingClientRect();
      if (rect.width < 10) return;
      const k = pg.offsetWidth / rect.width;
      const inner = pg.scrollHeight - pg.clientHeight;
      if (inner > 1) out.push(`${pg.dataset.page}: page overflows by ${inner}px`);
      pg.querySelectorAll('.p-in, .txt, .press, .gloss, .papers, .units, .bugs, .wcs').forEach((el) => {
        const over = el.scrollHeight - el.clientHeight;
        const overW = el.scrollWidth - el.clientWidth;
        if (over > 2 && !el.classList.contains('txt')) out.push(`${pg.dataset.page}: .${el.className.split(' ')[0]} overflows ${over}px down`);
        if (overW > 2 && !el.parentElement.classList.contains('bare')) out.push(`${pg.dataset.page}: .${el.className.split(' ')[0]} overflows ${overW}px across`);
      });
      const pr = pg.getBoundingClientRect();
      pg.querySelectorAll('.say, .cap, .txt p, h2, h3, .band').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || getComputedStyle(el).visibility === 'hidden') return;
        if (b.bottom > pr.bottom - 26 * (rect.width / pg.offsetWidth) && !el.closest('.cover')) out.push(`${pg.dataset.page}: "${el.textContent.slice(0, 40)}" runs into the foot of the page`);
      });
    });
    return [...new Set(out)];
  });
  if (r.length) console.log(`spread ${s}:\n  ` + r.join('\n  '));
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1100);
}
console.log('errors:', errors.length ? [...new Set(errors)].slice(0, 5) : 'none');
await browser.close();
