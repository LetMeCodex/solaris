/**
 * Performance governor: keeps Solaris smooth from a phone to a gaming laptop.
 *
 * Two layers:
 *  - A tier, chosen once at start from the device (touch phone, CPU cores, memory, the GPU's
 *    name): it decides the costly features (ambient occlusion, edge smoothing, soft shadows, 8K
 *    maps, how many rocks are in a belt) and the sharpest resolution allowed.
 *  - A resolution scale, adjusted continuously from the measured frame time: when frames run long
 *    the picture is drawn at fewer pixels (and sharpened back up when there is headroom), so the
 *    frame rate holds instead of stuttering.
 *
 * Override with `?quality=low|medium|high` in the URL or localStorage `solaris.quality`.
 */

export type QualityTier = 'low' | 'medium' | 'high';

const STORAGE_KEY = 'solaris.quality';

export interface TierSettings {
  /** Highest device pixel ratio drawn. */
  maxDpr: number;
  /** Lowest the adaptive resolution scale may go. */
  minScale: number;
  /** Ambient occlusion on the jet. */
  ao: boolean;
  /** SMAA edge smoothing while flying. */
  smaa: boolean;
  /** Jet shadow map size (0: no shadows). */
  shadowMap: number;
  /** 8K planet maps (else 4K at most). */
  hiRes8k: boolean;
  /** Rocks per variant in an asteroid belt. */
  rocksPerVariant: number;
  /** Re-render the jet's reflection cube every N frames. */
  envEvery: number;
}

const TIERS: Record<QualityTier, TierSettings> = {
  high: { maxDpr: 2, minScale: 0.7, ao: true, smaa: true, shadowMap: 2048, hiRes8k: true, rocksPerVariant: 700, envEvery: 12 },
  medium: { maxDpr: 1.5, minScale: 0.65, ao: false, smaa: true, shadowMap: 1024, hiRes8k: false, rocksPerVariant: 420, envEvery: 24 },
  low: { maxDpr: 1, minScale: 0.55, ao: false, smaa: false, shadowMap: 0, hiRes8k: false, rocksPerVariant: 220, envEvery: 60 },
};

/** Maximum rendered framebuffer pixels per frame per tier (caps 3x phones and 4K/5K monitors). */
const MAX_BACKING_PIXELS: Record<QualityTier, number> = {
  high: 4_500_000,
  medium: 2_200_000,
  low: 1_250_000,
};

function readOverride(): QualityTier | null {
  if (typeof window === 'undefined') return null;
  try {
    const q = new URLSearchParams(window.location.search).get('quality') ?? window.localStorage.getItem(STORAGE_KEY);
    return q === 'low' || q === 'medium' || q === 'high' ? q : null;
  } catch {
    return null;
  }
}

/** The GPU's name, where the browser tells it (null otherwise). */
function gpuName(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') ?? c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return name;
  } catch {
    return null;
  }
}

/** Pick a tier from what the device says about itself. */
export function detectTier(info: {
  coarsePointer: boolean;
  shortSide: number;
  cores: number;
  memoryGb: number | null;
  gpu: string | null;
}): QualityTier {
  const gpu = info.gpu ?? '';
  // Software renderers and old integrated / mobile GPUs
  if (/SwiftShader|llvmpipe|virgl|Software Rasterizer|Basic Render|ANGLE.*Microsoft|Mali-[GT]?[3-5]\d|Mali-G6[0-8]|Mali-G7[0-6]|Adreno \(TM\) ([3-5]\d\d|61\d)|PowerVR|Intel\(R\) HD Graphics( [1-6]\d\d)?\b|Intel\(R\) UHD Graphics( [1-6]\d\d)?\b/i.test(gpu)) {
    return 'low';
  }
  const lowMem = info.memoryGb !== null && info.memoryGb <= 4;
  // Touch devices (phones and tablets): clamp to medium max so high-DPI mobile WebGL avoids OOM/thermal throttling
  if (info.coarsePointer) {
    const phone = info.shortSide < 900;
    if (phone) return lowMem || info.cores <= 6 ? 'low' : 'medium';
    return lowMem || info.cores <= 4 ? 'low' : 'medium';
  }
  if (info.cores <= 4 || lowMem) return 'low';
  if (/Intel|Iris|UHD Graphics|Arc\(TM\) A3|Radeon\(TM\) Graphics|Radeon Graphics|Vega \d|Apple M1\b|Adreno|Mali/i.test(gpu)) return 'medium';
  return 'high';
}

export class PerformanceGovernor {
  public readonly tier: QualityTier;
  public readonly settings: TierSettings;
  /** Resolution multiplier, minScale..1, adjusted from frame times. */
  public scale = 1;
  private avgMs = 16.7;
  private sinceChange = 0;
  private sinceDrop = 0;
  private ceiling = 1;
  private listeners: Array<() => void> = [];

  constructor(tier?: QualityTier) {
    if (tier) {
      this.tier = tier;
    } else {
      const override = readOverride();
      if (override) {
        this.tier = override;
      } else if (typeof window === 'undefined') {
        this.tier = 'high';
      } else {
        const nav = navigator as Navigator & { deviceMemory?: number };
        this.tier = detectTier({
          coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
          shortSide: Math.min(window.screen?.width ?? 1920, window.screen?.height ?? 1080),
          cores: nav.hardwareConcurrency ?? 8,
          memoryGb: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null,
          gpu: gpuName(),
        });
      }
    }
    this.settings = TIERS[this.tier];
    // Low-end devices start a step down and climb if there is room
    this.scale = this.tier === 'low' ? 0.8 : 1;
    this.measureRefresh();
  }

