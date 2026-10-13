# SOLARIS: Infinite Scale Engine & Reference Audit

## 1. Executive Summary & Objective

This document establishes the empirical research, scientific verification, and engineering architecture for the **SOLARIS Infinite Scale Engine & Multiscale Universe Navigation System**. 

The goal is to expand SOLARIS from a single solar-system view into an infinite, continuous multiscale cosmos visualization spanning **nine orders of magnitude**:
1. **Planetary Close-up & Satellites** ($10^0 - 10^1$ units, $\sim 10^3 - 10^6\text{ km}$)
2. **Inner Solar System** ($10^1 - 10^2$ units, $\sim 0.3 - 2.0\text{ AU}$)
3. **Outer Solar System & Kuiper Belt** ($10^2 - 10^3$ units, $\sim 5 - 50\text{ AU}$)
4. **Heliopause & Local Interstellar Bubble** ($10^3 - 10^4$ units, $\sim 100\text{ AU} - 10\text{ ly}$)
5. **Milky Way Galaxy Exterior View** ($10^4 - 10^6$ units, $\sim 10\text{ ly} - 100\text{ kpc}$)

---

## 2. Playwright-Driven Reference Observations

### 2.1 NASA Eyes on the Solar System (`https://eyes.nasa.gov/apps/solar-system/`)
Observed in headless Chromium (1920×1080) at live epoch `2026-10-13`:

- **Inner Solar System View (`#/home`)**:
  - Orbits rendered as thin anti-aliased elliptical splines with subtle color grading (cyan for Earth, golden-orange for Mars, cream for Venus, purple for Mercury).
  - Trajectory lines for active missions (Europa Clipper, Parker Solar Probe, Psyche, Roman Space Telescope).
  - Dynamic scale-aware labeling: Target names appear alongside small circular reticles.
- **Continuous Logarithmic Zoom-Out (`#/home` with wheel events)**:
  - As camera altitude increases, inner planet orbits cluster together.
  - Orbit opacity smoothly fades as scale expands beyond the planetary domain.
  - The Sun seamlessly transitions from an illuminated 3D sphere into a radiant luminous point source / star glyph.
  - Planetary clutter dissolves cleanly to prevent visual overlap.
- **Target Close-Up (`#/uranus`)**:
  - Focus locks on target body with responsive composition offset.
  - Natural solar directional lighting: limb illumination and soft shadowed terminator.
  - Concentric faint ring planes and satellite orbit tracks (Miranda, Ariel, Umbriel, Titania, Oberon).

### 2.2 User Reference Video Analysis (`Desktop 2026.10.13 - 16.35.57.02.mp4`)
- Duration: 20.09s, 1920×1080 @ 120fps.
- Trajectory:
  - User starts at outer solar system / Uranus orbit scale.
  - Performs smooth logarithmic pull-out towards interstellar distance where the Sun collapses to a solitary bright marker.
  - Smoothly pushes camera back inward into the planetary disc towards Jupiter, Saturn, and inner planet orbits.
  - **Key takeaway**: Camera zooming is continuous, logarithmic, and free of abrupt snapping or near/far plane clipping artefacts.

### 2.3 Sojourner (`https://sojourner.artificialisabel.com`)
- High-contrast, pitch-black space background without milky gamma blowout.
- Faint starlight dust and pin-sharp star points.
- Tactile editorial HUD typography and minimalist status telemetry.

---

## 3. Scientific Data Provenance & Ephemeris Verification

### 3.1 JPL Horizons Ephemeris Comparison (Epoch 2026-Oct-13 00:00:00 TDB)
Live queries executed against `https://ssd.jpl.nasa.gov/api/horizons.api`:

| Celestial Body | Parameter | JPL Horizons Value | SOLARIS Baseline | Variance / Accuracy |
| :--- | :--- | :--- | :--- | :--- |
| **Earth** (399) | Semi-major axis ($a$) | $1.49716 \times 10^8\text{ km}$ ($1.00079\text{ AU}$) | $1.000\text{ AU}$ | $< 0.1\%$ |
| | Eccentricity ($e$) | $0.016918$ | $0.0167$ | Matches within Keplerian epoch osculation |
| | Inclination ($i$) | $0.003^\circ$ | $0.000^\circ$ | Reference ecliptic plane |
| | Mean Anomaly ($M$) | $280.65^\circ$ | Kepler Solver calculated | Synchronized |
| **Jupiter** (599) | Semi-major axis ($a$) | $7.78403 \times 10^8\text{ km}$ ($5.203\text{ AU}$) | $5.204\text{ AU}$ | $< 0.02\%$ |
| | Eccentricity ($e$) | $0.04816$ | $0.0484$ | $< 0.5\%$ |
| | Inclination ($i$) | $1.3034^\circ$ | $1.305^\circ$ | $< 0.1\%$ |
| | Mean Anomaly ($M$) | $112.92^\circ$ | Kepler Solver calculated | Synchronized |

