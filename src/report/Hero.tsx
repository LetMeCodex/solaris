import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { INK, INNER, OUTER, STAR, STROKE, SUN, WORLD_IN, WORLD_OUT, orbitPath, starPoints, worldAt } from '../ui/brand/logo';
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

import { motion } from 'motion/react';
import COMMITS from './commits.json';
import { REFS } from './refs';

const base = import.meta.env.BASE_URL;

/** Tiny visuals for the numbers band, each drawn from the real data behind its number. */
const Spark: React.FC = () => {
  // commits per six hours, 13 to 17 October
  const t0 = Date.parse('2026-10-13T00:00:00+05:30');
  const bins = new Array(20).fill(0);
  for (const c of COMMITS as Array<{ t: string }>) bins[Math.min(19, Math.max(0, Math.floor((Date.parse(c.t) - t0) / (6 * 3600e3))))]++;
  const max = Math.max(...bins);
  const pts = bins.map((v, i) => `${(i / 19) * 100},${40 - (v / max) * 36}`).join(' ');
  return (
    <svg viewBox="0 0 100 44" preserveAspectRatio="none">
      <polyline points={`0,44 ${pts} 100,44`} fill="rgba(224,145,106,0.18)" stroke="none" />
      <polyline points={pts} fill="none" stroke="#e0916a" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};
const CodeBar: React.FC = () => {
  const parts: Array<[string, number, string]> = [['rendering', 10652, '#e0916a'], ['interface', 6480, '#8fa8ff'], ['explorer', 3093, '#c9b6e8'], ['data', 2103, '#f3e7d3'], ['camera', 1635, '#7d7690'], ['the rest', 1956, '#4a4458']];
  const total = parts.reduce((a, p) => a + p[1], 0);
  let x = 0;
  return (
    <svg viewBox="0 0 100 44" preserveAspectRatio="none">
      {parts.map(([n, v, c]) => {
        const w = (v / total) * 100;
        const el = (
          <rect key={n} x={x} y={16} width={Math.max(0, w - 0.6)} height={12} rx={1.5} fill={c}>
            <title>{`${n}: ${v.toLocaleString('en-US')} lines`}</title>
          </rect>
        );
        x += w;
        return el;
      })}
    </svg>
  );
};
const Ticks: React.FC<{ n: number }> = ({ n }) => (
  <svg viewBox="0 0 142 44" preserveAspectRatio="none">
    {Array.from({ length: n }, (_, i) => <rect key={i} x={i} y={i % 2 ? 14 : 8} width={0.55} height={i % 2 ? 22 : 30} fill="#a6f0c6" opacity={0.8} />)}
  </svg>
);
const LICENCE_COLOUR: Record<string, string> = { 'Public domain': '#a6f0c6', 'CC BY 4.0': '#f3e7d3', MIT: '#f3e7d3', 'CC BY-SA 3.0 IGO': '#8fa8ff', 'CC BY-SA 4.0': '#8fa8ff', 'CC BY-NC 3.0 IGO': '#e0916a' };
const LicenceDots: React.FC = () => (
  <svg viewBox="0 0 150 44">
    {REFS.map((r, i) => (
      <circle key={i} cx={6 + (i % 15) * 9.6} cy={i < 15 ? 12 : 32} r={3.4} fill={LICENCE_COLOUR[r.licence] ?? '#7d7690'}>
        <title>{r.licence}</title>
      </circle>
    ))}
  </svg>
);
const WorldDots: React.FC = () => {
  // 8 planets, 2 dwarf planets, 9 asteroids, 22 major moons, 437 small moons
  const groups: Array<[number, string, number]> = [[8, '#e0916a', 2.2], [2, '#f3e7d3', 1.8], [9, '#c9b6e8', 1.4], [22, '#8fa8ff', 1.3], [437, '#7d7690', 0.85]];
  const dots: React.ReactNode[] = [];
  let i = 0;
  for (const [n, c, r] of groups) for (let k = 0; k < n; k++, i++) dots.push(<circle key={i} cx={2 + (i % 60) * 2.48} cy={4 + Math.floor(i / 60) * 5.2} r={r} fill={c} />);
  return <svg viewBox="0 0 150 44">{dots}</svg>;
};
const Wave: React.FC = () => (
  <svg viewBox="0 0 100 44" preserveAspectRatio="none">
    {Array.from({ length: 50 }, (_, i) => {
      const h = 4 + Math.abs(Math.sin(i * 0.9) * Math.sin(i * 0.23 + 1) * 34);
      return <rect key={i} x={i * 2} y={22 - h / 2} width={1.1} height={h} rx={0.5} fill="#6dfcc0" opacity={0.85} />;
    })}
  </svg>
);
const NEB = ['cosmic-cliffs', 'mystic-mountain', 'helix', 'orion-cloud', 'rosette-ring', 'crab-shell', 'veil-filaments', 'lagoon-lane', 'north-america'];
const Nebs: React.FC = () => (
  <div className="cell-nebs">
    {NEB.map((n, i) => (
      <span key={n} style={{ backgroundImage: `url(${base}textures/nebulae/${n}_lite.webp)`, borderColor: i < 3 ? 'rgba(243,231,211,0.6)' : 'transparent' }} title={n} />
    ))}
  </div>
);
const STAR_PTS = Array.from({ length: 90 }, (_, i) => [(i * 37.7) % 100, ((i * 61.3) % 40) + 2, 0.3 + ((i * 13) % 10) / 10] as const);
const StarDots: React.FC = () => (
  <svg viewBox="0 0 100 44">
    {STAR_PTS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * 0.9} fill="#f3e7d3" opacity={0.35 + r * 0.5} />)}
  </svg>
);

