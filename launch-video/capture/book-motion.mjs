// The book in motion and on a phone: a mid-flip frame, a chapter jump, and the phone strip.
import { chromium } from 'playwright';
const URL = process.env.BOOK_URL || 'http://localhost:5199/solaris/book/';
const args = ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];
const browser = await chromium.launch({ channel: 'chrome', headless: true, args });
const errors = [];

const desk = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
desk.on('pageerror', (e) => errors.push(e.message));
await desk.goto(`${URL}#p8`, { waitUntil: 'load' });
await desk.waitForTimeout(3500);
await desk.keyboard.press('ArrowRight');
await desk.waitForTimeout(420);
await desk.screenshot({ path: 'out/book/m-flip.jpg', type: 'jpeg', quality: 86 });
await desk.waitForTimeout(2600);
// a click on the contents jumps across the book
await desk.keyboard.press('Home');
await desk.waitForTimeout(1600);
await desk.keyboard.press('ArrowRight');
await desk.waitForTimeout(1400);
await desk.keyboard.press('ArrowRight');
await desk.waitForTimeout(1600);
await desk.locator('.ct-row', { hasText: 'Nebulae' }).click();
await desk.waitForTimeout(350);
await desk.screenshot({ path: 'out/book/m-riffle.jpg', type: 'jpeg', quality: 86 });
await desk.waitForTimeout(2600);
console.log('after jump:', await desk.evaluate(() => location.hash));
await desk.close();

const W = 390;
const phone = await browser.newPage({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
phone.on('pageerror', (e) => errors.push(e.message));
await phone.goto(URL, { waitUntil: 'load' });
await phone.waitForTimeout(3000);
const over = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log('horizontal overflow on phone:', over, 'pages:', await phone.evaluate(() => document.querySelectorAll('.pg').length));
const ids = ['cover', 'pro-1', 'pro-2', 'c1', 'c1-kepler', 'c1-time', 'c2-scale', 'c8', 'c9', 'c9-voice', 'c10', 'c11', 'c13', 'c5-tiles'];
for (const id of ids) {
  await phone.evaluate((i) => document.querySelector(`[data-page="${i}"]`).scrollIntoView(), id);
  await phone.waitForTimeout(1600);
  await phone.screenshot({ path: `out/book/ph-${id}.jpg`, type: 'jpeg', quality: 80 });
}
console.log('errors:', errors.length ? [...new Set(errors)].slice(0, 5) : 'none');
await browser.close();
