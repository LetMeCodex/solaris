/**
 * The Solaris mark: a Sun inside two orbits, a world on each (one solid, one ringed), and a
 * star beside the Sun. Drawn on a 100-unit square; the worlds go round their orbits and the star
 * twinkles. Shared by the header logo (SVG) and the animated tab icon (canvas).
 */

export const INK = '#dcab76';
export const NIGHT = '#0e0e0f';

export const OUTER = { cx: 50, cy: 50, r: 45.7 };
export const INNER = { cx: 52.6, cy: 49.4, r: 33.9 };
export const STROKE = 1.6;
export const SUN = { cx: 44.6, cy: 50, r: 17.4 };
export const STAR = { cx: 74.5, cy: 50, R: 7.1, r: 2.3 };

/** The solid world on the outer orbit, and the ringed one on the inner. Angles in degrees, y down. */
export const WORLD_OUT = { start: -138, r: 5, period: 26 };
export const WORLD_IN = { start: 75.6, r: 4.9, stroke: 1.5, period: 15 };
/** The orbit breaks this far around each world. */
export const GAP = 2.4;
export const TWINKLE = 3.2;

const rad = (d: number) => (d * Math.PI) / 180;

/** An orbit with a break around the world at angle `at`, as an SVG path. */
export function orbitPath(o: { cx: number; cy: number; r: number }, at: number, worldR: number): string {
  const g = Math.asin(Math.min(0.9, (worldR + GAP) / o.r)) * (180 / Math.PI);
  const p = (d: number) => `${(o.cx + o.r * Math.cos(rad(d))).toFixed(3)} ${(o.cy + o.r * Math.sin(rad(d))).toFixed(3)}`;
  return `M ${p(at + g)} A ${o.r} ${o.r} 0 1 1 ${p(at - g + 360)}`;
}

export function worldAt(o: { cx: number; cy: number; r: number }, at: number): { x: number; y: number } {
  return { x: o.cx + o.r * Math.cos(rad(at)), y: o.cy + o.r * Math.sin(rad(at)) };
}

/** The eight-pointed star as an SVG polygon. */
export function starPoints(s = STAR): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = rad(-90 + i * 22.5);
    const r = i % 2 ? s.r : i % 4 === 0 ? s.R : s.R * 0.62;
    pts.push(`${(s.cx + r * Math.cos(a)).toFixed(3)},${(s.cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(' ');
}

/** Draw the mark at time t (seconds) into a square canvas context of the given size. */
export function drawMark(ctx: CanvasRenderingContext2D, size: number, t: number, tile = true): void {
  const k = size / 100;
  ctx.save();
  ctx.clearRect(0, 0, size, size);
  ctx.scale(k, k);
  if (tile) {
    ctx.fillStyle = NIGHT;
    ctx.beginPath();
    ctx.roundRect(0, 0, 100, 100, 22);
    ctx.fill();
    // A little room inside the tile, as on the printed mark (less when tiny, to stay legible)
    const pad = size < 40 ? 4 : 13;
    ctx.translate(pad, pad);
    ctx.scale((100 - 2 * pad) / 100, (100 - 2 * pad) / 100);
  }
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineCap = 'round';

  const orbit = (o: typeof OUTER, at: number, worldR: number, width: number) => {
    const g = Math.asin(Math.min(0.9, (worldR + GAP) / o.r));
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(o.cx, o.cy, o.r, rad(at) + g, rad(at) - g + Math.PI * 2);
    ctx.stroke();
  };

  // Thicker lines when tiny, so the orbits survive at 16 px
  const w = size < 40 ? STROKE * 2.6 : STROKE;
  const aOut = WORLD_OUT.start - (t / WORLD_OUT.period) * 360;
  const aIn = WORLD_IN.start - (t / WORLD_IN.period) * 360;
  const outR = size < 40 ? WORLD_OUT.r * 1.5 : WORLD_OUT.r;
  const inR = size < 40 ? WORLD_IN.r * 1.4 : WORLD_IN.r;
  orbit(OUTER, aOut, outR, w);
  orbit(INNER, aIn, inR, w);

  ctx.beginPath();
  ctx.arc(SUN.cx, SUN.cy, SUN.r, 0, Math.PI * 2);
  ctx.fill();

  const p = worldAt(OUTER, aOut);
  ctx.beginPath();
  ctx.arc(p.x, p.y, outR, 0, Math.PI * 2);
  ctx.fill();

  const q = worldAt(INNER, aIn);
  ctx.lineWidth = size < 40 ? WORLD_IN.stroke * 2.4 : WORLD_IN.stroke;
  ctx.beginPath();
  ctx.arc(q.x, q.y, inR - ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.stroke();

  // The star breathes and turns a little
  const tw = 0.5 + 0.5 * Math.sin((t / TWINKLE) * Math.PI * 2);
  ctx.save();
  ctx.translate(STAR.cx, STAR.cy);
  ctx.rotate(rad(tw * 22.5));
  const s = (size < 40 ? 1.35 : 1) * (0.78 + 0.3 * tw);
  ctx.scale(s, s);
  ctx.translate(-STAR.cx, -STAR.cy);
  ctx.beginPath();
  starPoints()
    .split(' ')
    .forEach((pt, i) => {
      const [x, y] = pt.split(',').map(Number);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * Turn the tab icon into the moving mark (browsers only animate SVG icons in Firefox, so the
 * frames are drawn here). A few frames a second is plenty for something 16 px across; it stops
 * for people who prefer less motion.
 */
export function startAnimatedFavicon(): () => void {
  if (typeof document === 'undefined') return () => {};
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof ctx.roundRect !== 'function') return () => {};

  // One icon link we own; the static ones stay for browsers that ignore the swap
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-live]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.dataset.live = '';
    document.head.appendChild(link);
  }
  const t0 = performance.now();
  const frame = () => {
    drawMark(ctx, size, (performance.now() - t0) / 1000);
    link!.href = canvas.toDataURL('image/png');
  };
  frame();
  const id = window.setInterval(frame, 125);
  return () => window.clearInterval(id);
}
