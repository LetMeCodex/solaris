import React, { useEffect } from 'react';
import { Aperture, ChevronLeft, ChevronRight, Sparkles, Sun, Zap } from 'lucide-react';
import {
  AIRSHOW_SMOKES,
  CANOPY_TINTS,
  JET_SKINS,
  JET_SKIN_BY_ID,
  type AirshowSmokeId,
  type CanopyTintId,
  type JetSkinId,
} from './JetSkins';
import {
  HANGAR_WORLDS,
  type HangarCameraPreset,
  type HangarLightingPreset,
  type HangarState,
} from './HangarStudio';
import './hangar.css';

export interface HangarOverlayProps {
  state: HangarState;
  onExit: () => void;
  onDeploy: () => void;
  onSelectWorld: (world: string) => void;
  onSelectAirframe: (airframe: 'su30' | 'gripen') => void;
  onSelectSkin: (skin: JetSkinId) => void;
  onSelectCanopyTint: (tint: CanopyTintId) => void;
  onSelectSmoke: (smoke: AirshowSmokeId) => void;
  onSelectHoloAura: (enabled: boolean) => void;
  onTriggerPulse: () => void;
  onSelectLighting: (lighting: HangarLightingPreset) => void;
  onSelectCameraPreset: (preset: HangarCameraPreset) => void;
  onAfterburnerChange: (value: number) => void;
  onGLoadChange: (gLoad: number) => void;
}

const WORLD_THEMES: Readonly<Record<string, { accent: string; glow: string }>> = {
  Earth: { accent: '#62cbff', glow: 'rgba(98, 203, 255, 0.25)' },
  Mars: { accent: '#e87a48', glow: 'rgba(232, 122, 72, 0.25)' },
  Venus: { accent: '#f2c66d', glow: 'rgba(242, 198, 109, 0.25)' },
  Titan: { accent: '#e69945', glow: 'rgba(230, 153, 69, 0.26)' },
  Saturn: { accent: '#ebd59a', glow: 'rgba(235, 213, 154, 0.24)' },
  Jupiter: { accent: '#df9868', glow: 'rgba(223, 152, 104, 0.24)' },
  Uranus: { accent: '#7fe8ec', glow: 'rgba(127, 232, 236, 0.24)' },
  Neptune: { accent: '#5686ff', glow: 'rgba(86, 134, 255, 0.26)' },
  Observatory: { accent: '#b2a6ff', glow: 'rgba(178, 166, 255, 0.24)' },
};

const CAMERA_PRESETS: ReadonlyArray<{ id: HangarCameraPreset; label: string; title: string }> = [
  { id: 'three_quarter', label: '3/4 NOSE', title: 'Hero 3/4 forward hangar angle' },
  { id: 'top_planform', label: 'TOP PLANFORM', title: 'Overhead planform sheet angle' },
  { id: 'tails', label: 'TWIN TAILS', title: 'Twin vertical stabilizers & aft deck' },
  { id: 'nozzle', label: 'NOZZLE', title: 'Twin engine nozzles & afterburner surge' },
  { id: 'cockpit', label: 'COCKPIT', title: 'Canopy film & tandem cockpit close-up' },
  { id: 'orbit', label: 'ORBIT', title: 'Slow continuous showcase orbit' },
];

const AIRFRAME_OPTIONS: ReadonlyArray<{ id: 'su30' | 'gripen'; name: string; meta: string }> = [
  { id: 'su30', name: 'Su-30MKI', meta: 'Twin AL-31FP · 3D TVC' },
  { id: 'gripen', name: 'JAS 39C Gripen', meta: 'Volvo RM12 · Canard-Delta' },
];

const CANOPY_SWATCH: Readonly<Record<CanopyTintId, string>> = {
  clear: 'linear-gradient(135deg, rgba(220, 240, 255, 0.85), rgba(140, 180, 210, 0.35))',
  smoked: 'linear-gradient(135deg, #3c424d, #111319)',
  gold: 'linear-gradient(135deg, #ffe799, #c48724)',
};

const stopPointer = (e: React.SyntheticEvent): void => {
  e.stopPropagation();
};

