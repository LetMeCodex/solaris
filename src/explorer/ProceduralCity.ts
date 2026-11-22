import * as THREE from 'three';
import Pbf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile';
import { bodyLatLonToLocal } from './TileMath';
import { SUN_WORLD } from '../rendering/RenderOrigin';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from '../rendering/AerialPerspective';
import { PhotorealEarth } from '../rendering/PhotorealEarth';

/**
 * Procedural 3D cities & iconic architectural landmarks:
 * 1. Instant hero skylines & recognizable 3D monuments (Golden Gate Bridge + SF downtown,
 *    Manhattan skyline + Empire State / One WTC / Chrysler / Brooklyn Bridge, Paris Eiffel Tower
 *    + Arc de Triomphe + La Défense + Haussmann blocks, plus London, Tokyo, Dubai, Chicago,
 *    Sydney, and Giza) — zero network latency, snapped to real terrain elevation.
 * 2. Real OpenStreetMap 3D building footprints streamed from OpenFreeMap vector tiles
 *    (OpenMapTiles schema: `building` layer with `render_height`), with modern glass curtain-wall
 *    and regional masonry/plaster shaders lit by the real Sun, Moon, and nighttime windows.
 *
 * When Google Photorealistic 3D Tiles are actively showing, regions covered by Google's 3D
 * photogrammetry step aside automatically so buildings never double-render; regions without
 * Google 3D (e.g. India, Dubai, Giza) remain active, and when Google 3D Tiles are absent, ALL
 * major cities and landmarks render cleanly on top of the terrain at exact DEM elevation.
 */

export interface PilotRegion {
  name: string;
  south: number;
  west: number;
  north: number;
  east: number;
  /** Facade colours (sRGB hex) common in the region. */
  palette: string[];
  /** Architectural facade bias for tall/mid-rise buildings. */
  style?: 'plaster' | 'modern' | 'haussmann' | 'stone';
  /** Skip when Google Photorealistic 3D Tiles are actively rendering (avoid double buildings). */
  photorealFallbackOnly?: boolean;
  /** Whether to draw synthetic OSM street/park ground overlay (only when high-res satellite tiles are absent). */
  drawGroundOverlay?: boolean;
}

