# SOLARIS — Ultra-Realistic, Physics-Grounded, Interactive Solar System Explorer

[![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=flat&logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-22%20Passing-success?style=flat&logo=vitest)](https://vitest.dev/)

**SOLARIS** is an ultra-realistic, scientifically grounded, real-time interactive 3D simulation of the complete Solar System built with **Three.js (WebGL2)**, **React**, and **TypeScript**.

Inspired by high-end space visualization software (*Sojourner*, *Eyes on the Solar System*, *Celestia*), SOLARIS replaces generic educational planet cards and artificial HUD boxes with a living astronomical environment where celestial bodies obey Keplerian orbital mechanics, photorealistic physical shaders, and deep-space composition.

---

## Key Features

### 1. Photorealistic Planetary Rendering Pipeline
* **High-Resolution NASA/JPL/USGS Maps:** Bundled offline textures for the Sun, terrestrial planets, gas giants, and major moons.
* **Earth Multi-Layer Atmosphere:**
  * NASA Blue Marble day texture with mountain normal relief along the solar terminator.
  * Night-side city lights glowing dynamically on the unlit hemisphere ($\mathbf{N}\cdot\mathbf{L} < 0$).
  * Independent rotating cloud deck at $1.016\times$ radius with sidereal drift.
  * Atmospheric Rayleigh scattering shell with a thin azure blue Fresnel limb glow.
* **Saturn & Annular Ring System:**
  * Oblate spheroid gas giant geometry ($f = 0.098$) with polar hexagon and subtle cloud banding.
  * Translucent annular rings rendering the A, B, and C rings with a crisp **Cassini Division**.
* **The Sun:** Convective photosphere granulation map with multi-tiered inner plasma and outer corona halo glows.
* **Mars:** Olympus Mons, Valles Marineris canyon, polar ice caps, and a delicate amber CO2 atmospheric limb haze.
* **Jupiter:** Great Red Spot, turbulent alternating zonal jet streams, and orbital Galilean moons.

### 2. Keplerian Astrodynamics & Physics Core
* **Authoritative 42-Body Catalogue:** Sun, 8 Major Planets, 22 Moons, 2 Dwarf Planets (Pluto, Ceres), and 9 Named Asteroids.
* **Newton-Raphson Kepler Solver:** Iterative propagation of Kepler's Equation ($M = E - e\sin E$) converging to double-precision tolerance ($\epsilon < 10^{-12}$) for all orbital eccentricities.
* **Parent-Relative Moon Hierarchy:** Moons accurately orbit their parent planets in both Exploration and Scientific 1:1 scales.
* **Astronomical Time & Ephemerides:** Master simulation clock with Julian Date conversion, J2000.0 epoch synchronization, and variable time acceleration ($1\times$ to $1\text{ yr/s}$).

### 3. Cosmic Deep-Field Environment
* **ESO/NASA Milky Way Galactic Skybox:** High-resolution photographic galactic dust lane oriented at an astronomically accurate $62.9^\circ$ tilt to ICRF coordinates.
* **ESA Hipparcos Starfield (41,394 Real Stars):** Real astrometry dataset with Planckian blackbody B-V color temperatures and apparent magnitude point sizing.
* **IAU Constellations Network:** Interactive asterism vectors connecting major historical constellations.
* **Instanced Asteroid Belt (3,200 Objects):** Physically distributed Main Belt with Kirkwood mean-motion resonance gaps.

### 4. Author-Grade Editorial Interface
* **The universe is the product; the interface is a quiet instrument for discovering it.**
* Refrained from generic arcade scanlines, green crosshair reticles, and bulky cockpit meters.
* Minimal floating horizontal timeline scrubber with epoch shortcuts and calendar date picker.
* Contextual **Target Monograph** providing verified physical dimensions, Keplerian orbital elements, and real-time JPL DE440 telemetry.
* Full 42-body slide-out **Catalogue Drawer** with category filtering and instant search.

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Toggle simulation pause / play |
| `H` | Toggle HUD visibility for pure cinematic immersion |
| `O` | Toggle Keplerian orbit lines |
| `C` | Toggle IAU constellation lines |
| `B` | Toggle Asteroid Belt instanced mesh |
| `Escape` | Reset view / close open drawers |

---

## Getting Started

### Prerequisites
* Node.js 18+
* npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/LetMeCodex/solaris.git

# Navigate to project directory
cd solaris

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Running Unit Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

---

## Scientific Data Provenance & References

* **Ephemerides:** NASA JPL DE440 / ICRF J2000.0 Epoch Reference
* **Planetary Constants:** IAU Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE)
* **Star Catalogue:** ESA Hipparcos Astrometry Mission (I/239)
* **Surface Maps:** NASA Earth Observatory (Blue Marble), USGS Astrogeology Science Center, NASA JPL Cassini & Voyager Missions

---

## License

MIT License. Designed and engineered for scientific exploration and public education.
