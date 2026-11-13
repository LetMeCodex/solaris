// The shots of the third launch film, "Now you can fly it": the jet over the whole Earth in 3D,
// its four cameras and tactical HUD, NASA's spacecraft, and the planets from the cockpit.
// Same frame-perfect rig as shots.mjs.
//
//   node capture/flight-shots.mjs still <shot...>    frames from each shot (out/flight-stills)
//   node capture/flight-shots.mjs record <shot...>   footage (out/shots/<shot>.mp4); "all" for every shot
import fs from 'node:fs';
import { openSite, startClock, advance, record, setClean, FPS } from './rig.mjs';

const S = (page, fn, arg) => page.evaluate(fn, arg);
const step = (page) => S(page, (dt) => window.__vstep(dt), 1000 / FPS);

async function reset(page) {
  for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(250); }
  await S(page, () => {
    const s = window.__solaris;
    window.__pin = null;
    window.__fair = null;
    try { if (s.isJetActive()) s.exitJet(false); } catch (e) {}
    try { s.stopShowcase(); } catch (e) {}
    try { if (s.surface.isActive()) s.exitSurface(false); } catch (e) {}
    try { s.exitHorizonView(false); } catch (e) {}
    s.clock.timeMultiplier = 1;
    s.clock.isPaused = false;
  });
}

async function settle(page, extra = 1.5, maxS = 25) {
  for (let i = 0; i < maxS * FPS; i++) {
    const busy = await S(page, () => !!window.__solaris.cameraRig.getTransit());
    if (!busy) break;
    await step(page);
  }
  await page.waitForTimeout(800);
  await advance(page, extra);
  await page.waitForTimeout(400);
}

/**
 * The jet over Earth, placed exactly: `dist` km short of the landmark (or lat/lon) along the
 * heading `hdg` it flies, `alt` km above sea level, nose `pitch` degrees, `speed` km/s; the Sun at
 * `hour` local solar time. The tiles stream in real time while the jet is held on the spot.
 */
async function fly(page, { id, lat, lon, hdg = 0, dist = 3, alt = 1, pitch = -6, speed = 0.2, view = 'chase', hour = 17.2, look = null, side = 0, throttle = 0.55, hold = 14, cover = 0.3 }) {
  await S(page, async ({ id, lat, lon, hdg, dist, alt, pitch, speed, view, hour, look, side, throttle, cover }) => {
    const { getLandmark } = await import('/solaris/src/explorer/Landmarks.ts');
    const h = await import('/solaris/src/dev/flightHarness.ts');
    const s = window.__solaris;
    const lm = id ? getLandmark(id) : null;
    const la = lm ? lm.lat : lat;
    const lo = lm ? lm.lon : lon;
    const ms = Date.parse('2026-06-21T00:00:00Z') + ((((hour - lo / 15) % 24) + 24) % 24) * 3600e3;
    s.clock.setUtcMs(ms);
    s.selectBody('Earth', 1);
    if (!s.isJetActive()) s.enterJet(lm ?? undefined);
    const j = s.jet;
    j.view = view;
    j.helpOpen = false;
    j.weather.mode = 'auto';
    j.throttle = throttle;
    try { j.audio.muted = true; } catch (e) {}
    // A film day everywhere: fair-weather cumulus and clear air, whatever today's real weather is
    window.__fair = () => {
      const ec = s.earthClouds;
      if (!ec) return;
      ec.weather.update = () => {};
      ec.weather.current = { cover, coverLow: cover, kind: 'clear', strength: 0, windMps: 4, windDirDeg: 200, visibilityKm: 80, label: 'Clear' };
      if (ec.eased) { if (cover < 0.05) ec.eased.cover = 0; else if (!window.__fairSnapped) { ec.eased.cover = Math.max(0.3, cover); ec.eased.stratus = 0; window.__fairSnapped = true; } }
    };
    window.__fairSnapped = false;
    // Back off along the heading, and to the side (km to the right of track)
    const r = Math.PI / 180;
    const dN = -Math.cos(hdg * r) * dist + -Math.sin(hdg * r) * side * -1;
    const dE = -Math.sin(hdg * r) * dist + Math.cos(hdg * r) * side;
    const pLat = la + dN / 111.2;
    const pLon = lo + dE / (111.2 * Math.cos(la * r));
    window.__pin = () => { window.__fair(); h.goto(pLat, pLon, alt, hdg, pitch, speed); j.throttle = throttle; j.helpOpen = false; if (look) { j.mouseHead = false; j.look.set(look[0], look[1]); } };
    window.__pin();
    window.__tiles = () => { try { const st = s.photoreal.tiles.stats; return (st.visible < 40 ? 100 : 0) + st.queued + st.downloading + st.parsing; } catch (e) { return 100; } };
  }, { id, lat, lon, hdg, dist, alt, pitch, speed, view, hour, look, side, throttle, cover });
  // Hold on the spot while the 3D tiles arrive (real time), stepping the world a little
  const t0 = Date.now();
  let calm = 0;
  while (Date.now() - t0 < hold * 4000) {
    await S(page, () => window.__pin && window.__pin());
    await step(page);
    await page.waitForTimeout(350);
    const waiting = await S(page, () => window.__tiles());
    calm = waiting < 4 ? calm + 1 : 0;
    if (Date.now() - t0 > hold * 1000 && calm > 8) break;
  }
  await S(page, () => { window.__pin && window.__pin(); });
}

