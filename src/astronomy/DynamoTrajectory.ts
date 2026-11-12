import * as THREE from 'three';
import { CoordinateFrames } from './CoordinateFrames';
import { KeplerSolver } from './KeplerSolver';
import { moonDistanceKm, UNITS_PER_KM, WORLD_SCALE } from '../rendering/Scale';
import {
  NASA_EXTRA_ASSETS,
  NasaSpacecraftEntry,
  NasaTrajectorySegment,
} from '../data/NasaEyesCatalog';

export type DynKind = 'orb' | 'pos' | 'quat' | 'ori' | 'lin';

export interface ParsedOrbSegment {
  kind: 'orb';
  version: number;
  gmKm3S2: number;
  inline: boolean;
  count: number;
  tMinSec: number;
  tMaxSec: number;
  /** Packed stride-9 floats: [t0, aKm, ecc, nRadS, M0Rad, qw, qx, qy, qz] */
  data: Float64Array;
}

export interface ParsedPosSegment {
  kind: 'pos';
  version: number;
  inline: boolean;
  count: number;
  tMinSec: number;
  tMaxSec: number;
  /** Packed stride-7 floats: [t, xKm, yKm, zKm, vxKmS, vyKmS, vzKmS] */
  data: Float64Array;
}

export interface ParsedQuatSegment {
  kind: 'quat';
  version: number;
  inline: boolean;
  count: number;
  tMinSec: number;
  tMaxSec: number;
  /** Packed stride-5 floats: [t, qw, qx, qy, qz] */
  data: Float64Array;
}

export interface ParsedManifestSegment {
  kind: 'ori' | 'lin';
  version: number;
  inline: false;
  count: number;
  tMinSec: number;
  tMaxSec: number;
}

export type ParsedDynSegment =
  | ParsedOrbSegment
  | ParsedPosSegment
  | ParsedQuatSegment
  | ParsedManifestSegment;

export interface DynStateVector {
  positionKm: [number, number, number];
  velocityKmS: [number, number, number];
}

export interface SpacecraftSceneEval {
  worldPosition: THREE.Vector3;
  worldVelocityUnitsS: THREE.Vector3;
  attitude: THREE.Quaternion | null;
  activeModelPath: string;
  activeSource: 'dyn-orb' | 'dyn-pos' | 'surface' | 'halo' | 'kepler';
  parentName: string;
  clearanceUnits: number;
  isSurfaceMounted: boolean;
}

export interface ParentResolver {
  getWorldPosition(nameOrId: string, out?: THREE.Vector3): THREE.Vector3 | null;
  getPhysicalRadiusKm(nameOrId: string): number;
  getVisualRadius(nameOrId: string): number;
  getSurfaceObject(nameOrId: string): THREE.Object3D | null;
  getGravitationalParameterKm3S2?(nameOrId: string): number | null;
  getSpacecraftWorldPosition?(scId: string, out?: THREE.Vector3): THREE.Vector3 | null;
}

/** Resolves the central body's GM (km^3/s^2) for fallback two-body propagation, avoiding Sun-GM speeds on planet orbiters. */
function resolveFallbackParentGmKm3S2(
  fb: NonNullable<NasaSpacecraftEntry['fallbackOrbit']>,
  resolver: ParentResolver
): number {
  const resolved = resolver.getGravitationalParameterKm3S2?.(fb.parentBody);
  if (resolved !== null && resolved !== undefined && Number.isFinite(resolved) && resolved > 0) {
    return resolved;
  }
  if (fb.parentBody.trim().toLowerCase() === 'sun') {
    return KeplerSolver.GM_SUN;
  }
  if (fb.periodDays > 0 && fb.semiMajorAxisKm > 0) {
    const nRadS = (Math.PI * 2) / (fb.periodDays * 86400);
    return nRadS * nRadS * Math.pow(fb.semiMajorAxisKm, 3);
  }
  return KeplerSolver.GM_SUN;
}

const J2000_JD = 2451545.0;
const DEG2RAD = Math.PI / 180;

/** Epoch cutoffs (J2000 TDB seconds) when stowed/cruise models deploy or land. */
const VARIANT_DEPLOY_SEC: Record<string, number> = {
  sc_jwst: 694872000, // 2022-01-08 sunshield + mirror fully deployed
  sc_insight: 596505600, // 2018-11-26 Mars Elysium landing
  sc_mars_2020: 666883200, // 2021-02-18 Jezero landing
  sc_mars_exploration_rover_1: 126446400, // 2004-01-04 Spirit Gusev landing
  sc_mars_exploration_rover_2: 128260800, // 2004-01-25 Opportunity Meridiani landing
  sc_mars_science_laboratory: 397440000, // 2012-08-06 Curiosity Gale landing
  sc_phoenix: 264988800, // 2008-05-25 Vastitas Borealis landing
};

