import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from 'remotion';
import { C, FPS, bar, BEAT, mono, montserrat, serif, sec } from './theme';
import { Shot, Screen, Grain, Vignette, LightLeak, Glint, Flash, Motes } from './fx';
import { Mark, Wordmark } from './Logo';
import { Rise, Callout, Caption } from './Type';
import { LightClock, Stop } from './LightClock';
import { SoundDesign } from './Sound';

export const CINEMATIC_DURATION = 68.0;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const H = BEAT * 2; // half a bar (~1.25s)

const At: React.FC<{ from: number; to: number; children: React.ReactNode; name?: string }> = ({ from, to, children, name }) => (
  <Sequence from={sec(from)} durationInFrames={Math.max(1, sec(to) - sec(from))} name={name} layout="absolute-fill">
    {children}
  </Sequence>
);

// ---- Planetary journey ----
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

// ---- Motion graphics elements ----
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

const DeepTimeCounter: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const k = interpolate(t, [0.2, 1.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.5, 0, 0.1, 1) });
  const years = Math.round(4000000000 * k);
  const o = interpolate(t, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 110, bottom: 96, opacity: o }}>
      <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: '0.34em', color: C.mint, textTransform: 'uppercase', marginBottom: 8 }}>Deep Time · Future Epoch</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <span style={{ fontFamily: mono, fontWeight: 300, fontSize: 72, color: C.inkHot, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 30px rgba(255,190,120,0.4)' }}>
          +{(years / 1e9).toFixed(2)} BILLION
        </span>
        <span style={{ fontFamily: montserrat, fontWeight: 300, fontSize: 28, letterSpacing: '0.3em', color: C.white }}>YEARS</span>
      </div>
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 26, color: C.dim, marginTop: 4 }}>The collision of the Milky Way and Andromeda</div>
    </div>
  );
};

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

