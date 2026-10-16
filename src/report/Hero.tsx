import React, { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { INK, INNER, OUTER, STAR, STROKE, SUN, WORLD_IN, WORLD_OUT, orbitPath, starPoints, worldAt } from '../ui/brand/logo';
import { StarSky } from './StarSky';
import { Num } from './kit';

/** The Solaris mark, drawn in: orbits trace themselves, the Sun swells, worlds drop on, the star flares. */
export const LiveMark: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const ref = useRef<SVGSVGElement>(null);
  const p = worldAt(OUTER, WORLD_OUT.start);
  const q = worldAt(INNER, WORLD_IN.start);
  useGSAP(
    () => {
      const tl = gsap.timeline({ delay });
      tl.from('.lm-orbit path', { drawSVG: '0%', duration: 1.6, ease: 'power3.inOut', stagger: 0.18 })
        .from('.lm-sun', { scale: 0, transformOrigin: `${SUN.cx}px ${SUN.cy}px`, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, 0.2)
        .from('.lm-glow', { opacity: 0, duration: 1.6 }, 0.4)
        .from('.lm-world', { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.9, ease: 'back.out(3)', stagger: 0.15 }, 1.1)
        .from('.lm-star', { scale: 0, rotate: -180, transformOrigin: `${STAR.cx}px ${STAR.cy}px`, duration: 1, ease: 'back.out(2.5)' }, 1.35)
        .fromTo('.lm-flare', { opacity: 0, scaleX: 0.2 }, { opacity: 1, scaleX: 1, transformOrigin: `${STAR.cx}px ${STAR.cy}px`, duration: 0.35, ease: 'power2.out' }, 1.45)
        .to('.lm-flare', { opacity: 0.12, duration: 1.4, ease: 'power2.out' }, 1.8);
      // Afterwards the worlds travel their orbits for good
      gsap.to('.lm-g-out', { rotate: -360, svgOrigin: `${OUTER.cx} ${OUTER.cy}`, duration: WORLD_OUT.period, repeat: -1, ease: 'none', delay: delay + 2 });
      gsap.to('.lm-g-in', { rotate: -360, svgOrigin: `${INNER.cx} ${INNER.cy}`, duration: WORLD_IN.period, repeat: -1, ease: 'none', delay: delay + 2 });
      gsap.to('.lm-star', { scale: 0.82, rotate: 22.5, svgOrigin: `${STAR.cx} ${STAR.cy}`, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: delay + 2.4 });
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} width={size} height={size} viewBox="-10 -10 120 120" style={{ overflow: 'visible' }} aria-hidden>
      <defs>
        <radialGradient id="lm-glow">
          <stop offset="0.3" stopColor="#ffd9a6" stopOpacity="0.75" />
          <stop offset="0.65" stopColor={INK} stopOpacity="0.2" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </radialGradient>
        <filter id="lm-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle className="lm-glow" cx={SUN.cx} cy={SUN.cy} r={SUN.r * 2.6} fill="url(#lm-glow)" />
      <g filter="url(#lm-bloom)">
        <g className="lm-g-out lm-orbit" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round">
          <path d={orbitPath(OUTER, WORLD_OUT.start, WORLD_OUT.r)} />
          <circle className="lm-world" cx={p.x} cy={p.y} r={WORLD_OUT.r} fill={INK} stroke="none" />
        </g>
        <g className="lm-g-in lm-orbit" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round">
          <path d={orbitPath(INNER, WORLD_IN.start, WORLD_IN.r)} />
          <circle className="lm-world" cx={q.x} cy={q.y} r={WORLD_IN.r - WORLD_IN.stroke / 2} strokeWidth={WORLD_IN.stroke} />
        </g>
        <circle className="lm-sun" cx={SUN.cx} cy={SUN.cy} r={SUN.r} fill={INK} />
        <polygon className="lm-star" points={starPoints()} fill={INK} />
      </g>
      <ellipse className="lm-flare" cx={STAR.cx} cy={STAR.cy} rx={70} ry={0.5} fill="#ffe7c4" filter="url(#lm-bloom)" />
    </svg>
  );
};

export const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const title = SplitText.create('.hero-title', { type: 'chars' });
      const sub = SplitText.create('.hero-sub', { type: 'words' });
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from('.hero-meta > *', { opacity: 0, y: -14, stagger: 0.08, duration: 0.8, ease: 'power3.out' })
        .from(title.chars, { opacity: 0, letterSpacing: '1.4em', filter: 'blur(14px)', stagger: 0.06, duration: 1.4, ease: 'expo.out' }, 1.1)
        .from(sub.words, { opacity: 0, yPercent: 100, stagger: 0.05, duration: 0.9, ease: 'expo.out' }, 1.8)
        .from('.hero-lede, .hero-by, .hero-cue', { opacity: 0, y: 20, stagger: 0.12, duration: 1, ease: 'power3.out' }, 2.3);
      // Leaving the hero: the sky sinks and the mark lifts away
      gsap.to('.hero-inner', { yPercent: -22, opacity: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-sky', { scale: 1.25, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
      return () => { title.revert(); sub.revert(); };
    },
    { scope: ref }
  );
  return (
    <header ref={ref} className="hero">
      <StarSky className="hero-sky" />
      <div className="hero-vignette" />
      <div className="hero-meta">
        <span>SOLARIS · Technical report SOL-TR-01</span>
        <span>17 October 2026</span>
        <a href="../">Open Solaris ↗</a>
      </div>
      <div className="hero-inner">
        <LiveMark size={210} delay={0.4} />
        <h1 className="hero-title">SOLARIS</h1>
        <p className="hero-sub">Putting the real Solar System in a browser</p>
        <p className="hero-lede">
          The data, the physics, the rendering, the companion and the film behind an explorable model of our Solar System, and everything that broke along the way.
        </p>
        <p className="hero-by">LetMeCodex · with Vela, who will be explaining everything</p>
      </div>
      <div className="hero-cue">
        <span>Scroll</span>
        <i />
      </div>
    </header>
  );
};

const STATS: Array<[string, string, string]> = [
  ['46', 'commits', 'in five days, 13–17 October 2026'],
  ['25,919', 'lines of TypeScript', 'not counting the tests'],
  ['142', 'tests passing', 'in 23 suites, run on every push'],
  ['30', 'sources', 'every one credited and licensed'],
  ['12,596', 'real stars', 'from the Hipparcos catalogue'],
  ['478', 'worlds', 'in the Atlas, from the Sun to the smallest moons'],
  ['572', 'lines for Vela', 'about an hour of recorded voice'],
  ['9', 'nebulae', 'three photographed, six procedural'],
];

export const Abstract: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from('.abs-box', { opacity: 0, y: 50, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.abs-box', start: 'top 85%' } });
      gsap.from('.stat', { opacity: 0, y: 40, rotateX: -50, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 85%' } });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="abstract">
      <div className="abs-box">
        <div className="abs-label">Abstract</div>
        <p>
          Solaris is a real-time model of the Solar System that runs in a web browser. Every planet, moon and small body is placed from published NASA JPL orbital elements for the current moment, turned by the International Astronomical Union's rotation models, and set against the real sky of 12,596 Hipparcos stars and the Gaia Milky Way. You can stand on any of them and look up, fly out to photographed nebulae, and fall towards the black hole at the centre of the galaxy. A companion, Vela, guides the visitor in her own recorded voice.
        </p>
        <p>
          This report documents how it was made: where every number and image comes from, how each part is computed and drawn, what went wrong and how it was fixed, and how a launch film was captured from the running site. It is written to be read, and also to be played with. The figures are live, and Vela is waiting on the right to explain anything you hover.
        </p>
      </div>
      <div className="stats">
        {STATS.map(([v, k, d]) => (
          <div key={k} className="stat">
            <Num v={v} className="stat-v" />
            <div className="stat-k">{k}</div>
            <div className="stat-d">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
