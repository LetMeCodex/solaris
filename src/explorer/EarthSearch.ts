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

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    osm_id?: number;
    osm_type?: string;
    osm_key?: string;
    osm_value?: string;
    type?: string;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    extent?: [number, number, number, number]; // [west, north, east, south]
  };
}

interface OpenMeteoHit {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
}

interface BuiltinPlace {
  id: string;
  name: string;
  keywords: string;
  lat: number;
  lon: number;
  altKm: number;
  subtitle: string;
}

const BUILTIN_PLACES: BuiltinPlace[] = [
  { id: 'india', name: 'India', keywords: 'india bharat republic', lat: 21.1458, lon: 79.0882, altKm: 950, subtitle: 'South Asia · Country' },
  { id: 'new-delhi', name: 'New Delhi, India', keywords: 'new delhi india capital', lat: 28.6139, lon: 77.2090, altKm: 8.0, subtitle: 'Delhi, India · Capital city' },
  { id: 'mumbai', name: 'Mumbai, India', keywords: 'mumbai bombay maharashtra india', lat: 19.0760, lon: 72.8777, altKm: 8.0, subtitle: 'Maharashtra, India · Coastal metropolis' },
  { id: 'bengaluru', name: 'Bengaluru, India', keywords: 'bengaluru bangalore karnataka india', lat: 12.9716, lon: 77.5946, altKm: 8.0, subtitle: 'Karnataka, India · City' },
  { id: 'taj-mahal', name: 'Taj Mahal, Agra', keywords: 'taj mahal agra india monument', lat: 27.1751, lon: 78.0421, altKm: 1.2, subtitle: 'Agra, Uttar Pradesh, India · Monument' },
  { id: 'kathmandu', name: 'Kathmandu, Nepal', keywords: 'kathmandu nepal himalaya capital', lat: 27.7172, lon: 85.3240, altKm: 6.0, subtitle: 'Bagmati, Nepal · Himalayan valley' },
  { id: 'nepal', name: 'Nepal', keywords: 'nepal himalaya everest', lat: 28.3949, lon: 84.1240, altKm: 260, subtitle: 'Himalaya, South Asia · Country' },
  { id: 'united-states', name: 'United States', keywords: 'united states usa america', lat: 39.8283, lon: -98.5795, altKm: 1400, subtitle: 'North America · Country' },
  { id: 'united-kingdom', name: 'United Kingdom', keywords: 'united kingdom uk britain england', lat: 54.0, lon: -2.0, altKm: 420, subtitle: 'Western Europe · Country' },
  { id: 'france', name: 'France', keywords: 'france europe', lat: 46.2276, lon: 2.2137, altKm: 450, subtitle: 'Western Europe · Country' },
  { id: 'germany', name: 'Germany', keywords: 'germany deutschland europe', lat: 51.1657, lon: 10.4515, altKm: 380, subtitle: 'Central Europe · Country' },
  { id: 'italy', name: 'Italy', keywords: 'italy italia europe', lat: 41.8719, lon: 12.5674, altKm: 450, subtitle: 'Southern Europe · Country' },
  { id: 'spain', name: 'Spain', keywords: 'spain espana europe', lat: 40.4637, lon: -3.7492, altKm: 450, subtitle: 'Iberian Peninsula, Europe · Country' },
  { id: 'switzerland', name: 'Switzerland', keywords: 'switzerland schweiz suisse alps', lat: 46.8182, lon: 8.2275, altKm: 160, subtitle: 'Central Europe · Alpine country' },
  { id: 'norway', name: 'Norway', keywords: 'norway scandinavia fjords', lat: 60.4720, lon: 8.4689, altKm: 550, subtitle: 'Northern Europe · Country' },
  { id: 'iceland', name: 'Iceland', keywords: 'iceland reykjavik', lat: 64.9631, lon: -19.0208, altKm: 220, subtitle: 'North Atlantic · Island nation' },
  { id: 'reykjavik', name: 'Reykjavík, Iceland', keywords: 'reykjavik iceland capital', lat: 64.1466, lon: -21.9426, altKm: 5.0, subtitle: 'Iceland · Capital city' },
  { id: 'japan', name: 'Japan', keywords: 'japan nihon asia', lat: 36.2048, lon: 138.2529, altKm: 600, subtitle: 'East Asia · Island nation' },
  { id: 'china', name: 'China', keywords: 'china prc asia', lat: 35.8617, lon: 104.1954, altKm: 1400, subtitle: 'East Asia · Country' },
  { id: 'beijing', name: 'Beijing, China', keywords: 'beijing peking china capital', lat: 39.9042, lon: 116.4074, altKm: 10.0, subtitle: 'China · Capital city' },
  { id: 'shanghai', name: 'Shanghai, China', keywords: 'shanghai china', lat: 31.2304, lon: 121.4737, altKm: 8.0, subtitle: 'China · Metropolis' },
  { id: 'south-korea', name: 'South Korea', keywords: 'south korea republic of korea', lat: 35.9078, lon: 127.7669, altKm: 220, subtitle: 'East Asia · Country' },
  { id: 'seoul', name: 'Seoul, South Korea', keywords: 'seoul korea capital', lat: 37.5665, lon: 126.9780, altKm: 8.0, subtitle: 'South Korea · Capital city' },
  { id: 'singapore', name: 'Singapore', keywords: 'singapore asia', lat: 1.3521, lon: 103.8198, altKm: 8.0, subtitle: 'Southeast Asia · City-state' },
  { id: 'dubai', name: 'Dubai, UAE', keywords: 'dubai uae burj khalifa', lat: 25.2048, lon: 55.2708, altKm: 4.0, subtitle: 'United Arab Emirates · City' },
  { id: 'burj-khalifa', name: 'Burj Khalifa, Dubai', keywords: 'burj khalifa dubai uae tower', lat: 25.1972, lon: 55.2744, altKm: 1.2, subtitle: 'Dubai, United Arab Emirates · World tallest tower' },
  { id: 'australia', name: 'Australia', keywords: 'australia oceania', lat: -25.2744, lon: 133.7751, altKm: 1300, subtitle: 'Oceania · Country' },
  { id: 'canada', name: 'Canada', keywords: 'canada north america', lat: 56.1304, lon: -106.3468, altKm: 1400, subtitle: 'North America · Country' },
  { id: 'brazil', name: 'Brazil', keywords: 'brazil brasil south america', lat: -14.2350, lon: -51.9253, altKm: 1200, subtitle: 'South America · Country' },
  { id: 'mexico', name: 'Mexico', keywords: 'mexico north america', lat: 23.6345, lon: -102.5528, altKm: 850, subtitle: 'North America · Country' },
  { id: 'peru', name: 'Peru', keywords: 'peru andes south america', lat: -9.1900, lon: -75.0152, altKm: 600, subtitle: 'South America · Country' },
  { id: 'chile', name: 'Chile', keywords: 'chile patagonia andes', lat: -35.6751, lon: -71.5430, altKm: 750, subtitle: 'South America · Country' },
  { id: 'argentina', name: 'Argentina', keywords: 'argentina south america', lat: -38.4161, lon: -63.6167, altKm: 950, subtitle: 'South America · Country' },
  { id: 'egypt', name: 'Egypt', keywords: 'egypt africa nile', lat: 26.8206, lon: 30.8025, altKm: 480, subtitle: 'North Africa · Country' },
  { id: 'cairo', name: 'Cairo, Egypt', keywords: 'cairo egypt capital', lat: 30.0444, lon: 31.2357, altKm: 8.0, subtitle: 'Egypt · Capital city' },
  { id: 'kenya', name: 'Kenya', keywords: 'kenya africa nairobi', lat: -0.0236, lon: 37.9062, altKm: 420, subtitle: 'East Africa · Country' },
  { id: 'south-africa', name: 'South Africa', keywords: 'south africa cape town', lat: -30.5595, lon: 22.9375, altKm: 650, subtitle: 'Southern Africa · Country' },
  { id: 'russia', name: 'Russia', keywords: 'russia siberia eurasia', lat: 61.5240, lon: 105.3188, altKm: 1800, subtitle: 'Northern Eurasia · Country' },
  { id: 'moscow', name: 'Moscow, Russia', keywords: 'moscow russia capital', lat: 55.7558, lon: 37.6173, altKm: 8.0, subtitle: 'Russia · Capital city' },
  { id: 'antarctica', name: 'Antarctica', keywords: 'antarctica south pole', lat: -75.2509, lon: -0.0714, altKm: 1600, subtitle: 'Southern Hemisphere · Continent' },
  { id: 'himalayas', name: 'Himalayas', keywords: 'himalaya himalayas nepal tibet mountains', lat: 28.0, lon: 86.5, altKm: 80, subtitle: 'Asia · Mountain range' },
  { id: 'k2', name: 'K2 (Mount Godwin-Austen)', keywords: 'k2 karakoram pakistan mountain peak', lat: 35.8808, lon: 76.5155, altKm: 6.0, subtitle: 'Karakoram, Pakistan–China · 8,611 m summit' },
  { id: 'alps', name: 'Swiss & French Alps', keywords: 'alps mont blanc matterhorn switzerland', lat: 46.2, lon: 7.5, altKm: 60, subtitle: 'Central Europe · Mountain range' },
  { id: 'paris', name: 'Paris, France', keywords: 'paris france capital', lat: 48.8566, lon: 2.3522, altKm: 6.0, subtitle: 'Île-de-France, France · Capital city' },
  { id: 'london', name: 'London, United Kingdom', keywords: 'london uk england capital', lat: 51.5072, lon: -0.1276, altKm: 8.0, subtitle: 'England, United Kingdom · Capital city' },
  { id: 'tokyo', name: 'Tokyo, Japan', keywords: 'tokyo japan capital', lat: 35.6762, lon: 139.6503, altKm: 10.0, subtitle: 'Kantō, Japan · Capital city' },
  { id: 'new-york', name: 'New York City, USA', keywords: 'new york nyc manhattan usa', lat: 40.7128, lon: -74.0060, altKm: 8.0, subtitle: 'New York, United States · Metropolis' },
  { id: 'rome', name: 'Rome, Italy', keywords: 'rome roma italy capital', lat: 41.9028, lon: 12.4964, altKm: 6.0, subtitle: 'Lazio, Italy · Capital city' },
  { id: 'istanbul', name: 'Istanbul, Turkey', keywords: 'istanbul turkey turkiye bosphorus', lat: 41.0082, lon: 28.9784, altKm: 8.0, subtitle: 'Turkey · Transcontinental city' },
  { id: 'rio', name: 'Rio de Janeiro, Brazil', keywords: 'rio de janeiro brazil', lat: -22.9068, lon: -43.1729, altKm: 8.0, subtitle: 'Rio de Janeiro, Brazil · Coastal city' },
  { id: 'sydney', name: 'Sydney, Australia', keywords: 'sydney nsw australia', lat: -33.8688, lon: 151.2093, altKm: 8.0, subtitle: 'New South Wales, Australia · Harbour city' },
  { id: 'zurich', name: 'Zurich, Switzerland', keywords: 'zurich switzerland', lat: 47.3769, lon: 8.5417, altKm: 5.0, subtitle: 'Switzerland · Lakeside city' },
];

