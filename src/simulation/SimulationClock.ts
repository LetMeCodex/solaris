/**
 * Centralized Astronomical Simulation Clock.
 * Maintains simulation epoch, Julian Date, Barycentric Dynamical Time (TDB),
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
  public static readonly J2000_JD = 2451545.0; // 2000-01-01T12:00:00.000Z
  public static readonly J2000_UTC_MS = 946728000000; // Unix ms for J2000.0

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
   * Convert Julian Date to Julian Centuries T since J2000.0.
   * T = (JD - 2451545.0) / 36525
   */
  public getJulianCenturiesJ2000(): number {
    const jd = this.getJulianDate();
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
