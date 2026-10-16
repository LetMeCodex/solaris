import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { INK, INNER, OUTER, STAR, STROKE, SUN, WORLD_IN, WORLD_OUT, GAP, starPoints, worldAt } from '../../src/ui/brand/logo';
import { C, FPS } from './theme';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** An orbit drawn as an arc from the world's position all the way round, `p` of the way. */
function arc(o: { cx: number; cy: number; r: number }, at: number, worldR: number, p: number): string {
  const g = (Math.asin(Math.min(0.9, (worldR + GAP) / o.r)) * 180) / Math.PI;
  const span = (360 - 2 * g) * p;
  if (span <= 0.01) return '';
  const a0 = at + g;
  const a1 = a0 + span;
  const pt = (d: number) => `${(o.cx + o.r * Math.cos((d * Math.PI) / 180)).toFixed(3)} ${(o.cy + o.r * Math.sin((d * Math.PI) / 180)).toFixed(3)}`;
  return `M ${pt(a0)} A ${o.r} ${o.r} 0 ${span > 180 ? 1 : 0} 1 ${pt(a1)}`;
}

/**
 * The Solaris mark building itself: orbits are drawn on, the Sun swells, each world drops onto its
 * orbit and starts travelling, the star flares. `start` is the frame the build begins; after it the
 * mark keeps living (worlds orbit, star twinkles).
 */
export const Mark: React.FC<{ size: number; start?: number; glow?: number; build?: boolean }> = ({ size, start = 0, glow = 1, build = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - start;
  const t = f / FPS;
  const k = (a: number, b: number) => (build ? interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }) : 1);

  const sun = build ? spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 120, mass: 0.7 } }) : 1;
  const outer = k(4, 34);
  const inner = k(8, 36);
  const wOut = build ? spring({ frame: f - 26, fps, config: { damping: 9, stiffness: 160 } }) : 1;
  const wIn = build ? spring({ frame: f - 30, fps, config: { damping: 9, stiffness: 160 } }) : 1;
  const star = build ? spring({ frame: f - 34, fps, config: { damping: 7, stiffness: 140 } }) : 1;

  // Once built, the worlds travel (slowly; a full lap would take the music's whole length)
  const travel = Math.max(0, t - 1.1);
  const aOut = WORLD_OUT.start - travel * 9;
  const aIn = WORLD_IN.start - travel * 15;
  const p = worldAt(OUTER, aOut);
  const q = worldAt(INNER, aIn);
  const tw = 0.5 + 0.5 * Math.sin(t * 2.2);
  const flare = interpolate(f, [34, 40, 62], [0, 1, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <svg width={size} height={size} viewBox="-10 -10 120 120" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="mk-glow">
          <stop offset="0.3" stopColor={C.inkHot} stopOpacity="0.85" />
          <stop offset="0.6" stopColor={INK} stopOpacity="0.25" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </radialGradient>
        <filter id="mk-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r * (2.4 + 0.25 * Math.sin(t * 1.4))} fill="url(#mk-glow)" opacity={0.55 * sun * glow} />
      <g filter="url(#mk-bloom)" fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round">
        <path d={arc(OUTER, aOut, WORLD_OUT.r, outer)} />
        <path d={arc(INNER, aIn, WORLD_IN.r, inner)} />
      </g>
      <g filter="url(#mk-bloom)">
        <circle cx={SUN.cx} cy={SUN.cy} r={SUN.r * Math.max(0, sun)} fill={INK} />
        <circle cx={p.x} cy={p.y} r={WORLD_OUT.r * Math.max(0, wOut)} fill={INK} />
        <circle cx={q.x} cy={q.y} r={Math.max(0, (WORLD_IN.r - WORLD_IN.stroke / 2) * wIn)} fill="none" stroke={INK} strokeWidth={WORLD_IN.stroke} />
        <g transform={`translate(${STAR.cx} ${STAR.cy}) rotate(${tw * 22.5 + (1 - star) * -90}) scale(${Math.max(0, star) * (0.82 + 0.25 * tw)}) translate(${-STAR.cx} ${-STAR.cy})`}>
          <polygon points={starPoints()} fill={INK} />
        </g>
      </g>
      {/* The star's flare as it lands: a thin horizontal streak */}
      <g opacity={flare} style={{ mixBlendMode: 'screen' }}>
        <ellipse cx={STAR.cx} cy={STAR.cy} rx={60} ry={0.5} fill={C.inkHot} filter="url(#mk-bloom)" />
        <ellipse cx={STAR.cx} cy={STAR.cy} rx={9} ry={9} fill="url(#mk-glow)" />
      </g>
    </svg>
  );
};

/** SOLARIS, settling from wide tracking and a blur into the logotype. */
export const Wordmark: React.FC<{ start?: number; size?: number }> = ({ start = 0, size = 64 }) => {
  const f = useCurrentFrame() - start;
  const letters = 'SOLARIS'.split('');
  return (
    <div style={{ display: 'flex', fontSize: size, fontWeight: 200, color: C.white, letterSpacing: 0 }}>
      {letters.map((ch, i) => {
        const d = f - i * 2.5;
        const o = interpolate(d, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const blur = interpolate(d, [0, 16], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const gap = interpolate(f, [0, 40], [1.25, 0.52], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        return (
          <span key={i} style={{ opacity: o, filter: `blur(${blur}px)`, marginRight: `${gap}em`, textShadow: `0 0 30px rgba(255, 210, 160, ${0.35 * o})` }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};
