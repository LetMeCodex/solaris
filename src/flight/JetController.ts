import * as THREE from 'three';
import { perf } from '../rendering/Performance';
import { PhotorealEarth } from '../rendering/PhotorealEarth';
import type { PlanetMeshBundle } from '../rendering/PlanetFactory';
import { FlightModel, FlightInput, airDensity, gapKm, localKmPerUnit, resolveSurfaceContact, unitsPerMps, UNIVERSE_RADIUS_UNITS } from './FlightModel';
import { AIRFRAMES, chosenAirframe, JetModel, JET_LENGTH_M } from './JetModel';
import { SpeedField, Trail, ShockEffects, ExhaustSmoke } from './SpeedEffects';
import { JetAudio } from './JetAudio';
import { AIR } from './worlds';
import { Cockpit, NavPoint } from './Cockpit';
import { SkyEvents } from './SkyEvents';
import { earthElevation } from '../explorer/Elevation';
import { DEEP_TIME_SCENES } from '../explorer/DeepTime';
import { SunFlare, CanopyGlints } from './Optics';
import { AsteroidField } from './Asteroids';
import { Weather, WeatherMode } from './Weather';
import { localToLatLon } from '../explorer/TileMath';
import { KM_PER_UNIT, UNITS_PER_AU } from '../rendering/Scale';
import { HudGlass } from './HudGlass';
import { CockpitControls, DestinationRow } from './CockpitControls';
import { Landmark, landmarksFor } from '../explorer/Landmarks';
import { bodyLatLonToLocal } from '../explorer/TileMath';

const NAV_WORLDS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

/**
 * Jet mode: the pilot flies the SX-1 through the real Solar System.
 *
 * Frames: the jet's state lives in world render units (doubles). Each frame it rides the motion
 * of the dominant nearby world (its orbit, and close in, its spin, the way an aircraft is carried
 * round with the Earth), so real orbital speeds of tens of km/s never leave the pilot behind.
 *
 * Drawing: the world is drawn by Solaris as usual, the camera placed by this controller. The jet,
 * and the near-field effects are drawn after it in their own scene in
 * metres around the camera (LensPipeline's overlay pass), so a 17 m airframe stays crisp beside a
 * world thousands of km across. A cube capture of the real scene every few frames lights and
 * reflects the jet: the planet below, the Sun, the Milky Way.
 */

export type JetView = 'chase' | 'cockpit' | 'gopro' | 'flyby';

export interface JetMarker {
  name: string;
  x: number;
  y: number;
  distKm: number;
  target: boolean;
}

export interface JetTelemetry {
  active: boolean;
  speedMps: number;
  /** Speed along the line to the target (positive = closing), m/s. */
  closingMps: number;
  altKm: number;
  nearest: string;
  anchor: string;
  /** World whose air the jet is in ('' in vacuum). */
  airWorld: string;
  airDensity: number;
  mach: number;
  gLoad: number;
  throttle: number;
  boost: number;
  boostEnergy: number;
  assist: boolean;
  aligning: boolean;
  view: JetView;
  hasHorizon: boolean;
  pitchDeg: number;
  rollDeg: number;
  headingDeg: number;
  /** Pixels per degree at the screen centre (pitch ladder). */
  pxPerDeg: number;
  /** Where the nose points and where the jet is going, screen px (null if off screen). */
  nose: { x: number; y: number } | null;
  fpv: { x: number; y: number } | null;
  target: string;
  targetDistKm: number;
  targetEtaS: number;
  targetScreen: { x: number; y: number; on: boolean; angle: number } | null;
  markers: JetMarker[];
  /** 0 none, 1 terrain, 2 heat. */
  warning: number;
  heat: number;
  helpOpen: boolean;
  muted: boolean;
  fullHud: boolean;
  /** Speed blur strength and its centre (output NDC), for the lens pipeline. */
  blur: number;
  blurNdc: { x: number; y: number };
  /** The camera's own lens: 'gopro' fits a wide fisheye; null keeps the chosen profile. */
  lens: 'gopro' | null;
  /** The Sun in the frame (0..1): drives auto-exposure. */
  sunInView: number;
  /** The Sun on screen (NDC x, y) and its light on the canopy from inside (0..1). */
  canopySun: { x: number; y: number; k: number };
  /** Grey-out of the pilot's eyes under G (cockpit view), 0..1. */
  greyOut: number;
  /** What the sky is doing (an eclipse, a flare, a comet, meteors), or empty. */
  skyEvent: string;
  /** Airframe vibration reaching the camera (0..1): rolling-shutter shear. */
  vibration: number;
  /** Landing autopilot: the landmark and the distance left, km. */
  landingName: string;
  landingDistKm: number;
  landMenu: boolean;
  gearDown: boolean;
  abArmed: boolean;
  weather: string;
  weatherMode: string;
  localTime: number;
  invertPitch: boolean;
  width: number;
  height: number;
  timeSec: number;
}

/** Projects scene NDC to screen pixels (through the lens model), or null when masked. */
export type NdcToScreen = (x: number, y: number) => { x: number; y: number } | null;

interface BodyInfo {
  name: string;
  bundle: PlanetMeshBundle;
  center: THREE.Vector3;
  radius: number;
  radiusKm: number;
  /** Hidden from the target list (minor moons, asteroids, comets). */
  minor: boolean;
  /** No surface to fly near (the black hole): a target, not an obstacle or a frame. */
  noSurface: boolean;
  /** A nebula: gas you fly into and through (no surface, almost no clearance). */
  cloud?: boolean;
}

const FLY_KEYS = new Set([
  'w', 's', 'a', 'd', 'q', 'e', 'r', 'f', 'x', 'c', 'v', 't', 'z', 'g', 'h', 'n', 'i', ' ',
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'escape', 'shift', 'u', 'l', 'b', 'k', '[', ']', 'y',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]);
const TARGET_ORDER = ['Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Phobos', 'Ceres', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto',
  'Saturn', 'Enceladus', 'Titan', 'Iapetus', 'Uranus', 'Miranda', 'Titania', 'Neptune', 'Triton', 'Pluto', 'Charon', 'Sun', 'Sagittarius A*'];

export class JetController {
  /** The airframe flown (a setting: Gripen or Su-30MKK). */
  public readonly airframeId = chosenAirframe();
  public readonly airframe = AIRFRAMES[this.airframeId];
  public active = false;
  public view: JetView = 'chase';
  public assist = true;
  public throttle = 0.4;
  /** The era of the sky you fly under (a deep-time scene id, src/explorer/DeepTime), or null: today. */
  public era: string | null = null;
  /** A cobra asked for (V): taken by the next flight step. */
  private cobraQueued = false;
  public invertPitch = false;
  public helpOpen = true;
  public target = 'Mars';
  public readonly overlayScene = new THREE.Scene();
  public readonly overlayCamera = new THREE.PerspectiveCamera(60, 1, 0.05, 60000);
  public readonly audio = new JetAudio();

  private flight = new FlightModel();
  private model: JetModel | null = null;
  private cockpit: Cockpit | null = null;
  private navPoints: NavPoint[] = [];
  private jetGroup = new THREE.Group();
  private field = new SpeedField();
  private trails: Trail[] = [];
  private shock = new ShockEffects();
  private flare = new SunFlare();
  /** Eclipses, solar flares, comets, meteors (src/flight/SkyEvents). */
  private sky = new SkyEvents();
  /** How much of the Sun reaches the jet (eclipses, shadows), last frame. */
  private lastLit = 1;
  private lastTelemetrySec = 0;
  private skyOcc = { dir: new THREE.Vector3(), angle: 0, name: '' };
  private asteroids = new AsteroidField();
  public readonly weather = new Weather();
  private shiftHours: ((h: number) => void) | null = null;
  private glints: CanopyGlints | null = null;
  private hudGlass: HudGlass | null = null;
  private controls: CockpitControls | null = null;
  /** Landing gear down (drag in air; the landing autopilot lowers it on final). */
  public gearDown = false;
  /** Afterburner armed (the guarded switch): boost only works armed. */
  public abArmed = true;
  private destScroll = 0;
  private lastInput: FlightInput = { pitch: 0, roll: 0, yaw: 0, throttle: 0, boost: false, assist: true };
  private toSceneNdc: (x: number, y: number) => [number, number] = (x, y) => [x, y];
  /** The full screen-space symbology (ladder, tapes) instead of the minimal overlay. */
  public fullHud = false;
  /** The pilot's head: lags the airframe slightly and sinks under G (cockpit view). */
  private headQuat = new THREE.Quaternion();
  private headDrop = 0;
  private smoke = new ExhaustSmoke();
  private wasBoosting = false;
  private lastNozzleWorld = [{ p: new THREE.Vector3(), valid: false }, { p: new THREE.Vector3(), valid: false }];
  private sun = new THREE.DirectionalLight(0xfff4e6, 3.2);
  private planetShine = new THREE.HemisphereLight(0x0b0d14, 0x000000, 0.0);
  private ambient = new THREE.AmbientLight(0x1a1f2b, 0.06);
  private cockpitLight = new THREE.PointLight(0xdfe8ff, 0.0, 4, 1.6);

