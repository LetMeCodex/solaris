import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { AERIAL_PERSPECTIVE_GLSL, MOON_DIR, MOON_LIGHT, NIGHT_AIR } from './AerialPerspective';

/**
 * Ray-marched volumetric clouds over Google's 3D Earth (jet mode).
 *
 * A post pass after the scene is drawn: for each pixel a ray leaves the camera and is marched
 * through a cloud layer (a spherical shell around Earth, between the cloud base and top), stopping
 * at whatever the scene drew there (the depth buffer), so mountains and towers stand in front of
 * clouds and clouds hang in front of distant ground. Density comes from a tiling 3D noise texture
 * (Perlin-Worley for the billows, Worley for the eroded edges) fixed to the Earth, shaped by a
 * coverage map from the live weather. Each sample is lit by a short march towards the Sun (Beer's
 * law with the "powder" darkening of cloud interiors), a two-lobe phase function (the bright
 * silver lining looking towards the Sun) and sky and ground ambient light; the result fades into
 * the air's haze with distance. Drawn at reduced resolution and composited over the scene.
 *
 * Everything is in kilometres, camera at the origin (the scene's floating origin).
 */

export interface CloudLayer {
  /** Fraction of the sky covered, 0..1. */
  cover: number;
  /** Cloud base and top, km above sea level. */
  baseKm: number;
  topKm: number;
  /** 0 fair-weather cumulus .. 1 flat stratus deck. */
  stratus: number;
  /** Extinction per km at full density. */
  density: number;
  /** Drift, km (east, north-ish, in Earth's frame). */
  windKm: THREE.Vector2;
  /** How far the billows have churned (km of noise travelled), growing with time. */
  evolveKm: number;
}

/**
 * Tiling 3D noise: R = Perlin-Worley billows, G = Worley detail. Built once on the CPU, a few
 * slices a frame (`step`, within a time budget): built in one go it froze its first frame 0.4 s.
 */
function noiseBuilder(size: number): { step(budgetMs: number): THREE.Data3DTexture | null } {
  const data = new Uint8Array(size * size * size * 2);
  // Worley points for a tiling cell grid
  const worleyGrid = (cells: number, seed: number): Float32Array => {
    const pts = new Float32Array(cells * cells * cells * 3);
    let s = seed;
    const rnd = (): number => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < pts.length; i++) pts[i] = rnd();
    return pts;
  };
  const worley = (x: number, y: number, z: number, cells: number, pts: Float32Array): number => {
    const fx = x * cells, fy = y * cells, fz = z * cells;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    let best = 9;
    for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const cx = ix + dx, cy = iy + dy, cz = iz + dz;
      const wx = ((cx % cells) + cells) % cells, wy = ((cy % cells) + cells) % cells, wz = ((cz % cells) + cells) % cells;
      const k = ((wz * cells + wy) * cells + wx) * 3;
      const px = cx + pts[k], py = cy + pts[k + 1], pz = cz + pts[k + 2];
      const d = (px - fx) ** 2 + (py - fy) ** 2 + (pz - fz) ** 2;
      if (d < best) best = d;
    }
    return 1 - Math.min(1, Math.sqrt(best));
  };
  // Tiling value-gradient noise (period = cells)
  const grad = (cells: number, seed: number): Float32Array => worleyGrid(cells, seed);
  const perlin = (x: number, y: number, z: number, cells: number, g: Float32Array): number => {
    const fx = x * cells, fy = y * cells, fz = z * cells;
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
    const tx = fx - ix, ty = fy - iy, tz = fz - iz;
    const sm = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);
    const v = (cx: number, cy: number, cz: number): number => {
      const wx = ((cx % cells) + cells) % cells, wy = ((cy % cells) + cells) % cells, wz = ((cz % cells) + cells) % cells;
      const k = ((wz * cells + wy) * cells + wx) * 3;
      const gx = g[k] * 2 - 1, gy = g[k + 1] * 2 - 1, gz = g[k + 2] * 2 - 1;
      return gx * (fx - cx) + gy * (fy - cy) + gz * (fz - cz);
    };
    const a = sm(tx), b = sm(ty), c = sm(tz);
    const l = (p: number, q: number, t: number): number => p + (q - p) * t;
    return l(
      l(l(v(ix, iy, iz), v(ix + 1, iy, iz), a), l(v(ix, iy + 1, iz), v(ix + 1, iy + 1, iz), a), b),
      l(l(v(ix, iy, iz + 1), v(ix + 1, iy, iz + 1), a), l(v(ix, iy + 1, iz + 1), v(ix + 1, iy + 1, iz + 1), a), b),
      c,
    );
  };
  const g4 = grad(4, 11), g8 = grad(8, 12), g16 = grad(16, 13);
  const w4 = worleyGrid(4, 21), w8 = worleyGrid(8, 22), w16 = worleyGrid(16, 23);
  const w6 = worleyGrid(6, 31), w12 = worleyGrid(12, 32), w24 = worleyGrid(24, 33);
  let o = 0;
  let z = 0;
  const slice = (): void => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size, v = y / size, w = z / size;
        const p = perlin(u, v, w, 4, g4) * 0.6 + perlin(u, v, w, 8, g8) * 0.28 + perlin(u, v, w, 16, g16) * 0.12;
        const pn = Math.min(1, Math.max(0, p * 0.9 + 0.5));
        const wf = worley(u, v, w, 4, w4) * 0.625 + worley(u, v, w, 8, w8) * 0.25 + worley(u, v, w, 16, w16) * 0.125;
        // Perlin-Worley: the Perlin field remapped by the Worley billows
        const pw = Math.min(1, Math.max(0, (pn - (1 - wf)) / Math.max(1e-3, 1 - (1 - wf)) * 0.5 + wf * 0.5));
        const det = worley(u, v, w, 6, w6) * 0.625 + worley(u, v, w, 12, w12) * 0.25 + worley(u, v, w, 24, w24) * 0.125;
        data[o++] = Math.round(pw * 255);
        data[o++] = Math.round(det * 255);
      }
    }
    z++;
  };
  const finish = (): THREE.Data3DTexture => {
  const tex = new THREE.Data3DTexture(data, size, size, size);
  tex.format = THREE.RGFormat;
  tex.type = THREE.UnsignedByteType;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
  };
  return {
    step(budgetMs: number): THREE.Data3DTexture | null {
      const start = performance.now();
      do slice();
      while (z < size && performance.now() - start < budgetMs);
      return z >= size ? finish() : null;
    },
  };
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
uniform float uKmPerUnit;
uniform float uR0;
uniform float uBase;
uniform float uTop;
uniform float uCover;
uniform float uStratus;
uniform float uDensity;
uniform vec2 uWind;
uniform float uEvolve;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uSkyAmb;
uniform vec3 uGroundAmb;
uniform vec3 uHazeCol;
uniform float uHaze;
uniform float uSteps;
varying vec2 vUv;

