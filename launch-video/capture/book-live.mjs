// Real input on the book: wheel paging, the scroll view, the ending's clock and name, and the phone strip.
import { chromium } from 'playwright';
const URL = process.env.BOOK_URL || 'http://localhost:5199/solaris/book/';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
const watch = (p) => { p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => m.type() === 'error' && errors.push(m.text())); };

// wheel: a small nudge settles back, a full push turns the page
const desk = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
watch(desk);
await desk.goto(`${URL}#p6`, { waitUntil: 'load' });
await desk.waitForTimeout(3500);
const hash = () => desk.evaluate(() => location.hash);
const h0 = await hash();
await desk.mouse.move(800, 480);
await desk.mouse.wheel(0, 90);
await desk.waitForTimeout(1200);
const h1 = await hash();
for (let i = 0; i < 8; i++) { await desk.mouse.wheel(0, 90); await desk.waitForTimeout(30); }
await desk.waitForTimeout(1600);
const h2 = await hash();
for (let i = 0; i < 8; i++) { await desk.mouse.wheel(0, -90); await desk.waitForTimeout(30); }
await desk.waitForTimeout(1600);
const h3 = await hash();
console.log('wheel', { start: h0, nudge: h1, push: h2, back: h3 });

// the scroll view on a desk
await desk.getByRole('button', { name: 'Scroll view' }).click();
await desk.waitForTimeout(2500);
const sv = await desk.evaluate(() => { const e = document.querySelector('.scrollview') ?? document.scrollingElement; return { cls: e.className, h: e.scrollHeight, view: e.clientHeight, pages: document.querySelectorAll('.scrollview [data-page]').length }; });
console.log('scrollview', sv);
await desk.mouse.move(800, 480);
for (let i = 0; i < 30; i++) { await desk.mouse.wheel(0, 900); await desk.waitForTimeout(40); }
await desk.waitForTimeout(3000);
await desk.screenshot({ path: 'out/book/live-scroll.jpg', type: 'jpeg', quality: 85 });
await desk.close();

// the ending: the counter runs, and the name lines up on its own and again on a click
const end = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
watch(end);
await end.goto(`${URL}#p58`, { waitUntil: 'load' });
await end.waitForTimeout(1500);
const km = () => end.evaluate(() => document.querySelector('.since b')?.textContent);
const a = await km();
await end.waitForTimeout(1200);
const b = await km();
const xy = () => end.evaluate(() => [...document.querySelectorAll('.mark svg g')].map((g) => g.getAttribute('transform')));
const rest = await xy();
await end.waitForTimeout(2600);
const lined = await xy();
await end.waitForTimeout(9500);
const after = await xy();
console.log('since', a, b);
console.log('name rest', rest.slice(0, 2), 'lined', lined.slice(0, 2), 'back', after.slice(0, 2));
await end.screenshot({ path: 'out/book/live-rest.jpg', type: 'jpeg', quality: 88 });
await end.close();

// the phone strip, cut into page-high pieces around the new pages
const ph = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
watch(ph);
await ph.goto(URL, { waitUntil: 'load' });
await ph.waitForTimeout(3000);
const over = await ph.evaluate(() => ({ w: document.documentElement.scrollWidth, view: innerWidth, btn: !!document.querySelector('.modebtn') && getComputedStyle(document.querySelector('.modebtn')).display }));
console.log('phone', over);
for (const id of (process.argv[2] || 'cover,midnight,late,old-light,c12,wrong,goodbye,letter,ending,maker,back').split(',')) {
  const el = ph.locator(`[data-page="${id}"]`).first();
  if (!(await el.count())) { console.log('no page', id); continue; }
  await el.scrollIntoViewIfNeeded();
  await ph.waitForTimeout(2200);
  await el.screenshot({ path: `out/book/ph-${id}.jpg`, type: 'jpeg', quality: 80 });
}
await ph.close();
console.log('errors:', errors.length ? [...new Set(errors)].slice(0, 8) : 'none');
await browser.close();
