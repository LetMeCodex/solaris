/**
 * Vela's voice: the browser's own speech synthesis (no server, no keys), tuned for a warm,
 * unhurried delivery, plus a soft synthesized chime and optional speech recognition.
 *
 * The best available voice is chosen by name: the neural "Natural" voices (Edge on Windows) and
 * Google's voices (Chrome) sound far better than the old system voices.
 */

type Listener = (speaking: boolean) => void;

const PREFERRED = [
  /Natural/i, // Microsoft neural voices (Edge): Aria, Jenny, Sonia, Libby…
  /Google UK English Female/i,
  /Google US English/i,
  /Samantha|Karen|Moira|Tessa|Serena/i, // macOS / iOS
  /Aria|Jenny|Sonia|Libby|Zira/i,
];

let chosen: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
  if (!voices.length) return null;
  for (const re of PREFERRED) {
    // Prefer female-sounding names inside each tier where we can tell
    const tier = voices.filter((v) => re.test(v.name));
    const fem = tier.find((v) => /female|aria|jenny|sonia|libby|samantha|karen|serena|moira|tessa|zira/i.test(v.name));
    if (fem || tier[0]) return fem ?? tier[0];
  }
  return voices[0];
}

export const voice = {
  enabled: false,
  speaking: false,
  listeners: new Set<Listener>(),
  wordListeners: new Set<() => void>(),
  generation: 0,

  get supported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  get voiceName(): string {
    return chosen?.name ?? 'system voice';
  },

  init(): void {
    if (!this.supported) return;
    chosen = pickVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      chosen = pickVoice();
    };
  },

  setSpeaking(s: boolean): void {
    this.speaking = s;
    this.listeners.forEach((l) => l(s));
  },

  stop(): void {
    this.generation++;
    if (this.supported) window.speechSynthesis.cancel();
    this.setSpeaking(false);
  },

  /** Speak text sentence by sentence (short breaths between); resolves when finished or stopped. */
  async say(text: string): Promise<void> {
    if (!this.enabled || !this.supported || !text) return;
    this.stop();
    const gen = ++this.generation;
    if (!chosen) chosen = pickVoice();
    const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
    this.setSpeaking(true);
    for (const s of sentences) {
      if (gen !== this.generation) return;
      await new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(s.trim());
        if (chosen) u.voice = chosen;
        u.rate = 0.93;
        u.pitch = 1.02;
        u.volume = 0.95;
        u.onboundary = () => this.wordListeners.forEach((l) => l());
        u.onend = () => resolve();
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      });
      if (gen !== this.generation) return;
      await new Promise((r) => setTimeout(r, 220));
    }
    if (gen === this.generation) this.setSpeaking(false);
  },
};

/* ----------------------------------------------------------------------------------------------
   A soft two-partial chime (Web Audio), so Vela's lines arrive with a sound of their own
   ---------------------------------------------------------------------------------------------- */
let audio: AudioContext | null = null;

export function chime(kind: 'arrive' | 'open' = 'arrive'): void {
  if (!voice.enabled) return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audio ??= new Ctx();
    const now = audio.currentTime;
    const base = kind === 'arrive' ? 659.25 : 523.25; // E5 / C5
    for (const [mult, gain, delay] of [[1, 0.06, 0], [1.5, 0.035, 0.09], [2.01, 0.02, 0.18]] as const) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'sine';
      o.frequency.value = base * mult;
      g.gain.setValueAtTime(0, now + delay);
      g.gain.linearRampToValueAtTime(gain, now + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.6);
      o.connect(g).connect(audio.destination);
      o.start(now + delay);
      o.stop(now + delay + 1.7);
    }
  } catch {
    /* audio unavailable */
  }
}

/* ----------------------------------------------------------------------------------------------
   Listening (Chrome / Edge / Safari)
   ---------------------------------------------------------------------------------------------- */
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

export function recognitionSupported(): boolean {
  const w = window as unknown as Record<string, unknown>;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function listen(onText: (t: string) => void, onDone: () => void): () => void {
  const w = window as unknown as Record<string, new () => RecognitionLike>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) {
    onDone();
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = 'en-US';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const t = e.results[0]?.[0]?.transcript;
    if (t) onText(t);
  };
  rec.onend = onDone;
  rec.onerror = onDone;
  voice.stop();
  rec.start();
  return () => rec.stop();
}