/** Maps NASA .dyn parentId tokens to Solaris / catalogue body identifiers. */
export const NASA_PARENT_ID_MAP: Record<string, string> = {
  sun: 'Sun',
  mercury: 'Mercury',
  venus: 'Venus',
  earth: 'Earth',
  moon: 'Moon',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
  io: 'Io',
  europa: 'Europa',
  ganymede: 'Ganymede',
  titan: 'Titan',
  '1_ceres': 'Ceres',
  '4_vesta': 'Vesta',
  '16_psyche': 'Psyche',
  '433_eros': 'Eros',
  '101955_bennu': 'Bennu',
  '65803_didymos': 'Didymos',
  '99942_apophis': 'Apophis',
  '486958_arrokoth': 'Arrokoth',
  '67p_churyumov_gerasimenko': '67P/Churyumov-Gerasimenko',
  '103p_hartley_2': '103P/Hartley 2',
  '19p_borrelly': '19P/Borrelly',
  '9p_tempel_1': '9P/Tempel 1',
  galileo: 'sc_galileo',
  sc_osiris_rex: 'sc_osiris_rex',
};

// Pure orthonormal basis converting ICRF direction/attitude vectors into Three.js Y-up space.
const ICRF_TO_THREE_QUAT = (() => {
  const bx = CoordinateFrames.icrfToThree([1, 0, 0]);
  const by = CoordinateFrames.icrfToThree([0, 1, 0]);
  const bz = CoordinateFrames.icrfToThree([0, 0, 1]);
  const m = new THREE.Matrix4().makeBasis(
    new THREE.Vector3(bx[0], bx[1], bx[2]).normalize(),
    new THREE.Vector3(by[0], by[1], by[2]).normalize(),
    new THREE.Vector3(bz[0], bz[1], bz[2]).normalize()
  );
  return new THREE.Quaternion().setFromRotationMatrix(m).normalize();
})();

export function jdTdbToJ2000Sec(jdTDB: number): number {
  return (jdTDB - J2000_JD) * 86400;
}

export function j2000SecToJdTdb(tSec: number): number {
  return J2000_JD + tSec / 86400;
}

/**
 * Parses a raw NASA Eyes `.dyn` v2 binary buffer into typed Float64 packed tables.
 */
