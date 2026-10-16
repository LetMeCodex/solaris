import { useEffect, useState } from 'react';

/**
 * Everything you can tune in Solaris, remembered in this browser. Components read it with
 * useSettings(); the scene and the audio apply it as it changes.
 */
export interface Settings {
  /** Vela's voice volume 0..1, and whether she speaks aloud at all. */
  velaVolume: number;
  velaVoice: boolean;
  /** Vela starts conversations on her own (off = she only answers when you tap her). */
  velaChatty: boolean;
  /** Little chimes on arrival. */
  chimes: boolean;
  /** Nebulae on the sky: brightness 0..2 (0 hides them). */
  nebulae: number;
  /** World labels and the rings that mark small worlds. */
  markers: boolean;
  /** Left alone, the view drifts and (on a surface) the sky turns as a time-lapse. */
  idleMotion: boolean;
  /** Calm interface: fewer HUD animations. */
  calmUi: boolean;
  /** Show the record player, Vela's orb and the galaxy map. */
  showRecord: boolean;
  showVela: boolean;
  showMinimap: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  velaVolume: 0.9,
  velaVoice: true,
  velaChatty: true,
  chimes: true,
  nebulae: 1,
  markers: true,
  idleMotion: true,
  calmUi: false,
  showRecord: true,
  showVela: true,
  showMinimap: true,
};

const KEY = 'solaris.settings';
const listeners = new Set<(s: Settings) => void>();

function load(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<Settings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let current: Settings = load();

export const settings = {
  get: (): Settings => current,
  set(patch: Partial<Settings>): void {
    current = { ...current, ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(current));
    } catch {
      /* private mode: settings last for this visit */
    }
    listeners.forEach((l) => l(current));
  },
  reset(): void {
    settings.set({ ...DEFAULT_SETTINGS });
  },
  subscribe(fn: (s: Settings) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useSettings(): Settings {
  const [s, setS] = useState(current);
  useEffect(() => settings.subscribe(setS), []);
  return s;
}