  /**
   * The display's own frame time: a 120 Hz phone should be held at 120 fps, not at 60. Measured
   * from the browser's frame callbacks at start (the quickest quarter of 40 frames), rounded to
   * the usual rates, and capped at 120 Hz.
   */
  public targetMs = 1000 / 60;
  public refreshHz = 60;
  private measureRefresh(): void {
    if (typeof requestAnimationFrame === 'undefined') return;
    const deltas: number[] = [];
    let last = 0;
    const step = (t: number): void => {
      if (last > 0) deltas.push(t - last);
      last = t;
      if (deltas.length < 40) {
        requestAnimationFrame(step);
        return;
      }
      deltas.sort((a, b) => a - b);
      const ms = deltas[Math.floor(deltas.length * 0.25)];
      if (!(ms > 2)) return;
      const hz = 1000 / ms;
      const rates = [60, 75, 90, 120, 144, 165, 240];
      const nearest = rates.reduce((best, r) => (Math.abs(r - hz) < Math.abs(best - hz) ? r : best), 60);
      this.refreshHz = nearest;
      // Target 60 fps max so 120 Hz / ProMotion phones & laptops running steady 60 fps aren't flagged as lagging
      this.targetMs = 1000 / Math.min(60, nearest);
      this.avgMs = this.targetMs;
    };
    requestAnimationFrame(step);
  }

  /** The pixel ratio to draw at, for a mode that would like at most `cap`. */
  /** Effective pixel ratio clamped by device DPR, tier cap, total backing-pixel budget, and dynamic scale. */
  public pixelRatio(cap: number, width?: number, height?: number): number {
    const hasWin = typeof window !== 'undefined';
    const dpr = hasWin ? window.devicePixelRatio || 1 : 1;
    const w = width ?? (hasWin ? window.innerWidth : 0);
    const h = height ?? (hasWin ? window.innerHeight : 0);
    let budgetCap = Infinity;
    if (w > 0 && h > 0) {
      budgetCap = Math.sqrt(MAX_BACKING_PIXELS[this.tier] / (w * h));
    }
    // Do not apply a DPR floor after the budget: at 8K even 0.5 exceeds the low tier's
    // entire framebuffer allowance. A minimum one-pixel dimension is the only hard floor.
    const minimum = w > 0 && h > 0 ? 1 / Math.min(w, h) : 0.01;
    return Math.max(minimum, Math.min(dpr, cap, this.settings.maxDpr, budgetCap) * this.scale);
  }

  /** Adaptive AO toggle: sheds GTAO under sustained frame-time pressure before crushing resolution further. */
  public get aoEnabled(): boolean {
    return this.settings.ao && this.scale >= 0.82;
  }

  /** Adaptive SMAA toggle: drops to lightweight FXAA when frame budget dips on medium/high tiers. */
  public get smaaEnabled(): boolean {
    return this.settings.smaa && this.scale >= 0.76;
  }

  /** Adaptive CloudSea render target scale (paired with temporal reprojection + bilateral upsample). */
  public get cloudScale(): number {
    const hi = this.tier === 'high' ? 0.72 : this.tier === 'medium' ? 0.6 : 0.48;
    const lo = this.tier === 'high' ? 0.54 : this.tier === 'medium' ? 0.46 : 0.38;
    const span = Math.max(1e-3, 1 - this.settings.minScale);
    const t = Math.max(0, Math.min(1, (this.scale - this.settings.minScale) / span));
    return lo + (hi - lo) * t;
  }

  /** Adaptive CloudSea raymarch step multiplier (1.0 at full scale down to 0.55 under load). */
  public get cloudStepScale(): number {
    const hi = this.tier === 'low' ? 0.78 : 1.0;
    const lo = this.tier === 'low' ? 0.5 : 0.6;
    const span = Math.max(1e-3, 1 - this.settings.minScale);
    const t = Math.max(0, Math.min(1, (this.scale - this.settings.minScale) / span));
    return lo + (hi - lo) * t;
  }

  /** Called when the resolution scale changes (resize the render targets). Returns an unsubscribe callback. */
  public onChange(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      const idx = this.listeners.indexOf(fn);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  /**
   * Feed one frame's duration (ms). Long frames for a while lower the resolution a step; plenty of
   * headroom for a longer while raises it. Steps are spaced out so the picture does not pulse.
   */
  public frame(ms: number): void {
    // Ignore stalls (tab switches, shader compiles): they are not the steady cost of drawing
    if (!Number.isFinite(ms) || ms <= 0 || ms > 250) return;
    this.avgMs += (ms - this.avgMs) * 0.05;
    this.sinceChange += ms;
    this.sinceDrop += ms;
    // A drop sets a temporary ceiling so transient streaming bursts don't oscillate resolution,
    // while releasing promptly (12 s) so crisp world tiles and text recover quickly.
    if (this.sinceDrop > 12000) this.ceiling = 1;
    let next = this.scale;
    // Frame times come from the display's refresh (16.7 ms at 60 Hz, 8.3 at 120), so "headroom"
    // means holding the display's rate; ~42% over target steps down gently instead of crushing clarity.
    if (this.avgMs > this.targetMs * 1.42 && this.sinceChange > 1800) {
      next = Math.max(this.settings.minScale, this.scale * 0.9);
      this.ceiling = this.scale;
      this.sinceDrop = 0;
    } else if (this.avgMs < this.targetMs * 1.1 && this.sinceChange > 3500) {
      next = Math.min(1, this.ceiling * 0.999, this.scale * 1.08);
    }
    if (Math.abs(next - this.scale) > 0.02) {
      this.scale = next;
      this.sinceChange = 0;
      for (const fn of this.listeners) fn();
    }
  }

  /** Average frame time (ms), for display. */
  public get frameMs(): number {
    return this.avgMs;
  }
}

/** The one governor for the app. */
export const perf = new PerformanceGovernor();
