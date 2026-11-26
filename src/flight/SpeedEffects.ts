import * as THREE from 'three';
import { AIRSHOW_SMOKE_BY_ID, type AirshowSmokeId } from './JetSkins';

/**
 * Near-field effects in the jet's own metre-scale space (the overlay scene, camera at the origin).
 *
 * SpeedField: motes that streak past the canopy. In air they are moisture and haze, dense and
 * soft; in vacuum a sparse glitter of dust and ice. Their speed is the jet's real speed up to a
 * few km/s (beyond that the eye cannot follow single motes anyway) and they stretch with it.
 *
 * Trail / VortexRig: fading condensation ribbons from wingtips, LERX/canard strake roots, and
 * contrails. Points are kept in world render units (double precision) and rebuilt relative to
 * the camera every frame, so trails stay anchored cleanly in air and orbital reference frames.
 */

const COUNT = 1800;
const BOX = 520;

export class SpeedField {
  public readonly mesh: THREE.LineSegments;
  private pts = new Float32Array(COUNT * 3);
  private positions: Float32Array;
  private colors: Float32Array;
  private material: THREE.LineBasicMaterial;
  private seed = 11;

  constructor() {
    this.positions = new Float32Array(COUNT * 6);
    this.colors = new Float32Array(COUNT * 6);
    for (let i = 0; i < COUNT; i++) {
      this.pts[i * 3] = (this.rand() - 0.5) * BOX * 2;
      this.pts[i * 3 + 1] = (this.rand() - 0.5) * BOX * 2;
      this.pts[i * 3 + 2] = (this.rand() - 0.5) * BOX * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    this.material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.mesh = new THREE.LineSegments(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
  }

  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  /**
   * @param velMps velocity of the air/space relative to the jet's frame, m/s (world axes)
   * @param air 0 vacuum .. 1 dense air
   * @param brightness overall gain (sunlit vs night)
   */
  public update(dt: number, velMps: THREE.Vector3, air: number, brightness: number, mach = 0, boosting = false): void {
    const speed = velMps.length();
    const shown = Math.min(speed, 2600);
    const k = speed > 1e-6 ? shown / speed : 0;
    const vx = velMps.x * k;
    const vy = velMps.y * k;
    const vz = velMps.z * k;
    // Streak length: a 1/30 s shutter, plus extra stretch past the speed of sound
    // In vacuum, past the speed the eye can follow, the dust stretches into long threads with the
    // drive: the space around you reads as moving, not a painted backdrop
    const drive = air < 0.05 ? Math.min(0.5, Math.log10(1 + speed / 2600) * 0.09) : 0;
    const boostStretch = boosting ? 0.22 : 0;
    const machStretch = mach > 1 ? Math.min(0.12, (mach / 22) * 0.12) : 0;
    const stretch = 1 / 30 + Math.min(0.18, Math.log10(1 + speed / 300) * 0.06) + drive + boostStretch + machStretch;
    const active = Math.round(COUNT * (0.25 + 0.75 * air));
    // In air the motes are only a hint (real air is clear: at Mach 20 nothing streaks past the
    // canopy); in space the dust and the drive's threads carry the sense of speed
    const inAir = air > 0.05;
    const base = inAir
      ? 0.07 * brightness * THREE.MathUtils.smoothstep(shown, 25, 300) * (boosting ? 1.4 : 1)
      : (0.22 + 0.25 * air) * brightness * THREE.MathUtils.smoothstep(shown, 25, 300) * (1 + (mach > 1 ? 0.5 : 0) + (boosting ? 0.6 : 0));
    const tint = mach > 2 ? [0.95, 0.98, 1.0] : mach >= 0.95 ? [0.9, 0.95, 1.0] : air > 0.05 ? [0.86, 0.92, 1.0] : [0.75, 0.82, 1.0];
    for (let i = 0; i < COUNT; i++) {
      let x = this.pts[i * 3] - vx * dt;
      let y = this.pts[i * 3 + 1] - vy * dt;
      let z = this.pts[i * 3 + 2] - vz * dt;
      // Wrap around the box (the field travels with the camera)
      if (x < -BOX) x += BOX * 2; else if (x > BOX) x -= BOX * 2;
      if (y < -BOX) y += BOX * 2; else if (y > BOX) y -= BOX * 2;
      if (z < -BOX) z += BOX * 2; else if (z > BOX) z -= BOX * 2;
      this.pts[i * 3] = x;
      this.pts[i * 3 + 1] = y;
      this.pts[i * 3 + 2] = z;
      const o = i * 6;
      this.positions[o] = x;
      this.positions[o + 1] = y;
      this.positions[o + 2] = z;
      this.positions[o + 3] = x + vx * stretch;
      this.positions[o + 4] = y + vy * stretch;
      this.positions[o + 5] = z + vz * stretch;
      const d = Math.sqrt(x * x + y * y + z * z);
      const near = (1 - THREE.MathUtils.smoothstep(d, BOX * 0.25, BOX)) * THREE.MathUtils.smoothstep(d, 8, 28);
      const a = i < active ? base * near * (0.4 + 0.6 * ((i * 7919) % 97) / 97) : 0;
      this.colors[o] = 0;
      this.colors[o + 1] = 0;
      this.colors[o + 2] = 0;
      this.colors[o + 3] = tint[0] * a;
      this.colors[o + 4] = tint[1] * a;
      this.colors[o + 5] = tint[2] * a;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.color.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

const TRAIL_POINTS = 90;

export class Trail {
  public readonly mesh: THREE.Mesh;
  private world: Float64Array = new Float64Array(TRAIL_POINTS * 3);
  private age: Float32Array = new Float32Array(TRAIL_POINTS);
  private strength: Float32Array = new Float32Array(TRAIL_POINTS);
  private count = 0;
  private head = 0;
  private sinceSample = 0;
  private positions = new Float32Array(TRAIL_POINTS * 2 * 3);
  private alphas = new Float32Array(TRAIL_POINTS * 2);
  private axialAge = new Float32Array(TRAIL_POINTS * 2);
  private material: THREE.ShaderMaterial;

  constructor(private width: number, private lifetime: number, color: THREE.ColorRepresentation, coreTightness = 1.0) {
    const g = new THREE.BufferGeometry();
    const across = new Float32Array(TRAIL_POINTS * 2);
    for (let i = 0; i < TRAIL_POINTS; i++) {
      across[i * 2] = -1;
      across[i * 2 + 1] = 1;
    }
    g.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAcross', new THREE.BufferAttribute(across, 1));
    g.setAttribute('aAge', new THREE.BufferAttribute(this.axialAge, 1).setUsage(THREE.DynamicDrawUsage));
    const idx: number[] = [];
    for (let i = 0; i < TRAIL_POINTS - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    g.setIndex(idx);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 },
        uTightness: { value: coreTightness },
        uOpacityGain: { value: 1.0 },
      },
      vertexShader: /* glsl */ `
        attribute float alpha;
        attribute float aAcross;
        attribute float aAge;
        varying float vA;
        varying float vAcross;
        varying float vAge;
        void main() {
          vA = alpha;
          vAcross = aAcross;
          vAge = aAge;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uTightness;
        uniform float uOpacityGain;
        varying float vA;
        varying float vAcross;
        varying float vAge;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        void main() {
          // Tight laminar vortex core near the wing/strake, diffusing into curling mist downstream
          float focus = mix(2.4 * uTightness, 0.85, clamp(vAge * 1.4, 0.0, 1.0));
          float core = exp(-vAcross * vAcross * focus);
          float swirl = 0.72 + 0.28 * noise(vec2(vAge * 18.0 - uTime * 3.5, vAcross * 2.5 + sin(vAge * 9.0)));
          float wispyBreak = smoothstep(0.0, 0.28, core * swirl);
          float a = clamp(vA * mix(core, core * wispyBreak, 0.65) * uOpacityGain, 0.0, 0.92);
          if (a < 0.002) discard;
          vec3 col = mix(uColor * 0.92, mix(vec3(1.0), uColor * 1.45, clamp(uOpacityGain - 1.0, 0.0, 1.0)), core * 0.34);
          gl_FragColor = vec4(col * a, a);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
    this.mesh.userData.noAO = true;
  }

  public setAppearance(color: THREE.ColorRepresentation, opacityGain = 1.0): void {
    this.material.uniforms.uColor.value.set(color);
    this.material.uniforms.uOpacityGain.value = opacityGain;
  }

  public clear(): void {
    this.count = 0;
    this.head = 0;
  }

  /** Carry the trail with the world the jet rides (see ExhaustSmoke.shift). */
  public shift(delta: THREE.Vector3, rot: THREE.Quaternion | null, centre: THREE.Vector3): void {
    const v = new THREE.Vector3();
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const o = i * 3;
      if (rot) {
        v.set(this.world[o] - centre.x, this.world[o + 1] - centre.y, this.world[o + 2] - centre.z).applyQuaternion(rot);
        this.world[o] = centre.x + v.x;
        this.world[o + 1] = centre.y + v.y;
        this.world[o + 2] = centre.z + v.z;
      } else {
        this.world[o] += delta.x;
        this.world[o + 1] += delta.y;
        this.world[o + 2] += delta.z;
      }
    }
  }

  /**
   * @param emitWorld emission point in world render units
   * @param strength 0..1 how much vapour is being made right now
   * @param camWorld camera position, render units
   * @param metresPerUnit conversion to the overlay's metres
   * @param camForward camera forward vector
   */
  public update(dt: number, emitWorld: THREE.Vector3, strength: number, camWorld: THREE.Vector3, metresPerUnit: number, camForward: THREE.Vector3): void {
    this.material.uniforms.uTime.value += dt;
    for (let i = 0; i < this.count; i++) this.age[(this.head - 1 - i + TRAIL_POINTS) % TRAIL_POINTS] += dt;
    this.sinceSample += dt;
    if (this.sinceSample > 1 / 40) {
      this.sinceSample = 0;
      const h = this.head;
      this.world[h * 3] = emitWorld.x;
      this.world[h * 3 + 1] = emitWorld.y;
      this.world[h * 3 + 2] = emitWorld.z;
      this.age[h] = 0;
      this.strength[h] = strength;
      this.head = (h + 1) % TRAIL_POINTS;
      this.count = Math.min(TRAIL_POINTS, this.count + 1);
    }
    // Build the ribbon newest → oldest, camera-relative metres
    let px = 0;
    let py = 0;
    let pz = 0;
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const o = i * 6;
      if (i >= this.count) {
        this.positions.fill(0, o, o + 6);
        this.alphas[i * 2] = this.alphas[i * 2 + 1] = 0;
        this.axialAge[i * 2] = this.axialAge[i * 2 + 1] = 1;
        continue;
      }
      const j = (this.head - 1 - i + TRAIL_POINTS) % TRAIL_POINTS;
      const x = (this.world[j * 3] - camWorld.x) * metresPerUnit;
      const y = (this.world[j * 3 + 1] - camWorld.y) * metresPerUnit;
      const z = (this.world[j * 3 + 2] - camWorld.z) * metresPerUnit;
      // Width direction: perpendicular to the trail and the view
      let tx = i > 0 ? px - x : 0;
      let ty = i > 0 ? py - y : 0;
      let tz = i > 0 ? pz - z : 1;
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl; ty /= tl; tz /= tl;
      let wx = ty * camForward.z - tz * camForward.y;
      let wy = tz * camForward.x - tx * camForward.z;
      let wz = tx * camForward.y - ty * camForward.x;
      const wl = Math.hypot(wx, wy, wz) || 1;
      const t = Math.min(1, this.age[j] / this.lifetime);
      const w = this.width * (1 + t * 5.2) * 0.5;
      wx = (wx / wl) * w; wy = (wy / wl) * w; wz = (wz / wl) * w;
      this.positions[o] = x - wx;
      this.positions[o + 1] = y - wy;
      this.positions[o + 2] = z - wz;
      this.positions[o + 3] = x + wx;
      this.positions[o + 4] = y + wy;
      this.positions[o + 5] = z + wz;
      const a = Math.max(0, 1 - t) * this.strength[j] * 0.62 * Math.min(1, i / 2);
      this.alphas[i * 2] = this.alphas[i * 2 + 1] = a;
      this.axialAge[i * 2] = this.axialAge[i * 2 + 1] = t;
      px = x; py = y; pz = z;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.alpha.needsUpdate = true;
    this.mesh.geometry.attributes.aAge.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

export interface VortexRigInputs {
  wingtips: [THREE.Vector3, THREE.Vector3];
  strakes: [THREE.Vector3, THREE.Vector3];
  nozzles: [THREE.Vector3, THREE.Vector3];
  wingtipStrength: number;
  strakeStrength: number;
  contrailStrength: number;
}

/**
 * Bundled wingtip, LERX/canard strake, and high-altitude contrail vortex emitters.
 * Stores all world points in double precision so shifting across orbital boundaries stays exact.
 */
export class VortexRig {
  public readonly wingtips: [Trail, Trail] = [new Trail(0.46, 2.5, 0xffffff, 1.15), new Trail(0.46, 2.5, 0xffffff, 1.15)];
  public readonly strakes: [Trail, Trail] = [new Trail(0.34, 1.35, 0xf2f7ff, 1.65), new Trail(0.34, 1.35, 0xf2f7ff, 1.65)];
  public readonly contrails: [Trail, Trail] = [new Trail(1.2, 6.0, 0xeef3ff, 0.75), new Trail(1.2, 6.0, 0xeef3ff, 0.75)];
  public readonly all: Trail[];

  constructor() {
    this.all = [...this.wingtips, ...this.strakes, ...this.contrails];
  }

  public setAirshowSmoke(mode: AirshowSmokeId): void {
    if (mode === 'off') {
      this.wingtips[0].setAppearance(0xffffff, 1.0);
      this.wingtips[1].setAppearance(0xffffff, 1.0);
      this.contrails[0].setAppearance(0xeef3ff, 1.0);
      this.contrails[1].setAppearance(0xeef3ff, 1.0);
      return;
    }
    const spec = AIRSHOW_SMOKE_BY_ID[mode];
    const tipCol = new THREE.Color(0xffffff).lerp(new THREE.Color(spec.accentHex), 0.72);
    const conCol = new THREE.Color(spec.colorHex).lerp(new THREE.Color(0xffffff), 0.22);
    this.wingtips[0].setAppearance(tipCol, 1.28);
    this.wingtips[1].setAppearance(tipCol, 1.28);
    this.contrails[0].setAppearance(conCol, 1.35);
    this.contrails[1].setAppearance(conCol, 1.35);
  }

  public addTo(parent: THREE.Object3D): void {
    for (const t of this.all) parent.add(t.mesh);
  }

  public clear(): void {
    for (const t of this.all) t.clear();
  }

  public shift(delta: THREE.Vector3, rot: THREE.Quaternion | null, centre: THREE.Vector3): void {
    for (const t of this.all) t.shift(delta, rot, centre);
  }

  public update(dt: number, input: VortexRigInputs, camWorld: THREE.Vector3, metresPerUnit: number, camForward: THREE.Vector3): void {
    this.wingtips[0].update(dt, input.wingtips[0], input.wingtipStrength, camWorld, metresPerUnit, camForward);
    this.wingtips[1].update(dt, input.wingtips[1], input.wingtipStrength, camWorld, metresPerUnit, camForward);
    this.strakes[0].update(dt, input.strakes[0], input.strakeStrength, camWorld, metresPerUnit, camForward);
    this.strakes[1].update(dt, input.strakes[1], input.strakeStrength, camWorld, metresPerUnit, camForward);
    this.contrails[0].update(dt, input.nozzles[0], input.contrailStrength, camWorld, metresPerUnit, camForward);
    this.contrails[1].update(dt, input.nozzles[1], input.contrailStrength, camWorld, metresPerUnit, camForward);
  }

  public dispose(): void {
    for (const t of this.all) t.dispose();
  }
}

/**
 * Shock & Transonic Condensation:
 *  - Prandtl-Glauert vapor cone shader peaking across Mach 0.96–1.04 with sharp rear shockwall
 *  - Transient expanding sonic boom pressure collar when crossing Mach 1 or lighting full AB
 *  - Atmospheric entry bow plasma sheath & hypersonic oblique Mach cone (> Mach 1.15)
 */
export class ShockEffects {
  public readonly group = new THREE.Group();
  private plasmaMat: THREE.ShaderMaterial;
  private coneMat: THREE.ShaderMaterial;
  private cone: THREE.Mesh;
  private coneDiscMat: THREE.ShaderMaterial;
  private coneDisc: THREE.Mesh;
  private collarMat: THREE.ShaderMaterial;
  private collar: THREE.Mesh;
  private conePulse = 0;
  private collarLife = 0;
  private coneOpacity = 0;
  private hypersonicConeMat: THREE.ShaderMaterial;
  private hypersonicCone: THREE.Mesh;
  private hypersonicOpacity = 0;

  constructor() {
    this.plasmaMat = new THREE.ShaderMaterial({
      uniforms: { uHeat: { value: 0 }, uTime: { value: 0 } },
      vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform float uHeat; uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main(){
          // A sheath of glowing air: bright at the rim of the shape and at the nose, clear through the middle
          float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0);
          float front = smoothstep(0.1, -0.9, vP.z);          // hottest at the nose (-Z)
          float flick = 0.85 + 0.15 * sin(uTime * 37.0 + vP.z * 3.0) * sin(uTime * 23.0 + vP.x * 5.0);
          vec3 col = mix(vec3(1.0, 0.35, 0.08), vec3(1.0, 0.85, 0.6), front);
          float a = uHeat * fres * (0.15 + front) * flick;
          gl_FragColor = vec4(col * a * 2.0, 1.0);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), this.plasmaMat);
    shell.scale.set(3.6, 1.6, 9.8);
    shell.position.z = -0.6;
    shell.renderOrder = 7;
    this.group.add(shell);

    // Prandtl-Glauert condensation cone: sleek translucent swept vapor collar seated aft of the
    // cockpit over the wings & mid-fuselage so it never obscures the aircraft or blinds the camera.
    const CONE_LEN = 3.8;
    const CONE_RAD = 2.75;
    this.coneMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 }, uMach: { value: 1 } },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uMach;
        varying float vAxial;
        varying float vAng;
        varying vec3 vN;
        varying vec3 vV;
        varying float vLocalRad;
        void main() {
          vec3 p = position;
          // Cone rotated -PI/2 around X: z spans -CONE_LEN/2 (apex) .. +CONE_LEN/2 (rear wall)
          vAxial = clamp(p.z / 3.8 + 0.5, 0.0, 1.0);
          vAng = atan(p.y, p.x);
          // Slight aerodynamic pinch near the nose and subtle flutter toward the trailing lip
          float pinch = pow(vAxial, 0.85);
          float wave = (sin(vAng * 5.0 + uTime * 24.0) + 0.45 * cos(vAng * 8.0 - uTime * 36.0)) * 0.045 * smoothstep(0.3, 0.95, vAxial);
          p.xy *= (0.86 + 0.14 * pinch) * (1.0 + wave);
          vLocalRad = length(p.xy) / 2.75;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        uniform float uTime;
        varying float vAxial;
        varying float vAng;
        varying vec3 vN;
        varying vec3 vV;
        varying float vLocalRad;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm(vec2 p) {
          return noise(p) * 0.55 + noise(p * 2.13 + 3.7) * 0.30 + noise(p * 4.41 - 1.9) * 0.15;
        }
        void main() {
          // Keep the core fuselage / cockpit corridor clear so the jet silhouette stays crisp
          float coreClear = smoothstep(0.16, 0.44, vLocalRad);
          float front = smoothstep(0.08, 0.50, vAxial);
          float shockWall = exp(-pow((vAxial - 0.88) / 0.085, 2.0)) * 0.85;
          float rearCut = 1.0 - smoothstep(0.91, 1.0, vAxial);
          vec2 flowUv = vec2(vAng * 2.8, vAxial * 5.0 - uTime * 9.0);
          float cloud = smoothstep(0.28, 0.86, fbm(flowUv) * 0.82 + 0.24 * smoothstep(0.55, 0.92, vAxial));
          // Edge-weighted condensation profile (denser along the grazed cone mantle, translucent face-on)
          float ndv = abs(dot(normalize(vN), normalize(vV)));
          float rimLift = mix(0.95, 0.42, pow(ndv, 0.85));
          float dens = (front * cloud * 0.62 + shockWall * (0.42 + 0.45 * cloud)) * rearCut * coreClear * rimLift;
          float a = clamp(uOpacity * dens * 0.52, 0.0, 0.40);
          if (a < 0.004) discard;
          vec3 skyMist = vec3(0.84, 0.91, 0.99);
          vec3 pureWhite = vec3(0.98, 0.99, 1.0);
          vec3 col = mix(skyMist, pureWhite, clamp(shockWall * 0.6 + dens * 0.3, 0.0, 1.0));
          gl_FragColor = vec4(col, a);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    const coneGeo = new THREE.ConeGeometry(CONE_RAD, CONE_LEN, 64, 24, true);
    coneGeo.rotateX(-Math.PI / 2); // apex forward
    this.cone = new THREE.Mesh(coneGeo, this.coneMat);
    this.cone.position.z = 1.9;
    this.cone.renderOrder = 7;
    this.cone.visible = false;
    this.group.add(this.cone);

    // Subtle translucent shockwall annulus at the rear lip of the vapor cone (leaves fuselage & tailpipe clear)
    this.coneDiscMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 } },
      vertexShader: `varying vec2 vP; void main(){ vP = position.xy / 2.75; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        uniform float uTime;
        varying vec2 vP;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        void main() {
          float r = length(vP);
          float ang = atan(vP.y, vP.x);
          float inner = smoothstep(0.42, 0.68, r);
          float outer = 1.0 - smoothstep(0.80, 1.0, r);
          float n = 0.60 + 0.40 * noise(vec2(ang * 3.0 + uTime * 4.0, r * 6.0));
          float a = uOpacity * inner * outer * n * 0.15;
          if (a < 0.003) discard;
          gl_FragColor = vec4(0.92, 0.96, 1.0, a);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    this.coneDisc = new THREE.Mesh(new THREE.RingGeometry(1.15, CONE_RAD, 56), this.coneDiscMat);
    this.coneDisc.position.z = 1.9 + CONE_LEN * 0.46;
    this.coneDisc.renderOrder = 7;
    this.coneDisc.visible = false;
    this.group.add(this.coneDisc);

    // Delicate expanding transient sonic boom / AB shock ripple sweeping aft
    this.collarMat = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uOpacity; varying vec2 vUv; void main(){
        float ring = pow(sin(vUv.y * 3.14159265), 1.6);
        gl_FragColor = vec4(vec3(0.82, 0.92, 1.0) * ring * uOpacity, 1.0);
      }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.collar = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.14, 12, 56), this.collarMat);
    this.collar.renderOrder = 8;
    this.collar.visible = false;
    this.group.add(this.collar);

    this.hypersonicConeMat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0 },
        uMach: { value: 1 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform float uMach;
        uniform float uTime;
        varying vec3 vN;
        varying vec3 vV;
        varying vec2 vUv;
        void main() {
          float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          float rings = 0.82 + 0.18 * sin(vUv.y * 42.0 - uTime * 24.0);
          float lengthFade = smoothstep(1.0, 0.2, vUv.y) * smoothstep(0.0, 0.08, vUv.y);
          vec3 core = vec3(0.92, 0.98, 1.0);
          vec3 rim = vec3(0.25, 0.75, 1.0);
          vec3 col = mix(rim, core, fres);
          // A real shock cone is almost invisible: only a faint shimmer where it is seen edge-on
          float a = uOpacity * pow(fres, 3.0) * rings * lengthFade;
          gl_FragColor = vec4(col * a * 0.9, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const hConeGeo = new THREE.ConeGeometry(5.2, 22.0, 64, 1, true);
    hConeGeo.rotateX(-Math.PI / 2);
    this.hypersonicCone = new THREE.Mesh(hConeGeo, this.hypersonicConeMat);
    this.hypersonicCone.position.z = 2.5;
    this.hypersonicCone.renderOrder = 6;
    this.group.add(this.hypersonicCone);
    this.group.traverse((o) => (o.frustumCulled = false));
  }

  /** Transient cone + boom collar impulse when crossing Mach 1 (or lighting Stage-3 AB). */
  public triggerVapourCone(): void {
    this.conePulse = 1;
    this.collarLife = 1;
  }

  /** Trigger just the expanding sonic shock collar (e.g. AB light-off thump). */
  public triggerShockCollar(): void {
    this.collarLife = Math.max(this.collarLife, 0.75);
  }

  public update(dt: number, timeSec: number, heat: number, mach = 0, airDensity = 0, aoaDeg = 0): void {
    this.plasmaMat.uniforms.uHeat.value = heat;
    this.plasmaMat.uniforms.uTime.value = timeSec;
    this.conePulse = Math.max(0, this.conePulse - dt * 1.45);
    this.collarLife = Math.max(0, this.collarLife - dt * 2.8);

    // Sustained Prandtl-Glauert condensation window (Mach 0.965 .. 1.035) in moist air
    const airFactor = THREE.MathUtils.smoothstep(airDensity, 0.08, 0.45);
    const transonicRise = THREE.MathUtils.smoothstep(mach, 0.96, 0.995);
    const transonicFall = 1 - THREE.MathUtils.smoothstep(mach, 1.005, 1.04);
    const sustained = transonicRise * transonicFall * airFactor * (0.72 + 0.2 * THREE.MathUtils.clamp(Math.abs(aoaDeg) / 14, 0, 1));
    const pulse = Math.pow(this.conePulse, 1.45) * 0.65 * Math.min(1, airFactor * 1.4 + 0.1);
    const targetCone = Math.min(0.85, Math.max(sustained, pulse));
    this.coneOpacity += (targetCone - this.coneOpacity) * (1 - Math.exp(-10 * dt));

    const coneRadScale = THREE.MathUtils.clamp(1.10 - (mach - 0.96) * 2.2, 0.72, 1.12);
    this.cone.scale.set(coneRadScale, coneRadScale, 1 + (1 - Math.max(this.conePulse, sustained * 0.5)) * 0.08);
    // Seated cleanly behind the cockpit/canards over the delta wing & aft fuselage
    this.cone.position.z = 1.85 + THREE.MathUtils.clamp((mach - 0.97) * 5.0, -0.35, 1.25);
    this.coneMat.uniforms.uOpacity.value = this.coneOpacity;
    this.coneMat.uniforms.uTime.value = timeSec;
    this.coneMat.uniforms.uMach.value = mach;
    this.cone.visible = this.coneOpacity > 0.01;

    this.coneDisc.scale.setScalar(coneRadScale);
    this.coneDisc.position.z = this.cone.position.z + 1.75;
    this.coneDiscMat.uniforms.uOpacity.value = this.coneOpacity;
    this.coneDiscMat.uniforms.uTime.value = timeSec;
    this.coneDisc.visible = this.coneOpacity > 0.01;

    const cT = 1 - this.collarLife;
    this.collar.visible = this.collarLife > 0.01;
    if (this.collar.visible) {
      this.collar.position.z = 0.5 + cT * 9.5;
      this.collar.scale.setScalar(0.85 + cT * 1.35);
      this.collarMat.uniforms.uOpacity.value = Math.pow(this.collarLife, 1.6) * 0.28 * Math.max(0.2, airFactor);
    }

    if (mach > 1.15) {
      const radiusScale = THREE.MathUtils.clamp(1.5 / Math.sqrt(Math.max(0.01, mach * mach - 1)), 0.26, 2.2);
      this.hypersonicCone.scale.set(radiusScale, radiusScale, 1.0);
      const machFactor = THREE.MathUtils.smoothstep(mach, 1.15, 3.2);
      const densityFactor = Math.min(1, airDensity * 8 + 0.18);
      const targetOpacity = machFactor * densityFactor * 0.3;
      this.hypersonicOpacity += (targetOpacity - this.hypersonicOpacity) * (1 - Math.exp(-6.0 * dt));
      this.hypersonicConeMat.uniforms.uOpacity.value = this.hypersonicOpacity;
      this.hypersonicConeMat.uniforms.uMach.value = mach;
      this.hypersonicConeMat.uniforms.uTime.value = timeSec;
      this.hypersonicCone.visible = this.hypersonicOpacity > 0.01;
    } else {
      this.hypersonicOpacity = Math.max(0, this.hypersonicOpacity - dt * 4);
      this.hypersonicConeMat.uniforms.uOpacity.value = this.hypersonicOpacity;
      this.hypersonicCone.visible = this.hypersonicOpacity > 0.01;
    }
  }

  public dispose(): void {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.plasmaMat.dispose();
    this.coneMat.dispose();
    this.coneDiscMat.dispose();
    this.collarMat.dispose();
    this.hypersonicConeMat.dispose();
  }
}

/**
 * Exhaust smoke and vapour: soft particles left in the air behind the nozzles or wheels. They
 * stay where the air was (stored in world render units, moved with the world the jet rides,
 * see `shift`), swell and fade, so at speed they stream away behind the jet like a real trail.
 * A burst on afterburner light-off; nothing in vacuum, where exhaust has no air to hang in.
 */
const SMOKE_MAX = 900;

export class ExhaustSmoke {
  public readonly mesh: THREE.Points;
  private world = new Float64Array(SMOKE_MAX * 3);
  private age = new Float32Array(SMOKE_MAX).fill(1e9);
  private life = new Float32Array(SMOKE_MAX).fill(1);
  private size0 = new Float32Array(SMOKE_MAX);
  private grow = new Float32Array(SMOKE_MAX);
  private alpha0 = new Float32Array(SMOKE_MAX);
  private head = 0;
  private positions = new Float32Array(SMOKE_MAX * 3);
  private sizes = new Float32Array(SMOKE_MAX);
  private alphas = new Float32Array(SMOKE_MAX);
  private colors = new Float32Array(SMOKE_MAX * 3);
  private material: THREE.ShaderMaterial;
  private tmp = new THREE.Vector3();
  private tmpCol = new THREE.Color();
  private airshowMode: AirshowSmokeId = 'off';

  constructor() {
    this.colors.fill(1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uScale: { value: 500 },
        uColor: { value: new THREE.Color(0.82, 0.82, 0.84) },
        uTime: { value: 0 },
        uAirshowOn: { value: 0 },
        uEmberGlow: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aAlpha;
        attribute vec3 aColor;
        uniform float uScale;
        varying float vAlpha;
        varying float vSeed;
        varying vec3 vTint;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float camDist = max(0.1, -mv.z);
          gl_PointSize = clamp(aSize * uScale / camDist, 0.0, 220.0);
          // Fade out puffs close to the lens so exhaust smoke never blinds the chase camera
          vAlpha = aAlpha * smoothstep(1.8, 5.5, camDist);
          vTint = aColor;
          vSeed = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uAirshowOn;
        uniform float uEmberGlow;
        varying float vAlpha;
        varying float vSeed;
        varying vec3 vTint;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
        }
        void main() {
          vec2 p = gl_PointCoord * 2.0 - 1.0;
          float r = dot(p, p);
          if (r > 1.0) discard;
          // Billowed edge: soft disc broken up by noise
          float n = noise(p * 3.0 + vSeed * 17.0) * 0.6 + noise(p * 7.0 - vSeed * 9.0) * 0.4;
          float a = smoothstep(1.0, 0.15, r + (n - 0.5) * 0.55) * vAlpha;
          // Lit from above-ish: brighter top, shaded bottom
          vec3 col = uColor * vTint * (0.75 + 0.35 * (-p.y));
          if (uAirshowOn > 0.5) {
            col = mix(col, vTint * (0.85 + 0.30 * (-p.y)), 0.58);
          }
          if (uEmberGlow > 0.5) {
            float core = exp(-r * 3.8) * smoothstep(0.35, 0.92, n + 0.28);
            float spark = step(0.86, noise(p * 9.0 + vec2(vSeed * 31.0, uTime * 3.0))) * exp(-r * 2.2);
            col += vec3(1.0, 0.42, 0.08) * core * 1.45 + vec3(1.0, 0.85, 0.42) * spark * 2.6;
          }
          gl_FragColor = vec4(col, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.mesh = new THREE.Points(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
    this.mesh.userData.noAO = true;
  }

  public setAirshowSmoke(mode: AirshowSmokeId): void {
    this.airshowMode = mode;
    this.material.uniforms.uAirshowOn.value = mode === 'off' ? 0 : 1;
    this.material.uniforms.uEmberGlow.value = mode === 'ember' ? 1 : 0;
  }

  public getAirshowSmoke(): AirshowSmokeId {
    return this.airshowMode;
  }

  public clear(): void {
    this.age.fill(1e9);
  }

  /** Release one puff at a world position (render units), optionally tinted (e.g. touchdown tire smoke). */
  public emit(world: THREE.Vector3, sizeM: number, growMps: number, lifeS: number, alpha: number, tint?: THREE.ColorRepresentation): void {
    const i = this.head;
    this.head = (this.head + 1) % SMOKE_MAX;
    this.world[i * 3] = world.x;
    this.world[i * 3 + 1] = world.y;
    this.world[i * 3 + 2] = world.z;
    this.age[i] = 0;
    this.life[i] = lifeS;
    this.size0[i] = sizeM;
    this.grow[i] = growMps;
    this.alpha0[i] = alpha;
    if (tint !== undefined) {
      this.tmpCol.set(tint);
      this.colors[i * 3] = this.tmpCol.r;
      this.colors[i * 3 + 1] = this.tmpCol.g;
      this.colors[i * 3 + 2] = this.tmpCol.b;
    } else {
      this.colors[i * 3] = this.colors[i * 3 + 1] = this.colors[i * 3 + 2] = 1;
    }
  }

  /** Carry the puffs with the world the jet rides (its orbit, and close in its spin). */
  public shift(delta: THREE.Vector3, rot: THREE.Quaternion | null, centre: THREE.Vector3): void {
    for (let i = 0; i < SMOKE_MAX; i++) {
      if (this.age[i] >= this.life[i]) continue;
      const o = i * 3;
      if (rot) {
        this.tmp.set(this.world[o] - centre.x, this.world[o + 1] - centre.y, this.world[o + 2] - centre.z).applyQuaternion(rot);
        this.world[o] = centre.x + this.tmp.x;
        this.world[o + 1] = centre.y + this.tmp.y;
        this.world[o + 2] = centre.z + this.tmp.z;
      } else {
        this.world[o] += delta.x;
        this.world[o + 1] += delta.y;
        this.world[o + 2] += delta.z;
      }
    }
  }

  /**
   * @param camWorld camera position, render units
   * @param metresPerUnit conversion to the overlay's metres
   * @param pxScale viewport height / (2 tan(fov/2)), for point sizes
   * @param light 0 (shadow / night) .. 1 (sunlit)
   */
  public update(dt: number, camWorld: THREE.Vector3, metresPerUnit: number, pxScale: number, light: number): void {
    this.material.uniforms.uScale.value = pxScale;
    this.material.uniforms.uTime.value += dt;
    const airshowLight = this.airshowMode === 'off' ? light : Math.max(light, 0.55);
    this.material.uniforms.uColor.value.setRGB(0.12 + 0.72 * airshowLight, 0.12 + 0.72 * airshowLight, 0.14 + 0.72 * airshowLight);
    for (let i = 0; i < SMOKE_MAX; i++) {
      const o = i * 3;
      const a = this.age[i];
      if (a >= this.life[i]) {
        this.alphas[i] = 0;
        this.sizes[i] = 0;
        continue;
      }
      this.age[i] = a + dt;
      const t = a / this.life[i];
      this.positions[o] = (this.world[o] - camWorld.x) * metresPerUnit;
      this.positions[o + 1] = (this.world[o + 1] - camWorld.y) * metresPerUnit;
      this.positions[o + 2] = (this.world[o + 2] - camWorld.z) * metresPerUnit;
      this.sizes[i] = this.size0[i] + this.grow[i] * a;
      this.alphas[i] = this.alpha0[i] * Math.min(1, t * 12) * (1 - t) * (1 - t);
    }
    const geo = this.mesh.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
    geo.attributes.aColor.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
