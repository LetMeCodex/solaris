import { SurfaceAction } from './ui/HUD/SurfacePanel';
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { SolarSystemScene, TelemetryData } from './rendering/SolarSystemScene';
import { FlightHUD } from './ui/HUD/FlightHUD';
import { JetHUD } from './flight/JetHUD';
import { AIRFRAMES, chosenAirframe } from './flight/JetModel';
import { FpsCounter } from './ui/FpsCounter';
import { LensProfileName } from './rendering/LensPipeline';
import type { ComparisonPropKind } from './rendering/SpacecraftFactory';
import { Preloader } from './ui/Preloader';
import { voice, chime } from './companion/voice';
import { music } from './audio/music';
import { settings } from './ui/settings';
import type { Postcard } from './data/Postcards';
import { CatalogueManager } from './data/CatalogueManager';
import { saveShot } from './ui/HUD/shots';
import { FlyPreloader, type PreflightItem } from './fly/FlyPreloader';
import { enterFullscreen } from './ui/fullscreen';

const SITE_URL = import.meta.env.BASE_URL;
const FLY_URL = `${import.meta.env.BASE_URL}fly/`;
const DAY_MS = 86_400_000;

/**
 * Preserve the UTC calendar date of `anchorUtcMs` while keeping the sunlit UTC time-of-day from
 * `candidateUtcMs`. Prevents Earth landmark teleports/landings from advancing the simulation date
 * by multiple days (e.g. 2026-11-20 -> 2026-11-23) while retaining identical solar elevation.
 */
export function preserveCalendarDateUtcMs(anchorUtcMs: number, candidateUtcMs: number): number {
  const anchorDayStart = Math.floor(anchorUtcMs / DAY_MS) * DAY_MS;
  const timeOfDayMs = ((candidateUtcMs % DAY_MS) + DAY_MS) % DAY_MS;
  return anchorDayStart + timeOfDayMs;
}

/**
 * `site`: the observatory (the Solar System, the opening orrery). `fly`: the fly page, straight
 * into the jet over Earth behind its own opening, revealed only when everything has loaded.
 */
