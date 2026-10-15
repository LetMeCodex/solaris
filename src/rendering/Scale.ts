import { CelestialBodyDefinition } from '../types/catalogue';

/**
 * One scale for the whole Solar System: every globe and every orbit is drawn to true size.
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

/** Heliocentric distance (km) → render units. */
export function kmToUnits(km: number): number {
  return km * UNITS_PER_KM;
}
