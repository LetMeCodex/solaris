import { KeplerSolver } from '../astronomy/KeplerSolver';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { getBodyFrame, getSynchronousFrame, BodyFrame } from '../astronomy/BodyOrientation';
import { CatalogueManager } from '../data/CatalogueManager';
import { CelestialBodyDefinition } from '../types/catalogue';

type Vec3 = [number, number, number];

const DEG = Math.PI / 180;
export const AU_KM = 149597870.7;

/** Geometric albedos (NASA planetary fact sheets) for apparent-magnitude estimates. */
export const GEOMETRIC_ALBEDO: Record<string, number> = {
  Mercury: 0.142, Venus: 0.689, Earth: 0.434, Moon: 0.12, Mars: 0.17, Jupiter: 0.538,
  Saturn: 0.499, Uranus: 0.488, Neptune: 0.442, Pluto: 0.52, Io: 0.63, Europa: 0.67,
  Ganymede: 0.43, Callisto: 0.22, Titan: 0.22, Phobos: 0.07, Deimos: 0.08,
};

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function gmOf(def: CelestialBodyDefinition): number | undefined {
  return def.physical.gmKm3S2 ?? (def.physical.massKg ? def.physical.massKg * 6.6743e-20 : undefined);
}

/**
 * Heliocentric J2000-ecliptic state (km, km/s) of any catalogued body at `d` days (TDB) since
 * J2000 — the same propagation the scene uses (planets: JPL secular elements; moons: elements
 * relative to the parent).
 */
export function heliocentricState(def: CelestialBodyDefinition, d: number): { pos: Vec3; vel: Vec3; relPos?: Vec3; relVel?: Vec3 } {
  if (def.orderFromSun === 0 || def.category === 'star') return { pos: [0, 0, 0], vel: [0, 0, 0] };
  if (def.category === 'moon' && def.parentId) {
    const parent = CatalogueManager.getParent(def);
    if (parent) {
      const p = heliocentricState(parent, d);
      const pg = gmOf(parent);
      const mu = pg !== undefined ? pg + (gmOf(def) ?? 0) : KeplerSolver.GM_SUN;
      const rel = KeplerSolver.propagate(def.orbit, d, mu);
      return {
        pos: add(p.pos, rel.positionKm as Vec3),
        vel: add(p.vel, rel.velocityKmPerSec as Vec3),
        relPos: rel.positionKm as Vec3,
        relVel: rel.velocityKmPerSec as Vec3,
      };
    }
  }
  const s = KeplerSolver.propagate(def.orbit, d);
  return { pos: s.positionKm as Vec3, vel: s.velocityKmPerSec as Vec3 };
}

/** Body-fixed frame (render axes) of a body at `d`, as the scene orients its globe. */
export function bodyFrameAt(def: CelestialBodyDefinition, d: number): BodyFrame | null {
  if (def.category === 'moon' && def.name !== 'Hyperion') {
    const s = heliocentricState(def, d);
    if (s.relPos && s.relVel) return getSynchronousFrame(s.relPos, s.relVel);
  }
  return getBodyFrame(def.name, d);
}

/** Local east / north / up unit vectors (render axes) at a planetocentric lat/lon. */
export function localFrame(frame: BodyFrame, latDeg: number, lonDeg: number): { east: Vec3; north: Vec3; up: Vec3 } {
  const c = Math.cos(frame.spinRad);
  const s = Math.sin(frame.spinRad);
  const xp: Vec3 = [
    frame.xAxis[0] * c - frame.zAxis[0] * s,
    frame.xAxis[1] * c - frame.zAxis[1] * s,
    frame.xAxis[2] * c - frame.zAxis[2] * s,
  ];
  const e0 = cross(frame.yAxis, xp); // east at longitude 0
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  const eq: Vec3 = [
    xp[0] * Math.cos(lon) + e0[0] * Math.sin(lon),
    xp[1] * Math.cos(lon) + e0[1] * Math.sin(lon),
    xp[2] * Math.cos(lon) + e0[2] * Math.sin(lon),
  ];
  const up = norm([
    eq[0] * Math.cos(lat) + frame.yAxis[0] * Math.sin(lat),
    eq[1] * Math.cos(lat) + frame.yAxis[1] * Math.sin(lat),
    eq[2] * Math.cos(lat) + frame.yAxis[2] * Math.sin(lat),
  ]);
  const east = norm(cross(frame.yAxis, up));
  const north = cross(up, east);
  return { east, north, up };
}

