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

  // GPU Background & Asteroid Belt
  public starfield: Starfield;
  public asteroidBelt: AsteroidBelt;

  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();

  private isRunning: boolean = true;
  private animationFrameId: number | null = null;

  // Selection
  public selectedBody: CelestialBodyDefinition;
  private onTelemetryUpdate?: (telemetry: TelemetryData) => void;
  private telemetryThrottleCounter: number = 0;

  constructor(container: HTMLElement, onTelemetryUpdate?: (telemetry: TelemetryData) => void) {
    this.container = container;
    this.onTelemetryUpdate = onTelemetryUpdate;

    // Default target: Sun
    this.selectedBody = CatalogueManager.getBody('Sun') || CatalogueManager.getAllBodies()[0];

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020105);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    container.appendChild(this.renderer.domElement);

    // 3. Camera Rig
    this.cameraRig = new CameraRig(container);

    // 4. Lighting
    this.setupLighting();

    // 5. Starfield background (41,394 real Hipparcos stars + IAU Constellations)
    this.starfield = new Starfield();
    this.scene.add(this.starfield.group);

    // 6. Instanced Asteroid Belt (3,200 asteroids with Kirkwood gaps)
    this.asteroidBelt = new AsteroidBelt(this.transform);
    this.scene.add(this.asteroidBelt.mesh);

    // 7. Build Celestial Bodies & Keplerian Orbit Trails
    this.scene.add(this.orbitLinesGroup);
    this.setupBodies();
    this.rebuildOrbitLines();

    // 8. Interaction
    this.setupInteraction();

    // 9. Start loop
    this.animate();
  }

  private setupLighting(): void {
    // Primary solar omnidirectional point light at the Sun (zero decay for crisp interplanetary sunlight)
    const sunLight = new THREE.PointLight(0xfffaed, 2.6, 0, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = false;
    this.scene.add(sunLight);

    // Subtle cosmic ambient light for night-side planetary visibility
    const ambientLight = new THREE.AmbientLight(0x282c3c, 0.28);
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
        const line = OrbitalTrails.createOrbitLine(def, this.transform);
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
          const line = OrbitalTrails.createMoonOrbitLine(def, parentDef, this.transform);
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

  private onContainerClick = (e: MouseEvent): void => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.cameraRig.camera);

    const interactiveMeshes: THREE.Object3D[] = [];
    this.planetBundles.forEach((bundle) => {
      interactiveMeshes.push(bundle.surfaceMesh);
    });

    const intersects = this.raycaster.intersectObjects(interactiveMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      for (const bundle of this.planetBundles.values()) {
        if (bundle.surfaceMesh === hit) {
          this.selectBody(bundle.definition.name);
          break;
        }
      }
    }
  };

  private setupInteraction(): void {
    this.container.addEventListener('click', this.onContainerClick);
    window.addEventListener('resize', this.onResize);
  }

  public selectBody(name: string): void {
    const bundle = this.planetBundles.get(name);
    if (!bundle) return;

    this.selectedBody = bundle.definition;
    this.cameraRig.focusOn(bundle.bodyGroup, bundle.visualRadius);
  }

  public resetView(): void {
    this.selectedBody = CatalogueManager.getBody('Sun') || CatalogueManager.getAllBodies()[0];
    this.cameraRig.resetToOverview();
  }

  private onResize = (): void => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.cameraRig.handleResize(w, h);
  };

  private animate = (): void => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();
    // 1. Advance master simulation clock
    this.clock.update(now);

    // Days elapsed since J2000.0 epoch
    const currentJd = this.clock.getJulianDate();
    const elapsedDaysSinceJ2000 = currentJd - SimulationClock.J2000_JD;

    // 2. Propagate all heliocentric bodies first (Sun, Planets, Dwarf Planets, Asteroids)
    const bodies = CatalogueManager.getAllBodies();
    const parentPositionsRender: Map<string, [number, number, number]> = new Map();

    for (const body of bodies) {
      if (body.category === 'moon') continue; // Handled in second pass

      const bundle = this.planetBundles.get(body.name);
      if (!bundle) continue;

      if (body.orderFromSun === 0) {
        // Sun sits at center (0, 0, 0)
        bundle.bodyGroup.position.set(0, 0, 0);
        parentPositionsRender.set(body.id, [0, 0, 0]);
        // Sun differential rotation
        const spinAngle = (elapsedDaysSinceJ2000 * 24.0 / 609.12) * Math.PI * 2;
        bundle.surfaceMesh.rotation.y = spinAngle;
        continue;
      }

      // High-precision Keplerian physical state propagation
      const state = KeplerSolver.propagate(body.orbit, elapsedDaysSinceJ2000);
      this.latestPhysicalStates.set(body.name, state);

      // Transform physical position (km) to active render scale position
      const renderPos = this.transform.toRenderPosition(state.positionKm, body);
      bundle.bodyGroup.position.set(renderPos[0], renderPos[1], renderPos[2]);
      parentPositionsRender.set(body.id, renderPos);

      // Diurnal sidereal rotation
      const periodHours = body.physical.rotationPeriodHours || 24.0;
      const spinAngle = (elapsedDaysSinceJ2000 * 24.0 / periodHours) * Math.PI * 2;
      bundle.surfaceMesh.rotation.y = spinAngle;
      if (bundle.nightMesh) {
        bundle.nightMesh.rotation.y = spinAngle;
      }

      // Independent Earth cloud drift
      if (bundle.cloudMesh) {
        bundle.cloudMesh.rotation.y = spinAngle * 1.05;
      }

      // Update Saturn planetary shadow on rings
      if (body.name === 'Saturn' && bundle.ringMesh) {
        const ringMat = bundle.ringMesh.material as THREE.ShaderMaterial;
        if (ringMat.uniforms && ringMat.uniforms.saturnCenter) {
          ringMat.uniforms.saturnCenter.value.set(renderPos[0], renderPos[1], renderPos[2]);
          ringMat.uniforms.saturnRadius.value = bundle.visualRadius;
        }
      }
    }

    // 3. Propagate all natural satellites (Moons) relative to parent bodies
    for (const moon of bodies) {
      if (moon.category !== 'moon' || !moon.parentId) continue;

      const moonBundle = this.planetBundles.get(moon.name);
      if (!moonBundle) continue;

      const parentDef = CatalogueManager.getParent(moon);
      if (!parentDef) continue;

      const parentState = this.latestPhysicalStates.get(parentDef.name);
      const parentRenderPos = parentPositionsRender.get(parentDef.id) || [0, 0, 0];

      // Gravitational parameter mu = GM_parent + GM_satellite
      const parentGm = parentDef.physical.gmKm3S2 ??
        (parentDef.physical.massKg ? parentDef.physical.massKg * 6.6743e-20 : undefined);
      const moonGm = moon.physical.gmKm3S2 ??
        (moon.physical.massKg ? moon.physical.massKg * 6.6743e-20 : 0);
      const mu = (parentGm !== undefined) ? (parentGm + moonGm) : KeplerSolver.GM_SUN;

      // Moon parent-relative Keplerian propagation using parent gravitational parameter
      const moonRelState = KeplerSolver.propagate(moon.orbit, elapsedDaysSinceJ2000, mu);

      // Total heliocentric physical state for telemetry
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

      // Transform moon position to active render mode
      const renderPos = this.transform.toMoonRenderPosition(
        moonRelState.positionKm,
        moon,
        parentRenderPos,
        parentDef
      );
      moonBundle.bodyGroup.position.set(renderPos[0], renderPos[1], renderPos[2]);

      // Update parent-relative orbit line position
      const moonOrbitLine = this.moonOrbitLines.get(moon.name);
      if (moonOrbitLine) {
        moonOrbitLine.position.set(parentRenderPos[0], parentRenderPos[1], parentRenderPos[2]);
      }

      // Moon synchronous rotation
      const periodHours = moon.physical.rotationPeriodHours || moon.orbit.orbitalPeriodDays * 24.0;
      const spinAngle = (elapsedDaysSinceJ2000 * 24.0 / periodHours) * Math.PI * 2;
      moonBundle.surfaceMesh.rotation.y = spinAngle;
    }

    // 4. Propagate Asteroid Belt
    this.asteroidBelt.updatePositions(elapsedDaysSinceJ2000);

    // 5. Update camera controller
    this.cameraRig.update();

    // 6. Render frame
    this.renderer.render(this.scene, this.cameraRig.camera);

    // 7. Throttled HUD telemetry dispatch (approx 20 Hz)
    this.telemetryThrottleCounter++;
    if (this.telemetryThrottleCounter % 3 === 0 && this.onTelemetryUpdate) {
      this.dispatchTelemetry();
    }
  };

  private dispatchTelemetry(): void {
    const selectedState = this.latestPhysicalStates.get(this.selectedBody.name);

    // Physical distance and speed directly from authoritative state
    const physicalDistKm = selectedState?.distanceKm || this.selectedBody.orbit.semiMajorAxisKm;
    const physicalSpeedKmS = selectedState?.speedKmPerSec || 0;

    // Camera look bearings
    const lookDir = new THREE.Vector3();
    this.cameraRig.camera.getWorldDirection(lookDir);
    const azimuth = Math.atan2(lookDir.x, lookDir.z) * THREE.MathUtils.RAD2DEG;
    const elevation = Math.asin(lookDir.y) * THREE.MathUtils.RAD2DEG;

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
    });
  }

  public dispose(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('click', this.onContainerClick);
    this.cameraRig.dispose();
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
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
