import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { draw as drawVela, W as VW, H as VH, type Eyes, type Mouth, type Arms, type Costume } from '../report/vela/sprite';
import { press, type InkSource, type Print, type PressJob } from './ink';

/** A page tells its panels whether it is the one being read; only then do they move. */
export const LiveContext = createContext(false);
/** Jump to a page by id, from the contents and the cross-references. */
export const GoContext = createContext<(id: string) => void>(() => {});

// ---------------------------------------------------------------------------------- inked panels
export const Ink: React.FC<{ src: InkSource; alt: string; className?: string; style?: React.CSSProperties } & Print> = ({ src, alt, className, style, ...print }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const job = useRef<PressJob | null>(null);
  const live = useContext(LiveContext);
  useEffect(() => {
    const c = ref.current!;
    const fit = () => {
      const r = Math.min(1.5, window.devicePixelRatio || 1) * Math.max(0.5, c.getBoundingClientRect().width / Math.max(1, c.clientWidth) || 1);
      c.width = Math.round(c.clientWidth * r);
      c.height = Math.round(c.clientHeight * r);
      if (job.current) press.resize(job.current);
    };
    fit();
    const j = press.add(c, src, print);
    job.current = j;
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => { ro.disconnect(); if (j) press.remove(j); job.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (job.current) press.setLive(job.current, live); }, [live]);
  return <canvas ref={ref} className={`ink ${className ?? ''}`} style={style} role="img" aria-label={alt} />;
};

/** Footage, by the name of its clip. */
export const Clip: React.FC<{ name: string; alt: string } & Print> = ({ name, ...r }) => <Ink src={{ kind: 'video', name }} {...r} />;

// ---------------------------------------------------------------------------------- the page grid
/** A manga page's layout: rows and columns of panels with a gutter. */
export const Grid: React.FC<{ cols?: string; rows?: string; gap?: number; style?: React.CSSProperties; className?: string; children: React.ReactNode }> = ({ cols = '1fr 1fr', rows, gap = 10, style, className, children }) => (
  <div className={`grid ${className ?? ''}`} style={{ gridTemplateColumns: cols, gridTemplateRows: rows, gap, ...style }}>{children}</div>
);

/** One panel. `shape` slants its edges; `tone` is its ground. */
export const P: React.FC<{ c?: string; r?: string; shape?: 'a' | 'b' | 'c' | 'd' | 'iris'; tone?: 'ink' | 'orange' | 'green' | 'paper'; bare?: boolean; ar?: string; style?: React.CSSProperties; className?: string; children?: React.ReactNode }> = ({ c, r, shape, tone, bare, ar, style, className, children }) => (
  <div className={`p a-p ${shape ? `sh-${shape}` : ''} ${tone ? `t-${tone}` : ''} ${bare ? 'bare' : ''} ${className ?? ''}`} style={{ gridColumn: c, gridRow: r, ['--ar' as string]: ar, ...style }}>
    <div className="p-in">{children}</div>
  </div>
);

// ---------------------------------------------------------------------------------- lettering
export const Say: React.FC<{ x?: number | string; y?: number | string; r?: number | string; b?: number | string; w?: number; tail?: 'sw' | 'se' | 'nw' | 'ne' | 'none'; shout?: boolean; children: React.ReactNode }> = ({ x, y, r, b, w, tail = 'sw', shout, children }) => (
  <div className={`say a-b tail-${tail} ${shout ? 'shout' : ''}`} style={{ left: x, top: y, right: r, bottom: b, width: w }}>{children}</div>
);

/** A narration box. */
export const Cap: React.FC<{ x?: number | string; y?: number | string; r?: number | string; b?: number | string; w?: number; tone?: 'paper' | 'ink' | 'green' | 'orange'; children: React.ReactNode }> = ({ x, y, r, b, w, tone = 'paper', children }) => (
  <div className={`cap a-b c-${tone}`} style={{ left: x, top: y, right: r, bottom: b, width: w }}>{children}</div>
);

/** A sound effect, in the Japanese of manga, with its reading underneath. */
export const Sfx: React.FC<{ jp: string; en?: string; x?: number | string; y?: number | string; r?: number | string; b?: number | string; size?: number; rot?: number; tone?: 'ink' | 'orange' | 'green' | 'paper' }> = ({ jp, en, x, y, r, b, size = 64, rot = -8, tone = 'ink' }) => (
  <div className={`sfx a-s s-${tone}`} style={{ left: x, top: y, right: r, bottom: b, fontSize: size, ['--rot' as string]: `${rot}deg` }} aria-hidden={!en}>
    <span>{jp}</span>
    {en && <small>{en}</small>}
  </div>
);

/** The green band and heavy slab of the 1930s catalogue. */
export const Band: React.FC<{ tone?: 'green' | 'orange' | 'ink'; size?: number; children: React.ReactNode }> = ({ tone = 'green', size = 44, children }) => (
  <div className={`band b-${tone}`} style={{ fontSize: size }}>{children}</div>
);

export const Plate: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <figure className="plate">
    {children}
    <figcaption><b>Plate {n}.</b> {title}</figcaption>
  </figure>
);

