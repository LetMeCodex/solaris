import React, { useMemo, useRef, useState } from 'react';
import LINES from '../../companion/vela-lines.json';
import { Band, Cap, Clip, Grid, Ink, Lines, Opener, P, Plate, Ref, Roundel, Say, Sfx, Txt, Vela } from '../kit';
import { ClockPlate, CommitPlate, LineUnits, Take, VelaPlate } from '../plates2';
import type { PageDef } from './registry';

const base = import.meta.env.BASE_URL;

// ------------------------------------------------------------------------------- 09 Vela
const C9: React.FC = () => (
  <Opener n="09" kicker="The companion" title={<>Meet Vela <em>(that’s me)</em></>}>
    <div className="op-ga">
      <Plate n="XII" title="Vela, general arrangement. Eight kinds of eyes, six mouths, five costumes.">
        <VelaPlate />
      </Plate>
    </div>
    <Txt style={{ position: 'absolute', left: 0, bottom: 0, width: 262 }}>
      <p className="lead">Solaris has a guide who talks. She knows where you are, remembers where you have been, and has opinions about the black hole.</p>
    </Txt>
  </Opener>
);

const GROUPS: Array<[string, string]> = [
  ['arrive', 'Facts on arrival at each world'], ['explore', 'Exploration milestones'], ['joke', 'Jokes'], ['convo', 'Conversations'], ['fright', 'Fright, mostly the black hole'], ['feel', 'Feelings'],
  ['secret', 'Secrets to unlock'], ['idle', 'When you go quiet'], ['care', 'Looking after you'], ['greet', 'Hellos'], ['tour', 'The briefing'], ['memory', 'Remembering you'],
  ['react', 'Reacting to what you do'], ['noise', 'Little sounds'], ['music', 'The soundtrack'], ['farewell', 'The farewell at 100%'],
];
const lines = LINES as Record<string, string>;
const C9Lines: React.FC = () => {
  const rows = useMemo(() => {
    const c: Record<string, number> = {};
    for (const k of Object.keys(lines)) c[k.split('.')[0]] = (c[k.split('.')[0]] ?? 0) + 1;
    const known = GROUPS.reduce((a, [g]) => a + (c[g] ?? 0), 0);
    const r: Array<[string, number]> = GROUPS.map(([g, l]) => [l, c[g] ?? 0]);
    r.push(['Everything else: postcards, nebulae, menus', Object.keys(lines).length - known]);
    return r;
  }, []);
  return (
    <>
      <Band size={30}>572 LINES, ONE SQUARE EACH</Band>
      <LineUnits rows={rows} />
      <Txt cols={2}>
        <p>Vela has 572 lines, about an hour of speech. She comments when you arrive somewhere, tells a fact the first time and a joke the second, notices when you speed up time or stare at Saturn for a while, and gets genuinely frightened near Sagittarius A*.</p>
        <p>She keeps a memory of the worlds you have visited and counts your exploration as a percentage. At 100% she says goodbye, and means it. Counted from src/companion/vela-lines.json.</p>
      </Txt>
    </>
  );
};

const STEPS: Array<[string, string]> = [
  ['The line', '572 written lines, some with sound tags like [laugh] or [sniff].'],
  ['Speech', 'Chatterbox text-to-speech; tagged lines go through its Turbo model, which performs the sounds.'],
  ['Her voice', 'Voice conversion onto the reference recording, so every line has the same timbre.'],
  ['Finishing', 'Long pauses trimmed to a breath, loudness levelled to −17 LUFS, soft fades.'],
  ['Checked', 'If a take is far too long or short for its words, it is re-recorded with another seed.'],
];
const C9Voice: React.FC = () => (
  <>
    <Band tone="orange" size={30}>HOW A LINE BECOMES HER VOICE</Band>
    <div className="metro a-f">
      {STEPS.map(([t, d], i) => (
        <div key={t}>
          <i>{i + 1}</i>
          <b>{t}</b>
          <span>{d}</span>
        </div>
      ))}
    </div>
    <Take />
    <Txt cols={2}>
      <p>She speaks in a real person’s voice, recorded with that person’s consent. Every line was generated with Chatterbox<Ref n={28} />, an open-source speech model, conditioned on a short reference recording, then converted onto the same voice so all 572 lines match. Giggles and sobs are performed. Recording them all took hours on a laptop graphics card, from scripts/generate_vela_voice.py.</p>
    </Txt>
    <Grid cols="1fr 150px" rows="1fr" style={{ gap: 10 }}>
      <P tone="ink" ar="16 / 7">
        <Clip name="ui_vela" spot="orange" cell={4} gain={2.8} alt="Vela beside Mars in Solaris" />
        <Say x={12} y={12} w={500} tail="none" shout>The hardest part of me wasn’t the voice. It was <b>knowing when to stay quiet.</b> Every line has a cooldown, every fact is said once, and if you’ve heard me say something recently, I find something else to say.</Say>
      </P>
      <P bare ar="1 / 1"><Vela eyes="closed" mouth="smile" arms="hold" size={140} x={4} b={4} /></P>
    </Grid>
  </>
);

