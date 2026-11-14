import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadRajdhani } from '@remotion/google-fonts/Rajdhani';
import { C, FPS, mono, montserrat, sec, serif } from './theme';
import { Flash, Grain, LightLeak, Shot, Vignette } from './fx';
import { Mark, Wordmark } from './Logo';

/**
 * SOLARIS 2.0 — "Now you can fly it" (4K Upgrade)
 * Cut on the half-bars of "Cathedral of Storms" (156.6 BPM; HALF = 1.5324 s).
 */
const head = loadRajdhani('normal', { weights: ['500', '600', '700'], subsets: ['latin'] }).fontFamily;

const T0 = 0.197;
const HALF = 1.5324;
const g = (n: number) => T0 + n * HALF;

export const FLIGHT_DURATION = g(49); // ~75.285 s (~2259 frames @ 30fps)

const PAPER = '#f3f1ec';
const INK = '#141416';
const HOT = '#ff6a3d';
const CYAN = '#6dfcc0';
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const At: React.FC<{ from: number; to: number; children: React.ReactNode; name?: string }> = ({
  from,
  to,
  children,
  name,
}) => (
  <Sequence
    from={sec(from)}
    durationInFrames={Math.max(1, sec(to) - sec(from))}
    name={name}
    layout="absolute-fill"
  >
    {children}
  </Sequence>
);

// ------------------------------------------------------------------------------------ type & icons

const Chip: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  at?: number;
  size?: number;
  dark?: boolean;
  hot?: boolean;
}> = ({ children, icon, at = 0, size = 76, dark = false, hot = false }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.2,
        padding: `${size * 0.1}px ${size * 0.34}px`,
        margin: `0 ${size * 0.12}px`,
        borderRadius: size,
        background: hot ? HOT : dark ? 'rgba(8,14,18,0.8)' : '#ffffff',
        color: hot ? '#fff' : dark ? '#fff' : INK,
        border: dark ? '1.5px solid rgba(109,252,192,0.55)' : 'none',
        boxShadow: dark ? '0 10px 40px rgba(0,0,0,0.48)' : '0 12px 44px rgba(0,0,0,0.3)',
        transform: `scale(${0.6 + 0.4 * s})`,
        opacity: Math.min(1, s * 1.6),
        fontSize: size * 0.82,
        lineHeight: 1.1,
        verticalAlign: 'middle',
      }}
    >
      {icon}
      {children}
    </span>
  );
};

const Ico = {
  jet: (s: number, c = HOT) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path
        d="M21.5 2.5 14 10l2.5 10-2 2-4-8.5L6 17l.5 3L5 21.5 3.5 18 0 16.5 1.5 15l3 .5L8 12 0 8l2-2 10 2.5 7.500-7.500c1-1 2.500-.500 2 1.500z"
        transform="translate(1 0)"
      />
    </svg>
  ),
  globe: (s: number, c = '#2f7df6') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.500c3 3 3 16 0 19M12 2.500c-3 3-3 16 0 19" />
    </svg>
  ),
  cube: (s: number, c = '#12a36b') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
      <path d="M12 2.500 21 7v10l-9 4.500L3 17V7z" />
      <path d="M3 7l9 4.500L21 7M12 11.500V21.500" />
    </svg>
  ),
  up: (s: number, c = HOT) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V4M5 11l7-7 7 7" />
    </svg>
  ),
  sat: (s: number, c = '#6dfcc0') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)" />
      <path d="M4 4l4 4M16 16l4 4M3 9l3-3M15 21l3-3M18 3l-3 3M6 18l3-3" />
    </svg>
  ),
  storm: (s: number, c = '#2f7df6') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 18H7a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.4 1.5A3.5 3.5 0 0 1 17.5 18Z" />
      <path d="m13 13-2 4h3l-2 4" />
    </svg>
  ),
  eclipse: (s: number, c = HOT) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="13.5" cy="11" r="6" fill={c} fillOpacity="0.25" />
    </svg>
  ),
};

const Line: React.FC<{
  parts: React.ReactNode[];
  size?: number;
  y?: string;
  stagger?: number;
  color?: string;
  shadow?: boolean;
}> = ({ parts, size = 90, y = '36%', stagger = 4, color = '#fff', shadow = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const outO = interpolate(f, [d - 7, d], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: `${size * 0.1}px ${size * 0.24}px`,
        padding: '0 120px',
        fontFamily: head,
        fontWeight: 600,
        fontSize: size,
        color,
        letterSpacing: '-0.01em',
        opacity: outO,
        textShadow: shadow ? '0 4px 50px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.45)' : 'none',
      }}
    >
      {parts.map((p, i) => {
        const t = f - i * stagger;
        const yy = interpolate(t, [0, 14], [46, 0], { ...clamp, easing: ease });
        const o = interpolate(t, [0, 8], [0, 1], clamp);
        const bl = interpolate(t, [0, 10], [10, 0], clamp);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${yy}px)`,
              opacity: o,
              filter: `blur(${bl}px)`,
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

const useDecode = (text: string, start = 0, per = 0.85): string => {
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

/** Tactical corner location / airframe / era card, safely above bottom subtitle track. */
const TacCard: React.FC<{
  title: string;
  sub: string;
  fix: string;
  tag?: string;
  accent?: string;
  right?: boolean;
  bottom?: number;
}> = ({ title, sub, fix, tag = 'LOC', accent = CYAN, right = false, bottom = 132 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: ease });
  const t = useDecode(title, 0, 0.25);
  const s = useDecode(sub.toUpperCase(), 2, 0.14);
  const c = useDecode(fix, 3, 0.14);
  const W = Math.max(440, title.length * 29 + 120);
  const br = (pos: React.CSSProperties) => <div style={{ position: 'absolute', width: 14, height: 14, ...pos }} />;
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        ...(right ? { right: 74 } : { left: 74 }),
        width: W,
        height: 146,
        opacity: 0.3 + 0.7 * k,
        fontFamily: mono,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(4,10,14,0.72), rgba(4,10,14,0.32) 78%, rgba(4,10,14,0))',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }}
      />
      {br({ left: 0, top: 0, borderLeft: `2px solid ${accent}`, borderTop: `2px solid ${accent}` })}
      {br({ left: 0, bottom: 0, borderLeft: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` })}
      {br({ right: 0, bottom: 0, borderRight: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` })}
      <div style={{ position: 'absolute', left: -9, top: 12, bottom: 12, width: 3, background: accent }} />
      <div style={{ position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ background: accent, color: '#04120c', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', padding: '2px 8px' }}>
          {tag}
        </span>
        <span style={{ width: 6, height: 6, background: f < 24 && f % 6 < 3 ? '#f4cd72' : accent }} />
        <span style={{ width: (W - 150) * k, height: 1, background: 'rgba(255,255,255,0.22)' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 38,
          fontFamily: head,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: '0.07em',
          color: '#f3f6f4',
          whiteSpace: 'pre',
        }}
      >
        {t}
        <span
          style={{
            display: 'inline-block',
            width: 13,
            height: 32,
            marginLeft: 8,
            background: accent,
            opacity: f < 28 || f % 16 < 8 ? 0.9 : 0.25,
            verticalAlign: '-3px',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 91,
          fontFamily: head,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: '0.16em',
          color: 'rgba(240,244,242,0.78)',
          whiteSpace: 'pre',
        }}
      >
        {s}
      </div>
      <div style={{ position: 'absolute', left: 16, top: 116, fontSize: 14, letterSpacing: '0.04em', color: accent, whiteSpace: 'pre' }}>
        {c}
      </div>
      {f < 22 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${ease(f / 22) * 100}%`,
            height: 2,
            background: accent,
            boxShadow: `0 -14px 22px ${accent}`,
          }}
        />
      )}
    </div>
  );
};

