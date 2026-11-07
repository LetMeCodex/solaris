import * as THREE from 'three';
import { KM_PER_UNIT, UNITS_PER_AU } from '../rendering/Scale';
import { rockGeometry } from './Asteroids';

/**
 * Comets as real objects in the Solar System, to fly to and through (jet mode).
 *
 * Each is built at true scale around its nucleus:
 *  - Nucleus: a few km of dark, rugged ice and rock (a fractured rock mesh, near-black like 67P).
 *  - Coma: the gas and dust cloud boiled off it, ~50,000 km across, cyan-green from C2 gas,
 *    brightest towards the nucleus.
 *  - Jets: sunward fans of gas from the day side.
 *  - Ion tail: straight, blue, streaky, pointing directly away from the Sun, millions of km long.
 *  - Dust tail: broader, yellow-white, curving back along the orbit.
 * The tails are planes turned round their own axis to face the eye (a long tube of light seen
 * from anywhere), with soft streaks drawn in their shader.
 *
 * These are illustrative comets (named here), placed where bright comets are found: inside 2 AU.
 */

export interface CometSpec {
  name: string;
  /** Distance from the Sun (AU), ecliptic longitude and latitude (deg). */
  rAu: number;
  lonDeg: number;
  latDeg: number;
  /** Nucleus radius, km. */
  nucleusKm: number;
}

export const COMETS: CometSpec[] = [
  { name: 'Comet C/2026 S1', rAu: 1.15, lonDeg: 40, latDeg: 6, nucleusKm: 5 },
  { name: 'Comet C/2026 T2', rAu: 1.7, lonDeg: 215, latDeg: -9, nucleusKm: 3 },
];

