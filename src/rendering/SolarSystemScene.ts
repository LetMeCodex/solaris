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
}

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
    this.orbitLinesGroup.visible = false; // Restrained cinematic aesthetic by default
    this.scene.add(this.orbitLinesGroup);
    this.setupBodies();
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

  public setLensProfile(name: LensProfileName): void {
    this.lens.setProfile(name);
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

  public selectBody(name: string, durationMs: number = 1800): void {
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
    this.selectedBody = CatalogueManager.getBody('Sun') || CatalogueManager.getAllBodies()[0];
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
    this.starfield.update(
      this.cameraRig.camera.position,
      deltaSec,
      this.cameraRig.getVelocity(),
      this.cameraRig.getZoomVelocity(),
      this.cameraRig.camera
    );

    this.lens.render(now * 0.001);

    // React only needs ~10 updates/s for the HUD readouts; re-rendering the HUD every few frames
    // at 120–144 Hz is wasted work
    if (this.onTelemetryUpdate && now - this.lastTelemetryTime >= SolarSystemScene.TELEMETRY_INTERVAL_MS) {
      this.lastTelemetryTime = now;
      this.dispatchTelemetry();
    }
  };

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
      observerScaleMetric: scaleMetric.formatted,
      observerDomain: scaleMetric.domain,
      travelSpeed: Math.round(travelSpeed),
      cameraDistance: Math.round(scaleMetric.distance),
      lensProfile: this.lens.profile.name,
    });
  }

  public dispose(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('mousedown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('mousemove', this.onCanvasMouseMove);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    this.cameraRig.dispose();
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
