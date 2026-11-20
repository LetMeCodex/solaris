import * as THREE from 'three';
import type { ElevationSource } from './PlanetElevation';
import { SUN_WORLD } from '../rendering/RenderOrigin';
import { perf, QualityTier } from '../rendering/Performance';
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
  useFallback?: boolean;
  attempts: number;
  nextRetryAt?: number;
  retryAfter?: number;
  reqId?: number;
  requestTimer?: ReturnType<typeof setTimeout>;
  retryTimer?: ReturnType<typeof setTimeout>;
  texture?: THREE.Texture;
  mesh?: THREE.Mesh;
  image?: HTMLImageElement;
  /** Ground heights at this tile's vertices (km), sampled once when they arrived (raised ground). */
  heights?: Float32Array;
  /** Captured with the height buffer: provider cooldowns must not change its vertex stride. */
  heightGrid?: { nx: number; ny: number };
  preparingRelief?: boolean;
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
    img.onload = () => {
      if (img.naturalWidth <= 0 || img.naturalHeight <= 0 || img.width <= 0 || img.height <= 0) {
        onError();
        return;
      }
      onLoad(img);
    };
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

/** Resolution of a tile's cover mask: exact for descendants up to eight levels finer. */
const COVER = 256;
const MAX_ATTEMPTS = 3;
const PROVIDER_FAILURE_LIMIT = 8;
const PRIMARY_ERROR_LIMIT = 24;
const FALLBACK_ERROR_LIMIT = 12;
const INITIAL_COOLDOWN_MS = 15_000;
const MISSING_RETRY_MS = 45_000;
const WMTS_TIMEOUT_MS = 15_000;
const WMS_TIMEOUT_MS = 30_000;

interface TierLimits {
  wmts: number;
  wms: number;
  cached: number;
  reliefSegs: number;
  flatMaxSegs: number;
  maxTiles: number;
  maxPxPerTexel: number;
  maxAnisotropy: number;
}

const TIER_LIMITS: Record<QualityTier, TierLimits> = {
  high: { wmts: 10, wms: 4, cached: 220, reliefSegs: 32, flatMaxSegs: 48, maxTiles: 160, maxPxPerTexel: 1.3, maxAnisotropy: 8 },
  medium: { wmts: 8, wms: 3, cached: 160, reliefSegs: 24, flatMaxSegs: 36, maxTiles: 120, maxPxPerTexel: 1.45, maxAnisotropy: 4 },
  low: { wmts: 4, wms: 2, cached: 90, reliefSegs: 16, flatMaxSegs: 24, maxTiles: 80, maxPxPerTexel: 1.65, maxAnisotropy: 2 },
};

