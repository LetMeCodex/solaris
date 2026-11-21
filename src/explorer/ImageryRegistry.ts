/**
 * Per-body imagery registry for the Planetary Explorer.
 *
 * Every remote source below was probed from CI with the GitHub Pages origin
 * (scripts/verify-tile-sources.mjs → docs/research/imagery-sources-probe.txt): capabilities,
 * HTTP status, content type, `Access-Control-Allow-Origin: *` and the deepest level that returns
 * a tile (the next level returns 404/400). Zoom limits here come from those probes, not guesses.
 *
 * Longitudes are planetocentric/planetographic east-positive in [−180, 180], latitude +90 at the
 * top row, matching both the remote tile grids and the bundled globe textures (centred on the
 * prime meridian).
 */

import type { TileKey } from './TileMath';

export type ImageryKind = 'visible' | 'monochrome' | 'radar' | 'atmosphere';

export type TileProjection = 'equirect' | 'mercator';

/** Maximum latitude representable in Web Mercator (EPSG:3857): atan(sinh(pi)) in degrees. */
export const MAX_MERCATOR_LAT = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;

/**
 * Tile pyramid specification.
 * - `'equirect'` (default): plate carrée pyramid; level 0 has tiles of `level0TileDeg` (180° Trek/EOX, 288° GIBS 4326).
 * - `'mercator'`: Web Mercator (EPSG:3857) 2^z × 2^z pyramid spanning ±85.05112878° latitude (`level0TileDeg: 360`).
 */
export interface TileGrid {
  /** Pyramid projection. Defaults to `'equirect'` when omitted for backward compatibility. */
  projection?: TileProjection;
  tileSize: number;
  level0TileDeg: number;
  minLevel: number;
  maxLevel: number;
  /** Optional latitude coverage bounds (deg); tiles wholly outside are skipped instead of 404ing. */
  minLat?: number;
  maxLat?: number;
}

/** Backward-compatible alias for `TileGrid`. */
export type EquirectGrid = TileGrid;

export interface WmtsProvider extends TileGrid {
  kind: 'wmts';
  /** URL template with {z} {y} {x}. */
  template: string;
  /**
   * Greyscale source drawn with the hue of the bundled colour globe map (luminance from the tile,
   * chroma from the global map), e.g. Mars CTX over the Viking-based colour map.
   */
  colorize?: boolean;
  /** Optional fallback provider activated if the primary source fails or enters outage cooldown. */
  fallback?: TileProvider;
}

export interface WmsProvider extends TileGrid {
  kind: 'wms';
  /** GetMap URL with {bbox} (minLon,minLat,maxLon,maxLat) and {size}. */
  template: string;
  /** As for WmtsProvider: greyscale detail, hue from the bundled colour map. */
  colorize?: boolean;
  /** Optional fallback provider activated if the primary source fails or enters outage cooldown. */
  fallback?: TileProvider;
}

export type TileProvider = WmtsProvider | WmsProvider;

export interface BodyImagery {
  body: string;
  /** Streaming source, or null when only the bundled globe map exists. */
  provider: TileProvider | null;
  kind: ImageryKind;
  title: string;
  source: string;
  sourceUrl: string;
  attribution: string;
  /** Finest ground sample of the deepest available level, metres per pixel at the equator. */
  bestMetresPerPixel: number;
  coverage: string;
  note?: string;
}

const KM = 1000;
const DEG = Math.PI / 180;

/**
 * Metres per pixel at `latDeg` (default equator) for a tile grid level.
 * Web Mercator scales by cos(lat); equirectangular is evaluated along the equator.
 */
export function metresPerPixel(grid: TileGrid, level: number, radiusKm: number, latDeg = 0): number {
  if (grid.projection === 'mercator') {
    const degPerPx = 360 / Math.pow(2, level) / grid.tileSize;
    const clampedLat = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latDeg));
    return degPerPx * DEG * radiusKm * KM * Math.max(0.05, Math.cos(clampedLat * DEG));
  }
  const degPerPx = grid.level0TileDeg / Math.pow(2, level) / grid.tileSize;
  return degPerPx * DEG * radiusKm * KM;
}