export const PILOT_REGIONS: PilotRegion[] = [
  {
    name: 'New York',
    south: 40.67, west: -74.05, north: 40.84, east: -73.90,
    palette: ['#8da0b4', '#9aa9b8', '#b8b2a6', '#7b8fa3', '#c8bfb0', '#6d7f92', '#d2c8b8', '#a39d94', '#74889c', '#b0bac4'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'San Francisco',
    south: 37.70, west: -122.53, north: 37.86, east: -122.36,
    palette: ['#dce0e4', '#c9d2da', '#d8cdb8', '#9eb1c2', '#e4dcd0', '#b8c4ce', '#c9b59d', '#8ea2b5', '#e6e1d8', '#a6b4c0'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'Paris',
    south: 48.81, west: 2.21, north: 48.91, east: 2.42,
    palette: ['#e5dbc8', '#ddd1bc', '#ebe2d1', '#d4c6ae', '#e2d8c5', '#cfc1a9', '#e8dfd0', '#d8ccb7'],
    style: 'haussmann',
    photorealFallbackOnly: true,
  },
  {
    name: 'London',
    south: 51.48, west: -0.16, north: 51.54, east: 0.02,
    palette: ['#c8beb0', '#96a8b8', '#b9ab99', '#d6cec2', '#7e93a6', '#a8907c', '#cfd6dc'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'Tokyo',
    south: 35.62, west: 139.67, north: 35.72, east: 139.80,
    palette: ['#cfd5dc', '#9cb0c2', '#e0e3e6', '#889db0', '#c2c8ce', '#b4bfc9', '#d8dce0'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'Chicago',
    south: 41.85, west: -87.67, north: 41.92, east: -87.60,
    palette: ['#7f92a4', '#9aa8b4', '#b4aea4', '#63717e', '#c6beb2', '#8999a8'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'Sydney',
    south: -33.89, west: 151.18, north: -33.83, east: 151.24,
    palette: ['#dce1e6', '#c6d0d8', '#d8cfc0', '#9ab0c4', '#e4e0d8', '#b4c0ca'],
    style: 'modern',
    photorealFallbackOnly: true,
  },
  {
    name: 'Dubai',
    south: 25.16, west: 55.23, north: 25.24, east: 55.32,
    palette: ['#c8d4de', '#e0dad0', '#9eb4c8', '#d4cdc0', '#b4c6d6', '#e6e2da'],
    style: 'modern',
    photorealFallbackOnly: false,
  },
  {
    name: 'Giza',
    south: 29.95, west: 31.10, north: 30.01, east: 31.17,
    palette: ['#d8c4a0', '#ccb68e', '#e2d0b0', '#bfa780', '#d0ba96'],
    style: 'stone',
    photorealFallbackOnly: false,
  },
  {
    name: 'India',
    south: 6.5, west: 68.0, north: 37.1, east: 97.5,
    palette: ['#e8d7b6', '#d9b98c', '#e6c79a', '#c99b74', '#efe3cc', '#d8a7a1', '#cfc2a8', '#dfe3e0', '#bfd0d6', '#e9e2d0', '#c9b79c', '#f1ead9'],
    style: 'plaster',
    photorealFallbackOnly: false,
    drawGroundOverlay: true,
  },
];

/** Exclusion zones around bespoke hero landmarks so OSM polygons never Z-fight with them. */
const HERO_EXCLUSIONS: ReadonlyArray<{ lat: number; lon: number; radiusM: number }> = [
  { lat: 37.8199, lon: -122.4783, radiusM: 1450 }, // Golden Gate Bridge corridor
  { lat: 37.7897, lon: -122.3970, radiusM: 65 },   // Salesforce Tower
  { lat: 37.7952, lon: -122.4028, radiusM: 65 },   // Transamerica Pyramid
  { lat: 40.7127, lon: -74.0134, radiusM: 80 },    // One WTC
  { lat: 40.7484, lon: -73.9857, radiusM: 85 },    // Empire State Building
  { lat: 40.7516, lon: -73.9755, radiusM: 65 },    // Chrysler Building
  { lat: 40.7530, lon: -73.9785, radiusM: 60 },    // One Vanderbilt
  { lat: 40.7663, lon: -73.9808, radiusM: 55 },    // Central Park Tower
  { lat: 40.7616, lon: -73.9718, radiusM: 50 },    // 432 Park Ave
  { lat: 40.7537, lon: -74.0005, radiusM: 70 },    // 30 Hudson Yards
  { lat: 48.8584, lon: 2.2945, radiusM: 140 },     // Eiffel Tower
  { lat: 48.8738, lon: 2.2950, radiusM: 65 },      // Arc de Triomphe
  { lat: 48.8421, lon: 2.3219, radiusM: 65 },      // Tour Montparnasse
  { lat: 51.5055, lon: -0.0754, radiusM: 180 },    // Tower Bridge
  { lat: 51.5045, lon: -0.0865, radiusM: 70 },     // The Shard
  { lat: 35.6586, lon: 139.7454, radiusM: 95 },    // Tokyo Tower
  { lat: 25.1972, lon: 55.2744, radiusM: 130 },    // Burj Khalifa
  { lat: 41.8789, lon: -87.6359, radiusM: 80 },    // Willis Tower
  { lat: -33.8568, lon: 151.2153, radiusM: 130 },  // Sydney Opera House
  { lat: 29.9792, lon: 31.1342, radiusM: 150 },    // Great Pyramid
  { lat: 29.9759, lon: 31.1308, radiusM: 140 },    // Pyramid of Khafre
  { lat: 29.9725, lon: 31.1283, radiusM: 80 },     // Pyramid of Menkaure
];

const GEN_PITCH_M = 24;
const GEN_MAX = 4500;
const DEG = Math.PI / 180;
/** Earth mean radius matching SurfaceTileLayer (km) when PhotorealEarth is inactive; WGS84 when active. */
const R_KM_TILE = 6371.0;
const R_KM_WGS84 = 6378.137;

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

function srgb(hex: string): THREE.Color {
  return new THREE.Color(hex).convertSRGBToLinear();
}

const GLOBAL_REGION: PilotRegion = {
  name: 'Global',
  south: -85, west: -180, north: 85, east: 180,
  palette: ['#d4d7dc', '#c6ccd2', '#dfd8cc', '#b8c0c8', '#e2dfd8', '#a6b0bc'],
  style: 'modern',
  photorealFallbackOnly: true,
};

const TANK = new THREE.Color(0.035, 0.035, 0.04);
const Z = 14;
const TILEJSON = 'https://tiles.openfreemap.org/planet';
const MAX_CONCURRENT_CELLS = 4;

interface Cell {
  key: string;
  mesh: THREE.Mesh | null;
  loading: boolean;
  lastUsed: number;
  offsetKm: number;
}

interface HeroCityInstance {
  regionName: string;
  mesh: THREE.Mesh;
  anchorLat: number;
  anchorLon: number;
  builtElevKm: number;
  builtOffsetKm: number;
  builtRadiusKm: number;
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function approxDistM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dy = (lat2 - lat1) * 111320;
  const dx = (lon2 - lon1) * 111320 * Math.cos(((lat1 + lat2) * 0.5) * DEG);
  return Math.hypot(dx, dy);
}

function inHeroExclusion(lat: number, lon: number): boolean {
  for (let i = 0; i < HERO_EXCLUSIONS.length; i++) {
    const ex = HERO_EXCLUSIONS[i];
    if (Math.abs(lat - ex.lat) > 0.02 || Math.abs(lon - ex.lon) > 0.025) continue;
    if (approxDistM(lat, lon, ex.lat, ex.lon) < ex.radiusM) return true;
  }
  return false;
}

function pointInPoly(x: number, y: number, poly: ReadonlyArray<readonly [number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Facade encoding in aFacade.y:
 *  - >= 10000: modern curtain-wall glass skyscraper (true heightM = aFacade.y - 10000)
 *  - > 0 && < 10000: classic plaster / limestone / Haussmann masonry wall (true heightM = aFacade.y)
 *  - (-1.5 .. 0]: flat roof (concrete/zinc)
 *  - (-2.5 .. -1.5]: architectural monument material (painted steel, iron, stone, road deck — no apartment windows)
 *  - <= -2.5: emissive night landmark accent / aviation beacon / lit crown
 */
const FACADE_GLASS_OFFSET = 10000;
const FACADE_ROOF = -1;
const FACADE_MONUMENT = -2;
const FACADE_EMISSIVE = -3;

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
  vec3 nRaw = mat3(modelMatrix) * normal;
  vNormalW = dot(nRaw, nRaw) > 1e-10 ? normalize(nRaw) : vec3(0.0, 1.0, 0.0);
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
  vec3 upRaw = vWorld - uEarthC;
  vec3 up = dot(upRaw, upRaw) > 1e-10 ? normalize(upRaw) : vec3(0.0, 1.0, 0.0);
  vec3 sunRaw = uSunW - uEarthC;
  vec3 sun = dot(sunRaw, sunRaw) > 1e-10 ? normalize(sunRaw) : vec3(1.0, 0.0, 0.0);
  float sunUp = dot(up, sun);
  float day = smoothstep(-0.10, 0.12, sunUp);
  vec3 n = dot(vNormalW, vNormalW) > 1e-10 ? normalize(vNormalW) : up;
  float wall = 1.0 - abs(dot(n, up));
  vec3 vRaw = cameraPosition - vWorld;
  vec3 V = dot(vRaw, vRaw) > 1e-10 ? normalize(vRaw) : up;

  float glow = 0.0;
  float gloss = 0.0;
  vec3 base = vColor;
  vec3 nightAccent = vec3(0.0);

  if (vFacade.y <= -2.5) {
    // Emissive landmark accent / aviation beacon / bridge lighting
    base = vColor;
    gloss = 0.25;
    nightAccent = vColor * (1.8 + 1.2 * (1.0 - day));
  } else if (vFacade.y <= -1.5) {
    // Architectural monument surface (Golden Gate steel, Eiffel iron, marble, bridge asphalt)
    float grain = vn(vec2(vFacade.x * 0.45 + vSeed * 23.0, vSeed * 19.0));
    base = vColor * (0.90 + 0.16 * grain);
    gloss = 0.18 + 0.12 * vSeed;
  } else if (wall > 0.45 && vFacade.y >= 9999.0) {
    // Modern glass & steel skyscraper curtain-wall facade
    float fy = vFacade.y - 10000.0;
    vec2 cell = vec2(vFacade.x / 2.8, fy / 3.8);
    vec2 f = fract(cell);
    float px = max(fwidth(cell.x), fwidth(cell.y));
    float show = 1.0 - smoothstep(0.25, 0.85, px);
    float spandrel = smoothstep(0.18, 0.10, f.y) * show;
    float mullion = (smoothstep(0.09, 0.03, f.x) + smoothstep(0.91, 0.97, f.x)) * show;
    float pane = clamp(1.0 - spandrel - mullion * 0.85, 0.0, 1.0) * step(2.2, fy);
    float rFloor = h(vec2(floor(cell.y) * 1.3 + vSeed * 41.0, vSeed * 17.0));
    float rOffice = h(floor(cell) + vSeed * 53.0);
    vec3 glassCol = mix(vColor * vec3(0.45, 0.56, 0.68), vColor * vec3(0.75, 0.86, 0.96), rOffice);
    vec3 frameCol = vColor * 0.58;
    base = mix(frameCol, glassCol, mix(0.65, pane, show));
    // Subtle vertical shading near ground lobby & mechanical floors
    base *= mix(0.76, 1.02, smoothstep(0.0, 10.0, fy));
    gloss = mix(0.45, 0.92, pane) * (0.55 + 0.45 * show);
    float floorLit = step(0.42, rFloor) * step(0.32, rOffice);
    glow = pane * floorLit * (0.55 + 0.45 * h(floor(cell) + 9.1));
  } else if (wall > 0.45 && vFacade.y > 0.0) {
    // Masonry / limestone / Haussmann / regional plaster wall
    float lumC = dot(vColor, vec3(0.2126, 0.7152, 0.0722));
    base = mix(vec3(lumC), vColor, 0.52 + 0.3 * vSeed) * (0.68 + 0.2 * fract(vSeed * 7.3));
    vec2 cell = vec2(vFacade.x / 3.0, vFacade.y / 3.2);
    vec2 f = fract(cell);
    float px = max(fwidth(cell.x), fwidth(cell.y));
    float show = 1.0 - smoothstep(0.25, 0.7, px);
    float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.30, f.y) * step(f.y, 0.82) * step(0.6, vFacade.y);
    float r = h(floor(cell) + vSeed * 31.0);
    vec3 glass = mix(vec3(0.07, 0.10, 0.14), vec3(0.22, 0.28, 0.34), r);
    base = mix(base, mix(base * 0.78, glass, show), win * 0.9);
    gloss = win * show * 0.85;
    float slab = smoothstep(0.06, 0.0, f.y) * show;
    base *= 1.0 - 0.20 * slab;
    float streak = vn(vec2(vFacade.x * 0.9 + vSeed * 40.0, vFacade.y * 0.08));
    base *= 0.86 + 0.20 * streak;
    base *= mix(0.74, 1.0, smoothstep(0.0, 3.4, vFacade.y));
    glow = win * step(0.52, r) * (0.5 + 0.5 * h(floor(cell) + 3.7));
  } else {
    // Roofs (concrete, gravel, zinc)
    float st = h(vec2(vSeed * 91.0, vSeed * 17.0));
    base = mix(vec3(0.34, 0.35, 0.37), vColor, 0.32) * (0.82 + 0.26 * st);
  }

  float lamb = max(dot(n, sun), 0.0);
  vec3 sunCol = mix(vec3(1.0, 0.7, 0.5), vec3(1.0, 0.97, 0.92), smoothstep(0.02, 0.3, sunUp));
  vec3 amb = vec3(0.22, 0.26, 0.36) * (0.55 + 0.45 * max(dot(n, up), 0.0)) + vec3(0.11, 0.10, 0.085) * wall;
  vec3 night = vec3(0.085, 0.1, 0.155) + uMoonLight * smoothstep(-0.04, 0.2, dot(up, uMoonDir));
  vec3 col = base * ((sunCol * lamb * 0.95 + amb) * day + night * (1.0 - day));
  // Specular sky & sun reflection on glass curtain walls & metallic bridge steel
  float fres = pow(1.0 - max(dot(n, V), 0.0), 4.0);
  col += apSky(sunUp) * gloss * (0.10 + 0.58 * fres) * day;
  vec3 H = normalize(V + sun);
  float spec = pow(max(dot(n, H), 0.0), 42.0) * gloss * day;
  col += sunCol * spec * 0.42;
  // Warm interior windows & landmark illumination after dark
  vec3 winWarm = mix(vec3(1.0, 0.72, 0.40), vec3(0.95, 0.88, 0.72), fract(vSeed * 13.7));
  col += winWarm * glow * (1.0 - day) * 1.75;
  col += nightAccent * (0.35 + 1.35 * (1.0 - day));

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
  vec3 upRaw = vWorld - uEarthC;
  vec3 up = dot(upRaw, upRaw) > 1e-10 ? normalize(upRaw) : vec3(0.0, 1.0, 0.0);
  vec3 sunRaw = uSunW - uEarthC;
  vec3 sun = dot(sunRaw, sunRaw) > 1e-10 ? normalize(sunRaw) : vec3(1.0, 0.0, 0.0);
  float sunUp = dot(up, sun);
  float day = smoothstep(-0.10, 0.12, sunUp);
  float k = floor(vKind + 0.5);
  vec3 base;
  if (k >= 2.5) {
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
    base = mix(vec3(0.16, 0.24, 0.09), vec3(0.24, 0.30, 0.12), n2(vUv / 9.0));
    base = mix(base, vec3(0.05, 0.11, 0.04), smoothstep(0.55, 0.75, n2(vUv / 6.0 + 3.0)) * 0.8);
  }
  vec3 sunCol = mix(vec3(1.0, 0.7, 0.5), vec3(1.0, 0.97, 0.92), smoothstep(0.02, 0.3, sunUp));
  vec3 night = vec3(0.085, 0.1, 0.155) + uMoonLight * smoothstep(-0.04, 0.2, dot(up, uMoonDir));
  vec3 col = base * ((sunCol * max(sunUp, 0.0) * 1.1 + vec3(0.20, 0.24, 0.33)) * day + night * (1.0 - day));
  vec3 vRaw = cameraPosition - vWorld;
  vec3 V = dot(vRaw, vRaw) > 1e-10 ? normalize(vRaw) : up;
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

/**
 * Single-draw-call local tangent-frame geometry builder anchored in double precision at `(anchorLat, anchorLon)`.
 * Right-handed local axes in metres: +X = East, +Y = Up, +Z = South (-Z = North).
 * Earth curvature drop `-(x^2 + z^2) / (2 R)` is automatically applied so structures kilometers
 * from the anchor still sit flush on real terrain vertices.
 */
class CityMeshBuilder {
  private readonly pos: number[] = [];
  private readonly nor: number[] = [];
  private readonly col: number[] = [];
  private readonly fac: number[] = [];
  private readonly seed: number[] = [];
  public readonly anchor: THREE.Vector3;
  private readonly east: THREE.Vector3;
  private readonly up: THREE.Vector3;
  private readonly south: THREE.Vector3;
  private readonly invR: number;
  private readonly mPerLon: number;
  private readonly mPerLat = 111320;
  private readonly rM: number;

  constructor(
    public readonly anchorLat: number,
    public readonly anchorLon: number,
    public readonly anchorElevKm: number,
    public readonly offsetKm: number,
    public readonly radiusKm: number,
    private readonly sampleGroundKm: (lat: number, lon: number) => number,
  ) {
    this.rM = radiusKm * 1000;
    this.invR = 1 / this.rM;
    this.mPerLon = 111320 * Math.cos(anchorLat * DEG);
    const [ax, ay, az] = bodyLatLonToLocal('Earth', anchorLat, anchorLon);
    const r = 1 + (anchorElevKm + offsetKm) / radiusKm;
    this.anchor = new THREE.Vector3(ax * r, ay * r, az * r);
    this.up = new THREE.Vector3(ax, ay, az).normalize();
    this.east = new THREE.Vector3(0, 1, 0).cross(this.up);
    if (this.east.lengthSq() < 1e-8) this.east.set(1, 0, 0);
    this.east.normalize();
    const north = new THREE.Vector3().crossVectors(this.up, this.east).normalize();
    this.south = north.negate();
  }

  /** Convert geographic (lat, lon) to local anchor coordinates (xM = East, zM = South) and ground elevation (yM). */
  public geoToLocal(lat: number, lon: number, groundOverrideM?: number): { x: number; y: number; z: number } {
    const x = (lon - this.anchorLon) * this.mPerLon;
    const z = -(lat - this.anchorLat) * this.mPerLat;
    const elevKm = groundOverrideM !== undefined ? groundOverrideM / 1000 : this.sampleGroundKm(lat, lon);
    const curveDropM = (x * x + z * z) / (2 * this.rM);
    const y = (elevKm - this.anchorElevKm) * 1000 - curveDropM;
    return { x, y, z };
  }

  private toEarthDelta(xM: number, yM: number, zM: number): [number, number, number] {
    const s = this.invR;
    return [
      (this.east.x * xM + this.up.x * yM + this.south.x * zM) * s,
      (this.east.y * xM + this.up.y * yM + this.south.y * zM) * s,
      (this.east.z * xM + this.up.z * yM + this.south.z * zM) * s,
    ];
  }

  private dirToEarth(nx: number, ny: number, nz: number): [number, number, number] {
    return [
      this.east.x * nx + this.up.x * ny + this.south.x * nz,
      this.east.y * nx + this.up.y * ny + this.south.y * nz,
      this.east.z * nx + this.up.z * ny + this.south.z * nz,
    ];
  }

  private pushTri(
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    color: THREE.Color,
    fA: [number, number],
    fB: [number, number],
    fC: [number, number],
    seedVal: number,
  ): void {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    const en = this.dirToEarth(nx, ny, nz);
    const pts = [a, b, c];
    const fuv = [fA, fB, fC];
    for (let i = 0; i < 3; i++) {
      const ep = this.toEarthDelta(pts[i][0], pts[i][1], pts[i][2]);
      this.pos.push(ep[0], ep[1], ep[2]);
      this.nor.push(en[0], en[1], en[2]);
      this.col.push(color.r, color.g, color.b);
      this.fac.push(fuv[i][0], fuv[i][1]);
      this.seed.push(seedVal);
    }
  }

  private pushQuad(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    color: THREE.Color,
    f0: [number, number],
    f1: [number, number],
    f2: [number, number],
    f3: [number, number],
    seedVal: number,
  ): void {
    this.pushTri(p0, p1, p2, color, f0, f1, f2, seedVal);
    this.pushTri(p0, p2, p3, color, f0, f2, f3, seedVal);
  }

  /** Add a rotated architectural box (building, tower tier, beam, pier). */
  public addBox(
    cx: number, baseY: number, cz: number,
    w: number, h: number, d: number,
    yawRad: number,
    color: THREE.Color,
    facadeMode: 'glass' | 'masonry' | 'monument' | 'emissive' = 'glass',
    seedVal = 0.5,
    roofColor?: THREE.Color,
  ): void {
    const hw = w * 0.5, hd = d * 0.5;
    const ca = Math.cos(yawRad), sa = Math.sin(yawRad);
    const pt = (lx: number, ly: number, lz: number): [number, number, number] => [
      cx + lx * ca + lz * sa,
      baseY + ly,
      cz - lx * sa + lz * ca,
    ];
    // Counter-clockwise bottom ring when viewed from above (+Y): (-hw,+hd), (+hw,+hd), (+hw,-hd), (-hw,-hd)
    const b0 = pt(-hw, 0, hd);
    const b1 = pt(hw, 0, hd);
    const b2 = pt(hw, 0, -hd);
    const b3 = pt(-hw, 0, -hd);
    const t0 = pt(-hw, h, hd);
    const t1 = pt(hw, h, hd);
    const t2 = pt(hw, h, -hd);
    const t3 = pt(-hw, h, -hd);
    const basePts = [b0, b1, b2, b3];
    const topPts = [t0, t1, t2, t3];
    const lens = [w, d, w, d];
    let along = 0;
    const fBase = facadeMode === 'glass' ? FACADE_GLASS_OFFSET : facadeMode === 'masonry' ? 0 : facadeMode === 'monument' ? FACADE_MONUMENT : FACADE_EMISSIVE;
    const fTop = facadeMode === 'glass' ? FACADE_GLASS_OFFSET + h : facadeMode === 'masonry' ? h : fBase;
    for (let i = 0; i < 4; i++) {
      const ni = (i + 1) % 4;
      const len = lens[i];
      this.pushQuad(
        basePts[i], basePts[ni], topPts[ni], topPts[i],
        color,
        [along, fBase], [along + len, fBase], [along + len, fTop], [along, fTop],
        seedVal,
      );
      along += len;
    }
    const rCol = roofColor ?? color;
    const rFac = facadeMode === 'monument' || facadeMode === 'emissive' ? fBase : FACADE_ROOF;
    this.pushQuad(t0, t1, t2, t3, rCol, [0, rFac], [w, rFac], [w, rFac], [0, rFac], seedVal);
  }

  /** Add a tapered frustum / pyramid / octagonal prism / spire with N sides. */
  public addFrustum(
    cx: number, baseY: number, cz: number,
    rBottomX: number, rBottomZ: number,
    rTopX: number, rTopZ: number,
    h: number,
    sides: number,
    yawRad: number,
    color: THREE.Color,
    facadeMode: 'glass' | 'masonry' | 'monument' | 'emissive' = 'monument',
    seedVal = 0.5,
  ): void {
    const ca = Math.cos(yawRad), sa = Math.sin(yawRad);
    const ring = (rx: number, rz: number, y: number): Array<[number, number, number]> => {
      const out: Array<[number, number, number]> = [];
      for (let i = 0; i < sides; i++) {
        // Angle sweeps clockwise in XZ so (p[i] -> p[i+1] -> top[i+1]) faces outward!
        const a = -(i / sides) * Math.PI * 2 + Math.PI / sides;
        const lx = Math.cos(a) * rx;
        const lz = Math.sin(a) * rz;
        out.push([cx + lx * ca + lz * sa, baseY + y, cz - lx * sa + lz * ca]);
      }
      return out;
    };
    const bot = ring(rBottomX, rBottomZ, 0);
    const top = ring(rTopX, rTopZ, h);
    const fBase = facadeMode === 'glass' ? FACADE_GLASS_OFFSET : facadeMode === 'masonry' ? 0 : facadeMode === 'monument' ? FACADE_MONUMENT : FACADE_EMISSIVE;
    const fTop = facadeMode === 'glass' ? FACADE_GLASS_OFFSET + h : facadeMode === 'masonry' ? h : fBase;
    let along = 0;
    for (let i = 0; i < sides; i++) {
      const ni = (i + 1) % sides;
      const segLen = Math.hypot(bot[ni][0] - bot[i][0], bot[ni][2] - bot[i][2]);
      if (rTopX < 0.05 && rTopZ < 0.05) {
        this.pushTri(bot[i], bot[ni], [cx, baseY + h, cz], color, [along, fBase], [along + segLen, fBase], [along + segLen * 0.5, fTop], seedVal);
      } else {
        this.pushQuad(bot[i], bot[ni], top[ni], top[i], color, [along, fBase], [along + segLen, fBase], [along + segLen, fTop], [along, fTop], seedVal);
      }
      along += segLen;
    }
    if (rTopX >= 0.05 || rTopZ >= 0.05) {
      const capFac = facadeMode === 'monument' || facadeMode === 'emissive' ? fBase : FACADE_ROOF;
      for (let i = 1; i + 1 < sides; i++) {
        this.pushTri(top[0], top[i], top[i + 1], color, [0, capFac], [1, capFac], [1, capFac], seedVal);
      }
    }
  }

  /** Add a solid structural beam/cable between two 3D points in local metres. */
  public addStrut(
    p0: [number, number, number],
    p1: [number, number, number],
    halfW: number,
    halfH: number,
    color: THREE.Color,
    facadeMode: 'monument' | 'emissive' = 'monument',
    seedVal = 0.5,
  ): void {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], dz = p1[2] - p0[2];
    const len = Math.hypot(dx, dy, dz);
    if (len < 0.05) return;
    const tx = dx / len, ty = dy / len, tz = dz / len;
    // Choose stable perpendicular reference
    let rx = 0, ry = 1, rz = 0;
    if (Math.abs(ty) > 0.92) { rx = 1; ry = 0; rz = 0; }
    // right = tangent x ref
    let sx = ty * rz - tz * ry, sy = tz * rx - tx * rz, sz = tx * ry - ty * rx;
    const sl = Math.hypot(sx, sy, sz) || 1;
    sx /= sl; sy /= sl; sz /= sl;
    // up2 = right x tangent
    const ux = sy * tz - sz * ty, uy = sz * tx - sx * tz, uz = sx * ty - sy * tx;
    const ring = (p: [number, number, number]): Array<[number, number, number]> => [
      [p[0] - sx * halfW - ux * halfH, p[1] - sy * halfW - uy * halfH, p[2] - sz * halfW - uz * halfH],
      [p[0] + sx * halfW - ux * halfH, p[1] + sy * halfW - uy * halfH, p[2] + sz * halfW - uz * halfH],
      [p[0] + sx * halfW + ux * halfH, p[1] + sy * halfW + uy * halfH, p[2] + sz * halfW + uz * halfH],
      [p[0] - sx * halfW + ux * halfH, p[1] - sy * halfW + uy * halfH, p[2] - sz * halfW + uz * halfH],
    ];
    const a = ring(p0);
    const b = ring(p1);
    const fVal = facadeMode === 'emissive' ? FACADE_EMISSIVE : FACADE_MONUMENT;
    for (let i = 0; i < 4; i++) {
      const ni = (i + 1) % 4;
      this.pushQuad(a[i], b[i], b[ni], a[ni], color, [0, fVal], [1, fVal], [1, fVal], [0, fVal], seedVal);
    }
  }

  public finalize(material: THREE.Material, name: string): THREE.Mesh | null {
    if (this.pos.length === 0) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(this.col, 3));
    geo.setAttribute('aFacade', new THREE.Float32BufferAttribute(this.fac, 2));
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(this.seed, 1));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.copy(this.anchor);
    mesh.name = name;
    mesh.renderOrder = 1.25;
    return mesh;
  }
}

// ── Iconic City & Landmark Builders ────────────────────────────────────────────────────────────────

function buildSanFranciscoHero(b: CityMeshBuilder): void {
  const ggOrange = srgb('#c63d2c');
  const ggOrangeDark = srgb('#9e2d20');
  const concrete = srgb('#b8b4aa');
  const asphalt = srgb('#2d3136');
  const beaconRed = srgb('#ff3a28');
  const deckLamp = srgb('#ffd58c');
  const glassBlue = srgb('#7fa0be');
  const glassSilver = srgb('#c4d2de');
  const whiteQuartz = srgb('#e8e4dc');
  const graniteDark = srgb('#544c48');

  // ── 1. GOLDEN GATE BRIDGE (exact GPS alignment across the Golden Gate strait) ──
  const sAnchor = b.geoToLocal(37.8080, -122.4763, 0);
  const sTower = b.geoToLocal(37.8138, -122.4773, 0);
  const nTower = b.geoToLocal(37.8260, -122.4795, 0);
  const nAnchor = b.geoToLocal(37.8318, -122.4806, 0);

  const spanDx = nTower.x - sTower.x;
  const spanDz = nTower.z - sTower.z;
  const mainSpanM = Math.hypot(spanDx, spanDz);
  const ux = spanDx / mainSpanM;
  const uz = spanDz / mainSpanM;
  // Perpendicular to bridge axis (pointing East across the 27 m deck)
  const px = -uz;
  const pz = ux;
  const bridgeYaw = Math.atan2(-pz, px); // aligns local +X -> (px, pz) across deck, local -Z -> (ux, uz) along bridge

  const deckY = 67;
  const towerTopY = 227;
  const halfDeck = 13.5;

  // Helper to build one 227m Art Deco stepped suspension tower
  const addBridgeTower = (pos: { x: number; y: number; z: number }, seedBase: number): void => {
    const baseY = pos.y;
    // Concrete marine pier & fender
    b.addBox(pos.x, baseY - 12, pos.z, 36, 26, 20, bridgeYaw, concrete, 'monument', seedBase);
    // Twin Art Deco stepped vertical legs (spaced 27.5m apart across deck)
    const tiers: Array<{ y0: number; y1: number; w: number; d: number }> = [
      { y0: 14, y1: 68, w: 9.5, d: 14.5 },
      { y0: 68, y1: 122, w: 8.2, d: 12.2 },
      { y0: 122, y1: 176, w: 7.0, d: 10.0 },
      { y0: 176, y1: towerTopY, w: 5.8, d: 7.8 },
    ];
    for (const side of [-1, 1]) {
      const lx = pos.x + px * side * 14.2;
      const lz = pos.z + pz * side * 14.2;
      for (const t of tiers) {
        b.addBox(lx, baseY + t.y0, lz, t.w, t.y1 - t.y0, t.d, bridgeYaw, ggOrange, 'monument', seedBase + 0.1);
      }
      // Red aviation warning beacon atop each tower leg
      b.addBox(lx, baseY + towerTopY, lz, 2.4, 3.8, 2.4, bridgeYaw, beaconRed, 'emissive', seedBase + 0.2);
    }
    // 4 signature Art Deco horizontal cross-bracing struts above deck + 2 below
    for (const sy of [34, 58, 102, 144, 184, 217]) {
      const strutH = sy > 180 ? 8.5 : 7.5;
      const strutD = sy > 150 ? 6.5 : 9.0;
      b.addBox(pos.x, baseY + sy, pos.z, 26, strutH, strutD, bridgeYaw, ggOrangeDark, 'monument', seedBase + 0.3);
    }
  };
  addBridgeTower(sTower, 0.15);
  addBridgeTower(nTower, 0.35);

  // Concrete approach anchorages & pylons
  b.addBox(sAnchor.x, sAnchor.y - 10, sAnchor.z, 40, deckY + 22, 34, bridgeYaw, concrete, 'monument', 0.2);
  b.addBox(nAnchor.x, nAnchor.y - 10, nAnchor.z, 40, deckY + 22, 34, bridgeYaw, concrete, 'monument', 0.25);

  // Continuous suspension roadway deck + steel stiffening truss underside + warm night lamp strips
  const deckSpan = (pA: { x: number; y: number; z: number }, pB: { x: number; y: number; z: number }): void => {
    const segs = 12;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs;
      const x0 = pA.x + (pB.x - pA.x) * t0, z0 = pA.z + (pB.z - pA.z) * t0, y0 = pA.y + (pB.y - pA.y) * t0;
      const x1 = pA.x + (pB.x - pA.x) * t1, z1 = pA.z + (pB.z - pA.z) * t1, y1 = pA.y + (pB.y - pA.y) * t1;
      // Subtle arch camber (+3.5m at midspan)
      const c0 = Math.sin(t0 * Math.PI) * 3.5;
      const c1 = Math.sin(t1 * Math.PI) * 3.5;
      // Asphalt deck
      b.addStrut([x0, y0 + deckY + c0, z0], [x1, y1 + deckY + c1, z1], halfDeck, 1.8, asphalt, 'monument', 0.4);
      // International Orange stiffening truss rails along both sides
      for (const side of [-1, 1]) {
        const ox = px * side * (halfDeck + 0.8);
        const oz = pz * side * (halfDeck + 0.8);
        b.addStrut([x0 + ox, y0 + deckY - 3.8 + c0, z0 + oz], [x1 + ox, y1 + deckY - 3.8 + c1, z1 + oz], 1.2, 4.2, ggOrange, 'monument', 0.45);
      }
      // Subtle night roadway lighting strip
      if (i % 2 === 0) {
        b.addStrut([x0, y0 + deckY + 2.2 + c0, z0], [x1, y1 + deckY + 2.2 + c1, z1], 1.0, 0.5, deckLamp, 'emissive', 0.5);
      }
    }
  };
  deckSpan(sAnchor, sTower);
  deckSpan(sTower, nTower);
  deckSpan(nTower, nAnchor);

  // Twin parabolic main suspension cables + vertical suspender ropes
  const addCableSpan = (
    pA: { x: number; y: number; z: number },
    pB: { x: number; y: number; z: number },
    hA: number,
    hB: number,
    sagMidY: number,
    segs: number,
    suspenderEvery: number,
  ): void => {
    for (const side of [-1, 1]) {
      const ox = px * side * 14.2;
      const oz = pz * side * 14.2;
      let prev: [number, number, number] | null = null;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const x = pA.x + (pB.x - pA.x) * t + ox;
        const z = pA.z + (pB.z - pA.z) * t + oz;
        const baseY = pA.y + (pB.y - pA.y) * t;
        // Exact parabola passing through (0, hA), (0.5, sagMidY), (1, hB)
        const lin = hA * (1 - t) + hB * t;
        const sag = 4 * t * (1 - t) * (0.5 * (hA + hB) - sagMidY);
        const cy = baseY + lin - sag;
        const cur: [number, number, number] = [x, cy, z];
        if (prev) b.addStrut(prev, cur, 1.35, 1.35, ggOrange, 'monument', 0.3);
        if (i > 0 && i < segs && i % suspenderEvery === 0) {
          const deckH = baseY + deckY + Math.sin(t * Math.PI) * 3.5;
          if (cy > deckH + 2) {
            b.addStrut([x, deckH, z], [x, cy, z], 0.45, 0.45, ggOrangeDark, 'monument', 0.32);
          }
        }
        prev = cur;
      }
    }
  };
  addCableSpan(sAnchor, sTower, deckY + 6, towerTopY - 2, deckY + 52, 10, 2);
  addCableSpan(sTower, nTower, towerTopY - 2, towerTopY - 2, deckY + 6, 26, 2);
  addCableSpan(nTower, nAnchor, towerTopY - 2, deckY + 6, deckY + 52, 10, 2);

  // ── 2. SAN FRANCISCO DOWNTOWN HERO SKYSCRAPERS ──
  // Salesforce Tower (326 m tapered chamfered glass obelisk + illuminated crown)
  const sfSales = b.geoToLocal(37.7897, -122.3970);
  b.addFrustum(sfSales.x, sfSales.y - 6, sfSales.z, 26, 26, 21, 21, 296, 8, 0.3, glassSilver, 'glass', 0.62);
  b.addFrustum(sfSales.x, sfSales.y + 290, sfSales.z, 21, 21, 14, 14, 36, 8, 0.3, srgb('#b8d8f8'), 'emissive', 0.64);

  // Transamerica Pyramid (260 m iconic sharp 4-sided white quartz pyramid + twin elevator wings + spire)
  const sfTrans = b.geoToLocal(37.7952, -122.4028);
  b.addBox(sfTrans.x, sfTrans.y - 6, sfTrans.z, 48, 28, 48, 0.04, whiteQuartz, 'glass', 0.41);
  b.addFrustum(sfTrans.x, sfTrans.y + 22, sfTrans.z, 32, 32, 2.2, 2.2, 224, 4, Math.PI * 0.25, whiteQuartz, 'glass', 0.43);
  b.addFrustum(sfTrans.x, sfTrans.y + 246, sfTrans.z, 2.2, 2.2, 0.2, 0.2, 18, 4, Math.PI * 0.25, srgb('#eef4ff'), 'emissive', 0.44);
  b.addBox(sfTrans.x + 17, sfTrans.y + 22, sfTrans.z, 9, 130, 12, 0.04, whiteQuartz, 'monument', 0.45);
  b.addBox(sfTrans.x - 17, sfTrans.y + 22, sfTrans.z, 9, 130, 12, 0.04, whiteQuartz, 'monument', 0.46);

  // 555 California St (237 m dark granite slab)
  const sf555 = b.geoToLocal(37.7923, -122.4038);
  b.addBox(sf555.x, sf555.y - 6, sf555.z, 54, 237, 36, 0.05, graniteDark, 'glass', 0.72);

  // 181 Fremont (245 m braced tower + spire)
  const sf181 = b.geoToLocal(37.7897, -122.3953);
  b.addBox(sf181.x, sf181.y - 6, sf181.z, 34, 214, 34, 0.35, glassBlue, 'glass', 0.54);
  b.addFrustum(sf181.x, sf181.y + 208, sf181.z, 3.0, 3.0, 0.4, 0.4, 38, 4, 0.35, glassSilver, 'monument', 0.55);

  // Coit Tower atop Telegraph Hill (64 m fluted white concrete cylinder)
  const sfCoit = b.geoToLocal(37.8024, -122.4058);
  b.addFrustum(sfCoit.x, sfCoit.y - 4, sfCoit.z, 9.5, 9.5, 8.0, 8.0, 64, 12, 0, whiteQuartz, 'monument', 0.22);

  // ── 3. SAN FRANCISCO DOWNTOWN / SOMA / NOB HILL SKYLINE CLUSTER (land-clipped) ──
  const sfLandPoly: ReadonlyArray<readonly [number, number]> = [
    [-122.442, 37.805], [-122.408, 37.808], [-122.398, 37.800], [-122.388, 37.791],
    [-122.385, 37.779], [-122.395, 37.768], [-122.428, 37.768], [-122.442, 37.788],
  ];
  const sfPalette = [srgb('#b8c8d8'), srgb('#8ea5ba'), srgb('#d2c8ba'), srgb('#9fb3c4'), srgb('#dcd8d0'), srgb('#788fa4')];
  let idx = 0;
  for (let lat = 37.772; lat <= 37.804; lat += 0.00175) {
    for (let lon = -122.435; lon <= -122.388; lon += 0.0021) {
      idx++;
      const jLat = lat + (hash(idx * 1.37) - 0.5) * 0.0012;
      const jLon = lon + (hash(idx * 2.91) - 0.5) * 0.0014;
      if (!pointInPoly(jLon, jLat, sfLandPoly)) continue;
      if (inHeroExclusion(jLat, jLon)) continue;
      const dFidi = approxDistM(jLat, jLon, 37.7915, -122.3995);
      const dSoma = approxDistM(jLat, jLon, 37.7865, -122.3985);
      const dNob = approxDistM(jLat, jLon, 37.7925, -122.4145);
      const coreFactor = Math.max(Math.exp(-(dFidi * dFidi) / (750 * 750)), Math.exp(-(dSoma * dSoma) / (680 * 680)) * 0.85, Math.exp(-(dNob * dNob) / (550 * 550)) * 0.45);
      if (hash(idx * 4.13) > 0.26 + coreFactor * 0.7) continue;
      const r = hash(idx * 7.19);
      const hM = 16 + coreFactor * (45 + r * r * 145) + r * 24;
      const wM = 18 + hash(idx * 5.7) * 26;
      const dM = 18 + hash(idx * 6.3) * 26;
      const p = b.geoToLocal(jLat, jLon);
      const c = sfPalette[Math.floor(hash(idx * 8.9) * sfPalette.length)];
      const yaw = jLat < 37.789 && jLon > -122.408 ? 0.58 : 0.08;
      b.addBox(p.x, p.y - 6, p.z, wM, hM, dM, yaw, c, hM > 42 ? 'glass' : 'masonry', hash(idx * 11.3));
    }
  }
}

function buildManhattanHero(b: CityMeshBuilder): void {
  const gridYaw = -29 * DEG; // Manhattan avenue grid aligned 29° east of north
  const glassIce = srgb('#92b2ce');
  const glassSteel = srgb('#728ea8');
  const glassSilver = srgb('#c6d4e0');
  const limestone = srgb('#d8d0c0');
  const artDeco = srgb('#cbc2b2');
  const creamConcrete = srgb('#e2dcd0');
  const spireGlow = srgb('#eef5ff');
  const beaconRed = srgb('#ff3a28');
  const granite = srgb('#9a9288');

  // ── 1. ONE WORLD TRADE CENTER (541 m) ──
  const wtc = b.geoToLocal(40.7127, -74.0134);
  b.addBox(wtc.x, wtc.y - 6, wtc.z, 61, 58, 61, gridYaw, glassSteel, 'glass', 0.11);
  b.addFrustum(wtc.x, wtc.y + 52, wtc.z, 41, 41, 31, 31, 365, 8, gridYaw, glassIce, 'glass', 0.12);
  b.addFrustum(wtc.x, wtc.y + 417, wtc.z, 15, 15, 13, 13, 12, 12, gridYaw, glassSilver, 'monument', 0.13);
  b.addFrustum(wtc.x, wtc.y + 429, wtc.z, 3.2, 3.2, 0.35, 0.35, 112, 6, gridYaw, spireGlow, 'monument', 0.14);
  b.addBox(wtc.x, wtc.y + 539, wtc.z, 2.2, 4.0, 2.2, gridYaw, beaconRed, 'emissive', 0.15);

  // ── 2. EMPIRE STATE BUILDING (443 m Art Deco stepped limestone icon) ──
  const esb = b.geoToLocal(40.7484, -73.9857);
  b.addBox(esb.x, esb.y - 6, esb.z, 118, 28, 60, gridYaw, limestone, 'masonry', 0.21);
  b.addBox(esb.x, esb.y + 22, esb.z, 84, 72, 52, gridYaw, artDeco, 'glass', 0.22);
  b.addBox(esb.x, esb.y + 94, esb.z, 54, 198, 40, gridYaw, limestone, 'glass', 0.23);
  b.addBox(esb.x, esb.y + 292, esb.z, 38, 46, 32, gridYaw, artDeco, 'glass', 0.24);
  b.addBox(esb.x, esb.y + 338, esb.z, 24, 43, 24, gridYaw, limestone, 'glass', 0.25);
  b.addFrustum(esb.x, esb.y + 381, esb.z, 8.5, 8.5, 4.5, 4.5, 22, 8, gridYaw, spireGlow, 'emissive', 0.26);
  b.addFrustum(esb.x, esb.y + 403, esb.z, 2.4, 2.4, 0.3, 0.3, 40, 6, gridYaw, spireGlow, 'monument', 0.27);

  // ── 3. CHRYSLER BUILDING (319 m silver terraced crown + needle spire) ──
  const chrys = b.geoToLocal(40.7516, -73.9755);
  b.addBox(chrys.x, chrys.y - 6, chrys.z, 60, 100, 56, gridYaw, artDeco, 'glass', 0.31);
  b.addBox(chrys.x, chrys.y + 94, chrys.z, 36, 152, 36, gridYaw, limestone, 'glass', 0.32);
  b.addFrustum(chrys.x, chrys.y + 246, chrys.z, 22, 22, 13, 13, 18, 8, gridYaw, glassSilver, 'emissive', 0.33);
  b.addFrustum(chrys.x, chrys.y + 264, chrys.z, 13, 13, 4, 4, 18, 8, gridYaw, spireGlow, 'emissive', 0.34);
  b.addFrustum(chrys.x, chrys.y + 282, chrys.z, 2.2, 2.2, 0.25, 0.25, 37, 6, gridYaw, spireGlow, 'monument', 0.35);

  // ── 4. ONE VANDERBILT (427 m stepped taper + spire) ──
  const vand = b.geoToLocal(40.7530, -73.9785);
  b.addBox(vand.x, vand.y - 6, vand.z, 54, 250, 54, gridYaw, glassSilver, 'glass', 0.41);
  b.addBox(vand.x, vand.y + 244, vand.z, 40, 82, 40, gridYaw, glassIce, 'glass', 0.42);
  b.addFrustum(vand.x, vand.y + 326, vand.z, 22, 22, 5, 5, 58, 4, gridYaw + Math.PI * 0.25, spireGlow, 'emissive', 0.43);
  b.addFrustum(vand.x, vand.y + 384, vand.z, 2.0, 2.0, 0.25, 0.25, 43, 4, gridYaw, spireGlow, 'monument', 0.44);

  // ── 5. BILLIONAIRES' ROW + HUDSON YARDS + MIDTOWN SUPERTALLS ──
  const heroTowers: Array<{ lat: number; lon: number; w: number; d: number; h: number; col: THREE.Color; spire?: number; s: number }> = [
    { lat: 40.7663, lon: -73.9808, w: 36, d: 34, h: 472, col: glassIce, s: 0.51 },      // Central Park Tower
    { lat: 40.7616, lon: -73.9718, w: 28, d: 28, h: 426, col: creamConcrete, s: 0.52 }, // 432 Park Avenue
    { lat: 40.7654, lon: -73.9776, w: 18, d: 24, h: 435, col: artDeco, s: 0.53 },       // 111 W 57th (Steinway)
    { lat: 40.7537, lon: -74.0005, w: 50, d: 46, h: 387, col: glassSteel, s: 0.54 },    // 30 Hudson Yards
    { lat: 40.7556, lon: -73.9849, w: 48, d: 44, h: 288, col: glassIce, spire: 78, s: 0.55 }, // Bank of America Tower
    { lat: 40.7587, lon: -73.9787, w: 38, d: 78, h: 259, col: limestone, s: 0.56 },     // 30 Rockefeller Plaza
    { lat: 40.7535, lon: -73.9765, w: 72, d: 36, h: 246, col: artDeco, s: 0.57 },       // MetLife Building
    { lat: 40.7109, lon: -74.0117, w: 48, d: 44, h: 329, col: glassSilver, s: 0.58 },   // 3 WTC
    { lat: 40.7103, lon: -74.0119, w: 42, d: 40, h: 298, col: glassIce, s: 0.59 },      // 4 WTC
    { lat: 40.7125, lon: -74.0082, w: 36, d: 36, h: 282, col: limestone, s: 0.60 },     // 30 Park Place
    { lat: 40.7067, lon: -74.0096, w: 38, d: 38, h: 283, col: artDeco, spire: 20, s: 0.61 }, // 40 Wall Street
    { lat: 40.7580, lon: -73.9746, w: 44, d: 44, h: 423, col: srgb('#8e7a6a'), s: 0.62 }, // 270 Park Ave
  ];
  for (const t of heroTowers) {
    const p = b.geoToLocal(t.lat, t.lon);
    b.addBox(p.x, p.y - 6, p.z, t.w, t.h, t.d, gridYaw, t.col, 'glass', t.s);
    if (t.spire) {
      b.addFrustum(p.x, p.y + t.h - 6, p.z, 2.2, 2.2, 0.25, 0.25, t.spire, 4, gridYaw, spireGlow, 'monument', t.s + 0.01);
    }
  }

  // ── 6. BROOKLYN BRIDGE (across the East River) ──
  const bbW = b.geoToLocal(40.7073, -73.9985, 0);
  const bbE = b.geoToLocal(40.7048, -73.9950, 0);
  const bbDx = bbE.x - bbW.x, bbDz = bbE.z - bbW.z;
  const bbYaw = Math.atan2(-bbDz, bbDx);
  for (const tp of [bbW, bbE]) {
    b.addBox(tp.x, tp.y - 8, tp.z, 14, 84, 42, bbYaw, granite, 'monument', 0.71);
  }
  const bbA = b.geoToLocal(40.7095, -74.0015, 0);
  const bbB = b.geoToLocal(40.7026, -73.9918, 0);
  b.addStrut([bbA.x, bbA.y + 42, bbA.z], [bbB.x, bbB.y + 42, bbB.z], 13, 2.2, srgb('#3a3d42'), 'monument', 0.72);
  b.addStrut([bbW.x, bbW.y + 82, bbW.z], [(bbW.x + bbE.x) * 0.5, bbW.y + 48, (bbW.z + bbE.z) * 0.5], 0.8, 0.8, glassSilver, 'monument', 0.73);
  b.addStrut([(bbW.x + bbE.x) * 0.5, bbW.y + 48, (bbW.z + bbE.z) * 0.5], [bbE.x, bbE.y + 82, bbE.z], 0.8, 0.8, glassSilver, 'monument', 0.73);

  // ── 7. DENSE MANHATTAN ISLAND SKYLINE GRID (bounded inside real island shoreline, Central Park excluded!) ──
  const manhattanPoly: ReadonlyArray<readonly [number, number]> = [
    [-74.017, 40.701], [-74.004, 40.703], [-73.996, 40.708], [-73.976, 40.712],
    [-73.972, 40.727], [-73.972, 40.745], [-73.959, 40.762], [-73.944, 40.785],
    [-73.938, 40.805], [-73.963, 40.806], [-73.977, 40.790], [-73.992, 40.772],
    [-74.005, 40.755], [-74.011, 40.735], [-74.017, 40.715],
  ];
  const centralParkPoly: ReadonlyArray<readonly [number, number]> = [
    [-73.9818, 40.7681], [-73.9730, 40.7644], [-73.9493, 40.7968], [-73.9581, 40.8005],
  ];
  const nyPalette = [
    srgb('#8ea4b8'), srgb('#7a8fa4'), srgb('#b8b2a6'), srgb('#a6b4c2'),
    srgb('#c9bfb0'), srgb('#6d8094'), srgb('#9aa6b2'), srgb('#d4cab8'),
  ];
  let idx = 0;
  for (let lat = 40.703; lat <= 40.796; lat += 0.00145) {
    for (let lon = -74.016; lon <= -73.946; lon += 0.00185) {
      idx++;
      const jLat = lat + (hash(idx * 1.93) - 0.5) * 0.0008;
      const jLon = lon + (hash(idx * 3.17) - 0.5) * 0.0010;
      if (!pointInPoly(jLon, jLat, manhattanPoly)) continue;
      if (pointInPoly(jLon, jLat, centralParkPoly)) continue;
      if (inHeroExclusion(jLat, jLon)) continue;
      const dMidtown = approxDistM(jLat, jLon, 40.7545, -73.9815);
      const dFidi = approxDistM(jLat, jLon, 40.7090, -74.0105);
      const dHudson = approxDistM(jLat, jLon, 40.7535, -74.0015);
      const density = Math.max(
        Math.exp(-(dMidtown * dMidtown) / (1350 * 1350)),
        Math.exp(-(dFidi * dFidi) / (780 * 780)) * 0.98,
        Math.exp(-(dHudson * dHudson) / (520 * 520)) * 0.85,
      );
      if (hash(idx * 5.21) > 0.45 + density * 0.52) continue;
      const r = hash(idx * 9.37);
      const hM = 24 + density * (65 + r * r * 195) + r * 32;
      const wM = 22 + hash(idx * 4.7) * 26;
      const dM = 22 + hash(idx * 6.1) * 30;
      const p = b.geoToLocal(jLat, jLon);
      const c = nyPalette[Math.floor(hash(idx * 11.7) * nyPalette.length)];
      b.addBox(p.x, p.y - 6, p.z, wM, hM, dM, gridYaw, c, hM > 48 ? 'glass' : 'masonry', hash(idx * 13.1));
    }
  }
}

function buildParisHero(b: CityMeshBuilder): void {
  const eiffelIron = srgb('#705d4d');
  const eiffelDark = srgb('#544538');
  const eiffelGold = srgb('#ffd480');
  const limestone = srgb('#e2d8c5');
  const zincRoof = srgb('#4b5664');
  const glassDark = srgb('#5a6b7c');
  const glassBright = srgb('#9eb4c8');

  // ── 1. EIFFEL TOWER (48.8584, 2.2945 — 330 m iconic 4-legged curved iron lattice) ──
  const ef = b.geoToLocal(48.8584, 2.2945);
  const efYaw = -45 * DEG; // aligned to Champ de Mars axis (NW-SE)
  const ca = Math.cos(efYaw), sa = Math.sin(efYaw);
  const rot = (lx: number, ly: number, lz: number): [number, number, number] => [
    ef.x + lx * ca + lz * sa,
    ef.y + ly,
    ef.z - lx * sa + lz * ca,
  ];
  // 4 curving corner legs rising smoothly from 125m base -> 57m 1st deck -> 115m 2nd deck -> 276m summit
  const profile: Array<{ y: number; spread: number; thick: number }> = [
    { y: -4, spread: 56, thick: 12.5 },
    { y: 24, spread: 47, thick: 10.5 },
    { y: 57, spread: 36, thick: 8.8 },
    { y: 86, spread: 26, thick: 7.0 },
    { y: 115, spread: 19, thick: 5.8 },
    { y: 165, spread: 12.5, thick: 4.5 },
    { y: 220, spread: 8.5, thick: 3.6 },
    { y: 276, spread: 6.2, thick: 3.0 },
  ];
  const corners: ReadonlyArray<readonly [number, number]> = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (let s = 0; s < profile.length - 1; s++) {
    const p0 = profile[s], p1 = profile[s + 1];
    const hw = (p0.thick + p1.thick) * 0.25;
    for (const [sx, sz] of corners) {
      b.addStrut(rot(sx * p0.spread, p0.y, sz * p0.spread), rot(sx * p1.spread, p1.y, sz * p1.spread), hw, hw, eiffelIron, 'monument', 0.2 + s * 0.05);
    }
    // Cross-bracing lattice struts around the upper shaft
    if (s >= 2) {
      for (let c = 0; c < 4; c++) {
        const [ax, az] = corners[c];
        const [bx, bz] = corners[(c + 1) % 4];
        b.addStrut(rot(ax * p0.spread, p0.y, az * p0.spread), rot(bx * p1.spread, p1.y, bz * p1.spread), 1.4, 1.4, eiffelDark, 'monument', 0.3);
        b.addStrut(rot(bx * p0.spread, p0.y, bz * p0.spread), rot(ax * p1.spread, p1.y, az * p1.spread), 1.4, 1.4, eiffelDark, 'monument', 0.31);
      }
    }
  }
  // Decorative base arches linking the 4 corner piers below 1st platform
  for (let c = 0; c < 4; c++) {
    const [ax, az] = corners[c];
    const [bx, bz] = corners[(c + 1) % 4];
    const pA = rot(ax * 44, 24, az * 44);
    const pMid = rot((ax + bx) * 20, 44, (az + bz) * 20);
    const pB = rot(bx * 44, 24, bz * 44);
    b.addStrut(pA, pMid, 2.2, 3.0, eiffelDark, 'monument', 0.35);
    b.addStrut(pMid, pB, 2.2, 3.0, eiffelDark, 'monument', 0.35);
  }
  // 1st platform (57 m), 2nd platform (115 m), 3rd summit platform (276 m) + golden night lighting bands
  b.addBox(ef.x, ef.y + 53, ef.z, 76, 9, 76, efYaw, eiffelIron, 'monument', 0.4);
  b.addBox(ef.x, ef.y + 56, ef.z, 78, 2.5, 78, efYaw, eiffelGold, 'emissive', 0.41);
  b.addBox(ef.x, ef.y + 112, ef.z, 42, 8, 42, efYaw, eiffelIron, 'monument', 0.42);
  b.addBox(ef.x, ef.y + 115, ef.z, 44, 2.2, 44, efYaw, eiffelGold, 'emissive', 0.43);
  b.addBox(ef.x, ef.y + 272, ef.z, 17, 11, 17, efYaw, eiffelIron, 'monument', 0.44);
  b.addBox(ef.x, ef.y + 279, ef.z, 14, 4, 14, efYaw, eiffelGold, 'emissive', 0.45);
  // Summit cupola & 330 m broadcast spire
  b.addFrustum(ef.x, ef.y + 283, ef.z, 6.0, 6.0, 2.0, 2.0, 18, 8, efYaw, eiffelIron, 'monument', 0.46);
  b.addFrustum(ef.x, ef.y + 301, ef.z, 1.8, 1.8, 0.25, 0.25, 29, 6, efYaw, eiffelGold, 'emissive', 0.47);

  // ── 2. ARC DE TRIOMPHE (48.8738, 2.2950 — 50 m vaulted arch) ──
  const arc = b.geoToLocal(48.8738, 2.2950);
  const arcYaw = -26 * DEG;
  const aca = Math.cos(arcYaw), asa = Math.sin(arcYaw);
  const aOff = (lx: number, lz: number): [number, number] => [arc.x + lx * aca + lz * asa, arc.z - lx * asa + lz * aca];
  const [lX, lZ] = aOff(-14, 0);
  const [rX, rZ] = aOff(14, 0);
  b.addBox(lX, arc.y - 4, lZ, 16, 34, 22, arcYaw, limestone, 'monument', 0.51);
  b.addBox(rX, arc.y - 4, rZ, 16, 34, 22, arcYaw, limestone, 'monument', 0.52);
  b.addBox(arc.x, arc.y + 30, arc.z, 45, 20, 23, arcYaw, limestone, 'monument', 0.53);

  // ── 3. TOUR MONTPARNASSE (48.8421, 2.3219 — 210 m dark glass monolith) ──
  const mp = b.geoToLocal(48.8421, 2.3219);
  b.addBox(mp.x, mp.y - 6, mp.z, 58, 210, 36, -0.45, glassDark, 'glass', 0.61);

  // ── 4. LA DÉFENSE SKYLINE (Grande Arche + modern glass towers) ──
  const ld = b.geoToLocal(48.8925, 2.2361);
  b.addBox(ld.x - 42, ld.y - 6, ld.z, 22, 110, 108, -0.45, srgb('#eceae4'), 'monument', 0.65);
  b.addBox(ld.x + 42, ld.y - 6, ld.z, 22, 110, 108, -0.45, srgb('#eceae4'), 'monument', 0.66);
  b.addBox(ld.x, ld.y + 88, ld.z, 106, 22, 108, -0.45, srgb('#eceae4'), 'monument', 0.67);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const dist = 0.002 + hash(i * 4.3) * 0.0045;
    const tLat = 48.8910 + Math.sin(a) * dist * 0.7;
    const tLon = 2.2425 + Math.cos(a) * dist;
    const p = b.geoToLocal(tLat, tLon);
    b.addBox(p.x, p.y - 6, p.z, 34 + hash(i * 2.1) * 18, 125 + hash(i * 5.9) * 105, 32 + hash(i * 3.7) * 18, -0.45, i % 2 === 0 ? glassBright : glassDark, 'glass', hash(i * 7.3));
  }

  // ── 5. HAUSSMANN PARISIAN CITY BLOCKS (keeping Seine channel & Champ de Mars open!) ──
  const seineLatAt = (lon: number): number => {
    if (lon < 2.275) return 48.842 + (lon - 2.245) * 0.45;
    if (lon < 2.302) return 48.8555 + (lon - 2.275) * 0.34;
    if (lon < 2.335) return 48.8645 - (lon - 2.302) * 0.28;
    return 48.855 - (lon - 2.335) * 0.25;
  };
  const parisPalette = [srgb('#e5dbc8'), srgb('#ddd1bc'), srgb('#ebe2d1'), srgb('#d6c9b2'), srgb('#e0d6c2')];
  let idx = 0;
  for (let lat = 48.842; lat <= 48.880; lat += 0.0017) {
    for (let lon = 2.268; lon <= 2.352; lon += 0.0026) {
      idx++;
      const jLat = lat + (hash(idx * 1.7) - 0.5) * 0.0008;
      const jLon = lon + (hash(idx * 2.9) - 0.5) * 0.0012;
      if (inHeroExclusion(jLat, jLon)) continue;
      // Keep Seine river corridor clear (~180m half-width)
      if (Math.abs(jLat - seineLatAt(jLon)) < 0.0018) continue;
      // Keep Champ de Mars park lawn clear SE of Eiffel Tower
      const dCh = approxDistM(jLat, jLon, 48.8550, 2.2988);
      if (dCh < 320) continue;
      // Keep Les Invalides esplanade clear
      if (approxDistM(jLat, jLon, 48.8595, 2.3130) < 220) continue;
      if (hash(idx * 4.7) > 0.72) continue;
      const p = b.geoToLocal(jLat, jLon);
      const hM = 20 + hash(idx * 6.3) * 10;
      const wM = 36 + hash(idx * 3.1) * 28;
      const dM = 28 + hash(idx * 5.3) * 24;
      const c = parisPalette[Math.floor(hash(idx * 8.1) * parisPalette.length)];
      b.addBox(p.x, p.y - 4, p.z, wM, hM, dM, (hash(idx * 2.3) - 0.5) * 0.6, c, 'masonry', hash(idx * 9.7), zincRoof);
    }
  }
}

