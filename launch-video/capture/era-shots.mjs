// The shots of the second launch film, "Every Sky, Every Era": the jet, the landmarks and Deep Time,
// the parts of Solaris the first film never showed. Same frame-perfect rig as shots.mjs.
//
//   node capture/era-shots.mjs still <shot...>    frames from each shot (out/era-stills)
//   node capture/era-shots.mjs record <shot...>   footage (out/shots/<shot>.mp4); "all" for every shot
import fs from 'node:fs';
import { openSite, startClock, advance, record, setClean, FPS } from './rig.mjs';

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

/** Let streamed imagery arrive: alternate virtual steps with real waiting. */
async function stream(page, n = 12) {
  for (let i = 0; i < n; i++) { await advance(page, 0.25); await page.waitForTimeout(350); }
}

async function reset(page) {
  for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(250); }
  await S(page, () => {
    const s = window.__solaris;
    try { if (s.isJetActive()) s.exitJet(false); } catch (e) {}
    try { s.stopShowcase(); } catch (e) {}
    try { s.exitDeepTime(); } catch (e) {}
    try { if (s.surface.isActive()) s.exitSurface(false); } catch (e) {}
    try { s.exitHorizonView(false); } catch (e) {}
    s.clock.timeMultiplier = 1;
    s.clock.isPaused = false;
    s.clock.setUtcMs(Date.parse('2026-11-07T17:10:00Z'));
  });
}

/** Stand under another era's sky, then hold the clock so the edit owns the motion. */
async function era(page, id) {
  await S(page, (id) => window.__solaris.enterDeepTime(id), id);
  await settle(page, 1.5, 40);
  await stream(page, 14);
  await S(page, () => { const s = window.__solaris; s.surface.idleEnabled = false; });
  // Remember the view the scene chose, the drift is relative to it
  await S(page, () => { const st = window.__solaris.surface.getStatus(); window.__v0 = st ? { h: st.headingDeg, p: st.pitchDeg, f: st.fovDeg } : null; });
}

/** Slow drift across a surface view: heading, pitch (deg/s) and a lens squeeze (fraction over the shot). */
const look = (dh, dp, zoom, seconds) => (page, i, t) =>
  S(page, ({ t, dh, dp, zoom, seconds }) => {
    const v = window.__v0;
    if (!v) return;
    window.__solaris.surface.setView(v.h + dh * t, v.p + dp * t, v.f * (1 - zoom * (t / seconds)));
  }, { t, dh, dp, zoom, seconds });

/** Fly to a landmark from orbit (the explorer's own flight). */
async function landmark(page, id) {
  await S(page, (id) => window.__solaris.flyToLandmark(id), id);
  await settle(page, 1.5, 30);
  // The explorer's descent is not a rig transit: give it time, with imagery streaming
  await stream(page, 30);
}

/** Orbit the focused point a little. */
const orbit = (spin, dolly = 0, tilt = 0) => (page) =>
  S(page, ({ spin, dolly, tilt, dt }) => {
    const r = window.__solaris.cameraRig;
    r.targetSpherical.theta += spin * dt;
    r.targetSpherical.phi = Math.min(Math.PI - 0.05, Math.max(0.05, r.targetSpherical.phi + tilt * dt));
    r.targetSpherical.radius *= 1 + dolly * dt;
  }, { spin, dolly, tilt, dt: 1 / FPS });

/** Take off in the jet from a landmark, climbing away along its view. */
async function takeoff(page, id, view = 'chase', { throttle = 0.3, pre = 0.5, localHour = 16, utc = null } = {}) {
  await S(page, async ({ id, view, throttle, localHour, utc }) => {
    const { getLandmark } = await import('/solaris/src/explorer/Landmarks.ts');
    const s = window.__solaris;
    const lm = getLandmark(id);
    // Golden hour where the jet takes off (Earth: from longitude; other worlds: an explicit UTC)
    const ms = utc ? Date.parse(utc) : Date.parse('2026-11-07T00:00:00Z') + (((localHour - lm.lon / 15) % 24 + 24) % 24) * 3600e3;
    s.clock.setUtcMs(ms);
    s.selectBody(lm.body, 1);
    s.enterJet(lm);
    s.jet.view = view;
    s.jet.helpOpen = false;
    s.jet.throttle = throttle;
    s.jet.weather.mode = 'clear';
    try { s.jet.audio.setMuted?.(true); } catch (e) {}
  }, { id, view, throttle, localHour, utc });
  // Terrain streams in real time; hold the jet still meanwhile by stepping very small amounts
  await page.waitForTimeout(6000);
  for (let i = 0; i < 10; i++) { await S(page, (dt) => window.__vstep(dt), 1000 / FPS); await page.waitForTimeout(400); }
  await advance(page, pre);
  await page.waitForTimeout(2000);
}

