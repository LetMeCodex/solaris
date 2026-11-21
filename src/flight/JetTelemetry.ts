/**
 * Canonical jet telemetry, aerodynamic/FBW mode, control-surface, and MFD page contract
 * shared across flight physics, cockpit HUD/MFD instrumentation, camera/head motion, and audio.
 *
 * Sign conventions in body frame (-Z nose, +Y up, +X right):
 * - `aoaDeg`: positive nose-up relative to incoming airflow (FPM `-o-` drops below boresight `-W-`).
 * - `aosDeg`: positive nose-left sideslip (relative velocity vector sits to +X right of nose).
 * - `surfaces`: angles in radians, clamped normalized ratios in [0..1], stick commands in [-1..1].
 */

export type JetView = 'chase' | 'cockpit' | 'gopro' | 'flyby';

export type JetAirframeId = 'gripen' | 'su30' | 'kestrel';

export type FbwMode = 'norm' | 'high-g' | 'psm';

export type FlapMode = 'auto' | 'combat' | 'land';

export type ManeuverKind =
  | 'none'
  | 'cobra'
  | 'kulbit'
  | 'herbst'
  | 'high-g-drift'
  | 'spin'
  | 'flare';

export type MfdSlot = 'left' | 'centre' | 'right';

export type MfdPage = 'PFD' | 'FCS' | 'ENG' | 'NAV';

export type MfdPageMap = Record<MfdSlot, MfdPage>;

export interface JetMarker {
  name: string;
  x: number;
  y: number;
  distKm: number;
  target: boolean;
}

export interface JetTargetScreenTelemetry {
  x: number;
  y: number;
  on: boolean;
  angle: number;
}

export interface JetWaypointTelemetry {
  name: string;
  distKm: number;
  bearingDeg: number;
  etaS: number;
  x: number;
  y: number;
  on: boolean;
  angle: number;
}

export interface JetHeadOffset {
  /** Lateral shift in metres (+X right) relative to nominal eyepoint. */
  x: number;
  /** Vertical shift in metres (+Y up) relative to nominal eyepoint. */
  y: number;
  /** Longitudinal shift in metres (+Z aft / -Z forward) relative to nominal eyepoint. */
  z: number;
}

/**
 * Live articulated control-surface deflections and TVC nozzle vectoring angles.
 * All angular fields are in radians; linear/iris deployments are normalized [0..1].
 */
export interface JetSurfaceState {
  /** Canard deflection in rad (+ trailing edge down = nose-up pitch lift ahead of CG). */
  canardRad: number;
  /** Left elevon / horizontal stabilator deflection in rad (+ trailing edge down). */
  elevonLeftRad: number;
  /** Right elevon / horizontal stabilator deflection in rad (+ trailing edge down). */
  elevonRightRad: number;
  /** Left trailing-edge flap / flaperon deflection in rad (+ trailing edge down). */
  flapLeftRad: number;
  /** Right trailing-edge flap / flaperon deflection in rad (+ trailing edge down). */
  flapRightRad: number;
  /** Vertical rudder deflection in rad (+ trailing edge right = nose-right yaw). */
  rudderRad: number;
  /** Left TVC nozzle pitch gimbal in rad (+ nozzle deflected up = nose-up pitch). */
  tvcPitchLeftRad: number;
  /** Right TVC nozzle pitch gimbal in rad (+ nozzle deflected up = nose-up pitch). */
  tvcPitchRightRad: number;
  /** Left TVC nozzle yaw gimbal in rad (+ nozzle deflected right = nose-right yaw). */
  tvcYawLeftRad: number;
  /** Right TVC nozzle yaw gimbal in rad (+ nozzle deflected right = nose-right yaw). */
  tvcYawRightRad: number;
  /** Leading-edge slat / droop deployment [0..1]. */
  slat: number;
  /** Speedbrake / dorsal airbrake deployment [0..1]. */
  airbrake: number;
  /** Landing gear extension progress [0..1]. */
  gear: number;
  /** Exhaust nozzle iris aperture [0..1] (0 = military pinch, 1 = full zone-3 AB flare). */
  nozzleIris: number;
  /** Pilot pitch command [-1..1] (+ nose up). */
  cmdPitch: number;
  /** Pilot roll command [-1..1] (+ right wing down). */
  cmdRoll: number;
  /** Pilot yaw command [-1..1] (+ nose right). */
  cmdYaw: number;
}

