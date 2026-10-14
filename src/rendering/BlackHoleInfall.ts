import * as THREE from 'three';

/**
 * Matter and light falling into Sagittarius A*, integrated on Schwarzschild geodesics and shown as
 * a distant observer sees it.
 *
 * Units: geometric (G = c = 1) with M = r_s / 2 in render units. Everything is advanced in the
 * Schwarzschild coordinate time t of a far-away observer, which is what makes the famous effect
 * appear by itself: dt/dτ = E / (1 − r_s/r) diverges at the horizon, so infalling bodies slow,
 * redden and fade instead of visibly crossing it.
 *
 * – Rocks (asteroids, meteoroids): timelike geodesics
 *     d²r/dτ² = −M/r² + L²/r³ − 3ML²/r⁴,   dφ/dτ = L/r²,   dt/dτ = E/(1 − 2M/r),
 *   released at rest at apoapsis with L below the ISCO value 2√3·M, so they spiral in.
 *   They heat as they fall (shown as blackbody colour), observed colour shifted by
 *   g = √(1 − r_s/r) · √((1 − β∥)/(1 + β∥)).
 * – Stars: a Sun-like star is tidally disrupted at r_t = R☉ (M_BH/M☉)^⅓ ≈ 1.13 × 10⁸ km ≈ 8.9 r_s
 *   for Sgr A* (outside the horizon, so it is shredded, not swallowed whole); inside r_t it is
 *   replaced by a debris stream whose members carry a spread of orbital energy.
 * – Light: null geodesics d²x/dλ² = −(3/2) r_s h² x/r⁵. Rays with impact parameter below
 *   b_c = (3√3/2) r_s ≈ 2.6 r_s are captured; those just above loop around and escape.
 */

const RS = 24.0;                 // render units (matches SagittariusAStar default)
const M = RS / 2;
const C_UNITS_PER_SEC = 150;     // playback speed: how many render units light crosses per second
const TIDAL_R = 8.9 * RS;        // Sun-like star around 4.3 × 10⁶ M☉
const B_CRIT = (3 * Math.sqrt(3) / 2) * RS;
const TRAIL = 18;
const ROCK_VARIANTS = 4;
const ROCKS_PER_VARIANT = 40;

/** Lumpy, cratered asteroid shapes: an icosphere displaced by layered value noise. */
function makeRockGeometry(seed: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const hash = (x: number, y: number, z: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453;
    return h - Math.floor(h);
  };
  const noise = (x: number, y: number, z: number) => {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const fx = x - ix, fy = y - iy, fz = z - iz;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), sz = fz * fz * (3 - 2 * fz);
    const l = (a: number, b: number, t: number) => a + (b - a) * t;
    return l(
      l(l(hash(ix, iy, iz), hash(ix + 1, iy, iz), sx), l(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), sx), sy),
      l(l(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), sx), l(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), sx), sy),
      sz
    );
  };
  // Elongated, irregular bodies (most small asteroids are 1.3–2:1)
  const stretch = new THREE.Vector3(1 + seed * 0.18, 0.72 + (seed % 2) * 0.1, 0.8 - (seed % 3) * 0.06);
  const craters = Array.from({ length: 7 }, (_, i) => ({
    c: new THREE.Vector3(hash(i, 1, seed) - 0.5, hash(i, 2, seed) - 0.5, hash(i, 3, seed) - 0.5).normalize(),
    r: 0.25 + hash(i, 4, seed) * 0.35,
  }));
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let d = 1;
    d += (noise(v.x * 1.6 + seed, v.y * 1.6, v.z * 1.6) - 0.5) * 0.55;
    d += (noise(v.x * 4 + seed, v.y * 4, v.z * 4) - 0.5) * 0.18;
    d += (noise(v.x * 11 + seed, v.y * 11, v.z * 11) - 0.5) * 0.06;
    for (const cr of craters) {
      const a = v.angleTo(cr.c) / cr.r;
      if (a < 1.25) d += a < 1 ? -0.08 * (1 - a * a) : 0.05 * (1.25 - a) * 4 * (a - 1); // bowl and raised rim
    }
    v.multiplyScalar(d).multiply(stretch);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

