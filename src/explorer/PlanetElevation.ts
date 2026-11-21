/**
 * Real ground heights for worlds other than Earth, streamed as equirectangular tiles and raised
 * into 3D relief by the surface tiles (the same seam Earth's terrain uses: ElevationSource).
 *
 * Sources (see ASSETS.md):
 * - Moon: SLDEM2015, the LRO LOLA + SELENE/Kaguya TC merged DEM (512 px/°, ~59 m, ±60° latitude)
 *   and the LRO LOLA global DEM (128 px/°) beyond it, both from NASA Moon Trek. Trek serves these
 *   DEMs as 8-bit greyscale tiles on a linear stretch, calibrated here: the global layer reaches 0 at
 *   Antoniadi's floor and 255 on the far-side summit near Engel'gardt (the LOLA extremes, −9.15 and
 *   +10.76 km about 1737.4 km), and reads −1.89 km at Tranquility Base (published: about −1.9 km).
 *   The SLDEM layer was regressed on it over 36,894 pixels (mean residual under half a step).
 *   One step is ~77 m, so heights are smoothed after decoding (the imagery carries the fine shading).
 * - Mars: the HRSC + MOLA blended DEM (200 m) from Esri's astro ImageServer, as LERC1 float32 tiles
 *   (heights in metres about the 3396.19 km Mars 2000 sphere's areoid).
 *
 * Tiles fetch through `TileCache` (deduplication, per-host concurrency, priority queue, persistence)
 * and decode off-thread via `demDecode.worker.ts` (`DemDecoder`) with safe main-thread fallback.
 *
 * Heights are returned above each world's lowest point (`datumKm`), never below 0: the drawn globe
 * is a smooth sphere and ground beneath it would be hidden by it. Everything (tiles, the eye,
 * landmark labels, aircraft collision) reads the same function, so the ground you stand on is the
 * ground drawn.
 */
import { earthElevation, type ElevationSample } from './Elevation';
import { perf } from '../rendering/Performance';
import { demDecoder, float32Pool, tileCache } from './TileCache';
import { decodeTrek8Rgba } from './demDecode.worker';

export type { ElevationSample };

/** What the surface tiles, surface view, and flight physics need from a height source. */
export interface ElevationSource {
  /** The service could not be reached: the ground stays flat. */
  disabled: boolean;
  /** Load every height tile covering the box at zoom z (resolves when they are in, or failed). */
  ensure(south: number, west: number, north: number, east: number, z: number): Promise<void>;
  /** Height (km) at a point from the best loaded tile at or below zoom z. */
  heightKm(latDeg: number, lonDeg: number, z: number): number;
  /** Optional authoritative height in metres (`heightKm * 1000`). */
  heightMeters?(latDeg: number, lonDeg: number, z?: number): number;
  /** Optional detailed sync sample with loaded zoom level and readiness state. */
  sampleElevation?(latDeg: number, lonDeg: number, z?: number): ElevationSample;
  /** Optional async sample that awaits covering DEM tiles up to `timeoutMs`. */
  sampleElevationAsync?(latDeg: number, lonDeg: number, z?: number, timeoutMs?: number): Promise<ElevationSample>;
  /** Optional coverage check at or above `minZoom`. */
  hasCoverage?(latDeg: number, lonDeg: number, minZoom?: number): boolean;
  /** A height zoom for a patch of ground `spanDeg` across (about one height sample per vertex). */
  zoomFor(spanDeg: number): number;
  /** Abort in-flight/queued height fetches when switching away from a world. */
  cancelPending?(): void;
}

interface DemLayer {
  /** Tile URL for level z, row y, column x (2 × 1 tiles of 180° at level 0). */
  url: (z: number, y: number, x: number) => string;
  format: 'trek8' | 'lerc1';
  tileSize: number;
  maxZ: number;
  /** Latitude band covered (degrees). */
  south: number;
  north: number;
  /** Broken remote pyramid zoom levels to step down past (e.g. HTTP 500 CORS holes). */
  skipZ?: readonly number[];
  /** trek8: height km = a + b × grey value. */
  a?: number;
  b?: number;
}

