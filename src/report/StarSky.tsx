import React, { useEffect, useRef } from 'react';

/**
 * The real sky: the 12,596 Hipparcos stars Solaris ships, drawn as seen from the Sun, turning
 * slowly. Size from magnitude, colour from B−V. Drawn only while on screen.
 */

type Star = [number, number, number, number, number, number | null, number | null, unknown, string];

function bvColour(bv: number | null): [number, number, number] {
  const b = Math.max(-0.4, Math.min(2, bv ?? 0.6));
  // A compact black-body-ish ramp: blue-white through white to orange-red
  if (b < 0) return [170 + 85 * (b + 0.4) / 0.4, 195 + 50 * (b + 0.4) / 0.4, 255];
  if (b < 0.6) return [255, 255 - 30 * (b / 0.6), 255 - 80 * (b / 0.6)];
  if (b < 1.2) return [255, 225 - 55 * ((b - 0.6) / 0.6), 175 - 75 * ((b - 0.6) / 0.6)];
  return [255, 170 - 50 * Math.min(1, (b - 1.2) / 0.8), 100 - 40 * Math.min(1, (b - 1.2) / 0.8)];
}

export const StarSky: React.FC<{ className?: string; speed?: number; fov?: number }> = ({ className, speed = 0.012, fov = 70 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let stars: Array<{ v: [number, number, number]; r: number; a: number; c: string }> = [];
    let raf = 0;
    let visible = true;
    let alive = true;
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/stars.json`)
      .then((r) => r.json())
      .then((d: { stars: Star[] }) => {
        if (!alive) return;
        stars = d.stars
          .filter((s) => s[4] < 7.2)
          .map((s) => {
            const m = s[4];
            const [r, g, b] = bvColour(s[5]);
            return {
              v: [s[1], s[2], s[3]] as [number, number, number],
              r: Math.max(0.45, 2.7 - 0.36 * (m + 1.5)),
              a: Math.max(0.12, Math.min(1, 1.15 - m * 0.13)),
              c: `rgb(${r | 0},${g | 0},${b | 0})`,
            };
          })
          .sort((a, b) => a.r - b.r);
      });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const t0 = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || !stars.length) return;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = w / Math.max(1, canvas.clientWidth);
      ctx.clearRect(0, 0, w, h);
      const t = (performance.now() - t0) / 1000;
      // Looking towards the galactic centre region, turning slowly about the celestial pole
      const yaw = 4.6 + t * speed;
      const pitch = -0.35;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const f = (h / 2) / Math.tan(((fov / 2) * Math.PI) / 180);
      ctx.globalCompositeOperation = 'lighter';
      for (const s of stars) {
        const [x, y, z] = s.v;
        // rotate about z (yaw), then about x (pitch); camera looks along +x'
        const x1 = x * cy + y * sy;
        const y1 = -x * sy + y * cy;
        const z1 = z;
        const x2 = x1 * cp - z1 * sp;
        const z2 = x1 * sp + z1 * cp;
        if (x2 <= 0.05) continue;
        const px = w / 2 + (y1 / x2) * f;
        const py = h / 2 - (z2 / x2) * f;
        if (px < -4 || py < -4 || px > w + 4 || py > h + 4) continue;
        const tw = 0.82 + 0.18 * Math.sin(t * 2.3 + px * 0.013 + py * 0.007);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.c;
        const r = s.r * dpr;
        if (r < 1.2) ctx.fillRect(px - r / 2, py - r / 2, r, r);
        else {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
          if (r > 2.2) {
            ctx.globalAlpha = s.a * 0.12 * tw;
            ctx.beginPath();
            ctx.arc(px, py, r * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [speed, fov]);
  return <canvas ref={ref} className={className} aria-hidden />;
};
