import React, { useEffect, useRef } from 'react';

/**
 * How surface imagery streams in, like a web map: the globe is cut into a pyramid of tiles, each
 * level four times sharper than the last. Only tiles near where you look are fetched, coarse to
 * fine and nearest first, at most six at a time; until a tile arrives its parent stands in.
 *
 * The picture is real: the same Earth map Solaris uses, cropped to Europe, Africa and the Middle
 * East, and resampled to each level's true resolution, so a coarse tile really is blurry.
 */

const LEVELS = 5;
const BASE_PX = 24; // level 0 covers the square with 24 × 24 pixels; each level doubles it
const base = import.meta.env.BASE_URL;
// longitude −30° to 60°, latitude 65° to −25°: a 512-pixel square of the 2048 × 1024 map
const CROP = { x: (150 / 360) * 2048, y: (25 / 180) * 1024, s: (90 / 360) * 2048 };

interface Tile { l: number; x: number; y: number; d: number }
const key = (t: { l: number; x: number; y: number }) => `${t.l}/${t.x}/${t.y}`;

export const TilePyramid: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const stats = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const g = cv.getContext('2d')!;
    const levels: HTMLCanvasElement[] = [];
    const loaded = new Map<string, number>();
    let queue: Tile[] = [];
    let inFlight: Array<{ t: Tile; done: number }> = [];
    let focus: [number, number] = [0.55, 0.3];
    let visible = false;
    let wanderAt = 0;
    let userAt = -1e9;

    const img = new Image();
    img.src = `${base}textures/2k_earth_daymap.jpg`;
    img.onload = () => {
      for (let l = 0; l < LEVELS; l++) {
        const c = document.createElement('canvas');
        c.width = c.height = BASE_PX * 2 ** l;
        const cg = c.getContext('2d')!;
        cg.imageSmoothingQuality = 'high';
        cg.drawImage(img, CROP.x, CROP.y, CROP.s, CROP.s, 0, 0, c.width, c.height);
        levels.push(c);
        // each row in the legend shows its level at its own resolution
        const sw = rows.current?.querySelectorAll<HTMLCanvasElement>('.tp-sw')[l];
        if (sw) {
          const sg = sw.getContext('2d')!;
          sg.imageSmoothingEnabled = false;
          sg.drawImage(c, 0, 0, sw.width, sw.height);
        }
      }
    };

    // Plan the requests for a focus point: levels coarse to fine, nearest first
    const plan = (f: [number, number]) => {
      const q: Tile[] = [];
      for (let l = 0; l < LEVELS; l++) {
        const n = 2 ** l;
        const reach = l < 2 ? 99 : 1.6 / n + 0.12;
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          const d = Math.hypot((x + 0.5) / n - f[0], (y + 0.5) / n - f[1]);
          if (d < reach) q.push({ l, x, y, d });
        }
      }
      q.sort((a, b) => a.l - b.l || a.d - b.d);
      return q.filter((t) => !loaded.has(key(t)));
    };
    const look = (f: [number, number]) => {
      focus = f;
      queue = plan(f);
      // requests the view no longer needs are cancelled
      inFlight = inFlight.filter((r) => queue.some((t) => key(t) === key(r.t)));
    };
    look(focus);

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const f: [number, number] = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
      if (f[0] < 0 || f[1] < 0 || f[0] > 1 || f[1] > 1) return;
      userAt = performance.now();
      look(f);
    };
    cv.addEventListener('pointermove', onMove);

    let raf = 0;
    let statAt = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || levels.length < LEVELS) return;
      const now = performance.now();
      // wander when nobody is pointing, as if someone were exploring
      if (now - userAt > 4000 && now > wanderAt) {
        wanderAt = now + 5200;
        look([0.18 + Math.random() * 0.64, 0.18 + Math.random() * 0.64]);
      }
      inFlight = inFlight.filter((r) => {
        if (now < r.done) return true;
        loaded.set(key(r.t), now);
        return false;
      });
      while (inFlight.length < 6 && queue.length) {
        const t = queue.shift()!;
        if (!loaded.has(key(t))) inFlight.push({ t, done: now + 220 + Math.random() * 420 });
      }

      const S = cv.width;
      g.clearRect(0, 0, S, S);
      g.imageSmoothingEnabled = true;
      // coarse to fine: each loaded tile covers its parent
      for (let l = 0; l < LEVELS; l++) {
        const n = 2 ** l;
        const src = levels[l];
        const ts = src.width / n;
        const ds = S / n;
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          const at = loaded.get(`${l}/${x}/${y}`);
          if (at === undefined) continue;
          g.globalAlpha = Math.min(1, (now - at) / 350);
          g.drawImage(src, x * ts, y * ts, ts, ts, x * ds, y * ds, ds + 0.5, ds + 0.5);
          if (l >= 2) {
            g.globalAlpha = 0.16;
            g.strokeStyle = '#f3e7d3';
            g.lineWidth = 1;
            g.strokeRect(x * ds + 0.5, y * ds + 0.5, ds - 1, ds - 1);
          }
        }
      }
      g.globalAlpha = 1;
      // requests in flight: dashed, with a sweep
      g.setLineDash([5, 4]);
      g.lineWidth = 1.5 * (S / cv.clientWidth);
      for (const r of inFlight) {
        const n = 2 ** r.t.l;
        const ds = S / n;
        const k = 1 - (r.done - now) / 640;
        g.fillStyle = `rgba(143,168,255,${0.1 + 0.12 * Math.sin(now / 90)})`;
        g.fillRect(r.t.x * ds, r.t.y * ds, ds * Math.max(0, Math.min(1, k)), ds);
        g.strokeStyle = '#8fa8ff';
        g.strokeRect(r.t.x * ds + 1, r.t.y * ds + 1, ds - 2, ds - 2);
      }
      g.setLineDash([]);
      // where you are looking
      const fx = focus[0] * S;
      const fy = focus[1] * S;
      const u = S / cv.clientWidth;
      g.strokeStyle = '#f3e7d3';
      g.lineWidth = 1.5 * u;
      g.beginPath();
      g.arc(fx, fy, 14 * u, 0, Math.PI * 2);
      g.moveTo(fx - 22 * u, fy); g.lineTo(fx - 8 * u, fy);
      g.moveTo(fx + 8 * u, fy); g.lineTo(fx + 22 * u, fy);
      g.moveTo(fx, fy - 22 * u); g.lineTo(fx, fy - 8 * u);
      g.moveTo(fx, fy + 8 * u); g.lineTo(fx, fy + 22 * u);
      g.stroke();

      if (now - statAt > 100) {
        statAt = now;
        const bars = rows.current?.querySelectorAll<HTMLElement>('.tp-row');
        bars?.forEach((row, l) => {
          const got = [...loaded.keys()].filter((k) => k.startsWith(`${l}/`)).length;
          row.querySelector<HTMLElement>('.tp-n')!.textContent = `${got} of ${4 ** l}`;
          row.querySelector<HTMLElement>('.tp-fill')!.style.width = `${(100 * got) / 4 ** l}%`;
        });
        if (stats.current) stats.current.innerHTML = `<span><b>${inFlight.length}</b> / 6 in flight</span><span><b>${loaded.size}</b> loaded</span><span><b>${queue.length}</b> queued</span>`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cv.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div className="tp">
      <div className="tp-map">
        <canvas ref={canvas} aria-label="Real Earth imagery streaming in as a level-of-detail tile pyramid" />
        <div className="tp-geo">30°W – 60°E · 65°N – 25°S</div>
      </div>
      <div className="tp-side">
        <div ref={rows} className="tp-rows">
          {Array.from({ length: LEVELS }, (_, l) => (
            <div key={l} className="tp-row">
              <canvas className="tp-sw" width={44} height={44} />
              <div className="tp-meta">
                <div className="tp-l">
                  <b>Level {l}</b>
                  <span>{BASE_PX * 2 ** l} px across · {(10000 / (BASE_PX * 2 ** l)).toFixed(0)} km a pixel</span>
                </div>
                <div className="tp-track"><i className="tp-fill" /></div>
              </div>
              <div className="tp-n">0 of {4 ** l}</div>
            </div>
          ))}
        </div>
        <div ref={stats} className="tp-stats" />
        <div className="tp-hint">Move over the map to look somewhere else</div>
      </div>
    </div>
  );
};
