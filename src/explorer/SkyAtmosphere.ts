import * as THREE from 'three';

/**
 * Sky seen from a planet's surface: single-scattering Rayleigh + Mie (Nishita-style), evaluated
 * per pixel on a dome around the observer. Parameters are physical where known (Earth: standard
 * clear-sky coefficients; Mars: CO₂ Rayleigh + suspended dust, τ≈0.5) and approximate for the
 * giant planets. Venus's surface sits under a total overcast. Light scattered more than once is
 * added as a soft isotropic term (it is most of what lights the sky in twilight), and the exposure
 * adapts after sunset as the eye does, so civil twilight is a glowing blue, not black.
 */
export interface AtmosphereModel {
  kind: 'none' | 'scatter' | 'overcast';
  label: string;
  /** Planet radius and atmosphere height (m). */
  radius: number;
  top: number;
  /** Scale heights (m). */
  hr: number;
  hm: number;
  /** Rayleigh scattering, Mie scattering, Mie extinction and extra absorption (1/m, RGB). */
  betaR: [number, number, number];
  betaMs: [number, number, number];
  betaMe: [number, number, number];
  betaA: [number, number, number];
  /** Mie anisotropy per channel (bluer light more forward-peaked for Martian dust). */
  g: [number, number, number];
  sunIntensity: number;
  /** Horizontal visibility near the ground (km), for aerial perspective. */
  visibilityKm: number;
  overcast?: [number, number, number];
}

const NONE: AtmosphereModel = {
  kind: 'none', label: 'No atmosphere — black sky, stars by day', radius: 1, top: 1, hr: 1, hm: 1,
  betaR: [0, 0, 0], betaMs: [0, 0, 0], betaMe: [0, 0, 0], betaA: [0, 0, 0], g: [0.8, 0.8, 0.8], sunIntensity: 0, visibilityKm: 0,
};

