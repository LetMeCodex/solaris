import React, { useEffect, useRef } from 'react';
import { CONSTELLATION_EDGES } from '../../data/constellations';
import { vela } from '../vela/bus';

/**
 * The whole sky as Solaris ships it: the Gaia all-sky map in galactic coordinates (centre of the
 * Milky Way in the middle), with the 12,596 Hipparcos stars placed on top by rotating their ICRS
 * directions into the galactic frame, and the nine constellation figures. Hover for names.
 */

// ICRS → galactic rotation (IAU 1958 system expressed in ICRS)
const M = [
  [-0.0548755604162154, -0.873437090234885, -0.483835015548713],
  [0.494109427875584, -0.444829629960011, 0.746982244497219],
  [-0.867666149019005, -0.198076373431201, 0.455983776175067],
];

const NAMES: Record<number, string> = {
  32349: 'Sirius', 30438: 'Canopus', 69673: 'Arcturus', 71683: 'Rigil Kentaurus (α Centauri)', 91262: 'Vega', 24608: 'Capella',
  24436: 'Rigel', 37279: 'Procyon', 27989: 'Betelgeuse', 7588: 'Achernar', 68702: 'Hadar', 97649: 'Altair', 21421: 'Aldebaran',
  80763: 'Antares', 65474: 'Spica', 37826: 'Pollux', 113368: 'Fomalhaut', 102098: 'Deneb', 49669: 'Regulus', 11767: 'Polaris',
  60718: 'Acrux', 62434: 'Mimosa', 54061: 'Dubhe', 3179: 'Schedar', 25336: 'Bellatrix', 26727: 'Alnitak', 26311: 'Alnilam', 25930: 'Mintaka',
};

type Row = [number, number, number, number, number, number | null, number | null, unknown, string];

export const StarMap: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    const base = import.meta.env.BASE_URL;
    let pts: Array<{ hip: number; x: number; y: number; m: number; d: number | null; r: number; col: string }> = [];
    const img = new Image();
    img.src = `${base}textures/gaia_sky.webp`;
    const W = 2000;
    const H = 1000;
    c.width = W;
    c.height = H;
    const toXY = (v: [number, number, number]) => {
      const gx = M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2];
      const gy = M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2];
      const gz = M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2];
      const l = Math.atan2(gy, gx);
      const b = Math.asin(Math.max(-1, Math.min(1, gz)));
      // Galactic longitude increases to the left, l = 0 in the middle
      return [W / 2 - (l / Math.PI) * (W / 2), H / 2 - (b / (Math.PI / 2)) * (H / 2)];
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (img.complete && img.naturalWidth) {
        ctx.globalAlpha = 0.9;
        ctx.drawImage(img, 0, 0, W, H);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      for (const p of pts) {
        ctx.fillStyle = p.col;
        ctx.globalAlpha = Math.max(0.2, Math.min(1, 1.2 - p.m * 0.13));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = '#8fa8ff';
      ctx.lineWidth = 1.4;
      const byHip = new Map(pts.map((p) => [p.hip, p]));
      for (const [a, b] of CONSTELLATION_EDGES) {
        const A = byHip.get(a);
        const B = byHip.get(b);
        if (!A || !B || Math.abs(A.x - B.x) > W / 2) continue;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.font = '500 15px Geist Mono';
      ctx.fillStyle = 'rgba(243,231,211,0.85)';
      for (const p of pts) if (NAMES[p.hip] && p.m < 1.4) ctx.fillText(NAMES[p.hip].split(' ')[0], p.x + 7, p.y - 6);
    };
    img.onload = draw;
    fetch(`${base}data/stars.json`)
      .then((r) => r.json())
      .then((d: { stars: Row[] }) => {
        pts = d.stars.map((s) => {
          const [x, y] = toXY([s[1], s[2], s[3]]);
          const bv = s[5] ?? 0.6;
          const col = bv < 0 ? '#bcd3ff' : bv < 0.4 ? '#f4f6ff' : bv < 0.8 ? '#fff1d6' : bv < 1.3 ? '#ffd2a1' : '#ffb27a';
          return { hip: s[0], x, y, m: s[4], d: s[6], r: Math.max(0.7, 3.4 - 0.42 * (s[4] + 1.5)), col };
        });
        draw();
      });

    let last = 0;
    const move = (e: PointerEvent) => {
      if (!pts.length || performance.now() - last < 120) return;
      last = performance.now();
      const rect = c.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      const y = ((e.clientY - rect.top) / rect.height) * H;
      let best: (typeof pts)[number] | null = null;
      let bd = 22 * 22;
      for (const p of pts) {
        if (p.m > 5) continue;
        const d = (p.x - x) ** 2 + (p.y - y) ** 2 - (5 - p.m) * 20;
        if (d < bd) { bd = d; best = p; }
      }
      if (!best) return;
      const name = NAMES[best.hip];
      const dist = best.d ? `${best.d < 100 ? best.d.toFixed(1) : Math.round(best.d)} parsecs away (${Math.round(best.d * 3.2616)} light-years)` : 'too far for Hipparcos to measure well';
      vela.say({
        text: `${name ? `${name}! ` : ''}HIP ${best.hip}: magnitude ${best.m.toFixed(2)}, ${dist}. ${name ? '' : 'One of the 12,596 real stars Solaris places.'}`,
        target: c,
        mood: name ? 'excited' : 'calm',
        priority: 2,
        hold: 2.6,
      });
    };
    c.addEventListener('pointermove', move);
    return () => c.removeEventListener('pointermove', move);
  }, []);
  return <canvas ref={ref} className="media" style={{ aspectRatio: '2 / 1', cursor: 'crosshair' }} aria-label="The whole sky in galactic coordinates with the Hipparcos stars" />;
};
