/**
 * Vela's voice: pre-recorded lines generated with the Kokoro-82M neural voice
 * (scripts/generate_vela_voice.py → public/voice/vela/*.mp3), played through Web Audio so the
 * orb can follow the real loudness of her speech. No robotic browser speech synthesis.
 */
import { settings } from '../ui/settings';

interface ManifestEntry {
  file: string;
  seconds: number;
}

const BASE = `${import.meta.env.BASE_URL || '/'}voice/vela/`;
let manifest: Record<string, ManifestEntry> | null = null;
let manifestLoading: Promise<void> | null = null;

function loadManifest(): Promise<void> {
  manifestLoading ??= fetch(`${BASE}manifest.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .then((m) => {
      manifest = m as Record<string, ManifestEntry>;
    })
    .catch(() => {
      manifest = {};
    });
  return manifestLoading;
}

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let voiceGain: GainNode | null = null;
let level = new Uint8Array(256);
let current: HTMLAudioElement | null = null;
const cache = new Map<string, HTMLAudioElement>();

/** The one Web Audio context (her voice, chimes and the music share it). */
export function audioCtx(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!ctx) {
      ctx = new Ctx();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      level = new Uint8Array(analyser.fftSize);
      voiceGain = ctx.createGain();
      voiceGain.gain.value = settings.get().velaVolume;
      analyser.connect(voiceGain).connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function element(id: string): HTMLAudioElement | null {
  const entry = manifest?.[id];
  if (!entry) return null;
  let el = cache.get(id);
  if (!el) {
    el = new Audio(`${BASE}${entry.file}`);
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    const c = audioCtx();
    if (c && analyser) {
      try {
        c.createMediaElementSource(el).connect(analyser);
      } catch {
        /* already connected */
      }
    }
    cache.set(id, el);
  }
  return el;
}

export const voice = {
  enabled: false,
  speaking: false,
  listeners: new Set<(speaking: boolean) => void>(),

  setSpeaking(s: boolean): void {
    this.speaking = s;
    this.listeners.forEach((l) => l(s));
  },

  /** Call from a click so the browser allows audio, and start fetching the manifest. */
  unlock(): void {
    audioCtx();
    void loadManifest();
  },

  /** How long a line lasts (seconds), for pacing subtitles; null if there is no recording. */
  seconds(id: string): number | null {
    return manifest?.[id]?.seconds ?? null;
  },

  /** Warm the cache for lines that are likely next. */
  preload(ids: string[]): void {
    if (!this.enabled) return;
    void loadManifest().then(() => ids.forEach((id) => element(id)));
  },

  stop(): void {
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
    current = null;
    this.setSpeaking(false);
  },

  /** Play a recorded line; resolves when it ends (or immediately if muted / missing). */
  async play(id: string): Promise<void> {
    if (!this.enabled) return;
    await loadManifest();
    const el = element(id);
    if (!el) return;
    this.stop();
    current = el;
    el.currentTime = 0;
    this.setSpeaking(true);
    await new Promise<void>((resolve) => {
      const done = () => {
        el.removeEventListener('ended', done);
        el.removeEventListener('pause', done);
        el.removeEventListener('error', done);
        resolve();
      };
      el.addEventListener('ended', done);
      el.addEventListener('pause', done);
      el.addEventListener('error', done);
      el.play().catch(done);
    });
    if (current === el) {
      current = null;
      this.setSpeaking(false);
    }
  },

  /** Current loudness 0..1 of her voice, for the orb. */
  amplitude(): number {
    if (!analyser || !this.speaking) return 0;
    analyser.getByteTimeDomainData(level);
    let sum = 0;
    for (let i = 0; i < level.length; i++) {
      const v = (level[i] - 128) / 128;
      sum += v * v;
    }
    return Math.min(1, Math.sqrt(sum / level.length) * 4);
  },
};

/* A soft two-partial chime (Web Audio) for moments that deserve one */
export function chime(kind: 'arrive' | 'open' = 'arrive'): void {
  if (!voice.enabled || !settings.get().chimes) return;
  const c = audioCtx();
  if (!c) return;
  const now = c.currentTime;
  const base = kind === 'arrive' ? 659.25 : 523.25;
  for (const [mult, gain, delay] of [[1, 0.05, 0], [1.5, 0.03, 0.09], [2.01, 0.018, 0.18]] as const) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = base * mult;
    g.gain.setValueAtTime(0, now + delay);
    g.gain.linearRampToValueAtTime(gain, now + delay + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.6);
    o.connect(g).connect(c.destination);
    o.start(now + delay);
    o.stop(now + delay + 1.7);
  }
}

// Settings: her volume, and whether she speaks aloud (applied live)
settings.subscribe((st) => {
  if (voiceGain && ctx) voiceGain.gain.setTargetAtTime(st.velaVolume, ctx.currentTime, 0.05);
  if (voice.enabled !== st.velaVoice) {
    voice.enabled = st.velaVoice;
    if (!st.velaVoice) voice.stop();
    else voice.unlock();
  }
});
