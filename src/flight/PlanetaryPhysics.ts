/**
 * Planetary atmospheric thermodynamics and effective gravity across the Solaris system.
 *
 * All quantities are in SI units (m, m/s, m/s^2, kg, kg/m^3, Pa, K, J/(kg*K), rad/s)
 * except `altKm` and `km` parameters which are explicitly suffixed.
 */

import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { MOONS_AND_MINOR_BODIES, SAGITTARIUS_A_STAR_DEF } from '../data/CatalogueData';
import { AIR } from '../rendering/AirProfiles';
import type { CelestialBodyDefinition } from '../types/catalogue';

/** Standard Earth gravity acceleration, m/s^2. */
export const G0 = 9.80665;
/** Newtonian gravitational constant G, m^3 / (kg * s^2). */
export const G_CONST = 6.67430e-11;
/** Universal molar gas constant R*, J / (kmol * K). */
export const R_UNIVERSAL = 8314.4626;
/** ISA Earth sea-level density rho_0, kg/m^3. */
export const RHO_SEA_EARTH = 1.225;
/** ISA Earth sea-level pressure P_0, Pa. */
export const P_SEA_EARTH = 101325;
/** ISA Earth sea-level temperature T_0, K. */
export const T_SEA_EARTH = 288.15;
/** ISA Earth sea-level speed of sound a_0, m/s. */
export const A_SEA_EARTH = Math.sqrt(1.4 * 287.05287 * T_SEA_EARTH); // 340.294 m/s

export interface AtmosphereLayer {
  /** Base altitude of the layer above the datum / 1-bar cloud deck, km. */
  baseAltKm: number;
  /** Base temperature at `baseAltKm`, K. */
  baseTempK: number;
  /** Linear thermal lapse rate dT/dh, K/km. */
  lapseKPerKm: number;
}

