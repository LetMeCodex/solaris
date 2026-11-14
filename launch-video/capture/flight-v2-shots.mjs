/**
 * 4K (3840x2160) capture shoot for Solaris 2.0 Flight Launch Film v2.
 * Requires Vite dev server running at http://localhost:5199/solaris/
 *
 * Usage:
 *   node launch-video/capture/flight-v2-shots.mjs
 *   node launch-video/capture/flight-v2-shots.mjs wx_storm_rio stunt_cobra
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openSite, setClean, startClock, advance, FPS } from './rig.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public', 'shots');
mkdirSync(OUT, { recursive: true });

const VIEW_4K = { width: 3840, height: 2160 };
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const want = (name) => only.length === 0 || only.includes(name);

/** Fast 4K recorder: streams Q96 JPEGs into x264 -crf 11 so 8.3MP captures run ~5x faster than lossless PNG. */
async function record4K(page, name, seconds, each) {
  const n = Math.round(seconds * FPS);
  const file = join(OUT, `${name}.mp4`);
  const ff = spawn('ffmpeg', [
    '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '11', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await advance(page, 1 / FPS);
    if (each) await each(i, i / FPS);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 96, animations: 'allow', caret: 'initial' });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 15 === 0 || i === n - 1) {
      const rate = Math.round((Date.now() - t0) / (i + 1));
      console.log(`  [${name}] ${i + 1}/${n} (${rate} ms/frame)`);
    }
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
}

async function prep4kPerf(page) {
  await page.evaluate(async () => {
    const { perf } = await import('/solaris/src/rendering/Performance.ts');
    perf.frame = () => {};
    perf.scale = 1;
    window.__solaris?.lens?.setSupersample?.(1);
    const pt = window.__solaris?.photoreal;
    if (pt) {
      // At 3840x2160 (2x 1080p linear res), baseError=16 matches ~8px angular density at 1080p so
      // tiles stream completely (~200-350 tiles) without starving sibling quads on a 2500-tile queue.
      pt.baseError = 16;
      pt.uploadBudgetMs = 40;
      if (pt.tiles) pt.tiles.errorTarget = 16;
    }
    try {
      window.__h = await import('/solaris/src/dev/flightHarness.ts');
    } catch {}
  });
}

function solarUtcMs(hour, lon, month = 5, day = 21) {
  const base = Date.UTC(2026, month, day, 0, 0, 0);
  return base + ((((hour - lon / 15) % 24) + 24) % 24) * 3600e3;
}

async function waitEarthSettled(page, pinFn, minMs = 6000, maxMs = 40000) {
  const t0 = Date.now();
  let idleStreak = 0;
  let lastStats = null;
  while (Date.now() - t0 < maxMs) {
    for (let k = 0; k < 4; k++) {
      if (pinFn) await page.evaluate(pinFn);
      await advance(page, 1 / FPS);
    }
    await page.waitForTimeout(200);
    const st = await page.evaluate(() => {
      const s = window.__solaris;
      const exp = s?.explorer?.getStatus?.();
      const pt = s?.photoreal?.tiles?.stats;
      const cloudsReady = s?.earthClouds?.pass?.isNoiseReady?.() ?? true;
      return {
        cloudsReady,
        expBusy: exp?.layer ? (exp.layer.inFlight + exp.layer.queued) : 0,
        vis: pt?.visible ?? 0,
        q: pt?.queued ?? 0,
        d: pt?.downloading ?? 0,
        p: pt?.parsing ?? 0,
      };
    });
    lastStats = st;
    const elapsed = Date.now() - t0;
    const busy = st.q + st.d + st.p;
    const isIdle = st.cloudsReady && st.expBusy === 0 && busy <= 4 && st.vis >= 16;
    idleStreak = isIdle ? idleStreak + 1 : 0;
    if (elapsed >= minMs && idleStreak >= 4) break;
  }
  console.log('    settled tiles:', JSON.stringify(lastStats), `in ${Date.now() - t0}ms`);
}

async function resolvePose(page, opts) {
  return page.evaluate(async (o) => {
    let la = o.lat ?? 0;
    let lo = o.lon ?? 0;
    let lm = null;
    if (o.landmarkId) {
      const { getLandmark } = await import('/solaris/src/explorer/Landmarks.ts');
      lm = getLandmark(o.landmarkId);
      if (!lm) throw new Error(`Unknown landmark: ${o.landmarkId}`);
      la = lm.lat;
      lo = lm.lon;
    }
    const r = Math.PI / 180;
    const dist = o.dist ?? 0;
    const hdg = o.hdg ?? 0;
    const dN = -Math.cos(hdg * r) * dist;
    const dE = -Math.sin(hdg * r) * dist;
    const pLat = la + dN / 111.2;
    const pLon = lo + dE / (111.2 * Math.cos(la * r));
    return { pLat, pLon, la, lo, lm };
  }, opts);
}

