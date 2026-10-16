// A frame-perfect camera for the Solaris website.
//
// The page runs on a virtual clock: performance.now, Date.now, requestAnimationFrame and every CSS
// animation are driven from here, one exact 1/FPS step per frame, so the footage is perfectly smooth
// however long the GPU takes to draw each frame.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
const URL = process.env.SOLARIS_URL || 'http://localhost:5199/solaris/';

const CLOCK = `
(() => {
  const realNow = performance.now.bind(performance);
  const realDate = Date.now.bind(Date);
  const realRaf = window.requestAnimationFrame.bind(window);
  const v = (window.__vclock = { manual: false, t: 0, dateOffset: 0, q: [], seen: new WeakMap() });
  performance.now = () => (v.manual ? v.t : realNow());
  Date.now = () => (v.manual ? v.dateOffset + v.t : realDate());
  window.requestAnimationFrame = (cb) => {
    if (v.manual) { v.q.push(cb); return v.q.length; }
    return realRaf(cb);
  };
  // Timers can join the virtual clock too (the interface's typing, holds and fades)
  const realSetTimeout = window.setTimeout.bind(window);
  const realClearTimeout = window.clearTimeout.bind(window);
  const realSetInterval = window.setInterval.bind(window);
  const realClearInterval = window.clearInterval.bind(window);
  v.timers = new Map(); v.nextId = 1e6; v.vtimers = false;
  window.setTimeout = (fn, ms = 0, ...a) => {
    if (!v.manual || !v.vtimers || typeof fn !== 'function') return realSetTimeout(fn, ms, ...a);
    const id = v.nextId++; v.timers.set(id, { due: v.t + (+ms || 0), fn, a, every: 0 }); return id;
  };
  window.setInterval = (fn, ms = 0, ...a) => {
    if (!v.manual || !v.vtimers || typeof fn !== 'function') return realSetInterval(fn, ms, ...a);
    const id = v.nextId++; v.timers.set(id, { due: v.t + Math.max(1, +ms || 0), fn, a, every: Math.max(1, +ms || 0) }); return id;
  };
  window.clearTimeout = (id) => (v.timers.has(id) ? v.timers.delete(id) : realClearTimeout(id));
  window.clearInterval = (id) => (v.timers.has(id) ? v.timers.delete(id) : realClearInterval(id));
  window.__vtimers = (on) => { v.vtimers = on; };
  const runTimers = () => {
    for (let guard = 0; guard < 500; guard++) {
      let next = null;
      for (const [id, tm] of v.timers) if (tm.due <= v.t && (!next || tm.due < next[1].due)) next = [id, tm];
      if (!next) break;
      const [id, tm] = next;
      if (tm.every) tm.due += tm.every; else v.timers.delete(id);
      try { tm.fn(...tm.a); } catch (e) { console.error(e); }
    }
  };
  window.__vclockStart = () => {
    v.t = realNow();
    v.dateOffset = realDate() - v.t;
    v.manual = true;
  };
  // Advance the world by dt milliseconds: CSS animations first, then one animation frame
  window.__vstep = (dt) => {
    v.t += dt;
    for (const a of document.getAnimations()) {
      let s = v.seen.get(a);
      if (!s) { s = { t0: v.t - dt, c0: Number(a.currentTime) || 0 }; v.seen.set(a, s); try { a.pause(); } catch (e) {} }
      try { a.currentTime = s.c0 + (v.t - s.t0); } catch (e) {}
    }
    runTimers();
    const q = v.q.splice(0);
    for (const cb of q) { try { cb(v.t); } catch (e) { console.error(e); } }
    return q.length;
  };
})();
`;

export async function openSite({ clean = true, settings = {}, viewport = { width: W, height: H } } = {}) {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader=false', '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
  });
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  await page.addInitScript(CLOCK);
  await page.addInitScript((s) => {
    localStorage.setItem('solaris.tour.v1', 'done');
    localStorage.setItem('solaris.settings', JSON.stringify({ markers: false, velaChatty: 0, ...s }));
  }, settings);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  // Through the preloader, in silence
  const begin = page.getByRole('button', { name: 'Begin in silence' });
  await begin.waitFor({ timeout: 180000 });
  await begin.click();
  await page.waitForFunction(() => !!window.__solaris, null, { timeout: 60000 });
  await page.waitForTimeout(2500);
  if (clean) await setClean(page, true);
  return { browser, page };
}

/** Hide the interface (the film adds its own type). */
export async function setClean(page, on) {
  await page.evaluate((on) => {
    let s = document.getElementById('__clean');
    if (!s) { s = document.createElement('style'); s.id = '__clean'; document.head.appendChild(s); }
    s.textContent = on ? '.hud-root, .vela-orb, .vela-dialog, .sol-toast, .sol-markers, .solaris-screen-labels { display: none !important; }' : '';
    // No orbit lines or constellation figures in the clean shots
    const sc = window.__solaris;
    if (sc) {
      sc.orbitLinesGroup.visible = !on;
      if (on && sc.starfield.areConstellationsVisible()) sc.toggleConstellations();
    }
  }, on);
}

export async function startClock(page) {
  await page.evaluate(() => window.__vclockStart());
}

/** Advance without recording (let a flight settle, textures stream in). */
export async function advance(page, seconds) {
  const n = Math.round(seconds * FPS);
  for (let i = 0; i < n; i++) await page.evaluate((dt) => window.__vstep(dt), 1000 / FPS);
}

/**
 * Record `seconds` of footage into out/<name>.mp4. `each(page, i, t)` runs before every frame for
 * scripted camera moves.
 */
/** Where the named sky objects are on screen this frame (pixels), for tracked annotations. */
async function trackFrame(page) {
  return page.evaluate(() => {
    const s = window.__solaris;
    const cam = s.cameraRig.camera;
    const out = {};
    for (const o of s.surface.objects) {
      if (!o.visible || o.altDeg < -2) continue;
      const v = o.labelWorld.clone().project(cam);
      if (v.z > 1) continue;
      out[o.name] = [Math.round((v.x * 0.5 + 0.5) * innerWidth * 10) / 10, Math.round((0.5 - v.y * 0.5) * innerHeight * 10) / 10, +o.magnitude.toFixed(1)];
    }
    return out;
  });
}

export async function record(page, name, seconds, each, { track = false } = {}) {
  const dir = path.resolve('out/shots');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(seconds * FPS);
  const t0 = Date.now();
  const tracks = [];
  for (let i = 0; i < n; i++) {
    if (each) await each(page, i, i / FPS);
    await page.evaluate((dt) => window.__vstep(dt), 1000 / FPS);
    if (track) tracks.push(await trackFrame(page));
    const png = await page.screenshot({ type: 'png', animations: 'allow', caret: 'initial' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 30 === 0) process.stdout.write(`\r  ${name}: ${i}/${n} frames (${((Date.now() - t0) / (i + 1)).toFixed(0)} ms/frame)   `);
  }
  ff.stdin.end();
  if (track) fs.writeFileSync(path.join(dir, `${name}.track.json`), JSON.stringify(tracks));
  await new Promise((r) => ff.on('close', r));
  process.stdout.write(`\r  ${name}: ${n} frames done in ${((Date.now() - t0) / 1000).toFixed(0)} s           \n`);
  return file;
}