/** In the jet, in open space, heading for a world. */
async function cruise(page, from, to, view = 'chase', { throttle = 1, pre = 2 } = {}) {
  await S(page, async ({ from, to, view, throttle }) => {
    const s = window.__solaris;
    s.selectBody(from, 1);
    s.enterJet();
    s.jet.view = view;
    s.jet.helpOpen = false;
    s.jet.setTarget(to);
    s.jet.pointAtTarget();
    s.jet.throttle = throttle;
  }, { from, to, view, throttle });
  await page.waitForTimeout(1500);
  await stream(page, 6);
  await advance(page, pre);
}

const jetHold = (page) => S(page, () => { const s = window.__solaris; if (s.jet.active) s.jet.helpOpen = false; });

/** Stand somewhere at a given moment (a custom postcard), drift relative to its framing. */
async function postcard(page, card) {
  await S(page, (c) => window.__solaris.openPostcard({ id: 'x', title: '', place: '', caption: '', magnification: 1, ...c }), card);
  await settle(page, 1, 40);
  await stream(page, 14);
  await S(page, () => { const s = window.__solaris; s.surface.idleEnabled = false; s.clock.isPaused = true; });
  await S(page, () => { const st = window.__solaris.surface.getStatus(); window.__v0 = st ? { h: st.headingDeg, p: st.pitchDeg, f: st.fovDeg } : null; });
}

