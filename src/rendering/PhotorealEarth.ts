import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TilesRenderer } from '3d-tiles-renderer';
import { GoogleCloudAuthPlugin, GLTFExtensionsPlugin, TilesFadePlugin } from '3d-tiles-renderer/plugins';
import { SUN_WORLD } from './RenderOrigin';
import { perf } from './Performance';
import { bodyLatLonToLocal, bodyLocalToLatLon } from '../explorer/TileMath';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from './AerialPerspective';

/**
 * Google Photorealistic 3D Tiles on Solaris's Earth: real cities, mountains and coasts in 3D,
 * streamed as you come close (the same data as Google Earth).
 *
 * The tiles are in Earth-centred, Earth-fixed metres (WGS84). They are hung under Earth's surface
 * mesh, which is a unit sphere in the body's own frame (squashed at the poles by Earth's real
 * flattening), so they turn with the planet and sit exactly on the drawn globe:
 *  - axes: ECEF (x, y, z) is local (x, z, -y) (see latLonToLocal in TileMath)
 *  - scale: 1 / equatorial radius, with the polar axis pre-stretched to undo the mesh's squash
 *    (the tiles are already the real ellipsoid)
 *
 * The photographs are unlit (their light is baked in, at whatever hour they were flown), so the
 * real Sun's day and night are laid over them in their shader: a soft terminator, dark night side.
 *
 * Needs a Google Maps Platform key with the Map Tiles API enabled (VITE_GOOGLE_MAPS_API_KEY in
 * .env.local). Google's attribution is shown while tiles are on screen, as its terms require.
 */

const WGS84_A = 6378137;

/** Raycasts and the standing eye treat these meshes as the finest ground (their name parses as z 99). */
export const PHOTOREAL_TILE_NAME = 'tile_99/photoreal';


/** Declarations for the tile fragment shader (see PhotorealEarth.lightMaterial). */
const PHOTO_FRAGMENT_HEAD = /* glsl */ `
${AERIAL_PERSPECTIVE_GLSL}
uniform vec3 uEarthC;
uniform vec3 uSunW;
uniform vec3 uSunTint;
uniform float uDaylight;
uniform mat3 uEarthInv;
uniform float uKmPerUnit;
uniform float uCamAltKm;
uniform float uTime;
uniform float uDoy;
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform float uHasMaps;
uniform float uHaze;
uniform float uCloudOn;
uniform float uCloudCover;
uniform float uCloudStratus;
uniform float uCloudBase;
uniform float uCloudTop;
uniform vec2 uCloudWind;
uniform mat3 uCloudRot;
uniform float uTreeShadowOn;
uniform sampler2D uTreeShadow;
uniform mat4 uTreeShadowM;
float phHashG(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
uniform vec3 uDetailP0;
uniform vec3 uDetailE;
uniform vec3 uDetailN;
varying vec3 vPhotoWorld;

// Close-up ground (see the body): value noise in metres, faded before it is finer than a pixel
// Every pattern repeats every 32 m exactly (the frame's anchor moves in 32 m steps: the pattern
// carries on seamlessly when it does), so wavelengths divide 32 m
float gdNp(vec2 p, float per) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec2 i0 = mod(i, per), i1 = mod(i + 1.0, per);
  return mix(mix(phHashG(i0), phHashG(vec2(i1.x, i0.y)), f.x), mix(phHashG(vec2(i0.x, i1.y)), phHashG(i1), f.x), f.y);
}
float gdN(vec2 m, float waveM) { return gdNp(m / waveM, 32.0 / waveM); }
float gdD(vec2 m, float waveM, float pxM) { return (gdN(m, waveM) - 0.5) * (1.0 - smoothstep(0.3, 1.0, pxM / waveM)); }

// The volumetric clouds' coverage (rendering/VolumetricClouds.ts), the same noise in the same
// Earth-fixed km frame, so each shadow falls exactly under its cloud
float clH(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float clNoise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(clH(i), clH(i + vec3(1,0,0)), f.x), mix(clH(i + vec3(0,1,0)), clH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(clH(i + vec3(0,0,1)), clH(i + vec3(1,0,1)), f.x), mix(clH(i + vec3(0,1,1)), clH(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float clCoverage(vec3 q) {
  float n = clNoise(q / 23.0) * 0.6 + clNoise(q / 9.0) * 0.3 + clNoise(q / 3.7) * 0.1;
  float c = mix(uCloudCover, 1.0, uCloudStratus * 0.6);
  float lo = 1.0 - c - 0.05;
  return clamp((n - lo) / 0.4, 0.0, 1.0) * step(0.01, uCloudCover);
}

float phHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// Lamps on a grid of cellM-metre cells (q in cells): one in a cell lit with a chance set by the
// night map's glow, a disc a sixth of the cell across somewhere in it (half a pixel at least, so
// it never falls between pixels), from 0.6 to 1.4 bright
float phLamps(vec2 q, float glow, float cellM) {
  vec2 cell = floor(q);
  vec2 inCell = fract(q) - 0.5 - (vec2(phHash(cell + 1.3 + cellM), phHash(cell + 2.7 + cellM)) - 0.5) * 0.7;
  float on = step(1.0 - glow * 1.1, phHash(cell + cellM * 0.37));
  float r = max(0.16, 0.5 * length(fwidth(q)));
  return on * smoothstep(r, 0.0, length(inCell)) * (0.6 + 0.8 * phHash(cell + 7.1 + cellM)) * (0.16 / r) * (0.16 / r);
}
float phNoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(phHash(i), phHash(i + vec2(1.0, 0.0)), u.x), mix(phHash(i + vec2(0.0, 1.0)), phHash(i + vec2(1.0, 1.0)), u.x), u.y);
}
`;

/**
 * The tile fragment shader's body, run on the photograph's colour (outgoingLight):
 *  1. Time of day: the real Sun's light over the photograph, a warm low Sun, a dark night.
 *  2. Seasons: a snow line by latitude, height and date; autumn colour and bare winter trees in
 *     the mid-latitudes (the photographs are mostly summer).
 *  3. Water: where both Solaris's day map and the photograph say water, moving waves, the sky's
 *     reflection (Fresnel) and the Sun's glitter.
 *  4. City lights after dark, from the night map, brightest on the photograph's bright surfaces
 *     (roads, roofs), so they follow the streets.
 *  5. Aerial perspective: haze that thickens with distance and fades with height, coloured by the
 *     sky (blue by day, orange at sunset) and brightest towards the Sun.
 */
