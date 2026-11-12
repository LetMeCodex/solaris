import { triggerPull, type TriggerRest } from './PadTrigger';
import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
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
import { bodyLocalToLatLon, bodyLatLonToLocal as earthLocal } from '../explorer/TileMath';
import { SPEED_TIERS, planTransit, transitAt, slerpUnit, greatCircleKm, type TransitPlan } from './EarthTransit';
import { KM_PER_UNIT, UNITS_PER_AU } from '../rendering/Scale';
import { HudGlass } from './HudGlass';
import { CockpitControls, DestinationRow } from './CockpitControls';
import { Landmark, landmarksFor } from '../explorer/Landmarks';
import { getLandmarkSolidElevationKm } from './LandmarkColliders';
import { bodyLatLonToLocal } from '../explorer/TileMath';
import { MirrorView } from './MirrorView';
import { MfdDisplays } from './MfdDisplays';
import { GroundCover } from './GroundCover';
import { AliveWorld } from './AliveWorld';
import { elevationFor, groundHeightKm } from '../explorer/PlanetElevation';
import { RadioDirector } from './audio/RadioDirector';
import { placeAtSea, placeNameAt } from '../explorer/ReverseGeocode';

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
  /** The Sun in scene NDC, whether it is in front, and how much the air glows round it (god rays). */
  sunNdc: { x: number; y: number; k: number };
  /** Grey-out of the pilot's eyes under G (cockpit view), 0..1. */
  greyOut: number;
  /** What the sky is doing (an eclipse, a flare, a comet, meteors), or empty. */
  skyEvent: string;
  /** Airframe vibration reaching the camera (0..1): rolling-shutter shear. */
  vibration: number;
  /** A radio call shown as a subtitle (empty when none), and whether to ask the pitch question. */
  radio: string;
  askPitch: boolean;
  /** Earth travel: the speed tier, the transit under way (name, km left), the destination and home. */
  speedTier: string;
  transitName: string;
  transitKm: number;
  destinationName: string;
  hasHome: boolean;
  /** Landing autopilot: the landmark and the distance left, km. */
  landingName: string;
  /** A place on Earth chosen as the target to fly to by hand (marker, distance, bearing). */
  waypoint: { name: string; distKm: number; bearingDeg: number; etaS: number; x: number; y: number; on: boolean; angle: number } | null;
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
  lat?: number;
  lon?: number;
  /** Over any world with a surface: the point under the jet (planetocentric degrees). */
  bodyLat?: number;
  bodyLon?: number;
  /** Distance from the Sun's and from Earth's centre, km. */
  sunDistKm: number;
  earthDistKm: number;
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
  /** NASA Eyes spacecraft target (targetable and solid OBB collider, does not override planet gravity frame). */
  spacecraft?: boolean;
  /** Optional local half-extents from normalized GLTF bounds for tight hull collision. */
  halfExtents?: THREE.Vector3;
}

