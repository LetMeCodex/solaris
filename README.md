# SOLARIS — Solar System & Milky Way Explorer

[![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=flat&logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-110%20passing-success?style=flat&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Live:** https://letmecodex.github.io/solaris/

SOLARIS is a real-time, interactive 3D model of the Solar System built with **Three.js (WebGL2)**, **React** and **TypeScript**. Bodies are placed from published NASA JPL orbital elements for the current date, oriented with IAU rotation models, and set against a correctly aligned sky; you can zoom out continuously to a stylised Milky Way and its central black hole.

It is an explorer, not a navigation-grade ephemeris: positions come from two-body Keplerian elements (accuracy figures below), and the default view compresses distances and enlarges bodies so that everything fits on one screen.

---

## What is modelled

### Orbits (all in the J2000 ecliptic frame, time argument TDB)

| Bodies | Element source | Accuracy (checked in `src/tests/ephemerisAccuracy.test.ts`) |
| :--- | :--- | :--- |
| 8 planets | JPL SSD *Keplerian Elements for Approximate Positions of the Major Planets*, Table 1 (Standish), with linear secular rates; valid 1800–2050 | < 0.25° heliocentric direction vs. a VSOP87-based ephemeris in 2026 and 2040 (typically < 0.05°) |
| Earth's Moon | JPL SSD satellite mean elements, with apsidal (6.0 yr) and nodal (18.6 yr) precession | < 2° vs. JPL Horizons (0.7° on 2026-10-14) |
| 21 other moons | JPL Horizons osculating elements at 2026-10-14 TDB, advanced with each moon's mean sidereal period | exact at the epoch; Titan is within 5° when propagated back 26.8 years |
| Pluto, Ceres, 9 asteroids | JPL Small-Body Database osculating elements at their published epochs | two-body; degrades slowly away from the element epoch |

- **Kepler solver:** Newton–Raphson on `M = E − e sin E` (tolerance 1e-12), with a high-eccentricity starter.
- **Time:** the clock runs in UTC; ephemerides use TDB ≈ UTC + 69.184 s (TT − UTC since 2017). J2000.0 is 2000-01-01 11:58:55.816 UTC.
- **Main belt:** 3,200 instanced rocks with synthetic elements (seeded Mulberry32, seed `19890825`), Kirkwood gaps at the 3:1, 5:2, 7:3 and 2:1 resonances. The rocks are statistical, not real asteroids.

### Orientation and rotation

- **Planets, Sun, Pluto, Ceres, Vesta, Eros, Gaspra, Ida:** IAU WGCCRE 2015 pole (α₀, δ₀) and prime meridian W(d). Earth's sub-solar point therefore matches the real time of day, and Saturn's rings are edge-on to Earth at the March 2025 ring-plane crossing (both are unit-tested).
- **Bennu, Ryugu:** published spacecraft-derived poles and periods.
- **Moons:** synchronous rotation — the pole follows the orbit normal and longitude 0 faces the parent. Hyperion (chaotic rotator) uses a simple spin.

### Sky

- **Stars:** Hipparcos (ESA 1997) positions, rotated from ICRF into the ecliptic render frame. The shipped file holds 12,596 stars: all 1,016 stars with V ≤ 4.6 on the celestial sphere, plus 12,281 stars within 120 pc drawn in 3D when you zoom out past the Solar System. `scripts/build_star_subset.cjs` regenerates it from the full 41,394-star (V ≤ 8.0) catalogue in `data/source/`.
- **Constellation figures:** stick figures for nine bright constellations and asterisms (Ursa Major, Orion, Cassiopeia, Crux, Cygnus, Leo, Scorpius, Canis Major, Lyra). This is not the full set of 88.
- **Milky Way:** the ESA/Gaia all-sky map, aligned with the galactic frame (north galactic pole RA 192.859°, Dec +27.128°).

### Multiscale zoom

Each zoom tier is drawn at its own scale, and the HUD distance readout converts with the scale actually on screen:

| Tier | Render scale |
| :--- | :--- |
| Close-up of a body | that body's globe radius (km) |
| Solar System | `D = 50 + 65 · r^0.58` units for heliocentric distance r in AU |
| Local stars (< 120 pc) | 700 + 38 units per parsec, so the nearest stars sit beyond Pluto |
| Milky Way | 1,320 units per kpc; Sun at R₀ = 8.277 kpc, 21 pc above the mid-plane |

The galaxy is an artist's face-on disk (NASA/JPL-Caltech/ESO, R. Hurt) plus 14,000 procedurally placed stars, oriented to the real galactic frame. The LMC, SMC and Sagittarius dwarf are placed at their measured galactocentric positions. Sagittarius A* uses GRAVITY/EHT physical parameters for its readouts; the shader is an artistic ray-marched rendering with approximate light bending, not a general-relativistic ray tracer.

### Observation camera & lens

Selecting a body flies an *observation camera* to it, modelled on a real spacecraft camera:

- **Distance from real radii.** The camera holds an altitude that reproduces the reference shot over Earth (13,500 km ≈ 2.12 R⊕) and scales with √R, so NASA radii keep their ordering on screen. Jupiter overfills the frame (≈ 38° angular radius), Earth spans about two-thirds of it (≈ 19°), and the Moon is clearly smaller (≈ 11°). The HUD reports the altitude above the surface.
- **Wide 55° lens, off-centre composition.** The vertical FOV is ≈ 87° horizontally on 16:9. The planet sits in the left third, so true rectilinear perspective stretches its limb towards the frame edge. That is where the spherical, "seen through a lens" curvature comes from — the geometry itself, not a fake warp.
- **Milky Way-aware vantage.** Among sunlit three-quarter viewpoints (≈ 55° phase), the camera chooses the one whose open side of the frame looks along the real galactic plane, so the band crosses behind the planet. Saturn's view is lifted 30° out of the ring plane on the sunlit side.
- **Free look.** Right-drag or the arrow keys turn the camera in place, like steering an observer's head. Double-click returns to the composed shot.
- **Lens profiles** (`L` cycles):
  - *Cinematic*: bloom from sources brighter than white, mild barrel distortion, off-axis softness, lateral chromatic aberration, natural vignetting, film grain, and rotational motion blur when the camera turns.
  - *Fisheye*: a strong barrel lens with a circular image circle.
  - *Clean*: no post-processing, for scientific inspection.
  - Motion blur re-projects each pixel's view ray with the previous frame's orientation. It is exact for the sky, and a tracked planet that moves with the camera is not smeared. It is disabled under `prefers-reduced-motion`.
- **Resolved Milky Way.** 26,000 pinpoint stars are importance-sampled from the Gaia map (weight ∝ brightness² × cos b), so star density follows the real band, bulge and dust lanes. The panorama's off-plane count noise is filtered to a clean black sky.

### Scale modes

- **Exploration** (default): compressed distances; planet sizes keep true ratios to Earth (Sun shrunk to 48 units).
- **True Distances:** linear distances, 1 unit = 1,000,000 km. Globes are enlarged 4× (minimum 15,000 km radius) so they stay visible, and moons that would land inside an enlarged parent are pushed just outside it.

---

## Interface

- Planet selector, cinematic camera with a sunlit three-quarter vantage, and a planetary monograph.
- Timeline: pause/play, 1× to 1 year/s, J2000 and Now shortcuts, and a date jump. The readout shows UTC and the UTC Julian Date.
- Catalogue drawer with all 43 entries (42 Solar System bodies + Sgr A*), filters and search.
- Scale jumps: Planet, Inner System, Outer System, Interstellar, Milky Way, Sgr A*.
- The overlay is keyboard-accessible: toggles expose `aria-pressed`, icon-only buttons have labels, and focus rings are visible.

| Key | Action |
| :--- | :--- |
| `Space` | Pause / play |
| `H` | Hide / show HUD |
| `O` | Orbit lines |
| `C` | Constellation figures |
| `B` | Asteroid belt |
| `L` | Cycle lens: Cinematic / Fisheye / Clean |
| Arrow keys / right-drag | Free look (turn the camera in place) |
| Double-click | Return free look to the composed shot |
| Left-drag / Shift-drag or middle-drag / wheel | Orbit / pan / zoom |
| `Esc` | Close drawers / reset to overview |

---

## Getting started

```bash
git clone https://github.com/LetMeCodex/solaris.git
cd solaris
npm install
npm run dev          # http://localhost:5173/solaris/
```

| Script | What it does |
| :--- | :--- |
| `npm test` | 110 Vitest tests in 17 files: Kepler solver, ephemeris accuracy against JPL/VSOP87 references, IAU orientation, sky frames, scale model, catalogue integrity, texture cache, camera rig, observation framing and lens warp |
| `npm run lint` | ESLint (TypeScript + React hooks rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | type-check, then a Vite production build into `dist/` |
| `npm run build:stars` | regenerate `public/data/stars.json` from the full catalogue |

### Deployment

`.github/workflows/deploy.yml` runs lint, tests and the build on every push and pull request. Pushes to `main` then publish `dist/` to the `gh-pages` branch, which GitHub Pages serves.

---

## Data and asset credits

See [ASSETS.md](./ASSETS.md) for sources, licences and the attribution required for each dataset and texture. In short: orbital elements from NASA JPL (public domain), rotation models from the IAU WGCCRE, stars from ESA Hipparcos (CC BY-NC 3.0 IGO), sky map from ESA/Gaia/DPAC (CC BY-SA 3.0 IGO), and planet textures from Solar System Scope (CC BY 4.0).

## License

Code: [MIT](./LICENSE). Third-party data and textures keep their own licences (see ASSETS.md).
