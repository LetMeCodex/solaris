import { CelestialBodyDefinition } from '../types/catalogue';

/**
 * Exploration-mode scale model, shared by every system that places things in the compressed
 * Solar System view (planets, orbit lines, asteroid belt, HUD distance readout).
 *
 * Heliocentric distance r (AU) maps to render units as   D(r) = 50 + 65 · r^0.58
 * so that the Sun's 48-unit globe never swallows Mercury and Neptune still fits on screen.
 */
export const EXPLORATION_SUN_RADIUS = 48.0;
const OFFSET = 50.0;
const GAIN = 65.0;
const EXPONENT = 0.58;

export function explorationDistanceFromAU(rAU: number): number {
  return OFFSET + Math.pow(Math.max(0, rAU), EXPONENT) * GAIN;
}

/** Inverse of explorationDistanceFromAU (clamped at the Sun's surface offset). */
export function auFromExplorationDistance(units: number): number {
  return Math.pow(Math.max(0, units - OFFSET) / GAIN, 1.0 / EXPONENT);
}

/**
 * Exploration-mode globe radius (render units). Major bodies keep their true diameter ratios
 * relative to Earth = 2.40; the Sun is shrunk to 48 units (true ratio would be ~262) and small
 * bodies are bucketed so they remain visible.
 */
export function explorationRadius(body: CelestialBodyDefinition): number {
  if (body.category === 'star') return EXPLORATION_SUN_RADIUS;

  switch (body.name) {
    case 'Jupiter': return 26.9;  // 11.2× Earth
    case 'Saturn': return 22.68;  // 9.45× Earth
    case 'Uranus': return 9.62;   // 4.01× Earth
    case 'Neptune': return 9.32;  // 3.88× Earth
    case 'Earth': return 2.4;     // baseline
    case 'Venus': return 2.28;    // 0.95× Earth
    case 'Mars': return 1.28;     // 0.53× Earth
    case 'Mercury': return 0.92;  // 0.38× Earth
    case 'Pluto': return 0.45;    // 0.19× Earth
    default: break;
  }

  const km = body.physical.meanRadiusKm;
  if (body.category === 'moon') {
    if (km < 100) return 0.18;
    if (km < 500) return 0.32;
    if (km < 1200) return 0.48;
    if (km < 2000) return 0.65;
    return 0.95;
  }
  if (body.category === 'dwarf_planet') return 0.45;
  if (body.category === 'asteroid') {
    if (km < 10) return 0.18;
    if (km < 100) return 0.25;
    return 0.38;
  }
  return Math.max(0.18, (km / 6371.0) * 2.4);
}
