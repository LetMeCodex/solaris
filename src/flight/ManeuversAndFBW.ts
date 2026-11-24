/**
 * Fly-by-Wire (FBW) control laws, thrust-vectoring allocation, flap/afterburner
 * scheduling, closed-loop post-stall maneuvers, maneuver telemetry detection,
 * and ground/landing rollout mechanics for Solaris fighters.
 *
 * Aligns directly with `JetTelemetry.ts` enum literals and control-surface
 * sign conventions. Body-frame angular rate convention (Three.js B3):
 *   -Forward = -Z, +Right = +X, +Up (canopy) = +Y
 *   angular rates [rx, ry, rz] = [pitchUp (+q), yawLeft (-r), rollLeftDown (-p)]
 */

import {
  type FbwMode,
  type FlapMode,
  type JetAirframeId,
  type JetSurfaceState,
  type ManeuverKind as TelemetryManeuverKind,
  createJetSurfaceState,
} from './JetTelemetry';

export type { FbwMode, FlapMode, JetAirframeId, JetSurfaceState, TelemetryManeuverKind };
export type AirframeId = JetAirframeId;

export type AerobaticManeuverKind =
  | 'none'
  | 'cobra'
  | 'kulbit'
  | 'herbst'
  | 'falling-leaf'
  | 'hammerhead'
  | 'tailslide'
  | 'snap-roll'
  | 'barrel-roll'
  | 'high-g-drift'
  | 'flat-spin'
  | 'flare'
  | 'supercruise';

export type ManeuverKind = AerobaticManeuverKind;

export interface ControlSurfaceDeflections {
  pitch: number;       // -1..1 normalized pitch command (+ = nose up)
  roll: number;        // -1..1 normalized roll command (+ = roll right)
  yaw: number;         // -1..1 normalized yaw command (+ = yaw right)
  canard: number;      // -1..1 (+ = TE down / nose-up lift; -0.85 ground snowplow)
  leFlap: number;      // 0..1 leading-edge droop / slat
  teFlap: number;      // 0..1 trailing-edge flap
  speedbrake: number;  // 0..1 airbrake deployment
  nozzleIris: number;  // 0..1 aperture (0 = tight military pinch, 1 = max AB flare)
  tvcPitch: number;    // -1..1 pitch nozzle gimbal (+ = nozzle up => nose up)
  tvcYaw: number;      // -1..1 yaw nozzle gimbal (+ = nozzle right => nose right)
  dragChute: number;   // 0..1 braking parachute (Su-30 / Kestrel rollout)
}

export interface FbwAirframeParams {
  id: JetAirframeId;
  hasCanards: boolean;
  hasTvc: boolean;
  hasDragChute: boolean;
  dryThrustN: number;
  wetThrustN: number;
  gLimitPos: number;
  gLimitNeg: number;
  highGLimit: number;
  gOnset: number;               // max G/s load buildup in atmospheric turns
  normAlphaLimitDeg: number;
  highGAlphaLimitDeg: number;
  tvcArmM: number;
  tvcMaxDeg: number;
  tvcCantDeg: number;           // 32 deg for Su-30MKK canted 3D TVC nozzles
  tvcSlewDegPerSec: number;     // hydraulic TVC slew (30 deg/s AL-31FP)
  tvcRollArmM: number;          // lateral engine spacing for differential canted roll
  maxPitchRateRad: number;
  maxRollRateRad: number;
  maxYawRateRad: number;
  /** Moment of inertia tensor components [Ixx, Iyy, Izz, Ixz] in kg*m^2 */
  inertia: readonly [number, number, number, number];
}

export const G0_MPS2 = 9.80665;
const DEG_TO_RAD = Math.PI / 180;
const DEFAULT_COBRA_DURATION_S = 2.38;

export const AIRFRAME_FBW_SPECS: Record<JetAirframeId, FbwAirframeParams> = {
  gripen: {
    id: 'gripen',
    hasCanards: true,
    hasTvc: false,
    hasDragChute: false,
    dryThrustN: 54000,
    wetThrustN: 80500,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    gOnset: 14.0,
    normAlphaLimitDeg: 28,
    highGAlphaLimitDeg: 36,
    tvcArmM: 0,
    tvcMaxDeg: 0,
    tvcCantDeg: 0,
    tvcSlewDegPerSec: 0,
    tvcRollArmM: 0,
    maxPitchRateRad: 1.85,
    maxRollRateRad: 5.2,
    maxYawRateRad: 0.95,
    // Synchronized 1:1 with AirframeSpecs.ts (single source of truth)
    inertia: [10800, 58000, 66000, 1200],
  },
  su30: {
    id: 'su30',
    hasCanards: false,
    hasTvc: true,
    hasDragChute: true,
    dryThrustN: 149000,
    wetThrustN: 245160,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    gOnset: 14.0,
    normAlphaLimitDeg: 30,
    highGAlphaLimitDeg: 40,
    tvcArmM: 6.8,
    tvcMaxDeg: 15,
    tvcCantDeg: 32,
    tvcSlewDegPerSec: 30,
    tvcRollArmM: 1.2,
    maxPitchRateRad: 1.75,
    maxRollRateRad: 4.1,
    maxYawRateRad: 1.0,
    // Synchronized 1:1 with AirframeSpecs.ts (single source of truth)
    inertia: [48000, 225000, 265000, 3800],
  },
  kestrel: {
    id: 'kestrel',
    hasCanards: false,
    hasTvc: true,
    hasDragChute: true,
    dryThrustN: 82000,
    wetThrustN: 132000,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    gOnset: 14.0,
    normAlphaLimitDeg: 29,
    highGAlphaLimitDeg: 38,
    tvcArmM: 6.2,
    tvcMaxDeg: 15,
    tvcCantDeg: 0,
    tvcSlewDegPerSec: 40,
    tvcRollArmM: 0.9,
    maxPitchRateRad: 1.85,
    maxRollRateRad: 4.8,
    maxYawRateRad: 1.0,
    inertia: [21000, 118000, 134000, 1800],
  },
};

export function getFbwAirframeParams(id?: string): FbwAirframeParams {
  if (id === 'gripen' || id === 'su30' || id === 'kestrel') {
    return AIRFRAME_FBW_SPECS[id];
  }
  return AIRFRAME_FBW_SPECS.kestrel;
}

export function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function moveToward(cur: number, target: number, maxDelta: number): number {
  const diff = target - cur;
  if (Math.abs(diff) <= maxDelta) return target;
  return cur + Math.sign(diff) * maxDelta;
}

// ---------------------------------------------------------------------------
// Flap Schedule
// ---------------------------------------------------------------------------

export interface FlapScheduleInput {
  flapMode: FlapMode;
  gearDown: boolean;
  mach: number;
  alphaDeg: number;
  iasMps: number;
}

export interface FlapScheduleOutput {
  leFlap: number;
  teFlap: number;
  clDelta: number;
  cdDelta: number;
  cmDelta: number;
}

/**
 * Schedules leading-edge slats/droops and trailing-edge camber flaps with
 * authentic transonic and dynamic-pressure blowback protection.
 */