const PHOTO_FRAGMENT_BODY = /* glsl */ `
{
  vec3 photo = outgoingLight;
  vec3 rel = vPhotoWorld - uEarthC;
  vec3 loc = uEarthInv * rel;
  float rl = length(loc);
  vec3 nl = loc / max(rl, 1e-9);
  float hKm = (rl - 1.0) * 6378.137;
  float latDeg = degrees(asin(clamp(nl.y, -1.0, 1.0)));
  vec2 uvG = vec2(fract(atan(nl.z, -nl.x) / 6.2831853), 1.0 - acos(clamp(nl.y, -1.0, 1.0)) / 3.14159265);

  vec3 upW = normalize(rel);
  vec3 sunDir = normalize(uSunW - uEarthC);
  float sunUp = dot(upW, sunDir);
  float day = smoothstep(-0.10, 0.16, sunUp);
  vec3 sunCol = mix(vec3(1.0, 0.70, 0.50), uSunTint, smoothstep(0.02, 0.32, sunUp));
  // Night: the Moon's light (where it is up, by its phase) over starlight, airglow and the glow of
  // the sky over towns, cool; kept bright enough to read the land on a moonless night, as the
  // dark-adapted eye (and a night film) sees it
  vec3 light = mix(vec3(0.085, 0.1, 0.155) + uMoonLight * smoothstep(-0.04, 0.2, dot(upW, uMoonDir)), sunCol, day);
  float lum = dot(photo, vec3(0.2126, 0.7152, 0.0722));

  // --- Seasons
  float winterN = cos(6.2831853 * (uDoy - 15.0) / 365.25);
  float winterHere = latDeg >= 0.0 ? winterN : -winterN;
  float absLat = abs(latDeg);
  // The photographs already show the permanent snow (and are mostly summer): only the seasonal
  // snow is added, between the winter line and the summer line, and never on steep rock
  float summerLine = 5.4 * (1.0 - smoothstep(30.0, 72.0, absLat)) + 0.6;
  float snowLine = summerLine - 1.6 * max(winterHere, 0.0);
  vec3 fN = normalize(cross(dFdx(vPhotoWorld), dFdy(vPhotoWorld)));
  float flatness = abs(dot(fN, normalize(vPhotoWorld - uEarthC)));
  float green = smoothstep(0.0, 0.05, photo.g - max(photo.r, photo.b));
  float midLat = smoothstep(28.0, 40.0, absLat) * (1.0 - smoothstep(60.0, 68.0, absLat));
  float fallN = exp(-(((uDoy - 292.0) / 26.0) * ((uDoy - 292.0) / 26.0)));
  float fallS = exp(-(((uDoy - 110.0) / 26.0) * ((uDoy - 110.0) / 26.0)));
  float autumn = (latDeg >= 0.0 ? fallN : fallS) * midLat;
  // Autumn: a warm shift that varies from stand to stand (some trees turn, some stay green), never
  // a flat repaint: on a coarse tile, where a whole forest is one green, a strong tint made flat
  // olive slabs with hard edges against the sharper tiles beside it
  float stand = phNoise(nl.xz * 2.2e4) * 0.7 + phNoise(nl.xz * 9.0e4) * 0.3;
  vec3 turned = photo * vec3(1.22, 0.98, 0.72);
  photo = mix(photo, turned, green * autumn * 0.38 * smoothstep(0.3, 0.75, stand));
  float bare = clamp(winterHere, 0.0, 1.0) * midLat;
  // Bare deciduous woods are brown, not grey, and many trees are evergreen: a light touch
  photo = mix(photo, vec3(lum * 1.12, lum * 0.94, lum * 0.74), green * bare * 0.28);

  // --- Water: both the globe's map and the photograph must say so (coasts stay sharp)
  float water = 0.0;
  if (uHasMaps > 0.5) {
    vec3 g = texture2D(uDayMap, uvG).rgb;
    float mapWater = smoothstep(0.30, 0.08, g.r) * smoothstep(0.08, 0.25, g.b);
    float photoWater = smoothstep(0.24, 0.07, photo.r) * smoothstep(-0.02, 0.03, photo.b - photo.r) * smoothstep(0.42, 0.18, lum);
    water = mapWater * (0.25 + 0.75 * photoWater) * smoothstep(0.08, -0.02, hKm);
  }
  float snowNoise = phNoise(nl.xz * 9000.0) * 0.6 + phNoise(nl.xz * 41000.0) * 0.4;
  float hN = hKm + (snowNoise - 0.5) * 0.5;
  float snow = smoothstep(snowLine - 0.2, snowLine + 0.4, hN) * (1.0 - smoothstep(summerLine - 0.4, summerLine + 0.2, hN));
  snow *= smoothstep(0.55, 0.85, flatness) * (1.0 - water) * smoothstep(0.85, 0.6, lum);
  // Keep the photograph's shading and texture under the snow (a tint, not a white paint)
  vec3 snowCol = vec3(0.90, 0.94, 1.0) * (0.45 + 0.9 * lum);
  photo = mix(photo, snowCol, snow * 0.7);

  // --- Close-up ground. Standing on it (or flying a few metres over it) the photographs are
  // magnified past their own ~10 cm a pixel and smear into streaks and blotches. There, on open
  // ground, the surface is made by rule from what the photograph says it is: grass (blades and
  // tufts, darker clumps, dry patches), paving and asphalt (grain, joints, small cracks), gravel and
  // bare earth (pebbles), in the photograph's own colour; the streaks are softened from a blurrier
  // read of the same photograph. On a frame anchored to the ground (it does not swim with the eye)
  #ifdef USE_MAP
  {
    vec3 dd = (vPhotoWorld - uDetailP0) * uKmPerUnit * 1000.0;
    vec2 gm = vec2(dot(dd, uDetailE), dot(dd, uDetailN));
    float pxG = max(length(fwidth(gm)), 1e-4);
    float flatK = smoothstep(0.7, 0.9, flatness) * (1.0 - water) * (1.0 - snow) * (1.0 - uDaylight);
    // Out to some tens of metres the photograph's own blotches (baked shadows, the streaks of
    // texels stretched over the ground) are flattened towards the local mean; within a few metres
    // the made-by-rule surface takes over
    float smearK = (1.0 - smoothstep(0.25, 2.5, pxG)) * flatK;
    float nearK = (1.0 - smoothstep(0.08, 0.4, pxG)) * flatK;
    if (smearK > 0.002) {
      // The bare photograph and its means (fixed mip levels: up close the photograph is magnified,
      // where a bias from the current level blurs nothing), brought to the photo's own grade
      // (seasons, snow) by their ratio: over about a metre for the hue, a couple of metres for the
      // brightness. No coarser: a tile's photograph is an atlas of patches (ground, walls, roofs),
      // and a coarser mean took in the others, so each tile's ground came out its own shade, in
      // polygons with straight seams between them
      vec3 raw = max(texture2D(map, vMapUv).rgb, vec3(0.01));
      vec3 grade = photo / raw;
      vec3 mean1 = textureLod(map, vMapUv, 3.0).rgb * grade;
      vec3 meanL = textureLod(map, vMapUv, 4.5).rgb * grade;
      float lumP = dot(photo, vec3(0.2126, 0.7152, 0.0722));
      float lum1 = max(dot(mean1, vec3(0.2126, 0.7152, 0.0722)), 0.01);
      float lumM = max(dot(meanL, vec3(0.2126, 0.7152, 0.0722)), 0.01);
      // Only what is darker than around it is lifted, the darkest most (shadows the photograph
      // baked in at its own hour, wrong under any other Sun; the dark streaks of stretched texels):
      // never darkened or brightened past itself otherwise. Where the means are unreliable (at the
      // edge of an atlas patch they take in its neighbour or the empty gutter) a two-way squeeze
      // drew every patch edge on the ground as a seam
      float rL = clamp(lumP / lumM, 0.02, 1.0);
      float lift = min(pow(rL, 0.35) / rL, 2.2);
      vec3 hue = photo / max(lumP, 0.005);
      vec3 squeezed = mix(hue, mean1 / lum1, 0.4 * (1.0 - rL)) * lumP * lift;
      photo = mix(photo, squeezed, smearK);
    }
    if (nearK > 0.002) {
      vec3 base = photo;
      float grassK = smoothstep(0.0, 0.04, base.g - max(base.r, base.b) * 0.97);
      float warmK = smoothstep(0.02, 0.1, base.r - base.b) * (1.0 - grassK);
      float paveK = (1.0 - grassK) * (1.0 - warmK);
      // Grass: blades at 1-4 cm, tufts at 10-20, clumps and dry patches over metres
      float blades = gdD(gm * vec2(1.0, 2.0), 0.0125, pxG) * 0.55 + gdD(gm * vec2(2.0, 1.0) + 3.1, 0.03125, pxG) * 0.45 + gdD(gm + 7.7, 0.125, pxG) * 0.35;
      float clump = gdN(gm, 1.0) * 0.6 + gdN(gm + 2.0, 4.0) * 0.4;
      float dry = smoothstep(0.55, 0.85, gdN(gm + 11.0, 8.0));
      vec3 grass = base * (0.72 + 1.1 * blades) * mix(0.72, 1.12, clump);
      grass = mix(grass, grass * vec3(1.25, 1.08, 0.62), dry * 0.45);
      // Stones, 2 cm cells: each its own tone, shaded at the edge (gravel: every cell; asphalt,
      // tarmac and compacted ground: a scattering of them, the aggregate showing through)
      vec2 pc = gm / 0.02;
      vec2 pi = mod(floor(pc), 1600.0);
      vec2 pf = fract(pc) - 0.5 - (vec2(phHashG(pi + 1.3), phHashG(pi + 4.1)) - 0.5) * 0.5;
      float stoneFade = 1.0 - smoothstep(0.3, 1.0, pxG / 0.02);
      float pebble = smoothstep(0.48, 0.2, length(pf)) * stoneFade;
      float stoneTone = phHashG(pi + 9.7);
      // Mottling over a hand to a few strides (wear, damp, dust), with no edges or pattern to it
      float mottle = gdD(gm, 0.25, pxG) * 0.5 + gdD(gm + 4.4, 1.0, pxG) * 0.35 + gdD(gm + 9.1, 4.0, pxG) * 0.3;
      // Hard ground (paving, asphalt, packed earth: the photograph cannot tell which, so no slabs
      // or joints are drawn): fine grain, the mottling, scattered aggregate
      float grain = gdD(gm, 0.0125, pxG) * 0.6 + gdD(gm + 1.7, 0.03125, pxG) * 0.4;
      float speck = pebble * step(0.82, phHashG(pi + 2.9));
      vec3 pave = base * (0.9 + 0.45 * grain + 0.5 * mottle) * mix(1.0, 0.7 + 0.6 * stoneTone, speck);
      vec3 gravel = base * mix(0.66, 0.82 + 0.5 * stoneTone, pebble) * (0.94 + 0.5 * mottle);
      vec3 nearCol = grass * grassK + gravel * warmK + pave * paveK;
      photo = mix(photo, nearCol, nearK);
    }
  }
  #endif

  vec3 col = photo * mix(light, vec3(1.0), uDaylight);

  // Relief from the real Sun: the photographs carry midday light from above, so on their own every
  // face looks lit. With a low Sun the faces turned to it glow and the rest fall into shade (a
  // building or a wood seen against the light becomes a silhouette); by day only a little, to give
  // the buildings their shape
  {
    vec3 nF = fN * sign(dot(fN, cameraPosition - vPhotoWorld) + 1e-9);
    // Near the eye, nearly level ground is lit as level: there the mesh's facets are its small
    // bumps (noise in the survey, a few degrees either way), and a low Sun turned each into a lit
    // or a shaded patch, blotching open ground dark and light. Farther off a pixel spans metres
    // and its facet is the real lie of the land (hillsides), which keeps its light
    float pxW = length(fwidth(vPhotoWorld)) * uKmPerUnit * 1000.0;
    float levelK = smoothstep(0.8, 0.95, flatness) * (1.0 - smoothstep(0.6, 5.0, pxW));
    nF = normalize(mix(nF, upW, levelK));
    float facing = dot(nF, sunDir);
    float lowSun = 1.0 - smoothstep(0.05, 0.4, sunUp);
    float relief = 0.2 * day * (1.0 - uDaylight);
    col *= mix(1.0, 0.36 + 0.95 * clamp(facing + 0.15, 0.0, 1.0), relief * (1.0 - lowSun));
    // With a low Sun the light is two lights: the Sun's, warm, only on what faces it, and the
    // sky's, blue and dim, on everything. A face turned from a setting Sun is in the blue shade (it
    // glowed orange like the sunlit ones before, under one warm light)
    float lit = smoothstep(-0.12, 0.35, facing);
    vec3 skyShade = mix(vec3(0.30, 0.36, 0.52), vec3(0.42, 0.48, 0.62), smoothstep(0.0, 0.4, sunUp)) * 0.85;
    vec3 golden = mix(skyShade, sunCol * 1.25 + skyShade * 0.3, lit) / max(sunCol, vec3(0.05));
    col *= mix(vec3(1.0), golden, lowSun * day * (1.0 - uDaylight) * 0.85);
  }

  // --- Cloud shadows: the coverage where the line to the Sun crosses the middle of the layer
  if (uCloudOn > 0.5 && day > 0.01) {
    vec3 qk = uCloudRot * (rel * uKmPerUnit);
    vec3 sl = uCloudRot * sunDir;
    float hMid = 0.5 * (uCloudBase + uCloudTop);
    float upK = max(dot(normalize(qk), sl), 0.08);
    vec3 qc = qk + sl * (max(hMid - hKm, 0.0) / upK);
    qc.xz += uCloudWind;
    float cov = clCoverage(qc);
    // Soft-edged, deeper under thick cloud; the ambient sky still lights the shade
    float shade = smoothstep(0.05, 0.6, cov) * mix(0.42, 0.62, uCloudStratus) * day;
    col *= 1.0 - shade;
  }

  // --- The planted trees' shadows (soft: five taps of the forest's depth seen from the Sun)
  if (uTreeShadowOn > 0.5 && day > 0.01 && uDaylight < 0.5) {
    vec4 sp = uTreeShadowM * vec4(vPhotoWorld, 1.0);
    vec3 su = sp.xyz / sp.w;
    if (su.x > 0.0 && su.x < 1.0 && su.y > 0.0 && su.y < 1.0 && su.z < 1.0) {
      float px = 1.0 / 2048.0;
      float bias = 0.0004;
      float occ = 0.0;
      occ += step(texture2D(uTreeShadow, su.xy).r + bias, su.z);
      occ += step(texture2D(uTreeShadow, su.xy + vec2(px, 0.0)).r + bias, su.z);
      occ += step(texture2D(uTreeShadow, su.xy - vec2(px, 0.0)).r + bias, su.z);
      occ += step(texture2D(uTreeShadow, su.xy + vec2(0.0, px)).r + bias, su.z);
      occ += step(texture2D(uTreeShadow, su.xy - vec2(0.0, px)).r + bias, su.z);
      // The sky still lights the shade: about half the light goes
      col *= 1.0 - 0.62 * (occ / 5.0) * day;
    }
  }

  vec3 toEye = cameraPosition - vPhotoWorld;
  float distKm = length(toEye) * uKmPerUnit;
  vec3 V = toEye / max(length(toEye), 1e-12);
  // Sky colour at this place and hour (blue by day, orange low, deep blue at night)
  vec3 skyDay = vec3(0.50, 0.66, 0.92);
  vec3 skyLow = vec3(0.98, 0.56, 0.32);
  vec3 skyCol = mix(vec3(0.012, 0.018, 0.04), mix(skyLow, skyDay, smoothstep(0.02, 0.30, sunUp)), smoothstep(-0.14, 0.04, sunUp));

  if (water > 0.001) {
    vec2 pm = nl.xz * 6.378137e6;
    float t = uTime;
    vec2 sl = vec2(0.0);
    sl += vec2(0.8, 0.3) * cos(dot(pm, vec2(0.011, 0.004)) + t * 1.3);
    sl += vec2(-0.3, 0.9) * cos(dot(pm, vec2(-0.006, 0.017)) + t * 1.7);
    sl += vec2(0.5, -0.6) * cos(dot(pm, vec2(0.031, -0.022)) + t * 2.6) * 0.5;
    vec3 N = normalize(upW + 0.045 * vec3(sl.x, 0.0, sl.y));
    float NdV = max(dot(N, V), 0.0);
    float fres = 0.02 + 0.98 * pow(1.0 - NdV, 5.0);
    vec3 H = normalize(V + sunDir);
    float glint = pow(max(dot(N, H), 0.0), 260.0) * 9.0 + pow(max(dot(N, H), 0.0), 40.0) * 0.25;
    vec3 wcol = mix(col * 0.85, skyCol * (0.25 + 0.75 * day), fres);
    wcol += sunCol * glint * day * (1.0 - snow);
    // The Moon's path of light on the water
    vec3 Hm = normalize(V + uMoonDir);
    float mGlint = pow(max(dot(N, Hm), 0.0), 220.0) * 6.0 + pow(max(dot(N, Hm), 0.0), 30.0) * 0.12;
    wcol += uMoonLight * mGlint * (1.0 - day);
    wcol = mix(wcol, wcol + uNightAir * 0.6, fres * (1.0 - day));
    col = mix(col, wcol, water);
  }

  // --- City lights after dark
  if (uHasMaps > 0.5) {
    float night = 1.0 - smoothstep(-0.12, 0.02, sunUp);
    vec3 nm = texture2D(uNightMap, uvG).rgb;
    float glow = dot(nm, vec3(0.333));
    // Lights are points (windows, street lamps), not a wash: a lamp is a small disc (~1.5 m)
    // somewhere in a 10 m cell, more of them lit where the night map is brighter, on open ground
    // and roofs only (walls get a faint warm wash, their windows). From higher up a 10 m cell is
    // far smaller than a pixel and the lamps fell between the pixels: the city went dark, or (as
    // an average) a flat orange-brown sheet. So the cell grows with the distance, 10, 40, 160,
    // 640 m (a far light stands for a street's worth), each lamp kept about a pixel across and as
    // bright: from above a city stays a field of points, its streets and squares still showing
    vec2 pmM = nl.xz * 6.378137e6;
    float pxM = length(fwidth(pmM));
    float lvl = clamp(log2(max(pxM, 1e-3) / 6.0) * 0.5, 0.0, 3.0);
    float l0 = floor(lvl);
    float lf = lvl - l0;
    float cellA = 10.0 * pow(4.0, l0);
    float lampsA = phLamps(pmM / cellA, glow, cellA);
    float lampsB = phLamps(pmM / (cellA * 4.0), glow, cellA * 4.0);
    float lamps = mix(lampsA, lampsB, lf) * smoothstep(0.5, 0.85, flatness);
    float streets = smoothstep(0.30, 0.70, lum);
    vec3 warm = mix(vec3(1.0, 0.62, 0.30), vec3(1.0, 0.86, 0.66), phHash(floor(pmM / cellA) + 3.3));
    // A faint glow of the lit city on the ground itself, only where it is dense (the centre)
    float wash = glow * glow * (0.012 + 0.02 * streets) + glow * 0.02 * (1.0 - flatness);
    col += warm * (lamps * (2.2 + 2.0 * streets) + wash) * night * (1.0 - water);
  }

  // --- Aerial perspective: blue-grey with distance, golden towards a low Sun (AerialPerspective.ts);
  // none in the plain-light capture (uDaylight 1, for reading the ground's colours)
  float hMean = max(0.0, (uCamAltKm + max(hKm, 0.0)) * 0.5);
  col = mix(aerialPerspective(col, distKm, hMean, uHaze, V, sunDir, sunUp), col, uDaylight);

  // The picture goes through the filmic tone curve with everything else, which flattens a
  // finished photograph: a little contrast and colour are put back
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.18);
  float l2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l2), col, 1.12);
  outgoingLight = max(col, vec3(0.0));
}
`;

