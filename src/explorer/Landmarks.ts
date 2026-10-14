/**
 * Curated landmarks. Coordinates are the reference coordinates published with each feature's
 * Wikipedia article (for planetary features these come from the IAU/USGS Gazetteer of Planetary
 * Nomenclature), fetched with scripts/fetch-landmark-coords.mjs → docs/research/landmark-coords.txt.
 * Longitudes are east-positive and normalised to [−180, 180].
 */
export interface Landmark {
  id: string;
  name: string;
  body: string;
  lat: number;
  lon: number;
  description: string;
  /** Viewing altitude for fly-to, km above the surface. */
  viewAltitudeKm: number;
  source: string;
}

const WIKI = 'Wikipedia coordinates (IAU/USGS Gazetteer of Planetary Nomenclature)';
const WIKI_EARTH = 'Wikipedia coordinates';

/** East-positive 0–360° → [−180, 180]. */
const e = (lon: number) => (lon > 180 ? lon - 360 : lon);

export const LANDMARKS: Landmark[] = [
  // Earth
  { id: 'earth-everest', name: 'Mount Everest', body: 'Earth', lat: 27.98833, lon: 86.92528, viewAltitudeKm: 900, source: WIKI_EARTH, description: 'Highest summit above sea level (8,849 m), on the Nepal–China border in the Himalaya.' },
  { id: 'earth-grand-canyon', name: 'Grand Canyon', body: 'Earth', lat: 36.3, lon: -112.75, viewAltitudeKm: 700, source: WIKI_EARTH, description: 'Canyon carved by the Colorado River through the Colorado Plateau, Arizona.' },
  { id: 'earth-richat', name: 'Richat Structure', body: 'Earth', lat: 21.1147, lon: -11.3943, viewAltitudeKm: 600, source: WIKI_EARTH, description: 'A 40 km eroded dome in the Sahara of Mauritania, a landmark for astronauts.' },
  { id: 'earth-baikal', name: 'Lake Baikal', body: 'Earth', lat: 53.5, lon: 108.0, viewAltitudeKm: 1500, source: WIKI_EARTH, description: "The world's deepest and oldest lake, in a continental rift in Siberia." },
  { id: 'earth-nile-delta', name: 'Nile Delta', body: 'Earth', lat: 30.9, lon: 31.11667, viewAltitudeKm: 800, source: WIKI_EARTH, description: 'Green, densely farmed fan of the Nile against the desert, Egypt.' },
  // Moon
  { id: 'moon-tycho', name: 'Tycho', body: 'Moon', lat: -43.31, lon: -11.36, viewAltitudeKm: 300, source: WIKI, description: 'Young 85 km crater with a bright ray system visible from Earth.' },
  { id: 'moon-copernicus', name: 'Copernicus', body: 'Moon', lat: 9.62, lon: -20.08, viewAltitudeKm: 300, source: WIKI, description: '93 km crater with terraced walls and central peaks in Oceanus Procellarum.' },
  { id: 'moon-tranquility', name: 'Tranquility Base', body: 'Moon', lat: 0.6875, lon: 23.43333, viewAltitudeKm: 250, source: WIKI, description: 'Apollo 11 landing site, 20 July 1969, in Mare Tranquillitatis.' },
  { id: 'moon-imbrium', name: 'Mare Imbrium', body: 'Moon', lat: 32.8, lon: -15.6, viewAltitudeKm: 1200, source: WIKI, description: 'Vast basalt-flooded impact basin, about 1,100 km across.' },
  { id: 'moon-shackleton', name: 'Shackleton', body: 'Moon', lat: -89.67, lon: 129.78, viewAltitudeKm: 400, source: WIKI, description: 'Permanently shadowed crater at the lunar south pole (strongly stretched in this map projection).' },
  // Mercury
  { id: 'mercury-caloris', name: 'Caloris Planitia', body: 'Mercury', lat: 30.5, lon: e(198.8), viewAltitudeKm: 2500, source: WIKI, description: 'Impact basin about 1,550 km across, one of the largest in the Solar System.' },
  { id: 'mercury-hokusai', name: 'Hokusai', body: 'Mercury', lat: 58.3, lon: e(342.3), viewAltitudeKm: 600, source: WIKI, description: '114 km crater with an extensive bright ray system.' },
  { id: 'mercury-rachmaninoff', name: 'Rachmaninoff', body: 'Mercury', lat: 27.6, lon: e(302.4), viewAltitudeKm: 600, source: WIKI, description: 'Peak-ring basin about 290 km across with smooth volcanic plains inside.' },
  // Venus (radar)
  { id: 'venus-maxwell', name: 'Maxwell Montes', body: 'Venus', lat: 65.2, lon: 3.3, viewAltitudeKm: 1500, source: WIKI, description: 'Highest mountain range on Venus, about 11 km above the mean surface.' },
  { id: 'venus-maat', name: 'Maat Mons', body: 'Venus', lat: 0.5, lon: e(194.6), viewAltitudeKm: 1200, source: WIKI, description: 'Largest volcano on Venus, about 8 km high.' },
  { id: 'venus-aphrodite', name: 'Aphrodite Terra', body: 'Venus', lat: -5.8, lon: 104.8, viewAltitudeKm: 6000, source: WIKI, description: 'Equatorial highland roughly the size of South America.' },
  // Mars
  { id: 'mars-olympus', name: 'Olympus Mons', body: 'Mars', lat: 18.65, lon: e(226.2), viewAltitudeKm: 1200, source: WIKI, description: 'Shield volcano about 22 km high and 600 km across, the tallest in the Solar System.' },
  { id: 'mars-valles', name: 'Valles Marineris', body: 'Mars', lat: -13.9, lon: e(300.8), viewAltitudeKm: 2500, source: WIKI, description: 'Canyon system over 4,000 km long and up to 7 km deep.' },
  { id: 'mars-gale', name: 'Gale crater', body: 'Mars', lat: -5.4, lon: 137.8, viewAltitudeKm: 500, source: WIKI, description: 'Landing site of the Curiosity rover (2012), with Mount Sharp at its centre.' },
  { id: 'mars-jezero', name: 'Jezero crater', body: 'Mars', lat: 18.38, lon: 77.58, viewAltitudeKm: 400, source: WIKI, description: 'Ancient lake basin and river delta, landing site of Perseverance (2021).' },
  { id: 'mars-hellas', name: 'Hellas Planitia', body: 'Mars', lat: -42.4, lon: 70.5, viewAltitudeKm: 3000, source: WIKI, description: 'Impact basin about 2,300 km across and over 7 km deep.' },
];

export function landmarksFor(body: string): Landmark[] {
  return LANDMARKS.filter((l) => l.body === body);
}

export function searchLandmarks(query: string): Landmark[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return LANDMARKS.filter((l) => l.name.toLowerCase().includes(q) || l.body.toLowerCase().includes(q));
}

export function getLandmark(id: string): Landmark | undefined {
  return LANDMARKS.find((l) => l.id === id);
}
