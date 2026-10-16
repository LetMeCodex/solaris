// Smoke test: GPU, virtual clock, one short clip and a still
import { openSite, startClock, advance, record } from './rig.mjs';

const { browser, page } = await openSite();
const gl = await page.evaluate(() => {
  const c = document.createElement('canvas').getContext('webgl2');
  const d = c.getExtension('WEBGL_debug_renderer_info');
  return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown';
});
console.log('renderer:', gl);
await startClock(page);
await page.evaluate(() => window.__solaris.selectBody('Earth', 2500));
await advance(page, 4);
await page.screenshot({ path: 'out/probe.png' });
await record(page, 'probe', 2);
await browser.close();
