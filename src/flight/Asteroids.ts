import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { KM_PER_UNIT, UNITS_PER_AU } from '../rendering/Scale';
import { perf } from '../rendering/Performance';

/**
 * Asteroid fields around the jet: real 3D rocks when it is inside a belt.
 *
 * Solaris draws the belts as points from afar (SmallBodies). Up close, this fills the space around
 * the jet with rocks laid out on a grid of cells in the Sun's frame: each cell holds a few rocks
 * placed by a hash of its coordinates, so the field is the same every time you pass. Sizes follow
 * a steep power law (many boulders, few kilometre-sized bodies), every rock tumbles slowly, and
 * the field is denser than the real belt (whose rocks are typically a million km apart): this is
 * the belt as a pilot would want to see it, in the right places.
 *
 *  - Main belt: 2.1–3.3 AU, within ±0.18 AU of the ecliptic, grey-brown rock.
 *  - Kuiper belt: 30–50 AU, within ±6 AU, ice-dusted and paler.
 *
 * Drawn in the jet's metre-scale overlay; fades out at speeds where single rocks only flicker past.
 */

const CELL_KM = 3;
const RANGE = 6; // cells each way: a field ±18 km around the jet
/** Rocks fade out by this distance (the inscribed sphere of the field), so its cube edges never show. */
const FIELD_KM = RANGE * CELL_KM;
const VARIANTS = 14;
/** Rocks per shape: fewer on low-end devices (src/rendering/Performance). */
const PER_VARIANT = perf.settings.rocksPerVariant;
const DEBRIS = 2400;
const HAZE = 18;

interface Belt {
  name: string;
  /** Mix of surface types: [colour, share]. */
  kinds: Array<[THREE.Color, number]>;
  rIn: number;
  rOut: number;
  half: number;
  colour: THREE.Color;
}

const BELTS: Belt[] = [
  // Main belt: mostly dark carbon-rich C-types, reddish stony S-types, a few metallic M-types
  {
    name: 'Main asteroid belt', rIn: 2.1 * UNITS_PER_AU, rOut: 3.3 * UNITS_PER_AU, half: 0.18 * UNITS_PER_AU, colour: new THREE.Color(0.2, 0.185, 0.17),
    kinds: [[new THREE.Color(0.3, 0.3, 0.31), 0.5], [new THREE.Color(0.42, 0.42, 0.43), 0.25], [new THREE.Color(0.45, 0.41, 0.37), 0.15], [new THREE.Color(0.56, 0.57, 0.6), 0.1]],
  },
  // Kuiper belt: ice-dusted bodies, and reddish ones stained by tholins
  {
    name: 'Kuiper belt', rIn: 30 * UNITS_PER_AU, rOut: 50 * UNITS_PER_AU, half: 6 * UNITS_PER_AU, colour: new THREE.Color(0.42, 0.44, 0.48),
    kinds: [[new THREE.Color(0.62, 0.66, 0.72), 0.55], [new THREE.Color(0.46, 0.3, 0.22), 0.45]],
  },
];

