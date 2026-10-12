import React, { useState, useMemo, useEffect } from 'react';
import { TelemetryData } from '../../rendering/SolarSystemScene';
import { CatalogueManager } from '../../data/CatalogueManager';
import { ScaleMode } from '../../rendering/RenderSpaceTransform';
import {
  Play,
  Pause,
  Search,
  Eye,
  EyeOff,
  X,
  RotateCcw,
  ChevronRight,
  Info,
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
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState<boolean>(false);
  const [catalogueFilter, setCatalogueFilter] = useState<CatalogueFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(utcIso.slice(0, 10));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  // Global keyboard shortcuts for immersion
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
        setIsCatalogueOpen(false);
        setIsDetailsOpen(false);
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
  }, [onTogglePlay, onToggleOrbits, onToggleConstellations, onToggleAsteroidBelt]);

  // Sync date input when paused or significant shift
  useEffect(() => {
    setDateInput(utcIso.slice(0, 10));
  }, [utcIso]);

  const allBodies = useMemo(() => CatalogueManager.getAllBodies(), []);
  const majorPlanets = useMemo(() => CatalogueManager.getPlanets(), []);

  const fullTargetDef = useMemo(() => {
    if (!target) return null;
    return CatalogueManager.getBody(target.name);
  }, [target]);

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
    const parsed = Date.parse(dateInput);
    if (!isNaN(parsed)) {
      onSeekDate(parsed);
      setIsDatePickerOpen(false);
    }
  };

  // Speed steps
  const speedSteps = [
    { label: 'Realtime', val: 1 },
    { label: '10×', val: 10 },
    { label: '100×', val: 100 },
    { label: '1 day/s', val: 86400 },
    { label: '1 mo/s', val: 2592000 },
    { label: '1 yr/s', val: 31536000 },
  ];

  if (!isHudVisible) {
    return (
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsHudVisible(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/50 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur border border-white/10 rounded-full transition"
        >
          <Eye size={13} />
          <span>Show Interface (H)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 z-20 font-sans text-white/90">
      
      {/* ========================================================
          1. TOP EDITORIAL BAR
          ======================================================== */}
      <header className="flex justify-between items-start pointer-events-auto w-full">
        {/* Masthead & Live Astronomical Ephemeris Time */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-3.5">
            <h1 className="text-xl font-serif tracking-[0.28em] text-white/95 uppercase drop-shadow-sm">
              Solaris
            </h1>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-mono">
              Scientific Solar System Explorer
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/50">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-white/80">{utcIso.replace('T', ' ').slice(0, 19)} UTC</span>
            <span className="text-white/20">·</span>
            <span>JD {julianDate.toFixed(3)}</span>
            <span className="text-white/20">·</span>
            <span className="text-white/40">ICRF J2000.0</span>
          </div>
        </div>

        {/* Global Controls & Astronomy Layer Toggles */}
        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[11px] font-mono">
            <button
              onClick={onToggleOrbits}
              className={`px-3 py-1 rounded-full transition ${
                orbitsOn
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Orbits
            </button>
            <button
              onClick={onToggleConstellations}
              className={`px-3 py-1 rounded-full transition ${
                constellationsOn
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Stars
            </button>
            <button
              onClick={onToggleAsteroidBelt}
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
          <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[11px] font-mono">
            <button
              onClick={() => onSetScaleMode('exploration')}
              className={`px-3 py-1 rounded-full transition ${
                scaleMode === 'exploration'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Exploration
            </button>
            <button
              onClick={() => onSetScaleMode('scientific')}
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
            onClick={() => setIsCatalogueOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[11px] font-mono text-white/80 transition"
          >
            <Search size={12} className="text-white/50" />
            <span>Catalogue (42)</span>
          </button>

          {/* System Overview Reset */}
          <button
            onClick={onResetView}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[11px] font-mono text-white/80 transition"
          >
            <RotateCcw size={11} className="text-white/50" />
            <span>Overview</span>
          </button>

          {/* Hide UI (H) */}
          <button
            onClick={() => setIsHudVisible(false)}
            title="Hide Interface (H)"
            className="p-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition"
          >
            <EyeOff size={13} />
          </button>
        </div>
      </header>

      {/* ========================================================
          2. CONTEXTUAL TARGET MONOGRAPH (RIGHT DRAWER/CARD)
          ======================================================== */}
      {target && fullTargetDef && isDetailsOpen && (
        <aside className="absolute top-20 right-6 w-80 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 text-xs shadow-2xl transition-all">
          
          {/* Header & Close */}
          <div className="flex justify-between items-start border-b border-white/10 pb-3">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-white/40">
                {fullTargetDef.category.replace('_', ' ')}
                {fullTargetDef.parentName && ` · ${fullTargetDef.parentName} system`}
              </div>
              <h2 className="text-2xl font-serif text-white tracking-wide mt-0.5">
                {fullTargetDef.name}
              </h2>
            </div>
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="text-white/30 hover:text-white transition p-1"
            >
              <X size={15} />
            </button>
          </div>

          {/* Astrophysical Overview Description */}
          <p className="text-[11px] leading-relaxed text-white/70 font-sans">
            {fullTargetDef.description}
          </p>

          {/* Section: Physical Dimensions */}
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5 font-mono">
            <span className="text-[10px] tracking-widest uppercase text-white/35">
              Physical Dimensions
            </span>
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
              <span className="text-white/40">Mean Radius</span>
              <span className="text-right text-white/90">
                {fullTargetDef.physical.meanRadiusKm.toLocaleString()} km
              </span>

              <span className="text-white/40">Surface Gravity</span>
              <span className="text-right text-white/90">
                {fullTargetDef.physical.gmKm3S2
                  ? `${(fullTargetDef.physical.gmKm3S2 * 1000 / Math.pow(fullTargetDef.physical.meanRadiusKm, 2)).toFixed(2)} m/s²`
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

          {/* Section: Keplerian Orbital Elements */}
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5 font-mono">
            <span className="text-[10px] tracking-widest uppercase text-white/35">
              Keplerian Orbit (J2000)
            </span>
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
              <span className="text-white/40">Semi-Major Axis</span>
              <span className="text-right text-white/90">
                {fullTargetDef.orbit.semiMajorAxisAU.toFixed(3)} AU
              </span>

              <span className="text-white/40">Eccentricity</span>
              <span className="text-right text-white/90">
                {fullTargetDef.orbit.eccentricity.toFixed(4)}
              </span>

              <span className="text-white/40">Period</span>
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

          {/* Section: Live Ephemeris Telemetry */}
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5 font-mono">
            <span className="text-[10px] tracking-widest uppercase text-white/35">
              Real-Time Ephemeris
            </span>
            <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
              <span className="text-white/40">Sun Distance</span>
              <span className="text-right text-white/90">
                {target.distanceKm > 1e6
                  ? `${(target.distanceKm / 1e6).toFixed(2)}M km`
                  : `${Math.round(target.distanceKm).toLocaleString()} km`}
              </span>

              <span className="text-white/40">AU Distance</span>
              <span className="text-right text-white/90">
                {(target.distanceKm / 149597870.7).toFixed(3)} AU
              </span>

              <span className="text-white/40">Velocity</span>
              <span className="text-right text-white/90">
                {target.apparentSpeedKmS.toFixed(2)} km/s
              </span>
            </div>
          </div>

          {/* Provenance Badge */}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/35">
            <span>NASA JPL DE440</span>
            <span>IAU WGS · EXACT</span>
          </div>
        </aside>
      )}

      {/* Re-open Target Details Button if closed */}
      {target && !isDetailsOpen && (
        <button
          onClick={() => setIsDetailsOpen(true)}
          className="absolute top-20 right-6 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-white/70 hover:text-white transition shadow-lg"
        >
          <Info size={13} />
          <span>{target.name} Info</span>
        </button>
      )}

      {/* ========================================================
          3. BOTTOM TIMELINE SCRUBBER & CELESTIAL NAVIGATOR
          ======================================================== */}
      <footer className="flex flex-col items-center gap-3 w-full pointer-events-auto">
        
        {/* Subtle Horizontal Timeline Controller */}
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono shadow-xl">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="p-1 text-white/70 hover:text-white transition rounded-full"
            title="Space to toggle play"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>

          {/* Speed selector steps */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-3">
            {speedSteps.map((step) => {
              const active = !isPaused && multiplier === step.val;
              return (
                <button
                  key={step.label}
                  onClick={() => onSetTimeMultiplier(step.val)}
                  className={`px-2 py-0.5 rounded-full text-[11px] transition ${
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
          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3 text-[11px]">
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
              <Calendar size={11} />
              <span>{dateInput}</span>
            </button>
          </div>
        </div>

        {/* Date Jump Modal Popover */}
        {isDatePickerOpen && (
          <form
            onSubmit={handleDateSubmit}
            className="flex items-center gap-2 bg-black/80 backdrop-blur border border-white/15 rounded-lg px-3 py-2 text-xs font-mono shadow-2xl"
          >
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
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

        {/* Bottom Planetary Dock (Sun + 8 Major Planets) */}
        <nav className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-xs font-mono shadow-2xl">
          {/* Sun */}
          <button
            onClick={() => onSelectPlanet('Sun')}
            className={`px-3 py-1 rounded-full transition flex items-center gap-1.5 ${
              target?.name === 'Sun'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30 font-medium'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Sun</span>
          </button>

          {/* 8 Planets */}
          {majorPlanets.map((planet) => {
            const isSelected = target?.name === planet.name;
            return (
              <button
                key={planet.name}
                onClick={() => onSelectPlanet(planet.name)}
                className={`px-3 py-1 rounded-full transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white/20 text-white font-medium shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: planet.physical.colorHex || '#ffffff' }}
                />
                <span>{planet.name}</span>
              </button>
            );
          })}

          {/* Drawer trigger for moons, asteroids, and minor bodies */}
          <button
            onClick={() => setIsCatalogueOpen(true)}
            className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white border-l border-white/10 pl-3 pr-2 py-1 transition"
          >
            <span>More (33)</span>
            <ChevronRight size={12} />
          </button>
        </nav>
      </footer>

      {/* ========================================================
          4. FULL CELESTIAL CATALOGUE SLIDE-OVER DRAWER
          ======================================================== */}
      {isCatalogueOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsCatalogueOpen(false)}
            className="flex-1 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Side Drawer Panel */}
          <div className="w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-serif text-white tracking-wide">
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
                    {tab === 'all' ? 'All (42)' : tab === 'planet' ? 'Planets' : tab === 'moon' ? 'Moons' : 'Minor'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bodies List */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1">
              {filteredBodies.map((b) => {
                const isSelected = target?.name === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => {
                      onSelectPlanet(b.name);
                      setIsCatalogueOpen(false);
                      setIsDetailsOpen(true);
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
          </div>
        </div>
      )}
    </div>
  );
};
