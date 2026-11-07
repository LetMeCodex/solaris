import * as THREE from 'three';

/**
 * The ground of a deep-time scene: a real 3D landscape around the observer, built from layered
 * noise, so the sky has a horizon to stand against the way it does in a photograph: dune fields,
 * rolling green hills down to the sea, alpine ridges with snow, black jagged peaks, a scorched
 * crust with lava in its cracks, frozen crags. An ocean with a sun glint where the land dips
 * below sea level.
 *
 * Built in the observer's local frame (x east, y up, z south), in kilometres, flat near the feet
 * and rising with distance; the Earth's curvature drops the far ground away. Lit by the scene's
 * light (the Sun, a supernova, a red giant), with sky light from above, and dissolved into the
 * horizon's own colour with distance (aerial perspective), so the far ridges read as silhouettes.
 */

export type LandKind = 'dunes' | 'redDesert' | 'hills' | 'alpine' | 'jagged' | 'coast' | 'shore' | 'scorched' | 'ice';

export interface LandSpec {
  kind: LandKind;
  /** Horizon haze colour away from the light, and towards it. */
  fog: [number, number, number];
  fogSun: [number, number, number];
  /** How quickly the haze closes in (1 = clear air; larger is thicker). */
  haze?: number;
  /** Turn the whole land (deg) so its best side faces the shot. */
  turn?: number;
}

// ------------------------------------------------------------------ noise (deterministic)

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return (a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy;
}
function fbm(x: number, y: number, oct = 5): number {
  let s = 0;
  let a = 0.5;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise(x, y);
    x = x * 2.03 + 17.1;
    y = y * 2.03 - 9.4;
    a *= 0.5;
  }
  return s;
}
function ridged(x: number, y: number, oct = 5): number {
  let s = 0;
  let a = 0.5;
  let w = 1;
  for (let i = 0; i < oct; i++) {
    let n = 1 - Math.abs(vnoise(x, y) * 2 - 1);
    n *= n * w;
    w = Math.min(1, n * 2);
    s += a * n;
    x = x * 2.07 + 5.3;
    y = y * 2.07 + 11.9;
    a *= 0.5;
  }
  return s;
}
const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Height (km above sea level) of a land at local (x east, z south), r = distance (km). */
function heightOf(kind: LandKind, x: number, z: number, r: number): number {
  const near = smooth(0.25, 2.5, r); // flat under the observer's feet
  switch (kind) {
    case 'dunes':
    case 'redDesert': {
      // Long dune crests across the wind, softer swells, then a low range far off
      const warp = fbm(x * 0.05, z * 0.05) * 6;
      const crest = Math.pow(Math.abs(Math.sin(x * 0.42 + z * 0.12 + warp)), 1.6) * 0.09;
      const swell = fbm(x * 0.09, z * 0.09) * 0.22;
      // A range of low mountains on the skyline
      const range = Math.pow(fbm(x * 0.03 + 3, z * 0.03), 1.4) * 3.2 * smooth(5, 18, r);
      return 0.02 + (crest + swell) * near + range;
    }
    case 'hills': {
      const roll = fbm(x * 0.07, z * 0.07) * 0.55 + fbm(x * 0.18, z * 0.18) * 0.12;
      const far = fbm(x * 0.02 + 7, z * 0.02) * 1.3 * smooth(12, 35, r);
      // The land falls away to the sea on one side
      const sea = smooth(6, 14, -z) * 0.9;
      return (roll * near + far) - sea + 0.08;
    }
    case 'alpine': {
      const peaks = ridged(x * 0.045, z * 0.045) * 2.6 * smooth(2, 12, r);
      const foot = fbm(x * 0.12, z * 0.12) * 0.25 * near;
      return 0.05 + peaks + foot;
    }
    case 'jagged': {
      // Sharp black peaks on the skyline
      const peaks = Math.pow(ridged(x * 0.06, z * 0.06, 6), 1.4) * 5.2 * smooth(2.5, 10, r);
      return 0.03 + peaks + fbm(x * 0.15, z * 0.15) * 0.15 * near;
    }
    case 'coast': {
      // Land behind and to the sides; the sea ahead (to the south, the way the shot faces)
      const land = fbm(x * 0.06, z * 0.06) * 0.6 + ridged(x * 0.03, z * 0.03) * 0.8 * smooth(6, 20, r);
      const toSea = smooth(-1, 3, z);
      return land * near * (1 - toSea) + 0.02 - toSea * 0.3;
    }
    case 'shore': {
      // A pale beach under the feet, then the sea; a low far shore beyond
      // A wandering shoreline, not a ruled line
      const beach = 0.03 + fbm(x * 0.3, z * 0.3) * 0.03;
      const shoreline = 0.8 + (fbm(x * 0.25 + 4, 1.7) - 0.5) * 2.2;
      const toSea = smooth(shoreline - 0.4, shoreline + 0.4, z);
      const farShore = fbm(x * 0.03, z * 0.03) * 0.35 * smooth(28, 40, z);
      return beach * (1 - toSea) - toSea * 0.2 + farShore;
    }
    case 'scorched': {
      const crust = fbm(x * 0.1, z * 0.1) * 0.35 + ridged(x * 0.03, z * 0.03) * 0.7 * smooth(6, 25, r);
      return 0.02 + crust * near;
    }
    case 'ice': {
      const crags = ridged(x * 0.08, z * 0.08) * 0.9 * smooth(1.5, 8, r) + fbm(x * 0.2, z * 0.2) * 0.12 * near;
      return 0.03 + crags + ridged(x * 0.02, z * 0.02) * 1.4 * smooth(15, 35, r);
    }
  }
}