export const ATMOSPHERES: Record<string, AtmosphereModel> = {
  Earth: {
    kind: 'scatter', label: 'Rayleigh + aerosol scattering (clear sky)',
    radius: 6371e3, top: 80e3, hr: 8e3, hm: 1.2e3,
    betaR: [5.802e-6, 13.558e-6, 33.1e-6], betaMs: [3.996e-6, 3.996e-6, 3.996e-6], betaMe: [4.4e-6, 4.4e-6, 4.4e-6],
    betaA: [0.65e-6, 1.881e-6, 0.085e-6], // ozone (Hillaire 2020)
    g: [0.8, 0.8, 0.8], sunIntensity: 22, visibilityKm: 60,
  },
  Mars: {
    kind: 'scatter', label: 'Thin CO₂ + suspended dust (τ≈0.5): butterscotch day, blue sunset',
    radius: 3389.5e3, top: 80e3, hr: 11.1e3, hm: 11.1e3,
    betaR: [0.24e-6, 0.56e-6, 1.38e-6],
    betaMs: [4.3e-5, 3.4e-5, 2.2e-5], betaMe: [4.5e-5, 4.5e-5, 4.6e-5], betaA: [0, 0, 0],
    g: [0.68, 0.76, 0.88], sunIntensity: 9, visibilityKm: 35,
  },
  Venus: {
    ...NONE, kind: 'overcast', label: 'Total overcast: the clouds hide the sky (dim orange daylight)',
    overcast: [0.55, 0.36, 0.16], visibilityKm: 12,
  },
  Titan: {
    // Optical depth of the haze is ~5: from the ground Saturn, the Sun's disc and the stars are lost
    ...NONE, kind: 'overcast', label: 'Thick nitrogen–methane haze: Saturn and the stars are hidden from the ground',
    overcast: [0.36, 0.22, 0.08], visibilityKm: 10,
  },
  Jupiter: {
    kind: 'scatter', label: 'H₂/He Rayleigh sky above the clouds (approximate)',
    radius: 69911e3, top: 400e3, hr: 27e3, hm: 8e3,
    betaR: [1.7e-6, 4.0e-6, 9.8e-6], betaMs: [1.2e-6, 1.2e-6, 1.1e-6], betaMe: [1.6e-6, 1.6e-6, 1.6e-6], betaA: [0.4e-6, 0.3e-6, 0.6e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 400,
  },
  Saturn: {
    kind: 'scatter', label: 'H₂/He Rayleigh sky above the haze (approximate)',
    radius: 58232e3, top: 500e3, hr: 59e3, hm: 15e3,
    betaR: [0.8e-6, 1.9e-6, 4.6e-6], betaMs: [1.4e-6, 1.3e-6, 1.1e-6], betaMe: [1.8e-6, 1.8e-6, 1.8e-6], betaA: [0.2e-6, 0.25e-6, 0.5e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 500,
  },
  Uranus: {
    kind: 'scatter', label: 'H₂ Rayleigh with methane absorbing red light (approximate)',
    radius: 25362e3, top: 300e3, hr: 28e3, hm: 10e3,
    betaR: [1.2e-6, 2.9e-6, 7.1e-6], betaMs: [0.4e-6, 0.4e-6, 0.4e-6], betaMe: [0.5e-6, 0.5e-6, 0.5e-6], betaA: [6e-6, 0.8e-6, 0.2e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 300,
  },
  Neptune: {
    kind: 'scatter', label: 'H₂ Rayleigh with methane absorbing red light (approximate)',
    radius: 24622e3, top: 300e3, hr: 20e3, hm: 10e3,
    betaR: [1.4e-6, 3.4e-6, 8.3e-6], betaMs: [0.4e-6, 0.4e-6, 0.4e-6], betaMe: [0.5e-6, 0.5e-6, 0.5e-6], betaA: [7e-6, 1.0e-6, 0.2e-6],
    g: [0.75, 0.75, 0.75], sunIntensity: 22, visibilityKm: 300,
  },
};

export function atmosphereFor(body: string): AtmosphereModel {
  return ATMOSPHERES[body] ?? NONE;
}

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uEast;
  uniform vec3 uUp;
  uniform vec3 uNorth;
  uniform vec3 uSunDir;
  uniform float uRadius;
  uniform float uTop;
  uniform float uHr;
  uniform float uHm;
  uniform vec3 uBetaR;
  uniform vec3 uBetaMs;
  uniform vec3 uBetaMe;
  uniform vec3 uBetaA;
  uniform vec3 uG;
  uniform float uSunI;
  uniform float uEye;
  uniform float uMode;      // 1 scatter · 2 overcast
  uniform vec3 uOvercast;
  uniform float uSunElev;   // sine of the solar elevation (overcast brightness)
  uniform float uExposure;
  uniform float uStarDim;   // 0 at night … 1 in daylight: the sky drowns the stars
  uniform float uMulti;     // strength of the multiple-scattering term
  varying vec3 vDir;

  const float PI = 3.14159265;

  vec2 raySphere(vec3 o, vec3 d, float r) {
    float b = dot(o, d);
    float c = dot(o, o) - r * r;
    float h = b * b - c;
    if (h < 0.0) return vec2(1e30, -1e30);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
  }

  vec3 phaseM(float mu) {
    vec3 g = uG;
    vec3 g2 = g * g;
    return 3.0 / (8.0 * PI) * ((1.0 - g2) * (1.0 + mu * mu)) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * mu, vec3(1.5)));
  }

  void main() {
    vec3 dw = normalize(vDir);
    vec3 d = vec3(dot(dw, uEast), dot(dw, uUp), dot(dw, uNorth));
    vec3 s = vec3(dot(uSunDir, uEast), dot(uSunDir, uUp), dot(uSunDir, uNorth));

    if (uMode > 1.5) {
      // Venus: diffuse light through ~90 bar of cloud and CO₂; no direct sky
      float day = smoothstep(-0.12, 0.25, uSunElev);
      float grad = 0.75 + 0.25 * clamp(d.y, 0.0, 1.0);
      vec3 col = uOvercast * (0.04 + 0.6 * day) * grad;
      gl_FragColor = vec4(col * uExposure, 0.0);
      return;
    }

    vec3 o = vec3(0.0, uRadius + uEye, 0.0);
    vec2 at = raySphere(o, d, uRadius + uTop);
    vec2 gr = raySphere(o, d, uRadius);
    float tEnd = at.y;
    if (gr.x > 0.0) tEnd = min(tEnd, gr.x);
    const int N = 16;
    const int M = 6;
    float seg = tEnd / float(N);
    vec3 sumR = vec3(0.0);
    vec3 sumM = vec3(0.0);
    float odR = 0.0;
    float odM = 0.0;
    for (int i = 0; i < N; i++) {
      vec3 p = o + d * (seg * (float(i) + 0.5));
      float h = length(p) - uRadius;
      float hrr = exp(-h / uHr) * seg;
      float hmm = exp(-h / uHm) * seg;
      odR += hrr;
      odM += hmm;
      // Light path to the Sun
      vec2 ls = raySphere(p, s, uRadius);
      if (ls.y > ls.x && ls.x > 0.0) continue; // in the planet's shadow
      float lseg = raySphere(p, s, uRadius + uTop).y / float(M);
      float lR = 0.0;
      float lM = 0.0;
      for (int j = 0; j < M; j++) {
        vec3 q = p + s * (lseg * (float(j) + 0.5));
        float hq = length(q) - uRadius;
        lR += exp(-hq / uHr) * lseg;
        lM += exp(-hq / uHm) * lseg;
      }
      vec3 tau = uBetaR * (odR + lR) + uBetaMe * (odM + lM) + uBetaA * (odR + lR);
      vec3 att = exp(-tau);
      sumR += att * hrr;
      sumM += att * hmm;
    }
    float mu = dot(d, s);
    float pr = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
    vec3 single = sumR * uBetaR * pr + sumM * uBetaMs * phaseM(mu);
    // Multiple scattering (approx.): light already scattered once, spread evenly over the sky
    vec3 multi = (sumR * uBetaR + sumM * uBetaMs) * (uMulti / (4.0 * PI));
    vec3 col = uSunI * (single + multi);
    vec3 trans = exp(-(uBetaR * odR + uBetaMe * odM + uBetaA * odR));
    col *= uExposure;
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    // Background (stars) is dimmed by extinction and drowned by a bright sky
    float through = dot(trans, vec3(0.333)) * (1.0 - smoothstep(0.015, 0.35, lum)) * (1.0 - uStarDim);
    gl_FragColor = vec4(col, through);
  }
`;

/** Full-sky dome around the camera; draws over the stars and under the sky bodies. */
export class SkyAtmosphere {
  public readonly mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  public model: AtmosphereModel = NONE;
  private static readonly EXPOSURE = 1.15;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uEast: { value: new THREE.Vector3(1, 0, 0) },
        uUp: { value: new THREE.Vector3(0, 1, 0) },
        uNorth: { value: new THREE.Vector3(0, 0, -1) },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uRadius: { value: 6371e3 },
        uTop: { value: 80e3 },
        uHr: { value: 8e3 },
        uHm: { value: 1.2e3 },
        uBetaR: { value: new THREE.Vector3() },
        uBetaMs: { value: new THREE.Vector3() },
        uBetaMe: { value: new THREE.Vector3() },
        uBetaA: { value: new THREE.Vector3() },
        uG: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
        uSunI: { value: 22 },
        uEye: { value: 400 },
        uMode: { value: 1 },
        uOvercast: { value: new THREE.Vector3() },
        uSunElev: { value: 0 },
        uExposure: { value: 1.15 },
        uStarDim: { value: 0 },
        uMulti: { value: 0.1 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: true,
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.SrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), this.material);
    this.mesh.name = 'surface_sky_atmosphere';
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 40;
    this.mesh.visible = false;
  }

  public setModel(model: AtmosphereModel): void {
    this.model = model;
    const u = this.material.uniforms;
    u.uRadius.value = model.radius;
    u.uTop.value = model.top;
    u.uHr.value = model.hr;
    u.uHm.value = model.hm;
    u.uBetaR.value.fromArray(model.betaR);
    u.uBetaMs.value.fromArray(model.betaMs);
    u.uBetaMe.value.fromArray(model.betaMe);
    u.uBetaA.value.fromArray(model.betaA);
    u.uG.value.fromArray(model.g);
    u.uSunI.value = model.sunIntensity;
    u.uMode.value = model.kind === 'overcast' ? 2 : 1;
    if (model.overcast) u.uOvercast.value.fromArray(model.overcast);
  }

  /**
   * @param centre camera position (the dome is centred on it)
   * @param radius dome radius in render units (inside the far plane, outside the ground near by)
   */
  public update(
    centre: THREE.Vector3,
    radius: number,
    frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 },
    sunDir: THREE.Vector3,
    eyeHeightM: number,
    enabled: boolean
  ): void {
    this.mesh.visible = enabled && this.model.kind !== 'none';
    if (!this.mesh.visible) return;
    this.mesh.position.copy(centre);
    this.mesh.scale.setScalar(radius);
    const u = this.material.uniforms;
    u.uEast.value.copy(frame.east);
    u.uUp.value.copy(frame.up);
    u.uNorth.value.copy(frame.north);
    u.uSunDir.value.copy(sunDir);
    u.uEye.value = Math.max(2, eyeHeightM);
    u.uSunElev.value = sunDir.dot(frame.up);
    // Stars fade from civil twilight (−6°) to sunrise, as they do to the eye
    const sunAlt = (Math.asin(THREE.MathUtils.clamp(u.uSunElev.value, -1, 1)) * 180) / Math.PI;
    u.uStarDim.value = this.model.kind === 'scatter' ? THREE.MathUtils.smoothstep(sunAlt, -10, -1) * this.starDimScale : 0;
    // The eye adapts after sunset: twilight reads as a lit sky, not the black of a daytime exposure
    const dusk = THREE.MathUtils.smoothstep(-sunAlt, -1, 5);
    u.uExposure.value = SkyAtmosphere.EXPOSURE * (1 + 7 * dusk);
    // By day single scattering already looks right; in twilight most of the light is multiply scattered
    u.uMulti.value = 0.1 + 1.1 * dusk;
  }

  /** Thin atmospheres (giants' upper air in dim sunlight) dim the stars less. */
  private get starDimScale(): number {
    return this.model.radius > 2e7 ? 0.6 : 1;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * Colour of sunlight after passing through the atmosphere at a given solar elevation (RGB
 * transmittance, Kasten–Young air mass). Used to redden the Sun, Moon and planets near the
 * horizon and to tint the ground light.
 */
export function transmittance(model: AtmosphereModel, altitudeDeg: number): [number, number, number] {
  if (model.kind === 'none') return [1, 1, 1];
  if (model.kind === 'overcast') return [0, 0, 0];
  if (altitudeDeg < -2) return [0, 0, 0];
  const a = Math.max(altitudeDeg, -1.5);
  const airmass = 1 / (Math.sin((a * Math.PI) / 180) + 0.50572 * Math.pow(a + 6.07995, -1.6364));
  const out: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const tau = (model.betaR[i] + model.betaA[i]) * model.hr + model.betaMe[i] * model.hm;
    out[i] = Math.exp(-tau * Math.min(airmass, 40));
  }
  return out;
}
