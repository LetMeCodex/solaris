/**
 * Centralized Astronomical Simulation Clock.
 * Maintains simulation epoch, UTC Julian Date, TDB Julian Date for ephemerides,
 * time multipliers, pause, reverse, and date scrubbing.
 */
export class SimulationClock {
  // Current simulation timestamp in UTC milliseconds (Unix epoch 1970-01-01T00:00:00Z)
  private currentUtcMs: number;

  // Real-world performance time of the last clock update
  private lastPerfTimeMs: number;

  // Playback state
  public isPaused: boolean = false;
  public timeMultiplier: number = 1.0; // 1x, 10x, 100x, 10000x, etc. Negative for reverse time.

  // Standard Astronomical Reference Epochs
  public static readonly J2000_JD = 2451545.0; // 2000-01-01T12:00:00 TT
  // J2000.0 is 2000-01-01T12:00:00 TT = 11:58:55.816 UTC (TT − UTC was 64.184 s in 2000)
  public static readonly J2000_UTC_MS = 946727935816;

  constructor(initialUtcMs: number = Date.now()) {
    this.currentUtcMs = initialUtcMs;
    this.lastPerfTimeMs = performance.now();
  }

  /**
   * Advance the simulation clock by real-world delta time scaled by timeMultiplier.
   */
  public update(nowPerfMs: number = performance.now()): number {
    const deltaRealMs = nowPerfMs - this.lastPerfTimeMs;
    this.lastPerfTimeMs = nowPerfMs;

    if (!this.isPaused && deltaRealMs > 0) {
      // Advance simulation time in milliseconds
      const deltaSimMs = deltaRealMs * this.timeMultiplier;
      this.currentUtcMs += deltaSimMs;
    }

    return this.currentUtcMs;
  }

  /**
   * Get current simulation time in UTC milliseconds.
   */
  public getUtcMs(): number {
    return this.currentUtcMs;
  }

  /**
   * Set simulation time directly (date scrubbing / seeking).
   */
  public setUtcMs(utcMs: number): void {
    this.currentUtcMs = utcMs;
    this.lastPerfTimeMs = performance.now();
  }

  /**
   * Get current simulation time as an ISO string.
   */
  public getIsoString(): string {
    return new Date(this.currentUtcMs).toISOString();
  }

  /**
   * Convert UTC milliseconds to Julian Date (JD).
   * Formula: JD = (utcMs / 86400000) + 2440587.5
   */
  public getJulianDate(): number {
    return SimulationClock.utcMsToJulianDate(this.currentUtcMs);
  }

  /**
   * Julian Date on the TDB (Barycentric Dynamical Time) scale, which is the time argument of
   * every ephemeris in SOLARIS. TDB ≈ TT = TAI + 32.184 s, and TAI − UTC = 37 s since 2017-01-01
   * (no leap second has been announced since). TDB − TT is below 2 ms and is neglected.
   */
  public getJulianDateTDB(): number {
    return SimulationClock.utcMsToJulianDate(this.currentUtcMs) + SimulationClock.TT_MINUS_UTC_SECONDS / 86400.0;
  }

  /** TT − UTC in seconds (37 leap seconds + 32.184 s), valid from 2017-01-01. */
  public static readonly TT_MINUS_UTC_SECONDS = 69.184;

  /**
   * Convert Julian Date to Julian Centuries T since J2000.0.
   * T = (JD - 2451545.0) / 36525
   */
  public getJulianCenturiesJ2000(): number {
    const jd = this.getJulianDateTDB();
    return (jd - SimulationClock.J2000_JD) / 36525.0;
  }

  /**
   * Static helper: UTC ms -> Julian Date.
   */
  public static utcMsToJulianDate(utcMs: number): number {
    return utcMs / 86400000.0 + 2440587.5;
  }

  /**
   * Static helper: Julian Date -> UTC ms.
   */
  public static julianDateToUtcMs(jd: number): number {
    return (jd - 2440587.5) * 86400000.0;
  }

  /**
   * Reset simulation time to J2000.0 epoch.
   */
  public resetToJ2000(): void {
    this.setUtcMs(SimulationClock.J2000_UTC_MS);
  }

  /**
   * Reset simulation time to the current real-world UTC time.
   */
  public resetToNow(): void {
    this.setUtcMs(Date.now());
  }
}
