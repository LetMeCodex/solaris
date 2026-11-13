import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { loadFont as loadRajdhani } from '@remotion/google-fonts/Rajdhani';
import { C, FPS, mono, montserrat, serif, sec } from './theme';
import { Shot, Grain, Vignette, Flash, LightLeak } from './fx';
import { Mark, Wordmark } from './Logo';

/**
 * SOLARIS 2.0, "Now you can fly it": the third launch film (see STORYBOARD-FLIGHT.md).
 * Cut on the half-bars of "Cathedral of Storms" (156.6 BPM; half-time beat 0.766 s).
 */
const head = loadRajdhani('normal', { weights: ['500', '600', '700'], subsets: ['latin'] }).fontFamily;

const T0 = 0.197;
const HALF = 1.5324; // two half-time beats: one cut
/** Time of cut n (seconds). */
const g = (n: number) => T0 + n * HALF;
export const FLIGHT_DURATION = 54.4;

const PAPER = '#f3f1ec';
const INK = '#141416';
const HOT = '#ff6a3d';
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode; name?: string }> = ({ from, to, children, name }) => (
  <Sequence from={sec(from)} durationInFrames={Math.max(1, sec(to) - sec(from))} name={name} layout="absolute-fill">
    {children}
  </Sequence>
);

// ------------------------------------------------------------------------------------ type pieces

/** A white pill with an icon, sitting inside a sentence. */
const Chip: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; at?: number; size?: number; dark?: boolean; hot?: boolean }> = ({ children, icon, at = 0, size = 76, dark = false, hot = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: size * 0.2, padding: `${size * 0.1}px ${size * 0.34}px`, margin: `0 ${size * 0.12}px`,
        borderRadius: size, background: hot ? HOT : dark ? 'rgba(12,16,18,0.72)' : '#ffffff', color: hot ? '#fff' : dark ? '#fff' : INK,
        border: dark ? '1.5px solid rgba(109,252,192,0.55)' : 'none',
        boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 12px 44px rgba(0,0,0,0.28)', transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.6),
        fontSize: size * 0.82, lineHeight: 1.1, verticalAlign: 'middle',
      }}
    >
      {icon}
      {children}
    </span>
  );
};

const Ico = {
  jet: (s: number, c = HOT) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M21.5 2.5 14 10l2.5 10-2 2-4-8.5L6 17l.5 3L5 21.5 3.5 18 0 16.5 1.5 15l3 .5L8 12 0 8l2-2 10 2.5 7.500-7.500c1-1 2.500-.500 2 1.500z" transform="translate(1 0)" /></svg>
  ),
  globe: (s: number, c = '#2f7df6') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.500c3 3 3 16 0 19M12 2.500c-3 3-3 16 0 19" /></svg>
  ),
  cube: (s: number, c = '#12a36b') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><path d="M12 2.500 21 7v10l-9 4.500L3 17V7z" /><path d="M3 7l9 4.500L21 7M12 11.500V21.500" /></svg>
  ),
  up: (s: number, c = HOT) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V4M5 11l7-7 7 7" /></svg>
  ),
  sat: (s: number, c = '#6dfcc0') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)" /><path d="M4 4l4 4M16 16l4 4M3 9l3-3M15 21l3-3M18 3l-3 3M6 18l3-3" /></svg>
  ),
};

/** A sentence on footage: words rise in turn; chips pop. `parts` are strings or elements. */
const Line: React.FC<{ parts: React.ReactNode[]; size?: number; y?: string; stagger?: number; color?: string; shadow?: boolean }> = ({ parts, size = 92, y = '50%', stagger = 4, color = '#fff', shadow = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const outO = interpolate(f, [d - 7, d], [1, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: `${size * 0.1}px ${size * 0.24}px`, padding: '0 140px', fontFamily: head, fontWeight: 600, fontSize: size, color, letterSpacing: '-0.01em', opacity: outO, textShadow: shadow ? '0 4px 50px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)' : 'none' }}>
      {parts.map((p, i) => {
        const t = f - i * stagger;
        const yy = interpolate(t, [0, 14], [46, 0], { ...clamp, easing: ease });
        const o = interpolate(t, [0, 8], [0, 1], clamp);
        const bl = interpolate(t, [0, 10], [10, 0], clamp);
        return (
          <span key={i} style={{ display: 'inline-block', transform: `translateY(${yy}px)`, opacity: o, filter: `blur(${bl}px)` }}>
            {p}
          </span>
        );
      })}
    </div>
  );
};

