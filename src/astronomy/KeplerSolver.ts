import { KeplerianElements } from '../types/catalogue';

export interface StateVector {
  positionKm: [number, number, number];
  velocityKmPerSec: [number, number, number];
  trueAnomalyDeg: number;
  eccentricAnomalyDeg: number;
  distanceKm: number;
  speedKmPerSec: number;
}

export class KeplerSolver {
  // Standard Gravitational Parameter of the Sun (km^3 / s^2)
  public static readonly GM_SUN = 132712440041.9394;

  /**
   * Solve Kepler's equation M = E - e * sin(E) for Eccentric Anomaly E.
   * Uses iterative Newton-Raphson with an initial guess adapted for eccentricity.
   *
   * @param M Mean anomaly in radians.
   * @param e Eccentricity (0 <= e < 1 for elliptical orbits).
   * @param tolerance Convergence threshold (default 1e-12).
   * @param maxIterations Maximum iterations allowed (default 25).
   * @returns Eccentric anomaly E in radians.
   */
  public static solveKepler(
    M: number,
    e: number,
    tolerance: number = 1e-12,
    maxIterations: number = 25
  ): number {
    // 1. Normalize M to [-PI, PI] for numerical symmetry
    const twoPi = Math.PI * 2;
    M = ((M % twoPi) + twoPi) % twoPi;
    if (M > Math.PI) M -= twoPi;

    // 2. Initial estimate E0 (Danby / Mikkola starter for high stability)
    let E: number;
    if (e < 0.18) {
      // Circular or near-circular orbit: E ~ M
      E = M + e * Math.sin(M);
    } else {
      // High-eccentricity starter
      const sign = M < 0 ? -1 : 1;
      E = M + sign * 0.85 * e;
    }

    // 3. Newton-Raphson iterations
    for (let i = 0; i < maxIterations; i++) {
      const f = E - e * Math.sin(E) - M;
      if (Math.abs(f) < tolerance) {
        return E;
      }
      const fPrime = 1.0 - e * Math.cos(E);
      // Guard against division by zero
      if (Math.abs(fPrime) < 1e-15) break;

      const delta = f / fPrime;
      E -= delta;
      if (Math.abs(delta) < tolerance) {
        return E;
      }
    }

    return E;
  }

  /** Days per Julian century. */
  public static readonly DAYS_PER_CENTURY = 36525.0;
  public static readonly AU_KM = 149597870.7;
  public static readonly J2000_JD = 2451545.0;

  /**
   * Evaluate the osculating element set at a given time (days since J2000.0 TDB).
   * Handles three element models:
   *  1. Secular-rate planets (JPL approximate positions, Standish): linear rates per century.
   *  2. Mean-element satellites/small bodies: explicit mean motion and optional apsidal/nodal precession.
   *  3. Plain two-body elements: mean motion from n = sqrt(μ / a³).
   */
  public static elementsAt(
    elements: KeplerianElements,
    elapsedDaysSinceJ2000: number,
    gm: number = KeplerSolver.GM_SUN
  ): { a: number; e: number; iDeg: number; nodeDeg: number; argPeriDeg: number; meanAnomalyRad: number } {
    const epochOffsetDays = (elements.epochJd ?? KeplerSolver.J2000_JD) - KeplerSolver.J2000_JD;
    const dt = elapsedDaysSinceJ2000 - epochOffsetDays;
    const deg = Math.PI / 180.0;

    const rates = elements.ratesPerCentury;
    if (rates) {
      const T = dt / KeplerSolver.DAYS_PER_CENTURY;
      const aAU = elements.semiMajorAxisAU + rates.semiMajorAxisAU * T;
      return {
        a: aAU * KeplerSolver.AU_KM,
        e: elements.eccentricity + rates.eccentricity * T,
        iDeg: elements.inclinationDeg + rates.inclinationDeg * T,
        nodeDeg: elements.longitudeAscendingNodeDeg + rates.longitudeAscendingNodeDeg * T,
        argPeriDeg: elements.argumentPeriapsisDeg + rates.argumentPeriapsisDeg * T,
        meanAnomalyRad: (elements.meanAnomalyAtEpochDeg + rates.meanAnomalyDeg * T) * deg,
      };
    }

    const a = elements.semiMajorAxisKm;
    const nRadPerDay = elements.meanMotionDegPerDay !== undefined
      ? elements.meanMotionDegPerDay * deg
      : Math.sqrt(gm / (a * a * a)) * 86400.0;

    return {
      a,
      e: elements.eccentricity,
      iDeg: elements.inclinationDeg,
      nodeDeg: elements.longitudeAscendingNodeDeg + (elements.nodeRateDegPerDay ?? 0) * dt,
      argPeriDeg: elements.argumentPeriapsisDeg + (elements.periapsisArgRateDegPerDay ?? 0) * dt,
      meanAnomalyRad: elements.meanAnomalyAtEpochDeg * deg + nRadPerDay * dt,
    };
  }

