import React, { useEffect, useRef, useState } from 'react';
import { ExploredStats, fmtPct } from './explored';

/** Count a number up from where it was to `value` over `ms`. */
function useCountUp(value: number, ms = 1400): number {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      const e = 1 - Math.pow(1 - t, 4);
      const v = a + (value - a) * e;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

const SEEN_KEY = 'solaris.atlas.opened';

/**
 * The way into the catalogue: a living miniature orrery. A warm core, two tilted orbits with
 * worlds running round them, and an outer arc that fills as you explore. "ATLAS" catches the
 * light every few seconds; until the first time it is opened, a slow radar ping calls attention.
 */
export const AtlasLauncher: React.FC<{ stats: ExploredStats; onOpen: () => void }> = ({ stats, onOpen }) => {
  const [fresh, setFresh] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) !== '1';
    } catch {
      return false;
    }
  });
  const r = 14.2;
  const c = 2 * Math.PI * r;
  const frac = Math.min(1, stats.pct / 100);
  const open = () => {
    if (fresh) {
      setFresh(false);
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
    }
    onOpen();
  };
  // An astrolabe: a graduated limb, a turning star-pointer (the rete), the explored arc in gold
  return (
    <button
      type="button"
      className={`atlas-launch ${fresh ? 'is-fresh' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        open();
      }}
      data-tour="catalogue"
      aria-label={`Open the Atlas: ${stats.total} worlds, ${fmtPct(stats.pct)}% explored`}
      title="Atlas · worlds, moons and the Gallery ( / )"
    >
      <span className="atlas-astro" aria-hidden>
        <svg viewBox="0 0 40 40">
          <defs>
            <linearGradient id="atlas-brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0c8" />
              <stop offset="45%" stopColor="#d9a24a" />
              <stop offset="100%" stopColor="#7a5520" />
            </linearGradient>
            <radialGradient id="atlas-glass" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="rgba(255,240,200,0.16)" />
              <stop offset="60%" stopColor="rgba(20,16,10,0.0)" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="18.6" className="atlas-limb" />
          <g className="atlas-ticks">
            {Array.from({ length: 48 }, (_, i) => (
              <line key={i} x1="20" y1="1.9" x2="20" y2={i % 4 === 0 ? 4.4 : 3.2} transform={`rotate(${i * 7.5} 20 20)`} />
            ))}
          </g>
          <circle cx="20" cy="20" r={r} className="atlas-track" />
          <circle cx="20" cy="20" r={r} className="atlas-progress" strokeDasharray={`${c * Math.max(0.015, frac)} ${c}`} transform="rotate(-90 20 20)" />
          <g className="atlas-rete">
            <circle cx="20" cy="20" r="9.2" className="atlas-rete-ring" />
            <ellipse cx="20" cy="22.2" rx="9.2" ry="6.4" className="atlas-rete-ring" />
            <path d="M20 9.6 L21.1 18.9 L30.4 20 L21.1 21.1 L20 30.4 L18.9 21.1 L9.6 20 L18.9 18.9 Z" className="atlas-star" />
            <circle cx="27.6" cy="14.4" r="0.9" className="atlas-pointer" />
            <circle cx="13.1" cy="25.4" r="0.7" className="atlas-pointer" />
          </g>
          <circle cx="20" cy="20" r="1.7" className="atlas-pin" />
          <circle cx="20" cy="20" r="18.6" fill="url(#atlas-glass)" />
        </svg>
        <span className="atlas-glint" />
      </span>
      <span className="atlas-text">
        <span className="atlas-name">Atlas</span>
        <span className="atlas-sub">
          <b>{fmtPct(stats.pct)}%</b> of {stats.total} worlds
        </span>
      </span>
    </button>
  );
};

/**
 * Explored gauge: three concentric orbits (planets, moons, small worlds), each filling with the
 * share you have visited, a slow ring of ticks turning outside them, and the overall percentage
 * counting up in the middle.
 */
export const ExploredGauge: React.FC<{ stats: ExploredStats; size?: number; legend?: boolean }> = ({ stats, size = 168, legend = true }) => {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 120);
    return () => window.clearTimeout(t);
  }, []);
  const pct = useCountUp(armed ? stats.pct : 0, 1600);
  const rings: Array<{ key: string; r: number; part: ExploredStats['parts']['worlds']; cls: string }> = [
    { key: 'worlds', r: 34, part: stats.parts.worlds, cls: 'g-worlds' },
    { key: 'moons', r: 44, part: stats.parts.moons, cls: 'g-moons' },
    { key: 'minor', r: 54, part: stats.parts.minor, cls: 'g-minor' },
  ];
  return (
    <div className="xg" style={{ ['--xg' as string]: `${size}px` }}>
      <div className="xg-dial">
        <svg viewBox="0 0 140 140" aria-hidden>
          <g className="xg-ticks">
            {Array.from({ length: 72 }, (_, i) => (
              <line key={i} x1="70" y1="3" x2="70" y2={i % 6 === 0 ? 9 : 6} transform={`rotate(${i * 5} 70 70)`} />
            ))}
          </g>
          {rings.map(({ key, r, part, cls }, i) => {
            const c = 2 * Math.PI * r;
            const f = armed && part.total ? part.done / part.total : 0;
            const angle = -90 + 360 * f;
            return (
              <g key={key} className={cls}>
                <circle cx="70" cy="70" r={r} className="xg-track" />
                <circle
                  cx="70"
                  cy="70"
                  r={r}
                  className="xg-arc"
                  strokeDasharray={`${c} ${c}`}
                  strokeDashoffset={c * (1 - Math.max(f, f > 0 ? 0.012 : 0))}
                  transform="rotate(-90 70 70)"
                  style={{ transitionDelay: `${200 + i * 160}ms` }}
                />
                {/* The explorer: a dot riding the leading edge */}
                <circle
                  className="xg-head"
                  cx={70 + r * Math.cos((angle * Math.PI) / 180)}
                  cy={70 + r * Math.sin((angle * Math.PI) / 180)}
                  r={f > 0 ? 2.2 : 0}
                  style={{ transitionDelay: `${200 + i * 160}ms` }}
                />
              </g>
            );
          })}
        </svg>
        <div className="xg-core">
          <span className="xg-pct">
            {fmtPct(pct)}
            <small>%</small>
          </span>
          <span className="xg-cap">explored</span>
        </div>
      </div>
      {legend && (
        <ul className="xg-legend">
          {rings.map(({ key, part, cls }) => (
            <li key={key} className={cls}>
              <i />
              <span>{part.label}</span>
              <b>
                {part.done}
                <em>/{part.total}</em>
              </b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
