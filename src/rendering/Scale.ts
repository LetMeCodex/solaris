import { CelestialBodyDefinition } from '../types/catalogue';

/**
 * One scale for the whole Solar System: every orbit is drawn to true size (and the globes too, with
 * World size set to True; by default they are drawn larger, see WORLD_SCALE).
 *
 * Earth's radius is 2.4 render units (the scale every close-up, surface view and shader was tuned
 * at), so 1 unit = 2,654.6 km and 1 AU = 56,355 units: Neptune orbits 1.7 million units out and a
 * flight there crosses real emptiness. Planets far away are far smaller than a pixel, exactly as
 * in reality; the HUD marks them so they can still be found.
 */
export const EARTH_RADIUS_UNITS = 2.4;
export const KM_PER_UNIT = 6371.0 / EARTH_RADIUS_UNITS;
export const UNITS_PER_KM = 1 / KM_PER_UNIT;
export const AU_KM = 149597870.7;
export const UNITS_PER_AU = AU_KM / KM_PER_UNIT;

/**
 * Everything beyond the Solar System (the neighbour stars, the Milky Way, Sgr A*) is drawn on its
 * own stylised scales, which were laid out for a system that ended ~700 units out. They are pushed
 * outwards by this factor so the true-scale planets and the Kuiper belt fit inside them.
 */
export const COSMIC_SCALE = 8000;

/** Camera distance of the whole-system view: the orbits out to the Kuiper belt fill the frame. */
export const SYSTEM_VIEW_DISTANCE = 75 * UNITS_PER_AU;

/** True globe radius of a body, render units. */
export function trueRadius(body: CelestialBodyDefinition): number {
  return body.physical.meanRadiusKm * UNITS_PER_KM;
}

/**
 * How much larger than life the worlds are drawn in space (a setting; the page reloads to apply).
 * Distances between the planets stay true, so a world you fly to grows from a far-off disc into
 * something enormous. The skies seen from a surface and every number on screen stay true.
 */
export const WORLD_SCALE_KEY = 'solaris.worldScale';
export const WORLD_SCALE_OPTIONS = [
  { value: 1, label: 'True size' },
  { value: 30, label: 'Grand ×30' },
  { value: 60, label: 'Colossal ×60' },
] as const;
export const DEFAULT_WORLD_SCALE = 30;
export const WORLD_SCALE: number = (() => {
  try {
    const v = Number(globalThis.localStorage?.getItem(WORLD_SCALE_KEY));
    return WORLD_SCALE_OPTIONS.some((o) => o.value === v) ? v : DEFAULT_WORLD_SCALE;
  } catch {
    return DEFAULT_WORLD_SCALE;
  }
})();
/** The Sun grows less, so its corona stays inside Mercury's orbit. */
export const SUN_SCALE = Math.min(WORLD_SCALE, 8);

/** Size multiplier of a body in space. */
export function sizeScale(body: CelestialBodyDefinition): number {
  if (body.category === 'star') return SUN_SCALE;
  if (body.category === 'black_hole') return 1;
  return WORLD_SCALE;
}

/** Globe radius as drawn in space, render units. */
export function drawnRadius(body: CelestialBodyDefinition): number {
  return trueRadius(body) * sizeScale(body);
}

/**
 * Where a moon sits from its (enlarged) planet: the inner system (rings and close moons, out to
 * four planet radii) grows with the planet; beyond that the true gap is kept, so every moon stays
 * clear of its planet and the far moons do not wander off across the Solar System.
 */
export function moonDistanceKm(distanceKm: number, parentRadiusKm: number, scale: number = WORLD_SCALE): number {
  const inner = 4 * parentRadiusKm;
  return scale * Math.min(distanceKm, inner) + Math.max(0, distanceKm - inner);
}

/** Heliocentric distance (km) → render units. */
export function kmToUnits(km: number): number {
  return km * UNITS_PER_KM;
}
