import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlightRoute } from '../../rendering/SolarSystemScene';
import { DecodeText, useViewFrame, ViewStateGetter } from './Instruments';

/* ==========================================================================
   VOYAGE — everything that makes a flight feel like a journey.
   Philosophy: distance is shown as time. Light-minutes, probe-years,
   orbits crossed. The interface steps back (letterbox) while you travel and
   steps forward (stamp, logbook) when you arrive.
   ========================================================================== */

export const AU_KM = 149597870.7;
const C_KMS = 299792.458;
const LY_KM = 9.4607e12;
const VOYAGER_KMS = 17.0;

export function fmtDuration(sec: number): string {
  if (!isFinite(sec)) return '—';
  if (sec < 60) return `${sec.toFixed(1)} s`;
  if (sec < 3600) return `${Math.floor(sec / 60)} m ${String(Math.round(sec % 60)).padStart(2, '0')} s`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} h ${String(Math.round((sec % 3600) / 60)).padStart(2, '0')} m`;
  const days = sec / 86400;
  if (days < 365.25) return `${days.toFixed(days < 10 ? 1 : 0)} days`;
  const yr = days / 365.25;
  return `${yr < 100 ? yr.toFixed(1) : Math.round(yr).toLocaleString('en-US')} yr`;
}

export function fmtSpan(km: number): string {
  if (km >= 0.05 * LY_KM) return `${Math.round(km / LY_KM).toLocaleString('en-US')} ly`;
  if (km >= 1e9) return `${(km / 1e9).toFixed(2)} B km`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)} M km`;
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

/** Where along a straight route (0..1) the heliocentric distance equals `rKm`. */
function crossings(from: number[], to: number[], rKm: number): number[] {
  const d = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
  const A = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
  if (A < 1) return [];
  const B = 2 * (from[0] * d[0] + from[1] * d[1] + from[2] * d[2]);
  const C = from[0] * from[0] + from[1] * from[1] + from[2] * from[2] - rKm * rKm;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return [];
  const q = Math.sqrt(disc);
  return [(-B - q) / (2 * A), (-B + q) / (2 * A)].filter((t) => t > 0.02 && t < 0.98);
}

const smoother = (p: number) => p * p * p * (p * (p * 6 - 15) + 10);

/* ==========================================================================
   TRANSIT STATE — React only hears about the start and the end of a flight
   ========================================================================== */
export function useTransitState(getView: ViewStateGetter | undefined, onArrive: (r: FlightRoute) => void) {
  const [route, setRoute] = useState<FlightRoute | null>(null);
  const live = useRef<FlightRoute | null>(null);
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;
  useViewFrame(getView, (v) => {
    const flying = v.transit !== null && v.route !== null;
    if (flying && live.current?.id !== v.route!.id) {
      live.current = v.route;
      setRoute(v.route);
    } else if (!flying && live.current) {
      const done = live.current;
      live.current = null;
      setRoute(null);
      arriveRef.current(done);
    }
  });
  return route;
}

/* ==========================================================================
   LOGBOOK — the worlds you have reached and the distance you have flown,
   kept in this browser
   ========================================================================== */
const LOG_KEY = 'solaris.logbook.v1';
export const LOG_WORLDS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Sagittarius A*'];

export function useLogbook() {
  const [log, setLog] = useState<{ visited: string[]; km: number }>(() => {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* private mode: start empty */
    }
    return { visited: [], km: 0 };
  });
  const logRef = useRef(log);
  const record = useCallback((r: FlightRoute): boolean => {
    const prev = logRef.current;
    const isNew = !prev.visited.includes(r.to) && r.to !== 'Sun';
    const next = {
      visited: isNew ? [...prev.visited, r.to] : prev.visited,
      km: prev.km + (r.distanceKm < 0.05 * LY_KM ? r.distanceKm : 0),
    };
    logRef.current = next;
    setLog(next);
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return isNew;
  }, []);
  const worlds = log.visited.filter((n) => LOG_WORLDS.includes(n)).length;
  const others = log.visited.length - worlds;
  return { log, record, worlds, others };
}

