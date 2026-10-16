import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { C, FPS, bar, BEAT, SKY_SHIFT, mono, montserrat, serif, sec } from './theme';
import { Skies, SKY_SHOTS, skyAt } from './Skies';
import { Shot, Screen, Grain, Vignette, LightLeak, Glint, Flash, Motes } from './fx';
import { Mark, Wordmark } from './Logo';
import { Rise, Callout, Caption } from './Type';
import { LightClock, Stop } from './LightClock';
import { SoundDesign } from './Sound';

export const DURATION = 66.6 + SKY_SHIFT;
/** Everything after the Skies act moves by the four inserted bars. */
const late = (t: number) => t + SKY_SHIFT;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const H = BEAT * 2; // half a bar

/** A Sequence placed in seconds. */
const At: React.FC<{ from: number; to: number; children: React.ReactNode; name?: string }> = ({ from, to, children, name }) => (
  <Sequence from={sec(from)} durationInFrames={Math.max(1, sec(to) - sec(from))} name={name} layout="absolute-fill">
    {children}
  </Sequence>
);

// ---- the journey: one photon, outward ----------------------------------------------------------
const J = bar(2);
const JOURNEY: Array<{ shot: string; from: number; to: number; clipFrom?: number }> = [
  { shot: 'mercury', from: J, to: J + H },
  { shot: 'venus', from: J + H, to: bar(3) },
  { shot: 'earth', from: bar(3), to: bar(4), clipFrom: 0.6 },
  { shot: 'moon_earth', from: bar(4), to: bar(4) + H },
  { shot: 'mars_dusk', from: bar(4) + H, to: bar(5) },
  { shot: 'jupiter', from: bar(5), to: bar(5) + H },
  { shot: 'europa_night', from: bar(5) + H, to: bar(6) },
  { shot: 'saturn', from: bar(6), to: bar(6) + H },
  { shot: 'mimas_saturn', from: bar(6) + H, to: bar(7) },
  { shot: 'miranda_uranus', from: bar(7), to: bar(7) + H },
  { shot: 'triton_neptune', from: bar(7) + H, to: bar(8) },
  { shot: 'pluto_charon', from: bar(8), to: bar(9), clipFrom: 0.3 },
];

const STOPS: Stop[] = [
  { at: J, name: 'Mercury', light: 193 },
  { at: J + H, name: 'Venus', light: 361 },
  { at: bar(3), name: 'Earth', light: 499, note: '8 min 19 s · home' },
  { at: bar(4), name: 'The Moon', light: 500, note: 'a sliver of home' },
  { at: bar(4) + H, name: 'Mars', light: 760, note: '12 min 40 s · dusk on Meridiani' },
  { at: bar(5), name: 'Jupiter', light: 2595, note: '43 minutes' },
  { at: bar(5) + H, name: 'Jupiter', light: 2595, note: 'by night, from Europa' },
  { at: bar(6), name: 'Saturn', light: 4781, note: '1 hour 20 minutes' },
  { at: bar(6) + H, name: 'Saturn', light: 4781, note: 'after sunset, from Mimas' },
  { at: bar(7), name: 'Uranus', light: 9577, note: '2 h 40 min · from Miranda' },
  { at: bar(7) + H, name: 'Neptune', light: 15007, note: '4 h 10 min · from Triton' },
  { at: bar(8), name: 'Pluto', light: 19703, note: '5 h 28 min · and still going' },
];

// ---- pieces ------------------------------------------------------------------------------------

