import { CelestialBodyDefinition } from '../types/catalogue';
import { SOLAR_SYSTEM_BODIES } from '../astronomy/SolarSystemData';

export const MOONS_AND_MINOR_BODIES: CelestialBodyDefinition[] = [
  // --- EARTH SYSTEM ---
  {
    id: '301',
    name: 'Moon',
    category: 'moon',
    orderFromSun: 3,
    parentId: '399',
    parentName: 'Earth',
    physical: {
      meanRadiusKm: 1737.4,
      equatorialRadiusKm: 1738.1,
      polarRadiusKm: 1736.0,
      flattening: 0.0012,
      massKg: 7.342e22,
      gmKm3S2: 4902.80,
      rotationPeriodHours: 655.728, // Synchronous rotation (27.32 days)
      axialTiltDeg: 6.68,
      meanTemperatureK: 250,
      colorHex: '#c4c3be',
    },
    orbit: {
      // JPL SSD planetary satellite mean elements (J2000 ecliptic), epoch 2000-01-01.5 TDB
      semiMajorAxisKm: 384400.0,
      semiMajorAxisAU: 0.0025695553,
      eccentricity: 0.0554,
      inclinationDeg: 5.16,
      longitudeAscendingNodeDeg: 125.08,
      argumentPeriapsisDeg: 318.15,
      meanAnomalyAtEpochDeg: 135.27,
      orbitalPeriodDays: 27.321661,
      epochJd: 2451545.0,
      meanMotionDegPerDay: 13.064995931,
      periapsisArgRateDegPerDay: 0.164353224,
      nodeRateDegPerDay: -0.05299066,
      source: 'JPL SSD planetary satellite mean elements',
    },
    description: 'Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands.'
  },

  // --- MARS MOONS ---
  {
    id: '401',
    name: 'Phobos',
    category: 'moon',
    orderFromSun: 4,
    parentId: '499',
    parentName: 'Mars',
    physical: {
      meanRadiusKm: 11.26,
      equatorialRadiusKm: 13.0,
      polarRadiusKm: 9.1,
      massKg: 1.0659e16,
      gmKm3S2: 0.00071,
      rotationPeriodHours: 7.654,
      axialTiltDeg: 0.0,
      colorHex: '#8b847d',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 9377.9,
      semiMajorAxisAU: 6.26874e-05,
      eccentricity: 0.01468188,
      inclinationDeg: 25.639416,
      longitudeAscendingNodeDeg: 82.61167,
      argumentPeriapsisDeg: 282.404283,
      meanAnomalyAtEpochDeg: 176.914893,
      orbitalPeriodDays: 0.31891023,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 1128.84431459,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit.'
  },
  {
    id: '402',
    name: 'Deimos',
    category: 'moon',
    orderFromSun: 4,
    parentId: '499',
    parentName: 'Mars',
    physical: {
      meanRadiusKm: 6.2,
      massKg: 1.4762e15,
      rotationPeriodHours: 30.31,
      axialTiltDeg: 0.0,
      colorHex: '#999186',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 23458.846,
      semiMajorAxisAU: 0.0001568127,
      eccentricity: 0.00025811,
      inclinationDeg: 24.120481,
      longitudeAscendingNodeDeg: 81.546986,
      argumentPeriapsisDeg: 52.283083,
      meanAnomalyAtEpochDeg: 122.884373,
      orbitalPeriodDays: 1.2624407,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 285.161908991,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography.'
  },

  // --- JUPITER GALILEAN MOONS ---
  {
    id: '501',
    name: 'Io',
    category: 'moon',
    orderFromSun: 5,
    parentId: '599',
    parentName: 'Jupiter',
    physical: {
      meanRadiusKm: 1821.5,
      massKg: 8.9319e22,
      gmKm3S2: 5959.91,
      rotationPeriodHours: 42.456,
      axialTiltDeg: 0.0,
      meanTemperatureK: 130,
      colorHex: '#e5c158',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 422020.056,
      semiMajorAxisAU: 0.0028210298,
      eccentricity: 0.00359279,
      inclinationDeg: 2.228063,
      longitudeAscendingNodeDeg: 338.403388,
      argumentPeriapsisDeg: 31.382494,
      meanAnomalyAtEpochDeg: 199.124628,
      orbitalPeriodDays: 1.769137786,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 203.488955382,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide.'
  },
  {
    id: '502',
    name: 'Europa',
    category: 'moon',
    orderFromSun: 5,
    parentId: '599',
    parentName: 'Jupiter',
    physical: {
      meanRadiusKm: 1560.8,
      massKg: 4.7998e22,
      gmKm3S2: 3202.73,
      rotationPeriodHours: 85.224,
      axialTiltDeg: 0.1,
      meanTemperatureK: 102,
      colorHex: '#c7bfae',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 671258.947,
      semiMajorAxisAU: 0.0044870889,
      eccentricity: 0.00931579,
      inclinationDeg: 2.07625,
      longitudeAscendingNodeDeg: 326.203313,
      argumentPeriapsisDeg: 224.926561,
      meanAnomalyAtEpochDeg: 279.791695,
      orbitalPeriodDays: 3.551181041,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 101.37472459,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential.'
  },
  {
    id: '503',
    name: 'Ganymede',
    category: 'moon',
    orderFromSun: 5,
    parentId: '599',
    parentName: 'Jupiter',
    physical: {
      meanRadiusKm: 2631.2,
      massKg: 1.4819e23,
      gmKm3S2: 9887.83,
      rotationPeriodHours: 171.72,
      axialTiltDeg: 0.2,
      meanTemperatureK: 110,
      colorHex: '#8e8379',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 1070453.601,
      semiMajorAxisAU: 0.0071555404,
      eccentricity: 0.00274315,
      inclinationDeg: 2.34352,
      longitudeAscendingNodeDeg: 339.06555,
      argumentPeriapsisDeg: 3.818835,
      meanAnomalyAtEpochDeg: 349.11927,
      orbitalPeriodDays: 7.15455296,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 50.317609222,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core.'
  },
  {
    id: '504',
    name: 'Callisto',
    category: 'moon',
    orderFromSun: 5,
    parentId: '599',
    parentName: 'Jupiter',
    physical: {
      meanRadiusKm: 2410.3,
      massKg: 1.0759e23,
      gmKm3S2: 7179.29,
      rotationPeriodHours: 400.536,
      axialTiltDeg: 0.0,
      meanTemperatureK: 134,
      colorHex: '#696057',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 1882917.904,
      semiMajorAxisAU: 0.0125865288,
      eccentricity: 0.00707683,
      inclinationDeg: 1.952455,
      longitudeAscendingNodeDeg: 336.746982,
      argumentPeriapsisDeg: 34.494869,
      meanAnomalyAtEpochDeg: 126.955427,
      orbitalPeriodDays: 16.6890184,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 21.57107095,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin).'
  },

  // --- SATURN MAJOR MOONS ---
  {
    id: '601',
    name: 'Mimas',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 198.2,
      massKg: 3.7493e19,
      rotationPeriodHours: 22.6,
      colorHex: '#b2b2b2',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 186034.255,
      semiMajorAxisAU: 0.0012435622,
      eccentricity: 0.0218639,
      inclinationDeg: 28.47676,
      longitudeAscendingNodeDeg: 172.727658,
      argumentPeriapsisDeg: 169.377604,
      meanAnomalyAtEpochDeg: 326.994857,
      orbitalPeriodDays: 0.942421959,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 381.994494676,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division.'
  },
  {
    id: '602',
    name: 'Enceladus',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 252.1,
      massKg: 1.0802e20,
      gmKm3S2: 7.21,
      rotationPeriodHours: 32.88,
      colorHex: '#ffffff',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 238411.673,
      semiMajorAxisAU: 0.0015936836,
      eccentricity: 0.00513554,
      inclinationDeg: 28.043619,
      longitudeAscendingNodeDeg: 169.530888,
      argumentPeriapsisDeg: 214.451065,
      meanAnomalyAtEpochDeg: 62.261399,
      orbitalPeriodDays: 1.370217855,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 262.731943454,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'
  },
  {
    id: '603',
    name: 'Tethys',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 531.0,
      massKg: 6.1745e20,
      rotationPeriodHours: 45.31,
      colorHex: '#d8d8d8',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 294976.454,
      semiMajorAxisAU: 0.0019717958,
      eccentricity: 0.00099726,
      inclinationDeg: 28.175586,
      longitudeAscendingNodeDeg: 171.825733,
      argumentPeriapsisDeg: 127.950883,
      meanAnomalyAtEpochDeg: 2.809594,
      orbitalPeriodDays: 1.88780216,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 190.697948984,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km.'
  },
  {
    id: '604',
    name: 'Dione',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 561.4,
      massKg: 1.0955e21,
      rotationPeriodHours: 65.69,
      colorHex: '#cac8c5',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 377644.232,
      semiMajorAxisAU: 0.0025243958,
      eccentricity: 0.00265791,
      inclinationDeg: 28.025672,
      longitudeAscendingNodeDeg: 169.549925,
      argumentPeriapsisDeg: 268.312567,
      meanAnomalyAtEpochDeg: 329.102147,
      orbitalPeriodDays: 2.736914742,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 131.534970555,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere.'
  },
  {
    id: '605',
    name: 'Rhea',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 763.5,
      massKg: 2.3065e21,
      rotationPeriodHours: 108.43,
      colorHex: '#bbb8b4',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 527244.268,
      semiMajorAxisAU: 0.0035244102,
      eccentricity: 0.00136693,
      inclinationDeg: 28.274533,
      longitudeAscendingNodeDeg: 169.967171,
      argumentPeriapsisDeg: 166.661352,
      meanAnomalyAtEpochDeg: 13.027101,
      orbitalPeriodDays: 4.517500436,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 79.690086387,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere.'
  },
  {
    id: '606',
    name: 'Titan',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 2574.8,
      equatorialRadiusKm: 2574.8,
      polarRadiusKm: 2574.8,
      flattening: 0.0,
      massKg: 1.3452e23,
      gmKm3S2: 8978.14,
      rotationPeriodHours: 382.68,
      axialTiltDeg: 0.0,
      meanTemperatureK: 94,
      colorHex: '#e5a84b',
      atmosphere: {
        surfacePressureBar: 1.45,
        composition: [
          { gas: 'N2', percentage: 95.0 },
          { gas: 'CH4', percentage: 4.9 },
        ]
      }
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 1221971.892,
      semiMajorAxisAU: 0.0081683776,
      eccentricity: 0.02881004,
      inclinationDeg: 27.705537,
      longitudeAscendingNodeDeg: 169.080756,
      argumentPeriapsisDeg: 178.340423,
      meanAnomalyAtEpochDeg: 328.923552,
      orbitalPeriodDays: 15.94542068,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 22.577014882,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles.'
  },
  {
    id: '607',
    name: 'Hyperion',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 135.0,
      massKg: 5.6199e18,
      rotationPeriodHours: 300.0, // Chaotic rotation
      colorHex: '#9c8c7c',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 1486933.985,
      semiMajorAxisAU: 0.0099395398,
      eccentricity: 0.09542499,
      inclinationDeg: 27.056176,
      longitudeAscendingNodeDeg: 169.549243,
      argumentPeriapsisDeg: 67.294493,
      meanAnomalyAtEpochDeg: 98.155885,
      orbitalPeriodDays: 21.2766088,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 16.919989618,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan.'
  },
  {
    id: '608',
    name: 'Iapetus',
    category: 'moon',
    orderFromSun: 6,
    parentId: '699',
    parentName: 'Saturn',
    physical: {
      meanRadiusKm: 734.3,
      massKg: 1.8056e21,
      rotationPeriodHours: 1903.92, // 79.33 days
      colorHex: '#847970',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 3565269.983,
      semiMajorAxisAU: 0.0238323578,
      eccentricity: 0.02970025,
      inclinationDeg: 16.979231,
      longitudeAscendingNodeDeg: 138.869009,
      argumentPeriapsisDeg: 230.853136,
      meanAnomalyAtEpochDeg: 320.152812,
      orbitalPeriodDays: 79.3301825,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 4.537995359,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge.'
  },

  // --- URANUS MAJOR MOONS ---
  {
    id: '705',
    name: 'Miranda',
    category: 'moon',
    orderFromSun: 7,
    parentId: '799',
    parentName: 'Uranus',
    physical: {
      meanRadiusKm: 235.8,
      massKg: 6.59e19,
      rotationPeriodHours: 33.91,
      colorHex: '#a0a0a0',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 129871.122,
      semiMajorAxisAU: 0.0008681348,
      eccentricity: 0.0011248,
      inclinationDeg: 97.989082,
      longitudeAscendingNodeDeg: 163.186619,
      argumentPeriapsisDeg: 67.391864,
      meanAnomalyAtEpochDeg: 207.222114,
      orbitalPeriodDays: 1.413479,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 254.690731168,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km).'
  },
  {
    id: '701',
    name: 'Ariel',
    category: 'moon',
    orderFromSun: 7,
    parentId: '799',
    parentName: 'Uranus',
    physical: {
      meanRadiusKm: 578.9,
      massKg: 1.251e21,
      rotationPeriodHours: 60.48,
      colorHex: '#b4b4b4',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 190944.721,
      semiMajorAxisAU: 0.0012763866,
      eccentricity: 0.0005326,
      inclinationDeg: 97.718049,
      longitudeAscendingNodeDeg: 167.665855,
      argumentPeriapsisDeg: 276.587566,
      meanAnomalyAtEpochDeg: 51.205773,
      orbitalPeriodDays: 2.520379,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 142.835660827,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows.'
  },
  {
    id: '702',
    name: 'Umbriel',
    category: 'moon',
    orderFromSun: 7,
    parentId: '799',
    parentName: 'Uranus',
    physical: {
      meanRadiusKm: 584.7,
      massKg: 1.275e21,
      rotationPeriodHours: 99.46,
      colorHex: '#737373',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 265988.581,
      semiMajorAxisAU: 0.0017780238,
      eccentricity: 0.00337264,
      inclinationDeg: 97.714436,
      longitudeAscendingNodeDeg: 167.725316,
      argumentPeriapsisDeg: 66.275993,
      meanAnomalyAtEpochDeg: 14.683581,
      orbitalPeriodDays: 4.144177,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 86.868876498,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda.'
  },
  {
    id: '703',
    name: 'Titania',
    category: 'moon',
    orderFromSun: 7,
    parentId: '799',
    parentName: 'Uranus',
    physical: {
      meanRadiusKm: 788.9,
      massKg: 3.42e21,
      rotationPeriodHours: 208.94,
      colorHex: '#9f9994',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 436251.111,
      semiMajorAxisAU: 0.0029161586,
      eccentricity: 0.00197821,
      inclinationDeg: 97.762135,
      longitudeAscendingNodeDeg: 167.643651,
      argumentPeriapsisDeg: 280.488041,
      meanAnomalyAtEpochDeg: 236.26202,
      orbitalPeriodDays: 8.705872,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 41.351400526,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean.'
  },
  {
    id: '704',
    name: 'Oberon',
    category: 'moon',
    orderFromSun: 7,
    parentId: '799',
    parentName: 'Uranus',
    physical: {
      meanRadiusKm: 761.4,
      massKg: 3.014e21,
      rotationPeriodHours: 323.11,
      colorHex: '#938c86',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 583573.694,
      semiMajorAxisAU: 0.0039009492,
      eccentricity: 0.00243809,
      inclinationDeg: 97.905711,
      longitudeAscendingNodeDeg: 167.708289,
      argumentPeriapsisDeg: 171.765242,
      meanAnomalyAtEpochDeg: 34.68861,
      orbitalPeriodDays: 13.463239,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 26.739479259,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits.'
  },

  // --- NEPTUNE MOON ---
  {
    id: '801',
    name: 'Triton',
    category: 'moon',
    orderFromSun: 8,
    parentId: '899',
    parentName: 'Neptune',
    physical: {
      meanRadiusKm: 1352.6,
      massKg: 2.139e22,
      gmKm3S2: 1427.6,
      rotationPeriodHours: -141.048, // Synchronous retrograde
      axialTiltDeg: 0.0,
      meanTemperatureK: 38,
      colorHex: '#e2cfc4',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 354765.344,
      semiMajorAxisAU: 0.0023714598,
      eccentricity: 0.00010818,
      inclinationDeg: 129.126619,
      longitudeAscendingNodeDeg: 222.868711,
      argumentPeriapsisDeg: 109.713483,
      meanAnomalyAtEpochDeg: 179.672821,
      orbitalPeriodDays: 5.876854,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 61.257264516,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain.'
  },

  // --- PLUTO-CHARON SYSTEM ---
  {
    id: '999',
    name: 'Pluto',
    category: 'dwarf_planet',
    orderFromSun: 9,
    physical: {
      meanRadiusKm: 1188.3,
      equatorialRadiusKm: 1188.3,
      polarRadiusKm: 1188.3,
      flattening: 0.0,
      massKg: 1.303e22,
      gmKm3S2: 869.6,
      rotationPeriodHours: -153.2928, // 6.387 days retrograde
      axialTiltDeg: 122.53,
      meanTemperatureK: 44,
      colorHex: '#c79f82',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 5922374660.0,
      semiMajorAxisAU: 39.5886293852,
      eccentricity: 0.2518378779,
      inclinationDeg: 17.14771141,
      longitudeAscendingNodeDeg: 110.29238405,
      argumentPeriapsisDeg: 113.70900152,
      meanAnomalyAtEpochDeg: 38.68366347,
      orbitalPeriodDays: 90981.716,
      epochJd: 2457588.5,
      meanMotionDegPerDay: 0.003956838956,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'
  },
  {
    id: '901',
    name: 'Charon',
    category: 'moon',
    orderFromSun: 9,
    parentId: '999',
    parentName: 'Pluto',
    physical: {
      meanRadiusKm: 606.0,
      massKg: 1.586e21,
      rotationPeriodHours: 153.29,
      colorHex: '#99948e',
    },
    orbit: {
      // JPL Horizons osculating elements relative to the parent, J2000 ecliptic, epoch 2026-10-14.0 TDB;
      // advanced with the mean sidereal period
      semiMajorAxisKm: 19595.763,
      semiMajorAxisAU: 0.0001309896,
      eccentricity: 0.00016098,
      inclinationDeg: 112.887772,
      longitudeAscendingNodeDeg: 227.393077,
      argumentPeriapsisDeg: 172.262887,
      meanAnomalyAtEpochDeg: 355.44348,
      orbitalPeriodDays: 6.3872304,
      epochJd: 2461327.5,
      meanMotionDegPerDay: 56.362457193,
      source: 'JPL Horizons osculating elements (parent-centred, ecliptic J2000)',
    },
    description: 'Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms.'
  },

  // --- DWARF PLANETS & ASTEROIDS ---
  {
    id: '1',
    name: 'Ceres',
    category: 'dwarf_planet',
    orderFromSun: 4.5,
    physical: {
      meanRadiusKm: 469.7,
      equatorialRadiusKm: 487.3,
      polarRadiusKm: 446.0,
      flattening: 0.0847,
      massKg: 9.3835e20,
      gmKm3S2: 62.63,
      rotationPeriodHours: 9.074,
      axialTiltDeg: 4.0,
      meanTemperatureK: 168,
      colorHex: '#88847e',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 413720779.5,
      semiMajorAxisAU: 2.765552595,
      eccentricity: 0.0796922951,
      inclinationDeg: 10.5880278,
      longitudeAscendingNodeDeg: 80.24862682,
      argumentPeriapsisDeg: 73.29421453,
      meanAnomalyAtEpochDeg: 274.41934638,
      orbitalPeriodDays: 1679.853,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.214304450648,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater).'
  },
  {
    id: '4',
    name: 'Vesta',
    category: 'asteroid',
    orderFromSun: 4.3,
    physical: {
      meanRadiusKm: 261.4,
      equatorialRadiusKm: 286.3,
      polarRadiusKm: 229.0,
      flattening: 0.20,
      massKg: 2.59e20,
      rotationPeriodHours: 5.342,
      axialTiltDeg: 29.0,
      colorHex: '#a39b91',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 353255320.3,
      semiMajorAxisAU: 2.3613659651,
      eccentricity: 0.0902037438,
      inclinationDeg: 7.14392555,
      longitudeAscendingNodeDeg: 103.70129327,
      argumentPeriapsisDeg: 151.46864782,
      meanAnomalyAtEpochDeg: 81.19015608,
      orbitalPeriodDays: 1325.389,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.27161836136,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia.'
  },
  {
    id: '2',
    name: 'Pallas',
    category: 'asteroid',
    orderFromSun: 4.6,
    physical: {
      meanRadiusKm: 256.5,
      massKg: 2.05e20,
      rotationPeriodHours: 7.813,
      axialTiltDeg: 84.0,
      colorHex: '#827f7a',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 414320130.8,
      semiMajorAxisAU: 2.7695590107,
      eccentricity: 0.2307000996,
      inclinationDeg: 34.93279322,
      longitudeAscendingNodeDeg: 172.88661934,
      argumentPeriapsisDeg: 310.96991617,
      meanAnomalyAtEpochDeg: 254.24965217,
      orbitalPeriodDays: 1683.505,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.213839602925,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography.'
  },
  {
    id: '10',
    name: 'Hygiea',
    category: 'asteroid',
    orderFromSun: 4.8,
    physical: {
      meanRadiusKm: 203.6,
      massKg: 8.32e19,
      rotationPeriodHours: 13.825,
      colorHex: '#605c57',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 471379006.1,
      semiMajorAxisAU: 3.150974034,
      eccentricity: 0.1067092741,
      inclinationDeg: 3.82952995,
      longitudeAscendingNodeDeg: 283.11989275,
      argumentPeriapsisDeg: 312.42423873,
      meanAnomalyAtEpochDeg: 252.03442424,
      orbitalPeriodDays: 2042.987,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.176212550579,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption.'
  },
  {
    id: '16',
    name: 'Psyche',
    category: 'asteroid',
    orderFromSun: 4.7,
    physical: {
      meanRadiusKm: 111.0,
      massKg: 2.29e19,
      rotationPeriodHours: 4.196,
      axialTiltDeg: 95.0,
      colorHex: '#b8aba0',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 437681552.0,
      semiMajorAxisAU: 2.9257204665,
      eccentricity: 0.1349324738,
      inclinationDeg: 3.09874912,
      longitudeAscendingNodeDeg: 149.97538593,
      argumentPeriapsisDeg: 230.03267827,
      meanAnomalyAtEpochDeg: 79.76939505,
      orbitalPeriodDays: 1827.88,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.196949475811,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission.'
  },
  {
    id: '433',
    name: 'Eros',
    category: 'asteroid',
    orderFromSun: 3.5,
    physical: {
      meanRadiusKm: 8.42,
      massKg: 6.687e15,
      rotationPeriodHours: 5.270,
      colorHex: '#998d7f',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 218150155.0,
      semiMajorAxisAU: 1.4582437168,
      eccentricity: 0.2228779628,
      inclinationDeg: 10.8285441,
      longitudeAscendingNodeDeg: 304.26797134,
      argumentPeriapsisDeg: 178.91813191,
      meanAnomalyAtEpochDeg: 62.51145502,
      orbitalPeriodDays: 643.196,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.559704634704,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001.'
  },
  {
    id: '951',
    name: 'Gaspra',
    category: 'asteroid',
    orderFromSun: 4.1,
    physical: {
      meanRadiusKm: 6.1,
      massKg: 2.0e16,
      rotationPeriodHours: 7.042,
      colorHex: '#a09485',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 330608056.0,
      semiMajorAxisAU: 2.2099783537,
      eccentricity: 0.1737374595,
      inclinationDeg: 4.10465497,
      longitudeAscendingNodeDeg: 252.96729133,
      argumentPeriapsisDeg: 130.00376374,
      meanAnomalyAtEpochDeg: 112.95087164,
      orbitalPeriodDays: 1199.998,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.300000545277,
      source: 'JPL SBDB osculating elements',
    },
    description: 'First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions.'
  },
  {
    id: '243',
    name: 'Ida',
    category: 'asteroid',
    orderFromSun: 4.6,
    physical: {
      meanRadiusKm: 15.7,
      massKg: 4.2e16,
      rotationPeriodHours: 4.634,
      colorHex: '#9c9284',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 428350768.6,
      semiMajorAxisAU: 2.8633480317,
      eccentricity: 0.046109628,
      inclinationDeg: 1.13036309,
      longitudeAscendingNodeDeg: 323.53666094,
      argumentPeriapsisDeg: 113.25718268,
      meanAnomalyAtEpochDeg: 49.64769088,
      orbitalPeriodDays: 1769.741,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.20341963288,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon.'
  },
  {
    id: '101955',
    name: 'Bennu',
    category: 'asteroid',
    orderFromSun: 3.2,
    physical: {
      meanRadiusKm: 0.242,
      massKg: 7.329e10,
      rotationPeriodHours: 4.296,
      colorHex: '#3a3a3a',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 168505699.0,
      semiMajorAxisAU: 1.1263910259,
      eccentricity: 0.2037450762,
      inclinationDeg: 6.03494377,
      longitudeAscendingNodeDeg: 2.0608662,
      argumentPeriapsisDeg: 66.22306084,
      meanAnomalyAtEpochDeg: 101.703952,
      orbitalPeriodDays: 436.649,
      epochJd: 2455562.5,
      meanMotionDegPerDay: 0.824461350332,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023.'
  },
  {
    id: '162173',
    name: 'Ryugu',
    category: 'asteroid',
    orderFromSun: 3.3,
    physical: {
      meanRadiusKm: 0.448,
      massKg: 4.5e11,
      rotationPeriodHours: 7.632,
      colorHex: '#353535',
    },
    orbit: {
      // JPL Small-Body Database osculating heliocentric elements, J2000 ecliptic
      semiMajorAxisKm: 178158936.5,
      semiMajorAxisAU: 1.1909189327,
      eccentricity: 0.1910730046,
      inclinationDeg: 5.86644249,
      longitudeAscendingNodeDeg: 251.2897124,
      argumentPeriapsisDeg: 211.60899381,
      meanAnomalyAtEpochDeg: 62.34067409,
      orbitalPeriodDays: 474.703,
      epochJd: 2461200.5,
      meanMotionDegPerDay: 0.758369353853,
      source: 'JPL SBDB osculating elements',
    },
    description: 'Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids.'
  }
];

export const ALL_CELESTIAL_BODIES: CelestialBodyDefinition[] = [
  ...SOLAR_SYSTEM_BODIES,
  ...MOONS_AND_MINOR_BODIES,
];

export const SAGITTARIUS_A_STAR_DEF: CelestialBodyDefinition = {
  id: 'SGR_A_STAR',
  name: 'Sagittarius A*',
  category: 'black_hole',
  orderFromSun: 999,
  physical: {
    meanRadiusKm: 12690400, // Schwarzschild radius r_s = 2GM/c^2 (~12.69 million km)
    equatorialRadiusKm: 32971000, // Apparent black hole shadow radius (3*sqrt(3)/2 * r_s ~ 32.97 million km)
    polarRadiusKm: 12690400,
    flattening: 0.0,
    massKg: 8.544455e36, // 4.297 x 10^6 solar masses (GRAVITY Collaboration 2021)
    gmKm3S2: 5.70283e17,
    rotationPeriodHours: 0.18, // Relativistic orbital period at ISCO (~11 minutes)
    axialTiltDeg: 42.0, // Accretion disk inclination from EHT 2022
    meanTemperatureK: 1e7, // Hot synchrotron-emitting relativistic plasma
    colorHex: '#ffaa33',
  },
  orbit: {
    semiMajorAxisKm: 2.554e17, // ~8.277 kpc (~26,990 light-years)
    semiMajorAxisAU: 1.707e9,
    eccentricity: 0.0,
    inclinationDeg: 60.19, // Inclination of the galactic plane to the ecliptic (62.87° is to the equator)
    longitudeAscendingNodeDeg: 0,
    argumentPeriapsisDeg: 0,
    meanAnomalyAtEpochDeg: 0,
    orbitalPeriodDays: 2.3e8 * 365.25, // Sun's galactic orbital period (~230 million years)
  },
  description: 'Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk.'
};
