import * as THREE from 'three';
import { COSMIC_SCALE } from './Scale';

export interface ShowcaseBody {
  name: string;
  object: THREE.Object3D;
  /** Globe radius, render units. */
  radius: number;
}

export interface ShowcaseSubject extends ShowcaseBody {
  /** The subject's family (moons), largest first; may be empty. */
  moons: ShowcaseBody[];
  /** Radius of the region worth framing around the subject (render units). */
  extent: number;
  /** Whether the subject is a star (its own light source: no terminator to compose on). */
  star?: boolean;
  /** Optional body to film instead of the subject (a moon picked in the catalogue), keeping the subject behind it. */
  hero?: ShowcaseBody | null;
}

interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
}

type ShotKind = 'orbit' | 'lowpass' | 'foreground' | 'overhead' | 'close' | 'heroClose' | 'heroWide';

const SHOT_SECONDS = 11;
const BLEND_SECONDS = 3.2;

/**
 * A camera operator for the catalogue's background: films a planet and its moons as a continuous
 * sequence of cinematic shots (slow orbits, a low pass along the moons' plane, a moon in the
 * foreground with its planet behind, a view from high above the orbits, a close sweep over the
 * planet), each drifting gently and dissolving into the next with a smooth camera move. Everything
 * is placed relative to the bodies' live positions, so moons keep orbiting through the shots.
 *
 * It owns the camera while active (the CameraRig is suspended), like the surface view does.
 */
export class Showcase {
  public active = false;
  private subject: ShowcaseSubject | null = null;
  private shots: ShotKind[] = [];
  private index = 0;
  private shotStart = 0;
  private moonTurn = 0;
  private prev: Pose | null = null;
  private seed = 1;
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private qPrev = new THREE.Quaternion();
  private up = new THREE.Vector3(0, 1, 0);

