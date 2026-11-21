/**
 * The air between the eye and the ground, shared by Google's 3D tiles (PhotorealEarth) and the
 * globe under them (EarthMaterial), so the two always match.
 *
 * What makes a mountain range look as big as it is, is mostly the air in front of it: far ridges
 * lose contrast and turn blue-grey, the nearest stay dark and crisp. Without that the Himalaya read
 * as a model on a table. Real values, per colour:
 *  - Rayleigh (the molecules): extinction at sea level 5.8 / 13.5 / 33.1 per 1000 km for red,
 *    green and blue, so distance turns blue; scale height 8 km;
 *  - Mie (dust, water, smoke): ~0.012-0.06 per km at the ground by the day's visibility, thicker
 *    morning and evening (the golden-hour mist), scale height ~1-1.5 km; it scatters forward, so
 *    looking towards a low Sun the air itself glows warm round it (Henyey-Greenstein, g 0.76).
 * The path is taken at its mean height (eye and ground), which is close enough for a frame.
 */
import * as THREE from 'three';

/**
 * The night's own light, shared by every material that draws the ground or the air (set once a
 * frame by the scene from where the Moon really is and how much of it is lit):
 *  - NIGHT_AIR: the glow of the air itself after dark (starlight, airglow and, above all, the
 *    Moon's light scattered in the haze);
 *  - MOON_LIGHT: the Moon's light on the ground (colour x strength, 0 with the Moon down or new);
 *  - MOON_DIR: towards the Moon (world), for its glitter on water.
 * Strengths are for the eye adapted to the dark (as a night photograph or a film's night is), not
 * the photometric 1/400,000 of sunlight: a full Moon lights the land enough to see it clearly.
 */
export const NIGHT_AIR = { value: new THREE.Vector3(0.02, 0.026, 0.045) };
export const MOON_LIGHT = { value: new THREE.Vector3(0, 0, 0) };
export const MOON_DIR = { value: new THREE.Vector3(0, 1, 0) };

/**
 * Shared star & Milky Way visibility multiplier (0 = fully drowned out by sunlit daytime sky,
 * 1 = full deep-space / night visibility). Bound by CatalogueStars, MilkyWayVolume, and
 * MilkyWayGalaxy; driven by JetController, SkyAtmosphere, and AtmosphereShader.
 */
export const SKY_STAR_VISIBILITY = { value: 1 };

/**
 * Shared Earth overcast / storm cloud cover (0 = clear blue sky, 1 = heavy storm deck).
 * Driven by Weather when precipitation is active so rain/snow never falls out of a bright sunny sky.
 */
export const SKY_OVERCAST = { value: 0 };

interface StarVisSource {
  value: number;
  isActive: () => boolean;
}

const starVisSources = new Map<string, StarVisSource>();

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Physical atmospheric star & Milky Way visibility from observer altitude, atmospheric scale height,
 * local solar elevation (sin of altitude above horizon), and optional cloud overcast (0..1).
 */
export function computeAtmosphericStarVisibility(params: {
  altKm: number;
  scaleHeightKm: number;
  topKm: number;
  sunUp: number;
  overcast?: number;
}): number {
  const { altKm, scaleHeightKm, topKm, sunUp, overcast = 0 } = params;
  if (scaleHeightKm <= 0 || topKm <= 0) return 1;
  if (altKm >= topKm) return 1;
  const clampedAlt = Math.max(0, altKm);
  // Smooth fade across nautical/civil twilight (-10° to +2.5° solar elevation).
  const daylight = smoothstep(-0.18, 0.04, sunUp);
  // Stars stay drowned out through troposphere & lower stratosphere (~0-20 km on Earth),
  // smoothly emerging through upper stratosphere & mesosphere (~22-60 km on Earth) to space.
  const scaleHeights = clampedAlt / scaleHeightKm;
  const altEmergence = Math.max(
    smoothstep(2.4, 6.8, scaleHeights),
    smoothstep(0.60, 0.92, clampedAlt / topKm),
  );
  let vis = 1 - daylight * (1 - altEmergence);
  if (overcast > 0.001) {
    const belowClouds = 1 - smoothstep(6, 14, clampedAlt);
    vis *= 1 - Math.min(1, overcast) * belowClouds * 0.92;
  }
  return Math.max(0, Math.min(1, vis));
}

