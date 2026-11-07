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
  /** One sentence on what you see standing there. */
  scene?: string;
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
const MAKALU = [27.88972, 87.08889] as const; // Wikipedia: Makalu
const OLKHON = [53.15667, 107.38361] as const; // Wikipedia: Olkhon Island
const CAIRO = [30.04444, 31.23583] as const; // Wikipedia: Cairo
const VATNAJOKULL = [64.4, -16.8] as const; // Wikipedia: Vatnajökull
const ROSS_ICE_SHELF = [-81.5, -175] as const; // Wikipedia: Ross Ice Shelf
const KATA_TJUTA = [-25.3, 130.73333] as const; // Wikipedia: Kata Tjuta
const GEIRANGER = [62.1019, 7.2072] as const; // Wikipedia: Geiranger
const MONTE_ROSA = [45.93694, 7.86667] as const; // Wikipedia: Monte Rosa
const MAWENZI = [-3.0925, 37.45583] as const; // Wikipedia: Mawenzi
const TUNUPA = [-19.8325, -67.64583] as const; // Wikipedia: Tunupa
const HALF_DOME = [37.74604, -119.53294] as const; // Wikipedia: Half Dome
const AUYAN_TEPUI = [5.90036, -62.54156] as const; // Wikipedia: Auyán-tepui
const MONS_HADLEY = [26.695, 4.118] as const; // Gazetteer 3983
const MELAS_CHASMA = [-10.518, e(287.461)] as const; // Gazetteer 3812
const AEOLIS_MONS = [-5.083, 137.845] as const; // Gazetteer 15000 (Mount Sharp)
const NERETVA_VALLIS = [18.55, 77.2] as const; // Gazetteer 15879
const CLEOPATRA = [65.8, 7.1] as const; // Gazetteer 1240
const SPUTNIK_PLANITIA = [19.51, 178.69] as const; // Gazetteer 15669
const VINALIA_FACULAE = [20.2, e(242.0)] as const; // Gazetteer 15531