async function enterJetAt(page, opts) {
  const {
    landmarkId = null,
    lat = 0,
    lon = 0,
    dist = 0,
    altKm,
    hdg,
    pitch,
    speed,
    hour = 17.5,
    month = 5,
    day = 21,
    weather = 'auto',
    liveWeather = null,
    cloudCfg = null,
    cloudsOn = true,
    view = 'chase',
    fbw = 'normal',
    speedTier = 0,
    minWaitMs = 7000,
    maxWaitMs = 40000,
  } = opts;

  const { pLat, pLon, lm } = await resolvePose(page, { landmarkId, lat, lon, dist, hdg });
  const utcMs = opts.utcMs ?? solarUtcMs(hour, pLon, month, day);

  const wasActive = await page.evaluate(() => Boolean(window.__solaris?.jet?.active));
  if (!wasActive) {
    await page.evaluate((lmark) => {
      const s = window.__solaris;
      s.selectBody('Earth', 1);
      if (!s.jet.active) s.enterJet(lmark ?? undefined);
    }, lm);
    await advance(page, 4.2);
  }

  await page.evaluate((o) => {
    const s = window.__solaris;
    s.clock.setUtcMs(o.utcMs);
    s.jet.helpOpen = false;
    s.jet.setPitchPreference(false);
    s.jet.view = o.view;
    s.jet.weather.mode = o.weather;
    s.jet.weather.live = o.liveWeather;
    s.jet.speedTier = o.speedTier;
    s.jet.flight.setFbwMode(o.fbw);
    if (s.photoreal) {
      s.photoreal.baseError = 16;
      s.photoreal.uploadBudgetMs = 40;
      if (s.photoreal.tiles) s.photoreal.tiles.errorTarget = 16;
    }
    if (s.earthClouds) {
      if (!window.__origCloudUpdate) window.__origCloudUpdate = s.earthClouds.update.bind(s.earthClouds);
      if (!o.cloudsOn) {
        s.earthClouds.hide();
        s.earthClouds.update = () => {};
        s.jet.weather.cloudInside = 0;
      } else {
        s.earthClouds.update = window.__origCloudUpdate;
        if (o.cloudCfg) {
          s.earthClouds.weather.update = () => {};
          s.earthClouds.weather.current = o.cloudCfg;
        }
        s.earthClouds.eased = null;
      }
    }
    window.__v2Pose = o;
    window.__v2PinStill = () => {
      const p = window.__v2Pose;
      window.__h.goto(p.lat, p.lon, p.altKm, p.hdg, p.pitch, 0);
      window.__solaris.jet.throttle = 0;
    };
  }, { lat: pLat, lon: pLon, altKm, hdg, pitch, speed, utcMs, weather, liveWeather, cloudCfg, cloudsOn, view, fbw, speedTier });
  await advance(page, 0.15);

  await waitEarthSettled(page, () => window.__v2PinStill(), minWaitMs, maxWaitMs);

  await page.evaluate((o) => {
    window.__h.goto(o.lat, o.lon, o.altKm, o.hdg, o.pitch, o.speed);
    window.__solaris.jet.throttle = o.speed > 0.25 ? 1 : 0.65;
  }, { lat: pLat, lon: pLon, altKm, hdg, pitch, speed });
  await advance(page, 0.15);
}

async function warmUpEarth(page) {
  console.log('=== [warm-up] Priming Google 3D Tiles over Paris ===');
  await enterJetAt(page, {
    landmarkId: 'earth-eiffel-tower',
    dist: 2.8, altKm: 0.48, hdg: 120, pitch: -5, speed: 0.12,
    hour: 18.2, weather: 'clear', minWaitMs: 12000, maxWaitMs: 42000,
  });
}

