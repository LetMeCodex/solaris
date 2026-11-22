import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR, SKY_OVERCAST, VALLEY_FOG } from './AerialPerspective';
import { createCloudNoiseFallback, loadCloudNoiseTexture } from './cloudNoiseLoader';

/**
 * Ray-marched volumetric clouds ported verbatim from CloudSea onto Solaris's spherical WebGL2
 * post-pass (`LensPipeline`), with depth-buffer occlusion against terrain/3D Tiles and planet curvature.
 *
 * All distances inside shader uniforms are in kilometres (camera at the floating-origin).
 */

export interface CloudLayer {
  /** Fraction of the sky covered, 0..1. */
  cover: number;
  /** Continuous lower deck carpet fill, 0..1 (CloudSea default 0.84). */
  deck: number;
  /** Cloud base and top, km above sea level. */
  baseKm: number;
  /** Cloud top, km above sea level. */
  topKm: number;
  /** 0 fair-weather cumulus .. 1 flat stratus deck (used for ground shadows & light weighting). */
  stratus: number;
  /** CloudSea extinction coefficient (default 1.5). */
  density: number;
  /** Scale conversion: kilometres per CloudSea unit (~0.18..0.28). */
  unitKm: number;
  /** Maximum raymarch distance in km (up to 160 km horizon). */
  reachKm: number;
  /** Drift in CloudSea units (x, z). */
  windKm: THREE.Vector2;
  /** Continuous CloudSea drift (x, z) in CloudSea units. */
  drift: THREE.Vector2;
  /** Evolving CloudSea weather age (seconds). */
  evolveKm: number;
}

const marchVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const marchFragment = /* glsl */ `
precision highp float;
${AERIAL_PERSPECTIVE_GLSL}
precision highp sampler3D;
uniform sampler2D tDepth;
uniform sampler3D tNoise;
uniform mat4 uProjInv;
uniform float uNear;
uniform float uFar;
uniform mat3 uCamRot;
uniform mat3 uEarthRot;
uniform vec3 uEarthC;
uniform vec3 uPatchEast;
uniform vec3 uPatchNorth;
uniform float uKmPerUnit;
uniform float uR0;
uniform float uBase;
uniform float uTop;
uniform float uCover;
uniform float uDeck;
uniform float uStratus;
uniform float uDensity;
uniform float uUnitKm;
uniform float uReach;
uniform vec2 uDrift;
uniform float uAge;
uniform float uFrame;
uniform float uSteps;
uniform float uStepScale;
uniform float uSunSteps;
uniform float uDetail;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uSkyAmb;
uniform vec3 uGroundAmb;
uniform vec3 uHazeCol;
uniform float uHaze;
uniform float uFlash;
varying vec2 vUv;

// Exact CloudSea constants: As=9, xs=23.5, Ls=150, Es=330, Is=34, Ns=2.3, Ss=2.2, Q=0.28, Vs=0.7
const float CS_AS = 9.0;
const float CS_XS = 23.5;
const float CS_LS = 150.0;
const float CS_ES = 330.0;
const float CS_IS = 34.0;
const float CS_NS = 2.3;
const float CS_SS = 2.2;
const float CS_Q = 0.28;
const float CS_VS = 0.7;

vec4 readNoise(vec3 uvw) {
  return textureLod(tNoise, uvw, 0.0);
}

void weatherAt(vec3 s, out float wide, out float farW, out float field, out float edge) {
  wide = (readNoise(vec3(s.x, uAge * 0.5, s.z) / CS_ES).r - 0.5) * 2.2;
  farW = readNoise(vec3(s.z, uAge * 0.3 + 37.0, s.x) / CS_LS).r;
  field = (wide * 0.5 + 0.5) * 0.66 + farW * 0.34;
  edge = 0.6 - uCover * 0.2;
}

float cloudAt(vec3 pKm, float detailW) {
  float rb = uR0 + uBase;
  float thick = max(uTop - uBase, 0.2);
  float o = (length(pKm - uEarthC) - rb) / thick;
  if (o <= 0.0 || o >= 1.0) return 0.0;

  vec3 q = uEarthRot * (pKm - uEarthC);
  vec3 i = vec3(dot(q, uPatchEast) / uUnitKm + uDrift.x, o * 15.0, dot(q, uPatchNorth) / uUnitKm + uDrift.y);

  float wide, farW, field, edge;
  weatherAt(i, wide, farW, field, edge);

  float coverGate = smoothstep(0.0, 0.12, uCover);
  float m = smoothstep(edge, edge + 0.1, field) * 0.86 * coverGate;
  float v = uDeck;
  float billow = (readNoise(vec3(i.x, uAge * 0.15 + 11.0, i.z) / CS_IS).g - 0.5) * 2.0;
  float E = clamp(smoothstep(edge, edge + 0.2, field) * 0.82 + 0.24 + billow * 0.22, 0.12, 1.0);
  float I = smoothstep(0.0, 0.11, o) * (1.0 - smoothstep(E * 0.5, E, o));
  float f = farW * 0.1 + 0.13;
  float z = smoothstep(0.0, 0.11, o) * (1.0 - smoothstep(f * 0.45, f, o));

  if (I <= (1.0 - m) && z <= (1.0 - v)) return 0.0;

  vec3 V = i + vec3(wide, farW - 0.5, -wide) * CS_SS;
  vec3 F = vec3(uAge * 0.004, uAge * 0.0025, 0.0);
  float B = readNoise(V / CS_AS + F).r * 0.55 + readNoise(V / CS_XS + F.zxy + 0.37).r * 0.45;
  float D = clamp((B - CS_Q) / (CS_VS - CS_Q), 0.0, 1.0);

  float r0 = clamp((D * I - (1.0 - m)) / max(m, 0.001), 0.0, 1.0);
  float r1 = clamp((D * z - (1.0 - v)) / max(v, 0.001), 0.0, 1.0);
  float e = max(r0, r1);

  if (detailW > 0.02 && e > 0.0) {
    vec4 C = readNoise(i / CS_NS - F * 9.0);
    float d = C.g * 0.6 + C.b * 0.4;
    // Soft billowy erosion preserves smooth photographic cloud rims without harsh dark speckles
    float N = mix(d, 1.0 - d, clamp(o * 2.5, 0.0, 1.0)) * 0.24 * detailW;
    e = smoothstep(0.0, 0.14, e) * clamp((e - N) / max(1.0 - N, 1e-4), 0.0, 1.0);
  }
  return e;
}

float towardsSun(vec3 pKm) {
  float acc = 0.0;
  float prev = 0.0;
  float s0 = 0.45 * uUnitKm;
  float s1 = 1.40 * uUnitKm;
  float s2 = 3.60 * uUnitKm;
  float s3 = 8.50 * uUnitKm;

  if (uSunSteps > 0.5) { acc += cloudAt(pKm + uSunDir * s0, 0.0) * (s0 - prev); prev = s0; }
  if (uSunSteps > 1.5) { acc += cloudAt(pKm + uSunDir * s1, 0.0) * (s1 - prev); prev = s1; }
  if (uSunSteps > 2.5) { acc += cloudAt(pKm + uSunDir * s2, 0.0) * (s2 - prev); prev = s2; }
  if (uSunSteps > 3.5) { acc += cloudAt(pKm + uSunDir * s3, 0.0) * (s3 - prev); }

  float i = acc * uDensity * (0.55 / uUnitKm);
  return (exp(-i) + 0.4 * exp(-0.22 * i)) / 1.4;
}

float hg(float mu, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(max(1.0 + g2 - 2.0 * g * mu, 1e-4), 1.5);
}

// Ray / sphere (centre c, radius r): near and far distances, or (-1,-1)
vec2 sphere(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float h = b * b - (dot(oc, oc) - r * r);
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}

void main() {
  float depth = textureLod(tDepth, vUv, 0.0).x;
  vec4 vp = uProjInv * vec4(vUv * 2.0 - 1.0, -1.0, 1.0);
  vec3 dirV = normalize(vp.xyz / vp.w);
  vec3 rd = normalize(uCamRot * dirV);
  float viewZ = uNear / max((1.0 - depth) + depth * uNear / uFar, 1e-30);
  float sceneKm = depth >= 0.9999999 ? 1e9 : viewZ / max(-dirV.z, 1e-4) * uKmPerUnit;

  vec3 ro = vec3(0.0);
  float rb = uR0 + uBase;
  float rt = uR0 + uTop;
  float camR = length(uEarthC);
  vec2 tTop = sphere(ro, rd, uEarthC, rt);
  vec2 tBot = sphere(ro, rd, uEarthC, rb);

  float t0, t1;
  if (camR > rt) {
    if (tTop.y < 0.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = max(tTop.x, 0.0);
    t1 = tBot.x > 0.0 ? tBot.x : tTop.y;
  } else if (camR < rb) {
    t0 = max(tBot.y, 0.0);
    t1 = tTop.y;
  } else {
    t0 = 0.0;
    t1 = tBot.x > 0.0 ? tBot.x : tTop.y;
  }

  float reach = max(uReach, 1.0);
  t1 = min(t1, min(sceneKm, reach));
  if (t1 <= t0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  float steps = clamp(uSteps * uStepScale, 12.0, 96.0);
  float vGrow = pow(reach / (0.9 * uUnitKm), 1.0 / steps) - 1.0;
  float L = clamp(pow(t1 / max(t0, 0.9 * uUnitKm), 1.0 / steps) - 1.0, 0.0, vGrow);
  float E = t0 > uUnitKm ? 0.04 * uUnitKm : 0.28 * uUnitKm;

  // Analytical Interleaved Gradient Noise (Jorge Jimenez) + golden-ratio temporal rotation:
  // blue-noise-like spatial spectrum that integrates cleanly under temporal reprojection without grain.
  float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  float jit = fract(ign + uFrame * 0.61803399);
  float f = t0 + (t0 * L + E) * jit;

  float T = 1.0;
  vec3 V = vec3(0.0);
  float thick = max(uTop - uBase, 0.2);

  float mu = dot(rd, uSunDir);
  float D = min(mix(hg(mu, 0.62), hg(mu, -0.25), 0.3), 2.6);

  // Horizon haze with subtle forward solar glare so far clouds melt smoothly into Solaris's sky dome
  vec3 upCam = normalize(-uEarthC);
  float sunUp = dot(upCam, uSunDir);
  float sunHorizonGlare = (pow(max(mu, 0.0), 6.0) * 0.18 + pow(max(mu, 0.0), 48.0) * 0.14) * smoothstep(-0.14, 0.2, sunUp);
  vec3 R = uHazeCol + uSunCol * sunHorizonGlare;

  for (int i = 0; i < 96; i++) {
    if (float(i) >= steps || f >= t1 || T < 0.015) break;
    float dStep = min(f * L + E, t1 - f);
    float tMid = f + dStep * 0.5;
    vec3 N = ro + rd * tMid;
    float dUnits = tMid / uUnitKm;
    float ss = uDetail > 0.5 ? (1.0 - smoothstep(6.0, 45.0, dUnits)) : 0.0;
    float nearFade = smoothstep(-1.5, 5.0, dUnits) * 0.75 + 0.25;
    float farFade = smoothstep(reach, reach * 0.80, tMid);
    float Z = cloudAt(N, ss) * nearFade * farFade;

    if (Z > 0.003) {
      float ts = towardsSun(N);
      float J = clamp((length(N - uEarthC) - rb) / thick, 0.0, 1.0);
      // Physically-inspired Beer-Powder multi-scattering: luminous sunlit silver-lining rims + rich shaded bases
      float powder = 1.0 - 0.65 * exp(-Z * 5.0);
      float es = pow(ts, 1.15);
      vec3 os = uSunCol * mix(min(D, 1.0) * 0.10, D * (0.72 + 0.55 * powder), es) * 0.85;
      vec3 as = mix(uGroundAmb, uSkyAmb, smoothstep(0.05, 0.65, J)) * mix(0.75, 1.0, J);
      vec3 flashLit = vec3(0.75, 0.85, 1.0) * uFlash * (0.4 + 0.6 * (1.0 - ts));
      vec3 is = mix(R, os + as + flashLit, exp(-tMid / (reach * 0.62)));
      float K = 1.0 - exp(-Z * uDensity * dStep / uUnitKm);
      V += is * K * T;
      T *= (1.0 - K);
    }
    f += dStep;
  }

  gl_FragColor = vec4(V, T);
}
`;

