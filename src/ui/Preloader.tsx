import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RollingText } from './HUD/Controls';
import './HUD/hud.css';

/**
 * Opening sequence while textures load and shaders compile.
 *
 * An orrery assembles itself: one orbit per planet draws in as loading advances (Mercury first,
 * Neptune last), each planet placed at today's mean longitude (J2000 elements, good to a few
 * degrees) and sweeping forward at ~10⁷× real time. When everything is ready the orbits fall into
 * the Sun, it flares, and an iris opens onto the live scene.
 */

// Mean longitude at J2000 (deg) and sidereal period (days)
const PLANETS: Array<{ name: string; L0: number; T: number; color: string; size: number }> = [
  { name: 'Mercury', L0: 252.25, T: 87.969, color: '#9a948e', size: 1.6 },
  { name: 'Venus', L0: 181.98, T: 224.701, color: '#e3c58f', size: 2.4 },
  { name: 'Earth', L0: 100.46, T: 365.256, color: '#6aa8ff', size: 2.5 },
  { name: 'Mars', L0: 355.45, T: 686.98, color: '#d0663f', size: 2.0 },
  { name: 'Jupiter', L0: 34.4, T: 4332.59, color: '#d9b48a', size: 4.4 },
  { name: 'Saturn', L0: 49.94, T: 10759.2, color: '#e6d3a1', size: 3.9 },
  { name: 'Uranus', L0: 313.23, T: 30688.5, color: '#9fd8e0', size: 3.1 },
  { name: 'Neptune', L0: 304.88, T: 60182, color: '#5b7fe0', size: 3.0 },
];
const AU = [0.387, 0.723, 1.0, 1.524, 5.203, 9.537, 19.19, 30.07];

