// Interaction test for Vela in the report: click, hover a term, throw her, ask a figure.
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.env.REPORT_URL || 'http://localhost:5199/solaris/report/';
fs.mkdirSync('out/report', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=d3d11', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(9000); // let her hello finish
const bubble = () => page.evaluate(() => ({ on: document.querySelector('.vm-bubble')?.classList.contains('is-on'), text: document.querySelector('.vm-bubble-text')?.textContent, at: document.querySelector('.vm-root')?.getBoundingClientRect().toJSON() }));

// 1. Click her
const vm = await page.locator('.vm-root').boundingBox();
await page.mouse.click(vm.x + vm.width / 2, vm.y + vm.height / 2);
await page.waitForTimeout(2200);
console.log('click:', JSON.stringify(await bubble()));
await page.screenshot({ path: 'out/report/v1-click.jpg', type: 'jpeg', quality: 80 });

// 2. Hover a term in chapter 1
await page.evaluate(() => { const t = document.querySelector('#orbits .term'); window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 380); });
await page.waitForTimeout(2500);
const term = page.locator('#orbits .term').first();
await term.hover();
await page.waitForTimeout(3000);
const tb = await term.boundingBox();
console.log('term:', JSON.stringify(await bubble()), 'term at', JSON.stringify(tb));
await page.screenshot({ path: 'out/report/v2-term.jpg', type: 'jpeg', quality: 80 });

// 3. Throw her
const vm2 = await page.locator('.vm-root').boundingBox();
await page.mouse.move(vm2.x + 40, vm2.y + 40);
await page.mouse.down();
for (let i = 0; i < 12; i++) { await page.mouse.move(vm2.x + 40 + (i % 2 ? 160 : -160), vm2.y + 40 - i * 12, { steps: 3 }); await page.waitForTimeout(40); }
await page.mouse.move(400, 300, { steps: 6 });
await page.mouse.up();
await page.waitForTimeout(2500);
console.log('throw:', JSON.stringify(await bubble()));
await page.screenshot({ path: 'out/report/v3-throw.jpg', type: 'jpeg', quality: 80 });

// 4. Ask Vela on figure 1
await page.locator('#orbits .fig-ask').first().click();
await page.waitForTimeout(3500);
console.log('ask:', JSON.stringify(await bubble()));
await page.screenshot({ path: 'out/report/v4-ask.jpg', type: 'jpeg', quality: 80 });
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
