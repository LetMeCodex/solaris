import * as THREE from 'three';
import {
  A_SEA_EARTH,
  G0,
  P_SEA_EARTH,
  RHO_SEA_EARTH,
  type AirDataState,
  type AtmosphericState,
  computeAirData as planetaryComputeAirData,
} from './PlanetaryPhysics';
import type { AirframeAeroConstants, AirframeSpec } from './AirframeSpecs';

/** Standard Earth gravity used for structural load-factor (G-limit) normalization, m/s². */
export const G0_MPS2 = G0;
/** Earth ISA sea-level air density, kg/m³. */
export const RHO0_EARTH = RHO_SEA_EARTH;
/** Earth ISA sea-level static pressure, Pa. */
export const P0_EARTH = P_SEA_EARTH;
/** Earth ISA sea-level speed of sound, m/s. */
export const A0_EARTH = A_SEA_EARTH;
/** Standard diatomic air specific heat ratio for IAS/CAS calibration. */
export const GAMMA_ISA = 1.4;

const DEG = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function clamp(x: number, min: number, max: number): number {
  return x < min ? min : x > max ? max : x;
}

export function smoothstep(x: number, edge0: number, edge1: number): number {
  if (edge1 === edge0) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Aerodynamic geometry and stability parameters for a fighter airframe.
 * Field names align cleanly with AirframeSpec so airframes plug in directly.
 */
export interface AeroAirframeConfig {
  wingAreaM2: number;
  spanM: number;
  macM: number;
  effAspectRatio: number;
  sweepDeg: number;
  thicknessRatio: number;
  gLimitPos: number;
  gLimitNeg: number;
  hasCanards?: boolean;
  hasTvc?: boolean;
  /** [Ixx, Iyy, Izz, Ixz] in aerospace FRD kg·m². */
  inertia: readonly [number, number, number, number];
  /** Optional nested AirframeSpec constants block. */
  aero?: Partial<AirframeAeroConstants>;
  // Optional flat coefficient overrides (default to realistic supersonic-fighter curves)
  cl0?: number;
  kvVortex?: number;
  cd0Clean?: number;
  oswaldE0?: number;
  oswaldE?: number;
  alphaStallPosDeg?: number;
  alphaStallNegDeg?: number;
  clMaxClean?: number;
  clMaxFlaps?: number;
  cd90?: number;
  cd180?: number;
  waveDragScale?: number;
  cm0?: number;
  cmAlphaSub?: number;
  cmq?: number;
  cmAlphaDot?: number;
  clp0?: number;
  cnr0?: number;
  cnBeta0?: number;
  clBeta0?: number;
  cyBeta0?: number;
}

export type AeroAirframeLike = AeroAirframeConfig | AirframeSpec;

export interface FlowAngles {
  /** True airspeed magnitude relative to airmass, m/s. */
  speedMps: number;
  /** Forward (nose) airspeed component u in FRD, m/s. */
  uMps: number;
  /** Rightward (starboard) airspeed component v in FRD, m/s. */
  vMps: number;
  /** Downward (ventral) airspeed component w in FRD, m/s. */
  wMps: number;
  /** Angle of attack across [-pi, pi], rad (positive = wind from below / nose pitched up). */
  alphaRad: number;
  /** Angle of attack, deg. */
  alphaDeg: number;
  /** Sideslip angle across [-pi/2, pi/2], rad (positive = wind from starboard). */
  betaRad: number;
  /** Sideslip angle, deg. */
  betaDeg: number;
}

export type AirDataResult = AirDataState;

export interface AeroSurfaceInputs {
  /** Elevator / symmetric stabilon deflection [-1, 1], positive nose-up. */
  elev: number;
  /** Aileron / differential roll deflection [-1, 1], positive right-wing-down. */
  ail: number;
  /** Rudder deflection [-1, 1], positive nose-right. */
  rud: number;
  /** Trailing-edge flap deployment [0, 1]. */
  flaps: number;
  /** Leading-edge slat / maneuver-flap deployment [0, 1]. */
  slats: number;
  /** Landing gear extension [0, 1]. */
  gear: number;
  /** Speedbrake / airbrake extension [0, 1]. */
  speedbrake: number;
}

export interface AeroCoeffResult {
  cl: number;
  cd: number;
  cy: number;
  clRoll: number;
  cmPitch: number;
  cnYaw: number;
  /** Attached-flow weight [0..1] (1 = fully attached, 0 = fully separated flat-plate). */
  wAttached: number;
  /** Stall severity [0..1] (0 below ~16 deg alpha, 1 in deep stall). */
  stallFactor: number;
  /** Aerodynamic buffet intensity [0..1] from high-alpha separation + transonic shock. */
  buffetFactor: number;
  /** Effective max clean+high-lift CL for corner-speed / stall-speed calculations. */
  clMaxEffective: number;
  cd0Total: number;
  cdWave: number;
  kInduced: number;
  sigmaGe: number;
  kGeLift: number;
  clAlphaRad: number;
}

export interface AeroForceMomentInput {
  flow: FlowAngles;
  air: AirDataResult;
  rhoKgM3: number;
  /** Local altitude above solid/cloud terrain surface, m. */
  altAboveGroundM: number;
  /** Body angular rates in Solaris Three.js frame [pitchUp, yawLeft, rollLeftDown], rad/s. */
  ratesB3: THREE.Vector3;
  /** Time rate of change of alpha, rad/s (0 if unavailable). */
  alphaDotRadS?: number;
  surfaces: AeroSurfaceInputs;
}

export interface AeroForceMomentResult {
  coeffs: AeroCoeffResult;
  /** Aerodynamic force in Solaris Three.js body frame (+X right, +Y canopy, +Z tail), N. */
  forceB3: THREE.Vector3;
  /** Aerodynamic moment in Solaris Three.js body frame (+X pitchUp, +Y yawLeft, +Z rollLeftDn), N·m. */
  momentB3: THREE.Vector3;
  liftN: number;
  dragN: number;
  sideN: number;
  /** High-q FBW control gain compression factor (0..1]. */
  qGainCompress: number;
}

export interface TurnPerformanceResult {
  /** Instantaneous available load factor (Earth g0 units). */
  nInst: number;
  /** Instantaneous level turn rate, rad/s. */
  instTurnRateRadS: number;
  /** Instantaneous turn radius, m (Infinity if rate <= 0). */
  instRadiusM: number;
  /** Sustained load factor at P_s = 0 (Earth g0 units). */
  nSust: number;
  /** Sustained turn rate at P_s = 0, rad/s. */
  sustTurnRateRadS: number;
  /** Sustained lift coefficient at P_s = 0. */
  clSust: number;
}

/**
 * Extract airflow angles (alpha, beta) from air-relative velocity in Solaris Three.js body frame
 * (+X right, +Y canopy up, -Z nose forward). Singularity-safe down to zero speed.
 */
export function computeFlowAngles(vBodyB3: THREE.Vector3, out?: FlowAngles): FlowAngles {
  const u = -vBodyB3.z;
  const v = vBodyB3.x;
  const w = -vBodyB3.y;
  const speed = Math.hypot(u, v, w);
  const uw = Math.hypot(u, w);
  const alphaRad = uw > 0.05 ? Math.atan2(w, u) : 0;
  const rawBeta = speed > 0.05 ? Math.asin(clamp(v / speed, -1, 1)) : 0;
  const betaRad = rawBeta * smoothstep(speed, 0.2, 2.0);
  const res = out ?? {
    speedMps: 0,
    uMps: 0,
    vMps: 0,
    wMps: 0,
    alphaRad: 0,
    alphaDeg: 0,
    betaRad: 0,
    betaDeg: 0,
  };
  res.speedMps = speed;
  res.uMps = u;
  res.vMps = v;
  res.wMps = w;
  res.alphaRad = alphaRad;
  res.alphaDeg = alphaRad * RAD_TO_DEG;
  res.betaRad = betaRad;
  res.betaDeg = betaRad * RAD_TO_DEG;
  return res;
}

/**
 * Compressible Pitot-static pressure ratio qc/p:
 * Saint-Venant isentropic formula for M <= 1, Rayleigh normal-shock Pitot formula for M > 1.
 * C1-continuous across M = 1.
 */
export function pitotImpactRatio(mach: number, gamma = GAMMA_ISA): number {
  if (!(mach > 0)) return 0;
  const g = clamp(gamma, 1.1, 1.67);
  if (mach <= 1) {
    return Math.pow(1 + 0.5 * (g - 1) * mach * mach, g / (g - 1)) - 1;
  }
  const m2 = mach * mach;
  const term1 = Math.pow(0.5 * (g + 1) * m2, g / (g - 1));
  const term2 = Math.pow((g + 1) / (2 * g * m2 - (g - 1)), 1 / (g - 1));
  return term1 * term2 - 1;
}

const SCRATCH_ATM: AtmosphericState = {
  bodyName: 'Earth',
  altKm: 0,
  tempK: 288.15,
  pressurePa: P_SEA_EARTH,
  densityKgM3: RHO_SEA_EARTH,
  densityRel: 1,
  gamma: GAMMA_ISA,
  gasConstantJPerKgK: 287.05287,
  soundSpeedMps: A_SEA_EARTH,
  surfacePressurePa: P_SEA_EARTH,
  surfaceTempK: 288.15,
  topKm: 160,
  hasOxygen: true,
  isVacuum: false,
};

/**
 * Compute TAS, EAS, IAS/CAS, Mach, dynamic pressure q, and impact pressure qc.
 * Delegates directly to PlanetaryPhysics.computeAirData when passed an AtmosphericState,
 * or wraps raw thermodynamic scalars cleanly without duplicating Pitot calibration math.
 */
export function computeAirData(tasMps: number, atm: AtmosphericState, out?: AirDataResult): AirDataResult;
export function computeAirData(
  tasMps: number,
  rhoKgM3: number,
  pressurePa: number,
  soundMps: number,
  gamma?: number,
  out?: AirDataResult
): AirDataResult;
export function computeAirData(
  tasMps: number,
  atmOrRho: AtmosphericState | number,
  pressureOrOut?: number | AirDataResult,
  soundMps?: number,
  gamma = GAMMA_ISA,
  out?: AirDataResult
): AirDataResult {
  let atm: AtmosphericState;
  let targetOut: AirDataResult | undefined;

  if (typeof atmOrRho === 'object') {
    atm = atmOrRho;
    targetOut = typeof pressureOrOut === 'object' ? pressureOrOut : undefined;
  } else {
    const rho = Math.max(0, atmOrRho);
    const p = Math.max(0, typeof pressureOrOut === 'number' ? pressureOrOut : 0);
    const a = Math.max(0, soundMps ?? 0);
    const isVac = rho <= 1e-7 || p <= 1e-3 || a <= 1;
    SCRATCH_ATM.densityKgM3 = rho;
    SCRATCH_ATM.densityRel = rho / RHO_SEA_EARTH;
    SCRATCH_ATM.pressurePa = p;
    SCRATCH_ATM.soundSpeedMps = a;
    SCRATCH_ATM.gamma = clamp(gamma, 1.1, 1.67);
    SCRATCH_ATM.isVacuum = isVac;
    atm = SCRATCH_ATM;
    targetOut = out;
  }

  const computed = planetaryComputeAirData(tasMps, atm);
  if (!targetOut) return computed;
  targetOut.tasMps = computed.tasMps;
  targetOut.easMps = computed.easMps;
  targetOut.iasMps = computed.iasMps;
  targetOut.mach = computed.mach;
  targetOut.qPa = computed.qPa;
  targetOut.impactPressurePa = computed.impactPressurePa;
  return targetOut;
}

/**
 * Finite-wing compressible lift-curve slope (1/rad) bridging:
 * - Subsonic Helmbold-Diederich (M <= 0.85)
 * - Transonic peak (M ~ 1.02)
 * - Supersonic Ackeret slender-delta decay (M >= 1.35)
 */
export function liftCurveSlope(mach: number, effAR: number, sweepDeg: number, eta = 0.95): number {
  const ar = Math.max(0.8, effAR);
  const tanLam = Math.tan(clamp(sweepDeg, 0, 70) * DEG);
  const helmbold = (mVal: number): number => {
    const b2 = Math.max(1 - mVal * mVal, 1 - 0.85 * 0.85);
    return (2 * Math.PI * ar) / (2 + Math.sqrt(4 + Math.pow((ar * Math.sqrt(b2)) / eta, 2) * (1 + (tanLam * tanLam) / b2)));
  };

  if (mach <= 0.85) return helmbold(mach);
  const cla085 = helmbold(0.85);
  const claSup = (mVal: number): number => Math.max(1.75, 3.85 / Math.sqrt(Math.max(mVal * mVal - 1, 0.55)));
  const cla135 = claSup(1.35);
  const claPeak = Math.max(cla085 * 1.24, cla135 * 1.04);

  if (mach < 1.02) {
    return cla085 + (claPeak - cla085) * smoothstep(mach, 0.85, 1.02);
  }
  if (mach < 1.35) {
    return claPeak + (cla135 - claPeak) * smoothstep(mach, 1.02, 1.35);
  }
  return claSup(mach);
}

/**
 * Transonic/supersonic wave drag bump Delta C_Dw(M, |CL|) calibrated to Korn M_DD and
 * Sears-Haack area-rule fighter baselines across Mach 0.85..1.35+.
 */
export function waveDragCoeff(
  mach: number,
  absCl: number,
  sweepDeg: number,
  thicknessRatio: number,
  waveScale = 1
): number {
  const sweepAdj = clamp((sweepDeg - 36) / 10, -0.5, 1.0);
  const tcAdj = thicknessRatio - 0.045;
  const mCrit = clamp(0.83 + 0.025 * sweepAdj - 1.2 * tcAdj - 0.05 * Math.min(absCl, 1.5), 0.72, 0.90);
  if (mach <= mCrit) return 0;

  // Sears-Haack slender-body scaling with thickness^2 and mild sweep relief:
  // sharp Mach 1 shock-barrier peak (~0.022) relaxing past the Mach cone (M > 1.15)
  const tcFactor = Math.pow(clamp(thicknessRatio / 0.045, 0.6, 2.0), 2);
  const sweepRelief = 1 - 0.08 * sweepAdj;
  const basePeak = 0.0165 * tcFactor * sweepRelief * waveScale;

  const rise = smoothstep(mach, mCrit, 1.05);
  const tail = mach <= 1.04 ? 1.0 : 1.0 / Math.pow(1 + 1.35 * (mach - 1.04), 0.70);
  const transBump = 1.0 + 0.38 * Math.exp(-Math.pow((mach - 1.04) / 0.085, 2));
  return basePeak * rise * tail * transBump;
}

/**
 * Induced drag factor k(M) transitioning smoothly from subsonic 1/(pi*AR*e) to
 * supersonic Ackeret leading-edge suction loss across M = 0.85..1.35.
 */
export function inducedDragFactor(mach: number, effAR: number, oswaldE0: number): number {
  const kSub = 1 / (Math.PI * Math.max(0.8, effAR) * clamp(oswaldE0, 0.4, 0.95));
  if (mach <= 0.85) return kSub;
  const kSup = clamp(Math.sqrt(Math.max(mach * mach - 1, 0.1)) / 4.0, Math.max(kSub * 1.5, 0.22), 0.45);
  if (mach >= 1.35) return kSup;
  return kSub + (kSup - kSub) * smoothstep(mach, 0.85, 1.35);
}

/**
 * Hoerner / Wieselsberger ground effect:
 * returns induced drag multiplier sigma_GE and lift-curve slope multiplier k_GE_L.
 */
export function groundEffectFactors(
  altAboveGroundM: number,
  wingSpanM: number,
  effAR: number,
  claInf: number,
  alphaRad: number
): { sigmaGe: number; kGeLift: number; deltaCmGe: number } {
  const hOverB = Math.max((Math.max(0, altAboveGroundM) + 1.2) / Math.max(wingSpanM, 1), 0.05);
  if (hOverB > 2.0) return { sigmaGe: 1, kGeLift: 1, deltaCmGe: 0 };

  const h15 = Math.pow(hOverB, 1.5);
  const sigmaGe = (33 * h15) / (1 + 33 * h15);
  const cos2 = Math.cos(alphaRad) ** 2;
  const piAr = Math.PI * Math.max(0.8, effAR);
  const rawLiftGain = (piAr + claInf) / (piAr + sigmaGe * claInf) - 1;
  const kGeLift = 1 + cos2 * rawLiftGain;
  const deltaCmGe = -0.02 * (1 - sigmaGe) * cos2;
  return { sigmaGe, kGeLift, deltaCmGe };
}

function asConfig(cfg: AeroAirframeLike): AeroAirframeConfig {
  return cfg as AeroAirframeConfig;
}

/**
 * Compute full 3D non-dimensional aerodynamic coefficients across alpha in [-180, 180] deg
 * and beta in [-90, 90] deg, including Polhamus LEX vortex lift, transonic wave drag,
 * ground effect, and high-lift/drag device increments.
 */
export function computeAeroCoefficients(
  flow: FlowAngles,
  mach: number,
  altAboveGroundM: number,
  surfaces: AeroSurfaceInputs,
  airframe: AeroAirframeLike,
  ratesB3?: THREE.Vector3,
  alphaDotRadS = 0
): AeroCoeffResult {
  const cfg = asConfig(airframe);
  const aero = cfg.aero;
  const a = flow.alphaRad;
  const b = flow.betaRad;
  const absA = Math.abs(a);
  const sinA = Math.sin(a);
  const cosA = Math.cos(a);
  const sinB = Math.sin(b);
  const cosB = Math.cos(b);

  const cl0 = aero?.cl0 ?? cfg.cl0 ?? 0.06;
  // Close-coupled canard-delta (e.g. Gripen) gets ~16% foreplane vortex stabilization past 20 deg AoA
  const canardVortexMult = cfg.hasCanards ? 1.16 : 1.0;
  const kv =
    (aero?.kvVortex ?? cfg.kvVortex ?? (cfg.hasCanards ? 3.25 : 3.15)) *
    canardVortexMult *
    (1 - 0.45 * smoothstep(mach, 0.85, 1.5));
  const cd0Clean = aero?.cd0Clean ?? cfg.cd0Clean ?? 0.019;
  const e0 = aero?.oswaldE ?? cfg.oswaldE0 ?? cfg.oswaldE ?? 0.76;
  // Slender fighter broadside drag peak (~1.46 vs bluff brick 1.85) prevents unphysical Cobra drag blast
  const cd90 = cfg.cd90 ?? 1.46;
  const cd180 = cfg.cd180 ?? 0.38;

  // Compressible lift slope & ground effect
  const cla = liftCurveSlope(mach, cfg.effAspectRatio, cfg.sweepDeg);
  const ge = groundEffectFactors(altAboveGroundM, cfg.spanM, cfg.effAspectRatio, cla, a);

  // High-lift & configuration increments
  const df = clamp(surfaces.flaps, 0, 1);
  const ds = clamp(surfaces.slats, 0, 1);
  const dg = clamp(surfaces.gear, 0, 1);
  const dsb = clamp(surfaces.speedbrake, 0, 1);

  const dClFlaps = 0.42 * df + 0.24 * ds;
  const dCd0Config = 0.024 * df + 0.009 * ds + 0.022 * dg + 0.068 * dsb;
  const dCmConfig = -0.05 * df - 0.015 * dg + 0.018 * dsb;

  // Effective max CL (interpolated smoothly between clean and high-lift AirframeSpec bounds)
  const clMaxClean = aero?.clMaxClean ?? cfg.clMaxClean ?? 1.58;
  const clMaxFlaps = aero?.clMaxFlaps ?? cfg.clMaxFlaps ?? 2.10;
  const highLiftBlend = clamp(0.62 * df + 0.38 * ds, 0, 1);
  const clMaxEffective =
    (clMaxClean + (clMaxFlaps - clMaxClean) * highLiftBlend) * (1 - 0.12 * smoothstep(mach, 0.85, 1.4));

  // Asymmetric stall boundaries shifted by slats, flaps, and transonic shock separation
  const baseStallPosDeg = aero?.alphaStallPosDeg ?? cfg.alphaStallPosDeg ?? 29;
  const baseStallNegDeg = aero?.alphaStallNegDeg ?? cfg.alphaStallNegDeg ?? -18;
  const alphaStallPos =
    baseStallPosDeg * DEG + 6 * DEG * ds - 2 * DEG * df - 4 * DEG * smoothstep(mach, 0.75, 1.15);
  const alphaStallNeg = baseStallNegDeg * DEG;

  // Center positive stall drop slightly past alphaStallPos so C_L peaks AT alphaStallPos (NASA TN D-3767)
  // rather than prematurely blending into flat-plate at 22 deg; negative stall remains asymmetric at alphaStallNeg.
  const wAtt =
    (1 / (1 + Math.exp(22 * (a - (alphaStallPos + 3.5 * DEG))))) *
    (1 / (1 + Math.exp(-20 * (a - alphaStallNeg))));

  // Vortex core burst occurs ~7 deg past primary wing stall
  const wVortex = 1 / (1 + Math.exp(12 * (absA - (alphaStallPos + 7 * DEG))));

  // Attached potential + Polhamus LEX vortex lift with smooth C1 vortex-breakdown saturation
  // so blended peak clean C_L = wAtt*clAtt + (1-wAtt)*clFp lands right on spec.aero.clMaxClean (±4%)
  const clPot = (cl0 + dClFlaps) * cosA + cla * ge.kGeLift * sinA * cosA * cosA;
  const clVortex = kv * sinA * sinA * cosA * (a >= 0 ? 1 : -1) * wVortex;
  const rawClAtt = clPot + clVortex;
  const clCapPos = clMaxEffective * 1.16 * ge.kGeLift;
  const clKneePos = clCapPos * 0.84;
  const clHeadPos = Math.max(0.16, clCapPos - clKneePos);
  const clCapNeg = clMaxEffective * 0.94 * ge.kGeLift;
  const clKneeNeg = clCapNeg * 0.78;
  const clHeadNeg = Math.max(0.14, clCapNeg - clKneeNeg);
  const clAtt =
    rawClAtt > clKneePos
      ? clKneePos + clHeadPos * Math.tanh((rawClAtt - clKneePos) / clHeadPos)
      : rawClAtt < -clKneeNeg
        ? -(clKneeNeg + clHeadNeg * Math.tanh((-rawClAtt - clKneeNeg) / clHeadNeg))
        : rawClAtt;

  // Post-stall 3D flat-plate + asymmetric camber residue (covers 0..180 deg & tailslide)
  const aftBlend = smoothstep(-cosA, 0, 1);
  const clFp = 0.96 * Math.sin(2 * a) * (1 - 0.12 * aftBlend) + 0.04 * Math.max(0, cosA);

  // Wake blanking reduces tail/elevon CL effectiveness in deep post-stall
  const etaElev = 1 - 0.55 * smoothstep(absA, 35 * DEG, 75 * DEG);
  const etaRud = 1 - 0.85 * smoothstep(absA, 25 * DEG, 55 * DEG);
  const etaAil = 1 - 0.65 * smoothstep(absA, 28 * DEG, 65 * DEG);

  const clNoSurf = cosB * cosB * (wAtt * clAtt + (1 - wAtt) * clFp);
  // Close-coupled canards (Gripen) pitch nose-up by generating POSITIVE foreplane lift (+0.14);
  // aft stabilators (Su-30/Kestrel) pitch nose-up via modest tail download (-0.11, never -0.32 sink).
  const clPitchSurfGain = cfg.hasCanards ? 0.14 : -0.11;
  const cl = clNoSurf + clPitchSurfGain * etaElev * surfaces.elev * cosB * cosB;

  // Drag polar: C_D0 + wave drag + induced drag + Polhamus vortex drag + post-stall crossflow
  const cdWave = waveDragCoeff(mach, Math.abs(clNoSurf), cfg.sweepDeg, cfg.thicknessRatio, cfg.waveDragScale ?? 1);
  const cd0Total = cd0Clean + cdWave + dCd0Config;
  const kInduced = inducedDragFactor(mach, cfg.effAspectRatio, e0 * (1 - 0.1 * df - 0.06 * dg));

  const cdAtt = cd0Total + ge.sigmaGe * kInduced * clPot * clPot + 0.55 * kv * Math.pow(Math.abs(sinA), 3) * wVortex;
  const aftDragFactor = aftBlend * Math.max(0, -cosA) ** 2;
  const cdFp = cd0Total + (cd90 - cd0Total) * sinA * sinA + (cd180 - cd0Total) * aftDragFactor;
  const cd = wAtt * cdAtt + (1 - wAtt) * cdFp + 1.15 * sinB * sinB;

  // Sideforce (linear weathercock restoring + broadside bluff-body crossflow + rudder)
  const cyBeta = cfg.cyBeta0 ?? -0.85;
  const cy = cyBeta * sinB * cosB - 1.25 * sinB * Math.abs(sinB) - 0.18 * etaRud * surfaces.rud;

  // Static lateral-directional & longitudinal stability derivatives
  const clBeta = (cfg.clBeta0 ?? -0.095) * cosA - 0.03 * Math.sin(2 * a);
  const cnBeta0 = cfg.cnBeta0 ?? 0.095;
  // Weathercock directional stability degrades above ~24-48 deg due to vertical fin blanking
  const cnBeta =
    cnBeta0 * (1 + 0.25 * smoothstep(mach, 0.8, 1.4)) * (1 - 1.15 * smoothstep(absA, 24 * DEG, 48 * DEG));

  // Static pitch stiffness: relaxed at subsonic cruise, shifts aft (stable) past Mach 1
  const cmAlphaSlope = (cfg.cmAlphaSub ?? 0.04) - 0.39 * smoothstep(mach, 0.85, 1.35);
  // Deep post-stall pitch-down pendulum stability restores nose toward velocity past ~50 deg (Cobra recovery)
  const cmRestoring = -0.42 * (1 - wAtt) * sinA * Math.max(0.25, Math.abs(cosA) + 0.3);
  const cmPitchStatic =
    (cfg.cm0 ?? 0.01) + cmAlphaSlope * sinA * cosA + cmRestoring + ge.deltaCmGe + dCmConfig;

  const clRoll = clBeta * sinB * cosB + 0.16 * etaAil * surfaces.ail - 0.025 * etaRud * surfaces.rud;
  const cmPitch = cmPitchStatic + 0.55 * etaElev * surfaces.elev;
  const cnYaw = cnBeta * sinB * cosB + 0.11 * etaRud * surfaces.rud - 0.03 * (1 - wAtt) * surfaces.ail;

  // Damping term note: rate damping torques are applied dimensionally via (0.25 * rho * V * S * L^2)
  // in computeAeroForcesAndMoments to stay singularity-free as V -> 0. Keep non-dim coeffs pure static+control.
  void ratesB3;
  void alphaDotRadS;

  // Stall & buffet indicators
  const stallFactor = smoothstep(absA, 16 * DEG, 34 * DEG) * (1 - 0.35 * smoothstep(absA, 100 * DEG, 165 * DEG));
  const transonicBuffet = Math.exp(-Math.pow((mach - 0.99) / 0.075, 2));
  const buffetFactor = clamp(Math.max(stallFactor * (1 - 0.2 * wAtt), 0.75 * transonicBuffet), 0, 1);

  return {
    cl,
    cd,
    cy,
    clRoll,
    cmPitch,
    cnYaw,
    wAttached: wAtt,
    stallFactor,
    buffetFactor,
    clMaxEffective,
    cd0Total,
    cdWave,
    kInduced,
    sigmaGe: ge.sigmaGe,
    kGeLift: ge.kGeLift,
    clAlphaRad: cla,
  };
}

/**
 * Compute dimensional 3D aerodynamic forces (N) and moments (N·m) in Solaris Three.js body frame.
 * Includes singularity-free aerodynamic rate damping and high-q control surface compression.
 */
export function computeAeroForcesAndMoments(
  input: AeroForceMomentInput,
  airframe: AeroAirframeLike,
  outForce?: THREE.Vector3,
  outMoment?: THREE.Vector3
): AeroForceMomentResult {
  const cfg = asConfig(airframe);
  const { flow, air, rhoKgM3, altAboveGroundM, ratesB3, surfaces } = input;
  const alphaDot = input.alphaDotRadS ?? 0;

  // High-q FBW control surface gain compression prevents supersonic sea-level twitchiness
  const qRefCtrl = 35_000; // 35 kPa reference dynamic pressure
  const qGainCompress = Math.min(1, qRefCtrl / Math.max(air.qPa, qRefCtrl));

  const effSurfaces: AeroSurfaceInputs = {
    elev: surfaces.elev * qGainCompress,
    ail: surfaces.ail * qGainCompress,
    rud: surfaces.rud * qGainCompress,
    flaps: surfaces.flaps,
    slats: surfaces.slats,
    gear: surfaces.gear,
    speedbrake: surfaces.speedbrake,
  };

  const coeffs = computeAeroCoefficients(flow, air.mach, altAboveGroundM, effSurfaces, cfg, ratesB3, alphaDot);

  const qS = air.qPa * cfg.wingAreaM2;
  const liftN = qS * coeffs.cl;
  const dragN = qS * coeffs.cd;
  const sideN = qS * coeffs.cy;

  // Orthonormal 3D wind-to-Solaris-body projection
  const sinA = Math.sin(flow.alphaRad);
  const cosA = Math.cos(flow.alphaRad);
  const sinB = Math.sin(flow.betaRad);
  const cosB = Math.cos(flow.betaRad);

  const fx = -dragN * sinB + sideN * cosB;
  const fy = dragN * sinA * cosB + sideN * sinA * sinB + liftN * cosA;
  const fz = dragN * cosA * cosB + sideN * cosA * sinB - liftN * sinA;

  const forceB3 = (outForce ?? new THREE.Vector3()).set(fx, fy, fz);

  // Convert Solaris Three.js body rates [pitchUp, yawLeft, rollLeftDn] -> FRD [p, q, r]
  const p = -ratesB3.z;
  const qRate = ratesB3.x;
  const r = -ratesB3.y;

  const absA = Math.abs(flow.alphaRad);
  // Roll damping weakens/reverses slightly at deep stall (autorotation spin susceptibility)
  const clp = (cfg.clp0 ?? -0.38) * (1 - 1.12 * smoothstep(absA, 26 * DEG, 44 * DEG) * Math.max(0, cosB));
  const clr = 0.08 + 0.14 * Math.sin(absA) * (flow.alphaRad >= 0 ? 1 : -1);
  const cmq = cfg.cmq ?? -10.5;
  const cmAlphaDot = cfg.cmAlphaDot ?? -3.0;
  const cnr = (cfg.cnr0 ?? -0.18) * (1 - 0.45 * smoothstep(absA, 30 * DEG, 65 * DEG));
  const cnp = -0.04 * Math.sin(flow.alphaRad);

  // Singularity-free dimensional damping factor: q * S * L * (rate * L / (2*V)) = 0.25 * rho * V * S * L^2 * rate
  const dampLat = 0.25 * rhoKgM3 * flow.speedMps * cfg.wingAreaM2 * cfg.spanM * cfg.spanM;
  const dampLon = 0.25 * rhoKgM3 * flow.speedMps * cfg.wingAreaM2 * cfg.macM * cfg.macM;

  const lAero = qS * cfg.spanM * coeffs.clRoll + dampLat * (clp * p + clr * r);
  const mAero = qS * cfg.macM * coeffs.cmPitch + dampLon * (cmq * qRate + cmAlphaDot * alphaDot);
  const nAero = qS * cfg.spanM * coeffs.cnYaw + dampLat * (cnr * r + cnp * p);

  // Map FRD moments [L_roll, M_pitch, N_yaw] back to Solaris Three.js body moments [Mx, My, Mz]
  const momentB3 = (outMoment ?? new THREE.Vector3()).set(mAero, -nAero, -lAero);

  return {
    coeffs,
    forceB3,
    momentB3,
    liftN,
    dragN,
    sideN,
    qGainCompress,
  };
}

/**
 * Stevens & Lewis 6-DOF rigid-body rotational acceleration with I_xz roll-yaw coupling.
 * Input & output vectors are in Solaris Three.js body frame [pitchUp, yawLeft, rollLeftDown].
 */
export function solveEulerAngularAccel(
  totalMomentB3: THREE.Vector3,
  ratesB3: THREE.Vector3,
  inertia: readonly [number, number, number, number],
  out?: THREE.Vector3
): THREE.Vector3 {
  const [ixx, iyy, izz, ixz] = inertia;
  // Solaris B3 -> aerospace FRD
  const p = -ratesB3.z;
  const q = ratesB3.x;
  const r = -ratesB3.y;

  const L = -totalMomentB3.z;
  const M = totalMomentB3.x;
  const N = -totalMomentB3.y;

  const gamma = Math.max(1e-3, ixx * izz - ixz * ixz);
  const c1 = L + ixz * p * q - (izz - iyy) * q * r;
  const c2 = N - ixz * q * r - (iyy - ixx) * p * q;

  const pDot = (izz * c1 + ixz * c2) / gamma;
  const qDot = (M + (izz - ixx) * p * r - ixz * (p * p - r * r)) / Math.max(1e-3, iyy);
  const rDot = (ixz * c1 + ixx * c2) / gamma;

  // Aerospace FRD -> Solaris B3
  return (out ?? new THREE.Vector3()).set(qDot, -rDot, -pDot);
}

/**
 * Compute Boyd corner speed (minimum TAS/EAS at which structural G-limit and CL_max intersect).
 */
export function computeCornerSpeed(
  massKg: number,
  wingAreaM2: number,
  clMax: number,
  nMaxPos: number,
  rhoKgM3: number
): { easMps: number; tasMps: number } {
  const denom = Math.max(1e-6, RHO0_EARTH * wingAreaM2 * Math.max(0.2, clMax));
  const easMps = Math.sqrt(Math.max(0, 2 * Math.max(1, nMaxPos) * massKg * G0_MPS2) / denom);
  const sigma = Math.max(1e-6, rhoKgM3 / RHO0_EARTH);
  const tasMps = rhoKgM3 > 1e-7 ? easMps / Math.sqrt(sigma) : Infinity;
  return { easMps, tasMps };
}

/**
 * Boyd Specific Excess Power P_s = (T_forward - D) * V / (m * g_eff) in m/s.
 * Uses a safe 0.2 m/s^2 gravity floor to prevent division-by-zero in orbital free-fall.
 */
export function specificExcessPowerMps(
  thrustAlongPathN: number,
  dragN: number,
  massKg: number,
  vTasMps: number,
  gEffMps2: number
): number {
  const wEff = Math.max(1, massKg) * Math.max(0.2, gEffMps2);
  return ((thrustAlongPathN - dragN) * Math.max(0, vTasMps)) / wEff;
}

/**
 * Instantaneous vs sustained level turn performance at given flight condition.
 */
export function computeTurnPerformance(
  vTasMps: number,
  qPa: number,
  massKg: number,
  gEffMps2: number,
  wingAreaM2: number,
  clMax: number,
  nMaxPos: number,
  thrustMaxN: number,
  cd0Total: number,
  kInduced: number
): TurnPerformanceResult {
  const V = Math.max(0.5, vTasMps);
  const qS = Math.max(0, qPa) * Math.max(1, wingAreaM2);
  const mG0 = Math.max(1, massKg) * G0_MPS2;
  const gLocal = Math.max(0, gEffMps2);

  const nAero = (qS * Math.max(0.1, clMax)) / mG0;
  const nInst = Math.min(nMaxPos, nAero);
  const nLocalRatio = gLocal / G0_MPS2;

  const instTurnRateRadS =
    nInst > nLocalRatio ? Math.sqrt(Math.max(0, (nInst * G0_MPS2) ** 2 - gLocal * gLocal)) / V : 0;
  const instRadiusM = instTurnRateRadS > 1e-6 ? V / instTurnRateRadS : Infinity;

  let clSust = 0;
  if (qS > 1 && kInduced > 1e-6) {
    const excessRatio = thrustMaxN / qS - cd0Total;
    if (excessRatio > 0) clSust = Math.sqrt(excessRatio / kInduced);
  }
  const nSust = Math.min(nInst, (qS * Math.min(clMax, clSust)) / mG0);
  const sustTurnRateRadS =
    nSust > nLocalRatio ? Math.sqrt(Math.max(0, (nSust * G0_MPS2) ** 2 - gLocal * gLocal)) / V : 0;

  return {
    nInst,
    instTurnRateRadS,
    instRadiusM,
    nSust,
    sustTurnRateRadS,
    clSust,
  };
}