const reprojectFragment = /* glsl */ `
precision highp float;
uniform sampler2D tCurrent;
uniform sampler2D tHistory;
uniform sampler2D tDepth;
uniform mat4 uCurrInvViewProj;
uniform mat4 uPrevViewProj;
uniform vec2 uTexelSize;
uniform float uBlend;
uniform float uNear;
uniform float uFar;
varying vec2 vUv;

float linearDepth(float d) {
  return uNear / max((1.0 - d) + d * (uNear / uFar), 1e-20);
}

void main() {
  vec4 curr = texture2D(tCurrent, vUv);
  if (uBlend <= 0.001) {
    gl_FragColor = curr;
    return;
  }

  // Reproject view ray via rotation-only inverse current -> previous VP (exact at floating origin)
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 viewWorld = uCurrInvViewProj * vec4(ndc, 1.0, 1.0);
  viewWorld /= max(abs(viewWorld.w), 1e-6);
  vec4 prevClip = uPrevViewProj * vec4(viewWorld.xyz, 1.0);
  vec2 prevUv = prevClip.w > 0.0 ? (prevClip.xy / prevClip.w) * 0.5 + 0.5 : vec2(-1.0);

  if (prevUv.x < 0.0 || prevUv.x > 1.0 || prevUv.y < 0.0 || prevUv.y > 1.0) {
    gl_FragColor = curr;
    return;
  }

  // 3x3 neighborhood mean & variance clipping (eliminates cloud ghosting during fast rolls & dives)
  vec4 m1 = vec4(0.0);
  vec4 m2 = vec4(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec4 s = texture2D(tCurrent, vUv + vec2(float(x), float(y)) * uTexelSize);
      m1 += s;
      m2 += s * s;
    }
  }
  vec4 mean = m1 / 9.0;
  vec4 sigma = sqrt(max(m2 / 9.0 - mean * mean, vec4(0.0)));
  vec4 cMin = mean - sigma * 1.25;
  vec4 cMax = mean + sigma * 1.25;

  vec4 hist = clamp(texture2D(tHistory, prevUv), cMin, cMax);

  // Reduce history weight across sharp foreground depth edges (buildings/ridges) and fast motion
  float dCur = linearDepth(textureLod(tDepth, vUv, 0.0).x);
  float dPrev = linearDepth(textureLod(tDepth, prevUv, 0.0).x);
  float depthRatio = abs(dCur - dPrev) / max(min(dCur, dPrev), 1e-4);
  float depthValid = 1.0 - smoothstep(0.08, 0.35, depthRatio);

  float motion = length(vUv - prevUv);
  float w = uBlend * depthValid * (1.0 - smoothstep(0.015, 0.09, motion) * 0.55);
  vec4 outCol = mix(curr, hist, clamp(w, 0.0, 0.90));
  gl_FragColor = vec4(max(outCol.rgb, 0.0), clamp(outCol.a, 0.0, 1.0));
}
`;

