export type BodyCategory = 
  | 'star' 
  | 'planet' 
  | 'moon' 
  | 'dwarf_planet' 
  | 'asteroid' 
  | 'comet' 
  | 'spacecraft';

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

export interface KeplerianElements {
  semiMajorAxisKm: number;      // a
  semiMajorAxisAU: number;      // a in AU
  eccentricity: number;         // e
  inclinationDeg: number;       // i
  longitudeAscendingNodeDeg: number; // Omega
  argumentPeriapsisDeg: number; // omega
  meanAnomalyAtEpochDeg: number;// M0
  orbitalPeriodDays: number;
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
