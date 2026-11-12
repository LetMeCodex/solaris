/**
 * Getting around Earth quickly.
 *
 * Speed tiers: in Earth's air the jet's drive is held to jet speeds near the ground (the flight
 * model's air limit, and a drive tied to height). The tiers lift both: Hypersonic (about Mach 6)
 * and Scramjet (about Mach 25), still flown by hand, low over the ground if you dare.
 *
 * Transit: an autopilot for country to country. From wherever the jet is it climbs to the edge of
 * the stratosphere, crosses the great circle at up to about 300,000 km/h (the speed of the
 * reference clips), descends and hands back control a couple of kilometres over the destination,
 * flying towards it at jet speed. Paris to Delhi (6,600 km) takes a little over three minutes.
 */

export interface SpeedTier {
  id: 'jet' | 'hypersonic' | 'scramjet';
  label: string;
  /** Top speed in sea-level air, m/s (undefined: the jet's own limit). */
  airLimitMps?: number;
  /** A speed the drive may always reach, however low the jet is, m/s. */
  driveFloorMps?: number;
  /** Engine acceleration in air relative to the jet's own (so the top speed comes in seconds). */
  airAccelScale?: number;
}

export const SPEED_TIERS: SpeedTier[] = [
  { id: 'jet', label: 'Jet' },
  { id: 'hypersonic', label: 'Hypersonic · Mach 6', airLimitMps: 2050, driveFloorMps: 1700, airAccelScale: 12 },
  { id: 'scramjet', label: 'Scramjet · Mach 25', airLimitMps: 8600, driveFloorMps: 7500, airAccelScale: 60 },
];

const DEG = Math.PI / 180;

/** Great-circle distance, km, on a 6,371 km sphere. */
export function greatCircleKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * DEG;
  const p2 = lat2 * DEG;
  const dp = p2 - p1;
  const dl = (lon2 - lon1) * DEG;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

export interface TransitPlan {
  /** Total time, s. */
  durationS: number;
  /** Cruise height, km. */
  cruiseKm: number;
  /** Height at hand-over, km. */
  endKm: number;
  startKm: number;
  distanceKm: number;
}

/** How long a transit takes and how high it flies, for a distance and a starting height. */
export function planTransit(distanceKm: number, startKm: number): TransitPlan {
  const cruiseKm = Math.min(60, Math.max(25, distanceKm * 0.02));
  // ~40 km/s on average over the whole trip (the peak is twice that), plus time to climb and land
  const durationS = Math.min(200, Math.max(18, distanceKm / 40 + 18));
  return { durationS, cruiseKm, endKm: 2.2, startKm: Math.max(0, startKm), distanceKm };
}

/**
 * Where along the route the jet is at time t: the fraction of the distance covered (0..1), and its
 * height, km. The speed along the route rises and falls smoothly (1 - cos), and the height climbs in
 * the first fifth and comes down in the last fifth.
 */
export function transitAt(plan: TransitPlan, t: number): { along: number; heightKm: number; done: boolean } {
  const x = Math.min(1, Math.max(0, t / plan.durationS));
  const along = x - Math.sin(2 * Math.PI * x) / (2 * Math.PI);
  const smooth = (e0: number, e1: number, v: number): number => {
    const k = Math.min(1, Math.max(0, (v - e0) / (e1 - e0)));
    return k * k * (3 - 2 * k);
  };
  const up = smooth(0, 0.2, x);
  const down = smooth(0.8, 1, x);
  const climbed = plan.startKm + (plan.cruiseKm - plan.startKm) * up;
  const heightKm = climbed + (plan.endKm - climbed) * down;
  return { along, heightKm, done: x >= 1 };
}

/** Direction on the unit sphere a fraction `f` of the way from a to b (spherical interpolation). */
export function slerpUnit(a: [number, number, number], b: [number, number, number], f: number): [number, number, number] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-9) return [a[0], a[1], a[2]];
  const s = Math.sin(om);
  const ka = Math.sin((1 - f) * om) / s;
  const kb = Math.sin(f * om) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}
