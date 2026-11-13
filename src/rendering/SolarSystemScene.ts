import { Avatar } from '../explorer/Avatar';
import { GroundCover } from '../flight/GroundCover';
import { ProceduralTerrain } from './ProceduralTerrain';
import { MOON_DIR, MOON_LIGHT, NIGHT_AIR } from './AerialPerspective';
import { emitVela } from '../companion/events';
import * as THREE from 'three';
import { installCompileGate, type CompileGate, type GateMode } from './CompileGate';
import { perf } from './Performance';
import { PhotorealEarth } from './PhotorealEarth';
import { SkyAtmosphere, atmosphereFor } from '../explorer/SkyAtmosphere';
import { EarthClouds } from '../flight/EarthClouds';
import { ProceduralCity } from '../explorer/ProceduralCity';
import { earthElevation } from '../explorer/Elevation';
import { bodyLatLonToLocal, bodyLocalToLatLon } from '../explorer/TileMath';
import type { Postcard } from '../data/Postcards';
import { settings, Settings } from '../ui/settings';
import { CatalogueManager } from '../data/CatalogueManager';
import { PlanetFactory, PlanetMeshBundle } from './PlanetFactory';
import { CameraRig } from '../navigation/CameraRig';
import { CelestialBodyDefinition, SelectedTargetInfo } from '../types/catalogue';
import { SimulationClock } from '../simulation/SimulationClock';
import { KeplerSolver, StateVector } from '../astronomy/KeplerSolver';
import { RenderSpaceTransform } from './RenderSpaceTransform';
import { SUN_WORLD } from './RenderOrigin';
import { COSMIC_SCALE, KM_PER_UNIT, UNITS_PER_AU } from './Scale';
import { NEBULAE } from './NebulaSky';
import { TexturePipeline } from './TexturePipeline';
import { JET_RESUME_KEY } from '../flight/worlds';
import { COMETS, Comet3D } from '../flight/Comets3D';
import { DEEP_TIME_SCENES, DeepTimeSky, type DeepTimeScene, type SkyLook } from '../explorer/DeepTime';
import { OrbitalTrails } from './OrbitalTrails';
import { Starfield } from './Starfield';
import { SmallBodies } from './SmallBodies';
import { BodyMarkers, MarkerBody } from './BodyMarkers';
import { Showcase, ShowcaseBody, ShowcaseSubject } from './Showcase';
import { LensPipeline, LensProfileName } from './LensPipeline';
import { HorizonView } from './HorizonView';
import { NebulaStage } from './NebulaStage';
import { PlanetaryExplorer, ExplorerStatus } from '../explorer/PlanetaryExplorer';
import { SurfaceObserver, SurfaceStatus } from '../explorer/SurfaceObserver';
import { ScreenLabels } from '../explorer/ScreenLabels';
import { SkyBodySource } from '../explorer/SkyBodies';
import { TimeOfDay, sunElevationAt, findTimeOfDay, findMorningSun } from '../explorer/SkyAstronomy';
import { Landmark, getLandmark } from '../explorer/Landmarks';
import { localToLatLon } from '../explorer/TileMath';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';
import { BodyFrame, getBodyFrame, getSynchronousFrame } from '../astronomy/BodyOrientation';
import { JetController } from '../flight/JetController';
import { EarthMaterial } from './EarthMaterial';
import {
  ComparisonPropKind,
  createSpaceEnvironmentMap,
  GltfModelBank,
  SpacecraftLayerManager,
  SPACECRAFT_LAYER,
} from './SpacecraftFactory';
import { ParentResolver } from '../astronomy/DynamoTrajectory';

export interface TelemetryData {
  speedKmS: number;
  lookAzimuthDeg: number;
  lookElevationDeg: number;
  activeTarget: SelectedTargetInfo | null;
  timeScale: number;
  julianDate: number;
  utcIso: string;
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
  /** Visiting a nebula: which one, and a line about it. */
  nebula: { name: string; title: string; blurb: string } | null;
  /** In the horizon view: distance from the hole (r_s) and whether still on the shore. */
  horizon: { rRs: number; onShore: boolean; timelapse?: boolean } | null;
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
  private hiResCheckMs = 0;
  private hiResTmp = new THREE.Vector3();
  private orbitLinesGroup: THREE.Group = new THREE.Group();
  private moonOrbitLines: Map<string, THREE.Line> = new Map();
  private latestPhysicalStates: Map<string, StateVector> = new Map();
  /** A surface view requested for a body that is not focused yet (entered once the explorer has it). */
  private pendingSkyView: { body: string; lat: number; lon: number; place: string } | null = null;
  /** A deep-time scene to show once standing on its world (src/explorer/DeepTime). */
  private pendingDeepTime: DeepTimeScene | null = null;
  /** The star field and Milky Way as the deep-time scene wants them, or null. */
  private deepLook: SkyLook | null = null;
  /** The deep-time sky while flying the jet (its era), and which era it shows. */
  private jetDeep = new DeepTimeSky();
  private jetDeepId: string | null = null;
  /** Comets to fly to (jet mode only), built the first time the jet flies. */
  private comets: Comet3D[] = [];
  private jetFrame = { east: new THREE.Vector3(), north: new THREE.Vector3(), up: new THREE.Vector3() };
  private pendingPostcard: Postcard | null = null;
  private pendingHorizonPostcard = false;
  private unsubscribeSettings: (() => void) | null = null;
  private nebulaStages = new Map<string, NebulaStage>();
  private jetNebulaShown = false;
  private visiting: NebulaStage | null = null;
  /** How far out the nebulae you can visit stand (the same size to the eye as on the sky). */
  public static readonly NEBULA_DISTANCE = 4000 * COSMIC_SCALE;
  private orbitLinesEpochDays: number = 0;

  // Scratch objects reused every frame
  private tmpMatrix = new THREE.Matrix4();
  private tmpX = new THREE.Vector3();
  private tmpY = new THREE.Vector3();
  private tmpZ = new THREE.Vector3();

  // GPU Background & Asteroid Belt
  public starfield: Starfield;
  public asteroidBelt: SmallBodies;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();

  private isRunning: boolean = true;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = performance.now();

  // Observation-camera optics (bloom, lens, grain, motion blur)
  public lens: LensPipeline;