/** While recording: keep the help closed and the look direction (the jet flies itself). */
const flyEach = (look) => (page) => S(page, (look) => { const j = window.__solaris.jet; j.helpOpen = false; if (window.__fair && j.telemetry.nearest === 'Earth') window.__fair(); if (look) { j.mouseHead = false; j.look.set(look[0], look[1]); } }, look);

/** In the jet, in open space, heading for a world. */
async function cruise(page, from, to, view = 'chase', { throttle = 1, pre = 2 } = {}) {
  await S(page, ({ from, to, view, throttle }) => {
    const s = window.__solaris;
    s.selectBody(from, 1);
    s.enterJet();
    s.jet.view = view;
    s.jet.helpOpen = false;
    s.jet.setTarget(to);
    s.jet.pointAtTarget();
    s.jet.throttle = throttle;
    try { s.jet.audio.muted = true; } catch (e) {}
  }, { from, to, view, throttle });
  await page.waitForTimeout(1500);
  for (let i = 0; i < 6; i++) { await advance(page, 0.25); await page.waitForTimeout(350); }
  await advance(page, pre);
}

/** Take off from a landmark on another world. */
async function takeoff(page, id, view = 'chase', { throttle = 0.3, utc = null } = {}) {
  await S(page, async ({ id, view, throttle, utc }) => {
    const { getLandmark } = await import('/solaris/src/explorer/Landmarks.ts');
    const s = window.__solaris;
    const lm = getLandmark(id);
    if (utc) s.clock.setUtcMs(Date.parse(utc));
    s.selectBody(lm.body, 1);
    s.enterJet(lm);
    s.jet.view = view;
    s.jet.helpOpen = false;
    s.jet.throttle = throttle;
    try { s.jet.audio.muted = true; } catch (e) {}
  }, { id, view, throttle, utc });
  await page.waitForTimeout(6000);
  for (let i = 0; i < 10; i++) { await step(page); await page.waitForTimeout(400); }
  await advance(page, 0.5);
  await page.waitForTimeout(2000);
}

/** A NASA spacecraft, close, from the explorer: the model streams in, then a slow orbit. */
async function craft(page, name, { radius = 0, theta = null, phi = null, utc = '2026-11-12T12:00:00Z' } = {}) {
  await S(page, ({ name, utc }) => { const s = window.__solaris; s.clock.setUtcMs(Date.parse(utc)); s.selectBody(name, 1800); }, { name, utc });
  await settle(page, 1.5, 30);
  for (let i = 0; i < 24; i++) { await advance(page, 0.2); await page.waitForTimeout(450); }
  await S(page, ({ radius, theta, phi }) => {
    const r = window.__solaris.cameraRig;
    if (radius) r.targetSpherical.radius *= radius;
    if (theta !== null) r.targetSpherical.theta = theta;
    if (phi !== null) r.targetSpherical.phi = phi;
  }, { radius, theta, phi });
  await advance(page, 2);
  await page.waitForTimeout(600);
}

const orbit = (spin, dolly = 0, tilt = 0) => (page) =>
  S(page, ({ spin, dolly, tilt, dt }) => {
    const r = window.__solaris.cameraRig;
    r.targetSpherical.theta += spin * dt;
    r.targetSpherical.phi = Math.min(Math.PI - 0.05, Math.max(0.05, r.targetSpherical.phi + tilt * dt));
    r.targetSpherical.radius *= 1 + dolly * dt;
  }, { spin, dolly, tilt, dt: 1 / FPS });

const F = (o) => ({ seconds: o.seconds ?? 4.5, ui: o.ui, async setup(p) { await fly(p, o); }, each: flyEach(o.look ?? null) });