export function computeFlapSchedule(inp: FlapScheduleInput): FlapScheduleOutput {
  const teMachFade = 1 - smoothstep(0.78, 0.96, inp.mach);
  const leMachFade = 1 - smoothstep(0.86, 1.16, inp.mach);
  const absAlpha = Math.abs(inp.alphaDeg);

  let targetLe = 0;
  let targetTe = 0;

  if (inp.flapMode === 'land' || (inp.flapMode === 'auto' && inp.gearDown)) {
    const landingIasFade = 1 - smoothstep(145, 210, inp.iasMps);
    targetTe = 0.95 * Math.min(teMachFade, landingIasFade);
    targetLe = Math.max(0.85, 0.95 * landingIasFade) * leMachFade;
  } else if (inp.flapMode === 'combat') {
    const combatIasFade = 1 - smoothstep(280, 360, inp.iasMps);
    targetTe = 0.38 * teMachFade * combatIasFade;
    targetLe = clamp(0.4 + smoothstep(4, 18, absAlpha) * 0.55, 0.4, 0.95) * leMachFade;
  } else {
    const subsonicTurn = smoothstep(5, 16, absAlpha) * (1 - smoothstep(0.75, 0.92, inp.mach));
    targetTe = 0.28 * subsonicTurn * teMachFade;
    targetLe = smoothstep(3.5, 20, absAlpha) * leMachFade;
  }

  const leFlap = clamp(targetLe, 0, 1);
  const teFlap = clamp(targetTe, 0, 1);

  return {
    leFlap,
    teFlap,
    clDelta: teFlap * 0.42 + leFlap * 0.14,
    cdDelta: teFlap * teFlap * 0.065 + leFlap * 0.012,
    cmDelta: -teFlap * 0.035 + leFlap * 0.012,
  };
}

// ---------------------------------------------------------------------------
// Afterburner & Propulsion Staging
// ---------------------------------------------------------------------------

export interface AfterburnerInput {
  throttle: number;         // 0..1 cockpit throttle position
  boost: boolean;           // true engages afterburner / boost overdrive
  abOverrideStage?: number; // optional explicit stage 0..3 when armed
  airDensity: number;
  fuelFrac: number;         // 0..1 remaining internal fuel
  spoolState: number;       // 0..1 current core + burner spool
  dt: number;
  airframe?: FbwAirframeParams;
}

export interface AfterburnerOutput {
  abStage: 0 | 1 | 2 | 3;
  spoolState: number;
  thrustFraction: number;   // 0..wetToDryRatio (1.0 = 100% Dry Military Power)
  thrustN: number;
  fuelBurnMultiplier: number;
  nozzleIris: number;       // 0..1 (0 = tight military pinch, 1 = max AB flare)
  supercruiseCandidate: boolean;
}

/**
 * Computes turbine spool, afterburner stages 0..3, variable nozzle throat iris,
 * and fuel-burn multiplier. Preserves `throttle = 1, boost = false` as 100%
 * Dry Military Power (`abStage = 0, thrustFraction = 1.0`).
 */
export function computeAfterburnerStage(inp: AfterburnerInput): AfterburnerOutput {
  const af = inp.airframe ?? AIRFRAME_FBW_SPECS.kestrel;
  const throttle = clamp(inp.throttle, 0, 1);
  const dryRatio = af.dryThrustN > 0 ? af.wetThrustN / af.dryThrustN : 1.5;

  if (inp.fuelFrac <= 0) {
    const spoolOut = moveToward(clamp(inp.spoolState, 0, 1), 0, 3.0 * Math.max(inp.dt, 0));
    return {
      abStage: 0,
      spoolState: spoolOut,
      thrustFraction: 0,
      thrustN: 0,
      fuelBurnMultiplier: 0,
      nozzleIris: 0.4,
      supercruiseCandidate: false,
    };
  }

  let abStage: 0 | 1 | 2 | 3 = 0;
  if (inp.abOverrideStage !== undefined && inp.abOverrideStage >= 1 && throttle > 0.5) {
    abStage = inp.abOverrideStage >= 3 ? 3 : inp.abOverrideStage >= 2 ? 2 : 1;
  } else if (inp.boost) {
    abStage = throttle >= 0.85 ? 3 : throttle >= 0.5 ? 2 : 1;
  }

  // Engaging AB advances core to 100% Mil (0.75) before staging wet injectors (0.75..1.0)
  const dryCmd = abStage >= 1 ? 0.75 : 0.05 + 0.70 * throttle;
  const abFraction = abStage === 0 ? 0 : abStage === 1 ? 0.35 : abStage === 2 ? 0.68 : 1.0;
  const targetSpool = dryCmd + abFraction * 0.25;

  const rising = targetSpool > inp.spoolState;
  // Crisp digital FADEC turbofan response: fast dry core spool (1.85/s), rapid afterburner
  // staging (5.2/s), and immediate light-off acceleration when AB is commanded from cruise.
  const rate = rising
    ? (abStage >= 1 ? (inp.spoolState >= 0.72 ? 5.2 : 2.6) : 1.85)
    : 3.0;
  const spoolState = moveToward(clamp(inp.spoolState, 0, 1), targetSpool, rate * Math.max(inp.dt, 0));

  const dryLevel = clamp((spoolState - 0.05) / 0.70, 0, 1);
  const wetLevel = clamp((spoolState - 0.75) / 0.25, 0, 1);
  const thrustFraction = dryLevel * (1 + wetLevel * (dryRatio - 1));
  const thrustN = thrustFraction * af.dryThrustN;

  // Nozzle iris: relaxed open (~0.42) at idle, pinched tight (~0.06) at Dry Mil,
  // flaring open (0.55 -> 1.0) across afterburner stages 1..3.
  const dryIris = 0.42 - 0.36 * Math.pow(dryLevel, 1.3);
  const nozzleIris = clamp(dryIris + wetLevel * (1.0 - dryIris), 0.05, 1.0);

  const fuelBurnMultiplier =
    abStage === 0 ? 0.12 + 0.88 * dryLevel : 1.0 + wetLevel * 3.0;

  return {
    abStage,
    spoolState,
    thrustFraction,
    thrustN,
    fuelBurnMultiplier,
    nozzleIris,
    supercruiseCandidate: abStage === 0 && dryLevel >= 0.9 && inp.airDensity > 0,
  };
}

// ---------------------------------------------------------------------------
// State Containers
// ---------------------------------------------------------------------------

export type CobraPhase = 'IDLE' | 'PITCH_UP' | 'HOLD' | 'RECOVER';

export interface CobraState {
  phase: CobraPhase;
  timer: number;
  entrySpeedMps: number;
  cooldown: number;
  pitchSweepRad: number;
  kulbitActive: boolean;
}

export interface FbwControllerState {
  mode: FbwMode;
  flapMode: FlapMode;
  fpvHoldActive: boolean;
  fpvTargetGammaDeg: number;
  rateCmdB3: [number, number, number];
  gCmdCurrent: number;
  kulbitSweepRad: number;
  cobra: CobraState;
  surfaces: ControlSurfaceDeflections;
  lastManeuver: AerobaticManeuverKind;
  maneuverHoldSec: number;
  dragChuteDeployed: boolean;
}

export function createFbwState(): FbwControllerState {
  return {
    mode: 'norm',
    flapMode: 'auto',
    fpvHoldActive: false,
    fpvTargetGammaDeg: 0,
    rateCmdB3: [0, 0, 0],
    gCmdCurrent: 0,
    kulbitSweepRad: 0,
    cobra: {
      phase: 'IDLE',
      timer: 0,
      entrySpeedMps: 0,
      cooldown: 0,
      pitchSweepRad: 0,
      kulbitActive: false,
    },
    surfaces: {
      pitch: 0,
      roll: 0,
      yaw: 0,
      canard: 0,
      leFlap: 0,
      teFlap: 0,
      speedbrake: 0,
      nozzleIris: 0.15,
      tvcPitch: 0,
      tvcYaw: 0,
      dragChute: 0,
    },
    lastManeuver: 'none',
    maneuverHoldSec: 0,
    dragChuteDeployed: false,
  };
}

// ---------------------------------------------------------------------------
// Closed-Loop Cobra & Active PSM
// ---------------------------------------------------------------------------

