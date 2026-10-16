import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Chapter, Fig, T, Cite, VelaNote, Loop } from '../kit';
import { vela } from '../vela/bus';
import LINES from '../../companion/vela-lines.json';

const lines = LINES as Record<string, string>;
const clean = (t: string) => t.replace(/\[[a-z ]+\]\s*/g, '').trim();

const GROUPS: Array<[string, string]> = [
  ['arrive', 'Facts on arrival at each world'],
  ['explore', 'Exploration milestones'],
  ['joke', 'Jokes'],
  ['convo', 'Conversations'],
  ['fright', 'Fright (mostly the black hole)'],
  ['feel', 'Feelings'],
  ['secret', 'Secrets to unlock'],
  ['idle', 'When you go quiet'],
  ['care', 'Looking after you'],
  ['greet', 'Hellos'],
  ['tour', 'The briefing'],
  ['memory', 'Remembering you'],
  ['react', 'Reacting to what you do'],
  ['noise', 'Little sounds'],
  ['music', 'The soundtrack'],
  ['farewell', 'The farewell at 100%'],
];

const LineChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const k of Object.keys(lines)) c[k.split('.')[0]] = (c[k.split('.')[0]] ?? 0) + 1;
    return c;
  }, []);
  const known = GROUPS.reduce((a, [g]) => a + (counts[g] ?? 0), 0);
  const rows: Array<[string, string, number]> = [...GROUPS.map(([g, l]) => [g, l, counts[g] ?? 0] as [string, string, number]), ['other', 'Everything else: postcards, nebulae, the camera, menus…', Object.keys(lines).length - known]];
  const max = Math.max(...rows.map((r) => r[2]));
  useGSAP(
    () => {
      gsap.from('.lc-bar-fill', { scaleX: 0, transformOrigin: 'left', stagger: 0.04, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    },
    { scope: ref }
  );
  const sample = (g: string, el: Element) => {
    const keys = Object.keys(lines).filter((k) => (g === 'other' ? !GROUPS.some(([x]) => k.startsWith(`${x}.`)) : k.startsWith(`${g}.`)));
    const k = keys[Math.floor(Math.random() * keys.length)];
    vela.say({ text: `“${clean(lines[k])}” (that's ${k})`, target: el, mood: g === 'fright' ? 'scared' : g === 'farewell' ? 'sleepy' : g === 'joke' ? 'happy' : 'love', priority: 2, hold: 3.4 });
  };
  return (
    <div ref={ref} className="lc-chart">
      {rows.map(([g, l, n]) => (
        <div key={g} className="lc-row" onPointerEnter={(e) => sample(g, e.currentTarget)} tabIndex={0} onFocus={(e) => sample(g, e.currentTarget)}>
          <span className="lc-label">{l}</span>
          <span className="lc-bar"><span className="lc-bar-fill" style={{ width: `${(n / max) * 100}%` }} /></span>
          <span className="lc-n">{n}</span>
        </div>
      ))}
    </div>
  );
};

const SAMPLES: Array<[string, string]> = [
  ['giggle.6', 'A shy hello'],
  ['surface.2', 'Standing on another world'],
  ['joke.8', 'A black hole joke'],
  ['convo.why.q', 'A question'],
  ['fright.bh.3', 'Too close to the black hole'],
  ['farewell.2', 'The farewell'],
];

const Voices: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const base = import.meta.env.BASE_URL;
  const play = (id: string, el: Element) => {
    audio.current?.pause();
    if (playing === id) { setPlaying(null); return; }
    const a = new Audio(`${base}voice/vela/${id}.mp3`);
    audio.current = a;
    setPlaying(id);
    a.onended = () => setPlaying(null);
    a.play().catch(() => setPlaying(null));
    const t = lines[id];
    vela.say({ text: clean(t), target: el, mood: id.startsWith('fright') ? 'scared' : id.startsWith('farewell') ? 'love' : 'happy', priority: 3, hold: 2.5 });
  };
  return (
    <div className="voices">
      {SAMPLES.map(([id, label]) => (
        <button key={id} type="button" className={`voice ${playing === id ? 'on' : ''}`} onClick={(e) => play(id, e.currentTarget)}>
          <span className="voice-icon">{playing === id ? '❚❚' : '▶'}</span>
          <span className="voice-txt">
            <b>{label}</b>
            <em>“{clean(lines[id])}”</em>
          </span>
          <span className="voice-wave" aria-hidden>{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 83) % 600}ms` }} />)}</span>
        </button>
      ))}
    </div>
  );
};

const Pipeline: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);
  const STEPS: Array<[string, string]> = [
    ['The line', '572 written lines, some with sound tags like [laugh] or [sniff]'],
    ['Speech', 'Chatterbox text-to-speech; tagged lines go through its Turbo model, which performs the sounds'],
    ['Her voice', 'Voice conversion onto the reference recording, so every line has the same timbre'],
    ['Finishing', 'Long pauses trimmed to a breath, loudness levelled to −17 LUFS, soft fades'],
    ['Checked', 'If a take is far too long or short for its words, it is re-recorded with another seed'],
  ];
  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      tl.from('.pl-box', { opacity: 0, y: 30, stagger: 0.18, duration: 0.6, ease: 'back.out(1.6)' }).from('.pl-link', { drawSVG: '0%', stagger: 0.18, duration: 0.5 }, 0.2);
      gsap.to('.pl-pulse', { motionPath: { path: '.pl-route', align: '.pl-route', alignOrigin: [0.5, 0.5] }, duration: 4, repeat: -1, ease: 'none' });
    },
    { scope: ref }
  );
  const w = 1180;
  const bw = 200;
  const gap = (w - 40 - bw * 5) / 4;
  return (
    <svg ref={ref} viewBox={`0 0 ${w} 300`} className="media" role="img" aria-label="How Vela's voice is made">
      <path className="pl-route" d={`M ${20 + bw / 2} 96 L ${20 + 4 * (bw + gap) + bw / 2} 96`} stroke="none" fill="none" />
      {STEPS.map(([t, d], i) => {
        const x = 20 + i * (bw + gap);
        return (
          <g key={t}>
            {i > 0 && <path className="pl-link" d={`M ${x - gap} 96 L ${x} 96`} stroke="#6dfcc0" strokeWidth="1.5" strokeDasharray="4 4" />}
            <g className="pl-box" onPointerEnter={(e) => vela.say({ text: d, target: e.currentTarget, mood: 'calm', priority: 2 })}>
              <rect x={x} y={56} width={bw} height={80} rx={12} fill="rgba(109,252,192,0.06)" stroke="rgba(109,252,192,0.45)" />
              <text x={x + bw / 2} y={92} textAnchor="middle" fill="#fff" fontFamily="Montserrat" fontWeight={300} fontSize="15" letterSpacing="3">{t.toUpperCase()}</text>
              <text x={x + bw / 2} y={116} textAnchor="middle" fill="#6dfcc0" fontFamily="JetBrains Mono" fontSize="11">STEP {i + 1}</text>
              <foreignObject x={x - 6} y={150} width={bw + 12} height={130}>
                <div className="pl-desc">{d}</div>
              </foreignObject>
            </g>
          </g>
        );
      })}
      <circle className="pl-pulse" r="6" fill="#ffd9a6" />
    </svg>
  );
};

export const Companion: React.FC = () => (
  <Chapter
    id="vela"
    n="09"
    kicker="The companion"
    title="Meet Vela (that's me)"
    intro="Chapter nine is about me! I'm a little embarrassed. Play some of my lines, I recorded them myself. Well. Sort of."
    mood="love"
  >
    <div className="prose">
      <p className="lead">Solaris has a guide who talks. She knows where you are, remembers where you have been, and has opinions about the black hole.</p>
      <p>
        Vela has 572 lines, about an hour of speech. She comments when you arrive somewhere, tells a fact the first time and a joke the second, notices when you speed up time or stare at Saturn for a while, and gets genuinely frightened near Sagittarius A*. She keeps a memory of the worlds you have visited and counts your exploration as a percentage; at 100% she says goodbye, and means it.
      </p>
      <p>
        She speaks in a real person's voice, recorded with that person's consent. Every line was generated with <T k="chatterbox">Chatterbox</T><Cite n={28} />, an open-source speech model, conditioned on a short reference recording, then converted onto the same voice so all 572 lines match. Lines with tags like <code>[laugh]</code> or <code>[sniff]</code> are performed, giggles and sobs included.
      </p>
    </div>
    <Fig n={16} title="What Vela talks about" vela="Hover a bar and I'll say one of my lines from that group. Pick 'Fright' if you want to hear me panic." caption={<><b>572 lines by kind</b>, counted from <code>src/companion/vela-lines.json</code>. Each has its own recording in <code>public/voice/vela/</code>.</>}>
      <LineChart />
    </Fig>
    <Fig n={17} title="Her voice, in her own words" vela="Press play. These are my real recordings from Solaris. The farewell one... maybe save that for last." caption="Six of the 572 recordings, as they play in Solaris.">
      <Voices />
    </Fig>
    <Fig n={18} title="How a line becomes her voice" vela="Five steps for every line. The last one is a quality check: if I skipped a word or babbled, the line is recorded again." caption={<>From <code>scripts/generate_vela_voice.py</code>. Recording all 572 lines took hours on a laptop graphics card.</>}>
      <Pipeline />
    </Fig>
    <VelaNote>The hardest part of me wasn't the voice. It was knowing when to stay quiet. Every line has a cooldown, every fact is said once, and if you've heard me say something recently, I find something else to say.</VelaNote>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
const TRACKS: Array<[string, string, string, string]> = [
  ['00-helios-overture', 'Helios Overture', 'Sun', 'A dying sun adrift in deep space'],
  ['01-quicksilver-clockwork', 'Quicksilver Clockwork', 'Mercury', 'Mechanical moons slowing down'],
  ['02-veil-of-sulphur', 'Veil of Sulphur', 'Venus', 'Amber haze & quiet echoes'],
  ['03-pale-blue-lullaby', 'Pale Blue Lullaby', 'Earth', 'Gentle waves under a frozen sky'],
  ['04-red-dust-drums', 'Red Dust Drums', 'Mars', 'Distant pulses in the rust storm'],
  ['05-cathedral-of-storms', 'Cathedral of Storms', 'Jupiter', 'Violet twilight across the nave'],
  ['06-orbit-of-glass-rings', 'Orbit of Glass Rings', 'Saturn', 'Floating shards in motionless orbit'],
  ['07-frozen-tilt', 'Frozen Tilt', 'Uranus', 'Crystalline calm in eternal winter'],
  ['08-deep-blue-echoes', 'Deep Blue Echoes', 'Neptune', 'Submerged transmissions from the abyss'],
  ['09-event-horizon-silence', 'Event Horizon Silence', 'Sgr A*', 'Eternal stillness at the edge of time'],
];

const Tracks: React.FC = () => {
  const [on, setOn] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const base = import.meta.env.BASE_URL;
  const toggle = (slug: string, title: string, world: string, el: Element) => {
    audio.current?.pause();
    if (on === slug) { setOn(null); return; }
    const a = new Audio(`${base}music/${slug}.mp3`);
    a.currentTime = 18;
    a.volume = 0.7;
    audio.current = a;
    a.play().catch(() => {});
    setOn(slug);
    vela.say({ text: `${title}. This one plays when you're at ${world}. Turn it up a bit, I won't mind.`, target: el, mood: 'happy', priority: 2 });
  };
  return (
    <div className="tracks">
      {TRACKS.map(([slug, title, world, mood]) => (
        <button key={slug} type="button" className={`track ${on === slug ? 'on' : ''}`} onClick={(e) => toggle(slug, title, world, e.currentTarget)}>
          <span className="track-disc">
            <img src={`${base}music/${slug}.jpg`} alt="" />
            <i />
          </span>
          <span className="track-world">{world}</span>
          <b>{title}</b>
          <em>{mood}</em>
        </button>
      ))}
    </div>
  );
};

export const Sound: React.FC = () => (
  <Chapter
    id="sound"
    n="10"
    kicker="The soundtrack"
    title="A song for every world"
    intro="Chapter ten: the music! Headphones on. Every world has its own song. Click a record and it'll spin."
    costume="headphones"
    mood="happy"
  >
    <div className="prose">
      <p className="lead">Solaris has its own album: ten slowed, reverb-soaked tracks, one for the Sun, one for each planet and one for the black hole.</p>
      <p>
        The music follows you. Choose a world and its track takes over at that moment, crossfading so two never overlap; pick one yourself from the record player and it plays until your next flight. It sits at a quiet −18 <T k="lufs">LUFS</T> and dips whenever Vela speaks, so she is never drowned out.
      </p>
    </div>
    <Fig n={19} title="The Solaris soundtrack · click to listen" vela="Click any record for a preview. Pale Blue Lullaby is Earth's. It's my favourite. Don't tell the others." caption={<><b>Solaris: Slowed + Reverb (Lofi Edition).</b> Original soundtrack<Cite n={30} />. Previews start 18 seconds in.</>}>
      <Tracks />
    </Fig>
  </Chapter>
);

// ---------------------------------------------------------------------------------------------
export const Interface: React.FC = () => (
  <Chapter
    id="interface"
    n="11"
    kicker="The interface"
    title="An observatory, not a game"
    intro="Chapter eleven: the interface. Everything you press in Solaris, and why it looks like an observatory."
    mood="proud"
  >
    <div className="prose">
      <p className="lead">The interface was designed like the instruments of an observatory: thin type, real readouts, and nothing that pretends.</p>
      <p>
        A logbook lights a diamond for every world you reach. A scale ladder jumps between orders of magnitude, from a planet's skyline to the galaxy. A time lever runs the clock from real time to a year a second. The Atlas lists all 478 worlds with a live cinematic reel behind each system, the nebulae you can fly to, and a Gallery of eight postcards: real places and moments you can step straight into, along with the pictures you take yourself.
      </p>
      <p>
        First-time visitors get an 18-step briefing that points at each instrument and demonstrates it live (layers switch off and on, time speeds up, the Atlas opens and turns its pages) while Vela narrates. A Settings drawer lets you tune everything, from her volume to how big the worlds are drawn.
      </p>
    </div>
    <Fig n={20} title="The interface, live" vela="Top left, the overview. Top right, the world panel where you can stand and look up. Bottom, the Atlas, and me saying hello on Mars." caption="Captured from the running site.">
      <div className="media-grid c2">
        <Loop src="ui_overview" label="The overview" />
        <Loop src="ui_explorer" label="The world panel · Stand here, look up" />
        <Loop src="ui_atlas" label="The Atlas · 478 worlds" />
        <Loop src="ui_vela" label="Vela" />
      </div>
    </Fig>
  </Chapter>
);
