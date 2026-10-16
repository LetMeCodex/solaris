// The shots of the launch film, each scripted against the live Solaris site.
//
//   node capture/shots.mjs still <shot...>    one frame from the middle of each shot (out/stills)
//   node capture/shots.mjs record <shot...>   the footage (out/shots/<shot>.mp4); "all" for every shot
import fs from 'node:fs';
import { openSite, startClock, advance, record, setClean, FPS } from './rig.mjs';

// ---- helpers run in the page ---------------------------------------------------------------
const S = (page, fn, arg) => page.evaluate(fn, arg);

/** Step the virtual clock until no flight is in progress (and let textures arrive in real time). */
async function settle(page, extra = 1.5, maxS = 25) {
  for (let i = 0; i < maxS * FPS; i++) {
    const busy = await S(page, () => !!window.__solaris.cameraRig.getTransit());
    if (!busy) break;
    await S(page, (dt) => window.__vstep(dt), 1000 / FPS);
  }
  await page.waitForTimeout(800);
  await advance(page, extra);
  await page.waitForTimeout(400);
}

async function reset(page) {
  // Close anything left open (the Atlas, the album)
  for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(250); }
  await S(page, () => {
    const s = window.__solaris;
    try { s.stopShowcase(); } catch (e) {}
    try { if (s.surface.isActive()) s.exitSurface(false); } catch (e) {}
    try { s.exitHorizonView(false); } catch (e) {}
    s.clock.timeMultiplier = 1;
    s.clock.isPaused = false;
    s.clock.setUtcMs(Date.parse('2026-10-17T12:00:00Z'));
  });
}

async function postcard(page, id) {
  await S(page, async (id) => {
    const { POSTCARDS } = await import('/solaris/src/data/Postcards.ts');
    const p = typeof id === 'string' ? POSTCARDS.find((c) => c.id === id) : id;
    window.__solaris.openPostcard(p);
    window.__shotPostcard = p;
  }, id);
  await settle(page, 1);
  // Surface imagery streams in real time
  for (let i = 0; i < 12; i++) { await advance(page, 0.25); await page.waitForTimeout(350); }
  await S(page, () => { window.__solaris.surface.idleEnabled = false; window.__solaris.clock.isPaused = true; });
}

/** A slow push-in across a postcard view: drift the heading, rise a little, tighten the lens. */
const drift = (dh, dp, zoom) => (page, i, t) =>
  S(page, ({ t, dh, dp, zoom }) => {
    const p = window.__shotPostcard;
    const e = t; // linear, the edit eases
    window.__solaris.surface.setView(p.heading + dh * e, p.pitch + dp * e, p.fov * (1 - zoom * e));
  }, { t, dh, dp, zoom });

/**
 * Fly to a world and frame it. `sun` sets the lighting from the camera's side, in degrees: 0 full
 * face, 90 half-lit with the terminator down the middle, 150 a backlit crescent.
 */
async function world(page, name, { radius = null, theta = null, phi = null, sun = null } = {}) {
  await S(page, (name) => window.__solaris.selectBody(name, 2600), name);
  await settle(page, 2);
  await S(page, ({ name, radius, theta, phi, sun }) => {
    const s = window.__solaris;
    const r = s.cameraRig;
    if (radius) r.targetSpherical.radius = r.spherical.radius * radius;
    if (theta !== null) r.targetSpherical.theta = theta;
    if (phi !== null) r.targetSpherical.phi = phi;
    if (sun !== null && name !== 'Sun') {
      const V = r.camera.position.constructor;
      const a = new V(), b = new V();
      s.planetBundles.get('Sun').bodyGroup.getWorldPosition(a);
      s.planetBundles.get(name).bodyGroup.getWorldPosition(b);
      const d = a.sub(b).normalize();
      const k = (sun * Math.PI) / 180;
      const x = d.x * Math.cos(k) + d.z * Math.sin(k);
      const z = -d.x * Math.sin(k) + d.z * Math.cos(k);
      r.targetSpherical.theta = Math.atan2(x, z);
    }
  }, { name, radius, theta, phi, sun });
  await advance(page, 3);
}