async function captureDeepTime4K(page, name, id, secs = 3.5) {
  if (!want(name)) return;
  console.log(`\n=== [${name}] DeepTime '${id}' (4K ${secs}s) ===`);
  await page.evaluate((dtId) => {
    const s = window.__solaris;
    if (s.jet.active) s.exitJet(false);
    s.enterDeepTime(dtId);
  }, id);
  for (let i = 0; i < 65; i++) {
    await advance(page, 0.12);
    const active = await page.evaluate(() => {
      const s = window.__solaris;
      return s?.surface?.isActive?.() && !s.pendingDeepTime && !s.pendingSkyView;
    });
    if (active) break;
    await page.waitForTimeout(30);
  }
  await advance(page, 0.6);
  const startPose = await page.evaluate(() => {
    const s = window.__solaris?.surface;
    const DEG = Math.PI / 180;
    return { hdg: (s?.heading ?? 0) / DEG, pitch: (s?.pitch ?? 0.25) / DEG, fov: s?.fov ?? 50 };
  });
  await record4K(page, name, secs, async (f) => {
    await page.evaluate(({ h, p, fv, i }) => {
      const s = window.__solaris?.surface;
      if (s?.setView) s.setView(h + i * 0.04, p + i * 0.06, Math.max(36, fv - i * 0.04));
    }, { h: startPose.hdg, p: startPose.pitch, fv: startPose.fov, i: f });
  });
}

