/**
 * The name of the place under the jet: town or city, region, country (OpenStreetMap Nominatim's
 * reverse geocoder). Nominatim's usage policy allows at most one request a second, so this asks
 * rarely: only after moving a few kilometres (more when high up), at most every 1.5 s, and
 * remembers every answer by grid cell. Until an answer arrives, the last one stands.
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

const cache = new Map<string, PlaceName | null>();
let inFlight = false;
let lastRequestMs = 0;
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
  if (inFlight || now - lastRequestMs < 1500 || (movedKm < minMoveKm && lastAsked?.zoom === zoom) || typeof fetch === 'undefined') return current;
  inFlight = true;
  lastRequestMs = now;
  lastAsked = { lat, lon, zoom };
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=${zoom}&addressdetails=1&accept-language=en&lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  fetch(url, { headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((r: NominatimReverse | null) => {
      const name = r ? formatAddress(r) : null;
      cache.set(key, name);
      if (r && r.error && !name) seaCells.add(key);
      atSea = seaCells.has(key);
      if (name) current = name;
    })
    .catch(() => cache.set(key, null))
    .finally(() => {
      inFlight = false;
    });
  return current;
}

/** Forget the last name (leaving Earth). */
export function clearPlaceName(): void {
  current = null;
  lastAsked = null;
}