export function parseDynBuffer(buffer: ArrayBuffer): ParsedDynSegment | null {
  if (buffer.byteLength < 12) return null;
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const version = view.getUint16(0, true);
  if (version !== 2) return null;

  let nul = -1;
  for (let i = 2; i < Math.min(32, bytes.length); i++) {
    if (bytes[i] === 0) {
      nul = i;
      break;
    }
  }
  if (nul < 3) return null;

  let kindStr = '';
  for (let i = 2; i < nul; i++) {
    kindStr += String.fromCharCode(bytes[i]);
  }
  const off = nul + 1;

  if (kindStr === 'orb') {
    if (off + 22 > buffer.byteLength) return null;
    const gmKm3S2 = view.getFloat64(off + 9, true);
    const flag = bytes[off + 17];
    const count = view.getUint32(off + 18, true);
    if (flag !== 1 || count === 0 || off + 22 + count * 72 > buffer.byteLength) {
      let tMinSec = 0;
      let tMaxSec = 0;
      if (count > 0 && off + 22 + count * 8 <= buffer.byteLength) {
        tMinSec = view.getFloat64(off + 22, true);
        tMaxSec = view.getFloat64(off + 22 + (count - 1) * 8, true);
      }
      return {
        kind: 'orb',
        version,
        gmKm3S2,
        inline: false,
        count,
        tMinSec,
        tMaxSec,
        data: new Float64Array(0),
      };
    }
    const data = new Float64Array(count * 9);
    let ptr = off + 22;
    for (let i = 0; i < count; i++) {
      const base = i * 9;
      for (let j = 0; j < 9; j++) {
        data[base + j] = view.getFloat64(ptr + j * 8, true);
      }
      ptr += 72;
    }
    return {
      kind: 'orb',
      version,
      gmKm3S2,
      inline: true,
      count,
      tMinSec: data[0],
      tMaxSec: data[(count - 1) * 9],
      data,
    };
  }

  if (kindStr === 'pos') {
    if (off + 6 > buffer.byteLength) return null;
    const flag = bytes[off + 1];
    const count = view.getUint32(off + 2, true);
    if (flag !== 1 || count === 0 || off + 6 + count * 56 > buffer.byteLength) {
      let tMinSec = 0;
      let tMaxSec = 0;
      if (count > 0 && off + 6 + count * 8 <= buffer.byteLength) {
        tMinSec = view.getFloat64(off + 6, true);
        tMaxSec = view.getFloat64(off + 6 + (count - 1) * 8, true);
      }
      return {
        kind: 'pos',
        version,
        inline: false,
        count,
        tMinSec,
        tMaxSec,
        data: new Float64Array(0),
      };
    }
    const data = new Float64Array(count * 7);
    let ptr = off + 6;
    for (let i = 0; i < count; i++) {
      const base = i * 7;
      for (let j = 0; j < 7; j++) {
        data[base + j] = view.getFloat64(ptr + j * 8, true);
      }
      ptr += 56;
    }
    return {
      kind: 'pos',
      version,
      inline: true,
      count,
      tMinSec: data[0],
      tMaxSec: data[(count - 1) * 7],
      data,
    };
  }

  if (kindStr === 'quat') {
    if (off + 6 > buffer.byteLength) return null;
    const flag = bytes[off + 1];
    const count = view.getUint32(off + 2, true);
    if (flag !== 1 || count === 0 || off + 6 + count * 40 > buffer.byteLength) {
      return {
        kind: 'quat',
        version,
        inline: false,
        count,
        tMinSec: 0,
        tMaxSec: 0,
        data: new Float64Array(0),
      };
    }
    const data = new Float64Array(count * 5);
    let ptr = off + 6;
    for (let i = 0; i < count; i++) {
      const base = i * 5;
      for (let j = 0; j < 5; j++) {
        data[base + j] = view.getFloat64(ptr + j * 8, true);
      }
      ptr += 40;
    }
    return {
      kind: 'quat',
      version,
      inline: true,
      count,
      tMinSec: data[0],
      tMaxSec: data[(count - 1) * 5],
      data,
    };
  }

  if (kindStr === 'ori' || kindStr === 'lin') {
    return {
      kind: kindStr,
      version,
      inline: false,
      count: 0,
      tMinSec: 0,
      tMaxSec: 0,
    };
  }

  return null;
}