/** Text that decodes: letters lock left to right out of scrambled glyphs (as the game's HUD does). */
const useDecode = (text: string, start = 0, per = 0.9): string => {
  const f = useCurrentFrame() - start;
  const G = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#<>=+';
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || f > 3 + i * per) out += ch;
    else if (f > i * per - 6) out += G[Math.floor(random(`${text}-${i}-${Math.floor(f / 2)}`) * G.length)];
    else out += ' ';
  }
  return out;
};

const dms = (lat: number, lon: number): string => {
  const one = (v: number, p: string, n: string, w: number) => {
    const a = Math.abs(v);
    const d = Math.floor(a);
    const m = Math.floor((a - d) * 60);
    const s = ((a - d) * 60 - m) * 60;
    return `${String(d).padStart(w, '0')}°${String(m).padStart(2, '0')}'${s.toFixed(1).padStart(4, '0')}"${v >= 0 ? p : n}`;
  };
  return `${one(lat, 'N', 'S', 2)}  ${one(lon, 'E', 'W', 3)}`;
};

/** The game's tactical location card, drawn for the film: tag, decoding name, place, fix. */
const TacCard: React.FC<{ title: string; sub: string; fix: string; tag?: string; right?: boolean; bottom?: number }> = ({ title, sub, fix, tag = 'LOC', right = false, bottom = 86 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const t = useDecode(title, 2, 1.1);
  const s = useDecode(sub.toUpperCase(), 8, 0.4);
  const c = useDecode(fix, 12, 0.35);
  const W = Math.max(430, title.length * 30 + 120);
  const mint = (a: number) => `rgba(109,252,192,${a})`;
  const br = (pos: React.CSSProperties) => <div style={{ position: 'absolute', width: 14, height: 14, ...pos }} />;
  return (
    <div style={{ position: 'absolute', bottom, ...(right ? { right: 86 } : { left: 86 }), width: W, height: 150, opacity: 0.3 + 0.7 * k, fontFamily: mono }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(4,10,12,0.62), rgba(4,10,12,0.25) 75%, rgba(4,10,12,0))', clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }} />
      {br({ left: 0, top: 0, borderLeft: `2px solid ${mint(0.7)}`, borderTop: `2px solid ${mint(0.7)}` })}
      {br({ left: 0, bottom: 0, borderLeft: `2px solid ${mint(0.7)}`, borderBottom: `2px solid ${mint(0.7)}` })}
      {br({ right: 0, bottom: 0, borderRight: `2px solid ${mint(0.7)}`, borderBottom: `2px solid ${mint(0.7)}` })}
      <div style={{ position: 'absolute', left: -9, top: 12, bottom: 12, width: 3, background: mint(0.85) }} />
      <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: mint(0.92), color: '#04120c', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', padding: '2px 8px' }}>{tag}</span>
        <span style={{ width: 6, height: 6, background: f < 26 && f % 6 < 3 ? '#f4cd72' : mint(0.9) }} />
        <span style={{ width: (W - 150) * k, height: 1, background: mint(0.35) }} />
      </div>
      <div style={{ position: 'absolute', left: 16, top: 38, fontFamily: head, fontWeight: 700, fontSize: 46, letterSpacing: '0.07em', color: '#f3f6f4', whiteSpace: 'pre' }}>
        {t}
        <span style={{ display: 'inline-block', width: 14, height: 34, marginLeft: 8, background: mint(f < 30 || f % 16 < 8 ? 0.9 : 0.25), verticalAlign: '-3px' }} />
      </div>
      <div style={{ position: 'absolute', left: 16, top: 94, fontFamily: head, fontWeight: 600, fontSize: 17, letterSpacing: '0.16em', color: 'rgba(240,244,242,0.72)', whiteSpace: 'pre' }}>{s}</div>
      <div style={{ position: 'absolute', left: 16, top: 119, fontSize: 15, letterSpacing: '0.04em', color: mint(0.95), whiteSpace: 'pre' }}>{c}</div>
      {f < 22 && <div style={{ position: 'absolute', left: 0, right: 0, top: `${ease(f / 22) * 100}%`, height: 2, background: mint(0.7), boxShadow: `0 -14px 22px ${mint(0.25)}` }} />}
    </div>
  );
};

/** A small mono kicker top-left (section name) with a live dot. */
const Kicker: React.FC<{ text: string; n?: string }> = ({ text, n }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [d - 6, d], [1, 0], clamp));
  return (
    <div style={{ position: 'absolute', top: 62, left: 86, display: 'flex', alignItems: 'center', gap: 14, fontFamily: mono, fontSize: 16, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.8)', opacity: o, textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 8, background: C.mint, boxShadow: `0 0 12px ${C.mint}` }} />
      {n && <span style={{ color: C.ink }}>{n}</span>}
      {text}
    </div>
  );
};