/** True when two tile grids share the exact same projection and tile matrix subdivision. */
export function gridsCompatible(a: TileGrid, b: TileGrid): boolean {
  const pa = a.projection ?? 'equirect';
  const pb = b.projection ?? 'equirect';
  if (pa !== pb) return false;
  if (pa === 'mercator') return true;
  return Math.abs(a.level0TileDeg - b.level0TileDeg) < 1e-6;
}

/** Matrix dimensions (cols × rows) at zoom `z` for a grid. */
function gridMatrixSize(grid: TileGrid, z: number): { cols: number; rows: number } {
  if (grid.projection === 'mercator') {
    const n = Math.pow(2, z);
    return { cols: n, rows: n };
  }
  const d = grid.level0TileDeg / Math.pow(2, z);
  return { cols: Math.ceil(360 / d - 1e-9), rows: Math.ceil(180 / d - 1e-9) };
}

/** Strict matrix & zoom bounds check preventing out-of-range HTTP 400 requests (e.g. GIBS bounds). */
export function isTileKeyInBounds(grid: TileGrid, k: TileKey): boolean {
  if (!Number.isInteger(k.z) || !Number.isInteger(k.x) || !Number.isInteger(k.y)) return false;
  if (k.z < grid.minLevel || k.z > grid.maxLevel) return false;
  const { cols, rows } = gridMatrixSize(grid, k.z);
  return k.x >= 0 && k.y >= 0 && k.x < cols && k.y < rows;
}

/** Lowest zoom level covered by `provider` or any grid-compatible fallback in its chain. */
export function effectiveMinLevel(provider: TileProvider): number {
  let minZ = provider.minLevel;
  let cur: TileProvider | undefined = provider.fallback;
  while (cur) {
    if (gridsCompatible(provider, cur)) minZ = Math.min(minZ, cur.minLevel);
    cur = cur.fallback;
  }
  return minZ;
}

/**
 * Resolve the concrete provider for tile `k` along `provider`'s grid-compatible fallback chain.
 * - `preferFallback = false | 0`: returns the primary compatible provider covering `k` (or first
 *   compatible fallback if `k.z < provider.minLevel`).
 * - `preferFallback = true | N`: advances `N` steps into compatible fallback providers covering `k`.
 * Never returns a provider whose tile matrix cannot address `k` (eliminates GIBS HTTP 400s).
 */
export function resolveProviderForTile(
  provider: TileProvider,
  k: TileKey,
  preferFallback: boolean | number = false
): TileProvider | null {
  const step = typeof preferFallback === 'number' ? Math.max(0, Math.floor(preferFallback)) : preferFallback ? 1 : 0;
  const candidates: TileProvider[] = [];
  if (isTileKeyInBounds(provider, k)) candidates.push(provider);
  let cur: TileProvider | undefined = provider.fallback;
  while (cur) {
    if (gridsCompatible(provider, cur) && isTileKeyInBounds(cur, k)) {
      candidates.push(cur);
    }
    cur = cur.fallback;
  }
  return candidates[step] ?? null;
}

/**
 * Format a tile URL for `k` after validating matrix bounds. Returns `null` if no compatible
 * provider in the chain covers `k` at the requested fallback step.
 */
export function buildTileUrl(
  provider: TileProvider,
  k: TileKey,
  preferFallback: boolean | number = false
): string | null {
  const p = resolveProviderForTile(provider, k, preferFallback);
  if (!p) return null;
  if (p.kind === 'wms') {
    let west: number;
    let east: number;
    let north: number;
    let south: number;
    if (p.projection === 'mercator') {
      const n = Math.pow(2, k.z);
      west = -180 + (k.x / n) * 360;
      east = -180 + ((k.x + 1) / n) * 360;
      north = (Math.atan(Math.sinh(Math.PI * (1 - (2 * k.y) / n))) * 180) / Math.PI;
      south = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (k.y + 1)) / n))) * 180) / Math.PI;
    } else {
      const d = p.level0TileDeg / Math.pow(2, k.z);
      west = -180 + k.x * d;
      north = 90 - k.y * d;
      east = west + d;
      south = north - d;
    }
    return p.template.replace('{bbox}', `${west},${south},${east},${north}`).split('{size}').join(String(p.tileSize));
  }
  return p.template.replace('{z}', String(k.z)).replace('{y}', String(k.y)).replace('{x}', String(k.x));
}

const TREK = (body: string, layer: string, ext: string) =>
  `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0/default/default028mm/{z}/{y}/{x}.${ext}`;

