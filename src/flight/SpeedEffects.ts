import * as THREE from 'three';
import { glowTexture } from './JetModel';

/**
 * Near-field effects in the jet's own metre-scale space (the overlay scene, camera at the origin).
 *
 * SpeedField: motes that streak past the canopy. In air they are moisture and haze, dense and
 * soft; in vacuum a sparse glitter of dust and ice. Their speed is the jet's real speed up to a
 * few km/s (beyond that the eye cannot follow single motes anyway) and they stretch with it.
 *
 * Trail: a fading ribbon from a point on the airframe (wingtip vapour in hard turns, contrails
 * in thin cold air). Points are kept in world render units (double precision) and rebuilt
 * relative to the camera every frame, so a trail stays exactly where the air was.
 */

const COUNT = 900;
const BOX = 420;

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
  public update(dt: number, velMps: THREE.Vector3, air: number, brightness: number): void {
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
    const stretch = 1 / 30 + Math.min(0.12, Math.log10(1 + speed / 300) * 0.05) + drive;
    const active = Math.round(COUNT * (0.25 + 0.75 * air));
    const base = (0.2 + 0.23 * air) * brightness * THREE.MathUtils.smoothstep(shown, 30, 400);
    const tint = air > 0.05 ? [0.82, 0.88, 1.0] : [0.75, 0.82, 1.0];
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
      const near = 1 - THREE.MathUtils.smoothstep(d, BOX * 0.25, BOX);
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
  private material: THREE.ShaderMaterial;

  constructor(private width: number, private lifetime: number, color: THREE.ColorRepresentation) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage));
    const idx: number[] = [];
    for (let i = 0; i < TRAIL_POINTS - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    g.setIndex(idx);
    this.material = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) } },
      vertexShader: `attribute float alpha; varying float vA; void main(){ vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uColor; varying float vA; void main(){ gl_FragColor = vec4(uColor * vA, vA); }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
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
   * @param camRight camera right vector (ribbon width direction)
   */
  public update(dt: number, emitWorld: THREE.Vector3, strength: number, camWorld: THREE.Vector3, metresPerUnit: number, camForward: THREE.Vector3): void {
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
      const t = this.age[j] / this.lifetime;
      const w = this.width * (1 + t * 5) * 0.5;
      wx = (wx / wl) * w; wy = (wy / wl) * w; wz = (wz / wl) * w;
      this.positions[o] = x - wx;
      this.positions[o + 1] = y - wy;
      this.positions[o + 2] = z - wz;
      this.positions[o + 3] = x + wx;
      this.positions[o + 4] = y + wy;
      this.positions[o + 5] = z + wz;
      const a = Math.max(0, 1 - t) * this.strength[j] * 0.55 * Math.min(1, i / 2);
      this.alphas[i * 2] = this.alphas[i * 2 + 1] = a;
      px = x; py = y; pz = z;
    }
    this.mesh.geometry.attributes.position.needsUpdate = true;
    this.mesh.geometry.attributes.alpha.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/**
 * Plasma: the glow of compressed air on the nose and leading edges during a fast entry, and a
 * vapour cone flashing round the airframe on the way through Mach 1.
 */
export class ShockEffects {
  public readonly group = new THREE.Group();
  private plasmaMat: THREE.ShaderMaterial;
  private coneMat: THREE.MeshBasicMaterial;
  private cone: THREE.Mesh;
  private coneLife = 0;
  private glow: THREE.Texture;

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

    this.glow = glowTexture();
    this.coneMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, alphaMap: this.glow });
    const coneGeo = new THREE.ConeGeometry(4.2, 4.5, 48, 1, true);
    coneGeo.rotateX(-Math.PI / 2); // apex forward
    this.cone = new THREE.Mesh(coneGeo, this.coneMat);
    this.cone.position.z = 0.5;
    this.cone.renderOrder = 7;
    this.group.add(this.cone);
    this.group.traverse((o) => (o.frustumCulled = false));
  }

  public triggerVapourCone(): void {
    this.coneLife = 1;
  }

  public update(dt: number, timeSec: number, heat: number): void {
    this.plasmaMat.uniforms.uHeat.value = heat;
    this.plasmaMat.uniforms.uTime.value = timeSec;
    this.coneLife = Math.max(0, this.coneLife - dt * 1.8);
    this.coneMat.opacity = 0.42 * Math.pow(this.coneLife, 1.5);
    this.cone.scale.setScalar(1 + (1 - this.coneLife) * 0.25);
    this.cone.visible = this.coneLife > 0;
  }

  public dispose(): void {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.plasmaMat.dispose();
    this.coneMat.dispose();
    this.glow.dispose();
  }
}

/**
 * Exhaust smoke and vapour: soft particles left in the air behind the nozzles. They stay where
 * the air was (stored in world render units, moved with the world the jet rides, see `shift`),
 * swell and fade, so at speed they stream away behind the jet like a real trail. A burst on
 * afterburner light-off; nothing in vacuum, where exhaust has no air to hang in.
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
  private material: THREE.ShaderMaterial;
  private tmp = new THREE.Vector3();

  constructor() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1).setUsage(THREE.DynamicDrawUsage));
    this.material = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 500 }, uColor: { value: new THREE.Color(0.82, 0.82, 0.84) }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aAlpha;
        uniform float uScale;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * uScale / max(0.1, -mv.z), 0.0, 512.0);
          vAlpha = aAlpha;
          vSeed = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        varying float vSeed;
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
          vec3 col = uColor * (0.75 + 0.35 * (-p.y));
          gl_FragColor = vec4(col, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.mesh = new THREE.Points(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
  }

  public clear(): void {
    this.age.fill(1e9);
  }

  /** Release one puff at a world position (render units). */
  public emit(world: THREE.Vector3, sizeM: number, growMps: number, lifeS: number, alpha: number): void {
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
    this.material.uniforms.uColor.value.setRGB(0.12 + 0.72 * light, 0.12 + 0.72 * light, 0.14 + 0.72 * light);
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
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
