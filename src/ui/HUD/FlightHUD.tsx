import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { TelemetryData } from '../../rendering/SolarSystemScene';
import { CatalogueManager } from '../../data/CatalogueManager';
import { getPlanetNarrative, PLANET_NARRATIVES } from '../../data/PlanetNarratives';
import { LENS_ORDER, LENS_PROFILES, LensProfileName } from '../../rendering/LensPipeline';
import { ExplorerPanel } from './ExplorerPanel';
import { SurfacePanel, SurfaceAction } from './SurfacePanel';
import { AttitudeScope, DecodeText, TargetLock, ViewStateGetter } from './Instruments';
import { ArrivalStamp, fmtDuration, LOG_WORLDS, SystemPlot, useLogbook, useTransitState, VoyageConsole } from './Voyage';
import type { FlightRoute } from '../../rendering/SolarSystemScene';
import { Popover, ScaleDomain, ScaleLadder, Segmented, TimeDeck } from './Controls';
import { CatalogueScreen, ShowcaseControls } from './CatalogueScreen';
import { AtlasLauncher } from './Atlas';
import { VinylDeck } from './VinylDeck';
import { exploredStats } from './explored';
import { UNITS_PER_KM } from '../../rendering/Scale';

/** Closer than this to the Sun's centre and Vela gets nervous (about 2.2 solar radii). */
const SUN_CLOSE_UNITS = 695700 * UNITS_PER_KM * 2.2;
import { Eye, EyeOff, X, RotateCcw, SlidersHorizontal, HelpCircle, Camera } from 'lucide-react';
import type { Postcard } from '../../data/Postcards';
import type { Tab as AtlasTab } from './CatalogueScreen';
import { Tour } from './Tour';
import { Companion } from './Companion';
import { voice } from '../../companion/voice';
import { horizonFacts } from '../../rendering/HorizonView';
import './hud.css';

interface FlightHUDProps {
  telemetry: TelemetryData | null;
  getView?: ViewStateGetter;
  onSelectPlanet: (name: string) => void;
  onResetView: () => void;
  onTogglePlay: () => void;
  onSetTimeMultiplier: (multiplier: number) => void;
  onSeekDate: (utcMs: number) => void;
  onResetToJ2000: () => void;
  onResetToNow: () => void;
  onToggleConstellations?: () => void;
  onToggleAsteroidBelt?: () => void;
  onToggleOrbits?: () => void;
  onJumpToScale?: (domain: ScaleDomain) => void;
  onSetLens?: (name: LensProfileName) => void;
  onSetBloom?: (gain: number) => void;
  onCycleLens?: () => void;
  onFlyToLandmark?: (id: string) => void;
  onExplorerDaylight?: (on: boolean) => void;
  onSurface?: (a: SurfaceAction) => void;
  onHorizon?: (on: boolean) => void;
  /** True once the opening sequence has finished: starts the first-visit briefing. */
  introDone?: boolean;
  /** The scene's cinematic reel, filmed behind the catalogue. */
  showcase?: ShowcaseControls;
  /** Step into a postcard from the Gallery. */
  onPostcard?: (p: Postcard) => void;
  /** Take a picture of the view (no interface); resolves true when it was saved. */
  onCapture?: () => Promise<boolean>;
}

// Reference navigation order: Sagittarius A* at top, then Pluto down to Mercury, plus Sun
const REFERENCE_NAV_ORDER = [
  'Sagittarius A*',
  'Pluto',
  'Neptune',
  'Uranus',
  'Saturn',
  'Jupiter',
  'Mars',
  'Earth',
  'Venus',
  'Mercury'
];

// Order from the Sun, for the monograph index ("03 / PLANET")
const SUNWARD_ORDER = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const AU_KM = 149597870.7;

