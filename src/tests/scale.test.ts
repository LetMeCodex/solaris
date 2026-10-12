import { describe, it, expect } from 'vitest';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { PlanetFactory } from '../rendering/PlanetFactory';
import { CatalogueManager } from '../data/CatalogueManager';

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

  it('guarantees scale mode toggling does NOT compound visual radii across 20 alternating switches', () => {
    const transform = new RenderSpaceTransform();
    const earth = CatalogueManager.getBody('Earth')!;
    const saturn = CatalogueManager.getBody('Saturn')!;

    transform.mode = 'exploration';
    const earthExplorationRadius = transform.getVisualRadius(earth);
    const saturnExplorationRadius = transform.getVisualRadius(saturn);

    transform.mode = 'scientific';
    const earthScientificRadius = transform.getVisualRadius(earth);
    const saturnScientificRadius = transform.getVisualRadius(saturn);

    // Switch back and forth 20 times
    for (let cycle = 0; cycle < 20; cycle++) {
      transform.mode = cycle % 2 === 0 ? 'exploration' : 'scientific';
      const expectedEarthR = cycle % 2 === 0 ? earthExplorationRadius : earthScientificRadius;
      const expectedSaturnR = cycle % 2 === 0 ? saturnExplorationRadius : saturnScientificRadius;

      expect(transform.getVisualRadius(earth)).toBe(expectedEarthR);
      expect(transform.getVisualRadius(saturn)).toBe(expectedSaturnR);
    }
  });

  it('verifies PlanetFactory creates unit sphere base geometry and scales correctly without compounding', () => {
    const saturn = CatalogueManager.getBody('Saturn')!;
    const bundle = PlanetFactory.createPlanet(saturn);

    // Saturn visual radius in exploration mode
    const expectedR = PlanetFactory.getVisualRadius(saturn);
    expect(bundle.visualRadius).toBe(expectedR);

    // Geometry is unit radius (bounding sphere radius is ~1.0)
    bundle.surfaceMesh.geometry.computeBoundingSphere();
    const sphereRadius = bundle.surfaceMesh.geometry.boundingSphere!.radius;
    expect(sphereRadius).toBeCloseTo(1.0, 1);

    // Surface mesh scale reflects visualRadius and flattening
    const flattening = saturn.physical.flattening || 0;
    expect(bundle.surfaceMesh.scale.x).toBeCloseTo(expectedR, 4);
    expect(bundle.surfaceMesh.scale.y).toBeCloseTo(expectedR * (1 - flattening), 4);
    expect(bundle.surfaceMesh.scale.z).toBeCloseTo(expectedR, 4);
  });
});
