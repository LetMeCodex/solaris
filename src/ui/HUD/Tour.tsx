import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DecodeText } from './Instruments';

/**
 * First-visit guided tour. A spotlight glides between HUD instruments (marked with data-tour), a
 * briefing card docks beside each, and some steps demonstrate the control live (layers switch off
 * and back on, the time lever is pushed and returned). Steps whose instrument is not on screen at
 * this size are skipped automatically.
 */
export interface TourDemos {
  toggleOrbits?: () => void;
  setTimeRate?: (m: number) => void;
  timeRate?: number;
  openOptics?: (open: boolean) => void;
  showNebulae?: (on: boolean) => void;
  /** Open the Atlas on a tab (null closes it). */
  atlas?: (tab: 'worlds' | 'all' | 'nebulae' | 'gallery' | null) => void;
  /** Make sure a world is in view and open its explorer panel on a tab (null lets it go). */
  explorer?: (tab: 'survey' | 'waypoints' | 'moons' | 'skies' | null) => void;
}

interface Step {
  target: string | null; // data-tour id ("a|b": the first one on screen); null = centred card
  /** The demo brings its own instrument on screen, so never skip this step. */
  stage?: boolean;
  title: string;
  body: string;
  /** Vela's recorded line for this step. */
  voice: string;
  demo?: (d: TourDemos) => (() => void) | void;
}