function binarySearchInterval(data: Float64Array, stride: number, count: number, tSec: number): number {
  let lo = 0;
  let hi = count - 1;
  if (tSec <= data[0]) return 0;
  if (tSec >= data[hi * stride]) return Math.max(0, hi - 1);
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    if (data[mid * stride] <= tSec) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function solveHyperbolicKepler(M: number, ecc: number): number {
  // Stable initial seed for arbitrary M
  let H = Math.abs(M) < 1 ? M / Math.max(1e-4, ecc - 1) : Math.asinh(M / ecc);
  if (!Number.isFinite(H)) H = 0;
  for (let i = 0; i < 24; i++) {
    const sinhH = Math.sinh(H);
    const coshH = Math.cosh(H);
    const f = ecc * sinhH - H - M;
    const fp = ecc * coshH - 1;
    if (Math.abs(fp) < 1e-12) break;
    const step = Math.max(-2.5, Math.min(2.5, f / fp));
    H -= step;
    if (Math.abs(step) < 1e-11) break;
  }
  return H;
}

function solveEllipticKepler(M: number, ecc: number): number {
  const twoPi = Math.PI * 2;
  let Mw = ((M % twoPi) + twoPi) % twoPi;
  if (Mw > Math.PI) Mw -= twoPi;
  let E = ecc < 0.2 ? Mw + ecc * Math.sin(Mw) : Mw + (Mw >= 0 ? 0.85 : -0.85) * ecc;
  for (let i = 0; i < 20; i++) {
    const f = E - ecc * Math.sin(E) - Mw;
    const fp = 1 - ecc * Math.cos(E);
    const delta = f / Math.max(1e-12, fp);
    E -= delta;
    if (Math.abs(delta) < 1e-11) break;
  }
  return E;
}

/**
 * Evaluates a piece-wise orbital `.dyn` segment (`orb`) in ICRF km and km/s.
 */
export function evaluateOrbSegment(seg: ParsedOrbSegment, tSec: number): DynStateVector | null {
  if (!seg.inline || seg.count === 0) return null;

  // Use last osculating piece whose t0 <= tSec
  let idx = binarySearchInterval(seg.data, 9, seg.count, tSec);
  if (idx + 1 < seg.count && tSec >= seg.data[(idx + 1) * 9]) {
    idx += 1;
  }

  const base = idx * 9;
  const t0 = seg.data[base];
  const aKm = seg.data[base + 1];
  const ecc = seg.data[base + 2];
  const nRadS = seg.data[base + 3];
  const M0 = seg.data[base + 4];
  const qw = seg.data[base + 5];
  const qx = seg.data[base + 6];
  const qy = seg.data[base + 7];
  const qz = seg.data[base + 8];

  const M = M0 + nRadS * (tSec - t0);
  let rx = 0;
  let ry = 0;
  let vx = 0;
  let vy = 0;

  if (ecc > 1.000001) {
    const H = solveHyperbolicKepler(M, ecc);
    const coshH = Math.cosh(H);
    const sinhH = Math.sinh(H);
    const sq = Math.sqrt(ecc * ecc - 1);
    rx = aKm * (ecc - coshH);
    ry = aKm * sq * sinhH;
    const denom = Math.max(1e-9, ecc * coshH - 1);
    const scale = (aKm * nRadS) / denom;
    vx = -scale * sinhH;
    vy = scale * sq * coshH;
  } else {
    const eSafe = Math.min(ecc, 0.999999);
    const E = solveEllipticKepler(M, eSafe);
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const sq = Math.sqrt(1 - eSafe * eSafe);
    rx = aKm * (cosE - eSafe);
    ry = aKm * sq * sinE;
    const denom = Math.max(1e-9, 1 - eSafe * cosE);
    const scale = (aKm * nRadS) / denom;
    vx = -scale * sinE;
    vy = scale * sq * cosE;
  }

  // Apply NASA wxyz unit quaternion from perifocal plane into ICRF
  const rotateVec = (x: number, y: number): [number, number, number] => {
    const tx = 2 * (-qz * y);
    const ty = 2 * (qz * x);
    const tz = 2 * (qx * y - qy * x);
    return [
      x + qw * tx + (qy * tz - qz * ty),
      y + qw * ty + (qz * tx - qx * tz),
      qw * tz + (qx * ty - qy * tx),
    ];
  };

  return {
    positionKm: rotateVec(rx, ry),
    velocityKmS: rotateVec(vx, vy),
  };
}

/**
 * Evaluates a `.dyn` position table (`pos`) using smooth Cubic Hermite interpolation.
 */
export function evaluatePosSegment(seg: ParsedPosSegment, tSec: number): DynStateVector | null {
  if (!seg.inline || seg.count === 0) return null;
  if (seg.count === 1) {
    return {
      positionKm: [seg.data[1], seg.data[2], seg.data[3]],
      velocityKmS: [seg.data[4], seg.data[5], seg.data[6]],
    };
  }

  const idx = binarySearchInterval(seg.data, 7, seg.count, tSec);
  const b0 = idx * 7;
  const b1 = (idx + 1) * 7;
  const t0 = seg.data[b0];
  const t1 = seg.data[b1];
  const dt = t1 - t0;

  if (dt <= 1e-6) {
    return {
      positionKm: [seg.data[b0 + 1], seg.data[b0 + 2], seg.data[b0 + 3]],
      velocityKmS: [seg.data[b0 + 4], seg.data[b0 + 5], seg.data[b0 + 6]],
    };
  }

  const u = Math.max(0, Math.min(1, (tSec - t0) / dt));
  const u2 = u * u;
  const u3 = u2 * u;

  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = u3 - 2 * u2 + u;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = u3 - u2;

  const dh00 = (6 * u2 - 6 * u) / dt;
  const dh10 = 3 * u2 - 4 * u + 1;
  const dh01 = (-6 * u2 + 6 * u) / dt;
  const dh11 = 3 * u2 - 2 * u;

  const p0x = seg.data[b0 + 1], p0y = seg.data[b0 + 2], p0z = seg.data[b0 + 3];
  const v0x = seg.data[b0 + 4], v0y = seg.data[b0 + 5], v0z = seg.data[b0 + 6];
  const p1x = seg.data[b1 + 1], p1y = seg.data[b1 + 2], p1z = seg.data[b1 + 3];
  const v1x = seg.data[b1 + 4], v1y = seg.data[b1 + 5], v1z = seg.data[b1 + 6];

  return {
    positionKm: [
      h00 * p0x + h10 * dt * v0x + h01 * p1x + h11 * dt * v1x,
      h00 * p0y + h10 * dt * v0y + h01 * p1y + h11 * dt * v1y,
      h00 * p0z + h10 * dt * v0z + h01 * p1z + h11 * dt * v1z,
    ],
    velocityKmS: [
      dh00 * p0x + dh10 * v0x + dh01 * p1x + dh11 * v1x,
      dh00 * p0y + dh10 * v0y + dh01 * p1y + dh11 * v1y,
      dh00 * p0z + dh10 * v0z + dh01 * p1z + dh11 * v1z,
    ],
  };
}

/**
 * Evaluates a `.dyn` attitude quaternion table (`quat`) transformed to Three.js world axes.
 */
export function evaluateQuatSegment(seg: ParsedQuatSegment, tSec: number, out = new THREE.Quaternion()): THREE.Quaternion | null {
  if (!seg.inline || seg.count === 0) return null;
  if (seg.count === 1) {
    out.set(seg.data[2], seg.data[3], seg.data[4], seg.data[1]).normalize();
    return out.premultiply(ICRF_TO_THREE_QUAT);
  }

  const idx = binarySearchInterval(seg.data, 5, seg.count, tSec);
  const b0 = idx * 5;
  const b1 = (idx + 1) * 5;
  const dt = seg.data[b1] - seg.data[b0];
  const u = dt > 1e-6 ? Math.max(0, Math.min(1, (tSec - seg.data[b0]) / dt)) : 0;

  const q0 = new THREE.Quaternion(seg.data[b0 + 2], seg.data[b0 + 3], seg.data[b0 + 4], seg.data[b0 + 1]).normalize();
  const q1 = new THREE.Quaternion(seg.data[b1 + 2], seg.data[b1 + 3], seg.data[b1 + 4], seg.data[b1 + 1]).normalize();
  out.copy(q0).slerp(q1, u);
  return out.premultiply(ICRF_TO_THREE_QUAT);
}

// ---------- Async Browser Fetch & Cache ----------

const parsedCache = new Map<string, ParsedDynSegment | null>();
const inflightFetches = new Map<string, Promise<ParsedDynSegment | null>>();

export function getCachedDynSegment(file: string): ParsedDynSegment | null | undefined {
  return parsedCache.get(file);
}

export async function loadDynSegment(file: string): Promise<ParsedDynSegment | null> {
  if (parsedCache.has(file)) {
    return parsedCache.get(file) ?? null;
  }
  const existing = inflightFetches.get(file);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
      const url = `${base}nasa/trajectories/${file}`;
      const res = await fetch(url);
      if (!res.ok) {
        parsedCache.set(file, null);
        return null;
      }
      const buf = await res.arrayBuffer();
      const parsed = parseDynBuffer(buf);
      parsedCache.set(file, parsed);
      return parsed;
    } catch {
      parsedCache.set(file, null);
      return null;
    } finally {
      inflightFetches.delete(file);
    }
  })();

  inflightFetches.set(file, promise);
  return promise;
}

