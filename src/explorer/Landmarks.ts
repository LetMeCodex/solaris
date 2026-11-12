/**
 * Curated landmarks: places worth flying to, landing at and looking around.
 *
 * Coordinates
 * - Other worlds: the IAU/USGS Gazetteer of Planetary Nomenclature, from its GIS centre-point
 *   files (asc-planetarynames-data …_nomenclature_center_pts), which give every feature in
 *   planetocentric latitude and east-positive longitude, 0–360°. Each `source` names the
 *   Gazetteer feature number (planetarynames.wr.usgs.gov/Feature/<n>). Where the Gazetteer's
 *   own page quotes west-positive planetographic values (Mercury, the outer moons) these files
 *   are still east-positive, so the numbers here are east-positive throughout.
 * - Spacecraft landing sites that are not Gazetteer features (Apollo 15 and 17, Venera 13,
 *   Huygens) use the coordinates on their Wikipedia articles; exceptions are noted per entry.
 * - Earth: the coordinates on each place's Wikipedia article.
 * Longitudes are east-positive and normalised to [−180, 180] with `e()`.
 *
 * Landing views
 * - `viewHeadingDeg` is the compass heading (0 = north, 90 = east) to look from the spot.
 *   Most are computed, not guessed: the great-circle bearing towards a named, sourced point.
 *   On a tidally locked moon the parent planet hangs over 0°N 0°E (the IAU prime meridian of
 *   the Moon, the Galilean and Saturnian moons, Miranda, Triton and Charon faces the planet;
 *   Pluto's faces Charon), so `towards: PARENT` looks straight at it. Absent = a panorama.
 * - The planet altitudes quoted in `scene` are 90° minus the angular distance to 0°N 0°E.
 */
import { BODY_IMAGERY, RADII_KM, imageryEyeKm } from './ImageryRegistry';
import { RELIEF_BODIES } from './PlanetElevation';

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
  /** Compass heading (0 = north, clockwise) of the most striking direction to look on landing. */
  viewHeadingDeg?: number;
  /** Pitch angle (degrees up from horizon, positive = looking up) on landing. */
  viewPitchDeg?: number;
  /** Nearby scenic vantage latitude for human/surface view so you look AT the landmark instead of sitting on its roof. */
  vantageLat?: number;
  /** Nearby scenic vantage longitude for human/surface view. */
  vantageLon?: number;
  /** Elevation above local ground in km (e.g. 0.015 = 15m terrace/overlook). */
  vantageAltKm?: number;
  /** One sentence on what you see standing there. */
  scene?: string;
  /**
   * Other worlds: Sun height (degrees) a landing waits for when it arrives in the dark (default 25:
   * low light shows the relief). Lower where the shadows make the place, higher in deep craters.
   */
  sunAltitudeDeg?: number;
}

/** Gazetteer feature citation. */
const GAZ = (feature: number) => `IAU/USGS Gazetteer of Planetary Nomenclature, Feature ${feature} (planetocentric, east-positive)`;
/** Wikipedia article coordinates. */
const WIKI = (article: string) => `Wikipedia coordinates: ${article}`;

/** East-positive 0–360° → [−180, 180]. */
const e = (lon: number) => (lon > 180 ? lon - 360 : lon);

/** Sub-planet point of a tidally locked moon (and sub-Charon point on Pluto). */
const PARENT: readonly [number, number] = [0, 0];

const toRad = Math.PI / 180;

/** Initial great-circle bearing from one point to another, degrees clockwise from north, [0, 360). */
export function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * toRad;
  const p2 = lat2 * toRad;
  const dl = (lon2 - lon1) * toRad;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (Math.atan2(y, x) / toRad + 360) % 360;
}

/** Angular distance between two points on a sphere, degrees. */
export function angularDistanceDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * toRad;
  const p2 = lat2 * toRad;
  const c = Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos((lon2 - lon1) * toRad);
  return Math.acos(Math.min(1, Math.max(-1, c))) / toRad;
}

/** A catalogue entry before its heading is resolved: `towards` is a sourced point to look at. */
type Entry = Landmark & { towards?: readonly [number, number] };

// Points looked towards (each sourced like a landmark)
const OLKHON = [53.15667, 107.38361] as const; // Wikipedia: Olkhon Island
const CAIRO = [30.04444, 31.23583] as const; // Wikipedia: Cairo
const VATNAJOKULL = [64.4, -16.8] as const; // Wikipedia: Vatnajökull
const ROSS_ICE_SHELF = [-81.5, -175] as const; // Wikipedia: Ross Ice Shelf
const KATA_TJUTA = [-25.3, 130.73333] as const; // Wikipedia: Kata Tjuta
const GEIRANGER = [62.1019, 7.2072] as const; // Wikipedia: Geiranger
const MAWENZI = [-3.0925, 37.45583] as const; // Wikipedia: Mawenzi
const TUNUPA = [-19.8325, -67.64583] as const; // Wikipedia: Tunupa
const MONS_HADLEY = [26.695, 4.118] as const; // Gazetteer 3983
const AEOLIS_MONS = [-5.083, 137.845] as const; // Gazetteer 15000 (Mount Sharp)
const NERETVA_VALLIS = [18.55, 77.2] as const; // Gazetteer 15879
const SPUTNIK_PLANITIA = [19.51, 178.69] as const; // Gazetteer 15669
const VINALIA_FACULAE = [20.2, e(242.0)] as const; // Gazetteer 15531