interface HeightTile {
  heights: Float32Array | null;
  w: number;
  h: number;
  /** true: samples sit on the tile edges (LERC 513 × 513); false: pixel centres (PNG 256 × 256). */
  corner: boolean;
  promise: Promise<void>;
  lastUsed: number;
  z?: number;
  retryAt?: number;
}

const COARSE_FALLBACK_Z = 3;
const TILE_TIMEOUT_MS = 18_000;
const COOLDOWN_MS = 20_000;

const TIER_CACHE = { low: 90, medium: 150, high: 220 } as const;

class HttpStatusError extends Error {
  constructor(public readonly status: number) {
    super(String(status));
  }
}

export class PlanetElevation implements ElevationSource {
  private tiles = new Map<string, HeightTile>();
  private activeAborts = new Set<() => void>();
  private epoch = 0;
  private failures = 0;
  private disabledUntil = 0;
  private loadedCount = 0;
  private decodeCanvas: HTMLCanvasElement | null = null;
  private decodeCtx: CanvasRenderingContext2D | null = null;

  public get disabled(): boolean {
    if (this.disabledUntil > 0 && performance.now() >= this.disabledUntil) {
      this.disabledUntil = 0;
      this.failures = 0;
    }
    return this.disabledUntil > 0;
  }

  public set disabled(value: boolean) {
    this.disabledUntil = value ? performance.now() + COOLDOWN_MS : 0;
    if (!value) this.failures = 0;
  }

  constructor(
    public readonly body: string,
    private layers: DemLayer[],
    /** Added to every height so the lowest ground on the world sits at 0. */
    public readonly datumKm: number
  ) {}

  private get cachePrefix(): string {
    return `dem:${this.body}:`;
  }

  public zoomFor(spanDeg: number): number {
    // One height tile per surface tile (as on Earth): 256–512 samples for its 32 vertices, so every
    // vertex reads well-resolved heights and neighbouring levels of detail agree along their shared
    // edges.
    const z = Math.floor(Math.log2(180 / Math.max(spanDeg, 1e-6)));
    return Math.max(0, this.layers[0].tileSize >= 512 ? z - 1 : z);
  }

