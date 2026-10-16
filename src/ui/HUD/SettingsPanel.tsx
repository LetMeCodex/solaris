import { emitVela } from '../../companion/events';
import React, { useEffect, useState } from 'react';
import { music, MusicState } from '../../audio/music';
import { DEFAULT_WORLD_SCALE, WORLD_SCALE, WORLD_SCALE_KEY, WORLD_SCALE_OPTIONS } from '../../rendering/Scale';
import { settings, useSettings, DEFAULT_SETTINGS } from '../settings';

/**
 * Settings: every knob in one place — Vela, the music, how the worlds and the sky are drawn, the
 * camera's idle motion and the interface. Everything applies at once (World size reloads the page).
 */

type Lens = 'cinematic' | 'fisheye' | 'clean';

interface Props {
  open: boolean;
  onClose: () => void;
  lens: string;
  onSetLens?: (l: Lens) => void;
  bloom: number;
  bloomAvailable: boolean;
  onSetBloom?: (g: number) => void;
  layers: Array<{ label: string; on: boolean; toggle?: () => void }>;
}

function useMusic(): MusicState {
  const [s, setS] = useState(music.state);
  useEffect(() => music.subscribe(setS), []);
  return s;
}

const Switch: React.FC<{ label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }> = ({ label, hint, on, onChange }) => (
  <label className={`set-row set-switch ${on ? 'is-on' : ''}`}>
    <span className="set-text">
      {label}
      {hint && <em>{hint}</em>}
    </span>
    <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
    <span className="set-toggle" aria-hidden><i /></span>
  </label>
);

const Slider: React.FC<{ label: string; value: number; min?: number; max?: number; step?: number; fmt?: (v: number) => string; disabled?: boolean; onChange: (v: number) => void }> = ({
  label, value, min = 0, max = 1, step = 0.01, fmt = (v) => `${Math.round(v * 100)}%`, disabled, onChange,
}) => (
  <label className={`set-row set-slider ${disabled ? 'is-off' : ''}`}>
    <span className="set-text">
      {label}
      <b>{fmt(value)}</b>
    </span>
    <input
      type="range" min={min} max={max} step={step} value={value} disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="vd-range" style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }}
      aria-label={label}
    />
  </label>
);

function Choice<T extends string | number>({ label, hint, value, options, onChange }: { label: string; hint?: string; value: T; options: ReadonlyArray<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <div className="set-row set-choice">
      <span className="set-text">
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <span className="set-seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value} className={o.value === value ? 'is-on' : ''} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </span>
    </div>
  );
}

export const SettingsPanel: React.FC<Props> = ({ open, onClose, lens, onSetLens, bloom, bloomAvailable, onSetBloom, layers }) => {
  const s = useSettings();
  const m = useMusic();
  const [worldScale, setWorldScale] = useState(WORLD_SCALE);

  useEffect(() => {
    if (open) emitVela('settings', true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;
  const set = settings.set;

  return (
    <>
      <div className="set-scrim" onClick={onClose} aria-hidden />
      <aside className="set-panel" role="dialog" aria-label="Settings">
        <header className="set-head">
          <span className="set-kicker">Solaris</span>
          <span className="set-title">Settings</span>
          <button type="button" className="set-close" onClick={onClose} aria-label="Close settings">Esc</button>
        </header>

        <div className="set-body">
          <section>
            <h3>Vela</h3>
            <Switch label="Her voice" hint="Off: she still writes, silently" on={s.velaVoice} onChange={(v) => set({ velaVoice: v })} />
            <Slider label="Voice volume" value={s.velaVolume} disabled={!s.velaVoice} onChange={(v) => set({ velaVolume: v })} />
            <Switch label="Talks on her own" hint="Off: she only answers when you tap her" on={s.velaChatty} onChange={(v) => set({ velaChatty: v })} />
            <Switch label="Show Vela" on={s.showVela} onChange={(v) => set({ showVela: v })} />
          </section>

          <section>
            <h3>Music</h3>
            <Switch label="Soundtrack" on={m.playing} onChange={() => music.toggle()} />
            <Slider label="Music volume" value={m.muted ? 0 : m.volume} onChange={(v) => music.setVolume(v)} />
            <Switch label="Follow the planets" hint="Each world plays its own track" on={m.follow} onChange={(v) => music.follow(v)} />
            <Switch label="Arrival chimes" on={s.chimes} onChange={(v) => set({ chimes: v })} />
          </section>

          <section>
            <h3>Worlds & sky</h3>
            <Choice
              label="World size"
              hint={worldScale !== WORLD_SCALE ? 'Reload to apply' : 'Distances always stay true'}
              value={worldScale}
              options={WORLD_SCALE_OPTIONS}
              onChange={(v) => {
                setWorldScale(v);
                try {
                  localStorage.setItem(WORLD_SCALE_KEY, String(v));
                } catch {
                  /* ignore */
                }
              }}
            />
            {worldScale !== WORLD_SCALE && (
              <button type="button" className="set-apply" onClick={() => window.location.reload()}>
                Reload with {WORLD_SCALE_OPTIONS.find((o) => o.value === worldScale)?.label}
              </button>
            )}
            <Slider label="Nebulae" value={s.nebulae} max={2} fmt={(v) => (v === 0 ? 'Hidden' : `${Math.round(v * 100)}%`)} onChange={(v) => set({ nebulae: v })} />
            <Switch label="Labels & markers" hint="Names and rings on far-off worlds" on={s.markers} onChange={(v) => set({ markers: v })} />
            {layers.map((l) => (
              <Switch key={l.label} label={l.label} on={l.on} onChange={() => l.toggle?.()} />
            ))}
          </section>

          <section>
            <h3>Camera & lens</h3>
            <Choice<Lens>
              label="Lens"
              value={lens as Lens}
              options={[{ value: 'cinematic', label: 'Cinematic' }, { value: 'fisheye', label: 'Fisheye' }, { value: 'clean', label: 'Clean' }]}
              onChange={(v) => onSetLens?.(v)}
            />
            <Slider label="Bloom" value={bloom} max={3} step={0.05} disabled={!bloomAvailable} onChange={(v) => onSetBloom?.(v)} />
            <Switch label="Idle motion" hint="Left alone, the view drifts and skies turn as a time-lapse" on={s.idleMotion} onChange={(v) => set({ idleMotion: v })} />
          </section>

          <section>
            <h3>Interface</h3>
            <Switch label="Record player" on={s.showRecord} onChange={(v) => set({ showRecord: v })} />
            <Switch label="Galaxy map" on={s.showMinimap} onChange={(v) => set({ showMinimap: v })} />
            <Switch label="Calm interface" hint="Fewer animations" on={s.calmUi} onChange={(v) => set({ calmUi: v })} />
          </section>

          <footer className="set-foot">
            <button
              type="button"
              className="set-reset"
              onClick={() => {
                settings.reset();
                music.setVolume(0.32);
                music.follow(true);
                if (WORLD_SCALE !== DEFAULT_WORLD_SCALE) {
                  try {
                    localStorage.removeItem(WORLD_SCALE_KEY);
                  } catch {
                    /* ignore */
                  }
                  setWorldScale(DEFAULT_WORLD_SCALE);
                }
              }}
              disabled={JSON.stringify(s) === JSON.stringify(DEFAULT_SETTINGS) && worldScale === DEFAULT_WORLD_SCALE}
            >
              Restore defaults
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
};
