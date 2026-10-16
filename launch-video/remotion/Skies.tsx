import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, FPS, SKY_SHIFT, bar, mono, montserrat, serif, sec } from './theme';
import { Shot } from './fx';
import phobos from './data/sky_phobos_rise.json';
import io from './data/sky_io.json';
import enceladus from './data/sky_enceladus.json';
import saturn from './data/sky_saturn.json';

/**
 * Skies of other worlds: four views from where nobody has ever stood, each one framed like a
 * survey instrument. A viewfinder, a stamp of where and when, a compass tape that turns with the
 * camera, and gold reticles that lock onto the worlds in the sky (tracked from the capture).
 */

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const SLOT = SKY_SHIFT / 4;
/** Film time of the start of sky shot i (0..4). */
export const skyAt = (i: number) => bar(11) + i * SLOT;

type Track = Array<Record<string, number[]>>;
interface Mark { key: string; name: string; sub?: string; side?: 'right' | 'left'; ring?: number; reach?: number }
interface SkyShot {
  src: string;
  /** Seconds into the clip where the film picks it up. */
  from: number;
  track: Track;
  place: string;
  coords: string;
  when: string;
  title: string;
  heading: number;
  /** Degrees per second the view turns (matches the capture's drift). */
  turn: number;
  marks: Mark[];
  /** A fixed annotation (no tracked body): where it points, in pixels. */
  fixed?: { x: number; y: number; name: string; sub: string };
}

export const SKY_SHOTS: SkyShot[] = [
  {
    src: 'sky_phobos_rise', from: 0.4, track: phobos as Track, heading: 96, turn: -1.5,
    place: 'Phobos', coords: '2.72° N · 49.95° W', when: 'Night', title: 'Marsrise',
    marks: [{ key: 'main', name: 'Mars', sub: '6,000 km below · 42° wide', side: 'right', reach: 0.62 }],
  },
  {
    src: 'sky_io', from: 0.4, track: io as Track, heading: 267, turn: -2,
    place: 'Io', coords: '4.05° N · 49.88° E', when: 'Night', title: 'Jupiter, never setting',
    marks: [
      { key: 'main', name: 'Jupiter', sub: '421,700 km away · 37× our Moon', side: 'right', reach: 0.8 },
      { key: 'Thebe', name: 'Thebe', ring: 7 },
    ],
  },
  {
    src: 'sky_enceladus', from: 0.4, track: enceladus as Track, heading: 322, turn: 2,
    place: 'Enceladus', coords: '41.55° S · 30.80° E', when: 'Night', title: 'Saturn over the Milky Way',
    marks: [
      { key: 'main', name: 'Saturn', sub: '238,000 km away · rings edge-on', side: 'right' },
      { key: 'Tethys', name: 'Tethys', ring: 7 },
      { key: 'Janus', name: 'Janus', ring: 6 },
    ],
  },
  {
    src: 'sky_saturn', from: 0.4, track: saturn as Track, heading: 8, turn: 5,
    place: 'Saturn', coords: '28.68° S · cloud tops', when: 'Sunset', title: 'Under the rings',
    marks: [],
    fixed: { x: 1180, y: 236, name: 'The rings', sub: '282,000 km wide · ten metres thick' },
  },
];

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Corner brackets and a faint centre cross: the viewfinder. */
const Finder: React.FC<{ k: number }> = ({ k }) => {
  const L = 46;
  const m = 54;
  const c = `rgba(243,239,233,${0.55 * k})`;
  const corner = (x: number, y: number, sx: number, sy: number) => (
    <path d={`M ${x} ${y + sy * L} L ${x} ${y} L ${x + sx * L} ${y}`} stroke={c} strokeWidth={1.4} fill="none" />
  );
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {corner(m, m, 1, 1)}
      {corner(1920 - m, m, -1, 1)}
      {corner(m, 1080 - m, 1, -1)}
      {corner(1920 - m, 1080 - m, -1, -1)}
      <g stroke={`rgba(243,239,233,${0.22 * k})`} strokeWidth={1}>
        <line x1={960 - 14} y1={540} x2={960 - 5} y2={540} />
        <line x1={960 + 5} y1={540} x2={960 + 14} y2={540} />
        <line x1={960} y1={540 - 14} x2={960} y2={540 - 5} />
        <line x1={960} y1={540 + 5} x2={960} y2={540 + 14} />
      </g>
    </svg>
  );
};

