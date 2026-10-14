import { describe, it, expect } from 'vitest';
import { CatalogueManager } from '../data/CatalogueManager';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';

describe('Phase 3 Celestial Catalogue & Hierarchy', () => {
  it('contains the complete authoritative 42 bodies dataset', () => {
    const bodies = CatalogueManager.getAllBodies();
    expect(bodies.length).toBe(42);

    const stats = CatalogueManager.getStats();
    expect(stats.stars).toBe(1);
    expect(stats.planets).toBe(8);
    expect(stats.moons).toBe(22);
    expect(stats.dwarfPlanets).toBe(2);
    expect(stats.asteroids).toBe(9);
  });

  it('correctly maps natural satellites to their parent celestial bodies', () => {
    const earthMoons = CatalogueManager.getMoonsOf('Earth');
    expect(earthMoons.map((m) => m.name)).toEqual(['Moon']);

    const marsMoons = CatalogueManager.getMoonsOf('Mars');
    expect(marsMoons.map((m) => m.name)).toEqual(['Phobos', 'Deimos']);

    const jupiterMoons = CatalogueManager.getMoonsOf('Jupiter');
    expect(jupiterMoons.map((m) => m.name)).toEqual(['Io', 'Europa', 'Ganymede', 'Callisto']);

    const saturnMoons = CatalogueManager.getMoonsOf('Saturn');
    expect(saturnMoons.map((m) => m.name)).toEqual([
      'Mimas', 'Enceladus', 'Tethys', 'Dione', 'Rhea', 'Titan', 'Hyperion', 'Iapetus'
    ]);

    const uranusMoons = CatalogueManager.getMoonsOf('Uranus');
    expect(uranusMoons.map((m) => m.name)).toEqual([
      'Miranda', 'Ariel', 'Umbriel', 'Titania', 'Oberon'
    ]);

    const neptuneMoons = CatalogueManager.getMoonsOf('Neptune');
    expect(neptuneMoons.map((m) => m.name)).toEqual(['Triton']);

    const plutoMoons = CatalogueManager.getMoonsOf('Pluto');
    expect(plutoMoons.map((m) => m.name)).toEqual(['Charon']);
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

  it('verifies parent-relative moon render placement in exploration and scientific modes', () => {
    const transform = new RenderSpaceTransform();
    const earth = CatalogueManager.getBody('Earth')!;
    const moon = CatalogueManager.getBody('Moon')!;

    const parentPos: [number, number, number] = [100, 0, 50];
    const relPhysicalKm: [number, number, number] = [384400, 0, 0];

    // Exploration Mode: Moon must be placed cleanly outside Earth globe
    transform.mode = 'exploration';
    const explorationPos = transform.toMoonRenderPosition(relPhysicalKm, moon, parentPos, earth);
    const explDist = Math.hypot(
      explorationPos[0] - parentPos[0],
      explorationPos[1] - parentPos[1],
      explorationPos[2] - parentPos[2]
    );
    const earthVisualRadius = transform.getVisualRadius(earth);
    expect(explDist).toBeGreaterThan(earthVisualRadius); // Must be strictly outside Earth

    // Scientific Mode: 1 unit = 1,000,000 km, Moon is 0.3844 units from Earth
    transform.mode = 'scientific';
    const sciPos = transform.toMoonRenderPosition(relPhysicalKm, moon, parentPos, earth);
    const sciDist = Math.hypot(
      sciPos[0] - parentPos[0],
      sciPos[1] - parentPos[1],
      sciPos[2] - parentPos[2]
    );
    expect(sciDist).toBeCloseTo(0.3844, 3);
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