const searchCache = new Map<string, Landmark[]>();

function spanAltitudeKm(west: number, south: number, east: number, north: number): number | null {
  if (![west, south, east, north].every(Number.isFinite)) return null;
  const dLatKm = Math.abs(north - south) * 111.32;
  const midLatRad = ((south + north) * 0.5 * Math.PI) / 180;
  const dLonKm = Math.abs(east - west) * 111.32 * Math.max(0.2, Math.cos(midLatRad));
  const span = Math.max(dLatKm, dLonKm);
  if (span <= 0) return null;
  return Math.max(1.2, Math.min(1800, span * 0.65));
}

function pickAltitudeFromKind(cls: string, typ: string): number {
  const c = cls.toLowerCase();
  const t = typ.toLowerCase();
  if (
    c === 'building' ||
    c === 'tourism' ||
    c === 'historic' ||
    c === 'amenity' ||
    c === 'man_made' ||
    c === 'leisure' ||
    t === 'attraction' ||
    t === 'monument' ||
    t === 'castle' ||
    t === 'stadium' ||
    t === 'tower' ||
    t === 'bridge'
  ) {
    return 1.2;
  }
  if (c === 'natural' || t === 'peak' || t === 'volcano' || t === 'mountain_range' || t === 'glacier' || t === 'mt' || t === 'pk') {
    return 4.5;
  }
  if (t === 'country' || t === 'pcli') return 450;
  if (t === 'state' || t === 'region' || t === 'adm1') return 140;
  if (t === 'city' || t === 'town' || t === 'pplc' || t === 'ppla' || t === 'ppl') return 8.0;
  return 2.5;
}