function hash(x: number, y: number, z: number, k: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177 + k * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth 3D value noise (for rock roughness). */
function noise3(x: number, y: number, z: number, seed: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const h = (a: number, b: number, c: number): number => hash(a, b, c, seed);
  const l = (a: number, b: number, t: number): number => a + (b - a) * t;
  return l(
    l(l(h(ix, iy, iz), h(ix + 1, iy, iz), u), l(h(ix, iy + 1, iz), h(ix + 1, iy + 1, iz), u), v),
    l(l(h(ix, iy, iz + 1), h(ix + 1, iy, iz + 1), u), l(h(ix, iy + 1, iz + 1), h(ix + 1, iy + 1, iz + 1), u), v),
    w
  );
}

/**
 * A fragment of rock, the way real asteroids look: a body broken along fracture planes (sharp
 * flat faces and chipped edges), elongated, with rough small-scale relief and a few craters.
 * Smooth-shaded (shared vertices), so the facets are the fractures, not the triangles.
 */
export function rockGeometry(seed: number): THREE.BufferGeometry {
  const base = new THREE.IcosahedronGeometry(1, 4);
  base.deleteAttribute('normal');
  base.deleteAttribute('uv');
  const g = mergeVertices(base);
  base.dispose();
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  // Fracture planes: everything beyond a plane is cut back onto it
  const cuts: Array<[THREE.Vector3, number]> = [];
  const nCuts = 5 + Math.floor(hash(seed, 7, 7, 7) * 9);
  for (let c = 0; c < nCuts; c++) {
    const n = new THREE.Vector3(hash(seed, c, 11, 1) - 0.5, hash(seed, c, 12, 1) - 0.5, hash(seed, c, 13, 1) - 0.5).normalize();
    cuts.push([n, 0.5 + hash(seed, c, 14, 1) * 0.42]);
  }
  const craters: Array<[THREE.Vector3, number]> = [];
  for (let c = 0; c < 4; c++) {
    const d = new THREE.Vector3(hash(seed, c, 21, 2) - 0.5, hash(seed, c, 22, 2) - 0.5, hash(seed, c, 23, 2) - 0.5).normalize();
    craters.push([d, 0.15 + hash(seed, c, 24, 2) * 0.25]);
  }
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const dir = v.clone().normalize();
    // Large lumps first
    let r = 1 + (noise3(dir.x * 1.6 + 3, dir.y * 1.6, dir.z * 1.6, seed) - 0.5) * 0.5;
    for (const [d, size] of craters) {
      const a = Math.acos(THREE.MathUtils.clamp(dir.dot(d), -1, 1));
      if (a < size) {
        const t = a / size;
        r -= 0.07 * (1 - t * t);
      }
    }
    v.copy(dir).multiplyScalar(r);
    for (const [n, d] of cuts) {
      const k = v.dot(n);
      if (k > d) v.addScaledVector(n, -(k - d) * 0.97);
    }
    // Fine roughness on top (broken rock is never smooth)
    let rough = 0;
    let amp = 0.05;
    let f = 6;
    for (let o = 0; o < 3; o++) {
      rough += (noise3(v.x * f, v.y * f, v.z * f, seed + o * 13) - 0.5) * amp;
      amp *= 0.5;
      f *= 2.3;
    }
    v.addScaledVector(dir, rough);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  // UVs from a spherical projection (for the regolith texture)
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    uv[i * 2] = 0.5 + Math.atan2(v.z, v.x) / (2 * Math.PI);
    uv[i * 2 + 1] = 0.5 + Math.asin(THREE.MathUtils.clamp(v.y, -1, 1)) / Math.PI;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

/** A rock's surface: regolith speckle, boulders and small craters (greyscale, tinted per rock). */
function rockTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  x.fillStyle = '#8a8a8a';
  x.fillRect(0, 0, 512, 512);
  let s = 11;
  const rnd = (): number => ((s = (s * 16807) % 2147483647) / 2147483647);
  // Mottled regolith
  for (let i = 0; i < 2600; i++) {
    const v = 90 + Math.floor(rnd() * 90);
    x.fillStyle = `rgba(${v},${v},${v},0.18)`;
    const r = 2 + rnd() * 22;
    x.beginPath();
    x.arc(rnd() * 512, rnd() * 512, r, 0, Math.PI * 2);
    x.fill();
  }
  // Small craters: a dark floor and a bright rim on the lit side
  for (let i = 0; i < 140; i++) {
    const cx = rnd() * 512;
    const cy = rnd() * 512;
    const r = 3 + Math.pow(rnd(), 2.5) * 34;
    const g = x.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.2, cx, cy, r);
    g.addColorStop(0, 'rgba(40,40,40,0.55)');
    g.addColorStop(0.75, 'rgba(70,70,70,0.25)');
    g.addColorStop(0.9, 'rgba(200,200,200,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, r, 0, Math.PI * 2);
    x.fill();
  }
  // Fine grit
  const img = x.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 34;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

export class AsteroidField {
  public readonly group = new THREE.Group();
  private meshes: THREE.InstancedMesh[] = [];
  private material: THREE.MeshStandardMaterial;
  private texture: THREE.CanvasTexture;
  private tint = new THREE.Color();
  private geometries: THREE.BufferGeometry[] = [];
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private s = new THREE.Vector3();
  private p = new THREE.Vector3();
  /** Rocks near the jet this frame (km, Sun frame) for collisions. */
  public near: Array<{ x: number; y: number; z: number; rKm: number }> = [];

  constructor() {
    // The surface texture carries regolith and craters; its relief comes through as bump, and each
    // rock gets its own tint (its spectral class)
    this.texture = rockTexture();
    this.material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: this.texture, bumpMap: this.texture, bumpScale: 9, roughness: 0.97, metalness: 0.03 });
    for (let k = 0; k < VARIANTS; k++) {
      const g = rockGeometry(k * 17 + 3);
      this.geometries.push(g);
      const mesh = new THREE.InstancedMesh(g, this.material, PER_VARIANT);
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      this.meshes.push(mesh);
      this.group.add(mesh);
    }
    // Fine debris: gravel and dust grains drifting between the boulders
    const dg = new THREE.BufferGeometry();
    this.debrisPos = new Float32Array(DEBRIS * 3);
    for (let i = 0; i < DEBRIS; i++) {
      this.debrisPos[i * 3] = (hash(i, 1, 1, 5) - 0.5) * 2;
      this.debrisPos[i * 3 + 1] = (hash(i, 2, 2, 5) - 0.5) * 2;
      this.debrisPos[i * 3 + 2] = (hash(i, 3, 3, 5) - 0.5) * 2;
    }
    dg.setAttribute('position', new THREE.BufferAttribute(this.debrisPos.slice(), 3).setUsage(THREE.DynamicDrawUsage));
    this.debris = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x8a8580, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.8, depthWrite: false }));
    this.debris.frustumCulled = false;
    this.group.add(this.debris);
    // Haze: dust lit by the Sun, a soft glow in the gaps that gives the field its depth
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d') as CanvasRenderingContext2D;
    const grad = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = grad;
    x.fillRect(0, 0, 128, 128);
    this.hazeTex = new THREE.CanvasTexture(c);
    for (let i = 0; i < HAZE; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.hazeTex, color: 0x9a948c, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending }));
      sp.frustumCulled = false;
      this.haze.push(sp);
      this.group.add(sp);
    }
    this.group.visible = false;
  }

  private debris!: THREE.Points;
  private debrisPos!: Float32Array;
  private haze: THREE.Sprite[] = [];
  private hazeTex!: THREE.CanvasTexture;

  /** Which belt (if any) a point is in, and how deep inside (0..1). */
  public beltAt(pos: THREE.Vector3): { k: number; name: string | null } {
    const { k, belt } = this.belt(pos);
    return { k, name: belt?.name ?? null };
  }

  /** How much a point (world render units, Sun frame) is inside a belt: 0..1, and which belt. */
  private belt(pos: THREE.Vector3): { k: number; belt: Belt | null } {
    const r = Math.hypot(pos.x, pos.z);
    for (const b of BELTS) {
      const edge = (b.rOut - b.rIn) * 0.08;
      const kr = THREE.MathUtils.smoothstep(r, b.rIn - edge, b.rIn + edge) * (1 - THREE.MathUtils.smoothstep(r, b.rOut - edge, b.rOut + edge));
      const ky = 1 - THREE.MathUtils.smoothstep(Math.abs(pos.y), b.half * 0.7, b.half);
      const k = kr * ky;
      if (k > 0.001) return { k, belt: b };
    }
    return { k: 0, belt: null };
  }

  /**
   * @param camWorld camera position, render units (Sun frame)
   * @param speedKmS the jet's speed: the field fades out where rocks would only flicker
   */
  public update(timeSec: number, camWorld: THREE.Vector3, speedKmS: number, nearWorld = false): void {
    const { k, belt } = nearWorld ? { k: 0, belt: null } : this.belt(camWorld);
    const show = k * (1 - THREE.MathUtils.smoothstep(speedKmS, 120, 900));
    this.near.length = 0;
    this.group.visible = show > 0.01 && !!belt;
    if (!this.group.visible || !belt) {
      for (const mesh of this.meshes) mesh.count = 0;
      return;
    }
    void belt.colour;
    const camKm = [camWorld.x * KM_PER_UNIT, camWorld.y * KM_PER_UNIT, camWorld.z * KM_PER_UNIT];
    const cx = Math.floor(camKm[0] / CELL_KM);
    const cy = Math.floor(camKm[1] / CELL_KM);
    const cz = Math.floor(camKm[2] / CELL_KM);
    const counts = new Array(VARIANTS).fill(0);
    const density = 0.35 + 0.65 * k;
    for (let ix = -RANGE; ix <= RANGE; ix++) {
      for (let iy = -RANGE; iy <= RANGE; iy++) {
        for (let iz = -RANGE; iz <= RANGE; iz++) {
          const X = cx + ix;
          const Y = cy + iy;
          const Z = cz + iz;
          const n = hash(X, Y, Z, 0) < 0.5 * density ? (hash(X, Y, Z, 1) < 0.25 ? 2 : 1) : 0;
          for (let j = 0; j < n; j++) {
            const v = Math.floor(hash(X, Y, Z, 10 + j) * VARIANTS);
            if (counts[v] >= PER_VARIANT) continue;
            // Size: steep power law, 120 m boulders to ~3 km bodies
            const u = hash(X, Y, Z, 20 + j);
            const rKm = Math.min(4, 0.18 * Math.pow(1 / (1 - u * 0.999), 0.6));
            const px = (X + hash(X, Y, Z, 30 + j)) * CELL_KM;
            const py = (Y + hash(X, Y, Z, 40 + j)) * CELL_KM;
            const pz = (Z + hash(X, Y, Z, 50 + j)) * CELL_KM;
            // Overlay metres around the camera
            this.p.set((px - camKm[0]) * 1000, (py - camKm[1]) * 1000, (pz - camKm[2]) * 1000);
            const spin = (hash(X, Y, Z, 60 + j) - 0.5) * 0.4;
            this.e.set(hash(X, Y, Z, 70 + j) * 6.28 + timeSec * spin, hash(X, Y, Z, 80 + j) * 6.28, timeSec * spin * 0.6);
            this.q.setFromEuler(this.e);
            // Each rock its own proportions: long shards, flat slabs, chunky blocks
            const ax = 0.6 + hash(X, Y, Z, 100 + j) * 0.8;
            const ay = 0.45 + hash(X, Y, Z, 110 + j) * 0.7;
            const az = 0.6 + hash(X, Y, Z, 120 + j) * 0.8;
            // Rocks grow in towards the edge of the field (no popping into view at its boundary),
            // and as the jet slows enough to see them
            const distKm = Math.hypot(px - camKm[0], py - camKm[1], pz - camKm[2]);
            const fade = THREE.MathUtils.smoothstep(distKm, FIELD_KM, FIELD_KM * 0.6) * THREE.MathUtils.smoothstep(show, 0, 0.6);
            if (fade < 0.01) continue;
            const sz = rKm * 1000 * fade;
            this.s.set(sz * ax, sz * ay, sz * az);
            this.m.compose(this.p, this.q, this.s);
            // Spectral class: picked by the belt's own mix, with a little variety in each
            let pick = hash(X, Y, Z, 90 + j);
            let kind = belt.kinds[0][0];
            for (const [c, share] of belt.kinds) {
              if (pick < share) {
                kind = c;
                break;
              }
              pick -= share;
            }
            const vary = 0.75 + hash(X, Y, Z, 95 + j) * 0.5;
            this.tint.copy(kind).multiplyScalar(vary);
            this.meshes[v].setColorAt(counts[v], this.tint);
            this.meshes[v].setMatrixAt(counts[v]++, this.m);
            // Only rocks that are really there can be hit (none while the field is still fading in)
            if (show > 0.5 && Math.abs(ix) <= 1 && Math.abs(iy) <= 1 && Math.abs(iz) <= 1) this.near.push({ x: px, y: py, z: pz, rKm });
          }
        }
      }
    }
    // Debris in a 600 m box around the camera that wraps as you move (grains stay put in space)
    const box = 600;
    const dp = this.debris.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < DEBRIS; i++) {
      const wrap = (base: number, cam: number): number => {
        const t = base * box - cam * 1000;
        return ((((t + box) % (2 * box)) + 2 * box) % (2 * box)) - box;
      };
      dp.setXYZ(i, wrap(this.debrisPos[i * 3], camKm[0]), wrap(this.debrisPos[i * 3 + 1], camKm[1]), wrap(this.debrisPos[i * 3 + 2], camKm[2]));
    }
    dp.needsUpdate = true;
    // Haze clouds a few km out, fixed in space
    for (let i = 0; i < this.haze.length; i++) {
      const hx = (Math.floor(camKm[0] / 6) + (i % 3) - 1) * 6 + hash(i, 4, 4, 7) * 6;
      const hy = (Math.floor(camKm[1] / 6) + (Math.floor(i / 3) % 3) - 1) * 6 + hash(i, 5, 5, 7) * 6;
      const hz = (Math.floor(camKm[2] / 6) + (Math.floor(i / 9) % 2) - 0.5) * 6 + hash(i, 6, 6, 7) * 6;
      this.haze[i].position.set((hx - camKm[0]) * 1000, (hy - camKm[1]) * 1000, (hz - camKm[2]) * 1000);
      this.haze[i].scale.setScalar(5000 + hash(i, 7, 7, 7) * 7000);
      (this.haze[i].material as THREE.SpriteMaterial).opacity = 0.05 * show;
    }
    for (let v = 0; v < VARIANTS; v++) {
      this.meshes[v].count = counts[v];
      this.meshes[v].instanceMatrix.needsUpdate = true;
      if (this.meshes[v].instanceColor) this.meshes[v].instanceColor!.needsUpdate = true;
    }
  }

  public dispose(): void {
    for (const g of this.geometries) g.dispose();
    this.material.dispose();
    this.texture.dispose();
    this.debris.geometry.dispose();
    (this.debris.material as THREE.Material).dispose();
    for (const h of this.haze) (h.material as THREE.Material).dispose();
    this.hazeTex.dispose();
  }
}