export interface PlanetThermoProfile {
  name: string;
  /** Specific gas constant R = R* / M_mean, J / (kg * K). */
  gasConstantJPerKgK: number;
  /** Reference hydrostatic gravity used for scale height integration, m/s^2. */
  hydroGravityMps2: number;
  /** Surface or 1-bar reference pressure P_0, Pa. */
  surfacePressurePa: number;
  /** Surface or 1-bar reference temperature T_0, K. */
  surfaceTempK: number;
  /** Atmospheric top cutoff altitude (smoothly fades to vacuum), km. */
  topKm: number;
  /** Whether atmosphere supports open-cycle O2 combustion (true only on Earth). */
  hasOxygen: boolean;
  /** Piecewise-linear thermal layers sorted ascending by `baseAltKm`. */
  layers: readonly AtmosphereLayer[];
  /** Specific heat ratio gamma(T). */
  gammaFn: (tempK: number) => number;
  /** Real-gas compressibility factor Z(hKm) (defaults to 1.0 ideal gas). */
  compressibilityFn?: (altKm: number, tempK: number) => number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Multi-layer planetary thermodynamic profiles matching US Std Atmosphere 1976,
 * NASA Mars GRC, Venus VIRA, Huygens HASI Titan, and Galileo/Voyager/Cassini
 * 1-bar giant-planet decks.
 */
export const PLANET_THERMO: Record<string, PlanetThermoProfile> = {
  Earth: {
    name: 'Earth',
    gasConstantJPerKgK: 287.05287,
    hydroGravityMps2: G0,
    surfacePressurePa: P_SEA_EARTH,
    surfaceTempK: T_SEA_EARTH,
    topKm: AIR.Earth.topKm, // 100 km
    hasOxygen: true,
    layers: [
      { baseAltKm: 0, baseTempK: 288.15, lapseKPerKm: -6.5 },
      { baseAltKm: 11, baseTempK: 216.65, lapseKPerKm: 0.0 },
      { baseAltKm: 20, baseTempK: 216.65, lapseKPerKm: 1.0 },
      { baseAltKm: 32, baseTempK: 228.65, lapseKPerKm: 2.8 },
      { baseAltKm: 47, baseTempK: 270.65, lapseKPerKm: 0.0 },
      { baseAltKm: 51, baseTempK: 270.65, lapseKPerKm: -2.8 },
      { baseAltKm: 71, baseTempK: 214.65, lapseKPerKm: -2.0 },
      { baseAltKm: 85, baseTempK: 186.65, lapseKPerKm: 0.0 },
    ],
    gammaFn: () => 1.4,
  },
  Mars: {
    name: 'Mars',
    gasConstantJPerKgK: 191.84, // CO2/N2/Ar mean M ~ 43.34 g/mol
    hydroGravityMps2: 3.72076,
    surfacePressurePa: 636, // NASA Mars Fact Sheet datum
    surfaceTempK: 210.0,
    topKm: AIR.Mars.topKm, // 80 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 210.0, lapseKPerKm: -2.15 },
      { baseAltKm: 25, baseTempK: 156.25, lapseKPerKm: -1.10 },
      { baseAltKm: 55, baseTempK: 123.25, lapseKPerKm: 0.0 },
    ],
    gammaFn: (tempK) => clamp(1.33 + 0.00035 * (210 - tempK), 1.25, 1.38),
  },
  Venus: {
    name: 'Venus',
    gasConstantJPerKgK: 191.36, // 96.5% CO2 + 3.5% N2, M ~ 43.45 g/mol
    hydroGravityMps2: 8.87,
    surfacePressurePa: 9.21e6, // 92.1 bar surface
    surfaceTempK: 737.0,
    topKm: AIR.Venus.topKm, // 250 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 737.0, lapseKPerKm: -7.74 }, // Reaches 350 K, ~1.06 bar at 50 km
      { baseAltKm: 50, baseTempK: 350.0, lapseKPerKm: -8.70 },
      { baseAltKm: 60, baseTempK: 263.0, lapseKPerKm: -3.40 },
      { baseAltKm: 100, baseTempK: 127.0, lapseKPerKm: 0.50 },
    ],
    gammaFn: (tempK) => clamp(1.30 - 0.000205 * (tempK - 250), 1.19, 1.36),
    // Supercritical CO2 exhibits ~1% non-ideal compressibility in lower 40 km
    compressibilityFn: (altKm) => (altKm < 40 ? 1.01 - 0.01 * clamp(altKm / 40, 0, 1) : 1.0),
  },
  Titan: {
    name: 'Titan',
    gasConstantJPerKgK: 290.72, // ~95% N2 + ~5% CH4, M ~ 28.60 g/mol
    hydroGravityMps2: 1.352,
    surfacePressurePa: 146700, // HASI 1.467 bar
    surfaceTempK: 93.65,
    topKm: AIR.Titan.topKm, // 600 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 93.65, lapseKPerKm: -0.53 }, // Tropopause 70.33 K at 44 km
      { baseAltKm: 44, baseTempK: 70.33, lapseKPerKm: 0.56 }, // Stratopause 185.7 K at 250 km
      { baseAltKm: 250, baseTempK: 185.69, lapseKPerKm: -0.12 },
    ],
    gammaFn: () => 1.405,
  },
  Jupiter: {
    name: 'Jupiter',
    gasConstantJPerKgK: 3745.3, // H2/He M ~ 2.22 g/mol
    hydroGravityMps2: 24.79,
    surfacePressurePa: 100000, // 1 bar cloud deck
    surfaceTempK: 165.0,
    topKm: AIR.Jupiter.topKm, // 350 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 165.0, lapseKPerKm: -1.0 }, // Tropopause 110 K at 55 km
      { baseAltKm: 55, baseTempK: 110.0, lapseKPerKm: 0.6 },
      { baseAltKm: 200, baseTempK: 197.0, lapseKPerKm: 0.0 },
    ],
    gammaFn: () => 1.435,
  },
  Saturn: {
    name: 'Saturn',
    gasConstantJPerKgK: 4016.6, // H2/He M ~ 2.07 g/mol
    hydroGravityMps2: 10.44,
    surfacePressurePa: 100000,
    surfaceTempK: 134.0,
    topKm: AIR.Saturn.topKm, // 600 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 134.0, lapseKPerKm: -0.37 }, // Tropopause ~90 K at 120 km
      { baseAltKm: 120, baseTempK: 89.6, lapseKPerKm: 0.25 },
      { baseAltKm: 360, baseTempK: 149.6, lapseKPerKm: 0.0 },
    ],
    gammaFn: () => 1.385,
  },
  Uranus: {
    name: 'Uranus',
    gasConstantJPerKgK: 3149.4, // H2/He/CH4 M ~ 2.64 g/mol
    hydroGravityMps2: 8.87,
    surfacePressurePa: 100000,
    surfaceTempK: 76.0,
    topKm: AIR.Uranus.topKm, // 400 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 76.0, lapseKPerKm: -0.38 }, // Tropopause ~53 K at 60 km
      { baseAltKm: 60, baseTempK: 53.2, lapseKPerKm: 0.35 },
      { baseAltKm: 260, baseTempK: 123.2, lapseKPerKm: 0.0 },
    ],
    gammaFn: () => 1.385,
  },
  Neptune: {
    name: 'Neptune',
    gasConstantJPerKgK: 3137.5, // H2/He/CH4 M ~ 2.65 g/mol
    hydroGravityMps2: 11.15,
    surfacePressurePa: 100000,
    surfaceTempK: 72.0,
    topKm: AIR.Neptune.topKm, // 300 km
    hasOxygen: false,
    layers: [
      { baseAltKm: 0, baseTempK: 72.0, lapseKPerKm: -0.44 }, // Tropopause ~52 K at 45 km
      { baseAltKm: 45, baseTempK: 52.2, lapseKPerKm: 0.50 },
      { baseAltKm: 200, baseTempK: 129.7, lapseKPerKm: 0.0 },
    ],
    gammaFn: () => 1.385,
  },
};