const TREK_GRID = { projection: 'equirect' as const, tileSize: 256, level0TileDeg: 180, minLevel: 0 };

const MERCATOR_GRID = {
  projection: 'mercator' as const,
  tileSize: 256,
  level0TileDeg: 360,
  minLevel: 0,
  minLat: -MAX_MERCATOR_LAT,
  maxLat: MAX_MERCATOR_LAT,
};

/** USGS Astrogeology planetary WMS (MapServer, CORS open), one GetMap per 256 px tile. */
const USGS_WMS = (map: string, layer: string) =>
  `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/${map}.map&service=WMS&version=1.1.1&request=GetMap&layers=${layer}&styles=&srs=EPSG:4326&bbox={bbox}&width={size}&height={size}&format=image/jpeg`;

const USGS = 'https://astrogeology.usgs.gov/search';

/**
 * Moons and dwarf planets with a real streamed mosaic. Each map's registration (east-positive,
 * centred on 0°) was checked against the bundled global maps in the browser: Io, Europa,
 * Ganymede, Callisto, Iapetus, Triton and Pluto correlate at 0.5–0.8 with no shift or mirror
 * (−0.4 to 0.4 shifted 180° or mirrored); Mimas and Tethys were compared by eye across the USGS,
 * Trek and bundled maps (Herschel and Odysseus line up). Levels are capped near each map's own
 * resolution: deeper requests would only be upsampled by the server.
 */