float h31(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float remap(float v, float a, float b, float c, float d) { return c + (v - a) / max(b - a, 1e-4) * (d - c); }

// Where clouds may be (the weather map): large patches, more of them with more cover
float coverage(vec3 q) {
  float n = vnoise(q / 23.0) * 0.6 + vnoise(q / 9.0) * 0.3 + vnoise(q / 3.7) * 0.1;
  float c = mix(uCover, 1.0, uStratus * 0.6);
  // (the summed noise sits mostly within 0.3-0.7: the cover is spread over that range, so 30% cover
  // reads as 30% of the sky, not the few highest peaks of the noise)
  float lo = mix(0.72, 0.18, c);
  return clamp(remap(n, lo - 0.04, lo + 0.22, 0.0, 1.0), 0.0, 1.0) * step(0.01, uCover);
}

float densityAt(vec3 pKm, float hf, bool detail) {
  vec3 q = uEarthRot * (pKm - uEarthC);
  q.xz += uWind;
  float cov = coverage(q);
  if (cov <= 0.0) return 0.0;
  // Height shape: rounded tops and flat bases for cumulus, a slab for stratus
  float cum = smoothstep(0.0, 0.12, hf) * smoothstep(1.0, 0.55 - 0.35 * cov, hf);
  float str = smoothstep(0.0, 0.2, hf) * smoothstep(1.0, 0.7, hf);
  float shape = mix(cum, str, uStratus);
  // The billows churn: the shapes rise and change through the noise as the layer drifts
  vec2 n = texture(tNoise, q / 5.5 + vec3(0.0, -uEvolve / 5.5, uEvolve * 0.37 / 5.5)).rg;
  float base = remap(n.r, 1.0 - cov * shape, 1.0, 0.0, 1.0);
  if (base <= 0.0) return 0.0;
  if (detail) {
    float d = texture(tNoise, q / 0.9 + vec3(0.0, hf * 0.4 - uEvolve * 2.5, 0.0)).g;
    base = remap(base, d * 0.35 * mix(1.0, 0.4, hf), 1.0, 0.0, 1.0);
  }
  return clamp(base, 0.0, 1.0) * uDensity;
}

float hg(float mu, float g) { float g2 = g * g; return (1.0 - g2) / pow(max(1.0 + g2 - 2.0 * g * mu, 1e-4), 1.5); }

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
  float depth = texture(tDepth, vUv).x;
  // The ray through this pixel (from the near plane: the far plane is at infinity in float)
  vec4 vp = uProjInv * vec4(vUv * 2.0 - 1.0, -1.0, 1.0);
  vec3 dirV = normalize(vp.xyz / vp.w);
  vec3 rd = normalize(uCamRot * dirV);
  // Distance to what the scene drew: view depth from the depth buffer, stable near 1
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
    // Above the layer: from the top down to the base (or out the far side)
    if (tTop.y < 0.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = max(tTop.x, 0.0);
    t1 = tBot.x > 0.0 ? tBot.x : tTop.y;
  } else if (camR < rb) {
    // Below: from the base up to the top
    t0 = tBot.y;
    t1 = tTop.y;
  } else {
    t0 = 0.0;
    t1 = tBot.x > 0.0 ? tBot.x : tTop.y;
  }
  t1 = min(t1, min(sceneKm, 160.0));
  if (t1 <= t0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  float mu = dot(rd, uSunDir);
  float phase = mix(hg(mu, 0.72), hg(mu, -0.2), 0.35);
  // Interleaved gradient noise: start offset per pixel (no banding)
  float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));

  float len = t1 - t0;
  float steps = uSteps;
  float dt = len / steps;
  // Long grazing paths: at least ~120 m resolution near the camera, coarser far away
  float t = t0 + dt * jit;
  float T = 1.0;
  vec3 L = vec3(0.0);
  float distW = 0.0;
  float thick = uTop - uBase;
  for (int i = 0; i < 160; i++) {
    if (float(i) >= steps || T < 0.015 || t > t1) break;
    vec3 p = ro + rd * t;
    float hf = clamp((length(p - uEarthC) - rb) / thick, 0.0, 1.0);
    float d = densityAt(p, hf, true);
    if (d > 0.002) {
      // Light towards the Sun: a few growing steps
      float od = 0.0;
      float ls = thick * 0.08;
      vec3 lp = p;
      for (int j = 0; j < 5; j++) {
        lp += uSunDir * ls;
        float lh = clamp((length(lp - uEarthC) - rb) / thick, 0.0, 1.0);
        od += densityAt(lp, lh, j < 2) * ls;
        ls *= 1.8;
      }
      float sigma = d;
      float beer = exp(-od) ;
      float powder = 1.0 - exp(-2.0 * d * 0.6);
      // Multiple scattering, as octaves: each bounce weaker, reaching deeper, its phase flatter
      float ms = 0.0;
      float aW = 1.0, bW = 1.0, cW = 1.0;
      for (int o = 0; o < 4; o++) {
        float ph = mix(hg(mu * cW, 0.72 * cW), hg(mu * cW, -0.2 * cW), 0.35);
        ms += aW * exp(-od * bW) * ph;
        aW *= 0.5; bW *= 0.45; cW *= 0.5;
      }
      vec3 sun = uSunCol * ms * mix(1.0, powder * 2.0, 0.5);
      vec3 amb = mix(uGroundAmb, uSkyAmb, hf * 0.8 + 0.2);
      vec3 S = (sun + amb) * sigma;
      float Ts = exp(-sigma * dt);
      vec3 Sint = (S - S * Ts) / max(sigma, 1e-4);
      L += T * Sint;
      distW += T * (1.0 - Ts) * t;
      T *= Ts;
    }
    t += dt;
  }
  // Into the haze with distance (the same air the ground is seen through)
  float alpha = 1.0 - T;
  float dMean = alpha > 1e-3 ? distW / alpha : t0;
  float camAlt = camR - uR0;
  float hMean = max(0.0, (camAlt + uBase) * 0.5);
  // The same air as the ground's (AerialPerspective): far cloud fades to the sky's colour, blue by
  // day and warm towards a low Sun, never to a dark band along the horizon
  vec3 pMean = rd * dMean;
  float sunUpC = dot(normalize(pMean - uEarthC), uSunDir);
  vec3 inscat = aerialPerspective(vec3(0.0), dMean, hMean, uHaze, -rd, uSunDir, sunUpC);
  vec3 trans = aerialPerspective(vec3(1.0), dMean, hMean, uHaze, -rd, uSunDir, sunUpC) - inscat;
  L = L * trans + inscat * alpha;
  gl_FragColor = vec4(L, T);
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
  public layer: CloudLayer = { cover: 0, baseKm: 1.5, topKm: 3, stratus: 0, density: 6, windKm: new THREE.Vector2(), evolveKm: 0 };
  public readonly u = {
    tDepth: { value: null as THREE.Texture | null },
    tNoise: { value: null as THREE.Data3DTexture | null },
    uProjInv: { value: new THREE.Matrix4() },
    uNear: { value: 1e-3 },
    uFar: { value: 1e8 },
    uCamRot: { value: new THREE.Matrix3() },
    uEarthRot: { value: new THREE.Matrix3() },
    uEarthC: { value: new THREE.Vector3() },
    uKmPerUnit: { value: 1 },
    uR0: { value: 6378 },
    uBase: { value: 1.5 },
    uTop: { value: 3 },
    uCover: { value: 0 },
    uStratus: { value: 0 },
    uDensity: { value: 6 },
    uWind: { value: new THREE.Vector2() },
    uEvolve: { value: 0 },
    uNightAir: NIGHT_AIR,
    uMoonLight: MOON_LIGHT,
    uMoonDir: MOON_DIR,
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uSunCol: { value: new THREE.Color(1, 1, 1) },
    uSkyAmb: { value: new THREE.Color(0.5, 0.6, 0.8) },
    uGroundAmb: { value: new THREE.Color(0.25, 0.25, 0.25) },
    uHazeCol: { value: new THREE.Color(0.6, 0.7, 0.9) },
    uHaze: { value: 1 },
    uSteps: { value: 72 },
  };
  private readonly march: FullScreenQuad;
  private readonly composite: FullScreenQuad;
  private readonly compositeMat: THREE.ShaderMaterial;
  private readonly target: THREE.WebGLRenderTarget;
  private scale: number;

  constructor(scale = 0.5) {
    super();
    this.scale = scale;
    this.enabled = false;
    this.needsSwap = true;
    this.march = new FullScreenQuad(new THREE.ShaderMaterial({
      uniforms: this.u,
      vertexShader: marchVertex,
      fragmentShader: marchFragment,
      depthTest: false,
      depthWrite: false,
    }));
    this.compositeMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, tClouds: { value: null } },
      vertexShader: marchVertex,
      fragmentShader: compositeFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.composite = new FullScreenQuad(this.compositeMat);
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
    this.target.texture.minFilter = this.target.texture.magFilter = THREE.LinearFilter;
  }

  public setSize(width: number, height: number): void {
    this.target.setSize(Math.max(1, Math.round(width * this.scale)), Math.max(1, Math.round(height * this.scale)));
  }

  /** Per frame, before the draw (camera at the floating origin's place). */
  public setView(camera: THREE.PerspectiveCamera): void {
    this.u.uProjInv.value.copy(camera.projectionMatrixInverse);
    this.u.uNear.value = camera.near;
    this.u.uFar.value = camera.far;
    this.u.uCamRot.value.setFromMatrix4(camera.matrixWorld);
  }

  /** The scene's depth this frame (the passes after this one read a buffer without it). */
  public lastDepth: THREE.Texture | null = null;
  private noise: ReturnType<typeof noiseBuilder> | null = null;

  /** Start building the cloud noise now, a few milliseconds at a time between frames. */
  public warm(): void {
    if (this.u.tNoise.value || this.warming) return;
    this.warming = true;
    const tick = (): void => {
      if (this.u.tNoise.value) return;
      this.noise ??= noiseBuilder(64);
      const tex = this.noise.step(4);
      if (tex) {
        this.u.tNoise.value = tex;
        this.noise = null;
        return;
      }
      setTimeout(tick, 12);
    };
    setTimeout(tick, 0);
  }
  private warming = false;

  public render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    if (!this.u.tNoise.value) {
      this.noise ??= noiseBuilder(64);
      this.u.tNoise.value = this.noise.step(5);
      if (!this.u.tNoise.value) {
        // Not built yet: the picture goes on without clouds this frame
        const prev = renderer.getRenderTarget();
        renderer.setRenderTarget(this.target);
        // No cloud: nothing added, everything let through (alpha is the transmittance)
        const clear = renderer.getClearColor(new THREE.Color());
        const clearA = renderer.getClearAlpha();
        renderer.setClearColor(0x000000, 1);
        renderer.clear(true, false, false);
        renderer.setClearColor(clear, clearA);
        this.compositeMat.uniforms.tDiffuse.value = readBuffer.texture;
        this.compositeMat.uniforms.tClouds.value = this.target.texture;
        renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
        this.composite.render(renderer);
        renderer.setRenderTarget(prev);
        return;
      }
      this.noise = null;
    }
    this.u.tDepth.value = readBuffer.depthTexture;
    this.lastDepth = readBuffer.depthTexture;
    const L = this.layer;
    this.u.uBase.value = L.baseKm;
    this.u.uTop.value = L.topKm;
    this.u.uCover.value = L.cover;
    this.u.uStratus.value = L.stratus;
    this.u.uDensity.value = L.density;
    this.u.uWind.value.copy(L.windKm);
    this.u.uEvolve.value = L.evolveKm % 512;
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(this.target);
    this.march.render(renderer);
    this.compositeMat.uniforms.tDiffuse.value = readBuffer.texture;
    this.compositeMat.uniforms.tClouds.value = this.target.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.composite.render(renderer);
    renderer.setRenderTarget(prev);
  }

  public dispose(): void {
    this.march.dispose();
    this.composite.dispose();
    this.compositeMat.dispose();
    (this.march.material as THREE.Material).dispose();
    this.target.dispose();
    this.u.tNoise.value?.dispose();
  }
}
