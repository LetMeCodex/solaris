# Solaris audit — 15 November 2026

## Assessment

**Overall: 7.2/10.** Solaris has a strong creative identity, substantial simulation engineering, and useful numerical regression tests. Its largest remaining gains are startup efficiency, accessible interaction, predictable failure recovery, and maintainable boundaries between subsystems.

**Portfolio / demonstration value: 8.5/10. Public-product readiness: 6/10.** These are judgment scores based on the evidence below, not industry certifications or user-study results.

| Area | Score /10 | Reason |
|---|---:|---|
| Concept and differentiation | 9 | A coherent universe explorer, flight experience, companion, report and book |
| Visual identity | 8.5 | Distinctive observatory styling and illustrated editorial work; crowded labels and small text |
| Scientific implementation | 8 | Real reference data and meaningful tests; date-range and time-scale limitations |
| Architecture | 6.5 | Clear domain folders, but large controllers and eager cross-domain imports |
| Testing | 7.5 | 270 passing tests; important browser failures escape the suite |
| Performance and delivery | 5.5 | Adaptive resolution exists; substantial startup traffic and eager resource work |
| Accessibility and usability | 5 | Labels and reduced-motion handling exist; modal focus and dense controls need work |
| Reliability | 5.5 | Good local fallbacks in some systems; blank WebGL failure and blocked flight readiness |
| Security and dependencies | 6 | No production npm advisories found; outdated tooling has 16 dependency advisories |
| Documentation and reproducibility | 7 | Extensive explanations and provenance; stale claims and incomplete auxiliary-project checks |

The ten equally weighted area scores average 6.95; the overall judgment is 7.2 because the core simulation and original presentation carry more weight for this project's apparent purpose.

## Scope and evidence

Reviewed the folder inventory, root configuration, CI workflows, principal TypeScript/React modules, rendering and flight orchestration, scientific calculations and representative tests, data builders, asset provenance, book/report implementations, and launch-video tooling. Inventoried binary assets and generated outputs. This was a broad engineering audit with targeted deep inspection, not a line-by-line certification of every file or verification of every scientific claim.

Checks run against the initial working tree and generated production build:

- npm test: **39 files, 270 tests passed**.
- npm run lint: **zero errors, one explicit-any warning** in App.tsx.
- npm run build: **passed**, including TypeScript checking; Vite emitted a large-chunk warning.
- npm audit: **16 affected dependency entries**: 2 low, 11 moderate, 1 high, 2 critical.
- npm audit --omit=dev: **zero reported production dependency vulnerabilities**.
- Chromium desktop and 390 × 844 mobile emulation; explorer opening and Saturn navigation; Settings keyboard navigation; report opening/scroll; book opening/page turn.
- Simulated unavailable WebGL and blocked aircraft/Google tiles.
- Reproduced the J2000 conversion discrepancy directly from SimulationClock.

Browser runs used a local production preview on this computer. They are not throttled network benchmarks, real-phone battery tests, WCAG certification, or measurements of the deployed site's cache/CDN. Browser timing samples are observations, not statistically established performance percentiles.

Source files changed externally during this audit. The tested bundle was generated before those later edits. Findings describe that inspected/tested snapshot; newer files require revalidation. The audit did not modify application source or dependencies.

## What the folder contains

| Folder / file | Purpose | Assessment |
|---|---|---|
| src/astronomy, simulation, data, types | Positions, time, coordinate systems, catalogue | Strongest engineering foundation |
| src/rendering, navigation, explorer | WebGL scene, camera, terrain, imagery, skies | Capable but tightly integrated |
| src/flight | Aircraft, controls, weather, cockpit, HUD, radio | Large product within the product |
| src/ui, companion, audio | React interface, Vela, music and settings | Distinctive; needs accessibility consolidation |
| src/report and report/ | Interactive technical report | Valuable explanation; substantial runtime resources |
| src/book and book/ | Illustrated interactive catalogue | Original presentation, efficient initial loading |
| public/ | Runtime data, images, models, speech and media | About **525.9 MiB**, 2,950 files |
| scripts/ and data/ | Data/texture/audio generation and research | Useful; environment and reproducibility need documenting |
| launch-video/ | Separate Remotion/capture project | About **3.52 GiB** excluding dependencies; isolate production assets from generated output |
| hackathon-ppt/ | Presentation generators and deliverables | About **67.9 MiB**; already untracked at audit start |
| dist/ | Generated website build | About **529.5 MiB**; ignored by Git |
| docs/, README, complete guide, ASSETS | Research and narrative documentation | Extensive, but multiple versions of facts drift |

Source inventory: **237 files**, approximately **88,523 physical lines** including JSON/CSS and generated catalogue content; approximately 84,222 lines in TS/TSX including tests and generated data. This is not all handwritten logic. Git listed 3,352 tracked files at the initial inventory.

