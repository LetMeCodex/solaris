import * as THREE from 'three';
import { CatalogueManager } from '../data/CatalogueManager';
import { PlanetFactory, PlanetMeshBundle } from './PlanetFactory';
import { CameraRig } from '../navigation/CameraRig';
import { CelestialBodyDefinition, SelectedTargetInfo } from '../types/catalogue';
import { SimulationClock } from '../simulation/SimulationClock';
import { KeplerSolver, StateVector } from '../astronomy/KeplerSolver';
import { RenderSpaceTransform, ScaleMode } from './RenderSpaceTransform';
import { OrbitalTrails } from './OrbitalTrails';
import { Starfield } from './Starfield';
import { AsteroidBelt } from './AsteroidBelt';
import { LensPipeline, LensProfileName } from './LensPipeline';
import { HorizonView } from './HorizonView';
import { PlanetaryExplorer, ExplorerStatus } from '../explorer/PlanetaryExplorer';
import { SurfaceObserver, SurfaceStatus } from '../explorer/SurfaceObserver';
import { ScreenLabels } from '../explorer/ScreenLabels';
import { SkyBodySource } from '../explorer/SkyBodies';
import { TimeOfDay } from '../explorer/SkyAstronomy';
import { Landmark } from '../explorer/Landmarks';
import { localToLatLon } from '../explorer/TileMath';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { BodyFrame, getBodyFrame, getSynchronousFrame } from '../astronomy/BodyOrientation';

export interface TelemetryData {
  speedKmS: number;
  lookAzimuthDeg: number;
  lookElevationDeg: number;
  activeTarget: SelectedTargetInfo | null;
  timeScale: number;
  julianDate: number;
  utcIso: string;
  scaleMode: ScaleMode;
  isPaused: boolean;
  constellationsVisible: boolean;
  asteroidBeltVisible: boolean;
  orbitsVisible: boolean;
  observerScaleMetric: string;
  observerDomain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic';
  travelSpeed: number;
  cameraDistance: number;
  lensProfile: LensProfileName;
  bloomGain: number;
  explorer: ExplorerStatus;
  surface: SurfaceStatus | null;
  /** Standing on the hypothetical ocean world beside Sgr A*. */
  horizonView: boolean;
  /** In the horizon view: distance from the hole (r_s) and whether still on the shore. */
  horizon: { rRs: number; onShore: boolean } | null;
  /** One-way light time Earth → selected body, seconds (null for Earth itself). */
  lightFromEarthSec: number | null;
  route: FlightRoute | null;
}

export interface HudViewState {
  /** Camera orientation in the ecliptic render frame (+Y = ecliptic north). */
  quaternion: THREE.Quaternion;
  /** Camera velocity, render units per second. */
  velocity: THREE.Vector3;
  /** Vector from the camera to the Sun. */
  toSun: THREE.Vector3;
  /** Focused body on screen: centre (CSS px) and apparent radius (CSS px). */
  target: { x: number; y: number; r: number; visible: boolean };
  transit: { progress: number; target: string } | null;
  /** The last flight that was ordered (kept after arrival). */
  route: FlightRoute | null;
  /** Where the observer is, heliocentric ecliptic km (follows the route during a flight). */
  shipKm: [number, number, number];
  /** Look direction projected onto the ecliptic plane (x, y), not normalised. */
  heading: [number, number];
  /** Planets and dwarf planets: heliocentric ecliptic km and orbit size in AU. */
  bodies: Array<{ name: string; x: number; y: number; aAU: number; color: string }>;
}

export interface FlightRoute {
  id: number;
  from: string;
  to: string;
  distanceKm: number;
  fromKm: [number, number, number];
  toKm: [number, number, number];
}

/** Sgr A* in heliocentric ecliptic km: 8.277 kpc towards ecliptic longitude 266.8°, latitude −5.6°. */
const SGR_A_ECLIPTIC_KM: [number, number, number] = (() => {
  const d = 2.553e17;
  const lon = (266.84 * Math.PI) / 180;
  const lat = (-5.61 * Math.PI) / 180;
  return [d * Math.cos(lat) * Math.cos(lon), d * Math.cos(lat) * Math.sin(lon), d * Math.sin(lat)];
})();