// ---- the shots -------------------------------------------------------------------------------
export const SHOTS = {
  // TODAY: the sky tonight, under Fitz Roy (the same spot Andromeda later fills)
  today_fitzroy: { seconds: 5, async setup(p) { await postcard(p, { body: 'Earth', lat: -49.3, lon: -73.05, utc: '2026-11-08T05:00:00Z', heading: 60, pitch: 24, fov: 95 }); }, each: look(1.2, 0.5, 0.06, 5) },
  today_sahara: { seconds: 5, async setup(p) { await postcard(p, { body: 'Earth', lat: 23.8, lon: 11.0, utc: '2026-11-07T17:20:00Z', heading: 250, pitch: 12, fov: 74 }); }, each: look(1.2, 0.3, 0.06, 5) },
  // FLY: the jet
  jet_matterhorn: { seconds: 5, async setup(p) { await takeoff(p, 'earth-matterhorn', 'chase'); }, each: jetHold },
  jet_fuji: { seconds: 5, async setup(p) { await takeoff(p, 'earth-fuji', 'chase'); }, each: jetHold },
  jet_olympus: { seconds: 5, async setup(p) { await takeoff(p, 'mars-olympus', 'chase'); }, each: jetHold },
  jet_cockpit: { seconds: 5, async setup(p) { await takeoff(p, 'earth-geirangerfjord', 'cockpit'); }, each: jetHold },
  jet_flyby: { seconds: 5, async setup(p) { await takeoff(p, 'earth-cuernos-del-paine', 'flyby'); }, each: jetHold },
  jet_saturn: { seconds: 5, async setup(p) { await cruise(p, 'Saturn', 'Saturn', 'chase', { throttle: 0.6 }); }, each: jetHold },
  jet_titan: { seconds: 5, async setup(p) { await takeoff(p, 'titan-kraken', 'chase'); }, each: jetHold },
  jet_io: { seconds: 5, async setup(p) { await takeoff(p, 'io-loki', 'chase'); }, each: jetHold },

  // LAND: landmarks from above
  lm_valles: { seconds: 4, async setup(p) { await landmark(p, 'mars-valles'); }, each: orbit(0.03, -0.01) },
  lm_everest: { seconds: 4, async setup(p) { await landmark(p, 'earth-everest'); }, each: orbit(0.03, -0.01) },
  lm_tycho: { seconds: 4, async setup(p) { await landmark(p, 'moon-tycho'); }, each: orbit(0.03, -0.01) },
  lm_sputnik: { seconds: 4, async setup(p) { await landmark(p, 'pluto-sputnik'); }, each: orbit(0.03, -0.01) },
  lm_richat: { seconds: 4, async setup(p) { await landmark(p, 'earth-richat'); }, each: orbit(0.03, -0.01) },
  lm_conamara: { seconds: 4, async setup(p) { await landmark(p, 'europa-conamara'); }, each: orbit(0.03, -0.01) },

  // TIME: Deep Time, the sky in other eras
  dt_betelgeuse: { seconds: 4, async setup(p) { await era(p, 'betelgeuse'); }, each: look(1.2, 0.3, 0.06, 4) },
  dt_two_suns: { seconds: 4, async setup(p) { await era(p, 'two-suns'); }, each: look(1.0, 0.2, 0.06, 4) },
  dt_gliese: { seconds: 4, async setup(p) { await era(p, 'gliese'); }, each: look(1.0, 0.3, 0.06, 4) },
  dt_comet_storm: { seconds: 4, async setup(p) { await era(p, 'comet-storm'); }, each: look(-1.2, 0.4, 0.06, 4) },
  dt_ring_rain: { seconds: 4, async setup(p) { await era(p, 'ring-rain'); }, each: look(1.0, 0.3, 0.06, 4) },
  dt_ringless: { seconds: 4, async setup(p) { await era(p, 'ringless-saturn'); }, each: look(0.8, 0.2, 0.06, 4) },
  dt_last_eclipse: { seconds: 4, async setup(p) { await era(p, 'last-eclipse'); }, each: look(0, 0, 0.05, 4) },
  dt_bright_sun: { seconds: 4, async setup(p) { await era(p, 'bright-sun'); }, each: look(0.8, 0.2, 0.06, 4) },
  dt_andromeda: { seconds: 4, async setup(p) { await era(p, 'andromeda'); }, each: look(1.2, 0.5, 0.06, 4) },
  dt_collision: { seconds: 4, async setup(p) { await era(p, 'collision'); }, each: look(-1.0, 0.4, 0.06, 4) },
  dt_red_giant: { seconds: 4, async setup(p) { await era(p, 'red-giant'); }, each: look(0.6, 0.3, 0.06, 4) },
  dt_milkdromeda: { seconds: 4, async setup(p) { await era(p, 'milkdromeda'); }, each: look(1.0, 0.4, 0.06, 4) },
  dt_planetary_nebula: { seconds: 4, async setup(p) { await era(p, 'planetary-nebula'); }, each: look(0.6, 0.2, 0.06, 4) },
  dt_white_dwarf: { seconds: 4, async setup(p) { await era(p, 'white-dwarf'); }, each: look(0.5, 0.2, 0.06, 4) },
  dt_stars_out: { seconds: 4, async setup(p) { await era(p, 'stars-out'); }, each: look(0.5, 0.2, 0.05, 4) },
  dt_black_hole: { seconds: 5, async setup(p) { await era(p, 'black-hole'); }, each: orbit(0.02, -0.01) },

  // The interface as it is in the jet (HUD on)
  ui_jet: { ui: true, seconds: 5, async setup(p) { await takeoff(p, 'earth-matterhorn', 'chase'); } },
  ui_deep: { ui: true, seconds: 5, async setup(p) { await era(p, 'andromeda'); }, each: look(1.0, 0.4, 0.04, 5) },
};

// ---- CLI ---------------------------------------------------------------------------------------
const [mode = 'still', ...names] = process.argv.slice(2);
const list = names.length === 0 || names[0] === 'all' ? Object.keys(SHOTS) : names;
fs.mkdirSync('out/era-stills', { recursive: true });

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
      const at = (process.env.STILL_AT || '0.1,0.9').split(',').map(Number);
      let i = 0;
      for (const f of at) {
        const n = Math.round(shot.seconds * FPS * f);
        for (; i < n; i++) { if (shot.each) await shot.each(page, i, i / FPS); await S(page, (dt) => window.__vstep(dt), 1000 / FPS); }
        await page.screenshot({ path: `out/era-stills/${name}@${f}.jpg`, type: 'jpeg', quality: 82 });
      }
    } else {
      await record(page, name, shot.seconds, shot.each, { track: !!shot.track });
    }
  } catch (e) {
    console.log(`  ${name} failed:`, e.message);
  }
}
await browser.close();