export const HangarOverlay: React.FC<HangarOverlayProps> = ({
  state,
  onExit,
  onDeploy,
  onSelectWorld,
  onSelectAirframe,
  onSelectSkin,
  onSelectCanopyTint,
  onSelectSmoke,
  onSelectHoloAura,
  onTriggerPulse,
  onSelectLighting,
  onSelectCameraPreset,
  onAfterburnerChange,
  onGLoadChange,
}) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onExit();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onExit]);

  const activeWorld = HANGAR_WORLDS.find((w) => w.id === state.world) ?? HANGAR_WORLDS[0];
  const worldTheme = WORLD_THEMES[activeWorld?.id ?? 'Earth'] ?? WORLD_THEMES.Earth;
  const activeSkin = JET_SKIN_BY_ID[state.skin] ?? JET_SKINS[0];
  const skinAccentHex = `#${activeSkin.accentHex.toString(16).padStart(6, '0')}`;

  const airframePrefix = state.airframe === 'su30' ? 'SU-30MKI' : 'JAS 39C';
  const spotlightTitle = activeSkin.id === 'stock' ? `${airframePrefix} Stock` : activeSkin.name;
  const spotlightBadge =
    activeSkin.id === 'flame_phantom' && state.airframe === 'gripen'
      ? 'LIVING 3D SKIN · JAS 39C'
      : activeSkin.badge;

  const afterburnerNorm = Math.max(0, Math.min(1, state.afterburner));
  const afterburnerPct = Math.round(afterburnerNorm * 100);
  const gLoad = Math.max(1, Math.min(9, state.gLoad));
  const gFillPct = ((gLoad - 1) / 8) * 100;

  return (
    <div
      className="hangar-root"
      style={{
        ['--hangar-world-accent' as string]: worldTheme.accent,
        ['--hangar-world-glow' as string]: worldTheme.glow,
        ['--hangar-skin-accent' as string]: skinAccentHex,
      }}
      role="region"
      aria-label="Solaris 3D Hangar"
    >
      {/* Top Bar: Back, Editorial Wordmark, World Pills, Lighting Toggle, Camera Presets */}
      <header className="hangar-topbar">
        <div className="hangar-topbar-row">
          <div
            className="hangar-brand-cluster"
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onWheel={stopPointer}
          >
            <button
              type="button"
              className="hangar-back-btn"
              onClick={onExit}
              title="Return (Esc)"
              aria-label="Back from Hangar"
            >
              <ChevronLeft size={12} />
              <span>BACK</span>
            </button>
            <div className="hangar-wordmark">
              <span className="hangar-wordmark-dot" aria-hidden />
              <span className="hangar-wordmark-text">SOLARIS HANGAR · BAY 01</span>
            </div>
          </div>

          <nav
            className="hangar-worlds"
            aria-label="Solaris hangar bay backdrop world"
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onWheel={stopPointer}
          >
            {HANGAR_WORLDS.map((w) => {
              const theme = WORLD_THEMES[w.id] ?? WORLD_THEMES.Earth;
              const isActive = state.world === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={isActive}
                  title={`${w.label} · ${w.subtitle} (${w.badge})`}
                  className={`hangar-world-pill ${isActive ? 'is-active' : ''}`}
                  style={{ ['--pill-hue' as string]: theme.accent }}
                  onClick={() => onSelectWorld(w.id)}
                >
                  <span className="hangar-world-cue" aria-hidden />
                  <span>{w.label}</span>
                </button>
              );
            })}
          </nav>

          <div
            className="hangar-lighting-seg"
            role="group"
            aria-label="Hangar lighting preset"
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onWheel={stopPointer}
          >
            <button
              type="button"
              aria-pressed={state.lighting === 'hero'}
              className={`hangar-light-btn ${state.lighting === 'hero' ? 'is-active' : ''}`}
              onClick={() => onSelectLighting('hero')}
              title="Dramatic Hero rim + bay key light"
            >
              <Aperture size={11} />
              <span>HERO</span>
            </button>
            <button
              type="button"
              aria-pressed={state.lighting === 'studio'}
              className={`hangar-light-btn ${state.lighting === 'studio' ? 'is-active' : ''}`}
              onClick={() => onSelectLighting('studio')}
              title="Balanced 360° design inspection studio lighting"
            >
              <Sun size={11} />
              <span>STUDIO</span>
            </button>
          </div>
        </div>

        <div className="hangar-subbar-row">
          <div className="hangar-world-meta">
            {activeWorld && (
              <>
                <span className="hangar-world-badge">{activeWorld.badge}</span>
                <span>{activeWorld.subtitle}</span>
              </>
            )}
          </div>

          <div
            className="hangar-cam-strip"
            role="group"
            aria-label="Hangar camera view presets"
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onWheel={stopPointer}
          >
            {CAMERA_PRESETS.map((cam) => {
              const isActive = state.cameraPreset === cam.id;
              return (
                <button
                  key={cam.id}
                  type="button"
                  aria-pressed={isActive}
                  title={cam.title}
                  className={`hangar-cam-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectCameraPreset(cam.id)}
                >
                  {cam.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Bottom-Left Livery Spotlight Panel */}
      <section
        className="hangar-spotlight"
        aria-label="Active livery spotlight and live shader controls"
        onPointerDown={stopPointer}
        onMouseDown={stopPointer}
        onWheel={stopPointer}
      >
        <div className="hangar-badge">
          <span className="hangar-badge-dot" aria-hidden />
          <span>{spotlightBadge}</span>
        </div>

        <h1 className="hangar-spotlight-title">{spotlightTitle}</h1>
        <p className="hangar-spotlight-desc">{activeSkin.description}</p>

        <div className="hangar-test-rig">
          <div className="hangar-slider-row">
            <div className="hangar-slider-head">
              <span className="hangar-slider-label">Afterburner Surge</span>
              <div className="hangar-slider-actions">
                <span className="hangar-slider-value">{afterburnerPct}%</span>
                <button
                  type="button"
                  className={`hangar-mini-toggle ${afterburnerPct > 5 ? 'is-on' : ''}`}
                  aria-pressed={afterburnerPct > 5}
                  onClick={() => onAfterburnerChange(afterburnerPct > 5 ? 0 : 1)}
                  title="Toggle full afterburner surge on turntable"
                >
                  {afterburnerPct > 5 ? 'SURGE ON' : 'IGNITE'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={afterburnerPct}
              aria-label="Afterburner Surge"
              className="hangar-range"
              style={{ ['--fill' as string]: `${afterburnerPct}%` }}
              onChange={(e) => onAfterburnerChange(Number(e.target.value) / 100)}
            />
          </div>

          <div className="hangar-slider-row">
            <div className="hangar-slider-head">
              <span className="hangar-slider-label">Pull-G Flame Pulse</span>
              <div className="hangar-slider-actions">
                <span className="hangar-slider-value">{gLoad.toFixed(1)}G</span>
                <button
                  type="button"
                  className={`hangar-mini-toggle ${gLoad >= 6 ? 'is-on' : ''}`}
                  aria-pressed={gLoad >= 6}
                  onClick={() => onGLoadChange(gLoad >= 6 ? 1 : 9)}
                  title="Test 9G peak flame pulse vs 1G cruise"
                >
                  {gLoad >= 6 ? '9G PEAK' : 'TEST 9G'}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={9}
              step={0.1}
              value={gLoad}
              aria-label="Pull-G Flame Pulse"
              className="hangar-range"
              style={{ ['--fill' as string]: `${gFillPct}%` }}
              onChange={(e) => onGLoadChange(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="hangar-action-strip">
          <button
            type="button"
            className="hangar-fx-btn"
            onClick={onTriggerPulse}
            title="Send radial 3D energy shockwave across hull & hangar bay (or click directly on the jet!)"
          >
            <Zap size={12} />
            <span>SHOCKWAVE</span>
          </button>
          <button
            type="button"
            aria-pressed={state.holoAura}
            className={`hangar-fx-btn ${state.holoAura ? 'is-on' : ''}`}
            onClick={() => onSelectHoloAura(!state.holoAura)}
            title="Toggle floating 3D holographic wing & spine tactical rings"
          >
            <Sparkles size={12} />
            <span>AURA {state.holoAura ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <button
          type="button"
          className="hangar-deploy-btn"
          onClick={onDeploy}
        >
          <span>DEPLOY TO {(activeWorld?.label ?? state.world).toUpperCase()}</span>
          <ChevronRight size={14} />
        </button>

        <div className="hangar-hint">
          Click jet for shockwave · Drag to orbit · Scroll to zoom
        </div>
      </section>

      {/* Right Customization Dock */}
      <aside
        className="hangar-dock"
        aria-label="Aircraft customization dock"
        onPointerDown={stopPointer}
        onMouseDown={stopPointer}
        onWheel={stopPointer}
      >
        <div className="hangar-section">
          <div className="hangar-section-head">
            <span>AIRFRAME</span>
            <span className="hangar-section-meta">{state.airframe === 'su30' ? 'FLANKER' : 'GRIPEN'}</span>
          </div>
          <div className="hangar-stack">
            {AIRFRAME_OPTIONS.map((af) => {
              const isActive = state.airframe === af.id;
              return (
                <button
                  key={af.id}
                  type="button"
                  aria-pressed={isActive}
                  className={`hangar-card-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectAirframe(af.id)}
                >
                  <div className="hangar-card-info">
                    <span className="hangar-card-title">{af.name}</span>
                    <span className="hangar-card-sub">{af.meta}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hangar-section">
          <div className="hangar-section-head">
            <span>REACTIVE LIVERY</span>
            <span className="hangar-section-meta">{state.skin === 'stock' ? 'STOCK' : 'LIVING 3D'}</span>
          </div>
          <div className="hangar-stack">
            {JET_SKINS.map((sk) => {
              const isActive = state.skin === sk.id;
              const hex = `#${sk.accentHex.toString(16).padStart(6, '0')}`;
              return (
                <button
                  key={sk.id}
                  type="button"
                  aria-pressed={isActive}
                  className={`hangar-card-btn ${isActive ? 'is-active' : ''}`}
                  style={{ ['--card-accent' as string]: hex }}
                  onClick={() => onSelectSkin(sk.id)}
                >
                  <div className="hangar-card-info">
                    <span className="hangar-card-title">{sk.name}</span>
                    <span className="hangar-card-sub">{sk.subtitle}</span>
                  </div>
                  <span
                    className="hangar-livery-swatch"
                    style={{
                      background: sk.swatchCss,
                      boxShadow: sk.id !== 'stock' && isActive ? `0 0 12px ${hex}88` : undefined,
                    }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="hangar-section">
          <div className="hangar-section-head">
            <span>CANOPY FILM</span>
          </div>
          <div className="hangar-pill-grid">
            {CANOPY_TINTS.map((tint) => {
              const isActive = state.canopyTint === tint.id;
              return (
                <button
                  key={tint.id}
                  type="button"
                  aria-pressed={isActive}
                  title={tint.subtitle}
                  className={`hangar-opt-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectCanopyTint(tint.id)}
                >
                  <span
                    className="hangar-swatch-dot"
                    style={{ background: CANOPY_SWATCH[tint.id] }}
                    aria-hidden
                  />
                  <span>{tint.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hangar-section">
          <div className="hangar-section-head">
            <span>AIRSHOW SMOKE</span>
            <span className="hangar-section-meta">2 KEY</span>
          </div>
          <div className="hangar-pill-grid">
            {AIRSHOW_SMOKES.map((sm) => {
              const isActive = state.smoke === sm.id;
              const hexColor = `#${sm.colorHex.toString(16).padStart(6, '0')}`;
              const hexAccent = `#${sm.accentHex.toString(16).padStart(6, '0')}`;
              return (
                <button
                  key={sm.id}
                  type="button"
                  aria-pressed={isActive}
                  className={`hangar-opt-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectSmoke(sm.id)}
                >
                  <span
                    className="hangar-swatch-dot"
                    style={{
                      background:
                        sm.id === 'off'
                          ? 'transparent'
                          : `radial-gradient(circle at 35% 35%, ${hexAccent}, ${hexColor})`,
                      borderStyle: sm.id === 'off' ? 'dashed' : 'solid',
                      boxShadow: sm.id !== 'off' && isActive ? `0 0 8px ${hexColor}` : undefined,
                    }}
                    aria-hidden
                  />
                  <span>{sm.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {state.loading && (
        <div className="hangar-loading-pill" role="status">
          <span className="hangar-spinner" aria-hidden />
          <span>LOADING {airframePrefix} AIRFRAME</span>
        </div>
      )}
    </div>
  );
};
