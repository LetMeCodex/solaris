import { CelestialBodyDefinition, BodyCategory } from '../types/catalogue';
import { ALL_CELESTIAL_BODIES as CORE_BODIES, SAGITTARIUS_A_STAR_DEF } from './CatalogueData';
import { buildMinorMoons } from './MinorMoons';

/** The hand-written catalogue plus every other known moon (see MinorMoons.ts). */
const ALL_CELESTIAL_BODIES = [...CORE_BODIES, ...buildMinorMoons(CORE_BODIES)];

export class CatalogueManager {
  private static bodies: CelestialBodyDefinition[] = ALL_CELESTIAL_BODIES;
  private static bodiesById: Map<string, CelestialBodyDefinition> = new Map([
    ...ALL_CELESTIAL_BODIES.map((b) => [b.id, b] as [string, CelestialBodyDefinition]),
    [SAGITTARIUS_A_STAR_DEF.id, SAGITTARIUS_A_STAR_DEF],
  ]);
  private static bodiesByName: Map<string, CelestialBodyDefinition> = new Map([
    ...ALL_CELESTIAL_BODIES.map((b) => [b.name.toLowerCase(), b] as [string, CelestialBodyDefinition]),
    ['sagittarius a*', SAGITTARIUS_A_STAR_DEF],
    ['sgr a*', SAGITTARIUS_A_STAR_DEF],
    ['sgr a', SAGITTARIUS_A_STAR_DEF],
    ['black hole', SAGITTARIUS_A_STAR_DEF],
  ]);
  private static moonsByParentId: Map<string, CelestialBodyDefinition[]> = new Map();

  static {
    // Index moons by parent ID
    for (const body of this.bodies) {
      if (body.parentId) {
        if (!this.moonsByParentId.has(body.parentId)) {
          this.moonsByParentId.set(body.parentId, []);
        }
        this.moonsByParentId.get(body.parentId)!.push(body);
      }
    }
  }

  public static getSagittariusAStar(): CelestialBodyDefinition {
    return SAGITTARIUS_A_STAR_DEF;
  }

  public static getAllBodies(): CelestialBodyDefinition[] {
    return this.bodies;
  }

  public static getBody(idOrName: string): CelestialBodyDefinition | undefined {
    return this.bodiesById.get(idOrName) || this.bodiesByName.get(idOrName.toLowerCase());
  }

  public static getParent(body: CelestialBodyDefinition): CelestialBodyDefinition | undefined {
    if (!body.parentId) return undefined;
    return this.bodiesById.get(body.parentId);
  }

  public static getMoonsOf(parentIdOrName: string): CelestialBodyDefinition[] {
    const parent = this.getBody(parentIdOrName);
    if (!parent) return [];
    return this.moonsByParentId.get(parent.id) || [];
  }

  public static getByCategory(category: BodyCategory): CelestialBodyDefinition[] {
    return this.bodies.filter((b) => b.category === category);
  }

  public static getPlanets(): CelestialBodyDefinition[] {
    return this.getByCategory('planet');
  }

  public static getMoons(): CelestialBodyDefinition[] {
    return this.getByCategory('moon');
  }

  public static getDwarfPlanets(): CelestialBodyDefinition[] {
    return this.getByCategory('dwarf_planet');
  }

  public static getAsteroids(): CelestialBodyDefinition[] {
    return this.getByCategory('asteroid');
  }

  public static search(query: string): CelestialBodyDefinition[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.bodies;
    return this.bodies.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.parentName && b.parentName.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
    );
  }

  public static getStats() {
    return {
      total: this.bodies.length,
      stars: this.getByCategory('star').length,
      planets: this.getPlanets().length,
      moons: this.getMoons().length,
      dwarfPlanets: this.getDwarfPlanets().length,
      asteroids: this.getAsteroids().length,
    };
  }
}