/** Altitude / azimuth (degrees, azimuth from north through east) of a render-space direction. */
export function altAz(dir: Vec3, f: { east: Vec3; north: Vec3; up: Vec3 }): { alt: number; az: number } {
  const n = norm(dir);
  const alt = Math.asin(Math.max(-1, Math.min(1, dot(n, f.up)))) / DEG;
  let az = Math.atan2(dot(n, f.east), dot(n, f.north)) / DEG;
  if (az < 0) az += 360;
  return { alt, az };
}

/** Sun elevation (degrees) at a surface point of `bodyName` at time `d` (days TDB since J2000). */
export function sunElevationAt(bodyName: string, latDeg: number, lonDeg: number, d: number): number | null {
  const def = CatalogueManager.getBody(bodyName);
  if (!def) return null;
  const frame = bodyFrameAt(def, d);
  if (!frame) return null;
  const st = heliocentricState(def, d);
  const toSun = CoordinateFrames.eclipticToThree([-st.pos[0], -st.pos[1], -st.pos[2]]);
  return altAz(toSun, localFrame(frame, latDeg, lonDeg)).alt;
}

export type TimeOfDay = 'sunrise' | 'noon' | 'sunset' | 'night';

/**
 * Next time (days TDB since J2000, at or after `d0`) when the Sun reaches the requested phase at a
 * surface point: rises/sets through −0.833° (refraction + semi-diameter, as almanacs use), noon
 * = highest, night = lowest. Scans up to one solar day of the body (≈176 d for Mercury).
 */
export function findTimeOfDay(bodyName: string, latDeg: number, lonDeg: number, d0: number, what: TimeOfDay): number | null {
  const f = (d: number) => sunElevationAt(bodyName, latDeg, lonDeg, d);
  if (f(d0) === null) return null;
  for (const span of [1.6, 3, 40, 200]) {
    const steps = 720;
    const h = span / steps;
    let prev = f(d0)!;
    let best = { d: d0, v: prev };
    let found: number | null = null;
    for (let i = 1; i <= steps && found === null; i++) {
      const d = d0 + i * h;
      const v = f(d)!;
      if (what === 'noon' ? v > best.v : what === 'night' ? v < best.v : false) best = { d, v };
      const target = -0.833;
      if (what === 'sunrise' && prev < target && v >= target) found = bisect(f, d - h, d, target);
      if (what === 'sunset' && prev > target && v <= target) found = bisect(f, d - h, d, target);
      prev = v;
    }
    if (found !== null) return found;
    if (what === 'noon' || what === 'night') {
      // Need a turning point inside the window (not at the end) to trust the extremum
      if (best.d < d0 + span * 0.97 && best.d > d0) return refineExtremum(f, best.d, h, what === 'noon');
    }
  }
  return null;
}

function bisect(f: (d: number) => number | null, a: number, b: number, target: number): number {
  let fa = f(a)! - target;
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    const fm = f(m)! - target;
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

function refineExtremum(f: (d: number) => number | null, d: number, h: number, max: boolean): number {
  let a = d - h;
  let b = d + h;
  for (let i = 0; i < 40; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    const v1 = f(m1)!;
    const v2 = f(m2)!;
    if (max ? v1 < v2 : v1 > v2) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

/**
 * Apparent visual magnitude of a sunlit body seen from `observerKm` (heliocentric, km), using
 * its geometric albedo and a Lambert-sphere phase law. Good to a few tenths for the planets.
 */
export function apparentMagnitude(name: string, radiusKm: number, bodyKm: Vec3, observerKm: Vec3): number {
  if (name === 'Sun') {
    const dAU = Math.hypot(...observerKm) / AU_KM;
    return -26.74 + 5 * Math.log10(Math.max(1e-6, dAU));
  }
  const p = GEOMETRIC_ALBEDO[name] ?? 0.15;
  const r = Math.hypot(...bodyKm); // Sun–body
  const toObs: Vec3 = [observerKm[0] - bodyKm[0], observerKm[1] - bodyKm[1], observerKm[2] - bodyKm[2]];
  const delta = Math.hypot(...toObs);
  const cosA = dot(norm([-bodyKm[0], -bodyKm[1], -bodyKm[2]]), norm(toObs));
  const alpha = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const phase = Math.max(1e-6, (Math.sin(alpha) + (Math.PI - alpha) * Math.cos(alpha)) / Math.PI);
  const flux = p * phase * (radiusKm / delta) ** 2 / (r / AU_KM) ** 2;
  return -26.74 - 2.5 * Math.log10(Math.max(1e-30, flux));
}