  private envTarget = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: false });
  private envCamera = new THREE.CubeCamera(0.01, 1e9, this.envTarget);
  private envFrame = 0;

  private bodies: BodyInfo[] = [];
  private bodyIndex = new Map<string, BodyInfo>();
  private anchor: BodyInfo | null = null;
  private anchorPrev = new THREE.Vector3();
  private spinPrev = new THREE.Quaternion();
  private spinValid = false;

  private keys = new Set<string>();
  private dragSteer = false;
  private steer = new THREE.Vector2();
  /**
   * Touch controls (JetHUD's on-screen stick and buttons): the stick, -1..1 each way (screen axes:
   * up is negative y, pulled back for nose up as with the mouse), boost and turn-to-target held.
   */
  public touchSteer = new THREE.Vector2();
  public touchBoost = false;
  public touchAlign = false;
  private lookDrag = false;
  private look = new THREE.Vector2();
  private lastMouse = new THREE.Vector2();
  private aligning = false;
  private dom: HTMLElement | null = null;
  /** The landmark the landing autopilot is flying to, or null. */
  public landing: Landmark | null = null;
  /** The landing list is open (L or the Land button). */
  public landMenu = false;
  private landRequest: ((lm: Landmark) => void) | null = null;
  private exitRequest: (() => void) | null = null;
  /** True heliocentric position of a world, km (the ephemeris, not the drawn scene). */
  private physicalKm: (name: string) => [number, number, number] = () => [0, 0, 0];
  /** Height over the nearest surface last frame, render units (depth range, env capture). */
  private lastAltUnits = 1;

  private chaseQuat = new THREE.Quaternion();
  private chaseDist = 17;
  private flybyPoint = new THREE.Vector3();
  private flybyValid = false;
  private shake = 0;
  private fovKick = 0;
  private wasSupersonic = false;
  private heat = 0;
  private warning = 0;

  private listeners = new Set<(t: JetTelemetry) => void>();
  public readonly telemetry: JetTelemetry = {
    active: false, speedMps: 0, closingMps: 0, altKm: 0, nearest: '', anchor: '', airWorld: '', airDensity: 0, mach: 0, gLoad: 1,
    throttle: 0, boost: 0, boostEnergy: 1, assist: true, aligning: false, view: 'chase', hasHorizon: false, pitchDeg: 0, rollDeg: 0,
    headingDeg: 0, pxPerDeg: 10, nose: null, fpv: null, target: 'Mars', targetDistKm: 0, targetEtaS: 0, targetScreen: null, markers: [],
    warning: 0, heat: 0, helpOpen: true, muted: false, fullHud: false, blur: 0, blurNdc: { x: 0, y: 0 }, lens: null, skyEvent: '', canopySun: { x: 0, y: 0, k: 0 }, greyOut: 0, sunInView: 0, vibration: 0, landingName: '', landingDistKm: 0, landMenu: false, gearDown: false, abArmed: true, weather: 'Clear', weatherMode: 'auto', localTime: 12, invertPitch: false, width: 1, height: 1, timeSec: 0,
  };

  // scratch
  private v1 = new THREE.Vector3();
  private v2 = new THREE.Vector3();
  private v3 = new THREE.Vector3();
  private q1 = new THREE.Quaternion();
  private q2 = new THREE.Quaternion();
  private m1 = new THREE.Matrix4();

  constructor() {
    this.overlayScene.add(this.jetGroup, this.field.mesh);
    this.jetGroup.add(this.shock.group);
    this.overlayScene.add(this.sun, this.sun.target, this.planetShine, this.ambient);
    // The jet's own shadows (on itself): softer and sharper where the GPU allows
    this.sun.castShadow = perf.settings.shadowMap > 0;
    this.sun.shadow.mapSize.set(Math.max(256, perf.settings.shadowMap), Math.max(256, perf.settings.shadowMap));
    const sc = this.sun.shadow.camera;
    sc.left = -11; sc.right = 11; sc.top = 11; sc.bottom = -11; sc.near = 1; sc.far = 80;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.overlayScene.environment = this.envTarget.texture;
    for (let i = 0; i < 2; i++) this.trails.push(new Trail(0.5, 2.6, 0xffffff));
    for (let i = 0; i < 2; i++) this.trails.push(new Trail(1.2, 6.0, 0xeef3ff));
    for (const t of this.trails) this.overlayScene.add(t.mesh);
    this.overlayScene.add(this.smoke.mesh, this.flare.group, this.asteroids.group, this.weather.group, this.sky.group);
    this.weather.onLightning = (km) => this.audio.thunder(km);
  }

  // ------------------------------------------------------------------ lifecycle

  /** Build the airframe lazily (canvas textures need a document). */
  /** Start loading the airframe now (called once the site has warmed up), so it is ready at take-off. */
  public preload(): void {
    this.ensureModel();
  }

  private ensureModel(): JetModel {
    if (!this.model) {
      this.model = new JetModel();
      this.jetGroup.add(this.model.root);
      this.cockpit = new Cockpit();
      this.model.root.add(this.cockpit.group);
      // The chosen airframe (CC BY 4.0, see ASSETS.md) takes over from the procedural one once loaded
      const model = this.model;
      const { url, anchors } = this.airframe;
      model
        .loadAirframe(import.meta.env.BASE_URL + url, anchors)
        .then(() => {
          this.cockpitLight.position.copy(model.eye).add(new THREE.Vector3(0, -0.25, -0.5));
          // Close behind: the jet fills the frame (wheel + Shift pulls back)
          this.chaseDist = model.length * 0.82;
          this.shock.group.scale.setScalar(model.length / JET_LENGTH_M);
          const half = model.length * 0.62;
          const sc = this.sun.shadow.camera;
          sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half;
          sc.updateProjectionMatrix();
          if (anchors.cockpit) this.controls = new CockpitControls(model, anchors.cockpit);
          if (model.hud) {
            this.hudGlass = new HudGlass(model.hud.centre, model.eye, model.hud.widthM);
            model.root.add(this.hudGlass.mesh);
          }
        })
        .catch((err) => {
          console.warn('[Solaris] jet model not loaded; flying the built-in airframe', err);
          model.showBuiltIn();
        });
      this.model.root.add(this.cockpitLight);
      this.cockpitLight.position.copy(this.model.eye).add(new THREE.Vector3(0, -0.25, -0.5));
    }
    return this.model;
  }

  public subscribe(fn: (t: JetTelemetry) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public bodyNames(): string[] {
    const known = new Set(TARGET_ORDER);
    return [...TARGET_ORDER.filter((n) => this.bodyIndex.has(n)), ...[...this.bodyIndex.keys()].filter((n) => !known.has(n))];
  }

  /**
   * Take the controls. The jet starts in a low orbit over `startBody`, on the dayside near the
   * terminator, so the first view is a huge sunlit limb with the Sun low on the horizon.
   */
  public enter(
    camera: THREE.PerspectiveCamera,
    bundles: Map<string, PlanetMeshBundle>,
    startBody: string,
    dom: HTMLElement,
    onExit: () => void,
    physicalKm: (name: string) => [number, number, number],
    options: {
      onLand?: (lm: Landmark) => void;
      takeOffFrom?: Landmark;
      toSceneNdc?: (x: number, y: number) => [number, number];
      /** Targets that are not worlds (the black hole), drawn elsewhere in the scene. */
      extraTargets?: PlanetMeshBundle[];
      /** Move the Solar System's clock (time of day). */
      shiftHours?: (h: number) => void;
    } = {}
  ): void {
    this.shiftHours = options.shiftHours ?? null;
    if (options.toSceneNdc) this.toSceneNdc = options.toSceneNdc;
    this.gearDown = false;
    this.ensureModel();
    this.physicalKm = physicalKm;
    this.landRequest = options.onLand ?? null;
    this.landing = null;
    this.landMenu = false;
    this.indexBodies(bundles, options.extraTargets ?? []);
    this.addBeltTargets();
    const start = this.bodyIndex.get(startBody) && !/sun|sagittarius/i.test(startBody) ? this.bodyIndex.get(startBody)! : this.bodyIndex.get('Earth')!;
    if (!start) return;
    this.dom = dom;
    this.exitRequest = onExit;

    const sunDir = this.v1.copy(start.center).negate().normalize();
    // A tangent across the sunlit hemisphere towards the terminator
    const pole = this.v2.set(0, 1, 0).applyQuaternion(start.bundle.bodyGroup.quaternion);
    const across = this.v3.crossVectors(sunDir, pole).normalize();
    const up = new THREE.Vector3().copy(sunDir).multiplyScalar(0.45).addScaledVector(across, 0.89).normalize();
    const alt = start.radius * 0.07;
    this.flight.position.copy(start.center).addScaledVector(up, start.radius + alt);
    const fwd = new THREE.Vector3().crossVectors(up, sunDir).normalize();
    if (fwd.lengthSq() < 0.5) fwd.set(1, 0, 0);
    this.m1.lookAt(new THREE.Vector3(), fwd, up);
    this.flight.quaternion.setFromRotationMatrix(this.m1);
    this.flight.rates.set(0, 0, 0);
    this.flight.boostEnergy = 1;
    const kpu = localKmPerUnit(alt, start.radius, start.radiusKm);
    this.flight.speed = 2500 * unitsPerMps(kpu);
    this.flight.velocity.copy(fwd).multiplyScalar(this.flight.speed);
    this.throttle = 0.4;
    this.anchor = start;
    this.anchorPrev.copy(start.center);
    this.spinValid = false;
    this.chaseQuat.copy(this.flight.quaternion);
    this.headQuat.copy(this.flight.quaternion);
    this.look.set(0, 0);
    this.flybyValid = false;
    this.target = start.name === 'Earth' ? 'Moon' : 'Earth';
    if (options.takeOffFrom) this.placeAtLandmark(options.takeOffFrom);
    for (const t of this.trails) t.clear();
    this.smoke.clear();

    this.active = true;
    camera.fov = 60;
    camera.updateProjectionMatrix();
    window.addEventListener('keydown', this.onKeyDown, true);
    window.addEventListener('keyup', this.onKeyUp, true);
    window.addEventListener('blur', this.onBlur);
    dom.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    dom.addEventListener('wheel', this.onWheel, { passive: false });
    dom.addEventListener('contextmenu', this.onContextMenu);
    this.audio.start();
    this.emit();
  }

  public exit(): void {
    if (!this.active) return;
    this.active = false;
    this.keys.clear();
    this.dragSteer = false;
    this.lookDrag = false;
    window.removeEventListener('keydown', this.onKeyDown, true);
    window.removeEventListener('keyup', this.onKeyUp, true);
    window.removeEventListener('blur', this.onBlur);
    this.dom?.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.dom?.removeEventListener('wheel', this.onWheel);
    this.dom?.removeEventListener('contextmenu', this.onContextMenu);
    this.dom = null;
    this.audio.suspend();
    this.telemetry.active = false;
    this.emit();
  }

  /** The world the jet is nearest to (for handing the camera back on exit). */
  /** Step to the next era of the sky (today, then each deep-time scene in turn). */
  public cycleEra(ids: string[]): void {
    const all: Array<string | null> = [null, ...ids];
    const i = all.indexOf(this.era);
    this.era = all[(i + 1) % all.length];
    // An era is seen from the ground of one world: that world becomes the target
    const d = this.era ? DEEP_TIME_SCENES.find((x) => x.id === this.era) : null;
    if (d) this.setTarget(d.body);
  }

  /** Called with the era's id when the pilot asks to land and look up at it (set by the scene). */
  public onLookUp: ((id: string) => void) | null = null;

  /** Keep the nose turning to the target until it is ahead (Point at it); stick input cancels. */
  private pointing = false;
  public pointAtTarget(): void {
    this.pointing = true;
  }

  /** The era's world is close enough to land and look up. */
  public eraArrived(): boolean {
    const d = this.era ? DEEP_TIME_SCENES.find((x) => x.id === this.era) : null;
    if (!d) return false;
    const b = this.bodyIndex.get(d.body);
    if (!b) return false;
    const t = this.telemetry;
    if (t.nearest === d.body && t.altKm < Math.max(b.radiusKm * 3, 5000)) return true;
    return t.target === d.body && t.targetDistKm < Math.max(b.radiusKm * 4, 20000);
  }

  /** The jet's orientation (read-only use). */
  public orientation(): THREE.Quaternion {
    return this.flight.quaternion;
  }

  /** Turning to face the Sun (the Face it button), until it is ahead or the pilot takes the stick. */
  private facingSun = false;

  /** Turn the jet smoothly until the Sun is dead ahead. */
  public faceSun(): void {
    this.facingSun = true;
  }

  /**
   * The two belts as places to fly to: a marker in each, on the ecliptic in the jet's direction
   * from the Sun (moved every frame), so "Main asteroid belt" and "Kuiper belt" are targets with a
   * distance and a course like any world.
   */
  private beltMarkers: Array<{ group: THREE.Object3D; rAu: number }> = [];
  private addBeltTargets(): void {
    const base = this.bodies.find((b) => b.noSurface)?.bundle.definition ?? this.bodies[0]?.bundle.definition;
    if (!base) return;
    this.beltMarkers = [];
    for (const [name, rAu] of [['Main asteroid belt', 2.7], ['Kuiper belt', 42]] as const) {
      const group = new THREE.Object3D();
      const radiusKm = 2e5;
      const def = { ...base, id: `belt:${name}`, name, category: 'black_hole' as const, physical: { ...base.physical, meanRadiusKm: radiusKm, colorHex: '#9a8f80' } };
      const info: BodyInfo = {
        name, bundle: { definition: def, bodyGroup: group, surfaceMesh: group as unknown as THREE.Mesh, visualRadius: radiusKm / KM_PER_UNIT } as unknown as PlanetMeshBundle,
        center: new THREE.Vector3(), radius: radiusKm / KM_PER_UNIT, radiusKm, noSurface: true, cloud: true, minor: false,
      };
      this.bodies.push(info);
      this.bodyIndex.set(name, info);
      this.beltMarkers.push({ group, rAu });
    }
  }

  private placeBeltMarkers(): void {
    const p = this.flight.position;
    const d = Math.hypot(p.x, p.z);
    for (const m of this.beltMarkers) {
      const r = m.rAu * UNITS_PER_AU;
      if (d > 1e-6) m.group.position.set((p.x / d) * r, 0, (p.z / d) * r);
      else m.group.position.set(r, 0, 0);
      m.group.updateMatrixWorld(true);
    }
  }

  /** The comet-storm era: comets keep coming across the sky while you fly. */
  public setCometStorm(on: boolean): void {
    this.sky.storm = on;
  }

  /** Local "up" at the jet: away from the centre of the nearest world. */
  public localUp(out: THREE.Vector3): THREE.Vector3 {
    const b = this.bodyIndex.get(this.telemetry.nearest);
    if (!b) return out.set(0, 1, 0);
    return out.subVectors(this.flight.position, b.center).normalize();
  }

  public nearestWorld(): string {
    return this.telemetry.nearest || 'Earth';
  }

  public setTarget(name: string): void {
    if (this.bodyIndex.has(name)) this.target = name;
  }

  public cycleTarget(dir: 1 | -1): void {
    const names = this.bodyNames();
    if (!names.length) return;
    const i = names.indexOf(this.target);
    this.target = names[(i + dir + names.length) % names.length];
  }

  public cycleView(): void {
    const order: JetView[] = ['chase', 'cockpit', 'gopro', 'flyby'];
    this.view = order[(order.indexOf(this.view) + 1) % order.length];
    this.flybyValid = false;
    this.look.set(0, 0);
  }

  public toggleAssist(): void {
    this.assist = !this.assist;
  }

  private indexBodies(bundles: Map<string, PlanetMeshBundle>, extra: PlanetMeshBundle[]): void {
    this.bodies = [];
    this.bodyIndex.clear();
    const all: Array<[string, PlanetMeshBundle]> = [...bundles, ...extra.map((b) => [b.definition.name, b] as [string, PlanetMeshBundle])];
    for (const [name, b] of all) {
      const cat = b.definition.category;
      if (cat === 'spacecraft') continue;
      const info: BodyInfo = {
        name, bundle: b, center: b.bodyGroup.position.clone(), radius: b.visualRadius, radiusKm: b.definition.physical.meanRadiusKm,
        noSurface: cat === 'black_hole',
        cloud: b.definition.id.startsWith('nebula:') || b.definition.id.startsWith('comet:'),
        minor: !(cat === 'star' || cat === 'planet' || cat === 'dwarf_planet' || (cat === 'moon' && !b.definition.minor && b.definition.physical.meanRadiusKm > 100)),
      };
      this.bodies.push(info);
      this.bodyIndex.set(name, info);
    }
  }

  // ------------------------------------------------------------------ input

  private isTyping(e: Event): boolean {
    const t = e.target as HTMLElement | null;
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.isTyping(e)) return;
    const k = e.key.toLowerCase();
    if (!FLY_KEYS.has(k)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat && this.keys.has(k)) return;
    this.keys.add(k);
    this.audio.resume();
    if (k === 'escape') this.exitRequest?.();
    else if (k === 'c') this.cycleView();
    else if (k === 'g') this.toggleAssist();
    else if (k === 't') this.cycleTarget(e.shiftKey ? -1 : 1);
    else if (k === 'n') this.audio.muted = !this.audio.muted;
    else if (k === 'h') this.helpOpen = !this.helpOpen;
    else if (k === 'u') this.fullHud = !this.fullHud;
    else if (k === 'l') this.landMenu = !this.landMenu;
    else if (k === 'b') this.gearDown = !this.gearDown;
    else if (k === '[') this.shiftTime(-1);
    else if (k === ']') this.shiftTime(1);
    else if (k === 'y') this.cycleWeather();
    else if (k === 'k') this.abArmed = !this.abArmed;
    else if (k === 'i') this.invertPitch = !this.invertPitch;
    else if (k === 'x') this.throttle = 0;
    else if (k === 'v') this.cobraQueued = true;
    else if (k >= '0' && k <= '9') this.throttle = k === '0' ? 1 : Number(k) / 10;
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (!FLY_KEYS.has(k)) return;
    // Also stops Space "clicking" a HUD button that kept the focus
    e.preventDefault();
    e.stopPropagation();
    this.keys.delete(k);
  };

  private onBlur = (): void => {
    this.keys.clear();
    this.dragSteer = false;
    this.lookDrag = false;
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (e.target !== this.dom && !(this.dom && e.target instanceof Node && this.dom.contains(e.target) && (e.target as HTMLElement).tagName === 'CANVAS')) return;
    this.audio.resume();
    this.lastMouse.set(e.clientX, e.clientY);
    if (e.button === 0 && this.clickCockpit(e.clientX, e.clientY)) return;
    if (e.button === 2) this.lookDrag = true;
    else if (e.button === 0) {
      this.dragSteer = true;
      this.updateSteer(e.clientX, e.clientY);
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 2) this.lookDrag = false;
    if (e.button === 0) {
      this.dragSteer = false;
      this.steer.set(0, 0);
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.dragSteer) this.updateSteer(e.clientX, e.clientY);
    if (this.lookDrag) {
      this.look.x -= (e.clientX - this.lastMouse.x) * 0.006;
      this.look.y = THREE.MathUtils.clamp(this.look.y - (e.clientY - this.lastMouse.y) * 0.006, -1.3, 1.3);
    }
    this.lastMouse.set(e.clientX, e.clientY);
  };

  private updateSteer(cx: number, cy: number): void {
    const r = this.dom?.getBoundingClientRect();
    if (!r) return;
    const s = Math.min(r.width, r.height) * 0.32;
    const x = (cx - (r.left + r.width / 2)) / s;
    const y = (cy - (r.top + r.height / 2)) / s;
    const dz = (v: number): number => {
      const a = Math.abs(v);
      return a < 0.06 ? 0 : Math.sign(v) * Math.min(1, (a - 0.06) / 0.94);
    };
    this.steer.set(dz(x), dz(y));
  }

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (this.view === 'chase' && e.shiftKey) {
      this.chaseDist = THREE.MathUtils.clamp(this.chaseDist * Math.exp(e.deltaY * 0.001), 9, 80);
      return;
    }
    this.throttle = THREE.MathUtils.clamp(this.throttle - e.deltaY * 0.0006, 0, 1);
  };

  private onContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
  };

  /** Move everything left hanging in the air (smoke, trails) with the world the jet rides. */
  private shiftAir(delta: THREE.Vector3, rot: THREE.Quaternion | null, centre: THREE.Vector3): void {
    this.smoke.shift(delta, rot, centre);
    for (const t of this.trails) t.shift(delta, rot, centre);
    for (const l of this.lastNozzleWorld) {
      if (rot) l.p.sub(centre).applyQuaternion(rot).add(centre);
      else l.p.add(delta);
    }
  }

  /**
   * Radius of a world's drawn surface in the direction of a point: the ellipsoid its surface mesh
   * is scaled to (equatorial radius across, polar radius along its spin axis).
   */
  private surfaceRadius(b: BodyInfo, point: THREE.Vector3): number {
    const mesh = b.bundle.surfaceMesh;
    const ps = mesh.scale.x > 0 ? mesh.scale.y / mesh.scale.x : 1;
    if (Math.abs(ps - 1) < 1e-6) return b.radius;
    mesh.getWorldQuaternion(this.qSurf);
    const d = this.vSurf.subVectors(point, b.center).normalize().applyQuaternion(this.qSurf.invert());
    const R = b.radius;
    return 1 / Math.sqrt((d.x * d.x + d.z * d.z) / (R * R) + (d.y * d.y) / (R * ps * R * ps));
  }
  private qSurf = new THREE.Quaternion();
  private vSurf = new THREE.Vector3();

  /** A click inside the cockpit: operate a control or the destination display if one is under it. */
  private clickCockpit(cx: number, cy: number): boolean {
    if (!this.controls || (this.view !== 'cockpit' && this.view !== 'gopro')) return false;
    const r = this.dom?.getBoundingClientRect();
    if (!r) return false;
    const [nx, ny] = this.toSceneNdc(((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1));
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(nx, ny), this.overlayCamera);
    const a = this.controls.pick(ray);
    if (!a) return false;
    if (a.kind === 'gear') this.gearDown = !this.gearDown;
    else if (a.kind === 'arm') this.abArmed = !this.abArmed;
    else {
      const list = this.destinations();
      const item = list.items[a.index + this.destScroll];
      if (item?.landmark) this.startLanding(item.landmark);
      else if (item?.world) this.setTarget(item.world);
    }
    return true;
  }

  /** What the destination display lists: the landmarks of the world below when close, else the worlds. */
  private destinations(): { title: string; items: Array<{ row: DestinationRow; landmark?: Landmark; world?: string }> } {
    const t = this.telemetry;
    const near = this.bodyIndex.get(t.nearest);
    const lms = near && t.altKm < near.radiusKm * 2 ? landmarksFor(near.name) : [];
    if (near && lms.length) {
      return {
        title: `LAND · ${near.name.toUpperCase()}`,
        items: lms.map((lm) => ({ row: { label: lm.name, sub: lm.viewHeadingDeg !== undefined ? `HDG ${Math.round(lm.viewHeadingDeg)}` : '', active: this.landing?.id === lm.id }, landmark: lm })),
      };
    }
    return {
      title: 'WORLDS',
      items: this.bodyNames().map((n) => ({ row: { label: n, sub: n === this.target ? 'TARGET' : '', active: n === this.target }, world: n })),
    };
  }

  /**
   * How fast the stars should seem to stream past, for the observatory's travel motes (which
   * saturate at 420 units/s): nothing below ~3 km/s, full streaks towards light speed and beyond.
   */
  public perceivedVelocity(out: THREE.Vector3): THREE.Vector3 {
    const v = this.telemetry.speedMps;
    const k = v > 0 ? THREE.MathUtils.smoothstep(Math.log10(v), 3.5, 8.5) : 0;
    if (this.flight.velocity.lengthSq() === 0 || k === 0) return out.set(0, 0, 0);
    return out.copy(this.flight.velocity).normalize().multiplyScalar(420 * k);
  }

  /** Move the clock: the Sun swings across the sky (and the worlds move on in their orbits). */
  public shiftTime(hours: number): void {
    this.shiftHours?.(hours);
  }

  /** Auto (the world's climate) → clear → rain → snow → storm. */
  public cycleWeather(): void {
    const order: WeatherMode[] = ['auto', 'clear', 'rain', 'snow', 'storm'];
    this.weather.mode = order[(order.indexOf(this.weather.mode) + 1) % order.length];
  }

  /** Local solar time (hours) at the point under the jet: noon when the Sun is on the meridian. */
  private localSolarTime(b: BodyInfo, pos: THREE.Vector3): number {
    const pole = this.lv2.set(0, 1, 0).applyQuaternion(b.bundle.bodyGroup.quaternion);
    const u = this.lv3.subVectors(pos, b.center).normalize();
    const s = this.lv4.copy(b.center).negate().normalize();
    u.addScaledVector(pole, -u.dot(pole));
    s.addScaledVector(pole, -s.dot(pole));
    const ang = Math.atan2(pole.dot(new THREE.Vector3().crossVectors(s, u)), s.dot(u));
    return (((12 + THREE.MathUtils.radToDeg(ang) / 15) % 24) + 24) % 24;
  }

  /** Landmarks of the world the jet is near (the landing list). */
  public landmarksHere(): Landmark[] {
    const near = this.telemetry.nearest;
    return near && near !== 'Sun' ? landmarksFor(near) : [];
  }

  /** Engage the landing autopilot to a landmark on a world in the catalogue. */
  public startLanding(lm: Landmark): void {
    if (!this.bodyIndex.has(lm.body)) return;
    this.landing = lm;
    this.landMenu = false;
    this.target = lm.body;
    this.assist = true;
  }

  public cancelLanding(): void {
    this.landing = null;
    this.hop = null;
    this.cutscene = null;
    this.scripted = false;
    this.fade = 0;
    this.siteFix = this.camLift = null;
  }

  /** Where a landmark is now (world render units) and the local up there. */
  private landmarkFrame(lm: Landmark, outSite: THREE.Vector3, outUp: THREE.Vector3): BodyInfo | null {
    const b = this.bodyIndex.get(lm.body);
    if (!b) return null;
    b.bundle.surfaceMesh.updateWorldMatrix(true, false);
    const [x, y, z] = bodyLatLonToLocal(lm.body, lm.lat, lm.lon);
    outSite.set(x, y, z).applyMatrix4(b.bundle.surfaceMesh.matrixWorld);
    outUp.subVectors(outSite, b.bundle.bodyGroup.position).normalize();
    return b;
  }

  /** Start just above a landmark (taking off again after landing there), facing its view. */
  private placeAtLandmark(lm: Landmark): void {
    const site = new THREE.Vector3();
    const up = new THREE.Vector3();
    const b = this.landmarkFrame(lm, site, up);
    if (!b) return;
    const kmNear = b.radiusKm / b.radius;
    this.flight.position.copy(site).addScaledVector(up, 0.4 / kmNear);
    const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(b.bundle.bodyGroup.quaternion);
    const north = pole.addScaledVector(up, -pole.dot(up)).normalize();
    const east = new THREE.Vector3().crossVectors(north, up).normalize();
    const h = THREE.MathUtils.degToRad(lm.viewHeadingDeg ?? 0);
    const fwd = north.multiplyScalar(Math.cos(h)).addScaledVector(east, Math.sin(h)).normalize();
    // Climbing away at 10° nose up
    fwd.addScaledVector(up, 0.18).normalize();
    this.m1.lookAt(new THREE.Vector3(), fwd, up);
    this.flight.quaternion.setFromRotationMatrix(this.m1);
    this.flight.speed = 140 * unitsPerMps(kmNear);
    this.flight.velocity.copy(fwd).multiplyScalar(this.flight.speed);
    this.throttle = 0.55;
    this.anchor = b;
    this.anchorPrev.copy(b.center);
    this.target = b.name;
  }

  /**
   * The landing autopilot: a glide path down to the landmark, wings level to the local horizon,
   * throttle easing back with the distance. Hands over on touchdown; any firm stick input gives
   * the pilot control back.
   */
  /**
   * The landing autopilot, in two acts.
   *
   * The hop: from wherever you are, a fast ballistic arc round the world to a point a few km out
   * from the landmark, in 8 to 22 seconds depending on the distance (high above the air, where
   * nothing holds it back). The jet follows the arc nose-first; the camera stays with it.
   *
   * The landing: a cinematic shot from beside the touchdown point. The jet comes down the glide
   * slope with its gear out, flares, touches down in a puff of tyre smoke, rolls out, and the
   * picture fades into the surface view at that spot. On Earth the touchdown is on the real ground
   * height (src/explorer/Elevation).
   */
  private flyLanding(dt: number, input: FlightInput): void {
    const lm = this.landing;
    if (!lm) return;
    // The pilot takes the stick: hand control back (not during the cutscene: it is already landing)
    if (!this.cutscene && (Math.abs(input.pitch) > 0.35 || Math.abs(input.roll) > 0.35)) {
      this.cancelLanding();
      return;
    }
    const site = this.lv1;
    const up = this.lv2;
    const b = this.landmarkFrame(lm, site, up);
    if (!b) {
      this.cancelLanding();
      return;
    }
    const f = this.flight;
    const kmNear = b.radiusKm / b.radius;
    // The real ground under the landmark
    if (lm.body === 'Earth') {
      site.addScaledVector(up, earthElevation.heightKm(lm.lat, lm.lon, 12) / kmNear);
      // Onto the ground as it is drawn (finer tiles sit a little above the height data), eased so
      // the jet does not jump when sharper tiles arrive mid-approach
      const g = this.drawnGround(b, site, up);
      if (g !== null) this.siteFix = this.siteFix === null ? g : this.siteFix + (g - this.siteFix) * Math.min(1, dt * 3);
      site.addScaledVector(up, this.siteFix ?? 0);
    }
    void earthElevation.ensure(lm.lat - 0.05, lm.lon - 0.05, lm.lat + 0.05, lm.lon + 0.05, 12);
    input.pitch = input.roll = input.yaw = 0;
    this.gearDown = true;

    // Where the final approach begins: 6 km out, 700 m up, on the side the jet comes from
    if (!this.hop && !this.cutscene) {
      const rel = this.lv3.subVectors(f.position, site);
      const horiz = rel.clone().addScaledVector(up, -rel.dot(up));
      const horizKm = horiz.length() * kmNear;
      const back = horizKm > 0.01 ? horiz.normalize() : new THREE.Vector3().crossVectors(up, new THREE.Vector3(0, 1, 0)).normalize();
      const centre = b.center.clone();
      const startR = f.position.distanceTo(centre);
      this.hop = {
        t: 0,
        T: horizKm < 12 ? 0 : THREE.MathUtils.clamp(8 + 4 * Math.log10(1 + horizKm / 100), 8, 22),
        startDir: f.position.clone().sub(centre).normalize(),
        startR,
        back: back.clone(),
        peak: Math.min(600, horizKm * 0.18) / kmNear,
        last: f.position.clone(),
      };
    }
    const hop = this.hop!;
    const approach = site.clone().addScaledVector(hop.back, 6 / kmNear).addScaledVector(up, 0.7 / kmNear);

    if (hop && hop.T > 0 && hop.t < hop.T) {
      // --- Act one: the hop
      hop.t = Math.min(hop.T, hop.t + dt);
      const x = THREE.MathUtils.smoothstep(hop.t / hop.T, 0, 1);
      const centre = b.center;
      const endDir = approach.clone().sub(centre).normalize();
      const endR = approach.distanceTo(centre);
      const dir = new THREE.Vector3().copy(hop.startDir);
      const angle = hop.startDir.angleTo(endDir);
      if (angle > 1e-6) {
        const axis = new THREE.Vector3().crossVectors(hop.startDir, endDir).normalize();
        dir.applyAxisAngle(axis, angle * x);
      } else dir.copy(endDir);
      const rad = THREE.MathUtils.lerp(hop.startR, endR, x) + hop.peak * Math.sin(Math.PI * x);
      const pos = centre.clone().addScaledVector(dir, rad);
      const vel = pos.clone().sub(hop.last).divideScalar(Math.max(dt, 1e-4));
      hop.last.copy(pos);
      f.position.copy(pos);
      f.velocity.copy(vel);
      if (vel.lengthSq() > 1e-12) {
        this.m1.lookAt(new THREE.Vector3(), vel.clone().normalize(), dir);
        this.q1.setFromRotationMatrix(this.m1);
        f.quaternion.slerp(this.q1, 1 - Math.exp(-6 * dt));
      }
      f.rates.set(0, 0, 0);
      input.boost = this.abArmed;
      input.throttle = this.throttle = 1;
      this.scripted = true;
      this.telemetry.landingDistKm = approach.distanceTo(f.position) * kmNear + 6;
      if (hop.t >= hop.T) this.beginCutscene(b, site, up, kmNear);
      return;
    }
    if (!this.cutscene) this.beginCutscene(b, site, up, kmNear);
    this.flyCutscene(dt, input, b, site, up, kmNear);
  }

  private hop: { t: number; T: number; startDir: THREE.Vector3; startR: number; back: THREE.Vector3; peak: number; last: THREE.Vector3 } | null = null;
  private cutscene: {
    t: number; from: THREE.Vector3; back: THREE.Vector3; side: THREE.Vector3; startAltKm: number; startOutKm: number;
    viewBefore: JetView; touched: boolean; hold?: number;
  } | null = null;
  /** Set by the scene: whether the ground near the camera has finished streaming (tiles, heights). */
  public groundReady: (() => boolean) | null = null;
  /** The jet is being flown by the autopilot's script (the physics step is skipped). */
  private scripted = false;
  /** 0..1 fade to black at the end of the landing cutscene. */
  public fade = 0;

  private beginCutscene(b: BodyInfo, site: THREE.Vector3, up: THREE.Vector3, kmNear: number): void {
    const rel = this.flight.position.clone().sub(site);
    const altKm = rel.dot(up) * kmNear;
    const horiz = rel.clone().addScaledVector(up, -rel.dot(up));
    const outKm = Math.max(1.5, horiz.length() * kmNear);
    const back = horiz.lengthSq() > 1e-14 ? horiz.normalize() : (this.hop?.back.clone() ?? new THREE.Vector3(1, 0, 0));
    const side = new THREE.Vector3().crossVectors(up, back).normalize();
    this.cutscene = {
      t: 0, from: this.flight.position.clone(), back, side, startAltKm: Math.max(0.15, Math.min(altKm, 2.5)), startOutKm: Math.min(outKm, 9),
      viewBefore: this.view, touched: false,
    };
    void b;
    void kmNear;
  }

  /** Act two: down the glide slope, flare, touchdown, rollout, fade. */
  private flyCutscene(dt: number, input: FlightInput, b: BodyInfo, site: THREE.Vector3, up: THREE.Vector3, kmNear: number): void {
    const c = this.cutscene!;
    const f = this.flight;
    const groundReady = !this.groundReady || this.groundReady();
    if (c.t > 0 || groundReady || (c.hold = (c.hold ?? 0) + dt) > 5) c.t += dt;
    const APPROACH = 6;
    const ROLL = 3;
    const wheelKm = 0.0025;
    let outKm: number;
    let altKm: number;
    if (c.t < APPROACH) {
      const x = c.t / APPROACH;
      outKm = c.startOutKm * (1 - x);
      // The glide slope, then the flare: the sink rate drops away in the last few seconds
      altKm = wheelKm + (c.startAltKm - wheelKm) * Math.pow(1 - x, 1.7);
    } else {
      // Rollout past the touchdown point, slowing to a stop
      const y = Math.min(1, (c.t - APPROACH) / ROLL);
      outKm = -0.45 * (1 - Math.pow(1 - y, 2));
      altKm = wheelKm;
      if (!c.touched) {
        c.touched = true;
        // Tyre smoke from both main gear, and a jolt
        for (let k = 0; k < 14; k++) {
          const p = f.position.clone().addScaledVector(c.side, ((k % 2) * 2 - 1) * 0.002 / kmNear).addScaledVector(c.back, (Math.random() * 0.01) / kmNear);
          this.smoke.emit(p, 2 + Math.random() * 2, 4, 2.5, 0.55);
        }
        this.shake = Math.max(this.shake, 0.8);
      }
    }
    const pos = site.clone().addScaledVector(c.back, outKm / kmNear).addScaledVector(up, altKm / kmNear);
    const vel = pos.clone().sub(f.position).divideScalar(Math.max(dt, 1e-4));
    f.position.copy(pos);
    f.velocity.copy(vel);
    // Nose along the runway (towards the landmark), a few degrees up on the approach, more in the flare
    const fwd = c.back.clone().negate();
    const flare = c.t < APPROACH ? THREE.MathUtils.smoothstep(c.t, APPROACH - 2.2, APPROACH) : Math.max(0, 1 - (c.t - APPROACH) * 1.5);
    const pitch = (4 + 7 * flare) * (Math.PI / 180);
    const nose = fwd.clone().multiplyScalar(Math.cos(pitch)).addScaledVector(up, Math.sin(pitch)).normalize();
    this.m1.lookAt(new THREE.Vector3(), nose, up);
    this.q1.setFromRotationMatrix(this.m1);
    f.quaternion.slerp(this.q1, 1 - Math.exp(-5 * dt));
    f.rates.set(0, 0, 0);
    input.boost = false;
    input.throttle = this.throttle = c.t < APPROACH ? 0.35 : 0.05;
    this.scripted = true;
    this.telemetry.landingDistKm = Math.max(0, outKm);
    // Fade to black, then stand there
    this.fade = THREE.MathUtils.clamp((c.t - (APPROACH + ROLL - 1)) / 1, 0, 1);
    if (c.t >= APPROACH + ROLL + 0.15) {
      const lm = this.landing!;
      this.landing = null;
      this.hop = null;
      this.cutscene = null;
      this.scripted = false;
      this.fade = 0;
      this.siteFix = this.camLift = null;
      this.landRequest?.(lm);
    }
    void b;
  }

  /** The cutscene camera: low beside the runway, past the touchdown point, watching the jet come in. */
  private placeCutsceneCamera(camera: THREE.PerspectiveCamera): boolean {
    const c = this.cutscene;
    const lm = this.landing;
    if (!c || !lm) return false;
    const site = this.lv1;
    const up = this.lv2;
    const b = this.landmarkFrame(lm, site, up);
    if (!b) return false;
    const kmNear = b.radiusKm / b.radius;
    if (lm.body === 'Earth') site.addScaledVector(up, earthElevation.heightKm(lm.lat, lm.lon, 12) / kmNear + (this.siteFix ?? 0));
    // Beside the runway past the touchdown point, a little above the ground there (on a mountain
    // that may be well below or above the touchdown point): the jet against the land around it
    const cam = site.clone().addScaledVector(c.side, 0.32 / kmNear).addScaledVector(c.back, -0.2 / kmNear);
    const g = lm.body === 'Earth' ? this.drawnGround(b, cam, up) : 0;
    if (g !== null) this.camLift = this.camLift === null ? g : this.camLift + (g - this.camLift) * 0.1;
    cam.addScaledVector(up, Math.max(this.camLift ?? 0, 0) + 0.035 / kmNear);
    camera.position.copy(cam);
    camera.up.copy(up);
    camera.lookAt(this.flight.position);
    // A long lens that keeps the jet framed (about a fifth of the frame) as it comes in
    const d = cam.distanceTo(this.flight.position) * kmNear;
    camera.fov = THREE.MathUtils.clamp(((2 * Math.atan(0.045 / Math.max(d, 1e-3))) * 180) / Math.PI, 1.2, 55);
    return true;
  }

  /** Offsets (render units, along up) from the height data to the ground as drawn, for the landing. */
  private siteFix: number | null = null;
  private camLift: number | null = null;
  private groundRay = new THREE.Raycaster();

  /**
   * Where the drawn ground is under a point: the offset along `up` (render units) from the point to
   * the finest visible terrain tile below or above it, or null where no tile is drawn.
   */
  private drawnGround(b: BodyInfo, at: THREE.Vector3, up: THREE.Vector3): number | null {
    const kmNear = b.radiusKm / b.radius;
    const photo = b.name === 'Earth' ? PhotorealEarth.current?.raycastTarget() ?? null : null;
    const tiles: THREE.Object3D[] = photo ? [photo] : [];
    if (!photo) {
      b.bundle.surfaceMesh.traverse((o) => {
        if (o.name.startsWith('tile_') && o.visible && o.parent?.visible !== false) tiles.push(o);
      });
    }
    if (tiles.length === 0) return null;
    this.groundRay.set(at.clone().addScaledVector(up, 12 / kmNear), up.clone().negate());
    this.groundRay.far = 24 / kmNear;
    const zOf = (o: THREE.Object3D): number => Number(o.name.slice(5).split('/')[0]);
    const hit = this.groundRay.intersectObjects(tiles, !!photo).sort((p, q) => zOf(q.object) - zOf(p.object))[0];
    return hit ? hit.point.sub(at).dot(up) : null;
  }

  private lv1 = new THREE.Vector3();
  private lv2 = new THREE.Vector3();
  private lv3 = new THREE.Vector3();
  private lv4 = new THREE.Vector3();

  private readInput(dt: number): FlightInput {
    const k = this.keys;
    const axis = (neg: boolean, pos: boolean): number => (pos ? 1 : 0) - (neg ? 1 : 0);
    let pitch = axis(k.has('w') || k.has('arrowup'), k.has('s') || k.has('arrowdown'));
    let roll = axis(k.has('a') || k.has('arrowleft'), k.has('d') || k.has('arrowright'));
    let yaw = axis(k.has('q'), k.has('e'));
    // Mouse drag: a virtual stick around the screen centre (drag up = nose up)
    pitch += -this.steer.y - this.touchSteer.y;
    roll += this.steer.x + this.touchSteer.x;
    if (k.has('r')) this.throttle = Math.min(1, this.throttle + dt * 0.45);
    if (k.has('f')) this.throttle = Math.max(0, this.throttle - dt * 0.45);
    let boost = (k.has(' ') || k.has('shift') || this.touchBoost) && this.abArmed;

    // Gamepad (standard mapping)
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p || !p.connected) continue;
      const dz = (v: number): number => (Math.abs(v) < 0.12 ? 0 : v);
      roll += dz(p.axes[0] ?? 0);
      pitch += dz(p.axes[1] ?? 0); // stick back (positive) = nose up
      yaw += dz(p.axes[2] ?? 0);
      const rt = p.buttons[7]?.value ?? 0;
      const lt = p.buttons[6]?.value ?? 0;
      this.throttle = THREE.MathUtils.clamp(this.throttle + (rt - lt) * dt * 0.6, 0, 1);
      if (p.buttons[0]?.pressed) boost = true;
      this.aligning = this.aligning || !!p.buttons[1]?.pressed;
      break;
    }
    if (this.invertPitch) pitch = -pitch;
    this.aligning = k.has('z') || this.touchAlign || this.aligning;
    return {
      pitch: THREE.MathUtils.clamp(pitch, -1, 1),
      roll: THREE.MathUtils.clamp(roll, -1, 1),
      yaw: THREE.MathUtils.clamp(yaw, -1, 1),
      throttle: this.throttle,
      boost,
      assist: this.assist,
      cobra: this.cobraQueued,
    };
  }

  // ------------------------------------------------------------------ frame

  /**
   * Advance the jet and place the camera. Called by the scene each frame after the ephemerides
   * have moved the worlds and before anything is drawn.
   */
  public update(dt: number, timeSec: number, camera: THREE.PerspectiveCamera, width: number, height: number, toScreen: NdcToScreen): void {
    if (!this.active || !this.model) return;
    dt = Math.min(dt, 0.05);
    const f = this.flight;

    // --- Worlds: where they are now, the nearest surface, the dominant frame
    let nearest: BodyInfo | null = null;
    let nearestAlt = Infinity;
    let dominant: BodyInfo | null = null;
    let dominance = 0;
    for (const b of this.bodies) {
      if (b.noSurface) {
        // Drawn inside another group (the galaxy): its world position, not its local one. Close in
        // it is what the jet is near (the drive slows on approach, and it cannot be flown into)
        b.bundle.bodyGroup.getWorldPosition(b.center);
        const altBH = b.center.distanceTo(f.position) - b.radius;
        if (altBH < nearestAlt) {
          nearestAlt = altBH;
          nearest = b;
        }
        continue;
      }
      b.center.copy(b.bundle.bodyGroup.position);
      const d = b.center.distanceTo(f.position);
      const alt = d - b.radius;
      if (alt < nearestAlt) {
        nearestAlt = alt;
        nearest = b;
      }
      const s = b.radius / Math.max(d, 1e-9);
      if (s > dominance && !b.minor) {
        dominance = s;
        dominant = b;
      }
    }
    if (!nearest) return;

    // --- Ride the dominant world: its orbit, and close in, its spin
    const ride = dominant && dominance > 1 / 400 ? dominant : null;
    if (ride !== this.anchor) {
      this.anchor = ride;
      if (ride) this.anchorPrev.copy(ride.center);
      this.spinValid = false;
    }
    if (ride) {
      const delta = this.v1.subVectors(ride.center, this.anchorPrev);
      f.position.add(delta);
      // Smoke and trails hang in the same air: they move with the world too
      this.shiftAir(delta, null, ride.center);
      this.anchorPrev.copy(ride.center);
      const rideAlt = f.position.distanceTo(ride.center) - ride.radius;
      if (rideAlt < ride.radius * 0.35) {
        ride.bundle.surfaceMesh.updateWorldMatrix(true, false);
        ride.bundle.surfaceMesh.matrixWorld.decompose(this.v2, this.q1, this.v3);
        if (this.spinValid) {
          this.q2.copy(this.spinPrev).invert().premultiply(this.q1); // delta = cur * prev⁻¹
          const rel = this.v2.subVectors(f.position, ride.center).applyQuaternion(this.q2);
          f.position.copy(ride.center).add(rel);
          f.velocity.applyQuaternion(this.q2);
          f.quaternion.premultiply(this.q2);
          this.chaseQuat.premultiply(this.q2);
          this.shiftAir(this.v3.set(0, 0, 0), this.q2, ride.center);
        }
        this.spinPrev.copy(this.q1);
        this.spinValid = true;
      } else {
        this.spinValid = false;
      }
    }

    // --- Environment: altitude, scale, air
    const kmNear = nearest.radiusKm / nearest.radius; // km per unit at that world's surface
    // Worlds are drawn oblate (Earth 1/298, Saturn 1/10): measure height above that shape, not a sphere
    const surfR = this.surfaceRadius(nearest, f.position);
    nearestAlt = f.position.distanceTo(nearest.center) - surfR;
    const altUnits = Math.max(0, nearestAlt);
    this.lastAltUnits = Math.max(altUnits, 1e-6);
    const altKm = altUnits * kmNear;
    const kmPerUnit = localKmPerUnit(altUnits, nearest.radius, nearest.radiusKm);
    const air = AIR[nearest.name];
    const density = air ? airDensity(altKm, air.scaleHeightKm, air.topKm, air.surfaceDensity) : 0;

    // --- Fly
    const input = this.readInput(dt);
    this.placeBeltMarkers();
    // Face it: swing the nose round to the Sun, gently; any stick input hands control back
    if (this.facingSun) {
      if (Math.abs(input.pitch) + Math.abs(input.roll) + Math.abs(input.yaw) > 0.05) {
        this.facingSun = false;
      } else {
        const toSun = this.v1.copy(f.position).negate().normalize();
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(f.quaternion);
        const want = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), toSun, up));
        f.quaternion.slerp(want, 1 - Math.exp(-1.6 * dt));
        f.rates.set(0, 0, 0);
        if (f.quaternion.angleTo(want) < 0.02) this.facingSun = false;
      }
    }
    const tgt = this.bodyIndex.get(this.target) ?? null;
    if (this.pointing && tgt) {
      if (Math.abs(input.pitch) + Math.abs(input.roll) + Math.abs(input.yaw) > 0.05) this.pointing = false;
      else {
        this.aligning = true;
        const ahead = this.v1.subVectors(tgt.center, f.position).normalize();
        if (f.forward(this.v2).angleTo(ahead) < 0.03) this.pointing = false;
      }
    }
    if (this.aligning && tgt) {
      const want = this.v1.subVectors(tgt.center, f.position).normalize();
      const up = this.v2.subVectors(f.position, nearest.center).normalize();
      this.m1.lookAt(new THREE.Vector3(), want, Math.abs(want.dot(up)) > 0.98 ? this.v3.set(0, 1, 0) : up);
      this.q1.setFromRotationMatrix(this.m1);
      f.quaternion.rotateTowards(this.q1, 1.6 * dt);
      input.pitch = input.roll = input.yaw = 0;
    }
    this.aligning = false;
    this.scripted = false;
    if (this.landing) {
      this.flyLanding(dt, input);
      // Touchdown hands over to the surface view (the jet has exited): stop this frame here, or
      // the rest of it would publish the jet as active again
      if (!this.active) return;
    }
    // Gear down in air: the drag holds the jet to a slow approach speed
    if (this.gearDown && density > 0.02) input.throttle = Math.min(input.throttle, 0.45);
    this.lastInput = input;
    // Belts do not hold the drive back: the main belt is 180 million km deep, so crossing it is a
    // matter of speed. The rocks show (and can be hit) once you slow down inside one.
    // The autopilot's hop and landing are scripted: no physics step this frame
    if (!this.scripted) f.step(dt, input, { altitudeUnits: altUnits, kmPerUnit, airDensity: density });
    this.cobraQueued = false;
    // The edge of the drawn universe (just past the Milky Way): no flying off into nothing
    const fromSun = f.position.length();
    if (fromSun > UNIVERSE_RADIUS_UNITS) {
      const out = this.v1.copy(f.position).divideScalar(fromSun);
      f.position.copy(out).multiplyScalar(UNIVERSE_RADIUS_UNITS);
      const vr = f.velocity.dot(out);
      if (vr > 0) f.velocity.addScaledVector(out, -vr);
      f.speed = f.velocity.length();
    }

    // --- Contact: never through a surface (the Sun gets a wide berth)
    const isSun = nearest.bundle.definition.category === 'star';
    const clearance = isSun ? nearest.radius * 0.08 : nearest.cloud ? nearest.radius * 0.002 : nearest.noSurface ? nearest.radius * 0.5 : 0.035 / kmNear;
    const vMps = 1 / unitsPerMps(kmPerUnit);
    const hit = resolveSurfaceContact(f.position, f.velocity, nearest.center, this.surfaceRadius(nearest, f.position), clearance) * vMps;
    if (hit > 0) {
      f.speed = f.velocity.length();
      this.shake = Math.min(1.5, this.shake + Math.min(1, hit / 400));
    }

    // --- Warnings and heat
    const up = this.v1.subVectors(f.position, nearest.center).normalize();
    const radialMps = f.velocity.dot(up) * vMps;
    const tti = radialMps < 0 ? (altKm * 1000) / -radialMps : Infinity;
    const speedMps = f.velocity.length() * vMps;
    const sunDist = f.position.length();
    const sun = this.bodyIndex.get('Sun');
    const sunRadius = sun ? sun.radius : 262;
    const heatTarget = isSun ? 1 - THREE.MathUtils.smoothstep(nearestAlt / sunRadius, 0.08, 1.5) : 0;
    const plasma = density > 0 ? Math.min(1, density * Math.pow(speedMps / 2200, 3)) : 0;
    this.heat += (Math.max(heatTarget, plasma) - this.heat) * (1 - Math.exp(-3 * dt));
    this.warning = tti < 6 && altKm < nearest.radiusKm * 0.3 && !isSun ? 1 : heatTarget > 0.4 ? 2 : 0;

    // Sonic boom vapour cone on the way through Mach 1
    const sound = air?.soundMps ?? 343;
    const mach = density > 0 ? speedMps / sound : 0;
    const supersonic = mach > 1;
    if (supersonic !== this.wasSupersonic && density > 0.15 && mach > 0.9 && mach < 1.2) this.shock.triggerVapourCone();
    this.wasSupersonic = supersonic;

    // --- Camera
    this.placeCamera(dt, camera, kmPerUnit, density, timeSec);
    const mpu = kmPerUnit * 1000; // metres per render unit

    // Overlay: the jet in metres around the camera
    const jetRel = this.v2.subVectors(f.position, camera.position).multiplyScalar(mpu);
    this.jetGroup.position.copy(jetRel);
    this.jetGroup.quaternion.copy(f.quaternion);
    this.overlayCamera.position.set(0, 0, 0);
    this.overlayCamera.quaternion.copy(camera.quaternion);
    this.overlayCamera.fov = camera.fov;
    this.overlayCamera.aspect = camera.aspect;
    // Inside (cockpit, GoPro) the glass and the pilot are centimetres away: a near plane that does not clip them
    this.overlayCamera.near = this.view === 'cockpit' || this.view === 'gopro' ? 0.02 : 0.2;
    this.overlayCamera.updateProjectionMatrix();
    this.overlayCamera.updateMatrixWorld();
    this.model.setPilotVisible(this.view !== 'cockpit');
    this.model.crew.visible = this.view !== 'cockpit';
    // The GoPro rides on the pilot's helmet: his own arms, chest and the panel in view, not his head
    if (this.model.crewHead) this.model.crewHead.visible = this.view !== 'gopro';
    if (this.cockpit) this.cockpit.group.visible = this.view === 'cockpit' && !this.model.hasInterior;

    // --- Light: the Sun (eclipsed by the nearest world), planet-shine, the cube capture
    const sunDir = this.v3.copy(f.position).negate().normalize();
    let lit = 1;
    if (!isSun) {
      const toBody = this.v1.subVectors(nearest.center, f.position);
      const along = toBody.dot(sunDir);
      if (along > 0) {
        const perp = Math.sqrt(Math.max(0, toBody.lengthSq() - along * along));
        const penumbra = nearest.radius * 0.02 + along * (sunRadius / Math.max(sunDist, 1));
        lit = THREE.MathUtils.smoothstep(perp, nearest.radius - penumbra, nearest.radius + penumbra);
      }
    }
    // --- The sky's own events: whichever world or moon covers the Sun most makes the eclipse
    {
      const sunAngle = Math.asin(Math.min(1, sunRadius / Math.max(sunDist, 1e-9)));
      let best: BodyInfo | null = null;
      let bestT = -1;
      for (const b of this.bodies) {
        if (b.noSurface || b.bundle.definition.category === 'star') continue;
        const to = this.v1.subVectors(b.center, camera.position);
        const d = to.length();
        if (d >= sunDist || d <= 1e-9) continue;
        const ang = Math.asin(Math.min(1, b.radius / d));
        const t = (ang - to.angleTo(sunDir)) / Math.max(sunAngle, 1e-9);
        if (t > bestT) {
          bestT = t;
          best = b;
          this.skyOcc.dir.copy(to).normalize();
          this.skyOcc.angle = ang;
          this.skyOcc.name = b.name;
        }
      }
      const up = this.v1.subVectors(f.position, nearest.center).normalize();
      this.sky.update(dt, this.overlayCamera, {
        sunDir, sunAngle, occluder: best ? this.skyOcc : null, air: Math.min(1, density * 8), up,
        sunElevation: up.dot(sunDir), deepSpace: !isSun && altKm > nearest.radiusKm * 30, sunInView: this.flare.inView,
        overAir: !!AIR[nearest.name] && density === 0 && altKm < 900,
      });
      lit = Math.min(lit, this.sky.sunVisible);
      this.lastLit = lit;
    }
    const solar = Math.min(2.2, Math.max(0.35, Math.pow(56355 / Math.max(sunDist, 1000), 0.5)));
    this.sun.intensity = 3.0 * solar * lit;
    this.sun.position.copy(jetRel).addScaledVector(sunDir, 40);
    this.sun.target.position.copy(jetRel);
    this.sun.target.updateMatrixWorld();
    const bodyUp = this.v1.subVectors(f.position, nearest.center).normalize();
    const phase = 0.5 + 0.5 * bodyUp.dot(sunDir);
    const solid = Math.min(1, Math.pow(nearest.radius / Math.max(nearest.radius + altUnits, 1e-9), 2));
    const col = nearest.bundle.definition.physical.colorHex ?? '#8899aa';
    this.planetShine.groundColor.set(col);
    this.planetShine.color.set(0x0b0d14);
    this.planetShine.position.copy(bodyUp);
    this.planetShine.intensity = (isSun ? 0 : 1.4) * solid * phase * solar;
    const inside = this.view === 'cockpit' || this.view === 'gopro';
    // Inside: instrument flood and the light bouncing round the tub, so the cockpit reads
    this.cockpitLight.intensity = inside ? 1.6 : 0;
    this.ambient.intensity = inside ? 0.32 : 0.06;
    // Sunlight on the optics: the flare in every view, the canopy scratches from inside.
    // A low Sun seen through air is warm (golden hour); in vacuum it stays white.
    const elevation = bodyUp.dot(sunDir);
    this.flare.warmth = density > 0 ? Math.min(1, density * 8) * (1 - THREE.MathUtils.smoothstep(elevation, 0, 0.35)) : 0;
    this.flare.update(this.overlayCamera, sunDir, lit * (density > 0 ? 0.7 : 1) * (inside ? 1 : 0.75) * (1 + this.sky.flareBoost));
    if (!this.glints && this.model.canopyMesh) this.glints = new CanopyGlints(this.model.canopyMesh);
    this.glints?.update(sunDir, inside ? lit : 0);

    // The sky from inside the air is the world's own atmosphere shell (AtmosphereShader)

    // --- Engines, motes, trails, plasma
    const boost = f.boosting ? 1 : 0;
    this.model.update(timeSec, this.throttle, boost, 1 - Math.min(1, density * 8));
    this.shock.update(dt, timeSec, this.heat * (isSun ? 0.6 : 1));
    // Motes stream past at the jet's speed relative to the air (or to the world it rides)
    this.field.update(dt, this.v1.copy(f.velocity).multiplyScalar(mpu), Math.min(1, density * 3), 0.25 + 0.75 * lit);
    const camFwd = this.v2.set(0, 0, -1).applyQuaternion(camera.quaternion);
    const vapour = density > 0.02 ? THREE.MathUtils.smoothstep(f.gLoad, 3.5, 7.5) * Math.min(1, density * 3) : 0;
    const contrail = density > 0.08 && density < 0.45 && altKm > 7 ? Math.min(1, this.throttle * 1.4) : 0;
    const emit = (local: THREE.Vector3): THREE.Vector3 =>
      this.v3.copy(local).applyQuaternion(f.quaternion).divideScalar(mpu).add(f.position);
    this.trails[0].update(dt, emit(this.model.wingtips[0]), vapour, camera.position, mpu, camFwd);
    this.trails[1].update(dt, emit(this.model.wingtips[1]), vapour, camera.position, mpu, camFwd);
    this.trails[2].update(dt, emit(this.model.nozzles[0]), contrail, camera.position, mpu, camFwd);
    this.trails[3].update(dt, emit(this.model.nozzles[1]), contrail, camera.position, mpu, camFwd);

    // Exhaust smoke: only where there is air to hold it; a burst when the afterburner lights
    if (density > 0.02 && speedMps < 3000) {
      const lightOff = f.boosting && !this.wasBoosting;
      const haze = (0.05 + 0.1 * this.throttle) * (f.boosting ? 2.6 : 1) * Math.min(1, density * 3);
      for (let n = 0; n < this.model.nozzles.length; n++) {
        const now = emit(this.model.nozzles[n]).clone();
        const last = this.lastNozzleWorld[n];
        if (!last.valid) {
          last.p.copy(now);
          last.valid = true;
        }
        // Fill the path flown this frame so the trail has no gaps at speed (≤ 4 m apart)
        const gapM = last.p.distanceTo(now) * mpu;
        const steps = Math.min(8, Math.max(1, Math.ceil(gapM / 4)));
        for (let k = 1; k <= steps; k++) {
          const p = this.v1.lerpVectors(last.p, now, k / steps);
          this.smoke.emit(p, this.model.length * 0.05, 3.2, 2.6, haze);
        }
        if (lightOff) for (let k = 0; k < 6; k++) this.smoke.emit(now, this.model.length * 0.09, 7, 3.2, 0.42);
        last.p.copy(now);
      }
    } else {
      for (const l of this.lastNozzleWorld) l.valid = false;
    }
    this.wasBoosting = f.boosting;
    // Weather in the air the jet is in
    {
      const nb = nearest.bundle;
      nb.surfaceMesh.updateWorldMatrix(true, false);
      const local = this.v1.copy(f.position).applyMatrix4(this.m1.copy(nb.surfaceMesh.matrixWorld).invert());
      const ll = localToLatLon(local.x, local.y, local.z);
      const upN = this.v2.subVectors(f.position, nearest.center).normalize();
      const sunUp = Math.max(0, upN.dot(this.v3.copy(f.position).negate().normalize()));
      const w = this.weather.update(dt, timeSec, {
        world: nearest.name, latDeg: ll.lat, lonDeg: ll.lon, altKm, airDensity: density,
        daylight: THREE.MathUtils.smoothstep(sunUp, -0.05, 0.25) * lit,
        airVelMps: this.lv1.copy(f.velocity).multiplyScalar(mpu), up: upN, camera, inside: this.view === 'cockpit' || this.view === 'gopro',
        hourIndex: Math.floor(timeSec / 900),
      });
      this.shake = Math.max(this.shake, w.shake * (0.6 + 0.4 * Math.sin(timeSec * 7.3)));
      this.ambient.intensity += w.flash * 2.5;
      this.telemetry.weather = w.label;
      this.telemetry.localTime = this.localSolarTime(nearest, f.position);
    }

    // Asteroid belts: real rocks around the jet when it is in one (and slow enough to see them)
    // Not around planets: their neighbourhoods are swept clear (and Neptune sits on the Kuiper belt's edge)
    this.asteroids.update(timeSec, camera.position, speedMps / 1000, !!this.anchor && this.anchor.bundle.definition.category !== 'star');
    for (const r of this.asteroids.near) {
      const c = this.v1.set(r.x / KM_PER_UNIT, r.y / KM_PER_UNIT, r.z / KM_PER_UNIT);
      const hitRock = resolveSurfaceContact(f.position, f.velocity, c, (r.rKm * 0.85) / KM_PER_UNIT, 0.025 / KM_PER_UNIT);
      if (hitRock > 0) {
        f.speed = f.velocity.length();
        this.shake = Math.min(1.5, this.shake + 0.8);
      }
    }
    const pxScale = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    this.smoke.update(dt, camera.position, mpu, pxScale, lit);

    // Speed blur: how fast the ground sweeps through the view (speed over height), boost, and
    // the drive in deep space; centred where the jet is actually going
    {
      const sweep = speedMps / Math.max(altKm * 1000, 60);
      const drive = speedMps > 2e4 ? Math.min(0.03, Math.log10(speedMps / 2e4) * 0.012) : 0;
      const k = Math.min(0.1, 0.035 * Math.log2(1 + sweep * 4) + (f.boosting ? 0.025 : 0) + drive);
      const dir = f.velocity.lengthSq() > 0 ? this.v1.copy(f.velocity).normalize() : f.forward(this.v1);
      const v = dir.applyQuaternion(this.q1.copy(camera.quaternion).invert());
      const tn = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const front = v.z < -0.05;
      this.telemetry.blur = front ? k : k * 0.4;
      this.telemetry.blurNdc.x = front ? THREE.MathUtils.clamp(v.x / (-v.z * tn * camera.aspect), -1, 1) : 0;
      this.telemetry.blurNdc.y = front ? THREE.MathUtils.clamp(v.y / (-v.z * tn), -1, 1) : 0;
    }

    this.audio.update(timeSec, {
      throttle: this.throttle, boost, air: density, speedMps, inside: this.view === 'cockpit' || this.view === 'gopro', warning: this.warning, gLoad: f.gLoad,
    });

    // --- Telemetry for the HUD, then the cockpit displays
    this.fillTelemetry(camera, width, height, toScreen, nearest, kmPerUnit, density, mach, speedMps, timeSec, tgt);
    this.hudGlass?.update(this.telemetry, this.view === 'cockpit' || this.view === 'gopro');
    if (this.controls) {
      const dest = this.destinations();
      const active = dest.items.findIndex((d) => d.row.active);
      this.destScroll = THREE.MathUtils.clamp(active - 4, 0, Math.max(0, dest.items.length - 9));
      const rows = dest.items.slice(this.destScroll, this.destScroll + 9).map((d) => d.row);
      const inp = this.lastInput;
      this.controls.update(dt, timeSec, inp.pitch, inp.roll, this.throttle, this.gearDown, this.abArmed, dest.title, rows, this.view === 'cockpit' || this.view === 'gopro');
    }
    if (this.cockpit?.group.visible) {
      if (!this.navPoints.length) {
        for (const n of NAV_WORLDS) {
          const b = this.bodyIndex.get(n);
          if (b) this.navPoints.push({ name: n, x: 0, z: 0, colour: b.bundle.definition.physical.colorHex ?? '#aab' });
        }
      }
      for (const p of this.navPoints) {
        const b = this.bodyIndex.get(p.name);
        if (b) {
          p.x = b.center.x;
          p.z = b.center.z;
        }
      }
      this.cockpit.update(this.telemetry, this.navPoints, { x: f.position.x, z: f.position.z }, tgt ? { x: tgt.center.x, z: tgt.center.z } : null);
    }
  }

  private placeCamera(dt: number, camera: THREE.PerspectiveCamera, kmPerUnit: number, density: number, timeSec: number): void {
    const f = this.flight;
    const upm = 1 / (kmPerUnit * 1000); // units per metre
    const fwd = f.forward(this.v1);
    // The landing cutscene has its own camera beside the runway
    if (this.placeCutsceneCamera(camera)) {
      camera.near = 2e-6;
      camera.updateProjectionMatrix();
      return;
    }
    this.shake = Math.max(0, this.shake - dt * 1.5);
    const speedMps = f.velocity.length() / unitsPerMps(kmPerUnit);
    const buffet = density > 0 ? Math.min(0.6, density * (speedMps / 900) ** 2 * 0.4) : 0;
    const shakeAmp = (this.shake + buffet + (f.boosting ? 0.35 : 0)) * 0.004;
    this.fovKick += ((f.boosting ? 14 : 0) + Math.min(8, Math.log10(1 + speedMps / 1000) * 1.6) - this.fovKick) * (1 - Math.exp(-2.5 * dt));

    // Under G the head sinks into the seat and tips forward a touch
    const g = this.flight.gLoad;
    this.headDrop += (THREE.MathUtils.clamp((g - 1) * 0.012, -0.03, 0.09) - this.headDrop) * (1 - Math.exp(-6 * dt));
    if (this.view === 'cockpit') {
      // The pilot's eyes: the head lags the airframe's rotation a little, as necks do
      this.headQuat.slerp(f.quaternion, 1 - Math.exp(-14 * dt));
      if (this.headQuat.angleTo(f.quaternion) > 0.25) this.headQuat.copy(f.quaternion);
      const eye = this.v2.copy(this.model!.eye).add(this.v3.set(0, -this.headDrop, 0)).applyQuaternion(f.quaternion).multiplyScalar(upm);
      camera.position.copy(f.position).add(eye);
      camera.quaternion.copy(this.headQuat);
      camera.rotateY(this.look.x);
      camera.rotateX(this.look.y - this.headDrop * 0.6);
      camera.fov = 74 + this.fovKick * 0.6;
    } else if (this.view === 'gopro') {
      // A GoPro on the side of the pilot's helmet, at eye height: the pilot's own point of view. It
      // turns with the head (which lags the airframe a little, as necks do) and sinks under G
      this.headQuat.slerp(f.quaternion, 1 - Math.exp(-14 * dt));
      if (this.headQuat.angleTo(f.quaternion) > 0.25) this.headQuat.copy(f.quaternion);
      const mount = this.v2.copy(this.model!.eye).add(this.v3.set(0.04, 0.02 - this.headDrop, 0.02)).applyQuaternion(f.quaternion).multiplyScalar(upm);
      camera.position.copy(f.position).add(mount);
      camera.quaternion.copy(this.headQuat);
      camera.rotateY(this.look.x);
      camera.rotateX(this.look.y - 0.1 - this.headDrop * 0.6);
      // Rigid mount: the airframe's buzz reaches the camera (more with power and afterburner)
      const buzz = (0.0004 + this.throttle * 0.0007 + (f.boosting ? 0.0012 : 0)) * (1 + this.shake);
      camera.rotateX(Math.sin(timeSec * 97) * Math.sin(timeSec * 13.1) * buzz);
      camera.rotateY(Math.sin(timeSec * 83 + 1.7) * buzz * 0.8);
      // Rendered wide (120 degrees tall); the lens folds it into an action camera's picture
      camera.fov = 120 + this.fovKick * 0.4;
    } else if (this.view === 'chase') {
      // The camera lags the airframe a little so turns show; drag right mouse to look around
      this.chaseQuat.slerp(f.quaternion, 1 - Math.exp(-5.5 * dt));
      if (!this.lookDrag) this.look.multiplyScalar(Math.exp(-1.5 * dt));
      this.q1.setFromEuler(new THREE.Euler(this.look.y * 0.8 - 0.06, this.look.x, 0, 'YXZ'));
      const q = this.q2.copy(this.chaseQuat).multiply(this.q1);
      const off = this.v2.set(0, this.chaseDist * 0.17, this.chaseDist).applyQuaternion(q).multiplyScalar(upm);
      camera.position.copy(f.position).add(off);
      camera.quaternion.copy(q);
      camera.fov = 58 + this.fovKick;
    } else {
      // Fly-by: a fixed point ahead and to the side; the jet roars past and the camera tracks it
      const dir = f.velocity.lengthSq() > 0 ? this.v2.copy(f.velocity).normalize() : this.v2.copy(fwd);
      const span = Math.max(60, Math.min(4000, speedMps * 2.2)) * upm;
      const rel = this.v3.subVectors(f.position, this.flybyPoint);
      // Re-place once the jet is well past (or the camera has fallen far behind)
      if (!this.flybyValid || rel.dot(dir) > span * 0.9 || rel.length() > span * 3) {
        const jetUp = new THREE.Vector3(0, 1, 0).applyQuaternion(f.quaternion);
        const side = new THREE.Vector3().crossVectors(dir, jetUp).normalize();
        this.flybyPoint.copy(f.position).addScaledVector(dir, span).addScaledVector(side, span * 0.12).addScaledVector(jetUp, span * 0.04);
        this.flybyValid = true;
      }
      camera.position.copy(this.flybyPoint);
      this.m1.lookAt(camera.position, f.position, new THREE.Vector3(0, 1, 0).applyQuaternion(f.quaternion));
      camera.quaternion.setFromRotationMatrix(this.m1);
      const d = camera.position.distanceTo(f.position) / upm;
      camera.fov = THREE.MathUtils.clamp(2 * THREE.MathUtils.radToDeg(Math.atan(30 / Math.max(d, 1))), 8, 60);
    }
    if (shakeAmp > 0) {
      const t = timeSec * 31;
      camera.rotateX(Math.sin(t) * Math.sin(t * 0.37) * shakeAmp);
      camera.rotateY(Math.sin(t * 1.3 + 1) * Math.sin(t * 0.29) * shakeAmp);
    }
    // Depth range for the world: near follows the height of the camera over the ground
    camera.near = Math.max(1e-6, Math.min(0.04, this.lastAltUnits * 0.05));
    camera.far = Math.max(2.4e8, camera.position.length() * 2.5);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  /** Re-render the cube map that lights and reflects the jet. Called inside the floating-origin draw. */
  public captureEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    if (!this.active) return;
    if (this.envFrame++ % perf.settings.envEvery !== 0) return;
    const altUnits = Math.max(1e-6, this.lastAltUnits);
    for (const c of this.envCamera.children as THREE.PerspectiveCamera[]) {
      c.near = Math.max(1e-6, altUnits * 0.02);
      c.far = 2.4e8;
      c.updateProjectionMatrix();
    }
    this.envCamera.position.set(0, 0, 0);
    this.envCamera.updateMatrixWorld(true);
    // Leave the renderer exactly as found: a leaked target, viewport or clear state would show as a
    // black frame every time the cube refreshes
    const target = renderer.getRenderTarget();
    const viewport = renderer.getViewport(new THREE.Vector4());
    const scissor = renderer.getScissor(new THREE.Vector4());
    const scissorTest = renderer.getScissorTest();
    const autoClear = renderer.autoClear;
    try {
      renderer.autoClear = true;
      this.envCamera.update(renderer, scene);
      this.envTarget.texture.needsPMREMUpdate = true;
    } finally {
      renderer.setRenderTarget(target);
      renderer.setViewport(viewport);
      renderer.setScissor(scissor);
      renderer.setScissorTest(scissorTest);
      renderer.autoClear = autoClear;
    }
  }

  /**
   * True distance from the jet to a world's surface, km. The drawn worlds may be enlarged, which
   * pads the drawn space between them; the ephemeris has the real centre-to-centre distance. The
   * jet sits off its nearest world at the true radius plus its altitude, in the direction it has
   * in the scene (directions are the same in both).
   */
  private trueGapKm(target: BodyInfo, nearest: BodyInfo, altKm: number): number {
    if (target === nearest) return altKm;
    const tp = this.physicalKm(target.name);
    const np = this.physicalKm(nearest.name);
    const dp = Math.hypot(tp[0] - np[0], tp[1] - np[1], tp[2] - np[2]);
    const toT = this.v1.subVectors(target.center, nearest.center);
    const toJ = this.v2.subVectors(this.flight.position, nearest.center);
    const cos = toT.lengthSq() > 0 && toJ.lengthSq() > 0 ? toT.normalize().dot(toJ.normalize()) : 1;
    const lp = nearest.radiusKm + altKm;
    const d = Math.sqrt(Math.max(0, dp * dp + lp * lp - 2 * dp * lp * cos));
    return Math.max(0, d - target.radiusKm);
  }

  private projectDir(dir: THREE.Vector3, camera: THREE.PerspectiveCamera, toScreen: NdcToScreen): { x: number; y: number; on: boolean; angle: number } | null {
    const v = this.v3.copy(dir).applyQuaternion(this.q1.copy(camera.quaternion).invert());
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const behind = v.z >= 0;
    const nx = v.x / (-v.z * t * camera.aspect);
    const ny = v.y / (-v.z * t);
    const angle = Math.atan2(v.y, v.x);
    if (behind || Math.abs(nx) > 1 || Math.abs(ny) > 1) return { x: 0, y: 0, on: false, angle };
    const p = toScreen(nx, ny);
    return p ? { x: p.x, y: p.y, on: true, angle } : { x: 0, y: 0, on: false, angle };
  }

  private fillTelemetry(
    camera: THREE.PerspectiveCamera, width: number, height: number, toScreen: NdcToScreen, nearest: BodyInfo,
    kmPerUnit: number, density: number, mach: number, speedMps: number, timeSec: number, tgt: BodyInfo | null
  ): void {
    const f = this.flight;
    const t = this.telemetry;
    // Shown altitude: the world's own scale close in, the true scale far out
    const lift = nearest.radius - this.surfaceRadius(nearest, f.position); // oblateness under the jet
    const shownAltKm = gapKm(nearest.center.distanceTo(f.position) + lift, nearest.radius, nearest.radiusKm);
    t.active = true;
    t.width = width;
    t.height = height;
    t.timeSec = timeSec;
    t.speedMps = speedMps;
    t.altKm = shownAltKm;
    t.nearest = nearest.name;
    t.anchor = this.anchor?.name ?? '';
    t.airWorld = density > 0 ? nearest.name : '';
    t.airDensity = density;
    t.mach = mach;
    t.gLoad = f.gLoad;
    t.throttle = this.throttle;
    t.boost = f.boosting ? 1 : 0;
    t.boostEnergy = f.boostEnergy;
    t.assist = this.assist;
    t.aligning = this.keys.has('z');
    t.view = this.view;
    t.landingName = this.landing?.name ?? '';
    t.landMenu = this.landMenu;
    t.gearDown = this.gearDown;
    t.weatherMode = this.weather.mode;
    t.abArmed = this.abArmed;
    t.lens = this.view === 'gopro' ? 'gopro' : null;
    t.sunInView = this.flare.inView;
    {
      const inside = this.view === 'cockpit' || this.view === 'gopro';
      const sc = this.flare.screen;
      const onScreen = sc.z > 0 && Math.abs(sc.x) < 1.6 && Math.abs(sc.y) < 1.6;
      t.canopySun = { x: sc.x, y: sc.y, k: inside && onScreen ? Math.min(1, this.flare.inView * 1.4 + 0.15) * this.lastLit : 0 };
      // Grey-out: the pilot's eyes in the air, from about 5 g; held back in the GoPro (a camera does not black out)
      const gTarget = this.view === 'cockpit' && t.airDensity > 0 ? THREE.MathUtils.smoothstep(f.gLoad, 5, 9) : 0;
      const dtT = Math.min(0.1, Math.max(0, timeSec - this.lastTelemetrySec));
      this.lastTelemetrySec = timeSec;
      t.greyOut += (gTarget - t.greyOut) * Math.min(1, dtT * (gTarget > t.greyOut ? 0.8 : 1.6));
    }
    t.skyEvent = this.sky.label;
    if (!t.skyEvent) {
      const inBelt = this.asteroids.beltAt(this.flight.position);
      if (inBelt.k > 0.15 && inBelt.name) t.skyEvent = `${inBelt.name.toUpperCase()} · ROCKS ALL AROUND`;
    }
    t.vibration = Math.min(1, 0.25 + this.throttle * 0.45 + (f.boosting ? 0.4 : 0) + this.shake * 0.5);
    t.warning = this.warning;
    t.heat = this.heat;
    t.helpOpen = this.helpOpen;
    t.fullHud = this.fullHud;
    t.muted = this.audio.muted;
    t.invertPitch = this.invertPitch;
    t.pxPerDeg = (height / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.tan(THREE.MathUtils.degToRad(1));

    // Attitude against the local horizon (or the ecliptic far from any world)
    const fwd = f.forward(new THREE.Vector3());
    const jetUp = new THREE.Vector3(0, 1, 0).applyQuaternion(f.quaternion);
    const jetRight = new THREE.Vector3(1, 0, 0).applyQuaternion(f.quaternion);
    t.hasHorizon = shownAltKm < nearest.radiusKm * 20;
    const up = t.hasHorizon ? new THREE.Vector3().subVectors(f.position, nearest.center).normalize() : new THREE.Vector3(0, 1, 0);
    t.pitchDeg = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(fwd.dot(up), -1, 1)));
    const upProj = up.clone().addScaledVector(fwd, -fwd.dot(up));
    t.rollDeg = upProj.lengthSq() > 1e-10 ? THREE.MathUtils.radToDeg(Math.atan2(upProj.dot(jetRight), upProj.dot(jetUp))) : 0;
    const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(nearest.bundle.bodyGroup.quaternion);
    const north = pole.addScaledVector(up, -pole.dot(up));
    if (north.lengthSq() > 1e-10) {
      north.normalize();
      const east = new THREE.Vector3().crossVectors(north, up).normalize();
      const fh = fwd.clone().addScaledVector(up, -fwd.dot(up));
      t.headingDeg = (THREE.MathUtils.radToDeg(Math.atan2(fh.dot(east), fh.dot(north))) + 360) % 360;
    }

    const nose = this.projectDir(fwd, camera, toScreen);
    t.nose = nose && nose.on ? { x: nose.x, y: nose.y } : null;
    const vd = f.velocity.lengthSq() > 0 ? f.velocity.clone().normalize() : fwd;
    const fpv = this.projectDir(vd, camera, toScreen);
    t.fpv = fpv && fpv.on ? { x: fpv.x, y: fpv.y } : null;

    // Target and the major worlds
    t.target = this.target;
    if (tgt) {
      const to = new THREE.Vector3().subVectors(tgt.center, f.position);
      const d = to.length();
      const surfUnits = Math.max(0, d - tgt.radius);
      const dKm = this.trueGapKm(tgt, nearest, shownAltKm);
      t.targetDistKm = dKm;
      // Closing rate in render units, shown in the km of the gap it is closing
      const closingUnits = f.velocity.dot(to.normalize());
      t.closingMps = surfUnits > 0 ? (closingUnits * (dKm / surfUnits)) * 1000 : closingUnits / unitsPerMps(kmPerUnit);
      t.targetEtaS = closingUnits > 1e-12 ? surfUnits / closingUnits : Infinity;
      t.targetScreen = this.projectDir(to, camera, toScreen);
    } else {
      t.targetScreen = null;
    }
    t.markers.length = 0;
    for (const name of TARGET_ORDER) {
      const b = this.bodyIndex.get(name);
      if (!b || name === this.target) continue;
      const to = new THREE.Vector3().subVectors(b.center, camera.position);
      const d = b.center.distanceTo(f.position);
      // Moons only near their planet, so the sky isn't cluttered
      if (b.bundle.definition.category === 'moon' && d > 3500) continue;
      const p = this.projectDir(to, camera, toScreen);
      if (!p || !p.on) continue;
      // Skip worlds that already fill a good part of the view
      const ang = Math.atan2(b.radius, d);
      if (ang > THREE.MathUtils.degToRad(camera.fov) * 0.25) continue;
      t.markers.push({ name, x: p.x, y: p.y, distKm: this.trueGapKm(b, nearest, shownAltKm), target: false });
    }
    this.emit();
  }

  private emit(): void {
    for (const fn of this.listeners) fn(this.telemetry);
  }

  public dispose(): void {
    this.exit();
    this.model?.dispose();
    this.cockpit?.dispose();
    this.field.dispose();
    this.shock.dispose();
    for (const t of this.trails) t.dispose();
    this.smoke.dispose();
    this.flare.dispose();
    this.sky.dispose();
    this.asteroids.dispose();
    this.weather.dispose();
    this.glints?.dispose();
    this.hudGlass?.dispose();
    this.controls?.dispose();
    this.envTarget.dispose();
    this.audio.dispose();
    this.listeners.clear();
  }
}
