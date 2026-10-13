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
| `gaia_sky.webp` | All-sky map in galactic coordinates (equirectangular, l = 0 at centre) | ESA/Gaia/DPAC, CC BY-SA 3.0 IGO. Credit: "ESA/Gaia/DPAC". Re-encoded to WebP (q75, 4000×2000). |
| `milky_way_disk.webp` | Face-on Milky Way disk with alpha, used for the 3D galaxy | *Artist's impression of the Milky Way* (NASA/JPL-Caltech/ESO/R. Hurt, ESO eso1339e), CC BY 4.0. Resized to 2048², colour-graded and alpha-masked (black background → transparent) with a local preprocessing script, then re-encoded to WebP. |
| `thumbs/*.webp` | 128×64 HUD thumbnails | Downscaled from the planet textures below (same licences). |

## 5. Planet textures (`public/textures/`)

| Files | Source & licence |
| :--- | :--- |
| `2k_sun.jpg`, `2k_mercury.jpg`, `2k_venus_atmosphere.jpg`, `2k_earth_daymap.jpg`, `2k_earth_nightmap.jpg`, `2k_earth_clouds.jpg`, `2k_moon.jpg`, `2k_mars.jpg`, `2k_jupiter.jpg`, `2k_saturn.jpg`, `2k_saturn_ring_alpha.png`, `2k_uranus.jpg`, `2k_neptune.jpg` | **Solar System Scope** (INOVE), https://www.solarsystemscope.com/textures/ — CC BY 4.0, derived from NASA imagery. Credit: "Textures: Solar System Scope (CC BY 4.0)". |
| `earth_normal_2048.jpg`, `earth_lights_2048.png` | three.js example textures (`examples/textures/planets/`), MIT licence; byte-identical to three.js r170. |

Bodies without a texture (most moons and asteroids) use procedural canvas textures generated at runtime (`TextureGenerator.ts`). The same generator provides offline fallbacks if a texture fails to load.

`scripts/download_textures.cjs` re-fetches the planet textures from these original publishers.

## 6. Galactic constants

| Quantity | Value | Source |
| :--- | :--- | :--- |
| Sun–Galactic Centre distance R₀ | 8.277 kpc | GRAVITY Collaboration (2022), A&A 657, L12 |
| Sun height above the mid-plane | 20.8 pc | Bennett & Bovy (2019), MNRAS 482, 1417 |
| Sgr A* mass | 4.297 × 10⁶ M☉ | GRAVITY Collaboration (2022) |
| Sgr A* shadow diameter | 51.8 ± 2.3 µas | Event Horizon Telescope Collaboration (2022), ApJL 930, L12 |
| Galactic frame | NGP RA 192.85948°, Dec +27.12825°; GC RA 266.40499°, Dec −28.93617° | IAU 1958 system in ICRS |
| LMC / SMC / Sgr dSph positions | (l, b, d) = (280.47°, −32.89°, 49.59 kpc) / (302.80°, −44.30°, 62.44 kpc) / (5.6°, −14.2°, ~26.5 kpc) | Distances: Pietrzyński et al. 2019 (LMC); Graczyk et al. 2020 (SMC); commonly adopted value (Sgr dSph) |

The 3D galaxy's spiral structure follows the disk artwork above; its 14,000 additional stars are procedurally placed.