/** The cold open: one point of light in the dark, breathing. */
const Photon: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const appear = interpolate(t, [0.2, 1.6], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const breathe = 0.85 + 0.15 * Math.sin(t * 3.1);
  const streak = interpolate(t, [2.6, 4.0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const s = appear * breathe;
  return (
    <AbsoluteFill style={{ background: C.night, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 900 * s + streak * 2200, height: 2 + streak * 2, background: `linear-gradient(90deg, transparent, rgba(255,214,166,${0.55 * s}), transparent)`, filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,214,166,${0.32 * s}), transparent 60%)` }} />
      <div style={{ position: 'absolute', width: 10 + streak * 30, height: 10 + streak * 30, borderRadius: '50%', background: '#fffaf0', opacity: appear, boxShadow: `0 0 ${24 * s}px #fff, 0 0 ${80 * s}px ${C.inkHot}, 0 0 ${180 * s}px ${C.ink}` }} />
    </AbsoluteFill>
  );
};

/** The title: the mark builds, SOLARIS settles, the promise underneath. */
const Title: React.FC<{ tagline?: string; url?: boolean }> = ({ tagline = 'The real Solar System. Live in your browser.', url = false }) => {
  const f = useCurrentFrame();
  const sub = interpolate(f, [52, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const u = interpolate(f, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const drift = 1 + f * 0.0006;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <Mark size={250} start={0} />
        <div style={{ fontFamily: montserrat, marginLeft: '0.52em' }}>
          <Wordmark start={22} size={78} />
        </div>
        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 38, color: C.inkHot, opacity: sub, transform: `translateY(${(1 - sub) * 14}px)`, letterSpacing: '0.01em' }}>{tagline}</div>
        {url && (
          <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.3em', color: C.mint, opacity: u, marginTop: 6, textTransform: 'uppercase' }}>solarises.vercel.app</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** 27,000 years: the light-clock leaves hours behind. */
const DeepTime: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const k = interpolate(t, [0.3, 2.0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.5, 0, 0.1, 1) });
  const n = Math.round(27000 * k);
  const o = interpolate(t, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 110, bottom: 96, opacity: o }}>
      <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: '0.34em', color: C.mint, textTransform: 'uppercase', marginBottom: 8 }}>Light time to the centre of the galaxy</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
        <span style={{ fontFamily: mono, fontWeight: 300, fontSize: 96, color: C.inkHot, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 40px rgba(255,190,120,0.4)' }}>{n.toLocaleString('en-US')}</span>
        <span style={{ fontFamily: montserrat, fontWeight: 300, fontSize: 34, letterSpacing: '0.4em', color: C.white }}>YEARS</span>
      </div>
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30, color: C.dim, marginTop: 4 }}>Sagittarius A*, the black hole at the heart of the Milky Way</div>
    </div>
  );
};

/** A soft dark band so type stays legible over the bright Sun. */
const Scrim: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [0, 18], [0, 1], { extrapolateRight: 'clamp' }), interpolate(f, [sec(10.2) - 14, sec(10.2)], [1, 0], { extrapolateLeft: 'clamp' }));
  return <AbsoluteFill style={{ pointerEvents: 'none', opacity: o, background: 'radial-gradient(ellipse 62% 32% at 50% 50%, rgba(8,3,0,0.78), rgba(8,3,0,0.45) 55%, transparent 100%)' }} />;
};

const Black: React.FC<{ from: number; to: number; inS?: number; outS?: number }> = ({ from, to, inS = 0, outS = 0 }) => {
  const f = useCurrentFrame() / FPS;
  if (f < from || f > to) return null;
  const o = Math.max(
    inS ? interpolate(f, [from, from + inS], [1, 0], { extrapolateRight: 'clamp' }) : 0,
    outS ? interpolate(f, [to - outS, to], [0, 1], { extrapolateLeft: 'clamp' }) : 0
  );
  return <AbsoluteFill style={{ background: C.night, opacity: o, pointerEvents: 'none' }} />;
};