/* ==========================================================================
   LETTERBOX + TRANSIT CONSOLE
   ========================================================================== */
export const VoyageConsole: React.FC<{ getView?: ViewStateGetter; route: FlightRoute | null }> = ({ getView, route }) => {
  const ship = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const eta = useRef<HTMLSpanElement>(null);
  const warp = useRef<HTMLSpanElement>(null);
  const callout = useRef<HTMLDivElement>(null);
  const timing = useRef({ id: -1, start: 0, passed: new Set<string>() });

  // Orbits this route crosses, placed along the rail
  const ticks = useMemo(() => {
    if (!route || route.distanceKm > 0.05 * LY_KM) return [];
    const out: Array<{ name: string; t: number; aAU: number }> = [];
    const bodies = getView?.()?.bodies ?? [];
    for (const b of bodies) {
      // You leave one orbit and arrive on another: only the ones in between are crossings
      if (b.name === route.from || b.name === route.to) continue;
      for (const t of crossings(route.fromKm, route.toKm, b.aAU * AU_KM)) out.push({ name: b.name, t, aAU: b.aAU });
    }
    return out.sort((a, b) => a.t - b.t);
  }, [route, getView]);

  useViewFrame(getView, (v, now) => {
    if (!route || !v.transit) return;
    const tm = timing.current;
    if (tm.id !== route.id) {
      tm.id = route.id;
      tm.start = now;
      tm.passed = new Set();
    }
    const p = v.transit.progress;
    const e = smoother(p);
    if (ship.current) ship.current.style.left = `${e * 100}%`;
    if (fill.current) fill.current.style.transform = `scaleX(${e})`;
    const elapsed = (now - tm.start) / 1000;
    if (p > 0.03) {
      const total = elapsed / p;
      if (eta.current) eta.current.textContent = `T−${Math.max(0, total - elapsed).toFixed(1).padStart(4, '0')} s`;
      if (warp.current) warp.current.textContent = `×${Math.round(route.distanceKm / C_KMS / total).toLocaleString('en-US')}`;
    }
    for (const tk of ticks) {
      const key = `${tk.name}@${tk.t.toFixed(3)}`;
      if (e >= tk.t && !tm.passed.has(key)) {
        tm.passed.add(key);
        const el = callout.current;
        if (el) {
          el.textContent = `Crossing the orbit of ${tk.name} · ${tk.aAU.toFixed(2)} AU`;
          el.classList.remove('hud-callout');
          void el.offsetWidth;
          el.classList.add('hud-callout');
        }
      }
    }
  });

  const active = route !== null;
  const lightSec = route ? route.distanceKm / C_KMS : 0;

  return (
    <div className={`hud-letterbox ${active ? 'active' : ''}`} aria-hidden={!active}>
      <div className="bar top">
        {route && (
          <div className="flex items-end justify-between w-full px-6 md:px-10 pb-3">
            <div className="flex items-center gap-2 hud-label" style={{ color: 'var(--sol-mint)' }}>
              <span className="hud-led on pulse" /> En route
            </div>
            <div className="text-center">
              <div className="hud-label !text-[8px]">Destination</div>
              <DecodeText text={route.to.toUpperCase()} className="text-lg md:text-2xl font-extralight tracking-[0.5em] text-white" durationMs={1200} />
            </div>
            <span ref={eta} className="hud-num text-[11px] text-[color:var(--sol-amber)]">T−00.0 s</span>
          </div>
        )}
      </div>

      <div ref={callout} className="absolute left-1/2 top-[22%] -translate-x-1/2 text-[10px] uppercase tracking-[0.34em] text-[color:var(--sol-ice)] whitespace-nowrap opacity-0 [text-shadow:0_0_14px_rgba(171,207,255,0.6)]" />

      <div className="bar bottom">
        {route && (
          <div className="w-full max-w-[900px] mx-auto px-6 pt-3 flex flex-col gap-2.5">
            <div className="flex items-center gap-4">
              <div className="text-right min-w-[90px]">
                <div className="hud-label !text-[8px]">From</div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-white/80">{route.from}</div>
              </div>
              <div className="relative flex-1 h-5">
                <span className="absolute left-0 right-0 top-1/2 h-px bg-white/15" />
                <span ref={fill} className="absolute left-0 right-0 top-1/2 h-px origin-left bg-gradient-to-r from-[rgba(109,252,192,0.15)] to-[color:var(--sol-mint)] shadow-[0_0_8px_var(--sol-mint)]" style={{ transform: 'scaleX(0)' }} />
                {ticks.map((t) => (
                  <span key={`${t.name}${t.t}`} className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${t.t * 100}%` }}>
                    <span className="w-px h-2.5 bg-[color:var(--sol-ice)] opacity-70 mt-[5px]" />
                    <span className="text-[7.5px] tracking-[0.2em] uppercase text-[color:var(--sol-ice)] opacity-70 mt-0.5">{t.name}</span>
                  </span>
                ))}
                <span ref={ship} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border border-[color:var(--sol-mint)] bg-[#05040a] shadow-[0_0_10px_var(--sol-mint)]" style={{ left: '0%' }} />
              </div>
              <div className="min-w-[90px]">
                <div className="hud-label !text-[8px]">To</div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-white">{route.to}</div>
              </div>
            </div>
            <dl className="flex flex-wrap justify-center gap-x-8 gap-y-1">
              {[
                ['Distance', fmtSpan(route.distanceKm)],
                ['Light takes', fmtDuration(lightSec)],
                ['Voyager 1 takes', fmtDuration(route.distanceKm / VOYAGER_KMS)],
              ].map(([k, v]) => (
                <div key={k} className="hud-stat flex items-baseline gap-2">
                  <dt>{k}</dt>
                  <dd className="!mt-0 !text-[11px]">{v}</dd>
                </div>
              ))}
              <div className="hud-stat flex items-baseline gap-2" title="How much faster than light this flight is">
                <dt>Light-speed</dt>
                <dd className="!mt-0 !text-[11px] text-[color:var(--sol-mint)]">
                  <span ref={warp}>×—</span>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   ARRIVAL STAMP
   ========================================================================== */
export const ArrivalStamp: React.FC<{ name: string; isNew: boolean; worlds: number; nonce: number }> = ({ name, isNew, worlds, nonce }) => (
  <div key={nonce} className="hud-stamp absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
    <div className="relative px-6 py-3 border border-[color:var(--sol-amber)] text-center">
      <span className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[#05040a] border border-[color:var(--sol-amber)]" />
      <div className="hud-label !text-[8px] !text-[color:var(--sol-amber)]">{name === 'Sun' ? 'System overview' : 'Orbit achieved'}</div>
      <div className="text-xl font-extralight tracking-[0.5em] text-white mt-1 uppercase">{name}</div>
      {isNew && (
        <div className="mt-2 pt-2 border-t border-[color:var(--sol-line)] text-[9px] tracking-[0.3em] uppercase text-[color:var(--sol-mint)]">
          ✦ New world logged · <span className="hud-num">{String(worlds).padStart(2, '0')}/{LOG_WORLDS.length}</span>
        </div>
      )}
    </div>
  </div>
);

/* ==========================================================================
   GALACTIC PLOT — where you are in the Milky Way.
   The disk is the NASA/JPL-Caltech (R. Hurt) face-on Milky Way, from the north
   galactic pole: Sgr A* at the centre, the Sun R₀ = 8.277 kpc out (GRAVITY
   2022), moving at ~230 km/s on its 230-million-year orbit. No frames: the
   disk floats tilted in space and turns face-on when you hover it, naming its
   arms. The Solar System — far smaller than a pixel here — sits in a glass
   loupe tethered to the Sun, magnified ~10⁹×, with today's real positions.
   ========================================================================== */
const PW = 268;
const PH = 236;
const GC = { x: 168, y: 98 };       // galactic centre on the canvas
const G_R = 86;                      // px radius of the 16 kpc stellar disk
const KPC_PX = G_R / 16;
const R0_KPC = 8.277;
const LOUPE = { x: 56, y: 170, r: 50 };
const L_R = 42;                      // px radius for 50 AU inside the loupe
const SGR_KM = 2.553e17;
const mapR = (au: number) => (L_R * Math.log10(1 + au / 0.25)) / Math.log10(1 + 50 / 0.25);
const BELT = Array.from({ length: 90 }, (_, i) => [2.2 + (((i * 7919) % 1000) / 1000) * 1.1, (i * 2.399963) % (Math.PI * 2)]);
// Galactocentric kpc (x right, y towards the Sun = down in the artwork); approximate arm tracers
const ARMS: Array<{ name: string; x: number; y: number }> = [
  { name: 'Orion Spur', x: -2.2, y: 7.9 },
  { name: 'Perseus Arm', x: 3.4, y: 10.6 },
  { name: 'Sagittarius–Carina', x: -3.6, y: 5.4 },
  { name: 'Scutum–Centaurus', x: 4.6, y: 2.6 },
  { name: 'Galactic bar', x: -1.6, y: -2.6 },
  { name: 'Norma Arm', x: -4.8, y: -1.4 },
];

let galaxyDisk: HTMLCanvasElement | null = null;
function loadGalaxyDisk(onReady: () => void) {
  if (galaxyDisk) return;
  const img = new Image();
  img.onload = () => {
    const size = (21.33 / 16) * G_R * 2; // image half-width spans 21.3 kpc (see MilkyWayGalaxy.ts)
    const pad = G_R + 18;
    const c = document.createElement('canvas');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = pad * 2 * dpr;
    c.height = pad * 2 * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, pad - size / 2, pad - size / 2, size, size);
    // Feather into space: no rim, the outer disk simply thins out
    ctx.globalCompositeOperation = 'destination-in';
    const fade = ctx.createRadialGradient(pad, pad, G_R * 0.55, pad, pad, pad);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.7, 'rgba(0,0,0,0.55)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, pad * 2, pad * 2);
    galaxyDisk = c;
    onReady();
  };
  img.src = `${import.meta.env.BASE_URL || '/'}textures/milky_way_disk.webp`;
}

export const SystemPlot: React.FC<{ getView?: ViewStateGetter; target: string; onSelect: (name: string) => void }> = ({
  getView,
  target,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const hover = useRef<{ x: number; y: number } | null>(null);
  const hoverAmt = useRef(0);
  const hits = useRef<Array<{ name: string; x: number; y: number }>>([]);
  const [hoverName, setHoverName] = useState<string | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = PW * dpr;
    c.height = PH * dpr;
    c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
    loadGalaxyDisk(() => setReady(true));
  }, []);

  useViewFrame(getView, (v, t) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, PW, PH);
    const hitList: Array<{ name: string; x: number; y: number }> = [];

    // Hover eases the disk from a 58° tilt to face-on
    const hv = (hoverAmt.current += ((hover.current ? 1 : 0) - hoverAmt.current) * 0.08);
    const tilt = 0.53 + 0.47 * hv;
    const gal = (xKpc: number, yKpc: number) => ({ x: GC.x + xKpc * KPC_PX, y: GC.y + yKpc * KPC_PX * tilt });
    const SUN = gal(0, R0_KPC);

    /* ---------- the galaxy ---------- */
    // a soft core glow that reads as depth even before the artwork loads
    const core = ctx.createRadialGradient(GC.x, GC.y, 0, GC.x, GC.y, G_R * 0.5);
    core.addColorStop(0, 'rgba(255,214,150,0.22)');
    core.addColorStop(1, 'rgba(255,214,150,0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, PW, PH);
    if (galaxyDisk) {
      const pad = G_R + 18;
      ctx.save();
      ctx.translate(GC.x, GC.y);
      ctx.scale(1, tilt);
      ctx.globalAlpha = 0.92;
      ctx.drawImage(galaxyDisk, -pad, -pad, pad * 2, pad * 2);
      ctx.restore();
    }

    // The Sun's orbit and its motion: an arc trailing behind it (clockwise seen from the north pole)
    ctx.save();
    ctx.translate(GC.x, GC.y);
    ctx.scale(1, tilt);
    const r0 = R0_KPC * KPC_PX;
    ctx.setLineDash([1.2, 3.2]);
    ctx.strokeStyle = `rgba(244,205,114,${0.18 + 0.2 * hv})`;
    ctx.beginPath();
    ctx.arc(0, 0, r0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const sunAng = Math.PI / 2;
    const g = ctx.createLinearGradient(0, r0, -r0, 0);
    g.addColorStop(0, 'rgba(109,252,192,0.9)');
    g.addColorStop(1, 'rgba(109,252,192,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, r0, sunAng, sunAng + 0.55);
    ctx.stroke();
    ctx.restore();
    ctx.lineWidth = 1;

    // Arm names, on hover
    if (hv > 0.02) {
      ctx.font = '7px JetBrains Mono, monospace';
      for (const a of ARMS) {
        const p = gal(a.x, a.y);
        ctx.fillStyle = `rgba(171,207,255,${0.75 * hv})`;
        ctx.fillText(a.name.toUpperCase(), p.x - ctx.measureText(a.name.toUpperCase()).width / 2, p.y);
      }
    }

    // Sgr A*: a black pinprick in a warm glow
    const isBH = target === 'Sagittarius A*';
    const bh = ctx.createRadialGradient(GC.x, GC.y, 0, GC.x, GC.y, 10);
    bh.addColorStop(0, 'rgba(0,0,0,1)');
    bh.addColorStop(0.3, 'rgba(0,0,0,0.9)');
    bh.addColorStop(0.45, 'rgba(255,220,160,0.85)');
    bh.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = bh;
    ctx.beginPath();
    ctx.arc(GC.x, GC.y, 10, 0, Math.PI * 2);
    ctx.fill();
    if (isBH) {
      const pulse = ((t * 0.001) % 1.8) / 1.8;
      ctx.strokeStyle = `rgba(244,205,114,${0.8 * (1 - pulse)})`;
      ctx.beginPath();
      ctx.ellipse(GC.x, GC.y, 6 + pulse * 14, (6 + pulse * 14) * tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    hitList.push({ name: 'Sagittarius A*', x: GC.x, y: GC.y });
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255,224,170,0.9)';
    ctx.fillText('SGR A*', GC.x + 9, GC.y - 6);

    // Sun beacon
    const beat = ((t * 0.001) % 2.4) / 2.4;
    for (const k of [0, 0.5]) {
      const pp = (beat + k) % 1;
      ctx.strokeStyle = `rgba(109,252,192,${0.55 * (1 - pp)})`;
      ctx.beginPath();
      ctx.ellipse(SUN.x, SUN.y, 2 + pp * 11, (2 + pp * 11) * tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffe2a8';
    ctx.shadowColor = '#ffd27a';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(SUN.x, SUN.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(109,252,192,0.9)';
    ctx.fillText('YOU ARE HERE', SUN.x + 8, SUN.y + 3);
    if (hv > 0.02) {
      ctx.fillStyle = `rgba(255,255,255,${0.5 * hv})`;
      ctx.fillText('230 km/s ⟲', SUN.x + 8, SUN.y + 12);
    }

    // Route to the centre and the observer at galactic scale
    const shipKm = Math.hypot(v.shipKm[0], v.shipKm[1], v.shipKm[2]);
    const f = Math.min(1, shipKm / SGR_KM);
    const flyingToCore = !!(v.route && v.transit && v.route.to === 'Sagittarius A*');
    if (f > 0.002 || flyingToCore) {
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = 'rgba(244,205,114,0.7)';
      ctx.beginPath();
      ctx.moveTo(SUN.x, SUN.y);
      ctx.lineTo(GC.x, GC.y);
      ctx.stroke();
      ctx.setLineDash([]);
      drawShip(ctx, SUN.x + (GC.x - SUN.x) * f, SUN.y + (GC.y - SUN.y) * f, Math.atan2(GC.y - SUN.y, GC.x - SUN.x), t);
    }

    // Scale bar: 10 kpc ≈ 32,600 ly
    const sbY = PH - 8;
    const sbX = GC.x - 5 * KPC_PX;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(sbX, sbY - 3);
    ctx.lineTo(sbX, sbY);
    ctx.lineTo(sbX + 10 * KPC_PX, sbY);
    ctx.lineTo(sbX + 10 * KPC_PX, sbY - 3);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillText('10 kpc · 32,600 ly', sbX + 10 * KPC_PX + 5, sbY + 1);

    /* ---------- the loupe: a glass lens over the Solar System ---------- */
    // Curved tether from the Sun into the lens
    const ex = LOUPE.x + LOUPE.r * 0.72;
    const ey = LOUPE.y - LOUPE.r * 0.62;
    const tg = ctx.createLinearGradient(SUN.x, SUN.y, ex, ey);
    tg.addColorStop(0, 'rgba(109,252,192,0.8)');
    tg.addColorStop(1, 'rgba(244,205,114,0.15)');
    ctx.strokeStyle = tg;
    ctx.beginPath();
    ctx.moveTo(SUN.x, SUN.y);
    ctx.quadraticCurveTo((SUN.x + ex) / 2 - 6, Math.min(SUN.y, ey) - 18, ex, ey);
    ctx.stroke();

    ctx.save();
    const glass = ctx.createRadialGradient(LOUPE.x, LOUPE.y, LOUPE.r * 0.3, LOUPE.x, LOUPE.y, LOUPE.r);
    glass.addColorStop(0, 'rgba(5,4,10,0.92)');
    glass.addColorStop(0.82, 'rgba(5,4,10,0.75)');
    glass.addColorStop(1, 'rgba(5,4,10,0)');
    ctx.fillStyle = glass;
    ctx.beginPath();
    ctx.arc(LOUPE.x, LOUPE.y, LOUPE.r, 0, Math.PI * 2);
    ctx.fill();
    // a specular glint across the glass, slowly drifting
    const gl = ctx.createLinearGradient(LOUPE.x - LOUPE.r, LOUPE.y - LOUPE.r, LOUPE.x + LOUPE.r, LOUPE.y + LOUPE.r);
    const gp = 0.25 + 0.1 * Math.sin(t * 0.0006);
    gl.addColorStop(Math.max(0, gp - 0.06), 'rgba(255,255,255,0)');
    gl.addColorStop(gp, 'rgba(255,255,255,0.05)');
    gl.addColorStop(Math.min(1, gp + 0.06), 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.arc(LOUPE.x, LOUPE.y, LOUPE.r * 0.92, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(LOUPE.x, LOUPE.y, LOUPE.r * 0.97, 0, Math.PI * 2);
    ctx.clip();
    const cx = LOUPE.x;
    const cy = LOUPE.y;
    const toXY = (xKm: number, yKm: number): [number, number] => {
      const au = Math.hypot(xKm, yKm) / AU_KM;
      const r = Math.min(LOUPE.r - 3, mapR(au));
      const th = Math.atan2(yKm, xKm);
      return [cx + Math.cos(th) * r, cy - Math.sin(th) * r];
    };
    ctx.fillStyle = 'rgba(200,190,170,0.3)';
    for (const [a, th] of BELT) {
      const r = mapR(a);
      ctx.fillRect(cx + Math.cos(th) * r, cy - Math.sin(th) * r, 1, 1);
    }
    for (const b of v.bodies) {
      const isT = b.name === target;
      const orbitR = mapR(b.aAU);
      ctx.strokeStyle = isT ? 'rgba(244,205,114,0.6)' : `rgba(255,255,255,${0.05 + 0.06 * (1 - orbitR / L_R)})`;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.stroke();
      const [x, y] = toXY(b.x, b.y);
      hitList.push({ name: b.name, x, y });
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(x, y, isT ? 2.4 : 1.6, 0, Math.PI * 2);
      ctx.fill();
      if (isT) {
        const pulse = ((t * 0.001) % 1.6) / 1.6;
        ctx.strokeStyle = `rgba(244,205,114,${0.8 * (1 - pulse)})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + pulse * 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    const sunG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
    sunG.addColorStop(0, 'rgba(255,240,200,1)');
    sunG.addColorStop(1, 'rgba(255,160,50,0)');
    ctx.fillStyle = sunG;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    if (v.route && v.transit && v.route.distanceKm < 1e13) {
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = 'rgba(244,205,114,0.65)';
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const e = i / 30;
        const [x, y] = toXY(v.route.fromKm[0] + (v.route.toKm[0] - v.route.fromKm[0]) * e, v.route.fromKm[1] + (v.route.toKm[1] - v.route.fromKm[1]) * e);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (f <= 0.002) {
      const [sx, sy] = toXY(v.shipKm[0], v.shipKm[1]);
      drawShip(ctx, sx, sy, Math.atan2(-v.heading[1], v.heading[0]), t);
    }
    ctx.restore();
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(244,205,114,0.7)';
    ctx.fillText('SOLAR SYSTEM ×10⁹', LOUPE.x - 34, LOUPE.y + LOUPE.r + 7);
    hits.current = hitList;

    if (readout.current) {
      readout.current.textContent =
        f > 0.002 ? `SGR A* ⟷ YOU ${fmtSpan(Math.max(0, SGR_KM - shipKm))}` : `SUN ⟷ YOU ${(shipKm / AU_KM).toFixed(shipKm / AU_KM < 10 ? 3 : 2)} AU`;
    }

    const h = hover.current;
    if (h) {
      let best: string | null = null;
      let bd = 10;
      for (const p of hitList) {
        const d = Math.hypot(p.x - h.x, p.y - h.y);
        if (d < bd) {
          bd = d;
          best = p.name;
        }
      }
      if (best !== hoverName) setHoverName(best);
    }
  });

  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: PW, height: PH, cursor: hoverName ? 'pointer' : 'default' }}
          onMouseMove={(e) => (hover.current = pick(e))}
          onMouseLeave={() => {
            hover.current = null;
            setHoverName(null);
          }}
          onClick={(e) => {
            const p = pick(e);
            let best: string | null = null;
            let bd = 10;
            for (const h of hits.current) {
              const d = Math.hypot(h.x - p.x, h.y - p.y);
              if (d < bd) {
                bd = d;
                best = h.name;
              }
            }
            if (best) onSelect(best);
          }}
          aria-label="Galactic plot: the Milky Way with the Solar System magnified; click a world or Sgr A* to fly there"
          role="img"
        />
        {hoverName && (
          <span className="absolute right-1 top-0 text-[9px] tracking-[0.3em] uppercase text-white hud-fade-in">⟶ {hoverName}</span>
        )}
      </div>
      <div className="flex items-baseline gap-3 pr-1">
        <span className="hud-label" style={{ color: 'rgba(244,205,114,0.75)' }}>Milky Way</span>
        <span ref={readout} className="hud-num text-[9px] text-[color:var(--sol-mint)] tracking-[0.12em]">—</span>
      </div>
    </div>
  );
};

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, head: number, t: number) {
  const cone = ctx.createRadialGradient(x, y, 0, x, y, 26);
  cone.addColorStop(0, 'rgba(109,252,192,0.32)');
  cone.addColorStop(1, 'rgba(109,252,192,0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, 26, head - 0.42, head + 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(head);
  ctx.fillStyle = '#6dfcc0';
  ctx.shadowColor = '#6dfcc0';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(5.5, 0);
  ctx.lineTo(-3.6, 3.3);
  ctx.lineTo(-1.8, 0);
  ctx.lineTo(-3.6, -3.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  const ping = (t % 2600) / 2600;
  ctx.strokeStyle = `rgba(109,252,192,${0.5 * (1 - ping)})`;
  ctx.beginPath();
  ctx.arc(x, y, 2 + ping * 14, 0, Math.PI * 2);
  ctx.stroke();
}