  /** Film `subject` (a planet with its moons, or the Sun). Starts from the camera's current pose. */
  public start(subject: ShowcaseSubject, camera: THREE.PerspectiveCamera, now: number): void {
    this.subject = subject;
    this.active = true;
    this.seed = Math.floor(Math.random() * 1e6);
    this.shots = this.planShots(subject);
    this.index = 0;
    this.shotStart = now;
    this.prev = { pos: camera.position.clone(), look: camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3())), fov: camera.fov };
  }

  /** Change who is filmed without a cut: the current view blends into the new sequence. */
  public retarget(subject: ShowcaseSubject, camera: THREE.PerspectiveCamera, now: number): void {
    this.start(subject, camera, now);
  }

  public stop(): void {
    this.active = false;
    this.subject = null;
    this.prev = null;
  }

  /** The current shot's name, for a caption. */
  public caption(): string {
    const s = this.subject;
    if (!s) return '';
    const kind = this.shots[this.index % this.shots.length];
    const hero = s.hero?.name ?? s.moons[this.moonTurn % Math.max(1, s.moons.length)]?.name;
    switch (kind) {
      case 'orbit': return `${s.name} · wide orbit`;
      case 'lowpass': return `${s.name} · low pass along the orbits`;
      case 'foreground': return `${hero} · ${s.name} beyond`;
      case 'overhead': return `${s.name} · from above the orbits`;
      case 'close': return `${s.name} · close sweep`;
      case 'heroClose': return `${s.hero?.name ?? s.name} · close`;
      case 'heroWide': return `${s.hero?.name ?? s.name} · with ${s.name}`;
    }
  }

  private rnd(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }

  private planShots(s: ShowcaseSubject): ShotKind[] {
    if (s.hero) return ['heroWide', 'heroClose', 'foreground', 'heroWide', 'heroClose', 'orbit'];
    if (s.star) return ['orbit', 'close', 'overhead', 'lowpass', 'close'];
    if (s.moons.length === 0) return ['orbit', 'close', 'overhead', 'close', 'lowpass'];
    return ['orbit', 'foreground', 'lowpass', 'close', 'overhead', 'foreground', 'orbit', 'close'];
  }

  /** Pose for `kind` at time t (seconds into the shot). */
  private pose(kind: ShotKind, t: number, out: Pose): Pose {
    const s = this.subject!;
    const C = s.object.getWorldPosition(this.tmp.set(0, 0, 0)).clone();
    const R = s.radius;
    const E = Math.max(s.extent, R * 6);
    const u = t / SHOT_SECONDS; // 0..1 through the shot
    // Each shot has its own heading, always from the sunlit side (phase angle under ~65°) so the
    // globes are lit, varied per shot from the seed
    const toSun = C.clone().negate().normalize();
    const sunAz = Math.atan2(toSun.x, toSun.z);
    const swing = ((((this.index * 0.618 + (this.seed % 997) / 997) % 1) * 2 - 1) * 1.1);
    const base = s.star ? (this.index * 2.399 + (this.seed % 1000) / 159) % (Math.PI * 2) : sunAz + swing;
    const spherical = (dist: number, elevDeg: number, azim: number) =>
      new THREE.Vector3().setFromSphericalCoords(dist, THREE.MathUtils.degToRad(90 - elevDeg), azim).add(C);
    const moon = s.moons.length ? s.moons[this.moonTurn % s.moons.length] : null;
    const hero = s.hero ?? null;
    out.fov = 38;
    switch (kind) {
      case 'orbit': {
        out.pos.copy(spherical(E * 1.45, 16 + 6 * Math.sin(u * Math.PI), base + u * 0.32));
        out.look.copy(C);
        out.fov = 36;
        break;
      }
      case 'lowpass': {
        // Skimming the plane of the orbits, trucking sideways; the planet off-centre
        out.pos.copy(spherical(E * 0.95, 3.5, base + u * 0.22));
        out.look.copy(C).add(spherical(E * 0.15, 0, base + Math.PI / 2).sub(C));
        out.fov = 42;
        break;
      }
      case 'overhead': {
        out.pos.copy(spherical(E * 1.35, 68, base + u * 0.4));
        out.look.copy(C);
        out.fov = 40;
        break;
      }
      case 'close': {
        // Sweeping low over the planet's limb, the rest of the system beyond
        const d = R * (s.star ? 3.2 : 2.5);
        out.pos.copy(spherical(d, 8 + 10 * u, base + u * 0.5));
        out.look.copy(C).addScaledVector(this.up, R * 0.35);
        out.fov = 44;
        break;
      }
      case 'foreground': {
        // A moon large in the foreground, its planet hanging beyond it
        const M = (hero ?? moon)!;
        const P = M.object.getWorldPosition(new THREE.Vector3());
        const away = P.clone().sub(C).normalize();
        const side = new THREE.Vector3().crossVectors(away, this.up).normalize();
        // Behind the moon as seen from the planet, swung towards the Sun so both are lit
        const off = away.clone().multiplyScalar(0.45).addScaledVector(toSun, 1.0).addScaledVector(side, 0.3 - 0.3 * u).addScaledVector(this.up, 0.18).normalize();
        const d = Math.max(M.radius * 6.5, M.radius * 2);
        out.pos.copy(P).addScaledVector(off, d);
        // Aim just past the moon towards the planet: the moon sits off-centre, the planet beyond
        out.look.copy(P).addScaledVector(C.clone().sub(P).normalize(), d * 0.45);
        out.fov = 36;
        break;
      }
      case 'heroClose': {
        const M = hero!;
        const P = M.object.getWorldPosition(new THREE.Vector3());
        const heroSunAz = Math.atan2(-P.x, -P.z);
        out.pos.copy(new THREE.Vector3().setFromSphericalCoords(M.radius * 3.2, THREE.MathUtils.degToRad(76), heroSunAz + swing * 0.6 + u * 0.5).add(P));
        out.look.copy(P);
        out.fov = 40;
        break;
      }
      case 'heroWide': {
        const M = hero!;
        const P = M.object.getWorldPosition(new THREE.Vector3());
        const toPlanet = C.clone().sub(P).normalize();
        const side = new THREE.Vector3().crossVectors(toPlanet, this.up).normalize();
        const d = M.radius * 9;
        const off = toPlanet.clone().multiplyScalar(-0.25).addScaledVector(toSun, 1.0).addScaledVector(side, 0.35 + 0.25 * u).addScaledVector(this.up, 0.2).normalize();
        out.pos.copy(P).addScaledVector(off, d);
        out.look.copy(P).addScaledVector(toPlanet, d * 0.35);
        out.fov = 36;
        break;
      }
    }
    return out;
  }

  private cur: Pose = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 38 };
  private nextPose: Pose = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 38 };

  /** Drive the camera. `now` in seconds. */
  public update(camera: THREE.PerspectiveCamera, now: number, bodies: ShowcaseBody[]): void {
    if (!this.active || !this.subject) return;
    let t = now - this.shotStart;
    if (t > SHOT_SECONDS) {
      // Next shot: hold the pose we are leaving so the move into the new one is continuous
      this.prev = { pos: camera.position.clone(), look: this.cur.look.clone(), fov: camera.fov };
      this.index = (this.index + 1) % this.shots.length;
      if (this.shots[this.index] === 'foreground') this.moonTurn++;
      this.shotStart = now;
      t = 0;
      this.rnd();
    }
    const kind = this.shots[this.index];
    this.pose(kind, t, this.nextPose);
    const k = this.prev ? THREE.MathUtils.smootherstep(t / BLEND_SECONDS, 0, 1) : 1;
    if (this.prev && k < 1) {
      // Move in log-distance about the subject so big changes of scale read as a steady dolly
      const C = this.subject.object.getWorldPosition(this.tmp2);
      const a = this.prev.pos.clone().sub(C);
      const b = this.nextPose.pos.clone().sub(C);
      const la = Math.log(Math.max(1e-6, a.length()));
      const lb = Math.log(Math.max(1e-6, b.length()));
      const dir = a.normalize().lerp(b.normalize(), k).normalize();
      this.cur.pos.copy(C).addScaledVector(dir, Math.exp(la + (lb - la) * k));
      this.cur.look.copy(this.prev.look).lerp(this.nextPose.look, k);
      this.cur.fov = this.prev.fov + (this.nextPose.fov - this.prev.fov) * k;
    } else {
      this.prev = null;
      this.cur.pos.copy(this.nextPose.pos);
      this.cur.look.copy(this.nextPose.look);
      this.cur.fov = this.nextPose.fov;
    }
    camera.position.copy(this.cur.pos);
    camera.up.set(0, 1, 0);
    this.m.lookAt(this.cur.pos, this.cur.look, this.up);
    this.q.setFromRotationMatrix(this.m);
    // A gentle settle on the orientation too
    this.qPrev.copy(camera.quaternion);
    camera.quaternion.copy(this.qPrev).slerp(this.q, 0.18);
    camera.fov = this.cur.fov;
    // Depth range from the nearest surface
    let nearest = Infinity;
    for (const b of bodies) {
      const d = b.object.getWorldPosition(this.tmp2).distanceTo(camera.position) - b.radius;
      if (d < nearest) nearest = d;
    }
    camera.near = THREE.MathUtils.clamp(nearest * 0.05, 1e-4, 50);
    camera.far = Math.max(camera.far, 30000 * COSMIC_SCALE);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
}