  /**
   * Propagate Keplerian elements to a given time and return physical state vectors
   * (position, velocity, true anomaly, distance) in the J2000 ecliptic frame, relative
   * to the central body. All catalogue element sets are referred to the J2000 ecliptic.
   *
   * @param elements Keplerian orbital elements.
   * @param elapsedDays Days elapsed since J2000.0 (TDB). Element epochs other than J2000 are honoured.
   * @param gm Gravitational parameter of the central body (default Sun GM in km^3/s^2).
   */
  public static propagate(
    elements: KeplerianElements,
    elapsedDays: number,
    gm: number = KeplerSolver.GM_SUN
  ): StateVector {
    if (elements.semiMajorAxisKm <= 0) {
      // Stationary center (e.g. the Sun)
      return {
        positionKm: [0, 0, 0],
        velocityKmPerSec: [0, 0, 0],
        trueAnomalyDeg: 0,
        eccentricAnomalyDeg: 0,
        distanceKm: 0,
        speedKmPerSec: 0,
      };
    }

    const el = KeplerSolver.elementsAt(elements, elapsedDays, gm);
    const a = el.a;
    const e = el.e;

    // Solve for Eccentric Anomaly E
    const E = KeplerSolver.solveKepler(el.meanAnomalyRad, e);

    // True Anomaly nu: tan(nu / 2) = sqrt((1 + e) / (1 - e)) * tan(E / 2)
    const sinE = Math.sin(E);
    const cosE = Math.cos(E);
    const sinNu = (Math.sqrt(1.0 - e * e) * sinE) / (1.0 - e * cosE);
    const cosNu = (cosE - e) / (1.0 - e * cosE);
    const nu = Math.atan2(sinNu, cosNu);

    // Radius r = a * (1 - e * cos(E))
    const r = a * (1.0 - e * cosE);

    // Perifocal coordinates in the orbital plane (x', y', 0)
    const xPrime = a * (cosE - e);
    const yPrime = a * Math.sqrt(1.0 - e * e) * sinE;

    // Orbital velocity in perifocal frame (two-body, central GM)
    const vFactor = Math.sqrt(gm * a) / r;
    const vxPrime = -vFactor * sinE;
    const vyPrime = vFactor * Math.sqrt(1.0 - e * e) * cosE;

    const { P, Q } = KeplerSolver.perifocalBasis(el.iDeg, el.argPeriDeg, el.nodeDeg);

    const posRef: [number, number, number] = [
      xPrime * P[0] + yPrime * Q[0],
      xPrime * P[1] + yPrime * Q[1],
      xPrime * P[2] + yPrime * Q[2],
    ];
    const velRef: [number, number, number] = [
      vxPrime * P[0] + vyPrime * Q[0],
      vxPrime * P[1] + vyPrime * Q[1],
      vxPrime * P[2] + vyPrime * Q[2],
    ];

    const [X, Y, Z] = posRef;
    const [Vx, Vy, Vz] = velRef;

    const speed = Math.sqrt(Vx * Vx + Vy * Vy + Vz * Vz);

    return {
      positionKm: [X, Y, Z],
      velocityKmPerSec: [Vx, Vy, Vz],
      trueAnomalyDeg: ((nu * 180.0) / Math.PI % 360.0 + 360.0) % 360.0,
      eccentricAnomalyDeg: ((E * 180.0) / Math.PI % 360.0 + 360.0) % 360.0,
      distanceKm: r,
      speedKmPerSec: speed,
    };
  }

  /**
   * Perifocal unit vectors P (towards periapsis) and Q (90° ahead in the orbital plane),
   * expressed in the element set's reference frame: R = Rz(-Ω) · Rx(-i) · Rz(-ω).
   */
  public static perifocalBasis(iDeg: number, argPeriDeg: number, nodeDeg: number): {
    P: [number, number, number];
    Q: [number, number, number];
  } {
    const i = (iDeg * Math.PI) / 180.0;
    const w = (argPeriDeg * Math.PI) / 180.0;
    const O = (nodeDeg * Math.PI) / 180.0;
    const cosO = Math.cos(O), sinO = Math.sin(O);
    const cosi = Math.cos(i), sini = Math.sin(i);
    const cosw = Math.cos(w), sinw = Math.sin(w);
    return {
      P: [cosO * cosw - sinO * sinw * cosi, sinO * cosw + cosO * sinw * cosi, sinw * sini],
      Q: [-cosO * sinw - sinO * cosw * cosi, -sinO * sinw + cosO * cosw * cosi, cosw * sini],
    };
  }

  /**
   * Sample the complete 3D elliptical orbital path (osculating at the given time) for rendering.
   * Produces positions in the J2000 ecliptic frame relative to the central body.
   */
  public static sampleOrbitPath(
    elements: KeplerianElements,
    segments: number = 128,
    elapsedDays: number = 0
  ): Array<[number, number, number]> {
    const points: Array<[number, number, number]> = [];
    if (elements.semiMajorAxisKm <= 0) return points;

    const el = KeplerSolver.elementsAt(elements, elapsedDays);
    const a = el.a;
    const e = el.e;
    const b = a * Math.sqrt(Math.max(0, 1.0 - e * e));
    const { P, Q } = KeplerSolver.perifocalBasis(el.iDeg, el.argPeriDeg, el.nodeDeg);

    for (let k = 0; k <= segments; k++) {
      const E = (k / segments) * Math.PI * 2;
      const xPrime = a * (Math.cos(E) - e);
      const yPrime = b * Math.sin(E);
      const ref: [number, number, number] = [
        xPrime * P[0] + yPrime * Q[0],
        xPrime * P[1] + yPrime * Q[1],
        xPrime * P[2] + yPrime * Q[2],
      ];
      points.push(ref);
    }

    return points;
  }
}
