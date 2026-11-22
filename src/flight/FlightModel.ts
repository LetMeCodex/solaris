import * as THREE from 'three';
import { KM_PER_UNIT } from '../rendering/Scale';
import {
  type AirframeSpec,
  type EngineSpeedTier,
  combatMassKg,
  computeEngineThrust,
  computeFuelBurnRateKgPerS,
  getAirframeSpec,
  stepFuelMassKg,
} from './AirframeSpecs';
import {
  A_SEA_EARTH,
  type AtmosphericState,
  P_SEA_EARTH,
  RHO_SEA_EARTH,
  T_SEA_EARTH,
  computeGravityAt,
  computeStallSpeedMps,
  computeThrustToWeight,
  hasSubstantialAtmosphere,
  sampleAtmosphere,
} from './PlanetaryPhysics';
import {
  type AeroSurfaceInputs,
  computeAirData as aeroComputeAirData,
  computeAeroForcesAndMoments,
  computeCornerSpeed,
  computeFlowAngles,
  solveEulerAngularAccel,
  specificExcessPowerMps,
} from './Aerodynamics';
import {
  type AerobaticManeuverKind,
  type FbwControllerState,
  computeAfterburnerStage,
  computeFlapSchedule,
  createFbwState,
  detectManeuver,
  getFbwAirframeParams,
  stepFbwAndControls,
  stepGroundContact,
  toJetSurfaceState,
  toTelemetryManeuver,
} from './ManeuversAndFBW';
import {
  type FbwMode,
  type FlapMode,
  type JetAirframeId,
  type JetSurfaceState,
  type ManeuverKind,
  createJetSurfaceState,
} from './JetTelemetry';

/**
 * Flight model for the Solaris jet.
 *
 * Positions and velocities are in render units (see Scale.ts), stored as JS doubles; the scene's
 * floating origin keeps them exact on the GPU. Speeds that matter to the pilot (the slow floor
 * of a jet near the ground, the limits of air) are set in metres per second and converted with the
 * local km-per-unit scale, which differs near an enlarged world (World size ×30) from the true
 * scale between the planets.
 *
 * The drive: the fastest the jet may go is proportional to its height above the nearest surface
 * (DRIVE_RATE per second), so a dogfight a few hundred metres over the Moon runs at jet speeds,
 * and out in open space the same throttle crosses an AU in seconds. Approaching anything, the
 * ceiling falls with the altitude and the speed follows it down, so the jet cannot overshoot.
 * Inside an atmosphere the air adds its own limit, grip (the velocity turns with the nose) and a
 * G limit on pitch; in vacuum, flight assist does that work and can be switched off for pure
 * Newtonian drift.
 */

/**
 * The drive's absolute limit, render units/s (~8,900 c): reached only far beyond Neptune, so
 * crossing to the Galactic Centre is a journey rather than a jump, and the jet can never run away
 * into numbers floating point cannot hold.
 */
export const MAX_DRIVE_UNITS_PER_S = 1e6;
/** How far from the Sun the jet may go, render units: just past the Milky Way drawn around it. */
export const UNIVERSE_RADIUS_UNITS = 2.2e8;

/** Speed ceiling as a fraction of altitude per second (1 / time-to-surface at full drive). */
export const DRIVE_RATE = 0.55;
/** Slowest cruise and the speed floor near any surface, m/s. */
export const FLOOR_MPS = 120;
/** Top speed in sea-level air, m/s; thinner air raises it as 1/√ρ. */
export const AIR_LIMIT_MPS = 360;
/**
 * Speeding up: log-space rate (1/s). Slowing: exponential rate. Diving at full drive, speed over
 * ceiling r obeys d ln r/dt = -SLOW_RATE (1 - 1/r) + DRIVE_RATE r, which has a stable bound only
 * when SLOW_RATE ≥ 4 × DRIVE_RATE.
 */
export const SPOOL_RATE = 0.8;
export const SLOW_RATE = 3.5;
/** Linear part of acceleration (so speeding up from rest never stalls), m/s². */
export const LINEAR_ACCEL_MPS2 = 45;
/** Afterburner/boost: how far past the throttle ceiling it pushes, and its energy budget. */
export const BOOST_FACTOR = 3.5;
/** Afterburner in air: about +60% over military power, as on a real fighter. */
export const AFTERBURNER_FACTOR = 1.6;
export const BOOST_DRAIN = 0.14;
export const BOOST_RECHARGE = 0.09;
/** Acceleration in air, m/s²: military power and afterburner (Su-30 class at low level). */
export const AIR_ACCEL_MPS2 = 14;
export const AIR_ACCEL_AB_MPS2 = 28;
/** Rates, rad/s, and how quickly the airframe answers the stick (1/s). */
export const MAX_PITCH_RATE = 1.4;
export const MAX_ROLL_RATE = 3.0;
export const MAX_YAW_RATE = 0.7;
export const RATE_RESPONSE = 6.0;
/** Structural limit in air, g. */
export const G_LIMIT = 9;
/** How fast the load may build, g per second (a fly-by-wire's onset limit). */
export const G_ONSET = 14;
/** In air the roll rate builds at most this fast, rad/s² (a snap, but not instant). */
export const ROLL_ACCEL = 14;
/** In air: the fastest roll, rad/s (about 300 deg/s). */
export const MAX_ROLL_RATE_AIR = 5.2;
/** Speed bled in a hard turn: m/s² per g of load over 1 (scaled up steeply), at full density. */
export const TURN_BLEED = 1.25;
/**
 * Handling speed, m/s: the g limit, the load's onset and the g the pilot feels are worked out as if
 * the jet were at most this fast (about a fighter's corner speed). At true speed, past Mach 1 the
 * 9 g limit shrinks the pitch rate to a crawl (0.6 deg/s at Mach 25) and the onset limit makes even
 * that take twenty seconds to build, while a held pull reads hundreds of g, bleeds thousands of m/s²
 * and greys the pilot out. So the stick answers as crisply at Mach 25 as at 1,000 km/h; the turn
 * radius (speed over rate) still grows with speed.
 */
export const HANDLING_MPS = 300;
/** The cobra: up to ~100 degrees nose-up and back, in this many seconds. */
export const COBRA_TIME = 2.4;
const G0 = 9.80665;

export interface FlightInput {
  /** -1..1: nose up positive. */
  pitch: number;
  /** -1..1: right wing down positive. */
  roll: number;
  /** -1..1: nose right positive. */
  yaw: number;
  /** 0..1 */
  throttle: number;
  boost: boolean;
  /** Flight assist: the velocity follows the nose. Off: inertia only. */
  assist: boolean;
  /** Start a Pugachev cobra (in air, below about 450 m/s). */
  cobra?: boolean;
  /** Optional Phase 2 cockpit flight-control & landing device inputs. */
  airbrake?: boolean;
  brake?: boolean;
  wheelBrake?: boolean;
  gearDown?: boolean;
  highG?: boolean;
  psm?: boolean;
  fbwMode?: FbwMode;
  flapMode?: FlapMode;
  fpvHold?: boolean;
}

export interface FlightEnv {
  /** Height above the nearest surface, render units. */
  altitudeUnits: number;
  /** Kilometres per render unit here (see localKmPerUnit). */
  kmPerUnit: number;
  /** Air density relative to Earth's sea level (0 in vacuum). */
  airDensity: number;
  /**
   * Speed tier overrides (Earth's travel modes): the top speed in sea-level air, m/s, in place of
   * AIR_LIMIT_MPS, and a speed the drive may always reach however low the jet is (the drive is
   * otherwise held to DRIVE_RATE x height, which keeps a jet near the ground at jet speeds).
   */
  airLimitMps?: number;
  driveFloorMps?: number;
  /** Multiplies the engines' acceleration in air (the tiers' scramjet pulls far harder than a jet). */
  airAccelScale?: number;
  /** Optional close-range spacecraft inspection floor/ceiling (render units/s) blended when orbiting a probe. */
  inspectFloorUnitsPerS?: number;
  inspectCeilingUnitsPerS?: number;
  inspectBlend?: number;
  /** Optional Phase 2 planetary, airframe, and surface-frame environment context. */
  airframeId?: JetAirframeId | string;
  bodyName?: string;
  altKm?: number;
  gravityMps2?: number;
  upWorld?: THREE.Vector3;
  windWorldMps?: THREE.Vector3;
  groundClearanceM?: number;
  onGround?: boolean;
  sinkRateMps?: number;
  unlimitedFuel?: boolean;
  speedTier?: EngineSpeedTier;
}

export const unitsPerMps = (kmPerUnit: number): number => 0.001 / kmPerUnit;

/** Slowest speed the drive holds, render units/s. */
export function speedFloor(kmPerUnit: number): number {
  return FLOOR_MPS * unitsPerMps(kmPerUnit);
}

/** Fastest the throttle may command here, render units/s. */
export function speedCeiling(env: FlightEnv): number {
  const floor = speedFloor(env.kmPerUnit);
  let ceiling = Math.max(floor, Math.min(MAX_DRIVE_UNITS_PER_S, DRIVE_RATE * Math.max(0, env.altitudeUnits)));
  if (env.driveFloorMps) ceiling = Math.max(ceiling, env.driveFloorMps * unitsPerMps(env.kmPerUnit));
  if (env.airDensity > 0) {
    const air = ((env.airLimitMps ?? AIR_LIMIT_MPS) / Math.sqrt(Math.max(env.airDensity, 1e-6))) * unitsPerMps(env.kmPerUnit);
    // In real air the engines set the top speed, not the height: held to DRIVE_RATE x height, a
    // jet low over the ground had its speed tied to the ground under it, and it sped up on its
    // own over every valley and cliff edge with the throttle untouched. (Up in the thin air the
    // drive's limit takes over again; at 2% density the two meet.)
    ceiling = env.airDensity > 0.02 ? Math.max(floor, air) : Math.min(ceiling, Math.max(floor, air));
  }
  if (env.inspectBlend && env.inspectBlend > 0 && env.inspectCeilingUnitsPerS !== undefined) {
    const t = THREE.MathUtils.clamp(env.inspectBlend, 0, 1);
    const capped = THREE.MathUtils.lerp(ceiling, Math.min(ceiling, Math.max(env.inspectCeilingUnitsPerS, env.inspectFloorUnitsPerS ?? floor)), t);
    const raised = Math.max(capped, (env.inspectFloorUnitsPerS ?? 0) * t);
    ceiling = raised;
  }
  return ceiling;
}

