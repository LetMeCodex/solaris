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
  const r = 15.5;
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
      title="Atlas · every world and moon ( / )"
    >
      <span className="atlas-orrery" aria-hidden>
        <svg viewBox="0 0 40 40">
          <defs>
            <radialGradient id="atlas-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff6dc" />
              <stop offset="45%" stopColor="#ffc861" />
              <stop offset="100%" stopColor="#ff8a2a" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Explored arc around everything */}
          <circle cx="20" cy="20" r={r} className="atlas-track" />
          <circle
            cx="20"
            cy="20"
            r={r}
            className="atlas-progress"
            strokeDasharray={`${c * Math.max(0.012, frac)} ${c}`}
            transform="rotate(-90 20 20)"
          />
          {/* Tilted orbits with their worlds */}
          <g className="atlas-orbit atlas-orbit-a">
            <ellipse cx="20" cy="20" rx="10.5" ry="4.2" />
            <circle className="atlas-world" r="1.5" />
          </g>
          <g className="atlas-orbit atlas-orbit-b">
            <ellipse cx="20" cy="20" rx="6.8" ry="2.8" />
            <circle className="atlas-world atlas-world-b" r="1.1" />
          </g>
          <circle cx="20" cy="20" r="5.4" fill="url(#atlas-core)" />
          <circle cx="20" cy="20" r="1.9" fill="#fffbe9" />
        </svg>
        {fresh && <span className="atlas-ping" />}
      </span>
      <span className="atlas-text">
        <span className="atlas-name">Atlas</span>
        <span className="atlas-sub">
          <span className="atlas-sub-a">{stats.total} worlds · {fmtPct(stats.pct)}%</span>
          <span className="atlas-sub-b">Open · /</span>
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