function buildLondonHero(b: CityMeshBuilder): void {
  const stone = srgb('#cfc4b0');
  const blueSteel = srgb('#3d7ea6');
  const glass = srgb('#92b0c8');
  const darkRoof = srgb('#3e4854');
  // Tower Bridge (51.5055, -0.0754)
  const tbS = b.geoToLocal(51.5049, -0.0757, 0);
  const tbN = b.geoToLocal(51.5061, -0.0751, 0);
  const tbPx = -(tbN.z - tbS.z), tbPz = tbN.x - tbS.x;
  const yaw = Math.atan2(-tbPz, tbPx);
  for (const tp of [tbS, tbN]) {
    b.addBox(tp.x, tp.y - 6, tp.z, 18, 56, 20, yaw, stone, 'monument', 0.2);
    b.addFrustum(tp.x, tp.y + 50, tp.z, 12, 13, 1.5, 1.5, 16, 4, yaw + Math.PI * 0.25, darkRoof, 'monument', 0.21);
  }
  b.addStrut([tbS.x, tbS.y + 44, tbS.z], [tbN.x, tbN.y + 44, tbN.z], 4.5, 2.2, blueSteel, 'monument', 0.22);
  const tbA = b.geoToLocal(51.5040, -0.0761, 0);
  const tbB = b.geoToLocal(51.5070, -0.0747, 0);
  b.addStrut([tbA.x, tbA.y + 16, tbA.z], [tbB.x, tbB.y + 16, tbB.z], 10, 1.8, srgb('#363a40'), 'monument', 0.23);
  // The Shard (310 m glass spire pyramid)
  const shard = b.geoToLocal(51.5045, -0.0865);
  b.addFrustum(shard.x, shard.y - 6, shard.z, 36, 36, 4.5, 4.5, 310, 4, 0.3, glass, 'glass', 0.35);
  // City of London cluster (22 Bishopsgate, Gherkin, Walkie-Talkie)
  const cityTowers: Array<[number, number, number, number]> = [
    [51.5145, -0.0828, 278, 44], [51.5145, -0.0803, 180, 34], [51.5112, -0.0835, 160, 40],
    [51.5138, -0.0819, 224, 38], [51.5156, -0.0812, 230, 36], [51.5128, -0.0860, 190, 38],
  ];
  for (let i = 0; i < cityTowers.length; i++) {
    const [la, lo, hM, wM] = cityTowers[i];
    const p = b.geoToLocal(la, lo);
    b.addBox(p.x, p.y - 6, p.z, wM, hM, wM, 0.2, glass, 'glass', 0.4 + i * 0.08);
  }
}

