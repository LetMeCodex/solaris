import React, { useState } from 'react';
import { SurfaceStatus } from '../../explorer/SurfaceObserver';
import { TimeOfDay } from '../../explorer/SkyAstronomy';
import { SkyDestinations } from './SkyDestinations';

export type SurfaceAction =
  | { type: 'enter' }
  | { type: 'exit' }
  | { type: 'magnification'; value: number }
  | { type: 'atmosphere'; on: boolean }
  | { type: 'time'; what: TimeOfDay }
  | { type: 'lookAt'; name: string }
  | { type: 'resetZoom' }
  | { type: 'skyFrom'; body: string; facing?: string };

interface SurfacePanelProps {
  status: SurfaceStatus;
  onAction: (a: SurfaceAction) => void;
}

const MAGNIFICATIONS: Array<{ value: number; label: string }> = [
  { value: 1, label: 'Real' },
  { value: 10, label: '×10' },
  { value: 100, label: '×100' },
  { value: 1000, label: 'Poster' },
];

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const compass = (az: number) => COMPASS[Math.round(az / 45) % 8];

function fmtLatLon(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
}

function fmtSize(arcsec: number): string {
  if (arcsec >= 3600) return `${(arcsec / 3600).toFixed(1)}°`;
  if (arcsec >= 60) return `${(arcsec / 60).toFixed(1)}′`;
  return `${arcsec.toFixed(arcsec < 10 ? 1 : 0)}″`;
}

/**
 * Surface view controls: where you stand, the Sun, time-of-day jumps, real vs magnified sky,
 * the atmosphere switch, and what is up there right now.
 */
export const SurfacePanel: React.FC<SurfacePanelProps> = ({ status, onAction }) => {
  const [open, setOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 640);
  const s = status;
  const sunUp = s.sunAltDeg > -0.833;
  const btn = 'px-2 py-0.5 rounded-full border text-[10px] transition focus-visible:ring-1 focus-visible:ring-white/60';
  const btnOff = 'border-white/15 text-white/65 hover:text-white hover:border-white/35';
  const btnOn = 'border-amber-300/50 text-amber-100 bg-amber-300/10';

  return (
    <section
      aria-label="Surface view"
      className="absolute right-3 md:right-6 bottom-20 md:bottom-24 w-[310px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-180px)] overflow-y-auto pointer-events-auto z-30 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white/80 font-light"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em]">
        <div className="min-w-0 truncate">
          <span className="text-white/45">On </span>
          <span className="text-white/90">{s.body}</span>
          {s.place && <span className="text-amber-200/90"> · {s.place}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAction({ type: 'exit' })}
            className="normal-case tracking-normal text-[10px] px-2 py-0.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50"
          >
            Back to orbit
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Collapse surface panel' : 'Expand surface panel'}
            className="text-white/40 hover:text-white px-1 rounded focus-visible:ring-1 focus-visible:ring-white/60"
          >
            {open ? '–' : '+'}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-3 flex flex-col gap-2.5 text-[11px]">
          <div className="flex justify-between font-mono text-[10px] text-amber-200/90" aria-live="polite">
            <span>{fmtLatLon(s.lat, s.lon)}</span>
            <span>
              Facing {compass(s.headingDeg)} · {s.pitchDeg.toFixed(0)}° up
            </span>
          </div>
          <div className="text-[10px] text-white/55">
            {sunUp
              ? `Sun ${s.sunAltDeg.toFixed(0)}° above the horizon (${compass(s.sunAzDeg)})`
              : `Night · Sun ${Math.abs(s.sunAltDeg).toFixed(0)}° below the horizon`}
          </div>

          {/* Time of day */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Jump to local</div>
            <div className="flex flex-wrap gap-1.5">
              {(['sunrise', 'noon', 'sunset', 'night'] as TimeOfDay[]).map((w) => (
                <button key={w} onClick={() => onAction({ type: 'time', what: w })} className={`${btn} ${btnOff} capitalize`}>
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Sky scale */}
          <div className="border-t border-white/10 pt-2">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Planet sizes in the sky</div>
            <div className="flex flex-wrap gap-1.5">
              {MAGNIFICATIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => onAction({ type: 'magnification', value: m.value })}
                  aria-pressed={s.magnification === m.value}
                  className={`${btn} ${s.magnification === m.value ? btnOn : btnOff}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {s.magnification > 1 && (
              <div className="text-[10px] text-amber-200/70 mt-1 leading-snug">
                Artistic view: planets and moons drawn {s.magnification}× larger than they really look (the Sun is not
                enlarged).
              </div>
            )}
          </div>

          {/* Lens + atmosphere */}
          <div className="flex items-center justify-between text-[10px] text-white/55">
            <span>
              Lens {s.fovDeg < 10 ? s.fovDeg.toFixed(1) : s.fovDeg.toFixed(0)}° · scroll to zoom
            </span>
            {s.fovDeg < 69 && (
              <button onClick={() => onAction({ type: 'resetZoom' })} className={`${btn} ${btnOff}`}>
                Reset zoom
              </button>
            )}
          </div>
          {s.atmosphereKind !== 'none' && (
            <div className="flex items-start justify-between gap-2 text-[10px] text-white/45">
              <span className="leading-snug">{s.atmosphereLabel}</span>
              <button
                onClick={() => onAction({ type: 'atmosphere', on: !s.atmosphereOn })}
                aria-pressed={!s.atmosphereOn}
                className={`${btn} ${s.atmosphereOn ? btnOff : btnOn} shrink-0`}
              >
                {s.atmosphereOn ? 'Hide air' : 'Show air'}
              </button>
            </div>
          )}
          {s.atmosphereKind === 'none' && <div className="text-[10px] text-white/45">No atmosphere: the sky is black even by day.</div>}

          {/* What's up */}
          <div className="border-t border-white/10 pt-2">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Above the horizon now</div>
            {s.objects.length === 0 && (
              <div className="text-[10px] text-white/45">
                {s.atmosphereKind === 'overcast' && s.atmosphereOn ? 'The clouds hide the sky — try "Hide air".' : 'Nothing bright enough right now.'}
              </div>
            )}
            <ul className="flex flex-col gap-0.5" role="list">
              {s.objects.map((o) => (
                <li key={o.name}>
                  <button
                    onClick={() => onAction({ type: 'lookAt', name: o.name })}
                    className="w-full text-left grid grid-cols-[1fr_auto_auto] gap-2 px-2 py-1 rounded-md hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/60"
                  >
                    <span className="text-white/85 truncate">{o.name}</span>
                    <span className="text-white/45 font-mono text-[10px]">
                      {o.altDeg.toFixed(0)}° {compass(o.azDeg)}
                    </span>
                    <span className="text-white/35 font-mono text-[10px] w-[64px] text-right">
                      {o.diameterArcsec >= 60 ? fmtSize(o.diameterArcsec) : `${o.magnitude.toFixed(1)}m`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <SkyDestinations current={s.body} onGo={(body, facing) => onAction({ type: 'skyFrom', body, facing })} />
          <div className="text-[9px] text-white/35 leading-snug">
            Drag to look around · scroll to zoom like a telescope · double-click to reset · Esc to leave
          </div>
        </div>
      )}
    </section>
  );
};

export default SurfacePanel;
