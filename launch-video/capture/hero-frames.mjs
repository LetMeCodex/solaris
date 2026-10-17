// The report's scroll-scrubbed hero: one continuous pull-back from Earth's night side to the whole
// Milky Way, captured as still frames from the live site on the virtual clock.
//   node capture/hero-frames.mjs [frames=300]
import fs from 'node:fs';
import { openSite, startClock, advance, setClean } from './rig.mjs';

const N = Number(process.argv[2] || 300);
const OUT = 'out/hero-frames';
fs.mkdirSync(OUT, { recursive: true });
const S = (page, fn, arg) => page.evaluate(fn, arg);

// log10(camera distance) along the scroll, slowing where there is something to look at
const KEYS = [
  [0.0, 2.24],  // Earth's night side, close
  [0.16, 3.35], // Earth and the Moon
  [0.3, 4.75],  // through the empty part quickly
  [0.44, 5.65], // the Sun and the inner planets
  [0.58, 6.35], // the giants' orbits
  [0.7, 6.95],  // the whole system, a speck of orbits
  [0.82, 7.9],  // out through the nearby stars
  [1.0, 8.5],   // the Milky Way from outside
];
const logR = (u) => {
  for (let k = 1; k < KEYS.length; k++) {
    const [u0, a] = KEYS[k - 1];
    const [u1, b] = KEYS[k];
    if (u <= u1) {
      const t = (u - u0) / (u1 - u0);
      const e = t * t * (3 - 2 * t); // ease within each stretch
      return a + (b - a) * e;
    }
  }
  return KEYS[KEYS.length - 1][1];
};

const { browser, page } = await openSite();
await startClock(page);
await setClean(page, true);
await S(page, () => {
  const s = window.__solaris;
  s.clock.timeMultiplier = 1;
  s.selectBody('Earth', 2600);
});
await advance(page, 6);
await page.waitForTimeout(2000);
// Light Earth from the side: night lights and the terminator
await S(page, () => {
  const s = window.__solaris;
  const r = s.cameraRig;
  const V = r.camera.position.constructor;
  const a = new V(), b = new V();
  s.planetBundles.get('Sun').bodyGroup.getWorldPosition(a);
  s.planetBundles.get('Earth').bodyGroup.getWorldPosition(b);
  const d = a.sub(b).normalize();
  const k = (118 * Math.PI) / 180;
  r.targetSpherical.theta = Math.atan2(d.x * Math.cos(k) + d.z * Math.sin(k), -d.x * Math.sin(k) + d.z * Math.cos(k));
  r.targetSpherical.phi = 1.32;
  r.targetSpherical.radius = Math.pow(10, 2.24);
  r.targetNdcOffset.set(0, 0);
});
await advance(page, 3);
for (let i = 0; i < 12; i++) { await advance(page, 0.25); await page.waitForTimeout(250); }

const prep = () => S(page, () => {
  const s = window.__solaris;
  s.orbitLinesGroup.visible = true;
  s.starfield.travelParticles.mesh.visible = false;
  s.starfield.nebulae?.setUserGain?.(0.35);
  s.cameraRig.targetNdcOffset.set(0, 0);
});
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const u = i / (N - 1);
  await prep();
  await S(page, ({ lr, u }) => {
    const s = window.__solaris;
    const r = s.cameraRig;
    r.targetSpherical.radius = Math.pow(10, lr);
    const v = window.__heroV || (window.__heroV = { theta: r.targetSpherical.theta });
    v.theta += 0.0042;
    let phi = 1.32 - 0.62 * Math.min(1, Math.max(0, (u - 0.12) / 0.4)) ** 1.2;
    let theta = v.theta;
    // Last stretch: rise to the galaxy's north pole, so the spiral ends face-on
    const k = Math.min(1, Math.max(0, (u - 0.72) / 0.24));
    if (k > 0) {
      const V = r.camera.position.constructor;
      const n = new V(0, 1, 0).applyQuaternion(s.starfield.externalGalaxy.group.quaternion).normalize();
      const gp = Math.acos(Math.max(-1, Math.min(1, n.y)));
      let gt = Math.atan2(n.x, n.z);
      while (gt - theta > Math.PI) gt -= 2 * Math.PI;
      while (gt - theta < -Math.PI) gt += 2 * Math.PI;
      const e = k * k * (3 - 2 * k);
      phi = phi + (gp - phi) * e;
      theta = theta + (gt - theta) * e;
    }
    r.targetSpherical.phi = phi;
    r.targetSpherical.theta = theta;
  }, { lr: logR(u), u });
  // two steps per frame so the camera's smoothing keeps up with the path
  await S(page, (dt) => { window.__vstep(dt); window.__vstep(dt); }, 1000 / 30);
  await page.screenshot({ path: `${OUT}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
  if (i % 30 === 0) process.stdout.write(`\r  ${i}/${N} (${((Date.now() - t0) / (i + 1)).toFixed(0)} ms/frame)   `);
}
console.log(`\n  done in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
await browser.close();