const THERMO_BY_LOWER = new Map<string, PlanetThermoProfile>();
for (const profile of Object.values(PLANET_THERMO)) {
  THERMO_BY_LOWER.set(profile.name.toLowerCase(), profile);
}

export function getBodyAtmosphereProfile(bodyName: string): PlanetThermoProfile | null {
  if (!bodyName) return null;
  return THERMO_BY_LOWER.get(bodyName.trim().toLowerCase()) ?? null;
}

export function hasSubstantialAtmosphere(bodyName: string): boolean {
  return getBodyAtmosphereProfile(bodyName) !== null;
}

export interface AtmosphericState {
  bodyName: string;
  altKm: number;
  /** Ambient temperature, K. */
  tempK: number;
  /** Ambient static pressure, Pa. */
  pressurePa: number;
  /** Ambient mass density, kg/m^3. */
  densityKgM3: number;
  /** Density relative to Earth ISA sea level (rho / 1.225). */
  densityRel: number;
  /** Ratio of specific heats C_p / C_v. */
  gamma: number;
  /** Specific gas constant R, J/(kg*K). */
  gasConstantJPerKgK: number;
  /** Local thermodynamic speed of sound sqrt(gamma * R * T), m/s (0 in vacuum). */
  soundSpeedMps: number;
  /** Surface/1-bar reference pressure, Pa (0 for airless worlds). */
  surfacePressurePa: number;
  /** Surface/1-bar reference temperature, K. */
  surfaceTempK: number;
  /** Atmosphere upper cutoff, km. */
  topKm: number;
  /** Free molecular O2 present (Earth). */
  hasOxygen: boolean;
  /** True when aerodynamic density is negligible/absent. */
  isVacuum: boolean;
}

/**
 * Samples local planetary atmospheric thermodynamics at altitude `altKm`.
 * Above `profile.topKm` (or on airless bodies such as Moon, Mercury, Ceres, Pluto, etc.),
 * returns a clean vacuum state (`densityKgM3 = 0`, `pressurePa = 0`, `isVacuum = true`).
 */
