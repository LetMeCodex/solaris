import * as THREE from 'three';
import { COSMIC_SCALE } from './Scale';
import type { SagittariusAStar } from './SagittariusAStar';

/**
 * Standing on a world near Sagittarius A*: a hypothetical ocean planet on a stable circular orbit
 * at r = 20 r_s, just outside the accretion disk (18 r_s), with its sea in the disk plane.
 *
 * Why 20 r_s: Sgr A* (4.3 × 10⁶ M☉) is small enough that its tides tear an Earth-size planet apart
 * well before the ISCO. The tidal acceleration across a planet of radius R is Δa ≈ 2GM·R/r³:
 * at 6.5 r_s that is ~13 m/s² (more than Earth's surface gravity), at 20 r_s ~0.45 m/s².
 *
 * The black hole itself is the same ray-traced object seen from here; the sea reflects it through
 * a cheap analytic model of what hangs over the horizon (the lensed halo and the disk band),
 * with Schlick Fresnel and wind-ripple normals for the glitter path.
 */
export const HORIZON_ORBIT_RS = 20.0;

export interface HorizonFacts {
  orbitRs: number;
  /** dτ/dt for a circular orbit, √(1 − 1.5 r_s / r). */
  clockRate: number;
  /** Tidal acceleration per metre of body height, in g. */
  tidalGPerMetre: number;
  /** Apparent angular diameter of the shadow, degrees. */
  shadowDeg: number;
}

/**
 * Physics at r (in r_s). Orbiting: a circular orbit, dτ/dt = √(1 − 1.5 r_s/r). Otherwise a static
 * observer hovering on rockets, dτ/dt = √(1 − r_s/r).
 */
export function horizonFacts(orbitRs: number = HORIZON_ORBIT_RS, orbiting: boolean = true): HorizonFacts {
  const GM = 6.6743e-11 * 4.297e6 * 1.98847e30;
  const rsM = (2 * GM) / (299792458 * 299792458);
  const r = orbitRs * rsM;
  const clockRate = orbiting && orbitRs > 1.5 ? Math.sqrt(1 - 1.5 / orbitRs) : Math.sqrt(Math.max(0, 1 - 1 / orbitRs));
  const tidal = (2 * GM) / (r * r * r) / 9.80665;
  // Shadow edge seen by a static observer at r: sin α = (b_c / r) √(1 − r_s/r); inside the photon
  // sphere the shadow covers more than half the sky
  const sinA = Math.min(1, (((3 * Math.sqrt(3)) / 2) / orbitRs) * Math.sqrt(1 - 1 / orbitRs));
  const alpha = orbitRs >= 1.5 ? Math.asin(sinA) : Math.PI - Math.asin(sinA);
  return { orbitRs, clockRate, tidalGPerMetre: tidal, shadowDeg: (2 * alpha * 180) / Math.PI };
}

const R_PLANET = 420.0;   // render units; only the curvature of the horizon depends on it
const EYE = 0.06;         // eye height above the sea

export class HorizonView {
  public active = false;
  private planet: THREE.Mesh;
  private uniforms: Record<string, THREE.IUniform>;
  private eyeLocal = new THREE.Vector3();
  private baseForward = new THREE.Vector3();
  private yaw = 0;
  private pitch = 0;
  private targetYaw = 0;
  private targetPitch = 0;
  private drag: { x: number; y: number } | null = null;
  private dom: HTMLElement | null = null;
  private tmp = new THREE.Vector3();
  private tmpM = new THREE.Matrix4();

