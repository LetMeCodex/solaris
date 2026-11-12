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
  high: { maxDpr: 2, minScale: 0.6, ao: true, smaa: true, shadowMap: 2048, hiRes8k: true, rocksPerVariant: 700, envEvery: 12 },
  medium: { maxDpr: 1.5, minScale: 0.55, ao: false, smaa: true, shadowMap: 1024, hiRes8k: false, rocksPerVariant: 420, envEvery: 24 },
  low: { maxDpr: 1, minScale: 0.5, ao: false, smaa: false, shadowMap: 0, hiRes8k: false, rocksPerVariant: 220, envEvery: 60 },
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
  if (/SwiftShader|llvmpipe|Basic Render|Mali-[GT]?[4-7]\d|Adreno \(TM\) [3-5]\d\d|PowerVR|Intel\(R\) (HD|UHD) Graphics( [1-6]\d\d)?\b/i.test(gpu)) return 'low';
  const phone = info.coarsePointer && info.shortSide < 900;
  if (phone) return (info.memoryGb !== null && info.memoryGb <= 4) || info.cores <= 6 ? 'low' : 'medium';
  if (info.cores <= 4 || (info.memoryGb !== null && info.memoryGb <= 4)) return 'low';
  if (/Intel|Iris|Radeon\(TM\) Graphics|Vega \d|Apple M1\b|Adreno|Mali/i.test(gpu)) return 'medium';
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
      this.targetMs = 1000 / Math.min(120, nearest);
      this.avgMs = this.targetMs;
    };
    requestAnimationFrame(step);
  }

  /** The pixel ratio to draw at, for a mode that would like at most `cap`. */
  public pixelRatio(cap: number): number {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    return Math.max(0.5, Math.min(dpr, cap, this.settings.maxDpr) * this.scale);
  }

  /** Called when the resolution scale changes (resize the render targets). */
  public onChange(fn: () => void): void {
    this.listeners.push(fn);
  }

  /**
   * Feed one frame's duration (ms). Long frames for a while lower the resolution a step; plenty of
   * headroom for a longer while raises it. Steps are spaced out so the picture does not pulse.
   */
  public frame(ms: number): void {
    // Ignore stalls (tab switches, shader compiles): they are not the steady cost of drawing
    if (ms > 250) return;
    this.avgMs += (ms - this.avgMs) * 0.05;
    this.sinceChange += ms;
    this.sinceDrop += ms;
    // A drop sets a ceiling for a while: the scale that was too slow is not retried for 30 s
    if (this.sinceDrop > 30000) this.ceiling = 1;
    let next = this.scale;
    // Frame times come from the display's refresh (16.7 ms at 60 Hz, 8.3 at 120), so "headroom"
    // means holding the display's rate (up to 120 fps); ~30% under it, the picture steps down
    if (this.avgMs > this.targetMs * 1.4 && this.sinceChange > 1500) {
      next = Math.max(this.settings.minScale, this.scale * 0.85);
      this.ceiling = this.scale;
      this.sinceDrop = 0;
    } else if (this.avgMs < this.targetMs * 1.07 && this.sinceChange > 5000) {
      next = Math.min(1, this.ceiling * 0.999, this.scale * 1.1);
    }
    if (Math.abs(next - this.scale) > 0.01) {
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
