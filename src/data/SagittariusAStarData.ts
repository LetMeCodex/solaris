/**
 * SAGITTARIUS A* (Sgr A*) — AUTHORITATIVE SCIENTIFIC DATA MODEL
 * 
 * Sources:
 * - NASA Black Hole Anatomy: https://science.nasa.gov/universe/black-holes/anatomy/
 * - NASA Black Hole Overview: https://science.nasa.gov/universe/black-holes/
 * - NASA SVS Black Hole Visualization (Jeremy Schnittman 2024): https://svs.gsfc.nasa.gov/14619/
 * - NASA/JPL EHT Observations: https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/
 * - NASA Swift Sgr A* Observations: https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/
 * - Event Horizon Telescope Collaboration (2022, ApJL 930:L12, First Sgr A* Results)
 * - GRAVITY Collaboration (Abuter et al. 2021, A&A 647:A59, Mass & Distance Determination)
 * - Keck Galactic Center Group (Do et al. 2019, Science 365:664)
 */

export interface BlackHoleScientificModel {
  name: string;
  designation: string;
  classification: string;
  galacticCenter: {
    system: string;
    longitudeDeg: number;       // Galactic longitude l
    latitudeDeg: number;        // Galactic latitude b
    rightAscensionJ2000: string; // RA J2000
    declinationJ2000: string;    // Dec J2000
  };
  physicalConstants: {
    G: number;                  // Gravitational constant (m^3 kg^-1 s^-2)
    c: number;                  // Speed of light (m s^-1)
    solarMassKg: number;        // M_sun in kg
    auMeters: number;           // Astronomical unit in meters
    parsecMeters: number;       // Parsec in meters
    lightYearMeters: number;    // Light-year in meters
  };
  measurements: {
    adoptedMassSolar: number;   // 4.297 x 10^6 M_sun (GRAVITY Collaboration 2021)
    massUncertaintySolar: number; // +/- 0.012 x 10^6 M_sun (stat)
    adoptedDistanceKpc: number; // 8.277 kpc (GRAVITY Collaboration 2021)
    distanceUncertaintyKpc: number; // +/- 0.033 kpc (stat + sys)
    distanceLightYears: number; // ~26,990 ly
    spinParameterAStar: number; // Dimensionless Kerr spin a* = J / (G M^2 / c)
    spinAssumption: string;
    metricAdopted: string;
    accretionDiskInclinationDeg: number; // ~30° to 50° relative to line of sight (EHT 2022)
  };
  derivedParameters: {
    massKg: number;             // M in kg
    schwarzschildRadiusM: number; // r_s = 2GM / c^2 (meters)
    schwarzschildRadiusKm: number; // r_s in kilometers
    schwarzschildRadiusAU: number; // r_s in AU
    photonSphereRadiusM: number;  // r_ph = 1.5 * r_s (meters)
    photonSphereRadiusKm: number; // r_ph in kilometers
    shadowRadiusM: number;        // r_shadow = sqrt(27)/2 * r_s (meters)
    shadowRadiusKm: number;       // r_shadow in kilometers
    shadowRadiusAU: number;       // r_shadow in AU
    shadowAngularDiameterMicroArcsec: number; // theta_shadow = 2 * r_shadow / R_0 (microarcseconds)
    iscoRadiusM: number;          // r_ISCO = 3.0 * r_s (meters)
    iscoRadiusKm: number;         // r_ISCO in kilometers
    accretionDiskInnerRadiusM: number;  // r_in = r_ISCO
    accretionDiskOuterRadiusM: number;  // r_out ~ 16.0 * r_s
    iscoOrbitalSpeedFractionC: number;  // beta = v/c at ISCO = 1 / sqrt(6) ~ 0.4082
  };
  sources: Array<{
    title: string;
    organization: string;
    url: string;
    dateVerified: string;
    citation: string;
  }>;
}

// 1. Authoritative Fundamental Physical Constants (CODATA 2018 / IAU 2015)
const G = 6.67430e-11;          // m^3 kg^-1 s^-2
const c = 2.99792458e8;         // m s^-1
const solarMassKg = 1.98847e30; // kg
const auMeters = 1.495978707e11;// m
const parsecMeters = 3.085677581e16; // m
const lightYearMeters = 9.460730472e15; // m

