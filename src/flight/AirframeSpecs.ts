/**
 * Airframe physical specifications, propulsion thrust-lapse curves, and fuel-burn models.
 *
 * Units are strictly SI unless a field suffix states otherwise (kg, m, m^2, N, s, kg/N/s, rad).
 */

import { G0, P_SEA_EARTH, T_SEA_EARTH } from './PlanetaryPhysics';

export type AirframeSpecId = 'gripen' | 'su30' | 'kestrel';

export type EngineSpeedTier = 'jet' | 'hypersonic' | 'scramjet';

export interface AirframeAeroConstants {
  /** Zero-alpha camber lift coefficient. */
  cl0: number;
  /** Polhamus vortex-lift scaling factor for delta / LERX strakes. */
  kvVortex: number;
  /** Clean zero-lift parasitic drag coefficient (subsonic). */
  cd0Clean: number;
  /** Oswald span-efficiency factor. */
  oswaldE: number;
  /** Positive stall / max controlled vortex-lift alpha, deg. */
  alphaStallPosDeg: number;
  /** Negative stall alpha, deg. */
  alphaStallNegDeg: number;
  /** Clean maximum lift coefficient. */
  clMaxClean: number;
  /** High-lift (flaps/LEF) maximum lift coefficient. */
  clMaxFlaps: number;
}

export interface AirframeSpec {
  id: AirframeSpecId;
  displayName: string;
  enginesDescription: string;
  /** Airframe operating empty mass (with pilot & trapped fluids), kg. */
  emptyMassKg: number;
  /** Maximum internal fuel capacity, kg. */
  maxFuelKg: number;
  /** Default combat fuel load (gives authentic combat mass), kg. */
  initialFuelKg: number;
  /** Reference wing planform area S, m^2. */
  wingAreaM2: number;
  /** Wingspan b, m. */
  spanM: number;
  /** Mean aerodynamic chord MAC, m. */
  macM: number;
  /** Effective aspect ratio AR = b^2 / S (with LERX/canard correction). */
  effAspectRatio: number;
  /** Leading-edge sweep angle, deg. */
  sweepDeg: number;
  /** Aerofoil thickness-to-chord ratio t/c (for Korn transonic drag-divergence). */
  thicknessRatio: number;
  /** Installed sea-level static dry (military) thrust, N. */
  dryThrustN: number;
  /** Installed sea-level static wet (max afterburner) thrust, N. */
  wetThrustN: number;
  /** Dry (MIL) thrust-specific fuel consumption, kg / (N * s). */
  tsfcDryKgPerNs: number;
  /** Wet (AB) thrust-specific fuel consumption, kg / (N * s). */
  tsfcWetKgPerNs: number;
  /** Ground/flight idle fuel flow floor, kg/s. */
  idleFlowKgPerS: number;
  /** Engine compressor flat-rating throttle-recovery temperature ratio TR. */
  throttleRecoveryTempRatio: number;
  /** Structural positive limit load factor, g. */
  gLimitPos: number;
  /** Structural negative limit load factor, g. */
  gLimitNeg: number;
  /** Emergency / G-limiter override structural limit, g. */
  highGLimit: number;
  /** Whether the airframe has active close-coupled foreplanes. */
  hasCanards: boolean;
  /** Whether thrust-vectoring nozzles are installed. */
  hasTvc: boolean;
  /** Moment arm from CG to TVC nozzle plane, m (0 when no TVC). */
  tvcArmM: number;
  /** Maximum mechanical nozzle deflection, deg (0 when no TVC). */
  tvcMaxDeg: number;
  /** Out-of-plane cant angle for twin 3D TVC nozzles, deg (0 for 2D pitch TVC). */
  tvcCantDeg: number;
  /** Principal/product inertia tensor [Ixx, Iyy, Izz, Ixz] in kg*m^2. */
  inertia: readonly [number, number, number, number];
  /** Reference aerodynamic coefficients shared with Aerodynamics.ts. */
  aero: AirframeAeroConstants;
  /** Maximum design indicated/true airspeed limit in jet tier, m/s. */
  designVneMps: number;
  /** Maximum structural/inlet Mach number in jet tier. */
  designMachMax: number;
  /** Design dynamic pressure envelope q_max, Pa. */
  qLimitPa: number;
}

