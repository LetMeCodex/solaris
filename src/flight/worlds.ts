/**
 * How the jet's readouts are written, and the air of the worlds (shared with the planets'
 * atmospheres, see rendering/AirProfiles).
 */
export { AIR } from '../rendering/AirProfiles';
export type { AirProfile } from '../rendering/AirProfiles';

export const LIGHT_SPEED_KMS = 299_792.458;
export const AU_KM = 149_597_870.7;

/** Speed for the HUD: m/s, km/s, then multiples of light. */
export function formatSpeed(mps: number): string {
  const kms = mps / 1000;
  if (kms >= 0.01 * LIGHT_SPEED_KMS) {
    const c = kms / LIGHT_SPEED_KMS;
    return `${c >= 100 ? c.toFixed(0) : c >= 10 ? c.toFixed(1) : c.toFixed(2)} c`;
  }
  if (mps >= 10_000) return `${kms >= 1000 ? Math.round(kms).toLocaleString('en-US') : kms.toFixed(1)} km/s`;
  if (mps >= 1000) return `${kms.toFixed(2)} km/s`;
  return `${Math.round(mps)} m/s`;
}

/** Distance or altitude for the HUD: m, km, million km, then AU. */
export function formatDistance(km: number): string {
  const a = Math.abs(km);
  const LY_KM = 9.4607e12;
  if (a >= 0.5 * LY_KM) {
    const ly = km / LY_KM;
    return `${ly >= 100 ? Math.round(ly).toLocaleString('en-US') : ly.toFixed(1)} ly`;
  }
  if (a >= 0.1 * AU_KM) return `${(km / AU_KM).toFixed(a >= 10 * AU_KM ? 1 : 2)} AU`;
  if (a >= 1e6) return `${(km / 1e6).toFixed(2)} M km`;
  if (a >= 100) return `${Math.round(km).toLocaleString('en-US')} km`;
  if (a >= 1) return `${km.toFixed(1)} km`;
  return `${Math.round(km * 1000)} m`;
}

/** Time to arrival, for the target readout. */
export function formatEta(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return '—';
  if (seconds < 90) return `${Math.round(seconds)} s`;
  if (seconds < 5400) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400 * 2) return `${(seconds / 3600).toFixed(1)} h`;
  if (seconds < 86400 * 365 * 2) return `${Math.round(seconds / 86400)} d`;
  return `${(seconds / (86400 * 365.25)).toFixed(1)} yr`;
}

/** Session key: re-enter the jet (aiming at this target) after a reload for a new world scale. */
export const JET_RESUME_KEY = 'solaris.jetResume';