/** A compass tape along the bottom: the heading the camera faces, turning as it pans. */
const Compass: React.FC<{ heading: number; k: number }> = ({ heading, k }) => {
  const W = 760;
  const pxPerDeg = 9;
  const ticks: React.ReactNode[] = [];
  const names: Record<number, string> = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
  for (let d = Math.floor(heading - 45); d <= heading + 45; d++) {
    const x = W / 2 + (d - heading) * pxPerDeg;
    const n = ((d % 360) + 360) % 360;
    const major = n % 15 === 0;
    if (n % 5 !== 0) continue;
    const fade = 1 - Math.abs(x - W / 2) / (W / 2);
    ticks.push(
      <g key={d} opacity={Math.max(0, fade)}>
        <line x1={x} y1={major ? 4 : 10} x2={x} y2={18} stroke={C.white} strokeOpacity={major ? 0.7 : 0.35} strokeWidth={1} />
        {names[n] !== undefined ? (
          <text x={x} y={38} fill={C.ink} fontFamily={mono} fontSize={14} textAnchor="middle" letterSpacing="0.1em">{names[n]}</text>
        ) : major ? (
          <text x={x} y={36} fill={C.dim} fontFamily={mono} fontSize={11} textAnchor="middle">{n}</text>
        ) : null}
      </g>
    );
  }
  const hd = ((Math.round(heading) % 360) + 360) % 360;
  return (
    <div style={{ position: 'absolute', left: 960 - W / 2, bottom: 62, width: W, opacity: k }}>
      <svg width={W} height={44}>{ticks}</svg>
      <div style={{ position: 'absolute', left: W / 2 - 1, top: -6, width: 2, height: 26, background: C.mint, boxShadow: `0 0 8px ${C.mint}` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', fontFamily: mono, fontSize: 13, letterSpacing: '0.3em', color: C.mint }}>
        HEADING {String(hd).padStart(3, '0')}°
      </div>
    </div>
  );
};

/** Where you are standing, top left. */
const Stamp: React.FC<{ s: SkyShot; f: number }> = ({ s, f }) => {
  const a = interpolate(f, [4, 20], [0, 1], { ...clamp, easing: ease });
  const b = interpolate(f, [9, 26], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: 'absolute', left: 110, top: 96 }}>
      <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.32em', color: C.mint, textTransform: 'uppercase', opacity: a, display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5d4a', boxShadow: '0 0 10px #ff5d4a', opacity: 0.5 + 0.5 * Math.round((f / 12) % 1 < 0.6 ? 1 : 0) }} />
        Standing on {s.place} · {s.when}
      </div>
      <div style={{ overflow: 'hidden', marginTop: 8 }}>
        <div style={{ transform: `translateY(${(1 - b) * 100}%)`, fontFamily: serif, fontStyle: 'italic', fontSize: 52, color: C.white, textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>{s.title}</div>
      </div>
      <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.24em', color: C.dim, marginTop: 6, opacity: b }}>{s.coords}</div>
    </div>
  );
};