/** A soft dark veil so type reads on bright footage. */
const Veil: React.FC<{ k?: number }> = ({ k = 0.28 }) => <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(5,4,7,${k}), rgba(5,4,7,${k * 0.25}) 70%, transparent)` }} />;

// ------------------------------------------------------------------------------------ 1 · the hook

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const A = "You've ";
  const B = ' the Solar System.';
  const full = `${A}seen${B}`;
  const typeEnd = 62; // frames to type the sentence
  const n = Math.floor(interpolate(f, [8, typeEnd], [0, full.length], clamp));
  const swapAt = sec(3.83 - 0.0) - 0; // the music's first hit
  const delN = Math.floor(interpolate(f, [swapAt - 16, swapAt - 4], [0, 4], clamp));
  const swapped = f >= swapAt;
  const pop = spring({ frame: f - swapAt, fps, config: { damping: 9, stiffness: 190, mass: 0.6 } });
  const typed = full.slice(0, n);
  const before = typed.slice(0, Math.min(typed.length, A.length));
  const word = typed.length > A.length ? typed.slice(A.length, Math.min(typed.length, A.length + 4)) : '';
  const after = typed.length > A.length + 4 ? typed.slice(A.length + 4) : '';
  const shown = swapped ? '' : word.slice(0, Math.max(0, word.length - delN));
  const caretOn = f % 16 < 9 || (f > 8 && f < typeEnd) || (f > swapAt - 18 && f < swapAt + 4);
  const caret = <span style={{ display: 'inline-block', width: 5, height: 92, background: HOT, marginLeft: 3, marginRight: 3, verticalAlign: '-14px', opacity: caretOn ? 1 : 0 }} />;
  const zoom = 1 + 0.035 * (f / sec(4.8)) + (swapped ? 0.03 * pop : 0);
  const dots: Array<[number, number]> = [[-520, -150], [520, -150], [-520, 150], [520, 150]];
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${zoom})`, fontFamily: head, fontWeight: 600, fontSize: 104, color: INK, letterSpacing: '-0.015em', whiteSpace: 'pre', display: 'flex', alignItems: 'center' }}>
        <span>{before}</span>
        {swapped ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, color: '#fff', background: HOT, borderRadius: 80, padding: '2px 36px 6px 30px', margin: '0 4px', transform: `scale(${0.7 + 0.3 * pop}) rotate(${(1 - pop) * -4}deg)`, boxShadow: '0 18px 50px rgba(255,106,61,0.35)' }}>
            {Ico.jet(64, '#fff')}flown
          </span>
        ) : (
          <span style={{ color: delN > 0 ? HOT : INK }}>{shown}</span>
        )}
        {!swapped && typed.length <= A.length + 4 && caret}
        {!swapped && typed.length > A.length + 4 && delN > 0 && caret}
        <span>{after}</span>
        {!swapped && typed.length > A.length + 4 && delN === 0 && caret}
      </div>
      {dots.map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: 960 + x, top: 540 + y, width: 7, height: 7, borderRadius: 7, background: INK, opacity: interpolate(f, [2 + i * 2, 10 + i * 2], [0, 0.85], clamp) }} />
      ))}
      <div style={{ position: 'absolute', bottom: 70, left: 86, fontFamily: mono, fontSize: 15, letterSpacing: '0.3em', color: 'rgba(20,20,22,0.5)' }}>SOLARIS · UPDATE 2.0</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 2 · ignition

const Subtitle: React.FC<{ who: string; text: string }> = ({ who, text }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  const n = Math.floor(interpolate(f, [4, Math.min(d - 20, 4 + text.length * 1.1)], [0, text.length], clamp));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'center', opacity: o }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(8,12,14,0.72)', border: '1px solid rgba(109,252,192,0.35)', borderRadius: 60, padding: '14px 30px 14px 20px', boxShadow: '0 16px 50px rgba(0,0,0,0.45)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 30 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} style={{ width: 4, borderRadius: 3, background: C.mint, height: 6 + 24 * Math.abs(Math.sin(f * 0.55 + i * 1.7)) * (n < text.length ? 1 : 0.25) }} />
          ))}
        </div>
        <span style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.2em', color: C.mint }}>{who}</span>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 34, color: '#fff' }}>“{text.slice(0, n)}”</span>
      </div>
    </div>
  );
};

