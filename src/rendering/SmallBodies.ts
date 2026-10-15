import * as THREE from 'three';
import { UNITS_PER_AU } from './Scale';

/**
 * The Solar System's small bodies at their real positions: ~35,000 main-belt asteroids, the Hildas,
 * 7,500 Jupiter Trojans, the potentially hazardous near-Earth asteroids, Centaurs, every known
 * trans-Neptunian object and 600 comets, from the JPL Small-Body Database
 * (public/data/small-bodies.json, built by scripts/build_small_bodies.py). Meteoroid streams are
 * strewn along the real orbits of their parent comets.
 *
 * Positions are computed on the GPU: each vertex carries its osculating elements and the vertex
 * shader solves Kepler's equation for the current date, so 75,000 orbits cost almost nothing.
 * Everything is true scale; a 10 km asteroid is far below a pixel, so each is drawn as a point of
 * light whose brightness follows its absolute magnitude.
 */

const JD_J2000 = 2451545.0;
const GAUSS_DEG_PER_DAY = 0.9856076686; // n = k / a^1.5 for a in AU (heliocentric, massless body)

type Row = number[];
interface SmallBodyFile {
  populations: Record<string, Row[]>;
  comets: Array<Array<number | string>>;
}

interface PopulationStyle {
  color: [number, number, number];
  /** Brightness of a body of absolute magnitude h0. */
  gain: number;
  h0: number;
  minPx: number;
  maxPx: number;
}

const STYLES: Record<string, PopulationStyle> = {
  main: { color: [0.82, 0.76, 0.68], gain: 0.55, h0: 12, minPx: 1.3, maxPx: 3.2 },
  hilda: { color: [0.86, 0.68, 0.52], gain: 0.6, h0: 12, minPx: 1.4, maxPx: 3 },
  trojan: { color: [0.86, 0.6, 0.46], gain: 0.62, h0: 12, minPx: 1.4, maxPx: 3 },
  neo: { color: [1.0, 0.62, 0.48], gain: 0.75, h0: 18, minPx: 1.5, maxPx: 3 },
  centaur: { color: [0.78, 0.82, 0.88], gain: 0.7, h0: 10, minPx: 1.5, maxPx: 3 },
  tno: { color: [0.66, 0.76, 0.95], gain: 0.75, h0: 7, minPx: 1.5, maxPx: 3.5 },
  comet: { color: [0.6, 0.92, 1.0], gain: 0.9, h0: 12, minPx: 1.8, maxPx: 3.5 },
  stream: { color: [0.95, 0.78, 0.55], gain: 0.16, h0: 12, minPx: 1.0, maxPx: 1.6 },
};

/** Annual meteor showers and the comets (or rock comet) that shed them. */
const STREAMS: Array<{ shower: string; parent: string; elements?: number[] }> = [
  { shower: 'Perseids', parent: '109P/' },
  { shower: 'Leonids', parent: '55P/' },
  { shower: 'Orionids / Eta Aquariids', parent: '1P/' },
  { shower: 'Taurids', parent: '2P/' },
  { shower: 'Ursids', parent: '8P/' },
  { shower: 'Draconids', parent: '21P/' },
  // 3200 Phaethon, the "rock comet" behind the Geminids (JPL SBDB)
  { shower: 'Geminids', parent: 'Phaethon', elements: [1.2712, 0.88985, 22.257, 265.21, 322.19, 0, 2460600.5] },
  // 2003 EH1, parent of the Quadrantids (JPL SBDB)
  { shower: 'Quadrantids', parent: '2003 EH1', elements: [3.1224, 0.6185, 70.79, 282.97, 171.37, 0, 2460600.5] },
];