type Kind = 'rock' | 'star' | 'debris' | 'photon';

interface Body {
  kind: Kind;
  alive: boolean;
  // orbital-plane state (timelike) or Cartesian state (photon)
  r: number;
  phi: number;
  ur: number;            // dr/dτ
  E: number;
  L: number;
  e1: THREE.Vector3;
  e2: THREE.Vector3;
  pos: THREE.Vector3;    // local Cartesian position
  vel: THREE.Vector3;    // photon direction / numeric velocity
  h2: number;            // photon angular momentum²
  trail: THREE.Vector3[];
  trailTimer: number;
  age: number;
  temp0: number;
  brightness: number;
  g: number;
  starStream?: boolean;
  /** Rocks: shape variant, size and tumble. */
  variant: number;
  size: number;
  spinAxis: THREE.Vector3;
  spinRate: number;
  quat: THREE.Quaternion;
}

function rand(a: number, b: number): number {
  return a + Math.random() * (b - a);
}

function randomPlane(tiltMax: number): [THREE.Vector3, THREE.Vector3] {
  // Mostly near the disk plane (XZ): infalling gas and rocks share the disk's angular momentum
  const tilt = rand(-tiltMax, tiltMax);
  const node = rand(0, Math.PI * 2);
  const n = new THREE.Vector3(Math.sin(tilt) * Math.cos(node), Math.cos(tilt), Math.sin(tilt) * Math.sin(node)).normalize();
  const e1 = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rand(0, Math.PI * 2));
  e1.addScaledVector(n, -e1.dot(n)).normalize();
  // Same orbital sense as the disk (approaching limb on the left of the black-hole shot)
  const e2 = new THREE.Vector3().crossVectors(e1, n).normalize();
  return [e1, e2];
}

/** Blackbody colour (Kelvin → linear RGB, unit max), as in the disk shader. */
function blackbody(T: number, out: THREE.Color): THREE.Color {
  const t = Math.min(40000, Math.max(1000, T)) / 100;
  const r = t <= 66 ? 1 : Math.min(1, Math.max(0, 1.29293618606 * Math.pow(t - 60, -0.1332047592)));
  const g = t <= 66
    ? Math.min(1, Math.max(0, 0.39008157876 * Math.log(t) - 0.63184144378))
    : Math.min(1, Math.max(0, 1.12989086089 * Math.pow(t - 60, -0.0755148492)));
  const b = t >= 66 ? 1 : t <= 19 ? 0 : Math.min(1, Math.max(0, 0.54320678911 * Math.log(t - 10) - 1.19625408914));
  return out.setRGB(Math.pow(r, 2.2), Math.pow(g, 2.2), Math.pow(b, 2.2));
}

export class BlackHoleInfall {
  public group = new THREE.Group();
  private bodies: Body[] = [];
  private heads: THREE.Points;
  private trails: THREE.LineSegments;
  private headPos: Float32Array;
  private headCol: Float32Array;
  private headSize: Float32Array;
  private trailPos: Float32Array;
  private trailCol: Float32Array;
  private camLocal = { value: new THREE.Vector3() };
  private opacity = { value: 1 };
  private spawnClock = 0;
  private starClock = 6;
  private photonClock = 0;
  private tmpCol = new THREE.Color();
  private tmpV = new THREE.Vector3();
  private rockMeshes: THREE.InstancedMesh[] = [];
  private rockEmit: Float32Array[] = [];
  private rockDim: Float32Array[] = [];
  private tmpM = new THREE.Matrix4();
  private tmpQ = new THREE.Quaternion();
  private tmpS = new THREE.Vector3();