export interface CobraStepInput {
  cobraTriggered: boolean;
  psmHold: boolean;
  pitchInput: number;
  speedMps: number;
  alphaDeg: number;
  pitchAngleRad: number;
  currentPitchRate: number;
  currentG?: number;
  airDensity: number;
  hasTvc: boolean;
  dt: number;
}

export interface CobraStepOutput {
  active: boolean;
  /** Compatible with legacy FlightModel.cobraT (-1 idle, >= 0 elapsed active) */
  cobraT: number;
  pitchRateTargetRad: number;
  gBypass: boolean;
  extraDragFactor: number;
  /** Automatic Cobra SOP throttle cap (idle chop during high-speed pre-decel only), or undefined */
  autoThrottleCap?: number;
  /** Automatic speedbrake deployment [0..1] during high-speed Cobra entry */
  autoAirbrake?: number;
  /** Authentic Sukhoi thrust-vector suspension & recovery burst during Cobra HOLD/RECOVER */
  autoRecoveryThrust?: boolean;
}

/**
 * Closed-loop Pugachev's Cobra and optional Kulbit continuation controller.
 * High-speed entry (> 165 m/s) executes authentic Sukhoi SOP: automatic throttle chop +
 * speedbrake deployment + structural G-capped pre-deceleration (~8.2G max) down into corner speed
 * before whipping cleanly past 90-105 deg AoA, preventing 18-24G structural overload spikes.
 * Early nose-down stick (`pitchInput < -0.55`) aborts cleanly into recovery;
 * sustained full back-stick in PSM with TVC continues through a 360° Kulbit.
 */
export function stepCobraAndPsmAssist(
  cobra: CobraState,
  inp: CobraStepInput,
): CobraStepOutput {
  const dt = Math.max(inp.dt, 0);
  cobra.cooldown = Math.max(0, cobra.cooldown - dt);

  if (inp.cobraTriggered && cobra.phase === 'IDLE' && cobra.cooldown <= 0 && inp.airDensity > 0.02) {
    cobra.phase = 'PITCH_UP';
    cobra.timer = 0;
    cobra.entrySpeedMps = inp.speedMps;
    cobra.pitchSweepRad = 0;
    cobra.kulbitActive = false;
  }

  if (cobra.phase === 'IDLE') {
    return { active: false, cobraT: -1, pitchRateTargetRad: 0, gBypass: false, extraDragFactor: 0 };
  }

  cobra.timer += dt;
  cobra.pitchSweepRad += inp.currentPitchRate * dt;

  if (inp.pitchInput < -0.55 && cobra.phase !== 'RECOVER') {
    cobra.phase = 'RECOVER';
  }

  if (
    inp.hasTvc &&
    inp.psmHold &&
    inp.pitchInput > 0.65 &&
    (cobra.pitchSweepRad > 75 * DEG_TO_RAD || inp.alphaDeg > 80)
  ) {
    cobra.kulbitActive = true;
  }

  const peakRad = (inp.hasTvc ? 102 : 101) * DEG_TO_RAD;
  const maxDuration = cobra.kulbitActive ? 3.8 : DEFAULT_COBRA_DURATION_S;
  let pitchRateTargetRad = 0;

  if (cobra.kulbitActive) {
    pitchRateTargetRad = 2.35;
    if (cobra.pitchSweepRad >= 325 * DEG_TO_RAD || cobra.timer >= maxDuration) {
      cobra.phase = 'RECOVER';
      cobra.kulbitActive = false;
    }
  } else if (cobra.phase === 'PITCH_UP') {
    const err = peakRad - inp.pitchAngleRad;
    const baseMaxRate = inp.hasTvc ? 2.75 : 2.76;
    // Crisp post-stall Cobra snap rate (mildly damped at high Mach while symmetric flaperon/spoiler
    // lift-dump & airbrakes keep structural normal load strictly <= 9.0G without stalling the pitch-up!)
    const speedDamp = clamp(1.0 - smoothstep(210, 320, inp.speedMps) * 0.16, 0.84, 1.0);
    pitchRateTargetRad = clamp(err * 3.7, 1.35, baseMaxRate * speedDamp);
    const holdTriggerRad = (inp.hasTvc ? 94 : 94) * DEG_TO_RAD;
    if (inp.pitchAngleRad >= holdTriggerRad || inp.alphaDeg >= 95 || cobra.timer >= 0.94) {
      cobra.phase = 'HOLD';
    }
  } else if (cobra.phase === 'HOLD') {
    const targetHoldRad = (inp.hasTvc ? 95 : 95) * DEG_TO_RAD;
    const err = targetHoldRad - inp.pitchAngleRad;
    pitchRateTargetRad = clamp(err * 2.8 - inp.currentPitchRate * 0.45, -0.95, 0.95);
    if (cobra.timer >= 1.18) {
      cobra.phase = 'RECOVER';
    }
  }

  if (cobra.phase === 'RECOVER') {
    const timeRemaining = Math.max(0.14, maxDuration - cobra.timer);
    // Shortest signed angle to crisp level-plus (+1.5 deg) arrest horizon for Cobra so wings
    // fly out razor-flat (VS ~ 0..+2 m/s) while recovery AB accelerates cleanly past 140+ m/s;
    // 360-deg Kulbit (+325 deg) smoothly completes the final +35 deg forward onto 360 deg!
    const recoverTargetRad = cobra.pitchSweepRad > 200 * DEG_TO_RAD ? 0 : 1.5 * DEG_TO_RAD;
    const deltaPitch = inp.pitchAngleRad - recoverTargetRad;
    const wrappedPitchErr = Math.atan2(Math.sin(deltaPitch), Math.cos(deltaPitch));
    const pdRate = -wrappedPitchErr * 3.9 - inp.currentPitchRate * 0.42;
    const timeRate = -wrappedPitchErr / timeRemaining - inp.currentPitchRate * 0.25;
    const desiredRate = Math.abs(pdRate) > Math.abs(timeRate) ? pdRate : timeRate;
    pitchRateTargetRad = clamp(desiredRate, -3.5, 2.2);

    const leveled = Math.abs(wrappedPitchErr) < 0.08 && Math.abs(inp.currentPitchRate) < 0.30;
    if ((cobra.timer >= 1.65 && leveled) || cobra.timer >= maxDuration) {
      cobra.phase = 'IDLE';
      cobra.timer = 0;
      cobra.cooldown = 0.55;
      cobra.kulbitActive = false;
      return { active: false, cobraT: -1, pitchRateTargetRad: 0, gBypass: false, extraDragFactor: 0 };
    }
  }

  const sinA = Math.sin(Math.max(Math.abs(inp.alphaDeg) * DEG_TO_RAD, Math.abs(inp.pitchAngleRad)));
  // Chop throttle & pop airbrake ONLY during high-speed pre-decel (> 175 m/s, alpha < 50 deg);
  // past 50 deg or in HOLD/RECOVER, retract speedbrake & fire MIL/AB suspension thrust so the jet
  // hangs heroically in mid-air and exits level at 145+ m/s with ZERO -40 m/s stall-sink plunge!
  const decelBrakeFrac =
    !cobra.kulbitActive && cobra.phase === 'PITCH_UP' && inp.speedMps > 215 && inp.alphaDeg < 50
      ? smoothstep(215, 265, inp.speedMps)
      : 0;
  const extraDragFactor = Math.max(sinA * sinA, decelBrakeFrac * 0.55);
  const autoThrottleCap = decelBrakeFrac > 0.05 ? 0.08 : undefined;
  const autoAirbrake = decelBrakeFrac > 0.05 ? clamp(decelBrakeFrac * 1.25, 0, 1) : 0;
  const autoRecoveryThrust =
    !cobra.kulbitActive &&
    (cobra.phase === 'HOLD' || cobra.phase === 'RECOVER' || inp.alphaDeg >= 50) &&
    inp.speedMps < 175;

  return {
    active: true,
    cobraT: cobra.timer,
    pitchRateTargetRad,
    gBypass: true,
    extraDragFactor,
    autoThrottleCap,
    autoAirbrake,
    autoRecoveryThrust,
  };
}