export interface JetTelemetry {
  active: boolean;
  speedMps: number;
  closingMps: number;
  /** Height above actual local ground/terrain surface (AGL), kilometres. */
  altKm: number;
  /** True height above Mean Sea Level / reference ellipsoid, metres. */
  altitudeMslM?: number;
  /** True height above local displaced terrain / landmark surface (AGL), metres. */
  altitudeAglM?: number;
  /** Sampled terrain / landmark elevation directly beneath the aircraft (MSL), metres. */
  terrainElevationM?: number;
  /** True when GPWS terrain proximity or terrain-closure warning is active. */
  terrainWarning?: boolean;
  /** Ground Proximity Warning System alert tier. */
  gpwsMode?: 'none' | 'caution' | 'pull-up';
  nearest: string;
  anchor: string;
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
  pxPerDeg: number;
  nose: { x: number; y: number } | null;
  fpv: { x: number; y: number } | null;
  target: string;
  targetDistKm: number;
  targetEtaS: number;
  targetScreen: JetTargetScreenTelemetry | null;
  markers: JetMarker[];
  warning: number;
  heat: number;
  helpOpen: boolean;
  muted: boolean;
  fullHud: boolean;
  blur: number;
  blurNdc: { x: number; y: number };
  lens: 'gopro' | null;
  sunInView: number;
  canopySun: { x: number; y: number; k: number };
  sunNdc: { x: number; y: number; k: number };
  greyOut: number;
  skyEvent: string;
  vibration: number;
  radio: string;
  askPitch: boolean;
  speedTier: string;
  transitName: string;
  transitKm: number;
  destinationName: string;
  hasHome: boolean;
  landingName: string;
  waypoint: JetWaypointTelemetry | null;
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
  bodyLat?: number;
  bodyLon?: number;
  sunDistKm: number;
  earthDistKm: number;

  // --- Phase 2: Airframe, Mass & Propulsion ---
  airframeId?: JetAirframeId;
  airframeName?: string;
  massKg?: number;
  dryMassKg?: number;
  fuelKg?: number;
  maxFuelKg?: number;
  fuelFrac?: number;
  fuelFlowKgS?: number;
  thrustN?: number;
  maxDryThrustN?: number;
  maxWetThrustN?: number;
  abStage?: 0 | 1 | 2 | 3;
  supercruise?: boolean;
  twRatio?: number;
  gravityMps2?: number;

  // --- Phase 2: Aerodynamics, Energy & Atmosphere ---
  iasMps?: number;
  tasMps?: number;
  dynamicPressurePa?: number;
  ambientTempK?: number;
  ambientPressurePa?: number;
  soundMps?: number;
  aoaDeg?: number;
  aosDeg?: number;
  fpvAngleDeg?: number;
  verticalSpeedMps?: number;
  /** Specific excess power Ps = V * (T - D) / W in m/s. */
  specificExcessPowerMps?: number;
  gPeak?: number;
  gMin?: number;
  gEffect?: number;
  cornerSpeedMps?: number;
  stallSpeedMps?: number;
  cl?: number;
  cd?: number;
  liftN?: number;
  dragN?: number;
  stallFactor?: number;
  vortexStrength?: number;
  groundEffect?: number;
  onGround?: boolean;
  touchdownImpulse?: number;

