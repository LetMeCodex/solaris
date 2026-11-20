import { LANDMARKS } from './Landmarks';

/**
 * The name of the place under the jet: town or city, region, country.
 * Tries BigDataCloud (CORS-open) with Photon and Nominatim fallbacks, avoiding request hangs
 * and permanent error caching when offline or rate-limited.
 */

export interface PlaceName {
  title: string;
  subtitle: string;
  /** The country alone (English), '' if none. */
  country?: string;
}

interface NominatimReverse {
  error?: string;
  name?: string;
  display_name?: string;
  address?: Record<string, string>;
}

interface BigDataCloudReverse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

interface PhotonReverse {
  features?: Array<{
    properties?: {
      name?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  }>;
}

const cache = new Map<string, PlaceName | null>();
let inFlight = false;
let lastRequestMs = 0;
let lastFailMs = 0;
let lastAsked: { lat: number; lon: number; zoom: number } | null = null;
let current: PlaceName | null = null;
/** The last answer was "nothing here": open sea (or the ice of the poles). */
let atSea = false;
const seaCells = new Set<string>();

/** Whether the latest answer said there is no place under the point (open sea). */
export function placeAtSea(): boolean {
  return atSea;
}

/** Nominatim's zoom for a height: street-level detail low down, country far up. */
export function zoomForHeight(altKm: number): number {
  if (altKm < 4) return 14;
  if (altKm < 25) return 10;
  if (altKm < 150) return 6;
  return 3;
}

/** Grid cell a reply stands for at a zoom (about 1 km at 14, ~150 km at 6). */
export function cellKey(lat: number, lon: number, zoom: number): string {
  const step = zoom >= 14 ? 0.01 : zoom >= 10 ? 0.1 : zoom >= 6 ? 1.5 : 10;
  return `${zoom}:${Math.round(lat / step)}:${Math.round(lon / step)}`;
}

/** Turn a reply into a title (the most local named place) and a subtitle (region, country). */
export function formatAddress(r: NominatimReverse): PlaceName | null {
  if (!r || r.error || !r.address) return null;
  const a = r.address;
  const local = a.city ?? a.town ?? a.village ?? a.suburb ?? a.municipality ?? a.hamlet ?? a.county ?? a.state_district ?? r.name ?? '';
  const region = a.state ?? a.region ?? a.province ?? a.county ?? '';
  const country = a.country ?? '';
  const title = local || region || country;
  if (!title) return null;
  const subtitle = [region !== title ? region : '', country !== title ? country : ''].filter(Boolean).join(', ');
  return { title, subtitle, country };
}

async function fetchJsonTimed<T>(url: string, timeoutMs: number): Promise<{ ok: boolean; data: T | null }> {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetch(url, { signal: ctrl?.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return { ok: false, data: null };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, data: null };
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

async function resolveOnlinePlace(lat: number, lon: number, zoom: number): Promise<{ ok: boolean; name: PlaceName | null; sea: boolean }> {
  // 1. BigDataCloud CORS-open client endpoint
  const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&localityLanguage=en`;
  const bdc = await fetchJsonTimed<BigDataCloudReverse>(bdcUrl, 4500);
  if (bdc.ok && bdc.data) {
    const r = bdc.data;
    const country = (r.countryName ?? '').trim();
    const region = (r.principalSubdivision ?? '').trim();
    const local = (r.city || r.locality || '').trim();
    if (!country) return { ok: true, name: null, sea: true };
    const title = local || region || country;
    const subtitle = [region !== title ? region : '', country !== title ? country : ''].filter(Boolean).join(', ');
    return { ok: true, name: { title, subtitle, country }, sea: false };
  }

  // 2. Photon reverse endpoint
  const phUrl = `https://photon.komoot.io/reverse?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&lang=en`;
  const ph = await fetchJsonTimed<PhotonReverse>(phUrl, 4500);
  if (ph.ok && ph.data) {
    const p = ph.data.features?.[0]?.properties;
    if (!p) return { ok: true, name: null, sea: true };
    const local = (p.name || p.city || '').trim();
    const region = (p.state || '').trim();
    const country = (p.country || '').trim();
    const title = local || region || country;
    if (!title) return { ok: true, name: null, sea: true };
    const subtitle = [region !== title ? region : '', country !== title ? country : ''].filter(Boolean).join(', ');
    return { ok: true, name: { title, subtitle, country }, sea: false };
  }

  // 3. OSM Nominatim reverse fallback
  const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=${zoom}&addressdetails=1&accept-language=en&lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const nom = await fetchJsonTimed<NominatimReverse>(nomUrl, 4500);
  if (nom.ok && nom.data) {
    const name = formatAddress(nom.data);
    return { ok: true, name, sea: !!nom.data.error && !name };
  }

  return { ok: false, name: null, sea: false };
}

function offlineFallbackPlace(lat: number, lon: number): PlaceName | null {
  const cosLat = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  let bestDist = Infinity;
  let bestName: string | null = null;
  for (const lm of LANDMARKS) {
    if (lm.body !== 'Earth') continue;
    const dKm = Math.hypot((lat - lm.lat) * 111.32, (lon - lm.lon) * 111.32 * cosLat);
    if (dKm < 45 && dKm < bestDist) {
      bestDist = dKm;
      bestName = lm.name;
    }
  }
  return bestName ? { title: bestName, subtitle: 'Earth landmark', country: '' } : null;
}

/**
 * The place name for a position (call every frame; it returns the latest known name at once and
 * asks for a new one in the background when it is due).
 */
export function placeNameAt(lat: number, lon: number, altKm: number): PlaceName | null {
  const zoom = zoomForHeight(altKm);
  const key = cellKey(lat, lon, zoom);
  if (cache.has(key)) {
    const hit = cache.get(key) ?? null;
    if (hit) current = hit;
    atSea = seaCells.has(key);
    return current;
  }
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const movedKm = lastAsked ? Math.hypot((lat - lastAsked.lat) * 111, (lon - lastAsked.lon) * 111 * Math.cos((lat * Math.PI) / 180)) : Infinity;
  const minMoveKm = zoom >= 14 ? 1.5 : zoom >= 10 ? 8 : 60;
  if (
    inFlight ||
    now - lastRequestMs < 1500 ||
    now - lastFailMs < 5000 ||
    (movedKm < minMoveKm && lastAsked?.zoom === zoom) ||
    typeof fetch === 'undefined'
  ) {
    return current ?? offlineFallbackPlace(lat, lon);
  }
  inFlight = true;
  lastRequestMs = now;
  lastAsked = { lat, lon, zoom };
  resolveOnlinePlace(lat, lon, zoom)
    .then((res) => {
      if (!res.ok) {
        lastFailMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const fb = offlineFallbackPlace(lat, lon);
        if (fb) current = fb;
        return;
      }
      cache.set(key, res.name);
      if (res.sea) seaCells.add(key);
      atSea = seaCells.has(key);
      if (res.name) current = res.name;
    })
    .catch(() => {
      lastFailMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    })
    .finally(() => {
      inFlight = false;
    });
  return current ?? offlineFallbackPlace(lat, lon);
}

/** Forget the last name (leaving Earth). */
export function clearPlaceName(): void {
  current = null;
  lastAsked = null;
}
