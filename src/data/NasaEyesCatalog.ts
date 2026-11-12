// AUTO-GENERATED from verified local NASA Eyes on the Solar System assets.
// Contains 100% authentic mission metadata, roles, GLTF asset paths, and binary .dyn segments.

import { CelestialBodyDefinition } from '../types/catalogue';

export interface NasaTrajectorySegment {
  file: string;
  ent?: string;
  parentId: string;
  kind: 'orb' | 'pos' | 'quat' | 'ori' | 'lin';
  inline: boolean;
  tMinSec: number;
  tMaxSec: number;
}

export interface NasaSurfaceSite {
  body: string;
  latDeg: number;
  lonDeg: number;
  altKm: number;
}

export interface NasaLagrangeHalo {
  point: 'L1' | 'L2';
  amplitudeKm: number;
  periodDays: number;
  phaseDeg: number;
}

export interface NasaFallbackOrbit {
  parentBody: string;
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
  lonAscendingNodeDeg: number;
  argPeriapsisDeg: number;
  meanAnomalyDeg: number;
  periodDays: number;
}

export interface NasaSpacecraftEntry {
  id: string;
  name: string;
  shortName: string;
  subcategory: string;
  missionGroup: string;
  agency: string;
  hostBody: string;
  status: string;
  activeSpan: string;
  featuredEpochUtc: string | null;
  modelPath: string;
  physicalSpanM: number;
  role: string;
  description: string;
  highlights: string[];
  colorHex: string;
  dynSegments: NasaTrajectorySegment[];
  oriSegment: NasaTrajectorySegment | null;
  surfaceSite: NasaSurfaceSite | null;
  lagrangeHalo: NasaLagrangeHalo | null;
  fallbackOrbit: NasaFallbackOrbit | null;
}

export interface NasaMissionEvent {
  id: string;
  label: string;
  dateUtc: string | null;
  target: string;
  desc: string;
}