// ---------------------------------------------------------------------------
// Primary Control Moment Allocation (Aero + 32°-canted 3D TVC + RCS)
// ---------------------------------------------------------------------------

export interface ControlAllocationInput {
  airframe: FbwAirframeParams;
  surfacesCmd: { pitch: number; roll: number; yaw: number; canard?: number };
  qPa: number;
  alphaDeg: number;
  thrustN: number;
  airDensity: number;
  psmActive: boolean;
  dt: number;
}

export interface ControlAllocationOutput {
  aeroEffectiveness: number;
  rudderEffectiveness: number;
  canardEffectiveness: number;
  tvcPitch: number;
  tvcYaw: number;
  /** Asymmetric differential TVC pitch term [-1..1] from 32-deg canted yaw+roll mixing */
  tvcDiffRoll: number;
  /** Total TVC torque in B3 [M_pitch, -N_yaw, -L_roll] in N*m */
  tvcTorqueB3: [number, number, number];
  /** Thrust cosine projection factor from vectoring deflection */
  axialThrustScale: number;
  /** High-altitude / exo-atmospheric RCS authority [0..1] */
  rcsAuthority: number;
}

/**
 * Allocates commanded moments across aerodynamic control surfaces (accounting
 * for high-AoA wake blanking), slew-limited 2D/3D TVC nozzles (including Su-30
 * 32-degree canted yaw->roll coupling), and vacuum RCS blending.
 */
export function allocateControlMoments(
  state: FbwControllerState,
  inp: ControlAllocationInput,
): ControlAllocationOutput {
  const af = inp.airframe;
  const absAlpha = Math.abs(inp.alphaDeg);
  const dt = Math.max(inp.dt, 0);

  const postStall = Math.max(0, absAlpha - 26);
  const aeroEffectiveness = clamp(1 / (1 + Math.pow(postStall / 28, 2)), 0.16, 1.0);
  const rudderEffectiveness = clamp(1 / (1 + Math.pow(postStall / 20, 2)), 0.12, 1.0);
  const canardEffectiveness = af.hasCanards
    ? clamp(1 / (1 + Math.pow(Math.max(0, absAlpha - 34) / 36, 2)), 0.38, 1.0)
    : 0;

  let tvcPitch = 0;
  let tvcYaw = 0;
  let tvcDiffRoll = 0;
  let tvcTorquePitch = 0;
  let tvcTorqueYawB3 = 0;
  let tvcTorqueRollB3 = 0;
  let axialThrustScale = 1.0;

  if (af.hasTvc && af.tvcMaxDeg > 0) {
    const tvcBlend = inp.psmActive
      ? 1.0
      : clamp(0.25 + smoothstep(14, 38, absAlpha) * 0.75 + (1 - smoothstep(1200, 8500, inp.qPa)) * 0.55, 0.25, 1.0);

    const targetTvcPitch = clamp(inp.surfacesCmd.pitch * tvcBlend, -1, 1);
    const targetTvcYaw = clamp(inp.surfacesCmd.yaw * tvcBlend + inp.surfacesCmd.roll * 0.25 * tvcBlend, -1, 1);

    const maxSlewNormPerSec = af.tvcSlewDegPerSec / af.tvcMaxDeg;
    tvcPitch = moveToward(state.surfaces.tvcPitch, targetTvcPitch, maxSlewNormPerSec * dt);
    tvcYaw = moveToward(state.surfaces.tvcYaw, targetTvcYaw, maxSlewNormPerSec * dt);

    const pitchDeflRad = tvcPitch * af.tvcMaxDeg * DEG_TO_RAD;
    const yawDeflRad = tvcYaw * af.tvcMaxDeg * DEG_TO_RAD;
    const effThrustN = Math.max(0, inp.thrustN);

    if (af.tvcCantDeg > 0) {
      // Canted twin-nozzle V-hinges (e.g. Su-30MKK ±32°): symmetric deflection pitches at cos(cant);
      // differential deflection couples yaw (sin(cant) * tvcArmM) with roll (cos(cant) * tvcRollArmM).
      const cantRad = af.tvcCantDeg * DEG_TO_RAD;
      const cosCant = Math.cos(cantRad);
      const sinCant = Math.sin(cantRad);
      const fyPitch = effThrustN * Math.sin(pitchDeflRad) * cosCant;
      const fzYaw = effThrustN * Math.sin(yawDeflRad) * sinCant;
      const fDiffRoll = effThrustN * Math.sin(yawDeflRad) * cosCant;

      tvcTorquePitch = fyPitch * af.tvcArmM;
      tvcTorqueYawB3 = -fzYaw * af.tvcArmM;
      tvcTorqueRollB3 = -(fDiffRoll * af.tvcRollArmM);
      tvcDiffRoll = tvcYaw * cosCant;
    } else {
      // Orthogonal 2D/3D nozzles (e.g. Kestrel)
      const fyPitch = effThrustN * Math.sin(pitchDeflRad);
      const fzYaw = effThrustN * Math.sin(yawDeflRad);
      tvcTorquePitch = fyPitch * af.tvcArmM;
      tvcTorqueYawB3 = -fzYaw * af.tvcArmM;
      tvcTorqueRollB3 = 0;
      tvcDiffRoll = 0;
    }

    const netAngle = Math.hypot(pitchDeflRad, yawDeflRad);
    axialThrustScale = Math.cos(Math.min(netAngle, 0.45));
  }

  state.surfaces.tvcPitch = tvcPitch;
  state.surfaces.tvcYaw = tvcYaw;

  const rcsAuthority = inp.airDensity <= 1e-5 ? 1.0 : 1.0 - smoothstep(80, 650, inp.qPa);

  return {
    aeroEffectiveness,
    rudderEffectiveness,
    canardEffectiveness,
    tvcPitch,
    tvcYaw,
    tvcDiffRoll,
    tvcTorqueB3: [tvcTorquePitch, tvcTorqueYawB3, tvcTorqueRollB3],
    axialThrustScale,
    rcsAuthority,
  };
}

// ---------------------------------------------------------------------------
// Primary FBW Control Law (G-Command / Alpha-Command / PSM / Hypersonic)
// ---------------------------------------------------------------------------

export interface FbwStepInput {
  airframe: FbwAirframeParams;
  pitch: number;             // -1..1 (+ = nose up)
  roll: number;              // -1..1 (+ = roll right)
  yaw: number;               // -1..1 (+ = yaw right)
  speedMps: number;
  qPa: number;
  airDensity: number;
  mach: number;
  alphaDeg: number;
  betaDeg: number;
  gammaDeg: number;
  pitchAngleRad: number;
  rollAngleRad: number;
  currentRatesB3: readonly [number, number, number];
  /** Live measured normal load factor (Nz in G) for closed-loop FBW G-limiting & Cobra governing */
  currentG?: number;
  gravityBodyUp: number;
  gravityAccelMps2: number;
  gearDown: boolean;
  onGround: boolean;
  assist: boolean;
  paddleHeld: boolean;
  psmHeld: boolean;
  airbrakeHeld: boolean;
  brakesHeld?: boolean;
  cobraTriggered: boolean;
  thrustN: number;
  airAccelScale?: number;
  gLimitOverride?: number;
  dt: number;
}

export interface FbwStepOutput {
  effectiveMode: FbwMode;
  targetRatesB3: [number, number, number];
  surfaces: ControlSurfaceDeflections;
  allocation: ControlAllocationOutput;
  cobra: CobraStepOutput;
  gLimitActivePos: number;
  gLimitActiveNeg: number;
  alphaLimitDeg: number;
  highGDriftActive: boolean;
}

