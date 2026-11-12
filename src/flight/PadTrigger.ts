/**
 * A gamepad trigger's pull, 0..1, measured from where it rests.
 *
 * Worn triggers do not return to zero: measured on an Xbox 360 pad, LT 0.14 and RT 0.24
 * untouched. Read as pulls, they crept the throttle up all the time (+0.06 a second), so the jet
 * sped up again whenever it was throttled back. Released here is the lowest value the trigger has
 * read, or any value under half-way it has held without moving for 1.5 s (a worn trigger can
 * come to rest at a different point after each pull; nobody holds a trigger that still); the
 * first 10% past that is ignored.
 */
export interface TriggerRest {
  rest: number;
  v: number;
  since: number;
}

export function triggerPull(state: TriggerRest | undefined, v: number, nowMs: number): { pull: number; state: TriggerRest } {
  const r = state ?? { rest: v, v, since: nowMs };
  if (Math.abs(v - r.v) > 0.01) {
    r.v = v;
    r.since = nowMs;
  } else if (nowMs - r.since > 1500 && v < 0.5) {
    r.rest = v;
  }
  r.rest = Math.min(r.rest, v);
  const free = v - r.rest - 0.1;
  const pull = free <= 0 ? 0 : Math.min(1, free / Math.max(0.2, 1 - r.rest - 0.1));
  return { pull, state: r };
}