export const AIRFRAME_SPECS: Record<AirframeSpecId, AirframeSpec> = {
  gripen: {
    id: 'gripen',
    displayName: 'JAS 39C Gripen',
    enginesDescription: '1x Volvo RM12',
    emptyMassKg: 6800,
    maxFuelKg: 2400,
    initialFuelKg: 1700,
    wingAreaM2: 30.0,
    spanM: 8.02,
    macM: 4.10,
    effAspectRatio: 2.9,
    sweepDeg: 43,
    thicknessRatio: 0.045,
    dryThrustN: 54000,
    wetThrustN: 80500,
    tsfcDryKgPerNs: 2.21e-5, // 0.78 kg/(kgf*h)
    tsfcWetKgPerNs: 5.38e-5, // 1.90 kg/(kgf*h)
    idleFlowKgPerS: 0.12,
    throttleRecoveryTempRatio: 1.06,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    hasCanards: true,
    hasTvc: false,
    tvcArmM: 0,
    tvcMaxDeg: 0,
    tvcCantDeg: 0,
    inertia: [11500, 62000, 71000, 1100],
    aero: {
      cl0: 0.05,
      kvVortex: 2.85,
      cd0Clean: 0.018,
      oswaldE: 0.72,
      alphaStallPosDeg: 28,
      alphaStallNegDeg: -18,
      clMaxClean: 1.55,
      clMaxFlaps: 2.05,
    },
    designVneMps: 750,
    designMachMax: 2.05,
    qLimitPa: 78000,
  },
  su30: {
    id: 'su30',
    displayName: 'Su-30MKK Flanker-G',
    enginesDescription: '2x Saturn AL-31FP (32 deg TVC)',
    emptyMassKg: 18400,
    maxFuelKg: 9640,
    initialFuelKg: 6600,
    wingAreaM2: 62.0,
    spanM: 14.80,
    macM: 4.85,
    effAspectRatio: 3.53,
    sweepDeg: 38,
    thicknessRatio: 0.048,
    dryThrustN: 149000,
    wetThrustN: 245160,
    tsfcDryKgPerNs: 2.12e-5, // 0.75 kg/(kgf*h)
    tsfcWetKgPerNs: 5.55e-5, // 1.96 kg/(kgf*h)
    idleFlowKgPerS: 0.35,
    throttleRecoveryTempRatio: 1.08,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    hasCanards: false,
    hasTvc: true,
    tvcArmM: 6.8,
    tvcMaxDeg: 15,
    tvcCantDeg: 32,
    inertia: [42000, 215000, 248000, 3200],
    aero: {
      cl0: 0.07,
      kvVortex: 2.75,
      cd0Clean: 0.022,
      oswaldE: 0.76,
      alphaStallPosDeg: 27,
      alphaStallNegDeg: -18,
      clMaxClean: 1.50,
      clMaxFlaps: 2.00,
    },
    designVneMps: 720,
    designMachMax: 2.35,
    qLimitPa: 82000,
  },
  kestrel: {
    id: 'kestrel',
    displayName: 'Kestrel SX-1',
    enginesDescription: '1x Solaris S-132 Vectored Turbofan',
    emptyMassKg: 10200,
    maxFuelKg: 4500,
    initialFuelKg: 3300,
    wingAreaM2: 42.0,
    spanM: 10.90,
    macM: 4.25,
    effAspectRatio: 2.83,
    sweepDeg: 40,
    thicknessRatio: 0.045,
    dryThrustN: 82000,
    wetThrustN: 132000,
    tsfcDryKgPerNs: 2.15e-5,
    tsfcWetKgPerNs: 5.45e-5,
    idleFlowKgPerS: 0.20,
    throttleRecoveryTempRatio: 1.08,
    gLimitPos: 9.0,
    gLimitNeg: -3.0,
    highGLimit: 11.5,
    hasCanards: false,
    hasTvc: true,
    tvcArmM: 6.2,
    tvcMaxDeg: 15,
    tvcCantDeg: 0,
    inertia: [21000, 118000, 134000, 1800],
    aero: {
      cl0: 0.06,
      kvVortex: 2.65,
      cd0Clean: 0.019,
      oswaldE: 0.78,
      alphaStallPosDeg: 28,
      alphaStallNegDeg: -18,
      clMaxClean: 1.55,
      clMaxFlaps: 2.05,
    },
    designVneMps: 760,
    designMachMax: 2.40,
    qLimitPa: 85000,
  },
};

