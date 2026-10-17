// Probe: one continuous pull-back from Earth to the galaxy. Stills at log-spaced distances.
import fs from 'node:fs';
import { openSite, startClock, advance, setClean } from './rig.mjs';

const S = (page, fn, arg) => page.evaluate(fn, arg);
fs.mkdirSync('out/hero', { recursive: true });
const { browser, page } = await openSite();
await startClock(page);
await setClean(page, true);
await S(page, () => { const s = window.__solaris; s.clock.timeMultiplier = 1; s.selectBody('Earth', 2600); });
await advance(page, 6);
await page.waitForTimeout(1500);
const r0 = await S(page, () => window.__solaris.cameraRig.spherical.radius);
console.log('start radius', r0);
// multiply the radius each frame; record where it gets to
const N = Number(process.argv[2] || 360);
const growth = Number(process.argv[3] || 1e7);
const k = Math.pow(growth, 1 / N);
let shot = 0;
for (let i = 0; i <= N; i++) {
  await S(page, ({ k, i, N }) => {
    const s = window.__solaris;
    const r = s.cameraRig;
    s.orbitLinesGroup.visible = true;
    r.targetSpherical.radius *= k;
    r.targetSpherical.theta += 0.0035;
    r.targetSpherical.phi = 1.25 - 0.5 * Math.min(1, i / (N * 0.6));
  }, { k, i, N });
  await S(page, (dt) => window.__vstep(dt), 1000 / 30);
  if (i % Math.round(N / 12) === 0) {
    const info = await S(page, () => { const r = window.__solaris.cameraRig; return { r: r.spherical.radius, focus: r.focusedObject?.name, cam: r.camera.position.length() }; });
    console.log(i, JSON.stringify(info));
    await page.screenshot({ path: `out/hero/p${String(shot++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 75 });
  }
}
await browser.close();
