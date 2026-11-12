import * as THREE from 'three';
import { perf } from '../rendering/Performance';

/**
 * The world going on round the jet: it is not a still photograph.
 *
 *  - Birds, low over Earth by day: a few flocks of two dozen, wings beating, wheeling round a
 *    centre a few hundred metres off, seated ahead of the jet and moved on when left behind.
 *  - Air traffic: airliners at cruise height (9.5-11.5 km) crossing the sky at their real speed
 *    (~860 km/h), each drawing a contrail kilometres long that fades behind it.
 *
 * Both live in Earth's own frame (children of its surface mesh, a unit sphere), so they stay put
 * in the world as you fly. A bird is half a metre across: in a frame the size of Earth, 32-bit
 * floats would shake it about by tens of centimetres, so each flock and each airliner has its own
 * small frame at its place, and the geometry inside is in metres.
 */

const METRE = 1 / 6378137;
const R_M = 6378137;

const FLOCKS = perf.tier === 'low' ? 2 : 4;
const BIRDS = perf.tier === 'low' ? 14 : 24;
const AIRLINERS = perf.tier === 'low' ? 4 : 8;

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** A bird: a small body and two wings (their tips flap, see the shader). */
function birdGeometry(): THREE.BufferGeometry {
  // x across the wings, z forward, y up; ~0.7 m span
  const pos = [
    // left wing
    0, 0, 0.08, -0.36, 0.02, -0.04, 0, 0, -0.12,
    // right wing
    0, 0, 0.08, 0, 0, -0.12, 0.36, 0.02, -0.04,
    // body
    -0.03, 0, 0.16, 0.03, 0, 0.16, 0, -0.02, -0.18,
  ];
  // How much of the beat each vertex takes (the tips the most)
  const wing = [0, 1, 0.15, 0, 0.15, 1, 0, 0, 0];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aWing', new THREE.Float32BufferAttribute(wing, 1));
  g.computeVertexNormals();
  return g;
}

