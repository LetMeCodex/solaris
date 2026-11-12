import * as THREE from 'three';
import type { ElevationSource } from './PlanetElevation';
import { SUN_WORLD } from '../rendering/RenderOrigin';
import { TileProvider } from './ImageryRegistry';
import {
  TileKey,
  tileId,
  tileBounds,
  bodyLatLonToLocal,
  selectTiles,
  parentTile,
  wmsBbox,
  SelectionCamera,
} from './TileMath';

export type LayerState = 'idle' | 'streaming' | 'ready' | 'degraded' | 'unavailable';

export interface LayerStatus {
  state: LayerState;
  inFlight: number;
  queued: number;
  cached: number;
  drawn: number;
  deepestLevel: number;
  failures: number;
}

interface TileEntry {
  key: TileKey;
  id: string;
  state: 'queued' | 'loading' | 'loaded' | 'missing';
  attempts: number;
  texture?: THREE.Texture;
  mesh?: THREE.Mesh;
  image?: HTMLImageElement;
  /** Ground heights at this tile's vertices (km), sampled once when they arrived (raised ground). */
  heights?: Float32Array;
  /** Raised ground: where finer tiles are drawn over this one (it is cut away there). */
  cover?: THREE.DataTexture;
  lastWanted: number;
  lastDrawn: number;
}

/** Image loading seam, replaceable in tests. */
export interface TileImageLoader {
  load(url: string, onLoad: (img: HTMLImageElement) => void, onError: () => void): HTMLImageElement;
}

const defaultLoader: TileImageLoader = {
  load(url, onLoad, onError) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => onLoad(img);
    img.onerror = () => onError();
    img.src = url;
    return img;
  },
};

/** Shell radius of streamed tiles above the base globe (1e-4 R ≈ 0.6 km on Earth). */
export const TILE_SHELL = 1.0001;
/**
 * Extra shell height per zoom level (2e-6 R ≈ 3.5 m on the Moon, 13 m on Earth): a finer tile
 * always lies just above the coarser one it replaces, so the two never fight for depth.
 */
export const TILE_LEVEL_LIFT = 2e-6;

