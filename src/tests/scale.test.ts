import { describe, it, expect } from 'vitest';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { PlanetFactory } from '../rendering/PlanetFactory';
import { CatalogueManager } from '../data/CatalogueManager';
import { KM_PER_UNIT, UNITS_PER_AU, COSMIC_SCALE, SYSTEM_VIEW_DISTANCE, WORLD_SCALE, SUN_SCALE, trueRadius, moonDistanceKm } from '../rendering/Scale';
import { Starfield } from '../rendering/Starfield';

describe('True distances, worlds drawn large', () => {
  it('keeps Earth at 2.4 units of true radius and converts distances linearly', () => {
    const transform = new RenderSpaceTransform();
    const earth = CatalogueManager.getBody('Earth')!;
    expect(trueRadius(earth)).toBeCloseTo(2.4, 6);
    expect(transform.getVisualRadius(earth)).toBeCloseTo(2.4 * WORLD_SCALE, 6);
    expect(KM_PER_UNIT).toBeCloseTo(2654.58, 1);
    expect(UNITS_PER_AU).toBeCloseTo(56355, 0);

    const mars = SOLAR_SYSTEM_BODIES.find((b) => b.name === 'Mars')!;
    const st = KeplerSolver.propagate(mars.orbit, 100);
    const p = transform.toRenderPosition(st.positionKm);
    expect(Math.hypot(...p) * KM_PER_UNIT).toBeCloseTo(st.distanceKm, -1);
    // Does not mutate the physical state
    expect(KeplerSolver.propagate(mars.orbit, 100).distanceKm).toBeCloseTo(st.distanceKm, 8);
  });

  it('draws every world the same multiple of its true size (the Sun a smaller one)', () => {
    const transform = new RenderSpaceTransform();
    for (const name of ['Jupiter', 'Moon', 'Phobos', 'Pluto', 'Charon']) {
      const b = CatalogueManager.getBody(name)!;
      expect(transform.getVisualRadius(b)).toBeCloseTo((b.physical.meanRadiusKm / KM_PER_UNIT) * WORLD_SCALE, 6);
    }
    const sun = CatalogueManager.getBody('Sun')!;
    expect(transform.getVisualRadius(sun)).toBeCloseTo((sun.physical.meanRadiusKm / KM_PER_UNIT) * SUN_SCALE, 6);
    // The enlarged Sun's corona (7.6 radii) stays inside Mercury's perihelion
    expect(sun.physical.meanRadiusKm * SUN_SCALE * 7.6).toBeLessThan(0.307 * 149597870.7);
    // Proportions between worlds stay true: Charon is half of Pluto
    const pluto = transform.getVisualRadius(CatalogueManager.getBody('Pluto')!);
    const charon = transform.getVisualRadius(CatalogueManager.getBody('Charon')!);
    expect(charon / pluto).toBeCloseTo(606 / 1188.3, 2);
  });

  it('keeps every moon clear of its enlarged planet, in order', () => {
    for (const planet of ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Earth', 'Pluto']) {
      const p = CatalogueManager.getBody(planet)!;
      const moons = CatalogueManager.getMoonsOf(planet).filter((m) => m.orbit.semiMajorAxisKm > 0);
      for (const m of moons) {
        const peri = m.orbit.semiMajorAxisKm * (1 - Math.min(0.99, m.orbit.eccentricity ?? 0));
        const drawnPeri = moonDistanceKm(peri, p.physical.meanRadiusKm);
        expect(drawnPeri - m.physical.meanRadiusKm * WORLD_SCALE, `${m.name}`).toBeGreaterThan(p.physical.meanRadiusKm * WORLD_SCALE);
      }
      const sorted = [...moons].sort((a, b) => a.orbit.semiMajorAxisKm - b.orbit.semiMajorAxisKm);
      for (let i = 1; i < sorted.length; i++) {
        expect(moonDistanceKm(sorted[i].orbit.semiMajorAxisKm, p.physical.meanRadiusKm)).toBeGreaterThanOrEqual(moonDistanceKm(sorted[i - 1].orbit.semiMajorAxisKm, p.physical.meanRadiusKm));
      }
    }
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