const MOON_IMAGERY: BodyImagery[] = [
  {
    body: 'Io',
    provider: { kind: 'wms', template: USGS_WMS('jupiter/io_simp_cyl', 'SSI_VGR_color'), ...TREK_GRID, maxLevel: 5 },
    kind: 'visible',
    title: 'Galileo SSI + Voyager colour mosaic (~1 km)',
    source: 'USGS Astrogeology planetary WMS · NASA Galileo SSI and Voyager',
    sourceUrl: USGS,
    attribution: 'NASA/JPL/USGS (Galileo SSI, Voyager) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'Global colour mosaic of Io; sharper Galileo frames over some volcanoes',
  },
  {
    body: 'Europa',
    provider: { kind: 'wms', template: USGS_WMS('jupiter/europa_simp_cyl', 'GALILEO_VOYAGER'), ...TREK_GRID, maxLevel: 5, colorize: true },
    kind: 'monochrome',
    title: 'Galileo + Voyager global mosaic (500 m)',
    source: 'USGS Astrogeology planetary WMS · NASA Galileo SSI and Voyager',
    sourceUrl: USGS,
    attribution: 'NASA/JPL/USGS (Galileo SSI, Voyager) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic; resolution varies from 500 m to several km',
  },
  {
    body: 'Ganymede',
    provider: { kind: 'wms', template: USGS_WMS('jupiter/ganymede_simp_cyl', 'GALILEO_VOYAGER'), ...TREK_GRID, maxLevel: 5, colorize: true },
    kind: 'monochrome',
    title: 'Galileo + Voyager global mosaic (1 km)',
    source: 'USGS Astrogeology planetary WMS · NASA Galileo SSI and Voyager',
    sourceUrl: USGS,
    attribution: 'NASA/JPL/USGS (Galileo SSI, Voyager) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Callisto',
    provider: { kind: 'wms', template: USGS_WMS('jupiter/callisto_simp_cyl', 'GALILEO_VOYAGER'), ...TREK_GRID, maxLevel: 5, colorize: true },
    kind: 'monochrome',
    title: 'Galileo + Voyager global mosaic (1 km)',
    source: 'USGS Astrogeology planetary WMS · NASA Galileo SSI and Voyager',
    sourceUrl: USGS,
    attribution: 'NASA/JPL/USGS (Galileo SSI, Voyager) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Titan',
    provider: { kind: 'wmts', template: TREK('Titan', 'Titan_ISS_Globe_65Sto45N_450M_AvgMos', 'png'), ...TREK_GRID, maxLevel: 6, minLat: -65, maxLat: 45 },
    kind: 'monochrome',
    title: 'Cassini ISS controlled mosaic, 938 nm (450 m)',
    source: 'NASA Titan Trek · Cassini Imaging Science Subsystem',
    sourceUrl: 'https://trek.nasa.gov/titan/',
    attribution: 'NASA/JPL-Caltech/SSI/USGS via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Near-infrared view through the haze, 65°S to 45°N; the north is the bundled map',
    note: 'Titan’s surface is hidden in visible light: this is the 938 nm window through the haze.',
  },
  {
    body: 'Enceladus',
    provider: { kind: 'wmts', template: TREK('Enceladus', 'Enceladus_Cassini_ISS_Global_Mosaic_100m_HPF', 'png'), ...TREK_GRID, maxLevel: 5 },
    kind: 'monochrome',
    title: 'Cassini ISS global mosaic (100 m)',
    source: 'NASA Icy Moons Trek · Cassini Imaging Science Subsystem',
    sourceUrl: 'https://trek.nasa.gov/icymoons/',
    attribution: 'NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Mimas',
    provider: { kind: 'wmts', template: TREK('Mimas', 'MI_170630_DLR_basemap', 'jpg'), ...TREK_GRID, maxLevel: 4 },
    kind: 'monochrome',
    title: 'Cassini ISS global basemap (DLR)',
    source: 'NASA Icy Moons Trek · Cassini ISS, DLR basemap',
    sourceUrl: 'https://trek.nasa.gov/icymoons/',
    attribution: 'NASA/JPL-Caltech/SSI/DLR via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Tethys',
    provider: { kind: 'wmts', template: TREK('Tethys', 'Tethys_Cassini_mosaic_global_293m', 'jpg'), ...TREK_GRID, maxLevel: 4 },
    kind: 'monochrome',
    title: 'Cassini global mosaic (293 m)',
    source: 'NASA Icy Moons Trek · Cassini Imaging Science Subsystem',
    sourceUrl: 'https://trek.nasa.gov/icymoons/',
    attribution: 'NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Iapetus',
    provider: { kind: 'wmts', template: TREK('Iapetus', 'Iapetus_Cassini_Voyager_mosaic_global_783m', 'jpg'), ...TREK_GRID, maxLevel: 3 },
    kind: 'monochrome',
    title: 'Cassini + Voyager global mosaic (783 m)',
    source: 'NASA Icy Moons Trek · Cassini ISS and Voyager',
    sourceUrl: 'https://trek.nasa.gov/icymoons/',
    attribution: 'NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Triton',
    provider: { kind: 'wms', template: USGS_WMS('neptune/triton_simp_cyl', 'TRITON_VOYAGER2'), ...TREK_GRID, maxLevel: 5 },
    kind: 'monochrome',
    title: 'Voyager 2 mosaic (600 m)',
    source: 'USGS Astrogeology planetary WMS · NASA Voyager 2',
    sourceUrl: USGS,
    attribution: 'NASA/JPL/USGS (Voyager 2) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'The southern hemisphere Voyager 2 saw in 1989; the rest is the bundled map',
  },
  {
    body: 'Pluto',
    provider: { kind: 'wms', template: USGS_WMS('pluto/pluto_simp_cyl', 'NEWHORIZONS_PLUTO_MOSAIC'), ...TREK_GRID, maxLevel: 6, colorize: true },
    kind: 'monochrome',
    title: 'New Horizons LORRI + MVIC mosaic (300 m)',
    source: 'USGS Astrogeology planetary WMS · NASA New Horizons',
    sourceUrl: USGS,
    attribution: 'NASA/JHUAPL/SwRI/LPI (New Horizons) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'The encounter hemisphere at up to 300 m; the far side only at tens of km',
  },
  {
    body: 'Charon',
    provider: { kind: 'wms', template: USGS_WMS('pluto/charon_simp_cyl', 'NEWHORIZONS_CHARON_MOSAIC'), ...TREK_GRID, maxLevel: 5, colorize: true },
    kind: 'monochrome',
    title: 'New Horizons LORRI + MVIC mosaic (300 m)',
    source: 'USGS Astrogeology planetary WMS · NASA New Horizons',
    sourceUrl: USGS,
    attribution: 'NASA/JHUAPL/SwRI/LPI (New Horizons) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'The encounter hemisphere; the south was in darkness',
  },
  {
    body: 'Ceres',
    provider: { kind: 'wms', template: USGS_WMS('asteroid_belt/ceres_simp_cyl', 'Ceres_FC_global'), ...TREK_GRID, maxLevel: 6 },
    kind: 'monochrome',
    title: 'Dawn Framing Camera global mosaic',
    source: 'USGS Astrogeology planetary WMS · NASA Dawn',
    sourceUrl: USGS,
    attribution: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA (Dawn) via USGS Astrogeology, public domain',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic',
  },
  {
    body: 'Vesta',
    provider: { kind: 'wmts', template: TREK('Vesta', 'Vesta_Dawn_HAMO_Photo_DLR_global_74ppd_IAU', 'png'), ...TREK_GRID, maxLevel: 6 },
    kind: 'monochrome',
    title: 'Dawn FC HAMO mosaic (64 m), IAU coordinates',
    source: 'NASA Vesta Trek · Dawn Framing Camera (DLR)',
    sourceUrl: 'https://trek.nasa.gov/vesta/',
    attribution: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA (Dawn) via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global greyscale mosaic in the IAU (4) Vesta frame, which the landmarks use',
    note: 'Vesta is drawn as a sphere; the real body is a lumpy 573 × 557 × 446 km.',
  },
];

