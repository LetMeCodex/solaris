import { describe, it, expect } from 'vitest';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { KeplerSolver } from '../astronomy/KeplerSolver';

describe('RenderSpaceTransform — Physical/Render State Strict Separation', () => {
  it('guarantees that switching scale mode does NOT mutate physical orbital elements or states', () => {
    const transform = new RenderSpaceTransform();
    const mars = SOLAR_SYSTEM_BODIES.find(b => b.name === 'Mars')!;

    // Initial physical state
    const originalSemiMajorAxisKm = mars.orbit.semiMajorAxisKm;
    const originalEccentricity = mars.orbit.eccentricity;
    const physicalStateBefore = KeplerSolver.propagate(mars.orbit, 100);

    // Toggle to Exploration Mode
    transform.mode = 'exploration';
    const renderPosExploration = transform.toRenderPosition(physicalStateBefore.positionKm, mars);

    // Toggle to Scientific 1:1 Mode
    transform.mode = 'scientific';
    const renderPosScientific = transform.toRenderPosition(physicalStateBefore.positionKm, mars);

    // Physical state after
    const physicalStateAfter = KeplerSolver.propagate(mars.orbit, 100);

    // 1. Authoritative physical orbital elements remain completely unmutated
    expect(mars.orbit.semiMajorAxisKm).toBe(originalSemiMajorAxisKm);
    expect(mars.orbit.eccentricity).toBe(originalEccentricity);

    // 2. Authoritative physical distance and speed remain identical
    expect(physicalStateAfter.distanceKm).toBeCloseTo(physicalStateBefore.distanceKm, 10);
    expect(physicalStateAfter.speedKmPerSec).toBeCloseTo(physicalStateBefore.speedKmPerSec, 10);

    // 3. Render-space coordinates change as expected for visual navigation
    expect(renderPosExploration[0]).not.toBe(renderPosScientific[0]);
    // Scientific scale uses 1 unit = 1,000,000 km
    expect(renderPosScientific[0]).toBeCloseTo(physicalStateBefore.positionKm[0] / 1000000.0, 3);
  });
});
