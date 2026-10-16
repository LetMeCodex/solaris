import * as THREE from 'three';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';

/**
 * Nebulae on the celestial sphere: three real photographs (Hubble's Mystic Mountain, Webb's Cosmic
 * Cliffs, VISTA's Helix) and six procedural ones shaped like the kinds of nebula the sky is full of.
 * Each sits in its real direction on the sky (enlarged, so it can be seen), bent onto the sphere,
 * and drawn twice: the image itself and a soft halo a little further out. When you travel, the two
 * drift apart a touch, which gives them depth; the gas flows slowly, and their stars twinkle.
 * Textures (scripts/build_nebulae.py) load after the opening, at full size on capable GPUs and half
 * size on phones, so they never delay the start or cost a frame.
 */

interface NebulaSpec {
  name: string;
  /** Right ascension (hours) and declination (degrees) of the centre. */
  ra: number;
  dec: number;
  /** Width on the sky, degrees (far larger than life, so they read as figures). */
  width: number;
  /** Brightness (above 1 lifts faint procedural gas). */
  opacity: number;
  /** Turn on the sky, degrees. */
  roll: number;
}

export const NEBULAE: NebulaSpec[] = [
  // The real photographs, where they really are (the two Carina pictures side by side)
  { name: 'cosmic-cliffs', ra: 10.1, dec: -52, width: 50, opacity: 1.0, roll: -8 },
  { name: 'mystic-mountain', ra: 11.6, dec: -68, width: 30, opacity: 1.0, roll: 12 },
  { name: 'helix', ra: 22.49, dec: -20.8, width: 30, opacity: 1.0, roll: 18 },
  // Procedural figures, spread around the rest of the sky
  { name: 'orion-cloud', ra: 5.59, dec: -5.4, width: 24, opacity: 1.8, roll: 25 },
  { name: 'rosette-ring', ra: 7.6, dec: 26, width: 17, opacity: 1.1, roll: 0 },
  { name: 'crab-shell', ra: 3.1, dec: 42, width: 12, opacity: 2.2, roll: -30 },
  { name: 'veil-filaments', ra: 20.85, dec: 31, width: 28, opacity: 3.0, roll: 40 },
  { name: 'lagoon-lane', ra: 17.7, dec: -30, width: 22, opacity: 1.7, roll: -15 },
  { name: 'north-america', ra: 13.6, dec: 52, width: 24, opacity: 1.5, roll: 60 },
];

const BASE = `${import.meta.env.BASE_URL || '/'}textures/nebulae/`;

const vertexShader = /* glsl */ `
  uniform vec3 uDrift;
  uniform vec3 uCenter;
  uniform float uDepth;
  uniform float uZoom;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Zooming in, the figure swells a little (the halo more); zooming out, it draws back
    vec3 p = uCenter + (position - uCenter) * (1.0 + uZoom * (0.03 + uDepth * 0.06));
    // Travel drift: the halo layer moves a little against the direction of flight
    p -= uDrift * uDepth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uBias;
  uniform float uTwinkle;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  void main() {
    // The gas flows: a slow, tiny displacement of the image
    vec2 flow = vec2(noise(vUv * 3.0 + uTime * 0.015), noise(vUv * 3.0 + 17.0 - uTime * 0.012)) - 0.5;
    vec4 c = texture2D(uMap, vUv + flow * 0.0035, uBias);
    // Its stars twinkle: bright, compact points shimmer on their own rhythm
    float l = max(c.r, max(c.g, c.b));
    float star = smoothstep(0.55, 0.95, l) * uTwinkle;
    float phase = hash(floor(vUv * 900.0)) * 6.2831;
    c.rgb *= 1.0 + star * 0.45 * sin(uTime * (1.3 + phase * 0.4) + phase);
    // Premultiplied: light adds, dust dims what is behind
    gl_FragColor = vec4(c.rgb * uOpacity, c.a * uOpacity);
  }
`;