export function resolveAirframeSpecId(id?: string | null): AirframeSpecId {
  if (id === 'gripen' || id === 'su30' || id === 'kestrel') return id;
  return 'kestrel';
}

export function getAirframeSpec(id?: string | null): AirframeSpec {
  return AIRFRAME_SPECS[resolveAirframeSpecId(id)];
}

export function combatMassKg(spec: AirframeSpec, fuelKg = spec.initialFuelKg): number {
  return spec.emptyMassKg + Math.max(0, Math.min(spec.maxFuelKg, fuelKg));
}

export function maxInternalFuelFraction(spec: AirframeSpec): number {
  return spec.maxFuelKg / (spec.emptyMassKg + spec.maxFuelKg);
}

export interface PropulsionInput {
  /** Normalized throttle lever [0, 1] (where 1.0 = 100% Dry Military Power when afterburner=false). */
  throttle: number;
  /** Whether afterburner (wet) stage is active. */
  afterburner: boolean;
  /** Optional explicit afterburner fraction [0, 1] (e.g. from ManeuversAndFBW spool/abStage). */
  abFraction?: number;
  /** Local Mach number. */
  mach: number;
  /** Ambient pressure, Pa. */
  pressurePa: number;
  /** Ambient temperature, K. */
  tempK: number;
  /** Ratio of specific heats gamma (defaults to 1.4). */
  gamma?: number;
  /** Whether ambient atmosphere contains free O2 (Earth). */
  hasOxygen?: boolean;
  /** Surface/1-bar reference pressure on the current body, Pa (used by solaris core mode). */
  surfacePressurePa?: number;
  /** Surface/1-bar reference temperature on the current body, K (used by solaris core mode). */
  surfaceTempK?: number;
  /**
   * 'solaris' (default): Dual-mode closed-cycle thermal-core augmentation on non-O2 worlds so
   * planetary T/W ratios hold authentically from Mars to Titan without Venus 92-bar explosion.
   * 'airbreathing': Pure Mattingly open-cycle air-breathing jet curve (requires O2 unless overridden).
   */
  mode?: 'solaris' | 'airbreathing';
  /** Active speed tier (from EarthTransit SPEED_TIERS), scaling envelope beyond Mach 2.3. */
  speedTier?: EngineSpeedTier;
  /** Multiplier from SPEED_TIERS.airAccelScale when in hypersonic/scramjet tiers (default 1). */
  airAccelScale?: number;
  /** Effective gravity acceleration m/s^2 for T/W readout (defaults to G0). */
  gEffMps2?: number;
  /** Total aircraft mass kg for T/W readout (defaults to combat weight). */
  massKg?: number;
  /** Current onboard fuel kg (returns idle/zero thrust only when zeroFuelCutoff is enabled). */
  fuelKg?: number;
  /** Whether empty fuel cuts off main engine thrust (default false so player never stalls out in orbit). */
  zeroFuelCutoff?: boolean;
}

export interface PropulsionOutput {
  /** Net thrust along body axis, N. */
  thrustN: number;
  /** Maximum available dry thrust at this flight condition, N. */
  maxDryThrustN: number;
  /** Maximum available wet (AB) thrust at this flight condition, N. */
  maxWetThrustN: number;
  /** Dry (MIL) thrust lapse ratio relative to sea-level static dryThrustN. */
  dryLapse: number;
  /** Wet (AB) thrust lapse ratio relative to sea-level static wetThrustN. */
  wetLapse: number;
  /** Inlet total-pressure recovery eta_r (MIL-E-5007D). */
  inletRecovery: number;
  /** Fuel mass flow rate at current thrust/setting, kg/s. */
  fuelFlowKgPerS: number;
  /** Effective thrust-to-weight ratio T / (m * g_eff). */
  thrustToWeight: number;
  /** Effective afterburner engagement [0, 1]. */
  abFraction: number;
}

/**
 * MIL-E-5007D / Mattingly supersonic inlet ram-pressure recovery eta_r.
 */
export function inletPressureRecovery(mach: number): number {
  const m = Math.max(0, mach);
  if (m <= 1) return 1;
  return Math.max(0.08, 1 - 0.075 * Math.pow(m - 1, 1.35));
}

/**
 * Compute thrust lapse, net engine thrust, fuel flow, and planetary T/W.
 */
