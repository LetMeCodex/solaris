/**
 * Real ground height for Earth, from the open "Terrain Tiles" dataset on AWS (terrarium encoding:
 * height = R * 256 + G + B / 256 - 32768 metres; SRTM, GMTED2010, ETOPO1 and others; see
 * ASSETS.md). Tiles are 256 px Web-Mercator PNGs, fetched on demand, decoded once into a height
 * grid and cached.
 *
 * The sea is flat at sea level: depths below zero are clamped, the seabed is not the surface you
 * see. Heights are returned in kilometres.
 */

const URL_TEMPLATE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const MAX_Z = 13;
// The procedural terrain's five patches hold ~25 tiles each at their own zoom, with the jet's own
// besides: fewer and they pushed each other out, fetched again and again
const MAX_CACHE = 260;
const MAX_CONCURRENT = 6;

interface HeightTile {
  heights: Float32Array | null;
  promise: Promise<void>;
  lastUsed: number;
}

const DEG = Math.PI / 180;

/** Web-Mercator tile coordinates (fractional) of a point at zoom z. */
function mercator(latDeg: number, lonDeg: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const lat = Math.max(-85.0511, Math.min(85.0511, latDeg)) * DEG;
  const x = ((lonDeg + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * n;
  return { x, y };
}

export class EarthElevation {
  /** A clock read once a frame-ish (performance.now() for each of millions of samples added up). */
  public static now = 0;
  private tiles = new Map<string, HeightTile>();
  private inFlight = 0;
  private waiting: Array<() => void> = [];
  private failures = 0;
  private lastHit: { t: HeightTile | null; z: number; x: number; y: number; key: string } = { t: null, z: -1, x: -1, y: -1, key: '' };
  /** Height tiles decoded so far (a change means new heights to build with). */
  public loadedCount = 0;
  /** The service could not be reached: everything stays flat. */
  public disabled = false;

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
    if (this.disabled) return Promise.resolve();
    const a = mercator(north, west, z);
    const b = mercator(south, east, z);
    const n = 2 ** z;
    const jobs: Promise<void>[] = [];
    // Inclusive of the far edges: a vertex exactly on a tile's east or south edge reads the next
    // height tile over, which must be here too (or that edge would drop to sea level)
    for (let ty = Math.max(0, Math.floor(a.y)); ty <= Math.min(n - 1, Math.floor(b.y)); ty++) {
      for (let tx = Math.floor(a.x); tx <= Math.floor(b.x); tx++) {
        jobs.push(this.load(z, ((tx % n) + n) % n, ty));
      }
    }
    return Promise.all(jobs).then(() => undefined);
  }

  /** Height (km) at a point from the best loaded tile at or below zoom z, or 0 if none is loaded. */
  public heightKm(latDeg: number, lonDeg: number, z: number): number {
    for (let zz = z; zz >= 0; zz--) {
      const p = mercator(latDeg, lonDeg, zz);
      const n = 2 ** zz;
      const tx = Math.min(n - 1, Math.floor(p.x));
      const ty = Math.min(n - 1, Math.max(0, Math.floor(p.y)));
      // The same tile as the last call, as a run of nearby points nearly always is: no lookup (the
      // key string made for each of the terrain's millions of calls was most of its cost, and its
      // garbage stalled the page a third of a second at a time)
      const last = this.lastHit;
      if (last.t && last.z === zz && last.x === tx && last.y === ty && last.t.heights && this.tiles.get(last.key) === last.t) {
        return this.sampleTile(last.t, p.x - tx, p.y - ty);
      }
      const key = `${zz}/${tx}/${ty}`;
      let t = this.tiles.get(key);
      if (t?.heights) {
        last.t = t; last.z = zz; last.x = tx; last.y = ty; last.key = key;
      }
      if (!t?.heights) {
        // On a shared edge: the tile on the other side holds the same heights
        const ex = p.x - tx < 1e-6 ? tx - 1 : tx;
        const ey = p.y - ty < 1e-6 ? ty - 1 : ty;
        t = this.tiles.get(`${zz}/${(ex + n) % n}/${Math.max(0, ey)}`);
        if (!t?.heights) continue;
        return this.sampleTile(t, p.x - ((ex + n) % n), p.y - Math.max(0, ey));
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
      return Math.max(0, m) / 1000;
    }
  }

  private load(z: number, x: number, y: number): Promise<void> {
    const key = `${z}/${x}/${y}`;
    const have = this.tiles.get(key);
    if (have) {
      have.lastUsed = performance.now();
      return have.promise;
    }
    const tile: HeightTile = { heights: null, promise: Promise.resolve(), lastUsed: performance.now() };
    tile.promise = this.slot().then(
      () =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          img.onload = () => {
            try {
              const c = document.createElement('canvas');
              c.width = c.height = 256;
              const ctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
              ctx.drawImage(img, 0, 0);
              const d = ctx.getImageData(0, 0, 256, 256).data;
              const h = new Float32Array(256 * 256);
              for (let i = 0; i < h.length; i++) h[i] = d[i * 4] * 256 + d[i * 4 + 1] + d[i * 4 + 2] / 256 - 32768;
              tile.heights = h;
              tile.lastUsed = performance.now();
              this.loadedCount++;
              this.failures = 0;
            } catch {
              this.fail();
            }
            this.release();
            resolve();
          };
          img.onerror = () => {
            this.fail();
            this.release();
            resolve();
          };
          img.src = URL_TEMPLATE.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
        })
    );
    this.tiles.set(key, tile);
    this.evict();
    return tile.promise;
  }

  private fail(): void {
    if (++this.failures > 12) this.disabled = true;
  }

  private slot(): Promise<void> {
    if (this.inFlight < MAX_CONCURRENT) {
      this.inFlight++;
      return Promise.resolve();
    }
    return new Promise((r) => this.waiting.push(() => {
      this.inFlight++;
      r();
    }));
  }

  private release(): void {
    this.inFlight--;
    this.waiting.shift()?.();
  }

  private evict(): void {
    if (this.tiles.size <= MAX_CACHE) return;
    // Only tiles unused for a while go: in a burst of loading, a tile that arrived first must still
    // be here when the last one of its batch lands and the surface tile samples them all
    const cutoff = performance.now() - 15000;
    const old = [...this.tiles.entries()].filter(([, t]) => t.heights && t.lastUsed < cutoff).sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    for (const [k] of old.slice(0, this.tiles.size - MAX_CACHE)) this.tiles.delete(k);
  }
}

/** One shared source: the surface tiles and the surface view's eye height read the same heights. */
export const earthElevation = new EarthElevation();