Public assets are dominated by NASA content (360.8 MiB), textures (51.3), speech (32.7), aircraft models (24.1), report assets (23.1), and book assets (16.5). Binary duplicate hashing found 47 duplicate groups with about **4.86 MiB** of redundant copies. Deduplication helps, but model optimization and load scheduling offer larger benefits.

## Confirmed problems, ordered by impact

### 1. Flight loading can remain blocked after an aircraft failure — high

**Evidence:** src/App.tsx readiness logic requires r.aircraft even for its timeout path. JetController catches aircraft loading failure and shows the built-in aircraft, but aircraftReady tests whether the imported airframe exists. With the aircraft request and Google tiles blocked, after roughly 58 seconds the readiness state was jet=true, aircraft=false, tilesVisible=0 and the opening remained active.

**Fix:** represent aircraft loading as pending / imported-ready / fallback-ready / failed. Treat the built-in aircraft as usable. Apply an overall deadline outside individual success conditions. Offer Retry and Continue with reduced detail, with a visible explanation of which source failed.

**Acceptance:** independently block aircraft, tiles and both together. Each case must reach a usable fallback or actionable error within a specified limit. Test a build with no Maps key as well.

### 2. Unavailable WebGL produces a blank application — high

**Evidence:** intercepting WebGL context creation produced an empty body, with renderer-creation errors. Scene construction in the React effect is not converted into a user-visible failure state.

**Fix:** check support and handle renderer initialization exceptions explicitly. Add a root React error boundary for render failures plus an initialization error state for imperative/effect failures. Give a readable explanation, Retry, low-quality option where applicable, and links to the book/report or a static experience. Show a recovery overlay for context loss.

**Acceptance:** disabled WebGL, lost/restored context, and failed initialization all show usable guidance. An error boundary alone is insufficient for arbitrary asynchronous errors.

### 3. Earth search conflicts with the public Nominatim policy — high

**Evidence:** ExplorerPanel issues searches after a 260 ms typing debounce. EarthSearch calls nominatim.openstreetmap.org directly. ReverseGeocode separately throttles requests per client; there is no shared application-wide request limiter.

The public policy forbids client autocomplete and specifies that its request limit applies across the application's users. A per-tab debounce or per-client reverse-geocode throttle does not satisfy those requirements. See [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).

**Fix:** replace typing-triggered public requests with explicit search submission immediately. For public scale, use a provider that permits the intended interaction or self-host; centralize caching/rate limiting and make the endpoint switchable. Preserve attribution and keep transient failures out of permanent result caches.

### 4. Startup downloads and warm-up are expensive — high

**Evidence:** one desktop opening collected roughly **36.25 MiB** over 250 recorded resource entries by 18 seconds. Another full run reached the Begin button in **11.27 seconds**. Mobile emulation recorded about **52.62 MiB** by 12.3 seconds. These are separate samples with different collection windows and cache/device contexts, so they are not a controlled desktop-versus-mobile comparison.

The main application chunk is **1,698 kB minified / 567 kB gzip**, plus Three.js, React and shared chunks. No application dynamic imports were found outside development tooling. Scene initialization creates flight-related systems and warmUp prepares distant scenes before entry. Recorded startup requests included many NASA model resources beyond the immediate view.

**Fix:** first show a minimal observatory. Load flight code on Fly, black-hole effects near that destination, and high-detail models only when apparent screen size warrants them. Warm shaders shortly before a feature becomes relevant. Prioritize the selected world; give constrained devices smaller textures and model LODs. Retain existing camera/physics regression tests during this work.

Set proposed budgets, then measure: essential initial transfer under 10 MiB, usable opening under 5 seconds on an agreed mid-range device/network, and p95 frame time under 33 ms for the low tier. These are proposed targets, not current results.

A Saturn snapshot reported 664 geometries, 146 textures, 91 programs and 610 render calls in the renderer's reported frame. Multipass reporting needs interpretation; this is a profiling signal, not proof of a particular FPS bottleneck.

### 5. Settings keyboard focus escapes behind the overlay — medium

**Evidence:** after opening Settings, eight Tab presses focused background navigation controls; none entered Settings. Settings/Atlas/Gallery implement dialog roles and Escape handling but lack a complete shared modal focus lifecycle in the inspected code.

