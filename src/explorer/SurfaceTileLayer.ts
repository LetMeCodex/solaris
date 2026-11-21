import * as THREE from 'three';
import type { ElevationSource } from './PlanetElevation';
import { earthElevation } from './Elevation';
import { SUN_WORLD } from '../rendering/RenderOrigin';
import { perf, QualityTier } from '../rendering/Performance';
import {
  TileProvider,
  buildTileUrl,
  effectiveMinLevel,
  gridsCompatible,
  resolveProviderForTile,
} from './ImageryRegistry';
import {
  TileKey,
  tileId,
  tileBounds,
  tileLatAtFraction,
  tileUv,
  childUvRect,
  isMercatorGrid,
  bodyLatLonToLocal,
  bodyLocalToLatLon,
  selectTilesWithPriority,
  parentTile,
  SelectionCamera,
} from './TileMath';
import { float32Pool, tileCache } from './TileCache';

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

type TileImageSource = HTMLImageElement | ImageBitmap;

interface TileEntry {
  key: TileKey;
  id: string;
  state: 'queued' | 'loading' | 'loaded' | 'missing';
  /** Step index into grid-compatible fallback chain (0 = primary, 1 = 1st fallback, ...). */
  fallbackStep: number;
  attempts: number;
  nextRetryAt?: number;
  retryAfter?: number;
  reqId?: number;
  priority: number;
  lookahead?: boolean;
  requestTimer?: ReturnType<typeof setTimeout>;
  retryTimer?: ReturnType<typeof setTimeout>;
  texture?: THREE.Texture;
  /** True when `texture.image` is an owned `ImageBitmap` that should be closed on disposal. */
  ownsBitmap?: boolean;
  mesh?: THREE.Mesh;
  /** Tracks whether `mesh` currently renders a parent-cropped fallback texture instead of its own texture. */
  meshUsesParentCrop?: boolean;
  /** Tile id of the ancestor whose texture is currently borrowed via `uUvRect` (pinned against eviction). */
  cropSourceId?: string;
  /** Zoom level of the ancestor texture currently bound to `mesh` (for progressive sharper crop upgrades). */
  cropSourceZ?: number;
  image?: HTMLImageElement;
  cacheKey?: string;
  /** Ground heights at this tile's vertices (km), pooled via `float32Pool`. */
  heights?: Float32Array;
  /** Captured with the height buffer: provider cooldowns must not change its vertex stride. */
  heightGrid?: { nx: number; ny: number };
  /** True once authoritative target-zoom DEM has been sampled for this tile. */
  reliefFinal?: boolean;
  preparingRelief?: boolean;
  /** Pooled vertex attribute buffers owned by `mesh` so disposal returns them to `float32Pool`. */
  pooledBuffers?: { pos: Float32Array; nor: Float32Array; uv: Float32Array };
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

/**
 * Tiles sit on the true globe radius (`1.0 + elevKm / radiusKm`), matching aircraft physics and
 * surface raycasts to the meter. Depth ordering over the base globe and across LOD levels is
 * handled via WebGL `polygonOffset` + `renderOrder` rather than a floating world-space shell.
 */
export const TILE_SHELL = 1.0;
/** Zero world-space per-level altitude lift (LOD depth ordering uses `polygonOffset` + `renderOrder`). */
export const TILE_LEVEL_LIFT = 0;

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
/** Hard per-frame CPU budget (ms) for mesh builds, relief rebuilds, and texture uploads. */
const FRAME_WORK_BUDGET_MS = 2.5;

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
  high: { wmts: 10, wms: 4, cached: 260, reliefSegs: 32, flatMaxSegs: 48, maxTiles: 160, maxPxPerTexel: 1.25, maxAnisotropy: 16 },
  medium: { wmts: 8, wms: 3, cached: 180, reliefSegs: 24, flatMaxSegs: 36, maxTiles: 120, maxPxPerTexel: 1.4, maxAnisotropy: 8 },
  low: { wmts: 4, wms: 2, cached: 100, reliefSegs: 16, flatMaxSegs: 24, maxTiles: 80, maxPxPerTexel: 1.65, maxAnisotropy: 4 },
};

/** Shared immutable index buffers per `(nx, ny, skirt)` topology (eliminates 99% of index allocations). */
const sharedIndexCache = new Map<string, THREE.BufferAttribute>();

function getSharedIndexBuffer(nx: number, ny: number, hasSkirt: boolean): THREE.BufferAttribute {
  const key = `${nx}x${ny}_${hasSkirt ? 1 : 0}`;
  let attr = sharedIndexCache.get(key);
  if (attr) return attr;
  const gridTris = nx * ny * 2;
  const ringCount = hasSkirt ? 2 * (nx + ny) : 0;
  const skirtTris = hasSkirt ? ringCount * 2 : 0;
  const vertCount = (nx + 1) * (ny + 1) + (hasSkirt ? ringCount * 2 : 0);
  const arr = vertCount > 65535 ? new Uint32Array((gridTris + skirtTris) * 3) : new Uint16Array((gridTris + skirtTris) * 3);
  let q = 0;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const c = a + nx + 1;
      arr[q++] = a;
      arr[q++] = c;
      arr[q++] = a + 1;
      arr[q++] = a + 1;
      arr[q++] = c;
      arr[q++] = c + 1;
    }
  }
  if (hasSkirt) {
    const top = (nx + 1) * (ny + 1);
    const start = top + ringCount;
    for (let n = 0; n < ringCount; n++) {
      const a = top + n;
      const b = top + ((n + 1) % ringCount);
      const a2 = start + n;
      const b2 = start + ((n + 1) % ringCount);
      // Outward-facing single-sided skirt triangles only
      arr[q++] = a;
      arr[q++] = b;
      arr[q++] = a2;
      arr[q++] = b;
      arr[q++] = b2;
      arr[q++] = a2;
    }
  }
  attr = new THREE.BufferAttribute(arr, 1);
  sharedIndexCache.set(key, attr);
  return attr;
}

/** Pooled 256×256 scratch cover masks so `cutCovered` performs zero per-frame 64 KB allocations. */
const coverMaskPool: Uint8Array[] = [];
function acquireCoverMask(): Uint8Array {
  const buf = coverMaskPool.pop();
  if (buf) {
    buf.fill(0);
    return buf;
  }
  return new Uint8Array(COVER * COVER);
}
function releaseCoverMask(buf: Uint8Array): void {
  if (coverMaskPool.length < 32) coverMaskPool.push(buf);
}

