# SOLARIS — Scientific Solar System Explorer

[![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=flat&logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-41%20Passing-success?style=flat&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SOLARIS** is a scientifically grounded, real-time interactive 3D Solar System reconstruction built with **Three.js (WebGL2)**, **React**, and **TypeScript**.

The application renders an astronomical environment where celestial bodies obey two-body Keplerian astrodynamics, physically grounded material shaders, and astronomical coordinate frames.

---

## Architecture & Engineering Core

### 1. Astrodynamics & Orbit Propagation
* **Kepler Solver**: Analytical Newton-Raphson iteration solving Kepler's Equation:
  $$M = E - e \sin E$$
  with dynamic starters tailored for eccentricity ($e < 0.18$ vs high-$e$) converging to double-precision tolerance ($\epsilon < 10^{-12}$).
* **Parent-Relative Moon Astrodynamics**:
  Natural satellites (Earth's Moon, Phobos, Deimos, Galilean moons, Titan, Triton, Charon) propagate with their parent body's gravitational parameter:
  $$\mu = GM_{\text{parent}} + GM_{\text{satellite}}$$
  guaranteeing exact orbital periods (Earth's Moon: 27.32 d, Phobos: 0.319 d, Europa: 3.55 d, Titan: 15.95 d, Triton: 5.88 d, Charon: 6.39 d).
* **Coordinate Frames**:
  Analytical, orthogonal, and invertible rotations between:
  1. Heliocentric Ecliptic J2000.0 Frame
  2. International Celestial Reference Frame (ICRF / Equatorial J2000.0) via standard obliquity $\epsilon = 23.43929111^\circ$
  3. Three.js Cartesian WebGL Coordinates

### 2. Rendering Pipeline & Materials
* **Scale Invariance**: All base planetary spheres are constructed with unit radius ($R=1.0$). Scaling is applied via the mesh transform matrix, guaranteeing that switching between **Exploration** mode and **Scientific 1:1** mode never causes compounding scale drift or oblateness corruption.
* **Earth Multi-Layer Atmosphere**:
  * PBR surface map with normal relief.
  * Night-side city lights driven by a GLSL fragment shader with clean terminator transition:
    $$\text{nightFactor} = 1.0 - \text{smoothstep}(-0.20, 0.05, \mathbf{n} \cdot \mathbf{l})$$
  * Rotating cloud deck with luminance alpha transparency mask, preventing dark fog over oceans.
  * Thin azure Rayleigh scattering limb glow.
* **Saturn Ring System**:
  * Annular double-sided geometry ($R_{\text{inner}} = 1.32$, $R_{\text{outer}} = 2.65$) with radial UV texture mapping rendering the A, B, and C rings with the Cassini Division.
  * Dynamic oblateness flattening ($f = 0.09796$).
* **Stellar Magnitude Sizing**:
  * 41,394 stars from the ESA Hipparcos Astrometry Catalogue ($V \le 8.0$).
  * Apparent magnitude point-sizing in GLSL preserving stellar brightness hierarchy (Sirius at $\sim 6.7\text{px}$, Vega at $\sim 5.8\text{px}$, naked-eye limit at $\sim 1.5\text{px}$).

### 3. Main Asteroid Belt Synthesis
* **Deterministic Distribution**: 3,200 instanced rocks distributed across $2.12$ to $3.28\text{ AU}$ using a seeded Mulberry32 pseudo-random generator (`seed: 19890825`) for 100% reproducible belt layouts across reloads.
* **Kirkwood Gaps**: Physically simulated depletion at the 3:1 ($2.50\text{ AU}$), 5:2 ($2.82\text{ AU}$), 7:3 ($2.96\text{ AU}$), and 2:1 ($3.27\text{ AU}$) orbital resonances with Jupiter.

### 4. Author-Grade Interface & Controls
* **Timeline Scrubber**: Real-time simulation clock with J2000.0 epoch synchronization, Julian Date display, date jump picker, and $1\times$ to $1\text{ yr/s}$ time multipliers.
* **Target Monograph**: Contextual telemetry displaying body category, mean radius, oblateness, orbital elements, distance, and orbital speed.
* **42-Body Catalogue Drawer**: Full slide-out index categorized into Planets, Moons, Dwarf Planets, and Asteroids with instantaneous search.
* **Lifecycle & GPU Disposal**: Clean resource deallocation and event listener unmounting across renderer, camera rig, geometries, materials, and instanced meshes.

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Toggle simulation pause / play |
| `H` | Toggle HUD visibility |
| `O` | Toggle Keplerian orbit lines |
| `C` | Toggle IAU constellation lines |
| `B` | Toggle Asteroid Belt |
| `Escape` | Close active drawers / Reset view to overview |

---

## Getting Started

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

### Running Automated Tests

```bash
npm test
```

Runs 41 unit tests across 9 test suites verifying coordinates, epochs, astrodynamics, Kepler solver convergence, moon periods, scale invariance, catalogue integrity, and texture cache consistency.

### Building for Production

```bash
npm run build
```

Compiles TypeScript and bundles via Vite into `dist/`.

---

## Scientific Data Provenance

See [ASSETS.md](./ASSETS.md) for full catalogue record counts, licenses, and reference URLs.

* **Orbital Elements**: NASA / JPL SSD Horizons J2000.0 osculating elements.
* **Planetary Physical Constants**: IAU Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE).
* **Star Catalogue**: ESA Hipparcos Astrometry Mission (41,394 stars down to $V \le 8.0$).
* **Planetary Maps**: NASA Earth Observatory, USGS Astrogeology Science Center, NASA Cassini & Voyager missions.

---

## License

[MIT](./LICENSE)
