# SOLARIS — Data & Asset Provenance

Every dataset and image shipped with SOLARIS, where it came from, and the licence and attribution it requires. Third-party licences apply in addition to the MIT licence of the code.

---

## 1. Orbital elements (`src/astronomy/SolarSystemData.ts`, `src/data/CatalogueData.ts`)

All element sets are heliocentric (or parent-centred for moons) in the **J2000 ecliptic**. The time argument is **TDB**. Each element block records its source in a `source` field.

| Bodies | Source | Epoch / validity |
| :--- | :--- | :--- |
| Mercury … Neptune | JPL SSD, *Keplerian Elements for Approximate Positions of the Major Planets* (E. M. Standish), Table 1, with linear rates per century. Earth uses the Earth–Moon barycentre row. https://ssd.jpl.nasa.gov/planets/approx_pos.html | J2000; valid 1800–2050 AD |
| Moon | JPL SSD planetary satellite mean elements (ecliptic), with apsidal / nodal precession periods of 5.997 yr / 18.600 yr. https://ssd.jpl.nasa.gov/sats/elem/ | 2000-01-01.5 TDB |
| Phobos, Deimos, Galilean moons, Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Hyperion, Iapetus, Miranda, Ariel, Umbriel, Titania, Oberon, Triton, Charon | JPL Horizons osculating elements (parent-centred, ecliptic J2000), advanced with the published mean sidereal period. https://ssd.jpl.nasa.gov/horizons/ | 2026-10-14.0 TDB (JD 2461327.5) |
| Pluto, Ceres, Vesta, Pallas, Hygiea, Psyche, Eros, Gaspra, Ida, Bennu, Ryugu | JPL Small-Body Database osculating elements. https://ssd-api.jpl.nasa.gov/sbdb.api | Per-object epoch (JD 2461200.5 for most; Bennu 2455562.5, Pluto 2457588.5) |

Physical constants (GM, radii, flattening) are from the JPL planetary physical parameters and the IAU WGCCRE reports.

**Licence:** NASA/JPL data are public domain (U.S. Government work).

The main-belt "asteroid belt" (3,200 rocks) is **synthetic**: seeded Mulberry32 random elements (seed `19890825`) between 2.12 and 3.28 AU, with Kirkwood gaps at the 3:1 (2.50 AU), 5:2 (2.82 AU), 7:3 (2.96 AU) and 2:1 (3.27 AU) resonances. The rocks are a statistical illustration, not catalogued objects.

## 2. Rotation models (`src/astronomy/BodyOrientation.ts`)

- IAU WGCCRE 2015: Archinal, B. A. et al. (2018), *Celest. Mech. Dyn. Astr.* 130:22 — pole (α₀, δ₀) and prime meridian W for the Sun, planets, Pluto, Ceres, Vesta, Eros, Gaspra and Ida. Small periodic terms are omitted, except Neptune's pole nutation.
- Bennu pole and period: Lauretta, D. S. et al. (2019), *Nature* 568:55.
- Ryugu pole and period: Watanabe, S. et al. (2019), *Science* 364:268.

## 3. Stars (`public/data/stars.json`, `data/source/hipparcos_v8_full.json`)

