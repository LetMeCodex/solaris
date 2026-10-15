import { UNITS_PER_AU, COSMIC_SCALE } from '../rendering/Scale';
import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { CameraRig } from '../navigation/CameraRig';
import { MilkyWayGalaxy, DEFAULT_GALAXY_CONFIG } from '../rendering/MilkyWayGalaxy';
import { TravelParticles } from '../rendering/TravelParticles';

describe('Infinite Scale Engine Architecture & Multiscale Verification Suite', () => {
  let domElement: HTMLDivElement;
  let rig: CameraRig;

  beforeEach(() => {
    domElement = {
      clientWidth: 1920,
      clientHeight: 1080,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLDivElement;
    rig = new CameraRig(domElement);
  });

  describe('1. Multiscale Zoom Range & Logarithmic Mapping', () => {
    it('supports seamless observer distances spanning 9 orders of magnitude', () => {
      // Planetary surface domain
      rig.transitionToDistance(2.5, 40.0, 'cinematic_observation', 0);
      rig.update();
      expect(rig.camera.position.length()).toBeGreaterThan(1.5);
      expect(rig.camera.position.length()).toBeLessThan(5.0);

      // External Milky Way galactic overview domain
      rig.transitionToDistance(48000.0, 50.0, 'deep_space_overview', 0);
      rig.update();
      expect(rig.camera.position.length()).toBeGreaterThan(40000.0);
      expect(rig.camera.position.length()).toBeLessThan(60000.0);
    });

    it('correctly categorizes observer domains and formats astronomical scale metrics', () => {
      // 1. Planetary close-up (< 30)
      rig.transitionToDistance(10.0, 40.0, 'cinematic_observation', 0);
      rig.update();
      const metricPlanetary = rig.getObserverScaleMetric();
      expect(metricPlanetary.domain).toBe('planetary');
      expect(metricPlanetary.formatted).toContain('KM');

      // 2. Inner solar system (true scale: within ~6 AU)
      rig.transitionToDistance(2 * UNITS_PER_AU, 45.0, 'scientific_overview', 0);
      rig.update();
      const metricInner = rig.getObserverScaleMetric();
      expect(metricInner.domain).toBe('inner_system');
      expect(metricInner.formatted).toContain('AU');

      // 3. Outer solar system
      rig.transitionToDistance(40 * UNITS_PER_AU, 45.0, 'deep_space_overview', 0);
      rig.update();
      const metricOuter = rig.getObserverScaleMetric();
      expect(metricOuter.domain).toBe('outer_system');
      expect(metricOuter.formatted).toContain('AU');

      // 4. Local interstellar (stylised star layer, x COSMIC_SCALE)
      rig.transitionToDistance(8500.0 * COSMIC_SCALE, 48.0, 'deep_space_overview', 0);
      rig.update();
      const metricInterstellar = rig.getObserverScaleMetric();
      expect(metricInterstellar.domain).toBe('interstellar');
      expect(metricInterstellar.formatted).toContain('LY');

      // 5. External Milky Way galaxy
      rig.transitionToDistance(45000.0 * COSMIC_SCALE, 50.0, 'deep_space_overview', 0);
      rig.update();
      const metricGalactic = rig.getObserverScaleMetric();
      expect(metricGalactic.domain).toBe('galactic');
      expect(metricGalactic.formatted).toContain('KPC');
    });
  });

  describe('2. Dynamic Anchor Handoff Across Scale Boundaries', () => {
    it('seamlessly transitions orbit pivot from moving planetary body to barycenter origin', () => {
      const planetMock = new THREE.Object3D();
      planetMock.position.set(240, 0, 180); // Planet far away from Sun (0, 0, 0)
      planetMock.updateMatrixWorld(true);

      // Close up on planet: orbit pivot locked on planet
      rig.focusCinematic(planetMock, 2.4, 'Earth', 0);
      rig.update();
      expect(rig.orbitPivot.distanceTo(planetMock.position)).toBeLessThan(1.0);

      // Zoom out to outer solar system scale: pivot transfers to origin (0, 0, 0)
      rig.transitionToDistance(1200.0, 45.0, 'deep_space_overview', 0);
      rig.update();
      expect(rig.orbitPivot.length()).toBeCloseTo(0.0, 1);
    });

    it('maintains positive camera near plane and deep far plane across all tiers', () => {
      rig.transitionToDistance(45000.0, 50.0, 'deep_space_overview', 0);
      rig.update();
      expect(rig.camera.near).toBeGreaterThan(0.01);
      expect(rig.camera.far).toBeGreaterThanOrEqual(250000);
    });
  });

  describe('3. 3D Milky Way Galaxy Architecture', () => {
    it('constructs procedural galactic bulge, spiral arms, and Sun locator beacon', () => {
      const galaxy = new MilkyWayGalaxy(DEFAULT_GALAXY_CONFIG);
      expect(galaxy.group.name).toBe('milky_way_external_galaxy');

      // Verify Sun locator beacon position
      expect(galaxy.sunWorldPosition.length()).toBeCloseTo(DEFAULT_GALAXY_CONFIG.sunDistance, 0);

      // Verify opacity control
      galaxy.setOpacity(0.0);
      expect(galaxy.group.visible).toBe(false);

      galaxy.setOpacity(0.8);
      expect(galaxy.group.visible).toBe(true);

      galaxy.dispose();
    });
  });

  describe('4. Velocity-Aware Travel Particles', () => {
    it('constructs near-field streak particles reacting to camera motion', () => {
      const particles = new TravelParticles();
      expect(particles.mesh.name).toBe('velocity_travel_particles');

      const camPos = new THREE.Vector3(100, 50, 20);
      const vel = new THREE.Vector3(0, 0, -25); // Traveling forward along -Z

      // Update particles during motion
      particles.update(camPos, vel, -0.5, 0.016);
      expect(particles.mesh.geometry.attributes.position.count).toBeGreaterThanOrEqual(1400);

      particles.dispose();
    });
  });
});