  public ensure(south: number, west: number, north: number, east: number, z: number): Promise<void> {
    if (this.disabled || ![south, west, north, east, z].every(Number.isFinite)) return Promise.resolve();
    const jobs: Promise<void>[] = [];
    for (const [li, l] of this.layers.entries()) {
      if (north < l.south || south > l.north) continue;
      const queueZoom = (zz: number, priority: number): void => {
        const span = 180 / 2 ** zz;
        const s = Math.max(south, l.south);
        const n = Math.min(north, l.north);
        const y0 = Math.max(0, Math.floor((90 - n) / span));
        const y1 = Math.min(2 ** zz - 1, Math.floor((90 - s) / span));
        const cols = 2 ** (zz + 1);
        const x0 = Math.floor((west + 180) / span);
        const x1 = Math.floor((east + 180) / span);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            jobs.push(this.load(li, zz, y, ((x % cols) + cols) % cols, priority));
          }
        }
      };
      const resolveZ = (target: number): number => {
        let r = Math.min(target, l.maxZ);
        while (r > 0 && l.skipZ?.includes(r)) r--;
        return r;
      };
      const zz = resolveZ(Math.max(0, Math.floor(z)));
      // Warm a coarse global baseline at highest priority so partial-coverage 404s or slow high-z tiles never drop terrain to 0
      const isGlobal = l.south <= -90 && l.north >= 90;
      if ((isGlobal || li === this.layers.length - 1) && zz > COARSE_FALLBACK_Z) {
        queueZoom(resolveZ(Math.min(COARSE_FALLBACK_Z, l.maxZ)), -500);
      }
      queueZoom(zz, zz * 10 + li * 2);
    }
    return Promise.all(jobs).then(() => undefined);
  }

  public heightKm(latDeg: number, lonDeg: number, z: number = 13): number {
    return this.sampleElevation(latDeg, lonDeg, z).heightKm;
  }

  public heightMeters(latDeg: number, lonDeg: number, z: number = 13): number {
    return this.heightKm(latDeg, lonDeg, z) * 1000;
  }

  public sampleElevation(latDeg: number, lonDeg: number, z: number = 13): ElevationSample {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg) || !Number.isFinite(z)) {
      return { heightKm: 0, heightMeters: 0, loadedZoom: -1, ready: false };
    }
    const lat = Math.max(-90, Math.min(90, latDeg));
    const lon = ((((lonDeg + 180) % 360) + 360) % 360) - 180;
    for (const [li, l] of this.layers.entries()) {
      if (lat < l.south || lat > l.north) continue;
      for (let zz = Math.min(Math.floor(z), l.maxZ); zz >= 0; zz--) {
        const span = 180 / 2 ** zz;
        const gx = (lon + 180) / span;
        const gy = (90 - lat) / span;
        const tx = Math.min(2 ** (zz + 1) - 1, Math.floor(gx));
        const ty = Math.min(2 ** zz - 1, Math.floor(gy));
        const t = this.tiles.get(`${li}/${zz}/${ty}/${tx}`);
        if (!t?.heights) continue;
        const h = this.sample(t, gx - tx, gy - ty);
        if (Number.isNaN(h)) continue;
        const km = Math.max(0, h + this.datumKm);
        return { heightKm: km, heightMeters: km * 1000, loadedZoom: zz, ready: true };
      }
    }
    return { heightKm: 0, heightMeters: 0, loadedZoom: -1, ready: false };
  }

  public async sampleElevationAsync(
    latDeg: number,
    lonDeg: number,
    z: number = 13,
    timeoutMs = 4000
  ): Promise<ElevationSample> {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg)) {
      return { heightKm: 0, heightMeters: 0, loadedZoom: -1, ready: false };
    }
    const maxZ = Math.max(...this.layers.map((l) => l.maxZ));
    const targetZ = Math.max(0, Math.min(maxZ, Math.floor(z)));
    const cur = this.sampleElevation(latDeg, lonDeg, targetZ);
    if (cur.loadedZoom >= targetZ || this.disabled) return cur;
    const eps = 1e-4;
    const job = this.ensure(latDeg - eps, lonDeg - eps, latDeg + eps, lonDeg + eps, targetZ);
    if (timeoutMs > 0 && Number.isFinite(timeoutMs)) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([
        job,
        new Promise<void>((resolve) => {
          timer = setTimeout(resolve, timeoutMs);
        }),
      ]);
      if (timer !== undefined) clearTimeout(timer);
    } else {
      await job;
    }
    return this.sampleElevation(latDeg, lonDeg, targetZ);
  }

  public hasCoverage(latDeg: number, lonDeg: number, minZoom = 0): boolean {
    const sample = this.sampleElevation(latDeg, lonDeg, 16);
    return sample.ready && sample.loadedZoom >= minZoom;
  }

  /** Bilinear height (km) at (u, v) in a tile, 0..1 from its north-west corner; NaN off the data. */
  private sample(t: HeightTile, u: number, v: number): number {
    t.lastUsed = performance.now();
    const fx = t.corner ? u * (t.w - 1) : Math.min(t.w - 1, Math.max(0, u * t.w - 0.5));
    const fy = t.corner ? v * (t.h - 1) : Math.min(t.h - 1, Math.max(0, v * t.h - 0.5));
    const x0 = Math.min(t.w - 1, Math.floor(fx));
    const y0 = Math.min(t.h - 1, Math.floor(fy));
    const x1 = Math.min(t.w - 1, x0 + 1);
    const y1 = Math.min(t.h - 1, y0 + 1);
    const a = fx - x0;
    const b = fy - y0;
    const H = t.heights!;
    // A no-data neighbour with zero weight must not poison a perfectly valid edge sample
    // (NaN * 0 is NaN). Renormalize available samples at sparse DEM coverage boundaries.
    const s00 = H[y0 * t.w + x0];
    const s10 = H[y0 * t.w + x1];
    const s01 = H[y1 * t.w + x0];
    const s11 = H[y1 * t.w + x1];
    const w00 = (1 - a) * (1 - b);
    const w10 = a * (1 - b);
    const w01 = (1 - a) * b;
    const w11 = a * b;
    let sum = 0;
    let weight = 0;
    if (Number.isFinite(s00) && w00 > 0) { sum += s00 * w00; weight += w00; }
    if (Number.isFinite(s10) && w10 > 0) { sum += s10 * w10; weight += w10; }
    if (Number.isFinite(s01) && w01 > 0) { sum += s01 * w01; weight += w01; }
    if (Number.isFinite(s11) && w11 > 0) { sum += s11 * w11; weight += w11; }
    return weight > 0 ? sum / weight : NaN;
  }

  private getDecodeContext(w: number, h: number): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null;
    if (!this.decodeCanvas) {
      this.decodeCanvas = document.createElement('canvas');
      this.decodeCanvas.width = w;
      this.decodeCanvas.height = h;
      this.decodeCtx = this.decodeCanvas.getContext('2d', { willReadFrequently: true });
    } else if (this.decodeCanvas.width !== w || this.decodeCanvas.height !== h) {
      this.decodeCanvas.width = w;
      this.decodeCanvas.height = h;
    }
    return this.decodeCtx;
  }

  public cancelPending(): void {
    this.epoch++;
    tileCache.cancelAll(this.cachePrefix);
    for (const abort of [...this.activeAborts]) abort();
    this.activeAborts.clear();
    for (const [k, t] of this.tiles) {
      if (!t.heights) this.tiles.delete(k);
    }
  }

  private async fetchTileOnce(
    layer: DemLayer,
    url: string,
    reqEpoch: number,
    cacheKey = `${this.cachePrefix}${url}`,
    z = 4,
    priority = z * 10
  ): Promise<{ heights: Float32Array; w: number; h: number }> {
    if (this.epoch !== reqEpoch) throw new HttpStatusError(0);
    const res = await tileCache.fetchBuffer(cacheKey, url, {
      priority,
      z,
      timeoutMs: TILE_TIMEOUT_MS,
      hysteresisMs: 600,
      persist: true,
      detectEsriNoData: false,
    });
    if (this.epoch !== reqEpoch) throw new HttpStatusError(0);

    if (res.status === 'ok' && res.data) {
      if (layer.format === 'lerc1') {
        const decoded = await demDecoder.decodeLerc1(res.data, 1000);
        if (!decoded) throw new Error('lerc1 decode failed');
        return { heights: decoded.heights, w: decoded.width, h: decoded.height };
      }
      const decoded = await demDecoder.decodeTrek8(res.data, layer.a ?? 0, layer.b ?? 1);
      if (decoded) {
        return { heights: decoded.heights, w: decoded.width, h: decoded.height };
      }
    }

    if (res.httpStatus && res.httpStatus >= 400) {
      throw new HttpStatusError(res.httpStatus);
    }
    if (res.status === 'aborted') {
      throw new HttpStatusError(0);
    }

    // Safe HTMLImageElement fallback for Trek 8-bit PNGs when OffscreenCanvas/fetch decode is unavailable
    if (layer.format === 'trek8' && typeof Image !== 'undefined' && typeof document !== 'undefined') {
      const img = await loadImage(url, TILE_TIMEOUT_MS, this.activeAborts);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (w <= 0 || h <= 0) throw new Error('empty image');
      const ctx = this.getDecodeContext(w, h);
      if (!ctx) throw new Error('canvas unavailable');
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
      const px = ctx.getImageData(0, 0, w, h).data;
      return { heights: decodeGrey(px, w, h, layer.a ?? 0, layer.b ?? 1), w, h };
    }

    throw new Error('fetch failed');
  }

  private load(li: number, z: number, y: number, x: number, priority = z * 10): Promise<void> {
    const key = `${li}/${z}/${y}/${x}`;
    const have = this.tiles.get(key);
    if (have && (!have.retryAt || performance.now() < have.retryAt)) {
      have.lastUsed = performance.now();
      if (!have.heights) tileCache.updatePriority(`${this.cachePrefix}${key}`, priority);
      return have.promise;
    }
    if (have) this.tiles.delete(key);
    const reqEpoch = this.epoch;
    const layer = this.layers[li];
    const partialBand = layer.south > -90 || layer.north < 90;
    const tile: HeightTile = {
      heights: null,
      w: 0,
      h: 0,
      corner: layer.format === 'lerc1',
      promise: Promise.resolve(),
      lastUsed: performance.now(),
      z,
    };
    const url = layer.url(z, y, x);
    const cacheKey = `${this.cachePrefix}${key}`;
    tile.promise = (async () => {
      try {
        let decoded: { heights: Float32Array; w: number; h: number };
        try {
          decoded = await this.fetchTileOnce(layer, url, reqEpoch, cacheKey, z, priority);
        } catch (err) {
          if (this.epoch !== reqEpoch) throw err;
          // Do not waste retries on 404/400 coverage edges or while offline cooldown is active
          if (err instanceof HttpStatusError && (err.status === 404 || err.status === 400)) throw err;
          if (this.disabled) throw err;
          await new Promise((r) => setTimeout(r, 650));
          if (this.epoch !== reqEpoch) throw new HttpStatusError(0);
          decoded = await this.fetchTileOnce(layer, url, reqEpoch, cacheKey, z, priority);
        }
        tile.heights = decoded.heights;
        tile.w = decoded.w;
        tile.h = decoded.h;
        tile.lastUsed = performance.now();
        this.loadedCount++;
        this.failures = 0;
        this.disabledUntil = 0;
      } catch (err) {
        if (this.epoch !== reqEpoch) return;
        // Cache failures briefly too. Otherwise each new imagery tile re-requests the same
        // missing DEM edge, starving useful height requests during a landing.
        tile.retryAt =
          performance.now() +
          (err instanceof HttpStatusError && (err.status === 404 || err.status === 400) ? 120_000 : COOLDOWN_MS);
        // Partial-latitude layers (e.g. Moon SLDEM ±60°) 404 at their border and fall back to global LOLA;
        // only full-globe layer errors trigger outage cooldown so polar 404s never kill terrain.
        if (!partialBand && !(err instanceof HttpStatusError && (err.status === 404 || err.status === 400))) {
          const limit = this.loadedCount > 0 ? 32 : 16;
          if (++this.failures >= limit) this.disabledUntil = performance.now() + COOLDOWN_MS;
        }
      }
    })();
    this.tiles.set(key, tile);
    this.evict();
    return tile.promise;
  }

  private evict(): void {
    const maxCache = TIER_CACHE[perf.tier];
    if (this.tiles.size <= maxCache) return;
    const cutoff = performance.now() - 15_000;
    const old = [...this.tiles.entries()]
      .filter(([, t]) => (t.heights || t.retryAt) && (t.z ?? 10) > COARSE_FALLBACK_Z && t.lastUsed < cutoff)
      .sort((p, q) => p[1].lastUsed - q[1].lastUsed);
    for (const [k, t] of old.slice(0, this.tiles.size - maxCache)) {
      this.tiles.delete(k);
      if (t.heights) {
        float32Pool.release(t.heights);
        t.heights = null;
      }
    }
  }
}

