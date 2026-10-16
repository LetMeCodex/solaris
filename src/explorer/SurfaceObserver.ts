import * as THREE from 'three';
import { SkyAtmosphere, atmosphereFor, AtmosphereModel, transmittance } from './SkyAtmosphere';
import { SkyBodies, SkyBodySource, SkyObjectInfo } from './SkyBodies';
import { TILE_SHELL } from './SurfaceTileLayer';
import { latLonToLocal } from './TileMath';
import { findTimeOfDay, TimeOfDay } from './SkyAstronomy';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { ScreenLabelItem } from './ScreenLabels';
import { CatalogueManager } from '../data/CatalogueManager';

type Vec3 = [number, number, number];

export interface SurfaceBody {
  name: string;
  bodyGroup: THREE.Object3D;
  surfaceMesh: THREE.Mesh;
  visualRadius: number;
  radiusKm: number;
}

export interface SurfaceSkyObject {
  name: string;
  altDeg: number;
  azDeg: number;
  magnitude: number;
  diameterArcsec: number;
  distanceKm: number;
}

export interface SurfaceStatus {
  active: boolean;
  body: string;
  lat: number;
  lon: number;
  place: string | null;
  eyeHeightKm: number;
  headingDeg: number;
  pitchDeg: number;
  fovDeg: number;
  magnification: number;
  atmosphereOn: boolean;
  atmosphereKind: AtmosphereModel['kind'];
  atmosphereLabel: string;
  sunAltDeg: number;
  sunAzDeg: number;
  objects: SurfaceSkyObject[];
  /** Left alone for a while: the sky turns on its own, like a time-lapse. */
  timelapse: boolean;
}

export interface SurfaceObserverDeps {
  camera: THREE.PerspectiveCamera;
  dom: HTMLElement;
  scene: THREE.Scene;
  getBody: (name: string) => SurfaceBody | null;
  /** Everything that can appear in the sky (true heliocentric positions, km). */
  getSources: () => SkyBodySource[];
  /** Heliocentric ecliptic position (km) of a body now. */
  getPositionKm: (name: string) => Vec3 | null;
  /** Days (TDB) since J2000 now, and a way to jump the simulation clock. */
  getDays: () => number;
  setDays: (d: number) => void;
  /** Hide / restore everything that is not part of the sky from a surface (other globes, orbits…). */
  setSceneMode: (on: boolean, body: string, skyRadius: number) => void;
  /** Ground imagery lighting & haze hooks. */
  setGround: (light: { sunTint: Vec3; ambient: number } | null, haze: { color: THREE.Color; density: number } | null) => void;
}

const DEG = Math.PI / 180;
const DEFAULT_FOV = 70;
const MIN_FOV = 0.2;
const MAX_FOV = 100;
/** Seconds without input before the time-lapse begins. */
const IDLE_AFTER = 10;
/** One full turn of the sky in about this many real seconds while idle. */
const TIMELAPSE_TURN_S = 150;

/** Eye height above the imagery (km): a hill-top view on rocky worlds, above the cloud deck on giants. */
function eyeHeightKm(body: SurfaceBody): number {
  return body.radiusKm > 20000 ? body.radiusKm * 0.003 : 0.3;
}

/**
 * A finely curved patch of ground around where you stand, on the body's own material. The globe
 * itself is a coarse sphere (on small moons its facets are 10° wide): seen from a few hundred metres
 * up, a flat facet's straight edges stick up above the true horizon as a wedge. The cap reaches a
 * few horizon distances out, so the horizon you see is the real curve.
 */
