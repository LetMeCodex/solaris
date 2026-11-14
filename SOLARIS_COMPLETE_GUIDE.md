# SOLARIS — Complete Technical & Feature Encyclopedia

> Comprehensive, standalone engineering and feature reference for the **Solaris** 3D WebGL2 Solar System Observatory, 6-DOF Multi-Planet Jet Simulator, Illustrated Storybook, Technical Field Report, and Remotion Launch Film.

## Executive Summary

- **Core Stack**: `React 18` (`^18.3.1`), `TypeScript` (`^5.6.3`), `Vite` (`^5.4.10`), `Three.js` (`^0.170.0` WebGL2), `3d-tiles-renderer` (`0.4.28`), `GSAP` (`^3.15.0`), `Tailwind CSS` (`^3.4.14`), and `Vitest` (`^2.1.3`).
- **Application Entry Points**:
  - `/` (`index.html` -> `src/main.tsx`): Main 3D Solar System Observatory (`FlightHUD`, Surface Explorer, Atlas, VELA Companion).
  - `/fly/` (`fly/index.html` -> `src/fly/main.tsx`): Dedicated live 3D jet preloader (`FlyPreloader`) launching directly into 6-DOF flight (`JetHUD`).
  - `/book/` (`book/index.html` -> `src/book/`): Interactive 3D-hinged illustrated storybook with a shared WebGL `Press` halftone/ink shader.
  - `/report/` (`report/index.html` -> `src/report/`): 16-chapter interactive technical field report with a 300-frame `ScrollHero`, 23 live figures, and a live WebGL `SkyBackground`.
  - `launch-video/`: Remotion (`1920 × 1080`, `30 fps`) launch films & trailers (`Launch`, `LaunchCinematic`, `Flight`) driven by a Playwright virtual-clock capture pipeline (`rig.mjs`).
- **Verified Repository & Asset Scale**:
  - **Source Coverage**: `237` files under `src/` (100% documented across Parts I–IX), plus root configs, `.github/workflows/`, `scripts/`, `docs/`, and `launch-video/`.
  - **Celestial Catalogue**: `479` bodies in `ALL_CELESTIAL_BODIES` (`1` Sun + `8` planets + `22` major moons + `2` dwarf planets + `9` asteroids + `437` minor moons synthesized from `moons.json` + `Daphnis`), with `478` searchable/explorable destination worlds excluding the Sun (`ExploredGauge`, `Hero.tsx`).
  - **NASA Spacecraft Fleet**: `174` spacecraft in `NASA_SPACECRAFT_CATALOG` across `7` mission groups, backed by `153` GLTF model directories (`165` `.gltf`/`.bin`, `929` `.webp`, `72` `.ktx2`) and `326` binary `.dyn` trajectory/attitude files.
  - **Audio & Voice**: `572` VELA AI companion cues (`public/voice/vela/vela-lines.json` & `572` `.mp3` files), `149` military radio `.mp3` clips, `28` jet SFX `.mp3` files, and `10` adaptive soundtrack `.mp3` tracks.
  - **Verification**: `39` Vitest test suites in `src/tests/*.test.ts` covering ephemerides, coordinate frames, IAU orientation, `.dyn` trajectories, Sagittarius A*, jet aerodynamics, telemetry, and UI/audio logic.

---

## Table of Contents

- [Part I: System Architecture, Precision Engineering, Pipelines & All Data/Asset Sources](#part-i-system-architecture-precision-engineering-pipelines--all-dataasset-sources)
  - [1. Tech Stack, Build Configuration & Deployment](#1-tech-stack-build-configuration--deployment)
  - [2. Dual-Route Application Architecture (`/` Observatory vs `/fly/` Jet Entry)](#2-dual-route-application-architecture--observatory-vs-fly-jet-entry)
  - [3. Floating Origin & Infinite Scale Engine Math](#3-floating-origin--infinite-scale-engine-math)
  - [4. Adaptive Quality Governor & Non-Blocking GPU CompileGate](#4-adaptive-quality-governor--non-blocking-gpu-compilegate)
  - [5. Texture Pipeline, Fast Off-Thread Decoding, Progressive Hi-Res & Compression](#5-texture-pipeline-fast-off-thread-decoding-progressive-hi-res--compression)
  - [6. Procedural Texture Synthesizer (`TextureGenerator`)](#6-procedural-texture-synthesizer-texturegenerator)
  - [7. Core Catalogue Schema, Manager & Minor-Moon Synthesis](#7-core-catalogue-schema-manager--minor-moon-synthesis)
  - [8. Complete Catalog of All External, Scientific & Build-Script Sources](#8-complete-catalog-of-all-external-scientific--build-script-sources)
- [Part II: Orbital Mechanics, Ephemeris Maths, Coordinate Frames, Simulation Clock & Deep-Time Eras](#part-ii-orbital-mechanics-ephemeris-maths-coordinate-frames-simulation-clock--deep-time-eras)
  - [1. J2000 Catalogue & Secular Orbital Elements (`src/astronomy/SolarSystemData.ts`)](#1-j2000-catalogue--secular-orbital-elements-srcastronomysolarsystemdatats)
  - [2. Analytical Two-Body & Secular Ephemeris Solver (`src/astronomy/KeplerSolver.ts`)](#2-analytical-two-body--secular-ephemeris-solver-srcastronomykeplersolverts)
  - [3. Coordinate Frame Transformations (`src/astronomy/CoordinateFrames.ts`)](#3-coordinate-frame-transformations-srcastronomycoordinateframests)
  - [4. Body Orientation, IAU Spin Poles & Prime Meridians (`src/astronomy/BodyOrientation.ts`)](#4-body-orientation-iau-spin-poles--prime-meridians-srcastronomybodyorientationts)
  - [5. Spacecraft Trajectories & `.dyn` Binary Propagators (`src/astronomy/DynamoTrajectory.ts`)](#5-spacecraft-trajectories--dyn-binary-propagators-srcastronomydynamotrajectoryts)
  - [6. Relativistic Black Hole Physics: Sagittarius A* (`src/data/SagittariusAStarData.ts`)](#6-relativistic-black-hole-physics-sagittarius-a-srcdatasagittariusastardatats)
  - [7. Simulation Clock & Time Scales (`src/simulation/SimulationClock.ts`)](#7-simulation-clock--time-scales-srcsimulationsimulationclockts)
  - [8. Surface Observer Sky Astronomy & Solar Time (`src/explorer/SkyAstronomy.ts`)](#8-surface-observer-sky-astronomy--solar-time-srcexplorerskyastronomyts)
  - [9. Deep-Time Cosmic & Planetary Eras (`src/explorer/DeepTime.ts`, `src/explorer/DeepTimeLand.ts`)](#9-deep-time-cosmic--planetary-eras-srcexplorerdeeptimets-srcexplorerdeeptimelandts)
  - [10. Body Monographs & Postcards (`src/data/PlanetNarratives.ts`, `src/data/Postcards.ts`)](#10-body-monographs--postcards-srcdataplanetnarrativests-srcdatapostcardsts)
  - [11. Ephemeris & Trajectory Verification Suites (`src/tests/ephemerisAccuracy.test.ts`, `src/tests/dynamoTrajectory.test.ts`)](#11-ephemeris--trajectory-verification-suites-srctestsephemerisaccuracytestts-srctestsdynamotrajectorytestts)
- [Part III: NASA Spacecraft Fleet, Trajectories, Small Bodies, Asteroids & 3D Comets](#part-iii-nasa-spacecraft-fleet-trajectories-small-bodies-asteroids--3d-comets)
  - [1. `NasaEyesCatalog.ts` Data Model, Events, Extra Assets & Helper Functions](#1-nasaeyescatalogts-data-model-events-extra-assets--helper-functions)
  - [2. Complete NASA Spacecraft Fleet (`NASA_SPACECRAFT_CATALOG` — All 174 Entries)](#2-complete-nasa-spacecraft-fleet-nasa_spacecraft_catalog--all-174-entries)
  - [3. Trajectory Data Architecture, `.dyn` Binary Files & Evaluation Boundary](#3-trajectory-data-architecture-dyn-binary-files--evaluation-boundary)
  - [4. 3D Asset Streaming, Procedural Environment/Proxy vs. GLTF, Scale Comparison & Close-Inspection (`src/rendering/SpacecraftFactory.ts`)](#4-3d-asset-streaming-procedural-environmentproxy-vs-gltf-scale-comparison--close-inspection-srcrenderingspacecraftfactoryts)
  - [5. Small Bodies, Named Asteroids & Procedural Asteroid Belts (`SmallBodies.ts`, `Asteroids.ts`, `NasaEyesCatalog.ts`)](#5-small-bodies-named-asteroids--procedural-asteroid-belts-smallbodiests-asteroidsts-nasaeyescatalogts)
  - [6. 3D Comets (`Comet3D` in `src/flight/Comets3D.ts`)](#6-3d-comets-comet3d-in-srcflightcomets3dts)
  - [7. Verification Suites (`src/tests/catalogue.test.ts` & `src/tests/smallBodies.test.ts`)](#7-verification-suites-srctestscataloguetestts--srctestssmallbodiestestts)
- [Part IV: Astrophysical Phenomena, Custom GLSL Shaders, Optical Effects & LensPipeline](#part-iv-astrophysical-phenomena-custom-glsl-shaders-optical-effects--lenspipeline)
  - [4.1 Solar Physics & Shaders (`SolarShader.ts`, `PlanetFactory.ts`)](#41-solar-physics--shaders-solarshaderts-planetfactoryts)
  - [4.2 Planetary Surfaces, Earth Material & Saturn Ring System (`PlanetFactory.ts`, `PlanetMaterial.ts`, `EarthMaterial.ts`)](#42-planetary-surfaces-earth-material--saturn-ring-system-planetfactoryts-planetmaterialts-earthmaterialts)
  - [4.3 Atmospheres & Aerial Perspective (`AtmosphereShader.ts`, `AerialPerspective.ts`)](#43-atmospheres--aerial-perspective-atmosphereshaderts-aerialperspectivets)
  - [4.4 Sagittarius A*, Relativistic Infall & HorizonView (`SagittariusAStar.ts`, `BlackHoleInfall.ts`, `HorizonView.ts`)](#44-sagittarius-a-relativistic-infall--horizonview-sagittariusastarts-blackholeinfallts-horizonviewts)
  - [4.5 Galactic Structure, Volumetric Milky Way & Nebulae (`MilkyWayGalaxy.ts`, `MilkyWayVolume.ts`, `NebulaSky.ts`, `NebulaStage.ts`)](#45-galactic-structure-volumetric-milky-way--nebulae-milkywaygalaxyts-milkywayvolumets-nebulaskyts-nebulastagets)
  - [4.6 Starfield, Catalogue Stars, Markers, Trails & Showcase (`CatalogueStars.ts`, `Starfield.ts`, `BodyMarkers.ts`, `OrbitalTrails.ts`, `TravelParticles.ts`, `Showcase.ts`)](#46-starfield-catalogue-stars-markers-trails--showcase-cataloguestarsts-starfieldts-bodymarkersts-orbitaltrailsts-travelparticlests-showcasets)
  - [4.7 LensPipeline EffectComposer Chain & Optical Post-Processing (`LensPipeline.ts`, `AutoExposure.ts`, `GodRays.ts`, `HelmetVisor.ts`)](#47-lenspipeline-effectcomposer-chain--optical-post-processing-lenspipelinets-autoexposurets-godraysts-helmetvisorts)
- [Part V: Photoreal Earth, 3D Tiles, Volumetric CloudSea Clouds, Weather, Sky Phenomena & Surface Exploration](#part-v-photoreal-earth-3d-tiles-volumetric-cloudsea-clouds-weather-sky-phenomena--surface-exploration)
  - [1. Google Photorealistic 3D Tiles Integration (`src/rendering/PhotorealEarth.ts`)](#1-google-photorealistic-3d-tiles-integration-srcrenderingphotorealearthts)
  - [2. Fallback Procedural Terrain (`src/rendering/ProceduralTerrain.ts`)](#2-fallback-procedural-terrain-srcrenderingproceduralterraints)
  - [3. WGS-84 & Equirectangular Tile Math (`src/explorer/TileMath.ts`)](#3-wgs-84--equirectangular-tile-math-srcexplorertilemathts)
  - [4. LERC1 Decoder & DEM Elevation Engines](#4-lerc1-decoder--dem-elevation-engines)
  - [5. Planetary Imagery & Surface Tile Streaming](#5-planetary-imagery--surface-tile-streaming)
  - [6. Planetary Explorer, Surface Observer, Avatar & Surface Sky](#6-planetary-explorer-surface-observer-avatar--surface-sky)
  - [7. Procedural City, Landmarks, Ground Cover & Geocoding](#7-procedural-city-landmarks-ground-cover--geocoding)
  - [8. `CloudSea` Volumetric Cloud Engine](#8-cloudsea-volumetric-cloud-engine)
  - [9. Atmospheric Weather & Precipitation (`src/flight/Weather.ts`)](#9-atmospheric-weather--precipitation-srcflightweatherts)
  - [10. Sky Phenomena & Living World (`src/flight/SkyEvents.ts`, `src/flight/AliveWorld.ts`)](#10-sky-phenomena--living-world-srcflightskyeventsts-srcflightaliveworldts)
  - [11. Earth Suborbital Transit, Gamepad Input & Flight Units (`EarthTransit.ts`, `PadTrigger.ts`, `worlds.ts`)](#11-earth-suborbital-transit-gamepad-input--flight-units-earthtransitts-padtriggerts-worldsts)
- [Part VI: Jet Physics, Aerodynamics, Multi-Planet Gravity, Maneuvers/FBW, 3D Cockpit & Flight HUD](#part-vi-jet-physics-aerodynamics-multi-planet-gravity-maneuversfbw-3d-cockpit--flight-hud)
  - [1. Airframes (`AirframeSpecs.ts`, `ManeuversAndFBW.ts`, `JetModel.ts`, `JetHUD.tsx`)](#1-airframes-airframespecsts-maneuversandfbwts-jetmodelts-jethudtsx)
  - [2. Aerodynamics (`Aerodynamics.ts`)](#2-aerodynamics-aerodynamicsts)
  - [3. Multi-Planet Atmosphere & Gravity (`PlanetaryPhysics.ts`, `AirProfiles.ts`, `FlightModel.ts`)](#3-multi-planet-atmosphere--gravity-planetaryphysicsts-airprofilests-flightmodelts)
  - [4. Fly-By-Wire & Special Maneuvers (`ManeuversAndFBW.ts`, `FlightModel.ts`, `JetController.ts`, `PadTrigger`)](#4-fly-by-wire--special-maneuvers-maneuversandfbwts-flightmodelts-jetcontrollerts-padtrigger)
  - [5. Interactive 3D Cockpit & Visual Effects (`Cockpit.ts`, `CockpitControls.ts`, `MfdDisplays.ts`, `MirrorView.ts`, `HudGlass.ts`, `Optics.ts`, `SpeedEffects.ts`, `JetModel.ts`, `JetController.ts`)](#5-interactive-3d-cockpit--visual-effects-cockpitts-cockpitcontrolsts-mfddisplaysts-mirrorviewts-hudglassts-opticsts-speedeffectsts-jetmodelts-jetcontrollerts)
  - [6. Cameras, Tactical Overlays & JetHUD (`JetHUD.tsx`, `TacticalHud.ts`, `JetController.ts`)](#6-cameras-tactical-overlays--jethud-jethudtsx-tacticalhudts-jetcontrollerts)
- [Part VII: Complete Soundscape — VELA Companion AI & Voice, Military Radio DSP Chain, Jet Audio & Adaptive Music](#part-vii-complete-soundscape--vela-companion-ai--voice-military-radio-dsp-chain-jet-audio--adaptive-music)
  - [1. VELA AI Companion & Voice (`src/companion/*`)](#1-vela-ai-companion--voice-srccompanion)
  - [2. Military ATC & Wingman Radio System (`RadioChain.ts`, `RadioDirector.ts`)](#2-military-atc--wingman-radio-system-radiochaints-radiodirectorts)
  - [3. Jet Propulsion & Cockpit SFX (`src/flight/JetAudio.ts`)](#3-jet-propulsion--cockpit-sfx-srcflightjetaudiots)
  - [4. Adaptive Soundtrack (`src/audio/music.ts`)](#4-adaptive-soundtrack-srcaudiomusicts)
- [Part VIII: Observatory UI/HUD, CameraRig, Interactive Book, Technical Report, Launch Video & Test Suite](#part-viii-observatory-uihud-camerarig-interactive-book-technical-report-launch-video--test-suite)
  - [1. CameraRig & Observatory Navigation (`src/navigation/CameraRig.ts`, `src/dev/flightHarness.ts`)](#1-camerarig--observatory-navigation-srcnavigationcamerarigts-srcdevflightharnessts)
  - [2. Observatory UI & HUD (`src/ui/*`)](#2-observatory-ui--hud-srcui)
  - [3. Interactive Storybook (`src/book/`)](#3-interactive-storybook-srcbook)
  - [4. Interactive Technical Report (`src/report/`)](#4-interactive-technical-report-srcreport)
  - [5. Remotion Launch Video & Capture Pipeline (`launch-video/`)](#5-remotion-launch-video--capture-pipeline-launch-video)
  - [6. Vitest Test Suite Inventory (`src/tests/` — 39 Test Suites)](#6-vitest-test-suite-inventory-srctests--39-test-suites)
- [Part IX: Core Scene Orchestrator, Telemetry, Stylesheets, Tooling & CI](#part-ix-core-scene-orchestrator-telemetry-stylesheets-tooling--ci)
  - [1. Master Scene Orchestrator (`src/rendering/SolarSystemScene.ts`)](#1-master-scene-orchestrator-srcrenderingsolarsystemscenets)
  - [2. Jet Telemetry Contract, Animated Icons & HUD Lab](#2-jet-telemetry-contract-animated-icons--hud-lab)
  - [3. CSS Design Systems & Styling Architecture](#3-css-design-systems--styling-architecture)
  - [4. Root Config, Type Ambient, CI Workflows, Scripts & Research Notes](#4-root-config-type-ambient-ci-workflows-scripts--research-notes)

---

## Part I: System Architecture, Precision Engineering, Pipelines & All Data/Asset Sources

### 1. Tech Stack, Build Configuration & Deployment

- **Application Metadata & Runtime Stack** ([package.json](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/package.json#L1-L46))
  - Package name `solaris`, `private: true`, version `1.1.0`, `"type": "module"`, MIT code licence ([README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L22)).
  - **Core 3D & Geospatial Dependencies**:
    - `three` `^0.170.0` (WebGL2 3D rendering engine; `@types/three` `^0.170.0`).
    - `3d-tiles-renderer` `0.4.28` (NASA-AMMOS, Apache-2.0) for streaming OGC 3D Tiles (Google Photorealistic 3D Tiles).
    - `@mapbox/vector-tile` `2.0.5` (BSD-3-Clause) and `pbf` `4.0.2` (BSD-3-Clause) for Protocol Buffer vector-tile decoding (OpenFreeMap / OpenMapTiles).
  - **UI, Animation & Styling Dependencies**:
    - `react` `^18.3.1` and `react-dom` `^18.3.1` (`@types/react` `^18.3.12`, `@types/react-dom` `^18.3.12`).
    - `gsap` `^3.15.0` and `@gsap/react` `^2.1.2`.
    - `motion` `^14.3.0`.
    - `lucide-react` `^0.454.0`.
    - `clsx` `^2.1.1` and `tailwind-merge` `^2.5.4`.
  - **Tooling & DevDependencies**:
    - `typescript` `^5.6.3`, `vite` `^5.4.10`, `@vitejs/plugin-react` `^4.3.3`.
    - `vitest` `^2.1.3` (142 tests across 23 files reported in [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L242)).
    - `tailwindcss` `^3.4.14`, `postcss` `^8.4.47`, `autoprefixer` `^10.4.20`.
    - `eslint` `^9.17.0`, `@eslint/js` `^9.17.0`, `eslint-plugin-react-hooks` `^5.1.0`, `typescript-eslint` `^8.18.2`, `globals` `^15.14.0`.
  - **NPM Scripts**:
    - `dev`: `vite`
    - `build`: `tsc && vite build`
    - `preview`: `vite preview`
    - `test`: `vitest run`
    - `typecheck`: `tsc --noEmit`
    - `build:stars`: `node scripts/build_star_subset.cjs`
    - `lint`: `eslint .`

- **TypeScript Compiler Configuration** ([tsconfig.json](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/tsconfig.json#L1-L24))
  - Target `ES2022`, module `ESNext`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `useDefineForClassFields: true`, `allowImportingTsExtensions: true`, `resolveJsonModule: true`, `isolatedModules: true`, `noEmit: true`.
  - Strict checks enabled: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `noFallthroughCasesInSwitch: true`, `skipLibCheck: true`.
  - Path alias `@/*` mapped to `src/*` (`baseUrl: "."`), matching Vite's `@` alias.
  - Scope: `"include": ["src"]`.

- **Vite Multi-Entry Bundling & Hosting** ([vite.config.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/vite.config.ts#L1-L45), [vercel.json](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/vercel.json#L1-L11))
  - **Base Path**: `process.env.VERCEL ? '/' : '/solaris/'` — root `/` on Vercel (`https://solarises.vercel.app/`), subpath `/solaris/` on GitHub Pages.
  - **CSS PostCSS Pipeline**: runs `tailwindcss()` and `autoprefixer()` inline via Vite `css.postcss.plugins`.
  - **Four Rollup HTML Entrypoints** (`build.rollupOptions.input`):
    - `main`: `index.html` (Observatory explorer `/`)
    - `report`: `report/index.html` (Technical field report `/report/`, 16 chapters, 23 live figures, isolated so the explorer never downloads report bundles)
    - `book`: `book/index.html` (Illustrated book `/book/`)
    - `fly`: `fly/index.html` (Dedicated jet flight experience `/fly/`)
  - **Manual Chunk Splitting** (`build.rollupOptions.output.manualChunks`): isolates `three` (`['three']`) and `react` (`['react', 'react-dom']`) into separate long-cacheable chunks.
  - **Dev Server**: `port: 5173`, `host: true`, `watch.ignored: ['**/launch-video/**']` so capture artifacts from the launch film do not trigger HMR reloads.
  - **Deployment Config** ([vercel.json](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/vercel.json#L1-L11)): `"framework": "vite"`, `installCommand: "npm ci"`, `buildCommand: "npm run build"`, `outputDirectory: "dist"`, with `git.deploymentEnabled.gh-pages: false` (GitHub Actions `.github/workflows/deploy.yml` runs lint, tests, and build to publish GitHub Pages separately per [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L248)).

---

### 2. Dual-Route Application Architecture (`/` Observatory vs `/fly/` Jet Entry)

- **Entrypoints** ([src/main.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/main.tsx#L1-L14), [src/fly/main.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/fly/main.tsx#L1-L14))
  - Both entrypoints invoke `startAnimatedFavicon()` (from `./ui/brand/logo`) and mount `<App />` under `React.StrictMode` into `#root`.
  - `/` mounts `<App />` (`mode = 'site'` default); `/fly/` mounts `<App mode="fly" />`.

- **Shared Root Orchestrator `App`** ([src/App.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/App.tsx#L20-L452))
  - Derives `SITE_URL = import.meta.env.BASE_URL` and `` FLY_URL = `${import.meta.env.BASE_URL}fly/` ``.
  - Instantiates one `SolarSystemScene(containerRef.current, onTelemetry)` inside `useEffect([mode])` and exposes debug globals `window.__solarisScene` and `window.__solaris_scene`.
  - Runs `scene.warmUp((progress, stage) => ...)` at startup to preload textures and compile shaders upfront before revealing the UI.
  - **HUD State Machine**:
    - `revealed && !jetActive`: mounts `<FlightHUD />` (Observatory HUD: body selection, time clock controls, 6-domain scale jumps, lens profiles, bloom gain, landmarks, surface/horizon modes, nebula visits, postcards, screenshot capture, NASA spacecraft & mission events, comparison props, science overlays, showcase reel).
    - `revealed && jetActive`: replaces `<FlightHUD />` with `<JetHUD controller={sceneRef.current.jet} onExit={handleExitJet} />`.
    - `revealed && !jetActive && landedAt`: displays a top-centered landing banner (`Landed · {landedAt}`) with `Take off` (`scene.takeOffFromLanding()`) and `Hide person` / `Show person` (`scene.avatarOn`) buttons.
  - **Route Switching & Jet Launch (`handleLaunchJet`, `unsubJet`)**:
    - Clicking launch in Observatory checks `CatalogueManager.getSpacecraftEntry(activeName)`: if focused on a NASA spacecraft, enters jet mode directly beside it (`scene.enterJetBesideSpacecraft(activeName)`); otherwise navigates to `FLY_URL` (`window.location.assign(FLY_URL)`).
    - In `mode === 'fly'`, leaving jet mode without being landed (`!t.active && !landedRef.current`) redirects back to `SITE_URL` after a `400 ms` delay.

- **Observatory Opening vs `/fly/` Live 3D Preloader (`FlyPreloader`)** ([src/App.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/App.tsx#L56-L166), [src/fly/FlyPreloader.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/fly/FlyPreloader.tsx#L1-L596))
  - **`site` Mode**: renders `<Preloader />`, where `handleBegin(withVoice)` unlocks `voice`, persists `velaVoice` in `settings`, triggers `enterFullscreen()`, plays `chime('open')`, and starts `music.start()` when voice is enabled.
  - **`fly` Mode Orchestration (`App.tsx` polling every `250 ms`)**:
    - While waiting for readiness, throttles background scene rendering to `sc.drawEvery = 4` and sets `sc.compileGate = 'hold'` so shader compilation happens behind the preloader film without stalling it.
    - Once `load.done`, calls `sc.startFlyPage()` to initialize the take-off location (`name`, `lat`, `lon`), logs `take-off` and `airframe` (`sc?.jet.airframe.anchors.name ?? AIRFRAMES[chosenAirframe()].anchors.name`) events into a rolling 6-line telemetry log.
    - Cycles through `TOUR = ['cockpit', 'gopro', 'flyby']` every `1600 ms` behind the curtain so cockpit, GoPro, and fly-by shaders/reflections/displays compile before reveal (eliminating `0.3–0.5 s` first-switch stalls).
    - Readiness gating: `ready` becomes `true` when `load.done && r.jet && r.aircraft` and either `(toured && settled && now - startedAt > 10000)` (where `settled` means `r.tilesVisible > 0 && r.tilesPending <= 3` for `> 1500 ms`) or `now - startedAt > 50000` timeout.
    - Composite progress formula: `(load.done ? 0.4 : load.progress * 0.4) + (r.aircraft ? 0.12 : 0) + (r.jet ? 0.08 : 0) + 0.4 * (ready ? 1 : tilesFrac * 0.97)`, where `tilesFrac = !streaming ? 0 : r.tilesVisible === 0 ? 0.05 : Math.min(1, 1 - r.tilesPending / Math.max(peakPending, 40))`.
    - Four `PreflightItem` checks: `OBSERVATORY`, `AIRFRAME`, `EARTH 3D`, `SKY`.
    - Clicking `ENGAGE` (or pressing `Enter` / `Space`) calls `handleEngage()`: enters fullscreen, unlocks audio, unholds jet (`sc.jet.hold = false`), restores `sc.drawEvery = 1`, switches `sc.compileGate = 'hide'`, and runs a `2900 ms` (`500 ms` under `prefers-reduced-motion`) dive sequence before unmounting `FlyPreloader`.
  - **`FlyPreloader` Live Three.js Film** ([src/fly/FlyPreloader.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/fly/FlyPreloader.tsx#L35-L514)):
    - Standalone `THREE.WebGLRenderer` (`antialias: true`, `powerPreference: 'high-performance'`, `logarithmicDepthBuffer: true`, `pixelRatio: Math.min(1.15, dpr)`, `ACESFilmicToneMapping`, `SRGBColorSpace`) + `EffectComposer` (`RenderPass`, full-resolution `UnrealBloomPass(1, 0.85, 0.6, 0.75)`, `OutputPass`).
    - Places Sun + 8 planets at live UTC Julian Date (`jd = now.getTime() / 86400000 + 2440587.5`) using `KeplerSolver.propagate(b.orbit, jd - J2000_JD)`, ecliptic-to-Three conversion `ecl(x, y, z) = (x, z, -y)`, and log-compressed heliocentric distance `filmR(au) = 26 * Math.log10(1 + au * 9)` with Earth centered at the origin (`sunPos = -earthF`).
    - Rotates Earth to live subsolar point (`subsolar(now)`, `OBLIQ = 23.4393 * DEG`) with custom GLSL shaders (`earthVert`/`earthFrag` with `8K` day map, `4K` night lights, `4K` drifting clouds + cloud shadows, ocean specular highlight, terminator glow, Fresnel limb; `atmoVert`/`atmoFrag` Rayleigh/dusk rim; `beaconFrag` pulsing ring + `uFill` tile-streaming progress arc).
    - Async `decodeBitmap` texture loading uploaded one texture per frame (`arrived.shift()`), plus `renderer.compileAsync(scene, camera)` before starting the `requestAnimationFrame` loop.
    - Minimum `12 s` animated camera flight across Act 1 (quadratic Bézier descent from `c0` via `ctrl` to `c1`, FOV `42° -> 38°`, `ACT1 = 0.34`) and Act 3 (slerp from night limb `startDir` over `target` city, followed by `2100 ms` `diveK` dive to `1.004` radius and `72°` FOV).

---

### 3. Floating Origin & Infinite Scale Engine Math

- **Floating Origin (`SUN_WORLD`)** ([src/rendering/RenderOrigin.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/RenderOrigin.ts#L1-L15))
  - Solves 32-bit GPU float precision loss: at true scale, Neptune sits millions of units from the Sun (32-bit float precision degrades to `~0.1` render units at Neptune and several units at Sagittarius A*, causing moon/surface jitter; [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L175) notes 512 km quantization near Neptune in naive world coordinates).
  - Every frame, CPU double-precision matrices place the camera at `(0, 0, 0)` and shift the entire scene by the negated camera world position (`SolarSystemScene.render`).
  - Shared shader uniform `export const SUN_WORLD: THREE.IUniform<THREE.Vector3> = { value: new THREE.Vector3() }` communicates the Sun's shifted frame position so lighting shaders never assume the Sun sits at `(0, 0, 0)`.

- **Linear True-Scale Metric & World-Size Multiplier** ([src/rendering/Scale.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/Scale.ts#L1-L81))
  - **Fundamental Scale Constants**:
    - `EARTH_RADIUS_UNITS = 2.4` (reference globe radius tuned for close-ups and shaders)
    - `KM_PER_UNIT = 6371.0 / EARTH_RADIUS_UNITS` (`≈ 2654.5833 km/unit`)
    - `UNITS_PER_KM = 1 / KM_PER_UNIT` (`≈ 3.76707e-4 units/km`)
    - `AU_KM = 149597870.7`
    - `UNITS_PER_AU = AU_KM / KM_PER_UNIT` (`≈ 56354.56 units/AU`; Neptune orbits ~1.7 million units out)
    - `COSMIC_SCALE = 8000` (pushes stylised interstellar, Milky Way, and Sgr A* scales outward so true-scale planets and the Kuiper belt fit inside them)
    - `SYSTEM_VIEW_DISTANCE = 75 * UNITS_PER_AU` (camera distance framing out to the Kuiper belt)
  - **Visual Size Settings (`WORLD_SCALE`)**:
    - Stored in `localStorage` under `WORLD_SCALE_KEY = 'solaris.worldScale'`, options: `1` (`'True size'`), `30` (`'Grand ×30'`, `DEFAULT_WORLD_SCALE = 30`), `60` (`'Colossal ×60'`).
    - `SUN_SCALE = Math.min(WORLD_SCALE, 8)` (capped at `8` so the Sun's corona stays inside Mercury's orbit).
    - `sizeScale(body)`: returns `SUN_SCALE` for `'star'`, `1` for `'black_hole'`, and `WORLD_SCALE` for all other categories.
    - `trueRadius(body) = body.physical.meanRadiusKm * UNITS_PER_KM`.
    - `drawnRadius(body) = trueRadius(body) * sizeScale(body)`.
    - `kmToUnits(km) = km * UNITS_PER_KM`.
  - **Non-Colliding Moon Orbit Scaling (`moonDistanceKm`)**:
    - Formula: `scale * Math.min(distanceKm, 4 * parentRadiusKm) + Math.max(0, distanceKm - 4 * parentRadiusKm)` (default `scale = WORLD_SCALE`).
    - Expands inner rings and close moons (`d <= 4R`) proportionally with the enlarged planet so moons never clip inside their swollen parent, while keeping outer moons at true gap beyond `4R`.

- **Physical-to-Render Transform (`RenderSpaceTransform`)** ([src/rendering/RenderSpaceTransform.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/RenderSpaceTransform.ts#L1-L44))
  - `toRenderPosition(physicalKm)`: converts heliocentric ecliptic km to render units (`* UNITS_PER_KM`) and rotates into Three.js coordinates (`+Y` = ecliptic north) via `CoordinateFrames.eclipticToThree(...)`.
  - `moonOffsetKm(relKm, parentRadiusKm)`: scales a parent-relative moon vector radially by `k = moonDistanceKm(d, parentRadiusKm) / d` (no-op if `d <= 0 || parentRadiusKm <= 0`).
  - `toMoonRenderPosition(moonRelPhysicalKm, parentRenderPos, parentRadiusKm = 0)`: applies `moonOffsetKm`, converts via `toRenderPosition`, and translates by `parentRenderPos`.
  - `getVisualRadius(body)`: delegates to `drawnRadius(body)`.

- **6-Domain Scale Navigation & README Tier Notes** ([src/App.tsx](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/App.tsx#L326-L328), [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L178-L192))
  - `App.tsx` exposes `handleJumpToScale(domain)` over six scale domains: `'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a'`.
  - [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L180-L191) also documents the cosmic display/reference tiers:
    - Exploration/legacy overview compression notes (`D = 50 + 65 · r^0.58` for heliocentric `r` in AU; local stars `< 120 pc` at `700 + 38` units/pc; Milky Way at `1,320` units/kpc with Sun at `R₀ = 8.277 kpc`, `21 pc` above mid-plane) vs `Scale.ts` true-scale linear Solar System with `COSMIC_SCALE = 8000` outer push.
    - Observation camera: altitude scales with `√R` from a reference Earth shot, planet placed in the left third of a `55°` wide lens, vantage aligned so the Milky Way crosses behind the planet.
    - Lens profiles (`L`): `Cinematic` (bloom, mild barrel distortion, chromatic aberration, grain, rotational motion blur — motion blur disabled under `prefers-reduced-motion`), `Fisheye`, and `Clean`.

---

### 4. Adaptive Quality Governor & Non-Blocking GPU CompileGate

- **Hardware-Detected Quality Tiers & Dynamic Resolution Scaling (`PerformanceGovernor` / `perf`)** ([src/rendering/Performance.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/Performance.ts#L1-L203))
  - **Quality Tiers (`TIERS: Record<QualityTier, TierSettings>`)**:
    - `high`: `maxDpr: 2`, `minScale: 0.6`, `ao: true`, `smaa: true`, `shadowMap: 2048`, `hiRes8k: true`, `rocksPerVariant: 700`, `envEvery: 12`.
    - `medium`: `maxDpr: 1.5`, `minScale: 0.55`, `ao: false`, `smaa: true`, `shadowMap: 1024`, `hiRes8k: false`, `rocksPerVariant: 420`, `envEvery: 24`.
    - `low`: `maxDpr: 1`, `minScale: 0.5`, `ao: false`, `smaa: false`, `shadowMap: 0`, `hiRes8k: false`, `rocksPerVariant: 220`, `envEvery: 60`.
  - **Overrides**: checked in order via URL query `?quality=low|medium|high` or `localStorage.getItem('solaris.quality')`.
  - **GPU & Device Detection (`detectTier`, `gpuName`)**:
    - Queries `WEBGL_debug_renderer_info` (`UNMASKED_RENDERER_WEBGL`, falling back to `gl.RENDERER`) on a temporary WebGL2/WebGL context and immediately frees it with `WEBGL_lose_context`.
    - Forces `low` on software/legacy GPUs matching `/SwiftShader|llvmpipe|Basic Render|Mali-[GT]?[4-7]\d|Adreno \(TM\) [3-5]\d\d|PowerVR|Intel\(R\) (HD|UHD) Graphics( [1-6]\d\d)?\b/i`.
    - Phones (`coarsePointer && shortSide < 900`): `low` if `memoryGb <= 4` or `cores <= 6`, else `medium`.
    - Desktop/tablet with `cores <= 4` or `memoryGb <= 4`: `low`.
    - Integrated/mobile GPUs matching `/Intel|Iris|Radeon\(TM\) Graphics|Vega \d|Apple M1\b|Adreno|Mali/i`: `medium`.
    - Discrete/higher-tier GPUs: `high`.
    - Initial `scale` starts at `0.8` for `low` tier (climbing if headroom exists) and `1` for `medium`/`high`.
  - **Display Refresh Measurement (`measureRefresh`)**:
    - Samples `40` `requestAnimationFrame` deltas at startup, takes the 25th percentile (`deltas[Math.floor(deltas.length * 0.25)]`), snaps to nearest of `[60, 75, 90, 120, 144, 165, 240]` Hz, caps target at `120 Hz` (`targetMs = 1000 / Math.min(120, nearest)`), and initializes `avgMs = targetMs`.
  - **Closed-Loop Resolution Scaler (`frame(ms)`, `pixelRatio(cap)`)**:
    - Ignores frame spikes `ms > 250` (tab switches/compile pauses) so they do not corrupt EMA `avgMs += (ms - avgMs) * 0.05`.
    - Down-steps: if `avgMs > targetMs * 1.4` and `sinceChange > 1500 ms`, sets `next = Math.max(minScale, scale * 0.85)`, clamps `ceiling = scale`, and resets `sinceDrop = 0`.
    - Up-steps: `ceiling` resets to `1` after `30000 ms` (`sinceDrop > 30000`); if `avgMs < targetMs * 1.07` and `sinceChange > 5000 ms`, sets `next = Math.min(1, ceiling * 0.999, scale * 1.1)`.
    - Fires `onChange` resize listeners whenever `Math.abs(next - scale) > 0.01`.
    - Effective pixel ratio: `Math.max(0.5, Math.min(dpr, cap, settings.maxDpr) * scale)`.

- **Non-Blocking GPU Shader & Upload Gate (`installCompileGate`)** ([src/rendering/CompileGate.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/CompileGate.ts#L1-L372))
  - Wraps `renderer.render(scene, camera)` to prevent `0.3–0.9 s` main-thread freezes measured on ~120 WebGL programs (jet, 3D tiles, cockpit, cloud/lens passes) and multi-megapixel texture uploads.
  - Requires `KHR_parallel_shader_compile` (`r.extensions.has('KHR_parallel_shader_compile')`); if absent or `mode === 'off'` or nested `depth > 0`, passes straight through to `draw(scene, camera)`.
  - **State Signature Tracking**: builds `sig = "${idOf(scene.environment)}:${idOf(scene.fog)}:${renderTarget ? 't' : 's'}:${toneMapping}:${outputColorSpace}:${lights.sort().join('|')}"` so lighting, fog, environment, or render-target changes invalidate cached readiness per scene/material version (`m.version`).
  - **Three Preparation Paths (`examine`)**:
    1. **Hidden objects (`freshHidden`)**: pre-compiles materials on invisible subtrees (`compileObjects`) in the background so cockpit parts are compiled before first look.
    2. **Visible objects (`fresh`) & Override Materials (`scene.overrideMaterial`, e.g., cockpit AO normals)**: calls `r.compile(subset, camera, scene)` (or `compileAs` for overrides), checks `programsReady(m)` via `program.isReady()`, and enforces a `300`-check (`~5 s` at 60 fps) safety fallback (`n > 300`) against driver quirks.
    3. **Shadow Casters (`casters`)**: builds stand-in `MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })` mirroring `shadowSideOf(m)`, `wireframe`, `alphaMap`, `alphaTest`, `map`, clipping planes, and displacement settings (`depthFor`), compiles them with `compileAs`, and pre-runs `compileObjects([], scene, camera, true)` when `shadowLight && r.shadowMap.enabled` so the shadow pass uses the current draw's light setup instead of compiling a `0.33–0.77 s` depth shader on the spot.
  - **Budgeted Texture Uploads (`beginFrame(uploadBudgetMs = 6)`, `uploadFor`)**:
    - Scans material fields and `ShaderMaterial.uniforms` (`texturesOf`) for un-uploaded textures (`isUploaded` checks `isRenderTargetTexture`, `!t.image`, `t.version === 0`, or existing `r.properties.get(t).__version`).
    - Calls `r.initTexture(t)` until `uploads > 0 && performance.now() > state.uploadUntil` (default `6 ms` frame budget).
  - **Gate Modes**:
    - `'hold'`: skips the entire `render` call if `!v.ok` (increments `skips`), used behind `FlyPreloader`.
    - `'hide'`: temporarily sets `o.visible = false` on never-drawn unready objects (`!drawnBefore.has(o)`) and `o.castShadow = false` on unready casters for that frame, restoring them in `finally` (increments `hidden`). Caps holdback at `MAX_HELD = 20` draws (`~0.33 s`) before forcing draw. Full-screen passes (`o === scene`) are never hidden.

---

### 5. Texture Pipeline, Fast Off-Thread Decoding, Progressive Hi-Res & Compression

- **Off-Main-Thread ImageBitmap Decoder (`FastTextureLoader`)** ([src/rendering/FastTextureLoader.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/FastTextureLoader.ts#L1-L60))
  - Avoids main-thread image decode/flip stalls (`450 ms` measured for 8K Earth, `790 ms` for 8K Moon with `<img>`, vs `~6×` faster upload—`2,080 ms -> 330 ms` for 8K Moon including mipmaps—via worker-decoded `ImageBitmap`).
  - `canUseBitmaps = typeof createImageBitmap !== 'undefined' && typeof fetch !== 'undefined'`.
  - `BITMAP_OPTIONS = { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }`.
  - `decodeBitmap(url)`: fetches (`credentials: 'same-origin'`) and returns `createImageBitmap(blob, BITMAP_OPTIONS)`.
  - `applyBitmap(texture, bitmap)`: assigns `texture.image = bitmap`, sets `texture.flipY = false` (already flipped in worker), and sets `texture.needsUpdate = true`.
  - `FastTextureLoader extends THREE.TextureLoader`: immediately returns a `THREE.Texture` (`flipY = false`), integrates with `this.manager.itemStart/itemEnd/itemError` so loading progress bars track it accurately, and falls back to `super.load(...)` if `ImageBitmap`/`fetch` are unavailable.

- **Singleton `TexturePipeline` & Progressive 2K → 4K/8K Upgrades** ([src/rendering/TexturePipeline.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/TexturePipeline.ts#L1-L476))
  - **Canonical Caching & Deduplication**:
    - `resolveUrl(path)`: passes through `http://`, `https://`, `data:`, `blob:`; strips leading `./` and duplicate slashes and prefixes `baseUrl` (`import.meta.env.BASE_URL` normalized).
    - `loadTexture(url, isSRGB = true, fallbackKey?)`: checks `cache`, uses `FastTextureLoader` (or injected `customLoader`), configures `SRGBColorSpace` vs `NoColorSpace`, `generateMipmaps = true`, `LinearMipmapLinearFilter`, `LinearFilter`, and `maxAnisotropy = 8`. Returns a dummy `THREE.Texture` in headless Node/Vitest environments (`typeof document === 'undefined' && !customLoader`).
    - **Failure Recovery & Retry Safety**: on error, evicts `canonicalKey` from `cache` and `inFlightRequests` (preventing cache poisoning so future attempts can retry) and patches `targetTex.image` / `flipY` synchronously or asynchronously from `TextureGenerator.getTexture(fallbackKey)`.
    - `loadTextureAsync`: shares `inFlightRequests` promises to deduplicate concurrent async loads.
    - Cache management APIs: `isCached`, `getCacheSize`, `evictFromCache(url, forceDispose = false)`, `clearCache(forceDispose = false)`, `setMaxAnisotropy`, `resetForTesting`.
  - **Body Texture Resolution (`getPlanetTextures(bodyName, minorKind?)`)**:
    - `minorKind` (`'dark' | 'grey' | 'icy' | 'red'`): assigns shared procedural regolith colour (`minor:${minorKind}`) and normal (`minor-n:${minorKind}`) maps from `TextureGenerator`.
    - `MOON_MAPS` (17 moons with bundled spacecraft maps in `/textures/moons/${f}.jpg` and `${f}_normal.jpg`): `Io`, `Europa`, `Ganymede`, `Callisto`, `Mimas`, `Enceladus`, `Tethys`, `Dione`, `Rhea`, `Iapetus`, `Miranda`, `Ariel`, `Umbriel`, `Titania`, `Oberon`, `Triton`, `Phobos` (falls back to `TextureGenerator.getTexture(bodyName)` if missing).
    - **Bundled Planet & Dwarf Planet Maps**:
      - `Sun`: `/textures/2k_sun.jpg` (map + emissiveMap)
      - `Mercury`: `/textures/2k_mercury.jpg`
      - `Venus`: `/textures/2k_venus_atmosphere.jpg`
      - `Earth`: `/textures/2k_earth_daymap.jpg`, `/textures/earth_normal_2048.jpg` (linear), `/textures/2k_earth_nightmap.jpg`, `/textures/2k_earth_clouds.jpg` (fallback `'EarthClouds'`)
      - `Moon`: `/textures/2k_moon.jpg`
      - `Mars`: `/textures/2k_mars.jpg`
      - `Jupiter`: `/textures/2k_jupiter.jpg`
      - `Saturn`: `/textures/2k_saturn.jpg`, `/textures/2k_saturn_ring_alpha.png` (linear, fallback `'SaturnRings'`)
      - `Uranus`: `/textures/2k_uranus.jpg`
      - `Neptune`: `/textures/2k_neptune.jpg`
      - `Pluto`: `/textures/2k_pluto.jpg`
      - `Charon`: `/textures/2k_charon.jpg`
      - All other bodies (`default`): `TextureGenerator.getTexture(bodyName)`.
    - `getMilkyWayDiskTexture()`: loads `/textures/milky_way_disk.webp` (`sRGB`).
  - **Progressive Close-Approach Hi-Res Swapping (`HIRES`, `upgradeToHiRes`, `setMaxTextureSize`)**:
    - `HIRES` mapping:
      - `Sun`: `/textures/2k_sun.jpg` → `/textures/hires/sun_4k.webp`
      - `Mercury`: `/textures/2k_mercury.jpg` → `/textures/hires/mercury_8k.webp`
      - `Earth`: `2k_earth_daymap.jpg` → `hires/earth_day_8k.webp`; `2k_earth_nightmap.jpg` → `hires/earth_night_4k.webp`; `2k_earth_clouds.jpg` → `hires/earth_clouds_4k.webp`
      - `Moon`: `2k_moon.jpg` → `hires/moon_8k.webp`
      - `Mars`: `2k_mars.jpg` → `hires/mars_8k.webp`
      - `Jupiter`: `2k_jupiter.jpg` → `hires/jupiter_4k.webp`
      - `Saturn`: `2k_saturn.jpg` → `hires/saturn_4k.webp`; `2k_saturn_ring_alpha.png` → `hires/saturn_ring_alpha_8k.png`
    - Gated by `maxTextureSize` (default `4096`; skips `_8k` files when `maxTextureSize < 8192`) and `upgraded` set (runs once per body).
    - Swaps the image onto the **existing** cached `THREE.Texture` instance after calling `tex.dispose()` to free immutable WebGL `texStorage2D` allocation before reallocating at 4K/8K, updating materials in place without rebuilding them.

- **Geometry & Asset Compression Formats Observed in Part 1 Files** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L130-L168), [scripts/compress_nasa_textures.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/compress_nasa_textures.py#L1-L60))
  - **Draco**: `public/draco/` (Apache-2.0, from `three.js`) decodes compressed Google Photorealistic 3D Tiles via `3d-tiles-renderer` `0.4.28`.
  - **Meshopt + WebP**: `public/models/su30mkk.glb` (`~670k -> 352k` triangles, textures `8.7 -> 2.6 MB`, original `47 MB`) and `public/models/gripen.glb` (`~767k -> 601k` triangles, textures up to `4096 px`, `29 -> 6.3 MB`, original `58 MB`) use quantized normals, meshopt geometry compression, and re-encoded textures. `scripts/compress_nasa_textures.py` converts NASA Eyes `.gltf` PNG/JPEG textures in place to WebP (`MAX_SIDE = 2048`, colour `q=82`, normal `q=90`).
  - *(Note: No KTX2/Basis Universal transcoder appears in the Part 1 architecture/pipeline files; Solaris uses `WebP`/`JPEG`/`PNG` decoded off-thread via `ImageBitmap` + `FastTextureLoader` for textures, Draco for 3D Tiles, and Meshopt for GLB aircraft.)*

---

### 6. Procedural Texture Synthesizer (`TextureGenerator`)

- **Overview & Caching** ([src/rendering/TextureGenerator.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/TextureGenerator.ts#L1-L1264))
  - Synthesizes deterministic `THREE.CanvasTexture` maps on offscreen HTML5 canvases and caches them in `TextureGenerator.cache` (`Map<string, THREE.CanvasTexture>`), plus `regolithCache` for minor-moon regolith pairs.
  - Serves both offline fallbacks for `TexturePipeline` and primary textures for unmapped dwarf planets, asteroids, and 437 minor moons.
  - Exposes `getTexture(name)` and `createGenericTexture(colorHex)` (`64×64` solid fallback).

- **21 Named Body & Feature Generators** (`1024×512` unless noted):
  - `Sun` (`1024×512`): fiery vertical gradient (`#fff4cc` → `#ffbb33` → `#ff8800`), trigonometric convective granulation, 12 sunspot active regions with umbra cores.
  - `Mercury` (`1024×512`): `#78736d` base with trigonometric noise and 120 rim-highlighted craters.
  - `Venus` (`1024×512`): golden sulfuric cloud gradient (`#f0d8a8`–`#e5c483`) with 18 sinusoidal cloud bands.
  - `Earth` (`1024×512`): deep ocean `#0f274a`, stylized Eurasia/Africa/Americas/Australia landmasses (`#2d5930`), desert belts (`#9e8548`), north/south polar ice caps (`#f0f6ff`).
  - `EarthClouds` (`1024×512`): transparent canvas with 28 elliptical white cloud bands (`rgba(255,255,255,0.75)`).
  - `Mars` (`1024×512`): `#bd532b` rust base, dark basalt provinces, Tharsis/Olympus Mons shield & caldera, polar ice caps (`#f8f4f0`).
  - `Jupiter` (`1024×512`): 10 alternating belts/zones with sinusoidal shear-interface eddies and Great Red Spot (`65% W, 62% H`, ~22° S) + white storm wake.
  - `Saturn` (`1024×512`): ochre gradient with `#757c6b` north polar hexagon tint and 30 latitude bands.
  - `SaturnRings` (`1024×64`): 1D radial alpha/colour gradient mapping C Ring (`0.00–0.18`), B Ring (`0.20–0.55`), Cassini Division (`0.57–0.63`), A Ring (`0.65–0.95`), and Encke Gap (`0.83–0.85`), clamped on S & T.
  - `Uranus` (`512×256`): pale cyan methane gradient (`#75c8d6`–`#8ee0ed`).
  - `Neptune` (`1024×512`): `#2d4aa0`–`#4a75e6` methane gradient, dark storm band, Great Dark Spot, white methane cirrus companion.
  - `Moon` (`512×256`): `#aba8a2` highlands, noise speckling, 6 radial-gradient maria (Imbrium, Serenitatis, Tranquillitatis, Oceanus Procellarum, Nubium, Crisium), Tycho crater with radial rays.
  - `Io` (`512×256`): `#e5c158` sulfur base, 40 sulfur/frost patches, 5 named caldera halos (Pele, Loki, Prometheus, Tvashtar, etc.).
  - `Europa` (`1024×512`): `#f4f6fa` water-ice crust, polar frost mottling, Conamara-style chaos regions, deterministic PRNG (`seed = 42`, LCG `16807 mod 2147483647`) drawing 32 quadratic-curve cycloidal double-ridge fractures and 50 micro-fractures.
  - `Ganymede` (`512×256`): `#6e655c` dark furrowed terrain with `#9c9288` grooved terrain bands and parallel micro-grooves.
  - `Callisto` (`512×256`): `#4e4741` dark regolith, 180 bright-rimmed craters, concentric Valhalla multi-ring basin.
  - `Titan` (`512×256`): `#c78028`–`#e8b258` nitrogen-methane smog gradient with polar hoods and zonal bands.
  - `Enceladus` (`512×256`): `#f6f8fb` pure water-ice crust with 4 south-polar blue "Tiger Stripe" Bézier sulci (`#68a0c8`).
  - `Triton` (`512×256`): `#decac0` pink nitrogen/methane ice, cantaloupe terrain dimples, 8 dark cryovolcanic wind streaks.
  - `Pluto` (`512×256`): `#8f4f35` tholin base, dark Cthulhu Macula (`#421f14`), two-lobed Tombaugh Regio / Sputnik Planitia heart (`#f0e6dc`).
  - `Ceres` (`512×256`): `#6e6962` carbonaceous regolith, 90 craters, Occator crater with central `#ffffff` Cerealia Facula salt spot.
  - Generic fallback (`createRockyCrateredTexture(name)`, `256×128`): dark tint (`#323232`) for `Bennu`, `Ryugu`, `Hygiea`; metallic (`#948a7e`) for `Psyche`; silicate (`#7a746d`) otherwise, with 50 craters.

- **Time-Sliced Heightfield Regolith Generator (`createRegolith`, `runSliced`)** ([src/rendering/TextureGenerator.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/TextureGenerator.ts#L1106-L1253))
  - Generates paired `1024×512` `colour` (`SRGBColorSpace`) and `relief` (tangent-space normal map) textures for four minor-moon surface types:
    - `dark`: `[80, 75, 70]`
    - `grey`: `[122, 118, 112]`
    - `icy`: `[150, 154, 160]`
    - `red`: `[138, 105, 82]`
  - Initializes flat placeholder canvases immediately so startup is never blocked (`~0.3 s` saved), then executes a `function* paint()` coroutine via `runSliced(job, budgetMs = 4)` (`setTimeout(step, 0)` yielding every `4 ms` frame slice):
    - Evaluates 5-octave wrapping lattice value noise (`N = 64`, seeded LCG `1664525 * seed + 1013904223`) for topography `H` and low-frequency albedo variation.
    - Stamps `1,500` power-law craters (`r = 1.5 + rnd()^3.6 * 40`, latitude foreshortening `coslat >= 0.2`, depth/radius `0.2` or `0.12` for `r > 15` with central peaks for `r > 15`, raised ejecta rims, darker floors, and `12%` bright fresh ejecta haloes).
    - Computes latitude-compensated central-difference normals (`0.4` slope softening factor) into the normal map and flips `colour.needsUpdate = true`, `relief.needsUpdate = true` upon completion.

---

### 7. Core Catalogue Schema, Manager & Minor-Moon Synthesis

- **Catalogue Types** ([src/types/catalogue.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/types/catalogue.ts#L1-L102))
  - `BodyCategory`: `'star' | 'planet' | 'moon' | 'dwarf_planet' | 'asteroid' | 'comet' | 'spacecraft' | 'black_hole'`.
  - `PhysicalParameters`: `meanRadiusKm`, optional `shapeAxesKm?: [number, number, number]`, `equatorialRadiusKm`, `polarRadiusKm`, `flattening`, `massKg`, `gmKm3S2`, `rotationPeriodHours`, `axialTiltDeg`, `meanTemperatureK`, `colorHex`, `spectralType`, `atmosphere?: { surfacePressureBar?, composition?: Array<{ gas, percentage }> }`.
  - `KeplerianElements`: `semiMajorAxisKm`, `semiMajorAxisAU`, `eccentricity`, `inclinationDeg`, `longitudeAscendingNodeDeg`, `argumentPeriapsisDeg`, `meanAnomalyAtEpochDeg`, `orbitalPeriodDays`, optional `epochJd` (defaults to J2000.0 `2451545.0`), `meanMotionDegPerDay`, `ratesPerCentury?: SecularRatesPerCentury`, `periapsisArgRateDegPerDay`, `nodeRateDegPerDay`, `source`.
  - `CelestialBodyDefinition`: `id`, `name`, `category`, `orderFromSun`, optional `parentId`, `parentName`, `physical`, `orbit`, `description`, `group`, `discoveryYear`, `minor?: boolean`, `surfaceKind?: 'dark' | 'grey' | 'icy' | 'red'`, `ridge?: boolean`.
  - `SelectedTargetInfo`: HUD readout contract (`id`, `name`, `category`, `parentId`, `parentName`, `distanceKm`, `apparentSpeedKmS`, `radiusKm`, `orbitalPeriodDays`, `axialTiltDeg`, `colorHex`).

- **Hand-Curated Core Catalogue (`CatalogueData.ts`)** ([src/data/CatalogueData.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/CatalogueData.ts#L1-L1071))
  - Merges `SOLAR_SYSTEM_BODIES` (Sun + 8 planets from `../astronomy/SolarSystemData`) with `MOONS_AND_MINOR_BODIES` (`33` entries) into `ALL_CELESTIAL_BODIES`:
    - **22 Major Moons**: Earth (`Moon` `301`), Mars (`Phobos` `401`, `Deimos` `402`), Jupiter (`Io` `501`, `Europa` `502`, `Ganymede` `503`, `Callisto` `504`), Saturn (`Mimas` `601`, `Enceladus` `602`, `Tethys` `603`, `Dione` `604`, `Rhea` `605`, `Titan` `606`, `Hyperion` `607`, `Iapetus` `608`), Uranus (`Miranda` `705`, `Ariel` `701`, `Umbriel` `702`, `Titania` `703`, `Oberon` `704`), Neptune (`Triton` `801`), Pluto (`Charon` `901`).
    - **2 Dwarf Planets**: `Pluto` (`999`, epoch JD `2457588.5`) and `Ceres` (`1`, epoch JD `2461200.5`).
    - **9 Named Asteroids**: `Vesta` (`4`), `Pallas` (`2`), `Hygiea` (`10`), `Psyche` (`16`), `Eros` (`433`), `Gaspra` (`951`), `Ida` (`243`), `Bennu` (`101955`, epoch JD `2455562.5`), `Ryugu` (`162173`).
  - Separately defines `SAGITTARIUS_A_STAR_DEF` (`id: 'SGR_A_STAR'`, `category: 'black_hole'`, `meanRadiusKm: 12690400` Schwarzschild radius `r_s`, `equatorialRadiusKm: 32971000` shadow radius, `massKg: 8.544455e36`, `gmKm3S2: 5.70283e17`, `axialTiltDeg: 42.0`, `semiMajorAxisKm: 2.554e17` ≈ `8.277 kpc`, `inclinationDeg: 60.19` galactic-to-ecliptic tilt, `orbitalPeriodDays: 2.3e8 * 365.25`).

- **Generated Moon Dataset & Minor-Moon Builder (`moons.json`, `MinorMoons.ts`)** ([src/data/moons.json](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/moons.json), [src/data/MinorMoons.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/MinorMoons.ts#L1-L204))
  - `src/data/moons.json` stores `458` moons at `epochJd: 2461327.5` (`2026-10-14.0 TDB`, frame `"ecliptic J2000, planet-centred"`): Earth `1`, Mars `2`, Jupiter `115`, Saturn `290`, Uranus `29`, Neptune `16`, Pluto `5`.
  - `buildMinorMoons(existing)`:
    - Filters out the `22` core moons already present in `CORE_BODIES`.
    - `repairUnbound(rows)`: repairs recently announced moons whose Horizons osculating set came back hyperbolic (`a <= 0 || e >= 1`) by adopting `jplA` on a circular (`e = 0`) orbit in the plane of the nearest regular sibling (`e < 0.1`), scaling mean motion via Kepler's third law (`near.n * (near.a / a)^1.5`).
    - `daphnis(rows)`: injects `Daphnis` (`id: '635'`, `a = 136505.5 km`, `e = 0.0000331`, `radiusKm: 3.8`, `ridge: true`) derived in Pan's ring plane when absent from Horizons outside the Cassini era.
    - Assigns `NOTABLE` measured triaxial `shapeAxesKm`, `ridge: true` (for `Pan`, `Daphnis`, `Atlas`), `surfaceKind` via `kindFor(m)` (`Inuit`/`Gallic` Saturnian or inner Jovian or distant Uranian → `'red'`; `Norse` Saturnian or outer Jovian or Uranian/Neptunian → `'dark'`; inner/Trojan/ring Saturnian or Plutonian → `'icy'`), and auto-generated textual descriptions (`describe(m)`).
    - Combined Atlas total: `1` Sun + `8` planets + `22` major moons + `2` dwarf planets + `9` asteroids + `437` minor moons = **`479` bodies** in `ALL_CELESTIAL_BODIES` (plus `Sagittarius A*`, `NASA_EXTRA_CELESTIAL_BODIES`, and `NASA_SPACECRAFT_CATALOG` via `CatalogueManager`).

- **Unified Lookup & NASA Eyes Integration (`CatalogueManager`)** ([src/data/CatalogueManager.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/CatalogueManager.ts#L1-L193))
  - Indexes `ALL_CELESTIAL_BODIES` + `SAGITTARIUS_A_STAR_DEF` (including aliases `'sagittarius a*'`, `'sgr a*'`, `'sgr a'`, `'black hole'`) by ID, lowercase name, and `moonsByParentId`.
  - Re-exports and indexes `NasaEyesCatalog` (`NASA_SPACECRAFT_CATALOG`, `NASA_EXTRA_CELESTIAL_BODIES`, `NASA_SMALL_BODY_MODELS`, `NASA_MISSION_EVENTS`):
    - `getSpacecraftCatalog()`, `getSpacecraftDefs()`, `getSpacecraftEntry(idOrName)`, `getSpacecraftByTarget(hostName)`.
    - `getNasaCelestialBodies()`, `getSceneBodies()` (merges core catalogue + `NASA_EXTRA_CELESTIAL_BODIES`).
    - `getSmallBodyModelPath(bodyNameOrId)`, `getMissionEvents()`, `resolveAnyBody(idOrName)` (checks core → NASA extra small bodies → NASA spacecraft definitions).

- **Constellation Stick Figures (`constellations.ts`)** ([src/data/constellations.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/constellations.ts#L1-L70))
  - Exports `CONSTELLATION_EDGES: Array<[number, number]>` as curated Hipparcos (`HIP`) catalog ID pairs for **9 constellations/asterisms**: Ursa Major / Big Dipper (`54061`–`67301`), Orion (`27989`–`24436`), Cassiopeia (`746`–`8886`), Crux (`60718`–`59747`), Cygnus (`102098`–`97165`), Leo (`49669`–`54879`), Scorpius (`80763`–`85927`), Canis Major (`32349`–`35904`), and Lyra (`91262`–`92791`).

---

### 8. Complete Catalog of All External, Scientific & Build-Script Sources

- **Orbital Ephemerides & Physical Constants** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L7-L23), [README.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/README.md#L114-L132))
  - **8 Major Planets**: NASA/JPL SSD *Keplerian Elements for Approximate Positions of the Major Planets* (E. M. Standish, Table 1, linear secular rates per TDB Julian century; Earth uses Earth–Moon barycentre row), `https://ssd.jpl.nasa.gov/planets/approx_pos.html` — public domain; valid `1800–2050 AD`, tested `< 0.25°` (typically `< 0.05°`) against VSOP87 in 2026 & 2040.
  - **Earth's Moon**: NASA/JPL SSD Planetary Satellite Mean Elements (`https://ssd.jpl.nasa.gov/sats/elem/`), epoch `2000-01-01.5 TDB` (`JD 2451545.0`), apsidal/nodal precession periods `5.997 yr` / `18.600 yr` — tested `< 2°` against JPL Horizons (`0.7°` on `2026-10-14`).
  - **21 Major Moons & 437 Minor Moons**: NASA/JPL Horizons API (`https://ssd.jpl.nasa.gov/api/horizons.api`), parent-centred osculating elements in J2000 ecliptic at epoch `2026-10-14.0 TDB` (`JD 2461327.5`), plus JPL SSD Planetary Satellite Physical Parameters (`https://ssd.jpl.nasa.gov/sats/phys_par/`) and Wikipedia `Moons of <Planet>` tables (`https://en.wikipedia.org/api/rest_v1/page/html/Moons_of_<planet>`) for supplemental diameters/magnitudes/groups/discovery years ([scripts/build_moon_catalogue.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/build_moon_catalogue.py#L1-L199)).
  - **Pluto, Ceres & 9 Named Asteroids + Small-Body Populations**: NASA/JPL Small-Body Database API (`https://ssd-api.jpl.nasa.gov/sbdb.api` and `https://ssd-api.jpl.nasa.gov/sbdb_query.api`, documented at `https://ssd-api.jpl.nasa.gov/doc/sbdb_query.html`). `scripts/build_small_bodies.py` pulls main belt (`H < 14.5`, ~33k largest), Hildas, Jupiter Trojans (`H < 14.5`), PHAs (`sb-group=pha`), Centaurs, TNOs, numbered periodic comets, and 7 great long-period comets (`C/1995 O1`, `C/2020 F3`, `C/2023 A3`, `C/1996 B2`, `C/2006 P1`, `C/2011 L4`, `C/2022 E3`) into `public/data/small-bodies.json` ([scripts/build_small_bodies.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/build_small_bodies.py#L1-L132)).
  - **Synthetic Main-Belt Decorative Rocks**: `3,200` instanced rocks generated with Mulberry32 PRNG (`seed = 19890825`) across `2.12–3.28 AU` with Kirkwood resonance gaps at `3:1` (`2.50 AU`), `5:2` (`2.82 AU`), `7:3` (`2.96 AU`), and `2:1` (`3.27 AU`).
  - **NASA Eyes Spacecraft & Extra Small Bodies**: referenced via `NasaEyesCatalog.ts` in [src/data/CatalogueManager.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/data/CatalogueManager.ts#L4-L12) and texture-compressed in `public/nasa/models` by [scripts/compress_nasa_textures.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/compress_nasa_textures.py#L1-L16).

- **Planetary Rotation Models** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L24-L29))
  - **IAU WGCCRE 2015**: Archinal, B. A. et al. (2018), *Celest. Mech. Dyn. Astr.* `130:22` — pole `(α₀, δ₀)` and prime meridian `W` for Sun, planets (including Neptune's pole nutation), Pluto, Ceres, Vesta, Eros, Gaspra, and Ida (used in `src/astronomy/BodyOrientation.ts`).
  - **Bennu**: Lauretta, D. S. et al. (2019), *Nature* `568:55`.
  - **Ryugu**: Watanabe, S. et al. (2019), *Science* `364:268`.

- **Star Catalogue, Sky Map & Galactic Constants** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L30-L45), [ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L99-L110), [scripts/build_star_subset.cjs](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/build_star_subset.cjs#L1-L32))
  - **ESA Hipparcos & Tycho Catalogues** (ESA 1997, ESA SP-1200 via CDS VizieR `I/239`; `https://www.cosmos.esa.int/web/hipparcos/catalogues`, **CC BY-NC 3.0 IGO** — imposes non-commercial constraint on Solaris): `41,394` stars (`V <= 8.0`) in unshipped `data/source/hipparcos_v8_full.json`, filtered by `scripts/build_star_subset.cjs` to `12,596` stars in `public/data/stars.json` (`V <= 4.6` celestial sphere + `12,281` stars with parallax S/N ≥ 5 within `120 pc` propagated linearly from `J1991.25`).
  - **ESA/Gaia/DPAC All-Sky Map** (`public/textures/gaia_sky.webp`, `4000×2000` WebP `q75`, **CC BY-SA 3.0 IGO**): galactic equirectangular map (`l = 0` centre).
  - **Face-On Milky Way Disk** (`public/textures/milky_way_disk.webp`, `2048×2048` WebP with alpha, **CC BY 4.0**): NASA/JPL-Caltech/ESO/R. Hurt (`eso1339e`), plus `140,000` importance-sampled disk stars with `sech²` vertical profile (and `14,000` additional procedural 3D galaxy stars).
  - **Galactic & Black Hole Constants**:
    - `R₀ = 8.277 kpc`, Sgr A* mass `4.297 × 10⁶ M☉`: GRAVITY Collaboration (2022), *A&A* `657`, L12 (note: `CatalogueData.ts` inline comment cites `2021`).
    - Sun height above galactic mid-plane `20.8 pc` (`21 pc` rounded in README): Bennett & Bovy (2019), *MNRAS* `482`, 1417.
    - Sgr A* shadow diameter `51.8 ± 2.3 µas` (and `42.0°` disk inclination): Event Horizon Telescope Collaboration (2022), *ApJL* `930`, L12.
    - IAU 1958 Galactic Frame in ICRS: North Galactic Pole `RA 192.85948°, Dec +27.12825°`; Galactic Centre `RA 266.40499°, Dec −28.93617°`.
    - Satellite Galaxies `(l, b, d)`: LMC `(280.47°, −32.89°, 49.59 kpc)` (Pietrzyński et al. 2019); SMC `(302.80°, −44.30°, 62.44 kpc)` (Graczyk et al. 2020); Sagittarius dSph `(5.6°, −14.2°, ~26.5 kpc)`.

- **Bundled Surface, Moon & Nebula Imagery** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L47-L57), [ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L112-L124), [scripts/download_textures.cjs](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/download_textures.cjs#L1-L40), [scripts/build_nebulae.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/build_nebulae.py#L1-L35))
  - **Solar System Scope (INOVE)** (`https://www.solarsystemscope.com/textures/`, download base `https://www.solarsystemscope.com/textures/download`, **CC BY 4.0**): `2k_*.jpg` / `2k_saturn_ring_alpha.png` and `hires/*_{4k,8k}.webp` / `saturn_ring_alpha_8k.png`.
  - **three.js r170 Planet Maps** (`https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/textures/planets`, **MIT**): `earth_normal_2048.jpg`, `earth_lights_2048.png`.
  - **Pluto & Charon** (`public/textures/2k_pluto.jpg`, `2k_charon.jpg`): NASA / Johns Hopkins APL / SwRI New Horizons mosaics (public domain).
  - **17 Major Moons**: `public/textures/moons/<name>.jpg` & `<name>_normal.jpg` (documented in `public/textures/moons/SOURCES.md`, referenced in [TexturePipeline.ts](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/src/rendering/TexturePipeline.ts#L311)).
  - **Deep-Sky Nebulae** (`public/textures/nebulae/`, **CC BY 4.0**): JWST "Cosmic Cliffs" NGC 3324 (NASA/ESA/CSA/STScI `weic2205a`, `4096 px`), Hubble "Mystic Mountain" Carina Nebula (NASA/ESA/M. Livio `heic1007a`, `2560 px`), ESO VISTA Helix Nebula (ESO/J. Emerson `eso1205a`, `3072 px`), plus 6 procedural fBM/domain-warped nebulae (`_lite` half-size variants for mobile) built by `scripts/build_nebulae.py`.

- **Streamed Surface Imagery Endpoints (Keyless, Public CORS-Verified)** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L59-L97), [scripts/verify-tile-sources.mjs](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/verify-tile-sources.mjs#L1-L95))
  - **Earth**: EOX IT Services GmbH `s2cloudless` 2016 (`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84`, **CC BY 4.0**, WGS84, served to level 17, 10 m source / ≈ 9.5 m/px; 2018+ excluded due to CC BY-NC-SA).
  - **Moon**: NASA Moon Trek WMTS `Kaguya_TCortho_Mosaic_Global_4096ppd` (`https://trek.nasa.gov/tiles/Moon/EQ/Kaguya_TCortho_Mosaic_Global_4096ppd`, JAXA/SELENE, level 10, ≈ 21 m/px).
  - **Mercury**: NASA Mercury Trek WMTS `Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m` (`https://trek.nasa.gov/tiles/Mercury/EQ/Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m`, NASA/JHUAPL/Carnegie, ≈ 234 m/px).
  - **Mars**: MRO CTX Global Mosaic beta01 (`CTX_beta01_uncontrolled_5m_Caltech`, Caltech Murray Lab / Dickson et al., served via Esri Astro REST `https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer`, level 12 ≈ 10 m/px, tinted).
  - **Venus**: USGS Astrogeology WMS 1.1.1 Magellan SAR (`https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/venus/venus_simp_cyl.map`, layer `MAGELLAN`, ≈ 290 m/px).
  - **Jovian Moons (USGS WMS 1.1.1, level 5)**: `Io` (`map=/maps/jupiter/io_simp_cyl.map`, `SSI_VGR_color`, ~1 km), `Europa` (`europa_simp_cyl.map`, `GALILEO_VOYAGER`, 500 m, tinted), `Ganymede` (`ganymede_simp_cyl.map`, `GALILEO_VOYAGER`, 1 km, tinted), `Callisto` (`callisto_simp_cyl.map`, `GALILEO_VOYAGER`, 1 km, tinted).
  - **Saturnian Moons (NASA Solar System Treks WMTS)**: `Titan` (`trek.nasa.gov/tiles/Titan/EQ/Titan_ISS_Globe_65Sto45N_450M_AvgMos`, level 6, 450 m at 938 nm), `Enceladus` (`.../Enceladus/EQ/Enceladus_Cassini_ISS_Global_Mosaic_100m_HPF`, level 5, 100 m), `Mimas` (`.../Mimas/EQ/MI_170630_DLR_basemap`, level 4), `Tethys` (`.../Tethys/EQ/Tethys_Cassini_mosaic_global_293m`, level 4), `Iapetus` (`.../Iapetus/EQ/Iapetus_Cassini_Voyager_mosaic_global_783m`, level 3).
  - **Triton, Pluto, Charon, Ceres (USGS WMS 1.1.1)**: `Triton` (`triton_simp_cyl.map`, `TRITON_VOYAGER2`, level 5, 600 m), `Pluto` (`pluto_simp_cyl.map`, `NEWHORIZONS_PLUTO_MOSAIC`, level 6, 300 m, tinted), `Charon` (`charon_simp_cyl.map`, `NEWHORIZONS_CHARON_MOSAIC`, level 5, tinted), `Ceres` (`ceres_simp_cyl.map`, `Ceres_FC_global`, level 6). (`Miranda` has no streamable map and uses its bundled map.)
  - **Vesta**: NASA Trek WMTS (`trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_Photo_DLR_global_74ppd_IAU`, level 6, 64 m).
  - **Landmark Coordinate Verification**: `scripts/fetch-landmark-coords.mjs` queries Wikipedia's API (`https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&coprop=globe|type`) and records verified results in `docs/research/landmark-coords.txt`; tile probes are saved in `docs/research/imagery-sources-probe.txt` and `imagery-sources-probe-2.txt`.

- **Elevation & Photorealistic 3D Tiles Sources** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L144-L168))
  - **Earth Terrain**: AWS Registry of Open Data Terrain Tiles (`s3.amazonaws.com/elevation-tiles-prod`, Terrarium PNG encoding; SRTM, GMTED2010/USGS, ETOPO1/NOAA via Tilezen Joerd), flat sea surface below sea level (`src/explorer/Elevation.ts`).
  - **Moon DEMs**: NASA Moon Trek 8-bit linear-stretch DEMs (`src/explorer/PlanetElevation.ts`):
    - ±60°: `SLDEM2015` (`trek.nasa.gov/tiles/Moon/EQ/LRO_LOLAKaguya_DEM_60N60S_512ppd`, 512 ppd / ~59 m, level 8), calibrated via regression (`height = -8.819 km + 77.16 m × value`) and smoothed.
    - Polar: `LRO_LOLA_DEM_Global_128ppd_v04` (`trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_DEM_Global_128ppd_v04`, level 5; range `−9.15` to `+10.76 km` around `1737.4 km`). (Esri `OnMoon/LOLA_Kaguya` rejected after closing tile requests on `2026-11-10`.)
  - **Mars DEM**: Esri Astro `HRSC + MOLA` blended 200 m DEM (`astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer/tile`, float32 LERC v1 tiles to level 7, decoded via Apache-2.0 `Lerc1.ts` port of `Esri/lerc`).
  - **Google Photorealistic 3D Tiles**: Google Maps Platform Map Tiles API (`https://tile.googleapis.com/v1/3dtiles`, `src/rendering/PhotorealEarth.ts`), active below `1,500 km` altitude when `VITE_GOOGLE_MAPS_API_KEY` is provided in `.env.local` (requires bottom-right data attributions, Google Maps logo, session-only caching, HTTP referrer restriction); falls back to EOX + AWS Terrain Tiles without a key.

- **Earth Flight Data, Jet Models, Audio & Fonts** ([ASSETS.md](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/ASSETS.md#L125-L175), [scripts/generate_vela_voice.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/generate_vela_voice.py#L1-L36), [scripts/generate_radio_voice.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/generate_radio_voice.py#L1-L60), [scripts/build_cockpit_sounds.py](file:///C:/Users/anish%20jha/.gemini/antigravity/scratch/solaris/scripts/build_cockpit_sounds.py#L1-L36))
  - **Live Weather**: [Open-Meteo](https://open-meteo.com/) forecast API (**CC BY 4.0**, keyless; refreshes after `10 minutes` or `80 km` in `src/flight/EarthClouds.ts`).
  - **Geocoding & Search**: OpenStreetMap Nominatim (`src/explorer/ReverseGeocode.ts`, `src/explorer/EarthSearch.ts`, **ODbL** © OpenStreetMap contributors, throttled `<= 1 req/s`, cached by area).
  - **Experimental Procedural Buildings**: [OpenFreeMap](https://openfreemap.org/) vector tiles (OpenMapTiles schema, off by default in `src/explorer/ProceduralCity.ts`, decoded with `@mapbox/vector-tile` + `pbf`).
  - **Jet 3D Models**:
    - Default `public/models/gripen.glb`: *"SAAB Jas 39A Gripen (Detailed Cockpit)"* by **ngkoret** (`https://sketchfab.com/3d-models/saab-jas-39a-gripen-detailed-cockpit-f4646ccf489341c28c4118de38feface`, **CC BY 4.0**).
    - `public/models/su30mkk.glb`: *"Su-30MKK with Kh-59M"* by **Jeyhun1985** (`https://sketchfab.com/3d-models/su-30mkk-with-kh-59m-da768c092b0f49b6b8bcb9e917e1e6a0`, **CC BY 4.0**).
  - **Voice Synthesis (Vela, Radio & Betty)**: ResembleAI Chatterbox (`ChatterboxTTS`, `ChatterboxTurboTTS`, `ChatterboxVC`, **MIT** `https://github.com/resemble-ai/chatterbox` / Hugging Face `ResembleAI/chatterbox`) + `openai-whisper` verification (`generate_radio_voice.py` / `build_cockpit_sounds.py --betty`), EBU R128 loudness levelled (`−17 LUFS` for Vela's `572` lines in `public/voice/vela/`, `−19 LUFS` at `24 kHz` mono MP3 for dry radio lines in `public/voice/radio/`).
  - **Cockpit Sound Effects & Music**: 9 Pixabay sound effects (Pixabay Content License; IDs `69348`, `73978`, `352689`, `352731`, `33685`, `286108`, `22955`, `503718`, `102406`) cut/looped at `32 kHz` into `public/audio/jet/` by `scripts/build_cockpit_sounds.py`; `public/music/` *"Solaris — Slowed + Reverb (Lofi Edition)"* at `−18 LUFS`.
  - **Open-Licence Fonts (SIL OFL)**: `Montserrat`, `Instrument Serif`, `JetBrains Mono`, `VT323` (`scripts/readme/.fonts/`, rendered to vector paths in `docs/readme/` by `scripts/readme/build_readme_art.py` + `scripts/readme/export_vela.mjs`).

---

## Part II: Orbital Mechanics, Ephemeris Maths, Coordinate Frames, Simulation Clock & Deep-Time Eras

---

### 1. J2000 Catalogue & Secular Orbital Elements (`src/astronomy/SolarSystemData.ts`)

- **Catalogue Scope (`SOLAR_SYSTEM_BODIES`)**: Defines 9 primary bodies (`id` follows JPL NAIF IDs: `10` Sun, `199` Mercury, `299` Venus, `399` Earth, `499` Mars, `599` Jupiter, `699` Saturn, `799` Uranus, `899` Neptune).
- **Orbital Reference & Validity**: All 8 planetary orbits use **JPL SSD "Keplerian Elements for Approximate Positions of the Major Planets" (Standish), Table 1**, referred to the **J2000.0 ecliptic & equinox** ($\text{epochJd} = 2451545.0\text{ TDB}$), valid over **1800–2050 AD**. Earth's orbit represents the **Earth–Moon barycenter**.
- **Conventions**:
  - Argument of periapsis $\omega = \varpi - \Omega$ (`argumentPeriapsisDeg`).
  - Mean anomaly at J2000.0 $M_0 = L - \varpi$ (`meanAnomalyAtEpochDeg`).
  - Rates in `ratesPerCentury` are linear secular drift rates per Julian century ($36525.0\text{ days}$) relative to J2000.0: $\dot{a}$ (`semiMajorAxisAU`, AU/cy), $\dot{e}$ (`eccentricity`, /cy), $\dot{i}$ (`inclinationDeg`, °/cy), $\dot{\Omega}$ (`longitudeAscendingNodeDeg`, °/cy), $\dot{\omega}$ (`argumentPeriapsisDeg`, °/cy), and $\dot{M}$ (`meanAnomalyDeg`, °/cy).
  - Retrograde planetary spin is encoded via negative `rotationPeriodHours` (Venus: `-5832.5 h`, Uranus: `-17.24 h`).

#### 1.1 Physical Parameters (`physical`)

| ID | Name | Category | Mean / Eq / Polar Radius (km) | Flattening | Mass (kg) | $GM$ ($\text{km}^3/\text{s}^2$) | Rotation Period (h) | Axial Tilt (°) | Mean Temp (K) | Color Hex |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `10` | Sun | `star` (G2V) | `695700` / `695700` / `695700` | `0.0` | `1.9885e30` | `132712440041.9394` | `609.12` (~25.38 d eq) | `7.25` | `5778` | `#ffdd77` |
| `199` | Mercury | `planet` | `2439.7` / `2439.7` / `2439.7` | `0.0` | `3.3011e23` | `22031.78` | `1407.6` (3:2 res) | `0.034` | `440` | `#9c968f` |
| `299` | Venus | `planet` | `6051.8` / `6051.8` / `6051.8` | `0.0` | `4.8675e24` | `324858.59` | `-5832.5` (retro) | `177.36` | `737` | `#e3bb7b` |
| `399` | Earth | `planet` | `6371.0` / `6378.137` / `6356.752` | `0.003353` | `5.9722e24` | `398600.4418` | `23.9344` | `23.439` | `288` | `#4b75a1` |
| `499` | Mars | `planet` | `3389.5` / `3396.2` / `3376.2` | `0.00589` | `6.4171e23` | `42828.375` | `24.6229` | `25.19` | `210` | `#c16138` |
| `599` | Jupiter | `planet` | `69911` / `71492` / `66854` | `0.06487` | `1.8982e27` | `126686534.92` | `9.925` | `3.13` | `165` | `#c8a679` |
| `699` | Saturn | `planet` | `58232` / `60268` / `54364` | `0.09796` | `5.6834e26` | `37931187.9` | `10.656` | `26.73` | `134` | `#dfcf9f` |
| `799` | Uranus | `planet` | `25362` / `25559` / `24973` | `0.02293` | `8.6810e25` | `5793939.3` | `-17.24` (retro) | `97.77` | `76` | `#8fe0ea` |
| `899` | Neptune | `planet` | `24622` / `24764` / `24341` | `0.01708` | `1.02413e26` | `6835099.5` | `16.11` | `28.32` | `72` | `#4b70dd` |

#### 1.2 J2000 Keplerian Elements & Secular Drift Rates (`orbit` & `ratesPerCentury`)

- **Sun (`10`)**: Stationary center; all orbital elements and `orbitalPeriodDays` are `0`.
- **Mercury (`199`)**:
  - Epoch elements: $a = 57909226.5\text{ km}$ (`0.38709927 AU`), $e = 0.20563593$, $i = 7.00497902^\circ$, $\Omega = 48.33076593^\circ$, $\omega = 29.12703035^\circ$, $M_0 = 174.79252722^\circ$, $P = 87.969\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = 3.7\times 10^{-7}\text{ AU}$, $\dot{e} = 1.906\times 10^{-5}$, $\dot{i} = -0.00594749^\circ$, $\dot{\Omega} = -0.12534081^\circ$, $\dot{\omega} = 0.2858177^\circ$, $\dot{M} = 149472.51363486^\circ$.
- **Venus (`299`)**:
  - Epoch elements: $a = 108209474.5\text{ km}$ (`0.72333566 AU`), $e = 0.00677672$, $i = 3.39467605^\circ$, $\Omega = 76.67984255^\circ$, $\omega = 54.92262463^\circ$, $M_0 = 50.37663232^\circ$, $P = 224.701\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = 3.9\times 10^{-6}\text{ AU}$, $\dot{e} = -4.107\times 10^{-5}$, $\dot{i} = -0.0007889^\circ$, $\dot{\Omega} = -0.27769418^\circ$, $\dot{\omega} = 0.28037747^\circ$, $\dot{M} = 58517.812704^\circ$.
- **Earth (`399`)**:
  - Epoch elements: $a = 149598261.2\text{ km}$ (`1.00000261 AU`), $e = 0.01671123$, $i = -1.531\times 10^{-5\circ}$, $\Omega = 0.0^\circ$, $\omega = 102.93768193^\circ$, $M_0 = 357.52688973^\circ$, $P = 365.256\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = 5.62\times 10^{-6}\text{ AU}$, $\dot{e} = -4.392\times 10^{-5}$, $\dot{i} = -0.01294668^\circ$, $\dot{\Omega} = 0.0^\circ$, $\dot{\omega} = 0.32327364^\circ$, $\dot{M} = 35999.04917617^\circ$.
- **Mars (`499`)**:
  - Epoch elements: $a = 227943822.4\text{ km}$ (`1.52371034 AU`), $e = 0.0933941$, $i = 1.84969142^\circ$, $\Omega = 49.55953891^\circ$, $\omega = -73.5031685^\circ$, $M_0 = 19.39019754^\circ$, $P = 686.980\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = 1.847\times 10^{-5}\text{ AU}$, $\dot{e} = 7.882\times 10^{-5}$, $\dot{i} = -0.00813131^\circ$, $\dot{\Omega} = -0.29257343^\circ$, $\dot{\omega} = 0.73698431^\circ$, $\dot{M} = 19139.85827411^\circ$.
- **Jupiter (`599`)**:
  - Epoch elements: $a = 778340816.7\text{ km}$ (`5.202887 AU`), $e = 0.04838624$, $i = 1.30439695^\circ$, $\Omega = 100.47390909^\circ$, $\omega = -85.74542926^\circ$, $M_0 = 19.66796068^\circ$, $P = 4332.589\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = -0.00011607\text{ AU}$, $\dot{e} = -0.00013253$, $\dot{i} = -0.00183714^\circ$, $\dot{\Omega} = 0.20469106^\circ$, $\dot{\omega} = 0.00783562^\circ$, $\dot{M} = 3034.53360107^\circ$.
- **Saturn (`699`)**:
  - Epoch elements: $a = 1426666414.2\text{ km}$ (`9.53667594 AU`), $e = 0.05386179$, $i = 2.48599187^\circ$, $\Omega = 113.66242448^\circ$, $\omega = -21.06354617^\circ$, $M_0 = 317.35536592^\circ$, $P = 10759.22\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = -0.0012506\text{ AU}$, $\dot{e} = -0.00050991$, $\dot{i} = 0.00193609^\circ$, $\dot{\Omega} = -0.28867794^\circ$, $\dot{\omega} = -0.13029422^\circ$, $\dot{M} = 1222.91259417^\circ$.
- **Uranus (`799`)**:
  - Epoch elements: $a = 2870658170.7\text{ km}$ (`19.18916464 AU`), $e = 0.04725744$, $i = 0.77263783^\circ$, $\Omega = 74.01692503^\circ$, $\omega = 96.93735127^\circ$, $M_0 = 142.28382821^\circ$, $P = 30685.4\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = -0.00196176\text{ AU}$, $\dot{e} = -4.397\times 10^{-5}$, $\dot{i} = -0.00242939^\circ$, $\dot{\Omega} = 0.04240589^\circ$, $\dot{\omega} = 0.36564692^\circ$, $\dot{M} = 428.07397504^\circ$.
- **Neptune (`899`)**:
  - Epoch elements: $a = 4498396417.0\text{ km}$ (`30.06992276 AU`), $e = 0.00859048$, $i = 1.77004347^\circ$, $\Omega = 131.78422574^\circ$, $\omega = -86.81946347^\circ$, $M_0 = 259.91520804^\circ$, $P = 60189.0\text{ d}$.
  - Rates (`d/cy`): $\dot{a} = 0.00026291\text{ AU}$, $\dot{e} = 5.105\times 10^{-5}$, $\dot{i} = 0.00035372^\circ$, $\dot{\Omega} = -0.00508664^\circ$, $\dot{\omega} = -0.317328^\circ$, $\dot{M} = 218.78186789^\circ$.

---

### 2. Analytical Two-Body & Secular Ephemeris Solver (`src/astronomy/KeplerSolver.ts`)

- **Physical & Time Constants**:
  - `GM_SUN = 132712440041.9394` $\text{km}^3/\text{s}^2$
  - `DAYS_PER_CENTURY = 36525.0`
  - `AU_KM = 149597870.7` $\text{km}$
  - `J2000_JD = 2451545.0` (TDB)
- **Kepler's Equation Solver (`solveKepler(M, e, tolerance = 1e-12, maxIterations = 25)`)**:
  - Solves $M = E - e\sin E$ for eccentric anomaly $E$ (rad) on elliptical orbits ($0 \le e < 1$).
  - **Normalization**: Wraps $M$ into $[-\pi, \pi]$ via `((M % 2π) + 2π) % 2π`, subtracting $2\pi$ if $M > \pi$.
  - **Initial Estimate $E_0$**:
    - Low eccentricity ($e < 0.18$): $E_0 = M + e\sin M$
    - High eccentricity ($e \ge 0.18$): $E_0 = M + \text{sign}\cdot 0.85\,e$, where $\text{sign} = -1$ if $M < 0$ else $+1$.
  - **Newton-Raphson Iteration**:
    - Evaluates $f(E) = E - e\sin E - M$ and $f'(E) = 1 - e\cos E$.
    - Stops early if $|f| < \text{tolerance}$, if $|f'| < 10^{-15}$ (division-by-zero guard), or if step $|\Delta| = |f / f'| < \text{tolerance}$ after $E \leftarrow E - \Delta$.
- **Osculating Element Evaluation (`elementsAt(elements, elapsedDaysSinceJ2000, gm = GM_SUN)`)**:
  - Accounts for arbitrary element epoch: $\Delta t = \text{elapsedDaysSinceJ2000} - ((\text{epochJd} ?? 2451545.0) - 2451545.0)$.
  - **Model 1 — Secular-rate planets** (`ratesPerCentury` defined):
    - $T = \Delta t / 36525.0$
    - $a = (a_{\text{AU}} + \dot{a}_{\text{AU}}\,T)\cdot 149597870.7\text{ km}$
    - $e = e_0 + \dot{e}\,T$, $i = i_0 + \dot{i}\,T$, $\Omega = \Omega_0 + \dot{\Omega}\,T$, $\omega = \omega_0 + \dot{\omega}\,T$
    - $M_{\text{rad}} = (M_0 + \dot{M}\,T)\cdot \frac{\pi}{180}$
  - **Model 2 — Mean-element satellites / small bodies** (`meanMotionDegPerDay` defined):
    - $n_{\text{rad/d}} = \text{meanMotionDegPerDay} \cdot \frac{\pi}{180}$
    - $\Omega = \Omega_0 + (\text{nodeRateDegPerDay} ?? 0)\cdot \Delta t$, $\omega = \omega_0 + (\text{periapsisArgRateDegPerDay} ?? 0)\cdot \Delta t$, $M_{\text{rad}} = M_0\frac{\pi}{180} + n_{\text{rad/d}}\,\Delta t$
  - **Model 3 — Plain two-body elements**:
    - $n_{\text{rad/d}} = \sqrt{\mu / a^3} \cdot 86400.0$, with constant $a, e, i$ and optional nodal/apsidal rates.
- **State Vector Propagation (`propagate(elements, elapsedDays, gm = GM_SUN)`)**:
  - If `semiMajorAxisKm <= 0`, returns zero position, velocity, distance, speed, and anomalies.
  - **True Anomaly ($\nu$) & Radius ($r$)**:
    - $\sin\nu = \frac{\sqrt{1 - e^2}\sin E}{1 - e\cos E}$, $\cos\nu = \frac{\cos E - e}{1 - e\cos E}$, $\nu = \operatorname{atan2}(\sin\nu, \cos\nu)$
    - $r = a(1 - e\cos E)$
  - **Perifocal State**:
    - Position: $x' = a(\cos E - e)$, $y' = a\sqrt{1 - e^2}\sin E$
    - Velocity: $v_{\text{factor}} = \frac{\sqrt{\mu a}}{r}$, $v_{x'} = -v_{\text{factor}}\sin E$, $v_{y'} = v_{\text{factor}}\sqrt{1 - e^2}\cos E$
  - **Perifocal-to-Ecliptic Basis (`perifocalBasis(iDeg, argPeriDeg, nodeDeg)`)**:
    - Rotation $R = R_z(-\Omega)\cdot R_x(-i)\cdot R_z(-\omega)$:
    - $\mathbf{P} = [\cos\Omega\cos\omega - \sin\Omega\sin\omega\cos i,\; \sin\Omega\cos\omega + \cos\Omega\sin\omega\cos i,\; \sin\omega\sin i]$
    - $\mathbf{Q} = [-\cos\Omega\sin\omega - \sin\Omega\cos\omega\cos i,\; -\sin\Omega\sin\omega + \cos\Omega\cos\omega\cos i,\; \cos\omega\sin i]$
    - $\mathbf{r}_{\text{ecl}} = x'\mathbf{P} + y'\mathbf{Q}$, $\mathbf{v}_{\text{ecl}} = v_{x'}\mathbf{P} + v_{y'}\mathbf{Q}$, $v = \|\mathbf{v}_{\text{ecl}}\|$.
    - `trueAnomalyDeg` and `eccentricAnomalyDeg` wrapped to $[0^\circ, 360^\circ)$.
- **Orbit Path Sampling (`sampleOrbitPath(elements, segments = 128, elapsedDays = 0)`)**:
  - Samples $E_k = \frac{k}{\text{segments}}\cdot 2\pi$ for $k = 0 \dots \text{segments}$ with semi-minor axis $b = a\sqrt{\max(0, 1 - e^2)}$ in the J2000 ecliptic frame.

---

### 3. Coordinate Frame Transformations (`src/astronomy/CoordinateFrames.ts`)

- **J2000.0 Obliquity of the Ecliptic**:
  - `OBLIQUITY_J2000_DEG = 23.43929111` ($23^\circ 26' 21.406''$ IAU standard), `OBLIQUITY_J2000_RAD = (23.43929111 * Math.PI) / 180.0`.
- **Heliocentric Ecliptic J2000 $\leftrightarrow$ Equatorial ICRF**:
  - `eclipticToIcrf`: rotation around $+X$ by $+\epsilon$:
    $$X_{\text{icrf}} = X_{\text{ecl}}, \quad Y_{\text{icrf}} = Y_{\text{ecl}}\cos\epsilon - Z_{\text{ecl}}\sin\epsilon, \quad Z_{\text{icrf}} = Y_{\text{ecl}}\sin\epsilon + Z_{\text{ecl}}\cos\epsilon$$
  - `icrfToEcliptic`: inverse rotation around $+X$ by $-\epsilon$:
    $$X_{\text{ecl}} = X_{\text{icrf}}, \quad Y_{\text{ecl}} = Y_{\text{icrf}}\cos\epsilon + Z_{\text{icrf}}\sin\epsilon, \quad Z_{\text{ecl}} = -Y_{\text{icrf}}\sin\epsilon + Z_{\text{icrf}}\cos\epsilon$$
- **Ecliptic / ICRF $\leftrightarrow$ Three.js Render Coordinates**:
  - Three.js maps $(X, Z)$ to the horizontal ecliptic plane and $+Y$ to ecliptic north (preserving right-handedness):
  - `eclipticToThree`: $[x, y, z]_{\text{ecl}} \mapsto [x,\; z,\; -y]_{\text{three}}$
  - `threeToEcliptic`: $[x, y, z]_{\text{three}} \mapsto [x,\; -z,\; y]_{\text{ecl}}$
  - `icrfToThree`: `eclipticToThree(icrfToEcliptic(icrf))`
- **Spherical ICRF & IAU 1958 Galactic Frame**:
  - `raDecToIcrf(raDeg, decDeg)`: $[\cos\delta\cos\alpha,\; \cos\delta\sin\alpha,\; \sin\delta]$
  - Constants in ICRS (J2000):
    - North Galactic Pole (NGP): `NGP_RA_DEG = 192.85948`, `NGP_DEC_DEG = 27.12825`
    - Galactic Centre (GC): `GC_RA_DEG = 266.40499`, `GC_DEC_DEG = -28.93617`
  - `galacticBasisThree()`: transforms NGP (`z`) and GC into Three.js coordinates, removes residual component of GC along `z` ($\mathbf{x}_{\text{raw}} = \mathbf{gc} - (\mathbf{gc}\cdot\mathbf{z})\mathbf{z}$), normalizes to `x` ($l=0^\circ, b=0^\circ$), and completes the right-handed triad via $\mathbf{y} = \mathbf{z} \times \mathbf{x}$ ($l=90^\circ$).

---

### 4. Body Orientation, IAU Spin Poles & Prime Meridians (`src/astronomy/BodyOrientation.ts`)

- **IAU Rotational Model (Archinal et al. 2018, WGCCRE 2015)**:
  - For $T = d / 36525.0$ Julian centuries and $d$ days TDB since J2000.0:
    $$\alpha_0 = \text{ra0} + \text{raRate}\cdot T, \qquad \delta_0 = \text{dec0} + \text{decRate}\cdot T, \qquad W = w_0 + w_{\text{Rate}}\cdot d$$
  - **Neptune Nutation Correction** (`neptuneNutation: true`):
    - $N = (357.85 + 52.316\,T)\cdot \frac{\pi}{180}$
    - $\alpha_0 \mathrel{+}= 0.7^\circ\sin N$, $\delta_0 \mathrel{-}= 0.51^\circ\cos N$, $W \mathrel{-}= 0.48^\circ\sin N$.
- **All 15 `IAU_ROTATION_MODELS` Entries** (`ra0`, `raRate`, `dec0`, `decRate`, `w0`, `wRate` in deg & deg/day):
  - `Sun`: `ra0: 286.13`, `dec0: 63.87`, `w0: 84.176`, `wRate: 14.1844`
  - `Mercury`: `ra0: 281.0103`, `raRate: -0.0328`, `dec0: 61.4155`, `decRate: -0.0049`, `w0: 329.5988`, `wRate: 6.1385108`
  - `Venus`: `ra0: 272.76`, `dec0: 67.16`, `w0: 160.2`, `wRate: -1.4813688`
  - `Earth`: `ra0: 0.0`, `raRate: -0.641`, `dec0: 90.0`, `decRate: -0.557`, `w0: 190.147`, `wRate: 360.9856235`
  - `Mars`: `ra0: 317.269202`, `raRate: -0.10927547`, `dec0: 54.432516`, `decRate: -0.05827105`, `w0: 176.049863`, `wRate: 350.891982443297`
  - `Jupiter`: `ra0: 268.056595`, `raRate: -0.006499`, `dec0: 64.495303`, `decRate: 0.002413`, `w0: 284.95`, `wRate: 870.536`
  - `Saturn`: `ra0: 40.589`, `raRate: -0.036`, `dec0: 83.537`, `decRate: -0.004`, `w0: 38.9`, `wRate: 810.7939024`
  - `Uranus`: `ra0: 257.311`, `dec0: -15.175`, `w0: 203.81`, `wRate: -501.1600928`
  - `Neptune`: `ra0: 299.36`, `dec0: 43.46`, `w0: 249.978`, `wRate: 541.1397757`, `neptuneNutation: true`
  - `Pluto`: `ra0: 132.993`, `dec0: -6.163`, `w0: 302.695`, `wRate: 56.3625225`
  - `Ceres`: `ra0: 291.418`, `dec0: 66.764`, `w0: 170.65`, `wRate: 952.1532`
  - `Vesta`: `ra0: 309.031`, `dec0: 42.235`, `w0: 285.39`, `wRate: 1617.3329428`
  - `Eros`: `ra0: 11.35`, `dec0: 17.22`, `w0: 326.07`, `wRate: 1639.38864745`
  - `Gaspra`: `ra0: 9.47`, `dec0: 26.7`, `w0: 83.67`, `wRate: 1226.911485`
  - `Ida`: `ra0: 168.76`, `dec0: -87.12`, `w0: 274.05`, `wRate: 1864.628007`
- **Ecliptic Spin-Pole Models (`ECLIPTIC_POLE_MODELS`)**:
  - Used for bodies outside WGCCRE tables with ecliptic $(\lambda, \beta)$ and sidereal period $P$ (prime meridian starts at $W = 0$):
    - `Bennu` (Lauretta et al. 2019, retrograde): `lambdaDeg: 69.92`, `betaDeg: -83.45`, `periodHours: 4.296057`
    - `Ryugu` (Watanabe et al. 2019, retrograde): `lambdaDeg: 179.3`, `betaDeg: -87.44`, `periodHours: 7.6326`
  - Pole vector: $\mathbf{p}_{\text{ecl}} = [\cos\beta\cos\lambda,\; \cos\beta\sin\lambda,\; \sin\beta]$, node $= \text{eclNorth} \times \mathbf{p}$ (fallback `[1,0,0]` if $|\text{node}| < 10^{-6}$), $\text{spinRad} = \frac{d\cdot 24.0}{P}\cdot 2\pi$.
- **Body-Fixed Frame Construction (`getBodyFrame`, `getSynchronousFrame`, `buildFrame`)**:
  - `getBodyFrame`: ICRF pole $\mathbf{p}_{\text{icrf}} = \text{raDecToIcrf}(\alpha_0, \delta_0)$; ascending node of body equator on ICRF equator at $\text{RA} = \alpha_0 + 90^\circ$ is $\mathbf{n}_{\text{icrf}} = [-\sin\alpha_0,\; \cos\alpha_0,\; 0]$. Both are converted via `icrfToThree`; `buildFrame` normalizes `yAxis` (north pole), orthogonalizes `xAxis` against `yAxis`, and computes `zAxis = xAxis × yAxis`. `spinRad = W * π/180` rotates Three.js `SphereGeometry` (`u = 0.5` on `+X`, east toward `-Z`) around local `+Y`.
  - `getSynchronousFrame(relPosEcl, relVelEcl)`: Tidally locked satellite frame — orbit normal pole `yAxis = norm(pos × vel)`, prime meridian `xAxis = norm(-pos)` facing parent (IAU sub-planet point convention), `spinRad = 0`.
  - `bodyFixedLongitudeDeg(frame, dirThree)`: Spins node by $W$ via $X' = x\cos W - z\sin W$, computes east $= y \times X'$, and returns $\text{atan2}(\mathbf{dir}\cdot\text{east},\; \mathbf{dir}\cdot X')$ wrapped to $[-180^\circ, 180^\circ)$.

---

### 5. Spacecraft Trajectories & `.dyn` Binary Propagators (`src/astronomy/DynamoTrajectory.ts`)

- **Time Conversion**: `J2000_JD = 2451545.0`; `jdTdbToJ2000Sec(jdTDB) = (jdTDB - 2451545.0) * 86400`; inverse `j2000SecToJdTdb(tSec) = 2451545.0 + tSec / 86400`.
- **NASA Eyes `.dyn` v2 Binary Format (`parseDynBuffer`)**:
  - Header starts with `uint16` little-endian `version === 2`, followed by null-terminated ASCII `kindStr` (`orb`, `pos`, `quat`, `ori`, or `lin`).
  - `orb` (stride 72 bytes / 9 `float64`): `gmKm3S2` at `off + 9`, `flag` at `off + 17`, `count` (`uint32`) at `off + 18`; packed tuples `[t0, aKm, ecc, nRadS, M0Rad, qw, qx, qy, qz]` starting at `off + 22`.
  - `pos` (stride 56 bytes / 7 `float64`): `flag` at `off + 1`, `count` (`uint32`) at `off + 2`; packed tuples `[t, xKm, yKm, zKm, vxKmS, vyKmS, vzKmS]` starting at `off + 6`.
  - `quat` (stride 40 bytes / 5 `float64`): `flag` at `off + 1`, `count` (`uint32`) at `off + 2`; packed tuples `[t, qw, qx, qy, qz]` starting at `off + 6`.
  - `ori` / `lin`: returns non-inline manifest stub (`inline: false`, `count: 0`).
  - Fetches asynchronously from `${BASE_URL}nasa/trajectories/${file}` with deduplicated `inflightFetches` and `parsedCache` (`loadDynSegment`, `prefetchEntryDyn`, `awaitEntryDyn`).
- **Piecewise Orbital Evaluator (`evaluateOrbSegment`)**:
  - Binary searches the last osculating piece with $t_0 \le t_{\text{sec}}$, evaluates $M = M_0 + n(t_{\text{sec}} - t_0)$.
  - **Hyperbolic Orbit Solver (`ecc > 1.000001`, `solveHyperbolicKepler`)**:
    - Solves $f(H) = e\sinh H - H - M = 0$ with $f'(H) = e\cosh H - 1$.
    - Seed: $H_0 = M / \max(10^{-4}, e - 1)$ if $|M| < 1$, else $\operatorname{asinh}(M / e)$.
    - Newton step clamped to $[-2.5, 2.5]$, max 24 iterations, stops if $|f'| < 10^{-12}$ or $|\text{step}| < 10^{-11}$.
    - Perifocal state: $r_x = a(e - \cosh H)$, $r_y = a\sqrt{e^2 - 1}\sinh H$, $\text{scale} = \frac{a n}{\max(10^{-9}, e\cosh H - 1)}$, $v_x = -\text{scale}\sinh H$, $v_y = \text{scale}\sqrt{e^2 - 1}\cosh H$.
  - **Elliptic Orbit Solver (`ecc <= 1.000001`, `solveEllipticKepler`)**:
    - Clamps $e_{\text{safe}} = \min(e, 0.999999)$, wraps $M_w \in [-\pi, \pi]$, seeds $E_0 = M_w + e\sin M_w$ ($e < 0.2$) or $M_w \pm 0.85\,e$, runs up to 20 Newton-Raphson iterations until $|\Delta| < 10^{-11}$.
    - Perifocal state: $r_x = a(\cos E - e_{\text{safe}})$, $r_y = a\sqrt{1 - e_{\text{safe}}^2}\sin E$, $\text{scale} = \frac{a n}{\max(10^{-9}, 1 - e_{\text{safe}}\cos E)}$, $v_x = -\text{scale}\sin E$, $v_y = \text{scale}\sqrt{1 - e_{\text{safe}}^2}\cos E$.
  - Rotates perifocal `(rx, ry, 0)` and `(vx, vy, 0)` into **ICRF** via the piece's `wxyz` unit quaternion.
- **Cubic Hermite Table Evaluator (`evaluatePosSegment`)**:
  - Uses `binarySearchInterval` and normalized $u = \operatorname{clamp}((t_{\text{sec}} - t_0) / \Delta t, 0, 1)$ (returns constant sample if $\Delta t \le 10^{-6}$).
  - Position polynomials: $h_{00} = 2u^3 - 3u^2 + 1$, $h_{10} = u^3 - 2u^2 + u$, $h_{01} = -2u^3 + 3u^2$, $h_{11} = u^3 - u^2$, $\mathbf{p}(u) = h_{00}\mathbf{p}_0 + h_{10}\Delta t\mathbf{v}_0 + h_{01}\mathbf{p}_1 + h_{11}\Delta t\mathbf{v}_1$.
  - Velocity derivatives: $dh_{00} = (6u^2 - 6u)/\Delta t$, $dh_{10} = 3u^2 - 4u + 1$, $dh_{01} = (-6u^2 + 6u)/\Delta t$, $dh_{11} = 3u^2 - 2u$, $\mathbf{v}(u) = dh_{00}\mathbf{p}_0 + dh_{10}\mathbf{v}_0 + dh_{01}\mathbf{p}_1 + dh_{11}\mathbf{v}_1$.
- **Attitude Quaternion Evaluator (`evaluateQuatSegment`)**:
  - Normalizes bracketing `wxyz` quaternions, interpolates with SLERP (`q0.slerp(q1, u)`), and premultiplies by `ICRF_TO_THREE_QUAT` (derived from `CoordinateFrames.icrfToThree` basis vectors).
- **Scene-Space Spacecraft Evaluation (`evaluateSpacecraftSceneState`)**:
  - **Variant Deployment Cutoffs (`VARIANT_DEPLOY_SEC`, J2000 TDB seconds)**: switches stowed/cruise GLTF to deployed/rover model after cutoff:
    - `sc_jwst`: `694872000` (2022-01-08)
    - `sc_insight`: `596505600` (2018-11-26)
    - `sc_mars_2020`: `666883200` (2021-02-18)
    - `sc_mars_exploration_rover_1`: `126446400` (2004-01-04)
    - `sc_mars_exploration_rover_2`: `128260800` (2004-01-25)
    - `sc_mars_science_laboratory`: `397440000` (2012-08-06)
    - `sc_phoenix`: `264988800` (2008-05-25)
    - `sc_philae` surface phase threshold: `tSec >= 469108800` (2014-11-12T12:00Z)
  - **4-Tier Evaluation Priority**:
    1. **Surface-mounted (`activeSource: 'surface'`)**: Places lander/rover at planetocentric $(\text{latDeg}, \text{lonDeg})$ using spherical local normal transformed by host `matrixWorld`, at `mountRadius = visRadius * 1.0035 + altKm * UNITS_PER_KM`.
    2. **Inline `.dyn` segment (`activeSource: 'dyn-orb' | 'dyn-pos'`)**: `selectActiveSegmentMeta` picks covered segment maximizing `localityScore * 10 + kindScore` (non-Sun parent `localityScore = 2` over Sun `1`; `pos` `kindScore = 1` over `orb` `0`). Maps `NASA_PARENT_ID_MAP` (28 tokens including planets, moons, dwarf/minor bodies, and parent spacecraft `galileo` / `sc_osiris_rex`). Scales distance: around Sun $\max(\text{parentVisR} \cdot 1.06,\; d_{\text{km}}\cdot\text{UNITS\_PER\_KM})$; around non-Sun parent $\max(\text{parentVisR} \cdot 1.024,\; \text{moonDistanceKm}(d_{\text{km}}, R_{\text{parent}}, \text{WORLD\_SCALE})\cdot\text{UNITS\_PER\_KM})$.
    3. **Sun–Earth Lagrange Halo (`activeSource: 'halo'`)**: Anchored at `lDistKm = 1500000` km along `sunToEarth` (`+1` for L2, `-1` for L1) via `moonDistanceKm(1500000, 6371, WORLD_SCALE) * UNITS_PER_KM`, with elliptical Lissajous/halo oscillation `ampUnits = amplitudeKm * UNITS_PER_KM * 4.5` horizontally and `0.42 * ampUnits` vertically; fallback attitude points `+Z` along `awayFromSun`.
    4. **Analytical Kepler Fallback (`activeSource: 'kepler'`)**: Propagates `fallbackOrbit` via `KeplerSolver.propagate` using `resolveFallbackParentGmKm3S2` (prefers `resolver.getGravitationalParameterKm3S2`, else `GM_SUN` for Sun, else $(2\pi / (P_{\text{days}}\cdot 86400))^2 a_{\text{km}}^3$ from Kepler's third law, else `GM_SUN`). Last resort parks at `1.25 * visRadius` near `hostBody`.

---

### 6. Relativistic Black Hole Physics: Sagittarius A* (`src/data/SagittariusAStarData.ts`)

- *(Note: Stellar S-cluster / S2 orbit kinematics are referenced in `PlanetNarratives.ts` via GRAVITY/ESO VLTI gravitational redshift observations; the dedicated relativistic code in `SagittariusAStarData.ts` implements the authoritative Schwarzschild baseline model for Sgr A*.)*
- **Identification & Galactic Coordinates (`galacticCenter`)**:
  - `name`: `'Sagittarius A*'`, `designation`: `'CXOGC J174540.0-290028'`, `classification`: `'Supermassive Black Hole (SMBH)'`
  - Galactic System (IAU 1958 / ICRF J2000): $l = 359.944^\circ$, $b = -0.046^\circ$, $\text{RA}_{\text{J2000}} = \text{17h 45m 40.0409s}$, $\text{Dec}_{\text{J2000}} = -29^\circ 00'\,28.118''$.
- **Fundamental Physical Constants (CODATA 2018 / IAU 2015)**:
  - $G = 6.67430\times 10^{-11}\text{ m}^3\,\text{kg}^{-1}\,\text{s}^{-2}$
  - $c = 2.99792458\times 10^8\text{ m/s}$
  - $M_\odot = 1.98847\times 10^{30}\text{ kg}$
  - $\text{AU} = 1.495978707\times 10^{11}\text{ m}$, $\text{pc} = 3.085677581\times 10^{16}\text{ m}$, $\text{ly} = 9.460730472\times 10^{15}\text{ m}$
- **Adopted Measurements (GRAVITY Collaboration 2021/2022 & EHT 2022)**:
  - Mass: $M = 4.297 \pm 0.012 \times 10^6\,M_\odot$ (`massKg` $= M \cdot M_\odot \approx 8.544455\times 10^{36}\text{ kg}$)
  - Distance: $R_0 = 8.277 \pm 0.033\text{ kpc}$ (`distanceLightYears` $\approx 26990\text{ ly}$)
  - Metric & Spin: `spinParameterAStar = 0.0` (Schwarzschild baseline; Kerr prograde spin noted as creating asymmetric shadow offset and reducing ISCO down to $1.0\,r_s$)
  - Accretion disk inclination: `42.0°` (EHT 2022 constraint: ~30°–50° to line of sight).
- **Derived Relativistic Parameters**:
  - **Schwarzschild Radius**: $r_s = \frac{2GM}{c^2}$ (`~1.26904e10 m` / `~12.69 million km`)
  - **Photon Sphere**: $r_{\text{ph}} = 1.5\,r_s = \frac{3GM}{c^2}$
  - **Black Hole Shadow Critical Impact Parameter**: $r_{\text{shadow}} = \frac{3\sqrt{3}}{2}\,r_s = \sqrt{27}\,\frac{GM}{c^2}$
  - **Apparent Angular Shadow Diameter**: $\theta_{\text{shadow}} = \frac{2\,r_{\text{shadow}}}{R_0} \cdot \frac{180 \times 3600 \times 10^6}{\pi}$ (~`53.2 µas` theoretical; EHT 2022 measured `51.8 ± 2.3 µas`)
  - **Innermost Stable Circular Orbit (ISCO) & Accretion Bounds**:
    - $r_{\text{ISCO}} = 3.0\,r_s = \frac{6GM}{c^2}$
    - `accretionDiskInnerRadiusM` $= r_{\text{ISCO}}$, `accretionDiskOuterRadiusM` $= 16.0\cdot r_s$
    - ISCO orbital speed fraction: $\beta_{\text{ISCO}} = \sqrt{\frac{r_s}{2\,r_{\text{ISCO}}}} = \frac{1}{\sqrt{6}} \approx 0.4082$
- **Relativistic Helper Functions**:
  - **Relativistic Doppler Factor (`computeRelativisticDopplerFactor(beta, angleRad)`)**:
    $$\gamma = \frac{1}{\sqrt{\max(0.001,\; 1 - \beta^2)}}, \qquad \delta = \frac{1}{\gamma\,(1 - \beta\cos\theta)}$$
  - **Gravitational Redshift Factor (`computeGravitationalRedshift(r, rs)`)**:
    $$g = \begin{cases} 0.0, & r \le r_s \\ \sqrt{\max(0.0,\; 1 - r_s / r)}, & r > r_s \end{cases}$$

---

### 7. Simulation Clock & Time Scales (`src/simulation/SimulationClock.ts`)

- **Reference Epochs & Time-Scale Offset**:
  - `J2000_JD = 2451545.0` (`2000-01-01T12:00:00 TT`)
  - `J2000_UTC_MS = 946727935816` (`2000-01-01T11:58:55.816 UTC`, reflecting $\text{TT} - \text{UTC} = 64.184\text{ s}$ in year 2000)
  - `TT_MINUS_UTC_SECONDS = 69.184` ($37\text{ leap seconds} + 32.184\text{ s}$, valid from `2017-01-01`; $\text{TDB} - \text{TT} < 2\text{ ms}$ is neglected so $\text{TDB} \approx \text{TT}$).
- **Playback Modes & Time Compression**:
  - `isPaused`: boolean (`false` by default); freezes `currentUtcMs` while updating `lastPerfTimeMs`.
  - `timeMultiplier`: real-time scale factor (`1.0` default; supports arbitrary positive compression such as `10x`, `100x`, `10000x`, or negative multipliers for reverse time).
  - `update(nowPerfMs = performance.now())`: computes `deltaRealMs = nowPerfMs - lastPerfTimeMs`; if `!isPaused && deltaRealMs > 0`, advances `currentUtcMs += deltaRealMs * timeMultiplier`.
- **Conversions & Controls**:
  - `utcMsToJulianDate(utcMs)`: $\text{JD}_{\text{UTC}} = \frac{\text{utcMs}}{86400000.0} + 2440587.5$
  - `julianDateToUtcMs(jd)`: $\text{utcMs} = (\text{JD} - 2440587.5)\cdot 86400000.0$
  - `getJulianDateTDB()`: $\text{JD}_{\text{TDB}} = \text{JD}_{\text{UTC}} + \frac{69.184}{86400.0}$
  - `getJulianCenturiesJ2000()`: $T = \frac{\text{JD}_{\text{TDB}} - 2451545.0}{36525.0}$
  - Seeking & Resets: `setUtcMs(utcMs)` (date scrubbing/seeking, resets `lastPerfTimeMs`), `getIsoString()`, `resetToJ2000()`, `resetToNow()`.

---

### 8. Surface Observer Sky Astronomy & Solar Time (`src/explorer/SkyAstronomy.ts`)

- *(Note: `SkyAstronomy.ts` computes body-fixed topocentric local frames, solar elevation/azimuth, sunrise/noon/sunset/night phase times, and planetary visual magnitudes; GMST is not separately implemented in this module.)*
- **Constants & Geometric Albedos (`AU_KM = 149597870.7`, `GEOMETRIC_ALBEDO`)**:
  - `Mercury: 0.142`, `Venus: 0.689`, `Earth: 0.434`, `Moon: 0.12`, `Mars: 0.17`, `Jupiter: 0.538`, `Saturn: 0.499`, `Uranus: 0.488`, `Neptune: 0.442`, `Pluto: 0.52`, `Io: 0.63`, `Europa: 0.67`, `Ganymede: 0.43`, `Callisto: 0.22`, `Titan: 0.22`, `Phobos: 0.07`, `Deimos: 0.08` (default fallback `0.15`).
- **Heliocentric State & Body Frame**:
  - `heliocentricState(def, d)`: Returns `[0,0,0]` for Sun/stars; for moons recursively adds parent state and propagates moon around parent using $\mu = GM_{\text{parent}} + GM_{\text{moon}}$ (where $GM = gmKm3S2 ?? massKg \times 6.6743\times 10^{-20}$, fallback `GM_SUN`).
  - `bodyFrameAt(def, d)`: Uses `getSynchronousFrame(relPos, relVel)` for all moons **except `Hyperion`**, and `getBodyFrame(name, d)` otherwise.
- **Topocentric Local Frame & Horizontal Coordinates (`localFrame`, `altAz`, `sunElevationAt`)**:
  - Rotates `frame.xAxis` by `frame.spinRad` to prime meridian $X' = x\cos W - z\sin W$ and east at $\lambda = 0^\circ$ ($e_0 = y \times X'$).
  - Planetocentric surface normal at $(\phi = \text{latDeg},\; \lambda = \text{lonDeg})$:
    $$\mathbf{eq} = X'\cos\lambda + \mathbf{e}_0\sin\lambda, \qquad \mathbf{up} = \operatorname{norm}(\mathbf{eq}\cos\phi + \mathbf{y}\sin\phi)$$
    $$\mathbf{east} = \operatorname{norm}(\mathbf{y} \times \mathbf{up}), \qquad \mathbf{north} = \mathbf{up} \times \mathbf{east}$$
  - Altitude & Azimuth from North through East:
    $$\text{alt} = \arcsin(\operatorname{clamp}(\hat{n}\cdot\mathbf{up}, -1, 1)), \qquad \text{az} = \operatorname{atan2}(\hat{n}\cdot\mathbf{east}, \hat{n}\cdot\mathbf{north}) \bmod 360^\circ$$
  - `sunElevationAt`: evaluates `altAz` on `eclipticToThree(-heliocentricPos)`.
- **Solar Time-of-Day Solver (`findTimeOfDay`, `findMorningSun`)**:
  - `TimeOfDay = 'sunrise' | 'noon' | 'sunset' | 'night'`.
  - Scans expanding windows `[1.6, 3, 40, 200]` days (up to ~176 d Mercury solar day) in `720` steps per span:
    - `sunrise` / `sunset`: detects crossing of `-0.833°` (almanac refraction + solar semi-diameter) and refines with 40-iteration `bisect`.
    - `noon` / `night`: locates interior extremum (`0 < best.d < d0 + 0.97 * span`) and refines with 40-iteration ternary search (`refineExtremum`).
  - `findMorningSun(..., targetDeg)`: finds `sunrise` then `noon`, sets `target = min(targetDeg, f(noon) - 2)`, and bisects for low raking relief light.
- **Apparent Visual Magnitude (`apparentMagnitude`)**:
  - Sun: $V = -26.74 + 5\log_{10}(\max(10^{-6}, d_{\text{AU}}))$.
  - Sunlit bodies (Lambert-sphere phase law): phase angle $\alpha = \arccos(\operatorname{clamp}(\hat{r}_{\text{body}\to\text{Sun}}\cdot\hat{r}_{\text{body}\to\text{obs}}, -1, 1))$, phase integral $\Phi(\alpha) = \max\!\left(10^{-6},\; \frac{\sin\alpha + (\pi - \alpha)\cos\alpha}{\pi}\right)$,
    $$F = p\,\Phi(\alpha)\,\frac{(R_{\text{km}} / \Delta_{\text{km}})^2}{(r_{\text{km}} / \text{AU\_KM})^2}, \qquad V = -26.74 - 2.5\log_{10}(\max(10^{-30}, F))$$

---

### 9. Deep-Time Cosmic & Planetary Eras (`src/explorer/DeepTime.ts`, `src/explorer/DeepTimeLand.ts`)

- *(Note: All 16 scenes in `DEEP_TIME_SCENES` depict **future astrophysical and planetary epochs** from `< 100,000 years` to `Beyond 10¹⁰⁰ years`. Rather than modeling geological atmospheric chemistry tables or plate-tectonic continental drift, `DeepTime.ts` and `DeepTimeLand.ts` control sky atmospheres, star visibility, solar/ring visibility, dome tints, lighting, and 9 procedural 3D terrain/ocean archetypes.)*

#### 9.1 All 16 Deep-Time Scenes (`DEEP_TIME_SCENES`)

1. **`betelgeuse` — "Betelgeuse explodes"**
   - **Time Bound (`when`)**: `Any time within the next 100,000 years`
   - **Location & Time**: `Earth`, lat `23.8`, lon `11.0` (`Sahara dunes, at dusk`), `time: 'sunset'`, `hours: 0.6`
   - **View**: `heading: { sun: 18 }`, `pitch: 12`, `fov: 74`
   - **Terrain & Lighting**: `land: { kind: 'dunes', fog: [0.004, 0.006, 0.012], fogSun: [0.05, 0.018, 0.004], haze: 1.2 }`; `light: { from: 'fx', color: [0.55, 0.7, 1.0], ambient: [0.004, 0.006, 0.012] }`
   - **FX**: `afterglow` (sunset horizon glow), `supernova` (`az: 0, alt: 16, sunRelative: true`) — blue-white light-curve flicker ($t < 4\text{ s}$), detonation surge to $I=12$ ($4 \le t < 4.7\text{ s}$), slow settle; casts shadows across dunes.
2. **`two-suns` — "Two lights in the day"**
   - **Time Bound (`when`)**: `Weeks after the supernova`
   - **Location & Time**: `Earth`, lat `38.4`, lon `15.9` (`Hills above the Tyrrhenian Sea`), `time: 'sunrise'`, `hours: 3.2`
   - **View**: `heading: { sun: 28 }`, `pitch: 14`, `fov: 72`
   - **Terrain & Lighting**: `land: { kind: 'hills', fog: [0.42, 0.55, 0.7], fogSun: [0.75, 0.72, 0.62], haze: 0.9, turn: 200 }`; `light: { from: 'sun', color: [2.4, 2.3, 2.1], ambient: [0.16, 0.22, 0.32] }`
   - **FX**: `sunStar`, `supernova` (`daylight: true`, offset `[28°, +6°]` from Sun, constant $I = 2.2$).
3. **`gliese` — "Gliese 710 arrives"**
   - **Time Bound (`when`)**: `In 1.3 million years`
   - **Location & Time**: `Earth`, lat `26.3`, lon `30.0` (`Red desert, Western Sahara`), `time: 'night'`
   - **View**: `heading: 120`, `pitch: 10`, `fov: 74`
   - **Terrain, Dome & Lighting**: `land: { kind: 'redDesert', fog: [0.03, 0.012, 0.006], fogSun: [0.03, 0.012, 0.006], haze: 1.4 }`; `dome: { top: 0x020203, bottom: 0x1a0c06, opacity: 0.55 }`; `light: { from: 'fx', color: [0.35, 0.12, 0.05], ambient: [0.018, 0.008, 0.005] }`
   - **FX**: `redStar` (`az: 120, alt: 26`, orange glow `0xff6a2a` + 4-spike diffraction flare `0xff8a50`).
4. **`comet-storm` — "The comet storm"**
   - **Time Bound (`when`)**: `In 1.3 million years, and for millions after`
   - **Location & Time**: `Earth`, lat `47.3`, lon `11.4` (`Tyrolean Alps, Austria`), `time: 'night'`, `stars: 1.2`
   - **View**: `heading: 200`, `pitch: 18`, `fov: 82`
   - **Terrain, Dome & Lighting**: `land: { kind: 'alpine', fog: [0.035, 0.045, 0.065], fogSun: [0.06, 0.05, 0.05], haze: 1.6 }`; `dome: { top: 0x000000, bottom: 0x56688c, opacity: 1, add: true }`; `light: { from: 'moonless', color: [0.03, 0.04, 0.06], ambient: [0.012, 0.016, 0.026] }`
   - **FX**: `comets` (`count: 3` at `[160, 30, 34]`, `[245, 42, 22]`, `[118, 18, 14]` with anti-solar blue ion tail + curved `0.12 rad` dust tail), `meteors` (up to 30 concurrent dynamic line segments).
5. **`ring-rain` — "Saturn’s rings fall"**
   - **Time Bound (`when`)**: `In 100 million years`
   - **Location & Time**: `Saturn`, lat `28`, lon `0` (`Above Saturn’s cloud tops`), `time: 'noon'`
   - **View**: `heading: 180`, `pitch: 16`, `fov: 85`
   - **FX**: `ringRain` (sets `rainMode = true`: meteors spawn along the southern ring arch `az ∈ [150°, 210°]`, `alt ∈ [25°, 65°]` every `0.04–0.20 s`).
6. **`ringless-saturn` — "Saturn without its rings"**
   - **Time Bound (`when`)**: `In about 300 million years`
   - **Location & Time**: `Enceladus`, `facing: 'Saturn'` (`Enceladus, facing Saturn`), `time: 'noon'`, `hideRings: true`
   - **View**: `heading: 0`, `pitch: 30`, `fov: 60`, `fx: []`
7. **`last-eclipse` — "The last total eclipse"**
   - **Time Bound (`when`)**: `In about 600 million years`
   - **Physical Cause (blurb)**: Moon recedes at `3.8 cm/yr` until its angular disc is too small to cover the Sun.
   - **Location & Time**: `Earth`, lat `20.0`, lon `-155.9` (`Kona coast, Hawaiʻi`), `time: 'sunrise'`, `hours: 1.2`
   - **View**: `heading: { sun: 0 }`, `pitch: { sun: 0 }`, `fov: 6`
   - **Terrain, Dome & Lighting**: `land: { kind: 'coast', fog: [0.6, 0.38, 0.2], fogSun: [0.9, 0.55, 0.25], haze: 1.0, turn: 0 }`; `light: { from: 'sun', color: [0.25, 0.18, 0.12], ambient: [0.03, 0.04, 0.07] }`; `dome: { top: 0x0a1a38, bottom: 0xd88a4a, opacity: 0.82 }`; `ground: { sun: [0.25, 0.22, 0.2], ambient: -0.05 }`
   - **FX**: `annular` (black Moon disc scaled to `0.9×` solar radius `0.267°` offset by `[0.01°, 0.006°]`, 90-streamer corona `1.6°`, ragged 720-ray chromosphere, and 7 animated Baily's beads).
8. **`bright-sun` — "A brighter Sun"**
   - **Time Bound (`when`)**: `In 1 billion years`
   - **Physical Change (blurb)**: Sun is **10% brighter**; oceans begin boiling off into high ice-crystal haze.
   - **Location & Time**: `Earth`, lat `40.76`, lon `-113.88` (`A shrinking sea`), `time: 'sunrise'`, `hours: 1.4`
   - **View**: `heading: { sun: 0 }`, `pitch: { sun: -7 }`, `fov: 90`
   - **Terrain, Dome & Lighting**: `land: { kind: 'shore', fog: [0.78, 0.7, 0.55], fogSun: [1.2, 1.1, 0.95], haze: 0.8 }`; `light: { from: 'sun', color: [1.7, 1.55, 1.3], ambient: [0.22, 0.2, 0.17] }`; `dome: { top: 0x9a8562, bottom: 0xeadcb8, opacity: 0.62 }`; `ground: { sun: [1.15, 1.05, 0.85], ambient: 0.08 }`
   - **FX**: `sunStar`, `halo` (22° ice halo `opacity: 0.14`, pair of prismatic parhelia / sun dogs at `±22.5° / max(0.35, cos(sunAlt))`, and vertical sun pillar).
9. **`andromeda` — "Andromeda fills the night"**
   - **Time Bound (`when`)**: `In 3.75 billion years`
   - **Location & Time**: `Earth`, lat `-49.3`, lon `-73.05` (`Patagonia, under Fitz Roy`), `time: 'night'`, `stars: 1.5`
   - **View**: `heading: 60`, `pitch: 24`, `fov: 95`
   - **Terrain, Dome & Lighting**: `land: { kind: 'jagged', fog: [0, 0, 0], fogSun: [0, 0, 0], haze: 0.2 }`; `light: { from: 'moonless', color: [0, 0, 0], ambient: [0.002, 0.002, 0.003] }`; `dome: { top: 0x000000, bottom: 0x141a2a, opacity: 1, add: true }`
   - **FX**: `andromeda` (`az: 48, alt: 40, sizeDeg: 86`, Milky Way disk texture at aspect `0.42`, roll `-28°` + pink/blue star-forming clouds).
10. **`collision` — "The galaxies collide"**
    - **Time Bound (`when`)**: `In 4 billion years`
    - **Location & Time**: `Earth`, lat `-49.3`, lon `-73.05` (`Patagonia, under Fitz Roy`), `time: 'night'`, `stars: 1.4`, `milkyWay: false`
    - **View**: `heading: 30`, `pitch: 26`, `fov: 100`
    - **Terrain & Lighting**: `land: { kind: 'jagged', fog: [0.01, 0.006, 0.012], fogSun: [0.01, 0.006, 0.012], haze: 0.2 }`; `light: { from: 'moonless', color: [0.03, 0.02, 0.03], ambient: [0.01, 0.008, 0.012] }`
    - **FX**: `collision` (6 `/textures/nebulae/*.webp` plates: `lagoon-lane`, `cosmic-cliffs`, `orion-cloud`, `rosette-ring`, `mystic-mountain`, `north-america` + tilted galactic disk `120°` + 4 star-forming cloud quads).
11. **`red-giant` — "The red giant Sun"**
    - **Time Bound (`when`)**: `In 5 billion years`
    - **Physical Change (blurb)**: Core hydrogen exhausted; Sun swells hundreds of times wider, swallowing Mercury & Venus; Earth's atmosphere stripped (`atmosphere: false`) and crust runs with lava.
    - **Location & Time**: `Earth`, lat `23.4`, lon `25.0` (`What was the Sahara`), `time: 'sunrise'`, `hours: 0.6`, `hideSun: true`, `stars: 0.25`
    - **View**: `heading: { sun: 0 }`, `pitch: 14`, `fov: 95`
    - **Terrain, Dome & Lighting**: `land: { kind: 'scorched', fog: [0.25, 0.06, 0.01], fogSun: [0.7, 0.2, 0.03], haze: 1.3 }`; `light: { from: 'sun', color: [3.0, 0.85, 0.2], ambient: [0.28, 0.07, 0.016] }`; `ground: { sun: [2.4, 0.6, 0.12], ambient: 0.01 }`; `dome: { top: 0x2a0702, bottom: 0x7a2208, opacity: 0.62 }`
    - **FX**: `redGiant` (`sizeDeg: 78`, custom GLSL `giantMaterial()` with 5-octave fBm boiling convection cells foreshortened toward limb by $\mu = \sqrt{1 - |q|^2}$, limb darkening `0.35 + 0.65 * pow(mu, 0.6)`, cool/hot ramp `[0.32, 0.035, 0.004]` to `[0.95, 0.36, 0.06]`, and animated prominence envelope).
12. **`milkdromeda` — "Milkdromeda"**
    - **Time Bound (`when`)**: `In 7 billion years`
    - **Location & Time**: `Earth`, lat `31.0`, lon `35.4` (`A dead Earth, desert hills`), `time: 'night'`, `atmosphere: false`, `milkyWay: false`, `stars: 1.6`
    - **View**: `heading: 150`, `pitch: 22`, `fov: 95`
    - **Terrain & Lighting**: `land: { kind: 'dunes', fog: [0.06, 0.045, 0.03], fogSun: [0.06, 0.045, 0.03], haze: 0.6 }`; `light: { from: 'fx', color: [0.22, 0.17, 0.12], ambient: [0.05, 0.04, 0.03] }`; `ground: { sun: [1, 1, 1], ambient: 0.07 }`
    - **FX**: `elliptical` (512×512 de Vaucouleurs $r^{1/4}$-like profile $\exp(-7.67((r/0.5)^{0.25}-1))$ spanning `172° × 1.85` at `az: 150, alt: 30` + core glow).
13. **`planetary-nebula` — "The Sun’s last breath, from Pluto"**
    - **Time Bound (`when`)**: `In 7.5 billion years`
    - **Location & Time**: `Pluto`, lat `20`, lon `175` (`Sputnik Planitia, Pluto`), `time: 'sunrise'`, `hours: 10`, `hideSun: true`
    - **View**: `heading: { sun: 0 }`, `pitch: { sun: -6 }`, `fov: 62`
    - **Ground & FX**: `ground: { sun: [0.14, 0.15, 0.19], ambient: 0.01 }`; `planetaryNebula` (`/textures/nebulae/helix.webp`, `30°`), `whiteDwarf`.
14. **`white-dwarf` — "The white dwarf"**
    - **Time Bound (`when`)**: `In 8 billion years`
    - **Location & Time**: `Earth`, lat `64.0`, lon `-17.0` (`Frozen Earth, the old Iceland`), `time: 'sunrise'`, `hours: 2`, `atmosphere: false`, `hideSun: true`
    - **View**: `heading: { sun: 0 }`, `pitch: 10`, `fov: 80`
    - **Terrain & Lighting**: `land: { kind: 'ice', fog: [0.004, 0.005, 0.008], fogSun: [0.01, 0.012, 0.016], haze: 0.5 }`; `light: { from: 'sun', color: [0.55, 0.62, 0.8], ambient: [0.012, 0.015, 0.022] }`; `ground: { sun: [0.06, 0.07, 0.09], ambient: 0.006 }`
    - **FX**: `whiteDwarf` (Earth-sized bare stellar core: bright `0xeef5ff` core, `0x9ab8ff` halo, `0xdfeaff` 4-spike flare).
15. **`stars-out` — "The stars go out"**
    - **Time Bound (`when`)**: `In 100 trillion years`
    - **Location & Time**: `Earth`, lat `31.0`, lon `35.4` (`A dead world`), `time: 'night'`, `atmosphere: false`, `milkyWay: false`, `stars: 0`
    - **View**: `heading: 180`, `pitch: 14`, `fov: 80`
    - **Terrain & Lighting**: `land: { kind: 'dunes', fog: [0, 0, 0], fogSun: [0, 0, 0], haze: 0.3 }`; `light: { from: 'fx', color: [0.05, 0.01, 0.0], ambient: [0.001, 0.001, 0.001] }`; `ground: { sun: [1, 1, 1], ambient: 0.004 }`
    - **FX**: `ember` (`az: 180, alt: 20`; cools over `16 s` via $f = \max(0, 1 - t/16)$, shrinking from `1.8°` to `0.4°` and shifting RGB to dim red before extinguishing).
16. **`black-hole` — "The last light: a black hole"**
    - **Time Bound (`when`)**: `Beyond 10¹⁰⁰ years`
    - **Location & Time**: `Sagittarius A*` (`Beside Sagittarius A*`), `time: 'night'`
    - **View**: `heading: 0`, `pitch: 0`, `fov: 70`, `fx: []`

#### 9.2 Procedural Landscapes & Oceans (`DeepTimeLand.ts`)

- **Polar Mesh & Planetary Curvature**:
  - Logarithmic polar grid: `RINGS = 150`, `SEGS = 320`, $r_i = R_{\min}\cdot (R_{\max}/R_{\min})^{i/\text{RINGS}}$ from `R_MIN = 0.03 km` to `R_MAX = 55 km`.
  - Curvature drop: $y(x, z) = \text{heightOf}(\text{kind}, lx, lz, r) - \frac{r^2}{2 R_{\oplus}}$ with `EARTH_KM = 6371`; flattened within `smooth(0.25, 2.5, r)` under the observer's feet.
  - Ocean disc (`CircleGeometry(55, 128)` at $y = -0.002\text{ km}$) is spawned whenever `lowest < -0.02` and `kind ∈ ['hills', 'coast', 'shore']`.
- **9 `LandKind` Height Functions & Palettes (`PALETTES`)**:
  - `dunes` (`low: 0x9a7a52`, `high: 0xc9a670`) & `redDesert` (`low: 0x5a2a18`, `high: 0x8a4a2a`): domain-warped wind crests (`sin(..., 1.6)`), fBm swells, and distant mountain range (`3.2 km` scaled by `smooth(5, 18, r)`).
  - `hills` (`low: 0x4f6030`, `high: 0x7d8c4a`): multi-octave rolling hills + far hills (`smooth(12, 35, r)`), sloping down to sea (`-smooth(6, 14, -z) * 0.9`).
  - `alpine` (`low: 0x3a3f42`, `high: 0x5c6064`, `snow: 1.2`): 5-octave ridged multifractal peaks (`2.6 km`) + foothills.
  - `jagged` (`low: 0x1a1b1e`, `high: 0x2a2b30`): 6-octave sharp ridged skyline peaks (`pow(ridged, 1.4) * 5.2`).
  - `coast` (`low: 0x3d3a2e`, `high: 0x55503c`): terrestrial ridges dropping into southern sea (`smooth(-1, 3, z)`).
  - `shore` (`low: 0x9c8664`, `high: 0xb29a74`): wandering organic shoreline transitioning from pale beach (`0.03–0.06 km`) into sea (`-0.2 km`) with a low far shore beyond $z = 28\text{–}40\text{ km}$.
  - `scorched` (`low: 0x3c2418`, `high: 0x5e3822`, `lava: true`): fractured crust with unlit pulsing molten lava cracks (`vn(xz * 1.6 + 3.1) ≈ 0.5`, emission `[1.6, 0.42, 0.06] * crack * pulse * 1.5`).
  - `ice` (`low: 0x6d7a88`, `high: 0xb8c6d4`, `snow: 0.6`): sharp ridged frozen crags (`0.9 km` near + `1.4 km` far) with snowline at `0.6 km`.
- **GLSL Shaders**:
  - **Land**: slope darkening on steep faces (`smoothstep(0.25, 0.6, 1 - n.y)`), snow accumulation above `uSnow` on gentle slopes, wrapped diffuse lighting `dot(n, L) * 0.9 + 0.1`, and exponential aerial perspective $k = 1 - \exp(-d\cdot u_{\text{FogK}})$ where $u_{\text{FogK}} = 0.03 \cdot \text{haze}$ and fog color shifts from `uFog` to `uFogSun` by $\text{pow}(\max(0, \hat{v}_{xz}\cdot\hat{l}_{xz}), 3)$.
  - **Ocean**: 3-octave animated wave normal perturbation flattened with distance (`amp = 0.35 / (1 + 0.15 d)`), Schlick Fresnel `0.02 + 0.98 * pow(1 - max(0, dot(n, v)), 5)`, dual-lobe specular sun glint (`pow(dot(r, L), 900) * 30 + pow(dot(r, L), 60) * 0.6`), and aerial perspective (`0.7 * uFogK`).

---

### 10. Body Monographs & Postcards (`src/data/PlanetNarratives.ts`, `src/data/Postcards.ts`)

#### 10.1 All 18 `PLANET_NARRATIVES` Monographs (`PlanetNarratives.ts`)

- **Planets (8)**:
  - `Mercury` (`0.39 AU`, `#E8927C`): 430°C day / −180°C night, iron core ~85% of radius; missions: Mariner 10 (`1974–1975`), MESSENGER (`2011–2015`), BepiColombo (`2025–2026`).
  - `Venus` (`0.723 AU`, `#b45d15`): 465°C runaway greenhouse, 92× Earth surface pressure, retrograde rotation; missions: Venera 7 (`1970`), Magellan (`1990–1994`), Akatsuki (`2015–Present`).
  - `Earth` (`1.000 AU`, `#26daaa`): 70% liquid oceans, plate tectonics & geodynamo magnetosphere; missions: Apollo Program (`1961–1972`), Terra & Aqua (`1999–Present`), Copernicus Sentinel (`2014–Present`).
  - `Mars` (`1.524 AU`, `#e55f45`): Olympus Mons, Valles Marineris, ancient lakes/deltas >3 Gyr ago; missions: Viking 1 & 2 (`1976`), Curiosity (`2012–Present`), Perseverance (`2021–Present`).
  - `Jupiter` (`5.203 AU`, `#f59e0b`): >2× mass of all other planets, Great Red Spot, 115 known moons, metallic hydrogen dynamo; missions: Voyager 1 & 2 (`1979`), Galileo (`1995–2003`), Juno (`2016–Present`).
  - `Saturn` (`9.539 AU`, `#b29d81`): ~282,000 km diameter / 10–30 m thick water-ice rings; missions: Pioneer 11 (`1979`), Cassini-Huygens (`2004–2017`), Dragonfly (`Launching 2028`).
  - `Uranus` (`19.18 AU`, `#8dcdd8`): 97.77° axial tilt, methane-tinted ice giant; missions: Voyager 2 (`1986`), Uranus Orbiter & Probe (`Proposed 2030s`).
  - `Neptune` (`30.06 AU`, `#4f83e2`): predicted by Le Verrier (1846), >2,000 km/h winds, captured retrograde Triton; mission: Voyager 2 (`1989`).
- **Star & Black Hole (2)**:
  - `Sun` (`0.000 AU`, `#ffaa33`): >99.8% system mass, 600M tons H → He/s (4M tons converted to energy), >100,000 yr photon radiative diffusion; missions: SOHO (`1995–Present`), Parker Solar Probe (`2018–Present`), Solar Orbiter (`2020–Present`).
  - `Sagittarius A*` (`1.71 × 10⁹ AU (26,990 LY)`, `#f59e0b`): $4.297 \pm 0.012\times 10^6\,M_\odot$ at $8.277 \pm 0.033\text{ kpc}$, EHT `51.8 ± 2.3 µas` shadow, ISCO at $3.0\,r_s$ ($0.408\,c = 122,400\text{ km/s}$); missions: EHT (`2022`), GRAVITY / ESO VLTI (`2018–Present`, S2 gravitational redshift), Chandra (`1999–Present`), Swift (`2004–Present`).
- **Dwarf Planets (2)** & **Moons (6)**:
  - `Pluto` (`39.48 AU`, `#FF8732`, New Horizons `2015`), `Ceres` (`2.767 AU`, `#a1a1aa`, Dawn `2015–2018`).
  - `Moon` (`1.000 AU`, `#d1d5db`, Theia impact ~4.5 Gyr ago; Apollo 11, LRO, Artemis I), `Europa` (`5.203 AU`, `#7dd3fc`, Galileo, Europa Clipper), `Io` (`5.203 AU`, `#facc15`, Voyager 1, Juno), `Ganymede` (`5.203 AU`, `#cbd5e1`, Galileo, JUICE), `Titan` (`9.539 AU`, `#f59e0b`, ~1.5× Earth pressure, Cassini-Huygens, Dragonfly), `Enceladus` (`9.539 AU`, `#e0f2fe`, Cassini `2005–2017`).
- **Fallback (`getPlanetNarrative`)**: Generates generic `CELESTIAL BODY` monograph citing NASA JPL Horizons / SBDB elements for unlisted moons/minor bodies.

#### 10.2 All 8 Curated `POSTCARDS` (`Postcards.ts`)

| ID | Title | Body | Lat / Lon (°) | UTC Epoch | Heading / Pitch / FOV (°) | Magnification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `event-horizon-sea` | The shore of Sagittarius A* | `Sagittarius A*` | `0`, `0` | `2026-10-16T12:00:00Z` | `0` / `0` / `52` | `1` |
| `crescent-saturn` | Saturn, after sunset | `Mimas` | `-9.51`, `-49.33` | `2026-10-16T20:01:15Z` | `95` / `30` / `84` | `1` |
| `charon-core` | Charon over the heart of the galaxy | `Pluto` | `44.95`, `26.1` | `2026-11-18T01:05:05Z` | `213` / `29` / `46` | `1` |
| `earth-sliver` | A sliver of home | `Moon` | `3.5`, `49.91` | `2026-10-28T20:01:32Z` | `267` / `24` / `64` | `10` |
| `uranus-galaxy` | Uranus and the Milky Way | `Miranda` | `-48.8`, `-12.63` | `2026-11-19T01:05:20Z` | `22` / `37` / `66` | `1` |
| `neptune-crescent` | The blue crescent | `Triton` | `22.26`, `46.01` | `2026-11-18T01:04:40Z` | `247` / `37` / `20` | `1` |
| `jupiter-night` | Jupiter by night | `Europa` | `-0.24`, `50` | `2026-11-15T17:04:24Z` | `266` / `36` / `30` | `1` |
| `martian-dusk` | Two worlds at dusk | `Mars` | `4.94`, `-3.65` | `2026-11-14T05:49:00Z` | `283` / `15` / `72` | `1000` |

- Image helper: `postcardImage(p, thumb)` resolves `${BASE_URL}gallery/${p.id}${thumb ? '_thumb' : ''}.jpg`.

---

### 11. Ephemeris & Trajectory Verification Suites (`src/tests/ephemerisAccuracy.test.ts`, `src/tests/dynamoTrajectory.test.ts`)

- **Planetary Ephemeris Accuracy (`ephemerisAccuracy.test.ts`)**:
  - Compares `KeplerSolver.propagate` against analytical ERFA/VSOP87 (`astropy 'builtin'`) heliocentric J2000-ecliptic vectors at **two epochs**: `JD 2461327.5` (`2026-10-14.0 TDB`) and `JD 2466155.0` (`2040-01-01.5 TDB`) across all 8 planets (Mercury–Neptune).
  - Tolerances verified: angular heliocentric direction error `< 0.25°` (consistent with JPL Table 1's ~10 arcmin max error for Saturn over 1800–2050) and radial distance relative error `< 0.5%` (`0.005`).
- **Natural Satellite Ephemeris Accuracy (`ephemerisAccuracy.test.ts`)**:
  - Compares parent-centered J2000-ecliptic vectors against JPL Horizons using $\mu = GM_{\text{parent}} + GM_{\text{moon}}$:
    - `Moon` (Earth, `JD 2461327.5`): `< 2.0°`
    - `Io` (Jupiter, `JD 2461327.5`): `< 0.5°`
    - `Callisto` (Jupiter, `JD 2461327.5`): `< 0.5°`
    - `Titan` (Saturn, `JD 2461327.5`): `< 0.5°`
    - `Titan` (Saturn, `JD 2451545.0` — 26.8 yr / ~614 orbits before element epoch): `< 5.0°`
- **Spacecraft Binary Trajectory & Scene Evaluation (`dynamoTrajectory.test.ts`)**:
  - **New Horizons hyperbolic-to-table handoff**: decodes `sc_new_horizons__sun__2__orb.dyn` (hyperbolic `orb`) and `sc_new_horizons__sun__3__pos.dyn` (`pos`), verifying position agreement at `pos.tMinSec` within `< 250 km`.
  - **Artemis 2 Cubic Hermite**: decodes `sc_artemis_2__earth.dyn` (`count > 10`), verifying mid-mission geocentric radius `6,000–500,000 km` and speed `> 0.1 km/s`.
  - **Attitude Quaternions**: decodes `sc_mars_2020__quat.dyn` (`count === 135`), verifying unit quaternion normalization (`length ≈ 1.0`).
  - **Phase Transitions, LEO Gravity & L2 Halo**:
    - `sc_mars_2020`: verifies cruise model (`sc_mars_2020/cruise_whole/msl_cruise_stage.gltf`) at `t = 655000000` vs surface-mounted rover (`sc_mars_2020/rover/perseverance.gltf`, `isSurfaceMounted: true`, `clearanceUnits > 0`) at `t = 770000000`.
    - `sc_iss`: verifies clearance above enlarged `WORLD_SCALE` Earth (`> 1.0` units), 5-second motion (`0.2–1.0` units), and Earth-GM orbital speed (`6.5–9.0 km/s`, confirming planet orbiter does not erroneously use `GM_SUN`).
    - `sc_jwst`: verifies stowed model (`sc_jwst/webb_stowed.gltf`) at `t = 693800000` vs deployed Sun–Earth L2 halo (`activeSource: 'halo'`, `sc_jwst/webb_deployed.gltf`) at `t = 770000000`.

---

## Part III: NASA Spacecraft Fleet, Trajectories, Small Bodies, Asteroids & 3D Comets

- **Scope & Assigned Source Files**
  - `src/data/NasaEyesCatalog.ts` — Full 174-spacecraft NASA Eyes catalog, trajectory segment metadata, Lagrange halo configs, surface sites, fallback Keplerian orbits, mission events, extra assets, and named small-body GLTF/SBDB definitions.
  - `src/rendering/SpacecraftFactory.ts` — HDR space environment cubemap (`createSpaceEnvironmentMap`), shared `GltfModelBank` (GLTF + DRACO + KTX2 loader/normalizer), `SpacecraftLayerManager` (3-tier LOD, GPU eviction, close-up PBR lighting, scale comparison props, heliosphere/magnetosphere overlays, clickable reticles, `Jet Mode` preparation hooks).
  - `src/rendering/SmallBodies.ts` — GPU-Keplerian `SmallBodies` point-cloud renderer (`public/data/small-bodies.json`), meteoroid `STREAMS`, and `CometTails` `InstancedMesh` shader.
  - `src/flight/Asteroids.ts` — Close-range procedural + GLTF `AsteroidField` for `Main asteroid belt` and `Kuiper belt`, `rockGeometry`, `rockTexture`, debris, and haze.
  - `src/flight/Comets3D.ts` — `COMETS` array and `Comet3D` nucleus/coma/jets/ion-tail/dust-tail renderer for Jet Mode.
  - `src/tests/catalogue.test.ts` & `src/tests/smallBodies.test.ts` — Vitest verification suites for catalogue hierarchy, JPL moons, and JPL SBDB small-body populations.
  - `public/nasa/models/` & `public/nasa/trajectories/` — Disk inventory: **153** model subdirectories (`165` `.gltf`, `165` `.bin`, `929` `.webp`, `72` `.ktx2`; **0** `.glb` files) and **326** binary `.dyn` trajectory/attitude files (**0** JSON trajectory files).
  - **Slice Boundary Note**: `SpacecraftFactory.ts` imports `awaitEntryDyn`, `evaluateSpacecraftSceneState`, `loadDynSegment`, `ParentResolver`, `prefetchEntryDyn`, and `SpacecraftSceneEval` from `../astronomy/DynamoTrajectory`; internal Chebyshev/polyline/Keplerian evaluation code inside `src/astronomy/DynamoTrajectory.ts` and Jet Mode camera flight controllers live outside this Part 3 file scope and are documented here strictly up to their observed interfaces, `.dyn` binary headers, and `SpacecraftFactory.ts` call sites.

---

### 1. `NasaEyesCatalog.ts` Data Model, Events, Extra Assets & Helper Functions

- **TypeScript Interfaces (`src/data/NasaEyesCatalog.ts`)**
  - `NasaTrajectorySegment`: `{ file: string; ent?: string; parentId: string; kind: 'orb' | 'pos' | 'quat' | 'ori' | 'lin'; inline: boolean; tMinSec: number; tMaxSec: number }` — timestamps `tMinSec`/`tMaxSec` are TDB seconds relative to J2000.
  - `NasaSurfaceSite`: `{ body: string; latDeg: number; lonDeg: number; altKm: number }`.
  - `NasaLagrangeHalo`: `{ point: 'L1' | 'L2'; amplitudeKm: number; periodDays: number; phaseDeg: number }`.
  - `NasaFallbackOrbit`: `{ parentBody: string; semiMajorAxisKm: number; eccentricity: number; inclinationDeg: number; lonAscendingNodeDeg: number; argPeriapsisDeg: number; meanAnomalyDeg: number; periodDays: number }`.
  - `NasaSpacecraftEntry`: `{ id, name, shortName, subcategory, missionGroup, agency, hostBody, status, activeSpan, featuredEpochUtc, modelPath, physicalSpanM, role, description, highlights, colorHex, dynSegments, oriSegment, surfaceSite, lagrangeHalo, fallbackOrbit }`.
  - `NasaMissionEvent`: `{ id: string; label: string; dateUtc: string | null; target: string; desc: string }`.
- **Catalogue Summary Statistics (`NASA_SPACECRAFT_CATALOG`)**
  - **Total Spacecraft**: `174` entries across `7` `missionGroup` buckets:
    - `Earth Observation & Stations`: `74`
    - `Solar & Heliophysics`: `34`
    - `Mars Exploration`: `16`
    - `Lunar Missions`: `13`
    - `Asteroid & Comet Probes`: `13`
    - `Space Telescopes & Observatories`: `12`
    - `Outer Solar System & Deep Space`: `12`
  - **Subcategories**: `Orbiter` (`152`), `Flyby` (`11`), `Lander` (`5`), `Rover` (`4`), `Impactor` (`2`).
  - **Statuses**: `Active` (`122`), `Completed` (`46`), `Upcoming` (`3`: `sc_artemis_2`, `sc_imap`, `sc_roman_space_telescope`), `En Route` (`3`: `sc_europa_clipper`, `sc_juice`, `sc_psyche`).
  - **Propagation Mode Coverage**: `82` spacecraft have `dynSegments`; `2` have `oriSegment` (`sc_deep_impact_impactor`, `sc_mars_2020`); `6` have `surfaceSite` (all Mars landers/rovers); `9` have `lagrangeHalo` (`L1`/`L2`); `133` have `fallbackOrbit`.
- **`spacecraftToCelestialDef(sc: NasaSpacecraftEntry): CelestialBodyDefinition`**
  - Resolves `parentName` via `sc.fallbackOrbit?.parentBody ?? sc.surfaceSite?.body ?? sc.hostBody`.
  - Parses `discoveryYear` from `parseInt(sc.activeSpan.slice(0, 4), 10)` if finite.
  - Sets `category: 'spacecraft'`, `group: sc.missionGroup`, `orderFromSun: 99`.
  - Sets `physical.meanRadiusKm: Math.max(0.001, (sc.physicalSpanM * 0.5) / 1000)` and `physical.colorHex: sc.colorHex`.
  - Populates `orbit` from `sc.fallbackOrbit` (dividing `semiMajorAxisKm` by `149597870.7` for `semiMajorAxisAU`), or defaults to `semiMajorAxisAU: 1.0`, `semiMajorAxisKm: 149597870.7`, `eccentricity: 0.01`, `inclinationDeg: 5.0`, `epochJd: 2451545.0`, `orbitalPeriodDays: 365.25`, `source: 'NASA Eyes / JPL Horizons Dynamo'`.
- **Curated Mission Events (`NASA_MISSION_EVENTS`, 10 entries)**
  - `ev-iss-live`: `"ISS · Live LEO"`, `dateUtc: null`, `target: "International Space Station"` — Present-day live orbital tracking of the ISS.
  - `ev-nh-pluto`: `"New Horizons · Pluto 2015"`, `dateUtc: "2015-07-14T11:49:00Z"`, `target: "New Horizons"` — Closest approach 12,500 km above Pluto and Charon.
  - `ev-cassini-saturn`: `"Cassini · Saturn 2004"`, `dateUtc: "2004-06-15T12:00:00Z"`, `target: "Cassini"` — Cassini Saturn arrival and Huygens release approach.
  - `ev-cassini-finale`: `"Cassini · Grand Finale"`, `dateUtc: "2017-09-15T10:30:00Z"`, `target: "Cassini"` — Final dive into Saturn's upper atmosphere ending a 13-year tour.
  - `ev-dart-impact`: `"DART · Dimorphos Impact"`, `dateUtc: "2022-09-26T21:00:00Z"`, `target: "DART"` — Terminal kinetic deflection approach to 65803 Didymos & Dimorphos.
  - `ev-perseverance`: `"Perseverance · Jezero Mars"`, `dateUtc: "2021-02-18T18:00:00Z"`, `target: "Mars 2020 (Perseverance)"` — Perseverance arrival in Mars orbital approach / Jezero Crater.
  - `ev-rosetta-67p`: `"Rosetta · Comet 67P"`, `dateUtc: "2014-11-12T12:00:00Z"`, `target: "Philae"` — Philae descent onto comet 67P/Churyumov-Gerasimenko.
  - `ev-parker-perihelion`: `"Parker Solar · Perihelion"`, `dateUtc: "2024-12-24T11:53:00Z"`, `target: "Parker Solar Probe"` — Record-breaking 6.1 million km skim through the solar corona.
  - `ev-voyager2-neptune`: `"Voyager 2 · Neptune 1989"`, `dateUtc: "1989-08-25T03:56:00Z"`, `target: "Voyager 2"` — Grand Tour climax skimming 4,950 km above Neptune's north pole.
  - `ev-artemis2`: `"Artemis II · Lunar Swing"`, `dateUtc: "2026-04-06T23:00:00Z"`, `target: "Artemis II"` — Crewed Orion free-return trajectory around the Moon.
- **Extra 3D Assets (`NASA_EXTRA_ASSETS`)**
  - Volumetric science overlays: `heliosphere: 'heliosphere/voyager_heliosphere.gltf'`, `saturnMagnetosphere: 'saturn/magnetosphere/saturn_magnetosphere.gltf'`, `saturnMagnetosphereThin: 'saturn/magnetosphere_thin/saturn_magnetosphere_thin.gltf'`.
  - Scale comparison props: `comparisonScientist: 'comparison/scientist/scientist.gltf'`, `comparisonSchoolBus: 'comparison/school_bus/school_bus.gltf'`, `comparisonRoseBowl: 'comparison/rose_bowl/rose_bowl.gltf'`.
  - `stowedVariants` (`Record<string, string>`, 7 spacecraft alternate cruise/stowed configurations):
    - `sc_jwst`: `'sc_jwst/webb_stowed.gltf'`
    - `sc_insight`: `'sc_insight/cruise/model.gltf'`
    - `sc_mars_2020`: `'sc_mars_2020/cruise_whole/msl_cruise_stage.gltf'`
    - `sc_mars_exploration_rover_1`: `'sc_mars_exploration_rover/cruise/mpf_mera_merb_cruise.gltf'`
    - `sc_mars_exploration_rover_2`: `'sc_mars_exploration_rover/cruise/mpf_mera_merb_cruise.gltf'`
    - `sc_mars_science_laboratory`: `'sc_mars_science_laboratory/cruise/msl_cruisestage.gltf'`
    - `sc_phoenix`: `'sc_phoenix/cruise/phoenix_cruise.gltf'`

---

### 2. Complete NASA Spacecraft Fleet (`NASA_SPACECRAFT_CATALOG` — All 174 Entries)

- **`Outer Solar System & Deep Space` (12 spacecraft)**
  - **`Cassini`** (`sc_cassini`): `subcategory`: `Orbiter` | `agency`: `NASA / ESA / ASI` | `hostBody`: `Saturn` | `status`: `Completed` | `activeSpan`: `1997–2017` | `featuredEpochUtc`: `2004-06-15T12:00:00Z` | `physicalSpanM`: `6.7` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_cassini/Cassini.gltf`
    - **Role & Description**: `Saturn System Flagship Orbiter` — Spent 13 years orbiting Saturn after Venus-Venus-Earth-Jupiter gravity assists, dispatching Huygens to Titan before its 2017 Grand Finale plunge.
    - **Highlights**: 4 m high-gain antenna & plutonium RTG power; Discovered geysers on Enceladus & hydrocarbon seas on Titan; Performed 22 ring-grazing Grand Finale orbits inside the D-ring
    - **Trajectory Segments (`dynSegments`, 9)**: `sc_cassini__earth__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-11951935.817, -11660335.817]`), `sc_cassini__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-69820368.428, -69537536.818]`), `sc_cassini__saturn__orb.dyn` (`kind`: `orb`, `parentId`: `saturn`, `inline`: `false`, `t`: `[139219264.185, 558743640.0]`), `sc_cassini__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-69537536.818, -53179136.814]`), `sc_cassini__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-53092736.814, -16495135.816]`), `sc_cassini__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-16451935.816, -11951935.817]`), `sc_cassini__sun__4__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-11660335.817, 139219264.185]`), `sc_cassini__venus__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[-53179136.814, -53092736.814]`), `sc_cassini__venus__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[-16495135.816, -16451935.816]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Saturn`, `a`: `320000` km, `e`: `0.62`, `i`: `62.0°`, `Ω`: `88°`, `ω`: `290°`, `M0`: `20°`, `P`: `4.5` d
  - **`Europa Clipper`** (`sc_europa_clipper`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL / JHUAPL` | `hostBody`: `Jupiter` | `status`: `En Route` | `activeSpan`: `2024–Present` | `featuredEpochUtc`: `2025-03-01T18:00:00Z` | `physicalSpanM`: `30.5` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_europa_clipper/europa_clipper.gltf`
    - **Role & Description**: `Europa Subsurface Ocean Habitability Orbiter` — NASA's largest planetary exploration spacecraft, spanning 30.5 m with giant solar wings to perform 49 close flybys of Jupiter's ocean moon Europa.
    - **Highlights**: Immense 30.5 m low-intensity solar array span; REASON ice-penetrating radar & MASPEX mass spectrometer for plumes
    - **Trajectory Segments (`dynSegments`, 5)**: `sc_europa_clipper__earth__flyby.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[849407067.0, 849810294.0]`), `sc_europa_clipper__earth__launch.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[782194503.712, 782641310.0]`), `sc_europa_clipper__jupiter.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `false`, `t`: `[953991214.0, 1094126469.183]`), `sc_europa_clipper__mars__flyby.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[794086294.0, 794230007.0]`), `sc_europa_clipper__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[782641310.0, 953991214.0]`)
  - **`Galileo`** (`sc_galileo`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL` | `hostBody`: `Jupiter` | `status`: `Completed` | `activeSpan`: `1989–2003` | `featuredEpochUtc`: `1992-12-08T12:00:00Z` | `physicalSpanM`: `4.6` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_galileo/galileo.gltf`
    - **Role & Description**: `First Jupiter System Orbiter` — Completed the first Jupiter orbital tour (1995–2003), uncovering Europa's global subsurface saltwater ocean and Io's active silicate volcanism.
    - **Highlights**: Detected induced magnetic field proving Europa's liquid ocean; Executed first close flybys of asteroids 951 Gaspra and 243 Ida
    - **Trajectory Segments (`dynSegments`, 6)**: `sc_galileo__earth__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-286252262.0, -285827020.0]`), `sc_galileo__earth__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-223105356.0, -222610262.0]`), `sc_galileo__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-321964226.74, -321559829.0]`), `sc_galileo__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `false`, `t`: `[-129268796.0, 117442702.0]`), `sc_galileo__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-321559829.0, -129268796.0]`), `sc_galileo__venus__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[-312199026.0, -311946958.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Jupiter`, `a`: `680000` km, `e`: `0.35`, `i`: `3.0°`, `Ω`: `110°`, `ω`: `45°`, `M0`: `90°`, `P`: `14.0` d
  - **`Galileo Probe`** (`sc_galileo_probe`): `subcategory`: `Lander` | `agency`: `NASA / Ames` | `hostBody`: `Jupiter` | `status`: `Completed` | `activeSpan`: `1989–1995` | `featuredEpochUtc`: `1995-12-07T22:00:00Z` | `physicalSpanM`: `1.25` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_galileo_probe/galileo_probe.gltf`
    - **Role & Description**: `First Entry Probe Into a Gas Giant` — Released from Galileo, plunged into Jupiter's clouds at 47.4 km/s on 7 December 1995 and transmitted 58 minutes of direct atmospheric data.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_galileo_probe__galileo__orb.dyn` (`kind`: `pos`, `parentId`: `galileo`, `inline`: `true`, `t`: `[-141114537.483, -129268796.0]`), `sc_galileo_probe__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-129268796.0, -128353980.0]`)
  - **`Huygens`** (`sc_huygens`): `subcategory`: `Lander` | `agency`: `ESA / NASA` | `hostBody`: `Titan` | `status`: `Completed` | `activeSpan`: `1997–2005` | `featuredEpochUtc`: `2005-01-14T11:30:00Z` | `physicalSpanM`: `2.7` m | `colorHex`: `#e9b970` | `modelPath`: `sc_huygens/Huygens.gltf`
    - **Role & Description**: `Titan Atmospheric Probe & Surface Lander` — Deployed from Cassini to execute humanity's farthest landing on Saturn's giant haze-shrouded moon Titan on 14 January 2005.
    - **Highlights**: Parachuted 147 minutes through nitrogen-methane smog; Sampled organic tholins and photographed rounded water-ice pebbles
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_huygens__saturn__orb.dyn` (`kind`: `orb`, `parentId`: `saturn`, `inline`: `true`, `t`: `[157212064.184, 158945582.0]`), `sc_huygens__titan__orb.dyn` (`kind`: `orb`, `parentId`: `titan`, `inline`: `true`, `t`: `[158945582.0, 158965616.707]`)
  - **`Juice`** (shortName: `JUICE`) (`sc_juice`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `Jupiter` | `status`: `En Route` | `activeSpan`: `2023–Present` | `featuredEpochUtc`: `2024-08-20T21:00:00Z` | `physicalSpanM`: `27.0` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_juice/juice.gltf`
    - **Role & Description**: `JUpiter ICy moons Explorer` — ESA flagship mission performing complex Earth-Moon and Venus gravity assists en route to orbit Ganymede and probe icy moons Calisto and Europa.
    - **Highlights**: First spacecraft to perform a combined Lunar-Earth gravity assist; Cross-shaped 85 m² solar array for dim outer-system sunlight
    - **Trajectory Segments (`dynSegments`, 8)**: `sc_juice__earth__flyby1.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[777026548.0, 778061110.0]`), `sc_juice__earth__flyby2.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[843697642.0, 844049179.0]`), `sc_juice__earth__flyby3.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[916393497.0, 916903199.0]`), `sc_juice__earth__launch.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[734748207.0, 735606318.0]`), `sc_juice__ganymede.dyn` (`kind`: `orb`, `parentId`: `ganymede`, `inline`: `false`, `t`: `[1103217877.0, 1129256953.348]`), `sc_juice__jupiter.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `false`, `t`: `[994471790.0, 1103217877.0]`), `sc_juice__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[735606318.0, 994471790.0]`), `sc_juice__venus__flyby.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[809697014.0, 810162491.0]`)
  - **`Juno`** (`sc_juno`): `subcategory`: `Orbiter` | `agency`: `NASA / SwRI / JPL` | `hostBody`: `Jupiter` | `status`: `Active` | `activeSpan`: `2011–Present` | `featuredEpochUtc`: `2023-12-30T08:30:00Z` | `physicalSpanM`: `20.0` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_juno/Juno.gltf`
    - **Role & Description**: `Jupiter Polar Magnetosphere & Interior Orbiter` — Tri-wing solar-powered probe diving to 4,200 km over Jupiter's swirling polar cyclones and conducting close flybys of Ganymede, Europa, and Io.
    - **Highlights**: Triple 9-meter solar arrays stabilized in 2 RPM spin; Microwave radiometer sounding 500 km deep into ammonia clouds
    - **Trajectory Segments (`dynSegments`, 9)**: `sc_juno__earth__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[434433667.182, 434793667.182]`), `sc_juno__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[365836752.183, 366088266.183]`), `sc_juno__europa__orb.dyn` (`kind`: `orb`, `parentId`: `europa`, `inline`: `true`, `t`: `[717700360.0, 717727733.0]`), `sc_juno__ganymede__orb.dyn` (`kind`: `orb`, `parentId`: `ganymede`, `inline`: `true`, `t`: `[676339597.0, 676381521.0]`), `sc_juno__io__1__orb.dyn` (`kind`: `orb`, `parentId`: `io`, `inline`: `true`, `t`: `[757191924.0, 757203571.0]`), `sc_juno__io__2__orb.dyn` (`kind`: `orb`, `parentId`: `io`, `inline`: `true`, `t`: `[760247560.0, 760262808.0]`), `sc_juno__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `false`, `t`: `[519652868.184, 907243200.0]`), `sc_juno__sun__postflyby__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[434793667.182, 519652868.184]`), `sc_juno__sun__preflyby__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[366088266.183, 434433667.182]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Jupiter`, `a`: `340000` km, `e`: `0.78`, `i`: `89.5°`, `Ω`: `42°`, `ω`: `270°`, `M0`: `10°`, `P`: `53.0` d
  - **`New Horizons`** (`sc_new_horizons`): `subcategory`: `Flyby` | `agency`: `NASA / JHUAPL` | `hostBody`: `Pluto / Kuiper Belt` | `status`: `Active` | `activeSpan`: `2006–Present` | `featuredEpochUtc`: `2015-07-14T11:49:00Z` | `physicalSpanM`: `2.7` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_new_horizons/new_horizons.gltf`
    - **Role & Description**: `Pluto & Kuiper Belt Reconnaissance Probe` — Launched as the fastest Earth departure spacecraft, revealing Sputnik Planitia's nitrogen glaciers on Pluto (2015) and contact binary Arrokoth (2019).
    - **Highlights**: Closest approach 12,500 km above Pluto on 14 July 2015; Revealed contact-binary Kuiper Belt object 486958 Arrokoth; LORRI long-range telescope, Ralph & Alice spectrometers
    - **Trajectory Segments (`dynSegments`, 8)**: `sc_new_horizons__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[190972278.33, 191055829.0]`), `sc_new_horizons__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[225619606.0, 226100665.0]`), `sc_new_horizons__mu69__pos.dyn` (`kind`: `pos`, `parentId`: `486958_arrokoth`, `inline`: `true`, `t`: `[598753684.0, 600203601.0]`), `sc_new_horizons__pluto__orb.dyn` (`kind`: `orb`, `parentId`: `pluto`, `inline`: `true`, `t`: `[490130161.0, 490167848.0]`), `sc_new_horizons__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[191055829.0, 225619606.0]`), `sc_new_horizons__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[226100665.0, 490130161.0]`), `sc_new_horizons__sun__3__pos.dyn` (`kind`: `pos`, `parentId`: `sun`, `inline`: `true`, `t`: `[490167848.0, 598753684.0]`), `sc_new_horizons__sun__4__pos.dyn` (`kind`: `pos`, `parentId`: `sun`, `inline`: `true`, `t`: `[600203601.0, 886291200.0]`)
  - **`Pioneer 10`** (`sc_pioneer_10`): `subcategory`: `Flyby` | `agency`: `NASA / Ames` | `hostBody`: `Interstellar` | `status`: `Completed` | `activeSpan`: `1972–2003` | `featuredEpochUtc`: `1973-12-04T02:26:00Z` | `physicalSpanM`: `2.9` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_pioneer/pioneer.gltf`
    - **Role & Description**: `First Jupiter Flyby & Kuiper Pioneer` — First spacecraft to traverse the asteroid belt and fly past Jupiter (1973), carrying the engraved gold-anodized Pioneer Plaque toward Aldebaran.
    - **Highlights**: Survived Jupiter's intense radiation belts in December 1973; Maintained radio contact out to 82 AU until 2003
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_pioneer_10__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-878291717.815, -878146409.0]`), `sc_pioneer_10__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-824046472.0, -822011429.0]`), `sc_pioneer_10__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-878146409.0, -824046472.0]`), `sc_pioneer_10__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-822011429.0, 1577880600.0]`)
  - **`Pioneer 11`** (`sc_pioneer_11`): `subcategory`: `Flyby` | `agency`: `NASA / Ames` | `hostBody`: `Interstellar` | `status`: `Completed` | `activeSpan`: `1973–1995` | `featuredEpochUtc`: `1979-09-01T16:31:00Z` | `physicalSpanM`: `2.9` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_pioneer/pioneer.gltf`
    - **Role & Description**: `First Saturn Flyby Pathfinder` — Pathfinder for Voyager at Saturn (September 1979), skimming within 21,000 km of Saturn's clouds and discovering the F-ring.
    - **Highlights**: Executed dramatic polar pass over Jupiter toward Saturn; Verified ring plane safety for the upcoming Voyager flybys
    - **Trajectory Segments (`dynSegments`, 6)**: `sc_pioneer_11__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-843816855.814, -843644357.0]`), `sc_pioneer_11__jupiter__orb.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-792658454.0, -790152245.0]`), `sc_pioneer_11__saturn__orb.dyn` (`kind`: `orb`, `parentId`: `saturn`, `inline`: `true`, `t`: `[-643302619.0, -640194311.0]`), `sc_pioneer_11__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-843644357.0, -792658454.0]`), `sc_pioneer_11__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-790152245.0, -643302619.0]`), `sc_pioneer_11__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-640194311.0, 1577880600.0]`)
  - **`Voyager 1`** (`sc_voyager_1`): `subcategory`: `Flyby` | `agency`: `NASA / JPL` | `hostBody`: `Interstellar` | `status`: `Active` | `activeSpan`: `1977–Present` | `featuredEpochUtc`: `1980-11-12T23:46:00Z` | `physicalSpanM`: `16.0` m | `colorHex`: `#ffd166` | `modelPath`: `sc_voyager/Voyager.gltf`
    - **Role & Description**: `Interstellar Explorer & Grand Tour Probe` — The farthest human-made object from Earth, cruising past the heliopause into interstellar space since August 2012 after Jupiter and Saturn.
    - **Highlights**: Crossed the heliopause at ~121 AU in August 2012; Carries the copper-gold Voyager Golden Record; Captured the famous 1990 Pale Blue Dot Solar System portrait
    - **Trajectory Segments (`dynSegments`, 6)**: `sc_voyager_1__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-704412035.617, -703530245.0]`), `sc_voyager_1__jupiter.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-660264745.0, -655057463.0]`), `sc_voyager_1__saturn.dyn` (`kind`: `orb`, `parentId`: `saturn`, `inline`: `true`, `t`: `[-606239665.0, -600733702.0]`), `sc_voyager_1__sun__1.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-703530245.0, -660264745.0]`), `sc_voyager_1__sun__2.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-655057463.0, -606239665.0]`), `sc_voyager_1__sun__3.dyn` (`kind`: `pos`, `parentId`: `sun`, `inline`: `true`, `t`: `[-600733702.0, 3155716800.0]`)
  - **`Voyager 2`** (`sc_voyager_2`): `subcategory`: `Flyby` | `agency`: `NASA / JPL` | `hostBody`: `Interstellar` | `status`: `Active` | `activeSpan`: `1977–Present` | `featuredEpochUtc`: `1989-08-25T03:56:00Z` | `physicalSpanM`: `16.0` m | `colorHex`: `#ffd166` | `modelPath`: `sc_voyager/Voyager.gltf`
    - **Role & Description**: `Grand Tour Quad-Planet Explorer` — The only spacecraft to visit all four giant planets — Jupiter, Saturn, Uranus, and Neptune — now operating in interstellar space.
    - **Highlights**: Only close-up reconnaissance of Uranus (1986) & Neptune (1989); Imaged nitrogen geysers erupting on Triton; Exited the heliosphere into interstellar plasma in Nov 2018
    - **Trajectory Segments (`dynSegments`, 10)**: `sc_voyager_2__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-705788847.817, -704774613.0]`), `sc_voyager_2__jupiter.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-650828783.0, -642276063.0]`), `sc_voyager_2__neptune.dyn` (`kind`: `orb`, `parentId`: `neptune`, `inline`: `true`, `t`: `[-327233138.0, -326252606.0]`), `sc_voyager_2__saturn.dyn` (`kind`: `orb`, `parentId`: `saturn`, `inline`: `true`, `t`: `[-582886481.0, -574538624.0]`), `sc_voyager_2__sun__1.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-704774613.0, -650828783.0]`), `sc_voyager_2__sun__2.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-642276063.0, -582886481.0]`), `sc_voyager_2__sun__3.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-574538624.0, -440395228.0]`), `sc_voyager_2__sun__4.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-439259319.0, -327233138.0]`), `sc_voyager_2__sun__5.dyn` (`kind`: `pos`, `parentId`: `sun`, `inline`: `true`, `t`: `[-326252606.0, 3155716800.0]`), `sc_voyager_2__uranus.dyn` (`kind`: `orb`, `parentId`: `uranus`, `inline`: `true`, `t`: `[-440395228.0, -439259319.0]`)
- **`Space Telescopes & Observatories` (12 spacecraft)**
  - **`BioSentinel`** (`sc_biosentinel`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Sun` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_biosentinel/biosentinel.gltf`
    - **Role & Description**: `Sun Orbiter` — NASA Eyes orbiter mission operating around Sun, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_biosentinel__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[721866289.0, 722273637.0]`), `sc_biosentinel__moon__orb.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `true`, `t`: `[722273637.0, 722923565.0]`), `sc_biosentinel__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[722923565.0, 883656069.184]`)
  - **`Chandra X-ray Observatory`** (shortName: `Chandra`) (`sc_chandra`): `subcategory`: `Orbiter` | `agency`: `NASA / SAO` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `1999–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `19.5` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_chandra/chandra.gltf`
    - **Role & Description**: `Great Observatory X-ray Telescope` — Flying in an eccentric 64-hour orbit spanning a third of the way to the Moon, imaging supermassive black holes, supernovae, and neutron stars in X-rays.
    - **Highlights**: 4 nested grazing-incidence iridium X-ray mirrors; Resolved the Sagittarius A* accretion glow & colliding Bullet Cluster
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `80800` km, `e`: `0.8`, `i`: `28.5°`, `Ω`: `200°`, `ω`: `270°`, `M0`: `50°`, `P`: `2.64` d
  - **`Euclid`** (`sc_euclid`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `Sun-Earth L2` | `status`: `Active` | `activeSpan`: `2023–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `4.7` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_euclid/euclid.gltf`
    - **Role & Description**: `Dark Energy & Dark Matter Space Telescope` — Mapping 1.5 billion galaxies across a third of the extragalactic sky from L2 to measure cosmic acceleration and gravitational lensing.
    - **Highlights**: 1.2 m Korsch silicon carbide telescope & VIS/NISP instruments; Builds the widest high-resolution 3D map of the universe
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_euclid__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[741498789.0, 1002885075.331]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L2`, `amplitudeKm`: `410000`, `periodDays`: `178.0`, `phaseDeg`: `165.0`
  - **`Hubble Space Telescope`** (shortName: `Hubble`) (`sc_hubble_space_telescope`): `subcategory`: `Orbiter` | `agency`: `NASA / ESA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `1990–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `13.2` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_hubble/Hubble.gltf`
    - **Role & Description**: `Optical & Ultraviolet Space Telescope` — Iconic 2.4-meter reflector observatory operating in 535 km low-Earth orbit since 1990, capturing over 1.6 million cosmic observations.
    - **Highlights**: 2.4 m Ritchey-Chretien hyperbolic mirror; WFC3, COS, STIS & ACS deep-field imaging suite; Serviced across five Space Shuttle orbital EVAs
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_hubble_space_telescope__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[-305719099.928, 853497159.042]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6906` km, `e`: `0.0003`, `i`: `28.47°`, `Ω`: `45°`, `ω`: `110°`, `M0`: `75°`, `P`: `0.0663` d
  - **`IXPE`** (`sc_ixpe`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_ixpe/ixpe.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6971` km, `e`: `0.0002`, `i`: `0.2°`, `Ω`: `146°`, `ω`: `0°`, `M0`: `82°`, `P`: `0.0686` d
  - **`James Webb Space Telescope`** (shortName: `JWST`) (`sc_jwst`): `subcategory`: `Orbiter` | `agency`: `NASA / ESA / CSA` | `hostBody`: `Sun-Earth L2` | `status`: `Active` | `activeSpan`: `2021–Present` | `featuredEpochUtc`: `2022-07-12T14:30:00Z` | `physicalSpanM`: `21.2` m | `colorHex`: `#f4cd72` | `modelPath`: `sc_jwst/webb_deployed.gltf`
    - **Role & Description**: `Flagship Infrared Space Observatory` — Stationed 1.5 million km away in a halo orbit around the Sun-Earth L2 Lagrange point behind a five-layer Kapton sunshield.
    - **Highlights**: 6.5 m 18-segment gold-coated beryllium primary mirror; Tennis-court-sized 5-layer Kapton V-groove sunshield; NIRCam, NIRSpec, MIRI & FGS/NIRISS cryogenics at 40 K
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_jwst__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[693708549.184, 1020081669.186]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L2`, `amplitudeKm`: `520000`, `periodDays`: `180.0`, `phaseDeg`: `35.0`
  - **`Kepler`** (`sc_kepler_space_telescope`): `subcategory`: `Orbiter` | `agency`: `NASA / Ames` | `hostBody`: `Sun` | `status`: `Completed` | `activeSpan`: `2009–2018` | `featuredEpochUtc`: `2012-06-01T00:00:00Z` | `physicalSpanM`: `4.7` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_kepler/Kepler.gltf`
    - **Role & Description**: `Exoplanet Census Photometer` — Proved that planets outnumber stars in the Milky Way, discovering over 2,700 confirmed exoplanets by staring at Cygnus-Lyra.
    - **Highlights**: 95-megapixel array of 42 photometer CCDs; Discovered the first Earth-sized world inside a habitable zone (Kepler-186f)
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_kepler__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[289679042.186, 290348743.0]`), `sc_kepler__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[290348743.0, 595512069.183]`)
  - **`NuSTAR`** (`sc_nustar`): `subcategory`: `Orbiter` | `agency`: `NASA / Caltech` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `2012–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `10.9` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_nustar/nustar.gltf`
    - **Role & Description**: `High-Energy Focusing X-ray Telescope` — Deploys a 10-meter carbon-fiber mast in orbit to focus hard X-rays from black holes, magnetars, and supernova remnants.
    - **Highlights**: First orbiting telescope to focus hard X-rays (3–79 keV); 10.1 m deployable lattice mast separates optics from detectors
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6980` km, `e`: `0.001`, `i`: `6.0°`, `Ω`: `80°`, `ω`: `10°`, `M0`: `40°`, `P`: `0.067` d
  - **`Nancy Grace Roman Space Telescope`** (shortName: `Nancy Grace Roman`) (`sc_roman_space_telescope`): `subcategory`: `Orbiter` | `agency`: `NASA / GSFC` | `hostBody`: `Sun-Earth L2` | `status`: `Upcoming` | `activeSpan`: `2026–Present` | `featuredEpochUtc`: `2026-11-15T12:00:00Z` | `physicalSpanM`: `12.7` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_roman_space_telescope/roman.gltf`
    - **Role & Description**: `Wide Field Infrared Survey Telescope` — 2.4 m infrared space observatory with a 100× wider field of view than Hubble plus a starlight-suppressing exoplanet coronagraph.
    - **Highlights**: 288-megapixel Wide Field Instrument; Searches for thousands of exoplanets via gravitational microlensing
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_roman_space_telescope__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[841363150.0, 857696469.185]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L2`, `amplitudeKm`: `480000`, `periodDays`: `182.0`, `phaseDeg`: `290.0`
  - **`SPHEREx`** (`sc_spherex`): `subcategory`: `Orbiter` | `agency`: `NASA / Caltech` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `2025–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.2` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_spherex/spherex.gltf`
    - **Role & Description**: `All-Sky Near-Infrared Spectral Mapper` — Conical-shielded observatory performing the first all-sky spectroscopic survey in 102 infrared color bands to study cosmic inflation and water ices.
    - **Highlights**: Triple nested photon shields passively cool telescope to 80 K; Maps over 450 million galaxies & Milky Way interstellar ices
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7040` km, `e`: `0.001`, `i`: `98.0°`, `Ω`: `280°`, `ω`: `0°`, `M0`: `210°`, `P`: `0.068` d
  - **`Spitzer Space Telescope`** (shortName: `Spitzer`) (`sc_spitzer`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL / Caltech` | `hostBody`: `Sun` | `status`: `Completed` | `activeSpan`: `2003–2020` | `featuredEpochUtc`: `2010-01-01T00:00:00Z` | `physicalSpanM`: `4.4` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_spitzer/SPITZER.gltf`
    - **Role & Description**: `Infrared Great Observatory (Earth-Trailing)` — Co-discovered the TRAPPIST-1 seven-Earth-sized exoplanet system and mapped dusty galaxies while drifting behind Earth along 1 AU.
    - **Highlights**: Earth-trailing heliocentric orbit eliminated Earth infrared heat; Measured the first direct spectra of transiting exoplanet atmospheres
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_spitzer__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[115064804.0, 115493678.0]`), `sc_spitzer__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[115493678.0, 633614469.0]`)
  - **`TESS`** (`sc_tess`): `subcategory`: `Orbiter` | `agency`: `NASA / MIT` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `2018–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.9` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_tess/TESS.gltf`
    - **Role & Description**: `Transiting Exoplanet Survey Satellite` — Locked in a 2:1 lunar resonance orbit scanning 85% of the celestial sphere to discover transiting exoplanets around the brightest nearby stars.
    - **Highlights**: 4 wide-field CCD cameras monitoring 200,000+ stars; 2:1 lunar-resonant elliptical orbit keeps thermally & gravitationally stable
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_tess__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[577366932.363, 862189269.186]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `240000` km, `e`: `0.55`, `i`: `37.0°`, `Ω`: `140°`, `ω`: `60°`, `M0`: `120°`, `P`: `13.7` d
- **`Asteroid & Comet Probes` (13 spacecraft)**
  - **`DART`** (`sc_dart`): `subcategory`: `Impactor` | `agency`: `NASA / JHUAPL` | `hostBody`: `65803 Didymos` | `status`: `Completed` | `activeSpan`: `2021–2022` | `featuredEpochUtc`: `2022-09-26T21:00:00Z` | `physicalSpanM`: `18.0` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_dart/dart.gltf`
    - **Role & Description**: `Planetary Defense Kinetic Impactor` — Humanity's first planetary defense deflection mission: intentionally collided with asteroid moonlet Dimorphos at 6.1 km/s, shortening its orbit by 33 minutes.
    - **Highlights**: Autonomous SMART Nav optically guided kinetic impact on 26 Sep 2022; Unfurling ROSA roll-out solar arrays & NEXT-C ion thruster
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_dart__65803_didymos__pos.dyn` (`kind`: `pos`, `parentId`: `65803_didymos`, `inline`: `true`, `t`: `[717454117.0, 717503237.0]`), `sc_dart__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[691007069.0, 691418893.0]`), `sc_dart__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[691418893.0, 717454117.0]`)
  - **`Dawn`** (`sc_dawn`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL / UCLA` | `hostBody`: `Ceres` | `status`: `Completed` | `activeSpan`: `2007–2018` | `featuredEpochUtc`: `2014-06-01T00:00:00Z` | `physicalSpanM`: `19.7` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_dawn/model.gltf`
    - **Role & Description**: `Dual Protoplanet Ion-Propulsion Orbiter` — Only spacecraft ever to orbit two extraterrestrial targets — giant protoplanet 4 Vesta and dwarf planet 1 Ceres — powered by Xenon ion thrusters.
    - **Highlights**: Mapped Vesta's Rheasilvia mega-crater & Ceres' bright salt domes (Occator); Achieved 11.5 km/s ion-propulsion delta-v record
    - **Trajectory Segments (`dynSegments`, 7)**: `sc_dawn__ceres__orb.dyn` (`kind`: `orb`, `parentId`: `1_ceres`, `inline`: `false`, `t`: `[476712067.0, 594302469.184]`), `sc_dawn__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[244168849.832, 244461608.0]`), `sc_dawn__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[288169447.0, 288210177.0]`), `sc_dawn__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[244461608.0, 288169447.0]`), `sc_dawn__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[288210177.0, 363182466.0]`), `sc_dawn__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[400075267.0, 476712067.0]`), `sc_dawn__vesta__orb.dyn` (`kind`: `orb`, `parentId`: `4_vesta`, `inline`: `false`, `t`: `[363182466.0, 400075267.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Ceres`, `a`: `1400` km, `e`: `0.03`, `i`: `90.0°`, `Ω`: `20°`, `ω`: `40°`, `M0`: `0°`, `P`: `1.5` d
  - **`Deep Impact`** (shortName: `Deep Impact / EPOXI`) (`sc_deep_impact`): `subcategory`: `Flyby` | `agency`: `NASA / JPL / UMD` | `hostBody`: `103P/Hartley 2` | `status`: `Completed` | `activeSpan`: `2005–2013` | `featuredEpochUtc`: `2005-07-04T05:52:00Z` | `physicalSpanM`: `3.2` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_deep_impact/deep_impact_wo_impactor.gltf`
    - **Role & Description**: `Dual-Comet Hypervelocity Explorer` — Dropped a 370 kg copper impactor into Comet 9P/Tempel 1 in July 2005 and went on to image CO2 jets on Comet 103P/Hartley 2.
    - **Trajectory Segments (`dynSegments`, 7)**: `sc_deep_impact__103p_hartley_2__pos.dyn` (`kind`: `pos`, `parentId`: `103p_hartley_2`, `inline`: `true`, `t`: `[342017751.0, 342368983.0]`), `sc_deep_impact__9p_tempel_1__pos.dyn` (`kind`: `pos`, `parentId`: `9p_tempel_1`, `inline`: `true`, `t`: `[173560752.0, 173923158.0]`), `sc_deep_impact__earth__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[251798121.0, 253531474.0]`), `sc_deep_impact__earth__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[282984399.0, 285405903.0]`), `sc_deep_impact__earth__flyby3__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[330384030.0, 331534813.0]`), `sc_deep_impact__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[158829812.068, 159287744.0]`), `sc_deep_impact__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[159287744.0, 429192067.0]`)
  - **`Deep Impact Impactor`** (`sc_deep_impact_impactor`): `subcategory`: `Impactor` | `agency`: `NASA / JPL` | `hostBody`: `9P/Tempel 1` | `status`: `Completed` | `activeSpan`: `2005` | `featuredEpochUtc`: `2005-07-04T05:52:00Z` | `physicalSpanM`: `1.0` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_deep_impact_impactor/deep_impact_impactor.gltf`
    - **Role & Description**: `Autonomous Copper Comet Impactor` — Photographed Comet Tempel 1 down to 3 seconds before colliding at 10.2 km/s to excavate pristine subsurface solar system ice.
    - **Attitude Segment (`oriSegment`)**: `sc_deep_impact_impactor__quat.dyn` (`kind`: `quat`, `parentId`: `self`, `inline`: `true`, `t`: `[173642462.184, 0.748]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `9P/Tempel 1`, `a`: `1200` km, `e`: `0.05`, `i`: `10°`, `Ω`: `0°`, `ω`: `0°`, `M0`: `90°`, `P`: `10.0` d
  - **`Deep Space 1`** (`sc_deep_space_1`): `subcategory`: `Flyby` | `agency`: `NASA / JPL` | `hostBody`: `19P/Borrelly` | `status`: `Completed` | `activeSpan`: `1998–2001` | `featuredEpochUtc`: `2001-09-22T22:29:00Z` | `physicalSpanM`: `11.8` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_deep_space_1/deep_space_1.gltf`
    - **Role & Description**: `First Deep-Space Ion Propulsion Pioneer` — Validated solar-electric ion propulsion while flying past asteroid Braille and Comet 19P/Borrelly.
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_deep_space_1__19p_borrelly__pos.dyn` (`kind`: `pos`, `parentId`: `19p_borrelly`, `inline`: `true`, `t`: `[54458637.0, 54476825.0]`), `sc_deep_space_1__9969_braille__pos.dyn` (`kind`: `pos`, `parentId`: `9969_braille`, `inline`: `true`, `t`: `[-13523799.0, -13496699.0]`), `sc_deep_space_1__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-37470248.0, -36628312.0]`), `sc_deep_space_1__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-36628312.0, 61977664.184]`)
  - **`Lucy`** (`sc_lucy`): `subcategory`: `Orbiter` | `agency`: `NASA / SwRI` | `hostBody`: `Jupiter Trojans` | `status`: `Active` | `activeSpan`: `2021–Present` | `featuredEpochUtc`: `2025-04-20T17:51:00Z` | `physicalSpanM`: `14.2` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_lucy/lucy.gltf`
    - **Role & Description**: `Jupiter Trojan Asteroid Swarm Explorer` — Twelve-year grand tour visiting main-belt fossils Dinkinesh & Donaldjohanson before surveying pristine Jupiter L4/L5 Trojan asteroids.
    - **Highlights**: Two 7.3 m circular UltraFlex solar arrays like giant petals; Discovered contact-binary moonlet Selam orbiting Dinkinesh
    - **Trajectory Segments (`dynSegments`, 6)**: `sc_lucy__3548_eurybates__pos.dyn` (`kind`: `pos`, `parentId`: `3548_eurybates`, `inline`: `true`, `t`: `[870652086.0, 872642047.0]`), `sc_lucy__52246_donaldjohanson__pos.dyn` (`kind`: `pos`, `parentId`: `52246_donaldjohanson`, `inline`: `true`, `t`: `[798252820.0, 798584539.0]`), `sc_lucy__earth__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[718960993.0, 719531941.0]`), `sc_lucy__earth__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[787134972.0, 787532222.0]`), `sc_lucy__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[687656642.763, 687915086.0]`), `sc_lucy__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[687915086.0, 1049455583.933]`)
  - **`NEAR Shoemaker`** (`sc_near_shoemaker`): `subcategory`: `Flyby` | `agency`: `NASA / JHUAPL` | `hostBody`: `Eros` | `status`: `Completed` | `activeSpan`: `1996–2001` | `featuredEpochUtc`: `2000-02-14T15:33:00Z` | `physicalSpanM`: `3.4` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_near_shoemaker/near.gltf`
    - **Role & Description**: `First Asteroid Orbiter & Surface Lander` — Orbited near-Earth asteroid 433 Eros for a full year before touching down gently onto its dusty regolith on 12 February 2001.
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_near_shoemaker__253_mathilde__pos.dyn` (`kind`: `pos`, `parentId`: `253_mathilde`, `inline`: `true`, `t`: `[-79403925.0, -79210250.0]`), `sc_near_shoemaker__433_eros__orb.dyn` (`kind`: `orb`, `parentId`: `433_eros`, `inline`: `false`, `t`: `[-8425610.0, 35279032.137]`), `sc_near_shoemaker__earth__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-61397606.0, -60793811.0]`), `sc_near_shoemaker__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-113227200.0, -8425610.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Eros`, `a`: `60` km, `e`: `0.05`, `i`: `45°`, `Ω`: `10°`, `ω`: `20°`, `M0`: `40°`, `P`: `2.0` d
  - **`NEO Surveyor`** (`sc_neo_surveyor`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Sun-Earth L1` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_neo_surveyor/neosurveyor.gltf`
    - **Role & Description**: `Sun-Earth L1 Orbiter` — NASA Eyes orbiter mission operating around Sun-Earth L1, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_neo_surveyor__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `false`, `t`: `[874108800.0, 1289990369.73]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `420000`, `periodDays`: `180.0`, `phaseDeg`: `310.0`
  - **`OSIRIS-APEX`** (`sc_osiris_rex`): `subcategory`: `Orbiter` | `agency`: `NASA / UArizona / GSFC` | `hostBody`: `Bennu / Apophis` | `status`: `Active` | `activeSpan`: `2016–Present` | `featuredEpochUtc`: `2023-09-24T12:00:00Z` | `physicalSpanM`: `6.2` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_osiris_rex_v2/osiris_rex_articulated_panels.gltf`
    - **Role & Description**: `Bennu Sample Return & Apophis Explorer` — Collected 121.6 g of pristine carbonaceous regolith from asteroid Bennu in 2020, delivered the capsule to Utah in 2023, and now cruises to 99942 Apophis.
    - **Highlights**: Touch-and-Go (TAG) pneumatic sampling of rubble-pile Bennu; Redirected on extended OSIRIS-APEX tour for 2029 Apophis rendezvous
    - **Trajectory Segments (`dynSegments`, 9)**: `sc_osiris_rex__apophis.dyn` (`kind`: `pos`, `parentId`: `99942_apophis`, `inline`: `false`, `t`: `[924136663.0, 968068800.0]`), `sc_osiris_rex__bennu__pos.dyn` (`kind`: `pos`, `parentId`: `101955_bennu`, `inline`: `false`, `t`: `[591770603.0, 674049669.0]`), `sc_osiris_rex__earth__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[558938468.0, 559919190.0]`), `sc_osiris_rex__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[526676400.0, 527025408.0]`), `sc_osiris_rex__earth__sample_return__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[748358886.0, 749140122.0]`), `sc_osiris_rex__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[527025408.0, 558938468.0]`), `sc_osiris_rex__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[559919190.0, 591770603.0]`), `sc_osiris_rex__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[674049669.0, 748358886.0]`), `sc_osiris_rex__sun__4__orb.dyn` (`kind`: `pos`, `parentId`: `sun`, `inline`: `true`, `t`: `[749140122.0, 924136663.0]`)
  - **`Philae`** (`sc_philae`): `subcategory`: `Lander` | `agency`: `ESA / DLR / ASI / CNES` | `hostBody`: `67P/Churyumov-Gerasimenko` | `status`: `Completed` | `activeSpan`: `2004–2016` | `featuredEpochUtc`: `2014-11-12T12:00:00Z` | `physicalSpanM`: `1.8` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_philae/philae.gltf`
    - **Role & Description**: `Cometary Surface Lander` — Achieved history's first soft touchdown on a comet nucleus (67P/C-G) on 12 November 2014, detecting organic molecules in Abydos region.
    - **Highlights**: Executed double bounce across Agilkia to shadowed Abydos cliff; Analyzed volatile organics with COSAC and Ptolemy
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_philae__67p_churyumov_gerasimenko__pos.dyn` (`kind`: `pos`, `parentId`: `67p_churyumov_gerasimenko`, `inline`: `true`, `t`: `[469053367.183, 469078512.324]`)
  - **`Psyche`** (`sc_psyche`): `subcategory`: `Orbiter` | `agency`: `NASA / ASU / JPL` | `hostBody`: `Psyche` | `status`: `En Route` | `activeSpan`: `2023–Present` | `featuredEpochUtc`: `2026-05-15T00:00:00Z` | `physicalSpanM`: `24.7` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_psyche/psyche.gltf`
    - **Role & Description**: `Metal-Rich Asteroid Hall-Thruster Orbiter` — On a solar-electric Hall-effect thruster voyage to metal-rich asteroid 16 Psyche — potentially the exposed nickel-iron core of a protoplanet.
    - **Highlights**: Twin 5-panel cross solar arrays generating 21 kW at 1 AU; Magnetometer, Multispectral Imager & Gamma-Ray/Neutron Spectrometer
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_psyche__16_psyche__orb.dyn` (`kind`: `orb`, `parentId`: `16_psyche`, `inline`: `false`, `t`: `[931665741.0, 1004529988.186]`), `sc_psyche__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[750482453.0, 750686758.0]`), `sc_psyche__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[831828698.0, 832302380.0]`), `sc_psyche__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[750686758.0, 931665741.0]`)
  - **`Rosetta`** (`sc_rosetta`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `67P/Churyumov-Gerasimenko` | `status`: `Completed` | `activeSpan`: `2004–2016` | `featuredEpochUtc`: `2014-02-01T00:00:00Z` | `physicalSpanM`: `32.0` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_rosetta/rosettaPhilae.gltf`
    - **Role & Description**: `Comet Escort & Philae Carrier Orbiter` — Escorted comet 67P/Churyumov–Gerasimenko through perihelion for over two years after a 10-year deep-space chase, deploying lander Philae.
    - **Highlights**: First spacecraft to orbit a comet nucleus in deep space; Monitored dust jets erupting through perihelion before soft landing in 2016
    - **Trajectory Segments (`dynSegments`, 11)**: `sc_rosetta__67p_churyumov_gerasimenko__pos.dyn` (`kind`: `pos`, `parentId`: `67p_churyumov_gerasimenko`, `inline`: `false`, `t`: `[452394238.0, 528503957.968]`), `sc_rosetta__earth__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[162704887.0, 163831232.0]`), `sc_rosetta__earth__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[248111015.0, 248475560.0]`), `sc_rosetta__earth__flyby3__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[311055929.0, 311664877.0]`), `sc_rosetta__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[131491581.583, 131901500.0]`), `sc_rosetta__mars__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[225623375.0, 225657862.0]`), `sc_rosetta__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[131901500.0, 162704887.0]`), `sc_rosetta__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[163831232.0, 225623375.0]`), `sc_rosetta__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[225657862.0, 248111015.0]`), `sc_rosetta__sun__4__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[248475560.0, 311055929.0]`), `sc_rosetta__sun__5__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[311664877.0, 452394238.0]`)
  - **`Stardust`** (shortName: `Stardust-NExT`) (`sc_stardust`): `subcategory`: `Flyby` | `agency`: `NASA / JPL / Lockheed Martin` | `hostBody`: `81P/Wild 2` | `status`: `Completed` | `activeSpan`: `1999–2011` | `featuredEpochUtc`: `2004-01-02T19:21:00Z` | `physicalSpanM`: `4.8` m | `colorHex`: `#d9a7ff` | `modelPath`: `sc_stardust/stardust_articulated.gltf`
    - **Role & Description**: `Comet Aerogel Sample Return Explorer` — Captured pristine coma grains in tennis-racket aerogel at Comet Wild 2 (2004), returned them to Earth in 2006, then imaged Tempel 1's fresh crater.
    - **Trajectory Segments (`dynSegments`, 8)**: `sc_stardust__5535_annefrank__pos.dyn` (`kind`: `pos`, `parentId`: `5535_annefrank`, `inline`: `true`, `t`: `[89379733.0, 89550209.0]`), `sc_stardust__81p_wild_2__pos.dyn` (`kind`: `pos`, `parentId`: `81p_wild_2`, `inline`: `true`, `t`: `[126009572.0, 126678668.0]`), `sc_stardust__9p_tempel_1__pos.dyn` (`kind`: `pos`, `parentId`: `9p_tempel_1`, `inline`: `true`, `t`: `[350896766.0, 351068113.0]`), `sc_stardust__earth__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[32627842.0, 33120541.0]`), `sc_stardust__earth__flyby2__orb.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[190336290.0, 190866114.0]`), `sc_stardust__earth__flyby3__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[284944970.0, 285742028.0]`), `sc_stardust__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-28304869.3, -28038699.0]`), `sc_stardust__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-28038699.0, 354279666.0]`)
- **`Lunar Missions` (13 spacecraft)**
  - **`Artemis I`** (`sc_artemis_1`): `subcategory`: `Orbiter` | `agency`: `NASA / ESA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `2022` | `featuredEpochUtc`: `null` | `physicalSpanM`: `8.0` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_artemis/artemis_ii.gltf`
    - **Role & Description**: `Uncrewed Orion Lunar Test Flight` — 25.5-day distant retrograde orbit demonstration around the Moon validating Orion heat shield re-entry and European Service Module propulsion.
    - **Highlights**: Set record distance from Earth for a human-rated spacecraft (432,210 km); Deployed 10 secondary CubeSats including BioSentinel
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_artemis_1__earth__pos.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `false`, `t`: `[721860361.0, 724052473.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `60000` km, `e`: `0.15`, `i`: `22.0°`, `Ω`: `45°`, `ω`: `90°`, `M0`: `120°`, `P`: `12.0` d
  - **`Artemis II`** (`sc_artemis_2`): `subcategory`: `Orbiter` | `agency`: `NASA / ESA` | `hostBody`: `Moon` | `status`: `Upcoming` | `activeSpan`: `2026` | `featuredEpochUtc`: `2026-04-06T23:00:00Z` | `physicalSpanM`: `8.0` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_artemis/artemis_ii.gltf`
    - **Role & Description**: `Crewed Orion Lunar Free-Return Mission` — First crewed Orion spacecraft flight with ESA European Service Module, carrying four astronauts on a lunar free-return trajectory beyond the Moon.
    - **Highlights**: Crewed Orion CM + ESA Service Module solar wings; Performs multi-day figure-8 cislunar free-return swing
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_artemis_2__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[828372485.861, 829137247.802]`)
  - **`CAPSTONE`** (`sc_capstone`): `subcategory`: `Orbiter` | `agency`: `NASA / Advanced Space` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `2022–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.8` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_capstone/capstone.gltf`
    - **Role & Description**: `Gateway Lunar Halo Pathfinder CubeSat` — Tested the Near-Rectilinear Halo Orbit (NRHO) around the Moon planned for the future Lunar Gateway station.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_capstone__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[710191748.0, 721583059.0]`), `sc_capstone__moon__orb.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[721583059.0, 835772469.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `36000` km, `e`: `0.9`, `i`: `90.0°`, `Ω`: `12°`, `ω`: `270°`, `M0`: `90°`, `P`: `6.5` d
  - **`Clementine`** (`sc_clementine`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_clementine/clementine.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_clementine__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `false`, `t`: `[-187185539.0, -185065319.0]`), `sc_clementine__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[-185065319.0, -178496940.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1900` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `156°`, `ω`: `0°`, `M0`: `204°`, `P`: `0.082` d
  - **`Danuri (Korea Lunar Pathfinder Orbiter)`** (shortName: `Danuri`) (`sc_danuri`): `subcategory`: `Orbiter` | `agency`: `KARI / NASA` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `2022–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `6.3` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_danuri/danuri.gltf`
    - **Role & Description**: `Korea Pathfinder Lunar Orbiter` — Carries NASA's ultra-sensitive ShadowCam inside permanently shadowed south polar lunar craters to search for frost.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_danuri__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[712929310.0, 724456233.0]`), `sc_danuri__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[724456233.0, 842705148.902]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1837` km, `e`: `0.005`, `i`: `90.0°`, `Ω`: `130°`, `ω`: `0°`, `M0`: `210°`, `P`: `0.082` d
  - **`GRAIL A`** (shortName: `Ebb`) (`sc_grail_a`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_grail/grail_b.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_grail_a__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[368932198.182, 377620394.0]`), `sc_grail_a__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[377620394.0, 414201667.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1900` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `191°`, `ω`: `0°`, `M0`: `49°`, `P`: `0.082` d
  - **`GRAIL B`** (shortName: `Flow`) (`sc_grail_b`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_grail/grail_b.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_grail_b__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[368932198.182, 378599282.0]`), `sc_grail_b__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[378599282.0, 414201667.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1940` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `264°`, `ω`: `0°`, `M0`: `96°`, `P`: `0.082` d
  - **`ISAS`** (`sc_isas`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_clementine/clementine_isas.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1820` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `60°`, `ω`: `0°`, `M0`: `300°`, `P`: `0.082` d
  - **`LADEE`** (shortName: `Lunar Atmosphere and D`) (`sc_ladee`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_ladee/ladee.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_ladee__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[431797927.183, 434289667.0]`), `sc_ladee__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[434203267.0, 451067572.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1820` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `70°`, `ω`: `0°`, `M0`: `50°`, `P`: `0.082` d
  - **`LCROSS`** (shortName: `Lunar Crater Observati`) (`sc_lcross`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_lcross/lcross.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_lcross__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[298635466.03, 308333606.0]`), `sc_lcross__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `true`, `t`: `[308333606.0, 308360202.356]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1980` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `2°`, `ω`: `0°`, `M0`: `238°`, `P`: `0.082` d
  - **`Lunar Flashlight`** (`sc_lunar_flashlight`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_lunar_flashlight/lunar_flashlight.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_lunar_flashlight__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[724019553.584, 737640069.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1860` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `148°`, `ω`: `0°`, `M0`: `332°`, `P`: `0.082` d
  - **`Lunar Prospector`** (`sc_lunar_prospector`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_lunar_prospector/lunar_prospector.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_lunar_prospector__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[-62206800.0, -13402020.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1900` km, `e`: `0.01`, `i`: `88.0°`, `Ω`: `221°`, `ω`: `0°`, `M0`: `19°`, `P`: `0.082` d
  - **`Lunar Reconnaissance Orbiter`** (shortName: `LRO`) (`sc_lunar_reconnaissance_orbiter`): `subcategory`: `Orbiter` | `agency`: `NASA / GSFC` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `2009–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `4.3` m | `colorHex`: `#7fd4ff` | `modelPath`: `sc_lunar_reconnaissance_orbiter/LRO.gltf`
    - **Role & Description**: `High-Resolution Lunar Cartographer` — Mapping the Moon down to sub-meter Apollo landing-site resolution, permanently shadowed polar ice craters, and surface thermal environment since 2009.
    - **Highlights**: LROC camera resolves Apollo Lunar Module descent stages & tracks; LOLA laser altimetry created the gold-standard 3D lunar topography
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_lunar_reconnaissance_orbiter__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[298635426.184, 298929666.0]`), `sc_lunar_reconnaissance_orbiter__moon__orb.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[298929666.0, 895233669.185]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `1800` km, `e`: `0.02`, `i`: `89.5°`, `Ω`: `45°`, `ω`: `0°`, `M0`: `160°`, `P`: `0.081` d
- **`Mars Exploration` (16 spacecraft)**
  - **`ESCAPADE Blue`** (`sc_escapade_blue`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_escapade/escapade.gltf`
    - **Role & Description**: `Mars Orbiter` — NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_escapade_blue__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[816342898.0, 847971260.0]`), `sc_escapade_blue__mars.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[873517951.0, 873981069.183]`), `sc_escapade_blue__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[847971260.0, 873517951.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `9000` km, `e`: `0.32`, `i`: `65.0°`, `Ω`: `70°`, `ω`: `40°`, `M0`: `178°`, `P`: `0.19` d
  - **`ESCAPADE Gold`** (`sc_escapade_gold`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_escapade/escapade.gltf`
    - **Role & Description**: `Mars Orbiter` — NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_escapade_gold__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[816342898.0, 847971260.0]`), `sc_escapade_gold__mars.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[873258326.0, 873808269.183]`), `sc_escapade_gold__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[847971260.0, 873258326.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `9900` km, `e`: `0.32`, `i`: `65.0°`, `Ω`: `125°`, `ω`: `40°`, `M0`: `215°`, `P`: `0.19` d
  - **`InSight`** (`sc_insight`): `subcategory`: `Lander` | `agency`: `NASA / JPL / CNES / DLR` | `hostBody`: `Mars` | `status`: `Completed` | `activeSpan`: `2018–2022` | `featuredEpochUtc`: `null` | `physicalSpanM`: `6.0` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_insight/lander/insight.gltf`
    - **Role & Description**: `Mars Interior Seismic Geophysical Lander` — Anchored in Elysium Planitia for four years, detecting over 1,300 marsquakes and measuring Mars's crust, mantle, and liquid core.
    - **Highlights**: Deployed ultra-sensitive SEIS seismometer directly on regolith; Measured a 1,830 km Martian molten iron-alloy core radius
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_insight__earth__pos.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[578795968.965, 579182469.185]`), `sc_insight__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[596376069.183, 596532613.39]`), `sc_insight__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[579182469.185, 596376069.183]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `4.5024`, `lonDeg`: `135.6234`, `altKm`: `0.008`
  - **`MarCO A`** (`sc_marco_a`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_marco/model.gltf`
    - **Role & Description**: `Mars Orbiter` — NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_marco_a__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[578796051.0, 579182469.185]`), `sc_marco_a__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[596376069.183, 596552080.0]`), `sc_marco_a__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[579182469.185, 596376069.183]`), `sc_marco_a__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[596552080.0, 631152000.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `8100` km, `e`: `0.32`, `i`: `65.0°`, `Ω`: `135°`, `ω`: `40°`, `M0`: `117°`, `P`: `0.19` d
  - **`MarCO B`** (`sc_marco_b`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_marco/model.gltf`
    - **Role & Description**: `Mars Orbiter` — NASA Eyes orbiter mission operating around Mars, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_marco_b__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[578796051.0, 579182469.185]`), `sc_marco_b__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[596376069.183, 596552080.0]`), `sc_marco_b__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[579182469.185, 596376069.183]`), `sc_marco_b__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[596552080.0, 631152000.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `9000` km, `e`: `0.32`, `i`: `65.0°`, `Ω`: `190°`, `ω`: `40°`, `M0`: `154°`, `P`: `0.19` d
  - **`Mars 2020 (Perseverance)`** (shortName: `Perseverance`) (`sc_mars_2020`): `subcategory`: `Rover` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2020–Present` | `featuredEpochUtc`: `2021-02-18T18:00:00Z` | `physicalSpanM`: `3.0` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_2020/rover/perseverance.gltf`
    - **Role & Description**: `Mars Astrobiology Rover (Jezero Crater)` — Nuclear-powered rover exploring Jezero Crater's ancient river delta to search for biosignatures and cache cores for Mars Sample Return.
    - **Highlights**: Landing site: Octavia E. Butler, Jezero Crater (18.38°N, 77.58°E); Carried the Ingenuity Mars Helicopter for 72 extraterrestrial flights; SHERLOC, PIXL, SuperCam & MOXIE oxygen generator
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mars_2020__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[649385564.0, 649595376.0]`), `sc_mars_2020__mars__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[666932224.0, 666952859.0]`), `sc_mars_2020__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[649595376.0, 666932224.0]`)
    - **Attitude Segment (`oriSegment`)**: `sc_mars_2020__quat.dyn` (`kind`: `quat`, `parentId`: `self`, `inline`: `true`, `t`: `[649493421.0, 0.741]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `18.38`, `lonDeg`: `77.58`, `altKm`: `0.008`
  - **`Mars Exploration Rover B (Opportunity)`** (shortName: `Opportunity`) (`sc_mars_exploration_rover_1`): `subcategory`: `Rover` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Completed` | `activeSpan`: `2003–2018` | `featuredEpochUtc`: `null` | `physicalSpanM`: `2.3` m | `colorHex`: `#ff9f7f` | `modelPath`: `sc_mars_exploration_rover/rover/mer_static.gltf`
    - **Role & Description**: `Meridiani Planum Endurance Rover` — Planned for a 90-sol mission, Opportunity drove a marathon 45.16 km across Meridiani Planum over 14 years until the 2018 global dust storm.
    - **Highlights**: Discovered hematite "blueberries" formed in ancient liquid water; Explored Victoria and Endeavour craters over 5,111 Martian sols
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_mars_exploration_rover_1__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[110911022.184, 111234172.0]`), `sc_mars_exploration_rover_1__edl__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[128278419.0, 128278523.336]`), `sc_mars_exploration_rover_1__mars__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[128262836.0, 128278419.0]`), `sc_mars_exploration_rover_1__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[111234172.0, 128262836.0]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `-1.9462`, `lonDeg`: `354.4734`, `altKm`: `0.008`
  - **`Mars Exploration Rover A (Spirit)`** (shortName: `Spirit`) (`sc_mars_exploration_rover_2`): `subcategory`: `Rover` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Completed` | `activeSpan`: `2003–2010` | `featuredEpochUtc`: `null` | `physicalSpanM`: `2.3` m | `colorHex`: `#ff9f7f` | `modelPath`: `sc_mars_exploration_rover/rover/mer_static.gltf`
    - **Role & Description**: `Gusev Crater Mars Exploration Rover` — Traversed Gusev Crater and ascended Husband Hill in the Columbia Hills, discovering silica-rich hydrothermal deposits.
    - **Highlights**: Tracked Mars dust devils and ancient hydrothermal silica; Delivered first panoramas from the summit of Husband Hill
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_mars_exploration_rover_2__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[108541883.184, 108887371.0]`), `sc_mars_exploration_rover_2__edl__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[126462105.0, 126462396.106]`), `sc_mars_exploration_rover_2__mars__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[126444477.0, 126462105.0]`), `sc_mars_exploration_rover_2__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[108887371.0, 126444477.0]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `-14.5684`, `lonDeg`: `175.4726`, `altKm`: `0.008`
  - **`Mars Express`** (`sc_mars_express`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2003–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `12.0` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_express/mars_express.gltf`
    - **Role & Description**: `ESA Polar Stereo Cartographer & Phobos Orbiter` — Producing global full-color 3D topography with HRSC and radar sounding deep subsurface ice beneath Mars's south pole.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mars_express__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[107853140.596, 108232264.0]`), `sc_mars_express__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[125539264.0, 1041422469.184]`), `sc_mars_express__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[108232264.0, 125539264.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `8600` km, `e`: `0.57`, `i`: `86.3°`, `Ω`: `15°`, `ω`: `290°`, `M0`: `30°`, `P`: `0.29` d
  - **`Mars Global Surveyor`** (`sc_mars_global_surveyor`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Completed` | `activeSpan`: `1996–2006` | `featuredEpochUtc`: `null` | `physicalSpanM`: `12.0` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_global_surveyor/mars_global_surveyor.gltf`
    - **Role & Description**: `First MOLA Global Laser Altmeter at Mars` — Built the foundational global laser elevation map (MOLA) used for every modern Martian landing site selection.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mars_global_surveyor__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-99329637.0, -99081876.0]`), `sc_mars_global_surveyor__mars.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[-72717692.0, 215806800.0]`), `sc_mars_global_surveyor__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-99081876.0, -72717692.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `3790` km, `e`: `0.005`, `i`: `92.9°`, `Ω`: `10°`, `ω`: `0°`, `M0`: `190°`, `P`: `0.082` d
  - **`Mars Odyssey`** (`sc_mars_odyssey`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL / ASU` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2001–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `5.8` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_odyssey/mars_odyssey.gltf`
    - **Role & Description**: `Longest-Operating Mars Spacecraft` — Mapped widespread hydrogen and shallow polar water ice across Mars since 2001 and serves as the longest-lived orbiter at any world beyond Earth.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mars_odyssey__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[39932700.0, 40233664.0]`), `sc_mars_odyssey__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[57128464.0, 917870400.0]`), `sc_mars_odyssey__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[40233664.0, 57128464.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `3790` km, `e`: `0.005`, `i`: `93.1°`, `Ω`: `160°`, `ω`: `0°`, `M0`: `240°`, `P`: `0.082` d
  - **`Mars Reconnaissance Orbiter`** (shortName: `MRO`) (`sc_mars_reconnaissance_orbiter`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2005–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `13.6` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_reconnaissance_orbiter/MRO.gltf`
    - **Role & Description**: `High-Resolution Mars Imager & Relay Orbiter` — Carries the telescopic HiRISE camera (25 cm/pixel on Mars) and SHARAD ground-penetrating radar while relaying rover telemetry.
    - **Highlights**: HiRISE captured Perseverance & Curiosity hanging under supersonic parachutes; Primary deep-space communications relay for Mars surface missions
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mars_reconnaissance_orbiter__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[177122516.0, 177429664.0]`), `sc_mars_reconnaissance_orbiter__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[195285665.0, 858130080.0]`), `sc_mars_reconnaissance_orbiter__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[177429664.0, 195285665.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `3680` km, `e`: `0.006`, `i`: `92.7°`, `Ω`: `70°`, `ω`: `0°`, `M0`: `80°`, `P`: `0.078` d
  - **`Mars Science Laboratory (Curiosity)`** (shortName: `Curiosity`) (`sc_mars_science_laboratory`): `subcategory`: `Rover` | `agency`: `NASA / JPL` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2011–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.0` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_mars_science_laboratory/rover/curiosity_static.gltf`
    - **Role & Description**: `Gale Crater Mars Science Rover` — Climbing the layered slopes of Aeolis Mons (Mount Sharp) in Gale Crater since August 2012, uncovering billion-year-old habitable lakebeds.
    - **Highlights**: Landing site: Aeolis Palus, Gale Crater (4.59°S, 137.44°E); MMRTG plutonium generator & ChemCam laser spectrometer; Ascended more than 800 vertical meters up Mount Sharp
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_mars_science_laboratory__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[375594733.0, 376039259.0]`), `sc_mars_science_laboratory__edl__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[397501373.0, 397502386.831]`), `sc_mars_science_laboratory__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[397477501.0, 397501373.0]`), `sc_mars_science_laboratory__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[376039259.0, 397477501.0]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `-4.5895`, `lonDeg`: `137.4417`, `altKm`: `0.008`
  - **`MAVEN`** (`sc_maven`): `subcategory`: `Orbiter` | `agency`: `NASA / LASP / GSFC` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2013–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `11.4` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_maven/Maven.gltf`
    - **Role & Description**: `Mars Atmosphere & Volatile Evolution Probe` — Measures how the solar wind stripped Mars's thick ancient atmosphere into space, turning a wet world arid.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_maven__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[438074509.343, 438296467.0]`), `sc_maven__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[464590867.0, 829709700.0]`), `sc_maven__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[438296467.0, 464590867.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `5750` km, `e`: `0.38`, `i`: `75.0°`, `Ω`: `220°`, `ω`: `45°`, `M0`: `110°`, `P`: `0.146` d
  - **`Phoenix`** (`sc_phoenix`): `subcategory`: `Lander` | `agency`: `NASA / UArizona` | `hostBody`: `Mars` | `status`: `Completed` | `activeSpan`: `2007–2008` | `featuredEpochUtc`: `null` | `physicalSpanM`: `5.5` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_phoenix/edl/phoenix_edl.gltf`
    - **Role & Description**: `North Polar Mars Subsurface Ice Lander` — Touched down in Vastitas Borealis at 68.2°N, scraping away soil to photograph exposed bright water ice inches beneath the surface.
    - **Highlights**: Observed Martian snowfall via LIDAR atmospheric laser; Confirmed alkaline regolith containing calcium carbonate & perchlorate
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_phoenix__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[239496427.0, 239618121.0]`), `sc_phoenix__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `true`, `t`: `[265008306.0, 265030318.0]`), `sc_phoenix__phx_topo__pos.dyn` (`kind`: `pos`, `parentId`: `mars`, `inline`: `true`, `t`: `[265030318.0, 265030769.0]`), `sc_phoenix__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[239618121.0, 265008306.0]`)
    - **Surface Site (`surfaceSite`)**: `body`: `Mars`, `latDeg`: `68.2188`, `lonDeg`: `234.2508`, `altKm`: `0.008`
  - **`Trace Gas Orbiter`** (`sc_trace_gas_orbiter`): `subcategory`: `Orbiter` | `agency`: `ESA / ExoMars` | `hostBody`: `Mars` | `status`: `Active` | `activeSpan`: `2016–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `17.5` m | `colorHex`: `#ff8e66` | `modelPath`: `sc_trace_gas_orbiter/TGO.gltf`
    - **Role & Description**: `Mars Atmospheric Methane & Water Mapper` — Surveys trace atmospheric gases and hydrogen-rich equatorial regions from a 400 km circular Martian orbit.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_trace_gas_orbiter__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[511257268.0, 511941668.0]`), `sc_trace_gas_orbiter__mars__orb.dyn` (`kind`: `orb`, `parentId`: `mars`, `inline`: `false`, `t`: `[530107268.0, 1231007499.184]`), `sc_trace_gas_orbiter__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[511941668.0, 530107268.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mars`, `a`: `3790` km, `e`: `0.005`, `i`: `74.0°`, `Ω`: `300°`, `ω`: `0°`, `M0`: `15°`, `P`: `0.082` d
- **`Solar & Heliophysics` (34 spacecraft)**
  - **`ACE`** (`sc_ace`): `subcategory`: `Orbiter` | `agency`: `NASA / Caltech` | `hostBody`: `Sun-Earth L1` | `status`: `Active` | `activeSpan`: `1997–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `4.1` m | `colorHex`: `#ffd166` | `modelPath`: `sc_ace/ace.gltf`
    - **Role & Description**: `Solar Wind & Cosmic Ray Sampler at L1` — Measures energetic particles from the solar wind, interplanetary medium, and galactic cosmic rays upstream of Earth at Sun-Earth L1.
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `310000`, `periodDays`: `177.0`, `phaseDeg`: `110.0`
  - **`Rumba`** (`sc_cluster_ii_fm5`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_cluster_ii/cluster_ii.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `58000` km, `e`: `0.72`, `i`: `70.0°`, `Ω`: `134°`, `ω`: `120°`, `M0`: `278°`, `P`: `1.8` d
  - **`Salsa`** (`sc_cluster_ii_fm6`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_cluster_ii/cluster_ii.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `22.0°`, `Ω`: `195°`, `ω`: `120°`, `M0`: `15°`, `P`: `1.0` d
  - **`Samba`** (`sc_cluster_ii_fm7`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_cluster_ii/cluster_ii.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42000` km, `e`: `0.72`, `i`: `34.0°`, `Ω`: `256°`, `ω`: `120°`, `M0`: `112°`, `P`: `1.4` d
  - **`Tango`** (`sc_cluster_ii_fm8`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_cluster_ii/cluster_ii.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `50000` km, `e`: `0.72`, `i`: `46.0°`, `Ω`: `317°`, `ω`: `120°`, `M0`: `209°`, `P`: `1.8` d
  - **`DSCOVR`** (`sc_dscovr`): `subcategory`: `Orbiter` | `agency`: `NOAA / NASA` | `hostBody`: `Sun-Earth L1` | `status`: `Active` | `activeSpan`: `2015–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `4.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_dscovr/dscovr.gltf`
    - **Role & Description**: `Space Weather Monitor & Sunlit Earth EPIC` — Hovers 1.5 million km sunward at L1 providing early geomagnetic storm warnings while capturing full-disk sunlit Earth imagery.
    - **Highlights**: Continuous sunlit Earth full-disk telemetry via EPIC camera; Real-time L1 solar wind alerts 15–60 min before Earth arrival
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_dscovr__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[476970068.0, 1062460869.183]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `260000`, `periodDays`: `176.0`, `phaseDeg`: `200.0`
  - **`Geotail`** (`sc_geotail`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_geotail/geotail.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_geotail__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[-234758764.589, 722891591.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `50000` km, `e`: `0.72`, `i`: `34.0°`, `Ω`: `341°`, `ω`: `120°`, `M0`: `17°`, `P`: `1.8` d
  - **`IBEX`** (`sc_ibex`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_ibex/iBEX.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_ibex__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[277712672.0, 964549896.457]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `180000` km, `e`: `0.78`, `i`: `12.0°`, `Ω`: `353°`, `ω`: `120°`, `M0`: `101°`, `P`: `11.0` d
  - **`IMAGE`** (`sc_image`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_image/image.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `22.0°`, `Ω`: `115°`, `ω`: `120°`, `M0`: `295°`, `P`: `1.4` d
  - **`IMAP`** (`sc_imap`): `subcategory`: `Orbiter` | `agency`: `NASA / Princeton` | `hostBody`: `Sun-Earth L1` | `status`: `Upcoming` | `activeSpan`: `2025–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.5` m | `colorHex`: `#ffd166` | `modelPath`: `sc_imap/imap.gltf`
    - **Role & Description**: `Interstellar Boundary & Heliosphere Mapper` — Spin-stabilized L1 spacecraft imaging energetic neutral atoms from the boundary where the Sun's solar wind meets interstellar space.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_imap__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[811985639.0, 897150237.762]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `350000`, `periodDays`: `177.0`, `phaseDeg`: `15.0`
  - **`Magellan`** (`sc_magellan`): `subcategory`: `Orbiter` | `agency`: `NASA / JPL` | `hostBody`: `Venus` | `status`: `Completed` | `activeSpan`: `1989–1994` | `featuredEpochUtc`: `null` | `physicalSpanM`: `6.4` m | `colorHex`: `#ffb74d` | `modelPath`: `sc_magellan/magellan.gltf`
    - **Role & Description**: `Venus Cloud-Piercing SAR Radar Mapper` — Peered beneath Venus's sulfuric acid cloud deck with synthetic-aperture radar to map 98% of the planetary surface.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_magellan__venus__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `false`, `t`: `[-295884037.751, -164631538.818]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Venus`, `a`: `6550` km, `e`: `0.05`, `i`: `85.5°`, `Ω`: `140°`, `ω`: `20°`, `M0`: `65°`, `P`: `0.066` d
  - **`MESSENGER`** (`sc_messenger`): `subcategory`: `Orbiter` | `agency`: `NASA / JHUAPL` | `hostBody`: `Mercury` | `status`: `Completed` | `activeSpan`: `2004–2015` | `featuredEpochUtc`: `2012-06-01T00:00:00Z` | `physicalSpanM`: `6.0` m | `colorHex`: `#ffb74d` | `modelPath`: `sc_messenger/Messenger.gltf`
    - **Role & Description**: `First Spacecraft to Orbit Mercury` — Braved 11× solar intensity behind a ceramic shade to map Mercury globally and confirm shadowed water ice at its north pole.
    - **Trajectory Segments (`dynSegments`, 15)**: `sc_messenger__earth__flyby__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[175801890.0, 176659095.0]`), `sc_messenger__earth__launch__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[144789279.393, 145066469.0]`), `sc_messenger__mercury__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `mercury`, `inline`: `true`, `t`: `[253547108.0, 253671753.0]`), `sc_messenger__mercury__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `mercury`, `inline`: `true`, `t`: `[276485360.0, 276627276.0]`), `sc_messenger__mercury__flyby3__orb.dyn` (`kind`: `orb`, `parentId`: `mercury`, `inline`: `true`, `t`: `[307423681.0, 307651285.0]`), `sc_messenger__mercury__orb.dyn` (`kind`: `orb`, `parentId`: `mercury`, `inline`: `false`, `t`: `[353474040.0, 483694028.351]`), `sc_messenger__sun__1__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[145066469.0, 175801890.0]`), `sc_messenger__sun__2__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[176659095.0, 214828942.0]`), `sc_messenger__sun__3__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[215033751.0, 234289415.0]`), `sc_messenger__sun__4__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[234436749.0, 253547108.0]`), `sc_messenger__sun__5__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[253671753.0, 276485360.0]`), `sc_messenger__sun__6__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[276627276.0, 307423681.0]`), `sc_messenger__sun__7__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[307651285.0, 353474040.0]`), `sc_messenger__venus__flyby1__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[214828942.0, 215033751.0]`), `sc_messenger__venus__flyby2__orb.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[234289415.0, 234436749.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Mercury`, `a`: `9200` km, `e`: `0.72`, `i`: `82.5°`, `Ω`: `45°`, `ω`: `110°`, `M0`: `30°`, `P`: `0.5` d
  - **`MMS 1`** (`sc_mms_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_mms/MMS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `22.0°`, `Ω`: `35°`, `ω`: `120°`, `M0`: `215°`, `P`: `1.8` d
  - **`MMS 2`** (`sc_mms_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_mms/MMS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42000` km, `e`: `0.72`, `i`: `34.0°`, `Ω`: `96°`, `ω`: `120°`, `M0`: `312°`, `P`: `1.0` d
  - **`MMS 3`** (`sc_mms_3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_mms/MMS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `50000` km, `e`: `0.72`, `i`: `46.0°`, `Ω`: `157°`, `ω`: `120°`, `M0`: `49°`, `P`: `1.4` d
  - **`MMS 4`** (`sc_mms_4`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_mms/MMS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `58000` km, `e`: `0.72`, `i`: `58.0°`, `Ω`: `218°`, `ω`: `120°`, `M0`: `146°`, `P`: `1.8` d
  - **`Parker Solar Probe`** (`sc_parker_solar_probe`): `subcategory`: `Orbiter` | `agency`: `NASA / JHUAPL` | `hostBody`: `Sun` | `status`: `Active` | `activeSpan`: `2018–Present` | `featuredEpochUtc`: `2024-12-24T11:53:00Z` | `physicalSpanM`: `3.0` m | `colorHex`: `#ffb74d` | `modelPath`: `sc_parker_solar_probe/PSP.gltf`
    - **Role & Description**: `Coronal "Touch the Sun" Helioprobe` — Skims inside the Sun's corona within 6.1 million km of the photosphere behind a 11.4 cm carbon-composite heat shield at 690,000 km/h.
    - **Highlights**: Fastest spacecraft ever built (~192 km/s at perihelion); 7 Venus gravity assists progressively shrink perihelion; Actively water-cooled solar panels & FIELDS/WISPR corona suite
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_parker_solar_probe__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[587333783.343, 587454078.0]`), `sc_parker_solar_probe__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[587454078.0, 936187269.183]`)
  - **`Polar`** (`sc_polar`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_polar/polar.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_polar__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[-121504384.0, 262694890.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `22.0°`, `Ω`: `175°`, `ω`: `120°`, `M0`: `355°`, `P`: `1.4` d
  - **`Van Allen Probe A`** (`sc_rbsp_a`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_rbsp/rbsp.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `50000` km, `e`: `0.72`, `i`: `34.0°`, `Ω`: `181°`, `ω`: `120°`, `M0`: `217°`, `P`: `1.4` d
  - **`Van Allen Probe B`** (`sc_rbsp_b`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_rbsp/rbsp.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `58000` km, `e`: `0.72`, `i`: `46.0°`, `Ω`: `242°`, `ω`: `120°`, `M0`: `314°`, `P`: `1.8` d
  - **`Solar Dynamics Observatory`** (shortName: `SDO`) (`sc_sdo`): `subcategory`: `Orbiter` | `agency`: `NASA / GSFC` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `2010–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `4.5` m | `colorHex`: `#ffd166` | `modelPath`: `sc_sdo/sdo.gltf`
    - **Role & Description**: `Continuous Full-Disk Solar Observatory` — Monitors the Sun's churning magnetic field, extreme-UV corona, and solar flares in real time from an inclined geosynchronous orbit.
    - **Highlights**: 4K-resolution AIA EUV solar imaging every 12 seconds; HMI helioseismology tracks interior plasma flows and sunspots
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0002`, `i`: `28.5°`, `Ω`: `95°`, `ω`: `10°`, `M0`: `140°`, `P`: `0.997` d
  - **`SOHO`** (`sc_soho`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `Sun-Earth L1` | `status`: `Active` | `activeSpan`: `1995–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `9.5` m | `colorHex`: `#ffd166` | `modelPath`: `sc_soho/soho.gltf`
    - **Role & Description**: `L1 Solar & Heliospheric Watchdog` — Operating continuously since 1995 at Sun-Earth L1, watching coronal mass ejections while inadvertently becoming history's greatest comet discoverer (5,000+ comets).
    - **Highlights**: LASCO coronagraph spots oncoming Earth-directed CMEs; Discovered more than 5,000 sungrazing comets
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `620000`, `periodDays`: `178.0`, `phaseDeg`: `80.0`
  - **`SOLAR-1`** (`sc_solar_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Sun-Earth L1` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_solar_1/swfo.gltf`
    - **Role & Description**: `Sun-Earth L1 Orbiter` — NASA Eyes orbiter mission operating around Sun-Earth L1, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_solar_1__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[811990990.0, 884088069.184]`)
    - **Lagrange Halo (`lagrangeHalo`)**: `point`: `L1`, `amplitudeKm`: `390000`, `periodDays`: `179.0`, `phaseDeg`: `225.0`
  - **`SORCE`** (`sc_sorce`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_sorce/sorce.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6991` km, `e`: `0.0002`, `i`: `40.0°`, `Ω`: `276°`, `ω`: `0°`, `M0`: `12°`, `P`: `0.0686` d
  - **`STEREO Ahead`** (shortName: `STEREO-A`) (`sc_stereo_ahead`): `subcategory`: `Orbiter` | `agency`: `NASA / JHUAPL` | `hostBody`: `Sun` | `status`: `Active` | `activeSpan`: `2006–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `6.4` m | `colorHex`: `#ffd166` | `modelPath`: `sc_stereo_ahead/stereo_a.gltf`
    - **Role & Description**: `Solar Stereoscopic Ahead Observatory` — Orbits ahead of Earth at ~1 AU to provide 3D stereoscopic views of coronal mass ejections erupting from the Sun.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_stereo_ahead__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[215097110.0, 221418192.0]`), `sc_stereo_ahead__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[221418192.0, 1027684869.183]`)
  - **`STEREO Behind`** (shortName: `STEREO-B`) (`sc_stereo_behind`): `subcategory`: `Orbiter` | `agency`: `NASA / JHUAPL` | `hostBody`: `Sun` | `status`: `Completed` | `activeSpan`: `2006–2014` | `featuredEpochUtc`: `null` | `physicalSpanM`: `6.4` m | `colorHex`: `#ffd166` | `modelPath`: `sc_stereo_behind/stereo_b.gltf`
    - **Role & Description**: `Solar Stereoscopic Behind Observatory` — Twin of STEREO-A drifting behind Earth at ~1 AU, completing full 360° monitoring of solar magnetic storms.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_stereo_behind__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[215097110.0, 224468337.0]`), `sc_stereo_behind__sun__orb.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[224468337.0, 527860868.182]`)
  - **`Sunrise`** (`sc_sunrise`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_sunrise/sunrise.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6991` km, `e`: `0.0002`, `i`: `80.0°`, `Ω`: `29°`, `ω`: `0°`, `M0`: `73°`, `P`: `0.0686` d
  - **`THEMIS-A`** (`sc_themis_a`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_themis/themis.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `70.0°`, `Ω`: `339°`, `ω`: `120°`, `M0`: `303°`, `P`: `1.0` d
  - **`ARTEMIS P1`** (`sc_themis_b`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_themis/themis.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_themis_b__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[225029706.0, 362424822.0]`), `sc_themis_b__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[362424822.0, 894024069.185]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `14000` km, `e`: `0.55`, `i`: `20.0°`, `Ω`: `7200°`, `ω`: `0°`, `M0`: `11200°`, `P`: `1.1` d
  - **`ARTEMIS P2`** (`sc_themis_c`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Moon` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_themis/themis.gltf`
    - **Role & Description**: `Moon Orbiter` — NASA Eyes orbiter mission operating around Moon, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_themis_c__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[225029706.0, 364189900.0]`), `sc_themis_c__moon.dyn` (`kind`: `orb`, `parentId`: `moon`, `inline`: `false`, `t`: `[364189900.0, 894024069.185]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Moon`, `a`: `14000` km, `e`: `0.55`, `i`: `20.0°`, `Ω`: `7245°`, `ω`: `0°`, `M0`: `11270°`, `P`: `1.1` d
  - **`THEMIS-D`** (`sc_themis_d`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_themis/themis.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `58000` km, `e`: `0.72`, `i`: `46.0°`, `Ω`: `162°`, `ω`: `120°`, `M0`: `234°`, `P`: `1.0` d
  - **`THEMIS-E`** (`sc_themis_e`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_themis/themis.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `66000` km, `e`: `0.72`, `i`: `58.0°`, `Ω`: `223°`, `ω`: `120°`, `M0`: `331°`, `P`: `1.4` d
  - **`Ulysses`** (`sc_ulysses`): `subcategory`: `Orbiter` | `agency`: `ESA / NASA` | `hostBody`: `Sun` | `status`: `Completed` | `activeSpan`: `1990–2009` | `featuredEpochUtc`: `1994-09-13T00:00:00Z` | `physicalSpanM`: `11.4` m | `colorHex`: `#ffd166` | `modelPath`: `sc_ulysses/ulysses.gltf`
    - **Role & Description**: `Solar Polar Inclination Explorer` — Slung around Jupiter in 1992 into an 80° polar orbit over the Sun's uncharted north and south poles.
    - **Trajectory Segments (`dynSegments`, 4)**: `sc_ulysses__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-291488100.0, -291393201.0]`), `sc_ulysses__jupiter.dyn` (`kind`: `orb`, `parentId`: `jupiter`, `inline`: `true`, `t`: `[-249645790.0, -248519090.0]`), `sc_ulysses__sun__1.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-291393201.0, -249645790.0]`), `sc_ulysses__sun__2.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-248519090.0, 299678465.184]`)
  - **`WIND`** (`sc_wind`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#ffd166` | `modelPath`: `sc_wind/wind.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_wind__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[543931270.0, 1018958469.186]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `180000` km, `e`: `0.78`, `i`: `12.0°`, `Ω`: `174°`, `ω`: `120°`, `M0`: `318°`, `P`: `11.0` d
- **`Earth Observation & Stations` (74 spacecraft)**
  - **`ACRIMSAT`** (`sc_acrimsat`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_acrimsat/acrimsat.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `43°`, `ω`: `0°`, `M0`: `71°`, `P`: `0.0686` d
  - **`ACS3`** (`sc_acs3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_acs3/acs3.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `86°`, `ω`: `0°`, `M0`: `142°`, `P`: `0.0686` d
  - **`Aqua`** (`sc_aqua`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_aqua/Aqua.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7076` km, `e`: `0.0001`, `i`: `98.2°`, `Ω`: `200°`, `ω`: `0°`, `M0`: `42°`, `P`: `0.0686` d
  - **`Aura`** (`sc_aura`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_aura/Aura.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7076` km, `e`: `0.0001`, `i`: `98.2°`, `Ω`: `200°`, `ω`: `0°`, `M0`: `84°`, `P`: `0.0686` d
  - **`CALIPSO`** (`sc_calipso`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_calipso/calipso.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7076` km, `e`: `0.0001`, `i`: `98.2°`, `Ω`: `200°`, `ω`: `0°`, `M0`: `112°`, `P`: `0.0686` d
  - **`CloudSat`** (`sc_cloudsat`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cloudsat/CloudSat.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7076` km, `e`: `0.0001`, `i`: `98.2°`, `Ω`: `200°`, `ω`: `0°`, `M0`: `182°`, `P`: `0.0686` d
  - **`CYGNSS 1`** (`sc_cygnss_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `54°`, `ω`: `0°`, `M0`: `198°`, `P`: `0.0686` d
  - **`CYGNSS 2`** (`sc_cygnss_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `97°`, `ω`: `0°`, `M0`: `269°`, `P`: `0.0686` d
  - **`CYGNSS 3`** (`sc_cygnss_3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `140°`, `ω`: `0°`, `M0`: `340°`, `P`: `0.0686` d
  - **`CYGNSS 4`** (`sc_cygnss_4`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `183°`, `ω`: `0°`, `M0`: `51°`, `P`: `0.0686` d
  - **`CYGNSS 5`** (`sc_cygnss_5`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `226°`, `ω`: `0°`, `M0`: `122°`, `P`: `0.0686` d
  - **`CYGNSS 6`** (`sc_cygnss_6`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `269°`, `ω`: `0°`, `M0`: `193°`, `P`: `0.0686` d
  - **`CYGNSS 7`** (`sc_cygnss_7`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `312°`, `ω`: `0°`, `M0`: `264°`, `P`: `0.0686` d
  - **`CYGNSS 8`** (`sc_cygnss_8`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_cygnss/CYGNSS.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `355°`, `ω`: `0°`, `M0`: `335°`, `P`: `0.0686` d
  - **`EO-1`** (shortName: `Earth Observing-1`) (`sc_eo_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_eo_1/eo-1.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7121` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `339°`, `ω`: `0°`, `M0`: `183°`, `P`: `0.0686` d
  - **`Explorer 1`** (`sc_explorer_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_explorer_1_v2/explorer_1.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_explorer_1__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[-1322726967.0, -939025103.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `194°`, `ω`: `0°`, `M0`: `178°`, `P`: `0.0686` d
  - **`GPM`** (shortName: `Global Precipitation M`) (`sc_gpm`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_gpm/GPM.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `6°`, `ω`: `0°`, `M0`: `102°`, `P`: `0.0686` d
  - **`GRACE-1`** (`sc_grace_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_grace/grace.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_grace_1__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[69656411.097, 562382552.259]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `49°`, `ω`: `0°`, `M0`: `173°`, `P`: `0.0686` d
  - **`GRACE-2`** (`sc_grace_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_grace/grace.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_grace_2__earth__orb.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[69656411.097, 562382552.259]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `92°`, `ω`: `0°`, `M0`: `244°`, `P`: `0.0686` d
  - **`GRACE-FO1`** (shortName: `GRACE Follow-On`) (`sc_grace_fo1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_grace_fo/graceFO.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7121` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `135°`, `ω`: `0°`, `M0`: `315°`, `P`: `0.0686` d
  - **`GRACE-FO2`** (shortName: `GRACE Follow-On`) (`sc_grace_fo2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_grace_fo/graceFO.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7141` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `178°`, `ω`: `0°`, `M0`: `26°`, `P`: `0.0686` d
  - **`GRIFEX`** (`sc_grifex`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_grifex/grifex.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `307°`, `ω`: `0°`, `M0`: `239°`, `P`: `0.0686` d
  - **`Hyspiri`** (`sc_hyspiri`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_hyspiri/HyspIRI.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7141` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `76°`, `ω`: `0°`, `M0`: `92°`, `P`: `0.0686` d
  - **`ICESat-2`** (`sc_icesat_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_icesatii/ICESat2.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `162°`, `ω`: `0°`, `M0`: `234°`, `P`: `0.0686` d
  - **`IPEX`** (`sc_ipex`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_ipex/IPEX.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `17°`, `ω`: `0°`, `M0`: `229°`, `P`: `0.0686` d
  - **`International Space Station`** (shortName: `ISS`) (`sc_iss`): `subcategory`: `Orbiter` | `agency`: `NASA / Roscosmos / ESA / JAXA / CSA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `1998–Present` | `featuredEpochUtc`: `null` | `physicalSpanM`: `109.0` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_iss/ISS_stationary.gltf`
    - **Role & Description**: `Orbital Research Laboratory & Crew Habitat` — Humankind's largest modular orbital outpost, circling Earth 16 times a day in a 51.6° low-Earth orbit at 415 km altitude.
    - **Highlights**: 109 m integrated truss & solar arrays; Zarya, Unity, Destiny, Harmony, Tranquility & Cupola; Host for ECOSTRESS, EMIT, OCO-3 & COWVR instruments
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6791` km, `e`: `0.0005`, `i`: `51.64°`, `Ω`: `120°`, `ω`: `40°`, `M0`: `0°`, `P`: `0.0644` d
  - **`Jason-1`** (`sc_jason_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_ostm/ostm.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_jason_1__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `false`, `t`: `[61013725.0, 425835792.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7707` km, `e`: `0.0002`, `i`: `66.0°`, `Ω`: `189°`, `ω`: `0°`, `M0`: `153°`, `P`: `0.0686` d
  - **`Jason-2/OSTM`** (shortName: `OSTM`) (`sc_jason_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_ostm/ostm.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7707` km, `e`: `0.0002`, `i`: `66.0°`, `Ω`: `232°`, `ω`: `0°`, `M0`: `224°`, `P`: `0.0686` d
  - **`Jason-3`** (`sc_jason_3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_ostm/ostm.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7707` km, `e`: `0.0002`, `i`: `66.0°`, `Ω`: `275°`, `ω`: `0°`, `M0`: `295°`, `P`: `0.0686` d
  - **`Landsat 7`** (`sc_landsat_7`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_landsat_7/LandSat7.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `173°`, `ω`: `0°`, `M0`: `1°`, `P`: `0.0686` d
  - **`Landsat 8`** (`sc_landsat_8`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_landsat_8/LandSat8.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `216°`, `ω`: `0°`, `M0`: `72°`, `P`: `0.0686` d
  - **`Landsat 9`** (`sc_landsat_9`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_landsat_9/Landsat9.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `259°`, `ω`: `0°`, `M0`: `143°`, `P`: `0.0686` d
  - **`M Cubed`** (`sc_m_cubed`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_m_cubed/mCubed.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `157°`, `ω`: `0°`, `M0`: `209°`, `P`: `0.0686` d
  - **`Mariner 2`** (`sc_mariner_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_mariner_2/mariner2.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 3)**: `sc_mariner_2__earth.dyn` (`kind`: `orb`, `parentId`: `earth`, `inline`: `true`, `t`: `[-1178599200.0, -1178199300.0]`), `sc_mariner_2__sun.dyn` (`kind`: `orb`, `parentId`: `sun`, `inline`: `true`, `t`: `[-1178199300.0, -1169206910.0]`), `sc_mariner_2__venus.dyn` (`kind`: `orb`, `parentId`: `venus`, `inline`: `true`, `t`: `[-1169206910.0, -1167652800.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `329°`, `ω`: `0°`, `M0`: `133°`, `P`: `0.0686` d
  - **`MCubed-2`** (`sc_mcubed_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_mcubed_2/M-Cubed2.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7121` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `39°`, `ω`: `0°`, `M0`: `123°`, `P`: `0.0686` d
  - **`NISAR`** (`sc_nisar`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_nisar/Nisar.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `66°`, `ω`: `0°`, `M0`: `42°`, `P`: `0.0686` d
  - **`Noaa 20`** (`sc_noaa_20`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_noaa_20/noaa20.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `109°`, `ω`: `0°`, `M0`: `113°`, `P`: `0.0686` d
  - **`Noaa 21`** (`sc_noaa_21`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_noaa_21/noaa21.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `152°`, `ω`: `0°`, `M0`: `184°`, `P`: `0.0686` d
  - **`OCO-2`** (shortName: `Orbiting Carbon Observ`) (`sc_oco_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_oco_2/oco2.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7076` km, `e`: `0.0001`, `i`: `98.2°`, `Ω`: `200°`, `ω`: `0°`, `M0`: `44°`, `P`: `0.0686` d
  - **`OSIRIS-REx Sample Return Capsule`** (shortName: `ORX SRC`) (`sc_osiris_rex_src`): `subcategory`: `Flyby` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_osiris_rex_v2/src/osiris_rex_heatshield.gltf`
    - **Role & Description**: `Earth Flyby` — NASA Eyes flyby mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 2)**: `sc_osiris_rex_src__earth.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[748832190.0, 748839215.0]`), `sc_osiris_rex_src__sc_osiris_rex.dyn` (`kind`: `pos`, `parentId`: `sc_osiris_rex`, `inline`: `true`, `t`: `[748824183.986, 748832190.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `324°`, `ω`: `0°`, `M0`: `108°`, `P`: `0.0686` d
  - **`PACE`** (shortName: `Plankton, Aerosol, Clo`) (`sc_pace`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_pace/pace.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `7°`, `ω`: `0°`, `M0`: `179°`, `P`: `0.0686` d
  - **`PREFIRE-1`** (`sc_prefire_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_prefire/prefire.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `308°`, `ω`: `0°`, `M0`: `316°`, `P`: `0.0686` d
  - **`PREFIRE-2`** (`sc_prefire_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_prefire/prefire.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7121` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `351°`, `ω`: `0°`, `M0`: `27°`, `P`: `0.0686` d
  - **`QuikSCAT`** (`sc_quikscat`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_quikscat/QuikSCAT.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `77°`, `ω`: `0°`, `M0`: `169°`, `P`: `0.0686` d
  - **`RainCube`** (`sc_raincube`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_raincube/Raincube.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `120°`, `ω`: `0°`, `M0`: `240°`, `P`: `0.0686` d
  - **`Aquarius`** (`sc_sac_d`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_sac_d/aquarius.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `335°`, `ω`: `0°`, `M0`: `235°`, `P`: `0.0686` d
  - **`Sentinel-6 Michael Freilich`** (shortName: `Sentinel-6 Michael Fre`) (`sc_sentinel_6`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_sentinel_6/Sentinel6.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7707` km, `e`: `0.0002`, `i`: `66.0°`, `Ω`: `61°`, `ω`: `0°`, `M0`: `17°`, `P`: `0.0686` d
  - **`Sentinel-6B`** (`sc_sentinel_6b`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_sentinel_6/Sentinel6.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7707` km, `e`: `0.0002`, `i`: `66.0°`, `Ω`: `104°`, `ω`: `0°`, `M0`: `88°`, `P`: `0.0686` d
  - **`SMAP`** (shortName: `Soil Moisture Active P`) (`sc_smap`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_smap/SMAP.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7121` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `147°`, `ω`: `0°`, `M0`: `159°`, `P`: `0.0686` d
  - **`Stardust Sample Return Capsule`** (shortName: `Stardust Sample Return`) (`sc_stardust_src`): `subcategory`: `Flyby` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_stardust_src/stardust_capsule.gltf`
    - **Role & Description**: `Earth Flyby` — NASA Eyes flyby mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Trajectory Segments (`dynSegments`, 1)**: `sc_stardust_src__earth__pos.dyn` (`kind`: `pos`, `parentId`: `earth`, `inline`: `true`, `t`: `[190576755.185, 190591500.0]`)
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7141` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `88°`, `ω`: `0°`, `M0`: `296°`, `P`: `0.0686` d
  - **`Starling-1`** (`sc_starling_1`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_starling/starling.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `131°`, `ω`: `0°`, `M0`: `7°`, `P`: `0.0686` d
  - **`Starling-2`** (`sc_starling_2`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_starling/starling.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `174°`, `ω`: `0°`, `M0`: `78°`, `P`: `0.0686` d
  - **`Starling-3`** (`sc_starling_3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_starling/starling.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `217°`, `ω`: `0°`, `M0`: `149°`, `P`: `0.0686` d
  - **`Starling-4`** (`sc_starling_4`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `1.2` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_starling/starling.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `260°`, `ω`: `0°`, `M0`: `220°`, `P`: `0.0686` d
  - **`Suomi NPP`** (`sc_suomi_npp`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_npp/NPP.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `72°`, `ω`: `0°`, `M0`: `144°`, `P`: `0.0686` d
  - **`SWOT`** (`sc_swot`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_swot_v2/swot.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `115°`, `ω`: `0°`, `M0`: `215°`, `P`: `0.0686` d
  - **`TDRS-10`** (`sc_tdrs_10`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `42°`, `ω`: `0°`, `M0`: `238°`, `P`: `0.997` d
  - **`TDRS-11`** (`sc_tdrs_11`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `99°`, `ω`: `0°`, `M0`: `321°`, `P`: `0.997` d
  - **`TDRS-12`** (`sc_tdrs_12`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `156°`, `ω`: `0°`, `M0`: `44°`, `P`: `0.997` d
  - **`TDRS-13`** (`sc_tdrs_13`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `213°`, `ω`: `0°`, `M0`: `127°`, `P`: `0.997` d
  - **`TDRS-3`** (`sc_tdrs_3`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `270°`, `ω`: `0°`, `M0`: `210°`, `P`: `0.997` d
  - **`TDRS-5`** (`sc_tdrs_5`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `327°`, `ω`: `0°`, `M0`: `293°`, `P`: `0.997` d
  - **`TDRS-6`** (`sc_tdrs_6`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `24°`, `ω`: `0°`, `M0`: `16°`, `P`: `0.997` d
  - **`TDRS-7`** (`sc_tdrs_7`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `81°`, `ω`: `0°`, `M0`: `99°`, `P`: `0.997` d
  - **`TDRS-8`** (`sc_tdrs_8`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `138°`, `ω`: `0°`, `M0`: `182°`, `P`: `0.997` d
  - **`TDRS-9`** (`sc_tdrs_9`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tdrs/tdrs.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `195°`, `ω`: `0°`, `M0`: `265°`, `P`: `0.997` d
  - **`TEMPO`** (`sc_tempo`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tempo/tempo.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `42164` km, `e`: `0.0005`, `i`: `2.5°`, `Ω`: `252°`, `ω`: `0°`, `M0`: `348°`, `P`: `0.997` d
  - **`Terra`** (`sc_terra`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_terra/Terra.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `271°`, `ω`: `0°`, `M0`: `347°`, `P`: `0.0686` d
  - **`TRMM`** (`sc_trmm`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Completed` | `activeSpan`: `Historic` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_trmm/TRMM.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `6896` km, `e`: `0.0002`, `i`: `35.0°`, `Ω`: `255°`, `ω`: `0°`, `M0`: `195°`, `P`: `0.0686` d
  - **`TROPICS-01`** (`sc_tropics_01`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tropics/tropics.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7141` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `298°`, `ω`: `0°`, `M0`: `266°`, `P`: `0.0686` d
  - **`TROPICS-03`** (`sc_tropics_03`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tropics/tropics.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7161` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `341°`, `ω`: `0°`, `M0`: `337°`, `P`: `0.0686` d
  - **`TROPICS-05`** (`sc_tropics_05`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tropics/tropics.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7061` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `24°`, `ω`: `0°`, `M0`: `48°`, `P`: `0.0686` d
  - **`TROPICS-06`** (`sc_tropics_06`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tropics/tropics.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7081` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `67°`, `ω`: `0°`, `M0`: `119°`, `P`: `0.0686` d
  - **`TROPICS-07`** (`sc_tropics_07`): `subcategory`: `Orbiter` | `agency`: `NASA` | `hostBody`: `Earth` | `status`: `Active` | `activeSpan`: `Active Mission` | `featuredEpochUtc`: `null` | `physicalSpanM`: `3.6` m | `colorHex`: `#6dfcc0` | `modelPath`: `sc_tropics/tropics.gltf`
    - **Role & Description**: `Earth Orbiter` — NASA Eyes orbiter mission operating around Earth, instrumented for planetary, heliophysics, or Earth science observation.
    - **Fallback Keplerian Orbit (`fallbackOrbit`)**: `parentBody`: `Earth`, `a`: `7101` km, `e`: `0.0002`, `i`: `98.2°`, `Ω`: `110°`, `ω`: `0°`, `M0`: `190°`, `P`: `0.0686` d

---

### 3. Trajectory Data Architecture, `.dyn` Binary Files & Evaluation Boundary

- **Binary `.dyn` Asset Inventory (`public/nasa/trajectories/`)**
  - Contains **326** `.dyn` binary files (**0** JSON files).
  - Observed 8-byte binary header magic signatures `\x02\x00<kind>\x00` + subtype/degree bytes across all 326 files:
    - `orb` (**242** files): `\x02\x00orb\x00\x02\x00` (168), `\x02\x00orb\x00\x03\x00` (70), `\x02\x00orb\x00\x04\x00` (4).
    - `pos` (**45** files): `\x02\x00pos\x00\x03\x01` (19), `\x02\x00pos\x00\x02\x01` (18), `\x02\x00pos\x00\x02\x00` (3), `\x02\x00pos\x00\x04\x01` (2), `\x02\x00pos\x00\x03\x00` (2), `\x02\x00pos\x00\x04\x00` (1).
    - `quat` (**23** files): `\x02\x00quat\x00\x03` (13), `\x02\x00quat\x00\x02` (9), `\x02\x00quat\x00\x04` (1).
    - `ori` (**12** files): `\x02\x00ori\x00\x03\x00` (11), `\x02\x00ori\x00\x02\x00` (1).
    - `lin` (**4** files, Mars rover surface traverse): `\x02\x00lin\x00\x04\x00` (2), `\x02\x00lin\x00\x03\x00` (1), `\x02\x00lin\x00\x02\x00` (1).
- **Catalogue Segment Metadata (`NasaEyesCatalog.ts`)**
  - `NasaTrajectorySegment.kind`: `'orb' | 'pos' | 'quat' | 'ori' | 'lin'`.
  - `inline: boolean`: indicates whether a segment is prioritized/inlined vs. on-demand streamed (`inline: false` for large planetary tour files such as `sc_cassini__saturn__orb.dyn`, `sc_juno__jupiter__orb.dyn`, `sc_jwst__earth__orb.dyn`, `sc_hubble_space_telescope__earth__orb.dyn`, `sc_europa_clipper__jupiter.dyn`).
  - `parentId`: relative reference frame body (`sun`, `earth`, `moon`, `venus`, `mars`, `jupiter`, `io`, `europa`, `ganymede`, `saturn`, `titan`, `uranus`, `neptune`, `pluto`, `1_ceres`, `4_vesta`, `16_psyche`, `433_eros`, `253_mathilde`, `3548_eurybates`, `52246_donaldjohanson`, `101955_bennu`, `99942_apophis`, `486958_arrokoth`, `65803_didymos`, `67p_churyumov_gerasimenko`, `9p_tempel_1`, `19p_borrelly`, `81p_wild_2`, `103p_hartley_2`, `5535_annefrank`, `9969_braille`, `galileo`, `sc_osiris_rex`, `self`).
  - `oriSegment` (explicit attitude `.dyn`): present on `sc_deep_impact_impactor` (`sc_deep_impact_impactor__quat.dyn`) and `sc_mars_2020` (`sc_mars_2020__quat.dyn`).
  - `NasaLagrangeHalo` (9 missions): `L1` (`ACE`, `DSCOVR`, `IMAP`, `NEO Surveyor`, `SOHO`, `SOLAR-1`) and `L2` (`Euclid`, `JWST`, `Nancy Grace Roman Space Telescope`), specifying `amplitudeKm` (`260,000–620,000 km`), `periodDays` (`176.0–182.0 d`), and `phaseDeg`.
  - `NasaFallbackOrbit` (133 entries): analytical Keplerian elements (`parentBody`, `semiMajorAxisKm`, `eccentricity`, `inclinationDeg`, `lonAscendingNodeDeg`, `argPeriapsisDeg`, `meanAnomalyDeg`, `periodDays`) used when `.dyn` coverage is absent or outside `[tMinSec, tMaxSec]`.
  - `NasaSurfaceSite` (6 Mars surface assets): `InSight`, `Mars 2020 (Perseverance)`, `Opportunity`, `Spirit`, `Curiosity`, and `Phoenix` (`altKm: 0.008`).
- **`DynamoTrajectory` Integration Boundary (`src/rendering/SpacecraftFactory.ts`)**
  - `SpacecraftFactory.ts` calls `prefetchEntryDyn(entry)`, `loadDynSegment(dynFile)`, `awaitEntryDyn(entry, jdTDB)`, and `evaluateSpacecraftSceneState(entry, jdTDB, fullResolver, onNeedSegment)` returning `SpacecraftSceneEval` (`worldPosition`, `worldVelocityUnitsS`, `attitude`, `activeModelPath`, `parentName`).
  - `ParentResolver` is augmented with `getSpacecraftWorldPosition: (id, out) => this.getSpacecraftWorldPosition(id, out)` so daughter probes (`Galileo Probe` relative to `galileo`, `OSIRIS-REx SRC` relative to `sc_osiris_rex`) resolve parent spacecraft positions.
  - *Observation boundary*: Internal `.dyn` binary block parsing and Chebyshev/polyline/Keplerian interpolation equations reside in `src/astronomy/DynamoTrajectory.ts` (outside Part 3's assigned files).

---

### 4. 3D Asset Streaming, Procedural Environment/Proxy vs. GLTF, Scale Comparison & Close-Inspection (`src/rendering/SpacecraftFactory.ts`)

- **NASA Eyes 3D Assets vs. Procedural Fallback (`GltfModelBank` & `SpacecraftLayerManager`)**
  - **On-disk 3D models (`public/nasa/models/`)**: **153** directories containing **165** `.gltf` + **165** `.bin` + **929** `.webp` + **72** `.ktx2` files (**0** `.glb` files); every spacecraft in `NASA_SPACECRAFT_CATALOG` references a `.gltf` asset (with optional `stowedVariants` swaps handled via `ev.activeModelPath`).
  - **Procedural proxy vs. PBR fallback**: `SpacecraftFactory.ts` does **not** synthesize procedural multi-part spacecraft hulls; instead, `initCatalogEntries()` creates an invisible pick proxy mesh named `'lod_proxy'` using `new THREE.OctahedronGeometry(visualRadius * 0.45, 0)` with `MeshBasicMaterial({ color: entry.colorHex, transparent: true, opacity: 0.0, depthWrite: false })`. Once `GltfModelBank.loadNormalized()` completes, `ensureModelLoaded()` mounts the GLTF `instance` into `bundle.modelRoot` and sets `bundle.surfaceMesh.visible = false`.
- **HDR Space Environment Map (`createSpaceEnvironmentMap(renderer)`)**
  - Generates a PMREM cubemap via `THREE.PMREMGenerator(renderer)` (`pmrem.fromScene(envScene, 0.04)`) on a `0x020308` scene containing:
    - Galactic disk fill sphere (`SphereGeometry(20, 24, 16)`, `0x0b1220`, `BackSide`).
    - HDR `sunDisc` (`SphereGeometry(1.1, 16, 12)`, `Color(12.0, 11.2, 9.5)` at `(14, 7, 8)`) for crisp specular highlights on Kapton foil and optical mirrors.
    - Soft `sunHalo` (`SphereGeometry(3.4, 16, 12)`, `Color(1.4, 1.25, 1.05)` at `(14, 7, 8)`).
    - Cool planetshine `earthshineLobe` (`SphereGeometry(5.5, 16, 12)`, `Color(0.22, 0.36, 0.58)` at `(-14, -5, -10)`).
- **`GltfModelBank` Loader, Queue & Normalization**
  - **Decoders**: Configures `GLTFLoader` with `DRACOLoader` (`${base}draco/`) and `KTX2Loader` (`${base}basis/`, calling `detectSupport(renderer)` safely).
  - **Concurrency queue**: `MAX_CONCURRENT = 4`; `loadNormalized(modelPath, mode, priority)` deduplicates via `cache` keyed by `${mode}:${modelPath}`, prepends priority loads (`this.queue.unshift(run)`), and appends background loads (`this.queue.push(run)`).
  - **`normalizeRoot(raw, mode)`**:
    - Computes `Box3` bounds; normalizes largest dimension to `[-1, 1]` via `scale = 2.0 / Math.max(1e-5, size.x, size.y, size.z)`, centers at origin, and records `halfExtents` (clamped `>= 0.05` per axis) and `boundingRadius = halfExtents.length()`.
    - Sets `castShadow = (mode === 'spacecraft')`, `receiveShadow = true`, computes missing vertex normals, forces `SRGBColorSpace` on `map` and `emissiveMap`.
    - Material tuning by `mode`:
      - `'spacecraft'`: `std.envMapIntensity = std.metalness > 0.5 ? 1.75 : 1.05`, `std.roughness = Math.max(0.06, std.roughness)`.
      - `'natural'` (asteroids/comets/moons): `std.envMapIntensity = 0.38`, clamps `roughness >= 0.85` (if `< 0.65`) and `metalness = 0.1` (if `> 0.25`).
  - **Instancing & extraction**: `instantiate(asset)` performs `asset.template.clone(true)` sharing GPU geometries/materials; `extractFirstGeometry(asset)` clones the first mesh geometry with `mesh.matrixWorld` baked in (used by `AsteroidField`).
- **Layer Isolation, Visual Scaling & 3-Tier LOD (`SpacecraftLayerManager`)**
  - **Render layer**: `SPACECRAFT_LAYER = 5` (isolated from jet reflection cube, cockpit displays, and mirrors so only the main view camera renders spacecraft).
  - **Visual radius**: `computeSpacecraftVisualRadius(entry)` = `clamp(0.045 + Math.log10(Math.max(1.2, entry.physicalSpanM)) * 0.145, 0.055, 0.42)`.
  - **`ICONIC_DEEP_SPACE_IDS`** (19 always-unstaggered/prioritized IDs): `sc_voyager_1`, `sc_voyager_2`, `sc_new_horizons`, `sc_parker_solar_probe`, `sc_jwst`, `sc_juno`, `sc_cassini`, `sc_europa_clipper`, `sc_juice`, `sc_lucy`, `sc_psyche`, `sc_osiris_rex`, `sc_dart`, `sc_iss`, `sc_hubble`, `sc_artemis_2`, `sc_mars_2020`, `sc_rosetta`, `sc_messenger` *(note: `sc_hubble` here differs from catalogue id `sc_hubble_space_telescope`)*.
  - **Staggered evaluation**: After frame 1, distant non-focused/non-locked/non-host/non-iconic `lodTier === 3` craft only re-evaluate when `(i + frameCounter) % 6 === 0`.
  - **Screen-space LOD thresholds** (`pxRadius = (visualRadius / camDist) * (screenH / 2) / tan(fov / 2)`):
    - **Tier 1 (`lodTier = 1`)**: `isFocused || isLocked || (camDist < 120 && pxRadius > 2.5)` → `bodyGroup.visible = true`, priority GLTF load if focused/locked.
    - **Tier 2 (`lodTier = 2`)**: `(camDist < 420 && pxRadius > 1) || hostMatchesFocus` → `bodyGroup.visible = nearPrefetch`; prefetches GLTF and `prefetchEntryDyn` when `nearPrefetch || (hostMatchesFocus && camDist < 900)`.
    - **Tier 3 (`lodTier = 3`)**: hidden (`bodyGroup.visible = false`).
  - **GPU memory eviction**: `EVICT_AFTER_MS = 20000` (`20 s` outside camera `Frustum` sphere test `visualRadius * 2`) triggers `releaseGpu(b)`, disposing geometries and textures from VRAM while keeping decoded images in cache.
- **Close-Inspection, Studio PBR Lighting, Scale Comparison Props, Overlays & Fly-Beside Hooks**
  - **Fly-Beside-Spacecraft / Jet Mode preparation**:
    - `ensureTargetPrepared(idOrName, jdTDB, resolver)` synchronously calls `prefetchEntryDyn` + `evaluateSpacecraftSceneState`, positions/orients `bodyGroup`, updates `localVelocityUnitsS` for formation velocity matching, forces `lodTier = 1` + `visible = true`, and queues priority GLTF loading (`ensureModelLoaded(b, ev.activeModelPath, true)`).
    - `awaitTargetPrepared(idOrName, jdTDB, resolver)` awaits `awaitEntryDyn(b.entry, jdTDB)` before calling `ensureTargetPrepared` so `.dyn` segments are resident before warping beside the craft.
  - **Close-range studio lighting rig**: Active for `studioTarget = focusedBundle ?? lockedBundle ?? (closestVisibleDist < 42 ? closestVisibleBundle : null)`:
    - `keyLight` (`PointLight(0xfff5e4, 18.0 * visualRadius + 1.4, offset * 3.5, 1.4)`): placed at `offset = Math.max(2.5, visualRadius * 10)` along sunward vector `toSun`.
    - `fillLight` (`PointLight(parentColorHex ?? '#6da6ff', 6.5 * visualRadius + 0.35, offset * 3.0, 1.6)`): placed at `offset * 0.85` toward `parentName` when `parentName !== 'Sun'`.
  - **Scale Comparison Props (`ComparisonPropKind`: `'none' | 'scientist' | 'school_bus' | 'rose_bowl'`)**:
    - `COMPARISON_METERS`: `scientist` (`comparison/scientist/scientist.gltf`, `spanM: 1.8`), `school_bus` (`comparison/school_bus/school_bus.gltf`, `spanM: 11.0`), `rose_bowl` (`comparison/rose_bowl/rose_bowl.gltf`, `spanM: 280.0`).
    - When `focusedBundle` is active, scales prop by `propHalfUnits = (spec.spanM * 0.5) / Math.max(0.01, (focusedBundle.entry.physicalSpanM * 0.5) / focusedBundle.visualRadius)`, offsets to camera-right by `visualRadius * 1.45 + propHalfUnits * 1.25`, and matches spacecraft quaternion.
  - **Volumetric Science Overlays (`setScienceOverlaysVisible`)**:
    - `heliosphereGroup` (`heliosphere/voyager_heliosphere.gltf`): scaled to `120 * 149597870.7 * (2.4 / 6371)` units (~120 AU), `transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide`.
    - `magnetosphereGroup` (`saturn/magnetosphere/saturn_magnetosphere.gltf`): `scale = 260`, `opacity: 0.26, depthWrite: false, side: THREE.DoubleSide`, tracked to Saturn's world position each frame.
  - **Clickable Cyan Diamond Reticles (`updateReticles`)**:
    - Pooled `<button class="sol-marker is-spacecraft">` elements (`MAX_RETICLES = 24`), culled if `d > 900` (unless focused/host-focused/iconic), if `pxRadius > 55` (unless focused), behind camera, occluded by parent planet sphere (`pRad * pRad * 0.94`), or within `16 px` horizontal / `[48, height - 64]` vertical margin.
    - Priority sort: `(isFocus ? 1000 : 0) + (isHostFocused ? 200 : 0) + (isIconic ? 80 : 0) - Math.min(60, d * 0.01)`; non-focus markers decluttered with `76 x 22 px` bounding box check.

---

### 5. Small Bodies, Named Asteroids & Procedural Asteroid Belts (`SmallBodies.ts`, `Asteroids.ts`, `NasaEyesCatalog.ts`)

- **Named Small-Body GLTF Models (`NASA_SMALL_BODY_MODELS` in `NasaEyesCatalog.ts`, 26 keys)**
  - **Near-Earth & Main-Belt Asteroids**: `Bennu` / `101955 Bennu` → `101955_bennu/Bennu.gltf`; `Ryugu` / `162173 Ryugu` → `162173_ryugu/ryugu.gltf`; `Psyche` / `16 Psyche` → `16_psyche/psycheAsteroid.gltf`; `Vesta` / `4 Vesta` → `4_vesta/4_vesta.gltf`; `Eros` / `433 Eros` → `433_eros/433_eros.gltf`; `Gaspra` / `951 Gaspra` → `951_gaspra/gaspra.gltf`; `Itokawa` / `25143 Itokawa` → `25143_itokawa/itokawa.gltf`; `Didymos` / `65803 Didymos` → `65803_didymos/Didymos.gltf`; `Dimorphos` → `dimorphos/Dimorphos.gltf`; `Apophis` / `99942 Apophis` → `99942_apophis/apophis.gltf`; `Ida` → `generic/asteroid_1/generic_asteroid_1.gltf`; `Pallas` → `generic/asteroid_2/generic_asteroid_2.gltf`; `Hygiea` → `generic/asteroid_3/generic_asteroid_3.gltf`.
  - **TNOs / Dwarf Planets / Interstellar**: `Arrokoth` / `486958 Arrokoth` → `486958_arrokoth/mu69.gltf`; `Haumea` / `136108 Haumea` → `136108_haumea/haumea.gltf`; `1I/'Oumuamua` → `1i_oumuamua/oumuamua.gltf`.
  - **Irregular Moons**: `Phobos` (`phobos/phobos.gltf`), `Deimos` (`deimos/deimos.gltf`), `Hyperion` (`hyperion/hyperion.gltf`), `Mimas` (`mimas/mimas.gltf`), `Phoebe` (`phoebe/phoebe.gltf`), `Proteus` (`proteus/proteus.gltf`).
  - **Comet Nuclei**: `67P/Churyumov-Gerasimenko` (`67p_churyumov_gerasimenko/67p_churyumov_gerasimenko.gltf`), `103P/Hartley 2` (`103p_hartley_2/hartley_2.gltf`), `19P/Borrelly` (`19p_borrelly/borrelly.gltf`), `9P/Tempel 1` (`9p_tempel_1/9p_tempel.gltf`).
- **Additional JPL SBDB Definitions (`NASA_EXTRA_CELESTIAL_BODIES` in `NasaEyesCatalog.ts`)**
  - `25143` **`Itokawa`**: `a = 1.3241 AU` (`198,083,000 km`), `e = 0.2802`, `i = 1.621°`, `Ω = 69.08°`, `ω = 162.81°`, `M0 = 105.0°`, `P = 556.38 d`, `meanRadiusKm = 0.165`, `massKg = 3.51e10`, `rotationPeriodHours = 12.132`, `axialTiltDeg = 178.5°`, `flattening = 0.55`, `colorHex = '#c7b8a3'`.
  - `65803` **`Didymos`**: `a = 1.6442 AU` (`245,968,000 km`), `e = 0.3838`, `i = 3.408°`, `Ω = 73.19°`, `ω = 319.32°`, `M0 = 190.0°`, `P = 770.15 d`, `meanRadiusKm = 0.39`, `massKg = 5.2e11`, `rotationPeriodHours = 2.26`, `flattening = 0.12`, `colorHex = '#aba69e'`.
  - `99942` **`Apophis`**: `a = 0.9224 AU` (`137,990,000 km`), `e = 0.1912`, `i = 3.339°`, `Ω = 204.45°`, `ω = 126.4°`, `M0 = 240.0°`, `P = 323.6 d`, `meanRadiusKm = 0.185`, `massKg = 6.1e10`, `rotationPeriodHours = 30.56`, `axialTiltDeg = 165.0°`, `flattening = 0.35`, `colorHex = '#b3a390'`.
  - `486958` **`Arrokoth`** (MU69): `a = 44.581 AU` (`6,669,200,000 km`), `e = 0.0418`, `i = 2.451°`, `Ω = 158.99°`, `ω = 174.4°`, `M0 = 316.5°`, `P = 108,670 d`, `meanRadiusKm = 9.15`, `massKg = 7.48e14`, `rotationPeriodHours = 15.92`, `axialTiltDeg = 99.0°`, `flattening = 0.48`, `colorHex = '#b56e5c'`.
  - `136108` **`Haumea`** (`dwarf_planet`): `a = 43.116 AU` (`6,450,060,000 km`), `e = 0.1964`, `i = 28.214°`, `Ω = 122.17°`, `ω = 239.04°`, `M0 = 218.2°`, `P = 103,410 d`, `meanRadiusKm = 780`, `massKg = 4.006e21`, `rotationPeriodHours = 3.9154`, `axialTiltDeg = 126.0°`, `flattening = 0.52`, `colorHex = '#dde5ea'`.
- **GPU-Keplerian Catalogue Small Bodies (`src/rendering/SmallBodies.ts`)**
  - Loads `public/data/small-bodies.json` (~35,000 main-belt, Hildas, 7,500 Jupiter Trojans, NEOs, Centaurs, TNOs, ~600 comets).
  - **Orbital Constants**: `JD_J2000 = 2451545.0`, `GAUSS_DEG_PER_DAY = 0.9856076686` ($n = k / a^{1.5}$).
  - **Population Styles (`STYLES`)**:
    - `main`: `color: [0.82, 0.76, 0.68]`, `gain: 0.55`, `h0: 12`, `minPx: 1.3`, `maxPx: 3.2`.
    - `hilda`: `color: [0.86, 0.68, 0.52]`, `gain: 0.6`, `h0: 12`, `minPx: 1.4`, `maxPx: 3`.
    - `trojan`: `color: [0.86, 0.6, 0.46]`, `gain: 0.62`, `h0: 12`, `minPx: 1.4`, `maxPx: 3`.
    - `neo`: `color: [1.0, 0.62, 0.48]`, `gain: 0.75`, `h0: 18`, `minPx: 1.5`, `maxPx: 3`.
    - `centaur`: `color: [0.78, 0.82, 0.88]`, `gain: 0.7`, `h0: 10`, `minPx: 1.5`, `maxPx: 3`.
    - `tno`: `color: [0.66, 0.76, 0.95]`, `gain: 0.75`, `h0: 7`, `minPx: 1.5`, `maxPx: 3.5`.
    - `comet`: `color: [0.6, 0.92, 1.0]`, `gain: 0.9`, `h0: 12`, `minPx: 1.8`, `maxPx: 3.5`.
    - `stream`: `color: [0.95, 0.78, 0.55]`, `gain: 0.16`, `h0: 12`, `minPx: 1.0`, `maxPx: 1.6`.
  - **Meteoroid Streams (`STREAMS`, 8 showers × 2,600 particles = 20,800 particles)**:
    - `Perseids` (`109P/`), `Leonids` (`55P/`), `Orionids / Eta Aquariids` (`1P/`), `Taurids` (`2P/`), `Ursids` (`8P/`), `Draconids` (`21P/`), `Geminids` (`Phaethon` hardcoded elements `[1.2712, 0.88985, 22.257, 265.21, 322.19, 0, 2460600.5]`), `Quadrantids` (`2003 EH1` hardcoded `[3.1224, 0.6185, 70.79, 282.97, 171.37, 0, 2460600.5]`).
    - Deterministic LCG `seed = 1234567` (`seed = (seed * 1664525 + 1013904223) >>> 0`) + Box-Muller Gaussian perturbation (`35%` bunched near `M0 ± 25°`, `65%` uniform `0–360°`; Gaussian spread `0.02a`, `0.006e`, `0.6°i`, `1.2°Ω`, `0.8°ω`, `H = 12 + rnd() * 3`).
  - **Vertex/Fragment Shaders (`SmallBodies`)**:
    - Per-vertex attributes: `aOrbitA` `(a, e, i)`, `aOrbitB` `(node, peri, M0)`, `aOrbitC` `(epoch - JD_J2000, n, b)`.
    - Brightness from Pogson's law: `b = Math.min(1.6, style.gain * Math.pow(10, -0.2 * ((H ?? style.h0) - style.h0)))`.
    - 12-iteration Newton-Raphson Kepler solver (`E = e < 0.8 ? M : pi`), rotates orbital plane to ecliptic, maps ecliptic → render frame `vec3(ecl.x, ecl.z, -ecl.y) * uUnitsPerAU`.
    - Distance attenuation `fade = clamp(pow(3.0 / max(0.05, dist / uUnitsPerAU), 1.1), 0.05, 1.0)` (culls if `vAlpha < 0.004`), `gl_PointSize = clamp(uPx.x + aOrbitC.z * 1.2, uPx.x, uPx.y)`, additive Gaussian PSF `exp(-d * 14.0) * vAlpha`.
  - **Catalogue Comet Tails (`CometTails`)**:
    - `InstancedMesh` (`MAX = 64`), updated when `Math.abs(days - lastDays) >= 0.25`.
    - Filters comets with `c.q <= 4.5` AU and heliocentric distance `r <= 4.0` AU using 20-iteration CPU Kepler solver.
    - Activity & scaling: `activity = Math.min(1, Math.pow(1.6 / Math.max(0.3, r), 2))`, `length = (0.02 + 0.25 * activity) * UNITS_PER_AU`, `width = length * 0.06`, oriented along normalized anti-solar vector `away`.
    - Camera-billboarded quad shader: `spread = mix(0.12, 1.0, position.y)`, `a = pow(across, 1.6) * pow(1.0 - along, 1.8) * 0.55`, color gradient `mix(dust, ion, along)` from `vec3(1.0, 0.92, 0.78)` to `vec3(0.45, 0.75, 1.0)`.
- **Close-Range Jet-Mode Asteroid Belts (`AsteroidField` in `src/flight/Asteroids.ts`)**
  - **Belt Definitions (`BELTS`)**:
    - `Main asteroid belt`: `rIn = 2.1 * UNITS_PER_AU`, `rOut = 3.3 * UNITS_PER_AU`, `half = 0.18 * UNITS_PER_AU`, 4 spectral tints (`[0.3, 0.3, 0.31]` 50%, `[0.42, 0.42, 0.43]` 25%, `[0.45, 0.41, 0.37]` 15%, `[0.56, 0.57, 0.6]` 10%).
    - `Kuiper belt`: `rIn = 30 * UNITS_PER_AU`, `rOut = 50 * UNITS_PER_AU`, `half = 6 * UNITS_PER_AU`, 2 spectral tints (`[0.62, 0.66, 0.72]` 55% ice-dusted, `[0.46, 0.3, 0.22]` 45% tholin-reddish).
    - Smooth radial/vertical blend `belt(pos)`: `edge = (rOut - rIn) * 0.08`, radial `smoothstep` × vertical `1 - smoothstep(|y|, half * 0.7, half)`.
  - **Deterministic Spatial Hash Grid**:
    - `CELL_KM = 3`, `RANGE = 6` (±18 km cube), `FIELD_KM = RANGE * CELL_KM` (`18 km` inscribed fade sphere), `VARIANTS = 14`, `PER_VARIANT = perf.settings.rocksPerVariant`.
    - 32-bit integer `hash(x, y, z, k)` places 0–2 rocks per cell (`hash < 0.5 * density`, `density = 0.35 + 0.65 * k`).
    - Power-law radius `rKm = Math.min(4, 0.18 * Math.pow(1 / (1 - u * 0.999), 0.6))` (180 m to 4 km), independent axis ratios `(0.6..1.4, 0.45..1.15, 0.6..1.4)`, continuous slow tumble `spin = (hash - 0.5) * 0.4`.
    - Speed fade-out: `show = k * (1 - smoothstep(speedKmS, 120, 900))`; collision array `near` records `{ x, y, z, rKm }` for cells with `|ix|, |iy|, |iz| <= 1` when `show > 0.5`.
  - **Procedural Rock Geometry & Material**:
    - `rockGeometry(seed)`: starts from `IcosahedronGeometry(1, 4)` + `mergeVertices`, applies large `noise3` lumps (`±0.25`), `4` spherical craters (`depth 0.07`), `5–13` planar fracture cuts (`k > d` projected back by `0.97`), 3-octave fine roughness (`amp = 0.05`, `f = 6, *2.3`), and spherical UVs.
    - `rockTexture()`: `512×512` procedural canvas with 2,600 regolith mottles, 140 radial-gradient craters, pixel grit noise, applied as `map` & `bumpMap` (`bumpScale: 9`, `roughness: 0.97`, `metalness: 0.03`).
  - **GLTF Variant Upgrade (`upgradeVariantsWithNasaGltfs`)**:
    - Requests `nasaRockPaths`: `'asteroid/generic_asteroid_1/generic_asteroid_1.gltf'`, `'asteroid/generic_asteroid_2/generic_asteroid_2.gltf'`, `'asteroid/generic_asteroid_3/generic_asteroid_3.gltf'`, `'243_ida/ida.gltf'`, `'951_gaspra/gaspra.gltf'`, `'25143_itokawa/itokawa.gltf'` via `GltfModelBank.loadNormalized(modelPath, 'natural')` and `extractFirstGeometry`.
    - *Observed disk discrepancy*: In `public/nasa/models/`, the generic asteroids reside under `generic/asteroid_1..3/generic_asteroid_1..3.gltf` (not `asteroid/...`) and `243_ida` is absent, while `951_gaspra/gaspra.gltf` and `25143_itokawa/itokawa.gltf` exist on disk; failed loads safely keep the procedural `rockGeometry` variant.
  - **Debris & Haze**: `DEBRIS = 2400` point grains wrapping in a `600 m` camera-centered box (`size: 2.2`, `opacity: 0.8`), plus `HAZE = 18` additive `Sprite` clouds (`128×128` radial gradient, `scale: 5,000–12,000 m`, `opacity: 0.05 * show`).

---

### 6. 3D Comets (`Comet3D` in `src/flight/Comets3D.ts`)

- **Configured Comets (`COMETS` array, 6 bodies)**
  - `Comet C/2026 S1`: `rAu: 1.15`, `lonDeg: 40`, `latDeg: 6`, `nucleusKm: 5` (procedural nucleus).
  - `Comet C/2026 T2`: `rAu: 1.7`, `lonDeg: 215`, `latDeg: -9`, `nucleusKm: 3` (procedural nucleus).
  - `67P/Churyumov-Gerasimenko`: `rAu: 1.243`, `lonDeg: 78`, `latDeg: 4.5`, `nucleusKm: 2.1`, `modelPath: '67p_churyumov_gerasimenko/comet_67p.gltf'` *(note: on disk and in `NASA_SMALL_BODY_MODELS`, the file is `67p_churyumov_gerasimenko/67p_churyumov_gerasimenko.gltf`)*.
  - `103P/Hartley 2`: `rAu: 1.059`, `lonDeg: 142`, `latDeg: -6.2`, `nucleusKm: 1.1`, `modelPath: '103p_hartley_2/hartley_2.gltf'`.
  - `19P/Borrelly`: `rAu: 1.358`, `lonDeg: 288`, `latDeg: 11.4`, `nucleusKm: 4.0`, `modelPath: '19p_borrelly/borrelly.gltf'`.
  - `9P/Tempel 1`: `rAu: 1.506`, `lonDeg: 325`, `latDeg: -5.3`, `nucleusKm: 3.0`, `modelPath: '9p_tempel_1/9p_tempel.gltf'`.
- **Nucleus, Coma & Sunward Jets**
  - **Positioning**: Static ecliptic placement from `(rAu * UNITS_PER_AU, lonDeg, latDeg)`.
  - **Nucleus**: Starts with `rockGeometry(97 + Math.floor(spec.rAu * 10))` (`color: 0x1c1a19`, `roughness: 1`, `metalness: 0`, scaled `(1.3, 0.8, 1.0) * nucleusKm * kmU`), upgraded asynchronously via `GltfModelBank.loadNormalized(resolvedModel, 'natural')` where `resolvedModel = spec.modelPath ?? CatalogueManager.getSmallBodyModelPath(spec.name)`. Spins continuously: `rotation.y += dt * 0.05`, `rotation.x += dt * 0.02`.
  - **Coma & Core**: Two additive `Sprite` layers built from `256×256` `glowTexture`:
    - `coma`: inner `'rgba(235,255,250,1)'`, outer `'rgba(120,230,200,0.35)'`, tint `0xbff7ea`, `opacity: 0.85`, scale `60,000 * kmU` (`60,000 km` diameter; sets Jet Mode targeting `radius = 30,000 * kmU`).
    - `core`: inner `'rgba(255,255,255,1)'`, outer `'rgba(255,250,235,0.4)'`, tint `0xffffff`, `opacity: 0.9`, scale `4,000 * kmU`.
  - **Sunward Gas Jets**: `5` additive `coreTex` sprites (`color: 0xd8fff4`), scaled `(60 + i * 40) * nucleusKm * kmU`, offset along `sunward = -anti` with slow wandering spread and per-frame flickering `opacity = 0.2 + 0.15 * Math.sin(this.t * (1.3 + i * 0.4) + i)`.
- **Anti-Solar Ion Tail, Curved Dust Tail & Solar-Distance Scaling**
  - **Ion Tail (`this.ion`)**: `PlaneGeometry(1, 1, 64, 1)` translated `+0.5` in `x`, `tailMaterial(Color(0.32, 0.58, 1.6), streaky=1, curve=0)`, `twist = 0` (strictly anti-solar `head.clone().normalize()`), scaled `(2.6e7 * kmU, 6e5 * kmU, 1)` (`26,000,000 km × 600,000 km`).
  - **Dust Tail (`this.dust`)**: `tailMaterial(Color(0.55, 0.48, 0.36), streaky=0.35, curve=-0.3)`, `twist = 0.25` rad rotated around `(0, 1, 0)` to lag behind the orbit, scaled `(1.4e7 * kmU, 3.2e6 * kmU, 1)` (`14,000,000 km × 3,200,000 km`).
  - **Shader & Billboarding**:
    - Vertex shader bends the dust tail quadratically (`p.y += uCurve * uv.x * uv.x`).
    - Per-frame `update()` builds an axial eye-facing orthonormal basis `makeBasis(axis, side, normal)` (`side = normalize(axis × toEye)`) so each flat tail plane faces the camera around its longitudinal axis.
    - Fragment shader computes fan width `width = 0.04 + 0.96 * pow(u, 0.75)`, Gaussian cross-section `across = exp(-pow(v / width, 2.0) * 2.5) * (0.35 + 0.65 * (1.0 - abs(v / width)))`, longitudinal falloff `along = pow(1.0 - u, 2.2) * smoothstep(0.0, 0.02, u) / (0.25 + width)`, and 3-octave animated streak noise `uStreak`.
  - **Solar-Distance Scaling Behavior**: `Comet3D` fixes all 6 comets at active inner-system distances (`1.059–1.7 AU`) with constant coma/tail dimensions; heliocentric distance scaling of comet activity (`r <= 4.0 AU`, `activity = min(1, (1.6 / max(0.3, r))^2)`) is instead implemented dynamically in `SmallBodies.ts`'s `CometTails` system.

---

### 7. Verification Suites (`src/tests/catalogue.test.ts` & `src/tests/smallBodies.test.ts`)

- **`src/tests/catalogue.test.ts` ("Phase 3 Celestial Catalogue & Hierarchy")**
  - Verifies core catalogue counts via `CatalogueManager.getStats()`: `stars === 1`, `planets === 8`, `moons > 450`, `dwarfPlanets === 2`, `asteroids === 9`, and exactly `22` non-`minor` hand-written large moons.
  - Verifies parent-moon mapping across `Earth`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, `Neptune`, `Pluto` (`Charon`, `Hydra`, `Kerberos`, `Nix`, `Styx`).
  - Asserts valid Keplerian elements (`semiMajorAxisKm > 0`, `orbitalPeriodDays > 0`, `0 <= eccentricity < 1`, `meanRadiusKm > 0`), numeric regex IDs (`/^[0-9]+$/`), and `Triton`'s retrograde ecliptic inclination (`> 90°`, `toBeCloseTo(129.13, 1)`).
  - Verifies `RenderSpaceTransform.toMoonRenderPosition` vs. `moonDistanceKm(384400, 6371)` (`~60.3` Earth radii unscaled) and `CatalogueManager.search` / `getBody` (`Titan`, `Moon`, `Ceres`).
- **`src/tests/smallBodies.test.ts` ("Every known moon (JPL)" & "Small bodies (JPL SBDB)")**
  - Verifies JPL moon counts by parent: `Jupiter === 115`, `Saturn >= 285`, `Uranus >= 28`, `Neptune === 16`, `Pluto === 5`, `Mars === 2`, `Earth === 1`, total `MOONS.moons.length > 450`, unique names, `Neso` (`a > 4e7 km`), and `Phoebe` (`i > 90°`).
  - Verifies `public/data/small-bodies.json`: `populations.main.length > 30000` (median `a` in `(2.2, 3.3)` AU), `trojan.length > 5000` (first 200 within `|a - 5.2| < 0.4` AU), `tno.length > 5000`, `comets.length > 500`, and presence of meteor-shower parent comets `1P/Halley`, `109P/Swift-Tuttle`, `55P/Tempel-Tuttle`, and `2P/Encke`.

---

## Part IV: Astrophysical Phenomena, Custom GLSL Shaders, Optical Effects & LensPipeline

---

### 4.1 Solar Physics & Shaders (`SolarShader.ts`, `PlanetFactory.ts`)

- **Photosphere Convection, Granulation & Differential Rotation (`SolarShader.createPhotosphereMaterial`)**:
  - **Uniforms**: `sunTexture` (seeded full-disk solar map), `time` (seconds).
  - **Differential Rotation**: Equator rotates faster than poles via local latitude $p_y$ warp:
    - $\text{rot} = t \cdot 0.004 \cdot (1.0 - 0.3\, p_y^2)$, rotating local vector $\mathbf{p}$ around $+Y$ into $\mathbf{q}$.
  - **Turbulent Domain Warping & Multi-Scale Convection**:
    - 3-axis 4-octave FBM warp $\mathbf{w}$ at frequency $2.6$ (`lacunarity = 2.03`, `gain = 0.5`), displaced as $\mathbf{q}_w = \mathbf{q} + 0.28\,\mathbf{w}$.
    - Supergranulation / mesogranulation FBM layers: `big = fbm(qw * 5.5 + t * 0.012)` and `mid = fbm(qw * 17.0 - t * 0.025)`.
    - **3D Cellular Voronoi Granulation (`granules(p, t)`)**: Evaluates $3 \times 3 \times 3$ lattice neighbors with wandering cell centers $\mathbf{o} = 0.5 + 0.42 \sin(t(0.6 + 0.8\mathbf{h}) + 2\pi\mathbf{h})$, returning nearest distances $(d_1, d_2) = (\sqrt{d_1^2}, \sqrt{d_2^2})$.
    - **Screen-Space Derivative LOD Anti-Aliasing (`fwidth`)**: Three granule scales (`55.0`, `180.0`, `520.0` at time rates `0.22`, `0.35`, `0.5`) fade out cleanly via `1.0 - smoothstep(0.35, 0.9, length(fwidth(freq)))` before sub-pixel aliasing.
    - **Plasma Filaments & Heat Synthesis**: Combined heat scalar sums base `0.62`, `big * 0.62`, `mid * 0.22`, the three anti-aliased `smoothstep` cell ridges `(d2 - d1)`, and sharp bright magnetic filaments `pow(clamp(1.0 - abs(fbm(qw * 8.0 + vec3(0, t * 0.02, 0)) * 2.2), 0.0, 1.0), 8.0) * 0.22`.
  - **Activity Belts, Sunspots & Faculae**:
    - Heliographic latitude $\text{lat} = \arcsin(\text{clamp}(q_y, -1, 1))$; activity belt mask `smoothstep(0.08, 0.2, |lat|) * (1.0 - smoothstep(0.45, 0.62, |lat|))`.
    - Active region mask mixes 3D noise with `sunTexture` luminance; high-frequency `spotField = vnoise(q * 30.0 + 11.0) + 0.45 * vnoise(q * 80.0)` carves:
      - **Umbra**: `smoothstep(0.44, 0.54, spotField)`, suppressing heat by `82%` and blending toward cool dark core `vec3(0.16, 0.035, 0.01)` at `umbra * 0.85`.
      - **Penumbra**: `smoothstep(0.26, 0.44, spotField) * (1.0 - umbra)` modulated by fine radial filaments `0.75 + 0.25 * vnoise(q * 260.0)`, suppressing heat by `38%`.
      - **Faculae**: Bright magnetic edges around active regions adding `faculae * (0.12 + 0.5 * (1 - mu))`, brightening preferentially near the solar limb.
  - **Eddington-Style Limb Darkening & 5-Stop Plasma Ramp**:
    - Viewing cosine $\mu = \max(0, \hat{\mathbf{n}} \cdot \hat{\mathbf{v}})$, $\text{om} = 1 - \mu$.
    - Limb darkening factor: $\text{limb} = 1.0 - 0.62(1 - \mu) - 0.22(1 - \mu^2)$, modulating heat via `heat * mix(0.5, 1.0, clamp(limb, 0.0, 1.0))`.
    - Piecewise-linear 5-stop color ramp from intergranular lanes `c0 = (0.32, 0.03, 0.0)` $\to$ `c1 = (0.86, 0.24, 0.02)` (`h=0.35`) $\to$ `c2 = (1.0, 0.56, 0.1)` (`h=0.62`) $\to$ `c3 = (1.0, 0.82, 0.38)` (`h=0.9`) $\to$ white-hot cell tops `c4 = (1.0, 0.96, 0.82)`.
    - Chromospheric rim glow at $\text{om} \in [0.82, 1.0]$ blends toward `vec3(1.0, 0.38, 0.06)` plus cubic edge flare `vec3(1.0, 0.3, 0.05) * pow(rim, 3.0) * 0.5`.

- **Corona, Spicules & Streamers (`SolarShader.createCoronaMaterial`, `PlanetFactory.ts`)**:
  - **Geometry & Blending**: Rendered on a `THREE.BackSide` sphere of radius `7.6` scaled by `visualRadius`, `AdditiveBlending`, `transparent: true`, `depthWrite: false`.
  - **Uniforms**: `sunCenter` (`SUN_WORLD`), `sunRadius` (default `14.0`), `time`.
  - **Closest-Approach Ray Geometry**: Computes closest point along camera ray to `sunCenter`, normalized solar radius $r = \|\mathbf{off}\| / R_\odot$ (discards $r < 0.995$ or $t_c \le 0$), and altitude above limb $h = \max(r - 1.0, 0.0)$.
  - **Chromospheric Spicules**: Dual-frequency noise (`fbm(dir * 34.0 + ...)` and `vnoise(dir * 120.0 + ...)`) gives fluctuating tongue reach `0.006 + 0.05 * pow(tongue, 3.0) + 0.018 * tongue2` and flame brightness.
  - **K-Corona & Equatorial Streamers**: Azimuthal streamer streaks modulated by `equator = 1.0 - smoothstep(0.25, 0.85, |dir · pole|)`; combines inner golden glow `exp(-h * 7.0) * 0.55`, outer halo `exp(-h * 1.6) * 0.12`, and K-corona power-law `pow(max(r, 1.0), -3.0)` fading smoothly to zero across $r \in [4.0, 7.5]$.

- **Magnetic Prominence Loops & Coronal Mass Ejections (`SolarShader.createLoopMaterial`, `SolarActivity`)**:
  - **Pool**: `14` active `TubeGeometry(QuadraticBezierCurve3, 64, radius, 12, false)` arches placed in activity belts ($\pm 8^\circ \text{ to } \pm 34^\circ$ latitude). Standard loops span `0.04..0.11 R`; `30%` are great prominences spanning `0.12..0.24 R` with height `1.1..2.0 × span`.
  - **Uniforms**: `time`, `uAge` (`0..1` normalized lifecycle), `uFlash`, `uSeed`.
  - **Plasma Drainage Shader**: `facing = |dot(N, V)|`, `core = pow(facing, 0.7)`, combines three 2D value-noise octaves (`flow` streaming down both legs from `abs(u - 0.5)`, `knots`, `threads`), footpoint fade `smoothstep(0.0, 0.08, u) * smoothstep(1.0, 0.92, u)`, and additive output `col * a * (0.8 + uFlash * 3.5)`.
  - **Lifecycle & Eruptive Flares**: Lifetimes `22..48` s (`dt` sped up from hours); loops rise over `age ∈ [0, 0.25]` (`scale = 0.55 + 0.45 * smoothstep(age, 0, 0.25)`). `22%` erupt at `flashAt ∈ [0.35, 0.55]`: exponential flare `flash = exp(-e * 10) * 1.5`, radial acceleration `base + center * R * e^2 * 0.45`, and rapid expansion `s *= 1 + e^2 * 1.8`.

---

### 4.2 Planetary Surfaces, Earth Material & Saturn Ring System (`PlanetFactory.ts`, `PlanetMaterial.ts`, `EarthMaterial.ts`)

- **Planet Mesh & Small-Body Procedural Geometry (`PlanetFactory.ts`)**:
  - **Tessellation & Oblateness**: Major worlds (`planet`/`star`) use `SphereGeometry(1.0, 96, 64)`; minor worlds use `36×24` or `64×48`. Polar scale applies flattening `polarScale = 1.0 - (body.physical.flattening || 0)`.
  - **Irregular Small Bodies (`smallBodyGeometry`, `shapeSmallBody`)**: Asteroids and moons with `meanRadiusKm < 200` share 24 procedural variants (`v0..v23` × size class `s`/`m`/`l`) or exact triaxial `shapeAxesKm` normalized by $\sqrt[3]{a b c}$. Displaced on a `56×36` sphere with 5 low-order directional lumps, 8–14 parabolic craters with raised rims, and equatorial `ridge` accretion (`0.2 * pow(max(0, 1 - |v.y|/0.2), 1.6)` for Pan/Atlas). Upgrades asynchronously to normalized NASA GLTF meshes via `GltfModelBank.loadNormalized` when available.

- **Tailored Planetary Shader (`PlanetMaterial.ts`)**:
  - **Uniforms**: `uSunWorld` (`SUN_WORLD`), `map`, `normalMap`, `hasNormalMap`, plus world-type flags `isGasGiant`, `isIcyMoon`, `isAirlessRocky`, `isMars`, `isVenus`, `isSaturn`.
  - **Derivative TBN Normal Mapping**: Computes screen-space tangent frame (`dFdx`/`dFdy` on `vWorldPosition` and `vUv`) without requiring precomputed vertex tangents.
  - **True-Color Calibration**:
    - *Mars*: Desaturates oversaturated assets toward luminance (`mix(vec3(lum * 1.08), albedo, 0.64) * vec3(0.96, 0.90, 0.82)`) while preserving bright polar $\text{CO}_2$/$\text{H}_2\text{O}$ ice caps (`smoothstep(0.60, 0.82, avgRGB)`).
    - *Venus*: Softens sulfuric cloud deck (`mix(vec3(lum), albedo, 0.82) * vec3(1.0, 0.97, 0.90)`).
    - *Icy Moons (`Europa`, `Enceladus`)*: Scales albedo by `0.92` to prevent highlight clipping, plus tight Blinn-Phong frost specular `pow(NdotH, 64.0) * smoothstep(0.05, 0.35, NdotL) * 0.22`.
  - **Illumination Laws**:
    - *Gas Giants (`Jupiter`, `Saturn`, `Uranus`, `Neptune`)*: Minnaert atmospheric limb darkening with $k = 0.85$:
      $$\text{minnaert} = (\max(0, \hat{\mathbf{n}}\cdot\hat{\mathbf{l}}))^k \, (\max(0.001, \hat{\mathbf{n}}\cdot\hat{\mathbf{v}}))^{k - 1}$$
      $$\text{diffuse} = \text{smoothstep}(-0.06, 0.28, \hat{\mathbf{n}}\cdot\hat{\mathbf{l}}) \cdot \min(\text{minnaert}, 1.35)$$
    - *Airless Rocky & Mars*: Gradual terminator curve `smoothstep(-0.04, 0.26, NdotL)` (Lunar-Lambert / Lommel-Seeliger-style terminator response).
    - *Venus*: Broad cloud scatter `smoothstep(-0.08, 0.32, NdotL) * 1.05`.
    - *Sunlight & Cosmic Fill*: `sunlight = vec3(1.0, 0.98, 0.94) * 1.35`, `ambient = vec3(0.025, 0.028, 0.038)`.
  - **Analytical Saturn Ring Shadow Cast on Globe**:
    - Transforms `uSunWorld` into Saturn's local equatorial frame (`vLocalSunDir`); intersects view point ray against equatorial plane $y = 0$ via $t = -y_{\text{local}} / l_y$ ($t > 0$).
    - Radial distance $r_{\text{ring}} = \sqrt{q_x^2 + q_z^2}$; ring mask `inRing = smoothstep(1.30, 1.34, r) * (1.0 - smoothstep(2.63, 2.67, r))`, attenuating `diffuse` by `mix(1.0, 0.20, inRing)` (up to `80%` shadow).

- **Saturn Ring System (`PlanetFactory.ts`)**:
  - **Geometry**: `RingGeometry(1.32, 2.65, 128, 8)` rotated into equatorial $XZ$ plane (`rotation.x = Math.PI * 0.5`), `renderOrder = 3`, `DoubleSide`, `transparent: true`, `depthWrite: false`. Radial UV remapping $u = (r - 1.32) / (2.65 - 1.32)$.
  - **Uniforms**: `ringMap`, `uSunWorld`, `saturnCenter` (updated in `onBeforeRender`), `saturnRadius`.
  - **Double-Sided Illumination & Analytical Planetary Shadow**:
    - `lightDot = max(0.12, abs(dot(normal, sunDir)))` illuminates both upper and lower ring faces.
    - Anti-sunward cylindrical shadow test ($t = \mathbf{d} \cdot \hat{\mathbf{s}} < 0$): perpendicular distance to shadow axis $d_\perp = \|\mathbf{d} - t\hat{\mathbf{s}}\|$ produces soft limb penumbra `shadowFactor = smoothstep(R * 0.985, R * 1.015, d_perp)`.
    - Output color: `ringTexCol.rgb * (vec3(1.0, 0.97, 0.90) * 1.85 * lightDot * shadowFactor + vec3(0.045, 0.048, 0.06))`, alpha `ringTexCol.a * 0.96`, discarding `a < 0.02`.

- **Photorealistic Earth Surface & Dynamic Cyclone Clouds (`EarthMaterial.ts`, `PlanetFactory.ts`)**:
  - **Surface Material (`createSurfaceMaterial`)**:
    - **Uniforms**: `uSunWorld`, `uSink` (globe depression under 3D tiles), `uNearAir`, `uAirKmPerUnit`, `uAirCamAltKm`, `uAirHaze`, `uNightAir`, `uMoonLight`, `uMoonDir`, `dayMap`, `normalMap`, `nightMap`, `cloudsMap`, plus `has*` flags.
    - **Water & Ice Masks**: Liquid ocean mask `waterMask = smoothstep(0.30, 0.08, dayColor.r) * smoothstep(0.08, 0.25, dayColor.b) * (1.0 - iceMask)` where `iceMask = smoothstep(0.55, 0.85, avgRGB)` keeps polar caps matte.
    - **Ocean Specular & Twilight**: Blinn-Phong ocean glint `pow(NdotH, 64.0) * waterMask * dayFactor * 1.35 * vec3(0.95, 0.98, 1.0)`. Sunset terminator band `twilightBand = smoothstep(-0.06, 0.02, NdotL) * (1.0 - smoothstep(0.02, 0.20, NdotL))` adds `vec3(0.85, 0.35, 0.12) * twilightBand * 0.35`.
    - **Night-Side City Lights**: Masked strictly to the dark hemisphere via `nightFactor = 1.0 - smoothstep(-0.12, 0.02, NdotL)`, tinted warm sodium/LED `nightTex.rgb * vec3(1.25, 1.10, 0.90) * nightFactor * 1.35`.
    - **Cloud Shadows on Terrain/Ocean**: Samples `cloudsMap` offset along tangent-projected sun vector `vec2(dot(T, sunDir), dot(B, sunDir)) * 0.0035`, darkening `surfaceColor` by up to `42%` (`1.0 - smoothstep(0.12, 0.75, cloudShadow) * 0.42 * dayFactor`).
    - **Low-Altitude Aerial Perspective & Sea Fresnel**: When `uNearAir > 0.001`, blends Schlick sea reflection (`0.02 + 0.98 * (1 - nv)^5` reflecting `apSky(sunUp)`) and full `aerialPerspective(...)` to match close-up 3D tiles seamlessly.
  - **Cloud Shell & Seasonal Tropical Cyclones (`createCloudMaterial`, `updateCyclones`)**:
    - Rendered on `SphereGeometry(1.004, 96, 64)` at `renderOrder = 2`, `depthWrite: false`.
    - **Uniforms**: `uSunWorld`, `cloudsMap`, `uFade`, `uTime`, `uStorms[4]` (`vec4(lonDeg, latDeg, radiusDeg, strength)`), `uStormCount`.
    - **Climatological Storm Basins (`updateCyclones`)**: Selects up to 4 active seasonal basins by UTC month (North Atlantic `[8..10]`, Eastern North Pacific `[7..9]`, Western North Pacific `[7..11]`, Bay of Bengal `[5,10,11]`, South Indian `[1..3]`, Australian `[1..3]`, South Pacific `[1..3]`), tracking westward (`lon - day * 0.55`) and poleward (`lat + hemi * day * 0.12`).
    - **Procedural Spiral Cyclone (`cyclone(lonLat, s)`)**: Logarithmic spiral rain bands rotating cyclonically (`hemi = sign(lat)`):
      $$\text{bands} = 0.5 + 0.5 \sin\big(\text{hemi}\cdot 2\theta - 6.5\ln(r + 0.04) + 0.12\,t\cdot\text{hemi}\big)$$
      - modulated by convective `cloudsMap` cellular samples and hollowed by a central eye `eye = smoothstep(0.035, 0.085, r)`, composited via `max(cloudDensity, cyclone(...) * 0.95)` with twilight orange-red rim tinting.

---

### 4.3 Atmospheres & Aerial Perspective (`AtmosphereShader.ts`, `AerialPerspective.ts`)

- **Spherical Single-Scattering Atmosphere (`AtmosphereShader.ts`)**:
  - **Shell Scaling**: `atmosphereShellScale(name, radiusKm) = 1 + air.topKm / radiusKm` (Earth `topKm = 100` km). `ATMOSPHERE_SUN_POWER = 13`.
  - **Uniforms**: `uSunWorld`, `uCenter`, `uKmPerUnit`, `uRadius`, `uTop`, `uHR` (Rayleigh scale height), `uHM` (Mie scale height), `uBetaR` (Rayleigh $\beta_R$), `uBetaM` (Mie $\beta_M$), `uMieTint`, `uMieG` (Henyey–Greenstein $g$), `uAbsorb` (ozone/molecular absorption), `uSunPower`.
  - **Ray-Marched Optical Integration**:
    - Intersects view ray $(\mathbf{r}_o, \hat{\mathbf{r}}_d)$ in km relative to `uCenter` with outer shell $r_{\text{top}} = R + \text{top}$ and ground sphere $R$ (`STEPS = 12`).
    - At each sample $\mathbf{p}$ at altitude $h = \max(0, \|\mathbf{p}\| - R)$, accumulates view optical depth $\text{od}_{\text{view}} = \int (e^{-h/H_R}, e^{-h/H_M})\,ds$ and traces a 4-step solar optical depth ray `sunDepth(p, sunDir, lit)` with soft-disc terminator `lit = smoothstep(R * 0.995, R * 1.004, closest)` for $b \le 0$.
    - Total extinction along sun-to-point-to-eye path:
      $$\boldsymbol{\tau} = \boldsymbol{\beta}_R (\text{od}_{R,\text{view}} + \text{od}_{R,\text{sun}}) + 1.1\,\beta_M (\text{od}_{M,\text{view}} + \text{od}_{M,\text{sun}}) + \boldsymbol{\beta}_{\text{abs}}(\text{od}_{R,\text{view}} + \text{od}_{R,\text{sun}})$$
    - **Phase Functions**:
      - Rayleigh: $P_R(\mu) = \frac{3}{16\pi}(1 + \mu^2)$
      - Mie (Cornette–Shanks / Henyey–Greenstein form):
        $$P_M(\mu) = \frac{3}{8\pi} \frac{(1 - g^2)(1 + \mu^2)}{(2 + g^2)(1 + g^2 - 2g\mu)^{3/2}}$$
  - **Multiple-Scattering Horizon Approximation**: Computes `thick = 1.0 - exp(-(uBetaR.g * odView.x + uBetaM * odView.y) * 0.9)` and `msK = thick * smoothstep(0.08, 0.35, sunUpHere) * 0.75`, blending `inscatter` toward luminance-normalized `skyTint = pow(uBetaR / maxComp(uBetaR), 0.15)` so midday horizons scatter white-blue instead of darkening yellow.
  - **Star Drowning & Compositing**: Sky transmittance $T = \text{dot}(e^{-\boldsymbol{\tau}_{\text{view}}}, \mathbf{L}_{\text{rec709}})$; when `!hitsGround`, multiplies $T$ by `exp(-L_in * 14.0)` so daylit air drowns background stars. Uses `CustomBlending` (`ONE`, `SRC_ALPHA` for RGB; `ZERO`, `ONE` for alpha) so $\text{out} = \text{inscatter} + \text{bg} \cdot T$.
  - **Oblate Ground & Inside/Outside Switching (`AtmosphereShader.attach`)**: Dynamically adjusts `uRadius` along the ellipsoidal radius under the camera when `polarScale !== 1`, and flips `side` to `BackSide` with `depthTest = !inside || renderOrder < 1` when `dist < visualRadius * shellScale * 1.0005`.

- **Shared Ground/Tile Aerial Perspective (`AerialPerspective.ts`)**:
  - **Global Night/Moon Uniforms**: `NIGHT_AIR = vec3(0.02, 0.026, 0.045)`, `MOON_LIGHT = vec3(0,0,0)`, `MOON_DIR = vec3(0,1,0)`.
  - **Extinction & Scattering Parameters**:
    - Rayleigh: $\boldsymbol{\beta}_R = (0.0058, 0.0135, 0.0331)\text{ km}^{-1}$, scale height $H_R = 8.0\text{ km}$.
    - Mie: $\beta_M = (0.010 + 0.022 \cdot \text{haze})(1.0 + 4.5 \cdot \text{low} \cdot \text{lit})$ with low-sun golden-hour mist thickening, scale height $H_M = \text{mix}(1.5, 0.8, \text{low})\text{ km}$, Henyey–Greenstein $g = 0.76$:
      $$\text{hg}(\mu) = \frac{1 - g^2}{4\pi(1 + g^2 - 2g\mu)^{3/2}}$$
  - **Transmittance & In-Scattering**: Evaluates optical depth at mean path altitude $h_{\text{mean}}$, partitions molecular vs aerosol scattering by `shareR = odR / max(od, 1e-6)`, and adds `uNightAir` so night terrain haze remains cool lunar/starlit blue rather than brown daytime fog.

---

### 4.4 Sagittarius A*, Relativistic Infall & HorizonView (`SagittariusAStar.ts`, `BlackHoleInfall.ts`, `HorizonView.ts`)

- **Schwarzschild Ray-Traced Black Hole (`SagittariusAStar.ts`)**:
  - **Constants (`DEFAULT_SGR_A_CONFIG`)**: $r_s = 24.0$, ISCO inner disk edge $r_{\text{in}} = 72.0 = 3.0\,r_s$, outer disk edge $r_{\text{out}} = 432.0 = 18\,r_s$, bounding volume sphere $R_{\text{bound}} = 1000.0$, $uTPeak = 6300.0\text{ K}$, $uExposure = 1.35$.
  - **Backward Null-Geodesic Velocity-Verlet Raymarcher (`MAX_STEPS = 320`)**:
    - Enters bounding sphere along camera ray $(\mathbf{r}_o, \hat{\mathbf{r}}_d)$ in local coordinates; computes conserved specific angular momentum squared $h^2 = \|\mathbf{x} \times \hat{\mathbf{d}}\|^2$ and impact parameter $b = \sqrt{h^2}$.
    - Integrates the exact Schwarzschild photon orbit equation in Cartesian form:
      $$\frac{d^2\mathbf{x}}{d\lambda^2} = -\frac{3}{2} r_s h^2 \frac{\mathbf{x}}{r^5}$$
    - Adaptive step `dt = clamp(0.07 * r, 0.025 * uRs, 60.0)`, further clamped near the accretion plane (`rc < uROut * 1.05`) to `min(dt, max(|pos.y| * 0.9, 0.05 * uRs) + 0.02 * r)` so grazing rays resolve multi-order photon rings cleanly.
    - Event horizon capture at $r < 1.002\,r_s$ (rays with $b < b_c = \frac{3\sqrt{3}}{2} r_s \approx 2.6\,r_s$, skimming the photon sphere at $r = 1.5\,r_s$, yield pure black shadow with `alpha = 1.0`).
  - **Page–Thorne Accretion Disk & Relativistic Frequency Shift (`diskSample`)**:
    - Exact disk-plane crossing ($y_{\text{old}} \cdot y_{\text{new}} < 0$) interpolates crossing point $\mathbf{c}_p$ and ray direction.
    - **Temperature Profile (`diskTemp`)**: Combines Page–Thorne / Novikov–Thorne flux $f_{\text{PT}} = \max(0, 1 - x^{-1/2}) / (0.0306\, x^3)$ ($x = r / r_{\text{in}}$, normalized at peak $x = 49/36$) with Chiang & Goldreich flared outer-disk irradiation $f_{\text{Irr}} = 0.055 / x^2$, giving $T(r) = (f_{\text{PT}} + f_{\text{Irr}})^{1/4}$.
    - **Keplerian Differential Shear (`diskTexture`)**: $\Omega(x) = 0.9\, x^{-1.5}$, cross-fading two `40.0` s phases (`abs(2.0 * f1 - 1.0)`) in log-radius `log(x) * 22.0` so spiral streaks never wind up infinitely.
    - **Doppler Beaming & Gravitational Redshift**:
      $$\beta = \min\!\left(0.95,\;\sqrt{\frac{r_s}{2(r - r_s)}}\right), \quad \gamma = \frac{1}{\sqrt{1 - \beta^2}}, \quad \delta = \frac{1}{\gamma(1 - \beta \cos\alpha)}, \quad g = \delta\sqrt{1 - \frac{r_s}{r}}$$
    - **Observed Blackbody & Liouville $g^4$ Brightness**: $T_{\text{obs}} = T \cdot uTPeak \cdot g$, `bright = pow(g, 4.0) * pow(T, 4.0) * structure`, converted via linear blackbody RGB (`pow(rgb, 2.2)`). Outer dusty zone (`smoothstep(2.2, 6.0, x)`) shifts toward sooty brown-amber with absorbing dust lanes.
    - **Lensed Background & Filmic Shoulder**: Near the hole ($b \in [4 r_s, 12 r_s]$), adds `lensedSky(dir)` over the real sky for Einstein-ring star distortion; soft tone shoulder `col / (1.0 + col * 0.18)`.
  - **S-Cluster & Relativistic Polar Jets**:
    - `createNuclearStarCluster`: `260` O/B/A/giant stars placed between `1400 * rs` and `5200 * rs` with Bahcall–Wolf cusp concentration (`rMin + pow(u, 1.6) * (rMax - rMin)`).
    - `createPolarOutflowJets`: 4 crossed planes per pole (`jetHeight = 720.0`, `jetWidth = 65.0`, `jetPolesGroup.visible = false` in pure Interstellar mode, retained for NASA anatomy mode) with white-hot spine (`exp(-normDist^2 * 45.0)`), ruby-coral synchrotron sheath (`exp(-normDist^2 * 4.8)`), and helical knots at $v \sim 0.98c$.

- **Relativistic Infall, Tidal Disruption & Light Bending (`BlackHoleInfall.ts`)**:
  - **Units & Constants**: Geometric $G = c = 1$, $r_s = 24.0$, $M = r_s / 2 = 12.0$, `C_UNITS_PER_SEC = 150`, `TIDAL_R = 8.9 * RS` ($\approx 1.13 \times 10^8$ km for a Sun-like star around $4.3 \times 10^6 M_\odot$), `B_CRIT = (3 * sqrt(3) / 2) * RS`, `TRAIL = 18`, `capacity = 220`, `ROCK_VARIANTS = 4` (`40` instanced rocks per variant).
  - **Timelike Geodesics (`stepTimelike`)**: Sub-stepped coordinate-time $dt$ integration ($d\tau = \frac{f}{E}\,dt$, $f = 1 - \frac{2M}{r}$, halting at $f \le 0.002$) of:
    $$\frac{d^2 r}{d\tau^2} = -\frac{M}{r^2} + \frac{L^2}{r^3} - \frac{3ML^2}{r^4}, \qquad \frac{d\varphi}{d\tau} = \frac{L}{r^2}$$
    - with sub-ISCO specific angular momentum $L \in [0.55, 0.97]\cdot 2\sqrt{3}M$ (rocks) or $[0.75, 0.95]\cdot 2\sqrt{3}M$ (stars) and energy $E = \sqrt{(1 - 2M/r)(1 + L^2/r^2)}$.
  - **Tidal Disruption (`disrupt`)**: Any infalling star crossing $r < 8.9\,r_s$ shatters into `70` `debris` stream particles carrying spread $E$ (`±0.75%`), $L$ (`±6%`), $r$ (`±3%`), and $\varphi$.
  - **Null Geodesic Photon Fans (`stepPhoton`)**: Fans of 9 rays with impact parameters $0.3\,b_c \dots 1.6\,b_c$ integrate $\frac{d^2\mathbf{x}}{d\lambda^2} = -\frac{3}{2} r_s h^2 \mathbf{x} / r^5$ slowed by lapse $f = 1 - r_s/r$.
  - **Horizon Fade, Shadow Occlusion & Heating**:
    - Occlusion test hides heads, trails, and 3D tumbling rocks behind the shadow (`b < B_CRIT && tP > tHole`).
    - Observed frequency shift $g = \sqrt{1 - r_s/r}\,\sqrt{(1 + \beta_{\parallel})/(1 - \beta_{\parallel})}$ (`alive = false` when $g < 0.04$); rocks heat as $(15 r_s / \max(r, r_s))^{0.75}$, points/trails scale by $g^4$, and instanced rocks scale by $g^2$ with orange-red redshift tinting.

- **HorizonView Ocean World at $20\,r_s$ (`HorizonView.ts`)**:
  - **Relativistic Physics (`horizonFacts`)**: Places a hypothetical ocean planet (`R_PLANET = 420.0`, `EYE = 0.06`) on a stable circular orbit at `HORIZON_ORBIT_RS = 20.0` around $M_{\text{BH}} = 4.297 \times 10^6\,M_\odot$:
    - Circular orbit clock rate: $\frac{d\tau}{dt} = \sqrt{1 - 1.5\,r_s/r}$ (vs static hovering $\sqrt{1 - r_s/r}$).
    - Tidal acceleration per metre: $\Delta a = \frac{2GM}{r^3 g_0}$ ($\sim 0.45\text{ m/s}^2$ across an Earth radius at $20\,r_s$ vs $\sim 13\text{ m/s}^2$ at $6.5\,r_s$).
    - Apparent shadow angular diameter: $\sin\alpha = \frac{b_c}{r}\sqrt{1 - r_s/r}$ ($\alpha = \pi - \arcsin(\dots)$ inside $1.5\,r_s$).
  - **Ocean Shader & Navigation**: 5-octave rotated FBM wind ripples (`amp = 0.06 / (1 + dist * 0.05)`), Schlick Fresnel reflection (`0.02 + 0.98 * (1 - cosT)^5`) of an analytic lensed halo + horizon disk band (`sky`), exponential horizon haze (`1 - exp(-dist * 0.012)`), free flight clamped above $1.1\,r_s$ and sea surface, plus 10 s idle timelapse sweep.

---

### 4.5 Galactic Structure, Volumetric Milky Way & Nebulae (`MilkyWayGalaxy.ts`, `MilkyWayVolume.ts`, `NebulaSky.ts`, `NebulaStage.ts`)

- **External 3D Milky Way Model (`MilkyWayGalaxy.ts`)**:
  - **Scale & Frame**: `GALAXY_UNITS_PER_KPC = 1320.0`, `SUN_GALACTOCENTRIC_KPC = 8.277`, `SUN_HEIGHT_KPC = 0.0208`, `radius = 28000`, `coreRadius = 4800`, `sunDistance ≈ 10926`. Oriented to real galactic axes (`CoordinateFrames.galacticBasisThree()`) and translated so the Sun locator sits at the scene origin.
  - **7 Subsystems**:
    1. *Master Galactic Disk*: `PlaneGeometry(56000, 56000, 64, 64)` with oblique optical depth boost `1.0 + 0.25 * (1.0 - cosView)`, OB blue-star micro-twinkle, and inner void cutout (`smoothstep(0.012, 0.045, distFromCenter)`) for Sgr A*.
    2. *Volumetric Barred Bulge*: `SphereGeometry(4800)` scaled `(1.0, 0.42, 0.82)`, `BackSide` `AdditiveBlending`, `pow(rim, 6.5)` nucleus + `pow(rim, 2.8)` golden Pop-II halo, fading near Sgr A* via `bulgeFade`.
    3. *Midplane Dust Extinction Sheet*: Plane at `y = 80.0` extracting dark dust lanes `(tex.r * 1.1 - tex.b) * 1.8 * (1 - tex.b * 0.6)`.
    4. *14,000 Procedural 3D Stars*: `4,000` Pop-II bulge + `8,000` flared-disk Morgan–Keenan stars (`thickness = 550 + 450 * r/R`) + `2,000` halo stars.
    5. *Dwarf Satellite Galaxies*: LMC (`49.59 kpc`), SMC (`62.44 kpc`), and Sagittarius Dwarf Spheroidal (`~26.5 kpc`) placed in galactocentric coordinates with soft volumetric glow + embedded star points.
    6. *Orion Spur Sun Beacon*: Concentric rotating reticle (`r = 450`), counter-rotating dashed radar ring (`r = 750`), pulsing core (`r = 180`), and vertical midplane stalk.
    7. *Sagittarius A\**: Centered at `(0, 0, 0)` local galactic origin.

- **Volumetric Milky Way Environment (`MilkyWayVolume.ts`)**:
  - **Two-Family Crossfade**: Inside the Solar System (`SKY_FADE = [4000, 15000]`) the Gaia `sky` family surrounds the observer; leaving the Solar System (`DISK_FADE = [2500, 12000]`) the importance-sampled `disk` family takes over (`Mulberry32` deterministic PRNG + binary-searched CDFs).
  - **Sky Family (`gaia_sky.webp`)**:
    - 3 nested flattened ellipsoidal shells (`SKY_GAIN = 0.9`, `SKY_BLACK = 0.035`, additive `CustomBlending(One, One)`):
      - `milky_way_sky_far`: radii `(13000, 2600)`, `weight = 0.5`, `blur = 0.0003`, `renderOrder = -13`.
      - `milky_way_sky_mid`: radii `(7000, 2000)`, `weight = 0.3`, `blur = 0.0012`, `renderOrder = -12`.
      - `milky_way_sky_near`: radii `(3200, 1500)`, `weight = 0.2`, `blur = 0.003`, `renderOrder = -11`.
    - `54,000` sky stars (`45,000` CDF-sampled from `1024×512` Gaia map weighted by $(f + 0.002)^{0.45} \cos b$ + `9,000` isotropic) placed in a `1500`-unit half-thickness slab (`1300..14000`) for true 3D parallax, colored by 7-tier `SPECTRAL_COLORS` × safe chromaticity tint.
  - **Disk Family (`milky_way_disk.webp`, `512×512` sample)**:
    - Vertical distribution follows a realistic $\operatorname{sech}^2$ profile via inverse CDF: $y = h_{\text{kpc}}\cdot \text{heightScale}\cdot 1320 \cdot \operatorname{atanh}(2u - 1)$, where $h_{\text{kpc}} = 0.16 + 0.012 r_{\text{kpc}} + 0.55 e^{-(r_{\text{kpc}}/1.8)^2}$ (young blue stars $\times 0.6$).
    - Layers: `DISK_STARS` (`140,000`, sizes `9..40`, `sizeSkew = 6.0`), `DISK_GLOW` (`6,000`, sizes `900..2300`, `alpha = 0.013`), `DISK_DUST` (`16,000`, `NormalBlending`, sizes `220..600`, `heightScale = 0.3`).
    - **Flux-Conserving Point Sprites**: `vAlpha = aAlpha * min(1.0, (s*s)/(px*px)) * smoothstep(nearFade)` preserves surface brightness when sprites clamp to `pointClamp`. `setGroundMode` projects points onto a `skyRadius * 0.9` shell inside short surface far planes.

- **Celestial Sphere Nebulae (`NebulaSky.ts`) & 3D Visit Stages (`NebulaStage.ts`)**:
  - **`NebulaSky.ts`**: `9` nebulae (`cosmic-cliffs`, `mystic-mountain`, `helix` real imagery + `6` procedural classes) projected onto `16×16` gnomonic `skyPatch` meshes at `SPHERE_RADIUS * 1.03`. Each has a sharp core (`depth = 0`, `bias = 0`, `renderOrder = -8`) and an outer parallax halo (`depth = 1`, `scale = 1.12`, `gain = 0.32`, `bias = 2.5`, `radius * 1.02`, `renderOrder = -9`). Features premultiplied blending (`One`, `OneMinusSrcAlpha`), 2D noise flow (`0.0035`), bright-star twinkle, velocity-opposed parallax drift, zoom breathing, daylight suppression (`setSkyDarkness`), and `_lite` mobile/4K-VRAM fallback.
  - **`NebulaStage.ts`**: Full-3D visit stage splitting the nebula image into `LAYERS = 7` Gaussian brightness bands ($w_i \propto \exp(-((l - b_i)/0.16)^2)$ normalized across bands) distributed across `depth = width * 0.2`, fading edge-on planes via `smoothstep(0.12, 0.45, vFacing)`. Adds kind-driven dynamics (`evaporate` bright-edge photoevaporation + `edgePoints()` sparks, `jets` HH 901/902 outflows, `expand` breathing shells + 700 knots, `pulsar` 30 Hz `step(0.5, fract(uTime * 30.0))` central neutron star).

---

### 4.6 Starfield, Catalogue Stars, Markers, Trails & Showcase (`CatalogueStars.ts`, `Starfield.ts`, `BodyMarkers.ts`, `OrbitalTrails.ts`, `TravelParticles.ts`, `Showcase.ts`)

- **Hipparcos Catalogue Stars & Relativistic Warp (`CatalogueStars.ts`)**:
  - **Dataset**: Parses `stars.json` (`~12,600` Hipparcos stars to $V \approx 7$), transforming ICRF directions to Three.js ecliptic coordinates (`CoordinateFrames.icrfToThree`) on `SPHERE_RADIUS = 8500.0`.
  - **Ballesteros (2012) $B-V \to T_{\text{eff}}$ & Planck Blackbody Color**:
    $$T = 4600\,\left(\frac{1}{0.92\,(B-V) + 1.7} + \frac{1}{0.92\,(B-V) + 0.62}\right)$$
    - clamped to `[2400, 40000]` K (falling back to `CLASS_TEMP`: `O:35000, B:15000, A:9000, F:6800, G:5600, K:4400, M:3300`), converted to blackbody RGB with `2.5×` saturation lift (`mix(vec3(l), col, 2.5)`).
  - **Relativistic Aberration & Doppler Shift**: For perceived velocity (`smoothedBeta` up to `0.62` over `speed ∈ [25, 600]`):
    $$\cos\theta' = \frac{\cos\theta + \beta}{1 + \beta\cos\theta}, \qquad \delta = \frac{1}{\gamma(1 - \beta\cos\theta')}, \qquad \gamma = \frac{1}{\sqrt{1 - \beta^2}}$$
    - Stars crowd toward `uVelDir`, temperatures shift to $T \cdot \delta$, and flux scales by $\delta^3$.
  - **Pogson Magnitude, Airy PSF & Diffraction Spikes**:
    - Flux $F = 10^{-0.4\,m}\cdot \delta^3 \cdot \text{uExposure}$; size `clamp(1.2 + 6.0 * pow(flux, 0.42), 1.0, 44.0) * uDpr` boosted by `1 + vSpikes * 2.6` for $m < 1.5$.
    - Fragment shader synthesizes an Airy core (`exp(-r^2 * mix(60, 140, vSpikes))`), first Airy ring (`r = 0.17`), soft halo, and 4 secondary-mirror diffraction spikes (`exp(-|c.y| * 160)` and `exp(-|c.x| * 160)`).
  - **Scintillation**: `uTwinkle = 0.06` in vacuum (sensor shimmer) vs `~0.5` under atmosphere, adding dual-frequency brightness modulation and RGB chromatic flicker for $m \le 2.0$.

- **Starfield Orchestrator (`Starfield.ts`)**:
  - Hosts `celestialGroup` (`SPHERE_RADIUS = 8500.0`, scaled by `COSMIC_SCALE`), `cosmos` (`COSMIC_SCALE`), `stardustMesh` (`800` wrapping motes in `DUST_BOX = 640.0` via `mod(position - uWrap + 0.5*uBox, uBox) - 0.5*uBox`), `localInterstellarStars` (Hipparcos stars with `0 < distancePc < 120` placed at `700 + 38 * d_pc`, visible between `700..20000 * COSMIC_SCALE`), `constellationLines` (`CONSTELLATION_OPACITY = 0.38`, fading with `leaving`), `NebulaSky`, `MilkyWayVolume`, `MilkyWayGalaxy`, and `TravelParticles`. `setGroundMode` adapts scales for short planetary surface far planes.

- **Body Markers, Orbital Trails, Travel Particles & Showcase**:
  - **`BodyMarkers.ts`**: Pools up to `MAX = 70` DOM `<button>` markers (`1 - smoothstep(globePx, 2.5, 7)` fades out once a globe exceeds `2.5–7` px), ranks by category/radius/focus, limits minor moons (`14`), and declutters 2D bounding boxes against placed markers and `HUD_SELECTOR` panels using lens-warped `project` coordinates.
  - **`OrbitalTrails.ts`**: Osculating Keplerian polylines (`1024` heliocentric / `256` moon segments) with vertex-shader near-camera chord-sag fade (`[0.0008a, 0.003a]` planets, `[0.004a, 0.015a]` moons) and far-distance moon clutter fade (`[40a, 160a]`).
  - **`TravelParticles.ts`**: `700` additive `LineSegments` in a `110`-unit spherical wrapping box; `currentSpeed` (capped at `420.0`) stretches trails opposite camera velocity/zoom up to `streakLength = 28.0`.
  - **`Showcase.ts`**: Automated cinematic director (`SHOT_SECONDS = 11`, `BLEND_SECONDS = 3.2`) cycling `orbit`, `lowpass`, `foreground`, `overhead`, `close`, `heroClose`, and `heroWide` shots with log-radial dolly transitions, `0.18` quaternion slerp, and dynamic `near`/`far` clamping.

---

### 4.7 LensPipeline EffectComposer Chain & Optical Post-Processing (`LensPipeline.ts`, `AutoExposure.ts`, `GodRays.ts`, `HelmetVisor.ts`)

- **Render Target & Resolution Management (`LensPipeline.ts`)**:
  - Creates a `THREE.HalfFloatType` `EffectComposer` target with an attached `THREE.FloatType` `DepthTexture`.
  - Pixel ratio uses `perf.pixelRatio(1.5)` in observatory mode and `perf.pixelRatio(2) * supersample` (`supersample ∈ [1, 2]`) in flight/overlay mode (so GoPro center magnification retains sharp detail).
  - **Clean Bypass**: When `profile.name === 'clean'` and `!overlayPass.enabled`, bypasses `EffectComposer` and calls `renderer.render(scene, camera)` directly.

- **Complete `EffectComposer` Pass Chain (in exact execution order)**:
  1. **`RenderPass(scene, camera)`**: Renders world scene into linear HDR `HalfFloatType` buffer.
  2. **`DepthTapPass` (`GodRays.ts`)**: Captures `readBuffer.depthTexture` into `this.depth` before subsequent passes swap buffers (`needsSwap = false`).
  3. **`VolumetricCloudPass` (`clouds`)**: Ray-marched volumetric clouds over Earth in jet mode using `DepthTapPass` depth (`0.65` high / `0.5` medium / `0.38` low tier scale).
  4. **`AutoExposurePass` (`AutoExposure.ts`, enabled when `overlayPass.enabled`)**:
     - *Pass 1 (`lumFrag`)*: Downsamples world color + depth into a `64×64` `HalfFloatType` mipmapped target (`LinearMipmapLinearFilter`). Computes `l = max(dot(c, L_rec709), 1e-4)`, weighting open sky (`depth >= 0.9999999`) at `0.3` and lower ground half (`vUv.y <= 0.45`) by `1.3×`, writing `(log(l) * w, w)`.
     - *Pass 2 (`adaptFrag`)*: Samples the $1 \times 1$ mip (`uLevel = 6`) via `exp(s.x / max(s.y, 1e-4))` and temporally blends into a ping-pong `1×1` `FloatType` target at $\tau = 1.2\text{ s}$ (`uBlend = 1 - exp(-dt / 1.2)`).
     - *Pass 3 (`applyFrag`)*: Scales world radiance before cockpit overlay by `k = clamp(uKey / avg, uMin, uMax)` with `key = 0.28`, `uMin = 0.6`, `maxGain = 1.6` (overridable at night).
  5. **`GodRaysPass` (`GodRays.ts`, enabled when `overlayPass.enabled && k > 0.003`)**:
     - Marches `N = 40` jittered steps (interleaved-gradient noise) toward Sun screen UV `uSun` in a half-resolution `HalfFloatType` buffer, sampling open sky (`sky * clamp(l - 2.6, 0.0, 6.0) * decay`, `decay *= 0.955`), tinted `vec3(1.0, 0.86, 0.66)`, attenuated by `exp(-r * 2.2) * (k * 0.28)`, and additively composited onto `readBuffer`.
  6. **`SpeedBlurShader` (`speedBlurPass`, enabled in flight)**: 12-tap radial smear away from heading `uCenter`, weighted `1.0 - t * 0.6`, gated by `smoothstep(0.06, 0.7, length(d))`, clamped to `uStrength <= 0.12` (`0` under `prefers-reduced-motion`).
  7. **`CanopyShader` (`canopyPass`, enabled in cockpit/GoPro)**: Drawn over the world *before* the cockpit overlay so instrument panels sit cleanly in front of the glass. Synthesizes cool polycarbonate tint (`vec3(0.94, 0.975, 1.02)`), curved edge sheen, grid-cell dust/droplet `specks`, Sun veiling glare, dual-frequency starburst (`cos(ang*6)^70`, `cos(ang*17)^140`), concentric polishing-scratch arcs (`freq = 140` & `61`), 5 inter-pane color ghosts along `-sp`, and a `r = 0.46` halo ring.
  8. **`OverlayPass`**: Clears depth (`renderer.clearDepth()`, `autoClear = false`) and renders the meter-scale jet/cockpit overlay scene & camera on top of the km-scale world.
  9. **`OverlayAOPass` (`aoPass`, dynamically inserted right after `OverlayPass` when `on && perf.settings.ao`)**: Extends `GTAOPass`, temporarily hiding sprites, `userData.noAO`, transparent, and additive meshes during its depth pass (`GTAO`: `radius=0.35, distanceExponent=1.2, thickness=1.2, scale=1.1, samples=12`; `PD`: `radius=6, rings=2, samples=12`; `blendIntensity=0.9`).
  10. **`FiniteShader`**: Guards `UnrealBloomPass` against half-float overflow (`~65,000`) turning into `Inf`/`NaN` black screens by replacing `isnan(c)` with `vec4(0.0, 0.0, 0.0, 1.0)` and clamping to `[0.0, 30000.0]`.
  11. **`UnrealBloomPass`**: Linear-HDR glare pass (in `clean` + overlay mode, forces `strength = 0.2 * bloomGain`, `radius = 0.35`, `threshold = 2.2` so only Sun/afterburner glow).
  12. **`OutputPass`**: Applies renderer tone mapping (filmic) and linear-to-sRGB output conversion into display space.
  13. **`ColorGradeShader` (`gradePass`, display space, enabled in flight)**:
      - AMD CAS-style 4-neighbor contrast-adaptive sharpening (`uSharpen = 0.45`).
      - Mid-shadow teal / highlight warm split-tone (`uShadows = (-0.012, 0.004, 0.022)`, `uHighlights = (0.034, 0.012, -0.03)` boosted by `uWarm` at sunset).
      - S-curve `uContrast = 0.2` with raised film black floor (`col * 0.985 + 0.012`), `uSaturation = 1.1`, `uVignette = 0.3`, animated `uGrain = 0.022`.
  14. **`ActionCamShader` (`actionCamPass`, GoPro view)**:
      - **Rolling Shutter ("Jello")**: CMOS row-read horizontal shear `uv.x += uVibration * 0.0022 * sin(uv.y * 14.0 + uTime * 61.0) * sin(uTime * 23.0)`.
      - Unsharp mask sharpening (`* 0.55`), vivid S-curve contrast (`0.55` blend), `1.22` saturation boost, and cool-shadow / warm-highlight grade.
  15. **`FXAAShader` (`fxaaPass`)**: Initialized and sized (`enabled = false` in favor of SMAA).
  16. **`SMAAPass` (`smaaPass`)**: Enabled when `overlayPass.enabled && perf.settings.smaa` to anti-alias jet/cockpit edges without smearing single-pixel Hipparcos stars.
  17. **`LensShader` (`lensPass`)**:
      - **Dual Projection (`uProj`)**:
        - *Standard Barrel (`uProj <= 0.5`)*: $\mathbf{p}_s = \mathbf{p} \cdot \frac{1 + k\, r^2}{1 + k}$, where $r^2 = \frac{p_x^2 + p_y^2}{\text{aspect}^2 + 1}$ (`lensSourcePoint` shared with ray-pick inverse `outputToSceneNdc` and 6-iteration fixed-point `sceneToOutputNdc`).
        - *Action-Cam Hybrid Rectilinear-to-Fisheye (`uProj > 0.5`)*: Rectilinear core (`uProjK = tan(40°)`, `uProjR0 = 0.6`), bending smoothly outward as $\theta(\rho) = \min\!\big(\arctan(k\rho) + a\max(\rho - r_0, 0)^2,\; 1.53\big)$ (`uProjA` solved to clamp corners inside `srcHalfFovDeg - 1°` and sides inside `min(70°, srcSide - 2°)`), sampling at $\mathbf{p}_s = \mathbf{p} \cdot \frac{\tan\theta}{\text{uSrcTan}\cdot \rho}$.
      - **Lateral Chromatic Aberration**: Radial RGB offset scaled by `uChromatic * r^2`.
      - **Rotational Motion Blur (`uShutter`)**: Reprojects world ray using rotation-only `uCurrInvViewProj` and `uPrevViewProj` (keeping tracked planets sharp while smearing stars/sky), 14 jittered taps capped at `vLen <= 0.035`.
      - **Edge Blur, Vignette & Fisheye Mask**: 7-tap corner disc blur `uEdgeBlur * smoothstep(0.25, 1.0, r^2)`, `uVignette * smoothstep(0.15, 1.05, r^2)`, circular `uFisheyeMask` clip (`isMasked`).
      - **Signed G-Force Visual Effects (`uGrey`)**: `+G` (`uGrey > 0`) triggers peripheral desaturation and tunnel blackout; `-G` (`uGrey < 0`) washes periphery in arterial redout `vec3(0.62, 0.03, 0.03)`.
      - **Midtone Film Grain**: `n * uGrain * (0.35 + 0.65 * (1.0 - |2 * luma - 1.0|))`.
  18. **`HelmetShader` (`helmetPass`, `HelmetVisor.ts`, GoPro view)**:
      - Samples 3-point world ambient `ambL` to light out-of-focus helmet lining (`brow` + `cheek pads`), molded olive-grey rubber oxygen mask (`moundY = -0.5 + 0.15 * exp(-(xn/0.36)^2)`) with specular top rim, and out-of-focus edge bleed (`blurAt(..., 0.025)`).
      - Renders smoked visor tint `vec3(0.84, 0.87, 0.9)` above lower curved edge `edgeY = -0.37 + 0.06 * xn^2`, polycarbonate edge refraction (`0.004 * exp(-|dEdge| * 55.0)`) with RGB dispersion (`1.25 / 1.0 / 0.75`), flipped/blurred upper-corner inner reflection, top sky sheen arc, outside curved glints, and Sun-illuminated FBM smudges & wiper streaks.

- **Optical Profiles (`LENS_PROFILES`, `LENS_ORDER`, persisted in `localStorage` `'solaris.lens'`)**:

| Parameter | `cinematic` | `fisheye` | `clean` (Bypass) |
| :--- | :---: | :---: | :---: |
| `distortion` ($k$) | `0.1` | `0.55` | `0` |
| `fisheyeMask` | `0` | `1.12` | `0` |
| `chromatic` | `0.0035` | `0.007` | `0` |
| `edgeBlur` (px) | `2.2` | `4.5` | `0` |
| `vignette` | `0.42` | `0.6` | `0` |
| `grain` | `0.016` | `0.03` | `0` |
| `shutter` | `0` | `0` | `0` |
| `bloomStrength` | `0.4` | `0.48` | `0` (`0.2` in overlay) |
| `bloomRadius` | `0.55` | `0.6` | `0` (`0.35` in overlay) |
| `bloomThreshold` | `0.9` | `0.88` | `1` (`2.2` in overlay) |

---

## Part V: Photoreal Earth, 3D Tiles, Volumetric CloudSea Clouds, Weather, Sky Phenomena & Surface Exploration

### 1. Google Photorealistic 3D Tiles Integration (`src/rendering/PhotorealEarth.ts`)

- **Class & Purpose**: `PhotorealEarth` streams Google Maps Platform Photorealistic 3D Tiles into Earth's surface frame via `3d-tiles-renderer` (`TilesRenderer`) with custom GPU upload throttling, priority queue ranking, helper prefetch cameras, and a custom GLSL surface/atmosphere/water/night-lamp/ground-synthesis shader.
- **Constants & Coordinate Alignment**:
  - `WGS84_A = 6378137` (WGS-84 equatorial semi-major axis in metres).
  - `PHOTOREAL_TILE_NAME = 'tile_99/photoreal'`.
  - Root transform matrix `m` maps Google 3D Tiles WGS-84 ECEF metres `(x, y, z)` into Solaris's normalized surface unit-sphere axes `(x, z, -y) / WGS84_A` (`+X` at 0°N 0°E, `+Y` at North Pole, `-Z` at 0°N 90°E).
  - `attach(surfaceMesh, polarScale)` attaches the tiles group to Earth's `surfaceMesh` and pre-multiplies `makeScale(1, 1 / polarScale, 1)` to undo Earth's polar flattening scale (`1 - 1/298.257223563`) so ECEF tile coordinates align accurately with ellipsoidal Earth geometry.
- **Authentication, Plugins & Streaming Architecture**:
  - Uses **`GoogleCloudAuthPlugin`** directly with `{ apiToken: apiKey, autoRefreshToken: true, useRecommendedSettings: false }` (direct Google Cloud API token authentication rather than an external proxy URL).
  - **`GLTFExtensionsPlugin`** configured with `DRACOLoader` whose worker count scales by quality tier: `low ? 2 : clamp(cores - 2, 2, 6)` loaded from `${BASE_URL}draco/`.
  - **`TilesFadePlugin`**: `fadeDuration: 280` ms, `fadeRootTiles: false`, `maximumFadeOutTiles: low ? 30 : 80`.
  - Custom **`SOLARIS_UPLOAD_BUDGET`** plugin intercepts `initTexture` to spread GPU texture uploads over frames with `uploadBudgetMs` (`high: 5`, `medium: 4`, `low: 3` ms).
  - Global streaming flags: `loadAncestors = true`, `autoDisableRendererCulling = false`.
- **Quality Tiers, Caching & Concurrency**:
  - `baseError`: `high: 8`, `medium: 12`, `low: 20`.
  - LRU cache tile counts (`minSize / maxSize`): `low: 900 / 1600`, `medium: 2500 / 4000`, `high: 4500 / 7000`.
  - LRU cache memory caps (`minBytesSize / maxBytesSize`): `low: 200 / 300 MB`, `medium: 520 / 760 MB`, `high: 1000 / 1500 MB`.
  - Queue concurrency: `downloadQueue.maxJobs` (`high: 56`, `medium: 40`, `low: 16`), `parseQueue.maxJobs` (`high: 20`, `medium: 10`, `low: 4`).
- **Dynamic LOD (`errorTarget`), Priority Ranking & Prefetch Cameras**:
  - Dynamic `errorTarget = baseError * (1 + rush) * still * backlog * memPressure`:
    - `rush = clamp((speedKmS / alt) * 0.35, 0, 1.5)` relaxes SSE during fast low-altitude flybys.
    - `still = (speedKmS < 0.01 && alt < 3) ? 0.75 : 1` sharpens LOD when hovering slowly near ground.
    - `backlog` eases toward `want = clamp(1 + (queued - 250) / 500, 1, 2)` when download/parse queues accumulate.
    - `memPressure` ramps upward at `dtS * 0.8` up to `4` whenever `lru.isFull()`.
  - `rankQueue` runs every 6 frames assigning `solarisRank = tier * 1e7 + min(err, 9.99e6)`:
    - Tier 2: unrenderable tilesets inside primary camera frustum.
    - Tier 1: tiles inside primary camera frustum.
    - Tier 0: tiles seen only by helper prefetch cameras.
  - Helper prefetch cameras:
    - `setLookahead`: `fov = 70`, `aspect = 1.6`, `leadS = 4`, pitched `-0.36` rad (~20°) upward, virtual resolution `900×560`.
    - `setSurround`: `fov = 170`, `200×200` wide peripheral prefetch.
    - `setGroundProbe`: `fov = 100`, positioned `150 m` above ground, `500×500` nadir probe.
- **Custom Shader (`PHOTO_FRAGMENT_HEAD` / `PHOTO_FRAGMENT_BODY`)**:
  - Replaces `#include <opaque_fragment>` and writes `gl_FragColor.a = 0.0` so `PhotorealEarth` acts as an alpha cutout mask for fallback `ProceduralTerrain` and `ProceduralCity` ground meshes (which use `DstAlphaFactor` / `OneMinusDstAlphaFactor` blending).
  - **Day/Night & Seasonal Adjustments**:
    - Terminator transition via `smoothstep(-0.10, 0.16, sunUp)` with `MOON_LIGHT` and `NIGHT_AIR` ambient terms.
    - Seasonal snow line & summer line driven by `uDoy`: `5.4 * (1 - smoothstep(30, 72, absLat)) + 0.6 - 1.6 * max(winterHere, 0)`.
    - Autumn foliage envelope: Gaussian `exp(-((doy - 292) / 26)^2)` in Northern Hemisphere (`110` peak day in Southern Hemisphere) and bare winter deciduous factor `0.28`.
  - **Procedural Water & Glints**:
    - Identifies water from `uDayMap` mask combined with tile blue/luminance heuristics, applying 3-wave ocean swells, Schlick Fresnel `0.02 + 0.98 * (1 - NdV)^5`, dual-lobe Sun specular glint `pow(..., 260) * 9 + pow(..., 40) * 0.25`, and Moon glint `pow(..., 220) * 6`.
  - **Close-Up Ground Synthesis (`updateDetailFrame`)**:
    - Snaps local ENU reference frames on a `0.02°` grid and `32 m` steps to prevent texture swimming.
    - `smearK` (mip levels `3.0 / 4.5`) lifts compressed baked shadows via `min(pow(rL, 0.35) / rL, 2.2)`.
    - `nearK` synthesizes procedural grass blades, `2 cm` gravel pebbles, and paving micro-detail at close range.
    - Low-Sun facet relief blends screen/pixel-width normal `pxW` with `skyShade`.
  - **Shadows, Night City Lamps & Aerial Perspective**:
    - `clCoverage` projects cloud shadows synchronized with `VolumetricClouds`.
    - 5-tap PCF sampling of `uTreeShadow` (`2048 px` shadow map generated by `GroundCover`).
    - Multi-scale procedural night city point lamps evaluated across hierarchical cell scales `10 * 4^l0` m (`l0` in `0..3`).
    - Applies `aerialPerspective` scattering and final contrast curve.
- **Attribution**:
  - Attribution bar refreshes every `1 s`, combining dynamic 3D tile provider credits with static sources: `Google [· parts] · Places © OpenStreetMap · Weather Open-Meteo`.

---

### 2. Fallback Procedural Terrain (`src/rendering/ProceduralTerrain.ts`)

- **Nested Concentric Clipmap Patches (`LEVELS`)**:
  - 5 concentric square grid patches centered on the camera:
    - Level 0: `spanKm: 6`, `z: 13`, `dropM: 0`, `n: 257`
    - Level 1: `spanKm: 24`, `z: 12`, `dropM: 12`, `n: 257`
    - Level 2: `spanKm: 96`, `z: 10`, `dropM: 50`, `n: 129`
    - Level 3: `spanKm: 384`, `z: 8`, `dropM: 200`, `n: 129`
    - Level 4: `spanKm: 1536`, `z: 6`, `dropM: 800`, `n: 129`
- **Blending & Cutout Architecture**:
  - Uses `THREE.CustomBlending` (`DstAlphaFactor` / `OneMinusDstAlphaFactor`) so terrain pixels draw **only** where `PhotorealEarth` has not written `alpha = 0.0`.
  - Inner-patch cutout uniforms (`uHoleC`, `uHoleE`, `uHoleN`, `uHoleHalf = innerSpan * 0.47 * KM`) discard overlapping inner regions so coarser outer patches never Z-fight or overdraw finer inner patches.
- **Incremental Elevation & Terrain Self-Shadow Generation**:
  - Built incrementally over frames (`ROWS_PER_FRAME = 30`, capped at `4 ms` per frame) querying `earthElevation.ensure(...)` and accounting for vertical datum `offsetKm = tileOffsetKm !== null ? tileOffsetKm - 0.006 : -0.11`.
  - Computes per-vertex terrain self-shadowing (`aShadow`) via a 22-step exponential raymarch along the Sun vector (`d *= 1.28` per step) with spherical Earth curvature correction `-d * d / 12742`.
  - Automatically triggers shadow/height recomputation if the Sun moves `> 0.009 rad` or `tileOffsetKm` shifts `> 0.004 km`.
- **Procedural Surface Shading**:
  - Sea waves & specular glint below `vH < 0.0004` km.
  - Gradient noise `tGn`, ridged rock `tFbm`, slope-aligned gully erosion along the fall line, sedimentary strata bands, latitude-dependent `treeLine = mix(3.9, 0.15, smoothstep(24, 72, absLat))` km, seasonal snow line, close-up `9 m` procedural tree crowns, and `aerialPerspective`.

---

### 3. WGS-84 & Equirectangular Tile Math (`src/explorer/TileMath.ts`)

- **Equirectangular Pyramid Layout**:
  - `tileDeg(level, level0TileDeg = 180)`: angular span `level0TileDeg / 2^level`.
  - `matrixSize(level, level0TileDeg = 180)`: column count `ceil(360 / deg)` and row count `ceil(180 / deg)`.
  - `tileBounds`, `tileExists`, `rootTiles`, `childTiles`, `parentTile`, `tileCap`, `texelAngle`, and `wmsBbox` (`minLon,minLat,maxLon,maxLat` for WMS 1.1.1 / `CRS:84` requests).
- **Local & WGS-84 Ellipsoidal Conversions**:
  - `latLonToLocal`: converts geodetic/spherical `(lat, lon)` to Solaris body-local unit vector `[cos(lat)*cos(lon), sin(lat), -cos(lat)*sin(lon)]`.
  - `EARTH_FLATTENING = 1 / 298.257223563`.
  - `bodyLatLonToLocal` and `bodyLocalToLatLon`: for `'Earth'`, converts between geodetic latitude $\phi$ and parametric (reduced) latitude $\beta$ via $\tan(\beta) = (1 - f)\tan(\phi)$ so surface positions sit accurately on the oblate WGS-84 ellipsoid; for spherical bodies, $\beta = \phi$.
- **Quadtree Selection (`selectTiles`)**:
  - Traverses root-to-leaf tile hierarchy using Screen-Space Error (SSE) targeting `maxPixelsPerTexel = 1.3`, capped at `maxTiles = 160`.
  - Applies spherical horizon culling augmented by `groundLift` so elevated terrain near the limb is not prematurely culled.

---

### 4. LERC1 Decoder & DEM Elevation Engines

#### `src/explorer/Lerc1.ts`
- **Binary Decoder (`decodeLerc1(buffer: ArrayBuffer)`)**:
  - Validates the Esri `"CntZImage "` header and parses `width`, `height`, and `maxZError`.
  - Decodes the RLE validity bitmask using `int16` run counts (`count > 0` literal byte runs, `count < 0` repeated byte runs).
  - Iterates over tiled compression blocks reading each block header's `encoding` mode:
    - `0`: raw `float32` elevation values.
    - `1`: bit-stuffed quantized integers reconstructed as `offset + v * 2 * maxZError` via `unstuff` across 32-bit words.
    - `2`: all-zero block (`0.0`).
    - `3`: constant block filled with `offset`.
  - Supports 1-, 2-, and 4-byte `offset` representations and emits `NaN` for invalid masked pixels.

#### `src/explorer/Elevation.ts` (`EarthElevation`)
- **Provider & Tile Format**:
  - Streams AWS Terrain Tiles (`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`) up to `MAX_Z = 13` (`256×256` Web-Mercator PNG).
  - Decodes Terrarium RGB channels to metres via `height = R * 256 + G + B / 256 - 32768`, clamped to `>= 0` km.
- **Caching, Concurrency & Sampling**:
  - `MAX_CACHE = 260` tiles, `MAX_CONCURRENT = 6` HTTP fetches; automatically disables tile fetching after `> 12` failures.
  - Performs bilinear height interpolation with a last-tile fast-path cache.

#### `src/explorer/PlanetElevation.ts` (`PlanetElevation`)
- **Multi-Body DEM Architecture**:
  - Uses `ElevationSource` definitions with `MAX_CACHE = 200`, `MAX_CONCURRENT = 6`, disabling after `> 16` failures.
  - **Configured `SOURCES`**:
    - `Moon`:
      - Equatorial high-res: `LRO_LOLAKaguya_DEM_60N60S_512ppd` (`trek8` 8-bit greyscale, `256 px`, `maxZ: 8`, `±60°` latitude, `a = -8.8194`, `b = 0.07716` km).
      - Global polar fallback: `LRO_LOLA_DEM_Global_128ppd_v04` (`trek8`, `256 px`, `maxZ: 5`, `±90°`, `a = -9.15`, `b = 19.91 / 255` km), `datumKm = 9.2`.
      - `decodeGrey` applies 2 passes of 3×3 mean smoothing to eliminate ~77 m 8-bit quantization terraces.
    - `Mars`:
      - ArcGIS `OnMars/MDEM200M/ImageServer/tile/{z}/{y}/{x}` (`lerc1` format, `512 px`, `maxZ: 7`, `±90°`, corner-sampled, metres converted to km), `datumKm = 8.3`.
  - Exports `planetElevation`, `RELIEF_BODIES`, `elevationFor`, and `groundHeightKm`.

---

### 5. Planetary Imagery & Surface Tile Streaming

#### `src/explorer/ImageryRegistry.ts`
- **`BODY_IMAGERY` & `RADII_KM`**:
  - Defines radii and streaming imagery configs across **23 solar system bodies** (`TREK_GRID`: `tileSize = 256`, `level0TileDeg = 180`, `minLevel = 0`).
  - **Inner Planets**:
    - `Earth`: EOX Sentinel-2 cloudless WMTS (`maxLevel: 13`).
    - `Moon`: Kaguya TC (`maxLevel: 10`).
    - `Mercury`: MESSENGER MDIS (`maxLevel: 7`).
    - `Venus`: USGS Magellan SAR WMS (`maxLevel: 8`).
    - `Mars`: ArcGIS MRO CTX WMTS (`maxLevel: 12`, `colorize: true`).
  - **Gas & Ice Giants**: `Jupiter`, `Saturn`, `Uranus`, `Neptune` (`provider: null`, rendered from 2048 px global maps).
  - **Outer Moons & Dwarf Planets** (USGS WMS / NASA Trek WMTS):
    - Galilean moons: `Io` (`maxLevel: 5`), `Europa` (`maxLevel: 5`, `colorize: true`), `Ganymede` (`maxLevel: 5`, `colorize: true`), `Callisto` (`maxLevel: 5`, `colorize: true`).
    - Saturnian moons: `Titan` (`maxLevel: 6`, 938 nm Cassini), `Enceladus` (`maxLevel: 5`), `Mimas` (`maxLevel: 4`), `Tethys` (`maxLevel: 4`), `Iapetus` (`maxLevel: 3`).
    - Outer & Dwarf worlds: `Triton` (`maxLevel: 5`), `Pluto` (`maxLevel: 6`, `colorize: true`), `Charon` (`maxLevel: 5`, `colorize: true`), `Ceres` (`maxLevel: 6`), `Vesta` (`maxLevel: 6`, IAU).
- **Altitude Clamps**:
  - `imageryEyeKm`: sets minimum eye height to `30×` texel size on relief worlds and `60×` on flat worlds, capped at `1.5 km` on opaque-atmosphere `Titan` and `Venus`.
  - `minimumAltitudeKm`: sets zoom floor at 2× over-zoom of the finest tile level.

#### `src/explorer/SurfaceTileLayer.ts`
- **Tile Mesh & Queue Architecture**:
  - Constants: `TILE_SHELL = 1.0001`, `TILE_LEVEL_LIFT = 2e-6`, `MAX_CONCURRENT = 10` (WMTS) / `4` (WMS), `COVER = 64`, `MAX_CACHED = 220`, `MAX_ATTEMPTS = 3`, `PROVIDER_FAILURE_LIMIT = 8`.
  - Enforces **coarse-to-fine queuing** (grandparents → parents → leaves) and **family-atomic replacement** on relief bodies so child tiles only replace parents once all siblings are ready, eliminating ghost ridges.
  - Builds 32×32 displaced tile meshes with vertical edge skirts (`skirtKm`) to seal seams between adjacent LOD levels.
  - Uses `cutCovered` with a 64×64 `DataTexture` cover mask to discard coarse parent fragments already covered by finer child tiles.
  - Supports `uColorize` (blending `baseMap` chroma with monochrome high-res CTX/Trek luminance) and aerial haze.

---

### 6. Planetary Explorer, Surface Observer, Avatar & Surface Sky

#### `src/explorer/PlanetaryExplorer.ts`
- **Orbital-to-Surface Descent Transitions**:
  - `STREAM_BELOW_ALTITUDE = 0.9` R, `CO_ROTATE_BELOW_ALTITUDE = 1.5` R, `FADE_IN_FROM = 0.85` R / `FADE_IN_TO = 0.5` R, `EVEN_LIGHT_FROM = 0.15` R / `EVEN_LIGHT_TO = 0.03` R, `CLOUDS_FADE_FROM = 1.0` R / `CLOUDS_FADE_TO = 0.3` R, `MAX_LIVE_LAYERS = 2`.
  - On Earth, automatically steps aside in favor of `PhotorealEarth.current` (`minAltKm = 0.12`, `maxLevel = 20`) while keeping `atmosphereMesh.renderOrder` dynamically toggled between `0.95` and `3`.
  - Exposes `flyToLandmark` and `featureLabels` integration.

#### `src/explorer/SurfaceObserver.ts`
- **Standing Surface Camera & Controls**:
  - `DEFAULT_FOV = 50°`, `MIN_FOV = 0.2°` (telescope zoom), `MAX_FOV = 100°`, `IDLE_AFTER = 10 s`, `TIMELAPSE_TURN_S = 150 s`.
  - Note: `SurfaceObserver` provides standing look-around, drag panning, wheel/pinch zoom, arrow-key pan/pitch, `autoAim`, and idle timelapse rotation rather than free WASD walking.
  - Renders a fallback curved 72×160 `groundCap` mesh on non-photoreal bodies.
- **Ground Locking & Eye Height (`eye()`)**:
  - Minimum eye height: `0.045 km` (45 m) on `PhotorealEarth`, `0.0018 km` (1.8 m) on Earth DEM, `imageryEyeKm` on tiled bodies, or `0.3 km` / `0.003 * R` fallback.
  - Grounds the observer on `PhotorealEarth` by raycasting 3D tiles within `<= 350 m` radius, or via a 25-point ring raycast against `tile_` meshes on tiled worlds.
- **Topocentric Sky Integration**:
  - Drives topocentric `observerKm`, `SkyAtmosphere`, `SkyBodies`, `DeepTimeSky`, and `DeepTimeLand`, applying telescope magnitude gain `5 * log10(50 / fov)` when zooming in.

#### `src/explorer/Avatar.ts`
- **Third-Person Human Scale Reference**:
  - Procedural `1.72 m` articulated figure (shoes, jeans, jacket, arms, neck, head, shoulder-length hair) constructed in Earth unit space (`METRE = 1 / 6378137`).
  - Positioned `8 m` ahead and `0.6 m` right of `eyeWorld`, facing away (`-Z`), lit via indirect sky hemisphere shader (`uAvatarSky`), with subtle idle breathing and weight-shift animation.

#### `src/explorer/SkyAtmosphere.ts`
- **Nishita Physical Atmospheric Sky**:
  - Single-scattering Rayleigh (`N = 16` view rays × `M = 6` sun optical-depth steps) + Mie + ozone/methane absorption + `uMulti` multiple-scattering approximation.
  - Eye adaptation boosts sky brightness at twilight via `1 + 7 * dusk`.
  - Exposes Kasten-Young airmass `transmittance()` used for horizon dimming of stars, Moon, and planets.
  - Configured physical profiles for `Earth`, `Mars`, `Venus` (overcast), `Titan` (overcast), `Jupiter`, `Saturn`, `Uranus`, and `Neptune`; vacuum worlds use `NONE`.

#### `src/explorer/SkyBodies.ts`
- **Topocentric Celestial Discs & Stars**:
  - Renders true-angular-size planet/moon discs, Saturn's ring mesh (`1.32..2.65 R`), and additive point sprites (`MAX_POINTS = 64`, `MAX_DISPLAY_RADIUS = 0.13 rad` ≈ `7.5°`).
  - Renders Sun disc with `uEmissive = 40` and additive `sunGlow` sprite, attenuated near the horizon by `SkyAtmosphere.transmittance()`.

---

### 7. Procedural City, Landmarks, Ground Cover & Geocoding

#### `src/explorer/ProceduralCity.ts`
- **Vector-Tile Extrusion (`altKm < 6 km`)**:
  - Streams Mapbox Vector Tiles (`MVT` decoded with `pbf` + `@mapbox/vector-tile`) at zoom `Z = 14` from `https://tiles.openfreemap.org/planet` for `PILOT_REGIONS` (currently `India`: `6.5..37.1°N`, `68.0..97.5°E`) using 12 plaster facade hex colors.
  - Parses the `building` layer and procedurally populates unmapped residential, commercial, industrial, and dense street zones (`GEN_PITCH_M = 24 m`, `GEN_MAX = 4500`).
  - Extrudes outer + courtyard inner walls, roofs, rooftop stair heads, and water tanks (`TANK`), shaded with `3.0×3.2 m` procedural window grids featuring night interior glow and Fresnel sky reflections.
  - `buildGround` constructs asphalt roads with lane/centre markings, parks, and water polygons blended with `DstAlphaFactor` so Google 3D Tiles take precedence wherever loaded.

#### `src/explorer/Landmarks.ts` & `src/flight/LandmarkColliders.ts`
- **`Landmarks.ts`**:
  - Curated `LANDMARKS` catalog across 17 worlds: **Earth** (50+ sites including natural wonders, 330m+ towers, and Google 3D photogrammetry cities), **Moon** (9), **Mercury** (4), **Mars** (9), **Io** (4), **Europa** (3), **Ganymede** (3), **Callisto** (2), **Mimas** (1), **Enceladus** (2), **Tethys** (2), **Iapetus** (2), **Triton** (2), **Pluto** (5), **Charon** (2), **Ceres** (3), and **Vesta** (2).
  - Helpers: `bearingDeg`, `angularDistanceDeg`, `flatWorldVantage` (`15°` downward vantage step-back), `registerDynamicLandmark`, `searchLandmarks`, `getLandmark`.
- **`LandmarkColliders.ts`**:
  - `SOLID_LANDMARKS`: 23 analytical elevation/collision volumes for aircraft flight (`10` peaks: Everest `8.848 km`, Mont Blanc `4.808 km`, Matterhorn `4.478 km`, Fuji `3.776 km`, Grand Canyon `2.150 km`, Kilimanjaro `5.895 km`, Yosemite Half Dome `2.695 km`, Uluru `0.863 km`, Cuernos del Paine `2.600 km`, Erebus `3.794 km`; `13` monuments/skyline masses: Eiffel Tower `0.365 km`, Burj Khalifa `0.838 km`, Tokyo Tower `0.357 km`, Manhattan Midtown `0.443 km`, Pyramids of Giza `0.200 km`, Colosseum `0.070 km`, Sydney Opera House `0.070 km`, Marina Bay Sands `0.205 km`, Golden Gate `0.227 km`, Tower Bridge `0.070 km`, Sagrada Família `0.207 km`, Christ the Redeemer `0.742 km`, Machu Picchu `2.720 km`).
  - Collider profile height: `baseKm + (peakKm - baseKm) * max(0, 1 - distKm / radiusKm)^profilePow` evaluated via `geoDistanceKm` (`R = 6371 km`).

#### `src/flight/GroundCover.ts`
- **3D Tile-Driven Instanced Vegetation**:
  - Plants instanced `conifer` (4 drooping ragged cones + trunk), `broadleaf` (6 icosahedron lobes + trunk + 3 limbs, `bareInWinter(6.6, 0.94)`), and `shrub` (6 ragged lobes, `bareInWinter(0.4, 0.6)`) geometries.
  - Captures top-down orthographics of loaded 3D Tiles every `1.5 s` (`RES = 512 | 384`, `SPAN_KM = 4 | 3`, `CELL = 2 | 3`, `MAX_TREES = 24000 | 8000`, `MAX_SHRUBS = 7000 | 3000`, `SHRUB_REACH_M = 140 | 100`, `SHRUB_STEP_M = 3.5 m`, `SHRUB_MAX_AGL_KM = 0.3`).
  - Asynchronous pixel readback validates: `uErr <= MAX_TILE_ERROR_M (15 m)`, vegetation green hue filter, terrain slope/3D relief rejection (`<= 3 m` for trees, `<= 1.5 m` for shrubs), and temporal height stability across 2 consecutive captures (`<= 3 m` trees, `<= 2 m` shrubs).
  - Renders `shadowTarget` (`2048 | 1024 px`) every 6 frames fed into `PhotorealEarth.setTreeShadow`.
  - Uses `seasonAt(doy, latDeg)` for spring greens, autumn foliage, winter bare branches, and snow cover.

#### `src/explorer/EarthSearch.ts`, `ReverseGeocode.ts` & `ScreenLabels.ts`
- **`EarthSearch.ts`**: `searchEarthPlaces` queries OpenStreetMap Nominatim `/search` (limit 8), maps result types to `viewAltitudeKm` (`1.2` buildings/monuments, `4.0` peaks, `15.0` countries/states, `2.2` default), and calls `registerDynamicLandmark`.
- **`ReverseGeocode.ts`**: `placeNameAt(lat, lon, altKm)` queries Nominatim `/reverse` with altitude-adaptive zoom (`14`, `10`, `6`, `3`), `1.5 s` request throttling, spatial cell caching, and `atSea` detection.
- **`ScreenLabels.ts`**: DOM label overlay (`zIndex: 15`) projecting 3D anchors to screen coordinates with greedy vertical collision avoidance (`[0, 16, -16, 32]` px offsets) and automatic sky-twin merging (`A · B` within `26 px`).

---

### 8. `CloudSea` Volumetric Cloud Engine

#### 3D Noise Generator & Web Worker Loader (`cloudNoiseGenerator.ts`, `cloudNoise.worker.ts`, `cloudNoiseLoader.ts`)
- **`CLOUD_NOISE_SIZE = 64`**: generates a `64×64×64` tileable RGBA `Uint8Array` (`64^3 * 4` bytes):
  - **`R` channel (`perlinFbm3D`)**: 4-octave periodic 3D gradient Perlin FBM (`baseFreq = 2`, 12 edge `GRADS`, quintic `fade(t) = 6t^5 - 15t^4 + 10t^3`, `hash3` using primes `374761393`, `668265263`, `2147483647`, `1274126177`), domain-warped by 3 recursive 2-octave Perlin FBMs (`warpStrength = 1.8`, per-call salt `calls * 7919`), remapped as `clamp(0.5 + (sum / ampSum) * 0.75, 0, 1)`.
  - **`G` channel**: `worley3D(size, 4)` (`4³` periodic Worley `1 - sqrt(minSq)`).
  - **`B` channel**: `worley3D(size, 8)` (`8³` periodic Worley `1 - sqrt(minSq)`).
  - **`A` channel**: `worley3D(size, 16)` (`16³` periodic Worley `1 - sqrt(minSq)`).
- **`cloudNoise.worker.ts`**: receives `size` via `onmessage`, invokes `generateCloudNoise(size)`, and transfers the buffer back zero-copy via `[data.buffer]`.
- **`cloudNoiseLoader.ts`**:
  - `createCloudNoiseFallback()` returns a `1×1×1` `[128, 128, 128, 128]` `Data3DTexture` (`RGBAFormat`, `UnsignedByteType`, `RepeatWrapping`, `LinearFilter`, `generateMipmaps = false`).
  - `loadCloudNoiseTexture` spawns module `Worker('./cloudNoise.worker.ts')`, falling back to `setTimeout(..., 0)` main-thread generation if Workers fail or are unavailable, and returns a cancellation handle.

#### Volumetric Raymarcher (`src/rendering/VolumetricClouds.ts`)
- **Pass Architecture**:
  - `VolumetricCloudPass extends Pass` renders clouds at `scale = 0.6` into a `HalfFloatType` target (`needsSwap = true`) and composites onto the scene via `s.rgb * c.a + c.rgb` (`V` = pre-multiplied in-scattered radiance, `T` = transmittance).
- **Exact GLSL Constants**:
  - `CS_AS = 9.0`, `CS_XS = 23.5`, `CS_LS = 150.0`, `CS_ES = 330.0`, `CS_IS = 34.0`, `CS_NS = 2.3`, `CS_SS = 2.2`, `CS_Q = 0.28`, `CS_VS = 0.7`.
- **Dual-Layer Density & Erosion (`weatherAt`, `cloudAt`)**:
  - `weatherAt(s)`:
    - `wide = (r(s.x, uAge * 0.5, s.z) / 330 - 0.5) * 2.2` (`CS_ES = 330.0`, `CS_SS = 2.2`)
    - `farW = r(s.z, uAge * 0.3 + 37, s.x) / 150` (`CS_LS = 150.0`)
    - `field = (wide * 0.5 + 0.5) * 0.66 + farW * 0.34`, `edge = 0.6 - uCover * 0.2`.
  - `cloudAt(pKm, detailW)`:
    - Normalized shell height: `o = (|pKm - uEarthC| - rb) / thick`.
    - **Earth-locked tangent patch coordinates**: `q = uEarthRot * (pKm - uEarthC)`, `i = vec3(dot(q, uPatchEast)/uUnitKm + uDrift.x, o * 15.0, dot(q, uPatchNorth)/uUnitKm + uDrift.y)`.
    - Dual-layer blend: upper cumulus `m = smoothstep(edge, edge + 0.1, field) * 0.86 * smoothstep(0, 0.12, uCover)` with `billow` & vertical profile `I`, combined with lower carpet `v = uDeck` & profile `z`.
    - Base sheared Worley/Perlin shaping: `B = 0.55 * r(V / 9 + F) + 0.45 * r(V / 23.5 + F.zxy + 0.37)` (`CS_AS = 9.0`, `CS_XS = 23.5`), remapped by `D = clamp((B - 0.28) / (0.7 - 0.28), 0, 1)` (`CS_Q = 0.28`, `CS_VS = 0.7`), `e = max(r0, r1)`.
    - High-frequency Worley erosion: `C = readNoise(i / 2.3 - F * 9.0)` (`CS_NS = 2.3`), `d = C.g * 0.6 + C.b * 0.4`, inverted by `o * 3.0`, weighted by `0.4 * detailW`.
- **Self-Shadowing, Scattering & Raymarching**:
  - `towardsSun(pKm)`: integrates density over up to 4 solar steps `s0 = 0.45 * uUnitKm`, `s1 = 1.40 * uUnitKm`, `s2 = 3.60 * uUnitKm`, `s3 = 8.50 * uUnitKm`, optical depth `i = acc * uDensity * (0.55 / uUnitKm)`, returning dual-scattering transmittance `(exp(-i) + 0.4 * exp(-0.22 * i)) / 1.4`.
  - **Dual Henyey-Greenstein phase**: `D = min(mix(hg(mu, 0.62), hg(mu, -0.25), 0.3), 2.6)` (`hg` omits the `1/(4*PI)` normalization factor and clamps peak forward scatter at `2.6`).
  - Spherical shell ray intersection between `rb = uR0 + uBase` and `rt = uR0 + uTop`, clamped by linearized scene depth `tDepth` (`sceneKm`) and `uReach`.
  - Exponential step sizing `L` capped by `vGrow = (reach / (0.9 * uUnitKm))^(1 / steps) - 1`, starting offset `E = t0 > uUnitKm ? 0.04 * uUnitKm : 0.28 * uUnitKm`, jittered with a spatial hash + golden ratio temporal rotation `fract(hash + uFrame * 0.61803399)`.
  - Up to `96` raymarch iterations with early opacity exit at `T < 0.015`, Beer-Lambert absorption `K = 1 - exp(-Z * uDensity * dStep / uUnitKm)`, storm lightning term `flashLit = vec3(0.75, 0.85, 1.0) * uFlash * (0.4 + 0.6 * (1 - ts))`, and exponential horizon fog `exp(-tMid / (reach * 0.58))` with `sunHorizonGlare`.

#### Cloud Director, Palettes & Live Weather (`src/flight/EarthClouds.ts`)
- **Lighting Palettes & Blending**:
  - `DAY`: Sun `#fffaf2 * 3.35`, Sky `#86b5f2 * 1.45`, Bounce `#b6cce8 * 1.05`, Haze `#9ec8f5 * 1.30`.
  - `GOLD`: Sun `#ffaa74 * 4.0`, Sky `#b49ee0 * 1.12`, Bounce `#c88aa6 * 0.85`, Haze `#eb966c * 1.25`.
  - `NIGHT`: `(0.015, 0.022, 0.045)`, `(0.01, 0.013, 0.026)`, `(0.012, 0.018, 0.04)` plus `MOON_LIGHT` and warm urban `cityGlow` underside bounce `(0.05, 0.028, 0.01)`.
  - Smooth solar elevation transitions: `goldBlend = smoothstep(sunUp, -0.10, 0.02)`, `dayBlend = smoothstep(sunUp, 0.02, 0.30)`.
  - Storm darkening multipliers: `sun * 0.65`, `sky * 0.72`, `bounce * 0.55`, `haze * 0.68`.
- **Open-Meteo `LiveWeatherService` & `WMO` Code Mapping**:
  - Queries `https://api.open-meteo.com/v1/forecast?...&current=cloud_cover,cloud_cover_low,weather_code,precipitation,wind_speed_10m,wind_direction_10m,visibility&wind_speed_unit=ms`, throttled to `>= 80 km` travel or `>= 600000 ms` (10 minutes).
  - `weatherFromCode(code, precipMm)`:
    - `>= 95`: `'storm'`, intensity `0.9`
    - `71..77 | 85 | 86`: `'snow'`, intensity `min(1, 0.4 + 0.3 * p)`
    - `51..67 | 80..82`: `'rain'` / showers, intensity `min(1, 0.35 + 0.25 * p)`
    - `45 | 48`: `'Fog'` (`clear` precipitation kind)
    - `3`: `'Overcast'`
    - `1 | 2`: `'Partly cloudy'`
    - Else: `'Clear'`
- **`EarthClouds` Runtime Control**:
  - Warms `cloudNoiseLoader` worker immediately on startup.
  - Computes `regionalGround` over a 3×3 DEM `z8` grid spanning `±0.14°` (eased `tau = 15 s`, fallback `camKm - aglKm` clamped `[0, 8.5]`).
  - `syncTangentBasis` re-anchors `uPatchEast` / `uPatchNorth` whenever `camLocalUp.dot(patchUp) < 0.88`.
  - Eases weather parameters (`tau = 4 s`):
    - `clear`: `cover = 0.40`, `deck = 0.56`, `lift = 1.25`, `thick = 2.2`, `density = 1.4`
    - `auto`: `cover = lerp(0.48, 0.64, liveCover)`, `deck = lerp(0.76, 0.845, liveCover)`, `lift = 0.95`, `thick = 2.5 + 0.55 * coverT`, `density = 1.5`
    - `rain`: `cover = 0.78`, `deck = 0.87`, `lift = 0.75`, `thick = 3.2`, `stratus = smoothstep(coverT, 0.76, 0.96)`, `density = 1.65`
    - `storm`: `cover = 0.88`, `deck = 0.90`, `lift = 0.65`, `thick = 5.0`, `density = 1.85`
  - Sets `unitKm = max(0.16, thickKm / 15)`, integrates wind-driven `uDrift`, applies quality-tier raymarch LOD (`uSteps: 64 / 52 / 36`, `uSunSteps: 4 / 4 / 3`, `uDetail: 1 / 1 / 0`), and exposes an `inside` cloud-mist factor for cockpit/radio effects.

---

### 9. Atmospheric Weather & Precipitation (`src/flight/Weather.ts`)

- **Weather Kinds & Climate Model**:
  - `WeatherKind`: `'clear' | 'rain' | 'snow' | 'storm' | 'dust' | 'methane' | 'acid' | 'turbulence'`; `WeatherMode`: `'auto' | 'clear' | 'rain' | 'snow' | 'storm'`.
  - `Weather.climate(world, lat, lon, altKm, hourIndex)` evaluates deterministic `6°×6°` grid cells:
    - **Earth**: ITCZ, subtropical dry belt, and mid-latitude storm probabilities (`0.55 / 0.18 / 0.42 / 0.30`), switching rain to snow above `freezingKm = max(0, 4.8 * cos^2(lat) - 0.4)`.
    - **Mars**: dust (`dust`).
    - **Titan**: methane precipitation below `20 km` (`methane`).
    - **Venus**: acid cloud veil between `45–72 km` (`acid`).
    - **Jupiter & Saturn**: convective `turbulence` and storm lightning.
- **Precipitation Volumes, Veil & Canopy Drops**:
  - `N = 1400` particles in a `BOX = 60 m` camera-wrapping volume:
    - `LineSegments` for rain (`fallMps = 9`), dust (`0`), and methane (`1.6`), relative speed capped at `900 m/s`, streak `stretch` `0.045 / 0.02`.
    - `Points` for snow (`1.2 m/s`, point size `0.09`).
  - `ShaderMaterial` billowing white-out `veil` (`renderOrder = -50`, `CustomBlending`) for cloud/storm/acid immersion.
  - `240` cockpit/GoPro canopy `Drops` (`dropAge` max `1.2 s`, swept radially outward at `min(1.5, speed / 200) * dt * 0.35`).
  - **Lightning**: schedules `nextFlash = 2.5 + rand() * 7` s, decays at `dt * 5`, and fires `onLightning(0.5..8 km)`.

---

### 10. Sky Phenomena & Living World (`src/flight/SkyEvents.ts`, `src/flight/AliveWorld.ts`)

> **Scope Note**: In the inspected `SkyEvents.ts` and `AliveWorld.ts` files, the implemented phenomena are **eclipses (corona + diamond ring), solar flares/CMEs, comets, meteors/fireballs/showers, bird flocks, and airliners with contrails**. Auroras and ISS/satellites are not implemented in these two modules.

- **`SkyEvents.ts` (Overlay Scene at `D = 900 m`)**:
  - **Eclipses**: computes eclipse overlap `t = (oc.angle - sep) / sunAngle`, `sunVisible = clamp((1 - t) / 2, 0, 1)`, `canBeTotal = oc.angle > sunAngle * 0.98`; renders a `10` solar-radii `corona` plane (K-corona `r^-3.2`, streamers `r^-1.8`, prominences, occluded by `uBodyDir / uBodyCos`) and a `diamond` ring flash peaking via `exp(-((t - 0.9) / 0.14)^2)`.
  - **Solar Flares & CMEs**: triggered when `air < 0.3`, `sunInView > 0.05`, and `sunVisible > 0.5` every `nextFlare = 45..135 s`; simulates `M`/`X`-class flares (`1.0..9.0`) with `flareBoost` peaking at `0.6 s` (`1.4` max) and an expanding CME sprite (`1.2 + a * 0.9` scale over `10 s`).
  - **Comets**: spawn in `deepSpace` or `storm` (`air === 0`) every `nextComet` (`70..180 s`, or `30..70 s` in storm) with lifetimes of `40..70 s` (`14..24 s` in storm) and procedural designations `C/<year> <letter><1..9>`; rendered with a `coma` sprite, straight blue anti-solar `ionTail`, and `0.16 rad`-angled warm curved `dustTail`.
  - **Meteors, Fireballs & Showers**: pool of `METEORS = 24` line streaks active at night (`dark = 1 - smoothstep(sunElev, -0.12, 0.02)`, `air > 0.02 || overAir`), spawning every `1.5..5.5 s` (`0.25..0.85 s` during a `25 s` `radiant` meteor shower with `12%` trigger probability); streaks span `6..25°`, and `fireball` events (`8%` ground / `25%` orbit) attach a `fireGlow` sprite.
- **`AliveWorld.ts` (Earth Surface Frame Children, `METRE = 1 / 6378137`, `R_M = 6378137`)**:
  - **Bird Flocks**: `FLOCKS = low ? 2 : 4`, `BIRDS = low ? 14 : 24`, active when `altKm < 2.5 && sunUp > -0.03`; reseats flocks `> 4500 m` away (`600..2500 m` range, `40..220 m` altitude, `radiusM = 70..230`, `10..17 m/s`) with vertex-shader wing flapping `sin(uT * 11 + ph) * 0.22 * aWing`.
  - **Airliners & Contrails**: `AIRLINERS = low ? 4 : 8`, active below `60 km` altitude; reseats `> 170 km` away (`30..140 km` range, `9.5..11.5 km` cruise altitude, `225..255 m/s`), propagating along great circles with a `60 m` procedural fuselage and `7 km` (`CONTRAIL_M = 7000`, `w = 30..120 m`) crossed additive-fading contrail ribbons.

---

### 11. Earth Suborbital Transit, Gamepad Input & Flight Units (`EarthTransit.ts`, `PadTrigger.ts`, `worlds.ts`)

- **`src/flight/EarthTransit.ts`**:
  - **`SPEED_TIERS`**:
    - `jet`: standard aircraft speed tier (no `airLimitMps` / `driveFloorMps` overrides).
    - `hypersonic` (`Hypersonic · Mach 6`): `airLimitMps = 2050`, `driveFloorMps = 1700`, `airAccelScale = 12`.
    - `scramjet` (`Scramjet · Mach 25`): `airLimitMps = 8600`, `driveFloorMps = 7500`, `airAccelScale = 60`.
  - **Great-Circle & Suborbital Maths**:
    - `greatCircleKm`: haversine angular distance multiplied by Earth mean radius `R = 6371 km`.
    - `planTransit(distanceKm, startKm)`: `cruiseKm = clamp(distanceKm * 0.02, 25, 60)`, `durationS = clamp(distanceKm / 40 + 18, 18, 200)`, `endKm = 2.2`.
    - `transitAt(plan, t)`: normalized time `x = clamp(t / durationS, 0, 1)`; cycloidal ground-track progress `along = x - sin(2 * PI * x) / (2 * PI)` (`0..1` with smooth zero-velocity ends and peak speed `2×` average); altitude smoothsteps up from `startKm` to `cruiseKm` over `x ∈ [0, 0.2]` and back down to `endKm` over `x ∈ [0.8, 1.0]`.
    - `slerpUnit(a, b, f)`: spherical linear interpolation between unit-sphere departure and destination directions.
- **`src/flight/PadTrigger.ts`**:
  - `triggerPull(state, v, nowMs)`: deadzone and resting-drift calibration for analog gamepad triggers—tracks `rest = min(rest, v)` or learns any steady value `< 0.5` held within `0.01` for `> 1500 ms`, ignoring the first `0.1` travel past `rest`.
- **`src/flight/worlds.ts`**:
  - Re-exports `AIR` / `AirProfile` and defines `LIGHT_SPEED_KMS = 299_792.458`, `AU_KM = 149_597_870.7`, `JET_RESUME_KEY = 'solaris.jetResume'`, and formatters `formatSpeed` (`m/s`, `km/s`, `c`), `formatDistance` (`m`, `km`, `M km`, `AU`, `ly`), and `formatEta` (`s`, `min`, `h`, `d`, `yr`).

---

## Part VI: Jet Physics, Aerodynamics, Multi-Planet Gravity, Maneuvers/FBW, 3D Cockpit & Flight HUD

### 1. Airframes (`AirframeSpecs.ts`, `ManeuversAndFBW.ts`, `JetModel.ts`, `JetHUD.tsx`)

- **Body & Frame Conventions**:
  - **Solaris Three.js Body Frame (`B3`)**: nose points along `-Z`, right wing along `+X`, dorsal roof along `+Y`.
  - **Aerospace FRD Mapping**: forward velocity $u = -v_z$, sideslip velocity $v = v_x$, downward velocity $w = -v_y$; body angular rates $[p, q, r]_{\text{FRD}} = [-r_z, r_x, -r_y]_{\text{B3}}$ (`[pitchUp, yawLeft, rollLeftDown]` in B3); body moments $[L_{\text{roll}}, M_{\text{pitch}}, N_{\text{yaw}}]_{\text{FRD}} = [-M_z, M_x, -M_y]_{\text{B3}}$.
  - **Persistence & Selection**: `AIRFRAME_KEY = 'solaris.jet'` in `localStorage` selects `'gripen'` or `'su30'` via `chosenAirframe()` (defaults to `'gripen'` in `JetModel.ts`; `FlightModel` defaults `airframeId` to `'kestrel'` until configured by `JetController`).
- **JAS 39C Gripen (`id: 'gripen'`)**:
  - **3D Asset & Anchors (`GRIPEN_ANCHORS`)**: GLB `models/gripen.glb` (`noseAlongPositiveX: true` $\rightarrow +90^\circ$ Y rotation, `modelScale: 0.8533`, `lengthM: 14.1`, `hasInterior: true`); nominal eye `(0, 0.56, -4.62)`, GoPro mount `(0.04, 0.68, -4.56)`, HUD combiner centre `(0, 0.47, -5.18)` with `hudWidthM: 0.20`, single nozzle `(0, 0, 5.46)` (`nozzleRadiusM: 0.41`), wingtips `(±4.01, -0.19, 2.61)`, fin tips `(±0.05, 2.47, 4.57)`, tail light `(0, 2.05, 4.94)`, strake vortex `(±2.14, 0.2, -1.68)`, wheel anchors (nose `(0, -1.55, -4.35)`, mains `(±1.15, -1.55, 0.85)`, `bayY: -0.62`); hidden meshes/materials (`bullet_glass_holes`, `bulletholes`, `damaged_gauges`, `gunfire`, `jet_flame_diamonds`; `Object_17/65/66/72`; `insideHideMeshes`: `Object_11/43/75/78/13/15/18`), 11-station `canopyProfile`, and 5 `insideClip` boxes.
  - **Mass & Fuel**: `emptyMassKg = 6800`, `maxFuelKg = 2400`, `initialFuelKg = 1700` (default combat mass $8500\text{ kg}$, max internal takeoff mass $9200\text{ kg}$, empty + 2% reserve floor $48\text{ kg}$).
  - **Geometry & Inertia**: `wingAreaM2 = 30.0`, `spanM = 8.02`, `macM = 4.10`, `effAspectRatio = 2.9`, `sweepDeg = 43`, `thicknessRatio = 0.045`; inertia tensor $[I_{xx}, I_{yy}, I_{zz}, I_{xz}] = [11500, 62000, 71000, 1100]\text{ kg}\cdot\text{m}^2$.
  - **Propulsion (`1x Volvo RM12`)**: `dryThrustN = 54000`, `wetThrustN = 80500` (dry-to-wet ratio $1.491$; sea-level static combat $T/W = \frac{80500}{8500 \times 9.80665} \approx 0.966$, dry $T/W \approx 0.648$); `tsfcDryKgPerNs = 2.21e-5` ($0.78\text{ kg/(kgf}\cdot\text{h)}$), `tsfcWetKgPerNs = 5.38e-5` ($1.90\text{ kg/(kgf}\cdot\text{h)}$), `idleFlowKgPerS = 0.12`, `throttleRecoveryTempRatio = 1.06`.
  - **Flight Envelope & Control Surfaces**: `gLimitPos = +9.0`, `gLimitNeg = -3.0`, `highGLimit = +11.5`, `gOnset = 14.0\text{ G/s}`, `normAlphaLimitDeg = 26`, `highGAlphaLimitDeg = 35`; `hasCanards = true`, `hasTvc = false`, `hasDragChute = false`; `maxPitchRateRad = 1.7`, `maxRollRateRad = 5.2`, `maxYawRateRad = 0.9`; `designVneMps = 750`, `designMachMax = 2.05`, `qLimitPa = 78000`; `aero`: `{ cl0: 0.05, kvVortex: 2.85, cd0Clean: 0.018, oswaldE: 0.72, alphaStallPosDeg: 28, alphaStallNegDeg: -18, clMaxClean: 1.55, clMaxFlaps: 2.05 }`.
- **Su-30MKK Flanker-G (`id: 'su30'`)**:
  - **3D Asset & Anchors (`SU30_ANCHORS`)**: GLB `models/su30mkk.glb` (`noseAlongPositiveZ: true` $\rightarrow 180^\circ$ Y rotation, `lengthM: 22.6`, `hasInterior: true`); front-seat eye `(0, 1.15, -7.8)`, GoPro mount `(0.04, 1.27, -7.74)`, HUD centre `(0, 1.13, -8.44)` with `hudWidthM: 0.24`, twin nozzles `(±1.2, -0.51, 6.84)` (`nozzleRadiusM: 0.55`), wingtips `(±7.4, -0.11, 2.32)`, fin tips `(±2.15, 3.8, 6.2)`, tail light `(0, 0.3, 8.75)`, strake vortex `(±2.05, 0.22, -2.55)`, wheel anchors (nose `(0, -2.25, -7.65)`, mains `(±2.05, -2.25, 0.85)`, `bayY: -1.18`), plus flush 3-screen `dynamic_mfd` cluster built by `buildSu30MfdCluster` and cockpit stick/throttle/console extraction boxes.
  - **Mass & Fuel**: `emptyMassKg = 18400`, `maxFuelKg = 9640`, `initialFuelKg = 6600` (default combat mass $25000\text{ kg}$, max internal mass $28040\text{ kg}$, 2% reserve floor $192.8\text{ kg}$).
  - **Geometry & Inertia**: `wingAreaM2 = 62.0`, `spanM = 14.80`, `macM = 4.85`, `effAspectRatio = 3.53`, `sweepDeg = 38`, `thicknessRatio = 0.048`; inertia tensor $[42000, 215000, 248000, 3200]\text{ kg}\cdot\text{m}^2$.
  - **Propulsion (`2x Saturn AL-31FP (32 deg TVC)`)**: `dryThrustN = 149000`, `wetThrustN = 245160` (SLS combat $T/W = \frac{245160}{25000 \times 9.80665} \approx 1.000$, dry $T/W \approx 0.608$); `tsfcDryKgPerNs = 2.12e-5` ($0.75\text{ kg/(kgf}\cdot\text{h)}$), `tsfcWetKgPerNs = 5.55e-5` ($1.96\text{ kg/(kgf}\cdot\text{h)}$), `idleFlowKgPerS = 0.35`, `throttleRecoveryTempRatio = 1.08`.
  - **Flight Envelope & Control Surfaces**: `gLimitPos = +9.0`, `gLimitNeg = -3.0`, `highGLimit = +11.5`, `gOnset = 14.0\text{ G/s}`, `normAlphaLimitDeg = 28`, `highGAlphaLimitDeg = 38`; `hasCanards = false`, `hasTvc = true`, `hasDragChute = true`, `tvcArmM = 6.8`, `tvcMaxDeg = 15`, `tvcCantDeg = 32`, `tvcSlewDegPerSec = 30`, `tvcRollArmM = 1.2`; `maxPitchRateRad = 1.65`, `maxRollRateRad = 4.1`, `maxYawRateRad = 0.95`; `designVneMps = 720`, `designMachMax = 2.35`, `qLimitPa = 82000`; `aero`: `{ cl0: 0.07, kvVortex: 2.75, cd0Clean: 0.022, oswaldE: 0.76, alphaStallPosDeg: 27, alphaStallNegDeg: -18, clMaxClean: 1.50, clMaxFlaps: 2.00 }`.
- **Kestrel SX-1 (`id: 'kestrel'`, Built-in Procedural Airframe)**:
  - **Geometry & Fallback Mesh**: `JET_LENGTH_M = 17.2`, cranked-arrow fuselage loft with twin canted fins, differential stabilators, dorsal airbrake, 3-strut retractable gear, 14-petal titanium iris nozzles at `(±0.56, 0, 8.2)`, and procedural 3-MFD fallback cockpit when `!model.hasInterior`.
  - **Mass, Fuel & Propulsion (`1x Solaris S-132 Vectored Turbofan`)**: `emptyMassKg = 10200`, `maxFuelKg = 4500`, `initialFuelKg = 3300` (combat $13500\text{ kg}$, max $14700\text{ kg}$); `wingAreaM2 = 42.0`, `spanM = 10.90`, `macM = 4.25`, `effAspectRatio = 2.83`, `sweepDeg = 40`, `thicknessRatio = 0.045`; `dryThrustN = 82000`, `wetThrustN = 132000`; `tsfcDryKgPerNs = 2.15e-5`, `tsfcWetKgPerNs = 5.45e-5`, `idleFlowKgPerS = 0.20`, `throttleRecoveryTempRatio = 1.08`; inertia $[21000, 118000, 134000, 1800]\text{ kg}\cdot\text{m}^2$.
  - **Envelope & Orthogonal TVC**: `gLimitPos = +9.0`, `gLimitNeg = -3.0`, `highGLimit = +11.5`, `normAlphaLimitDeg = 27`, `highGAlphaLimitDeg = 36`, `hasCanards = false`, `hasTvc = true`, `hasDragChute = true`, `tvcArmM = 6.2`, `tvcMaxDeg = 15`, `tvcCantDeg = 0`, `tvcSlewDegPerSec = 40`, `tvcRollArmM = 0.9`; `maxPitchRateRad = 1.75`, `maxRollRateRad = 4.8`, `maxYawRateRad = 0.95`; `designVneMps = 760`, `designMachMax = 2.40`, `qLimitPa = 85000`; `aero`: `{ cl0: 0.06, kvVortex: 2.65, cd0Clean: 0.019, oswaldE: 0.78, alphaStallPosDeg: 28, alphaStallNegDeg: -18, clMaxClean: 1.55, clMaxFlaps: 2.05 }`.
- **Propulsion Thrust Lapse & Fuel Burn (`AirframeSpecs.ts`)**:
  - **Inlet Pressure Recovery (`MIL-E-5008B`)**:
    $$\eta_r(M) = \begin{cases} 1.0, & M \le 1 \\ \max\left(0.08,\; 1 - 0.075\,(M - 1)^{1.35}\right), & M > 1 \end{cases}$$
  - **Isentropic Stagnation & Mass Flow**: normalized against surface/1-bar reference ($\theta_{\text{amb}} = T_{\text{amb}}/T_{\text{ref}}$, $\delta_{\text{amb}} = P_{\text{amb}}/P_{\text{ref}}$, where Solaris mode normalizes against the active planet's `surfaceTempK` / `surfacePressurePa` even without $\text{O}_2$, while `'airbreathing'` mode returns $0$ thrust if `!hasOxygen`):
    $$\theta_0 = \theta_{\text{amb}}\!\left(1 + \frac{\gamma - 1}{2}M^2\right), \qquad \delta_0 = \delta_{\text{amb}}\!\left(1 + \frac{\gamma - 1}{2}M^2\right)^{\gamma/(\gamma-1)}, \qquad \dot{m}_{\text{rel}} = \frac{\eta_r\,\delta_0}{\sqrt{\max(\theta_0, 0.15)}}$$
  - **Core Thermal Limit & Jet-Tier Thrust Lapse**: with $\text{overTemp} = \max\!\left(0,\frac{\theta_0 - TR}{\max(0.1,\theta_0)}\right)$ ($TR =$ `throttleRecoveryTempRatio`):
    $$\text{dryCoreFactor} = \max\!\left(0.05,\; 1 - 1.55\,\text{overTemp} - 0.32\min(M, 2.5)\right), \qquad \text{wetAbFactor} = \max\!\left(0.12,\; 1 - 0.55\,\text{overTemp} - 0.24\min(M, 2.8)\right)$$
    - Above `designMachMax`, ram/thermal roll-off applies $\max(0.15,\; 1 - 0.45(M - M_{\max}))$.
  - **Hypersonic / Scramjet Tier Thrust (`speedTier = 'hypersonic' | 'scramjet'`)**: `ceilingMach = 6.5` (hypersonic) or `25.5` (scramjet); `tierScale` defaults to `12` (hypersonic) or `60` (scramjet) unless overridden by `airAccelScale`.
  - **TSFC Fuel Flow & Reserve Floor (`stepFuelMassKg`)**:
    $$\text{TSFC} = \text{TSFC}_{\text{dry}} + \text{abFrac}\,(\text{TSFC}_{\text{wet}} - \text{TSFC}_{\text{dry}}), \qquad \dot{m}_f = \max\!\left(\dot{m}_{\text{idle}}(0.6 + 0.4\,\text{thr}),\; T_{\text{total}}\cdot\text{TSFC}\right)$$
    - Fuel is clamped to reserve floor `spec.maxFuelKg * 0.02` unless `allowFullDepletion = true`.

---

### 2. Aerodynamics (`Aerodynamics.ts`)

- **Flow Angles & Dynamic Pressure**:
  - From body-frame airspeed $(v_x, v_y, v_z)$ in B3 ($u=-v_z$, $v=v_x$, $w=-v_y$, $V = \sqrt{u^2+v^2+w^2}$):
    $$\alpha = \text{atan2}(w, u), \qquad \beta = \arcsin\!\left(\text{clamp}\!\left(\frac{v}{V}, -1, 1\right)\right)\cdot \text{smoothstep}(V, 0.2, 2.0)$$
  - Dynamic pressure: $q = \frac{1}{2}\rho V^2$.
- **Compressible Lift-Curve Slope (`liftCurveSlope`)**:
  - **Subsonic Helmbold-Diederich ($M \le 0.85$)**: with $\beta_M^2 = \max(1 - M^2,\; 1 - 0.85^2)$ and $\eta = 0.95$:
    $$C_{L\alpha,\text{sub}}(M) = \frac{2\pi\,AR_{\text{eff}}}{2 + \sqrt{4 + \left(\frac{AR_{\text{eff}}\sqrt{\beta_M^2}}{\eta}\right)^2\left(1 + \frac{\tan^2\Lambda}{\beta_M^2}\right)}}$$
  - **Supersonic Ackeret Slender-Delta ($M \ge 1.35$)**: $C_{L\alpha,\text{sup}}(M) = \max\!\left(1.75,\; \frac{3.85}{\sqrt{\max(M^2 - 1,\, 0.55)}}\right)$.
  - **Transonic Peak ($0.85 < M < 1.35$)**: smoothstep interpolation up to $C_{L\alpha,\text{peak}} = \max(1.24\,C_{L\alpha}(0.85),\; 1.04\,C_{L\alpha}(1.35))$ at $M = 1.02$, then down to $C_{L\alpha}(1.35)$.
- **Ground Effect (`groundEffectFactors`, Hoerner / Wieselsberger)**:
  - Height-to-span ratio $h/b = \max\left(\frac{h_{\text{AGL}} + 1.2}{b},\; 0.05\right)$. Active for $h/b \le 2$:
    $$\sigma_{GE} = \frac{33\,(h/b)^{1.5}}{1 + 33\,(h/b)^{1.5}}, \qquad k_{GE,L} = 1 + \cos^2\alpha\left(\frac{\pi\,AR_{\text{eff}} + C_{L\alpha}}{\pi\,AR_{\text{eff}} + \sigma_{GE}\,C_{L\alpha}} - 1\right), \qquad \Delta C_{m,GE} = -0.02\,(1 - \sigma_{GE})\cos^2\alpha$$
- **Lift Coefficient $C_L(\alpha, M, \beta)$ & Post-Stall Physics**:
  - **Polhamus Leading-Edge Vortex Lift Decay**: $k_v = k_{v,0}\,(1 - 0.45\,\text{smoothstep}(M, 0.85, 1.5))$.
  - **Dynamic Stall Angle Shift**:
    $$\alpha_{\text{stall},+} = \alpha_{\text{stall},+,0} + 6^\circ d_s - 2^\circ d_f - 4^\circ\,\text{smoothstep}(M, 0.75, 1.15)$$
    $$\alpha_{\text{stall},-} = \alpha_{\text{stall},-,0} - 4^\circ d_s$$
  - **Smooth Stall & Vortex-Burst Blend**:
    $$w_{\text{att}} = \frac{1}{1 + e^{20(\alpha - \alpha_{\text{stall},+})}} \cdot \frac{1}{1 + e^{-20(\alpha - \alpha_{\text{stall},-})}}, \qquad w_{\text{vortex}} = \frac{1}{1 + e^{12(|\alpha| - (\alpha_{\text{stall},+} + 7^\circ))}}$$
  - **Attached Lift**: $C_{L,\text{pot}} = (C_{L0} + 0.42\,d_f + 0.24\,d_s)\cos\alpha + C_{L\alpha}\,k_{GE,L}\sin\alpha\cos^2\alpha$, plus vortex lift $C_{L,\text{vortex}} = k_v \sin^2\alpha\cos\alpha\,\text{sign}(\alpha)\,w_{\text{vortex}}$; $C_{L,\text{att}} = C_{L,\text{pot}} + C_{L,\text{vortex}}$.
  - **Post-Stall 3D Flat-Plate ($0^\circ\text{–}180^\circ$ & Tailslide)**: with $\text{aftBlend} = \text{smoothstep}(-\cos\alpha, 0, 1)$,
    $$C_{L,\text{fp}} = 0.96\sin(2\alpha)(1 - 0.12\,\text{aftBlend}) + 0.04\max(0, \cos\alpha)$$
  - **Wake Blanking & Total $C_L$**: elevon effectiveness $\eta_e = 1 - 0.55\,\text{smoothstep}(|\alpha|, 35^\circ, 75^\circ)$, rudder $\eta_r = 1 - 0.85\,\text{smoothstep}(|\alpha|, 25^\circ, 55^\circ)$, aileron $\eta_a = 1 - 0.65\,\text{smoothstep}(|\alpha|, 28^\circ, 65^\circ)$;
    $$C_L = \cos^2\beta\left[w_{\text{att}} C_{L,\text{att}} + (1 - w_{\text{att}}) C_{L,\text{fp}}\right] - 0.32\,\eta_e\,\delta_e\cos^2\beta$$
- **Drag Polar $C_D$ (`waveDragCoeff`, `inducedDragFactor`, Crossflow)**:
  - **Korn Drag-Divergence $M_{\text{crit}}$ & Sears-Haack Wave Drag $C_{Dw}$**:
    $$M_{\text{crit}} = \text{clamp}\!\left(0.83 + 0.025\,\text{sweepAdj} - 1.2\,(t/c - 0.045) - 0.05\min(|C_L|, 1.5),\; 0.72,\; 0.90\right)$$
    - Above $M_{\text{crit}}$, $C_{Dw} = \text{basePeak}\cdot\text{smoothstep}(M, M_{\text{crit}}, 1.05)\cdot\text{tail}(M)\cdot\left(1 + 0.38\,e^{-((M - 1.04)/0.085)^2}\right)$ where $\text{basePeak} = 0.0165\,(t/c / 0.045)^2\,(1 - 0.08\,\text{sweepAdj})$ and $\text{tail} = (1 + 1.35(M - 1.04))^{-0.70}$ for $M > 1.04$.
  - **Parasitic & Configuration Drag**:
    $$C_{D0,\text{total}} = C_{D0,\text{clean}} + C_{Dw} + 0.024\,d_f + 0.009\,d_s + 0.022\,d_g + 0.068\,d_{sb}$$
  - **Induced Drag Factor $k(M)$**: subsonic $k_{\text{sub}} = (\pi\,AR_{\text{eff}}\,e_{\text{eff}})^{-1}$ where $e_{\text{eff}} = e_0(1 - 0.1\,d_f - 0.06\,d_g)$, transitioning across $M \in [0.85, 1.35]$ to supersonic leading-edge suction loss $k_{\text{sup}} = \text{clamp}\!\left(\frac{\sqrt{M^2 - 1}}{4},\; \max(1.5\,k_{\text{sub}}, 0.22),\; 0.45\right)$.
  - **Total $C_D$**: attached drag $C_{D,\text{att}} = C_{D0,\text{total}} + \sigma_{GE} k(M) C_{L,\text{pot}}^2 + 0.55 k_v |\sin\alpha|^3 w_{\text{vortex}}$; post-stall bluff drag ($C_{D90}=1.48$, $C_{D180}=0.36$) $C_{D,\text{fp}} = C_{D0,\text{total}} + (C_{D90}-C_{D0,\text{total}})\sin^2\alpha + (C_{D180}-C_{D0,\text{total}})\,\text{aftBlend}\max(0,-\cos\alpha)^2$; total:
    $$C_D = w_{\text{att}} C_{D,\text{att}} + (1 - w_{\text{att}}) C_{D,\text{fp}} + 1.15\sin^2\beta$$
- **Forces, Moments, Gain Compression & Stevens-Lewis 6-DOF**:
  - **Dynamic Pressure Gain Compression**: $q_{\text{ref}} = 35000\text{ Pa}$, $\text{qGainCompress} = \min(1,\, 35000 / \max(q, 35000))$ scales `elev`, `ail`, `rud` deflections before coefficient evaluation.
  - **Static Stability & Crossflow**: $C_Y = C_{Y\beta}\sin\beta\cos\beta - 1.25\sin\beta|\sin\beta| - 0.18\,\eta_r\,\delta_r$; directional stiffness $C_{n\beta}(M, \alpha)$ degrades by $1 - 1.15\,\text{smoothstep}(|\alpha|, 24^\circ, 48^\circ)$ due to vertical tail blanking; static pitch stiffness $C_{m\alpha} = 0.04 - 0.39\,\text{smoothstep}(M, 0.85, 1.35)$ shifts aft past Mach 1, plus deep-stall pendulum restoring torque $-0.35(1-w_{\text{att}})\sin\alpha\max(0.2, |\cos\alpha|+0.3)$.
  - **Singularity-Free Dimensional Damping**: $\text{dampLat} = 0.25\,\rho V S b^2$, $\text{dampLon} = 0.25\,\rho V S \bar{c}^2$; roll damping $C_{lp} = -0.38(1 - 1.12\,\text{smoothstep}(|\alpha|, 26^\circ, 44^\circ)\max(0,\cos\beta))$ weakens/reverses slightly in deep stall for autorotation spin susceptibility.
  - **Stevens & Lewis $I_{xz}$-Coupled Angular Acceleration (`solveEulerAngularAccel`)**: with $\Gamma = \max(10^{-3}, I_{xx}I_{zz} - I_{xz}^2)$:
    $$\dot{p} = \frac{I_{zz}(L + I_{xz}pq - (I_{zz}-I_{yy})qr) + I_{xz}(N - I_{xz}qr - (I_{yy}-I_{xx})pq)}{\Gamma}$$
    $$\dot{q} = \frac{M + (I_{zz}-I_{xx})pr - I_{xz}(p^2-r^2)}{I_{yy}}, \qquad \dot{r} = \frac{I_{xz}c_1 + I_{xx}c_2}{\Gamma}$$
- **Energy-Maneuverability & Corner/Turn Metrics**:
  - **Specific Excess Power ($P_s$)**: $P_s = \frac{(T_{\text{forward}} - D)\,V}{m\,\max(0.2, g_{\text{eff}})}$.
  - **Boyd Corner Speed**: $V_{\text{EAS,corner}} = \sqrt{\frac{2\,n_{\max}\,m\,g_0}{\rho_0 S C_{L,\max}}}$, $V_{\text{TAS,corner}} = V_{\text{EAS,corner}}/\sqrt{\rho/\rho_0}$.
  - **Turn Performance (`computeTurnPerformance`)**: $n_{\text{inst}} = \min\!\left(n_{\max}, \frac{q S C_{L,\max}}{m g_0}\right)$, sustained $C_{L,\text{sust}} = \sqrt{\max(0, \frac{T_{\max}/(qS) - C_{D0,\text{total}}}{k})}$, and level turn rate $\omega = \frac{\sqrt{\max(0, (n g_0)^2 - g_{\text{local}}^2)}}{V}$.

---

### 3. Multi-Planet Atmosphere & Gravity (`PlanetaryPhysics.ts`, `AirProfiles.ts`, `FlightModel.ts`)

- **Physical Constants (`PlanetaryPhysics.ts`)**: $g_0 = 9.80665\text{ m/s}^2$, $G = 6.67430 \times 10^{-11}\text{ m}^3/(\text{kg}\cdot\text{s}^2)$, $R^* = 8314.4626\text{ J/(kmol}\cdot\text{K)}$, Earth ISA sea level $\rho_0 = 1.225\text{ kg/m}^3$, $P_0 = 101325\text{ Pa}$, $T_0 = 288.15\text{ K}$, $a_0 = \sqrt{1.4 \times 287.05287 \times 288.15} \approx 340.294\text{ m/s}$.
- **Multi-Layer Hydrostatic Atmosphere Profiles (`PLANET_THERMO` & `AIR`)**:
  - **Earth** (`topKm: 100`, `hasOxygen: true`, $R = 287.05287$, $g = 9.80665$, $P_0 = 101325\text{ Pa}$, $T_0 = 288.15\text{ K}$, $\gamma = 1.4$): 8 US Std Atmosphere 1976 layers (`0/11/20/32/47/51/71/85 km`, `AIR` `scaleHeightKm: 8.5`, `surfaceDensity: 1.0`, `soundMps: 340.3`).
  - **Mars** (`topKm: 80`, `hasOxygen: false`, $R = 191.84$, $g = 3.72076$, $P_0 = 636\text{ Pa}$, $T_0 = 210.0\text{ K}$, $\gamma(T) = \text{clamp}(1.33 + 0.00035(210-T), 1.25, 1.38)$): 3 layers (`0/25/55 km`, `AIR` `scaleHeightKm: 11.1`, `surfaceDensity: 0.0163`, `soundMps: 232`).
  - **Venus** (`topKm: 250`, `hasOxygen: false`, $R = 191.36$, $g = 8.87$, $P_0 = 9.21\times 10^6\text{ Pa}$ [92.1 bar], $T_0 = 737.0\text{ K}$, $\gamma(T) = \text{clamp}(1.30 - 0.000205(T-250), 1.19, 1.36)$, supercritical $\text{CO}_2$ compressibility $Z(h) = 1.01 - 0.01\text{clamp}(h/40,0,1)$ for $h < 40\text{ km}$): 4 layers (`0/50/60/100 km`, `AIR` `scaleHeightKm: 15.9`, `surfaceDensity: 54.4`, `soundMps: 410`).
  - **Titan** (`topKm: 600`, `hasOxygen: false`, $R = 290.72$, $g = 1.352$, $P_0 = 146700\text{ Pa}$, $T_0 = 93.65\text{ K}$, $\gamma = 1.405$): 3 HASI layers (`0/44/250 km`, `AIR` `scaleHeightKm: 21`, `surfaceDensity: 4.4`, `soundMps: 195`).
  - **Jupiter** (`topKm: 350`, `hasOxygen: false`, $R = 3745.3$, $g = 24.79$, $P_{\text{1bar}} = 100000\text{ Pa}$, $T_0 = 165.0\text{ K}$, $\gamma = 1.435$): 3 layers (`0/55/200 km`, `AIR` `scaleHeightKm: 27`, `surfaceDensity: 0.13`, `soundMps: 942`).
  - **Saturn** (`topKm: 600`, `hasOxygen: false`, $R = 4016.6$, $g = 10.44$, $P_{\text{1bar}} = 100000\text{ Pa}$, $T_0 = 134.0\text{ K}$, $\gamma = 1.385$): 3 layers (`0/120/360 km`, `AIR` `scaleHeightKm: 59.5`, `surfaceDensity: 0.16`, `soundMps: 863`).
  - **Uranus** (`topKm: 400`, `hasOxygen: false`, $R = 3149.4$, $g = 8.87$, $P_{\text{1bar}} = 100000\text{ Pa}$, $T_0 = 76.0\text{ K}$, $\gamma = 1.385$): 3 layers (`0/60/260 km`, `AIR` `scaleHeightKm: 27.7`, `surfaceDensity: 0.34`, `soundMps: 576`).
  - **Neptune** (`topKm: 300`, `hasOxygen: false`, $R = 3137.5$, $g = 11.15$, $P_{\text{1bar}} = 100000\text{ Pa}$, $T_0 = 72.0\text{ K}$, $\gamma = 1.385$): 3 layers (`0/45/200 km`, `AIR` `scaleHeightKm: 19.7`, `surfaceDensity: 0.367`, `soundMps: 559`).
  - **Thermodynamic Integration & Karman Fade (`sampleAtmosphere`)**: per piecewise-linear layer $\lambda = dT/dh$, non-isothermal slices integrate $P_2 = P_1 (T_2/T_1)^{-g/(R\lambda)}$ and isothermal slices integrate $P_2 = P_1 e^{-g\,\Delta h/(RT)}$ (down to $-10\text{ km}$ for basins). Over the top $12\%$ (`0.88 * topKm` to `topKm`), pressure fades smoothly via `1 - smoothstep(0.88*topKm, topKm, hKm)` to prevent Karman cliffs; density $\rho = P_{\text{eff}} / (Z R T)$ and $a = \sqrt{\gamma R T}$.
- **Pitot-Static Air Data Calibration (`computeAirData` & `pitotImpactRatio`)**:
  - $M = V/a$, $q = \frac{1}{2}\rho V^2$, $V_{\text{EAS}} = V\sqrt{\rho/\rho_0}$.
  - Impact pressure $q_c$: Saint-Venant isentropic formula for $M \le 1$; Rayleigh normal-shock Pitot formula for $M > 1$:
    $$q_c = P\left[\left(\frac{\gamma+1}{2}M^2\right)^{\gamma/(\gamma-1)}\left(\frac{\gamma+1}{2\gamma M^2 - (\gamma-1)}\right)^{1/(\gamma-1)} - 1\right]$$
  - Indicated/Calibrated Airspeed (`iasMps`) inverts $q_c / P_0$ against Earth ISA SL ($\gamma_0 = 1.4$): subsonic closed-form for $q_c/P_0 \le 1.2^{3.5}-1 \approx 0.89293$, and 12-iteration Newton-Raphson inversion of $166.9216\,M^7 / (7M^2 - 1)^{2.5} = 1 + q_c/P_0$ for supersonic flow.
- **Gravity, Oblateness & Orbital Centrifugal Relief (`computeGravityAt`)**:
  - Ellipsoidal surface radius at latitude $\phi$: $r_{\text{surf}} = \frac{ab}{\sqrt{(b\cos\phi)^2 + (a\sin\phi)^2}}$; orbital radius $r = r_{\text{surf}} + 1000\,h_{\text{km}}$.
  - Inverse-square gravity $g_{\text{grav}} = GM / r^2$.
  - Planetary spin relief $g_{\text{spin}} = \omega^2 r \cos^2\phi$ and total inertial centrifugal relief $g_{\text{cent}} = v_t^2 / r$ (combining planet rotation speed $\omega r\cos\phi$ with surface-relative flight velocity; retrograde sign handled via `rotationPeriodHours < 0`):
    $$g_{\text{eff}} = \max(0,\; g_{\text{grav}} - v_t^2/r), \qquad V_{\text{orb}} = \sqrt{GM/r}, \qquad V_{\text{esc}} = \sqrt{2GM/r}$$
- **Dual-Regime Exosphere Blending (`FlightModel.ts`)**:
  - Below `rhoRel > 1e-4` in Jet tier (`!isHypersonicTier`), `FlightModel.step` executes 6-DOF sub-stepped physics (up to `24` substeps with `subDt <= 0.01 s`), solving inner CAS inverse dynamics and blending out gravity, G-load, and aerodynamic accelerations into the orbital space drive using:
    $$w_{\text{drive}} = 1 - \text{smoothstep}(0.0,\; 0.02,\; \rho_{\text{rel}})$$
  - Above atmosphere (`rhoRel <= 1e-4`) or in Hypersonic/Scramjet tiers (`airAccelScale > 1.05`), `stepDriveOrHypersonic` runs critically-damped rate filtering (`exp(-12*dt)` pitch, `exp(-14*dt)` roll/yaw) with altitude-scaled space-drive ceiling `gapKm * 0.55` (`DRIVE_RATE = 0.55`, `FLOOR_MPS = 120`, `AIR_LIMIT_MPS = 360`, `BOOST_FACTOR = 3.5`).

---

### 4. Fly-By-Wire & Special Maneuvers (`ManeuversAndFBW.ts`, `FlightModel.ts`, `JetController.ts`, `PadTrigger`)

- **FBW Modes & Envelope Protections (`NORM`, `HI-G`, `PSM`)**:
  - **`NORM`**: $+9.0/-3.0\text{ G}$ (`+4.5/-1.5 G` with gear down); $\alpha_{\text{limit}} = 26^\circ$ (Gripen) / $28^\circ$ (Su-30) / $27^\circ$ (Kestrel), $18^\circ$ gear down; onset rate `gOnset = 14.0 G/s`.
  - **`HI-G` (Paddle / Overdrive)**: $+11.5/-4.0\text{ G}$; $\alpha_{\text{limit}} = 35^\circ$ (Gripen) / $38^\circ$ (Su-30) / $36^\circ$ (Kestrel); onset rate $1.45\times g_{\text{onset}}$; tightens pitch G-demand by $1.08\times$ ($1.18\times$ with airbrake held) when `pitch > 0.35`.
  - **`High-G Drift` Paddle (`Space+Tab`, `,`, or `Gamepad A+LB+RB`)**: activates temporarily while held (`paddleHeld`), switching effective mode to `'high-g'` and flagging `highGDriftActive` when $|\text{pitch}| > 0.45$ and $V > 110\text{ m/s}$ (also triggers speedbrake/ABS drag deceleration in `stepFbwAndControls`).
  - **`PSM` (Post-Stall Maneuvering, `V` hold or FBW cycle)**: lifts $\alpha_{\text{limit}}$ to $140^\circ$, bypasses G-cap speed limiter, boosts pitch/yaw rates ($1.32\times / 1.45\times$ on TVC airframes; roll fades to $0.72\times$ past $30^\circ$ AoA), and forces `tvcBlend = 1.0`.
  - **Outer-Loop G-Command vs AoA-Command**: blends smoothly via `gBlend = smoothstep(85, 175, speedMps)` between low-speed AoA rate command (`pitch * maxPitchRate * 0.85`) and high-speed G command (`gCmdCurrent * G0 / max(V, 35)`), with smooth AoA soft-stop starting $3^\circ$ below $\alpha_{\text{limit}}$ and automatic deep-stall nose-down recovery past $\alpha_{\text{limit}} + 7^\circ$ (`norm`) or $+14^\circ$ (`high-g`). Includes Aileron-Rudder Interconnect (`ariYawRight`) and $\beta$ directional damper (`0.045 * betaDeg`).
  - **Inner CAS Inverse Dynamics (`FlightModel.ts`)**: solves exact B3 moments (`needMx = iyy*dAx`, `needMy = izz*dAy - ixz*dAz`, `needMz = ixx*dAz - ixz*dAy`) across closed-loop bandwidths `48 rad/s` (`42 rad/s` in Cobra/PSM) longitudinal and `40 rad/s` lateral, subtracting TVC torque first, inverting control surface effectiveness, compensating rudder-roll coupling (`-0.025`), and routing any residual saturation deficit into RCS cold-gas thrusters (`rcsAuthority = 1 - smoothstep(80, 650, qPa)`).
  - **`FPV Hold` (`'`, `Shift+Z`, or D-Pad Down hold `>= 0.45 s`)**: latches current flight-path angle $\gamma$ (`fpvTargetGammaDeg`) and injects closed-loop trim bias (`1.4 * gammaErr` rad/s + normal 1G trim) whenever $|\text{pitch}| < 0.18$.
- **Flap Schedule (`AUTO` / `CMB` / `LND`, `computeFlapSchedule`)**:
  - Washout: TE flaps fade out across Mach $0.82\text{–}0.98$; LE slats across Mach $1.25\text{–}1.65$.
  - **`LND` (or `AUTO` + Gear Down)**: targets $0.95$ TE / $0.85\text{–}0.95$ LE, washing out between `145–210 m/s` IAS.
  - **`CMB` (Combat)**: targets $0.38$ TE (fading `280–360 m/s` IAS) and $0.40\text{–}0.95$ LE with $|\alpha| \in [4^\circ, 18^\circ]$.
  - **`AUTO` (Clean)**: schedules up to $0.28$ TE during subsonic turns ($|\alpha| \in [5^\circ, 16^\circ]$, $M < 0.92$) and $0\text{–}1.0$ LE slats across $|\alpha| \in [3.5^\circ, 20^\circ]$.
  - Aerodynamic deltas: $\Delta C_L = 0.42\,d_{te} + 0.14\,d_{le}$, $\Delta C_D = 0.065\,d_{te}^2 + 0.012\,d_{le}$, $\Delta C_m = -0.035\,d_{te} + 0.012\,d_{le}$.
- **Pugachev's Cobra, Kulbit & 32°-Canted 3D TVC (`stepCobraAndPsmAssist`, `allocateControlMoments`)**:
  - **Cobra State Machine (`IDLE` $\rightarrow$ `PITCH_UP` $\rightarrow$ `HOLD` $\rightarrow$ `RECOVER`)**: triggers on `V` tap / X button when $\rho_{\text{rel}} > 0.02$ and cooldown $\le 0$. `PITCH_UP` commands proportional rate up to `2.15 rad/s` (TVC) or `1.9 rad/s` (non-TVC) toward $96^\circ$ until $\theta \ge 86^\circ$ or $t \ge 0.98\text{ s}$; `HOLD` stabilizes near $88^\circ$ until $t = 1.38\text{ s}$; `RECOVER` drives pitch back to level before $T_{\max} = 2.4\text{ s}$ (`cooldown = 0.6 s`). Early forward stick (`pitch < -0.55`) aborts straight to `RECOVER`.
  - **Kulbit Continuation**: on TVC airframes with `PSM` held and `pitch > 0.65` past $75^\circ$ pitch sweep or $80^\circ$ AoA, engages `kulbitActive` at `2.25 rad/s` through a $325^\circ$ pitch sweep ($T_{\max} = 3.8\text{ s}$).
  - **32°-Canted 3D TVC Allocation (`allocateControlMoments`)**: Su-30MKK V-canted nozzles ($\pm 32^\circ$) produce pitch torque $T \sin\delta_p \cos(32^\circ) \cdot l_{\text{arm}}$, yaw torque $-T \sin\delta_y \sin(32^\circ) \cdot l_{\text{arm}}$, and coupled differential roll torque $-T \sin\delta_y \cos(32^\circ) \cdot l_{\text{roll}}$ (orthogonal TVC omits the cant factor and roll coupling), slewing at `tvcSlewDegPerSec` (`30°/s` Su-30, `40°/s` Kestrel) with cosine axial thrust scaling $\cos(\min(\sqrt{\delta_p^2+\delta_y^2}, 0.45))$.
- **Afterburner Staging (`computeAfterburnerStage`)**:
  - Spool range `0.05..0.75` = Dry Military (`nozzleIris` pinches from `0.42` idle down to `0.06` Mil); `0.75..1.0` = Wet Afterburner zones `1/2/3` (`0.35 / 0.68 / 1.0` wet level, iris flares open `0.55 -> 1.0`). Supercruise flagged when `abStage === 0 && dryLevel >= 0.9 && airDensity > 0`.
- **3 Earth Speed Tiers (`JetController.ts`, `AirframeSpecs.ts`, `JetHUD.tsx`)**:
  - Cycled with `J` near Earth: Tier 0 = `'Jet'` (`speedTier: 'jet'`, aerodynamic ceiling), Tier 1 = `'Mach 6'` (`speedTier: 'hypersonic'`, `ceilingMach = 6.5`, default thrust scale $12\times$), Tier 2 = `'Mach 25'` (`speedTier: 'scramjet'`, `ceilingMach = 25.5`, default thrust scale $60\times$). Tiers $>0$ grant `unlimitedFuel: true` and bypass subsonic/Mach-2 aerodynamic speed caps via `stepDriveOrHypersonic`.
- **Landing, Ground Rollout, Cutscene & `PadTrigger`**:
  - **Gear & Runway Physics (`stepGroundContact`)**: sink absorption margin `4.5 m/s` (gear down) vs `1.2 m/s` (retracted); rolling friction `0.025` vs `0.45`; ABS wheel brakes `0.55` ($\times 1.25$ normal load bonus when Gripen canard snowplow `-0.85` activates above `8 m/s`); drag chute (Su-30/Kestrel) auto-deploys above `32 m/s` with brakes/airbrake and `throttle < 0.35`, stowing below `14 m/s` or `throttle > 0.65` (`chuteDecel = dragChute * 0.5 * 1.2 * 22 * V^2 / max(mass, 5000)`); speed-sensitive nosewheel steering.
  - **Autopilot Landing & Cutscene (`startLanding`, `flyLanding`, `flyCutscene`)**: Act 1 (`hop`) flies a ballistic-arc great-circle hop to a `2.6 km` final approach point; Act 2 (`flyCutscene`) glides down over `APPROACH = 5.0 s` + `ROLL = 1.6 s` flare, emitting touchdown tire smoke, before fading to black (`fade -> 1`) and handing off to `SurfaceObserver`.
  - **Solid Contact & Gamepad `PadTrigger`**: `resolveSurfaceContact` enforces `3 m` minimum terrain/landmark clearance (bumping velocity & inducing camera shake); `PadTrigger` (`triggerPull` / `TriggerRest`) calibrates worn gamepad analog triggers (`axes/buttons 6 & 7`) against their resting baseline for clean throttle control.

---

### 5. Interactive 3D Cockpit & Visual Effects (`Cockpit.ts`, `CockpitControls.ts`, `MfdDisplays.ts`, `MirrorView.ts`, `HudGlass.ts`, `Optics.ts`, `SpeedEffects.ts`, `JetModel.ts`, `JetController.ts`)

- **Interactive Console & Controls (`CockpitControls.ts`)**:
  - Extracts GLB stick and throttle meshes via `JetModel.extractPart` so the control stick deflects ($\pm 0.24\text{ rad}$ + high-frequency buffet tremor) and throttle rotates with thrust.
  - Raycast-pickable left console (`pick(ray)`): **Landing Gear Lever** with wheel-shaped white knob (`action: 'gear'`) + green gear LED; **Afterburner Master Arm** toggle under hinged **Red Guard** (`action: 'arm'`) + amber lamp; aft avionics LED strip (`BRK` red-orange, `FBW` mint/cyan/amber, `FLAP` mint/cyan); and a 9-row `512x384` **`DEST` Touchscreen** (`action: 'display'`) listing nearby world landmarks (`< 2 * radiusKm`) or Solar System destinations, scrolling via top/bottom row taps.
- **Built-in Fallback Cockpit (`Cockpit.ts`)**: displayed only when `!model.hasInterior` (Kestrel), featuring 3 `256x256` canvas MFDs (`NAV · SYSTEM` log-radius `0.3–40 AU`, `TGT` attitude ball & range/alignment, `ENG · DRIVE` thrust/fuel/boost/gear/AB) plus mechanical stick and throttle levers.
- **3-Screen Interactive MFD Atlas (`MfdDisplays.ts`)**:
  - `2048x2048` (`1024x1024` logical) texture atlas (`dynamic_mfd`) split across `left` (`496x380`), `centre` (`384x500`), and `right` (`496x380`) screens (default pages `NAV` / `PFD` / `ENG`), updated incrementally via dirty-rectangle `texSubImage2D` uploads with zero `shadowBlur` calls.
  - Clickable top bezel tabs switch any screen between 4 pages: **`PFD`** (HalfFloat `384x500` `58°` FOV synthetic-vision forward camera + artificial horizon, `-o-` FPM, gear AoA E-bracket, IAS/ALT/VSI tapes, waypoint readout), **`FCS`** (airframe-specific planform diagram showing live canards, flaperons, slats, stabilators, rudders, 2D/3D TVC gimbals, stick/pedal box, $\alpha/G$ bar), **`ENG`** (dry/AB 1–3 stages, $T$, $T/W$, $P_s$, $\dot{m}_f$, fuel remaining, supercruise badge, $q$, ambient $T/P$), and **`NAV`** (HalfFloat `496x380` `50°` FOV downward moving map + compass rose, range rings, intercept vector, contacts, weather). PFD/NAV 3D views render round-robin one per frame on `medium`/`high` perf tiers.
- **Rear-View Mirrors & Canopy Reflection (`MirrorView.ts`, `JetModel.ts`, `Optics.ts`)**:
  - **`MirrorView`**: `80°` FOV rear-looking `PerspectiveCamera` into a `640x320` (or `320x160` low-tier) `HalfFloatType` target rendered every other frame; patched onto `dynamic_mirror` materials via reflected world view direction with `0.9` silvered reflectance.
  - **Superellipse Canopy Bubble & Glass Shader (`JetModel.ts`, `Optics.ts`)**: builds a seamless superellipse ($p = 2.6$) bubble (`buildBubble`) and sill/rear bow frame (`buildCanopyFrame`) around `insideGlass()`, sampling the `cockpitCube` environment map (`8%` normal to `45%` grazing Fresnel reflectance), ray-tracing a virtual reflection of the pilot's helmet/visor/shoulders (`gEllipsoid`), and rendering edge thickness tint, solar glint, and surface dust specks. `CanopyGlints` (`Optics.ts`) adds a `1024px` procedural acrylic micro-scratch/polishing-swirl triplanar forward-scatter layer; `SunFlare` renders hexagonal starburst, halo, rainbow ring, anamorphic streak, veil, and 6 aperture ghosts.
- **Collimated Combiner HUD (`HudGlass.ts`)**:
  - `512x576` additive green combiner glass (`renderOrder: 20`) whose symbols shift dynamically with `telemetry.headOffset` (`hx`, `hy`, `hz`) for infinity-focused collimation parallax (`ppd` derived from live `baseDist + hz`). Renders heading tape, bank arc, pitch ladder, `-W-` boresight, `-o-` FPM (with off-glass amber ghosting & dashed tether), gear-down `12°` AoA E-bracket, IAS/TAS/Mach/$\alpha$/$G$/$G_{\text{peak}}$ left column, ALT/$T/W$/$P_s$/Fuel right column, blinking warnings (`SPIN`, `HIGH ALPHA`, `OVER-G`, `PULL UP`), and status pills.
- **Exhaust Plumes, Vapor, Shock Cones & Smoke (`JetModel.ts`, `SpeedEffects.ts`)**:
  - **Engine Plumes (`PLUME_VERT`/`PLUME_FRAG`) & Iris (`JetModel.ts`)**: 14 overlapping titanium nozzle petals articulate with `nozzleIris`; dual additive core/outer plume shaders draw repeating Mach shock diamonds in atmosphere and transition to wider, softer under-expanded plumes in vacuum. Wing vapor sheets intensify with $|\alpha| \in [7.5^\circ, 21^\circ]$, $q$, $\rho$, and transonic Mach $\approx 0.96$.
  - **`SpeedEffects.ts`**: `SpeedField` (`1800` additive velocity-stretched dust/moisture motes in a `520 m` wrapping box); `VortexRig` (`90`-point double-precision FBM condensation ribbons from wingtips, LERX/strake roots, and high-altitude contrails); `ShockEffects` (Mach `0.955–1.045` Prandtl-Glauert vapor cone + rear shockwall disc, expanding torus sonic-boom collar, oblique Mach cone above Mach `1.15`, and hypersonic bow plasma sheath); and `ExhaustSmoke` (`900`-particle tire touchdown smoke pool).
- **G-LOC Blackout & Tunnel Vision (`JetController.ts`)**:
  - In `'cockpit'` view inside atmosphere (`!cutscene && airDensity > 0`), `greyOut` blends positive-G blackout (`smoothstep(f.gLoad, 5, 9)`) minus negative-G arterial redout (`smoothstep(-f.gLoad, 1.8, 3.8)`), slewing asymmetrically at `0.9/s` onset and `1.7/s` recovery.

---

### 6. Cameras, Tactical Overlays & JetHUD (`JetHUD.tsx`, `TacticalHud.ts`, `JetController.ts`)

- **4 Camera Views & Anti-Underground Protection (`JetController.ts`)**:
  - **`chase`**: `lagging slerp` (`exp(-5.5*dt)`) behind airframe, dynamic Mach/boost FOV kick (`60°` + up to `54°`) and pullback (`0–25%`), `Shift+Wheel` distance `9–80 m`, plus spring-arm midpoint check pulling camera forward (`lerp 0.45`) if terrain intersects the line of sight.
  - **`cockpit`**: `eye + lean` driven by a critically-damped `13 rad/s` head spring, G-load head drop (`clamp((g-1)*0.012, -0.03, 0.09)`), AoA/AoS/throttle/brake head shift, buffet tremor, and `Shift+Wheel` FOV zoom `25°–115°`.
  - **`gopro`**: ultra-wide action-cam lens (`min(140°, insideFov * 1.32 + fovKick*0.4)`) with high-frequency airframe buzz and barrel lens post-effect (`telemetry.lens = 'gopro'`).
  - **`flyby`**: `flybyDirector` cycles 6 choreographed drone camera shots around the airframe.
  - **Terrain Clearance Floor**: every view enforces a strict `5.0 m` (`0.005 / camKmNear`) minimum clearance above DEM/PhotorealEarth/landmark geometry, preventing underground camera clipping.
- **Tactical Canvas HUD & Coordinates (`TacticalHud.ts`, `JetHUD.tsx`)**:
  - **`toMgrs(lat, lon)` & `toDms(lat, lon)`**: exact WGS84 Transverse Mercator ($a = 6378137$, $1/f = 298.257223563$, $k_0 = 0.9996$) with Norway (`zone 32`) and Svalbard (`zones 31/33/35/37`) grid exceptions and `UPS NORTH`/`UPS SOUTH` polar fallback beyond $+84^\circ / -80^\circ$.
  - **Tactical Overlays (`drawFull` & `tacticalLayout`)**: top `90°`-span `headingTape` with waypoint diamond; bottom-left `locationCard` (decoding glyph scramble, sweeping scanline, rotating reticle, MGRS/DMS, Local Solar Time, `T+` elapsed); bottom-right `flightCard` (scrolling altitude tape, VS, $P_s$, IAS/TAS/kt, 30-segment Mach bar up to M3 with Mach 1 shock-ring burst + `"SUPERSONIC"` flash, `G / PK / α / T/W` header, pill strip); center `warning` hazard box (`OVER-G`, `STALL / SPIN`, `PULL UP`, `MAX Q`); and chromatic glitch `centreReveal` banner on country/world changes. Compact phone screens and deep-space minimal mode (`U`) switch to lightweight readouts and a 20-segment throttle/fuel bar.
  - **React HUD Panels & Radio (`JetHUD.tsx`)**: target selector (planets, moons, belts, plus search across NASA spacecraft for Lock / Fly Beside), Earth Land menu (landmark picker + place search), Earth `TravelButtons` (`Jet` / `Mach 6` / `Mach 25` + `Fly home`), `RadioSubtitle` serif captions, initial `PitchQuestion` (`1` vs `2` / `I`), and live airframe spec + binding `Help` overlay.
- **Input Bindings (`JetController.ts`, `JetHUD.tsx`)**:
  - **Flight Axes**: `W S / ↑ ↓` pitch (`I` inverts pitch), `A D / ← →` roll, `Q E` yaw; Left-mouse drag or PointerLock + `Shift` virtual stick; Right-mouse drag / PointerLock free look; Touch left virtual stick (`deadzone 0.08`, exponent `1.4`).
  - **Throttle & Propulsion**: `R F` / mouse wheel / touch slider throttle; `1–9, 0` preset `10%–100%`; `X` idle; `Space` / touch `BOOST` afterburner/drive boost; `K` arm/safe afterburner; `Tab / ;` airbrake & wheel brakes; `J` cycle Earth speed tier.
  - **FBW, Flaps & Systems**: `` ` `` or `Shift+G` cycle FBW (`NORM`/`HI-G`/`PSM`); `Space+Tab` or `,` High-G drift paddle; `V` tap Cobra / hold `PSM-TVC`; `.` or `Shift+B` cycle flaps (`AUTO`/`CMB`/`LND`); `'` or `Shift+Z` toggle `FPV Hold`; `B` toggle landing gear; `G` space Flight Assist; `Z` align nose; `C` cycle camera; `U` full/minimal HUD; `T / Shift+T` cycle target; `L / M` land menu; `P` transit; `Home` fly home; `O` / `[ ]` time of day; `Y` cycle weather; `N` mute; `H` help; `Esc` unlock pointer / exit.
  - **Gamepad**: Left Stick pitch/roll; `LB / RB` yaw (`LB+RB` brake); Right Stick / `R3` look/center; `LT / RT` calibrated throttle; `A` boost (`A+LB+RB` High-G drift); `B` align; `X` tap Cobra / hold PSM; D-Pad `↑` FBW, `←/→` flaps, `↓` tap gear / hold `>=0.45s` FPV Hold.

---

## Part VII: Complete Soundscape — VELA Companion AI & Voice, Military Radio DSP Chain, Jet Audio & Adaptive Music

---

### 1. VELA AI Companion & Voice (`src/companion/*`)

#### 1.1 Architecture & Event Bus (`voice.ts`, `events.ts`, `knowledge.ts`)
- **Module Split**:
  - `src/companion/voice.ts`: Singleton Web Audio `AudioContext` manager (`audioCtx()`), pre-recorded MP3 playback controller (`voice`), live RMS amplitude metering for the VELA orb, procedural Web Audio chime synthesizer (`chime()`), and live subscription to user settings (`settings.subscribe`).
  - `src/companion/events.ts`: Decoupled `window.CustomEvent` bus prefixed with `'solaris:vela:'`, allowing non-companion modules to notify VELA without direct coupling.
  - `src/companion/knowledge.ts`: Loads `src/companion/vela-lines.json` as `VELA_LINES: Record<string, string>`, strips performance sound tags for subtitles (`lineText()`), indexes line groups (`idsWith()`, `factIds()`), and defines interactive `SECRETS` and `CompanionAction` union types.
  - `src/companion/vela-lines.json`: Complete corpus of **572** pre-recorded neural voice lines (generated with Kokoro-82M into `public/voice/vela/*.mp3`; no browser `speechSynthesis` is used).
- **Decoupled Event Bus (`src/companion/events.ts`)**:
  - `emitVela<K extends keyof VelaEvents>(type, detail)`: No-ops when `typeof window === 'undefined'`; dispatches `new CustomEvent('solaris:vela:' + type, { detail })`.
  - `onVela<K extends keyof VelaEvents>(type, fn)`: Subscribes to `'solaris:vela:' + type` and returns an unsubscribe cleanup function.
  - Event catalog (`VelaEvents`):
    - `nebula`: `string | null` — fired when a nebula visit starts (nebula name) or ends (`null`).
    - `timelapse`: `{ on: boolean; where: 'surface' | 'horizon' }` — fired when idle time-lapse starts or stops on a planetary surface or at the black hole horizon.
    - `shot`: `{ first: boolean }` — fired when a Gallery photo is captured.
    - `postcard`: `string` — fired when stepping into a Gallery postcard.
    - `settings`: `true` — fired when the Settings drawer opens.

#### 1.2 Web Audio Playback, Metering, Chimes, Ducking & Subtitles (`voice.ts`, `knowledge.ts`, `music.ts`)
- **Shared Web Audio Graph (`audioCtx()`)**:
  - Creates a single `AudioContext` (with `webkitAudioContext` fallback) shared across VELA's voice, procedural chimes, and the adaptive music director (`src/audio/music.ts`).
  - Signal path for VELA's speech: `HTMLAudioElement` (`crossOrigin = 'anonymous'`, `preload = 'auto'`) $\rightarrow$ `MediaElementAudioSourceNode` $\rightarrow$ `AnalyserNode` (`fftSize = 512`) $\rightarrow$ `voiceGain` (`GainNode`, initialized to `settings.get().velaVolume`) $\rightarrow$ `ctx.destination`.
  - Browser autoplay unlock: `voice.unlock()` calls `audioCtx()` (which calls `ctx.resume()` if `ctx.state === 'suspended'`) and triggers `loadManifest()` to fetch `${BASE_URL}voice/vela/manifest.json`.
  - Element caching: `element(id)` looks up `manifest[id]`, creates and caches one `HTMLAudioElement` per line ID in `cache: Map<string, HTMLAudioElement>`, and connects its `MediaElementSource` once to `analyser`.
- **Sequential Playback & Queue/Interrupt Behaviour**:
  - `voice.play(id)`: Returns immediately if `!voice.enabled`; awaits `loadManifest()`, resolves `element(id)`, calls `this.stop()` (which pauses any active `current` element, resets `currentTime = 0`, and sets `speaking = false`) so overlapping VELA lines never stack—each new `play(id)` interrupts any prior line and awaits `'ended'`, `'pause'`, or `'error'` events before clearing `current` and setting `speaking = false`.
  - `voice.preload(ids)`: Warms `cache` for anticipated next lines when `voice.enabled` is `true`.
  - *(Note: High-level companion dialogue scheduling, idle timers, and UI cooldowns live in the HUD layer such as `src/ui/HUD/Companion.ts`, outside this part's assigned source files.)*
- **Orb Amplitude Envelope (`voice.amplitude()`)**:
  - Returns `0` when `!analyser || !this.speaking`.
  - Reads time-domain bytes into `Uint8Array(512)` via `analyser.getByteTimeDomainData(level)`, normalizes each sample $v = (\text{byte} - 128) / 128$, computes RMS $\sqrt{\frac{1}{N}\sum v^2}$, and scales as $\min(1, \text{RMS} \times 4)$.
- **Subtitle Stripping & Pacing (`knowledge.ts`, `voice.ts`)**:
  - `voice.seconds(id)`: Returns `manifest[id]?.seconds ?? null` for UI subtitle pacing.
  - `lineText(id)`: Strips bracketed Kokoro performance cues via `.replace(/\[[a-z ]+\]/g, '').replace(/\s{2,}/g, ' ').trim()`, ensuring tags never appear in subtitles.
  - Permitted performance tags (verified in `src/tests/companion.test.ts`): `[laugh]`, `[chuckle]`, `[sigh]`, `[gasp]`, `[sniff]`, `[crying]`, `[fear]`, `[whispering]`, `[surprised]`, `[happy]`, `[clear throat]`.
- **Procedural Chime Synth (`chime(kind)`)**:
  - Active only when `voice.enabled && settings.get().chimes` is `true`.
  - Base frequency: `'arrive'` = **659.25 Hz** (E5), `'open'` = **523.25 Hz** (C5).
  - Synthesizes 3 staggered sine partials connected directly to `ctx.destination`:
    - Partial 1: `mult = 1`, peak `gain = 0.05`, `delay = 0` s.
    - Partial 2: `mult = 1.5`, peak `gain = 0.03`, `delay = 0.09` s.
    - Partial 3: `mult = 2.01`, peak `gain = 0.018`, `delay = 0.18` s.
  - Envelope per partial: `0` $\rightarrow$ linear ramp to `gain` in `0.02` s $\rightarrow$ exponential ramp to `0.0001` at `now + delay + 1.6` s $\rightarrow$ oscillator stops at `now + delay + 1.7` s.
- **Settings Binding & Audio Ducking**:
  - `settings.subscribe` updates `voiceGain.gain` via `setTargetAtTime(st.velaVolume, ctx.currentTime, 0.05)` and toggles `voice.enabled = st.velaVoice` (calling `voice.stop()` when disabled or `voice.unlock()` when enabled).
  - **Music Ducking**: `voice.setSpeaking(s)` notifies `voice.listeners`; `MusicDirector` (`src/audio/music.ts`) subscribes and ducks the music bus gain to `DUCK = 0.38` ($\times\ \text{volume}$) over `0.5` s whenever `voice.speaking` is `true`.
  - **Radio Ducking**: VELA's voice bus (`voice.ts`) and the flight `JetAudio` radio bus (`RadioChain.ts`) run in separate Web Audio contexts/buses (`JetAudio` creates its own `AudioContext` and ducks the cockpit `world` bus to `0.4` while `RadioChain` transmits; `voice.ts` does not duck `RadioChain`).

#### 1.3 Interactive Secrets & `CompanionAction` Catalogue (`knowledge.ts`)
- **`CompanionAction` Variants**:
  - `{ kind: 'fly'; body: string }`
  - `{ kind: 'sky'; body: string; facing?: string }`
  - `{ kind: 'landmark'; id: string; body: string }`
  - `{ kind: 'horizon' }`
  - `{ kind: 'lens'; name: 'cinematic' | 'fisheye' | 'clean' }`
  - `{ kind: 'zoom'; domain: 'inner_system' | 'outer_system' | 'galactic' }`
  - `{ kind: 'time'; rate: number }`
  - `{ kind: 'tour' }`
- **All 21 `SECRETS` Entries** (each paired with a spoken pitch `secret.<id>` in `vela-lines.json`; `secretsAt(body)` filters by `at`, and `beautifulPlaces()` filters to `sky`, `horizon`, or `landmark` actions):
  - `pan` (`at: ['Pan']`, `"Stand on Pan"`): `sky` on `Pan` facing `Saturn`.
  - `mimas` (`at: ['Saturn', 'Mimas']`, `"Stand on Mimas"`): `sky` on `Mimas` facing `Saturn`.
  - `iapetus` (`at: ['Saturn', 'Iapetus']`, `"Go to Iapetus"`): `sky` on `Iapetus` facing `Saturn`.
  - `enceladus` (`at: ['Saturn', 'Enceladus']`, `"Stand on Enceladus"`): `sky` on `Enceladus` facing `Saturn`.
  - `moon-earth` (`at: ['Earth', 'Moon']`, `"Stand on the Moon"`): `sky` on `Moon` facing `Earth`.
  - `everest` (`at: ['Earth']`, `"Fly to Everest"`): `landmark` `'earth-everest'` on `Earth`.
  - `apollo` (`at: ['Moon']`, `"Tranquility Base"`): `landmark` `'moon-tranquility'` on `Moon`.
  - `olympus` (`at: ['Mars']`, `"Fly over Olympus Mons"`): `landmark` `'mars-olympus'` on `Mars`.
  - `phobos` (`at: ['Mars', 'Phobos']`, `"Stand on Phobos"`): `sky` on `Phobos` facing `Mars`.
  - `mars-sky` (`at: ['Mars']`, `"Stand on Mars"`): `sky` on `Mars`.
  - `io` (`at: ['Jupiter', 'Io']`, `"Stand on Io"`): `sky` on `Io` facing `Jupiter`.
  - `europa` (`at: ['Jupiter', 'Europa']`, `"Stand on Europa"`): `sky` on `Europa` facing `Jupiter`.
  - `titan` (`at: ['Saturn', 'Titan']`, `"Land on Titan"`): `sky` on `Titan`.
  - `miranda` (`at: ['Uranus', 'Miranda']`, `"Stand on Miranda"`): `sky` on `Miranda` facing `Uranus`.
  - `triton` (`at: ['Neptune', 'Triton']`, `"Stand on Triton"`): `sky` on `Triton` facing `Neptune`.
  - `charon` (`at: ['Pluto', 'Charon']`, `"Stand on Charon"`): `sky` on `Charon` facing `Pluto`.
  - `horizon` (`at: ['Sagittarius A*']`, `"Take me to the shore"`): `horizon`.
  - `blackhole` (`at: ['Neptune', 'Pluto']`, `"To the black hole"`): `fly` to `Sagittarius A*`.
  - `fisheye` (`at: []`, `"Fisheye lens"`): `lens` `'fisheye'`.
  - `true-scale` (`at: []`, `"Show me everything"`): `zoom` `'outer_system'`.
  - `time` (`at: []`, `"A year per second"`): `time` `rate: 31536000`.

#### 1.4 Complete Breakdown of `vela-lines.json` Categories & Triggers (572 Lines Total)
- **Greetings & Session Memory (`greet.*`, `memory.*` — 36 lines)**:
  - `greet.first.1`–`3` (3): First-ever wake-up ("Oh, hey, you're awake...", VELA intro + inner Solar System overview, "Try to keep up").
  - `greet.back.1`–`8` (8): Return visits (Sun still on, Saturn's ~300 moons, planets moved, Io erupting, best seat).
  - Time-of-day greetings (8): `greet.morning`, `greet.morning.2`, `greet.afternoon`, `greet.afternoon.2`, `greet.evening`, `greet.evening.2`, `greet.night`, `greet.night.2`.
  - `memory.last.*` (13): Recall of last visited world — `Sun`, `Mercury`, `Venus`, `Earth`, `Moon`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, `Neptune`, `Pluto`, `Sagittarius A*`, and `anymoon`.
  - Behavioural memory (4): `memory.stood` (surface stargazing), `memory.many` (frequent returns), `memory.away` (long absence), `memory.moons` (many moons visited).
- **Onboarding Tour (`tour.*` — 18 lines)**:
  - `tour.0`–`tour.17`: Sequential UI walkthrough covering destinations & light-distance flight (`tour.1`), scale ladder (`tour.2`), layers (`tour.3`), optics & body markers (`tour.4`), Atlas/Gallery (`tour.5`), time rate (`tour.6`), calendar jumps (`tour.7`), logbook (`tour.8`), attitude scope (`tour.9`), galactic plot (`tour.10`), arrival dossier (`tour.11`), auto-turning idle sky & tap-to-talk (`tour.12`), Worlds/Nebulae switch (`tour.13`), soundtrack record (`tour.14`), P-key camera (`tour.15`), settings gear (`tour.16`), and world Survey/surface panel (`tour.17`).
- **World Arrivals (`arrive.*` — 128 lines)**:
  - **Sun & Major Planets (51 lines)**:
    - `arrive.Sun.1`–`6` (6): Solar mass, 8-min light / core photon travel (~thousands to 100,000 yrs), 4M tonnes/s fusion, 5B-year red giant lifecycle, 11-year solar cycle spots.
    - `arrive.Mercury.1`–`5` (5): 1 solar day = 2 years, cooling/shrinking core wrinkles, permanently shadowed polar crater ice, 3x apparent Sun + retrograde Sun wobble, airless black noon sky.
    - `arrive.Venus.1`–`5` (5): Retrograde spin & day > year, 465 °C lead-melting surface + sulfuric acid clouds, 900 m underwater equivalent pressure, brightest planet after Moon, 4-day super-rotating cloud tops vs 243-day rotation.
    - `arrive.Earth.1`–`6` (6): Pale blue home, Moon receding ~4 cm/yr, densest planet, equatorial bulge, 71% water / unmapped ocean floor, borderless orbital view.
    - `arrive.Mars.1`–`6` (6): Red surface & blue sunsets, Olympus Mons (2.5× Everest), Phobos falling toward ring breakup in ~50M yrs, 24h40m sol, Valles Marineris, active surface rovers.
    - `arrive.Jupiter.1`–`7` (7): >2× mass of all other planets combined, Great Red Spot > Earth, <10h day, 115 known moons, volume >2× all other planets, comet-shielding gravity, Juno polar cyclone patterns.
    - `arrive.Saturn.1`–`7` (7): Lower density than water, rings spanning Earth–Moon distance yet metres thick, north polar hexagon storm, nearly 300 moons, icy young rings (~few hundred million yrs), 15-year ring-plane edge-on cycle, Cassini 13-year mission & Grand Finale plunge.
    - `arrive.Uranus.1`–`6` (6): 98° axial tilt (42-year poles), coldest atmosphere (-224 °C), Herschel telescope discovery ("George"), Shakespearean moons, 13 dark soot-like rings, Voyager 2 (1986) sole flyby.
    - `arrive.Neptune.1`–`6` (6): Mathematical prediction discovery, 2,000 km/h supersonic winds, 165-year orbit (completed first lap in 2011), distant moon Neso (70M km, 27-yr orbit), internal heat radiation, deep diamond rain.
  - **Dwarf Planet & Black Hole (10 lines)**:
    - `arrive.Pluto.1`–`6` (6): Nitrogen-ice heart glacier (Sputnik Planitia convection), 248-year orbit, blue Rayleigh haze skies, 5 moons (Charon + chaotic Nix/Hydra), New Horizons 2015 flyby at 14 km/s after 9.5 yrs.
    - `arrive.Sagittarius A*.1`–`4` (4): 4 million solar masses inside Mercury's orbit, 27,000-light-year light travel, star S2 (16-yr orbit at 7,000 km/s), 2022 EHT black hole shadow image.
  - **Named Moons (67 lines across 30 moons)**:
    - *Earth*: `arrive.Moon.1`–`6` (6 — tidal lock, million-year footprints, slowing Earth's 19h ancient day, 400,000 km scale, 12 Apollo astronauts 1969–1972, future loss of total solar eclipses).
    - *Mars*: `arrive.Phobos.1`–`2` (2 — west-rising/east-setting twice daily, tidal grooves), `arrive.Deimos.1`–`2` (2 — star-like from Mars, bicycle escape velocity).
    - *Jupiter*: `arrive.Io.1`–`2` (2 — volcanism, 400 km plumes), `arrive.Europa.1`–`2` (2 — 2× Earth ocean, Europa Clipper), `arrive.Ganymede.1`–`2` (2 — larger than Mercury, intrinsic magnetosphere & auroras), `arrive.Callisto.1`–`2` (2 — ancient cratered surface, low-radiation base candidate), `arrive.Amalthea.1` (1 — reddest porous sponge), `arrive.Himalia.1` (1 — largest captured irregular moon).
    - *Saturn*: `arrive.Titan.1`–`3` (3 — methane lakes & flight-capable air, 2005 Huygens landing, 2030s Dragonfly drone), `arrive.Enceladus.1`–`2` (2 — E-ring water plumes with salts/organics), `arrive.Mimas.1`–`2` (2 — Herschel "Death Star" crater, hidden young ocean), `arrive.Iapetus.1`–`2` (2 — two-tone albedo, 13 km equatorial ridge), `arrive.Tethys.1`–`2` (2 — 2,000 km Ithaca Chasma, pure bright water ice), `arrive.Dione.1`–`2` (2 — bright ice cliffs, Trojan co-orbitals), `arrive.Rhea.1`–`2` (2 — O₂/CO₂ exosphere, possible ancient ring), `arrive.Hyperion.1`–`2` (2 — chaotic tumbling sponge, weak gravity), `arrive.Pan.1` (1 — equatorial ring-dust "walnut/ravioli" ridge), `arrive.Atlas.1` (1 — flying-saucer equatorial skirt), `arrive.Daphnis.1` (1 — 8 km gap-edge wave raiser), `arrive.Phoebe.1` (1 — retrograde outer moon & Phoebe ring), `arrive.Janus.1` (1), `arrive.Epimetheus.1` (1 — 4-year orbital swap), `arrive.Prometheus.1` (1 — F-ring shepherd).
    - *Uranus*: `arrive.Miranda.1`–`2` (2 — 20 km Verona Rupes 12-min fall, reassembled Frankenstein look), `arrive.Ariel.1`–`2` (2 — brightest surface, cryovolcanic valleys), `arrive.Umbriel.1` (1 — darkest moon with bright Wunda halo), `arrive.Titania.1`–`2` (2 — largest Uranian moon, 1,000+ km canyons, Shakespeare), `arrive.Oberon.1`–`2` (2 — outermost major moon, 11 km mountain).
    - *Neptune*: `arrive.Triton.1`–`2` (2 — retrograde captured moon, 8 km nitrogen geysers & future ring spiral), `arrive.Proteus.1`–`2` (2 — largest non-spherical moon, charcoal albedo ~10%), `arrive.Nereid.1` (1 — eccentric 1.5M–10M km orbit).
    - *Pluto*: `arrive.Charon.1`–`2` (2 — mutually tidally locked, reddish Mordor Macula polar cap from Pluto's atmosphere), `arrive.Hydra.1` (1 — pure water ice, 10h spin), `arrive.Nix.1` (1 — chaotic tumbling), `arrive.Kerberos.1` (1 — bilobed snowman), `arrive.Styx.1` (1 — 16 km smallest moon).
  - **Generic Minor Moons (`minor.*` — 5 lines)**: `minor.1`–`5` for unscripted minor captured rocks.
- **Black Hole Horizon & Deep Space (`bh.*`, `fright.bh.*`, `fright.rock` — 5 `bh.*` + 4 `fright.*` lines)**:
  - `bh.horizon`: Ocean world orbiting at $20\ r_s$ with relativistic time dilation (~1 hr 02 min on Earth per 1 hr on shore).
  - `bh.deep`: Below $3\ r_s$ (ISCO) where no stable orbit exists.
  - `bh.photon`: Inside the photon sphere ($<1.5\ r_s$); shadow covers >50% of sky.
  - `bh.approach`: Whispered silence approaching the horizon.
  - `bh.rock` / `fright.rock`: Infinitely redshifted/frozen infalling rock at the event horizon.
- **Journeys, Small Bodies, Spacecraft & Scale (`journey.*`, `cross.*`, `space.*`, `worlds.*` — 26 lines)**:
  - `journey.*` (12): Departure commentary to `Mercury`, `Venus`, `Earth`, `Moon`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, `Neptune`, `Pluto`, `Sagittarius A*` (27,000 ly), and `hop` (inter-moon hops).
  - `cross.*` (3): Crossing `cross.belt` (asteroid belt ~1M km spacing), `cross.kuiper`, `cross.trojans` (±60° L4/L5 Jupiter Trojans).
  - `space.*` (8): ~600 `space.comets`, `space.meteors` (Swift-Tuttle / Perseids), `space.geminids` (Asteroid Phaethon), `space.belt`, `space.markers`, `space.scale` (door-sized Sun analogy), `space.halley` (76-yr period, next in 2061), `space.kuiper`.
  - `worlds.*` (3): `worlds.big`, `worlds.big.2` (30× exaggerated planet radius vs true orbital distances), `worlds.true` (1:1 true scale).
- **Spacecraft & Mission References Across Lines**:
  - Apollo 11 / Tranquility Base (`journey.Moon`, `arrive.Moon.5`, `secret.apollo`), Rovers (`journey.Mars`, `arrive.Mars.6`), Juno (`arrive.Jupiter.7`), Europa Clipper (`arrive.Europa.2`), Cassini (`arrive.Saturn.7`), Huygens (`arrive.Titan.2`), Dragonfly (`arrive.Titan.3`), Voyager 2 (`journey.Neptune`, `arrive.Uranus.6`, `noise.9`), New Horizons (`journey.Pluto`, `arrive.Pluto.5`), Event Horizon Telescope (`arrive.Sagittarius A*.4`).
- **Landmarks, Postcards, Nebulae, Photography & Time-Lapse (`secret.*`, `accept.*`, `decline.*`, `nebula.*`, `shot.*`, `postcard.*`, `gallery.*`, `timelapse.*` — 51 lines)**:
  - `secret.*` (21): Spoken pitches matching each `SECRETS` entry (`pan`, `mimas`, `iapetus`, `enceladus`, `moon-earth`, `everest`, `apollo`, `olympus`, `phobos`, `mars-sky`, `io`, `europa`, `titan`, `miranda`, `triton`, `charon`, `horizon`, `blackhole`, `fisheye`, `true-scale`, `time`).
  - `accept.1`–`3` (3) & `decline.1`–`2` (2).
  - `nebula.*` (12): `nebula.leaving`, `nebula.swing`, `nebula.back`, plus 9 specific nebulae (`cosmic-cliffs`, `mystic-mountain`, `helix`, `orion-cloud`, `rosette-ring`, `crab-shell`, `veil-filaments`, `lagoon-lane`, `north-america`).
  - `shot.*` / `postcard.*` / `gallery.*` (8): `shot.first`, `shot.taken.1`–`4`, `postcard.arrive.1`–`2`, `gallery.tip`.
  - `timelapse.*` (4): `timelapse.1`–`3` (surface rotation), `timelapse.bh` (horizon camera drift).
- **Fright, Care, Exploration, Farewell & Aftermath (`fright.*`, `care.*`, `explore.*`, `log.*`, `farewell.*`, `after.*` — 99 lines)**:
  - `fright.*` (25): `fright.sun.1`–`3`, `fright.flare.1`, `fright.speed.1`–`4`, `fright.dark.1`–`3`, `fright.galaxy.1`–`2`, `fright.surface.1`–`2`, `fright.close.1`, `fright.bh.1`–`3`, `fright.rock`, `fright.calm.1`–`3`, `fright.time.1`, `fright.lost.1`.
  - `care.*` (20): `care.break.1`–`2`, `care.eyes.1`, `care.posture.1`, `care.water.1`–`2`, `care.late.1`–`3`, `care.morning.1`, `care.long.1`–`2`, `care.back.1`, `care.proud.1`–`2`, `care.sad.1`–`2`, `care.night.1`, `care.thanks.1`–`2`.
  - `explore.*` & `log.*` (42): `explore.first`, 15 percentage milestones (`explore.p1`, `p5`, `p10`, `p20`, `p25`, `p33`, `p40`, `p50`, `p60`, `p66`, `p75`, `p80`, `p90`, `p95`, `p99`), `explore.status.0`–`6`, `explore.atlas.1`–`5`, `explore.moonfamily`, `explore.newmoon.1`–`3`, `explore.tease.1`–`3`, `explore.system.done`, `explore.planets.done`, `explore.comeback`, and `log.3`, `log.5`, `log.7`, `log.10`.
  - `farewell.*` (12) & `after.*` (6): `farewell.choice`, `farewell.later`, `farewell.1`–`10` (100% completion emotional goodbye), and `after.1`–`6` (post-completion return lines).
- **Jokes, Giggles, Idle, Musings, Conversations, UI Reactions, Music & Settings (`joke.*`, `giggle.*`, `idle.*`, `noise.*`, `think.*`, `poke.*`, `feel.*`, `convo.*`, `menu.*`, `react.*`, `surface.*`, `home.*`, `overview.*`, `revisit.*`, `hop.*`, `session.*`, `hush`, `music.*`, `settings.*` — 207 lines)**:
  - `joke.1`–`30` (30 space puns/jokes) + `joke.laugh.1`–`3` (3) + `joke.groan.1`–`3` (3).
  - `giggle.1`–`8` (8 easter-egg giggles, e.g., `[laugh] Hehe.`, `[chuckle] You poked me. Again. Hehe.`).
  - `idle.1`–`20` (20 idle nudges including Gerald the asteroid easter egg), `noise.1`–`15` (15 humming/ambient remarks), `think.1`–`4` (4 fillers), `poke.1`–`4` (4 tap responses), `feel.1`–`22` (22 reflective musings).
  - `convo.*` (31 across 10 multi-choice mini-conversations: `alone`, `fav`, `scale`, `why`, `home`, `dream`, `space`, `me`, `night`, `friend`).
  - `menu.*` (4: `something`, `joke`, `talk`, `progress`), `hush` (1), `session.long` / `session.long.2` (2), `home.1`–`4` (4), `overview.1`–`3` (3), `revisit.1`–`3` (3), `hop.1`–`2` (2), `surface.1`–`4`, `surface.air`, `surface.tiny`, `surface.tiny.2` (7).
  - `react.*` (15): `orbits-off` (1–2), `orbits-on`, `year` (1–2), `fisheye` (1–2), `pause` (1–2), `play`, `realtime`, `clean` (1–2), `constellations-off`, `constellations-on`.
  - `music.*` (14): `music.first`, `music.deck`, `music.picked`, `music.muted`, plus 10 per-track commentaries `music.track.00-helios-overture` through `music.track.09-event-horizon-silence`.
  - `settings.*` (4): `settings.open.1`–`2`, `settings.quiet`, `settings.chatty`.

#### 1.5 Exact `public/voice/vela/` Audio Inventory
- **Total Files**: **572** `.mp3` files + `manifest.json` (`58,076` bytes), matching 1:1 with the 572 keys in `src/companion/vela-lines.json` (verified by `src/tests/companion.test.ts`, which also enforces case-insensitive uniqueness across line IDs).
- **Filename Normalization**: Line IDs map directly to `<id>.mp3` except characters unsafe for filesystems (`*` and spaces in `Sagittarius A*`), which become underscores:
  - `arrive.Sagittarius_A_.1.mp3` through `arrive.Sagittarius_A_.4.mp3`
  - `journey.Sagittarius_A_.mp3`
  - `memory.last.Sagittarius_A_.mp3`
- **Breakdown by Prefix**:
  - `accept.1`–`3.mp3` (3)
  - `after.1`–`6.mp3` (6)
  - `arrive.<Body>.<n>.mp3` (128: `Amalthea` 1, `Ariel` 2, `Atlas` 1, `Callisto` 2, `Charon` 2, `Daphnis` 1, `Deimos` 2, `Dione` 2, `Earth` 6, `Enceladus` 2, `Epimetheus` 1, `Europa` 2, `Ganymede` 2, `Himalia` 1, `Hydra` 1, `Hyperion` 2, `Iapetus` 2, `Io` 2, `Janus` 1, `Jupiter` 7, `Kerberos` 1, `Mars` 6, `Mercury` 5, `Mimas` 2, `Miranda` 2, `Moon` 6, `Neptune` 6, `Nereid` 1, `Nix` 1, `Oberon` 2, `Pan` 1, `Phobos` 2, `Phoebe` 1, `Pluto` 6, `Prometheus` 1, `Proteus` 2, `Rhea` 2, `Sagittarius_A_` 4, `Saturn` 7, `Styx` 1, `Sun` 6, `Tethys` 2, `Titan` 3, `Titania` 2, `Triton` 2, `Umbriel` 1, `Uranus` 6, `Venus` 5)
  - `bh.{approach,deep,horizon,photon,rock}.mp3` (5)
  - `care.{back.1,break.1-2,eyes.1,late.1-3,long.1-2,morning.1,night.1,posture.1,proud.1-2,sad.1-2,thanks.1-2,water.1-2}.mp3` (20)
  - `convo.{alone,dream,fav,friend,home,me,night,scale,space,why}.*.mp3` (31)
  - `cross.{belt,kuiper,trojans}.mp3` (3)
  - `decline.1`–`2.mp3` (2)
  - `explore.{atlas.1-5,comeback,first,moonfamily,newmoon.1-3,p1,p5,p10,p20,p25,p33,p40,p50,p60,p66,p75,p80,p90,p95,p99,planets.done,status.0-6,system.done,tease.1-3}.mp3` (38)
  - `farewell.{1-10,choice,later}.mp3` (12)
  - `feel.1`–`22.mp3` (22)
  - `fright.{bh.1-3,calm.1-3,close.1,dark.1-3,flare.1,galaxy.1-2,lost.1,rock,speed.1-4,sun.1-3,surface.1-2,time.1}.mp3` (25)
  - `gallery.tip.mp3` (1)
  - `giggle.1`–`8.mp3` (8)
  - `greet.{afternoon,afternoon.2,back.1-8,evening,evening.2,first.1-3,morning,morning.2,night,night.2}.mp3` (19)
  - `home.1`–`4.mp3` (4), `hop.1`–`2.mp3` (2), `hush.mp3` (1)
  - `idle.1`–`20.mp3` (20)
  - `joke.1`–`30.mp3`, `joke.groan.1`–`3.mp3`, `joke.laugh.1`–`3.mp3` (36)
  - `journey.{Earth,Jupiter,Mars,Mercury,Moon,Neptune,Pluto,Sagittarius_A_,Saturn,Uranus,Venus,hop}.mp3` (12)
  - `log.{3,5,7,10}.mp3` (4)
  - `memory.{away,last.*,many,moons,stood}.mp3` (17)
  - `menu.{joke,progress,something,talk}.mp3` (4)
  - `minor.1`–`5.mp3` (5)
  - `music.{deck,first,muted,picked,track.00..09}.mp3` (14)
  - `nebula.{back,cosmic-cliffs,crab-shell,helix,lagoon-lane,leaving,mystic-mountain,north-america,orion-cloud,rosette-ring,swing,veil-filaments}.mp3` (12)
  - `noise.1`–`15.mp3` (15)
  - `overview.1`–`3.mp3` (3)
  - `poke.1`–`4.mp3` (4)
  - `postcard.arrive.1`–`2.mp3` (2)
  - `react.{clean,clean.2,constellations-off,constellations-on,fisheye,fisheye.2,orbits-off,orbits-off.2,orbits-on,pause,pause.2,play,realtime,year,year.2}.mp3` (15)
  - `revisit.1`–`3.mp3` (3)
  - `secret.*.mp3` (21)
  - `session.long.mp3`, `session.long.2.mp3` (2)
  - `settings.{chatty,open.1-2,quiet}.mp3` (4)
  - `shot.{first,taken.1-4}.mp3` (5)
  - `space.{belt,comets,geminids,halley,kuiper,markers,meteors,scale}.mp3` (8)
  - `surface.{1-4,air,tiny,tiny.2}.mp3` (7)
  - `think.1`–`4.mp3` (4)
  - `timelapse.{1-3,bh}.mp3` (4)
  - `tour.0`–`17.mp3` (18)
  - `worlds.{big,big.2,true}.mp3` (3)

---

### 2. Military ATC & Wingman Radio System (`RadioChain.ts`, `RadioDirector.ts`)

#### 2.1 Complete Web Audio DSP Graph (`src/flight/audio/RadioChain.ts`)
- **Architecture & Bus Routing**:
  - `RadioChain(ctx, out)` connects into `JetAudio`'s `radioBus` (`gain = 1.0`), which routes directly to `master`, bypassing `hull` and `world` filters so radio remains crisp during vacuum flight, cloud immersion, and G-induced grey-out.
  - Pre-allocates a 2-second mono white-noise `AudioBuffer` (`Math.random() * 2 - 1` across `ctx.sampleRate * 2` samples) reused for key click, carrier hiss, crackle pops, and squelch tails.
  - Per-call master node `call = ctx.createGain()` scaled by `COLOURS[speaker].gain`; disconnected via `window.setTimeout` at `(finish - ctx.currentTime + 0.5) * 1000` ms.
- **Speaker Profiles (`COLOURS: Record<RadioSpeaker, Colour>`)**:
  - `pilot` (`ONE-ONE`, sidetone): `drive = 2.2`, `hiss = 0.010`, `crackle = 0`, `flutter = 0.05`, `rate = 1`, `gain = 0.85`.
  - `wing` (`TWO`, wingman): `drive = 3.0`, `hiss = 0.016`, `crackle = 0`, `flutter = 0.1`, `rate = 1`, `gain = 0.95`.
  - `control` (`CONTROL`, ground ATC): `drive = 3.4`, `hiss = 0.02`, `crackle = 0.15`, `flutter = 0.15`, `rate = 1`, `gain = 1`.
  - `mission` (`SOLARIS CONTROL`, deep-space): `drive = 3.8`, `hiss = 0.026`, `crackle = 0.5`, `flutter = 0.3`, `rate = 0.98`, `gain = 1`.
- **Stage 1 — Key Click (PTT Switch Transient at $t_0 = \max(\text{at}, \text{currentTime} + 0.02)$)**:
  - Sine oscillator at **700 Hz**, `0` $\rightarrow$ linear ramp to `0.16` at $t_0 + 0.002$ s $\rightarrow$ exponential decay (`setTargetAtTime(0, t0 + 0.004, 0.004)`), stopped at $t_0 + 0.03$ s.
  - White-noise burst (`0.02` s) $\rightarrow$ `bandpass` (**2400 Hz**, `Q = 1.2`) $\rightarrow$ gain `0.05` decaying via `setTargetAtTime(0, t0 + 0.003, 0.004)`.
- **Stage 2 — Voice Passband, Saturation, Compression & Receiver Earpiece (`RADIO_TUNING`, starts at $v_0 = t_0 + 0.06$ s)**:
  - `src` (`AudioBufferSourceNode`, `playbackRate = c.rate`, duration $\text{dur} = \text{voice.duration} / c.\text{rate}$) chains serially through:
  - **Mic & Transmitter Pre-EQ**:
    1. `highpass` @ **300 Hz** (`Q = 0.707`)
    2. `highpass` @ **300 Hz** (`Q = 0.707`, combined 24 dB/oct roll-off)
    3. `peaking` @ **600 Hz**, `Q = 1.0`, `gain = -5 dB` (boxy low-mid cut)
    4. `peaking` @ **2000 Hz**, `Q = 0.6`, `gain = +9 dB` (nasal presence bite)
    5. `highshelf` @ **2600 Hz**, `Q = 0.707`, `gain = +8 dB`
    6. `lowpass` @ **4200 Hz** (`Q = 0.707`, anti-aliasing before non-linear waveshaping)
  - **Pre-Gain & WaveShaper Overdrive**:
    - `pre` gain: **1.4**
    - `WaveShaperNode` (`oversample = '2x'`) using cached 1024-sample `driveCurve(k)` where $k = c.\text{drive} + 1.2 \cdot \text{far}$ (quantized to 0.1 steps) and normalized $\tanh$ transfer equation:
      $$y[i] = \frac{\tanh(k \cdot x_i)}{\tanh(k)}, \quad x_i = \frac{2i}{1023} - 1,\quad i \in [0, 1023]$$
  - **Transmitter Limiter/Compressor (`DynamicsCompressorNode`)**:
    - `threshold = -24 dB`, `knee = 6 dB`, `ratio = 6:1`, `attack = 0.003 s`, `release = 0.12 s`.
  - **Receiver IF Filter & Earpiece Stage**:
    1. `highpass` @ **250 Hz** (`Q = 0.707`)
    2. `highpass` @ **250 Hz** (`Q = 0.707`, strips regenerated intermodulation fundamental ~120 Hz)
    3. `lowshelf` @ **600 Hz**, `Q = 0.707`, `gain = 0 dB` (reserved shelf hook)
    4. `peaking` @ **3300 Hz**, `Q = 1.0`, `gain = +8 dB` (thin, forward helmet earpiece)
    5. `lowpass` @ **3900 Hz**, `Q = 1.5`
    6. `lowpass` @ **3900 Hz**, `Q = 1.5`
    7. `lowpass` @ **4000 Hz**, `Q = 0.707`
    8. `notch` @ **4800 Hz**, `Q = 0.7`
    9. `post` gain: **0.9** $\rightarrow$ `call`
  - **Signal Flutter LFO**: If $\text{flutterDepth} = c.\text{flutter} + 0.35 \cdot \text{far} > 0.02$, a sine LFO at $3 + 4 \cdot \text{rand}()$ Hz modulates `post.gain` with depth $0.18 \cdot \text{flutterDepth}$ over $[v_0, v_0 + \text{dur} + 0.1]$.
  - *Measured acoustic target (per source docstring)*: 5–95% energy within 330–3550 Hz, word spectral centroids 1.2–2.5 kHz, 4–5 kHz band 21–30 dB down, >5 kHz 38–43 dB down.
- **Stage 3 — Carrier Static Hiss & Distance Crackle**:
  - **Carrier Hiss**: White noise $\rightarrow$ `bandpass` (**1400 Hz**, `Q = 0.5`) $\rightarrow$ `lowpass` (**2600 Hz**, `Q = 0.707`) $\rightarrow$ gain `hissLevel = c.hiss * (1 + 2.2 * far)`, ramping `0` $\rightarrow$ `hissLevel` over `0.03` s at $t_0$ and holding until `end`, fading out over `0.02` s (`end = v0 + dur`).
  - **Crackle Pops**: If $\text{crackle} = c.\text{crackle} + 1.5 \cdot \text{far} > 0.05$, spawns $\lfloor \text{crackle} \cdot \text{dur} \cdot 5 \rfloor$ random 30 ms white-noise impulses routed through `bandpass` (**1800 Hz**, `Q = 0.8`), with initial gain $0.06 + 0.1 \cdot \text{rand}()$ decaying via `setTargetAtTime(0, pt + 0.002, 0.006)`.
- **Stage 4 — Squelch Tail ("ksshh-tk")**:
  - Starts at $\text{sq} = \text{end} + 0.03$ s, noise burst length $\text{sqLen} = 0.07 + 0.05 \cdot \text{rand}() + 0.08 \cdot \text{far}$ s.
  - White noise $\rightarrow$ `bandpass` (**2200 Hz**, `Q = 0.7`) $\rightarrow$ gain envelope (`0` $\rightarrow$ `0.13` in `0.006` s $\rightarrow$ `0.11` at `0.6 * sqLen` $\rightarrow$ `0` at `sq + sqLen`).
  - Closing squelch click (`snap`): **1800 Hz** `square` oscillator at `sq + sqLen`, ramping `0` $\rightarrow$ `0.05` in `0.001` s $\rightarrow$ `setTargetAtTime(0, +0.002, 0.003)`, stopped at `+0.03` s.
  - Returns total end timestamp `finish = sq + sqLen + 0.05` s.

#### 2.2 Situational Event Rules, Hysteresis, Queueing & Cooldowns (`src/flight/audio/RadioDirector.ts`)
- **Manifest, History & Selection**:
  - Loads `${BASE_URL}voice/radio/manifest.json` asynchronously into `lines: Record<string, RadioLine>` and indexes IDs by `trigger` (`byTrigger`).
  - `pick(trigger, notBy?)`: Selects among lines matching `trigger` (excluding `notBy` speaker on replies) that have the oldest timestamp in `localStorage['solaris.radio.heard']` (`0` = never heard, tie-breaking within 1 ms randomly), so lines never repeat back-to-back across visits.
  - `distance` passed to `RadioOutput.speak`: `far` for `'mission'`, `0.1` for `'control'`, `0` for `'pilot'` and `'wing'`.
  - Distance attenuation formula (`far`): $\min\!\big(1, \max(0, \log_{10}(\max(\text{earthDistKm}, 1) / 4\times 10^5) / 3)\big)$ (0 at $\le 400{,}000$ km, scaling logarithmically to 1 at $4 \times 10^8$ km).
  - Subtitle format: `${LABEL[speaker]} · ${line.text}` shown for `secs + 0.8` s (`LABEL`: `ONE-ONE`, `TWO`, `CONTROL`, `SOLARIS CONTROL`).
- **Queueing, Priorities, Gaps & Stale Expiry**:
  - **Initial Call**: On first `update()`, queues `{ trigger: 'start', at: t + 2.5 }`, initializes `wasGround = f.altKm < 0.08`.
  - **Queue Limits**: Non-urgent calls only enqueue when `queue.length < 3`; `URGENT` triggers (`'terrain'`, `'body:Sun'`) unshift to the front (`queue.unshift`).
  - **Stale Drop**: Any non-urgent queued item older than **25 s** (`t - head.at > 25`) is discarded.
  - **Transmit Spacing**: Normal calls wait until `t >= busyUntil + 6` s; reply calls (`replyTo` set) wait `0.9 + Math.random() * 1.2` s; `URGENT` calls transmit immediately regardless of `busyUntil`.
  - **Frequency Reservation**: `busyUntil` reserves `timeSec + line.seconds + 1.5` immediately upon dequeuing, then updates to `performance.now()/1000 - clockOffset + secs` once decoded.
  - **Call-and-Response (`ANSWERED`)**: With 40% probability (`Math.random() < 0.4`), triggers a follow-up from a *different* speaker (`replyTo: line.speaker`):
    - `'awe'` after `cloudout`, `sunrise`, `orbit`, `karman`, `aurora`, or any `place:*` / `body:*` / `sky:*` call not spoken by `'mission'`.
    - `'joy'` after `mach1` or `lowfly`.
  - **Cruise Chatter**: If `t - lastTalk > nextCruise` (initially **200 s**, then `160 + Math.random() * 120` s) with empty queue and free frequency (`t > busyUntil`), fires `'cruise'`.
- **Cooldown Table (`COOLDOWN`, seconds)**:
  - `terrain`: 25 s | `terrainafter`: 60 s | `cloudin`: 120 s | `cloudout`: 120 s | `highg`: 150 s | `gafter`: 150 s | `reentry`: 180 s | `storm`: 200 s | `lowfly`: 300 s | `mach1`: 400 s | `climb`: 600 s | `sunrise`: 600 s | `sunset`: 600 s | `mach2`: 600 s | `hyper`: 600 s | `night`: 900 s | `aurora`: 1800 s.
- **Flight Edge & Situational Trigger Rules (`watch()` & `event()`)**:
  - **Speed / Mach Edges** (when `inAir = f.air > 0.005`, initially armed):
    - `mach1`: fires at `mach > 1.0`, re-arms at `< 0.9`.
    - `mach2`: fires at `mach > 2.0`, re-arms at `< 1.8`.
    - `hyper`: fires at `mach > 5.0`, re-arms at `< 4.5`.
  - **Earth Altitude & Departure Edges** (initially armed):
    - `climb` (`Earth`): fires at `altKm > 3`, re-arms at `< 1.5`.
    - `karman` (`Earth`): fires at `altKm > 100`, re-arms at `< 80`.
    - `orbit` (`Earth`): fires at `altKm > 400`, re-arms at `< 200`.
    - `leaveearth`: fires at `earthDistKm > 60000`, re-arms at `< 25000`.
    - `body:Earth` return: arms `wasFarFromEarth` when `earthDistKm > 100000`, fires `body:Earth` when returning to `Earth` with `earthDistKm < 40000`.
  - **Takeoff, Approach & Touchdown**:
    - `ground = f.altKm < 0.03 && f.speedMps < 120`.
    - `takeoff`: `wasGround && f.altKm > 0.2 && f.speedMps > 70` (sets `airborneT = t`).
    - `approach`: `!wasGround && !ground && f.altKm < 0.4 && f.speedMps < 110 && inAir && !approachSaid && t - airborneT > 30`.
    - `touchdown`: `!wasGround && ground && t - airborneT > 30`.
  - **High-G & Recovery**:
    - Accumulates `gHigh` at `1/60` per update while `gLoad > 6` (resets to `0` otherwise); fires `highg` when `gHigh > 1.2` s.
    - When `gWasHigh && gLoad < 3`, fires `gafter` (with 60% probability, queued directly for `t + 1` s).
  - **Terrain, Re-entry & Clouds**:
    - `terrain` (`URGENT`): fires immediately when `warning === 1`; accumulates `terrainT` at `1/60` s; if `warning` clears after `terrainT > 0.8` s, queues `terrainafter` at `t + 1.2` s.
    - `reentry`: fires when `warning === 2 && inAir`.
    - `cloudin`: 50% chance on entering `inCloud`; `cloudout` fires on exit if inside `> 6` s.
  - **Low-Altitude High-Speed Flight**:
    - `lowfly`: accumulates `lowT` while `inAir && altKm < 0.15 && speedMps > 120`; fires at `lowT > 5` s.
  - **Sun, Night & Aurora** (when `inAir && altKm < 80`):
    - `sunrise`: `lastSunUp < 0.02 && sunUp >= 0.02`.
    - `sunset`: `lastSunUp > 0.02 && sunUp <= 0.02`.
    - `night`: `sunUp < -0.12` with `0.002` per-frame probability.
    - `aurora`: `Earth && |lat| > 62° && sunUp < -0.12` with `0.0015` per-frame probability.
  - **World Arrivals & Sky Events**:
    - `body:<nearest>`: fires on `nearest` change (non-Earth) when `altKm < radiusKm * 8`, or stores `pendingBody` until entering `altKm < radiusKm * 8`.
    - `skyEvent` transitions (case-insensitive substring): `'ECLIPSE'` $\rightarrow$ `sky:eclipse`, `'FLARE'` $\rightarrow$ `sky:flare`, `'COMET'` $\rightarrow$ `sky:comet`, `'METEOR'` $\rightarrow$ `sky:meteors`, `'ROCKS'` $\rightarrow$ `belt`.
    - `deep`: `earthDistKm > 4.5e9` km with `0.0008` per-frame probability.
    - External events via `director.event(trigger)`: used for direct flight triggers such as `'storm'` (close thunder) or `'era'` (time-era changes).
  - **Earth Geography (`Earth && altKm < 80`)**:
    - **Countries**: Maps Nominatim aliases (`Türkiye` $\rightarrow$ `Turkey`, `United States of America` $\rightarrow$ `United States`, `Republic of Korea` $\rightarrow$ `South Korea`, `Russian Federation` $\rightarrow$ `Russia`, `People's Republic of China` $\rightarrow$ `China`); debounces `countryCandidate` for **3 s** before firing `country:<name>`.
    - **Oceans**: When `atSea` stays true for **> 20 s**, sets state to `'~sea'` and fires `ocean:<Arctic|Indian|Atlantic|Pacific>` via `oceanAt(lat, lon)` (`lat > 66` $\rightarrow$ `Arctic`; `20 < lon < 120 && lat < 30` $\rightarrow$ `Indian`; `-70 < lon < 20` $\rightarrow$ `Atlantic`; else `Pacific`).
    - **Landmarks (`PLACES`, when `altKm < 30`, Haversine distance `< km`, 1200 s per-place cooldown)**:
      - `himalaya` (27.99, 86.93, 120 km), `eiffel` (48.858, 2.294, 12 km), `pyramids` (29.979, 31.134, 15 km), `grandcanyon` (36.1, -112.1, 60 km), `sahara` (23.4, 9.0, 900 km), `alps` (45.9, 7.4, 140 km), `tokyo` (35.68, 139.76, 40 km), `newyork` (40.758, -73.985, 25 km), `dubai` (25.197, 55.274, 25 km), `taj` (27.175, 78.042, 12 km), `fuji` (35.36, 138.73, 40 km), `amazon` (-3.4, -62.2, 700 km).

#### 2.3 Exact `public/voice/radio/` Clip Inventory
- **Total Files**: **149** `.mp3` files + `manifest.json` (`52,182` bytes), verified 1:1 against `scripts/radio_lines.json` by `src/tests/radioDirector.test.ts`.
- **Clip Breakdown**:
  - **World/Body Calls (27)**: `body.Callisto.mp3`, `body.Ceres.mp3`, `body.Earth.mp3`, `body.Earth.2.mp3`, `body.Enceladus.mp3`, `body.Europa.mp3`, `body.Ganymede.mp3`, `body.Io.mp3`, `body.Jupiter.mp3`, `body.Jupiter.2.mp3`, `body.Mars.mp3`, `body.Mars.2.mp3`, `body.Mars.3.mp3`, `body.Mercury.mp3`, `body.Moon.mp3`, `body.Moon.2.mp3`, `body.Neptune.mp3`, `body.Pluto.mp3`, `body.Saturn.mp3`, `body.Saturn.2.mp3`, `body.Sgr.mp3`, `body.Sun.mp3`, `body.Sun.2.mp3`, `body.Titan.mp3`, `body.Uranus.mp3`, `body.Venus.mp3`, `body.Venus.2.mp3`.
  - **Country Calls (40 across 39 ISO codes)**: `country.{AE,AQ,AR,AU,BD,BR,CA,CH,CL,CN,DE,EG,ES,FR,GB,GR,ID,IN,IN.2,IR,IS,IT,JP,KE,KR,LK,MA,MX,NG,NO,NP,NZ,PE,PK,RU,SA,TH,TR,US,ZA}.mp3`.
  - **Landmarks & Aurora (13)**: `place.{alps,amazon,aurora,dubai,eiffel,fuji,grandcanyon,himalaya,newyork,pyramids,sahara,taj,tokyo}.mp3`.
  - **Oceans (4)**: `ocean.{arctic,atlantic,indian,pacific}.mp3`.
  - **Flight Phases & Hazards (37)**: `start.1`–`3.mp3`, `takeoff.1`–`2.mp3`, `climb.1`–`2.mp3`, `land.1`–`3.mp3`, `low.1`–`2.mp3`, `mach1.1`–`2.mp3`, `mach2.1.mp3`, `hyper.1`–`2.mp3`, `karman.1`–`2.mp3`, `orbit.1`–`2.mp3`, `leave.1`–`2.mp3`, `reentry.1`–`2.mp3`, `g.1`–`4.mp3`, `terrain.1`–`3.mp3`, `cloudin.1.mp3`, `cloudout.1`–`2.mp3`, `storm.1`–`2.mp3`.
  - **Sky, Time, Cruise & Reactions (28)**: `sunrise.1`–`2.mp3`, `sunset.1`–`2.mp3`, `night.1`–`2.mp3`, `sky.{comet,eclipse,flare,meteors}.mp3`, `belt.1.mp3`, `deep.1`–`2.mp3`, `era.1.mp3`, `cruise.1`–`6.mp3`, `react.awe.1`–`4.mp3`, `react.calm.1`–`2.mp3`, `react.joy.1`–`2.mp3`.

---

### 3. Jet Propulsion & Cockpit SFX (`src/flight/JetAudio.ts`)

#### 3.1 Master Bus Topology, Filters & Noise Generators
- **Master Output Chain**:
  - `master` (`GainNode`, target `0.9` or `0` when muted) $\rightarrow$ `glue` (`DynamicsCompressorNode`: `threshold = -10 dB`, `ratio = 2.5`, `attack = 0.01 s`, `release = 0.3 s`) $\rightarrow$ `limit` (`DynamicsCompressorNode` brickwall safety: `threshold = -3 dB`, `knee = 0 dB`, `ratio = 20`, `attack = 0.002 s`, `release = 0.12 s`) $\rightarrow$ `ctx.destination`.
- **Sub-Buses & Environmental Filters**:
  - `hull` (`BiquadFilterNode` lowpass, `Q = 0.4`, cutoff $500 + 9000 \cdot \min(1, 6 \cdot \text{air})$ Hz): Simulates air conduction vs vacuum conduction through the airframe; routes into `world`.
  - `world` (`BiquadFilterNode` lowpass, `Q = 0.5`) $\rightarrow$ `duck` (`GainNode`) $\rightarrow$ `master`:
    - `openHz = s.inCloud ? 900 : 20000` Hz; under G-strain (`grey = min(1, |greyOut|)`), log-interpolates cutoff down to **280 Hz**:
      $$f_{\text{world}} = \exp\!\big(\ln(f_{\text{open}}) + (\ln(280) - \ln(f_{\text{open}})) \cdot \text{grey}\big)$$
    - `duck` gain: `(talking ? 0.4 : 1) * (1 - 0.5 * grey)` with `0.1` s attack / `0.45` s release time constant.
  - `engineBus` $\rightarrow$ `hull`: Attenuated inside the cockpit by airflow masking ($1 - 0.45 \min(1, 2.5q)$) and altitude ($1 - 0.65 \cdot \text{smooth01}(\text{altKm}/5)$, ~`-9 dB` by 5 km).
  - `pilotBus` $\rightarrow$ `master` (gain `1` inside canopy, `0` outside; bypasses `hull`, `world`, and `duck`).
    - `mask` (synthetic breath path): `lowpass` (`1300 Hz`, `Q = 0.5`) $\rightarrow$ `lowshelf` (`220 Hz`, `+4 dB`) $\rightarrow$ `pilotBus`.
    - `maskRec` (recorded breath/strain path): `highpass` (`140 Hz`) $\rightarrow$ `peaking` (`1400 Hz`, `Q = 0.8`, `+2 dB`) $\rightarrow$ `lowpass` (`6000 Hz`) $\rightarrow$ `pilotBus`.
  - `radioBus` (`gain = 1.0`) $\rightarrow$ `master` (hosts `RadioChain`; bypasses `hull`/`world`/`duck`).
  - `betty` (`gain = 2.0`, ~`+5 dB` over cockpit bed) $\rightarrow$ `highpass` (`280 Hz`) $\rightarrow$ `lowpass` (`5200 Hz`) $\rightarrow$ `master`.
- **Procedural 4-Second Noise Beds**:
  - `noise` (pink-ish, Paul Kellet 3-pole approximation): $b_0 = 0.99765 b_0 + 0.099046 w$, $b_1 = 0.963 b_1 + 0.2965164 w$, $b_2 = 0.57 b_2 + 1.0526913 w$, output $(b_0 + b_1 + b_2 + 0.1848 w) \times 0.18$.
  - `brown`: leaky integrator $\text{last} = (\text{last} + 0.02 w) / 1.02$, output $\text{last} \times 3.5$.

#### 3.2 Engine Propulsion Layers, Spool Curves & Afterburner
- **Asymmetric Rotor Spool (`N2`)**:
  - `abLvl = abStage !== undefined ? max(boost, abStage / 3) : boost`.
  - Target spool `want = 0.35 + 0.65 * throttle + 0.08 * abLvl`.
  - Asymmetric time constant: $\tau = 1.6\text{ s}$ spooling up (`want > spool`), $\tau = 2.4\text{ s}$ spooling down; exponential integration `spool += (want - spool) * (1 - exp(-dt / tau))`.
  - Normalized power $g = (n - 0.35) / 0.73$ (`0` at idle, `1` at full wet power).
- **Recorded Engine Loops + Pitch Curves (`engine_idle.mp3`, `engine_high.mp3`, `engine_start.mp3`)**:
  - `playStart()`: Triggered once at startup if `altKm < 0.1 && speedMps < 30`; fetches `engine_start.mp3`, ramps to `0.55` over `0.3` s and fades out over the final `4` s directly into `hull`.
  - Equal-power trigonometric crossfade driven by $x = \text{smooth01}(g + 0.25 \cdot \text{boost})$ and `level = inside ? 0.55 : 0.9`:
    - `idleGain`: $\text{level} \cdot \cos(\frac{\pi}{2} x)$ | `idle.playbackRate`: $0.86 + 0.4 n$
    - `highGain`: $\text{level} \cdot \sin(\frac{\pi}{2} x) \cdot (1 + 0.3 \cdot \text{boost})$ | `high.playbackRate`: $0.80 + 0.2 n$
  - Once both loops load, `synth` scaling drops from `1.0` to `0.5` so procedural layers act as responsive throttle texture underneath the recordings.
- **Procedural Engine Layers (all routed to `engineBus`)**:
  - **Sub**: 2 sine oscillators at $(32 + 26n)$ Hz and $2.01 \times (32 + 26n)$ Hz; gain `(inside ? 0.32 : 0.22) * (0.25 + 0.75 * g) * (1 + 0.4 * boost)`.
  - **Turbine**: 2 sawtooth oscillators (`detune = 0` and `+7` cents) at $140 + 760n$ Hz $\rightarrow$ `lowpass` at $900 + 2600n$ Hz; gain `(inside ? 0.05 : 0.025) * (0.4 + n) * synth`.
  - **Compressor Whine**: Sawtooth oscillator at $1900 + 1700n$ Hz $\rightarrow$ narrow `bandpass` (`1900 + 1700n` Hz, `Q = 8`); gain `(inside ? 0.012 : 0.02) * (0.3 + 0.7 * g) * synth`.
  - **Jet Roar**: Pink `noise` $\rightarrow$ `lowpass` at $220 + 1800g + 1400\cdot\text{boost}$ Hz; gain `(inside ? 0.35 : 0.6) * (0.2 + 0.8 * g) * (1 + 0.6 * boost) * (0.4 + 0.6 * synth)`.
  - **Roughness**: `brown` noise $\rightarrow$ `bandpass` (`260 Hz`, `Q = 1.1`) $\rightarrow$ AM-modulated (`gain = 0.5` modulated by `brown` noise $\rightarrow$ `12 Hz` LPF $\rightarrow$ `gain = 0.6`); output gain `0.18 * (0.3 + 0.7 * g + 0.4 * boost)`.
  - **Afterburner Rumble & Light-Off `whump(t)`**:
    - Continuous rumble: `brown` noise $\rightarrow$ `lowpass` at $110 + 180 \cdot \text{abLvl}$ Hz (`Q = 1.2`); gain `abLvl * (inside ? 0.9 : 1.4)`.
    - Stage/light-off transient (`whump(t)`): Fires when `boost > 0.5` rises or `abStage` steps up (`>= 1`); spikes `burner.gain` to `2.4` decaying toward `1.2`, and triggers a `70 Hz` $\rightarrow$ `32 Hz` exponential-ramp sine oscillator (`0.6` s sweep, `0.9` peak gain into `hull`).

#### 3.3 Airflow, Drag/Stall Buffet, Thunder & Cockpit Mechanics
- **Dynamic Pressure & Wind (`wind`)**:
  - Normalized dynamic pressure $q = \text{air} \cdot \min(\text{speedMps}, 1500)^2 / 10^6$.
  - Buffet multiplier: $1 + 0.25\sin(23t)\sin(7.1t) + 0.2 \cdot \text{clamp}((|g\text{Load}| - 5)/4, 0, 1)\sin(31t)$.
  - Pink `noise` $\rightarrow$ `bandpass` (`350 + 1.6 * min(speedMps, 1500)` Hz, `Q = 0.6`) $\rightarrow$ `world`; gain `min(0.9, 0.9 * q) * buffet * (inside ? 0.85 : 1)`.
- **Aerodynamic Drag & Stall Buffet (`dragBuffet`)**:
  - Combined drag proxy $\text{dragStrength} = \min(1, q \cdot (0.85 \cdot \text{airbrake} + 0.45 \cdot (\text{gearDown}?1:0) + 1.15 \cdot \text{buffet}))$.
  - `brown` noise $\rightarrow$ `lowpass` ($160 + 280 \cdot \text{dragStrength}$ Hz, `Q = 0.9`) $\rightarrow$ `world`; gain `dragStrength * (inside ? 0.5 : 0.75)`.
- **Cockpit ECS, Canopy Rumble & Structural Creak / Touchdown**:
  - **ECS Hiss (`ecs`)**: Pink `noise` $\rightarrow$ `bandpass` (`2200 Hz`, `Q = 0.6`) $\rightarrow$ `lowpass` (`4800 Hz`, `Q = 0.5`) $\rightarrow$ `world`; steady gain `0.035` inside, `0` outside.
  - **Canopy Loop (`canopy.mp3`)**: Gain `0.4 * (0.12 + atmos * (0.35 + 0.65 * min(1, 2*q)))` inside (leaves a subtle `0.048` systems hum in vacuum), `0` outside.
  - **Oleo Touchdown Thump & Canopy Creak (`creak(t, level)`)**:
    - Fires on landing (`touchdownImpulse > 0.05` with `0.8` s cooldown) and under high-G onset (`g > 4.5 && gRate > 2.5` every `3.5` s, or sustained `g > 7` every `5–8` s).
    - Synthesizes a `95–125 Hz` $\rightarrow$ `70–90 Hz` sawtooth groan through `bandpass` (`420 Hz`, `Q = 3`, `0.08 * level` gain) plus 4 staggered `2400–4000 Hz` (`Q = 4`) pink-noise snap ticks directly into `master`.
- **Speed-of-Sound Thunder (`thunder(distanceKm)`)**:
  - Delayed by $\min(12, \text{distanceKm} \times 2.9)$ s (~3 s/km); pink `noise` $\rightarrow$ `lowpass` (`1400 Hz` if `< 2 km`, else `380 Hz`) $\rightarrow$ `master`; peak gain $\min(1.4, 2.2 / (0.6 + \text{distanceKm}))$.
- **Unimplemented / Absent Flight Audio Note**:
  - `JetAudio.ts` does **not** implement a distinct Mach-1 sonic boom transient or dedicated flap/gear/cockpit-switch mechanical click samples (`canopy.mp3` is a continuous airframe rumble loop, and `gearDown` / `airbrake` drive the `dragBuffet` rumble and `touchdownImpulse` triggers `creak()`).

#### 3.4 Pilot Physiology & Cockpit Warnings
- **Mask Breathing & Radio Breath-Hold (`updatePilot`, `speak`)**:
  - Active only when `s.inside` is `true`; when `RadioChain` transmits (`speak()`), sets `radioUntil` and immediately fades `breathGain` to `0` (`0.12` s time constant) so the pilot holds their breath while listening.
  - Calm/deep cycle (every `~4.3 + 0.8*up - 0.9*busy` s, randomized $\pm 10\%$): selects `breath_deep_1..5` when `busy > 0.55` or within 12 s after G-strain (`strainEnd`), else `breath_calm_1..10`, avoiding back-to-back repeats (`take()`), with `playbackRate = 0.94..1.06` and gain `0.45 * (level / 0.32) * (0.85..1.15)` into `maskRec`.
  - Procedural fallback (`maskBreath()` + `valveTick()`): Demand-regulator inhale (`1800 -> 2600 Hz` BPF + `3100–3400 Hz` `Q=14` whistle + `3800 Hz` valve tick) and exhale (`900 -> 560 Hz` BPF modulated by `26–34 Hz` valve flutter LFO + `1600 Hz` closing click).
- **Anti-G Straining Manoeuvre (AGSM)**:
  - Enters `straining` above **4.2 g**, exits below **3.5 g** (playing a deep exhale on release).
  - Every `2.9 - 0.4 * strain + 0..0.25` s, plays a random `strain_1..4` take (`gain = 0.7 * (0.75 + 0.35 * strain)`, `rate = 0.96..1.04` into `maskRec`) followed at `0.95 * gruntLen` by a snatched `breath(t, 'in', ...)` (or procedural `breath('out')` + `breath('in')` fallback).
- **G-Suit Inflation & Venting**:
  - `suitLevel` tracks `clamp((g - 1.8) / 6, 0, 1)` (inflate rate `2.5/s`, deflate rate `1.2/s`); hose hiss (`1500 Hz` BPF) scales with `suitLevel` flow rate.
  - Valve bang `gsuit_in.mp3` (`SUIT_GAIN = 0.8`) triggers when `g > 2.1` while inflating (`1.5` s cooldown); `gsuit_out.mp3` (`0.56` gain) vents when `suitLevel < 0.03 && g < 1.6`.
- **High-G Heartbeat (`beat`)**:
  - Activates above **6.5 g** (`heart = clamp((g - 6.5) / 2.5, 0, 1)`), tempo `105 + 25 * heart` BPM (**105–130 BPM**).
  - Synthesizes lub-dub pair (`0` s: `62 -> 42 Hz`, gain `0.75 * heart`; `+0.27` s: `74 -> 50 Hz`, gain `0.45 * heart`) through `160 Hz` lowpass into `pilotBus`.
- **Two-Tone Warning & Bitching Betty (`warn`, `updateBetty`)**:
  - `warn`: Square oscillator $\rightarrow$ `2400 Hz` LPF $\rightarrow$ `master`; pulses `1050 Hz` at **3 Hz** (`floor(timeSec * 6) % 2 === 0`) for terrain (`warning === 1`), or `620 Hz` at **1.5 Hz** (`floor(timeSec * 3) % 2 === 0`) for heat (`warning === 2`), attenuated to `0.035` gain when `betty_pullup` is loaded (else `0.06`).
  - `updateBetty()`: `0.15` s initial delay on warning onset; plays `betty_overheat` (`warning === 2`, `2.5` s repeat gap), `betty_altitude` (`warning === 1` for first `2.5` s), or `betty_pullup` (`warning === 1` after `2.5` s, `0.6` s repeat gap).

#### 3.5 Exact `public/audio/jet/` Asset Inventory
- **Total Files**: **28** `.mp3` files (`27` listed in `JET_RECORDINGS` + `engine_start.mp3` fetched directly by `playStart()`):
  - **Engine & Airframe (4)**: `engine_start.mp3` (`261,045` B), `engine_idle.mp3` (`202,653` B), `engine_high.mp3` (`313,245` B), `canopy.mp3` (`280,845` B).
  - **Betty Voice Warnings (3)**: `betty_altitude.mp3` (`15,069` B), `betty_pullup.mp3` (`17,949` B), `betty_overheat.mp3` (`12,333` B).
  - **G-Suit Valves (2)**: `gsuit_in.mp3` (`12,429` B), `gsuit_out.mp3` (`19,053` B).
  - **Pilot Breaths & AGSM Strains (19)**: `breath_calm_1.mp3`–`breath_calm_10.mp3` (10), `breath_deep_1.mp3`–`breath_deep_5.mp3` (5), `strain_1.mp3`–`strain_4.mp3` (4).

---

### 4. Adaptive Soundtrack (`src/audio/music.ts`)

#### 4.1 Complete 10-Track Catalogue & `public/music/` Inventory
- Every track in `TRACKS` has a matching `<slug>.mp3` and cover artwork `<slug>.jpg` in `public/music/` (20 files total):
  - **`00` — Helios Overture** (`00-helios-overture`, world: `Sun`) | Mood: *"A dying sun adrift in deep space"* | `1,066,675` B `.mp3`, `48,057` B `.jpg`.
  - **`01` — Quicksilver Clockwork** (`01-quicksilver-clockwork`, world: `Mercury`) | Mood: *"Mechanical moons slowing down"* | `588,112` B `.mp3`, `54,615` B `.jpg`.
  - **`02` — Veil of Sulphur** (`02-veil-of-sulphur`, world: `Venus`) | Mood: *"Amber haze & quiet echoes"* | `1,023,208` B `.mp3`, `44,876` B `.jpg`.
  - **`03` — Pale Blue Lullaby** (`03-pale-blue-lullaby`, world: `Earth`) | Mood: *"Gentle waves under a frozen sky"* | `922,062` B `.mp3`, `41,321` B `.jpg`.
  - **`04` — Red Dust Drums** (`04-red-dust-drums`, world: `Mars`) | Mood: *"Distant pulses in the rust storm"* | `744,847` B `.mp3`, `40,682` B `.jpg`.
  - **`05` — Cathedral of Storms** (`05-cathedral-of-storms`, world: `Jupiter`) | Mood: *"Violet twilight across the nave"* | `872,742` B `.mp3`, `42,649` B `.jpg`.
  - **`06` — Orbit of Glass Rings** (`06-orbit-of-glass-rings`, world: `Saturn`) | Mood: *"Floating shards in motionless orbit"* | `1,034,075` B `.mp3`, `39,154` B `.jpg`.
  - **`07` — Frozen Tilt** (`07-frozen-tilt`, world: `Uranus`) | Mood: *"Crystalline calm in eternal winter"* | `968,873` B `.mp3`, `56,345` B `.jpg`.
  - **`08` — Deep Blue Echoes** (`08-deep-blue-echoes`, world: `Neptune`) | Mood: *"Submerged transmissions from the abyss"* | `1,080,886` B `.mp3`, `46,802` B `.jpg`.
  - **`09` — Event Horizon Silence** (`09-event-horizon-silence`, world: `Sagittarius A*`) | Mood: *"Eternal stillness at the edge of time"* | `1,356,739` B `.mp3`, `36,272` B `.jpg`.

#### 4.2 World-to-Track Mapping (`trackFor(body)`)
- **Resolution Order**:
  1. **Direct match**: Returns index `0`–`9` if `TRACKS[i].world === body`.
  2. **Catalogue lookup**: Calls `CatalogueManager.getBody(body)`; returns `0` (`Helios Overture`) if unknown (e.g., `'Nowhere at all'`).
  3. **Black Hole**: `def.category === 'black_hole'` $\rightarrow$ track `9` (`Event Horizon Silence`).
  4. **Moons / Satellites**: If `def.parentName` is present, resolves `TRACKS` for `parentName` (or recursively `trackFor(p.name)`) — e.g., `Moon` $\rightarrow$ `Earth` (`03`), `Europa` $\rightarrow$ `Jupiter` (`05`), `Titan` $\rightarrow$ `Saturn` (`06`), `Charon` $\rightarrow$ `Pluto` $\rightarrow$ `Neptune` (`08`).
  5. **Dwarf Planets & Small Bodies**: Finds the orbital zone minimizing $|\ln(\max(a, 0.05) / \text{au})|$ against:
     - `[0.39, 1]` (Mercury), `[0.72, 2]` (Venus), `[1.0, 3]` (Earth), `[1.52, 4]` (Mars), `[2.9, 4]` (Main Asteroid Belt $\rightarrow$ Mars), `[5.2, 5]` (Jupiter), `[9.5, 6]` (Saturn), `[19.2, 7]` (Uranus), `[30, 8]` (Neptune — so outer bodies like `Pluto` at ~39.5 AU and `Charon` map to track `08`).

#### 4.3 Dual-Deck Crossfade Engine, Ducking, Rest Intervals & Modes
- **Web Audio Dual-Deck Graph & Persistence**:
  - Shares `audioCtx()` with VELA (`src/companion/voice.ts`).
  - Creates two `Deck` objects (`HTMLAudioElement` $\rightarrow$ `MediaElementAudioSourceNode` $\rightarrow$ per-deck `GainNode`) summed into `this.bus` (`GainNode` $\rightarrow$ `ctx.destination`). Falls back to `deck.el.volume` if Web Audio is unavailable.
  - Default volume: `DEFAULT_VOLUME = 0.32`; persists `{ volume, muted }` in `localStorage['solaris.music']`.
  - **VELA Ducking**: Subscribes to `voice.listeners`; computes `level = muted ? 0 : volume * (voice.speaking ? 0.38 : 1)` (`DUCK = 0.38`), applied to `bus.gain` via `setTargetAtTime(level, ctx.currentTime, Math.max(0.01, seconds / 3))` (0.5 s transition on voice change; 0.15 s on `setVolume`; 0.4 s on `setMuted`; 0.3 s on `cue`).
- **Dual-Deck Crossfade Timings (`cue(track, seconds)`)**:
  - Alternates `this.live = 1 - this.live` between deck 0 and deck 1.
  - Incoming deck linearly ramps `0 -> 1` over `seconds` (or `1.2` s if the previous deck is paused/uninitialized).
  - Outgoing deck (if playing) fades out *faster* than incoming fades in: `out = Math.min(seconds, seconds * 0.6 + 0.2)` s, then pauses after `out * 1000 + 150` ms.
  - Crossfade durations by caller:
    - World arrival / `goTo()` / `follow(true)` / `start()`: **`FADE = 1.8` s** (`out = 1.28` s).
    - Track end in Album mode: **`ALBUM_FADE = 4.0` s** (`out = 2.6` s).
    - Manual `pick(track)` / `next(dir)`: **2.2 s** (`out = 1.52` s).
    - Resume via `toggle()`: **1.5 s**.
    - Follow-mode restart after rest silence: **2.5 s**.
    - `pause()`: fades current deck to `0` over **0.8 s**, then calls `deck.el.pause()` at **900 ms**.
- **Follow-World Mode vs. Album Mode**:
  - **Follow-World Mode (`follow: true`, default)**:
    - `goTo(body)` updates `wanted = trackFor(body)` and immediately crossfades (`1.8` s) if playing and `wanted !== state.track`.
    - **Rest Intervals**: Tracks do *not* loop immediately; `onEnded` schedules a silent breath of `9000 + Math.random() * 9000` ms (**9–18 seconds**) via `restTimer` before re-cueing the same world's track (`2.5` s fade-in).
  - **Album Mode (`follow: false`)**:
    - Entered via `pick(track)` or `next(dir)` (`dir: 1 | -1`).
    - `onTime` monitors `duration - currentTime < 4.0` (`ALBUM_FADE`) and crossfades continuously into `(state.track + 1) % 10` (`4.0` s fade) with no silent gap, guarded by `this.looping` for `ALBUM_FADE * 1000 + 500` ms.
    - **Automatic Return to Follow**: Navigating to a *different* world (`lastBody !== null && lastBody !== body`) in `goTo(body)` automatically flips `follow` back to `true` and resumes world-driven music.

---

## Part VIII: Observatory UI/HUD, CameraRig, Interactive Book, Technical Report, Launch Video & Test Suite

---

### 1. CameraRig & Observatory Navigation (`src/navigation/CameraRig.ts`, `src/dev/flightHarness.ts`)

- **Core 4-Point Cinematic Observer Model (`CameraRig`)**
  - Tracks four coupled spatial anchors in render space: `subjectAnchor` (current target center), `orbitPivot` (damped effective orbit center), `aimPoint` (screen-offset optical look target), and `currentNdcOffset` / `targetNdcOffset` (Normalized Device Coordinates framing shift).
  - Supports four `CameraShotMode` modes: `'cinematic_observation'`, `'free_inspection'`, `'deep_space_overview'`, and `'scientific_overview'`, toggled via `toggleFramingOffset()` (or `O` hotkey in `FlightHUD`) and reset via `resetToOverview()`.
  - Maintains `spherical` and `targetSpherical` spherical coordinates (`radius`, `theta`, `phi`) with frame-rate-independent exponential damping (`frameDamping = 1 - (1 - 0.12)^(dt * 60)`) and polar clamp `[0.02, Math.PI - 0.02]`.
  - Exposes `suspended` mode and `syncFromCamera()` so external camera controllers (`SurfaceObserver` / `HorizonView` / jet flight) can assume direct camera control and cleanly return control without position snaps.

- **Body Framing Profiles & Apparent Angular Sizing**
  - Defines `BODY_FRAMING_PROFILES` (covering `Sun`, `Mercury`–`Pluto`, and `'Sagittarius A*'`), alongside `DEFAULT_PLANET_FRAMING` and `DEFAULT_MOON_FRAMING`, specifying per-body `targetCoverageY`, `ndcOffsetX` (left-third composition `-0.28` to `-0.38`, `Sagittarius A*` right-third `+0.42`), `ndcOffsetY`, `fov` (`28°`–`42°`), `effectiveRadiusMultiplier` (e.g., `1.95` on Saturn for ring clearance), and `preferredElevation`.
  - `calculateViewingDistance(visualRadius, profile, fovDegrees)` computes ideal camera radius from angular height coverage and FOV.
  - Exports apparent-size scaling helpers: `OBSERVATION_FOV_DEG = 55.0`, `REFERENCE_ALTITUDE_EARTH_RADII = 1.0`, `EARTH_RADIUS_KM = 6371.0`, `MAX_OBSERVATION_RATIO = 1 / Math.sin((22 * Math.PI) / 180)`, `observationDistanceRatio(physicalRadiusKm, minRatio = 1.25)` computing `1 + R_E_alt * (6371 / R)^0.094` clamped to `[minRatio, MAX_OBSERVATION_RATIO]`, and `angularRadiusDeg(distanceRatio)`.
  - `getResponsiveNdcOffset()` scales horizontal/vertical NDC offset dynamically by viewport aspect ratio: preserves full offset on wide screens (`>= 1.5`), scales on square/4:3 displays (`>= 1.0`), and adapts on mobile portrait (`< 1.0`: `x * 0.15`, `y = -0.10`).
  - `calculateAimPoint()` offsets the look-at point inside the camera's right/up basis plane so the target projects to the requested screen NDC coordinates while keeping centered shots (`ndcOffset = (0, 0)`) locked directly onto the pivot.

- **Logarithmic Eased Orbital Flights & Sunlit Vantage Selection**
  - `CameraTransition` interpolates flights using quintic smootherstep `ease = p^3 * (p * (6p - 15) + 10)` and mid-flight arc `flight = Math.sin(Math.PI * ease)`.
  - Log-space distance arc: interpolates radius as `Math.exp(lerp(Math.log(r0), Math.log(r1), ease) + arc * flight)` where `arc = Math.min(9.5, Math.log1p(travel / Math.max(r0, r1)) * 0.82)`, avoiding ground clipping or linear zoom distortion across orders of magnitude.
  - Dynamic optical polish during transitions: FOV breathes outward by `+ 9.0 * flight * Math.min(1, arc / 1.6)`, azimuth takes the shortest wrap via `Math.atan2(sin, cos)`, and gentle camera roll banks into turns (`sign(dTheta) * Math.min(0.11, |dTheta| * 0.045) * flight`).
  - `flightDuration` scales logarithmically (`log10`) with spatial travel and zoom span, clamped to `[Math.max(baseMs, 1800 + ...), 9000]` ms (dropping to `150 ms` under `prefers-reduced-motion`).
  - `chooseObservationVantage(toSun, ndcOffsetX)` evaluates 24 azimuth candidates around `toSun` at a fixed `55°` solar phase angle using `CoordinateFrames.galacticBasisThree()` (`ngp`, `gc`), scoring candidates to maximize Milky Way band alignment on the open side of the frame (`openSide`) plus Galactic Centre visibility minus elevation penalties.

- **Multiscale Handoff, Dynamic Clipping & Sagittarius A\* Alignment**
  - `HANDOFF_FRACTION = 0.22` (`handoffDistance() = Math.max(400, distFromSun * 0.22)`) smoothly blends `effectiveAnchor` toward `(0, 0, 0)` across `[h0, 4 * h0]` during deep-space pull-backs (disabled for `Sagittarius A*` and `nebula_stage*`).
  - `jumpToScale(domain)` transitions directly across `'planetary'`, `'inner_system'`, `'outer_system'`, `'interstellar'`, and `'galactic'` domains (tilting galactic view `35°` off the north galactic pole toward the anti-centre).
  - `getObserverScaleMetric()` formats telemetry units automatically across tiers: `r_s (KM)`, `ALT KM`, `AU`, `LY`, and `KPC`.
  - Dynamic depth buffer bounds prevent z-fighting across 9+ orders of magnitude: `near = Math.max(focusedObject ? 1e-5 : 0.04, Math.min(30 * farScale(), clearance * 0.08))` and `far = farPlane(r) = Math.max(30000 * COSMIC_SCALE, pos.length() * 2.5, viewRadius * 35)`.
  - `Sagittarius A*` special handling: applies `BLACK_HOLE_ROLL = -0.2` rad Dutch angle, aligns `updateUpVector` to the black hole's local disk axis (`~7°` elevation, `localDir (0.30, 0.125, 0.95)`), enforces `minimumDistance() = 65.0`, and triggers slow push-in idle drift (`r * (1 - 0.00005)`) rather than horizontal orbit.

- **Web-Map Surface Interaction, Free-Look & Dev Harness**
  - `altitudeInRadii` drives `compositionWeight = smoothstep(alt, 0.25, 1.2)`, fading off-center NDC offset down to centered inspection near planetary surfaces.
  - `beginGrab`, `grabSurface`, `steerTargetTo`, and `pickGlobe` lock the grabbed surface latitude/longitude directly beneath the pointer when `alt < 3`; `zoomTowardCursor` (`alt < 4`) preserves the cursor's surface point during logarithmic wheel zoom; `applyFrameRotation(q)` co-rotates the camera with the spinning globe.
  - Free-look input: right-mouse drag (`isLooking`) and Arrow keys (`LOOK_KEY_RATE = 0.9` rad/s, `MAX_LOOK_PITCH = degToRad(80)`), reset via double-click (`resetLook`), plus 1-finger orbit / 2-finger pinch-zoom on touch screens, and subtle idle orbital drift (`+0.00008` rad/frame `theta`) after 3 s of inactivity (disabled below 4 radii altitude).
  - `src/dev/flightHarness.ts` exposes browser-console dev commands over `window.__solaris`: `goto(lat, lon, altKm, hdgDeg, pitchDeg, speedKmS)`, `pin(...)` (30 ms hold interval), `stats()` (tile queue stats + `perf.frameMs`), `start(utcMs)`, `setTime(utcMs)`, and `wallShare(lat, lon, groundKm)` (analyzes steep photogrammetry wall triangles > ~70° pitch within 600 m on Google 3D Tiles).

---

### 2. Observatory UI & HUD (`src/ui/*`)

- **Preloader, Brand Logo & Core UI Utilities (`src/ui/`)**
  - `Preloader.tsx`: Renders an interactive SVG Solar System orrery (`PLANETS` Mercury–Neptune with J2000 `L0`, period `T`, and log-compressed `AU` radii orbiting at `~115 simDays/s`), offers initial audio choice ("Begin with Vela's voice" / "Begin in silence" persisted in `solaris.voice`), and sequences `'loading' -> 'collapse' -> 'iris' -> 'gone'` using `onBegin`, `onReveal` (pre-mounting the HUD beneath the opaque curtain), and `onFinished` via a 1500 ms (`350 ms` reduced motion) `easeInOutCubic` frame-by-frame CSS radial-gradient `maskImage` iris wipe (with a 1200 ms safety fallback).
  - `src/ui/brand/logo.ts` & `SolarisLogo.tsx`: Defines shared geometric mark constants (`INK = '#dcab76'`, `NIGHT = '#0e0e0f'`, `OUTER`, `INNER`, `SUN`, 8-pointed `STAR`, `WORLD_OUT`, `WORLD_IN`, `GAP = 2.4`), vector builders (`orbitPath`, `starPoints`, `drawMark`), CSS-animated `<SolarisLogo />` (`sol-logo-orbit`, `sol-logo-sun`, `sol-logo-star`, `sol-logo-glow`), and `startAnimatedFavicon()` rendering live orbiting frames into a 64×64 canvas at 8 fps (125 ms interval, `willReadFrequently: true`) mapped to `<link rel="icon" data-live>`.
  - `settings.ts`: Persists `Settings` (`velaVolume`, `velaVoice`, `velaChatty`, `chimes`, `nebulae` 0..2, `markers`, `idleMotion`, `calmUi`, `showRecord`, `showVela`, `showMinimap`) under `localStorage` key `'solaris.settings'`, backed by `DEFAULT_SETTINGS`, pub/sub `settings` store, and `useSettings()` React hook.
  - `fullscreen.ts` & `FpsCounter.tsx`: Provides `enterFullscreen()` (with `webkitRequestFullscreen` fallback) and `FpsCounter` writing `{fps} FPS · {worst} MS MAX` directly to the DOM over 500 ms windows (color-coded green `>= 50`, amber `>= 30`, red `< 30`).

- **Master HUD Orchestration & Header (`src/ui/HUD/FlightHUD.tsx`)**
  - Coordinates the full viewport interface around the Three.js canvas with helmet mouse parallax (`--px`, `--py`), toast notifications, and global hotkeys (`Space` pause/play, `H` hide HUD, `/` Atlas, `J` SX-1 jet flight, `P` screenshot capture with shutter flash, `Esc` reset/back, `O` optics/framing toggle, `C` camera/cockpit view, `B`/`L` panel shortcuts).
  - Top bar unites `<SolarisLogo />` + wordmark, live UTC/JD clock, Logbook diamond indicators (`useLogbook`), `ReportBeacon`, `ScaleLadder`, rendering layer switches (Orbits, Constellations, Markers, Real Lighting), `VinylDeck`, Optics popover (`cinematic`/`fisheye`/`clean`, bloom `0..3`), `Fly` SX-1 jet trigger, `AtlasLauncher`, Camera capture button (`P`), Reset (`Esc`), Tour (`?`), Hide HUD (`H`), and Settings button.
  - Left vertical selector switches between `Worlds` (`REFERENCE_NAV_ORDER`, 10 primary bodies) and `Nebulae` (9 objects); at `Sagittarius A*` exposes an `Orbit` / `Horizon` toggle plus relativistic depth telemetry (`r_s`, tidal g/m, clock rate, shadow angle, photon sphere `1.5 r_s`, ISCO `3.0 r_s`).
  - Auto-vanishing **Monograph** card (`6500 ms` / `8100 ms`) renders scrambled `DecodeText` metadata (`SUNWARD_ORDER` index) with a `Read more` 440 px drawer containing Sgr A* relativistic horizons, Physical properties, Keplerian elements, live ephemeris, Missions, and Credits.

- **Navigation, Time & Telemetry Controls (`Controls.tsx`, `Instruments.tsx`, `Voyage.tsx`)**
  - `Controls.tsx`: Houses `Segmented` (animated pill glider), `ScaleLadder` (6 domains: `planetary`, `inner_system`, `outer_system`, `interstellar`, `galactic`, `sgr_a`), `TimeDeck` + `Throttle` speed lever (`1×`, `10×`, `100×`, `d/s`, `mo/s`, `yr/s`), `RollingText` odometer digits, J2000/Now snaps, UTC date picker popover, NASA `Missions` eras popover (`CatalogueManager.getMissionEvents()`), and shared `Popover`.
  - `Instruments.tsx`: Runs `useViewFrame` (high-frequency rAF loop updating DOM refs without React re-renders), `DecodeText`, `TargetLock` (4 corner brackets tracking projected `v.target`, auto-hiding past `0.26 * min(vw, vh)` or 5 s post-transit), `TransitBar`, and `AttitudeScope` (210×120 2D canvas projecting J2000 ecliptic rings, radar sweep, 30° ticks, north axis Z, Sun glyph, mint velocity vector, observer square, and AZ/EL).
  - `Voyage.tsx`: Provides `useTransitState` and `VoyageConsole` (top/bottom letterbox framing, ETA, warp factor `×c`, light-time & Voyager-1 travel time, linear progress rail with orbit-crossing ticks and animated callouts), `ArrivalStamp`, `useLogbook` (`solaris.logbook.v1`, 10 `LOG_WORLDS` tracking visited diamonds and cumulative AU flown while excluding interstellar jumps `>= 0.05 ly`), and `SystemPlot` (268×236 Milky Way canvas backed by `milky_way_disk.webp`, tilting from `58°` to face-on on hover to reveal 6 `ARMS`, Sgr A* + Sun `R0_KPC = 8.277` beacons, and a tethered `×10^9` Solar System glass loupe with log-mapped planet orbits, asteroid belt, live ship triangle, and clickable worlds).

- **Atlas, Dossiers, Gallery & Exploration Progress (`Atlas.tsx`, `CatalogueScreen.tsx`, `Gallery.tsx`, `shots.ts`, `explored.ts`, `moonGroups.ts`)**
  - `Atlas.tsx` & `explored.ts`: `AtlasLauncher` renders a 40×40 astrolabe SVG button with 48 limb ticks, rotating rete, explored arc, glint, `solaris.atlas.opened` ping, and `data-tour="catalogue"`; `ExploredGauge` renders three concentric 72-tick SVG progress rings (planets, moons, minor bodies) driven by `useCountUp` and `exploredStats(visited)` (excluding `'star'`, formatted via `fmtPct`).
  - `CatalogueScreen.tsx`: Fullscreen modal Atlas (`role="dialog"`) with live `ShowcaseControls` 3D reel backdrop and 5 tabs: `worlds`, `all` (searchable 479-body `ALL_CELESTIAL_BODIES` index (including the Sun; `ExploredGauge` in `explored.ts` and `Hero.tsx` exclude the Sun as `478` worlds) filtered by `all|planet|moon|minor` up to 480 rows), `spacecraft` (with mission-group filter), `nebulae` (9 cards), and `gallery`. Includes `ComparisonPropKind` scale props (`scientist 1.8m`, `school_bus 11m`, `rose_bowl 280m`), `scienceOverlaysOn`, `Focus 3D`, `Fly Jet`, `Epoch`, `.dyn`/Surface/Lagrange/Kepler badges, and a nested body dossier with `cat-moonrail` and `ExploredGauge`; `Esc` unwinds moon -> system -> close.
  - `moonGroups.ts`: `systemMoons(body)` categorizes parent satellites into `'Major moons'`, `'Inner moons'` (`< 1.5M km`), or `<Group> family`, sorted by `semiMajorAxisKm`.
  - `Gallery.tsx` & `shots.ts`: Combines curated `POSTCARDS` with user-captured screenshots stored in IndexedDB (`solaris-shots` DB / `shots` store, emitting `SHOTS_CHANGED` and `emitVela('shot', { first })`), presented in a keyboard-navigable lightbox (`ArrowLeft`, `ArrowRight`, `Esc`) supporting "Take me there" scene restoration, JPEG download (`solaris-*.jpg`), and delete.

- **Explorer, Surface Skies, Settings, Music, Tour, Companion & Report Link**
  - `ExplorerPanel.tsx`: Collapsible right-hand altimeter drawer (`data-tour="explorer"`, auto-expands close to surface on screens `>= 640 px`) with 4 `SlateTabs`: `survey` (log altitude tape `10 km..10M km`, "Stand here · look up", debounced 260 ms Earth 3D location search merging `searchLandmarks` + `searchEarthPlaces`, Real sunlight toggle, streaming tile LED, imagery source attribution & honesty tags), `waypoints` (`WP-XX` list), `moons` (grouped via `systemMoons`, searchable when > 12, fly or stand-up `↑`), and `skies` (`SkyDestinations`).
  - `SurfacePanel.tsx` & `SkyDestinations.tsx`: `SurfacePanel` dispatches `SurfaceAction` controls for surface observer mode—displaying lat/lon, compass heading/pitch, Sun alt/az, local-time jumps (`sunrise`, `noon`, `sunset`, `night`), sky magnification (`1`/`10`/`100`/`1000`), FOV zoom readout & reset, atmosphere toggle (`Hide air` / `Show air`), clickable "Above the horizon now" object list, 13 `SKY_DESTINATIONS` (Moon/Earth, Enceladus/Mimas/Iapetus/Pan->Saturn, Europa/Io->Jupiter, Phobos->Mars, Miranda->Uranus, Triton->Neptune, Charon->Pluto, Mars sky, Titan's haze), and optional `DEEP_TIME_SCENES`.
  - `VinylDeck.tsx`: Popover audio player (`data-tour="record"`) with spinning 3D-styled mini vinyl & SVG tonearm, album cover sleeve, seek bar, mute/volume slider, transport controls, "Follow the planets" toggle, 10 `TRACKS` list, and headless `VinylFollower`.
  - `SettingsPanel.tsx`: Esc-closable settings drawer covering Vela (`velaVoice`, `velaVolume`, `velaChatty`, `showVela`), Music (`music.toggle/setVolume/follow`, `chimes`), Worlds & sky (`WORLD_SCALE_KEY` reload prompt, `nebulae` `0..2`, `markers`, dynamic `layers`), Camera & lens (`cinematic`/`fisheye`/`clean`, `bloom` `0..3`, `idleMotion`), Interface (`showRecord`, `showMinimap`, `calmUi`), and Restore defaults.
  - `ReportBeacon.tsx`: Telescope eyepiece link (`${BASE_URL}report/`) featuring a slewing starfield & reticle SVG, `useTicker` cycling all 16 report chapter titles, hover card with `VelaPx` sprite, and radial portal warp (`frep-warp`, 900 ms transition).
  - `Tour.tsx`: 18-step onboarding tour (`STEPS`, `solaris.tour.v1`, `tourVoice`, `TOUR_STEPS`, `tourSeen`) anchoring onto `data-tour` targets (skipping off-screen targets unless `stage: true`), executing live `TourDemos` (`toggleOrbits`, `setTimeRate`, `openOptics`, `showNebulae`, `atlas`, `explorer`), drawing spotlight + SVG connector lines, and supporting `Back`/`Next`/`Skip` plus arrow/Enter/Esc navigation.
  - `Companion.tsx`: Observatory VELA personality & voice UI engine managing `VelaMemory` (`solaris.vela.memory`, `solaris.vela.met`), 15 `EXPLORE_MILESTONES`, 10-beat `FAREWELL` veil at 100% explored, 10 interactive `talk()` conversations, `joke()`, `menu()`, `offerSecret()`, and `poke()` (3 pokes in 8 s triggers giggle), driving rAF `voice.amplitude()` into CSS `--amp` orb/box coupling, `1–4` choice hotkeys, reactions (`onVela` nebulae, music, timelapse, shots, postcards, settings, tour, belt/Kuiper crossings, close-Sun & Sgr A* `rRs`/horizon fright), care reminders (water, eyes, break, late night), idle lines, and dev hook `window.__vela`.

---

### 3. Interactive Storybook (`src/book/`)

- **Routes, Spread Engine & Responsive Navigation (`Book.tsx`)**
  - Standalone route served alongside the observatory; mounts two-face hinged `760 × 1040` (`PW × PH`) `Sheet` pairs inside `Spreads` using GSAP 3.15 + `DrawSVGPlugin` page-arrival animations (`.a-f`, `.a-d`, `.a-g`, `.a-b`, `.a-s`).
  - Virtualized spread window mounts only `±1` adjacent `Sheet`s, with `shift(s)` centering the closed front/back covers.
  - Input channels: `640 px` mouse-wheel page scrub with `0.34` flip threshold and dynamic `.turnshade` shadow (`sin(|deg|) * 0.34`), tablet touch swipe (`> 60 px`), URL hash deep-linking (`#pN`), bottom `Rail` chapter bar, and keyboard navigation (`ArrowRight`/`Space`/`PageDown`, `ArrowLeft`/`PageUp`, `Home`, `End`, `f` fullscreen, `s` Strip view toggle).
  - Viewports `< 860 px` or portrait mobile orientations automatically switch to a reflowed continuous `Strip` scroll layout tracked via `IntersectionObserver`.

- **WebGL Ink Press Shader Engine & Component Kit (`ink.ts`, `kit.tsx`)**
  - `ink.ts`: Runs a single shared WebGL `Press` shader (up to `1400 × 1400`, throttled "on twos" at 12 fps) blitting stylized print frames into per-panel 2D canvases.
  - Supports 3 live `Source` inputs: `video` (shared `book/clips/*.mp4` across gutters), `image`, and `globe` (procedural raycasted sphere with `tilt`, `spin`, and optional `ring`/`'front'` occlusion).
  - Provides 8 procedural halftone/print `Look` shaders (`tone` 4-step screentone, `dots` 45° halftone, `engrave` undulating banknote lines, `hatch` 3-angle crosshatch, `rings`, `rays`, `wood` noise-torn woodblock, `stipple`), 2 spot-ink plates (`ORANGE [0.886, 0.31, 0.122]`, `GREEN [0.145, 0.561, 0.337]`, `Spot = 'orange'|'green'|'both'|'none'`), Sobel-style `edge` outlining, `neg` tonal inversion, and gentle `drift` zoom/pan.
  - `kit.tsx`: Exposes book layout & manga typography primitives (`LiveContext`, `GoContext`, `Ink`, `Clip`, `Grid`, `P` panels with shapes `a|b|c|d|iris` and tones `ink|orange|green|paper`, `Say` speech bubbles, `Cap` captions, `Sfx` manga sound effects, `Band`, `Plate`, `Txt`, `Ref`, `Arrow`, `Roundel`, 3-frame `.fl0..2` flickering `Lines`, re-paletted `Vela` sprite, `Opener`, vertical `Tate`, `Hanko` seal, and `Note`).

- **Live Storybook Plates & Interactive Visualizations (`plates.tsx`, `plates2.tsx`)**
  - `plates.tsx`: `KeplerLive` (real-time Newton–Raphson orbital SVG), `Clocks` (live UTC vs TDB `+69.184 s` + Julian Date), `ElementsPlate`, `AccuracyPlate`, `MoonPlate` (`scale * min(d, 4R) + max(0, d - 4R)`), `FloatPlate` (`Math.fround` precision-grid jitter vs floating camera origin at `4.5e9 km`), `ShellsPlate`, and `SunPlate`.
  - `plates2.tsx`: `TilesPlate`, `StandPlate`, `AirPlate`, `BendPlate`, `VelaPlate` (23×21 px grid), `LineUnits`, `Take` (WebAudio `AudioContext.decodeAudioData` on `voice/vela/joke.2.mp3` drawing a 150-bar waveform with peak dBFS), `ClockPlate`, and `CommitPlate` (driven by `commits.json`).

- **Chapters & Special Interactive Spreads (`pages/index.ts`, `registry.ts`)**
  - `Open.tsx`: Interactive 4-layer pointer-parallax cover with obi strip, reading guide, title page, Metro-line 16-station Contents spread, and Prologue ("Midnight `01:38`", Vela waking up, the Mars question, and the light-delay thesis).
  - `ActOne.tsx`: Chapters `01–03` (Ephemerides, Scale & Precision, Hipparcos/Gaia Sky) plus the "Old Light" interlude.
  - `ActTwo.tsx`: Chapters `04–08` (Sun shader, Surface tiles, Standing on other worlds, 7-band Nebulae, Sagittarius A*) anchored by a full-bleed 2-page `HoleL`/`HoleR` Sgr A* spread.
  - `ActThree.tsx`: Chapters `09–14` covering Vela's 572 recorded lines and Chatterbox/LUFS pipeline, the 10-track soundtrack, Observatory HUD, the launch film virtual clock, 14 confessed bugs, the "Wrong First" interlude, and the 5-day commit log. (Note: historical copy in `ActThree.tsx`/`Back.tsx` reflects the original 46-commit / 142-test release snapshot.)
  - `Back.tsx`: 8-planet Catalogue of Worlds, Chapter `15` (8 Crossref papers + 30 `REFS` + 9 licence groups), Chapter `16` (8 "What isn't real" honesty disclosures), `TERMS` glossary, and Colophon.
  - `End.tsx` & `BackCover.tsx`: 5-panel shrinking `Goodbye`, Vela's `Letter`, `Since` (live photon distance counter advancing toward Neptune from the moment the spread opens), `Ending` sun-masked `"LEFT"`, `Mark` (live `KeplerSolver` animation spelling `ANISHJHA` across the 8 planets), and an interactive 51-line Fraunhofer + telluric O₂ solar absorption barcode scanner on `BackCover.tsx`.

---

### 4. Interactive Technical Report (`src/report/`)

- **Report Shell, Live Sky & Scroll Hero (`Report.tsx`, `main.tsx`, `Hero.tsx`, `ScrollHero.tsx`, `SkyBackground.tsx`, `kit.tsx`)**
  - `main.tsx` initializes `startAnimatedFavicon()` and exposes `window.__gsap` in dev mode; `Report.tsx` binds `ScrollSmoother` (`smooth: 1.15`, `0` under reduced motion), per-chapter `ScrollTrigger` active states in the sliding left `<Toc />`, and `<LightClock />` (fixed reading-progress photon clock spanning `Mercury 193 s` through `Pluto 19703 s` on a log scale, triggering `vela.cheer()` at `99.5%` scroll completion).
  - `ScrollHero.tsx`: Pinned `<canvas>` scrubbing 300 real captured WebP frames (`report/hero/f000..f299.webp`) from Earth's night side to a north-galactic face-on Milky Way (loading every 10th keyframe first before streaming remaining frames nearest the current scroll position), paired with `<LiveMark />` (`DrawSVGPlugin`), `SplitText` title entrance, 8 timed captions (`STAGES`), and 6 Vela commentary triggers (`VELA_AT`).
  - `Hero.tsx`: `Abstract` section with GSAP entrance and an 8-card `STATS` grid (`Commits` 6-hour sparkline from `commits.json`, `CodeBar` LoC breakdown totaling 25,919 TypeScript lines, `142` passing-test ticks from the original release report, `LicenceDots` across 30 `REFS`, `StarDots`, `WorldDots` across 478 worlds, `Wave`, and 9 `Nebs` thumbnails).
  - `SkyBackground.tsx`: Fullscreen WebGL Three.js celestial telescope behind the report reading `report/sky.webp` (Gaia all-sky projected pixel-for-pixel via ICRS-to-galactic matrix `GAL`), 3 enlarged real nebula planes (`cosmic-cliffs.webp`, `mystic-mountain.webp`, `helix.webp`), and `data/stars.json` Hipparcos stars `< 6.8` mag colored by `bv()`. Smoothly slews (`2.6 s` quaternion slerp) to each chapter's assigned `SKY_TARGETS` (including live ephemeris targets for the Sun, Moon, and Saturn via `KeplerSolver` + `CatalogueManager`), dims during prose reading, and updates `.sky-hud` RA/Dec coordinates.
  - `kit.tsx`: Provides `<Chapter />` (`SplitText` title reveal + scroll-triggered costume/intro hook), `<Fig />` (figure plate with `"Ask Vela"` trigger), `<Num />` (`ScrambleTextPlugin` numeric counter), `<VelaNote />`, `<Loop />` (`IntersectionObserver`-lazy launch film clips), `<T k="...">` glossary terms, and `<Cite n={...} />` citation links.

- **All Six Chapter Modules Covering Chapters 01–16 (`src/report/chapters/`)**
  - `Orbits.tsx` (**§01 Ephemerides**): Explains JPL planetary/satellite/SBDB ephemerides, `<Orrery />` (Fig 1), `<KeplerFig />` (Fig 2), ticking `Clocks` (UTC, TDB, Julian Date, J2000 TDB days), and `Accuracy` log-scale error strip matching `ephemerisAccuracy.test.ts` (Fig 3).
  - `Scale.tsx` (**§02 Scale & Precision**): Documents `30×` default world scale (`1×`–`60×` in settings, Sun capped at `8×`), the `moonDistanceKm()` push-out formula, `<ScaleFig />` (Fig 4), GPU float32 grid snapping vs floating camera origin, and `<PrecisionFig />` (Fig 5).
  - `Sky.tsx` (**§03 Stars & Galaxy**): Covers the 12,596 Hipparcos stars (to `V 4.6` + `120 pc` volume), 3 Gaia depth shells, 140,000 galactic disk particles, `<StarMap />` (Fig 6), and GRAVITY / EHT / Bennett & Bovy / LMC / SMC galactic constants table (Fig 7).
  - `Worlds.tsx` (**§04–§08**):
    - **§04 The Sun**: Procedural photosphere shader & 14 prominences with `<SunLayers />` (Fig 8).
    - **§05 Surface Imagery**: WMTS/WMS tile streaming below `2.5` radii (`EOX`, `Kaguya`, `MRO CTX`, `MESSENGER`, `Magellan SAR`), CORS verification, `<TilePyramid />` (Fig 9), and source resolution table (Fig 10).
    - **§06 Other Skies**: Surface observer mode, apparent magnitude & phase crescents, Rayleigh/Mie + multiple-scattering twilight glow, `<StandingPoint />` (Fig 11 showing Europa at ~40° Jupiter elevation), and 6 `<Loop />` sky videos (Fig 12).
    - **§07 Nebulae**: Star-subtracted premultiplied-alpha textures for Cosmic Cliffs, Mystic Mountain, and Helix plus 6 procedural nebulae, scroll-animated `<NebulaLayers />` (Fig 13), and live nebula loops (Fig 14).
    - **§08 Sagittarius A\***: Physical EHT/GRAVITY numbers, approximate ray-marched lensing disc, and `<Loop />` clips of Sgr A* + the imagined black-hole shore (Fig 15).
  - `Companion.tsx` (**§09–§11**):
    - **§09 Vela**: Unit chart (`LineChart`, Fig 16) grouping all 572 `vela-lines.json` cues across 16+ categories, 6 playable `<Voices />` MP3 players (Fig 17), and `<Pipeline />` (Fig 18) decoding `joke.2.mp3` in-browser via WebAudio (`dur`, `peak dBFS`, `RMS dBFS`) alongside the 5-stage Chatterbox TTS -> voice conversion -> `-17 LUFS` pipeline.
    - **§10 Soundtrack**: `<Tracks />` (Fig 19) interactive 10-disc previewer (`00-helios-overture` through `09-event-horizon-silence`) starting 18 s in, documenting `-18 LUFS` loudness and automatic ducking under speech.
    - **§11 Interface**: Overview of logbook diamonds, scale ladder, time lever, Atlas, 8 postcards, 18-step tour, and 4 live UI `<Loop />` captures (Fig 20).
  - `Making.tsx` (**§12–§16**):
    - **§12 Launch Film**: `<Clock />` diagram comparing variable render times against `1/30 s` virtual clock stepping (Fig 21) and embedded `film.mp4` (`Light Travel`, 76.6 s) (Fig 22).
    - **§13 What Broke**: 14 flippable `<BugCard />` cards detailing real visual, math, memory, HMR, and timer bugs with fixes.
    - **§14 Build Log**: Interactive `<Timeline />` plotting `commits.json` from 13–17 Oct 2026 in IST (Fig 23).
    - **§15 References**: Category-filterable list (`KINDS`) of all 30 `REFS` entries with licence badges and hover Vela explanations.
    - **§16 Honesty & Colophon**: 8 explicit `"What isn't real"` disclosures (`NOT_REAL`) and the `STACK` summary.

- **Live Interactive Figures (`src/report/figures/`)**
  - `stage.ts`: Shared Three.js texture cache (`MAPS`), `world()`, `saturnRing()` (`1.24 R` to `2.27 R`), procedural corona `sun()`, Fresnel limb `atmosphere()`, and viewport-aware `stage()` helper pausing via `IntersectionObserver` + `ResizeObserver`.
  - `Globe.tsx`: Reusable SVG `<Globe />` using dual-wrapping equirectangular maps animated smoothly via SVG `<animateTransform>`, plus `globeSprite()` offscreen canvas disc shading.
  - `Orrery.tsx`: Live Three.js 8-planet orrery solving `KeplerSolver.propagate()` per frame on a compressed log distance axis `rU(au)`, tilted by `ScrollTrigger`, scrubbing from 1800–2050 with planet hover telemetry.
  - `KeplerFig.tsx`: Live interactive SVG solving `M = E - e·sin(E)` via Solaris's Newton–Raphson starter (`e` slider `0..0.95`), displaying each iteration's residual bar to `1e-12`, swept Kepler's-2nd-law sector, vis-viva speed, and interactive hover hotspots.
  - `ScaleFig.tsx`: Orthographic Three.js Earth–Moon stage driven by scroll or slider (`1×` to `30×`) demonstrating `moonDistance(s)` and pixel-width rulers.
  - `PrecisionFig.tsx`: Split 2D canvas comparing `Math.fround` grid quantization jitter at `4.5e9 km` from the Sun vs smooth camera-relative floating-origin coordinates, reporting exact ULP step spacing in km.
  - `StarMap.tsx`: `2000 × 1000` galactic-coordinate canvas compositing `gaia_sky.webp`, all 12,596 Hipparcos stars (B−V tinted), and `CONSTELLATION_EDGES`, with hover lookup of star names, HIP IDs, magnitudes, and distances.
  - `SunLayers.tsx`: Scroll-sequenced breakdown of the 6 procedural Sun shader passes paired with `sun.mp4`.
  - `TilePyramid.tsx`: Interactive 5-level `24 px..384 px` cropped Earth map (`2k_earth_daymap.jpg`) demonstrating coarse-to-fine distance-sorted tile queuing, max 6 concurrent requests, request cancellation, parent fallback, and cursor-steered refinement.
  - `NebulaLayers.tsx`: Scroll-scrubbed 3D CSS `rotateY`/`rotateX` + `translateZ` stack exploding `neb-band-0..6.webp` into 7 brightness bands (`faintest haze` to `hottest cores`).

- **Vela Sprite Bus, Glossary & Citations (`src/report/vela/*`, `terms.ts`, `refs.ts`, `commits.json`)**
  - `vela/bus.ts`: Event emitter (`say`, `costume`, `hush`, `cheer`, `on`) managing speech priority (`1` section intros, `2` hovers, `3` clicks).
  - `vela/sprite.ts`: Deterministic `23 × 21` pixel-art composer generating `Px[]` grids across 8 eye states, 6 mouth shapes, 6 arm poses (`down`, `wave1`, `wave2`, `point`, `up`, `hold`), directional `gaze`, blush/sweat/star twinkle, and 5 costumes (`shades`, `glasses`, `headphones`, `hardhat`, `scarf`).
  - `vela/Mascot.tsx`: Interactive GSAP `Draggable` + `InertiaPlugin` companion with idle cursor tracking, 9 moods, timed blinking, particle bursts (`heart`, `spark`, `z`, `star`), spin-on-dblclick, dizziness detection on rapid drag reversal, sleep state after 38 s idle, fast-scroll warning (`> 5200 px/s`), target-tracking side flips, and smart bubble placement.
  - `terms.ts` & `refs.ts`: 45 conversational `TERMS` definitions and 30 structured `REFS` provenance citations across 10 domains (`Orbits`, `Rotation`, `Sky`, `Imagery`, `Textures`, `Galaxy`, `Nebulae`, `Voice`, `Music`, `Places`).

---

### 5. Remotion Launch Video & Capture Pipeline (`launch-video/`)

- **Remotion Compositions (`launch-video/remotion/`)**
  - `Root.tsx` & `theme.ts`: Registers three `1920 × 1080`, `30 fps` compositions (`Launch`, `LaunchCinematic`, `Flight`) anchored to `Montserrat`, `Instrument Serif`, `JetBrains Mono`, and `Rajdhani` fonts plus beat-grid helpers (`BEAT = 0.6275 s`, `BAR = 4 * BEAT`, `DOWNBEAT = 16.37 s`, `SKY_SHIFT = 9.938 s` for *Helios Overture* at `95.7 BPM`).
  - `Launch.tsx` & `STORYBOARD.md`: The primary `"Light Travel"` launch film (`DURATION = 66.6 + SKY_SHIFT = 76.538 s`), following a photon from a cold-open point of light (`Photon`) across the Sun (`Scrim`), the drawing `<Mark />` + `<Wordmark />`, warp jump, 12 beat-synced outer-system cuts (`Mercury` -> `Pluto & Charon` with `<LightClock />` counting light-time from `00:03:13` to `05:28:23`), `<Skies />` surface views, UI `<Screen />` showcase cards (`ui_overview`, `ui_explorer`, `ui_vela`, `ui_vinyl`, `ui_atlas`) paired with `<Callout />`s, nebulae, Milky Way pull-back, `Sagittarius A*` (`DeepTime` spinning to `27,000 YEARS`), imagined black-hole sea, and final lockup—scored with 7 Vela voice cues (`audio/vela-film.json` + lines) and music ducking (`0.45`).
  - `LaunchCinematic.tsx`: Alternate `68.0 s` cut (`CINEMATIC_DURATION`) replacing the HUD/nebula/Skies middle acts with Act 3 Interplanetary Jet (`jet_olympus`, `jet_saturn`, `jet_io`) and Act 4 Deep Time Future Eras (`dt_red_giant`, `dt_andromeda`, `dt_collision` with `DeepTimeCounter` reaching `+4.00 BILLION YEARS`).
  - `Flight.tsx` & `STORYBOARD-FLIGHT.md`: The `54.4 s` (`FLIGHT_DURATION`) `"SOLARIS 2.0 — Now you can fly it"` trailer cut on the half-bars (`HALF = 1.5324 s`, `T0 = 0.197 s`) of *Cathedral of Storms* (`156.6 BPM` / `0.766 s` half-time beat), featuring the kinetic paper `Hook` (`"seen"` backspaced to orange `"flown"` chip), `Ignition` cockpit start, 10 fast Google 3D Tiles Earth landmark cuts with `<TacCard />` DMS decoders, 4-panel camera switcher (`CHASE`, `COCKPIT`, `GOPRO`, `FLY-BY`), live HUD callout diagram (`Hud`), climb past `150+` NASA spacecraft (`ISS`, `Hubble`, `JWST`, `Voyager 1`), Saturn/Mars/Io jet cuts, 9-card fanned `Postcards`, `Lockup`, and ducked music under processed UHF radio calls.
  - Shared Remotion motion modules: `Logo.tsx` (spring-drawn SVG orbits/worlds/star flare), `LightClock.tsx` (log-scale Sun-to-Pluto photon rail + rolling clock), `Skies.tsx` (4 tracked surface-sky plates loading JSON frame screen tracks `sky_*.json` to lock rotating SVG reticles, compass heading tape, and rec stamp), `Type.tsx` (`Rise`, `Callout`, `Caption`), `fx.tsx` (`Shot` with beat punch & push, `Screen` 3D perspective zoom-through card, fractal SVG `Grain`, `Vignette`, `LightLeak`, `Glint`, `Flash`, `Motes`), and `Sound.tsx` (beat-locked sfx cue placement).

- **Virtual-Clock Capture & Audio Scripts (`launch-video/capture/`)**
  - `rig.mjs`: GPU Chromium Playwright driver injecting `__vclock` to intercept `performance.now`, `Date.now`, `requestAnimationFrame`, Web Animations API (`document.getAnimations()`), and optionally timers (`__vtimers`), while blocking Vite HMR WebSockets. Steps exactly `1000 / 30 ms` per frame via `__vstep(dt)`, captures lossless PNG streams piped directly into `ffmpeg` (`libx264`, `-crf 12`, `yuv420p`), and optionally exports frame-by-frame projected sky object coordinates (`*.track.json`).
  - `shots.mjs`, `era-shots.mjs`, `flight-shots.mjs`, `hero-frames.mjs`: Scripted shot libraries covering planets, postcards, nebulae, showcases, UI panels, Deep Time eras, 3D Earth landmarks (using `src/dev/flightHarness.ts` and `Landmarks.ts` with tile-drain warm-up/settling loops), NASA spacecraft orbits, SX-1 jet cruises, and the 300-frame log-distance report hero pull-back.
  - Book/Report QA & utility scripts: `book-audit.mjs` (scans every spread for DOM text overflow), `book-live.mjs` (verifies wheel scrub thresholds, Strip scroll view, live photon counter, `Mark` alignment, and mobile viewport), `report-shots.mjs` (scroll-captures figure screenshots), plus `beat_scan.py` (NumPy autocorrelation BPM/downbeat detector), `sfx.py` (48 kHz synthesized `riser`, `impact`, `whoosh`, `shimmer`, `tick`), and `flight_mix.py` (ffmpeg UHF bandpass/compression/pink-noise/squelch processing for cockpit radio takes, engine passes, and mask breathing).

---

### 6. Vitest Test Suite Inventory (`src/tests/` — 39 Test Suites)

- **Note**: The current `src/tests/` directory contains **39** `*.test.ts` files (superseding the `23 suites` / `142 tests` figure cited in the historical Oct 2026 book/report release snapshot).

- **Core Ephemeris, Coordinate Frames & Astronomy (`9` suites)**
  - `time.test.ts` (4 tests): J2000.0 (`JD 2451545.0`), Unix epoch (`JD 2440587.5`), UTC-to-JD round-trip, and Julian Centuries `T` at J2000/J2100.
  - `coordinates.test.ts` (3 tests): Isometry and exact round-trip transforms across Ecliptic <-> ICRF and Ecliptic <-> Three.js space.
  - `astronomy.test.ts` (4 tests): Sun + 8 major planets dataset completeness, monotonic semi-major axes, physical constants, and Kepler's 3rd law period consistency.
  - `kepler.test.ts` (4 tests): Newton–Raphson convergence `< 1e-12` from `e = 0` to Pluto, periapsis/apoapsis bounds, and vis-viva velocity bounds.
  - `ephemerisAccuracy.test.ts` (21 generated tests): Compares heliocentric J2000 vectors of all 8 planets at two epochs (`JD 2461327.5`, `JD 2466155.0`) within `0.25°` / `0.5%` distance vs ERFA/VSOP87, plus parent-relative Moon, Io, Callisto, and Titan (including a 26.8-year back-propagation) against JPL Horizons tolerances.
  - `moons.test.ts` (7 tests): Parent-relative orbital periods (Moon, Phobos, Galilean moons, Titan, Triton, barycentric Pluto–Charon) and confirms `GM_SUN` substitution error (`570×`).
  - `orientation.test.ts` (6 tests): IAU body frames, orthonormal right-handedness, Earth sub-solar longitude check (`2026-10-13 20:00 UTC`), Saturn axial alignment, SphereGeometry UV longitude convention, and synchronous moon tidal locking.
  - `skyFrame.test.ts` (4 tests): Polaris pole alignment within `1°`, Regulus ecliptic latitude `< 0.5°`, galactic frame (`gc` at `(266.84°, -5.54°)`, `ngp` at `(180.02°, +29.81°)`), and 3D galactic center offset at `R0`.
  - `sagittariusAStar.test.ts` (10 tests): GRAVITY (`2022`) constants, Schwarzschild `r_s`, photon sphere (`1.5 r_s`), shadow radius (`2.598 r_s`), EHT `51.8 ± 2.3 µas` angular match within 3%, ISCO (`3.0 r_s`, `~0.408 c`), relativistic Doppler factor, gravitational redshift, and catalogue metadata.

- **Catalogue, Scale, Camera & Navigation (`7` suites)**
  - `catalogue.test.ts` (7 tests): Hierarchy of core worlds + moons, parent mapping, valid elements, clean IDs, Triton retrograde inclination, moon push-out ordering, and catalogue search/filtering.
  - `smallBodies.test.ts` (5 tests): Cross-checks `moons.json` and `small-bodies.json` populations (including meteor-shower parents), uniqueness, and orbital/size sanity.
  - `dynamoTrajectory.test.ts` (4 tests): Binary `.dyn` decoder & propagators across New Horizons Pluto handoff (`< 250 km`), Artemis II Cubic Hermite states, Mars 2020 / Deep Impact quaternion attitude tables, and phase/altitude clearance checks.
  - `scale.test.ts` (5 tests): `2.4` Earth units, `RenderSpaceTransform` linear distances, world-scale vs Sun-scale ratios, moon clearance ordering, beyond-Kuiper star/galaxy placement, and unit-sphere scaling invariance.
  - `cameraRig.test.ts` (10 tests): Viewing distance math, Jupiter monumentality, Saturn ring clearance, exact NDC `aimPoint` projection, centered pivot behavior, 16:9 / 4:3 / mobile portrait framing adaptation, strictly positive near/far planes, and framing mode toggle.
  - `infiniteScaleEngine.test.ts` (6 tests): 9-order-of-magnitude distance zoom, scale domain categorization & metric formatting, barycenter anchor handoff, near/far planes, procedural Milky Way bulge/arms/Sun beacon, and velocity travel streaks.
  - `observationCamera.test.ts` (6 tests): Arrival framing height coverage, monotonic apparent angular size ordering, ring clearance ratio, `~55°` sunlit vantage selection, and barrel distortion identity/edge constraints in `LensPipeline`.

- **Rendering, Shaders, Explorer, Postcards, Companion & Audio (`12` suites)**
  - `shaders.test.ts` (5 tests): `SolarShader` photosphere/corona/prominences, `AtmosphereShader` gating, `EarthMaterial`, `PlanetMaterial` flags, and `PlanetFactory` bundles.
  - `textureCache.test.ts` (6 tests): `TexturePipeline` / `TextureGenerator` canonical caching, deduplication, concurrent load coalescing, retry after failure, URL isolation, and fallback behavior.
  - `performance.test.ts` (9 tests): GPU/CPU tier classification (`high`/`medium`/`low`), adaptive DPR down/up stepping, stall filtering, and low-tier feature gating.
  - `cloudSea.test.ts` (3 tests): Deterministic 4-channel 3D Perlin/Worley noise, `VolumetricCloudPass` uniforms, and `EarthClouds` tangent basis & weather preset wiring.
  - `nebulae.test.ts` (2 tests): Ensures all 9 nebulae render upright/unmirrored from the Sun and provide complete visit metadata.
  - `explorer.test.ts` (24 tests): Equirectangular & GIBS tile grids, globe texture coordinate convention, WMS `lon,lat` boxes, LOD visibility/cap refinement, resolution-capped zoom limits, honest imagery labels, landmark coordinate/bearing validation (e.g., Tranquility Base, Mercury east-positive longitudes), and `SurfaceTileLayer` queue concurrency (`6`) / parent fallback / circuit breaking.
  - `planetElevation.test.ts` (6 tests): LERC1 height decoding and smoothing for Moon/Mars/Earth, strict magic-byte validation, landing heights over flat vs relief worlds & Titan haze, downward-look step-back, and polar exclusion.
  - `surfaceSky.test.ts` (5 tests): June solstice Greenwich Sun elevation & `03:43 UTC` sunrise accuracy, Mars sol cycle, apparent magnitudes (`Jupiter ≈ -2.5..-2.9`, `Sun -26.7`), and atmospheric horizon reddening.
  - `postcards.test.ts` (2 tests): Validates every Gallery postcard entry's image/thumbnail paths, target body, and camera framing.
  - `companion.test.ts` (7 tests): Verifies 1:1 audio asset coverage in `public/voice/vela/manifest.json`, case-insensitive filename collision safety, secret-destination validity, world/tour knowledge completeness, clean `[tag]` stripping, and milestone/goodbye line coverage.
  - `music.test.ts` (2 tests): Confirms unique soundtrack assignment per major world and playback switching.
  - `weather.test.ts` (3 tests): Verifies Earth tropical rain vs subtropical desert/polar snow patterns plus Mars dust, Venus acid haze, Titan methane drizzle, and giant-planet turbulence.

- **SX-1 Flight Physics, Maneuvers, Colliders, HUD & Cockpit Audio (`11` suites)**
  - `flight.test.ts` (24 tests): Altitude-scaled drive floor/ceiling, vacuum drive cap, throttle exponential curve & spooling, planetary deceleration safety, Earth–Mars transit timing, flight assist, G-limits/onset rate, cobra speed bleed, boost energy/recharge, dry MIL vs afterburner, atmospheric exponential cutoff, dual-scale surface clearance, and formatted telemetry strings.
  - `aerodynamics.test.ts` (11 tests): Alpha/beta flow angles, C¹ compressible air data (Saint-Venant & Rayleigh Pitot), asymmetric stall & LEX vortex peak, `0..180°` post-stall, sideslip stability, Hoerner ground effect, flaps/slats/gear/speedbrake increments, Mach `0.85..1.35` wave drag bump, 3D force projection with `I_xz` coupling, Boyd E-M metrics, and full 6-DOF integration across `gripen`, `su30`, and `kestrel`.
  - `maneuvers.test.ts` (15 tests): Airframe FBW differentiation, 9G structural limit & gear derate, 1G auto-trim, ARI & sideslip damper, High-G Paddle Drift, Su-30 `32°` canted TVC, exo-atmospheric RCS, closed-loop Pugachev Cobra / abort / 360 Kulbit, maneuver telemetry classifier (12 maneuvers), transonic flap blowback (`> Mach 0.96`), MIL vs AB stages `1..3`, Mach `6/25` critical damping, and landing gear oleo struts / snowplow / drag chute.
  - `hypersonicHandling.test.ts` (4 generated tests): Verifies pitch rate build-up (`< 0.8 s`), `< 12G` load, `> 97%` speed retention, `< 10°` AoA drift, and zero-oscillation stick release damping at Mach 6 (`2000 m/s`) and Mach 25 (`8500 m/s`).
  - `planetaryPhysics.test.ts` (9 tests): US Standard Atmosphere 1976 checkpoints, compressible CAS/IAS/Mach/qbar, Mars/Venus/Titan/giant-planet `AirProfiles`, `GM/r^2` + centrifugal relief + orbital weightlessness, stall speeds & T/W ratios, `AirframeSpecs`, MIL/AB thrust lapse & O₂ gating, and fuel burn / reserve floor.
  - `earthTransit.test.ts` (6 tests): Great-circle Paris–Delhi (`~6,600 km`), `~300,000 km/h` suborbital arc, climb/cruise/descent handover, monotonic unit-sphere progression, and speed-tier limits.
  - `landmarkColliders.test.ts` (6 tests): Spherical coordinate distance and solid terrain/structure elevation colliders (Everest `8,848 m`, Eiffel Tower `330 m + ground`, Burj Khalifa `828 m`, Grand Canyon `2,150 m`, range queries).
  - `hudTelemetry.test.ts` (4 tests): Default `JetTelemetry` state, `TacticalHud`, `HudGlass` (gear E-bracket, Cobra FPM clamp, `headOffset` parallax), and `MfdDisplays` tab/slot switching while enforcing zero `shadowBlur`.
  - `tacticalHud.test.ts` (4 tests): MGRS precision to `1 m` against independent UTM math, polar UPS grid handling, and hemisphere DMS formatting.
  - `padTrigger.test.ts` (3 tests): Gamepad trigger resting deadzone calibration and progressive release hysteresis.
  - `radioDirector.test.ts` (8 tests): `RadioDirector` opening call cooldown, Mach 1 crossing hysteresis, country flyover callouts, immediate terrain pull-up interrupt priority, and complete audio asset presence across `scripts/radio_lines.json`, `public/voice/radio/manifest.json`, and `JetAudio` cockpit SFX.

---

## Part IX: Core Scene Orchestrator, Telemetry, Stylesheets, Tooling & CI

---

### 1. Master Scene Orchestrator (`src/rendering/SolarSystemScene.ts`)

- **Role & Exported Contracts (`2,957` lines)**:
  - Serves as the central runtime orchestrator instantiated by `src/App.tsx`, connecting `SimulationClock`, `RenderSpaceTransform`, `CameraRig`, `PlanetFactory`, `Starfield`, `SmallBodies`, `SpacecraftLayerManager`, `PhotorealEarth`, `ProceduralTerrain`, `PlanetaryExplorer`, `SurfaceObserver`, `HorizonView`, `NebulaStage`, `DeepTimeSky`, `EarthClouds`, `GroundCover`, `ProceduralCity`, `JetController`, `CompileGate`, and `LensPipeline`.
  - Exports `TelemetryData` (HUD state contract: `speedKmS`, `lookAzimuthDeg`, `lookElevationDeg`, `activeTarget`, `timeScale`, `julianDate`, `utcIso`, `isPaused`, `constellationsVisible`, `asteroidBeltVisible`, `orbitsVisible`, `observerScaleMetric`, `observerDomain`, `travelSpeed`, `cameraDistance`, `lensProfile`, `bloomGain`, `explorer`, `surface`, `horizonView`, `nebula`, `horizon`, `lightFromEarthSec`, `route`), `HudViewState` (`quaternion`, `velocity`, `toSun`, `target`, `transit`, `route`, `shipKm`, `heading`, `bodies`), and `FlightRoute` (`id`, `from`, `to`, `distanceKm`, `fromKm`, `toKm`).
  - Fixes Sagittarius A* heliocentric ecliptic offset `SGR_A_ECLIPTIC_KM` at `d = 2.553e17` km toward ecliptic longitude `266.84°`, latitude `-5.61°`.
- **Core Public API & Lifecycle Methods**:
  - **Ephemeris & Body Lifecycle**: `setupBodies()`, `rebuildOrbitLines()`, `propagateAll(elapsedDaysSinceJ2000)`, `bodyPositionKm(name)`, `selectBody(name, durationMs)`, `resetView()`, `jumpToScale(domain)`.
  - **Surface, Deep-Time, Nebula & Black Hole Modes**: `enterSkyView(body, facing)`, `exitSurface(fly)`, `setSurfaceMagnification(m)`, `setSurfaceAtmosphere(on)`, `setSurfaceTimeOfDay(what)`, `surfaceLookAt(name)`, `resetSurfaceZoom()`, `flyToLandmark(id)`, `setExplorerDaylight(on)`, `getExplorerStatus()`, `visitNebula(name)`, `enterDeepTime(id)`, `exitDeepTime()`, `enterHorizonView()`, `exitHorizonView(fly)`.
  - **Postcards, Showcase & Capture**: `openPostcard(c)`, `currentPostcardView()`, `captureShot(quality = 0.92)`, `startShowcase(name, hero)`, `stopShowcase()`, `showcaseCaption()`, `isShowcasing()`.
  - **NASA Spacecraft & Jet Mode Bridge**: `getParentResolver()`, `updateSpacecraftAndComets(deltaSec, showReticles)`, `selectSpacecraft(nameOrId, featuredEpochUtc)`, `rendezvousJetToSpacecraft(nameOrId, featuredEpochUtc)`, `enterJet(takeOffFrom)`, `exitJet(flyToWorld)`, `takeOffFromLanding()`, `startFlyPage()`, `flyReadiness()`, `isJetActive()`.
  - **Frame Render & Lighting Subroutines**: `renderFrame(timeSec)`, `updatePhotoreal()`, `updateSurfaceCover()`, `updateNightLight(...)`, `setFineGlobe(...)`, `updateCity(...)`, `updateJetSky(...)`, `dispatchTelemetry()`, `getViewState()`.

---

### 2. Jet Telemetry Contract, Animated Icons & HUD Lab

- **Canonical Jet Telemetry Contract (`src/flight/JetTelemetry.ts`, `353` lines)**:
  - Defines shared sign conventions in body frame (`-Z` nose, `+Y` up, `+X` right): positive `aoaDeg` = nose-up relative to airflow (`FPM -o-` below boresight `-W-`); positive `aosDeg` = nose-left sideslip (relative velocity sits to `+X` right).
  - Exports core union types: `JetView` (`'chase' | 'cockpit' | 'gopro' | 'flyby'`), `JetAirframeId` (`'gripen' | 'su30' | 'kestrel'`), `FbwMode` (`'norm' | 'high-g' | 'psm'`), `FlapMode` (`'auto' | 'combat' | 'land'`), `ManeuverKind` (`'none' | 'cobra' | 'kulbit' | 'herbst' | 'high-g-drift' | 'spin' | 'flare'`), `MfdSlot` (`'left' | 'centre' | 'right'`), `MfdPage` (`'PFD' | 'FCS' | 'ENG' | 'NAV'`), and `MfdPageMap`.
  - Exports structured sub-interfaces: `JetMarker`, `JetTargetScreenTelemetry`, `JetWaypointTelemetry`, `JetHeadOffset` (`x`, `y`, `z` in metres relative to nominal eyepoint), and `JetSurfaceState` (`canardRad`, `elevonLeftRad`, `elevonRightRad`, `flapLeftRad`, `flapRightRad`, `rudderRad`, `tvcPitchLeftRad`, `tvcPitchRightRad`, `tvcYawLeftRad`, `tvcYawRightRad`, `slat`, `airbrake`, `gear`, `nozzleIris`, `cmdPitch`, `cmdRoll`, `cmdYaw`).
  - Exports `JetTelemetry` combining core navigation/display fields (`speedMps`, `closingMps`, `altKm`, `nearest`, `anchor`, `airWorld`, `airDensity`, `mach`, `gLoad`, `throttle`, `boost`, `boostEnergy`, `assist`, `aligning`, `view`, `hasHorizon`, `pitchDeg`, `rollDeg`, `headingDeg`, `pxPerDeg`, `nose`, `fpv`, `target`, `markers`, `greyOut`, `canopySun`, `sunNdc`, `speedTier`, `transitName`, `waypoint`, `gearDown`, `abArmed`, `weather`, `localTime`, `lat/lon`, `sunDistKm`, `earthDistKm`) with Phase 2 airframe/propulsion fields (`airframeId`, `massKg`, `dryMassKg`, `fuelKg`, `maxFuelKg`, `fuelFrac`, `fuelFlowKgS`, `thrustN`, `maxDryThrustN`, `maxWetThrustN`, `abStage`, `supercruise`, `twRatio`, `gravityMps2`), aerodynamic/energy fields (`iasMps`, `tasMps`, `dynamicPressurePa`, `ambientTempK`, `ambientPressurePa`, `soundMps`, `aoaDeg`, `aosDeg`, `fpvAngleDeg`, `verticalSpeedMps`, `specificExcessPowerMps`, `gPeak`, `gMin`, `gEffect`, `cornerSpeedMps`, `stallSpeedMps`, `cl`, `cd`, `liftN`, `dragN`, `stallFactor`, `vortexStrength`, `groundEffect`, `onGround`, `touchdownImpulse`), and FBW/cockpit fields (`fbwMode`, `flapMode`, `airbrakeActive`, `wheelBrakeActive`, `highGActive`, `fpvHoldActive`, `tvcActive`, `maneuver`, `maneuverTimerSec`, `spinWarning`, `alphaWarning`, `overGWarning`, `surfaces`, `headOffset`, `mfdPages`).
  - Provides factories `createJetSurfaceState()`, `createDefaultMfdPages()` (`left: 'NAV'`, `centre: 'PFD'`, `right: 'ENG'`), and `createDefaultJetTelemetry(overrides)` (defaults to `'gripen'` / `'JAS 39 GRIPEN'`, `width: 1280`, `height: 720`).
- **Animated SVG HUD Icons (`src/flight/HudIcons.tsx`, `246` lines & `src/flight/hudIcons.css`, `140` lines)**:
  - Exports `IconName` covering `30` icon variants: `prev`, `next`, `target`, `land`, `cancel`, `view-chase`, `view-cockpit`, `view-gopro`, `view-flyby`, `tier-0`, `tier-1`, `tier-2`, `home`, `hour-back`, `hour-on`, `weather-auto`, `weather-clear`, `weather-rain`, `weather-snow`, `weather-storm`, `scale`, `aircraft`, `era`, `assist`, `inertial`, `sound`, `muted`, `help`, `exit`, `menu`.
  - Styled via `hudIcons.css` (`36×36` circular `.ib` buttons, `#6dfcc0` active glow, `#ff7a6b` alert tint, hover label tooltip `.ib__tip`, and CSS keyframe animations such as `ic-nudge-l`, `ic-nudge-r`, `ic-spin`, raindrop/snow/bolt/clock-hand motion).
- **Standalone HUD Layout Harness (`src/dev/hud-lab.html`, `56` lines)**:
  - Development-only harness (excluded from production entrypoints) invoking `drawTactical` from `/solaris/src/flight/TacticalHud.ts` directly over `/solaris/gallery/earth-sliver.jpg` with `?scene=space|earth|warn|mach` presets to verify HUD layout across arbitrary screen sizes without booting the 3D scene.

---

### 3. CSS Design Systems & Styling Architecture

- **Global Observatory Styles (`src/index.css`, `143` lines)**:
  - Imports `@tailwind base/components/utilities`, locks viewport (`100dvh`, `overscroll-behavior: none`, `touch-action: none` on `<canvas>`), configures `#010103` background, `Montserrat` body font, `3 px` dark cosmic scrollbars, and keyframe animations (`solarisShimmer`, `coronaAura`, `monographEnter`, `monographVanish`).
- **Observatory HUD Stylesheet (`src/ui/HUD/hud.css`, `1,724` lines)**:
  - Defines `:root` instrument tokens: `--sol-amber: #f4cd72`, `--sol-ember: #f29c55`, `--sol-mint: #6dfcc0`, `--sol-ice: #abcfff`, `--sol-red: #ff7a66`, `--sol-text`, `--sol-dim`, `--sol-faint`, `--sol-line`, `--sol-ink`, `--sol-mono: 'JetBrains Mono'`, `--sol-ease: cubic-bezier(0.16, 1, 0.3, 1)`, `--sol-snap: cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Drives mouse-driven helmet parallax (`.hud-parallax-near`, `.hud-parallax-far` via `--px`/`--py`), curved `.hud-visor` vignette, `.hud-scanlines`, glassmorphic panel hairlines, and responsive HUD layouts.
- **Jet Preloader Stylesheet (`src/fly/fly.css`, `299` lines)**:
  - Styles `.flyfilm` (`#010103` canvas, `.flyfilm__vignette`, `7vh` animated letterbox `.flyfilm__bars` opening on `.flyfilm--dive`, `#f4cd72` brand accent, `JetBrains Mono` clock, and condensing `clamp(30px, 6.4vw, 104px)` title typography).
- **Interactive Storybook Stylesheets (`src/book/`)**:
  - `src/book/book.css` (`242` lines): defines old-paper spot-ink tokens (`--paper: #ece1ca`, `--paper-2: #e2d4b6`, `--ink: #15120e`, `--orange: #e2501f`, `--green: #258f56`), display/body font stack (`Alfa Slab One`, `Bodoni Moda`, `Archivo`, `Newsreader`, `Shantell Sans`, `Dela Gothic One`), 3D `perspective: 3400px` `.stage`/`.sheet`/`.face`, `760 × 1040` `.pg` page geometry with gutter shadows and `.turnshade`.
  - `src/book/chapters.css` (`137` lines): styles chapter layouts, `.spec` tables, 2-column `.list`, `.units` dot matrices, `.metro` contents rail, and `.take` waveform cards.
  - `src/book/story.css` (`221` lines): styles the 4-layer parallax cover (`.cv2`, `.dep1..4`, foil-animated `.cv2-mast`, angled `.obi` strip, jagged `.obi-free` seal), `.howkeys` guide, and split-flap `.flap` clock.
  - `src/book/strip.css` (`46` lines): reflows fixed-coordinate manga panels, speech bubbles, and typography into vertical mobile/portrait `.strip` flow.
- **Technical Report Stylesheet (`src/report/report.css`, `522` lines)**:
  - Defines editorial cosmos tokens (`--void: #07060b`, `--plate: rgba(11, 9, 18, 0.56)`, `--starlight: #f3e7d3`, `--ash: #ada6bc`, `--dust: #e0916a`, `--oiii: #8fa8ff`, `--vela: #6dfcc0`, fonts `Zodiak`, `Satoshi`, `Geist Mono`, `--col: 700px`, `--wide: 1200px`), `.sky-bg` canvas, animated SVG noise `.sky-veil`, and `.sky-hud` slewing telescope reticle.

---

### 4. Root Config, Type Ambient, CI Workflows, Scripts & Research Notes

- **Tailwind, PostCSS, ESLint & Vite Types**:
  - `tailwind.config.js` (`32` lines): extends colors (`space.950..700` `#030206`–`#171424`, `terminal` `#6dfcc0`, `#f29c55`, `#f4cd72`, `#ed6754`, `#abcfff`) and font families (`Montserrat`, `ui-monospace`, `Instrument Serif`).
  - `postcss.config.js` (`6` lines): configures `tailwindcss` and `autoprefixer` plugins.
  - `eslint.config.js` (`23` lines): flat ESLint v9 config ignoring `['dist', 'node_modules', 'scratch', 'data', 'launch-video', '.vite']`, linting `src/**/*.{ts,tsx}` with `js.configs.recommended`, `tseslint.configs.recommended`, `eslint-plugin-react-hooks`, browser globals, `@typescript-eslint/no-explicit-any: 'warn'`, plus `scripts/**/*.cjs` under Node CommonJS globals.
  - `src/vite-env.d.ts` (`1` line): `/// <reference types="vite/client" />` for `import.meta.env` and Vite asset imports.
- **CI Source Verification Workflow (`.github/workflows/verify-sources.yml`, `28` lines)**:
  - Runs on pushes to `tools/verify-sources` (or `workflow_dispatch`) under Node 20, executes `scripts/verify-tile-sources.mjs` and `scripts/fetch-landmark-coords.mjs`, and commits updated reports to `docs/research/imagery-sources-probe.txt` and `docs/research/landmark-coords.txt`.
- **Additional Build & Asset Scripts (`scripts/`)**:
  - `scripts/build_logo.py` (`123` lines): mirrors `src/ui/brand/logo.ts` geometry using Pillow to generate `public/favicon.svg`, `apple-touch-icon.png` (`180px`), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, and multi-size `favicon.ico` (`16..256px`).
  - `scripts/book/build_clips.py` (`51` lines): slices `3.2 s` segments from `launch-video/out/shots/*.mp4`, stretches luminance contrast (`gamma = 0.62` for dark frames `< 28` median, else `0.8`), scales to `1024×576` at `12 fps`, and appends reversed ping-pong loops into `public/book/clips/*.mp4`.
  - `scripts/book/build_spectrum.py` (`33` lines): generates the `512×512` `public/book/spectrum.webp` gradient (`11` color stops from red `(205, 52, 16)` to teal-green `(14, 112, 84)`) behind the back cover's Fraunhofer barcode.
  - `scripts/report_nebula_bands.py` (`20` lines): splits `public/textures/nebulae/cosmic-cliffs.webp` (`<= 1000 px`) into `7` luminance-quantile soft RGBA bands `public/report/media/neb-band-0..6.webp` for `<NebulaLayers />`.
- **Architecture & Capture Reference Artifacts**:
  - `docs/research/SOLARIS_REFERENCE_AUDIT.md` (`122` lines): Oct 2026 design note documenting NASA Eyes, reference video, and Sojourner observations, initial JPL Horizons checks (Earth/Jupiter), galactic constants, logarithmic zoom mapping, anchor handoffs, and velocity-aware dust streaks (with status header noting later superseding constants).
  - `scratch/*.py` (`8` scripts: `check_coords.py`, `check_sun_coords.py`, `download_nasa_galaxy.py`, `generate_galaxy_texture.py`, `get_milky_way_url.py`, `process_nasa_texture.py`, `validate_galaxy_render.py`, `validate_infinite_scale.py`): offline astronomy/galaxy-texture/coordinate validation scratch utilities.
  - `launch-video/capture/`: auxiliary capture/probing utilities beyond the core suite in Part 8 (`anno.py`, `book-motion.mjs`, `book-scan.mjs`, `book-shots.mjs`, `extend_music.py`, `gh-readme.mjs`, `hero-probe.mjs`, `main-shot.mjs`, `music_grid.py`, `music_scan.py`, `pen.mjs`, `probe.mjs`, `readme-art.mjs`, `readme-page.mjs`, `readme-scroll.mjs`, `report-hero.mjs`, `report-vela.mjs`, `scout.mjs`, `scout2.mjs`, `scout3.mjs`, `sheet.py`), plus `launch-video/remotion/data/sky_{enceladus,io,phobos_rise,saturn}.json` screen-tracking datasets.
