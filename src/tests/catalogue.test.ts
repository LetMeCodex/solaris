import { describe, it, expect } from 'vitest';
import { moonDistanceKm } from '../rendering/Scale';
import { CatalogueManager } from '../data/CatalogueManager';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';

describe('Phase 3 Celestial Catalogue & Hierarchy', () => {
  it('contains the hand-written core bodies plus every known moon', () => {
    const stats = CatalogueManager.getStats();
    expect(stats.stars).toBe(1);
    expect(stats.planets).toBe(8);
    expect(stats.moons).toBeGreaterThan(450);
    expect(stats.dwarfPlanets).toBe(2);
    expect(stats.asteroids).toBe(9);
    // The 22 large moons keep their hand-written entries (not replaced by generated ones)
    expect(CatalogueManager.getMoons().filter((m) => !m.minor).length).toBe(22);
  });

  it('correctly maps natural satellites to their parent celestial bodies', () => {
    const names = (p: string) => CatalogueManager.getMoonsOf(p).map((m) => m.name);
    expect(names('Earth')).toEqual(['Moon']);
    expect(names('Mars')).toEqual(['Phobos', 'Deimos']);
    for (const m of ['Io', 'Europa', 'Ganymede', 'Callisto', 'Amalthea', 'Himalia', 'Metis']) expect(names('Jupiter')).toContain(m);
    for (const m of ['Mimas', 'Titan', 'Iapetus', 'Pan', 'Daphnis', 'Phoebe', 'Janus']) expect(names('Saturn')).toContain(m);
    for (const m of ['Miranda', 'Oberon', 'Puck', 'Sycorax']) expect(names('Uranus')).toContain(m);
    for (const m of ['Triton', 'Proteus', 'Nereid', 'Neso']) expect(names('Neptune')).toContain(m);
    expect(names('Pluto').sort()).toEqual(['Charon', 'Hydra', 'Kerberos', 'Nix', 'Styx']);
    for (const m of CatalogueManager.getMoons()) expect(CatalogueManager.getParent(m)?.name).toBe(m.parentName);
  });

  it('preserves valid Keplerian orbital elements for all moons and minor bodies', () => {
    const allBodies = CatalogueManager.getAllBodies();
    for (const body of allBodies) {
      if (body.category === 'star') continue;

      expect(body.orbit.semiMajorAxisKm).toBeGreaterThan(0);
      expect(body.orbit.orbitalPeriodDays).toBeGreaterThan(0);
      expect(body.orbit.eccentricity).toBeGreaterThanOrEqual(0);
      expect(body.orbit.eccentricity).toBeLessThan(1.0);
      expect(body.physical.meanRadiusKm).toBeGreaterThan(0);
    }
  });

  it('verifies clean catalogue IDs without trailing punctuation or spaces', () => {
    const allBodies = CatalogueManager.getAllBodies();
    for (const body of allBodies) {
      expect(body.id).toMatch(/^[0-9]+$/);
      expect(body.id.includes(';')).toBe(false);
      expect(body.id.trim()).toBe(body.id);
    }
  });

  it('verifies retrograde orbit for Triton (i > 90 deg)', () => {
    const triton = CatalogueManager.getBody('Triton');
    expect(triton).toBeDefined();
    expect(triton?.orbit.inclinationDeg).toBeGreaterThan(90.0);
    // J2000-ecliptic inclination from JPL Horizons (156.9° is the value relative to Neptune's equator)
    expect(triton?.orbit.inclinationDeg).toBeCloseTo(129.13, 1);
  });

  it('places moons along their true direction, pushed out with the enlarged planet', () => {
    const transform = new RenderSpaceTransform();
    const parentPos: [number, number, number] = [100, 0, 50];
    const pos = transform.toMoonRenderPosition([384400, 0, 0], parentPos, 6371);
    const dist = Math.hypot(pos[0] - parentPos[0], pos[1] - parentPos[1], pos[2] - parentPos[2]);
    expect(dist).toBeCloseTo(moonDistanceKm(384400, 6371) / (6371 / 2.4), 3);
    // Without enlargement the Moon is 60 Earth radii out
    expect(moonDistanceKm(384400, 6371, 1) / 6371).toBeCloseTo(60.3, 1);
    expect(pos[1]).toBeCloseTo(0, 9);
  });

  it('filters and searches the catalogue accurately', () => {
    const searchTitan = CatalogueManager.search('titan');
    expect(searchTitan.some((b) => b.name === 'Titan')).toBe(true);

    const exactTitan = CatalogueManager.getBody('Titan');
    expect(exactTitan?.name).toBe('Titan');
    expect(exactTitan?.category).toBe('moon');

    const searchMoons = CatalogueManager.search('moon');
    expect(searchMoons.some((b) => b.name === 'Moon')).toBe(true);

    const searchCeres = CatalogueManager.search('ceres');
    expect(searchCeres.some((b) => b.name === 'Ceres')).toBe(true);
    const ceres = CatalogueManager.getBody('Ceres');
    expect(ceres?.category).toBe('dwarf_planet');
  });
});
