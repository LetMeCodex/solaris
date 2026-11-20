# Terrain and tile repair

Implemented with three parallel agents and integration checks on 15 November 2026.

## Root causes repaired

- Procedural terrain read changing DEM data over multiple frames. Builds now use immutable height snapshots and a fully covered DEM level, preventing download boundaries becoming vertical mountain walls.
- Nested Earth terrain cutouts compared geodetic bounds against reduced latitude. The shader now inverts the WGS84 latitude transform; the roughly 9 km offset at Everest caused the horizontal foreground ribbon.
- Surface imagery requested only a limited ancestor chain. It now retains the complete coarse-to-fine fallback chain.
- Elevation availability could change the geometry stride after sampling. Grid dimensions are stored with sampled heights, and replacement meshes are committed atomically while cached imagery stays visible.
- Missing DEM pixels poisoned interpolation. Valid weighted samples are normalized; nonfinite heights are rejected and failed requests have bounded retry cooldowns.
- Shader warm-up could hide replacement Google terrain after parent retirement. Coverage-critical meshes remain visible.
- Transient Google request cooldowns hid existing cached terrain. Cached geometry now remains drawn.
- Whole-model texture uploads defeated frame budgets; one failed upload could strand later work. Uploads are deduplicated, budgeted individually, and errors propagate without stopping the queue.
- One visible Google tile disabled the entire Earth imagery layer. Imagery now stays as a depth-tested underlay, with the map-only shell/zoom lift removed so it does not float over photogrammetry.
- Google ancestor loading accumulated a large regional backlog before city detail. Optimized target-detail traversal now uses the existing global imagery/DEM as its baseline.
- Hierarchy JSON had unconditional priority over drawable content, starving buildings while recursively expanding the hierarchy. Visible hierarchy and drawable content now compete by screen-space error.
- Failed high-resolution planet maps were permanently marked upgraded. Successful maps are tracked individually; failures preserve base maps and retry after cooldown.
- A built-in aircraft fallback did not satisfy flight readiness. It now does.
- Framebuffer pixel budgets now hold on very large screens, and invalid frame timing cannot poison adaptive resolution.

## Validation

- Full suite: 286 tests across 43 files passed.
- TypeScript production build passed. Vite still reports the existing large application chunk warning.
- ESLint passed with no errors or warnings.
- Browser checks: Earth Everest and Rome, Moon Tycho, Mars Olympus; 1440x900 desktop, 390x844 touch phone emulation, 1024x768 tablet emulation. No JavaScript exceptions; no horizontal document overflow in these checks.
- Final rebuilt Everest screenshot confirms continuous mountain geometry and disappearance of the horizontal ribbon.
- Browser artifacts and sanitized diagnostics: output/playwright/terrain-fix/.

## Limits

These are shared-engine fixes, not a claim that every city and planet has been visually inspected. Phone/tablet checks are emulation, not physical-device thermal/FPS certification. Detailed photogrammetry still requires provider coverage, network access, and a valid configured Maps key. The global imagery and terrain fallback is intended to remain continuous while detail refines; it cannot make all worldwide high-resolution data available offline or immediately. Rome city-level detail remains unverified: the final 30-second sample had 12 queued / 31 downloading / 3 loaded / zero visible tiles and no HTTP failure statuses. Earlier samples accumulated over 1,000 queued tiles. The backlog improvement is observed, but detailed buildings did not finish loading in the sample, so the city-loading requirement is not declared complete.

Existing working-tree edits were preserved; no commit or public deployment was made by this repair task.