const bilateralUpsampleFragment = /* glsl */ `
precision highp float;
uniform sampler2D tClouds;
uniform sampler2D tDepth;
uniform vec2 uCloudTexel;
uniform float uNear;
uniform float uFar;
uniform float uHasDepth;
varying vec2 vUv;

float linearDepth(float d) {
  return uNear / max((1.0 - d) + d * (uNear / uFar), 1e-20);
}

void main() {
  vec4 c;
  if (uHasDepth > 0.5) {
    // 4-tap depth-aware bilateral upsample into a depthless offscreen buffer (avoids WebGL2
    // depth-attachment feedback loops while eliminating half-res pixelation & skyscraper halos).
    float dHi = linearDepth(textureLod(tDepth, vUv, 0.0).x);
    vec2 f = fract(vUv / uCloudTexel - 0.5);
    vec2 baseUv = (floor(vUv / uCloudTexel - 0.5) + 0.5) * uCloudTexel;

    vec2 uv00 = clamp(baseUv, uCloudTexel * 0.5, 1.0 - uCloudTexel * 0.5);
    vec2 uv10 = clamp(baseUv + vec2(uCloudTexel.x, 0.0), uCloudTexel * 0.5, 1.0 - uCloudTexel * 0.5);
    vec2 uv01 = clamp(baseUv + vec2(0.0, uCloudTexel.y), uCloudTexel * 0.5, 1.0 - uCloudTexel * 0.5);
    vec2 uv11 = clamp(baseUv + uCloudTexel, uCloudTexel * 0.5, 1.0 - uCloudTexel * 0.5);

    float d00 = linearDepth(textureLod(tDepth, uv00, 0.0).x);
    float d10 = linearDepth(textureLod(tDepth, uv10, 0.0).x);
    float d01 = linearDepth(textureLod(tDepth, uv01, 0.0).x);
    float d11 = linearDepth(textureLod(tDepth, uv11, 0.0).x);

    float invScale = 1.0 / max(dHi * 0.14, 1e-4);
    float w00 = (1.0 - f.x) * (1.0 - f.y) * exp(-abs(dHi - d00) * invScale);
    float w10 = f.x * (1.0 - f.y) * exp(-abs(dHi - d10) * invScale);
    float w01 = (1.0 - f.x) * f.y * exp(-abs(dHi - d01) * invScale);
    float w11 = f.x * f.y * exp(-abs(dHi - d11) * invScale);

    float wSum = w00 + w10 + w01 + w11;
    if (wSum > 1e-4) {
      c = (
        texture2D(tClouds, uv00) * w00 +
        texture2D(tClouds, uv10) * w10 +
        texture2D(tClouds, uv01) * w01 +
        texture2D(tClouds, uv11) * w11
      ) / wSum;
    } else {
      c = texture2D(tClouds, vUv);
    }
  } else {
    c = texture2D(tClouds, vUv);
  }
  gl_FragColor = vec4(max(c.rgb, 0.0), clamp(c.a, 0.0, 1.0));
}
`;