// ---- the shots -------------------------------------------------------------------------------
export const SHOTS = {
  // The whole Earth in 3D, golden hour
  e_manhattan: F({ id: 'earth-manhattan', hdg: 25, dist: 4.5, alt: 0.55, pitch: -4, speed: 0.16, view: 'chase', hour: 18.3 }),
  e_manhattan_cockpit: F({ id: 'earth-manhattan', hdg: 25, dist: 5, alt: 0.6, pitch: -5, speed: 0.16, view: 'cockpit', hour: 18.3 }),
  e_everest: F({ cover: 0, id: 'earth-everest', hdg: 20, dist: 9, alt: 7.6, pitch: 5, speed: 0.14, view: 'chase', hour: 16.6, hold: 20 }),
  e_paris: F({ id: 'earth-eiffel-tower', hdg: 120, dist: 2.6, alt: 0.42, pitch: -5, speed: 0.12, view: 'chase', hour: 19.6 }),
  e_giza: F({ id: 'earth-giza-pyramids', hdg: 200, dist: 2.4, alt: 0.45, pitch: -8, speed: 0.12, view: 'chase', hour: 17.3 }),
  e_tokyo: F({ id: 'earth-tokyo-tower', hdg: 60, dist: 3, alt: 0.5, pitch: -6, speed: 0.14, view: 'gopro', hour: 16.6 }),
  e_canyon: F({ cover: 0, id: 'earth-grand-canyon', hdg: 80, dist: 9, alt: 2.5, pitch: -6, speed: 0.2, view: 'chase', hour: 18.2 }),
  e_goldengate: F({ id: 'earth-golden-gate', hdg: 150, dist: 3.2, alt: 0.35, pitch: -3, speed: 0.13, view: 'chase', hour: 18.6 }),
  e_sydney: F({ id: 'earth-sydney-opera', hdg: 250, dist: 2.4, alt: 0.35, pitch: -6, speed: 0.12, view: 'chase', hour: 17.0 }),
  e_rio: F({ id: 'earth-christ-redeemer', hdg: 100, dist: 3, alt: 1.0, pitch: -7, speed: 0.12, view: 'chase', hour: 17.0 }),
  e_matterhorn: F({ cover: 0, id: 'earth-matterhorn', hdg: 200, dist: 9, alt: 4.6, pitch: -2, speed: 0.2, view: 'flyby', hour: 17.6 }),
  e_london: F({ id: 'earth-london-tower-bridge', hdg: 270, dist: 2.2, alt: 0.35, pitch: -6, speed: 0.11, view: 'chase', hour: 19.8 }),
  e_hongkong: F({ id: 'earth-hong-kong', hdg: 330, dist: 3, alt: 0.5, pitch: -6, speed: 0.13, view: 'chase', hour: 17.6 }),
  e_fuji: F({ cover: 0, id: 'earth-fuji', hdg: 240, dist: 16, alt: 4.2, pitch: -1, speed: 0.22, view: 'cockpit', hour: 17.2 }),
  // Four cameras on one pass (Chamonix under Mont Blanc)
  cam_chase: F({ cover: 0, id: 'earth-chamonix-mont-blanc', hdg: 200, dist: 8, alt: 3.4, pitch: -2, speed: 0.18, view: 'chase', hour: 17.8, seconds: 4 }),
  cam_cockpit: F({ cover: 0, id: 'earth-chamonix-mont-blanc', hdg: 200, dist: 8, alt: 3.4, pitch: -2, speed: 0.18, view: 'cockpit', hour: 17.8, seconds: 4 }),
  cam_gopro: F({ cover: 0, id: 'earth-chamonix-mont-blanc', hdg: 200, dist: 8, alt: 3.4, pitch: -2, speed: 0.18, view: 'gopro', hour: 17.8, seconds: 4 }),
  cam_flyby: F({ cover: 0, id: 'earth-chamonix-mont-blanc', hdg: 200, dist: 8, alt: 3.4, pitch: -2, speed: 0.18, view: 'flyby', hour: 17.8, seconds: 4 }),
  // The HUD, live (interface on)
  ui_hud: F({ id: 'earth-manhattan', hdg: 25, dist: 6, alt: 0.7, pitch: -4, speed: 0.3, view: 'chase', hour: 18.3, ui: true, seconds: 6 }),
  ui_cockpit: F({ id: 'earth-eiffel-tower', hdg: 120, dist: 5, alt: 0.6, pitch: -4, speed: 0.2, view: 'cockpit', hour: 19.6, ui: true, seconds: 6 }),
  // Up: the curve of the Earth
  up_climb: F({ cover: 0, lat: 27.9, lon: 86.9, hdg: 90, dist: 0, alt: 34, pitch: 28, speed: 2.2, view: 'chase', hour: 6.4, throttle: 1, seconds: 5 }),
  up_orbit: F({ cover: 0, lat: 20, lon: 78, hdg: 70, dist: 0, alt: 320, pitch: -14, speed: 7.6, view: 'cockpit', hour: 7.2, throttle: 0.8, seconds: 5, hold: 8 }),
  // NASA's fleet, where it really is
  n_iss: { seconds: 5, async setup(p) { await craft(p, 'International Space Station', { radius: 0.8 }); }, each: orbit(0.07, -0.01) },
  n_hubble: { seconds: 4.5, async setup(p) { await craft(p, 'Hubble Space Telescope', { radius: 0.8 }); }, each: orbit(0.08) },
  n_jwst: { seconds: 4.5, async setup(p) { await craft(p, 'James Webb Space Telescope', { radius: 0.8 }); }, each: orbit(0.08) },
  n_voyager: { seconds: 4.5, async setup(p) { await craft(p, 'Voyager 1', { radius: 0.8 }); }, each: orbit(0.07) },
  n_perseverance: { seconds: 4.5, async setup(p) { await craft(p, 'Mars 2020 (Perseverance)', { radius: 0.8 }); }, each: orbit(0.07) },
  n_cassini: { seconds: 4.5, async setup(p) { await craft(p, 'Cassini', { radius: 0.8, utc: '2012-06-01T00:00:00Z' }); }, each: orbit(0.07) },
  n_juno: { seconds: 4.5, async setup(p) { await craft(p, 'Juno', { radius: 0.8 }); }, each: orbit(0.07) },
  n_clipper: { seconds: 4.5, async setup(p) { await craft(p, 'Europa Clipper', { radius: 0.8 }); }, each: orbit(0.07) },
  // The planets from the jet
  p_saturn: { seconds: 5, async setup(p) { await cruise(p, 'Saturn', 'Saturn', 'chase', { throttle: 0.6 }); }, each: flyEach(null) },
  p_saturn_cockpit: { seconds: 5, async setup(p) { await cruise(p, 'Saturn', 'Saturn', 'cockpit', { throttle: 0.6 }); }, each: flyEach(null) },
  p_jupiter: { seconds: 5, async setup(p) { await cruise(p, 'Jupiter', 'Jupiter', 'chase', { throttle: 0.6 }); }, each: flyEach(null) },
  p_mars: { seconds: 5, async setup(p) { await takeoff(p, 'mars-olympus', 'chase'); }, each: flyEach(null) },
  p_moon: { seconds: 5, async setup(p) { await cruise(p, 'Moon', 'Earth', 'cockpit', { throttle: 0.5 }); }, each: flyEach(null) },
  ui_saturn: { ui: true, seconds: 5, async setup(p) { await cruise(p, 'Saturn', 'Saturn', 'chase', { throttle: 0.6 }); }, each: flyEach(null) },
};