/** A rectangle of sky bent onto the sphere (gnomonic grid around a direction). */
function skyPatch(dir: THREE.Vector3, widthDeg: number, aspect: number, rollDeg: number, radius: number): THREE.BufferGeometry {
  const up = Math.abs(dir.y) > 0.98 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const east = new THREE.Vector3().crossVectors(up, dir).normalize();
  const north = new THREE.Vector3().crossVectors(dir, east).normalize();
  const roll = THREE.MathUtils.degToRad(rollDeg);
  const e = east.clone().multiplyScalar(Math.cos(roll)).addScaledVector(north, Math.sin(roll));
  const n = north.clone().multiplyScalar(Math.cos(roll)).addScaledVector(east, -Math.sin(roll));
  const halfW = Math.tan(THREE.MathUtils.degToRad(widthDeg / 2));
  const halfH = halfW / aspect;
  const N = 16;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const p = new THREE.Vector3();
  for (let j = 0; j <= N; j++) {
    for (let i = 0; i <= N; i++) {
      const s = i / N, t = j / N;
      p.copy(dir).addScaledVector(e, (s * 2 - 1) * halfW).addScaledVector(n, (t * 2 - 1) * halfH).normalize().multiplyScalar(radius);
      pos.push(p.x, p.y, p.z);
      uv.push(s, t);
    }
  }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i;
      idx.push(a, a + 1, a + N + 2, a, a + N + 2, a + N + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

export class NebulaSky {
  public group = new THREE.Group();
  private time = { value: 0 };
  private drift = { value: new THREE.Vector3() };
  private zoom = { value: 0 };
  private scratch = new THREE.Vector3();
  private fade = 1;
  private layers: { mat: THREE.ShaderMaterial; base: number }[] = [];
  private textures: THREE.Texture[] = [];
  private loaded = false;
  private reveal = 0;
  /** How dark the sky is where you stand (1 in space or at night, 0 in daylight under air). */
  private skyDark = 1;
  private skyDarkTarget = 1;

  constructor(private radius: number) {
    this.group.name = 'nebulae';
    this.group.visible = false;
  }

  /** Under an atmosphere, daylight and twilight wash the nebulae out (as they do the stars). */
  public setSkyDarkness(v: number): void {
    this.skyDarkTarget = THREE.MathUtils.clamp(v, 0, 1);
  }

  /** Pick a size the device can afford and start loading (after the opening). */
  public load(renderer: THREE.WebGLRenderer): void {
    if (this.loaded) return;
    this.loaded = true;
    const maxTex = renderer.capabilities.maxTextureSize;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const phone = window.matchMedia('(pointer: coarse)').matches && Math.min(window.innerWidth, window.innerHeight) < 820;
    const lite = phone || maxTex < 4096 || mem <= 4;
    const loader = new THREE.TextureLoader();
    void fetch(`${BASE}nebulae.json`)
      .then((r) => r.json() as Promise<Record<string, number>>)
      .then((aspects) => {
        for (const spec of NEBULAE) {
          loader.load(`${BASE}${spec.name}${lite ? '_lite' : ''}.webp`, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
            tex.premultiplyAlpha = false;
            this.textures.push(tex);
            this.add(spec, tex, aspects[spec.name] ?? 1);
            this.group.visible = true;
          });
        }
      })
      .catch(() => undefined);
  }

  private add(spec: NebulaSpec, tex: THREE.Texture, aspect: number): void {
    const dir = new THREE.Vector3(...CoordinateFrames.icrfToThree(CoordinateFrames.raDecToIcrf(spec.ra * 15, spec.dec)));
    // The image, and a softer, larger halo of it a little further out (depth when travelling)
    for (const [depth, scale, gain, bias] of [[0, 1, 1, 0], [1, 1.12, 0.32, 2.5]] as const) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: tex },
          uOpacity: { value: 0 },
          uTime: this.time,
          uBias: { value: bias },
          uTwinkle: { value: depth === 0 ? 1 : 0 },
          uDrift: this.drift,
          uZoom: this.zoom,
          uCenter: { value: new THREE.Vector3() },
          uDepth: { value: depth },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      });
      const geo = skyPatch(dir, spec.width * scale, aspect, spec.roll, this.radius * (1 + depth * 0.02));
      mat.uniforms.uCenter.value.copy(dir).multiplyScalar(this.radius * (1 + depth * 0.02));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = `nebula_${spec.name}${depth ? '_halo' : ''}`;
      // After the Milky Way band, before the stars (they shine through)
      mesh.renderOrder = depth ? -9 : -8;
      // Sky meshes travel with the camera: never culled (like the stars)
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.layers.push({ mat, base: spec.opacity * gain });
    }
  }

  /**
   * @param velocity camera velocity as the eye judges it (scene units / s, scaled to the view)
   * @param leaving 0 inside the Milky Way's sky, 1 once the camera has left for the galaxy view
   * @param zoomRate d ln(distance)/dt of the camera (negative while zooming in)
   */
  public update(dt: number, velocity: THREE.Vector3, leaving: number, zoomRate = 0): void {
    if (!this.group.visible) return;
    this.time.value += dt;
    this.reveal = Math.min(1, this.reveal + dt / 3.5);
    // The halo drifts against the motion (eased, capped), and the whole sky breathes back after
    const speed = velocity.length();
    const target = speed > 1e-3 ? this.scratch.copy(velocity).multiplyScalar((-Math.min(1, speed / 400) * this.radius * 0.006) / speed) : this.scratch.set(0, 0, 0);
    this.drift.value.lerp(target, 1 - Math.exp(-dt * 2.5));
    this.zoom.value += (THREE.MathUtils.clamp(-zoomRate * 0.5, -1, 1) - this.zoom.value) * (1 - Math.exp(-dt * 3));
    this.skyDark += (this.skyDarkTarget - this.skyDark) * (1 - Math.exp(-dt * 4));
    this.fade = (1 - leaving) * this.skyDark;
    const k = this.reveal * this.reveal * (3 - 2 * this.reveal) * this.fade * (1 + Math.max(0, this.zoom.value) * 0.15);
    for (const l of this.layers) l.mat.uniforms.uOpacity.value = l.base * k;
    this.group.visible = this.fade > 0.003 || this.reveal < 1;
  }

  public dispose(): void {
    this.textures.forEach((t) => t.dispose());
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }
}