function loadImage(url: string, timeoutMs: number, activeAborts: Set<() => void>): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    let settled = false;
    const cleanup = (): void => {
      clearTimeout(timer);
      activeAborts.delete(abort);
    };
    const abort = (): void => {
      if (settled) return;
      settled = true;
      cleanup();
      img.onload = null;
      img.onerror = null;
      img.src = '';
      reject(new Error('aborted'));
    };
    const timer = setTimeout(abort, timeoutMs);
    activeAborts.add(abort);
    img.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();
      if (!(img.naturalWidth > 0 && img.naturalHeight > 0) || img.width <= 0 || img.height <= 0) {
        reject(new Error('image'));
        return;
      }
      resolve(img);
    };
    img.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('image'));
    };
    img.src = url;
  });
}

/**
 * 8-bit greyscale heights (alpha 0 = no data) → km, then smoothed: one grey step is ~77 m, so on
 * gentle slopes the raw values form terraces. Two passes of a 3 × 3 mean (ignoring no-data) turn
 * the steps back into slopes without moving crater rims or peaks by more than a step.
 */
export function decodeGrey(rgba: Uint8ClampedArray | Uint8Array, w: number, h: number, a: number, b: number): Float32Array {
  return decodeTrek8Rgba(rgba, w, h, a, b);
}