const tailMaterial = (color: THREE.Color, streaky: number, curve: number): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uTime: { value: 0 }, uOpacity: { value: 1 }, uStreak: { value: streaky }, uCurve: { value: curve } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uCurve;
      void main() {
        vUv = uv;
        vec3 p = position;
        // The dust tail bends back along the orbit, more the farther from the head
        p.y += uCurve * uv.x * uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime, uOpacity, uStreak;
      varying vec2 vUv;
      float h(float n) { return fract(sin(n * 91.3) * 43758.5); }
      float n1(float x) { float i = floor(x); float f = fract(x); return mix(h(i), h(i + 1.0), f * f * (3.0 - 2.0 * f)); }
      void main() {
        float u = vUv.x;           // 0 at the head, 1 at the tail's end
        float v = vUv.y * 2.0 - 1.0;
        // Wider with distance from the head
        // A fan: narrow at the head, opening along the length; brightest near the head, fading out
        float width = 0.04 + 0.96 * pow(u, 0.75);
        float across = exp(-pow(v / width, 2.0) * 2.5) * (0.35 + 0.65 * (1.0 - abs(v / width)));
        float along = pow(1.0 - u, 2.2) * smoothstep(0.0, 0.02, u) / (0.25 + width);
        // Streaks: rays of ions (or dust lanes) running the length, drifting slowly
        float s = 0.0;
        for (int k = 0; k < 3; k++) {
          float fk = float(k);
          s += n1((v / width) * (9.0 + fk * 7.0) + uTime * 0.05 * (fk + 1.0) - u * (2.0 + fk));
        }
        float streak = mix(1.0, 0.45 + 0.9 * (s / 3.0), uStreak);
        float a = across * along * streak * uOpacity;
        gl_FragColor = vec4(uColor * a, 1.0);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

function glowTexture(inner: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.15, outer);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export class Comet3D {
  public readonly group = new THREE.Group();
  public readonly spec: CometSpec;
  /** Coma radius, render units (what the jet's targeting treats as the comet's size). */
  public readonly radius: number;
  private nucleus: THREE.Mesh;
  private coma: THREE.Sprite;
  private core: THREE.Sprite;
  private jets: THREE.Sprite[] = [];
  private ion: THREE.Mesh;
  private dust: THREE.Mesh;
  private disposables: Array<{ dispose(): void }> = [];
  private t = 0;

  constructor(spec: CometSpec) {
    this.spec = spec;
    this.group.name = `comet_${spec.name}`;
    const lon = (spec.lonDeg * Math.PI) / 180;
    const lat = (spec.latDeg * Math.PI) / 180;
    const r = spec.rAu * UNITS_PER_AU;
    // Ecliptic (x, z) plane, y up (the scene's frame)
    this.group.position.set(Math.cos(lat) * Math.cos(lon) * r, Math.sin(lat) * r, -Math.cos(lat) * Math.sin(lon) * r);

    const kmU = 1 / KM_PER_UNIT;
    const geo = rockGeometry(97 + Math.floor(spec.rAu * 10));
    const nmat = new THREE.MeshStandardMaterial({ color: 0x1c1a19, roughness: 1, metalness: 0 });
    this.nucleus = new THREE.Mesh(geo, nmat);
    this.nucleus.scale.set(spec.nucleusKm * kmU * 1.3, spec.nucleusKm * kmU * 0.8, spec.nucleusKm * kmU);
    this.group.add(this.nucleus);

    const comaTex = glowTexture('rgba(235,255,250,1)', 'rgba(120,230,200,0.35)');
    const coreTex = glowTexture('rgba(255,255,255,1)', 'rgba(255,250,235,0.4)');
    this.coma = new THREE.Sprite(new THREE.SpriteMaterial({ map: comaTex, color: 0xbff7ea, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 }));
    this.coma.scale.setScalar(60000 * kmU);
    this.core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 }));
    this.core.scale.setScalar(4000 * kmU);
    this.group.add(this.coma, this.core);
    this.radius = 30000 * kmU;

    for (let i = 0; i < 5; i++) {
      const j = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTex, color: 0xd8fff4, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
      j.scale.setScalar((60 + i * 40) * spec.nucleusKm * kmU);
      this.jets.push(j);
      this.group.add(j);
    }

    // Tails: unit planes along +x (0 at the head), turned each frame
    const plane = (): THREE.PlaneGeometry => new THREE.PlaneGeometry(1, 1, 64, 1).translate(0.5, 0, 0);
    const ionMat = tailMaterial(new THREE.Color(0.32, 0.58, 1.6), 1, 0);
    const dustMat = tailMaterial(new THREE.Color(0.55, 0.48, 0.36), 0.35, -0.3);
    this.ion = new THREE.Mesh(plane(), ionMat);
    this.dust = new THREE.Mesh(plane(), dustMat);
    for (const m of [this.ion, this.dust]) {
      m.frustumCulled = false;
      this.group.add(m);
    }
    this.ion.scale.set(2.6e7 * kmU, 6e5 * kmU, 1);
    this.dust.scale.set(1.4e7 * kmU, 3.2e6 * kmU, 1);
    this.group.traverse((o) => (o.frustumCulled = false));
    this.disposables.push(geo, nmat, comaTex, coreTex, ionMat, dustMat, this.ion.geometry, this.dust.geometry);
  }

  /** Per frame: tails away from the Sun and turned to the eye, the nucleus spinning, jets flickering. */
  public update(dt: number, camera: THREE.Camera): void {
    this.t += dt;
    const head = this.group.position;
    const anti = head.clone().normalize(); // the Sun is at the origin
    const toEye = camera.position.clone().sub(head).normalize();
    for (const [m, twist] of [[this.ion, 0], [this.dust, 0.25]] as const) {
      // The dust tail lags behind the orbit: turned a little off the anti-solar line
      const axis = anti.clone();
      if (twist) axis.applyAxisAngle(new THREE.Vector3(0, 1, 0), twist).normalize();
      let side = new THREE.Vector3().crossVectors(axis, toEye);
      if (side.lengthSq() < 1e-10) side = new THREE.Vector3(0, 1, 0).cross(axis);
      side.normalize();
      const normal = new THREE.Vector3().crossVectors(axis, side).normalize();
      m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(axis, side, normal));
      (m.material as THREE.ShaderMaterial).uniforms.uTime.value = this.t;
    }
    this.nucleus.rotation.y += dt * 0.05;
    this.nucleus.rotation.x += dt * 0.02;
    // Jets: sunward from the day side, flickering
    const sunward = anti.clone().negate();
    this.jets.forEach((j, i) => {
      const spread = new THREE.Vector3(Math.sin(i * 2.1 + this.t * 0.3), Math.cos(i * 1.7), Math.sin(i * 3.3)).multiplyScalar(0.35);
      j.position.copy(sunward).add(spread).normalize().multiplyScalar((i + 2) * 30 * this.spec.nucleusKm / KM_PER_UNIT);
      (j.material as THREE.SpriteMaterial).opacity = 0.2 + 0.15 * Math.sin(this.t * (1.3 + i * 0.4) + i);
    });
  }

  public dispose(): void {
    this.group.removeFromParent();
    for (const d of this.disposables) d.dispose();
    for (const s of [this.coma, this.core, ...this.jets]) (s.material as THREE.Material).dispose();
  }
}