export function sampleAtmosphere(bodyName: string, altKm: number): AtmosphericState {
  const profile = getBodyAtmosphereProfile(bodyName);
  const clampedAltKm = Number.isFinite(altKm) ? altKm : 0;

  if (!profile) {
    const body = findBodyDefinition(bodyName);
    return {
      bodyName,
      altKm: clampedAltKm,
      tempK: body?.physical.meanTemperatureK ?? 120,
      pressurePa: 0,
      densityKgM3: 0,
      densityRel: 0,
      gamma: 1.4,
      gasConstantJPerKgK: 287.05287,
      soundSpeedMps: 0,
      surfacePressurePa: 0,
      surfaceTempK: body?.physical.meanTemperatureK ?? 120,
      topKm: 0,
      hasOxygen: false,
      isVacuum: true,
    };
  }

  if (clampedAltKm >= profile.topKm) {
    const topLayer = profile.layers[profile.layers.length - 1];
    const topTempK = Math.max(20, topLayer.baseTempK);
    return {
      bodyName: profile.name,
      altKm: clampedAltKm,
      tempK: topTempK,
      pressurePa: 0,
      densityKgM3: 0,
      densityRel: 0,
      gamma: profile.gammaFn(topTempK),
      gasConstantJPerKgK: profile.gasConstantJPerKgK,
      soundSpeedMps: 0,
      surfacePressurePa: profile.surfacePressurePa,
      surfaceTempK: profile.surfaceTempK,
      topKm: profile.topKm,
      hasOxygen: profile.hasOxygen,
      isVacuum: true,
    };
  }

  const hKm = Math.max(-10, clampedAltKm);
  const layers = profile.layers;
  const R = profile.gasConstantJPerKgK;
  const g = profile.hydroGravityMps2;

  let p = profile.surfacePressurePa;
  let t = profile.surfaceTempK;

  if (hKm < 0) {
    // Below datum (canyons/basins): extrapolate downward using layer 0 lapse.
    const l0 = layers[0];
    const lapsePerM = l0.lapseKPerKm / 1000;
    const dhM = hKm * 1000;
    t = Math.max(20, l0.baseTempK + lapsePerM * dhM);
    if (Math.abs(lapsePerM) > 1e-10) {
      p = profile.surfacePressurePa * Math.pow(t / l0.baseTempK, -g / (R * lapsePerM));
    } else {
      p = profile.surfacePressurePa * Math.exp((-g * dhM) / (R * l0.baseTempK));
    }
  } else {
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const nextBaseKm = i + 1 < layers.length ? layers[i + 1].baseAltKm : Infinity;
      const topOfSliceKm = Math.min(hKm, nextBaseKm);
      const dhKm = topOfSliceKm - layer.baseAltKm;
      if (dhKm < 0) break;

      const dhM = dhKm * 1000;
      const lapsePerM = layer.lapseKPerKm / 1000;
      const baseT = Math.max(20, layer.baseTempK);
      t = Math.max(20, baseT + lapsePerM * dhM);

      if (dhM > 0) {
        if (Math.abs(lapsePerM) > 1e-10) {
          p *= Math.pow(t / baseT, -g / (R * lapsePerM));
        } else {
          p *= Math.exp((-g * dhM) / (R * baseT));
        }
      }

      if (hKm <= nextBaseKm) break;
    }
  }

  // Smooth fade over the top 12% of atmosphere toward `topKm` so karman transitions have no cliff,
  // while leaving lower scientific checkpoints (e.g. Earth 0-85 km) completely undistorted.
  const fadeStartKm = profile.topKm * 0.88;
  const fadeFactor = hKm > fadeStartKm ? 1 - smoothstep(fadeStartKm, profile.topKm, hKm) : 1;

  const Z = profile.compressibilityFn ? profile.compressibilityFn(hKm, t) : 1;
  const gamma = profile.gammaFn(t);
  const effectiveP = p * fadeFactor;
  const densityKgM3 = effectiveP / (Z * R * t);
  const densityRel = densityKgM3 / RHO_SEA_EARTH;
  const soundSpeedMps = fadeFactor > 0 ? Math.sqrt(gamma * R * t * Z) : 0;

  return {
    bodyName: profile.name,
    altKm: clampedAltKm,
    tempK: t,
    pressurePa: effectiveP,
    densityKgM3,
    densityRel,
    gamma,
    gasConstantJPerKgK: R,
    soundSpeedMps,
    surfacePressurePa: profile.surfacePressurePa,
    surfaceTempK: profile.surfaceTempK,
    topKm: profile.topKm,
    hasOxygen: profile.hasOxygen,
    isVacuum: fadeFactor <= 0 || densityKgM3 <= 1e-12,
  };
}