export const LaunchCinematic: React.FC = () => {
  // Key transition time markers
  const tSun = 4.0;
  const tTitle = 15.0;
  const tWarp = bar(1);
  const tJet = bar(9);       // ~38.9s
  const tJet2 = bar(10);      // ~41.4s
  const tJet3 = bar(10) + H;  // ~42.7s
  const tDeep1 = bar(11);     // ~43.9s
  const tDeep2 = bar(12);     // ~46.4s
  const tDeep3 = bar(13);     // ~48.9s
  const tGalaxy = bar(14);    // ~51.4s
  const tBlackHole = bar(15); // ~53.9s
  const tSea = bar(16);       // ~56.4s
  const tLockup = bar(17);    // ~58.9s

  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: montserrat }}>
      {/* ---------------- 1. Visual Footage ---------------- */}
      <At from={0} to={4.3} name="Photon"><Photon /></At>
      <At from={3.9} to={15.2} name="Sun"><Shot src="sun" from={0.4} push={0.12} punch={false} grade="contrast(1.08) saturate(1.15)" /></At>
      <At from={15.0} to={tWarp} name="Title">
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, #1a0f08 0%, ${C.night} 62%)` }} />
        <Motes n={46} opacity={0.5} />
        <Title />
      </At>
      <At from={tWarp} to={bar(2)} name="Warp"><Shot src="warp" from={0.2} push={0.18} /></At>

      {/* Planetary Journey */}
      {JOURNEY.map((j) => (
        <At key={j.shot} from={j.from} to={j.to} name={j.shot}><Shot src={j.shot} from={j.clipFrom ?? 0.4} /></At>
      ))}

      {/* Act 3: The Interplanetary Jet (NEW) */}
      <At from={tJet} to={tJet2} name="jet_olympus"><Shot src="jet_olympus" from={0.5} push={0.08} /></At>
      <At from={tJet2} to={tJet3} name="jet_saturn"><Shot src="jet_saturn" from={0.4} push={0.1} /></At>
      <At from={tJet3} to={tDeep1} name="jet_io"><Shot src="jet_io" from={0.3} push={0.12} /></At>

      {/* Act 4: Deep Time Future Eras (NEW) */}
      <At from={tDeep1} to={tDeep2} name="dt_red_giant"><Shot src="dt_red_giant" from={0.5} push={0.08} /></At>
      <At from={tDeep2} to={tDeep3} name="dt_andromeda"><Shot src="dt_andromeda" from={0.4} push={0.1} /></At>
      <At from={tDeep3} to={tGalaxy} name="dt_collision"><Shot src="dt_collision" from={0.3} push={0.12} /></At>

      {/* Act 5: Galactic Scale & Black Hole */}
      <At from={tGalaxy} to={tBlackHole} name="galaxy"><Shot src="galaxy" from={3.2} push={0.1} /></At>
      <At from={tBlackHole} to={tSea} name="sgra"><Shot src="sgra" from={0.6} push={0.12} /></At>
      <At from={tSea} to={tLockup + 0.4} name="bh_sea"><Shot src="bh_sea" from={0.3} push={0.06} punch={false} /></At>

      {/* Final Lockup */}
      <At from={tLockup} to={CINEMATIC_DURATION} name="Lockup">
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, #160d07 0%, ${C.night} 60%)` }} />
        <Motes n={36} opacity={0.4} />
        <Title tagline="The real Solar System. Live in your browser." url />
      </At>

      {/* ---------------- 2. Color Grading & Lighting ---------------- */}
      <Vignette />
      <Grain />
      <LightLeak at={sec(4.0)} dur={sec(2.4)} side="left" />
      <LightLeak at={sec(bar(3))} dur={sec(1.6)} />
      <LightLeak at={sec(tJet)} dur={sec(2.0)} hue="255, 130, 80" side="left" />
      <LightLeak at={sec(tDeep1)} dur={sec(2.2)} hue="255, 80, 140" side="right" />
      <LightLeak at={sec(tLockup) - 6} dur={sec(2.6)} />
      <Flash at={sec(15.0)} dur={16} peak={0.95} />
      <Flash at={sec(tJet)} dur={12} peak={0.6} />
      <Flash at={sec(tGalaxy)} dur={10} peak={0.6} />
      <Black from={tLockup - 0.4} to={tLockup + 0.4} inS={0} outS={0.4} />
      <Black from={CINEMATIC_DURATION - 1.6} to={CINEMATIC_DURATION} outS={1.6} />

      {/* ---------------- 3. Kinetic Typography ---------------- */}
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

      {/* Light Clock across the planetary journey */}
      <LightClock stops={STOPS} from={J} to={bar(9)} />

      {/* Jet Callout */}
      <At from={tJet} to={tDeep1} name="c:jet">
        <Callout n="01" kicker="Flight Mode · Any World" caps="Take the controls" serifText="Fly across planetary terrain and rings." />
      </At>
      <At from={tJet} to={tJet2} name="cap-jet1"><Caption text="Olympus Mons · Mars" /></At>
      <At from={tJet2} to={tJet3} name="cap-jet2"><Caption text="The Ring Plane · Saturn" /></At>
      <At from={tJet3} to={tDeep1} name="cap-jet3"><Caption text="Io under Jupiter" /></At>

      {/* Deep Time Callout */}
      <At from={tDeep1} to={tGalaxy} name="c:deep">
        <Callout n="02" kicker="Deep Time Engine" caps="Every sky, every era" serifText="From today to the end of the universe." />
      </At>
      <At from={tDeep1} to={tDeep2} name="cap-dt1"><Caption text="+5 Billion Years · The Red Giant Sun" /></At>
      <At from={tDeep2} to={tDeep3} name="cap-dt2"><Caption text="+3.75 Billion Years · Andromeda Approaches" /></At>
      <At from={tDeep3} to={tGalaxy} name="cap-dt3"><Caption text="+4 Billion Years · The Galactic Collision" /></At>

      <At from={tDeep3} to={tGalaxy} name="counter"><DeepTimeCounter /></At>

      <At from={tGalaxy} to={tBlackHole} name="t:beyond">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
          <Rise text="And beyond" size={72} font={montserrat} weight={200} track="0.4em" upper stagger={4} />
        </AbsoluteFill>
      </At>

      <At from={tSea + 0.2} to={tLockup - 0.2} name="t:why">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 170 }}>
          <Rise text="Why do you think people look up?" size={62} stagger={3} />
        </AbsoluteFill>
      </At>

      <At from={tLockup + 4.2} to={CINEMATIC_DURATION - 0.8} name="t:lookup">
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90 }}>
          <Rise text="Look up." size={40} font={montserrat} weight={200} track="0.6em" upper color={C.white} />
        </AbsoluteFill>
      </At>

      {/* ---------------- 4. Audio & Voice Design ---------------- */}
      <Audio
        src={staticFile('audio/helios-overture-ext.mp3')}
        volume={(f) => {
          const t = f / FPS;
          const duck = VO.some((v) => t > v.at - 0.15 && t < v.at + v.len + 0.2) ? 0.45 : 1;
          return 0.92 * duck * interpolate(t, [CINEMATIC_DURATION - 4, CINEMATIC_DURATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
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

const VO: Array<{ src: string; at: number; len: number; vol?: number }> = [
  { src: 'vela/film.open.mp3', at: 0.7, len: 3.42 },
  { src: 'vela/film.sun.mp3', at: 8.9, len: 5.83 },
  { src: 'vela/surface.2.mp3', at: bar(9) + 0.2, len: 3.78 },
  { src: 'vela/convo.why.q.mp3', at: bar(16) + 0.3, len: 1.95 },
  { src: 'vela/film.end.mp3', at: bar(17) + 3.8, len: 1.61 },
];