/** Ground colours (low, high) and whether there is snow / lava. */
const PALETTES: Record<LandKind, { low: number; high: number; snow?: number; lava?: boolean }> = {
  dunes: { low: 0x9a7a52, high: 0xc9a670 },
  redDesert: { low: 0x5a2a18, high: 0x8a4a2a },
  hills: { low: 0x4f6030, high: 0x7d8c4a },
  alpine: { low: 0x3a3f42, high: 0x5c6064, snow: 1.2 },
  jagged: { low: 0x1a1b1e, high: 0x2a2b30 },
  coast: { low: 0x3d3a2e, high: 0x55503c },
  shore: { low: 0x9c8664, high: 0xb29a74 },
  scorched: { low: 0x3c2418, high: 0x5e3822, lava: true },
  ice: { low: 0x6d7a88, high: 0xb8c6d4, snow: 0.6 },
};

const landMaterial = (): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: {
      uLow: { value: new THREE.Color() },
      uHigh: { value: new THREE.Color() },
      uSnow: { value: 99 },
      uLava: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0, 1, 0) },
      uLight: { value: new THREE.Color(1, 1, 1) },
      uAmbient: { value: new THREE.Color(0.05, 0.06, 0.08) },
      uFog: { value: new THREE.Color() },
      uFogSun: { value: new THREE.Color() },
      uFogK: { value: 0.03 },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      varying vec3 vN;
      void main() {
        vP = position;
        vN = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLow, uHigh, uLight, uAmbient, uFog, uFogSun, uLightDir;
      uniform float uSnow, uLava, uFogK, uTime;
      varying vec3 vP;
      varying vec3 vN;
      float h2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float vn(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y); }
      void main() {
        vec3 n = normalize(vN);
        float slope = 1.0 - n.y;
        float h = vP.y;
        // Ground colour: low to high with height, rock on steep faces, fine grain
        float grain = vn(vP.xz * 9.0) * 0.5 + vn(vP.xz * 37.0) * 0.5;
        vec3 c = mix(uLow, uHigh, clamp(h * 0.6 + grain * 0.35, 0.0, 1.0));
        c = mix(c, c * 0.62, smoothstep(0.25, 0.6, slope));
        // Snow above the line, on gentle slopes
        float snow = smoothstep(uSnow - 0.15, uSnow + 0.1, h + grain * 0.2) * (1.0 - smoothstep(0.35, 0.7, slope));
        c = mix(c, vec3(0.88, 0.92, 0.98), snow);
        // Light: the scene's light (wrapped a little), sky light from above
        float ndl = max(0.0, dot(n, normalize(uLightDir)) * 0.9 + 0.1);
        vec3 col = c * (uLight * ndl + uAmbient * (0.6 + 0.4 * n.y));
        // Lava in the cracks of a scorched crust: glowing, unlit
        if (uLava > 0.5) {
          float crack = smoothstep(0.47, 0.5, vn(vP.xz * 1.6 + 3.1)) * smoothstep(0.53, 0.5, vn(vP.xz * 1.6 + 3.1));
          float pulse = 0.8 + 0.2 * sin(uTime * 0.7 + vP.x * 2.0);
          col += vec3(1.6, 0.42, 0.06) * crack * pulse * 1.5;
        }
        // Aerial perspective: the haze's colour, warmer towards the light
        float d = length(vP.xz);
        vec3 view = normalize(vP);
        vec3 lh = normalize(vec3(uLightDir.x, 0.0, uLightDir.z) + 1e-5);
        float toward = pow(max(0.0, dot(normalize(vec3(view.x, 0.0, view.z)), lh)), 3.0);
        vec3 fog = mix(uFog, uFogSun, toward);
        float k = 1.0 - exp(-d * uFogK);
        gl_FragColor = vec4(mix(col, fog, k), 1.0);
      }
    `,
  });

const oceanMaterial = (): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: {
      uLightDir: { value: new THREE.Vector3(0, 1, 0) },
      uLight: { value: new THREE.Color(1, 1, 1) },
      uSky: { value: new THREE.Color(0.2, 0.3, 0.45) },
      uDeep: { value: new THREE.Color(0.01, 0.03, 0.05) },
      uFog: { value: new THREE.Color() },
      uFogSun: { value: new THREE.Color() },
      uFogK: { value: 0.03 },
      uTime: { value: 0 },
      uEye: { value: 0.3 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLightDir, uLight, uSky, uDeep, uFog, uFogSun;
      uniform float uFogK, uTime, uEye;
      varying vec3 vP;
      float h2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float vn(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(h2(i), h2(i + vec2(1, 0)), u.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), u.x), u.y); }
      float waves(vec2 p) {
        return vn(p * 3.0 + uTime * 0.25) * 0.5 + vn(p * 7.0 - uTime * 0.4) * 0.3 + vn(p * 17.0 + uTime * 0.7) * 0.2;
      }
      void main() {
        vec2 p = vP.xz;
        float e = 0.02;
        float wx = waves(p + vec2(e, 0.0)) - waves(p - vec2(e, 0.0));
        float wz = waves(p + vec2(0.0, e)) - waves(p - vec2(0.0, e));
        float d = length(p);
        // Ripples flatten into a mirror with distance (they shrink below a pixel)
        float amp = 0.35 / (1.0 + d * 0.15);
        vec3 n = normalize(vec3(-wx * amp, 1.0, -wz * amp));
        vec3 eye = vec3(0.0, uEye, 0.0);
        vec3 v = normalize(eye - vP);
        float fres = 0.02 + 0.98 * pow(1.0 - max(0.0, dot(n, v)), 5.0);
        vec3 r = reflect(-v, n);
        vec3 L = normalize(uLightDir);
        // The glint: a hard core and a broad sheen, a road of light towards the Sun
        float spec = pow(max(0.0, dot(r, L)), 900.0) * 30.0 + pow(max(0.0, dot(r, L)), 60.0) * 0.6;
        vec3 col = mix(uDeep, uSky, fres) + uLight * spec;
        vec3 view = normalize(vP - eye);
        vec3 lh = normalize(vec3(L.x, 0.0, L.z) + 1e-5);
        float toward = pow(max(0.0, dot(normalize(vec3(view.x, 0.0, view.z)), lh)), 3.0);
        vec3 fog = mix(uFog, uFogSun, toward);
        float k = 1.0 - exp(-d * uFogK * 0.7);
        gl_FragColor = vec4(mix(col, fog, k), 1.0);
      }
    `,
  });

