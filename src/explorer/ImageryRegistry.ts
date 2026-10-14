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

export type ImageryKind = 'visible' | 'monochrome' | 'radar' | 'atmosphere';

/** Equirectangular tile pyramid: level 0 has `level0Cols × level0Rows` tiles of `level0TileDeg`. */
export interface EquirectGrid {
  tileSize: number;
  level0TileDeg: number;
  minLevel: number;
  maxLevel: number;
}

export interface WmtsProvider extends EquirectGrid {
  kind: 'wmts';
  /** URL template with {z} {y} {x}. */
  template: string;
  /**
   * Greyscale source drawn with the hue of the bundled colour globe map (luminance from the tile,
   * chroma from the global map), e.g. Mars CTX over the Viking-based colour map.
   */
  colorize?: boolean;
}

export interface WmsProvider extends EquirectGrid {
  kind: 'wms';
  /** GetMap URL with {bbox} (minLon,minLat,maxLon,maxLat) and {size}. */
  template: string;
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

/** Metres per pixel at the equator for a level of an equirectangular grid. */
export function metresPerPixel(grid: EquirectGrid, level: number, radiusKm: number): number {
  const degPerPx = grid.level0TileDeg / Math.pow(2, level) / grid.tileSize;
  return ((degPerPx * Math.PI) / 180) * radiusKm * KM;
}

const TREK = (body: string, layer: string, ext: string) =>
  `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0/default/default028mm/{z}/{y}/{x}.${ext}`;

const TREK_GRID = { tileSize: 256, level0TileDeg: 180, minLevel: 0 };

export const BODY_IMAGERY: Record<string, BodyImagery> = {
  Earth: {
    body: 'Earth',
    provider: {
      kind: 'wmts',
      // EOX "WGS84" matrix set: 2×1 tiles of 256 px at level 0 (same grid as Trek), levels 0–17;
      // the Sentinel-2 data are 10 m, reached at level 13 (≈9.5 m/px). Level 18 returns 404.
      template: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84/{z}/{y}/{x}.jpg',
      ...TREK_GRID,
      maxLevel: 13,
    },
    kind: 'visible',
    title: 'Sentinel-2 cloudless (2016, 10 m)',
    source: 'EOX Sentinel-2 cloudless · Copernicus Sentinel-2',
    sourceUrl: 'https://s2maps.eu',
    attribution:
      'Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0',
    bestMetresPerPixel: 0,
    coverage: 'Global cloud-free true-colour mosaic of the land; oceans are filled in by EOX',
  },
  Moon: {
    body: 'Moon',
    provider: { kind: 'wmts', template: TREK('Moon', 'Kaguya_TCortho_Mosaic_Global_4096ppd', 'png'), ...TREK_GRID, maxLevel: 10 },
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
      // (same 2×1, 256 px grid); levels 0–12, level 13 returns 400.
      template: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}',
      ...TREK_GRID,
      maxLevel: 12,
      colorize: true,
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

/** Mean radii (km) used for ground-sample calculations. */
const RADII_KM: Record<string, number> = {
  Earth: 6371.0, Moon: 1737.4, Mercury: 2439.7, Venus: 6051.8, Mars: 3389.5,
  Jupiter: 69911, Saturn: 58232, Uranus: 25362, Neptune: 24622,
};

for (const entry of Object.values(BODY_IMAGERY)) {
  const r = RADII_KM[entry.body];
  entry.bestMetresPerPixel = entry.provider
    ? metresPerPixel(entry.provider, entry.provider.maxLevel, r)
    : ((2 * Math.PI * r * KM) / 2048);
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