/** The parts of a 3d-tiles-renderer tile the download order reads. */
interface TileLike {
  geometricError: number;
  traversal?: { used: boolean; error: number; distanceFromCamera: number };
  internal?: { hasUnrenderableContent: boolean; loadingState: number };
  engineData?: { boundingVolume?: { distanceToPoint(p: THREE.Vector3): number; intersectsFrustum(f: unknown): boolean } };
  parent?: TileLike | null;
  /** Download rank for this frame (higher first), set by rankQueue. */
  solarisRank?: number;
}

export class PhotorealEarth {
  /** The layer currently in use (one Earth), for the ground raycasts of the surface view and the jet. */
  public static current: PhotorealEarth | null = null;
  /**
   * Cross-fade tile swaps (TilesFadePlugin): a tile dithers in over its parent instead of popping.
   */
  public static fade = true;

  public readonly tiles: TilesRenderer;
  private readonly holder = new THREE.Group();
  private readonly earthCentre = { value: new THREE.Vector3() };
  /** The close-up ground's frame: an anchor near the eye (as the draw sees it) and its east and north. */
  private readonly detailP0 = { value: new THREE.Vector3() };
  private readonly detailE = { value: new THREE.Vector3(1, 0, 0) };
  private readonly detailN = { value: new THREE.Vector3(0, 0, 1) };
  private readonly detailTmp = new THREE.Vector3();
  private readonly sunTint = { value: new THREE.Vector3(1, 1, 1) };
  private readonly daylight = { value: 0 };
  /** World to Earth's body frame (a unit sphere at the surface), for latitude, height and maps. */
  private readonly earthInv = { value: new THREE.Matrix3() };
  /** Kilometres per world unit at Earth (for distance haze). */
  private readonly kmPerUnit = { value: 1 };
  private readonly camAltKm = { value: 1 };
  private readonly timeS = { value: 0 };
  /** Day of the year (0..365): seasons. */
  private readonly dayOfYear = { value: 172 };
  private readonly dayMap: { value: THREE.Texture | null } = { value: null };
  private readonly nightMap: { value: THREE.Texture | null } = { value: null };
  private readonly hasMaps = { value: 0 };
  /** Haze thickness (1 = clear air; more when the real visibility is poor). */
  private readonly hazeScale = { value: 1 };
  private readonly invTmp = new THREE.Matrix4();
  private attributionEl: HTMLDivElement | null = null;
  private lastAttribution = 0;
  private enabled = false;
  private dracoLoader: DRACOLoader;
  private surface: THREE.Object3D | null = null;
  private maxAnisotropy = 8;
  private baseError = 8;

