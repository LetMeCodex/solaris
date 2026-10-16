// Scout round three: compositions for the Skies act.
import fs from 'node:fs';
import { openSite, startClock, advance, setClean } from './rig.mjs';
import { standOn } from './scout.mjs';

const S = (page, fn, arg) => page.evaluate(fn, arg);
fs.mkdirSync('out/scout3', { recursive: true });
const { browser, page } = await openSite();
await startClock(page);
await setClean(page, true);

async function at(name, sky, when, mag, views) {
  console.log('>', name);
  await page.keyboard.press('Escape');
  await standOn(page, sky);
  await S(page, (w) => window.__solaris.setSurfaceTimeOfDay(w), when);
  await S(page, (m) => window.__solaris.setSurfaceMagnification(m), mag);
  await advance(page, 1.5);
  await page.waitForTimeout(500);
  let k = 0;
  for (const v of views) {
    await S(page, (v) => window.__solaris.surface.setView(v[0], v[1], v[2]), v);
    await advance(page, 1.2);
    await page.screenshot({ path: `out/scout3/${name}_${k++}.jpg`, type: 'jpeg', quality: 80 });
  }
  const objs = await S(page, () => window.__solaris.surface.objects.filter((o) => o.visible && o.altDeg > -2).sort((a, b) => a.magnitude - b.magnitude).slice(0, 8).map((o) => `${o.name} alt ${o.altDeg.toFixed(0)} az ${o.azDeg?.toFixed?.(0)}`));
  console.log('  ', objs.join(' | '));
}

await at('crescent', { on: 'Phobos', facing: 'Mars' }, 'sunset', 100, [[268, 30, 80], [280, 22, 90], [275, 35, 70]]);
await at('crescent1', { on: 'Phobos', facing: 'Mars' }, 'sunset', 1, [[278, 26, 85]]);
await at('rings', { on: 'Saturn', facing: 'Mimas' }, 'sunset', 1, [[300, 18, 95], [320, 22, 95], [340, 18, 95], [20, 18, 95], [40, 22, 95], [300, 40, 100]]);
await browser.close();