// 2. Authoritative Adopted Measurements (GRAVITY Collaboration 2021 & EHT 2022)
const adoptedMassSolar = 4.297e6;
const massUncertaintySolar = 0.012e6;
const adoptedDistanceKpc = 8.277;
const distanceUncertaintyKpc = 0.033;
const distanceMeters = adoptedDistanceKpc * 1000.0 * parsecMeters;
const distanceLightYears = distanceMeters / lightYearMeters; // ~26,990 ly

// 3. Derived Relativistic Dimensions
const massKg = adoptedMassSolar * solarMassKg; // 8.544455e36 kg
const schwarzschildRadiusM = (2.0 * G * massKg) / (c * c); // 1.26904e10 m (~12.69 million km)
const schwarzschildRadiusKm = schwarzschildRadiusM / 1000.0;
const schwarzschildRadiusAU = schwarzschildRadiusM / auMeters;

// Photon sphere: r_ph = 1.5 r_s = 3 GM / c^2 (for Schwarzschild metric)
const photonSphereRadiusM = 1.5 * schwarzschildRadiusM;
const photonSphereRadiusKm = photonSphereRadiusM / 1000.0;

// Apparent black hole shadow impact parameter: b_crit = sqrt(27) * GM / c^2 = (3 * sqrt(3) / 2) * r_s
const shadowRadiusM = (3.0 * Math.sqrt(3.0) / 2.0) * schwarzschildRadiusM;
const shadowRadiusKm = shadowRadiusM / 1000.0;
const shadowRadiusAU = shadowRadiusM / auMeters;

// Apparent angular shadow diameter from Earth distance R_0 (radians to microarcseconds)
const shadowAngularDiameterRad = (2.0 * shadowRadiusM) / distanceMeters;
const radToMicroArcsec = (180.0 * 3600.0 * 1e6) / Math.PI;
const shadowAngularDiameterMicroArcsec = shadowAngularDiameterRad * radToMicroArcsec; // ~53.2 uas

// Innermost Stable Circular Orbit (ISCO) for non-rotating Schwarzschild: r_ISCO = 6 GM / c^2 = 3 r_s
const iscoRadiusM = 3.0 * schwarzschildRadiusM;
const iscoRadiusKm = iscoRadiusM / 1000.0;
const iscoOrbitalSpeedFractionC = Math.sqrt(schwarzschildRadiusM / (2.0 * iscoRadiusM)); // 1/sqrt(6) ~ 0.4082

export const SAGITTARIUS_A_STAR_DATA: BlackHoleScientificModel = {
  name: 'Sagittarius A*',
  designation: 'CXOGC J174540.0-290028',
  classification: 'Supermassive Black Hole (SMBH)',
  galacticCenter: {
    system: 'Galactic Coordinate System (IAU 1958 / ICRF J2000)',
    longitudeDeg: 359.944,
    latitudeDeg: -0.046,
    rightAscensionJ2000: '17h 45m 40.0409s',
    declinationJ2000: '-29° 00′ 28.118″',
  },
  physicalConstants: {
    G,
    c,
    solarMassKg,
    auMeters,
    parsecMeters,
    lightYearMeters,
  },
  measurements: {
    adoptedMassSolar,
    massUncertaintySolar,
    adoptedDistanceKpc,
    distanceUncertaintyKpc,
    distanceLightYears,
    spinParameterAStar: 0.0, // Baseline: Schwarzschild (a* = 0). Real spin is constrained between 0.5-0.9 but uncertain.
    spinAssumption: 'Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.',
    metricAdopted: 'Schwarzschild Metric with Relativistic Null-Geodesic Integration',
    accretionDiskInclinationDeg: 42.0, // EHT 2022 constraint: ~30° to 50° relative to line of sight
  },
  derivedParameters: {
    massKg,
    schwarzschildRadiusM,
    schwarzschildRadiusKm,
    schwarzschildRadiusAU,
    photonSphereRadiusM,
    photonSphereRadiusKm,
    shadowRadiusM,
    shadowRadiusKm,
    shadowRadiusAU,
    shadowAngularDiameterMicroArcsec,
    iscoRadiusM,
    iscoRadiusKm,
    accretionDiskInnerRadiusM: iscoRadiusM,
    accretionDiskOuterRadiusM: 16.0 * schwarzschildRadiusM,
    iscoOrbitalSpeedFractionC,
  },
  sources: [
    {
      title: 'First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way',
      organization: 'Event Horizon Telescope Collaboration',
      url: 'https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/',
      dateVerified: '2026-10-13',
      citation: 'EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds.',
    },
    {
      title: 'The mass and distance of the Milky Way’s central black hole from stellar orbits',
      organization: 'GRAVITY Collaboration (ESO / MPE)',
      url: 'https://science.nasa.gov/universe/black-holes/',
      dateVerified: '2026-10-13',
      citation: 'Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc.',
    },
    {
      title: 'Black Hole Anatomy and Physics',
      organization: 'NASA Astrophysics Science Division',
      url: 'https://science.nasa.gov/universe/black-holes/anatomy/',
      dateVerified: '2026-10-13',
      citation: 'NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure.',
    },
    {
      title: 'Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole',
      organization: 'NASA Goddard Space Flight Center (SVS 14619)',
      url: 'https://svs.gsfc.nasa.gov/14619/',
      dateVerified: '2026-10-13',
      citation: 'Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing.',
    },
    {
      title: 'NASA’s Swift Catches X-ray Action at Milky Way’s Center',
      organization: 'NASA Goddard Space Flight Center',
      url: 'https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/',
      dateVerified: '2026-10-13',
      citation: 'Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares.',
    },
  ],
};

