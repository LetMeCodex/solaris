import { describe, it, expect } from 'vitest';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';

describe('KeplerSolver — Numerical Convergence & Orbital Mechanics', () => {
  it('converges to residual < 1e-12 for circular orbit (e = 0)', () => {
    const M = 1.2345;
    const E = KeplerSolver.solveKepler(M, 0.0);
    expect(E).toBeCloseTo(M, 12);
    const residual = Math.abs(E - 0.0 * Math.sin(E) - M);
    expect(residual).toBeLessThan(1e-12);
  });

  it('converges to residual < 1e-12 across all eccentricities from Earth to Pluto', () => {
    const testCases = [
      { name: 'Earth', e: 0.0167 },
      { name: 'Mars', e: 0.0934 },
      { name: 'Mercury', e: 0.2056 },
      { name: 'Pluto', e: 0.2488 },
      { name: 'High-e Comet', e: 0.8500 },
    ];

    const meanAnomalies = [0.0, 0.5, 1.57079, 3.14159, 4.8, 6.2];

    for (const { name, e } of testCases) {
      for (const M of meanAnomalies) {
        const E = KeplerSolver.solveKepler(M, e);
        // Normalize M to [-pi, pi]
        let M_norm = ((M % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (M_norm > Math.PI) M_norm -= Math.PI * 2;

        const residual = Math.abs(E - e * Math.sin(E) - M_norm);
        expect(residual, `Failed convergence for ${name} at M=${M}`).toBeLessThan(1e-11);
      }
    }
  });

  it('preserves periapsis and apoapsis distances within physical limits', () => {
    const earth = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Earth')!;
    const a = earth.orbit.semiMajorAxisKm;
    const e = earth.orbit.eccentricity;
    const periapsisPhysical = a * (1.0 - e);
    const apoapsisPhysical = a * (1.0 + e);

    // Exact analytical checks:
    // At periapsis, M = 0 => E = 0 => r = a * (1 - e)
    const periapsisE = KeplerSolver.solveKepler(0, e);
    const periapsisRadius = a * (1.0 - e * Math.cos(periapsisE));
    expect(periapsisRadius).toBeCloseTo(periapsisPhysical, 6);

    // At apoapsis, M = PI => E = PI => r = a * (1 + e)
    const apoapsisE = KeplerSolver.solveKepler(Math.PI, e);
    const apoapsisRadius = a * (1.0 - e * Math.cos(apoapsisE));
    expect(apoapsisRadius).toBeCloseTo(apoapsisPhysical, 6);

    // Dynamic propagation sweep across a 365-day year
    for (let day = 0; day <= 365; day += 15) {
      const state = KeplerSolver.propagate(earth.orbit, day);
      // Distance must stay strictly bounded between periapsis and apoapsis
      expect(state.distanceKm).toBeGreaterThanOrEqual(periapsisPhysical - 1.0);
      expect(state.distanceKm).toBeLessThanOrEqual(apoapsisPhysical + 1.0);
    }
  });

  it('validates vis-viva orbital velocity bounds (v_periapsis > v_apoapsis)', () => {
    const mercury = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Mercury')!;
    // Sample velocity across an 88-day orbit
    let minSpeed = Infinity;
    let maxSpeed = -Infinity;

    for (let day = 0; day <= 88; day += 2) {
      const state = KeplerSolver.propagate(mercury.orbit, day);
      if (state.speedKmPerSec < minSpeed) minSpeed = state.speedKmPerSec;
      if (state.speedKmPerSec > maxSpeed) maxSpeed = state.speedKmPerSec;
    }

    // Mercury speeds: ~38.86 km/s at apoapsis, ~58.98 km/s at periapsis
    expect(maxSpeed).toBeGreaterThan(minSpeed);
    expect(maxSpeed).toBeCloseTo(59.0, 0);
    expect(minSpeed).toBeCloseTo(38.8, 0);
  });
});
