import * as THREE from 'three';
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { bodyLatLonToLocal } from './TileMath';
import { SUN_WORLD } from '../rendering/RenderOrigin';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from '../rendering/AerialPerspective';

/**
 * Procedural 3D buildings where Google has none: real building outlines from OpenStreetMap
 * (OpenFreeMap's vector tiles, OpenMapTiles schema: `building` layer with `render_height`; free, no
 * key, served from a CDN), raised to their real height or a likely one, with
 * generated facades (plaster in the region's colours, a grid of windows) and flat roofs, lit by the
 * real Sun; at night some windows light up.
 *
 * Pilot region: Varanasi (Google's tiles there are photographs draped over the terrain, with no
 * buildings). More regions are a list entry each (PILOT_REGIONS).
 *
 * The ground they stand on is Google's drawn ground: the first building cell measures the offset
 * between the elevation data and the drawn ground under it (they differ by the geoid, tens of
 * metres in India) and every cell in the region uses it.
 *
 * Note: Google's Map Tiles policies should be checked before mixing these with Google's tiles in
 * a public release.
 */

export interface PilotRegion {
  name: string;
  south: number;
  west: number;
  north: number;
  east: number;
  /** Facade colours (sRGB hex) common in the region. */
  palette: string[];
}

/**
 * Where the buildings are made here: the Indian subcontinent (Google's tiles there are photographs
 * draped over the ground, towns and cities flat). Painted plaster and concrete in the colours
 * common there. More regions are a list entry each.
 */
export const PILOT_REGIONS: PilotRegion[] = [
  { name: 'India', south: 6.5, west: 68.0, north: 37.1, east: 97.5, palette: ['#e8d7b6', '#d9b98c', '#e6c79a', '#c99b74', '#efe3cc', '#d8a7a1', '#cfc2a8', '#dfe3e0', '#bfd0d6', '#e9e2d0', '#c9b79c', '#f1ead9'] },
];

/** Buildings made by rule where the map has none (see ProceduralCity.generate). */
const GEN_PITCH_M = 24;
const GEN_MAX = 4500;
/**
 * A map colour (building:colour) as three.js can read it, or null: a hex code or a CSS name, the
 * first of a list ("red;black"). Checked first: three.js only warns on what it cannot read, once
 * per building, and Delhi alone logged tens of thousands of warnings.
 */
const colourCache = new Map<string, THREE.Color | null>();
function readColour(v: string | undefined): THREE.Color | null {
  if (!v) return null;
  let c = colourCache.get(v);
  if (c !== undefined) return c;
  const first = v.split(/[;,]/)[0].trim().toLowerCase();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(first);
  const names = THREE.Color.NAMES as Record<string, number>;
  c = hex ? new THREE.Color(`#${hex[1]}`).convertSRGBToLinear() : first in names ? new THREE.Color(names[first]).convertSRGBToLinear() : null;
  colourCache.set(v, c);
  return c;
}

/** Black plastic water tanks on the roofs. */
const TANK = new THREE.Color(0.035, 0.035, 0.04);

/** Buildings come at zoom 14 (one tile ~2 km across at Varanasi's latitude). */
const Z = 14;
const TILEJSON = 'https://tiles.openfreemap.org/planet';
const R_KM = 6378.137;

