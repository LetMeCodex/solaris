// The back cover's scanner: it sweeps by itself, and reads the real lines under the pointer.
import { chromium } from 'playwright';
const URL = process.env.BOOK_URL || 'http://localhost:5199/solaris/book/';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`${URL}#p60`, { waitUntil: 'load' });
await page.waitForTimeout(3000);
const read = () => page.evaluate(() => ({ text: document.querySelector('.bc-beam span')?.textContent, left: document.querySelector('.bc-beam')?.style.left, on: [...document.querySelectorAll('.bc-tag.on')].map((t) => t.textContent) }));
const a = await read();
await page.waitForTimeout(1500);
console.log('sweep', a.left, (await read()).left);
const box = await page.locator('.bc-field').boundingBox();
for (const nm of [759.37, 686.719, 656.281, 589.3, 486.134, 395.1]) {
  await page.mouse.move(box.x + box.width * ((780 - nm) / 400), box.y + box.height * 0.5);
  await page.waitForTimeout(160);
  console.log(nm, JSON.stringify(await read()));
}
await page.screenshot({ path: 'out/book/scan.jpg', type: 'jpeg', quality: 86 });
console.log('errors:', errors.length ? errors.slice(0, 4) : 'none');
await browser.close();