/** Orbit the focused body: `spin` radians per second round, `dolly` fraction of distance per second. */
const orbit = (spin, dolly = 0, tilt = 0) => (page, i) =>
  S(page, ({ spin, dolly, tilt, dt }) => {
    const r = window.__solaris.cameraRig;
    r.targetSpherical.theta += spin * dt;
    r.targetSpherical.phi = Math.min(Math.PI - 0.05, Math.max(0.05, r.targetSpherical.phi + tilt * dt));
    r.targetSpherical.radius *= 1 + dolly * dt;
  }, { spin, dolly, tilt, dt: 1 / FPS });

// ---- the shots -------------------------------------------------------------------------------
export const SHOTS = {
  // Cold open: across the face of the Sun
  // From inside the granulation out to the limb and its prominences
  sun: { seconds: 12, async setup(p) { await world(p, 'Sun', { radius: 0.8, phi: 1.5 }); }, each: orbit(0.04, 0.022) },
  sun_a: { seconds: 6, async setup(p) { await world(p, 'Sun', { radius: 0.8, phi: 1.5 }); }, each: orbit(0.05, -0.012) },
  sun_b: { seconds: 6, async setup(p) { await world(p, 'Sun', { radius: 0.95, phi: 1.5 }); }, each: orbit(0.05, -0.02) },
  orbits_outer: {
    seconds: 6,
    async setup(p) {
      await S(p, () => { window.__solaris.jumpToScale('outer_system'); });
      await settle(p, 2);
      await S(p, () => { const s = window.__solaris; s.orbitLinesGroup.visible = true; s.clock.timeMultiplier = 86400 * 60; s.cameraRig.targetSpherical.phi = 0.9; });
      await advance(p, 2);
    },
    each: orbit(0.04, -0.01),
  },
  sun_wide: { seconds: 5, async setup(p) { await world(p, 'Sun', { radius: 1.6, phi: 1.2 }); }, each: orbit(-0.06, 0.03) },

  // The journey outward
  mercury: { seconds: 3.5, async setup(p) { await world(p, 'Mercury', { radius: 1.1, phi: 1.3, sun: 80 }); }, each: orbit(0.12, -0.02) },
  venus: { seconds: 3.5, async setup(p) { await world(p, 'Venus', { radius: 1.1, phi: 1.25, sun: 120 }); }, each: orbit(-0.1, -0.02) },
  earth: { seconds: 5, async setup(p) { await world(p, 'Earth', { radius: 1.25, phi: 1.25, sun: 105 }); }, each: orbit(0.08, -0.025) },
  moon_earth: { seconds: 4, async setup(p) { await postcard(p, 'earth-sliver'); }, each: drift(-3, 0.3, 0.1) },
  mars_dusk: { seconds: 4, async setup(p) { await postcard(p, 'martian-dusk'); }, each: drift(3, 2, 0.15) },
  jupiter: { seconds: 3.5, async setup(p) { await world(p, 'Jupiter', { radius: 1.0, phi: 1.35, sun: 70 }); }, each: orbit(0.1, -0.02) },
  europa_night: { seconds: 4, async setup(p) { await postcard(p, 'jupiter-night'); }, each: drift(0.5, -0.15, 0.1) },
  saturn: { seconds: 4, async setup(p) { await world(p, 'Saturn', { radius: 0.9, phi: 1.2, sun: 60 }); }, each: orbit(-0.09, -0.02) },
  mimas_saturn: { seconds: 4, async setup(p) { await postcard(p, 'crescent-saturn'); }, each: drift(2, 1.5, 0.12) },
  miranda_uranus: { seconds: 4, async setup(p) { await postcard(p, 'uranus-galaxy'); }, each: drift(-3, 1, 0.1) },
  triton_neptune: { seconds: 4, async setup(p) { await postcard(p, 'neptune-crescent'); }, each: drift(1.5, 0.5, 0.15) },
  pluto_charon: { seconds: 4, async setup(p) { await postcard(p, 'charon-core'); }, each: drift(-2, 1, 0.12) },

  // A flight in progress: the warp streaks
  warp: {
    seconds: 3,
    async setup(p) {
      await world(p, 'Earth');
      await S(p, () => window.__solaris.selectBody('Saturn', 9000));
      await advance(p, 2.6);
    },
  },

  // What it is
  orbits: {
    seconds: 6,
    async setup(p) {
      await S(p, () => { window.__solaris.jumpToScale('inner_system'); });
      await settle(p, 2);
      await S(p, () => { const s = window.__solaris; s.orbitLinesGroup.visible = true; s.clock.timeMultiplier = 86400 * 4; const r = s.cameraRig; r.targetSpherical.phi = 1.0; });
      await advance(p, 2);
    },
    each: orbit(0.04, -0.01),
  },
  lookup: {
    seconds: 6,
    async setup(p) {
      await postcard(p, 'charon-core');
      await S(p, () => { const s = window.__solaris; s.clock.isPaused = false; s.clock.timeMultiplier = 3600 * 2; s.surface.setView(150, 55, 90); });
      await advance(p, 1);
    },
    each: (p, i, t) => S(p, (t) => window.__solaris.surface.setView(150 + t * 4, 55 - t * 2, 90 - t * 2), t),
  },
  nebula: {
    seconds: 7,
    async setup(p) {
      await S(p, () => window.__solaris.visitNebula('cosmic-cliffs'));
      await settle(p, 3, 40);
    },
    each: orbit(0.035, -0.012, -0.004),
  },
  nebula2: {
    seconds: 5,
    async setup(p) {
      await S(p, () => window.__solaris.visitNebula('helix'));
      await settle(p, 3, 40);
    },
    each: orbit(-0.05, -0.015),
  },

  showcase: {
    seconds: 6,
    async setup(p) { await S(p, () => window.__solaris.startShowcase('Saturn')); await advance(p, 3); await p.waitForTimeout(1500); await advance(p, 1); },
  },
  showcase_jupiter: {
    seconds: 6,
    async setup(p) { await S(p, () => window.__solaris.startShowcase('Jupiter')); await advance(p, 3); await p.waitForTimeout(1500); await advance(p, 1); },
  },

  // The interface itself
  ui_overview: {
    ui: true, seconds: 5,
    async setup(p) { await S(p, () => window.__solaris.resetView()); await settle(p, 2); await p.waitForTimeout(1500); await advance(p, 1); },
    each: orbit(0.02, -0.006),
  },
  ui_explorer: {
    ui: true, seconds: 5,
    async setup(p) {
      await world(p, 'Earth', { radius: 0.9, sun: 95 });
      await p.locator('[data-tour="explorer"] button[aria-label="Expand explorer panel"]').click().catch(() => {});
      await p.waitForTimeout(1200); await advance(p, 1);
    },
    each: orbit(0.05, -0.01),
  },
  ui_atlas: {
    ui: true, seconds: 5,
    async setup(p) {
      await world(p, 'Saturn');
      await p.keyboard.press('/');
      await p.waitForTimeout(2500); await advance(p, 2); await p.waitForTimeout(1500); await advance(p, 1);
    },
  },
  ui_vinyl: {
    ui: true, seconds: 4,
    async setup(p) {
      await world(p, 'Neptune', { sun: 100 });
      await p.locator('.vd-launch').click();
      await p.waitForTimeout(1500); await advance(p, 1.2);
    },
    each: orbit(0.04),
  },
  ui_vela: {
    ui: true, seconds: 5,
    async setup(p) {
      await S(p, async () => { const { settings } = await import('/solaris/src/ui/settings.ts'); settings.set('showVela', true); });
      await world(p, 'Mars', { sun: 90 });
      // Let anything she was already saying finish, then her line runs on the film's clock
      await p.waitForTimeout(9000);
      await advance(p, 0.5);
      await S(p, () => { window.__vtimers(true); window.__vela?.say?.('giggle.6'); });
      await advance(p, 0.2);
    },
    each: orbit(0.04),
  },

  // Skies of other worlds (custom postcards from the scouting)
  sky_saturn: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Saturn', lat: -28.6776, lon: -164.0119, utc: '2026-10-20T11:22:49Z', heading: 8, pitch: 22, fov: 95, magnification: 1 }); },
    each: drift(5, 1.2, 0.04),
  },
  sky_phobos_rise: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Phobos', lat: 2.7246, lon: -49.9456, utc: '2026-10-16T23:52:58Z', heading: 96, pitch: 30, fov: 62, magnification: 1 }); },
    each: drift(-1.5, 3, 0.05),
  },
  sky_phobos_dusk: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Phobos', lat: 3.3959, lon: 49.9154, utc: '2026-10-17T03:28:18Z', heading: 276, pitch: 30, fov: 84, magnification: 1 }); },
    each: drift(2, 0.8, 0.05),
  },
  sky_phobos_dusk30: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Phobos', lat: 3.3959, lon: 49.9154, utc: '2026-10-17T03:28:18Z', heading: 276, pitch: 30, fov: 84, magnification: 30 }); },
    each: drift(2, 0.8, 0.05),
  },
  sky_io: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Io', lat: 4.0501, lon: 49.8795, utc: '2026-10-17T19:16:58Z', heading: 267, pitch: 36, fov: 46, magnification: 1 }); },
    each: drift(-2, 1, 0.05),
  },
  sky_enceladus: {
    seconds: 3.5, track: true,
    async setup(p) { await postcard(p, { id: 'x', body: 'Enceladus', lat: -41.5546, lon: 30.7989, utc: '2026-10-18T09:16:55Z', heading: 322, pitch: 32, fov: 80, magnification: 1 }); },
    each: drift(2, 1, 0.05),
  },

  // Beyond
  galaxy: {
    seconds: 6,
    async setup(p) {
      await world(p, 'Earth');
      await S(p, () => window.__solaris.jumpToScale('galactic'));
      await advance(p, 0.2);
    },
    // Centre the galaxy as it arrives and keep drifting in
    each: (p, i) => S(p, (i) => { const r = window.__solaris.cameraRig; r.targetNdcOffset.set(0, 0); if (i > 100) r.targetSpherical.radius *= 0.996; }, i),
  },
  sgra: {
    seconds: 6,
    async setup(p) {
      await S(p, () => window.__solaris.selectBody('Sagittarius A*', 2600));
      await settle(p, 2, 40);
    },
    each: orbit(0.06, -0.03, -0.01),
  },
  horizon: {
    seconds: 5,
    async setup(p) {
      await S(p, () => window.__solaris.selectBody('Sagittarius A*', 2600));
      await settle(p, 1, 40);
      await S(p, () => window.__solaris.enterHorizonView());
      await settle(p, 2, 20);
    },
    each: orbit(0.03, -0.01),
  },
  bh_sea: { seconds: 5, async setup(p) { await postcard(p, 'event-horizon-sea'); }, each: drift(0, 1, 0.1) },
};