/** Recompute SKY_STAR_VISIBILITY from all currently active atmosphere sources. */
export function refreshSkyStarVisibility(): number {
  let vis = 1;
  for (const src of starVisSources.values()) {
    if (src.isActive()) {
      vis = Math.min(vis, src.value);
    }
  }
  SKY_STAR_VISIBILITY.value = vis;
  return vis;
}

/**
 * Register or update a sky-extinction source ('jet', 'surface', 'atmosphere').
 * `isActive` guards against stale values when that renderer or flight mode is disabled.
 */
export function setSkyStarVisibility(
  source: string,
  visibility: number,
  isActive: () => boolean = () => true,
): number {
  const clamped = Math.max(0, Math.min(1, visibility));
  starVisSources.set(source, { value: clamped, isActive });
  return refreshSkyStarVisibility();
}

/** Clear a sky-extinction source (e.g. on dispose or mode exit). */
export function clearSkyStarVisibility(source: string): number {
  starVisSources.delete(source);
  return refreshSkyStarVisibility();
}

/** Set shared Earth sky overcast factor (0 = clear sky, 1 = heavy storm cloud deck). */
export function setSkyOvercast(amount: number): void {
  SKY_OVERCAST.value = Math.max(0, Math.min(1, amount));
}

export const AERIAL_PERSPECTIVE_GLSL = /* glsl */ `
uniform vec3 uNightAir;
uniform vec3 uMoonLight;
uniform vec3 uMoonDir;
vec3 apSky(float sunUp) {
  vec3 skyDay = vec3(0.42, 0.58, 0.86);
  vec3 skyLow = vec3(0.95, 0.58, 0.36);
  return mix(vec3(0.012, 0.018, 0.04), mix(skyLow, skyDay, smoothstep(0.02, 0.30, sunUp)), smoothstep(-0.14, 0.04, sunUp));
}
// col: the surface as lit; distKm: to the eye; hMeanKm: mean height of the path; haze: 1 clear air,
// up to ~4.5 in poor visibility; toEye: unit vector from the point to the eye; sunDir: unit, to the
// Sun; sunUp: the Sun's height (sine) at the point
vec3 aerialPerspective(vec3 col, float distKm, float hMeanKm, float haze, vec3 toEye, vec3 sunDir, float sunUp) {
  float low = 1.0 - smoothstep(0.04, 0.38, sunUp);
  float lit = smoothstep(-0.12, 0.06, sunUp);
  vec3 betaR = vec3(0.0058, 0.0135, 0.0331);
  // The golden-hour mist: thick in the low light of morning and evening
  float betaM = (0.010 + 0.022 * haze) * (1.0 + 4.5 * low * lit);
  float hM = mix(1.5, 0.8, low);
  vec3 odR = distKm * betaR * exp(-hMeanKm / 8.0);
  float odM = distKm * betaM * exp(-hMeanKm / hM);
  vec3 od = odR + vec3(odM);
  vec3 trans = exp(-od);
  float mu = dot(-toEye, sunDir);
  float g = 0.76;
  float hg = (1.0 - g * g) / (12.566 * pow(max(1.0 + g * g - 2.0 * g * mu, 1e-4), 1.5));
  vec3 sunC = mix(vec3(1.0, 0.6, 0.34), vec3(1.0, 0.95, 0.88), smoothstep(0.04, 0.4, sunUp));
  // The molecules scatter the sky's blue; dust and water scatter a near-white (warm with a low
  // Sun), brightest towards the Sun: each in proportion to its share of the haze
  // After dark the haze glows only with the night's light (mostly the Moon's, cool and blue):
  // it used to keep a quarter of its warm daytime glow, and at night the whole land dissolved
  // into a flat brown fog
  vec3 shareR = odR / max(od, vec3(1e-6));
  vec3 aerosol = mix(vec3(0.66, 0.69, 0.74), vec3(0.92, 0.74, 0.6), low) * lit + uNightAir;
  vec3 inscat = mix(aerosol + sunC * hg * 2.4 * lit, apSky(sunUp) * (0.7 + 0.3 * lit) + uNightAir * 0.8, shareR);
  return col * trans + inscat * (1.0 - trans);
}
`;