const Kicker: React.FC<{ text: string; n?: string; accent?: string }> = ({ text, n, accent = C.mint }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [d - 6, d], [1, 0], clamp));
  return (
    <div
      style={{
        position: 'absolute',
        top: 46,
        left: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        borderRadius: 999,
        background: 'rgba(5,8,12,0.58)',
        border: '1px solid rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
        fontFamily: mono,
        fontSize: 15,
        letterSpacing: '0.24em',
        color: 'rgba(255,255,255,0.92)',
        opacity: o,
        textShadow: '0 1px 10px rgba(0,0,0,0.6)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 8, background: accent, boxShadow: `0 0 12px ${accent}` }} />
      {n && <span style={{ color: C.ink }}>{n}</span>}
      {text}
    </div>
  );
};

const Veil: React.FC<{ k?: number }> = ({ k = 0.28 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 58% at 50% 42%, rgba(5,4,7,${k}), rgba(5,4,7,${k * 0.25}) 72%, transparent)`,
    }}
  />
);

// ------------------------------------------------------------------------------------ Vela & Radio Subtitles

const VelaSub: React.FC<{ text: string; darkCard?: boolean }> = ({ text, darkCard = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  const n = Math.floor(interpolate(f, [3, Math.min(d - 14, 3 + text.length * 0.85)], [0, text.length], clamp));
  const pulse = 0.75 + 0.25 * Math.sin(f * 0.22);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', opacity: o, pointerEvents: 'none' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          maxWidth: 1180,
          background: darkCard ? 'rgba(6,11,16,0.78)' : 'rgba(18,20,26,0.88)',
          border: '1px solid rgba(109,252,192,0.42)',
          backdropFilter: 'blur(12px)',
          borderRadius: 60,
          padding: '11px 28px 11px 18px',
          boxShadow: '0 16px 46px rgba(0,0,0,0.48), 0 0 28px rgba(109,252,192,0.12)',
        }}
      >
        {/* Vela glowing orbital orb */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 30,
            flexShrink: 0,
            background: 'radial-gradient(circle at 38% 35%, #ffffff, #6dfcc0 52%, #19896e 100%)',
            boxShadow: `0 0 ${14 * pulse}px rgba(109,252,192,0.75)`,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 26, flexShrink: 0 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              style={{
                width: 3.5,
                borderRadius: 3,
                background: C.mint,
                height: 5 + 19 * Math.abs(Math.sin(f * 0.45 + i * 1.35)) * (f < d - 12 ? 1 : 0.25),
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: C.mint, flexShrink: 0 }}>VELA</span>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30, lineHeight: 1.15, color: '#fff' }}>
          “{text.slice(0, n)}”
        </span>
      </div>
    </div>
  );
};

const RadioSub: React.FC<{ who: string; text: string }> = ({ who, text }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  const n = Math.floor(interpolate(f, [3, Math.min(d - 16, 3 + text.length * 0.9)], [0, text.length], clamp));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', opacity: o, pointerEvents: 'none' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          maxWidth: 1120,
          background: 'rgba(10,12,16,0.76)',
          border: '1px solid rgba(255,106,61,0.42)',
          backdropFilter: 'blur(10px)',
          borderRadius: 60,
          padding: '11px 28px 11px 20px',
          boxShadow: '0 14px 44px rgba(0,0,0,0.48)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24, flexShrink: 0 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              style={{
                width: 3.5,
                borderRadius: 3,
                background: HOT,
                height: 5 + 17 * Math.abs(Math.sin(f * 0.55 + i * 1.7)) * (f < d - 12 ? 1 : 0.2),
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.2em', color: HOT, flexShrink: 0 }}>{who}</span>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 30, lineHeight: 1.15, color: '#fff' }}>
          “{text.slice(0, n)}”
        </span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------ 1 · Hook (Creative Solaris Solar System Backdrop)

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const A = "You've ";
  const B = ' the Solar System.';
  const full = `${A}seen${B}`;
  const typeEnd = 62;
  const n = Math.floor(interpolate(f, [8, typeEnd], [0, full.length], clamp));
  const swapAt = sec(3.83);
  const delN = Math.floor(interpolate(f, [swapAt - 16, swapAt - 4], [0, 4], clamp));
  const swapped = f >= swapAt;
  const pop = spring({ frame: f - swapAt, fps, config: { damping: 9, stiffness: 190, mass: 0.6 } });
  const typed = full.slice(0, n);
  const before = typed.slice(0, Math.min(typed.length, A.length));
  const word = typed.length > A.length ? typed.slice(A.length, Math.min(typed.length, A.length + 4)) : '';
  const after = typed.length > A.length + 4 ? typed.slice(A.length + 4) : '';
  const shown = swapped ? '' : word.slice(0, Math.max(0, word.length - delN));
  const caretOn = f % 16 < 9 || (f > 8 && f < typeEnd) || (f > swapAt - 18 && f < swapAt + 4);
  const caret = (
    <span
      style={{
        display: 'inline-block',
        width: 5,
        height: 92,
        background: HOT,
        marginLeft: 3,
        marginRight: 3,
        verticalAlign: '-14px',
        opacity: caretOn ? 1 : 0,
      }}
    />
  );
  const zoom = 1 + 0.04 * (f / sec(4.8)) + (swapped ? 0.03 * pop : 0);
  const earthMix = interpolate(f, [58, 92], [0, 1], clamp);
  const rotSlow = f * 0.28;
  const rotRev = -f * 0.42;

  return (
    <AbsoluteFill style={{ background: '#04060a', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Live Solaris Solar System Overview fading into Earth approach */}
      <AbsoluteFill style={{ opacity: 1 - earthMix * 0.85, transform: `scale(${1.06 + 0.05 * (f / 140)})` }}>
        <OffthreadVideo
          src={staticFile('shots/ui_overview.mp4')}
          startFrom={1}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.56) contrast(1.16) saturate(1.22)' }}
        />
      </AbsoluteFill>
      {earthMix > 0.01 && (
        <AbsoluteFill style={{ opacity: earthMix, transform: `scale(${1.04 + 0.08 * earthMix})` }}>
          <OffthreadVideo
            src={staticFile('shots/earth.mp4')}
            startFrom={6}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.62) contrast(1.15) saturate(1.25)' }}
          />
        </AbsoluteFill>
      )}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 68% 54% at 50% 50%, rgba(4,7,12,0.52) 0%, rgba(4,6,10,0.72) 65%, rgba(4,6,10,0.92) 100%)',
        }}
      />

      {/* Kinetic Orbital Astrolabe Telemetry Rings */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55 + (swapped ? 0.25 : 0) }}
      >
        <g transform={`translate(960 540) rotate(${rotSlow})`}>
          <circle r="310" fill="none" stroke="rgba(109,252,192,0.22)" strokeWidth="1.2" strokeDasharray="6 10" />
          <circle cx="310" cy="0" r="5" fill={CYAN} />
          <circle cx="-310" cy="0" r="3.5" fill="#dcab76" />
        </g>
        <g transform={`translate(960 540) rotate(${rotRev})`}>
          <ellipse rx="560" ry="230" fill="none" stroke="rgba(220,171,118,0.24)" strokeWidth="1.2" />
          <ellipse rx="740" ry="340" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="2 12" />
          <circle cx="560" cy="0" r="4.5" fill={HOT} />
        </g>
      </svg>

      {/* Main Kinetic Hook Line */}
      <div
        style={{
          transform: `scale(${zoom})`,
          fontFamily: head,
          fontWeight: 600,
          fontSize: 106,
          color: '#f5f6fa',
          letterSpacing: '-0.015em',
          whiteSpace: 'pre',
          display: 'flex',
          alignItems: 'center',
          textShadow: '0 8px 46px rgba(0,0,0,0.8)',
          zIndex: 4,
        }}
      >
        <span>{before}</span>
        {swapped ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              color: '#fff',
              background: HOT,
              borderRadius: 80,
              padding: '2px 38px 6px 32px',
              margin: '0 6px',
              transform: `scale(${0.7 + 0.3 * pop}) rotate(${(1 - pop) * -4}deg)`,
              boxShadow: '0 18px 60px rgba(255,106,61,0.52), 0 0 36px rgba(255,106,61,0.35)',
            }}
          >
            {Ico.jet(64, '#fff')}flown
          </span>
        ) : (
          <span style={{ color: delN > 0 ? HOT : '#f5f6fa' }}>{shown}</span>
        )}
        {!swapped && typed.length <= A.length + 4 && caret}
        {!swapped && typed.length > A.length + 4 && delN > 0 && caret}
        <span>{after}</span>
        {!swapped && typed.length > A.length + 4 && delN === 0 && caret}
      </div>

      {swapped && <Flash at={0} peak={0.45} dur={10} />}
      <div style={{ position: 'absolute', bottom: 56, left: 74, fontFamily: mono, fontSize: 14, letterSpacing: '0.3em', color: 'rgba(109,252,192,0.72)' }}>
        SOLARIS · UPDATE 2.0 · 4K SHOWCASE
      </div>
      <div style={{ position: 'absolute', bottom: 56, right: 74, fontFamily: mono, fontSize: 14, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.48)' }}>
        REAL EPHEMERIS · LIVE AERODYNAMICS
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 2 · Ignition

const Ignition: React.FC = () => {
  const f = useCurrentFrame();
  const up = interpolate(f, [0, 26], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const split = sec(HALF * 1.45);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: f < split ? up : 0, transform: `scale(${1.1 - 0.1 * up})` }}>
        <Shot src="ui_cockpit" from={0.2} push={0.04} punch={false} />
      </AbsoluteFill>
      {f >= split && <Shot src="e_paris" from={0.25} push={0.06} />}
      <Vignette strength={0.5} />
      <Sequence from={18} layout="none">
        <Line
          y="26%"
          size={76}
          parts={[
            <Chip key="c" dark size={60} icon={Ico.jet(40, C.mint)}>
              <span style={{ fontFamily: mono, letterSpacing: '0.18em', fontSize: 36 }}>SOLARIS 2.0</span>
            </Chip>,
            'Now you can',
            <Chip key="f" hot icon={Ico.jet(52, '#fff')}>
              fly it.
            </Chip>,
          ]}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 3 · Real Earth: Weather, Seasons & 3D Landmarks

interface Place {
  shot: string;
  title: string;
  sub: string;
  fix: string;
  tag?: string;
  accent?: string;
  from?: number;
}

const EARTH_WEATHER: Place[] = [
  { shot: 'wx_clouds_fjords', title: 'SAN FRANCISCO BAY', sub: 'Volumetric Perlin-Worley Clouds', fix: dms(37.82, -122.478), tag: 'CLOUDS', from: 1.45 },
  { shot: 'wx_snow_matterhorn', title: 'CHAMONIX · WINTER', sub: 'January Snowfall & Alpine Ridge', fix: dms(45.833, 6.865), tag: 'SEASON', from: 0.15 },
  { shot: 'wx_autumn_fuji', title: 'KYOTO · AUTUMN', sub: 'October Golden Dusk & Volumetric Mist', fix: dms(35.011, 135.768), tag: 'SEASON', accent: '#f4cd72', from: 1.45 },
  { shot: 'wx_storm_rio', title: 'RIO THUNDERSTORM', sub: 'Live Lightning & Rain Squalls', fix: dms(-22.952, -43.211), tag: 'STORM', accent: HOT, from: 0.15 },
];

const EARTH_PLACES: Place[] = [
  { shot: 'e_manhattan', title: 'MANHATTAN', sub: 'New York · 1:1 Photogrammetry', fix: dms(40.758, -73.985), from: 0.25 },
  { shot: 'e_everest', title: 'MOUNT EVEREST', sub: 'Himalaya · 8,849 m Peak', fix: dms(27.988, 86.925), from: 0.25 },
  { shot: 'e_canyon', title: 'GRAND CANYON', sub: 'Arizona · Google 3D Tiles', fix: dms(36.057, -112.143), from: 0.25 },
  { shot: 'e_tokyo', title: 'TOKYO TOWER', sub: 'Japan · Dusk Photogrammetry', fix: dms(35.659, 139.745), from: 0.25 },
];

const PlaceCut: React.FC<{ p: Place }> = ({ p }) => (
  <AbsoluteFill>
    <Shot src={p.shot} from={p.from ?? 0.2} push={0.06} />
    <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(5,4,7,0.52), transparent 36%)' }} />
    <TacCard title={p.title} sub={p.sub} fix={p.fix} tag={p.tag ?? 'LOC'} accent={p.accent ?? CYAN} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------ 4 · Four Cameras

const CAMS: Array<{ shot: string; label: string }> = [
  { shot: 'cam_chase', label: 'CHASE' },
  { shot: 'cam_cockpit', label: 'COCKPIT' },
  { shot: 'cam_gopro', label: 'GOPRO' },
  { shot: 'cam_flyby', label: 'FLY-BY' },
];

const Cameras: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: d } = useVideoConfig();
  const per = d / 4;
  const active = Math.min(3, Math.floor(f / per));
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {CAMS.map((c, i) => {
        if (i !== active) return null;
        const s = spring({ frame: f - i * per, fps, config: { damping: 16, stiffness: 120 } });
        return (
          <AbsoluteFill key={i} style={{ transform: `scale(${1.08 - 0.08 * s})`, opacity: Math.min(1, s * 2) }}>
            <Sequence from={Math.round(i * per)} durationInFrames={Math.ceil(per)} layout="absolute-fill">
              <OffthreadVideo
                src={staticFile(`shots/${c.shot}.mp4`)}
                startFrom={8}
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Sequence>
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(5,4,7,0.72), transparent 38%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', gap: 22 }}>
        {CAMS.map((c, i) => {
          const on = i === active;
          const done = f > i * per;
          return (
            <div
              key={i}
              style={{
                width: 296,
                height: 166,
                borderRadius: 14,
                overflow: 'hidden',
                position: 'relative',
                border: on ? `2.5px solid ${C.mint}` : '1.5px solid rgba(255,255,255,0.28)',
                transform: `translateY(${on ? -12 : 0}px) scale(${on ? 1.06 : 1})`,
                boxShadow: on ? `0 18px 50px rgba(0,0,0,0.6), 0 0 34px rgba(109,252,192,0.35)` : '0 10px 30px rgba(0,0,0,0.5)',
                opacity: done || on ? 1 : 0.55,
              }}
            >
              <Freeze frame={0}>
                <OffthreadVideo
                  src={staticFile(`shots/${c.shot}.mp4`)}
                  startFrom={28}
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: on ? 'none' : 'saturate(0.6) brightness(0.7)' }}
                />
              </Freeze>
              <div
                style={{
                  position: 'absolute',
                  left: 12,
                  bottom: 9,
                  fontFamily: mono,
                  fontSize: 15,
                  letterSpacing: '0.22em',
                  color: on ? C.mint : 'rgba(255,255,255,0.85)',
                  textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                }}
              >
                {c.label}
              </div>
              {on && <div style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: `${((f - i * per) / per) * 100}%`, background: C.mint }} />}
            </div>
          );
        })}
      </div>
      <Line
        y="20%"
        size={84}
        parts={[
          'Four',
          <Chip key="c" icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={HOT} strokeWidth="2.2"><rect x="2.5" y="6" width="14" height="12" rx="2.5" /><path d="M16.5 10.5 21.5 7.5v9l-5-3z" /></svg>}>
            cameras.
          </Chip>,
          'One',
          'sky.',
        ]}
      />
      <Kicker n="02" text="PRESS C · CHANGE THE VIEW" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 5 · Two Jets Switch (~2.3s)

const TwoJets: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  // Gripen holds first ~0.95s, diagonal cyber razor wipes across frames 27..41, Su-30MKK owns rest!
  const wipeStart = 27;
  const wipeEnd = 41;
  const wipeP = interpolate(f, [wipeStart, wipeEnd], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const isSu30 = f >= (wipeStart + wipeEnd) / 2;
  const cutEdge = 115 - wipeP * 130; // top X% of diagonal slash
  const cutEdgeBot = cutEdge - 18;
  const reticleRot = interpolate(f, [wipeStart - 6, wipeEnd + 10], [0, 90], clamp);
  const reticleOp = Math.min(interpolate(f, [wipeStart - 6, wipeStart + 2], [0, 1], clamp), interpolate(f, [wipeEnd + 2, wipeEnd + 10], [1, 0], clamp));
  const punchOut = interpolate(f, [wipeStart, wipeEnd], [1.0, 1.035], clamp);

  return (
    <AbsoluteFill style={{ background: C.night, overflow: 'hidden' }}>
      {/* Airframe 01: JAS 39C Gripen */}
      {f < wipeEnd + 3 && (
        <AbsoluteFill style={{ transform: `scale(${punchOut})` }}>
          <OffthreadVideo
            src={staticFile('shots/jet_gripen_hero.mp4')}
            startFrom={8}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.06) saturate(1.1)' }}
          />
        </AbsoluteFill>
      )}

      {/* Airframe 02: Su-30MKK Flanker-G sliding behind diagonal razor */}
      {f >= wipeStart && (
        <AbsoluteFill
          style={{
            clipPath: wipeP >= 1 ? 'none' : `polygon(${cutEdge}% 0%, 100% 0%, 100% 100%, ${cutEdgeBot}% 100%)`,
          }}
        >
          <Sequence from={wipeStart} durationInFrames={Math.max(1, d - wipeStart)} layout="absolute-fill">
            <OffthreadVideo
              src={staticFile('shots/jet_su30_hero.mp4')}
              startFrom={8}
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) saturate(1.14)' }}
            />
          </Sequence>
        </AbsoluteFill>
      )}

      {/* Glowing Laser Cut Beam across the Diagonal Wipe */}
      {wipeP > 0.01 && wipeP < 0.99 && (
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor={HOT} />
            </linearGradient>
          </defs>
          <line
            x1={(cutEdge / 100) * 1920}
            y1="0"
            x2={(cutEdgeBot / 100) * 1920}
            y2="1080"
            stroke="url(#beam)"
            strokeWidth="10"
          />
          <line
            x1={(cutEdge / 100) * 1920}
            y1="0"
            x2={(cutEdgeBot / 100) * 1920}
            y2="1080"
            stroke={HOT}
            strokeWidth="28"
            strokeOpacity="0.28"
          />
        </svg>
      )}

      {/* Spinning Center Gimbal Reticle on Airframe Swap */}
      {reticleOp > 0.02 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${reticleRot}deg) scale(${0.85 + 0.35 * reticleOp})`,
            opacity: reticleOp,
            pointerEvents: 'none',
          }}
        >
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="110" fill="none" stroke={CYAN} strokeWidth="2" strokeDasharray="24 14" />
            <circle cx="130" cy="130" r="82" fill="none" stroke={HOT} strokeWidth="2" strokeDasharray="10 18" />
            <path d="M130 8v28M130 224v28M8 130h28M224 130h28" stroke="#fff" strokeWidth="2.5" />
          </svg>
        </div>
      )}

      <Vignette strength={0.45} />
      <Kicker n="03" text="SELECT YOUR AIRFRAME · PRESS TAB" accent={HOT} />

      <Line
        y="22%"
        size={96}
        parts={[
          'Two',
          <Chip key="j" size={82} hot icon={Ico.jet(58, '#fff')}>
            jets.
          </Chip>,
          'Zero',
          'limits.',
        ]}
      />

      {!isSu30 ? (
        <TacCard
          tag="AIRFRAME 01"
          accent={CYAN}
          title="JAS 39C GRIPEN"
          sub="Saab Canard Delta · Volvo RM12 Afterburner"
          fix="MACH 2.05 · +9.0G LIMIT · DELTA FLY-BY-WIRE"
          bottom={90}
        />
      ) : (
        <TacCard
          tag="AIRFRAME 02"
          accent={HOT}
          right
          title="SU-30MKK FLANKER-G"
          sub="Twin AL-31FP · 32° 3D Thrust Vectoring"
          fix="MACH 2.12 · POST-STALL CAPABLE · COBRA / KULBIT"
          bottom={90}
        />
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 6 · 4K Stunts & Aerodynamics

interface StuntSpec {
  shot: string;
  title: string;
  sub: string;
  fix: string;
  badge: string;
  accent?: string;
}

const STUNTS: Array<StuntSpec & { fromBeat: number; toBeat: number }> = [
  {
    shot: 'stunt_cobra',
    title: "PUGACHEV'S COBRA",
    sub: 'Press V · Dynamic Pitch-Up & Recovery',
    fix: 'AOA +95° · LERX VORTEX CORE ACTIVE',
    badge: 'AOA +95° // PSM',
    accent: HOT,
    fromBeat: 19,
    toBeat: 21,
  },
  {
    shot: 'stunt_kulbit',
    title: '360° KULBIT LOOP',
    sub: 'Post-Stall Pitch Somersault · TVC Active',
    fix: '32° THRUST VECTORING · 6-DOF AERO MODEL',
    badge: '360° PSM // TVC',
    accent: CYAN,
    fromBeat: 21,
    toBeat: 23,
  },
  {
    shot: 'stunt_highg',
    title: '9.0G WINGTIP VORTEX',
    sub: 'Sustained High-Alpha Condensation & Buffeting',
    fix: 'LOAD FACTOR +9.0G · PRANDTL WING RIBBONS',
    badge: '+9.0 G LOAD',
    accent: '#f4cd72',
    fromBeat: 23,
    toBeat: 24.2,
  },
  {
    shot: 'stunt_mach1',
    title: 'MACH 1.00 BARRIER',
    sub: 'Transonic Prandtl-Glauert Vapor Cone',
    fix: 'M = 1.00 · SHOCK COLLAR & COMPRESSIBILITY',
    badge: 'MACH 1.00',
    accent: '#fff',
    fromBeat: 24.2,
    toBeat: 25.2,
  },
];

const StuntCut: React.FC<{ s: StuntSpec }> = ({ s }) => (
  <AbsoluteFill>
    <Shot src={s.shot} from={0.2} push={0.05} />
    <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(5,4,7,0.52), transparent 36%)' }} />
    <div
      style={{
        position: 'absolute',
        top: 46,
        right: 60,
        padding: '8px 18px',
        borderRadius: 999,
        background: 'rgba(8,10,14,0.74)',
        border: `1.5px solid ${s.accent ?? CYAN}`,
        fontFamily: mono,
        fontSize: 15,
        letterSpacing: '0.2em',
        color: s.accent ?? CYAN,
      }}
    >
      {s.badge}
    </div>
    <TacCard tag="STUNT" title={s.title} sub={s.sub} fix={s.fix} accent={s.accent ?? HOT} />
  </AbsoluteFill>
);

// ------------------------------------------------------------------------------------ 7 · Tactical HUD

const Note: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; sub: string; at: number }> = ({
  x,
  y,
  tx,
  ty,
  text,
  sub,
  at,
}) => {
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
      <div
        style={{
          position: 'absolute',
          top: ty - 34,
          ...(left ? { right: 1920 - tx + 10 } : { left: tx + 10 }),
          maxWidth: 356,
          background: '#fff',
          borderRadius: 14,
          padding: '10px 16px',
          boxShadow: '0 16px 44px rgba(0,0,0,0.35)',
          opacity: o,
          transform: `translateY(${(1 - o) * 12}px)`,
        }}
      >
        <div style={{ fontFamily: head, fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: INK, display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 8, height: 8, flexShrink: 0, borderRadius: 8, background: HOT }} />
          {text}
        </div>
        <div style={{ fontFamily: mono, fontSize: 13, color: 'rgba(20,20,22,0.62)', marginTop: 3 }}>{sub}</div>
      </div>
    </>
  );
};

