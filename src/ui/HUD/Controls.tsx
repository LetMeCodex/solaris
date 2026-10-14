import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

/* ==========================================================================
   SEGMENTED — the highlight glides to the chosen option
   ========================================================================== */
export interface SegItem<T extends string | number> {
  value: T;
  label: string;
  title?: string;
}

export function Segmented<T extends string | number>({
  items,
  value,
  onChange,
  ariaLabel,
}: {
  items: SegItem<T>[];
  value: T | null;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [glide, setGlide] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
      setGlide(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [value, items.length]);

  return (
    <div ref={wrap} className="hud-seg" role="group" aria-label={ariaLabel}>
      <span className="glider" style={glide ? { left: glide.left, width: glide.width, opacity: 1 } : { opacity: 0 }} />
      {items.map((it) => (
        <button
          key={String(it.value)}
          type="button"
          aria-pressed={value === it.value}
          title={it.title}
          onClick={(e) => {
            e.stopPropagation();
            onChange(it.value);
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ==========================================================================
   SCALE LADDER — one ruler from a planet's skyline to the galactic core
   ========================================================================== */
export type ScaleDomain = 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a';

const LADDER: Array<{ id: ScaleDomain; label: string; span: string }> = [
  { id: 'planetary', label: 'Planet', span: '10⁴ km' },
  { id: 'inner_system', label: 'Inner', span: '1 AU' },
  { id: 'outer_system', label: 'Outer', span: '30 AU' },
  { id: 'interstellar', label: 'Stars', span: '1 ly' },
  { id: 'galactic', label: 'Milky Way', span: '10⁵ ly' },
  { id: 'sgr_a', label: 'Sgr A*', span: '27k ly' },
];

export const ScaleLadder: React.FC<{ current: ScaleDomain; readout: string; onJump: (d: ScaleDomain) => void }> = ({
  current,
  readout,
  onJump,
}) => {
  const idx = Math.max(0, LADDER.findIndex((l) => l.id === current));
  const pos = (i: number) => `${(i / (LADDER.length - 1)) * 100}%`;
  return (
    <div className="hud-ladder w-[440px]" role="group" aria-label="Scale">
      <div className="flex items-baseline justify-center gap-2 mb-2">
        <span className="hud-label">Scale</span>
        <span className="hud-num text-[11px] text-white/90">{readout}</span>
      </div>
      <div className="relative h-[6px] mx-6">
        <div className="ticks" />
        {LADDER.map((l, i) => (
          <span key={l.id} className="absolute top-[-2px] w-px h-[10px] bg-white/35" style={{ left: pos(i) }} />
        ))}
        <span className="marker" style={{ left: pos(idx) }} />
      </div>
      <div className="relative h-7 mx-6 mt-2">
        {LADDER.map((l, i) => (
          <button
            key={l.id}
            type="button"
            aria-current={i === idx ? 'true' : undefined}
            onClick={(e) => {
              e.stopPropagation();
              onJump(l.id);
            }}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
            style={{ left: pos(i) }}
            title={`Jump to ${l.label} scale (${l.span})`}
          >
            <span>{l.label}</span>
            <span className="hud-num text-[8px] tracking-[0.06em] opacity-60">{l.span}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   CHRONO THROTTLE — time is a lever. Detents at each rate; the rail runs
   hotter and its current flows faster the harder you push it.
   ========================================================================== */
const SPEEDS = [
  { value: 1, label: '1×', title: 'Real time' },
  { value: 10, label: '10×' },
  { value: 100, label: '100×' },
  { value: 86400, label: 'd/s', title: 'One day per second' },
  { value: 2592000, label: 'mo/s', title: 'One month per second' },
  { value: 31536000, label: 'yr/s', title: 'One year per second' },
];

const Throttle: React.FC<{ index: number; paused: boolean; onPick: (i: number) => void }> = ({ index, paused, onPick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const n = SPEEDS.length;
  const pos = (i: number) => `calc(6px + (100% - 12px) * ${i / (n - 1)})`;
  const at = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left - 6) / (r.width - 12)));
    return Math.round(f * (n - 1));
  };
  const shown = drag ?? index;
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Time rate"
      aria-valuemin={0}
      aria-valuemax={n - 1}
      aria-valuenow={index}
      aria-valuetext={SPEEDS[index].title ?? SPEEDS[index].label}
      className={`hud-throttle ${paused ? 'paused' : ''} ${drag !== null ? 'dragging' : ''}`}
      style={{ ['--heat' as string]: paused ? 0 : index / (n - 1) }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag(at(e.clientX));
      }}
      onPointerMove={(e) => {
        if (drag !== null) setDrag(at(e.clientX));
      }}
      onPointerUp={(e) => {
        if (drag === null) return;
        const i = at(e.clientX);
        setDrag(null);
        onPick(i);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          e.stopPropagation();
          onPick(Math.min(n - 1, index + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          e.stopPropagation();
          onPick(Math.max(0, index - 1));
        }
      }}
    >
      <span className="rail" />
      <span className="fill" style={{ width: `calc((100% - 12px) * ${shown / (n - 1)})` }} />
      {SPEEDS.map((s, i) => (
        <React.Fragment key={s.value}>
          <span className="detent" style={{ left: pos(i) }} />
          <span className={`lbl ${i === shown ? 'on' : ''}`} style={{ left: pos(i) }} title={s.title}>
            {s.label}
          </span>
        </React.Fragment>
      ))}
      <span className="knob" style={{ left: pos(shown) }} />
    </div>
  );
};

const DIGITS = '0123456789'.split('');

/** Digits roll to their new value like an odometer. */
export const RollingText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={`hud-roll ${className ?? ''}`} aria-label={text}>
    {text.split('').map((ch, i) =>
      /\d/.test(ch) ? (
        <span key={i} className="col" aria-hidden style={{ transform: `translateY(-${Number(ch) * 1.2}em)` }}>
          {DIGITS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </span>
      ) : (
        <span key={i} aria-hidden>{ch}</span>
      )
    )}
  </span>
);

export const TimeDeck: React.FC<{
  isPaused: boolean;
  multiplier: number;
  date: string;
  onTogglePlay: () => void;
  onSetMultiplier: (m: number) => void;
  onJ2000: () => void;
  onNow: () => void;
  onSeek: (utcMs: number) => void;
}> = ({ isPaused, multiplier, date, onTogglePlay, onSetMultiplier, onJ2000, onNow, onSeek }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draft, setDraft] = useState(date);
  useEffect(() => {
    if (!pickerOpen) setDraft(date);
  }, [date, pickerOpen]);

  // The ring turns faster as time compresses: one turn per 14 s at 1×, ~1.2 s at a year per second
  const spinSec = 14 / (1 + Math.log10(Math.max(1, multiplier)) * 1.4);
  const idx = Math.max(0, SPEEDS.findIndex((s) => s.value === multiplier));

  return (
    <div className="flex flex-col items-center gap-2">
      {pickerOpen && (
        <form
          className="hud-frame hud-menu flex items-center gap-2 px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            const ms = Date.parse(draft);
            if (!isNaN(ms)) {
              onSeek(ms);
              setPickerOpen(false);
            }
          }}
        >
          <span className="hud-label">Travel to</span>
          <input
            type="date"
            aria-label="Simulation date (UTC)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="hud-input hud-num !w-auto !py-1 [color-scheme:dark]"
          />
          <button type="submit" className="hud-btn is-on">Jump</button>
          <button type="button" onClick={() => setPickerOpen(false)} className="hud-icon-btn !w-6 !h-6" aria-label="Close date picker">
            <X size={11} />
          </button>
        </form>
      )}
      <div className="hud-frame flex items-center gap-2 sm:gap-3 pl-1.5 pr-2 sm:pr-3 py-1.5 max-w-full overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className={`hud-play shrink-0 ${isPaused ? 'paused' : ''}`}
          style={{ ['--spin' as string]: `${spinSec}s` }}
          aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
          title="Space"
        >
          <svg className="orbit-ring" viewBox="0 0 32 32" aria-hidden>
            <circle cx="16" cy="16" r="14.5" fill="none" stroke="rgba(244,205,114,0.55)" strokeWidth="1" strokeDasharray="2 3.2" />
            <circle cx="16" cy="1.5" r="1.4" fill={isPaused ? 'rgba(244,205,114,0.6)' : '#6dfcc0'} />
          </svg>
          {isPaused ? (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 1 L9 5 L2 9 Z" fill="currentColor" /></svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 1h2v8H2zM6 1h2v8H6z" fill="currentColor" /></svg>
          )}
        </button>

        <div className="shrink-0">
          <Throttle index={idx} paused={isPaused} onPick={(i) => onSetMultiplier(SPEEDS[i].value)} />
        </div>

        <span className="w-px h-5 bg-white/10 shrink-0" />
        <button type="button" onClick={(e) => { e.stopPropagation(); onJ2000(); }} className="hud-btn !px-2 !hidden sm:!inline-flex" title="Epoch J2000.0 (1 Jan 2000, 12:00 TT)">J2000</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onNow(); }} className="hud-btn !px-2" title="Return to the present">Now</button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen((o) => !o);
          }}
          aria-expanded={pickerOpen}
          aria-label={`Jump to date (current ${date})`}
          className="hud-btn !px-2 !tracking-[0.12em] !text-white/80"
        >
          <Calendar size={10} className="text-[color:var(--sol-amber)]" />
          <RollingText text={date} className="hud-num !hidden sm:!inline-flex" />
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   POPOVER — closes on outside click and Escape
   ========================================================================== */
export const Popover: React.FC<{ open: boolean; onClose: () => void; className?: string; children: React.ReactNode }> = ({
  open,
  onClose,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('[data-popover-trigger]')) onClose();
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', down);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} className={`hud-frame hud-menu ${className ?? ''}`}>
      {children}
    </div>
  );
};
