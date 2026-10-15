import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { TelemetryData } from '../../rendering/SolarSystemScene';
import { CatalogueManager } from '../../data/CatalogueManager';
import { ScaleMode } from '../../rendering/RenderSpaceTransform';
import { getPlanetNarrative, PLANET_NARRATIVES } from '../../data/PlanetNarratives';
import { LENS_ORDER, LENS_PROFILES, LensProfileName } from '../../rendering/LensPipeline';
import { ExplorerPanel } from './ExplorerPanel';
import { SurfacePanel, SurfaceAction } from './SurfacePanel';
import {
  Play,
  Pause,
  Search,
  Eye,
  EyeOff,
  X,
  RotateCcw,
  Calendar
} from 'lucide-react';

interface FlightHUDProps {
  telemetry: TelemetryData | null;
  onSelectPlanet: (name: string) => void;
  onResetView: () => void;
  onTogglePlay: () => void;
  onSetTimeMultiplier: (multiplier: number) => void;
  onSetScaleMode: (mode: ScaleMode) => void;
  onSeekDate: (utcMs: number) => void;
  onResetToJ2000: () => void;
  onResetToNow: () => void;
  onToggleConstellations?: () => void;
  onToggleAsteroidBelt?: () => void;
  onToggleOrbits?: () => void;
  onJumpToScale?: (domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a') => void;
  onSetLens?: (name: LensProfileName) => void;
  onSetBloom?: (gain: number) => void;
  onCycleLens?: () => void;
  onFlyToLandmark?: (id: string) => void;
  onExplorerDaylight?: (on: boolean) => void;
  onSurface?: (a: SurfaceAction) => void;
}

type CatalogueFilter = 'all' | 'planet' | 'moon' | 'minor';

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

export const FlightHUD: React.FC<FlightHUDProps> = ({
  telemetry,
  onSelectPlanet,
  onResetView,
  onTogglePlay,
  onSetTimeMultiplier,
  onSetScaleMode,
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
}) => {
  const target = telemetry?.activeTarget;
  const isPaused = telemetry?.isPaused ?? false;
  const multiplier = telemetry?.timeScale ?? 1.0;
  const scaleMode = telemetry?.scaleMode ?? 'exploration';
  const julianDate = telemetry?.julianDate ?? 2451545.0;
  const utcIso = telemetry?.utcIso ?? new Date().toISOString();

  const constellationsOn = telemetry?.constellationsVisible ?? true;
  const asteroidBeltOn = telemetry?.asteroidBeltVisible ?? true;
  const orbitsOn = telemetry?.orbitsVisible ?? true;

  const observerScale = telemetry?.observerScaleMetric ?? '1.00 AU';
  const lensProfile = telemetry?.lensProfile ?? 'cinematic';
  const bloomGain = telemetry?.bloomGain ?? 1;
  const bloomAvailable = LENS_PROFILES[lensProfile].bloomStrength > 0;
  const observerDomain = telemetry?.observerDomain ?? 'inner_system';
  const travelSpeed = telemetry?.travelSpeed ?? 0;
  // Close to a globe the view becomes a map: editorial overlays step aside
  const onSurfaceView = !!telemetry?.surface?.active;
  const exploring = onSurfaceView || (telemetry?.explorer?.altitudeRadii ?? Infinity) < 1.2;

  // Interface state
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState<boolean>(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState<boolean>(false);
  const [catalogueFilter, setCatalogueFilter] = useState<CatalogueFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(utcIso.slice(0, 10));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  // Staged cinematic intro choreography (0 -> 1 -> 2)
  const [introPhase, setIntroPhase] = useState<number>(0);

  // Monograph auto-vanish state (shows on target selection, vanishes after 5.5s)
  const [monographVisible, setMonographVisible] = useState<boolean>(true);
  const [isVanishing, setIsVanishing] = useState<boolean>(false);
  const [isHoveredMonograph, setIsHoveredMonograph] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroPhase(2);
      return;
    }

    const t1 = setTimeout(() => setIntroPhase(1), 500);
    const t2 = setTimeout(() => setIntroPhase(2), 1200);

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
      } else if (e.key === 'Escape') {
        if (isReadMoreOpen) {
          setIsReadMoreOpen(false);
        } else if (isCatalogueOpen || isDatePickerOpen) {
          setIsCatalogueOpen(false);
          setIsDatePickerOpen(false);
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
    isReadMoreOpen,
    isCatalogueOpen,
    isDatePickerOpen
  ]);

