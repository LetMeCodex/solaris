import { describe, it, expect } from 'vitest';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { PlanetFactory } from '../rendering/PlanetFactory';
import { CatalogueManager } from '../data/CatalogueManager';
import { KM_PER_UNIT, UNITS_PER_AU, COSMIC_SCALE, SYSTEM_VIEW_DISTANCE } from '../rendering/Scale';
import { Starfield } from '../rendering/Starfield';

describe('True scale — one unit system for globes and orbits', () => {
  it('keeps Earth at 2.4 units and converts distances linearly', () => {
    const transform = new RenderSpaceTransform();
    const earth = CatalogueManager.getBody('Earth')!;
    expect(transform.getVisualRadius(earth)).toBeCloseTo(2.4, 6);
    expect(KM_PER_UNIT).toBeCloseTo(2654.58, 1);
    expect(UNITS_PER_AU).toBeCloseTo(56355, 0);

    const mars = SOLAR_SYSTEM_BODIES.find((b) => b.name === 'Mars')!;
    const st = KeplerSolver.propagate(mars.orbit, 100);
    const p = transform.toRenderPosition(st.positionKm);
    expect(Math.hypot(...p) * KM_PER_UNIT).toBeCloseTo(st.distanceKm, -1);
    // Does not mutate the physical state
    expect(KeplerSolver.propagate(mars.orbit, 100).distanceKm).toBeCloseTo(st.distanceKm, 8);
  });

  it('sizes every globe to its true radius, the Sun included', () => {
    const transform = new RenderSpaceTransform();
    for (const name of ['Sun', 'Jupiter', 'Moon', 'Phobos', 'Pluto', 'Charon']) {
      const b = CatalogueManager.getBody(name)!;
      expect(transform.getVisualRadius(b)).toBeCloseTo(b.physical.meanRadiusKm / KM_PER_UNIT, 9);
    }
    // Charon is half of Pluto, not bigger (the old exploration buckets got this wrong)
    const pluto = transform.getVisualRadius(CatalogueManager.getBody('Pluto')!);
    const charon = transform.getVisualRadius(CatalogueManager.getBody('Charon')!);
    expect(charon / pluto).toBeCloseTo(606 / 1188.3, 2);
  });

  it('places the stars and the galaxy beyond the Kuiper belt', () => {
    const kuiperEdge = 55 * UNITS_PER_AU;
    expect(Starfield.LOCAL_STAR_OFFSET * COSMIC_SCALE).toBeGreaterThan(kuiperEdge);
    expect(Starfield.SPHERE_RADIUS * COSMIC_SCALE).toBeGreaterThan(SYSTEM_VIEW_DISTANCE * 10);
  });

  it('builds unit-sphere geometry scaled once by the visual radius', () => {
    const saturn = CatalogueManager.getBody('Saturn')!;
    const bundle = PlanetFactory.createPlanet(saturn);
    const r = PlanetFactory.getVisualRadius(saturn);
    expect(bundle.visualRadius).toBe(r);
    bundle.surfaceMesh.geometry.computeBoundingSphere();
    expect(bundle.surfaceMesh.geometry.boundingSphere!.radius).toBeCloseTo(1.0, 1);
    const f = saturn.physical.flattening || 0;
    expect(bundle.surfaceMesh.scale.y).toBeCloseTo(r * (1 - f), 4);
  });
});