/**
 * Throttle to commanded speed, exponential between the floor and the ceiling, so the bottom of
 * the travel gives fine control at jet speeds and the top reaches across the system.
 */
export function throttleTarget(throttle: number, floor: number, ceiling: number): number {
  if (throttle < 0.02) return 0;
  const t = THREE.MathUtils.clamp((throttle - 0.02) / 0.98, 0, 1);
  if (ceiling <= floor) return ceiling;
  return floor * Math.pow(ceiling / floor, t);
}

/**
 * Move the current speed towards the target: multiplicative (log-space) when speeding up, so the
 * drive spools through the orders of magnitude rather than teleporting; exponential plus linear
 * when slowing, fast enough to stay under a ceiling that shrinks as a world approaches.
 */
export function approachSpeed(current: number, target: number, dt: number, linearAccel: number): number {
  if (dt <= 0) return current;
  if (target <= current) {
    // At least 4 × DRIVE_RATE, or a dive outruns the shrinking ceiling (see the flight tests)
    const next = Math.min(target + (current - target) * Math.exp(-SLOW_RATE * dt), current - linearAccel * dt);
    return Math.max(target, next);
  }
  const base = Math.max(current, linearAccel * 0.5);
  const lc = Math.log(base);
  const lt = Math.log(target);
  const next = Math.max(Math.exp(lt + (lc - lt) * Math.exp(-SPOOL_RATE * dt)), current + linearAccel * dt);
  return Math.min(target, next);
}

/** Relative air density on an exponential atmosphere, fading to zero at its top. */
export function airDensity(altKm: number, scaleHeightKm: number, topKm: number, surfaceDensity = 1): number {
  if (!(scaleHeightKm > 0) || altKm >= topKm) return 0;
  const fade = 1 - THREE.MathUtils.smoothstep(altKm, topKm * 0.8, topKm);
  return surfaceDensity * Math.exp(-Math.max(0, altKm) / scaleHeightKm) * fade;
}

/**
 * Kilometres per render unit at a given height over a world: the world's own scale close in
 * (it may be drawn larger than life), the true scale of the system far out, blended in log space.
 */
export function localKmPerUnit(altitudeUnits: number, visualRadius: number, radiusKm: number): number {
  const near = visualRadius > 0 && radiusKm > 0 ? radiusKm / visualRadius : KM_PER_UNIT;
  const t = THREE.MathUtils.smoothstep(altitudeUnits / Math.max(visualRadius, 1e-9), 3, 60);
  return Math.exp(Math.log(near) * (1 - t) + Math.log(KM_PER_UNIT) * t);
}

/**
 * Distance from a point to a world's surface, km, given the centre distance in render units.
 * Close in it is measured on the world's own (possibly enlarged) scale, like the altitude; far
 * out it is the true gap between the two (true centre distance less the true radius), which is
 * what Solaris keeps between the worlds. Blended in log space between 0.5 and 4 radii (an
 * enlarged Moon is only ~6 of its drawn radii from Earth, and that gap must read true).
 */
export function gapKm(centreDistUnits: number, visualRadius: number, radiusKm: number): number {
  const surf = Math.max(0, centreDistUnits - visualRadius);
  const near = surf * (radiusKm / Math.max(visualRadius, 1e-12));
  const far = Math.max(0, centreDistUnits * KM_PER_UNIT - radiusKm);
  const t = THREE.MathUtils.smoothstep(surf / Math.max(visualRadius, 1e-12), 0.5, 4);
  if (t <= 0) return near;
  if (t >= 1) return far;
  return Math.exp(Math.log(Math.max(near, 1e-9)) * (1 - t) + Math.log(Math.max(far, 1e-9)) * t);
}

/**
 * Keep a point outside a sphere: push it back to `radius + clearance` and remove the inward part
 * of the velocity. Returns the inward speed that was removed (0 if there was no contact).
 */
export function resolveSurfaceContact(
  position: THREE.Vector3,
  velocity: THREE.Vector3,
  center: THREE.Vector3,
  radius: number,
  clearance: number
): number {
  const rx = position.x - center.x;
  const ry = position.y - center.y;
  const rz = position.z - center.z;
  const d = Math.sqrt(rx * rx + ry * ry + rz * rz);
  const min = radius + clearance;
  if (d >= min || d === 0) return 0;
  const nx = rx / d;
  const ny = ry / d;
  const nz = rz / d;
  position.set(center.x + nx * min, center.y + ny * min, center.z + nz * min);
  const vr = velocity.x * nx + velocity.y * ny + velocity.z * nz;
  if (vr >= 0) return 0;
  velocity.x -= vr * nx;
  velocity.y -= vr * ny;
  velocity.z -= vr * nz;
  return -vr;
}

