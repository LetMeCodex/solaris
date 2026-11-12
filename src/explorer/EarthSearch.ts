import { Landmark, registerDynamicLandmark } from './Landmarks';

interface NominatimHit {
  place_id: number;
  osm_type?: string;
  osm_id?: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  class?: string;
  type?: string;
  boundingbox?: [string, string, string, string];
}

const searchCache = new Map<string, Landmark[]>();

function pickAltitudeKm(hit: NominatimHit): number {
  const cls = (hit.class ?? '').toLowerCase();
  const typ = (hit.type ?? '').toLowerCase();
  if (
    cls === 'building' ||
    cls === 'tourism' ||
    cls === 'historic' ||
    cls === 'amenity' ||
    cls === 'man_made' ||
    cls === 'leisure' ||
    typ === 'attraction' ||
    typ === 'monument' ||
    typ === 'castle' ||
    typ === 'stadium' ||
    typ === 'tower' ||
    typ === 'bridge'
  ) {
    return 1.2;
  }
  if (cls === 'natural' || typ === 'peak' || typ === 'volcano' || typ === 'mountain_range') {
    return 4.0;
  }
  if (typ === 'country' || typ === 'state') {
    return 15.0;
  }
  return 2.2;
}

function formatPlaceName(hit: NominatimHit): { name: string; subtitle: string } {
  const parts = hit.display_name.split(',').map((s) => s.trim()).filter(Boolean);
  const primary = hit.name?.trim() || parts[0] || hit.display_name;
  const tail = parts.filter((p) => p.toLowerCase() !== primary.toLowerCase());
  const country = tail[tail.length - 1] ?? '';
  const region = tail.length > 1 ? tail[0] : '';
  const shortName = region && country && region !== country
    ? `${primary}, ${region}`
    : country
      ? `${primary}, ${country}`
      : primary;
  const subtitle = tail.slice(0, 4).join(', ') || 'Earth · 3D location';
  return { name: shortName, subtitle };
}

/**
 * Search any real-world location on Earth (cities, monuments, buildings, mountains, neighbourhoods,
 * airports, streets) and register each hit as a navigable Solaris Landmark.
 */
export async function searchEarthPlaces(query: string, signal?: AbortSignal): Promise<Landmark[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const key = q.toLowerCase();
  const cached = searchCache.get(key);
  if (cached) return cached;

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=8&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as NominatimHit[];
  if (!Array.isArray(data)) return [];

  const out: Landmark[] = [];
  for (const hit of data) {
    const lat = Number(hit.lat);
    const lon = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const { name, subtitle } = formatPlaceName(hit);
    const id = `earth-search-${hit.place_id}`;
    const lm = registerDynamicLandmark({
      id,
      name,
      body: 'Earth',
      lat: Math.round(lat * 100000) / 100000,
      lon: Math.round(lon * 100000) / 100000,
      viewAltitudeKm: pickAltitudeKm(hit),
      description: subtitle.slice(0, 160),
      scene: `${name} rendered in 3D via Google Photorealistic 3D Tiles.`,
      source: 'OpenStreetMap Nominatim · Google Photorealistic 3D Tiles',
    });
    out.push(lm);
  }
  searchCache.set(key, out);
  return out;
}