async function run() {
  const pass1Needed = [
    'wx_clouds_fjords',
    'wx_snow_matterhorn',
    'wx_autumn_fuji',
    'wx_storm_rio',
    'jet_gripen_hero',
    'stunt_mach1',
    'stunt_scramjet',
    'dt_last_eclipse_4k',
    'dt_red_giant_4k',
    'dt_comet_storm_4k',
  ].some(want);

  if (pass1Needed) {
    console.log('\n>>> PASS 1: Gripen + Earth Weather/Seasons + Deep Time (3840x2160) <<<');
    const { browser, page } = await openSite({ clean: true, viewport: VIEW_4K });
    await prep4kPerf(page);
    await startClock(page);
    await setClean(page, true);

    const airId = await page.evaluate(() => window.__solaris.jet.airframeId);
    console.log('Pass 1 loaded airframe:', airId);

    const pass1Earth = [
      'wx_clouds_fjords', 'wx_snow_matterhorn', 'wx_autumn_fuji',
      'wx_storm_rio', 'jet_gripen_hero', 'stunt_mach1', 'stunt_scramjet',
    ].some(want);
    if (pass1Earth) await warmUpEarth(page);

    if (want('wx_clouds_fjords')) {
      console.log('=== [wx_clouds_fjords] 4K (Golden Gate cloud sea) ===');
      await enterJetAt(page, {
        landmarkId: 'earth-golden-gate', dist: 3.5, altKm: 0.55, hdg: 150, pitch: -3, speed: 0.16,
        hour: 18.4,
        weather: 'auto',
        cloudCfg: { cover: 0.48, coverLow: 0.40, kind: 'clear', strength: 0, windMps: 14, windDirDeg: 230, visibilityKm: 55, label: 'Golden Clouds' },
      });
      await page.keyboard.down('Space');
      await page.keyboard.down('KeyD');
      await advance(page, 0.067);
      await page.keyboard.up('KeyD');
      await advance(page, 0.85);
      await record4K(page, 'wx_clouds_fjords', 3.0);
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('wx_snow_matterhorn')) {
      console.log('=== [wx_snow_matterhorn] 4K (Chamonix winter snow) ===');
      await enterJetAt(page, {
        landmarkId: 'earth-chamonix-mont-blanc', dist: 8.5, altKm: 4.55, hdg: 200, pitch: -6, speed: 0.20,
        hour: 15.6, month: 0, day: 15,
        weather: 'auto',
        liveWeather: { kind: 'snow', strength: 0.85, label: 'Winter Snow' },
        cloudCfg: { cover: 0.30, coverLow: 0.24, kind: 'clear', strength: 0, windMps: 10, windDirDeg: 220, visibilityKm: 60, label: 'Winter Snow' },
      });
      await page.keyboard.down('Space');
      await record4K(page, 'wx_snow_matterhorn', 3.0, async (f) => {
        if (f === 10) await page.keyboard.down('KeyA');
        if (f === 12) await page.keyboard.up('KeyA');
      });
      await page.keyboard.up('KeyA').catch(() => {});
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('wx_autumn_fuji')) {
      console.log('=== [wx_autumn_fuji] 4K (Kyoto Autumn Golden Dusk) ===');
      await enterJetAt(page, {
        landmarkId: 'earth-kyoto', dist: 2.8, altKm: 0.55, hdg: 40, pitch: -7, speed: 0.16,
        hour: 16.9, month: 9, day: 25,
        weather: 'auto',
        cloudCfg: { cover: 0.40, coverLow: 0.32, kind: 'clear', strength: 0, windMps: 8, windDirDeg: 260, visibilityKm: 55, label: 'Crisp Autumn' },
      });
      await page.keyboard.down('Space');
      await page.keyboard.down('KeyA');
      await advance(page, 0.067);
      await page.keyboard.up('KeyA');
      await advance(page, 0.35);
      await record4K(page, 'wx_autumn_fuji', 3.0);
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('wx_storm_rio')) {
      console.log('=== [wx_storm_rio] 4K (Rio chase thunderstorm + cloud lightning) ===');
      await enterJetAt(page, {
        landmarkId: 'earth-christ-redeemer', dist: 3.2, altKm: 2.35, hdg: 100, pitch: -11, speed: 0.20,
        hour: 17.3,
        view: 'chase',
        weather: 'auto',
        liveWeather: { kind: 'storm', strength: 0.95, label: 'Thunderstorm' },
        cloudCfg: { cover: 0.56, coverLow: 0.42, kind: 'clear', strength: 0, windMps: 18, windDirDeg: 210, visibilityKm: 55, label: 'Thunderstorm' },
      });
      await page.keyboard.down('Space');
      await record4K(page, 'wx_storm_rio', 3.2, async (f) => {
        if (f === 10 || f === 38 || f === 68) {
          await page.evaluate(() => { window.__solaris.jet.weather.nextFlash = 0.01; });
        }
      });
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('jet_gripen_hero')) {
      console.log('=== [jet_gripen_hero] 4K ===');
      await enterJetAt(page, {
        landmarkId: 'earth-matterhorn', dist: 9.0, altKm: 5.05, hdg: 205, pitch: -4, speed: 0.21,
        hour: 17.5,
        weather: 'auto',
        cloudCfg: { cover: 0.22, coverLow: 0.18, kind: 'clear', strength: 0, windMps: 9, windDirDeg: 240, visibilityKm: 45, label: 'Alpine Sunset' },
      });
      await page.keyboard.down('Space');
      await record4K(page, 'jet_gripen_hero', 2.6, async (f) => {
        if (f === 10) await page.keyboard.down('KeyD');
        if (f === 12) await page.keyboard.up('KeyD');
      });
      await page.keyboard.up('KeyD').catch(() => {});
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('stunt_mach1')) {
      console.log('=== [stunt_mach1] 4K ===');
      await enterJetAt(page, {
        landmarkId: 'earth-honolulu', dist: 5.5, altKm: 1.15, hdg: 300, pitch: 2, speed: 0.336,
        hour: 17.6,
        weather: 'clear',
      });
      await page.keyboard.down('Space');
      await record4K(page, 'stunt_mach1', 3.0, async (f) => {
        const mach = await page.evaluate(() => {
          const fl = window.__solaris?.jet?.flight;
          if (fl && fl.speedKmS > 0.339) fl.speedKmS = 0.337;
          return window.__solaris?.jet?.telemetry?.mach ?? fl?.mach ?? 0;
        });
        if (f === 15 || f === 55) console.log(`    [stunt_mach1 f=${f}] mach=${Number(mach).toFixed(3)}`);
      });
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('stunt_scramjet')) {
      console.log('=== [stunt_scramjet] 4K ===');
      await enterJetAt(page, {
        lat: 26.5, lon: -80.2, dist: 0, altKm: 42.0, hdg: 85, pitch: 18, speed: 7.4,
        hour: 16.5,
        weather: 'clear',
        speedTier: 2,
        minWaitMs: 6000, maxWaitMs: 25000,
      });
      await page.keyboard.down('Space');
      await record4K(page, 'stunt_scramjet', 3.0);
      await page.keyboard.up('Space').catch(() => {});
    }

    await captureDeepTime4K(page, 'dt_last_eclipse_4k', 'last-eclipse', 3.5);
    await captureDeepTime4K(page, 'dt_red_giant_4k', 'red-giant', 3.5);
    await captureDeepTime4K(page, 'dt_comet_storm_4k', 'comet-storm', 3.5);

    await browser.close();
  }

  const pass2Needed = ['jet_su30_hero', 'stunt_cobra', 'stunt_kulbit', 'stunt_highg'].some(want);
  if (pass2Needed) {
    console.log('\n>>> PASS 2: Su-30MKK Flanker-G + Stunts (3840x2160) <<<');
    const { browser, page } = await openSite({ clean: true, viewport: VIEW_4K });
    await page.addInitScript(() => {
      try { localStorage.setItem('solaris.jet', 'su30'); } catch {}
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const silenceBtn = page.locator('button:has-text("Begin in silence")');
    await silenceBtn.waitFor({ state: 'visible', timeout: 30000 });
    await silenceBtn.click();
    await page.waitForFunction(() => Boolean(window.__solaris?.jet), { timeout: 25000 });
    await prep4kPerf(page);
    await startClock(page);
    await setClean(page, true);

    const airId = await page.evaluate(() => window.__solaris.jet.airframeId);
    console.log('Pass 2 loaded airframe:', airId);
    if (airId !== 'su30') throw new Error(`Expected su30 airframe, got ${airId}`);
    await warmUpEarth(page);

    if (want('jet_su30_hero')) {
      console.log('=== [jet_su30_hero] 4K ===');
      await enterJetAt(page, {
        landmarkId: 'earth-matterhorn', dist: 9.0, altKm: 5.05, hdg: 205, pitch: -4, speed: 0.21,
        hour: 17.5,
        weather: 'auto',
        cloudCfg: { cover: 0.22, coverLow: 0.18, kind: 'clear', strength: 0, windMps: 9, windDirDeg: 240, visibilityKm: 45, label: 'Alpine Sunset' },
      });
      await page.keyboard.down('Space');
      await record4K(page, 'jet_su30_hero', 2.6, async (f) => {
        if (f === 10) await page.keyboard.down('KeyD');
        if (f === 12) await page.keyboard.up('KeyD');
      });
      await page.keyboard.up('KeyD').catch(() => {});
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('stunt_cobra')) {
      console.log('=== [stunt_cobra] 4K ===');
      await enterJetAt(page, {
        landmarkId: 'earth-grand-canyon', dist: 6.5, altKm: 2.35, hdg: 80, pitch: 2, speed: 0.145,
        hour: 18.0,
        weather: 'auto',
        cloudCfg: { cover: 0.24, coverLow: 0.20, kind: 'clear', strength: 0, windMps: 8, windDirDeg: 210, visibilityKm: 42, label: 'Scattered' },
      });
      await record4K(page, 'stunt_cobra', 3.5, async (f) => {
        if (f === 10) await page.keyboard.press('KeyV');
        if (f === 48) await page.keyboard.down('Space');
        if (f === 40 || f === 65) {
          const aoa = await page.evaluate(() => window.__solaris?.jet?.telemetry?.aoaDeg ?? 0);
          console.log(`    [stunt_cobra f=${f}] aoa=${Number(aoa).toFixed(1)} deg`);
        }
      });
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('stunt_kulbit')) {
      console.log('=== [stunt_kulbit] 4K ===');
      await enterJetAt(page, {
        landmarkId: 'earth-chamonix-mont-blanc', dist: 7.5, altKm: 4.35, hdg: 195, pitch: 4, speed: 0.140,
        hour: 17.6,
        weather: 'auto',
        cloudCfg: { cover: 0.28, coverLow: 0.22, kind: 'clear', strength: 0, windMps: 10, windDirDeg: 230, visibilityKm: 40, label: 'Golden Skies' },
        fbw: 'psm',
      });
      await page.keyboard.down('Space');
      await page.keyboard.down('KeyS');
      await record4K(page, 'stunt_kulbit', 3.5, async (f) => {
        if (f === 85) await page.keyboard.up('KeyS');
      });
      await page.keyboard.up('KeyS').catch(() => {});
      await page.keyboard.up('Space').catch(() => {});
    }

    if (want('stunt_highg')) {
      console.log('=== [stunt_highg] 4K (9G turn over Hong Kong) ===');
      await enterJetAt(page, {
        landmarkId: 'earth-hong-kong', dist: 3.4, altKm: 0.85, hdg: 330, pitch: 0, speed: 0.295,
        hour: 17.8,
        weather: 'auto',
        cloudCfg: { cover: 0.30, coverLow: 0.25, kind: 'clear', strength: 0, windMps: 12, windDirDeg: 225, visibilityKm: 40, label: 'Dramatic Clouds' },
      });
      await page.keyboard.down('Space');
      await page.keyboard.down('KeyS');
      await page.keyboard.down('KeyD');
      await record4K(page, 'stunt_highg', 3.0, async (f) => {
        if (f === 68) {
          await page.keyboard.up('KeyD');
          await page.keyboard.up('KeyS');
        }
      });
      await page.keyboard.up('KeyD').catch(() => {});
      await page.keyboard.up('KeyS').catch(() => {});
      await page.keyboard.up('Space').catch(() => {});
    }

    await browser.close();
  }

  console.log('\nDone capturing requested 4K shots.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
