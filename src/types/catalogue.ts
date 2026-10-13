export type BodyCategory = 
  | 'star' 
  | 'planet' 
  | 'moon' 
  | 'dwarf_planet' 
  | 'asteroid' 
  | 'comet' 
  | 'spacecraft'
  | 'black_hole';

export interface PhysicalParameters {
  meanRadiusKm: number;
  equatorialRadiusKm?: number;
  polarRadiusKm?: number;
  flattening?: number;          // Oblateness: f = (a - b) / a
  massKg?: number;
  gmKm3S2?: number;             // Standard gravitational parameter
  rotationPeriodHours?: number;
  axialTiltDeg?: number;
  meanTemperatureK?: number;
  colorHex?: string;
  spectralType?: string;
  atmosphere?: {
    surfacePressureBar?: number;
    composition?: Array<{ gas: string; percentage: number }>;
  };
}

/**
 * Linear secular rates (per Julian century of TDB) for the JPL "Keplerian Elements for
 * Approximate Positions of the Major Planets" model (Standish, valid 1800–2050 AD).
 * Rates are expressed on the same element set as KeplerianElements, i.e. the argument of
 * periapsis rate is d(ϖ − Ω)/dT and the mean anomaly rate is d(L − ϖ)/dT.
 */
export interface SecularRatesPerCentury {
  semiMajorAxisAU: number;
  eccentricity: number;
  inclinationDeg: number;
  longitudeAscendingNodeDeg: number;
  argumentPeriapsisDeg: number;
  meanAnomalyDeg: number;
}

export interface KeplerianElements {
  semiMajorAxisKm: number;      // a
  semiMajorAxisAU: number;      // a in AU
  eccentricity: number;         // e
  inclinationDeg: number;       // i
  longitudeAscendingNodeDeg: number; // Omega
  argumentPeriapsisDeg: number; // omega
  meanAnomalyAtEpochDeg: number;// M0 (at epochJd)
  orbitalPeriodDays: number;
  /** Epoch of the elements as a TDB Julian Date. Defaults to J2000.0 (2451545.0). */
  epochJd?: number;
  /** Mean motion override in deg/day (rate of mean anomaly). When absent, n = sqrt(μ/a³). */
  meanMotionDegPerDay?: number;
  /** Secular element rates per Julian century (major planets). Overrides GM-derived motion. */
  ratesPerCentury?: SecularRatesPerCentury;
  /** Apsidal / nodal precession in deg/day (satellite mean elements). */
  periapsisArgRateDegPerDay?: number;
  nodeRateDegPerDay?: number;
  /** Human-readable provenance of the element set. */
  source?: string;
}

export interface CelestialBodyDefinition {
  id: string;
  name: string;
  category: BodyCategory;
  orderFromSun: number;
  parentId?: string;            // ID of parent body for moons (e.g. '399' for Earth)
  parentName?: string;          // Name of parent body (e.g. 'Earth')
  physical: PhysicalParameters;
  orbit: KeplerianElements;
  description: string;
}

export interface SelectedTargetInfo {
  id: string;
  name: string;
  category: BodyCategory;
  parentId?: string;
  parentName?: string;
  distanceKm: number;
  apparentSpeedKmS: number;
  radiusKm: number;
  orbitalPeriodDays: number;
  axialTiltDeg: number;
  colorHex: string;
}