// ------------------------------------------------------------------------------- 10 soundtrack
const TRACKS: Array<[string, string, string, string]> = [
  ['00-helios-overture', 'Helios Overture', 'Sun', 'A dying sun adrift in deep space'], ['01-quicksilver-clockwork', 'Quicksilver Clockwork', 'Mercury', 'Mechanical moons slowing down'],
  ['02-veil-of-sulphur', 'Veil of Sulphur', 'Venus', 'Amber haze & quiet echoes'], ['03-pale-blue-lullaby', 'Pale Blue Lullaby', 'Earth', 'Gentle waves under a frozen sky'],
  ['04-red-dust-drums', 'Red Dust Drums', 'Mars', 'Distant pulses in the rust storm'], ['05-cathedral-of-storms', 'Cathedral of Storms', 'Jupiter', 'Violet twilight across the nave'],
  ['06-orbit-of-glass-rings', 'Orbit of Glass Rings', 'Saturn', 'Floating shards in motionless orbit'], ['07-frozen-tilt', 'Frozen Tilt', 'Uranus', 'Crystalline calm in eternal winter'],
  ['08-deep-blue-echoes', 'Deep Blue Echoes', 'Neptune', 'Submerged transmissions from the abyss'], ['09-event-horizon-silence', 'Event Horizon Silence', 'Sgr A*', 'Eternal stillness at the edge of time'],
];
const Records: React.FC = () => {
  const [on, setOn] = useState<string | null>(null);
  const au = useRef<HTMLAudioElement | null>(null);
  const toggle = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    au.current?.pause();
    if (on === slug) { setOn(null); return; }
    const a = new Audio(`${base}music/${slug}.mp3`);
    a.currentTime = 18;
    a.volume = 0.7;
    a.play().catch(() => {});
    au.current = a;
    setOn(slug);
  };
  return (
    <div className="recs">
      {TRACKS.map(([s, t, w, d]) => (
        <button key={s} type="button" className={`rec a-f ${on === s ? 'on' : ''}`} onClick={(e) => toggle(e, s)} aria-label={`Play ${t}`}>
          <span className="rec-d"><Ink src={{ kind: 'image', url: `${base}music/${s}.jpg` }} spot="orange" cell={3.4} gain={1.6} alt="" /><i /></span>
          <span className="rec-w">{w}</span>
          <b>{t}</b>
          <em>{d}</em>
        </button>
      ))}
    </div>
  );
};
const C10: React.FC = () => (
  <>
    <div className="op-k a-f"><b>Chapter 10</b><span>The soundtrack</span></div>
    <h2 className="op-t a-f" style={{ fontSize: 66, marginTop: 8 }}>A song for <em>every</em> world</h2>
    <Records />
    <Txt cols={2}>
      <p>Solaris has its own album, <i>Slowed + Reverb (Lofi Edition)</i><Ref n={30} />: ten slowed, reverb-soaked tracks, one for the Sun, one for each planet and one for the black hole. Press a record to hear it, from 18 seconds in.</p>
      <p>The music follows you. Choose a world and its track takes over, crossfading so two never overlap. It sits at a quiet −18 LUFS and dips whenever Vela speaks, so she is never drowned out.</p>
    </Txt>
    <Vela eyes="closed" mouth="smile" arms="up" costume="headphones" size={96} x={330} b={156} />
  </>
);