/**
 * Computes relativistic Doppler factor delta = 1 / [gamma * (1 - beta * cos(theta))].
 */
export function computeRelativisticDopplerFactor(beta: number, angleRad: number): number {
  const gamma = 1.0 / Math.sqrt(Math.max(0.001, 1.0 - beta * beta));
  return 1.0 / (gamma * (1.0 - beta * Math.cos(angleRad)));
}

/**
 * Computes gravitational redshift factor g = sqrt(1 - r_s / r).
 */
export function computeGravitationalRedshift(r: number, rs: number): number {
  if (r <= rs) return 0.0;
  return Math.sqrt(Math.max(0.0, 1.0 - rs / r));
}

export const SAGITTARIUS_A_STAR_PHYSICAL = {
  massSolarMasses: SAGITTARIUS_A_STAR_DATA.measurements.adoptedMassSolar,
  massUncertaintySolar: SAGITTARIUS_A_STAR_DATA.measurements.massUncertaintySolar,
  distanceKpc: SAGITTARIUS_A_STAR_DATA.measurements.adoptedDistanceKpc,
  distanceLy: SAGITTARIUS_A_STAR_DATA.measurements.distanceLightYears,
  massKg: SAGITTARIUS_A_STAR_DATA.derivedParameters.massKg,
};

export const SAGITTARIUS_A_STAR_DERIVED = {
  schwarzschildRadiusKm: SAGITTARIUS_A_STAR_DATA.derivedParameters.schwarzschildRadiusKm,
  schwarzschildRadiusAU: SAGITTARIUS_A_STAR_DATA.derivedParameters.schwarzschildRadiusAU,
  photonSphereRadiusKm: SAGITTARIUS_A_STAR_DATA.derivedParameters.photonSphereRadiusKm,
  shadowRadiusKm: SAGITTARIUS_A_STAR_DATA.derivedParameters.shadowRadiusKm,
  shadowRadiusAU: SAGITTARIUS_A_STAR_DATA.derivedParameters.shadowRadiusAU,
  shadowAngularDiameterMicroarcsec: SAGITTARIUS_A_STAR_DATA.derivedParameters.shadowAngularDiameterMicroArcsec,
  iscoRadiusKm: SAGITTARIUS_A_STAR_DATA.derivedParameters.iscoRadiusKm,
  iscoVelocityFractionC: SAGITTARIUS_A_STAR_DATA.derivedParameters.iscoOrbitalSpeedFractionC,
  iscoVelocityKmS: SAGITTARIUS_A_STAR_DATA.derivedParameters.iscoOrbitalSpeedFractionC * (c / 1000.0),
};
