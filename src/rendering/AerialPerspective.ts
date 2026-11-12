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