const compositeFragment = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D tClouds;
varying vec2 vUv;
void main() {
  vec4 s = texture2D(tDiffuse, vUv);
  vec4 c = texture2D(tClouds, vUv);
  gl_FragColor = vec4(s.rgb * c.a + c.rgb, s.a);
}
`;

export class VolumetricCloudPass extends Pass {
  public layer: CloudLayer = {
    cover: 0.55,
    deck: 0.84,
    baseKm: 1.2,
    topKm: 3.6,
    stratus: 0,
    density: 1.5,
    unitKm: 0.18,
    reachKm: 160,
    windKm: new THREE.Vector2(),
    drift: new THREE.Vector2(),
    evolveKm: 0,
  };

  public readonly u = {
    tDepth: { value: null as THREE.Texture | null },
    tNoise: { value: createCloudNoiseFallback() as THREE.Data3DTexture },
    uProjInv: { value: new THREE.Matrix4() },
    uNear: { value: 1e-3 },
    uFar: { value: 1e8 },
    uCamRot: { value: new THREE.Matrix3() },
    uEarthRot: { value: new THREE.Matrix3() },
    uEarthC: { value: new THREE.Vector3() },
    uPatchEast: { value: new THREE.Vector3(1, 0, 0) },
    uPatchNorth: { value: new THREE.Vector3(0, 0, 1) },
    uKmPerUnit: { value: 1 },
    uR0: { value: 6378 },
    uBase: { value: 1.2 },
    uTop: { value: 3.6 },
    uCover: { value: 0.55 },
    uDeck: { value: 0.84 },
    uStratus: { value: 0 },
    uDensity: { value: 1.5 },
    uUnitKm: { value: 0.18 },
    uReach: { value: 160 },
    uDrift: { value: new THREE.Vector2() },
    uAge: { value: 0 },
    uFrame: { value: 0 },
    uSteps: { value: 52 },
    uStepScale: { value: 1 },
    uSunSteps: { value: 4 },
    uDetail: { value: 1 },
    uNightAir: NIGHT_AIR,
    uMoonLight: MOON_LIGHT,
    uMoonDir: MOON_DIR,
    uValleyFog: VALLEY_FOG,
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunCol: { value: new THREE.Color('#fffaf2').multiplyScalar(3.35) },
    uSkyAmb: { value: new THREE.Color('#86b5f2').multiplyScalar(1.45) },
    uGroundAmb: { value: new THREE.Color('#b6cce8').multiplyScalar(1.05) },
    uHazeCol: { value: new THREE.Color('#9ec8f5').multiplyScalar(1.30) },
    uHaze: { value: 1 },
    uFlash: { value: 0 },
  };

  private readonly march: FullScreenQuad;
  private readonly reproject: FullScreenQuad;
  private readonly reprojectMat: THREE.ShaderMaterial;
  private readonly upsample: FullScreenQuad;
  private readonly upsampleMat: THREE.ShaderMaterial;
  private readonly composite: FullScreenQuad;
  private readonly compositeMat: THREE.ShaderMaterial;
  private target: THREE.WebGLRenderTarget;
  private history: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private upsampleTarget: THREE.WebGLRenderTarget;
  private histIdx = 0;
  private hasHistory = false;
  private readonly currViewProj = new THREE.Matrix4();
  private readonly prevViewProj = new THREE.Matrix4();
  private readonly tmpRotView = new THREE.Matrix4();
  private readonly lastEarthC = new THREE.Vector3();
  private scale: number;
  private lastWidth = 1;
  private lastHeight = 1;
  private targetChecked = false;
  private readonly tmpClearColor = new THREE.Color();
  private cancelNoise: (() => void) | null = null;
  private noiseLoaded = false;

  constructor(scale = 0.65) {
    super();
    this.scale = scale;
    this.enabled = false;
    this.needsSwap = true;
    this.march = new FullScreenQuad(
      new THREE.ShaderMaterial({
        uniforms: this.u,
        vertexShader: marchVertex,
        fragmentShader: marchFragment,
        depthTest: false,
        depthWrite: false,
      }),
    );
    this.reprojectMat = new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tHistory: { value: null },
        tDepth: { value: null },
        uCurrInvViewProj: { value: new THREE.Matrix4() },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uTexelSize: { value: new THREE.Vector2(1, 1) },
        uBlend: { value: 0.84 },
        uNear: { value: 1e-3 },
        uFar: { value: 1e8 },
      },
      vertexShader: marchVertex,
      fragmentShader: reprojectFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.reproject = new FullScreenQuad(this.reprojectMat);
    this.upsampleMat = new THREE.ShaderMaterial({
      uniforms: {
        tClouds: { value: null },
        tDepth: { value: null },
        uCloudTexel: { value: new THREE.Vector2(1, 1) },
        uNear: { value: 1e-3 },
        uFar: { value: 1e8 },
        uHasDepth: { value: 0 },
      },
      vertexShader: marchVertex,
      fragmentShader: bilateralUpsampleFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.upsample = new FullScreenQuad(this.upsampleMat);
    this.compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tClouds: { value: null },
      },
      vertexShader: marchVertex,
      fragmentShader: compositeFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.composite = new FullScreenQuad(this.compositeMat);
    this.target = this.createTarget(1, 1, THREE.HalfFloatType);
    this.history = [
      this.createTarget(1, 1, THREE.HalfFloatType),
      this.createTarget(1, 1, THREE.HalfFloatType),
    ];
    this.upsampleTarget = this.createTarget(1, 1, THREE.HalfFloatType);
  }

  private createTarget(w: number, h: number, type: THREE.TextureDataType): THREE.WebGLRenderTarget {
    const rt = new THREE.WebGLRenderTarget(w, h, { type, depthBuffer: false });
    rt.texture.minFilter = rt.texture.magFilter = THREE.LinearFilter;
    return rt;
  }

  private resizeTargets(w: number, h: number): void {
    if (w !== this.target.width || h !== this.target.height) {
      this.target.setSize(w, h);
      this.history[0].setSize(w, h);
      this.history[1].setSize(w, h);
      this.hasHistory = false;
    }
    if (this.lastWidth !== this.upsampleTarget.width || this.lastHeight !== this.upsampleTarget.height) {
      this.upsampleTarget.setSize(this.lastWidth, this.lastHeight);
    }
  }

  private ensureTargetCompatibility(renderer: THREE.WebGLRenderer): void {
    if (this.targetChecked) return;
    this.targetChecked = true;
    const isWebGL2 = renderer.capabilities?.isWebGL2 ?? false;
    const canHalfFloat = isWebGL2
      ? renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float')
      : renderer.extensions.has('EXT_color_buffer_half_float');
    if (!canHalfFloat && this.target.texture.type !== THREE.UnsignedByteType) {
      const w = Math.max(1, Math.round(this.lastWidth * this.scale));
      const h = Math.max(1, Math.round(this.lastHeight * this.scale));
      this.target.dispose();
      this.history[0].dispose();
      this.history[1].dispose();
      this.upsampleTarget.dispose();
      this.target = this.createTarget(w, h, THREE.UnsignedByteType);
      this.history = [
        this.createTarget(w, h, THREE.UnsignedByteType),
        this.createTarget(w, h, THREE.UnsignedByteType),
      ];
      this.upsampleTarget = this.createTarget(this.lastWidth, this.lastHeight, THREE.UnsignedByteType);
      this.hasHistory = false;
    }
  }

  /** Adaptively update CloudSea target resolution and raymarch step scale. */
  public setAdaptiveQuality(scale: number, stepScale = 1): void {
    const nextScale = Math.max(0.36, Math.min(0.85, scale));
    this.u.uStepScale.value = Math.max(0.45, Math.min(1, stepScale));
    this.scale = nextScale;
    const nextW = Math.max(1, Math.round(this.lastWidth * this.scale));
    const nextH = Math.max(1, Math.round(this.lastHeight * this.scale));
    this.resizeTargets(nextW, nextH);
  }

  /** Mark noise volume and target ready for re-upload after a WebGL context restore. */
  public onContextRestored(): void {
    this.targetChecked = false;
    this.hasHistory = false;
    this.u.tNoise.value.needsUpdate = true;
  }

  public setSize(width: number, height: number): void {
    this.lastWidth = Math.max(1, width);
    this.lastHeight = Math.max(1, height);
    const w = Math.max(1, Math.round(this.lastWidth * this.scale));
    const h = Math.max(1, Math.round(this.lastHeight * this.scale));
    this.resizeTargets(w, h);
  }

  /** Per frame, before the draw (camera at the floating origin's place). */
  public setView(camera: THREE.PerspectiveCamera): void {
    this.u.uProjInv.value.copy(camera.projectionMatrixInverse);
    this.u.uNear.value = camera.near;
    this.u.uFar.value = camera.far;
    this.u.uCamRot.value.setFromMatrix4(camera.matrixWorld);

    camera.updateMatrixWorld();
    this.tmpRotView.copy(camera.matrixWorldInverse).setPosition(0, 0, 0);
    this.currViewProj.multiplyMatrices(camera.projectionMatrix, this.tmpRotView);
  }

  /** Whether the 64^3 worker cloud volume has replaced the initial placeholder texture. */
  public isNoiseReady(): boolean {
    return this.noiseLoaded;
  }

  /** The scene's depth this frame (the passes after this one read a buffer without it). */
  public lastDepth: THREE.Texture | null = null;

  /** Start generating the 64x64x64 RGBA Perlin-Worley volume asynchronously in a Web Worker. */
  public warm(): void {
    if (this.noiseLoaded || this.cancelNoise) return;
    this.cancelNoise = loadCloudNoiseTexture((tex) => {
      this.cancelNoise = null;
      this.u.tNoise.value.dispose();
      this.u.tNoise.value = tex;
      this.noiseLoaded = true;
    });
  }

  public render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    if (renderer.getContext?.()?.isContextLost?.()) return;
    this.ensureTargetCompatibility(renderer);
    if (!this.noiseLoaded) {
      this.warm();
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(this.target);
      const clear = renderer.getClearColor(this.tmpClearColor);
      const clearA = renderer.getClearAlpha();
      renderer.setClearColor(0x000000, 1);
      renderer.clear(true, false, false);
      renderer.setClearColor(clear, clearA);
      this.compositeMat.uniforms.tDiffuse.value = readBuffer.texture;
      this.compositeMat.uniforms.tClouds.value = this.target.texture;
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      this.composite.render(renderer);
      renderer.setRenderTarget(prev);
      this.hasHistory = false;
      return;
    }

    this.u.tDepth.value = readBuffer.depthTexture;
    this.lastDepth = readBuffer.depthTexture;
    const L = this.layer;
    const ov = SKY_OVERCAST.value;
    this.u.uBase.value = L.baseKm;
    this.u.uTop.value = L.topKm;
    this.u.uCover.value = Math.max(L.cover, ov * 0.92);
    this.u.uDeck.value = L.deck;
    this.u.uStratus.value = Math.max(L.stratus, ov * 0.85);
    this.u.uDensity.value = Math.max(L.density, ov * 0.9);
    this.u.uUnitKm.value = Math.max(0.05, L.unitKm);
    this.u.uReach.value = Math.max(10, L.reachKm);
    this.u.uDrift.value.copy(L.drift);
    this.u.uAge.value = L.evolveKm % 1024;
    this.u.uFrame.value = (this.u.uFrame.value + 1) % 1024;

    // Reset temporal history cleanly if camera teleported (e.g. landmark hop > 2 km in one frame)
    if (this.hasHistory && this.u.uEarthC.value.distanceToSquared(this.lastEarthC) > 4.0) {
      this.hasHistory = false;
    }
    this.lastEarthC.copy(this.u.uEarthC.value);

    const prev = renderer.getRenderTarget();
    // Pass 1: half-res volumetric raymarch with IGN + golden-ratio temporal dithering
    renderer.setRenderTarget(this.target);
    this.march.render(renderer);

    // Pass 2: temporal reprojection + 3x3 variance clipping into ping-pong history buffer
    const readHist = this.history[this.histIdx];
    const writeHist = this.history[1 - this.histIdx];
    const ru = this.reprojectMat.uniforms;
    ru.tCurrent.value = this.target.texture;
    ru.tHistory.value = readHist.texture;
    ru.tDepth.value = readBuffer.depthTexture;
    ru.uCurrInvViewProj.value.copy(this.currViewProj).invert();
    ru.uPrevViewProj.value.copy(this.hasHistory ? this.prevViewProj : this.currViewProj);
    ru.uTexelSize.value.set(1 / Math.max(1, this.target.width), 1 / Math.max(1, this.target.height));
    ru.uBlend.value = this.hasHistory ? 0.85 : 0.0;
    ru.uNear.value = this.u.uNear.value;
    ru.uFar.value = this.u.uFar.value;

    renderer.setRenderTarget(writeHist);
    this.reproject.render(renderer);
    this.histIdx = 1 - this.histIdx;
    this.prevViewProj.copy(this.currViewProj);
    this.hasHistory = true;

    // Pass 3: full-res depth-aware 4-tap bilateral upsample into a depthless target (ZERO WebGL2 feedback loop!)
    const uu = this.upsampleMat.uniforms;
    uu.tClouds.value = writeHist.texture;
    uu.tDepth.value = readBuffer.depthTexture;
    uu.uCloudTexel.value.set(1 / Math.max(1, writeHist.width), 1 / Math.max(1, writeHist.height));
    uu.uNear.value = this.u.uNear.value;
    uu.uFar.value = this.u.uFar.value;
    uu.uHasDepth.value = readBuffer.depthTexture ? 1 : 0;

    renderer.setRenderTarget(this.upsampleTarget);
    this.upsample.render(renderer);

    // Pass 4: pure color composite onto writeBuffer (never binds tDepth while writing writeBuffer!)
    const cu = this.compositeMat.uniforms;
    cu.tDiffuse.value = readBuffer.texture;
    cu.tClouds.value = this.upsampleTarget.texture;

    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.composite.render(renderer);
    renderer.setRenderTarget(prev);
  }

  public dispose(): void {
    this.cancelNoise?.();
    this.cancelNoise = null;
    this.march.dispose();
    this.reproject.dispose();
    this.reprojectMat.dispose();
    this.upsample.dispose();
    this.upsampleMat.dispose();
    this.composite.dispose();
    this.compositeMat.dispose();
    (this.march.material as THREE.Material).dispose();
    this.target.dispose();
    this.history[0].dispose();
    this.history[1].dispose();
    this.upsampleTarget.dispose();
    this.u.tNoise.value.dispose();
  }
}
