import * as THREE from 'three';
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

export function horizonFacts(orbitRs: number = HORIZON_ORBIT_RS): HorizonFacts {
  const GM = 6.6743e-11 * 4.297e6 * 1.98847e30;
  const rsM = (2 * GM) / (299792458 * 299792458);
  const r = orbitRs * rsM;
  const clockRate = Math.sqrt(1 - 1.5 / orbitRs);
  const tidal = (2 * GM) / (r * r * r) / 9.80665;
  // Shadow edge seen by a static observer at r: sin α = (b_c / r) √(1 − r_s/r)
  const sinA = (((3 * Math.sqrt(3)) / 2) / orbitRs) * Math.sqrt(1 - 1 / orbitRs);
  return { orbitRs, clockRate, tidalGPerMetre: tidal, shadowDeg: (2 * Math.asin(sinA) * 180) / Math.PI };
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
          if (th < uShadow) return vec3(0.0);
          float ring = exp(-pow((th - uShadow * 1.12) / (uShadow * 0.22), 2.0)) * 3.2
                     + exp(-pow((th - uShadow * 1.5) / (uShadow * 0.6), 2.0)) * 0.9;
          // Disk band hugging the horizon, brightest towards the hole
          float band = exp(-pow(r.y / 0.012, 2.0)) * exp(-pow(th / 0.9, 2.0)) * 2.4;
          vec3 gold = vec3(1.0, 0.62, 0.26);
          vec3 cream = vec3(1.0, 0.78, 0.5);
          return cream * ring + gold * band;
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
          float amp = 0.11 / (1.0 + dist * 0.05);
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
    this.yaw = this.targetYaw = 0;
    this.pitch = this.targetPitch = THREE.MathUtils.degToRad(4);
    camera.fov = 52;
    camera.updateProjectionMatrix();
    this.dom = dom;
    dom.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
  }

  public exit(): void {
    this.active = false;
    this.planet.visible = false;
    this.dom?.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    this.dom = null;
  }

  private onDown = (e: PointerEvent) => {
    this.drag = { x: e.clientX, y: e.clientY };
  };
  private onMove = (e: PointerEvent) => {
    if (!this.drag) return;
    this.targetYaw += (e.clientX - this.drag.x) * 0.0025;
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + (e.clientY - this.drag.y) * 0.0025, -0.25, 1.2);
    this.drag = { x: e.clientX, y: e.clientY };
  };
  private onUp = () => {
    this.drag = null;
  };

  /** Place the camera on the shore, looking towards the hole (with the user's head turn). */
  public update(camera: THREE.PerspectiveCamera, timeSec: number): void {
    if (!this.active) return;
    this.uniforms.uTime.value = timeSec;
    this.yaw += (this.targetYaw - this.yaw) * 0.1;
    this.pitch += (this.targetPitch - this.pitch) * 0.1;

    const g = this.bh.group;
    g.updateWorldMatrix(true, false);
    // Gentle swell: the eye rises and falls with the sea
    const eye = this.tmp.copy(this.eyeLocal);
    eye.y += Math.sin(timeSec * 0.6) * 0.015;
    this.uniforms.uCam.value.copy(eye);
    camera.position.copy(eye).applyMatrix4(g.matrixWorld);

    const fwd = this.baseForward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    fwd.applyAxisAngle(right, this.pitch);
    const target = eye.clone().add(fwd).applyMatrix4(g.matrixWorld);
    const up = new THREE.Vector3(0, 1, 0).transformDirection(g.matrixWorld);
    camera.up.copy(up);
    this.tmpM.lookAt(camera.position, target, up);
    camera.quaternion.setFromRotationMatrix(this.tmpM);
    camera.near = 0.01;
    camera.far = 400000;
    camera.updateProjectionMatrix();
  }

  public dispose(): void {
    this.exit();
    this.planet.geometry.dispose();
    (this.planet.material as THREE.Material).dispose();
  }
}
