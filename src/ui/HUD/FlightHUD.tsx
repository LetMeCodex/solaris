import React, { useState, useMemo, useEffect } from 'react';
import { TelemetryData } from '../../rendering/SolarSystemScene';
import { CatalogueManager } from '../../data/CatalogueManager';
import { ScaleMode } from '../../rendering/RenderSpaceTransform';
import { getPlanetNarrative, PLANET_NARRATIVES } from '../../data/PlanetNarratives';
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
}

type CatalogueFilter = 'all' | 'planet' | 'moon' | 'minor';

// Reference navigation order: Pluto at top down to Mercury at bottom, plus Sun
const REFERENCE_NAV_ORDER = [
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
        } else {
          onResetView();
        }
      } else if (e.key === 'o' || e.key === 'O') {
        onToggleOrbits?.();
      } else if (e.key === 'c' || e.key === 'C') {
        onToggleConstellations?.();
      } else if (e.key === 'b' || e.key === 'B') {
        onToggleAsteroidBelt?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onTogglePlay,
    onToggleOrbits,
    onToggleConstellations,
    onToggleAsteroidBelt,
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
  const allBodies = useMemo(() => CatalogueManager.getAllBodies(), []);
  const fullTargetDef = useMemo(() => CatalogueManager.getBody(activeTargetName), [activeTargetName]);

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
    { label: '1 d/s', val: 86400 },
    { label: '1 m/s', val: 2592000 },
    { label: '1 y/s', val: 31536000 },
  ];

  const baseUrl = import.meta.env.BASE_URL || '/';

  if (!isHudVisible) {
    return (
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsHudVisible(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition"
        >
          <Eye size={13} />
          <span>Show Interface (H)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 z-20 font-sans text-white/90 overflow-hidden">
      
      {/* ========================================================
          1. TOP CENTER SUBTLE CORONA ARC
          ======================================================== */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* ========================================================
          2. TOP BAR CONTROLS & EPHEMERIS READOUT
          ======================================================== */}
      <header className="flex justify-between items-start pointer-events-auto w-full z-30">
        {/* Top-Left: Masthead & Live Ephemeris Time */}
        <div
          className={`flex flex-col gap-1.5 transition-all duration-1000 ${
            introPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex flex-col">
            <h1 className="text-xs uppercase tracking-[0.45em] text-white/90 font-light drop-shadow">
              Solar Explorer
            </h1>
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/35 font-light">
              Interactive 3D Planetary Simulation
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/50 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg w-fit mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-white/80">{utcIso.replace('T', ' ').slice(0, 19)} UTC</span>
            <span className="text-white/20">·</span>
            <span>JD {julianDate.toFixed(2)}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/40">ICRF J2000</span>
          </div>
        </div>

        {/* Top-Right: Astronomical Layer Toggles & Catalogue Trigger */}
        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[11px] font-mono shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleOrbits?.();
              }}
              title="Toggle Orbit Lines (O)"
              className={`px-3 py-1 rounded-full transition ${
                orbitsOn
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Orbits
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleConstellations?.();
              }}
              title="Toggle IAU Constellations (C)"
              className={`px-3 py-1 rounded-full transition ${
                constellationsOn
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
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
              className={`px-3 py-1 rounded-full transition ${
                asteroidBeltOn
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Belt
            </button>
          </div>

          {/* Scale mode toggle */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[11px] font-mono shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetScaleMode('exploration');
              }}
              className={`px-3 py-1 rounded-full transition ${
                scaleMode === 'exploration'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Exploration
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetScaleMode('scientific');
              }}
              className={`px-3 py-1 rounded-full transition ${
                scaleMode === 'scientific'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Scientific 1:1
            </button>
          </div>

          {/* Catalogue Index Drawer Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCatalogueOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[11px] font-mono text-white/80 transition shadow-lg"
          >
            <Search size={11} className="text-white/50" />
            <span>Catalogue (42)</span>
          </button>

          {/* System Overview Reset */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetView();
            }}
            title="Reset to System Overview"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[11px] font-mono text-white/80 transition shadow-lg"
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
        className={`absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto transition-all duration-1000 z-30 ${
          introPhase >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
      >
        {REFERENCE_NAV_ORDER.map((planetName) => {
          const itemNarrative = PLANET_NARRATIVES[planetName];
          const isSelected = activeTargetName === planetName;
          const thumbUrl = `${baseUrl}${itemNarrative?.textureThumb || 'textures/2k_moon.jpg'}`;

          return (
            <button
              key={planetName}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet(planetName);
              }}
              className="flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus:outline-none"
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
                  className={`text-[9px] font-mono tracking-wider transition-colors duration-200 ${
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
          ======================================================== */}
      <section
        className={`absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 flex flex-col items-center text-center max-w-2xl px-6 pointer-events-auto select-none transition-all duration-1000 z-20 ${
          introPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500">
          {activeTargetName}
        </h2>

        {/* Editorial Description Paragraph */}
        <p className="text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500">
          {narrative.monographText}
        </p>

        {/* READ MORE Button with Accent Underline */}
        <button
          onClick={() => setIsReadMoreOpen(true)}
          className="group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus:outline-none"
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
      </section>

      {/* ========================================================
          5. BOTTOM TIMELINE CONTROLLER & DATE CONTROLS
          ======================================================== */}
      <footer className="flex flex-col items-center gap-2 w-full pointer-events-auto z-30">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-xs font-mono shadow-xl">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="p-1 text-white/70 hover:text-white transition rounded-full"
            title="Space to toggle play"
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>

          {/* Speed selector steps */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            {speedSteps.map((step) => {
              const active = !isPaused && multiplier === step.val;
              return (
                <button
                  key={step.label}
                  onClick={() => onSetTimeMultiplier(step.val)}
                  className={`px-2 py-0.5 rounded-full text-[10px] transition ${
                    active
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>

          {/* Epoch Shortcuts */}
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px]">
            <button
              onClick={onResetToJ2000}
              className="text-white/40 hover:text-white px-1.5 py-0.5 rounded transition"
            >
              J2000
            </button>
            <button
              onClick={onResetToNow}
              className="text-white/40 hover:text-white px-1.5 py-0.5 rounded transition"
            >
              Now
            </button>
            
            {/* Date Picker Trigger */}
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
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
            className="flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-lg px-3 py-2 text-xs font-mono shadow-2xl"
          >
            <input
              type="date"
              value={dateInput}
              onFocus={() => setIsEditingDate(true)}
              onChange={(e) => {
                setIsEditingDate(true);
                setDateInput(e.target.value);
              }}
              onBlur={() => setIsEditingDate(false)}
              className="bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-xs"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded transition text-[11px]"
            >
              Jump
            </button>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(false)}
              className="p-1 text-white/40 hover:text-white"
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
                  className="text-[10px] uppercase font-mono tracking-widest block"
                  style={{ color: narrative.eyebrowColor }}
                >
                  {narrative.eyebrow} · SOLAR SYSTEM EXPLORER
                </span>
                <h2 className="text-3xl font-light text-white tracking-[0.25em] uppercase mt-1">
                  {activeTargetName}
                </h2>
              </div>
              <button
                onClick={() => setIsReadMoreOpen(false)}
                className="text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* In-Depth Historical & Scientific Lore */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono">
                Astronomical Lore & Physical Environment
              </span>
              <p className="text-xs leading-relaxed text-white/80 font-light">
                {narrative.extendedLore}
              </p>
            </div>

            {/* Physical Dimensions */}
            {fullTargetDef && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono">
                <span className="text-[10px] tracking-widest uppercase text-white/40">
                  Physical Dimensions
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
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
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono">
                <span className="text-[10px] tracking-widest uppercase text-white/40">
                  Keplerian Orbit (J2000)
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
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
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10 font-mono">
                <span className="text-[10px] tracking-widest uppercase text-white/40">
                  Live Ephemeris Telemetry
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
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
                <span className="text-[10px] tracking-widest uppercase text-white/40 font-mono">
                  Exploration Missions
                </span>
                <div className="flex flex-col gap-2.5">
                  {narrative.missions.map((m) => (
                    <div
                      key={m.name}
                      className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium">{m.name}</span>
                        <span className="text-[10px] font-mono text-white/40">
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
            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/30">
              <span>NASA JPL SSD Horizons DE440</span>
              <span>Keplerian 2-Body Solver</span>
            </div>
          </aside>
        </div>
      )}

      {/* ========================================================
          7. FULL CELESTIAL CATALOGUE SLIDE-OVER DRAWER (42 BODIES)
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
                <h3 className="text-lg font-light text-white tracking-[0.15em] uppercase">
                  Astronomical Catalogue
                </h3>
                <span className="text-[11px] font-mono text-white/40">
                  42 bodies · NASA JPL DE440
                </span>
              </div>
              <button
                onClick={() => setIsCatalogueOpen(false)}
                className="text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-white/35" />
                <input
                  type="text"
                  placeholder="Filter by name, parent, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white placeholder-white/30 text-xs outline-none focus:border-white/30"
                />
              </div>

              {/* Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {(['all', 'planet', 'moon', 'minor'] as CatalogueFilter[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCatalogueFilter(tab)}
                    className={`py-1 rounded text-center uppercase tracking-wider transition ${
                      catalogueFilter === tab
                        ? 'bg-white/15 text-white font-medium'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {tab === 'all'
                      ? 'All (42)'
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
                      setIsCatalogueOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition text-left font-mono ${
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
                        <span className="text-xs text-white font-sans">{b.name}</span>
                        <span className="text-[10px] text-white/35 capitalize">
                          {b.category.replace('_', ' ')}
                          {b.parentName && ` · ${b.parentName}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-white/40">
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
