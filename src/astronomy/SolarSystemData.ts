import { CelestialBodyDefinition } from '../types/catalogue';

export const SOLAR_SYSTEM_BODIES: CelestialBodyDefinition[] = [
  {
    id: '10',
    name: 'Sun',
    category: 'star',
    orderFromSun: 0,
    physical: {
      meanRadiusKm: 695700,
      equatorialRadiusKm: 695700,
      polarRadiusKm: 695700,
      flattening: 0.0,
      massKg: 1.9885e30,
      gmKm3S2: 132712440041.9394,
      rotationPeriodHours: 609.12, // ~25.38 days at equator
      axialTiltDeg: 7.25,
      meanTemperatureK: 5778,
      spectralType: 'G2V',
      colorHex: '#ffdd77',
    },
    orbit: {
      semiMajorAxisKm: 0,
      semiMajorAxisAU: 0,
      eccentricity: 0,
      inclinationDeg: 0,
      longitudeAscendingNodeDeg: 0,
      argumentPeriapsisDeg: 0,
      meanAnomalyAtEpochDeg: 0,
      orbitalPeriodDays: 0,
    },
    description: 'Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass.'
  },
  {
    id: '199',
    name: 'Mercury',
    category: 'planet',
    orderFromSun: 1,
    physical: {
      meanRadiusKm: 2439.7,
      equatorialRadiusKm: 2439.7,
      polarRadiusKm: 2439.7,
      flattening: 0.0,
      massKg: 3.3011e23,
      gmKm3S2: 22031.78,
      rotationPeriodHours: 1407.6, // 58.646 days (3:2 spin-orbit resonance)
      axialTiltDeg: 0.034,
      meanTemperatureK: 440,
      colorHex: '#9c968f',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 57909226.5,
      semiMajorAxisAU: 0.38709927,
      eccentricity: 0.20563593,
      inclinationDeg: 7.00497902,
      longitudeAscendingNodeDeg: 48.33076593,
      argumentPeriapsisDeg: 29.12703035, // ϖ − Ω
      meanAnomalyAtEpochDeg: 174.79252722, // L − ϖ
      orbitalPeriodDays: 87.969,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: 3.7e-07,
        eccentricity: 1.906e-05,
        inclinationDeg: -0.00594749,
        longitudeAscendingNodeDeg: -0.12534081,
        argumentPeriapsisDeg: 0.2858177,
        meanAnomalyDeg: 149472.51363486,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere.'
  },
  {
    id: '299',
    name: 'Venus',
    category: 'planet',
    orderFromSun: 2,
    physical: {
      meanRadiusKm: 6051.8,
      equatorialRadiusKm: 6051.8,
      polarRadiusKm: 6051.8,
      flattening: 0.0,
      massKg: 4.8675e24,
      gmKm3S2: 324858.59,
      rotationPeriodHours: -5832.5, // Retrograde rotation
      axialTiltDeg: 177.36,
      meanTemperatureK: 737,
      colorHex: '#e3bb7b',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 108209474.5,
      semiMajorAxisAU: 0.72333566,
      eccentricity: 0.00677672,
      inclinationDeg: 3.39467605,
      longitudeAscendingNodeDeg: 76.67984255,
      argumentPeriapsisDeg: 54.92262463, // ϖ − Ω
      meanAnomalyAtEpochDeg: 50.37663232, // L − ϖ
      orbitalPeriodDays: 224.701,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: 3.9e-06,
        eccentricity: -4.107e-05,
        inclinationDeg: -0.0007889,
        longitudeAscendingNodeDeg: -0.27769418,
        argumentPeriapsisDeg: 0.28037747,
        meanAnomalyDeg: 58517.812704,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect.'
  },
  {
    id: '399',
    name: 'Earth',
    category: 'planet',
    orderFromSun: 3,
    physical: {
      meanRadiusKm: 6371.0,
      equatorialRadiusKm: 6378.137,
      polarRadiusKm: 6356.752,
      flattening: 0.003353,
      massKg: 5.9722e24,
      gmKm3S2: 398600.4418,
      rotationPeriodHours: 23.9344,
      axialTiltDeg: 23.439,
      meanTemperatureK: 288,
      colorHex: '#4b75a1',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD) — Earth-Moon barycenter
      semiMajorAxisKm: 149598261.2,
      semiMajorAxisAU: 1.00000261,
      eccentricity: 0.01671123,
      inclinationDeg: -1.531e-05,
      longitudeAscendingNodeDeg: 0.0,
      argumentPeriapsisDeg: 102.93768193, // ϖ − Ω
      meanAnomalyAtEpochDeg: 357.52688973, // L − ϖ
      orbitalPeriodDays: 365.256,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: 5.62e-06,
        eccentricity: -4.392e-05,
        inclinationDeg: -0.01294668,
        longitudeAscendingNodeDeg: 0.0,
        argumentPeriapsisDeg: 0.32327364,
        meanAnomalyDeg: 35999.04917617,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere.'
  },
  {
    id: '499',
    name: 'Mars',
    category: 'planet',
    orderFromSun: 4,
    physical: {
      meanRadiusKm: 3389.5,
      equatorialRadiusKm: 3396.2,
      polarRadiusKm: 3376.2,
      flattening: 0.00589,
      massKg: 6.4171e23,
      gmKm3S2: 42828.375,
      rotationPeriodHours: 24.6229,
      axialTiltDeg: 25.19,
      meanTemperatureK: 210,
      colorHex: '#c16138',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 227943822.4,
      semiMajorAxisAU: 1.52371034,
      eccentricity: 0.0933941,
      inclinationDeg: 1.84969142,
      longitudeAscendingNodeDeg: 49.55953891,
      argumentPeriapsisDeg: -73.5031685, // ϖ − Ω
      meanAnomalyAtEpochDeg: 19.39019754, // L − ϖ
      orbitalPeriodDays: 686.980,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: 1.847e-05,
        eccentricity: 7.882e-05,
        inclinationDeg: -0.00813131,
        longitudeAscendingNodeDeg: -0.29257343,
        argumentPeriapsisDeg: 0.73698431,
        meanAnomalyDeg: 19139.85827411,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps.'
  },
  {
    id: '599',
    name: 'Jupiter',
    category: 'planet',
    orderFromSun: 5,
    physical: {
      meanRadiusKm: 69911,
      equatorialRadiusKm: 71492,
      polarRadiusKm: 66854,
      flattening: 0.06487, // Significant oblateness
      massKg: 1.8982e27,
      gmKm3S2: 126686534.92,
      rotationPeriodHours: 9.925,
      axialTiltDeg: 3.13,
      meanTemperatureK: 165,
      colorHex: '#c8a679',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 778340816.7,
      semiMajorAxisAU: 5.202887,
      eccentricity: 0.04838624,
      inclinationDeg: 1.30439695,
      longitudeAscendingNodeDeg: 100.47390909,
      argumentPeriapsisDeg: -85.74542926, // ϖ − Ω
      meanAnomalyAtEpochDeg: 19.66796068, // L − ϖ
      orbitalPeriodDays: 4332.589,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: -0.00011607,
        eccentricity: -0.00013253,
        inclinationDeg: -0.00183714,
        longitudeAscendingNodeDeg: 0.20469106,
        argumentPeriapsisDeg: 0.00783562,
        meanAnomalyDeg: 3034.53360107,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot.'
  },
  {
    id: '699',
    name: 'Saturn',
    category: 'planet',
    orderFromSun: 6,
    physical: {
      meanRadiusKm: 58232,
      equatorialRadiusKm: 60268,
      polarRadiusKm: 54364,
      flattening: 0.09796, // Highest oblateness in Solar System
      massKg: 5.6834e26,
      gmKm3S2: 37931187.9,
      rotationPeriodHours: 10.656,
      axialTiltDeg: 26.73,
      meanTemperatureK: 134,
      colorHex: '#dfcf9f',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 1426666414.2,
      semiMajorAxisAU: 9.53667594,
      eccentricity: 0.05386179,
      inclinationDeg: 2.48599187,
      longitudeAscendingNodeDeg: 113.66242448,
      argumentPeriapsisDeg: -21.06354617, // ϖ − Ω
      meanAnomalyAtEpochDeg: 317.35536592, // L − ϖ
      orbitalPeriodDays: 10759.22,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: -0.0012506,
        eccentricity: -0.00050991,
        inclinationDeg: 0.00193609,
        longitudeAscendingNodeDeg: -0.28867794,
        argumentPeriapsisDeg: -0.13029422,
        meanAnomalyDeg: 1222.91259417,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock.'
  },
  {
    id: '799',
    name: 'Uranus',
    category: 'planet',
    orderFromSun: 7,
    physical: {
      meanRadiusKm: 25362,
      equatorialRadiusKm: 25559,
      polarRadiusKm: 24973,
      flattening: 0.02293,
      massKg: 8.6810e25,
      gmKm3S2: 5793939.3,
      rotationPeriodHours: -17.24, // Retrograde & tilted on side
      axialTiltDeg: 97.77,
      meanTemperatureK: 76,
      colorHex: '#8fe0ea',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 2870658170.7,
      semiMajorAxisAU: 19.18916464,
      eccentricity: 0.04725744,
      inclinationDeg: 0.77263783,
      longitudeAscendingNodeDeg: 74.01692503,
      argumentPeriapsisDeg: 96.93735127, // ϖ − Ω
      meanAnomalyAtEpochDeg: 142.28382821, // L − ϖ
      orbitalPeriodDays: 30685.4,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: -0.00196176,
        eccentricity: -4.397e-05,
        inclinationDeg: -0.00242939,
        longitudeAscendingNodeDeg: 0.04240589,
        argumentPeriapsisDeg: 0.36564692,
        meanAnomalyDeg: 428.07397504,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations.'
  },
  {
    id: '899',
    name: 'Neptune',
    category: 'planet',
    orderFromSun: 8,
    physical: {
      meanRadiusKm: 24622,
      equatorialRadiusKm: 24764,
      polarRadiusKm: 24341,
      flattening: 0.01708,
      massKg: 1.02413e26,
      gmKm3S2: 6835099.5,
      rotationPeriodHours: 16.11,
      axialTiltDeg: 28.32,
      meanTemperatureK: 72,
      colorHex: '#4b70dd',
    },
    orbit: {
      // JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets", Table 1
      // (Standish; J2000 ecliptic & equinox; valid 1800–2050 AD)
      semiMajorAxisKm: 4498396417.0,
      semiMajorAxisAU: 30.06992276,
      eccentricity: 0.00859048,
      inclinationDeg: 1.77004347,
      longitudeAscendingNodeDeg: 131.78422574,
      argumentPeriapsisDeg: -86.81946347, // ϖ − Ω
      meanAnomalyAtEpochDeg: 259.91520804, // L − ϖ
      orbitalPeriodDays: 60189.0,
      epochJd: 2451545.0,
      ratesPerCentury: {
        semiMajorAxisAU: 0.00026291,
        eccentricity: 5.105e-05,
        inclinationDeg: 0.00035372,
        longitudeAscendingNodeDeg: -0.00508664,
        argumentPeriapsisDeg: -0.317328,
        meanAnomalyDeg: 218.78186789,
      },
      source: 'JPL SSD approximate planetary positions (Standish), Table 1',
    },
    description: 'Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds.'
  }
];