- **Source:** ESA (1997), *The Hipparcos and Tycho Catalogues*, ESA SP-1200, via CDS VizieR I/239. Positions are propagated linearly with proper motion from J1991.25 (see the file header). Distances are given only where the parallax S/N ≥ 5.
- **Full catalogue:** 41,394 stars with V ≤ 8.0 (`data/source/`, not shipped).
- **Shipped subset:** 12,596 stars (`npm run build:stars`): all stars with V ≤ 4.6, plus all stars within 120 pc.
- **Colours:** approximate black-body tints from B−V (spectral class as a fallback).
- **Constellation figures:** hand-curated HIP pairs for nine constellations and asterisms in `Starfield.ts`.
- **Licence:** CC BY-NC 3.0 IGO (https://www.cosmos.esa.int/web/hipparcos/catalogues). Credit: "ESA/Hipparcos". The non-commercial clause means SOLARIS itself must remain non-commercial while it ships this catalogue.

## 4. Sky and galaxy images (`public/textures/`)

| File | Content | Source & licence |
| :--- | :--- | :--- |
| `gaia_sky.webp` | All-sky map in galactic coordinates (equirectangular, l = 0 at centre); split into depth for the 3D sky around the Solar System | ESA/Gaia/DPAC, CC BY-SA 3.0 IGO. Credit: "ESA/Gaia/DPAC". Re-encoded to WebP (q75, 4000×2000). |
| `milky_way_disk.webp` | Face-on Milky Way disk with alpha, used for the 3D galaxy and sampled for the 3D galactic disk | *Artist's impression of the Milky Way* (NASA/JPL-Caltech/ESO/R. Hurt, ESO eso1339e), CC BY 4.0. Resized to 2048², colour-graded and alpha-masked (black background → transparent) with a local preprocessing script, then re-encoded to WebP. |
| `thumbs/*.webp` | 128×64 HUD thumbnails | Downscaled from the planet textures below (same licences). |

## 5. Planet textures (`public/textures/`)

| Files | Source & licence |
| :--- | :--- |
| `2k_sun.jpg`, `2k_mercury.jpg`, `2k_venus_atmosphere.jpg`, `2k_earth_daymap.jpg`, `2k_earth_nightmap.jpg`, `2k_earth_clouds.jpg`, `2k_moon.jpg`, `2k_mars.jpg`, `2k_jupiter.jpg`, `2k_saturn.jpg`, `2k_saturn_ring_alpha.png`, `2k_uranus.jpg`, `2k_neptune.jpg` | **Solar System Scope** (INOVE), https://www.solarsystemscope.com/textures/ — CC BY 4.0, derived from NASA imagery. Credit: "Textures: Solar System Scope (CC BY 4.0)". |
| `hires/earth_day_8k.webp`, `hires/earth_night_4k.webp`, `hires/earth_clouds_4k.webp`, `hires/moon_8k.webp`, `hires/mars_8k.webp`, `hires/mercury_8k.webp`, `hires/jupiter_4k.webp`, `hires/saturn_4k.webp`, `hires/sun_4k.webp`, `hires/saturn_ring_alpha_8k.png` | **Solar System Scope** (INOVE), https://www.solarsystemscope.com/textures/ — CC BY 4.0, derived from NASA imagery. The 8K/4K maps, re-encoded as WebP (night lights and clouds downsized to 4K); swapped in for the 2K maps as you approach a world. |
| `earth_normal_2048.jpg`, `earth_lights_2048.png` | three.js example textures (`examples/textures/planets/`), MIT licence; byte-identical to three.js r170. |

Bodies without a texture (most moons and asteroids) use procedural canvas textures generated at runtime (`TextureGenerator.ts`). The same generator provides offline fallbacks if a texture fails to load.

`scripts/download_textures.cjs` re-fetches the planet textures from these original publishers.

## 6. Streamed surface imagery (`src/explorer/ImageryRegistry.ts`)

The browser streams these tiles at runtime; they are not stored in the repository. All endpoints are public and need no key.

| Body | Product | Endpoint | Credit |
| :--- | :--- | :--- | :--- |
| Earth | Sentinel-2 cloudless 2016 (10 m), layer `s2cloudless`, WGS84 grid | `tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84` | "Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)", CC BY 4.0. Attribution is shown in the explorer panel. |
| Moon | SELENE/Kaguya Terrain Camera ortho mosaic (4096 ppd product, served to level 10) | `trek.nasa.gov/tiles/Moon/EQ/Kaguya_TCortho_Mosaic_Global_4096ppd` | JAXA/SELENE via NASA Solar System Treks |
| Mercury | MESSENGER MDIS Basemap BDR Mosaic 166 m | `trek.nasa.gov/tiles/Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m` | NASA/JHUAPL/Carnegie Institution of Washington via NASA Solar System Treks |
| Mars | MRO CTX Global Mosaic beta01 (Caltech Murray Lab, 5 m source, served to level 12 ≈ 10 m/px), greyscale tinted with the bundled colour map | Trek layer `CTX_beta01_uncontrolled_5m_Caltech`, whose capabilities point at `astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer` | NASA/JPL/MSSS; Caltech Murray Lab mosaic (Dickson et al.); served via NASA Solar System Treks / Esri |
| Venus | Magellan SAR mosaic (layer `MAGELLAN`) | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/venus/venus_simp_cyl.map` (WMS 1.1.1) | NASA/JPL Magellan; USGS Astrogeology Science Center |
| Io | Galileo SSI + Voyager colour mosaic (~1 km), to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/jupiter/io_simp_cyl.map`, layer `SSI_VGR_color` (WMS 1.1.1) | NASA/JPL/USGS (Galileo SSI, Voyager) via USGS Astrogeology, public domain |
| Europa | Galileo + Voyager mosaic (500 m), greyscale tinted with the bundled colour map, to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/jupiter/europa_simp_cyl.map`, layer `GALILEO_VOYAGER` (WMS 1.1.1) | NASA/JPL/USGS via USGS Astrogeology, public domain |
| Ganymede | Galileo + Voyager mosaic (1 km), tinted, to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/jupiter/ganymede_simp_cyl.map`, layer `GALILEO_VOYAGER` (WMS 1.1.1) | NASA/JPL/USGS via USGS Astrogeology, public domain |
| Callisto | Galileo + Voyager mosaic (1 km), tinted, to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/jupiter/callisto_simp_cyl.map`, layer `GALILEO_VOYAGER` (WMS 1.1.1) | NASA/JPL/USGS via USGS Astrogeology, public domain |
| Titan | Cassini ISS controlled mosaic at 938 nm (450 m, 65°S–45°N), to level 6 | `trek.nasa.gov/tiles/Titan/EQ/Titan_ISS_Globe_65Sto45N_450M_AvgMos` | NASA/JPL-Caltech/SSI/USGS via NASA Solar System Treks |
| Enceladus | Cassini ISS global mosaic 100 m, to level 5 | `trek.nasa.gov/tiles/Enceladus/EQ/Enceladus_Cassini_ISS_Global_Mosaic_100m_HPF` | NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks |
| Mimas | Cassini ISS global basemap (DLR), to level 4 | `trek.nasa.gov/tiles/Mimas/EQ/MI_170630_DLR_basemap` | NASA/JPL-Caltech/SSI/DLR via NASA Solar System Treks |
| Tethys | Cassini global mosaic 293 m, to level 4 | `trek.nasa.gov/tiles/Tethys/EQ/Tethys_Cassini_mosaic_global_293m` | NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks |
| Iapetus | Cassini + Voyager global mosaic 783 m, to level 3 | `trek.nasa.gov/tiles/Iapetus/EQ/Iapetus_Cassini_Voyager_mosaic_global_783m` | NASA/JPL-Caltech/SSI/LPI via NASA Solar System Treks |
| Triton | Voyager 2 mosaic (600 m, southern hemisphere), to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/neptune/triton_simp_cyl.map`, layer `TRITON_VOYAGER2` (WMS 1.1.1) | NASA/JPL/USGS (Voyager 2) via USGS Astrogeology, public domain |
| Pluto | New Horizons LORRI + MVIC mosaic (to 300 m on the encounter hemisphere), tinted, to level 6 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/pluto/pluto_simp_cyl.map`, layer `NEWHORIZONS_PLUTO_MOSAIC` (WMS 1.1.1) | NASA/JHUAPL/SwRI/LPI (New Horizons) via USGS Astrogeology, public domain |
| Charon | New Horizons LORRI + MVIC mosaic, tinted, to level 5 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/pluto/charon_simp_cyl.map`, layer `NEWHORIZONS_CHARON_MOSAIC` (WMS 1.1.1) | NASA/JHUAPL/SwRI/LPI (New Horizons) via USGS Astrogeology, public domain |
| Ceres | Dawn Framing Camera global mosaic, to level 6 | `planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/asteroid_belt/ceres_simp_cyl.map`, layer `Ceres_FC_global` (WMS 1.1.1) | NASA/JPL-Caltech/UCLA/MPS/DLR/IDA (Dawn) via USGS Astrogeology, public domain |
| Vesta | Dawn FC HAMO mosaic (64 m) in the IAU (4) Vesta frame, to level 6 | `trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_Photo_DLR_global_74ppd_IAU` | NASA/JPL-Caltech/UCLA/MPS/DLR/IDA (Dawn) via NASA Solar System Treks |

**Moons and dwarf planets (added).** Each map's registration (east-positive, centred on 0°) was checked in the browser against the bundled global maps: Io, Europa, Ganymede, Callisto, Iapetus, Triton and Pluto correlate at 0.5–0.8 with no shift or mirror; Mimas and Tethys were compared by eye across the USGS, Trek and bundled maps. The USGS WMS renders each tile on request (about 3 s each), so the explorer asks for at most 4 at a time; those worlds sharpen slowly. Miranda has no streamable map (the USGS service lists none) and keeps its bundled map.

**Provenance.**
- `docs/research/imagery-sources-probe.txt` is written by `scripts/verify-tile-sources.mjs`, run in GitHub Actions on 2026-10-14 with `Origin: https://letmecodex.github.io`. It records:
  - WMTS capabilities and tile-matrix sets
  - the deepest level that returns HTTP 200
  - the `Access-Control-Allow-Origin` header
- `docs/research/imagery-sources-probe-2.txt` is the second CI probe (2026-10-14, same origin) that selected the current sources. It records:
  - the GIBS and EOX capabilities
  - the EOX licence text per year (2016 is CC BY 4.0; 2018+ are CC BY-NC-SA, so they are not used)
  - the deepest levels: EOX `s2cloudless` returns tiles to level 17 (data are 10 m at level 13), Kaguya TC to level 10, and CTX to level 12
  - the CORS headers (EOX echoes the requesting origin; Trek and Esri send `*`)
- `docs/research/landmark-coords.txt` is written by `scripts/fetch-landmark-coords.mjs`. It records the source coordinates for each landmark. Planetocentric east-positive longitudes from 0° to 360° are converted to −180° to 180°.

## 7. Galactic constants

| Quantity | Value | Source |
| :--- | :--- | :--- |
| Sun–Galactic Centre distance R₀ | 8.277 kpc | GRAVITY Collaboration (2022), A&A 657, L12 |
| Sun height above the mid-plane | 20.8 pc | Bennett & Bovy (2019), MNRAS 482, 1417 |
| Sgr A* mass | 4.297 × 10⁶ M☉ | GRAVITY Collaboration (2022) |
| Sgr A* shadow diameter | 51.8 ± 2.3 µas | Event Horizon Telescope Collaboration (2022), ApJL 930, L12 |
| Galactic frame | NGP RA 192.85948°, Dec +27.12825°; GC RA 266.40499°, Dec −28.93617° | IAU 1958 system in ICRS |
| LMC / SMC / Sgr dSph positions | (l, b, d) = (280.47°, −32.89°, 49.59 kpc) / (302.80°, −44.30°, 62.44 kpc) / (5.6°, −14.2°, ~26.5 kpc) | Distances: Pietrzyński et al. 2019 (LMC); Graczyk et al. 2020 (SMC); commonly adopted value (Sgr dSph) |

The 3D galaxy's spiral structure follows the disk artwork above; its 14,000 additional stars are procedurally placed.

## Pluto and Charon (added)

- `public/textures/2k_pluto.jpg` — NASA / Johns Hopkins APL / SwRI, New Horizons global colour mosaic of Pluto ("Pluto color mapmosaic", Wikimedia Commons, public domain). Re-centred on the IAU prime meridian; the southern latitudes, in polar night during the 2015 flyby, are a muted fill derived from imaged terrain.
- `public/textures/2k_charon.jpg` — NASA / Johns Hopkins APL / SwRI, New Horizons Charon basemap (public domain). Relief taken from the basemap's luminance with grid lines and labels painted out; Mordor Macula's reddish north polar cap added from New Horizons colour imaging; unimaged south is a muted fill.

## Nebulae (added)

`public/textures/nebulae/` — three photographs, each used under CC BY 4.0 and credited in the HUD:
Webb's "Cosmic Cliffs" (NASA, ESA, CSA, STScI; weic2205a), Hubble's "Mystic Mountain" (NASA, ESA,
M. Livio and the Hubble 20th Anniversary Team; heic1007a) and the Helix Nebula from VISTA
(ESO/VISTA/J. Emerson; eso1205a), plus six procedural figures. Details in
`public/textures/nebulae/SOURCES.md`.

## Music (added)

`public/music/` — "Solaris — Slowed + Reverb (Lofi Edition)", the site's own soundtrack, with its
cover art. Loudness-matched to −18 LUFS for background play.

## Jet model (added)

`public/models/su30mkk.glb`, flown in jet mode (`src/flight/`):

- **"Su-30MKK with Kh-59M"** by **Jeyhun1985**, https://sketchfab.com/3d-models/su-30mkk-with-kh-59m-da768c092b0f49b6b8bcb9e917e1e6a0
- **Licence:** Creative Commons Attribution 4.0 (CC BY 4.0), http://creativecommons.org/licenses/by/4.0/
- **Changes:** optimised for the web. Meshes were simplified (about 670k to 352k triangles), normals quantised, geometry meshopt-compressed and textures re-encoded (8.7 MB to 2.6 MB). The original is 47 MB.

`public/models/gripen.glb`, the default aircraft in jet mode (`src/flight/`), chosen for its detailed cockpit:

- **"SAAB Jas 39A Gripen (Detailed Cockpit)"** by **ngkoret**, https://sketchfab.com/3d-models/saab-jas-39a-gripen-detailed-cockpit-f4646ccf489341c28c4118de38feface
- **Licence:** Creative Commons Attribution 4.0 (CC BY 4.0), http://creativecommons.org/licenses/by/4.0/
- **Changes:** optimised for the web. The outer airframe was simplified (about 767k to 601k triangles in all) while the cockpit, seat and instruments were kept at full detail; normals quantised, geometry meshopt-compressed, textures re-encoded at up to 4096 px (29 MB to 6.3 MB), and the specular-glossiness materials converted to metallic-roughness. The original is 58 MB. At runtime the battle-damage overlays and the baked exhaust flame are hidden, and the materials the model ships untextured (mirrors, displays, glass, rails) are given plain colours and finishes.

## Terrain heights (added)

Earth's ground relief near the surface (`src/explorer/Elevation.ts`) comes from **Terrain Tiles** on the Registry of Open Data on AWS (`s3.amazonaws.com/elevation-tiles-prod`, terrarium encoding), fetched on demand. Sources include SRTM and GMTED2010 (USGS), ETOPO1 (NOAA), and others; see https://github.com/tilezen/joerd/blob/master/docs/attribution.md for the full attribution, which applies here. Depths below sea level are not drawn (the sea surface stays flat).

## Terrain heights: the Moon and Mars (added)

Real relief on the Moon and Mars (`src/explorer/PlanetElevation.ts`), streamed at runtime, nothing stored in the repository:

| Body | Product | Endpoint | Credit |
| :--- | :--- | :--- | :--- |
| Moon (±60°) | SLDEM2015, LRO LOLA + SELENE/Kaguya TC merged DEM, 512 px/° (~59 m), to level 8 | `trek.nasa.gov/tiles/Moon/EQ/LRO_LOLAKaguya_DEM_60N60S_512ppd` | NASA LRO LOLA team and JAXA SELENE TC team (Barker et al. 2016) via NASA Moon Trek |
| Moon (poleward) | LRO LOLA global DEM v04, 128 px/°, to level 5 | `trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_DEM_Global_128ppd_v04` | NASA LRO LOLA team via NASA Moon Trek |
| Mars | HRSC + MOLA blended DEM, 200 m, float32 LERC tiles, to level 7 | `astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer/tile` | Source: USGS, NASA, ESA, HRSC (ESA/DLR/FU Berlin; MGS MOLA); served by Esri Astro, under the Esri terms of use |

- Trek serves its DEMs as 8-bit greyscale tiles on a linear stretch. It was calibrated here: the global LOLA layer reads 0 at Antoniadi's floor and 255 at the far-side summit near Engel'gardt (the LOLA extremes, −9.15 and +10.76 km about 1737.4 km), and −1.89 km at Tranquility Base (published ≈ −1.9 km). The SLDEM layer was regressed on it over 36,894 pixels (height = −8.819 km + 77.16 m × value; mean residual under half a step). Heights are smoothed after decoding to remove the 77 m steps.
- Esri's Mars tiles are LERC version 1 rasters, decoded by `src/explorer/Lerc1.ts`, a port of the Lerc1 part of Esri's open-source LercDecode.js (Apache-2.0, github.com/Esri/lerc). Spot checks: Jezero floor −2.64 km, Hellas floor −6.0 km, Olympus Mons summit area +20 km.
- Esri's Moon DEM service (`OnMoon/LOLA_Kaguya`) lists float tiles but closed every tile request when probed (2026-11-10); Trek is used instead.
- Removed from the landmarks, with reasons in comments in `src/explorer/Landmarks.ts`: Shackleton (Moon) and Planum Boreum (Mars), where polar tiles break down; Verona Rupes (Miranda), with no map or elevation data; and all five Titan and five Venus sites, whose landings showed only haze over a blurred map. Titan's and Venus's streamed maps still show from orbit.

## Photorealistic 3D Earth (added)

Close to Earth (below 1,500 km, on the ground, and flying low), `src/rendering/PhotorealEarth.ts` streams **Google Photorealistic 3D Tiles** from the Google Maps Platform Map Tiles API (`tile.googleapis.com/v1/3dtiles`). It needs your own API key with the Map Tiles API enabled, set as `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` (gitignored; never commit it). Without a key, Earth falls back to the streamed imagery and Terrain Tiles above. Use is under the Google Maps Platform Terms of Service: the data attributions Google returns are shown on screen while tiles are visible (bottom right), the tiles are not cached beyond the session, and Google's terms also ask for the Google Maps logo alongside them. Restrict the key to your site's domain (HTTP referrer) in Google Cloud Console, since a browser app's key is visible to its users.

Rendering uses **3d-tiles-renderer** 0.4.28 (NASA-AMMOS, Apache-2.0), with the Draco decoder from three.js (`public/draco/`, Apache-2.0).

## Earth flight data (added)

- **Live weather**: [Open-Meteo](https://open-meteo.com/) forecast API (current cloud cover, weather code, precipitation, wind, visibility), free, no key, CC BY 4.0. Asked again after 10 minutes or 80 km (`src/flight/EarthClouds.ts`).
- **Place names**: OpenStreetMap Nominatim reverse geocoder (`src/explorer/ReverseGeocode.ts`) and search (`src/explorer/EarthSearch.ts`), © OpenStreetMap contributors, ODbL; within Nominatim's usage policy (at most one request a second, cached by area).
- **Procedural buildings (experimental, off by default)**: building outlines and heights from [OpenFreeMap](https://openfreemap.org/) vector tiles (OpenMapTiles schema), © OpenMapTiles, data © OpenStreetMap contributors (`src/explorer/ProceduralCity.ts`). Google's Map Tiles policies should be checked before showing these together with Google's tiles publicly.
- **Vector tile decoding**: `@mapbox/vector-tile` 2.0.5 (BSD-3-Clause) and `pbf` 4.0.2 (BSD-3-Clause), already part of `3d-tiles-renderer`'s dependencies.