export function resolveParentKey(rawParentId: string): string {
  return NASA_PARENT_ID_MAP[rawParentId.toLowerCase()] ?? rawParentId;
}

function selectActiveSegmentMeta(
  entry: NasaSpacecraftEntry,
  tSec: number,
  resolver: ParentResolver,
  tempVec: THREE.Vector3
): NasaTrajectorySegment | null {
  let bestCovered: NasaTrajectorySegment | null = null;
  let bestScore = -1;

  for (const seg of entry.dynSegments) {
    if (!seg.inline || (seg.kind !== 'orb' && seg.kind !== 'pos')) continue;
    const parentName = resolveParentKey(seg.parentId);
    const hasParent =
      parentName.startsWith('sc_')
        ? Boolean(resolver.getSpacecraftWorldPosition?.(parentName, tempVec))
        : Boolean(resolver.getWorldPosition(parentName, tempVec));
    if (!hasParent) continue;

    const covered = tSec >= seg.tMinSec && tSec <= seg.tMaxSec;
    if (!covered) continue;

    // Prefer non-Sun local flyby/orbiter segment over heliocentric cruise during encounters
    const localityScore = seg.parentId.toLowerCase() === 'sun' ? 1 : 2;
    const kindScore = seg.kind === 'pos' ? 1 : 0;
    const score = localityScore * 10 + kindScore;
    if (score > bestScore) {
      bestScore = score;
      bestCovered = seg;
    }
  }

  return bestCovered;
}

export function getActiveModelPath(entry: NasaSpacecraftEntry, tSec: number): string {
  const deploySec = VARIANT_DEPLOY_SEC[entry.id];
  if (deploySec !== undefined && tSec < deploySec) {
    const stowed = NASA_EXTRA_ASSETS.stowedVariants[entry.id];
    if (stowed) return stowed;
  }
  return entry.modelPath;
}

const _tmpVecA = new THREE.Vector3();
const _tmpVecB = new THREE.Vector3();
const _tmpQuat = new THREE.Quaternion();
const _upAxis = new THREE.Vector3(0, 1, 0);

