/**
 * Real-time planetary geomagnetic space weather (NOAA SWPC) for physically accurate
 * Aurora Borealis and Aurora Australis ovals on Earth.
 *
 * Uses NOAA SWPC's public CORS-enabled JSON feed (`services.swpc.noaa.gov`), requiring no API key.
 */

const DEG = Math.PI / 180;
// Earth's geomagnetic north dipole pole (IGRF-14 epoch ~2025-2026: 80.7°N, 72.7°W)
const POLE_LAT = 80.7 * DEG;
const POLE_LON = -72.7 * DEG;
const SIN_POLE = Math.sin(POLE_LAT);
const COS_POLE = Math.cos(POLE_LAT);

/** Convert geographic (latDeg, lonDeg) to centred-dipole geomagnetic latitude in degrees [-90, 90]. */
export function geomagneticLatitudeDeg(latDeg: number, lonDeg: number): number {
  const lat = latDeg * DEG;
  const dLon = lonDeg * DEG - POLE_LON;
  const sinM = Math.sin(lat) * SIN_POLE + Math.cos(lat) * COS_POLE * Math.cos(dLon);
  return Math.asin(Math.max(-1, Math.min(1, sinM))) / DEG;
}

/**
 * Compute live aurora curtain visibility (0..1) from geographic coordinates, planetary Kp (0..9),
 * and local solar elevation sine (`sunUp`).
 *
 * The real auroral oval sits around ~67.5° geomagnetic latitude at Kp=1 and expands equatorward
 * by ~2.0° per Kp unit (reaching ~55° geomagnetic lat during G2-G3 storms, and always vibrant
 * over northern Norway/Lofoten ~67°N, Iceland ~64°N, Alaska, northern Canada, and Antarctica).
 */
export function computeAuroraIntensity(
  latDeg: number,
  lonDeg: number,
  kp: number,
  sunUp: number,
): number {
  // Aurora is drowned out by sunlight; emerges smoothly through nautical twilight (-2° to -10°)
  const tNight = Math.max(0, Math.min(1, (-sunUp - 0.02) / 0.14));
  const nightK = tNight * tNight * (3 - 2 * tNight);
  if (nightK <= 0.001) return 0;

  const magLat = Math.abs(geomagneticLatitudeDeg(latDeg, lonDeg));
  const clampedKp = Math.max(0, Math.min(9, kp));
  // Auroral oval peak latitude shifts equatorward with stronger solar wind / Kp
  const ovalPeak = 68.5 - clampedKp * 1.95;
  const ovalHalfWidth = 5.5 + clampedKp * 0.95;
  const dist = Math.abs(magLat - ovalPeak);
  const oval = Math.exp(-0.5 * (dist / ovalHalfWidth) ** 2);
  // Subtle polar-cap glow inside the oval + strong curtain emission along the oval
  const polarCap = magLat > ovalPeak ? 0.25 * Math.exp(-0.5 * ((magLat - ovalPeak) / 14) ** 2) : 0;
  const kpGain = 0.42 + 0.58 * Math.min(1, clampedKp / 5.5);
  return Math.max(0, Math.min(1, (oval + polarCap) * kpGain * nightK));
}

export class LiveSpaceWeatherService {
  /** Latest observed planetary Kp index (0..9). Defaults to moderate quiet-active 2.8 until NOAA replies. */
  public kp = 2.8;
  public lastUpdatedMs = 0;
  private busy = false;

  /** Refresh live Kp from NOAA SWPC at most once every 30 minutes (free, CORS-enabled). */
  public update(): void {
    if (this.busy || typeof fetch === 'undefined') return;
    const now = Date.now();
    if (this.lastUpdatedMs > 0 && now - this.lastUpdatedMs < 1_800_000) return;
    this.busy = true;
    this.lastUpdatedMs = now;
    fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((rows: unknown) => {
        if (!Array.isArray(rows) || rows.length < 2) return;
        for (let i = rows.length - 1; i >= 1; i--) {
          const row = rows[i];
          if (Array.isArray(row) && row.length >= 2) {
            const val = Number(row[1]);
            if (Number.isFinite(val) && val >= 0 && val <= 9) {
              this.kp = val;
              return;
            }
          }
        }
      })
      .catch(() => undefined)
      .finally(() => {
        this.busy = false;
      });
  }

  public auroraAt(latDeg: number, lonDeg: number, sunUp: number): number {
    this.update();
    return computeAuroraIntensity(latDeg, lonDeg, this.kp, sunUp);
  }
}
