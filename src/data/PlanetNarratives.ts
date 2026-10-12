export interface MissionInfo {
  name: string;
  year: string;
  agency: string;
  role: string;
}

export interface PlanetNarrative {
  name: string;
  category: 'star' | 'planet' | 'dwarf_planet' | 'moon' | 'asteroid';
  eyebrow: string;
  accentColor: string;
  eyebrowColor: string;
  distanceAU: string;
  textureThumb: string;
  monographText: string;
  extendedLore: string;
  missions: MissionInfo[];
}

export const PLANET_NARRATIVES: Record<string, PlanetNarrative> = {
  Mercury: {
    name: 'Mercury',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#E8927C',
    eyebrowColor: '#fabfad',
    distanceAU: '0.39 AU',
    textureThumb: 'textures/2k_mercury.jpg',
    monographText:
      'THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.',
    extendedLore:
      'Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet\'s total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.',
    missions: [
      { name: 'Mariner 10', year: '1974–1975', agency: 'NASA', role: 'First flybys; mapped 45% of surface' },
      { name: 'MESSENGER', year: '2011–2015', agency: 'NASA', role: 'First orbiter; discovered polar water ice in permanently shadowed craters' },
      { name: 'BepiColombo', year: '2025–2026', agency: 'ESA / JAXA', role: 'Dual orbiter study of magnetosphere and exosphere' }
    ]
  },
  Venus: {
    name: 'Venus',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#b45d15',
    eyebrowColor: '#e58e45',
    distanceAU: '0.723 AU',
    textureThumb: 'textures/2k_venus_atmosphere.jpg',
    monographText:
      'NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.',
    extendedLore:
      'Venus is Earth\'s twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth\'s sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.',
    missions: [
      { name: 'Venera 7', year: '1970', agency: 'Soviet Union', role: 'First human spacecraft to softly land and transmit data from another planet' },
      { name: 'Magellan', year: '1990–1994', agency: 'NASA', role: 'Global radar mapping revealing extensive volcanism and lava channels' },
      { name: 'Akatsuki', year: '2015–Present', agency: 'JAXA', role: 'Atmospheric super-rotation and cloud dynamics investigation' }
    ]
  },
  Earth: {
    name: 'Earth',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#26daaa',
    eyebrowColor: '#7bf0d0',
    distanceAU: '1.000 AU',
    textureThumb: 'textures/2k_earth_daymap.jpg',
    monographText:
      'OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS CRUST.',
    extendedLore:
      'Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.',
    missions: [
      { name: 'Apollo Program', year: '1961–1972', agency: 'NASA', role: 'Human lunar landings; transformed humanity\'s ecological perspective of Earth' },
      { name: 'Terra & Aqua', year: '1999–Present', agency: 'NASA', role: 'Comprehensive global climate and ocean monitoring system' },
      { name: 'Copernicus Sentinel', year: '2014–Present', agency: 'ESA', role: 'Constellation observing biosphere, ice sheets, and atmosphere' }
    ]
  },
  Mars: {
    name: 'Mars',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#e55f45',
    eyebrowColor: '#fca595',
    distanceAU: '1.524 AU',
    textureThumb: 'textures/2k_mars.jpg',
    monographText:
      'THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.',
    extendedLore:
      'Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.',
    missions: [
      { name: 'Viking 1 & 2', year: '1976', agency: 'NASA', role: 'First successful long-duration Mars surface landers and biological tests' },
      { name: 'Curiosity', year: '2012–Present', agency: 'NASA', role: 'Discovered ancient habitable lacustrine environments in Gale Crater' },
      { name: 'Perseverance', year: '2021–Present', agency: 'NASA', role: 'Searching for ancient microbial biosignatures and caching core samples' }
    ]
  },
  Jupiter: {
    name: 'Jupiter',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#f59e0b',
    eyebrowColor: '#fcd34d',
    distanceAU: '5.203 AU',
    textureThumb: 'textures/2k_jupiter.jpg',
    monographText:
      'THE TITAN OF OUR SOLAR SYSTEM, WITH MORE MASS THAN ALL OTHER WORLDS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND 95 KNOWN SATELLITES.',
    extendedLore:
      'Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.',
    missions: [
      { name: 'Voyager 1 & 2', year: '1979', agency: 'NASA', role: 'Discovered Jovian rings and active volcanism on Io' },
      { name: 'Galileo', year: '1995–2003', agency: 'NASA', role: 'First orbiter; gathered initial evidence of subsurface ocean on Europa' },
      { name: 'Juno', year: '2016–Present', agency: 'NASA', role: 'Mapping gravitational anomalies and deep atmospheric water abundance' }
    ]
  },
  Saturn: {
    name: 'Saturn',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#b29d81',
    eyebrowColor: '#d4c5b0',
    distanceAU: '9.539 AU',
    textureThumb: 'textures/2k_saturn.jpg',
    monographText:
      'A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.',
    extendedLore:
      'Saturn\'s ring system spans up to 282,000 km in width yet is astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Composed of 99% pure water ice particles ranging from dust grains to boulder sizes, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.',
    missions: [
      { name: 'Pioneer 11', year: '1979', agency: 'NASA', role: 'First close encounter with Saturn and discovery of the F Ring' },
      { name: 'Cassini-Huygens', year: '2004–2017', agency: 'NASA / ESA / ASI', role: 'Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes' },
      { name: 'Dragonfly', year: 'Launching 2028', agency: 'NASA', role: 'Rotorcraft lander to explore prebiotic chemistry on Titan' }
    ]
  },
  Uranus: {
    name: 'Uranus',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#8dcdd8',
    eyebrowColor: '#b3e8f0',
    distanceAU: '19.18 AU',
    textureThumb: 'textures/2k_uranus.jpg',
    monographText:
      'AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT ITS ROTATION AXIS POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS IN COMPLETE FREEZE.',
    extendedLore:
      'With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.',
    missions: [
      { name: 'Voyager 2', year: '1986', agency: 'NASA', role: 'Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings' },
      { name: 'Uranus Orbiter & Probe', year: 'Proposed 2030s', agency: 'NASA Decadal', role: 'Flagship mission concept prioritized to explore ice giant interiors' }
    ]
  },
  Neptune: {
    name: 'Neptune',
    category: 'planet',
    eyebrow: 'PLANET',
    accentColor: '#4f83e2',
    eyebrowColor: '#7ca8ff',
    distanceAU: '30.06 AU',
    textureThumb: 'textures/2k_neptune.jpg',
    monographText:
      'THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.',
    extendedLore:
      'Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus\'s orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.',
    missions: [
      { name: 'Voyager 2', year: '1989', agency: 'NASA', role: 'Close flyby; detected the Great Dark Spot and geysers on Triton' }
    ]
  },
  Pluto: {
    name: 'Pluto',
    category: 'dwarf_planet',
    eyebrow: 'DWARF PLANET',
    accentColor: '#FF8732',
    eyebrowColor: '#ffa463',
    distanceAU: '39.48 AU',
    textureThumb: 'textures/2k_moon.jpg',
    monographText:
      'SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.',
    extendedLore:
      'Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.',
    missions: [
      { name: 'New Horizons', year: '2015', agency: 'NASA', role: 'Historic historic flyby capturing high-resolution imagery of Tombaugh Regio' }
    ]
  },
  Sun: {
    name: 'Sun',
    category: 'star',
    eyebrow: 'STAR',
    accentColor: '#ffaa33',
    eyebrowColor: '#ffe4a0',
    distanceAU: '0.000 AU',
    textureThumb: 'textures/2k_sun.jpg',
    monographText:
      'THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.',
    extendedLore:
      'Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.',
    missions: [
      { name: 'SOHO', year: '1995–Present', agency: 'ESA / NASA', role: 'Continuous monitoring of helioseismology and coronal mass ejections' },
      { name: 'Parker Solar Probe', year: '2018–Present', agency: 'NASA', role: 'Closest spacecraft to Sun, diving directly through the outer corona' },
      { name: 'Solar Orbiter', year: '2020–Present', agency: 'ESA / NASA', role: 'Capturing the first close-up images of the Sun\'s polar regions' }
    ]
  }
};

export function getPlanetNarrative(name: string): PlanetNarrative {
  if (PLANET_NARRATIVES[name]) {
    return PLANET_NARRATIVES[name];
  }

  // Fallback for moons and minor bodies
  return {
    name,
    category: 'moon',
    eyebrow: 'CELESTIAL BODY',
    accentColor: '#93c5fd',
    eyebrowColor: '#bfdbfe',
    distanceAU: '—',
    textureThumb: 'textures/2k_moon.jpg',
    monographText: `${name.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,
    extendedLore: `${name} is catalogued under the NASA JPL DE440 ephemeris model.`,
    missions: []
  };
}