const FORWARD = new THREE.Vector3(0, 0, -1);

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export class FlightModel {
  /** World position, render units (double precision). */
  public readonly position = new THREE.Vector3();
  /** Velocity relative to the frame being ridden (the nearest world), render units/s. */
  public readonly velocity = new THREE.Vector3();
  /** Orientation: the nose is local -Z, the canopy local +Y. */
  public readonly quaternion = new THREE.Quaternion();
  /** Body rates, rad/s: x pitch, y yaw, z roll. */
  public readonly rates = new THREE.Vector3();
  /** Commanded speed the drive is holding, render units/s. */
  public speed = 0;
  public boostEnergy = 1;
  public boosting = false;
  /** Load factor felt by the pilot (only meaningful in air), g. */
  public gLoad = 1;
  /** Seconds into a cobra, or -1. */
  public cobraT = -1;

  // --- Phase 2 Physical State & Telemetry ---
  public airframeId: JetAirframeId;
  public fuelKg: number;
  public maxFuelKg: number;
  public dryMassKg: number;
  public massKg: number;
  public fuelFlowKgS = 0;
  public thrustN = 0;
  public maxDryThrustN: number;
  public maxWetThrustN: number;
  public abStage: 0 | 1 | 2 | 3 = 0;
  public supercruise = false;
  public twRatio = 0;
  public gravityMps2 = G0;
  public tasMps = 0;
  public easMps = 0;
  public iasMps = 0;
  public mach = 0;
  public dynamicPressurePa = 0;
  public ambientTempK = T_SEA_EARTH;
  public ambientPressurePa = P_SEA_EARTH;
  public soundMps = A_SEA_EARTH;
  public aoaDeg = 0;
  public aosDeg = 0;
  public fpvAngleDeg = 0;
  public verticalSpeedMps = 0;
  public specificExcessPowerMps = 0;
  public gPeak = 1;
  public gMin = 1;
  public cornerSpeedMps = 0;
  public stallSpeedMps = 0;
  public cl = 0;
  public cd = 0;
  public liftN = 0;
  public dragN = 0;
  public stallFactor = 0;
  public buffetFactor = 0;
  public vortexStrength = 0;
  public groundEffect = 0;
  public onGround = false;
  public touchdownImpulse = 0;
  public fbwMode: FbwMode = 'norm';
  public flapMode: FlapMode = 'auto';
  public fpvHoldActive = false;
  public tvcActive = false;
  public highGActive = false;
  public airbrakeActive = false;
  public wheelBrakeActive = false;
  public maneuver: ManeuverKind = 'none';
  public aerobaticManeuver: AerobaticManeuverKind = 'none';
  public maneuverTimerSec = 0;
  public alphaWarning = false;
  public spinWarning = false;
  public overGWarning = false;
  public surfaces: JetSurfaceState = createJetSurfaceState();
  public readonly fbwState: FbwControllerState = createFbwState();

  private spool = 0.55;
  private lastNormalAeroAccel = G0;
  private pitchTrimInt = 0;
  private autoGammaLatched = false;
  private autoGammaRad = 0;
  private autoBankLatched = false;
  private autoBankRad = 0;
  private cobraEntryFwd = new THREE.Vector3(0, 0, -1);

  private tmpForward = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpQ = new THREE.Quaternion();
  private tmpEuler = new THREE.Vector3();
  private tmpUp = new THREE.Vector3(0, 1, 0);
  private tmpRight = new THREE.Vector3(1, 0, 0);
  private tmpBodyUp = new THREE.Vector3(0, 1, 0);
  private tmpVelMps = new THREE.Vector3();
  private tmpVelBody = new THREE.Vector3();
  private tmpInvQ = new THREE.Quaternion();
  private tmpAccelWorld = new THREE.Vector3();
  private tmpAeroForce = new THREE.Vector3();
  private tmpAeroMoment = new THREE.Vector3();
  private tmpTotalMoment = new THREE.Vector3();
  private tmpAngAccel = new THREE.Vector3();
  private tmpHorizDir = new THREE.Vector3();
  private tmpFlow = computeFlowAngles(new THREE.Vector3());
  private tmpAtm: AtmosphericState = {
    bodyName: 'Earth',
    altKm: 0,
    tempK: T_SEA_EARTH,
    pressurePa: P_SEA_EARTH,
    densityKgM3: RHO_SEA_EARTH,
    densityRel: 1,
    gamma: 1.4,
    gasConstantJPerKgK: 287.05287,
    soundSpeedMps: A_SEA_EARTH,
    surfacePressurePa: P_SEA_EARTH,
    surfaceTempK: T_SEA_EARTH,
    topKm: 160,
    hasOxygen: true,
    isVacuum: false,
  };

  constructor(airframeId: JetAirframeId | string = 'kestrel') {
    const spec = getAirframeSpec(airframeId);
    this.airframeId = spec.id;
    this.dryMassKg = spec.emptyMassKg;
    this.maxFuelKg = spec.maxFuelKg;
    this.fuelKg = spec.initialFuelKg;
    this.massKg = combatMassKg(spec, this.fuelKg);
    this.maxDryThrustN = spec.dryThrustN;
    this.maxWetThrustN = spec.wetThrustN;
    this.tvcActive = spec.hasTvc;
  }

  public setAirframe(id: JetAirframeId | string, resetFuelLoad = true): void {
    const spec = getAirframeSpec(id);
    if (this.airframeId === spec.id && !resetFuelLoad) return;
    this.airframeId = spec.id;
    this.dryMassKg = spec.emptyMassKg;
    this.maxFuelKg = spec.maxFuelKg;
    if (resetFuelLoad) {
      this.fuelKg = spec.initialFuelKg;
    } else {
      this.fuelKg = clamp(this.fuelKg, 0, spec.maxFuelKg);
    }
    this.massKg = combatMassKg(spec, this.fuelKg);
    this.maxDryThrustN = spec.dryThrustN;
    this.maxWetThrustN = spec.wetThrustN;
    this.tvcActive = spec.hasTvc;
    this.pitchTrimInt = 0;
    this.autoGammaLatched = false;
    this.autoBankLatched = false;
    this.lastNormalAeroAccel = G0;
  }

  public refuel(fraction = 1): void {
    const spec = getAirframeSpec(this.airframeId);
    this.fuelKg = clamp(spec.maxFuelKg * fraction, 0, spec.maxFuelKg);
    this.massKg = combatMassKg(spec, this.fuelKg);
  }

  public resetEnvelopePeaks(): void {
    this.gPeak = this.gLoad;
    this.gMin = this.gLoad;
    this.pitchTrimInt = 0;
    this.autoGammaLatched = false;
    this.autoBankLatched = false;
    this.lastNormalAeroAccel = G0;
  }

  public setFbwMode(mode: FbwMode): void {
    this.fbwState.mode = mode;
    this.fbwMode = mode;
  }

  public cycleFbwMode(): FbwMode {
    const next: FbwMode =
      this.fbwState.mode === 'norm' ? 'high-g' : this.fbwState.mode === 'high-g' ? 'psm' : 'norm';
    this.setFbwMode(next);
    return next;
  }

  public setFlapMode(mode: FlapMode): void {
    this.fbwState.flapMode = mode;
    this.flapMode = mode;
  }

  public cycleFlapMode(): FlapMode {
    const next: FlapMode =
      this.fbwState.flapMode === 'auto'
        ? 'combat'
        : this.fbwState.flapMode === 'combat'
          ? 'land'
          : 'auto';
    this.setFlapMode(next);
    return next;
  }

  public toggleFpvHold(): boolean {
    this.fbwState.fpvHoldActive = !this.fbwState.fpvHoldActive;
    if (this.fbwState.fpvHoldActive) {
      this.fbwState.fpvTargetGammaDeg = clamp(this.fpvAngleDeg, -45, 45);
    }
    this.fpvHoldActive = this.fbwState.fpvHoldActive;
    return this.fpvHoldActive;
  }

  /** How far boost pushes past the throttle ceiling: the afterburner in air, the drive in vacuum. */
  public boostFactor(airDensity: number): number {
    const k = Math.min(1, airDensity * 5);
    return BOOST_FACTOR + (AFTERBURNER_FACTOR - BOOST_FACTOR) * k;
  }

  public forward(out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    return out.copy(FORWARD).applyQuaternion(this.quaternion);
  }

  private resolveAtmosphere(env: FlightEnv): AtmosphericState {
    const rhoRel = Math.max(0, env.airDensity);
    if (rhoRel <= 1e-6) {
      const vac = sampleAtmosphere('Moon', 0);
      Object.assign(this.tmpAtm, vac);
      return this.tmpAtm;
    }

    if (env.bodyName && env.altKm !== undefined && hasSubstantialAtmosphere(env.bodyName)) {
      const sampled = sampleAtmosphere(env.bodyName, env.altKm);
      Object.assign(this.tmpAtm, sampled);
      if (this.tmpAtm.isVacuum || this.tmpAtm.densityKgM3 <= 1e-7) {
        // Density override still indicates thin gas near atmosphere cutoff
        this.tmpAtm.isVacuum = false;
        this.tmpAtm.densityRel = rhoRel;
        this.tmpAtm.densityKgM3 = rhoRel * RHO_SEA_EARTH;
        this.tmpAtm.pressurePa = Math.max(1, this.tmpAtm.densityKgM3 * this.tmpAtm.gasConstantJPerKgK * Math.max(this.tmpAtm.tempK, 80));
        if (this.tmpAtm.soundSpeedMps <= 1) {
          this.tmpAtm.soundSpeedMps = Math.sqrt(this.tmpAtm.gamma * this.tmpAtm.gasConstantJPerKgK * Math.max(this.tmpAtm.tempK, 80));
        }
      } else if (Math.abs(rhoRel - this.tmpAtm.densityRel) > 0.12 * Math.max(0.05, this.tmpAtm.densityRel)) {
        const scale = rhoRel / Math.max(this.tmpAtm.densityRel, 1e-6);
        this.tmpAtm.densityRel = rhoRel;
        this.tmpAtm.densityKgM3 *= scale;
        this.tmpAtm.pressurePa *= scale;
      }
      return this.tmpAtm;
    }

    // Fallback when bodyName/altKm omitted (e.g. unit tests passing Earth-relative airDensity)
    const estAltKm = rhoRel >= 1 ? 0 : Math.min(85, -7.2 * Math.log(clamp(rhoRel, 1e-6, 1)));
    const earth = sampleAtmosphere('Earth', estAltKm);
    Object.assign(this.tmpAtm, earth);
    if (earth.densityKgM3 > 1e-8) {
      const scale = (rhoRel * RHO_SEA_EARTH) / earth.densityKgM3;
      this.tmpAtm.densityRel = rhoRel;
      this.tmpAtm.densityKgM3 = rhoRel * RHO_SEA_EARTH;
      this.tmpAtm.pressurePa = earth.pressurePa * scale;
    } else {
      this.tmpAtm.densityRel = rhoRel;
      this.tmpAtm.densityKgM3 = rhoRel * RHO_SEA_EARTH;
      this.tmpAtm.pressurePa = P_SEA_EARTH * rhoRel * (earth.tempK / T_SEA_EARTH);
    }
    this.tmpAtm.isVacuum = rhoRel <= 1e-5;
    return this.tmpAtm;
  }

  public step(dt: number, input: FlightInput, env: FlightEnv): void {
    if (!(dt > 0)) return;

    if (env.airframeId !== undefined && env.airframeId !== this.airframeId) {
      this.setAirframe(env.airframeId, false);
    }
    if (input.fbwMode !== undefined && input.fbwMode !== this.fbwState.mode) {
      this.setFbwMode(input.fbwMode);
    }
    if (input.flapMode !== undefined && input.flapMode !== this.fbwState.flapMode) {
      this.setFlapMode(input.flapMode);
    }
    if (input.fpvHold !== undefined && input.fpvHold !== this.fbwState.fpvHoldActive) {
      this.fbwState.fpvHoldActive = input.fpvHold;
      if (input.fpvHold) this.fbwState.fpvTargetGammaDeg = clamp(this.fpvAngleDeg, -45, 45);
      this.fpvHoldActive = input.fpvHold;
    }

    const spec: AirframeSpec = getAirframeSpec(this.airframeId);
    const fbwAf = getFbwAirframeParams(spec.id);
    const upm = unitsPerMps(env.kmPerUnit);
    const invUpm = 1 / Math.max(upm, 1e-18);

    const atm = this.resolveAtmosphere(env);
    const inAir = env.airDensity > 1e-4;
    const rhoRel = Math.max(0, env.airDensity);

    const upUnit = env.upWorld && env.upWorld.lengthSq() > 1e-8
      ? this.tmpUp.copy(env.upWorld).normalize()
      : this.tmpUp.copy(WORLD_UP);

    const tInspect = env.inspectBlend ? THREE.MathUtils.clamp(env.inspectBlend, 0, 1) : 0;
    const isInspect = tInspect > 0.01;
    const isHypersonicTier =
      !isInspect &&
      ((env.airAccelScale !== undefined && env.airAccelScale > 1.05) ||
        (env.driveFloorMps !== undefined && env.driveFloorMps > 0));

    // Smooth dual-scale regime weight: 0 in planetary jet air (rhoRel >= 0.02), 1 in vacuum/inspect
    const wDrive = isInspect
      ? 1
      : isHypersonicTier
        ? 0
        : rhoRel <= 0
          ? 1
          : 1 - smoothstep(0, 0.02, rhoRel);

    const airbrakeHeld = !!(input.airbrake || input.brake);
    const wheelBrakeHeld = !!input.wheelBrake;
    const gearDown = !!input.gearDown;
    const onGround = !!env.onGround;
    const throttle = clamp(input.throttle, 0, 1);

    // Local gravity (zero when omitted in default vacuum unit tests; real planetary g_eff otherwise)
    this.tmpVelMps.copy(this.velocity).multiplyScalar(invUpm);
    const speedMpsInit = this.tmpVelMps.length();
    const vVert = this.tmpVelMps.dot(upUnit);
    const vTan = Math.sqrt(Math.max(0, this.tmpVelMps.lengthSq() - vVert * vVert));

    let gEffMps2 = 0;
    if (env.gravityMps2 !== undefined) {
      gEffMps2 = Math.max(0, env.gravityMps2);
    } else if (env.bodyName) {
      const altKm = env.altKm ?? Math.max(0, env.altitudeUnits * env.kmPerUnit);
      gEffMps2 = computeGravityAt(env.bodyName, {
        altKm,
        tangentialSpeedMps: vTan,
        frame: 'surface',
      }).gEffectiveMps2;
    } else if (inAir && !isHypersonicTier) {
      gEffMps2 = G0 * smoothstep(0, 0.02, rhoRel);
    }
    this.gravityMps2 = gEffMps2;

    // Space drive ceilings & boost energy
    const baseFloor = speedFloor(env.kmPerUnit);
    const floor =
      tInspect > 0 && env.inspectFloorUnitsPerS !== undefined
        ? THREE.MathUtils.lerp(baseFloor, Math.max(baseFloor, env.inspectFloorUnitsPerS), tInspect)
        : baseFloor;
    const ceiling = speedCeiling(env);
    const inJetAir = !isInspect && !isHypersonicTier && wDrive < 0.5 && rhoRel > 0.02;
    this.boosting =
      input.boost &&
      throttle > 0.02 &&
      (inJetAir ? this.fuelKg > 0 : this.boostEnergy > 0.02);
    if (this.boosting && !inJetAir) {
      const drainRate = inAir ? BOOST_DRAIN * 0.45 : BOOST_DRAIN;
      this.boostEnergy = Math.max(0, this.boostEnergy - drainRate * dt);
    } else {
      const rechargeRate = inAir ? BOOST_RECHARGE * 1.5 : BOOST_RECHARGE;
      this.boostEnergy = Math.min(1, this.boostEnergy + rechargeRate * dt);
    }

    // --- Branch 1: Earth Mach 6 / Mach 25 Hypersonic Tiers OR Spacecraft Inspection / Pure Vacuum ---
    if (isHypersonicTier || wDrive >= 0.999) {
      this.stepDriveOrHypersonic(
        dt,
        input,
        env,
        spec,
        fbwAf,
        atm,
        upUnit,
        upm,
        invUpm,
        floor,
        ceiling,
        tInspect,
        isHypersonicTier,
        speedMpsInit,
        gearDown,
        airbrakeHeld,
        wheelBrakeHeld,
        onGround
      );
      return;
    }

    // --- Branch 2: Full 6-DOF Rigid-Body Aerodynamics + Propulsion + FBW + Optional Upper-Atmo Drive Blend ---
    const subSteps = Math.min(24, Math.max(1, Math.ceil(dt / 0.01)));
    const subDt = dt / subSteps;

    let finalFbwOut: ReturnType<typeof stepFbwAndControls> | null = null;
    let finalAeroRes: ReturnType<typeof computeAeroForcesAndMoments> | null = null;
    let finalElevCmd = 0;
    let finalAilCmd = 0;
    let finalRudCmd = 0;
    let finalPropThrustN = 0;
    let finalMaxDryN = spec.dryThrustN;
    let finalMaxWetN = spec.wetThrustN;
    let finalAbStage: 0 | 1 | 2 | 3 = 0;
    let finalSupercruise = false;
    let finalChute = 0;
    let finalTouchdownImpulse = 0;
    let gLoadAccum = 0;

    for (let s = 0; s < subSteps; s++) {
      this.massKg = combatMassKg(spec, this.fuelKg);
      const vWorld = this.tmpVelMps.copy(this.velocity).multiplyScalar(invUpm);
      if (env.windWorldMps) vWorld.sub(env.windWorldMps);
      const tasNow = vWorld.length();

      this.tmpInvQ.copy(this.quaternion).invert();
      this.tmpVelBody.copy(vWorld).applyQuaternion(this.tmpInvQ);
      const flow = computeFlowAngles(this.tmpVelBody, this.tmpFlow);
      const airData = aeroComputeAirData(flow.speedMps, atm);

      const fwd = this.forward(this.tmpForward);
      const bodyUp = this.tmpBodyUp.set(0, 1, 0).applyQuaternion(this.quaternion);
      const bodyRight = this.tmpRight.set(1, 0, 0).applyQuaternion(this.quaternion);

      const gravityBodyUp = bodyUp.dot(upUnit);
      const rollAngleRad = Math.atan2(bodyRight.dot(upUnit), gravityBodyUp);
      const rawPitchRad = Math.asin(clamp(fwd.dot(upUnit), -1, 1));
      const gammaRad = tasNow > 1 ? Math.asin(clamp(vWorld.dot(upUnit) / tasNow, -1, 1)) : 0;
      const gammaDeg = gammaRad * RAD_TO_DEG;

      // Capture entry heading at Cobra start & unwrap pitch angle past 90 deg vertical
      if (s === 0 && input.cobra && this.fbwState.cobra.phase === 'IDLE') {
        this.cobraEntryFwd.copy(fwd).addScaledVector(upUnit, -fwd.dot(upUnit));
        if (this.cobraEntryFwd.lengthSq() > 1e-6) this.cobraEntryFwd.normalize();
        else this.cobraEntryFwd.copy(FORWARD);
      }
      const cobraActivePre = this.fbwState.cobra.phase !== 'IDLE';
      const pitchAngleForFbw = cobraActivePre
        ? Math.atan2(fwd.dot(upUnit), fwd.dot(this.cobraEntryFwd))
        : rawPitchRad;

      // Propulsion + Afterburner spool
      const abOut = computeAfterburnerStage({
        throttle,
        boost: this.boosting,
        airDensity: atm.densityRel,
        fuelFrac: spec.maxFuelKg > 0 ? this.fuelKg / spec.maxFuelKg : 1,
        spoolState: this.spool,
        dt: subDt,
        airframe: fbwAf,
      });
      this.spool = abOut.spoolState;
      const drySpoolFrac = clamp((this.spool - 0.05) / 0.70, 0, 1);
      const wetSpoolFrac = clamp((this.spool - 0.75) / 0.25, 0, 1);
      const propOut = computeEngineThrust(spec, {
        throttle: drySpoolFrac,
        afterburner: abOut.abStage > 0 && wetSpoolFrac > 0.01,
        abFraction: wetSpoolFrac,
        mach: airData.mach,
        pressurePa: atm.pressurePa,
        tempK: atm.tempK,
        gamma: atm.gamma,
        hasOxygen: atm.hasOxygen,
        surfacePressurePa: atm.surfacePressurePa,
        surfaceTempK: atm.surfaceTempK,
        mode: 'solaris',
        speedTier: env.speedTier ?? 'jet',
        gEffMps2,
        massKg: this.massKg,
        fuelKg: this.fuelKg,
        zeroFuelCutoff: false,
      });

      const fuelFlow = computeFuelBurnRateKgPerS(spec, {
        throttle,
        afterburner: abOut.abStage > 0,
        abFraction: wetSpoolFrac,
        thrustN: propOut.thrustN,
        hasFuel: this.fuelKg > 0,
      });
      if (!env.unlimitedFuel) {
        this.fuelKg = stepFuelMassKg(spec, this.fuelKg, fuelFlow * (1 - wDrive), subDt, false);
      }
      this.fuelFlowKgS = fuelFlow * (1 - wDrive);
      finalPropThrustN = propOut.thrustN;
      finalMaxDryN = propOut.maxDryThrustN;
      finalMaxWetN = propOut.maxWetThrustN;
      finalAbStage = abOut.abStage;
      finalSupercruise = propOut.thrustN > 0 && airData.mach >= 1.05 && abOut.abStage === 0;

      // High-lift slats/flaps schedule (fades smoothly to zero across exosphere exit)
      const aeroSurfFade = smoothstep(1e-6, 0.01, atm.densityRel);
      const flapOut = computeFlapSchedule({
        flapMode: this.fbwState.flapMode,
        gearDown,
        mach: airData.mach,
        alphaDeg: flow.alphaDeg,
        iasMps: airData.iasMps,
      });
      this.fbwState.surfaces.leFlap = flapOut.leFlap * aeroSurfFade;
      this.fbwState.surfaces.teFlap = flapOut.teFlap * aeroSurfFade;
      this.fbwState.surfaces.nozzleIris = abOut.nozzleIris;

      // Ground contact & rollout physics
      const groundOut = stepGroundContact(this.fbwState, {
        airframe: fbwAf,
        onGround,
        gearDown,
        sinkRateMps: env.sinkRateMps ?? Math.max(0, -vVert),
        groundSpeedMps: vTan,
        brakesHeld: wheelBrakeHeld,
        airbrakeHeld,
        yawInput: input.yaw,
        throttle,
        massKg: this.massKg,
        gravityMps2: gEffMps2,
        dt: subDt,
      });
      finalChute = groundOut.dragChute;
      finalTouchdownImpulse = Math.max(finalTouchdownImpulse, groundOut.touchdownImpulse);

      // Primary FBW law & TVC / RCS allocation (gravityAccelMps2=0 prevents open-loop climb loop; 1G trim is closed-loop below)
      const fbwOut = stepFbwAndControls(this.fbwState, {
        airframe: fbwAf,
        pitch: clamp(input.pitch, -1, 1),
        roll: clamp(input.roll, -1, 1),
        yaw: clamp(input.yaw, -1, 1),
        speedMps: flow.speedMps,
        qPa: airData.qPa,
        airDensity: atm.densityRel,
        mach: airData.mach,
        alphaDeg: flow.alphaDeg,
        betaDeg: flow.betaDeg,
        gammaDeg,
        pitchAngleRad: pitchAngleForFbw,
        rollAngleRad,
        currentRatesB3: [this.rates.x, this.rates.y, this.rates.z],
        gravityBodyUp,
        gravityAccelMps2: 0,
        gearDown,
        onGround,
        assist: input.assist,
        paddleHeld: !!input.highG,
        psmHeld: !!input.psm,
        airbrakeHeld,
        brakesHeld: wheelBrakeHeld,
        cobraTriggered: s === 0 && !!input.cobra,
        thrustN: propOut.thrustN,
        airAccelScale: env.airAccelScale,
        dt: subDt,
      });
      finalFbwOut = fbwOut;

      const altAglM = env.groundClearanceM ?? Math.max(0, env.altitudeUnits * env.kmPerUnit * 1000);
      const gearExt = gearDown ? 1 : 0;

      // Compute commanded rates including MIL-STD-1797A / F-16 / Gripen bank-compensated
      // 1G C* auto-trim, coordinated-turn yaw rate, and hands-off flight-path + bank-angle hold.
      let cmdPitchRate = this.fbwState.rateCmdB3[0];
      let cmdYawRate = this.fbwState.rateCmdB3[1];
      let cmdRollRate = this.fbwState.rateCmdB3[2];

      // Keep 1G auto-trim + flight-path hold active across NORM, HIGH-G, and normal-AoA PSM cruise;
      // seamlessly disengage only during active Cobra / post-stall high-AoA maneuvers (>= 22 deg AoA).
      const inPostStallManeuver = fbwOut.effectiveMode === 'psm' && Math.abs(flow.alphaDeg) >= 22;
      if (
        input.assist &&
        !fbwOut.cobra.active &&
        !inPostStallManeuver &&
        !onGround &&
        atm.densityRel > 0.02 &&
        gEffMps2 > 0.1
      ) {
        const safeV = Math.max(flow.speedMps, 45);
        const absPhi = Math.abs(rollAngleRad);
        const cosTheta = Math.cos(rawPitchRad);
        const cosPhi = Math.cos(rollAngleRad);

        // Smooth level-turn 1G baseline: Nz = cos(theta)/cos(phi) holds altitude in coordinated turns
        // up to 60 deg bank, then smoothly blends to cos(theta)*cos(phi) past 55-80 deg for crisp
        // knife-edge & inverted aerobatics with zero unintended groundward nose drop.
        const nzLevelTurn = cosTheta / Math.max(cosPhi, 0.5);
        const bankFade = smoothstep(55 * DEG_TO_RAD, 80 * DEG_TO_RAD, absPhi);
        const nzBase = nzLevelTurn * (1 - bankFade) + cosTheta * cosPhi * bankFade;

        const stickNeutral = Math.abs(input.pitch) < 0.04;
        const rollNeutral = Math.abs(input.roll) < 0.04;
        const yawNeutral = Math.abs(input.yaw) < 0.04;
        const fpvActive = this.fbwState.fpvHoldActive && Math.abs(input.pitch) < 0.18;
        const canHoldGamma = absPhi < 68 * DEG_TO_RAD && Math.abs(rawPitchRad) < 72 * DEG_TO_RAD;

        // Exact coordinated-turn body yaw rate r = (g * sin(phi) * cos(theta)) / V (singularity-free!).
        // Sign check: rollAngleRad = atan2(bodyRight·up, bodyUp·up) is NEGATIVE for right bank,
        // and B3 +Y is yaw-left, so adding sin(rollAngleRad) turns nose RIGHT in right bank (beta -> 0).
        if (yawNeutral && absPhi > 0.03 && absPhi < 75 * DEG_TO_RAD) {
          const coordFade = 1 - smoothstep(60 * DEG_TO_RAD, 75 * DEG_TO_RAD, absPhi);
          const rCoordLeft = (gEffMps2 * Math.sin(rollAngleRad) * cosTheta) / safeV;
          cmdYawRate += rCoordLeft * coordFade;
        }

        // Hands-off bank-angle hold latch (Gripen / Rafale FBW): prevents spiral divergence when
        // banking and releasing the stick, and gently auto-levels near wings-level (< 4 deg).
        // Sign check: +Z rate rolls left (raises bodyRight -> increases rollAngleRad), so +bankErr => +cmdRollRate.
        if (rollNeutral && absPhi < 66 * DEG_TO_RAD && Math.abs(rawPitchRad) < 68 * DEG_TO_RAD) {
          if (!this.autoBankLatched && Math.abs(this.rates.z) < 0.35) {
            this.autoBankRad = absPhi < 4 * DEG_TO_RAD ? 0 : rollAngleRad;
            this.autoBankLatched = true;
          }
          if (this.autoBankLatched) {
            const bankErr = clamp(this.autoBankRad - rollAngleRad, -0.5, 0.5);
            cmdRollRate += clamp(bankErr * 2.8, -0.9, 0.9);
          }
        } else {
          this.autoBankLatched = false;
        }

        if (fpvActive || (stickNeutral && canHoldGamma)) {
          let targetGammaRad: number;
          if (fpvActive) {
            targetGammaRad = this.fbwState.fpvTargetGammaDeg * DEG_TO_RAD;
            this.autoGammaLatched = false;
          } else {
            if (!this.autoGammaLatched && Math.abs(this.rates.x) < 0.16) {
              // Snap tiny residual flight-path angles (< 3 deg) to crisp level flight (0 deg) so
              // the jet never slowly bleeds altitude after releasing pitch near the horizon.
              this.autoGammaRad = Math.abs(gammaRad) < 3.0 * DEG_TO_RAD ? 0 : gammaRad;
              this.autoGammaLatched = true;
            }
            targetGammaRad = this.autoGammaLatched ? this.autoGammaRad : gammaRad;
          }

          // Inverse-density gain scheduling keeps high-altitude (7-16 km MSL) thin-air trim
          // just as crisp and zero-droop as sea-level cruise.
          const altGain = clamp(1 / Math.sqrt(clamp(atm.densityRel, 0.12, 1.0)), 1.0, 2.2);

          // Outer flight-path angle stabilization prevents slow phugoid/thrust-change drift
          const gammaErrRad = clamp(targetGammaRad - gammaRad, -0.35, 0.35);
          const deltaNzHold = clamp(gammaErrRad * 3.0, -0.85, 0.85);
          const trimTargetAccel = gEffMps2 * clamp(nzBase + deltaNzHold, -0.5, 2.6);

          // Gain-scheduled PI normal-acceleration loop with anti-windup
          const errRate = (trimTargetAccel - this.lastNormalAeroAccel) / safeV;
          const pTerm = clamp(errRate * 1.25 * altGain, -0.55, 0.55);
          const uUnsat = pTerm + this.pitchTrimInt + clamp(gammaErrRad * 1.35 * altGain, -0.45, 0.45);
          const uSat = clamp(uUnsat, -0.72, 0.72);
          const awTerm = 3.0 * (uSat - uUnsat);
          const alphaClipping = flow.alphaDeg > fbwOut.alphaLimitDeg - 2.5 && errRate > 0;
          if (!alphaClipping) {
            this.pitchTrimInt = clamp(this.pitchTrimInt + (errRate * 1.05 * altGain + awTerm) * subDt, -0.55, 0.55);
          } else {
            this.pitchTrimInt = clamp(this.pitchTrimInt + awTerm * subDt, -0.55, 0.55);
          }
          cmdPitchRate += uSat;
        } else {
          // Pilot actively maneuvering or steep/inverted roll: unlatch gamma hold and preserve bumpless trim
          this.autoGammaLatched = false;
          if (stickNeutral) {
            // Knife-edge / inverted neutral stick: gentle 1G baseline keeps trajectory crisp without diving
            const errRate = (gEffMps2 * nzBase - this.lastNormalAeroAccel) / safeV;
            cmdPitchRate += clamp(errRate * 0.65 + this.pitchTrimInt * 0.4, -0.35, 0.35);
          } else {
            // Active stick pull/push: keep subtle gravity-compensation feedforward so turn entry feels weightless
            const ff = clamp(((gEffMps2 * nzBase - this.lastNormalAeroAccel) / safeV) * 0.35, -0.18, 0.25);
            cmdPitchRate += ff;
            this.pitchTrimInt *= Math.exp(-2.2 * subDt);
          }
        }
      } else {
        this.autoGammaLatched = false;
        this.autoBankLatched = false;
        this.pitchTrimInt *= Math.exp(-4.0 * subDt);
      }
      if (onGround && gearDown && groundOut.yawRateB3Rad !== 0) {
        cmdYawRate = groundOut.yawRateB3Rad;
      }

      // Open-loop baseline aerodynamics (neutral primary surfaces -> gives exact stiffness + damping torques)
      const neutralSurf: AeroSurfaceInputs = {
        elev: 0,
        ail: 0,
        rud: 0,
        flaps: flapOut.teFlap,
        slats: flapOut.leFlap,
        gear: gearExt,
        speedbrake: fbwOut.surfaces.speedbrake,
      };
      const baseAero = computeAeroForcesAndMoments(
        {
          flow,
          air: airData,
          rhoKgM3: atm.densityKgM3,
          altAboveGroundM: altAglM,
          ratesB3: this.rates,
          surfaces: neutralSurf,
        },
        spec,
        this.tmpAeroForce,
        this.tmpAeroMoment
      );

      // RCS moments in thin air / vacuum
      const rcsAuth = fbwOut.allocation.rcsAuthority;
      const [ixx, iyy, izz, ixz] = spec.inertia;
      const rcsMaxMx = rcsAuth * iyy * 2.5;
      const rcsMaxMy = rcsAuth * izz * 1.5;
      const rcsMaxMz = rcsAuth * ixx * 4.5;

      let elevCmd: number;
      let ailCmd: number;
      let rudCmd: number;
      let rcsMx = 0;
      let rcsMy = 0;
      let rcsMz = 0;

      const tvcTx = fbwOut.allocation.tvcTorqueB3[0];
      const tvcTy = fbwOut.allocation.tvcTorqueB3[1];
      const tvcTz = fbwOut.allocation.tvcTorqueB3[2];

      if (!input.assist) {
        // Direct mechanical law: stick directly drives control surfaces
        elevCmd = clamp(input.pitch, -1, 1);
        ailCmd = clamp(input.roll, -1, 1);
        rudCmd = clamp(input.yaw, -1, 1);
        rcsMx = elevCmd * rcsMaxMx;
        rcsMy = -rudCmd * rcsMaxMy;
        rcsMz = -ailCmd * rcsMaxMz;
      } else {
        // Closed-loop inner CAS solves exact surface deflections to track cmdRates without overshoot
        this.tmpTotalMoment.copy(baseAero.momentB3);
        this.tmpTotalMoment.x += tvcTx;
        this.tmpTotalMoment.y += tvcTy;
        this.tmpTotalMoment.z += tvcTz;

        const openLoopAccel = solveEulerAngularAccel(this.tmpTotalMoment, this.rates, spec.inertia, this.tmpAngAccel);

        const casBandLon = fbwOut.cobra.active || fbwOut.effectiveMode === 'psm' ? 42 : 48;
        const casBandLat = 40;
        const desAx = ((cmdPitchRate - this.rates.x) * (1 - Math.exp(-casBandLon * subDt))) / subDt;
        const desAy = ((cmdYawRate - this.rates.y) * (1 - Math.exp(-casBandLat * subDt))) / subDt;
        const desAz = ((cmdRollRate - this.rates.z) * (1 - Math.exp(-casBandLat * subDt))) / subDt;

        const dAx = desAx - openLoopAccel.x;
        const dAy = desAy - openLoopAccel.y;
        const dAz = desAz - openLoopAccel.z;

        // Inverse of I_xz-coupled rigid-body equations in B3
        const needMx = iyy * dAx;
        const needMy = izz * dAy - ixz * dAz;
        const needMz = ixx * dAz - ixz * dAy;

        const absA = Math.abs(flow.alphaRad);
        const etaElev = 1 - 0.55 * smoothstep(35 * DEG_TO_RAD, 75 * DEG_TO_RAD, absA);
        const etaRud = 1 - 0.85 * smoothstep(25 * DEG_TO_RAD, 55 * DEG_TO_RAD, absA);
        const etaAil = 1 - 0.65 * smoothstep(28 * DEG_TO_RAD, 65 * DEG_TO_RAD, absA);
        const qS = airData.qPa * spec.wingAreaM2;
        const qGain = baseAero.qGainCompress;

        const pitchPerElev = Math.max(0, qS * spec.macM * 0.55 * etaElev * qGain);
        const yawPerRud = Math.max(0, qS * spec.spanM * 0.11 * etaRud * qGain);
        const rollPerAil = Math.max(0, qS * spec.spanM * 0.16 * etaAil * qGain);

        const aeroPitchCap = pitchPerElev;
        elevCmd = pitchPerElev > 1 ? clamp(needMx / pitchPerElev, -1, 1) : clamp(fbwOut.surfaces.pitch, -1, 1);
        rudCmd = yawPerRud > 1 ? clamp(-needMy / yawPerRud, -1, 1) : clamp(fbwOut.surfaces.yaw, -1, 1);

        // Compensate small rudder-roll coupling cleanly so yaw inputs don't induce roll lag
        const rudderRollLeak = -0.025 * etaRud * qS * spec.spanM * qGain * rudCmd;
        const needRollAero = -needMz - rudderRollLeak;
        ailCmd = rollPerAil > 1 ? clamp(needRollAero / rollPerAil, -1, 1) : clamp(fbwOut.surfaces.roll, -1, 1);

        // Supplemental RCS torque in thin upper atmosphere / near-stall hover when aero saturates
        const remMx = needMx - elevCmd * aeroPitchCap;
        const remMy = needMy - (-rudCmd * yawPerRud);
        const remMz = needMz - (-(ailCmd * rollPerAil + rudderRollLeak));
        rcsMx = clamp(remMx, -rcsMaxMx, rcsMaxMx);
        rcsMy = clamp(remMy, -rcsMaxMy, rcsMaxMy);
        rcsMz = clamp(remMz, -rcsMaxMz, rcsMaxMz);
      }

      // Full 3D aero force & moment evaluation with actual control surface deflections
      const actualSurf: AeroSurfaceInputs = {
        elev: elevCmd,
        ail: ailCmd,
        rud: rudCmd,
        flaps: flapOut.teFlap,
        slats: flapOut.leFlap,
        gear: gearExt,
        speedbrake: fbwOut.surfaces.speedbrake,
      };
      const aeroRes = computeAeroForcesAndMoments(
        {
          flow,
          air: airData,
          rhoKgM3: atm.densityKgM3,
          altAboveGroundM: altAglM,
          ratesB3: this.rates,
          surfaces: actualSurf,
        },
        spec,
        this.tmpAeroForce,
        this.tmpAeroMoment
      );
      finalAeroRes = aeroRes;
      finalElevCmd = elevCmd;
      finalAilCmd = ailCmd;
      finalRudCmd = rudCmd;

      // Stevens & Lewis I_xz-coupled rigid-body Euler integration
      this.tmpTotalMoment.copy(aeroRes.momentB3);
      this.tmpTotalMoment.x += tvcTx + rcsMx;
      this.tmpTotalMoment.y += tvcTy + rcsMy;
      this.tmpTotalMoment.z += tvcTz + rcsMz;

      const angAccel = solveEulerAngularAccel(this.tmpTotalMoment, this.rates, spec.inertia, this.tmpAngAccel);
      this.rates.addScaledVector(angAccel, subDt);

      // Clamp pitch/roll/yaw rates smoothly in NORM/HIGH-G against rare extreme numerical spikes
      if (input.assist && !fbwOut.cobra.active && fbwOut.effectiveMode !== 'psm') {
        const safeV = Math.max(flow.speedMps, 40);
        const maxPosQ = (fbwOut.gLimitActivePos * G0) / safeV;
        const maxNegQ = (Math.abs(fbwOut.gLimitActiveNeg) * G0) / safeV;
        this.rates.x = clamp(this.rates.x, -maxNegQ, maxPosQ);
      }

      // Exponential quaternion map update
      const rotAngle = this.rates.length() * subDt;
      if (rotAngle > 1e-9) {
        this.tmpEuler.copy(this.rates).normalize();
        this.tmpQ.setFromAxisAngle(this.tmpEuler, rotAngle);
        this.quaternion.multiply(this.tmpQ).normalize();
      }

      // Total body-frame thrust + exact 32-deg canted AL-31FP TVC reaction vector (B3: forward is -Z)
      const tvcPitchRad = fbwOut.allocation.tvcPitch * spec.tvcMaxDeg * DEG_TO_RAD;
      const tvcYawRad = fbwOut.allocation.tvcYaw * spec.tvcMaxDeg * DEG_TO_RAD;
      const cantRad = spec.tvcCantDeg * DEG_TO_RAD;
      const tvcCosCant = spec.tvcCantDeg > 0 ? Math.cos(cantRad) : 1;
      const tvcSinCant = spec.tvcCantDeg > 0 ? Math.sin(cantRad) : 1;
      const fxThrust = propOut.thrustN * Math.sin(tvcYawRad) * tvcSinCant;
      const fyThrust = -propOut.thrustN * Math.sin(tvcPitchRad) * tvcCosCant;
      const fzThrust = -propOut.thrustN * fbwOut.allocation.axialThrustScale;

      // Felt body-Y normal acceleration for 1G trim and pilot G-meter
      const normalSpecificForce = (aeroRes.forceB3.y + fyThrust) / Math.max(this.massKg, 1);
      this.lastNormalAeroAccel = normalSpecificForce;
      const instG = (normalSpecificForce / G0) * (1 - wDrive);
      gLoadAccum += instG * (subDt / dt);

      // Project net force to world frame
      this.tmpAccelWorld.set(
        (aeroRes.forceB3.x + fxThrust) / this.massKg,
        (aeroRes.forceB3.y + fyThrust) / this.massKg,
        (aeroRes.forceB3.z + fzThrust) / this.massKg
      ).applyQuaternion(this.quaternion);

      // Add planetary gravitational acceleration
      this.tmpAccelWorld.addScaledVector(upUnit, -gEffMps2 * (1 - wDrive));

      // Ground rolling / ABS brakes / drag-chute tangential deceleration
      if (onGround && groundOut.decelMps2 > 0) {
        const vHoriz = this.tmpHorizDir.copy(vWorld).addScaledVector(upUnit, -vWorld.dot(upUnit));
        const hLen = vHoriz.length();
        if (hLen > 0.05) {
          const maxDecel = Math.min(groundOut.decelMps2, hLen / subDt);
          this.tmpAccelWorld.addScaledVector(vHoriz, -maxDecel / hLen);
        }
      }

      // If transitioning across upper exosphere (0 < rhoRel < 0.02), blend gently with space drive
      if (wDrive > 0) {
        const driveCap = this.boosting ? ceiling * this.boostFactor(env.airDensity) : ceiling;
        const driveTarget = throttleTarget(throttle, floor, ceiling) * (this.boosting ? this.boostFactor(env.airDensity) : 1);
        const fwdPost = this.forward(this.tmpForward);
        const desiredVelUnits = this.tmpDir.copy(fwdPost).multiplyScalar(Math.min(driveTarget, driveCap));
        const driveAccelWorldMps2 = desiredVelUnits
          .sub(this.velocity)
          .multiplyScalar(invUpm * 1.4);
        this.tmpAccelWorld.lerp(driveAccelWorldMps2, wDrive);
      }

      this.velocity.addScaledVector(this.tmpAccelWorld, subDt * upm);

      // Keep vertical velocity non-penetrating while rolling on ground
      if (onGround) {
        const vInward = this.velocity.dot(upUnit);
        if (vInward < 0) {
          this.velocity.addScaledVector(upUnit, -vInward);
        }
      }

      this.position.addScaledVector(this.velocity, subDt);
    }

    this.speed = this.velocity.length();
    this.gLoad += (gLoadAccum - this.gLoad) * (1 - Math.exp(-14 * dt));
    this.gPeak = Math.max(this.gPeak, this.gLoad);
    this.gMin = Math.min(this.gMin, this.gLoad);

    // Refresh final telemetry snapshot (syncing solved CAS trim + active FBW demand to 3D rig!)
    if (finalFbwOut && finalAeroRes) {
      const pitchStick = clamp(input.pitch, -1, 1);
      const rollStick = clamp(input.roll, -1, 1);
      const yawStick = clamp(input.yaw, -1, 1);
      const visPitch = clamp(finalElevCmd * 0.40 + finalFbwOut.surfaces.pitch * 0.35 + pitchStick * 0.25, -1, 1);
      const visRoll = clamp(finalAilCmd * 0.40 + finalFbwOut.surfaces.roll * 0.35 + rollStick * 0.25, -1, 1);
      const visYaw = clamp(finalRudCmd * 0.40 + finalFbwOut.surfaces.yaw * 0.35 + yawStick * 0.25, -1, 1);
      finalFbwOut.surfaces.pitch = visPitch;
      finalFbwOut.surfaces.roll = visRoll;
      finalFbwOut.surfaces.yaw = visYaw;
      if (spec.hasCanards) {
        const snowplow = onGround && this.tasMps > 8 && (airbrakeHeld || wheelBrakeHeld || pitchStick < -0.2);
        finalFbwOut.surfaces.canard = snowplow
          ? -0.92
          : clamp(
              pitchStick * 0.52 +
                visPitch * 0.48 +
                clamp(this.tmpFlow.alphaDeg, -10, 20) * 0.012 -
                Math.max(0, this.tmpFlow.alphaDeg - 20) * 0.032,
              -1,
              1,
            );
      }
      this.syncTelemetrySnapshot(
        spec,
        atm,
        upUnit,
        invUpm,
        finalFbwOut,
        finalAeroRes,
        finalPropThrustN,
        finalMaxDryN,
        finalMaxWetN,
        finalAbStage,
        finalSupercruise,
        gearDown,
        onGround,
        airbrakeHeld,
        wheelBrakeHeld,
        finalChute,
        finalTouchdownImpulse,
        dt
      );
    }
  }

  private stepDriveOrHypersonic(
    dt: number,
    input: FlightInput,
    env: FlightEnv,
    spec: AirframeSpec,
    fbwAf: ReturnType<typeof getFbwAirframeParams>,
    atm: AtmosphericState,
    upUnit: THREE.Vector3,
    upm: number,
    invUpm: number,
    floor: number,
    ceiling: number,
    tInspect: number,
    isHypersonicTier: boolean,
    speedMpsInit: number,
    gearDown: boolean,
    airbrakeHeld: boolean,
    wheelBrakeHeld: boolean,
    onGround: boolean
  ): void {
    this.massKg = combatMassKg(spec, this.fuelKg);
    const inAir = env.airDensity > 1e-4;
    const throttle = clamp(input.throttle, 0, 1);

    const vWorld = this.tmpVelMps.copy(this.velocity).multiplyScalar(invUpm);
    this.tmpInvQ.copy(this.quaternion).invert();
    this.tmpVelBody.copy(vWorld).applyQuaternion(this.tmpInvQ);
    const flow = computeFlowAngles(this.tmpVelBody, this.tmpFlow);
    const airData = aeroComputeAirData(flow.speedMps, atm);

    const fwdPre = this.forward(this.tmpForward);
    const bodyUp = this.tmpBodyUp.set(0, 1, 0).applyQuaternion(this.quaternion);
    const bodyRight = this.tmpRight.set(1, 0, 0).applyQuaternion(this.quaternion);
    const gravityBodyUp = bodyUp.dot(upUnit);
    const rollAngleRad = Math.atan2(bodyRight.dot(upUnit), gravityBodyUp);
    const pitchAngleRad = Math.asin(clamp(fwdPre.dot(upUnit), -1, 1));
    const gammaDeg =
      flow.speedMps > 1 ? Math.asin(clamp(vWorld.dot(upUnit) / flow.speedMps, -1, 1)) * RAD_TO_DEG : 0;

    const abOut = computeAfterburnerStage({
      throttle,
      boost: this.boosting,
      airDensity: atm.densityRel,
      fuelFrac: spec.maxFuelKg > 0 ? this.fuelKg / spec.maxFuelKg : 1,
      spoolState: this.spool,
      dt,
      airframe: fbwAf,
    });
    this.spool = abOut.spoolState;
    const wetFrac = clamp((this.spool - 0.75) / 0.25, 0, 1);

    const propOut = computeEngineThrust(spec, {
      throttle: isHypersonicTier ? clamp((this.spool - 0.05) / 0.7, 0, 1) : throttle,
      afterburner: abOut.abStage > 0,
      abFraction: wetFrac,
      mach: airData.mach,
      pressurePa: atm.pressurePa,
      tempK: atm.tempK,
      gamma: atm.gamma,
      hasOxygen: atm.hasOxygen,
      surfacePressurePa: atm.surfacePressurePa,
      surfaceTempK: atm.surfaceTempK,
      mode: 'solaris',
      speedTier: env.speedTier ?? (env.airLimitMps && env.airLimitMps > 4000 ? 'scramjet' : env.airLimitMps && env.airLimitMps > 800 ? 'hypersonic' : 'jet'),
      airAccelScale: env.airAccelScale ?? 1,
      gEffMps2: this.gravityMps2,
      massKg: this.massKg,
      fuelKg: this.fuelKg,
      zeroFuelCutoff: false,
    });
    this.fuelFlowKgS = 0;

    if (env.airDensity <= 1e-6 || atm.isVacuum) {
      this.fbwState.surfaces.leFlap = 0;
      this.fbwState.surfaces.teFlap = 0;
      this.fbwState.surfaces.canard = 0;
      this.fbwState.surfaces.tvcPitch = 0;
      this.fbwState.surfaces.tvcYaw = 0;
      this.fbwState.surfaces.dragChute = 0;
    } else {
      const hypFlap = computeFlapSchedule({
        flapMode: this.fbwState.flapMode,
        gearDown,
        mach: airData.mach,
        alphaDeg: flow.alphaDeg,
        iasMps: airData.iasMps,
      });
      const fade = smoothstep(1e-6, 0.01, atm.densityRel);
      this.fbwState.surfaces.leFlap = hypFlap.leFlap * fade;
      this.fbwState.surfaces.teFlap = hypFlap.teFlap * fade;
    }
    this.fbwState.surfaces.nozzleIris = abOut.nozzleIris;

    const fbwOut = stepFbwAndControls(this.fbwState, {
      airframe: fbwAf,
      pitch: clamp(input.pitch, -1, 1),
      roll: clamp(input.roll, -1, 1),
      yaw: clamp(input.yaw, -1, 1),
      speedMps: speedMpsInit,
      qPa: airData.qPa,
      airDensity: atm.densityRel,
      mach: airData.mach,
      alphaDeg: flow.alphaDeg,
      betaDeg: flow.betaDeg,
      gammaDeg,
      pitchAngleRad,
      rollAngleRad,
      currentRatesB3: [this.rates.x, this.rates.y, this.rates.z],
      gravityBodyUp,
      gravityAccelMps2: 0,
      gearDown,
      onGround,
      assist: input.assist,
      paddleHeld: !!input.highG,
      psmHeld: !!input.psm,
      airbrakeHeld,
      brakesHeld: wheelBrakeHeld,
      cobraTriggered: !!input.cobra,
      thrustN: propOut.thrustN,
      airAccelScale: env.airAccelScale ?? (isHypersonicTier ? 2 : 1),
      dt,
    });

    if (env.airDensity <= 1e-6 || atm.isVacuum) {
      this.fbwState.surfaces.leFlap = 0;
      this.fbwState.surfaces.teFlap = 0;
      this.fbwState.surfaces.canard = 0;
      this.fbwState.surfaces.tvcPitch = 0;
      this.fbwState.surfaces.tvcYaw = 0;
      this.fbwState.surfaces.dragChute = 0;
      fbwOut.surfaces.leFlap = 0;
      fbwOut.surfaces.teFlap = 0;
      fbwOut.surfaces.canard = 0;
      fbwOut.surfaces.tvcPitch = 0;
      fbwOut.surfaces.tvcYaw = 0;
      fbwOut.surfaces.dragChute = 0;
      fbwOut.allocation.tvcPitch = 0;
      fbwOut.allocation.tvcYaw = 0;
    }

    if (input.assist) {
      // Strictly critically-damped tracking (zero-bounce release required by hypersonicHandling.test.ts)
      this.rates.set(
        fbwOut.targetRatesB3[0],
        fbwOut.targetRatesB3[1],
        fbwOut.targetRatesB3[2]
      );
      // When flying level hands-off in hypersonic/scramjet atmosphere, gently follow Earth's curvature
      // and damp tiny residual vertical drift (< 2 deg) without ever triggering pitch-release bounce.
      if (
        isHypersonicTier &&
        inAir &&
        !onGround &&
        Math.abs(input.pitch) < 0.04 &&
        Math.abs(input.roll) < 0.04 &&
        Math.abs(this.rates.x) < 0.004 &&
        Math.abs(rollAngleRad) < 45 * DEG_TO_RAD &&
        Math.abs(gammaDeg) < 2.2
      ) {
        const horizSpeedMps = Math.max(0, flow.speedMps * Math.cos(gammaDeg * DEG_TO_RAD));
        // Curvature rate over Earth (~6371 km radius) keeps flight parallel to the globe surface
        const curvRate = -horizSpeedMps / 6_371_000;
        const levelHold = clamp(-gammaDeg * DEG_TO_RAD * 0.45, -0.008, 0.008);
        this.rates.x = clamp(this.rates.x + curvRate + levelHold, -0.009, 0.009);
      }
    } else {
      const k = 1 - Math.exp(-RATE_RESPONSE * dt);
      const tp = clamp(input.pitch, -1, 1) * MAX_PITCH_RATE;
      const ty = -clamp(input.yaw, -1, 1) * MAX_YAW_RATE;
      const tr = -clamp(input.roll, -1, 1) * MAX_ROLL_RATE;
      this.rates.x += (tp - this.rates.x) * k;
      this.rates.y += (ty - this.rates.y) * k;
      this.rates.z += (tr - this.rates.z) * k;
    }

    const angle = this.rates.length() * dt;
    if (angle > 1e-9) {
      this.tmpEuler.copy(this.rates).normalize();
      this.tmpQ.setFromAxisAngle(this.tmpEuler, angle);
      this.quaternion.multiply(this.tmpQ).normalize();
    }
    const fwd = this.forward(this.tmpForward);

    let target = throttleTarget(throttle, floor, ceiling);
    if (this.boosting) {
      target = Math.max(target, ceiling) * this.boostFactor(env.airDensity);
    }
    const baseLinear = LINEAR_ACCEL_MPS2 * upm;
    const inspectLinear =
      tInspect > 0 && env.inspectFloorUnitsPerS ? env.inspectFloorUnitsPerS * 2.2 * tInspect : 0;
    const linear = Math.max(baseLinear, inspectLinear) * (this.boosting ? 3 : 1);

    if (input.assist) {
      const before = this.speed;
      this.speed = approachSpeed(this.speed, target, dt, linear);
      if (isHypersonicTier && inAir && this.speed > before) {
        const tierAccel =
          (this.boosting ? AIR_ACCEL_AB_MPS2 : AIR_ACCEL_MPS2) * upm * Math.max(1, env.airAccelScale ?? 1);
        this.speed = Math.min(this.speed, before + tierAccel * dt);
      }
      if (!this.boosting) this.speed = Math.min(this.speed, ceiling * 2);

      // Hypersonic / drive velocity grip aligns smoothly without losing speed during high-M turns
      const grip = isHypersonicTier ? 12.0 : 1.35;
      const cur = this.velocity.length();
      if (cur < 1e-12) {
        this.tmpDir.copy(fwd);
      } else {
        this.tmpDir.copy(this.velocity).divideScalar(cur);
        this.tmpDir.lerp(fwd, 1 - Math.exp(-grip * dt));
        if (this.tmpDir.lengthSq() < 1e-12) this.tmpDir.copy(fwd);
        this.tmpDir.normalize();
      }
      this.velocity.copy(this.tmpDir).multiplyScalar(this.speed);
    } else {
      // Pure Newtonian drift in vacuum (`assist = false`)
      const cur = this.velocity.length();
      if (target > 0) {
        const accel = Math.max(linear, 1.1 * Math.max(cur, floor)) * throttle;
        this.velocity.addScaledVector(fwd, accel * dt);
      }
      const cap = this.boosting ? ceiling * this.boostFactor(env.airDensity) : ceiling;
      const len = this.velocity.length();
      if (len > cap) this.velocity.multiplyScalar(approachSpeed(len, cap, dt, linear) / len);
      this.speed = this.velocity.length();
    }

    const turnRate = Math.hypot(this.rates.x, this.rates.y);
    const targetG = inAir ? 1 + (Math.min(this.speed * invUpm, HANDLING_MPS) * turnRate) / G0 : 0;
    this.gLoad += (targetG - this.gLoad) * (1 - Math.exp(-6 * dt));
    this.gPeak = Math.max(this.gPeak, this.gLoad);
    this.gMin = Math.min(this.gMin, this.gLoad);

    this.position.addScaledVector(this.velocity, dt);

    // Populate clean telemetry snapshot for vacuum / hypersonic flight
    const neutralAero = computeAeroForcesAndMoments(
      {
        flow,
        air: airData,
        rhoKgM3: atm.densityKgM3,
        altAboveGroundM: env.groundClearanceM ?? Math.max(0, env.altitudeUnits * env.kmPerUnit * 1000),
        ratesB3: this.rates,
        surfaces: {
          elev: fbwOut.surfaces.pitch,
          ail: fbwOut.surfaces.roll,
          rud: fbwOut.surfaces.yaw,
          flaps: 0,
          slats: 0,
          gear: gearDown ? 1 : 0,
          speedbrake: fbwOut.surfaces.speedbrake,
        },
      },
      spec,
      this.tmpAeroForce,
      this.tmpAeroMoment
    );
    this.syncTelemetrySnapshot(
      spec,
      atm,
      upUnit,
      invUpm,
      fbwOut,
      neutralAero,
      propOut.thrustN,
      propOut.maxDryThrustN,
      propOut.maxWetThrustN,
      abOut.abStage,
      false,
      gearDown,
      onGround,
      airbrakeHeld,
      wheelBrakeHeld,
      0,
      0,
      dt
    );
  }

  private syncTelemetrySnapshot(
    spec: AirframeSpec,
    atm: AtmosphericState,
    upUnit: THREE.Vector3,
    invUpm: number,
    fbwOut: ReturnType<typeof stepFbwAndControls>,
    aeroRes: ReturnType<typeof computeAeroForcesAndMoments>,
    thrustN: number,
    maxDryThrustN: number,
    maxWetThrustN: number,
    abStage: 0 | 1 | 2 | 3,
    supercruise: boolean,
    gearDown: boolean,
    onGround: boolean,
    airbrakeActive: boolean,
    wheelBrakeActive: boolean,
    _dragChute: number,
    touchdownImpulse: number,
    dt: number
  ): void {
    const vWorld = this.tmpVelMps.copy(this.velocity).multiplyScalar(invUpm);
    const speedMps = vWorld.length();
    const airData = aeroComputeAirData(speedMps, atm);
    const fwd = this.forward(this.tmpForward);

    const pitchAngleRad = Math.asin(clamp(fwd.dot(upUnit), -1, 1));
    const vHoriz = vWorld.dot(upUnit);
    const fpvAngleDeg = speedMps > 1 ? Math.asin(clamp(vHoriz / speedMps, -1, 1)) * RAD_TO_DEG : pitchAngleRad * RAD_TO_DEG;

    this.cobraT = fbwOut.cobra.cobraT;
    this.thrustN = thrustN;
    this.maxDryThrustN = maxDryThrustN;
    this.maxWetThrustN = maxWetThrustN;
    this.abStage = abStage;
    this.supercruise = supercruise;
    this.twRatio = computeThrustToWeight(thrustN, this.massKg, Math.max(this.gravityMps2, 0.2));
    this.tasMps = airData.tasMps;
    this.easMps = airData.easMps;
    this.iasMps = airData.iasMps;
    this.mach = airData.mach;
    this.dynamicPressurePa = airData.qPa;
    this.ambientTempK = atm.tempK;
    this.ambientPressurePa = atm.pressurePa;
    this.soundMps = atm.soundSpeedMps;
    this.aoaDeg = this.tmpFlow.alphaDeg;
    this.aosDeg = this.tmpFlow.betaDeg;
    this.fpvAngleDeg = fpvAngleDeg;
    this.verticalSpeedMps = vHoriz;

    const axialThrustN = thrustN * fbwOut.allocation.axialThrustScale * Math.cos(this.tmpFlow.alphaRad);
    this.specificExcessPowerMps = atm.isVacuum
      ? 0
      : specificExcessPowerMps(axialThrustN, aeroRes.dragN, this.massKg, airData.tasMps, this.gravityMps2);

    this.cl = aeroRes.coeffs.cl;
    this.cd = aeroRes.coeffs.cd;
    this.liftN = aeroRes.liftN;
    this.dragN = aeroRes.dragN;
    this.stallFactor = aeroRes.coeffs.stallFactor;
    this.buffetFactor = aeroRes.coeffs.buffetFactor;
    this.vortexStrength = atm.isVacuum
      ? 0
      : clamp(smoothstep(10, 28, Math.abs(this.aoaDeg)) * aeroRes.coeffs.wAttached * clamp(airData.qPa / 8000, 0, 1), 0, 1);
    this.groundEffect = 1 - aeroRes.coeffs.sigmaGe;

    this.cornerSpeedMps = atm.isVacuum
      ? 0
      : computeCornerSpeed(this.massKg, spec.wingAreaM2, aeroRes.coeffs.clMaxEffective, fbwOut.gLimitActivePos, atm.densityKgM3).tasMps;
    this.stallSpeedMps = atm.isVacuum
      ? 0
      : computeStallSpeedMps(this.massKg, Math.max(this.gravityMps2, 0.2), atm.densityKgM3, spec.wingAreaM2, aeroRes.coeffs.clMaxEffective);

    this.onGround = onGround;
    this.touchdownImpulse = touchdownImpulse;
    this.fbwMode = fbwOut.effectiveMode;
    this.flapMode = this.fbwState.flapMode;
    this.fpvHoldActive = this.fbwState.fpvHoldActive;
    this.tvcActive = spec.hasTvc && (Math.abs(fbwOut.allocation.tvcPitch) > 0.04 || Math.abs(fbwOut.allocation.tvcYaw) > 0.04 || fbwOut.effectiveMode === 'psm');
    this.highGActive = fbwOut.highGDriftActive;
    this.airbrakeActive = airbrakeActive || fbwOut.surfaces.speedbrake > 0.05;
    this.wheelBrakeActive = wheelBrakeActive;

    const fwdSpeedMps = -this.tmpVelBody.z;
    const det = detectManeuver(this.fbwState, {
      alphaDeg: this.aoaDeg,
      betaDeg: this.aosDeg,
      pitchDeg: pitchAngleRad * RAD_TO_DEG,
      speedMps,
      forwardSpeedMps: fwdSpeedMps,
      mach: airData.mach,
      gLoad: this.gLoad,
      abStage,
      airbrake: fbwOut.surfaces.speedbrake,
      gearDown,
      onGround,
      ratesB3: [this.rates.x, this.rates.y, this.rates.z],
      fbwMode: fbwOut.effectiveMode,
      cobraPhase: this.fbwState.cobra.phase,
      kulbitSweepRad: this.fbwState.kulbitSweepRad,
      dt,
    });
    this.aerobaticManeuver = det;
    this.maneuver = toTelemetryManeuver(det);
    this.maneuverTimerSec = this.fbwState.cobra.phase !== 'IDLE' ? this.fbwState.cobra.timer : this.fbwState.maneuverHoldSec;

    this.alphaWarning = !atm.isVacuum && Math.abs(this.aoaDeg) >= fbwOut.alphaLimitDeg - 2;
    this.spinWarning = this.aerobaticManeuver === 'flat-spin' || this.aerobaticManeuver === 'falling-leaf';
    this.overGWarning = this.gLoad > fbwOut.gLimitActivePos * 0.98 || this.gLoad < fbwOut.gLimitActiveNeg * 0.98;

    this.surfaces = toJetSurfaceState(fbwOut.surfaces, {
      gear: gearDown ? 1 : 0,
      tvcMaxDeg: spec.tvcMaxDeg,
      tvcCantDeg: spec.tvcCantDeg,
    });
  }
}