const STEPS: Step[] = [
  {
    target: null,
    title: 'Welcome aboard',
    voice: 'tour.0',
    body: 'This is the real Solar System, at today\'s positions, computed from NASA JPL orbital elements. Every position, distance and light-delay you will see is calculated, not invented. A short briefing on your instruments follows.',
  },
  {
    target: 'nav',
    title: 'Destinations',
    voice: 'tour.1',
    body: 'Every major world, out to the black hole at the centre of the Milky Way. Pick one and the camera flies there; longer journeys take longer, because the distances are real.',
  },
  {
    target: 'navmode',
    title: 'Worlds & nebulae',
    voice: 'tour.13',
    body: 'Switch the list between the worlds and the nebulae. Pick a nebula and you leave the Solar System to stand in front of it: it grows from a smudge on the sky into something that fills it, and it moves the way it really does. Drag to swing around and see its layers.',
    demo: (d) => {
      const a = setTimeout(() => d.showNebulae?.(true), 1100);
      const b = setTimeout(() => d.showNebulae?.(false), 4200);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
        d.showNebulae?.(false);
      };
    },
  },
  {
    target: 'ladder',
    title: 'Scale ladder',
    voice: 'tour.2',
    body: 'Jump between orders of magnitude: a planet\'s skyline, the inner and outer system, the nearby stars, the whole galaxy, Sgr A*. The marker shows the scale you are at now.',
  },
  {
    target: 'layers',
    title: 'Layers',
    voice: 'tour.3',
    body: 'Overlay switches for orbits, constellation figures and the asteroid belt. Watch: the orbits switch off, then back on.',
    demo: (d) => {
      const a = setTimeout(() => d.toggleOrbits?.(), 900);
      const b = setTimeout(() => d.toggleOrbits?.(), 2600);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    },
  },
  {
    target: 'optics',
    title: 'Optics',
    voice: 'tour.4',
    body: 'Choose the camera lens (cinematic, fisheye, clean), bloom and the layers. Every distance is true; the worlds themselves are drawn larger than life so you can feel their size (change it in Settings). Small worlds carry a marker so you can find them. Keyboard shortcuts live here too.',
    demo: (d) => {
      const a = setTimeout(() => d.openOptics?.(true), 700);
      return () => {
        clearTimeout(a);
        d.openOptics?.(false);
      };
    },
  },
  {
    title: 'Atlas',
    voice: 'tour.5',
    body: 'Every planet, moon and small world, with a live cinematic view of each system behind it and how much you have explored. Index lists all of them; the Nebulae tab flies you out to them; the Gallery holds postcards from real places (step into any of them) and the pictures you take. Press / to open it from anywhere.',
    target: 'atlas-tabs|catalogue',
    stage: true,
    demo: (d) => {
      const seq: Array<[number, 'worlds' | 'all' | 'nebulae' | 'gallery']> = [[1400, 'worlds'], [4600, 'all'], [7600, 'nebulae'], [10600, 'gallery']];
      const t = seq.map(([ms, tab]) => setTimeout(() => d.atlas?.(tab), ms));
      return () => {
        t.forEach(clearTimeout);
        d.atlas?.(null);
      };
    },
  },
  {
    target: 'explorer',
    stage: true,
    title: 'World panel',
    voice: 'tour.17',
    body: 'At every world this panel opens up. Survey: your altitude and Stand here · look up, which puts you on the ground under that world\'s own sky. Places: landmarks to fly down to. Moons: the family around it. Skies: stand anywhere and look up at another world.',
    demo: (d) => {
      d.explorer?.('survey');
      const seq: Array<[number, 'survey' | 'waypoints' | 'moons' | 'skies']> = [[6500, 'waypoints'], [9500, 'moons'], [12500, 'skies']];
      const t = seq.map(([ms, tab]) => setTimeout(() => d.explorer?.(tab), ms));
      return () => {
        t.forEach(clearTimeout);
        d.explorer?.(null);
      };
    },
  },
  {
    target: 'record',
    title: 'Soundtrack',
    voice: 'tour.14',
    body: 'The Solaris soundtrack on a turning record. Every world has its own track, and the music changes the moment you choose a new destination. Tap the record for the album, the volume, and to play it through.',
  },
  {
    target: 'camera',
    title: 'Camera',
    voice: 'tour.15',
    body: 'Press P, or this shutter, to take a picture of the view without the interface. It goes to your Gallery in the Atlas; a picture taken while standing on a world remembers the place and moment, so you can step back into it.',
  },
  {
    target: 'settings',
    title: 'Settings',
    voice: 'tour.16',
    body: 'Everything is yours to tune: Vela\'s voice and how chatty she is, the music, how large the worlds are drawn, the nebulae, labels and layers, the lens, idle motion, and which instruments are shown.',
  },
  {
    target: 'time',
    title: 'Time lever',
    voice: 'tour.6',
    body: 'Time is a throttle: from real time up to a year per second. The ring around play spins faster as you push it. Watch the planets move as it jumps to a day per second, then comes back.',
    demo: (d) => {
      const prev = d.timeRate ?? 1;
      const a = setTimeout(() => d.setTimeRate?.(86400), 900);
      const b = setTimeout(() => d.setTimeRate?.(prev), 3200);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
        d.setTimeRate?.(prev);
      };
    },
  },
  {
    target: 'date',
    title: 'Travel in time',
    voice: 'tour.7',
    body: 'Jump to J2000, back to now, or to any date. The rolling digits show the simulation date.',
  },
  {
    target: 'logbook',
    title: 'Logbook',
    voice: 'tour.8',
    body: 'Each world you reach lights a diamond and adds to the distance you have flown. It is saved in this browser.',
  },
  {
    target: 'scope',
    title: 'Attitude scope',
    voice: 'tour.9',
    body: 'Your orientation against the plane of the planets: Z is ecliptic north, ☉ marks the Sun, the mint arrow is where you are travelling.',
  },
  {
    target: 'plot',
    title: 'Galactic plot',
    voice: 'tour.10',
    body: 'Where you are in the Milky Way: the Sun 27,000 light-years from Sgr A*, and the Solar System magnified a billion times in the lens. Hover to see the arms; click any world to fly there.',
  },
  {
    target: 'monograph',
    title: 'Dossier',
    voice: 'tour.11',
    body: 'Each arrival brings a short dossier: distance from the Sun, size, length of day and how long a signal takes from Earth. Read more opens the full record.',
  },
  {
    target: null,
    title: 'You are cleared for departure',
    voice: 'tour.12',
    body: 'Drag to look around, scroll to approach, Esc for the overview, H hides the interface. Stand on a world and look up, and leave it a while: the sky turns as a time-lapse. At Sgr A*, try the Horizon viewpoint. Replay this briefing any time with the ? button.',
  },
];