// ------------------------------------------------------------------------------- 11 interface
const SIGNS: Array<[string, string, 0 | 90 | 180 | 270]> = [
  ['Logbook', 'A diamond lights for every world you reach.', 0], ['Scale ladder', 'Jumps between orders of magnitude, from a skyline to the galaxy.', 90],
  ['Time lever', 'Runs the clock from real time to a year a second.', 0], ['The Atlas', 'All 478 worlds, a live reel behind each system, and the nebulae.', 270],
  ['Gallery', 'Eight postcards you can step into, and the pictures you take.', 0], ['Settings', 'Everything, from Vela’s volume to how big worlds are drawn.', 180],
];
const C11: React.FC = () => (
  <>
    <div className="op-k a-f"><b>Chapter 11</b><span>The interface</span></div>
    <h2 className="op-t a-f" style={{ fontSize: 62, marginTop: 8, color: 'var(--orange)' }}>An <em>observatory</em>, not a game</h2>
    <div className="signs">
      {SIGNS.map(([t, d, a]) => (
        <div key={t} className="sign a-f">
          <span className="sg-t"><Roundel dir={a} size={34} /><b>{t}</b></span>
          <span className="sg-d">{d}</span>
        </div>
      ))}
    </div>
    <Grid cols="1fr 1fr" rows="1fr">
      <P ar="16 / 10"><Clip name="ui_explorer" spot="green" cell={3.2} gain={2.2} neg alt="The world panel, printed as a negative" /><Cap x={8} b={8} tone="paper"><b>The world panel.</b> Stand here, look up.</Cap></P>
      <P ar="16 / 10"><Clip name="ui_atlas" spot="orange" cell={3.2} gain={2.2} neg alt="The Atlas, printed as a negative" /><Cap x={8} b={8} tone="paper"><b>The Atlas.</b> 478 worlds.</Cap></P>
    </Grid>
    <Txt cols={2}>
      <p>The interface was designed like the instruments of an observatory: thin type, real readouts, and nothing that pretends.</p>
      <p>First-time visitors get an 18-step briefing that points at each instrument and demonstrates it live, while Vela narrates.</p>
    </Txt>
  </>
);