/** Small, justified catalogue text. */
export const Txt: React.FC<{ cols?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ cols = 1, style, children }) => (
  <div className="txt a-f" style={{ columnCount: cols, ...style }}>{children}</div>
);

/** A citation, numbered as in the bibliography. */
export const Ref: React.FC<{ n: number }> = ({ n }) => <sup className="cite">[{n}]</sup>;

// ---------------------------------------------------------------------------------- a fletched arrow, from the 1937 press
export const Arrow: React.FC<{ x?: number | string; y?: number | string; r?: number | string; b?: number | string; len?: number; rot?: number; tone?: 'green' | 'orange' }> = ({ x, y, r, b, len = 150, rot = 0, tone = 'green' }) => (
  <svg className={`arrow a-s ar-${tone}`} viewBox="0 0 200 60" width={len} height={len * 0.3} style={{ left: x, top: y, right: r, bottom: b, ['--rot' as string]: `${rot}deg` }} aria-hidden>
    <path d="M0 22l24 8-24 8 14-8zM14 18l24 12-24 12 14-12zM28 18l24 12-24 12 14-12z" />
    <path d="M40 27h124v-13l36 16-36 16v-13H40z" />
  </svg>
);

/** Noorda's signage arrow: white on an orange disc. */
export const Roundel: React.FC<{ dir?: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315; size?: number }> = ({ dir = 0, size = 44 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden style={{ flex: 'none' }}>
    <circle cx="24" cy="24" r="24" fill="var(--orange)" />
    <path transform={`rotate(${dir} 24 24)`} d="M11 21.5h17l-7-7h7l10 9.5-10 9.5h-7l7-7H11z" fill="var(--paper)" />
  </svg>
);

/** Focus lines, drawn three ways so they flicker on threes. */
export const Lines: React.FC<{ cx?: number; cy?: number; tone?: string; inner?: number; n?: number; seed?: number; opacity?: number }> = ({ cx = 50, cy = 50, tone = 'var(--ink)', inner = 26, n = 74, seed = 3, opacity = 1 }) => {
  const sets = useMemo(() => [0, 1, 2].map((k) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.sin(i * 12.9 + k * 7 + seed) * 0.05;
      const r0 = inner + (Math.sin(i * 78.2 + k * 3 + seed) + 1) * 8;
      const w = 0.25 + (Math.sin(i * 4.1 + k + seed) + 1) * 0.28;
      const x1 = cx + Math.cos(a - w * 0.02) * 140, y1 = cy + Math.sin(a - w * 0.02) * 140;
      const x2 = cx + Math.cos(a + w * 0.02) * 140, y2 = cy + Math.sin(a + w * 0.02) * 140;
      d += `M${(cx + Math.cos(a) * r0).toFixed(1)} ${(cy + Math.sin(a) * r0).toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}Z`;
    }
    return d;
  }), [cx, cy, inner, n, seed]);
  return (
    <svg className="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ opacity }}>
      {sets.map((d, i) => <path key={i} d={d} fill={tone} className={`fl fl${i}`} />)}
    </svg>
  );
};