  constructor(private readonly bh: SagittariusAStar) {
    const rs = bh.config.schwarzschildRadius;
    const D = HORIZON_ORBIT_RS * rs;
    // Observer azimuth: the approaching side of the disk on the left, as in the orbit shot
    const u = new THREE.Vector3(0.3, 0, 0.95).normalize();
    this.eyeLocal.copy(u).multiplyScalar(D).setY(EYE + 0.8);
    const planetCenter = this.eyeLocal.clone().setY(this.eyeLocal.y - R_PLANET - EYE);
    this.baseForward.copy(this.eyeLocal).negate().normalize();

    const facts = horizonFacts();
    this.uniforms = {
      uTime: { value: 0 },
      uCam: { value: new THREE.Vector3() },
      uCenter: { value: planetCenter },
      uShadow: { value: (facts.shadowDeg / 2) * (Math.PI / 180) },
      uOpacity: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        uniform vec3 uCenter;
        varying vec3 vPos;
        void main() {
          vPos = position + uCenter;   // black-hole-local coordinates
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uCam;
        uniform vec3 uCenter;
        uniform float uShadow;
        varying vec3 vPos;

        float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float n2(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
        }
        float waves(vec2 p) {
          float s = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++) { s += a * n2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + uTime * 0.12; a *= 0.5; }
          return s;
        }

        // What hangs over the horizon, as seen from the shore: lensed halo + disk band
        vec3 sky(vec3 r) {
          vec3 toHole = normalize(-uCam);
          float th = acos(clamp(dot(r, toHole), -1.0, 1.0));
          float inside = smoothstep(uShadow * 0.92, uShadow * 1.02, th);
          float ring = exp(-pow((th - uShadow * 1.12) / (uShadow * 0.22), 2.0)) * 3.2
                     + exp(-pow((th - uShadow * 1.5) / (uShadow * 0.6), 2.0)) * 0.9;
          // Disk band hugging the horizon, brightest towards the hole
          float band = exp(-pow(r.y / 0.012, 2.0)) * exp(-pow(th / 0.9, 2.0)) * 2.4;
          vec3 gold = vec3(1.0, 0.62, 0.26);
          vec3 cream = vec3(1.0, 0.78, 0.5);
          return (cream * ring + gold * band) * inside;
        }

        void main() {
          vec3 n = normalize(vPos - uCenter);
          vec3 v = normalize(vPos - uCam);
          float dist = length(vPos - uCam);
          // Wind ripples: stronger close by, averaged out towards the horizon
          vec2 q = vPos.xz * 2.2;
          float e = 0.05;
          float w0 = waves(q);
          vec3 grad = vec3(waves(q + vec2(e, 0.0)) - w0, 0.0, waves(q + vec2(0.0, e)) - w0) / e;
          float amp = 0.06 / (1.0 + dist * 0.05);
          n = normalize(n - grad * amp);

          vec3 rDir = reflect(v, n);
          rDir.y = abs(rDir.y);
          float cosT = max(0.0, dot(-v, n));
          float fresnel = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
          vec3 refl = sky(rDir) * fresnel * 0.75;

          // Dark water body lit faintly by the disk's glow
          vec3 toHole = normalize(-vPos);
          vec3 base = vec3(0.012, 0.009, 0.008) + vec3(0.09, 0.05, 0.02) * max(0.0, dot(n, toHole)) * 0.4;
          vec3 col = base + refl;
          // Warm haze towards the horizon
          float haze = 1.0 - exp(-dist * 0.012);
          col = mix(col, vec3(0.16, 0.09, 0.04), haze * 0.55);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    this.planet = new THREE.Mesh(new THREE.SphereGeometry(R_PLANET, 256, 160), mat);
    this.planet.position.copy(planetCenter);
    this.planet.visible = false;
    this.planet.name = 'sgr_a_horizon_world';
    this.planet.renderOrder = 10;
    bh.group.add(this.planet);
  }

  public enter(camera: THREE.PerspectiveCamera, dom: HTMLElement): void {
    this.active = true;
    this.planet.visible = true;
    this.returnToShore();
    camera.fov = 52;
    camera.updateProjectionMatrix();
    this.dom = dom;
    dom.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  public exit(): void {
    this.active = false;
    this.planet.visible = false;
    this.keys.clear();
    this.dom?.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.dom = null;
  }

  /** Back to the starting point on the shore, facing the hole. */
  public returnToShore(): void {
    this.pos.copy(this.eyeLocal);
    this.vel.set(0, 0, 0);
    this.yaw = this.targetYaw = 0;
    this.pitch = this.targetPitch = THREE.MathUtils.degToRad(4);
  }

  /** Where the observer is, in units of r_s, and whether they are still standing on the sea. */
  public getStatus(): { rRs: number; onShore: boolean; timelapse: boolean } {
    const rs = this.bh.config.schwarzschildRadius;
    return { rRs: this.pos.length() / rs, onShore: this.pos.distanceTo(this.eyeLocal) < 0.5, timelapse: this.idle > 0.5 };
  }

  /** Left alone, the view sweeps slowly across the hole and back, like a long-exposure film. */
  private lastInput = performance.now();
  private idle = 0;
  private idleT = 0;
  private idleBase = { yaw: 0, pitch: 0 };

  private keys = new Set<string>();
  private pos = new THREE.Vector3();
  private vel = new THREE.Vector3();
  private lastTime: number | null = null;

  private static readonly FLIGHT_KEYS = ['w', 'a', 's', 'd', 'q', 'e', 'shift', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    this.lastInput = performance.now();
    const k = e.key.toLowerCase();
    if (HorizonView.FLIGHT_KEYS.includes(k)) {
      this.keys.add(k);
      if (k.startsWith('arrow')) e.preventDefault();
    }
    if (k === 'r') this.returnToShore();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };
  private onBlur = () => this.keys.clear();

  private onDown = (e: PointerEvent) => {
    this.lastInput = performance.now();
    this.drag = { x: e.clientX, y: e.clientY };
  };
  private onMove = (e: PointerEvent) => {
    if (!this.drag) return;
    this.targetYaw -= (e.clientX - this.drag.x) * 0.0025;
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch - (e.clientY - this.drag.y) * 0.0025, -1.45, 1.45);
    this.drag = { x: e.clientX, y: e.clientY };
  };
  private onUp = () => {
    this.drag = null;
  };

  /** Fly the observer (black-hole-local frame) and aim the camera. */
  public update(camera: THREE.PerspectiveCamera, timeSec: number): void {
    if (!this.active) return;
    const dt = this.lastTime === null ? 0 : Math.min(0.25, Math.max(0, timeSec - this.lastTime)); // frame-rate independent
    this.lastTime = timeSec;
    this.uniforms.uTime.value = timeSec;
    const quiet = performance.now() - this.lastInput > 10000 && !this.drag && this.keys.size === 0;
    if (quiet && this.idle === 0) this.idleBase = { yaw: this.targetYaw, pitch: this.targetPitch };
    this.idle = THREE.MathUtils.clamp(this.idle + (quiet ? dt / 5 : -1), 0, 1);
    if (this.idle > 0) {
      const e = this.idle * this.idle * (3 - 2 * this.idle);
      this.idleT += dt;
      this.targetYaw = this.idleBase.yaw + e * 0.5 * Math.sin(this.idleT * 0.07);
      this.targetPitch = this.idleBase.pitch + e * 0.08 * Math.sin(this.idleT * 0.045 + 1.3);
    } else this.idleT = 0;
    this.yaw += (this.targetYaw - this.yaw) * 0.12;
    this.pitch += (this.targetPitch - this.pitch) * 0.12;

    const Y = new THREE.Vector3(0, 1, 0);
    const fwd = this.baseForward.clone().applyAxisAngle(Y, this.yaw);
    const right = new THREE.Vector3().crossVectors(fwd, Y).normalize();
    fwd.applyAxisAngle(right, this.pitch);

    // Thrust: speed proportional to the height above the horizon, so the last stretch is slow
    const rs = this.bh.config.schwarzschildRadius;
    const r = this.pos.length();
    const speed = Math.max(0.6, (r - rs) * 0.35) * (this.keys.has('shift') ? 4 : 1);
    const want = new THREE.Vector3();
    if (this.keys.has('w') || this.keys.has('arrowup')) want.add(fwd);
    if (this.keys.has('s') || this.keys.has('arrowdown')) want.sub(fwd);
    if (this.keys.has('d') || this.keys.has('arrowright')) want.add(right);
    if (this.keys.has('a') || this.keys.has('arrowleft')) want.sub(right);
    if (this.keys.has('e')) want.add(Y);
    if (this.keys.has('q')) want.sub(Y);
    if (want.lengthSq() > 0) want.normalize().multiplyScalar(speed);
    this.vel.lerp(want, 1 - Math.pow(0.02, dt)); // eased thrust and glide
    this.pos.addScaledVector(this.vel, dt);

    // Never below 1.1 r_s (past the horizon nothing comes back), never under the sea
    const rMin = 1.1 * rs;
    if (this.pos.length() < rMin) this.pos.setLength(rMin);
    const center = this.uniforms.uCenter.value as THREE.Vector3;
    const toC = this.tmp.subVectors(this.pos, center);
    if (toC.length() < R_PLANET + EYE) this.pos.copy(center).addScaledVector(toC.normalize(), R_PLANET + EYE);

    const g = this.bh.group;
    g.updateWorldMatrix(true, false);
    const eye = this.pos.clone();
    if (this.getStatus().onShore) eye.y += Math.sin(timeSec * 0.6) * 0.015; // the swell, while standing
    this.uniforms.uCam.value.copy(eye);
    camera.position.copy(eye).applyMatrix4(g.matrixWorld);

    const target = eye.clone().add(fwd).applyMatrix4(g.matrixWorld);
    const up = Y.clone().transformDirection(g.matrixWorld);
    camera.up.copy(up);
    this.tmpM.lookAt(camera.position, target, up);
    camera.quaternion.setFromRotationMatrix(this.tmpM);
    camera.near = Math.max(0.002, Math.min(0.05, (this.pos.length() - rs) * 0.01));
    camera.far = 30000 * COSMIC_SCALE; // past the star sphere and the Milky Way shells
    camera.updateProjectionMatrix();
  }

  public dispose(): void {
    this.exit();
    this.planet.geometry.dispose();
    (this.planet.material as THREE.Material).dispose();
  }
}