const ENTRIES: Entry[] = [
  // ── Earth ──────────────────────────────────────────────────────────────────────────────────
  { id: 'earth-everest', name: 'Mount Everest', body: 'Earth', lat: 27.98833, lon: 86.92528, viewAltitudeKm: 6.0, source: WIKI('Mount Everest'),
    vantageLat: 27.9958, vantageLon: 86.8285, vantageAltKm: 0.08, viewHeadingDeg: 105, viewPitchDeg: 14,
    description: 'Highest summit above sea level (8,849 m), on the Nepal–China border in the Himalaya.',
    scene: 'From the Kala Patthar ridge, the black pyramid of Everest rises majestic against the Tibetan sky.' },
  { id: 'earth-grand-canyon', name: 'Grand Canyon', body: 'Earth', lat: 36.0570, lon: -112.1430, viewAltitudeKm: 2.5, source: WIKI('Grand Canyon'),
    vantageLat: 36.0600, vantageLon: -112.1430, vantageAltKm: 0.08, viewHeadingDeg: 350, viewPitchDeg: -6,
    description: 'Canyon carved by the Colorado River through the Colorado Plateau, Arizona.',
    scene: 'From Mather Point on the South Rim, banded red rock walls fall 1.8 km to the Colorado River beneath the vast desert sky.' },
  { id: 'earth-richat', name: 'Richat Structure', body: 'Earth', lat: 21.1147, lon: -11.3943, viewAltitudeKm: 30.0, source: WIKI('Richat Structure'),
    vantageLat: 21.1147, vantageLon: -11.3943, vantageAltKm: 1.5, viewHeadingDeg: 0, viewPitchDeg: -15,
    description: 'A 40 km eroded dome in the Sahara of Mauritania, a landmark for astronauts.',
    scene: 'Concentric rings of hard rock ripple out across the desert in every direction.' },
  { id: 'earth-baikal', name: 'Lake Baikal', body: 'Earth', lat: 53.5, lon: 108.0, viewAltitudeKm: 25.0, source: WIKI('Lake Baikal'), towards: OLKHON,
    vantageLat: 53.2, vantageLon: 107.5, vantageAltKm: 0.05, viewHeadingDeg: 45, viewPitchDeg: 6,
    description: "The world's deepest and oldest lake, in a continental rift in Siberia.",
    scene: 'Clear water over a rift more than 1.6 km deep, with Olkhon Island, the largest in the lake, to the south-west.' },
  { id: 'earth-nile-delta', name: 'Nile Delta', body: 'Earth', lat: 30.9, lon: 31.11667, viewAltitudeKm: 40.0, source: WIKI('Nile Delta'), towards: CAIRO,
    description: 'Green, densely farmed fan of the Nile against the desert, Egypt.',
    scene: 'The green fan narrows south towards Cairo, where the Nile leaves its desert valley.' },
  { id: 'earth-jokulsarlon', name: 'Jökulsárlón', body: 'Earth', lat: 64.07028, lon: -16.21167, viewAltitudeKm: 2.0, source: WIKI('Jökulsárlón'), towards: VATNAJOKULL,
    vantageLat: 64.0480, vantageLon: -16.1800, vantageAltKm: 0.015, viewHeadingDeg: 330, viewPitchDeg: 10,
    description: 'Glacial lagoon below Breiðamerkurjökull, an outlet glacier of Vatnajökull, south-east Iceland.',
    scene: 'Icebergs drift beneath the ice cap, and on clear winter nights the aurora ripples across the northern sky.' },
  { id: 'earth-cuernos-del-paine', name: 'Cuernos del Paine', body: 'Earth', lat: -51.00243, lon: -73.0119, viewAltitudeKm: 3.0, source: WIKI('Cuernos del Paine'),
    vantageLat: -51.0500, vantageLon: -73.0400, vantageAltKm: 0.03, viewHeadingDeg: 20, viewPitchDeg: 16,
    description: 'Granite horns capped with dark sedimentary rock in Torres del Paine National Park, Chilean Patagonia.',
    scene: 'Sheer two-toned peaks stand over turquoise glacial lakes and wind-bent steppe.' },
  { id: 'earth-great-barrier-reef', name: 'Great Barrier Reef', body: 'Earth', lat: -16.4, lon: 145.8, viewAltitudeKm: 15.0, source: WIKI('Great Barrier Reef'),
    vantageLat: -16.4, vantageLon: 145.8, vantageAltKm: 0.5, viewHeadingDeg: 90, viewPitchDeg: -10,
    description: "The world's largest coral reef system, stretching over 2,300 km along Queensland, Australia.",
    scene: 'Turquoise reef flats and sand cays scattered across the deep blue Coral Sea.' },
  { id: 'earth-erg-chebbi', name: 'Erg Chebbi', body: 'Earth', lat: 31.16667, lon: -3.98333, viewAltitudeKm: 2.0, source: WIKI('Erg Chebbi'),
    vantageLat: 31.1400, vantageLon: -4.0100, vantageAltKm: 0.02, viewHeadingDeg: 60, viewPitchDeg: 8,
    description: 'Sea of wind-blown dunes up to about 150 m high on the edge of the Sahara, Morocco.',
    scene: 'Orange dunes rise in every direction, their crests glowing at sunrise.' },
  { id: 'earth-erebus', name: 'Mount Erebus', body: 'Earth', lat: -77.52972, lon: 167.15333, viewAltitudeKm: 4.0, source: WIKI('Mount Erebus'), towards: ROSS_ICE_SHELF,
    description: 'Southernmost active volcano on Earth (3,794 m), on Ross Island, Antarctica, with a long-lived lava lake.',
    scene: 'Steam drifts from the summit crater, and the Ross Ice Shelf stretches white to the southern horizon.' },
  { id: 'earth-uluru', name: 'Uluru', body: 'Earth', lat: -25.345, lon: 131.03611, viewAltitudeKm: 2.0, source: WIKI('Uluru'), towards: KATA_TJUTA,
    vantageLat: -25.3550, vantageLon: 131.0200, vantageAltKm: 0.015, viewHeadingDeg: 65, viewPitchDeg: 12,
    description: 'Sandstone monolith rising 348 m above the desert in the Northern Territory, Australia.',
    scene: 'Red desert runs to the horizon, broken only by the domes of Kata Tjuta to the west.' },
  { id: 'earth-geirangerfjord', name: 'Geirangerfjord', body: 'Earth', lat: 62.121, lon: 7.129, viewAltitudeKm: 2.0, source: WIKI('Geirangerfjord'), towards: GEIRANGER,
    vantageLat: 62.0880, vantageLon: 7.2180, vantageAltKm: 0.05, viewHeadingDeg: 300, viewPitchDeg: -6,
    description: 'A 15 km branch of the Sunnylvsfjorden in western Norway, a UNESCO World Heritage Site.',
    scene: 'Waterfalls pour down sheer green walls towards the village of Geiranger at the head of the fjord.' },
  { id: 'earth-fuji', name: 'Mount Fuji', body: 'Earth', lat: 35.36083, lon: 138.7275, viewAltitudeKm: 3.5, source: WIKI('Mount Fuji'),
    vantageLat: 35.5200, vantageLon: 138.7550, vantageAltKm: 0.04, viewHeadingDeg: 190, viewPitchDeg: 14,
    description: "Japan's highest mountain (3,776 m), a near-symmetrical stratovolcano.",
    scene: 'Looking across Lake Kawaguchiko, the snow-capped volcanic cone towers into the sky.' },
  { id: 'earth-victoria-falls', name: 'Victoria Falls', body: 'Earth', lat: -17.92444, lon: 25.85667, viewAltitudeKm: 1.5, source: WIKI('Victoria Falls'),
    vantageLat: -17.9285, vantageLon: 25.8525, vantageAltKm: 0.08, viewHeadingDeg: 45, viewPitchDeg: -6,
    description: 'Curtain of the Zambezi about 1.7 km wide and 108 m high, on the Zambia–Zimbabwe border.',
    scene: 'From the cliff edge at Cataract Point, spray rises hundreds of metres out of the gorge beneath the sky.' },
  { id: 'earth-matterhorn', name: 'Matterhorn', body: 'Earth', lat: 45.97639, lon: 7.65861, viewAltitudeKm: 3.0, source: WIKI('Matterhorn'),
    vantageLat: 45.9830, vantageLon: 7.7840, vantageAltKm: 0.05, viewHeadingDeg: 265, viewPitchDeg: 12,
    description: 'Pyramidal peak (4,478 m) on the main Alpine watershed between Switzerland and Italy.',
    scene: 'From the Gornergrat ridge, the iconic four-sided horn pierces the high Alpine atmosphere.' },
  { id: 'earth-kilimanjaro', name: 'Kilimanjaro', body: 'Earth', lat: -3.07583, lon: 37.35333, viewAltitudeKm: 4.0, source: WIKI('Mount Kilimanjaro'), towards: MAWENZI,
    vantageLat: -3.1500, vantageLon: 37.2800, vantageAltKm: 0.05, viewHeadingDeg: 45, viewPitchDeg: 16,
    description: "Africa's highest mountain (5,895 m), a dormant volcano in Tanzania.",
    scene: 'Ice cliffs on the crater rim, and the jagged peak of Mawenzi above the clouds to the east.' },
  { id: 'earth-ha-long-bay', name: 'Hạ Long Bay', body: 'Earth', lat: 20.9, lon: 107.2, viewAltitudeKm: 3.0, source: WIKI('Hạ Long Bay'),
    vantageLat: 20.8500, vantageLon: 107.1200, vantageAltKm: 0.02, viewHeadingDeg: 60, viewPitchDeg: 6,
    description: 'About 1,600 limestone islands and islets in the Gulf of Tonkin, Vietnam.',
    scene: 'Forested limestone towers rise from emerald water as far as you can see.' },
  { id: 'earth-uyuni', name: 'Salar de Uyuni', body: 'Earth', lat: -20.13378, lon: -67.48913, viewAltitudeKm: 4.0, source: WIKI('Salar de Uyuni'), towards: TUNUPA,
    vantageLat: -20.2500, vantageLon: -67.4500, vantageAltKm: 0.015, viewHeadingDeg: 340, viewPitchDeg: 8,
    description: "The world's largest salt flat, about 10,000 km², on the Bolivian Altiplano.",
    scene: 'A white plain to the horizon that mirrors the sky after rain, with Tunupa volcano to the north-west.' },
  { id: 'earth-yosemite', name: 'Yosemite Valley', body: 'Earth', lat: 37.7460, lon: -119.5330, viewAltitudeKm: 2.5, source: WIKI('Yosemite Valley'),
    vantageLat: 37.7156, vantageLon: -119.6775, vantageAltKm: 0.04, viewHeadingDeg: 68, viewPitchDeg: 8,
    description: 'Glacier-carved granite valley in the Sierra Nevada, California.',
    scene: 'From Tunnel View, El Capitan, Half Dome, and Bridalveil Fall frame the valley under the Sierra sky.' },
  { id: 'earth-angel-falls', name: 'Angel Falls', body: 'Earth', lat: 5.9675, lon: -62.53556, viewAltitudeKm: 2.2, source: WIKI('Angel Falls'),
    vantageLat: 5.9450, vantageLon: -62.5200, vantageAltKm: 0.05, viewHeadingDeg: 325, viewPitchDeg: 22,
    description: "The world's highest uninterrupted waterfall (979 m), off Auyán-tepui, Venezuela.",
    scene: 'From Mirador Laime, water leaps from the rim of the table mountain into the jungle canyon below.' },
  { id: 'earth-manhattan', name: 'Manhattan, New York', body: 'Earth', lat: 40.7484, lon: -73.9857, viewAltitudeKm: 1.8, source: WIKI('Manhattan'),
    vantageLat: 40.7590, vantageLon: -73.9790, vantageAltKm: 0.20, viewHeadingDeg: 195, viewPitchDeg: 8,
    description: 'Dense island borough of skyscrapers between the Hudson and East rivers in New York City.',
    scene: 'From the Top of the Rock observation deck, Midtown and Lower Manhattan towers stretch toward the harbour.' },
  { id: 'earth-golden-gate', name: 'Golden Gate Bridge, San Francisco', body: 'Earth', lat: 37.8199, lon: -122.4783, viewAltitudeKm: 1.8, source: WIKI('Golden Gate Bridge'),
    vantageLat: 37.8275, vantageLon: -122.4815, vantageAltKm: 0.06, viewHeadingDeg: 145, viewPitchDeg: 4,
    description: 'Suspension bridge spanning the Golden Gate strait between San Francisco Bay and the Pacific.',
    scene: 'From Battery Spencer atop the Marin Headlands, the orange towers frame the bay and the San Francisco skyline.' },
  { id: 'earth-eiffel-tower', name: 'Eiffel Tower, Paris', body: 'Earth', lat: 48.8584, lon: 2.2945, viewAltitudeKm: 1.2, source: WIKI('Eiffel Tower'),
    vantageLat: 48.8552, vantageLon: 2.2978, vantageAltKm: 0.075, viewHeadingDeg: 325, viewPitchDeg: 10,
    description: '330-metre wrought-iron lattice tower on the Champ de Mars beside the Seine in Paris.',
    scene: 'From the Champ de Mars park lawn, the 330-metre iron lattice tower soars into the Parisian sky.' },
  { id: 'earth-chamonix-mont-blanc', name: 'Chamonix & Mont Blanc', body: 'Earth', lat: 45.9237, lon: 6.8694, viewAltitudeKm: 3.5, source: WIKI('Chamonix'),
    vantageLat: 45.9350, vantageLon: 6.8500, vantageAltKm: 0.12, viewHeadingDeg: 160, viewPitchDeg: 18,
    description: 'Alpine valley below the Mont Blanc massif (4,809 m), the highest peak in the Alps.',
    scene: 'Looking south from the Flégère slopes, Mont Blanc’s glaciated domes tower above the Chamonix needle crags.' },
  { id: 'earth-colosseum', name: 'Colosseum, Rome', body: 'Earth', lat: 41.8902, lon: 12.4922, viewAltitudeKm: 1.0, source: WIKI('Colosseum'),
    vantageLat: 41.8895, vantageLon: 12.4958, vantageAltKm: 0.055, viewHeadingDeg: 290, viewPitchDeg: -4,
    description: 'Flavian amphitheatre in the centre of Rome, the largest ancient amphitheatre ever built.',
    scene: 'From the Colle Oppio park overlook, the grand travertine arches rise above the ancient Roman forum.' },
  { id: 'earth-london-tower-bridge', name: 'Tower Bridge, London', body: 'Earth', lat: 51.5055, lon: -0.0754, viewAltitudeKm: 1.2, source: WIKI('Tower Bridge'),
    vantageLat: 51.5062, vantageLon: -0.0792, vantageAltKm: 0.045, viewHeadingDeg: 108, viewPitchDeg: -2,
    description: 'Combined bascule and suspension bridge over the River Thames beside the Tower of London.',
    scene: 'From the Queen’s Walk promenade on the South Bank, twin Gothic towers span the river Thames.' },
  { id: 'earth-giza-pyramids', name: 'Pyramids of Giza, Cairo', body: 'Earth', lat: 29.9792, lon: 31.1342, viewAltitudeKm: 1.8, source: WIKI('Giza pyramid complex'),
    vantageLat: 29.9735, vantageLon: 31.1255, vantageAltKm: 0.055, viewHeadingDeg: 52, viewPitchDeg: 4,
    description: 'Fourth-Dynasty royal tombs on the Giza Plateau on the western edge of Cairo, Egypt.',
    scene: 'From the desert plateau lookout, the Great Pyramid, Khafre, and Menkaure rise together in the morning light.' },
  { id: 'earth-tokyo-tower', name: 'Tokyo Tower & Skyline', body: 'Earth', lat: 35.6586, lon: 139.7454, viewAltitudeKm: 1.5, source: WIKI('Tokyo Tower'),
    vantageLat: 35.6552, vantageLon: 139.7490, vantageAltKm: 0.08, viewHeadingDeg: 328, viewPitchDeg: 12,
    description: '333-metre communications and observation tower in Minato, overlooking Tokyo Bay.',
    scene: 'From the lawns of Shiba Park, the orange lattice tower rises above the dense city wards of Tokyo.' },
  { id: 'earth-sydney-opera', name: 'Sydney Opera House', body: 'Earth', lat: -33.8568, lon: 151.2153, viewAltitudeKm: 1.2, source: WIKI('Sydney Opera House'),
    vantageLat: -33.8542, vantageLon: 151.2188, vantageAltKm: 0.055, viewHeadingDeg: 252, viewPitchDeg: -5,
    description: 'Multi-venue performing arts centre on Bennelong Point in Sydney Harbour, Australia.',
    scene: "From Mrs Macquarie's Point across the harbour, the white sail-like shells gleam beside the Sydney Harbour Bridge beneath the southern sky." },
  { id: 'earth-christ-redeemer', name: 'Christ the Redeemer, Rio', body: 'Earth', lat: -22.9519, lon: -43.2105, viewAltitudeKm: 1.5, source: WIKI('Christ the Redeemer (statue)'),
    vantageLat: -22.9532, vantageLon: -43.2092, vantageAltKm: 0.05, viewHeadingDeg: 308, viewPitchDeg: 8,
    description: 'Art Deco statue of Jesus atop the 700-metre peak of Corcovado overlooking Rio de Janeiro.',
    scene: 'From the Corcovado viewing terrace, the statue opens its arms above Guanabara Bay and Copacabana.' },
  { id: 'earth-machu-picchu', name: 'Machu Picchu, Peru', body: 'Earth', lat: -13.1631, lon: -72.5450, viewAltitudeKm: 1.5, source: WIKI('Machu Picchu'),
    vantageLat: -13.1645, vantageLon: -72.5440, vantageAltKm: 0.025, viewHeadingDeg: 345, viewPitchDeg: 8,
    description: 'Fifteenth-century Inca citadel set on a 2,430-metre mountain ridge above the Urubamba Valley.',
    scene: 'From the Guardhouse terrace, terraced stone plazas cling to the saddle beneath the green peak of Huayna Picchu.' },
  { id: 'earth-marina-bay', name: 'Marina Bay Sands, Singapore', body: 'Earth', lat: 1.2834, lon: 103.8607, viewAltitudeKm: 1.5, source: WIKI('Marina Bay Sands'),
    vantageLat: 1.2868, vantageLon: 103.8555, vantageAltKm: 0.055, viewHeadingDeg: 120, viewPitchDeg: 8,
    description: 'Three 55-storey towers crowned by the SkyPark overlooking Marina Bay in Singapore.',
    scene: 'From Merlion Park, the three towers and SkyPark reflect across Marina Bay against the tropical sky.' },
  { id: 'earth-sagrada-familia', name: 'Sagrada Família, Barcelona', body: 'Earth', lat: 41.4036, lon: 2.1744, viewAltitudeKm: 1.2, source: WIKI('Sagrada Família'),
    vantageLat: 41.4015, vantageLon: 2.1765, vantageAltKm: 0.075, viewHeadingDeg: 322, viewPitchDeg: 8,
    description: "Antoni Gaudí's unfinished basilica rising above the octagonal Eixample grid of Barcelona.",
    scene: 'From Plaça de Gaudí across the pond, sculpted towers and spires rise above the Barcelona skyline.' },
  // Cities and landmarks Google has in full 3D. Each was checked from 500 m: the share of the
  // surface in walls (photogrammetry of buildings) was 0.18 or more; photographs on terrain read
  // ~0.09. Dubai's Burj Khalifa, Seoul, Kuala Lumpur, Abu Dhabi, Mumbai and Istanbul read flat and
  // were left out (src/dev/flightHarness wallShare)
  { id: 'earth-chicago', name: 'Chicago Loop & Willis Tower', body: 'Earth', lat: 41.8789, lon: -87.6359, viewAltitudeKm: 1.4, source: WIKI('Willis Tower'),
    vantageLat: 41.8749, vantageLon: -87.6359, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 12,
    description: "The Loop's canyon of skyscrapers on Lake Michigan, crowned by the 442-metre Willis Tower.",
    scene: 'From the Chicago River, the Loop’s towers climb to the black Willis Tower against the lake sky.' },
  { id: 'earth-las-vegas', name: 'Las Vegas Strip', body: 'Earth', lat: 36.1147, lon: -115.1728, viewAltitudeKm: 1.4, source: WIKI('Las Vegas Strip'),
    vantageLat: 36.1107, vantageLon: -115.1728, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 6,
    description: 'Four miles of casino resorts along Las Vegas Boulevard in the Mojave Desert.',
    scene: 'From the Strip, resort towers line the boulevard with the desert mountains behind.' },
  { id: 'earth-los-angeles', name: 'Downtown Los Angeles', body: 'Earth', lat: 34.0522, lon: -118.2437, viewAltitudeKm: 1.4, source: WIKI('Downtown Los Angeles'),
    vantageLat: 34.0482, vantageLon: -118.2437, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 10,
    description: 'The towers of Bunker Hill and the Financial District under the San Gabriel Mountains.',
    scene: 'From the south, the Bunker Hill towers stand against the San Gabriel Mountains.' },
  { id: 'earth-seattle', name: 'Space Needle, Seattle', body: 'Earth', lat: 47.6205, lon: -122.3493, viewAltitudeKm: 1.4, source: WIKI('Space Needle'),
    vantageLat: 47.6165, vantageLon: -122.3493, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 14,
    description: 'The 184-metre observation tower of the 1962 World’s Fair, over Elliott Bay.',
    scene: 'From Seattle Center, the Space Needle’s saucer rises above the trees.' },
  { id: 'earth-washington-dc', name: 'National Mall, Washington DC', body: 'Earth', lat: 38.8899, lon: -77.0091, viewAltitudeKm: 1.4, source: WIKI('United States Capitol'),
    vantageLat: 38.8859, vantageLon: -77.0091, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 6,
    description: 'The Capitol dome at the east end of the National Mall.',
    scene: 'From the Mall, the white Capitol dome closes the long lawn.' },
  { id: 'earth-miami', name: 'Miami Beach', body: 'Earth', lat: 25.7907, lon: -80.1300, viewAltitudeKm: 1.4, source: WIKI('Miami Beach, Florida'),
    vantageLat: 25.7907, vantageLon: -80.1345, vantageAltKm: 0.06, viewHeadingDeg: 90, viewPitchDeg: 2,
    description: 'Art Deco hotels along Ocean Drive on a barrier island between Biscayne Bay and the Atlantic.',
    scene: 'From Lummus Park, pastel Art Deco hotels face the Atlantic beach.' },
  { id: 'earth-honolulu', name: 'Waikiki & Diamond Head, Honolulu', body: 'Earth', lat: 21.2766, lon: -157.8278, viewAltitudeKm: 1.4, source: WIKI('Waikiki'),
    vantageLat: 21.2786, vantageLon: -157.8316, vantageAltKm: 0.06, viewHeadingDeg: 120, viewPitchDeg: 4,
    description: 'Hotels along Waikiki Beach beneath the Diamond Head crater on Oʻahu.',
    scene: 'From Waikiki, the beach curves towards the green crater wall of Diamond Head.' },
  { id: 'earth-toronto', name: 'CN Tower, Toronto', body: 'Earth', lat: 43.6426, lon: -79.3871, viewAltitudeKm: 1.4, source: WIKI('CN Tower'),
    vantageLat: 43.6386, vantageLon: -79.3871, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 16,
    description: 'The 553-metre CN Tower over Toronto’s downtown on Lake Ontario.',
    scene: 'From the waterfront, the CN Tower soars above the downtown towers.' },
  { id: 'earth-vancouver', name: 'Vancouver Harbour', body: 'Earth', lat: 49.2888, lon: -123.1111, viewAltitudeKm: 1.4, source: WIKI('Canada Place'),
    vantageLat: 49.2853, vantageLon: -123.1080, vantageAltKm: 0.06, viewHeadingDeg: 330, viewPitchDeg: 6,
    description: 'Downtown Vancouver between Burrard Inlet and the North Shore Mountains.',
    scene: 'From Canada Place, the North Shore Mountains rise across Burrard Inlet.' },
  { id: 'earth-mexico-city', name: 'Zócalo, Mexico City', body: 'Earth', lat: 19.4326, lon: -99.1332, viewAltitudeKm: 1.4, source: WIKI('Zócalo'),
    vantageLat: 19.4286, vantageLon: -99.1332, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 6,
    description: 'The great square of Mexico City between the Metropolitan Cathedral and the National Palace.',
    scene: 'From the south side of the Zócalo, the cathedral’s towers face the vast square.' },
  { id: 'earth-berlin', name: 'Brandenburg Gate, Berlin', body: 'Earth', lat: 52.5163, lon: 13.3777, viewAltitudeKm: 1.4, source: WIKI('Brandenburg Gate'),
    vantageLat: 52.5163, vantageLon: 13.3844, vantageAltKm: 0.06, viewHeadingDeg: 270, viewPitchDeg: 6,
    description: 'The neoclassical gate at the end of Unter den Linden, beside the Reichstag.',
    scene: 'From the Tiergarten side, the Brandenburg Gate’s columns frame Pariser Platz.' },
  { id: 'earth-amsterdam', name: 'Canal Ring, Amsterdam', body: 'Earth', lat: 52.3676, lon: 4.8890, viewAltitudeKm: 1.4, source: WIKI('Canal District'),
    vantageLat: 52.3636, vantageLon: 4.8890, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 4,
    description: 'Seventeenth-century canal houses along the Herengracht, Keizersgracht and Prinsengracht.',
    scene: 'Along the canal, narrow gabled houses lean over the water and the bridges.' },
  { id: 'earth-prague', name: 'Charles Bridge & Prague Castle', body: 'Earth', lat: 50.0865, lon: 14.4114, viewAltitudeKm: 1.4, source: WIKI('Charles Bridge'),
    vantageLat: 50.0845, vantageLon: 14.4169, vantageAltKm: 0.06, viewHeadingDeg: 300, viewPitchDeg: 8,
    description: 'The medieval bridge over the Vltava below the spires of Prague Castle.',
    scene: 'From the Old Town bank, the bridge’s statues lead across the Vltava to the castle.' },
  { id: 'earth-venice', name: "St Mark's Square, Venice", body: 'Earth', lat: 45.4342, lon: 12.3388, viewAltitudeKm: 1.4, source: WIKI("St Mark's Basilica"),
    vantageLat: 45.4302, vantageLon: 12.3388, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 10,
    description: 'The basilica and campanile of St Mark’s on the lagoon city’s great square.',
    scene: 'From the lagoon, the campanile and the domes of St Mark’s rise beside the Doge’s Palace.' },
  { id: 'earth-athens', name: 'Acropolis, Athens', body: 'Earth', lat: 37.9715, lon: 23.7257, viewAltitudeKm: 1.4, source: WIKI('Acropolis of Athens'),
    vantageLat: 37.9675, vantageLon: 23.7257, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 12,
    description: 'The Parthenon on its limestone rock above the city of Athens.',
    scene: 'From below the rock, the Parthenon’s columns stand above the city.' },
  { id: 'earth-vienna', name: "St Stephen's Cathedral, Vienna", body: 'Earth', lat: 48.2085, lon: 16.3731, viewAltitudeKm: 1.4, source: WIKI("St. Stephen's Cathedral, Vienna"),
    vantageLat: 48.2045, vantageLon: 16.3731, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 14,
    description: 'The Gothic cathedral with its patterned tile roof in the heart of Vienna.',
    scene: 'From the Graben, the Gothic spire and patterned roof of the cathedral fill the view.' },
  { id: 'earth-edinburgh', name: 'Edinburgh Castle', body: 'Earth', lat: 55.9486, lon: -3.1999, viewAltitudeKm: 1.4, source: WIKI('Edinburgh Castle'),
    vantageLat: 55.9486, vantageLon: -3.1927, vantageAltKm: 0.06, viewHeadingDeg: 270, viewPitchDeg: 10,
    description: 'The fortress on Castle Rock above Edinburgh’s Old Town.',
    scene: 'From Princes Street Gardens, the castle crowns its black volcanic rock.' },
  { id: 'earth-stockholm', name: 'Gamla Stan, Stockholm', body: 'Earth', lat: 59.3251, lon: 18.0711, viewAltitudeKm: 1.4, source: WIKI('Gamla stan'),
    vantageLat: 59.3211, vantageLon: 18.0711, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 4,
    description: 'Stockholm’s medieval old town on its island in the Baltic archipelago.',
    scene: 'From the water, the old town’s spires and ochre houses crowd the island.' },
  { id: 'earth-hong-kong', name: 'Victoria Harbour, Hong Kong', body: 'Earth', lat: 22.2934, lon: 114.1712, viewAltitudeKm: 1.4, source: WIKI('Victoria Harbour'),
    vantageLat: 22.2974, vantageLon: 114.1712, vantageAltKm: 0.06, viewHeadingDeg: 180, viewPitchDeg: 6,
    description: 'The skyline of Hong Kong Island across Victoria Harbour from Tsim Sha Tsui.',
    scene: 'From Tsim Sha Tsui, the island’s towers rise from the harbour to Victoria Peak.' },
  { id: 'earth-osaka', name: 'Osaka Castle', body: 'Earth', lat: 34.6873, lon: 135.5262, viewAltitudeKm: 1.4, source: WIKI('Osaka Castle'),
    vantageLat: 34.6833, vantageLon: 135.5262, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 10,
    description: 'The castle keep on its stone ramparts, ringed by moats in central Osaka.',
    scene: 'From the park, the white and green keep stands on its stone ramparts.' },
  { id: 'earth-kyoto', name: 'Kiyomizu-dera, Kyoto', body: 'Earth', lat: 34.9949, lon: 135.7850, viewAltitudeKm: 1.4, source: WIKI('Kiyomizu-dera'),
    vantageLat: 34.9929, vantageLon: 135.7893, vantageAltKm: 0.06, viewHeadingDeg: 300, viewPitchDeg: 4,
    description: 'The wooden temple on its stilted stage over the hills of eastern Kyoto.',
    scene: 'From the hillside, the temple’s wooden stage looks out over Kyoto.' },
  { id: 'earth-melbourne', name: 'Melbourne CBD & Yarra', body: 'Earth', lat: -37.8180, lon: 144.9691, viewAltitudeKm: 1.4, source: WIKI('Federation Square'),
    vantageLat: -37.8220, vantageLon: 144.9691, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 6,
    description: 'Melbourne’s city centre on the north bank of the Yarra River.',
    scene: 'From Southbank, the city’s towers stand along the Yarra River.' },
  { id: 'earth-cape-town', name: 'Table Mountain, Cape Town', body: 'Earth', lat: -33.9628, lon: 18.4098, viewAltitudeKm: 1.4, source: WIKI('Table Mountain'),
    vantageLat: -33.9588, vantageLon: 18.4098, vantageAltKm: 0.06, viewHeadingDeg: 180, viewPitchDeg: 10,
    description: 'The flat-topped mountain above Cape Town and Table Bay.',
    scene: 'From the city bowl, the flat summit of Table Mountain walls in the sky.' },
  { id: 'earth-buenos-aires', name: 'Obelisco, Buenos Aires', body: 'Earth', lat: -34.6037, lon: -58.3816, viewAltitudeKm: 1.4, source: WIKI('Obelisco de Buenos Aires'),
    vantageLat: -34.6077, vantageLon: -58.3816, vantageAltKm: 0.06, viewHeadingDeg: 0, viewPitchDeg: 10,
    description: 'The obelisk on Avenida 9 de Julio, one of the widest avenues in the world.',
    scene: 'From Avenida 9 de Julio, the white obelisk stands in the wide avenue.' },
  { id: 'earth-sao-paulo', name: 'Avenida Paulista, São Paulo', body: 'Earth', lat: -23.5614, lon: -46.6559, viewAltitudeKm: 1.4, source: WIKI('Avenida Paulista'),
    vantageLat: -23.5634, vantageLon: -46.6521, vantageAltKm: 0.06, viewHeadingDeg: 300, viewPitchDeg: 6,
    description: 'The financial avenue of São Paulo, among the largest cities on Earth.',
    scene: 'Along Avenida Paulista, office towers stretch away on the ridge.' },
  // ── Moon ── Earth hangs over 0°N 0°E, nearly fixed in the sky (libration rocks it a few degrees).
  // Real relief (src/explorer/PlanetElevation: SLDEM2015 / LOLA). Rim viewpoints were placed on the
  // DEM's own profiles: e.g. Tycho's floor −3.4 km and south rim crest +1.1 km 42 km out
  { id: 'moon-tycho', name: 'Tycho', body: 'Moon', lat: -43.296, lon: e(348.785), viewAltitudeKm: 300, source: GAZ(6163), towards: [-43.296, e(348.785)],
    vantageLat: -44.62, vantageLon: -11.22, vantageAltKm: 0.04, viewPitchDeg: 0,
    description: 'Young 85 km crater with a bright ray system visible from Earth.',
    scene: 'From the south rim the wall drops 4.5 km to the floor, where the central peaks stand; Earth is 46° up behind them.' },
  { id: 'moon-copernicus', name: 'Copernicus', body: 'Moon', lat: 9.621, lon: e(339.921), viewAltitudeKm: 300, source: GAZ(1296), towards: [9.621, e(339.921)],
    vantageLat: 8.50, vantageLon: -20.079, viewPitchDeg: -6,
    description: '93 km crater with terraced walls and central peaks in Oceanus Procellarum.',
    scene: 'From a terrace on the south wall, 1.9 km above the floor: the central peaks, and the north wall stepping up 3.7 km beyond.' },
  { id: 'moon-tranquility', name: 'Tranquility Base', body: 'Moon', lat: 0.674, lon: 23.473, viewAltitudeKm: 250, source: `${GAZ(5684)}, Statio Tranquillitatis`, towards: PARENT,
    viewPitchDeg: -4,
    description: 'Apollo 11 landing site, 20 July 1969, in Mare Tranquillitatis.',
    scene: 'Grey mare pocked with small craters runs west to a close horizon; Earth hangs 66° up above it and never sets.' },
  { id: 'moon-imbrium', name: 'Mare Imbrium', body: 'Moon', lat: 34.724, lon: e(345.091), viewAltitudeKm: 1200, source: GAZ(3678), towards: PARENT,
    viewPitchDeg: -3,
    description: 'Vast basalt-flooded impact basin, about 1,100 km across.',
    scene: 'Dark lava plains roll to the horizon under Earth, about 53° up in the south-south-east.' },
  // Shackleton (89.67°S, Gazetteer 5450) was removed: at the pole the equirectangular imagery and
  // height tiles the explorer streams collapse into slivers (a landing showed white slabs and tile
  // walls, not a crater); it needs polar-stereographic tiles, which Trek has but the explorer lacks
  { id: 'moon-hadley', name: 'Hadley–Apennine (Apollo 15)', body: 'Moon', lat: 26.1322, lon: 3.6339, viewAltitudeKm: 200, source: `${WIKI('Apollo 15')} (landing site); Mons Hadley ${GAZ(3983)}`, towards: MONS_HADLEY,
    viewPitchDeg: 5,
    description: 'Apollo 15 landing site, July 1971, between the Apennine mountains and Hadley Rille.',
    scene: 'Mons Hadley rises about 4 km above the plain to the north-east, beside the winding Hadley Rille; Earth is high behind you.' },
  { id: 'moon-taurus-littrow', name: 'Taurus–Littrow (Apollo 17)', body: 'Moon', lat: 20.1908, lon: 30.7717, viewAltitudeKm: 200, source: `${WIKI('Apollo 17')} (landing site); Taurus Littrow Valley ${GAZ(5881)}`, towards: PARENT,
    viewPitchDeg: 14,
    description: 'Apollo 17 landing site, December 1972, the last crewed landing on the Moon.',
    scene: 'The South Massif rises over 2 km at the end of the valley, with Earth about 54° up above it in the south-west.' },
  { id: 'moon-aristarchus', name: 'Aristarchus', body: 'Moon', lat: 23.73, lon: e(312.51), viewAltitudeKm: 250, source: GAZ(380), towards: [23.73, e(312.51)],
    vantageLat: 23.73, vantageLon: -48.175, vantageAltKm: 0.04, viewPitchDeg: 4, sunAltitudeDeg: 45,
    description: 'Brightest large crater on the Moon, 40 km across, on the Aristarchus Plateau.',
    scene: 'From the west rim, bright fresh walls fall 3.5 km to the floor, and Earth hangs 38° up beyond the far rim.' },
  { id: 'moon-smythii', name: 'Mare Smythii (Earthrise)', body: 'Moon', lat: -1.709, lon: 87.05, viewAltitudeKm: 800, source: GAZ(3689), towards: PARENT,
    viewPitchDeg: 1,
    description: "Mare on the Moon's eastern limb, seen edge-on from Earth.",
    scene: 'Earth sits about 3° above the western horizon, rising and setting over the month as the Moon librates.' },
  { id: 'moon-tsiolkovskiy', name: 'Tsiolkovskiy', body: 'Moon', lat: -20.379, lon: 128.972, viewAltitudeKm: 500, source: GAZ(6108), towards: [-20.21, 128.972],
    vantageLat: -20.379, vantageLon: 130.03, viewPitchDeg: 0,
    description: 'Far-side crater 185 km across with a dark, lava-flooded floor and a bright central peak.',
    scene: 'Across the dark, flooded floor the central peak rises 1.7 km; Earth never rises here, only the Sun and the stars.' },

  // ── Mercury ─────────────────────────────────────────────────────────────────────────────
  { id: 'mercury-caloris', name: 'Caloris Planitia', body: 'Mercury', lat: 31.652, lon: 161.985, viewAltitudeKm: 2500, source: GAZ(979),
    description: 'Impact basin about 1,550 km across, one of the largest in the Solar System.',
    scene: 'Ridged volcanic plains to the horizon under a black sky, with a Sun up to three times wider than from Earth.' },
  { id: 'mercury-hokusai', name: 'Hokusai', body: 'Mercury', lat: 57.84, lon: 16.65, viewAltitudeKm: 600, source: GAZ(14644),
    description: '114 km crater with an extensive bright ray system.',
    scene: 'Bright fresh rock and a cluster of central peaks inside a sharp, young rim.' },
  { id: 'mercury-rachmaninoff', name: 'Rachmaninoff', body: 'Mercury', lat: 27.661, lon: 57.37, viewAltitudeKm: 600, source: GAZ(14653),
    description: 'Peak-ring basin about 300 km across with smooth volcanic plains inside.',
    scene: 'An inner ring of peaks encloses some of the youngest volcanic plains on Mercury.' },
  { id: 'mercury-enterprise', name: 'Enterprise Rupes', body: 'Mercury', lat: -36.541, lon: 76.535, viewAltitudeKm: 800, source: GAZ(15133),
    description: 'The longest known scarp on Mercury, about 820 km, raised as the planet cooled and shrank.',
    scene: 'A cliff about 3 km high runs on past the horizon in both directions.' },

  // ── Venus ── Maxwell Montes, Maat Mons, Aphrodite Terra, the Venera 13 site and Sapas Mons were
  // removed: the only global map is Magellan radar (~290 m, not visible light), and under Venus's
  // haze a landing showed a brown blur. No visible-light surface data exist to do better

  // ── Mars ── Real relief (HRSC + MOLA blended DEM, src/explorer/PlanetElevation); viewpoints placed
  // on the DEM's own profiles: Valles Marineris here is 7.3 km deep between rims at +2.9 km
  { id: 'mars-olympus', name: 'Olympus Mons', body: 'Mars', lat: 18.653, lon: e(226.198), viewAltitudeKm: 1200, source: GAZ(4453), towards: [18.4, -133.8],
    vantageLat: 18.57, vantageLon: -133.8, viewPitchDeg: -4, sunAltitudeDeg: 55,
    description: 'Shield volcano about 22 km high and 600 km across, the tallest in the Solar System.',
    scene: 'From the north rim of the summit caldera, 20 km above the plains, the floor lies 1.3 km below and the far wall rises beyond.' },
  { id: 'mars-valles', name: 'Valles Marineris', body: 'Mars', lat: -14.006, lon: e(301.412), viewAltitudeKm: 2500, source: GAZ(6288),
    vantageLat: -14.564, vantageLon: -58.588, viewHeadingDeg: 350, viewPitchDeg: -12,
    description: 'Canyon system over 4,000 km long and up to 7 km deep.',
    scene: 'From the south rim the canyon falls 7 km to its floor; the north wall, 100 km away, fades into the dust haze.' },
  { id: 'mars-gale', name: 'Gale crater', body: 'Mars', lat: -5.367, lon: 137.811, viewAltitudeKm: 500, source: `${GAZ(2071)}; Bradbury Landing ${WIKI('Curiosity (rover)')}`, towards: AEOLIS_MONS,
    vantageLat: -4.5895, vantageLon: 137.4417, viewPitchDeg: 2, sunAltitudeDeg: 55,
    description: 'Landing site of the Curiosity rover (2012), with Mount Sharp at its centre.',
    scene: 'From Bradbury Landing, where Curiosity touched down, Mount Sharp rises 5 km above the crater floor to the south-east.' },
  { id: 'mars-jezero', name: 'Jezero crater', body: 'Mars', lat: 18.408, lon: 77.687, viewAltitudeKm: 400, source: `${GAZ(14300)}; Octavia E. Butler Landing ${WIKI('Perseverance (rover)')}`, towards: NERETVA_VALLIS,
    vantageLat: 18.4447, vantageLon: 77.4508, viewPitchDeg: 0,
    description: 'Ancient lake basin and river delta, landing site of Perseverance (2021).',
    scene: 'From Perseverance’s landing site the delta front rises 8 km west, with the breached crater rim beyond.' },
  { id: 'mars-hellas', name: 'Hellas Planitia', body: 'Mars', lat: -42.43, lon: 70.502, viewAltitudeKm: 3000, source: GAZ(2432),
    viewHeadingDeg: 250, viewPitchDeg: -2,
    description: 'Impact basin about 2,300 km across and over 7 km deep, the lowest ground on Mars.',
    scene: 'A dusty plain under a hazy sky, with the thickest air anywhere on Mars.' },
  // Planum Boreum (87.32°N, Gazetteer 4754) was removed for the same reason as the Moon's
  // Shackleton: this close to the pole the equirectangular tiles are slivers, and a landing showed a
  // blank grey sheet with a seam instead of the spiral troughs
  { id: 'mars-korolev', name: 'Korolev crater', body: 'Mars', lat: 72.768, lon: 164.584, viewAltitudeKm: 400, source: GAZ(3091), towards: [72.768, 164.584],
    vantageLat: 72.092, vantageLon: 164.584, viewPitchDeg: -3,
    description: '81 km crater filled year-round with a mound of water ice about 1.8 km thick.',
    scene: 'From the south rim, the ice mound fills the crater, its moat 1.7 km below you.' },
  { id: 'mars-noctis', name: 'Noctis Labyrinthus', body: 'Mars', lat: -6.363, lon: e(258.811), viewAltitudeKm: 1000, source: GAZ(4324),
    vantageLat: -6.363, vantageLon: -101.342, viewHeadingDeg: 90, viewPitchDeg: -6,
    description: 'Maze of intersecting canyons at the western end of Valles Marineris.',
    scene: 'From a mesa top, steep walls drop 1.7 km into the canyon floor, where morning fog sometimes pools.' },
  { id: 'mars-victoria', name: 'Victoria crater', body: 'Mars', lat: -2.052, lon: e(354.502), viewAltitudeKm: 150, source: GAZ(14522),
    vantageLat: -2.052, vantageLon: -5.484, vantageAltKm: 0.25, viewHeadingDeg: 270, viewPitchDeg: -20,
    description: 'Crater under a kilometre wide in Meridiani Planum, explored by the Opportunity rover from 2006 to 2008.',
    scene: 'Scalloped cliffs of layered rock ring a floor of rippled dunes.' },
  { id: 'mars-arsia', name: 'Arsia Mons', body: 'Mars', lat: -8.257, lon: e(239.907), viewAltitudeKm: 900, source: GAZ(394),
    viewHeadingDeg: 270, viewPitchDeg: -3,
    description: 'Southernmost of the three Tharsis shield volcanoes, with a summit caldera over 100 km wide.',
    scene: 'A vast summit caldera, over which a long plume of water-ice cloud often forms.' },

  // ── Io ── Jupiter, about 19° wide, hangs over 0°N 0°E
  { id: 'io-loki', name: 'Loki Patera', body: 'Io', lat: 13.008, lon: 51.214, viewAltitudeKm: 500, source: GAZ(3459), towards: PARENT,
    description: 'The largest lava lake in the Solar System, about 200 km across.',
    scene: 'A black lava lake with glowing crust, and Jupiter, about 19° wide, about 38° up in the west.' },
  { id: 'io-tvashtar', name: 'Tvashtar Paterae', body: 'Io', lat: 62.76, lon: e(236.47), viewAltitudeKm: 600, source: GAZ(14131),
    description: 'Volcanic depressions near the north pole whose plume reached about 330 km high when New Horizons passed in 2007.',
    scene: 'Lava fountains and a plume arching hundreds of km overhead; Jupiter never rises on this side.' },
  { id: 'io-pele', name: 'Pele', body: 'Io', lat: -18.71, lon: 104.72, viewAltitudeKm: 600, source: GAZ(4638),
    description: 'Volcano whose sulphur plume, about 300 km high, lays down a red ring over 1,000 km wide.',
    scene: 'A glowing lava lake beneath a towering sulphur plume; Jupiter is just below the horizon.' },
  { id: 'io-prometheus', name: 'Prometheus', body: 'Io', lat: -1.524, lon: e(206.061), viewAltitudeKm: 500, source: GAZ(4836),
    description: "Long-lived eruption whose plume, about 100 km high, has been seen by every spacecraft since Voyager 1 (1979).",
    scene: 'An umbrella-shaped plume over fresh lava flows; on this side Jupiter never rises.' },

  // ── Europa ── Jupiter, about 12° wide, hangs over 0°N 0°E
  { id: 'europa-conamara', name: 'Conamara Chaos', body: 'Europa', lat: 9.7, lon: 87.3, viewAltitudeKm: 400, source: GAZ(1282), towards: PARENT,
    description: 'Region of rafts of broken ice crust that drifted and refroze in place.',
    scene: 'Ice blocks tilted like broken plates, and Jupiter, about 12° wide, sitting on the western horizon.' },
  { id: 'europa-pwyll', name: 'Pwyll', body: 'Europa', lat: -25.2, lon: 88.6, viewAltitudeKm: 300, source: GAZ(4878), towards: PARENT,
    description: 'Young 45 km crater whose bright rays cross more than 1,000 km of ice.',
    scene: 'A dark rim and central peaks, with Jupiter just clearing the western horizon.' },
  { id: 'europa-tyre', name: 'Tyre', body: 'Europa', lat: 33.6, lon: e(213.4), viewAltitudeKm: 500, source: GAZ(6170),
    description: 'Multi-ring impact structure about 150 km across.',
    scene: 'Concentric ice ridges and troughs fan out to the horizon; Jupiter is out of sight here.' },

  // ── Ganymede ── Jupiter, about 8° wide, hangs over 0°N 0°E
  { id: 'ganymede-uruk', name: 'Uruk Sulcus', body: 'Ganymede', lat: 3.4, lon: e(200.0), viewAltitudeKm: 1500, source: GAZ(6246),
    description: 'Belt of bright grooved terrain on the largest moon in the Solar System.',
    scene: 'Parallel ice ridges run off to the horizon; Jupiter never rises on this hemisphere.' },
  { id: 'ganymede-galileo', name: 'Galileo Regio', body: 'Ganymede', lat: 45.0, lon: e(233.0), viewAltitudeKm: 3000, source: GAZ(2076),
    description: "Dark, heavily cratered region thousands of km across, among Ganymede's oldest terrain.",
    scene: 'Dark, crater-pocked plains crossed by long curving furrows.' },
  { id: 'ganymede-tros', name: 'Tros', body: 'Ganymede', lat: 11.142, lon: e(332.737), viewAltitudeKm: 500, source: GAZ(6091), towards: PARENT,
    description: '94 km crater with bright rays of fresh ice.',
    scene: 'Bright ray ejecta all around, and Jupiter, about 8° wide, about 61° up in the east-south-east.' },

  // ── Callisto ── Jupiter, about 4° wide, hangs over 0°N 0°E
  { id: 'callisto-valhalla', name: 'Valhalla', body: 'Callisto', lat: 14.7, lon: e(304.0), viewAltitudeKm: 3000, source: GAZ(6284), towards: PARENT,
    description: 'Multi-ring impact basin whose rings reach about 3,800 km across.',
    scene: 'Concentric scarps ring a bright icy plain, with Jupiter, about 4° wide, about 33° up in the east.' },
  { id: 'callisto-asgard', name: 'Asgard', body: 'Callisto', lat: 32.2, lon: e(220.1), viewAltitudeKm: 2000, source: GAZ(420),
    description: 'Multi-ring impact basin about 1,400 km across.',
    scene: 'Rings of icy ridges around a bright centre; Jupiter never rises on this side.' },

  // ── Saturn system ── Saturn hangs over 0°N 0°E of each moon
  { id: 'mimas-herschel', name: 'Herschel', body: 'Mimas', lat: -1.38, lon: e(248.24), viewAltitudeKm: 300, source: GAZ(2478),
    description: "139 km crater, a third of Mimas' diameter, with a central peak about 6 km high.",
    scene: 'Walls about 5 km high ring the floor around the peak; Saturn is below the horizon here.' },
  { id: 'enceladus-damascus', name: 'Damascus Sulcus', body: 'Enceladus', lat: -80.59, lon: 74.13, viewAltitudeKm: 150, source: GAZ(14252), towards: PARENT,
    description: "One of the four 'tiger stripe' fractures at the south pole that vent jets of water ice from an ocean below.",
    scene: 'Jets of ice rise overhead, and Saturn, about 28° wide with its rings edge-on, sits on the west-north-west horizon.' },
  { id: 'enceladus-baghdad', name: 'Baghdad Sulcus', body: 'Enceladus', lat: -86.91, lon: 129.46, viewAltitudeKm: 150, source: GAZ(14248), towards: PARENT,
    description: "Longest of the four tiger stripes, a source of the ice plume that feeds Saturn's E ring.",
    scene: 'Blue-white fractures steam with ice, and the upper part of Saturn, about 28° wide, rises over the south-western horizon.' },
  { id: 'tethys-odysseus', name: 'Odysseus', body: 'Tethys', lat: 32.82, lon: e(231.11), viewAltitudeKm: 800, source: GAZ(4406),
    description: "445 km impact crater, about two-fifths of Tethys' diameter.",
    scene: 'A giant, flattened crater floor; Saturn is hidden on this side of Tethys.' },
  { id: 'tethys-ithaca', name: 'Ithaca Chasma', body: 'Tethys', lat: -14.0, lon: e(353.9), viewAltitudeKm: 600, source: GAZ(2751), towards: PARENT,
    description: 'Rift valley about 100 km wide that runs most of the way around Tethys.',
    scene: 'Saturn, about 23° wide, hangs 75° up above the canyon walls.' },
  // Titan's Kraken Mare, Ligeia Mare, the Huygens site, Selk crater and Doom Mons were removed: the
  // haze hides the ground (the only global map is a 450 m near-infrared mosaic, 65°S–45°N, so the
  // two northern seas had none), and every landing showed uniform orange murk
  { id: 'iapetus-ridge', name: 'Equatorial ridge (Tortelosa Montes)', body: 'Iapetus', lat: 0.0, lon: e(295.3), viewAltitudeKm: 500, source: GAZ(14497), towards: PARENT,
    description: "Part of the mountain ridge that runs along Iapetus' equator, in places about 20 km high.",
    scene: 'A wall of mountains along the equator, and Saturn, about 2° wide, about 25° up in the east.' },
  { id: 'iapetus-turgis', name: 'Turgis', body: 'Iapetus', lat: 16.9, lon: e(331.6), viewAltitudeKm: 1000, source: GAZ(14488), towards: PARENT,
    description: 'Impact basin about 580 km across, with giant ice landslides down its walls.',
    scene: 'Basin walls sweep away to the horizon, with Saturn about 57° up in the east-south-east.' },

  // ── Uranus and Neptune systems
  // Verona Rupes on Miranda (Gazetteer 6359) was removed: there is no streamable map of Miranda
  // (the USGS service has none) and no elevation data, so a landing showed the bundled 2048 px map
  // as a flat grey plain; a 5–10 km cliff cannot be shown without relief
  { id: 'triton-hili', name: 'Hili', body: 'Triton', lat: -57.0, lon: 35.0, viewAltitudeKm: 300, source: GAZ(2504), towards: PARENT,
    description: 'Nitrogen geyser plume seen by Voyager 2 in 1989, rising about 8 km.',
    scene: 'A dark plume climbs from the polar ice, and Neptune, about 8° wide, sits 26° up in the north-west.' },
  { id: 'triton-bubembe', name: 'Bubembe Regio', body: 'Triton', lat: 18.0, lon: e(335.0), viewAltitudeKm: 600, source: GAZ(905), towards: PARENT,
    description: "'Cantaloupe terrain' of dimpled ridges, seen only on Triton.",
    scene: 'Dimpled ridges to the horizon, and Neptune, about 8° wide, hangs 60° up in the south-east.' },

  // ── Pluto ── Charon, about 3.5° wide, hangs motionless over 0°N 0°E
  { id: 'pluto-sputnik', name: 'Sputnik Planitia', body: 'Pluto', lat: 19.51, lon: 178.69, viewAltitudeKm: 1200, source: GAZ(15669),
    description: 'Nitrogen-ice plain about 1,000 km across, slowly churned by convection cells.',
    scene: 'Polygonal cells of nitrogen ice under a blue haze; Charon never rises on this side.' },
  { id: 'pluto-tenzing', name: 'Tenzing Montes', body: 'Pluto', lat: -15.61, lon: 177.38, viewAltitudeKm: 400, source: GAZ(15670), towards: SPUTNIK_PLANITIA,
    description: 'Mountains of water ice up to about 6 km high at the south-west edge of Sputnik Planitia.',
    scene: 'Jagged ice peaks look out over the smooth plains of Sputnik Planitia to the north.' },
  { id: 'pluto-wright', name: 'Wright Mons', body: 'Pluto', lat: -21.36, lon: 173.24, viewAltitudeKm: 400, source: GAZ(15835),
    description: 'Possible ice volcano about 150 km wide and 4 km high, with a deep central depression.',
    scene: 'Hummocky slopes fall away from a broad central pit.' },
  { id: 'pluto-al-idrisi', name: 'Al-Idrisi Montes', body: 'Pluto', lat: 33.99, lon: 156.01, viewAltitudeKm: 400, source: GAZ(15672), towards: SPUTNIK_PLANITIA,
    description: 'Jumbled mountain-sized blocks of water ice on the north-west edge of Sputnik Planitia.',
    scene: 'Tilted ice blocks stand over the bright plain to the south-east.' },
  { id: 'pluto-belton', name: 'Belton Regio (Cthulhu)', body: 'Pluto', lat: -9.21, lon: 91.42, viewAltitudeKm: 2000, source: GAZ(16257), towards: PARENT,
    description: "Dark red region about 3,000 km long along Pluto's equator, long known informally as Cthulhu.",
    scene: 'Dark tholin-stained ground, and Charon peeking over the western horizon, never moving.' },

  // ── Charon ── Pluto, about 7° wide, hangs motionless over 0°N 0°E
  { id: 'charon-argo', name: 'Argo Chasma', body: 'Charon', lat: 27.8, lon: 80.4, viewAltitudeKm: 400, source: GAZ(15734), towards: PARENT,
    description: 'Canyon estimated to be up to about 9 km deep.',
    scene: 'Canyon walls drop kilometres below you, and Pluto, about 7° wide, sits 8° above the western horizon.' },
  { id: 'charon-kubrick', name: 'Kubrick Mons', body: 'Charon', lat: 3.6, lon: 30.8, viewAltitudeKm: 250, source: GAZ(15736), towards: PARENT,
    description: 'Mountain about 3–4 km high standing in a moat on the smooth plains of Charon.',
    scene: 'A lone peak in its moat, and Pluto, about 7° wide, hangs 59° up in the west and never moves.' },

  // ── Ceres and Vesta
  { id: 'ceres-occator', name: 'Occator', body: 'Ceres', lat: 19.819, lon: e(239.335), viewAltitudeKm: 300, source: GAZ(15341), towards: VINALIA_FACULAE,
    description: '92 km crater whose bright Cerealia Facula is salt left by brine from below.',
    scene: 'The bright dome of Cerealia Facula shines at the centre, with the smaller Vinalia Faculae to the east.' },
  { id: 'ceres-ahuna', name: 'Ahuna Mons', body: 'Ceres', lat: -10.478, lon: e(316.2), viewAltitudeKm: 150, source: GAZ(15409),
    description: 'A lone ice volcano about 4 km high and 17 km wide.',
    scene: 'Steep, bright-streaked flanks rise out of a cratered plain.' },
  { id: 'ceres-kerwan', name: 'Kerwan', body: 'Ceres', lat: -10.767, lon: 123.987, viewAltitudeKm: 600, source: GAZ(15339),
    description: "Ceres' largest well-defined impact basin, about 280 km across.",
    scene: 'A smooth, shallow floor ringed by low, worn walls.' },
  { id: 'vesta-rheasilvia', name: 'Rheasilvia', body: 'Vesta', lat: -71.951, lon: 86.303, viewAltitudeKm: 500, source: `${GAZ(14886)}, IAU (4) Vesta coordinate system`,
    description: "Impact basin about 500 km across, nearly Vesta's full width, with a central peak about 20 km high.",
    scene: 'The central mountain, among the tallest in the Solar System, rises from a scarred basin floor.' },
  { id: 'vesta-divalia', name: 'Divalia Fossae', body: 'Vesta', lat: -9.053, lon: e(196.231), viewAltitudeKm: 400, source: `${GAZ(14911)}, IAU (4) Vesta coordinate system`, viewHeadingDeg: 90,
    description: "Troughs up to about 20 km wide girdling Vesta's equator, thought to be cracks from the Rheasilvia impact.",
    scene: 'Parallel troughs run east and west to the horizon.' },
];

