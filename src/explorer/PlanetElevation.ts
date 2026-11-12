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
 * Heights are returned above each world's lowest point (`datumKm`), never below 0: the drawn globe
 * is a smooth sphere and ground beneath it would be hidden by it. The offset is a few km on worlds
 * thousands of km across, invisible from orbit, and everything (tiles, the eye, landmark labels)
 * reads the same function, so the ground you stand on is the ground drawn.
 */
import { decodeLerc1 } from './Lerc1';
import { earthElevation } from './Elevation';

/** What the surface tiles and the surface view need from a height source. */
export interface ElevationSource {
  /** The service could not be reached: the ground stays flat. */
  disabled: boolean;
  /** Load every height tile covering the box at zoom z (resolves when they are in, or failed). */
  ensure(south: number, west: number, north: number, east: number, z: number): Promise<void>;
  /** Height (km) at a point from the best loaded tile at or below zoom z. */
  heightKm(latDeg: number, lonDeg: number, z: number): number;
  /** A height zoom for a patch of ground `spanDeg` across (about one height sample per vertex). */
  zoomFor(spanDeg: number): number;
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
}

const MAX_CACHE = 200;
const MAX_CONCURRENT = 6;

export class PlanetElevation implements ElevationSource {
  public disabled = false;
  private tiles = new Map<string, HeightTile>();
  private inFlight = 0;
  private waiting: Array<() => void> = [];
  private failures = 0;

  constructor(
    public readonly body: string,
    private layers: DemLayer[],
    /** Added to every height so the lowest ground on the world sits at 0. */
    public readonly datumKm: number
  ) {}

  public zoomFor(spanDeg: number): number {
    // One height tile per surface tile (as on Earth): 256–512 samples for its 32 vertices, so every
    // vertex reads well-resolved heights and neighbouring levels of detail agree along their shared
    // edges. Reading coarser height levels for coarser tiles made edges differ by hundreds of metres
    // on crater walls, and the crack-hiding skirts stood up as grey walls across the view
    const z = Math.floor(Math.log2(180 / Math.max(spanDeg, 1e-6)));
    return Math.max(0, this.layers[0].tileSize >= 512 ? z - 1 : z);
  }

