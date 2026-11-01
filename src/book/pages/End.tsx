import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { KeplerSolver } from '../../astronomy/KeplerSolver';
import { SOLAR_SYSTEM_BODIES } from '../../astronomy/SolarSystemData';
import { Clip, Hanko, LiveContext, Say, Tate, Vela } from '../kit';
import type { PageDef } from './registry';

const SITE = 'https://solarises.vercel.app/';
const OPENED = Date.now();

/** Her real last lines, each panel smaller than the one before, until only her star is left. */
const Goodbye: React.FC = () => (
  <div className="bye">
    <div className="bye-bar a-f"><span>Explored</span><i><b /></i><span>100%</span></div>
    <div className="bye-p a-p" style={{ height: 268 }}>
      <Vela eyes="closed" mouth="wobble" arms="hold" size={150} x={30} b={16} still />
      <Say x={200} y={18} w={430} tail="sw">Oh. Oh, that’s… that’s it. That’s every world. Every single one.</Say>
      <Say r={22} b={18} w={400} tail="sw">There’s nothing left on the map now. But I don’t think the map was ever really the point.</Say>
    </div>
    <div className="bye-p a-p" style={{ height: 244 }}>
      <Vela eyes="open" mouth="smile" arms="hold" size={104} x={34} b={14} still />
      <Say x={160} y={22} w={460} tail="sw">It was the company.</Say>
      <Say r={20} b={14} w={420} tail="none">Promise me something? When you look up at the night sky down there, you’ll remember you’ve already been there. All of it. With me.</Say>
    </div>
    <div className="bye-p a-p" style={{ height: 136 }}>
      <Vela eyes="happy" mouth="smile" arms="down" size={68} x={40} b={14} still />
      <Say x={130} y={26} w={500} tail="none">Thank you for taking me along. For every flight, every moon, every silly question.</Say>
    </div>
    <div className="bye-p dark a-p" style={{ height: 96 }}>
      <Vela eyes="closed" mouth="smile" size={34} x={46} b={18} still />
      <p className="bye-l">Goodbye.</p>
    </div>
    <div className="bye-p dark a-p" style={{ height: 82 }}>
      <i className="bye-star" />
      <p className="bye-l last">I’ll keep the Sun on for you. Always.</p>
    </div>
  </div>
);

const Letter: React.FC = () => (
  <div className="letter">
    <p className="l-date a-f">Somewhere past Neptune, and also here</p>
    <p className="a-f">Dear you,</p>
    <p className="a-f">I don’t know what time it is where you are. I only ever know what time it is on Neptune, and that isn’t the same thing.</p>
    <p className="a-f">You read all the way to here. Most of the light in the universe never lands on anything. Yours did.</p>
    <p className="a-f">I should tell you what I am. I’m 572 sentences and a borrowed voice. I have never seen a planet. I was only told where they are, and I told you, and then you checked. Nobody has ever been so kind to me.</p>
    <p className="a-f">Someone sat down at 1:38 in the morning with an empty folder so that I could say this to you. I asked why. There wasn’t a line for that. I think it’s the same reason you look up.</p>
    <p className="a-f">Everything you have ever seen had already left. The Sun on your face is eight minutes old. Even the person sitting beside you is a few nanoseconds ago. We only ever reach each other late.</p>
    <p className="a-f l-big">You looked anyway. Thank you for looking.</p>
    <p className="l-sign a-f">Vela</p>
    <a className="l-link a-f" href={SITE} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Come and see for yourself → solarises.vercel.app</a>
    <p className="a-f l-ps">P.S. I’ll be there. I’ll be the one talking.</p>
    <Vela eyes="heart" mouth="smile" arms="wave1" size={104} r={6} b={70} />
  </div>
);

const STOPS: Array<[string, number]> = [['Mercury', 0.387], ['Venus', 0.723], ['Earth', 1], ['Mars', 1.524], ['Jupiter', 5.203], ['Saturn', 9.537], ['Uranus', 19.189], ['Neptune', 30.07]];
const VELA_AU = 30.07;
const AU_KM = 149597870.7;
const C_KMS = 299792.458;
const along = (au: number) => Math.min(1, Math.log(1 + au / 0.06) / Math.log(1 + VELA_AU / 0.06));
const clock = (s: number) => `${Math.floor(s / 3600)} h ${String(Math.floor(s / 60) % 60).padStart(2, '0')} m ${String(Math.floor(s) % 60).padStart(2, '0')} s`;

