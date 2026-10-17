import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Chapter, Fig, T, VelaNote } from '../kit';
import { vela } from '../vela/bus';
import { REFS, type Ref } from '../refs';
import COMMITS from '../commits.json';

// ---------------------------------------------------------------------------------------------
const Clock: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  // Real time per frame varies; virtual time per frame never does
  const frames = [0.31, 0.42, 0.27, 0.55, 0.38, 0.29, 0.61, 0.33, 0.44, 0.36];
  useGSAP(
    () => {
      gsap.from('.vc-real', { scaleX: 0, transformOrigin: 'left', stagger: 0.08, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      gsap.from('.vc-virt', { scaleX: 0, transformOrigin: 'left', stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.4, scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    },
    { scope: ref }
  );
  let x = 160;
  let v = 160;
  return (
    <svg ref={ref} viewBox="0 0 1180 250" className="media" role="img" aria-label="Real time versus the virtual clock">
      <text x={20} y={78} fill="rgba(243,239,233,0.7)" fontFamily="Geist Mono" fontSize="13">REAL TIME</text>
      <text x={20} y={168} fill="#8fa8ff" fontFamily="Geist Mono" fontSize="13">FILM TIME</text>
      {frames.map((f, i) => {
        const w = f * 160;
        const el = <rect key={`r${i}`} className="vc-real" x={x} y={58} width={w - 4} height={30} rx={4} fill={`rgba(255,138,106,${0.35 + f * 0.6})`} />;
        x += w;
        return el;
      })}
      {frames.map((_, i) => {
        const w = (1 / 30) * 160 * 9;
        const el = (
          <g key={`v${i}`}>
            <rect className="vc-virt" x={v} y={148} width={w - 4} height={30} rx={4} fill="rgba(143,168,255,0.55)" />
            <text x={v + w / 2 - 2} y={168} textAnchor="middle" fill="#0b0b0b" fontFamily="Geist Mono" fontSize="10">1/30 s</text>
          </g>
        );
        v += w;
        return el;
      })}
      <text x={160} y={118} fill="rgba(243,239,233,0.45)" fontFamily="Geist Mono" fontSize="11">each frame took 0.2–0.6 s to draw on the graphics card…</text>
      <text x={160} y={212} fill="rgba(143,168,255,0.75)" fontFamily="Geist Mono" fontSize="11">…but the page was told exactly 1/30 s had passed, every time. Perfectly smooth footage.</text>
    </svg>
  );
};

export const Film: React.FC = () => {
  const base = import.meta.env.BASE_URL;
  return (
    <Chapter
      id="film"
      n="12"
      kicker="The launch film"
      title="Filming a website, *frame by frame*"
      intro="Chapter twelve: the launch film. Every shot in it is the real website. We just had to teach the browser to lie about the time."
      costume="scarf"
      mood="proud"
    >
      <div className="prose">
        <p className="lead">The launch film is 76.6 seconds long, and every shot in it is Solaris itself, running.</p>
        <p>
          Screen-recording a 3D site gives stutters and dropped frames, so the film was not recorded, it was rendered. A script drove the site in Chrome on the laptop's graphics card and replaced the page's clocks with a <T k="virtualclock">virtual clock</T>: before each frame the page was told exactly one thirtieth of a second had passed, its animations, its camera and its interface all advanced by that much, and only then was the frame captured. A frame could take half a second to draw; on film it lasts 1/30 s.
        </p>
        <p>
          Twenty-eight shots were scripted this way: flights, slow orbits, postcard views and skies from other worlds, tracked so that labels could lock onto planets. The motion design (the logo building itself, the light-clock, every title) was composed in <T k="remotion">Remotion</T>, cut to the soundtrack's beat, and mastered to −14 LUFS for social media.
        </p>
      </div>
      <Fig n={21} title="The virtual clock" vela="Real frames took different amounts of time to draw, the red bars. The page was told every frame took exactly a thirtieth of a second, the green ones. That's why the film is buttery smooth." caption="Timers, animation frames and CSS animations all ran on the virtual clock during capture.">
        <Clock />
      </Fig>
      <Fig n={22} title="Light Travel · the launch film" vela="Here it is! Turn the sound on. Every light you see has already left." caption={<><b>SOLARIS: Light Travel.</b> 76.6 s. A photon leaves the Sun; a light-clock counts its journey to each world.</>}>
        <video className="media" src={`${base}report/media/film.mp4`} poster={`${base}report/media/film.jpg`} controls playsInline preload="none" />
      </Fig>
    </Chapter>
  );
};

// ---------------------------------------------------------------------------------------------
const BUGS: Array<[string, string, string]> = [
  ['The nebulae were invisible.', 'They were flat patches facing away from the camera, and graphics cards skip back faces by default.', 'Draw both sides.'],
  ['The nebulae never came back after daylight.', 'Once hidden under a blue sky, the update loop returned early and never faded them back in.', 'Check whether there is anything to draw, not whether it is hidden.'],
  ['The opening flew to 75 AU instead of 14.', 'The distance for the opening flight was hard-coded in the transition.', 'Pass the distance through.'],
  ['Nebulae came out mirrored and upside down.', 'The picture’s “right” direction was built the wrong way round.', 'right = direction × up, and one line to keep it upright.'],
  ["Earth's twilight was pitch black.", 'The atmosphere only scattered light once; real twilight is lit by light that bounced many times.', 'A multiple-scattering term, and exposure that adapts to dusk.'],
  ['A wedge cut into the horizon.', 'The ground was a coarse sphere; its flat facets showed up at eye level.', 'A finely tessellated cap of ground under the observer.'],
  ['The Sun looked like tiled lava.', 'The convection cells were too regular and too contrasted.', 'Three softer scales of cells, warped, each fading before it can shimmer.'],
  ['Prominences looked like boomerangs.', 'The loop noise was too hard-edged.', 'Soft knots and threads, gentler eruptions.'],
  ['Vela repeated herself on nebula trips.', 'Her arrival reaction re-ran every time anything else changed, saying it again.', 'Each arrival is spoken about once, and nothing about the world you have left.'],
  ['Visiting one nebula erased all the others.', 'A visit faded every picture on the sky.', 'Hide only the one you visit and any it overlaps.'],
  ['The interface overlapped itself.', 'Planet markers drew over the header; the scale ladder over the date.', 'Markers avoid the interface’s rectangles; instruments show by screen width.'],
  ['Recording her voice crawled.', 'The graphics card’s memory was full: the browser preview was still open.', 'Two passes, one model at a time, conditioning prepared once, browser closed.'],
  ['The page reloaded halfway through filming.', 'The dev server noticed new files in the film project and restarted.', 'Tell it to ignore that folder.'],
  ["Vela's dialog vanished in the film.", 'The interface timers ran in real time while each frame took half a second.', 'Put the timers on the virtual clock too.'],
];

const BugCard: React.FC<{ b: [string, string, string]; i: number }> = ({ b, i }) => {
  const [flip, setFlip] = useState(false);
  return (
    <button
      type="button"
      className={`bug ${flip ? 'is-flip' : ''}`}
      onClick={() => setFlip((f) => !f)}
      onPointerEnter={(e) => { setFlip(true); vela.say({ text: `Bug ${i + 1}: ${b[0]} Cause: ${b[1]} Fix: ${b[2]}`, target: e.currentTarget, mood: 'thinking', priority: 2, hold: 3 }); }}
      onPointerLeave={() => setFlip(false)}
    >
      <span className="bug-in">
        <span className="bug-front">
          <span className="bug-n">Bug {String(i + 1).padStart(2, '0')}</span>
          <b>{b[0]}</b>
          <span className="bug-hint">hover for the fix</span>
        </span>
        <span className="bug-back">
          <span className="bug-k">Cause</span>
          <span>{b[1]}</span>
          <span className="bug-k fix">Fix</span>
          <span>{b[2]}</span>
        </span>
      </span>
    </button>
  );
};

export const Bugs: React.FC = () => (
  <Chapter
    id="bugs"
    n="13"
    kicker="What broke"
    title="Everything that went *wrong*"
    intro="Chapter thirteen: everything that broke. Hard hat on. Honestly, this is my favourite chapter. Hover a card and I'll tell you what happened."
    costume="hardhat"
    mood="happy"
  >
    <div className="prose">
      <p className="lead">Nothing here worked the first time. These are the real bugs, in the order they bit.</p>
      <p>Every one of them was found by looking at the picture and noticing something was off, then tracing it back. Some took minutes, some took an evening. Hover a card to flip it.</p>
    </div>
    <div className="bugs">
      {BUGS.map((b, i) => <BugCard key={b[0]} b={b} i={i} />)}
    </div>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
const tidy = (s: string) => s.replace(/^(feat|fix|chore)(\([^)]*\))?:\s*/, '').replace(/^Merge.*/, 'Merge').replace(/^\w/, (c) => c.toUpperCase());

const Timeline: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rows = COMMITS as Array<{ t: string; s: string }>;
  const t0 = Date.parse('2026-10-13T00:00:00+05:30');
  const span = 5 * 86400000;
  useGSAP(
    () => {
      gsap.from('.tl-dot', { scale: 0, transformOrigin: 'center', stagger: 0.025, duration: 0.5, ease: 'back.out(3)', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      gsap.from('.tl-axis', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    },
    { scope: ref }
  );
  const lanes: number[] = [];
  return (
    <div ref={ref} className="tl">
      <div className="tl-axis" />
      {['13 Oct', '14 Oct', '15 Oct', '16 Oct', '17 Oct'].map((d, i) => (
        <span key={d} className="tl-day" style={{ left: `${(i / 5) * 100}%` }}>{d}</span>
      ))}
      {rows.map((c, i) => {
        const x = Math.max(0, Math.min(1, (Date.parse(c.t) - t0) / span));
        // stack commits that land close together
        let lane = 0;
        while (lanes[lane] !== undefined && x - lanes[lane] < 0.012) lane++;
        lanes[lane] = x;
        const big = /^feat/.test(c.s);
        return (
          <button
            key={i}
            type="button"
            className={`tl-dot ${big ? 'is-feat' : ''}`}
            style={{ left: `${x * 100}%`, top: `${118 - lane * 22}px` }}
            onPointerEnter={(e) => vela.say({ text: `${new Date(c.t).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}: ${tidy(c.s)}.`, target: e.currentTarget, mood: big ? 'excited' : 'calm', priority: 2, hold: 2.4 })}
            aria-label={c.s}
          />
        );
      })}
    </div>
  );
};

export const Log: React.FC = () => (
  <Chapter id="log" n="14" kicker="Build log" title="Five days, *forty-six* commits" intro="Chapter fourteen: the build log. Every dot is a commit. Big gold ones added something new, small ones fixed something. Hover them, I remember every one." mood="proud">
    <div className="prose">
      <p className="lead">Solaris went from an empty folder to everything in this report in five days.</p>
      <p>The first commit landed at 1:38 in the morning on 13 October 2026; the guided briefing, Vela's voice, true scale, the Atlas, the soundtrack, the nebulae, the Gallery, the new Sun, the logo and the film followed. Every push ran the full test suite and type check before deploying.</p>
    </div>
    <Fig n={23} title="Every commit · 13 to 17 October 2026" vela="Look at the cluster on the 15th. That's the day I learned to talk." caption="Gold dots added features; pale dots fixed things. Times are in India Standard Time.">
      <Timeline />
    </Fig>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
const KINDS: Array<Ref['kind'] | 'All'> = ['All', 'Orbits', 'Rotation', 'Sky', 'Galaxy', 'Imagery', 'Textures', 'Nebulae', 'Voice', 'Places', 'Music'];
const LIC: Record<string, string> = { 'Public domain': 'pd', 'CC BY 4.0': 'by', 'CC BY-SA 3.0 IGO': 'sa', 'CC BY-SA 4.0': 'sa', 'CC BY-NC 3.0 IGO': 'nc', MIT: 'mit', 'Published paper': 'paper', 'Original work': 'own', 'Public service': 'svc' };

export const References: React.FC = () => {
  const [kind, setKind] = useState<(typeof KINDS)[number]>('All');
  const list = useMemo(() => REFS.map((r, i) => [r, i + 1] as const).filter(([r]) => kind === 'All' || r.kind === kind), [kind]);
  return (
    <Chapter id="refs" n="15" kicker="References" title="Every source, *credited*" intro="Chapter fifteen: references! Glasses on. Every dataset, image and paper Solaris uses, and its licence. Hover one and I'll tell you what it's for." costume="glasses" mood="thinking">
      <div className="prose">
        <p className="lead">Solaris stands on decades of other people's work: spacecraft, surveys, catalogues and papers. Here is all of it.</p>
        <p>
          Most of it is <T k="publicdomain">public domain</T> (NASA's data and imagery) or <T k="ccby">CC BY 4.0</T> (ESA, ESO and Solar System Scope's images), which only ask for credit. The star catalogue is <T k="ccbync">non-commercial</T>, so Solaris is free and will stay free. The full provenance, with every file and the processing applied to it, is in <code>ASSETS.md</code> in the repository.
        </p>
      </div>
      <div className="ref-filter">
        {KINDS.map((k) => (
          <button key={k} type="button" className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>
        ))}
      </div>
      <ol className="refs">
        {list.map(([r, n]) => (
          <li key={n} id={`ref-${n}`} className="ref" onPointerEnter={(e) => r.vela && vela.say({ text: r.vela, target: e.currentTarget, mood: 'thinking', priority: 2 })}>
            <span className="ref-n">[{n}]</span>
            <div className="ref-body">
              <b>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> : r.title}</b>
              <span className="ref-who">{r.who}</span>
              <span className="ref-use">{r.use}</span>
            </div>
            <span className="ref-tags">
              <span className="ref-kind">{r.kind}</span>
              <span className={`lic lic-${LIC[r.licence]}`}>{r.licence}</span>
            </span>
          </li>
        ))}
      </ol>
    </Chapter>
  );
};

// ---------------------------------------------------------------------------------------------
const NOT_REAL: Array<[string, string]> = [
  ['World size', 'Planets and moons are drawn 30× their real size by default (1× in Settings). Distances are true.'],
  ['The asteroid belt', '3,200 rocks with random orbits that follow the belt’s real structure, including the Kirkwood gaps. Statistical, not catalogued.'],
  ['Six of the nine nebulae', 'Procedural figures, placed near nebulae of their kind and enlarged. Three are real photographs.'],
  ['The galaxy from outside', 'Built on an artist’s impression; no one has photographed the Milky Way from outside.'],
  ['The black hole', 'Real mass, distance and shadow size; the light bending is an approximate ray-march, not full general relativity.'],
  ['The black-hole sea', 'An imagined world, made for a postcard. Labelled as such.'],
  ['Poster skies', 'Planets in some postcards are drawn 10× to 1000× larger, and the screen says so whenever they are.'],
  ['The giants’ skies', 'Rough models, labelled approximate. They have no ground: you stand on their cloud tops.'],
];

const STACK: Array<[string, string]> = [
  ['three.js r170', 'WebGL rendering'],
  ['React 18 + TypeScript 5', 'Interface and logic'],
  ['Vite 5', 'Build and dev server'],
  ['Vitest', '142 tests, run on every push'],
  ['GSAP 3.15', 'This report’s motion: ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, MotionPath, Draggable, Inertia'],
  ['Chatterbox (Resemble AI)', 'Vela’s voice'],
  ['Remotion 4 + Playwright + ffmpeg', 'The launch film'],
  ['librosa', 'Beat tracking for the film edit'],
  ['GitHub Actions → Pages, and Vercel', 'Deployment'],
];

export const Colophon: React.FC = () => (
  <Chapter id="colophon" n="16" kicker="Honesty and colophon" title="What *isn't* real, and what built it" intro="Last chapter. Here's everything in Solaris that isn't exactly real. I think it's important to say so. Thank you for reading with me!" mood="love">
    <div className="prose">
      <p className="lead">A model is only trustworthy if it tells you where it cheats. Here is every place Solaris does.</p>
    </div>
    <div className="notreal">
      {NOT_REAL.map(([t, d]) => (
        <div key={t} className="nr" onPointerEnter={(e) => vela.say({ text: `${t}: ${d}`, target: e.currentTarget, mood: 'calm', priority: 2 })}>
          <b>{t}</b>
          <p>{d}</p>
        </div>
      ))}
    </div>
    <div className="prose">
      <h3>Built with</h3>
    </div>
    <div className="stack">
      {STACK.map(([t, d]) => (
        <div key={t} className="stk"><b>{t}</b><span>{d}</span></div>
      ))}
    </div>
    <VelaNote>That's everything. Go and open Solaris, stand somewhere nobody has ever stood, and look up. I'll be there. I'll be the one talking.</VelaNote>
  </Chapter>
);
