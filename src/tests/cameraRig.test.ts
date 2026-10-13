import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { CameraRig, BODY_FRAMING_PROFILES } from '../navigation/CameraRig';

describe('CameraRig Cinematic Observer Architecture Suite', () => {
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

  describe('1. Viewing Distance & Apparent Angular Sizing', () => {
    it('calculates mathematically consistent viewing distances from visual radius and target coverage', () => {
      // Earth: R = 2.40, coverage = 0.94, FOV = 40 deg
      const earthProfile = BODY_FRAMING_PROFILES['Earth'];
      const earthDist = CameraRig.calculateViewingDistance(2.40, earthProfile, earthProfile.fov);
      expect(earthDist).toBeGreaterThan(6.0);
      expect(earthDist).toBeLessThan(8.0);

      // Verify angular size: at earthDist, half-height in world space = earthDist * tan(20 deg)
      const halfFovRad = THREE.MathUtils.degToRad(earthProfile.fov * 0.5);
      const worldHalfHeight = earthDist * Math.tan(halfFovRad);
      const coverage = (2.40) / worldHalfHeight;
      expect(coverage).toBeCloseTo(earthProfile.targetCoverageY, 2);
    });

    it('frames Jupiter with monumental coverage exceeding viewport height', () => {
      const jupiterProfile = BODY_FRAMING_PROFILES['Jupiter'];
      expect(jupiterProfile.targetCoverageY).toBeGreaterThan(1.0); // 1.08 coverage
      const jupiterDist = CameraRig.calculateViewingDistance(26.90, jupiterProfile, jupiterProfile.fov);
      expect(jupiterDist).toBeGreaterThan(60.0);
      expect(jupiterDist).toBeLessThan(75.0);
    });

    it('allocates sufficient radial clearance for Saturn ring system', () => {
      const saturnProfile = BODY_FRAMING_PROFILES['Saturn'];
      expect(saturnProfile.effectiveRadiusMultiplier).toBeGreaterThan(1.8);
      const saturnDist = CameraRig.calculateViewingDistance(22.68, saturnProfile, saturnProfile.fov);
      // Ring clearance ensures rings fit comfortably inside view
      expect(saturnDist).toBeGreaterThan(110.0);
    });
  });

  describe('2. Optical Aim Point & Off-Center Composition Math', () => {
    it('computes exact aim point so target projects to specified NDC coordinates', () => {
      const cameraPos = new THREE.Vector3(0, 0, 10);
      const pivotPos = new THREE.Vector3(0, 0, 0);
      const ndcOffsetX = -0.34; // Left-third composition
      const ndcOffsetY = 0.0;
      const fovDeg = 40.0;
      const aspect = 16 / 9;

      const aimPoint = rig.calculateAimPoint(cameraPos, pivotPos, ndcOffsetX, ndcOffsetY, fovDeg, aspect);

      // Camera aims to the right (+x) so the target at (0,0,0) appears on the left
      expect(aimPoint.x).toBeGreaterThan(0);
      expect(aimPoint.y).toBeCloseTo(0, 3);
      expect(aimPoint.z).toBeCloseTo(0, 3);

      // Project target with Three.js camera to verify NDC coordinates
      const testCam = new THREE.PerspectiveCamera(fovDeg, aspect, 0.1, 1000);
      testCam.position.copy(cameraPos);
      testCam.lookAt(aimPoint);
      testCam.updateMatrixWorld();
      testCam.updateProjectionMatrix();

      const projected = pivotPos.clone().project(testCam);
      // Should match the responsive NDC offset closely
      expect(projected.x).toBeCloseTo(ndcOffsetX, 1);
      expect(projected.y).toBeCloseTo(ndcOffsetY, 1);
    });

    it('returns direct pivot when NDC offset is zero (centered shots)', () => {
      const cameraPos = new THREE.Vector3(10, 5, 20);
      const pivotPos = new THREE.Vector3(2, 3, 4);
      const aimPoint = rig.calculateAimPoint(cameraPos, pivotPos, 0, 0, 45, 1.77);
      expect(aimPoint.x).toBeCloseTo(pivotPos.x, 4);
      expect(aimPoint.y).toBeCloseTo(pivotPos.y, 4);
      expect(aimPoint.z).toBeCloseTo(pivotPos.z, 4);
    });
  });

  describe('3. Responsive Viewport Aspect Ratio Adaptation', () => {
    it('preserves full cinematic offset on widescreen 16:9 viewports', () => {
      const res = rig.getResponsiveNdcOffset(-0.35, 0.0, 16 / 9);
      expect(res.x).toBeCloseTo(-0.35, 3);
      expect(res.y).toBeCloseTo(0.0, 3);
    });

    it('smoothly scales horizontal offset on 4:3 or square screens to prevent limb clipping', () => {
      const resSquare = rig.getResponsiveNdcOffset(-0.35, 0.0, 1.0);
      expect(Math.abs(resSquare.x)).toBeLessThan(Math.abs(-0.35));
      expect(Math.abs(resSquare.x)).toBeGreaterThan(0.10);
    });

    it('adapts to mobile portrait screens by centering horizontally and lowering vertically', () => {
      const resPortrait = rig.getResponsiveNdcOffset(-0.35, 0.0, 9 / 16);
      expect(Math.abs(resPortrait.x)).toBeLessThan(0.10);
      expect(resPortrait.y).toBeLessThan(0); // Offset slightly down so planet is in lower half
    });
  });

  describe('4. Polar Singularity & Clipping Plane Guarantees', () => {
    it('guarantees near plane is strictly positive and far plane encompasses deep skybox', () => {
      const dummyTarget = new THREE.Object3D();
      dummyTarget.position.set(100, 0, 50);
      rig.focusCinematic(dummyTarget, 2.4, 'Earth', 0);
      rig.update();

      expect(rig.camera.near).toBeGreaterThan(0.01);
      expect(rig.camera.far).toBeGreaterThanOrEqual(160000); // Deep skybox sphere at 63,000 is fully rendered
    });

    it('allows toggling between cinematic observation and centered inspection', () => {
      const dummyTarget = new THREE.Object3D();
      rig.focusCinematic(dummyTarget, 2.4, 'Earth', 0);
      expect(rig.shotMode).toBe('cinematic_observation');
      expect(rig.targetNdcOffset.x).toBeLessThan(-0.2);

      const isCinematicAfterToggle1 = rig.toggleFramingOffset();
      expect(isCinematicAfterToggle1).toBe(false);
      expect(rig.shotMode).toBe('free_inspection');
      expect(rig.targetNdcOffset.x).toBe(0);

      const isCinematicAfterToggle2 = rig.toggleFramingOffset();
      expect(isCinematicAfterToggle2).toBe(true);
      expect(rig.shotMode).toBe('cinematic_observation');
      expect(rig.targetNdcOffset.x).toBeLessThan(-0.2);
    });
  });
});