export const App: React.FC<{ mode?: 'site' | 'fly' }> = ({ mode = 'site' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SolarSystemScene | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  // Opening sequence: progress of the asset warm-up, then the reveal
  const [load, setLoad] = useState<{ progress: number; stage: string; done: boolean }>({ progress: 0, stage: 'Waking the observatory', done: false });
  const [revealed, setRevealed] = useState(false);      // iris opening: HUD powers on with it
  const [introFinished, setIntroFinished] = useState(false); // iris fully open
  const [jetActive, setJetActive] = useState(false);     // flying the jet (src/flight)
  const [landedAt, setLandedAt] = useState<string | null>(null); // landed at a landmark from the jet
  const [comparisonKind, setComparisonKind] = useState<ComparisonPropKind>('none');
  const [scienceOverlaysOn, setScienceOverlaysOn] = useState<boolean>(false);
  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleBegin = useCallback((withVoice: boolean) => {
    voice.enabled = withVoice;
    settings.set({ velaVoice: withVoice });
    voice.unlock();
    enterFullscreen();
    chime('open');
    // The soundtrack starts softly with the journey ("in silence" leaves the needle up)
    if (withVoice) music.start();
  }, []);
  const handleRevealed = useCallback(() => {
    setRevealed(true);
    setIntroFinished(true);
  }, []);

  // --- The fly page: start the jet behind the opening, reveal when everything has loaded
  const [fly, setFly] = useState<{ start: string; ll: { lat: number; lon: number } | null; items: PreflightItem[]; progress: number; ready: boolean; log: string[]; tiles: number }>({ start: '', ll: null, items: [], progress: 0, ready: false, log: [], tiles: 0 });
  const landedRef = useRef<string | null>(null);
  landedRef.current = landedAt;
  const loadRef = useRef(load);
  loadRef.current = load;
  const lastEarthClockMsRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode !== 'fly') return;
    let start = '';
    let ll: { lat: number; lon: number } | null = null;
    let startedAt = 0;
    let quietSince = 0;
    let ready = false;
    let peakPending = 1;
    // The stream log: real events, as they happen (the observatory's stages, the aircraft, the
    // tiles of the start arriving)
    const log: string[] = [];
    const say = (line: string): void => {
      const t = ((performance.now() - t0) / 1000).toFixed(1).padStart(5, ' ');
      log.push(`${t}s  ${line}`);
      if (log.length > 6) log.shift();
    };
    const t0 = performance.now();
    let lastStage = '';
    let aircraftSaid = false;
    let lastTiles = 0;
    let lastTileSay = 0;
    const TOUR = ['cockpit', 'gopro', 'flyby'] as const;
    let tourStep = -1;
    let tourAt = 0;
    let tourHome: (typeof TOUR)[number] | 'chase' = 'chase';
    const id = window.setInterval(() => {
      const now = performance.now();
      const load = loadRef.current;
      const sc = sceneRef.current;
      if (!load.done && load.stage && load.stage !== lastStage) {
        lastStage = load.stage;
        say(`observatory  ${Math.round(load.progress * 100)}%  ${load.stage}`);
      }
      if (sc && !ready) {
        // Keep full 60 Hz tile streaming & GPU upload pumping behind FlyPreloader so the entire
        // city/country blanket loads completely before ENGAGE unlocks!
        sc.drawEvery = 1;
        sc.compileGate = 'hold';
      }
      if (load.done && sc && !startedAt) {
        say('observatory  textures uploaded · shaders compiled');
        const st = sc.startFlyPage();
        start = st?.name ?? '';
        ll = st ? { lat: st.lat, lon: st.lon } : null;
        startedAt = now;
        if (st) say(`take-off  ${st.name}  ${Math.abs(st.lat).toFixed(3)}°${st.lat >= 0 ? 'N' : 'S'} ${Math.abs(st.lon).toFixed(3)}°${st.lon >= 0 ? 'E' : 'W'} · Sun high there now`);
      }
      const r = sc?.flyReadiness() ?? {
        jet: false,
        aircraft: false,
        tilesPending: 0,
        tilesVisible: 0,
        detailedTiles: 0,
        source: 'none' as const,
        spawnTilesReady: false,
      };
      const airframeName = sc?.jet.airframe.anchors.name ?? AIRFRAMES[chosenAirframe()].anchors.name;
      if (r.aircraft && !aircraftSaid) {
        aircraftSaid = true;
        say(`airframe  ${airframeName} glTF decoded · cockpit lit · displays live`);
      }
      // Behind the film, briefly touch each camera view so cockpit/GoPro shaders warm up rapidly (~200ms/view)
      if (sc && r.aircraft && r.jet && tourStep < TOUR.length && now - tourAt > 200) {
        if (tourStep === -1) tourHome = sc.jet.view;
        tourStep++;
        tourAt = now;
        sc.jet.view = tourStep < TOUR.length ? TOUR[tourStep] : tourHome;
      }
      if (startedAt > 0 && now - lastTileSay > 700 && (r.tilesVisible !== lastTiles || r.tilesPending > 0)) {
        lastTileSay = now;
        const d = r.tilesVisible - lastTiles;
        lastTiles = r.tilesVisible;
        const srcTag = r.source === 'surface' ? 'earth surface tiles' : 'google 3d tiles';
        say(`${srcTag}  ${d >= 0 ? '+' : ''}${d} drawn · ${r.tilesVisible} visible · ${r.tilesPending} streaming`);
      }
      const streaming = startedAt > 0 && r.jet;
      peakPending = Math.max(peakPending, r.tilesPending);
      const isCompactFly = typeof window !== 'undefined' && (window.innerWidth < 820 || window.innerHeight < 480);
      const targetDetailed = isCompactFly ? 6 : 14;
      const settleDetailed = isCompactFly ? 4 : 10;
      const tilesFrac = !streaming
        ? 0
        : r.spawnTilesReady
          ? 1
          : r.tilesVisible === 0
            ? 0.08
            : Math.min(1, Math.max(1 - r.tilesPending / Math.max(peakPending, 36), Math.min(0.96, Math.max(r.detailedTiles / targetDetailed, r.tilesVisible / (targetDetailed * 2.2)))));
      if (streaming && r.detailedTiles >= settleDetailed && r.tilesVisible >= settleDetailed * 2) quietSince ||= now;
      else quietSince = 0;
      const settled = quietSince > 0 && now - quietSince > 1100;
      const enoughTiles = Boolean(r.spawnTilesReady) || (r.detailedTiles >= targetDetailed && r.tilesVisible >= targetDetailed * 2);
      // Generous 11.5s pre-warm window so the full city/country blanket is 100% loaded before ENGAGE
      const timedOut = startedAt > 0 && now - startedAt > 11500;
      const toured = tourStep >= TOUR.length;
      ready = ready || (load.done && r.jet && r.aircraft && ((toured && (enoughTiles || settled)) || timedOut));
      if (ready && sc && tourStep >= 0 && tourStep < TOUR.length) {
        sc.jet.view = tourHome;
      }
      const progress = (load.done ? 0.4 : load.progress * 0.4) + (r.aircraft ? 0.12 : 0) + (r.jet ? 0.08 : 0) + 0.4 * (ready ? 1 : tilesFrac * 0.97);
      const items: PreflightItem[] = [
        { label: 'OBSERVATORY', detail: load.done ? 'textures · shaders ready' : `${Math.round(load.progress * 100)}% · ${load.stage}`, done: load.done },
        { label: 'AIRFRAME', detail: r.aircraft ? `${airframeName} · cockpit lit` : `loading ${airframeName}`, done: r.aircraft },
        { label: 'EARTH 3D', detail: !streaming ? 'waiting for the observatory' : ready ? `${r.tilesVisible} tiles over ${start}` : `${r.tilesVisible} in · ${r.tilesPending} streaming`, done: ready },
        { label: 'SKY', detail: r.jet ? 'live weather · Sun at this hour' : 'standing by', done: r.jet && ready },
      ];
      if (ready && log[log.length - 1]?.indexOf('cleared') === -1) say(`ready  ${r.tilesVisible} tiles · cleared for take-off`);
      setFly({ start, ll, items, progress, ready, log: [...log], tiles: ready ? 1 : tilesFrac });
      if (ready) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [mode]);

  const handleEngage = useCallback(() => {
    enterFullscreen();
    voice.unlock();
    chime('open');
    const sc = sceneRef.current;
    if (sc) {
      sc.jet.hold = false;
      sc.drawEvery = 1;
      // Live: anything new (the cockpit's parts the first time you look) waits a few frames for its
      // shaders instead of freezing the flight
      sc.compileGate = 'hide';
    }
    setRevealed(true);
  }, []);
  const handleFlyFinished = useCallback(() => setIntroFinished(true), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // Sync Three.js canvas when container dimensions or mobile browser visualViewport chrome change
    let lastW = container.clientWidth || window.innerWidth;
    let lastH = container.clientHeight || window.innerHeight;
    let resizeRaf = 0;
    const triggerSceneResize = (): void => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        const w = container.clientWidth || window.visualViewport?.width || window.innerWidth;
        const h = container.clientHeight || window.visualViewport?.height || window.innerHeight;
        if (Math.abs(w - lastW) >= 1 || Math.abs(h - lastH) >= 1) {
          lastW = w;
          lastH = h;
          window.dispatchEvent(new Event('resize'));
        }
      });
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(triggerSceneResize) : null;
    ro?.observe(container);
    window.visualViewport?.addEventListener('resize', triggerSceneResize);

    // Instantiate core Three.js scene (pass { mode } so /fly/ skips deep-space preloading)
    const scene = new SolarSystemScene(
      container,
      (data) => {
        setTelemetry(data);
        const curMs = sceneRef.current?.clock.getUtcMs() ?? (data.utcIso ? Date.parse(data.utcIso) : NaN);
        if (Number.isFinite(curMs) && (lastEarthClockMsRef.current === null || Math.abs(curMs - lastEarthClockMsRef.current) < 6 * 3600_000)) {
          lastEarthClockMsRef.current = curMs;
        }
      },
      { mode },
    );
    sceneRef.current = scene;
    lastEarthClockMsRef.current = scene.clock.getUtcMs();
    (window as unknown as { __solarisScene?: SolarSystemScene }).__solarisScene = scene;
    // The jet reports every frame; React only needs to know when it takes off or lands
    let jetWas = false;
    let exitTimer: number | null = null;
    scene.onJetLanding = (lm) => {
      if (lm && lm.body === 'Earth' && lastEarthClockMsRef.current !== null) {
        const afterMs = scene.clock.getUtcMs();
        if (Math.floor(afterMs / DAY_MS) !== Math.floor(lastEarthClockMsRef.current / DAY_MS)) {
          const snapped = preserveCalendarDateUtcMs(lastEarthClockMsRef.current, afterMs);
          scene.clock.setUtcMs(snapped);
          lastEarthClockMsRef.current = snapped;
        }
      }
      setLandedAt(lm ? lm.name : null);
    };
    const unsubJet = scene.jet.subscribe((t) => {
      if (t.active !== jetWas) {
        jetWas = t.active;
        setJetActive(t.active);
        if (t.active && exitTimer !== null) {
          window.clearTimeout(exitTimer);
          exitTimer = null;
        }
        // The fly page is the jet: leaving it (not landing) goes back to the observatory
        if (!t.active && mode === 'fly') {
          if (exitTimer !== null) window.clearTimeout(exitTimer);
          exitTimer = window.setTimeout(() => {
            exitTimer = null;
            if (!landedRef.current && !jetWas) window.location.assign(SITE_URL);
          }, 400);
        }
      }
    });
    // Load every texture and compile every shader up front (no first-use stalls later)
    scene
      .warmUp((progress, stage) => setLoad((l) => (l.done ? l : { progress, stage, done: false })))
      .catch((err) => console.warn('[Solaris] warm-up incomplete:', err))
      .finally(() => setLoad((l) => ({ ...l, progress: 1, stage: 'Ready', done: true })));

    // Debug / automation handle (used by visual checks)
    (window as unknown as { __solaris_scene?: SolarSystemScene }).__solaris_scene = scene;

    return () => {
      delete (window as unknown as { __solaris_scene?: SolarSystemScene }).__solaris_scene;
      if (exitTimer !== null) {
        window.clearTimeout(exitTimer);
        exitTimer = null;
      }
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      ro?.disconnect();
      window.visualViewport?.removeEventListener('resize', triggerSceneResize);
      unsubJet();
      scene.dispose();
      sceneRef.current = null;
    };
  }, [mode]);

  const handleSelectPlanet = useCallback((name: string) => {
    sceneRef.current?.selectBody(name);
  }, []);

  // Display-rate camera state for the HUD instruments (read on requestAnimationFrame)
  const getView = useCallback(() => sceneRef.current?.getViewState(), []);

  const handleResetView = useCallback(() => {
    sceneRef.current?.resetView();
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!sceneRef.current) return;
    const currentPaused = sceneRef.current.clock.isPaused;
    sceneRef.current.clock.isPaused = !currentPaused;
  }, []);

  const handleSetTimeMultiplier = useCallback((multiplier: number) => {
    if (!sceneRef.current) return;
    sceneRef.current.clock.timeMultiplier = multiplier;
    sceneRef.current.clock.isPaused = false;
  }, []);

  const handleSeekDate = useCallback((utcMs: number) => {
    sceneRef.current?.clock.setUtcMs(utcMs);
    lastEarthClockMsRef.current = utcMs;
  }, []);

  const handleResetToJ2000 = useCallback(() => {
    sceneRef.current?.clock.resetToJ2000();
    if (sceneRef.current) lastEarthClockMsRef.current = sceneRef.current.clock.getUtcMs();
  }, []);

  const handleResetToNow = useCallback(() => {
    sceneRef.current?.clock.resetToNow();
    if (sceneRef.current) lastEarthClockMsRef.current = sceneRef.current.clock.getUtcMs();
  }, []);

  const handleToggleConstellations = useCallback(() => {
    sceneRef.current?.toggleConstellations();
  }, []);

  const handleToggleAsteroidBelt = useCallback(() => {
    sceneRef.current?.toggleAsteroidBelt();
  }, []);

  const handleToggleOrbits = useCallback(() => {
    sceneRef.current?.toggleOrbits();
  }, []);

  const handleSetLens = useCallback((name: LensProfileName) => {
    sceneRef.current?.setLensProfile(name);
  }, []);

  const handleSetBloom = useCallback((gain: number) => {
    sceneRef.current?.setBloomGain(gain);
  }, []);

  const handleFlyToLandmark = useCallback((id: string) => {
    const sc = sceneRef.current;
    if (!sc) return;
    const beforeMs = sc.clock.getUtcMs();
    const lm = sc.flyToLandmark(id);
    if (lm?.body === 'Earth') {
      const afterMs = sc.clock.getUtcMs();
      if (Math.floor(afterMs / DAY_MS) !== Math.floor(beforeMs / DAY_MS)) {
        sc.clock.setUtcMs(preserveCalendarDateUtcMs(beforeMs, afterMs));
      }
      lastEarthClockMsRef.current = sc.clock.getUtcMs();
    }
  }, []);

  const handleExplorerDaylight = useCallback((on: boolean) => {
    sceneRef.current?.setExplorerDaylight(on);
  }, []);

  const handleSurface = useCallback((a: SurfaceAction) => {
    const sc = sceneRef.current;
    if (!sc) return;
    switch (a.type) {
      case 'enter': {
        const beforeMs = sc.clock.getUtcMs();
        sc.enterSurface();
        const isEarthSurface = sc.getExplorerStatus().body === 'Earth' || sc.selectedBodyName() === 'Earth';
        if (isEarthSurface) {
          const afterMs = sc.clock.getUtcMs();
          if (Math.floor(afterMs / DAY_MS) !== Math.floor(beforeMs / DAY_MS)) {
            sc.clock.setUtcMs(preserveCalendarDateUtcMs(beforeMs, afterMs));
          }
          lastEarthClockMsRef.current = sc.clock.getUtcMs();
        }
        break;
      }
      case 'exit': sc.exitSurface(); break;
      case 'magnification': sc.setSurfaceMagnification(a.value); break;
      case 'atmosphere': sc.setSurfaceAtmosphere(a.on); break;
      case 'time': {
        const beforeMs = sc.clock.getUtcMs();
        sc.setSurfaceTimeOfDay(a.what);
        const isEarthSurface = sc.getExplorerStatus().body === 'Earth' || sc.selectedBodyName() === 'Earth';
        if (isEarthSurface) {
          const afterMs = sc.clock.getUtcMs();
          if (Math.floor(afterMs / DAY_MS) !== Math.floor(beforeMs / DAY_MS)) {
            sc.clock.setUtcMs(preserveCalendarDateUtcMs(beforeMs, afterMs));
          }
          lastEarthClockMsRef.current = sc.clock.getUtcMs();
        }
        break;
      }
      case 'lookAt': sc.surfaceLookAt(a.name); break;
      case 'resetZoom': sc.resetSurfaceZoom(); break;
      case 'skyFrom': sc.enterSkyView(a.body, a.facing); break;
      case 'deepTime': sc.enterDeepTime(a.id); break;
      case 'deepTimeOff': sc.exitDeepTime(); break;
    }
  }, []);

  const handleHorizon = useCallback((on: boolean) => {
    if (on) sceneRef.current?.enterHorizonView();
    else sceneRef.current?.exitHorizonView();
  }, []);

  const handleNebula = useCallback((name: string): boolean => sceneRef.current?.visitNebula(name) ?? false, []);

  const handlePostcard = useCallback((p: Postcard) => {
    sceneRef.current?.openPostcard(p);
  }, []);

  const handleCapture = useCallback(async (): Promise<boolean> => {
    const sc = sceneRef.current;
    if (!sc) return false;
    const blob = await sc.captureShot();
    if (!blob) return false;
    const view = sc.currentPostcardView();
    const where = view ? (view.body === 'Sagittarius A*' ? 'Sagittarius A*' : `On ${view.body}`) : sc.selectedBodyName();
    try {
      await saveShot({ blob, where, view });
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleCycleLens = useCallback(() => {
    sceneRef.current?.cycleLensProfile();
  }, []);

  // The catalogue's cinematic reel (stable object: the catalogue restarts the reel when it changes)
  const showcase = useMemo(() => ({
    start: (name: string | null, hero?: string | null) => { sceneRef.current?.startShowcase(name, hero); },
    stop: () => sceneRef.current?.stopShowcase(),
    caption: () => sceneRef.current?.showcaseCaption() ?? '',
  }), []);

  const handleJumpToScale = useCallback((domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a') => {
    sceneRef.current?.jumpToScale(domain);
  }, []);

  const handleSelectSpacecraft = useCallback((nameOrId: string, featuredEpochUtc?: string | null) => {
    sceneRef.current?.selectSpacecraft(nameOrId, featuredEpochUtc);
  }, []);

  const handleFlyJetSpacecraft = useCallback((nameOrId: string, featuredEpochUtc?: string | null) => {
    sceneRef.current?.enterJetBesideSpacecraft(nameOrId, featuredEpochUtc);
  }, []);

  const handleMissionEvent = useCallback((dateUtc: string | null, target: string) => {
    sceneRef.current?.jumpToMissionEvent(dateUtc, target);
    if (sceneRef.current) lastEarthClockMsRef.current = sceneRef.current.clock.getUtcMs();
  }, []);

  const handleSetComparison = useCallback((kind: ComparisonPropKind) => {
    sceneRef.current?.setComparisonProp(kind);
    setComparisonKind(sceneRef.current?.getComparisonProp() ?? kind);
  }, []);

  const handleToggleScienceOverlays = useCallback(() => {
    const next = !(sceneRef.current?.getScienceOverlaysVisible() ?? scienceOverlaysOn);
    sceneRef.current?.setScienceOverlaysVisible(next);
    setScienceOverlaysOn(sceneRef.current?.getScienceOverlaysVisible() ?? next);
  }, [scienceOverlaysOn]);

  // If currently focused on a NASA spacecraft, fly directly beside it; otherwise open the dedicated fly page over Earth
  const handleLaunchJet = useCallback(() => {
    const activeName = telemetry?.activeTarget?.name;
    if (activeName && CatalogueManager.getSpacecraftEntry(activeName)) {
      sceneRef.current?.enterJetBesideSpacecraft(activeName);
      return;
    }
    window.location.assign(FLY_URL);
  }, [telemetry?.activeTarget?.name]);

  const handleTakeOff = useCallback(() => {
    sceneRef.current?.takeOffFromLanding();
  }, []);

  const handleExitJet = useCallback(() => {
    sceneRef.current?.exitJet();
  }, []);

  const isSpacecraftTarget = telemetry?.activeTarget?.category === 'spacecraft';
  const isSurfaceClose =
    !isSpacecraftTarget &&
    (jetActive ||
      !!telemetry?.surface?.active ||
      !!telemetry?.horizonView ||
      (telemetry?.explorer?.altitudeRadii ?? Infinity) < 0.35);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#030206] ${isSurfaceClose ? 'sol-surface-close' : ''}`}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

      {/* Flight HUD Overlay (powers on once the opening sequence has revealed the scene) */}
      {revealed && !jetActive && <FlightHUD
        telemetry={telemetry}
        getView={getView}
        onSelectPlanet={handleSelectPlanet}
        onResetView={handleResetView}
        onTogglePlay={handleTogglePlay}
        onSetTimeMultiplier={handleSetTimeMultiplier}
        onSeekDate={handleSeekDate}
        onResetToJ2000={handleResetToJ2000}
        onResetToNow={handleResetToNow}
        onToggleConstellations={handleToggleConstellations}
        onToggleAsteroidBelt={handleToggleAsteroidBelt}
        onToggleOrbits={handleToggleOrbits}
        onJumpToScale={handleJumpToScale}
        onSetLens={handleSetLens}
        onSetBloom={handleSetBloom}
        onCycleLens={handleCycleLens}
        onFlyToLandmark={handleFlyToLandmark}
        onExplorerDaylight={handleExplorerDaylight}
        onSelectSpacecraft={handleSelectSpacecraft}
        onFlyJetSpacecraft={handleFlyJetSpacecraft}
        onMissionEvent={handleMissionEvent}
        comparisonKind={comparisonKind}
        onSetComparison={handleSetComparison}
        scienceOverlaysOn={scienceOverlaysOn}
        onToggleScienceOverlays={handleToggleScienceOverlays}
        onSurface={handleSurface}
        onHorizon={handleHorizon}
        introDone={introFinished}
        showcase={showcase}
        onPostcard={handlePostcard}
        onCapture={handleCapture}
        onNebula={handleNebula}
        onLaunchJet={handleLaunchJet}
      />}

      {/* Jet mode: the SX-1's own HUD replaces the observatory's */}
      {revealed && jetActive && sceneRef.current && <JetHUD controller={sceneRef.current.jet} onExit={handleExitJet} />}

      {/* Landed from the jet: stand and look, then take off again from the same spot */}
      {revealed && !jetActive && landedAt && (
        <div
          className="sol-landed-pill"
          style={{
            position: 'absolute',
            left: '50%',
            top: 'calc(var(--hud-header-h, calc(env(safe-area-inset-top, 0px) + 64px)) + 8px)',
            transform: 'translateX(-50%)',
            zIndex: 40,
            maxWidth: 'calc(100vw - 24px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'auto',
          }}
        >
          <FpsCounter style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }} />
          <span className="sol-landed-label">
            Landed · {landedAt}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <button type="button" className="hud-btn is-on sol-landed-takeoff" onClick={handleTakeOff}>
              Take off
            </button>
            <button
              type="button"
              className="hud-btn sol-landed-avatar"
              onClick={(e) => {
                const sc = sceneRef.current;
                if (!sc) return;
                sc.avatarOn = !sc.avatarOn;
                (e.currentTarget as HTMLButtonElement).textContent = sc.avatarOn ? 'Hide person' : 'Show person';
              }}
            >
              Hide person
            </button>
          </div>
        </div>
      )}

      {mode === 'fly' ? (
        !introFinished && <FlyPreloader progress={fly.progress} items={fly.items} log={fly.log} tiles={fly.tiles} ready={fly.ready} startName={fly.start} startLatLon={fly.ll} onEngage={handleEngage} onFinished={handleFlyFinished} />
      ) : (
        <Preloader progress={load.progress} stage={load.stage} done={load.done} onReveal={handleReveal} onBegin={handleBegin} onFinished={handleRevealed} />
      )}
    </div>
  );
};

export default App;
