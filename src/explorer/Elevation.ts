/**
 * Real ground height for Earth, from the open "Terrain Tiles" dataset on AWS (terrarium encoding:
 * height = R * 256 + G + B / 256 - 32768 metres; SRTM, GMTED2010, ETOPO1 and others; see
 * ASSETS.md). Tiles are 256 px Web-Mercator PNGs, fetched through `TileCache` (deduplicated,
 * host-concurrency limited, priority queued, optionally persisted), decoded off the main thread
 * via `demDecode.worker.ts` (with safe main-thread fallback), and pooled via `Float32Pool`.
 *
 * The sea is flat at sea level: depths below zero are clamped, the seabed is not the surface you
 * see. Heights are returned in kilometres (`heightKm`) or metres (`heightMeters` / `sampleElevation`).
 * Both terrain mesh builders and aircraft collision read this single authoritative source.
 */

import { perf } from '../rendering/Performance';
import bundledTiles from '../data/elevationTiles.json';
import { demDecoder, float32Pool, tileCache } from './TileCache';
import { decodeTerrariumRgba } from './demDecode.worker';

const BUNDLED = new Set(bundledTiles);
const LOCAL_BASE = `${import.meta.env.BASE_URL || '/'}data/elevation/`;

const URL_TEMPLATE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const CACHE_PREFIX = 'dem:earth:';
const MAX_Z = 13;
const COARSE_FALLBACK_Z = 6;
const ANCHOR_Z = 3;
const TILE_TIMEOUT_MS = 18_000;
const COOLDOWN_MS = 20_000;
const MAX_LAT = 85.0511;

const TIER_CACHE = { low: 110, medium: 180, high: 280 } as const;

interface HeightTile {
  heights: Float32Array | null;
  promise: Promise<void>;
  lastUsed: number;
  /** Zoom level cached for O(1) eviction protection of coarse global anchors. */
  z?: number;
  /** Marked true if referenced by a `captureSampler` snapshot so pooling never mutates snapshots. */
  snapshotted?: boolean;
}

export type EarthHeightSampler = (latDeg: number, lonDeg: number, z: number) => number;

export interface ElevationSample {
  /** Authoritative ground elevation above sea level (km, clamped >= 0). */
  heightKm: number;
  /** Authoritative ground elevation above sea level (metres, clamped >= 0). */
  heightMeters: number;
  /** Zoom level of the loaded DEM tile used for this sample, or -1 if no DEM tile covers the point yet. */
  loadedZoom: number;
  /** True when at least one DEM tile (exact or ancestor fallback) covered the sampled point. */
  ready: boolean;
}

const DEG = Math.PI / 180;

function wrapLon(lonDeg: number): number {
  return ((((lonDeg + 180) % 360) + 360) % 360) - 180;
}