/**
 * Evaluates a NASA spacecraft's exact scene-space position, velocity, attitude,
 * variant model (stowed/cruise vs deployed/rover), and visual clearance above enlarged globes.
 */
export function evaluateSpacecraftSceneState(
  entry: NasaSpacecraftEntry,
  jdTDB: number,
  resolver: ParentResolver,
  requestLoad?: (file: string) => void
): SpacecraftSceneEval | null {
  const tSec = jdTdbToJ2000Sec(jdTDB);
  const daysSinceJ2000 = jdTDB - J2000_JD;
  const activeModelPath = getActiveModelPath(entry, tSec);

  // Trigger background fetch for attitude segment if present
  let attitude: THREE.Quaternion | null = null;
  if (entry.oriSegment?.inline) {
    const oriCached = parsedCache.get(entry.oriSegment.file);
    if (oriCached === undefined) {
      requestLoad?.(entry.oriSegment.file);
    } else if (oriCached && oriCached.kind === 'quat') {
      attitude = evaluateQuatSegment(oriCached, tSec, _tmpQuat.clone());
    }
  }

  // 1. Check live surface-mounted lander/rover phase (Mars landers & Philae on 67P after landing)
  if (entry.surfaceSite) {
    const deploySec = VARIANT_DEPLOY_SEC[entry.id];
    const isPhilaeAfterLanding = entry.id === 'sc_philae' && tSec >= 469108800; // 2014-11-12T12:00Z
    const isLanded =
      entry.id !== 'sc_philae'
        ? deploySec === undefined || tSec >= deploySec
        : isPhilaeAfterLanding;

    if (isLanded) {
      const hostName = entry.surfaceSite.body;
      const hostPos = resolver.getWorldPosition(hostName, _tmpVecA);
      const surfaceObj = resolver.getSurfaceObject(hostName);
      const visRadius = resolver.getVisualRadius(hostName);
      if (hostPos && visRadius > 0) {
        const theta = (90 - entry.surfaceSite.latDeg) * DEG2RAD;
        const phi = (180 + entry.surfaceSite.lonDeg) * DEG2RAD;
        const localDir = new THREE.Vector3(
          -Math.cos(phi) * Math.sin(theta),
          Math.cos(theta),
          Math.sin(phi) * Math.sin(theta)
        ).normalize();

        const worldNormal = localDir.clone();
        if (surfaceObj) {
          worldNormal.transformDirection(surfaceObj.matrixWorld).normalize();
        }
        const mountRadius = visRadius * 1.0035 + entry.surfaceSite.altKm * UNITS_PER_KM;
        const worldPosition = hostPos.clone().addScaledVector(worldNormal, mountRadius);
        const surfaceAttitude = new THREE.Quaternion().setFromUnitVectors(_upAxis, worldNormal);

        return {
          worldPosition,
          worldVelocityUnitsS: new THREE.Vector3(),
          attitude: surfaceAttitude,
          activeModelPath,
          activeSource: 'surface',
          parentName: hostName,
          clearanceUnits: mountRadius - visRadius,
          isSurfaceMounted: true,
        };
      }
    }
  }

  // 2. Check inline binary .dyn trajectory matching current epoch
  const segMeta = selectActiveSegmentMeta(entry, tSec, resolver, _tmpVecA);
  if (segMeta) {
    const segData = parsedCache.get(segMeta.file);
    if (segData === undefined) {
      requestLoad?.(segMeta.file);
    } else if (segData && (segData.kind === 'orb' || segData.kind === 'pos')) {
      const state =
        segData.kind === 'orb'
          ? evaluateOrbSegment(segData, tSec)
          : evaluatePosSegment(segData, tSec);

      if (state) {
        const parentName = resolveParentKey(segMeta.parentId);
        const parentPos = parentName.startsWith('sc_')
          ? resolver.getSpacecraftWorldPosition?.(parentName, _tmpVecA) ?? null
          : resolver.getWorldPosition(parentName, _tmpVecA);

        if (parentPos) {
          const icrfDir = CoordinateFrames.icrfToThree(state.positionKm);
          const vec = new THREE.Vector3(icrfDir[0], icrfDir[1], icrfDir[2]);
          const distKm = Math.max(0.001, vec.length());
          vec.divideScalar(distKm); // unit direction

          const parentVisR = resolver.getVisualRadius(parentName);
          const parentKm = resolver.getPhysicalRadiusKm(parentName);

          let scaledDistUnits: number;
          if (parentName === 'Sun') {
            scaledDistUnits = Math.max(parentVisR * 1.06, distKm * UNITS_PER_KM);
          } else {
            const expandedKm = moonDistanceKm(distKm, parentKm, WORLD_SCALE);
            scaledDistUnits = Math.max(parentVisR * 1.024, expandedKm * UNITS_PER_KM);
          }

          const velThree = CoordinateFrames.icrfToThree(state.velocityKmS);
          const worldPosition = parentPos.clone().addScaledVector(vec, scaledDistUnits);
          const worldVelocityUnitsS = new THREE.Vector3(
            velThree[0] * UNITS_PER_KM,
            velThree[1] * UNITS_PER_KM,
            velThree[2] * UNITS_PER_KM
          );

          if (!attitude && worldVelocityUnitsS.lengthSq() > 1e-18) {
            const fwd = worldVelocityUnitsS.clone().normalize();
            attitude = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), fwd);
          }

          return {
            worldPosition,
            worldVelocityUnitsS,
            attitude,
            activeModelPath,
            activeSource: segData.kind === 'orb' ? 'dyn-orb' : 'dyn-pos',
            parentName,
            clearanceUnits: scaledDistUnits - parentVisR,
            isSurfaceMounted: false,
          };
        }
      }
    }
  }

  // 3. Check Sun-Earth Lagrange Halo (JWST, WFIRST, Herschel, Planck, Gaia, Euclid, SOHO, LISA, etc.)
  if (entry.lagrangeHalo) {
    const earthPos = resolver.getWorldPosition('Earth', _tmpVecA);
    const sunPos = resolver.getWorldPosition('Sun', _tmpVecB) ?? _tmpVecB.set(0, 0, 0);
    if (earthPos) {
      const sunToEarth = earthPos.clone().sub(sunPos).normalize();
      const lDistKm = 1500000; // ~0.01 AU Sun-Earth L1/L2 distance
      const sign = entry.lagrangeHalo.point === 'L2' ? 1 : -1;
      const baseUnits = moonDistanceKm(lDistKm, 6371, WORLD_SCALE) * UNITS_PER_KM;
      const haloAnchor = earthPos.clone().addScaledVector(sunToEarth, sign * baseUnits);

      const earthEclipticNormal = new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(earthEclipticNormal, sunToEarth).normalize();
      const binormal = new THREE.Vector3().crossVectors(sunToEarth, tangent).normalize();

      const phaseRad =
        entry.lagrangeHalo.phaseDeg * DEG2RAD +
        (daysSinceJ2000 / Math.max(1, entry.lagrangeHalo.periodDays)) * Math.PI * 2;
      const ampUnits = entry.lagrangeHalo.amplitudeKm * UNITS_PER_KM * 4.5;

      const worldPosition = haloAnchor
        .addScaledVector(tangent, Math.cos(phaseRad) * ampUnits)
        .addScaledVector(binormal, Math.sin(phaseRad) * ampUnits * 0.42);

      const speedScalar = ((2 * Math.PI) / (entry.lagrangeHalo.periodDays * 86400)) * ampUnits;
      const worldVelocityUnitsS = tangent
        .clone()
        .multiplyScalar(-Math.sin(phaseRad) * speedScalar)
        .addScaledVector(binormal, Math.cos(phaseRad) * speedScalar * 0.42);

      // Sunshield / telescope keeps Sun behind spacecraft (+Z toward Sun/Earth)
      if (!attitude) {
        const awayFromSun = sunToEarth.clone();
        attitude = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), awayFromSun);
      }

      return {
        worldPosition,
        worldVelocityUnitsS,
        attitude,
        activeModelPath,
        activeSource: 'halo',
        parentName: 'Earth',
        clearanceUnits: baseUnits,
        isSurfaceMounted: false,
      };
    }
  }

  // 4. Fallback analytical Keplerian orbit around host planet, moon, asteroid, or Sun
  const fb = entry.fallbackOrbit;
  if (fb) {
    const parentPos = resolver.getWorldPosition(fb.parentBody, _tmpVecA);
    if (parentPos) {
      const parentGm = resolveFallbackParentGmKm3S2(fb, resolver);
      const kepState = KeplerSolver.propagate(
        {
          semiMajorAxisKm: fb.semiMajorAxisKm,
          semiMajorAxisAU: fb.semiMajorAxisKm / 149597870.7,
          eccentricity: fb.eccentricity,
          inclinationDeg: fb.inclinationDeg,
          longitudeAscendingNodeDeg: fb.lonAscendingNodeDeg,
          argumentPeriapsisDeg: fb.argPeriapsisDeg,
          meanAnomalyAtEpochDeg: fb.meanAnomalyDeg,
          meanMotionDegPerDay: fb.periodDays > 0 ? 360 / fb.periodDays : undefined,
          orbitalPeriodDays: fb.periodDays,
          epochJd: J2000_JD,
          source: 'NASA Fallback Kepler',
        },
        daysSinceJ2000,
        parentGm
      );

      // Convert ecliptic state [x, y, z] -> Three.js [x, z, -y]
      const dirThree = new THREE.Vector3(kepState.positionKm[0], kepState.positionKm[2], -kepState.positionKm[1]);
      const distKm = Math.max(0.001, dirThree.length());
      dirThree.divideScalar(distKm);

      const parentVisR = resolver.getVisualRadius(fb.parentBody);
      const parentKm = resolver.getPhysicalRadiusKm(fb.parentBody);
      let scaledDistUnits: number;
      if (fb.parentBody === 'Sun') {
        scaledDistUnits = Math.max(parentVisR * 1.06, distKm * UNITS_PER_KM);
      } else {
        const expandedKm = moonDistanceKm(distKm, parentKm, WORLD_SCALE);
        scaledDistUnits = Math.max(parentVisR * 1.024, expandedKm * UNITS_PER_KM);
      }

      const worldPosition = parentPos.clone().addScaledVector(dirThree, scaledDistUnits);
      const velThree = new THREE.Vector3(
        kepState.velocityKmPerSec[0] * UNITS_PER_KM,
        kepState.velocityKmPerSec[2] * UNITS_PER_KM,
        -kepState.velocityKmPerSec[1] * UNITS_PER_KM
      );

      if (!attitude && velThree.lengthSq() > 1e-18) {
        const fwd = velThree.clone().normalize();
        attitude = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), fwd);
      }

      return {
        worldPosition,
        worldVelocityUnitsS: velThree,
        attitude,
        activeModelPath,
        activeSource: 'kepler',
        parentName: fb.parentBody,
        clearanceUnits: scaledDistUnits - parentVisR,
        isSurfaceMounted: false,
      };
    }
  }

  // Last-resort park near host body
  const directHost = resolver.getWorldPosition(entry.hostBody, _tmpVecA);
  const lastParent = directHost ? entry.hostBody : entry.hostBody.split('/')[0].trim();
  const hostPos = directHost ?? resolver.getWorldPosition(lastParent, _tmpVecA);
  if (hostPos) {
    const r = resolver.getVisualRadius(lastParent) * 1.25;
    return {
      worldPosition: hostPos.clone().add(new THREE.Vector3(r, r * 0.25, 0)),
      worldVelocityUnitsS: new THREE.Vector3(),
      attitude,
      activeModelPath,
      activeSource: 'kepler',
      parentName: lastParent,
      clearanceUnits: r * 0.2,
      isSurfaceMounted: false,
    };
  }

  return null;
}

