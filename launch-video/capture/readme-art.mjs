// Renders docs/readme/*.svg as <img>, the way GitHub shows them: node capture/readme-art.mjs [delayMs] [file...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('../docs/readme');
const delay = Number(process.argv[2] || 3500);
const files = process.argv.slice(3).length ? process.argv.slice(3) : fs.readdirSync(dir).filter((f) => f.endsWith('.svg'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1320, height: 800 } });
fs.mkdirSync('out/readme', { recursive: true });
for (const f of files) {
  const src = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
  await page.setContent(`<body style="margin:0;padding:20px;background:#0d1117"><img id="i" src="${src}" style="width:1280px;display:block"></body>`);
  await page.waitForTimeout(delay);
  await page.locator('#i').screenshot({ path: `out/readme/${f.replace('.svg', '')}-${delay}.png` });
}
await browser.close();
console.log('done', files.length);
