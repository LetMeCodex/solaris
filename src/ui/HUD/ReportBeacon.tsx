import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { draw as drawVela, W as VW, H as VH } from '../../report/vela/sprite';

/**
 * The way into the technical report: a telescope eyepiece. Inside it the sky slowly slews past a
 * fixed reticle (the report's own background is a telescope turning to a new target for every
 * chapter); beside it a ticker types out the chapter titles. Hover for what's inside, click and
 * the eyepiece opens out to fill the screen as the report loads.
 */

const REPORT = `${import.meta.env.BASE_URL}report/`;
const CHAPTERS = [
  'Where everything is',
  'Scale and precision',
  'Stars and the galaxy',
  'The Sun',
  'Surface imagery',
  'Other skies',
  'Nebulae',
  'Sagittarius A*',
  'Vela',
  'The soundtrack',
  'The interface',
  'The launch film',
  'What broke',
  'Build log',
  'References',
  'Colophon',
];

// A fixed little star field, the same on every load
const STARS = Array.from({ length: 26 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.678;
  return { x: (a - Math.floor(a)) * 40, y: (b - Math.floor(b)) * 40, r: 0.25 + ((i * 7) % 5) * 0.12 };
});

/** Types each chapter title out, holds it, and moves on. */
function useTicker(paused: boolean) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (paused) return;
    const full = CHAPTERS[i].length;
    const id = window.setTimeout(
      () => {
        if (n < full) setN(n + 1);
        else {
          setI((i + 1) % CHAPTERS.length);
          setN(0);
        }
      },
      n < full ? 42 : 2600
    );
    return () => window.clearTimeout(id);
  }, [i, n, paused]);
  return { i, text: CHAPTERS[i].slice(0, n) };
}

const VelaPx: React.FC = () => {
  const px = useMemo(() => drawVela({ eyes: 'happy', mouth: 'grin', arms: 'wave1', costume: 'glasses', gaze: [0.4, 0], cheeks: true, sweat: false, star: 1 }), []);
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="frep-vela" shapeRendering="crispEdges" aria-hidden>
      {px.map(([x, y, c]) => <rect key={`${x}.${y}`} x={x} y={y} width={1.02} height={1.02} fill={c} />)}
    </svg>
  );
};

export const ReportBeacon: React.FC = () => {
  const [hover, setHover] = useState(false);
  const [warp, setWarp] = useState<{ x: number; y: number } | null>(null);
  const eye = useRef<HTMLSpanElement>(null);
  const { i, text } = useTicker(hover);

  // Coming back from the report (back button, page cache): close the iris again
  useEffect(() => {
    const onShow = () => setWarp(null);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const open = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    // new tab, new window and the like keep the browser's own behaviour
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const r = eye.current?.getBoundingClientRect();
    setWarp({ x: r ? r.left + r.width / 2 : 40, y: r ? r.top + r.height / 2 : 40 });
    window.setTimeout(() => window.location.assign(REPORT), 900);
  };

  return (
    <>
      <a
        href={REPORT}
        className={`frep ${hover ? 'is-hover' : ''}`}
        onClick={open}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Open the field report: how Solaris was made, in 16 chapters"
      >
        <span ref={eye} className="frep-eye" aria-hidden>
          <svg viewBox="0 0 40 40">
            <defs>
              <clipPath id="frep-clip">
                <circle cx="20" cy="20" r="15.2" />
              </clipPath>
              <radialGradient id="frep-neb" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(240,150,110,0.55)" />
                <stop offset="45%" stopColor="rgba(143,120,255,0.18)" />
                <stop offset="100%" stopColor="rgba(143,120,255,0)" />
              </radialGradient>
              <radialGradient id="frep-vignette" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18.6" className="frep-limb" />
            <g className="frep-ticks">
              {Array.from({ length: 16 }, (_, k) => (
                <line key={k} x1="20" y1="1.7" x2="20" y2={k === i ? 4.6 : 3.3} transform={`rotate(${k * 22.5} 20 20)`} className={k === i ? 'on' : ''} />
              ))}
            </g>
            <g clipPath="url(#frep-clip)">
              <rect x="0" y="0" width="40" height="40" fill="#05040a" />
              {/* the sky slews past: two copies of the field, side by side */}
              <g className="frep-sky">
                {[0, 40].map((ox) => (
                  <g key={ox} transform={`translate(${ox} 0)`}>
                    <ellipse cx="26" cy="17" rx="9" ry="5.5" fill="url(#frep-neb)" transform="rotate(-24 26 17)" />
                    {STARS.map((s, k) => <circle key={k} cx={s.x} cy={s.y} r={s.r} className="frep-star" style={{ animationDelay: `${(k * 0.37) % 3}s` }} />)}
                  </g>
                ))}
              </g>
              <circle cx="20" cy="20" r="15.2" fill="url(#frep-vignette)" />
            </g>
            {/* the reticle stays put while the sky moves */}
            <g className="frep-reticle">
              <path d="M20 9.5 V16.2 M20 23.8 V30.5 M9.5 20 H16.2 M23.8 20 H30.5" />
              <path className="frep-brk" d="M13.4 15.6 V13.4 H15.6 M24.4 13.4 H26.6 V15.6 M26.6 24.4 V26.6 H24.4 M15.6 26.6 H13.4 V24.4" />
            </g>
          </svg>
        </span>
        <span className="frep-text">
          <span className="frep-name">Field report</span>
          <span className="frep-sub">
            <b>§{String(i + 1).padStart(2, '0')}</b> {text}
            <i className="frep-caret" />
          </span>
        </span>

        <span className="frep-card" role="presentation">
          <span className="frep-strip" aria-hidden>
            {CHAPTERS.map((c, k) => <i key={c} className={k <= i ? 'on' : ''} style={{ transitionDelay: `${k * 30}ms` }} />)}
          </span>
          <span className="frep-lede">How Solaris was made</span>
          <span className="frep-body">
            Where every number and image comes from, how each part is drawn, what broke and how it was fixed. 16 chapters, 23 live figures, explained by Vela.
          </span>
          <span className="frep-foot">
            <VelaPx />
            <span className="frep-go">Open the report <span aria-hidden>→</span></span>
          </span>
        </span>
      </a>

      {warp &&
        createPortal(
          <div className="frep-warp" style={{ ['--x' as string]: `${warp.x}px`, ['--y' as string]: `${warp.y}px` }} aria-hidden>
            <div className="frep-warp-in">
              <span className="frep-warp-k">Opening the</span>
              <span className="frep-warp-t">Field report</span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