/** An airliner: fuselage, swept wings and tail (~60 m long), in metres, nose along +z. */
function airlinerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(new THREE.CylinderGeometry(2.9, 2.9, 58, 10).rotateX(Math.PI / 2));
  parts.push(new THREE.ConeGeometry(2.9, 6, 10).rotateX(Math.PI / 2).translate(0, 0, 32));
  const wing = new THREE.BoxGeometry(60, 0.6, 8);
  const wp = wing.getAttribute('position');
  for (let i = 0; i < wp.count; i++) wp.setZ(i, wp.getZ(i) - Math.abs(wp.getX(i)) * 0.45);
  parts.push(wing.translate(0, -1, 2));
  const tail = new THREE.BoxGeometry(20, 0.5, 5);
  const tp = tail.getAttribute('position');
  for (let i = 0; i < tp.count; i++) tp.setZ(i, tp.getZ(i) - Math.abs(tp.getX(i)) * 0.4);
  parts.push(tail.translate(0, 1, -25));
  parts.push(new THREE.BoxGeometry(0.6, 9, 6).translate(0, 5, -25));
  const pos: number[] = [];
  for (const p of parts) {
    const q = p.index ? p.toNonIndexed() : p;
    const a = q.getAttribute('position');
    for (let i = 0; i < a.count; i++) pos.push(a.getX(i), a.getY(i), a.getZ(i));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

const CONTRAIL_M = 7000;

/** Two crossed ribbons behind the plane (seen from any side), fading along their length. */
function contrailGeometry(): THREE.BufferGeometry {
  // Narrow at the engines, spreading to four times as wide kilometres back (as real ones do)
  const w = 30;
  const W = w * 4;
  const pos = [
    // flat ribbon
    -w, 0, 0, w, 0, 0, W, 0, -CONTRAIL_M, -w, 0, 0, W, 0, -CONTRAIL_M, -W, 0, -CONTRAIL_M,
    // upright ribbon
    0, -w, 0, 0, w, 0, 0, W, -CONTRAIL_M, 0, -w, 0, 0, W, -CONTRAIL_M, 0, -W, -CONTRAIL_M,
  ];
  // u along the trail (0 at the engines), v across it
  const uv = [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

interface Flock {
  mesh: THREE.InstancedMesh;
  /** Where its centre is, in Earth's frame (a unit sphere), and its circling. */
  centre: THREE.Vector3;
  radiusM: number;
  speedMps: number;
  angle: number;
  seed: number;
}

interface Airliner {
  body: THREE.Mesh;
  /** On the unit sphere, its heading (unit, tangent), its height (km). */
  at: THREE.Vector3;
  heading: THREE.Vector3;
  altKm: number;
  speedMps: number;
}

export class AliveWorld {
  public readonly group = new THREE.Group();
  private flocks: Flock[] = [];
  private airliners: Airliner[] = [];
  private birdMat: THREE.MeshLambertMaterial;
  private planeMat = new THREE.MeshStandardMaterial({ color: 0xe9edf2, roughness: 0.45, metalness: 0.35 });
  private trailMat: THREE.ShaderMaterial;
  private readonly u = { uT: { value: 0 } };
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private v = new THREE.Vector3();
  private w = new THREE.Vector3();
  private yAxis = new THREE.Vector3(0, 1, 0);
  private jetLocal = new THREE.Vector3();
  private inv = new THREE.Matrix4();
  private seeded = 0;

  constructor() {
    this.group.name = 'alive_world';
    this.birdMat = new THREE.MeshLambertMaterial({ color: 0x262320, side: THREE.DoubleSide });
    this.birdMat.onBeforeCompile = (shader) => {
      shader.uniforms.uT = this.u.uT;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aWing;\nuniform float uT;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
// Each bird its own beat, from where it is in the flock
float ph = fract(sin(dot(vec2(instanceMatrix[3][0], instanceMatrix[3][2]), vec2(12.9898, 78.233))) * 43758.5453) * 6.2831;
transformed.y += sin(uT * 11.0 + ph) * 0.22 * aWing;`,
        );
    };
    this.birdMat.customProgramCacheKey = () => 'solaris-bird';
    const bird = birdGeometry();
    for (let i = 0; i < FLOCKS; i++) {
      const mesh = new THREE.InstancedMesh(bird, this.birdMat, BIRDS);
      mesh.frustumCulled = false;
      mesh.matrixAutoUpdate = false;
      mesh.visible = false;
      this.group.add(mesh);
      this.flocks.push({ mesh, centre: new THREE.Vector3(), radiusM: 120, speedMps: 13, angle: 0, seed: i * 17.3 });
    }
    this.trailMat = new THREE.ShaderMaterial({
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `varying vec2 vUv;
void main() {
  // Dense just behind the engines, spreading thin and fading kilometres back; soft at its edges
  float along = (1.0 - vUv.x);
  float a = pow(along, 1.6) * smoothstep(0.0, 0.015, vUv.x) * smoothstep(0.0, 0.5, 1.0 - abs(vUv.y - 0.5) * 2.0);
  gl_FragColor = vec4(vec3(0.97, 0.98, 1.0), a * 0.55);
}`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const plane = airlinerGeometry();
    const trail = contrailGeometry();
    for (let i = 0; i < AIRLINERS; i++) {
      const body = new THREE.Mesh(plane, this.planeMat);
      body.matrixAutoUpdate = false;
      body.frustumCulled = false;
      body.visible = false;
      const t = new THREE.Mesh(trail, this.trailMat);
      t.frustumCulled = false;
      t.position.set(0, 0, -30);
      body.add(t);
      this.group.add(body);
      this.airliners.push({ body, at: new THREE.Vector3(), heading: new THREE.Vector3(), altKm: 10.5, speedMps: 240 });
    }
  }

  /** Under Earth's surface mesh, so it all rides with the planet. */
  public attach(surface: THREE.Object3D): void {
    if (this.group.parent !== surface) surface.add(this.group);
  }

  public setVisible(on: boolean): void {
    this.group.visible = on;
  }

  /**
   * Per frame (outside the floating-origin draw): `jetWorld` the jet's position, `surface` Earth's
   * surface mesh, `altKm` the jet above the ground, `sunUp` the Sun's height there.
   */
  public update(dt: number, timeSec: number, jetWorld: THREE.Vector3, surface: THREE.Object3D, altKm: number, sunUp: number): void {
    this.u.uT.value = timeSec;
    surface.updateWorldMatrix(true, false);
    this.inv.copy(surface.matrixWorld).invert();
    const jet = this.jetLocal.copy(jetWorld).applyMatrix4(this.inv);
    const jetR = jet.length();
    const up = this.w.copy(jet).divideScalar(jetR);
    const groundR = jetR - Math.max(0, altKm) * 1000 * METRE;

    // --- Birds: low and by day
    const birdsOn = altKm < 2.5 && sunUp > -0.03;
    for (let i = 0; i < this.flocks.length; i++) {
      const f = this.flocks[i];
      f.mesh.visible = birdsOn;
      if (!birdsOn) continue;
      const fromJetM = f.centre.lengthSq() > 0 ? f.centre.distanceTo(jet) * R_M : Infinity;
      if (fromJetM > 4500) this.seatFlock(f, jet, up, groundR, i);
      f.angle += (f.speedMps / f.radiusM) * dt;
      this.placeFlock(f, timeSec);
    }

    // --- Air traffic: in the air, below space
    const trafficOn = altKm < 60;
    for (let i = 0; i < this.airliners.length; i++) {
      const a = this.airliners[i];
      a.body.visible = trafficOn;
      if (!trafficOn) continue;
      const fromJetKm = a.at.lengthSq() > 0 ? a.at.angleTo(up) * 6378.137 : Infinity;
      if (fromJetKm > 170) this.seatAirliner(a, up, i);
      // Along its great circle at its speed
      const axis = this.v.crossVectors(a.at, a.heading).normalize();
      const ang = (a.speedMps * dt) / R_M;
      a.at.applyAxisAngle(axis, ang).normalize();
      a.heading.applyAxisAngle(axis, ang).normalize();
      this.placeAirliner(a);
    }
    this.seeded++;
  }

  private seatFlock(f: Flock, jet: THREE.Vector3, up: THREE.Vector3, groundR: number, i: number): void {
    // Somewhere ahead and around: 0.6-2.5 km off, 40-220 m up
    const n = this.seeded * 7.13 + i * 3.7 + f.seed;
    const tangentA = this.v.set(up.y, up.z, up.x).cross(up).normalize();
    const tangentB = new THREE.Vector3().crossVectors(up, tangentA);
    const ang = hash(n) * Math.PI * 2;
    const distM = 600 + hash(n + 1) * 1900;
    const dir = tangentA.multiplyScalar(Math.cos(ang)).addScaledVector(tangentB, Math.sin(ang));
    const heightM = 40 + hash(n + 2) * 180;
    f.centre.copy(jet).normalize().addScaledVector(dir, distM * METRE).normalize().multiplyScalar(groundR + heightM * METRE);
    f.radiusM = 70 + hash(n + 3) * 160;
    f.speedMps = 10 + hash(n + 4) * 7;
    f.angle = hash(n + 5) * Math.PI * 2;
  }

  private placeFlock(f: Flock, timeSec: number): void {
    // The flock's own frame at its centre: y up (away from Earth's centre), in metres
    const upL = this.v.copy(f.centre).normalize();
    this.q.setFromUnitVectors(this.yAxis, upL);
    f.mesh.matrix.compose(f.centre, this.q, new THREE.Vector3(METRE, METRE, METRE));
    f.mesh.matrixWorldNeedsUpdate = true;
    const dummy = this.m;
    const pos = new THREE.Vector3();
    const rot = new THREE.Quaternion();
    const scl = new THREE.Vector3();
    for (let b = 0; b < BIRDS; b++) {
      // Each bird a little ahead or behind, inside or out, above or below the flock's circle,
      // drifting on its own
      const s = f.seed * 31 + b * 13.7;
      const lag = (hash(s) - 0.5) * 0.9;
      const ring = f.radiusM + (hash(s + 1) - 0.5) * 40 + Math.sin(timeSec * 0.7 + s) * 4;
      const ang = f.angle + lag;
      const y = (hash(s + 2) - 0.5) * 18 + Math.sin(timeSec * 0.9 + s * 2) * 2.5;
      pos.set(Math.cos(ang) * ring, y, Math.sin(ang) * ring);
      // Facing along the circle (and banked into it a little)
      const yaw = -ang;
      rot.setFromEuler(new THREE.Euler(0, yaw, -0.35, 'YXZ'));
      const size = 0.8 + hash(s + 3) * 0.5;
      scl.setScalar(size);
      dummy.compose(pos, rot, scl);
      f.mesh.setMatrixAt(b, dummy);
    }
    f.mesh.instanceMatrix.needsUpdate = true;
  }

  private seatAirliner(a: Airliner, up: THREE.Vector3, i: number): void {
    const n = this.seeded * 3.31 + i * 9.1;
    const tangentA = this.v.set(up.y, up.z, up.x).cross(up).normalize();
    const tangentB = new THREE.Vector3().crossVectors(up, tangentA);
    const ang = hash(n) * Math.PI * 2;
    const distKm = 30 + hash(n + 1) * 110;
    const dir = tangentA.clone().multiplyScalar(Math.cos(ang)).addScaledVector(tangentB, Math.sin(ang));
    a.at.copy(up).addScaledVector(dir, distKm / 6378.137).normalize();
    // Heading: any way across the sky
    const h = hash(n + 2) * Math.PI * 2;
    const tA = new THREE.Vector3(a.at.y, a.at.z, a.at.x).cross(a.at).normalize();
    const tB = new THREE.Vector3().crossVectors(a.at, tA);
    a.heading.copy(tA).multiplyScalar(Math.cos(h)).addScaledVector(tB, Math.sin(h)).normalize();
    a.altKm = 9.5 + hash(n + 3) * 2;
    a.speedMps = 225 + hash(n + 4) * 30;
  }

  private placeAirliner(a: Airliner): void {
    // Its own frame: y up, z along its heading, in metres
    const upL = a.at;
    const fwd = a.heading;
    const right = this.v.crossVectors(upL, fwd).normalize();
    this.m.makeBasis(right, upL, fwd);
    this.q.setFromRotationMatrix(this.m);
    const p = new THREE.Vector3().copy(upL).multiplyScalar(1 + (a.altKm * 1000) / R_M);
    a.body.matrix.compose(p, this.q, new THREE.Vector3(METRE, METRE, METRE));
    a.body.matrixWorldNeedsUpdate = true;
  }

  public dispose(): void {
    this.group.removeFromParent();
    for (const f of this.flocks) f.mesh.geometry.dispose();
    this.airliners[0]?.body.geometry.dispose();
    (this.airliners[0]?.body.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this.birdMat.dispose();
    this.planeMat.dispose();
    this.trailMat.dispose();
  }
}