function buildTokyoHero(b: CityMeshBuilder): void {
  const red = srgb('#d93829');
  const white = srgb('#eceef0');
  const glass = srgb('#9eb4c8');
  // Tokyo Tower (35.6586, 139.7454 — 333 m iconic red-and-white alternating bands)
  const tt = b.geoToLocal(35.6586, 139.7454);
  const bands: Array<{ y0: number; y1: number; r0: number; r1: number; c: THREE.Color }> = [
    { y0: -4, y1: 68, r0: 44, r1: 24, c: red },
    { y0: 68, y1: 120, r0: 24, r1: 16, c: white },
    { y0: 120, y1: 158, r0: 18, r1: 16, c: red },
    { y0: 158, y1: 205, r0: 13, r1: 9.5, c: white },
    { y0: 205, y1: 252, r0: 10, r1: 7.5, c: red },
    { y0: 252, y1: 292, r0: 5.5, r1: 3.5, c: white },
    { y0: 292, y1: 333, r0: 3.0, r1: 0.4, c: red },
  ];
  for (let i = 0; i < bands.length; i++) {
    const bd = bands[i];
    b.addFrustum(tt.x, tt.y + bd.y0, tt.z, bd.r0, bd.r0, bd.r1, bd.r1, bd.y1 - bd.y0, 4, Math.PI * 0.25, bd.c, 'monument', 0.2 + i * 0.05);
  }
  b.addBox(tt.x, tt.y + 148, tt.z, 32, 12, 32, 0, red, 'emissive', 0.5);
  // Minato / Roppongi / Azabudai Hills skyline
  const pal = [glass, srgb('#c6ced6'), srgb('#889eb2'), srgb('#d6dce2')];
  for (let i = 0; i < 85; i++) {
    const a = hash(i * 3.1) * Math.PI * 2;
    const rad = 0.0022 + hash(i * 4.7) * 0.014;
    const la = 35.659 + Math.sin(a) * rad * 0.85;
    const lo = 139.745 + Math.cos(a) * rad;
    if (inHeroExclusion(la, lo)) continue;
    const p = b.geoToLocal(la, lo);
    const hM = 40 + hash(i * 7.3) ** 1.6 * 220;
    b.addBox(p.x, p.y - 6, p.z, 26 + hash(i * 2.3) * 24, hM, 26 + hash(i * 5.1) * 24, hash(i) * 0.8, pal[i % pal.length], 'glass', hash(i * 9.1));
  }
}