  constructor(private readonly capacity = 220) {
    const n = capacity;
    this.headPos = new Float32Array(n * 3);
    this.headCol = new Float32Array(n * 3);
    this.headSize = new Float32Array(n);
    this.trailPos = new Float32Array(n * (TRAIL - 1) * 2 * 3);
    this.trailCol = new Float32Array(n * (TRAIL - 1) * 2 * 3);

    const occlusion = `
      uniform vec3 uCam;
      // Hidden when the line of sight passes behind the shadow (b < b_c and farther than the hole)
      float occluded(vec3 p) {
        vec3 d = normalize(p - uCam);
        float tHole = dot(-uCam, d);
        if (tHole <= 0.0) return 0.0;
        float b = length(cross(-uCam, d));
        float tP = dot(p - uCam, d);
        return (b < ${B_CRIT.toFixed(2)} && tP > tHole) ? 1.0 : 0.0;
      }
    `;

    const hg = new THREE.BufferGeometry();
    hg.setAttribute('position', new THREE.BufferAttribute(this.headPos, 3).setUsage(THREE.DynamicDrawUsage));
    hg.setAttribute('color', new THREE.BufferAttribute(this.headCol, 3).setUsage(THREE.DynamicDrawUsage));
    hg.setAttribute('size', new THREE.BufferAttribute(this.headSize, 1).setUsage(THREE.DynamicDrawUsage));
    this.heads = new THREE.Points(
      hg,
      new THREE.ShaderMaterial({
        uniforms: { uCam: this.camLocal, uOpacity: this.opacity },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vHide;
          ${occlusion}
          void main() {
            vColor = color;
            vHide = occluded(position);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = clamp(size * (1500.0 / max(-mv.z, 1.0)), 1.2, 9.0);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying vec3 vColor;
          varying float vHide;
          void main() {
            if (vHide > 0.5) discard;
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float core = exp(-d * d * 30.0);
            float halo = exp(-d * d * 7.0) * 0.35;
            gl_FragColor = vec4(vColor * (core + halo) * uOpacity, 1.0);
          }
        `,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    this.heads.frustumCulled = false;
    this.heads.renderOrder = 52;

    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(this.trailPos, 3).setUsage(THREE.DynamicDrawUsage));
    tg.setAttribute('color', new THREE.BufferAttribute(this.trailCol, 3).setUsage(THREE.DynamicDrawUsage));
    this.trails = new THREE.LineSegments(
      tg,
      new THREE.ShaderMaterial({
        uniforms: { uCam: this.camLocal, uOpacity: this.opacity },
        vertexShader: `
          varying vec3 vColor;
          varying float vHide;
          ${occlusion}
          void main() {
            vColor = color;
            vHide = occluded(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying vec3 vColor;
          varying float vHide;
          void main() {
            if (vHide > 0.5) discard;
            gl_FragColor = vec4(vColor * uOpacity, 1.0);
          }
        `,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    this.trails.frustumCulled = false;
    this.trails.renderOrder = 51;

    // Rocks: real 3D bodies, lit by the disk, heated on the side facing the hole
    const rockMat = new THREE.ShaderMaterial({
      uniforms: { uCam: this.camLocal, uOpacity: this.opacity, uRs: { value: RS } },
      vertexShader: `
        attribute vec3 aEmit;
        attribute float aDim;
        varying vec3 vLocal;
        varying vec3 vNormal;
        varying vec3 vObj;
        varying vec3 vEmit;
        varying float vDim;
        void main() {
          vec4 lp = instanceMatrix * vec4(position, 1.0);
          vLocal = lp.xyz;
          vNormal = normalize(mat3(instanceMatrix) * normal);
          vObj = position;
          vEmit = aEmit;
          vDim = aDim;
          gl_Position = projectionMatrix * modelViewMatrix * lp;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uRs;
        varying vec3 vLocal;
        varying vec3 vNormal;
        varying vec3 vObj;
        varying vec3 vEmit;
        varying float vDim;
        ${occlusion}
        float h3(vec3 p) { p = fract(p * 0.3183 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float n3(vec3 x) {
          vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        void main() {
          if (occluded(vLocal) > 0.5) discard;
          vec3 n = normalize(vNormal);
          // Regolith: dark carbonaceous grey-brown, mottled, with brighter fresh scarps
          float m = n3(vObj * 3.0) * 0.6 + n3(vObj * 9.0) * 0.3 + n3(vObj * 27.0) * 0.1;
          vec3 albedo = mix(vec3(0.07, 0.06, 0.055), vec3(0.2, 0.17, 0.14), m);
          // The accretion disk lights it: warm, from the hole, falling off as 1/r²
          float r = length(vLocal);
          vec3 L = normalize(-vLocal);
          float lightI = clamp(pow(9.0 * uRs / r, 2.0), 0.05, 6.0);
          float ndl = max(dot(n, L), 0.0);
          vec3 diskLight = vec3(1.0, 0.72, 0.42) * lightI;
          vec3 col = albedo * (diskLight * ndl + vec3(0.05, 0.04, 0.035));
          // Lensed halo light from above and below the disk plane
          col += albedo * vec3(0.9, 0.7, 0.5) * 0.25 * lightI * abs(n.y);
          // Thermal glow on the hot face
          col += vEmit * (0.25 + 0.75 * ndl);
          // Seen from afar its light is redshifted and dimmed near the horizon
          float g = vDim;
          col *= mix(vec3(1.0, 0.3, 0.12), vec3(1.0), clamp(g * 1.4, 0.0, 1.0)) * pow(g, 2.0);
          gl_FragColor = vec4(col, uOpacity);
        }
      `,
      transparent: true,
      depthWrite: true,
    });
    for (let v = 0; v < ROCK_VARIANTS; v++) {
      const geo = makeRockGeometry(v + 1);
      const emit = new Float32Array(ROCKS_PER_VARIANT * 3);
      const dim = new Float32Array(ROCKS_PER_VARIANT);
      geo.setAttribute('aEmit', new THREE.InstancedBufferAttribute(emit, 3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('aDim', new THREE.InstancedBufferAttribute(dim, 1).setUsage(THREE.DynamicDrawUsage));
      const mesh = new THREE.InstancedMesh(geo, rockMat, ROCKS_PER_VARIANT);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.renderOrder = 53;
      this.rockMeshes.push(mesh);
      this.rockEmit.push(emit);
      this.rockDim.push(dim);
      this.group.add(mesh);
    }

    this.group.add(this.trails, this.heads);
    this.group.name = 'sgr_a_infall';
    for (let i = 0; i < 18; i++) this.spawnRock(true);
  }

  private alloc(kind: Kind): Body | null {
    let b = this.bodies.find((x) => !x.alive);
    if (!b) {
      if (this.bodies.length >= this.capacity) return null;
      b = {
        kind, alive: false, r: 0, phi: 0, ur: 0, E: 1, L: 0,
        e1: new THREE.Vector3(), e2: new THREE.Vector3(), pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        h2: 0, trail: Array.from({ length: TRAIL }, () => new THREE.Vector3()), trailTimer: 0, age: 0, temp0: 2000, brightness: 1, g: 1,
        variant: 0, size: 1, spinAxis: new THREE.Vector3(0, 1, 0), spinRate: 0, quat: new THREE.Quaternion(),
      };
      this.bodies.push(b);
    }
    b.kind = kind;
    b.alive = true;
    b.age = 0;
    b.trailTimer = 0;
    b.starStream = false;
    return b;
  }

  /** Released at rest (apoapsis) with sub-ISCO angular momentum: a few turns, then the plunge. */
  private spawnRock(prewarm = false): void {
    const b = this.alloc('rock');
    if (!b) return;
    [b.e1, b.e2] = randomPlane(0.35);
    b.r = rand(11, 19) * RS;
    b.phi = rand(0, Math.PI * 2);
    b.L = rand(0.55, 0.97) * 2 * Math.sqrt(3) * M;
    b.E = Math.sqrt((1 - 2 * M / b.r) * (1 + (b.L * b.L) / (b.r * b.r)));
    b.ur = 0;
    b.temp0 = rand(1600, 2600);
    b.brightness = rand(1.6, 3.2);
    b.variant = Math.floor(Math.random() * ROCK_VARIANTS);
    // Enlarged for visibility: a real meteoroid is ~10⁻⁸ r_s across
    b.size = rand(0.5, 2.0) * (Math.random() < 0.15 ? 2.2 : 1);
    b.spinAxis.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
    b.spinRate = rand(0.3, 1.6);
    b.quat.setFromAxisAngle(b.spinAxis, rand(0, Math.PI * 2));
    this.toCartesian(b);
    for (const p of b.trail) p.copy(b.pos);
    if (prewarm) for (let i = 0; i < 60; i++) this.stepTimelike(b, rand(0, 6) / 60);
  }

  private spawnStar(): void {
    const b = this.alloc('star');
    if (!b) return;
    [b.e1, b.e2] = randomPlane(0.6);
    b.r = rand(20, 26) * RS;
    b.phi = rand(0, Math.PI * 2);
    b.L = rand(0.75, 0.95) * 2 * Math.sqrt(3) * M;
    b.E = Math.sqrt((1 - 2 * M / b.r) * (1 + (b.L * b.L) / (b.r * b.r)));
    b.ur = 0;
    b.temp0 = 5800;
    b.brightness = 2.4;
    this.toCartesian(b);
    for (const p of b.trail) p.copy(b.pos);
  }

  /** Tidal disruption: the star becomes a stream of debris with a spread of specific energy. */
  private disrupt(star: Body): void {
    star.alive = false;
    for (let i = 0; i < 70; i++) {
      const d = this.alloc('debris');
      if (!d) return;
      d.e1.copy(star.e1);
      d.e2.copy(star.e2);
      const spread = (i / 69 - 0.5);
      d.r = star.r * (1 + spread * 0.06);
      d.phi = star.phi - spread * 0.25;
      d.L = star.L * (1 + spread * 0.12);
      d.E = star.E * (1 + spread * 0.015);
      d.ur = star.ur * (1 + spread * 0.1);
      d.temp0 = rand(4500, 9000);
      d.brightness = 0.9;
      d.starStream = true;
      this.toCartesian(d);
      for (const p of d.trail) p.copy(d.pos);
    }
  }

  /** Light from a distant source: a fan of rays, some below the critical impact parameter. */
  private spawnPhotons(): void {
    const dir = new THREE.Vector3(rand(-1, 1), rand(-0.3, 0.3), rand(-1, 1)).normalize();
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(side, dir).normalize();
    const start = dir.clone().multiplyScalar(-26 * RS);
    for (let i = 0; i < 9; i++) {
      const p = this.alloc('photon');
      if (!p) return;
      const bImpact = (0.3 + i * 0.16) * B_CRIT; // 0.3 b_c … 1.6 b_c
      const ang = rand(0, Math.PI * 2);
      p.pos.copy(start).addScaledVector(side, Math.cos(ang) * bImpact).addScaledVector(up, Math.sin(ang) * bImpact);
      p.vel.copy(dir);
      const Lv = this.tmpV.crossVectors(p.pos, p.vel);
      p.h2 = Lv.lengthSq();
      p.temp0 = 9000;
      p.brightness = 1.4;
      for (const q of p.trail) q.copy(p.pos);
    }
  }

  private toCartesian(b: Body): void {
    b.pos.copy(b.e1).multiplyScalar(Math.cos(b.phi) * b.r).addScaledVector(b.e2, Math.sin(b.phi) * b.r);
  }

  /** Advance a timelike body by coordinate time dt (render-units of light travel). */
  private stepTimelike(b: Body, dtSec: number): void {
    let remaining = dtSec * C_UNITS_PER_SEC;
    let guard = 0;
    while (remaining > 0 && guard++ < 40) {
      const f = 1 - (2 * M) / b.r;
      if (f <= 0.002) {
        b.alive = false;
        return;
      }
      // dt/dτ = E / f  ⇒  dτ = f/E · dt. Sub-step so the radius never changes by more than 2%.
      const dt = Math.min(remaining, 0.02 * b.r / Math.max(0.05, Math.abs(b.ur) * f / b.E + (b.L / b.r) * f / b.E));
      const dtau = (f / b.E) * dt;
      const ar = -M / (b.r * b.r) + (b.L * b.L) / (b.r * b.r * b.r) - (3 * M * b.L * b.L) / Math.pow(b.r, 4);
      b.ur += ar * dtau;
      b.r += b.ur * dtau;
      b.phi += (b.L / (b.r * b.r)) * dtau;
      remaining -= dt;
    }
    this.toCartesian(b);
  }

  /** Advance a photon along its null geodesic, slowed by the lapse near the horizon. */
  private stepPhoton(p: Body, dtSec: number): void {
    let remaining = dtSec * C_UNITS_PER_SEC;
    let guard = 0;
    while (remaining > 0 && guard++ < 60) {
      const r = p.pos.length();
      const f = 1 - RS / r;
      if (f <= 0.003) {
        p.alive = false;
        return;
      }
      if (r > 30 * RS && p.pos.dot(p.vel) > 0) {
        p.alive = false; // escaped
        return;
      }
      const dl = Math.min(remaining * f, 0.05 * r);
      const k = (-1.5 * RS * p.h2) / Math.pow(r, 5);
      p.vel.addScaledVector(p.pos, k * dl).normalize();
      p.pos.addScaledVector(p.vel, dl);
      remaining -= dl / f;
    }
  }

  public update(camera: THREE.Camera, dtSec: number, groupWorldToLocal: (v: THREE.Vector3) => THREE.Vector3): void {
    dtSec = Math.min(0.05, Math.max(0, dtSec));
    const cam = groupWorldToLocal(this.tmpV.copy(camera.position));
    this.camLocal.value.copy(cam);

    // Feed the hole
    this.spawnClock -= dtSec;
    this.starClock -= dtSec;
    this.photonClock -= dtSec;
    const rocks = this.bodies.filter((b) => b.alive && b.kind === 'rock').length;
    if (this.spawnClock <= 0 && rocks < 26) {
      this.spawnRock();
      this.spawnClock = rand(0.35, 0.9);
    }
    if (this.starClock <= 0) {
      this.spawnStar();
      this.starClock = rand(22, 34);
    }
    if (this.photonClock <= 0) {
      this.spawnPhotons();
      this.photonClock = rand(5, 8);
    }

    const toCam = new THREE.Vector3();
    let hi = 0;
    let ti = 0;
    const rockCount = new Array(ROCK_VARIANTS).fill(0);
    for (const b of this.bodies) {
      if (!b.alive) continue;
      b.age += dtSec;
      if (b.kind === 'photon') this.stepPhoton(b, dtSec);
      else this.stepTimelike(b, dtSec);
      if (b.kind === 'star' && b.alive && b.r < TIDAL_R) this.disrupt(b);
      if (!b.alive) continue;

      // Trail history
      b.trailTimer -= dtSec;
      if (b.trailTimer <= 0) {
        b.trailTimer = b.kind === 'photon' ? 0.02 : 0.06;
        const last = b.trail.pop()!;
        b.trail.unshift(last.copy(b.pos));
      } else {
        b.trail[0].copy(b.pos);
      }

      // Observed shift: gravitational × Doppler along the line of sight
      const r = b.pos.length();
      const grav = Math.sqrt(Math.max(0, 1 - RS / r));
      toCam.subVectors(cam, b.pos).normalize();
      let betaLos = 0;
      if (b.kind !== 'photon' && b.trail[1]) {
        const v = this.tmpV.subVectors(b.trail[0], b.trail[1]);
        const speed = Math.min(0.95, Math.sqrt(RS / r));
        if (v.lengthSq() > 1e-9) betaLos = v.normalize().dot(toCam) * speed;
      }
      const g = grav * Math.sqrt((1 + betaLos) / (1 - betaLos));
      b.g = g;
      if (g < 0.04 && b.kind !== 'photon') {
        b.alive = false; // faded into the horizon for a distant observer
        continue;
      }
      // Rocks and debris heat as they fall in
      const heat = b.kind === 'rock' ? Math.pow(15 * RS / Math.max(r, RS), 0.75) : 1;
      const T = b.temp0 * heat * g;
      blackbody(T, this.tmpCol).multiplyScalar(b.brightness * Math.pow(g, 4) * Math.min(1, b.age * 1.5));

      if (b.kind === 'rock') {
        const v = b.variant;
        const k = rockCount[v];
        if (k < ROCKS_PER_VARIANT) {
          this.tmpQ.setFromAxisAngle(b.spinAxis, b.spinRate * dtSec);
          b.quat.premultiply(this.tmpQ);
          this.tmpS.setScalar(b.size);
          this.tmpM.compose(b.pos, b.quat, this.tmpS);
          this.rockMeshes[v].setMatrixAt(k, this.tmpM);
          // Thermal glow only once it is properly hot (blackbody colour × observed shift)
          const hot = Math.max(0, Math.min(1, (b.temp0 * heat - 2400) / 3000));
          blackbody(b.temp0 * heat * g, this.tmpCol).multiplyScalar(hot * 1.6);
          this.rockEmit[v].set([this.tmpCol.r, this.tmpCol.g, this.tmpCol.b], k * 3);
          this.rockDim[v][k] = Math.min(1, g) * Math.min(1, b.age * 1.5);
          rockCount[v] = k + 1;
        }
        blackbody(T, this.tmpCol).multiplyScalar(0.35 * Math.pow(g, 4) * Math.min(1, b.age * 1.5));
      }

      const s = b.kind === 'star' ? 4.5 : b.kind === 'photon' ? 1.4 : b.kind === 'debris' ? 2.0 : 3.2;
      if (b.kind !== 'rock') {
        this.headPos.set([b.pos.x, b.pos.y, b.pos.z], hi * 3);
        this.headCol.set([this.tmpCol.r, this.tmpCol.g, this.tmpCol.b], hi * 3);
        this.headSize[hi] = s;
        hi++;
      }

      for (let k = 0; k < TRAIL - 1; k++) {
        const a = b.trail[k];
        const c = b.trail[k + 1];
        const fade = Math.pow(1 - k / (TRAIL - 1), 1.3) * (b.kind === 'photon' ? 1.6 : 1.2);
        this.trailPos.set([a.x, a.y, a.z, c.x, c.y, c.z], ti * 6);
        const col = b.kind === 'photon' ? [0.8 * fade, 0.9 * fade, 1.2 * fade] : [this.tmpCol.r * fade, this.tmpCol.g * fade, this.tmpCol.b * fade];
        this.trailCol.set([...col, ...col], ti * 6);
        ti++;
      }
    }

    for (let v = 0; v < ROCK_VARIANTS; v++) {
      const mesh = this.rockMeshes[v];
      mesh.count = rockCount[v];
      mesh.instanceMatrix.needsUpdate = true;
      (mesh.geometry.attributes.aEmit as THREE.InstancedBufferAttribute).needsUpdate = true;
      (mesh.geometry.attributes.aDim as THREE.InstancedBufferAttribute).needsUpdate = true;
    }

    const hg = this.heads.geometry;
    hg.setDrawRange(0, hi);
    (hg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (hg.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    (hg.attributes.size as THREE.BufferAttribute).needsUpdate = true;
    const tg = this.trails.geometry;
    tg.setDrawRange(0, ti * 2);
    (tg.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (tg.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  }

  public setOpacity(o: number): void {
    this.opacity.value = o;
  }

  public dispose(): void {
    this.heads.geometry.dispose();
    (this.heads.material as THREE.Material).dispose();
    this.trails.geometry.dispose();
    (this.trails.material as THREE.Material).dispose();
    for (const m of this.rockMeshes) m.geometry.dispose();
    if (this.rockMeshes[0]) (this.rockMeshes[0].material as THREE.Material).dispose();
  }
}