// ---- CLI ---------------------------------------------------------------------------------------
const [mode = 'still', ...names] = process.argv.slice(2);
const list = names.length === 0 || names[0] === 'all' ? Object.keys(SHOTS) : names;
fs.mkdirSync('out/stills', { recursive: true });

const { browser, page } = await openSite();
await startClock(page);
for (const name of list) {
  const shot = SHOTS[name];
  if (!shot) { console.log('no shot', name); continue; }
  console.log(`> ${name}`);
  try {
    await reset(page);
    await setClean(page, !shot.ui);
    await shot.setup(page);
    if (mode === 'still') {
      // STILL_AT=0.1,0.5,0.9 takes several frames through the shot
      const at = (process.env.STILL_AT || '0.5').split(',').map(Number);
      let i = 0;
      for (const f of at) {
        const n = Math.round(shot.seconds * FPS * f);
        for (; i < n; i++) { if (shot.each) await shot.each(page, i, i / FPS); await S(page, (dt) => window.__vstep(dt), 1000 / FPS); }
        const tag = at.length > 1 ? `@${f}` : '';
        await page.screenshot({ path: `out/stills/${name}${tag}.jpg`, type: 'jpeg', quality: 85 });
      }
    } else {
      await record(page, name, shot.seconds, shot.each, { track: !!shot.track });
    }
  } catch (e) {
    console.log(`  ${name} failed:`, e.message);
  }
}
await browser.close();
