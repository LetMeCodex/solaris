import { describe, it, expect } from 'vitest';
import { KeplerSolver } from '../astronomy/KeplerSolver';
import { CatalogueManager } from '../data/CatalogueManager';

type Vec3 = [number, number, number];

function angleDeg(a: Vec3, b: Vec3): number {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const c = dot / (Math.hypot(...a) * Math.hypot(...b));
  return (Math.acos(Math.min(1, Math.max(-1, c))) * 180) / Math.PI;
}

const J2000 = 2451545.0;

/**
 * Heliocentric J2000-ecliptic planet positions (km) from a high-precision analytical ephemeris
 * (astropy 'builtin', ERFA/VSOP87-based) at two epochs: 2026-10-14.0 TDB and 2040-01-01.5 TDB.
 */
const PLANET_REFERENCE: Array<{ jd: number; positions: Record<string, Vec3> }> = [
  {
    jd: 2461327.5,
    positions: {
      Mercury: [3.739257e7, -5.163378e7, -7.649257e6],
      Venus: [1.050934e8, 2.654099e7, -5.6992e6],
      Earth: [1.399815e8, 5.176594e7, -3.573171e3],
      Mars: [-7.119798e6, 2.352986e8, 5.106005e6],
      Jupiter: [-5.332411e8, 5.88931e8, 9.479538e6],
      Saturn: [1.38242e9, 2.749971e8, -5.986579e7],
      Uranus: [1.329173e9, 2.58636e9, -7.635047e6],
      Neptune: [4.463374e9, 2.126865e8, -1.072302e8],
    },
  },
  {
    jd: 2466155.0,
    positions: {
      Mercury: [4.129735e6, -6.872768e7, -5.996536e6],
      Venus: [-1.060888e8, -1.831577e7, 5.867838e6],
      Earth: [-2.584003e7, 1.448131e8, -1.317756e4],
      Mars: [-4.442193e7, 2.343385e8, 6.000326e6],
      Jupiter: [-8.011093e8, 1.321828e8, 1.735782e7],
      Saturn: [-1.420653e9, -1.291211e8, 5.88697e7],
      Uranus: [-1.413798e9, 2.395421e9, 2.721191e7],
      Neptune: [3.778105e9, 2.36593e9, -1.35778e8],
    },
  },
];

/** JPL Horizons parent-centred J2000-ecliptic vectors (km). */
const SATELLITE_REFERENCE: Array<{ name: string; parent: string; jd: number; xyz: Vec3; tolDeg: number }> = [
  { name: 'Moon', parent: 'Earth', jd: 2461327.5, xyz: [-2.04440271e5, -3.41729969e5, -3.54869368e4], tolDeg: 2.0 },
  { name: 'Io', parent: 'Jupiter', jd: 2461327.5, xyz: [-3.71068819e5, -2.03616683e5, -1.2679739e4], tolDeg: 0.5 },
  { name: 'Callisto', parent: 'Jupiter', jd: 2461327.5, xyz: [-1.42385107e6, 1.24422428e6, 1.98073259e4], tolDeg: 0.5 },
  { name: 'Titan', parent: 'Saturn', jd: 2461327.5, xyz: [8.51502025e5, -7.72999162e5, 3.13877477e5], tolDeg: 0.5 },
  // 26.8 years before the element epoch: exercises the mean motion over ~614 orbits
  { name: 'Titan', parent: 'Saturn', jd: 2451545.0, xyz: [-9.46802938e5, 7.66868032e5, -3.02959988e5], tolDeg: 5.0 },
];

describe('Planetary ephemeris accuracy (JPL secular-rate elements)', () => {
  for (const ref of PLANET_REFERENCE) {
    for (const [name, xyz] of Object.entries(ref.positions)) {
      it(`${name} heliocentric direction at JD ${ref.jd} within 0.25°`, () => {
        const body = CatalogueManager.getBody(name)!;
        const state = KeplerSolver.propagate(body.orbit, ref.jd - J2000);
        // JPL quotes Table 1 errors of up to ~10 arcmin for Saturn over 1800–2050
        expect(angleDeg(state.positionKm, xyz)).toBeLessThan(0.25);
        // Radial distance within 0.5%
        const r = Math.hypot(...xyz);
        expect(Math.abs(state.distanceKm - r) / r).toBeLessThan(0.005);
      });
    }
  }
});

describe('Natural satellite ephemeris accuracy (JPL Horizons)', () => {
  for (const ref of SATELLITE_REFERENCE) {
    it(`${ref.name} around ${ref.parent} at JD ${ref.jd} within ${ref.tolDeg}°`, () => {
      const moon = CatalogueManager.getBody(ref.name)!;
      const parent = CatalogueManager.getBody(ref.parent)!;
      const mu = parent.physical.gmKm3S2! + (moon.physical.gmKm3S2 || 0);
      const state = KeplerSolver.propagate(moon.orbit, ref.jd - J2000, mu);
      expect(angleDeg(state.positionKm, ref.xyz)).toBeLessThan(ref.tolDeg);
    });
  }
});
