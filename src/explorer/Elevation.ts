/**
 * Real ground height for Earth, from the open "Terrain Tiles" dataset on AWS (terrarium encoding:
 * height = R * 256 + G + B / 256 - 32768 metres; SRTM, GMTED2010, ETOPO1 and others; see
 * ASSETS.md). Tiles are 256 px Web-Mercator PNGs, fetched on demand, decoded once into a height
 * grid and cached.
 *
 * The sea is flat at sea level: depths below zero are clamped, the seabed is not the surface you
 * see. Heights are returned in kilometres.
 */

import { perf } from '../rendering/Performance';
import bundledTiles from '../data/elevationTiles.json';

const BUNDLED = new Set(bundledTiles);
const LOCAL_BASE = `${import.meta.env.BASE_URL || '/'}data/elevation/`;

const URL_TEMPLATE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const MAX_Z = 13;
const COARSE_FALLBACK_Z = 6;
const TILE_TIMEOUT_MS = 18_000;
const COOLDOWN_MS = 20_000;

const TIER_CACHE = { low: 110, medium: 180, high: 280 } as const;
const TIER_CONCURRENT = { low: 3, medium: 5, high: 8 } as const;

interface HeightTile {
  heights: Float32Array | null;
  promise: Promise<void>;
  lastUsed: number;
}

export type EarthHeightSampler = (latDeg: number, lonDeg: number, z: number) => number;

const DEG = Math.PI / 180;

function wrapLon(lonDeg: number): number {
  return ((((lonDeg + 180) % 360) + 360) % 360) - 180;
}

