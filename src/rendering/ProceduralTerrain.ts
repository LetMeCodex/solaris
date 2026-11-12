import * as THREE from 'three';
import { EarthElevation, earthElevation } from '../explorer/Elevation';
import { bodyLatLonToLocal } from '../explorer/TileMath';
import { SUN_WORLD } from './RenderOrigin';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from './AerialPerspective';

/**
 * The whole Earth as real-height procedural terrain, there at once, under Google's 3D tiles.
 *
 * Google's tiles arrive level by level over the network (seconds, on a slow line half a minute),
 * and until they did the ground was a smooth ball at sea level: no Himalaya, no valley, a flat
 * blur. Here the land's true shape is drawn from the open elevation data (Elevation.ts: ~30 m
 * posts, small PNGs from a fast CDN, a handful cover the view) the moment you are there, and its
 * surface is made by rule rather than by photograph: rock on the steep faces with strata, snow
 * above the snow line of that latitude and season on the gentle ground, forest and grass where
 * the satellite map is green, scree and soil between, all with fine detail generated down to the
 * metre and lit by the real Sun and Moon through the same air as the tiles. Google's tiles then
 * load over it (the terrain sits a few metres under their ground, measured: see `setTileOffset`)
 * and where they have no 3D or never arrive, this is the world.
 *
 * Shape: five square patches centred on the camera, each 129 x 129 posts and four times the span
 * of the one inside it (6, 24, 96, 384 and 1,536 km: 47 m posts under you, the horizon from the
 * stratosphere at the edge), each a step lower than the finer one over it so they never fight
 * for depth. A patch is rebuilt, a slice of rows a frame, when the camera has moved an eighth of
 * its span or finer heights have arrived.
 */

const LEVELS: Array<{ spanKm: number; z: number; dropM: number; n: number }> = [
  // The two nearest at 257 posts (23 m and 94 m apart: the height data's own ~13-19 m at
  // z13), the rest at 129
  { spanKm: 6, z: 13, dropM: 0, n: 257 },
  { spanKm: 24, z: 12, dropM: 12, n: 257 },
  { spanKm: 96, z: 10, dropM: 50, n: 129 },
  { spanKm: 384, z: 8, dropM: 200, n: 129 },
  { spanKm: 1536, z: 6, dropM: 800, n: 129 },
];
const KM = 1 / 6378.137;
const ROWS_PER_FRAME = 30;

