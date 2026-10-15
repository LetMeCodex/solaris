import { describe, it, expect } from 'vitest';
import { CatalogueManager } from '../data/CatalogueManager';
import MOONS from '../data/moons.json';
import SMALL_BODIES from '../../public/data/small-bodies.json';

describe('Every known moon (JPL)', () => {
  it('has all of the moons JPL lists, around the right planets', () => {
    const count = (p: string) => CatalogueManager.getMoonsOf(p).filter((m) => m.category === 'moon').length;
    expect(count('Jupiter')).toBe(115);
    expect(count('Saturn')).toBeGreaterThanOrEqual(285);
    expect(count('Uranus')).toBeGreaterThanOrEqual(28);
    expect(count('Neptune')).toBe(16);
    expect(count('Pluto')).toBe(5);
    expect(count('Mars')).toBe(2);
    expect(count('Earth')).toBe(1);
  });

  it('keeps one entry per moon, with sane orbits and sizes', () => {
    const names = new Set<string>();
    for (const m of CatalogueManager.getMoons()) {
      expect(names.has(m.name)).toBe(false);
      names.add(m.name);
      expect(m.orbit.semiMajorAxisKm).toBeGreaterThan(5000);
      expect(m.orbit.eccentricity).toBeLessThan(1);
      expect(m.physical.meanRadiusKm).toBeGreaterThan(0);
      expect(m.description.length).toBeGreaterThan(20);
    }
    // Neso, the farthest moon from its planet: ~50 million km on average
    expect(CatalogueManager.getBody('Neso')!.orbit.semiMajorAxisKm).toBeGreaterThan(4e7);
    // Retrograde irregulars stay retrograde
    expect(CatalogueManager.getBody('Phoebe')!.orbit.inclinationDeg).toBeGreaterThan(90);
    expect((MOONS as { moons: unknown[] }).moons.length).toBeGreaterThan(450);
  });
});

describe('Small bodies (JPL SBDB)', () => {
  const data = SMALL_BODIES as unknown as { populations: Record<string, number[][]>; comets: unknown[][] };

  it('has every population with real elements', () => {
    const pops = data.populations;
    expect(pops.main.length).toBeGreaterThan(30000);
    expect(pops.trojan.length).toBeGreaterThan(5000);
    expect(pops.tno.length).toBeGreaterThan(5000);
    expect(data.comets.length).toBeGreaterThan(500);
    // The main belt sits between Mars and Jupiter
    const as = pops.main.map((r) => r[0]).sort((x, y) => x - y);
    expect(as[Math.floor(as.length / 2)]).toBeGreaterThan(2.2);
    expect(as[Math.floor(as.length / 2)]).toBeLessThan(3.3);
    // Trojans share Jupiter's orbit
    for (const r of pops.trojan.slice(0, 200)) expect(Math.abs(r[0] - 5.2)).toBeLessThan(0.4);
  });

  it('includes the parents of the great meteor showers', () => {
    const names: string[] = data.comets.map((c) => String(c[9]));
    for (const p of ['1P/Halley', '109P/Swift-Tuttle', '55P/Tempel-Tuttle', '2P/Encke']) {
      expect(names.some((n) => n.startsWith(p.split('/')[0] + '/'))).toBe(true);
    }
  });
});