const ENTRIES: Entry[] = [
  // ── Earth ──────────────────────────────────────────────────────────────────────────────────
  { id: 'earth-everest', name: 'Mount Everest', body: 'Earth', lat: 27.98833, lon: 86.92528, viewAltitudeKm: 900, source: WIKI('Mount Everest'), towards: MAKALU,
    description: 'Highest summit above sea level (8,849 m), on the Nepal–China border in the Himalaya.',
    scene: 'Makalu, the fifth-highest mountain, rises about 19 km to the south-east above a sea of Himalayan peaks.' },
  { id: 'earth-grand-canyon', name: 'Grand Canyon', body: 'Earth', lat: 36.3, lon: -112.75, viewAltitudeKm: 700, source: WIKI('Grand Canyon'), viewHeadingDeg: 90,
    description: 'Canyon carved by the Colorado River through the Colorado Plateau, Arizona.',
    scene: 'Banded rock walls fall more than 1.8 km to the river, which winds upstream into the east.' },
  { id: 'earth-richat', name: 'Richat Structure', body: 'Earth', lat: 21.1147, lon: -11.3943, viewAltitudeKm: 600, source: WIKI('Richat Structure'),
    description: 'A 40 km eroded dome in the Sahara of Mauritania, a landmark for astronauts.',
    scene: 'Concentric rings of hard rock ripple out across the desert in every direction.' },
  { id: 'earth-baikal', name: 'Lake Baikal', body: 'Earth', lat: 53.5, lon: 108.0, viewAltitudeKm: 1500, source: WIKI('Lake Baikal'), towards: OLKHON,
    description: "The world's deepest and oldest lake, in a continental rift in Siberia.",
    scene: 'Clear water over a rift more than 1.6 km deep, with Olkhon Island, the largest in the lake, to the south-west.' },
  { id: 'earth-nile-delta', name: 'Nile Delta', body: 'Earth', lat: 30.9, lon: 31.11667, viewAltitudeKm: 800, source: WIKI('Nile Delta'), towards: CAIRO,
    description: 'Green, densely farmed fan of the Nile against the desert, Egypt.',
    scene: 'The green fan narrows south towards Cairo, where the Nile leaves its desert valley.' },
  { id: 'earth-jokulsarlon', name: 'Jökulsárlón', body: 'Earth', lat: 64.07028, lon: -16.21167, viewAltitudeKm: 300, source: WIKI('Jökulsárlón'), towards: VATNAJOKULL,
    description: 'Glacial lagoon below Breiðamerkurjökull, an outlet glacier of Vatnajökull, south-east Iceland.',
    scene: 'Icebergs drift beneath the ice cap, and on clear winter nights the aurora ripples across the northern sky.' },
  { id: 'earth-cuernos-del-paine', name: 'Cuernos del Paine', body: 'Earth', lat: -51.00243, lon: -73.0119, viewAltitudeKm: 300, source: WIKI('Cuernos del Paine'),
    description: 'Granite horns capped with dark sedimentary rock in Torres del Paine National Park, Chilean Patagonia.',
    scene: 'Sheer two-toned peaks stand over turquoise glacial lakes and wind-bent steppe.' },
  { id: 'earth-great-barrier-reef', name: 'Great Barrier Reef', body: 'Earth', lat: -16.4, lon: 145.8, viewAltitudeKm: 1500, source: WIKI('Great Barrier Reef'),
    description: "The world's largest coral reef system, stretching over 2,300 km along Queensland, Australia.",
    scene: 'Turquoise reef flats and sand cays scattered across the deep blue Coral Sea.' },
  { id: 'earth-erg-chebbi', name: 'Erg Chebbi', body: 'Earth', lat: 31.16667, lon: -3.98333, viewAltitudeKm: 250, source: WIKI('Erg Chebbi'),
    description: 'Sea of wind-blown dunes up to about 150 m high on the edge of the Sahara, Morocco.',
    scene: 'Orange dunes rise in every direction, their crests glowing at sunrise.' },
  { id: 'earth-erebus', name: 'Mount Erebus', body: 'Earth', lat: -77.52972, lon: 167.15333, viewAltitudeKm: 400, source: WIKI('Mount Erebus'), towards: ROSS_ICE_SHELF,
    description: 'Southernmost active volcano on Earth (3,794 m), on Ross Island, Antarctica, with a long-lived lava lake.',
    scene: 'Steam drifts from the summit crater, and the Ross Ice Shelf stretches white to the southern horizon.' },
  { id: 'earth-uluru', name: 'Uluru', body: 'Earth', lat: -25.345, lon: 131.03611, viewAltitudeKm: 250, source: WIKI('Uluru'), towards: KATA_TJUTA,
    description: 'Sandstone monolith rising 348 m above the desert in the Northern Territory, Australia.',
    scene: 'Red desert runs to the horizon, broken only by the domes of Kata Tjuta to the west.' },
  { id: 'earth-geirangerfjord', name: 'Geirangerfjord', body: 'Earth', lat: 62.121, lon: 7.129, viewAltitudeKm: 250, source: WIKI('Geirangerfjord'), towards: GEIRANGER,
    description: 'A 15 km branch of the Sunnylvsfjorden in western Norway, a UNESCO World Heritage Site.',
    scene: 'Waterfalls pour down sheer green walls towards the village of Geiranger at the head of the fjord.' },
  { id: 'earth-fuji', name: 'Mount Fuji', body: 'Earth', lat: 35.36083, lon: 138.7275, viewAltitudeKm: 300, source: WIKI('Mount Fuji'), viewHeadingDeg: 90,
    description: "Japan's highest mountain (3,776 m), a near-symmetrical stratovolcano.",
    scene: 'From the crater rim the Sun rises in the east over a sea of cloud.' },
  { id: 'earth-victoria-falls', name: 'Victoria Falls', body: 'Earth', lat: -17.92444, lon: 25.85667, viewAltitudeKm: 250, source: WIKI('Victoria Falls'),
    description: 'Curtain of the Zambezi about 1.7 km wide and 108 m high, on the Zambia–Zimbabwe border.',
    scene: 'Spray rises hundreds of metres out of the gorge, often carrying a rainbow.' },
  { id: 'earth-matterhorn', name: 'Matterhorn', body: 'Earth', lat: 45.97639, lon: 7.65861, viewAltitudeKm: 250, source: WIKI('Matterhorn'), towards: MONTE_ROSA,
    description: 'Pyramidal peak (4,478 m) on the main Alpine watershed between Switzerland and Italy.',
    scene: 'The glaciers of Monte Rosa fill the view to the east above the valleys of Zermatt.' },
  { id: 'earth-kilimanjaro', name: 'Kilimanjaro', body: 'Earth', lat: -3.07583, lon: 37.35333, viewAltitudeKm: 400, source: WIKI('Mount Kilimanjaro'), towards: MAWENZI,
    description: "Africa's highest mountain (5,895 m), a dormant volcano in Tanzania.",
    scene: 'Ice cliffs on the crater rim, and the jagged peak of Mawenzi above the clouds to the east.' },
  { id: 'earth-ha-long-bay', name: 'Hạ Long Bay', body: 'Earth', lat: 20.9, lon: 107.2, viewAltitudeKm: 300, source: WIKI('Hạ Long Bay'),
    description: 'About 1,600 limestone islands and islets in the Gulf of Tonkin, Vietnam.',
    scene: 'Forested limestone towers rise from emerald water as far as you can see.' },
  { id: 'earth-uyuni', name: 'Salar de Uyuni', body: 'Earth', lat: -20.13378, lon: -67.48913, viewAltitudeKm: 400, source: WIKI('Salar de Uyuni'), towards: TUNUPA,
    description: "The world's largest salt flat, about 10,000 km², on the Bolivian Altiplano.",
    scene: 'A white plain to the horizon that mirrors the sky after rain, with Tunupa volcano to the north-west.' },
  { id: 'earth-yosemite', name: 'Yosemite Valley', body: 'Earth', lat: 37.72167, lon: -119.64639, viewAltitudeKm: 250, source: WIKI('Yosemite Valley'), towards: HALF_DOME,
    description: 'Glacier-carved granite valley in the Sierra Nevada, California.',
    scene: 'Half Dome closes the valley to the east between sheer granite walls and waterfalls.' },
  { id: 'earth-angel-falls', name: 'Angel Falls', body: 'Earth', lat: 5.9675, lon: -62.53556, viewAltitudeKm: 250, source: WIKI('Angel Falls'), towards: AUYAN_TEPUI,
    description: "The world's highest uninterrupted waterfall (979 m), off Auyán-tepui, Venezuela.",
    scene: 'Water leaps from the rim of the table mountain and turns to mist before it reaches the jungle.' },

  // ── Moon ── Earth hangs over 0°N 0°E, nearly fixed in the sky (libration rocks it a few degrees)
  { id: 'moon-tycho', name: 'Tycho', body: 'Moon', lat: -43.296, lon: e(348.785), viewAltitudeKm: 300, source: GAZ(6163), towards: PARENT,
    description: 'Young 85 km crater with a bright ray system visible from Earth.',
    scene: 'Central peaks rise from the crater floor, and Earth hangs about 46° up, a little east of north.' },
  { id: 'moon-copernicus', name: 'Copernicus', body: 'Moon', lat: 9.621, lon: e(339.921), viewAltitudeKm: 300, source: GAZ(1296), towards: PARENT,
    description: '93 km crater with terraced walls and central peaks in Oceanus Procellarum.',
    scene: 'Terraced walls ring the floor, and Earth hangs high, about 68° up in the east-south-east.' },
  { id: 'moon-tranquility', name: 'Tranquility Base', body: 'Moon', lat: 0.674, lon: 23.473, viewAltitudeKm: 250, source: `${GAZ(5684)}, Statio Tranquillitatis`, towards: PARENT,
    description: 'Apollo 11 landing site, 20 July 1969, in Mare Tranquillitatis.',
    scene: 'Flat grey mare to a close horizon, and Earth about 66° up in the west, where it never sets.' },
  { id: 'moon-imbrium', name: 'Mare Imbrium', body: 'Moon', lat: 34.724, lon: e(345.091), viewAltitudeKm: 1200, source: GAZ(3678), towards: PARENT,
    description: 'Vast basalt-flooded impact basin, about 1,100 km across.',
    scene: 'Dark lava plains roll to the horizon under Earth, about 53° up in the south-south-east.' },
  { id: 'moon-shackleton', name: 'Shackleton', body: 'Moon', lat: -89.67, lon: 129.78, viewAltitudeKm: 400, source: GAZ(5450), towards: PARENT,
    description: 'Permanently shadowed crater at the lunar south pole (strongly stretched in this map projection).',
    scene: 'Earth grazes the horizon, rising and setting with libration, while the Sun circles low around the rim.' },
  { id: 'moon-hadley', name: 'Hadley–Apennine (Apollo 15)', body: 'Moon', lat: 26.1322, lon: 3.6339, viewAltitudeKm: 200, source: `${WIKI('Apollo 15')} (landing site); Mons Hadley ${GAZ(3983)}`, towards: MONS_HADLEY,
    description: 'Apollo 15 landing site, July 1971, between the Apennine mountains and Hadley Rille.',
    scene: 'Mons Hadley rises about 4.5 km to the north-east beside the winding Hadley Rille, with Earth high in the southern sky behind you.' },
  { id: 'moon-taurus-littrow', name: 'Taurus–Littrow (Apollo 17)', body: 'Moon', lat: 20.1908, lon: 30.7717, viewAltitudeKm: 200, source: `${WIKI('Apollo 17')} (landing site); Taurus Littrow Valley ${GAZ(5881)}`, towards: PARENT,
    description: 'Apollo 17 landing site, December 1972, the last crewed landing on the Moon.',
    scene: 'A valley between bright massifs, with Earth about 54° up in the south-west.' },
  { id: 'moon-aristarchus', name: 'Aristarchus', body: 'Moon', lat: 23.73, lon: e(312.51), viewAltitudeKm: 250, source: GAZ(380), towards: PARENT,
    description: 'Brightest large crater on the Moon, 40 km across, on the Aristarchus Plateau.',
    scene: 'Bright, freshly exposed rock on the walls, and Earth about 38° up in the east-south-east.' },
  { id: 'moon-smythii', name: 'Mare Smythii (Earthrise)', body: 'Moon', lat: -1.709, lon: 87.05, viewAltitudeKm: 800, source: GAZ(3689), towards: PARENT,
    description: "Mare on the Moon's eastern limb, seen edge-on from Earth.",
    scene: 'Earth sits about 3° above the western horizon, rising and setting over the month as the Moon librates.' },
  { id: 'moon-tsiolkovskiy', name: 'Tsiolkovskiy', body: 'Moon', lat: -20.379, lon: 128.972, viewAltitudeKm: 500, source: GAZ(6108),
    description: 'Far-side crater 185 km across with a dark, lava-flooded floor and a bright central peak.',
    scene: 'Earth never rises here: the sky holds only the Sun and the stars over the central peak.' },

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

  // ── Venus (radar imagery) ──────────────────────────────────────────────────────────────
  { id: 'venus-maxwell', name: 'Maxwell Montes', body: 'Venus', lat: 65.2, lon: 3.3, viewAltitudeKm: 1500, source: GAZ(3766), towards: CLEOPATRA,
    description: 'Highest mountain range on Venus, about 11 km above the mean surface.',
    scene: 'Under a dim orange sky, the impact crater Cleopatra cuts into the eastern slopes.' },
  { id: 'venus-maat', name: 'Maat Mons', body: 'Venus', lat: 0.5, lon: e(194.6), viewAltitudeKm: 1200, source: GAZ(3550),
    description: 'Largest volcano on Venus, about 8 km high.',
    scene: 'Lava flows spread for hundreds of kilometres beneath a crushing, overcast sky.' },
  { id: 'venus-aphrodite', name: 'Aphrodite Terra', body: 'Venus', lat: -5.8, lon: 104.8, viewAltitudeKm: 6000, source: GAZ(317),
    description: 'Equatorial highland roughly the size of South America.',
    scene: 'Fractured ridges and rift valleys under thick cloud that glows a dull orange.' },
  { id: 'venus-venera-13', name: 'Venera 13 landing site', body: 'Venus', lat: -7.5, lon: e(303), viewAltitudeKm: 300, source: `${WIKI('Venera 13')} (Venus longitudes are east-positive)`,
    description: 'Where Venera 13 landed on 1 March 1982 and returned the first colour pictures from the surface.',
    scene: 'Flat plates of dark rock under an orange sky, at about 457 °C and 89 times Earth’s air pressure.' },
  { id: 'venus-sapas', name: 'Sapas Mons', body: 'Venus', lat: 8.5, lon: e(188.3), viewAltitudeKm: 800, source: GAZ(5318),
    description: 'Broad shield volcano about 400 km across with two flat-topped summit mesas, in Atla Regio.',
    scene: 'Overlapping lava flows fan out from the twin summit mesas in every direction.' },

  // ── Mars ─────────────────────────────────────────────────────────────────────────────────
  { id: 'mars-olympus', name: 'Olympus Mons', body: 'Mars', lat: 18.653, lon: e(226.198), viewAltitudeKm: 1200, source: GAZ(4453),
    description: 'Shield volcano about 22 km high and 600 km across, the tallest in the Solar System.',
    scene: 'The nested summit caldera opens at your feet, and the flanks are so broad they fall away below the horizon.' },
  { id: 'mars-valles', name: 'Valles Marineris', body: 'Mars', lat: -14.006, lon: e(301.412), viewAltitudeKm: 2500, source: GAZ(6288), towards: MELAS_CHASMA,
    description: 'Canyon system over 4,000 km long and up to 7 km deep.',
    scene: 'Walls kilometres high on both sides as the canyon runs west towards Melas Chasma.' },
  { id: 'mars-gale', name: 'Gale crater', body: 'Mars', lat: -5.367, lon: 137.811, viewAltitudeKm: 500, source: GAZ(2071), towards: AEOLIS_MONS,
    description: 'Landing site of the Curiosity rover (2012), with Mount Sharp at its centre.',
    scene: 'The layered slopes of Mount Sharp (Aeolis Mons) rise about 5 km into the butterscotch sky to the north.' },
  { id: 'mars-jezero', name: 'Jezero crater', body: 'Mars', lat: 18.408, lon: 77.687, viewAltitudeKm: 400, source: GAZ(14300), towards: NERETVA_VALLIS,
    description: 'Ancient lake basin and river delta, landing site of Perseverance (2021).',
    scene: 'The old river delta fans in from the west, where Neretva Vallis breached the crater rim.' },
  { id: 'mars-hellas', name: 'Hellas Planitia', body: 'Mars', lat: -42.43, lon: 70.502, viewAltitudeKm: 3000, source: GAZ(2432),
    description: 'Impact basin about 2,300 km across and over 7 km deep, the lowest ground on Mars.',
    scene: 'A dusty plain under a hazy sky, with the thickest air anywhere on Mars.' },
  { id: 'mars-planum-boreum', name: 'Planum Boreum (north polar cap)', body: 'Mars', lat: 87.32, lon: 54.96, viewAltitudeKm: 1200, source: GAZ(4754),
    description: 'North polar ice cap, a dome of layered water ice about 3 km thick and 1,000 km across.',
    scene: 'Spiral troughs cut through layered ice that glows under a low summer Sun.' },
  { id: 'mars-korolev', name: 'Korolev crater', body: 'Mars', lat: 72.768, lon: 164.584, viewAltitudeKm: 400, source: GAZ(3091),
    description: '81 km crater filled year-round with a mound of water ice about 1.8 km thick.',
    scene: 'A smooth white ice field spreads to the dark crater rim on every side.' },
  { id: 'mars-noctis', name: 'Noctis Labyrinthus', body: 'Mars', lat: -6.363, lon: e(258.811), viewAltitudeKm: 1000, source: GAZ(4324),
    description: 'Maze of intersecting canyons at the western end of Valles Marineris.',
    scene: 'Steep-walled valleys criss-cross the high plateau, where morning fog sometimes pools.' },
  { id: 'mars-victoria', name: 'Victoria crater', body: 'Mars', lat: -2.052, lon: e(354.502), viewAltitudeKm: 150, source: GAZ(14522),
    description: 'Crater under a kilometre wide in Meridiani Planum, explored by the Opportunity rover from 2006 to 2008.',
    scene: 'Scalloped cliffs of layered rock ring a floor of rippled dunes.' },
  { id: 'mars-arsia', name: 'Arsia Mons', body: 'Mars', lat: -8.257, lon: e(239.907), viewAltitudeKm: 900, source: GAZ(394),
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
  { id: 'titan-kraken', name: 'Kraken Mare', body: 'Titan', lat: 68.0, lon: 50.0, viewAltitudeKm: 1500, source: GAZ(14399), towards: PARENT,
    description: 'Largest sea of liquid methane and ethane on Titan, about 1,170 km across.',
    scene: 'A dark hydrocarbon sea under orange haze; Saturn is about 14° up in the south-west, but the haze hides it.' },
  { id: 'titan-ligeia', name: 'Ligeia Mare', body: 'Titan', lat: 79.7, lon: 112.1, viewAltitudeKm: 800, source: GAZ(14400),
    description: "Titan's second-largest sea, about 500 km across, sounded by Cassini's radar to about 160 m deep.",
    scene: 'Calm liquid to the horizon under a dim orange sky; Saturn is just below the horizon.' },
  { id: 'titan-huygens', name: 'Huygens landing site', body: 'Titan', lat: -10.573, lon: e(360 - 192.335), viewAltitudeKm: 300, source: `${WIKI('Huygens (spacecraft)')}, 192.335° W converted to east-positive`,
    description: 'Where ESA\'s Huygens probe landed on 14 January 2005, the most distant landing yet made.',
    scene: 'Rounded ice pebbles on a damp plain under an orange sky; Saturn never rises here.' },
  { id: 'titan-selk', name: 'Selk crater', body: 'Titan', lat: 7.0, lon: 161.0, viewAltitudeKm: 400, source: GAZ(14334),
    description: "80 km impact crater, the destination of NASA's Dragonfly rotorcraft.",
    scene: 'Dunes of dark organic sand surround the eroded crater rim.' },
  { id: 'titan-doom-mons', name: 'Doom Mons', body: 'Titan', lat: -14.65, lon: e(319.58), viewAltitudeKm: 300, source: GAZ(15044), towards: PARENT,
    description: 'Titan\'s highest known peak, about 1.45 km, beside Sotra Patera, a pit that may be cryovolcanic.',
    scene: 'The deep pit of Sotra Patera opens beside the peak; Saturn is about 47° up in the east-north-east behind the haze.' },
  { id: 'iapetus-ridge', name: 'Equatorial ridge (Tortelosa Montes)', body: 'Iapetus', lat: 0.0, lon: e(295.3), viewAltitudeKm: 500, source: GAZ(14497), towards: PARENT,
    description: "Part of the mountain ridge that runs along Iapetus' equator, in places about 20 km high.",
    scene: 'A wall of mountains along the equator, and Saturn, about 2° wide, about 25° up in the east.' },
  { id: 'iapetus-turgis', name: 'Turgis', body: 'Iapetus', lat: 16.9, lon: e(331.6), viewAltitudeKm: 1000, source: GAZ(14488), towards: PARENT,
    description: 'Impact basin about 580 km across, with giant ice landslides down its walls.',
    scene: 'Basin walls sweep away to the horizon, with Saturn about 57° up in the east-south-east.' },

  // ── Uranus and Neptune systems
  { id: 'miranda-verona', name: 'Verona Rupes', body: 'Miranda', lat: -18.3, lon: e(347.8), viewAltitudeKm: 200, source: GAZ(6359), towards: PARENT,
    description: 'Fault scarp an estimated 5–10 km high, the tallest known cliff in the Solar System.',
    scene: 'The cliff drops away into darkness, and Uranus, about 22° wide, hangs 68° up in the north-east.' },
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

export const LANDMARKS: Landmark[] = ENTRIES.map(({ towards, ...l }) =>
  towards ? { ...l, viewHeadingDeg: Math.round(bearingDeg(l.lat, l.lon, towards[0], towards[1]) * 10) / 10 } : l,
);

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
