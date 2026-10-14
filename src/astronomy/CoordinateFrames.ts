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

  /**
   * ICRF (equatorial J2000) vector → Three.js render coordinates (via the J2000 ecliptic).
   * Star catalogues, IAU poles and galactic directions are all given in ICRF.
   */
  public static icrfToThree(icrf: [number, number, number]): [number, number, number] {
    return CoordinateFrames.eclipticToThree(CoordinateFrames.icrfToEcliptic(icrf));
  }

  /** ICRF unit vector from right ascension / declination (degrees). */
  public static raDecToIcrf(raDeg: number, decDeg: number): [number, number, number] {
    const ra = (raDeg * Math.PI) / 180.0;
    const dec = (decDeg * Math.PI) / 180.0;
    return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
  }

  // IAU 1958 galactic frame expressed in ICRS (J2000): north galactic pole and galactic centre
  public static readonly NGP_RA_DEG = 192.85948;
  public static readonly NGP_DEC_DEG = 27.12825;
  public static readonly GC_RA_DEG = 266.40499;
  public static readonly GC_DEC_DEG = -28.93617;

  /**
   * Galactic basis in Three.js render coordinates:
   *  x → galactic centre (l = 0°, b = 0°), y → l = 90°, z → north galactic pole.
   */
  public static galacticBasisThree(): {
    x: [number, number, number];
    y: [number, number, number];
    z: [number, number, number];
  } {
    const z = CoordinateFrames.icrfToThree(
      CoordinateFrames.raDecToIcrf(CoordinateFrames.NGP_RA_DEG, CoordinateFrames.NGP_DEC_DEG)
    );
    const gc = CoordinateFrames.icrfToThree(
      CoordinateFrames.raDecToIcrf(CoordinateFrames.GC_RA_DEG, CoordinateFrames.GC_DEC_DEG)
    );
    // Remove any residual component along z, then complete the right-handed triad
    const d = gc[0] * z[0] + gc[1] * z[1] + gc[2] * z[2];
    const xr: [number, number, number] = [gc[0] - d * z[0], gc[1] - d * z[1], gc[2] - d * z[2]];
    const l = Math.hypot(...xr);
    const x: [number, number, number] = [xr[0] / l, xr[1] / l, xr[2] / l];
    const y: [number, number, number] = [
      z[1] * x[2] - z[2] * x[1],
      z[2] * x[0] - z[0] * x[2],
      z[0] * x[1] - z[1] * x[0],
    ];
    return { x, y, z };
  }
}
