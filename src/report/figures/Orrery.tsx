import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeplerSolver } from '../../astronomy/KeplerSolver';
import { SOLAR_SYSTEM_BODIES } from '../../astronomy/SolarSystemData';
import { vela } from '../vela/bus';

/**
 * A live orrery running Solaris's own Kepler solver on the JPL elements: top-down on the ecliptic,
 * distances on a log scale so Mercury and Neptune fit together. Scrub through 1800–2050 (the range
 * the elements are valid for) or let time run.
 */

const PLANETS = SOLAR_SYSTEM_BODIES.filter((b) => b.category === 'planet');
const DAY_MS = 86400000;
const tdbDays = (utcMs: number) => utcMs / DAY_MS + 2440587.5 + 69.184 / 86400 - 2451545.0;

const W = 1180;
const H = 640;
const CX = W / 2;
const CY = H / 2;
const RMAX = 300;
const rPx = (au: number) => (RMAX * Math.log(1 + au / 0.18)) / Math.log(1 + 31 / 0.18);

function pos(b: (typeof PLANETS)[number], days: number) {
  const s = KeplerSolver.propagate(b.orbit, days);
  const [x, y] = s.positionKm;
  const au = Math.hypot(x, y) / KeplerSolver.AU_KM;
  const k = rPx(au) / Math.max(1e-9, Math.hypot(x, y));
  return { x: CX + x * k, y: CY - y * k, au, speed: s.speedKmPerSec, dist: s.distanceKm };
}

const SPEEDS: Array<[string, number]> = [['Pause', 0], ['1 day / s', 1], ['1 month / s', 30.44], ['1 year / s', 365.25]];

export const Orrery: React.FC = () => {
  const [offset, setOffset] = useState(0); // days from now
  const [speed, setSpeed] = useState(30.44);
  const now = useRef(Date.now());
  const svg = useRef<SVGSVGElement>(null);
  const visible = useRef(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; });
    if (svg.current) io.observe(svg.current);
    let raf = 0;
    let last = performance.now();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = performance.now();
      const dt = (t - last) / 1000;
      last = t;
      if (!visible.current || !speed) return;
      setOffset((o) => {
        const next = o + speed * dt;
        const ms = now.current + next * DAY_MS;
        // Keep within the elements' validity, 1800–2050
        if (ms > Date.UTC(2050, 0, 1)) return (Date.UTC(1800, 0, 1) - now.current) / DAY_MS;
        return next;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [speed]);

  const days = tdbDays(now.current + offset * DAY_MS);
  const date = new Date(now.current + offset * DAY_MS);

  // Orbits: sampled once per element set (they drift too slowly to matter here)
  const paths = useMemo(
    () =>
      PLANETS.map((b) => {
        const n = 220;
        const P = b.orbit.orbitalPeriodDays;
        let d = '';
        for (let i = 0; i <= n; i++) {
          const p = pos(b, days + (P * i) / n);
          d += `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        }
        return d;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Math.round(days / 3650)]
  );

  const explain = (b: (typeof PLANETS)[number], el: Element) => {
    const p = pos(b, days);
    const lt = p.dist / 299792.458;
    const m = Math.floor(lt / 60);
    const s = Math.round(lt % 60);
    vela.say({
      text: `${b.name}, on ${date.toISOString().slice(0, 10)}: ${p.au.toFixed(3)} AU from the Sun, moving at ${p.speed.toFixed(1)} km/s. Sunlight takes ${m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min ${s} s`} to reach it. Computed just now, from NASA's elements.`,
      target: el,
      mood: 'excited',
      priority: 2,
    });
  };

  const years = (date.getUTCFullYear() + date.getUTCMonth() / 12).toFixed(2);

  return (
    <div className="orrery">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="media" role="img" aria-label="Live orrery of the eight planets">
        <defs>
          <radialGradient id="or-sun">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset="0.35" stopColor="#ffc867" />
            <stop offset="1" stopColor="#ff7b1c" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[0.5, 1, 2, 5, 10, 20, 30].map((au) => (
          <g key={au}>
            <circle cx={CX} cy={CY} r={rPx(au)} fill="none" stroke="rgba(243,239,233,0.05)" strokeDasharray="2 6" />
            <text x={CX + rPx(au) + 4} y={CY - 4} fill="rgba(243,239,233,0.28)" fontFamily="JetBrains Mono" fontSize="10">{au} AU</text>
          </g>
        ))}
        {/* The direction of the vernal equinox, the zero of ecliptic longitude */}
        <line x1={CX} y1={CY} x2={CX + RMAX + 30} y2={CY} stroke="rgba(109,252,192,0.25)" strokeDasharray="4 4" />
        <text x={CX + RMAX + 34} y={CY + 4} fill="rgba(109,252,192,0.6)" fontFamily="JetBrains Mono" fontSize="11">♈ equinox</text>
        {paths.map((d, i) => (
          <path key={PLANETS[i].name} d={d} fill="none" stroke={PLANETS[i].physical.colorHex} strokeOpacity={0.35} strokeWidth={1} />
        ))}
        <circle cx={CX} cy={CY} r={26} fill="url(#or-sun)" />
        <circle cx={CX} cy={CY} r={5} fill="#fff6dc" />
        {PLANETS.map((b, i) => {
          const p = pos(b, days);
          const below = i % 2 === 1;
          return (
            <g key={b.name} className="or-planet" onPointerEnter={(e) => explain(b, e.currentTarget)} onClick={(e) => explain(b, e.currentTarget)}>
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={b.name === 'Jupiter' || b.name === 'Saturn' ? 6.5 : 4.5} fill={b.physical.colorHex} stroke="#000" strokeWidth={1} />
              {b.name === 'Saturn' && <ellipse cx={p.x} cy={p.y} rx={11} ry={3.5} fill="none" stroke={b.physical.colorHex} strokeOpacity={0.8} />}
              <text x={p.x + 10} y={below ? p.y + 18 : p.y - 9} fill="#f3efe9" fontFamily="Montserrat" fontWeight={300} fontSize="11" letterSpacing="2">{b.name.toUpperCase()}</text>
            </g>
          );
        })}
        <text x={30} y={40} fill="#ffd9a6" fontFamily="JetBrains Mono" fontSize="22">{date.toISOString().slice(0, 10)}</text>
        <text x={30} y={62} fill="rgba(243,239,233,0.45)" fontFamily="JetBrains Mono" fontSize="11" letterSpacing="2">TDB DAY {days.toFixed(2)} SINCE J2000 · YEAR {years}</text>
        <text x={30} y={H - 26} fill="rgba(243,239,233,0.35)" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">TOP-DOWN ON THE ECLIPTIC · LOG DISTANCE SCALE · HOVER A PLANET</text>
      </svg>
      <div className="ctrl">
        {SPEEDS.map(([l, v]) => (
          <button key={l} type="button" className={speed === v ? 'on' : ''} onClick={() => setSpeed(v)}>{l}</button>
        ))}
        <input
          type="range"
          min={(Date.UTC(1800, 0, 1) - now.current) / DAY_MS}
          max={(Date.UTC(2050, 0, 1) - now.current) / DAY_MS}
          value={offset}
          onChange={(e) => { setSpeed(0); setOffset(Number(e.target.value)); }}
          aria-label="Date"
        />
        <button type="button" onClick={() => { setOffset(0); }}>Now</button>
      </div>
    </div>
  );
};
