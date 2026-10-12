import { describe, it, expect } from 'vitest';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';

describe('SOLARIS Core Astronomical Data Integrity (Phase 1)', () => {
  it('contains the Sun and all eight major planets', () => {
    const names = SOLAR_SYSTEM_BODIES.map(b => b.name);
    expect(names).toEqual([
      'Sun',
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune'
    ]);
  });

  it('verifies strictly monotonic semi-major axes from Mercury to Neptune', () => {
    const planets = SOLAR_SYSTEM_BODIES.filter(b => b.category === 'planet');
    for (let i = 1; i < planets.length; i++) {
      expect(planets[i].orbit.semiMajorAxisAU).toBeGreaterThan(planets[i - 1].orbit.semiMajorAxisAU);
      expect(planets[i].orbit.semiMajorAxisKm).toBeGreaterThan(planets[i - 1].orbit.semiMajorAxisKm);
    }
  });

  it('validates verified physical parameters for major worlds', () => {
    const earth = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Earth')!;
    expect(earth.physical.meanRadiusKm).toBeCloseTo(6371.0, 1);
    expect(earth.physical.axialTiltDeg).toBeCloseTo(23.44, 2);

    const saturn = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Saturn')!;
    expect(saturn.physical.flattening).toBeCloseTo(0.09796, 4); // Significant oblateness
    expect(saturn.physical.axialTiltDeg).toBeCloseTo(26.73, 2);

    const uranus = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Uranus')!;
    expect(uranus.physical.axialTiltDeg).toBeGreaterThan(90); // Extreme sideways tilt
  });

  it('validates Keplerian orbital period consistency (Kepler\'s Third Law: T^2 ≈ a^3 in AU/years)', () => {
    const planets = SOLAR_SYSTEM_BODIES.filter(b => b.category === 'planet');
    for (const planet of planets) {
      const a_AU = planet.orbit.semiMajorAxisAU;
      const T_years = planet.orbit.orbitalPeriodDays / 365.256;
      // In heliocentric AU-year units: T^2 = a^3 to within small gravitational mass correction
      const ratio = (T_years * T_years) / Math.pow(a_AU, 3);
      expect(ratio).toBeCloseTo(1.0, 1); // Within 10% tolerance for first-order two-body check
    }
  });
});