/**
 * Executes one FBW cycle: law selection, Cobra/Kulbit/PSM arbitration,
 * G-command + onset shaping, AoA protection, 1G auto-trim / FPV hold, ARI,
 * and strictly critically-damped hypersonic/drive rate filtering.
 */
export function stepFbwAndControls(
  state: FbwControllerState,
  inp: FbwStepInput,
): FbwStepOutput {
  const af = inp.airframe;
  const dt = Math.max(inp.dt, 1e-4);

  const effectiveMode: FbwMode =
    inp.psmHeld || state.mode === 'psm'
      ? 'psm'
      : inp.paddleHeld || state.mode === 'high-g'
        ? 'high-g'
        : 'norm';

  const cobra = stepCobraAndPsmAssist(state.cobra, {
    cobraTriggered: inp.cobraTriggered,
    psmHold: effectiveMode === 'psm' || inp.psmHeld,
    pitchInput: inp.pitch,
    speedMps: inp.speedMps,
    alphaDeg: inp.alphaDeg,
    pitchAngleRad: inp.pitchAngleRad,
    currentPitchRate: inp.currentRatesB3[0],
    currentG: inp.currentG,
    airDensity: inp.airDensity,
    hasTvc: af.hasTvc,
    dt,
  });

  if (
    effectiveMode === 'psm' &&
    Math.abs(inp.alphaDeg) > 40 &&
    inp.currentRatesB3[0] > 0.7 &&
    Math.abs(inp.currentRatesB3[2]) < 1.2
  ) {
    state.kulbitSweepRad += inp.currentRatesB3[0] * dt;
  } else if (Math.abs(inp.alphaDeg) < 25 || Math.abs(inp.currentRatesB3[0]) < 0.25) {
    state.kulbitSweepRad = 0;
  }

  const isDriveOrHypersonic =
    (inp.airAccelScale !== undefined && inp.airAccelScale > 1.05) ||
    inp.airDensity <= 1e-4;

  const basePosG =
    inp.gLimitOverride ??
    (effectiveMode === 'high-g' ? af.highGLimit : af.gLimitPos);
  const gLimitActivePos = inp.gearDown ? Math.min(basePosG, 4.5) : basePosG;
  const gLimitActiveNeg =
    inp.gearDown ? -1.5 : effectiveMode === 'high-g' ? -4.0 : af.gLimitNeg;
  const alphaLimitDeg =
    effectiveMode === 'psm' || cobra.active
      ? 140
      : inp.gearDown
        ? 18
        : effectiveMode === 'high-g'
          ? af.highGAlphaLimitDeg
          : af.normAlphaLimitDeg;

  let targetPitchRate = 0;
  let targetYawRate = 0;
  let targetRollRate = 0;
  let highGDriftActive = false;

  if (!inp.assist) {
    targetPitchRate = inp.pitch * af.maxPitchRateRad;
    targetYawRate = -inp.yaw * af.maxYawRateRad;
    targetRollRate = -inp.roll * af.maxRollRateRad;
    state.rateCmdB3 = [targetPitchRate, targetYawRate, targetRollRate];
  } else if (isDriveOrHypersonic && !cobra.active) {
    const handlingSpeed = Math.max(60, Math.min(inp.speedMps, 300));
    const maxPitchAtSpeed = (af.gLimitPos * G0_MPS2) / handlingSpeed;
    const rawPitchTarget = clamp(inp.pitch * af.maxPitchRateRad, -maxPitchAtSpeed, maxPitchAtSpeed);
    const rawYawTarget = -inp.yaw * af.maxYawRateRad;
    const rawRollTarget = -inp.roll * af.maxRollRateRad;

    const alphaPitch = 1 - Math.exp(-12 * dt);
    const alphaRot = 1 - Math.exp(-14 * dt);
    state.rateCmdB3[0] += (rawPitchTarget - state.rateCmdB3[0]) * alphaPitch;
    state.rateCmdB3[1] += (rawYawTarget - state.rateCmdB3[1]) * alphaRot;
    state.rateCmdB3[2] += (rawRollTarget - state.rateCmdB3[2]) * alphaRot;
    if (Math.abs(inp.pitch) < 1e-4 && Math.abs(state.rateCmdB3[0]) < 1e-4) state.rateCmdB3[0] = 0;
    if (Math.abs(inp.yaw) < 1e-4 && Math.abs(state.rateCmdB3[1]) < 1e-4) state.rateCmdB3[1] = 0;
    if (Math.abs(inp.roll) < 1e-4 && Math.abs(state.rateCmdB3[2]) < 1e-4) state.rateCmdB3[2] = 0;

    [targetPitchRate, targetYawRate, targetRollRate] = state.rateCmdB3;
  } else {
    const safeSpeed = Math.max(inp.speedMps, 35);

    if (cobra.active) {
      targetPitchRate = cobra.pitchRateTargetRad;
      // Smoothly level wings upright when Cobra is entered from a turn/bank so the nose pitches
      // heroically UP into the sky instead of corkscrewing sideways into the ground!
      if (!state.cobra.kulbitActive && Math.abs(inp.roll) < 0.12 && Math.abs(inp.pitchAngleRad) < 72 * DEG_TO_RAD) {
        targetRollRate = clamp(-inp.rollAngleRad * 4.5, -2.6, 2.6);
      } else {
        targetRollRate = -inp.roll * af.maxRollRateRad * 0.25;
      }
      targetYawRate = -inp.yaw * (af.hasTvc ? 0.65 : 0.35);
      state.gCmdCurrent = (targetPitchRate * safeSpeed) / G0_MPS2;
    } else if (effectiveMode === 'psm') {
      const pBoost = af.hasTvc ? 1.35 : 1.08;
      const yBoost = af.hasTvc ? 1.48 : 1.05;
      targetPitchRate = inp.pitch * af.maxPitchRateRad * pBoost;
      // NASA X-31 Stability-Axis (Velocity-Vector) Roll at high AoA (> 18 deg):
      // lateral stick rolls cleanly around the velocity vector (p = wv*cos(a), r = wv*sin(a))
      // so Herbst J-Turns and High-G Drifts pivot crisply without adverse sideslip departure.
      const stabBlend = smoothstep(18, 42, Math.abs(inp.alphaDeg));
      const aRad = clamp(inp.alphaDeg * DEG_TO_RAD, -1.35, 1.35);
      const wvMax = af.maxRollRateRad * (af.hasTvc ? 0.72 : 0.58);
      const wvCmd = inp.roll * wvMax;
      const bodyRollRight = inp.roll * af.maxRollRateRad * (1 - stabBlend) + wvCmd * Math.cos(aRad) * stabBlend;
      const stabYawRight = wvCmd * Math.sin(aRad) * stabBlend;
      const pilotYawRight = inp.yaw * af.maxYawRateRad * yBoost;
      targetRollRate = -bodyRollRight;
      targetYawRate = -(pilotYawRight + stabYawRight);
    } else {
      const gCapPos = gLimitActivePos;
      const gCapNeg = gLimitActiveNeg;

      const turnTighten =
        effectiveMode === 'high-g' && inp.pitch > 0.35
          ? (inp.airbrakeHeld ? 1.18 : 1.08)
          : 1.0;
      if (effectiveMode === 'high-g' && Math.abs(inp.pitch) > 0.45 && safeSpeed > 110) {
        highGDriftActive = true;
      }

      let gTrimBias = 0;
      if (!inp.onGround && inp.gravityAccelMps2 > 0.1 && inp.airDensity > 0.05) {
        const gLocal = inp.gravityAccelMps2 / G0_MPS2;
        if (state.fpvHoldActive && Math.abs(inp.pitch) < 0.18) {
          const gammaErr = clamp(state.fpvTargetGammaDeg - inp.gammaDeg, -15, 15);
          gTrimBias = gLocal * clamp(inp.gravityBodyUp, -0.5, 1.0) + gammaErr * 0.18;
        } else if (Math.abs(inp.pitch) < 0.04 && Math.abs(inp.rollAngleRad) < 0.45) {
          gTrimBias = gLocal * clamp(inp.gravityBodyUp, 0, 1.0);
        }
      }

      const stickG =
        (inp.pitch >= 0 ? inp.pitch * gCapPos : inp.pitch * Math.abs(gCapNeg)) *
          turnTighten +
        gTrimBias;

      // Enforce MIL-STD structural onset rate limit (14 G/s) when LOADING G, while allowing crisp
      // immediate unloading when releasing stick so pitch release has zero nose-drop rebound!
      const unloading = Math.abs(stickG) < Math.abs(state.gCmdCurrent) || Math.sign(stickG) !== Math.sign(state.gCmdCurrent);
      const baseOnset = effectiveMode === 'high-g' ? af.gOnset * 1.45 : af.gOnset;
      const onsetRate = unloading ? baseOnset * 2.8 : baseOnset;
      state.gCmdCurrent = moveToward(state.gCmdCurrent, stickG, onsetRate * dt);
      const qFromG = (state.gCmdCurrent * G0_MPS2) / safeSpeed;

      const gBlend = smoothstep(85, 175, inp.speedMps);
      const alphaCmdRate = inp.pitch * af.maxPitchRateRad * 0.88;
      targetPitchRate = alphaCmdRate * (1 - gBlend) + qFromG * gBlend;

      // Vertical-loop / inverted pitch-over headroom: when climbing steeply past 45 deg or inverted
      // over the apex of a loop, preserve clean pitch-over authority instead of freezing at zenith!
      const inVerticalLoopApex = (Math.abs(inp.pitchAngleRad) > 42 * DEG_TO_RAD || inp.gravityBodyUp < 0.25) && inp.pitch > 0.3;
      const loopHeadroomFloor = inVerticalLoopApex ? 0.42 : 0.0;

      // Asymmetric AoA envelope protection: positive +28..30 deg, negative -13.5 deg (NORM) / -17.5 deg (HIGH-G)
      const negAlphaLimitDeg = inp.gearDown ? -10 : effectiveMode === 'high-g' ? -17.5 : -13.5;

      if (inp.alphaDeg > alphaLimitDeg - 3 && targetPitchRate > 0) {
        const headroom = Math.max(loopHeadroomFloor, 1 - smoothstep(alphaLimitDeg - 3, alphaLimitDeg + 2.5, inp.alphaDeg));
        targetPitchRate *= headroom;
      }
      if (inp.alphaDeg < negAlphaLimitDeg + 3.5 && targetPitchRate < 0) {
        const negHeadroom = 1 - smoothstep(Math.abs(negAlphaLimitDeg) - 3.5, Math.abs(negAlphaLimitDeg), -inp.alphaDeg);
        targetPitchRate *= negHeadroom;
      }

      // True Closed-Loop Nz Structural Load Limiter (prevents positive > +9G or negative < -3G breaches
      // even under violent coupled roll+pitch+yaw inputs at high dynamic pressure!)
      const curG = inp.currentG;
      if (curG !== undefined && !inp.onGround && inp.airDensity > 0.02) {
        if (curG > gCapPos - 0.55) {
          const overPos = curG - (gCapPos - 0.55);
          targetPitchRate = Math.min(targetPitchRate, -overPos * 1.65);
        }
        if (curG < gCapNeg + 0.55) {
          const overNeg = (gCapNeg + 0.55) - curG;
          targetPitchRate = Math.max(targetPitchRate, overNeg * 2.55);
        }
      }

      // Crisp NORM deep-stall, negative-AoA departure, & low-speed high-alpha recovery
      const deepStallDeg = effectiveMode === 'norm' ? alphaLimitDeg + 4 : alphaLimitDeg + 12;
      const lowSpeedStall = effectiveMode === 'norm' && !inVerticalLoopApex && inp.speedMps < 82 && Math.abs(inp.alphaDeg) > 22;
      const negAlphaBreach = !inp.onGround && inp.alphaDeg < negAlphaLimitDeg - 1.0;
      if (negAlphaBreach) {
        const overNegDeg = Math.abs(inp.alphaDeg) - Math.abs(negAlphaLimitDeg);
        targetPitchRate = Math.max(targetPitchRate, clamp(0.85 + overNegDeg * 0.14, 0.85, af.maxPitchRateRad));
      } else if ((inp.alphaDeg > deepStallDeg || lowSpeedStall) && !inp.onGround) {
        const recoverSign = -Math.sign(inp.alphaDeg || 1);
        const overDeg = Math.max(0, Math.abs(inp.alphaDeg) - (lowSpeedStall ? 20 : deepStallDeg));
        targetPitchRate = recoverSign * clamp(0.65 + overDeg * 0.075, 0.65, af.maxPitchRateRad);
      }

      const maxPosRateAtV = (gCapPos * G0_MPS2) / safeSpeed;
      const maxNegRateAtV = (Math.abs(gCapNeg) * G0_MPS2) / safeSpeed;
      targetPitchRate = clamp(targetPitchRate, -maxNegRateAtV, maxPosRateAtV);

      // Protect against kinematic roll-sideslip-to-negative-AoA departure (w_dot = -p * v) near neg-G fence
      const negGRollGuard =
        curG !== undefined && curG < gCapNeg + 0.85
          ? clamp((curG - (gCapNeg - 0.1)) / 0.95, 0.22, 1.0)
          : 1.0;
      const rollAlphaFade = (1 - 0.42 * smoothstep(22, 44, Math.abs(inp.alphaDeg))) * negGRollGuard;
      targetRollRate = -inp.roll * af.maxRollRateRad * rollAlphaFade;

      const ariYawRight = inp.roll * clamp(inp.alphaDeg / 25, -0.35, 0.55) * 0.35;
      // High-q structural rudder limiter in NORM prevents crossed-control (A+W+E) roll-coupling departures
      const yawQScale =
        effectiveMode === 'norm' && inp.qPa > 9000
          ? clamp(12000 / inp.qPa, 0.26, 1.0)
          : 1.0;
      // Positive betaDeg (velocity right of nose = nose left) -> yaw right (+yawRight => -ry in B3) to align nose.
      // Even when holding rudder in NORM, enforce a crisp 5 deg sideslip fence at high dynamic pressure.
      const betaDampYawRight =
        !inp.onGround
          ? Math.abs(inp.yaw) < 0.25
            ? clamp(inp.betaDeg * 0.085, -0.65, 0.65)
            : effectiveMode === 'norm' && Math.abs(inp.betaDeg) > 4.5
              ? clamp((inp.betaDeg - Math.sign(inp.betaDeg) * 4.5) * 0.15, -0.95, 0.95)
              : 0
          : 0;
      const rawYawCmdRight = clamp(inp.yaw * yawQScale + ariYawRight + betaDampYawRight, -1.2, 1.2);
      targetYawRate = -rawYawCmdRight * af.maxYawRateRad;
    }

    // Crisp MIL-STD-1797C Level-1 response: snappy engagement + dead-beat release (< 160ms roll stop, zero bounce)
    const slewPitch = 1 - Math.exp(-(Math.abs(inp.pitch) < 0.04 ? 21 : 12) * dt);
    const slewRoll = 1 - Math.exp(-(Math.abs(inp.roll) < 0.04 ? 42 : 17) * dt);
    const slewYaw = 1 - Math.exp(-(Math.abs(inp.yaw) < 0.04 ? 20 : 13) * dt);
    state.rateCmdB3[0] += (targetPitchRate - state.rateCmdB3[0]) * slewPitch;
    state.rateCmdB3[1] += (targetYawRate - state.rateCmdB3[1]) * slewYaw;
    state.rateCmdB3[2] += (targetRollRate - state.rateCmdB3[2]) * slewRoll;
    [targetPitchRate, targetYawRate, targetRollRate] = state.rateCmdB3;
  }

  const surfPitchCmd = clamp(state.rateCmdB3[0] / Math.max(af.maxPitchRateRad, 0.1), -1, 1);
  const surfRollCmd = clamp(-state.rateCmdB3[2] / Math.max(af.maxRollRateRad, 0.1), -1, 1);
  const surfYawCmd = clamp(-state.rateCmdB3[1] / Math.max(af.maxYawRateRad, 0.1), -1, 1);

  const surfSlew = 1 - Math.exp(-16 * dt);
  state.surfaces.pitch += (surfPitchCmd - state.surfaces.pitch) * surfSlew;
  state.surfaces.roll += (surfRollCmd - state.surfaces.roll) * surfSlew;
  state.surfaces.yaw += (surfYawCmd - state.surfaces.yaw) * surfSlew;

  // Canards: + = trailing-edge down (nose-up lift); -0.85 = ground snowplow downforce/drag
  const canardTarget = af.hasCanards
    ? (inp.onGround && inp.speedMps > 8 && (inp.airbrakeHeld || inp.brakesHeld || inp.pitch < -0.2)
        ? -0.85
        : clamp(surfPitchCmd * 0.9 - Math.max(0, inp.alphaDeg - 15) * 0.025, -1, 1))
    : 0;
  state.surfaces.canard += (canardTarget - state.surfaces.canard) * surfSlew;

  const targetSpeedbrake = Math.max(inp.airbrakeHeld ? 1.0 : 0.0, cobra.autoAirbrake ?? 0);
  state.surfaces.speedbrake = moveToward(state.surfaces.speedbrake, targetSpeedbrake, 3.2 * dt);

  const allocation = allocateControlMoments(state, {
    airframe: af,
    surfacesCmd: {
      pitch: state.surfaces.pitch,
      roll: state.surfaces.roll,
      yaw: state.surfaces.yaw,
      canard: state.surfaces.canard,
    },
    qPa: inp.qPa,
    alphaDeg: inp.alphaDeg,
    thrustN: inp.thrustN,
    airDensity: inp.airDensity,
    psmActive: effectiveMode === 'psm' || cobra.active,
    dt,
  });

  return {
    effectiveMode,
    targetRatesB3: [targetPitchRate, targetYawRate, targetRollRate],
    surfaces: { ...state.surfaces },
    allocation,
    cobra,
    gLimitActivePos,
    gLimitActiveNeg,
    alphaLimitDeg,
    highGDriftActive,
  };
}

