# SOLARIS — Asset Manifest & Provenance Documentation

This document records the provenance, licenses, resolution, and astronomical sources for all bundled and external datasets in SOLARIS.

---

## 1. Celestial Catalogue & Ephemeris Data

### 1.1 42-Body Solar System Catalogue
- **Source**: NASA Jet Propulsion Laboratory (JPL) Horizons Ephemeris System & Solar System Dynamics Group.
- **Reference Frame**: ICRF / Heliocentric Ecliptic J2000.0 (`J2000.0`, JD 2451545.0, `2000-01-01T12:00:00.000Z`).
- **Physical Quantities**:
  - Gravitational Parameters ($\mu = GM$ in $\text{km}^3/\text{s}^2$): JPL Planetary Physical Parameters (Standish, Folkner, Jacobson et al.).
  - Radii & Oblateness: IAU Working Group on Cartographic Coordinates and Rotational Elements (Archinal et al.).
  - Orbital Elements: Keplerian two-body approximations derived from JPL SSD Horizons Osculating Orbital Elements.
- **Scope**:
  - 1 Star (Sun)
  - 8 Major Planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)
  - 22 Natural Satellites (Earth: Moon; Mars: Phobos, Deimos; Jupiter: Io, Europa, Ganymede, Callisto; Saturn: Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Hyperion, Iapetus; Uranus: Miranda, Ariel, Umbriel, Titania, Oberon; Neptune: Triton; Pluto: Charon)
  - 2 Dwarf Planets (Pluto, Ceres)
  - 9 Selected Asteroids (Vesta, Pallas, Hygiea, Psyche, Eros, Gaspra, Ida, Bennu, Ryugu)
- **License**: Public Domain (NASA Open Data Policy).

---

## 2. Stellar Background & Constellations

### 2.1 Hipparcos Star Catalogue (`public/data/stars.json`)
- **Source**: European Space Agency (ESA) Hipparcos Astrometric Mission (ESA SP-1200, 1997).
- **Record Count**: 41,394 stars complete down to visual magnitude $V \le 8.0$.
- **Columns**: Hipparcos ID (`HIP`), ICRF Cartesian Unit Vectors $(X, Y, Z)$, Apparent Magnitude ($V_{\text{mag}}$), Color Index ($B-V$), Distance (parsecs), Spectral Class.
- **Color Mapping**: Planckian black-body approximation derived from $B-V$ color index (Classes O, B, A, F, G, K, M).
- **Constellation Asterisms**: 88 International Astronomical Union (IAU) official constellation boundaries and major asterism line segments (Ursa Major, Orion, Cassiopeia, Crux, Cygnus, Leo, Scorpius, Canis Major).
- **License**: ESA Open Data Policy / CDS Strasbourg.

---

## 3. Surface Textures & Maps

### 3.1 Planetary Surface Maps (`public/textures/`)
- **Sun Photosphere**: SOHO / SDO / NASA (2048x1024 diffuse map).
- **Terrestrial Worlds**:
  - Mercury: NASA MESSENGER MDIS global mosaic.
  - Venus: NASA Magellan SAR radar surface reflectivity & synthetic color composite.
  - Earth: NASA Blue Marble: Next Generation (MODIS visible composite); Earth at Night (NASA / NOAA Suomi NPP VIIRS DNB city lights); Cloud Shell (NASA GOES / MODIS cloud mosaic).
  - Mars: USGS Astrogeology Science Center / NASA Viking MDIM 2.1 global mosaic.
- **Gas & Ice Giants**:
  - Jupiter: NASA Cassini ISS global cylindrical map.
  - Saturn: NASA Cassini ISS equirectangular mosaic.
  - Saturn Rings: NASA Cassini ISS calibrated radial optical depth and alpha transparency profile.
  - Uranus: NASA Voyager 2 synthetic true-color mosaic.
  - Neptune: NASA Voyager 2 narrow-angle camera cylindrical projection.
- **Moons & Minor Bodies**:
  - Moon: NASA Lunar Reconnaissance Orbiter (LRO) LROC WAC global morphologic mosaic.
  - Galilean Moons (Io, Europa, Ganymede, Callisto): NASA Galileo SSI / USGS composite maps.
  - Titan: NASA Cassini VIMS / ISS radar-optical composite.
  - Pluto & Charon: NASA New Horizons LORRI / MVIC global encounter mosaics.
  - Ceres & Vesta: NASA Dawn Framing Camera (FC) global mosaics.
- **License**: Public Domain (NASA / USGS / ESA Open Access). Procedural fallbacks generated via HTML5 Canvas for zero-downtime offline operation.

### 3.2 Deep Space Background
- **Milky Way Panorama**: ESO / Serge Brunier (European Southern Observatory 360° panoramic photographic survey of the celestial sphere).
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0).

---

## 4. Main Asteroid Belt Synthesis
- **Model**: Kirkwood resonance gaps at 3:1 ($2.50\text{ AU}$), 5:2 ($2.82\text{ AU}$), 7:3 ($2.96\text{ AU}$), and 2:1 ($3.27\text{ AU}$, Hecuba gap) with Jupiter.
- **RNG**: Deterministic seeded 32-bit pseudo-random generator (Mulberry32, seed `19890825`).
- **Composition Distribution**: 70% C-type (carbonaceous), 20% S-type (silicaceous), 10% M-type (metallic).
