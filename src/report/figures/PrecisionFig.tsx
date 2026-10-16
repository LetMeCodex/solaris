import React, { useEffect, useRef, useState } from 'react';

/**
 * Why a floating origin: a little moon circles 2,000 km from a planet out at Neptune's distance.
 * Left, positions are stored the naive way, as 32-bit floats measured from the Sun, so they snap to
 * a grid hundreds of kilometres wide. Right, they are measured from the camera, and it is smooth.
 */

const DIST = 4.5e9; // km, about Neptune
const ORBIT = 2000; // km

export const PrecisionFig: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    // The spacing between adjacent float32 values near DIST
    const f = Math.fround(DIST);
    const buf = new Float32Array([f]);
    const u = new Uint32Array(buf.buffer);
    u[0] += 1;
    setStep(buf[0] - f);

    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    const trail: Array<[number, number, number, number]> = [];
    const t0 = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const w = (c.width = c.clientWidth * 2);
      const h = (c.height = c.clientHeight * 2);
      const t = (performance.now() - t0) / 1000;
      const a = t * 0.9;
      const ox = ORBIT * Math.cos(a);
      const oy = ORBIT * Math.sin(a);
      // Naive: absolute positions in float32, then subtract (what the GPU would do)
      const nx = Math.fround(Math.fround(DIST + ox) - Math.fround(DIST));
      const ny = Math.fround(Math.fround(DIST + oy) - Math.fround(DIST));
      trail.push([nx, ny, ox, oy]);
      if (trail.length > 240) trail.shift();
      ctx.clearRect(0, 0, w, h);
      const half = w / 2;
      const scale = (h * 0.36) / ORBIT;
      const panel = (x0: number, idx: 0 | 2, label: string, colour: string) => {
        const cx = x0 + half / 2;
        const cy = h / 2;
        ctx.strokeStyle = 'rgba(243,239,233,0.08)';
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(cx, cy, ORBIT * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#7fb6ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colour;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        trail.forEach((p, i) => {
          const x = cx + p[idx] * scale;
          const y = cy - p[idx + 1] * scale;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        });
        ctx.stroke();
        const p = trail[trail.length - 1];
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + p[idx] * scale, cy - p[idx + 1] * scale, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colour;
        ctx.font = '500 22px JetBrains Mono';
        ctx.fillText(label, x0 + 30, 50);
      };
      panel(0, 0, 'MEASURED FROM THE SUN (float32)', '#ff8a6a');
      panel(half, 2, 'MEASURED FROM THE CAMERA', '#6dfcc0');
      ctx.fillStyle = 'rgba(243,239,233,0.12)';
      ctx.fillRect(half - 1, 30, 2, h - 60);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return (
    <div>
      <canvas ref={ref} style={{ width: '100%', height: 380, display: 'block' }} aria-label="A moon's orbit jittering in float32, and smooth with a floating origin" />
      <div className="ctrl">
        <span>At 4.5 billion km, the gap between neighbouring float32 numbers is</span>
        <span className="val">{step.toLocaleString('en-US')} km</span>
      </div>
    </div>
  );
};
