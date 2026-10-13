import * as THREE from 'three';

export type CameraShotMode =
  | 'cinematic_observation'
  | 'free_inspection'
  | 'deep_space_overview'
  | 'scientific_overview';

export interface FramingProfile {
  targetCoverageY: number;    // Desired fraction of vertical screen height occupied by target (0.85 - 1.10)
  ndcOffsetX: number;         // Normalized horizontal position in screen space (-0.34 = left-third placement)
  ndcOffsetY: number;         // Normalized vertical position in screen space (0.0 = centered vertically)
  fov: number;                // Perspective field of view in degrees (38° - 45°)
  effectiveRadiusMultiplier?: number; // Radial clearance factor (e.g. 1.95 for Saturn rings)
  preferredElevation?: number; // Spherical phi angle in radians (e.g. 0.36 * PI)
  preferredAzimuthOffset?: number; // Azimuth offset from sun direction
}

export interface CameraTransition {
  startPos: THREE.Vector3;
  startAimPoint: THREE.Vector3;
  startFov: number;
  startNdcOffsetX: number;
  startNdcOffsetY: number;
  startPivot: THREE.Vector3;
  startSpherical: THREE.Spherical;

  targetObject: THREE.Object3D | null;
  targetRadius: number;
  targetBodyName: string;
  targetShotMode: CameraShotMode;
  targetFov: number;
  targetNdcOffsetX: number;
  targetNdcOffsetY: number;
  targetDistance: number;
  targetTheta: number;
  targetPhi: number;

  startTime: number;
  durationMs: number;
  onComplete?: () => void;
}

export const BODY_FRAMING_PROFILES: Record<string, FramingProfile> = {
  Sun: {
    targetCoverageY: 0.85,
    ndcOffsetX: -0.28,
    ndcOffsetY: 0.0,
    fov: 42.0,
    preferredElevation: Math.PI * 0.35,
  },
  Mercury: {
    targetCoverageY: 0.92,
    ndcOffsetX: -0.34,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.38,
  },
  Venus: {
    targetCoverageY: 0.92,
    ndcOffsetX: -0.34,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.38,
  },
  Earth: {
    targetCoverageY: 0.94,
    ndcOffsetX: -0.35,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.37,
  },
  Mars: {
    targetCoverageY: 0.92,
    ndcOffsetX: -0.34,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.38,
  },
  Jupiter: {
    targetCoverageY: 1.08, // Grand planetary scale: fills screen with monumental spherical curvature
    ndcOffsetX: -0.38,     // Placed proudly on the left
    ndcOffsetY: 0.0,
    fov: 41.0,
    preferredElevation: Math.PI * 0.39,
  },
  Saturn: {
    targetCoverageY: 0.88,
    ndcOffsetX: -0.28,
    ndcOffsetY: 0.0,
    fov: 41.0,
    effectiveRadiusMultiplier: 1.95, // Clearance for expansive rings
    preferredElevation: Math.PI * 0.32, // 32° elevation reveals ring disc and planetary shadow
  },
  Uranus: {
    targetCoverageY: 0.92,
    ndcOffsetX: -0.34,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.38,
  },
  Neptune: {
    targetCoverageY: 0.92,
    ndcOffsetX: -0.34,
    ndcOffsetY: 0.0,
    fov: 40.0,
    preferredElevation: Math.PI * 0.38,
  },
  Pluto: {
    targetCoverageY: 0.90,
    ndcOffsetX: -0.32,
    ndcOffsetY: 0.0,
    fov: 39.0,
    preferredElevation: Math.PI * 0.38,
  },
  'Sagittarius A*': {
    targetCoverageY: 0.88,
    ndcOffsetX: -0.24,
    ndcOffsetY: -0.02,
    fov: 40.0,
    preferredElevation: Math.PI * 0.42,
  },
};

export const DEFAULT_PLANET_FRAMING: FramingProfile = {
  targetCoverageY: 0.92,
  ndcOffsetX: -0.34,
  ndcOffsetY: 0.0,
  fov: 40.0,
  preferredElevation: Math.PI * 0.38,
};

export const DEFAULT_MOON_FRAMING: FramingProfile = {
  targetCoverageY: 0.88,
  ndcOffsetX: -0.33,
  ndcOffsetY: 0.0,
  fov: 39.0,
  preferredElevation: Math.PI * 0.38,
};

