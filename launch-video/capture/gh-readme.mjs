import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, colorScheme: 'dark' });
await page.goto('https://github.com/LetMeCodex/solaris', { waitUntil: 'networkidle' });
const shots = [['article', 'top'], ['img[alt*="Inside the code"]', 'code'], ['img[alt*="Vela: Hi"]', 'vela']];
for (const [sel, name] of shots) {
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `out/readme/gh-${name}.png` });
}
const r = await page.evaluate(() => { const i = [...document.querySelectorAll('article img')]; return { n: i.length, broken: i.filter((x) => x.complete && x.naturalWidth === 0).map((x) => x.alt) }; });
console.log(JSON.stringify(r));
await browser.close();