function groundCap(centre: THREE.Vector3, horizonRad: number): THREE.BufferGeometry {
  const RINGS = 72;
  const SECTORS = 160;
  const reach = Math.min(Math.PI * 0.45, Math.max(horizonRad * 4, 0.01));
  const c = centre.clone().normalize();
  const a = Math.abs(c.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const e1 = new THREE.Vector3().crossVectors(a, c).normalize();
  const e2 = new THREE.Vector3().crossVectors(c, e1);
  // SphereGeometry's own mapping, so the cap shows exactly the globe's texture
  const uvOf = (p: THREE.Vector3): [number, number] => {
    const theta = Math.acos(THREE.MathUtils.clamp(p.y, -1, 1));
    let u = Math.atan2(p.z, -p.x) / (2 * Math.PI);
    if (u < 0) u += 1;
    return [u, 1 - theta / Math.PI];
  };
  const uc = uvOf(c)[0];
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= RINGS; i++) {
    // Rings packed towards the middle: the horizon (a quarter of the reach) gets the most
    const ang = reach * Math.pow(i / RINGS, 1.6);
    const sa = Math.sin(ang), ca = Math.cos(ang);
    for (let j = 0; j <= SECTORS; j++) {
      const t = (j / SECTORS) * Math.PI * 2;
      p.copy(c).multiplyScalar(ca).addScaledVector(e1, sa * Math.cos(t)).addScaledVector(e2, sa * Math.sin(t)).normalize();
      // A hair above the globe (where their vertices meet) and below the imagery tiles
      pos.push(p.x * 1.00002, p.y * 1.00002, p.z * 1.00002);
      nor.push(p.x, p.y, p.z);
      const [u0, v] = uvOf(p);
      const u = uc + ((((u0 - uc + 0.5) % 1) + 1) % 1) - 0.5; // no jump across the date line
      uv.push(u, v);
    }
  }
  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < SECTORS; j++) {
      const k = i * (SECTORS + 1) + j;
      const n = k + SECTORS + 1;
      idx.push(k, n, k + 1, k + 1, n, n + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

/**
 * "Stand on the surface and look up": a camera fixed to a point on a rotating body, with the
 * body's own sky (atmospheric scattering), the Sun, planets and moons at their true topocentric
 * positions and sizes, and a telescope-like zoom. Takes over the camera from the orbit rig while
 * active.
 */
export class SurfaceObserver {
  private d: SurfaceObserverDeps;
  private atmosphere = new SkyAtmosphere();
  private sky = new SkyBodies();
  private active = false;
  private body: SurfaceBody | null = null;
  private lat = 0;
  private lon = 0;
  private place: string | null = null;
  private heading = 0;
  private pitch = 20 * DEG;
  private targetHeading = 0;
  private targetPitch = 20 * DEG;
  private fov = DEFAULT_FOV;
  private targetFov = DEFAULT_FOV;
  private magnification = 1;
  private atmosphereOn = true;
  private model: AtmosphereModel = atmosphereFor('');
  private status: SurfaceStatus | null = null;
  private objects: SkyObjectInfo[] = [];
  private dragging = false;
  private last = { x: 0, y: 0 };
  private pinch = 0;
  private keys = new Set<string>();
  private pendingAim: string | null = null;
  private frame = { east: new THREE.Vector3(), north: new THREE.Vector3(), up: new THREE.Vector3() };
  private tmp = new THREE.Vector3();
  private lastTime = performance.now();
  private lastInput = performance.now();
  private idle = 0;
  private cap: THREE.Mesh | null = null;
  /** From Settings: the idle time-lapse may run. */
  public idleEnabled = true;

  constructor(deps: SurfaceObserverDeps) {
    this.d = deps;
    deps.scene.add(this.atmosphere.mesh);
    deps.scene.add(this.sky.group);
  }

  public isActive(): boolean {
    return this.active;
  }

  public getStatus(): SurfaceStatus | null {
    return this.status;
  }

  /** Stand at (lat, lon) on `bodyName` and look at the most interesting thing in the sky. */
  public enter(bodyName: string, lat: number, lon: number, place: string | null = null): boolean {
    const body = this.d.getBody(bodyName);
    if (!body) return false;
    this.body = body;
    this.lat = lat;
    this.lon = lon;
    this.place = place;
    this.model = atmosphereFor(bodyName);
    this.atmosphere.setModel(this.model);
    this.atmosphereOn = true;
    this.fov = this.targetFov = DEFAULT_FOV;
    this.active = true;
    this.attach();
    this.addGroundCap(body, lat, lon);
    this.computeFrame();
    this.d.setSceneMode(true, bodyName, this.skyRadii().stars);
    // Aim after the first sky update so we know what is above the horizon
    this.pendingAim = 'auto';
    this.heading = this.targetHeading = 180 * DEG;
    this.pitch = this.targetPitch = 25 * DEG;
    this.touch();
    return true;
  }

  public exit(): void {
    if (!this.active) return;
    this.active = false;
    this.detach();
    this.removeGroundCap();
    this.atmosphere.mesh.visible = false;
    this.sky.group.visible = false;
    this.d.camera.up.set(0, 1, 0);
    this.d.camera.fov = 55;
    this.d.camera.updateProjectionMatrix();
    if (this.body) this.d.setSceneMode(false, this.body.name, 0);
    this.d.setGround(null, null);
    this.status = null;
  }

  private addGroundCap(body: SurfaceBody, lat: number, lon: number): void {
    this.removeGroundCap();
    const mat = body.surfaceMesh.material as THREE.Material & { uniforms?: Record<string, { value: unknown }> };
    // The cap may cross the map's date line: let the textures repeat instead of clamping there
    for (const key of ['map', 'normalMap']) {
      const t = mat.uniforms?.[key]?.value;
      if (t instanceof THREE.Texture && t.wrapS !== THREE.RepeatWrapping) {
        t.wrapS = THREE.RepeatWrapping;
        t.needsUpdate = true;
      }
    }
    const horizon = Math.sqrt((2 * eyeHeightKm(body)) / body.radiusKm);
    this.cap = new THREE.Mesh(groundCap(new THREE.Vector3(...latLonToLocal(lat, lon)), horizon), mat);
    this.cap.name = 'surface_ground_cap';
    this.cap.renderOrder = body.surfaceMesh.renderOrder;
    body.surfaceMesh.add(this.cap);
  }

  private removeGroundCap(): void {
    if (!this.cap) return;
    this.cap.removeFromParent();
    this.cap.geometry.dispose();
    this.cap = null;
  }

  /** Current standing point (for "back to orbit"). */
  public getLocation(): { body: string; lat: number; lon: number } | null {
    return this.body ? { body: this.body.name, lat: this.lat, lon: this.lon } : null;
  }

  public setMagnification(m: number): void {
    this.magnification = THREE.MathUtils.clamp(m, 1, 2000);
  }

  public setAtmosphere(on: boolean): void {
    this.atmosphereOn = on;
  }

  public resetZoom(): void {
    this.targetFov = DEFAULT_FOV;
  }

  /** Turn to face a sky object (and keep the zoom). */
  public lookAt(name: string): void {
    const o = this.objects.find((x) => x.name === name);
    if (!o) return;
    this.targetHeading = this.continuousHeading(o.azDeg * DEG);
    this.targetPitch = THREE.MathUtils.clamp(o.altDeg * DEG, -0.3, 1.5);
    this.touch();
  }

  /** Frame an exact view (a postcard): compass heading, height above the horizon, field of view. */
  public setView(headingDeg: number, pitchDeg: number, fovDeg: number = DEFAULT_FOV): void {
    this.pendingAim = null;
    this.heading = this.targetHeading = headingDeg * DEG;
    this.pitch = this.targetPitch = THREE.MathUtils.clamp(pitchDeg, -80, 89.5) * DEG;
    this.fov = this.targetFov = THREE.MathUtils.clamp(fovDeg, MIN_FOV, MAX_FOV);
    this.touch();
  }

  /** Someone is using the view: the time-lapse stops at once. */
  private touch(): void {
    this.lastInput = performance.now();
  }

  /** Sky time per real second for the time-lapse: a full turn of this world's sky in ~2.5 minutes. */
  private timelapseDaysPerSecond(): number {
    const h = CatalogueManager.getBody(this.body?.name ?? '')?.physical.rotationPeriodHours;
    const dayDays = Math.abs(h ?? 24) / 24;
    return THREE.MathUtils.clamp(dayDays / TIMELAPSE_TURN_S, 1 / 1440, 2);
  }

  /** Jump the simulation clock to the next sunrise / noon / sunset / midnight here. */
  public setTimeOfDay(what: TimeOfDay): boolean {
    if (!this.body) return false;
    const d = findTimeOfDay(this.body.name, this.lat, this.lon, this.d.getDays(), what);
    if (d === null) return false;
    this.d.setDays(d);
    return true;
  }

  /** Labels for the sky objects worth naming. */
  public labelItems(): ScreenLabelItem[] {
    if (!this.active) return [];
    return this.objects
      .filter((o) => o.visible && o.altDeg > -1 && (o.magnitude < 3.5 || o.name === 'Sun'))
      // Brightest first: they keep their place when labels crowd together
      .sort((a, b) => (a.name === 'Sun' ? -99 : a.magnitude) - (b.name === 'Sun' ? -99 : b.magnitude))
      .slice(0, 14)
      .map((o) => ({
        id: `sky:${o.name}`,
        text: o.name,
        sub: o.name === 'Sun' ? undefined : `${o.magnitude.toFixed(1)} mag`,
        world: o.labelWorld,
        kind: 'sky' as const,
      }));
  }

  // --- per frame ---

  private skyRadii(): { dome: number; shell: number; stars: number; far: number; near: number; eyeUnits: number } {
    const b = this.body!;
    const kmPerUnit = b.radiusKm / b.visualRadius;
    const eyeKm = eyeHeightKm(b);
    const horizonUnits = Math.sqrt(2 * b.radiusKm * eyeKm) / kmPerUnit;
    const dome = Math.max(0.5, horizonUnits * 3);
    const shell = dome * 2;
    const stars = shell * 2.5;
    const far = Math.max(stars * 1.6, b.name === 'Saturn' ? b.visualRadius * 5 : 0);
    const eyeUnits = eyeKm / kmPerUnit;
    return { dome, shell, stars, far, near: Math.max(eyeUnits * 0.15, 1e-7), eyeUnits };
  }

  private computeFrame(): THREE.Vector3 {
    const b = this.body!;
    b.surfaceMesh.updateWorldMatrix(true, false);
    const eyeKm = eyeHeightKm(b);
    const r = TILE_SHELL + eyeKm / b.radiusKm;
    const [x, y, z] = latLonToLocal(this.lat, this.lon);
    const pos = b.surfaceMesh.localToWorld(new THREE.Vector3(x * r, y * r, z * r));
    const centre = b.bodyGroup.getWorldPosition(new THREE.Vector3());
    const up = this.frame.up.copy(pos).sub(centre).normalize();
    const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(b.surfaceMesh.getWorldQuaternion(new THREE.Quaternion()));
    const north = this.frame.north.copy(pole).addScaledVector(up, -pole.dot(up));
    if (north.lengthSq() < 1e-10) north.set(1, 0, 0).addScaledVector(up, -up.x);
    north.normalize();
    this.frame.east.crossVectors(north, up).normalize();
    return pos;
  }

  public update(): void {
    if (!this.active || !this.body) return;
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const b = this.body;
    const cam = this.d.camera;
    const radii = this.skyRadii();

    // Keys
    const rate = 1.2 * (this.fov / DEFAULT_FOV) * dt;
    if (this.keys.has('ArrowLeft')) this.targetHeading -= rate;
    if (this.keys.has('ArrowRight')) this.targetHeading += rate;
    if (this.keys.has('ArrowUp')) this.targetPitch += rate;
    if (this.keys.has('ArrowDown')) this.targetPitch -= rate;
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch, -80 * DEG, 89.5 * DEG);
    // Idle: after a quiet spell the view drifts slowly and the sky turns (a time-lapse); any input
    // hands control straight back
    const quiet = this.idleEnabled && (now - this.lastInput) / 1000 > IDLE_AFTER && !this.dragging && this.keys.size === 0;
    this.idle = THREE.MathUtils.clamp(this.idle + (quiet ? dt / 4 : -dt * 3), 0, 1);
    if (this.idle > 0) {
      const e = this.idle * this.idle * (3 - 2 * this.idle);
      this.targetHeading += e * 0.03 * (this.fov / DEFAULT_FOV) * dt;
      this.d.setDays(this.d.getDays() + e * this.timelapseDaysPerSecond() * dt);
    }
    const k = 1 - Math.pow(0.0005, dt);
    this.heading += (this.targetHeading - this.heading) * k;
    this.pitch += (this.targetPitch - this.pitch) * k;
    this.fov += (this.targetFov - this.fov) * k;

    const pos = this.computeFrame();
    const { east, north, up } = this.frame;
    const ch = Math.cos(this.heading);
    const sh = Math.sin(this.heading);
    const cp = Math.cos(this.pitch);
    const fwd = this.tmp
      .set(0, 0, 0)
      .addScaledVector(north, cp * ch)
      .addScaledVector(east, cp * sh)
      .addScaledVector(up, Math.sin(this.pitch));
    cam.position.copy(pos);
    cam.up.copy(up);
    cam.lookAt(pos.clone().add(fwd));
    cam.fov = this.fov;
    cam.near = radii.near;
    cam.far = radii.far;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();

    // Observer position in heliocentric ecliptic km (topocentric parallax matters for moons)
    const bodyKm = this.d.getPositionKm(b.name) ?? [0, 0, 0];
    const eyeR = b.radiusKm + eyeHeightKm(b);
    const upEcl = CoordinateFrames.threeToEcliptic([up.x, up.y, up.z]);
    const observerKm: Vec3 = [bodyKm[0] + upEcl[0] * eyeR, bodyKm[1] + upEcl[1] * eyeR, bodyKm[2] + upEcl[2] * eyeR];

    // Sun direction and local daylight
    const sunEcl: Vec3 = [-observerKm[0], -observerKm[1], -observerKm[2]];
    const sunT = CoordinateFrames.eclipticToThree(sunEcl);
    const sunDir = new THREE.Vector3(sunT[0], sunT[1], sunT[2]).normalize();
    const sunAlt = Math.asin(THREE.MathUtils.clamp(sunDir.dot(up), -1, 1)) / DEG;
    let sunAz = Math.atan2(sunDir.dot(east), sunDir.dot(north)) / DEG;
    if (sunAz < 0) sunAz += 360;

    const atmo = this.atmosphereOn && this.model.kind !== 'none' ? this.model : null;
    this.atmosphere.update(pos, radii.dome, this.frame, sunDir, eyeHeightKm(b) * 1000, !!atmo);

    // How much daylight drowns faint objects
    const dayK = atmo
      ? atmo.kind === 'overcast'
        ? 1
        : THREE.MathUtils.smoothstep(sunAlt, -14, 2)
      : 0;
    const telescopeGain = 5 * Math.log10(Math.max(1, DEFAULT_FOV / this.fov));
    const limitingMagnitude = (atmo ? THREE.MathUtils.lerp(6.2, -3.8, dayK) : 6.5) + telescopeGain;

    this.sky.group.visible = true;
    const pixelsPerRadian = (this.d.dom.clientHeight || 800) / (2 * Math.tan((this.fov * DEG) / 2));
    this.objects = this.sky.update({
      camera: cam,
      observerKm,
      observerBody: b.name,
      sources: this.d.getSources(),
      frame: this.frame,
      shellRadius: radii.shell,
      pixelsPerRadian,
      magnification: this.magnification,
      limitingMagnitude,
      atmosphere: atmo,
      hideAll: !!atmo && atmo.kind === 'overcast',
    });

    // Ground lighting: sunlight reddened by the air, sky light as ambient, and aerial perspective
    const ext = atmo ? transmittance(atmo, sunAlt) : ([1, 1, 1] as Vec3);
    const sunUp = THREE.MathUtils.smoothstep(sunAlt, -6, 8);
    const ambient = atmo
      ? atmo.kind === 'overcast'
        ? 0.03 + 0.35 * THREE.MathUtils.smoothstep(sunAlt, -10, 20)
        : 0.03 + 0.22 * sunUp
      : 0.015;
    const tint: Vec3 = atmo && atmo.kind === 'overcast' ? [0.05, 0.03, 0.01] : [ext[0], ext[1], ext[2]];
    let haze: { color: THREE.Color; density: number } | null = null;
    if (atmo) {
      const base = atmo.kind === 'overcast' ? new THREE.Color(0.32, 0.2, 0.09) : this.horizonColor(atmo, sunUp, ext);
      const kmPerUnit = b.radiusKm / b.visualRadius;
      haze = { color: base, density: (1 / Math.max(1, atmo.visibilityKm)) * kmPerUnit };
    }
    this.d.setGround({ sunTint: tint, ambient }, haze);

    if (this.pendingAim) {
      this.pendingAim = null;
      this.autoAim(sunAlt, sunAz);
    }

    this.status = {
      active: true,
      body: b.name,
      lat: this.lat,
      lon: this.lon,
      place: this.place,
      eyeHeightKm: eyeHeightKm(b),
      headingDeg: ((this.heading / DEG) % 360 + 360) % 360,
      pitchDeg: this.pitch / DEG,
      fovDeg: this.fov,
      magnification: this.magnification,
      atmosphereOn: this.atmosphereOn,
      atmosphereKind: this.model.kind,
      atmosphereLabel: this.model.label,
      sunAltDeg: sunAlt,
      sunAzDeg: sunAz,
      timelapse: this.idle > 0.5,
      objects: this.objects
        .filter((o) => o.altDeg > 0 && o.name !== b.name && (o.magnitude < 6.5 || o.diameterArcsec > 60))
        .sort((a, c) => a.magnitude - c.magnitude)
        .slice(0, 12)
        .map((o) => ({
          name: o.name, altDeg: o.altDeg, azDeg: o.azDeg, magnitude: o.magnitude,
          diameterArcsec: o.diameterArcsec, distanceKm: o.distanceKm,
        })),
    };
  }

  /** Rough horizon sky colour for aerial perspective. */
  private horizonColor(atmo: AtmosphereModel, sunUp: number, ext: Vec3): THREE.Color {
    // Daylit horizon colour ~ scattering colour weighted by what still reaches it
    const r = atmo.betaR;
    const m = atmo.betaMs;
    const c = new THREE.Color(
      (r[0] * 0.6e5 + m[0] * 0.5e5) * (0.4 + 0.6 * ext[0]),
      (r[1] * 0.6e5 + m[1] * 0.5e5) * (0.4 + 0.6 * ext[1]),
      (r[2] * 0.6e5 + m[2] * 0.5e5) * (0.4 + 0.6 * ext[2])
    );
    const max = Math.max(c.r, c.g, c.b, 1e-6);
    c.multiplyScalar((0.85 / max) * (0.05 + 0.95 * sunUp));
    return c;
  }

  /** Face something worth seeing: the parent planet from a moon, Saturn's rings, or the brightest object. */
  private autoAim(sunAlt: number, sunAz: number): void {
    const b = this.body!;
    // Angular separation (deg) between two alt/az directions
    const sep = (a1: number, z1: number, a2: number, z2: number) => {
      const r = Math.PI / 180;
      const c = Math.sin(a1 * r) * Math.sin(a2 * r) + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.cos((z1 - z2) * r);
      return Math.acos(THREE.MathUtils.clamp(c, -1, 1)) / r;
    };
    const sunUp = sunAlt > -6;
    const above = this.objects.filter((o) => o.altDeg > 3 && o.name !== 'Sun');
    // Keep the Sun's glare out of the opening shot
    const clear = above.filter((o) => !sunUp || sep(o.altDeg, o.azDeg, sunAlt, sunAz) > 40);
    const big = above.filter((o) => o.diameterArcsec > 3600).sort((a, c) => c.diameterArcsec - a.diameterArcsec)[0];
    let target: { az: number; alt: number } | null = null;
    if (b.name === 'Saturn') {
      // The rings arch across the sky towards the equator
      target = { az: this.lat >= 0 ? 180 : 0, alt: 28 };
    } else if (big) {
      // A resolved world in the sky (Earth from the Moon, Saturn from its moons) is the shot
      target = { az: big.azDeg, alt: big.altDeg };
    } else {
      const low = clear.filter((o) => o.altDeg < 45).sort((a, c) => a.magnitude - c.magnitude)[0];
      const any = clear.sort((a, c) => a.magnitude - c.magnitude)[0];
      const pick = low ?? any;
      if (pick && pick.magnitude < 1.5) target = { az: pick.azDeg, alt: pick.altDeg };
      else if (sunUp) target = { az: (sunAz + 180) % 360, alt: 15 }; // the lit landscape, Sun behind
      else target = { az: 180, alt: 30 };
    }
    // Keep the horizon in frame: the ground and the sky together make the scene
    this.heading = this.targetHeading = target.az * DEG;
    // Aim a little below the object so the ground fills the lower part of the frame
    const aim = big ? target.alt - 0.45 * (DEFAULT_FOV / 2) : target.alt;
    this.pitch = this.targetPitch = THREE.MathUtils.clamp(aim, 8, big ? 50 : 30) * DEG;
  }

  private continuousHeading(h: number): number {
    let v = h;
    while (v - this.heading > Math.PI) v -= Math.PI * 2;
    while (v - this.heading < -Math.PI) v += Math.PI * 2;
    return v;
  }

  // --- input ---

  private attach(): void {
    const el = this.d.dom;
    el.addEventListener('mousedown', this.onDown);
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseup', this.onUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('touchstart', this.onTouchStart, { passive: true });
    el.addEventListener('touchmove', this.onTouchMove, { passive: true });
    el.addEventListener('dblclick', this.onDbl);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private detach(): void {
    const el = this.d.dom;
    el.removeEventListener('mousedown', this.onDown);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseup', this.onUp);
    el.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('touchstart', this.onTouchStart);
    el.removeEventListener('touchmove', this.onTouchMove);
    el.removeEventListener('dblclick', this.onDbl);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.keys.clear();
    this.dragging = false;
  }

  private radPerPx(): number {
    return (this.fov * DEG) / Math.max(1, this.d.dom.clientHeight || 800);
  }

  private onDown = (e: MouseEvent): void => {
    this.touch();
    this.dragging = true;
    this.last = { x: e.clientX, y: e.clientY };
  };

  private onMove = (e: MouseEvent): void => {
    if (!this.dragging) return;
    this.touch();
    const dx = e.clientX - this.last.x;
    const dy = e.clientY - this.last.y;
    this.last = { x: e.clientX, y: e.clientY };
    // Grab the sky: it follows the cursor
    this.targetHeading -= dx * this.radPerPx();
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + dy * this.radPerPx(), -80 * DEG, 89.5 * DEG);
  };

  private onUp = (): void => {
    this.dragging = false;
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.touch();
    const lineScale = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
    const dy = THREE.MathUtils.clamp(e.deltaY * lineScale, -600, 600);
    // Wheel up zooms in, like a telescope
    this.targetFov = THREE.MathUtils.clamp(this.targetFov * Math.exp(dy * 0.0016), MIN_FOV, MAX_FOV);
  };

  private onTouchStart = (e: TouchEvent): void => {
    this.touch();
    if (e.touches.length === 1) {
      this.dragging = true;
      this.last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      this.dragging = false;
      this.pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    this.touch();
    if (e.touches.length === 1 && this.dragging) {
      const t = e.touches[0];
      const dx = t.clientX - this.last.x;
      const dy = t.clientY - this.last.y;
      this.last = { x: t.clientX, y: t.clientY };
      this.targetHeading -= dx * this.radPerPx();
      this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + dy * this.radPerPx(), -80 * DEG, 89.5 * DEG);
    } else if (e.touches.length === 2 && this.pinch > 0) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      this.targetFov = THREE.MathUtils.clamp(this.targetFov * (this.pinch / Math.max(1, d)), MIN_FOV, MAX_FOV);
      this.pinch = d;
    }
  };

  private onDbl = (): void => {
    this.touch();
    this.targetFov = DEFAULT_FOV;
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    this.touch();
    if (e.key.startsWith('Arrow')) {
      this.keys.add(e.key);
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key);
  };

  public dispose(): void {
    this.exit();
    this.atmosphere.dispose();
    this.sky.dispose();
  }
}