/** Web-Mercator tile coordinates (fractional) of a point at zoom z. */
function mercator(latDeg: number, lonDeg: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const lat = Math.max(-MAX_LAT, Math.min(MAX_LAT, latDeg)) * DEG;
  const x = ((wrapLon(lonDeg) + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * n;
  return { x, y };
}

export class EarthElevation {
  /** A clock read once a frame-ish (performance.now() for each of millions of samples added up). */
  public static now = 0;
  private tiles = new Map<string, HeightTile>();
  private epoch = 0;
  private failures = 0;
  private disabledUntil = 0;
  private decodeCtx: CanvasRenderingContext2D | null = null;
  private lastHit: { t: HeightTile | null; z: number; x: number; y: number; key: string } = {
    t: null,
    z: -1,
    x: -1,
    y: -1,
    key: '',
  };
  /** Height tiles decoded so far (a change means new heights to build with). */
  public loadedCount = 0;
  /** Optional bounding box where standalone zero-API local terrain supersedes external S3 DEM tiles. */
  public suppressedBox: { south: number; west: number; north: number; east: number } | null = null;

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

  /**
   * Make sure every height tile covering the box is loaded (resolves when they are, or failed).
   * Always schedules coarse anchors (`z=3`, bundled `z=8`, regional `z=6`) at highest priority so
   * high-z streaming delays never create 0m drop holes.
   */
  public ensure(
    south: number,
    west: number,
    north: number,
    east: number,
    z: number,
    priorityBias = 0
  ): Promise<void> {
    EarthElevation.now = performance.now();
    if (this.disabled || ![south, west, north, east, z].every(Number.isFinite)) return Promise.resolve();
    const sb = this.suppressedBox;
    if (sb && north >= sb.south && south <= sb.north && east >= sb.west && west <= sb.east) {
      return Promise.resolve();
    }
    z = Math.max(0, Math.min(MAX_Z, Math.floor(z)));
    south = Math.max(-MAX_LAT, Math.min(MAX_LAT, south));
    north = Math.max(south, Math.min(MAX_LAT, north));
    const jobs: Promise<void>[] = [];
    const queueZoom = (zz: number, priority: number, maxPerAxis: number): void => {
      const n = 2 ** zz;
      const a = mercator(north, west, zz);
      const b = mercator(south, east, zz);
      const xStart = Math.floor(((west + 180) / 360) * n);
      const xEnd = Math.floor(((east + 180) / 360) * n);
      const yStart = Math.max(0, Math.floor(a.y));
      const yEnd = Math.min(n - 1, Math.floor(b.y));
      const spanX = Math.max(1, xEnd - xStart + 1);
      const spanY = Math.max(1, yEnd - yStart + 1);
      // Center-clamped window so wide boxes never flood the network with 200+ Terrarium PNGs
      const cX = Math.floor((xStart + xEnd) / 2);
      const cY = Math.floor((yStart + yEnd) / 2);
      const half = Math.floor((maxPerAxis - 1) / 2);
      const x0 = spanX > maxPerAxis ? cX - half : xStart;
      const x1 = spanX > maxPerAxis ? x0 + maxPerAxis - 1 : xEnd;
      const y0 = Math.max(0, spanY > maxPerAxis ? cY - half : yStart);
      const y1 = Math.min(n - 1, spanY > maxPerAxis ? y0 + maxPerAxis - 1 : yEnd);
      for (let ty = y0; ty <= y1; ty++) {
        for (let tx = x0; tx <= x1; tx++) {
          const wx = ((tx % n) + n) % n;
          const k = `${zz}/${wx}/${ty}`;
          if (this.tiles.has(k)) continue;
          jobs.push(this.load(zz, wx, ty, priority));
        }
      }
    };
    // Step down effective zoom if the requested box spans too many tiles at high z
    let targetZ = z;
    while (targetZ > 9) {
      const n = 2 ** targetZ;
      const a = mercator(north, west, targetZ);
      const b = mercator(south, east, targetZ);
      const sx = Math.max(1, Math.floor(((east + 180) / 360) * n) - Math.floor(((west + 180) / 360) * n) + 1);
      const sy = Math.max(1, Math.min(n - 1, Math.floor(b.y)) - Math.max(0, Math.floor(a.y)) + 1);
      if (sx * sy <= 9) break;
      targetZ--;
    }
    // Warm coarse global baseline first (highest priority) so peaks never drop to 0 km
    queueZoom(ANCHOR_Z, -1000 + priorityBias, 4);
    // Landmarks carry a bundled regional DEM; load it immediately at high priority
    if (targetZ > 8) {
      const p = mercator((south + north) / 2, (west + east) / 2, 8);
      if (BUNDLED.has(`8/${Math.floor(p.x)}/${Math.floor(p.y)}`)) {
        queueZoom(8, -500 + priorityBias, 3);
      }
    }
    if (targetZ > COARSE_FALLBACK_Z) queueZoom(COARSE_FALLBACK_Z, -200 + priorityBias, 3);
    queueZoom(targetZ, targetZ * 10 + priorityBias, targetZ >= 11 ? 3 : 4);
    return Promise.all(jobs).then(() => undefined);
  }

  /**
   * Velocity-predictive DEM prefetch along an aircraft or camera track.
   * Pre-warms elevation along the predicted corridor ahead of arrival at background priority.
   */
  public prefetchAlong(
    latDeg: number,
    lonDeg: number,
    dLatPerSec: number,
    dLonPerSec: number,
    lookaheadSec = 4,
    z = 12
  ): Promise<void> {
    if (![latDeg, lonDeg, dLatPerSec, dLonPerSec, lookaheadSec, z].every(Number.isFinite)) {
      return Promise.resolve();
    }
    const dt = Math.max(0.5, Math.min(8, lookaheadSec));
    const dLat = Math.max(-0.14, Math.min(0.14, dLatPerSec * dt));
    const dLon = Math.max(-0.14, Math.min(0.14, dLonPerSec * dt));
    const speedDeg = Math.hypot(dLatPerSec * dt, dLonPerSec * dt);
    const lat2 = Math.max(-MAX_LAT, Math.min(MAX_LAT, latDeg + dLat));
    const lon2 = lonDeg + dLon;
    const pad = 0.02;
    const south = Math.min(latDeg, lat2) - pad;
    const north = Math.max(latDeg, lat2) + pad;
    const west = Math.min(lonDeg, lon2) - pad;
    const east = Math.max(lonDeg, lon2) + pad;
    // Supersonic transit (> 0.15 deg in lookahead window) only warms regional z<=9 DEM
    const cappedZ = speedDeg > 0.15 ? Math.min(9, z) : Math.min(12, z);
    return this.ensure(south, west, north, east, Math.max(6, Math.floor(cappedZ)), 50);
  }

  /** Fast O(1) check whether a loaded DEM tile at or above `minZoom` covers `(latDeg, lonDeg)`. */
  public hasCoverage(latDeg: number, lonDeg: number, minZoom = 0): boolean {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg)) return false;
    const floorZ = Math.max(0, Math.min(MAX_Z, Math.floor(minZoom)));
    for (let zz = MAX_Z; zz >= floorZ; zz--) {
      const p = mercator(latDeg, lonDeg, zz);
      const n = 2 ** zz;
      const tx = Math.min(n - 1, Math.floor(p.x));
      const ty = Math.min(n - 1, Math.max(0, Math.floor(p.y)));
      if (this.tiles.get(`${zz}/${tx}/${ty}`)?.heights) return true;
    }
    return false;
  }

  /**
   * Synchronous bilinear height (km) at a point from the best loaded tile at or below zoom `z`,
   * with automatic parent-zoom fallback down to z=0 (never drops to 0m when an ancestor is loaded).
   */
  public heightKm(latDeg: number, lonDeg: number, z: number = MAX_Z): number {
    return this.sampleHeightDetailed(this.tiles, this.lastHit, latDeg, lonDeg, z).heightKm;
  }

  /** Authoritative ground elevation in metres MSL (exact `heightKm * 1000`). */
  public heightMeters(latDeg: number, lonDeg: number, z: number = MAX_Z): number {
    return this.heightKm(latDeg, lonDeg, z) * 1000;
  }

  /** Synchronous elevation sample including the resolved DEM zoom level and readiness flag. */
  public sampleElevation(latDeg: number, lonDeg: number, z: number = MAX_Z): ElevationSample {
    const r = this.sampleHeightDetailed(this.tiles, this.lastHit, latDeg, lonDeg, z);
    return {
      heightKm: r.heightKm,
      heightMeters: r.heightKm * 1000,
      loadedZoom: r.loadedZoom,
      ready: r.loadedZoom >= 0,
    };
  }

  /**
   * Async elevation sample: ensures coarse fallback + target zoom DEM covering `(latDeg, lonDeg)`
   * (bounded by `timeoutMs`) and returns the bilinear-interpolated sample.
   */
  public async sampleElevationAsync(
    latDeg: number,
    lonDeg: number,
    z: number = MAX_Z,
    timeoutMs = 4000
  ): Promise<ElevationSample> {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg)) {
      return { heightKm: 0, heightMeters: 0, loadedZoom: -1, ready: false };
    }
    const targetZ = Math.max(0, Math.min(MAX_Z, Math.floor(z)));
    const current = this.sampleElevation(latDeg, lonDeg, targetZ);
    if (current.loadedZoom >= targetZ || this.disabled) return current;

    const eps = 1e-4;
    const job = this.ensure(latDeg - eps, lonDeg - eps, latDeg + eps, lonDeg + eps, targetZ, -50);
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

  /**
   * A terrain mesh takes several frames to build. Hold its height inputs fixed until all rows
   * and normals have been committed; otherwise a DEM arriving halfway through makes a cliff
   * between rows built before/after the download. Arrays captured here are marked immutable.
   */
  public captureSampler(bounds?: { south: number; west: number; north: number; east: number; z: number }): EarthHeightSampler {
    const loaded = new Map<string, HeightTile>();
    for (const [k, tile] of this.tiles) {
      if (tile.heights !== null) {
        tile.snapshotted = true;
        loaded.set(k, tile);
      }
    }
    const hit = { t: null as HeightTile | null, z: -1, x: -1, y: -1, key: '' };
    // Within a mesh use one complete DEM level. Mixing a detailed mountain tile with a
    // missing neighbour (sea-level fallback) turns the download boundary into a vertical wall.
    let completeZoom = bounds ? -1 : MAX_Z;
    if (bounds) {
      const clampedSouth = Math.max(-MAX_LAT, Math.min(MAX_LAT, bounds.south));
      const clampedNorth = Math.max(clampedSouth, Math.min(MAX_LAT, bounds.north));
      for (let z = Math.min(MAX_Z, Math.max(0, Math.floor(bounds.z))); z >= 0; z--) {
        const n = 2 ** z;
        const a = mercator(clampedNorth, bounds.west, z);
        const b = mercator(clampedSouth, bounds.east, z);
        const x0 = Math.floor(((bounds.west + 180) / 360) * n);
        const x1 = Math.floor(((bounds.east + 180) / 360) * n);
        let complete = true;
        for (let y = Math.max(0, Math.floor(a.y)); y <= Math.min(n - 1, Math.floor(b.y)) && complete; y++) {
          for (let x = x0; x <= x1; x++) {
            if (!loaded.has(`${z}/${((x % n) + n) % n}/${y}`)) {
              complete = false;
              break;
            }
          }
        }
        if (complete) {
          completeZoom = z;
          break;
        }
      }
    }
    return (lat, lon, z) =>
      completeZoom < 0 ? 0 : this.sampleHeightDetailed(loaded, hit, lat, lon, Math.min(z, completeZoom)).heightKm;
  }

  private sampleHeightDetailed(
    tiles: Map<string, HeightTile>,
    last: typeof this.lastHit,
    latDeg: number,
    lonDeg: number,
    z: number
  ): { heightKm: number; loadedZoom: number } {
    if (!Number.isFinite(latDeg) || !Number.isFinite(lonDeg) || !Number.isFinite(z)) {
      return { heightKm: 0, loadedZoom: -1 };
    }
    z = Math.max(0, Math.min(MAX_Z, Math.floor(z)));
    for (let zz = z; zz >= 0; zz--) {
      const p = mercator(latDeg, lonDeg, zz);
      const n = 2 ** zz;
      const tx = Math.min(n - 1, Math.floor(p.x));
      const ty = Math.min(n - 1, Math.max(0, Math.floor(p.y)));
      // Fast path: same tile as the last call (avoids key string garbage during mesh builds)
      if (last.t && last.z === zz && last.x === tx && last.y === ty && last.t.heights && tiles.get(last.key) === last.t) {
        return { heightKm: this.sampleTile(last.t, p.x - tx, p.y - ty), loadedZoom: zz };
      }
      const key = `${zz}/${tx}/${ty}`;
      let t = tiles.get(key);
      if (t?.heights) {
        last.t = t;
        last.z = zz;
        last.x = tx;
        last.y = ty;
        last.key = key;
        return { heightKm: this.sampleTile(t, p.x - tx, p.y - ty), loadedZoom: zz };
      }
      // On a shared edge: check the adjacent tile that holds the same boundary height
      const ex = p.x - tx < 1e-6 ? tx - 1 : tx;
      const ey = p.y - ty < 1e-6 ? ty - 1 : ty;
      if (ex !== tx || ey !== ty) {
        t = tiles.get(`${zz}/${(ex + n) % n}/${Math.max(0, ey)}`);
        if (t?.heights) {
          return { heightKm: this.sampleTile(t, p.x - ex, p.y - Math.max(0, ey)), loadedZoom: zz };
        }
      }
    }
    return { heightKm: 0, loadedZoom: -1 };
  }

  /** Bilinear height (km, sea level floor) at fractional position (uu, vv) in a tile (0..1, NaN-safe). */
  private sampleTile(t: HeightTile, uu: number, vv: number): number {
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
    const h00 = h[y0 * 256 + x0];
    const h10 = h[y0 * 256 + x1];
    const h01 = h[y1 * 256 + x0];
    const h11 = h[y1 * 256 + x1];

    // Fast path when all four corners are finite (99.99% of samples)
    let m: number;
    if (Number.isFinite(h00) && Number.isFinite(h10) && Number.isFinite(h01) && Number.isFinite(h11)) {
      m = (h00 * (1 - u) + h10 * u) * (1 - v) + (h01 * (1 - u) + h11 * u) * v;
    } else {
      // Renormalize over valid finite neighbours so a single NaN corner cannot punch a 0m hole
      const w00 = (1 - u) * (1 - v);
      const w10 = u * (1 - v);
      const w01 = (1 - u) * v;
      const w11 = u * v;
      let sum = 0;
      let weight = 0;
      if (Number.isFinite(h00) && w00 > 0) { sum += h00 * w00; weight += w00; }
      if (Number.isFinite(h10) && w10 > 0) { sum += h10 * w10; weight += w10; }
      if (Number.isFinite(h01) && w01 > 0) { sum += h01 * w01; weight += w01; }
      if (Number.isFinite(h11) && w11 > 0) { sum += h11 * w11; weight += w11; }
      m = weight > 0 ? sum / weight : 0;
    }
    // Transparent/no-data or corrupt rasters must never produce NaN/spikes in vertex buffers.
    return Number.isFinite(m) ? Math.min(9, Math.max(0, m) / 1000) : 0;
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
    tileCache.cancelAll(CACHE_PREFIX);
    for (const [k, t] of this.tiles) {
      if (!t.heights) this.tiles.delete(k);
    }
  }

  /** Fetch via `TileCache` and decode off-thread via `demDecode.worker.ts` (with safe fallback). */
  private async loadOnce(
    key: string,
    url: string,
    z: number,
    priority: number,
    reqEpoch: number,
    isLocal: boolean
  ): Promise<Float32Array | null> {
    if (this.epoch !== reqEpoch) return null;
    const cacheKey = `${CACHE_PREFIX}${key}${isLocal ? ':local' : ''}`;
    const res = await tileCache.fetchBuffer(cacheKey, url, {
      priority,
      z,
      timeoutMs: TILE_TIMEOUT_MS,
      hysteresisMs: 600,
      persist: !isLocal,
      detectEsriNoData: false,
    });
    if (this.epoch !== reqEpoch) return null;
    if (res.status === 'ok' && res.data) {
      const decoded = await demDecoder.decodeTerrarium(res.data);
      if (this.epoch !== reqEpoch) return null;
      if (decoded && decoded.width === 256 && decoded.height === 256) {
        return decoded.heights;
      }
    }
    if (res.status === 'aborted' || res.status === 'nodata') return null;
    // Fallback to HTMLImageElement if fetch/createImageBitmap is unavailable in an older environment
    if (typeof Image !== 'undefined' && typeof document !== 'undefined' && res.httpStatus === undefined) {
      return this.loadViaImageFallback(url, reqEpoch);
    }
    return null;
  }

  private loadViaImageFallback(url: string, reqEpoch: number): Promise<Float32Array | null> {
    return new Promise<Float32Array | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      let settled = false;
      const finish = (heights: Float32Array | null): void => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        img.onload = null;
        img.onerror = null;
        resolve(heights);
      };
      const timer = setTimeout(() => {
        img.src = '';
        finish(null);
      }, TILE_TIMEOUT_MS);
      img.onload = () => {
        if (this.epoch !== reqEpoch) {
          finish(null);
          return;
        }
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
          ctx.drawImage(img, 0, 0, 256, 256);
          const d = ctx.getImageData(0, 0, 256, 256).data;
          finish(decodeTerrariumRgba(d, 256, 256, float32Pool.acquire(256 * 256)));
        } catch {
          finish(null);
        }
      };
      img.onerror = () => finish(null);
      img.src = url;
    });
  }

  private load(z: number, x: number, y: number, priority = z * 10): Promise<void> {
    const key = `${z}/${x}/${y}`;
    const have = this.tiles.get(key);
    if (have) {
      have.lastUsed = performance.now();
      if (!have.heights) {
        tileCache.updatePriority(`${CACHE_PREFIX}${key}`, priority);
      }
      return have.promise;
    }
    const reqEpoch = this.epoch;
    const remoteUrl = URL_TEMPLATE.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
    const isBundled = BUNDLED.has(key);
    const url = isBundled ? `${LOCAL_BASE}${key}.png` : remoteUrl;
    const tile: HeightTile = {
      heights: null,
      promise: Promise.resolve(),
      lastUsed: performance.now(),
      z,
    };
    tile.promise = (async () => {
      let heights = await this.loadOnce(key, url, z, priority, reqEpoch, isBundled);
      if (!heights && isBundled && this.epoch === reqEpoch) {
        heights = await this.loadOnce(key, remoteUrl, z, priority, reqEpoch, false);
      }
      if (!heights && this.epoch === reqEpoch && !this.disabled) {
        await new Promise((r) => setTimeout(r, 650));
        if (this.epoch === reqEpoch && !this.disabled) {
          heights = await this.loadOnce(key, isBundled ? remoteUrl : url, z, priority, reqEpoch, false);
        }
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

  private evict(): void {
    const maxCache = TIER_CACHE[perf.tier];
    if (this.tiles.size <= maxCache) return;
    // Protect coarse anchors (z <= 3) and tiles used in the last 15s so parent-zoom fallback never disappears
    const cutoff = performance.now() - 15_000;
    const old = [...this.tiles.entries()]
      .filter(([, t]) => t.heights && (t.z ?? 10) > ANCHOR_Z && t.lastUsed < cutoff)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    for (const [k, t] of old.slice(0, this.tiles.size - maxCache)) {
      this.tiles.delete(k);
      if (this.lastHit.key === k) {
        this.lastHit.t = null;
        this.lastHit.key = '';
      }
      if (t.heights && !t.snapshotted) {
        float32Pool.release(t.heights);
        t.heights = null;
      }
    }
  }
}

/** One shared source: the surface tiles, procedural terrain, and jet collision read the exact same heights. */
export const earthElevation = new EarthElevation();