### 3.2 Galactic & Solar Constants (NASA Science Verified)
From `https://science.nasa.gov/universe/exoplanets/our-milky-way-galaxy-how-big-is-space/` and `https://science.nasa.gov/sun/facts/`:
- **Milky Way Diameter**: $100,000\text{ light-years}$ ($\approx 30.6\text{ kpc}$ / $\approx 9.46 \times 10^{17}\text{ km}$).
- **Disk Thickness**: $1,000\text{ light-years}$ ($\approx 300\text{ pc}$).
- **Sun Distance to Galactic Center ($R_0$)**: $26,000\pm 1,000\text{ light-years}$ ($\approx 8.0\text{ kpc}$).
- **Sun Location**: Orion Spur (Local Arm) between the Sagittarius and Perseus arms.
- **Sun Galactic Orbital Speed**: $\approx 220\text{ km/s}$ ($\approx 450,000\text{ mph}$).
- **Sun Galactic Orbital Period**: $\approx 230\text{ million Earth years}$ (1 cosmic year).
- **Nearest Stellar Systems**:
  - Alpha Centauri (A, B: $4.37\text{ ly}$, Proxima: $4.24\text{ ly}$)
  - Barnard's Star ($5.96\text{ ly}$)
  - Wolf 359 ($7.78\text{ ly}$)
  - Sirius ($8.6\text{ ly}$)

---

## 4. The Infinite Scale Engine: Mathematical Architecture

### 4.1 Logarithmic Distance Mapping
In a standard linear camera rig, zooming at large distances becomes glacially slow, while zooming close to a planet causes uncontrollable clipping. We define a logarithmic scale parameter $\lambda \in [0, 1]$:

$$D(\lambda) = D_{\min} \cdot \left(\frac{D_{\max}}{D_{\min}}\right)^{\lambda}$$

$$\lambda(D) = \frac{\ln(D / D_{\min})}{\ln(D_{\max} / D_{\min})}$$

With $D_{\min} = 0.5$ (planetary surface inspection) and $D_{\max} = 150,000$ (external Milky Way overview).
For any scroll input $\Delta y$:

$$\lambda \leftarrow \text{clamp}\left(\lambda + \Delta y \cdot k_{\text{scroll}},\, 0,\, 1\right)$$

This guarantees smooth, perceptually constant exponential zoom across all 9 orders of magnitude.

### 4.2 Dynamic Coordinate Anchor Handoff
As the camera zooms across boundaries:
1. **Target Anchor ($D < 300$)**: Camera orbits the currently selected celestial body (Earth, Mars, Jupiter, etc.).
2. **Solar System Barycenter ($300 \le D < 4,000$)**: Camera orbits the Sun/Barycenter, observing the collective planetary discs and Kuiper Belt.
3. **Local Interstellar ($4,000 \le D < 25,000$)**: Sun is a luminous point; true 3D Hipparcos stars within $100\text{ pc}$ exhibit genuine motion parallax.
4. **Galactic Frame ($D \ge 25,000$)**: Camera pulls back above the galactic plane to reveal the external 3D Milky Way spiral disk, with a luminous locator indicating the Sun in the Orion Spur.

### 4.3 Velocity-Aware Travel Cues
To communicate immense speeds without unrealistic fake warp tunnels, near-field space dust particles react to camera velocity $\mathbf{v} = \frac{d\mathbf{p}}{dt}$:
- Particle elongation factor: $L = 1.0 + \min(18.0, \|\mathbf{v}\| \cdot 0.12)$
- Line orientation: aligned with $-\mathbf{v} / \|\mathbf{v}\|$
- Opacity: scales up during high-speed transitions, vanishing when camera is stationary.

### 4.4 Real-Time HUD Scale Indicator
The HUD dynamically formats the active camera-to-focus distance into real physical astronomical units:
- $D < 0.1\text{ AU} \implies \text{Kilometers (km)}$
- $0.1\text{ AU} \le D < 1,000\text{ AU} \implies \text{Astronomical Units (AU)}$
- $1,000\text{ AU} \le D < 1,000\text{ ly} \implies \text{Light-Years (ly)}$
- $D \ge 1,000\text{ ly} \implies \text{Kiloparsecs (kpc)}$