const vertexShader = /* glsl */ `
  attribute vec3 aOrbitA;   // a (AU), e, i (rad)
  attribute vec3 aOrbitB;   // node, peri, M at epoch (rad)
  attribute vec3 aOrbitC;   // epoch (days from J2000), n (rad/day), brightness
  uniform float uDays;
  uniform float uUnitsPerAU;
  uniform float uPixelScale;
  uniform vec2 uPx;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float a = aOrbitA.x, e = aOrbitA.y, inc = aOrbitA.z;
    float node = aOrbitB.x, peri = aOrbitB.y;
    float M = mod(aOrbitB.z + aOrbitC.y * (uDays - aOrbitC.x), 6.2831853);
    // Kepler's equation, Newton iterations (start at pi for the eccentric comets)
    float E = e < 0.8 ? M : 3.14159265;
    for (int k = 0; k < 12; k++) {
      E -= (E - e * sin(E) - M) / (1.0 - e * cos(E));
    }
    float xv = a * (cos(E) - e);
    float yv = a * sqrt(max(0.0, 1.0 - e * e)) * sin(E);
    // Orbital plane → ecliptic (rotate by peri, inclination, node)
    float cw = cos(peri), sw = sin(peri), cO = cos(node), sO = sin(node), ci = cos(inc), si = sin(inc);
    float xp = xv * cw - yv * sw;
    float yp = xv * sw + yv * cw;
    vec3 ecl = vec3(xp * cO - yp * ci * sO, xp * sO + yp * ci * cO, yp * si);
    // Ecliptic → render frame (+Y = ecliptic north), AU → units
    vec3 p = vec3(ecl.x, ecl.z, -ecl.y) * uUnitsPerAU;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = max(1e-3, -mv.z);
    // Points of light: brighter (absolute magnitude) bodies glow more. Seen from far away a belt
    // packs thousands of bodies into each few pixels, so the light per body falls with distance
    // (≈ constant surface brightness) instead of piling up into a glare
    float fade = clamp(pow(3.0 / max(0.05, dist / uUnitsPerAU), 1.1), 0.05, 1.0);
    vAlpha = aOrbitC.z * fade * uOpacity;
    gl_PointSize = clamp(uPx.x + aOrbitC.z * 1.2, uPx.x, uPx.y);
    gl_Position = projectionMatrix * mv;
    if (vAlpha < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = exp(-d * 14.0) * vAlpha;
    gl_FragColor = vec4(uColor * a, 1.0);
  }
`;

export class SmallBodies {
  public mesh: THREE.Group = new THREE.Group();
  private layers: THREE.Points[] = [];
  private days = { value: 0 };
  private pixelScale = { value: 1000 };
  private opacity = { value: 1 };
  private visible = true;
  public loaded = false;
  /** Comet nuclei for the tails, heliocentric elements; filled when the data arrive. */
  private comets: Array<{ name: string; q: number; e: number; i: number; node: number; peri: number; tp: number }> = [];
  private tails: CometTails | null = null;
  public counts: Record<string, number> = {};