/** Point `km` from (lat, lon) along a bearing on a sphere of radius `R` km. */
function destination(lat: number, lon: number, bearing: number, km: number, R: number): [number, number] {
  const d = km / R;
  const b = bearing * toRad;
  const p1 = lat * toRad;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
  const l2 = lon * toRad + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / toRad, ((((l2 / toRad + 540) % 360) + 360) % 360) - 180];
}

/** Downward look on worlds without elevation data (degrees below the horizon). */
const FLAT_PITCH_DEG = 15;

/**
 * Worlds with streamed imagery but no elevation data are flat photographs: from a person's height
 * they are a smear of a few pixels. The surface view stands high over them (imageryEyeKm), so a
 * landing steps back from the feature by the distance at which a
 * 15° downward look lands on it: the feature fills the view, with the sky above it.
 */
function flatWorldVantage(l: Landmark, heading: number): Landmark {
  const img = BODY_IMAGERY[l.body];
  const R = RADII_KM[l.body];
  if (!img?.provider || !R || l.vantageLat !== undefined || l.body === 'Earth' || RELIEF_BODIES.includes(l.body)) return l;
  const eyeKm = imageryEyeKm(img, false);
  const [vLat, vLon] = destination(l.lat, l.lon, (heading + 180) % 360, eyeKm / Math.tan(FLAT_PITCH_DEG * toRad), R);
  return { ...l, vantageLat: vLat, vantageLon: vLon, viewHeadingDeg: l.viewHeadingDeg ?? heading, viewPitchDeg: l.viewPitchDeg ?? -FLAT_PITCH_DEG };
}