const vertexShader = /* glsl */ `
attribute vec3 aUp;
attribute float aH;
attribute float aShadow;
varying float vShadow;
varying vec3 vWorld;
varying vec3 vN;
varying vec3 vUpW;
varying vec3 vUpL;
varying float vH;
varying vec3 vAxX;
varying vec3 vAxZ;
varying vec2 vMf;
uniform vec2 uOriginM;
void main() {
  // Metres from the patch's own origin (exact in 32 bits, where metres from Earth's centre are
  // only good to ~0.6 m): the fine detail is laid out on these
  vMf = position.xz * 6.378137e6 + uOriginM;
  vAxX = normalize(mat3(modelMatrix) * vec3(1.0, 0.0, 0.0));
  vAxZ = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vUpW = normalize(mat3(modelMatrix) * aUp);
  vUpL = aUp;
  vH = aH;
  vShadow = aShadow;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uSunWorld;
uniform sampler2D uDayMap;
uniform float uHasMap;
uniform float uKmPerUnit;
uniform float uCamAltKm;
uniform float uHaze;
uniform float uDoy;
uniform float uFade;
uniform float uTime;
uniform vec3 uHoleC;
uniform vec3 uHoleE;
uniform vec3 uHoleN;
uniform float uHoleHalf;
varying vec3 vWorld;
varying vec3 vN;
varying vec3 vUpW;
varying vec3 vUpL;
varying float vH;
varying vec3 vAxX;
varying vec3 vAxZ;
varying vec2 vMf;
varying float vShadow;
${AERIAL_PERSPECTIVE_GLSL}

float tHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 tGrad(vec2 p) { float a = 6.2831853 * tHash(p); return vec2(cos(a), sin(a)); }
// Gradient noise, -0.5..0.5, smooth (no square cells showing through, as value noise did)
float tGn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(tGrad(i), f);
  float b = dot(tGrad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(tGrad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(tGrad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.7;
}
float tNoise(vec2 p) { return tGn(p) + 0.5; }
// Detail at a wavelength (metres), faded out before it is finer than a pixel (no shimmer)
float tDetail(vec2 m, float waveM, float pxM) {
  return tGn(m / waveM) * (1.0 - smoothstep(0.35, 1.0, pxM / waveM));
}
// Rock relief: ridged (sharp crests, rounded hollows) at the larger scales, plain below
float tRidge(vec2 m, float waveM, float pxM) {
  return (0.25 - abs(tGn(m / waveM))) * 2.0 * (1.0 - smoothstep(0.35, 1.0, pxM / waveM));
}
float tFbm(vec2 m, vec2 mf, float pxM) {
  return tRidge(m, 700.0, pxM) * 0.5 + tRidge(m * 1.07 + 31.0, 190.0, pxM) * 0.32 + tDetail(mf * 0.93 - 17.0, 48.0, pxM) * 0.22
       + tDetail(mf + 5.0, 12.0, pxM) * 0.12 + tDetail(mf - 9.0, 3.1, pxM) * 0.07;
}

void main() {
  vec3 upW = normalize(vUpW);
  vec3 nl = normalize(vUpL);
  // Where the finer patch inside this one is drawn, this one is not (smoother, it would stand
  // over the finer one's valleys)
  vec3 hd = nl - uHoleC;
  if (uHoleHalf > 0.0 && abs(dot(hd, uHoleE)) < uHoleHalf && abs(dot(hd, uHoleN)) < uHoleHalf) discard;
  float latDeg = degrees(asin(clamp(nl.y, -1.0, 1.0)));
  float absLat = abs(latDeg);
  vec2 uvG = vec2(fract(atan(nl.z, -nl.x) / 6.2831853), 1.0 - acos(clamp(nl.y, -1.0, 1.0)) / 3.14159265);
  // Metres on the ground (east, north-ish), for the generated detail
  vec2 m = nl.xz * 6.378137e6;
  vec2 mf = vMf;
  float pxM = max(length(fwidth(mf)), 0.01);
  float hKm = vH;
  if (vH < 0.0004) {
    // The sea, made here too: deep water under the sky's reflection, swell and wind ripples, the
    // Sun's (and Moon's) glitter path, paler over the shallows by the shore
    vec3 sunDirS = normalize(uSunWorld - vWorld);
    float sunUpS = dot(upW, sunDirS);
    float dayS = smoothstep(-0.10, 0.16, sunUpS);
    vec3 Vs = normalize(cameraPosition - vWorld);
    float t = uTime;
    vec2 sl = vec2(0.0);
    sl += vec2(0.8, 0.3) * cos(dot(m, vec2(0.011, 0.004)) + t * 1.3) * (1.0 - smoothstep(60.0, 400.0, pxM));
    sl += vec2(-0.3, 0.9) * cos(dot(m, vec2(-0.006, 0.017)) + t * 1.7) * (1.0 - smoothstep(60.0, 400.0, pxM));
    sl += vec2(0.5, -0.6) * cos(dot(m, vec2(0.031, -0.022)) + t * 2.6) * 0.5 * (1.0 - smoothstep(20.0, 150.0, pxM));
    sl += (vec2(tNoise(mf / 7.0 + t * 0.4), tNoise(mf / 7.0 - t * 0.35 + 9.0)) - 0.5) * 1.4 * (1.0 - smoothstep(1.0, 8.0, pxM));
    vec3 Nw = normalize(upW + 0.05 * (normalize(vAxX) * sl.x + normalize(vAxZ) * sl.y));
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(Nw, Vs), 0.0), 5.0);
    float shallow = smoothstep(0.0004, 0.0, vH) ;
    vec3 deep = mix(vec3(0.03, 0.16, 0.20), vec3(0.008, 0.045, 0.10), shallow);
    vec3 skyRef = apSky(sunUpS) * (0.25 + 0.75 * dayS) + uNightAir;
    vec3 sunColS = mix(vec3(1.0, 0.62, 0.38), vec3(1.0, 0.96, 0.9), smoothstep(0.02, 0.32, sunUpS));
    vec3 wcol = mix(deep * (0.15 + 0.85 * dayS), skyRef, fres);
    float gl = max(dot(Nw, normalize(Vs + sunDirS)), 0.0);
    wcol += sunColS * (pow(gl, 260.0) * 9.0 + pow(gl, 40.0) * 0.25) * dayS;
    float gm = max(dot(Nw, normalize(Vs + uMoonDir)), 0.0);
    wcol += uMoonLight * (pow(gm, 220.0) * 6.0 + pow(gm, 30.0) * 0.12) * (1.0 - dayS);
    float dKm = length(cameraPosition - vWorld) * uKmPerUnit;
    wcol = aerialPerspective(wcol, dKm, max(0.0, uCamAltKm * 0.5), uHaze, Vs, sunDirS, sunUpS);
    gl_FragColor = vec4(max(wcol, vec3(0.0)), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    return;
  }

  // Fine relief: the data's posts are 47 m apart at best; rills, ledges and boulders are made
  // between them, tilting the surface (so they catch the light) more on steep ground
  vec3 N = normalize(vN);
  float e = max(pxM, 1.5);
  float f0 = tFbm(m, mf, pxM);
  float fx = tFbm(m + vec2(e, 0.0), mf + vec2(e, 0.0), pxM);
  float fy = tFbm(m + vec2(0.0, e), mf + vec2(0.0, e), pxM);
  float slope0 = 1.0 - clamp(dot(N, upW), 0.0, 1.0);
  // The detail's two axes (the body's X and Z, as m is laid out) in the world
  vec3 tilt = (normalize(vAxX) * (fx - f0) + normalize(vAxZ) * (fy - f0)) / e;
  tilt -= upW * dot(tilt, upW);
  float rough = mix(18.0, 120.0, smoothstep(0.08, 0.4, slope0));
  N = normalize(N - tilt * rough);
  // Erosion: gullies and spurs running down the fall line of every slope (noise stretched along
  // the way water runs), cut into the surface: the knife ridges and fluted faces of real
  // mountains, which posts 47 m apart cannot hold
  vec3 fall = -upW + N * dot(N, upW);
  float fl = length(fall);
  float gully = 0.0;
  if (fl > 0.03) {
    fall /= fl;
    vec2 d2 = normalize(vec2(dot(fall, normalize(vAxX)), dot(fall, normalize(vAxZ))) + 1e-5);
    vec2 pq = vec2(dot(m, vec2(-d2.y, d2.x)), dot(m, d2));
    float w1 = 1.0 - smoothstep(0.3, 1.0, pxM / 70.0);
    float w2 = 1.0 - smoothstep(0.3, 1.0, pxM / 18.0);
    float g1 = abs(tGn(vec2(pq.x / 150.0, pq.y / 1400.0))) * 2.8;
    float g1x = abs(tGn(vec2((pq.x + 4.0) / 150.0, pq.y / 1400.0))) * 2.8;
    float g2 = abs(tGn(vec2(pq.x / 38.0 + 7.0, pq.y / 420.0))) * 2.8;
    float g2x = abs(tGn(vec2((pq.x + 1.5) / 38.0 + 7.0, pq.y / 420.0))) * 2.8;
    float amt = smoothstep(0.03, 0.22, slope0);
    vec3 side = normalize(cross(upW, fall));
    N = normalize(N - side * ((g1x - g1) / 4.0 * 60.0 * w1 + (g2x - g2) / 1.5 * 14.0 * w2) * amt);
    gully = ((1.0 - g1) * w1 * 0.6 + (1.0 - g2) * w2 * 0.4) * amt;
  }
  float slope = 1.0 - clamp(dot(N, upW), 0.0, 1.0);

  // What the satellite sees there: the colour of the land from orbit (deserts, forests, fields)
  vec3 sat = uHasMap > 0.5 ? texture2D(uDayMap, uvG).rgb : vec3(0.32, 0.36, 0.24);
  float satLum = dot(sat, vec3(0.2126, 0.7152, 0.0722));
  float green = smoothstep(-0.01, 0.06, sat.g - max(sat.r, sat.b) * 0.96);
  float arid = smoothstep(0.02, 0.12, sat.r - sat.b) * (1.0 - green);

  // Tree line and snow line by latitude and season (as on the tiles)
  float winterN = cos(6.2831853 * (uDoy - 15.0) / 365.25);
  float winterHere = latDeg >= 0.0 ? winterN : -winterN;
  // Measured tree lines: ~3.9 km in the tropics and the Himalaya (~30 deg), ~2.0 km in the Alps
  // (46 deg), ~1.0 km at 60 deg, sea level in the Arctic; summer snow lines ~1.1 km above them
  float treeLine = mix(3.9, 0.15, smoothstep(24.0, 72.0, absLat));
  float summerLine = treeLine + mix(1.2, 0.8, smoothstep(30.0, 70.0, absLat));
  float snowLine = summerLine - 1.1 * max(winterHere, 0.0);
  float big = tNoise(m / 2600.0) * 0.6 + tNoise(m / 640.0) * 0.4;
  float hN = hKm + (big - 0.5) * 0.45 + f0 * 0.12;
  float aboveTreesR = smoothstep(treeLine + 0.1, treeLine + 0.7, hN);

  // Rock: grey-brown, banded in strata along the height, darker in the gullies
  float strata = tNoise(vec2(hKm * 95.0 + big * 3.0, dot(m, vec2(0.0007, 0.0004))));
  vec3 rockA = mix(vec3(0.24, 0.23, 0.22), vec3(0.42, 0.40, 0.37), strata);
  vec3 rock = mix(rockA, vec3(0.55, 0.43, 0.31), arid * 0.7) * (0.82 + 0.5 * f0 + 0.25 * tDetail(mf, 4.0, pxM));
  // Soil, scree and alpine grass between the forest and the rock
  vec3 scree = mix(vec3(0.42, 0.38, 0.31), vec3(0.50, 0.47, 0.34), tNoise(m / 130.0));
  vec3 grass = mix(vec3(0.20, 0.27, 0.10), vec3(0.34, 0.36, 0.15), tNoise(m / 320.0) * 0.7 + f0);
  // Grass dries to straw in the cold season and high up (the Himalaya's brown autumn slopes)
  float dry = clamp(max(winterHere, 0.0) * 0.9 + smoothstep(2.4, 4.2, hKm) * 0.7 + arid * 0.6, 0.0, 1.0);
  grass = mix(grass, mix(vec3(0.40, 0.33, 0.21), vec3(0.50, 0.43, 0.29), tNoise(m / 260.0)), dry);
  // Conifer forest: very dark green, mottled by crowns and gaps at every scale
  vec3 forest = mix(vec3(0.030, 0.062, 0.030), vec3(0.075, 0.12, 0.05), tNoise(m / 85.0)) * (0.75 + 0.6 * tDetail(mf, 24.0, pxM) + 0.9 * tDetail(mf, 7.0, pxM));
  // The lowlands keep the satellite's own colour (fields, plains, desert), with generated texture
  vec3 low = sat * (0.86 + 0.5 * f0 + 0.2 * tDetail(m, 30.0, pxM));

  // Bare rock on faces steeper than ~40-50 degrees (forest and grass hold below that), and above
  // the vegetation everywhere but the gentlest ground
  float steep = max(smoothstep(0.20, 0.34, slope + f0 * 0.12 + gully * 0.06), smoothstep(0.3, 0.8, aboveTreesR) * smoothstep(0.06, 0.18, slope + f0 * 0.1));
  float aboveTrees = smoothstep(treeLine - 0.25, treeLine + 0.25, hN);
  // Forest: in the mountains below the tree line wherever it is not dry country and not a cliff
  // (patchy towards the line, clearings and meadows elsewhere); in the lowlands where the satellite
  // sees green
  float humid = 1.0 - arid;
  float clumps = smoothstep(0.22, 0.5, big + tGn(m / 300.0) * 0.5 + (1.0 - aboveTrees) * 0.3);
  float woodedM = humid * (1.0 - aboveTrees) * (1.0 - smoothstep(0.22, 0.34, slope + f0 * 0.1)) * clumps;
  float woodedL = green * (1.0 - smoothstep(0.22, 0.5, slope)) * smoothstep(0.35, 0.6, big + green * 0.4);
  float mountainW = smoothstep(0.035, 0.14, slope0) + smoothstep(0.8, 1.6, hKm);
  float wooded = mix(woodedL, max(woodedL, woodedM), clamp(mountainW, 0.0, 1.0));
  float mountain = smoothstep(0.035, 0.14, slope0) + smoothstep(1.2, 2.6, hKm);
  mountain = clamp(mountain, 0.0, 1.0);
  vec3 ground = mix(mix(grass, scree, aboveTrees * 0.8 + arid * 0.6), low, 0.45 + 0.4 * (1.0 - mountain));
  ground = mix(low, ground, mountain);
  vec3 alb = mix(ground, forest, wooded * (0.55 + 0.45 * mountain));
  alb = mix(alb, rock, steep * (0.35 + 0.65 * mountain));
  alb *= 1.0 - 0.45 * gully * gully * steep - 0.15 * gully;
  // Close to: single trees (a crown in each ~9 m cell, lit on its sunward side)
  float nearTrees = wooded * (1.0 - smoothstep(0.6, 2.5, pxM));
  if (nearTrees > 0.01) {
    vec2 tc = mf / 9.0;
    vec2 ti = floor(tc);
    vec2 tf = fract(tc) - 0.5 - (vec2(tHash(ti + 3.1), tHash(ti + 8.7)) - 0.5) * 0.6;
    float crown = smoothstep(0.42, 0.12, length(tf)) * step(0.25, tHash(ti + 1.7));
    vec3 treeCol = mix(vec3(0.03, 0.075, 0.03), vec3(0.11, 0.2, 0.07), tHash(ti + 5.5)) * (0.7 + 0.9 * clamp(0.5 - tf.y - tf.x, 0.0, 1.0));
    alb = mix(alb, mix(alb * 0.45, treeCol, crown), nearTrees);
  }
  // Snow: on the gentle ground above the line, caught on ledges of the steep faces
  float snow = smoothstep(snowLine - 0.25, snowLine + 0.35, hN) * (1.0 - smoothstep(0.10, 0.30, slope + f0 * 0.25));
  // A first dusting below the line in the cold season, on the gentlest ground
  snow = max(snow, smoothstep(snowLine - 0.9, snowLine - 0.2, hN) * (1.0 - smoothstep(0.04, 0.16, slope + f0 * 0.2)) * max(winterHere, 0.0) * 0.8);
  snow = max(snow, smoothstep(snowLine + 1.2, snowLine + 2.0, hN) * (1.0 - smoothstep(0.22, 0.48, slope + f0 * 0.25)) * 0.85);
  alb = mix(alb, vec3(0.86, 0.89, 0.94) * (0.94 + 0.2 * f0), snow);

  // Light: the real Sun, the sky's own light on what faces up, the Moon by night
  vec3 sunDir = normalize(uSunWorld - vWorld);
  float sunUp = dot(upW, sunDir);
  float day = smoothstep(-0.10, 0.16, sunUp);
  vec3 sunCol = mix(vec3(1.0, 0.62, 0.38), vec3(1.0, 0.96, 0.9), smoothstep(0.02, 0.32, sunUp));
  float ndl = max(dot(N, sunDir), 0.0);
  // Ridges shade the slopes behind them: the data's own normal turned from the Sun darkens more
  float shade = smoothstep(-0.08, 0.2, dot(normalize(vN), sunDir)) * vShadow;
  vec3 skyAmb = mix(vec3(0.16, 0.22, 0.38), vec3(0.30, 0.27, 0.30), 1.0 - smoothstep(0.0, 0.3, sunUp)) * (0.5 + 0.5 * dot(N, upW)) * (1.0 - 0.35 * gully);
  vec3 night = vec3(0.085, 0.1, 0.155) + uMoonLight * (smoothstep(-0.04, 0.2, dot(upW, uMoonDir)) * (0.4 + 0.6 * max(dot(N, uMoonDir), 0.0)));
  vec3 lit = (sunCol * ndl * shade * 1.45 + skyAmb * 0.55) * day + night * (1.0 - day);
  vec3 col = alb * lit;
  // Snow glints towards a low Sun
  vec3 V = normalize(cameraPosition - vWorld);
  col += sunCol * pow(max(dot(N, normalize(V + sunDir)), 0.0), 60.0) * snow * 0.35 * day * shade;

  float distKm = length(cameraPosition - vWorld) * uKmPerUnit;
  float hMean = max(0.0, (uCamAltKm + hKm) * 0.5);
  col = aerialPerspective(col, distKm, hMean, uHaze, V, sunDir, sunUp);
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.18);
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

interface Patch {
  mesh: THREE.Mesh;
  pos: Float32Array;
  up: Float32Array;
  h: Float32Array;
  /** Where the drawn patch is centred, and where the one being built is. */
  lat: number;
  lon: number;
  build: { lat: number; lon: number; row: number; srow: number; origin: THREE.Vector3; pos: Float32Array; up: Float32Array; h: Float32Array; sh: Float32Array; version: number } | null;
  builtVersion: number;
  built: boolean;
  scratch?: { pos: Float32Array; up: Float32Array; h: Float32Array; sh: Float32Array };
}

export class ProceduralTerrain {
  public readonly group = new THREE.Group();
  private readonly material: THREE.ShaderMaterial;
  private readonly patches: Patch[] = [];
  private asked = { lat: 999, lon: 999, t: 0 };
  /** Per patch: bumped when new heights for it arrive (or the light or the offset changes). */
  private readonly levelVersion = LEVELS.map(() => 0);
  private readonly levelSeen = LEVELS.map(() => -1);
  private readonly builtAt = LEVELS.map(() => 0);

  /** The drawn ground against the height data, km (NaN until the first frame). */
  public get surfaceOffsetKm(): number {
    return this.appliedOffsetKm;
  }

  private bumpAll(): void {
    for (let i = 0; i < this.levelVersion.length; i++) this.levelVersion[i]++;
  }
  /** Tiles' ground minus the height data's, km (the geoid, tens of metres), measured under the jet. */
  private tileOffsetKm: number | null = null;
  private appliedOffsetKm = Number.NaN;
  /** Towards the Sun in Earth's own frame (set each frame by the scene). */
  private readonly sunLocal = new THREE.Vector3(1, 0, 0);
  private readonly sunAtBuild = new THREE.Vector3(1, 0, 0);

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uSunWorld: SUN_WORLD,
        uDayMap: { value: null },
        uHasMap: { value: 0 },
        uKmPerUnit: { value: 1 },
        uCamAltKm: { value: 1 },
        uHaze: { value: 1 },
        uDoy: { value: 172 },
        uFade: { value: 1 },
        uTime: { value: 0 },
        uOriginM: { value: new THREE.Vector2() },
        uHoleC: { value: new THREE.Vector3() },
        uHoleE: { value: new THREE.Vector3(1, 0, 0) },
        uHoleN: { value: new THREE.Vector3(0, 1, 0) },
        uHoleHalf: { value: 0 },
        uNightAir: NIGHT_AIR,
        uMoonLight: MOON_LIGHT,
        uMoonDir: MOON_DIR,
      },
      vertexShader,
      fragmentShader,
      // Drawn after the tiles and only where there is no tile: Google's tiles mark their pixels
      // with alpha 0 (PhotorealEarth) and this blends by the alpha already there, so the terrain
      // can never cover a tile, however the two heights differ; the globe and the sky are alpha 1
      transparent: true,
      depthWrite: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.DstAlphaFactor,
      blendDst: THREE.OneMinusDstAlphaFactor,
      blendSrcAlpha: THREE.DstAlphaFactor,
      blendDstAlpha: THREE.OneMinusDstAlphaFactor,
    });
    const indexFor = (N: number): THREE.BufferAttribute => {
      const index = new Uint32Array((N - 1) * (N - 1) * 6);
      let q = 0;
      for (let j = 0; j < N - 1; j++) {
        for (let i = 0; i < N - 1; i++) {
          const a = j * N + i;
          index[q++] = a; index[q++] = a + N; index[q++] = a + 1;
          index[q++] = a + 1; index[q++] = a + N; index[q++] = a + N + 1;
        }
      }
      return new THREE.BufferAttribute(index, 1);
    };
    for (let l = 0; l < LEVELS.length; l++) {
      const N = LEVELS[l].n;
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(N * N * 3);
      const up = new Float32Array(N * N * 3);
      const h = new Float32Array(N * N);
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(N * N * 3), 3));
      g.setAttribute('aUp', new THREE.BufferAttribute(up, 3));
      g.setAttribute('aH', new THREE.BufferAttribute(h, 1));
      g.setAttribute('aShadow', new THREE.BufferAttribute(new Float32Array(N * N).fill(1), 1));
      g.setIndex(indexFor(N));
      const mesh = new THREE.Mesh(g, this.material);
      mesh.frustumCulled = false;
      mesh.visible = false;
      mesh.name = `procedural_terrain_${l}`;
      // The finest first: the coarser ones are mostly hidden behind it
      mesh.renderOrder = -30 + l * 0.001;
      const level = l;
      mesh.onBeforeRender = () => this.setHole(level);
      this.group.add(mesh);
      this.patches.push({ mesh, pos, up, h, lat: 999, lon: 999, build: null, builtVersion: -1, built: false });
    }
    this.group.name = 'procedural_terrain';
    this.group.visible = false;
  }

  private readonly holeTmp = new THREE.Vector3();

  /** The finer patch inside patch `l` (its centre and half-width on the unit sphere), if drawn. */
  private setHole(l: number): void {
    const u = this.material.uniforms;
    const o = this.patches[l].mesh.position;
    (u.uOriginM.value as THREE.Vector2).set((o.x * 6378137) % 1024, (o.z * 6378137) % 1024);
    const inner = l > 0 ? this.patches[l - 1] : null;
    if (!inner || !inner.built || !inner.mesh.visible) {
      u.uHoleHalf.value = 0;
    } else {
      const c = (u.uHoleC.value as THREE.Vector3).copy(inner.mesh.position).normalize();
      const e = (u.uHoleE.value as THREE.Vector3).crossVectors(this.holeTmp.set(0, 1, 0), c).normalize();
      (u.uHoleN.value as THREE.Vector3).crossVectors(c, e).normalize();
      u.uHoleHalf.value = LEVELS[l - 1].spanKm * 0.47 * KM;
    }
    this.material.uniformsNeedUpdate = true;
  }

  /** Hang it under Earth's surface mesh (the unit sphere the tiles and the globe share). */
  public attach(surface: THREE.Object3D): void {
    if (this.group.parent !== surface) surface.add(this.group);
  }

  public setMaps(day: THREE.Texture | null): void {
    this.material.uniforms.uDayMap.value = day;
    this.material.uniforms.uHasMap.value = day ? 1 : 0;
  }

  /** The tiles' ground minus the height data's under the jet, km, when it has been measured. */
  public setTileOffset(km: number | null): void {
    if (km !== null && Number.isFinite(km) && Math.abs(km) < 0.25) this.tileOffsetKm = this.tileOffsetKm === null ? km : this.tileOffsetKm + (km - this.tileOffsetKm) * 0.05;
  }

  /**
   * Per frame. `lat`/`lon`: under the camera; `altKm`: its height; `air`: the tiles' air (so the
   * two match); `doy`: day of the year.
   */
  public update(on: boolean, lat: number, lon: number, altKm: number, air: { kmPerUnit: number; camAltKm: number; haze: number }, doy: number, sunLocal?: THREE.Vector3): void {
    this.group.visible = on;
    if (!on) return;
    if (sunLocal) {
      this.sunLocal.copy(sunLocal).normalize();
      // The shadows are worked out again once the Sun has moved half a degree
      if (this.sunLocal.angleTo(this.sunAtBuild) > 0.009) {
        this.sunAtBuild.copy(this.sunLocal);
        this.bumpAll();
      }
    }
    const u = this.material.uniforms;
    u.uKmPerUnit.value = air.kmPerUnit;
    u.uCamAltKm.value = air.camAltKm;
    u.uHaze.value = air.haze;
    u.uDoy.value = doy;
    u.uTime.value = (performance.now() / 1000) % 3600;
    // Under the tiles' ground: 6 m once the offset between the two is measured, till then a safe
    // 110 m (the geoid is up to ~100 m from the ellipsoid the tiles stand on)
    const offsetKm = this.tileOffsetKm !== null ? this.tileOffsetKm - 0.006 : -0.11;
    if (Number.isNaN(this.appliedOffsetKm) || Math.abs(offsetKm - this.appliedOffsetKm) > 0.004) {
      this.appliedOffsetKm = offsetKm;
      this.bumpAll();
    }

    // The heights the patches need, asked for when the camera has moved on
    const now = performance.now();
    if (now - this.asked.t > 700 && (Math.abs(lat - this.asked.lat) > 0.004 || Math.abs(lon - this.asked.lon) > 0.004 || now - this.asked.t > 6000)) {
      this.asked = { lat, lon, t: now };
      const cosLat = Math.max(0.05, Math.cos((lat * Math.PI) / 180));
      for (let li = 0; li < LEVELS.length; li++) {
        const L = LEVELS[li];
        if (L.spanKm < altKm * 0.6) continue;
        const dLat = Math.min(40, (L.spanKm / 2 / 111.2) * 1.05);
        const dLon = Math.min(80, dLat / cosLat);
        void earthElevation.ensure(Math.max(-85, lat - dLat), lon - dLon, Math.min(85, lat + dLat), lon + dLon, L.z).then(() => {
          // Only when new heights have come in (asked again, held ones answer with nothing new)
          if (earthElevation.loadedCount !== this.levelSeen[li]) {
            this.levelSeen[li] = earthElevation.loadedCount;
            this.levelVersion[li]++;
          }
        });
      }
    }

    // Each patch being built gets its share of the frame's work (the finest had it all before,
    // and the coarser ones waited behind it)
    const building = Math.max(1, this.patches.filter((q, i) => q.build || q.builtVersion !== this.levelVersion[i] || !q.built).length);
    EarthElevation.now = performance.now();
    // And no more than ~4 ms of it a frame altogether (it was 15 ms on average, 80 at worst)
    const until = performance.now() + 4;
    for (let l = 0; l < LEVELS.length; l++) {
      let budget = Math.max(2, ROWS_PER_FRAME / building);
      const L = LEVELS[l];
      const N = L.n;
      const p = this.patches[l];
      // From high up the finest patches are a few pixels: not drawn, not built
      const useful = L.spanKm > altKm * 0.6;
      p.mesh.visible = useful && p.built;
      if (!useful) continue;
      const stepDeg = L.spanKm / (N - 1) / 111.2;
      // Snapped to the patch's own posts, so the ground does not swim as the patch follows you
      const snap = stepDeg * 8;
      const cLat = THREE.MathUtils.clamp(Math.round(lat / snap) * snap, -84, 84);
      const cosC = Math.max(0.05, Math.cos((cLat * Math.PI) / 180));
      const snapLon = snap / cosC;
      const cLon = Math.round(lon / snapLon) * snapLon;
      const moved = Math.abs(cLat - p.lat) > snap * 1.5 || Math.abs(cLon - p.lon) > snapLon * 1.5;
      // New heights: built again, but not more than once a second and a half (they arrive a tile
      // at a time)
      const stale = p.builtVersion !== this.levelVersion[l] && now - this.builtAt[l] > 1500;
      if (!p.build && (moved || stale || !p.built)) {
        const [ox, oy, oz] = bodyLatLonToLocal('Earth', cLat, cLon);
        // The working arrays are kept from one build to the next (each was ~0.8 MB of garbage)
        const sc = (p.scratch ??= { pos: new Float32Array(N * N * 3), up: new Float32Array(N * N * 3), h: new Float32Array(N * N), sh: new Float32Array(N * N) });
        p.build = { lat: cLat, lon: cLon, row: 0, srow: 0, origin: new THREE.Vector3(ox, oy, oz), pos: sc.pos, up: sc.up, h: sc.h, sh: sc.sh, version: this.levelVersion[l] };
      }
      const b = p.build;
      if (!b || budget <= 0) continue;
      const cosB = Math.max(0.05, Math.cos((b.lat * Math.PI) / 180));
      const half = (N - 1) / 2;
      const drop = (this.appliedOffsetKm - L.dropM / 1000) * KM;
      while (b.row < N && budget > 0 && performance.now() < until) {
        const j = b.row;
        const la = THREE.MathUtils.clamp(b.lat + (half - j) * stepDeg, -89.9, 89.9);
        for (let i = 0; i < N; i++) {
          const lo = b.lon + ((i - half) * stepDeg) / cosB;
          const hk = earthElevation.heightKm(la, lo, L.z);
          const [x, y, z] = bodyLatLonToLocal('Earth', la, lo);
          const s = 1 + hk * KM + drop;
          const k = (j * N + i) * 3;
          b.pos[k] = x * s - b.origin.x;
          b.pos[k + 1] = y * s - b.origin.y;
          b.pos[k + 2] = z * s - b.origin.z;
          b.up[k] = x;
          b.up[k + 1] = y;
          b.up[k + 2] = z;
          b.h[j * N + i] = hk;
        }
        b.row++;
        budget -= N / 129;
      }
      // Shadows: from each post, a walk towards the Sun over the height data, out to ~12 km at the
      // finest patch (to hundreds at the coarsest): where the ground rises above the line to the
      // Sun the post is in shadow, softened by how far it is from clearing
      const sun = this.sunLocal;
      const postKm = L.spanKm / (N - 1);
      while (b.row >= N && b.srow < N && budget > 0 && performance.now() < until) {
        const j = b.srow;
        const la = THREE.MathUtils.clamp(b.lat + (half - j) * stepDeg, -89.9, 89.9);
        const laR = (la * Math.PI) / 180;
        const cl = Math.cos(laR);
        for (let i = 0; i < N; i++) {
          const lo = b.lon + ((i - half) * stepDeg) / cosB;
          const loR = (lo * Math.PI) / 180;
          // Local frame at the post (as bodyLatLonToLocal lays the sphere out: x, y up, -z)
          const ux = cl * Math.cos(loR), uy = Math.sin(laR), uz = -cl * Math.sin(loR);
          const ex = -Math.sin(loR), ez = -Math.cos(loR);
          const nx = -Math.sin(laR) * Math.cos(loR), ny = cl, nz = Math.sin(laR) * Math.sin(loR);
          const sUp = sun.x * ux + sun.y * uy + sun.z * uz;
          if (sUp <= -0.05) {
            b.sh[j * N + i] = 0;
            continue;
          }
          const sE = sun.x * ex + sun.z * ez;
          const sN = sun.x * nx + sun.y * ny + sun.z * nz;
          const hl = Math.hypot(sE, sN) || 1;
          const tanE = sUp / hl;
          const h0 = b.h[j * N + i];
          let lit = 1;
          let d = postKm * 0.9;
          for (let k = 0; k < 22; k++) {
            const gh = earthElevation.heightKm(la + ((sN / hl) * d) / 111.2, lo + ((sE / hl) * d) / (111.2 * Math.max(0.05, cl)), L.z);
            // How far above the ground the line to the Sun passes there, against the distance
            const clear = (h0 + 0.003 + tanE * d - d * d / 12742 - gh) / d;
            lit = Math.min(lit, THREE.MathUtils.smoothstep(clear, -0.02, 0.025));
            if (lit <= 0) break;
            d *= 1.28;
          }
          b.sh[j * N + i] = lit;
        }
        b.srow++;
        budget -= (3 * N) / 129;
      }
      if (b.row >= N && b.srow >= N) {
        const g = p.mesh.geometry;
        (g.getAttribute('aShadow') as THREE.BufferAttribute).copyArray(b.sh).needsUpdate = true;
        (g.getAttribute('position') as THREE.BufferAttribute).copyArray(b.pos).needsUpdate = true;
        (g.getAttribute('aUp') as THREE.BufferAttribute).copyArray(b.up).needsUpdate = true;
        (g.getAttribute('aH') as THREE.BufferAttribute).copyArray(b.h).needsUpdate = true;
        g.computeVertexNormals();
        p.mesh.position.copy(b.origin);
        p.lat = b.lat;
        p.lon = b.lon;
        p.builtVersion = b.version;
        this.builtAt[l] = performance.now();
        p.built = true;
        p.mesh.visible = true;
        p.build = null;
      }
    }
  }

  public dispose(): void {
    for (const p of this.patches) p.mesh.geometry.dispose();
    this.material.dispose();
    this.group.removeFromParent();
  }
}