const KEY = 'solaris.tour.v1';

/** Vela's line for a step of the briefing (steps can be skipped at small sizes; the index is the step's). */
export function tourVoice(index: number): string | null {
  return STEPS[index]?.voice ?? null;
}

/** How many steps the briefing has. */
export const TOUR_STEPS = (): number => STEPS.length;

export function tourSeen(): boolean {
  try {
    return localStorage.getItem(KEY) === 'done';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(KEY, 'done');
  } catch {
    /* ignore */
  }
}

type Rect = { x: number; y: number; w: number; h: number };

/** The instrument a step points at, if it is on screen ("a|b": the first of them that is). */
function findTarget(id: string | null): HTMLElement | null {
  if (!id) return null;
  for (const part of id.split('|')) {
    const el = document.querySelector<HTMLElement>(`[data-tour="${part}"]`);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (r.width < 4 || r.height < 4 || style.visibility === 'hidden' || Number(style.opacity) < 0.05) continue;
    if (r.right < 0 || r.bottom < 0 || r.left > window.innerWidth || r.top > window.innerHeight) continue;
    return el;
  }
  return null;
}

export const Tour: React.FC<{ open: boolean; onClose: () => void; demos: TourDemos; onStep?: (index: number) => void }> = ({ open, onClose, demos, onStep }) => {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [card, setCard] = useState<{ x: number; y: number; side: 'left' | 'right' | 'top' | 'bottom' | 'center' }>({ x: 0, y: 0, side: 'center' });
  const cardRef = useRef<HTMLDivElement>(null);
  const demosRef = useRef(demos);
  demosRef.current = demos;

  const visibleTarget = useCallback((id: string | null) => findTarget(id), []);

  // Skip steps whose instrument is not on screen at this size
  const go = useCallback(
    (to: number, dir: 1 | -1) => {
      let n = to;
      while (n > 0 && n < STEPS.length - 1 && STEPS[n].target && !STEPS[n].stage && !visibleTarget(STEPS[n].target)) n += dir;
      setI(Math.max(0, Math.min(STEPS.length - 1, n)));
    },
    [visibleTarget]
  );

  const finish = useCallback(() => {
    markSeen();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  // Measure the target and place the card beside it (re-measured on resize and while animating)
  useLayoutEffect(() => {
    if (!open) return;
    let raf = 0;
    let lastKey = '';
    // Only touch React state when the layout actually changed
    const commit = (r: Rect | null, c: { x: number; y: number; side: 'left' | 'right' | 'top' | 'bottom' | 'center' }) => {
      const key = `${r ? [r.x, r.y, r.w, r.h].map(Math.round).join(',') : '-'}|${Math.round(c.x)},${Math.round(c.y)},${c.side}`;
      if (key === lastKey) return;
      lastKey = key;
      setRect(r);
      setCard(c);
    };
    const measure = () => {
      const step = STEPS[i];
      const el = visibleTarget(step.target);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = Math.min(340, vw - 32);
      const ch = cardRef.current?.offsetHeight ?? 200;
      if (!el) {
        commit(null, { x: (vw - cw) / 2, y: Math.max(16, (vh - ch) / 2), side: 'center' });
      } else {
        const r = el.getBoundingClientRect();
        const pad = 10;
        const rr = { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
        const gap = 28;
        let side: 'left' | 'right' | 'top' | 'bottom';
        let x: number;
        let y: number;
        if (vw < 640) {
          side = rr.y + rr.h / 2 > vh / 2 ? 'top' : 'bottom';
        } else if (rr.x + rr.w + gap + cw < vw - 16) side = 'right';
        else if (rr.x - gap - cw > 16) side = 'left';
        else side = rr.y + rr.h / 2 > vh / 2 ? 'top' : 'bottom';
        if (side === 'right' || side === 'left') {
          x = side === 'right' ? rr.x + rr.w + gap : rr.x - gap - cw;
          y = rr.y + rr.h / 2 - ch / 2;
        } else {
          x = rr.x + rr.w / 2 - cw / 2;
          y = side === 'bottom' ? rr.y + rr.h + gap : rr.y - gap - ch;
        }
        x = Math.max(16, Math.min(vw - cw - 16, x));
        y = Math.max(16, Math.min(vh - ch - 16, y));
        commit(rr, { x, y, side });
      }
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [open, i, visibleTarget]);

  // Narration hook
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;
  useEffect(() => {
    if (open) onStepRef.current?.(i);
  }, [open, i]);

  // Live demonstrations
  useEffect(() => {
    if (!open) return;
    const cleanup = STEPS[i].demo?.(demosRef.current);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [open, i]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (i === STEPS.length - 1) finish();
        else go(i + 1, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopImmediatePropagation();
        go(i - 1, -1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        finish();
      }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [open, i, go, finish]);

  if (!open) return null;
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const cw = Math.min(340, window.innerWidth - 32);

  // Connector from the card edge to the spotlight
  let line: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (rect && card.side !== 'center') {
    const ch = cardRef.current?.offsetHeight ?? 200;
    const cx = card.side === 'right' ? card.x : card.side === 'left' ? card.x + cw : card.x + cw / 2;
    const cy = card.side === 'bottom' ? card.y : card.side === 'top' ? card.y + ch : card.y + ch / 2;
    const tx = card.side === 'right' ? rect.x + rect.w : card.side === 'left' ? rect.x : rect.x + rect.w / 2;
    const ty = card.side === 'bottom' ? rect.y + rect.h : card.side === 'top' ? rect.y : rect.y + rect.h / 2;
    line = { x1: cx, y1: cy, x2: tx, y2: ty };
  }

  return (
    <div className="sol-tour" role="dialog" aria-modal="true" aria-label="Instrument briefing">
      {/* Dim everything but the spotlight */}
      <div
        className={`sol-tour-spot ${rect ? '' : 'none'}`}
        style={rect ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h } : undefined}
      >
        <i />
        <i />
        <i />
        <i />
      </div>
      {line && (
        <svg className="sol-tour-line" aria-hidden>
          <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          <circle cx={line.x2} cy={line.y2} r="3" />
        </svg>
      )}
      <div ref={cardRef} className="sol-tour-card hud-frame" style={{ left: card.x, top: card.y, width: cw }}>
        <div className="flex items-center justify-between">
          <span className="hud-label !text-[color:var(--sol-amber)]">
            Briefing · <span className="hud-num">{String(i + 1).padStart(2, '0')}/{String(STEPS.length).padStart(2, '0')}</span>
          </span>
          <button onClick={finish} className="hud-label hover:!text-white transition">Skip ✕</button>
        </div>
        <h3 key={step.title} className="text-[17px] font-extralight tracking-[0.28em] uppercase text-white mt-2">
          <DecodeText text={step.title.toUpperCase()} durationMs={650} />
        </h3>
        <div className="hud-rule w-14 my-2.5" key={`r${i}`} />
        <p key={`p${i}`} className="text-[11.5px] leading-relaxed text-white/75 hud-rise">{step.body}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((_, k) => (
              <span key={k} className={`sol-tour-dot ${k === i ? 'on' : k < i ? 'past' : ''}`} />
            ))}
          </div>
          <div className="flex gap-1.5">
            {i > 0 && (
              <button onClick={() => go(i - 1, -1)} className="hud-btn">
                Back
              </button>
            )}
            <button onClick={() => (last ? finish() : go(i + 1, 1))} className="hud-btn is-on">
              {last ? 'Begin' : 'Next'} <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tour;
