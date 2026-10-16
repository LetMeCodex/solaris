// Scout round two: night and sunset skies, and the giants' cloud tops.
import fs from 'node:fs';
import { openSite, startClock, advance, setClean } from './rig.mjs';
import { standOn } from './scout.mjs';

const S = (page, fn, arg) => page.evaluate(fn, arg);

const shotsOf = async (page, name, views) => {
  let k = 0;
  for (const v of views) {
    await S(page, (v) => window.__solaris.surface.setView(v[0], v[1], v[2]), v);
    await advance(page, 1.2);
    await page.screenshot({ path: `out/scout2/${name}_${k++}.jpg`, type: 'jpeg', quality: 80 });
  }
};

const CANDIDATES = {
  phobos_night: { on: 'Phobos', facing: 'Mars', when: 'night', look: 'Mars' },
  phobos_sunset: { on: 'Phobos', facing: 'Mars', when: 'sunset', look: 'Mars' },
  io_night: { on: 'Io', facing: 'Jupiter', when: 'night', look: 'Jupiter' },
  enceladus_night: { on: 'Enceladus', facing: 'Saturn', when: 'night', look: 'Saturn' },
  ariel_night: { on: 'Ariel', facing: 'Uranus', when: 'night', look: 'Uranus' },
  callisto_sunset: { on: 'Callisto', facing: 'Jupiter', when: 'sunset', look: 'Jupiter' },
  saturn_top: { on: 'Saturn', facing: 'Mimas', when: 'sunset', sweep: true },
  saturn_night: { on: 'Saturn', facing: 'Titan', when: 'night', sweep: true },
  jupiter_top: { on: 'Jupiter', facing: 'Io', when: 'sunset', sweep: true },
};

const names = process.argv.slice(2);
const list = names.length ? names : Object.keys(CANDIDATES);
fs.mkdirSync('out/scout2', { recursive: true });
const { browser, page } = await openSite();
await startClock(page);
await setClean(page, true);
for (const n of list) {
  const c = CANDIDATES[n];
  console.log('>', n);
  try {
    await page.keyboard.press('Escape');
    await standOn(page, { on: c.on, facing: c.facing });
    const ok = await S(page, (w) => window.__solaris.setSurfaceTimeOfDay(w), c.when);
    await advance(page, 1.5);
    await page.waitForTimeout(600);
    if (c.look) {
      await S(page, (l) => window.__solaris.surfaceLookAt(l), c.look);
      await advance(page, 2);
      const v = await S(page, () => { const s = window.__solaris.surface; const D = 180 / Math.PI; return [s.heading * D, s.pitch * D, s.fov * D]; });
      await shotsOf(page, n, [[v[0], v[1], v[2]], [v[0] + 10, Math.max(8, v[1] - 22), 95]]);
    } else {
      await shotsOf(page, n, [[0, 25, 95], [90, 25, 95], [180, 25, 95], [270, 25, 95]]);
    }
    const st = await S(page, () => {
      const s = window.__solaris;
      const o = s.surface.objects.filter((o) => o.visible && o.altDeg > -1).sort((a, b) => a.magnitude - b.magnitude).slice(0, 7);
      return { utc: new Date(s.clock.getUtcMs()).toISOString(), loc: s.surface.getLocation(), objs: o.map((x) => `${x.name} alt ${x.altDeg.toFixed(0)} az ${(x.azDeg ?? 0).toFixed(0)}`) };
    });
    console.log('  ', ok, JSON.stringify(st));
  } catch (e) {
    console.log('  failed', e.message);
  }
}
await browser.close();
