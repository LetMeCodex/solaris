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

  /**
   * Propagate Keplerian elements to a given elapsed time and return
   * physical state vectors (position, velocity, true anomaly, distance).
   *
   * @param elements Keplerian orbital elements.
   * @param elapsedDays Days elapsed since the elements' reference epoch.
   * @param gm Gravitational parameter of parent body (default Sun GM in km^3/s^2).
   */
  public static propagate(
    elements: KeplerianElements,
    elapsedDays: number,
    gm: number = KeplerSolver.GM_SUN
  ): StateVector {
    const a = elements.semiMajorAxisKm;
    const e = elements.eccentricity;

    if (a <= 0) {
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

    // Mean motion n in rad/s: n = sqrt(mu / a^3)
    const n = Math.sqrt(gm / (a * a * a));
    const elapsedSec = elapsedDays * 86400.0;

    // Mean anomaly at target time: M = M0 + n * t
    const M0_rad = (elements.meanAnomalyAtEpochDeg * Math.PI) / 180.0;
    const M = M0_rad + n * elapsedSec;

    // Solve for Eccentric Anomaly E
    const E = KeplerSolver.solveKepler(M, e);

    // True Anomaly nu: tan(nu / 2) = sqrt((1 + e) / (1 - e)) * tan(E / 2)
    const sinE = Math.sin(E);
    const cosE = Math.cos(E);
    const sinNu = (Math.sqrt(1.0 - e * e) * sinE) / (1.0 - e * cosE);
    const cosNu = (cosE - e) / (1.0 - e * cosE);
    const nu = Math.atan2(sinNu, cosNu);

    // Heliocentric radius r = a * (1 - e * cos(E))
    const r = a * (1.0 - e * cosE);

    // Perifocal coordinates in the orbital plane (x', y', 0)
    const xPrime = a * (cosE - e);
    const yPrime = a * Math.sqrt(1.0 - e * e) * sinE;

    // Orbital velocity in perifocal frame:
    // v_x' = -sqrt(mu * a) / r * sin(E)
    // v_y' =  sqrt(mu * a * (1 - e^2)) / r * cos(E)
    const vFactor = Math.sqrt(gm * a) / r;
    const vxPrime = -vFactor * sinE;
    const vyPrime = vFactor * Math.sqrt(1.0 - e * e) * cosE;

    // Rotate from Perifocal plane to Heliocentric Ecliptic J2000 frame:
    // R = R_z(-Omega) * R_x(-i) * R_z(-omega)
    const i_rad = (elements.inclinationDeg * Math.PI) / 180.0;
    const omega_rad = (elements.argumentPeriapsisDeg * Math.PI) / 180.0;
    const Omega_rad = (elements.longitudeAscendingNodeDeg * Math.PI) / 180.0;

    const cosOmega = Math.cos(Omega_rad);
    const sinOmega = Math.sin(Omega_rad);
    const cosi = Math.cos(i_rad);
    const sini = Math.sin(i_rad);
    const cosw = Math.cos(omega_rad);
    const sinw = Math.sin(omega_rad);

    // Transformation matrix elements:
    // P = vector pointing to periapsis
    const Px = cosOmega * cosw - sinOmega * sinw * cosi;
    const Py = sinOmega * cosw + cosOmega * sinw * cosi;
    const Pz = sinw * sini;

    // Q = vector in orbital plane at 90 deg to P
    const Qx = -cosOmega * sinw - sinOmega * cosw * cosi;
    const Qy = -sinOmega * sinw + cosOmega * cosw * cosi;
    const Qz = cosw * sini;

    // 3D position vector in Heliocentric Ecliptic frame
    const X = xPrime * Px + yPrime * Qx;
    const Y = xPrime * Py + yPrime * Qy;
    const Z = xPrime * Pz + yPrime * Qz;

    // 3D velocity vector
    const Vx = vxPrime * Px + vyPrime * Qx;
    const Vy = vxPrime * Py + vyPrime * Qy;
    const Vz = vxPrime * Pz + vyPrime * Qz;

    const speed = Math.sqrt(Vx * Vx + Vy * Vy + Vz * Vz);

    return {
      positionKm: [X, Y, Z],
      velocityKmPerSec: [Vx, Vy, Vz],
      trueAnomalyDeg: ((nu * 180.0) / Math.PI + 360.0) % 360.0,
      eccentricAnomalyDeg: ((E * 180.0) / Math.PI + 360.0) % 360.0,
      distanceKm: r,
      speedKmPerSec: speed,
    };
  }

  /**
   * Sample the complete 3D elliptical orbital path for WebGL rendering.
   * Produces an array of 3D positions in heliocentric ecliptic coordinates.
   */
  public static sampleOrbitPath(
    elements: KeplerianElements,
    segments: number = 128
  ): Array<[number, number, number]> {
    const points: Array<[number, number, number]> = [];
    const a = elements.semiMajorAxisKm;
    const e = elements.eccentricity;

    if (a <= 0) return points;

    const i_rad = (elements.inclinationDeg * Math.PI) / 180.0;
    const omega_rad = (elements.argumentPeriapsisDeg * Math.PI) / 180.0;
    const Omega_rad = (elements.longitudeAscendingNodeDeg * Math.PI) / 180.0;

    const cosOmega = Math.cos(Omega_rad);
    const sinOmega = Math.sin(Omega_rad);
    const cosi = Math.cos(i_rad);
    const sini = Math.sin(i_rad);
    const cosw = Math.cos(omega_rad);
    const sinw = Math.sin(omega_rad);

    const Px = cosOmega * cosw - sinOmega * sinw * cosi;
    const Py = sinOmega * cosw + cosOmega * sinw * cosi;
    const Pz = sinw * sini;

    const Qx = -cosOmega * sinw - sinOmega * cosw * cosi;
    const Qy = -sinOmega * sinw + cosOmega * cosw * cosi;
    const Qz = cosw * sini;

    const b = a * Math.sqrt(Math.max(0, 1.0 - e * e));

    for (let k = 0; k <= segments; k++) {
      const E = (k / segments) * Math.PI * 2;
      const xPrime = a * (Math.cos(E) - e);
      const yPrime = b * Math.sin(E);

      const X = xPrime * Px + yPrime * Qx;
      const Y = xPrime * Py + yPrime * Qy;
      const Z = xPrime * Pz + yPrime * Qz;

      points.push([X, Y, Z]);
    }

    return points;
  }
}