export interface AirDataState {
  /** True airspeed TAS, m/s. */
  tasMps: number;
  /** Equivalent airspeed EAS = TAS * sqrt(rho / rho_0_Earth), m/s. */
  easMps: number;
  /** Compressible calibrated/indicated airspeed (IAS/CAS referenced to Earth SL pitot), m/s. */
  iasMps: number;
  /** Local Mach number TAS / a_local (0 in vacuum). */
  mach: number;
  /** Dynamic pressure q = 0.5 * rho * TAS^2, Pa. */
  qPa: number;
  /** Total pitot impact pressure q_c, Pa. */
  impactPressurePa: number;
}

/**
 * Computes compressible air-data outputs (TAS, EAS, IAS/CAS, Mach, q) for an aircraft
 * moving at true airspeed `tasMps` through the given planetary atmospheric state.
 */
export function computeAirData(tasMps: number, atm: AtmosphericState): AirDataState {
  const v = Math.max(0, tasMps);
  if (atm.isVacuum || atm.densityKgM3 <= 0 || atm.soundSpeedMps <= 0) {
    return {
      tasMps: v,
      easMps: 0,
      iasMps: 0,
      mach: 0,
      qPa: 0,
      impactPressurePa: 0,
    };
  }

  const mach = v / atm.soundSpeedMps;
  const qPa = 0.5 * atm.densityKgM3 * v * v;
  const easMps = v * Math.sqrt(atm.densityKgM3 / RHO_SEA_EARTH);

  // Compressible pitot impact pressure q_c using ambient gamma (Rayleigh pitot for M > 1).
  const g = atm.gamma;
  let impactPressurePa: number;
  if (mach <= 1) {
    impactPressurePa = atm.pressurePa * (Math.pow(1 + ((g - 1) * 0.5) * mach * mach, g / (g - 1)) - 1);
  } else {
    const term1 = Math.pow(((g + 1) * mach * mach) / 2, g / (g - 1));
    const term2 = Math.pow((g + 1) / (2 * g * mach * mach - (g - 1)), 1 / (g - 1));
    impactPressurePa = atm.pressurePa * (term1 * term2 - 1);
  }

  // Standard ASI calibration inverts q_c against ISA Earth SL (gamma = 1.4, P0 = 101325 Pa).
  const ratio = Math.max(0, impactPressurePa / P_SEA_EARTH);
  const subsonicCap = Math.pow(1.2, 3.5) - 1; // ~0.89293 (Mach 1.0 at Earth SL)
  let iasMps: number;
  if (ratio <= subsonicCap) {
    iasMps = A_SEA_EARTH * Math.sqrt(5 * (Math.pow(1 + ratio, 2 / 7) - 1));
  } else {
    // Invert supersonic Rayleigh pitot at Earth SL (gamma_0 = 1.4): f(M) = 166.9216 * M^7 / (7*M^2 - 1)^2.5 - 1 = ratio
    const targetP02OverP0 = 1 + ratio;
    const K = Math.pow(1.2, 3.5) * Math.pow(6, 2.5); // (2.4/2)^3.5 * 2.4^2.5? Exact at M=1: 1.89293 * (6)^2.5 -> 166.92158
    let m = 1 + 0.5 * Math.sqrt(ratio - subsonicCap);
    for (let iter = 0; iter < 12; iter++) {
      const m2 = m * m;
      const denom = 7 * m2 - 1;
      const f = (K * Math.pow(m, 7)) / Math.pow(denom, 2.5);
      // d(ln f)/dM = 7/M - 35*M/(7*M^2 - 1)
      const df = f * (7 / m - (35 * m) / denom);
      if (Math.abs(df) < 1e-9) break;
      const prev = m;
      m = Math.max(1.0001, m - (f - targetP02OverP0) / df);
      if (Math.abs(m - prev) < 1e-6) break;
    }
    iasMps = m * A_SEA_EARTH;
  }

  return {
    tasMps: v,
    easMps,
    iasMps,
    mach,
    qPa,
    impactPressurePa,
  };
}