const RINGS = 150;
const SEGS = 320;
const R_MIN = 0.03; // km
const R_MAX = 55; // km
const EARTH_KM = 6371;

export class DeepTimeLand {
  public readonly group = new THREE.Group();
  private land: THREE.Mesh | null = null;
  private ocean: THREE.Mesh | null = null;
  private landMat = landMaterial();
  private oceanMat = oceanMaterial();
  private spec: LandSpec | null = null;
  private t = 0;

  constructor() {
    this.group.name = 'deep_time_land';
    this.group.visible = false;
  }

  public setLand(spec: LandSpec | null): void {
    this.clear();
    this.spec = spec;
    this.group.visible = !!spec;
    if (!spec) return;
    const pal = PALETTES[spec.kind];
    const u = this.landMat.uniforms;
    u.uLow.value.setHex(pal.low); // setHex already converts sRGB to the linear working space
    u.uHigh.value.setHex(pal.high);
    u.uSnow.value = pal.snow ?? 99;
    u.uLava.value = pal.lava ? 1 : 0;
    const k = 0.03 * (spec.haze ?? 1);
    u.uFogK.value = k;
    u.uFog.value.setRGB(...spec.fog);
    u.uFogSun.value.setRGB(...spec.fogSun);
    const o = this.oceanMat.uniforms;
    o.uFogK.value = k;
    o.uFog.value.setRGB(...spec.fog);
    o.uFogSun.value.setRGB(...spec.fogSun);

    // A polar grid: fine near the feet, coarse far out
    const turn = ((spec.turn ?? 0) * Math.PI) / 180;
    const pos = new Float32Array((RINGS + 1) * SEGS * 3);
    let lowest = Infinity;
    for (let i = 0; i <= RINGS; i++) {
      const r = R_MIN * Math.pow(R_MAX / R_MIN, i / RINGS);
      for (let j = 0; j < SEGS; j++) {
        const a = (j / SEGS) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const lx = x * Math.cos(turn) - z * Math.sin(turn);
        const lz = x * Math.sin(turn) + z * Math.cos(turn);
        // Curvature: the far ground drops away below the horizon
        const y = heightOf(spec.kind, lx, lz, r) - (r * r) / (2 * EARTH_KM);
        lowest = Math.min(lowest, y);
        const o3 = (i * SEGS + j) * 3;
        pos[o3] = x;
        pos[o3 + 1] = y;
        pos[o3 + 2] = z;
      }
    }
    const idx: number[] = [];
    for (let i = 0; i < RINGS; i++) {
      for (let j = 0; j < SEGS; j++) {
        const a = i * SEGS + j;
        const b = i * SEGS + ((j + 1) % SEGS);
        const c = (i + 1) * SEGS + j;
        const d = (i + 1) * SEGS + ((j + 1) % SEGS);
        // Counter-clockwise seen from above, so the faces (and their normals) point up
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    this.land = new THREE.Mesh(g, this.landMat);
    this.land.frustumCulled = false;
    this.land.renderOrder = 2;
    this.group.add(this.land);

    // The sea, where the land dips below it
    if (lowest < -0.02 && ['hills', 'coast', 'shore'].includes(spec.kind)) {
      const og = new THREE.CircleGeometry(R_MAX, 128);
      og.rotateX(-Math.PI / 2);
      this.ocean = new THREE.Mesh(og, this.oceanMat);
      this.ocean.position.y = -0.002;
      this.ocean.frustumCulled = false;
      this.ocean.renderOrder = 1;
      this.group.add(this.ocean);
    }
  }

  /**
   * Per frame. `frame` is the observer's local axes (world), `eyeKm` the eye's height above the
   * land's sea level, `kmPerUnit` the world scale, `light` the scene's key light (world direction,
   * colour) and sky light.
   */
  public update(
    dt: number,
    camera: THREE.Camera,
    frame: { east: THREE.Vector3; north: THREE.Vector3; up: THREE.Vector3 },
    eyeKm: number,
    kmPerUnit: number,
    light: { dir: THREE.Vector3; color: THREE.Color; ambient: THREE.Color },
    skyColor: THREE.Color
  ): void {
    if (!this.spec) return;
    this.t += dt;
    // Local x east, y up, z south; scaled from km to render units; sea level eyeKm below the eye
    const south = frame.north.clone().negate();
    const basis = new THREE.Matrix4().makeBasis(frame.east, frame.up, south);
    this.group.quaternion.setFromRotationMatrix(basis);
    this.group.scale.setScalar(1 / kmPerUnit);
    this.group.position.copy(camera.position).addScaledVector(frame.up, -eyeKm / kmPerUnit);
    // The light's direction in the local frame
    const ld = new THREE.Vector3(light.dir.dot(frame.east), light.dir.dot(frame.up), light.dir.dot(south)).normalize();
    for (const m of [this.landMat, this.oceanMat]) {
      m.uniforms.uLightDir.value.copy(ld);
      m.uniforms.uLight.value.copy(light.color);
      m.uniforms.uTime.value = this.t;
    }
    this.landMat.uniforms.uAmbient.value.copy(light.ambient);
    this.oceanMat.uniforms.uSky.value.copy(skyColor);
    this.oceanMat.uniforms.uEye.value = eyeKm;
  }

  private clear(): void {
    for (const m of [this.land, this.ocean]) {
      if (!m) continue;
      m.removeFromParent();
      m.geometry.dispose();
    }
    this.land = null;
    this.ocean = null;
  }

  public dispose(): void {
    this.clear();
    this.landMat.dispose();
    this.oceanMat.dispose();
  }
}
