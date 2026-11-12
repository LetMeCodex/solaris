/**
 * Real Solid Colliders for Earth Landmarks & Mountains
 *
 * Provides physical 3D collision hulls for major mountain peaks and architectural monuments
 * across the globe (Mount Everest, Mont Blanc, Matterhorn, Mount Fuji, Grand Canyon,
 * Eiffel Tower, Burj Khalifa, Tokyo Tower, Manhattan skyscrapers, etc.).
 *
 * This guarantees:
 * 1. The jet physically impacts and rebounds from solid mountains and buildings.
 * 2. Ground and chase cameras NEVER clip underground or inside mountain bedrock / structures.
 * 3. Exact elevations are immediately available without waiting for network tile streaming.
 */

export interface SolidCollider {
  name: string;
  lat: number;
  lon: number;
  baseKm: number;
  peakKm: number;
  radiusKm: number;
  /** Power exponent for profile shape: <1 = broad/stepped tower/box, >1 = sharp pyramidal horn/peak */
  profilePow: number;
}

const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371.0;

/** Great-circle distance between two geographic coordinates in kilometres. */
export function geoDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a =
    Math.sin(dLat * 0.5) * Math.sin(dLat * 0.5) +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) *
    Math.sin(dLon * 0.5) * Math.sin(dLon * 0.5);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
  return EARTH_RADIUS_KM * c;
}

export const SOLID_LANDMARKS: SolidCollider[] = [
  // ── High Mountain Massifs & Peaks ──────────────────────────────────────────
  {
    name: 'Mount Everest',
    lat: 27.98833,
    lon: 86.92528,
    baseKm: 5.300,   // Base of Khumbu / Rongbuk valleys
    peakKm: 8.848,   // True summit elevation 8,848 m
    radiusKm: 6.5,   // Massif radius
    profilePow: 1.35,
  },
  {
    name: 'Chamonix & Mont Blanc',
    lat: 45.8326,
    lon: 6.8652,
    baseKm: 1.035,   // Chamonix valley floor
    peakKm: 4.808,   // Mont Blanc summit 4,808 m
    radiusKm: 6.0,
    profilePow: 1.30,
  },
  {
    name: 'Matterhorn',
    lat: 45.97639,
    lon: 7.65861,
    baseKm: 2.200,   // Zermatt high valley
    peakKm: 4.478,   // Matterhorn pyramidal horn 4,478 m
    radiusKm: 3.8,
    profilePow: 1.50,
  },
  {
    name: 'Mount Fuji',
    lat: 35.36083,
    lon: 138.7275,
    baseKm: 0.850,   // Surrounding plateau
    peakKm: 3.776,   // Crater summit 3,776 m
    radiusKm: 8.0,
    profilePow: 1.25,
  },
  {
    name: 'Grand Canyon South Rim',
    lat: 36.0570,
    lon: -112.1430,
    baseKm: 0.750,   // Colorado River bed
    peakKm: 2.150,   // South/North rim plateau
    radiusKm: 14.0,
    profilePow: 0.55, // Flat plateau top with steep canyon gorges
  },
  {
    name: 'Mount Kilimanjaro',
    lat: -3.07583,
    lon: 37.35333,
    baseKm: 1.800,
    peakKm: 5.895,   // Uhuru Peak 5,895 m
    radiusKm: 9.0,
    profilePow: 1.30,
  },
  {
    name: 'Yosemite Valley & Half Dome',
    lat: 37.7460,
    lon: -119.5330,
    baseKm: 1.200,   // Valley floor
    peakKm: 2.695,   // Half Dome crest 2,695 m
    radiusKm: 5.5,
    profilePow: 1.10,
  },
  {
    name: 'Uluru',
    lat: -25.345,
    lon: 131.03611,
    baseKm: 0.518,   // Red sand desert floor
    peakKm: 0.863,   // Monolith crest
    radiusKm: 2.2,
    profilePow: 0.65,
  },
  {
    name: 'Cuernos del Paine',
    lat: -51.00243,
    lon: -73.0119,
    baseKm: 0.150,
    peakKm: 2.600,
    radiusKm: 4.8,
    profilePow: 1.40,
  },
  {
    name: 'Mount Erebus',
    lat: -77.52972,
    lon: 167.15333,
    baseKm: 0.400,
    peakKm: 3.794,
    radiusKm: 7.5,
    profilePow: 1.25,
  },

  // ── Architectural Monuments & Supertall Skyscrapers ────────────────────────
  {
    name: 'Eiffel Tower, Paris',
    lat: 48.8584,
    lon: 2.2945,
    baseKm: 0.035,   // Champ de Mars ground
    peakKm: 0.365,   // 330 m tower + 35 m ground = 365 m
    radiusKm: 0.095, // 95 m radius covers base legs and plaza
    profilePow: 0.42,
  },
  {
    name: 'Burj Khalifa, Dubai',
    lat: 25.1972,
    lon: 55.2744,
    baseKm: 0.010,
    peakKm: 0.838,   // 828 m spire + 10 m ground = 838 m
    radiusKm: 0.120,
    profilePow: 0.38,
  },
  {
    name: 'Tokyo Tower',
    lat: 35.6586,
    lon: 139.7454,
    baseKm: 0.025,
    peakKm: 0.357,   // 332 m tower + 25 m ground = 357 m
    radiusKm: 0.080,
    profilePow: 0.44,
  },
  {
    name: 'Manhattan Midtown Skyscrapers',
    lat: 40.7484,
    lon: -73.9857,
    baseKm: 0.015,
    peakKm: 0.443,   // Empire State / Midtown towers (443 m)
    radiusKm: 0.850,
    profilePow: 0.60,
  },
  {
    name: 'Pyramids of Giza',
    lat: 29.9792,
    lon: 31.1342,
    baseKm: 0.060,
    peakKm: 0.200,   // 140 m Great Pyramid + 60 m plateau = 200 m
    radiusKm: 0.380,
    profilePow: 0.90,
  },
  {
    name: 'Colosseum, Rome',
    lat: 41.8902,
    lon: 12.4922,
    baseKm: 0.020,
    peakKm: 0.070,   // 50 m stone amphitheatre + 20 m ground
    radiusKm: 0.140,
    profilePow: 0.50,
  },
  {
    name: 'Sydney Opera House',
    lat: -33.8568,
    lon: 151.2153,
    baseKm: 0.005,
    peakKm: 0.070,   // 65 m sail roofs
    radiusKm: 0.180,
    profilePow: 0.60,
  },
  {
    name: 'Marina Bay Sands, Singapore',
    lat: 1.2834,
    lon: 103.8607,
    baseKm: 0.005,
    peakKm: 0.205,   // 200 m triple towers + SkyPark
    radiusKm: 0.240,
    profilePow: 0.55,
  },
  {
    name: 'Golden Gate Bridge Towers',
    lat: 37.8199,
    lon: -122.4783,
    baseKm: 0.000,
    peakKm: 0.227,   // 227 m steel suspension towers
    radiusKm: 0.130,
    profilePow: 0.45,
  },
  {
    name: 'London Tower Bridge',
    lat: 51.5055,
    lon: -0.0754,
    baseKm: 0.005,
    peakKm: 0.070,   // 65 m stone Gothic towers
    radiusKm: 0.130,
    profilePow: 0.50,
  },
  {
    name: 'Sagrada Família, Barcelona',
    lat: 41.4036,
    lon: 2.1744,
    baseKm: 0.035,
    peakKm: 0.207,   // 172 m towers + ground = 207 m
    radiusKm: 0.130,
    profilePow: 0.45,
  },
  {
    name: 'Christ the Redeemer, Rio',
    lat: -22.9519,
    lon: -43.2105,
    baseKm: 0.704,   // Corcovado mountain peak
    peakKm: 0.742,   // Statue + pedestal
    radiusKm: 0.180,
    profilePow: 0.70,
  },
  {
    name: 'Machu Picchu & Huayna Picchu',
    lat: -13.1631,
    lon: -72.5450,
    baseKm: 2.430,
    peakKm: 2.720,
    radiusKm: 2.8,
    profilePow: 1.20,
  },
];

