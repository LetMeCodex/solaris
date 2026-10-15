import { SurfaceAction } from './ui/HUD/SurfacePanel';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SolarSystemScene, TelemetryData } from './rendering/SolarSystemScene';
import { FlightHUD } from './ui/HUD/FlightHUD';
import { LensProfileName } from './rendering/LensPipeline';
import { Preloader } from './ui/Preloader';
import { voice, chime } from './companion/voice';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SolarSystemScene | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  // Opening sequence: progress of the asset warm-up, then the reveal
  const [load, setLoad] = useState<{ progress: number; stage: string; done: boolean }>({ progress: 0, stage: 'Waking the observatory', done: false });
  const [revealed, setRevealed] = useState(false);      // iris opening: HUD powers on with it
  const [introFinished, setIntroFinished] = useState(false); // iris fully open
  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleBegin = useCallback((withVoice: boolean) => {
    voice.enabled = withVoice;
    voice.unlock();
    chime('open');
  }, []);
  const handleRevealed = useCallback(() => {
    setRevealed(true);
    setIntroFinished(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate core Three.js scene
    const scene = new SolarSystemScene(containerRef.current, (data) => {
      setTelemetry(data);
    });
    sceneRef.current = scene;
    // Load every texture and compile every shader up front (no first-use stalls later)
    scene
      .warmUp((progress, stage) => setLoad({ progress, stage, done: false }))
      .catch((err) => console.warn('[Solaris] warm-up incomplete:', err))
      .finally(() => setLoad((l) => ({ ...l, progress: 1, stage: 'Ready', done: true })));

    // Debug / automation handle (used by visual checks)
    (window as unknown as { __solaris_scene?: SolarSystemScene }).__solaris_scene = scene;

    return () => {
      delete (window as unknown as { __solaris_scene?: SolarSystemScene }).__solaris_scene;
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

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
    }
  }, []);

  const handleHorizon = useCallback((on: boolean) => {
    if (on) sceneRef.current?.enterHorizonView();
    else sceneRef.current?.exitHorizonView();
  }, []);

  const handleCycleLens = useCallback(() => {
    sceneRef.current?.cycleLensProfile();
  }, []);

  const handleJumpToScale = useCallback((domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a') => {
    sceneRef.current?.jumpToScale(domain);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030206]" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

      {/* Flight HUD Overlay (powers on once the opening sequence has revealed the scene) */}
      {revealed && <FlightHUD
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
        onSurface={handleSurface}
        onHorizon={handleHorizon}
        introDone={introFinished}
      />}

      <Preloader progress={load.progress} stage={load.stage} done={load.done} onReveal={handleReveal} onBegin={handleBegin} onFinished={handleRevealed} />
    </div>
  );
};

export default App;