  public ensure(south: number, west: number, north: number, east: number, z: number): Promise<void> {
    if (this.disabled) return Promise.resolve();
    const jobs: Promise<void>[] = [];
    for (const [li, l] of this.layers.entries()) {
      if (north < l.south || south > l.north) continue;
      const zz = Math.min(z, l.maxZ);
      const span = 180 / 2 ** zz;
      const s = Math.max(south, l.south);
      const n = Math.min(north, l.north);
      const y0 = Math.max(0, Math.floor((90 - n) / span));
      const y1 = Math.min(2 ** zz - 1, Math.floor((90 - s) / span));
      const cols = 2 ** (zz + 1);
      const x0 = Math.floor((west + 180) / span);
      const x1 = Math.floor((east + 180) / span);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) jobs.push(this.load(li, zz, y, ((x % cols) + cols) % cols));
    }
    return Promise.all(jobs).then(() => undefined);
  }

  public heightKm(latDeg: number, lonDeg: number, z: number): number {
    const lat = Math.max(-90, Math.min(90, latDeg));
    const lon = ((((lonDeg + 180) % 360) + 360) % 360) - 180;
    for (const [li, l] of this.layers.entries()) {
      if (lat < l.south || lat > l.north) continue;
      for (let zz = Math.min(z, l.maxZ); zz >= 0; zz--) {
        const span = 180 / 2 ** zz;
        const gx = (lon + 180) / span;
        const gy = (90 - lat) / span;
        const tx = Math.min(2 ** (zz + 1) - 1, Math.floor(gx));
        const ty = Math.min(2 ** zz - 1, Math.floor(gy));
        const t = this.tiles.get(`${li}/${zz}/${ty}/${tx}`);
        if (!t?.heights) continue;
        const h = this.sample(t, gx - tx, gy - ty);
        if (Number.isNaN(h)) continue;
        return Math.max(0, h + this.datumKm);
      }
    }
    return 0;
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
    return (H[y0 * t.w + x0] * (1 - a) + H[y0 * t.w + x1] * a) * (1 - b) + (H[y1 * t.w + x0] * (1 - a) + H[y1 * t.w + x1] * a) * b;
  }

  private load(li: number, z: number, y: number, x: number): Promise<void> {
    const key = `${li}/${z}/${y}/${x}`;
    const have = this.tiles.get(key);
    if (have) {
      have.lastUsed = performance.now();
      return have.promise;
    }
    const layer = this.layers[li];
    const tile: HeightTile = { heights: null, w: 0, h: 0, corner: layer.format === 'lerc1', promise: Promise.resolve(), lastUsed: performance.now() };
    const url = layer.url(z, y, x);
    tile.promise = this.slot().then(async () => {
      try {
        if (layer.format === 'lerc1') {
          const r = await fetch(url);
          if (!r.ok) throw new Error(String(r.status));
          const d = decodeLerc1(await r.arrayBuffer());
          for (let i = 0; i < d.pixels.length; i++) d.pixels[i] /= 1000;
          tile.heights = d.pixels;
          tile.w = d.width;
          tile.h = d.height;
        } else {
          const img = await loadImage(url);
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0);
          const px = ctx.getImageData(0, 0, c.width, c.height).data;
          tile.heights = decodeGrey(px, c.width, c.height, layer.a ?? 0, layer.b ?? 1);
          tile.w = c.width;
          tile.h = c.height;
        }
        this.failures = 0;
      } catch {
        // Out of coverage (404) or offline: the coarser levels / flat ground stand in
        if (++this.failures > 16) this.disabled = true;
      } finally {
        this.release();
      }
    });
    this.tiles.set(key, tile);
    this.evict();
    return tile.promise;
  }

  private slot(): Promise<void> {
    if (this.inFlight < MAX_CONCURRENT) {
      this.inFlight++;
      return Promise.resolve();
    }
    return new Promise((r) =>
      this.waiting.push(() => {
        this.inFlight++;
        r();
      })
    );
  }

  private release(): void {
    this.inFlight--;
    this.waiting.shift()?.();
  }

  private evict(): void {
    if (this.tiles.size <= MAX_CACHE) return;
    const cutoff = performance.now() - 15000;
    const old = [...this.tiles.entries()].filter(([, t]) => t.heights && t.lastUsed < cutoff).sort((p, q) => p[1].lastUsed - q[1].lastUsed);
    for (const [k] of old.slice(0, this.tiles.size - MAX_CACHE)) this.tiles.delete(k);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image'));
    img.src = url;
  });
}

/**
 * 8-bit greyscale heights (alpha 0 = no data) → km, then smoothed: one grey step is ~77 m, so on
 * gentle slopes the raw values form terraces. Two passes of a 3 × 3 mean (ignoring no-data) turn
 * the steps back into slopes without moving crater rims or peaks by more than a step.
 */
export function decodeGrey(rgba: Uint8ClampedArray | Uint8Array, w: number, h: number, a: number, b: number): Float32Array {
  let cur = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) cur[i] = rgba[i * 4 + 3] === 0 ? NaN : a + b * rgba[i * 4];
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = cur[y * w + x];
        if (Number.isNaN(c)) {
          next[y * w + x] = NaN;
          continue;
        }
        let s = 0;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            const v = cur[yy * w + xx];
            if (!Number.isNaN(v)) {
              s += v;
              n++;
            }
          }
        }
        next[y * w + x] = s / n;
      }
    }
    cur = next;
  }
  return cur;
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
export function groundHeightKm(body: string, latDeg: number, lonDeg: number, z = 11): number {
  const e = elevationFor(body);
  return e && !e.disabled ? Math.max(0, e.heightKm(latDeg, lonDeg, z)) : 0;
}