function buildDubaiHero(b: CityMeshBuilder): void {
  const silver = srgb('#c4d6e6');
  const glow = srgb('#e8f4ff');
  // Burj Khalifa (25.1972, 55.2744 — 828 m spiraling stepped silver-glass megatall)
  const bk = b.geoToLocal(25.1972, 55.2744);
  const tiers: Array<[number, number, number]> = [
    [0, 140, 52], [140, 260, 42], [260, 380, 33], [380, 500, 24], [500, 610, 16], [610, 700, 9.5], [700, 828, 3.2],
  ];
  for (let i = 0; i < tiers.length; i++) {
    const [y0, y1, r] = tiers[i];
    const rTop = i === tiers.length - 1 ? 0.3 : r * 0.88;
    b.addFrustum(bk.x, bk.y + y0 - 6, bk.z, r, r, rTop, rTop, y1 - y0, 6, i * 0.35, silver, i < 5 ? 'glass' : 'monument', 0.2 + i * 0.07);
  }
  b.addBox(bk.x, bk.y + 820, bk.z, 2.5, 8, 2.5, 0, glow, 'emissive', 0.9);
  // Downtown Dubai skyline ring
  for (let i = 0; i < 65; i++) {
    const a = (i / 65) * Math.PI * 2 + hash(i) * 0.3;
    const rad = 0.0022 + hash(i * 5.7) * 0.011;
    const la = 25.1972 + Math.sin(a) * rad;
    const lo = 55.2744 + Math.cos(a) * rad;
    if (inHeroExclusion(la, lo)) continue;
    const p = b.geoToLocal(la, lo);
    const hM = 60 + hash(i * 8.3) ** 1.4 * 260;
    b.addBox(p.x, p.y - 6, p.z, 28 + hash(i * 2.9) * 24, hM, 28 + hash(i * 4.1) * 24, hash(i) * 1.2, silver, 'glass', hash(i * 6.7));
  }
}

