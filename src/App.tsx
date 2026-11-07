import { SurfaceAction } from './ui/HUD/SurfacePanel';
import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { SolarSystemScene, TelemetryData } from './rendering/SolarSystemScene';
import { FlightHUD } from './ui/HUD/FlightHUD';
import { JetHUD } from './flight/JetHUD';
import { LensProfileName } from './rendering/LensPipeline';
import { Preloader } from './ui/Preloader';
import { voice, chime } from './companion/voice';
import { music } from './audio/music';
import { settings } from './ui/settings';
import type { Postcard } from './data/Postcards';
import { saveShot } from './ui/HUD/shots';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SolarSystemScene | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  // Opening sequence: progress of the asset warm-up, then the reveal
  const [load, setLoad] = useState<{ progress: number; stage: string; done: boolean }>({ progress: 0, stage: 'Waking the observatory', done: false });
  const [revealed, setRevealed] = useState(false);      // iris opening: HUD powers on with it
  const [introFinished, setIntroFinished] = useState(false); // iris fully open
  const [jetActive, setJetActive] = useState(false);     // flying the jet (src/flight)
  const [landedAt, setLandedAt] = useState<string | null>(null); // landed at a landmark from the jet
  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleBegin = useCallback((withVoice: boolean) => {
    voice.enabled = withVoice;
    settings.set({ velaVoice: withVoice });
    voice.unlock();
    chime('open');
    // The soundtrack starts softly with the journey ("in silence" leaves the needle up)
    if (withVoice) music.start();
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
    // The jet reports every frame; React only needs to know when it takes off or lands
    let jetWas = false;
    scene.onJetLanding = (lm) => setLandedAt(lm ? lm.name : null);
    const unsubJet = scene.jet.subscribe((t) => {
      if (t.active !== jetWas) {
        jetWas = t.active;
        setJetActive(t.active);
      }
    });
    // Load every texture and compile every shader up front (no first-use stalls later)
    scene
      .warmUp((progress, stage) => setLoad({ progress, stage, done: false }))
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

  const handleLaunchJet = useCallback(() => {
    sceneRef.current?.enterJet();
  }, []);

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
        <div style={{ position: 'absolute', left: '50%', bottom: 92, transform: 'translateX(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
          <span style={{ fontFamily: 'Montserrat, system-ui, sans-serif', fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            Landed · {landedAt}
          </span>
          <button type="button" className="hud-btn is-on" style={{ color: 'var(--sol-mint)', padding: '8px 18px' }} onClick={handleTakeOff}>
            Take off
          </button>
        </div>
      )}

      <Preloader progress={load.progress} stage={load.stage} done={load.done} onReveal={handleReveal} onBegin={handleBegin} onFinished={handleRevealed} />
    </div>
  );
};

export default App;