const Ignition: React.FC<{ shot: string }> = ({ shot }) => {
  const f = useCurrentFrame();
  const up = interpolate(f, [0, 34], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: up, transform: `scale(${1.12 - 0.12 * up})` }}>
        <Shot src={shot} from={0.2} push={0.04} punch={false} />
      </AbsoluteFill>
      <Vignette strength={0.5} />
      <Sequence from={30} layout="none">
        <Line y="27%" size={74} parts={[<Chip key="c" dark size={58} icon={Ico.jet(40, C.mint)}><span style={{ fontFamily: mono, letterSpacing: '0.18em', fontSize: 36 }}>SOLARIS 2.0</span></Chip>, 'Now you can', <Chip key="f" hot icon={Ico.jet(52, '#fff')}>fly it.</Chip>]} />
      </Sequence>
      <Sequence from={48} layout="none">
        <Subtitle who="CONTROL" text="Solaris One-One, cleared as filed. Sky's all yours today." />
      </Sequence>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 3 · the whole Earth

interface Place { shot: string; title: string; sub: string; lat: number; lon: number; from?: number; cam?: string }
const EARTH: Place[] = [
  { shot: 'e_manhattan', title: 'NEW YORK', sub: 'Manhattan, United States', lat: 40.758, lon: -73.985 },
  { shot: 'e_everest', title: 'MOUNT EVEREST', sub: 'Himalaya, Nepal / Tibet', lat: 27.988, lon: 86.925 },
  { shot: 'e_paris', title: 'PARIS', sub: 'Île-de-France, France', lat: 48.858, lon: 2.294 },
  { shot: 'e_giza', title: 'GIZA', sub: 'The pyramids, Egypt', lat: 29.979, lon: 31.134 },
  { shot: 'e_tokyo', title: 'TOKYO', sub: 'Minato, Japan', lat: 35.659, lon: 139.745 },
  { shot: 'e_canyon', title: 'GRAND CANYON', sub: 'Arizona, United States', lat: 36.1, lon: -112.1 },
];
const EARTH_FAST: Place[] = [
  { shot: 'e_goldengate', title: 'SAN FRANCISCO', sub: 'California, United States', lat: 37.82, lon: -122.478 },
  { shot: 'e_sydney', title: 'SYDNEY', sub: 'New South Wales, Australia', lat: -33.857, lon: 151.215 },
  { shot: 'e_rio', title: 'RIO DE JANEIRO', sub: 'Brazil', lat: -22.952, lon: -43.21 },
  { shot: 'e_london', title: 'LONDON', sub: 'United Kingdom', lat: 51.505, lon: -0.075 },
];

const PlaceCut: React.FC<{ p: Place; card?: boolean }> = ({ p, card = true }) => (
  <AbsoluteFill>
    <Shot src={p.shot} from={p.from ?? 0.6} push={0.07} />
    <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(5,4,7,0.5), transparent 32%)' }} />
    {card && <TacCard title={p.title} sub={p.sub} fix={dms(p.lat, p.lon)} />}
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------ 4 · four cameras

const CAMS: Array<{ shot: string; label: string; key: string }> = [
  { shot: 'cam_chase', label: 'CHASE', key: 'C' },
  { shot: 'cam_cockpit', label: 'COCKPIT', key: 'C' },
  { shot: 'cam_gopro', label: 'GOPRO', key: 'C' },
  { shot: 'cam_flyby', label: 'FLY-BY', key: 'C' },
];

const Cameras: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: d } = useVideoConfig();
  const per = d / 4;
  const active = Math.min(3, Math.floor(f / per));
  // Each camera takes the frame in turn; the other three wait as thumbnails along the bottom
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {CAMS.map((c, i) => {
        const on = i === active;
        const s = spring({ frame: f - i * per, fps, config: { damping: 16, stiffness: 120 } });
        if (!on) return null;
        return (
          <AbsoluteFill key={i} style={{ transform: `scale(${1.08 - 0.08 * s})`, opacity: Math.min(1, s * 2) }}>
            <OffthreadVideo src={staticFile(`shots/${c.shot}.mp4`)} startFrom={Math.round((0.5 + (i * per) / FPS) * FPS) % 60} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(5,4,7,0.7), transparent 38%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70, display: 'flex', justifyContent: 'center', gap: 22 }}>
        {CAMS.map((c, i) => {
          const on = i === active;
          const done = f > i * per;
          return (
            <div key={i} style={{ width: 300, height: 169, borderRadius: 14, overflow: 'hidden', position: 'relative', border: on ? `2.5px solid ${C.mint}` : '1.5px solid rgba(255,255,255,0.28)', transform: `translateY(${on ? -14 : 0}px) scale(${on ? 1.06 : 1})`, boxShadow: on ? `0 18px 50px rgba(0,0,0,0.6), 0 0 34px rgba(109,252,192,0.35)` : '0 10px 30px rgba(0,0,0,0.5)', opacity: done || on ? 1 : 0.55 }}>
              <OffthreadVideo src={staticFile(`shots/${c.shot}.mp4`)} startFrom={20} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: on ? 'none' : 'saturate(0.6) brightness(0.7)' }} />
              <div style={{ position: 'absolute', left: 12, bottom: 9, fontFamily: mono, fontSize: 15, letterSpacing: '0.22em', color: on ? C.mint : 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>{c.label}</div>
              {on && <div style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: `${((f - i * per) / per) * 100}%`, background: C.mint }} />}
            </div>
          );
        })}
      </div>
      <Line y="20%" size={84} parts={['Four', <Chip key="c" icon={<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={HOT} strokeWidth="2.200"><rect x="2.500" y="6" width="14" height="12" rx="2.500" /><path d="M16.500 10.500 21.500 7.500v9l-5-3z" /></svg>}>cameras.</Chip>, 'One', 'sky.']} />
      <Kicker n="02" text="PRESS C · CHANGE THE VIEW" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 5 · the HUD