export function computeEngineThrust(spec: AirframeSpec, input: PropulsionInput): PropulsionOutput {
  const mode = input.mode ?? 'solaris';
  const gamma = Math.max(1.12, Math.min(1.67, input.gamma ?? 1.4));
  const mach = Math.max(0, input.mach);
  const throttle = Math.max(0, Math.min(1, input.throttle));
  const tempK = Math.max(1, input.tempK);
  const pressurePa = Math.max(0, input.pressurePa);
  const hasOxygen = input.hasOxygen ?? true;
  const tier = input.speedTier ?? 'jet';
  const tierScale = Math.max(1, input.airAccelScale ?? (tier === 'scramjet' ? 60 : tier === 'hypersonic' ? 12 : 1));
  const massKg = Math.max(1, input.massKg ?? combatMassKg(spec));
  const gEff = input.gEffMps2 ?? G0;

  // Ambient reference normalization:
  // On Earth ('airbreathing' or hasOxygen), normalize strictly to ISA SL (101325 Pa, 288.15 K).
  // On non-O2 Solaris worlds in 'solaris' mode, normalize pressure & temperature against the
  // body's surface/1-bar operating envelope so closed-cycle core thrust preserves real planetary T/W
  // while still losing pressure with altitude toward the vacuum edge.
  let refPressurePa = P_SEA_EARTH;
  let refTempK = T_SEA_EARTH;
  if (mode === 'solaris' && !hasOxygen) {
    refPressurePa = Math.max(1, input.surfacePressurePa ?? (pressurePa > 0 ? pressurePa : P_SEA_EARTH));
    refTempK = Math.max(40, input.surfaceTempK ?? tempK);
  }

  const deltaAmb = pressurePa / refPressurePa;
  const thetaAmb = tempK / refTempK;
  const isenTemp = 1 + ((gamma - 1) * 0.5) * mach * mach;
  const isenPress = Math.pow(isenTemp, gamma / (gamma - 1));
  const theta0 = thetaAmb * isenTemp;
  const delta0 = deltaAmb * isenPress;
  const etaR = inletPressureRecovery(mach);

  // Corrected mass-flow factor (static SL = 1.0).
  const massFlowRel = theta0 > 0 ? (etaR * delta0) / Math.sqrt(theta0) : 0;
  const TR = spec.throttleRecoveryTempRatio;
  const overTemp = Math.max(0, (theta0 - TR) / Math.max(0.1, theta0));

  let dryLapse: number;
  let wetLapse: number;

  if (mode === 'airbreathing' && !hasOxygen) {
    dryLapse = 0;
    wetLapse = 0;
  } else if (tier === 'jet') {
    // Low-bypass mixed-flow turbofan lapse (RM12 / AL-31F / S-132).
    // Dry core faces turbine-inlet temperature limit (T_t4) rapidly above TR;
    // Afterburner maintains high T_t7 and benefits from supersonic ram recovery until ~M2.4.
    const dryCoreFactor = Math.max(0.05, 1 - 1.55 * overTemp - 0.32 * Math.min(mach, 2.5));
    const wetAbFactor = Math.max(0.12, 1 - 0.55 * overTemp - 0.24 * Math.min(mach, 2.8));
    // Soft Mach-envelope roll-off past the airframe inlet's structural Mach ceiling.
    const jetMachRollOff = mach > spec.designMachMax
      ? Math.max(0.15, 1 - 0.45 * (mach - spec.designMachMax))
      : 1;
    dryLapse = Math.max(0, massFlowRel * dryCoreFactor * jetMachRollOff);
    wetLapse = Math.max(0, massFlowRel * wetAbFactor * jetMachRollOff);

    // Vacuum / near-vacuum behavior:
    // - Pure airbreathing goes to 0 as pressurePa -> 0.
    // - In 'solaris' mode with ambient pressure present, smoothly preserve minimum thruster authority if cutoff off;
    //   when pressurePa === 0, pure aerodynamic jet thrust is 0 (FlightModel switches to transit/RCS drive).
  } else {
    // Combined-cycle hypersonic (Mach 6) / scramjet (Mach 25) tier envelope:
    // Smoothly bridges jet air-breathing into ramjet/scramjet corridor scaling (`airAccelScale`),
    // while decaying with altitude pressure ratio so space/vacuum handoff remains seamless.
    const ceilingMach = tier === 'scramjet' ? 25.5 : 6.5;
    const machEnvelope = mach <= ceilingMach
      ? 1 + 0.12 * Math.min(mach / (tier === 'scramjet' ? 12 : 3), 1)
      : Math.max(0.1, 1 - 0.5 * (mach - ceilingMach));
    const airFactor = Math.min(1.5, Math.sqrt(Math.max(0, deltaAmb)));
    dryLapse = tierScale * airFactor * machEnvelope * (spec.dryThrustN > 0 ? 1 : 0);
    wetLapse = tierScale * airFactor * machEnvelope;
  }

  const maxDryThrustN = spec.dryThrustN * dryLapse;
  const maxWetThrustN = spec.wetThrustN * wetLapse;

  const hasFuel = input.fuelKg === undefined || input.fuelKg > 0 || !input.zeroFuelCutoff;
  let thrustN = 0;
  let abFraction = 0;

  if (hasFuel && (mode === 'solaris' ? pressurePa > 0 || tier !== 'jet' : pressurePa > 0)) {
    const abActive = input.abFraction !== undefined ? input.abFraction > 0 : input.afterburner;
    if (abActive) {
      if (input.abFraction !== undefined) {
        abFraction = Math.max(0, Math.min(1, input.abFraction));
      } else {
        // Aligns with ManeuversAndFBW.computeAfterburnerStage: engaging boost lights AB Zone 1..3
        // at or above 100% Dry Military Power across the throttle range (Zone 3 at >= 0.85).
        abFraction = throttle >= 0.85 ? 1.0 : throttle >= 0.5 ? 0.68 : 0.35;
      }
      thrustN = maxDryThrustN + abFraction * Math.max(0, maxWetThrustN - maxDryThrustN);
    } else {
      // Idle floor (~5% static dry thrust at throttle=0 in flight) up to 100% MIL at throttle=1.
      const effThrottle = 0.05 + 0.95 * throttle;
      thrustN = maxDryThrustN * effThrottle;
    }
  }

  const fuelFlowKgPerS = computeFuelBurnRateKgPerS(spec, {
    throttle,
    afterburner: input.afterburner,
    thrustN,
    abFraction,
    hasFuel,
  });

  const weightN = massKg * gEff;
  const thrustToWeight = weightN > 1e-6 ? thrustN / weightN : (thrustN > 0 ? Infinity : 0);

  return {
    thrustN,
    maxDryThrustN,
    maxWetThrustN,
    dryLapse,
    wetLapse,
    inletRecovery: etaR,
    fuelFlowKgPerS,
    thrustToWeight,
    abFraction,
  };
}