  // --- Phase 2: FBW, Maneuvers, Articulation & Cockpit ---
  fbwMode?: FbwMode;
  flapMode?: FlapMode;
  airbrakeActive?: boolean;
  wheelBrakeActive?: boolean;
  highGActive?: boolean;
  fpvHoldActive?: boolean;
  tvcActive?: boolean;
  maneuver?: ManeuverKind;
  maneuverTimerSec?: number;
  spinWarning?: boolean;
  alphaWarning?: boolean;
  overGWarning?: boolean;
  surfaces?: JetSurfaceState;
  headOffset?: JetHeadOffset;
  mfdPages?: MfdPageMap;
}

/** Zero-initialized control surface and TVC nozzle state. */
export function createJetSurfaceState(): JetSurfaceState {
  return {
    canardRad: 0,
    elevonLeftRad: 0,
    elevonRightRad: 0,
    flapLeftRad: 0,
    flapRightRad: 0,
    rudderRad: 0,
    tvcPitchLeftRad: 0,
    tvcPitchRightRad: 0,
    tvcYawLeftRad: 0,
    tvcYawRightRad: 0,
    slat: 0,
    airbrake: 0,
    gear: 0,
    nozzleIris: 0.25,
    cmdPitch: 0,
    cmdRoll: 0,
    cmdYaw: 0,
  };
}

/** Default MFD slot page assignment (`left: NAV`, `centre: PFD`, `right: ENG`). */
export function createDefaultMfdPages(): MfdPageMap {
  return {
    left: 'NAV',
    centre: 'PFD',
    right: 'ENG',
  };
}

/** Create a complete default telemetry frame safe for initial state or HUD labs. */
export function createDefaultJetTelemetry(
  overrides: Partial<JetTelemetry> = {},
): JetTelemetry {
  return {
    active: false,
    speedMps: 0,
    closingMps: 0,
    altKm: 0,
    altitudeMslM: 0,
    altitudeAglM: 0,
    terrainElevationM: 0,
    terrainWarning: false,
    gpwsMode: 'none',
    nearest: 'Earth',
    anchor: 'Earth',
    airWorld: 'Earth',
    airDensity: 0,
    mach: 0,
    gLoad: 1,
    throttle: 0,
    boost: 0,
    boostEnergy: 1,
    assist: true,
    aligning: false,
    view: 'cockpit',
    hasHorizon: true,
    pitchDeg: 0,
    rollDeg: 0,
    headingDeg: 0,
    pxPerDeg: 18,
    nose: null,
    fpv: null,
    target: 'Mars',
    targetDistKm: 0,
    targetEtaS: 0,
    targetScreen: null,
    markers: [],
    warning: 0,
    heat: 0,
    helpOpen: false,
    muted: false,
    fullHud: true,
    blur: 0,
    blurNdc: { x: 0, y: 0 },
    lens: null,
    sunInView: 0,
    canopySun: { x: 0.5, y: 0.5, k: 0 },
    sunNdc: { x: 0.5, y: 0.5, k: 0 },
    greyOut: 0,
    skyEvent: '',
    vibration: 0,
    radio: '',
    askPitch: false,
    speedTier: 'AIR',
    transitName: '',
    transitKm: 0,
    destinationName: 'Earth',
    hasHome: true,
    landingName: 'New York',
    waypoint: null,
    landingDistKm: 0,
    landMenu: false,
    gearDown: false,
    abArmed: false,
    weather: 'Clear',
    weatherMode: 'auto',
    localTime: 12,
    invertPitch: false,
    width: 1280,
    height: 720,
    timeSec: 0,
    sunDistKm: 149_597_870,
    earthDistKm: 0,
    airframeId: 'gripen',
    airframeName: 'JAS 39 GRIPEN',
    fbwMode: 'norm',
    flapMode: 'auto',
    maneuver: 'none',
    surfaces: createJetSurfaceState(),
    mfdPages: createDefaultMfdPages(),
    ...overrides,
  };
}