export class SolarSystemScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  public cameraRig: CameraRig;

  // Simulation Clock & Physical-to-Render Transforms
  public clock: SimulationClock = new SimulationClock();
  public transform: RenderSpaceTransform = new RenderSpaceTransform();

  // Celestial Bodies, Moons & Minor Bodies
  private planetBundles: Map<string, PlanetMeshBundle> = new Map();
  private orbitLinesGroup: THREE.Group = new THREE.Group();
  private moonOrbitLines: Map<string, THREE.Line> = new Map();
  private latestPhysicalStates: Map<string, StateVector> = new Map();
  /** A surface view requested for a body that is not focused yet (entered once the explorer has it). */
  private pendingSkyView: { body: string; lat: number; lon: number; place: string } | null = null;
  private orbitLinesEpochDays: number = 0;

  // Scratch objects reused every frame
  private tmpMatrix = new THREE.Matrix4();
  private tmpX = new THREE.Vector3();
  private tmpY = new THREE.Vector3();
  private tmpZ = new THREE.Vector3();

  // GPU Background & Asteroid Belt
  public starfield: Starfield;
  public asteroidBelt: AsteroidBelt;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();

  private isRunning: boolean = true;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = performance.now();

  // Observation-camera optics (bloom, lens, grain, motion blur)
  public lens: LensPipeline;

  // Google Maps–style surface imagery streaming and landmark navigation
  public explorer: PlanetaryExplorer;
  public surface: SurfaceObserver;
  private labels: ScreenLabels;
  private surfaceSaved: Array<[THREE.Object3D, boolean]> = [];

  // Selection
  public selectedBody: CelestialBodyDefinition;
  private onTelemetryUpdate?: (telemetry: TelemetryData) => void;
  private lastTelemetryTime: number = 0;
  private static readonly TELEMETRY_INTERVAL_MS = 100;

  constructor(container: HTMLElement, onTelemetryUpdate?: (telemetry: TelemetryData) => void) {
    this.container = container;
    this.onTelemetryUpdate = onTelemetryUpdate;

    // Default target: Mercury (reference opens with cinematic horizon view of Mercury)
    this.selectedBody = CatalogueManager.getBody('Mercury') || CatalogueManager.getAllBodies()[0];

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020105);

    // 2. Renderer
    // Loading progress for the preloader (all TextureLoader requests use the default manager)
    THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) => {
      this.textureFraction = total > 0 ? loaded / total : 0;
    };
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    this.renderer.setSize(initialWidth, initialHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    // 3. Camera Rig
    this.cameraRig = new CameraRig(container);
    this.lens = new LensPipeline(this.renderer, this.scene, this.cameraRig.camera);

    // 4. Lighting
    this.setupLighting();

    // 5. Starfield background (41,394 real Hipparcos stars + IAU Constellations)
    this.starfield = new Starfield();
    this.scene.add(this.starfield.group);

    // 6. Instanced Asteroid Belt (3,200 asteroids with Kirkwood gaps)
    this.asteroidBelt = new AsteroidBelt(this.transform);
    this.scene.add(this.asteroidBelt.mesh);

    // 7. Build Celestial Bodies & Keplerian Orbit Trails
    this.orbitLinesGroup.visible = true; // Every layer starts on; the user can switch them off
    this.scene.add(this.orbitLinesGroup);
    this.setupBodies();
    this.explorer = new PlanetaryExplorer(this.cameraRig, (name) => {
      const b = this.planetBundles.get(name);
      if (!b) return null;
      return {
        name,
        bodyGroup: b.bodyGroup,
        surfaceMesh: b.surfaceMesh,
        cloudMesh: b.cloudMesh,
        baseMap: (() => {
          const u = (b.surfaceMesh.material as THREE.ShaderMaterial).uniforms;
          return (u?.map?.value ?? u?.dayMap?.value ?? null) as THREE.Texture | null;
        })(),
        visualRadius: b.visualRadius,
        radiusKm: b.definition.physical.meanRadiusKm,
      };
    });
    this.explorer.setMaxAnisotropy(this.renderer.capabilities.getMaxAnisotropy());
    this.labels = new ScreenLabels(container, (id) => {
      if (id.startsWith('sky:')) this.surface.lookAt(id.slice(4));
      else this.flyToLandmark(id);
    });
    this.surface = new SurfaceObserver({
      camera: this.cameraRig.camera,
      dom: container,
      scene: this.scene,
      getBody: (name) => {
        const b = this.planetBundles.get(name);
        if (!b) return null;
        return {
          name,
          bodyGroup: b.bodyGroup,
          surfaceMesh: b.surfaceMesh,
          visualRadius: b.visualRadius,
          radiusKm: b.definition.physical.meanRadiusKm,
        };
      },
      getSources: () => this.skySources(),
      getPositionKm: (name) => {
        if (name === 'Sun') return [0, 0, 0];
        const st = this.latestPhysicalStates.get(name);
        return st ? (st.positionKm as [number, number, number]) : null;
      },
      getDays: () => this.clock.getJulianDateTDB() - SimulationClock.J2000_JD,
      setDays: (d) => {
        // TDB → UTC (TT − UTC = 69.184 s) → Unix ms
        const jdUtc = d + SimulationClock.J2000_JD - 69.184 / 86400;
        this.clock.setUtcMs((jdUtc - 2440587.5) * 86400000);
      },
      setSceneMode: (on, body, skyRadius) => this.setSurfaceSceneMode(on, body, skyRadius),
      setGround: (light, haze) => {
        this.explorer.groundLight = light;
        this.explorer.groundHaze = haze;
      },
    });
    this.orbitLinesEpochDays = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;
    this.rebuildOrbitLines();

    // Initial propagation at the clock's current time so the opening camera vantage is computed
    // against where the bodies actually are (not where they were at J2000)
    this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
    this.scene.updateMatrixWorld(true);
    this.selectBody('Mercury', 1800);

    // 8. Interaction
    this.setupInteraction();

    // 9. Start loop
    this.animate();
  }

  private setupLighting(): void {
    // Primary solar omnidirectional point light at the Sun (zero decay for crisp interplanetary sunlight)
    const sunLight = new THREE.PointLight(0xfffaed, 2.4, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = false;
    this.scene.add(sunLight);

    // Subtle cosmic ambient light for night-side planetary visibility
    const ambientLight = new THREE.AmbientLight(0x222638, 0.25);
    this.scene.add(ambientLight);
  }

  private setupBodies(): void {
    const bodies = CatalogueManager.getAllBodies();
    for (const def of bodies) {
      const bundle = PlanetFactory.createPlanet(def);
      this.scene.add(bundle.bodyGroup);
      this.planetBundles.set(def.name, bundle);
    }
  }

  public rebuildOrbitLines(): void {
    // Clear existing orbit lines
    while (this.orbitLinesGroup.children.length > 0) {
      const child = this.orbitLinesGroup.children[0];
      this.orbitLinesGroup.remove(child);
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }
    this.moonOrbitLines.clear();

    const bodies = CatalogueManager.getAllBodies();

    // 1. Heliocentric orbit lines (Planets, Dwarf Planets, Asteroids)
    for (const def of bodies) {
      if (def.category !== 'moon' && def.orderFromSun > 0) {
        const line = OrbitalTrails.createOrbitLine(def, this.transform, this.orbitLinesEpochDays);
        if (line) {
          this.orbitLinesGroup.add(line);
        }
      }
    }

    // 2. Parent-relative moon orbit lines
    for (const def of bodies) {
      if (def.category === 'moon' && def.parentId) {
        const parentDef = CatalogueManager.getParent(def);
        if (parentDef) {
          const line = OrbitalTrails.createMoonOrbitLine(def, parentDef, this.transform, this.orbitLinesEpochDays);
          if (line) {
            this.orbitLinesGroup.add(line);
            this.moonOrbitLines.set(def.name, line);
          }
        }
      }
    }
  }

  public setScaleMode(mode: ScaleMode): void {
    if (this.transform.mode === mode) return;
    this.transform.mode = mode;
    this.cameraRig.distanceModel = mode;

    // Update planetary mesh visual radii according to scale mode
    this.planetBundles.forEach((bundle) => {
      const r = this.transform.getVisualRadius(bundle.definition);
      bundle.visualRadius = r;
      // Rescale body mesh directly from unit sphere
      const flattening = bundle.definition.physical.flattening || 0;
      const polarScale = 1.0 - flattening;
      bundle.surfaceMesh.scale.set(r, r * polarScale, r);
      if (bundle.nightMesh) {
        bundle.nightMesh.scale.set(r, r * polarScale, r);
      }
      if (bundle.cloudMesh) {
        bundle.cloudMesh.scale.set(r, r, r);
      }
      if (bundle.atmosphereMesh) {
        bundle.atmosphereMesh.scale.set(r, r, r);
      }
      if (bundle.ringMesh) {
        bundle.ringMesh.scale.set(r, r, r);
        const ringMat = bundle.ringMesh.material as THREE.ShaderMaterial;
        if (ringMat.uniforms && ringMat.uniforms.saturnRadius) {
          ringMat.uniforms.saturnRadius.value = r;
        }
      }
      if (bundle.glowMeshes) {
        bundle.glowMeshes.forEach((g) => g.scale.set(r, r, r));
      }
    });

    this.rebuildOrbitLines();
  }

  // --- Surface view ("stand here and look up") ---

  private skySourceCache = new Map<string, SkyBodySource>();

  /** Sun, planets and moons with their true heliocentric positions for the surface sky. */
  private skySources(): SkyBodySource[] {
    const out: SkyBodySource[] = [];
    for (const def of CatalogueManager.getAllBodies()) {
      const isSun = def.orderFromSun === 0 || def.category === 'star';
      const st = this.latestPhysicalStates.get(def.name);
      if (!isSun && !st) continue;
      const bundle = this.planetBundles.get(def.name);
      let src = this.skySourceCache.get(def.name);
      if (!src) {
        const u = bundle ? (bundle.surfaceMesh.material as THREE.ShaderMaterial).uniforms : undefined;
        const ringU = bundle?.ringMesh ? (bundle.ringMesh.material as THREE.ShaderMaterial).uniforms : undefined;
        src = {
          name: def.name,
          radiusKm: def.physical.meanRadiusKm,
          positionKm: [0, 0, 0],
          map: (u?.map?.value ?? u?.dayMap?.value ?? null) as THREE.Texture | null,
          ringMap: (ringU?.ringMap?.value ?? null) as THREE.Texture | null,
          orientation: new THREE.Quaternion(),
          colorHex: def.physical.colorHex,
        };
        this.skySourceCache.set(def.name, src);
      }
      src.positionKm = isSun ? [0, 0, 0] : (st!.positionKm as [number, number, number]);
      if (bundle && src.orientation) bundle.surfaceMesh.getWorldQuaternion(src.orientation);
      out.push(src);
    }
    return out;
  }

  /** Hide everything that is not part of a surface sky (other globes are drawn by SkyBodies). */
  private setSurfaceSceneMode(on: boolean, body: string, skyRadius: number): void {
    if (on) {
      this.surfaceSaved = [];
      const hide = (o: THREE.Object3D | undefined) => {
        if (!o) return;
        this.surfaceSaved.push([o, o.visible]);
        o.visible = false;
      };
      for (const [name, b] of this.planetBundles) {
        if (name === body) {
          hide(b.atmosphereMesh);
          hide(b.cloudMesh);
        } else {
          hide(b.bodyGroup);
        }
      }
      hide(this.orbitLinesGroup);
      for (const l of this.moonOrbitLines.values()) hide(l);
      hide(this.asteroidBelt.mesh);
      // Stars twinkle only where there is air above you
      this.starfield.catalogueStars?.setScintillation(['Earth', 'Mars', 'Venus', 'Titan'].includes(body ?? '') ? 0.5 : 0.06);
      this.starfield.setGroundMode(true, skyRadius);
    } else {
      for (const [o, v] of this.surfaceSaved) o.visible = v;
      this.surfaceSaved = [];
      this.starfield.catalogueStars?.setScintillation(0.06);
      this.starfield.setGroundMode(false);
    }
  }

  /** Stand on the focused body (at the landmark if one is active, else below the camera). */
  public enterSurface(lat?: number, lon?: number, place?: string): boolean {
    const st = this.explorer.getStatus();
    const body = st.body;
    if (!body) return false;
    const lm = st.landmark && st.landmark.body === body ? st.landmark : null;
    const la = lat ?? lm?.lat ?? st.subCamera?.lat;
    const lo = lon ?? lm?.lon ?? st.subCamera?.lon;
    if (la === undefined || lo === undefined) return false;
    this.cameraRig.suspended = true;
    this.lens.setEffectScale(0.3);
    // A daylit sky is near white in HDR terms; only the Sun itself should bloom
    this.lens.setBloomThreshold(2.5);
    return this.surface.enter(body, la, lo, place ?? lm?.name ?? null);
  }

  /**
   * Stand on any solid body. With `facing`, the standing point is chosen so that body hangs about
   * 40° above the horizon, on the side the Sun lights (e.g. Saturn from Enceladus, Earth from the
   * Moon); it is computed from the real positions and the body's IAU orientation at this moment.
   */
  public enterSkyView(body: string, facing?: string): boolean {
    const b = this.planetBundles.get(body);
    if (!b || body === 'Sun') return false;
    if (this.surface.isActive()) this.exitSurface(false);
    const spot = this.standingPointFacing(body, facing) ?? { lat: 0, lon: 0 };
    this.selectedBody = b.definition;
    this.explorer.clearLandmark();
    this.cameraRig.surfaceMinAltitude = null;
    this.cameraRig.focusCinematic(b.bodyGroup, b.visualRadius, body, 150, undefined, b.definition.physical.meanRadiusKm);
    this.pendingSkyView = { body, lat: spot.lat, lon: spot.lon, place: facing ? `${facing} in the sky` : body };
    return true;
  }

  /** Body-fixed point from which `facing` stands ~40° above the horizon, towards the Sun's side. */
  private standingPointFacing(body: string, facing?: string): { lat: number; lon: number } | null {
    const b = this.planetBundles.get(body);
    const me = this.latestPhysicalStates.get(body);
    if (!b || !me) return null;
    const toLocal = b.surfaceMesh.getWorldQuaternion(new THREE.Quaternion()).invert();
    const dirTo = (km: number[]): THREE.Vector3 => {
      const rel: [number, number, number] = [km[0] - me.positionKm[0], km[1] - me.positionKm[1], km[2] - me.positionKm[2]];
      const t = CoordinateFrames.eclipticToThree(rel);
      return new THREE.Vector3(t[0], t[1], t[2]).normalize().applyQuaternion(toLocal);
    };
    const sun = dirTo([0, 0, 0]);
    const target = facing ? this.latestPhysicalStates.get(facing) : null;
    // Without a target, stand where the Sun is ~40° up (morning light, long shadows, sky colour)
    const t = target ? dirTo(target.positionKm as number[]) : sun.clone();
    let u = target
      ? sun.clone().sub(t.clone().multiplyScalar(sun.dot(t)))
      : new THREE.Vector3(0, 1, 0).cross(t).negate();
    if (u.lengthSq() < 1e-6) u = new THREE.Vector3(0, 1, 0).cross(t);
    u.normalize();
    const away = THREE.MathUtils.degToRad(50); // target at ~40° altitude
    const p = t.multiplyScalar(Math.cos(away)).add(u.multiplyScalar(Math.sin(away)));
    const ll = localToLatLon(p.x, p.y, p.z);
    return { lat: ll.lat, lon: ll.lon };
  }

  /** Leave the surface and rise back above it. */
  public exitSurface(fly: boolean = true): void {
    if (!this.surface.isActive()) return;
    const loc = this.surface.getLocation();
    this.surface.exit();
    this.lens.setBloomThreshold(null);
    this.cameraRig.suspended = false;
    this.cameraRig.syncFromCamera();
    if (fly && loc) {
      const b = this.planetBundles.get(loc.body);
      if (b) {
        const dir = this.explorer.surfaceDirection(
          { name: loc.body, bodyGroup: b.bodyGroup, surfaceMesh: b.surfaceMesh, visualRadius: b.visualRadius, radiusKm: b.definition.physical.meanRadiusKm },
          loc.lat,
          loc.lon
        );
        this.cameraRig.focusSurfacePoint(b.bodyGroup, b.visualRadius, dir, b.visualRadius * 0.12, 1800);
      }
    }
  }

  public setSurfaceMagnification(m: number): void {
    this.surface.setMagnification(m);
  }

  public setSurfaceAtmosphere(on: boolean): void {
    this.surface.setAtmosphere(on);
  }

  public setSurfaceTimeOfDay(what: TimeOfDay): boolean {
    return this.surface.setTimeOfDay(what);
  }

  public surfaceLookAt(name: string): void {
    this.surface.lookAt(name);
  }

  public resetSurfaceZoom(): void {
    this.surface.resetZoom();
  }

  /** Fly to a curated landmark (selects its body). */
  public flyToLandmark(id: string): Landmark | null {
    if (this.surface.isActive()) this.exitSurface(false);
    const lm = this.explorer.flyToLandmark(id);
    if (lm) {
      const def = this.planetBundles.get(lm.body)?.definition;
      if (def) this.selectedBody = def;
    }
    return lm;
  }

  public setExplorerDaylight(on: boolean): void {
    this.explorer.setDaylight(on);
  }

  public getExplorerStatus(): ExplorerStatus {
    return this.explorer.getStatus();
  }

  public setLensProfile(name: LensProfileName): void {
    this.lens.setProfile(name);
  }

  public setBloomGain(gain: number): void {
    this.lens.setBloomGain(gain);
  }

  public cycleLensProfile(): LensProfileName {
    return this.lens.cycleProfile();
  }

  public resetLook(): void {
    this.cameraRig.resetLook();
  }

  public toggleConstellations(): boolean {
    return this.starfield.toggleConstellations();
  }

  public toggleAsteroidBelt(): boolean {
    const next = !this.asteroidBelt.isVisible();
    this.asteroidBelt.setVisible(next);
    return next;
  }

  public toggleOrbits(): boolean {
    this.orbitLinesGroup.visible = !this.orbitLinesGroup.visible;
    return this.orbitLinesGroup.visible;
  }

  private pointerDownPos = { x: 0, y: 0 };
  private onPointerDown = (e: MouseEvent): void => {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  };

  private onCanvasMouseMove = (e: MouseEvent): void => {
    if (e.target !== this.renderer.domElement) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Check if hovering near Galactic Center / Sagittarius A*
    if (this.starfield?.externalGalaxy?.sagittariusAStar) {
      const gcWorldPos = this.starfield.externalGalaxy.getGalacticCenterWorldPosition();
      const screenPos = gcWorldPos.clone().project(this.cameraRig.camera);

      // Visible in front of camera
      if (screenPos.z >= -1.0 && screenPos.z <= 1.0) {
        const aspect = rect.width / Math.max(1, rect.height);
        const dx = (mx - screenPos.x) * aspect;
        const dy = (my - screenPos.y);
        const distNdc = Math.hypot(dx, dy);

        const camDistToGc = this.cameraRig.camera.position.distanceTo(gcWorldPos);
        const hoverThreshold = camDistToGc > 12000.0 ? 0.18 : 0.25;

        if (distNdc < hoverThreshold) {
          this.renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
    }

    if (this.renderer.domElement.style.cursor === 'pointer') {
      this.renderer.domElement.style.cursor = '';
    }
  };

  private onCanvasClick = (e: MouseEvent): void => {
    // Only handle clicks directly on the WebGL canvas
    if (e.target !== this.renderer.domElement) return;
    if (this.surface.isActive() || this.horizon?.active) return;

    // Ignore drags
    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (dist > 6) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Undo the lens warp so picking hits what is drawn under the cursor
    const aspect = rect.width / Math.max(1, rect.height);
    if (this.lens.isMasked(this.mouse.x, this.mouse.y, aspect)) return;
    const [sx, sy] = this.lens.outputToSceneNdc(this.mouse.x, this.mouse.y, aspect);
    this.mouse.set(sx, sy);

    // 1. Direct screen-space proximity click for Galactic Center / Sagittarius A*
    if (this.starfield?.externalGalaxy?.sagittariusAStar) {
      const gcWorldPos = this.starfield.externalGalaxy.getGalacticCenterWorldPosition();
      const screenPos = gcWorldPos.clone().project(this.cameraRig.camera);

      // If Galactic Center is within camera frustum in front of camera
      if (screenPos.z >= -1.0 && screenPos.z <= 1.0) {
        const aspect = rect.width / Math.max(1, rect.height);
        const dx = (this.mouse.x - screenPos.x) * aspect;
        const dy = (this.mouse.y - screenPos.y);
        const distNdc = Math.hypot(dx, dy);

        // At galactic or interstellar scales, clicking the central black hole or core navigates to it!
        const camDistToGc = this.cameraRig.camera.position.distanceTo(gcWorldPos);
        const clickThreshold = camDistToGc > 12000.0 ? 0.18 : 0.25;

        if (distNdc < clickThreshold) {
          this.selectBody('Sagittarius A*', 2200);
          return;
        }
      }
    }

    this.raycaster.setFromCamera(this.mouse, this.cameraRig.camera);

    const interactiveMeshes: THREE.Object3D[] = [];
    this.planetBundles.forEach((bundle) => {
      interactiveMeshes.push(bundle.surfaceMesh);
    });

    // Also include Sagittarius A* hit mesh and lensing volume
    if (this.starfield?.externalGalaxy?.sagittariusAStar) {
      if (this.starfield.externalGalaxy.sagittariusAStar.hitMesh) {
        interactiveMeshes.push(this.starfield.externalGalaxy.sagittariusAStar.hitMesh);
      }
      if (this.starfield.externalGalaxy.sagittariusAStar.boundingMesh) {
        interactiveMeshes.push(this.starfield.externalGalaxy.sagittariusAStar.boundingMesh);
      }
    }

    const intersects = this.raycaster.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;

      // Check if Sagittarius A* was intersected
      if (
        hit === this.starfield?.externalGalaxy?.sagittariusAStar?.hitMesh ||
        hit === this.starfield?.externalGalaxy?.sagittariusAStar?.boundingMesh ||
        hit.name.includes('sagittarius')
      ) {
        this.selectBody('Sagittarius A*', 2200);
        return;
      }

      for (const bundle of this.planetBundles.values()) {
        if (bundle.surfaceMesh === hit) {
          // Clicking the globe you are exploring must not yank the camera back to orbit
          if (bundle.definition.name === this.selectedBody.name && this.cameraRig.altitudeInRadii() < 4) break;
          this.selectBody(bundle.definition.name);
          break;
        }
      }
    }
  };

  private setupInteraction(): void {
    this.renderer.domElement.addEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.addEventListener('mousemove', this.onCanvasMouseMove);
    this.renderer.domElement.addEventListener('click', this.onCanvasClick);
    window.addEventListener('resize', this.onResize);
  }

  /** Heliocentric ecliptic position of a body by name, km. */
  public bodyPositionKm(name: string): [number, number, number] {
    if (name === 'Sagittarius A*') return SGR_A_ECLIPTIC_KM;
    return this.latestPhysicalStates.get(name)?.positionKm ?? [0, 0, 0];
  }

  private recordRoute(to: string): void {
    const from = this.selectedBody?.name ?? 'Sun';
    if (from === to && this.route) return;
    const fromKm = [...this.bodyPositionKm(from)] as [number, number, number];
    const toKm = [...this.bodyPositionKm(to)] as [number, number, number];
    this.route = {
      id: (this.route?.id ?? 0) + 1,
      from,
      to,
      fromKm,
      toKm,
      distanceKm: Math.hypot(toKm[0] - fromKm[0], toKm[1] - fromKm[1], toKm[2] - fromKm[2]),
    };
  }

  public selectBody(name: string, durationMs: number = 1800): void {
    if (this.surface?.isActive()) this.exitSurface(false);
    this.exitHorizonView(false);
    this.recordRoute(name === 'Sgr A*' || name === 'sagittarius_a_star' ? 'Sagittarius A*' : name);
    // The real distance sets the length of the journey: ~2.4 s to the Moon, ~5 s to Mars,
    // ~7 s to Neptune, 9 s to the galactic centre
    if (this.route && durationMs >= 1000) {
      durationMs = Math.max(durationMs, Math.min(9000, 2200 + 1400 * Math.log10(1 + this.route.distanceKm / 1e6)));
    }
    if (name === 'Sagittarius A*' || name === 'Sgr A*' || name === 'sagittarius_a_star') {
      const sgrDef = CatalogueManager.getSagittariusAStar();
      if (sgrDef) {
        this.selectedBody = sgrDef;
        const sgrGroup = this.starfield.externalGalaxy.sagittariusAStar.group;
        this.cameraRig.focusCinematic(sgrGroup, 180.0, sgrDef.name, durationMs);
        return;
      }
    }

    const bundle = this.planetBundles.get(name);
    if (!bundle) return;

    this.selectedBody = bundle.definition;
    this.explorer.clearLandmark();
    // The previous body's zoom floor must not clamp the new approach; the explorer sets the new one
    this.cameraRig.surfaceMinAltitude = null;
    this.cameraRig.focusCinematic(
      bundle.bodyGroup,
      bundle.visualRadius,
      bundle.definition.name,
      durationMs,
      undefined,
      bundle.definition.physical.meanRadiusKm
    );
  }

  public resetView(): void {
    if (this.surface?.isActive()) this.exitSurface(false);
    this.exitHorizonView(false);
    this.recordRoute('Sun');
    this.selectedBody = CatalogueManager.getBody('Sun') || CatalogueManager.getAllBodies()[0];
    this.explorer.clearLandmark();
    this.cameraRig.resetToOverview();
    this.cameraRig.focusedPhysicalRadiusKm = this.selectedBody.physical.meanRadiusKm;
  }

  private onResize = (): void => {
    if (!this.container) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.cameraRig.handleResize(w, h);
    this.lens.setSize(w, h);
  };

  /** Orient a body group to a body-fixed frame and spin its surface layers by W. */
  private applyBodyFrame(bundle: PlanetMeshBundle, frame: BodyFrame, cloudDriftRad: number = 0): void {
    this.tmpMatrix.makeBasis(
      this.tmpX.set(frame.xAxis[0], frame.xAxis[1], frame.xAxis[2]),
      this.tmpY.set(frame.yAxis[0], frame.yAxis[1], frame.yAxis[2]),
      this.tmpZ.set(frame.zAxis[0], frame.zAxis[1], frame.zAxis[2])
    );
    bundle.bodyGroup.quaternion.setFromRotationMatrix(this.tmpMatrix);
    bundle.surfaceMesh.rotation.y = frame.spinRad;
    if (bundle.nightMesh) bundle.nightMesh.rotation.y = frame.spinRad;
    if (bundle.cloudMesh) bundle.cloudMesh.rotation.y = frame.spinRad + cloudDriftRad;
  }

  /**
   * Fallback orientation for bodies without a published pole: tilt the spin axis away from
   * ecliptic north by the catalogue obliquity and spin with the catalogue rotation period.
   */
  private applyFallbackSpin(bundle: PlanetMeshBundle, days: number): void {
    const def = bundle.definition;
    bundle.bodyGroup.rotation.set(0, 0, THREE.MathUtils.degToRad(def.physical.axialTiltDeg || 0));
    const periodHours = def.physical.rotationPeriodHours || def.orbit.orbitalPeriodDays * 24.0 || 24.0;
    bundle.surfaceMesh.rotation.y = ((days * 24.0) / periodHours) * Math.PI * 2;
  }

  public propagateAll(elapsedDaysSinceJ2000: number): void {
    const bodies = CatalogueManager.getAllBodies();
    const parentPositionsRender: Map<string, [number, number, number]> = new Map();
    const d = elapsedDaysSinceJ2000;

    // Heliocentric bodies (Sun, Planets, Dwarf Planets, Asteroids)
    for (const body of bodies) {
      if (body.category === 'moon') continue; // Handled in second pass

      const bundle = this.planetBundles.get(body.name);
      if (!bundle) continue;

      if (body.orderFromSun === 0) {
        // Sun sits at center (0, 0, 0)
        bundle.bodyGroup.position.set(0, 0, 0);
        parentPositionsRender.set(body.id, [0, 0, 0]);
      } else {
        // Keplerian physical state propagation
        const state = KeplerSolver.propagate(body.orbit, d);
        this.latestPhysicalStates.set(body.name, state);

        // Transform physical position (km) to active render scale position
        const renderPos = this.transform.toRenderPosition(state.positionKm, body);
        bundle.bodyGroup.position.set(renderPos[0], renderPos[1], renderPos[2]);
        parentPositionsRender.set(body.id, renderPos);

        // Update Saturn planetary shadow on rings
        if (body.name === 'Saturn' && bundle.ringMesh) {
          const ringMat = bundle.ringMesh.material as THREE.ShaderMaterial;
          if (ringMat.uniforms && ringMat.uniforms.saturnCenter) {
            ringMat.uniforms.saturnCenter.value.set(renderPos[0], renderPos[1], renderPos[2]);
            ringMat.uniforms.saturnRadius.value = bundle.visualRadius;
          }
        }
      }

      // IAU pole + prime meridian orientation (falls back to obliquity + period)
      const frame = getBodyFrame(body.name, d);
      if (frame) {
        // Earth's clouds drift slowly relative to the surface (~1 revolution per 40 days)
        this.applyBodyFrame(bundle, frame, body.name === 'Earth' ? (d / 40.0) * Math.PI * 2 : 0);
      } else {
        this.applyFallbackSpin(bundle, d);
      }
    }

    // Natural satellites (Moons) relative to parent bodies
    for (const moon of bodies) {
      if (moon.category !== 'moon' || !moon.parentId) continue;

      const moonBundle = this.planetBundles.get(moon.name);
      if (!moonBundle) continue;

      const parentDef = CatalogueManager.getParent(moon);
      if (!parentDef) continue;

      const parentState = this.latestPhysicalStates.get(parentDef.name);
      const parentRenderPos = parentPositionsRender.get(parentDef.id) || [0, 0, 0];

      const parentGm = parentDef.physical.gmKm3S2 ??
        (parentDef.physical.massKg ? parentDef.physical.massKg * 6.6743e-20 : undefined);
      const moonGm = moon.physical.gmKm3S2 ??
        (moon.physical.massKg ? moon.physical.massKg * 6.6743e-20 : 0);
      const mu = (parentGm !== undefined) ? (parentGm + moonGm) : KeplerSolver.GM_SUN;

      const moonRelState = KeplerSolver.propagate(moon.orbit, d, mu);

      const parentPosKm = parentState?.positionKm || [0, 0, 0];
      const parentVelKmS = parentState?.velocityKmPerSec || [0, 0, 0];

      const moonHeliocentricPosKm: [number, number, number] = [
        parentPosKm[0] + moonRelState.positionKm[0],
        parentPosKm[1] + moonRelState.positionKm[1],
        parentPosKm[2] + moonRelState.positionKm[2],
      ];

      const moonHeliocentricVelKmS: [number, number, number] = [
        parentVelKmS[0] + moonRelState.velocityKmPerSec[0],
        parentVelKmS[1] + moonRelState.velocityKmPerSec[1],
        parentVelKmS[2] + moonRelState.velocityKmPerSec[2],
      ];

      this.latestPhysicalStates.set(moon.name, {
        positionKm: moonHeliocentricPosKm,
        velocityKmPerSec: moonHeliocentricVelKmS,
        distanceKm: Math.hypot(...moonHeliocentricPosKm),
        speedKmPerSec: Math.hypot(...moonHeliocentricVelKmS),
        trueAnomalyDeg: moonRelState.trueAnomalyDeg,
        eccentricAnomalyDeg: moonRelState.eccentricAnomalyDeg,
      });

      const renderPos = this.transform.toMoonRenderPosition(
        moonRelState.positionKm,
        moon,
        parentRenderPos,
        parentDef
      );
      moonBundle.bodyGroup.position.set(renderPos[0], renderPos[1], renderPos[2]);

      const moonOrbitLine = this.moonOrbitLines.get(moon.name);
      if (moonOrbitLine) {
        moonOrbitLine.position.set(parentRenderPos[0], parentRenderPos[1], parentRenderPos[2]);
      }

      // Tidally locked satellites keep longitude 0 facing the parent; Hyperion tumbles chaotically.
      if (moon.name === 'Hyperion') {
        this.applyFallbackSpin(moonBundle, d);
      } else {
        this.applyBodyFrame(moonBundle, getSynchronousFrame(moonRelState.positionKm, moonRelState.velocityKmPerSec));
      }
    }

    // Instanced Asteroid Belt
    this.asteroidBelt.updatePositions(d);

    // Osculating orbits drift slowly (secular rates, precession): refresh the guide lines when the
    // simulated date has moved far enough for the change to be visible.
    if (Math.abs(d - this.orbitLinesEpochDays) > 365.0) {
      this.orbitLinesEpochDays = d;
      this.rebuildOrbitLines();
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const deltaSec = Math.min(Math.max((now - this.lastFrameTime) * 0.001, 0.001), 0.1);
    this.lastFrameTime = now;
    this.clock.update(now);

    // Ephemerides take TDB; the clock keeps UTC
    const elapsedDaysSinceJ2000 = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;

    this.propagateAll(elapsedDaysSinceJ2000);

    // Dynamic solar shader time propagation (photosphere convection, corona streamers, magnetic loops)
    const sunBundle = this.planetBundles.get('Sun');
    if (sunBundle) {
      const timeSec = now * 0.001;
      const sunMat = sunBundle.surfaceMesh.material as THREE.ShaderMaterial;
      if (sunMat.uniforms?.time) {
        sunMat.uniforms.time.value = timeSec;
      }
      if (sunBundle.glowMeshes) {
        for (const glow of sunBundle.glowMeshes) {
          const gMat = glow.material as THREE.ShaderMaterial;
          if (gMat.uniforms?.time) {
            gMat.uniforms.time.value = timeSec;
          }
        }
      }
      if (sunBundle.prominencesGroup) {
        for (const child of sunBundle.prominencesGroup.children) {
          if (child instanceof THREE.Mesh) {
            const pMat = child.material as THREE.ShaderMaterial;
            if (pMat.uniforms?.time) {
              pMat.uniforms.time.value = timeSec;
            }
          }
        }
      }
    }

    this.cameraRig.update();
    this.surface.update();
    if (this.horizon?.active) this.horizon.update(this.cameraRig.camera, now * 0.001);

    const isBlackHole = this.selectedBody.name === 'Sagittarius A*';
    const focusedName = this.cameraRig.focusedObject && !isBlackHole ? this.selectedBody.name : null;
    this.explorer.update(focusedName, this.cameraRig.camera, this.renderer.domElement.height);
    if (this.pendingSkyView && this.explorer.getStatus().body === this.pendingSkyView.body) {
      const p = this.pendingSkyView;
      this.pendingSkyView = null;
      this.enterSurface(p.lat, p.lon, p.place);
    }

    // Over a map the lens character steps aside (clean, web-map look); it returns in space
    if (!this.surface.isActive()) {
      const alt = this.cameraRig.altitudeInRadii();
      this.lens.setEffectScale(isFinite(alt) ? THREE.MathUtils.smoothstep(alt, 0.3, 1.5) : 1);
    }
    this.labels.update(
      this.surface.isActive() ? this.surface.labelItems() : this.explorer.featureLabels(this.cameraRig.camera),
      this.cameraRig.camera,
      this.container.clientWidth,
      this.container.clientHeight
    );

    // Exposure: a sunlit world filling the frame washes the faint stars out, as on a real camera
    if (this.starfield.catalogueStars) {
      const rig = this.cameraRig;
      let fill = 0;
      if (rig.focusedObject && !this.surface.isActive()) {
        const d = rig.camera.position.distanceTo(rig.subjectAnchor);
        const ang = d > rig.focusedRadius ? Math.asin(rig.focusedRadius / d) : Math.PI / 2;
        fill = ang / THREE.MathUtils.degToRad(rig.camera.fov / 2);
      }
      const bh = this.selectedBody.name === 'Sagittarius A*';
      this.starfield.catalogueStars.setExposure(bh ? 1 : 1 - 0.7 * THREE.MathUtils.smoothstep(fill, 0.25, 1.1));
    }
    this.starfield.update(
      this.cameraRig.camera.position,
      deltaSec,
      this.cameraRig.getVelocity(),
      this.cameraRig.getZoomVelocity(),
      this.cameraRig.camera,
      this.renderer.domElement.height
    );

    this.lens.render(now * 0.001);

    // React only needs ~10 updates/s for the HUD readouts; re-rendering the HUD every few frames
    // at 120–144 Hz is wasted work
    if (this.onTelemetryUpdate && now - this.lastTelemetryTime >= SolarSystemScene.TELEMETRY_INTERVAL_MS) {
      this.lastTelemetryTime = now;
      this.dispatchTelemetry();
    }
  };

  private viewState: HudViewState = {
    quaternion: new THREE.Quaternion(),
    velocity: new THREE.Vector3(),
    toSun: new THREE.Vector3(),
    target: { x: 0, y: 0, r: 0, visible: false },
    transit: null,
    route: null,
    shipKm: [0, 0, 0],
    heading: [1, 0],
    bodies: [],
  };
  private route: FlightRoute | null = null;
  private horizon: HorizonView | null = null;

  /**
   * Pay every first-use cost before the user can move: wait for the textures, then compile every
   * shader (including the galaxy, the ray-traced black hole, its infall and the horizon world, which
   * are normally invisible) and upload the big textures. Without this, the first flight out to
   * Sgr A* froze for 2–3 s while the GPU driver compiled the 320-step geodesic shader.
   */
  public async warmUp(onProgress: (fraction: number, stage: string) => void): Promise<void> {
    const bh = this.starfield.externalGalaxy.sagittariusAStar;
    const diskTex = this.starfield.externalGalaxy.prepareAssets();
    this.horizon ??= new HorizonView(bh);

    // 1. Textures (0 → 70 %): follow the default loading manager until it drains (or 15 s)
    onProgress(0.02, 'Reading JPL ephemerides');
    await new Promise<void>((resolve) => {
      const started = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - started) / 15000);
        if ((diskTex.image && this.textureFraction >= 0.999) || t >= 1) return resolve();
        onProgress(0.05 + 0.6 * Math.max(t, this.textureFraction), 'Loading NASA surface maps');
        setTimeout(tick, 120);
      };
      tick();
    });

    // 2. Shaders (70 → 95 %)
    onProgress(0.72, 'Compiling the relativistic ray tracer');
    const galaxy = this.starfield.externalGalaxy.group;
    const hidden: THREE.Object3D[] = [];
    const reveal = (o: THREE.Object3D | null | undefined) => {
      o?.traverse((c) => {
        if (!c.visible) {
          c.visible = true;
          hidden.push(c);
        }
      });
    };
    reveal(galaxy);
    reveal(bh.group);
    reveal(this.starfield.milkyWay?.group);
    const camera = this.cameraRig.camera;
    // Programs depend on the output target (colour space, float type): compile for the half-float
    // target the lens pipeline renders the scene into, and for the screen (the clean lens)
    const previous = this.renderer.getRenderTarget();
    for (const target of [this.lens.sceneTarget(), null]) {
      this.renderer.setRenderTarget(target);
      try {
        await this.renderer.compileAsync(this.scene, camera);
      } catch {
        this.renderer.compile(this.scene, camera);
      }
    }
    this.renderer.setRenderTarget(previous);
    for (const o of hidden) o.visible = false;

    // 3. Upload the large textures now rather than on first sight
    onProgress(0.96, 'Resolving the Milky Way');
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      const mats = Array.isArray(m) ? m : m ? [m] : [];
      for (const mat of mats) {
        const rec = mat as unknown as Record<string, unknown>;
        for (const key of ['map', 'normalMap', 'emissiveMap']) {
          const t = rec[key];
          if (t instanceof THREE.Texture && t.image) this.renderer.initTexture(t);
        }
        const uniforms = (mat as THREE.ShaderMaterial).uniforms;
        if (uniforms) {
          for (const u of Object.values(uniforms)) {
            if (u && u.value instanceof THREE.Texture && u.value.image) this.renderer.initTexture(u.value);
          }
        }
      }
    });
    onProgress(1, 'Ready');
  }

  private textureFraction = 0;

  /** Stand on a world beside Sgr A* and watch it over the horizon (only from the black hole). */
  public enterHorizonView(): boolean {
    if (this.selectedBody.name !== 'Sagittarius A*' || this.cameraRig.getTransit()) return false;
    if (this.surface.isActive()) this.exitSurface(false);
    const bh = this.starfield.externalGalaxy.sagittariusAStar;
    this.horizon ??= new HorizonView(bh);
    this.cameraRig.suspended = true;
    this.horizon.enter(this.cameraRig.camera, this.renderer.domElement);
    return true;
  }

  public exitHorizonView(fly: boolean = true): void {
    if (!this.horizon?.active) return;
    this.horizon.exit();
    this.cameraRig.suspended = false;
    this.cameraRig.syncFromCamera();
    if (fly) this.cameraRig.focusCinematic(this.starfield.externalGalaxy.sagittariusAStar.group, 180.0, 'Sagittarius A*', 2600);
  }
  private tmpProject = new THREE.Vector3();
  private tmpLook = new THREE.Vector3();

  /**
   * Per-frame camera state for HUD instruments that animate at display rate (attitude scope,
   * target lock, transit bar). Returns the same object every call; read it, don't keep it.
   */
  public getViewState(): HudViewState {
    const cam = this.cameraRig.camera;
    const v = this.viewState;
    v.quaternion.copy(cam.quaternion);
    v.velocity.copy(this.cameraRig.getVelocity());
    v.toSun.copy(cam.position).negate();
    v.transit = this.cameraRig.getTransit();
    v.route = this.route;

    // Where the observer is in the real system: on the route during a flight, else at the subject
    const here = this.bodyPositionKm(this.selectedBody.name);
    if (v.transit && this.route && this.route.to === this.selectedBody.name) {
      const p = v.transit.progress;
      const e = p * p * p * (p * (p * 6 - 15) + 10);
      for (let i = 0; i < 3; i++) v.shipKm[i] = this.route.fromKm[i] + (here[i] - this.route.fromKm[i]) * e;
    } else {
      v.shipKm[0] = here[0];
      v.shipKm[1] = here[1];
      v.shipKm[2] = here[2];
    }
    cam.getWorldDirection(this.tmpLook);
    v.heading[0] = this.tmpLook.x;
    v.heading[1] = -this.tmpLook.z;

    if (v.bodies.length === 0) {
      for (const b of CatalogueManager.getAllBodies()) {
        if (b.category !== 'planet' && b.category !== 'dwarf_planet') continue;
        v.bodies.push({ name: b.name, x: 0, y: 0, aAU: b.orbit.semiMajorAxisAU, color: b.physical.colorHex || '#ffffff' });
      }
    }
    for (const b of v.bodies) {
      const st = this.latestPhysicalStates.get(b.name);
      if (st) {
        b.x = st.positionKm[0];
        b.y = st.positionKm[1];
      }
    }

    // Screen footprint of the focused body, for the lock brackets
    const anchor = this.cameraRig.subjectAnchor;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const dist = cam.position.distanceTo(anchor);
    this.tmpProject.copy(anchor).project(cam);
    const inFront = this.tmpProject.z < 1 && this.tmpProject.z > -1;
    const radius = this.cameraRig.focusedRadius;
    const angular = dist > radius ? Math.asin(Math.min(1, radius / dist)) : Math.PI / 2;
    const pxPerRad = h / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    v.target.x = (this.tmpProject.x * 0.5 + 0.5) * w;
    v.target.y = (-this.tmpProject.y * 0.5 + 0.5) * h;
    v.target.r = Math.tan(angular) * pxPerRad;
    v.target.visible = inFront && !this.surface.isActive() && this.cameraRig.focusedObject !== null;
    return v;
  }

  public jumpToScale(domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic' | 'sgr_a'): void {
    if (domain === 'sgr_a') {
      this.selectBody('Sagittarius A*');
      return;
    }
    this.cameraRig.jumpToScale(domain);
  }

  private dispatchTelemetry(): void {
    const selectedState = this.latestPhysicalStates.get(this.selectedBody.name);

    // Physical distance and speed directly from authoritative state
    let physicalDistKm = selectedState?.distanceKm || this.selectedBody.orbit.semiMajorAxisKm;
    let physicalSpeedKmS = selectedState?.speedKmPerSec || 0;

    // Authoritative black hole parameters for Sgr A*
    if (this.selectedBody.id === 'sagittarius_a_star' || this.selectedBody.name === 'Sagittarius A*') {
      physicalDistKm = 2.553e17; // ~26,990 ly (8.277 kpc) from Sun
      physicalSpeedKmS = 122400; // ~0.408 c at ISCO (innermost stable circular orbit)
    }

    // Camera look bearings
    const lookDir = new THREE.Vector3();
    this.cameraRig.camera.getWorldDirection(lookDir);
    const azimuth = Math.atan2(lookDir.x, lookDir.z) * THREE.MathUtils.RAD2DEG;
    const elevation = Math.asin(lookDir.y) * THREE.MathUtils.RAD2DEG;

    const scaleMetric = this.cameraRig.getObserverScaleMetric();
    const travelSpeed = this.cameraRig.getTravelSpeed();

    const targetInfo: SelectedTargetInfo = {
      id: this.selectedBody.id,
      name: this.selectedBody.name,
      category: this.selectedBody.category,
      parentId: this.selectedBody.parentId,
      parentName: this.selectedBody.parentName,
      distanceKm: physicalDistKm,
      apparentSpeedKmS: physicalSpeedKmS,
      radiusKm: this.selectedBody.physical.meanRadiusKm,
      orbitalPeriodDays: this.selectedBody.orbit.orbitalPeriodDays,
      axialTiltDeg: this.selectedBody.physical.axialTiltDeg || 0,
      colorHex: this.selectedBody.physical.colorHex || '#ffffff',
    };

    this.onTelemetryUpdate!({
      speedKmS: physicalSpeedKmS,
      lookAzimuthDeg: Math.round(azimuth),
      lookElevationDeg: Math.round(elevation),
      activeTarget: targetInfo,
      timeScale: this.clock.timeMultiplier,
      julianDate: this.clock.getJulianDate(),
      utcIso: this.clock.getIsoString(),
      scaleMode: this.transform.mode,
      isPaused: this.clock.isPaused,
      constellationsVisible: this.starfield.areConstellationsVisible(),
      asteroidBeltVisible: this.asteroidBelt.isVisible(),
      orbitsVisible: this.orbitLinesGroup.visible,
      observerScaleMetric: this.surface.isActive()
        ? (() => {
            const km = this.surface.getStatus()?.eyeHeightKm ?? 0;
            return `ON SURFACE · EYE ${km >= 1 ? `${km.toFixed(0)} KM` : `${(km * 1000).toFixed(0)} M`}`;
          })()
        : scaleMetric.formatted,
      observerDomain: scaleMetric.domain,
      travelSpeed: Math.round(travelSpeed),
      cameraDistance: Math.round(scaleMetric.distance),
      lensProfile: this.lens.profile.name,
      bloomGain: this.lens.getBloomGain(),
      explorer: this.explorer.getStatus(),
      surface: this.surface.getStatus(),
      horizonView: !!this.horizon?.active,
      horizon: this.horizon?.active ? this.horizon.getStatus() : null,
      lightFromEarthSec: (() => {
        if (this.selectedBody.name === 'Earth') return null;
        const a = this.bodyPositionKm('Earth');
        const b = this.bodyPositionKm(this.selectedBody.name);
        return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 299792.458;
      })(),
      route: this.route,
    });
  }

  public dispose(): void {
    this.isRunning = false;
    this.horizon?.dispose();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('mousemove', this.onCanvasMouseMove);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    this.surface.dispose();
    this.labels.dispose();
    this.cameraRig.dispose();
    this.explorer.dispose();
    this.lens.dispose();
    this.starfield.dispose();
    this.asteroidBelt.dispose();

    // Dispose all planetary geometries and materials
    this.planetBundles.forEach((bundle) => {
      bundle.surfaceMesh.geometry.dispose();
      (bundle.surfaceMesh.material as THREE.Material).dispose();
      if (bundle.nightMesh) {
        bundle.nightMesh.geometry.dispose();
        (bundle.nightMesh.material as THREE.Material).dispose();
      }
      if (bundle.cloudMesh) {
        bundle.cloudMesh.geometry.dispose();
        (bundle.cloudMesh.material as THREE.Material).dispose();
      }
      if (bundle.atmosphereMesh) {
        bundle.atmosphereMesh.geometry.dispose();
        (bundle.atmosphereMesh.material as THREE.Material).dispose();
      }
      if (bundle.ringMesh) {
        bundle.ringMesh.geometry.dispose();
        (bundle.ringMesh.material as THREE.Material).dispose();
      }
      if (bundle.glowMeshes) {
        bundle.glowMeshes.forEach((g) => {
          g.geometry.dispose();
          (g.material as THREE.Material).dispose();
        });
      }
      if (bundle.prominencesGroup) {
        bundle.prominencesGroup.children.forEach((c) => {
          if (c instanceof THREE.Mesh) {
            c.geometry.dispose();
            (c.material as THREE.Material).dispose();
          }
        });
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