export const BODY_IMAGERY: Record<string, BodyImagery> = {
  Earth: {
    body: 'Earth',
    provider: {
      kind: 'wmts',
      // ArcGIS World Imagery (EPSG:3857 Web Mercator, 2^z × 2^z, 256 px JPEG, ACAO: *):
      // high-res regional/city/surface close-up imagery down to z=18 (~0.60 m/px eq, ~0.45 m/px mid-lat).
      template: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ...MERCATOR_GRID,
      minLevel: 6,
      maxLevel: 18,
      fallback: {
        kind: 'wmts',
        // EOX Sentinel-2 cloudless 2021 (EPSG:3857 Web Mercator, identical 2^z × 2^z matrix):
        // handles global/orbital zooms (z=0..5) and serves as automatic fallback up to z=13.
        template: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg',
        ...MERCATOR_GRID,
        minLevel: 0,
        maxLevel: 13,
        fallback: {
          kind: 'wmts',
          // NASA GIBS BlueMarble NextGeneration (EPSG:3857 GoogleMapsCompatible_Level8, exact 2^z × 2^z):
          // strictly aligned with the Web Mercator matrix and clamped to z<=8 so ZERO HTTP 400s occur.
          template: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',
          ...MERCATOR_GRID,
          minLevel: 0,
          maxLevel: 8,
        },
      },
    },
    kind: 'visible',
    title: 'ArcGIS World Imagery (sub-metre) · Sentinel-2 cloudless',
    source: 'Esri World Imagery · EOX Sentinel-2 cloudless · NASA GIBS Blue Marble',
    sourceUrl: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9',
    attribution:
      'Esri, Maxar, Earthstar Geographics, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community · Sentinel-2 cloudless by EOX (CC BY 4.0) · NASA GIBS',
    bestMetresPerPixel: 0,
    coverage: 'Global satellite & aerial imagery: Sentinel-2/Blue Marble from orbit, sub-metre ArcGIS World Imagery up close',
  },
  Moon: {
    body: 'Moon',
    provider: {
      kind: 'wmts',
      template: TREK('Moon', 'Kaguya_TCortho_Mosaic_Global_4096ppd', 'png'),
      ...TREK_GRID,
      maxLevel: 10,
      fallback: { kind: 'wmts', template: TREK('Moon', 'LRO_WAC_Mosaic_Global_303ppd_v02', 'jpg'), ...TREK_GRID, maxLevel: 7 },
    },
    kind: 'monochrome',
    title: 'SELENE/Kaguya Terrain Camera ortho mosaic',
    source: 'NASA Moon Trek · JAXA SELENE (Kaguya) Terrain Camera',
    sourceUrl: 'https://trek.nasa.gov/moon/',
    attribution: 'JAXA/SELENE Terrain Camera via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global monochrome mosaic; Trek serves it down to level 10 (≈21 m/px)',
  },
  Mercury: {
    body: 'Mercury',
    provider: { kind: 'wmts', template: TREK('Mercury', 'Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m', 'jpg'), ...TREK_GRID, maxLevel: 7 },
    kind: 'monochrome',
    title: 'MESSENGER MDIS basemap (BDR, 166 m)',
    source: 'NASA Mercury Trek · MESSENGER MDIS',
    sourceUrl: 'https://trek.nasa.gov/mercury/',
    attribution: 'NASA/JHUAPL/Carnegie Institution of Washington via NASA Solar System Treks',
    bestMetresPerPixel: 0,
    coverage: 'Global monochrome mosaic',
  },
  Venus: {
    body: 'Venus',
    provider: {
      kind: 'wms',
      template:
        'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/venus/venus_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=MAGELLAN&styles=&srs=EPSG:4326&bbox={bbox}&width={size}&height={size}&format=image/jpeg',
      tileSize: 256,
      level0TileDeg: 180,
      minLevel: 0,
      maxLevel: 8,
    },
    kind: 'radar',
    title: 'Magellan SAR radar mosaic',
    source: 'USGS Astrogeology planetary WMS · NASA Magellan',
    sourceUrl: 'https://planetarymaps.usgs.gov/',
    attribution: 'NASA/JPL Magellan via USGS Astrogeology',
    bestMetresPerPixel: 0,
    coverage: 'Radar backscatter of the surface beneath the clouds — not a visible-light view',
    note: 'Zoom is capped at level 8; the WMS resamples the mosaic and its native resolution was not verified.',
  },
  Mars: {
    body: 'Mars',
    provider: {
      kind: 'wmts',
      // Trek's capabilities for CTX_beta01_uncontrolled_5m_Caltech point at this Esri-hosted cache
      // (same 2×1, 256 px grid). Levels 0–2 return HTTP 500 without CORS, levels 3–4 have
      // truncated/missing polar PNGs, and polar strips beyond ±73° fail; route z < 5 and per-tile
      // fallbacks to Viking 232m (levels 0–7, CORS-clean JPEG) while keeping levels 5–12 CTX.
      template: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}',
      ...TREK_GRID,
      minLevel: 5,
      maxLevel: 12,
      minLat: -73,
      maxLat: 73,
      colorize: true,
      fallback: {
        kind: 'wmts',
        template: TREK('Mars', 'Mars_Viking_MDIM21_ClrMosaic_global_232m', 'jpg'),
        ...TREK_GRID,
        maxLevel: 7,
      },
    },
    kind: 'visible',
    title: 'MRO CTX global mosaic (Caltech Murray Lab), tinted',
    source: 'NASA Mars Trek · MRO Context Camera mosaic',
    sourceUrl: 'https://trek.nasa.gov/mars/',
    attribution: 'NASA/JPL/MSSS, Caltech Murray Lab CTX mosaic via NASA Solar System Treks / Esri',
    bestMetresPerPixel: 0,
    coverage: 'Near-global greyscale mosaic (beta, uncontrolled); colour comes from the global Mars map',
    note: 'The CTX camera is monochrome: detail is CTX, hue is borrowed from the global colour map.',
  },
  Jupiter: {
    body: 'Jupiter',
    provider: null,
    kind: 'atmosphere',
    title: 'Global cloud-top map (2048 px)',
    source: 'Solar System Scope (NASA Cassini/Juno imagery)',
    sourceUrl: 'https://www.solarsystemscope.com/textures/',
    attribution: 'Solar System Scope, CC BY 4.0',
    bestMetresPerPixel: 0,
    coverage: 'Cloud tops only — a gas giant has no solid surface to map',
    note: 'No higher-resolution streaming map was verified; zoom stops at the globe map resolution.',
  },
  Saturn: {
    body: 'Saturn',
    provider: null,
    kind: 'atmosphere',
    title: 'Global cloud-top map (2048 px)',
    source: 'Solar System Scope (NASA Cassini imagery)',
    sourceUrl: 'https://www.solarsystemscope.com/textures/',
    attribution: 'Solar System Scope, CC BY 4.0',
    bestMetresPerPixel: 0,
    coverage: 'Cloud tops only — a gas giant has no solid surface to map',
    note: 'No higher-resolution streaming map was verified; zoom stops at the globe map resolution.',
  },
  Uranus: {
    body: 'Uranus',
    provider: null,
    kind: 'atmosphere',
    title: 'Global map (2048 px)',
    source: 'Solar System Scope (Voyager 2-based, largely representative)',
    sourceUrl: 'https://www.solarsystemscope.com/textures/',
    attribution: 'Solar System Scope, CC BY 4.0',
    bestMetresPerPixel: 0,
    coverage: 'Low-detail representative cloud map',
    note: 'Uranus has never been mapped at high resolution.',
  },
  Neptune: {
    body: 'Neptune',
    provider: null,
    kind: 'atmosphere',
    title: 'Global map (2048 px)',
    source: 'Solar System Scope (Voyager 2-based, largely representative)',
    sourceUrl: 'https://www.solarsystemscope.com/textures/',
    attribution: 'Solar System Scope, CC BY 4.0',
    bestMetresPerPixel: 0,
    coverage: 'Low-detail representative cloud map',
    note: 'Neptune has never been mapped at high resolution.',
  },
};