// ---------------------------------------------------------------------------
// Surface Deflection Adapter -> JetTelemetry.JetSurfaceState
// ---------------------------------------------------------------------------

/**
 * Converts normalized FBW control deflections into physical radian angles and
 * normalized deployments matching `JetTelemetry.ts` sign conventions.
 */
export function toJetSurfaceState(
  def: ControlSurfaceDeflections,
  opts: {
    gear: number;
    tvcMaxDeg?: number;
    tvcCantDeg?: number;
    pitchCmd?: number;
    rollCmd?: number;
    yawCmd?: number;
  },
): JetSurfaceState {
  const s = createJetSurfaceState();
  const maxElevonRad = 26 * DEG_TO_RAD;
  const maxCanardRad = 30 * DEG_TO_RAD;
  const maxRudderRad = 28 * DEG_TO_RAD;
  const maxFlapRad = 32 * DEG_TO_RAD;
  const tvcMaxRad = (opts.tvcMaxDeg ?? 15) * DEG_TO_RAD;
  const cantDeg = opts.tvcCantDeg ?? 0;
  const cantDiff = cantDeg > 0 ? def.tvcYaw * Math.cos(cantDeg * DEG_TO_RAD) * tvcMaxRad * 0.65 : 0;

  // Elevon + TE-down; nose-up pitch pulls TE up (-); roll right pulls left TE down (+), right TE up (-)
  const pitchTailRad = -def.pitch * maxElevonRad;
  const rollDiffRad = def.roll * (18 * DEG_TO_RAD);
  s.elevonLeftRad = clamp(pitchTailRad + rollDiffRad, -maxElevonRad, maxElevonRad);
  s.elevonRightRad = clamp(pitchTailRad - rollDiffRad, -maxElevonRad, maxElevonRad);

  s.canardRad = clamp(def.canard * maxCanardRad, -maxCanardRad, maxCanardRad);
  s.flapLeftRad = clamp(def.teFlap * maxFlapRad + rollDiffRad * 0.35, -maxFlapRad, maxFlapRad);
  s.flapRightRad = clamp(def.teFlap * maxFlapRad - rollDiffRad * 0.35, -maxFlapRad, maxFlapRad);
  s.rudderRad = clamp(def.yaw * maxRudderRad, -maxRudderRad, maxRudderRad);

  // Differential canted nozzle pitch (+left down/-right up for +yaw => right roll matching tvcTorqueRollB3 < 0)
  s.tvcPitchLeftRad = clamp(def.tvcPitch * tvcMaxRad - cantDiff, -tvcMaxRad, tvcMaxRad);
  s.tvcPitchRightRad = clamp(def.tvcPitch * tvcMaxRad + cantDiff, -tvcMaxRad, tvcMaxRad);
  s.tvcYawLeftRad = clamp(def.tvcYaw * tvcMaxRad, -tvcMaxRad, tvcMaxRad);
  s.tvcYawRightRad = clamp(def.tvcYaw * tvcMaxRad, -tvcMaxRad, tvcMaxRad);

  s.slat = clamp(def.leFlap, 0, 1);
  s.airbrake = clamp(def.speedbrake, 0, 1);
  s.gear = clamp(opts.gear, 0, 1);
  s.nozzleIris = clamp(def.nozzleIris, 0, 1);
  s.cmdPitch = clamp(opts.pitchCmd ?? def.pitch, -1, 1);
  s.cmdRoll = clamp(opts.rollCmd ?? def.roll, -1, 1);
  s.cmdYaw = clamp(opts.yawCmd ?? def.yaw, -1, 1);
  return s;
}

