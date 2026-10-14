import * as THREE from 'three';
import { TileProvider } from './ImageryRegistry';
import {
  TileKey,
  tileId,
  tileBounds,
  latLonToLocal,
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

const MAX_CONCURRENT = 6;
const MAX_CACHED = 220;
const MAX_ATTEMPTS = 3;
const PROVIDER_FAILURE_LIMIT = 8;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uAmbient;
  uniform float uDaylight;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec4 tex = texture2D(map, vUv);
    // Sunlight from the Sun at the origin, with a soft terminator; a faint ambient keeps the
    // night side legible for exploration
    vec3 sunDir = normalize(-vWorldPosition);
    float ndl = dot(normalize(vWorldNormal), sunDir);
    float light = smoothstep(-0.08, 0.35, ndl) * 1.1 + uAmbient;
    // Optional "daylight" view: even illumination for reading the map on the night side
    light = mix(light, 0.85 + 0.25 * max(ndl, 0.0), uDaylight);
    gl_FragColor = vec4(tex.rgb * light, uOpacity);
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
  /** Shared by every tile material, so toggling it is free. */
  private daylight = { value: 0 };
  private frame = 0;
  private status: LayerStatus = { state: 'idle', inFlight: 0, queued: 0, cached: 0, drawn: 0, deepestLevel: -1, failures: 0 };

  constructor(provider: TileProvider, loader: TileImageLoader = defaultLoader) {
    this.provider = provider;
    this.loader = loader;
    this.group.name = 'surface_tile_layer';
  }

  /** Even illumination instead of the real Sun angle (for exploring the night side). */
  public setDaylight(on: boolean): void {
    this.daylight.value = on ? 1 : 0;
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
    for (const k of wanted) {
      const pk = parentTile(k);
      if (!pk) continue;
      const pid = tileId(pk);
      if (wantedIds.has(pid)) continue;
      wantedIds.add(pid);
      let entry = this.tiles.get(pid);
      if (!entry) {
        entry = { key: pk, id: pid, state: 'queued', attempts: 0, lastWanted: this.frame, lastDrawn: 0 };
        this.tiles.set(pid, entry);
      }
      entry.lastWanted = this.frame;
      if (entry.state === 'queued') this.queue.push(entry);
    }
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

    // Draw: each wanted tile, or its nearest loaded ancestor
    const drawIds = new Set<string>();
    for (const k of wanted) {
      let cur: TileKey | null = k;
      while (cur) {
        const e = this.tiles.get(tileId(cur));
        if (e && e.state === 'loaded') {
          drawIds.add(e.id);
          deepest = Math.max(deepest, cur.z);
          break;
        }
        cur = parentTile(cur);
      }
    }
    // Do not draw an ancestor and its descendant together (overlap) — keep the descendants
    for (const id of [...drawIds]) {
      let cur = parentTile(this.tiles.get(id)!.key);
      while (cur) {
        drawIds.delete(tileId(cur));
        cur = parentTile(cur);
      }
    }
    for (const entry of this.tiles.values()) {
      const visible = drawIds.has(entry.id);
      if (visible && !entry.mesh && entry.texture) entry.mesh = this.createMesh(entry);
      if (entry.mesh) entry.mesh.visible = visible;
      if (visible) entry.lastDrawn = this.frame;
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

  /** Hide all tiles without discarding the cache (camera left the surface range). */
  public hide(): void {
    for (const entry of this.tiles.values()) if (entry.mesh) entry.mesh.visible = false;
    this.queue = [];
    this.status = { ...this.status, state: this.disabled ? 'unavailable' : 'idle', queued: 0, drawn: 0 };
  }

  private pump(): void {
    while (this.inFlight < MAX_CONCURRENT && this.queue.length > 0) {
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
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        entry.texture = tex;
        entry.state = 'loaded';
        this.everLoaded = true;
        this.consecutiveFailures = 0;
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

  private createMesh(entry: TileEntry): THREE.Mesh {
    const b = tileBounds(this.provider, entry.key);
    const spanDeg = Math.max(b.clipEast - b.clipWest, b.clipNorth - b.clipSouth);
    const segs = Math.max(4, Math.min(48, Math.ceil(spanDeg / 1.5)));
    const nx = segs;
    const ny = Math.max(2, Math.ceil(segs * ((b.clipNorth - b.clipSouth) / Math.max(1e-6, b.clipEast - b.clipWest))));
    const nyc = Math.min(48, ny);

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= nyc; j++) {
      const lat = b.clipNorth + (b.clipSouth - b.clipNorth) * (j / nyc);
      for (let i = 0; i <= nx; i++) {
        const lon = b.clipWest + (b.clipEast - b.clipWest) * (i / nx);
        const [x, y, z] = latLonToLocal(lat, lon);
        positions.push(x * TILE_SHELL, y * TILE_SHELL, z * TILE_SHELL);
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
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeBoundingSphere();

    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: entry.texture }, uOpacity: { value: 1 }, uAmbient: { value: 0.07 }, uDaylight: this.daylight },
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = `tile_${entry.id}`;
    // Deeper tiles draw after shallower ones
    mesh.renderOrder = 1 + entry.key.z * 0.01;
    this.group.add(mesh);
    return mesh;
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