function buildChicagoHero(b: CityMeshBuilder): void {
  const obsidian = srgb('#363c44');
  const glass = srgb('#8ca4b8');
  const white = srgb('#e8ecf0');
  // Willis Tower (41.8789, -87.6359 — 442 m bundled-tube setbacks + twin white broadcast masts)
  const wt = b.geoToLocal(41.8789, -87.6359);
  b.addBox(wt.x, wt.y - 6, wt.z, 68, 220, 68, 0, obsidian, 'glass', 0.2);
  b.addBox(wt.x - 10, wt.y + 214, wt.z + 10, 48, 88, 48, 0, obsidian, 'glass', 0.22);
  b.addBox(wt.x - 10, wt.y + 302, wt.z, 38, 66, 48, 0, obsidian, 'glass', 0.24);
  b.addBox(wt.x - 10, wt.y + 368, wt.z - 8, 26, 74, 34, 0, obsidian, 'glass', 0.26);
  b.addFrustum(wt.x - 16, wt.y + 442, wt.z - 8, 1.8, 1.8, 0.25, 0.25, 85, 4, 0, white, 'monument', 0.28);
  b.addFrustum(wt.x - 4, wt.y + 442, wt.z - 8, 1.8, 1.8, 0.25, 0.25, 85, 4, 0, white, 'monument', 0.29);
  // Loop skyline
  for (let i = 0; i < 80; i++) {
    const la = 41.872 + hash(i * 2.1) * 0.022;
    const lo = -87.642 + hash(i * 3.7) * 0.020;
    if (inHeroExclusion(la, lo)) continue;
    const p = b.geoToLocal(la, lo);
    const hM = 45 + hash(i * 6.9) ** 1.5 * 220;
    b.addBox(p.x, p.y - 6, p.z, 26 + hash(i * 4.3) * 24, hM, 26 + hash(i * 5.9) * 24, 0, i % 3 === 0 ? obsidian : glass, 'glass', hash(i * 8.1));
  }
}

