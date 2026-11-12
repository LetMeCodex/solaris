import { SurfaceAction } from './ui/HUD/SurfacePanel';
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { SolarSystemScene, TelemetryData } from './rendering/SolarSystemScene';
import { FlightHUD } from './ui/HUD/FlightHUD';
import { JetHUD } from './flight/JetHUD';
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
  useEffect(() => {
    if (mode !== 'fly') return;
    let start = '';
    let ll: { lat: number; lon: number } | null = null;
    let startedAt = 0;
    let quietSince = 0;
    let ready = false;
    let peakPending = 1;
    // The stream log: real events, as they happen (the observatory's stages, the aircraft, the
    // tiles of the start arriving, a second at a time)
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
      if (sc && sc.drawEvery === 1 && !ready) {
        sc.drawEvery = 4;
        // Shaders compile in parallel behind the film instead of freezing it (see CompileGate)
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
      const r = sc?.flyReadiness() ?? { jet: false, aircraft: false, tilesPending: 0, tilesVisible: 0 };
      if (r.aircraft && !aircraftSaid) {
        aircraftSaid = true;
        say('airframe  JAS 39 Gripen glTF decoded · cockpit lit · displays live');
      }
      // Behind the film, every view is looked through once while the tiles load: the cockpit's own
      // shaders, its reflections and displays, the GoPro's and the fly-by's are all made now, not
      // the first time you switch to them (that froze the flight 0.3-0.5 s)
      if (sc && r.aircraft && r.jet && tourStep < TOUR.length + 1 && now - tourAt > 1600) {
        if (tourStep === -1) tourHome = sc.jet.view;
        tourStep++;
        tourAt = now;
        sc.jet.view = tourStep < TOUR.length ? TOUR[tourStep] : tourHome;
      }
      if (startedAt > 0 && now - lastTileSay > 1100 && (r.tilesVisible !== lastTiles || r.tilesPending > 0)) {
        lastTileSay = now;
        const d = r.tilesVisible - lastTiles;
        lastTiles = r.tilesVisible;
        say(`google 3d tiles  ${d >= 0 ? '+' : ''}${d} drawn · ${r.tilesVisible} over the city · ${r.tilesPending} streaming`);
      }
      const streaming = startedAt > 0 && r.jet;
      peakPending = Math.max(peakPending, r.tilesPending);
      const tilesFrac = !streaming ? 0 : r.tilesVisible === 0 ? 0.05 : Math.min(1, 1 - r.tilesPending / Math.max(peakPending, 40));
      if (streaming && r.tilesVisible > 0 && r.tilesPending <= 3) quietSince ||= now;
      else quietSince = 0;
      const settled = quietSince > 0 && now - quietSince > 1500;
      // Ten seconds at least over the start, so the sharp tiles have come in, never more than 50
      const timedOut = startedAt > 0 && now - startedAt > 50000;
      const toured = tourStep >= TOUR.length;
      ready = ready || (load.done && r.jet && r.aircraft && ((toured && settled && now - startedAt > 10000) || timedOut));
      const progress = (load.done ? 0.4 : load.progress * 0.4) + (r.aircraft ? 0.12 : 0) + (r.jet ? 0.08 : 0) + 0.4 * (ready ? 1 : tilesFrac * 0.97);
      const items: PreflightItem[] = [
        { label: 'OBSERVATORY', detail: load.done ? 'textures · shaders ready' : `${Math.round(load.progress * 100)}% · ${load.stage}`, done: load.done },
        { label: 'AIRFRAME', detail: r.aircraft ? 'JAS 39 Gripen · cockpit lit' : 'loading the Gripen', done: r.aircraft },
        { label: 'EARTH 3D', detail: !streaming ? 'waiting for the observatory' : ready ? `${r.tilesVisible} tiles over ${start}` : `${r.tilesVisible} in · ${r.tilesPending} streaming`, done: ready },
        { label: 'SKY', detail: r.jet ? 'live weather · Sun at this hour' : 'standing by', done: r.jet && ready },
      ];
      if (ready && log[log.length - 1]?.indexOf('cleared') === -1) say(`ready  ${r.tilesVisible} tiles · cleared for take-off`);
      setFly({ start, ll, items, progress, ready, log: [...log], tiles: ready ? 1 : tilesFrac });
      if (ready) window.clearInterval(id);
    }, 250);
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

    // Instantiate core Three.js scene
    const scene = new SolarSystemScene(containerRef.current, (data) => {
      setTelemetry(data);
    });
    sceneRef.current = scene;
    (window as any).__solarisScene = scene;
    // The jet reports every frame; React only needs to know when it takes off or lands
    let jetWas = false;
    scene.onJetLanding = (lm) => setLandedAt(lm ? lm.name : null);
    const unsubJet = scene.jet.subscribe((t) => {
      if (t.active !== jetWas) {
        jetWas = t.active;
        setJetActive(t.active);
        // The fly page is the jet: leaving it (not landing) goes back to the observatory
        if (!t.active && mode === 'fly') {
          window.setTimeout(() => {
            if (!landedRef.current) window.location.assign(SITE_URL);
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
  }, []);

  const handleResetToJ2000 = useCallback(() => {
    sceneRef.current?.clock.resetToJ2000();
  }, []);

  const handleResetToNow = useCallback(() => {
    sceneRef.current?.clock.resetToNow();
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
    sceneRef.current?.flyToLandmark(id);
  }, []);

  const handleExplorerDaylight = useCallback((on: boolean) => {
    sceneRef.current?.setExplorerDaylight(on);
  }, []);

  const handleSurface = useCallback((a: SurfaceAction) => {
    const sc = sceneRef.current;
    if (!sc) return;
    switch (a.type) {
      case 'enter': sc.enterSurface(); break;
      case 'exit': sc.exitSurface(); break;
      case 'magnification': sc.setSurfaceMagnification(a.value); break;
      case 'atmosphere': sc.setSurfaceAtmosphere(a.on); break;
      case 'time': sc.setSurfaceTimeOfDay(a.what); break;
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030206]" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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
        // Top centre, under the header: at the bottom it sat under VELA's card (centred there too)
        <div style={{ position: 'absolute', left: '50%', top: 'calc(env(safe-area-inset-top, 0px) + 84px)', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
          <FpsCounter style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }} />
          <span style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            Landed · {landedAt}
          </span>
          <button type="button" className="hud-btn is-on" style={{ color: 'var(--sol-mint)', padding: '8px 18px' }} onClick={handleTakeOff}>
            Take off
          </button>
          <button
            type="button"
            className="hud-btn"
            style={{ padding: '4px 12px', fontSize: 9 }}
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