interface Cell {
  key: string;
  mesh: THREE.Mesh | null;
  loading: boolean;
  lastUsed: number;
  /** The ground offset its buildings were set on (km). */
  offsetKm: number;
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const vertexShader = /* glsl */ `
attribute vec3 aColor;
attribute vec2 aFacade;
attribute float aSeed;
varying vec3 vColor;
varying vec2 vFacade;
varying float vSeed;
varying vec3 vWorld;
varying vec3 vNormalW;
void main() {
  vColor = aColor;
  vFacade = aFacade;
  vSeed = aSeed;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uSunW;
uniform vec3 uEarthC;
uniform float uKmPerUnit;
uniform float uCamAltKm;
uniform float uHaze;
varying vec3 vColor;
varying vec2 vFacade;
varying float vSeed;
varying vec3 vWorld;
varying vec3 vNormalW;
${AERIAL_PERSPECTIVE_GLSL}
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec3 up = normalize(vWorld - uEarthC);
  vec3 sun = normalize(uSunW - uEarthC);
  float sunUp = dot(up, sun);
  float day = smoothstep(-0.10, 0.12, sunUp);
  vec3 n = normalize(vNormalW);
  float wall = 1.0 - abs(dot(n, up));
  // Painted plaster weathers: the paint's colour held back towards the grey of old concrete,
  // every building a little different
  float lumC = dot(vColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 base = mix(vec3(lumC), vColor, 0.42 + 0.3 * vSeed) * (0.62 + 0.2 * fract(vSeed * 7.3));
  float glow = 0.0;
  float gloss = 0.0;
  if (wall > 0.5 && vFacade.y > 0.0) {
    // Storeys of 3.2 m: a band of windows (glass, some shuttered), a floor slab line between, rain
    // streaks down from the roof line, the ground floor darker (shops, shade)
    vec2 cell = vec2(vFacade.x / 3.0, vFacade.y / 3.2);
    vec2 f = fract(cell);
    float px = max(fwidth(cell.x), fwidth(cell.y));
    float show = 1.0 - smoothstep(0.25, 0.7, px);
    float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.32, f.y) * step(f.y, 0.82) * step(0.6, vFacade.y);
    float r = h(floor(cell) + vSeed * 31.0);
    vec3 glass = mix(vec3(0.07, 0.09, 0.12), vec3(0.20, 0.25, 0.30), r);
    base = mix(base, mix(base * 0.78, glass, show), win * 0.9);
    gloss = win * show;
    float slab = smoothstep(0.06, 0.0, f.y) * show;
    base *= 1.0 - 0.22 * slab;
    float streak = vn(vec2(vFacade.x * 0.9 + vSeed * 40.0, vFacade.y * 0.08));
    base *= 0.84 + 0.22 * streak;
    base *= mix(0.72, 1.0, smoothstep(0.0, 3.4, vFacade.y));
    glow = win * step(0.5, r) * (0.5 + 0.5 * h(floor(cell) + 3.7));
  } else {
    // Flat concrete roofs: grey, stained, a parapet's shade round the edge left to the walls
    float st = h(vec2(vSeed * 91.0, vSeed * 17.0));
    base = mix(vec3(0.42, 0.41, 0.39), base, 0.22) * (0.8 + 0.3 * st);
  }
  float lamb = max(dot(n, sun), 0.0);
  vec3 sunCol = mix(vec3(1.0, 0.7, 0.5), vec3(1.0, 0.97, 0.92), smoothstep(0.02, 0.3, sunUp));
  // Sky light from above, and light bounced up from the street on the walls
  vec3 amb = vec3(0.20, 0.24, 0.33) * (0.55 + 0.45 * max(dot(n, up), 0.0)) + vec3(0.10, 0.09, 0.075) * wall;
  vec3 night = vec3(0.085, 0.1, 0.155) + uMoonLight * smoothstep(-0.04, 0.2, dot(up, uMoonDir));
  vec3 col = base * ((sunCol * lamb * 0.9 + amb) * day + night * (1.0 - day));
  // The sky in the glass
  vec3 V = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - max(dot(n, V), 0.0), 4.0);
  col += apSky(sunUp) * gloss * (0.08 + 0.5 * fres) * day;
  col += vec3(1.0, 0.72, 0.42) * glow * (1.0 - day) * 1.6;
  float km = length(vWorld - cameraPosition) * uKmPerUnit;
  col = aerialPerspective(col, km, max(0.0, uCamAltKm * 0.5), uHaze, V, sun, sunUp);
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const groundVertex = /* glsl */ `
attribute vec2 aUv;
attribute float aKind;
varying vec2 vUv;
varying float vKind;
varying vec3 vWorld;
void main() {
  vUv = aUv;
  vKind = aKind;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const groundFragment = /* glsl */ `
uniform vec3 uSunW;
uniform vec3 uEarthC;
uniform float uKmPerUnit;
uniform float uCamAltKm;
uniform float uHaze;
varying vec2 vUv;
varying float vKind;
varying vec3 vWorld;
${AERIAL_PERSPECTIVE_GLSL}
float h2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float n2(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec3 up = normalize(vWorld - uEarthC);
  vec3 sun = normalize(uSunW - uEarthC);
  float sunUp = dot(up, sun);
  float day = smoothstep(-0.10, 0.12, sunUp);
  float k = floor(vKind + 0.5);
  vec3 base;
  if (k >= 2.5) {
    // Asphalt: worn, patched, darker down the wheel tracks; lines on the larger roads
    float px = max(fwidth(vUv.x), 0.01);
    base = vec3(0.16, 0.16, 0.17) * (0.85 + 0.3 * n2(vUv * vec2(0.05, 3.0)) + 0.1 * n2(vUv * 0.7));
    if (k < 4.5) base = mix(base, vec3(0.30, 0.28, 0.26), smoothstep(0.85, 1.0, abs(vUv.y)));
    if (k > 3.5 && k < 4.5) {
      float show = 1.0 - smoothstep(0.3, 1.2, px);
      float centre = smoothstep(0.035, 0.0, abs(vUv.y)) * step(0.5, fract(vUv.x / 9.0));
      float lanes = smoothstep(0.03, 0.0, abs(abs(vUv.y) - 0.5)) * step(0.6, fract(vUv.x / 6.0));
      float edge = smoothstep(0.03, 0.0, abs(abs(vUv.y) - 0.93));
      base = mix(base, vec3(0.75, 0.73, 0.66), clamp(centre + lanes * 0.8 + edge, 0.0, 1.0) * show * 0.8);
    }
    if (k > 4.5) base = vec3(0.36, 0.31, 0.25) * (0.9 + 0.2 * n2(vUv * 0.5));
  } else if (k >= 1.5) {
    base = vec3(0.05, 0.10, 0.11);
  } else {
    // Grass and trees: lawns, worn paths, tree crowns
    base = mix(vec3(0.16, 0.24, 0.09), vec3(0.24, 0.30, 0.12), n2(vUv / 9.0));
    base = mix(base, vec3(0.05, 0.11, 0.04), smoothstep(0.55, 0.75, n2(vUv / 6.0 + 3.0)) * 0.8);
  }
  vec3 sunCol = mix(vec3(1.0, 0.7, 0.5), vec3(1.0, 0.97, 0.92), smoothstep(0.02, 0.3, sunUp));
  vec3 night = vec3(0.085, 0.1, 0.155) + uMoonLight * smoothstep(-0.04, 0.2, dot(up, uMoonDir));
  vec3 col = base * ((sunCol * max(sunUp, 0.0) * 1.1 + vec3(0.20, 0.24, 0.33)) * day + night * (1.0 - day));
  vec3 V = normalize(cameraPosition - vWorld);
  if (k >= 1.5 && k < 2.5) {
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(up, V), 0.0), 5.0);
    col = mix(col, apSky(sunUp) * (0.25 + 0.75 * day), fres);
  }
  float km = length(vWorld - cameraPosition) * uKmPerUnit;
  col = aerialPerspective(col, km, max(0.0, uCamAltKm * 0.5), uHaze, V, sun, sunUp);
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** A building outline: its outer ring (lat/lon) and its height, metres. */
interface Footprint {
  ring: Array<{ lat: number; lon: number }>;
  /** Inner rings (courtyards, a stadium's open middle). */
  holes?: Array<Array<{ lat: number; lon: number }>>;
  /** The building's colour from the map (building:colour), CSS form. */
  colour?: string;
  heightM: number;
  minM: number;
  id: number;
}

const tileX = (lon: number): number => Math.floor(((lon + 180) / 360) * 2 ** Z);
const tileY = (lat: number): number => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z);
};
const tileLon = (x: number): number => (x / 2 ** Z) * 360 - 180;
const tileLat = (y: number): number => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** Z))) * 180) / Math.PI;

export class ProceduralCity {
  public readonly group = new THREE.Group();
  private cells = new Map<string, Cell>();
  private material: THREE.ShaderMaterial;
  private building: Promise<void> = Promise.resolve();
  private paceT = 0;

  /** Gives the frame back once this frame's few milliseconds of building are used. */
  private async pace(): Promise<void> {
    const now = performance.now();
    if (!this.paceT) this.paceT = now;
    if (now - this.paceT < 5) return;
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    this.paceT = performance.now();
  }
  private groundMaterial: THREE.ShaderMaterial;
  private earthCentre = { value: new THREE.Vector3() };
  private kmPerUnit = { value: 1 };
  private camAltKm = { value: 1 };
  /** The air's haze factor, as the tiles have it (set by the scene). */
  public haze = { value: 1 };
  private lastFetch = 0;
  private backoffMs = 400;
  private tileUrl: string | null = null;
  /** Drawn ground minus elevation data under the region, km (measured once per region). */
  private groundOffsetKm: number | null = null;
  /** Where the procedural terrain's ground is against the height data (km), until the tiles' is known. */
  public fallbackOffsetKm: number | null = null;
  /** The same offset as measured elsewhere (under the jet), used until a cell measures its own. */
  public offsetHintKm: number | null = null;
  /** Asks the drawn ground's height (km above the ellipsoid) at a point; null when not loaded. */
  public drawnGroundKm: ((lat: number, lon: number) => number | null) | null = null;
  /** The elevation data (km) at a point. */
  public dataGroundKm: ((lat: number, lon: number) => number) | null = null;
  /** Make sure the elevation data for a box is loaded. */
  public prepareGround: ((south: number, west: number, north: number, east: number) => Promise<void>) | null = null;

  constructor() {
    this.group.name = 'procedural_city';
    this.material = new THREE.ShaderMaterial({
      uniforms: { uSunW: SUN_WORLD, uEarthC: this.earthCentre, uKmPerUnit: this.kmPerUnit, uCamAltKm: this.camAltKm, uHaze: this.haze, uNightAir: NIGHT_AIR, uMoonLight: MOON_LIGHT, uMoonDir: MOON_DIR },
      vertexShader,
      fragmentShader,
    });
    this.groundMaterial = new THREE.ShaderMaterial({
      uniforms: { uSunW: SUN_WORLD, uEarthC: this.earthCentre, uKmPerUnit: this.kmPerUnit, uCamAltKm: this.camAltKm, uHaze: this.haze, uNightAir: NIGHT_AIR, uMoonLight: MOON_LIGHT, uMoonDir: MOON_DIR },
      vertexShader: groundVertex,
      fragmentShader: groundFragment,
      // Over the terrain under it (a hand above it), never over a building; and only where there is
      // no Google tile (they mark their pixels with alpha 0, see PhotorealEarth): their photographs
      // carry the streets themselves
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.DstAlphaFactor,
      blendDst: THREE.OneMinusDstAlphaFactor,
      blendSrcAlpha: THREE.DstAlphaFactor,
      blendDstAlpha: THREE.OneMinusDstAlphaFactor,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
  }

  /** The pilot region a point is in, if any. */
  public static regionAt(lat: number, lon: number): PilotRegion | null {
    return PILOT_REGIONS.find((r) => lat >= r.south && lat <= r.north && lon >= r.west && lon <= r.east) ?? null;
  }

  /**
   * Per frame. Loads building cells around the camera when it is low over a pilot region, and drops
   * far ones. `surface`: Earth's surface mesh (the buildings hang under it, in its frame).
   */
  public update(surface: THREE.Object3D, cameraWorld: THREE.Vector3, lat: number, lon: number, altKm: number, kmPerUnit: number): void {
    if (this.group.parent !== surface) surface.add(this.group);
    const region = ProceduralCity.regionAt(lat, lon);
    const on = !!region && altKm < 6;
    this.group.visible = on;
    // Render coordinates: the camera is at the origin for the draw (floating origin)
    this.earthCentre.value.setFromMatrixPosition(surface.matrixWorld).sub(cameraWorld);
    this.kmPerUnit.value = kmPerUnit;
    this.camAltKm.value = Math.max(0, altKm);
    if (!on || !region) return;
    const now = performance.now();
    const ci = tileY(lat);
    const cj = tileX(lon);
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const key = `${ci + di}:${cj + dj}`;
        let cell = this.cells.get(key);
        if (!cell) {
          cell = { key, mesh: null, loading: false, lastUsed: now, offsetKm: 0 };
          this.cells.set(key, cell);
        }
        cell.lastUsed = now;
        // Set on the procedural terrain before the tiles' ground was measured: set again on it
        if (cell.mesh && this.groundOffsetKm !== null && Math.abs(cell.offsetKm - this.groundOffsetKm) > 0.004) {
          cell.mesh.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
          cell.mesh.removeFromParent();
          cell.mesh = null;
        }
        // Overpass asks for gentle use: one request at a time, a few seconds apart
        if (!cell.mesh && !cell.loading && now - this.lastFetch > this.backoffMs) {
          this.lastFetch = now;
          cell.loading = true;
          void this.loadCell(cell, cj + dj, ci + di, region);
        }
      }
    }
    for (const [key, cell] of this.cells) {
      if (now - cell.lastUsed > 60000) {
        cell.mesh?.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        cell.mesh?.removeFromParent();
        this.cells.delete(key);
      }
    }
  }

  private async loadCell(cell: Cell, tx: number, ty: number, region: PilotRegion): Promise<void> {
    const south = tileLat(ty + 1);
    const north = tileLat(ty);
    const west = tileLon(tx);
    const east = tileLon(tx + 1);
    try {
      if (!this.tileUrl) {
        const tj = await (await fetch(TILEJSON)).json();
        this.tileUrl = (tj.tiles?.[0] as string) ?? null;
        if (!this.tileUrl) throw new Error('no tiles');
      }
      const res = await fetch(this.tileUrl.replace('{z}', String(Z)).replace('{x}', String(tx)).replace('{y}', String(ty)));
      if (!res.ok) {
        this.backoffMs = Math.min(20000, this.backoffMs * 2);
        throw new Error(String(res.status));
      }
      this.backoffMs = 400;
      const vt = new VectorTile(new Pbf(new Uint8Array(await res.arrayBuffer())));
      const layer = vt.layers.building;
      const prints: Footprint[] = [];
      if (layer) {
        for (let i = 0; i < layer.length; i++) {
          if (i % 150 === 0) await this.pace();
          const f = layer.feature(i);
          if (f.type !== 3) continue;
          const gj = f.toGeoJSON(tx, ty, Z);
          const props = f.properties as Record<string, number | string | boolean>;
          const h = Number(props.render_height);
          const m = Number(props.render_min_height);
          const polys = gj.geometry.type === 'Polygon' ? [gj.geometry.coordinates] : gj.geometry.type === 'MultiPolygon' ? gj.geometry.coordinates : [];
          for (const poly of polys as number[][][][]) {
            const outer = poly[0];
            if (!outer || outer.length < 4) continue;
            prints.push({
              ring: outer.map(([lo, la]) => ({ lat: la, lon: lo })),
              holes: poly.slice(1).filter((r) => r.length >= 4).map((r) => r.map(([lo, la]) => ({ lat: la, lon: lo }))),
              colour: typeof props.colour === 'string' ? props.colour : undefined,
              heightM: Number.isFinite(h) && h > 0 ? h : 6 + hash(i + tx * 7 + ty * 13) * 9,
              minM: Number.isFinite(m) && m > 0 ? m : 0,
              id: i + tx * 100003 + ty * 7919,
            });
          }
        }
      }
      const centreLat = (south + north) / 2;
      const centreLon = (west + east) / 2;
      // Where the map has streets and built-up land but few or no outlines (most of India), the
      // town is made by rule: houses along the streets and across the residential land
      await this.generate(vt, tx, ty, south, west, north, east, prints);
      await this.prepareGround?.(south, west, north, east);
      // The offset between the elevation data and Google's drawn ground (the geoid: tens of metres).
      // Measured on the sharp tiles only: a coarse tile still standing in is a flat chord that sags
      // hundreds of metres below the ground, and buildings placed on it were buried. Until a
      // plausible value is measured the cell waits (it is asked again shortly).
      const drawn = this.drawnGroundKm?.(centreLat, centreLon) ?? null;
      const data = this.dataGroundKm?.(centreLat, centreLon) ?? 0;
      const off = drawn === null ? null : drawn - data;
      if (off !== null && off > -0.15 && off < 0.12) this.groundOffsetKm = off;
      // Or as measured under the jet (the tiles at a cell's centre are often not loaded)
      else if (this.groundOffsetKm === null && this.offsetHintKm !== null && Math.abs(this.offsetHintKm) < 0.15) this.groundOffsetKm = this.offsetHintKm;
      // No tiles' ground yet (they can take half a minute on a slow line): the buildings stand on
      // the procedural terrain meanwhile (its own offset), and are set again once it is measured
      const offsetKm = this.groundOffsetKm ?? this.fallbackOffsetKm;
      if (offsetKm === null || !Number.isFinite(offsetKm)) {
        this.lastFetch = performance.now() - this.backoffMs + 1500;
        return;
      }
      cell.offsetKm = offsetKm;
      // One cell built at a time, a few milliseconds a frame (built in one go, nine cells of a
      // city froze the page for a second)
      const turn = this.building.then(async () => {
        const mesh = await this.build(prints, region, offsetKm);
        const ground = mesh ? await this.buildGround(vt, tx, ty, offsetKm) : null;
        return { mesh, ground };
      });
      this.building = turn.then(() => undefined, () => undefined);
      const made = await turn;
      cell.mesh = made.mesh;
      if (cell.mesh) {
        // The streets, parks and water go with it (children of the buildings' mesh, one unit)
        const ground = made.ground;
        if (ground) {
          ground.position.sub(cell.mesh.position);
          cell.mesh.add(ground);
        }
        this.group.add(cell.mesh);
      }
    } catch {
      // Network error: left empty, asked again later (with a growing wait)
    } finally {
      cell.loading = false;
    }
  }

  /**
   * Buildings by rule for one map tile, added to `prints`: on a 24 m grid, a house wherever the
   * land is built-up (the map's residential, commercial, retail or industrial land, or a dense web
   * of streets), set back from the streets, turned to face the nearest one, never on a mapped
   * building. Sizes and heights by the kind of land (homes 1-4 storeys, commercial up to ~10,
   * sheds wide and low), the same every time for the same place.
   */
  private async generate(vt: VectorTile, tx: number, ty: number, south: number, west: number, north: number, east: number, prints: Footprint[]): Promise<void> {
    const mPerLat = 111320;
    const mPerLon = 111320 * Math.cos((((south + north) / 2) * Math.PI) / 180);
    const W = (east - west) * mPerLon;
    const H = (north - south) * mPerLat;
    const toM = (lo: number, la: number): [number, number] => [(lo - west) * mPerLon, (la - south) * mPerLat];
    // Streets as segments in metres, in 100 m buckets
    const B = 100;
    const nx = Math.ceil(W / B) + 1;
    const ny = Math.ceil(H / B) + 1;
    const roadB: number[][][] = Array.from({ length: nx * ny }, () => []);
    const bucket = (x: number, y: number): number => Math.min(ny - 1, Math.max(0, Math.floor(y / B))) * nx + Math.min(nx - 1, Math.max(0, Math.floor(x / B)));
    const roads = vt.layers.transportation;
    if (roads) {
      for (let i = 0; i < roads.length; i++) {
        const f = roads.feature(i);
        if (f.type !== 2) continue;
        const cls = String((f.properties as Record<string, unknown>).class ?? '');
        if (cls === 'rail' || cls === 'transit' || cls === 'ferry' || cls === 'path' || cls === 'aerialway') continue;
        const half = cls === 'motorway' || cls === 'trunk' ? 14 : cls === 'primary' || cls === 'secondary' ? 10 : 6;
        const gj = f.toGeoJSON(tx, ty, Z);
        const lines = gj.geometry.type === 'LineString' ? [gj.geometry.coordinates] : gj.geometry.type === 'MultiLineString' ? gj.geometry.coordinates : [];
        for (const line of lines as number[][][]) {
          for (let k = 0; k + 1 < line.length; k++) {
            const [ax, ay] = toM(line[k][0], line[k][1]);
            const [bx, by] = toM(line[k + 1][0], line[k + 1][1]);
            const seg = [ax, ay, bx, by, half];
            const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / (B * 0.5)));
            let last = -1;
            for (let q = 0; q <= steps; q++) {
              const bi = bucket(ax + ((bx - ax) * q) / steps, ay + ((by - ay) * q) / steps);
              if (bi !== last) roadB[bi].push(seg);
              last = bi;
            }
          }
        }
      }
    }
    // Built-up land as polygons in metres
    const zones: Array<{ ring: Array<[number, number]>; kind: number; x0: number; y0: number; x1: number; y1: number }> = [];
    const land = vt.layers.landuse;
    if (land) {
      for (let i = 0; i < land.length; i++) {
        const f = land.feature(i);
        if (f.type !== 3) continue;
        const cls = String((f.properties as Record<string, unknown>).class ?? '');
        const kind = cls === 'residential' || cls === 'suburb' || cls === 'neighbourhood' ? 1 : cls === 'commercial' || cls === 'retail' ? 2 : cls === 'industrial' ? 3 : 0;
        if (!kind) continue;
        const gj = f.toGeoJSON(tx, ty, Z);
        const polys = gj.geometry.type === 'Polygon' ? [gj.geometry.coordinates] : gj.geometry.type === 'MultiPolygon' ? gj.geometry.coordinates : [];
        for (const poly of polys as number[][][][]) {
          const ring = (poly[0] ?? []).map(([lo, la]) => toM(lo, la));
          if (ring.length < 4) continue;
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          for (const [x, y] of ring) {
            x0 = Math.min(x0, x);
            y0 = Math.min(y0, y);
            x1 = Math.max(x1, x);
            y1 = Math.max(y1, y);
          }
          zones.push({ ring, kind, x0, y0, x1, y1 });
        }
      }
    }
    const inside = (ring: Array<[number, number]>, x: number, y: number): boolean => {
      let c = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    // Mapped buildings: no generated one near them
    const taken = new Set<number>();
    const cellOf = (x: number, y: number): number => Math.floor(y / GEN_PITCH_M) * 4096 + Math.floor(x / GEN_PITCH_M);
    for (const p of prints) {
      for (const v of p.ring) {
        const [x, y] = toM(v.lon, v.lat);
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) taken.add(cellOf(x + dx * GEN_PITCH_M * 0.5, y + dy * GEN_PITCH_M * 0.5));
      }
    }
    let made = 0;
    for (let gy = 0; gy * GEN_PITCH_M < H && made < GEN_MAX; gy++) {
      await this.pace();
      for (let gx = 0; gx * GEN_PITCH_M < W && made < GEN_MAX; gx++) {
        const id = (tx * 4096 + gx) * 31 + (ty * 4096 + gy) * 17;
        const x = (gx + 0.5 + (hash(id + 0.1) - 0.5) * 0.35) * GEN_PITCH_M;
        const y = (gy + 0.5 + (hash(id + 0.2) - 0.5) * 0.35) * GEN_PITCH_M;
        if (taken.has(cellOf(x, y))) continue;
        // The nearest street, and how many are about
        let near = Infinity;
        let dirX = 1;
        let dirY = 0;
        let clear = true;
        let count = 0;
        const bx0 = Math.floor(x / B);
        const by0 = Math.floor(y / B);
        for (let oy = -1; oy <= 1 && clear; oy++) {
          for (let ox = -1; ox <= 1 && clear; ox++) {
            const cx = bx0 + ox;
            const cy = by0 + oy;
            if (cx < 0 || cy < 0 || cx >= nx || cy >= ny) continue;
            for (const sgm of roadB[cy * nx + cx]) {
              const vx = sgm[2] - sgm[0];
              const vy = sgm[3] - sgm[1];
              const L2 = vx * vx + vy * vy || 1;
              const t = Math.max(0, Math.min(1, ((x - sgm[0]) * vx + (y - sgm[1]) * vy) / L2));
              const d = Math.hypot(x - (sgm[0] + vx * t), y - (sgm[1] + vy * t));
              if (d < sgm[4] + 8) {
                clear = false;
                break;
              }
              if (d < 90) count++;
              if (d < near) {
                near = d;
                const L = Math.sqrt(L2);
                dirX = vx / L;
                dirY = vy / L;
              }
            }
          }
        }
        if (!clear) continue;
        let kind = 0;
        for (const z of zones) {
          if (x < z.x0 || x > z.x1 || y < z.y0 || y > z.y1) continue;
          if (inside(z.ring, x, y)) {
            kind = z.kind;
            break;
          }
        }
        // No built-up land mapped: a dense web of streets is a town all the same
        if (!kind && count >= 5 && near < 45) kind = 1;
        if (!kind || near > 70) continue;
        if (hash(id + 0.3) > (kind === 3 ? 0.55 : 0.86)) continue;
        const w = kind === 3 ? 26 + hash(id + 0.4) * 18 : 9 + hash(id + 0.4) * 8;
        const dp = kind === 3 ? 18 + hash(id + 0.5) * 14 : 8 + hash(id + 0.5) * 7;
        const r = hash(id + 0.6);
        const storeys = kind === 1 ? 1 + Math.floor(r * r * 4.2) : kind === 2 ? 2 + Math.floor(r * r * 9) : 1 + Math.floor(r * 1.4);
        const heightM = storeys * 3.2 + (kind === 3 ? 3 : 0.6);
        const hw = Math.min(w, GEN_PITCH_M * 0.9) / 2;
        const hd = Math.min(dp, GEN_PITCH_M * 0.9) / 2;
        const corners: Array<[number, number]> = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd], [-hw, -hd]];
        prints.push({
          ring: corners.map(([u, v]) => ({ lon: west + (x + u * dirX - v * dirY) / mPerLon, lat: south + (y + u * dirY + v * dirX) / mPerLat })),
          heightM,
          minM: 0,
          id: id + 5,
        });
        made++;
      }
    }
  }

  /**
   * The ground of the town from the map, laid over the procedural terrain: every street as a strip
   * of asphalt at its real width (lane lines and a dashed centre line on the larger ones), the
   * parks and gardens as grass, the ponds and rivers as water. Draped on the height data, a hand
   * above it. Before Google's photographs arrive (or where they never do) this is the town's floor.
   */
  private async buildGround(vt: VectorTile, tx: number, ty: number, offsetKm: number): Promise<THREE.Mesh | null> {
    const pos: number[] = [];
    const uv: number[] = [];
    const kind: number[] = [];
    const lift = 0.0006;
    const at = (lo: number, la: number): THREE.Vector3 => {
      const [x, y, z] = bodyLatLonToLocal('Earth', la, lo);
      const r = 1 + ((this.dataGroundKm?.(la, lo) ?? 0) + offsetKm + lift) / R_KM;
      return new THREE.Vector3(x * r, y * r, z * r);
    };
    const push = (p: THREE.Vector3, u: number, v: number, k: number): void => {
      pos.push(p.x, p.y, p.z);
      uv.push(u, v);
      kind.push(k);
    };
    // Areas: parks, grass and woods (green), water (blue)
    const area = (layerName: string, pick: (cls: string) => number): void => {
      const layer = vt.layers[layerName];
      if (!layer) return;
      for (let i = 0; i < layer.length; i++) {
        const f = layer.feature(i);
        if (f.type !== 3) continue;
        const props = f.properties as Record<string, unknown>;
        const k = pick(String(props.class ?? props.subclass ?? ''));
        if (k < 0) continue;
        const gj = f.toGeoJSON(tx, ty, Z);
        const polys = gj.geometry.type === 'Polygon' ? [gj.geometry.coordinates] : gj.geometry.type === 'MultiPolygon' ? gj.geometry.coordinates : [];
        for (const poly of polys as number[][][][]) {
          const outer = poly[0];
          if (!outer || outer.length < 4) continue;
          const lo0 = outer[0][0], la0 = outer[0][1];
          const mx = 111320 * Math.cos((la0 * Math.PI) / 180);
          const toV = (r: number[][]): THREE.Vector2[] => r.slice(0, -1).map(([lo, la]) => new THREE.Vector2((lo - lo0) * mx, (la - la0) * 111320));
          const ring = toV(outer);
          const holes = poly.slice(1).filter((r) => r.length >= 4).map(toV);
          if (ring.length < 3) continue;
          const all = [ring, ...holes].flat();
          let tris: number[][];
          try {
            tris = THREE.ShapeUtils.triangulateShape(ring, holes);
          } catch {
            continue;
          }
          for (const t of tris) {
            for (const idx of t) {
              const v = all[idx];
              push(at(lo0 + v.x / mx, la0 + v.y / 111320), v.x, v.y, k);
            }
          }
        }
      }
    };
    area('park', () => 1);
    area('landcover', (c) => (c === 'grass' || c === 'wood' || c === 'farmland' ? 1 : -1));
    area('landuse', (c) => (c === 'cemetery' || c === 'pitch' || c === 'playground' || c === 'garden' ? 1 : -1));
    area('water', () => 2);
    // Streets: strips at their class's width; u runs along (metres), v across (-1..1)
    const roads = vt.layers.transportation;
    if (roads) {
      for (let i = 0; i < roads.length; i++) {
        if (i % 40 === 0) await this.pace();
        const f = roads.feature(i);
        if (f.type !== 2) continue;
        const props = f.properties as Record<string, unknown>;
        const cls = String(props.class ?? '');
        if (cls === 'rail' || cls === 'transit' || cls === 'ferry' || cls === 'aerialway' || props.brunnel === 'tunnel') continue;
        const half = cls === 'motorway' ? 12 : cls === 'trunk' ? 10 : cls === 'primary' ? 8 : cls === 'secondary' ? 6.5 : cls === 'tertiary' ? 5 : cls === 'path' || cls === 'track' ? 1.5 : 3.5;
        // 3: plain lane; 4: with centre and lane lines (the larger roads)
        const k = cls === 'motorway' || cls === 'trunk' || cls === 'primary' || cls === 'secondary' ? 4 : cls === 'path' || cls === 'track' ? 5 : 3;
        const gj = f.toGeoJSON(tx, ty, Z);
        const lines = gj.geometry.type === 'LineString' ? [gj.geometry.coordinates] : gj.geometry.type === 'MultiLineString' ? gj.geometry.coordinates : [];
        for (const line of lines as number[][][]) {
          let along = 0;
          for (let s = 0; s + 1 < line.length; s++) {
            const [ao, aa] = line[s];
            const [bo, ba] = line[s + 1];
            const mx = 111320 * Math.cos((aa * Math.PI) / 180);
            const dx = (bo - ao) * mx;
            const dy = (ba - aa) * 111320;
            const len = Math.hypot(dx, dy);
            if (len < 0.3) continue;
            // Across, in degrees
            const nx = (-dy / len) * half / mx;
            const ny = (dx / len) * half / 111320;
            const a0 = at(ao + nx, aa + ny), a1 = at(ao - nx, aa - ny);
            const b0 = at(bo + nx, ba + ny), b1 = at(bo - nx, ba - ny);
            push(a0, along, 1, k); push(a1, along, -1, k); push(b1, along + len, -1, k);
            push(a0, along, 1, k); push(b1, along + len, -1, k); push(b0, along + len, 1, k);
            along += len;
          }
        }
      }
    }
    if (pos.length === 0) return null;
    const ox = pos[0], oy = pos[1], oz = pos[2];
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] -= ox;
      pos[i + 1] -= oy;
      pos[i + 2] -= oz;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aUv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('aKind', new THREE.Float32BufferAttribute(kind, 1));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, this.groundMaterial);
    mesh.position.set(ox, oy, oz);
    mesh.name = 'procedural_streets';
    mesh.renderOrder = 1.2;
    return mesh;
  }

  private async build(prints: Footprint[], region: PilotRegion, offsetKm: number): Promise<THREE.Mesh | null> {
    const pos: number[] = [];
    const nor: number[] = [];
    const col: number[] = [];
    const fac: number[] = [];
    const seed: number[] = [];
    const palette = region.palette.map((c) => new THREE.Color(c).convertSRGBToLinear());
    const offset = offsetKm;
    const local = (lat: number, lon: number, hKm: number): THREE.Vector3 => {
      const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
      const r = 1 + hKm / R_KM;
      return new THREE.Vector3(x * r, y * r, z * r);
    };
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    for (const w of prints) {
      await this.pace();
      const g = w.ring;
      const heightM = w.heightM;
      const lat0 = g[0].lat;
      const lon0 = g[0].lon;
      const ground = (this.dataGroundKm?.(lat0, lon0) ?? 0) + offset + w.minM / 1000;
      const top = ground - w.minM / 1000 + heightM / 1000;
      // The building's own colour where the map gives one (building:colour), else the region's
      let c = palette[Math.floor(hash(w.id * 3.1) * palette.length)];
      const named = readColour(w.colour);
      if (named) c = named;
      const s = hash(w.id * 7.7);
      // Outline in metres around the first node (for the roof's triangulation and the facade grid)
      const mPerLat = 111320;
      const mPerLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
      const toM = (p: { lat: number; lon: number }): THREE.Vector2 => new THREE.Vector2((p.lon - lon0) * mPerLon, (p.lat - lat0) * mPerLat);
      const ring = g.slice(0, -1).map(toM);
      if (ring.length < 3) continue;
      if (THREE.ShapeUtils.isClockWise(ring)) ring.reverse();
      // Courtyards and the open middles of stadiums (the map's inner rings), wound the other way
      const holes = (w.holes ?? [])
        .map((h) => h.slice(0, -1).map(toM))
        .filter((h) => h.length >= 3)
        .map((h) => (THREE.ShapeUtils.isClockWise(h) ? h : h.reverse()));
      const toLL = (v: THREE.Vector2): { lat: number; lon: number } => ({ lat: lat0 + v.y / mPerLat, lon: lon0 + v.x / mPerLon });
      // Walls, the outer ones facing out, the courtyards' facing in
      const wall = (loop: THREE.Vector2[], baseKm: number, topKm: number, colour: THREE.Color, facadeH: number): void => {
        const pts = loop.map(toLL);
        let along = 0;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % pts.length];
          const lenM = loop[i].distanceTo(loop[(i + 1) % loop.length]);
          const a0 = local(a.lat, a.lon, baseKm);
          const b0 = local(b.lat, b.lon, baseKm);
          const a1 = local(a.lat, a.lon, topKm);
          const b1 = local(b.lat, b.lon, topKm);
          const n = tmpA.subVectors(b0, a0).cross(tmpB.subVectors(a1, a0)).normalize().negate();
          const quad = [a0, b0, b1, a0, b1, a1];
          const fu = [along, along + lenM, along + lenM, along, along + lenM, along];
          const fv = [0, 0, facadeH, 0, facadeH, facadeH];
          for (let k = 0; k < 6; k++) {
            pos.push(quad[k].x, quad[k].y, quad[k].z);
            nor.push(n.x, n.y, n.z);
            col.push(colour.r, colour.g, colour.b);
            fac.push(fu[k], fv[k]);
            seed.push(s);
          }
          along += lenM;
        }
      };
      wall(ring, ground - 0.004, top, c, heightM);
      for (const h of holes) wall(h, ground - 0.004, top, c, heightM);
      // Flat roof (with the courtyards cut out)
      const flat = [ring, ...holes].flat();
      const tris = THREE.ShapeUtils.triangulateShape(ring, holes);
      const upN = local(lat0, lon0, top).normalize();
      let best = 0;
      let bestC: THREE.Vector2 | null = null;
      for (const t of tris) {
        const [p0, p1, p2] = t.map((i) => flat[i]);
        const area = Math.abs((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y)) / 2;
        if (area > best) {
          best = area;
          bestC = new THREE.Vector2((p0.x + p1.x + p2.x) / 3, (p0.y + p1.y + p2.y) / 3);
        }
        for (const v of [p0, p1, p2]) {
          const ll = toLL(v);
          const p = local(ll.lat, ll.lon, top);
          pos.push(p.x, p.y, p.z);
          nor.push(upN.x, upN.y, upN.z);
          col.push(c.r * 0.9, c.g * 0.9, c.b * 0.9);
          fac.push(0, -1);
          seed.push(s);
        }
      }
      // What stands on Indian flat roofs: a black water tank, and the stair head (a small room
      // over the stairwell), on most homes; none on tall towers or wide sheds
      if (bestC && heightM < 40 && best > 25) {
        const box = (cx: number, cy: number, wM: number, dM: number, hM: number, colour: THREE.Color): void => {
          const ang = Math.atan2(ring[1].y - ring[0].y, ring[1].x - ring[0].x);
          const ca = Math.cos(ang), sa = Math.sin(ang);
          const corner = (u: number, v: number): THREE.Vector2 => new THREE.Vector2(cx + u * ca - v * sa, cy + u * sa + v * ca);
          const loop = [corner(-wM / 2, -dM / 2), corner(wM / 2, -dM / 2), corner(wM / 2, dM / 2), corner(-wM / 2, dM / 2)];
          wall(loop, top - 0.0002, top + hM / 1000, colour, -1);
          const lid = [0, 1, 2, 0, 2, 3].map((i) => {
            const ll = toLL(loop[i]);
            return local(ll.lat, ll.lon, top + hM / 1000);
          });
          for (const p of lid) {
            pos.push(p.x, p.y, p.z);
            nor.push(upN.x, upN.y, upN.z);
            col.push(colour.r * 0.9, colour.g * 0.9, colour.b * 0.9);
            fac.push(0, -1);
            seed.push(s);
          }
        };
        if (hash(w.id * 5.3) < 0.75) box(bestC.x, bestC.y, 2.4 + hash(w.id) * 0.8, 2.6, 2.5, c);
        if (hash(w.id * 9.1) < 0.6) {
          const r = Math.sqrt(best) * 0.25;
          box(bestC.x + r, bestC.y - r * 0.5, 1.5, 1.5, 1.3, TANK);
        }
      }
    }
    if (pos.length === 0) return null;
    // Relative to the cell's first vertex: positions near 1.0 (Earth radii) in float32 would be
    // ~0.4 m apart and the walls would shimmer
    const ox = pos[0], oy = pos[1], oz = pos[2];
    for (let i = 0; i < pos.length; i += 3) {
      pos[i] -= ox;
      pos[i + 1] -= oy;
      pos[i + 2] -= oz;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('aFacade', new THREE.Float32BufferAttribute(fac, 2));
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.position.set(ox, oy, oz);
    mesh.name = 'procedural_buildings';
    mesh.renderOrder = 1.25;
    return mesh;
  }

  public dispose(): void {
    for (const c of this.cells.values()) c.mesh?.geometry.dispose();
    this.cells.clear();
    this.group.removeFromParent();
    this.material.dispose();
    this.groundMaterial.dispose();
  }
}
