import { CoordinateFrames } from './CoordinateFrames';

type Vec3 = [number, number, number];

/**
 * IAU rotational elements (Archinal et al. 2018, "Report of the IAU Working Group on
 * Cartographic Coordinates and Rotational Elements: 2015").
 *
 *   α0 = ra0 + raRate·T      δ0 = dec0 + decRate·T      W = w0 + wRate·d
 *
 * T = Julian centuries and d = days since J2000.0 (TDB). Small periodic terms are omitted
 * except for Neptune's pole, whose nutation term is a few tenths of a degree.
 */
export interface IauRotationModel {
  ra0: number;
  raRate?: number;
  dec0: number;
  decRate?: number;
  w0: number;
  wRate: number;
  neptuneNutation?: boolean;
}

export const IAU_ROTATION_MODELS: Record<string, IauRotationModel> = {
  Sun: { ra0: 286.13, dec0: 63.87, w0: 84.176, wRate: 14.1844 },
  Mercury: { ra0: 281.0103, raRate: -0.0328, dec0: 61.4155, decRate: -0.0049, w0: 329.5988, wRate: 6.1385108 },
  Venus: { ra0: 272.76, dec0: 67.16, w0: 160.2, wRate: -1.4813688 },
  Earth: { ra0: 0.0, raRate: -0.641, dec0: 90.0, decRate: -0.557, w0: 190.147, wRate: 360.9856235 },
  Mars: {
    ra0: 317.269202, raRate: -0.10927547, dec0: 54.432516, decRate: -0.05827105,
    w0: 176.049863, wRate: 350.891982443297,
  },
  Jupiter: { ra0: 268.056595, raRate: -0.006499, dec0: 64.495303, decRate: 0.002413, w0: 284.95, wRate: 870.536 },
  Saturn: { ra0: 40.589, raRate: -0.036, dec0: 83.537, decRate: -0.004, w0: 38.9, wRate: 810.7939024 },
  Uranus: { ra0: 257.311, dec0: -15.175, w0: 203.81, wRate: -501.1600928 },
  Neptune: { ra0: 299.36, dec0: 43.46, w0: 249.978, wRate: 541.1397757, neptuneNutation: true },
  Pluto: { ra0: 132.993, dec0: -6.163, w0: 302.695, wRate: 56.3625225 },
  Ceres: { ra0: 291.418, dec0: 66.764, w0: 170.65, wRate: 952.1532 },
  Vesta: { ra0: 309.031, dec0: 42.235, w0: 285.39, wRate: 1617.3329428 },
  Eros: { ra0: 11.35, dec0: 17.22, w0: 326.07, wRate: 1639.38864745 },
  Gaspra: { ra0: 9.47, dec0: 26.7, w0: 83.67, wRate: 1226.911485 },
  Ida: { ra0: 168.76, dec0: -87.12, w0: 274.05, wRate: 1864.628007 },
};

/**
 * Spin poles published as ecliptic (λ, β) for bodies outside the WGCCRE tables, with the
 * sidereal rotation period. Prime meridians are not defined for these, so W starts at 0.
 */
export const ECLIPTIC_POLE_MODELS: Record<string, { lambdaDeg: number; betaDeg: number; periodHours: number }> = {
  // OSIRIS-REx (Lauretta et al. 2019): retrograde, P = 4.296 h
  Bennu: { lambdaDeg: 69.92, betaDeg: -83.45, periodHours: 4.296057 },
  // Hayabusa2 (Watanabe et al. 2019): retrograde, P = 7.63 h
  Ryugu: { lambdaDeg: 179.3, betaDeg: -87.44, periodHours: 7.6326 },
};

export interface BodyFrame {
  /** Unit vectors in Three.js render coordinates. */
  xAxis: Vec3; // node of the body equator on the ICRF equator (W measured from here)
  yAxis: Vec3; // north pole
  zAxis: Vec3; // x × y
  /** Prime-meridian angle W in radians (rotation about the pole, measured from xAxis). */
  spinRad: number;
}

const DEG = Math.PI / 180.0;

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

const icrfToThree = CoordinateFrames.icrfToThree;
const raDecToIcrf = CoordinateFrames.raDecToIcrf;

/**
 * Body-fixed frame for a body with an IAU rotation model or a published ecliptic pole, or null.
 *
 * Mapping to the texture: Three.js SphereGeometry places u = 0.5 (longitude 0 of an
 * equirectangular map centred on the prime meridian) on local +X with east towards local −Z.
 * Rotating the mesh about local +Y by W therefore puts the prime meridian W east of the node.
 */