// ---- the film ----------------------------------------------------------------------------------
export const Launch: React.FC = () => {
  const cuts = [bar(1), ...JOURNEY.map((j) => j.from), bar(9), bar(10), skyAt(1), skyAt(2), skyAt(3), late(bar(11)), late(bar(11)) + H, late(bar(12)), late(bar(13)), late(bar(13)) + H, late(bar(14)), late(bar(15)), late(bar(16))];
  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: montserrat }}>
      {/* ---------------- picture ---------------- */}
      <At from={0} to={4.3} name="Photon"><Photon /></At>
      <At from={3.9} to={15.2} name="Sun"><Shot src="sun" from={0.4} push={0.12} punch={false} grade="contrast(1.08) saturate(1.15)" /></At>
      <At from={15.0} to={bar(1)} name="Title">
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, #1a0f08 0%, ${C.night} 62%)` }} />
        <Motes n={46} opacity={0.5} />
        <Title />
      </At>
      <At from={bar(1)} to={bar(2)} name="Warp"><Shot src="warp" from={0.2} push={0.18} /></At>
      {JOURNEY.map((j) => (
        <At key={j.shot} from={j.from} to={j.to} name={j.shot}><Shot src={j.shot} from={j.clipFrom ?? 0.4} /></At>
      ))}
      <At from={bar(9)} to={bar(10)} name="ui_overview"><Screen src="ui_overview" from={0.4} /></At>
      <At from={skyAt(0) - 0.6} to={skyAt(4)} name="Skies"><Skies /></At>
      <At from={bar(10)} to={bar(11)} name="ui_explorer"><Screen src="ui_explorer" from={0.6} focus="85% 25%" zoom={0.12} exit={18} /></At>
      <At from={late(bar(11))} to={late(bar(11)) + H} name="nebula"><Shot src="nebula" from={1.0} push={0.1} /></At>
      <At from={late(bar(11)) + H} to={late(bar(12))} name="nebula2"><Shot src="nebula2" from={1.0} push={0.1} /></At>
      <At from={late(bar(12))} to={late(bar(13))} name="ui_vela"><Screen src="ui_vela" from={0.2} focus="45% 88%" zoom={0.14} /></At>
      <At from={late(bar(13))} to={late(bar(13)) + H} name="ui_vinyl"><Screen src="ui_vinyl" from={0.8} focus="60% 25%" zoom={0.1} /></At>
      <At from={late(bar(13)) + H} to={late(bar(14))} name="ui_atlas"><Screen src="ui_atlas" from={1.0} /></At>
      <At from={late(bar(14))} to={late(bar(15))} name="galaxy"><Shot src="galaxy" from={3.4} push={0.1} /></At>
      <At from={late(bar(15))} to={late(bar(16))} name="sgra"><Shot src="sgra" from={0.6} push={0.1} /></At>
      <At from={late(bar(16))} to={late(bar(17)) + 0.4} name="bh_sea"><Shot src="bh_sea" from={0.3} push={0.06} punch={false} /></At>
      <At from={late(bar(17))} to={DURATION} name="Lockup">
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, #160d07 0%, ${C.night} 60%)` }} />
        <Motes n={36} opacity={0.4} />
        <Title tagline="The real Solar System. Live in your browser." url />
      </At>

      {/* ---------------- grade & light ---------------- */}
      <Vignette />
      <Grain />
      {cuts.map((c, i) => (
        <Glint key={i} at={sec(c) - 2} />
      ))}
      <LightLeak at={sec(4.0)} dur={sec(2.4)} side="left" />
      <LightLeak at={sec(bar(3))} dur={sec(1.6)} />
      <LightLeak at={sec(late(bar(11)))} dur={sec(2.2)} hue="255, 120, 80" side="left" />
      <LightLeak at={sec(late(bar(17))) - 6} dur={sec(2.6)} />
      <Flash at={sec(15.0)} dur={16} peak={0.95} />
      <Flash at={sec(late(bar(14)))} dur={10} peak={0.5} />
      <Black from={late(bar(17)) - 0.5} to={late(bar(17)) + 0.4} inS={0} outS={0.5} />
      <Black from={DURATION - 1.6} to={DURATION} outS={1.6} />

      {/* ---------------- type ---------------- */}
      <At from={0.6} to={3.9} name="t:open">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 230 }}>
          <Rise text="Every light you see has already left." size={58} stagger={3} />
        </AbsoluteFill>
      </At>
      <At from={4.6} to={14.8} name="scrim"><Scrim /></At>
      <At from={5.0} to={9.0} name="t:sun1">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Rise text="The Sun" size={30} font={mono} color={C.mint} track="0.5em" upper />
          <div style={{ height: 18 }} />
          <Rise text="Every second, it lets go of more light than we will ever use." size={56} delay={8} stagger={2} />
        </AbsoluteFill>
      </At>
      <At from={9.4} to={14.6} name="t:sun2">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Rise text="8 minutes 20 seconds later, it reaches us." size={60} stagger={2} />
          <div style={{ height: 22 }} />
          <Rise text="Let's follow it." size={44} font={montserrat} weight={200} track="0.32em" upper delay={112} color={C.inkHot} />
        </AbsoluteFill>
      </At>
      <At from={bar(1)} to={bar(2)} name="t:follow">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Rise text="Follow the light" size={84} font={montserrat} weight={200} track="0.36em" upper stagger={4} />
        </AbsoluteFill>
      </At>

      <LightClock stops={STOPS} from={J} to={bar(9)} />

      <At from={bar(9)} to={bar(10)} name="c1"><Callout n="01" kicker="NASA JPL orbital elements" caps="The real sky" serifText="Every world exactly where it is, right now." /></At>
      <At from={bar(10)} to={bar(11)} name="c2"><Callout n="02" kicker="Surface view" caps="Stand anywhere" serifText="and look up." align="left" /></At>
      <At from={late(bar(11))} to={late(bar(12))} name="c3"><Callout n="03" kicker="Nebulae, up close" caps="Fly into the light" serifText="Cosmic Cliffs. The Helix. And more." /></At>
      <At from={late(bar(12))} to={late(bar(13))} name="c4"><Callout n="04" kicker="Your companion" caps="Meet Vela" serifText="She talks. She laughs. She remembers." /></At>
      <At from={late(bar(13))} to={late(bar(14))} name="c5"><Callout n="05" kicker="Atlas · Soundtrack · Gallery" caps="Yours to explore" serifText="478 worlds. A song for each one." /></At>
      <At from={late(bar(11))} to={late(bar(11)) + H} name="cap-n1"><Caption text="Cosmic Cliffs · 7,600 light-years" /></At>
      <At from={late(bar(11)) + H} to={late(bar(12))} name="cap-n2"><Caption text="The Helix · 650 light-years" /></At>

      <At from={late(bar(14))} to={late(bar(15))} name="t:beyond">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
          <Rise text="And beyond" size={72} font={montserrat} weight={200} track="0.4em" upper stagger={4} />
        </AbsoluteFill>
      </At>
      <At from={late(bar(15))} to={late(bar(16))} name="deep"><DeepTime /></At>
      <At from={late(bar(16)) + 0.2} to={late(bar(17)) - 0.2} name="t:why">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 170 }}>
          <Rise text="Why do you think people look up?" size={62} stagger={3} />
        </AbsoluteFill>
      </At>
      <At from={late(63.2)} to={DURATION - 0.8} name="t:lookup">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90 }}>
          <Rise text="Look up." size={40} font={montserrat} weight={200} track="0.6em" upper color={C.white} />
        </AbsoluteFill>
      </At>

      {/* ---------------- sound ---------------- */}
      <Audio
        src={staticFile('audio/helios-overture-ext.mp3')}
        volume={(f) => {
          const t = f / FPS;
          const duck = VO.some((v) => t > v.at - 0.15 && t < v.at + v.len + 0.2) ? 0.45 : 1;
          return 0.92 * duck * interpolate(t, [DURATION - 4, DURATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        }}
      />
      {VO.map((v) => (
        <Sequence key={v.src} from={sec(v.at)} durationInFrames={sec(v.len + 0.5)}>
          <Audio src={staticFile(`audio/${v.src}`)} volume={v.vol ?? 1} />
        </Sequence>
      ))}
      <SoundDesign />
    </AbsoluteFill>
  );
};

// Vela, in her own voice
const VO: Array<{ src: string; at: number; len: number; vol?: number }> = [
  { src: 'vela/film.open.mp3', at: 0.7, len: 3.42 },
  { src: 'vela/film.sun.mp3', at: 8.9, len: 5.83 },
  { src: 'vela/surface.2.mp3', at: bar(10) + 0.1, len: 3.78 },
  { src: 'vela/giggle.6.mp3', at: late(bar(12)) + 0.35, len: 1.15 },
  { src: 'vela/convo.why.q.mp3', at: late(bar(16)) + 0.3, len: 1.95 },
  { src: 'vela/noise.5.mp3', at: skyAt(3) + 0.4, len: 2.01 },
  { src: 'vela/film.end.mp3', at: late(63.0), len: 1.61 },
];