const vertexShader = /* glsl */ `
  uniform float uUnderlay;
  uniform float uUnderlayInset;
  uniform vec3 uTileOrigin;
  uniform vec3 uTileEast;
  uniform vec3 uTileNorth;
  uniform float uRadiusKm;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec2 vDetailM;
  varying vec3 vTileEastW;
  varying vec3 vTileNorthW;
  varying vec3 vUpW;
  varying float vElevKm;
  varying vec2 vGeoLonLat;

  void main() {
    vUv = uv;
    vec3 localPos = position + uTileOrigin;
    float localLen = max(length(localPos), 1e-9);
    vec3 radialDir = localPos / localLen;
    vec3 tilePosition = position - radialDir * (uUnderlay * uUnderlayInset);

    vWorldPosition = (modelMatrix * vec4(tilePosition, 1.0)).xyz;
    mat3 normalMat = mat3(modelMatrix);
    vec3 nRaw = normalMat * normal;
    vWorldNormal = dot(nRaw, nRaw) > 1e-10 ? normalize(nRaw) : vec3(0.0, 1.0, 0.0);
    vec3 eRaw = normalMat * uTileEast;
    vec3 noRaw = normalMat * uTileNorth;
    vec3 upRaw = normalMat * radialDir;
    vTileEastW = dot(eRaw, eRaw) > 1e-10 ? normalize(eRaw) : vec3(1.0, 0.0, 0.0);
    vTileNorthW = dot(noRaw, noRaw) > 1e-10 ? normalize(noRaw) : vec3(0.0, 0.0, 1.0);
    vUpW = dot(upRaw, upRaw) > 1e-10 ? normalize(upRaw) : vec3(0.0, 1.0, 0.0);

    // Local tangent-plane metres anchored at double-precision tile origin (zero float32 swim at z18)
    vDetailM = vec2(dot(position, uTileEast), dot(position, uTileNorth)) * (uRadiusKm * 1000.0);
    vElevKm = max(0.0, (localLen - 1.0) * uRadiusKm);
    vGeoLonLat = vec2(degrees(atan(-radialDir.z, radialDir.x)), degrees(asin(clamp(radialDir.y, -1.0, 1.0))));

    // modelViewMatrix is composed in double precision on the CPU, so vertices stay steady even
    // a few metres above the surface of a planet far from the scene origin
    vec4 mv = modelViewMatrix * vec4(tilePosition, 1.0);
    vViewPosition = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D uBaseMap;
  uniform vec4 uUvRect;       // (u0, v0, uScale, vScale) for zero-ms parent-cropped texture fallback
  uniform float uFlipMapV;    // 1 when map is a non-flipped ImageBitmap (WebGL ignores UNPACK_FLIP_Y for ImageBitmap)
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
  uniform float uHasRelief;   // 1 when this tile has 3D terrain relief (enables close micro-detail)
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  varying vec2 vDetailM;
  varying vec3 vTileEastW;
  varying vec3 vTileNorthW;
  varying vec3 vUpW;
  varying float vElevKm;
  varying vec2 vGeoLonLat;

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  float dHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float dNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dHash(i), dHash(i + vec2(1.0, 0.0)), u.x),
      mix(dHash(i + vec2(0.0, 1.0)), dHash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float microDetail(vec2 m, float pxM, float strataY) {
    float w1 = 1.0 - smoothstep(0.35, 1.0, pxM / 28.0);
    float w2 = 1.0 - smoothstep(0.35, 1.0, pxM / 7.5);
    float w3 = 1.0 - smoothstep(0.35, 1.0, pxM / 2.0);
    float n1 = (dNoise(m / 28.0) - 0.5) * w1;
    float n2 = (dNoise(m / 7.5 + vec2(13.7, 29.1)) - 0.5) * w2;
    float n3 = (dNoise(m / 2.0 - vec2(7.3, 19.4)) - 0.5) * w3;
    float strata = (dNoise(vec2(strataY * 55.0, (m.x + m.y) * 0.004)) - 0.5) * w1;
    return n1 * 0.48 + n2 * 0.32 + n3 * 0.18 + strata * 0.28;
  }

  void main() {
    if (uHasCover > 0.5 && texture2D(uCover, vUv).r > 0.5) discard;
    vec2 sampleUv = clamp(uUvRect.xy + vUv * uUvRect.zw, vec2(0.0005), vec2(0.9995));
    if (uFlipMapV > 0.5) sampleUv.y = 1.0 - sampleUv.y;
    vec4 tex = texture2D(map, sampleUv);
    vec3 col = tex.rgb;
    float outAlpha = tex.a * uOpacity;
    if (uColorize > 0.5) {
      vec3 base = texture2D(uBaseMap, vec2((vGeoLonLat.x + 180.0) / 360.0, (vGeoLonLat.y + 90.0) / 180.0)).rgb;
      vec3 trueRgb = tex.a > 0.01 ? tex.rgb / tex.a : base;
      float lum = luma(trueRgb);
      vec3 colorized = clamp(base * (lum / max(luma(base), 0.03)), 0.0, 1.0);
      float valid = smoothstep(0.5, 0.96, tex.a) * smoothstep(0.008, 0.025, lum);
      col = mix(base, colorized, valid);
      outAlpha = uOpacity;
    }

    vec3 N = normalize(vWorldNormal);
    vec3 upW = normalize(vUpW);
    vec3 sunDir = normalize(uSunWorld - vWorldPosition);
    float slope = 1.0 - clamp(dot(N, upW), 0.0, 1.0);
    float colLum = luma(col);
    float isWater = step(vElevKm, 0.008) * smoothstep(0.01, 0.07, col.b - col.r) * smoothstep(0.32, 0.10, colLum);

    // Subtle Nyquist-clamped micro-detail normal & rock/snow grain up close (zero effect from orbit)
    if (uHasRelief > 0.5 && uDaylight < 0.95) {
      float pxM = max(length(fwidth(vDetailM)), 0.05);
      float detailAmt = (1.0 - smoothstep(10.0, 44.0, pxM)) * (1.0 - isWater) * (1.0 - uDaylight);
      if (detailAmt > 0.005) {
        float eps = max(pxM * 0.75, 0.65);
        float d0 = microDetail(vDetailM, pxM, vElevKm);
        float dx = microDetail(vDetailM + vec2(eps, 0.0), pxM, vElevKm);
        float dy = microDetail(vDetailM + vec2(0.0, eps), pxM, vElevKm);
        vec2 grad = vec2(dx - d0, dy - d0) / eps;
        float bumpScale = mix(0.28, 1.15, smoothstep(0.04, 0.35, slope)) * detailAmt;
        vec3 nPerturb = N - (vTileEastW * grad.x + vTileNorthW * grad.y) * bumpScale;
        N = dot(nPerturb, nPerturb) > 1e-8 ? normalize(nPerturb) : N;
        float grain = mix(0.06, 0.14, smoothstep(0.06, 0.35, slope)) * detailAmt;
        col *= 1.0 + d0 * grain;
      }
    }

    float ndl = dot(N, sunDir);
    vec3 sunlit = uSunTint * (smoothstep(-0.08, 0.38, ndl) * 1.12) + vec3(uAmbient);
    vec3 light = mix(sunlit, vec3(1.0), uDaylight);
    col *= light;

    // Subtle specular sheen on ocean/bay water and high-altitude sunlit snow
    if (uHasRelief > 0.5 && uDaylight < 0.9) {
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 H = normalize(V + sunDir);
      float sunUp = smoothstep(-0.04, 0.18, dot(upW, sunDir));
      if (isWater > 0.05) {
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(upW, V), 0.0), 5.0);
        float glint = pow(max(dot(upW, H), 0.0), 120.0) * 1.6;
        col += (uHazeColor * 0.45 * fres + uSunTint * glint) * isWater * sunUp * (1.0 - uDaylight);
      } else if (colLum > 0.55 && vElevKm > 2.2) {
        float snowSpec = pow(max(dot(N, H), 0.0), 48.0) * 0.22 * smoothstep(0.55, 0.8, colLum);
        col += uSunTint * snowSpec * sunUp * (1.0 - uDaylight);
      }
    }

    if (uHazeDensity > 0.0) {
      float h = 1.0 - exp(-length(vViewPosition) * uHazeDensity);
      col = mix(col, uHazeColor, clamp(h, 0.0, 1.0));
    }
    gl_FragColor = vec4(max(col, vec3(0.0)), outAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

let nextLayerInstanceId = 1;

/**
 * Streams Web Mercator (`EPSG:3857`) or equirectangular (`EPSG:4326`) imagery & 3D elevation tiles
 * onto a globe at exact `1.0 + elevKm / radiusKm` radius.
 *
 * Key streaming invariants:
 * - Atomic sibling family swaps on raised terrain (no flat 0-km holes punched in elevated parents).
 * - Zero-ms parent-cropped UV fallback (`uUvRect`) so high-res 3D relief renders immediately while
 *   higher-zoom imagery streams in.
 * - Velocity-predictive lookahead prefetching for both imagery and DEM ahead of fast flight.
 * - Shared `TileCache` deduplication, hysteresis-safe aborting, Esri nodata handling, pooled
 *   `Float32Array` geometry buffers, shared topology index buffers, and `<= 2.5 ms/frame` work budget.
 */
export class SurfaceTileLayer {
  public readonly group = new THREE.Group();
  public readonly provider: TileProvider;
  private activeProvider: TileProvider;
  private usingFallback = false;
  private loader: TileImageLoader;
  private readonly useTileCache: boolean;
  private readonly cachePrefix: string;
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

  /** Velocity estimation for lookahead prefetching when caller omits explicit `cam.velocity`. */
  private prevCamPos: [number, number, number] | null = null;
  private prevCamTimeMs = 0;
  private smoothedVel: [number, number, number] = [0, 0, 0];
  private lastDemPrefetchMs = 0;

  /** Per-frame work budget tracking for deferred relief rebuilds. */
  private pendingReliefRebuilds = new Set<string>();
  private workFrameToken = -1;
  private workBudgetUsedMs = 0;

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
  private anisotropy = 16;
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
    this.useTileCache = loader === defaultLoader && typeof fetch === 'function';
    this.cachePrefix = `img:${nextLayerInstanceId++}:`;
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

  private syncGroupVisibility(): void {
    // On Earth when PhotorealEarth + ProceduralTerrain own the surface (underlay mode), hide
    // SurfaceTileLayer meshes completely so un-hazed z=7 underlay strips never poke above the
    // horizon past ProceduralTerrain's outer ring.
    const hideEarthUnderlay = this.bodyName === 'Earth' && this.shared.uUnderlay.value > 0.5;
    this.group.visible = this.shared.uOpacity.value > 0.001 && !hideEarthUnderlay;
  }

  /** Keep imagery below real photogrammetry (PhotorealEarth), pushing polygonOffset behind it. */
  public setUnderlay(on: boolean): void {
    const next = on ? 1 : 0;
    if (this.shared.uUnderlay.value === next) {
      this.syncGroupVisibility();
      return;
    }
    this.shared.uUnderlay.value = next;
    this.syncGroupVisibility();
    for (const entry of this.tiles.values()) {
      if (entry.mesh) this.applyDepthBias(entry.mesh.material as THREE.ShaderMaterial, entry.key.z);
    }
  }

  /** Whole-layer opacity (fades the imagery in over the globe map while descending). */
  public setOpacity(opacity: number): void {
    this.shared.uOpacity.value = opacity;
    this.syncGroupVisibility();
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

  /** True when at least one foreground tile has drawn at a usable spawn zoom (for preloader warm-up). */
  public isSpawnReady(minZoom = 6): boolean {
    return this.status.drawn > 0 && this.status.deepestLevel >= minZoom;
  }

  private providerFor(k: TileKey, fallbackStep: boolean | number = false): TileProvider | null {
    return resolveProviderForTile(this.activeProvider, k, fallbackStep);
  }

  public tileUrl(k: TileKey, fallbackStep: boolean | number = false): string {
    return buildTileUrl(this.activeProvider, k, fallbackStep) ?? '';
  }

  private applyDepthBias(mat: THREE.ShaderMaterial, z: number): void {
    mat.polygonOffset = true;
    if (this.shared.uUnderlay.value > 0.5) {
      mat.polygonOffsetFactor = 2;
      mat.polygonOffsetUnits = 4;
    } else {
      mat.polygonOffsetFactor = -1;
      mat.polygonOffsetUnits = -(2 + Math.min(20, z));
    }
  }

  private resolveCameraVelocity(cam: SelectionCamera, now: number): [number, number, number] | undefined {
    if (cam.velocity) return cam.velocity;
    if (this.prevCamPos && now > this.prevCamTimeMs) {
      const dt = (now - this.prevCamTimeMs) / 1000;
      if (dt > 0.004 && dt < 0.5) {
        const dx = cam.position[0] - this.prevCamPos[0];
        const dy = cam.position[1] - this.prevCamPos[1];
        const dz = cam.position[2] - this.prevCamPos[2];
        const step = Math.hypot(dx, dy, dz);
        // Ignore large teleports (> 0.025 body radii in a single tick)
        if (step < 0.025) {
          const alpha = 1 - Math.exp(-dt / 0.18);
          this.smoothedVel[0] += (dx / dt - this.smoothedVel[0]) * alpha;
          this.smoothedVel[1] += (dy / dt - this.smoothedVel[1]) * alpha;
          this.smoothedVel[2] += (dz / dt - this.smoothedVel[2]) * alpha;
        } else {
          this.smoothedVel[0] = this.smoothedVel[1] = this.smoothedVel[2] = 0;
        }
      } else if (dt >= 0.5) {
        this.smoothedVel[0] = this.smoothedVel[1] = this.smoothedVel[2] = 0;
      }
    }
    this.prevCamPos = [cam.position[0], cam.position[1], cam.position[2]];
    this.prevCamTimeMs = now;
    const speed = Math.hypot(this.smoothedVel[0], this.smoothedVel[1], this.smoothedVel[2]);
    // Only engage lookahead when moving faster than ~15 m/s on Earth (or ~2.5e-6 radii/s)
    return speed > 2.5e-6 ? [this.smoothedVel[0], this.smoothedVel[1], this.smoothedVel[2]] : undefined;
  }

  /**
   * Choose, request and draw tiles for the current view.
   * Work per frame is bounded by `FRAME_WORK_BUDGET_MS` (`<= 2.5 ms/frame`).
   */
  public update(cam: SelectionCamera): void {
    this.frame++;
    this.workFrameToken = this.frame;
    this.workBudgetUsedMs = 0;
    const frameStart = performance.now();

    if (this.isDisabled()) {
      this.status = { ...this.status, state: 'unavailable', inFlight: 0, queued: 0 };
      return;
    }

    const now = frameStart;
    const limits = TIER_LIMITS[perf.tier];
    const velocity = this.resolveCameraVelocity(cam, now);
    const effectiveCam: SelectionCamera = {
      ...cam,
      bodyName: cam.bodyName || this.bodyName || undefined,
      velocity,
      lookaheadSec: cam.lookaheadSec ?? 3.0,
    };

    const underlay = this.shared.uUnderlay.value > 0;
    const selectMinLevel = effectiveMinLevel(this.activeProvider);
    const baseSelection =
      selectMinLevel !== this.activeProvider.minLevel
        ? { ...this.activeProvider, minLevel: selectMinLevel }
        : this.activeProvider;
    const selectionProvider = underlay
      ? { ...baseSelection, maxLevel: Math.max(baseSelection.minLevel, Math.min(7, baseSelection.maxLevel)) }
      : baseSelection;

    const selected = selectTilesWithPriority(
      selectionProvider,
      effectiveCam,
      limits.maxPxPerTexel,
      underlay ? Math.min(24, limits.maxTiles) : limits.maxTiles,
    );
    const visibleWanted: TileKey[] = [];
    const wantedIds = new Set<string>();
    const wantedCacheKeys = new Set<string>();
    let deepest = -1;

    // Proactively prefetch Earth DEM along flight track ahead of arrival
    if (
      velocity &&
      this.bodyName === 'Earth' &&
      this.elevation &&
      !this.elevation.disabled &&
      now - this.lastDemPrefetchMs > 500
    ) {
      this.lastDemPrefetchMs = now;
      const p0 = bodyLocalToLatLon('Earth', cam.position[0], cam.position[1], cam.position[2]);
      const p1 = bodyLocalToLatLon(
        'Earth',
        cam.position[0] + velocity[0],
        cam.position[1] + velocity[1],
        cam.position[2] + velocity[2],
      );
      let dLon = p1.lon - p0.lon;
      if (dLon > 180) dLon -= 360;
      if (dLon < -180) dLon += 360;
      void earthElevation.prefetchAlong(p0.lat, p0.lon, p1.lat - p0.lat, dLon, effectiveCam.lookaheadSec ?? 3.0, 12);
    }

    // Queue coarse-to-fine: global ancestors first (immediate sharp stand-in anchoring the fallback
    // chain), then visible leaves nearest-first, then lookahead prefetch tiles.
    this.queue = [];
    const leafQueue: TileEntry[] = [];
    const lookaheadQueue: TileEntry[] = [];
    for (const sel of selected) {
      const k = sel.key;
      const id = tileId(k);
      wantedIds.add(id);
      if (!sel.lookahead) visibleWanted.push(k);
      let entry = this.tiles.get(id);
      if (!entry) {
        entry = {
          key: k,
          id,
          state: 'queued',
          fallbackStep: 0,
          attempts: 0,
          priority: sel.priority,
          lookahead: sel.lookahead,
          lastWanted: this.frame,
          lastDrawn: 0,
        };
        this.tiles.set(id, entry);
      }
      entry.lastWanted = this.frame;
      entry.priority = sel.priority;
      entry.lookahead = sel.lookahead;
      if (entry.cacheKey) {
        wantedCacheKeys.add(entry.cacheKey);
        if (this.useTileCache && entry.state === 'loading') {
          tileCache.updatePriority(entry.cacheKey, entry.priority);
        }
      }
      if (entry.state === 'missing' && entry.retryAfter && now >= entry.retryAfter) {
        entry.state = 'queued';
        entry.attempts = 0;
        entry.fallbackStep = 0;
        entry.retryAfter = undefined;
      }
      if (entry.state === 'queued' && (!entry.nextRetryAt || now >= entry.nextRetryAt)) {
        if (sel.lookahead) lookaheadQueue.push(entry);
        else leafQueue.push(entry);
      }
    }

    const ancestorLevels = Math.max(0, this.activeProvider.maxLevel - selectMinLevel + 1);
    const ancestorQueues: TileEntry[][] = Array.from({ length: ancestorLevels }, () => []);
    for (const sel of selected) {
      let ak: TileKey | null = sel.key;
      for (let up = 0; up < ancestorLevels; up++) {
        ak = ak ? parentTile(ak) : null;
        if (!ak || ak.z < selectMinLevel) break;
        const aid = tileId(ak);
        if (wantedIds.has(aid)) continue;
        wantedIds.add(aid);
        let entry = this.tiles.get(aid);
        if (!entry) {
          entry = {
            key: ak,
            id: aid,
            state: 'queued',
            fallbackStep: 0,
            attempts: 0,
            priority: -1000 + ak.z * 10,
            lastWanted: this.frame,
            lastDrawn: 0,
          };
          this.tiles.set(aid, entry);
        }
        entry.lastWanted = this.frame;
        entry.priority = -1000 + ak.z * 10;
        if (entry.cacheKey) {
          wantedCacheKeys.add(entry.cacheKey);
          if (this.useTileCache && entry.state === 'loading') {
            tileCache.updatePriority(entry.cacheKey, entry.priority);
          }
        }
        if (entry.state === 'missing' && entry.retryAfter && now >= entry.retryAfter) {
          entry.state = 'queued';
          entry.attempts = 0;
          entry.fallbackStep = 0;
          entry.retryAfter = undefined;
        }
        if (entry.state === 'queued' && (!entry.nextRetryAt || now >= entry.nextRetryAt)) {
          const bucket = Math.max(0, Math.min(ancestorLevels - 1, ak.z - selectMinLevel));
          ancestorQueues[bucket].push(entry);
        }
      }
    }
    // Interleave coarse global anchors (starting at z = selectMinLevel) with nearest detailed
    // foreground leaves so slot 0 anchors global coverage and slot 1 immediately refines foreground.
    const ancestors = ancestorQueues.flat();
    for (let i = 0; i < Math.max(ancestors.length, leafQueue.length); i++) {
      if (i < ancestors.length) this.queue.push(ancestors[i]);
      if (i < leafQueue.length) this.queue.push(leafQueue[i]);
    }
    this.queue.push(...lookaheadQueue);

    // Hysteresis-safe cancellation for TileCache mode; direct cancel for custom test loaders
    if (this.useTileCache) {
      tileCache.keepWanted(wantedCacheKeys, this.cachePrefix, 550);
    } else {
      for (const entry of this.tiles.values()) {
        if (entry.state === 'loading' && !wantedIds.has(entry.id) && entry.key.z > 2 && entry.image) {
          this.cancelRequest(entry);
          entry.attempts = Math.max(0, entry.attempts - 1);
          entry.state = 'queued';
        }
      }
    }
    this.pump();

    // Drain any relief rebuilds deferred from previous frame within the 2.5 ms budget
    this.drainPendingReliefRebuilds();

    // Relief-safe quadtree selection with zero-ms parent-cropped UV fallback:
    // - A tile with both imagery & DEM heights ready displays immediately (siblings stay covered by
    //   their raised parent via exact cover masking, preventing deadlocks AND flat-vs-raised cliffs).
    // - When real elevation coverage already exists (e.g. EarthElevation), visible leaves whose high-res
    //   imagery is still downloading render immediately with their parent's cropped texture (`uUvRect`)
    //   on real 3D relief vertices, then hot-swap to crisp native imagery in 0.01 ms on arrival.
    const relief = !!this.elevation && !this.elevation.disabled;
    const supportsSyncCoverage = Boolean(relief && this.elevation?.hasCoverage);

    if (supportsSyncCoverage) {
      for (const k of visibleWanted) {
        const entry = this.tiles.get(tileId(k));
        if (!entry || entry.heights || entry.preparingRelief || entry.state === 'missing') continue;
        if (entry.state === 'loaded' || this.findLoadedAncestor(k)) {
          this.prepareRelief(entry);
        }
      }
    }

    const drawIds = new Set<string>();
    for (const k of visibleWanted) {
      let drawable: TileEntry | undefined;
      for (let cur: TileKey | null = k; cur; cur = parentTile(cur)) {
        const entry = this.tiles.get(tileId(cur));
        if (!entry) continue;
        const isLeaf = cur === k;
        const hasOwnImg = entry.state === 'loaded' && Boolean(entry.texture);
        const canParentCrop =
          isLeaf &&
          supportsSyncCoverage &&
          entry.state !== 'missing' &&
          !hasOwnImg &&
          Boolean(entry.heights) &&
          Boolean(this.findLoadedAncestor(cur));
        if (!hasOwnImg && !canParentCrop) continue;
        drawable ??= entry;
        // Do not cut a flat 0-km hole in an already raised mountain while a child's DEM is still loading.
        if (!relief || Boolean(entry.heights)) {
          drawable = entry;
          break;
        }
        if (hasOwnImg && !entry.preparingRelief && entry === drawable) {
          this.prepareRelief(entry);
        }
      }
      if (drawable) {
        drawIds.add(drawable.id);
        deepest = Math.max(deepest, drawable.key.z);
      }
    }

    // Build / upgrade visible tile meshes within the <= 2.5 ms/frame work budget.
    // If a newly ready leaf exceeds the budget this frame, keep its loaded ancestor visible until next frame.
    let meshesBuiltThisFrame = 0;
    for (const id of [...drawIds]) {
      const entry = this.tiles.get(id);
      if (!entry) continue;
      if (relief && !entry.heights && entry.mesh) {
        this.prepareRelief(entry);
      }
      // If mesh exists using parent crop and own high-res texture arrived, hot-swap texture in 0.01ms!
      if (entry.mesh && entry.meshUsesParentCrop && entry.state === 'loaded' && entry.texture) {
        const mat = entry.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.map.value = entry.texture;
        (mat.uniforms.uUvRect.value as THREE.Vector4).set(0, 0, 1, 1);
        mat.uniforms.uFlipMapV.value = entry.ownsBitmap ? 1 : 0;
        entry.meshUsesParentCrop = false;
        entry.cropSourceId = undefined;
        entry.cropSourceZ = undefined;
      } else if (entry.mesh && entry.meshUsesParentCrop) {
        // Progressively sharpen parent crop if a closer intermediate ancestor arrived
        const better = this.findLoadedAncestor(entry.key);
        if (better && better.texture && (entry.cropSourceZ === undefined || better.key.z > entry.cropSourceZ)) {
          const rect = childUvRect(better.key, entry.key);
          if (rect) {
            const mat = entry.mesh.material as THREE.ShaderMaterial;
            mat.uniforms.map.value = better.texture;
            (mat.uniforms.uUvRect.value as THREE.Vector4).set(rect.u0, rect.v0, rect.u1 - rect.u0, rect.v1 - rect.v0);
            mat.uniforms.uFlipMapV.value = better.ownsBitmap ? 1 : 0;
            entry.cropSourceId = better.id;
            entry.cropSourceZ = better.key.z;
          }
        }
      }
      if (!entry.mesh) {
        const elapsed = performance.now() - frameStart;
        if (meshesBuiltThisFrame > 0 && elapsed >= FRAME_WORK_BUDGET_MS) {
          // Defer new mesh build to next frame; keep nearest already-built ancestor drawn so ZERO holes appear
          drawIds.delete(id);
          let pk = parentTile(entry.key);
          while (pk) {
            const pe = this.tiles.get(tileId(pk));
            if (pe?.mesh) {
              drawIds.add(pe.id);
              break;
            }
            pk = parentTile(pk);
          }
          continue;
        }
        const texInfo = this.resolveRenderTexture(entry);
        if (texInfo) {
          entry.mesh = this.createMesh(entry, texInfo.texture, texInfo.uvRect, texInfo.flipMapV);
          entry.meshUsesParentCrop = texInfo.isParentCrop;
          entry.cropSourceId = texInfo.sourceId;
          entry.cropSourceZ = texInfo.sourceZ;
          meshesBuiltThisFrame++;
        }
      }
    }

    for (const entry of this.tiles.values()) {
      const visible = drawIds.has(entry.id) && Boolean(entry.mesh);
      if (entry.mesh) entry.mesh.visible = visible;
      if (visible) {
        entry.lastDrawn = this.frame;
        if (entry.cropSourceId) {
          const src = this.tiles.get(entry.cropSourceId);
          if (src) src.lastDrawn = this.frame;
        }
      }
    }

    const hasAnyRelief = relief || [...drawIds].some((id) => Boolean(this.tiles.get(id)?.heights));
    const maskIds = hasAnyRelief ? drawIds : new Set<string>();
    if (maskIds.size !== this.maskedDrawIds.size || [...maskIds].some((id) => !this.maskedDrawIds.has(id))) {
      this.cutCovered(maskIds);
      this.maskedDrawIds = new Set(maskIds);
    }

    this.evict();

    const loading = this.inFlight + this.queue.length;
    this.status = {
      state: this.consecutiveFailures >= 3 ? 'degraded' : loading > 0 ? 'streaming' : visibleWanted.length > 0 ? 'ready' : 'idle',
      inFlight: this.inFlight,
      queued: this.queue.length,
      cached: [...this.tiles.values()].filter((t) => t.state === 'loaded').length,
      drawn: drawIds.size,
      deepestLevel: deepest,
      failures: this.consecutiveFailures,
    };
  }

  private findLoadedAncestor(k: TileKey): TileEntry | null {
    const childProvider = this.providerFor(k, 0);
    let pk = parentTile(k);
    while (pk) {
      const e = this.tiles.get(tileId(pk));
      if (e && e.state === 'loaded' && e.texture) {
        const ancProvider = this.providerFor(pk, e.fallbackStep);
        if (!childProvider || !ancProvider || gridsCompatible(childProvider, ancProvider)) {
          return e;
        }
      }
      pk = parentTile(pk);
    }
    return null;
  }

  private resolveRenderTexture(entry: TileEntry): {
    texture: THREE.Texture;
    uvRect: [number, number, number, number];
    isParentCrop: boolean;
    flipMapV: boolean;
    sourceId?: string;
    sourceZ?: number;
  } | null {
    if (entry.state === 'loaded' && entry.texture) {
      return { texture: entry.texture, uvRect: [0, 0, 1, 1], isParentCrop: false, flipMapV: Boolean(entry.ownsBitmap) };
    }
    const anc = this.findLoadedAncestor(entry.key);
    if (!anc?.texture) return null;
    const rect = childUvRect(anc.key, entry.key);
    if (!rect) return null;
    return {
      texture: anc.texture,
      uvRect: [rect.u0, rect.v0, rect.u1 - rect.u0, rect.v1 - rect.v0],
      isParentCrop: true,
      flipMapV: Boolean(anc.ownsBitmap),
      sourceId: anc.id,
      sourceZ: anc.key.z,
    };
  }

  /** Hide all tiles and release active network slots without discarding cached textures. */
  public hide(): void {
    if (this.useTileCache) tileCache.cancelAll(this.cachePrefix);
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
    this.pendingReliefRebuilds.clear();
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
    if (entry.cacheKey && this.useTileCache) {
      tileCache.markUnwanted(entry.cacheKey, 0);
      entry.cacheKey = undefined;
      this.inFlight = Math.max(0, this.inFlight - 1);
    }
    if (entry.image) {
      entry.image.onload = null;
      entry.image.onerror = null;
      entry.image.src = '';
      entry.image = undefined;
      this.inFlight = Math.max(0, this.inFlight - 1);
    }
    if (entry.state === 'loading' && entry.texture) {
      this.disposeTexture(entry);
    }
  }

  private disposeTexture(entry: TileEntry): void {
    if (!entry.texture) return;
    if (entry.ownsBitmap) {
      const img = entry.texture.image as { close?: () => void } | undefined;
      img?.close?.();
    }
    entry.texture.dispose();
    entry.texture = undefined;
    entry.ownsBitmap = false;
  }

  private pump(): void {
    if (this.isDisabled()) return;
    const limits = TIER_LIMITS[perf.tier];
    const trekMax = this.elevation && !this.elevation.disabled ? 4 : 6;
    const wmtsLimit = this.activeProvider.template.includes('trek.nasa.gov')
      ? Math.min(limits.wmts, trekMax)
      : this.useTileCache
        ? Math.max(limits.wmts, 12)
        : limits.wmts;
    const limit = this.activeProvider.kind === 'wms' ? limits.wms : wmtsLimit;
    while (this.inFlight < limit && this.queue.length > 0) {
      const entry = this.queue.shift()!;
      if (entry.state !== 'queued') continue;
      if (entry.nextRetryAt && performance.now() < entry.nextRetryAt) continue;
      this.request(entry);
    }
  }

  private commitTileImage(entry: TileEntry, reqId: number, img: TileImageSource, ownsBitmap: boolean): void {
    if (entry.state !== 'loading' || entry.reqId !== reqId) {
      if (ownsBitmap) (img as { close?: () => void }).close?.();
      return;
    }
    entry.reqId = undefined;
    if (entry.requestTimer) {
      clearTimeout(entry.requestTimer);
      entry.requestTimer = undefined;
    }
    this.inFlight = Math.max(0, this.inFlight - 1);
    entry.image = undefined;
    entry.cacheKey = undefined;

    const limits = TIER_LIMITS[perf.tier];
    const tex = new THREE.Texture(img as HTMLImageElement);
    // WebGL2 ignores UNPACK_FLIP_Y_WEBGL for ImageBitmap sources; keep flipY=false and invert V in shader.
    tex.flipY = !ownsBitmap;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = Math.min(this.anisotropy, limits.maxAnisotropy);
    tex.needsUpdate = true;

    this.disposeTexture(entry);
    entry.texture = tex;
    entry.ownsBitmap = ownsBitmap;
    this.everLoaded = true;
    this.consecutiveFailures = 0;
    this.consecutiveRequestErrors = 0;
    this.cooldownMs = INITIAL_COOLDOWN_MS;
    entry.state = 'loaded';

    // Hot-swap texture immediately onto an existing parent-cropped mesh (0.01ms, zero rebuild!)
    if (entry.mesh && entry.meshUsesParentCrop) {
      const mat = entry.mesh.material as THREE.ShaderMaterial;
      mat.uniforms.map.value = tex;
      (mat.uniforms.uUvRect.value as THREE.Vector4).set(0, 0, 1, 1);
      mat.uniforms.uFlipMapV.value = ownsBitmap ? 1 : 0;
      entry.meshUsesParentCrop = false;
      entry.cropSourceId = undefined;
      entry.cropSourceZ = undefined;
    }

    if (this.elevation && !this.elevation.disabled && !entry.reliefFinal) {
      this.prepareRelief(entry);
    }
    this.pump();
  }

  private handleTileFailure(entry: TileEntry, reqId: number, isNoData = false): void {
    if (entry.state !== 'loading' || entry.reqId !== reqId) return;
    entry.reqId = undefined;
    if (entry.requestTimer) {
      clearTimeout(entry.requestTimer);
      entry.requestTimer = undefined;
    }
    this.inFlight = Math.max(0, this.inFlight - 1);
    entry.cacheKey = undefined;
    if (entry.image) {
      entry.image.onload = null;
      entry.image.onerror = null;
      entry.image.src = '';
      entry.image = undefined;
    }

    // Try next grid-compatible fallback provider covering this tile key (e.g. ArcGIS -> EOX -> GIBS)
    const nextFallback = this.providerFor(entry.key, entry.fallbackStep + 1);
    if ((this.everLoaded || isNoData) && !this.usingFallback && nextFallback) {
      entry.fallbackStep++;
      entry.attempts = 0;
      entry.state = 'queued';
      entry.nextRetryAt = undefined;
      this.queue.unshift(entry);
      this.pump();
      return;
    }

    // Ocean / out-of-coverage nodata placeholder (e.g. ArcGIS z14+ over mid-ocean):
    // mark missing cleanly without counting against provider health or retrying aggressively.
    if (isNoData) {
      entry.state = 'missing';
      entry.retryAfter = performance.now() + MISSING_RETRY_MS * 4;
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
  }

  private request(entry: TileEntry): void {
    const prov = this.providerFor(entry.key, entry.fallbackStep);
    const url = prov ? buildTileUrl(this.activeProvider, entry.key, entry.fallbackStep) : null;
    if (!prov || !url) {
      // Out of bounds for every compatible provider in chain: never fire an invalid HTTP 400!
      entry.state = 'missing';
      entry.retryAfter = performance.now() + MISSING_RETRY_MS * 4;
      return;
    }

    entry.state = 'loading';
    entry.attempts++;
    entry.nextRetryAt = undefined;
    const reqId = ++this.reqCounter;
    entry.reqId = reqId;
    this.inFlight++;
    const timeoutMs = prov.kind === 'wms' ? WMS_TIMEOUT_MS : WMTS_TIMEOUT_MS;

    if (this.useTileCache) {
      const cacheKey = `${this.cachePrefix}${entry.fallbackStep}:${entry.id}`;
      entry.cacheKey = cacheKey;
      void tileCache
        .fetchImageBitmap(cacheKey, url, {
          priority: entry.priority,
          z: entry.key.z,
          timeoutMs,
          hysteresisMs: 550,
          persist: true,
        })
        .then((res) => {
          if (entry.state !== 'loading' || entry.reqId !== reqId) {
            if (res.data && typeof ImageBitmap !== 'undefined' && res.data instanceof ImageBitmap) {
              res.data.close();
            }
            return;
          }
          if (res.status === 'aborted') {
            entry.reqId = undefined;
            entry.cacheKey = undefined;
            this.inFlight = Math.max(0, this.inFlight - 1);
            entry.attempts = Math.max(0, entry.attempts - 1);
            entry.state = 'queued';
            this.pump();
            return;
          }
          if (res.status === 'nodata') {
            this.handleTileFailure(entry, reqId, true);
            return;
          }
          if (res.status !== 'ok' || !res.data) {
            this.handleTileFailure(entry, reqId, false);
            return;
          }
          const ownsBmp = typeof ImageBitmap !== 'undefined' && res.data instanceof ImageBitmap;
          this.commitTileImage(entry, reqId, res.data, ownsBmp);
        });
      return;
    }

    const failRequest = (): void => this.handleTileFailure(entry, reqId, false);
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
        if (
          typeof HTMLImageElement !== 'undefined' &&
          img instanceof HTMLImageElement &&
          typeof createImageBitmap === 'function'
        ) {
          createImageBitmap(img).then(
            (bmp) => {
              bmp.close();
              this.commitTileImage(entry, reqId, img, false);
            },
            () => failRequest(),
          );
          return;
        }
        this.commitTileImage(entry, reqId, img, false);
      },
      failRequest,
    );
  }

  private sampleHeightGrid(
    elevation: ElevationSource,
    b: ReturnType<typeof tileBounds>,
    grid: { nx: number; ny: number },
    z: number,
  ): Float32Array {
    const { nx, ny } = grid;
    const heights = float32Pool.acquire((nx + 1) * (ny + 1));
    for (let j = 0; j <= ny; j++) {
      const lat = tileLatAtFraction(this.activeProvider, b, j / ny);
      for (let i = 0; i <= nx; i++) {
        const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
        const h = elevation.heightKm(lat, lon, z);
        heights[j * (nx + 1) + i] = Number.isFinite(h) ? h : 0;
      }
    }
    return heights;
  }

  /** Commit a complete height grid in one step; stale callbacks cannot mutate another request. */
  private prepareRelief(entry: TileEntry): void {
    const elevation = this.elevation;
    if (!elevation || elevation.disabled || entry.preparingRelief) return;
    entry.preparingRelief = true;
    const textureAtStart = entry.texture;
    const b = tileBounds(this.activeProvider, entry.key);
    const grid = this.grid(entry.key);
    const z = elevation.zoomFor(Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth));

    // If the elevation source already has cached/bundled coverage (e.g. EarthElevation), seed an
    // immediate relief height grid at 0 ms so parent-cropped children render 3D mountains right away!
    if (!entry.heights && !entry.mesh && elevation.hasCoverage?.((b.clipNorth + b.clipSouth) * 0.5, (b.clipWest + b.clipEast) * 0.5, 0)) {
      entry.heights = this.sampleHeightGrid(elevation, b, grid, z);
      entry.heightGrid = grid;
    }

    void elevation
      .ensure(b.clipSouth, b.clipWest, b.clipNorth, b.clipEast, z)
      .catch(() => undefined)
      .then(() => {
        entry.preparingRelief = false;
        if (this.tiles.get(entry.id) !== entry) return;
        // If texture was swapped/disposed while loading (e.g. fallback switch), ignore stale callback
        if (textureAtStart && entry.texture !== textureAtStart) return;
        if (!elevation.disabled) {
          const prevHeights = entry.heights;
          entry.heights = this.sampleHeightGrid(elevation, b, grid, z);
          entry.heightGrid = grid;
          entry.reliefFinal = true;
          if (prevHeights) float32Pool.release(prevHeights);
          if (entry.mesh) {
            // Respect the 2.5 ms/frame budget when many DEM tiles resolve in the same microtask burst
            if (this.workFrameToken === this.frame && this.workBudgetUsedMs >= FRAME_WORK_BUDGET_MS) {
              this.pendingReliefRebuilds.add(entry.id);
            } else {
              const t0 = performance.now();
              this.rebuildTileMeshInPlace(entry);
              this.workBudgetUsedMs += performance.now() - t0;
            }
          }
        }
      });
  }

  private rebuildTileMeshInPlace(entry: TileEntry): void {
    const previous = entry.mesh;
    if (!previous) return;
    const texInfo = this.resolveRenderTexture(entry);
    if (!texInfo) return;
    const wasVisible = previous.visible;
    const replacement = this.createMesh(entry, texInfo.texture, texInfo.uvRect, texInfo.flipMapV);
    replacement.visible = wasVisible;
    const prevUniforms = (previous.material as THREE.ShaderMaterial).uniforms;
    const nextUniforms = (replacement.material as THREE.ShaderMaterial).uniforms;
    nextUniforms.uCover.value = prevUniforms.uCover.value;
    nextUniforms.uHasCover.value = prevUniforms.uHasCover.value;
    replacement.userData.covered = previous.userData.covered;
    entry.mesh = replacement;
    entry.meshUsesParentCrop = texInfo.isParentCrop;
    entry.cropSourceId = texInfo.sourceId;
    entry.cropSourceZ = texInfo.sourceZ;
    this.group.remove(previous);
    previous.geometry.setIndex(null);
    previous.geometry.dispose();
    (previous.material as THREE.Material).dispose();
  }

  private drainPendingReliefRebuilds(): void {
    if (this.pendingReliefRebuilds.size === 0) return;
    const start = performance.now();
    for (const id of [...this.pendingReliefRebuilds]) {
      this.pendingReliefRebuilds.delete(id);
      const entry = this.tiles.get(id);
      if (!entry?.mesh || !entry.heights) continue;
      this.rebuildTileMeshInPlace(entry);
      if (performance.now() - start >= FRAME_WORK_BUDGET_MS) break;
    }
    this.workBudgetUsedMs += performance.now() - start;
  }

  private switchToFallback(): void {
    const next = this.activeProvider.fallback;
    if (!next) return;
    if (this.useTileCache) tileCache.cancelAll(this.cachePrefix);
    for (const entry of this.tiles.values()) {
      this.cancelRequest(entry);
      this.disposeEntry(entry);
    }
    this.tiles.clear();
    this.queue = [];
    this.maskedDrawIds.clear();
    this.pendingReliefRebuilds.clear();
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
    if (this.useTileCache) tileCache.cancelAll(this.cachePrefix);
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
    if (isMercatorGrid(this.activeProvider)) {
      // Web Mercator tiles are physically 1:1 squares on the globe (dLat ≈ dLon * cos(lat))
      return { nx: segs, ny: segs };
    }
    const ny = Math.max(2, Math.ceil(segs * ((b.clipNorth - b.clipSouth) / Math.max(1e-6, b.clipEast - b.clipWest))));
    return { nx: segs, ny: Math.min(limits.flatMaxSegs, ny) };
  }

  private createMesh(
    entry: TileEntry,
    texture: THREE.Texture,
    uvRect: [number, number, number, number],
    flipMapV: boolean,
  ): THREE.Mesh {
    const b = tileBounds(this.activeProvider, entry.key);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const heights = entry.heights;
    const relief = Boolean(heights);
    const { nx, ny: nyc } = entry.heightGrid ?? this.grid(entry.key);

    // Double-precision tile center origin so vertex positions stored in Float32Array keep sub-mm precision at z18!
    const midLat = tileLatAtFraction(this.activeProvider, b, 0.5);
    const midLon = (b.clipWest + b.clipEast) * 0.5;
    const [cx, cy, cz] = bodyLatLonToLocal(this.bodyName, midLat, midLon);
    const midRow = Math.floor(nyc * 0.5);
    const midCol = Math.floor(nx * 0.5);
    const midH = heights?.[midRow * (nx + 1) + midCol] ?? 0;
    const originShell = TILE_SHELL + (Number.isFinite(midH) ? midH / this.radiusKm : 0);
    const ox = cx * originShell;
    const oy = cy * originShell;
    const oz = cz * originShell;

    // Orthonormal tangent basis (East, North) at tile center for float32-jitter-free micro-detail coords
    const upC = new THREE.Vector3(cx, cy, cz).normalize();
    const eastC = new THREE.Vector3(0, 1, 0).cross(upC);
    if (eastC.lengthSq() < 1e-8) eastC.set(1, 0, 0);
    eastC.normalize();
    const northC = new THREE.Vector3().crossVectors(upC, eastC).normalize();

    const gridVerts = (nx + 1) * (nyc + 1);
    const ringCount = relief ? 2 * (nx + nyc) : 0;
    const totalVerts = gridVerts + ringCount * 2;

    // Acquire RAM-aligned pooled Float32Arrays (zero GC churn during streaming)
    const prevPool = entry.pooledBuffers;
    const posArr = float32Pool.acquire(totalVerts * 3);
    const norArr = float32Pool.acquire(totalVerts * 3);
    const uvArr = float32Pool.acquire(totalVerts * 2);
    entry.pooledBuffers = { pos: posArr, nor: norArr, uv: uvArr };
    if (prevPool) {
      float32Pool.release(prevPool.pos);
      float32Pool.release(prevPool.nor);
      float32Pool.release(prevPool.uv);
    }

    let vIdx = 0;
    for (let j = 0; j <= nyc; j++) {
      const lat = tileLatAtFraction(this.activeProvider, b, j / nyc);
      for (let i = 0; i <= nx; i++) {
        const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
        const [x, y, z] = bodyLatLonToLocal(this.bodyName, lat, lon);
        const height = heights?.[j * (nx + 1) + i] ?? 0;
        const lift = Number.isFinite(height) ? height / this.radiusKm : 0;
        const shell = TILE_SHELL + entry.key.z * TILE_LEVEL_LIFT + lift;
        const p3 = vIdx * 3;
        posArr[p3] = x * shell - ox;
        posArr[p3 + 1] = y * shell - oy;
        posArr[p3 + 2] = z * shell - oz;
        norArr[p3] = x;
        norArr[p3 + 1] = y;
        norArr[p3 + 2] = z;
        const [u, v] = tileUv(this.activeProvider, b, lat, lon);
        const p2 = vIdx * 2;
        uvArr[p2] = u;
        uvArr[p2 + 1] = v;
        vIdx++;
      }
    }

    // Modest single-sided radially-dropped skirts seal LOD chord cracks without hanging curtains!
    let ring: number[] | null = null;
    if (relief) {
      const spanKm = spanDeg * ((Math.PI * this.radiusKm) / 180);
      const cellKm = spanKm / Math.max(1, nx);
      const skirtKm = Math.max(0.004, Math.min(0.12, cellKm * 0.45));
      ring = [];
      for (let i = 0; i <= nx; i++) ring.push(i);
      for (let j = 1; j <= nyc; j++) ring.push(j * (nx + 1) + nx);
      for (let i = nx - 1; i >= 0; i--) ring.push(nyc * (nx + 1) + i);
      for (let j = nyc - 1; j >= 1; j--) ring.push(j * (nx + 1));

      // Top edge duplicates (separate vertices so skirt normals can match top terrain slope cleanly)
      for (let r = 0; r < ring.length; r++) {
        const k = ring[r];
        const dst3 = (gridVerts + r) * 3;
        const dst2 = (gridVerts + r) * 2;
        posArr[dst3] = posArr[k * 3];
        posArr[dst3 + 1] = posArr[k * 3 + 1];
        posArr[dst3 + 2] = posArr[k * 3 + 2];
        norArr[dst3] = norArr[k * 3];
        norArr[dst3 + 1] = norArr[k * 3 + 1];
        norArr[dst3 + 2] = norArr[k * 3 + 2];
        uvArr[dst2] = uvArr[k * 2];
        uvArr[dst2 + 1] = uvArr[k * 2 + 1];
      }

      // Bottom edge vertices pulled strictly radially inward by modest skirtKm (zero chord distortion at any z)
      const bottomStart = gridVerts + ring.length;
      const dropUnits = skirtKm / this.radiusKm;
      for (let r = 0; r < ring.length; r++) {
        const k = ring[r];
        const ax = posArr[k * 3] + ox;
        const ay = posArr[k * 3 + 1] + oy;
        const az = posArr[k * 3 + 2] + oz;
        const len = Math.hypot(ax, ay, az) || 1;
        const scale = (len - dropUnits) / len;
        const dst3 = (bottomStart + r) * 3;
        const dst2 = (bottomStart + r) * 2;
        posArr[dst3] = ax * scale - ox;
        posArr[dst3 + 1] = ay * scale - oy;
        posArr[dst3 + 2] = az * scale - oz;
        norArr[dst3] = norArr[k * 3];
        norArr[dst3 + 1] = norArr[k * 3 + 1];
        norArr[dst3 + 2] = norArr[k * 3 + 2];
        uvArr[dst2] = uvArr[k * 2];
        uvArr[dst2 + 1] = uvArr[k * 2 + 1];
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(norArr, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
    geo.setIndex(getSharedIndexBuffer(nx, nyc, relief));

    if (relief) {
      geo.computeVertexNormals();
      if (ring) {
        const bottomStart = gridVerts + ring.length;
        for (let r = 0; r < ring.length; r++) {
          const k3 = ring[r] * 3;
          const t3 = (gridVerts + r) * 3;
          const b3 = (bottomStart + r) * 3;
          norArr[t3] = norArr[b3] = norArr[k3];
          norArr[t3 + 1] = norArr[b3 + 1] = norArr[k3 + 1];
          norArr[t3 + 2] = norArr[b3 + 2] = norArr[k3 + 2];
        }
        (geo.attributes.normal as THREE.BufferAttribute).needsUpdate = true;
      }
    }
    geo.computeBoundingSphere();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        ...this.shared,
        uUnderlayInset: { value: 1.25 / Math.max(1, this.radiusKm) },
        uTileOrigin: { value: new THREE.Vector3(ox, oy, oz) },
        uTileEast: { value: eastC },
        uTileNorth: { value: northC },
        uRadiusKm: { value: this.radiusKm },
        uUvRect: { value: new THREE.Vector4(uvRect[0], uvRect[1], uvRect[2], uvRect[3]) },
        uFlipMapV: { value: flipMapV ? 1 : 0 },
        uSunWorld: SUN_WORLD,
        map: { value: texture },
        uCover: { value: null },
        uHasCover: { value: 0 },
        uHasRelief: { value: relief ? 1 : 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
      polygonOffset: true,
    });
    this.applyDepthBias(mat, entry.key.z);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(ox, oy, oz);
    mesh.name = `tile_${entry.id}`;
    mesh.renderOrder = 1 + entry.key.z * 0.01;
    this.group.add(mesh);
    return mesh;
  }

  /**
   * Cut away parent tile texels strictly covered by finer drawn children using exact `childUvRect`
   * (valid identically for Equirectangular and Web Mercator quadtrees) and pooled scratch buffers.
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
          const rect = childUvRect(pk, k);
          if (rect) {
            let m = masks.get(pid);
            if (!m) masks.set(pid, (m = acquireCoverMask()));
            // Cut only texels wholly inside the child's UV footprint so quantization never opens gaps
            const x0 = Math.min(COVER, Math.max(0, Math.ceil(rect.u0 * COVER - 1e-6)));
            const x1 = Math.min(COVER, Math.max(x0, Math.floor(rect.u1 * COVER + 1e-6)));
            const y0 = Math.min(COVER, Math.max(0, Math.ceil(rect.v0 * COVER - 1e-6)));
            const y1 = Math.min(COVER, Math.max(y0, Math.floor(rect.v1 * COVER + 1e-6)));
            for (let y = y0; y < y1; y++) {
              const row = y * COVER;
              for (let x = x0; x < x1; x++) m[row + x] = 255;
            }
          }
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
      entry.mesh!.userData.covered = Boolean(m);
    }
    for (const m of masks.values()) releaseCoverMask(m);
  }

  private evict(): void {
    const maxCached = TIER_LIMITS[perf.tier].cached;
    const loaded = [...this.tiles.values()].filter((t) => t.state === 'loaded' || Boolean(t.mesh));
    if (loaded.length <= maxCached) return;
    const pinnedCropSources = new Set<string>();
    for (const t of this.tiles.values()) {
      if (t.mesh && t.cropSourceId) pinnedCropSources.add(t.cropSourceId);
    }
    loaded.sort((a, b) => Math.max(a.lastDrawn, a.lastWanted) - Math.max(b.lastDrawn, b.lastWanted));
    for (const entry of loaded.slice(0, loaded.length - maxCached)) {
      if (
        entry.lastDrawn === this.frame ||
        entry.lastWanted >= this.frame - 2 ||
        entry.key.z <= 2 ||
        pinnedCropSources.has(entry.id)
      ) {
        continue;
      }
      this.disposeEntry(entry);
      this.tiles.delete(entry.id);
    }
    for (const entry of this.tiles.values()) {
      if (entry.state !== 'loaded' && entry.state !== 'loading' && !entry.mesh && this.frame - entry.lastWanted > 600) {
        if (entry.retryTimer) {
          clearTimeout(entry.retryTimer);
          entry.retryTimer = undefined;
        }
        if (entry.heights) {
          float32Pool.release(entry.heights);
          entry.heights = undefined;
        }
        this.tiles.delete(entry.id);
      }
    }
  }

  private disposeEntry(entry: TileEntry): void {
    this.pendingReliefRebuilds.delete(entry.id);
    if (entry.mesh) {
      this.group.remove(entry.mesh);
      // Detach shared cached index buffer before disposing geometry
      entry.mesh.geometry.setIndex(null);
      entry.mesh.geometry.dispose();
      (entry.mesh.material as THREE.Material).dispose();
      entry.mesh = undefined;
    }
    if (entry.pooledBuffers) {
      float32Pool.release(entry.pooledBuffers.pos);
      float32Pool.release(entry.pooledBuffers.nor);
      float32Pool.release(entry.pooledBuffers.uv);
      entry.pooledBuffers = undefined;
    }
    if (entry.heights) {
      float32Pool.release(entry.heights);
      entry.heights = undefined;
    }
    this.disposeTexture(entry);
    entry.cover?.dispose();
    entry.cover = undefined;
  }

  public dispose(): void {
    if (this.useTileCache) tileCache.cancelAll(this.cachePrefix);
    for (const entry of this.tiles.values()) {
      this.cancelRequest(entry);
      this.disposeEntry(entry);
    }
    this.tiles.clear();
    this.queue = [];
    this.maskedDrawIds.clear();
    this.pendingReliefRebuilds.clear();
    this.inFlight = 0;
  }
}