const Note: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; sub: string; at: number }> = ({ x, y, tx, ty, text, sub, at }) => {
  const f = useCurrentFrame() - at;
  const k = interpolate(f, [0, 14], [0, 1], { ...clamp, easing: ease });
  const o = interpolate(f, [8, 16], [0, 1], clamp);
  const len = Math.hypot(tx - x, ty - y);
  const ang = (Math.atan2(ty - y, tx - x) * 180) / Math.PI;
  const left = tx < x;
  return (
    <>
      <div style={{ position: 'absolute', left: x, top: y, width: len * k, height: 2, background: HOT, transformOrigin: '0 50%', transform: `rotate(${ang}deg)` }} />
      <div style={{ position: 'absolute', left: x - 7, top: y - 7, width: 14, height: 14, borderRadius: 14, background: HOT, boxShadow: `0 0 0 ${6 * k}px rgba(255,106,61,0.25)`, transform: `scale(${k})` }} />
      <div style={{ position: 'absolute', top: ty - 34, ...(left ? { right: 1920 - tx + 10 } : { left: tx + 10 }), background: '#fff', borderRadius: 16, padding: '12px 20px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)', opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
        <div style={{ fontFamily: head, fontWeight: 700, fontSize: 28, color: INK, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 9, height: 9, borderRadius: 9, background: HOT }} />
          {text}
        </div>
        <div style={{ fontFamily: mono, fontSize: 14, color: 'rgba(20,20,22,0.6)', marginTop: 2 }}>{sub}</div>
      </div>
    </>
  );
};

const Hud: React.FC<{ shot: string }> = ({ shot }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 110 } });
  const W = 1920 * 0.66;
  const Hh = 1080 * 0.66;
  const L = (1920 - W) / 2;
  const Tp = 150;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ transform: 'scale(1.2)', filter: 'blur(40px) brightness(0.55) saturate(1.25)' }}>
        <OffthreadVideo src={staticFile(`shots/${shot}.mp4`)} startFrom={10} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: L, top: Tp, width: W, height: Hh, borderRadius: 22, overflow: 'hidden', transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + 0.06 * s})`, opacity: Math.min(1, s * 1.6), boxShadow: '0 50px 140px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.22)' }}>
        <OffthreadVideo src={staticFile(`shots/${shot}.mp4`)} startFrom={10} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <Note x={L + W * 0.16} y={Tp + Hh * 0.84} tx={L - 30} ty={Tp + Hh * 0.62} text="Where you really are" sub="place · MGRS grid · coordinates" at={16} />
      <Note x={L + W * 0.86} y={Tp + Hh * 0.82} tx={L + W + 30} ty={Tp + Hh * 0.58} text="Altitude, speed, Mach, G" sub="rolling digits · climb rate" at={30} />
      <Note x={L + W * 0.5} y={Tp + Hh * 0.115} tx={L + W + 30} ty={Tp + Hh * 0.2} text="Heading tape" sub="and your waypoint on it" at={44} />
      <Line y="8%" size={70} parts={['A', <Chip key="h" size={60} icon={Ico.cube(40, HOT)}>tactical HUD</Chip>, 'that tells the truth.']} />
      <Kicker n="03" text="LIVE FROM THE FLIGHT" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 6 · up, and NASA's fleet

const Counter: React.FC<{ to: number; label: string }> = ({ to, label }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const v = Math.round(interpolate(f, [4, 40], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  return (
    <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: '#fff', borderRadius: 26, padding: '14px 34px 14px 26px', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
        {Ico.sat(54, '#12a36b')}
        <span style={{ fontFamily: mono, fontWeight: 500, fontSize: 64, color: INK, minWidth: 150, textAlign: 'right' }}>{v}+</span>
        <span style={{ fontFamily: head, fontWeight: 600, fontSize: 32, color: INK, lineHeight: 1.05 }}>
          {label}
          <br />
          <span style={{ fontFamily: mono, fontSize: 16, color: 'rgba(20,20,22,0.55)', letterSpacing: '0.08em' }}>where they really are · right now</span>
        </span>
      </div>
    </div>
  );
};

const CraftCut: React.FC<{ shot: string; name: string; note: string }> = ({ shot, name, note }) => (
  <AbsoluteFill>
    <Shot src={shot} from={0.4} push={0.08} />
    <Vignette strength={0.45} />
    <TacCard tag="NASA" title={name} sub={note} fix="LIVE EPHEMERIS · NASA EYES 3D MODEL" />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------ 7 · postcards and lockup

const CARDS = ['crescent-saturn', 'earth-sliver', 'jupiter-night', 'martian-dusk', 'neptune-crescent', 'uranus-galaxy', 'charon-core', 'event-horizon-sea'];

const Postcards: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: d } = useVideoConfig();
  const out = interpolate(f, [d - 10, d], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: 'center', justifyContent: 'center' }}>
      {CARDS.map((c, i) => {
        const s = spring({ frame: f - i * 3, fps, config: { damping: 14, stiffness: 120 } });
        const mid = (CARDS.length - 1) / 2;
        const x = (i - mid) * 215 * s;
        const rot = (i - mid) * 5.5 * s;
        const y = Math.abs(i - mid) * 16 * s + (1 - s) * 500 - out * 900;
        return (
          <div key={c} style={{ position: 'absolute', width: 420, height: 300, borderRadius: 16, overflow: 'hidden', background: '#fff', padding: 10, boxSizing: 'border-box', transform: `translate(${x}px, ${y + 40}px) rotate(${rot}deg)`, boxShadow: '0 30px 70px rgba(0,0,0,0.28)', zIndex: i }}>
            <Img src={staticFile(`gallery/${c}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: serif, fontStyle: 'italic', fontSize: 84, color: INK, opacity: interpolate(f, [10, 24], [0, 1], clamp) * (1 - out) }}>It’s all real. It’s all there.</div>
    </AbsoluteFill>
  );
};