export const Preloader: React.FC<{
  progress: number;
  stage: string;
  done: boolean;
  /** The iris is starting to open: mount the HUD now so it powers on with the reveal. */
  onReveal?: () => void;
  /** The user chose how to begin (this click also unlocks audio for Vela's voice). */
  onBegin?: (withVoice: boolean) => void;
  onFinished: () => void;
}> = ({
  progress,
  stage,
  done,
  onReveal,
  onBegin,
  onFinished,
}) => {
  const [begun, setBegun] = useState(false);
  const preferVoice = (() => {
    try {
      return localStorage.getItem('solaris.voice') !== 'off';
    } catch {
      return true;
    }
  })();
  const begin = (withVoice: boolean) => {
    try {
      localStorage.setItem('solaris.voice', withVoice ? 'on' : 'off');
    } catch {
      /* ignore */
    }
    onBegin?.(withVoice);
    setBegun(true);
  };
  const [phase, setPhase] = useState<'loading' | 'collapse' | 'iris' | 'gone'>('loading');
  const shown = useRef(0);
  const [display, setDisplay] = useState(0);
  const mountedAt = useRef(performance.now());
  const planetRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Today's mean longitudes
  const days = useMemo(() => (Date.now() - Date.UTC(2000, 0, 1, 12)) / 86400000, []);

  // Ease the displayed percentage towards the real one
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      shown.current += (progress - shown.current) * 0.08;
      setDisplay(shown.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // Planets sweep around at accelerated time
  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      const simDays = days + ((t - mountedAt.current) / 1000) * 115; // ~4 months per second
      PLANETS.forEach((p, i) => {
        const el = planetRefs.current[i];
        if (!el) return;
        const L = ((p.L0 + (360 / p.T) * simDays) * Math.PI) / 180;
        const r = radius(i);
        el.setAttribute('cx', String(200 + Math.cos(L) * r));
        el.setAttribute('cy', String(200 - Math.sin(L) * r));
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [days]);

  // Exit choreography: hold at least 2.4 s so the sequence reads, then collapse → iris → gone.
  // Depends on `done` only: re-running on each phase change would cancel the remaining steps.
  // The iris is driven frame by frame (no animated CSS custom property), so the overlay stays fully
  // opaque until the hole opens and the scene can never flash through early.
  const finishedRef = useRef(onFinished);
  finishedRef.current = onFinished;
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!done || !begun) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait = 0;
    let raf = 0;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase('collapse'), wait + 350));
    timers.push(
      window.setTimeout(() => {
        setPhase('iris');
        revealRef.current?.();
        const el = rootRef.current;
        const start = performance.now();
        const dur = reduce ? 350 : 1500;
        const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 120;
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
          const r = e * maxR;
          if (el) {
            const m = `radial-gradient(circle at 50% 50%, transparent ${r.toFixed(1)}px, #000 ${(r + 90).toFixed(1)}px)`;
            el.style.webkitMaskImage = m;
            el.style.maskImage = m;
          }
          if (p < 1) {
            raf = requestAnimationFrame(step);
          } else if (!finished) {
            finished = true;
            setPhase('gone');
            finishedRef.current();
          }
        };
        // Safety net: if animation frames are throttled (background tab, hidden view), finish anyway
        let finished = false;
        timers.push(window.setTimeout(() => step(start + dur), dur + 1200));
        // First frame: hole of radius 0 — fully covered, no flash
        if (el) {
          const m0 = 'radial-gradient(circle at 50% 50%, transparent 0px, #000 0px)';
          el.style.webkitMaskImage = m0;
          el.style.maskImage = m0;
        }
        raf = requestAnimationFrame(step);
      }, wait + (reduce ? 400 : 1250))
    );
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [done, begun]);

  if (phase === 'gone') return null;
  const pct = Math.round(Math.min(1, display) * 100);

  return (
    <div ref={rootRef} className={`sol-preloader ${phase}`} role="status" aria-live="polite" aria-label={`Loading Solaris, ${pct} percent`}>
      <div className="sol-pre-stars" />
      <div className="sol-pre-stage">
        <svg viewBox="0 0 400 400" className="sol-orrery" aria-hidden>
          <defs>
            <radialGradient id="pre-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff6dc" />
              <stop offset="35%" stopColor="#ffcf7a" />
              <stop offset="100%" stopColor="#ff8a2a" stopOpacity="0" />
            </radialGradient>
          </defs>
          {PLANETS.map((p, i) => {
            const r = radius(i);
            const lit = progress >= (i + 1) / (PLANETS.length + 1);
            const c = 2 * Math.PI * r;
            return (
              <g key={p.name} className={`orbit ${lit ? 'lit' : ''}`} style={{ ['--i' as string]: i }}>
                <circle cx="200" cy="200" r={r} fill="none" strokeDasharray={c} strokeDashoffset={lit ? 0 : c} />
                <circle ref={(el) => (planetRefs.current[i] = el)} r={p.size} fill={p.color} className="planet" cx="200" cy="200" />
              </g>
            );
          })}
          <circle cx="200" cy="200" r="34" fill="url(#pre-sun)" className="sun-glow" />
          <circle cx="200" cy="200" r="7" fill="#fff3cf" className="sun-core" />
        </svg>

        <div className="sol-pre-text">
          <h1 className="text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight animate-solaris-shimmer pl-[0.52em]">SOLARIS</h1>
          <div className="hud-rule w-40 mx-auto my-3" style={{ transform: `scaleX(${Math.max(0.02, display)})`, animation: 'none' }} />
          {done && !begun ? (
            <div className="flex flex-col items-center gap-3 hud-rise">
              <div className="flex flex-wrap justify-center gap-2">
                <button autoFocus={preferVoice} onClick={() => begin(true)} className="sol-begin primary">
                  <span className="sol-begin-orb" aria-hidden /> Begin with Vela&apos;s voice
                </button>
                <button autoFocus={!preferVoice} onClick={() => begin(false)} className="sol-begin">
                  Begin in silence
                </button>
              </div>
              <span className="hud-label !text-[8px]">Vela is your companion: she speaks, and answers when you ask</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <RollingText text={String(pct).padStart(3, '0')} className="hud-num text-[13px] text-[color:var(--sol-amber)]" />
              <span className="hud-label">{stage}</span>
            </div>
          )}
          <p className="sol-pre-caption">Planets shown at today&apos;s positions · real NASA / JPL data</p>
        </div>
      </div>
      <div className="sol-pre-flash" />
    </div>
  );
};

function radius(i: number): number {
  // Log-compressed so Mercury and Neptune share the frame
  return 46 + (Math.log10(1 + AU[i] / 0.25) / Math.log10(1 + 30.07 / 0.25)) * 140;
}

export default Preloader;