export interface FuelBurnInput {
  throttle: number;
  afterburner: boolean;
  thrustN: number;
  abFraction?: number;
  hasFuel?: boolean;
}

/**
 * Computes instantaneous fuel mass flow (kg/s) blending dry and wet TSFC across AB staging.
 */
export function computeFuelBurnRateKgPerS(spec: AirframeSpec, input: FuelBurnInput): number {
  if (input.hasFuel === false) return 0;
  const throttle = Math.max(0, Math.min(1, input.throttle));
  const fallbackAb = input.afterburner ? (throttle >= 0.85 ? 1.0 : throttle >= 0.5 ? 0.68 : 0.35) : 0;
  const abFrac = Math.max(0, Math.min(1, input.abFraction ?? fallbackAb));
  const tsfc = spec.tsfcDryKgPerNs + abFrac * (spec.tsfcWetKgPerNs - spec.tsfcDryKgPerNs);
  const dynamicFlow = Math.max(0, input.thrustN) * tsfc;
  return Math.max(spec.idleFlowKgPerS * (0.6 + 0.4 * throttle), dynamicFlow);
}

/**
 * Advances onboard fuel mass (kg) over timestep `dt` (s).
 * By default preserves a small 2% reserve floor when `allowFullDepletion` is false so
 * arcade/free-flight exploration never deadlocks an unwitting player, while test harnesses
 * can pass `allowFullDepletion: true` for exact endurance calculations.
 */
export function stepFuelMassKg(
  spec: AirframeSpec,
  fuelKg: number,
  fuelFlowKgPerS: number,
  dtSec: number,
  allowFullDepletion = false,
): number {
  const floorKg = allowFullDepletion ? 0 : spec.maxFuelKg * 0.02;
  const next = fuelKg - Math.max(0, fuelFlowKgPerS) * Math.max(0, dtSec);
  return Math.max(floorKg, Math.min(spec.maxFuelKg, next));
}