const MAX_CONCURRENT = 10;
/** Resolution of a tile's cover mask: exact for descendants up to six levels finer. */
const COVER = 64;
const MAX_CACHED = 220;
const MAX_ATTEMPTS = 3;
const PROVIDER_FAILURE_LIMIT = 8;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    // modelViewMatrix is composed in double precision on the CPU, so vertices stay steady even
    // a few hundred metres above a globe that sits far from the scene origin
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D uBaseMap;
  uniform vec4 uBounds;       // nominal tile extent: west, south, east, north (degrees)
  uniform float uColorize;    // 1: luminance from the tile, hue from the global colour map
  uniform float uOpacity;
  uniform float uAmbient;
  uniform float uDaylight;    // 0: lit by the real Sun · 1: evenly lit, like a web map
  uniform vec3 uSunTint;      // sunlight colour after the atmosphere (surface view)
  uniform vec3 uSunWorld;     // the Sun in the frame being drawn (floating origin)
  uniform vec3 uHazeColor;
  uniform float uHazeDensity; // per view-space unit; aerial perspective near the ground
  uniform sampler2D uCover;   // raised ground: 1 where a finer tile is drawn over this one
  uniform float uHasCover;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  void main() {
    if (uHasCover > 0.5 && texture2D(uCover, vUv).r > 0.5) discard;
    vec4 tex = texture2D(map, vUv);
    vec3 col = tex.rgb;
    if (uColorize > 0.5) {
      float lon = mix(uBounds.x, uBounds.z, vUv.x);
      float lat = mix(uBounds.y, uBounds.w, vUv.y);
      vec3 base = texture2D(uBaseMap, vec2((lon + 180.0) / 360.0, (lat + 90.0) / 180.0)).rgb;
      col = clamp(base * (luma(tex.rgb) / max(luma(base), 0.03)), 0.0, 1.0);
    }
    vec3 sunDir = normalize(uSunWorld - vWorldPosition);
    float ndl = dot(normalize(vWorldNormal), sunDir);
    vec3 sunlit = uSunTint * (smoothstep(-0.08, 0.35, ndl) * 1.1) + vec3(uAmbient);
    vec3 light = mix(sunlit, vec3(1.0), uDaylight);
    col *= light;
    if (uHazeDensity > 0.0) {
      float h = 1.0 - exp(-length(vViewPosition) * uHazeDensity);
      col = mix(col, uHazeColor, clamp(h, 0.0, 1.0));
    }
    gl_FragColor = vec4(col, tex.a * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Streams equirectangular imagery tiles onto a globe. The layer is a child of the globe's surface
 * mesh, so tiles inherit its rotation (IAU prime meridian) and oblateness. Only tiles whose image
 * has arrived are drawn; until then the nearest loaded ancestor is drawn, and below that the base
 * globe texture shows through — there are never holes.
 */
export class SurfaceTileLayer {
  public readonly group = new THREE.Group();
  public readonly provider: TileProvider;
  private loader: TileImageLoader;
  private tiles = new Map<string, TileEntry>();
  private queue: TileEntry[] = [];
  private inFlight = 0;
  private consecutiveFailures = 0;
  private disabled = false;
  private everLoaded = false;
  /** Shared by every tile material, so changing them is free. */
  private shared = {
    uOpacity: { value: 1 },
    uAmbient: { value: 0.07 },
    uDaylight: { value: 0 },
    uSunTint: { value: new THREE.Vector3(1, 1, 1) },
    uColorize: { value: 0 },
    uBaseMap: { value: null as THREE.Texture | null },
    uHazeColor: { value: new THREE.Color(0, 0, 0) },
    uHazeDensity: { value: 0 },
  };
  private anisotropy = 8;
  private frame = 0;
  private status: LayerStatus = { state: 'idle', inFlight: 0, queued: 0, cached: 0, drawn: 0, deepestLevel: -1, failures: 0 };

  /** Real ground heights (Earth, Moon, Mars): tiles are raised into 3D relief. Null: flat imagery. */
  public elevation: ElevationSource | null = null;
  /** The body these tiles cover (Earth places them by geodetic latitude: see bodyLatLonToLocal). */
  public bodyName = '';
  /** The body's true radius, km (heights are a fraction of it, so they scale with the drawn globe). */
  public radiusKm = 1;

  constructor(provider: TileProvider, loader: TileImageLoader = defaultLoader) {
    this.provider = provider;
    this.loader = loader;
    this.group.name = 'surface_tile_layer';
  }

  /** Even illumination instead of the real Sun angle (for exploring the night side). */
  public setDaylight(on: boolean | number): void {
    this.shared.uDaylight.value = typeof on === 'number' ? on : on ? 1 : 0;
  }

  /** Whole-layer opacity (fades the imagery in over the globe map while descending). */
  public setOpacity(opacity: number): void {
    this.shared.uOpacity.value = opacity;
    this.group.visible = opacity > 0.001;
  }

  /** Global colour map used to tint greyscale sources (`colorize` providers). */
  public setBaseMap(tex: THREE.Texture | null): void {
    this.shared.uBaseMap.value = tex;
    this.shared.uColorize.value = tex && this.provider.colorize ? 1 : 0;
  }

  /** Aerial perspective: fade ground imagery to `color` with view distance (0 disables). */
  public setHaze(color: THREE.Color, densityPerUnit: number): void {
    this.shared.uHazeColor.value.copy(color);
    this.shared.uHazeDensity.value = densityPerUnit;
  }

  /** Sunlight colour and ambient (sky) light for the surface view; (1,1,1), 0.07 in space. */
  public setLighting(sunTint: [number, number, number], ambient: number): void {
    this.shared.uSunTint.value.set(sunTint[0], sunTint[1], sunTint[2]);
    this.shared.uAmbient.value = ambient;
  }

  public setMaxAnisotropy(n: number): void {
    this.anisotropy = Math.max(1, n);
  }

  public getStatus(): LayerStatus {
    return { ...this.status };
  }

  public tileUrl(k: TileKey): string {
    const p = this.provider;
    if (p.kind === 'wms') {
      return p.template.replace('{bbox}', wmsBbox(p, k)).split('{size}').join(String(p.tileSize));
    }
    return p.template.replace('{z}', String(k.z)).replace('{y}', String(k.y)).replace('{x}', String(k.x));
  }

  /**
   * Choose, request and draw tiles for the current view.
   * Call at a modest rate (every few frames); work is bounded by the tile and request limits.
   */
  public update(cam: SelectionCamera): void {
    this.frame++;
    if (this.disabled) {
      this.status = { ...this.status, state: 'unavailable', inFlight: 0, queued: 0 };
      return;
    }

    const wanted = selectTiles(this.provider, cam);
    const wantedIds = new Set<string>();
    let deepest = -1;

    // Queue coarse-to-fine: parents of the wanted tiles first (a quick, sharper-than-base stand-in
    // that also anchors the fallback chain), then the wanted tiles nearest-first
    this.queue = [];
    const leafQueue: TileEntry[] = [];
    for (const k of wanted) {
      const id = tileId(k);
      wantedIds.add(id);
      let entry = this.tiles.get(id);
      if (!entry) {
        entry = { key: k, id, state: 'queued', attempts: 0, lastWanted: this.frame, lastDrawn: 0 };
        this.tiles.set(id, entry);
      }
      entry.lastWanted = this.frame;
      if (entry.state === 'queued') leafQueue.push(entry);
    }
    // Grandparents, then parents: a coarse but complete stand-in arrives within a few requests
    // even when flying fast enough to outrun the detail
    const ancestorQueues: TileEntry[][] = [[], []];
    for (const k of wanted) {
      let ak: TileKey | null = k;
      for (let up = 0; up < 2; up++) {
        ak = ak ? parentTile(ak) : null;
        if (!ak) break;
        const aid = tileId(ak);
        if (wantedIds.has(aid)) continue;
        wantedIds.add(aid);
        let entry = this.tiles.get(aid);
        if (!entry) {
          entry = { key: ak, id: aid, state: 'queued', attempts: 0, lastWanted: this.frame, lastDrawn: 0 };
          this.tiles.set(aid, entry);
        }
        entry.lastWanted = this.frame;
        if (entry.state === 'queued') ancestorQueues[up].push(entry);
      }
    }
    this.queue.push(...ancestorQueues[1], ...ancestorQueues[0]);
    this.queue.push(...leafQueue);

    // Abort requests that are no longer useful (fast scrolling / body switch)
    for (const entry of this.tiles.values()) {
      if (entry.state === 'loading' && !wantedIds.has(entry.id) && entry.image) {
        entry.image.onload = null;
        entry.image.onerror = null;
        entry.image.src = '';
        entry.image = undefined;
        entry.state = 'queued';
        this.inFlight--;
      }
    }
    this.pump();

    // Draw: each wanted tile, or its nearest loaded ancestor. On raised ground a family of tiles
    // replaces its parent only once all of its wanted members are in: a parent and some of its
    // children drawn together would put two different reliefs on the same ground (ghost ridges)
    const relief = !!this.elevation && !this.elevation.disabled;
    const families = new Map<string, TileKey[]>();
    if (relief) {
      for (const k of wanted) {
        const pk = parentTile(k);
        if (!pk) continue;
        const pid = tileId(pk);
        const list = families.get(pid) ?? [];
        list.push(k);
        families.set(pid, list);
      }
    }
    const familyReady = (k: TileKey): boolean => {
      const pk = parentTile(k);
      const fam = pk ? families.get(tileId(pk)) : undefined;
      return !fam || fam.every((m) => this.tiles.get(tileId(m))?.state === 'loaded');
    };
    const drawIds = new Set<string>();
    for (const k of wanted) {
      let cur: TileKey | null = k;
      while (cur) {
        const e = this.tiles.get(tileId(cur));
        if (e && e.state === 'loaded' && (!relief || cur !== k || familyReady(cur))) {
          drawIds.add(e.id);
          deepest = Math.max(deepest, cur.z);
          break;
        }
        cur = parentTile(cur);
      }
    }
    // An ancestor standing in for unloaded tiles stays drawn even once some of its descendants have
    // arrived: removing it uncovered the quarters still loading (L-, U- and diamond-shaped holes
    // down to the base globe). Deeper levels sit on a slightly higher shell (see createMesh), so
    // finer tiles cleanly cover coarser ones where both are drawn.
    for (const entry of this.tiles.values()) {
      const visible = drawIds.has(entry.id);
      if (visible && !entry.mesh && entry.texture) entry.mesh = this.createMesh(entry);
      if (entry.mesh) entry.mesh.visible = visible;
      if (visible) entry.lastDrawn = this.frame;
    }
    if (relief) this.cutCovered(drawIds);

    this.evict();

    const loading = this.inFlight + this.queue.length;
    this.status = {
      state: this.consecutiveFailures >= 3 ? 'degraded' : loading > 0 ? 'streaming' : wanted.length > 0 ? 'ready' : 'idle',
      inFlight: this.inFlight,
      queued: this.queue.length,
      cached: [...this.tiles.values()].filter((t) => t.state === 'loaded').length,
      drawn: drawIds.size,
      deepestLevel: deepest,
      failures: this.consecutiveFailures,
    };
  }

  /** Hide all tiles without discarding the cache (camera left the surface range). */
  public hide(): void {
    for (const entry of this.tiles.values()) if (entry.mesh) entry.mesh.visible = false;
    this.queue = [];
    this.status = { ...this.status, state: this.disabled ? 'unavailable' : 'idle', queued: 0, drawn: 0 };
  }

  private pump(): void {
    // A WMS renders every tile on request (USGS: ~3 s each); more than a few at once only queue at
    // the server, and each answer then takes 25 s or times out
    const limit = this.provider.kind === 'wms' ? 4 : MAX_CONCURRENT;
    while (this.inFlight < limit && this.queue.length > 0) {
      const entry = this.queue.shift()!;
      if (entry.state !== 'queued') continue;
      this.request(entry);
    }
  }

  private request(entry: TileEntry): void {
    entry.state = 'loading';
    entry.attempts++;
    this.inFlight++;
    const url = this.tileUrl(entry.key);
    entry.image = this.loader.load(
      url,
      (img) => {
        if (entry.state !== 'loading') return;
        this.inFlight--;
        entry.image = undefined;
        const tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.anisotropy = this.anisotropy;
        tex.needsUpdate = true;
        entry.texture = tex;
        this.everLoaded = true;
        this.consecutiveFailures = 0;
        if (this.elevation && !this.elevation.disabled) {
          // Raised ground: the tile counts as loaded only once its heights are in, so it never
          // appears flat and then jumps (its parent stands in until then)
          const b = tileBounds(this.provider, entry.key);
          const elevation = this.elevation;
          const z = elevation.zoomFor(Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth));
          void elevation.ensure(b.clipSouth, b.clipWest, b.clipNorth, b.clipEast, z).then(() => {
            if (entry.state !== 'loading') return;
            // Sample this tile's whole height grid now, while its height tiles are certainly cached
            const { nx, ny } = this.grid(entry.key);
            const h = new Float32Array((nx + 1) * (ny + 1));
            for (let j = 0; j <= ny; j++) {
              const lat = b.clipNorth + (b.clipSouth - b.clipNorth) * (j / ny);
              for (let i = 0; i <= nx; i++) {
                const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
                h[j * (nx + 1) + i] = elevation.heightKm(lat, lon, z);
              }
            }
            entry.heights = h;
            entry.state = 'loaded';
          });
        } else {
          entry.state = 'loaded';
        }
        this.pump();
      },
      () => {
        if (entry.state !== 'loading') return;
        this.inFlight--;
        entry.image = undefined;
        // Retry transient failures with backoff; give up on tiles that keep failing (404 / gaps).
        // Only tiles given up on count towards the source looking unreachable.
        if (entry.attempts < MAX_ATTEMPTS) {
          entry.state = 'queued';
          setTimeout(() => {
            if (entry.state === 'queued' && entry.lastWanted >= this.frame - 2) {
              this.queue.unshift(entry);
              this.pump();
            }
          }, 400 * Math.pow(2, entry.attempts));
        } else {
          entry.state = 'missing';
          this.consecutiveFailures++;
          this.status.failures = this.consecutiveFailures;
        }
        // The whole source looks unreachable (offline, blocked, CORS) — stop asking
        if (this.consecutiveFailures >= PROVIDER_FAILURE_LIMIT && !this.everLoaded) {
          this.disableProvider();
          return;
        }
        this.pump();
      }
    );
  }

  /** Stop all traffic to a source that appears unreachable; the base globe map stays visible. */
  private disableProvider(): void {
    this.disabled = true;
    for (const entry of this.tiles.values()) {
      if (entry.state === 'loading' && entry.image) {
        entry.image.onload = null;
        entry.image.onerror = null;
        entry.image.src = '';
        entry.image = undefined;
      }
      if (entry.state !== 'loaded') entry.state = 'missing';
    }
    this.queue = [];
    this.inFlight = 0;
    this.status = { ...this.status, state: 'unavailable', inFlight: 0, queued: 0 };
  }

  /** Vertex grid of a tile: a fixed fine grid for raised ground, else by its size. */
  private grid(k: TileKey): { nx: number; ny: number } {
    const b = tileBounds(this.provider, k);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const relief = !!this.elevation && !this.elevation.disabled;
    // Flat tiles: cells of at most ~0.5° so their chords sag less than the shell lift (TILE_SHELL)
    // below the true curve; with 1.5° cells the surface view's finely curved ground cap poked up
    // through the middle of every cell (a lattice of discs on Io, Europa, Pluto…)
    const segs = relief ? 32 : Math.max(8, Math.min(48, Math.ceil(spanDeg / 0.5)));
    const ny = Math.max(2, Math.ceil(segs * ((b.clipNorth - b.clipSouth) / Math.max(1e-6, b.clipEast - b.clipWest))));
    return { nx: segs, ny: Math.min(48, ny) };
  }

  private createMesh(entry: TileEntry): THREE.Mesh {
    const b = tileBounds(this.provider, entry.key);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const heights = entry.heights;
    const relief = !!heights;
    // (Finer tiles already sit a little higher: TILE_LEVEL_LIFT; skirts close the edges)
    const sinkKm = 0;
    const { nx, ny: nyc } = this.grid(entry.key);

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= nyc; j++) {
      const lat = b.clipNorth + (b.clipSouth - b.clipNorth) * (j / nyc);
      for (let i = 0; i <= nx; i++) {
        const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
        const [x, y, z] = bodyLatLonToLocal(this.bodyName, lat, lon);
        // Coarser tiles sink a little under finer ones (by ~1% of their size), so where both are
        // drawn during loading the coarse relief never pokes up through the fine
        const lift = heights ? (heights[j * (nx + 1) + i] - sinkKm) / this.radiusKm : 0;
        const shell = TILE_SHELL + entry.key.z * TILE_LEVEL_LIFT + lift;
        positions.push(x * shell, y * shell, z * shell);
        normals.push(x, y, z);
        // UV within the full nominal tile image (v = 1 at the tile's north edge)
        uvs.push((lon - b.west) / (b.east - b.west), (lat - b.south) / (b.north - b.south));
      }
    }
    for (let j = 0; j < nyc; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * (nx + 1) + i;
        const c = a + nx + 1;
        indices.push(a, c, a + 1, a + 1, c, c + 1);
      }
    }
    // Skirts on raised ground: a short wall hanging down from every edge, so where a finer tile meets
    // a coarser one (their edges at slightly different heights) no crack shows the sky through
    let skirtInfo: { ring: number[]; top: number; start: number } | null = null;
    if (relief) {
      // Deep enough to reach under a coarser neighbour's edge in steep country (it can sit a large
      // part of the local relief lower)
      let hMin = Infinity, hMax = -Infinity;
      for (const h of heights!) {
        hMin = Math.min(hMin, h);
        hMax = Math.max(hMax, h);
      }
      // (km per degree of this body: 111 on Earth, 30 on the Moon)
      const skirtKm = Math.max(0.15, spanDeg * ((Math.PI * this.radiusKm) / 180) * 0.008, (hMax - hMin) * 0.35);
      const ring: number[] = [];
      for (let i = 0; i <= nx; i++) ring.push(i);
      for (let j = 1; j <= nyc; j++) ring.push(j * (nx + 1) + nx);
      for (let i = nx - 1; i >= 0; i--) ring.push(nyc * (nx + 1) + i);
      for (let j = nyc - 1; j >= 1; j--) ring.push(j * (nx + 1));
      // Own copies of the edge (top) and the hanging edge (bottom): the walls must not bend the
      // shading of the ground's own edge vertices
      const top = positions.length / 3;
      skirtInfo = { ring, top, start: top + ring.length };
      for (const k of ring) {
        positions.push(positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]);
        normals.push(normals[k * 3], normals[k * 3 + 1], normals[k * 3 + 2]);
        uvs.push(uvs[k * 2], uvs[k * 2 + 1]);
      }
      const start = positions.length / 3;
      for (const k of ring) {
        const x = positions[k * 3], y = positions[k * 3 + 1], z = positions[k * 3 + 2];
        const len = Math.hypot(x, y, z);
        const down = (len - skirtKm / this.radiusKm) / len;
        positions.push(x * down, y * down, z * down);
        normals.push(normals[k * 3], normals[k * 3 + 1], normals[k * 3 + 2]);
        uvs.push(uvs[k * 2], uvs[k * 2 + 1]);
      }
      for (let n = 0; n < ring.length; n++) {
        const a = top + n;
        const b = top + ((n + 1) % ring.length);
        const a2 = start + n;
        const b2 = start + ((n + 1) % ring.length);
        // Both windings: the wall is seen from either side
        indices.push(a, a2, b, b, a2, b2, a, b, a2, b, b2, a2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    // Slopes catch the light: normals from the raised surface itself
    if (relief) {
      geo.computeVertexNormals();
      // Skirts take the normal of the ground at their top edge: lit as a continuation of the
      // slope, not as a dark vertical wall where a coarser neighbour sits lower
      if (skirtInfo) {
        const n = geo.attributes.normal as THREE.BufferAttribute;
        skirtInfo.ring.forEach((k, i) => {
          for (const at of [skirtInfo.top + i, skirtInfo.start + i]) n.setXYZ(at, n.getX(k), n.getY(k), n.getZ(k));
        });
        n.needsUpdate = true;
      }
    }
    geo.computeBoundingSphere();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        ...this.shared,
        uSunWorld: SUN_WORLD,
        map: { value: entry.texture },
        uBounds: { value: new THREE.Vector4(b.west, b.south, b.east, b.north) },
        uCover: { value: null },
        uHasCover: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `tile_${entry.id}`;
    // Deeper tiles draw after shallower ones
    mesh.renderOrder = 1 + entry.key.z * 0.01;
    this.group.add(mesh);
    return mesh;
  }

  /**
   * On raised ground two levels of detail must never overlap: each has its own relief (a coarse
   * tile flattens a peak by kilometres), so where both are drawn they cut through each other and
   * the eye can end up inside or under the mountains. A coarse tile standing in for unloaded
   * neighbours stays drawn, but is cut away (discarded in its shader) wherever finer tiles are.
   */
  private cutCovered(drawIds: Set<string>): void {
    const masks = new Map<string, Uint8Array>();
    for (const id of drawIds) {
      const k = this.tiles.get(id)?.key;
      if (!k) continue;
      let pk = parentTile(k);
      while (pk) {
        const pid = tileId(pk);
        if (drawIds.has(pid)) {
          const dz = k.z - pk.z;
          const n = 2 ** dz;
          const ix = k.x - pk.x * n;
          const iy = k.y - pk.y * n;
          let m = masks.get(pid);
          if (!m) masks.set(pid, (m = new Uint8Array(COVER * COVER)));
          // Texels whose centres lie inside the finer tile (v = 1 at the coarse tile's north edge)
          const x0 = Math.round((ix / n) * COVER), x1 = Math.round(((ix + 1) / n) * COVER);
          const y0 = Math.round((1 - (iy + 1) / n) * COVER), y1 = Math.round((1 - iy / n) * COVER);
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) m[y * COVER + x] = 255;
        }
        pk = parentTile(pk);
      }
    }
    for (const entry of this.tiles.values()) {
      const mat = entry.mesh?.material as THREE.ShaderMaterial | undefined;
      if (!mat) continue;
      const m = drawIds.has(entry.id) ? masks.get(entry.id) : undefined;
      if (m) {
        if (!entry.cover) {
          entry.cover = new THREE.DataTexture(new Uint8Array(COVER * COVER), COVER, COVER, THREE.RedFormat, THREE.UnsignedByteType);
          entry.cover.magFilter = entry.cover.minFilter = THREE.NearestFilter;
        }
        const data = entry.cover.image.data as Uint8Array;
        let changed = false;
        for (let i = 0; i < data.length; i++) {
          if (data[i] !== m[i]) {
            data[i] = m[i];
            changed = true;
          }
        }
        if (changed) entry.cover.needsUpdate = true;
        mat.uniforms.uCover.value = entry.cover;
        mat.uniforms.uHasCover.value = 1;
      } else {
        mat.uniforms.uHasCover.value = 0;
      }
      entry.mesh!.userData.covered = !!m;
    }
  }

  private evict(): void {
    const loaded = [...this.tiles.values()].filter((t) => t.state === 'loaded');
    if (loaded.length <= MAX_CACHED) return;
    loaded.sort((a, b) => Math.max(a.lastDrawn, a.lastWanted) - Math.max(b.lastDrawn, b.lastWanted));
    for (const entry of loaded.slice(0, loaded.length - MAX_CACHED)) {
      if (entry.lastDrawn === this.frame || entry.key.z <= 1) continue; // keep what is on screen and the roots
      this.disposeEntry(entry);
      this.tiles.delete(entry.id);
    }
    // Forget long-unwanted bookkeeping entries
    for (const entry of this.tiles.values()) {
      if (entry.state !== 'loaded' && entry.state !== 'loading' && this.frame - entry.lastWanted > 600) {
        this.tiles.delete(entry.id);
      }
    }
  }

  private disposeEntry(entry: TileEntry): void {
    if (entry.mesh) {
      this.group.remove(entry.mesh);
      entry.mesh.geometry.dispose();
      (entry.mesh.material as THREE.Material).dispose();
      entry.mesh = undefined;
    }
    entry.texture?.dispose();
    entry.texture = undefined;
    entry.cover?.dispose();
    entry.cover = undefined;
  }

  public dispose(): void {
    for (const entry of this.tiles.values()) {
      if (entry.image) {
        entry.image.onload = null;
        entry.image.onerror = null;
        entry.image.src = '';
      }
      this.disposeEntry(entry);
    }
    this.tiles.clear();
    this.queue = [];
    this.inFlight = 0;
  }
}