// ---------------------------------------------------------------------------------- Vela, in ink
const INKS: Record<string, string> = {
  '#0e3a32': 'var(--ink)', '#6dfcc0': 'var(--green)', '#38c995': 'var(--green-d)', '#e2fff4': 'var(--paper)', '#071014': 'var(--ink)', '#ffffff': 'var(--paper)',
  '#ffd28a': 'var(--orange)', '#fff6e0': 'var(--paper)', '#ff8fa6': 'var(--orange)', '#ff6f8a': 'var(--orange)', '#ffc94a': 'var(--orange)', '#d99a1c': 'var(--ink)', '#0a0a10': 'var(--ink)',
  '#dcab76': 'var(--ink)', '#5b6476': 'var(--ink)', '#7cc8ff': 'var(--paper)', '#ff7a59': 'var(--orange)', '#c9502f': 'var(--ink)',
};

export const Vela: React.FC<{ eyes?: Eyes; mouth?: Mouth; arms?: Arms; costume?: Costume; size?: number; x?: number | string; y?: number | string; r?: number | string; b?: number | string; flip?: boolean; cheeks?: boolean; sweat?: boolean; still?: boolean; sil?: boolean }> = ({ eyes = 'open', mouth = 'smile', arms = 'down', costume = 'none', size = 120, x, y, r, b, flip, cheeks = true, sweat = false, still, sil }) => {
  const a = useMemo(() => drawVela({ eyes, mouth, arms, costume, gaze: [0, 0], cheeks, sweat, star: 1 }), [eyes, mouth, arms, costume, cheeks, sweat]);
  const pinned = x !== undefined || y !== undefined || r !== undefined || b !== undefined;
  return (
    <svg className={`vela ${still ? '' : 'bob'} a-b`} viewBox={`0 0 ${VW} ${VH}`} width={size} height={(size * VH) / VW} shapeRendering="crispEdges" role="img" aria-label="Vela" style={{ position: pinned ? 'absolute' : undefined, left: x, top: y, right: r, bottom: b, ['--flip' as string]: flip ? -1 : 1 }}>
      {a.map(([px, py, c]) => <rect key={`${px}.${py}`} x={px} y={py} width={1.03} height={1.03} fill={sil ? (c === '#ffd28a' || c === '#fff6e0' ? 'var(--orange)' : 'var(--ink)') : INKS[c] ?? c} />)}
    </svg>
  );
};

/** The opening of a chapter: a huge numeral and a title, in the manner of a magazine cover. */
export const Opener: React.FC<{ n: string; kicker: string; title: React.ReactNode; tone?: 'green' | 'orange'; children?: React.ReactNode }> = ({ n, kicker, title, tone = 'green', children }) => (
  <div className={`opener o-${tone}`}>
    <div className="op-k a-f"><b>Chapter {n}</b><span>{kicker}</span></div>
    <div className="op-n a-f">{n}</div>
    <h2 className="op-t a-f">{title}</h2>
    {children}
  </div>
);

/** Vertical type, as a manga title runs down the page. */
export const Tate: React.FC<{ x?: number | string; y?: number | string; r?: number | string; b?: number | string; size?: number; color?: string; children: React.ReactNode }> = ({ x, y, r, b, size = 60, color = 'var(--ink)', children }) => (
  <div className="tate a-f" style={{ left: x, top: y, right: r, bottom: b, fontSize: size, color }}>{children}</div>
);

/** A carved seal, stamped in red. */
export const Hanko: React.FC<{ text: string; size?: number; x?: number | string; y?: number | string; r?: number | string; b?: number | string; rot?: number }> = ({ text, size = 90, x, y, r, b, rot = -4 }) => (
  <div className="hanko a-s" style={{ left: x, top: y, right: r, bottom: b, width: size, height: size, fontSize: size * 0.62, ['--rot' as string]: `${rot}deg` }}>{text}</div>
);

/** A slip from Vela's notebook, taped into the page. */
export const Note: React.FC<{ n: string; rot?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ n, rot = -0.8, style, children }) => (
  <aside className="note a-f" style={{ ['--rot' as string]: `${rot}deg`, ...style }}>
    <i className="tape" />
    <small>Vela’s notebook · {n}</small>
    <p>{children}</p>
  </aside>
);