  // Sync date input when running
  useEffect(() => {
    if (!isEditingDate && !isDatePickerOpen) {
      setDateInput(utcIso.slice(0, 10));
    }
  }, [utcIso, isEditingDate, isDatePickerOpen]);

  const activeTargetName = target?.name || 'Mercury';
  const narrative = useMemo(() => getPlanetNarrative(activeTargetName), [activeTargetName]);
  const allBodies = useMemo(() => {
    const list = [...CatalogueManager.getAllBodies()];
    const sgr = CatalogueManager.getSagittariusAStar();
    if (sgr) list.unshift(sgr);
    return list;
  }, []);
  const fullTargetDef = useMemo(() => {
    if (activeTargetName === 'Sagittarius A*' || activeTargetName === 'Sgr A*' || activeTargetName === 'sagittarius_a_star') {
      return CatalogueManager.getSagittariusAStar();
    }
    return CatalogueManager.getBody(activeTargetName);
  }, [activeTargetName]);

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
    }, 5500);

    const hideTimer = setTimeout(() => {
      setMonographVisible(false);
      setIsVanishing(false);
    }, 7100);

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

  const filteredBodies = useMemo(() => {
    return allBodies.filter((b) => {
      if (catalogueFilter === 'planet' && b.category !== 'planet') return false;
      if (catalogueFilter === 'moon' && b.category !== 'moon') return false;
      if (catalogueFilter === 'minor' && b.category !== 'asteroid' && b.category !== 'dwarf_planet') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.parentName && b.parentName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allBodies, catalogueFilter, searchQuery]);

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingDate(false);
    const parsed = Date.parse(dateInput);
    if (!isNaN(parsed)) {
      onSeekDate(parsed);
      setIsDatePickerOpen(false);
    }
  };

  const speedSteps = [
    { label: '1×', val: 1 },
    { label: '10×', val: 10 },
    { label: '100×', val: 100 },
    { label: '1 D/S', val: 86400 },
    { label: '1 M/S', val: 2592000 },
    { label: '1 Y/S', val: 31536000 },
  ];

  const baseUrl = import.meta.env.BASE_URL || '/';

  if (!isHudVisible) {
    return (
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsHudVisible(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light"
        >
          <Eye size={13} />
          <span>Show Interface (H)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6 z-20 font-sans text-white/90 overflow-hidden">
      
      {/* ========================================================
          1. TOP CENTER SUBTLE STELLAR CORONA HIGHLIGHT
          ======================================================== */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* ========================================================
          2. TOP BAR CONTROLS & EPHEMERIS READOUT
          ======================================================== */}
      <header className="flex flex-col md:flex-row md:justify-between items-start gap-2 pointer-events-auto w-full z-30">
        {/* Top-Left: SOLARIS Brand & Live Ephemeris Time */}
        <div
          className={`flex flex-col gap-1.5 transition-all duration-1000 ${
            introPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Brand Name with Unique Creative Animation */}
          <div
            className="flex items-baseline gap-3 relative group cursor-pointer"
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
            <span className="text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden 2xl:inline">
              Solar System Explorer
            </span>
          </div>

          {/* Ephemeris Time Readout with Image 1's Typography */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit max-w-full mt-0.5 flex-wrap md:flex-nowrap md:whitespace-nowrap">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-white/85">{utcIso.replace('T', ' ').slice(0, 19)} UTC</span>
            <span className="text-white/20">·</span>
            <span>JD {julianDate.toFixed(2)}</span>
            <span className="text-white/20">·</span>
            <span className="text-amber-300/90 font-mono tracking-wider">{observerScale}</span>
          </div>
        </div>

        {/* Top-Center: Multiscale Cosmological Domain & Scale Navigator */}
        <div className={`hidden ${exploring ? '' : 'xl:flex'} items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto`}>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light">
            <span className={`w-1.5 h-1.5 rounded-full ${travelSpeed > 4 ? 'bg-cyan-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-white/40 uppercase">SCALE:</span>
            <span className="text-white font-medium tracking-[0.12em]">{observerScale}</span>
          </div>

          <div className="flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light">
            <button
              onClick={() => onJumpToScale?.('planetary')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                observerDomain === 'planetary'
                  ? 'bg-white/20 text-white font-medium shadow-sm border border-white/25'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Planet
            </button>
            <button
              onClick={() => onJumpToScale?.('inner_system')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                observerDomain === 'inner_system'
                  ? 'bg-white/20 text-white font-medium shadow-sm border border-white/25'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Inner Sys
            </button>
            <button
              onClick={() => onJumpToScale?.('outer_system')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                observerDomain === 'outer_system'
                  ? 'bg-white/20 text-white font-medium shadow-sm border border-white/25'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Outer Sys
            </button>
            <button
              onClick={() => onJumpToScale?.('interstellar')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                observerDomain === 'interstellar'
                  ? 'bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Interstellar
            </button>
            <button
              onClick={() => onJumpToScale?.('galactic')}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                observerDomain === 'galactic' && activeTargetName !== 'Sagittarius A*'
                  ? 'bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Milky Way
            </button>
            <button
              onClick={() => {
                onJumpToScale?.('sgr_a');
                onSelectPlanet('Sagittarius A*');
                handleRevealMonograph();
              }}
              className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
                activeTargetName === 'Sagittarius A*'
                  ? 'bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Sgr A*
            </button>
          </div>
        </div>

        {/* Top-Right: Astronomical Layer Toggles & Catalogue Trigger */}
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 min-w-0">
          {/* Layer toggles */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleOrbits?.();
              }}
              title="Toggle Orbit Lines (O)"
              aria-pressed={orbitsOn}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                orbitsOn
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Orbits
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleConstellations?.();
              }}
              title="Toggle constellation figures (C)"
              aria-pressed={constellationsOn}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                constellationsOn
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Constellations
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAsteroidBelt?.();
              }}
              title="Toggle Asteroid Belt (B)"
              aria-pressed={asteroidBeltOn}
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                asteroidBeltOn
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Belt
            </button>
          </div>

          {/* Scale mode toggle */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetScaleMode('exploration');
              }}
              aria-pressed={scaleMode === 'exploration'}
              title="Compressed distances and enlarged bodies for exploring"
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                scaleMode === 'exploration'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Exploration
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetScaleMode('scientific');
              }}
              aria-pressed={scaleMode === 'scientific'}
              title="Orbital distances to true scale (1 unit = 1,000,000 km); globes are enlarged 4× (minimum 15,000 km) so they stay visible"
              className={`px-3 py-1 rounded-full transition-all duration-200 ${
                scaleMode === 'scientific'
                  ? 'bg-white/15 text-white shadow-sm border border-white/20'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              True Distances
            </button>
          </div>

          {/* Lens / optics profile */}
          <div
            className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg"
            role="group"
            aria-label="Camera lens (L)"
          >
            {LENS_ORDER.map((name) => (
              <button
                key={name}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetLens?.(name);
                }}
                aria-pressed={lensProfile === name}
                title={`${LENS_PROFILES[name].label} lens (L cycles)`}
                className={`px-3 py-1 rounded-full transition-all duration-200 ${
                  lensProfile === name
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {LENS_PROFILES[name].label}
              </button>
            ))}
          </div>

          {/* Bloom strength (multiplier on the lens profile's glare) */}
          <label
            className={`flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg ${
              bloomAvailable ? 'text-white/60' : 'text-white/25'
            }`}
            title={bloomAvailable ? 'Bloom strength' : 'The Clean lens has no bloom'}
            onClick={(e) => e.stopPropagation()}
          >
            Bloom
            <input
              type="range"
              min={0}
              max={300}
              step={5}
              value={Math.round(bloomGain * 100)}
              disabled={!bloomAvailable}
              onChange={(e) => onSetBloom?.(Number(e.target.value) / 100)}
              aria-label="Bloom strength"
              className="w-20 accent-white/80 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="w-8 text-right tabular-nums text-white/50">{Math.round(bloomGain * 100)}%</span>
          </label>

          {/* Catalogue Index Drawer Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCatalogueOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg"
          >
            <Search size={11} className="text-white/50" />
            <span>Catalogue ({allBodies.length})</span>
          </button>

          {/* System Overview Reset */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetView();
            }}
            title="Reset to System Overview"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg"
          >
            <RotateCcw size={11} className="text-white/50" />
            <span>Overview</span>
          </button>

          {/* Hide UI (H) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsHudVisible(false);
            }}
            title="Hide Interface (H)"
            aria-label="Hide interface"
            className="p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg"
          >
            <EyeOff size={12} />
          </button>
        </div>
      </header>

      {/* ========================================================
          3. LEFT VERTICAL PLANETARY SELECTOR (MATCHING REFERENCE)
          ======================================================== */}
      <nav
        className={`absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${
          introPhase >= 1
            ? onSurfaceView
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

      {/* ========================================================
          4. CENTER EDITORIAL MONOGRAPH (OVER HORIZON)
             Vanishes after 5.5s with ethereal upward blur dissolve!
          ======================================================== */}
      {monographVisible && !exploring && (
        <section
          onMouseEnter={() => setIsHoveredMonograph(true)}
          onMouseLeave={() => setIsHoveredMonograph(false)}
          className="absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20"
        >
          <div
            className={`flex flex-col items-center text-center max-w-2xl px-6 ${
              isVanishing ? 'monograph-vanishing' : 'monograph-visible'
            }`}
          >
            {/* Eyebrow: PLANET / DWARF PLANET / STAR */}
            <span
              className="text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1"
              style={{ color: narrative.eyebrowColor }}
            >
              {narrative.eyebrow}
            </span>

            {/* Huge Title: MERCURY / EARTH / SATURN */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500">
              {activeTargetName}
            </h2>

            {/* Editorial Description Paragraph */}
            <p className="text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500">
              {narrative.monographText}
            </p>

            {/* READ MORE Button with Accent Underline */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsReadMoreOpen(true);
              }}
              className="group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded"
            >
              <span
                className="text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300"
                style={{ color: narrative.accentColor }}
              >
                READ MORE
              </span>
              <div
                className="h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]"
                style={{
                  backgroundColor: narrative.accentColor,
                  boxShadow: `0 0 6px ${narrative.accentColor}66`,
                }}
              />
            </button>
          </div>
        </section>
      )}

      {/* Floating Minimal Pill Trigger when vanished (click to re-open anytime) */}
      {!monographVisible && !exploring && (
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRevealMonograph();
            }}
            className="flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: narrative.accentColor }}
            />
            <span>{activeTargetName} Overview</span>
          </button>
        </div>
      )}

      {/* Planetary Explorer (surface imagery, landmarks) / surface sky view */}
      {onSurfaceView && telemetry?.surface ? (
        <SurfacePanel status={telemetry.surface} onAction={(a) => onSurface?.(a)} />
      ) : (
      <ExplorerPanel
        status={telemetry?.explorer}
        onFlyToLandmark={(id) => onFlyToLandmark?.(id)}
        onDaylight={(on) => onExplorerDaylight?.(on)}
        onStandHere={() => onSurface?.({ type: 'enter' })}
        onSkyFrom={(body, facing) => onSurface?.({ type: 'skyFrom', body, facing })}
        onSelectBody={onSelectPlanet}
        onResetView={onResetView}
      />
      )}

      {/* ========================================================
          5. BOTTOM TIMELINE CONTROLLER & DATE CONTROLS
          ======================================================== */}
      <footer className="flex flex-col items-center gap-2 w-full pointer-events-auto z-30">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl">
          {/* Play/Pause */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="p-1 text-white/70 hover:text-white transition rounded-full"
            title="Space to toggle play"
            aria-label={isPaused ? 'Play simulation' : 'Pause simulation'}
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />}
          </button>

          {/* Speed selector steps */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            {speedSteps.map((step) => {
              const active = !isPaused && multiplier === step.val;
              return (
                <button
                  key={step.label}
                  aria-pressed={active}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetTimeMultiplier(step.val);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white font-normal border border-white/25 shadow-sm'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          {/* Epoch Shortcuts */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetToJ2000();
              }}
              className="text-white/40 hover:text-white px-1.5 py-0.5 rounded transition"
            >
              J2000
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetToNow();
              }}
              className="text-white/40 hover:text-white px-1.5 py-0.5 rounded transition"
            >
              Now
            </button>
            
            {/* Date Picker Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDatePickerOpen(!isDatePickerOpen);
              }}
              aria-label={`Jump to date (current ${dateInput})`}
              aria-expanded={isDatePickerOpen}
              className="flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition"
            >
              <Calendar size={10} />
              <span>{dateInput}</span>
            </button>
          </div>
        </div>

        {/* Date Jump Modal Popover */}
        {isDatePickerOpen && (
          <form
            onSubmit={handleDateSubmit}
            className="flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl"
          >
            <input
              type="date"
              aria-label="Simulation date (UTC)"
              value={dateInput}
              onFocus={() => setIsEditingDate(true)}
              onChange={(e) => {
                setIsEditingDate(true);
                setDateInput(e.target.value);
              }}
              onBlur={() => setIsEditingDate(false)}
              className="bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light"
            >
              Jump
            </button>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(false)}
              className="p-1 text-white/40 hover:text-white"
              aria-label="Close date picker"
            >
              <X size={12} />
            </button>
          </form>
        )}
      </footer>

      {/* ========================================================
          6. "READ MORE" EDITORIAL SLIDE-OVER DRAWER (FROM RIGHT)
          ======================================================== */}
      {isReadMoreOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsReadMoreOpen(false)}
            className="flex-1 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <aside className="w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar">
            {/* Drawer Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span
                  className="text-[10px] uppercase tracking-[0.25em] font-light block"
                  style={{ color: narrative.eyebrowColor }}
                >
                  {narrative.eyebrow} · SOLAR SYSTEM EXPLORER
                </span>
                <h2 className="text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1">
                  {activeTargetName}
                </h2>
              </div>
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {/* In-Depth Historical & Scientific Lore */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-light">
                Astronomical Lore & Physical Environment
              </span>
              <p className="text-xs leading-relaxed text-white/80 font-light">
                {narrative.extendedLore}
              </p>
            </div>

            {/* Sagittarius A* General Relativistic Horizon & Shadow Card */}
            {(activeTargetName === 'Sagittarius A*' || target?.category === 'black_hole') && (
              <div className="flex flex-col gap-2.5 pt-2 border-t border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium">
                    Relativistic Horizons & Metrics
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    EHT / NASA SVS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                  <span className="text-white/40">Mass (M)</span>
                  <span className="text-right text-amber-200 font-mono">
                    4.297 ± 0.012 × 10⁶ M☉
                  </span>

                  <span className="text-white/40">Schwarzschild Radius (r_s)</span>
                  <span className="text-right text-amber-200 font-mono">
                    12.69 × 10⁶ km (0.085 AU)
                  </span>

                  <span className="text-white/40">Photon Sphere (r_ph)</span>
                  <span className="text-right text-amber-200 font-mono">
                    1.5 r_s · 19.04 × 10⁶ km
                  </span>

                  <span className="text-white/40">Shadow Radius (r_shadow)</span>
                  <span className="text-right text-amber-200 font-mono">
                    2.60 r_s · 32.97 × 10⁶ km
                  </span>

                  <span className="text-white/40">EHT Shadow Diameter (θ)</span>
                  <span className="text-right text-amber-200 font-mono">
                    51.8 ± 2.3 µas
                  </span>

                  <span className="text-white/40">ISCO Radius (r_isco)</span>
                  <span className="text-right text-amber-200 font-mono">
                    3.0 r_s · 38.07 × 10⁶ km
                  </span>

                  <span className="text-white/40">ISCO Orbital Velocity</span>
                  <span className="text-right text-amber-200 font-mono">
                    0.408 c (122,400 km/s)
                  </span>

                  <span className="text-white/40">Galactic Center Distance</span>
                  <span className="text-right text-amber-200 font-mono">
                    8.277 kpc (26,990 ly)
                  </span>
                </div>

                {/* Relativistic Optical Physics Overview */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                    Relativistic Optical Phenomena:
                  </span>
                  <p>
                    • <strong className="text-amber-200 font-normal">Event Horizon Shadow:</strong> In the Schwarzschild metric every photon with impact parameter b Null-geodesic ray tracing confirms absolute photon capture for impact parameters b &lt; 2.598 r_s (3√3/2 r_s).lt; 3√3/2 r_s ≈ 2.598 r_s is captured.
                  </p>
                  <p>
                    • <strong className="text-amber-200 font-normal">Lensed Accretion Arches:</strong> Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs.
                  </p>
                  <p>
                    • <strong className="text-amber-200 font-normal">Relativistic Doppler Beaming:</strong> Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red.
                  </p>
                  <p>
                    • <strong className="text-amber-200 font-normal">Relativistic Polar Jets:</strong> Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths.
                  </p>
                  <p>
                    • <strong className="text-amber-200 font-normal">Nuclear S-Cluster:</strong> Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter.
                  </p>
                </div>
              </div>
            )}

            {/* Physical Dimensions */}
            {fullTargetDef && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-light">
                  Physical Dimensions
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-light">
                  <span className="text-white/40">Mean Radius</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.physical.meanRadiusKm.toLocaleString()} km
                  </span>

                  <span className="text-white/40">Surface Gravity</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.physical.gmKm3S2
                      ? `${(
                          (fullTargetDef.physical.gmKm3S2 * 1000) /
                          Math.pow(fullTargetDef.physical.meanRadiusKm, 2)
                        ).toFixed(2)} m/s²`
                      : '—'}
                  </span>

                  <span className="text-white/40">Sidereal Day</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.physical.rotationPeriodHours !== undefined
                      ? `${fullTargetDef.physical.rotationPeriodHours.toFixed(1)} h`
                      : 'Synchronous'}
                  </span>

                  <span className="text-white/40">Axial Tilt</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.physical.axialTiltDeg !== undefined
                      ? `${fullTargetDef.physical.axialTiltDeg.toFixed(2)}°`
                      : '0.00°'}
                  </span>
                </div>
              </div>
            )}

            {/* Keplerian Orbital Mechanics */}
            {fullTargetDef && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-light">
                  Keplerian Orbit (J2000)
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-light">
                  <span className="text-white/40">Semi-Major Axis</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.orbit.semiMajorAxisAU.toFixed(3)} AU
                  </span>

                  <span className="text-white/40">Eccentricity</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.orbit.eccentricity.toFixed(4)}
                  </span>

                  <span className="text-white/40">Orbital Period</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.orbit.orbitalPeriodDays > 730
                      ? `${(fullTargetDef.orbit.orbitalPeriodDays / 365.25).toFixed(2)} yr`
                      : `${fullTargetDef.orbit.orbitalPeriodDays.toFixed(1)} d`}
                  </span>

                  <span className="text-white/40">Inclination</span>
                  <span className="text-right text-white/90">
                    {fullTargetDef.orbit.inclinationDeg.toFixed(2)}°
                  </span>
                </div>
              </div>
            )}

            {/* Live Ephemeris Telemetry */}
            {target && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-light">
                  Live Ephemeris Telemetry
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-light">
                  <span className="text-white/40">Heliocentric Dist</span>
                  <span className="text-right text-white/90">
                    {target.distanceKm > 1e6
                      ? `${(target.distanceKm / 1e6).toFixed(2)}M km`
                      : `${Math.round(target.distanceKm).toLocaleString()} km`}
                  </span>

                  <span className="text-white/40">AU Distance</span>
                  <span className="text-right text-white/90">
                    {(target.distanceKm / 149597870.7).toFixed(3)} AU
                  </span>

                  <span className="text-white/40">Orbital Velocity</span>
                  <span className="text-right text-white/90">
                    {target.apparentSpeedKmS.toFixed(2)} km/s
                  </span>
                </div>
              </div>
            )}

            {/* Exploration History & Spacecraft */}
            {narrative.missions && narrative.missions.length > 0 && (
              <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-light">
                  Exploration Missions
                </span>
                <div className="flex flex-col gap-2.5">
                  {narrative.missions.map((m) => (
                    <div
                      key={m.name}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium tracking-[0.1em]">{m.name}</span>
                        <span className="text-[10px] text-white/40 font-light">
                          {m.year} · {m.agency}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 font-light">{m.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provenance Badge */}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]">
              <span>{fullTargetDef?.orbit.source ?? 'NASA JPL orbital elements'}</span>
              <span>Keplerian 2-Body Solver</span>
            </div>

            {/* Third-party data & image credits (required by CC BY / CC BY-SA licences) */}
            <p className="text-[10px] leading-relaxed font-light text-white/35">
              Textures: Solar System Scope (CC BY 4.0) · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) ·
              Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) ·
              Orbits: NASA JPL.{' '}
              <a
                href="https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                Full credits
              </a>
            </p>
          </aside>
        </div>
      )}

      {/* ========================================================
          7. FULL CELESTIAL CATALOGUE SLIDE-OVER DRAWER (42 BODIES + SGR A*)
          ======================================================== */}
      {isCatalogueOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsCatalogueOpen(false)}
            className="flex-1 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Side Drawer Panel */}
          <aside className="w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans">
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-extralight text-white tracking-[0.25em] uppercase">
                  Astronomical Catalogue
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] font-light text-white/40">
                  {allBodies.length} bodies · NASA JPL elements
                </span>
              </div>
              <button
                onClick={() => setIsCatalogueOpen(false)}
                className="text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5"
                aria-label="Close catalogue"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-white/35" />
                <input
                  type="text"
                  placeholder="FILTER BY NAME, CATEGORY..."
                  aria-label="Filter catalogue by name or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"
                />
              </div>

              {/* Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light">
                {(['all', 'planet', 'moon', 'minor'] as CatalogueFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCatalogueFilter(tab)}
                    aria-pressed={catalogueFilter === tab}
                    className={`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${
                      catalogueFilter === tab
                        ? 'bg-white/15 text-white font-normal border border-white/20'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {tab === 'all'
                      ? `All (${allBodies.length})`
                      : tab === 'planet'
                      ? 'Planets'
                      : tab === 'moon'
                      ? 'Moons'
                      : 'Minor'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bodies List */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1">
              {filteredBodies.map((b) => {
                const isSelected = activeTargetName === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => {
                      onSelectPlanet(b.name);
                      handleRevealMonograph();
                      setIsCatalogueOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                      isSelected
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: b.physical.colorHex || '#ffffff' }}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-light tracking-[0.15em] uppercase">{b.name}</span>
                        <span className="text-[10px] text-white/35 uppercase tracking-[0.1em]">
                          {b.category.replace('_', ' ')}
                          {b.parentName && ` · ${b.parentName}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-white/40 font-light tracking-wider">
                      <div>{b.physical.meanRadiusKm.toLocaleString()} km</div>
                      <div>{b.orbit.semiMajorAxisAU.toFixed(2)} AU</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
