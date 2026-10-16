/**
 * Constellation stick figures for nine bright constellations and asterisms, as Hipparcos (HIP) pairs.
 * A curated subset, not the full set of 88. Shared by the 3D starfield and the technical report.
 */
export const CONSTELLATION_EDGES: Array<[number, number]> = [
  // --- URSA MAJOR (BIG DIPPER) ---
  [54061, 53910], // Dubhe - Merak (Pointers)
  [53910, 58001], // Merak - Phecda
  [58001, 59774], // Phecda - Megrez
  [59774, 54061], // Megrez - Dubhe (Bowl complete)
  [59774, 62956], // Megrez - Alioth (Handle start)
  [62956, 65378], // Alioth - Mizar
  [65378, 67301], // Mizar - Alkaid

  // --- ORION ---
  [27989, 25336], // Betelgeuse - Bellatrix (shoulders)
  [27989, 26207], // Betelgeuse - Meissa (head)
  [25336, 26207], // Bellatrix - Meissa
  [27989, 26727], // Betelgeuse - Alnitak
  [25336, 25930], // Bellatrix - Mintaka
  [25930, 26311], // Mintaka - Alnilam (Belt)
  [26311, 26727], // Alnilam - Alnitak (Belt)
  [26727, 27366], // Alnitak - Saiph
  [25930, 24436], // Mintaka - Rigel

  // --- CASSIOPEIA ('W') ---
  [746, 3179],   // Caph - Schedar
  [3179, 4427],  // Schedar - Navi (Gamma Cas, HIP 4427)
  [4427, 6686],  // Navi - Ruchbah
  [6686, 8886],  // Ruchbah - Segin

  // --- CRUX (SOUTHERN CROSS) ---
  [60718, 61084], // Acrux - Gacrux (Major axis)
  [62434, 59747], // Becrux/Mimosa - Imai (Delta Cru, minor axis)

  // --- CYGNUS (NORTHERN CROSS) ---
  [102098, 100453], // Deneb - Sadr
  [100453, 95947],  // Sadr - Albireo
  [102488, 100453], // Gienah - Sadr
  [100453, 97165],  // Sadr - Rukh (Delta Cyg)

  // --- LEO ---
  [49669, 50583], // Regulus - Algieba
  [50583, 50335], // Algieba - Adhafera
  [50335, 48455], // Adhafera - Rasalas (Sickle)
  [50583, 54872], // Algieba - Zosma
  [54872, 57632], // Zosma - Denebola
  [57632, 54879], // Denebola - Chertan
  [54879, 49669], // Chertan - Regulus

  // --- SCORPIUS ---
  [80763, 78820], // Antares - Dschubba
  [78820, 78401], // Dschubba - Graffias
  [80763, 82396], // Antares - Wei
  [82396, 86228], // Wei - Sargas
  [86228, 85927], // Sargas - Shaula

  // --- CANIS MAJOR ---
  [32349, 30324], // Sirius - Murzim
  [32349, 33579], // Sirius - Adhara
  [33579, 34444], // Adhara - Wezen
  [34444, 35904], // Wezen - Aludra

  // --- LYRA ---
  [91262, 91971], // Vega - Zeta1 Lyr
  [91971, 92420], // Zeta1 Lyr - Sheliak
  [92420, 93194], // Sheliak - Sulafat
  [93194, 92791], // Sulafat - Delta2 Lyr
  [92791, 91971], // Delta2 Lyr - Zeta1 Lyr
];
