import { CatalogueManager } from '../../data/CatalogueManager';
import { CelestialBodyDefinition } from '../../types/catalogue';

/** The moons of the system the focused body belongs to, major ones first, then by family. */
export function systemMoons(body: string): { system: string; groups: Array<[string, CelestialBodyDefinition[]]>; count: number } {
  const def = CatalogueManager.getBody(body);
  const system = def?.category === 'moon' && def.parentName ? def.parentName : body;
  const moons = CatalogueManager.getMoonsOf(system).filter((m) => m.category === 'moon');
  const groups = new Map<string, CelestialBodyDefinition[]>();
  const label = (m: CelestialBodyDefinition) => {
    if (!m.minor) return 'Major moons';
    const g = m.group ?? '';
    if (!g || /^inner$/i.test(g) || m.orbit.semiMajorAxisKm < 1.5e6) return 'Inner moons';
    return g.replace(/ group/i, '').replace(/^\w/, (c) => c.toUpperCase()) + ' family';
  };
  for (const m of [...moons].sort((a, b) => a.orbit.semiMajorAxisKm - b.orbit.semiMajorAxisKm)) {
    const k = label(m);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(m);
  }
  const order = (k: string) => (k === 'Major moons' ? 0 : k === 'Inner moons' ? 1 : 2);
  return {
    system,
    count: moons.length,
    groups: [...groups.entries()].sort((a, b) => order(a[0]) - order(b[0]) || a[1][0].orbit.semiMajorAxisKm - b[1][0].orbit.semiMajorAxisKm),
  };
}