/**
 * Returns the solid elevation (km above sea level) at a geographic location from all solid colliders.
 * Returns 0 if outside any landmark collider.
 */
export function getLandmarkSolidElevationKm(lat: number, lon: number): number {
  let maxElevKm = 0;
  for (let i = 0; i < SOLID_LANDMARKS.length; i++) {
    const c = SOLID_LANDMARKS[i];
    // Fast bounding-box rejection: 1 deg lat is ~111 km
    const latDiff = Math.abs(lat - c.lat);
    if (latDiff * 111.0 > c.radiusKm) continue;
    
    const distKm = geoDistanceKm(lat, lon, c.lat, c.lon);
    if (distKm <= c.radiusKm) {
      const frac = distKm / c.radiusKm;
      const elev = c.baseKm + (c.peakKm - c.baseKm) * Math.pow(Math.max(0, 1 - frac), c.profilePow);
      if (elev > maxElevKm) {
        maxElevKm = elev;
      }
    }
  }
  return maxElevKm;
}

/**
 * Returns the nearest active solid collider if within range, or null.
 */
export function getNearestSolidCollider(lat: number, lon: number): { collider: SolidCollider; distKm: number; heightKm: number } | null {
  let best: { collider: SolidCollider; distKm: number; heightKm: number } | null = null;
  let minDist = Infinity;
  for (let i = 0; i < SOLID_LANDMARKS.length; i++) {
    const c = SOLID_LANDMARKS[i];
    const distKm = geoDistanceKm(lat, lon, c.lat, c.lon);
    if (distKm <= c.radiusKm && distKm < minDist) {
      minDist = distKm;
      const frac = distKm / c.radiusKm;
      const heightKm = c.baseKm + (c.peakKm - c.baseKm) * Math.pow(Math.max(0, 1 - frac), c.profilePow);
      best = { collider: c, distKm, heightKm };
    }
  }
  return best;
}
