import React, { useEffect, useRef, useState } from 'react';
import {
  TIMES_SQUARE_VIEWPOINTS,
  TimesSquareScene,
  type WalkTelemetry,
  type WalkTimePreset,
  type WalkWeatherPreset,
} from './TimesSquareScene';

const TIME_LABELS: Record<WalkTimePreset, string> = {
  midnight: 'MIDNIGHT NEON',
  bluehour: 'BLUE HOUR DUSK',
  golden: 'GOLDEN HOUR',
  daylight: 'MIDTOWN DAY',
};

const WEATHER_LABELS: Record<WalkWeatherPreset, string> = {
  wet: 'POST-RAIN WET',
  rain: 'RAINSTORM',
  clear: 'CLEAR DRY',
  snow: 'WINTER SNOW',
};

export const WalkApp: React.FC = () => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<TimesSquareScene | null>(null);
  const [started, setStarted] = useState(false);
  const [activeVp, setActiveVp] = useState(1);
  const [hud, setHud] = useState<WalkTelemetry>({
    fps: 60,
    x: -15.5,
    y: 1.72,
    z: -148,
    lat: 40.75888,
    lon: -73.98495,
    timePreset: 'midnight',
    weatherPreset: 'wet',
    locked: false,
    muted: false,
    streetLabel: 'Duffy Square · Broadway & 46th–47th St',
    drawCalls: 0,
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const sc = new TimesSquareScene(el, (t) => setHud(t));
    sceneRef.current = sc;
    return () => {
      sc.dispose();
      sceneRef.current = null;
    };
  }, []);

  const handleStart = () => {
    setStarted(true);
    sceneRef.current?.startWalking(true);
  };

  const handleVp = (id: number) => {
    setActiveVp(id);
    sceneRef.current?.jumpToViewpoint(id);
  };

  const flyUrl = `${import.meta.env.BASE_URL}fly/`;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050712] font-sans">
      {/* Full-screen 1:1 Times Square WebGL Canvas */}
      <div ref={hostRef} className="absolute inset-0 w-full h-full" />

      {/* Top-Right Compact Cinematic Controls Bar (never collides with top-left GPS telemetry!) */}
      <div className="fixed top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => sceneRef.current?.cycleTimePreset()}
          className="px-2.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.14em] font-mono text-white/90 hover:bg-black/75 hover:border-white/30 transition"
          title="Cycle Time of Day (T)"
        >
          {TIME_LABELS[hud.timePreset]}
        </button>
        <button
          type="button"
          onClick={() => sceneRef.current?.cycleWeatherPreset()}
          className="px-2.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.14em] font-mono text-cyan-200/95 hover:bg-black/75 hover:border-cyan-300/40 transition"
          title="Cycle Weather (R)"
        >
          {WEATHER_LABELS[hud.weatherPreset]}
        </button>
        <div className="px-2 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[10px] tracking-[0.12em] font-mono text-white/65">
          {hud.fps} FPS
        </div>
        <button
          type="button"
          onClick={() => sceneRef.current?.toggleMute()}
          className="px-2.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.12em] font-mono text-white/80 hover:text-white hover:border-white/35 transition"
          title="Mute / Unmute NYC Ambience (M)"
        >
          {hud.muted ? 'MUTE' : 'SFX'}
        </button>
        <a
          href={flyUrl}
          className="px-2.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/25 text-[10px] tracking-[0.14em] font-mono text-white hover:bg-white/25 transition"
        >
          FLY ↗
        </a>
      </div>

      {/* Top-Left Clean Non-Overlapping Street & Live GPS Telemetry */}
      <div className="pointer-events-none fixed top-4 left-4 z-20 flex flex-col gap-0.5 px-3 py-1.5 rounded-xl bg-black/48 backdrop-blur-md border border-white/12">
        <div className="text-[10px] tracking-[0.18em] font-mono text-white/90">
          {hud.streetLabel.toUpperCase()}
        </div>
        <div className="text-[9.5px] tracking-[0.12em] font-mono text-white/55">
          {hud.lat.toFixed(5)}°N {Math.abs(hud.lon).toFixed(5)}°W · ELEV {Math.max(0, hud.y - 1.72).toFixed(1)}M
        </div>
      </div>

      {/* Bottom-Center Clean Viewpoint Bar (1–5) — Zero Overlap with Telemetry! */}
      {started && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/55 backdrop-blur-md border border-white/15 rounded-full p-1">
          {TIMES_SQUARE_VIEWPOINTS.map((vp) => (
            <button
              key={vp.id}
              type="button"
              onClick={() => handleVp(vp.id)}
              title={`${vp.label} — ${vp.subtitle} (${vp.id})`}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.12em] transition whitespace-nowrap ${
                activeVp === vp.id
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              {vp.id} · {vp.label.split(' ')[0].toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Subtle center crosshair dot when pointer-locked */}
      {started && hud.locked && (
        <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_6px_rgba(0,0,0,0.9)] z-10" />
      )}

      {/* Opening Cinematic Title Overlay (before START WALKING) */}
      {!started && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-t from-black/75 via-black/30 to-black/45 backdrop-blur-[2px]">
          <div className="text-[11px] tracking-[0.38em] font-mono text-cyan-200/85 uppercase mb-3">
            New York · Midtown Manhattan
          </div>
          <h1
            className="text-6xl md:text-8xl text-white tracking-tight mb-3 drop-shadow-[0_6px_28px_rgba(0,0,0,0.85)]"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            Times Square
          </h1>
          <p className="text-xs md:text-sm tracking-[0.22em] font-mono text-white/75 uppercase mb-8 text-center px-6">
            Broadway &amp; 7th Avenue · 42nd–47th Street · Real-Scale 3D Walkthrough
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-[0.26em] uppercase shadow-[0_0_32px_rgba(255,255,255,0.35)] hover:bg-cyan-100 hover:scale-[1.03] active:scale-[0.98] transition"
          >
            Start Walking
          </button>
          <div className="mt-7 text-[11px] font-mono tracking-[0.14em] text-white/60 text-center px-6">
            [W][A][S][D] Walk · [Shift] Run · [Mouse] Look · [1–5] Landmarks · [T] Time · [R] Weather · [Esc] Cursor
          </div>
        </div>
      )}
    </div>
  );
};
