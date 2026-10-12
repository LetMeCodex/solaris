/**
 * Coordinate Frame Transformations for SOLARIS.
 * Provides analytical, invertible rotations between:
 * 1. Heliocentric Ecliptic J2000.0 Frame
 * 2. International Celestial Reference Frame (ICRF / Equatorial J2000.0)
 * 3. Perifocal Orbital Plane Frame (P, Q, W)
 * 4. Three.js Cartesian WebGL Coordinates
 */
export class CoordinateFrames {
  // Obliquity of the Ecliptic at epoch J2000.0 (IAU standard: 23° 26' 21.406")
  public static readonly OBLIQUITY_J2000_DEG = 23.43929111;
  public static readonly OBLIQUITY_J2000_RAD = (23.43929111 * Math.PI) / 180.0;

  /**
   * Transform a 3D vector from Heliocentric Ecliptic J2000 to Equatorial ICRF.
   * Rotates around X-axis by +obliquity:
   * [X_icrf] = [1,      0,       0] [X_ecl]
   * [Y_icrf] = [0,  cos(e), -sin(e)] [Y_ecl]
   * [Z_icrf] = [0,  sin(e),  cos(e)] [Z_ecl]
   */
  public static eclipticToIcrf(eclipticKm: [number, number, number]): [number, number, number] {
    const [x, y, z] = eclipticKm;
    const cosE = Math.cos(CoordinateFrames.OBLIQUITY_J2000_RAD);
    const sinE = Math.sin(CoordinateFrames.OBLIQUITY_J2000_RAD);

    return [
      x,
      y * cosE - z * sinE,
      y * sinE + z * cosE,
    ];
  }

  /**
   * Transform a 3D vector from Equatorial ICRF to Heliocentric Ecliptic J2000.
   * Inverse rotation around X-axis by -obliquity:
   * [X_ecl] = [1,       0,      0] [X_icrf]
   * [Y_ecl] = [0,   cos(e), sin(e)] [Y_icrf]
   * [Z_ecl] = [0,  -sin(e), cos(e)] [Z_icrf]
   */
  public static icrfToEcliptic(icrfKm: [number, number, number]): [number, number, number] {
    const [x, y, z] = icrfKm;
    const cosE = Math.cos(CoordinateFrames.OBLIQUITY_J2000_RAD);
    const sinE = Math.sin(CoordinateFrames.OBLIQUITY_J2000_RAD);

    return [
      x,
      y * cosE + z * sinE,
      -y * sinE + z * cosE,
    ];
  }

  /**
   * Map scientific astronomical coordinates to Three.js Cartesian render coordinates.
   * Convention:
   * In astronomy, (X, Y) is typically the orbital/ecliptic plane and Z is perpendicular north.
   * In Three.js, (X, Z) is the horizontal floor plane and Y is the vertical up-axis.
   * Transformation:
   * renderX = scientificX
   * renderY = scientificZ (North out of ecliptic plane)
   * renderZ = -scientificY (completes right-handed coordinate system)
   */
  public static eclipticToThree(ecliptic: [number, number, number]): [number, number, number] {
    return [
      ecliptic[0],
      ecliptic[2], // Ecliptic Z -> Three.js Y (Up)
      -ecliptic[1] // Ecliptic Y -> Three.js -Z
    ];
  }

  /**
   * Inverse mapping: Three.js coordinates -> Heliocentric Ecliptic.
   */
  public static threeToEcliptic(threeCoord: [number, number, number]): [number, number, number] {
    return [
      threeCoord[0],
      -threeCoord[2],
      threeCoord[1]
    ];
  }
}
