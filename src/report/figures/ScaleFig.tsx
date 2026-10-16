import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { vela } from '../vela/bus';

/**
 * The Earth and the Moon, drawn to scale, then enlarged the way Solaris enlarges worlds. Scroll
 * through it (or drag) from true size to 30×. Moons are pushed outward with the same formula the
 * site uses so they never end up inside their swollen parent:
 *   distance = scale · min(d, 4R) + max(0, d − 4R)
 */

const W = 1180;
const H = 400;
const KM = 1100 / 1.45e6; // px per km
const R_E = 6371;
const R_M = 1737.4;
const D = 384400;

const moonDistance = (s: number) => s * Math.min(D, 4 * R_E) + Math.max(0, D - 4 * R_E);

export const ScaleFig: React.FC = () => {
  const [s, setS] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const user = useRef(false);
  useGSAP(
    () => {
      const o = { s: 1 };
      gsap.to(o, {
        s: 30,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 20%', scrub: 0.6 },
        onUpdate: () => { if (!user.current) setS(o.s); },
      });
    },
    { scope: ref }
  );
  const ex = 40;
  const ey = H / 2;
  const er = Math.max(0.6, R_E * s * KM);
  const md = moonDistance(s);
  const mx = ex + md * KM;
  const mr = Math.max(0.6, R_M * s * KM);
  const trueEarth = R_E * KM;
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="media" role="img" aria-label="The Earth and Moon from true scale to thirty times">
        <defs>
          <radialGradient id="sf-earth" cx="35%" cy="35%">
            <stop offset="0" stopColor="#9fd2ff" />
            <stop offset="0.6" stopColor="#2c6fd1" />
            <stop offset="1" stopColor="#0b234d" />
          </radialGradient>
          <radialGradient id="sf-moon" cx="35%" cy="35%">
            <stop offset="0" stopColor="#f2efe8" />
            <stop offset="1" stopColor="#6d6a64" />
          </radialGradient>
        </defs>
        {/* the true distance, for reference */}
        <line x1={ex} y1={ey + 120} x2={ex + D * KM} y2={ey + 120} stroke="rgba(243,239,233,0.3)" />
        <line x1={ex + D * KM} y1={ey + 112} x2={ex + D * KM} y2={ey + 128} stroke="rgba(243,239,233,0.3)" />
        <text x={ex + (D * KM) / 2} y={ey + 145} fill="rgba(243,239,233,0.45)" fontFamily="JetBrains Mono" fontSize="12" textAnchor="middle">true distance · 384,400 km</text>
        <line x1={ex} y1={ey + 160} x2={mx} y2={ey + 160} stroke="#dcab76" />
        <text x={ex + (mx - ex) / 2} y={ey + 182} fill="#dcab76" fontFamily="JetBrains Mono" fontSize="12" textAnchor="middle">drawn distance · {Math.round(md).toLocaleString('en-US')} km</text>
        <circle cx={ex} cy={ey} r={er} fill="url(#sf-earth)" onPointerEnter={(e) => vela.say({ text: `Earth, drawn ${s.toFixed(0)} times its real size. At true scale it would be ${(trueEarth * 2).toFixed(1)} pixels wide on this diagram. Space is mostly empty.`, target: e.currentTarget, mood: 'calm', priority: 2 })} />
        <circle cx={mx} cy={ey} r={mr} fill="url(#sf-moon)" />
        {s < 3 && <circle cx={mx} cy={ey} r={9} fill="none" stroke="#6dfcc0" strokeDasharray="2 2" />}
        <text x={mx} y={ey - Math.max(mr, 9) - 12} fill="#f3efe9" fontFamily="Montserrat" fontWeight={300} fontSize="13" letterSpacing="3" textAnchor="middle">MOON</text>
        <text x={W - 24} y={42} fill="#ffd9a6" fontFamily="JetBrains Mono" fontSize="34" textAnchor="end">{s.toFixed(1)}×</text>
        <text x={W - 24} y={64} fill="rgba(243,239,233,0.45)" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2" textAnchor="end">WORLD SCALE · SCROLL OR DRAG</text>
      </svg>
      <div className="ctrl">
        <span>World scale</span>
        <input type="range" min={1} max={30} step={0.1} value={s} onChange={(e) => { user.current = true; setS(Number(e.target.value)); }} aria-label="World scale" />
        <span className="val">{s < 1.05 ? 'true size: two specks' : s > 29.5 ? 'Solaris default: 30×' : `${s.toFixed(1)}× larger`}</span>
      </div>
    </div>
  );
};