**Fix:** build one accessible dialog primitive with initial focus, contained Tab navigation, background inertness, Escape, and focus restoration. Implement tab/radio keyboard patterns. Do not apply aria-modal without the corresponding behavior. See [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Also hide or disable background scene controls while the opening screen is active; the opening accessibility snapshot exposed clickable world markers beneath it.

### 6. Historical UTC-to-TDB conversion is wrong at J2000 — medium

**Evidence:** J2000_UTC_MS correctly encodes 2000-01-01 11:58:55.816 UTC, but getJulianDateTDB always adds 69.184 seconds, the post-2017 offset. At J2000 it should add approximately 64.184 seconds. Reproduction yielded JD 2451545.0000578705, **5.000013 seconds** above the defined epoch.

The existing century test passes because its numerical tolerance permits that error.

**Fix:** use a date-dependent leap-second table for supported modern dates, explicitly document the approximation for earlier UTC/UT dates, and centralize both forward and inverse conversions. Add tests asserting seconds at J2000 and around leap boundaries.

Planet elements are fitted over 1800–2050; the date input has no corresponding range or accuracy indication. Warn outside a validated interval or supply an appropriate model. Extend reference fixtures across dates, with independently generated provenance. See [JPL's model and validity limits](https://ssd.jpl.nasa.gov/planets/approx_pos.html).

### 7. Development dependencies require maintenance — medium, with high-severity advisory entries

Audit reported advisories involving Vite, Vitest/tinypool, esbuild, ESLint and related tooling. These counts include transitive effects and are not 16 independent exploitable application flaws. The critical Vitest UI advisory is conditional on a listening UI server; this project's normal test command is vitest run. Production-only audit was clear.

**Fix:** upgrade Vite/Vitest and their compatible plugins deliberately; refresh compatible lint dependencies and re-audit remaining transitive entries. Do not blindly apply force upgrades. Run build, numerical tests and browser scenarios after each toolchain step. Vite 5 is outside currently supported lines; CI specifies Node 20, now EOL. Pin a supported LTS version consistently. Bind development servers to localhost unless network access is intentionally needed.

References: [Vite support policy](https://vite.dev/releases), [Node release status](https://nodejs.org/en/about/previous-releases), [Vitest maintainer advisory](https://github.com/vitest-dev/vitest/security/advisories/GHSA-5xrq-8626-4rwp).

### 8. Graphics, map and media provenance need completion — medium

ASSETS.md is unusually useful, but the large public/nasa model/trajectory collection needs a per-asset source/license/change manifest. A general NASA public-domain statement does not establish the status of every bundled third-party work. Music authorship/rights and generated-voice permissions should have an explicit durable record.

Google attribution currently renders a text string beginning Google. Verify the required Google Maps logo, provider attribution, privacy/terms links, video use and mixed-source overlays against the actual agreement. ASSETS says procedural buildings are off by default, while the inspected scene enabled them unless localStorage disabled them.

Browser Maps keys are visible by design after Vite bundling. A gitignored .env.local protects against committing the input file, not exposure in the bundle. Verify website/API restrictions, separate development/production keys and quotas in the Cloud console; these account settings were not accessible in this audit.

References: [Google key guidance](https://developers.google.com/maps/api-security-best-practices), [Map Tiles policy](https://developers.google.com/maps/documentation/tile/policies), [NASA media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/), [Vite environment behavior](https://vite.dev/guide/env-and-mode).

## Architecture improvements

The folder structure already separates useful domains. Preserve that structure while reducing orchestration size.

JetController is approximately 3,219 physical lines; JetModel 3,082; SolarSystemScene 2,958; JetHUD 1,947; CameraRig 1,636. Generated NasaEyesCatalog is 8,648 lines and should be treated as data, rather than judged like a handwritten controller.

Extract scene lifecycle/resource ownership, physical-state updates, exploration mode transitions, and flight integration behind small typed interfaces. Define explicit transitions between orbit, transit, surface, flight and failure states. Keep km/time reference calculations separate from render-space transforms.

Introduce a ResourceScope that owns listeners, animation frames, workers, GPU resources and cancellation signals. Singleton caches need explicit ownership and renderer compatibility rules. The initial PerformanceGovernor subscription lacked unsubscription; later external edits appear to add it, so re-check rather than applying a duplicate fix. Stress-test repeated mounting and scene transitions using renderer.info and heap trends.

Prefer incremental extraction over a rewrite. Move generated catalogue data and converters behind a build step with a documented input snapshot and checksum. Type external API responses and persisted settings at runtime; a TypeScript cast does not validate network JSON or localStorage.

## Interface and product improvements

The observatory visual language is worth retaining. Improve hierarchy and legibility within it:

- Reduce initial label density. Desktop and mobile captures show overlapping Jupiter/Juno and Earth/JWST labels. Use screen-space collision handling, priority rules and zoom-dependent visibility.
- Increase secondary text contrast and minimum size. Make controls easier to read over the Milky Way; validate contrast with actual rendered backgrounds.
- On phones, use a compact header and a destination sheet. Keep primary actions reachable and avoid presenting every instrument at once.
- Make fullscreen an explicit preference. Begin currently requests fullscreen as part of entry.
- Give newcomers three immediate journeys: orbit Earth, stand on a moon, fly over a landmark. Reuse existing Tour/Postcard/Voyage capabilities.
- Add shareable state: target, date, location, view and mode. Include a schema version and safe defaults for invalid links.
- Distinguish computed positions, reconstructed imagery, procedural terrain and imagined scenes near the relevant feature. Keep the more detailed honesty notes in the report.
- Offer an easy route back to a stable overview and persistent control help in flight mode.
- Preserve voice/text alternatives and expand reduced-motion handling to preloader loops, idle motion and reading animations.

Vela, the illustrated book, planetary surface skies and the seamless scale journey are the strongest differentiators. Feature count is already high. The next product milestone should improve completion of a few reliable journeys.

For context, [NASA Eyes](https://science.nasa.gov/eyes/) already offers broad real-data solar-system visualization and [Stellarium Web](https://stellarium-labs.com/stellarium-web/) focuses on a browser planetarium. Solaris can emphasize guided storytelling and movement between orbital, surface and flight experiences. This is a positioning assessment from their published descriptions, not an exhaustive competitive benchmark.

## Testing and release process

Keep the scientific tests. Add a small browser suite around outcomes the current tests cannot establish:

1. Open the explorer and reach a usable scene.
2. Select a planet, enter/exit surface mode and return to overview.
3. Start flight with normal, missing-key, blocked-tile and failed-aircraft conditions.
4. Open Settings/Atlas using the keyboard and verify focus containment/restoration.
5. Disable WebGL and simulate context loss.
6. Open report and book; turn a page and follow a chapter.
7. Repeat relevant scenarios at a phone viewport and reduced-motion setting.

Current shader tests inspect constructed objects and uniforms; they do not prove GLSL compiles or renders correctly on a GPU. Current performance tests verify governor logic; they do not establish real-device FPS.

Add bundle/asset budgets to CI, targeted accessibility checks, and visual snapshots at fixed clock/seed/camera settings. Store sanitized diagnostic artifacts when a scenario fails. Narrow workflow permissions: the build does not need repository write access; deployment can receive that privilege separately.

The report opened without runtime errors in the sample but created 13 canvases and transferred about 27.54 MiB. IntersectionObserver pauses drawing in figures, but renderers are still created at initialization. Consider creating contexts near visibility, sharing a renderer, and limiting the 300-frame hero sequence on constrained devices.

The book opened and turned a page, with about 0.46 MiB initially transferred in that sample, but emitted repeated empty-target GSAP warnings. Guard animation selectors and handle invalid/out-of-range page hashes. Validate all book layouts at phone sizes separately.

## Documentation, auxiliary tooling and repository hygiene

- Replace the stale README badge claiming 142 tests with generated current results.
- Explain the supported runtime, deployment bases, environment names and Maps fallback in one short setup guide. Supply a value-free .env.example.
- Distinguish source assets, shipped runtime assets, generated media and disposable caches; do not delete deliverables without an explicit retention decision.
- The launch-video capture npm script names capture/capture.mjs, which did not exist in the inventory. Fix that entry point and document the intended capture composition.
- Root build/lint excludes launch-video; its TypeScript configuration only covers remotion. Give the auxiliary project its own install/typecheck/render smoke checks.
- Document Python/ffmpeg/PyTorch requirements and data-builder inputs. Avoid claiming a fresh environment can reproduce assets until tested.
- Centralize changing facts such as world/star/test counts and voice pipeline details. The voice runtime comment mentions Kokoro while the generator documents Chatterbox.
- Review transferred Apache-licensed decoder code for the required license/notice distribution.
- Keep the existing untracked presentation folder separate from the application audit changes.

The presentation binaries and launch films were inventoried, not fully rendered, watched or editorially audited. Cloud key settings, full Git secret history, deployed caching/security headers, every external endpoint and every asset right were not independently verified.

## Recommended execution order

| Stage | Work | Completion evidence |
|---|---|---|
| First 1–3 engineering days | Aircraft fallback readiness; WebGL failure screen; explicit geocoding submit; date conversion regression | Browser failure cases pass; J2000 error below agreed tolerance |
| Next 3–7 days | Toolchain maintenance, modal primitive, keyboard checks, attribution and key configuration review | Supported runtime; reviewed dependency audit; keyboard scenarios pass |
| Next 1–2 weeks | Lazy flight/distant effects, model LOD, startup scheduling, asset budgets | Recorded before/after traces on desktop and real mid-range phone |
| Following 2–4 weeks | Controller extraction, resource ownership, shareable journeys, documentation/build reproducibility | Stable transitions; bounded memory trends; reproducible clean setup |
| Ongoing | Numerical fixtures, provider health, license manifest, user testing | Versioned evidence and measurable task success |

Estimates assume one developer familiar with the code and are planning ranges. Re-profile before committing to large rendering changes.

**Best next investment:** make entry and fallback behavior dependable, then cut unnecessary startup work. These changes improve every existing feature and provide a better foundation for further content.

