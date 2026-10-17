import React, { useId } from 'react';

/**
 * A world for the flat diagrams: its real surface map wrapped into a disc, slowly turning, shaded
 * from the side the light comes from. `light` is the direction of the Sun on screen, in degrees
 * (0 is to the right, 90 is up). The Sun itself is `emissive`: limb-darkened, with a glow.
 */

const base = import.meta.env.BASE_URL;

export const Globe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  map: string;
  light?: number;
  spin?: number;
  emissive?: boolean;
  glow?: string;
  onPointerEnter?: React.PointerEventHandler<SVGGElement>;
  className?: string;
}> = ({ cx, cy, r, map, light = 0, spin = 40, emissive, glow, onPointerEnter, className }) => {
  const id = useId().replace(/:/g, '');
  const href = `${base}textures/${map}`;
  const lx = 50 + Math.cos((light * Math.PI) / 180) * 32;
  const ly = 50 - Math.sin((light * Math.PI) / 180) * 32;
  return (
    <g className={className} onPointerEnter={onPointerEnter}>
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        {emissive ? (
          <radialGradient id={`s${id}`}>
            <stop offset="0" stopColor="#fff2d0" stopOpacity="0.25" />
            <stop offset="0.6" stopColor="#ff9a3c" stopOpacity="0" />
            <stop offset="1" stopColor="#7a1d00" stopOpacity="0.65" />
          </radialGradient>
        ) : (
          <radialGradient id={`s${id}`} cx={`${lx}%`} cy={`${ly}%`} r="85%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.35" stopColor="#000" stopOpacity="0" />
            <stop offset="0.62" stopColor="#000" stopOpacity="0.55" />
            <stop offset="0.85" stopColor="#000" stopOpacity="0.93" />
          </radialGradient>
        )}
        {glow && (
          <radialGradient id={`g${id}`}>
            <stop offset="0" stopColor={glow} stopOpacity="0.7" />
            <stop offset="0.35" stopColor={glow} stopOpacity="0.22" />
            <stop offset="1" stopColor={glow} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      {glow && <circle cx={cx} cy={cy} r={r * 3.2} fill={`url(#g${id})`} pointerEvents="none" />}
      <g clipPath={`url(#c${id})`}>
        <g>
          {/* two copies side by side, sliding one map-width per turn, so the loop is seamless */}
          <image href={href} x={cx - 5 * r} y={cy - r} width={4 * r} height={2 * r} preserveAspectRatio="none" />
          <image href={href} x={cx - r} y={cy - r} width={4 * r} height={2 * r} preserveAspectRatio="none" />
          {spin > 0 && <animateTransform attributeName="transform" type="translate" from="0 0" to={`${4 * r} 0`} dur={`${spin}s`} repeatCount="indefinite" />}
        </g>
        <circle cx={cx} cy={cy} r={r} fill={`url(#s${id})`} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={emissive ? 'rgba(255,200,120,0.35)' : 'rgba(243,231,211,0.14)'} strokeWidth={0.8} />
    </g>
  );
};

/** The same look for a canvas: a shaded disc of the map, drawn once to an offscreen canvas. */
export function globeSprite(map: string, size: number, light = 0, onReady?: () => void): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const img = new Image();
  img.onload = () => {
    const g = c.getContext('2d')!;
    const r = size / 2;
    g.save();
    g.beginPath();
    g.arc(r, r, r, 0, Math.PI * 2);
    g.clip();
    // the middle half of the map is the hemisphere facing us
    g.drawImage(img, img.width / 4, 0, img.width / 2, img.height, 0, 0, size, size);
    const lx = r + Math.cos((light * Math.PI) / 180) * r * 0.64;
    const ly = r - Math.sin((light * Math.PI) / 180) * r * 0.64;
    const sh = g.createRadialGradient(lx, ly, 0, lx, ly, r * 1.7);
    sh.addColorStop(0, 'rgba(255,255,255,0.16)');
    sh.addColorStop(0.35, 'rgba(0,0,0,0)');
    sh.addColorStop(0.62, 'rgba(0,0,0,0.55)');
    sh.addColorStop(0.85, 'rgba(0,0,0,0.93)');
    g.fillStyle = sh;
    g.fillRect(0, 0, size, size);
    g.restore();
    onReady?.();
  };
  img.src = `${base}textures/${map}`;
  return c;
}
