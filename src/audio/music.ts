import { CatalogueManager } from '../data/CatalogueManager';
import { audioCtx, voice } from '../companion/voice';

/**
 * The Solaris soundtrack (Slowed + Reverb, Lofi Edition): one track for each world and one for the
 * black hole. The music follows where you are: arriving in a new system crossfades to its track,
 * and moons share their planet's. It plays softly under everything and steps back further whenever
 * Vela speaks. Two decks crossfade, so tracks never overlap harshly or cut off.
 */

export interface Track {
  n: string;
  title: string;
  mood: string;
  slug: string;
  /** The world it belongs to. */
  world: string;
}

export const TRACKS: Track[] = [
  { n: '00', title: 'Helios Overture', mood: 'A dying sun adrift in deep space', slug: '00-helios-overture', world: 'Sun' },
  { n: '01', title: 'Quicksilver Clockwork', mood: 'Mechanical moons slowing down', slug: '01-quicksilver-clockwork', world: 'Mercury' },
  { n: '02', title: 'Veil of Sulphur', mood: 'Amber haze & quiet echoes', slug: '02-veil-of-sulphur', world: 'Venus' },
  { n: '03', title: 'Pale Blue Lullaby', mood: 'Gentle waves under a frozen sky', slug: '03-pale-blue-lullaby', world: 'Earth' },
  { n: '04', title: 'Red Dust Drums', mood: 'Distant pulses in the rust storm', slug: '04-red-dust-drums', world: 'Mars' },
  { n: '05', title: 'Cathedral of Storms', mood: 'Violet twilight across the nave', slug: '05-cathedral-of-storms', world: 'Jupiter' },
  { n: '06', title: 'Orbit of Glass Rings', mood: 'Floating shards in motionless orbit', slug: '06-orbit-of-glass-rings', world: 'Saturn' },
  { n: '07', title: 'Frozen Tilt', mood: 'Crystalline calm in eternal winter', slug: '07-frozen-tilt', world: 'Uranus' },
  { n: '08', title: 'Deep Blue Echoes', mood: 'Submerged transmissions from the abyss', slug: '08-deep-blue-echoes', world: 'Neptune' },
  { n: '09', title: 'Event Horizon Silence', mood: 'Eternal stillness at the edge of time', slug: '09-event-horizon-silence', world: 'Sagittarius A*' },
];

const BASE = `${import.meta.env.BASE_URL || '/'}music/`;
export const coverUrl = (t: Track): string => `${BASE}${t.slug}.jpg`;
const audioUrl = (t: Track): string => `${BASE}${t.slug}.mp3`;

/** Which track belongs to a place: its own, its planet's, or the nearest world's by distance from the Sun. */
export function trackFor(body: string): number {
  const own = TRACKS.findIndex((t) => t.world === body);
  if (own >= 0) return own;
  const def = CatalogueManager.getBody(body);
  if (!def) return 0;
  if (def.category === 'black_hole') return 9;
  if (def.parentName) {
    const parent = TRACKS.findIndex((t) => t.world === def.parentName);
    if (parent >= 0) return parent;
    const p = CatalogueManager.getBody(def.parentName);
    if (p) return trackFor(p.name);
  }
  // Small worlds and dwarf planets: the track of the planet whose orbit is closest to theirs
  const a = def.orbit?.semiMajorAxisAU ?? 0;
  const zones: [number, number][] = [[0.39, 1], [0.72, 2], [1, 3], [1.52, 4], [2.9, 4], [5.2, 5], [9.5, 6], [19.2, 7], [30, 8]];
  let best = 8, d = Infinity;
  for (const [au, i] of zones) {
    if (Math.abs(Math.log(Math.max(a, 0.05) / au)) < d) {
      d = Math.abs(Math.log(Math.max(a, 0.05) / au));
      best = i;
    }
  }
  return best;
}

const PREFS_KEY = 'solaris.music';
/** Soft by default: a little under Vela, never in the way. */
export const DEFAULT_VOLUME = 0.32;
/** How much the music steps back while she speaks. */
const DUCK = 0.38;
const FADE = 4.5;

export interface MusicState {
  track: number;
  playing: boolean;
  volume: number;
  muted: boolean;
  /** Follow the planets (true), or play the album you picked (false). */
  follow: boolean;
  /** 0..1 through the current track. */
  progress: number;
  duration: number;
}

interface Deck {
  el: HTMLAudioElement;
  gain: GainNode | null;
  track: number;
}

function loadPrefs(): Partial<MusicState> {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') as Partial<MusicState>;
  } catch {
    return {};
  }
}

class MusicDirector {
  state: MusicState;
  private listeners = new Set<(s: MusicState) => void>();
  private decks: Deck[] = [];
  private live = 0;
  private bus: GainNode | null = null;
  private wanted = 0;
  private restTimer = 0;
  private looping = false;

  constructor() {
    const p = loadPrefs();
    this.state = {
      track: 0, playing: false, volume: typeof p.volume === 'number' ? p.volume : DEFAULT_VOLUME,
      muted: !!p.muted, follow: p.follow !== false, progress: 0, duration: 0,
    };
    voice.listeners.add(() => this.applyLevel(0.5));
  }