const TREK = (layer: string) => (z: number, y: number, x: number) =>
  `https://trek.nasa.gov/tiles/Moon/EQ/${layer}/1.0.0/default/default028mm/${z}/${y}/${x}.png`;

/** LOLA global DEM grey stretch: 0 → −9.15 km, 255 → +10.76 km (see the header). */
const LOLA_A = -9.15;
const LOLA_B = 19.91 / 255;

const SOURCES: Record<string, () => PlanetElevation> = {
  Moon: () =>
    new PlanetElevation(
      'Moon',
      [
        // SLDEM2015: level 8 is ~2.8e-3°/px, about the data's own 59 m
        { url: TREK('LRO_LOLAKaguya_DEM_60N60S_512ppd'), format: 'trek8', tileSize: 256, maxZ: 8, south: -60, north: 60, a: -8.8194, b: 0.07716 },
        { url: TREK('LRO_LOLA_DEM_Global_128ppd_v04'), format: 'trek8', tileSize: 256, maxZ: 5, south: -90, north: 90, a: LOLA_A, b: LOLA_B },
      ],
      9.2
    ),
  Mars: () =>
    new PlanetElevation(
      'Mars',
      [
        {
          url: (z, y, x) => `https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer/tile/${z}/${y}/${x}`,
          format: 'lerc1',
          tileSize: 512,
          maxZ: 7,
          south: -90,
          north: 90,
          // ArcGIS MDEM200M returns HTTP 500 without CORS headers on z=3 and z=4 cache bundles
          skipZ: [3, 4],
        },
      ],
      8.3
    ),
};