  constructor() {
    this.mesh.name = 'small_bodies';
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const base = (import.meta.env?.BASE_URL || '/').replace(/\/?$/, '/');
      const res = await fetch(`${base}data/small-bodies.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SmallBodyFile;
      this.build(data);
      this.loaded = true;
    } catch (err) {
      console.warn('Small-body catalogue unavailable:', err);
    }
  }

  private build(data: SmallBodyFile): void {
    for (const [name, rows] of Object.entries(data.populations)) {
      const style = STYLES[name] ?? STYLES.main;
      this.addLayer(name, rows.map((r) => this.elements(r, style)), style);
      this.counts[name] = rows.length;
    }
    const cometRows: number[][] = [];
    for (const c of data.comets) {
      const [q, e, i, node, peri, tp, epoch, , , name] = c as [number, number, number, number, number, number, number, number, number, string];
      const a = q / (1 - e);
      const n = GAUSS_DEG_PER_DAY / Math.pow(a, 1.5);
      // Mean anomaly at the elements' epoch from the time of perihelion
      const M = (((epoch - tp) * n) % 360 + 360) % 360;
      cometRows.push(this.elements([a, e, i, node, peri, M, epoch, 12, -1], STYLES.comet));
      this.comets.push({ name, q, e, i, node, peri, tp });
    }
    this.addLayer('comet', cometRows, STYLES.comet);
    this.counts.comet = cometRows.length;
    this.addStreams(data);
    this.tails = new CometTails(this.comets);
    this.mesh.add(this.tails.mesh);
  }

  /** [a, e, i, node, peri, M, epochJD, H, D] → packed shader attributes. */
  private elements(r: Row, style: PopulationStyle): number[] {
    const [a, e, i, node, peri, M, epoch, H] = r;
    const rad = Math.PI / 180;
    const n = (GAUSS_DEG_PER_DAY / Math.pow(a, 1.5)) * rad;
    // Absolute magnitude → relative brightness (Pogson), relative to the population's typical body
    const b = Math.min(1.6, style.gain * Math.pow(10, -0.2 * ((H ?? style.h0) - style.h0)));
    return [a, e, i * rad, node * rad, peri * rad, M * rad, epoch - JD_J2000, n, b];
  }

  private addStreams(data: SmallBodyFile): void {
    const rows: number[][] = [];
    let seed = 1234567;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
    for (const s of STREAMS) {
      let el: number[] | null = s.elements ?? null;
      if (!el) {
        const c = data.comets.find((x) => String(x[9]).trim().startsWith(s.parent));
        if (!c) continue;
        const [q, e, i, node, peri, tp, epoch] = c as number[];
        const a = q / (1 - e);
        const n = GAUSS_DEG_PER_DAY / Math.pow(a, 1.5);
        el = [a, e, i, node, peri, (((epoch - tp) * n) % 360 + 360) % 360, epoch];
      }
      const [a, e, i, node, peri, M0, epoch] = el;
      for (let k = 0; k < 2600; k++) {
        // Old streams are spread all round the orbit; younger dust still bunches near the parent
        const M = rnd() < 0.35 ? M0 + gauss() * 25 : rnd() * 360;
        rows.push(this.elements([
          a * (1 + gauss() * 0.02),
          Math.min(0.995, Math.max(0, e + gauss() * 0.006)),
          i + gauss() * 0.6,
          node + gauss() * 1.2,
          peri + gauss() * 0.8,
          M,
          epoch,
          12 + rnd() * 3,
        ], STYLES.stream));
      }
    }
    this.addLayer('stream', rows, STYLES.stream);
    this.counts.stream = rows.length;
  }

  private addLayer(name: string, rows: number[][], style: PopulationStyle): void {
    const n = rows.length;
    if (n === 0) return;
    const A = new Float32Array(n * 3);
    const B = new Float32Array(n * 3);
    const C = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      const r = rows[k];
      A.set([r[0], r[1], r[2]], k * 3);
      B.set([r[3], r[4], r[5]], k * 3);
      C.set([r[6], r[7], r[8]], k * 3);
    }
    const geo = new THREE.BufferGeometry();
    // Positions come from the shader; the attribute only sets the vertex count
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute('aOrbitA', new THREE.BufferAttribute(A, 3));
    geo.setAttribute('aOrbitB', new THREE.BufferAttribute(B, 3));
    geo.setAttribute('aOrbitC', new THREE.BufferAttribute(C, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uDays: this.days,
        uUnitsPerAU: { value: UNITS_PER_AU },
        uPixelScale: this.pixelScale,
        uPx: { value: new THREE.Vector2(style.minPx, style.maxPx) },
        uOpacity: this.opacity,
        uColor: { value: new THREE.Color(...style.color) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.name = `small_bodies_${name}`;
    pts.frustumCulled = false;
    pts.renderOrder = 1;
    this.layers.push(pts);
    this.mesh.add(pts);
  }

  /** Days since J2000 (TDB). */
  public updatePositions(daysSinceJ2000: number): void {
    this.days.value = daysSinceJ2000;
    this.tails?.update(daysSinceJ2000);
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(v: boolean): void {
    this.visible = v;
    this.mesh.visible = v;
  }

  public dispose(): void {
    for (const l of this.layers) {
      l.geometry.dispose();
      (l.material as THREE.Material).dispose();
    }
    this.tails?.dispose();
  }
}

/**
 * Comet tails. Within ~4 AU of the Sun a comet's ices sublimate: a coma forms and a tail streams
 * straight away from the Sun (ion tail) with a broader, curved dust tail behind it. Positions are
 * propagated on the CPU for the ~600 comets (twice a second); only active ones get a tail.
 */
class CometTails {
  public mesh: THREE.InstancedMesh;
  private comets: Array<{ name: string; q: number; e: number; i: number; node: number; peri: number; tp: number }>;
  private lastDays = -1e9;
  private tmpM = new THREE.Matrix4();
  private tmpQ = new THREE.Quaternion();
  private tmpS = new THREE.Vector3();
  private tmpP = new THREE.Vector3();
  private static readonly MAX = 64;

  constructor(comets: Array<{ name: string; q: number; e: number; i: number; node: number; peri: number; tp: number }>) {
    this.comets = comets;
    // A unit tail along +Y from the nucleus, widening away from the Sun
    const geo = new THREE.PlaneGeometry(1, 1, 1, 8);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          // Billboard about the tail axis: widen the quad towards the camera-facing side
          vec4 mvBase = modelViewMatrix * instanceMatrix * vec4(0.0, position.y, 0.0, 1.0);
          vec4 mvTip = modelViewMatrix * instanceMatrix * vec4(0.0, position.y + 0.01, 0.0, 1.0);
          vec3 axis = normalize(mvTip.xyz - mvBase.xyz);
          vec3 side = normalize(cross(axis, normalize(-mvBase.xyz)));
          float width = length((instanceMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
          float spread = mix(0.12, 1.0, position.y);
          gl_Position = projectionMatrix * vec4(mvBase.xyz + side * position.x * width * spread, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          float along = vUv.y;
          float across = 1.0 - abs(vUv.x - 0.5) * 2.0;
          float a = pow(across, 1.6) * pow(1.0 - along, 1.8) * 0.55;
          vec3 ion = vec3(0.45, 0.75, 1.0);
          vec3 dust = vec3(1.0, 0.92, 0.78);
          gl_FragColor = vec4(mix(dust, ion, along) * a, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, CometTails.MAX);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'comet_tails';
  }

  /** Heliocentric ecliptic position (AU) of a comet at `days` from J2000. */
  private position(c: { q: number; e: number; i: number; node: number; peri: number; tp: number }, days: number, out: THREE.Vector3): THREE.Vector3 {
    const rad = Math.PI / 180;
    const a = c.q / (1 - c.e);
    const n = (GAUSS_DEG_PER_DAY / Math.pow(a, 1.5)) * rad;
    const M = ((n * (days + JD_J2000 - c.tp)) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    let E = c.e < 0.8 ? M : Math.PI;
    for (let k = 0; k < 20; k++) E -= (E - c.e * Math.sin(E) - M) / (1 - c.e * Math.cos(E));
    const xv = a * (Math.cos(E) - c.e);
    const yv = a * Math.sqrt(1 - c.e * c.e) * Math.sin(E);
    const cw = Math.cos(c.peri * rad), sw = Math.sin(c.peri * rad);
    const cO = Math.cos(c.node * rad), sO = Math.sin(c.node * rad);
    const ci = Math.cos(c.i * rad), si = Math.sin(c.i * rad);
    const xp = xv * cw - yv * sw;
    const yp = xv * sw + yv * cw;
    return out.set(xp * cO - yp * ci * sO, yp * si, -(xp * sO + yp * ci * cO));
  }

  public update(days: number): void {
    if (Math.abs(days - this.lastDays) < 0.25 && this.mesh.count > 0) return;
    this.lastDays = days;
    let k = 0;
    const up = new THREE.Vector3(0, 1, 0);
    for (const c of this.comets) {
      if (k >= CometTails.MAX) break;
      if (c.q > 4.5) continue;
      const p = this.position(c, days, this.tmpP);
      const r = p.length();
      if (r > 4.0) continue;
      // Activity rises steeply towards the Sun; tails of bright comets reach tens of millions of km
      const activity = Math.min(1, Math.pow(1.6 / Math.max(0.3, r), 2));
      const length = (0.02 + 0.25 * activity) * UNITS_PER_AU;
      const width = length * 0.06;
      const away = p.clone().normalize();
      this.tmpQ.setFromUnitVectors(up, away);
      this.tmpS.set(width, length, width);
      this.tmpM.compose(p.multiplyScalar(UNITS_PER_AU), this.tmpQ, this.tmpS);
      this.mesh.setMatrixAt(k++, this.tmpM);
    }
    this.mesh.count = k;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
