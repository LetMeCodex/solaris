Title: Observatory HUD, cinematic flights, ray-traced Sgr A*, real Pluto and galactic map

## What changed

**HUD (new instrument language, `src/ui/HUD/hud.css`, `Instruments.tsx`, `Controls.tsx`, `Voyage.tsx`)**
- Hairline glass panels with corner brackets, phosphor LEDs, CRT boot-in, helmet parallax, status toasts. SOLARIS wordmark and the left planet list are unchanged.
- Attitude scope, target-lock brackets, scale ladder, Optics menu (lens, distance scale, layers, shortcuts).
- Chrono throttle (draggable time-rate lever) with an odometer-style date.
- Explorer panel is now a compact tabbed slate (Survey / Waypoints / Skies) that no longer covers the header.
- Voyages: letterbox during flights, route rail with real orbit crossings, distance / light-time / Voyager-time readouts, arrival stamp, persistent logbook.
- Galactic plot: borderless tilted Milky Way (turns face-on on hover, names the arms), Sun beacon, Solar System loupe with live planet positions; click to fly.

**Camera (`CameraRig.ts`)**
- Flights dolly in log space with an altitude arc, take the shortest way round, widen the lens at cruise and bank slightly; duration scales with the real route distance (≈2.4 s to the Moon, ≈9 s to Sgr A*).
- Observation distance scales with R^0.65, so gas giants overfill the frame and small worlds read small.

**Sagittarius A* (`SagittariusAStar.ts`, `BlackHoleInfall.ts`, `HorizonView.ts`)**
- Backward ray tracing on Schwarzschild null geodesics; shadow, lensed far-side disk and photon rings come out of the integration. Page–Thorne temperatures, Doppler × gravitational shift, blackbody colour, g⁴ brightness, Keplerian shear. Shot framed on the disk's own axis to match the reference footage.
- Infall simulation in distant-observer time: rocks spiral in on timelike geodesics, Sun-like stars are tidally disrupted at ≈8.9 r_s, light below the critical impact parameter is captured. Infalling bodies are drawn unlensed.
- New "Horizon" viewpoint from a hypothetical ocean world at 20 r_s, with real time-dilation, tidal-stretch and shadow-size readouts.

**Pluto / Charon**
- New Horizons textures (NASA/JHUAPL/SwRI, public domain; credited in `ASSETS.md`). Moons use true radii and can no longer sit inside their planet.

## Reviewer notes
- This branch also contains work that was already uncommitted in the working tree before these changes (explorer, lens pipeline, star-catalogue data, scripts, screenshots); the new code depends on it.
- The Sgr A* disk brightness is cinematic: the real Sgr A* accretes too slowly to glow like this. The geometry and frequency shifts are physical.
- Unimaged southern latitudes of Pluto and Charon (polar night in 2015) are muted fills.
- `npx tsc --noEmit`, `npx vitest run` (129 tests) and `npx vite build` pass. ESLint was not run: `@eslint/js` is not installed.