for (const m of MOON_IMAGERY) BODY_IMAGERY[m.body] = m;

/** Mean radii (km) used for ground-sample calculations. */
export const RADII_KM: Record<string, number> = {
  Earth: 6371.0, Moon: 1737.4, Mercury: 2439.7, Venus: 6051.8, Mars: 3389.5,
  Jupiter: 69911, Saturn: 58232, Uranus: 25362, Neptune: 24622,
  Io: 1821.6, Europa: 1560.8, Ganymede: 2634.1, Callisto: 2410.3, Titan: 2574.7, Enceladus: 252.1,
  Mimas: 198.2, Tethys: 531.1, Iapetus: 734.5, Triton: 1353.4, Pluto: 1188.3, Charon: 606.0,
  Ceres: 469.7, Vesta: 262.7,
};

for (const entry of Object.values(BODY_IMAGERY)) {
  const r = RADII_KM[entry.body];
  entry.bestMetresPerPixel = entry.provider
    ? metresPerPixel(entry.provider, entry.provider.maxLevel, r)
    : ((2 * Math.PI * r * KM) / 2048);
}

/** Thick-hazed worlds: the surface view stays below this (km) or the haze hides all the ground. */
const HAZE_EYE_CAP_KM: Record<string, number> = { Titan: 1.5, Venus: 1.5 };