function fmtKm(km: number): string {
  if (km >= 1e9) return `${(km / AU_KM).toFixed(2)} AU`;
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)}M km`;
  return `${Math.round(km).toLocaleString('en-US')} km`;
}

export const FlightHUD: React.FC<FlightHUDProps> = ({
  telemetry,
  getView,
  onSelectPlanet,
  onResetView,
  onTogglePlay,
  onSetTimeMultiplier,
  onSeekDate,
  onResetToJ2000,
  onResetToNow,
  onToggleConstellations,
  onToggleAsteroidBelt,
  onToggleOrbits,
  onJumpToScale,
  onSetLens,
  onSetBloom,
  onCycleLens,
  onFlyToLandmark,
  onExplorerDaylight,
  onSurface,
  onHorizon,
  introDone = true,
  showcase,
  onPostcard,
  onCapture,
}) => {
  const target = telemetry?.activeTarget;
  const isPaused = telemetry?.isPaused ?? false;
  const multiplier = telemetry?.timeScale ?? 1.0;
  const julianDate = telemetry?.julianDate ?? 2451545.0;
  const utcIso = telemetry?.utcIso ?? new Date().toISOString();

  const constellationsOn = telemetry?.constellationsVisible ?? true;
  const asteroidBeltOn = telemetry?.asteroidBeltVisible ?? true;
  const orbitsOn = telemetry?.orbitsVisible ?? true;

  const observerScale = telemetry?.observerScaleMetric ?? '1.00 AU';
  const lensProfile = telemetry?.lensProfile ?? 'clean';
  const bloomGain = telemetry?.bloomGain ?? 1;
  const bloomAvailable = LENS_PROFILES[lensProfile].bloomStrength > 0;
  const observerDomain = telemetry?.observerDomain ?? 'inner_system';
  // Close to a globe the view becomes a map: editorial overlays step aside
  const onSurfaceView = !!telemetry?.surface?.active;
  const inHorizon = !!telemetry?.horizonView;
  const exploring = onSurfaceView || inHorizon || (telemetry?.explorer?.altitudeRadii ?? Infinity) < 0.3;

  // Interface state
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState<boolean>(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState<boolean>(false);
  const [isOpticsOpen, setIsOpticsOpen] = useState<boolean>(false);

  // Staged cinematic intro choreography (0 -> 1 -> 2)
  const [introPhase, setIntroPhase] = useState<number>(0);

  // Monograph auto-vanish state (shows on target selection, vanishes after 5.5s)
  const [monographVisible, setMonographVisible] = useState<boolean>(true);
  const [isVanishing, setIsVanishing] = useState<boolean>(false);
  const [isHoveredMonograph, setIsHoveredMonograph] = useState<boolean>(false);

  // First-visit briefing
  const [tourOpen, setTourOpen] = useState(false);
  // (Vela greets the user first and starts the briefing when she has finished speaking)

  // Status toasts ("ORBITS · OFFLINE")
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const showToast = useCallback((text: string) => setToast({ id: performance.now(), text }), []);
  const [atlasTab, setAtlasTab] = useState<AtlasTab>('worlds');
  // A picture: the shutter flashes, the frame goes to your Gallery
  const [flash, setFlash] = useState(0);
  const takeShot = useCallback(async () => {
    if (!onCapture) return;
    setFlash(performance.now());
    const ok = await onCapture();
    showToast(ok ? 'Saved to your Gallery · open it from the Atlas' : 'Could not save the picture in this browser');
  }, [onCapture, showToast]);
  const takeShotRef = useRef(takeShot);
  takeShotRef.current = takeShot;

  // Vela: arrivals, tour steps, and whether she is talking (the dossier steps aside)
  const [arrival, setArrival] = useState<{ name: string; nonce: number } | null>(null);
  const [tourStep, setTourStep] = useState<{ index: number; nonce: number } | null>(null);
  const [velaTalking, setVelaTalking] = useState(false);

  // Voyages: logbook, flight state and the arrival stamp
  const logbook = useLogbook();
  const explored = useMemo(() => exploredStats(logbook.log.visited), [logbook.log.visited]);
  const [stamp, setStamp] = useState<{ name: string; isNew: boolean; nonce: number } | null>(null);
  const handleArrive = useCallback(
    (r: FlightRoute) => {
      const isNew = logbook.record(r);
      setStamp({ name: r.to, isNew, nonce: performance.now() });
      setArrival({ name: r.to, nonce: performance.now() });
      // The dossier opens on arrival, not when the flight was ordered
      setMonographVisible(true);
      setIsVanishing(false);
      setSelectionNonce((n) => n + 1);
    },
    [logbook]
  );
  const route = useTransitState(getView, handleArrive);
  useEffect(() => {
    if (!stamp) return;
    const t = setTimeout(() => setStamp(null), 3700);
    return () => clearTimeout(t);
  }, [stamp]);

  // Helmet parallax: the HUD floats a few pixels against the pointer
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = rootRef.current;
        if (!el) return;
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroPhase(2);
      return;
    }

    const t1 = setTimeout(() => setIntroPhase(1), 120); // during the iris, not after it
    const t2 = setTimeout(() => setIntroPhase(2), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsHudVisible((v) => !v);
      } else if (e.key === '/') {
        e.preventDefault();
        setAtlasTab('worlds');
        setIsCatalogueOpen(true);
      } else if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        void takeShotRef.current();
      } else if (e.key === 'Escape') {
        if (tourOpen) return;
        if (isReadMoreOpen) {
          setIsReadMoreOpen(false);
        } else if (isCatalogueOpen || isOpticsOpen) {
          setIsCatalogueOpen(false);
          setIsOpticsOpen(false);
        } else if (inHorizon) {
          onHorizon?.(false);
        } else if (onSurfaceView) {
          onSurface?.({ type: 'exit' });
        } else {
          onResetView();
        }
      } else if (e.key === 'o' || e.key === 'O') {
        onToggleOrbits?.();
      } else if (e.key === 'c' || e.key === 'C') {
        onToggleConstellations?.();
      } else if (e.key === 'b' || e.key === 'B') {
        onToggleAsteroidBelt?.();
      } else if (e.key === 'l' || e.key === 'L') {
        onCycleLens?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onTogglePlay,
    onToggleOrbits,
    onToggleConstellations,
    onToggleAsteroidBelt,
    onCycleLens,
    onResetView,
    onSurface,
    onSurfaceView,
    inHorizon,
    onHorizon,
    isReadMoreOpen,
    isCatalogueOpen,
    isOpticsOpen,
    tourOpen
  ]);

  // Announce state changes, whichever control (key, button, menu) made them
  const prevFlags = useRef<string | null>(null);
  useEffect(() => {
    if (!telemetry) return;
    const flags = { orbitsOn, constellationsOn, asteroidBeltOn, lensProfile, isPaused };
    const key = JSON.stringify(flags);
    if (prevFlags.current !== null && prevFlags.current !== key) {
      const prev = JSON.parse(prevFlags.current) as typeof flags;
      if (prev.orbitsOn !== orbitsOn) showToast(`Orbits · ${orbitsOn ? 'online' : 'offline'}`);
      else if (prev.constellationsOn !== constellationsOn) showToast(`Constellations · ${constellationsOn ? 'online' : 'offline'}`);
      else if (prev.asteroidBeltOn !== asteroidBeltOn) showToast(`Asteroid belt · ${asteroidBeltOn ? 'online' : 'offline'}`);
      else if (prev.lensProfile !== lensProfile) showToast(`Lens · ${LENS_PROFILES[lensProfile].label}`);
      else if (prev.isPaused !== isPaused) showToast(isPaused ? 'Time held' : 'Time flowing');
    }
    prevFlags.current = key;
  }, [telemetry, orbitsOn, constellationsOn, asteroidBeltOn, lensProfile, isPaused, showToast]);

  const activeTargetName = target?.name || 'Mercury';
  const narrative = useMemo(() => getPlanetNarrative(activeTargetName), [activeTargetName]);
  const fullTargetDef = useMemo(() => {
    if (activeTargetName === 'Sagittarius A*' || activeTargetName === 'Sgr A*' || activeTargetName === 'sagittarius_a_star') {
      return CatalogueManager.getSagittariusAStar();
    }
    return CatalogueManager.getBody(activeTargetName);
  }, [activeTargetName]);
  const isBlackHole = activeTargetName === 'Sagittarius A*' || target?.category === 'black_hole';

  // Monograph auto-vanish cycle state & selection tracking
  const [selectionNonce, setSelectionNonce] = useState<number>(1);
  const prevTargetNameRef = useRef<string | null>(null);

  // Trigger reveal when target changes from external interactions (3D raycasting, etc.)
  useEffect(() => {
    if (activeTargetName !== prevTargetNameRef.current) {
      prevTargetNameRef.current = activeTargetName;
      setSelectionNonce((n) => n + 1);
    }
  }, [activeTargetName]);

  // Trigger monograph reveal and auto-vanish countdown on selection or hover change
  useEffect(() => {
    setMonographVisible(true);
    setIsVanishing(false);

    if (isHoveredMonograph) return;

    const vanishTimer = setTimeout(() => {
      setIsVanishing(true);
    }, 6500);

    const hideTimer = setTimeout(() => {
      setMonographVisible(false);
      setIsVanishing(false);
    }, 8100);

    return () => {
      clearTimeout(vanishTimer);
      clearTimeout(hideTimer);
    };
  }, [selectionNonce, isHoveredMonograph]);

  const handleRevealMonograph = useCallback(() => {
    setMonographVisible(true);
    setIsVanishing(false);
    setSelectionNonce((n) => n + 1);
  }, []);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const closeOptics = useCallback(() => setIsOpticsOpen(false), []);

  // Monograph data strip
  const monoIndex = SUNWARD_ORDER.indexOf(activeTargetName);
  const monoEyebrow = monoIndex >= 0 ? `${String(monoIndex + 1).padStart(2, '0')} / ${narrative.eyebrow}` : narrative.eyebrow;
  const monoStats: Array<{ k: string; v: React.ReactNode }> = [];
  if (isBlackHole) {
    monoStats.push({ k: 'Distance', v: '26,990 ly' }, { k: 'Mass', v: '4.30 × 10⁶ M☉' }, { k: 'Shadow', v: '51.8 µas' });
  } else if (fullTargetDef) {
    if (target) monoStats.push({ k: 'From Sun', v: fmtKm(target.distanceKm) });
    monoStats.push({ k: 'Radius', v: `${Math.round(fullTargetDef.physical.meanRadiusKm).toLocaleString('en-US')} km` });
    const rot = fullTargetDef.physical.rotationPeriodHours;
    monoStats.push({
      k: 'Day',
      v: rot === undefined ? 'Locked' : Math.abs(rot) >= 48 ? `${(Math.abs(rot) / 24).toFixed(1)} d` : `${Math.abs(rot).toFixed(1)} h`,
    });
    if (telemetry?.lightFromEarthSec != null) monoStats.push({ k: 'Signal from Earth', v: fmtDuration(telemetry.lightFromEarthSec) });
  }

  if (!isHudVisible) {
    return (
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto hud-fade-in">
        <button onClick={() => setIsHudVisible(true)} className="hud-btn hud-frame !text-white/60">
          <Eye size={12} />
          <span>Show interface · H</span>
        </button>
      </div>
    );
  }

  const layerSwitches = (
    <>
      {[
        { label: 'Orbits', on: orbitsOn, fn: onToggleOrbits, key: 'O' },
        { label: 'Stars', on: constellationsOn, fn: onToggleConstellations, key: 'C', title: 'Constellation figures' },
        { label: 'Belt', on: asteroidBeltOn, fn: onToggleAsteroidBelt, key: 'B', title: 'Asteroid belt' },
      ].map((s) => (
        <button
          key={s.label}
          type="button"
          className="hud-switch"
          aria-pressed={s.on}
          title={`${s.title ?? s.label} (${s.key})`}
          onClick={(e) => {
            e.stopPropagation();
            s.fn?.();
          }}
        >
          <span className="track" />
          {s.label}
        </button>
      ))}
    </>
  );

  return (
    <div ref={rootRef} className={`hud-root font-sans ${route ? 'is-transit' : ''} ${isCatalogueOpen ? 'is-under-catalogue' : ''}`}>
      {/* Visor glass */}
      <div className="hud-visor" />
      <div className="hud-scanlines" />

      {/* Lock brackets ride on the destination during flights */}
      {!exploring && <TargetLock getView={getView} name={activeTargetName} />}

      {/* ========================================================
          HEADER — wordmark & chronometer · scale ladder · systems
          ======================================================== */}
      <header className="hud-dim absolute top-0 left-0 right-0 flex items-start justify-between gap-4 px-4 md:px-7 pt-4 md:pt-5 z-40 hud-parallax-far">
        {/* Wordmark & chronometer */}
        <div className="flex flex-col gap-2 pointer-events-auto min-w-0 hud-boot" style={{ ['--d' as string]: '80ms' }}>
          <div
            className="flex items-baseline gap-3 relative group cursor-pointer w-fit"
            onClick={onResetView}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onResetView();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="SOLARIS — reset to system overview"
            title="Reset to Solaris Overview"
          >
            {/* Luminous stellar aura behind title */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none" />

            <h1 className="relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer">
              SOLARIS
            </h1>
          </div>

          <div className="flex flex-col gap-1.5 w-fit">
            <div className="flex items-center gap-2.5 text-[10px] whitespace-nowrap [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
              <span className={`hud-led ${isPaused ? 'amber' : 'on pulse'}`} />
              <span className="hud-num text-white/85">{utcIso.replace('T', ' ').slice(0, 19)}</span>
              <span className="hud-label !text-[8px]">UTC</span>
              <span className="text-white/15 hidden sm:inline">│</span>
              <span className="hud-num text-white/45 hidden sm:inline">JD {julianDate.toFixed(3)}</span>
            </div>
            <div className="hud-rule w-full" style={{ ['--d' as string]: '600ms' }} />
            <div
              data-tour="logbook"
              className="flex items-center gap-2 text-[9px] tracking-[0.22em] uppercase text-white/45 whitespace-nowrap"
              title={logbook.log.visited.length ? `Reached: ${logbook.log.visited.join(', ')}` : 'Fly to a world to log it'}
            >
              <span className="text-[color:var(--sol-amber)]">◈</span>
              <span>Logbook</span>
              <span className="flex gap-[3px]" aria-hidden>
                {LOG_WORLDS.map((w) => (
                  <span
                    key={w}
                    className={`w-[5px] h-[5px] rotate-45 transition-all duration-700 ${logbook.log.visited.includes(w) ? 'bg-[color:var(--sol-mint)] shadow-[0_0_5px_var(--sol-mint)]' : 'border border-white/25'}`}
                  />
                ))}
              </span>
              <span className="hud-num tracking-[0.06em] text-white/70">{String(logbook.worlds).padStart(2, '0')}/{LOG_WORLDS.length}</span>
              {logbook.log.km > 0 && (
                <span className="hud-num tracking-[0.06em] text-white/40 hidden sm:inline">· {(logbook.log.km / 149597870.7).toFixed(2)} AU flown</span>
              )}
            </div>
          </div>
        </div>

        {/* Scale ladder */}
        <div
          data-tour="ladder"
          className={`hidden ${exploring ? '' : 'xl:flex'} flex-col items-center pointer-events-auto hud-boot`}
          style={{ ['--d' as string]: '260ms' }}
        >
          <ScaleLadder
            current={activeTargetName === 'Sagittarius A*' ? 'sgr_a' : observerDomain}
            readout={observerScale}
            onJump={(d) => {
              onJumpToScale?.(d);
              if (d === 'sgr_a') {
                onSelectPlanet('Sagittarius A*');
                handleRevealMonograph();
              }
            }}
          />
        </div>

        {/* Systems */}
        <div className="relative flex items-center gap-1.5 md:gap-2 pointer-events-auto shrink-0 hud-boot" style={{ ['--d' as string]: '420ms' }}>
          <div data-tour="layers" className="hidden lg:flex items-center">{layerSwitches}</div>
          <span className="hidden lg:block w-px h-4 bg-white/10 mx-1" />
          <VinylDeck current={activeTargetName} />
          <button
            type="button"
            data-tour="optics"
            data-popover-trigger
            onClick={(e) => {
              e.stopPropagation();
              setIsOpticsOpen((o) => !o);
            }}
            aria-expanded={isOpticsOpen}
            className={`hud-btn ${isOpticsOpen ? 'is-on' : ''}`}
            title="Lens, distances and layers"
          >
            <SlidersHorizontal size={11} />
            <span className="hidden sm:inline">Optics</span>
          </button>
          <AtlasLauncher stats={explored} onOpen={() => { setAtlasTab('worlds'); setIsCatalogueOpen(true); }} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void takeShot();
            }}
            className="hud-icon-btn"
            title="Take a picture (P)"
            aria-label="Take a picture"
          >
            <Camera size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onResetView();
            }}
            className="hud-icon-btn"
            title="System overview (Esc)"
            aria-label="Reset to system overview"
          >
            <RotateCcw size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTourOpen(true);
            }}
            className="hud-icon-btn"
            title="Instrument briefing"
            aria-label="Replay the instrument briefing"
          >
            <HelpCircle size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsHudVisible(false);
            }}
            className="hud-icon-btn"
            title="Hide interface (H)"
            aria-label="Hide interface"
          >
            <EyeOff size={12} />
          </button>

          <Popover open={isOpticsOpen} onClose={closeOptics} className="absolute right-0 top-[calc(100%+12px)] w-[340px] max-w-[calc(100vw-24px)] p-4 flex flex-col gap-4 z-40">
            <div className="flex flex-col gap-2">
              <span className="hud-label">Lens · L</span>
              <Segmented
                ariaLabel="Camera lens"
                items={LENS_ORDER.map((n) => ({ value: n, label: LENS_PROFILES[n].label }))}
                value={lensProfile}
                onChange={(n) => onSetLens?.(n)}
              />
            </div>
            <div className={`flex flex-col gap-2 ${bloomAvailable ? '' : 'opacity-40'}`} title={bloomAvailable ? 'Bloom strength' : 'The Clean lens has no bloom'}>
              <div className="flex items-baseline justify-between">
                <span className="hud-label">Bloom</span>
                <span className="hud-num text-[10px] text-white/60">{Math.round(bloomGain * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={5}
                value={Math.round(bloomGain * 100)}
                disabled={!bloomAvailable}
                onChange={(e) => onSetBloom?.(Number(e.target.value) / 100)}
                aria-label="Bloom strength"
                className="hud-range"
                style={{ ['--fill' as string]: `${(bloomGain / 3) * 100}%` }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="hud-label">Layers</span>
              <div className="flex flex-wrap -mx-2">{layerSwitches}</div>
            </div>
            <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[9.5px] text-white/45">
              {[
                ['Space', 'Play / hold'],
                ['Esc', 'Overview'],
                ['/', 'Catalogue'],
                ['P', 'Take a picture'],
                ['H', 'Hide HUD'],
                ['Drag', 'Orbit'],
                ['Wheel', 'Approach'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <kbd className="hud-num text-[9px] px-1.5 py-px border border-white/15 text-white/70">{k}</kbd>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </Popover>
        </div>
      </header>

      {/* Journey: letterbox, route rail, orbit crossings */}
      <VoyageConsole getView={getView} route={route} />
      {stamp && !route && <ArrivalStamp name={stamp.name} isNew={stamp.isNew} worlds={logbook.worlds} nonce={stamp.nonce} />}

      {/* Toast */}
      {toast && (
        <div key={toast.id} className="absolute left-1/2 -translate-x-1/2 top-[22%] z-30 hud-toast text-[10px] uppercase text-[color:var(--sol-amber)] [text-shadow:0_0_12px_rgba(244,205,114,0.5)] whitespace-nowrap">
          ◇ {toast.text}
        </div>
      )}

      {/* ========================================================
          3. LEFT VERTICAL PLANETARY SELECTOR (MATCHING REFERENCE)
          ======================================================== */}
      <nav
        data-tour="nav"
        className={`hud-dim absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${
          introPhase >= 1
            ? onSurfaceView || inHorizon
              ? 'opacity-0 -translate-x-8 pointer-events-none'
              : exploring ? 'opacity-40 hover:opacity-100 translate-x-0' : 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-8'
        }`}
      >
        {REFERENCE_NAV_ORDER.map((planetName) => {
          const itemNarrative = PLANET_NARRATIVES[planetName];
          const isSelected = activeTargetName === planetName;
          const thumbUrl = `${baseUrl}${itemNarrative?.textureThumb || 'textures/2k_moon.jpg'}`;

          return (
            <button
              key={planetName}
              aria-current={isSelected ? 'true' : undefined}
              aria-label={`Fly to ${planetName}`}
              onClick={(e) => {
                e.stopPropagation();
                if (planetName === 'Sagittarius A*') {
                  onJumpToScale?.('sgr_a');
                }
                onSelectPlanet(planetName);
                handleRevealMonograph();
              }}
              className="flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded"
            >
              {/* Radio Indicator (14px circle with inner dot) */}
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-white'
                    : 'border-white/35 group-hover:border-white/60'
                }`}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100" />
                )}
              </div>

              {/* Inactive Planet Sphere Thumbnail vs Active Color Pip */}
              {isSelected ? (
                /* Active: Expanding colored horizontal bar */
                <div
                  className="h-2.5 rounded-sm transition-all duration-300"
                  style={{
                    backgroundColor: itemNarrative?.accentColor || '#ffffff',
                    width: '28px',
                    boxShadow: `0 0 10px ${itemNarrative?.accentColor || '#ffffff'}88`,
                  }}
                />
              ) : (
                /* Inactive: 24px circular texture preview with 3D inset shadow */
                <div
                  className="w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0"
                  style={{
                    backgroundImage: `url(${thumbUrl})`,
                    boxShadow:
                      'inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)',
                  }}
                />
              )}

              {/* Planet Name & AU Distance */}
              <div className="flex flex-col">
                <span
                  className={`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isSelected
                      ? 'text-white font-medium'
                      : 'text-white/40 group-hover:text-white/80'
                  }`}
                >
                  {planetName}
                </span>
                <span
                  className={`text-[9px] tracking-wider transition-colors duration-200 font-light ${
                    isSelected
                      ? 'text-white/50'
                      : 'text-white/20 group-hover:text-white/40'
                  }`}
                >
                  {itemNarrative?.distanceAU || ''}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Black hole viewpoint: from orbit, or from the shore of a world */}
      {isBlackHole && !route && (
        <div className="hud-dim absolute left-1/2 -translate-x-1/2 top-[84px] md:top-[112px] z-30 pointer-events-auto hud-rise flex flex-col items-center gap-1.5">
          <span className="hud-label !text-[8px]">Viewpoint</span>
          <div className="hud-frame px-1 py-0.5">
            <Segmented
              ariaLabel="Black hole viewpoint"
              items={[
                { value: 'orbit', label: 'Orbit', title: 'Cinematic orbit shot at 25 r_s' },
                { value: 'horizon', label: 'Horizon', title: 'Stand on an ocean world at 20 r_s and watch it rise' },
              ]}
              value={inHorizon ? 'horizon' : 'orbit'}
              onChange={(v) => onHorizon?.(v === 'horizon')}
            />
          </div>
        </div>
      )}
      {inHorizon && (() => {
        const h = telemetry?.horizon ?? { rRs: 20, onShore: true };
        const f = horizonFacts(h.rRs, h.onShore);
        const farPerHour = 60 / Math.max(1e-6, f.clockRate);
        const farText = farPerHour < 600 ? `${Math.floor(farPerHour / 60)} h ${String(Math.round(farPerHour % 60)).padStart(2, '0')} m` : `${(farPerHour / 60).toFixed(0)} h`;
        const depth = Math.max(0, Math.min(1, (20 - h.rRs) / 18.9));
        return (
          <aside className="absolute left-6 bottom-6 z-20 hud-frame hud-slide-in px-4 py-3 w-[290px] pointer-events-auto">
            <div className="hud-label !text-[color:var(--sol-amber)]">{h.onShore ? 'Shore readout · hypothetical world' : 'Free flight · hovering on thrust'}</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[13px] font-extralight tracking-[0.3em] uppercase text-white">{h.onShore ? 'Ocean world' : 'Descent'}</span>
              <span className="hud-num text-[18px] text-[color:var(--sol-amber)]">
                {h.rRs.toFixed(h.rRs < 3 ? 3 : 2)} <span className="text-[10px] text-white/50">r<sub>s</sub></span>
              </span>
            </div>
            {/* Depth gauge: from the shore (20 r_s) down to the horizon (1 r_s) */}
            <div className="relative h-1.5 mt-2 bg-white/5 overflow-hidden">
              <span className="absolute inset-y-0 left-0 transition-[width] duration-300" style={{ width: `${depth * 100}%`, background: 'linear-gradient(90deg, rgba(244,205,114,0.4), #ff7a66)' }} />
              <span className="absolute inset-y-0 w-px bg-white/40" style={{ left: `${((20 - 1.5) / 18.9) * 100}%` }} title="Photon sphere, 1.5 r_s" />
              <span className="absolute inset-y-0 w-px bg-white/40" style={{ left: `${((20 - 3) / 18.9) * 100}%` }} title="ISCO, 3 r_s" />
            </div>
            <div className="flex justify-between hud-num text-[7.5px] text-white/30 mt-0.5">
              <span>SHORE 20</span><span>ISCO 3</span><span>PHOTON 1.5</span><span>HORIZON 1</span>
            </div>
            <div className="hud-rule w-16 my-2" />
            <dl className="grid grid-cols-[1fr_auto] gap-y-1.5 text-[10.5px]">
              <dt className="text-white/45">1 hour here lasts</dt>
              <dd className="hud-num text-[color:var(--sol-mint)] text-right">{farText} far away</dd>
              <dt className="text-white/45">Tidal stretch</dt>
              <dd className="hud-num text-white/85 text-right">{f.tidalGPerMetre.toExponential(1)} g / m</dd>
              <dt className="text-white/45">Shadow across the sky</dt>
              <dd className="hud-num text-white/85 text-right">{f.shadowDeg.toFixed(1)}°</dd>
              <dt className="text-white/45">Above the horizon</dt>
              <dd className="hud-num text-white/85 text-right">{((h.rRs - 1) * 12.69).toFixed(h.rRs < 2 ? 2 : 0)} M km</dd>
            </dl>
            <p className="text-[9.5px] text-white/40 leading-snug mt-2">
              {h.rRs < 1.5
                ? 'Inside the photon sphere: the shadow now fills more than half the sky, and no orbit is possible. Only thrust holds you here.'
                : h.rRs < 3
                  ? 'Below the ISCO: no stable orbit exists. Matter here plunges; you hover only on thrust.'
                  : 'Rocks and light fall in; seen from here they slow, redden and fade at the edge, never seen to cross. (Rocks are enlarged; real meteoroids would be invisible at this scale.)'}
            </p>
            <p className="text-[9px] text-white/35 mt-1.5 leading-relaxed">
              <kbd className="hud-num">W A S D</kbd> fly · <kbd className="hud-num">E</kbd>/<kbd className="hud-num">Q</kbd> up/down · <kbd className="hud-num">Shift</kbd> boost · drag to look · <kbd className="hud-num">R</kbd> shore · <kbd className="hud-num">Esc</kbd> orbit
            </p>
          </aside>
        );
      })()}

      {/* Attitude scope — bottom left, under the planet list */}
      {!onSurfaceView && !inHorizon && (
        <div data-tour="scope" className="hud-dim absolute left-6 bottom-5 hidden md:block z-20 hud-boot hud-parallax-near [@media(max-height:820px)]:hidden" style={{ ['--d' as string]: '700ms' }}>
          <AttitudeScope
            getView={getView}
            range={observerScale}
            azimuth={telemetry?.lookAzimuthDeg ?? 0}
            elevation={telemetry?.lookElevationDeg ?? 0}
          />
        </div>
      )}

      {/* ========================================================
          MONOGRAPH — the subject, introduced
          ======================================================== */}
      {monographVisible && !exploring && !velaTalking && (
        <section
          data-tour="monograph"
          key={activeTargetName}
          onMouseEnter={() => setIsHoveredMonograph(true)}
          onMouseLeave={() => setIsHoveredMonograph(false)}
          className="hud-dim absolute left-1/2 bottom-[96px] md:bottom-[104px] -translate-x-1/2 pointer-events-auto select-none z-20 w-[min(760px,calc(100vw-32px))]"
        >
          <div className={`flex flex-col items-center text-center px-4 ${isVanishing ? 'monograph-vanishing' : 'monograph-visible'}`}>
            {/* Eyebrow: 03 / PLANET */}
            <div className="flex items-center gap-3 mb-1">
              <span className="hud-rule rev w-10" style={{ ['--d' as string]: '200ms' }} />
              <span
                className="text-[10px] md:text-[11px] uppercase tracking-[0.48em] font-light transition-colors duration-500"
                style={{ color: narrative.eyebrowColor }}
              >
                {monoEyebrow}
              </span>
              <span className="hud-rule w-10" style={{ ['--d' as string]: '200ms' }} />
            </div>

            {/* Huge Title */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-[0.2em] sm:tracking-[0.34em] text-white uppercase drop-shadow-2xl my-1 [text-shadow:0_0_40px_rgba(0,0,0,0.6)]">
              <DecodeText text={activeTargetName.toUpperCase()} durationMs={1000} />
            </h2>

            {/* Editorial Description Paragraph */}
            <p className="text-[10px] md:text-[11px] font-light tracking-[0.18em] leading-relaxed text-white/70 uppercase max-w-xl mx-auto mt-2 mb-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
              {narrative.monographText}
            </p>

            {/* Data strip */}
            {monoStats.length > 0 && (
              <dl className="flex flex-wrap justify-center gap-y-2 mb-3 hud-rise" style={{ ['--d' as string]: '450ms' }}>
                {monoStats.map((s, i) => (
                  <div key={s.k} className={`hud-stat px-4 md:px-5 py-1 flex flex-col items-center ${i ? 'border-l border-white/10' : ''}`}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsReadMoreOpen(true);
              }}
              className="hud-link outline-none focus-visible:ring-1 focus-visible:ring-white/60"
              style={{ color: narrative.accentColor }}
            >
              Read more <span className="arrow">→</span>
            </button>
          </div>
        </section>
      )}

      {/* Re-open the monograph once it has stepped aside */}
      {!monographVisible && !exploring && !velaTalking && (
        <div className="hud-dim absolute left-1/2 bottom-[86px] md:bottom-[96px] -translate-x-1/2 pointer-events-auto z-20 hud-rise">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRevealMonograph();
            }}
            className="hud-btn group"
          >
            <span className="hud-led pulse" style={{ background: narrative.accentColor, boxShadow: `0 0 6px ${narrative.accentColor}` }} />
            <span>{activeTargetName}</span>
            <span className="text-white/30 group-hover:text-white/70 transition">· dossier</span>
          </button>
        </div>
      )}

      {/* System plot — bottom right */}
      {!onSurfaceView && (
        <div data-tour="plot" className="hud-dim absolute right-6 bottom-5 hidden md:block z-20 hud-boot hud-parallax-near [@media(max-height:620px)]:hidden" style={{ ['--d' as string]: '820ms' }}>
          <SystemPlot
            getView={getView}
            target={activeTargetName}
            onSelect={(n) => {
              onSelectPlanet(n);
              handleRevealMonograph();
            }}
          />
        </div>
      )}

      {/* Planetary Explorer (surface imagery, landmarks) / surface sky view */}
      <div className="hud-dim">
      {onSurfaceView && telemetry?.surface ? (
        <SurfacePanel status={telemetry.surface} onAction={(a) => onSurface?.(a)} />
      ) : (
        <ExplorerPanel
          status={telemetry?.explorer}
          autoOpen={exploring}
          onFlyToLandmark={(id) => onFlyToLandmark?.(id)}
          onDaylight={(on) => onExplorerDaylight?.(on)}
          onStandHere={() => onSurface?.({ type: 'enter' })}
          onSkyFrom={(body, facing) => onSurface?.({ type: 'skyFrom', body, facing })}
          onSelectBody={onSelectPlanet}
          onResetView={onResetView}
        />
      )}
      </div>

      {/* ========================================================
          TIME DECK
          ======================================================== */}
      {flash > 0 && <div key={flash} className="hud-flash" aria-hidden />}

      {(telemetry?.surface?.timelapse || telemetry?.horizon?.timelapse) && (
        <div className="hud-timelapse" role="status">
          <span className="dot" /> Time-lapse · move to take over
        </div>
      )}

      <footer data-tour="time" className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto z-30 hud-boot max-w-[calc(100vw-16px)]" style={{ ['--d' as string]: '560ms' }}>
        <TimeDeck
          isPaused={isPaused}
          multiplier={multiplier}
          date={utcIso.slice(0, 10)}
          onTogglePlay={onTogglePlay}
          onSetMultiplier={onSetTimeMultiplier}
          onJ2000={onResetToJ2000}
          onNow={onResetToNow}
          onSeek={onSeekDate}
        />
      </footer>

      <Companion
        ready={introDone}
        current={activeTargetName}
        inTransit={!!route}
        route={route}
        arrival={arrival}
        tourStep={tourStep}
        tourOpen={tourOpen}
        horizon={telemetry?.horizon ?? null}
        surfaceActive={onSurfaceView}
        orbitsOn={orbitsOn}
        constellationsOn={constellationsOn}
        worldsLogged={logbook.worlds}
        explored={explored}
        atlasOpen={isCatalogueOpen}
        sunClose={!route && target?.name === 'Sun' && (telemetry?.cameraDistance ?? Infinity) < SUN_CLOSE_UNITS}
        timeRate={isPaused ? 0 : multiplier}
        lens={lensProfile}
        onTalkingChange={setVelaTalking}
        actions={{
          fly: (b) => {
            if (b === 'Sagittarius A*') onJumpToScale?.('sgr_a');
            onSelectPlanet(b);
            handleRevealMonograph();
          },
          sky: (b, facing) => onSurface?.({ type: 'skyFrom', body: b, facing }),
          landmark: (id) => onFlyToLandmark?.(id),
          horizon: (on) => onHorizon?.(on),
          lens: (n) => onSetLens?.(n),
          zoom: (d) => onJumpToScale?.(d),
          time: (rate) => onSetTimeMultiplier(rate),
          tour: () => setTourOpen(true),
        }}
      />

      <Tour
        open={tourOpen}
        onStep={(index) => setTourStep({ index, nonce: performance.now() })}
        onClose={() => {
          setTourOpen(false);
          voice.stop();
        }}
        demos={{
          toggleOrbits: () => onToggleOrbits?.(),
          setTimeRate: (m) => onSetTimeMultiplier(m),
          timeRate: multiplier,
          openOptics: (o) => setIsOpticsOpen(o),
        }}
      />

      {/* ========================================================
          DOSSIER — "Read more" drawer
          ======================================================== */}
      {isReadMoreOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex justify-end">
          <div onClick={() => setIsReadMoreOpen(false)} className="flex-1 bg-black/55 backdrop-blur-[3px] hud-fade-in" />

          <aside className="hud-drawer-in hud-scroll w-[440px] max-w-full bg-[#05040a]/95 backdrop-blur-2xl border-l border-[color:var(--sol-line)] px-7 py-7 flex flex-col gap-6 shadow-2xl h-full overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="hud-label" style={{ color: narrative.eyebrowColor }}>
                  {narrative.eyebrow} · Dossier
                </span>
                <h2 className="text-3xl font-extralight text-white tracking-[0.25em] uppercase">
                  <DecodeText text={activeTargetName.toUpperCase()} durationMs={700} />
                </h2>
                <div className="hud-rule w-24 mt-2" style={{ ['--d' as string]: '250ms' }} />
              </div>
              <button onClick={() => setIsReadMoreOpen(false)} className="hud-icon-btn" aria-label="Close details">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2 hud-rise" style={{ ['--d' as string]: '120ms' }}>
              <span className="hud-label">Lore & environment</span>
              <p className="text-xs leading-relaxed text-white/80 font-light">{narrative.extendedLore}</p>
            </div>

            {isBlackHole && (
              <div className="flex flex-col gap-3 hud-rise" style={{ ['--d' as string]: '200ms' }}>
                <div className="flex items-center justify-between">
                  <span className="hud-label !text-amber-300">Relativistic horizons</span>
                  <span className="hud-num text-[9px] px-2 py-0.5 border border-amber-400/30 text-amber-200">EHT · NASA SVS</span>
                </div>
                <dl className="grid grid-cols-2 gap-y-2 text-[11px] font-light">
                  {[
                    ['Mass (M)', '4.297 ± 0.012 × 10⁶ M☉'],
                    ['Schwarzschild r_s', '12.69 × 10⁶ km'],
                    ['Photon sphere', '1.5 r_s · 19.04 × 10⁶ km'],
                    ['Shadow radius', '2.60 r_s · 32.97 × 10⁶ km'],
                    ['EHT shadow θ', '51.8 ± 2.3 µas'],
                    ['ISCO radius', '3.0 r_s · 38.07 × 10⁶ km'],
                    ['ISCO velocity', '0.408 c'],
                    ['Distance', '8.277 kpc (26,990 ly)'],
                  ].map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="text-white/40">{k}</dt>
                      <dd className="text-right hud-num text-amber-200/90">{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
                <ul className="flex flex-col gap-2 text-[11px] text-white/65 font-light border-l border-amber-400/25 pl-3">
                  <li><strong className="text-amber-200 font-normal">Event horizon shadow.</strong> In the Schwarzschild metric every photon with impact parameter b &lt; 3√3/2 r_s ≈ 2.598 r_s is captured; null-geodesic ray tracing draws that edge.</li>
                  <li><strong className="text-amber-200 font-normal">Lensed accretion arches.</strong> Light from the far side of the disk loops over and under the hole, projecting primary and secondary arcs.</li>
                  <li><strong className="text-amber-200 font-normal">Doppler beaming.</strong> Plasma at ~0.4 c blazes blue-white on the approaching limb (intensity ∝ δ⁴) and dims to red on the receding one.</li>
                  <li><strong className="text-amber-200 font-normal">Polar jets.</strong> Twin collimated beams at ~0.98 c along the spin axis.</li>
                  <li><strong className="text-amber-200 font-normal">S-cluster.</strong> Hundreds of stars orbit Sgr A* in the central parsec; S2 reaches 7,650 km/s at pericentre.</li>
                </ul>
              </div>
            )}

            {fullTargetDef && (
              <div className="flex flex-col gap-2 hud-rise" style={{ ['--d' as string]: '240ms' }}>
                <span className="hud-label">Physical</span>
                <dl className="grid grid-cols-2 gap-y-2 text-[11px] font-light">
                  <dt className="text-white/40">Mean radius</dt>
                  <dd className="text-right hud-num text-white/90">{fullTargetDef.physical.meanRadiusKm.toLocaleString()} km</dd>
                  <dt className="text-white/40">Surface gravity</dt>
                  <dd className="text-right hud-num text-white/90">
                    {fullTargetDef.physical.gmKm3S2
                      ? `${((fullTargetDef.physical.gmKm3S2 * 1000) / Math.pow(fullTargetDef.physical.meanRadiusKm, 2)).toFixed(2)} m/s²`
                      : '—'}
                  </dd>
                  <dt className="text-white/40">Sidereal day</dt>
                  <dd className="text-right hud-num text-white/90">
                    {fullTargetDef.physical.rotationPeriodHours !== undefined ? `${fullTargetDef.physical.rotationPeriodHours.toFixed(1)} h` : 'Synchronous'}
                  </dd>
                  <dt className="text-white/40">Axial tilt</dt>
                  <dd className="text-right hud-num text-white/90">
                    {fullTargetDef.physical.axialTiltDeg !== undefined ? `${fullTargetDef.physical.axialTiltDeg.toFixed(2)}°` : '0.00°'}
                  </dd>
                </dl>
              </div>
            )}

            {fullTargetDef && (
              <div className="flex flex-col gap-2 hud-rise" style={{ ['--d' as string]: '300ms' }}>
                <span className="hud-label">Keplerian orbit · J2000</span>
                <dl className="grid grid-cols-2 gap-y-2 text-[11px] font-light">
                  <dt className="text-white/40">Semi-major axis</dt>
                  <dd className="text-right hud-num text-white/90">{fullTargetDef.orbit.semiMajorAxisAU.toFixed(3)} AU</dd>
                  <dt className="text-white/40">Eccentricity</dt>
                  <dd className="text-right hud-num text-white/90">{fullTargetDef.orbit.eccentricity.toFixed(4)}</dd>
                  <dt className="text-white/40">Orbital period</dt>
                  <dd className="text-right hud-num text-white/90">
                    {fullTargetDef.orbit.orbitalPeriodDays > 730
                      ? `${(fullTargetDef.orbit.orbitalPeriodDays / 365.25).toFixed(2)} yr`
                      : `${fullTargetDef.orbit.orbitalPeriodDays.toFixed(1)} d`}
                  </dd>
                  <dt className="text-white/40">Inclination</dt>
                  <dd className="text-right hud-num text-white/90">{fullTargetDef.orbit.inclinationDeg.toFixed(2)}°</dd>
                </dl>
              </div>
            )}

            {target && (
              <div className="flex flex-col gap-2 hud-rise" style={{ ['--d' as string]: '360ms' }}>
                <span className="hud-label">
                  <span className="hud-led on pulse inline-block mr-2 align-middle" />
                  Live ephemeris
                </span>
                <dl className="grid grid-cols-2 gap-y-2 text-[11px] font-light">
                  <dt className="text-white/40">Heliocentric</dt>
                  <dd className="text-right hud-num text-[color:var(--sol-mint)]">{fmtKm(target.distanceKm)}</dd>
                  <dt className="text-white/40">In AU</dt>
                  <dd className="text-right hud-num text-[color:var(--sol-mint)]">{(target.distanceKm / AU_KM).toFixed(4)} AU</dd>
                  <dt className="text-white/40">Orbital velocity</dt>
                  <dd className="text-right hud-num text-[color:var(--sol-mint)]">{target.apparentSpeedKmS.toFixed(2)} km/s</dd>
                </dl>
              </div>
            )}

            {narrative.missions && narrative.missions.length > 0 && (
              <div className="flex flex-col gap-2 hud-rise" style={{ ['--d' as string]: '420ms' }}>
                <span className="hud-label">Missions</span>
                <ol className="flex flex-col">
                  {narrative.missions.map((m) => (
                    <li key={m.name} className="relative pl-4 py-2 border-l border-white/10">
                      <span className="absolute -left-[3px] top-3 w-[5px] h-[5px] rounded-full bg-[color:var(--sol-amber)]" />
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="text-white tracking-[0.1em]">{m.name}</span>
                        <span className="hud-num text-[9px] text-white/40">{m.year} · {m.agency}</span>
                      </div>
                      <p className="text-[11px] text-white/55 font-light mt-0.5">{m.role}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[9px] text-white/30 uppercase tracking-[0.2em]">
              <span>{fullTargetDef?.orbit.source ?? 'NASA JPL orbital elements'}</span>
              <span>Keplerian 2-body</span>
            </div>

            {/* Third-party data & image credits (required by CC BY / CC BY-SA licences) */}
            <p className="text-[10px] leading-relaxed font-light text-white/35">
              Textures: Solar System Scope (CC BY 4.0) · Moon maps: NASA/JPL/USGS/SSI/LPI, Björn Jónsson · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) ·
              Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) ·
              Nebulae: NASA, ESA, CSA, STScI, M. Livio &amp; the Hubble 20th Anniversary Team; ESO/J. Emerson/VISTA (CC BY 4.0) ·
              Orbits: NASA JPL.{' '}
              <a href="https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">
                Full credits
              </a>
            </p>
          </aside>
        </div>
      )}

      {isCatalogueOpen && showcase && (
        <CatalogueScreen
          visited={logbook.log.visited}
          current={activeTargetName}
          showcase={showcase}
          initialTab={atlasTab}
          onPostcard={(p) => onPostcard?.(p)}
          onClose={() => setIsCatalogueOpen(false)}
        />
      )}
    </div>
  );
};