/** A gold reticle locked onto a body, with a leader line to its name. */
const Reticle: React.FC<{ x: number; y: number; r: number; name: string; sub?: string; side?: 'right' | 'left'; f: number; big: boolean; reach?: number }> = ({ x, y, r, name, sub, side = 'right', f, big, reach = 1 }) => {
  const draw = interpolate(f, [8, 30], [0, 1], { ...clamp, easing: ease });
  const line = interpolate(f, [18, 36], [0, 1], { ...clamp, easing: ease });
  const txt = interpolate(f, [26, 42], [0, 1], { ...clamp, easing: ease });
  const R = big ? r + 18 : r;
  const dir = side === 'right' ? 1 : -1;
  // Leader: from the reticle at 40° above the horizontal, out and then level
  const a = (-40 * Math.PI) / 180;
  const sx = x + dir * Math.cos(a) * R;
  const sy = y + Math.sin(a) * R;
  const ex = sx + dir * (big ? 120 : 46) * reach * line;
  const ey = sy - (big ? 90 : 34) * reach * line;
  const lx = ex + dir * (big ? 160 : 60) * reach * line;
  const circ = 2 * Math.PI * R;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g transform={`rotate(${-90 + f * 0.4} ${x} ${y})`}>
          <circle cx={x} cy={y} r={R} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={big ? 1.6 : 1.2} strokeDasharray={`${circ * 0.22 * draw} ${circ * 0.03}`} />
        </g>
        {big && (
          <g stroke={C.inkHot} strokeWidth={1.4} opacity={draw}>
            {[0, 90, 180, 270].map((d) => {
              const t = (d * Math.PI) / 180;
              return <line key={d} x1={x + Math.cos(t) * (R + 6)} y1={y + Math.sin(t) * (R + 6)} x2={x + Math.cos(t) * (R + 18)} y2={y + Math.sin(t) * (R + 18)} />;
            })}
          </g>
        )}
        {line > 0 && <polyline points={`${sx},${sy} ${ex},${ey} ${lx},${ey}`} fill="none" stroke={C.ink} strokeWidth={1.2} strokeOpacity={0.9} />}
        {line > 0.98 && <circle cx={lx} cy={ey} r={2.6} fill={C.inkHot} />}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: side === 'right' ? lx + 14 : undefined,
          right: side === 'left' ? 1920 - lx + 14 : undefined,
          top: ey - (big ? 26 : 12),
          opacity: txt,
          transform: `translateX(${dir * (1 - txt) * 14}px)`,
          textAlign: side === 'right' ? 'left' : 'right',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ fontFamily: montserrat, fontWeight: 300, fontSize: big ? 30 : 15, letterSpacing: big ? '0.4em' : '0.3em', color: C.white, textTransform: 'uppercase', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>{name}</div>
        {sub && <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: '0.16em', color: C.inkHot, marginTop: 6, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>{sub}</div>}
      </div>
    </>
  );
};

const OneSky: React.FC<{ s: SkyShot; lead: number }> = ({ s, lead }) => {
  const f = useCurrentFrame();
  const fv = f - lead; // frames since this shot's cut (negative while it waits under the zoom-through)
  const i = Math.max(0, Math.min(s.track.length - 1, Math.round(s.from * FPS) + f));
  const frame = s.track[i] ?? {};
  const k = interpolate(fv, [0, 12], [0, 1], clamp);
  const t = (Math.round(s.from * FPS) + f) / FPS;
  return (
    <AbsoluteFill>
      <Shot src={s.src} from={s.from} push={0} punch={lead === 0} grade="contrast(1.05) saturate(1.12)" />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 60% 50% at 0% 0%, rgba(0,0,0,0.55), transparent 70%)' }} />
      {fv >= 0 && (
        <>
          <Finder k={k} />
          <Stamp s={s} f={fv} />
          <Compass heading={s.heading + s.turn * t} k={k} />
          {s.marks.map((m) => {
            const p = frame[m.key];
            if (!p) return null;
            const big = m.key === 'main';
            return <Reticle key={m.key} x={p[0]} y={p[1]} r={big ? p[2] : m.ring ?? 8} name={m.name} sub={m.sub} side={m.side ?? 'right'} f={fv - (big ? 0 : 8)} big={big} reach={m.reach} />;
          })}
          {s.fixed && <Reticle x={s.fixed.x} y={s.fixed.y} r={10} name={s.fixed.name} sub={s.fixed.sub} side="right" f={fv} big={false} />}
        </>
      )}
    </AbsoluteFill>
  );
};

/** The act: starts 0.6 s early, underneath the screen flying in. */
export const Skies: React.FC = () => {
  const lead = sec(0.6);
  return (
    <AbsoluteFill>
      {SKY_SHOTS.map((s, i) => (
        <Sequence key={s.src} from={i === 0 ? 0 : lead + sec(i * SLOT)} durationInFrames={(i === 0 ? lead : 0) + sec(SLOT) + 1} layout="absolute-fill">
          <OneSky s={s} lead={i === 0 ? lead : 0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