  // Google Maps–style surface imagery streaming and landmark navigation
  public explorer: PlanetaryExplorer;
  /** Google Photorealistic 3D Tiles on Earth (when a Maps key is configured). */
  private photoreal: PhotorealEarth | null = null;
  /**
   * The sky while flying in Earth's air: the same physical (Rayleigh and Mie) dome as the ground
   * view, so the jet sees real twilight, a blue sky over a hazy horizon and stars only at night.
   * The orbit-scale atmosphere shell takes over higher up.
   */
  private jetSky: SkyAtmosphere | null = null;
  private jetSkyFrame = { east: new THREE.Vector3(), north: new THREE.Vector3(), up: new THREE.Vector3() };
  /** Clouds from the live weather, over Earth while flying low (see EarthClouds). */
  private earthClouds: EarthClouds | null = null;
  /** OpenStreetMap buildings where Google has no 3D (pilot regions; see ProceduralCity). */
  private city: ProceduralCity | null = null;
  public surface: SurfaceObserver;
  /** Jet mode: fly the SX-1 through the system (src/flight). */
  public jet: JetController = new JetController();
  private jetSaved: { rate: number; paused: boolean; fov: number; orbits: boolean; constellations: boolean } | null = null;
  private jetLastCam = new THREE.Vector3();
  private labels: ScreenLabels;
  /** Rings and names for worlds too small to see at true scale. */
  private markers: BodyMarkers;
  /** From Settings: world labels and markers on/off. */
  private userMarkers = true;
  private markerBodies: MarkerBody[] = [];
  private tmpMarker = new THREE.Vector3();
  private perceivedVelocity = new THREE.Vector3();
  /**
   * The Sun as a point of light. From the outer system its true disk is under a pixel wide, but
   * it is still by far the brightest thing in the sky: a glint takes over as the disk shrinks.
   */
  private sunGlint = (() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: 20 }, uAlpha: { value: 0 } },
      vertexShader: `
        uniform float uSize;
        void main() {
          gl_PointSize = uSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float r = length(c);
          float core = exp(-r * r * 160.0) * 3.0;
          float halo = exp(-r * r * 18.0) * 0.5;
          float spikes = (exp(-abs(c.x) * 70.0) + exp(-abs(c.y) * 70.0)) * smoothstep(0.5, 0.0, r) * 0.35;
          vec3 col = vec3(1.0, 0.93, 0.8) * (core + halo + spikes);
          gl_FragColor = vec4(col * uAlpha, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.name = 'sun_glint';
    pts.frustumCulled = false;
    pts.renderOrder = 5;
    return pts;
  })();
  private surfaceSaved: Array<[THREE.Object3D, boolean]> = [];

  // Selection
  public selectedBody: CelestialBodyDefinition;
  /** Camera distance of the opening view (14 AU: Mercury out to Saturn). */
  public static readonly OPENING_DISTANCE = 14 * UNITS_PER_AU;
  private spacecraftLayer!: SpacecraftLayerManager;
  private jetRendezvousToken = 0;
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
      // Edge smoothing of the canvas itself: costly on weak GPUs (the picture is drawn through the
      // lens pipeline's own targets anyway)
      antialias: perf.tier === 'high',
      powerPreference: 'high-performance',
    });
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    this.renderer.setSize(initialWidth, initialHeight);
    this.renderer.setPixelRatio(perf.pixelRatio(2));
    // A lost GPU context leaves the canvas black while the HUD runs on: say so in the console
    // (three.js restores the context and re-uploads everything when the browser allows it)
    this.renderer.domElement.addEventListener('webglcontextlost', () => console.warn('[Solaris] WebGL context lost: the GPU reset or ran out of memory'));
    this.renderer.domElement.addEventListener('webglcontextrestored', () => console.warn('[Solaris] WebGL context restored'));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    // Only the jet's sunlight casts shadows (its own scene); on from the start so every shader
    // is compiled once, in the warm-up, with the same settings
    this.renderer.shadowMap.enabled = perf.settings.shadowMap > 0;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.gate = installCompileGate(this.renderer);

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

    // 4. Lighting & Space HDR PBR Environment
    this.setupLighting();
    GltfModelBank.init(this.renderer);
    this.scene.environment = createSpaceEnvironmentMap(this.renderer);

    // 5. Starfield background (41,394 real Hipparcos stars + IAU Constellations)
    this.starfield = new Starfield();
    this.scene.add(this.starfield.group);

    // 6. Real small bodies: asteroids, Trojans, Kuiper belt, comets and meteoroid streams
    this.asteroidBelt = new SmallBodies();
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
        atmosphereMesh: b.atmosphereMesh,
        baseMap: (() => {
          const u = (b.surfaceMesh.material as THREE.ShaderMaterial).uniforms;
          return (u?.map?.value ?? u?.dayMap?.value ?? null) as THREE.Texture | null;
        })(),
        visualRadius: b.visualRadius,
        radiusKm: b.definition.physical.meanRadiusKm,
      };
    });
    this.explorer.setMaxAnisotropy(this.renderer.capabilities.getMaxAnisotropy());
    // 8K maps only on capable GPUs (each is ~170 MB of video memory and a long upload)
    TexturePipeline.getInstance().setMaxTextureSize(perf.settings.hiRes8k ? this.renderer.capabilities.maxTextureSize : 4096);
    // The adaptive resolution: redraw the targets at the new size when the governor steps
    perf.onChange(() => {
      this.renderer.setPixelRatio(perf.pixelRatio(2));
      this.lens.refreshResolution();
    });
    this.planetBundles.get('Sun')?.bodyGroup.add(this.sunGlint);
    // Real 3D Earth: Google's photorealistic tiles, where a key is configured (.env.local)
    // The key comes from .env.local only (gitignored): never write it into source
    const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    const earthBundle = this.planetBundles.get('Earth');
    if (mapsKey && earthBundle) {
      this.photoreal = new PhotorealEarth(mapsKey, this.container);
      this.photoreal.attach(earthBundle.surfaceMesh, 1 - (earthBundle.definition.physical.flattening ?? 0));
      const u = (earthBundle.surfaceMesh.material as THREE.ShaderMaterial).uniforms;
      this.photoreal.setGlobeMaps((u?.dayMap?.value as THREE.Texture) ?? null, (u?.nightMap?.value as THREE.Texture) ?? null);
    }
    this.markers = new BodyMarkers(container, (name) => this.selectBody(name));
    for (const b of this.planetBundles.values()) {
      this.markerBodies.push({ definition: b.definition, object: b.bodyGroup, radius: b.visualRadius });
    }
    this.ensureCometsSpawned();
    this.spacecraftLayer = new SpacecraftLayerManager({
      scene: this.scene,
      renderer: this.renderer,
      container,
      onPickSpacecraft: (name) => this.selectBody(name),
    });
    // The spacecraft's own layer: seen by the main camera (and clicks), not by the jet's
    // reflection cube, displays or mirrors (see SPACECRAFT_LAYER)
    this.cameraRig.camera.layers.enable(SPACECRAFT_LAYER);
    this.raycaster.layers.enable(SPACECRAFT_LAYER);
    this.labels = new ScreenLabels(container, (id) => {
      if (id.startsWith('sky:')) this.surface.lookAt(id.slice(4));
      else this.flyToLandmark(id);
    });
    this.scene.add(this.jetDeep.group);
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
        this.propagateAll(d);
      },
      setSceneMode: (on, body, skyRadius) => this.setSurfaceSceneMode(on, body, skyRadius),
      setGround: (light, haze) => {
        this.explorer.groundLight = light;
        this.explorer.groundHaze = haze;
      },
      setLandscape: (on) => {
        this.explorer.hideGround = on;
      },
      setSkyLook: (look) => {
        this.deepLook = look;
        this.starfield.milkyWay.group.visible = look ? look.milkyWay : true;
      },
    });
    this.orbitLinesEpochDays = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;
    this.rebuildOrbitLines();

    // Initial propagation at the clock's current time so the opening camera vantage is computed
    // against where the bodies actually are (not where they were at J2000)
    this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
    this.scene.updateMatrixWorld(true);
    // The opening shot: the inner Solar System out to Saturn, nothing selected (you choose)
    this.selectedBody = CatalogueManager.getBody('Sun') || this.selectedBody;
    this.cameraRig.resetToOverview(120, SolarSystemScene.OPENING_DISTANCE);
    this.cameraRig.focusedPhysicalRadiusKm = this.selectedBody.physical.meanRadiusKm;

    // 8. Interaction
    this.setupInteraction();

    // Settings that live in the scene (labels, nebulae, idle motion)
    const apply = (st: Settings) => {
      this.userMarkers = st.markers;
      this.starfield.nebulae.setUserGain(st.nebulae);
      this.cameraRig.enableIdleDrift = st.idleMotion;
      this.surface.idleEnabled = st.idleMotion;
      HorizonView.idleEnabled = st.idleMotion;
    };
    apply(settings.get());
    this.unsubscribeSettings = settings.subscribe(apply);

    // 9. Start loop
    this.animate();
    // Development handle for inspecting the scene from the console
    if (import.meta.env.DEV) (window as unknown as { __solaris?: SolarSystemScene }).__solaris = this;
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
    const bodies = CatalogueManager.getSceneBodies();
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

    const bodies = CatalogueManager.getSceneBodies();

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
          const line = OrbitalTrails.createMoonOrbitLine(def, this.transform, this.orbitLinesEpochDays, def.minor ? 160 : 256, def.minor ? 0.12 : 0.22);
          if (line) {
            this.orbitLinesGroup.add(line);
            this.moonOrbitLines.set(def.name, line);
          }
        }
      }
    }
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
  public enterSurface(
    lat?: number,
    lon?: number,
    place?: string,
    altKm?: number,
    headingDeg?: number,
    pitchDeg?: number
  ): boolean {
    const st = this.explorer.getStatus();
    const sel = this.selectedBody?.name;
    const body = (sel && sel !== 'Sun' && sel !== 'Sagittarius A*' ? sel : null) ?? st.body;
    if (!body) return false;
    const curLm = this.explorer.getLandmark();
    const lm = (curLm && curLm.body === body ? curLm : null) ?? (st.landmark && st.landmark.body === body ? st.landmark : null);
    const la = lat ?? lm?.vantageLat ?? lm?.lat ?? st.subCamera?.lat;
    const lo = lon ?? lm?.vantageLon ?? lm?.lon ?? st.subCamera?.lon;
    if (la === undefined || lo === undefined) return false;
    if (body === 'Earth' && !this.pendingPostcard && !this.pendingDeepTime) {
      const d0 = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;
      const sunAlt = sunElevationAt('Earth', la, lo, d0);
      if (sunAlt !== null && sunAlt < 22) {
        const dNoon = findTimeOfDay('Earth', la, lo, d0, 'noon');
        if (dNoon !== null) {
          const dDay = dNoon - 0.06;
          const jdUtc = dDay + SimulationClock.J2000_JD - 69.184 / 86400;
          this.clock.setUtcMs((jdUtc - 2440587.5) * 86400000);
          this.propagateAll(dDay);
        }
      }
    } else if (body !== 'Earth' && lm && !this.pendingPostcard && !this.pendingDeepTime && Math.abs(la - (lm.vantageLat ?? lm.lat)) < 0.01 && Math.abs(lo - (lm.vantageLon ?? lm.lon)) < 0.01) {
      // Landing at a landmark on another world: in the dark there is nothing to see of the ground,
      // so the clock moves on to that place's next morning, the Sun ~25° up (long shadows show the
      // relief). The sky is still the real one for that moment
      const d0 = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;
      const sunAlt = sunElevationAt(body, la, lo, d0);
      if (sunAlt !== null && sunAlt < 12) {
        const dDay = findMorningSun(body, la, lo, d0, lm.sunAltitudeDeg ?? 25);
        if (dDay !== null) {
          const jdUtc = dDay + SimulationClock.J2000_JD - 69.184 / 86400;
          this.clock.setUtcMs((jdUtc - 2440587.5) * 86400000);
          this.propagateAll(dDay);
        }
      }
    }
    this.cameraRig.suspended = true;
    this.lens.setEffectScale(0.3);
    // A daylit sky is near white in HDR terms; only the Sun itself should bloom
    this.lens.setBloomThreshold(2.5);
    const ok = this.surface.enter(
      body,
      la,
      lo,
      place ?? lm?.name ?? null,
      altKm ?? lm?.vantageAltKm,
      headingDeg ?? lm?.viewHeadingDeg,
      pitchDeg ?? lm?.viewPitchDeg
    );
    return ok;
  }

  /**
   * Stand on any solid body. With `facing`, the standing point is chosen so that body hangs about
   * 40° above the horizon, on the side the Sun lights (e.g. Saturn from Enceladus, Earth from the
   * Moon); it is computed from the real positions and the body's IAU orientation at this moment.
   */
  public enterSkyView(body: string, facing?: string): boolean {
    this.endNebulaVisit();
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

  /**
   * Fly out to a nebula: the 3D version standing where its picture hangs on the sky. Returns false
   * until its picture has loaded.
   */
  /** The 3D stage of a nebula, built the first time it is wanted (null until its picture loads). */
  private nebulaStage(name: string): NebulaStage | null {
    let stage = this.nebulaStages.get(name);
    if (stage) return stage;
    const pic = this.starfield.nebulae.picture(name);
    if (!pic) return null;
    stage = new NebulaStage(name, pic.tex, pic.aspect, SolarSystemScene.NEBULA_DISTANCE);
    this.scene.add(stage.group);
    this.nebulaStages.set(name, stage);
    return stage;
  }

  public visitNebula(name: string): boolean {
    const pic = this.starfield.nebulae.picture(name);
    if (!pic) return false;
    if (this.surface.isActive()) this.exitSurface(false);
    this.exitHorizonView(false);
    if (this.showcase.active) this.stopShowcase();
    let stage = this.nebulaStages.get(name);
    if (!stage) {
      stage = new NebulaStage(name, pic.tex, pic.aspect, SolarSystemScene.NEBULA_DISTANCE);
      this.scene.add(stage.group);
      this.nebulaStages.set(name, stage);
    }
    if (this.visiting && this.visiting !== stage) this.visiting.setVisible(false);
    this.visiting = stage;
    stage.setVisible(true);
    emitVela('nebula', name);
    this.starfield.nebulae.hide(name);
    this.explorer.clearLandmark();
    this.cameraRig.focusCinematic(stage.group, stage.radius * (stage.spec.frame ?? 1), `nebula:${stage.spec.name}`, 3600);
    return true;
  }

  private endNebulaVisit(): void {
    if (!this.visiting) return;
    this.visiting.setVisible(false);
    this.visiting = null;
    emitVela('nebula', null);
    this.starfield.nebulae.hide(null);
  }

  /** Stand under the sky of a future era (src/explorer/DeepTime): fly to its world, then show it. */
  public enterDeepTime(id: string): boolean {
    const d = DEEP_TIME_SCENES.find((x) => x.id === id);
    if (!d) return false;
    // The last scene is the black hole: stand on the shore of the world beside it
    if (d.body === 'Sagittarius A*') {
      if (this.surface.isActive()) this.exitSurface(false);
      if (this.showcase.active) this.stopShowcase();
      if (this.horizon?.active) return true;
      if (this.selectedBody.name !== 'Sagittarius A*') this.jumpToScale('sgr_a');
      this.pendingHorizonPostcard = true;
      return true;
    }
    const b = this.planetBundles.get(d.body);
    if (!b) return false;
    this.endNebulaVisit();
    if (this.horizon?.active) this.exitHorizonView(false);
    if (this.showcase.active) this.stopShowcase();
    // Already standing on that world: change the sky in place
    if (this.surface.isActive() && this.surface.getLocation()?.body === d.body && !d.facing && d.lat !== undefined) {
      this.exitSurface(false);
    } else if (this.surface.isActive()) {
      this.exitSurface(false);
    }
    const spot = d.facing ? this.standingPointFacing(d.body, d.facing) ?? { lat: 0, lon: 0 } : { lat: d.lat ?? 0, lon: d.lon ?? 0 };
    this.selectedBody = b.definition;
    this.explorer.clearLandmark();
    this.cameraRig.surfaceMinAltitude = null;
    this.cameraRig.focusCinematic(b.bodyGroup, b.visualRadius, d.body, 150, undefined, b.definition.physical.meanRadiusKm);
    this.pendingSkyView = { body: d.body, lat: spot.lat, lon: spot.lon, place: d.place };
    this.pendingDeepTime = d;
    return true;
  }

  /** Flying under another era's sky: its phenomena around the jet, the star field and Sun to match. */
  private updateJetEra(dt: number): void {
    const id = this.jet.active ? this.jet.era : null;
    if (id !== this.jetDeepId) {
      this.jetDeepId = id;
      // An era is a view from the ground of one world (the look-up view), not a sky over open
      // space: in flight it is a destination; landing there shows it (see onLookUp)
      this.jetDeep.setScene(null);
      const look = this.jetDeep.look();
      this.deepLook = look;
      this.starfield.milkyWay.group.visible = look ? look.milkyWay : true;
      const sun = this.planetBundles.get('Sun');
      if (sun) sun.bodyGroup.visible = !(look?.hideSun);
      const saturn = this.planetBundles.get('Saturn');
      if (saturn?.ringMesh) saturn.ringMesh.visible = !(look?.hideRings);
      this.jet.setCometStorm(false);
    }
    if (!id) return;
    const cam = this.cameraRig.camera;
    const f = this.jetFrame;
    const sunDir = cam.position.clone().negate().normalize();
    // Far beyond the world you fly at, well inside the camera's far plane: planets in front cover it
    this.jetDeep.update(dt, cam, f, sunDir, 1.1e6);
  }

  /** Back to today's sky where you stand. */
  public exitDeepTime(): void {
    if (!this.surface.deepTimeScene()) return;
    this.surface.setDeepTime(null);
    this.surface.setAtmosphere(true);
    this.clock.setUtcMs(Date.now());
  }

  /** Go into a postcard: the same world, place, moment and framing as its picture. */
  public openPostcard(c: Postcard): boolean {
    this.endNebulaVisit();
    // The black hole: fly out and stand on the shore of the world beside it
    if (c.body === 'Sagittarius A*') {
      if (this.surface.isActive()) this.exitSurface(false);
      if (this.showcase.active) this.stopShowcase();
      if (this.horizon?.active) return true;
      if (this.selectedBody.name !== 'Sagittarius A*') this.jumpToScale('sgr_a');
      this.pendingHorizonPostcard = true;
      return true;
    }
    const b = this.planetBundles.get(c.body);
    if (!b) return false;
    if (this.horizon?.active) this.exitHorizonView(false);
    if (this.surface.isActive()) this.exitSurface(false);
    if (this.showcase.active) this.stopShowcase();
    this.clock.setUtcMs(Date.parse(c.utc));
    this.selectedBody = b.definition;
    this.explorer.clearLandmark();
    this.cameraRig.surfaceMinAltitude = null;
    this.cameraRig.focusCinematic(b.bodyGroup, b.visualRadius, c.body, 150, undefined, b.definition.physical.meanRadiusKm);
    this.pendingSkyView = { body: c.body, lat: c.lat, lon: c.lon, place: c.place };
    this.pendingPostcard = c;
    emitVela('postcard', c.id);
    return true;
  }

  public selectedBodyName(): string {
    return this.selectedBody.name;
  }

  /** Where you are, as a postcard you could return to (standing on a world, or at the black hole). */
  public currentPostcardView(): Postcard | null {
    const utc = new Date(this.clock.getUtcMs()).toISOString();
    if (this.horizon?.active) {
      return { id: 'mine', title: 'Sagittarius A*', place: 'Beside the black hole', caption: '', body: 'Sagittarius A*', lat: 0, lon: 0, utc, heading: 0, pitch: 0, fov: 52, magnification: 1 };
    }
    const s = this.surface.getStatus();
    if (!s) return null;
    return {
      id: 'mine', title: s.place ?? s.body, place: s.body, caption: '', body: s.body, lat: s.lat, lon: s.lon, utc,
      heading: s.headingDeg, pitch: s.pitchDeg, fov: s.fovDeg, magnification: s.magnification, atmosphere: s.atmosphereOn,
    };
  }

  /** The frame as it is on screen now (no interface), as a JPEG. */
  public captureShot(quality = 0.92): Promise<Blob | null> {
    this.renderFrame(performance.now() * 0.001);
    return new Promise((resolve) => this.renderer.domElement.toBlob((b) => resolve(b), 'image/jpeg', quality));
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
    if (this.landedFrom) {
      this.landedFrom = null;
      this.onJetLanding?.(null);
    }
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
    this.rememberLens();
  }

  private rememberLens(): void {
    try {
      localStorage.setItem(LensPipeline.STORAGE_KEY, this.lens.profile.name);
    } catch {
      /* storage blocked */
    }
  }

  public setBloomGain(gain: number): void {
    this.lens.setBloomGain(gain);
  }

  public cycleLensProfile(): LensProfileName {
    const name = this.lens.cycleProfile();
    this.rememberLens();
    return name;
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
    if (this.surface.isActive() || this.jet.active) return false;
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
        const hoverThreshold = camDistToGc > 12000.0 * COSMIC_SCALE ? 0.18 : 0.25;

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
    if (this.surface.isActive() || this.horizon?.active || this.showcase.active || this.jet.active) return;

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
        const clickThreshold = camDistToGc > 12000.0 * COSMIC_SCALE ? 0.18 : 0.25;

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
    const scMeshOwner = new Map<THREE.Object3D, string>();
    if (this.spacecraftLayer) {
      for (const sc of this.spacecraftLayer.getBundles()) {
        if (sc.lodTier <= 2 && sc.bodyGroup.visible) {
          sc.modelRoot.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              interactiveMeshes.push(obj);
              scMeshOwner.set(obj, sc.entry.name);
            }
          });
        }
      }
    }

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

      const scPicked = scMeshOwner.get(hit);
      if (scPicked) {
        this.selectBody(scPicked);
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
    const core = this.latestPhysicalStates.get(name)?.positionKm;
    if (core) return core;
    const sc = this.spacecraftLayer?.getBundle(name);
    if (sc?.lastEval) {
      const p = sc.bodyGroup.position;
      return CoordinateFrames.threeToEcliptic([p.x * KM_PER_UNIT, p.y * KM_PER_UNIT, p.z * KM_PER_UNIT]);
    }
    return [0, 0, 0];
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
    if (this.showcase.active) this.stopShowcase();
    this.endNebulaVisit();
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
    if (!bundle) {
      const sc = this.spacecraftLayer?.getBundle(name);
      if (sc) {
        this.selectedBody = sc.definition;
        this.explorer.clearLandmark();
        this.cameraRig.surfaceMinAltitude = null;
        this.updateSpacecraftAndComets(0);
        this.cameraRig.focusCinematic(
          sc.bodyGroup,
          sc.visualRadius,
          sc.entry.name,
          durationMs,
          undefined,
          sc.definition.physical.meanRadiusKm
        );
        return;
      }
      const comet = this.comets.find((c) => c.spec.name.toLowerCase() === name.toLowerCase());
      const def = CatalogueManager.getSagittariusAStar();
      if (comet && def) {
        comet.group.visible = true;
        comet.update(0, this.cameraRig.camera);
        this.selectedBody = { ...def, id: `comet:${comet.spec.name}`, name: comet.spec.name, category: 'asteroid' };
        this.explorer.clearLandmark();
        this.cameraRig.surfaceMinAltitude = null;
        this.cameraRig.focusCinematic(comet.group, Math.max(0.08, comet.radius * 0.08), comet.spec.name, durationMs);
      }
      return;
    }

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
    this.endNebulaVisit();
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
    const bodies = CatalogueManager.getSceneBodies();
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
        const renderPos = this.transform.toRenderPosition(state.positionKm);
        bundle.bodyGroup.position.set(renderPos[0], renderPos[1], renderPos[2]);
        parentPositionsRender.set(body.id, renderPos);

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

      const renderPos = this.transform.toMoonRenderPosition(moonRelState.positionKm, parentRenderPos, parentDef.physical.meanRadiusKm);
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
    if (!document.hidden) perf.frame(now - this.lastFrameTime);
    this.lastFrameTime = now;
    this.clock.update(now);

    // Ephemerides take TDB; the clock keeps UTC
    const elapsedDaysSinceJ2000 = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;

    this.propagateAll(elapsedDaysSinceJ2000);

    // Hurricanes and typhoons in season on Earth's cloud layer
    const earthClouds = this.planetBundles.get('Earth')?.cloudMesh;
    if (earthClouds) EarthMaterial.updateCyclones(earthClouds.material as THREE.ShaderMaterial, this.clock.getUtcMs(), now * 0.001);

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

    if (this.jet.active) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      for (const c of this.comets) {
        c.group.visible = true;
        c.update(deltaSec, this.cameraRig.camera);
      }
      // Update spacecraft transforms to current frame's jdTDB before jet.step() so station-keeping has zero frame lag
      this.updateSpacecraftAndComets(deltaSec, false);
      this.jet.update(deltaSec, now * 0.001, this.cameraRig.camera, w, h, this.jetToScreen);
      this.updateJetEra(deltaSec);
      const jt = this.jet.telemetry;
      const [bx, by] = this.lens.sceneToOutputNdc(jt.blurNdc.x, jt.blurNdc.y, w / Math.max(1, h));
      this.lens.setSpeedBlur(jt.blur, bx, by);
      // A GoPro brings its own glass: a wide fisheye with a dark image circle at the corners
      const useGoPro = jt.lens === 'gopro' && !this.jet.landing;
      // A sharp action camera: a little fringe and vignette at the rim, no smeared edges or noise
      this.lens.setLensOverride(useGoPro ? { distortion: 0, fisheyeMask: 0, chromatic: 0.0012, edgeBlur: 0.25, vignette: 0.45, grain: 0.0015 } : null);
      // (only with frame time to spare: as the governor starts lowering the resolution, the extra
      // pixels go first)
      const ssMax = perf.tier === 'high' ? 1.4 : perf.tier === 'medium' ? 1.2 : 1;
      this.lens.setSupersample(useGoPro ? 1 + (ssMax - 1) * THREE.MathUtils.clamp((perf.scale - 0.85) / 0.15, 0, 1) : 1);
      this.lens.setActionCam(useGoPro, jt.vibration, now * 0.001);
      const cam = this.cameraRig.camera;
      this.lens.setProjection(useGoPro, cam.aspect, Math.max(50, cam.fov / 2));
      this.lens.setCanopySun(jt.canopySun.x, jt.canopySun.y, jt.canopySun.k, (jt.view === 'cockpit' || jt.view === 'gopro') && !this.jet.landing);
      // Through the pilot's own helmet and visor (GoPro view, which is at the eyes)
      this.lens.setHelmet(useGoPro ? 1 : 0, jt.canopySun.x, jt.canopySun.y, jt.canopySun.k, now * 0.001);
      this.lens.setGodRays(jt.sunNdc.x, jt.sunNdc.y, jt.sunNdc.k);
      // Golden hour: the grade warms as the Sun nears the horizon (in the air only)
      const sunUp = this.jet.sunElevation;
      const warm = jt.airDensity > 0.05 ? (1 - THREE.MathUtils.smoothstep(sunUp, 0.04, 0.4)) * THREE.MathUtils.smoothstep(sunUp, -0.08, 0.02) : 0;
      this.lens.setGrade(warm, performance.now() / 1000);
      this.lens.setGrey(jt.greyOut);
      // Auto-exposure: facing the Sun the camera stops down (the cockpit falls into silhouette)
      // Under a daylit sky the action cam meters for the sky, as a real one does: the blue keeps its depth
      const gopBase = jt.airDensity > 0 ? 0.9 : 1.15;
      const wantExposure = jt.lens === 'gopro' ? gopBase - 0.45 * jt.sunInView : 1.05 - 0.25 * jt.sunInView;
      this.renderer.toneMappingExposure += (wantExposure - this.renderer.toneMappingExposure) * Math.min(1, deltaSec * 2.5);
    } else {
      this.cameraRig.update();
    }
    if (this.showcase.active) {
      const bodies: ShowcaseBody[] = [];
      for (const b of this.planetBundles.values()) bodies.push({ name: b.definition.name, object: b.bodyGroup, radius: b.visualRadius });
      this.showcase.update(this.cameraRig.camera, now * 0.001, bodies);
    }
    this.surface.update();
    if (this.jet.active || this.jetNebulaShown) {
      this.updateJetNebula();
      this.jetNebulaShown = this.jet.active;
    }
    for (const st of this.nebulaStages.values()) st.update(deltaSec, this.starfield.nebulae.userBrightness || 0.6);
    if (this.pendingHorizonPostcard && this.selectedBody.name === 'Sagittarius A*' && !this.cameraRig.getTransit()) {
      this.pendingHorizonPostcard = false;
      this.enterHorizonView();
    }
    // Nebulae show only in a dark sky: always in space and on airless worlds, after twilight under air
    const sky = this.surface.getStatus();
    const airy = !!sky && sky.atmosphereOn && sky.atmosphereKind !== 'none';
    // Flying in Earth's air: the coloured nebula pictures are not a naked-eye sight from here
    const jetLowOverEarth = this.jet.active && this.jet.telemetry.nearest === 'Earth' && this.jet.telemetry.altKm < 60;
    this.starfield.nebulae.setSkyDarkness(
      jetLowOverEarth ? 0 : !sky || !airy ? 1 : sky.atmosphereKind === 'overcast' ? 0 : 1 - THREE.MathUtils.smoothstep(sky.sunAltDeg, -16, -7)
    );
    if (this.horizon?.active) this.horizon.update(this.cameraRig.camera, now * 0.001);

    const isBlackHole = this.selectedBody.name === 'Sagittarius A*';
    // In the jet, the world under it streams its real surface imagery
    const jetWorld = this.jet.active && this.jet.telemetry.nearest && this.jet.telemetry.nearest !== 'Sun' ? this.jet.telemetry.nearest : null;
    const focusedName = this.jet.active ? jetWorld : this.cameraRig.focusedObject && !isBlackHole && !this.showcase.active ? this.selectedBody.name : null;
    this.explorer.update(focusedName, this.cameraRig.camera, this.renderer.domElement.height);
    if (this.pendingSkyView && this.explorer.getStatus().body === this.pendingSkyView.body) {
      const p = this.pendingSkyView;
      this.pendingSkyView = null;
      const entered = this.enterSurface(p.lat, p.lon, p.place);
      if (entered && this.pendingDeepTime) {
        // The future sky: the time of day it is built for, then its phenomena
        const d = this.pendingDeepTime;
        this.pendingDeepTime = null;
        this.surface.setTimeOfDay(d.time);
        if (d.hours) this.clock.setUtcMs(this.clock.getUtcMs() + d.hours * 3600000);
        this.surface.setDeepTime(d);
      }
      if (entered && this.pendingPostcard) {
        const c = this.pendingPostcard;
        this.pendingPostcard = null;
        this.surface.setView(c.heading, c.pitch, c.fov);
        this.surface.setMagnification(c.magnification);
        this.surface.setAtmosphere(c.atmosphere ?? true);
      }
    }

    // Over a map the lens character steps aside (clean, web-map look); it returns in space
    if (this.jet.active) {
      this.lens.setEffectScale(1);
    } else if (!this.surface.isActive()) {
      const alt = this.cameraRig.altitudeInRadii();
      this.lens.setEffectScale(isFinite(alt) ? THREE.MathUtils.smoothstep(alt, 0.3, 1.5) : 1);
    }
    this.labels.update(
      this.jet.active ? [] : this.surface.isActive() ? this.surface.labelItems() : this.explorer.featureLabels(this.cameraRig.camera),
      this.cameraRig.camera,
      this.container.clientWidth,
      this.container.clientHeight
    );

    // The Sun's glint: fades in as its disk drops below ~8 px across
    {
      const cam = this.cameraRig.camera;
      const d = cam.position.length();
      const pxPerRad = this.container.clientHeight / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const diskPx = (262.2 / Math.max(1, d)) * pxPerRad;
      const u = (this.sunGlint.material as THREE.ShaderMaterial).uniforms;
      u.uAlpha.value = (1 - THREE.MathUtils.smoothstep(diskPx, 2.5, 9)) * (this.surface.isActive() ? 0 : 1);
      u.uSize.value = THREE.MathUtils.clamp(40 / Math.pow(Math.max(1, d / UNITS_PER_AU), 0.3), 12, 40) * this.renderer.getPixelRatio();
    }

    // Markers for worlds too small to see (hidden on surfaces, at the black hole and in the galaxy)
    const markersOn = this.userMarkers && !this.jet.active && !this.surface.isActive() && !this.horizon?.active && !isBlackHole && !this.showcase.active &&
      this.cameraRig.camera.position.length() < 3500.0 * COSMIC_SCALE;
    this.markers.setVisible(markersOn);
    if (!this.jet.active) {
      this.updateSpacecraftAndComets(deltaSec, markersOn);
    }
    if (markersOn) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      const cam = this.cameraRig.camera;
      cam.updateMatrixWorld();
      const aspect = w / Math.max(1, h);
      this.markers.update(this.markerBodies, cam, this.cameraRig.focusedObject ? this.selectedBody.name : null, h, (world) => {
        const p = this.tmpMarker.copy(world).project(cam);
        if (p.z > 1 || p.z < -1) return null;
        const [ox, oy] = this.lens.sceneToOutputNdc(p.x, p.y, aspect);
        if (Math.abs(ox) > 1.02 || Math.abs(oy) > 1.02) return null;
        return { x: (ox * 0.5 + 0.5) * w, y: (-oy * 0.5 + 0.5) * h };
      });
    }

    // Exposure: a sunlit world filling the frame washes the faint stars out, as on a real camera
    if (this.deepLook) {
      this.starfield.catalogueStars?.setExposure(this.deepLook.stars);
    } else if (this.starfield.catalogueStars && !this.jet.active) {
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
    // Speed as the eye judges it: relative to the scale of the view. A slow drift around the whole
    // system covers 20,000 units a second; crossing it in a flight close to a planet reads as fast
    if (this.jet.active) {
      // The jet draws its own speed field (src/flight/SpeedEffects); the observatory's travel
      // streaks around the camera read as a swirling tunnel from the cockpit, so they rest
      // In open space the observatory's travel motes streak with the jet's speed (in air the jet's
      // own speed field takes over)
      const jt0 = this.jet.telemetry;
      // Out of the air the sky opens up: a dark-adapted eye sees more stars than the observatory shows
      this.starfield.catalogueStars?.setExposure(jt0.airDensity > 0 ? 1 : 1.35);
      if (jt0.airDensity > 0) this.perceivedVelocity.set(0, 0, 0);
      else this.jet.perceivedVelocity(this.perceivedVelocity);
      this.jetLastCam.copy(this.cameraRig.camera.position);
    } else {
      const viewR = Math.max(40, this.cameraRig.camera.position.distanceTo(this.cameraRig.orbitPivot));
      this.perceivedVelocity.copy(this.cameraRig.getVelocity()).multiplyScalar(40 / viewR);
    }
    this.starfield.update(
      this.cameraRig.camera.position,
      deltaSec,
      this.perceivedVelocity,
      this.cameraRig.getZoomVelocity(),
      this.cameraRig.camera,
      this.renderer.domElement.height
    );

    // Sharper maps for the worlds you come close to (swapped in place; see TexturePipeline.HIRES)
    if (now - this.hiResCheckMs > 1000) {
      this.hiResCheckMs = now;
      const pipeline = TexturePipeline.getInstance();
      const cam = this.cameraRig.camera.position;
      for (const [name, b] of this.planetBundles) {
        if (!pipeline.hasHiRes(name)) continue;
        if (b.bodyGroup.getWorldPosition(this.hiResTmp).distanceTo(cam) < b.visualRadius * 25) pipeline.upgradeToHiRes(name);
      }
    }
    this.updatePhotoreal();
    // Behind the fly page's opening the world still updates and streams every frame, but is drawn
    // only every few (the opening film has the GPU; nothing of this shows yet)
    if (this.drawEvery <= 1 || this.drawCount++ % this.drawEvery === 0) this.renderFrame(now * 0.001);

    // React only needs ~10 updates/s for the HUD readouts; re-rendering the HUD every few frames
    // at 120–144 Hz is wasted work
    if (this.onTelemetryUpdate && now - this.lastTelemetryTime >= SolarSystemScene.TELEMETRY_INTERVAL_MS) {
      this.lastTelemetryTime = now;
      this.dispatchTelemetry();
    }
  };

  private renderOrigin = new THREE.Vector3();

  // --- Catalogue showcase: a cinematic reel of a planet system behind the catalogue ---
  private showcase = new Showcase();
  private showcaseSaved: { rate: number; paused: boolean; body: string; constellations: boolean } | null = null;

  /** While filming a planet: only its moons' orbits and no star-chart lines, like a clean plate. */
  private setShowcaseClean(on: boolean, planetSystem: boolean): void {
    for (const child of this.orbitLinesGroup.children) {
      if (child.name.startsWith('kepler_orbit_')) child.visible = !(on && planetSystem);
    }
    if (this.showcaseSaved) this.starfield.setConstellationsVisible(on ? false : this.showcaseSaved.constellations);
  }

  private showcaseBody(name: string): ShowcaseBody | null {
    const b = this.planetBundles.get(name);
    return b ? { name, object: b.bodyGroup, radius: b.visualRadius } : null;
  }

  /** The subject for a world (its moons, the region to frame), or the whole inner system for null. */
  private showcaseSubject(name: string | null, hero?: string | null): ShowcaseSubject | null {
    if (!name || name === 'Sun') {
      const sun = this.showcaseBody('Sun');
      if (!sun) return null;
      // The Sun with the inner planets out to the asteroid belt
      return { ...sun, moons: ['Mercury', 'Venus', 'Earth', 'Mars'].map((n) => this.showcaseBody(n)).filter((b): b is ShowcaseBody => !!b), extent: name ? sun.radius * 6 : 2.6 * 56355, star: true };
    }
    const subj = this.showcaseBody(name);
    if (!subj) return null;
    const moons = CatalogueManager.getMoonsOf(name)
      .filter((m) => !m.minor)
      .sort((a, b) => b.physical.meanRadiusKm - a.physical.meanRadiusKm)
      .map((m) => this.showcaseBody(m.name))
      .filter((b): b is ShowcaseBody => !!b);
    const outer = CatalogueManager.getMoonsOf(name).filter((m) => !m.minor).reduce((a, m) => Math.max(a, m.orbit.semiMajorAxisKm), 0) / (6371 / 2.4);
    const extent = Math.max(subj.radius * 8, Math.min(outer * 1.1 || subj.radius * 8, subj.radius * 30));
    const heroBody = hero ? this.showcaseBody(hero) : null;
    return { ...subj, moons, extent, hero: heroBody };
  }

  /** Start (or switch) the catalogue's background reel. `name` null films the inner Solar System. */
  public startShowcase(name: string | null, hero?: string | null): boolean {
    const subject = this.showcaseSubject(name, hero);
    if (!subject) return false;
    if (this.surface.isActive()) this.exitSurface(false);
    this.exitHorizonView(false);
    const now = performance.now() * 0.001;
    if (!this.showcase.active) {
      this.showcaseSaved = { rate: this.clock.timeMultiplier, paused: this.clock.isPaused, body: this.selectedBody.name, constellations: this.starfield.areConstellationsVisible() };
      // An hour every second: the moons visibly sweep round while the camera moves
      this.clock.timeMultiplier = 3600;
      this.clock.isPaused = false;
      this.cameraRig.suspended = true;
      this.showcase.start(subject, this.cameraRig.camera, now);
    } else {
      this.showcase.retarget(subject, this.cameraRig.camera, now);
    }
    this.setShowcaseClean(true, !!name && name !== 'Sun');
    return true;
  }

  /** Leave the reel and fly back to where the viewer was. */
  public stopShowcase(): void {
    if (!this.showcase.active) return;
    this.showcase.stop();
    this.setShowcaseClean(false, true);
    const saved = this.showcaseSaved;
    this.showcaseSaved = null;
    if (saved) {
      this.clock.timeMultiplier = saved.rate;
      this.clock.isPaused = saved.paused;
    }
    this.cameraRig.suspended = false;
    this.cameraRig.syncFromCamera();
    if (saved) this.selectBody(saved.body, 1600);
  }

  public showcaseCaption(): string {
    return this.showcase.active ? this.showcase.caption() : '';
  }

  public isShowcasing(): boolean {
    return this.showcase.active;
  }

  // --- Jet mode ---

  /** Scene NDC → screen pixels through the lens, for the jet's HUD. */
  private jetToScreen = (x: number, y: number): { x: number; y: number } | null => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const aspect = w / Math.max(1, h);
    const [ox, oy] = this.lens.sceneToOutputNdc(x, y, aspect);
    if (this.lens.isMasked(ox, oy, aspect)) return null;
    return { x: (ox * 0.5 + 0.5) * w, y: (-oy * 0.5 + 0.5) * h };
  };

  /**
   * Take off: the jet starts over the selected world (Earth if none, or the Sun/black hole is
   * selected) and the Solar System runs in real time, so every world is where it really is.
   */
  public enterJet(takeOffFrom?: Landmark): void {
    if (this.jet.active) return;
    this.landedFrom = null;
    this.onJetLanding?.(null);
    if (this.surface.isActive()) this.exitSurface(false);
    if (this.showcase.active) this.stopShowcase();
    this.exitHorizonView(false);
    if (this.visiting) this.endNebulaVisit();
    const cam = this.cameraRig.camera;
    this.jetSaved = {
      rate: this.clock.timeMultiplier, paused: this.clock.isPaused, fov: cam.fov,
      orbits: this.orbitLinesGroup.visible, constellations: this.starfield.areConstellationsVisible(),
    };
    // A clear sky from the cockpit: no orbit lines or constellation figures drawn across it
    this.orbitLinesGroup.visible = false;
    for (const l of this.moonOrbitLines.values()) l.visible = false;
    this.starfield.travelParticles.mesh.visible = false;
    this.starfield.setConstellationsVisible(false);
    this.clock.timeMultiplier = 1;
    this.clock.isPaused = false;
    this.cameraRig.suspended = true;
    this.lens.setOverlay(this.jet.overlayScene, this.jet.overlayCamera);
    // The landing cutscene waits for the ground at the landmark to stream in
    this.jet.groundReady = () => {
      const st = this.explorer.getStatus();
      return !st.layer || (st.layer.inFlight === 0 && st.layer.queued === 0);
    };
    // Arrived at an era's world: land and stand under that era's sky
    this.jet.onLookUp = (id) => {
      this.exitJet(false);
      this.enterDeepTime(id);
    };
    if (this.spacecraftLayer) {
      // Ensure every spacecraft has an evaluated world position before JetController indexes targets
      this.updateSpacecraftAndComets(0, false);
    }
    const scSelected =
      !takeOffFrom && this.selectedBody.category === 'spacecraft'
        ? this.spacecraftLayer?.ensureTargetPrepared(
            this.selectedBody.name,
            this.clock.getJulianDateTDB(),
            this.getParentResolver()
          ) ?? this.spacecraftLayer?.getBundle(this.selectedBody.name)
        : undefined;
    const rawHost = scSelected?.lastEval?.parentName ?? this.selectedBody.parentName ?? 'Earth';
    const spawnHost = this.planetBundles.has(rawHost) ? rawHost : 'Earth';
    const jetStartBody = takeOffFrom?.body ?? (scSelected ? spawnHost : this.selectedBody.name);

    this.jetLastCam.copy(cam.position);
    this.jet.enter(cam, this.planetBundles, jetStartBody, this.container, () => this.exitJet(), (n) => this.bodyPositionKm(n), {
      onLand: (lm) => this.landJetAt(lm),
      takeOffFrom,
      extraTargets: this.jetExtraTargets(),
      shiftHours: (h) => this.clock.setUtcMs(this.clock.getUtcMs() + h * 3600000),
      timePreset: () => this.nextJetTimeOfDay(),
      onRendezvousSpacecraft: (id) => {
        this.rendezvousJetToSpacecraft(id);
      },
      // Clicks in the cockpit go through the lens: map screen NDC back to the scene's
      toSceneNdc: (x, y) => this.lens.outputToSceneNdc(x, y, this.container.clientWidth / Math.max(1, this.container.clientHeight)),
    });
    if (scSelected) {
      this.jet.placeFormationBeside(scSelected);
      this.syncJetAfterDynHydration(scSelected.definition.name);
    }
    this.jetLastCam.copy(cam.position);
  }

  /** Land back in the observatory, looking at the world the jet was nearest (or, after a landing, nowhere: the surface view takes over). */
  public exitJet(flyToWorld = true): void {
    if (!this.jet.active) return;
    const world = this.jet.nearestWorld();
    this.jet.exit();
    for (const c of this.comets) {
      if (!c.spec.modelPath) c.group.visible = false;
    }
    // Back under today's sky
    this.jet.era = null;
    this.updateJetEra(0);
    this.lens.setOverlay(null, null);
    this.lens.setLensOverride(null);
    this.lens.setActionCam(false, 0, 0);
    this.lens.setHelmet(0, 0, 0, 0, 0);
    this.renderer.toneMappingExposure = 1.05;
    const cam = this.cameraRig.camera;
    const saved = this.jetSaved;
    this.jetSaved = null;
    if (saved) {
      this.clock.timeMultiplier = saved.rate;
      this.clock.isPaused = saved.paused;
      cam.fov = saved.fov;
      cam.updateProjectionMatrix();
      if (flyToWorld) {
        this.orbitLinesGroup.visible = saved.orbits;
        this.starfield.setConstellationsVisible(saved.constellations);
      }
    }
    this.cameraRig.suspended = false;
    this.cameraRig.syncFromCamera();
    if (flyToWorld) this.selectBody(world, 1600);
  }

  /** Sgr A* as a jet target: it lives in the galaxy, not among the planet bundles. */
  private jetExtraTargets(): PlanetMeshBundle[] {
    const out: PlanetMeshBundle[] = [];
    const def = CatalogueManager.getSagittariusAStar();
    const group = this.starfield.externalGalaxy?.sagittariusAStar?.group;
    if (def && group) out.push({ definition: def, bodyGroup: group, surfaceMesh: group as unknown as THREE.Mesh, visualRadius: 180 });
    // Comets: real 3D objects (nucleus, coma, ion and dust tails) to fly to and through
    if (def) {
      this.ensureCometsSpawned();
      for (const c of this.comets) {
        out.push({
          definition: { ...def, id: `comet:${c.spec.name}`, name: c.spec.name, physical: { ...def.physical, meanRadiusKm: c.radius * KM_PER_UNIT, colorHex: '#bff7ea' } },
          bodyGroup: c.group, surfaceMesh: c.group as unknown as THREE.Mesh, visualRadius: c.radius,
        });
      }
    }
    // Register all 174 NASA Eyes spacecraft in Jet Mode targeting & OBB hull collision tracking
    if (this.spacecraftLayer) {
      for (const sc of this.spacecraftLayer.getBundles()) {
        out.push(sc);
      }
    }
    // The nebulae: their 3D stages, where their pictures hang on the sky, to fly out to and into
    if (def) {
      for (const spec of NEBULAE) {
        const stage = this.nebulaStage(spec.name);
        if (!stage) continue;
        out.push({
          definition: { ...def, id: `nebula:${spec.name}`, name: spec.title, description: spec.blurb, physical: { ...def.physical, meanRadiusKm: stage.radius * KM_PER_UNIT, colorHex: '#c89cff' } },
          bodyGroup: stage.group, surfaceMesh: stage.group as unknown as THREE.Mesh, visualRadius: stage.radius,
        });
      }
    }
    return out;
  }

  /** In the jet the nebula you are heading for (or are inside) stands in 3D in place of its picture. */
  private updateJetNebula(): void {
    const target = this.jet.target;
    let shown: string | null = null;
    for (const [name, stage] of this.nebulaStages) {
      const on = this.jet.active && stage.spec.title === target;
      if (stage === this.visiting) continue;
      stage.setVisible(on);
      if (on) shown = name;
    }
    if (!this.visiting) this.starfield.nebulae.hide(shown);
  }

  private gateBeforeLanding: GateMode | null = null;
  /** The landmark the jet landed at (shown with a Take off button), or null. */
  public landedFrom: Landmark | null = null;
  /** The UI hears about landings and take-offs here. */
  public onJetLanding: ((lm: Landmark | null) => void) | null = null;

  /**
   * Touchdown: leave the jet and stand at the landmark, in the surface view with the real sky,
   * facing the landmark's view. Falls back to the explorer's fly-to where a surface view can't open.
   */
  private landJetAt(lm: Landmark): void {
    this.exitJet(false);
    // Standing on the ground the page draws as three.js does: the look-up view needs no shader
    // gate, and a gate left on there once kept its sky hidden (a black sky by day)
    if (this.gate.mode !== 'off') {
      this.gateBeforeLanding = this.gate.mode;
      this.gate.mode = 'off';
    }
    this.selectBody(lm.body, 1);
    const ok = this.enterSurface(
      lm.vantageLat ?? lm.lat,
      lm.vantageLon ?? lm.lon,
      lm.name,
      lm.vantageAltKm,
      lm.viewHeadingDeg,
      lm.viewPitchDeg
    );
    if (!ok) {
      this.flyToLandmark(lm.id);
      return;
    }
    this.surface.setView(lm.viewHeadingDeg ?? 0, lm.viewPitchDeg ?? 10);
    this.landedFrom = lm;
    this.onJetLanding?.(lm);
  }

  /** Back into the jet from where it landed, climbing away towards the landmark's view. */
  public takeOffFromLanding(): void {
    const lm = this.landedFrom;
    if (!lm) return;
    if (this.gateBeforeLanding) {
      this.gate.mode = this.gateBeforeLanding;
      this.gateBeforeLanding = null;
    }
    this.enterJet(lm);
  }

  /**
   * The fly page: straight into the jet over a real 3D city where it is daytime now (the Sun
   * highest), held still until the page reveals it.
   */
  public startFlyPage(): { name: string; lat: number; lon: number } | null {
    const picks = ['earth-eiffel-tower', 'earth-manhattan', 'earth-christ-redeemer', 'earth-tokyo-tower', 'earth-sydney-opera', 'earth-cape-town', 'earth-golden-gate', 'earth-chamonix-mont-blanc', 'earth-hong-kong', 'earth-colosseum', 'earth-las-vegas', 'earth-venice'];
    const now = new Date(this.clock.getUtcMs());
    const doy = (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000;
    const decl = THREE.MathUtils.degToRad(23.44 * Math.sin((2 * Math.PI * (doy - 81)) / 365));
    const subLon = (12 - (now.getUTCHours() + now.getUTCMinutes() / 60)) * 15;
    let best: Landmark | undefined;
    let bestScore = -Infinity;
    for (const id of picks) {
      const lm = getLandmark(id);
      if (!lm) continue;
      const la = THREE.MathUtils.degToRad(lm.lat);
      const dl = THREE.MathUtils.degToRad(lm.lon - subLon);
      // Sun's elevation there; a mid-morning or afternoon Sun (~35°) looks best, not noon's glare
      const elev = THREE.MathUtils.radToDeg(Math.asin(Math.sin(la) * Math.sin(decl) + Math.cos(la) * Math.cos(decl) * Math.cos(dl)));
      const score = elev > 5 ? 60 - Math.abs(elev - 35) : elev;
      if (score > bestScore) {
        bestScore = score;
        best = lm;
      }
    }
    this.enterJet(best);
    this.jet.hold = true;
    return best ? { name: best.name, lat: best.lat, lon: best.lon } : null;
  }

  /** How far the fly page's loading has got: the aircraft, and Google's tiles still to come. */
  public flyReadiness(): { jet: boolean; aircraft: boolean; tilesPending: number; tilesVisible: number } {
    const st = (this.photoreal?.tiles as unknown as { stats?: object } | undefined)?.stats as { queued?: number; downloading?: number; parsing?: number; visible?: number } | undefined;
    return {
      jet: this.jet.active,
      aircraft: this.jet.aircraftReady,
      tilesPending: st ? (st.queued ?? 0) + (st.downloading ?? 0) + (st.parsing ?? 0) : 0,
      tilesVisible: st?.visible ?? 0,
    };
  }

  public isJetActive(): boolean {
    return this.jet.active;
  }

  /**
   * Draw with a floating origin (see RenderOrigin.ts): the camera is moved to (0, 0, 0) and the
   * scene shifted the other way for the duration of the draw, then everything is put back.
   */
  private renderFrame(timeSec: number): void {
    this.gate.beginFrame(6);
    if (this.jet.active || this.surface.isActive()) {
      this.orbitLinesGroup.visible = false;
      for (const l of this.moonOrbitLines.values()) l.visible = false;
      this.starfield.setConstellationsVisible(false);
    }
    const cam = this.cameraRig.camera;
    const o = this.renderOrigin.copy(cam.position);
    this.scene.position.copy(o).negate();
    SUN_WORLD.value.copy(this.scene.position);
    cam.position.set(0, 0, 0);
    cam.updateMatrixWorld();
    try {
      // The jet's reflections: a cube of the real scene from where it is (every few frames)
      if (this.jet.active) this.jet.captureEnvironment(this.renderer, this.scene);
      else if (this.surface.isActive()) this.updateSurfaceCover();
      else this.surfaceCover?.setVisible(false);
      this.lens.render(timeSec);
    } finally {
      this.scene.position.set(0, 0, 0);
      SUN_WORLD.value.set(0, 0, 0);
      cam.position.copy(o);
      cam.updateMatrixWorld();
      // Picking and HUD projections between frames read world matrices: restore them unshifted
      this.scene.updateMatrixWorld();
    }
  }

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
        if ((diskTex.image && this.textureFraction >= 0.999) || t >= 1 || this.disposed) return resolve();
        onProgress(0.05 + 0.6 * Math.max(t, this.textureFraction), 'Loading NASA surface maps');
        setTimeout(tick, 120);
      };
      tick();
    });

    if (this.disposed) return;
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
    // One texture a frame, not all in one go: uploading them together froze the page for seconds
    // (the opening animation stood still); spread out, each is a short hitch at most
    const toUpload = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      const mats = Array.isArray(m) ? m : m ? [m] : [];
      for (const mat of mats) {
        const rec = mat as unknown as Record<string, unknown>;
        for (const key of ['map', 'normalMap', 'emissiveMap']) {
          const t = rec[key];
          if (t instanceof THREE.Texture && t.image) toUpload.add(t);
        }
        const uniforms = (mat as THREE.ShaderMaterial).uniforms;
        if (uniforms) {
          for (const u of Object.values(uniforms)) {
            if (u && u.value instanceof THREE.Texture && u.value.image) toUpload.add(u.value);
          }
        }
      }
    });
    let uploaded = 0;
    for (const t of toUpload) {
      // A scene thrown away while loading (React's development double mount) stops here
      if (this.disposed) return;
      this.renderer.initTexture(t);
      uploaded++;
      onProgress(0.96 + 0.04 * (uploaded / toUpload.size), 'Resolving the Milky Way');
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
    }
    onProgress(1, 'Ready');
    // The nebulae are not needed for the first frame: they load now, in the background, and fade in
    this.starfield.nebulae.load(this.renderer);
    // The jet's airframe (9.7 MB) loads now too, so it is ready the moment the pilot takes off
    this.jet.preload();
    // Back in the cockpit after a reload for a new world scale (the jet HUD's Scale button)
    let resume: string | null = null;
    try {
      resume = sessionStorage.getItem(JET_RESUME_KEY);
      sessionStorage.removeItem(JET_RESUME_KEY);
    } catch {
      resume = null;
    }
    if (resume !== null) {
      window.setTimeout(() => {
        this.enterJet();
        if (resume) this.jet.setTarget(resume);
      }, 1500);
    }
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
    this.endNebulaVisit();
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
      nebula: this.visiting ? { name: this.visiting.spec.name, title: this.visiting.spec.title, blurb: this.visiting.spec.blurb } : null,
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

  /**
   * Google's 3D Earth comes in below 1,500 km, standing on the ground, flying the jet, or close in
   * orbit (not in a deep-time landscape, which brings its own ground); the imagery tiles step aside.
   */
  private updatePhotoreal(): void {
    const p = this.photoreal;
    const earth = this.planetBundles.get('Earth');
    if (!p || !earth) return;
    const cam = this.cameraRig.camera;
    const centre = earth.bodyGroup.getWorldPosition(this.hiResTmp);
    const kmPerUnit = earth.definition.physical.meanRadiusKm / earth.visualRadius;
    const altKm = (cam.position.distanceTo(centre) - earth.visualRadius) * kmPerUnit;
    const deepLand = this.surface.isActive() && !!this.surface.getStatus()?.deepTime;
    // Below 1,200 km: higher up Solaris's own globe (clouds, night lights) is the better picture,
    // and the depth buffer can no longer tell the tiles from the globe under them
    const speedKmS = this.jet.active ? this.jet.telemetry.speedMps / 1000 : 0;
    p.setTime(this.clock.getUtcMs(), performance.now() * 0.001);
    this.updateCity(earth);
    // Flying or standing on the ground, Earth is lit by the real Sun (the explorer's even daylight
    // is for inspecting the night side from orbit; it left night lit like noon in the jet)
    if (this.jet.active || this.surface.isActive()) p.setDaylight(0);
    this.updateJetSky(earth, altKm);
    p.update(cam, this.renderer, (altKm < 1200 || this.surface.isActive()) && !deepLand && !this.explorer.hideGround, altKm, speedKmS);
    this.explorer.photorealEarth = p.showing;
    // The globe stays drawn under the tiles as their fallback: where a tile has not arrived yet
    // you see the globe's map, not a black hole. It is sunk 500 m so the two never fight for
    // depth: sea level in the tiles is the geoid, up to 106 m below the ellipsoid the globe is
    // drawn on, and the Dead Sea shore is 430 m below.
    const meshMat = earth.surfaceMesh.material as THREE.ShaderMaterial;
    meshMat.visible = true;
    meshMat.depthWrite = true;
    // Under the tiles the globe must be the ground's shape too. At 96 x 64 segments each flat
    // triangle spans ~400 km and sags up to 3.4 km under the true surface: wherever a tile had not
    // arrived, a straight-edged pit of blurry blue-green map showed (the "slabs"). Low down, a
    // fine sphere (sag ~50 m) stands in, so a gap shows ground at the right height
    this.setFineGlobe(earth, p.showing && altKm < 400);
    if (meshMat.uniforms?.uSink) meshMat.uniforms.uSink.value = p.showing ? 0.3 / earth.definition.physical.meanRadiusKm : 0;
    // The tiles' air on the globe too, low down (fading out by 80 km up, where the globe alone is
    // the view): the open sea past the tiles stopped showing as a flat deep blue to the horizon
    if (meshMat.uniforms?.uNearAir) {
      const air = p.air;
      meshMat.uniforms.uNearAir.value = p.showing ? 1 - THREE.MathUtils.smoothstep(altKm, 40, 80) : 0;
      meshMat.uniforms.uAirKmPerUnit.value = air.kmPerUnit;
      meshMat.uniforms.uAirCamAltKm.value = air.camAltKm;
      meshMat.uniforms.uAirHaze.value = air.haze;
    }
    this.updateNightLight(earth, cam.position, centre);
    // You, standing a few steps ahead in the look-up view (see Avatar)
    {
      const st = this.surface.isActive() ? this.surface.getStatus() : null;
      const on = !!st && st.body === 'Earth' && this.avatarOn && st.eyeHeightKm < 0.01;
      if (on || this.avatar) {
        this.avatar ??= new Avatar();
        const up = this.coverTmp.up.subVectors(cam.position, centre).normalize();
        const sunUp = -cam.position.clone().normalize().dot(up);
        this.avatar.update(on, earth.surfaceMesh, cam.position, cam.getWorldDirection(this.coverTmp.sun), st?.eyeHeightKm ?? 0.0017, sunUp, performance.now() / 1000);
      }
    }
    // The land's real shape, generated, under the tiles: there before they load and where they
    // have nothing (see ProceduralTerrain)
    {
      const on = (this.jet.active || this.surface.isActive()) && altKm < 400 && !deepLand && !this.explorer.hideGround;
      if (on || this.terrain) {
        this.terrain ??= new ProceduralTerrain();
        this.terrain.attach(earth.surfaceMesh);
        const dayMap = (meshMat.uniforms?.dayMap?.value ?? null) as THREE.Texture | null;
        this.terrain.setMaps(dayMap);
        const local = earth.surfaceMesh.worldToLocal(this.hiResTmp.copy(cam.position));
        const ll = bodyLocalToLatLon('Earth', local.x, local.y, local.z);
        this.terrain.setTileOffset(this.jet.active ? this.jet.tileGroundOffsetKm : null);
        const kmTrue = 6378.137 / earth.visualRadius;
        // Towards the Sun (at the scene's origin) in Earth's own frame
        const sunLocal = earth.surfaceMesh.worldToLocal(this.nightTmp.sun.set(0, 0, 0));
        this.terrain.update(on, ll.lat, ll.lon, Math.max(0.05, altKm), { kmPerUnit: kmTrue, camAltKm: Math.max(0, altKm), haze: p.air.haze }, p.dayOfYearNow, sunLocal);
      }
    }
    if (earth.atmosphereMesh) {
      const lowPhoto = p.showing && altKm < 60;
      earth.atmosphereMesh.renderOrder = lowPhoto ? 0.95 : 3;
      (earth.atmosphereMesh.material as THREE.Material).transparent = true;
    }
  }

  private terrain: ProceduralTerrain | null = null;
  private avatar: Avatar | null = null;
  /** Whether the person stands in front in the look-up view (on by default). */
  public avatarOn = true;
  /** Trees and their shadows round you, standing on Earth (the jet keeps its own set). */
  private surfaceCover: GroundCover | null = null;
  private readonly coverTmp = { up: new THREE.Vector3(), centre: new THREE.Vector3(), sun: new THREE.Vector3() };

  /**
   * Standing on Earth over Google's tiles: the same planted trees as low in the jet (GroundCover:
   * real 3D conifers and broadleaves where the photographs show woods and parks, in the season of
   * the place, swaying, casting their shadows), so the ground round you is a park or a wood and
   * not the photographs' melted blobs. Run inside the floating-origin draw (camera at the origin),
   * where metre-sized work keeps its precision.
   */
  private updateSurfaceCover(): void {
    const st = this.surface.getStatus();
    const earth = this.planetBundles.get('Earth');
    const photo = this.photoreal;
    if (!st || st.body !== 'Earth' || !earth || !photo?.showing || perf.tier === 'low' || st.eyeHeightKm > 1.2) {
      this.surfaceCover?.setVisible(false);
      photo?.setTreeShadow(null, null);
      return;
    }
    const t = this.coverTmp;
    earth.bodyGroup.getWorldPosition(t.centre);
    t.up.copy(t.centre).negate().normalize();
    const gc = (this.surfaceCover ??= new GroundCover());
    const surf = earth.surfaceMesh;
    gc.attach(surf);
    gc.setVisible(true);
    gc.setSeason(photo.dayOfYearNow, st.lat, performance.now() / 1000);
    const unitsPerKm = earth.visualRadius / 6378.137;
    gc.setArea(unitsPerKm);
    if (gc.captureDue) {
      const tileErrors = new Map<THREE.Object3D, number>();
      for (const tile of photo.tiles.visibleTiles as Set<{ geometricError?: number; engineData?: { scene?: THREE.Object3D } }>) {
        const sc = tile.engineData?.scene;
        if (sc && typeof tile.geometricError === 'number') tileErrors.set(sc, tile.geometricError);
      }
      photo.withNeutralLight(() => gc.capture(this.renderer, photo.tiles.group, surf, t.up, unitsPerKm, Math.max(0.0015, st.eyeHeightKm), tileErrors));
    }
    t.sun.copy(SUN_WORLD.value).normalize();
    gc.renderShadow(this.renderer, surf, t.sun, t.up, unitsPerKm, t.sun.dot(t.up));
    gc.setSky(t.sun.dot(t.up));
    photo.setTreeShadow(gc.shadowTexture, gc.shadowMatrix);
  }
  private readonly nightTmp = { moon: new THREE.Vector3(), up: new THREE.Vector3(), sun: new THREE.Vector3() };

  /**
   * The night's light over Earth (see AerialPerspective's NIGHT_AIR, MOON_LIGHT, MOON_DIR): where
   * the Moon really is, how much of it is lit (its phase, from the true positions), how high it
   * stands over the camera, and how dark it is (the Sun's height there).
   */
  private updateNightLight(earth: PlanetMeshBundle, cam: THREE.Vector3, centre: THREE.Vector3): void {
    const t = this.nightTmp;
    const moonB = this.planetBundles.get('Moon');
    const mp = this.latestPhysicalStates.get('Moon')?.positionKm;
    const ep = this.latestPhysicalStates.get('Earth')?.positionKm;
    let illum = 0;
    if (moonB) {
      moonB.bodyGroup.getWorldPosition(t.moon);
      MOON_DIR.value.subVectors(t.moon, centre).normalize();
    }
    if (mp && ep) {
      // Phase: the angle at the Moon between the Sun (at the origin) and Earth
      const toSun = new THREE.Vector3(-mp[0], -mp[1], -mp[2]).normalize();
      const toEarth = new THREE.Vector3(ep[0] - mp[0], ep[1] - mp[1], ep[2] - mp[2]).normalize();
      illum = (1 + toSun.dot(toEarth)) / 2;
    }
    t.up.subVectors(cam, centre).normalize();
    const moonUp = moonB ? t.up.dot(MOON_DIR.value) : -1;
    const moonHigh = THREE.MathUtils.smoothstep(moonUp, -0.04, 0.2);
    // The Sun at the origin: how dark it is here
    t.sun.copy(cam).negate().normalize();
    const night = 1 - THREE.MathUtils.smoothstep(t.up.dot(t.sun), -0.12, 0.05);
    // A crescent gives far less than its share of light (the full Moon's surge): about phase^1.5
    const moon = Math.pow(illum, 1.5);
    MOON_LIGHT.value.set(0.16, 0.2, 0.3).multiplyScalar(moon * night);
    NIGHT_AIR.value.set(0.018, 0.024, 0.042).addScaledVector(new THREE.Vector3(0.07, 0.09, 0.14), moon * moonHigh).multiplyScalar(night);
    // The eye adapts to the dark: low over Earth at night the meter may brighten up to ~2.8x
    // (the land stays readable on a moonless night; by day and in space it is held to 1.6x)
    const kmTrue = 6378.137 / earth.visualRadius;
    const altKm = cam.distanceTo(centre) * kmTrue - 6371;
    const low = 1 - THREE.MathUtils.smoothstep(altKm, 60, 150);
    this.lens.exposure.maxGain = 1.6 + 1.2 * night * low;
  }

  /** Draw one frame in this many (the fly page's opening sets 4; 1 is every frame). */
  public drawEvery = 1;
  private drawCount = 0;

  /**
   * While on (the fly page's loading, behind its film), a draw is only made once its shaders are
   * compiled and its images uploaded, and skipped until then (see CompileGate): the ~120 programs
   * and the big maps that froze the film for 0.3-1 s at a time cost the page nothing.
   */
  private gate!: CompileGate;
  /** 'hold' behind a loading screen, 'hide' live (see CompileGate); 'off' draws as three.js does. */
  public get compileGate(): GateMode {
    return this.gate.mode;
  }
  public set compileGate(mode: GateMode) {
    this.gate.mode = mode;
  }
  /** Draws skipped and objects held back by the gate (diagnostics). */
  public get gateStats(): { skips: number; hidden: number } {
    return { skips: this.gate.skips, hidden: this.gate.hidden };
  }

  private coarseGlobe: THREE.BufferGeometry | null = null;
  private fineGlobe: THREE.BufferGeometry | null = null;

  /** Swap Earth's globe between its usual sphere and a fine one (see updatePhotoreal). */
  private setFineGlobe(earth: PlanetMeshBundle, on: boolean): void {
    const mesh = earth.surfaceMesh;
    if (on) {
      if (!this.fineGlobe) {
        this.coarseGlobe = mesh.geometry;
        const g = new THREE.SphereGeometry(1, 768, 384);
        if (this.coarseGlobe.getAttribute('tangent')) g.computeTangents();
        this.fineGlobe = g;
      }
      if (mesh.geometry !== this.fineGlobe) mesh.geometry = this.fineGlobe;
    } else if (this.coarseGlobe && mesh.geometry !== this.coarseGlobe) {
      mesh.geometry = this.coarseGlobe;
    }
  }

  private timePresetIndex = -1;
  private static readonly TIME_PRESETS: Array<{ label: string; kind: 'rise' | 'set' | 'noon' | 'night'; elev: number }> = [
    { label: 'Sunrise', kind: 'rise', elev: -0.833 },
    { label: 'Morning', kind: 'rise', elev: 22 },
    { label: 'Noon', kind: 'noon', elev: 0 },
    { label: 'Golden hour', kind: 'set', elev: 6 },
    { label: 'Sunset', kind: 'set', elev: -0.833 },
    { label: 'Blue hour', kind: 'set', elev: -5 },
    { label: 'Night', kind: 'night', elev: 0 },
  ];

  /**
   * O in the jet: the next named time of day where the jet is (sunrise, morning, noon, golden hour,
   * sunset, blue hour, night), found from the real Sun over that place within the coming day.
   */
  private nextJetTimeOfDay(): string | null {
    const jt = this.jet.telemetry;
    const body = jt.nearest;
    if (jt.lat === undefined || jt.lon === undefined || !body) return null;
    const lat = jt.lat;
    const lon = jt.lon;
    const d0 = this.clock.getJulianDateTDB() - SimulationClock.J2000_JD;
    const presets = SolarSystemScene.TIME_PRESETS;
    for (let tries = 0; tries < presets.length; tries++) {
      this.timePresetIndex = (this.timePresetIndex + 1) % presets.length;
      const p = presets[this.timePresetIndex];
      let d: number | null = null;
      if (p.kind === 'noon' || p.kind === 'night') {
        d = findTimeOfDay(body, lat, lon, d0 + 1 / 1440, p.kind);
      } else {
        // Scan the next day in 3-minute steps for the Sun crossing this height, rising or setting
        const step = 3 / 1440;
        let prev = sunElevationAt(body, lat, lon, d0);
        for (let i = 1; i <= 480 && prev !== null; i++) {
          const t = d0 + i * step;
          const e = sunElevationAt(body, lat, lon, t);
          if (e === null) break;
          const up = p.kind === 'rise' ? prev < p.elev && e >= p.elev : prev > p.elev && e <= p.elev;
          if (up) {
            d = t;
            break;
          }
          prev = e;
        }
      }
      if (d === null) continue;
      const jdUtc = d + SimulationClock.J2000_JD - 69.184 / 86400;
      const ms = (jdUtc - 2440587.5) * 86400000;
      this.clock.setUtcMs(ms);
      this.propagateAll(d);
      const utcH = (ms / 3600000) % 24;
      const local = (((utcH + lon / 15) % 24) + 24) % 24;
      const hh = Math.floor(local);
      const mm = Math.floor((local - hh) * 60);
      return `${p.label} · ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    }
    return null;
  }

  /** Procedural buildings under the jet or the standing eye, in a pilot region. */
  private updateCity(earth: PlanetMeshBundle): void {
    const jt = this.jet.telemetry;
    const st = this.surface.isActive() ? this.surface.getStatus() : null;
    const lat = this.jet.active ? jt.lat : st?.body === 'Earth' ? st.lat : undefined;
    const lon = this.jet.active ? jt.lon : st?.body === 'Earth' ? st.lon : undefined;
    if (lat === undefined || lon === undefined) {
      if (this.city) this.city.group.visible = false;
      return;
    }
    if (!this.city && !ProceduralCity.regionAt(lat, lon)) return;
    // On wherever a region is listed (see ProceduralCity); localStorage solaris.proceduralCity = 0
    // turns it off
    let enabled = true;
    try {
      enabled = localStorage.getItem('solaris.proceduralCity') !== '0';
    } catch {
      enabled = true;
    }
    if (!enabled) {
      if (this.city) this.city.group.visible = false;
      return;
    }
    if (!this.city) {
      const city = new ProceduralCity();
      city.dataGroundKm = (la, lo) => earthElevation.heightKm(la, lo, 13);
      city.prepareGround = (s, w, n, e) => earthElevation.ensure(s, w, n, e, 13);
      const ray = new THREE.Raycaster();
      city.drawnGroundKm = (la, lo) => {
        const target = PhotorealEarth.current?.raycastTarget();
        if (!target) return null;
        const mesh = earth.surfaceMesh;
        mesh.updateWorldMatrix(true, false);
        const [x, y, z] = bodyLatLonToLocal('Earth', la, lo);
        const from = new THREE.Vector3(x, y, z).multiplyScalar(1 + 12 / 6378.137).applyMatrix4(mesh.matrixWorld);
        const centre = earth.bodyGroup.getWorldPosition(new THREE.Vector3());
        ray.set(from, centre.clone().sub(from).normalize());
        const hit = ray.intersectObject(target, true)[0];
        if (!hit) return null;
        const loc = hit.point.clone().applyMatrix4(mesh.matrixWorld.clone().invert());
        return (loc.length() - 1) * 6378.137;
      };
      this.city = city;
    }
    const kmPerUnit = 6378.137 / earth.visualRadius;
    const altKm = this.jet.active ? jt.altKm : 0.002;
    this.city.haze.value = this.photoreal?.air.haze ?? 1;
    this.city.offsetHintKm = this.jet.active ? this.jet.tileGroundOffsetKm : this.city.offsetHintKm;
    this.city.fallbackOffsetKm = this.terrain && Number.isFinite(this.terrain.surfaceOffsetKm) ? this.terrain.surfaceOffsetKm : null;
    this.city.update(earth.surfaceMesh, this.cameraRig.camera.position, lat, lon, altKm, kmPerUnit);
  }

  /** The physical sky dome around the jet in Earth's air (see jetSky). */
  private updateJetSky(earth: PlanetMeshBundle, roughAltKm: number): void {
    // The jet's own height over the ground (the rough one is over a mean-radius sphere, which reads
    // kilometres below zero near the equator, where Earth bulges)
    const jt = this.jet.telemetry;
    const altKm = this.jet.active && jt.nearest === 'Earth' ? jt.altKm : roughAltKm;
    const on = this.jet.active && jt.nearest === 'Earth' && altKm < 60;
    if (!this.jetSky && on) {
      this.jetSky = new SkyAtmosphere();
      this.jetSky.setModel(atmosphereFor('Earth'));
      this.scene.add(this.jetSky.mesh);
    }
    const sky = this.jetSky;
    if (!sky) return;
    if (!on) {
      sky.mesh.visible = false;
      if (earth.atmosphereMesh && this.jet.active) earth.atmosphereMesh.visible = true;
      this.earthClouds?.hide();
      this.photoreal?.setCloudShadows(null);
      return;
    }
    const cam = this.cameraRig.camera.position;
    const centre = earth.bodyGroup.getWorldPosition(new THREE.Vector3());
    const f = this.jetSkyFrame;
    f.up.subVectors(cam, centre).normalize();
    const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(earth.surfaceMesh.getWorldQuaternion(new THREE.Quaternion()));
    f.north.copy(pole).addScaledVector(f.up, -pole.dot(f.up));
    if (f.north.lengthSq() < 1e-10) f.north.set(1, 0, 0);
    f.north.normalize();
    f.east.crossVectors(f.north, f.up).normalize();
    // The Sun is at the scene origin (world coordinates, before the floating origin shifts them)
    const sunDir = new THREE.Vector3().copy(cam).negate().normalize();
    const kmPerUnit = earth.definition.physical.meanRadiusKm / earth.visualRadius;
    const horizonKm = Math.sqrt(2 * 6371 * Math.max(altKm, 0.05));
    const radius = Math.max(60, horizonKm * 3) / kmPerUnit;
    // The sky's air is measured from sea level (the jet's own height is over the ground: in a
    // Himalayan valley 3.3 km lower, which put the dome's horizon at eye level)
    const kmTrueSky = 6378.137 / earth.visualRadius;
    const latR = ((jt.lat ?? 0) * Math.PI) / 180;
    const seaKm = 6378.137 * (1 - Math.sin(latR) ** 2 / 298.257);
    const aslKm = jt.lat !== undefined ? cam.distanceTo(centre) * kmTrueSky - seaKm : altKm;
    sky.update(cam, radius, f, sunDir, Math.max(aslKm, altKm, 0.002) * 1000, true);
    // Clouds from the real weather where the jet is
    if (jt.lat !== undefined && jt.lon !== undefined) {
      this.earthClouds ??= new EarthClouds(this.lens.clouds);
      const kmTrue = 6378.137 / earth.visualRadius;
      this.earthClouds.update(altKm < 40, earth.surfaceMesh, centre, this.cameraRig.camera, jt.lat, jt.lon, altKm, kmTrue, sunDir);
      const live = this.earthClouds.weather.current;
      this.jet.weather.live = live ? { kind: live.kind, strength: live.strength, label: live.label } : null;
      // The volumetric clouds fog the view themselves: only a touch of white-out on top
      this.jet.weather.cloudInside = this.earthClouds.inside * 0.4;
      if (live) this.photoreal?.setVisibility(live.visibilityKm);
      const cp = this.lens.clouds;
      this.photoreal?.setCloudShadows({ enabled: cp.enabled, layer: cp.layer, earthRot: cp.u.uEarthRot.value });
    }
    // The orbit-scale shell would add its own scattering on top: it steps aside low down
    if (earth.atmosphereMesh) earth.atmosphereMesh.visible = altKm > 45;
  }

  private disposed = false;

  private cachedParentResolver: ParentResolver | null = null;
  private bundleLowerLookup = new Map<string, PlanetMeshBundle>();

  private ensureCometsSpawned(): void {
    if (this.comets.length > 0) return;
    this.comets = COMETS.map((c) => new Comet3D(c));
    for (const c of this.comets) {
      c.group.visible = Boolean(c.spec.modelPath);
      this.scene.add(c.group);
    }
  }

  private resolvePlanetBundle(nameOrId: string): PlanetMeshBundle | undefined {
    const direct = this.planetBundles.get(nameOrId);
    if (direct) return direct;
    if (this.bundleLowerLookup.size === 0 && this.planetBundles.size > 0) {
      for (const [k, b] of this.planetBundles) {
        this.bundleLowerLookup.set(k.toLowerCase(), b);
        this.bundleLowerLookup.set(b.definition.id.toLowerCase(), b);
      }
    }
    return this.bundleLowerLookup.get(nameOrId.toLowerCase());
  }

  private resolveComet(nameOrId: string) {
    const targetLower = nameOrId.toLowerCase();
    const targetNorm = targetLower.replace(/[^a-z0-9]/g, '');
    return this.comets.find((c) => {
      const nLower = c.spec.name.toLowerCase();
      if (nLower === targetLower) return true;
      const nNorm = nLower.replace(/[^a-z0-9]/g, '');
      return nNorm === targetNorm || (targetNorm.length >= 2 && nNorm.startsWith(targetNorm));
    });
  }

  private getParentResolver(): ParentResolver {
    if (this.cachedParentResolver) return this.cachedParentResolver;
    this.cachedParentResolver = {
      getWorldPosition: (nameOrId, out = new THREE.Vector3()) => {
        const b = this.resolvePlanetBundle(nameOrId);
        if (b) return out.copy(b.bodyGroup.position);
        const comet = this.resolveComet(nameOrId);
        if (comet) return out.copy(comet.group.position);
        return null;
      },
      getPhysicalRadiusKm: (nameOrId) => {
        const b = this.resolvePlanetBundle(nameOrId);
        if (b) return b.definition.physical.meanRadiusKm;
        const comet = this.resolveComet(nameOrId);
        if (comet) return comet.spec.nucleusKm;
        return 6371;
      },
      getVisualRadius: (nameOrId) => {
        const b = this.resolvePlanetBundle(nameOrId);
        if (b) return b.visualRadius;
        const comet = this.resolveComet(nameOrId);
        if (comet) return Math.max(0.05, comet.spec.nucleusKm / KM_PER_UNIT);
        return 1;
      },
      getSurfaceObject: (nameOrId) => {
        const b = this.resolvePlanetBundle(nameOrId);
        return b ? b.surfaceMesh : null;
      },
      getGravitationalParameterKm3S2: (nameOrId) => {
        const b = this.resolvePlanetBundle(nameOrId);
        if (!b) return null;
        return (
          b.definition.physical.gmKm3S2 ??
          (b.definition.physical.massKg ? b.definition.physical.massKg * 6.6743e-20 : null)
        );
      },
    };
    return this.cachedParentResolver;
  }

  private updateSpacecraftAndComets(deltaSec: number, showReticles = true): void {
    if (!this.spacecraftLayer) return;
    const cam = this.cameraRig.camera;
    cam.updateMatrixWorld();
    if (!this.jet.active) {
      for (const c of this.comets) {
        if (c.spec.modelPath) {
          c.group.visible = true;
          c.update(deltaSec, cam);
        }
      }
    }
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const aspect = w / Math.max(1, h);
    this.spacecraftLayer.update({
      jdTDB: this.clock.getJulianDateTDB(),
      camera: cam,
      resolver: this.getParentResolver(),
      focusedName: this.selectedBody?.name ?? null,
      jetLockedName: this.jet.active ? this.jet.target : null,
      jetActive: this.jet.active,
      deltaSec,
      projectWorldToScreen: showReticles
        ? (world) => {
            const p = this.tmpMarker.copy(world).project(cam);
            if (p.z > 1 || p.z < -1) return null;
            const [ox, oy] = this.lens.sceneToOutputNdc(p.x, p.y, aspect);
            if (Math.abs(ox) > 1.02 || Math.abs(oy) > 1.02) return null;
            return { x: (ox * 0.5 + 0.5) * w, y: (-oy * 0.5 + 0.5) * h };
          }
        : () => null,
    });
  }

  /** Selects a NASA Eyes spacecraft, optionally jumping the clock to its signature mission epoch. */
  public selectSpacecraft(nameOrId: string, featuredEpochUtc?: string | null): void {
    if (featuredEpochUtc) {
      const ms = Date.parse(featuredEpochUtc);
      if (Number.isFinite(ms)) {
        this.clock.setUtcMs(ms);
        this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
      }
    }
    const sc = this.spacecraftLayer?.getBundle(nameOrId);
    this.selectBody(sc ? sc.entry.name : nameOrId);
  }

  /** Re-anchors the jet cleanly once an uncached `.dyn` binary finishes downloading after rendezvous. */
  private syncJetAfterDynHydration(nameOrId: string): void {
    if (!this.spacecraftLayer) return;
    const token = ++this.jetRendezvousToken;
    void this.spacecraftLayer
      .awaitTargetPrepared(nameOrId, this.clock.getJulianDateTDB(), this.getParentResolver())
      .then((hydrated) => {
        if (!hydrated || !this.jet.active || token !== this.jetRendezvousToken) return;
        if (this.jet.target !== hydrated.definition.name) return;
        this.updateSpacecraftAndComets(0, false);
        this.jet.placeFormationBeside(hydrated, true);
      });
  }

  /** Evaluates a NASA spacecraft immediately and places the active jet in sunlit close formation beside it. */
  public rendezvousJetToSpacecraft(nameOrId: string, featuredEpochUtc?: string | null): boolean {
    if (!this.spacecraftLayer) return false;
    if (featuredEpochUtc) {
      const ms = Date.parse(featuredEpochUtc);
      if (Number.isFinite(ms)) {
        this.clock.setUtcMs(ms);
        this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
      }
    }
    const prepared = this.spacecraftLayer.ensureTargetPrepared(
      nameOrId,
      this.clock.getJulianDateTDB(),
      this.getParentResolver()
    );
    if (!prepared) return false;
    this.updateSpacecraftAndComets(0, false);
    this.jet.placeFormationBeside(prepared);
    this.syncJetAfterDynHydration(prepared.definition.name);
    return true;
  }

  /** Enters Jet Mode (or warps the active jet) directly into formation beside any NASA spacecraft. */
  public enterJetBesideSpacecraft(nameOrId: string, featuredEpochUtc?: string | null): void {
    if (this.jet.active) {
      this.rendezvousJetToSpacecraft(nameOrId, featuredEpochUtc);
      return;
    }
    // End showcase/surface/horizon/nebula BEFORE selecting the target spacecraft so stopShowcase()
    // cannot revert selectedBody back to the saved planet/Sun inside enterJet().
    if (this.surface.isActive()) this.exitSurface(false);
    if (this.showcase.active) this.stopShowcase();
    this.exitHorizonView(false);
    if (this.visiting) this.endNebulaVisit();
    if (featuredEpochUtc) {
      const ms = Date.parse(featuredEpochUtc);
      if (Number.isFinite(ms)) {
        this.clock.setUtcMs(ms);
        this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
      }
    }
    const prepared = this.spacecraftLayer?.ensureTargetPrepared(
      nameOrId,
      this.clock.getJulianDateTDB(),
      this.getParentResolver()
    );
    if (prepared) {
      this.selectedBody = prepared.definition;
    }
    this.enterJet();
  }

  /** Jumps time + focuses the signature body/spacecraft of a NASA historic mission event. */
  public jumpToMissionEvent(dateUtc: string | null, target: string): void {
    const ms = dateUtc ? Date.parse(dateUtc) : Date.now();
    if (Number.isFinite(ms)) {
      this.clock.setUtcMs(ms);
      this.propagateAll(this.clock.getJulianDateTDB() - SimulationClock.J2000_JD);
    }
    this.selectBody(target);
  }

  public setComparisonProp(kind: ComparisonPropKind): void {
    this.spacecraftLayer?.setComparisonProp(kind);
  }

  public getComparisonProp(): ComparisonPropKind {
    return this.spacecraftLayer?.getComparisonProp() ?? 'none';
  }

  public setScienceOverlaysVisible(visible: boolean): void {
    this.spacecraftLayer?.setScienceOverlaysVisible(visible);
  }

  public getScienceOverlaysVisible(): boolean {
    return this.spacecraftLayer?.getScienceOverlaysVisible() ?? false;
  }

  public dispose(): void {
    this.disposed = true;
    this.photoreal?.dispose();
    this.jetSky?.dispose();
    this.earthClouds?.dispose();
    this.city?.dispose();
    this.spacecraftLayer?.dispose();
    if (this.scene.environment) {
      this.scene.environment.dispose();
      this.scene.environment = null;
    }
    this.isRunning = false;
    this.horizon?.dispose();
    this.jet.dispose();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('mousemove', this.onCanvasMouseMove);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    this.surface.dispose();
    this.labels.dispose();
    this.markers.dispose();
    this.unsubscribeSettings?.();
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