const FLY_KEYS = new Set([
  'w', 's', 'a', 'd', 'q', 'e', 'r', 'f', 'x', 'c', 'v', 't', 'z', 'g', 'h', 'n', 'i', ' ',
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'escape', 'shift', 'u', 'l', 'b', 'k', '[', ']', 'y',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]);
const TARGET_ORDER = ['Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Phobos', 'Ceres', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto',
  'Saturn', 'Enceladus', 'Titan', 'Iapetus', 'Uranus', 'Miranda', 'Titania', 'Neptune', 'Triton', 'Pluto', 'Charon', 'Sun', 'Sagittarius A*',
  'International Space Station', 'Hubble Space Telescope', 'James Webb Space Telescope', 'Artemis II',
  'Parker Solar Probe', 'Voyager 1', 'Voyager 2', 'New Horizons', 'Cassini', 'Juno', 'Europa Clipper',
  'Mars 2020 (Perseverance)', 'OSIRIS-APEX', 'DART', 'Psyche', 'Lucy', 'Rosetta',
  '67P/Churyumov-Gerasimenko', 'Bennu', 'Ryugu', 'Vesta', 'Eros', 'Itokawa', 'Didymos', 'Apophis', 'Arrokoth'];

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
  /** Who talks on the radio, and when (lines in public/voice/radio/). */
  private readonly director = new RadioDirector({
    speak: (buffer, speaker, distance) => this.audio.speak(buffer, speaker, distance),
    decode: (data) => this.audio.decode(data),
    subtitle: (text, seconds) => this.radio(text, seconds),
    muted: () => this.audio.muted,
  });
  /** Under the jet (nearest world), for the radio: latitude, longitude, the Sun's height (sine). */
  private subLat = 0;
  private subLon = 0;
  private subSunUp = 0;

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
  /** Jump to the next named time of day where the jet is (O): returns its label, e.g. "Golden hour · 16:51". */
  private timePreset: (() => string | null) | null = null;
  private rendezvousHandler: ((nameOrId: string) => void) | null = null;
  private scAnchorName: string | null = null;
  private scAnchorPrev = new THREE.Vector3();
  private scAnchorValid = false;
  private radioText = '';
  private radioT = 0;
  private wasInCloud = false;
  private lastSunUp = 0;
  private lastSunDir = new THREE.Vector3(0, 1, 0);
  /** The Sun's height where the jet is (sine of its elevation; below 0 under the horizon). */
  public get sunElevation(): number {
    return this.lastSunUp;
  }
  private static readonly PITCH_KEY = 'solaris.invertPitch';
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

  /** Live rear-view mirrors in the cockpit (see MirrorView). */
  /** The cockpit's three displays, live (see MfdDisplays). */
  private mfd = new MfdDisplays();
  private mfdCount = 0;
  /** Trees where the photographs show trees, low over Earth (see GroundCover). */
  private groundCover: GroundCover | null = null;
  /** Birds and air traffic round the jet over Earth (see AliveWorld). */
  private alive: AliveWorld | null = null;
  /** The lit cockpit seen from the pilot's eye, for the canopy's own reflection. */
  // Sharp enough for the glass, which samples it directly
  private cockpitCube = new THREE.CubeCamera(0.02, 14, new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType }));
  private cockpitCubeFrame = 0;
  /** The world outside, round the cockpit while its reflection is captured (see captureEnvironment). */
  private cockpitSky: THREE.Mesh | null = null;

  private makeCockpitSky(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(10, 32, 16),
      new THREE.ShaderMaterial({
        uniforms: { tEnv: { value: this.envTarget.texture } },
        vertexShader: 'varying vec3 vDir; void main() { vDir = (modelMatrix * vec4(position, 0.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: 'uniform samplerCube tEnv; varying vec3 vDir; void main() { gl_FragColor = vec4(textureCube(tEnv, normalize(vDir)).rgb, 1.0); }',
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    );
    mesh.name = 'cockpit_reflection_sky';
    mesh.renderOrder = -1000;
    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.userData.noAO = true;
    this.overlayScene.add(mesh);
    return mesh;
  }
  private lastKmPerUnit = 1;
  private vVertical = new THREE.Vector3(0, 1, 0);
  private vMirF = new THREE.Vector3();
  private mirrorCount = 0;
  private vMirU = new THREE.Vector3();
  private mirror = new MirrorView(perf.tier === 'low' ? 320 : 640, perf.tier === 'low' ? 160 : 320);
  private envTarget = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: false });
  private envCamera = new THREE.CubeCamera(0.01, 1e9, this.envTarget);
  private envFrame = 0;
  private envFace = 0;
  private envFaceTarget = new THREE.WebGLRenderTarget(256, 256, { type: THREE.HalfFloatType });
  private envClean = new FullScreenQuad(
    new THREE.ShaderMaterial({
      uniforms: { tSrc: { value: this.envFaceTarget.texture } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      // NaN or infinity becomes nothing; light far brighter than any surface is capped
      fragmentShader:
        'uniform sampler2D tSrc; varying vec2 vUv; void main() { vec4 c = texture2D(tSrc, vUv); bool bad = any(isnan(c.rgb)) || any(isinf(c.rgb)); gl_FragColor = vec4(bad ? vec3(0.0) : min(c.rgb, vec3(2.0e4)), 1.0); }',
      depthTest: false,
      depthWrite: false,
    }),
  );

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
  /**
   * The head's actual angles (yaw, pitch), chasing `look` on a critically damped spring: eyes and
   * neck move smoothly, ease in and out, never snap. And its velocity.
   */
  private head = new THREE.Vector2();
  /** Inside views with the pointer captured, the mouse is the head (Shift: the mouse is the stick). */
  private mouseHead = false;
  private lastHeadMove = 0;
  private pointerUnlockedAt = 0;
  private headVel = new THREE.Vector2();
  /** Field of view chosen inside (Shift + wheel), degrees, and its smoothed value. */
  private insideFov = 76;
  private insideFovNow = 76;
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
  /** The fly-by director's current shot and how long it has run. */
  private shot = { kind: 0, t: 0, len: 9, seed: 1 };
  private shotUp = new THREE.Vector3();
  private shotFwd = new THREE.Vector3();
  private shotSide = new THREE.Vector3();

  /**
   * The fly-by view as a drone crew would film it: a sequence of shots, each 7-11 s, cut between.
   *  0 orbit       circling the jet slowly, a little above it
   *  1 tracking    off the wing with a long lens, keeping pace, a touch ahead
   *  2 fly-past    from a point low on the path ahead: the jet roars over and away, tracked
   *  3 overhead    straight down from above, the ground streaming under the jet
   *  4 low chase   behind and below with a wide lens, the ground rushing up
   *  5 reveal      starting close at the nose, pulling back and up to show where it is flying
   * Every shot rides with the jet (no lag at any speed) with a drone's slight drift on top.
   */
  private flybyDirector(dt: number, timeSec: number, camera: THREE.PerspectiveCamera, f: FlightModel, upm: number, speedMps: number, fwd: THREE.Vector3, nearest: BodyInfo | null): void {
    const sh = this.shot;
    sh.t += dt;
    if (sh.t > sh.len || !this.flybyValid) {
      // Next shot: never the same twice in a row
      const next = (sh.kind + 1 + Math.floor(Math.random() * 5)) % 6;
      sh.kind = this.flybyValid ? next : 0;
      sh.t = 0;
      sh.len = 7 + Math.random() * 4;
      sh.seed = Math.random();
      this.flybyValid = true;
      this.flybyPoint.set(0, 0, 0);
    }
    // A level frame at the jet: up from the world, forward along the flight path, the side
    const up = nearest ? this.shotUp.subVectors(f.position, nearest.center).normalize() : this.shotUp.set(0, 1, 0).applyQuaternion(f.quaternion);
    const dir = f.velocity.lengthSq() > 0 ? this.shotFwd.copy(f.velocity).normalize() : this.shotFwd.copy(fwd);
    const fwdH = this.v2.copy(dir).addScaledVector(up, -dir.dot(up));
    if (fwdH.lengthSq() < 1e-10) fwdH.copy(fwd);
    fwdH.normalize();
    const side = this.shotSide.crossVectors(fwdH, up).normalize();
    const m = upm; // render units per metre
    const k = sh.t / sh.len;
    const L = (this.model?.length ?? 14) * (1 + 0.4 * sh.seed);
    const pos = camera.position;
    let look = f.position;
    let fov = 45;
    switch (sh.kind) {
      case 0: {
        const a = sh.seed * 6.28 + sh.t * 0.22;
        const r = L * 3.2;
        pos.copy(f.position).addScaledVector(fwdH, Math.cos(a) * r * m).addScaledVector(side, Math.sin(a) * r * m).addScaledVector(up, L * 0.55 * m);
        fov = 42;
        break;
      }
      case 1: {
        const s2 = sh.seed > 0.5 ? 1 : -1;
        pos.copy(f.position).addScaledVector(side, s2 * L * 9 * m).addScaledVector(fwdH, L * (1.5 - 2 * k) * m).addScaledVector(up, L * 0.4 * m);
        fov = 14;
        break;
      }
      case 2: {
        const span = Math.max(80, Math.min(3000, speedMps * 2.6));
        if (this.flybyPoint.lengthSq() === 0) {
          this.flybyPoint.copy(f.position).addScaledVector(dir, span * m).addScaledVector(side, (sh.seed - 0.5) * span * 0.18 * m).addScaledVector(up, -Math.min(span * 0.06, 60) * m);
        }
        pos.copy(this.flybyPoint);
        const d = pos.distanceTo(f.position) / m;
        fov = THREE.MathUtils.clamp(2 * THREE.MathUtils.radToDeg(Math.atan(26 / Math.max(d, 1))), 7, 60);
        break;
      }
      case 3: {
        // Straight down from a drone's height: the jet a fifth of the frame over the ground
        const h = L * (4.5 + 3 * k);
        pos.copy(f.position).addScaledVector(up, h * m).addScaledVector(fwdH, -L * 0.3 * m);
        fov = 36;
        break;
      }
      case 4: {
        pos.copy(f.position).addScaledVector(fwdH, -L * 1.8 * m).addScaledVector(up, -L * 0.35 * m).addScaledVector(side, (sh.seed - 0.5) * L * 0.8 * m);
        fov = 78;
        break;
      }
      default: {
        const e = k * k * (3 - 2 * k);
        pos.copy(f.position).addScaledVector(fwdH, L * (1.6 - 7 * e) * m).addScaledVector(side, L * (0.9 + 2.5 * e) * m).addScaledVector(up, L * (0.2 + 5 * e) * m);
        look = this.v3.copy(f.position).addScaledVector(fwdH, L * 40 * e * m);
        fov = 50 + 14 * e;
        break;
      }
    }
    // A drone's drift: slow, a metre or so
    const w = timeSec + sh.seed * 100;
    pos.addScaledVector(side, Math.sin(w * 0.7) * 0.6 * m).addScaledVector(up, Math.sin(w * 0.53 + 1) * 0.45 * m);
    const lookUp = sh.kind === 3 ? fwdH : up;
    this.m1.lookAt(pos, look, lookUp);
    camera.quaternion.setFromRotationMatrix(this.m1);
    camera.fov = fov;
  }
  private shake = 0;
  private fovKick = 0;
  private wasSupersonic = false;
  private heat = 0;
  private warning = 0;

  private listeners = new Set<(t: JetTelemetry) => void>();
  public readonly telemetry: JetTelemetry = {
    active: false, sunDistKm: 0, earthDistKm: 0, speedMps: 0, closingMps: 0, altKm: 0, nearest: '', anchor: '', airWorld: '', airDensity: 0, mach: 0, gLoad: 1,
    throttle: 0, boost: 0, boostEnergy: 1, assist: true, aligning: false, view: 'chase', hasHorizon: false, pitchDeg: 0, rollDeg: 0,
    headingDeg: 0, pxPerDeg: 10, nose: null, fpv: null, target: 'Mars', targetDistKm: 0, targetEtaS: 0, targetScreen: null, markers: [],
    warning: 0, heat: 0, helpOpen: true, muted: false, fullHud: false, blur: 0, blurNdc: { x: 0, y: 0 }, lens: null, skyEvent: '', canopySun: { x: 0, y: 0, k: 0 }, sunNdc: { x: 0, y: 0, k: 0 }, greyOut: 0, sunInView: 0, vibration: 0, radio: '', askPitch: false, speedTier: 'Jet', transitName: '', transitKm: 0, destinationName: '', waypoint: null, hasHome: false, landingName: '', landingDistKm: 0, landMenu: false, gearDown: false, abArmed: true, weather: 'Clear', weatherMode: 'auto', localTime: 12, invertPitch: false, width: 1, height: 1, timeSec: 0,
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
    // (development: the jet from the console, e.g. __jet.director.event('awe'))
    if (import.meta.env.DEV) (window as unknown as { __jet?: JetController }).__jet = this;
    this.weather.onLightning = (km) => {
      this.audio.thunder(km);
      if (km < 10) this.director.event('storm');
    };
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
          this.mirrorCount = this.mirror.attach(model.root, (m) => m.name.startsWith('dynamic_mirror'));
          this.mfdCount = this.mfd.attach(model.root);
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
      timePreset?: () => string | null;
      /** Warp jet directly into formation beside any of the 174 NASA spacecraft. */
      onRendezvousSpacecraft?: (nameOrId: string) => void;
    } = {}
  ): void {
    this.shiftHours = options.shiftHours ?? null;
    this.timePreset = options.timePreset ?? null;
    this.rendezvousHandler = options.onRendezvousSpacecraft ?? null;
    this.scAnchorName = null;
    this.scAnchorValid = false;
    // The pilot's pitch preference, asked once (see setPitchPreference)
    try {
      const saved = localStorage.getItem(JetController.PITCH_KEY);
      if (saved !== null) this.invertPitch = saved === '1';
    } catch {
      /* private mode: default */
    }
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
    this.localGroundKm = 0;
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
    document.addEventListener('pointerlockchange', this.onPointerLock);
    this.audio.start();
    this.emit();
  }

  public exit(): void {
    if (!this.active) return;
    this.active = false;
    PhotorealEarth.current?.setGroundProbe(null);
    PhotorealEarth.current?.setLookahead(null);
    PhotorealEarth.current?.setSurround(null);
    this.groundCover?.setVisible(false);
    this.alive?.setVisible(false);
    this.photoGround = null;
    this.transit = null;
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
    document.removeEventListener('pointerlockchange', this.onPointerLock);
    if (document.pointerLockElement) document.exitPointerLock();
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
    if (this.era) this.director.event('era');
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

  /** Triggers a close-formation rendezvous beside any NASA spacecraft in the Solar System. */
  public rendezvousTarget(nameOrId: string): void {
    this.transit = null;
    this.landing = null;
    this.cutscene = null;
    if (this.rendezvousHandler) {
      this.rendezvousHandler(nameOrId);
      return;
    }
    const b = this.bodyIndex.get(nameOrId);
    if (b) {
      b.center.copy(b.bundle.bodyGroup.position);
      this.placeFormationBeside(b.bundle);
    }
  }

  /** Positions the jet in sunlit close visual formation alongside a selected spacecraft or comet. */
  public placeFormationBeside(targetBundle: PlanetMeshBundle, silent = false): void {
    const pos = targetBundle.bodyGroup.position;
    const standOff = Math.max(0.28, targetBundle.visualRadius * 3.0);

    // Offset slightly sunward & laterally so the probe's PBR surfaces catch key sunlight cleanly
    const sunward = new THREE.Vector3().copy(pos).negate();
    if (sunward.lengthSq() > 1e-9) sunward.normalize();
    else sunward.set(0, 0, 1);
    const lateral = new THREE.Vector3().crossVectors(sunward, new THREE.Vector3(0, 1, 0));
    if (lateral.lengthSq() < 1e-6) lateral.set(1, 0, 0);
    lateral.normalize();
    const offsetDir = sunward.clone().multiplyScalar(0.62).addScaledVector(lateral, 0.72);

    // Keep clear of nearest planet limb when spawning near a LEO/Martian host world
    let hostNear: BodyInfo | null = null;
    let hostBestD = Infinity;
    for (const b of this.bodies) {
      if (b.spacecraft || b.noSurface) continue;
      b.center.copy(b.bundle.bodyGroup.position);
      const d = b.center.distanceTo(pos);
      if (d < b.radius * 4 && d < hostBestD) {
        hostBestD = d;
        hostNear = b;
      }
    }
    if (hostNear) {
      const out = pos.clone().sub(hostNear.center).normalize();
      if (offsetDir.dot(out) < 0.35) offsetDir.addScaledVector(out, 0.85);
    }
    offsetDir.normalize();

    this.transit = null;
    this.landing = null;
    this.cutscene = null;
    this.flight.position.copy(pos).addScaledVector(offsetDir, standOff);
    const fwd = pos.clone().sub(this.flight.position).normalize();
    const refUp = hostNear ? pos.clone().sub(hostNear.center).normalize() : new THREE.Vector3(0, 1, 0);
    this.m1.lookAt(new THREE.Vector3(), fwd, Math.abs(fwd.dot(refUp)) > 0.96 ? new THREE.Vector3(0, 1, 0) : refUp);
    this.flight.quaternion.setFromRotationMatrix(this.m1);
    this.flight.rates.set(0, 0, 0);
    this.flight.speed = 0;
    this.flight.velocity.set(0, 0, 0);
    this.throttle = 0;
    this.chaseQuat.copy(this.flight.quaternion);
    this.look.set(0, 0);
    this.target = targetBundle.definition.name;
    const tb = this.bodyIndex.get(this.target);
    if (tb) tb.center.copy(pos);
    this.scAnchorName = this.target;
    this.scAnchorPrev.copy(pos);
    this.scAnchorValid = true;
    if (!silent) this.radio(`Rendezvous · ${this.target}`, 3.5);
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
      const isSc = cat === 'spacecraft';
      const info: BodyInfo = {
        name, bundle: b, center: b.bodyGroup.position.clone(), radius: b.visualRadius, radiusKm: b.definition.physical.meanRadiusKm,
        noSurface: cat === 'black_hole',
        cloud: b.definition.id.startsWith('nebula:') || b.definition.id.startsWith('comet:'),
        spacecraft: isSc,
        halfExtents: (b as { halfExtents?: THREE.Vector3 }).halfExtents,
        minor: isSc || !(cat === 'star' || cat === 'planet' || cat === 'dwarf_planet' || (cat === 'moon' && !b.definition.minor && b.definition.physical.meanRadiusKm > 100)),
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
    if (k === 'shift' && this.mouseHead) this.steer.set(0, 0);
    if (k === 'escape') {
      // Esc first gives the mouse back (the browser does that itself); only a second Esc leaves
      if (document.pointerLockElement || performance.now() - this.pointerUnlockedAt < 400) return;
      this.exitRequest?.();
    }
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
    else if (k === 'i') this.setPitchPreference(!this.invertPitch);
    else if (k === 'o') this.nextTimeOfDay();
    else if (k === 'home') this.flyHome();
    else if (k === 'x') this.throttle = 0;
    else if (k === 'v') this.cobraQueued = true;
    else if (k === 'j') this.cycleSpeedTier();
    else if (k === 'p') this.transitToDestination();
    else if (k === 'm') this.landMenu = !this.landMenu;
    else if (k >= '0' && k <= '9') this.throttle = k === '0' ? 1 : Number(k) / 10;
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    const k = e.key.toLowerCase();
    if (!FLY_KEYS.has(k)) return;
    // Also stops Space "clicking" a HUD button that kept the focus
    e.preventDefault();
    e.stopPropagation();
    this.keys.delete(k);
    if (k === 'shift' && this.mouseHead) this.steer.set(0, 0);
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
    // Inside, a click hands the mouse to the head (a first-person look); Esc gives it back
    const inside = (this.view === 'cockpit' || this.view === 'gopro') && !this.cutscene;
    if (e.button === 0 && inside && !document.pointerLockElement && this.dom) {
      const canvas = this.dom.querySelector('canvas') ?? this.dom;
      void (canvas as HTMLElement & { requestPointerLock: () => Promise<void> | void }).requestPointerLock();
      return;
    }
    if (e.button === 2) this.lookDrag = true;
    else if (e.button === 1) {
      e.preventDefault();
      this.look.set(0, 0);
      this.insideFov = 76;
    } else if (e.button === 0) {
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

  private onPointerLock = (): void => {
    this.mouseHead = !!document.pointerLockElement;
    if (!this.mouseHead) {
      this.pointerUnlockedAt = performance.now();
      this.steer.set(0, 0);
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.mouseHead) {
      if (e.shiftKey) {
        // Shift: the mouse is the stick (deflection builds with movement; let go of Shift and it centres)
        this.steer.x = THREE.MathUtils.clamp(this.steer.x + e.movementX * 0.006, -1, 1);
        this.steer.y = THREE.MathUtils.clamp(this.steer.y + e.movementY * 0.006, -1, 1);
      } else {
        const k = 0.0028 * (this.insideFovNow / 76);
        this.look.x = THREE.MathUtils.clamp(this.look.x - e.movementX * k, -2.7, 2.7);
        this.look.y = THREE.MathUtils.clamp(this.look.y - e.movementY * k, -1.0, 1.45);
        this.lastHeadMove = performance.now();
      }
      return;
    }
    if (this.dragSteer) this.updateSteer(e.clientX, e.clientY);
    if (this.lookDrag) {
      const inside = this.view === 'cockpit' || this.view === 'gopro';
      // Inside, the look slows as you zoom in (fine aiming at a narrow field)
      const k = inside ? 0.0045 * (this.insideFovNow / 76) : 0.006;
      this.look.x -= (e.clientX - this.lastMouse.x) * k;
      if (inside) this.look.x = THREE.MathUtils.clamp(this.look.x, -2.7, 2.7);
      this.look.y = THREE.MathUtils.clamp(this.look.y - (e.clientY - this.lastMouse.y) * k, inside ? -1.0 : -1.3, inside ? 1.45 : 1.3);
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
    if ((this.view === 'cockpit' || this.view === 'gopro') && e.shiftKey) {
      this.insideFov = THREE.MathUtils.clamp(this.insideFov * Math.exp(e.deltaY * 0.0012), 25, 115);
      return;
    }
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
    const relief = b.name !== 'Earth' && elevationFor(b.name) !== null;
    if (Math.abs(ps - 1) < 1e-6 && b.name !== 'Earth' && !relief) return b.radius;
    mesh.getWorldQuaternion(this.qSurf);
    const d = this.vSurf.subVectors(point, b.center).normalize().applyQuaternion(this.qSurf.invert());
    const R = b.radius;
    const ellipR = Math.abs(ps - 1) < 1e-6 ? R : 1 / Math.sqrt((d.x * d.x + d.z * d.z) / (R * R) + (d.y * d.y) / (R * ps * R * ps));
    if (b.name === 'Earth') {
      // Over Google's 3D Earth the ground is the drawn one (rooftops, bridges, real slopes),
      // measured under the jet a few times a second (probePhotoGround)
      const pg = this.photoGround;
      if (pg && point.distanceToSquared(pg.at) < pg.reach * pg.reach) {
        return Math.max(pg.r, ellipR + this.localGroundKm * (b.radius / b.radiusKm));
      }
      const ll = bodyLocalToLatLon('Earth', d.x, d.y, d.z);
      let elevKm = Math.max(this.localGroundKm, earthElevation.heightKm(ll.lat, ll.lon, 11));
      const solidKm = getLandmarkSolidElevationKm(ll.lat, ll.lon);
      if (solidKm > elevKm) elevKm = solidKm;
      return ellipR + elevKm * (b.radius / b.radiusKm);
    }
    // The Moon and Mars: the real relief (DEM) the explorer draws, from height tiles already loaded
    if (relief) {
      const ll = bodyLocalToLatLon(b.name, d.x, d.y, d.z);
      return ellipR + groundHeightKm(b.name, ll.lat, ll.lon) * (b.radius / b.radiusKm);
    }
    return ellipR;
  }

  /** Keep the height tiles under the jet loaded on worlds with real relief (about once a second). */
  private reliefAsked = 0;
  private ensureRelief(b: BodyInfo, altKm: number): void {
    if (b.name === 'Earth') {
      // The height map under the jet, always: it is the ground whenever the 3D tiles are not
      // there yet (and what keeps the jet out of mountains it has not streamed)
      if (altKm > 40) return;
      const now = performance.now();
      if (now - this.reliefAsked < 1000) return;
      this.reliefAsked = now;
      const ll = this.earthLatLon();
      if (ll) void earthElevation.ensure(ll.lat - 0.25, ll.lon - 0.25, ll.lat + 0.25, ll.lon + 0.25, 11);
      return;
    }
    if (altKm > 120) return;
    const src = elevationFor(b.name);
    if (!src) return;
    const now = performance.now();
    if (now - this.reliefAsked < 1000) return;
    this.reliefAsked = now;
    const mesh = b.bundle.surfaceMesh;
    const local = this.lv3.copy(this.flight.position).applyMatrix4(this.m1.copy(mesh.matrixWorld).invert());
    const ll = bodyLocalToLatLon(b.name, local.x, local.y, local.z);
    void src.ensure(ll.lat - 0.3, ll.lon - 0.3, ll.lat + 0.3, ll.lon + 0.3, 6);
  }
  private qSurf = new THREE.Quaternion();
  private vSurf = new THREE.Vector3();
  private camGroundUp = new THREE.Vector3();
  private camMidPoint = new THREE.Vector3();
  private camLookQuat = new THREE.Quaternion();
  private localGroundKm = 0;

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

  // ------------------------------------------------------------------ Earth travel

  /** Speed tier in Earth's air (see EarthTransit): 0 jet, 1 hypersonic, 2 scramjet. */
  public speedTier = 0;
  /** Where Transit (P) goes: a searched place or a landmark. */
  public earthDestination: { name: string; lat: number; lon: number } | null = null;
  /** Where the jet first came into Earth's air: "fly home" returns here. */
  public home: { name: string; lat: number; lon: number } | null = null;
  private transit: { plan: TransitPlan; from: [number, number, number]; to: [number, number, number]; name: string; t: number; last: THREE.Vector3 | null; lat: number; lon: number } | null = null;

  public cycleSpeedTier(): void {
    this.speedTier = (this.speedTier + 1) % SPEED_TIERS.length;
    const calls = ['Back to jet speeds', 'Hypersonic, Mach 6 available · watch the ground', 'Scramjet, Mach 25 available · the ground comes fast'];
    this.radio(calls[this.speedTier]);
  }

  /** A short radio call, shown as a subtitle for a few seconds. */
  public radio(text: string, seconds = 4.5): void {
    this.radioText = text;
    this.radioT = seconds;
  }

  /**
   * Which way W moves the nose. New to flight games: W up (like a game). Flown sims before: W down
   * (stick forward, nose down), the default. Remembered.
   */
  public setPitchPreference(wUp: boolean): void {
    this.invertPitch = wUp;
    try {
      localStorage.setItem(JetController.PITCH_KEY, wUp ? '1' : '0');
    } catch {
      /* private mode */
    }
  }

  /** The pitch question has not been answered yet. */
  private get pitchUnasked(): boolean {
    try {
      return localStorage.getItem(JetController.PITCH_KEY) === null;
    } catch {
      return false;
    }
  }

  public nextTimeOfDay(): void {
    const label = this.timePreset?.();
    if (label) this.radio(label, 3.5);
  }

  /** Hold the jet where it is (the fly page holds it until everything has loaded). */
  public hold = false;

  /** The airframe model has loaded. */
  public get aircraftReady(): boolean {
    return !!this.model?.airframe;
  }

  /** A landmark or place to fly to by hand: shown as a marker, Z turns towards it. */
  public waypoint: { name: string; lat: number; lon: number; arrived: boolean } | null = null;

  public setWaypoint(name: string, lat: number, lon: number): void {
    this.waypoint = { name, lat, lon, arrived: false };
    this.earthDestination = { name, lat, lon };
    this.landMenu = false;
    const here = this.earthLatLon();
    const km = here ? Math.round(greatCircleKm(here.lat, here.lon, lat, lon)) : 0;
    this.radio(`Target set · ${name}${km ? ` · ${km.toLocaleString()} km` : ''} · Z turns to it`, 5);
  }

  public clearWaypoint(): void {
    if (this.waypoint && this.earthDestination?.name === this.waypoint.name) this.earthDestination = null;
    this.waypoint = null;
  }

  /**
   * Where to aim for the waypoint, as a point in the world. Close (under ~150 km) the place itself,
   * a little over the ground. Far away the straight line runs through the Earth (and beyond a
   * quarter of the globe it points backwards), so instead: a point 150 km ahead along the great
   * circle towards it, at the jet's own height, which sits on the horizon in the right heading.
   */
  private waypointWorld(nearest: BodyInfo, out: THREE.Vector3): THREE.Vector3 | null {
    const w = this.waypoint;
    if (!w || nearest.name !== 'Earth') return null;
    const here = this.earthLatLon();
    const mesh = nearest.bundle.surfaceMesh;
    if (here) {
      const distKm = greatCircleKm(here.lat, here.lon, w.lat, w.lon);
      if (distKm > 150) {
        const D = Math.PI / 180;
        const p1 = here.lat * D, l1 = here.lon * D, p2 = w.lat * D, dl = (w.lon - here.lon) * D;
        const brg = Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl));
        const d = 150 / 6371;
        const lat = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(brg));
        const lon = l1 + Math.atan2(Math.sin(brg) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(lat));
        const [x, y, z] = earthLocal('Earth', lat / D, lon / D);
        const altKm = Math.max(0.3, this.telemetry.altKm);
        return out.set(x, y, z).multiplyScalar(1 + altKm / 6378.137).applyMatrix4(mesh.matrixWorld);
      }
    }
    const [x, y, z] = earthLocal('Earth', w.lat, w.lon);
    return out.set(x, y, z).multiplyScalar(1 + 0.3 / 6378.137).applyMatrix4(mesh.matrixWorld);
  }

  public setEarthDestination(name: string, lat: number, lon: number): void {
    this.earthDestination = { name, lat, lon };
  }

  /** Transit to the destination set by search or a landmark (or home, when none is set). */
  public transitToDestination(): void {
    const d = this.earthDestination ?? this.home;
    if (d) this.startTransit(d.name, d.lat, d.lon);
  }

  public flyHome(): void {
    if (this.home) this.startTransit(this.home.name, this.home.lat, this.home.lon);
  }

  public cancelTransit(): void {
    this.transit = null;
  }

  /** The jet's latitude and longitude over Earth (geodetic), or null when Earth is not near. */
  private earthLatLon(): { lat: number; lon: number } | null {
    const b = this.bodyIndex.get('Earth');
    if (!b) return null;
    const local = this.lv3.copy(this.flight.position).applyMatrix4(this.m1.copy(b.bundle.surfaceMesh.matrixWorld).invert());
    return bodyLocalToLatLon('Earth', local.x, local.y, local.z);
  }

  /** Start a transit to a place on Earth: climb, cross at up to ~300,000 km/h, descend. */
  public startTransit(name: string, lat: number, lon: number): boolean {
    const b = this.bodyIndex.get('Earth');
    const here = this.earthLatLon();
    if (!b || !here) return false;
    this.cancelLanding();
    const kmNear = b.radiusKm / b.radius;
    const heightKm = (this.flight.position.distanceTo(b.center) - b.radius) * kmNear;
    // From far out (the Moon, orbit) the route starts under the jet, from its present height
    const distKm = greatCircleKm(here.lat, here.lon, lat, lon);
    const from = earthLocal('Earth', here.lat, here.lon);
    const to = earthLocal('Earth', lat, lon);
    const plan = planTransit(distKm, Math.min(heightKm, 400));
    // Hand over a safe height above the ground there
    plan.endKm = Math.max(plan.endKm, earthElevation.heightKm(lat, lon, 8) + 1.6);
    void earthElevation.ensure(lat - 0.3, lon - 0.3, lat + 0.3, lon + 0.3, 9);
    this.transit = { plan, from, to, name, t: 0, last: null, lat, lon };
    this.radio(`Transit to ${name} · ${Math.round(distKm).toLocaleString('en-US')} km · climbing to ${Math.round(plan.cruiseKm)} km`);
    return true;
  }

  /** One frame of a transit (scripted: no physics). */
  private flyTransit(dt: number, input: FlightInput): void {
    const tr = this.transit!;
    const b = this.bodyIndex.get('Earth');
    if (!b) {
      this.transit = null;
      return;
    }
    // A firm pull on the stick takes the jet back (not in the first moments, so the key press that
    // started it does not end it)
    if (tr.t > 1.5 && (Math.abs(input.pitch) > 0.5 || Math.abs(input.roll) > 0.5)) {
      this.transit = null;
      const f = this.flight;
      const vMax = 600 * unitsPerMps(b.radiusKm / b.radius);
      if (f.velocity.length() > vMax) f.velocity.setLength(vMax);
      return;
    }
    tr.t += dt;
    const { along, heightKm, done } = transitAt(tr.plan, tr.t);
    const dir = slerpUnit(tr.from, tr.to, along);
    const r = 1 + heightKm / b.radiusKm;
    const mesh = b.bundle.surfaceMesh;
    mesh.updateWorldMatrix(true, false);
    const pos = this.lv4.set(dir[0] * r, dir[1] * r, dir[2] * r).applyMatrix4(mesh.matrixWorld);
    const f = this.flight;
    const vel = tr.last ? pos.clone().sub(tr.last).divideScalar(Math.max(dt, 1e-4)) : new THREE.Vector3();
    tr.last = (tr.last ?? new THREE.Vector3()).copy(pos);
    f.position.copy(pos);
    if (vel.lengthSq() > 0) f.velocity.copy(vel);
    const up = this.lv2.subVectors(pos, b.center).normalize();
    if (vel.lengthSq() > 1e-16) {
      this.m1.lookAt(new THREE.Vector3(), vel.clone().normalize(), up);
      this.q1.setFromRotationMatrix(this.m1);
      f.quaternion.slerp(this.q1, 1 - Math.exp(-4 * dt));
    }
    f.rates.set(0, 0, 0);
    input.pitch = input.roll = input.yaw = 0;
    input.boost = along > 0.05 && along < 0.95;
    this.scripted = true;
    this.telemetry.transitKm = (1 - along) * tr.plan.distanceKm;
    if (done) {
      // Hand back level, at jet speed, flying on along the route
      const kmNear = b.radiusKm / b.radius;
      const fwd = f.velocity.lengthSq() > 0 ? f.velocity.clone().normalize() : f.forward(new THREE.Vector3());
      fwd.addScaledVector(up, -fwd.dot(up)).normalize();
      f.velocity.copy(fwd).multiplyScalar(0.26 / kmNear);
      this.m1.lookAt(new THREE.Vector3(), fwd, up);
      f.quaternion.setFromRotationMatrix(this.m1);
      this.throttle = Math.max(this.throttle, 0.55);
      this.speedTier = 0;
      if (this.earthDestination && this.earthDestination.name === tr.name) this.earthDestination = null;
      this.radio(`Over ${tr.name} · ${Math.round(tr.plan.endKm * 1000).toLocaleString('en-US')} m · you have control`);
      this.transit = null;
    }
  }

  public cancelLanding(): void {
    this.landing = null;
    this.hop = null;
    this.cutscene = null;
    this.scripted = false;
    this.fade = 0;
    this.siteFix = null;
  }

  /** Where a landmark is now (world render units) and the local up there. */
  private landmarkFrame(lm: Landmark, outSite: THREE.Vector3, outUp: THREE.Vector3): BodyInfo | null {
    const b = this.bodyIndex.get(lm.body);
    if (!b) return null;
    b.bundle.surfaceMesh.updateWorldMatrix(true, true);
    const lat = lm.vantageLat ?? lm.lat;
    const lon = lm.vantageLon ?? lm.lon;
    const [x, y, z] = bodyLatLonToLocal(lm.body, lat, lon);
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
    const lat = lm.vantageLat ?? lm.lat;
    const lon = lm.vantageLon ?? lm.lon;
    if (lm.body === 'Earth') {
      const solidKm = Math.max(getLandmarkSolidElevationKm(lat, lon), getLandmarkSolidElevationKm(lm.lat, lm.lon) * 0.70);
      const demKm = earthElevation.heightKm(lat, lon, 13);
      const elevKm = Math.max(demKm, solidKm);
      site.addScaledVector(up, elevKm / kmNear);
      const g = this.drawnGround(b, site, up);
      const extraUnits = g !== null ? Math.max(g, -0.08 / kmNear) : 0;
      site.addScaledVector(up, extraUnits);
      this.localGroundKm = Math.max(solidKm, elevKm + extraUnits * kmNear);
    } else {
      // Real relief (Moon, Mars): stand on the drawn ground, not the bare sphere
      const gKm = groundHeightKm(lm.body, lat, lon);
      site.addScaledVector(up, gKm / kmNear);
      this.localGroundKm = 0;
    }
    const climbStartKm = Math.max(0.32, (lm.vantageAltKm ?? 0.05) + 0.25);
    this.flight.position.copy(site).addScaledVector(up, climbStartKm / kmNear);
    const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(b.bundle.bodyGroup.quaternion);
    const north = pole.addScaledVector(up, -pole.dot(up)).normalize();
    const east = new THREE.Vector3().crossVectors(north, up).normalize();
    const h = THREE.MathUtils.degToRad(lm.viewHeadingDeg ?? 0);
    const fwd = north.multiplyScalar(Math.cos(h)).addScaledVector(east, Math.sin(h)).normalize();
    // Climbing away at 14° nose up above all local terrain and 3D tiles
    fwd.addScaledVector(up, 0.25).normalize();
    this.m1.lookAt(new THREE.Vector3(), fwd, up);
    this.flight.quaternion.setFromRotationMatrix(this.m1);
    this.chaseQuat.copy(this.flight.quaternion);
    this.headQuat.copy(this.flight.quaternion);
    this.flight.speed = 160 * unitsPerMps(kmNear);
    this.flight.velocity.copy(fwd).multiplyScalar(this.flight.speed);
    this.throttle = 0.65;
    this.anchor = b;
    this.anchorPrev.copy(b.center);
    this.target = b.name;
  }

  /**
   * The landing autopilot, in two acts.
   *
   * The hop: from wherever you are, a fast ballistic arc round the world to a point a few km out
   * from the landmark, in 8 to 22 seconds depending on the distance (high above the air, where
   * nothing holds it back). The jet follows the arc nose-first; the camera stays with it.
   *
   * The landing: a cinematic wingman tracking shot following the jet down the glide slope toward
   * the landmark, flaring over the vantage point and smoothly handing over to the surface view.
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
    const lat = lm.vantageLat ?? lm.lat;
    const lon = lm.vantageLon ?? lm.lon;
    // The real ground under the landmark
    if (lm.body === 'Earth') {
      site.addScaledVector(up, earthElevation.heightKm(lat, lon, 12) / kmNear);
      const g = this.drawnGround(b, site, up);
      if (g !== null) {
        const clampedG = Math.max(g, -0.08 / kmNear);
        this.siteFix = this.siteFix === null ? clampedG : this.siteFix + (clampedG - this.siteFix) * Math.min(1, dt * 3);
      }
      site.addScaledVector(up, this.siteFix ?? 0);
      void earthElevation.ensure(lat - 0.05, lon - 0.05, lat + 0.05, lon + 0.05, 12);
    } else {
      site.addScaledVector(up, groundHeightKm(lm.body, lat, lon) / kmNear);
      void elevationFor(lm.body)?.ensure(lat - 0.1, lon - 0.1, lat + 0.1, lon + 0.1, 8);
    }
    input.pitch = input.roll = input.yaw = 0;
    this.gearDown = true;

    // Where the final approach begins: aligned with the landmark's viewing direction so the landmark is dead ahead
    if (!this.hop && !this.cutscene) {
      const rel = this.lv3.subVectors(f.position, site);
      const horiz = rel.clone().addScaledVector(up, -rel.dot(up));
      const horizKm = horiz.length() * kmNear;
      let back: THREE.Vector3;
      if (lm.viewHeadingDeg !== undefined) {
        const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(b.bundle.bodyGroup.quaternion);
        const north = pole.addScaledVector(up, -pole.dot(up)).normalize();
        const east = new THREE.Vector3().crossVectors(north, up).normalize();
        const h = THREE.MathUtils.degToRad(lm.viewHeadingDeg);
        const viewFwd = north.multiplyScalar(Math.cos(h)).addScaledVector(east, Math.sin(h)).normalize();
        back = viewFwd.negate();
      } else {
        back = horizKm > 0.01 ? horiz.normalize() : new THREE.Vector3().crossVectors(up, new THREE.Vector3(0, 1, 0)).normalize();
      }
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
    const approach = site.clone().addScaledVector(hop.back, 2.6 / kmNear).addScaledVector(up, 0.55 / kmNear);

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
      this.telemetry.landingDistKm = approach.distanceTo(f.position) * kmNear + 2.6;
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
    const lm = this.landing;
    const rel = this.flight.position.clone().sub(site);
    const altKm = rel.dot(up) * kmNear;
    const horiz = rel.clone().addScaledVector(up, -rel.dot(up));
    const outKm = Math.max(1.4, Math.min(horiz.length() * kmNear, 3.2));
    let back = this.hop?.back.clone();
    if (!back && lm?.viewHeadingDeg !== undefined) {
      const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(b.bundle.bodyGroup.quaternion);
      const north = pole.addScaledVector(up, -pole.dot(up)).normalize();
      const east = new THREE.Vector3().crossVectors(north, up).normalize();
      const h = THREE.MathUtils.degToRad(lm.viewHeadingDeg);
      back = north.multiplyScalar(Math.cos(h)).addScaledVector(east, Math.sin(h)).normalize().negate();
    }
    if (!back) back = horiz.lengthSq() > 1e-14 ? horiz.normalize() : new THREE.Vector3(1, 0, 0);
    const side = new THREE.Vector3().crossVectors(up, back).normalize();
    this.cutscene = {
      t: 0, from: this.flight.position.clone(), back, side,
      startAltKm: Math.max(0.32, Math.min(altKm, 0.75)),
      startOutKm: outKm,
      viewBefore: this.view, touched: false,
    };
    void kmNear;
  }

  /** Act two: down the glide slope, flare over the landmark vantage point, and hand over to SurfaceObserver. */
  private flyCutscene(dt: number, input: FlightInput, b: BodyInfo, site: THREE.Vector3, up: THREE.Vector3, kmNear: number): void {
    const c = this.cutscene!;
    const f = this.flight;
    const lm = this.landing!;
    const groundReady = !this.groundReady || this.groundReady();
    if (c.t > 0 || groundReady || (c.hold = (c.hold ?? 0) + dt) > 3.5) c.t += dt;
    const APPROACH = 5.0;
    const ROLL = 1.6;
    const endAltKm = lm.body === 'Earth' ? Math.max(0.045, lm.vantageAltKm ?? 0.045) : 0.005;
    let outKm: number;
    let altKm: number;
    if (c.t < APPROACH) {
      const x = THREE.MathUtils.smoothstep(c.t / APPROACH, 0, 1);
      outKm = c.startOutKm * (1 - x);
      altKm = endAltKm + (c.startAltKm - endAltKm) * Math.pow(1 - x, 1.5);
    } else {
      const y = Math.min(1, (c.t - APPROACH) / ROLL);
      outKm = -0.06 * (1 - Math.pow(1 - y, 2));
      altKm = endAltKm;
      if (!c.touched) {
        c.touched = true;
        for (let k = 0; k < 12; k++) {
          const p = f.position.clone().addScaledVector(c.side, ((k % 2) * 2 - 1) * 0.002 / kmNear).addScaledVector(c.back, (Math.random() * 0.01) / kmNear);
          this.smoke.emit(p, 2 + Math.random() * 2, 4, 2.5, 0.55);
        }
        this.shake = Math.max(this.shake, 0.45);
      }
    }
    const pos = site.clone().addScaledVector(c.back, outKm / kmNear).addScaledVector(up, altKm / kmNear);
    const vel = pos.clone().sub(f.position).divideScalar(Math.max(dt, 1e-4));
    f.position.copy(pos);
    f.velocity.copy(vel);
    const fwd = c.back.clone().negate();
    const flare = c.t < APPROACH ? THREE.MathUtils.smoothstep(c.t, APPROACH - 2.0, APPROACH) : Math.max(0, 1 - (c.t - APPROACH) * 1.5);
    const pitch = (3 + 6 * flare) * (Math.PI / 180);
    const nose = fwd.clone().multiplyScalar(Math.cos(pitch)).addScaledVector(up, Math.sin(pitch)).normalize();
    this.m1.lookAt(new THREE.Vector3(), nose, up);
    this.q1.setFromRotationMatrix(this.m1);
    f.quaternion.slerp(this.q1, 1 - Math.exp(-6 * dt));
    f.rates.set(0, 0, 0);
    input.boost = false;
    input.throttle = this.throttle = c.t < APPROACH ? 0.35 : 0.08;
    this.scripted = true;
    this.telemetry.landingDistKm = Math.max(0, outKm);
    this.fade = THREE.MathUtils.clamp((c.t - (APPROACH + ROLL - 0.8)) / 0.8, 0, 1);
    if (c.t >= APPROACH + ROLL + 0.1) {
      this.landing = null;
      this.hop = null;
      this.cutscene = null;
      this.scripted = false;
      this.fade = 0;
      this.siteFix = null;
      this.landRequest?.(lm);
    }
    void b;
  }

  /**
   * The cutscene camera: a cinematic wingman tracking view behind and slightly beside/above the
   * jet with a natural 55° FOV, looking past the airframe at the landmark ahead. Never drops FOV
   * to 1.2° (which frustum-culled 3D tiles and broke GoPro mode) and never goes below terrain.
   */
  private placeCutsceneCamera(camera: THREE.PerspectiveCamera): boolean {
    const c = this.cutscene;
    const lm = this.landing;
    if (!c || !lm) return false;
    const site = this.lv1;
    const up = this.lv2;
    const b = this.landmarkFrame(lm, site, up);
    if (!b) return false;
    const kmNear = b.radiusKm / b.radius;
    const progress = THREE.MathUtils.clamp(c.t / 6.6, 0, 1);
    const sideOffsetKm = 0.008 * (1 - 0.65 * progress);
    const backOffsetKm = 0.024 * (1 - 0.25 * progress);
    const upOffsetKm = 0.0055;
    const cam = this.flight.position
      .clone()
      .addScaledVector(c.back, backOffsetKm / kmNear)
      .addScaledVector(c.side, sideOffsetKm / kmNear)
      .addScaledVector(up, upOffsetKm / kmNear);
    const fwd = c.back.clone().negate();
    const lookTarget = this.flight.position
      .clone()
      .addScaledVector(fwd, 0.085 / kmNear)
      .addScaledVector(up, -0.003 / kmNear);
    camera.position.copy(cam);
    camera.up.copy(up);
    camera.lookAt(lookTarget);
    camera.fov = 60;
    return true;
  }

  /** Offsets (render units, along up) from the height data to the ground as drawn, for the landing. */
  private siteFix: number | null = null;
  private groundRay = new THREE.Raycaster();

  /**
   * Where the drawn ground is under a point: the offset along `up` (render units) from the point to
   * the finest visible terrain tile below or above it, or null where no tile is drawn.
   */
  private drawnGround(b: BodyInfo, at: THREE.Vector3, up: THREE.Vector3): number | null {
    const kmNear = b.radiusKm / b.radius;
    const photo = b.name === 'Earth' ? PhotorealEarth.current?.raycastTarget() ?? null : null;
    const tiles: THREE.Object3D[] = [];
    if (photo) {
      const maxRUnits = 0.8 / kmNear;
      const maxHorizUnits = 0.5 / kmNear;
      photo.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || !m.geometry) return;
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const bs = m.geometry.boundingSphere!;
        const rUnits = bs.radius * m.matrixWorld.getMaxScaleOnAxis();
        if (rUnits > maxRUnits) return;
        const c = bs.center.clone().applyMatrix4(m.matrixWorld);
        if (c.distanceTo(at) <= rUnits + maxHorizUnits) tiles.push(m);
      });
    } else {
      b.bundle.surfaceMesh.traverse((o) => {
        if (o.name.startsWith('tile_') && o.visible && o.parent?.visible !== false) tiles.push(o);
      });
    }
    if (tiles.length === 0) return null;
    this.groundRay.set(at.clone().addScaledVector(up, 15 / kmNear), up.clone().negate());
    this.groundRay.far = 30 / kmNear;
    const zOf = (o: THREE.Object3D): number => Number(o.name.slice(5).split('/')[0]);
    const hit = this.groundRay.intersectObjects(tiles, false).sort((p, q) => zOf(q.object) - zOf(p.object))[0];
    return hit ? hit.point.sub(at).dot(up) : null;
  }

  /** The drawn ground under the jet on Google's 3D Earth: its distance from Earth's centre (render units). */
  private photoGround: { r: number; at: THREE.Vector3; reach: number } | null = null;
  /** Google's ground minus the height data's under the jet, km (null until measured). */
  public tileGroundOffsetKm: number | null = null;
  private photoProbeTick = 0;
  private photoRay = new THREE.Raycaster();
  private pv1 = new THREE.Vector3();
  private pv2 = new THREE.Vector3();
  private pnm = new THREE.Matrix3();

  /**
   * Solid ground on Google's 3D Earth. Two rays against the tiles on screen, every third frame
   * while low:
   *  - straight down from just above the jet: the real surface under it (a rooftop, a bridge
   *    deck, a mountainside), which the altitude, the ground contact and "pull up" then use in
   *    place of the coarse height map (that has no buildings, and is 10 to 100 m off Google's
   *    heights, which are measured from the ellipsoid and not from sea level);
   *  - ahead along the flight path: a wall or a cliff about to be flown into. The jet glances off
   *    it (velocity reflected, most of the speed kept) and is shaken.
   */
  private probePhotoGround(b: BodyInfo, dt: number): void {
    const f = this.flight;
    const kmNear = b.radiusKm / b.radius;
    const target = b.name === 'Earth' && !this.scripted ? PhotorealEarth.current?.raycastTarget() ?? null : null;
    // Only near the ground (within 4 km of the height map's ground): higher up the map is enough
    const rough = f.position.distanceTo(b.center) - b.radius;
    // Fetch the ground ahead of the jet while it is low enough to see detail: about 4 s of travel
    // ahead (less when very fast, so the view ahead stays on the ground it is about to cross)
    const photo = PhotorealEarth.current;
    if (photo && b.name === 'Earth') {
      if (rough * kmNear < 80 && !this.scripted) {
        const speedKmS = f.velocity.length() * kmNear;
        const lead = THREE.MathUtils.clamp(25 / Math.max(speedKmS, 0.05), 1.2, 5);
        photo.setLookahead(f.position, f.velocity, b.center, lead);
        photo.setSurround(f.position, b.center);
      } else {
        photo.setLookahead(null);
        photo.setSurround(null);
      }
    }
    if (!target || rough * kmNear > 13) {
      this.photoGround = null;
      if (b.name === 'Earth' || !target) PhotorealEarth.current?.setGroundProbe(null);
      return;
    }
    // The ground straight under the jet is off the bottom of the screen: keep it loaded
    PhotorealEarth.current?.setGroundProbe(f.position, b.center);
    if (this.photoProbeTick++ % 3 !== 0) return;
    const up = this.pv1.subVectors(f.position, b.center).normalize();
    const ray = this.photoRay;
    (ray as THREE.Raycaster & { firstHitOnly?: boolean }).firstHitOnly = true;

    // Down: from 9 km above the jet, so the first surface met is always the true top of the ground
    // (a rooftop, a mountain), even when the jet has ended up under it. A ray from just above the
    // jet never saw ground over its head: once the height map was missing (so the jet thought
    // the ground was at sea level, 600 m under Las Vegas) it flew under the city and stayed there,
    // the buildings hanging upside down overhead. With the ground found above, the contact below
    // lifts the jet straight back out.
    const fromKm = 9;
    ray.set(this.pv2.copy(f.position).addScaledVector(up, fromKm / kmNear), up.clone().negate());
    ray.far = (fromKm + 6) / kmNear;
    const down = ray.intersectObject(target, true)[0];
    if (down) {
      const at = this.photoGround?.at ?? new THREE.Vector3();
      at.copy(f.position);
      // Good for the next few frames of travel, and at least 60 m around
      const reach = Math.max(0.06 / kmNear, f.velocity.length() * 0.3);
      this.photoGround = { r: down.point.distanceTo(b.center), at, reach };
      // The tiles' ground against the height data's, here (the procedural terrain sits just under
      // the tiles by this: see ProceduralTerrain.setTileOffset). Open ground only: over a town the
      // ray meets roofs, so the lowest of the recent readings is kept
      const ll = this.earthLatLon();
      if (ll) {
        const [sx, sy, sz] = bodyLatLonToLocal('Earth', ll.lat, ll.lon);
        const seaR = this.lv3.set(sx, sy, sz).applyMatrix4(b.bundle.surfaceMesh.matrixWorld).distanceTo(b.center);
        const dem = groundHeightKm('Earth', ll.lat, ll.lon, 13);
        if (dem > 0) {
          const off = (this.photoGround.r - seaR) * kmNear - dem;
          this.tileGroundOffsetKm = this.tileGroundOffsetKm === null ? off : Math.min(off, this.tileGroundOffsetKm + 0.0005);
        }
      }
    } else {
      this.photoGround = null;
    }

    // Ahead: what the jet reaches in the next ~0.15 s (and at least 12 m)
    const speed = f.velocity.length();
    if (speed < 1e-12) return;
    const dir = this.pv2.copy(f.velocity).divideScalar(speed);
    const look = Math.max(0.012 / kmNear, speed * Math.max(0.15, dt * 5));
    ray.set(f.position, dir);
    ray.far = look;
    const wall = ray.intersectObject(target, true)[0];
    if (!wall || !wall.face) return;
    const n = wall.face.normal.clone().applyMatrix3(this.pnm.getNormalMatrix(wall.object.matrixWorld)).normalize();
    if (n.dot(dir) > 0) n.negate();
    // Level ground met at a shallow angle is the down ray's business (a landing, a low pass)
    if (n.dot(up) > 0.8) return;
    const into = f.velocity.dot(n);
    if (into >= 0) return;
    // A slope (a hillside, a tree crown, the edge of a roof): the jet slides over it, its speed
    // into the slope taken away, no bounce and no kick to the nose. Treating every slope as a wall
    // threw the jet back up whenever it skimmed the ground over woods or rooftops
    if (n.dot(up) > 0.35) {
      f.velocity.addScaledVector(n, -into);
      f.speed = f.velocity.length();
      this.shake = Math.min(0.6, this.shake + 0.08);
      return;
    }
    f.velocity.addScaledVector(n, -1.35 * into).multiplyScalar(0.8);
    f.speed = f.velocity.length();
    // Nose away from the wall, and a hard knock
    f.rates.x = Math.max(f.rates.x, 0.9);
    this.shake = Math.min(1.8, this.shake + 1);
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
      // Triggers measured from where they rest (worn ones never read zero: see PadTrigger)
      const rt = this.trigger(p.index, 7, p.buttons[7]?.value ?? 0);
      const lt = this.trigger(p.index, 6, p.buttons[6]?.value ?? 0);
      if (rt !== 0 || lt !== 0) this.throttle = THREE.MathUtils.clamp(this.throttle + (rt - lt) * dt * 0.6, 0, 1);
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

  /** Each pad trigger's resting state (see PadTrigger), keyed "pad:button". */
  private triggerRest = new Map<string, TriggerRest>();

  private trigger(pad: number, button: number, v: number): number {
    const key = `${pad}:${button}`;
    const { pull, state } = triggerPull(this.triggerRest.get(key), v, performance.now());
    this.triggerRest.set(key, state);
    return pull;
  }

  // ------------------------------------------------------------------ frame

  /**
   * Advance the jet and place the camera. Called by the scene each frame after the ephemerides
   * have moved the worlds and before anything is drawn.
   */
  public update(dt: number, timeSec: number, camera: THREE.PerspectiveCamera, width: number, height: number, toScreen: NdcToScreen): void {
    if (!this.active || !this.model) return;
    // Held (behind the fly page's preloader): time almost stands still while the world streams in
    dt = this.hold ? 1e-4 : Math.min(dt, 0.05);
    const f = this.flight;

    // --- Worlds: where they are now, the nearest surface, the dominant frame
    let nearest: BodyInfo | null = null;
    let nearestAlt = Infinity;
    let dominant: BodyInfo | null = null;
    let dominance = 0;
    let nearestSc: BodyInfo | null = null;
    let nearestScScore = Infinity;
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
      if (b.spacecraft) {
        const dSc = b.center.distanceTo(f.position);
        const score = b.name === this.target ? dSc * 0.5 : dSc;
        if (score < nearestScScore) {
          nearestScScore = score;
          nearestSc = b;
        }
        continue;
      }
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

    const scGapDist = nearestSc ? nearestSc.center.distanceTo(f.position) : Infinity;
    const scBubble = nearestSc ? Math.max(4.5, nearestSc.radius * 16) : 0;
    const scInspect = !this.transit && !this.landing && !!nearestSc && scGapDist < scBubble;

    // --- Ride the dominant world or station-keep alongside a nearby NASA spacecraft
    const ride = dominant && dominance > 1 / 400 ? dominant : null;
    if (scInspect && nearestSc) {
      if (this.scAnchorName === nearestSc.name && this.scAnchorValid) {
        const scDelta = this.v1.subVectors(nearestSc.center, this.scAnchorPrev);
        f.position.add(scDelta);
        this.shiftAir(scDelta, null, nearestSc.center);
      }
      this.scAnchorName = nearestSc.name;
      this.scAnchorPrev.copy(nearestSc.center);
      this.scAnchorValid = true;
      // Keep planetary ride bookkeeping synchronized cleanly when leaving the spacecraft bubble
      this.anchor = ride;
      if (ride) this.anchorPrev.copy(ride.center);
      this.spinValid = false;
    } else {
      this.scAnchorName = null;
      this.scAnchorValid = false;
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
    }

    // --- Environment: altitude, scale, air
    const kmNear = nearest.radiusKm / nearest.radius; // km per unit at that world's surface
    // Worlds are drawn oblate (Earth 1/298, Saturn 1/10): measure height above that shape, not a sphere
    this.probePhotoGround(nearest, dt);
    this.ensureRelief(nearest, (f.position.distanceTo(nearest.center) - nearest.radius) * kmNear);
    const surfR = this.surfaceRadius(nearest, f.position);
    nearestAlt = f.position.distanceTo(nearest.center) - surfR;
    const altUnits = Math.max(0, nearestAlt);
    this.lastAltUnits = Math.max(altUnits, 1e-6);
    const altKm = altUnits * kmNear;
    const kmPerUnit = localKmPerUnit(altUnits, nearest.radius, nearest.radiusKm);
    this.lastKmPerUnit = kmPerUnit;
    this.vVertical.subVectors(f.position, nearest.center).normalize();
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
    const wp = this.aligning && nearest.name === 'Earth' ? this.waypointWorld(nearest, this.v3) : null;
    if (wp) {
      // Towards the waypoint along the ground: level, never a dive into the terrain
      const up = this.v2.subVectors(f.position, nearest.center).normalize();
      const want = this.v1.subVectors(wp, f.position);
      want.addScaledVector(up, -want.dot(up)).normalize();
      this.m1.lookAt(new THREE.Vector3(), want, up);
      this.q1.setFromRotationMatrix(this.m1);
      f.quaternion.rotateTowards(this.q1, 0.9 * dt);
      input.pitch = input.roll = input.yaw = 0;
    } else if (this.aligning && tgt) {
      const want = this.v1.subVectors(tgt.center, f.position).normalize();
      const up = this.v2.subVectors(f.position, nearest.center).normalize();
      this.m1.lookAt(new THREE.Vector3(), want, Math.abs(want.dot(up)) > 0.98 ? this.v3.set(0, 1, 0) : up);
      this.q1.setFromRotationMatrix(this.m1);
      f.quaternion.rotateTowards(this.q1, 1.6 * dt);
      input.pitch = input.roll = input.yaw = 0;
    }
    this.aligning = false;
    this.scripted = false;
    if (this.transit) this.flyTransit(dt, input);
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
    // Earth's speed tiers lift the jet's air limit and its low-level drive (see EarthTransit)
    const tier = nearest.name === 'Earth' ? SPEED_TIERS[this.speedTier] : SPEED_TIERS[0];
    if (!this.scripted) {
      let inspectFloorUnitsPerS: number | undefined;
      let inspectCeilingUnitsPerS: number | undefined;
      let inspectBlend: number | undefined;
      if (scInspect && nearestSc) {
        inspectBlend = 1 - THREE.MathUtils.smoothstep(scGapDist, nearestSc.radius * 3.5, scBubble);
        const clearSc = Math.max(0.12, scGapDist - nearestSc.radius * 0.85);
        inspectFloorUnitsPerS = 0.035;
        inspectCeilingUnitsPerS = Math.min(2.2, Math.max(0.28, clearSc * 0.72));
      }
      f.step(dt, input, {
        altitudeUnits: altUnits,
        kmPerUnit,
        airDensity: density,
        airLimitMps: tier.airLimitMps,
        driveFloorMps: tier.driveFloorMps,
        airAccelScale: tier.airAccelScale,
        inspectFloorUnitsPerS,
        inspectCeilingUnitsPerS,
        inspectBlend,
      });
    }
    // Home: where the jet first came into Earth's air
    if (!this.home && nearest.name === 'Earth' && density > 0.01) {
      const ll = this.earthLatLon();
      if (ll) this.home = { name: 'Home', lat: ll.lat, lon: ll.lon };
    }
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

    // --- Contact & Solid Physics Collision ---
    const isSun = nearest.bundle.definition.category === 'star';
    // On solid ground the jet may skim 3 m above it (low enough to feel the size of everything)
    const clearance = isSun ? nearest.radius * 0.08 : nearest.cloud ? nearest.radius * 0.002 : nearest.noSurface ? nearest.radius * 0.5 : 0.003 / kmNear;
    const vMps = 1 / unitsPerMps(kmPerUnit);
    const contactSurfR = this.surfaceRadius(nearest, f.position);
    const hit = resolveSurfaceContact(f.position, f.velocity, nearest.center, contactSurfR, clearance) * vMps;
    if (hit > 0 && hit < 30) {
      // A glancing touch: the jet skims along the ground instead of bouncing off it (the descent is
      // taken away, the nose eases level, a light rumble). Bouncing off every touch made flying
      // at ground level impossible: the jet was thrown back up to 40 m each time
      const upNorm = this.v1.subVectors(f.position, nearest.center).normalize();
      // The nose brought up to level (a share each frame) and its downward turn stopped; no upward
      // kick, so it does not overshoot into a climb
      const fwdNow = f.forward(this.v2);
      const down = Math.asin(THREE.MathUtils.clamp(-fwdNow.dot(upNorm), -1, 1));
      if (down > 0) {
        const right = this.v3.crossVectors(fwdNow, upNorm).normalize();
        f.quaternion.premultiply(this.q1.setFromAxisAngle(right, down * 0.35)).normalize();
        f.rates.x = Math.max(f.rates.x, 0);
      }
      f.velocity.multiplyScalar(0.997);
      f.speed = f.velocity.length();
      this.shake = Math.min(0.6, this.shake + 0.04 + hit / 300);
      const currentDist = f.position.distanceTo(nearest.center);
      if (currentDist < contactSurfR + clearance) {
        f.position.copy(nearest.center).addScaledVector(upNorm, contactSurfR + clearance);
      }
    } else if (hit > 0) {
      // A real impact: elastic rebound along local surface normal
      const upNorm = this.v1.subVectors(f.position, nearest.center).normalize();
      const reboundMps = Math.min(80, Math.max(16, hit * 0.45));
      f.velocity.addScaledVector(upNorm, reboundMps * unitsPerMps(kmPerUnit));
      // Deflect nose pitch upward away from ground / mountain face
      f.rates.x = Math.max(f.rates.x, 1.3);
      // Tangential scraping friction
      f.velocity.multiplyScalar(0.86);
      f.speed = f.velocity.length();
      // Physical impact shake
      this.shake = Math.min(1.8, this.shake + 0.8 + hit / 200);
      // Ensure position is strictly clamped above surface clearance
      const currentDist = f.position.distanceTo(nearest.center);
      if (currentDist < contactSurfR + clearance) {
        f.position.copy(nearest.center).addScaledVector(upNorm, contactSurfR + clearance);
      }
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
    const mach = (nearest.name === 'Earth' || density > 0) ? speedMps / (sound || 343) : 0;
    const supersonic = mach > 1;
    if (supersonic !== this.wasSupersonic && density > 0.08 && mach > 0.9 && mach < 1.25) this.shock.triggerVapourCone();
    this.wasSupersonic = supersonic;

    // --- Camera
    this.placeCamera(dt, camera, nearest, kmPerUnit, density, timeSec);
    const mpu = kmPerUnit * 1000; // metres per render unit

    // Overlay: the jet in metres around the camera
    const jetRel = this.v2.subVectors(f.position, camera.position).multiplyScalar(mpu);
    this.jetGroup.position.copy(jetRel);
    this.jetGroup.quaternion.copy(f.quaternion);
    this.overlayCamera.position.set(0, 0, 0);
    this.overlayCamera.quaternion.copy(camera.quaternion);
    this.overlayCamera.fov = camera.fov;
    this.overlayCamera.aspect = camera.aspect;
    const inCockpitView = (this.view === 'cockpit' || this.view === 'gopro') && !this.cutscene;
    this.model.setInsideView(inCockpitView);
    if (inCockpitView && this.mfdCount > 0) this.mfd.update(this.telemetry, timeSec);
    // Inside (cockpit, GoPro) the glass and the pilot are centimetres away: a near plane that does not clip them
    this.overlayCamera.near = inCockpitView ? 0.02 : 0.2;
    this.overlayCamera.updateProjectionMatrix();
    this.overlayCamera.updateMatrixWorld();
    // Inside you are the pilot: no body, no helmet in view (outside the pilot is seen in the seat)
    this.model.setPilotVisible(!inCockpitView);
    this.model.crew.visible = !inCockpitView;
    if (this.model.crewHead) this.model.crewHead.visible = !inCockpitView;
    if (this.cockpit) this.cockpit.group.visible = this.view === 'cockpit' && !this.cutscene && !this.model.hasInterior;

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
        // Inside a world's air, that world hiding the Sun is night (or dusk), not an eclipse
        if (b === nearest && density > 0) continue;
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
      this.lastSunUp = up.dot(sunDir);
      this.lastSunDir.copy(sunDir).normalize();
      // The world going on round the jet: birds low down, airliners and their contrails up high
      const earthAlive = this.bodyIndex.get('Earth');
      if (nearest.name === 'Earth' && earthAlive && altKm < 60) {
        this.alive ??= new AliveWorld();
        this.alive.attach(earthAlive.bundle.surfaceMesh);
        this.alive.setVisible(true);
        this.alive.update(dt, timeSec, f.position, earthAlive.bundle.surfaceMesh, altKm, this.lastSunUp);
      } else {
        this.alive?.setVisible(false);
      }
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
    const inside = inCockpitView;
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
    // The Sun on the canopy glass (its dust lights up looking towards it)
    this.model.setGlassSun(this.v1.copy(sunDir).transformDirection(this.overlayCamera.matrixWorldInverse), inside ? lit : 0);
    if (inside) this.model.setGlassEye(this.overlayCamera.getWorldPosition(this.v1));

    // The sky from inside the air is the world's own atmosphere shell (AtmosphereShader)

    // --- Engines, motes, trails, plasma
    const boost = f.boosting ? 1 : 0;
    this.model.update(timeSec, this.throttle, boost, 1 - Math.min(1, density * 8));
    this.shock.update(dt, timeSec, this.heat * (isSun ? 0.6 : 1), mach, density);
    // Motes stream past at the jet's speed relative to the air (or to the world it rides)
    this.field.update(dt, this.v1.copy(f.velocity).multiplyScalar(mpu), Math.min(1, density * 3), 0.25 + 0.75 * lit, mach, f.boosting);
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
      const ll = bodyLocalToLatLon(nearest.name, local.x, local.y, local.z);
      const upN = this.v2.subVectors(f.position, nearest.center).normalize();
      const sunUpRaw = upN.dot(this.v3.copy(f.position).negate().normalize());
      const sunUp = Math.max(0, sunUpRaw);
      this.subLat = ll.lat;
      this.subLon = ll.lon;
      this.subSunUp = sunUpRaw;
      const w = this.weather.update(dt, timeSec, {
        world: nearest.name, latDeg: ll.lat, lonDeg: ll.lon, altKm, airDensity: density,
        daylight: THREE.MathUtils.smoothstep(sunUp, -0.05, 0.25) * lit,
        airVelMps: this.lv1.copy(f.velocity).multiplyScalar(mpu), up: upN, camera, inside,
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
    this.resolveSpacecraftCollisions(f);
    const pxScale = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    this.smoke.update(dt, camera.position, mpu, pxScale, lit);

    // Speed blur: how fast the ground sweeps through the view (speed over height), boost, and
    // the drive in deep space; centred where the jet is actually going
    {
      const sweep = speedMps / Math.max(altKm * 1000, 60);
      const drive = speedMps > 2e4 ? Math.min(0.03, Math.log10(speedMps / 2e4) * 0.012) : 0;
      // The ground only smears once the jet is truly fast: at a few hundred km/h the eye still
      // reads every building (full blur from about 1,000 km/h near the ground)
      const gate = THREE.MathUtils.smoothstep(speedMps, 70, 300);
      // In air a light smear only: hypersonic speeds smeared the whole ground into soup
      const k = density > 0.02
        ? Math.min(0.018, (0.008 * Math.log2(1 + sweep * 2) + (f.boosting ? 0.006 : 0)) * gate)
        : Math.min(0.1, (0.035 * Math.log2(1 + sweep * 4) + (f.boosting ? 0.025 : 0)) * gate + drive);
      const dir = f.velocity.lengthSq() > 0 ? this.v1.copy(f.velocity).normalize() : f.forward(this.v1);
      const v = dir.applyQuaternion(this.q1.copy(camera.quaternion).invert());
      const tn = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const front = v.z < -0.05;
      this.telemetry.blur = this.cutscene ? 0 : (front ? k : k * 0.4);
      this.telemetry.blurNdc.x = front ? THREE.MathUtils.clamp(v.x / (-v.z * tn * camera.aspect), -1, 1) : 0;
      this.telemetry.blurNdc.y = front ? THREE.MathUtils.clamp(v.y / (-v.z * tn), -1, 1) : 0;
    }

    this.audio.update(timeSec, {
      throttle: this.throttle, boost, air: density, speedMps, inside, warning: this.scripted ? 0 : this.warning, gLoad: f.gLoad,
      altKm, greyOut: this.telemetry.greyOut, inCloud: this.weather.cloudInside > 0.3,
    });

    // --- Telemetry for the HUD, then the cockpit displays
    this.fillTelemetry(camera, width, height, toScreen, nearest, kmPerUnit, density, mach, speedMps, timeSec, tgt);
    if (this.audio.started && !this.scripted) {
      const onEarth = nearest.name === 'Earth';
      const place = onEarth && altKm < 80 ? placeNameAt(this.subLat, this.subLon, altKm) : null;
      this.director.update({
        timeSec, nearest: nearest.name, altKm, radiusKm: nearest.radiusKm, speedMps, mach, air: density,
        gLoad: f.gLoad, warning: this.warning, skyEvent: this.telemetry.skyEvent, inCloud: this.weather.cloudInside > 0.3,
        sunUp: this.subSunUp, lat: this.subLat, lon: this.subLon,
        country: place?.country ?? '', atSea: onEarth && altKm < 80 && placeAtSea(),
        earthDistKm: this.telemetry.earthDistKm,
      });
    }
    this.hudGlass?.update(this.telemetry, inside);
    if (this.controls) {
      const dest = this.destinations();
      const active = dest.items.findIndex((d) => d.row.active);
      this.destScroll = THREE.MathUtils.clamp(active - 4, 0, Math.max(0, dest.items.length - 9));
      const rows = dest.items.slice(this.destScroll, this.destScroll + 9).map((d) => d.row);
      const inp = this.lastInput;
      this.controls.update(dt, timeSec, inp.pitch, inp.roll, this.throttle, this.gearDown, this.abArmed, dest.title, rows, inside);
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

  private placeCamera(dt: number, camera: THREE.PerspectiveCamera, nearest: BodyInfo, kmPerUnit: number, density: number, timeSec: number): void {
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
    const machVal = speedMps / 343;
    const machKick = THREE.MathUtils.clamp((machVal - 0.7) * 2.2, 0, 48);
    const boostKick = f.boosting ? 12 : 0;
    const targetFovKick = boostKick + machKick + Math.min(8, Math.log10(1 + speedMps / 1000) * 1.6);
    this.fovKick += (targetFovKick - this.fovKick) * (1 - Math.exp(-3.5 * dt));

    // Under G the head sinks into the seat and tips forward a touch
    const g = this.flight.gLoad;
    this.headDrop += (THREE.MathUtils.clamp((g - 1) * 0.012, -0.03, 0.09) - this.headDrop) * (1 - Math.exp(-6 * dt));
    if (this.view === 'cockpit' || this.view === 'gopro') {
      // A head, not a turret: the angles chase the look on a critically damped spring (smooth
      // starts and stops, no overshoot), the neck lags the airframe's rotation a little, and the
      // head moves as a real one does when it turns: over the shoulder it slides sideways and
      // rises (you lean to see past the seat), looking up it tips back, and under G it sinks
      if (this.mouseHead && !this.lookDrag && performance.now() - this.lastHeadMove > 3000) {
        this.look.multiplyScalar(Math.exp(-1.2 * dt));
      }
      const w = 13; // spring rate, 1/s
      const ax = (this.look.x - this.head.x) * w * w - 2 * w * this.headVel.x;
      const ay = (this.look.y - this.head.y) * w * w - 2 * w * this.headVel.y;
      this.headVel.x += ax * dt;
      this.headVel.y += ay * dt;
      this.head.x += this.headVel.x * dt;
      this.head.y += this.headVel.y * dt;
      this.insideFovNow += (this.insideFov - this.insideFovNow) * (1 - Math.exp(-8 * dt));
      this.headQuat.slerp(f.quaternion, 1 - Math.exp(-14 * dt));
      if (this.headQuat.angleTo(f.quaternion) > 0.25) this.headQuat.copy(f.quaternion);
      const turn = Math.abs(Math.sin(this.head.x));
      const back = Math.max(0, -Math.cos(this.head.x));
      const lean = this.v3.set(
        -Math.sin(this.head.x) * 0.11,
        -this.headDrop + 0.05 * back + 0.03 * Math.max(0, this.head.y),
        0.05 * turn - 0.04 * Math.max(0, this.head.y),
      );
      const eye = this.v2.copy(this.model!.eye).add(lean).applyQuaternion(f.quaternion).multiplyScalar(upm);
      camera.position.copy(f.position).add(eye);
      camera.quaternion.copy(this.headQuat);
      camera.rotateY(this.head.x);
      camera.rotateX(this.head.y - this.headDrop * 0.6);
      // The head tilts a little into a look over the shoulder
      camera.rotateZ(-Math.sin(this.head.x) * 0.06);
      camera.fov = this.insideFovNow + this.fovKick * 0.5;
    }
    if (this.view === 'gopro') {
      // The GoPro is now at the eyes too (first person): the picture is an action camera's
      // Rigid mount: the airframe's buzz reaches the camera (more with power and afterburner)
      const buzz = (0.0004 + this.throttle * 0.0007 + (f.boosting ? 0.0012 : 0)) * (1 + this.shake);
      camera.rotateX(Math.sin(timeSec * 97) * Math.sin(timeSec * 13.1) * buzz);
      camera.rotateY(Math.sin(timeSec * 83 + 1.7) * buzz * 0.8);
      // Rendered wide; the lens folds it into an action camera's picture (zoom still applies)
      camera.fov = Math.min(140, this.insideFovNow * 1.32 + this.fovKick * 0.4);
    } else if (this.view === 'chase') {
      // The camera lags the airframe a little so turns show; drag right mouse to look around
      this.chaseQuat.slerp(f.quaternion, 1 - Math.exp(-5.5 * dt));
      if (!this.lookDrag) this.look.multiplyScalar(Math.exp(-1.5 * dt));
      this.q1.setFromEuler(new THREE.Euler(this.look.y * 0.8 - 0.06, this.look.x, 0, 'YXZ'));
      const q = this.q2.copy(this.chaseQuat).multiply(this.q1);
      const pullBack = 1 + THREE.MathUtils.clamp((machVal - 1) * 0.012 + (f.boosting ? 0.08 : 0), 0, 0.25);
      const effChaseDist = this.chaseDist * pullBack;
      const off = this.v2.set(0, effChaseDist * 0.17, effChaseDist).applyQuaternion(q).multiplyScalar(upm);
      camera.position.copy(f.position).add(off);
      camera.quaternion.copy(q);
      camera.fov = 60 + Math.min(54, this.fovKick);
    } else if (this.view === 'flyby') {
      this.flybyDirector(dt, timeSec, camera, f, upm, speedMps, fwd, nearest);
    }
    if (shakeAmp > 0) {
      const t = timeSec * 31;
      camera.rotateX(Math.sin(t) * Math.sin(t * 0.37) * shakeAmp);
      camera.rotateY(Math.sin(t * 1.3 + 1) * Math.sin(t * 0.29) * shakeAmp);
    }

    // --- Anti-Underground Camera Protection ---
    // The camera MUST NEVER clip into terrain, mountains, or landmark buildings
    if (nearest) {
      const camSurfR = this.surfaceRadius(nearest, camera.position);
      const camDist = camera.position.distanceTo(nearest.center);
      const camKmNear = nearest.radiusKm / nearest.radius;
      const minCamClearanceUnits = 0.005 / camKmNear; // Strict 5.0 metres clearance above ground/buildings
      const minAllowedDist = camSurfR + minCamClearanceUnits;

      if (camDist < minAllowedDist) {
        // Camera is trying to go underground or inside a mountain/building!
        this.camGroundUp.subVectors(camera.position, nearest.center).normalize();
        camera.position.addScaledVector(this.camGroundUp, minAllowedDist - camDist);
        if (this.view === 'chase' && camera.position.distanceTo(f.position) > 0.0001) {
          this.m1.lookAt(camera.position, f.position, this.camGroundUp);
          this.camLookQuat.setFromRotationMatrix(this.m1);
          camera.quaternion.slerp(this.camLookQuat, 0.75);
        }
      }

      // Spring-arm terrain line-of-sight check in chase mode: if terrain between jet and camera is higher, pull camera closer!
      if (this.view === 'chase') {
        this.camMidPoint.addVectors(f.position, camera.position).multiplyScalar(0.5);
        const midSurfR = this.surfaceRadius(nearest, this.camMidPoint);
        const midDist = this.camMidPoint.distanceTo(nearest.center);
        if (midDist < midSurfR + minCamClearanceUnits) {
          camera.position.lerp(f.position, 0.45);
          const newSurfR = this.surfaceRadius(nearest, camera.position);
          const newDist = camera.position.distanceTo(nearest.center);
          if (newDist < newSurfR + minCamClearanceUnits) {
            this.camGroundUp.subVectors(camera.position, nearest.center).normalize();
            camera.position.addScaledVector(this.camGroundUp, (newSurfR + minCamClearanceUnits) - newDist);
          }
          if (camera.position.distanceTo(f.position) > 0.0001) {
            this.camGroundUp.subVectors(camera.position, nearest.center).normalize();
            this.m1.lookAt(camera.position, f.position, this.camGroundUp);
            camera.quaternion.setFromRotationMatrix(this.m1);
          }
        }
      }
    }

    // Depth range for the world: near follows the actual height of the camera over the local ground
    const camDistAboveGround = nearest ? Math.max(0, camera.position.distanceTo(nearest.center) - this.surfaceRadius(nearest, camera.position)) : this.lastAltUnits;
    camera.near = Math.max(1e-6, Math.min(0.02, camDistAboveGround * 0.1));
    camera.far = Math.max(2.4e8, camera.position.length() * 2.5);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  /** Re-render the cube map that lights and reflects the jet. Called inside the floating-origin draw. */
  public captureEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    if (!this.active) return;
    {
      // The mirrors, live, while the cockpit is in view
      const inside = (this.view === 'cockpit' || this.view === 'gopro') && !this.cutscene && this.mirrorCount > 0;
      const fwd = this.flight.forward(this.vMirF);
      this.vMirU.set(0, 1, 0).applyQuaternion(this.flight.quaternion);
      const viewport = renderer.getViewport(new THREE.Vector4());
      this.mirror.render(renderer, scene, fwd, this.vMirU, Math.max(1e-6, this.lastAltUnits * 0.02), inside);
      // The cockpit displays' 3D views (synthetic vision ahead, the moving map below)
      const insideAny = (this.view === 'cockpit' || this.view === 'gopro') && !this.cutscene && this.mfdCount > 0 && perf.tier !== 'low';
      this.mfd.renderViews(renderer, scene, fwd, this.vMirU, this.vVertical, 1 / this.lastKmPerUnit, this.telemetry.altKm, Math.max(1e-6, this.lastAltUnits * 0.02), insideAny);
      // The canopy reflects the cockpit and the world beyond it: captured from the eye every few
      // frames (six draws of the cockpit each time; the reflection is faint, a lag never shows)
      if (insideAny && this.model && this.cockpitCubeFrame++ % (perf.tier === 'high' ? 6 : 10) === 0) {
        const bubble = this.model.canopyBubble;
        const wasVisible = bubble?.visible ?? false;
        if (bubble) bubble.visible = false;
        this.model.root.updateMatrixWorld(true);
        this.cockpitCube.position.copy(this.model.eye);
        this.model.root.localToWorld(this.cockpitCube.position);
        const target = renderer.getRenderTarget();
        const autoClear = renderer.autoClear;
        renderer.autoClear = true;
        // Beyond the cockpit the reflected ray leaves through the far side of the canopy: there it
        // sees the real world (the sky, the ground, the Sun), so the outside cube is the background
        // (a sphere of it rather than the scene's background: three.js draws a background with a
        // hidden mesh of its own, whose shader nothing could prepare ahead, 0.3 s on first use)
        this.cockpitSky ??= this.makeCockpitSky();
        this.cockpitSky.position.copy(this.cockpitCube.position);
        this.cockpitSky.visible = true;
        // The shadow maps are the frame's own: re-rendering them for each of the six faces was
        // most of this capture's cost
        const shadowAuto = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        this.cockpitCube.update(renderer, this.overlayScene);
        renderer.shadowMap.autoUpdate = shadowAuto;
        this.cockpitSky.visible = false;
        renderer.setRenderTarget(target);
        renderer.autoClear = autoClear;
        if (bubble) bubble.visible = wasVisible;
        // Sampled directly by the glass (no prefiltered copy to remake: see JetModel.setGlassReflection)
        this.model.setGlassReflection(this.cockpitCube.renderTarget.texture);
      }
      // Trees, low over Earth's 3D tiles
      const photo = PhotorealEarth.current;
      const earthB = this.bodyIndex.get('Earth');
      const low = this.telemetry.nearest === 'Earth' && this.telemetry.altKm < 1.6 && !!photo?.showing && !!earthB && perf.tier !== 'low';
      if (low && photo && earthB) {
        this.groundCover ??= new GroundCover();
        this.groundCover.attach(earthB.bundle.surfaceMesh);
        this.groundCover.setVisible(true);
        const gc = this.groundCover;
        gc.setSeason(photo.dayOfYearNow, this.telemetry.lat ?? 45, performance.now() / 1000);
        const surf = earthB.bundle.surfaceMesh;
        gc.setArea(1 / this.lastKmPerUnit);
        if (gc.captureDue) {
          // Each loaded tile's geometric error, so the trees go only on the fine ones (built only
          // when a capture runs; `engineData`, not the old `cached`, which logs a warning on every
          // read: read for every tile every frame, that was 40% of the page's script time)
          const tileErrors = new Map<THREE.Object3D, number>();
          for (const tile of photo.tiles.visibleTiles as Set<{ geometricError?: number; engineData?: { scene?: THREE.Object3D } }>) {
            const sc = tile.engineData?.scene;
            if (sc && typeof tile.geometricError === 'number') tileErrors.set(sc, tile.geometricError);
          }
          photo.withNeutralLight(() => gc.capture(renderer, photo.tiles.group, surf, this.vVertical, 1 / this.lastKmPerUnit, this.telemetry.altKm, tileErrors));
        }
        // Their shadows on the ground, towards the far side from the Sun
        gc.renderShadow(renderer, surf, this.lastSunDir, this.vVertical, 1 / this.lastKmPerUnit, this.lastSunUp);
        gc.setSky(this.lastSunUp);
        photo.setTreeShadow(gc.shadowTexture, gc.shadowMatrix);
      } else {
        this.groundCover?.setVisible(false);
        photo?.setTreeShadow(null, null);
      }
      renderer.setViewport(viewport);
    }
    // One face of the cube a turn, the six in the same time the whole cube took before: drawn all
    // at once it was the whole world six times in one frame (a 60-270 ms hitch every 12th frame)
    if (this.envFrame++ % Math.max(1, Math.round(perf.settings.envEvery / 6)) !== 0) return;
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
    const shadowAuto = renderer.shadowMap.autoUpdate;
    try {
      renderer.autoClear = true;
      renderer.shadowMap.autoUpdate = false;
      if (this.envCamera.coordinateSystem !== renderer.coordinateSystem) {
        this.envCamera.coordinateSystem = renderer.coordinateSystem;
        this.envCamera.updateCoordinateSystem();
      }
      const face = this.envFace;
      // Drawn on its own first, then copied into the cube cleaned: a single NaN pixel anywhere in
      // the scene (a star with a NaN colour did it) was blurred over the whole lighting map, and
      // every material of the jet lit by it went black, inside and out
      renderer.setRenderTarget(this.envFaceTarget);
      renderer.render(scene, this.envCamera.children[face] as THREE.PerspectiveCamera);
      renderer.setRenderTarget(this.envTarget, face);
      this.envClean.render(renderer);
      this.envFace = (face + 1) % 6;
      // Re-filtered for the jet's materials once the cube is whole again
      if (this.envFace === 0) this.envTarget.texture.needsPMREMUpdate = true;
    } finally {
      renderer.shadowMap.autoUpdate = shadowAuto;
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
    if (target.spacecraft) {
      const dUnits = target.center.distanceTo(this.flight.position);
      const closeThreshold = Math.max(8, target.radius * 24);
      if (dUnits < closeThreshold) {
        const scKmPerUnit = (target.radiusKm > 0 ? target.radiusKm : 0.05) / Math.max(target.radius, 0.05);
        return Math.max(0, (dUnits - target.radius) * scKmPerUnit);
      }
      return Math.max(0, dUnits * KM_PER_UNIT);
    }
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
    if (nearest.name === 'Earth') {
      const local = this.v1.copy(f.position).applyMatrix4(this.m1.copy(nearest.bundle.surfaceMesh.matrixWorld).invert());
      const ll = bodyLocalToLatLon('Earth', local.x, local.y, local.z);
      t.lat = ll.lat;
      t.lon = ll.lon;
    } else {
      t.lat = undefined;
      t.lon = undefined;
    }
    if (!nearest.noSurface && !nearest.cloud && nearest.name !== 'Sun') {
      const local = this.v1.copy(f.position).applyMatrix4(this.m1.copy(nearest.bundle.surfaceMesh.matrixWorld).invert());
      const ll = bodyLocalToLatLon(nearest.name, local.x, local.y, local.z);
      t.bodyLat = ll.lat;
      t.bodyLon = ll.lon;
    } else {
      t.bodyLat = undefined;
      t.bodyLon = undefined;
    }
    t.sunDistKm = f.position.length() * KM_PER_UNIT;
    // Near Earth its drawn size is exaggerated (the local scale is not the Solar System's): there
    // the height says it; elsewhere the positions are at true scale
    const earthB = this.bodyIndex.get('Earth');
    t.earthDistKm = nearest.name === 'Earth' ? shownAltKm + nearest.radiusKm : earthB ? f.position.distanceTo(earthB.center) * KM_PER_UNIT : 0;
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
    t.speedTier = SPEED_TIERS[this.speedTier].label;
    const inCloud = this.weather.cloudInside > 0.3;
    if (inCloud && !this.wasInCloud) this.radio('In cloud · on instruments');
    this.wasInCloud = inCloud;
    this.radioT = Math.max(0, this.radioT - 1 / 60);
    t.radio = this.radioT > 0 ? this.radioText : '';
    t.askPitch = this.pitchUnasked;
    t.transitName = this.transit?.name ?? '';
    if (!this.transit) t.transitKm = 0;
    t.destinationName = this.earthDestination?.name ?? '';
    {
      const w = this.waypoint;
      const wpw = w && t.lat !== undefined && t.lon !== undefined ? this.waypointWorld(nearest, new THREE.Vector3()) : null;
      if (w && wpw && t.lat !== undefined && t.lon !== undefined) {
        const distKm = greatCircleKm(t.lat, t.lon, w.lat, w.lon);
        const p1 = THREE.MathUtils.degToRad(t.lat), p2 = THREE.MathUtils.degToRad(w.lat), dl = THREE.MathUtils.degToRad(w.lon - t.lon);
        const brg = (THREE.MathUtils.radToDeg(Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl))) + 360) % 360;
        const p = this.projectDir(wpw.sub(camera.position), camera, toScreen);
        const gs = Math.max(0.01, f.velocity.length() * kmPerUnit); // km/s
        t.waypoint = { name: w.name, distKm, bearingDeg: brg, etaS: distKm / gs, x: p?.x ?? 0, y: p?.y ?? 0, on: !!p?.on, angle: p?.angle ?? 0 };
        if (!w.arrived && distKm < 4) {
          w.arrived = true;
          this.radio(`Over ${w.name} · L to land`, 6);
        }
      } else t.waypoint = null;
    }
    t.hasHome = !!this.home;
    t.landMenu = this.landMenu;
    t.gearDown = this.gearDown;
    t.weatherMode = this.weather.mode;
    t.abArmed = this.abArmed;
    t.lens = this.view === 'gopro' && !this.cutscene && !this.landing ? 'gopro' : null;
    t.sunInView = this.flare.inView;
    {
      const inside = (this.view === 'cockpit' || this.view === 'gopro') && !this.cutscene;
      const sc = this.flare.screen;
      const onScreen = sc.z > 0 && Math.abs(sc.x) < 1.6 && Math.abs(sc.y) < 1.6;
      t.canopySun = { x: sc.x, y: sc.y, k: inside && onScreen ? Math.min(1, this.flare.inView * 1.4 + 0.15) * this.lastLit : 0 };
      // God rays: in air, the Sun in front (even a little off the frame), above the horizon
      const near = sc.z > 0 && Math.abs(sc.x) < 1.8 && Math.abs(sc.y) < 1.8;
      const airK = Math.min(1, t.airDensity * 6);
      t.sunNdc = { x: sc.x, y: sc.y, k: near ? this.lastLit * airK * Math.max(0, 1 - Math.hypot(sc.x, sc.y) / 2.2) : 0 };
      // Grey-out: the pilot's eyes in the air, from about 5 g; held back in the GoPro (a camera does not black out)
      const gTarget = this.view === 'cockpit' && !this.cutscene && t.airDensity > 0 ? THREE.MathUtils.smoothstep(f.gLoad, 5, 9) : 0;
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
    t.warning = this.scripted ? 0 : this.warning;
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
    // In a daytime sky the planets are not visible: no labels for them (the Moon still shows)
    const daySky = t.airDensity > 0.05 && this.lastSunUp > 0.02;
    for (const name of TARGET_ORDER) {
      const b = this.bodyIndex.get(name);
      if (!b || name === this.target) continue;
      if (daySky && name !== 'Moon') continue;
      const to = new THREE.Vector3().subVectors(b.center, camera.position);
      const d = b.center.distanceTo(f.position);
      // Moons and spacecraft only near their planet, so the sky isn't cluttered
      if (b.bundle.definition.category === 'moon' && d > 3500) continue;
      if (b.spacecraft && d > 4500) continue;
      const p = this.projectDir(to, camera, toScreen);
      if (!p || !p.on) continue;
      // Skip worlds that already fill a good part of the view
      const ang = Math.atan2(b.radius, d);
      if (ang > THREE.MathUtils.degToRad(camera.fov) * 0.25) continue;
      t.markers.push({ name, x: p.x, y: p.y, distKm: this.trueGapKm(b, nearest, shownAltKm), target: false });
    }
    // The fly-by is a film camera, not the pilot's: no aiming symbols over the shot (the flight-path
    // marker sat right on the jet in the overhead shot)
    if (this.view === 'flyby') {
      t.nose = null;
      t.fpv = null;
      t.targetScreen = null;
      t.markers.length = 0;
    }
    this.emit();
  }

  /** Oriented bounding-box + sphere hull collision against NASA spacecraft & comets. */
  private resolveSpacecraftCollisions(f: FlightModel): void {
    const jetMargin = 0.014;
    const localPos = this.v1;
    const localNorm = this.v2;
    const worldNorm = this.v3;
    const qInv = this.q1;

    for (const b of this.bodies) {
      if (!b.spacecraft || b.noSurface) continue;
      const scMargin = Math.min(jetMargin, b.radius * 0.06);
      const hx = (b.halfExtents?.x ?? b.radius * 0.8) + scMargin;
      const hy = (b.halfExtents?.y ?? b.radius * 0.8) + scMargin;
      const hz = (b.halfExtents?.z ?? b.radius * 0.8) + scMargin;
      const broadR = Math.hypot(hx, hy, hz) + 0.02;
      if (f.position.distanceToSquared(b.center) > broadR * broadR) continue;

      qInv.copy(b.bundle.bodyGroup.quaternion).invert();
      localPos.subVectors(f.position, b.center).applyQuaternion(qInv);

      const dx = hx - Math.abs(localPos.x);
      const dy = hy - Math.abs(localPos.y);
      const dz = hz - Math.abs(localPos.z);
      if (dx <= 0 || dy <= 0 || dz <= 0) continue;

      // Penetrated the craft's oriented bounding envelope: extrude along minimum axis
      localNorm.set(0, 0, 0);
      let pen = dx;
      if (dx <= dy && dx <= dz) {
        localNorm.x = localPos.x >= 0 ? 1 : -1;
        pen = dx;
      } else if (dy <= dz) {
        localNorm.y = localPos.y >= 0 ? 1 : -1;
        pen = dy;
      } else {
        localNorm.z = localPos.z >= 0 ? 1 : -1;
        pen = dz;
      }

      worldNorm.copy(localNorm).applyQuaternion(b.bundle.bodyGroup.quaternion).normalize();
      f.position.addScaledVector(worldNorm, pen + 0.002);

      const vn = f.velocity.dot(worldNorm);
      if (vn < 0) {
        f.velocity.addScaledVector(worldNorm, -1.25 * vn);
        f.speed = f.velocity.length();
        this.shake = Math.min(1.5, this.shake + 0.65);
      }
    }
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
    this.envFaceTarget.dispose();
    this.envClean.dispose();
    (this.envClean.material as THREE.Material).dispose();
    this.mirror.dispose();
    this.mfd.dispose();
    this.cockpitCube.renderTarget.dispose();
    this.groundCover?.dispose();
    this.alive?.dispose();
    this.audio.dispose();
    this.listeners.clear();
  }
}