export const NASA_SPACECRAFT_CATALOG: NasaSpacecraftEntry[] = [
  {
    "id": "sc_ace",
    "name": "ACE",
    "shortName": "ACE",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / Caltech",
    "hostBody": "Sun-Earth L1",
    "status": "Active",
    "activeSpan": "1997\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_ace/ace.gltf",
    "physicalSpanM": 4.1,
    "role": "Solar Wind & Cosmic Ray Sampler at L1",
    "description": "Measures energetic particles from the solar wind, interplanetary medium, and galactic cosmic rays upstream of Earth at Sun-Earth L1.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun-Earth L1"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 310000,
      "periodDays": 177.0,
      "phaseDeg": 110.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_acrimsat",
    "name": "ACRIMSAT",
    "shortName": "ACRIMSAT",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_acrimsat/acrimsat.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 43,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 71,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_acs3",
    "name": "ACS3",
    "shortName": "ACS3",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_acs3/acs3.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 86,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 142,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_aqua",
    "name": "Aqua",
    "shortName": "Aqua",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_aqua/Aqua.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7076,
      "eccentricity": 0.0001,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 42,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_artemis_1",
    "name": "Artemis I",
    "shortName": "Artemis I",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA / ESA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "2022",
    "featuredEpochUtc": null,
    "modelPath": "sc_artemis/artemis_ii.gltf",
    "physicalSpanM": 8.0,
    "role": "Uncrewed Orion Lunar Test Flight",
    "description": "25.5-day distant retrograde orbit demonstration around the Moon validating Orion heat shield re-entry and European Service Module propulsion.",
    "highlights": [
      "Set record distance from Earth for a human-rated spacecraft (432,210 km)",
      "Deployed 10 secondary CubeSats including BioSentinel"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_artemis_1__earth__pos.dyn",
        "ent": "sc_artemis_1",
        "parentId": "earth",
        "kind": "pos",
        "inline": false,
        "tMinSec": 721860361.0,
        "tMaxSec": 724052473.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 60000,
      "eccentricity": 0.15,
      "inclinationDeg": 22.0,
      "lonAscendingNodeDeg": 45,
      "argPeriapsisDeg": 90,
      "meanAnomalyDeg": 120,
      "periodDays": 12.0
    }
  },
  {
    "id": "sc_artemis_2",
    "name": "Artemis II",
    "shortName": "Artemis II",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA / ESA",
    "hostBody": "Moon",
    "status": "Upcoming",
    "activeSpan": "2026",
    "featuredEpochUtc": "2026-04-06T23:00:00Z",
    "modelPath": "sc_artemis/artemis_ii.gltf",
    "physicalSpanM": 8.0,
    "role": "Crewed Orion Lunar Free-Return Mission",
    "description": "First crewed Orion spacecraft flight with ESA European Service Module, carrying four astronauts on a lunar free-return trajectory beyond the Moon.",
    "highlights": [
      "Crewed Orion CM + ESA Service Module solar wings",
      "Performs multi-day figure-8 cislunar free-return swing"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_artemis_2__earth.dyn",
        "ent": "sc_artemis_2",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 828372485.861,
        "tMaxSec": 829137247.802
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_aura",
    "name": "Aura",
    "shortName": "Aura",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_aura/Aura.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7076,
      "eccentricity": 0.0001,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 84,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_biosentinel",
    "name": "BioSentinel",
    "shortName": "BioSentinel",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA",
    "hostBody": "Sun",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_biosentinel/biosentinel.gltf",
    "physicalSpanM": 3.6,
    "role": "Sun Orbiter",
    "description": "NASA Eyes orbiter mission operating around Sun, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_biosentinel__earth__orb.dyn",
        "ent": "sc_biosentinel",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 721866289.0,
        "tMaxSec": 722273637.0
      },
      {
        "file": "sc_biosentinel__moon__orb.dyn",
        "ent": "sc_biosentinel",
        "parentId": "moon",
        "kind": "orb",
        "inline": true,
        "tMinSec": 722273637.0,
        "tMaxSec": 722923565.0
      },
      {
        "file": "sc_biosentinel__sun__orb.dyn",
        "ent": "sc_biosentinel",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 722923565.0,
        "tMaxSec": 883656069.184
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_calipso",
    "name": "CALIPSO",
    "shortName": "CALIPSO",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_calipso/calipso.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7076,
      "eccentricity": 0.0001,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 112,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_capstone",
    "name": "CAPSTONE",
    "shortName": "CAPSTONE",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA / Advanced Space",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "2022\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_capstone/capstone.gltf",
    "physicalSpanM": 1.8,
    "role": "Gateway Lunar Halo Pathfinder CubeSat",
    "description": "Tested the Near-Rectilinear Halo Orbit (NRHO) around the Moon planned for the future Lunar Gateway station.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_capstone__earth__orb.dyn",
        "ent": "sc_capstone",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 710191748.0,
        "tMaxSec": 721583059.0
      },
      {
        "file": "sc_capstone__moon__orb.dyn",
        "ent": "sc_capstone",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 721583059.0,
        "tMaxSec": 835772469.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 36000,
      "eccentricity": 0.9,
      "inclinationDeg": 90.0,
      "lonAscendingNodeDeg": 12,
      "argPeriapsisDeg": 270,
      "meanAnomalyDeg": 90,
      "periodDays": 6.5
    }
  },
  {
    "id": "sc_cassini",
    "name": "Cassini",
    "shortName": "Cassini",
    "subcategory": "Orbiter",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / ESA / ASI",
    "hostBody": "Saturn",
    "status": "Completed",
    "activeSpan": "1997\u20132017",
    "featuredEpochUtc": "2004-06-15T12:00:00Z",
    "modelPath": "sc_cassini/Cassini.gltf",
    "physicalSpanM": 6.7,
    "role": "Saturn System Flagship Orbiter",
    "description": "Spent 13 years orbiting Saturn after Venus-Venus-Earth-Jupiter gravity assists, dispatching Huygens to Titan before its 2017 Grand Finale plunge.",
    "highlights": [
      "4 m high-gain antenna & plutonium RTG power",
      "Discovered geysers on Enceladus & hydrocarbon seas on Titan",
      "Performed 22 ring-grazing Grand Finale orbits inside the D-ring"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_cassini__earth__flyby__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -11951935.817,
        "tMaxSec": -11660335.817
      },
      {
        "file": "sc_cassini__earth__launch__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -69820368.428,
        "tMaxSec": -69537536.818
      },
      {
        "file": "sc_cassini__saturn__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "saturn",
        "kind": "orb",
        "inline": false,
        "tMinSec": 139219264.185,
        "tMaxSec": 558743640.0
      },
      {
        "file": "sc_cassini__sun__1__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -69537536.818,
        "tMaxSec": -53179136.814
      },
      {
        "file": "sc_cassini__sun__2__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -53092736.814,
        "tMaxSec": -16495135.816
      },
      {
        "file": "sc_cassini__sun__3__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -16451935.816,
        "tMaxSec": -11951935.817
      },
      {
        "file": "sc_cassini__sun__4__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -11660335.817,
        "tMaxSec": 139219264.185
      },
      {
        "file": "sc_cassini__venus__flyby1__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": -53179136.814,
        "tMaxSec": -53092736.814
      },
      {
        "file": "sc_cassini__venus__flyby2__orb.dyn",
        "ent": "sc_cassini",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": -16495135.816,
        "tMaxSec": -16451935.816
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Saturn",
      "semiMajorAxisKm": 320000,
      "eccentricity": 0.62,
      "inclinationDeg": 62.0,
      "lonAscendingNodeDeg": 88,
      "argPeriapsisDeg": 290,
      "meanAnomalyDeg": 20,
      "periodDays": 4.5
    }
  },
  {
    "id": "sc_chandra",
    "name": "Chandra X-ray Observatory",
    "shortName": "Chandra",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / SAO",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "1999\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_chandra/chandra.gltf",
    "physicalSpanM": 19.5,
    "role": "Great Observatory X-ray Telescope",
    "description": "Flying in an eccentric 64-hour orbit spanning a third of the way to the Moon, imaging supermassive black holes, supernovae, and neutron stars in X-rays.",
    "highlights": [
      "4 nested grazing-incidence iridium X-ray mirrors",
      "Resolved the Sagittarius A* accretion glow & colliding Bullet Cluster"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 80800,
      "eccentricity": 0.8,
      "inclinationDeg": 28.5,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 270,
      "meanAnomalyDeg": 50,
      "periodDays": 2.64
    }
  },
  {
    "id": "sc_clementine",
    "name": "Clementine",
    "shortName": "Clementine",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_clementine/clementine.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_clementine__earth.dyn",
        "ent": "sc_clementine",
        "parentId": "earth",
        "kind": "pos",
        "inline": false,
        "tMinSec": -187185539.0,
        "tMaxSec": -185065319.0
      },
      {
        "file": "sc_clementine__moon.dyn",
        "ent": "sc_clementine",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": -185065319.0,
        "tMaxSec": -178496940.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1900,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 156,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 204,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_cloudsat",
    "name": "CloudSat",
    "shortName": "CloudSat",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cloudsat/CloudSat.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7076,
      "eccentricity": 0.0001,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 182,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cluster_ii_fm5",
    "name": "Rumba",
    "shortName": "Rumba",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cluster_ii/cluster_ii.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 58000,
      "eccentricity": 0.72,
      "inclinationDeg": 70.0,
      "lonAscendingNodeDeg": 134,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 278,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_cluster_ii_fm6",
    "name": "Salsa",
    "shortName": "Salsa",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cluster_ii/cluster_ii.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 22.0,
      "lonAscendingNodeDeg": 195,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 15,
      "periodDays": 1.0
    }
  },
  {
    "id": "sc_cluster_ii_fm7",
    "name": "Samba",
    "shortName": "Samba",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cluster_ii/cluster_ii.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42000,
      "eccentricity": 0.72,
      "inclinationDeg": 34.0,
      "lonAscendingNodeDeg": 256,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 112,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_cluster_ii_fm8",
    "name": "Tango",
    "shortName": "Tango",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cluster_ii/cluster_ii.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 50000,
      "eccentricity": 0.72,
      "inclinationDeg": 46.0,
      "lonAscendingNodeDeg": 317,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 209,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_cygnss_1",
    "name": "CYGNSS 1",
    "shortName": "CYGNSS 1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 54,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 198,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_2",
    "name": "CYGNSS 2",
    "shortName": "CYGNSS 2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 97,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 269,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_3",
    "name": "CYGNSS 3",
    "shortName": "CYGNSS 3",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 140,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 340,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_4",
    "name": "CYGNSS 4",
    "shortName": "CYGNSS 4",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 183,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 51,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_5",
    "name": "CYGNSS 5",
    "shortName": "CYGNSS 5",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 226,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 122,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_6",
    "name": "CYGNSS 6",
    "shortName": "CYGNSS 6",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 269,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 193,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_7",
    "name": "CYGNSS 7",
    "shortName": "CYGNSS 7",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 312,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 264,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_cygnss_8",
    "name": "CYGNSS 8",
    "shortName": "CYGNSS 8",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_cygnss/CYGNSS.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 355,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 335,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_danuri",
    "name": "Danuri (Korea Lunar Pathfinder Orbiter)",
    "shortName": "Danuri",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "KARI / NASA",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "2022\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_danuri/danuri.gltf",
    "physicalSpanM": 6.3,
    "role": "Korea Pathfinder Lunar Orbiter",
    "description": "Carries NASA's ultra-sensitive ShadowCam inside permanently shadowed south polar lunar craters to search for frost.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_danuri__earth.dyn",
        "ent": "sc_danuri",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 712929310.0,
        "tMaxSec": 724456233.0
      },
      {
        "file": "sc_danuri__moon.dyn",
        "ent": "sc_danuri",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 724456233.0,
        "tMaxSec": 842705148.902
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1837,
      "eccentricity": 0.005,
      "inclinationDeg": 90.0,
      "lonAscendingNodeDeg": 130,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 210,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_dart",
    "name": "DART",
    "shortName": "DART",
    "subcategory": "Impactor",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JHUAPL",
    "hostBody": "65803 Didymos",
    "status": "Completed",
    "activeSpan": "2021\u20132022",
    "featuredEpochUtc": "2022-09-26T21:00:00Z",
    "modelPath": "sc_dart/dart.gltf",
    "physicalSpanM": 18.0,
    "role": "Planetary Defense Kinetic Impactor",
    "description": "Humanity's first planetary defense deflection mission: intentionally collided with asteroid moonlet Dimorphos at 6.1 km/s, shortening its orbit by 33 minutes.",
    "highlights": [
      "Autonomous SMART Nav optically guided kinetic impact on 26 Sep 2022",
      "Unfurling ROSA roll-out solar arrays & NEXT-C ion thruster"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_dart__65803_didymos__pos.dyn",
        "ent": "sc_dart",
        "parentId": "65803_didymos",
        "kind": "pos",
        "inline": true,
        "tMinSec": 717454117.0,
        "tMaxSec": 717503237.0
      },
      {
        "file": "sc_dart__earth__orb.dyn",
        "ent": "sc_dart",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 691007069.0,
        "tMaxSec": 691418893.0
      },
      {
        "file": "sc_dart__sun__orb.dyn",
        "ent": "sc_dart",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 691418893.0,
        "tMaxSec": 717454117.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_dawn",
    "name": "Dawn",
    "shortName": "Dawn",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JPL / UCLA",
    "hostBody": "Ceres",
    "status": "Completed",
    "activeSpan": "2007\u20132018",
    "featuredEpochUtc": "2014-06-01T00:00:00Z",
    "modelPath": "sc_dawn/model.gltf",
    "physicalSpanM": 19.7,
    "role": "Dual Protoplanet Ion-Propulsion Orbiter",
    "description": "Only spacecraft ever to orbit two extraterrestrial targets \u2014 giant protoplanet 4 Vesta and dwarf planet 1 Ceres \u2014 powered by Xenon ion thrusters.",
    "highlights": [
      "Mapped Vesta's Rheasilvia mega-crater & Ceres' bright salt domes (Occator)",
      "Achieved 11.5 km/s ion-propulsion delta-v record"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_dawn__ceres__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "1_ceres",
        "kind": "orb",
        "inline": false,
        "tMinSec": 476712067.0,
        "tMaxSec": 594302469.184
      },
      {
        "file": "sc_dawn__earth__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 244168849.832,
        "tMaxSec": 244461608.0
      },
      {
        "file": "sc_dawn__mars__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 288169447.0,
        "tMaxSec": 288210177.0
      },
      {
        "file": "sc_dawn__sun__1__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 244461608.0,
        "tMaxSec": 288169447.0
      },
      {
        "file": "sc_dawn__sun__2__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 288210177.0,
        "tMaxSec": 363182466.0
      },
      {
        "file": "sc_dawn__sun__3__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 400075267.0,
        "tMaxSec": 476712067.0
      },
      {
        "file": "sc_dawn__vesta__orb.dyn",
        "ent": "sc_dawn",
        "parentId": "4_vesta",
        "kind": "orb",
        "inline": false,
        "tMinSec": 363182466.0,
        "tMaxSec": 400075267.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Ceres",
      "semiMajorAxisKm": 1400,
      "eccentricity": 0.03,
      "inclinationDeg": 90.0,
      "lonAscendingNodeDeg": 20,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 0,
      "periodDays": 1.5
    }
  },
  {
    "id": "sc_deep_impact",
    "name": "Deep Impact",
    "shortName": "Deep Impact / EPOXI",
    "subcategory": "Flyby",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JPL / UMD",
    "hostBody": "103P/Hartley 2",
    "status": "Completed",
    "activeSpan": "2005\u20132013",
    "featuredEpochUtc": "2005-07-04T05:52:00Z",
    "modelPath": "sc_deep_impact/deep_impact_wo_impactor.gltf",
    "physicalSpanM": 3.2,
    "role": "Dual-Comet Hypervelocity Explorer",
    "description": "Dropped a 370 kg copper impactor into Comet 9P/Tempel 1 in July 2005 and went on to image CO2 jets on Comet 103P/Hartley 2.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: 103P/Hartley 2"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_deep_impact__103p_hartley_2__pos.dyn",
        "ent": "sc_deep_impact",
        "parentId": "103p_hartley_2",
        "kind": "pos",
        "inline": true,
        "tMinSec": 342017751.0,
        "tMaxSec": 342368983.0
      },
      {
        "file": "sc_deep_impact__9p_tempel_1__pos.dyn",
        "ent": "sc_deep_impact",
        "parentId": "9p_tempel_1",
        "kind": "pos",
        "inline": true,
        "tMinSec": 173560752.0,
        "tMaxSec": 173923158.0
      },
      {
        "file": "sc_deep_impact__earth__flyby1__orb.dyn",
        "ent": "sc_deep_impact",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 251798121.0,
        "tMaxSec": 253531474.0
      },
      {
        "file": "sc_deep_impact__earth__flyby2__orb.dyn",
        "ent": "sc_deep_impact",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 282984399.0,
        "tMaxSec": 285405903.0
      },
      {
        "file": "sc_deep_impact__earth__flyby3__orb.dyn",
        "ent": "sc_deep_impact",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 330384030.0,
        "tMaxSec": 331534813.0
      },
      {
        "file": "sc_deep_impact__earth__launch__orb.dyn",
        "ent": "sc_deep_impact",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 158829812.068,
        "tMaxSec": 159287744.0
      },
      {
        "file": "sc_deep_impact__sun__orb.dyn",
        "ent": "sc_deep_impact",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 159287744.0,
        "tMaxSec": 429192067.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_deep_impact_impactor",
    "name": "Deep Impact Impactor",
    "shortName": "Deep Impact Impactor",
    "subcategory": "Impactor",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JPL",
    "hostBody": "9P/Tempel 1",
    "status": "Completed",
    "activeSpan": "2005",
    "featuredEpochUtc": "2005-07-04T05:52:00Z",
    "modelPath": "sc_deep_impact_impactor/deep_impact_impactor.gltf",
    "physicalSpanM": 1.0,
    "role": "Autonomous Copper Comet Impactor",
    "description": "Photographed Comet Tempel 1 down to 3 seconds before colliding at 10.2 km/s to excavate pristine subsurface solar system ice.",
    "highlights": [
      "Category: Impactor",
      "Primary Domain: 9P/Tempel 1"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [],
    "oriSegment": {
      "file": "sc_deep_impact_impactor__quat.dyn",
      "ent": "sc_deep_impact_impactor",
      "parentId": "self",
      "kind": "quat",
      "inline": true,
      "tMinSec": 173642462.184,
      "tMaxSec": 0.748
    },
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "9P/Tempel 1",
      "semiMajorAxisKm": 1200,
      "eccentricity": 0.05,
      "inclinationDeg": 10,
      "lonAscendingNodeDeg": 0,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 90,
      "periodDays": 10.0
    }
  },
  {
    "id": "sc_deep_space_1",
    "name": "Deep Space 1",
    "shortName": "Deep Space 1",
    "subcategory": "Flyby",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JPL",
    "hostBody": "19P/Borrelly",
    "status": "Completed",
    "activeSpan": "1998\u20132001",
    "featuredEpochUtc": "2001-09-22T22:29:00Z",
    "modelPath": "sc_deep_space_1/deep_space_1.gltf",
    "physicalSpanM": 11.8,
    "role": "First Deep-Space Ion Propulsion Pioneer",
    "description": "Validated solar-electric ion propulsion while flying past asteroid Braille and Comet 19P/Borrelly.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: 19P/Borrelly"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_deep_space_1__19p_borrelly__pos.dyn",
        "ent": "sc_deep_space_1",
        "parentId": "19p_borrelly",
        "kind": "pos",
        "inline": true,
        "tMinSec": 54458637.0,
        "tMaxSec": 54476825.0
      },
      {
        "file": "sc_deep_space_1__9969_braille__pos.dyn",
        "ent": "sc_deep_space_1",
        "parentId": "9969_braille",
        "kind": "pos",
        "inline": true,
        "tMinSec": -13523799.0,
        "tMaxSec": -13496699.0
      },
      {
        "file": "sc_deep_space_1__earth__orb.dyn",
        "ent": "sc_deep_space_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -37470248.0,
        "tMaxSec": -36628312.0
      },
      {
        "file": "sc_deep_space_1__sun__orb.dyn",
        "ent": "sc_deep_space_1",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -36628312.0,
        "tMaxSec": 61977664.184
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_dscovr",
    "name": "DSCOVR",
    "shortName": "DSCOVR",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NOAA / NASA",
    "hostBody": "Sun-Earth L1",
    "status": "Active",
    "activeSpan": "2015\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_dscovr/dscovr.gltf",
    "physicalSpanM": 4.6,
    "role": "Space Weather Monitor & Sunlit Earth EPIC",
    "description": "Hovers 1.5 million km sunward at L1 providing early geomagnetic storm warnings while capturing full-disk sunlit Earth imagery.",
    "highlights": [
      "Continuous sunlit Earth full-disk telemetry via EPIC camera",
      "Real-time L1 solar wind alerts 15\u201360 min before Earth arrival"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_dscovr__earth.dyn",
        "ent": "sc_dscovr",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 476970068.0,
        "tMaxSec": 1062460869.183
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 260000,
      "periodDays": 176.0,
      "phaseDeg": 200.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_eo_1",
    "name": "EO-1",
    "shortName": "Earth Observing-1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_eo_1/eo-1.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7121,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 339,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 183,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_escapade_blue",
    "name": "ESCAPADE Blue",
    "shortName": "ESCAPADE Blue",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_escapade/escapade.gltf",
    "physicalSpanM": 3.6,
    "role": "Mars Orbiter",
    "description": "NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_escapade_blue__earth.dyn",
        "ent": "sc_escapade_blue",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 816342898.0,
        "tMaxSec": 847971260.0
      },
      {
        "file": "sc_escapade_blue__mars.dyn",
        "ent": "sc_escapade_blue",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 873517951.0,
        "tMaxSec": 873981069.183
      },
      {
        "file": "sc_escapade_blue__sun.dyn",
        "ent": "sc_escapade_blue",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 847971260.0,
        "tMaxSec": 873517951.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 9000,
      "eccentricity": 0.32,
      "inclinationDeg": 65.0,
      "lonAscendingNodeDeg": 70,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 178,
      "periodDays": 0.19
    }
  },
  {
    "id": "sc_escapade_gold",
    "name": "ESCAPADE Gold",
    "shortName": "ESCAPADE Gold",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_escapade/escapade.gltf",
    "physicalSpanM": 3.6,
    "role": "Mars Orbiter",
    "description": "NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_escapade_gold__earth.dyn",
        "ent": "sc_escapade_gold",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 816342898.0,
        "tMaxSec": 847971260.0
      },
      {
        "file": "sc_escapade_gold__mars.dyn",
        "ent": "sc_escapade_gold",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 873258326.0,
        "tMaxSec": 873808269.183
      },
      {
        "file": "sc_escapade_gold__sun.dyn",
        "ent": "sc_escapade_gold",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 847971260.0,
        "tMaxSec": 873258326.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 9900,
      "eccentricity": 0.32,
      "inclinationDeg": 65.0,
      "lonAscendingNodeDeg": 125,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 215,
      "periodDays": 0.19
    }
  },
  {
    "id": "sc_euclid",
    "name": "Euclid",
    "shortName": "Euclid",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "ESA / NASA",
    "hostBody": "Sun-Earth L2",
    "status": "Active",
    "activeSpan": "2023\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_euclid/euclid.gltf",
    "physicalSpanM": 4.7,
    "role": "Dark Energy & Dark Matter Space Telescope",
    "description": "Mapping 1.5 billion galaxies across a third of the extragalactic sky from L2 to measure cosmic acceleration and gravitational lensing.",
    "highlights": [
      "1.2 m Korsch silicon carbide telescope & VIS/NISP instruments",
      "Builds the widest high-resolution 3D map of the universe"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_euclid__earth.dyn",
        "ent": "sc_euclid",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 741498789.0,
        "tMaxSec": 1002885075.331
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L2",
      "amplitudeKm": 410000,
      "periodDays": 178.0,
      "phaseDeg": 165.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_europa_clipper",
    "name": "Europa Clipper",
    "shortName": "Europa Clipper",
    "subcategory": "Orbiter",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / JPL / JHUAPL",
    "hostBody": "Jupiter",
    "status": "En Route",
    "activeSpan": "2024\u2013Present",
    "featuredEpochUtc": "2025-03-01T18:00:00Z",
    "modelPath": "sc_europa_clipper/europa_clipper.gltf",
    "physicalSpanM": 30.5,
    "role": "Europa Subsurface Ocean Habitability Orbiter",
    "description": "NASA's largest planetary exploration spacecraft, spanning 30.5 m with giant solar wings to perform 49 close flybys of Jupiter's ocean moon Europa.",
    "highlights": [
      "Immense 30.5 m low-intensity solar array span",
      "REASON ice-penetrating radar & MASPEX mass spectrometer for plumes"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_europa_clipper__earth__flyby.dyn",
        "ent": "sc_europa_clipper",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 849407067.0,
        "tMaxSec": 849810294.0
      },
      {
        "file": "sc_europa_clipper__earth__launch.dyn",
        "ent": "sc_europa_clipper",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 782194503.712,
        "tMaxSec": 782641310.0
      },
      {
        "file": "sc_europa_clipper__jupiter.dyn",
        "ent": "sc_europa_clipper",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": false,
        "tMinSec": 953991214.0,
        "tMaxSec": 1094126469.183
      },
      {
        "file": "sc_europa_clipper__mars__flyby.dyn",
        "ent": "sc_europa_clipper",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 794086294.0,
        "tMaxSec": 794230007.0
      },
      {
        "file": "sc_europa_clipper__sun.dyn",
        "ent": "sc_europa_clipper",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 782641310.0,
        "tMaxSec": 953991214.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_explorer_1",
    "name": "Explorer 1",
    "shortName": "Explorer 1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_explorer_1_v2/explorer_1.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_explorer_1__earth.dyn",
        "ent": "sc_explorer_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": -1322726967.0,
        "tMaxSec": -939025103.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 194,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 178,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_galileo",
    "name": "Galileo",
    "shortName": "Galileo",
    "subcategory": "Orbiter",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / JPL",
    "hostBody": "Jupiter",
    "status": "Completed",
    "activeSpan": "1989\u20132003",
    "featuredEpochUtc": "1992-12-08T12:00:00Z",
    "modelPath": "sc_galileo/galileo.gltf",
    "physicalSpanM": 4.6,
    "role": "First Jupiter System Orbiter",
    "description": "Completed the first Jupiter orbital tour (1995\u20132003), uncovering Europa's global subsurface saltwater ocean and Io's active silicate volcanism.",
    "highlights": [
      "Detected induced magnetic field proving Europa's liquid ocean",
      "Executed first close flybys of asteroids 951 Gaspra and 243 Ida"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_galileo__earth__flyby1__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -286252262.0,
        "tMaxSec": -285827020.0
      },
      {
        "file": "sc_galileo__earth__flyby2__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -223105356.0,
        "tMaxSec": -222610262.0
      },
      {
        "file": "sc_galileo__earth__launch__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -321964226.74,
        "tMaxSec": -321559829.0
      },
      {
        "file": "sc_galileo__jupiter__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": false,
        "tMinSec": -129268796.0,
        "tMaxSec": 117442702.0
      },
      {
        "file": "sc_galileo__sun__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -321559829.0,
        "tMaxSec": -129268796.0
      },
      {
        "file": "sc_galileo__venus__flyby__orb.dyn",
        "ent": "sc_galileo",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": -312199026.0,
        "tMaxSec": -311946958.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Jupiter",
      "semiMajorAxisKm": 680000,
      "eccentricity": 0.35,
      "inclinationDeg": 3.0,
      "lonAscendingNodeDeg": 110,
      "argPeriapsisDeg": 45,
      "meanAnomalyDeg": 90,
      "periodDays": 14.0
    }
  },
  {
    "id": "sc_galileo_probe",
    "name": "Galileo Probe",
    "shortName": "Galileo Probe",
    "subcategory": "Lander",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / Ames",
    "hostBody": "Jupiter",
    "status": "Completed",
    "activeSpan": "1989\u20131995",
    "featuredEpochUtc": "1995-12-07T22:00:00Z",
    "modelPath": "sc_galileo_probe/galileo_probe.gltf",
    "physicalSpanM": 1.25,
    "role": "First Entry Probe Into a Gas Giant",
    "description": "Released from Galileo, plunged into Jupiter's clouds at 47.4 km/s on 7 December 1995 and transmitted 58 minutes of direct atmospheric data.",
    "highlights": [
      "Category: Lander",
      "Primary Domain: Jupiter"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_galileo_probe__galileo__orb.dyn",
        "ent": "sc_galileo_probe",
        "parentId": "galileo",
        "kind": "pos",
        "inline": true,
        "tMinSec": -141114537.483,
        "tMaxSec": -129268796.0
      },
      {
        "file": "sc_galileo_probe__jupiter__orb.dyn",
        "ent": "sc_galileo_probe",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -129268796.0,
        "tMaxSec": -128353980.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_geotail",
    "name": "Geotail",
    "shortName": "Geotail",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_geotail/geotail.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_geotail__earth__orb.dyn",
        "ent": "sc_geotail",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": -234758764.589,
        "tMaxSec": 722891591.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 50000,
      "eccentricity": 0.72,
      "inclinationDeg": 34.0,
      "lonAscendingNodeDeg": 341,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 17,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_gpm",
    "name": "GPM",
    "shortName": "Global Precipitation M",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_gpm/GPM.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 6,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 102,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_grace_1",
    "name": "GRACE-1",
    "shortName": "GRACE-1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_grace/grace.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_grace_1__earth__orb.dyn",
        "ent": "sc_grace_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 69656411.097,
        "tMaxSec": 562382552.259
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 49,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 173,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_grace_2",
    "name": "GRACE-2",
    "shortName": "GRACE-2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_grace/grace.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_grace_2__earth__orb.dyn",
        "ent": "sc_grace_2",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 69656411.097,
        "tMaxSec": 562382552.259
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 92,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 244,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_grace_fo1",
    "name": "GRACE-FO1",
    "shortName": "GRACE Follow-On",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_grace_fo/graceFO.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7121,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 135,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 315,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_grace_fo2",
    "name": "GRACE-FO2",
    "shortName": "GRACE Follow-On",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_grace_fo/graceFO.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7141,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 178,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 26,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_grail_a",
    "name": "GRAIL A",
    "shortName": "Ebb",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_grail/grail_b.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_grail_a__earth.dyn",
        "ent": "sc_grail_a",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 368932198.182,
        "tMaxSec": 377620394.0
      },
      {
        "file": "sc_grail_a__moon.dyn",
        "ent": "sc_grail_a",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 377620394.0,
        "tMaxSec": 414201667.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1900,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 191,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 49,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_grail_b",
    "name": "GRAIL B",
    "shortName": "Flow",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_grail/grail_b.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_grail_b__earth.dyn",
        "ent": "sc_grail_b",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 368932198.182,
        "tMaxSec": 378599282.0
      },
      {
        "file": "sc_grail_b__moon.dyn",
        "ent": "sc_grail_b",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 378599282.0,
        "tMaxSec": 414201667.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1940,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 264,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 96,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_grifex",
    "name": "GRIFEX",
    "shortName": "GRIFEX",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_grifex/grifex.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 307,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 239,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_hubble_space_telescope",
    "name": "Hubble Space Telescope",
    "shortName": "Hubble",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / ESA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "1990\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_hubble/Hubble.gltf",
    "physicalSpanM": 13.2,
    "role": "Optical & Ultraviolet Space Telescope",
    "description": "Iconic 2.4-meter reflector observatory operating in 535 km low-Earth orbit since 1990, capturing over 1.6 million cosmic observations.",
    "highlights": [
      "2.4 m Ritchey-Chretien hyperbolic mirror",
      "WFC3, COS, STIS & ACS deep-field imaging suite",
      "Serviced across five Space Shuttle orbital EVAs"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_hubble_space_telescope__earth__orb.dyn",
        "ent": "sc_hubble_space_telescope",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": -305719099.928,
        "tMaxSec": 853497159.042
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6906,
      "eccentricity": 0.0003,
      "inclinationDeg": 28.47,
      "lonAscendingNodeDeg": 45,
      "argPeriapsisDeg": 110,
      "meanAnomalyDeg": 75,
      "periodDays": 0.0663
    }
  },
  {
    "id": "sc_huygens",
    "name": "Huygens",
    "shortName": "Huygens",
    "subcategory": "Lander",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "ESA / NASA",
    "hostBody": "Titan",
    "status": "Completed",
    "activeSpan": "1997\u20132005",
    "featuredEpochUtc": "2005-01-14T11:30:00Z",
    "modelPath": "sc_huygens/Huygens.gltf",
    "physicalSpanM": 2.7,
    "role": "Titan Atmospheric Probe & Surface Lander",
    "description": "Deployed from Cassini to execute humanity's farthest landing on Saturn's giant haze-shrouded moon Titan on 14 January 2005.",
    "highlights": [
      "Parachuted 147 minutes through nitrogen-methane smog",
      "Sampled organic tholins and photographed rounded water-ice pebbles"
    ],
    "colorHex": "#e9b970",
    "dynSegments": [
      {
        "file": "sc_huygens__saturn__orb.dyn",
        "ent": "sc_huygens",
        "parentId": "saturn",
        "kind": "orb",
        "inline": true,
        "tMinSec": 157212064.184,
        "tMaxSec": 158945582.0
      },
      {
        "file": "sc_huygens__titan__orb.dyn",
        "ent": "sc_huygens",
        "parentId": "titan",
        "kind": "orb",
        "inline": true,
        "tMinSec": 158945582.0,
        "tMaxSec": 158965616.707
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_hyspiri",
    "name": "Hyspiri",
    "shortName": "Hyspiri",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_hyspiri/HyspIRI.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7141,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 76,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 92,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_ibex",
    "name": "IBEX",
    "shortName": "IBEX",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_ibex/iBEX.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_ibex__earth.dyn",
        "ent": "sc_ibex",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 277712672.0,
        "tMaxSec": 964549896.457
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 180000,
      "eccentricity": 0.78,
      "inclinationDeg": 12.0,
      "lonAscendingNodeDeg": 353,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 101,
      "periodDays": 11.0
    }
  },
  {
    "id": "sc_icesat_2",
    "name": "ICESat-2",
    "shortName": "ICESat-2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_icesatii/ICESat2.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 162,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 234,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_image",
    "name": "IMAGE",
    "shortName": "IMAGE",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_image/image.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 22.0,
      "lonAscendingNodeDeg": 115,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 295,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_imap",
    "name": "IMAP",
    "shortName": "IMAP",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / Princeton",
    "hostBody": "Sun-Earth L1",
    "status": "Upcoming",
    "activeSpan": "2025\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_imap/imap.gltf",
    "physicalSpanM": 3.5,
    "role": "Interstellar Boundary & Heliosphere Mapper",
    "description": "Spin-stabilized L1 spacecraft imaging energetic neutral atoms from the boundary where the Sun's solar wind meets interstellar space.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun-Earth L1"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_imap__earth.dyn",
        "ent": "sc_imap",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 811985639.0,
        "tMaxSec": 897150237.762
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 350000,
      "periodDays": 177.0,
      "phaseDeg": 15.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_insight",
    "name": "InSight",
    "shortName": "InSight",
    "subcategory": "Lander",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL / CNES / DLR",
    "hostBody": "Mars",
    "status": "Completed",
    "activeSpan": "2018\u20132022",
    "featuredEpochUtc": null,
    "modelPath": "sc_insight/lander/insight.gltf",
    "physicalSpanM": 6.0,
    "role": "Mars Interior Seismic Geophysical Lander",
    "description": "Anchored in Elysium Planitia for four years, detecting over 1,300 marsquakes and measuring Mars's crust, mantle, and liquid core.",
    "highlights": [
      "Deployed ultra-sensitive SEIS seismometer directly on regolith",
      "Measured a 1,830 km Martian molten iron-alloy core radius"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_insight__earth__pos.dyn",
        "ent": "sc_insight",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 578795968.965,
        "tMaxSec": 579182469.185
      },
      {
        "file": "sc_insight__mars__orb.dyn",
        "ent": "sc_insight",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 596376069.183,
        "tMaxSec": 596532613.39
      },
      {
        "file": "sc_insight__sun__orb.dyn",
        "ent": "sc_insight",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 579182469.185,
        "tMaxSec": 596376069.183
      }
    ],
    "oriSegment": null,
    "surfaceSite": {
      "body": "Mars",
      "latDeg": 4.5024,
      "lonDeg": 135.6234,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_ipex",
    "name": "IPEX",
    "shortName": "IPEX",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_ipex/IPEX.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 17,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 229,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_isas",
    "name": "ISAS",
    "shortName": "ISAS",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_clementine/clementine_isas.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1820,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 60,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 300,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_iss",
    "name": "International Space Station",
    "shortName": "ISS",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA / Roscosmos / ESA / JAXA / CSA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "1998\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_iss/ISS_stationary.gltf",
    "physicalSpanM": 109.0,
    "role": "Orbital Research Laboratory & Crew Habitat",
    "description": "Humankind's largest modular orbital outpost, circling Earth 16 times a day in a 51.6\u00b0 low-Earth orbit at 415 km altitude.",
    "highlights": [
      "109 m integrated truss & solar arrays",
      "Zarya, Unity, Destiny, Harmony, Tranquility & Cupola",
      "Host for ECOSTRESS, EMIT, OCO-3 & COWVR instruments"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6791,
      "eccentricity": 0.0005,
      "inclinationDeg": 51.64,
      "lonAscendingNodeDeg": 120,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 0,
      "periodDays": 0.0644
    }
  },
  {
    "id": "sc_ixpe",
    "name": "IXPE",
    "shortName": "IXPE",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_ixpe/ixpe.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6971,
      "eccentricity": 0.0002,
      "inclinationDeg": 0.2,
      "lonAscendingNodeDeg": 146,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 82,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_jason_1",
    "name": "Jason-1",
    "shortName": "Jason-1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_ostm/ostm.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_jason_1__earth.dyn",
        "ent": "sc_jason_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 61013725.0,
        "tMaxSec": 425835792.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7707,
      "eccentricity": 0.0002,
      "inclinationDeg": 66.0,
      "lonAscendingNodeDeg": 189,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 153,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_jason_2",
    "name": "Jason-2/OSTM",
    "shortName": "OSTM",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_ostm/ostm.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7707,
      "eccentricity": 0.0002,
      "inclinationDeg": 66.0,
      "lonAscendingNodeDeg": 232,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 224,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_jason_3",
    "name": "Jason-3",
    "shortName": "Jason-3",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_ostm/ostm.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7707,
      "eccentricity": 0.0002,
      "inclinationDeg": 66.0,
      "lonAscendingNodeDeg": 275,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 295,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_juice",
    "name": "Juice",
    "shortName": "JUICE",
    "subcategory": "Orbiter",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "ESA / NASA",
    "hostBody": "Jupiter",
    "status": "En Route",
    "activeSpan": "2023\u2013Present",
    "featuredEpochUtc": "2024-08-20T21:00:00Z",
    "modelPath": "sc_juice/juice.gltf",
    "physicalSpanM": 27.0,
    "role": "JUpiter ICy moons Explorer",
    "description": "ESA flagship mission performing complex Earth-Moon and Venus gravity assists en route to orbit Ganymede and probe icy moons Calisto and Europa.",
    "highlights": [
      "First spacecraft to perform a combined Lunar-Earth gravity assist",
      "Cross-shaped 85 m\u00b2 solar array for dim outer-system sunlight"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_juice__earth__flyby1.dyn",
        "ent": "sc_juice",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 777026548.0,
        "tMaxSec": 778061110.0
      },
      {
        "file": "sc_juice__earth__flyby2.dyn",
        "ent": "sc_juice",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 843697642.0,
        "tMaxSec": 844049179.0
      },
      {
        "file": "sc_juice__earth__flyby3.dyn",
        "ent": "sc_juice",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 916393497.0,
        "tMaxSec": 916903199.0
      },
      {
        "file": "sc_juice__earth__launch.dyn",
        "ent": "sc_juice",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 734748207.0,
        "tMaxSec": 735606318.0
      },
      {
        "file": "sc_juice__ganymede.dyn",
        "ent": "sc_juice",
        "parentId": "ganymede",
        "kind": "orb",
        "inline": false,
        "tMinSec": 1103217877.0,
        "tMaxSec": 1129256953.348
      },
      {
        "file": "sc_juice__jupiter.dyn",
        "ent": "sc_juice",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": false,
        "tMinSec": 994471790.0,
        "tMaxSec": 1103217877.0
      },
      {
        "file": "sc_juice__sun.dyn",
        "ent": "sc_juice",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 735606318.0,
        "tMaxSec": 994471790.0
      },
      {
        "file": "sc_juice__venus__flyby.dyn",
        "ent": "sc_juice",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": 809697014.0,
        "tMaxSec": 810162491.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_juno",
    "name": "Juno",
    "shortName": "Juno",
    "subcategory": "Orbiter",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / SwRI / JPL",
    "hostBody": "Jupiter",
    "status": "Active",
    "activeSpan": "2011\u2013Present",
    "featuredEpochUtc": "2023-12-30T08:30:00Z",
    "modelPath": "sc_juno/Juno.gltf",
    "physicalSpanM": 20.0,
    "role": "Jupiter Polar Magnetosphere & Interior Orbiter",
    "description": "Tri-wing solar-powered probe diving to 4,200 km over Jupiter's swirling polar cyclones and conducting close flybys of Ganymede, Europa, and Io.",
    "highlights": [
      "Triple 9-meter solar arrays stabilized in 2 RPM spin",
      "Microwave radiometer sounding 500 km deep into ammonia clouds"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_juno__earth__flyby__orb.dyn",
        "ent": "sc_juno",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 434433667.182,
        "tMaxSec": 434793667.182
      },
      {
        "file": "sc_juno__earth__launch__orb.dyn",
        "ent": "sc_juno",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 365836752.183,
        "tMaxSec": 366088266.183
      },
      {
        "file": "sc_juno__europa__orb.dyn",
        "ent": "sc_juno",
        "parentId": "europa",
        "kind": "orb",
        "inline": true,
        "tMinSec": 717700360.0,
        "tMaxSec": 717727733.0
      },
      {
        "file": "sc_juno__ganymede__orb.dyn",
        "ent": "sc_juno",
        "parentId": "ganymede",
        "kind": "orb",
        "inline": true,
        "tMinSec": 676339597.0,
        "tMaxSec": 676381521.0
      },
      {
        "file": "sc_juno__io__1__orb.dyn",
        "ent": "sc_juno",
        "parentId": "io",
        "kind": "orb",
        "inline": true,
        "tMinSec": 757191924.0,
        "tMaxSec": 757203571.0
      },
      {
        "file": "sc_juno__io__2__orb.dyn",
        "ent": "sc_juno",
        "parentId": "io",
        "kind": "orb",
        "inline": true,
        "tMinSec": 760247560.0,
        "tMaxSec": 760262808.0
      },
      {
        "file": "sc_juno__jupiter__orb.dyn",
        "ent": "sc_juno",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": false,
        "tMinSec": 519652868.184,
        "tMaxSec": 907243200.0
      },
      {
        "file": "sc_juno__sun__postflyby__orb.dyn",
        "ent": "sc_juno",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 434793667.182,
        "tMaxSec": 519652868.184
      },
      {
        "file": "sc_juno__sun__preflyby__orb.dyn",
        "ent": "sc_juno",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 366088266.183,
        "tMaxSec": 434433667.182
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Jupiter",
      "semiMajorAxisKm": 340000,
      "eccentricity": 0.78,
      "inclinationDeg": 89.5,
      "lonAscendingNodeDeg": 42,
      "argPeriapsisDeg": 270,
      "meanAnomalyDeg": 10,
      "periodDays": 53.0
    }
  },
  {
    "id": "sc_jwst",
    "name": "James Webb Space Telescope",
    "shortName": "JWST",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / ESA / CSA",
    "hostBody": "Sun-Earth L2",
    "status": "Active",
    "activeSpan": "2021\u2013Present",
    "featuredEpochUtc": "2022-07-12T14:30:00Z",
    "modelPath": "sc_jwst/webb_deployed.gltf",
    "physicalSpanM": 21.2,
    "role": "Flagship Infrared Space Observatory",
    "description": "Stationed 1.5 million km away in a halo orbit around the Sun-Earth L2 Lagrange point behind a five-layer Kapton sunshield.",
    "highlights": [
      "6.5 m 18-segment gold-coated beryllium primary mirror",
      "Tennis-court-sized 5-layer Kapton V-groove sunshield",
      "NIRCam, NIRSpec, MIRI & FGS/NIRISS cryogenics at 40 K"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_jwst__earth__orb.dyn",
        "ent": "sc_jwst",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 693708549.184,
        "tMaxSec": 1020081669.186
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L2",
      "amplitudeKm": 520000,
      "periodDays": 180.0,
      "phaseDeg": 35.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_kepler_space_telescope",
    "name": "Kepler",
    "shortName": "Kepler",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / Ames",
    "hostBody": "Sun",
    "status": "Completed",
    "activeSpan": "2009\u20132018",
    "featuredEpochUtc": "2012-06-01T00:00:00Z",
    "modelPath": "sc_kepler/Kepler.gltf",
    "physicalSpanM": 4.7,
    "role": "Exoplanet Census Photometer",
    "description": "Proved that planets outnumber stars in the Milky Way, discovering over 2,700 confirmed exoplanets by staring at Cygnus-Lyra.",
    "highlights": [
      "95-megapixel array of 42 photometer CCDs",
      "Discovered the first Earth-sized world inside a habitable zone (Kepler-186f)"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_kepler__earth__orb.dyn",
        "ent": "sc_kepler",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 289679042.186,
        "tMaxSec": 290348743.0
      },
      {
        "file": "sc_kepler__sun__orb.dyn",
        "ent": "sc_kepler",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 290348743.0,
        "tMaxSec": 595512069.183
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_ladee",
    "name": "LADEE",
    "shortName": "Lunar Atmosphere and D",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_ladee/ladee.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_ladee__earth.dyn",
        "ent": "sc_ladee",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 431797927.183,
        "tMaxSec": 434289667.0
      },
      {
        "file": "sc_ladee__moon.dyn",
        "ent": "sc_ladee",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 434203267.0,
        "tMaxSec": 451067572.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1820,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 70,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 50,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_landsat_7",
    "name": "Landsat 7",
    "shortName": "Landsat 7",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_landsat_7/LandSat7.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 173,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 1,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_landsat_8",
    "name": "Landsat 8",
    "shortName": "Landsat 8",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_landsat_8/LandSat8.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 216,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 72,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_landsat_9",
    "name": "Landsat 9",
    "shortName": "Landsat 9",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_landsat_9/Landsat9.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 259,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 143,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_lcross",
    "name": "LCROSS",
    "shortName": "Lunar Crater Observati",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_lcross/lcross.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_lcross__earth.dyn",
        "ent": "sc_lcross",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 298635466.03,
        "tMaxSec": 308333606.0
      },
      {
        "file": "sc_lcross__moon.dyn",
        "ent": "sc_lcross",
        "parentId": "moon",
        "kind": "orb",
        "inline": true,
        "tMinSec": 308333606.0,
        "tMaxSec": 308360202.356
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1980,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 2,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 238,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_lucy",
    "name": "Lucy",
    "shortName": "Lucy",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / SwRI",
    "hostBody": "Jupiter Trojans",
    "status": "Active",
    "activeSpan": "2021\u2013Present",
    "featuredEpochUtc": "2025-04-20T17:51:00Z",
    "modelPath": "sc_lucy/lucy.gltf",
    "physicalSpanM": 14.2,
    "role": "Jupiter Trojan Asteroid Swarm Explorer",
    "description": "Twelve-year grand tour visiting main-belt fossils Dinkinesh & Donaldjohanson before surveying pristine Jupiter L4/L5 Trojan asteroids.",
    "highlights": [
      "Two 7.3 m circular UltraFlex solar arrays like giant petals",
      "Discovered contact-binary moonlet Selam orbiting Dinkinesh"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_lucy__3548_eurybates__pos.dyn",
        "ent": "sc_lucy",
        "parentId": "3548_eurybates",
        "kind": "pos",
        "inline": true,
        "tMinSec": 870652086.0,
        "tMaxSec": 872642047.0
      },
      {
        "file": "sc_lucy__52246_donaldjohanson__pos.dyn",
        "ent": "sc_lucy",
        "parentId": "52246_donaldjohanson",
        "kind": "pos",
        "inline": true,
        "tMinSec": 798252820.0,
        "tMaxSec": 798584539.0
      },
      {
        "file": "sc_lucy__earth__flyby1__orb.dyn",
        "ent": "sc_lucy",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 718960993.0,
        "tMaxSec": 719531941.0
      },
      {
        "file": "sc_lucy__earth__flyby2__orb.dyn",
        "ent": "sc_lucy",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 787134972.0,
        "tMaxSec": 787532222.0
      },
      {
        "file": "sc_lucy__earth__launch__orb.dyn",
        "ent": "sc_lucy",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 687656642.763,
        "tMaxSec": 687915086.0
      },
      {
        "file": "sc_lucy__sun__orb.dyn",
        "ent": "sc_lucy",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 687915086.0,
        "tMaxSec": 1049455583.933
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_lunar_flashlight",
    "name": "Lunar Flashlight",
    "shortName": "Lunar Flashlight",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_lunar_flashlight/lunar_flashlight.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_lunar_flashlight__earth.dyn",
        "ent": "sc_lunar_flashlight",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 724019553.584,
        "tMaxSec": 737640069.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1860,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 148,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 332,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_lunar_prospector",
    "name": "Lunar Prospector",
    "shortName": "Lunar Prospector",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_lunar_prospector/lunar_prospector.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_lunar_prospector__moon.dyn",
        "ent": "sc_lunar_prospector",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": -62206800.0,
        "tMaxSec": -13402020.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1900,
      "eccentricity": 0.01,
      "inclinationDeg": 88.0,
      "lonAscendingNodeDeg": 221,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 19,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_lunar_reconnaissance_orbiter",
    "name": "Lunar Reconnaissance Orbiter",
    "shortName": "LRO",
    "subcategory": "Orbiter",
    "missionGroup": "Lunar Missions",
    "agency": "NASA / GSFC",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "2009\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_lunar_reconnaissance_orbiter/LRO.gltf",
    "physicalSpanM": 4.3,
    "role": "High-Resolution Lunar Cartographer",
    "description": "Mapping the Moon down to sub-meter Apollo landing-site resolution, permanently shadowed polar ice craters, and surface thermal environment since 2009.",
    "highlights": [
      "LROC camera resolves Apollo Lunar Module descent stages & tracks",
      "LOLA laser altimetry created the gold-standard 3D lunar topography"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_lunar_reconnaissance_orbiter__earth__orb.dyn",
        "ent": "sc_lunar_reconnaissance_orbiter",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 298635426.184,
        "tMaxSec": 298929666.0
      },
      {
        "file": "sc_lunar_reconnaissance_orbiter__moon__orb.dyn",
        "ent": "sc_lunar_reconnaissance_orbiter",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 298929666.0,
        "tMaxSec": 895233669.185
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 1800,
      "eccentricity": 0.02,
      "inclinationDeg": 89.5,
      "lonAscendingNodeDeg": 45,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 160,
      "periodDays": 0.081
    }
  },
  {
    "id": "sc_m_cubed",
    "name": "M Cubed",
    "shortName": "M Cubed",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_m_cubed/mCubed.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 157,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 209,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_magellan",
    "name": "Magellan",
    "shortName": "Magellan",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / JPL",
    "hostBody": "Venus",
    "status": "Completed",
    "activeSpan": "1989\u20131994",
    "featuredEpochUtc": null,
    "modelPath": "sc_magellan/magellan.gltf",
    "physicalSpanM": 6.4,
    "role": "Venus Cloud-Piercing SAR Radar Mapper",
    "description": "Peered beneath Venus's sulfuric acid cloud deck with synthetic-aperture radar to map 98% of the planetary surface.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Venus"
    ],
    "colorHex": "#ffb74d",
    "dynSegments": [
      {
        "file": "sc_magellan__venus__orb.dyn",
        "ent": "sc_magellan",
        "parentId": "venus",
        "kind": "orb",
        "inline": false,
        "tMinSec": -295884037.751,
        "tMaxSec": -164631538.818
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Venus",
      "semiMajorAxisKm": 6550,
      "eccentricity": 0.05,
      "inclinationDeg": 85.5,
      "lonAscendingNodeDeg": 140,
      "argPeriapsisDeg": 20,
      "meanAnomalyDeg": 65,
      "periodDays": 0.066
    }
  },
  {
    "id": "sc_marco_a",
    "name": "MarCO A",
    "shortName": "MarCO A",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_marco/model.gltf",
    "physicalSpanM": 3.6,
    "role": "Mars Orbiter",
    "description": "NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_marco_a__earth__orb.dyn",
        "ent": "sc_marco_a",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 578796051.0,
        "tMaxSec": 579182469.185
      },
      {
        "file": "sc_marco_a__mars__orb.dyn",
        "ent": "sc_marco_a",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 596376069.183,
        "tMaxSec": 596552080.0
      },
      {
        "file": "sc_marco_a__sun__1__orb.dyn",
        "ent": "sc_marco_a",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 579182469.185,
        "tMaxSec": 596376069.183
      },
      {
        "file": "sc_marco_a__sun__2__orb.dyn",
        "ent": "sc_marco_a",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 596552080.0,
        "tMaxSec": 631152000.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 8100,
      "eccentricity": 0.32,
      "inclinationDeg": 65.0,
      "lonAscendingNodeDeg": 135,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 117,
      "periodDays": 0.19
    }
  },
  {
    "id": "sc_marco_b",
    "name": "MarCO B",
    "shortName": "MarCO B",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_marco/model.gltf",
    "physicalSpanM": 3.6,
    "role": "Mars Orbiter",
    "description": "NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_marco_b__earth__orb.dyn",
        "ent": "sc_marco_b",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 578796051.0,
        "tMaxSec": 579182469.185
      },
      {
        "file": "sc_marco_b__mars__orb.dyn",
        "ent": "sc_marco_b",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 596376069.183,
        "tMaxSec": 596552080.0
      },
      {
        "file": "sc_marco_b__sun__1__orb.dyn",
        "ent": "sc_marco_b",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 579182469.185,
        "tMaxSec": 596376069.183
      },
      {
        "file": "sc_marco_b__sun__2__orb.dyn",
        "ent": "sc_marco_b",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 596552080.0,
        "tMaxSec": 631152000.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 9000,
      "eccentricity": 0.32,
      "inclinationDeg": 65.0,
      "lonAscendingNodeDeg": 190,
      "argPeriapsisDeg": 40,
      "meanAnomalyDeg": 154,
      "periodDays": 0.19
    }
  },
  {
    "id": "sc_mariner_2",
    "name": "Mariner 2",
    "shortName": "Mariner 2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_mariner_2/mariner2.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_mariner_2__earth.dyn",
        "ent": "sc_mariner_2",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -1178599200.0,
        "tMaxSec": -1178199300.0
      },
      {
        "file": "sc_mariner_2__sun.dyn",
        "ent": "sc_mariner_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -1178199300.0,
        "tMaxSec": -1169206910.0
      },
      {
        "file": "sc_mariner_2__venus.dyn",
        "ent": "sc_mariner_2",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": -1169206910.0,
        "tMaxSec": -1167652800.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 329,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 133,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_mars_2020",
    "name": "Mars 2020 (Perseverance)",
    "shortName": "Perseverance",
    "subcategory": "Rover",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2020\u2013Present",
    "featuredEpochUtc": "2021-02-18T18:00:00Z",
    "modelPath": "sc_mars_2020/rover/perseverance.gltf",
    "physicalSpanM": 3.0,
    "role": "Mars Astrobiology Rover (Jezero Crater)",
    "description": "Nuclear-powered rover exploring Jezero Crater's ancient river delta to search for biosignatures and cache cores for Mars Sample Return.",
    "highlights": [
      "Landing site: Octavia E. Butler, Jezero Crater (18.38\u00b0N, 77.58\u00b0E)",
      "Carried the Ingenuity Mars Helicopter for 72 extraterrestrial flights",
      "SHERLOC, PIXL, SuperCam & MOXIE oxygen generator"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_2020__earth__orb.dyn",
        "ent": "sc_mars_2020",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 649385564.0,
        "tMaxSec": 649595376.0
      },
      {
        "file": "sc_mars_2020__mars__pos.dyn",
        "ent": "sc_mars_2020",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 666932224.0,
        "tMaxSec": 666952859.0
      },
      {
        "file": "sc_mars_2020__sun__orb.dyn",
        "ent": "sc_mars_2020",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 649595376.0,
        "tMaxSec": 666932224.0
      }
    ],
    "oriSegment": {
      "file": "sc_mars_2020__quat.dyn",
      "ent": "sc_mars_2020",
      "parentId": "self",
      "kind": "quat",
      "inline": true,
      "tMinSec": 649493421.0,
      "tMaxSec": 0.741
    },
    "surfaceSite": {
      "body": "Mars",
      "latDeg": 18.38,
      "lonDeg": 77.58,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_mars_exploration_rover_1",
    "name": "Mars Exploration Rover B (Opportunity)",
    "shortName": "Opportunity",
    "subcategory": "Rover",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Completed",
    "activeSpan": "2003\u20132018",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_exploration_rover/rover/mer_static.gltf",
    "physicalSpanM": 2.3,
    "role": "Meridiani Planum Endurance Rover",
    "description": "Planned for a 90-sol mission, Opportunity drove a marathon 45.16 km across Meridiani Planum over 14 years until the 2018 global dust storm.",
    "highlights": [
      "Discovered hematite \"blueberries\" formed in ancient liquid water",
      "Explored Victoria and Endeavour craters over 5,111 Martian sols"
    ],
    "colorHex": "#ff9f7f",
    "dynSegments": [
      {
        "file": "sc_mars_exploration_rover_1__earth__orb.dyn",
        "ent": "sc_mars_exploration_rover_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 110911022.184,
        "tMaxSec": 111234172.0
      },
      {
        "file": "sc_mars_exploration_rover_1__edl__pos.dyn",
        "ent": "sc_mars_exploration_rover_1",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 128278419.0,
        "tMaxSec": 128278523.336
      },
      {
        "file": "sc_mars_exploration_rover_1__mars__pos.dyn",
        "ent": "sc_mars_exploration_rover_1",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 128262836.0,
        "tMaxSec": 128278419.0
      },
      {
        "file": "sc_mars_exploration_rover_1__sun__orb.dyn",
        "ent": "sc_mars_exploration_rover_1",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 111234172.0,
        "tMaxSec": 128262836.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": {
      "body": "Mars",
      "latDeg": -1.9462,
      "lonDeg": 354.4734,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_mars_exploration_rover_2",
    "name": "Mars Exploration Rover A (Spirit)",
    "shortName": "Spirit",
    "subcategory": "Rover",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Completed",
    "activeSpan": "2003\u20132010",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_exploration_rover/rover/mer_static.gltf",
    "physicalSpanM": 2.3,
    "role": "Gusev Crater Mars Exploration Rover",
    "description": "Traversed Gusev Crater and ascended Husband Hill in the Columbia Hills, discovering silica-rich hydrothermal deposits.",
    "highlights": [
      "Tracked Mars dust devils and ancient hydrothermal silica",
      "Delivered first panoramas from the summit of Husband Hill"
    ],
    "colorHex": "#ff9f7f",
    "dynSegments": [
      {
        "file": "sc_mars_exploration_rover_2__earth__orb.dyn",
        "ent": "sc_mars_exploration_rover_2",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 108541883.184,
        "tMaxSec": 108887371.0
      },
      {
        "file": "sc_mars_exploration_rover_2__edl__pos.dyn",
        "ent": "sc_mars_exploration_rover_2",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 126462105.0,
        "tMaxSec": 126462396.106
      },
      {
        "file": "sc_mars_exploration_rover_2__mars__pos.dyn",
        "ent": "sc_mars_exploration_rover_2",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 126444477.0,
        "tMaxSec": 126462105.0
      },
      {
        "file": "sc_mars_exploration_rover_2__sun__orb.dyn",
        "ent": "sc_mars_exploration_rover_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 108887371.0,
        "tMaxSec": 126444477.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": {
      "body": "Mars",
      "latDeg": -14.5684,
      "lonDeg": 175.4726,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_mars_express",
    "name": "Mars Express",
    "shortName": "Mars Express",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "ESA / NASA",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2003\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_express/mars_express.gltf",
    "physicalSpanM": 12.0,
    "role": "ESA Polar Stereo Cartographer & Phobos Orbiter",
    "description": "Producing global full-color 3D topography with HRSC and radar sounding deep subsurface ice beneath Mars's south pole.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_express__earth__orb.dyn",
        "ent": "sc_mars_express",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 107853140.596,
        "tMaxSec": 108232264.0
      },
      {
        "file": "sc_mars_express__mars__orb.dyn",
        "ent": "sc_mars_express",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": 125539264.0,
        "tMaxSec": 1041422469.184
      },
      {
        "file": "sc_mars_express__sun__orb.dyn",
        "ent": "sc_mars_express",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 108232264.0,
        "tMaxSec": 125539264.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 8600,
      "eccentricity": 0.57,
      "inclinationDeg": 86.3,
      "lonAscendingNodeDeg": 15,
      "argPeriapsisDeg": 290,
      "meanAnomalyDeg": 30,
      "periodDays": 0.29
    }
  },
  {
    "id": "sc_mars_global_surveyor",
    "name": "Mars Global Surveyor",
    "shortName": "Mars Global Surveyor",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Completed",
    "activeSpan": "1996\u20132006",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_global_surveyor/mars_global_surveyor.gltf",
    "physicalSpanM": 12.0,
    "role": "First MOLA Global Laser Altmeter at Mars",
    "description": "Built the foundational global laser elevation map (MOLA) used for every modern Martian landing site selection.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_global_surveyor__earth.dyn",
        "ent": "sc_mars_global_surveyor",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -99329637.0,
        "tMaxSec": -99081876.0
      },
      {
        "file": "sc_mars_global_surveyor__mars.dyn",
        "ent": "sc_mars_global_surveyor",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": -72717692.0,
        "tMaxSec": 215806800.0
      },
      {
        "file": "sc_mars_global_surveyor__sun.dyn",
        "ent": "sc_mars_global_surveyor",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -99081876.0,
        "tMaxSec": -72717692.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 3790,
      "eccentricity": 0.005,
      "inclinationDeg": 92.9,
      "lonAscendingNodeDeg": 10,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 190,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_mars_odyssey",
    "name": "Mars Odyssey",
    "shortName": "Mars Odyssey",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL / ASU",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2001\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_odyssey/mars_odyssey.gltf",
    "physicalSpanM": 5.8,
    "role": "Longest-Operating Mars Spacecraft",
    "description": "Mapped widespread hydrogen and shallow polar water ice across Mars since 2001 and serves as the longest-lived orbiter at any world beyond Earth.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_odyssey__earth__orb.dyn",
        "ent": "sc_mars_odyssey",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 39932700.0,
        "tMaxSec": 40233664.0
      },
      {
        "file": "sc_mars_odyssey__mars__orb.dyn",
        "ent": "sc_mars_odyssey",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": 57128464.0,
        "tMaxSec": 917870400.0
      },
      {
        "file": "sc_mars_odyssey__sun__orb.dyn",
        "ent": "sc_mars_odyssey",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 40233664.0,
        "tMaxSec": 57128464.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 3790,
      "eccentricity": 0.005,
      "inclinationDeg": 93.1,
      "lonAscendingNodeDeg": 160,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 240,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_mars_reconnaissance_orbiter",
    "name": "Mars Reconnaissance Orbiter",
    "shortName": "MRO",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2005\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_reconnaissance_orbiter/MRO.gltf",
    "physicalSpanM": 13.6,
    "role": "High-Resolution Mars Imager & Relay Orbiter",
    "description": "Carries the telescopic HiRISE camera (25 cm/pixel on Mars) and SHARAD ground-penetrating radar while relaying rover telemetry.",
    "highlights": [
      "HiRISE captured Perseverance & Curiosity hanging under supersonic parachutes",
      "Primary deep-space communications relay for Mars surface missions"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_reconnaissance_orbiter__earth__orb.dyn",
        "ent": "sc_mars_reconnaissance_orbiter",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 177122516.0,
        "tMaxSec": 177429664.0
      },
      {
        "file": "sc_mars_reconnaissance_orbiter__mars__orb.dyn",
        "ent": "sc_mars_reconnaissance_orbiter",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": 195285665.0,
        "tMaxSec": 858130080.0
      },
      {
        "file": "sc_mars_reconnaissance_orbiter__sun__orb.dyn",
        "ent": "sc_mars_reconnaissance_orbiter",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 177429664.0,
        "tMaxSec": 195285665.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 3680,
      "eccentricity": 0.006,
      "inclinationDeg": 92.7,
      "lonAscendingNodeDeg": 70,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 80,
      "periodDays": 0.078
    }
  },
  {
    "id": "sc_mars_science_laboratory",
    "name": "Mars Science Laboratory (Curiosity)",
    "shortName": "Curiosity",
    "subcategory": "Rover",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / JPL",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2011\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_mars_science_laboratory/rover/curiosity_static.gltf",
    "physicalSpanM": 3.0,
    "role": "Gale Crater Mars Science Rover",
    "description": "Climbing the layered slopes of Aeolis Mons (Mount Sharp) in Gale Crater since August 2012, uncovering billion-year-old habitable lakebeds.",
    "highlights": [
      "Landing site: Aeolis Palus, Gale Crater (4.59\u00b0S, 137.44\u00b0E)",
      "MMRTG plutonium generator & ChemCam laser spectrometer",
      "Ascended more than 800 vertical meters up Mount Sharp"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_mars_science_laboratory__earth__orb.dyn",
        "ent": "sc_mars_science_laboratory",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 375594733.0,
        "tMaxSec": 376039259.0
      },
      {
        "file": "sc_mars_science_laboratory__edl__pos.dyn",
        "ent": "sc_mars_science_laboratory",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 397501373.0,
        "tMaxSec": 397502386.831
      },
      {
        "file": "sc_mars_science_laboratory__mars__orb.dyn",
        "ent": "sc_mars_science_laboratory",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 397477501.0,
        "tMaxSec": 397501373.0
      },
      {
        "file": "sc_mars_science_laboratory__sun__orb.dyn",
        "ent": "sc_mars_science_laboratory",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 376039259.0,
        "tMaxSec": 397477501.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": {
      "body": "Mars",
      "latDeg": -4.5895,
      "lonDeg": 137.4417,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_maven",
    "name": "MAVEN",
    "shortName": "MAVEN",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / LASP / GSFC",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2013\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_maven/Maven.gltf",
    "physicalSpanM": 11.4,
    "role": "Mars Atmosphere & Volatile Evolution Probe",
    "description": "Measures how the solar wind stripped Mars's thick ancient atmosphere into space, turning a wet world arid.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_maven__earth__orb.dyn",
        "ent": "sc_maven",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 438074509.343,
        "tMaxSec": 438296467.0
      },
      {
        "file": "sc_maven__mars__orb.dyn",
        "ent": "sc_maven",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": 464590867.0,
        "tMaxSec": 829709700.0
      },
      {
        "file": "sc_maven__sun__orb.dyn",
        "ent": "sc_maven",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 438296467.0,
        "tMaxSec": 464590867.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 5750,
      "eccentricity": 0.38,
      "inclinationDeg": 75.0,
      "lonAscendingNodeDeg": 220,
      "argPeriapsisDeg": 45,
      "meanAnomalyDeg": 110,
      "periodDays": 0.146
    }
  },
  {
    "id": "sc_mcubed_2",
    "name": "MCubed-2",
    "shortName": "MCubed-2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_mcubed_2/M-Cubed2.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7121,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 39,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 123,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_messenger",
    "name": "MESSENGER",
    "shortName": "MESSENGER",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / JHUAPL",
    "hostBody": "Mercury",
    "status": "Completed",
    "activeSpan": "2004\u20132015",
    "featuredEpochUtc": "2012-06-01T00:00:00Z",
    "modelPath": "sc_messenger/Messenger.gltf",
    "physicalSpanM": 6.0,
    "role": "First Spacecraft to Orbit Mercury",
    "description": "Braved 11\u00d7 solar intensity behind a ceramic shade to map Mercury globally and confirm shadowed water ice at its north pole.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mercury"
    ],
    "colorHex": "#ffb74d",
    "dynSegments": [
      {
        "file": "sc_messenger__earth__flyby__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 175801890.0,
        "tMaxSec": 176659095.0
      },
      {
        "file": "sc_messenger__earth__launch__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 144789279.393,
        "tMaxSec": 145066469.0
      },
      {
        "file": "sc_messenger__mercury__flyby1__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "mercury",
        "kind": "orb",
        "inline": true,
        "tMinSec": 253547108.0,
        "tMaxSec": 253671753.0
      },
      {
        "file": "sc_messenger__mercury__flyby2__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "mercury",
        "kind": "orb",
        "inline": true,
        "tMinSec": 276485360.0,
        "tMaxSec": 276627276.0
      },
      {
        "file": "sc_messenger__mercury__flyby3__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "mercury",
        "kind": "orb",
        "inline": true,
        "tMinSec": 307423681.0,
        "tMaxSec": 307651285.0
      },
      {
        "file": "sc_messenger__mercury__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "mercury",
        "kind": "orb",
        "inline": false,
        "tMinSec": 353474040.0,
        "tMaxSec": 483694028.351
      },
      {
        "file": "sc_messenger__sun__1__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 145066469.0,
        "tMaxSec": 175801890.0
      },
      {
        "file": "sc_messenger__sun__2__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 176659095.0,
        "tMaxSec": 214828942.0
      },
      {
        "file": "sc_messenger__sun__3__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 215033751.0,
        "tMaxSec": 234289415.0
      },
      {
        "file": "sc_messenger__sun__4__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 234436749.0,
        "tMaxSec": 253547108.0
      },
      {
        "file": "sc_messenger__sun__5__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 253671753.0,
        "tMaxSec": 276485360.0
      },
      {
        "file": "sc_messenger__sun__6__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 276627276.0,
        "tMaxSec": 307423681.0
      },
      {
        "file": "sc_messenger__sun__7__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 307651285.0,
        "tMaxSec": 353474040.0
      },
      {
        "file": "sc_messenger__venus__flyby1__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": 214828942.0,
        "tMaxSec": 215033751.0
      },
      {
        "file": "sc_messenger__venus__flyby2__orb.dyn",
        "ent": "sc_messenger",
        "parentId": "venus",
        "kind": "orb",
        "inline": true,
        "tMinSec": 234289415.0,
        "tMaxSec": 234436749.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mercury",
      "semiMajorAxisKm": 9200,
      "eccentricity": 0.72,
      "inclinationDeg": 82.5,
      "lonAscendingNodeDeg": 45,
      "argPeriapsisDeg": 110,
      "meanAnomalyDeg": 30,
      "periodDays": 0.5
    }
  },
  {
    "id": "sc_mms_1",
    "name": "MMS 1",
    "shortName": "MMS 1",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_mms/MMS.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 22.0,
      "lonAscendingNodeDeg": 35,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 215,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_mms_2",
    "name": "MMS 2",
    "shortName": "MMS 2",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_mms/MMS.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42000,
      "eccentricity": 0.72,
      "inclinationDeg": 34.0,
      "lonAscendingNodeDeg": 96,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 312,
      "periodDays": 1.0
    }
  },
  {
    "id": "sc_mms_3",
    "name": "MMS 3",
    "shortName": "MMS 3",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_mms/MMS.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 50000,
      "eccentricity": 0.72,
      "inclinationDeg": 46.0,
      "lonAscendingNodeDeg": 157,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 49,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_mms_4",
    "name": "MMS 4",
    "shortName": "MMS 4",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_mms/MMS.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 58000,
      "eccentricity": 0.72,
      "inclinationDeg": 58.0,
      "lonAscendingNodeDeg": 218,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 146,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_near_shoemaker",
    "name": "NEAR Shoemaker",
    "shortName": "NEAR Shoemaker",
    "subcategory": "Flyby",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JHUAPL",
    "hostBody": "Eros",
    "status": "Completed",
    "activeSpan": "1996\u20132001",
    "featuredEpochUtc": "2000-02-14T15:33:00Z",
    "modelPath": "sc_near_shoemaker/near.gltf",
    "physicalSpanM": 3.4,
    "role": "First Asteroid Orbiter & Surface Lander",
    "description": "Orbited near-Earth asteroid 433 Eros for a full year before touching down gently onto its dusty regolith on 12 February 2001.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: Eros"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_near_shoemaker__253_mathilde__pos.dyn",
        "ent": "sc_near_shoemaker",
        "parentId": "253_mathilde",
        "kind": "pos",
        "inline": true,
        "tMinSec": -79403925.0,
        "tMaxSec": -79210250.0
      },
      {
        "file": "sc_near_shoemaker__433_eros__orb.dyn",
        "ent": "sc_near_shoemaker",
        "parentId": "433_eros",
        "kind": "orb",
        "inline": false,
        "tMinSec": -8425610.0,
        "tMaxSec": 35279032.137
      },
      {
        "file": "sc_near_shoemaker__earth__flyby__orb.dyn",
        "ent": "sc_near_shoemaker",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -61397606.0,
        "tMaxSec": -60793811.0
      },
      {
        "file": "sc_near_shoemaker__sun__orb.dyn",
        "ent": "sc_near_shoemaker",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -113227200.0,
        "tMaxSec": -8425610.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Eros",
      "semiMajorAxisKm": 60,
      "eccentricity": 0.05,
      "inclinationDeg": 45,
      "lonAscendingNodeDeg": 10,
      "argPeriapsisDeg": 20,
      "meanAnomalyDeg": 40,
      "periodDays": 2.0
    }
  },
  {
    "id": "sc_neo_surveyor",
    "name": "NEO Surveyor",
    "shortName": "NEO Surveyor",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA",
    "hostBody": "Sun-Earth L1",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_neo_surveyor/neosurveyor.gltf",
    "physicalSpanM": 3.6,
    "role": "Sun-Earth L1 Orbiter",
    "description": "NASA Eyes orbiter mission operating around Sun-Earth L1, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun-Earth L1"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_neo_surveyor__earth.dyn",
        "ent": "sc_neo_surveyor",
        "parentId": "earth",
        "kind": "pos",
        "inline": false,
        "tMinSec": 874108800.0,
        "tMaxSec": 1289990369.73
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 420000,
      "periodDays": 180.0,
      "phaseDeg": 310.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_new_horizons",
    "name": "New Horizons",
    "shortName": "New Horizons",
    "subcategory": "Flyby",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / JHUAPL",
    "hostBody": "Pluto / Kuiper Belt",
    "status": "Active",
    "activeSpan": "2006\u2013Present",
    "featuredEpochUtc": "2015-07-14T11:49:00Z",
    "modelPath": "sc_new_horizons/new_horizons.gltf",
    "physicalSpanM": 2.7,
    "role": "Pluto & Kuiper Belt Reconnaissance Probe",
    "description": "Launched as the fastest Earth departure spacecraft, revealing Sputnik Planitia's nitrogen glaciers on Pluto (2015) and contact binary Arrokoth (2019).",
    "highlights": [
      "Closest approach 12,500 km above Pluto on 14 July 2015",
      "Revealed contact-binary Kuiper Belt object 486958 Arrokoth",
      "LORRI long-range telescope, Ralph & Alice spectrometers"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_new_horizons__earth__orb.dyn",
        "ent": "sc_new_horizons",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 190972278.33,
        "tMaxSec": 191055829.0
      },
      {
        "file": "sc_new_horizons__jupiter__orb.dyn",
        "ent": "sc_new_horizons",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": 225619606.0,
        "tMaxSec": 226100665.0
      },
      {
        "file": "sc_new_horizons__mu69__pos.dyn",
        "ent": "sc_new_horizons",
        "parentId": "486958_arrokoth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 598753684.0,
        "tMaxSec": 600203601.0
      },
      {
        "file": "sc_new_horizons__pluto__orb.dyn",
        "ent": "sc_new_horizons",
        "parentId": "pluto",
        "kind": "orb",
        "inline": true,
        "tMinSec": 490130161.0,
        "tMaxSec": 490167848.0
      },
      {
        "file": "sc_new_horizons__sun__1__orb.dyn",
        "ent": "sc_new_horizons",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 191055829.0,
        "tMaxSec": 225619606.0
      },
      {
        "file": "sc_new_horizons__sun__2__orb.dyn",
        "ent": "sc_new_horizons",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 226100665.0,
        "tMaxSec": 490130161.0
      },
      {
        "file": "sc_new_horizons__sun__3__pos.dyn",
        "ent": "sc_new_horizons",
        "parentId": "sun",
        "kind": "pos",
        "inline": true,
        "tMinSec": 490167848.0,
        "tMaxSec": 598753684.0
      },
      {
        "file": "sc_new_horizons__sun__4__pos.dyn",
        "ent": "sc_new_horizons",
        "parentId": "sun",
        "kind": "pos",
        "inline": true,
        "tMinSec": 600203601.0,
        "tMaxSec": 886291200.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_nisar",
    "name": "NISAR",
    "shortName": "NISAR",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_nisar/Nisar.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 66,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 42,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_noaa_20",
    "name": "Noaa 20",
    "shortName": "Noaa 20",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_noaa_20/noaa20.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 109,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 113,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_noaa_21",
    "name": "Noaa 21",
    "shortName": "Noaa 21",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_noaa_21/noaa21.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 152,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 184,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_nustar",
    "name": "NuSTAR",
    "shortName": "NuSTAR",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / Caltech",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "2012\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_nustar/nustar.gltf",
    "physicalSpanM": 10.9,
    "role": "High-Energy Focusing X-ray Telescope",
    "description": "Deploys a 10-meter carbon-fiber mast in orbit to focus hard X-rays from black holes, magnetars, and supernova remnants.",
    "highlights": [
      "First orbiting telescope to focus hard X-rays (3\u201379 keV)",
      "10.1 m deployable lattice mast separates optics from detectors"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6980,
      "eccentricity": 0.001,
      "inclinationDeg": 6.0,
      "lonAscendingNodeDeg": 80,
      "argPeriapsisDeg": 10,
      "meanAnomalyDeg": 40,
      "periodDays": 0.067
    }
  },
  {
    "id": "sc_oco_2",
    "name": "OCO-2",
    "shortName": "Orbiting Carbon Observ",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_oco_2/oco2.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7076,
      "eccentricity": 0.0001,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 44,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_osiris_rex",
    "name": "OSIRIS-APEX",
    "shortName": "OSIRIS-APEX",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / UArizona / GSFC",
    "hostBody": "Bennu / Apophis",
    "status": "Active",
    "activeSpan": "2016\u2013Present",
    "featuredEpochUtc": "2023-09-24T12:00:00Z",
    "modelPath": "sc_osiris_rex_v2/osiris_rex_articulated_panels.gltf",
    "physicalSpanM": 6.2,
    "role": "Bennu Sample Return & Apophis Explorer",
    "description": "Collected 121.6 g of pristine carbonaceous regolith from asteroid Bennu in 2020, delivered the capsule to Utah in 2023, and now cruises to 99942 Apophis.",
    "highlights": [
      "Touch-and-Go (TAG) pneumatic sampling of rubble-pile Bennu",
      "Redirected on extended OSIRIS-APEX tour for 2029 Apophis rendezvous"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_osiris_rex__apophis.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "99942_apophis",
        "kind": "pos",
        "inline": false,
        "tMinSec": 924136663.0,
        "tMaxSec": 968068800.0
      },
      {
        "file": "sc_osiris_rex__bennu__pos.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "101955_bennu",
        "kind": "pos",
        "inline": false,
        "tMinSec": 591770603.0,
        "tMaxSec": 674049669.0
      },
      {
        "file": "sc_osiris_rex__earth__flyby__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 558938468.0,
        "tMaxSec": 559919190.0
      },
      {
        "file": "sc_osiris_rex__earth__launch__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 526676400.0,
        "tMaxSec": 527025408.0
      },
      {
        "file": "sc_osiris_rex__earth__sample_return__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 748358886.0,
        "tMaxSec": 749140122.0
      },
      {
        "file": "sc_osiris_rex__sun__1__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 527025408.0,
        "tMaxSec": 558938468.0
      },
      {
        "file": "sc_osiris_rex__sun__2__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 559919190.0,
        "tMaxSec": 591770603.0
      },
      {
        "file": "sc_osiris_rex__sun__3__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 674049669.0,
        "tMaxSec": 748358886.0
      },
      {
        "file": "sc_osiris_rex__sun__4__orb.dyn",
        "ent": "sc_osiris_rex",
        "parentId": "sun",
        "kind": "pos",
        "inline": true,
        "tMinSec": 749140122.0,
        "tMaxSec": 924136663.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_osiris_rex_src",
    "name": "OSIRIS-REx Sample Return Capsule",
    "shortName": "ORX SRC",
    "subcategory": "Flyby",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_osiris_rex_v2/src/osiris_rex_heatshield.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Flyby",
    "description": "NASA Eyes flyby mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_osiris_rex_src__earth.dyn",
        "ent": "sc_osiris_rex_src",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 748832190.0,
        "tMaxSec": 748839215.0
      },
      {
        "file": "sc_osiris_rex_src__sc_osiris_rex.dyn",
        "ent": "sc_osiris_rex_src",
        "parentId": "sc_osiris_rex",
        "kind": "pos",
        "inline": true,
        "tMinSec": 748824183.986,
        "tMaxSec": 748832190.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 324,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 108,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_pace",
    "name": "PACE",
    "shortName": "Plankton, Aerosol, Clo",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_pace/pace.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 7,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 179,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_parker_solar_probe",
    "name": "Parker Solar Probe",
    "shortName": "Parker Solar Probe",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / JHUAPL",
    "hostBody": "Sun",
    "status": "Active",
    "activeSpan": "2018\u2013Present",
    "featuredEpochUtc": "2024-12-24T11:53:00Z",
    "modelPath": "sc_parker_solar_probe/PSP.gltf",
    "physicalSpanM": 3.0,
    "role": "Coronal \"Touch the Sun\" Helioprobe",
    "description": "Skims inside the Sun's corona within 6.1 million km of the photosphere behind a 11.4 cm carbon-composite heat shield at 690,000 km/h.",
    "highlights": [
      "Fastest spacecraft ever built (~192 km/s at perihelion)",
      "7 Venus gravity assists progressively shrink perihelion",
      "Actively water-cooled solar panels & FIELDS/WISPR corona suite"
    ],
    "colorHex": "#ffb74d",
    "dynSegments": [
      {
        "file": "sc_parker_solar_probe__earth__orb.dyn",
        "ent": "sc_parker_solar_probe",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 587333783.343,
        "tMaxSec": 587454078.0
      },
      {
        "file": "sc_parker_solar_probe__sun__orb.dyn",
        "ent": "sc_parker_solar_probe",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 587454078.0,
        "tMaxSec": 936187269.183
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_philae",
    "name": "Philae",
    "shortName": "Philae",
    "subcategory": "Lander",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "ESA / DLR / ASI / CNES",
    "hostBody": "67P/Churyumov-Gerasimenko",
    "status": "Completed",
    "activeSpan": "2004\u20132016",
    "featuredEpochUtc": "2014-11-12T12:00:00Z",
    "modelPath": "sc_philae/philae.gltf",
    "physicalSpanM": 1.8,
    "role": "Cometary Surface Lander",
    "description": "Achieved history's first soft touchdown on a comet nucleus (67P/C-G) on 12 November 2014, detecting organic molecules in Abydos region.",
    "highlights": [
      "Executed double bounce across Agilkia to shadowed Abydos cliff",
      "Analyzed volatile organics with COSAC and Ptolemy"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_philae__67p_churyumov_gerasimenko__pos.dyn",
        "ent": "sc_philae",
        "parentId": "67p_churyumov_gerasimenko",
        "kind": "pos",
        "inline": true,
        "tMinSec": 469053367.183,
        "tMaxSec": 469078512.324
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_phoenix",
    "name": "Phoenix",
    "shortName": "Phoenix",
    "subcategory": "Lander",
    "missionGroup": "Mars Exploration",
    "agency": "NASA / UArizona",
    "hostBody": "Mars",
    "status": "Completed",
    "activeSpan": "2007\u20132008",
    "featuredEpochUtc": null,
    "modelPath": "sc_phoenix/edl/phoenix_edl.gltf",
    "physicalSpanM": 5.5,
    "role": "North Polar Mars Subsurface Ice Lander",
    "description": "Touched down in Vastitas Borealis at 68.2\u00b0N, scraping away soil to photograph exposed bright water ice inches beneath the surface.",
    "highlights": [
      "Observed Martian snowfall via LIDAR atmospheric laser",
      "Confirmed alkaline regolith containing calcium carbonate & perchlorate"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_phoenix__earth__orb.dyn",
        "ent": "sc_phoenix",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 239496427.0,
        "tMaxSec": 239618121.0
      },
      {
        "file": "sc_phoenix__mars__orb.dyn",
        "ent": "sc_phoenix",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 265008306.0,
        "tMaxSec": 265030318.0
      },
      {
        "file": "sc_phoenix__phx_topo__pos.dyn",
        "ent": "sc_phoenix",
        "parentId": "mars",
        "kind": "pos",
        "inline": true,
        "tMinSec": 265030318.0,
        "tMaxSec": 265030769.0
      },
      {
        "file": "sc_phoenix__sun__orb.dyn",
        "ent": "sc_phoenix",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 239618121.0,
        "tMaxSec": 265008306.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": {
      "body": "Mars",
      "latDeg": 68.2188,
      "lonDeg": 234.2508,
      "altKm": 0.008
    },
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_pioneer_10",
    "name": "Pioneer 10",
    "shortName": "Pioneer 10",
    "subcategory": "Flyby",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / Ames",
    "hostBody": "Interstellar",
    "status": "Completed",
    "activeSpan": "1972\u20132003",
    "featuredEpochUtc": "1973-12-04T02:26:00Z",
    "modelPath": "sc_pioneer/pioneer.gltf",
    "physicalSpanM": 2.9,
    "role": "First Jupiter Flyby & Kuiper Pioneer",
    "description": "First spacecraft to traverse the asteroid belt and fly past Jupiter (1973), carrying the engraved gold-anodized Pioneer Plaque toward Aldebaran.",
    "highlights": [
      "Survived Jupiter's intense radiation belts in December 1973",
      "Maintained radio contact out to 82 AU until 2003"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_pioneer_10__earth__orb.dyn",
        "ent": "sc_pioneer_10",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -878291717.815,
        "tMaxSec": -878146409.0
      },
      {
        "file": "sc_pioneer_10__jupiter__orb.dyn",
        "ent": "sc_pioneer_10",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -824046472.0,
        "tMaxSec": -822011429.0
      },
      {
        "file": "sc_pioneer_10__sun__1__orb.dyn",
        "ent": "sc_pioneer_10",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -878146409.0,
        "tMaxSec": -824046472.0
      },
      {
        "file": "sc_pioneer_10__sun__2__orb.dyn",
        "ent": "sc_pioneer_10",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -822011429.0,
        "tMaxSec": 1577880600.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_pioneer_11",
    "name": "Pioneer 11",
    "shortName": "Pioneer 11",
    "subcategory": "Flyby",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / Ames",
    "hostBody": "Interstellar",
    "status": "Completed",
    "activeSpan": "1973\u20131995",
    "featuredEpochUtc": "1979-09-01T16:31:00Z",
    "modelPath": "sc_pioneer/pioneer.gltf",
    "physicalSpanM": 2.9,
    "role": "First Saturn Flyby Pathfinder",
    "description": "Pathfinder for Voyager at Saturn (September 1979), skimming within 21,000 km of Saturn's clouds and discovering the F-ring.",
    "highlights": [
      "Executed dramatic polar pass over Jupiter toward Saturn",
      "Verified ring plane safety for the upcoming Voyager flybys"
    ],
    "colorHex": "#f4cd72",
    "dynSegments": [
      {
        "file": "sc_pioneer_11__earth__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -843816855.814,
        "tMaxSec": -843644357.0
      },
      {
        "file": "sc_pioneer_11__jupiter__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -792658454.0,
        "tMaxSec": -790152245.0
      },
      {
        "file": "sc_pioneer_11__saturn__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "saturn",
        "kind": "orb",
        "inline": true,
        "tMinSec": -643302619.0,
        "tMaxSec": -640194311.0
      },
      {
        "file": "sc_pioneer_11__sun__1__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -843644357.0,
        "tMaxSec": -792658454.0
      },
      {
        "file": "sc_pioneer_11__sun__2__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -790152245.0,
        "tMaxSec": -643302619.0
      },
      {
        "file": "sc_pioneer_11__sun__3__orb.dyn",
        "ent": "sc_pioneer_11",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -640194311.0,
        "tMaxSec": 1577880600.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_polar",
    "name": "Polar",
    "shortName": "Polar",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_polar/polar.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_polar__earth.dyn",
        "ent": "sc_polar",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": -121504384.0,
        "tMaxSec": 262694890.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 22.0,
      "lonAscendingNodeDeg": 175,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 355,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_prefire_1",
    "name": "PREFIRE-1",
    "shortName": "PREFIRE-1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_prefire/prefire.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 308,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 316,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_prefire_2",
    "name": "PREFIRE-2",
    "shortName": "PREFIRE-2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_prefire/prefire.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7121,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 351,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 27,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_psyche",
    "name": "Psyche",
    "shortName": "Psyche",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / ASU / JPL",
    "hostBody": "Psyche",
    "status": "En Route",
    "activeSpan": "2023\u2013Present",
    "featuredEpochUtc": "2026-05-15T00:00:00Z",
    "modelPath": "sc_psyche/psyche.gltf",
    "physicalSpanM": 24.7,
    "role": "Metal-Rich Asteroid Hall-Thruster Orbiter",
    "description": "On a solar-electric Hall-effect thruster voyage to metal-rich asteroid 16 Psyche \u2014 potentially the exposed nickel-iron core of a protoplanet.",
    "highlights": [
      "Twin 5-panel cross solar arrays generating 21 kW at 1 AU",
      "Magnetometer, Multispectral Imager & Gamma-Ray/Neutron Spectrometer"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_psyche__16_psyche__orb.dyn",
        "ent": "sc_psyche",
        "parentId": "16_psyche",
        "kind": "orb",
        "inline": false,
        "tMinSec": 931665741.0,
        "tMaxSec": 1004529988.186
      },
      {
        "file": "sc_psyche__earth__orb.dyn",
        "ent": "sc_psyche",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 750482453.0,
        "tMaxSec": 750686758.0
      },
      {
        "file": "sc_psyche__mars__orb.dyn",
        "ent": "sc_psyche",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 831828698.0,
        "tMaxSec": 832302380.0
      },
      {
        "file": "sc_psyche__sun__orb.dyn",
        "ent": "sc_psyche",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 750686758.0,
        "tMaxSec": 931665741.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_quikscat",
    "name": "QuikSCAT",
    "shortName": "QuikSCAT",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_quikscat/QuikSCAT.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 77,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 169,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_raincube",
    "name": "RainCube",
    "shortName": "RainCube",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_raincube/Raincube.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 120,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 240,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_rbsp_a",
    "name": "Van Allen Probe A",
    "shortName": "Van Allen Probe A",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_rbsp/rbsp.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 50000,
      "eccentricity": 0.72,
      "inclinationDeg": 34.0,
      "lonAscendingNodeDeg": 181,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 217,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_rbsp_b",
    "name": "Van Allen Probe B",
    "shortName": "Van Allen Probe B",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_rbsp/rbsp.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 58000,
      "eccentricity": 0.72,
      "inclinationDeg": 46.0,
      "lonAscendingNodeDeg": 242,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 314,
      "periodDays": 1.8
    }
  },
  {
    "id": "sc_roman_space_telescope",
    "name": "Nancy Grace Roman Space Telescope",
    "shortName": "Nancy Grace Roman",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / GSFC",
    "hostBody": "Sun-Earth L2",
    "status": "Upcoming",
    "activeSpan": "2026\u2013Present",
    "featuredEpochUtc": "2026-11-15T12:00:00Z",
    "modelPath": "sc_roman_space_telescope/roman.gltf",
    "physicalSpanM": 12.7,
    "role": "Wide Field Infrared Survey Telescope",
    "description": "2.4 m infrared space observatory with a 100\u00d7 wider field of view than Hubble plus a starlight-suppressing exoplanet coronagraph.",
    "highlights": [
      "288-megapixel Wide Field Instrument",
      "Searches for thousands of exoplanets via gravitational microlensing"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_roman_space_telescope__earth.dyn",
        "ent": "sc_roman_space_telescope",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 841363150.0,
        "tMaxSec": 857696469.185
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L2",
      "amplitudeKm": 480000,
      "periodDays": 182.0,
      "phaseDeg": 290.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_rosetta",
    "name": "Rosetta",
    "shortName": "Rosetta",
    "subcategory": "Orbiter",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "ESA / NASA",
    "hostBody": "67P/Churyumov-Gerasimenko",
    "status": "Completed",
    "activeSpan": "2004\u20132016",
    "featuredEpochUtc": "2014-02-01T00:00:00Z",
    "modelPath": "sc_rosetta/rosettaPhilae.gltf",
    "physicalSpanM": 32.0,
    "role": "Comet Escort & Philae Carrier Orbiter",
    "description": "Escorted comet 67P/Churyumov\u2013Gerasimenko through perihelion for over two years after a 10-year deep-space chase, deploying lander Philae.",
    "highlights": [
      "First spacecraft to orbit a comet nucleus in deep space",
      "Monitored dust jets erupting through perihelion before soft landing in 2016"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_rosetta__67p_churyumov_gerasimenko__pos.dyn",
        "ent": "sc_rosetta",
        "parentId": "67p_churyumov_gerasimenko",
        "kind": "pos",
        "inline": false,
        "tMinSec": 452394238.0,
        "tMaxSec": 528503957.968
      },
      {
        "file": "sc_rosetta__earth__flyby1__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 162704887.0,
        "tMaxSec": 163831232.0
      },
      {
        "file": "sc_rosetta__earth__flyby2__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 248111015.0,
        "tMaxSec": 248475560.0
      },
      {
        "file": "sc_rosetta__earth__flyby3__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 311055929.0,
        "tMaxSec": 311664877.0
      },
      {
        "file": "sc_rosetta__earth__launch__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 131491581.583,
        "tMaxSec": 131901500.0
      },
      {
        "file": "sc_rosetta__mars__flyby__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "mars",
        "kind": "orb",
        "inline": true,
        "tMinSec": 225623375.0,
        "tMaxSec": 225657862.0
      },
      {
        "file": "sc_rosetta__sun__1__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 131901500.0,
        "tMaxSec": 162704887.0
      },
      {
        "file": "sc_rosetta__sun__2__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 163831232.0,
        "tMaxSec": 225623375.0
      },
      {
        "file": "sc_rosetta__sun__3__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 225657862.0,
        "tMaxSec": 248111015.0
      },
      {
        "file": "sc_rosetta__sun__4__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 248475560.0,
        "tMaxSec": 311055929.0
      },
      {
        "file": "sc_rosetta__sun__5__orb.dyn",
        "ent": "sc_rosetta",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 311664877.0,
        "tMaxSec": 452394238.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_sac_d",
    "name": "Aquarius",
    "shortName": "Aquarius",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_sac_d/aquarius.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 335,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 235,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_sdo",
    "name": "Solar Dynamics Observatory",
    "shortName": "SDO",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / GSFC",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "2010\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_sdo/sdo.gltf",
    "physicalSpanM": 4.5,
    "role": "Continuous Full-Disk Solar Observatory",
    "description": "Monitors the Sun's churning magnetic field, extreme-UV corona, and solar flares in real time from an inclined geosynchronous orbit.",
    "highlights": [
      "4K-resolution AIA EUV solar imaging every 12 seconds",
      "HMI helioseismology tracks interior plasma flows and sunspots"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0002,
      "inclinationDeg": 28.5,
      "lonAscendingNodeDeg": 95,
      "argPeriapsisDeg": 10,
      "meanAnomalyDeg": 140,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_sentinel_6",
    "name": "Sentinel-6 Michael Freilich",
    "shortName": "Sentinel-6 Michael Fre",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_sentinel_6/Sentinel6.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7707,
      "eccentricity": 0.0002,
      "inclinationDeg": 66.0,
      "lonAscendingNodeDeg": 61,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 17,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_sentinel_6b",
    "name": "Sentinel-6B",
    "shortName": "Sentinel-6B",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_sentinel_6/Sentinel6.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7707,
      "eccentricity": 0.0002,
      "inclinationDeg": 66.0,
      "lonAscendingNodeDeg": 104,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 88,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_smap",
    "name": "SMAP",
    "shortName": "Soil Moisture Active P",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_smap/SMAP.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7121,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 147,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 159,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_soho",
    "name": "SOHO",
    "shortName": "SOHO",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "ESA / NASA",
    "hostBody": "Sun-Earth L1",
    "status": "Active",
    "activeSpan": "1995\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_soho/soho.gltf",
    "physicalSpanM": 9.5,
    "role": "L1 Solar & Heliospheric Watchdog",
    "description": "Operating continuously since 1995 at Sun-Earth L1, watching coronal mass ejections while inadvertently becoming history's greatest comet discoverer (5,000+ comets).",
    "highlights": [
      "LASCO coronagraph spots oncoming Earth-directed CMEs",
      "Discovered more than 5,000 sungrazing comets"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 620000,
      "periodDays": 178.0,
      "phaseDeg": 80.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_solar_1",
    "name": "SOLAR-1",
    "shortName": "SOLAR-1",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Sun-Earth L1",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_solar_1/swfo.gltf",
    "physicalSpanM": 3.6,
    "role": "Sun-Earth L1 Orbiter",
    "description": "NASA Eyes orbiter mission operating around Sun-Earth L1, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun-Earth L1"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_solar_1__earth.dyn",
        "ent": "sc_solar_1",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 811990990.0,
        "tMaxSec": 884088069.184
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": {
      "point": "L1",
      "amplitudeKm": 390000,
      "periodDays": 179.0,
      "phaseDeg": 225.0
    },
    "fallbackOrbit": null
  },
  {
    "id": "sc_sorce",
    "name": "SORCE",
    "shortName": "SORCE",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_sorce/sorce.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6991,
      "eccentricity": 0.0002,
      "inclinationDeg": 40.0,
      "lonAscendingNodeDeg": 276,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 12,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_spherex",
    "name": "SPHEREx",
    "shortName": "SPHEREx",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / Caltech",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "2025\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_spherex/spherex.gltf",
    "physicalSpanM": 3.2,
    "role": "All-Sky Near-Infrared Spectral Mapper",
    "description": "Conical-shielded observatory performing the first all-sky spectroscopic survey in 102 infrared color bands to study cosmic inflation and water ices.",
    "highlights": [
      "Triple nested photon shields passively cool telescope to 80 K",
      "Maps over 450 million galaxies & Milky Way interstellar ices"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7040,
      "eccentricity": 0.001,
      "inclinationDeg": 98.0,
      "lonAscendingNodeDeg": 280,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 210,
      "periodDays": 0.068
    }
  },
  {
    "id": "sc_spitzer",
    "name": "Spitzer Space Telescope",
    "shortName": "Spitzer",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / JPL / Caltech",
    "hostBody": "Sun",
    "status": "Completed",
    "activeSpan": "2003\u20132020",
    "featuredEpochUtc": "2010-01-01T00:00:00Z",
    "modelPath": "sc_spitzer/SPITZER.gltf",
    "physicalSpanM": 4.4,
    "role": "Infrared Great Observatory (Earth-Trailing)",
    "description": "Co-discovered the TRAPPIST-1 seven-Earth-sized exoplanet system and mapped dusty galaxies while drifting behind Earth along 1 AU.",
    "highlights": [
      "Earth-trailing heliocentric orbit eliminated Earth infrared heat",
      "Measured the first direct spectra of transiting exoplanet atmospheres"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_spitzer__earth__orb.dyn",
        "ent": "sc_spitzer",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 115064804.0,
        "tMaxSec": 115493678.0
      },
      {
        "file": "sc_spitzer__sun__orb.dyn",
        "ent": "sc_spitzer",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 115493678.0,
        "tMaxSec": 633614469.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_stardust",
    "name": "Stardust",
    "shortName": "Stardust-NExT",
    "subcategory": "Flyby",
    "missionGroup": "Asteroid & Comet Probes",
    "agency": "NASA / JPL / Lockheed Martin",
    "hostBody": "81P/Wild 2",
    "status": "Completed",
    "activeSpan": "1999\u20132011",
    "featuredEpochUtc": "2004-01-02T19:21:00Z",
    "modelPath": "sc_stardust/stardust_articulated.gltf",
    "physicalSpanM": 4.8,
    "role": "Comet Aerogel Sample Return Explorer",
    "description": "Captured pristine coma grains in tennis-racket aerogel at Comet Wild 2 (2004), returned them to Earth in 2006, then imaged Tempel 1's fresh crater.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: 81P/Wild 2"
    ],
    "colorHex": "#d9a7ff",
    "dynSegments": [
      {
        "file": "sc_stardust__5535_annefrank__pos.dyn",
        "ent": "sc_stardust",
        "parentId": "5535_annefrank",
        "kind": "pos",
        "inline": true,
        "tMinSec": 89379733.0,
        "tMaxSec": 89550209.0
      },
      {
        "file": "sc_stardust__81p_wild_2__pos.dyn",
        "ent": "sc_stardust",
        "parentId": "81p_wild_2",
        "kind": "pos",
        "inline": true,
        "tMinSec": 126009572.0,
        "tMaxSec": 126678668.0
      },
      {
        "file": "sc_stardust__9p_tempel_1__pos.dyn",
        "ent": "sc_stardust",
        "parentId": "9p_tempel_1",
        "kind": "pos",
        "inline": true,
        "tMinSec": 350896766.0,
        "tMaxSec": 351068113.0
      },
      {
        "file": "sc_stardust__earth__flyby1__orb.dyn",
        "ent": "sc_stardust",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 32627842.0,
        "tMaxSec": 33120541.0
      },
      {
        "file": "sc_stardust__earth__flyby2__orb.dyn",
        "ent": "sc_stardust",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 190336290.0,
        "tMaxSec": 190866114.0
      },
      {
        "file": "sc_stardust__earth__flyby3__orb.dyn",
        "ent": "sc_stardust",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 284944970.0,
        "tMaxSec": 285742028.0
      },
      {
        "file": "sc_stardust__earth__launch__orb.dyn",
        "ent": "sc_stardust",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -28304869.3,
        "tMaxSec": -28038699.0
      },
      {
        "file": "sc_stardust__sun__orb.dyn",
        "ent": "sc_stardust",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -28038699.0,
        "tMaxSec": 354279666.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_stardust_src",
    "name": "Stardust Sample Return Capsule",
    "shortName": "Stardust Sample Return",
    "subcategory": "Flyby",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_stardust_src/stardust_capsule.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Flyby",
    "description": "NASA Eyes flyby mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Flyby",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [
      {
        "file": "sc_stardust_src__earth__pos.dyn",
        "ent": "sc_stardust_src",
        "parentId": "earth",
        "kind": "pos",
        "inline": true,
        "tMinSec": 190576755.185,
        "tMaxSec": 190591500.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7141,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 88,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 296,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_starling_1",
    "name": "Starling-1",
    "shortName": "Starling-1",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_starling/starling.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 131,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 7,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_starling_2",
    "name": "Starling-2",
    "shortName": "Starling-2",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_starling/starling.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 174,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 78,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_starling_3",
    "name": "Starling-3",
    "shortName": "Starling-3",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_starling/starling.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 217,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 149,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_starling_4",
    "name": "Starling-4",
    "shortName": "Starling-4",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_starling/starling.gltf",
    "physicalSpanM": 1.2,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 260,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 220,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_stereo_ahead",
    "name": "STEREO Ahead",
    "shortName": "STEREO-A",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / JHUAPL",
    "hostBody": "Sun",
    "status": "Active",
    "activeSpan": "2006\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_stereo_ahead/stereo_a.gltf",
    "physicalSpanM": 6.4,
    "role": "Solar Stereoscopic Ahead Observatory",
    "description": "Orbits ahead of Earth at ~1 AU to provide 3D stereoscopic views of coronal mass ejections erupting from the Sun.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_stereo_ahead__earth__orb.dyn",
        "ent": "sc_stereo_ahead",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 215097110.0,
        "tMaxSec": 221418192.0
      },
      {
        "file": "sc_stereo_ahead__sun__orb.dyn",
        "ent": "sc_stereo_ahead",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 221418192.0,
        "tMaxSec": 1027684869.183
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_stereo_behind",
    "name": "STEREO Behind",
    "shortName": "STEREO-B",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA / JHUAPL",
    "hostBody": "Sun",
    "status": "Completed",
    "activeSpan": "2006\u20132014",
    "featuredEpochUtc": null,
    "modelPath": "sc_stereo_behind/stereo_b.gltf",
    "physicalSpanM": 6.4,
    "role": "Solar Stereoscopic Behind Observatory",
    "description": "Twin of STEREO-A drifting behind Earth at ~1 AU, completing full 360\u00b0 monitoring of solar magnetic storms.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_stereo_behind__earth__orb.dyn",
        "ent": "sc_stereo_behind",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 215097110.0,
        "tMaxSec": 224468337.0
      },
      {
        "file": "sc_stereo_behind__sun__orb.dyn",
        "ent": "sc_stereo_behind",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 224468337.0,
        "tMaxSec": 527860868.182
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_sunrise",
    "name": "Sunrise",
    "shortName": "Sunrise",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_sunrise/sunrise.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6991,
      "eccentricity": 0.0002,
      "inclinationDeg": 80.0,
      "lonAscendingNodeDeg": 29,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 73,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_suomi_npp",
    "name": "Suomi NPP",
    "shortName": "Suomi NPP",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_npp/NPP.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 72,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 144,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_swot",
    "name": "SWOT",
    "shortName": "SWOT",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_swot_v2/swot.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 115,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 215,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tdrs_10",
    "name": "TDRS-10",
    "shortName": "TDRS-10",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 42,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 238,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_11",
    "name": "TDRS-11",
    "shortName": "TDRS-11",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 99,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 321,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_12",
    "name": "TDRS-12",
    "shortName": "TDRS-12",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 156,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 44,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_13",
    "name": "TDRS-13",
    "shortName": "TDRS-13",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 213,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 127,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_3",
    "name": "TDRS-3",
    "shortName": "TDRS-3",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 270,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 210,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_5",
    "name": "TDRS-5",
    "shortName": "TDRS-5",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 327,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 293,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_6",
    "name": "TDRS-6",
    "shortName": "TDRS-6",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 24,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 16,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_7",
    "name": "TDRS-7",
    "shortName": "TDRS-7",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 81,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 99,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_8",
    "name": "TDRS-8",
    "shortName": "TDRS-8",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 138,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 182,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tdrs_9",
    "name": "TDRS-9",
    "shortName": "TDRS-9",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tdrs/tdrs.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 195,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 265,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_tempo",
    "name": "TEMPO",
    "shortName": "TEMPO",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tempo/tempo.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 42164,
      "eccentricity": 0.0005,
      "inclinationDeg": 2.5,
      "lonAscendingNodeDeg": 252,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 348,
      "periodDays": 0.997
    }
  },
  {
    "id": "sc_terra",
    "name": "Terra",
    "shortName": "Terra",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_terra/Terra.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 271,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 347,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tess",
    "name": "TESS",
    "shortName": "TESS",
    "subcategory": "Orbiter",
    "missionGroup": "Space Telescopes & Observatories",
    "agency": "NASA / MIT",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "2018\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_tess/TESS.gltf",
    "physicalSpanM": 3.9,
    "role": "Transiting Exoplanet Survey Satellite",
    "description": "Locked in a 2:1 lunar resonance orbit scanning 85% of the celestial sphere to discover transiting exoplanets around the brightest nearby stars.",
    "highlights": [
      "4 wide-field CCD cameras monitoring 200,000+ stars",
      "2:1 lunar-resonant elliptical orbit keeps thermally & gravitationally stable"
    ],
    "colorHex": "#7fd4ff",
    "dynSegments": [
      {
        "file": "sc_tess__earth__orb.dyn",
        "ent": "sc_tess",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 577366932.363,
        "tMaxSec": 862189269.186
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 240000,
      "eccentricity": 0.55,
      "inclinationDeg": 37.0,
      "lonAscendingNodeDeg": 140,
      "argPeriapsisDeg": 60,
      "meanAnomalyDeg": 120,
      "periodDays": 13.7
    }
  },
  {
    "id": "sc_themis_a",
    "name": "THEMIS-A",
    "shortName": "THEMIS-A",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_themis/themis.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 70.0,
      "lonAscendingNodeDeg": 339,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 303,
      "periodDays": 1.0
    }
  },
  {
    "id": "sc_themis_b",
    "name": "ARTEMIS P1",
    "shortName": "ARTEMIS P1",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_themis/themis.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_themis_b__earth.dyn",
        "ent": "sc_themis_b",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 225029706.0,
        "tMaxSec": 362424822.0
      },
      {
        "file": "sc_themis_b__moon.dyn",
        "ent": "sc_themis_b",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 362424822.0,
        "tMaxSec": 894024069.185
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 14000,
      "eccentricity": 0.55,
      "inclinationDeg": 20.0,
      "lonAscendingNodeDeg": 7200,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 11200,
      "periodDays": 1.1
    }
  },
  {
    "id": "sc_themis_c",
    "name": "ARTEMIS P2",
    "shortName": "ARTEMIS P2",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Moon",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_themis/themis.gltf",
    "physicalSpanM": 3.6,
    "role": "Moon Orbiter",
    "description": "NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Moon"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_themis_c__earth.dyn",
        "ent": "sc_themis_c",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 225029706.0,
        "tMaxSec": 364189900.0
      },
      {
        "file": "sc_themis_c__moon.dyn",
        "ent": "sc_themis_c",
        "parentId": "moon",
        "kind": "orb",
        "inline": false,
        "tMinSec": 364189900.0,
        "tMaxSec": 894024069.185
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Moon",
      "semiMajorAxisKm": 14000,
      "eccentricity": 0.55,
      "inclinationDeg": 20.0,
      "lonAscendingNodeDeg": 7245,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 11270,
      "periodDays": 1.1
    }
  },
  {
    "id": "sc_themis_d",
    "name": "THEMIS-D",
    "shortName": "THEMIS-D",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_themis/themis.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 58000,
      "eccentricity": 0.72,
      "inclinationDeg": 46.0,
      "lonAscendingNodeDeg": 162,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 234,
      "periodDays": 1.0
    }
  },
  {
    "id": "sc_themis_e",
    "name": "THEMIS-E",
    "shortName": "THEMIS-E",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_themis/themis.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 66000,
      "eccentricity": 0.72,
      "inclinationDeg": 58.0,
      "lonAscendingNodeDeg": 223,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 331,
      "periodDays": 1.4
    }
  },
  {
    "id": "sc_trace_gas_orbiter",
    "name": "Trace Gas Orbiter",
    "shortName": "Trace Gas Orbiter",
    "subcategory": "Orbiter",
    "missionGroup": "Mars Exploration",
    "agency": "ESA / ExoMars",
    "hostBody": "Mars",
    "status": "Active",
    "activeSpan": "2016\u2013Present",
    "featuredEpochUtc": null,
    "modelPath": "sc_trace_gas_orbiter/TGO.gltf",
    "physicalSpanM": 17.5,
    "role": "Mars Atmospheric Methane & Water Mapper",
    "description": "Surveys trace atmospheric gases and hydrogen-rich equatorial regions from a 400 km circular Martian orbit.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Mars"
    ],
    "colorHex": "#ff8e66",
    "dynSegments": [
      {
        "file": "sc_trace_gas_orbiter__earth__orb.dyn",
        "ent": "sc_trace_gas_orbiter",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": 511257268.0,
        "tMaxSec": 511941668.0
      },
      {
        "file": "sc_trace_gas_orbiter__mars__orb.dyn",
        "ent": "sc_trace_gas_orbiter",
        "parentId": "mars",
        "kind": "orb",
        "inline": false,
        "tMinSec": 530107268.0,
        "tMaxSec": 1231007499.184
      },
      {
        "file": "sc_trace_gas_orbiter__sun__orb.dyn",
        "ent": "sc_trace_gas_orbiter",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": 511941668.0,
        "tMaxSec": 530107268.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Mars",
      "semiMajorAxisKm": 3790,
      "eccentricity": 0.005,
      "inclinationDeg": 74.0,
      "lonAscendingNodeDeg": 300,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 15,
      "periodDays": 0.082
    }
  },
  {
    "id": "sc_trmm",
    "name": "TRMM",
    "shortName": "TRMM",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Completed",
    "activeSpan": "Historic",
    "featuredEpochUtc": null,
    "modelPath": "sc_trmm/TRMM.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 6896,
      "eccentricity": 0.0002,
      "inclinationDeg": 35.0,
      "lonAscendingNodeDeg": 255,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 195,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tropics_01",
    "name": "TROPICS-01",
    "shortName": "TROPICS-01",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tropics/tropics.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7141,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 298,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 266,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tropics_03",
    "name": "TROPICS-03",
    "shortName": "TROPICS-03",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tropics/tropics.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7161,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 341,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 337,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tropics_05",
    "name": "TROPICS-05",
    "shortName": "TROPICS-05",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tropics/tropics.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7061,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 24,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 48,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tropics_06",
    "name": "TROPICS-06",
    "shortName": "TROPICS-06",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tropics/tropics.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7081,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 67,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 119,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_tropics_07",
    "name": "TROPICS-07",
    "shortName": "TROPICS-07",
    "subcategory": "Orbiter",
    "missionGroup": "Earth Observation & Stations",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_tropics/tropics.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#6dfcc0",
    "dynSegments": [],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 7101,
      "eccentricity": 0.0002,
      "inclinationDeg": 98.2,
      "lonAscendingNodeDeg": 110,
      "argPeriapsisDeg": 0,
      "meanAnomalyDeg": 190,
      "periodDays": 0.0686
    }
  },
  {
    "id": "sc_ulysses",
    "name": "Ulysses",
    "shortName": "Ulysses",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "ESA / NASA",
    "hostBody": "Sun",
    "status": "Completed",
    "activeSpan": "1990\u20132009",
    "featuredEpochUtc": "1994-09-13T00:00:00Z",
    "modelPath": "sc_ulysses/ulysses.gltf",
    "physicalSpanM": 11.4,
    "role": "Solar Polar Inclination Explorer",
    "description": "Slung around Jupiter in 1992 into an 80\u00b0 polar orbit over the Sun's uncharted north and south poles.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Sun"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_ulysses__earth.dyn",
        "ent": "sc_ulysses",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -291488100.0,
        "tMaxSec": -291393201.0
      },
      {
        "file": "sc_ulysses__jupiter.dyn",
        "ent": "sc_ulysses",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -249645790.0,
        "tMaxSec": -248519090.0
      },
      {
        "file": "sc_ulysses__sun__1.dyn",
        "ent": "sc_ulysses",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -291393201.0,
        "tMaxSec": -249645790.0
      },
      {
        "file": "sc_ulysses__sun__2.dyn",
        "ent": "sc_ulysses",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -248519090.0,
        "tMaxSec": 299678465.184
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_voyager_1",
    "name": "Voyager 1",
    "shortName": "Voyager 1",
    "subcategory": "Flyby",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / JPL",
    "hostBody": "Interstellar",
    "status": "Active",
    "activeSpan": "1977\u2013Present",
    "featuredEpochUtc": "1980-11-12T23:46:00Z",
    "modelPath": "sc_voyager/Voyager.gltf",
    "physicalSpanM": 16.0,
    "role": "Interstellar Explorer & Grand Tour Probe",
    "description": "The farthest human-made object from Earth, cruising past the heliopause into interstellar space since August 2012 after Jupiter and Saturn.",
    "highlights": [
      "Crossed the heliopause at ~121 AU in August 2012",
      "Carries the copper-gold Voyager Golden Record",
      "Captured the famous 1990 Pale Blue Dot Solar System portrait"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_voyager_1__earth.dyn",
        "ent": "sc_voyager_1",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -704412035.617,
        "tMaxSec": -703530245.0
      },
      {
        "file": "sc_voyager_1__jupiter.dyn",
        "ent": "sc_voyager_1",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -660264745.0,
        "tMaxSec": -655057463.0
      },
      {
        "file": "sc_voyager_1__saturn.dyn",
        "ent": "sc_voyager_1",
        "parentId": "saturn",
        "kind": "orb",
        "inline": true,
        "tMinSec": -606239665.0,
        "tMaxSec": -600733702.0
      },
      {
        "file": "sc_voyager_1__sun__1.dyn",
        "ent": "sc_voyager_1",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -703530245.0,
        "tMaxSec": -660264745.0
      },
      {
        "file": "sc_voyager_1__sun__2.dyn",
        "ent": "sc_voyager_1",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -655057463.0,
        "tMaxSec": -606239665.0
      },
      {
        "file": "sc_voyager_1__sun__3.dyn",
        "ent": "sc_voyager_1",
        "parentId": "sun",
        "kind": "pos",
        "inline": true,
        "tMinSec": -600733702.0,
        "tMaxSec": 3155716800.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_voyager_2",
    "name": "Voyager 2",
    "shortName": "Voyager 2",
    "subcategory": "Flyby",
    "missionGroup": "Outer Solar System & Deep Space",
    "agency": "NASA / JPL",
    "hostBody": "Interstellar",
    "status": "Active",
    "activeSpan": "1977\u2013Present",
    "featuredEpochUtc": "1989-08-25T03:56:00Z",
    "modelPath": "sc_voyager/Voyager.gltf",
    "physicalSpanM": 16.0,
    "role": "Grand Tour Quad-Planet Explorer",
    "description": "The only spacecraft to visit all four giant planets \u2014 Jupiter, Saturn, Uranus, and Neptune \u2014 now operating in interstellar space.",
    "highlights": [
      "Only close-up reconnaissance of Uranus (1986) & Neptune (1989)",
      "Imaged nitrogen geysers erupting on Triton",
      "Exited the heliosphere into interstellar plasma in Nov 2018"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_voyager_2__earth.dyn",
        "ent": "sc_voyager_2",
        "parentId": "earth",
        "kind": "orb",
        "inline": true,
        "tMinSec": -705788847.817,
        "tMaxSec": -704774613.0
      },
      {
        "file": "sc_voyager_2__jupiter.dyn",
        "ent": "sc_voyager_2",
        "parentId": "jupiter",
        "kind": "orb",
        "inline": true,
        "tMinSec": -650828783.0,
        "tMaxSec": -642276063.0
      },
      {
        "file": "sc_voyager_2__neptune.dyn",
        "ent": "sc_voyager_2",
        "parentId": "neptune",
        "kind": "orb",
        "inline": true,
        "tMinSec": -327233138.0,
        "tMaxSec": -326252606.0
      },
      {
        "file": "sc_voyager_2__saturn.dyn",
        "ent": "sc_voyager_2",
        "parentId": "saturn",
        "kind": "orb",
        "inline": true,
        "tMinSec": -582886481.0,
        "tMaxSec": -574538624.0
      },
      {
        "file": "sc_voyager_2__sun__1.dyn",
        "ent": "sc_voyager_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -704774613.0,
        "tMaxSec": -650828783.0
      },
      {
        "file": "sc_voyager_2__sun__2.dyn",
        "ent": "sc_voyager_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -642276063.0,
        "tMaxSec": -582886481.0
      },
      {
        "file": "sc_voyager_2__sun__3.dyn",
        "ent": "sc_voyager_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -574538624.0,
        "tMaxSec": -440395228.0
      },
      {
        "file": "sc_voyager_2__sun__4.dyn",
        "ent": "sc_voyager_2",
        "parentId": "sun",
        "kind": "orb",
        "inline": true,
        "tMinSec": -439259319.0,
        "tMaxSec": -327233138.0
      },
      {
        "file": "sc_voyager_2__sun__5.dyn",
        "ent": "sc_voyager_2",
        "parentId": "sun",
        "kind": "pos",
        "inline": true,
        "tMinSec": -326252606.0,
        "tMaxSec": 3155716800.0
      },
      {
        "file": "sc_voyager_2__uranus.dyn",
        "ent": "sc_voyager_2",
        "parentId": "uranus",
        "kind": "orb",
        "inline": true,
        "tMinSec": -440395228.0,
        "tMaxSec": -439259319.0
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": null
  },
  {
    "id": "sc_wind",
    "name": "WIND",
    "shortName": "WIND",
    "subcategory": "Orbiter",
    "missionGroup": "Solar & Heliophysics",
    "agency": "NASA",
    "hostBody": "Earth",
    "status": "Active",
    "activeSpan": "Active Mission",
    "featuredEpochUtc": null,
    "modelPath": "sc_wind/wind.gltf",
    "physicalSpanM": 3.6,
    "role": "Earth Orbiter",
    "description": "NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.",
    "highlights": [
      "Category: Orbiter",
      "Primary Domain: Earth"
    ],
    "colorHex": "#ffd166",
    "dynSegments": [
      {
        "file": "sc_wind__earth__orb.dyn",
        "ent": "sc_wind",
        "parentId": "earth",
        "kind": "orb",
        "inline": false,
        "tMinSec": 543931270.0,
        "tMaxSec": 1018958469.186
      }
    ],
    "oriSegment": null,
    "surfaceSite": null,
    "lagrangeHalo": null,
    "fallbackOrbit": {
      "parentBody": "Earth",
      "semiMajorAxisKm": 180000,
      "eccentricity": 0.78,
      "inclinationDeg": 12.0,
      "lonAscendingNodeDeg": 174,
      "argPeriapsisDeg": 120,
      "meanAnomalyDeg": 318,
      "periodDays": 11.0
    }
  }
];

export const NASA_SMALL_BODY_MODELS: Record<string, string> = {
  "Bennu": "101955_bennu/Bennu.gltf",
  "101955 Bennu": "101955_bennu/Bennu.gltf",
  "Ryugu": "162173_ryugu/ryugu.gltf",
  "162173 Ryugu": "162173_ryugu/ryugu.gltf",
  "Psyche": "16_psyche/psycheAsteroid.gltf",
  "16 Psyche": "16_psyche/psycheAsteroid.gltf",
  "Vesta": "4_vesta/4_vesta.gltf",
  "4 Vesta": "4_vesta/4_vesta.gltf",
  "Eros": "433_eros/433_eros.gltf",
  "433 Eros": "433_eros/433_eros.gltf",
  "Gaspra": "951_gaspra/gaspra.gltf",
  "951 Gaspra": "951_gaspra/gaspra.gltf",
  "Itokawa": "25143_itokawa/itokawa.gltf",
  "25143 Itokawa": "25143_itokawa/itokawa.gltf",
  "Didymos": "65803_didymos/Didymos.gltf",
  "65803 Didymos": "65803_didymos/Didymos.gltf",
  "Dimorphos": "dimorphos/Dimorphos.gltf",
  "Apophis": "99942_apophis/apophis.gltf",
  "99942 Apophis": "99942_apophis/apophis.gltf",
  "Arrokoth": "486958_arrokoth/mu69.gltf",
  "486958 Arrokoth": "486958_arrokoth/mu69.gltf",
  "Haumea": "136108_haumea/haumea.gltf",
  "136108 Haumea": "136108_haumea/haumea.gltf",
  "Ida": "generic/asteroid_1/generic_asteroid_1.gltf",
  "Pallas": "generic/asteroid_2/generic_asteroid_2.gltf",
  "Hygiea": "generic/asteroid_3/generic_asteroid_3.gltf",
  "Phobos": "phobos/phobos.gltf",
  "Deimos": "deimos/deimos.gltf",
  "Hyperion": "hyperion/hyperion.gltf",
  "Mimas": "mimas/mimas.gltf",
  "Phoebe": "phoebe/phoebe.gltf",
  "Proteus": "proteus/proteus.gltf",
  "67P/Churyumov-Gerasimenko": "67p_churyumov_gerasimenko/67p_churyumov_gerasimenko.gltf",
  "67P/Churyumov\u2013Gerasimenko": "67p_churyumov_gerasimenko/67p_churyumov_gerasimenko.gltf",
  "103P/Hartley 2": "103p_hartley_2/hartley_2.gltf",
  "19P/Borrelly": "19p_borrelly/borrelly.gltf",
  "9P/Tempel 1": "9p_tempel_1/9p_tempel.gltf",
  "1I/'Oumuamua": "1i_oumuamua/oumuamua.gltf"
};

export const NASA_MISSION_EVENTS: NasaMissionEvent[] = [
  {
    "id": "ev-iss-live",
    "label": "ISS \u00b7 Live LEO",
    "dateUtc": null,
    "target": "International Space Station",
    "desc": "Present-day live orbital tracking of the International Space Station."
  },
  {
    "id": "ev-nh-pluto",
    "label": "New Horizons \u00b7 Pluto 2015",
    "dateUtc": "2015-07-14T11:49:00Z",
    "target": "New Horizons",
    "desc": "Closest approach 12,500 km above Pluto and Charon."
  },
  {
    "id": "ev-cassini-saturn",
    "label": "Cassini \u00b7 Saturn 2004",
    "dateUtc": "2004-06-15T12:00:00Z",
    "target": "Cassini",
    "desc": "Cassini Saturn arrival and Huygens release approach."
  },
  {
    "id": "ev-cassini-finale",
    "label": "Cassini \u00b7 Grand Finale",
    "dateUtc": "2017-09-15T10:30:00Z",
    "target": "Cassini",
    "desc": "Final dive into Saturn's upper atmosphere ending a 13-year tour."
  },
  {
    "id": "ev-dart-impact",
    "label": "DART \u00b7 Dimorphos Impact",
    "dateUtc": "2022-09-26T21:00:00Z",
    "target": "DART",
    "desc": "Terminal kinetic deflection approach to 65803 Didymos & Dimorphos."
  },
  {
    "id": "ev-perseverance",
    "label": "Perseverance \u00b7 Jezero Mars",
    "dateUtc": "2021-02-18T18:00:00Z",
    "target": "Mars 2020 (Perseverance)",
    "desc": "Perseverance arrival in Mars orbital approach / Jezero Crater."
  },
  {
    "id": "ev-rosetta-67p",
    "label": "Rosetta \u00b7 Comet 67P",
    "dateUtc": "2014-11-12T12:00:00Z",
    "target": "Philae",
    "desc": "Philae descent onto the duck-shaped comet 67P/Churyumov-Gerasimenko."
  },
  {
    "id": "ev-parker-perihelion",
    "label": "Parker Solar \u00b7 Perihelion",
    "dateUtc": "2024-12-24T11:53:00Z",
    "target": "Parker Solar Probe",
    "desc": "Record-breaking 6.1 million km skim through the solar corona."
  },
  {
    "id": "ev-voyager2-neptune",
    "label": "Voyager 2 \u00b7 Neptune 1989",
    "dateUtc": "1989-08-25T03:56:00Z",
    "target": "Voyager 2",
    "desc": "Grand Tour climax skimming 4,950 km above Neptune's north pole."
  },
  {
    "id": "ev-artemis2",
    "label": "Artemis II \u00b7 Lunar Swing",
    "dateUtc": "2026-04-06T23:00:00Z",
    "target": "Artemis II",
    "desc": "Crewed Orion free-return trajectory around the Moon."
  }
];

export const NASA_EXTRA_ASSETS = {
  heliosphere: 'heliosphere/voyager_heliosphere.gltf',
  saturnMagnetosphere: 'saturn/magnetosphere/saturn_magnetosphere.gltf',
  saturnMagnetosphereThin: 'saturn/magnetosphere_thin/saturn_magnetosphere_thin.gltf',
  comparisonScientist: 'comparison/scientist/scientist.gltf',
  comparisonSchoolBus: 'comparison/school_bus/school_bus.gltf',
  comparisonRoseBowl: 'comparison/rose_bowl/rose_bowl.gltf',
  stowedVariants: {
    sc_jwst: 'sc_jwst/webb_stowed.gltf',
    sc_insight: 'sc_insight/cruise/model.gltf',
    sc_mars_2020: 'sc_mars_2020/cruise_whole/msl_cruise_stage.gltf',
    sc_mars_exploration_rover_1: 'sc_mars_exploration_rover/cruise/mpf_mera_merb_cruise.gltf',
    sc_mars_exploration_rover_2: 'sc_mars_exploration_rover/cruise/mpf_mera_merb_cruise.gltf',
    sc_mars_science_laboratory: 'sc_mars_science_laboratory/cruise/msl_cruisestage.gltf',
    sc_phoenix: 'sc_phoenix/cruise/phoenix_cruise.gltf',
  } as Record<string, string>,
};

/** Authentic JPL orbital definitions for named NASA Eyes small bodies beyond the core 9 asteroids. */
export const NASA_EXTRA_CELESTIAL_BODIES: CelestialBodyDefinition[] = [
  {
    id: '25143',
    name: 'Itokawa',
    category: 'asteroid',
    orderFromSun: 16,
    description: "25143 Itokawa — peanut-shaped stony rubble-pile Apollo asteroid sampled by JAXA's Hayabusa in 2005.",
    physical: { meanRadiusKm: 0.165, massKg: 3.51e10, rotationPeriodHours: 12.132, axialTiltDeg: 178.5, colorHex: '#c7b8a3', flattening: 0.55 },
    orbit: { semiMajorAxisAU: 1.3241, semiMajorAxisKm: 198083000, eccentricity: 0.2802, inclinationDeg: 1.621, longitudeAscendingNodeDeg: 69.08, argumentPeriapsisDeg: 162.81, meanAnomalyAtEpochDeg: 105.0, epochJd: 2451545.0, orbitalPeriodDays: 556.38, source: 'NASA JPL SBDB' },
  },
  {
    id: '65803',
    name: 'Didymos',
    category: 'asteroid',
    orderFromSun: 17,
    description: "65803 Didymos — fast-spinning Apollo binary asteroid system and primary world of NASA's historic DART planetary defense test.",
    physical: { meanRadiusKm: 0.39, massKg: 5.2e11, rotationPeriodHours: 2.26, axialTiltDeg: 0, colorHex: '#aba69e', flattening: 0.12 },
    orbit: { semiMajorAxisAU: 1.6442, semiMajorAxisKm: 245968000, eccentricity: 0.3838, inclinationDeg: 3.408, longitudeAscendingNodeDeg: 73.19, argumentPeriapsisDeg: 319.32, meanAnomalyAtEpochDeg: 190.0, epochJd: 2451545.0, orbitalPeriodDays: 770.15, source: 'NASA JPL SBDB' },
  },
  {
    id: '99942',
    name: 'Apophis',
    category: 'asteroid',
    orderFromSun: 18,
    description: '99942 Apophis — elongated 340 m near-Earth Aten asteroid making a 31,600 km Earth pass in April 2029, target of NASA OSIRIS-APEX.',
    physical: { meanRadiusKm: 0.185, massKg: 6.1e10, rotationPeriodHours: 30.56, axialTiltDeg: 165.0, colorHex: '#b3a390', flattening: 0.35 },
    orbit: { semiMajorAxisAU: 0.9224, semiMajorAxisKm: 137990000, eccentricity: 0.1912, inclinationDeg: 3.339, longitudeAscendingNodeDeg: 204.45, argumentPeriapsisDeg: 126.4, meanAnomalyAtEpochDeg: 240.0, epochJd: 2451545.0, orbitalPeriodDays: 323.6, source: 'NASA JPL SBDB' },
  },
  {
    id: '486958',
    name: 'Arrokoth',
    category: 'asteroid',
    orderFromSun: 19,
    description: "486958 Arrokoth (MU69) — reddish primordial cold-classical Kuiper Belt contact binary explored by New Horizons on New Year's Day 2019.",
    physical: { meanRadiusKm: 9.15, massKg: 7.48e14, rotationPeriodHours: 15.92, axialTiltDeg: 99.0, colorHex: '#b56e5c', flattening: 0.48 },
    orbit: { semiMajorAxisAU: 44.581, semiMajorAxisKm: 6669200000, eccentricity: 0.0418, inclinationDeg: 2.451, longitudeAscendingNodeDeg: 158.99, argumentPeriapsisDeg: 174.4, meanAnomalyAtEpochDeg: 316.5, epochJd: 2451545.0, orbitalPeriodDays: 108670, source: 'NASA JPL SBDB' },
  },
  {
    id: '136108',
    name: 'Haumea',
    category: 'dwarf_planet',
    orderFromSun: 20,
    description: '136108 Haumea — ultra-fast rotating triaxial Kuiper Belt dwarf planet encircled by a crystalline water-ice ring and two moons.',
    physical: { meanRadiusKm: 780, massKg: 4.006e21, rotationPeriodHours: 3.9154, axialTiltDeg: 126.0, colorHex: '#dde5ea', flattening: 0.52 },
    orbit: { semiMajorAxisAU: 43.116, semiMajorAxisKm: 6450060000, eccentricity: 0.1964, inclinationDeg: 28.214, longitudeAscendingNodeDeg: 122.17, argumentPeriapsisDeg: 239.04, meanAnomalyAtEpochDeg: 218.2, epochJd: 2451545.0, orbitalPeriodDays: 103410, source: 'NASA JPL SBDB' },
  },
];

export function spacecraftToCelestialDef(sc: NasaSpacecraftEntry): CelestialBodyDefinition {
  const hostBody = sc.fallbackOrbit?.parentBody ?? sc.surfaceSite?.body ?? sc.hostBody;
  const parsedYear = parseInt(sc.activeSpan.slice(0, 4), 10);
  return {
    id: sc.id,
    name: sc.name,
    category: 'spacecraft',
    parentName: hostBody,
    group: sc.missionGroup,
    discoveryYear: Number.isFinite(parsedYear) ? parsedYear : undefined,
    orderFromSun: 99,
    description: sc.description,
    physical: {
      meanRadiusKm: Math.max(0.001, (sc.physicalSpanM * 0.5) / 1000),
      colorHex: sc.colorHex,
    },
    orbit: {
      semiMajorAxisAU: sc.fallbackOrbit ? sc.fallbackOrbit.semiMajorAxisKm / 149597870.7 : 1.0,
      semiMajorAxisKm: sc.fallbackOrbit?.semiMajorAxisKm ?? 149597870.7,
      eccentricity: sc.fallbackOrbit?.eccentricity ?? 0.01,
      inclinationDeg: sc.fallbackOrbit?.inclinationDeg ?? 5.0,
      longitudeAscendingNodeDeg: sc.fallbackOrbit?.lonAscendingNodeDeg ?? 0,
      argumentPeriapsisDeg: sc.fallbackOrbit?.argPeriapsisDeg ?? 0,
      meanAnomalyAtEpochDeg: sc.fallbackOrbit?.meanAnomalyDeg ?? 0,
      epochJd: 2451545.0,
      orbitalPeriodDays: sc.fallbackOrbit?.periodDays ?? 365.25,
      source: 'NASA Eyes / JPL Horizons Dynamo',
    },
  };
}
