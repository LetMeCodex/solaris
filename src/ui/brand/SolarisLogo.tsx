import React from 'react';
import { INK, INNER, OUTER, STAR, STROKE, SUN, WORLD_IN, WORLD_OUT, orbitPath, starPoints, worldAt } from './logo';

/**
 * The Solaris mark in the header: each world travels its orbit (the orbit breaks around it as
 * it goes), the star beside the Sun twinkles, and the Sun glows. Pure CSS animation, so it costs
 * nothing per frame and rests for people who prefer less motion.
 */
export const SolarisLogo: React.FC<{ size?: number; className?: string }> = ({ size = 30, className = '' }) => {
  const p = worldAt(OUTER, WORLD_OUT.start);
  const q = worldAt(INNER, WORLD_IN.start);
  return (
    <svg
      className={`sol-logo ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      style={{ ['--ink' as string]: INK }}
    >
      <defs>
        <radialGradient id="sol-logo-glow">
          <stop offset="0.35" stopColor={INK} stopOpacity="0.55" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="sol-logo-glow" cx={SUN.cx} cy={SUN.cy} r={SUN.r * 1.9} fill="url(#sol-logo-glow)" />
      <g className="sol-logo-orbit" style={{ transformOrigin: `${OUTER.cx}px ${OUTER.cy}px`, animationDuration: `${WORLD_OUT.period}s` }}>
        <path d={orbitPath(OUTER, WORLD_OUT.start, WORLD_OUT.r)} fill="none" stroke={INK} strokeWidth={STROKE} />
        <circle cx={p.x} cy={p.y} r={WORLD_OUT.r} fill={INK} />
      </g>
      <g className="sol-logo-orbit" style={{ transformOrigin: `${INNER.cx}px ${INNER.cy}px`, animationDuration: `${WORLD_IN.period}s` }}>
        <path d={orbitPath(INNER, WORLD_IN.start, WORLD_IN.r)} fill="none" stroke={INK} strokeWidth={STROKE} />
        <circle cx={q.x} cy={q.y} r={WORLD_IN.r - WORLD_IN.stroke / 2} fill="none" stroke={INK} strokeWidth={WORLD_IN.stroke} />
      </g>
      <circle className="sol-logo-sun" cx={SUN.cx} cy={SUN.cy} r={SUN.r} fill={INK} style={{ transformOrigin: `${SUN.cx}px ${SUN.cy}px` }} />
      <polygon className="sol-logo-star" points={starPoints()} fill={INK} style={{ transformOrigin: `${STAR.cx}px ${STAR.cy}px` }} />
    </svg>
  );
};