const Hud: React.FC<{ shot: string }> = ({ shot }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 110 } });
  const W = 1920 * 0.56;
  const Hh = 1080 * 0.56;
  const L = (1920 - W) / 2;
  const Tp = 186;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ transform: 'scale(1.2)', filter: 'blur(40px) brightness(0.55) saturate(1.25)' }}>
        <OffthreadVideo src={staticFile(`shots/${shot}.mp4`)} startFrom={4} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: L,
          top: Tp,
          width: W,
          height: Hh,
          borderRadius: 22,
          overflow: 'hidden',
          transform: `translateY(${(1 - s) * 60}px) scale(${0.94 + 0.06 * s})`,
          opacity: Math.min(1, s * 1.6),
          boxShadow: '0 50px 140px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(255,255,255,0.22)',
        }}
      >
        <OffthreadVideo src={staticFile(`shots/${shot}.mp4`)} startFrom={4} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <Note x={L + W * 0.16} y={Tp + Hh * 0.84} tx={L - 24} ty={Tp + Hh * 0.62} text="Where you really are" sub="place · MGRS grid · coordinates" at={10} />
      <Note x={L + W * 0.86} y={Tp + Hh * 0.82} tx={L + W + 24} ty={Tp + Hh * 0.58} text="Altitude, speed, Mach, G" sub="rolling digits · climb rate" at={20} />
      <Note x={L + W * 0.5} y={Tp + Hh * 0.115} tx={L + W + 24} ty={Tp + Hh * 0.2} text="Heading tape" sub="and your waypoint on it" at={30} />
      <Line y="8%" size={70} parts={['A', <Chip key="h" size={60} icon={Ico.cube(40, HOT)}>tactical HUD</Chip>, 'that tells the truth.']} />
      <Kicker n="04" text="LIVE FROM THE FLIGHT" />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ 8 · Climb, NASA Fleet, Worlds & Deep Time