// ------------------------------------------------------------------------------- 12 film
const C12: React.FC = () => (
  <Opener n="12" tone="orange" kicker="The launch film" title={<>Filming a website, <em>frame by frame</em></>}>
    <div className="op-wide a-p" style={{ height: 290 }}>
      <Clip name="film" start={19} spot="orange" cell={5} gain={2.6} alt="The launch film, Light Travel" />
      <Vela eyes="happy" mouth="grin" arms="wave2" costume="scarf" size={100} r={12} b={6} />
    </div>
    <p className="op-lead a-f" style={{ width: 'auto' }}>The launch film is 76.6 seconds long, and every shot in it is Solaris itself, running. <a href={`${base}report/media/film.mp4`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Watch it unprinted.</a></p>
  </Opener>
);
const C12Clock: React.FC = () => (
  <>
    <Band size={25}>WE LIED TO THE BROWSER ABOUT THE TIME</Band>
    <Plate n="XIII" title="The virtual clock. Timers, animation frames and CSS animations all ran on it during capture.">
      <ClockPlate />
    </Plate>
    <Txt cols={2}>
      <p>Screen-recording a 3D site gives stutters and dropped frames, so the film was not recorded, it was rendered. A script drove the site in Chrome on the laptop’s graphics card and replaced the page’s clocks with a virtual clock: before each frame the page was told exactly one thirtieth of a second had passed, and only then was the frame captured. A frame could take half a second to draw; on film it lasts 1/30 s.</p>
      <p>Twenty-eight shots were scripted this way: flights, slow orbits, postcard views and skies from other worlds, tracked so that labels could lock onto planets. The motion design, from the logo building itself to the light-clock and every title, was composed in Remotion, cut to the soundtrack’s beat with librosa, and mastered to −14 LUFS for social media.</p>
    </Txt>
    <Grid cols="1fr 1fr 1fr" rows="1fr">
      <P tone="ink" ar="16 / 10"><Clip name="saturn" spot="orange" cell={4} gain={4} alt="Saturn" /></P>
      <P tone="ink" ar="16 / 10"><Clip name="jupiter" spot="orange" cell={4} gain={4} alt="Jupiter" /></P>
      <P tone="ink" ar="16 / 10"><Clip name="triton_neptune" spot="green" cell={4} gain={2.6} alt="Neptune from Triton" /></P>
    </Grid>
    <Cap b={52} r={44} w={300} tone="paper">Three of the twenty-eight shots.</Cap>
  </>
);

// ------------------------------------------------------------------------------- 13 bugs
export const BUGS: Array<[string, string, string]> = [
  ['The nebulae were invisible.', 'They were flat patches facing away from the camera, and graphics cards skip back faces by default.', 'Draw both sides.'],
  ['The nebulae never came back after daylight.', 'Once hidden under a blue sky, the update loop returned early and never faded them back in.', 'Check whether there is anything to draw, not whether it is hidden.'],
  ['The opening flew to 75 AU instead of 14.', 'The distance for the opening flight was hard-coded in the transition.', 'Pass the distance through.'],
  ['Nebulae came out mirrored and upside down.', 'The picture’s “right” direction was built the wrong way round.', 'right = direction × up, and one line to keep it upright.'],
  ['Earth’s twilight was pitch black.', 'The atmosphere only scattered light once; real twilight is lit by light that bounced many times.', 'A multiple-scattering term, and exposure that adapts to dusk.'],
  ['A wedge cut into the horizon.', 'The ground was a coarse sphere; its flat facets showed up at eye level.', 'A finely tessellated cap of ground under the observer.'],
  ['The Sun looked like tiled lava.', 'The convection cells were too regular and too contrasted.', 'Three softer scales of cells, warped, each fading before it can shimmer.'],
  ['Prominences looked like boomerangs.', 'The loop noise was too hard-edged.', 'Soft knots and threads, gentler eruptions.'],
  ['Vela repeated herself on nebula trips.', 'Her arrival reaction re-ran every time anything else changed, saying it again.', 'Each arrival is spoken about once, and nothing about the world you have left.'],
  ['Visiting one nebula erased all the others.', 'A visit faded every picture on the sky.', 'Hide only the one you visit and any it overlaps.'],
  ['The interface overlapped itself.', 'Planet markers drew over the header; the scale ladder over the date.', 'Markers avoid the interface’s rectangles; instruments show by screen width.'],
  ['Recording her voice crawled.', 'The graphics card’s memory was full: the browser preview was still open.', 'Two passes, one model at a time, conditioning prepared once, browser closed.'],
  ['The page reloaded halfway through filming.', 'The dev server noticed new files in the film project and restarted.', 'Tell it to ignore that folder.'],
  ['Vela’s dialog vanished in the film.', 'The interface timers ran in real time while each frame took half a second.', 'Put the timers on the virtual clock too.'],
];
const BugRow: React.FC<{ b: [string, string, string]; i: number }> = ({ b, i }) => (
  <div className="bug a-f">
    <div className="bug-n"><b>{String(i + 1).padStart(2, '0')}</b></div>
    <div className="bug-c">
      <h3>{b[0]}</h3>
      <p><span>Cause</span> {b[1]}</p>
      <p><span className="fx">Fix</span> {b[2]}</p>
    </div>
  </div>
);
const C13: React.FC = () => (
  <>
    <div className="op-k a-f"><b>Chapter 13</b><span>What broke</span></div>
    <Grid cols="1fr 240px" rows="238px" style={{ flex: 'none' }}>
      <P bare ar="16 / 8">
        <h2 className="op-t a-f" style={{ fontSize: 72, color: 'var(--orange)', position: 'absolute', left: 0, top: 6 }}>Everything that went <em>wrong</em></h2>
      </P>
      <P tone="ink" ar="1 / 1">
        <Lines tone="#ece1ca" inner={24} n={56} seed={2} />
        <Vela eyes="x" mouth="wobble" arms="up" costume="hardhat" size={108} x={62} y={52} still />
        <Sfx jp="ガーン" en="GĀN" x={10} y={8} size={40} rot={-6} tone="orange" />
      </P>
    </Grid>
    <Txt><p>Nothing here worked the first time. These are the real bugs, in the order they bit. Every one was found by looking at the picture, noticing something was off, and tracing it back.</p></Txt>
    <div className="bugs">{BUGS.slice(0, 6).map((b, i) => <BugRow key={b[0]} b={b} i={i} />)}</div>
  </>
);
const C13b: React.FC = () => (
  <>
    <Band tone="orange" size={30}>WHAT BROKE, CONTINUED</Band>
    <div className="bugs">{BUGS.slice(6).map((b, i) => <BugRow key={b[0]} b={b} i={i + 6} />)}</div>
  </>
);

// ------------------------------------------------------------------------------- 14 build log
const MILES: Array<[string, string]> = [
  ['13 Oct, 01:38', 'The first commit, at 1:38 in the morning. By that night: the cinematic interface, physical atmospheres, the Gaia Milky Way, Sagittarius A* and real ephemerides.'],
  ['14 Oct', 'The observation camera and its lenses, real surface imagery, and “stand on the surface and look up”.'],
  ['15 Oct', 'The observatory HUD and guided briefing. Vela arrives and gets a real voice. The Hipparcos sky, and true scale with every known moon.'],
  ['16 Oct', 'The Atlas, Vela’s own voice, the soundtrack, real nebulae you can fly into, the Gallery, and a new Sun.'],
  ['17 Oct', 'The animated logo, and the launch film, Light Travel.'],
];
const C14: React.FC = () => (
  <>
    <div className="op-k a-f"><b>Chapter 14</b><span>Build log</span></div>
    <h2 className="op-t a-f" style={{ fontSize: 68, marginTop: 8 }}>Five days, <em>forty-six</em> commits</h2>
    <Plate n="XIV" title="Every commit, 13 to 17 October 2026, India Standard Time. Orange dots added features; black dots fixed things.">
      <CommitPlate />
    </Plate>
    <Txt><p className="lead">Solaris went from an empty folder to everything in this book in five days.</p></Txt>
    <table className="spec a-f">
      <tbody>{MILES.map(([d, t]) => <tr key={d}><td style={{ width: 150 }}><b>{d}</b></td><td>{t}</td></tr>)}</tbody>
    </table>
    <Txt><p>Every push ran the full test suite and type check before deploying. The numbers at the end of that week: 46 commits, 25,919 lines of TypeScript in Solaris itself, not counting its tests, and 142 tests in 23 suites.</p></Txt>
    <div className="lines-t a-f">
      {[['rendering', 10652], ['interface', 6480], ['explorer', 3093], ['data', 2103], ['camera', 1635], ['astronomy', 904], ['audio', 303], ['companion', 296], ['simulation', 121]].map(([k, v]) => (
        <div key={String(k)}><i style={{ width: `${(Number(v) / 10652) * 100}%` }} /><span>{k}</span><b>{Number(v).toLocaleString('en-US')}</b></div>
      ))}
    </div>
  </>
);

export const CRAFT: PageDef[] = [
  { id: 'c9', node: <C9 />, tab: 'Vela', stop: '09 Vela' },
  { id: 'c9-lines', node: <C9Lines />, tab: 'Vela' },
  { id: 'c9-voice', node: <C9Voice />, tab: 'Vela' },
  { id: 'c10', node: <C10 />, tab: 'Soundtrack', stop: '10 The soundtrack' },
  { id: 'c11', node: <C11 />, tab: 'Interface', stop: '11 The interface' },
  { id: 'c12', node: <C12 />, tab: 'The Film', stop: '12 The launch film' },
  { id: 'c12-clock', node: <C12Clock />, tab: 'The Film' },
  { id: 'c13', node: <C13 />, tab: 'What Broke', stop: '13 What broke' },
  { id: 'c13-b', node: <C13b />, tab: 'What Broke' },
  { id: 'c14', node: <C14 />, tab: 'Build Log', stop: '14 Build log' },
];