/**
 * Eye height (km) for standing over a world's streamed imagery. With real relief (Moon, Mars) ~30 ×
 * the map's metres per pixel: an overlook, with one map pixel about 3 screen pixels where you look.
 * Flat imagery (no elevation data) is a photograph, best seen sharp: ~60 ×, about 1.7 screen
 * pixels per map pixel 15° below the horizon (0.4 km over Vesta, 42 km over Io's 700 m mosaic).
 * Capped on worlds whose haze would hide the ground (Titan, Venus).
 */
export function imageryEyeKm(img: BodyImagery, relief: boolean): number {
  const eye = (img.bestMetresPerPixel * (relief ? 30 : 60)) / 1000;
  return Math.min(eye, HAZE_EYE_CAP_KM[img.body] ?? Infinity);
}

const fallbackCache = new Map<string, BodyImagery>();

/**
 * Imagery for a body. Bodies without a verified tiled source (most moons, dwarf planets) get a
 * "global map only" entry so they can still be explored and stood on; the label says the surface
 * texture is illustrative. Pass the body's radius to size the zoom floor.
 */
export function getBodyImagery(body: string, radiusKm?: number): BodyImagery | null {
  const known = BODY_IMAGERY[body];
  if (known) return known;
  if (!radiusKm || body === 'Sun') return null;
  let e = fallbackCache.get(body);
  if (!e) {
    e = {
      body,
      provider: null,
      kind: 'monochrome',
      title: 'Illustrative global map',
      source: 'SOLARIS procedural texture',
      sourceUrl: 'https://ssd.jpl.nasa.gov/',
      attribution: 'Procedural (no real map bundled)',
      bestMetresPerPixel: (2 * Math.PI * radiusKm * KM) / 1024,
      coverage: 'No real global map of this body is bundled; the surface texture is illustrative',
      note: 'Positions, sizes and lighting of everything in its sky are computed from real ephemerides.',
    };
    fallbackCache.set(body, e);
  }
  return e;
}

/**
 * Lowest camera altitude (km) at which the best imagery still has at least ~0.5 source pixel per
 * screen pixel on a ~1000 px tall view through the given lens — i.e. at most 2× over-zoom.
 */
export function minimumAltitudeKm(imagery: BodyImagery, fovDeg: number, screenPx: number = 1000): number {
  const pxAcrossAtUnitAltitude = screenPx / (2 * Math.tan((fovDeg * Math.PI) / 360));
  const overZoom = 2.0;
  return (imagery.bestMetresPerPixel * pxAcrossAtUnitAltitude) / overZoom / KM;
}