const Lockup: React.FC<{ shot: string }> = ({ shot }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ opacity: 0.5 * o, filter: 'blur(14px) brightness(0.6)', transform: 'scale(1.1)' }}>
        <Shot src={shot} from={0.5} push={0.05} punch={false} />
      </AbsoluteFill>
      <Vignette strength={0.8} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26, fontFamily: montserrat }}>
        <Mark size={170} start={2} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <Wordmark start={8} size={84} />
          <span style={{ fontFamily: mono, fontSize: 30, letterSpacing: '0.1em', color: '#04120c', background: C.mint, padding: '4px 16px', borderRadius: 40, opacity: interpolate(f, [30, 40], [0, 1], clamp), transform: `scale(${interpolate(f, [30, 42], [0.6, 1], { ...clamp, easing: ease })})` }}>2.0</span>
        </div>
        <div style={{ fontFamily: head, fontWeight: 600, fontSize: 44, color: '#fff', opacity: interpolate(f, [34, 48], [0, 1], clamp), letterSpacing: '0.02em' }}>Fly the Solar System.</div>
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.3em', color: C.ink, opacity: interpolate(f, [46, 60], [0, 1], clamp) }}>SOLARISES.VERCEL.APP</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ sound

interface Cue { src: string; at: number; len: number; vol: number; from?: number }
const cuts = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => g(a + i));
const CUES: Cue[] = [
  // the hook: keys, then the hit
  ...Array.from({ length: 14 }, (_, i) => ({ src: 'sfx/tick.wav', at: 0.3 + i * 0.125, len: 0.3, vol: 0.16 })),
  { src: 'sfx/riser.wav', at: 3.83 - 2.6, len: 2.7, vol: 0.4, from: 0.6 },
  { src: 'sfx/impact.wav', at: 3.83, len: 3.5, vol: 0.8 },
  // ignition
  { src: 'flight/engine_start.wav', at: g(3) - 0.1, len: 5.2, vol: 0.9 },
  { src: 'flight/radio_start.wav', at: g(3) + 1.5, len: 6, vol: 1.0 },
  { src: 'sfx/whoosh.wav', at: g(6) - 0.35, len: 1.6, vol: 0.55 },
  { src: 'sfx/impact.wav', at: g(6), len: 3, vol: 0.5 },
  // the Earth montage: a pass on every cut
  ...cuts(7, 12).map((at) => ({ src: 'sfx/whoosh.wav', at: at - 0.3, len: 1.2, vol: 0.3 })),
  ...[12.5, 13, 13.5].map((n) => ({ src: 'sfx/tick.wav', at: g(n), len: 0.4, vol: 0.4 })),
  { src: 'flight/engine_pass.wav', at: g(6), len: 12, vol: 0.34 },
  // cameras
  { src: 'sfx/whoosh.wav', at: g(14) - 0.35, len: 1.6, vol: 0.5 },
  ...[15, 16, 17].map((n) => ({ src: 'sfx/tick.wav', at: g(n), len: 0.4, vol: 0.45 })),
  // HUD
  { src: 'sfx/shimmer.wav', at: g(18), len: 4, vol: 0.3 },
  { src: 'flight/radio_mach.wav', at: g(18) + 1.2, len: 6, vol: 0.95 },
  { src: 'flight/breath.wav', at: g(18) + 0.2, len: 5.5, vol: 0.5 },
  // up
  { src: 'sfx/riser.wav', at: g(22) - 3.0, len: 3.2, vol: 0.5 },
  { src: 'sfx/impact.wav', at: g(22), len: 4, vol: 0.75 },
  { src: 'flight/radio_karman.wav', at: g(23) + 0.2, len: 7, vol: 0.95 },
  ...cuts(24, 26).map((at) => ({ src: 'sfx/tick.wav', at, len: 0.4, vol: 0.4 })),
  // the planets
  { src: 'sfx/whoosh.wav', at: g(27) - 0.35, len: 1.6, vol: 0.55 },
  ...cuts(28, 30).map((at) => ({ src: 'sfx/whoosh.wav', at: at - 0.3, len: 1.2, vol: 0.32 })),
  { src: 'flight/radio_saturn.wav', at: g(27) + 0.4, len: 6, vol: 0.95 },
  // postcards, lockup
  { src: 'sfx/shimmer.wav', at: g(31), len: 4, vol: 0.4 },
  { src: 'sfx/riser.wav', at: g(33) - 2.4, len: 2.5, vol: 0.4, from: 0.8 },
  { src: 'sfx/impact.wav', at: g(33), len: 4, vol: 0.85 },
];