const Counter: React.FC<{ to: number; label: string }> = ({ to, label }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const v = Math.round(interpolate(f, [4, 42], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  return (
    <div style={{ position: 'absolute', top: 68, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o }}>
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
    <Shot src={shot} from={0.25} push={0.08} />
    <Vignette strength={0.45} />
    <TacCard tag="NASA" title={name} sub={note} fix="LIVE EPHEMERIS · NASA EYES 3D MODEL" />
  </AbsoluteFill>
);

const DeepTimeEraMeter: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const o = Math.min(interpolate(f, [0, 10], [0, 1], clamp), interpolate(f, [d - 8, d], [1, 0], clamp));
  const gyrs = interpolate(f, [0, d], [0.6, 5.4], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 46,
        right: 60,
        opacity: o,
        textAlign: 'right',
        background: 'rgba(16,6,6,0.74)',
        border: '1px solid rgba(255,106,61,0.45)',
        borderRadius: 14,
        padding: '10px 20px',
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.28em', color: '#f4cd72' }}>COSMIC TIMELINE // DEEP TIME</div>
      <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 500, color: '#fff', letterSpacing: '0.04em' }}>
        +{gyrs.toFixed(1)} <span style={{ fontSize: 18, color: HOT }}>BILLION YRS</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------ 9 · Postcards & Lockup

const CARDS = [
  'v2_fjords',
  'v2_storm',
  'f_e_everest',
  'v2_su30',
  'v2_cobra',
  'v2_mach1',
  'f_n_jwst',
  'v2_eclipse',
  'v2_redgiant',
];

const Postcards: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: d } = useVideoConfig();
  const out = interpolate(f, [d - 10, d], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: 'center', justifyContent: 'center' }}>
      {CARDS.map((c, i) => {
        const s = spring({ frame: f - i * 3, fps, config: { damping: 14, stiffness: 120 } });
        const mid = (CARDS.length - 1) / 2;
        const x = (i - mid) * 165 * s;
        const rot = (i - mid) * 5.5 * s;
        const y = Math.abs(i - mid) * 16 * s + (1 - s) * 500 - out * 900;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              width: 420,
              height: 300,
              borderRadius: 16,
              overflow: 'hidden',
              background: '#fff',
              padding: 10,
              boxSizing: 'border-box',
              transform: `translate(${x}px, ${y + 20}px) rotate(${rot}deg)`,
              boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
              zIndex: 10 - Math.abs(i - mid),
            }}
          >
            <Img src={staticFile(`gallery/${c}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: serif,
          fontStyle: 'italic',
          fontSize: 82,
          color: INK,
          opacity: interpolate(f, [10, 24], [0, 1], clamp) * (1 - out),
        }}
      >
        Every storm. Every eclipse. Every world.
      </div>
    </AbsoluteFill>
  );
};

const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ opacity: 0.45 * o, filter: 'blur(12px) brightness(0.65)', transform: 'scale(1.08)' }}>
        <Shot src="bh_sea" from={0.1} push={0.05} punch={false} />
      </AbsoluteFill>
      <Vignette strength={0.82} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26, fontFamily: montserrat }}>
        <Mark size={170} start={2} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <Wordmark start={8} size={84} />
          <span
            style={{
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: '0.1em',
              color: '#04120c',
              background: C.mint,
              padding: '4px 16px',
              borderRadius: 40,
              opacity: interpolate(f, [26, 36], [0, 1], clamp),
              transform: `scale(${interpolate(f, [26, 38], [0.6, 1], { ...clamp, easing: ease })})`,
            }}
          >
            2.0
          </span>
        </div>
        <div style={{ fontFamily: head, fontWeight: 600, fontSize: 46, color: '#fff', opacity: interpolate(f, [30, 44], [0, 1], clamp), letterSpacing: '0.02em' }}>
          Fly the Solar System.
        </div>
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: '0.3em', color: C.ink, opacity: interpolate(f, [42, 56], [0, 1], clamp) }}>
          SOLARISES.VERCEL.APP
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------ Sound & Voice Schedule

interface Cue {
  src: string;
  at: number;
  len: number;
  vol: number;
  from?: number;
}

const cuts = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => g(a + i));

const CUES: Cue[] = [
  // 1 · hook typewriter + impact drop
  ...Array.from({ length: 14 }, (_, i) => ({ src: 'sfx/tick.wav', at: 0.3 + i * 0.125, len: 0.3, vol: 0.16 })),
  { src: 'sfx/riser.wav', at: 3.83 - 2.6, len: 2.7, vol: 0.42, from: 0.6 },
  { src: 'sfx/impact.wav', at: 3.83, len: 3.5, vol: 0.85 },

  // 2 · ignition + Vela 1 ("Last time we drifted in orbit...")
  { src: 'flight/engine_start.wav', at: g(3) - 0.1, len: 5.0, vol: 0.85 },
  { src: 'flight/vela_1.mp3', at: g(3.1), len: 7.2, vol: 1.0 },
  { src: 'sfx/whoosh.wav', at: g(6) - 0.3, len: 1.5, vol: 0.5 },
  { src: 'sfx/impact.wav', at: g(6), len: 2.8, vol: 0.48 },

  // 3 · Earth weather, seasons & landmarks + Control Radio 1
  ...cuts(7, 13).map((at) => ({ src: 'sfx/whoosh.wav', at: at - 0.25, len: 1.1, vol: 0.26 })),
  { src: 'flight/engine_pass.wav', at: g(6), len: 12, vol: 0.28 },
  { src: 'flight/radio_start.wav', at: g(8.4), len: 6.2, vol: 0.92 },

  // 4 · Four cameras
  { src: 'sfx/whoosh.wav', at: g(14) - 0.3, len: 1.5, vol: 0.48 },
  ...[14.9, 15.8, 16.65].map((n) => ({ src: 'sfx/tick.wav', at: g(n), len: 0.4, vol: 0.42 })),

  // 5 · Two jets 2.3s switch razor wipe
  { src: 'sfx/whoosh.wav', at: g(17.5) + 0.72, len: 1.4, vol: 0.65 },
  { src: 'sfx/impact.wav', at: g(17.5) + 0.95, len: 2.5, vol: 0.72 },

  // 6 · 4K Stunts + Vela 2 ("Ninety-five degrees angle of attack...") + Radio Mach 1
  { src: 'flight/vela_2.mp3', at: g(19.1), len: 8.2, vol: 1.0 },
  ...[21, 23, 24.2].map((n) => ({ src: 'sfx/whoosh.wav', at: g(n) - 0.25, len: 1.1, vol: 0.34 })),
  { src: 'flight/breath.wav', at: g(23.1), len: 3.0, vol: 0.38 },
  { src: 'flight/radio_mach.wav', at: g(24.5), len: 6.4, vol: 0.92 },

  // 7 · HUD shimmer
  { src: 'sfx/shimmer.wav', at: g(25.2), len: 3.5, vol: 0.32 },

  // 8 · Scramjet Climb + NASA Fleet + Vela 3 ("Zero runway, straight up 60km...")
  { src: 'sfx/riser.wav', at: g(27.8) - 2.4, len: 2.5, vol: 0.48 },
  { src: 'sfx/impact.wav', at: g(27.8), len: 3.5, vol: 0.72 },
  { src: 'flight/vela_3.mp3', at: g(28.8), len: 6.4, vol: 1.0 },
  ...[29, 30.2, 31.3, 32.4].map((n) => ({ src: 'sfx/tick.wav', at: g(n), len: 0.4, vol: 0.38 })),

  // 9 · Planets + Radio Saturn + Deep Time + Vela 4
  { src: 'sfx/whoosh.wav', at: g(33.5) - 0.3, len: 1.5, vol: 0.5 },
  { src: 'flight/radio_saturn.wav', at: g(33.1), len: 6.2, vol: 0.92 },
  { src: 'sfx/riser.wav', at: g(37.2) - 2.0, len: 2.1, vol: 0.42 },
  { src: 'sfx/impact.wav', at: g(37.2), len: 3.6, vol: 0.7 },
  { src: 'flight/vela_4.mp3', at: g(38.5), len: 7.4, vol: 1.0 },
  { src: 'sfx/shimmer.wav', at: g(41.5), len: 3.5, vol: 0.35 },

  // 10 · Postcards + Vela 5 ("Every storm, every eclipse...") + Lockup drop
  { src: 'sfx/shimmer.wav', at: g(43.5), len: 3.8, vol: 0.38 },
  { src: 'flight/vela_5.mp3', at: g(43.9), len: 6.2, vol: 1.0 },
  { src: 'sfx/riser.wav', at: g(46.0) - 2.2, len: 2.3, vol: 0.45, from: 0.8 },
  { src: 'sfx/impact.wav', at: g(46.0), len: 4.0, vol: 0.85 },
];

/** Duck music smoothly under every non-overlapping Vela & cockpit radio speech window. */
const VOICE_WINDOWS: Array<[number, number]> = [
  [g(3.1), g(3.1) + 6.72],     // vela_1
  [g(8.4), g(8.4) + 5.86],     // radio_start
  [g(19.1), g(19.1) + 7.71],   // vela_2
  [g(24.5), g(24.5) + 6.03],   // radio_mach
  [g(28.8), g(28.8) + 5.92],   // vela_3
  [g(33.1), g(33.1) + 6.14],   // radio_saturn
  [g(38.5), g(38.5) + 6.95],   // vela_4
  [g(43.9), g(43.9) + 5.75],   // vela_5
];

const musicVol = (frame: number): number => {
  const t = frame / FPS;
  let v = 0.7;
  for (const [a, b] of VOICE_WINDOWS) {
    const k = Math.min(
      interpolate(t, [a - 0.25, a + 0.12], [0, 1], clamp),
      interpolate(t, [b - 0.1, b + 0.45], [1, 0], clamp),
    );
    v *= 1 - 0.48 * k;
  }
  return v * interpolate(t, [FLIGHT_DURATION - 1.8, FLIGHT_DURATION], [1, 0], clamp);
};

// ------------------------------------------------------------------------------------ Film Timeline

export const Flight: React.FC = () => {
  const NASA_FLEET = [
    { shot: 'up_orbit', name: 'LOW EARTH ORBIT', note: '320 km altitude · Orbital curvature' },
    { shot: 'n_iss', name: 'INTERNATIONAL SPACE STATION', note: '408 km up · 7.66 km/s' },
    { shot: 'n_jwst', name: 'JAMES WEBB SPACE TELESCOPE', note: 'Sun-Earth L2 · 1.5 million km' },
    { shot: 'n_voyager', name: 'VOYAGER 1', note: 'Interstellar space · 25 billion km' },
  ];

  return (
    <AbsoluteFill style={{ background: C.night, fontFamily: montserrat }}>
      {/* 1 · Creative Solar System Hook */}
      <At from={0} to={g(3)} name="hook">
        <Hook />
      </At>

      {/* 2 · Ignition */}
      <At from={g(3)} to={g(6)} name="ignition">
        <Ignition />
      </At>

      {/* 3 · Real Earth: Volumetric Weather, Seasons & 3D Landmarks */}
      <At from={g(6)} to={g(7)} name="wx_fjords"><PlaceCut p={EARTH_WEATHER[0]} /></At>
      <At from={g(7)} to={g(8)} name="wx_snow"><PlaceCut p={EARTH_WEATHER[1]} /></At>
      <At from={g(8)} to={g(9)} name="wx_autumn"><PlaceCut p={EARTH_WEATHER[2]} /></At>
      <At from={g(9)} to={g(10.5)} name="wx_storm"><PlaceCut p={EARTH_WEATHER[3]} /></At>
      <At from={g(10.5)} to={g(11.5)} name="e_manhattan"><PlaceCut p={EARTH_PLACES[0]} /></At>
      <At from={g(11.5)} to={g(12.5)} name="e_everest"><PlaceCut p={EARTH_PLACES[1]} /></At>
      <At from={g(12.5)} to={g(13.25)} name="e_canyon"><PlaceCut p={EARTH_PLACES[2]} /></At>
      <At from={g(13.25)} to={g(14)} name="e_tokyo"><PlaceCut p={EARTH_PLACES[3]} /></At>

      <At from={g(6)} to={g(9)} name="line:earth">
        <Veil />
        <Line y="32%" size={114} parts={['Every', <Chip key="w" size={96} icon={Ico.storm(62)}>cloud,</Chip>, 'every', 'season.']} />
      </At>
      <At from={g(9)} to={g(10.5)} name="line:storms">
        <Veil />
        <Line y="32%" size={110} parts={['Real', <Chip key="s" size={94} hot>storms.</Chip>, 'Live lightning.']} />
      </At>
      <At from={g(6)} to={g(10.5)} name="kicker:earth">
        <Kicker n="01" text="REAL EARTH · LIVE WEATHER & SEASONS" />
      </At>
      <At from={g(10.5)} to={g(14)} name="line:scale">
        <Veil k={0.22} />
        <Line y="32%" size={112} parts={['At', <Chip key="e" size={96} icon={Ico.globe(64)}>1 : 1</Chip>, 'scale.']} />
      </At>
      <At from={g(6)} to={g(6) + 0.5}><Flash at={0} peak={0.65} /></At>

      {/* 4 · Four Cameras */}
      <At from={g(14)} to={g(17.5)} name="cameras">
        <Cameras />
      </At>

      {/* 5 · Two Jets Switch (~2.3s) */}
      <At from={g(17.5)} to={g(19.0)} name="two_jets">
        <TwoJets />
      </At>

      {/* 6 · 4K Physics & Post-Stall Maneuvers */}
      {STUNTS.map((st) => (
        <At key={st.shot} from={g(st.fromBeat)} to={g(st.toBeat)} name={st.shot}>
          <StuntCut s={st} />
        </At>
      ))}
      <At from={g(19)} to={g(21)} name="line:stunts">
        <Veil />
        <Line y="28%" size={98} parts={['6-DOF', <Chip key="p" size={86} hot>aerodynamics.</Chip>, 'No rails.']} />
        <Kicker n="03B" text="COBRA · KULBIT 360° · 9G · MACH 1" accent={HOT} />
      </At>
      <At from={g(24.2)} to={g(25.2)} name="line:mach">
        <Veil k={0.2} />
        <Line y="28%" size={102} parts={['Break the', <Chip key="m" size={86} icon={Ico.jet(58)}>sound barrier.</Chip>]} />
      </At>

      {/* 7 · Tactical HUD */}
      <At from={g(25.2)} to={g(27.8)} name="hud">
        <Hud shot="ui_hud" />
      </At>

      {/* 8 · Scramjet Climb -> LEO -> 150+ NASA Fleet */}
      <At from={g(27.8)} to={g(29.0)} name="scramjet">
        <Shot src="stunt_scramjet" from={0.2} push={0.07} />
        <Veil k={0.24} />
        <Line y="34%" size={108} parts={['Keep', <Chip key="u" size={92} icon={Ico.up(62)}>climbing.</Chip>, 'Mach 25+.']} />
        <TacCard tag="SCRAMJET" title="KÁRMÁN BOUNDARY" sub="Hypersonic Plasma · Earth Curvature" fix="ALT 42 → 100 km · SPEED TIER II" accent={HOT} />
      </At>
      {NASA_FLEET.map((u, i) => (
        <At
          key={u.shot}
          from={g(29.0 + i * 1.125)}
          to={g(Math.min(33.5, 29.0 + (i + 1) * 1.125))}
          name={u.shot}
        >
          <CraftCut shot={u.shot} name={u.name} note={u.note} />
        </At>
      ))}
      <At from={g(29.2)} to={g(33.3)} name="nasa_counter">
        <Counter to={150} label="NASA spacecraft" />
      </At>
      <At from={g(27.8)} to={g(27.8) + 0.5}><Flash at={0} peak={0.6} /></At>

      {/* 9 · Every World + Warp + Deep Time Eras & Red Eclipse */}
      <At from={g(33.5)} to={g(34.7)} name="p_mars">
        <Shot src="p_mars" from={0.2} push={0.07} />
        <Veil k={0.22} />
        <Line y="32%" size={108} parts={['Every', <Chip key="w" size={92} icon={Ico.globe(64, '#dcab76')}>world.</Chip>]} />
        <Kicker n="05" text="ONE SOL · INTERPLANETARY" />
        <TacCard tag="NAV" title="OLYMPUS MONS" sub="Mars · Three Everests tall" fix="SOL 1.6050 AU" accent="#dcab76" />
      </At>
      <At from={g(34.7)} to={g(36.0)} name="p_saturn_cockpit">
        <Shot src="p_saturn_cockpit" from={0.4} push={0.07} />
        <TacCard tag="NAV" title="SATURN RINGS" sub="Live Cockpit Ephemeris · Light-Time 1h 19m" fix="SOL 9.5420 AU" accent="#dcab76" />
      </At>
      <At from={g(36.0)} to={g(36.5)} name="warp">
        <Shot src="warp" from={0.2} push={0.14} />
      </At>
      <At from={g(36.5)} to={g(37.2)} name="jet_io">
        <Shot src="jet_io" from={0.5} push={0.08} />
        <TacCard tag="NAV" title="JUPITER & IO" sub="Volcanic Moon Flyby · Light-Time 43m" fix="SOL 5.2030 AU" accent="#dcab76" />
      </At>

      {/* Deep Time Eras */}
      <At from={g(37.2)} to={g(38.5)} name="dt_last_eclipse">
        <Shot src="dt_last_eclipse_4k" from={0.2} push={0.06} />
        <Veil k={0.24} />
        <Line y="30%" size={102} parts={['Every', <Chip key="dt" size={88} hot icon={Ico.eclipse(54, '#fff')}>eclipse</Chip>, 'across time.']} />
        <Kicker n="06" text="DEEP TIME ENGINE · PAST TO END OF TIME" accent={HOT} />
        <TacCard tag="DEEP TIME" title="THE LAST ECLIPSE" sub="+600 Million Years · Crimson Totality" fix="SOLAR-LUNAR ORBITAL DRIFT" accent={HOT} />
      </At>
      <At from={g(38.5)} to={g(40.3)} name="dt_red_giant">
        <Shot src="dt_red_giant_4k" from={0.2} push={0.06} />
        <Veil k={0.2} />
        <TacCard tag="DEEP TIME" title="RED GIANT SUN" sub="+5.4 Billion Years · Expanding Photosphere" fix="STELLAR EVOLUTION MODEL" accent={HOT} />
      </At>
      <At from={g(40.3)} to={g(41.5)} name="dt_comet_storm">
        <Shot src="dt_comet_storm_4k" from={0.2} push={0.06} />
        <TacCard tag="DEEP TIME" title="LATE BOMBARDMENT" sub="-3.9 Billion Years · Primordial Skies" fix="HADEAN EON IMPACT FLUX" accent="#f4cd72" />
      </At>
      <At from={g(41.5)} to={g(42.5)} name="dt_collision">
        <Shot src="dt_collision" from={0.3} push={0.08} />
        <TacCard tag="DEEP TIME" title="MILKY WAY × ANDROMEDA" sub="+4.5 Billion Years · Galactic Merger" fix="LOCAL GROUP DYNAMICS" accent="#f4cd72" />
      </At>
      <At from={g(42.5)} to={g(43.5)} name="bh_sea">
        <Shot src="bh_sea" from={0.25} push={0.06} />
        <TacCard tag="SINGULARITY" title="SAGITTARIUS A*" sub="Event Horizon Shore · 26,670 ly" fix="RELATIVISTIC ACCRETION" accent={CYAN} />
      </At>
      <At from={g(37.2)} to={g(42.5)} name="deeptime_meter">
        <DeepTimeEraMeter />
      </At>
      <At from={g(37.2)} to={g(37.2) + 0.5}><Flash at={0} peak={0.65} /></At>

      {/* 10 · Postcards & Final Lockup */}
      <At from={g(43.5)} to={g(46.0)} name="postcards">
        <Postcards />
      </At>
      <At from={g(46.0)} to={FLIGHT_DURATION} name="lockup">
        <Lockup />
        <Flash at={0} peak={0.85} />
      </At>

      {/* Vela & Cockpit Radio Synchronized Subtitles */}
      <At from={g(3.1)} to={g(3.1) + 6.72} name="sub:vela1">
        <VelaSub text="Last time we drifted in orbit. Today? Fire the afterburner. Eight worlds are waiting." />
      </At>
      <At from={g(8.4)} to={g(8.4) + 5.86} name="sub:ctrl1">
        <RadioSub who="CONTROL" text="Solaris One-One, cleared as filed. Sky's all yours today." />
      </At>
      <At from={g(19.1)} to={g(19.1) + 7.71} name="sub:vela2">
        <VelaSub text="Ninety-five degrees angle of attack. Either that's textbook flight control, or we just broke gravity." />
      </At>
      <At from={g(24.5)} to={g(24.5) + 6.03} name="sub:mach">
        <RadioSub who="TWO" text="Mach one! Feel that little shudder? That's the sound barrier waving goodbye." />
      </At>
      <At from={g(28.8)} to={g(28.8) + 5.92} name="sub:vela3">
        <VelaSub text="Zero runway. Straight up sixty kilometers, and a casual wave at James Webb." />
      </At>
      <At from={g(33.1)} to={g(33.1) + 6.14} name="sub:saturn">
        <RadioSub who="SOLARIS" text="Saturn Command, passing the outer rings now. You were right about the view." />
      </At>
      <At from={g(38.5)} to={g(38.5) + 6.95} name="sub:vela4">
        <VelaSub text="An eclipsed red sun, five billion years from home. Honestly, even Voyager would turn around for this view." />
      </At>
      <At from={g(43.9)} to={g(43.9) + 5.75} name="sub:vela5">
        <VelaSub darkCard={false} text="Every storm, every eclipse, every sky across time. Now take the stick." />
      </At>

      {/* Finishing Grain & Optical Leaks */}
      <At from={g(3)} to={g(43.5)}>
        <Grain opacity={0.045} />
        <LightLeak at={sec(g(6) - g(3))} dur={20} />
        <LightLeak at={sec(g(17.5) - g(3))} dur={16} hue="109, 252, 192" side="left" />
        <LightLeak at={sec(g(37.2) - g(3))} dur={22} hue="255, 110, 65" />
      </At>

      {/* Audio Bed + Non-overlapping Vela & SFX Mix */}
      <Audio src={staticFile('audio/flight/music_ext.mp3')} volume={(f) => musicVol(f)} />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.max(0, sec(c.at))} durationInFrames={sec(c.len)} name={`sfx ${c.src}`} layout="none">
          <Audio src={staticFile(`audio/${c.src}`)} volume={c.vol} startFrom={c.from ? sec(c.from) : 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
