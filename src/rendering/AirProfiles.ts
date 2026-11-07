/**
 * The air of the worlds that have it, from measurements.
 *
 * Scale heights and surface densities are measured values (density relative to Earth's sea level,
 * 1.225 kg/m3). The scattering coefficients are those at each world's own surface (or cloud deck
 * for the giants), per km: Rayleigh for red/green/blue, a Mie (haze, dust, droplets) coefficient
 * and its tint, and an absorption term for Earth's ozone, the ice giants' methane and Titan's
 * smog. One table drives the atmospheres drawn from space (AtmosphereShader) and the jet's air.
 */
export interface AirProfile {
  /** Density scale height, km. */
  scaleHeightKm: number;
  /** Where the sky ends for flight and drawing, km above the surface. */
  topKm: number;
  /** Surface (or cloud-deck) density relative to Earth sea level. */
  surfaceDensity: number;
  /** Rayleigh scattering per km at the surface, RGB. */
  rayleigh: [number, number, number];
  /** Mie scattering per km at the surface and its colour. */
  mie: number;
  mieTint: [number, number, number];
  /** Mie scale height, km (haze and dust sit lower than the gas). */
  mieScaleHeightKm: number;
  /** Mie forward-scattering asymmetry. */
  mieG: number;
  /** Absorption per km at the surface, RGB (methane, smog). */
  absorption: [number, number, number];
  /** Speed of sound at the surface, m/s (for the Mach readout). */
  soundMps: number;
}

export const AIR: Record<string, AirProfile> = {
  Earth: {
    scaleHeightKm: 8.5, topKm: 100, surfaceDensity: 1,
    rayleigh: [5.8e-3, 13.5e-3, 33.1e-3], mie: 4e-3, mieTint: [1, 1, 1], mieScaleHeightKm: 1.2, mieG: 0.76,
    absorption: [0.65e-3, 1.88e-3, 0.085e-3], soundMps: 343,
  },
  Mars: {
    scaleHeightKm: 11.1, topKm: 80, surfaceDensity: 0.0163,
    rayleigh: [19.9e-3, 13.6e-3, 5.75e-3], mie: 8e-3, mieTint: [1.0, 0.62, 0.38], mieScaleHeightKm: 11, mieG: 0.65,
    absorption: [0, 0, 0], soundMps: 240,
  },
  Venus: {
    scaleHeightKm: 15.9, topKm: 250, surfaceDensity: 54.4,
    rayleigh: [0.9e-3, 0.75e-3, 0.45e-3], mie: 2.5e-3, mieTint: [1.0, 0.86, 0.55], mieScaleHeightKm: 15.9, mieG: 0.7,
    absorption: [0.02e-3, 0.06e-3, 0.18e-3], soundMps: 410,
  },
  Titan: {
    scaleHeightKm: 21, topKm: 600, surfaceDensity: 4.4,
    rayleigh: [0.25e-3, 0.4e-3, 0.8e-3], mie: 0.55e-3, mieTint: [1.0, 0.62, 0.25], mieScaleHeightKm: 40, mieG: 0.6,
    absorption: [0.02e-3, 0.09e-3, 0.3e-3], soundMps: 194,
  },
  Jupiter: {
    scaleHeightKm: 27, topKm: 350, surfaceDensity: 0.13,
    rayleigh: [0.7e-3, 1.5e-3, 3.4e-3], mie: 0.6e-3, mieTint: [1.0, 0.9, 0.75], mieScaleHeightKm: 20, mieG: 0.7,
    absorption: [0, 0, 0], soundMps: 1000,
  },
  Saturn: {
    scaleHeightKm: 59.5, topKm: 600, surfaceDensity: 0.16,
    rayleigh: [0.5e-3, 1.1e-3, 2.2e-3], mie: 0.4e-3, mieTint: [1.0, 0.92, 0.7], mieScaleHeightKm: 45, mieG: 0.7,
    absorption: [0, 0, 0], soundMps: 800,
  },
  Uranus: {
    scaleHeightKm: 27.7, topKm: 400, surfaceDensity: 0.34,
    rayleigh: [0.8e-3, 1.8e-3, 3.8e-3], mie: 0.25e-3, mieTint: [0.85, 1.0, 1.0], mieScaleHeightKm: 25, mieG: 0.7,
    absorption: [1.2e-3, 0.15e-3, 0.05e-3], soundMps: 900,
  },
  Neptune: {
    scaleHeightKm: 19.7, topKm: 300, surfaceDensity: 0.45,
    rayleigh: [0.85e-3, 1.9e-3, 4e-3], mie: 0.25e-3, mieTint: [0.8, 0.95, 1.0], mieScaleHeightKm: 20, mieG: 0.7,
    absorption: [1.5e-3, 0.2e-3, 0.04e-3], soundMps: 900,
  },
};

