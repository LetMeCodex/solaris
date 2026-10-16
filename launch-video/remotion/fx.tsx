import React from 'react';
import { AbsoluteFill, interpolate, Easing, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { C, FPS } from './theme';

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

/**
 * A piece of footage from the site. `from` is where to start inside the clip (s); every shot gets
 * a slow push and an entry "punch" so cuts land with the beat.
 */
export const Shot: React.FC<{ src: string; from?: number; push?: number; punch?: boolean; grade?: string; origin?: string }> = ({
  src,
  from = 0,
  push = 0.05,
  punch = true,
  grade = 'contrast(1.06) saturate(1.1) brightness(1.02)',
  origin = '50% 50%',
}) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = f / Math.max(1, durationInFrames);
  const kick = punch ? interpolate(f, [0, 9], [0.06, 0], { extrapolateRight: 'clamp', easing: ease }) : 0;
  const scale = 1 + push * p + kick;
  const blur = punch ? interpolate(f, [0, 5], [6, 0], { extrapolateRight: 'clamp' }) : 0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: C.night }}>
      <OffthreadVideo
        src={staticFile(`shots/${src}.mp4`)}
        startFrom={Math.round(from * FPS)}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: origin, filter: `${grade} blur(${blur}px)` }}
      />
    </AbsoluteFill>
  );
};

/** Film grain: a shifting noise field, very faint. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.62 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Warm light leaking in from an edge, drifting. */
export const LightLeak: React.FC<{ at?: number; dur?: number; hue?: string; side?: 'left' | 'right' }> = ({ at = 0, dur = 24, hue = '255, 170, 90', side = 'right' }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > dur) return null;
  const k = Math.sin((f / dur) * Math.PI);
  const x = side === 'right' ? 100 - (f / dur) * 30 : (f / dur) * 30;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: k * 0.85,
        background: `radial-gradient(ellipse 40% 90% at ${x}% 40%, rgba(${hue}, 0.75), rgba(${hue}, 0.18) 45%, transparent 70%)`,
      }}
    />
  );
};

/** A horizontal glint sweeping the frame on a cut. */
export const Glint: React.FC<{ at: number; dur?: number }> = ({ at, dur = 10 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > dur) return null;
  const t = f / dur;
  const x = interpolate(t, [0, 1], [-30, 130], { easing: ease });
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: '-20%',
          width: '14%',
          height: '140%',
          transform: 'skewX(-18deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255, 220, 170, 0.22), rgba(255, 245, 225, 0.5), rgba(255, 220, 170, 0.22), transparent)',
          filter: 'blur(14px)',
          opacity: Math.sin(t * Math.PI),
        }}
      />
    </AbsoluteFill>
  );
};

/** A white flash for the big hits. */
export const Flash: React.FC<{ at: number; dur?: number; peak?: number; color?: string }> = ({ at, dur = 12, peak = 0.9, color = '255, 236, 210' }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > dur) return null;
  const o = interpolate(f, [0, 2, dur], [0, peak, 0], { easing: Easing.out(Easing.quad) });
  return <AbsoluteFill style={{ pointerEvents: 'none', background: `rgba(${color}, ${o})` }} />;
};

/** Floating dust motes catching the light. */
export const Motes: React.FC<{ n?: number; opacity?: number }> = ({ n = 40, opacity = 0.6 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {Array.from({ length: n }, (_, i) => {
        const x = random(`x${i}`) * 100;
        const y = (random(`y${i}`) * 100 - f * (0.02 + random(`s${i}`) * 0.06)) % 100;
        const s = 1 + random(`r${i}`) * 2.2;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (12 + random(`t${i}`) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${(y + 100) % 100}%`,
              width: s,
              height: s,
              borderRadius: '50%',
              background: C.inkHot,
              boxShadow: `0 0 ${s * 4}px ${C.ink}`,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * The interface, presented: the site floats as a screen in perspective, top right, drifting a
 * little, over a blurred and darkened copy of itself. Leaves the lower left free for the callout.
 */
export const Screen: React.FC<{ src: string; from?: number; focus?: string; zoom?: number }> = ({ src, from = 0, focus = '50% 50%', zoom = 0.06 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = f / Math.max(1, durationInFrames);
  const enter = interpolate(f, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const ry = -16 + 5 * p - (1 - enter) * 8;
  const rx = 5 - 2 * p;
  const video = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(`shots/${src}.mp4`)} startFrom={Math.round(from * FPS)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />
  );
  return (
    <AbsoluteFill style={{ background: C.night, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: 'scale(1.25)', filter: 'blur(36px) brightness(0.38) saturate(1.3)' }}>{video({})}</AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 70% at 30% 85%, rgba(5,4,7,0.85), transparent 70%)' }} />
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: '30% 40%' }}>
        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 70,
            width: 1920 * 0.68,
            height: 1080 * 0.68,
            transform: `translateY(${(1 - enter) * 40}px) rotateY(${ry}deg) rotateX(${rx}deg)`,
            transformOrigin: '100% 0%',
            borderRadius: 18,
            overflow: 'hidden',
            opacity: enter,
            boxShadow: `0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(220,171,118,0.35), 0 0 60px rgba(220,171,118,0.18)`,
          }}
        >
          {video({ transform: `scale(${1 + zoom * p})`, transformOrigin: focus })}
          <AbsoluteFill style={{ background: 'linear-gradient(115deg, rgba(255,240,220,0.10), transparent 35%)', mixBlendMode: 'screen' }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