// ---------------------------------------------------------------------------
// Physics-Driven Maneuver Classifier
// ---------------------------------------------------------------------------

export interface ManeuverDetectInput {
  alphaDeg: number;
  betaDeg: number;
  pitchDeg: number;
  speedMps: number;
  forwardSpeedMps: number; // + along nose (-Z in B3)
  mach: number;
  gLoad: number;
  abStage: number;
  airbrake: number;
  gearDown?: boolean;
  altitudeAglM?: number;
  onGround: boolean;
  ratesB3: readonly [number, number, number];
  fbwMode: FbwMode;
  cobraPhase: CobraPhase;
  kulbitSweepRad: number;
  dt: number;
}

/** Maps exhaustive aerobatic classification to compact `JetTelemetry.ManeuverKind`. */
export function toTelemetryManeuver(kind: AerobaticManeuverKind): TelemetryManeuverKind {
  switch (kind) {
    case 'cobra':
    case 'kulbit':
    case 'herbst':
    case 'high-g-drift':
    case 'flare':
      return kind;
    case 'flat-spin':
    case 'falling-leaf':
      return 'spin';
    default:
      return 'none';
  }
}

/**
 * Classifies active aerobatic and combat maneuvers strictly from kinematic and
 * aerodynamic state with hold hysteresis to avoid HUD badge flicker.
 */
