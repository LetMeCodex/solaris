import { CelestialBodyDefinition, BodyCategory } from '../types/catalogue';
import { ALL_CELESTIAL_BODIES as CORE_BODIES, SAGITTARIUS_A_STAR_DEF } from './CatalogueData';
import { buildMinorMoons } from './MinorMoons';
import {
  NASA_SPACECRAFT_CATALOG,
  NASA_EXTRA_CELESTIAL_BODIES,
  NASA_SMALL_BODY_MODELS,
  NASA_MISSION_EVENTS,
  NasaSpacecraftEntry,
  NasaMissionEvent,
  spacecraftToCelestialDef,
} from './NasaEyesCatalog';

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

  // ---- NASA Eyes Spacecraft & Small-Body Extensions ----

  private static spacecraftDefs: CelestialBodyDefinition[] = NASA_SPACECRAFT_CATALOG.map(spacecraftToCelestialDef);
  private static nasaExtraById: Map<string, CelestialBodyDefinition> = new Map(
    NASA_EXTRA_CELESTIAL_BODIES.map((b) => [b.id.toLowerCase(), b] as [string, CelestialBodyDefinition])
  );
  private static nasaExtraByName: Map<string, CelestialBodyDefinition> = new Map(
    NASA_EXTRA_CELESTIAL_BODIES.map((b) => [b.name.toLowerCase(), b] as [string, CelestialBodyDefinition])
  );
  private static spacecraftByKey: Map<string, NasaSpacecraftEntry> = (() => {
    const map = new Map<string, NasaSpacecraftEntry>();
    for (const sc of NASA_SPACECRAFT_CATALOG) {
      map.set(sc.id.toLowerCase(), sc);
      map.set(sc.name.toLowerCase(), sc);
      if (!map.has(sc.shortName.toLowerCase())) {
        map.set(sc.shortName.toLowerCase(), sc);
      }
    }
    return map;
  })();
  private static spacecraftDefByKey: Map<string, CelestialBodyDefinition> = (() => {
    const map = new Map<string, CelestialBodyDefinition>();
    for (const def of CatalogueManager.spacecraftDefs) {
      map.set(def.id.toLowerCase(), def);
      map.set(def.name.toLowerCase(), def);
    }
    return map;
  })();
  private static smallBodyModelByKey: Map<string, string> = (() => {
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(NASA_SMALL_BODY_MODELS)) {
      map.set(k.toLowerCase(), v);
    }
    return map;
  })();

  public static getSpacecraftCatalog(): NasaSpacecraftEntry[] {
    return NASA_SPACECRAFT_CATALOG;
  }

  public static getSpacecraftDefs(): CelestialBodyDefinition[] {
    return this.spacecraftDefs;
  }

  public static getSpacecraftEntry(idOrName: string): NasaSpacecraftEntry | undefined {
    return this.spacecraftByKey.get(idOrName.toLowerCase());
  }

  public static getSpacecraftByTarget(hostName: string): NasaSpacecraftEntry[] {
    const h = hostName.toLowerCase();
    return NASA_SPACECRAFT_CATALOG.filter(
      (sc) =>
        sc.hostBody.toLowerCase() === h ||
        sc.hostBody.toLowerCase().includes(h) ||
        sc.fallbackOrbit?.parentBody.toLowerCase() === h ||
        sc.surfaceSite?.body.toLowerCase() === h
    );
  }

  public static getNasaCelestialBodies(): CelestialBodyDefinition[] {
    return NASA_EXTRA_CELESTIAL_BODIES;
  }

  /** Core catalog bodies plus NASA Eyes extra named asteroids & Kuiper objects rendered in 3D. */
  public static getSceneBodies(): CelestialBodyDefinition[] {
    return [...this.bodies, ...NASA_EXTRA_CELESTIAL_BODIES];
  }

  public static getSmallBodyModelPath(bodyNameOrId: string): string | undefined {
    return this.smallBodyModelByKey.get(bodyNameOrId.toLowerCase());
  }

  public static getMissionEvents(): NasaMissionEvent[] {
    return NASA_MISSION_EVENTS;
  }

  /** Resolves core bodies first, then NASA extra small bodies, then NASA spacecraft definitions. */
  public static resolveAnyBody(idOrName: string): CelestialBodyDefinition | undefined {
    const core = this.getBody(idOrName);
    if (core) return core;
    const key = idOrName.toLowerCase();
    return this.nasaExtraById.get(key) || this.nasaExtraByName.get(key) || this.spacecraftDefByKey.get(key);
  }
}
