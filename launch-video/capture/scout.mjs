// Scout sky views: stand on a world, look at another, take a few frames.
//   node capture/scout.mjs            (all candidates)
//   node capture/scout.mjs phobos io  (some)
import fs from 'node:fs';
import { openSite, startClock, advance, setClean } from './rig.mjs';

const S = (page, fn, arg) => page.evaluate(fn, arg);

export const SKIES = {
  phobos: { on: 'Phobos', facing: 'Mars' },
  deimos: { on: 'Deimos', facing: 'Mars' },
  enceladus: { on: 'Enceladus', facing: 'Saturn' },
  pan: { on: 'Pan', facing: 'Saturn' },
  titan: { on: 'Titan', facing: 'Saturn' },
  io: { on: 'Io', facing: 'Jupiter' },
  ganymede: { on: 'Ganymede', facing: 'Jupiter' },
  callisto: { on: 'Callisto', facing: 'Jupiter' },
  ariel: { on: 'Ariel', facing: 'Uranus' },
  charon: { on: 'Charon', facing: 'Pluto' },
  moon: { on: 'Moon', facing: 'Earth' },
  iapetus: { on: 'Iapetus', facing: 'Saturn' },
};

export async function standOn(page, sky) {
  await S(page, ({ on, facing }) => window.__solaris.enterSkyView(on, facing), sky);
  for (let i = 0; i < 20; i++) {
    await advance(page, 0.5);
    await page.waitForTimeout(250);
    if (await S(page, () => window.__solaris.surface.isActive())) break;
  }
  for (let i = 0; i < 8; i++) { await advance(page, 0.25); await page.waitForTimeout(300); }
  await S(page, (facing) => { const s = window.__solaris; s.surface.idleEnabled = false; s.surfaceLookAt(facing); }, sky.facing);
  await advance(page, 2);
}

if (process.argv[1].endsWith('scout.mjs')) {
  const names = process.argv.slice(2);
  const list = names.length ? names : Object.keys(SKIES);
  fs.mkdirSync('out/scout', { recursive: true });
  const { browser, page } = await openSite();
  await startClock(page);
  await setClean(page, true);
  for (const n of list) {
    console.log('>', n);
    try {
      await page.keyboard.press('Escape');
      await standOn(page, SKIES[n]);
      const st = await S(page, () => {
        const s = window.__solaris;
        const o = s.surface.objects.filter((o) => o.visible && o.altDeg > -1).sort((a, b) => a.magnitude - b.magnitude).slice(0, 6);
        return { utc: new Date(s.clock.getUtcMs()).toISOString(), loc: s.surface.getLocation(), objs: o.map((x) => `${x.name} alt ${x.altDeg.toFixed(0)} mag ${x.magnitude.toFixed(1)}`) };
      });
      console.log('  ', JSON.stringify(st));
      await page.screenshot({ path: `out/scout/${n}_a.jpg`, type: 'jpeg', quality: 80 });
      // Wider, a little lower: horizon and sky together
      await S(page, () => { const v = window.__solaris.surface; const D = 180 / Math.PI; v.setView(v.heading * D + 12, v.pitch * D - 14, Math.min(100, v.fov * D + 25)); });
      await advance(page, 1.5);
      await page.screenshot({ path: `out/scout/${n}_b.jpg`, type: 'jpeg', quality: 80 });
    } catch (e) {
      console.log('  failed', e.message);
    }
  }
  await browser.close();
}
