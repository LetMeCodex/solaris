import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SolarSystemScene, TelemetryData } from './rendering/SolarSystemScene';
import { FlightHUD } from './ui/HUD/FlightHUD';
import { ScaleMode } from './rendering/RenderSpaceTransform';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SolarSystemScene | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate core Three.js scene
    const scene = new SolarSystemScene(containerRef.current, (data) => {
      setTelemetry(data);
    });
    sceneRef.current = scene;

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const handleSelectPlanet = useCallback((name: string) => {
    sceneRef.current?.selectBody(name);
  }, []);

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

  const handleSetScaleMode = useCallback((mode: ScaleMode) => {
    sceneRef.current?.setScaleMode(mode);
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030206]">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Flight HUD Overlay */}
      <FlightHUD
        telemetry={telemetry}
        onSelectPlanet={handleSelectPlanet}
        onResetView={handleResetView}
        onTogglePlay={handleTogglePlay}
        onSetTimeMultiplier={handleSetTimeMultiplier}
        onSetScaleMode={handleSetScaleMode}
        onSeekDate={handleSeekDate}
        onResetToJ2000={handleResetToJ2000}
        onResetToNow={handleResetToNow}
        onToggleConstellations={handleToggleConstellations}
        onToggleAsteroidBelt={handleToggleAsteroidBelt}
        onToggleOrbits={handleToggleOrbits}
      />
    </div>
  );
};

export default App;