function formatNominatimName(hit: NominatimHit): { name: string; subtitle: string } {
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

function abortError(): Error {
  return typeof DOMException !== 'undefined' ? new DOMException('Aborted', 'AbortError') : new Error('AbortError');
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs: number, outerSignal?: AbortSignal): Promise<T | null> {
  if (outerSignal?.aborted) throw abortError();
  if (typeof fetch === 'undefined') return null;
  const ctrl = new AbortController();
  const onOuterAbort = () => ctrl.abort();
  outerSignal?.addEventListener('abort', onOuterAbort, { once: true });
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (outerSignal?.aborted) throw abortError();
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    if (outerSignal?.aborted) throw err;
    return null;
  } finally {
    clearTimeout(timer);
    outerSignal?.removeEventListener('abort', onOuterAbort);
  }
}

function registerSearchHit(
  id: string,
  name: string,
  lat: number,
  lon: number,
  viewAltitudeKm: number,
  description: string,
  source: string
): Landmark {
  return registerDynamicLandmark({
    id,
    name,
    body: 'Earth',
    lat: Math.round(lat * 100000) / 100000,
    lon: Math.round(lon * 100000) / 100000,
    viewAltitudeKm,
    description: description.slice(0, 160),
    scene: `${name} seen over 3D terrain and atmospheric sky.`.slice(0, 160),
    source,
  });
}