  constructor(apiKey: string, container: HTMLElement | null) {
    this.tiles = new TilesRenderer();
    this.tiles.registerPlugin(new GoogleCloudAuthPlugin({
      apiToken: apiKey,
      autoRefreshToken: true,
      // The detail target is set here by device tier (the plugin's own default is 20)
      useRecommendedSettings: false,
    }));
    const tier = perf.tier;
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    this.dracoLoader = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
    this.dracoLoader.setWorkerLimit(tier === 'low' ? 2 : Math.max(2, Math.min(6, cores - 2)));
    this.tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader: this.dracoLoader }));
    // A coarse tile dissolves into its sharper children (and back) over a quarter second instead
    // of being swapped in one frame: no pops, no hard sharp/blurry edges while detail streams in
    // A tile's photograph goes to the GPU before the tile is shown, a few milliseconds' worth a
    // frame: hundreds of tiles arriving together were all uploaded inside one draw (frames of
    // 0.4-2 s on the fly page's opening). The tile waits its turn; the frame never does
    this.uploadBudgetMs = tier === 'high' ? 5 : tier === 'medium' ? 4 : 3;
    this.tiles.registerPlugin({ name: 'SOLARIS_UPLOAD_BUDGET', processTileModel: (scene: THREE.Object3D) => this.uploadInTurn(scene) } as unknown as Parameters<TilesRenderer['registerPlugin']>[0]);
    if (PhotorealEarth.fade) this.tiles.registerPlugin(new TilesFadePlugin({ fadeDuration: 280, fadeRootTiles: false, maximumFadeOutTiles: tier === "low" ? 30 : 80 }));
    // Detail target: the screen-space error (pixels) a tile may have before a finer one is asked
    // for. Measured over Paris at 240 m: a target of 1 queues 14,000 tiles (the sharp ones near
    // you never arrive, and the frame time triples); 8 queues a few hundred and they all load.
    this.baseError = tier === 'high' ? 8 : tier === 'medium' ? 12 : 20;
    this.tiles.errorTarget = this.baseError;
    // Memory. Measured: with a 450 MB floor the cache sat on it, and at 3,700 km/h 20 tiles a
    // second were thrown away as 23 arrived, everything behind the jet gone at once. A higher
    // floor keeps the ground you flew over (turn back and it is still there), bounded per device
    const mb = 1024 * 1024;
    this.tiles.lruCache.minSize = tier === 'low' ? 900 : tier === 'medium' ? 2500 : 4500;
    this.tiles.lruCache.maxSize = tier === 'low' ? 1600 : tier === 'medium' ? 4000 : 7000;
    this.tiles.lruCache.minBytesSize = (tier === 'high' ? 1000 : tier === 'medium' ? 520 : 200) * mb;
    this.tiles.lruCache.maxBytesSize = (tier === 'high' ? 1500 : tier === 'medium' ? 760 : 300) * mb;
    // Downloads. Measured: tiles are small (35 KB) but each request takes ~430 ms, so the number in
    // flight, not bandwidth, sets the rate (~35 tiles/s at 14). Google serves over HTTP/2, so more
    // requests share one connection
    // Measured again: ~650 ms a request at Google (time to first byte); but at 96 in flight the
    // line itself filled (bodies took 0.3-2 s to arrive, ~27 tiles a second): past ~60 more at once
    // only makes each slower and lets less important tiles share the line with the ones on screen
    this.tiles.downloadQueue.maxJobs = tier === 'high' ? 56 : tier === 'medium' ? 40 : 16;
    // Parsing (Draco in workers, images decoded off the main thread) was the real bottleneck for
    // blurry ground: measured flying low at 900 km/h, 6 at a time left 120-390 downloaded tiles
    // waiting to be parsed (seconds before the sharp children could show); 20 keeps the wait
    // under 10 tiles at the same frame time
    this.tiles.parseQueue.maxJobs = tier === 'high' ? 20 : tier === 'medium' ? 10 : 4;
    // Each view culls the tiles itself (three.js frustum culling). With the renderer's own culling
    // the tiles loaded for the look-ahead and ground views below would all be drawn as well
    this.tiles.autoDisableRendererCulling = false;
    // Parents load first and stay on screen while their children stream in: the ground sharpens
    // in steps (blur to sharp) and never has holes
    // The cross-fade dissolves a coarse tile into its children on top of that.
    // (It failed twice before because the plugin leaves a line break inside `void main(`, so our
    // shader edit missed and the tile shader did not compile: matched by pattern now)
    this.tiles.loadAncestors = true;
    // What to fetch first. Measured (Paris, Manhattan, London, Tokyo, a few hundred metres up,
    // cold): each request takes ~650 ms at Google whatever its size, so the order is everything.
    // Four views ask for tiles (the screen; the look-ahead; the all-round coarse view; the probe
    // straight down under the jet, at 1,000 px from 150 m, for collisions) and the library ranks
    // them all together, by error: the probe's centimetre tiles under the jet came first, the
    // levels the screen needed waited behind them, and after 12 s nothing finer than level 10-12
    // was on screen though hundreds of level 19-21 tiles had arrived (a level is only shown when
    // all its siblings are in). So each queued tile is ranked once a frame by what the screen
    // needs (see rankQueue): the tileset files that open the next levels first of all, then the
    // screen's own tiles, coarsest on screen first; what only the helper views want after them.
    // One number per item, so the order is always the same total order (anything that is not a
    // tile, such as a plugin's own request, goes first; a tile not ranked yet, last)
    const key = (t: TileLike): number => (!t.engineData ? Infinity : t.solarisRank ?? -1);
    const order = (a: TileLike, b: TileLike): number => {
      const ka = key(a), kb = key(b);
      return ka > kb ? 1 : ka < kb ? -1 : 0;
    };
    this.libraryOrder = this.tiles.downloadQueue.priorityCallback as unknown as typeof this.libraryOrder;
    this.tiles.downloadQueue.priorityCallback = order as never;
    this.tiles.parseQueue.priorityCallback = order as never;

    // ECEF metres -> the surface mesh's unit frame
    const s = 1 / WGS84_A;
    const m = new THREE.Matrix4().set(
      s, 0, 0, 0,
      0, 0, s, 0,
      0, -s, 0, 0,
      0, 0, 0, 1
    );
    this.holder.matrixAutoUpdate = false;
    this.holder.matrix.copy(m);
    this.holder.name = 'photoreal_earth';
    this.holder.add(this.tiles.group);
    this.holder.visible = false;

    this.tiles.addEventListener('load-model', ({ scene }) => this.prepareModel(scene));

    if (container) {
      const el = document.createElement('div');
      el.className = 'photoreal-attribution';
      el.style.cssText =
        'position:absolute;right:8px;bottom:3px;z-index:60;pointer-events:none;max-width:60vw;text-align:right;' +
        'font:500 9px/1.3 Roboto,Arial,sans-serif;color:rgba(255,255,255,0.85);text-shadow:0 0 3px #000,0 0 6px #000;display:none;';
      container.appendChild(el);
      this.attributionEl = el;
    }
    PhotorealEarth.current = this;
  }

  /** Hang the tiles under Earth's surface mesh (unit sphere, scaled y by `polarScale`). */
  public attach(surfaceMesh: THREE.Object3D, polarScale: number): void {
    // Undo the mesh's polar squash: the tiles are the real ellipsoid already
    const unsquash = new THREE.Matrix4().makeScale(1, 1 / polarScale, 1);
    this.holder.matrix.premultiply(unsquash);
    surfaceMesh.add(this.holder);
    this.surface = surfaceMesh;
  }

  /** Today's day of the year (1-366), as the tiles' seasons use it. */
  public get dayOfYearNow(): number {
    return this.dayOfYear.value;
  }

  /** The air the tiles are drawn through: km per world unit, the eye's height, the haze factor. */
  public get air(): { kmPerUnit: number; camAltKm: number; haze: number } {
    return { kmPerUnit: this.kmPerUnit.value, camAltKm: this.camAltKm.value, haze: this.hazeScale.value };
  }

  /** Whether the photoreal Earth is drawn (and the imagery tiles should step aside). */
  public get showing(): boolean {
    return this.enabled && this.tiles.visibleTiles.size > 0;
  }

  /**
   * Per frame, before the draw (world coordinates unshifted): stream and select tiles for the
   * camera when `enabled`, else hide and stop loading.
   */
  public update(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, enabled: boolean, altKm?: number, speedKmS = 0): void {
    this.enabled = enabled;
    this.holder.visible = enabled;
    if (enabled) {
      if (!this.tiles.hasCamera(camera)) this.tiles.setCamera(camera);
      this.maxAnisotropy = Math.min(perf.tier === 'low' ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
      this.renderer = renderer;
      // Detail is chosen for the screen as it is, not for the render scale: when the frame rate
      // dropped and the picture was drawn smaller, the screen-space error shrank with it and the
      // tiles stayed coarse. A 32 m tile 2 km away then counted as fine enough, and Downtown Dubai
      // stood flat, the Burj Khalifa missing (measured: 828 m of tower, 0 m in the coarse tile)
      const css = renderer.getSize(this.cssSize);
      const lodRatio = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, perf.tier === 'low' ? 1 : 1.5);
      this.tiles.setResolution(camera, Math.max(1, css.x * lodRatio), Math.max(1, css.y * lodRatio));

      // Flying fast and low, the ground goes by quicker than fine tiles can arrive: ask for a
      // little less detail, so what is asked for does arrive (it is motion-blurred anyway)
      const alt = Math.max(0.2, altKm ?? 1);
      const rush = THREE.MathUtils.clamp((speedKmS / alt) * 0.35, 0, 1.5);
      // Standing still on the ground there is time for one step finer
      const still = speedKmS < 0.01 && alt < 3 ? 0.75 : 1;
      // Behind on a slow line (hundreds of tiles waiting): ask for a step less detail until it
      // catches up, so the whole view arrives at medium detail in seconds instead of holes and
      // blur for half a minute, then sharpens as the queue drains. Eased over a few seconds, so
      // it does not swing with each burst of tiles
      const waiting = (this.tiles as unknown as { stats: { queued: number } }).stats.queued;
      const want = THREE.MathUtils.clamp(1 + (waiting - 250) / 500, 1, 2);
      const dtS = Math.min(0.25, Math.max(0, (performance.now() - this.backlogT) / 1000));
      this.backlogT = performance.now();
      this.backlog += (want - this.backlog) * (1 - Math.exp(-dtS / (want > this.backlog ? 1.5 : 4)));
      // Memory full. The library asks for nothing new while its cache is over its byte limit, and
      // only tiles no view uses can be let go: standing in Paris every tile in a full cache was in
      // use (the screen, the look-ahead, the all-round and the probe views, each tile's siblings
      // and its ancestors), so nothing was freed and nothing came, and a coarse tile stood across
      // the view like a wall for good. Full: less detail is asked for, more each second it stays
      // full, so the far tiles step back and free room for the near ones; let off slowly once the
      // cache is well under its limit again
      const lru = this.tiles.lruCache as unknown as { isFull(): boolean; cachedBytes: number; minBytesSize: number; maxBytesSize: number };
      if (lru.isFull()) this.memPressure = Math.min(4, this.memPressure + dtS * 0.8);
      else if (lru.cachedBytes < (lru.minBytesSize + lru.maxBytesSize) / 2) this.memPressure = Math.max(1, this.memPressure - dtS * 0.08);
      this.tiles.errorTarget = this.baseError * (1 + rush) * still * this.backlog * this.memPressure;

      this.surface?.updateWorldMatrix(true, true);
      if (this.surface) {
        // The body frame does not depend on where the floating origin is (rotation and scale only)
        this.earthInv.value.setFromMatrix4(this.invTmp.copy(this.surface.matrixWorld).invert());
        const sx = new THREE.Vector3().setFromMatrixColumn(this.surface.matrixWorld, 0).length();
        this.kmPerUnit.value = (WGS84_A / 1000) / Math.max(sx, 1e-12);
      }
      this.camAltKm.value = Math.max(0, altKm ?? 1);
      // Earth's centre as the draw will see it: the floating origin puts the camera at (0, 0, 0)
      // for the draw (SolarSystemScene.renderFrame). Set here once a frame; a per-mesh render hook
      // was not reliably called, which left night lit like noon
      if (this.surface) this.earthCentre.value.setFromMatrixPosition(this.surface.matrixWorld).sub(camera.position);
      if (this.surface) this.updateDetailFrame(camera);
      camera.updateMatrixWorld();
      this.tiles.update();
      // Ranked every few frames (a long queue is thousands of frustum tests; the order changes slowly)
      if (this.rankTick++ % 6 === 0) this.rankQueue(camera);
    }
    this.updateAttribution();
  }

  /**
   * Rank the queued tiles by what the screen needs (read by the download and parse order set up in
   * the constructor). Tiers, best first: a tileset file in the screen's view (it opens the levels
   * below); a tile in view; anything only a helper view wants. Within a tier, the higher the error
   * on screen (the coarser for its distance) the sooner: nearest and coarsest first, so every part
   * of the view gets ground and then sharpens.
   */
  private rankQueue(camera: THREE.PerspectiveCamera): void {
    const T = this.tiles as unknown as {
      cameras: THREE.Camera[];
      cameraInfo: Array<{ frustum: unknown; position: THREE.Vector3; sseDenominator: number }>;
      downloadQueue: { items: TileLike[] };
      parseQueue: { items: TileLike[] };
    };
    const i = T.cameras.indexOf(camera);
    const info = i >= 0 ? T.cameraInfo[i] : null;
    if (!info) return;
    const rank = (t: TileLike): void => {
      const bv = t.engineData?.boundingVolume;
      if (!bv || !t.internal) {
        t.solarisRank = undefined;
        return;
      }
      let tier = 0;
      let err = t.traversal?.error ?? 0;
      // In the screen's view: first (the tileset files that open the levels below before the
      // tiles), ranked by their error on screen; out of it (only a helper view wants it): after
      if (bv.intersectsFrustum(info.frustum)) {
        const d = bv.distanceToPoint(info.position);
        err = d === 0 ? 1e6 : t.geometricError / (d * info.sseDenominator);
        tier = t.internal.hasUnrenderableContent ? 2 : 1;
      }
      t.solarisRank = tier * 1e7 + Math.min(err, 9.99e6);
    };
    for (const t of T.downloadQueue.items) rank(t);
    for (const t of T.parseQueue.items) rank(t);
  }

  /** Detail eased back while downloads are behind (1 = none; see update). */
  private backlog = 1;
  private backlogT = 0;
  /** Less detail asked for while the tile cache is full (see the update). */
  private memPressure = 1;

  /** The library's own download order (kept for comparison in development). */
  public libraryOrder: ((a: unknown, b: unknown) => number) | null = null;

  /**
   * The close-up ground's frame: a point on the ground snapped to a 0.02 degree grid near the eye
   * (so the generated grass and stones stay put as the eye moves, and jump only when the eye has
   * gone ~2 km, by which time they are far too small to see), its east and north, and where it is
   * as the draw will see it (the eye at the origin), worked out in double precision here.
   */
  private updateDetailFrame(camera: THREE.Camera): void {
    const surf = this.surface!;
    const local = surf.worldToLocal(this.detailTmp.copy(camera.position));
    const ll = bodyLocalToLatLon('Earth', local.x, local.y, local.z);
    const lat0 = Math.round(ll.lat / 0.02) * 0.02;
    const lon0 = Math.round(ll.lon / 0.02) * 0.02;
    const [x, y, z] = bodyLatLonToLocal('Earth', lat0, lon0);
    const p0 = new THREE.Vector3(x, y, z).applyMatrix4(surf.matrixWorld);
    const la = (lat0 * Math.PI) / 180;
    const lo = (lon0 * Math.PI) / 180;
    const E = this.detailE.value.set(-Math.sin(lo), 0, -Math.cos(lo)).transformDirection(surf.matrixWorld);
    const N = this.detailN.value.set(-Math.sin(la) * Math.cos(lo), Math.cos(la), Math.sin(la) * Math.sin(lo)).transformDirection(surf.matrixWorld);
    // Then moved to within 32 m of the eye, in whole 32 m steps along those axes: the shader's
    // numbers stay small (32-bit floats at a km from the eye were good to only ~8 cm, too coarse
    // for grass), and its patterns, which repeat every 32 m, carry on unbroken
    const mPerUnit = this.kmPerUnit.value * 1000;
    const rel = this.detailTmp.subVectors(camera.position, p0);
    const sE = Math.floor((rel.dot(E) * mPerUnit) / 32) * 32;
    const sN = Math.floor((rel.dot(N) * mPerUnit) / 32) * 32;
    this.detailP0.value.copy(p0).addScaledVector(E, sE / mPerUnit).addScaledVector(N, sN / mPerUnit).sub(camera.position);
  }

  private rankTick = 0;
  private cssSize = new THREE.Vector2();
  private aheadCamera: THREE.PerspectiveCamera | null = null;
  private aheadOn = false;

  /**
   * Fetch the ground before you get there: a second, invisible view placed `leadS` seconds ahead
   * along the flight path, looking the way the jet is going and a little down. The tiles it wants
   * are downloaded and kept; when the jet arrives they are already loaded (and only drawn by the
   * real camera, which culls them itself). It asks for one step less detail than the real view,
   * so it never competes with what is on screen. Pass null to stop.
   */
  public setLookahead(point: THREE.Vector3 | null, velocity?: THREE.Vector3, earthCentre?: THREE.Vector3, leadS = 4): void {
    if (!point || !velocity || !earthCentre || !this.enabled || velocity.lengthSq() < 1e-20) {
      if (this.aheadOn && this.aheadCamera) this.tiles.deleteCamera(this.aheadCamera);
      this.aheadOn = false;
      return;
    }
    const cam = (this.aheadCamera ??= new THREE.PerspectiveCamera(70, 1.6, 1e-7, 50));
    const up = this.probeUp.subVectors(point, earthCentre).normalize();
    cam.position.copy(point).addScaledVector(velocity, leadS);
    const fwd = velocity.clone().normalize();
    // Look along the path, tipped 20 degrees down so the ground ahead is in view
    const look = fwd.addScaledVector(up, -0.36).normalize();
    cam.up.copy(up);
    cam.lookAt(cam.position.clone().add(look));
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();
    if (!this.aheadOn) {
      this.tiles.setCamera(cam);
      this.tiles.setResolution(cam, 900, 560);
      this.aheadOn = true;
    }
  }

  private surroundCamera: THREE.PerspectiveCamera | null = null;
  private surroundOn = false;

  /**
   * Keep a coarse level of tiles loaded all the way round the jet. The renderer only loads what
   * some camera sees; turn hard, look back or roll inverted and the ground there had never been
   * fetched at any level, so for a second or more there was nothing (and the fallback globe showed
   * through as flat blue-green slabs). This view hangs at the jet looking straight down with a
   * 170 degree field (everything below the horizon) at a low resolution, so it asks only for coarse
   * tiles; whatever the real camera turns to already has ground, which then sharpens. Pass null
   * to stop.
   */
  public setSurround(point: THREE.Vector3 | null, earthCentre?: THREE.Vector3): void {
    if (!point || !earthCentre || !this.enabled) {
      if (this.surroundOn && this.surroundCamera) this.tiles.deleteCamera(this.surroundCamera);
      this.surroundOn = false;
      return;
    }
    const cam = (this.surroundCamera ??= new THREE.PerspectiveCamera(170, 1, 1e-7, 80));
    const up = this.probeUp.subVectors(point, earthCentre).normalize();
    cam.up.set(up.y, up.z, up.x);
    cam.position.copy(point);
    cam.lookAt(earthCentre);
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();
    if (!this.surroundOn) {
      this.tiles.setCamera(cam);
      this.tiles.setResolution(cam, 200, 200);
      this.surroundOn = true;
    }
  }

  private probeCamera: THREE.PerspectiveCamera | null = null;
  private probeOn = false;
  private probeUp = new THREE.Vector3();

  /**
   * Keep the ground under a point loaded (the jet, for its collisions). The renderer only holds
   * tiles that some camera sees, and the ground straight under the jet is below the bottom of the
   * screen: this is a second, small view looking straight down from 150 m above the point.
   * Pass null to stop.
   */
  public setGroundProbe(point: THREE.Vector3 | null, earthCentre?: THREE.Vector3): void {
    if (!point || !earthCentre || !this.enabled) {
      if (this.probeOn && this.probeCamera) this.tiles.deleteCamera(this.probeCamera);
      this.probeOn = false;
      return;
    }
    const cam = (this.probeCamera ??= new THREE.PerspectiveCamera(100, 1, 1e-7, 10));
    const up = this.probeUp.subVectors(point, earthCentre).normalize();
    const unitsPerKm = point.distanceTo(earthCentre) / (WGS84_A / 1000);
    // Any axis not along the view will do for "up"
    cam.up.set(up.y, up.z, up.x);
    cam.position.copy(point).addScaledVector(up, 0.15 * unitsPerKm);
    cam.lookAt(earthCentre);
    cam.updateMatrixWorld();
    if (!this.probeOn) {
      this.tiles.setCamera(cam);
      // As if drawn 500 pixels across: ground true to a few metres under the jet. (At 1,000 it
      // asked for the finest tiles there are, level 22-23, ~100 KB each, which crowded the line
      // the screen's tiles come down)
      this.tiles.setResolution(cam, 500, 500);
      this.probeOn = true;
    }
  }

  /** The tiles as one raycast target (with world matrices synced to the current frame's Earth transform). */
  public raycastTarget(): THREE.Object3D | null {
    if (!this.showing) return null;
    this.surface?.updateWorldMatrix(true, true);
    return this.tiles.group;
  }

  /**
   * Solaris's own day and night maps of Earth: the day map tells water from land (for waves and
   * glitter), the night map places city lights over the photographs after dark.
   */
  public setGlobeMaps(day: THREE.Texture | null, night: THREE.Texture | null): void {
    this.dayMap.value = day;
    this.nightMap.value = night;
    this.hasMaps.value = day && night ? 1 : 0;
  }

  /** The real visibility where the jet is, km: thicker haze when it is poor (fog, overcast). */
  private readonly cloudU = {
    uCloudOn: { value: 0 },
    uCloudCover: { value: 0 },
    uCloudStratus: { value: 0 },
    uCloudBase: { value: 1.5 },
    uCloudTop: { value: 3 },
    uCloudWind: { value: new THREE.Vector2() },
    uCloudRot: { value: new THREE.Matrix3() },
  };

  /** The trees' shadows (GroundCover): the forest's depth seen from the Sun, and world -> its texture. */
  private readonly treeShadowU = {
    uTreeShadowOn: { value: 0 },
    uTreeShadow: { value: null as THREE.Texture | null },
    uTreeShadowM: { value: new THREE.Matrix4() },
  };

  /** Shadows of the planted trees on the ground (null: none). */
  public setTreeShadow(depth: THREE.Texture | null, worldToShadow: THREE.Matrix4 | null): void {
    const u = this.treeShadowU;
    u.uTreeShadowOn.value = depth && worldToShadow ? 1 : 0;
    if (!depth || !worldToShadow) return;
    u.uTreeShadow.value = depth;
    u.uTreeShadowM.value.copy(worldToShadow);
  }

  /** Shadows of the volumetric clouds on the ground (null: none). */
  public setCloudShadows(c: { enabled: boolean; layer: { cover: number; stratus: number; baseKm: number; topKm: number; windKm: THREE.Vector2 }; earthRot: THREE.Matrix3 } | null): void {
    const u = this.cloudU;
    u.uCloudOn.value = c && c.enabled ? 1 : 0;
    if (!c || !c.enabled) return;
    u.uCloudCover.value = c.layer.cover;
    u.uCloudStratus.value = c.layer.stratus;
    u.uCloudBase.value = c.layer.baseKm;
    u.uCloudTop.value = c.layer.topKm;
    u.uCloudWind.value.copy(c.layer.windKm);
    u.uCloudRot.value.copy(c.earthRot);
  }

  public setVisibility(km: number): void {
    this.hazeScale.value = THREE.MathUtils.clamp(30 / Math.max(km, 0.5), 1, 4.5);
  }

  /** The date and the hour, for seasons and the moving water. */
  public setTime(utcMs: number, seconds: number): void {
    const d = new Date(utcMs);
    const start = Date.UTC(d.getUTCFullYear(), 0, 1);
    this.dayOfYear.value = (utcMs - start) / 86400000;
    this.timeS.value = seconds;
  }

  /** Blend factor [0..1] toward even daylight when inspecting night-side cities in Explorer mode. */
  public setDaylight(factor: number): void {
    this.daylight.value = THREE.MathUtils.clamp(factor, 0, 1);
  }

  /**
   * Run `fn` with the tiles in plain light (even daylight, no haze, no cloud shade): for reading
   * the photographs' own colours (GroundCover), then put back.
   */
  public withNeutralLight(fn: () => void): void {
    const d = this.daylight.value;
    const h = this.hazeScale.value;
    const c = this.cloudU.uCloudOn.value;
    this.daylight.value = 1;
    this.hazeScale.value = 0;
    this.cloudU.uCloudOn.value = 0;
    try {
      fn();
    } finally {
      this.daylight.value = d;
      this.hazeScale.value = h;
      this.cloudU.uCloudOn.value = c;
    }
  }

  private prepareModel(scene: THREE.Object3D): void {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.name = PHOTOREAL_TILE_NAME;
      // Drawn after the atmosphere shell when close (it has no depth test, and would lay the haze
      // of the whole path to the horizon over nearby ground); see PlanetaryExplorer
      mesh.renderOrder = 1.2;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        // Sharper at grazing angles (the ground towards the horizon). Set before the texture's
        // first upload, so nothing is uploaded twice
        const map = (mat as THREE.MeshBasicMaterial).map;
        if (map) map.anisotropy = this.maxAnisotropy;
        this.lightMaterial(mat);
      }
    });
  }

  /** The real Sun over the baked photographs: day side crisp true-colour, night side softly lit (or evenly lit when uDaylight > 0). */
  private lightMaterial(mat: THREE.Material): void {
    // 3D tiles are solid opaque photogrammetry meshes; must be opaque with depth write
    mat.transparent = false;
    mat.depthWrite = true;
    const centre = this.earthCentre;
    const tint = this.sunTint;
    const daylight = this.daylight;
    // Chain onto any hook already there (the fade plugin wraps the material with its own)
    const previous = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, renderer) => {
      previous?.call(mat, shader, renderer);
      Object.assign(shader.uniforms, {
        uEarthC: centre, uSunW: SUN_WORLD, uSunTint: tint, uDaylight: daylight, uEarthInv: this.earthInv,
        uKmPerUnit: this.kmPerUnit, uCamAltKm: this.camAltKm, uTime: this.timeS, uDoy: this.dayOfYear,
        uDayMap: this.dayMap, uNightMap: this.nightMap, uHasMaps: this.hasMaps, uHaze: this.hazeScale,
        uNightAir: NIGHT_AIR, uMoonLight: MOON_LIGHT, uMoonDir: MOON_DIR,
        uDetailP0: this.detailP0, uDetailE: this.detailE, uDetailN: this.detailN,
        ...this.cloudU,
        ...this.treeShadowU,
      });
      // Google's tiles carry positions and photo coordinates only, no normals: their light and
      // shadows are already in the photographs. What is laid over them here comes from where the
      // ground is (its latitude, height and place on the globe), the date and the hour.
      shader.vertexShader = shader.vertexShader
        .replace(/void\s+main\s*\(\s*\)\s*\{/, 'varying vec3 vPhotoWorld;\nvoid main() {')
        .replace('#include <project_vertex>', '#include <project_vertex>\n  vPhotoWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace(/void\s+main\s*\(\s*\)\s*\{/, PHOTO_FRAGMENT_HEAD + '\nvoid main() {')
        .replace('#include <opaque_fragment>', PHOTO_FRAGMENT_BODY + '\n#include <opaque_fragment>\n  // Marks the pixel as a tile (alpha 0): the procedural terrain, drawn after, leaves it alone\n  gl_FragColor.a = 0.0;');
    };
    mat.needsUpdate = true;
  }

  private updateAttribution(): void {
    const el = this.attributionEl;
    if (!el) return;
    const now = performance.now();
    if (now - this.lastAttribution < 1000) return;
    this.lastAttribution = now;
    if (!this.showing) {
      el.style.display = 'none';
      return;
    }
    const parts = this.tiles.getAttributions().filter((a) => a.type === 'string').map((a) => String(a.value)).filter(Boolean);
    el.textContent = `Google${parts.length ? ` · ${parts.join(' · ')}` : ''} · Places © OpenStreetMap · Weather Open-Meteo`;
    el.style.display = 'block';
  }

  private renderer: THREE.WebGLRenderer | null = null;
  private uploadBudgetMs = 4;
  private uploadQueue: Array<() => void> = [];
  private uploadPump = 0;

  /** Upload a tile's textures within the per-frame budget; resolves once they are on the GPU. */
  private uploadInTurn(scene: THREE.Object3D): Promise<void> {
    const maps: THREE.Texture[] = [];
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      for (const mat of !m ? [] : Array.isArray(m) ? m : [m]) {
        const map = (mat as THREE.MeshBasicMaterial).map;
        if (map && map.image) {
          // Before the upload: the filtering is fixed with it
          map.anisotropy = this.maxAnisotropy;
          maps.push(map);
        }
      }
    });
    if (maps.length === 0 || !this.renderer || typeof requestAnimationFrame === 'undefined') return Promise.resolve();
    return new Promise<void>((resolve) => {
      this.uploadQueue.push(() => {
        for (const t of maps) this.renderer?.initTexture(t);
        resolve();
      });
      if (this.uploadPump === 0) this.uploadPump = requestAnimationFrame(this.pumpUploads);
    });
  }

  private pumpUploads = (): void => {
    const start = performance.now();
    // At least one a frame, so a slow device still gets there
    do this.uploadQueue.shift()?.();
    while (this.uploadQueue.length > 0 && performance.now() - start < this.uploadBudgetMs);
    this.uploadPump = this.uploadQueue.length > 0 ? requestAnimationFrame(this.pumpUploads) : 0;
  };

  public dispose(): void {
    if (this.uploadPump) cancelAnimationFrame(this.uploadPump);
    for (const job of this.uploadQueue.splice(0)) job();
    this.holder.removeFromParent();
    this.tiles.dispose();
    this.dracoLoader.dispose();
    this.attributionEl?.remove();
    if (PhotorealEarth.current === this) PhotorealEarth.current = null;
  }
}