export const LANDMARKS: Landmark[] = ENTRIES.map(({ towards, ...l }) => {
  let out: Landmark = l;
  if (towards) {
    // On a flat world the heading is taken from the feature itself, then the viewpoint steps back
    const originLat = l.vantageLat ?? l.lat;
    const originLon = l.vantageLon ?? l.lon;
    out = { ...l, viewHeadingDeg: (Math.round(bearingDeg(originLat, originLon, towards[0], towards[1]) * 10) / 10) % 360 };
  }
  return flatWorldVantage(out, out.viewHeadingDeg ?? 0);
});

const dynamicLandmarks = new Map<string, Landmark>();

/** Register a live-searched place on Earth so flyToLandmark, surface view, and jet flight can target it by id. */
export function registerDynamicLandmark(lm: Landmark): Landmark {
  dynamicLandmarks.set(lm.id, lm);
  return lm;
}

export function landmarksFor(body: string): Landmark[] {
  return LANDMARKS.filter((l) => l.body === body);
}

export function searchLandmarks(query: string): Landmark[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return LANDMARKS.filter((l) => l.name.toLowerCase().includes(q) || l.body.toLowerCase().includes(q));
}

export function getLandmark(id: string): Landmark | undefined {
  return dynamicLandmarks.get(id) ?? LANDMARKS.find((l) => l.id === id);
}