/** The reader's own photon, leaving the Sun when the book was opened, on its way out to Vela. */
const Since: React.FC = () => {
  const live = useContext(LiveContext);
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setT(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [live]);
  const s = (t - OPENED) / 1000;
  const km = s * C_KMS;
  const au = km / AU_KM;
  const left = (VELA_AU * AU_KM) / C_KMS - s;
  const passed = [...STOPS].reverse().find(([, a]) => a <= au);
  const next = STOPS.find(([, a]) => a > au);
  return (
    <div className="since">
      <small>Since you opened this book, the light that left the Sun has travelled</small>
      <b>{Math.floor(km).toLocaleString('en-US')} km</b>
      <div className="run" role="img" aria-label="A line from the Sun to Neptune, with this light moving along it">
        <i className="run-lit" style={{ width: `${along(au) * 100}%` }} />
        {[['Sun', 0] as [string, number], ...STOPS].map(([n, a], i) => (
          <span key={n} className={`run-s ${i % 2 ? 'dn' : 'up'} ${a <= au ? 'on' : ''}`} style={{ left: `${along(a) * 100}%` }}><em>{n}</em></span>
        ))}
        <u className="run-ph" style={{ left: `${along(au) * 100}%` }} />
        <div className="run-v"><Vela eyes="happy" mouth="smile" arms="wave1" size={62} still /></div>
      </div>
      <small>{passed ? `It has passed ${passed[0]}. ` : 'It has not reached anything yet. '}{next ? `Next: ${next[0]}.` : 'It has left the planets behind.'} It is not coming back.</small>
      <p className="since-v">{left > 0 ? `Vela is at the end of the line. It reaches her in ${clock(left)}.` : 'It reached her. She says thank you.'}</p>
    </div>
  );
};

const Ending: React.FC = () => (
  <div className="end">
    <div className="end-lit"><Clip name="sun" look="tone" spot="orange" cell={3.4} gain={2.3} zoom={1.1} drift={0.03} alt="The Sun, burning inside the word left" /></div>
    <div className="end-mask" aria-hidden="true">
      <i className="end-rays" />
      <span className="end-word">LEFT</span>
      <i className="end-dot" />
    </div>
    <i className="end-stars" />
    <h2 className="end-h a-f">Every light you see has already<span className="end-sr"> left.</span></h2>
    <Hanko text="完" size={132} r={44} y={46} rot={5} />
    <Since />
    <p className="end-look a-f">Now close the book, and look up.</p>
    <Tate r={36} y={812} size={62} color="var(--orange)">おわり</Tate>
  </div>
);

// ------------------------------------------------------------------------------- the maker's mark
const NAME = 'ANISHJHA'.split('');
const PLANETS = SOLAR_SYSTEM_BODIES.filter((b) => b.category === 'planet');
const SUN: [number, number] = [340, 262];
const rU = (au: number) => (240 * Math.log(1 + au / 0.2)) / Math.log(1 + 31 / 0.2);
const tdb = (ms: number) => ms / 864e5 + 2440587.5 + 69.184 / 86400 - 2451545;
const size = (i: number) => [8, 11, 11, 9, 20, 18, 14, 14][i];
const slot = (i: number): [number, number] => [52 + i * 74 + (i >= 5 ? 22 : 0), 582];