/** The music sits back under the radio calls. */
const RADIO: Array<[number, number]> = [[g(3) + 1.4, g(3) + 6.2], [g(18) + 1.1, g(18) + 5.4], [g(23) + 0.1, g(23) + 6], [g(27) + 0.3, g(27) + 5.2]];
const musicVol = (frame: number): number => {
  const t = frame / FPS;
  let v = 0.72;
  for (const [a, b] of RADIO) {
    const k = Math.min(interpolate(t, [a - 0.25, a + 0.1], [0, 1], clamp), interpolate(t, [b - 0.1, b + 0.5], [1, 0], clamp));
    v *= 1 - 0.42 * k;
  }
  return v * interpolate(t, [FLIGHT_DURATION - 1.6, FLIGHT_DURATION], [1, 0], clamp);
};

// ------------------------------------------------------------------------------------ the film

export const Flight: React.FC = () => {
  const UP: Array<{ shot: string; name?: string; note?: string }> = [
    { shot: 'up_climb' },
    { shot: 'up_orbit' },
    { shot: 'n_iss', name: 'INTERNATIONAL SPACE STATION', note: '408 km up · 7.66 km/s' },
    { shot: 'n_hubble', name: 'HUBBLE', note: 'Low Earth orbit · since 1990' },
    { shot: 'n_jwst', name: 'JAMES WEBB', note: 'Sun-Earth L2 · 1.5 million km' },
  ];
  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: montserrat }}>
      {/* 1 · hook */}
      <At from={0} to={g(3)} name="hook"><Hook /></At>

      {/* 2 · ignition */}
      <At from={g(3)} to={g(6)} name="ignition"><Ignition shot="ui_cockpit" /></At>

      {/* 3 · the whole Earth */}
      {EARTH.map((p, i) => (
        <At key={p.shot} from={g(6 + i)} to={g(7 + i)} name={p.shot}><PlaceCut p={p} /></At>
      ))}
      {EARTH_FAST.map((p, i) => (
        <At key={p.shot} from={g(12 + i * 0.5)} to={g(12.5 + i * 0.5)} name={p.shot}><PlaceCut p={p} /></At>
      ))}
      <At from={g(6)} to={g(8)} name="line earth"><Veil /><Line y="40%" size={120} parts={['The', 'whole', <Chip key="e" size={104} icon={Ico.globe(70)}>Earth.</Chip>]} /><Kicker n="01" text="GOOGLE PHOTOREALISTIC 3D TILES · LIVE" /></At>
      <At from={g(8)} to={g(10)} name="line scale"><Veil /><Line y="40%" size={120} parts={['At', <Chip key="s" size={104} hot>1 : 1</Chip>, 'scale.']} /></At>
      <At from={g(10)} to={g(12)} name="line 3d"><Veil /><Line y="40%" size={120} parts={['In', <Chip key="d" size={104} icon={Ico.cube(70)}>real 3D.</Chip>]} /></At>
      <At from={g(12)} to={g(14)} name="line every"><Veil k={0.2} /><Line y="40%" size={104} stagger={5} parts={['Every city.', 'Every mountain.', 'Every street.']} /></At>
      <At from={g(6)} to={g(6) + 0.5}><Flash at={0} peak={0.7} /></At>

      {/* 4 · four cameras */}
      <At from={g(14)} to={g(18)} name="cameras"><Cameras /></At>

      {/* 5 · the HUD */}
      <At from={g(18)} to={g(22)} name="hud">
        <Hud shot="ui_hud" />
        <Sequence from={sec(1.1)} layout="none"><Subtitle who="TWO" text="Mach one! Feel that little shudder? That's the sound barrier waving goodbye." /></Sequence>
      </At>

      {/* 6 · up */}
      {UP.map((u, i) => (
        <At key={u.shot} from={g(22 + i)} to={g(23 + i)} name={u.shot}>
          {u.name ? <CraftCut shot={u.shot} name={u.name} note={u.note ?? ''} /> : <Shot src={u.shot} from={0.8} push={0.07} />}
        </At>
      ))}
      <At from={g(22)} to={g(24)} name="line climb"><Veil /><Line y="42%" size={120} parts={['Then', 'keep', <Chip key="u" size={104} icon={Ico.up(70)}>climbing.</Chip>]} /></At>
      <At from={g(24)} to={g(27)} name="counter"><Counter to={150} label="NASA spacecraft" /></At>
      <At from={g(22)} to={g(22) + 0.5}><Flash at={0} peak={0.6} /></At>

      {/* 7 · the Solar System */}
      <At from={g(27)} to={g(28)} name="p_saturn"><Shot src="p_saturn" from={0.8} push={0.07} /><TacCard tag="NAV" title="SATURN" sub="High orbit · light-time to Earth 1h 19m" fix="SOL 9.5420 AU" /></At>
      <At from={g(28)} to={g(29)} name="p_mars"><Shot src="p_mars" from={0.8} push={0.07} /><TacCard tag="NAV" title="OLYMPUS MONS" sub="Mars · three Everests tall" fix="SOL 1.6050 AU" /></At>
      <At from={g(29)} to={g(30)} name="n_voyager"><CraftCut shot="n_voyager" name="VOYAGER 1" note="Interstellar space · 25 billion km" /></At>
      <At from={g(30)} to={g(31)} name="p_jupiter"><Shot src="p_jupiter" from={0.8} push={0.07} /><TacCard tag="NAV" title="JUPITER" sub="Approach · light-time to Earth 43m" fix="SOL 5.2030 AU" /></At>
      <At from={g(27)} to={g(28)} name="line world"><Veil /><Line y="40%" size={120} parts={['Every', <Chip key="w" size={104} icon={Ico.globe(70, '#dcab76')}>world.</Chip>]} /><Kicker n="04" text="THE SAME HUD · THE SAME JET" /></At>
      <At from={g(28)} to={g(29)} name="line real"><Veil /><Line y="40%" size={120} parts={['Real', <Chip key="r" size={104} hot>distances.</Chip>]} /></At>
      <At from={g(30)} to={g(31)} name="line one"><Veil /><Line y="40%" size={120} parts={['One', <Chip key="j" size={104} icon={Ico.jet(70)}>jet.</Chip>]} /></At>

      {/* 8 · postcards and lockup */}
      <At from={g(31)} to={g(33)} name="postcards"><Postcards /></At>
      <At from={g(33)} to={FLIGHT_DURATION} name="lockup"><Lockup shot="p_saturn_cockpit" /><Flash at={0} peak={0.8} /></At>

      {/* finish */}
      <At from={g(3)} to={g(31)}><Grain opacity={0.05} /><LightLeak at={sec(g(6) - g(3))} dur={22} /><LightLeak at={sec(g(22) - g(3))} dur={22} side="left" /></At>

      {/* sound */}
      <Audio src={staticFile('audio/flight/music.mp3')} volume={(f) => musicVol(f)} />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.max(0, sec(c.at))} durationInFrames={sec(c.len)} name={`sfx ${c.src}`} layout="none">
          <Audio src={staticFile(`audio/${c.src}`)} volume={c.vol} startFrom={c.from ? sec(c.from) : 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