/** Web-Mercator tile coordinates (fractional) of a point at zoom z. */
function mercator(latDeg: number, lonDeg: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const lat = Math.max(-85.0511, Math.min(85.0511, latDeg)) * DEG;
  const x = ((wrapLon(lonDeg) + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * n;
  return { x, y };
}

export class EarthElevation {
  /** A clock read once a frame-ish (performance.now() for each of millions of samples added up). */
  public static now = 0;
  private tiles = new Map<string, HeightTile>();
  private inFlight = 0;
  private waiting: Array<{ grant: () => void; cancel: () => void }> = [];
  private activeAborts = new Set<() => void>();
  private epoch = 0;
  private failures = 0;
  private disabledUntil = 0;
  private decodeCtx: CanvasRenderingContext2D | null = null;
  private lastHit: { t: HeightTile | null; z: number; x: number; y: number; key: string } = { t: null, z: -1, x: -1, y: -1, key: '' };
  /** Height tiles decoded so far (a change means new heights to build with). */
  public loadedCount = 0;

  /** The service is temporarily in outage cooldown (recovers automatically after a pause). */
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

  /** A good terrain zoom for a patch of ground `spanDeg` across (one height tile per patch, or finer). */
  public static zoomFor(spanDeg: number): number {
    return Math.max(0, Math.min(MAX_Z, Math.floor(Math.log2(360 / Math.max(spanDeg, 1e-6)))));
  }

  /** Same as the static zoomFor (the ElevationSource seam shared with other worlds' terrain). */
  public zoomFor(spanDeg: number): number {
    return EarthElevation.zoomFor(spanDeg);
  }

  /** Make sure every height tile covering the box is loaded (resolves when they are, or failed). */
  public ensure(south: number, west: number, north: number, east: number, z: number): Promise<void> {
    EarthElevation.now = performance.now();
    if (this.disabled || ![south, west, north, east, z].every(Number.isFinite)) return Promise.resolve();
    z = Math.max(0, Math.min(MAX_Z, Math.floor(z)));
    south = Math.max(-85.0511, Math.min(85.0511, south));
    north = Math.max(south, Math.min(85.0511, north));
    const jobs: Promise<void>[] = [];
    const queueZoom = (zz: number): void => {
      const n = 2 ** zz;
      const a = mercator(north, west, zz);
      const b = mercator(south, east, zz);
      const xStart = Math.floor(((west + 180) / 360) * n);
      const xEnd = Math.floor(((east + 180) / 360) * n);
      for (let ty = Math.max(0, Math.floor(a.y)); ty <= Math.min(n - 1, Math.floor(b.y)); ty++) {
        for (let tx = xStart; tx <= xEnd; tx++) {
          jobs.push(this.load(zz, ((tx % n) + n) % n, ty));
        }
      }
    };
    // Warm a coarse regional fallback tile so a slow/failed high-z tile never drops peaks to 0 km
    queueZoom(3);
    // Landmarks carry a bundled regional DEM; use it even when live high-detail service stalls.
    if (z > 8) {
      const p = mercator((south + north) / 2, (west + east) / 2, 8);
      if (BUNDLED.has(`8/${Math.floor(p.x)}/${Math.floor(p.y)}`)) queueZoom(8);
    }
    if (z > COARSE_FALLBACK_Z) queueZoom(COARSE_FALLBACK_Z);
    queueZoom(Math.max(0, Math.min(MAX_Z, Math.floor(z))));
    return Promise.all(jobs).then(() => undefined);
  }

  /** Height (km) at a point from the best loaded tile at or below zoom z, or 0 if none is loaded. */
  public heightKm(latDeg: number, lonDeg: number, z: number): number {
    return this.sampleHeight(this.tiles, this.lastHit, latDeg, lonDeg, z);
  }

  /**
   * A terrain mesh takes several frames to build. Hold its height inputs fixed until all rows
   * and normals have been committed; otherwise a DEM arriving halfway through makes a cliff
   * between rows built before/after the download. Arrays are immutable after decoding.
   */
  public captureSampler(bounds?: { south: number; west: number; north: number; east: number; z: number }): EarthHeightSampler {
    const loaded = new Map([...this.tiles].filter(([, tile]) => tile.heights !== null));
    const hit = { t: null as HeightTile | null, z: -1, x: -1, y: -1, key: '' };
    // Within a mesh use one complete DEM level. Mixing a detailed mountain tile with a
    // missing neighbour (sea-level fallback) turns the download boundary into a vertical wall.
    let completeZoom = bounds ? -1 : MAX_Z;
    if (bounds) {
      for (let z = Math.min(MAX_Z, Math.max(0, Math.floor(bounds.z))); z >= 0; z--) {
        const n = 2 ** z;
        const a = mercator(bounds.north, bounds.west, z);
        const b = mercator(bounds.south, bounds.east, z);
        const x0 = Math.floor(((bounds.west + 180) / 360) * n);
        const x1 = Math.floor(((bounds.east + 180) / 360) * n);
        let complete = true;
        for (let y = Math.max(0, Math.floor(a.y)); y <= Math.min(n - 1, Math.floor(b.y)) && complete; y++) {
          for (let x = x0; x <= x1; x++) {
            if (!loaded.has(`${z}/${((x % n) + n) % n}/${y}`)) { complete = false; break; }
          }
        }
        if (complete) { completeZoom = z; break; }
      }
    }
    return (lat, lon, z) => completeZoom < 0 ? 0 : this.sampleHeight(loaded, hit, lat, lon, Math.min(z, completeZoom));
  }

  private sampleHeight(tiles: Map<string, HeightTile>, last: typeof this.lastHit, latDeg: number, lonDeg: number, z: number): number {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg) || !Number.isFinite(z)) return 0;
    z = Math.max(0, Math.min(MAX_Z, Math.floor(z)));
    for (let zz = z; zz >= 0; zz--) {
      const p = mercator(latDeg, lonDeg, zz);
      const n = 2 ** zz;
      const tx = Math.min(n - 1, Math.floor(p.x));
      const ty = Math.min(n - 1, Math.max(0, Math.floor(p.y)));
      // The same tile as the last call, as a run of nearby points nearly always is: no lookup (the
      // key string made for each of the terrain's millions of calls was most of its cost, and its
      // garbage stalled the page a third of a second at a time)
      if (last.t && last.z === zz && last.x === tx && last.y === ty && last.t.heights && tiles.get(last.key) === last.t) {
        return this.sampleTile(last.t, p.x - tx, p.y - ty);
      }
      const key = `${zz}/${tx}/${ty}`;
      let t = tiles.get(key);
      if (t?.heights) {
        last.t = t; last.z = zz; last.x = tx; last.y = ty; last.key = key;
      }
      if (!t?.heights) {
        // On a shared edge: the tile on the other side holds the same heights
        const ex = p.x - tx < 1e-6 ? tx - 1 : tx;
        const ey = p.y - ty < 1e-6 ? ty - 1 : ty;
        t = tiles.get(`${zz}/${(ex + n) % n}/${Math.max(0, ey)}`);
        if (!t?.heights) continue;
        // Fractional coordinates stay in the unwrapped frame, including at the date line.
        return this.sampleTile(t, p.x - ex, p.y - Math.max(0, ey));
      }
      return this.sampleTile(t, p.x - tx, p.y - ty);
    }
    return 0;
  }

  /** Bilinear height (km, sea level floor) at fractional position (u, v) in a tile (0..1, may touch 1). */
  private sampleTile(t: HeightTile, uu: number, vv: number): number {
    {
      t.lastUsed = EarthElevation.now;
      const fx = Math.min(255, Math.max(0, uu * 256 - 0.5));
      const fy = Math.min(255, Math.max(0, vv * 256 - 0.5));
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const x1 = Math.min(255, x0 + 1);
      const y1 = Math.min(255, y0 + 1);
      const u = fx - x0;
      const v = fy - y0;
      const h = t.heights!;
      const m =
        (h[y0 * 256 + x0] * (1 - u) + h[y0 * 256 + x1] * u) * (1 - v) +
        (h[y1 * 256 + x0] * (1 - u) + h[y1 * 256 + x1] * u) * v;
      // Transparent/no-data or corrupt rasters must never produce NaN/spikes in vertex buffers.
      return Number.isFinite(m) ? Math.min(9, Math.max(0, m) / 1000) : 0;
    }
  }

  private getDecodeContext(): CanvasRenderingContext2D | null {
    if (this.decodeCtx) return this.decodeCtx;
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    this.decodeCtx = c.getContext('2d', { willReadFrequently: true });
    return this.decodeCtx;
  }

  public cancelPending(): void {
    this.epoch++;
    for (const abort of [...this.activeAborts]) abort();
    this.activeAborts.clear();
    while (this.waiting.length > 0) this.waiting.shift()?.cancel();
    for (const [k, t] of this.tiles) {
      if (!t.heights) this.tiles.delete(k);
    }
  }

  private async loadOnce(url: string, reqEpoch: number): Promise<Float32Array | null> {
    const acquired = await this.slot();
    if (!acquired || this.epoch !== reqEpoch) {
      if (acquired) this.release();
      return null;
    }
    return new Promise<Float32Array | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      let settled = false;
      const finish = (heights: Float32Array | null): void => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.activeAborts.delete(abort);
        img.onload = null;
        img.onerror = null;
        this.release();
        resolve(heights);
      };
      const abort = (): void => {
        img.src = '';
        finish(null);
      };
      const timer = setTimeout(abort, TILE_TIMEOUT_MS);
      this.activeAborts.add(abort);
      img.onload = () => {
        try {
          if (!(img.naturalWidth > 0 && img.naturalHeight > 0) || img.width <= 0 || img.height <= 0) {
            finish(null);
            return;
          }
          const ctx = this.getDecodeContext();
          if (!ctx) {
            finish(null);
            return;
          }
          ctx.clearRect(0, 0, 256, 256);
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, 256, 256).data;
          const h = new Float32Array(256 * 256);
          for (let i = 0; i < h.length; i++) h[i] = d[i * 4] * 256 + d[i * 4 + 1] + d[i * 4 + 2] / 256 - 32768;
          finish(h);
        } catch {
          finish(null);
        }
      };
      img.onerror = () => finish(null);
      img.src = url;
    });
  }

  private load(z: number, x: number, y: number): Promise<void> {
    const key = `${z}/${x}/${y}`;
    const have = this.tiles.get(key);
    if (have) {
      have.lastUsed = performance.now();
      return have.promise;
    }
    const reqEpoch = this.epoch;
    const remoteUrl = URL_TEMPLATE.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
    const url = BUNDLED.has(key) ? `${LOCAL_BASE}${key}.png` : remoteUrl;
    const tile: HeightTile = { heights: null, promise: Promise.resolve(), lastUsed: performance.now() };
    tile.promise = (async () => {
      let heights = await this.loadOnce(url, reqEpoch);
      if (!heights && BUNDLED.has(key)) heights = await this.loadOnce(remoteUrl, reqEpoch);
      if (!heights && this.epoch === reqEpoch && !this.disabled) {
        await new Promise((r) => setTimeout(r, 650));
        if (this.epoch === reqEpoch && !this.disabled) heights = await this.loadOnce(url, reqEpoch);
      }
      if (heights) {
        tile.heights = heights;
        tile.lastUsed = performance.now();
        this.loadedCount++;
        this.failures = 0;
        this.disabledUntil = 0;
      } else {
        // Evict failed placeholder so future passes can retry instead of sticking at 0 km forever
        if (this.tiles.get(key) === tile) this.tiles.delete(key);
        if (this.epoch === reqEpoch) this.fail();
      }
    })();
    this.tiles.set(key, tile);
    this.evict();
    return tile.promise;
  }

  private fail(): void {
    // Only pause temporarily if initial startup fails completely; once DEMs have succeeded, allow retries
    const limit = this.loadedCount > 0 ? 32 : 16;
    if (++this.failures >= limit) {
      this.disabledUntil = performance.now() + COOLDOWN_MS;
    }
  }

  private slot(): Promise<boolean> {
    const maxConcurrent = TIER_CONCURRENT[perf.tier];
    if (this.inFlight < maxConcurrent) {
      this.inFlight++;
      return Promise.resolve(true);
    }
    return new Promise((r) =>
      this.waiting.push({
        grant: () => {
          this.inFlight++;
          r(true);
        },
        cancel: () => r(false),
      })
    );
  }

  private release(): void {
    this.inFlight--;
    this.waiting.shift()?.grant();
  }

  private evict(): void {
    const maxCache = TIER_CACHE[perf.tier];
    if (this.tiles.size <= maxCache) return;
    // Only tiles unused for a while go: in a burst of loading, a tile that arrived first must still
    // be here when the last one of its batch lands and the surface tile samples them all
    const cutoff = performance.now() - 15000;
    const old = [...this.tiles.entries()]
      .filter(([, t]) => t.heights && t.lastUsed < cutoff)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    for (const [k] of old.slice(0, this.tiles.size - maxCache)) this.tiles.delete(k);
  }
}

/** One shared source: the surface tiles and the surface view's eye height read the same heights. */
export const earthElevation = new EarthElevation();