function buildSydneyHero(b: CityMeshBuilder): void {
  const shellWhite = srgb('#ece9e2');
  const steel = srgb('#66717a');
  const granite = srgb('#9e9588');
  const glass = srgb('#9ab2c6');
  // Sydney Opera House (-33.8568, 151.2153 — gleaming white sail shells on podium)
  const oh = b.geoToLocal(-33.8568, 151.2153, 0);
  b.addBox(oh.x, oh.y - 6, oh.z, 118, 16, 175, -0.15, granite, 'monument', 0.2);
  for (const [ox, oz, hM, rM] of [[-24, -22, 65, 28], [-24, 24, 52, 24], [24, -18, 56, 26], [24, 26, 44, 22], [0, 56, 34, 18]]) {
    b.addFrustum(oh.x + ox, oh.y + 10, oh.z + oz, rM, rM * 0.72, 2.0, 2.0, hM, 5, -0.15, shellWhite, 'monument', 0.25);
  }
  // Sydney Harbour Bridge steel arch (-33.8523, 151.2108)
  const hbS = b.geoToLocal(-33.8548, 151.2102, 0);
  const hbN = b.geoToLocal(-33.8498, 151.2114, 0);
  const hbPx = -(hbN.z - hbS.z), hbPz = hbN.x - hbS.x;
  const hbYaw = Math.atan2(-hbPz, hbPx);
  for (const tp of [hbS, hbN]) b.addBox(tp.x, tp.y - 6, tp.z, 28, 89, 20, hbYaw, granite, 'monument', 0.35);
  b.addStrut([hbS.x, hbS.y + 52, hbS.z], [hbN.x, hbN.y + 52, hbN.z], 24, 3.0, srgb('#363b40'), 'monument', 0.36);
  let prev: [number, number, number] | null = null;
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const x = hbS.x + (hbN.x - hbS.x) * t;
    const z = hbS.z + (hbN.z - hbS.z) * t;
    const y = hbS.y + 52 + Math.sin(t * Math.PI) * 82;
    const cur: [number, number, number] = [x, y, z];
    if (prev) b.addStrut(prev, cur, 4.5, 4.5, steel, 'monument', 0.38);
    prev = cur;
  }
  // CBD towers south of Circular Quay
  for (let i = 0; i < 45; i++) {
    const la = -33.874 + hash(i * 2.7) * 0.012;
    const lo = 151.203 + hash(i * 4.3) * 0.011;
    const p = b.geoToLocal(la, lo);
    const hM = 45 + hash(i * 7.1) ** 1.4 * 195;
    b.addBox(p.x, p.y - 6, p.z, 26 + hash(i * 3.3) * 20, hM, 26 + hash(i * 5.7) * 20, 0.1, glass, 'glass', hash(i * 8.9));
  }
}

function buildGizaHero(b: CityMeshBuilder): void {
  const sandStone = srgb('#d9c298');
  const capStone = srgb('#e6d6b4');
  // Great Pyramid of Khufu (230 m base, 139 m), Khafre (215 m base, 136 m), Menkaure (105 m base, 61 m)
  const khufu = b.geoToLocal(29.9792, 31.1342);
  b.addFrustum(khufu.x, khufu.y - 6, khufu.z, 162, 162, 0.5, 0.5, 139, 4, Math.PI * 0.25, sandStone, 'monument', 0.2);
  const khafre = b.geoToLocal(29.9759, 31.1308);
  b.addFrustum(khafre.x, khafre.y - 6, khafre.z, 152, 152, 24, 24, 108, 4, Math.PI * 0.25, sandStone, 'monument', 0.3);
  b.addFrustum(khafre.x, khafre.y + 102, khafre.z, 24, 24, 0.5, 0.5, 28, 4, Math.PI * 0.25, capStone, 'monument', 0.31);
  const menkaure = b.geoToLocal(29.9725, 31.1283);
  b.addFrustum(menkaure.x, menkaure.y - 6, menkaure.z, 74, 74, 0.5, 0.5, 61, 4, Math.PI * 0.25, sandStone, 'monument', 0.4);
}

const HERO_BUILDERS: Record<string, { lat: number; lon: number; build: (b: CityMeshBuilder) => void }> = {
  'San Francisco': { lat: 37.805, lon: -122.440, build: buildSanFranciscoHero },
  'New York': { lat: 40.745, lon: -73.988, build: buildManhattanHero },
  'Paris': { lat: 48.8584, lon: 2.2945, build: buildParisHero },
  'London': { lat: 51.508, lon: -0.080, build: buildLondonHero },
  'Tokyo': { lat: 35.6586, lon: 139.7454, build: buildTokyoHero },
  'Dubai': { lat: 25.1972, lon: 55.2744, build: buildDubaiHero },
  'Chicago': { lat: 41.880, lon: -87.634, build: buildChicagoHero },
  'Sydney': { lat: -33.857, lon: 151.213, build: buildSydneyHero },
  'Giza': { lat: 29.976, lon: 31.131, build: buildGizaHero },
};

/** A building outline from OSM vector tiles: outer ring (lat/lon) and height in metres. */
interface Footprint {
  ring: Array<{ lat: number; lon: number }>;
  holes?: Array<Array<{ lat: number; lon: number }>>;
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
  private heroCities = new Map<string, HeroCityInstance>();
  private material: THREE.ShaderMaterial;
  private building: Promise<void> = Promise.resolve();
  private paceT = 0;
  private disposed = false;
  private aborts = new Set<AbortController>();
  private lastHeroCheckMs = 0;