export interface BodyGravityParams {
  id: string;
  name: string;
  category: CelestialBodyDefinition['category'];
  /** Standard gravitational parameter GM, m^3 / s^2. */
  gmM3S2: number;
  /** Mean volumetric radius, m. */
  meanRadiusM: number;
  /** Equatorial semi-major radius, m. */
  equatorialRadiusM: number;
  /** Polar semi-minor radius, m. */
  polarRadiusM: number;
  /** Sidereal angular rotation speed magnitude |omega|, rad/s. */
  omegaRadPerS: number;
  /** Signed rotation period, hours (negative = retrograde). */
  rotationPeriodHours: number;
  /** Mean surface/equilibrium temperature, K. */
  meanTemperatureK: number;
}

const ALL_CATALOGUE_BODIES: CelestialBodyDefinition[] = [
  ...SOLAR_SYSTEM_BODIES,
  ...MOONS_AND_MINOR_BODIES,
  SAGITTARIUS_A_STAR_DEF,
];

const BODY_DEF_BY_NAME = new Map<string, CelestialBodyDefinition>();
const BODY_DEF_BY_ID = new Map<string, CelestialBodyDefinition>();
const GRAVITY_PARAMS_BY_NAME = new Map<string, BodyGravityParams>();

function buildGravityParams(body: CelestialBodyDefinition): BodyGravityParams {
  const phys = body.physical;
  const meanRadiusKm = Math.max(0.01, phys.meanRadiusKm);
  const eqKm = phys.equatorialRadiusKm ?? phys.shapeAxesKm?.[0] ?? meanRadiusKm;
  const polKm =
    phys.polarRadiusKm ??
    phys.shapeAxesKm?.[2] ??
    (phys.flattening != null ? eqKm * (1 - phys.flattening) : meanRadiusKm);

  let gmM3S2 = 0;
  if (phys.gmKm3S2 != null && Number.isFinite(phys.gmKm3S2) && phys.gmKm3S2 > 0) {
    gmM3S2 = phys.gmKm3S2 * 1e9;
  } else if (phys.massKg != null && Number.isFinite(phys.massKg) && phys.massKg > 0) {
    gmM3S2 = phys.massKg * G_CONST;
  }

  const rotH = phys.rotationPeriodHours ?? 0;
  const omegaRadPerS =
    Number.isFinite(rotH) && Math.abs(rotH) > 1e-6 ? (2 * Math.PI) / (Math.abs(rotH) * 3600) : 0;

  return {
    id: body.id,
    name: body.name,
    category: body.category,
    gmM3S2,
    meanRadiusM: meanRadiusKm * 1000,
    equatorialRadiusM: Math.max(1, eqKm * 1000),
    polarRadiusM: Math.max(1, polKm * 1000),
    omegaRadPerS,
    rotationPeriodHours: rotH,
    meanTemperatureK: phys.meanTemperatureK ?? 120,
  };
}

for (const body of ALL_CATALOGUE_BODIES) {
  BODY_DEF_BY_NAME.set(body.name.toLowerCase(), body);
  BODY_DEF_BY_ID.set(body.id.toLowerCase(), body);
  GRAVITY_PARAMS_BY_NAME.set(body.name.toLowerCase(), buildGravityParams(body));
}