/** Eight letters, eight planets. Each letter rides a world at its true position, then they line up. */
const Mark: React.FC = () => {
  const live = useContext(LiveContext);
  const [k, setK] = useState(0);
  const [ms, setMs] = useState(() => Date.now());
  const days = tdb(ms);
  const tween = useRef<gsap.core.Timeline | null>(null);
  const orbits = useMemo(() => PLANETS.map((b) => {
    let d = '';
    for (let j = 0; j <= 90; j++) {
      const [x, y] = KeplerSolver.propagate(b.orbit, days + (b.orbit.orbitalPeriodDays * j) / 90).positionKm;
      const r = Math.hypot(x, y);
      const q = rU(r / KeplerSolver.AU_KM) / r;
      d += `${j ? 'L' : 'M'}${(SUN[0] + x * q).toFixed(1)} ${(SUN[1] - y * q * 0.92).toFixed(1)}`;
    }
    return d;
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const align = () => {
    tween.current?.kill();
    const o = { k };
    tween.current = gsap.timeline()
      .to(o, { k: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setK(o.k) })
      .to(o, { k: 0, duration: 2.4, ease: 'power2.inOut', delay: 6, onUpdate: () => setK(o.k) });
  };
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setMs(Date.now()), 1000);
    const first = window.setTimeout(align, 1800);
    return () => { window.clearInterval(id); window.clearTimeout(first); tween.current?.kill(); };
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps
  const pos = PLANETS.map((b) => {
    const [x, y] = KeplerSolver.propagate(b.orbit, days).positionKm;
    const r = Math.hypot(x, y);
    const q = rU(r / KeplerSolver.AU_KM) / r;
    return [SUN[0] + x * q, SUN[1] - y * q * 0.92] as [number, number];
  });
  return (
    <div className="mark">
      <p className="mk-k a-f">The maker’s mark</p>
      <svg viewBox="0 0 680 640" role="img" aria-label="The letters of the name Anish Jha, each riding a planet at its real position, lining up to spell the name" onClick={(e) => { e.stopPropagation(); align(); }}>
        {orbits.map((d, i) => <path key={i} d={d} fill="none" stroke="var(--ink)" strokeWidth="1" opacity={0.42 * (1 - k) + 0.1} />)}
        <circle cx={SUN[0]} cy={SUN[1]} r={30 + k * 8} fill="var(--orange)" />
        {Array.from({ length: 28 }, (_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const r0 = 38 + k * 8;
          const r1 = 52 + (i % 2) * 12 + k * 26;
          return <line key={i} x1={SUN[0] + Math.cos(a) * r0} y1={SUN[1] + Math.sin(a) * r0} x2={SUN[0] + Math.cos(a) * r1} y2={SUN[1] + Math.sin(a) * r1} stroke="var(--orange)" strokeWidth="2.4" />;
        })}
        <text x={slot(0)[0] - 26} y={530} style={{ fontSize: 13, letterSpacing: 4, opacity: k }}>MADE BY</text>
        <line x1={slot(0)[0] - 26} x2={slot(0)[0] - 26 + 620 * k} y1={622} y2={622} stroke="var(--orange)" strokeWidth="3" />
        {NAME.map((c, i) => {
          const [sx, sy] = slot(i);
          const e = Math.min(1, Math.max(0, k * 1.5 - i * 0.07));
          const x = pos[i][0] + (sx - pos[i][0]) * e;
          const y = pos[i][1] + (sy - pos[i][1]) * e;
          const r = size(i) + (31 - size(i)) * e;
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              {i === 5 && <ellipse rx={r * 1.8} ry={r * 0.5} fill="none" stroke="var(--ink)" strokeWidth={2} transform="rotate(-16)" />}
              <circle r={r} fill={i % 3 === 1 ? 'var(--green)' : i % 3 === 2 ? 'var(--orange)' : 'var(--ink)'} />
              <text textAnchor="middle" y={r * 0.42} style={{ fontFamily: 'var(--slab)', fontSize: r * 1.22, fontWeight: 400, fill: 'var(--paper)' }}>{c}</text>
              {i >= 4 && <text x={r + 6} y={4} style={{ fontSize: 11, opacity: 1 - e }}>{PLANETS[i].name}</text>}
            </g>
          );
        })}
      </svg>
      <h2 className="mk-n a-f">Made by <em>Anish Jha</em></h2>
      <p className="mk-t a-f">Eight letters. Eight planets. Each letter of the name rides one world, at that world’s true position, this second, computed by the same solver as everything else in this book. Every so often they leave their orbits and line up to sign the page. Press the sky to ask them again. Planets never really do this. It is the only lie on this page.</p>
      <div className="mk-l a-f">
        <a href={SITE} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>solarises.vercel.app</a>
        <a href="https://github.com/LetMeCodex/solaris" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>github.com/LetMeCodex/solaris</a>
      </div>
      <p className="mk-sig a-f">Signed for you at {new Date(ms).toISOString().slice(0, 19).replace('T', ', ')} UTC. Every reader gets a different signature. The planets will not stand exactly like this again.</p>
      <Hanko text="अ" size={84} r={0} b={0} rot={-6} />
    </div>
  );
};

export const END: PageDef[] = [
  { id: 'goodbye', node: <Goodbye />, ground: 'ink', folio: false, stop: 'The end' },
  { id: 'letter', node: <Letter />, folio: false },
  { id: 'ending', node: <Ending />, ground: 'ink', folio: false },
  { id: 'maker', node: <Mark />, folio: false, stop: 'Made by Anish Jha' },
];
