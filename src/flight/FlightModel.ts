import * as THREE from 'three';
import { KM_PER_UNIT } from '../rendering/Scale';

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

  private tmpForward = new THREE.Vector3();
  private tmpDir = new THREE.Vector3();
  private tmpQ = new THREE.Quaternion();
  private tmpEuler = new THREE.Vector3();

  /** How far boost pushes past the throttle ceiling: the afterburner in air, the drive in vacuum. */
  public boostFactor(airDensity: number): number {
    const k = Math.min(1, airDensity * 5);
    return BOOST_FACTOR + (AFTERBURNER_FACTOR - BOOST_FACTOR) * k;
  }

  public forward(out: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
    return out.copy(FORWARD).applyQuaternion(this.quaternion);
  }

  public step(dt: number, input: FlightInput, env: FlightEnv): void {
    if (!(dt > 0)) return;
    const upm = unitsPerMps(env.kmPerUnit);
    const speedMps = this.velocity.length() / upm;
    const inAir = env.airDensity > 1e-4;

    // --- Rotation: rates chase the stick, the way a fly-by-wire jet answers it. In air the pitch
    // rate is held under the G limit and the load can only build so fast (the onset limit); the
    // roll snaps to a high rate but has to accelerate to it.
    if (input.cobra && this.cobraT < 0 && inAir && speedMps > 80 && speedMps < 450 && input.assist) this.cobraT = 0;
    const handling = Math.min(speedMps, HANDLING_MPS);
    let maxPitch = MAX_PITCH_RATE;
    if (inAir && handling > 1) maxPitch = Math.max(0.3, Math.min(MAX_PITCH_RATE, (G_LIMIT * G0) / handling));
    const k = 1 - Math.exp(-RATE_RESPONSE * dt);
    const tp = THREE.MathUtils.clamp(input.pitch, -1, 1) * maxPitch;
    const ty = -THREE.MathUtils.clamp(input.yaw, -1, 1) * MAX_YAW_RATE;
    const tr = -THREE.MathUtils.clamp(input.roll, -1, 1) * (inAir ? MAX_ROLL_RATE_AIR : MAX_ROLL_RATE);
    if (this.cobraT >= 0) {
      // Post-stall: the nose is thrown up past the vertical and brought back while the jet keeps
      // sliding along its old path, shedding speed (Pugachev's cobra)
      this.cobraT += dt;
      const up = COBRA_TIME * 0.38;
      const hold = COBRA_TIME * 0.17;
      const pitchUp = (100 * Math.PI) / 180;
      this.rates.x = this.cobraT < up ? pitchUp / up : this.cobraT < up + hold ? 0 : -pitchUp / (COBRA_TIME - up - hold);
      this.rates.y *= 1 - k;
      this.rates.z *= 1 - k;
      if (this.cobraT >= COBRA_TIME) {
        this.cobraT = -1;
        this.rates.x = 0;
      }
    } else {
      let dp = (tp - this.rates.x) * k;
      if (inAir && speedMps > 30) {
        // Onset: the pitch rate (so the load) may not grow faster than G_ONSET allows
        const maxStep = ((G_ONSET * G0) / handling) * dt;
        if (Math.abs(this.rates.x + dp) > Math.abs(this.rates.x)) dp = THREE.MathUtils.clamp(dp, -maxStep, maxStep);
      }
      this.rates.x += dp;
      this.rates.y += (ty - this.rates.y) * k;
      if (inAir) {
        const want = (tr - this.rates.z) * Math.min(1, k * 1.6);
        this.rates.z += THREE.MathUtils.clamp(want, -ROLL_ACCEL * dt, ROLL_ACCEL * dt);
      } else {
        this.rates.z += (tr - this.rates.z) * k;
      }
    }
    const angle = this.rates.length() * dt;
    if (angle > 1e-9) {
      this.tmpEuler.copy(this.rates).normalize();
      this.tmpQ.setFromAxisAngle(this.tmpEuler, angle);
      this.quaternion.multiply(this.tmpQ).normalize();
    }
    const fwd = this.forward(this.tmpForward);

    // --- Speed: throttle → target between the floor and the drive ceiling
    const baseFloor = speedFloor(env.kmPerUnit);
    const tInspect = env.inspectBlend ? THREE.MathUtils.clamp(env.inspectBlend, 0, 1) : 0;
    const floor =
      tInspect > 0 && env.inspectFloorUnitsPerS !== undefined
        ? THREE.MathUtils.lerp(baseFloor, Math.max(baseFloor, env.inspectFloorUnitsPerS), tInspect)
        : baseFloor;
    const ceiling = speedCeiling(env);
    let target = throttleTarget(input.throttle, floor, ceiling);
    this.boosting = input.boost && this.boostEnergy > 0.02 && input.throttle > 0.02;
    if (this.boosting) {
      target = Math.max(target, ceiling) * this.boostFactor(env.airDensity);
      const drainRate = inAir ? BOOST_DRAIN * 0.45 : BOOST_DRAIN;
      this.boostEnergy = Math.max(0, this.boostEnergy - drainRate * dt);
    } else {
      const rechargeRate = inAir ? BOOST_RECHARGE * 1.5 : BOOST_RECHARGE;
      this.boostEnergy = Math.min(1, this.boostEnergy + rechargeRate * dt);
    }
    const baseLinear = LINEAR_ACCEL_MPS2 * upm;
    const inspectLinear = tInspect > 0 && env.inspectFloorUnitsPerS ? env.inspectFloorUnitsPerS * 2.2 * tInspect : 0;
    const linear = Math.max(baseLinear, inspectLinear) * (this.boosting ? 3 : 1);

    if (input.assist) {
      const before = this.speed;
      this.speed = approachSpeed(this.speed, target, dt, linear);
      // In air the engines, not the drive, set the pace: real fighter acceleration
      if (inAir && this.speed > before) {
        const ramjetBonus = (1 - Math.min(1, env.airDensity * 2.5)) * 260;
        const airAccel = ((this.boosting ? AIR_ACCEL_AB_MPS2 : AIR_ACCEL_MPS2) + (this.boosting ? ramjetBonus : 0)) * upm * (env.airAccelScale ?? 1);
        const k = Math.min(1, env.airDensity * 4);
        this.speed = Math.min(this.speed, before + airAccel * dt + (this.speed - before) * (1 - k));
      }
      // A hard turn costs energy: induced drag grows with the load (steeply), so a sustained 9 g
      // pull bleeds speed unless the burner is lit; the cobra sheds it fast
      if (inAir) {
        const air = Math.min(1, env.airDensity * 4);
        const over = Math.max(0, this.gLoad - 1);
        let bleed = TURN_BLEED * over ** 1.5 * air;
        if (this.cobraT >= 0) bleed = Math.max(bleed, (0.18 * speedMps) * air);
        this.speed = Math.max(floor, this.speed - bleed * upm * dt);
      }
      // Safety net outside boost: a world appearing close ahead drops the ceiling at once
      if (!this.boosting) this.speed = Math.min(this.speed, ceiling * 2);
      // Grip: how fast the velocity turns onto the nose (air bites harder than the thrusters)
      // (none during the cobra: the jet slides on along its path with its nose in the air)
      const grip = this.cobraT >= 0 ? 0 : inAir ? 2.2 + 2.5 * Math.min(1, env.airDensity * 4) : 1.3;
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
      // Newtonian: thrust along the nose, nothing turns the velocity
      const cur = this.velocity.length();
      if (target > 0) {
        const accel = Math.max(linear, 1.1 * Math.max(cur, floor)) * THREE.MathUtils.clamp(input.throttle, 0, 1);
        this.velocity.addScaledVector(fwd, accel * dt);
      }
      const cap = this.boosting ? ceiling * this.boostFactor(env.airDensity) : ceiling;
      const len = this.velocity.length();
      if (len > cap) this.velocity.multiplyScalar(approachSpeed(len, cap, dt, linear) / len);
      this.speed = this.velocity.length();
    }

    // Load factor: centripetal acceleration of the turn plus 1 g, smoothed
    const turnRate = Math.hypot(this.rates.x, this.rates.y);
    const g = inAir ? 1 + (Math.min(speedMps, HANDLING_MPS) * turnRate) / G0 : 0;
    this.gLoad += (g - this.gLoad) * (1 - Math.exp(-4 * dt));

    this.position.addScaledVector(this.velocity, dt);
  }
}