const vertexShader = /* glsl */ `
  uniform float uUnderlay;
  uniform float uUnderlayInset;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vec3 tilePosition = position - normalize(position) * uUnderlay * uUnderlayInset;
    vWorldPosition = (modelMatrix * vec4(tilePosition, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    // modelViewMatrix is composed in double precision on the CPU, so vertices stay steady even
    // a few hundred metres above a globe that sits far from the scene origin
    vec4 mv = modelViewMatrix * vec4(tilePosition, 1.0);
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
    float outAlpha = tex.a * uOpacity;
    if (uColorize > 0.5) {
      float lon = mix(uBounds.x, uBounds.z, vUv.x);
      float lat = mix(uBounds.y, uBounds.w, vUv.y);
      vec3 base = texture2D(uBaseMap, vec2((lon + 180.0) / 360.0, (lat + 90.0) / 180.0)).rgb;
      // Un-premultiply so bilinear/mipmap borders of transparent nodata swaths (e.g. Mars CTX gores)
      // keep true terrain luminance instead of dark halos, then seamlessly fill nodata voids with uBaseMap.
      vec3 trueRgb = tex.a > 0.01 ? tex.rgb / tex.a : base;
      float lum = luma(trueRgb);
      vec3 colorized = clamp(base * (lum / max(luma(base), 0.03)), 0.0, 1.0);
      float valid = smoothstep(0.5, 0.96, tex.a) * smoothstep(0.008, 0.025, lum);
      col = mix(base, colorized, valid);
      outAlpha = uOpacity;
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
    gl_FragColor = vec4(col, outAlpha);
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
  private activeProvider: TileProvider;
  private usingFallback = false;
  private loader: TileImageLoader;
  private tiles = new Map<string, TileEntry>();
  private queue: TileEntry[] = [];
  private maskedDrawIds = new Set<string>();
  private inFlight = 0;
  private consecutiveFailures = 0;
  private consecutiveRequestErrors = 0;
  private disabledUntil = 0;
  private cooldownMs = INITIAL_COOLDOWN_MS;
  private everLoaded = false;
  private reqCounter = 0;
  /** Shared by every tile material, so changing them is free. */
  private shared = {
    uUnderlay: { value: 0 },
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
    this.activeProvider = provider;
    this.loader = loader;
    this.group.name = 'surface_tile_layer';
  }

  private isDisabled(): boolean {
    if (this.disabledUntil <= 0) return false;
    if (performance.now() >= this.disabledUntil) {
      this.disabledUntil = 0;
      this.consecutiveFailures = 0;
      this.consecutiveRequestErrors = 0;
      return false;
    }
    return true;
  }

  /** Even illumination instead of the real Sun angle (for exploring the night side). */
  public setDaylight(on: boolean | number): void {
    this.shared.uDaylight.value = typeof on === 'number' ? on : on ? 1 : 0;
  }

  /** Keep imagery below real photogrammetry, cancelling the map-only shell/LOD lift. */
  public setUnderlay(on: boolean): void {
    this.shared.uUnderlay.value = on ? 1 : 0;
  }

  /** Whole-layer opacity (fades the imagery in over the globe map while descending). */
  public setOpacity(opacity: number): void {
    this.shared.uOpacity.value = opacity;
    this.group.visible = opacity > 0.001;
  }

  /** Global colour map used to tint greyscale sources (`colorize` providers). */
  public setBaseMap(tex: THREE.Texture | null): void {
    this.shared.uBaseMap.value = tex;
    this.shared.uColorize.value = tex && this.activeProvider.colorize ? 1 : 0;
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

  private providerFor(k: TileKey, useFallback = false): TileProvider {
    const p = this.activeProvider;
    const fb = !this.usingFallback ? p.fallback : undefined;
    if (fb && k.z >= fb.minLevel && k.z <= fb.maxLevel && (useFallback || k.z < p.minLevel)) {
      return fb;
    }
    return p;
  }

  public tileUrl(k: TileKey, useFallback = false): string {
    const p = this.providerFor(k, useFallback);
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
    if (this.isDisabled()) {
      this.status = { ...this.status, state: 'unavailable', inFlight: 0, queued: 0 };
      return;
    }

    const now = performance.now();
    const limits = TIER_LIMITS[perf.tier];
    const effectiveCam: SelectionCamera = !cam.bodyName && this.bodyName ? { ...cam, bodyName: this.bodyName } : cam;
    // Once Google geometry is present, this is a coverage underlay, not a second competing
    // high-resolution map. Keep a small regional baseline and give network/VRAM to real 3D.
    const underlay = this.shared.uUnderlay.value > 0;
    const fb = !this.usingFallback ? this.activeProvider.fallback : undefined;
    const selectMinLevel = fb ? Math.min(this.activeProvider.minLevel, fb.minLevel) : this.activeProvider.minLevel;
    const baseSelection =
      selectMinLevel !== this.activeProvider.minLevel
        ? { ...this.activeProvider, minLevel: selectMinLevel }
        : this.activeProvider;
    const selectionProvider = underlay
      ? { ...baseSelection, maxLevel: Math.max(baseSelection.minLevel, Math.min(7, baseSelection.maxLevel)) }
      : baseSelection;
    const wanted = selectTiles(selectionProvider, effectiveCam, limits.maxPxPerTexel, underlay ? Math.min(24, limits.maxTiles) : limits.maxTiles);
    const wantedIds = new Set<string>();
    let deepest = -1;

    // Queue coarse-to-fine: ancestors first (a quick, sharper-than-base stand-in that anchors the
    // fallback chain), then the wanted tiles nearest-first
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
      if (entry.state === 'missing' && entry.retryAfter && now >= entry.retryAfter) {
        entry.state = 'queued';
        entry.attempts = 0;
        entry.retryAfter = undefined;
      }
      if (entry.state === 'queued' && (!entry.nextRetryAt || now >= entry.nextRetryAt)) {
        leafQueue.push(entry);
      }
    }
    // Always keep a complete path to a cheap global anchor. Four ancestors were insufficient
    // for a direct landing at z10–13: every request still needed detailed remote imagery.
    const ancestorLevels = this.activeProvider.maxLevel - selectMinLevel;
    const ancestorQueues: TileEntry[][] = Array.from({ length: ancestorLevels }, () => []);
    for (const k of wanted) {
      let ak: TileKey | null = k;
      for (let up = 0; up < ancestorLevels; up++) {
        ak = ak ? parentTile(ak) : null;
        if (!ak || ak.z < selectMinLevel) break;
        const aid = tileId(ak);
        if (wantedIds.has(aid)) continue;
        wantedIds.add(aid);
        let entry = this.tiles.get(aid);
        if (!entry) {
          entry = { key: ak, id: aid, state: 'queued', attempts: 0, lastWanted: this.frame, lastDrawn: 0 };
          this.tiles.set(aid, entry);
        }
        entry.lastWanted = this.frame;
        if (entry.state === 'missing' && entry.retryAfter && now >= entry.retryAfter) {
          entry.state = 'queued';
          entry.attempts = 0;
          entry.retryAfter = undefined;
        }
        if (entry.state === 'queued' && (!entry.nextRetryAt || now >= entry.nextRetryAt)) {
          ancestorQueues[ak.z - selectMinLevel].push(entry);
        }
      }
    }
    // Give the nearest detailed tile a slot alongside coarse coverage on every queue refill.
    const ancestors = ancestorQueues.flat();
    for (let i = 0; i < Math.max(ancestors.length, leafQueue.length); i++) {
      if (i < ancestors.length) this.queue.push(ancestors[i]);
      if (i < leafQueue.length) this.queue.push(leafQueue[i]);
    }

    // Abort requests that are no longer useful (fast scrolling / body switch) without burning attempts,
    // while letting coarse anchor tiles (z <= 2) finish so low-res stand-ins appear rapidly during descent
    for (const entry of this.tiles.values()) {
      if (entry.state === 'loading' && !wantedIds.has(entry.id) && entry.key.z > 2 && entry.image) {
        this.cancelRequest(entry);
        entry.attempts = Math.max(0, entry.attempts - 1);
        entry.state = 'queued';
      }
    }
    this.pump();

    // Each ready child can appear immediately. Its parent covers pending siblings, and
    // the coverage mask removes the overlap even when the two meshes have different relief.
    const relief = !!this.elevation && !this.elevation.disabled;
    const drawIds = new Set<string>();
    for (const k of wanted) {
      let drawable: TileEntry | undefined;
      for (let cur: TileKey | null = k; cur; cur = parentTile(cur)) {
        const entry = this.tiles.get(tileId(cur));
        if (entry?.state !== 'loaded') continue;
        drawable ??= entry;
        // Do not cut a sea-level hole in an already raised mountain while the new DEM loads.
        if (entry.heights || !relief) {
          drawable = entry;
          break;
        }
        if (!entry.preparingRelief && entry === drawable) this.prepareRelief(entry);
      }
      if (drawable) {
        drawIds.add(drawable.id);
        deepest = Math.max(deepest, drawable.key.z);
      }
    }
    for (const entry of this.tiles.values()) {
      const visible = drawIds.has(entry.id);
      if (visible && !entry.mesh && entry.texture) entry.mesh = this.createMesh(entry);
      if (entry.mesh) entry.mesh.visible = visible;
      if (visible) entry.lastDrawn = this.frame;
    }
    const hasAnyRelief = relief || [...drawIds].some((id) => !!this.tiles.get(id)?.heights);
    const maskIds = hasAnyRelief ? drawIds : new Set<string>();
    if (maskIds.size !== this.maskedDrawIds.size || [...maskIds].some(id => !this.maskedDrawIds.has(id))) {
      this.cutCovered(maskIds);
      this.maskedDrawIds = maskIds;
    }

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

  /** Hide all tiles and release active network slots without discarding cached textures. */
  public hide(): void {
    for (const entry of this.tiles.values()) {
      if (entry.mesh) entry.mesh.visible = false;
      if (entry.state === 'loading' || entry.retryTimer) {
        const wasLoading = entry.state === 'loading';
        this.cancelRequest(entry);
        if (wasLoading) entry.attempts = Math.max(0, entry.attempts - 1);
        entry.state = 'queued';
      }
    }
    if (this.bodyName !== 'Earth') this.elevation?.cancelPending?.();
    this.queue = [];
    this.inFlight = 0;
    this.status = { ...this.status, state: this.isDisabled() ? 'unavailable' : 'idle', inFlight: 0, queued: 0, drawn: 0 };
  }

  private cancelRequest(entry: TileEntry): void {
    entry.reqId = undefined;
    if (entry.requestTimer) {
      clearTimeout(entry.requestTimer);
      entry.requestTimer = undefined;
    }
    if (entry.retryTimer) {
      clearTimeout(entry.retryTimer);
      entry.retryTimer = undefined;
    }
    if (entry.image) {
      entry.image.onload = null;
      entry.image.onerror = null;
      entry.image.src = '';
      entry.image = undefined;
      this.inFlight = Math.max(0, this.inFlight - 1);
    }
    if (entry.state === 'loading' && entry.texture) {
      entry.texture.dispose();
      entry.texture = undefined;
    }
  }

  private pump(): void {
    if (this.isDisabled()) return;
    const limits = TIER_LIMITS[perf.tier];
    // WMS renders per request; HTTP/1.1 Trek enforces 6-socket browser pool per host — reserve
    // sockets for parallel DEM tiles when relief is active so neither starves the other.
    const trekMax = this.elevation && !this.elevation.disabled ? 4 : 6;
    const wmtsLimit = this.activeProvider.template.includes('trek.nasa.gov') ? Math.min(limits.wmts, trekMax) : limits.wmts;
    const limit = this.activeProvider.kind === 'wms' ? limits.wms : wmtsLimit;
    while (this.inFlight < limit && this.queue.length > 0) {
      const entry = this.queue.shift()!;
      if (entry.state !== 'queued') continue;
      if (entry.nextRetryAt && performance.now() < entry.nextRetryAt) continue;
      this.request(entry);
    }
  }

  private request(entry: TileEntry): void {
    entry.state = 'loading';
    entry.attempts++;
    entry.nextRetryAt = undefined;
    const reqId = ++this.reqCounter;
    entry.reqId = reqId;
    this.inFlight++;
    const url = this.tileUrl(entry.key, entry.useFallback);
    const timeoutMs = this.providerFor(entry.key, entry.useFallback).kind === 'wms' ? WMS_TIMEOUT_MS : WMTS_TIMEOUT_MS;
    const limits = TIER_LIMITS[perf.tier];

    const failRequest = (): void => {
      if (entry.state !== 'loading' || entry.reqId !== reqId) return;
      entry.reqId = undefined;
      if (entry.requestTimer) {
        clearTimeout(entry.requestTimer);
        entry.requestTimer = undefined;
      }
      this.inFlight = Math.max(0, this.inFlight - 1);
      if (entry.image) {
        entry.image.onload = null;
        entry.image.onerror = null;
        entry.image.src = '';
        entry.image = undefined;
      }
      const fb = this.activeProvider.fallback;
      if (
        this.everLoaded &&
        !this.usingFallback &&
        !entry.useFallback &&
        fb &&
        entry.key.z >= fb.minLevel &&
        entry.key.z <= fb.maxLevel
      ) {
        entry.useFallback = true;
        entry.attempts = 0;
        entry.state = 'queued';
        entry.nextRetryAt = undefined;
        this.queue.unshift(entry);
        this.pump();
        return;
      }
      this.consecutiveRequestErrors++;
      if (entry.attempts < MAX_ATTEMPTS) {
        const delay = 400 * Math.pow(2, entry.attempts);
        entry.state = 'queued';
        entry.nextRetryAt = performance.now() + delay;
        entry.retryTimer = setTimeout(() => {
          entry.retryTimer = undefined;
          if (entry.state === 'queued' && !this.isDisabled() && entry.lastWanted >= this.frame - 12) {
            this.queue.unshift(entry);
            this.pump();
          }
        }, delay);
      } else {
        entry.state = 'missing';
        entry.retryAfter = performance.now() + MISSING_RETRY_MS;
        this.consecutiveFailures++;
        this.status.failures = this.consecutiveFailures;
      }
      const missLimit = this.usingFallback ? Math.max(4, PROVIDER_FAILURE_LIMIT / 2) : PROVIDER_FAILURE_LIMIT;
      const errLimit = this.usingFallback ? FALLBACK_ERROR_LIMIT : PRIMARY_ERROR_LIMIT;
      if (!this.everLoaded && (this.consecutiveFailures >= missLimit || this.consecutiveRequestErrors >= errLimit)) {
        if (!this.usingFallback && this.activeProvider.fallback) {
          this.switchToFallback();
          return;
        }
        this.disableProvider();
        return;
      }
      this.pump();
    };

    entry.requestTimer = setTimeout(failRequest, timeoutMs);
    entry.image = this.loader.load(
      url,
      (img) => {
        if (entry.state !== 'loading' || entry.reqId !== reqId) return;
        if (
          !img ||
          img.complete === false ||
          img.naturalWidth <= 0 ||
          img.naturalHeight <= 0 ||
          img.width <= 0 ||
          img.height <= 0
        ) {
          failRequest();
          return;
        }
        const commitTexture = (): void => {
          if (entry.state !== 'loading' || entry.reqId !== reqId) return;
          entry.reqId = undefined;
          if (entry.requestTimer) {
            clearTimeout(entry.requestTimer);
            entry.requestTimer = undefined;
          }
          this.inFlight = Math.max(0, this.inFlight - 1);
          entry.image = undefined;
          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.anisotropy = Math.min(this.anisotropy, limits.maxAnisotropy);
          tex.needsUpdate = true;
          entry.texture = tex;
          this.everLoaded = true;
          this.consecutiveFailures = 0;
          this.consecutiveRequestErrors = 0;
          this.cooldownMs = INITIAL_COOLDOWN_MS;
          entry.state = 'loaded';
          if (this.elevation && !this.elevation.disabled) {
            this.prepareRelief(entry);
          }
          this.pump();
        };
        // HTMLImageElement.onload and .decode() can both resolve on truncated PNGs in Chromium,
        // only failing later during texSubImage2D with WebGL INVALID_VALUE. Decode a throwaway
        // ImageBitmap first so corrupt or truncated streams fail cleanly before GPU upload.
        if (
          typeof HTMLImageElement !== 'undefined' &&
          img instanceof HTMLImageElement &&
          typeof createImageBitmap === 'function'
        ) {
          createImageBitmap(img).then(
            (bmp) => {
              bmp.close();
              commitTexture();
            },
            () => failRequest()
          );
          return;
        }
        commitTexture();
      },
      failRequest
    );
  }

  /** Commit a complete height grid in one step; stale callbacks cannot mutate another request. */
  private prepareRelief(entry: TileEntry): void {
    const elevation = this.elevation;
    if (!elevation || elevation.disabled || entry.preparingRelief) return;
    entry.preparingRelief = true;
    const texture = entry.texture;
    const b = tileBounds(this.activeProvider, entry.key);
    const grid = this.grid(entry.key);
    const z = elevation.zoomFor(Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth));
    void elevation.ensure(b.clipSouth, b.clipWest, b.clipNorth, b.clipEast, z)
      .catch(() => undefined)
      .then(() => {
        entry.preparingRelief = false;
        if (this.tiles.get(entry.id) !== entry || entry.texture !== texture || !texture) return;
        if (!elevation.disabled) {
          const { nx, ny } = grid;
          const heights = new Float32Array((nx + 1) * (ny + 1));
          for (let j = 0; j <= ny; j++) {
            const lat = b.clipNorth + (b.clipSouth - b.clipNorth) * j / ny;
            for (let i = 0; i <= nx; i++) {
              const lon = b.clipWest + (b.clipEast - b.clipWest) * i / nx;
              const h = elevation.heightKm(lat, lon, z);
              heights[j * (nx + 1) + i] = Number.isFinite(h) ? h : 0;
            }
          }
          entry.heights = heights;
          entry.heightGrid = grid;
          if (entry.mesh) {
            const previous = entry.mesh;
            entry.mesh = this.createMesh(entry);
            entry.mesh.visible = previous.visible;
            const prevUniforms = (previous.material as THREE.ShaderMaterial).uniforms;
            const uniforms = (entry.mesh.material as THREE.ShaderMaterial).uniforms;
            uniforms.uCover.value = prevUniforms.uCover.value;
            uniforms.uHasCover.value = prevUniforms.uHasCover.value;
            entry.mesh.userData.covered = previous.userData.covered;
            this.group.remove(previous);
            previous.geometry.dispose();
            (previous.material as THREE.Material).dispose();
          }
        }
        entry.state = 'loaded';
      });
  }

  private switchToFallback(): void {
    const next = this.activeProvider.fallback;
    if (!next) return;
    for (const entry of this.tiles.values()) {
      this.cancelRequest(entry);
      this.disposeEntry(entry);
    }
    this.maskedDrawIds.clear();
    this.tiles.clear();
    this.queue = [];
    this.inFlight = 0;
    this.consecutiveFailures = 0;
    this.consecutiveRequestErrors = 0;
    this.activeProvider = next;
    this.usingFallback = true;
    this.shared.uColorize.value = this.shared.uBaseMap.value && next.colorize ? 1 : 0;
    this.status = { ...this.status, state: 'streaming', inFlight: 0, queued: 0, failures: 0 };
  }

  /** Pause traffic temporarily when an endpoint appears unreachable; the base globe stays visible. */
  private disableProvider(): void {
    this.disabledUntil = performance.now() + this.cooldownMs;
    this.cooldownMs = Math.min(120_000, this.cooldownMs * 2);
    for (const entry of this.tiles.values()) {
      this.cancelRequest(entry);
      if (entry.state !== 'loaded') entry.state = 'queued';
    }
    this.queue = [];
    this.inFlight = 0;
    this.status = { ...this.status, state: 'unavailable', inFlight: 0, queued: 0 };
  }

  /** Vertex grid of a tile: tier-scaled density for raised ground, else by its angular size. */
  private grid(k: TileKey): { nx: number; ny: number } {
    const b = tileBounds(this.activeProvider, k);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const relief = !!this.elevation && !this.elevation.disabled;
    const limits = TIER_LIMITS[perf.tier];
    const segs = relief ? limits.reliefSegs : Math.max(8, Math.min(limits.flatMaxSegs, Math.ceil(spanDeg / 0.5)));
    const ny = Math.max(2, Math.ceil(segs * ((b.clipNorth - b.clipSouth) / Math.max(1e-6, b.clipEast - b.clipWest))));
    return { nx: segs, ny: Math.min(limits.flatMaxSegs, ny) };
  }

  private createMesh(entry: TileEntry): THREE.Mesh {
    const b = tileBounds(this.activeProvider, entry.key);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const heights = entry.heights;
    const relief = !!heights;
    const sinkKm = 0;
    const { nx, ny: nyc } = entry.heightGrid ?? this.grid(entry.key);

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= nyc; j++) {
      const lat = b.clipNorth + (b.clipSouth - b.clipNorth) * (j / nyc);
      for (let i = 0; i <= nx; i++) {
        const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
        const [x, y, z] = bodyLatLonToLocal(this.bodyName, lat, lon);
        const height = heights?.[j * (nx + 1) + i] ?? 0;
        const lift = Number.isFinite(height) ? (height - sinkKm) / this.radiusKm : 0;
        const shell = TILE_SHELL + entry.key.z * TILE_LEVEL_LIFT + lift;
        positions.push(x * shell, y * shell, z * shell);
        normals.push(x, y, z);
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
    // Modest single-sided outward skirts seal minor LOD chord seams without hanging multi-km curtains
    let skirtInfo: { ring: number[]; top: number; start: number } | null = null;
    if (relief) {
      const spanKm = spanDeg * ((Math.PI * this.radiusKm) / 180);
      const cellKm = spanKm / Math.max(1, nx);
      const skirtKm = Math.max(0.015, Math.min(0.4, cellKm * 1.15));
      const ring: number[] = [];
      for (let i = 0; i <= nx; i++) ring.push(i);
      for (let j = 1; j <= nyc; j++) ring.push(j * (nx + 1) + nx);
      for (let i = nx - 1; i >= 0; i--) ring.push(nyc * (nx + 1) + i);
      for (let j = nyc - 1; j >= 1; j--) ring.push(j * (nx + 1));
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
        // Outward-facing triangles only: avoids double-sided curtains seen from behind or below
        indices.push(a, b, a2, b, b2, a2);
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
        uUnderlayInset: { value: TILE_SHELL - 1 + entry.key.z * TILE_LEVEL_LIFT + 0.15 / this.radiusKm },
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
      const entry = this.tiles.get(id);
      if (!entry?.mesh) continue;
      const k = entry.key;
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
          // Cut only texels wholly inside the child's footprint so coarse quantization never opens gaps
          const x0 = Math.min(COVER, Math.max(0, Math.ceil((ix / n) * COVER - 1e-6)));
          const x1 = Math.min(COVER, Math.max(x0, Math.floor(((ix + 1) / n) * COVER + 1e-6)));
          const y0 = Math.min(COVER, Math.max(0, Math.ceil((1 - (iy + 1) / n) * COVER - 1e-6)));
          const y1 = Math.min(COVER, Math.max(y0, Math.floor((1 - iy / n) * COVER + 1e-6)));
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
    const maxCached = TIER_LIMITS[perf.tier].cached;
    const loaded = [...this.tiles.values()].filter((t) => t.state === 'loaded');
    if (loaded.length <= maxCached) return;
    loaded.sort((a, b) => Math.max(a.lastDrawn, a.lastWanted) - Math.max(b.lastDrawn, b.lastWanted));
    for (const entry of loaded.slice(0, loaded.length - maxCached)) {
      if (entry.lastDrawn === this.frame || entry.lastWanted >= this.frame - 2 || entry.key.z <= 2) continue;
      this.disposeEntry(entry);
      this.tiles.delete(entry.id);
    }
    // Forget long-unwanted bookkeeping entries
    for (const entry of this.tiles.values()) {
      if (entry.state !== 'loaded' && entry.state !== 'loading' && this.frame - entry.lastWanted > 600) {
        if (entry.retryTimer) {
          clearTimeout(entry.retryTimer);
          entry.retryTimer = undefined;
        }
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
      this.cancelRequest(entry);
      this.disposeEntry(entry);
    }
    this.maskedDrawIds.clear();
    this.tiles.clear();
    this.queue = [];
    this.inFlight = 0;
  }
}