export class CameraRig {
  public camera: THREE.PerspectiveCamera;

  // --- CORE CINEMATIC CAMERA MODEL ---
  // 1. Subject Anchor: Real-time world-space position of target celestial body
  public subjectAnchor: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // 2. Orbit Pivot: Stable world-space center around which user rotates/inspects
  public orbitPivot: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // 3. Aim Point: Actual point in 3D world space the camera's optical center looks at
  public aimPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // 4. Composition Offset: Normalized device coordinates for target placement
  public currentNdcOffset: THREE.Vector2 = new THREE.Vector2(-0.34, 0.0);
  public targetNdcOffset: THREE.Vector2 = new THREE.Vector2(-0.34, 0.0);

  // Active shot mode
  public shotMode: CameraShotMode = 'cinematic_observation';

  // Multiscale Anchor Handoff & Origin reference
  private static readonly ORIGIN_VEC = new THREE.Vector3(0, 0, 0);
  private effectiveAnchor: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Velocity & Travel Tracking for Streak Particles
  private currentVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private lastCameraPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private lastRadius: number = 680;
  private zoomRate: number = 0;
  private lastUpdateTime: number = performance.now();

  // Smooth spherical coordinates (radius = observer distance from orbit pivot)
  private spherical: THREE.Spherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);
  private targetSpherical: THREE.Spherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);

  // User Pan offset in camera plane
  private panOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private targetPanOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Target tracking state
  public focusedObject: THREE.Object3D | null = null;
  public focusDistance: number = 30;
  public focusedRadius: number = 2.8;

  // Transition state
  private transition: CameraTransition | null = null;

  // Mouse & Touch interaction state
  private isOrbiting: boolean = false;
  private isPanning: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private lastInteractionTime: number = performance.now();

  private activeTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist: number = 0;
  private initialRadiusOnPinch: number = 0;

  // Idle drift settings (very subtle, slow celestial rotation when idle)
  public enableIdleDrift: boolean = true;

  // Damping factor for silky inertial responsiveness
  private readonly damping: number = 0.12;

  private domElement: HTMLElement;

  constructor(domElement: HTMLElement) {
    this.domElement = domElement;
    this.camera = new THREE.PerspectiveCamera(
      45,
      domElement.clientWidth / domElement.clientHeight,
      0.05,
      160000
    );
    this.updateCameraPosition();
    this.setupEventListeners(domElement);
  }

  /**
   * Calculates the viewing distance required for a celestial body to achieve
   * the desired vertical screen coverage under a specific perspective FOV.
   * D = R_effective / (coverage * tan(fov / 2))
   */
  public static calculateViewingDistance(
    visualRadius: number,
    profile: FramingProfile,
    fovDegrees: number = profile.fov
  ): number {
    const effectiveRadius = visualRadius * (profile.effectiveRadiusMultiplier || 1.0);
    const halfFovRad = THREE.MathUtils.degToRad(fovDegrees * 0.5);
    const tanHalfFov = Math.tan(halfFovRad);
    const coverage = Math.max(0.1, profile.targetCoverageY);
    const distance = effectiveRadius / (coverage * tanHalfFov);
    return Math.max(effectiveRadius * 1.15, distance);
  }

  /**
   * Adapts the target NDC composition offset responsively based on viewport aspect ratio.
   * On wide screens (16:9), full left-third composition is preserved.
   * On square screens, it gently shifts toward center.
   * On mobile portrait screens, it centers horizontally and offsets slightly lower.
   */
  public getResponsiveNdcOffset(
    profileNdcX: number,
    profileNdcY: number,
    aspect: number
  ): { x: number; y: number } {
    let x = profileNdcX;
    let y = profileNdcY;

    if (aspect >= 1.5) {
      // Wide desktop (16:9, 16:10, 21:9)
      x = profileNdcX;
      y = profileNdcY;
    } else if (aspect >= 1.0) {
      // Medium / square viewport
      const factor = (aspect - 1.0) / 0.5;
      x = profileNdcX * (0.45 + 0.55 * factor);
      y = profileNdcY;
    } else {
      // Mobile portrait (aspect < 1.0)
      x = profileNdcX * 0.15;
      y = -0.10;
    }

    return { x, y };
  }

  /**
   * Computes the optical aim point in world space such that the subject anchor
   * appears precisely at the desired NDC offset (ndcOffsetX, ndcOffsetY) on screen.
   */
  public calculateAimPoint(
    cameraPos: THREE.Vector3,
    pivotPos: THREE.Vector3,
    ndcOffsetX: number,
    ndcOffsetY: number,
    fovDeg: number,
    aspect: number
  ): THREE.Vector3 {
    if (Math.abs(ndcOffsetX) < 0.001 && Math.abs(ndcOffsetY) < 0.001) {
      return pivotPos.clone();
    }

    const toTarget = new THREE.Vector3().subVectors(pivotPos, cameraPos);
    const dist = toTarget.length();
    if (dist < 0.001) return pivotPos.clone();

    const forward = toTarget.clone().divideScalar(dist);
    const worldUp = new THREE.Vector3(0, 1, 0);

    let right = new THREE.Vector3().crossVectors(forward, worldUp);
    if (right.lengthSq() < 0.0001) {
      right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 0, 1));
    }
    right.normalize();

    const up = new THREE.Vector3().crossVectors(right, forward).normalize();

    // Responsive aspect ratio adaptation
    const responsiveOffset = this.getResponsiveNdcOffset(ndcOffsetX, ndcOffsetY, aspect);

    const halfFovRad = THREE.MathUtils.degToRad(fovDeg * 0.5);
    const tanHalfFovY = Math.tan(halfFovRad);
    const tanHalfFovX = aspect * tanHalfFovY;

    const xCam = responsiveOffset.x * dist * tanHalfFovX;
    const yCam = responsiveOffset.y * dist * tanHalfFovY;

    // Aim point = Pivot - (right * xCam + up * yCam)
    return new THREE.Vector3()
      .copy(pivotPos)
      .addScaledVector(right, -xCam)
      .addScaledVector(up, -yCam);
  }

  private updateCameraPosition(): void {
    // --- 1. TRANSITION INTERPOLATION ---
    if (this.transition) {
      const now = performance.now();
      const elapsed = now - this.transition.startTime;
      const progress = Math.min(1.0, elapsed / this.transition.durationMs);

      // Smooth quintic ease-in-out
      const ease = progress < 0.5
        ? 16 * Math.pow(progress, 5)
        : 1 - Math.pow(-2 * progress + 2, 5) / 2;

      // Real-time moving target tracking during transition
      if (this.transition.targetObject) {
        this.transition.targetObject.updateWorldMatrix(true, false);
        this.transition.targetObject.getWorldPosition(this.subjectAnchor);
      } else {
        this.subjectAnchor.set(0, 0, 0);
      }

      // Interpolate optical parameters
      this.camera.fov = THREE.MathUtils.lerp(this.transition.startFov, this.transition.targetFov, ease);
      this.currentNdcOffset.x = THREE.MathUtils.lerp(this.transition.startNdcOffsetX, this.transition.targetNdcOffsetX, ease);
      this.currentNdcOffset.y = THREE.MathUtils.lerp(this.transition.startNdcOffsetY, this.transition.targetNdcOffsetY, ease);

      // Interpolate spherical orbit coordinates
      const curTheta = THREE.MathUtils.lerp(this.spherical.theta, this.transition.targetTheta, ease);
      const curPhi = THREE.MathUtils.lerp(this.spherical.phi, this.transition.targetPhi, ease);
      const curRadius = THREE.MathUtils.lerp(this.spherical.radius, this.transition.targetDistance, ease);

      this.orbitPivot.lerpVectors(this.transition.startPivot, this.subjectAnchor, ease);

      const sphericalOffset = new THREE.Vector3().setFromSphericalCoords(curRadius, curPhi, curTheta);
      this.camera.position.copy(this.orbitPivot).add(sphericalOffset);

      // Calculate optical aim point ensuring the target is framed at currentNdcOffset
      this.aimPoint = this.calculateAimPoint(
        this.camera.position,
        this.orbitPivot,
        this.currentNdcOffset.x,
        this.currentNdcOffset.y,
        this.camera.fov,
        this.camera.aspect
      );
      this.camera.lookAt(this.aimPoint);

      // Dynamic depth buffer calibration: razor-sharp closeups without z-fighting or skybox clipping
      const clearance = Math.max(0.05, curRadius - this.focusedRadius);
      this.camera.near = Math.max(0.04, clearance * 0.08);
      this.camera.far = Math.max(160000, curRadius * 30);
      this.camera.updateProjectionMatrix();

      if (progress >= 1.0) {
        if (this.transition.onComplete) this.transition.onComplete();
        this.spherical.set(curRadius, curPhi, curTheta);
        this.targetSpherical.copy(this.spherical);
        this.panOffset.set(0, 0, 0);
        this.targetPanOffset.set(0, 0, 0);
        this.transition = null;
      }
      return;
    }

    // --- 2. ACTIVE TRACKING & USER INTERACTION ---
    // Follow the tracked body in real time as it moves along its Keplerian orbit
    let currentAnchor = this.subjectAnchor;
    if (this.focusedObject) {
      this.focusedObject.updateWorldMatrix(true, false);
      this.focusedObject.getWorldPosition(this.subjectAnchor);

      // Seamless anchor handoff: as observer zooms beyond planetary domain (> 350 units),
      // the orbit pivot smoothly transfers from the individual body towards the Solar System barycenter (0,0,0).
      // For Sagittarius A*, preserve its Galactic Center anchor to allow wide deep-space black hole views.
      const r = this.spherical.radius;
      const isBlackHole = this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*';
      if (!isBlackHole && r > 320.0) {
        const handoffFactor = Math.min(1.0, (r - 320.0) / 480.0);
        this.effectiveAnchor.lerpVectors(this.subjectAnchor, CameraRig.ORIGIN_VEC, handoffFactor);
        currentAnchor = this.effectiveAnchor;
      } else {
        currentAnchor = this.subjectAnchor;
      }
    } else {
      this.subjectAnchor.set(0, 0, 0);
      currentAnchor = this.subjectAnchor;
    }

    // Smoothly blend NDC composition offset toward target
    this.currentNdcOffset.x += (this.targetNdcOffset.x - this.currentNdcOffset.x) * this.damping;
    this.currentNdcOffset.y += (this.targetNdcOffset.y - this.currentNdcOffset.y) * this.damping;

    // Orbit pivot tracks effective anchor + smoothed pan offset
    this.panOffset.lerp(this.targetPanOffset, this.damping);
    this.orbitPivot.copy(currentAnchor).add(this.panOffset);

    // Apply idle celestial drift if enabled and user has been idle for > 3s
    if (
      this.enableIdleDrift &&
      !this.isOrbiting &&
      !this.isPanning &&
      this.shotMode === 'cinematic_observation'
    ) {
      const now = performance.now();
      if ((now - this.lastInteractionTime) > 3000) {
        this.targetSpherical.theta += 0.00008; // Delicate, imperceptible celestial drift
      }
    }

    // Smooth spherical coordinates
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * this.damping;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * this.damping;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * this.damping;

    // Strict polar singularity protection: clamps phi between 0.02 and PI - 0.02
    this.spherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.spherical.phi));

    // Observer camera position in 3D world space
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.orbitPivot).add(offset);

    // Compute optical aim point ensuring the target is framed at currentNdcOffset
    this.aimPoint = this.calculateAimPoint(
      this.camera.position,
      this.orbitPivot,
      this.currentNdcOffset.x,
      this.currentNdcOffset.y,
      this.camera.fov,
      this.camera.aspect
    );
    this.camera.lookAt(this.aimPoint);

    // Dynamic depth buffer calibration across 9 orders of magnitude
    const distToCenter = this.spherical.radius;
    const clearance = Math.max(0.05, distToCenter - this.focusedRadius);
    this.camera.near = Math.max(0.04, Math.min(30.0, clearance * 0.08));
    this.camera.far = Math.max(250000, distToCenter * 35);
    this.camera.updateProjectionMatrix();

    // Track frame velocity and zoom rate for travel particles and HUD telemetry
    const now = performance.now();
    const dt = Math.max(0.001, (now - this.lastUpdateTime) * 0.001);
    this.currentVelocity.subVectors(this.camera.position, this.lastCameraPos).divideScalar(dt);
    if (this.lastRadius > 0.001) {
      this.zoomRate = (Math.log(this.spherical.radius) - Math.log(this.lastRadius)) / dt;
    }
    this.lastCameraPos.copy(this.camera.position);
    this.lastRadius = this.spherical.radius;
    this.lastUpdateTime = now;
  }

  public update(): void {
    this.updateCameraPosition();
  }

  /**
   * Backward-compatibility alias for code reading lookAtTarget.
   */
  public get lookAtTarget(): THREE.Vector3 {
    return this.aimPoint;
  }

  /**
   * Focuses on a celestial body with cinematic framing.
   * Places the body gracefully off-center (left-third composition) filling 85-110%
   * of viewport height, revealing its spherical curvature and deep galactic cosmos.
   */
  public focusCinematic(
    object: THREE.Object3D,
    radius: number,
    bodyName: string = '',
    durationMs: number = 1800,
    onComplete?: () => void
  ): void {
    this.focusedObject = object;
    this.focusedRadius = radius;
    this.shotMode = 'cinematic_observation';

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    object.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    // Framing profile lookup
    const profile = BODY_FRAMING_PROFILES[bodyName] || (radius < 1.0 ? DEFAULT_MOON_FRAMING : DEFAULT_PLANET_FRAMING);
    this.targetNdcOffset.set(profile.ndcOffsetX, profile.ndcOffsetY);

    // Calculate viewing distance based on visual radius, FOV, and target screen coverage
    const viewingDistance = CameraRig.calculateViewingDistance(radius, profile, profile.fov);
    this.focusDistance = viewingDistance;

    // Direction to Sun (Sun sits at 0, 0, 0)
    const toSun = new THREE.Vector3().copy(worldPos).negate();
    const isSun = toSun.lengthSq() < 1 || bodyName === 'Sun';
    if (isSun) {
      toSun.set(0, 0, 1);
    } else {
      toSun.normalize();
    }

    // Natural 3/4 sunlit initial vantage point
    // Orbital tangent vector in X-Z plane
    const side = new THREE.Vector3(-toSun.z, 0, toSun.x).normalize();
    const up = new THREE.Vector3(0, 1, 0);

    let cameraOffset: THREE.Vector3;
    if (isSun) {
      cameraOffset = new THREE.Vector3(0, 0.40, 1.0).normalize().multiplyScalar(viewingDistance);
    } else if (bodyName === 'Saturn') {
      // 32° oblique elevation to show Saturn's ring system and shadow
      cameraOffset = new THREE.Vector3()
        .copy(toSun).multiplyScalar(-0.35)
        .addScaledVector(side, 0.65)
        .addScaledVector(up, 0.58)
        .normalize()
        .multiplyScalar(viewingDistance);
    } else if (bodyName === 'Sagittarius A*' || bodyName === 'Sgr A*' || bodyName === 'sagittarius_a_star') {
      // Classic Gargantua / NASA observer inclination: ~14.5° elevation above equatorial accretion disk
      // In Sgr A*'s local frame: elevation angle ~14.5° (sin = 0.25, cos = 0.968), approaching limb on left
      const objQuat = new THREE.Quaternion();
      object.getWorldQuaternion(objQuat);
      const localDir = new THREE.Vector3(0.28, 0.25, 0.92).normalize();
      const worldDir = localDir.applyQuaternion(objQuat);
      cameraOffset = worldDir.multiplyScalar(viewingDistance);
    } else {
      // 3/4 sunlit vantage point: illuminated surface + terminator + limb
      // Looking past the planet towards the deep cosmos and Milky Way
      cameraOffset = new THREE.Vector3()
        .copy(toSun).multiplyScalar(0.48)
        .addScaledVector(side, 0.72)
        .addScaledVector(up, 0.36)
        .normalize()
        .multiplyScalar(viewingDistance);
    }

    const targetSph = new THREE.Spherical().setFromVector3(cameraOffset);
    // Polar singularity safety
    targetSph.phi = Math.max(0.04, Math.min(Math.PI - 0.04, targetSph.phi));

    // Reset pan offset
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);

    this.transition = {
      startPos: this.camera.position.clone(),
      startAimPoint: this.aimPoint.clone(),
      startFov: this.camera.fov,
      startNdcOffsetX: this.currentNdcOffset.x,
      startNdcOffsetY: this.currentNdcOffset.y,
      startPivot: this.orbitPivot.clone(),
      startSpherical: this.spherical.clone(),

      targetObject: object,
      targetRadius: radius,
      targetBodyName: bodyName,
      targetShotMode: 'cinematic_observation',
      targetFov: profile.fov,
      targetNdcOffsetX: profile.ndcOffsetX,
      targetNdcOffsetY: profile.ndcOffsetY,
      targetDistance: viewingDistance,
      targetTheta: targetSph.theta,
      targetPhi: targetSph.phi,

      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSph);
        this.targetSpherical.copy(targetSph);
        this.camera.fov = profile.fov;
        this.currentNdcOffset.set(profile.ndcOffsetX, profile.ndcOffsetY);
        if (onComplete) onComplete();
      }
    };
  }

  public focusOn(object: THREE.Object3D, radius: number, durationMs: number = 1800): void {
    this.focusCinematic(object, radius, object.name, durationMs);
  }

  public resetToOverview(durationMs: number = 1600): void {
    this.focusedObject = null;
    this.focusedRadius = 48.0;
    this.shotMode = 'deep_space_overview';
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);
    this.targetNdcOffset.set(0, 0);

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    const targetSpherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);

    this.transition = {
      startPos: this.camera.position.clone(),
      startAimPoint: this.aimPoint.clone(),
      startFov: this.camera.fov,
      startNdcOffsetX: this.currentNdcOffset.x,
      startNdcOffsetY: this.currentNdcOffset.y,
      startPivot: this.orbitPivot.clone(),
      startSpherical: this.spherical.clone(),

      targetObject: null,
      targetRadius: 48.0,
      targetBodyName: 'Overview',
      targetShotMode: 'deep_space_overview',
      targetFov: 45.0,
      targetNdcOffsetX: 0.0,
      targetNdcOffsetY: 0.0,
      targetDistance: 680.0,
      targetTheta: targetSpherical.theta,
      targetPhi: targetSpherical.phi,

      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSpherical);
        this.targetSpherical.copy(targetSpherical);
        this.subjectAnchor.set(0, 0, 0);
        this.orbitPivot.set(0, 0, 0);
        this.camera.fov = 45.0;
        this.currentNdcOffset.set(0, 0);
      }
    };
  }

  /**
   * Smoothly transitions camera to a target distance and field of view.
   */
  public transitionToDistance(
    distance: number,
    fov: number = 45.0,
    shotMode: CameraShotMode = 'deep_space_overview',
    durationMs: number = 1600,
    preferredPhi?: number
  ): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    const curTheta = this.targetSpherical.theta;
    const curPhi = preferredPhi !== undefined
      ? preferredPhi
      : Math.max(0.08, Math.min(Math.PI * 0.45, this.targetSpherical.phi));
    const targetSpherical = new THREE.Spherical(distance, curPhi, curTheta);

    this.shotMode = shotMode;
    this.targetPanOffset.set(0, 0, 0);

    const targetNdcX = shotMode === 'cinematic_observation' ? -0.34 : 0.0;
    const targetNdcY = 0.0;

    this.transition = {
      startPos: this.camera.position.clone(),
      startAimPoint: this.aimPoint.clone(),
      startFov: this.camera.fov,
      startNdcOffsetX: this.currentNdcOffset.x,
      startNdcOffsetY: this.currentNdcOffset.y,
      startPivot: this.orbitPivot.clone(),
      startSpherical: this.spherical.clone(),

      targetObject: distance < 350.0 ? this.focusedObject : null,
      targetRadius: this.focusedRadius,
      targetBodyName: this.focusedObject ? this.focusedObject.name : 'Cosmos',
      targetShotMode: shotMode,
      targetFov: fov,
      targetNdcOffsetX: targetNdcX,
      targetNdcOffsetY: targetNdcY,
      targetDistance: distance,
      targetTheta: targetSpherical.theta,
      targetPhi: targetSpherical.phi,

      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSpherical);
        this.targetSpherical.copy(targetSpherical);
        if (distance >= 350.0) {
          this.subjectAnchor.set(0, 0, 0);
          this.orbitPivot.set(0, 0, 0);
        }
        this.camera.fov = fov;
        this.currentNdcOffset.set(targetNdcX, targetNdcY);
        this.targetNdcOffset.set(targetNdcX, targetNdcY);
      }
    };
  }

  /**
   * One-click navigation to discrete multiscale cosmological tiers.
   */
  public jumpToScale(
    domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic',
    durationMs: number = 1800
  ): void {
    let targetDist = 680.0;
    let targetShot: CameraShotMode = 'scientific_overview';
    let targetFov = 45.0;
    let targetPhi: number | undefined = undefined;

    switch (domain) {
      case 'planetary':
        targetDist = this.focusedRadius > 0 ? this.focusedRadius * 2.8 : 12.0;
        targetShot = 'cinematic_observation';
        targetFov = 40.0;
        break;
      case 'inner_system':
        targetDist = 180.0;
        targetShot = 'scientific_overview';
        targetFov = 45.0;
        targetPhi = Math.PI * 0.32;
        break;
      case 'outer_system':
        targetDist = 1100.0;
        targetShot = 'deep_space_overview';
        targetFov = 46.0;
        targetPhi = Math.PI * 0.28;
        break;
      case 'interstellar':
        targetDist = 8200.0;
        targetShot = 'deep_space_overview';
        targetFov = 48.0;
        targetPhi = Math.PI * 0.26;
        break;
      case 'galactic':
        targetDist = 52000.0;
        targetShot = 'deep_space_overview';
        targetFov = 48.0;
        // Elevated perspective looking down onto the sweeping spiral disk
        targetPhi = Math.PI * 0.24;
        break;
    }

    this.transitionToDistance(targetDist, targetFov, targetShot, durationMs, targetPhi);
  }

  public getVelocity(): THREE.Vector3 {
    return this.currentVelocity;
  }

  public getZoomVelocity(): number {
    return this.zoomRate;
  }

  public getTravelSpeed(): number {
    return this.currentVelocity.length();
  }

  public getObserverScaleMetric(): {
    distance: number;
    formatted: string;
    domain: 'planetary' | 'inner_system' | 'outer_system' | 'interstellar' | 'galactic';
  } {
    const d = this.spherical.radius;

    if (this.focusedObject && (this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*')) {
      const rsMulti = (d / 20.0).toFixed(1);
      const km = Math.round(d * 634520);
      return { distance: d, formatted: `${rsMulti} r_s (${km.toLocaleString()} KM)`, domain: 'planetary' };
    }

    if (d < 30.0) {
      const km = Math.round(d * 4200.0);
      return { distance: d, formatted: `${km.toLocaleString()} KM`, domain: 'planetary' };
    }
    if (d < 380.0) {
      const au = (d / 28.0).toFixed(2);
      return { distance: d, formatted: `${au} AU`, domain: 'inner_system' };
    }
    if (d < 3500.0) {
      const au = (d / 28.0).toFixed(1);
      return { distance: d, formatted: `${au} AU`, domain: 'outer_system' };
    }
    if (d < 25000.0) {
      const ly = (d / 380.0).toFixed(2);
      return { distance: d, formatted: `${ly} LY`, domain: 'interstellar' };
    }
    const kpc = (d / 6200.0).toFixed(1);
    return { distance: d, formatted: `${kpc} KPC`, domain: 'galactic' };
  }

  /**
   * Toggles between cinematic left-third composition and centered scientific inspection.
   */
  public toggleFramingOffset(): boolean {
    if (Math.abs(this.targetNdcOffset.x) > 0.05) {
      // Switch to centered inspection
      this.targetNdcOffset.set(0, 0);
      this.shotMode = 'free_inspection';
      return false; // isCentered = true
    } else {
      // Restore cinematic observation
      const profile = this.focusedObject
        ? (BODY_FRAMING_PROFILES[this.focusedObject.name] || DEFAULT_PLANET_FRAMING)
        : DEFAULT_PLANET_FRAMING;
      this.targetNdcOffset.set(profile.ndcOffsetX, profile.ndcOffsetY);
      this.shotMode = 'cinematic_observation';
      return true; // isCinematic = true
    }
  }

  // --- INTERACTION CONTROLS ---

  private onMouseDown = (e: MouseEvent): void => {
    this.lastInteractionTime = performance.now();

    // Interruption: if a transition is in flight and user interacts, cancel it immediately
    if (this.transition) {
      this.transition = null;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.orbitPivot);
      this.spherical.setFromVector3(offset);
      this.targetSpherical.copy(this.spherical);
    }

    if (e.button === 0) {
      if (e.shiftKey) {
        this.isPanning = true;
      } else {
        this.isOrbiting = true;
      }
    } else if (e.button === 2) {
      this.isPanning = true;
    }

    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  private onMouseUp = (): void => {
    this.isOrbiting = false;
    this.isPanning = false;
    this.lastInteractionTime = performance.now();
  };

  private onMouseMove = (e: MouseEvent): void => {
    this.lastInteractionTime = performance.now();
    if (!this.isOrbiting && !this.isPanning) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    if (this.isOrbiting) {
      const rotateSpeed = 0.005;
      this.targetSpherical.theta -= deltaX * rotateSpeed;
      this.targetSpherical.phi -= deltaY * rotateSpeed;
      // Clamp phi to prevent pole flip
      this.targetSpherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.targetSpherical.phi));
    } else if (this.isPanning) {
      const panSpeed = this.spherical.radius * 0.001;
      const camRight = new THREE.Vector3();
      const camUp = new THREE.Vector3();
      this.camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

      this.targetPanOffset.addScaledVector(camRight, -deltaX * panSpeed);
      this.targetPanOffset.addScaledVector(camUp, deltaY * panSpeed);
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    this.lastInteractionTime = performance.now();

    if (this.transition) {
      this.transition = null;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.orbitPivot);
      this.spherical.setFromVector3(offset);
      this.targetSpherical.copy(this.spherical);
    }

    // Logarithmic zoom scaling across 9 orders of magnitude
    const zoomFactor = Math.pow(0.92, e.deltaY * 0.012);
    const isBlackHole = this.focusedObject && (this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*');
    const minDistance = isBlackHole ? 65.0 : (this.focusedObject ? this.focusedRadius * 1.15 : 0.35);
    const maxDistance = 180000.0;

    this.targetSpherical.radius = Math.max(
      minDistance,
      Math.min(maxDistance, this.targetSpherical.radius * zoomFactor)
    );
  };

  private onContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
  };

  // Touch Support
  private onTouchStart = (e: TouchEvent): void => {
    this.lastInteractionTime = performance.now();
    if (this.transition) {
      this.transition = null;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.orbitPivot);
      this.spherical.setFromVector3(offset);
      this.targetSpherical.copy(this.spherical);
    }

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
    }

    if (this.activeTouches.size === 2) {
      const touches = Array.from(this.activeTouches.values());
      this.initialPinchDist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      this.initialRadiusOnPinch = this.targetSpherical.radius;
    }
  };

  private onTouchMove = (e: TouchEvent): void => {
    this.lastInteractionTime = performance.now();
    if (this.activeTouches.size === 1 && e.touches.length === 1) {
      const touch = e.touches[0];
      const prev = this.activeTouches.get(touch.identifier);
      if (prev) {
        const deltaX = touch.clientX - prev.x;
        const deltaY = touch.clientY - prev.y;
        this.targetSpherical.theta -= deltaX * 0.006;
        this.targetSpherical.phi -= deltaY * 0.006;
        this.targetSpherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.targetSpherical.phi));
        this.activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
    } else if (this.activeTouches.size >= 2 && e.touches.length >= 2) {
      const touches = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      if (this.initialPinchDist > 0) {
        const scale = this.initialPinchDist / dist;
        const isBlackHole = this.focusedObject && (this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*');
        const minDistance = isBlackHole ? 65.0 : (this.focusedObject ? this.focusedRadius * 1.15 : 0.35);
        this.targetSpherical.radius = Math.max(minDistance, Math.min(180000.0, this.initialRadiusOnPinch * scale));
      }
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    this.lastInteractionTime = performance.now();
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.activeTouches.delete(e.changedTouches[i].identifier);
    }
    if (this.activeTouches.size < 2) {
      this.initialPinchDist = 0;
    }
  };

  private setupEventListeners(element: HTMLElement): void {
    this.domElement = element;
    if (element && element.addEventListener) {
      element.addEventListener('mousedown', this.onMouseDown);
      element.addEventListener('wheel', this.onWheel, { passive: false });
      element.addEventListener('contextmenu', this.onContextMenu);
      element.addEventListener('touchstart', this.onTouchStart, { passive: true });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('touchmove', this.onTouchMove, { passive: true });
      window.addEventListener('touchend', this.onTouchEnd, { passive: true });
    }
  }

  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public dispose(): void {
    if (this.domElement && this.domElement.removeEventListener) {
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.domElement.removeEventListener('wheel', this.onWheel);
      this.domElement.removeEventListener('contextmenu', this.onContextMenu);
      this.domElement.removeEventListener('touchstart', this.onTouchStart);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
    }
  }
}
