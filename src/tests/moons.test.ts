import { describe, it, expect } from 'vitest';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { CatalogueManager } from '../data/CatalogueManager';

describe('Phase 1 — Parent-Relative Moon Orbital Mechanics & GM Validation', () => {
  it('verifies Moon orbits Earth with Earth GM in ~27.32 days', () => {
    const earth = CatalogueManager.getBody('Earth')!;
    const moon = CatalogueManager.getBody('Moon')!;
    expect(earth).toBeDefined();
    expect(moon).toBeDefined();

    const parentGm = earth.physical.gmKm3S2!;
    const moonGm = moon.physical.gmKm3S2 || 0;
    const mu = parentGm + moonGm;

    // Standard analytical period T = 2 * pi * sqrt(a^3 / mu) in seconds
    const aKm = moon.orbit.semiMajorAxisKm;
    const periodSec = 2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu);
    const periodDays = periodSec / 86400.0;

    // Must match Moon sidereal period (27.32 days) to within 0.2%
    expect(periodDays).toBeCloseTo(27.32, 1);
    expect(periodDays).toBeCloseTo(moon.orbit.orbitalPeriodDays, 1);

    // Propagate over exactly 1 orbital period: mean anomaly must advance by ~360 deg
    const state0 = KeplerSolver.propagate(moon.orbit, 0, mu);
    const state1 = KeplerSolver.propagate(moon.orbit, periodDays, mu);

    // True anomaly and position must complete a full cycle
    const distDiff = Math.abs(state1.distanceKm - state0.distanceKm);
    expect(distDiff).toBeLessThan(100.0); // Within 100 km of periapsis/apoapsis tolerance
  });

  it('verifies Phobos orbits Mars with Mars GM in ~0.319 days (7.65 hours)', () => {
    const mars = CatalogueManager.getBody('Mars')!;
    const phobos = CatalogueManager.getBody('Phobos')!;

    const mu = mars.physical.gmKm3S2! + (phobos.physical.gmKm3S2 || 0);
    const aKm = phobos.orbit.semiMajorAxisKm;
    const periodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu)) / 86400.0;

    expect(periodDays).toBeCloseTo(0.3189, 3);
    expect(periodDays * 24.0).toBeCloseTo(7.65, 1); // ~7.65 hours
  });

  it('verifies Europa and Galilean moons orbit Jupiter with Jupiter GM', () => {
    const jupiter = CatalogueManager.getBody('Jupiter')!;
    const europa = CatalogueManager.getBody('Europa')!;

    const mu = jupiter.physical.gmKm3S2! + (europa.physical.gmKm3S2 || 0);
    const aKm = europa.orbit.semiMajorAxisKm;
    const periodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu)) / 86400.0;

    expect(periodDays).toBeCloseTo(3.551, 2); // ~3.55 days
  });

  it('verifies Titan orbits Saturn with Saturn GM in ~15.95 days', () => {
    const saturn = CatalogueManager.getBody('Saturn')!;
    const titan = CatalogueManager.getBody('Titan')!;

    const mu = saturn.physical.gmKm3S2! + (titan.physical.gmKm3S2 || 0);
    const aKm = titan.orbit.semiMajorAxisKm;
    const periodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu)) / 86400.0;

    expect(periodDays).toBeCloseTo(15.945, 1); // ~15.95 days
  });

  it('verifies Triton orbits Neptune with Neptune GM in ~5.88 days', () => {
    const neptune = CatalogueManager.getBody('Neptune')!;
    const triton = CatalogueManager.getBody('Triton')!;

    const mu = neptune.physical.gmKm3S2! + (triton.physical.gmKm3S2 || 0);
    const aKm = triton.orbit.semiMajorAxisKm;
    const periodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu)) / 86400.0;

    expect(periodDays).toBeCloseTo(5.877, 2);
  });

  it('verifies Charon orbits Pluto with barycentric Pluto-Charon GM in ~6.39 days', () => {
    const pluto = CatalogueManager.getBody('Pluto')!;
    const charon = CatalogueManager.getBody('Charon')!;

    const plutoGm = pluto.physical.gmKm3S2!;
    const charonGm = charon.physical.massKg! * 6.6743e-20;
    const mu = plutoGm + charonGm;

    const aKm = charon.orbit.semiMajorAxisKm;
    const periodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / mu)) / 86400.0;

    expect(periodDays).toBeCloseTo(6.387, 2);
  });

  it('verifies that substituting GM_SUN for a moon produces catastrophic error (570x faster)', () => {
    const moon = CatalogueManager.getBody('Moon')!;
    const aKm = moon.orbit.semiMajorAxisKm;
    // If Sun GM is erroneously used:
    const errPeriodDays = (2 * Math.PI * Math.sqrt(Math.pow(aKm, 3) / KeplerSolver.GM_SUN)) / 86400.0;
    // With Sun GM, period is ~0.0475 days (~1.14 hours) instead of 27.32 days!
    expect(errPeriodDays).toBeLessThan(0.1);
    expect(errPeriodDays * 24.0).toBeCloseTo(1.14, 1);
  });
});