async function queryPhoton(q: string, signal?: AbortSignal): Promise<Landmark[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lang=en`;
  const data = await fetchJsonWithTimeout<{ features?: PhotonFeature[] }>(url, 4000, signal);
  if (!data || !Array.isArray(data.features)) return [];
  const out: Landmark[] = [];
  for (const f of data.features) {
    const coords = f.geometry?.coordinates;
    if (!coords || coords.length < 2) continue;
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const p = f.properties ?? {};
    const primary = p.name || p.city || p.state || p.country || 'Unknown place';
    const tail = [p.city, p.state, p.country].filter((x): x is string => !!x && x.toLowerCase() !== primary.toLowerCase());
    const name = tail[0] && tail[tail.length - 1] && tail[0] !== tail[tail.length - 1]
      ? `${primary}, ${tail[tail.length - 1]}`
      : tail[0]
        ? `${primary}, ${tail[0]}`
        : primary;
    const extentAlt = p.extent ? spanAltitudeKm(p.extent[0], p.extent[3], p.extent[2], p.extent[1]) : null;
    const altKm = extentAlt ?? pickAltitudeFromKind(p.osm_key ?? '', p.osm_value ?? p.type ?? '');
    const id = `earth-search-ph-${p.osm_type ?? 'n'}${p.osm_id ?? `${Math.round(lat * 1e4)}_${Math.round(lon * 1e4)}`}`;
    out.push(
      registerSearchHit(
        id,
        name,
        lat,
        lon,
        altKm,
        tail.join(', ') || 'Earth · OpenStreetMap location',
        'Photon OpenStreetMap Geocoder · Wikipedia / Gazetteer'
      )
    );
  }
  return out;
}

async function queryOpenMeteo(q: string, signal?: AbortSignal): Promise<Landmark[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
  const data = await fetchJsonWithTimeout<{ results?: OpenMeteoHit[] }>(url, 4000, signal);
  if (!data || !Array.isArray(data.results)) return [];
  const out: Landmark[] = [];
  for (const hit of data.results) {
    const lat = Number(hit.latitude);
    const lon = Number(hit.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const tail = [hit.admin1, hit.country].filter((x): x is string => !!x && x.toLowerCase() !== hit.name.toLowerCase());
    const name = hit.country && hit.country.toLowerCase() !== hit.name.toLowerCase()
      ? `${hit.name}, ${hit.country}`
      : hit.name;
    const altKm = pickAltitudeFromKind('', hit.feature_code ?? '');
    out.push(
      registerSearchHit(
        `earth-search-om-${hit.id}`,
        name,
        lat,
        lon,
        altKm,
        tail.join(', ') || 'Earth · Geographic place',
        'Open-Meteo Geocoding · Gazetteer'
      )
    );
  }
  return out;
}

async function queryNominatim(q: string, signal?: AbortSignal): Promise<Landmark[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=8&q=${encodeURIComponent(q)}`;
  const data = await fetchJsonWithTimeout<NominatimHit[]>(url, 3500, signal);
  if (!Array.isArray(data)) return [];
  const out: Landmark[] = [];
  for (const hit of data) {
    const lat = Number(hit.lat);
    const lon = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const { name, subtitle } = formatNominatimName(hit);
    const bb = hit.boundingbox;
    const bbAlt = bb && bb.length === 4 ? spanAltitudeKm(Number(bb[2]), Number(bb[0]), Number(bb[3]), Number(bb[1])) : null;
    const altKm = bbAlt ?? pickAltitudeFromKind(hit.class ?? '', hit.type ?? '');
    out.push(
      registerSearchHit(
        `earth-search-${hit.place_id}`,
        name,
        lat,
        lon,
        altKm,
        subtitle,
        'OpenStreetMap Nominatim · Gazetteer'
      )
    );
  }
  return out;
}