  private async pace(): Promise<void> {
    if (this.disposed) return;
    const now = performance.now();
    if (!this.paceT) this.paceT = now;
    if (now - this.paceT < 2.2) return;
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
  private backoffMs = 0;
  private inFlightCount = 0;
  private tileUrl: string | null = null;
  private tileUrlPromise: Promise<string | null> | null = null;
  /** Drawn ground minus elevation data under the region, km (measured once per region when PhotorealEarth is showing). */
  private groundOffsetKm: number | null = null;
  /** Fallback offset (km); defaults to 0 when SurfaceTileLayer is the primary ground. */
  public fallbackOffsetKm: number | null = null;
  /** Offset hint measured under the jet (km) when PhotorealEarth is active. */
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
      uniforms: {
        uSunW: SUN_WORLD,
        uEarthC: this.earthCentre,
        uKmPerUnit: this.kmPerUnit,
        uCamAltKm: this.camAltKm,
        uHaze: this.haze,
        uNightAir: NIGHT_AIR,
        uMoonLight: MOON_LIGHT,
        uMoonDir: MOON_DIR,
      },
      vertexShader,
      fragmentShader,
    });
    this.groundMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSunW: SUN_WORLD,
        uEarthC: this.earthCentre,
        uKmPerUnit: this.kmPerUnit,
        uCamAltKm: this.camAltKm,
        uHaze: this.haze,
        uNightAir: NIGHT_AIR,
        uMoonLight: MOON_LIGHT,
        uMoonDir: MOON_DIR,
      },
      vertexShader: groundVertex,
      fragmentShader: groundFragment,
      transparent: true,
      depthWrite: false,
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

  private activeRadiusKm(): number {
    return PhotorealEarth.current?.showing ? R_KM_WGS84 : R_KM_TILE;
  }

  private resolvedOffsetKm(): number {
    if (!PhotorealEarth.current?.showing) return 0;
    if (this.groundOffsetKm !== null && Number.isFinite(this.groundOffsetKm)) return this.groundOffsetKm;
    if (this.offsetHintKm !== null && Number.isFinite(this.offsetHintKm) && Math.abs(this.offsetHintKm) < 0.15) return this.offsetHintKm;
    if (this.fallbackOffsetKm !== null && Number.isFinite(this.fallbackOffsetKm)) return this.fallbackOffsetKm;
    return 0;
  }

  /** Build or re-snap the instant 3D hero landmark & skyline mesh for a region. */
  private ensureHeroCity(region: PilotRegion, offsetKm: number, radiusKm: number): void {
    const spec = HERO_BUILDERS[region.name];
    if (!spec) return;
    const now = performance.now();
    const existing = this.heroCities.get(region.name);
    const curElevKm = this.dataGroundKm?.(spec.lat, spec.lon) ?? 0;
    if (existing) {
      // Periodically check if DEM refined since initial frame-0 build; if elevation changed > 2m, re-snap once
      if (
        now - this.lastHeroCheckMs > 1200 &&
        (Math.abs(curElevKm - existing.builtElevKm) > 0.002 ||
          Math.abs(offsetKm - existing.builtOffsetKm) > 0.004 ||
          Math.abs(radiusKm - existing.builtRadiusKm) > 0.5)
      ) {
        this.lastHeroCheckMs = now;
        existing.mesh.geometry.dispose();
        existing.mesh.removeFromParent();
        this.heroCities.delete(region.name);
      } else {
        existing.mesh.visible = true;
        return;
      }
    }
    this.lastHeroCheckMs = now;
    // Proactively ensure DEM tightly around the hero anchor (+/-0.03 deg = <=9 tiles, never 256!)
    void this.prepareGround?.(spec.lat - 0.03, spec.lon - 0.03, spec.lat + 0.03, spec.lon + 0.03);
    const builder = new CityMeshBuilder(
      spec.lat,
      spec.lon,
      curElevKm,
      offsetKm,
      radiusKm,
      (la, lo) => this.dataGroundKm?.(la, lo) ?? 0,
    );
    spec.build(builder);
    const mesh = builder.finalize(this.material, `hero_city_${region.name.toLowerCase().replace(/\s+/g, '_')}`);
    if (!mesh) return;
    this.group.add(mesh);
    this.heroCities.set(region.name, {
      regionName: region.name,
      mesh,
      anchorLat: spec.lat,
      anchorLon: spec.lon,
      builtElevKm: curElevKm,
      builtOffsetKm: offsetKm,
      builtRadiusKm: radiusKm,
    });
  }

  /** Pre-warm OpenFreeMap TileJSON and center building cell for an upcoming landmark arrival. */
  public prefetch(lat: number, lon: number): void {
    if (this.disposed || typeof window === 'undefined' || typeof fetch !== 'function') return;
    if (PhotorealEarth.current?.showing) return;
    const region = ProceduralCity.regionAt(lat, lon) ?? GLOBAL_REGION;
    const ci = tileY(lat);
    const cj = tileX(lon);
    const key = `${ci}:${cj}`;
    let cell = this.cells.get(key);
    if (!cell) {
      cell = { key, mesh: null, loading: false, lastUsed: performance.now(), offsetKm: 0 };
      this.cells.set(key, cell);
    }
    if (!cell.mesh && !cell.loading && this.inFlightCount < MAX_CONCURRENT_CELLS) {
      cell.loading = true;
      void this.loadCell(cell, cj, ci, region);
    }
  }

  /**
   * Per frame. Renders instant 3D iconic landmarks + streams OSM building cells around the camera
   * globally anywhere on Earth when PhotorealEarth is absent (or in non-photoreal pilot regions).
   */
  public update(surface: THREE.Object3D, cameraWorld: THREE.Vector3, lat: number, lon: number, altKm: number, kmPerUnit: number): void {
    if (this.group.parent !== surface) surface.add(this.group);
    const pilotRegion = ProceduralCity.regionAt(lat, lon);
    const photorealActive = Boolean(PhotorealEarth.current?.showing);
    const region = pilotRegion ?? (!photorealActive ? GLOBAL_REGION : null);
    const suppressedByPhotoreal = Boolean(photorealActive && region?.photorealFallbackOnly);
    const on = Boolean(region) && !suppressedByPhotoreal && altKm < 16;
    this.group.visible = on;
    // Render coordinates: the camera is at the origin for the draw (floating origin)
    this.earthCentre.value.setFromMatrixPosition(surface.matrixWorld).sub(cameraWorld);
    this.kmPerUnit.value = kmPerUnit;
    this.camAltKm.value = Math.max(0, altKm);
    if (!on || !region) return;

    const radiusKm = this.activeRadiusKm();
    const offsetKm = this.resolvedOffsetKm();

    // Hide hero meshes from distant regions, show & snap current region's hero skyline/landmarks instantly
    for (const [rName, hero] of this.heroCities) {
      hero.mesh.visible = Boolean(pilotRegion) && rName === pilotRegion!.name;
    }
    if (pilotRegion) this.ensureHeroCity(pilotRegion, offsetKm, radiusKm);

    // Stream detailed OSM vector building cells globally below 8 km altitude (center-first, up to 4 concurrent)
    if (altKm >= 8) return;
    const now = performance.now();
    const ci = tileY(lat);
    const cj = tileX(lon);
    const ring: Array<{ di: number; dj: number; d2: number }> = [];
    const span = altKm < 2.5 ? 2 : 1;
    for (let di = -span; di <= span; di++) {
      for (let dj = -span; dj <= span; dj++) {
        ring.push({ di, dj, d2: di * di + dj * dj });
      }
    }
    ring.sort((a, b) => a.d2 - b.d2);
    for (const { di, dj } of ring) {
      const key = `${ci + di}:${cj + dj}`;
      let cell = this.cells.get(key);
      if (!cell) {
        cell = { key, mesh: null, loading: false, lastUsed: now, offsetKm: 0 };
        this.cells.set(key, cell);
      }
      cell.lastUsed = now;
      if (cell.mesh && Math.abs(cell.offsetKm - offsetKm) > 0.004) {
        cell.mesh.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        cell.mesh.removeFromParent();
        cell.mesh = null;
      }
      if (
        !cell.mesh &&
        !cell.loading &&
        this.inFlightCount < MAX_CONCURRENT_CELLS &&
        (this.backoffMs === 0 || now - this.lastFetch > this.backoffMs)
      ) {
        this.lastFetch = now;
        cell.loading = true;
        void this.loadCell(cell, cj + dj, ci + di, region);
      }
    }
    for (const [key, cell] of this.cells) {
      if (now - cell.lastUsed > 120000) {
        cell.mesh?.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        cell.mesh?.removeFromParent();
        this.cells.delete(key);
      }
    }
  }

  private resolveTileUrl(): Promise<string | null> {
    if (this.tileUrl) return Promise.resolve(this.tileUrl);
    if (this.tileUrlPromise) return this.tileUrlPromise;
    this.tileUrlPromise = (async () => {
      try {
        const res = await fetch(TILEJSON);
        if (!res.ok) return null;
        const tj = await res.json();
        const url = (tj.tiles?.[0] as string) ?? null;
        if (url) this.tileUrl = url;
        return url;
      } catch {
        return null;
      } finally {
        if (!this.tileUrl) this.tileUrlPromise = null;
      }
    })();
    return this.tileUrlPromise;
  }

  private async loadCell(cell: Cell, tx: number, ty: number, region: PilotRegion): Promise<void> {
    if (this.disposed || typeof window === 'undefined' || typeof fetch !== 'function') {
      cell.loading = false;
      return;
    }
    this.inFlightCount++;
    const south = tileLat(ty + 1);
    const north = tileLat(ty);
    const west = tileLon(tx);
    const east = tileLon(tx + 1);
    const abort = new AbortController();
    this.aborts.add(abort);
    const timer = setTimeout(() => abort.abort(), 14000);
    try {
      const tileTemplate = await this.resolveTileUrl();
      if (!tileTemplate || this.disposed) return;
      const res = await fetch(
        tileTemplate.replace('{z}', String(Z)).replace('{x}', String(tx)).replace('{y}', String(ty)),
        { signal: abort.signal },
      );
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          this.backoffMs = Math.min(20000, Math.max(800, this.backoffMs * 2));
        }
        throw new Error(String(res.status));
      }
      this.backoffMs = 0;
      const buf = await res.arrayBuffer();
      if (this.disposed) return;
      const vt = new VectorTile(new Pbf(new Uint8Array(buf)));
      const layer = vt.layers.building;
      const prints: Footprint[] = [];
      if (layer) {
        for (let i = 0; i < layer.length; i++) {
          if (i % 150 === 0) {
            await this.pace();
            if (this.disposed) return;
          }
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
            const firstLat = outer[0][1];
            const firstLon = outer[0][0];
            if (inHeroExclusion(firstLat, firstLon)) continue;
            const defaultH = region.style === 'haussmann'
              ? 18 + hash(i + tx * 7 + ty * 13) * 10
              : region.style === 'modern'
                ? 14 + hash(i + tx * 7 + ty * 13) * 28
                : 6 + hash(i + tx * 7 + ty * 13) * 9;
            prints.push({
              ring: outer.map(([lo, la]) => ({ lat: la, lon: lo })),
              holes: poly.slice(1).filter((r) => r.length >= 4).map((r) => r.map(([lo, la]) => ({ lat: la, lon: lo }))),
              colour: typeof props.colour === 'string' ? props.colour : undefined,
              heightM: Number.isFinite(h) && h > 0 ? h : defaultH,
              minM: Number.isFinite(m) && m > 0 ? m : 0,
              id: i + tx * 100003 + ty * 7919,
            });
          }
        }
      }
      const centreLat = (south + north) / 2;
      const centreLon = (west + east) / 2;
      // Only procedurally infill unmapped towns where OSM footprints are sparse (e.g. India)
      if (region.drawGroundOverlay && prints.length < 250) {
        await this.generate(vt, tx, ty, south, west, north, east, prints);
      }
      if (this.disposed) return;
      await this.prepareGround?.(south, west, north, east);
      if (this.disposed) return;

      const photorealActive = Boolean(PhotorealEarth.current?.showing);
      let offsetKm = 0;
      if (photorealActive) {
        const drawn = this.drawnGroundKm?.(centreLat, centreLon) ?? null;
        const data = this.dataGroundKm?.(centreLat, centreLon) ?? 0;
        const off = drawn === null ? null : drawn - data;
        if (off !== null && off > -0.15 && off < 0.12) this.groundOffsetKm = off;
        else if (this.groundOffsetKm === null && this.offsetHintKm !== null && Math.abs(this.offsetHintKm) < 0.15) this.groundOffsetKm = this.offsetHintKm;
        const candidate = this.groundOffsetKm ?? this.fallbackOffsetKm;
        if (candidate === null || !Number.isFinite(candidate)) {
          this.lastFetch = performance.now() - this.backoffMs + 1500;
          return;
        }
        offsetKm = candidate;
      }
      cell.offsetKm = offsetKm;
      const radiusKm = this.activeRadiusKm();

      const turn = this.building.then(async () => {
        if (this.disposed) return { mesh: null, ground: null };
        const mesh = await this.build(prints, region, offsetKm, radiusKm);
        if (this.disposed) {
          mesh?.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
          return { mesh: null, ground: null };
        }
        // Only drape synthetic OSM streets/parks in regions needing them when high-res satellite tiles aren't primary
        const ground = mesh && region.drawGroundOverlay && photorealActive
          ? await this.buildGround(vt, tx, ty, offsetKm, radiusKm)
          : null;
        return { mesh, ground };
      });
      this.building = turn.then(() => undefined, () => undefined);
      const made = await turn;
      if (this.disposed) {
        made.mesh?.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        made.ground?.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
        return;
      }
      cell.mesh = made.mesh;
      if (cell.mesh) {
        const ground = made.ground;
        if (ground) {
          ground.position.sub(cell.mesh.position);
          cell.mesh.add(ground);
        }
        this.group.add(cell.mesh);
      }
    } catch {
      // Network error or abort: hero landmarks remain rendered; OSM cell retries later with backoff
    } finally {
      clearTimeout(timer);
      this.aborts.delete(abort);
      this.inFlightCount = Math.max(0, this.inFlightCount - 1);
      cell.loading = false;
    }
  }

  private async generate(vt: VectorTile, tx: number, ty: number, south: number, west: number, north: number, east: number, prints: Footprint[]): Promise<void> {
    const mPerLat = 111320;
    const mPerLon = 111320 * Math.cos((((south + north) / 2) * Math.PI) / 180);
    const W = (east - west) * mPerLon;
    const H = (north - south) * mPerLat;
    const toM = (lo: number, la: number): [number, number] => [(lo - west) * mPerLon, (la - south) * mPerLat];
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

  private async buildGround(vt: VectorTile, tx: number, ty: number, offsetKm: number, radiusKm: number): Promise<THREE.Mesh | null> {
    const pos: number[] = [];
    const uv: number[] = [];
    const kind: number[] = [];
    const lift = 0.0006;
    const at = (lo: number, la: number): THREE.Vector3 => {
      const [x, y, z] = bodyLatLonToLocal('Earth', la, lo);
      const r = 1 + ((this.dataGroundKm?.(la, lo) ?? 0) + offsetKm + lift) / radiusKm;
      return new THREE.Vector3(x * r, y * r, z * r);
    };
    const push = (p: THREE.Vector3, u: number, v: number, k: number): void => {
      pos.push(p.x, p.y, p.z);
      uv.push(u, v);
      kind.push(k);
    };
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

  private async build(prints: Footprint[], region: PilotRegion, offsetKm: number, radiusKm: number): Promise<THREE.Mesh | null> {
    const pos: number[] = [];
    const nor: number[] = [];
    const col: number[] = [];
    const fac: number[] = [];
    const seed: number[] = [];
    const palette = region.palette.map((c) => new THREE.Color(c).convertSRGBToLinear());
    const zincRoof = srgb('#4b5664');
    const offset = offsetKm;
    const local = (lat: number, lon: number, hKm: number): THREE.Vector3 => {
      const [x, y, z] = bodyLatLonToLocal('Earth', lat, lon);
      const r = 1 + hKm / radiusKm;
      return new THREE.Vector3(x * r, y * r, z * r);
    };
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const isIndia = region.name === 'India';
    const isHaussmann = region.style === 'haussmann';
    const isModern = region.style === 'modern';

    for (const w of prints) {
      await this.pace();
      const g = w.ring;
      const heightM = w.heightM;
      const lat0 = g[0].lat;
      const lon0 = g[0].lon;
      const ground = (this.dataGroundKm?.(lat0, lon0) ?? 0) + offset + w.minM / 1000;
      const top = ground - w.minM / 1000 + heightM / 1000;
      let c = palette[Math.floor(hash(w.id * 3.1) * palette.length)];
      const named = readColour(w.colour);
      if (named) c = named;
      const s = hash(w.id * 7.7);
      const useGlass = isModern && heightM >= 36;
      const roofCol = isHaussmann ? zincRoof : c;

      const mPerLat = 111320;
      const mPerLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
      const toM = (p: { lat: number; lon: number }): THREE.Vector2 => new THREE.Vector2((p.lon - lon0) * mPerLon, (p.lat - lat0) * mPerLat);
      const ring = g.slice(0, -1).map(toM);
      if (ring.length < 3) continue;
      if (THREE.ShapeUtils.isClockWise(ring)) ring.reverse();
      const holes = (w.holes ?? [])
        .map((h) => h.slice(0, -1).map(toM))
        .filter((h) => h.length >= 3)
        .map((h) => (THREE.ShapeUtils.isClockWise(h) ? h : h.reverse()));
      const toLL = (v: THREE.Vector2): { lat: number; lon: number } => ({ lat: lat0 + v.y / mPerLat, lon: lon0 + v.x / mPerLon });

      const wall = (loop: THREE.Vector2[], baseKm: number, topKm: number, colour: THREE.Color, facadeH: number): void => {
        const pts = loop.map(toLL);
        let along = 0;
        const fBase = facadeH < 0 ? facadeH : useGlass ? FACADE_GLASS_OFFSET : 0;
        const fTop = facadeH < 0 ? facadeH : useGlass ? FACADE_GLASS_OFFSET + facadeH : facadeH;
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
          const fv = [fBase, fBase, fTop, fBase, fTop, fTop];
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

      const flat = [ring, ...holes].flat();
      let tris: number[][];
      try {
        tris = THREE.ShapeUtils.triangulateShape(ring, holes);
      } catch {
        continue;
      }
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
          col.push(roofCol.r * 0.9, roofCol.g * 0.9, roofCol.b * 0.9);
          fac.push(0, FACADE_ROOF);
          seed.push(s);
        }
      }
      if (isIndia && bestC && heightM < 40 && best > 25) {
        const box = (cx: number, cy: number, wM: number, dM: number, hM: number, colour: THREE.Color): void => {
          const ang = Math.atan2(ring[1].y - ring[0].y, ring[1].x - ring[0].x);
          const ca = Math.cos(ang), sa = Math.sin(ang);
          const corner = (u: number, v: number): THREE.Vector2 => new THREE.Vector2(cx + u * ca - v * sa, cy + u * sa + v * ca);
          const loop = [corner(-wM / 2, -dM / 2), corner(wM / 2, -dM / 2), corner(wM / 2, dM / 2), corner(-wM / 2, dM / 2)];
          wall(loop, top - 0.0002, top + hM / 1000, colour, FACADE_ROOF);
          const lid = [0, 1, 2, 0, 2, 3].map((i) => {
            const ll = toLL(loop[i]);
            return local(ll.lat, ll.lon, top + hM / 1000);
          });
          for (const p of lid) {
            pos.push(p.x, p.y, p.z);
            nor.push(upN.x, upN.y, upN.z);
            col.push(colour.r * 0.9, colour.g * 0.9, colour.b * 0.9);
            fac.push(0, FACADE_ROOF);
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
    this.disposed = true;
    for (const a of this.aborts) a.abort();
    this.aborts.clear();
    for (const c of this.cells.values()) {
      c.mesh?.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry?.dispose();
      });
    }
    this.cells.clear();
    for (const hero of this.heroCities.values()) {
      hero.mesh.geometry.dispose();
      hero.mesh.removeFromParent();
    }
    this.heroCities.clear();
    this.group.removeFromParent();
    this.material.dispose();
    this.groundMaterial.dispose();
  }
}