  subscribe(fn: (s: MusicState) => void): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private set(patch: Partial<MusicState>): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l(this.state));
    if ('volume' in patch || 'muted' in patch || 'follow' in patch) {
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify({ volume: this.state.volume, muted: this.state.muted, follow: this.state.follow }));
      } catch {
        /* private mode */
      }
    }
  }

  private ensure(): boolean {
    if (this.decks.length) return true;
    const ctx = audioCtx();
    if (ctx) {
      this.bus = ctx.createGain();
      this.bus.connect(ctx.destination);
    }
    for (let i = 0; i < 2; i++) {
      const el = new Audio();
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      let gain: GainNode | null = null;
      if (ctx && this.bus) {
        try {
          gain = ctx.createGain();
          gain.gain.value = 0;
          ctx.createMediaElementSource(el).connect(gain).connect(this.bus);
        } catch {
          gain = null;
        }
      }
      const deck: Deck = { el, gain, track: -1 };
      el.addEventListener('timeupdate', () => this.onTime(deck));
      el.addEventListener('ended', () => this.onEnded(deck));
      this.decks.push(deck);
    }
    this.applyLevel(0);
    return true;
  }

  /** Overall level: volume, muted, and stepping back under Vela's voice. */
  private applyLevel(seconds: number): void {
    const ctx = audioCtx();
    const level = this.state.muted ? 0 : this.state.volume * (voice.speaking ? DUCK : 1);
    if (this.bus && ctx) {
      this.bus.gain.cancelScheduledValues(ctx.currentTime);
      this.bus.gain.setTargetAtTime(level, ctx.currentTime, Math.max(0.01, seconds / 3));
    } else {
      // No Web Audio: element volume carries everything
      this.decks.forEach((d) => (d.el.volume = d === this.decks[this.live] ? level : 0));
    }
  }

  private fade(deck: Deck, to: number, seconds: number): void {
    const ctx = audioCtx();
    if (deck.gain && ctx) {
      const g = deck.gain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      g.linearRampToValueAtTime(to, ctx.currentTime + seconds);
    }
  }

  /** Crossfade to a track on the other deck. */
  private cue(track: number, seconds = FADE): void {
    if (!this.ensure()) return;
    window.clearTimeout(this.restTimer);
    const prev = this.decks[this.live];
    this.live = 1 - this.live;
    const next = this.decks[this.live];
    next.track = track;
    next.el.src = audioUrl(TRACKS[track]);
    next.el.currentTime = 0;
    void next.el.play().catch(() => undefined);
    this.fade(next, 1, prev.track >= 0 && !prev.el.paused ? seconds : 1.2);
    if (!prev.el.paused) {
      this.fade(prev, 0, seconds);
      window.setTimeout(() => prev !== this.decks[this.live] && prev.el.pause(), seconds * 1000 + 200);
    }
    this.applyLevel(0.3);
    this.set({ track, playing: true, progress: 0 });
  }

  private onTime(deck: Deck): void {
    if (deck !== this.decks[this.live]) return;
    const d = deck.el.duration;
    if (!Number.isFinite(d) || d <= 0) return;
    this.set({ progress: deck.el.currentTime / d, duration: d });
    // The album plays on: crossfade into the next track a little before this one ends
    if (!this.state.follow && !this.looping && d - deck.el.currentTime < FADE) {
      this.looping = true;
      this.cue((this.state.track + 1) % TRACKS.length);
      window.setTimeout(() => (this.looping = false), FADE * 1000 + 500);
    }
  }

  /** Following the planets, a world's track rests for a breath of silence and then plays again. */
  private onEnded(deck: Deck): void {
    if (deck !== this.decks[this.live] || !this.state.follow || !this.state.playing) return;
    const track = this.state.track;
    this.restTimer = window.setTimeout(() => {
      if (this.state.playing && this.state.follow && this.state.track === track) this.cue(track, 2.5);
    }, 9000 + Math.random() * 9000);
  }

  /* ------------------------------------------------------------------ public */

  /** Start (from a click, so the browser allows sound). */
  start(at?: string): void {
    if (at) this.wanted = trackFor(at);
    this.cue(this.state.follow ? this.wanted : this.state.track);
  }

  /** Where you are now: in follow mode, the music moves with you. */
  arriveAt(body: string): void {
    this.wanted = trackFor(body);
    if (this.state.follow && this.state.playing && this.wanted !== this.state.track) this.cue(this.wanted);
    else if (this.state.follow && !this.state.playing) this.set({ track: this.wanted });
  }

  /** Pick a track yourself: the album plays on from there. */
  pick(track: number): void {
    this.set({ follow: false });
    this.cue(track, 2.2);
  }

  follow(on: boolean): void {
    this.set({ follow: on });
    if (on && this.state.playing && this.state.track !== this.wanted) this.cue(this.wanted);
  }

  toggle(): void {
    if (this.state.playing) this.pause();
    else this.cue(this.state.follow ? this.wanted : this.state.track, 1.5);
  }

  pause(): void {
    window.clearTimeout(this.restTimer);
    const deck = this.decks[this.live];
    if (deck) {
      this.fade(deck, 0, 0.8);
      window.setTimeout(() => !this.state.playing && deck.el.pause(), 900);
    }
    this.set({ playing: false });
  }

  next(dir: 1 | -1): void {
    this.pick((this.state.track + dir + TRACKS.length) % TRACKS.length);
  }

  seek(fraction: number): void {
    const d = this.decks[this.live];
    if (d && Number.isFinite(d.el.duration)) d.el.currentTime = fraction * d.el.duration;
  }

  setVolume(v: number): void {
    this.set({ volume: Math.max(0, Math.min(1, v)), muted: v <= 0.001 ? true : false });
    this.applyLevel(0.15);
  }

  setMuted(m: boolean): void {
    this.set({ muted: m });
    this.applyLevel(0.4);
  }
}

export const music = new MusicDirector();
