import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';
import { C, FPS, mono, montserrat, serif } from './theme';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

export interface Stop {
  /** Film time (s) the photon arrives. */
  at: number;
  name: string;
  /** Light time from the Sun, seconds. */
  light: number;
  /** A few words under the name. */
  note?: string;
}

// Where each world sits on the track: a log scale of light time
const TICKS: Array<[string, number]> = [
  ['Mercury', 193], ['Venus', 361], ['Earth', 499], ['Mars', 760], ['Jupiter', 2595],
  ['Saturn', 4781], ['Uranus', 9577], ['Neptune', 15007], ['Pluto', 19703],
];
const LOG0 = Math.log(120);
const LOG1 = Math.log(24000);
const pos = (s: number) => Math.min(1, Math.max(0, (Math.log(Math.max(1, s)) - LOG0) / (LOG1 - LOG0)));

export function fmtClock(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function fmtHuman(s: number): string {
  if (s < 60) return `${s.toFixed(0)} seconds`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.round(s % 60);
  if (h === 0) return `${m} min ${ss} s`;
  return `${h} h ${m} min`;
}

/**
 * The light-clock: bottom-left, how long the light has been travelling to reach the world on
 * screen, and a track from the Sun to Pluto with the photon gliding along it.
 */
export const LightClock: React.FC<{ stops: Stop[]; from: number; to: number }> = ({ stops, from, to }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < from || t > to) return null;
  const life = Math.min(
    interpolate(t, [from, from + 0.6], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
    interpolate(t, [to - 0.5, to], [1, 0], { extrapolateLeft: 'clamp' })
  );

  let i = -1;
  for (let k = 0; k < stops.length; k++) if (t >= stops[k].at) i = k;
  const cur = i >= 0 ? stops[i] : null;
  const prev = i > 0 ? stops[i - 1] : null;
  const since = cur ? t - cur.at : 0;
  const roll = interpolate(since, [0, 0.55], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const shown = cur ? (prev ? prev.light : 0) + (cur.light - (prev ? prev.light : 0)) * roll : 0;
  const px = cur ? (prev ? pos(prev.light) : 0) + (pos(cur.light) - (prev ? pos(prev.light) : 0)) * roll : 0;
  const nameIn = interpolate(since, [0, 0.35], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  const W = 1100;
  return (
    <div style={{ position: 'absolute', left: 110, bottom: 84, width: W, opacity: life }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 36 }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: '0.34em', color: C.mint, textTransform: 'uppercase', marginBottom: 6 }}>Light time from the Sun</div>
          <div style={{ fontFamily: mono, fontWeight: 300, fontSize: 64, color: C.inkHot, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 30px rgba(255, 190, 120, 0.35)' }}>
            {fmtClock(shown)}
          </div>
        </div>
        {cur && (
          <div style={{ paddingBottom: 10, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 18}px)` }}>
            <div style={{ fontFamily: montserrat, fontWeight: 300, fontSize: 34, letterSpacing: '0.42em', color: C.white, textTransform: 'uppercase' }}>{cur.name}</div>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 26, color: C.dim, marginTop: 2 }}>{cur.note ?? fmtHuman(cur.light)}</div>
          </div>
        )}
      </div>
      {/* The track */}
      <div style={{ position: 'relative', height: 30, marginTop: 22 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 1, background: 'rgba(243,239,233,0.18)' }} />
        <div style={{ position: 'absolute', left: 0, width: px * W, top: 13, height: 3, background: `linear-gradient(90deg, rgba(255,200,140,0.0), ${C.ink})`, boxShadow: `0 0 12px ${C.ink}` }} />
        <div style={{ position: 'absolute', left: -9, top: 6, width: 18, height: 18, borderRadius: '50%', background: C.ink, boxShadow: `0 0 18px ${C.ink}` }} />
        {TICKS.map(([n, s]) => {
          const x = pos(s) * W;
          const lit = px * W >= x - 1;
          return (
            <div key={n} style={{ position: 'absolute', left: x, top: 0 }}>
              <div style={{ position: 'absolute', left: -1, top: 8, width: 2, height: 14, background: lit ? C.ink : 'rgba(243,239,233,0.3)' }} />
              <div style={{ position: 'absolute', top: 30, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', color: lit ? C.ink : 'rgba(243,239,233,0.35)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{n}</div>
            </div>
          );
        })}
        {cur && (
          <div style={{ position: 'absolute', left: px * W - 7, top: 8, width: 14, height: 14, borderRadius: '50%', background: '#fff8ec', boxShadow: `0 0 10px #fff, 0 0 30px ${C.inkHot}, 0 0 60px ${C.ink}` }} />
        )}
      </div>
    </div>
  );
};