// ---- CLI ---------------------------------------------------------------------------------------
const [mode = 'still', ...names] = process.argv.slice(2);
const list = names.length === 0 || names[0] === 'all' ? Object.keys(SHOTS) : names;
fs.mkdirSync('out/flight-stills', { recursive: true });

const { browser, page } = await openSite();
await startClock(page);
// The 3D tiles take a while to start the first time: one throwaway pass over Paris first
if (list.some((n) => /^(e_|cam_|ui_h|ui_c|up_)/.test(n))) {
  console.log('> warm-up');
  try { await setClean(page, true); await fly(page, { id: 'earth-eiffel-tower', hdg: 120, dist: 2.6, alt: 0.42, view: 'chase', hour: 19.6, hold: 25 }); } catch (e) { console.log('  warm-up failed:', e.message); }
}
for (const name of list) {
  const shot = SHOTS[name];
  if (!shot) { console.log('no shot', name); continue; }
  console.log(`> ${name}`);
  try {
    await reset(page);
    await setClean(page, !shot.ui);
    await shot.setup(page);
    if (mode === 'still') {
      const at = (process.env.STILL_AT || '0.1,0.9').split(',').map(Number);
      let i = 0;
      for (const f of at) {
        const n = Math.round(shot.seconds * FPS * f);
        for (; i < n; i++) { if (shot.each) await shot.each(page, i, i / FPS); await step(page); }
        await page.screenshot({ path: `out/flight-stills/${name}@${f}.jpg`, type: 'jpeg', quality: 82 });
      }
    } else {
      await record(page, name, shot.seconds, shot.each, { track: false });
    }
  } catch (e) {
    console.log(`  ${name} failed:`, e.message);
  }
}
await browser.close();
