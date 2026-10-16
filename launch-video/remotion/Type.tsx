import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { C, mono, montserrat, serif } from './theme';

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const out = Easing.bezier(0.7, 0, 0.84, 0);

/** In and out envelopes for a piece of type that lives the whole of its Sequence. */
function useLife(inF = 14, outF = 10) {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const a = interpolate(f, [0, inF], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const b = interpolate(f, [d - outF, d], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out });
  return { f, d, a, b, live: Math.min(a, b) };
}

/** A line that rises out of a mask, word by word. */
export const Rise: React.FC<{ text: string; size?: number; font?: string; weight?: number; color?: string; italic?: boolean; stagger?: number; track?: string; delay?: number; upper?: boolean }> = ({
  text,
  size = 64,
  font = serif,
  weight = 400,
  color = C.white,
  stagger = 3,
  track = '0',
  delay = 0,
  upper = false,
}) => {
  const { f, b } = useLife();
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.26}px`, fontFamily: font, fontStyle: font === serif ? 'italic' : 'normal', fontSize: size, fontWeight: weight, color, letterSpacing: track, lineHeight: 1.12, textTransform: upper ? 'uppercase' : 'none', opacity: b }}>
      {words.map((w, i) => {
        const d = f - delay - i * stagger;
        const y = interpolate(d, [0, 18], [105, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
        const o = interpolate(d, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const bl = interpolate(d, [0, 14], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span style={{ display: 'inline-block', transform: `translateY(${y}%)`, opacity: o, filter: `blur(${bl}px)`, textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/**
 * The feature callout: a mono kicker with an index, a big two-part line (caps + serif) and a gold
 * rule drawing under it. Placed bottom-left like a chapter card.
 */
export const Callout: React.FC<{ n: string; kicker: string; caps: string; serifText: string; align?: 'left' | 'right' }> = ({ n, kicker, caps, serifText, align = 'left' }) => {
  const { f, live } = useLife(16, 8);
  const rule = interpolate(f, [4, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const capsY = interpolate(f, [2, 20], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const serY = interpolate(f, [7, 25], [100, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const side = align === 'left' ? { left: 110 } : { right: 110, alignItems: 'flex-end' as const, textAlign: 'right' as const };
  return (
    <div style={{ position: 'absolute', bottom: 120, ...side, display: 'flex', flexDirection: 'column', gap: 14, opacity: live }}>
      <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: '0.32em', color: C.mint, textTransform: 'uppercase', display: 'flex', gap: 18, alignItems: 'center' }}>
        <span style={{ color: C.ink }}>{n}</span>
        <span style={{ width: 40, height: 1, background: C.mint, opacity: 0.6 }} />
        {kicker}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ transform: `translateY(${capsY}%)`, fontFamily: montserrat, fontWeight: 200, fontSize: 62, letterSpacing: '0.2em', color: C.white, textTransform: 'uppercase', textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>{caps}</div>
      </div>
      <div style={{ overflow: 'hidden', marginTop: -10 }}>
        <div style={{ transform: `translateY(${serY}%)`, fontFamily: serif, fontStyle: 'italic', fontSize: 58, color: C.inkHot, textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>{serifText}</div>
      </div>
      <div style={{ height: 1.5, width: 420 * rule, background: `linear-gradient(90deg, ${C.ink}, transparent)`, alignSelf: align === 'left' ? 'flex-start' : 'flex-end' }} />
    </div>
  );
};

/** A tiny mono caption (where the shot was taken). */
export const Caption: React.FC<{ text: string; corner?: 'tr' | 'tl' | 'br' }> = ({ text, corner = 'tr' }) => {
  const { live } = useLife(10, 6);
  const pos = corner === 'tr' ? { top: 64, right: 80 } : corner === 'tl' ? { top: 64, left: 80 } : { bottom: 64, right: 80 };
  return (
    <div style={{ position: 'absolute', ...pos, fontFamily: mono, fontSize: 15, letterSpacing: '0.28em', color: C.dim, textTransform: 'uppercase', opacity: live, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.mint, boxShadow: `0 0 10px ${C.mint}` }} />
      {text}
    </div>
  );
};