export function detectManeuver(
  state: FbwControllerState,
  inp: ManeuverDetectInput,
): AerobaticManeuverKind {
  const [pitchRate, yawLeftRate, rollLeftRate] = inp.ratesB3;
  const absAlpha = Math.abs(inp.alphaDeg);
  const absBeta = Math.abs(inp.betaDeg);
  const absYaw = Math.abs(yawLeftRate);
  const absRoll = Math.abs(rollLeftRate);

  let detected: AerobaticManeuverKind = 'none';

  if (!inp.onGround) {
    if (
      state.cobra.kulbitActive ||
      inp.kulbitSweepRad >= 145 * DEG_TO_RAD ||
      (inp.cobraPhase === 'IDLE' && absAlpha > 132 && pitchRate > 0.85 && inp.speedMps < 190)
    ) {
      detected = 'kulbit';
    } else if (
      inp.cobraPhase !== 'IDLE' ||
      (absAlpha >= 56 &&
        absAlpha <= 125 &&
        inp.pitchDeg > 35 &&
        absRoll < 1.1 &&
        absYaw < 0.9)
    ) {
      detected = 'cobra';
    } else if (inp.pitchDeg > 66 && inp.forwardSpeedMps < -3.0) {
      detected = 'tailslide';
    } else if (inp.pitchDeg > 68 && inp.speedMps < 75 && absYaw > 0.45) {
      detected = 'hammerhead';
    } else if (
      absAlpha > 40 &&
      inp.speedMps < 205 &&
      absYaw > 0.72 &&
      (absRoll > 0.55 || inp.fbwMode === 'psm')
    ) {
      detected = 'herbst';
    } else if (absAlpha > 48 && inp.speedMps < 145 && absYaw > 1.15 && absRoll < 1.2) {
      detected = 'flat-spin';
    } else if (
      absAlpha > 36 &&
      inp.speedMps < 140 &&
      absYaw > 0.3 &&
      absRoll > 0.35 &&
      absBeta > 12
    ) {
      detected = 'falling-leaf';
    } else if (absAlpha > 16 && absRoll > 3.5 && Math.abs(pitchRate) > 0.35 && absBeta > 4.5) {
      detected = 'snap-roll';
    } else if (absRoll > 2.1 && inp.gLoad >= 2.2 && absAlpha > 4.5 && absAlpha < 28) {
      detected = 'barrel-roll';
    } else if (
      (inp.gLoad >= 7.2 && absAlpha > 13) ||
      (inp.fbwMode === 'high-g' && inp.gLoad >= 5.8 && inp.airbrake > 0.35)
    ) {
      detected = 'high-g-drift';
    } else if (
      inp.gearDown &&
      inp.altitudeAglM !== undefined &&
      inp.altitudeAglM < 35 &&
      inp.speedMps < 105 &&
      inp.alphaDeg > 8 &&
      inp.alphaDeg < 19
    ) {
      detected = 'flare';
    } else if (inp.mach >= 1.2 && inp.abStage === 0 && absAlpha < 15) {
      detected = 'supercruise';
    }
  }

  const dt = Math.max(inp.dt, 0);
  if (detected !== 'none') {
    state.lastManeuver = detected;
    state.maneuverHoldSec = 0.45;
  } else if (state.maneuverHoldSec > 0) {
    state.maneuverHoldSec = Math.max(0, state.maneuverHoldSec - dt);
    if (state.maneuverHoldSec === 0) state.lastManeuver = 'none';
  } else {
    state.lastManeuver = 'none';
  }

  return state.lastManeuver;
}

// ---------------------------------------------------------------------------
// Landing, Ground Rollout, Oleo Struts, Snowplow & Drag Chute
// ---------------------------------------------------------------------------

export interface GroundContactInput {
  airframe: FbwAirframeParams;
  onGround: boolean;
  gearDown: boolean;
  sinkRateMps: number;      // positive downward vertical speed at touchdown
  groundSpeedMps: number;
  brakesHeld: boolean;
  airbrakeHeld: boolean;
  yawInput: number;         // + = steer right
  throttle: number;
  massKg: number;
  gravityMps2: number;
  dt: number;
}

export interface GroundContactOutput {
  touchdownImpulse: number;
  decelMps2: number;
  yawRateB3Rad: number;
  canardSnowplow: number;
  dragChute: number;
}

/**
 * Simulates runway gear oleo sink absorption, Gripen canard snowplow
 * aerodynamic braking, Su-30/Kestrel drag-chute deployment, anti-skid ABS wheel
 * brakes, and speed-sensitive nosewheel steering.
 */
export function stepGroundContact(
  state: FbwControllerState,
  inp: GroundContactInput,
): GroundContactOutput {
  const af = inp.airframe;
  const dt = Math.max(inp.dt, 0);

  if (!inp.onGround) {
    state.dragChuteDeployed = false;
    state.surfaces.dragChute = moveToward(state.surfaces.dragChute, 0, 4.0 * dt);
    return {
      touchdownImpulse: 0,
      decelMps2: 0,
      yawRateB3Rad: 0,
      canardSnowplow: 0,
      dragChute: state.surfaces.dragChute,
    };
  }

  const gearMargin = inp.gearDown ? 4.5 : 1.2;
  const excessSink = Math.max(0, inp.sinkRateMps - gearMargin);
  const touchdownImpulse = inp.sinkRateMps > 0.5 ? excessSink : 0;

  const rollingFriction = inp.gearDown ? 0.025 : 0.45;
  const absBrakeCoeff = inp.brakesHeld && inp.gearDown ? 0.55 : 0;

  const snowplowActive =
    af.hasCanards &&
    inp.gearDown &&
    inp.groundSpeedMps > 8 &&
    (inp.brakesHeld || inp.airbrakeHeld || inp.throttle < 0.15);
  const canardSnowplow = snowplowActive ? -0.85 : 0;
  const snowplowWheelLoadBonus = snowplowActive ? 1.25 : 1.0;

  if (af.hasDragChute && inp.gearDown) {
    if (!state.dragChuteDeployed && inp.groundSpeedMps > 32 && (inp.brakesHeld || inp.airbrakeHeld) && inp.throttle < 0.35) {
      state.dragChuteDeployed = true;
    } else if (state.dragChuteDeployed && (inp.groundSpeedMps < 14 || inp.throttle > 0.65)) {
      state.dragChuteDeployed = false;
    }
  } else {
    state.dragChuteDeployed = false;
  }
  state.surfaces.dragChute = moveToward(
    state.surfaces.dragChute,
    state.dragChuteDeployed ? 1.0 : 0.0,
    state.dragChuteDeployed ? 1.8 * dt : 3.5 * dt,
  );

  const chuteDecel =
    state.surfaces.dragChute * ((0.5 * 1.2 * 22 * inp.groundSpeedMps * inp.groundSpeedMps) / Math.max(inp.massKg, 5000));
  const brakeDecel = (rollingFriction + absBrakeCoeff * snowplowWheelLoadBonus) * inp.gravityMps2;

  const decelMps2 = inp.groundSpeedMps > 0.05 ? brakeDecel + chuteDecel : 0;

  const steerGain =
    inp.gearDown && inp.groundSpeedMps > 0.5
      ? clamp(0.45 * (1 - smoothstep(25, 110, inp.groundSpeedMps)) + 0.08, 0.05, 0.5)
      : 0;
  const yawRateB3Rad = -inp.yawInput * steerGain;

  return {
    touchdownImpulse,
    decelMps2,
    yawRateB3Rad,
    canardSnowplow,
    dragChute: state.surfaces.dragChute,
  };
}
