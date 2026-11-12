import { useEffect, useRef } from 'react';

/**
 * Frames per second, as drawn: animation frames counted over half a second (the scene draws once
 * per animation frame), with the slowest frame of that half second, which is what a stutter is.
 * Green at the display's pace, amber below ~50, red below 30. Updated straight into the DOM: no
 * React render per frame.
 */
export function FpsCounter({ style }: { style?: React.CSSProperties }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let worst = 0;
    let last = performance.now();
    let windowStart = last;
    const tick = (now: number): void => {
      frames++;
      worst = Math.max(worst, now - last);
      last = now;
      if (now - windowStart >= 500) {
        const fps = Math.round((frames * 1000) / (now - windowStart));
        const el = ref.current;
        if (el) {
          el.textContent = `${fps} FPS · ${worst.toFixed(0)} MS MAX`;
          el.style.color = fps >= 50 ? 'rgba(126,230,170,0.85)' : fps >= 30 ? 'rgba(244,205,114,0.9)' : 'rgba(255,120,110,0.95)';
        }
        frames = 0;
        worst = 0;
        windowStart = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      ref={ref}
      aria-label="Frames per second"
      style={{ fontSize: 9, letterSpacing: '0.3em', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.5)', ...style }}
    >
      -- FPS
    </div>
  );
}