export function findBodyDefinition(nameOrId: string): CelestialBodyDefinition | undefined {
  if (!nameOrId) return undefined;
  const key = nameOrId.trim().toLowerCase();
  return BODY_DEF_BY_NAME.get(key) ?? BODY_DEF_BY_ID.get(key);
}

/**
 * Resolves gravitational and rotational parameters for a solar-system body name, id,
 * or full `CelestialBodyDefinition` (including dynamically generated minor moons).
 */
export function resolveBodyGravityParams(
  bodyOrName: string | CelestialBodyDefinition | BodyGravityParams,
): BodyGravityParams {
  if (typeof bodyOrName === 'string') {
    const key = bodyOrName.trim().toLowerCase();
    const cached = GRAVITY_PARAMS_BY_NAME.get(key);
    if (cached) return cached;
    const def = BODY_DEF_BY_ID.get(key);
    if (def) return buildGravityParams(def);
    // Earth fallback if unknown name is supplied
    return GRAVITY_PARAMS_BY_NAME.get('earth')!;
  }
  if ('gmM3S2' in bodyOrName) return bodyOrName;
  return buildGravityParams(bodyOrName);
}

export interface GravitySampleOptions {
  /** Altitude above the local surface radius, km (defaults to 0). */
  altKm?: number;
  /** Geocentric latitude in radians (0 = equator, +-PI/2 = poles). Defaults to 0 (equator). */
  latitudeRad?: number;
  /**
   * Tangential velocity magnitude in m/s (defaults to 0).
   * In `frame: 'surface'` (default), treated as eastward/prograde tangential flight speed unless
   * `eastwardSpeedMps` / `northwardSpeedMps` are explicitly given.
   * In `frame: 'inertial'`, used directly for centrifugal orbital relief v_t^2 / r.
   */
  tangentialSpeedMps?: number;
  /** Optional signed eastward speed component relative to the surface, m/s (or inertial E if frame='inertial'). */
  eastwardSpeedMps?: number;
  /** Optional meridional (north/south) speed component, m/s. */
  northwardSpeedMps?: number;
  /** Reference frame of supplied velocities: 'surface' (adds planet rotation) or 'inertial'. Default 'surface'. */
  frame?: 'surface' | 'inertial';
  /** Surface shape model: 'ellipsoid' (oblate spheroid by latitude), 'equatorial', or 'mean'. Default 'ellipsoid'. */
  radiusModel?: 'ellipsoid' | 'equatorial' | 'mean';
}

export interface GravityState {
  bodyName: string;
  /** Radius from centre of mass, m. */
  radiusM: number;
  /** Pure Newtonian gravitational acceleration GM / r^2, m/s^2. */
  gGravMps2: number;
  /** Local rotational spin speed at (altKm, latitudeRad), m/s. */
  spinSpeedMps: number;
  /** Inward-normal centrifugal spin relief at zero groundspeed (omega^2 * r * cos^2(lat)), m/s^2. */
  gSpinReliefMps2: number;
  /** Total inertial centrifugal relief v_t^2 / r, m/s^2. */
  gCentrifugalMps2: number;
  /** Net downward apparent gravity max(0, gGrav - gCentrifugal), m/s^2. */
  gEffectiveMps2: number;
  /** Local circular orbital speed sqrt(GM / r), m/s. */
  orbitalSpeedMps: number;
  /** Local escape speed sqrt(2 * GM / r), m/s. */
  escapeSpeedMps: number;
  /** Inertial tangential speed used in centrifugal relief, m/s. */
  inertialTangentialSpeedMps: number;
}

/**
 * Computes inverse-square gravitational acceleration, rotational spin relief,
 * and orbital centrifugal relief v_t^2 / r at a given altitude, latitude, and tangential speed.
 */