/** Ensures relevant `.dyn` segments for an entry are queued for download. */
export function prefetchEntryDyn(entry: NasaSpacecraftEntry, tSec?: number): void {
  const inlineSegs = entry.dynSegments.filter((s) => s.inline);
  if (tSec !== undefined) {
    // Load active epoch segments first
    for (const seg of inlineSegs) {
      if (tSec >= seg.tMinSec && tSec <= seg.tMaxSec) {
        void loadDynSegment(seg.file);
      }
    }
  }
  for (const seg of inlineSegs) {
    void loadDynSegment(seg.file);
  }
  if (entry.oriSegment?.inline) {
    void loadDynSegment(entry.oriSegment.file);
  }
}

/**
 * Awaits any uncached active `.dyn` trajectory or attitude segments for `entry` at `jdTDB`.
 * Resolves `true` if one or more segments were newly fetched so callers can re-snap once loaded.
 */
export async function awaitEntryDyn(entry: NasaSpacecraftEntry, jdTDB: number): Promise<boolean> {
  const tSec = jdTdbToJ2000Sec(jdTDB);
  const pending: Array<Promise<ParsedDynSegment | null>> = [];
  for (const seg of entry.dynSegments) {
    if (!seg.inline || (seg.kind !== 'orb' && seg.kind !== 'pos')) continue;
    if (tSec >= seg.tMinSec && tSec <= seg.tMaxSec && parsedCache.get(seg.file) === undefined) {
      pending.push(loadDynSegment(seg.file));
    }
  }
  if (entry.oriSegment?.inline && parsedCache.get(entry.oriSegment.file) === undefined) {
    pending.push(loadDynSegment(entry.oriSegment.file));
  }
  if (pending.length === 0) return false;
  await Promise.allSettled(pending);
  return true;
}