export function getBodyFrame(name: string, daysSinceJ2000: number): BodyFrame | null {
  const model = IAU_ROTATION_MODELS[name];
  if (model) {
    const T = daysSinceJ2000 / 36525.0;
    let ra = model.ra0 + (model.raRate ?? 0) * T;
    let dec = model.dec0 + (model.decRate ?? 0) * T;
    let w = model.w0 + model.wRate * daysSinceJ2000;
    if (model.neptuneNutation) {
      const N = (357.85 + 52.316 * T) * DEG;
      ra += 0.7 * Math.sin(N);
      dec -= 0.51 * Math.cos(N);
      w -= 0.48 * Math.sin(N);
    }
    const poleIcrf = raDecToIcrf(ra, dec);
    // Ascending node of the body equator on the ICRF equator lies at RA = α0 + 90°
    const nodeIcrf: Vec3 = [-Math.sin(ra * DEG), Math.cos(ra * DEG), 0];
    return buildFrame(icrfToThree(nodeIcrf), icrfToThree(poleIcrf), w * DEG);
  }

  const ecl = ECLIPTIC_POLE_MODELS[name];
  if (ecl) {
    const l = ecl.lambdaDeg * DEG;
    const b = ecl.betaDeg * DEG;
    const poleEcl: Vec3 = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
    const pole = CoordinateFrames.eclipticToThree(poleEcl);
    const eclNorth = CoordinateFrames.eclipticToThree([0, 0, 1]);
    let node = cross(eclNorth, pole);
    if (Math.hypot(...node) < 1e-6) node = [1, 0, 0];
    const spin = ((daysSinceJ2000 * 24.0) / ecl.periodHours) * 2 * Math.PI;
    return buildFrame(normalize(node), pole, spin);
  }

  return null;
}

/**
 * Body-fixed frame for a synchronously rotating moon: the pole is the orbit normal and the
 * prime meridian (texture longitude 0) faces the parent, which is the IAU convention for the
 * sub-planet point of tidally locked satellites.
 *
 * @param relPosEcl Moon position relative to its parent (J2000 ecliptic, any length unit).
 * @param relVelEcl Moon velocity relative to its parent (J2000 ecliptic).
 */
export function getSynchronousFrame(relPosEcl: Vec3, relVelEcl: Vec3): BodyFrame {
  const pos = CoordinateFrames.eclipticToThree(relPosEcl);
  const vel = CoordinateFrames.eclipticToThree(relVelEcl);
  const pole = normalize(cross(pos, vel));
  const toParent = normalize([-pos[0], -pos[1], -pos[2]]);
  return buildFrame(toParent, pole, 0);
}

function buildFrame(xAxis: Vec3, yAxis: Vec3, spinRad: number): BodyFrame {
  const y = normalize(yAxis);
  // Re-orthogonalise x against the pole
  const d = xAxis[0] * y[0] + xAxis[1] * y[1] + xAxis[2] * y[2];
  const x = normalize([xAxis[0] - d * y[0], xAxis[1] - d * y[1], xAxis[2] - d * y[2]]);
  const z = cross(x, y);
  return { xAxis: x, yAxis: y, zAxis: z, spinRad };
}

/** Sub-observer longitude helper for tests: east longitude (deg) of a direction in a body frame. */
export function bodyFixedLongitudeDeg(frame: BodyFrame, dirThree: Vec3): number {
  const dir = normalize(dirThree);
  // Body-fixed axes after spinning by W about the pole: X' = x cosW − z sinW, east = −Z'
  const c = Math.cos(frame.spinRad);
  const s = Math.sin(frame.spinRad);
  const xp: Vec3 = [
    frame.xAxis[0] * c - frame.zAxis[0] * s,
    frame.xAxis[1] * c - frame.zAxis[1] * s,
    frame.xAxis[2] * c - frame.zAxis[2] * s,
  ];
  const east = cross(frame.yAxis, xp); // pole × prime meridian = 90° east
  const lon = Math.atan2(
    dir[0] * east[0] + dir[1] * east[1] + dir[2] * east[2],
    dir[0] * xp[0] + dir[1] * xp[1] + dir[2] * xp[2]
  );
  return ((lon / DEG) % 360 + 540) % 360 - 180;
}