function searchBuiltinPlaces(q: string): Landmark[] {
  const needle = q.toLowerCase();
  const matches = BUILTIN_PLACES.filter(
    (p) => p.name.toLowerCase().includes(needle) || p.keywords.includes(needle) || p.subtitle.toLowerCase().includes(needle)
  );
  matches.sort((a, b) => {
    const aExact = a.name.toLowerCase().startsWith(needle) ? 0 : 1;
    const bExact = b.name.toLowerCase().startsWith(needle) ? 0 : 1;
    return aExact - bExact;
  });
  return matches.slice(0, 8).map((p) =>
    registerSearchHit(
      `earth-search-local-${p.id}`,
      p.name,
      p.lat,
      p.lon,
      p.altKm,
      p.subtitle,
      'Solaris Offline Gazetteer · Gazetteer'
    )
  );
}

/**
 * Search any real-world location on Earth (countries, cities, monuments, buildings, mountains,
 * neighbourhoods, airports, streets) with CORS-safe live fallbacks and offline gazetteer support.
 */
export async function searchEarthPlaces(query: string, signal?: AbortSignal): Promise<Landmark[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const key = q.toLowerCase();
  const cached = searchCache.get(key);
  if (cached) return cached;

  // Cascade across CORS-friendly providers so 403/rate-limit/CORS issues on one endpoint never break search
  let liveHits = await queryPhoton(q, signal);
  if (liveHits.length === 0) liveHits = await queryOpenMeteo(q, signal);
  if (liveHits.length === 0) liveHits = await queryNominatim(q, signal);

  if (liveHits.length > 0) {
    searchCache.set(key, liveHits);
    return liveHits;
  }
  return searchBuiltinPlaces(q);
}