export function computeGravityAt(
  bodyOrName: string | CelestialBodyDefinition | BodyGravityParams,
  options: GravitySampleOptions = {},
): GravityState {
  const params = resolveBodyGravityParams(bodyOrName);
  const altKm = options.altKm ?? 0;
  const lat = clamp(options.latitudeRad ?? 0, -Math.PI * 0.5, Math.PI * 0.5);
  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  const radiusModel = options.radiusModel ?? 'ellipsoid';

  let rSurfaceM: number;
  if (radiusModel === 'mean') {
    rSurfaceM = params.meanRadiusM;
  } else if (radiusModel === 'equatorial') {
    rSurfaceM = params.equatorialRadiusM;
  } else {
    const a = params.equatorialRadiusM;
    const b = params.polarRadiusM;
    rSurfaceM = (a * b) / Math.hypot(b * cosLat, a * sinLat);
  }

  const rM = Math.max(1, rSurfaceM + altKm * 1000);
  const gGravMps2 = params.gmM3S2 > 0 ? params.gmM3S2 / (rM * rM) : 0;

  // Radial centrifugal relief from planetary rotation alone at this radius & latitude: omega^2 * r * cos^2(lat)
  const spinSpeedMps = params.omegaRadPerS * rM * cosLat;
  const gSpinReliefMps2 = (spinSpeedMps * spinSpeedMps) / rM;

  // Sign convention for co-rotating surface velocity: retrograde planets spin west-to-east with opposite sign,
  // so prograde eastward airspeed adds to |v_spin| only in the direction of rotation if prograde;
  // for general surface-relative speed magnitude, let positive eastwardSpeedMps add directly in rotation plane.
  const frame = options.frame ?? 'surface';
  let vInertial: number;
  if (frame === 'inertial') {
    if (options.eastwardSpeedMps !== undefined || options.northwardSpeedMps !== undefined) {
      vInertial = Math.hypot(options.eastwardSpeedMps ?? 0, options.northwardSpeedMps ?? 0);
    } else {
      vInertial = Math.abs(options.tangentialSpeedMps ?? 0);
    }
  } else {
    const vNorthRel = options.northwardSpeedMps ?? 0;
    if (options.eastwardSpeedMps !== undefined) {
      const spinSign = params.rotationPeriodHours < 0 ? -1 : 1;
      vInertial = Math.hypot(spinSign * spinSpeedMps + options.eastwardSpeedMps, vNorthRel);
    } else {
      vInertial = Math.hypot(spinSpeedMps + (options.tangentialSpeedMps ?? 0), vNorthRel);
    }
  }

  const gCentrifugalMps2 = (vInertial * vInertial) / rM;
  const gEffectiveMps2 = Math.max(0, gGravMps2 - gCentrifugalMps2);
  const orbitalSpeedMps = params.gmM3S2 > 0 ? Math.sqrt(params.gmM3S2 / rM) : 0;
  const escapeSpeedMps = orbitalSpeedMps * Math.SQRT2;

  return {
    bodyName: params.name,
    radiusM: rM,
    gGravMps2,
    spinSpeedMps,
    gSpinReliefMps2,
    gCentrifugalMps2,
    gEffectiveMps2,
    orbitalSpeedMps,
    escapeSpeedMps,
    inertialTangentialSpeedMps: vInertial,
  };
}

/**
 * Computes aerodynamic 1g stall speed V_s = sqrt(2 * m * g_eff / (rho * S * C_Lmax)) in m/s.
 * Returns `Infinity` in vacuum/exosphere (`rho <= 0`) and `0` in weightless orbit (`g_eff <= 0`).
 */
export function computeStallSpeedMps(
  massKg: number,
  gEffMps2: number,
  densityKgM3: number,
  wingAreaM2: number,
  clMax: number,
): number {
  if (massKg <= 0 || gEffMps2 <= 0) return 0;
  const denom = densityKgM3 * wingAreaM2 * clMax;
  if (denom <= 1e-12) return Infinity;
  return Math.sqrt((2 * massKg * gEffMps2) / denom);
}

/**
 * Computes instantaneous thrust-to-weight ratio T / (m * g_eff).
 */
export function computeThrustToWeight(thrustN: number, massKg: number, gEffMps2: number): number {
  const weightN = massKg * gEffMps2;
  if (weightN <= 1e-6) return thrustN > 0 ? Infinity : 0;
  return thrustN / weightN;
}