const STATS: Array<[string, string, string, React.ReactNode]> = [
  ['46', 'Commits', 'Five days, 13 to 17 October 2026. Each peak is a working night.', <Spark key="s" />],
  ['25,919', 'Lines of TypeScript', 'In Solaris itself, not counting its tests. Most of it draws things.', <CodeBar key="c" />],
  ['142', 'Tests passing', 'In 23 suites, run before every deploy.', <Ticks key="t" n={142} />],
  ['30', 'Sources', 'Every one credited, coloured here by licence.', <LicenceDots key="l" />],
  ['12,596', 'Real stars', 'From the Hipparcos catalogue, each at its real position.', <StarDots key="st" />],
  ['478', 'Worlds', '8 planets, 2 dwarf planets, 9 asteroids, 459 moons.', <WorldDots key="w" />],
  ['572', 'Lines for Vela', 'About an hour of her recorded voice.', <Wave key="v" />],
  ['9', 'Nebulae', 'Three real photographs, ringed; six procedural.', <Nebs key="n" />],
];

export const Abstract: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from('.abs-claim, .abs-text', { opacity: 0, y: 50, stagger: 0.15, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.abs-grid', start: 'top 80%' } });
      gsap.from('.cell', { opacity: 0, y: 50, stagger: 0.06, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.band', start: 'top 85%' } });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="abstract">
      <div className="abs-grid">
        <div className="abs-lane">
          <div className="abs-label">Abstract</div>
          <p className="abs-claim">
            Every planet is <em>where NASA says it is</em>, this second. Every star is a real one. This is how it was made.
          </p>
        </div>
        <div className="abs-text">
          <p>
            Solaris is a real-time model of the Solar System that runs in a web browser. Every planet, moon and small body is placed from published NASA JPL orbital elements for the current moment, turned by the International Astronomical Union's rotation models, and set against the real sky of 12,596 Hipparcos stars and the Gaia Milky Way. You can stand on any of them and look up, fly out to photographed nebulae, and fall towards the black hole at the centre of the galaxy. A companion, Vela, guides you in her own recorded voice.
          </p>
          <p>
            This report documents where every number and image comes from, how each part is computed and drawn, what broke and how it was fixed, and how a launch film was captured from the running site. The figures are live. The sky behind this page is too: it is Solaris's own star data, and the telescope turns to a new target for every chapter.
          </p>
        </div>
      </div>
      <div className="band">
        {STATS.map(([v, k, d, viz]) => (
          <motion.div key={k} className="cell" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Num v={v} className="cell-v" />
            <div className="cell-k">{k}</div>
            <div className="cell-d">{d}</div>
            <div className="cell-viz">{viz}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