const instances = new Map<string, PlanetElevation>();

/** The real height source for a world other than Earth, or null where none is available. */
export function planetElevation(body: string): PlanetElevation | null {
  const make = SOURCES[body];
  if (!make) return null;
  let e = instances.get(body);
  if (!e) instances.set(body, (e = make()));
  return e;
}

/** Worlds with streamed real elevation (Earth's lives in Elevation.ts). */
export const RELIEF_BODIES = Object.keys(SOURCES);

/** The height source for any world (Earth included), or null where the ground is flat imagery. */
export function elevationFor(body: string): ElevationSource | null {
  return body === 'Earth' ? earthElevation : planetElevation(body);
}

/**
 * Height of the drawn ground (km above the drawn sphere) at a point, from whatever is loaded; 0 on
 * worlds without relief. For anything that moves over a world (e.g. the jet) and must not sink into
 * the raised terrain.
 */
export function groundHeightKm(body: string, latDeg: number, lonDeg: number, z = 13): number {
  const e = elevationFor(body);
  return e && !e.disabled ? Math.max(0, e.heightKm(latDeg, lonDeg, z)) : 0;
}

/** Authoritative ground height in metres above the drawn sphere / datum (exact `groundHeightKm * 1000`). */
export function groundHeightMeters(body: string, latDeg: number, lonDeg: number, z = 13): number {
  return groundHeightKm(body, latDeg, lonDeg, z) * 1000;
}

/** Detailed synchronous ground elevation sample (km, metres, loadedZoom, ready) for any world. */
export function sampleGroundElevation(body: string, latDeg: number, lonDeg: number, z = 13): ElevationSample {
  const e = elevationFor(body);
  if (!e || e.disabled) return { heightKm: 0, heightMeters: 0, loadedZoom: -1, ready: false };
  if (e.sampleElevation) return e.sampleElevation(latDeg, lonDeg, z);
  const km = Math.max(0, e.heightKm(latDeg, lonDeg, z));
  return { heightKm: km, heightMeters: km * 1000, loadedZoom: km > 0 ? z : -1, ready: km > 0 };
}
