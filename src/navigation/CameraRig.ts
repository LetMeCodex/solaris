import * as THREE from 'three';
import { COSMIC_SCALE, KM_PER_UNIT, SYSTEM_VIEW_DISTANCE, UNITS_PER_AU } from '../rendering/Scale';
import { Starfield } from '../rendering/Starfield';
import { GALAXY_UNITS_PER_KPC } from '../rendering/MilkyWayGalaxy';
import { DEFAULT_SGR_A_CONFIG } from '../rendering/SagittariusAStar';
import { SAGITTARIUS_A_STAR_DATA } from '../data/SagittariusAStarData';
import { CoordinateFrames } from '../astronomy/CoordinateFrames';

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
    targetCoverageY: 1.2,   // ~25 r_s away, outside the disk, through a long lens
    ndcOffsetX: 0.42,       // hole on the right third, the disk stretching away to the left
    ndcOffsetY: 0.02,
    fov: 28.0,              // telephoto: the shadow still spans ~45% of the frame height
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

/**
 * Observation lens (vertical FOV, degrees). Three.js FOV is vertical, so on a 16:9 screen this is
 * ≈ 87° horizontally: wide enough that an off-centre globe shows real rectilinear perspective
 * stretch towards the frame edge — the "camera lens" look of the reference footage.
 */
export const OBSERVATION_FOV_DEG = 55.0;

/**
 * The reference shot holds 13,517 km above Earth's surface, i.e. 2.12 Earth radii of altitude.
 * Altitude scales with R^0.65 so the real size differences read on screen: giants overfill the
 * frame (Jupiter ≈ 44° angular radius, Uranus/Neptune ≈ 32°), Earth ≈ 19°, Mars ≈ 14°, the Moon
 * ≈ 10°, while small moons are held at ≥ 4.5° so they stay inspectable.
 */
export const REFERENCE_ALTITUDE_EARTH_RADII = 2.12;
const EARTH_RADIUS_KM = 6371.0;
/** Smallest apparent size for tiny moons and asteroids: 4.5° angular radius. */
const MAX_OBSERVATION_RATIO = 1 / Math.sin((4.5 * Math.PI) / 180);

/** Ratio (camera-to-centre distance) / (body radius) for an observation shot of a body. */
export function observationDistanceRatio(physicalRadiusKm: number, minRatio: number = 1.25): number {
  const k = 1.0 + REFERENCE_ALTITUDE_EARTH_RADII * Math.pow(EARTH_RADIUS_KM / Math.max(1e-3, physicalRadiusKm), 0.65);
  return Math.max(minRatio, Math.min(MAX_OBSERVATION_RATIO, k));
}

/** Angular radius (degrees) of a sphere seen from distance ratio k = d / R. */
export function angularRadiusDeg(distanceRatio: number): number {
  return (Math.asin(Math.min(1, 1 / distanceRatio)) * 180) / Math.PI;
}

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
  private lastRadius: number = SYSTEM_VIEW_DISTANCE;
  private zoomRate: number = 0;
  private lastUpdateTime: number = performance.now();
  private hasMotionSample: boolean = false;
  private motionBasis: 'absolute' | 'relative' = 'relative';
  private tmpRelPos: THREE.Vector3 = new THREE.Vector3();

  // Smooth spherical coordinates (radius = observer distance from orbit pivot)
  private spherical: THREE.Spherical = new THREE.Spherical(SYSTEM_VIEW_DISTANCE, Math.PI * 0.30, Math.PI * 0.25);
  private targetSpherical: THREE.Spherical = new THREE.Spherical(SYSTEM_VIEW_DISTANCE, Math.PI * 0.30, Math.PI * 0.25);

  // User Pan offset in camera plane
  private panOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private targetPanOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Target tracking state
  public focusedObject: THREE.Object3D | null = null;
  public focusDistance: number = 30;
  public focusedRadius: number = 2.8;
  /** Physical radius (km) of the focused body, used to convert close-up distances to km. */
  public focusedPhysicalRadiusKm: number | null = null;
  /**
   * Lowest permitted altitude above the focused body's surface (render units), set by the
   * Planetary Explorer from the imagery resolution. null = default close-approach limit.
   */
  public surfaceMinAltitude: number | null = null;
  /**
   * Zooming out from a body hands the orbit pivot over to the Sun. The hand-off begins once the
   * camera is this fraction of the body's distance from the Sun away from it (true scale: a few
   * thousand units around Mercury, ~400,000 around Neptune), and is complete at 4x that.
   */
  private static readonly HANDOFF_FRACTION = 0.22;

  // Transition state
  private transition: CameraTransition | null = null;
  private transitProgress: number = 1;
  /** Dutch angle (rad). The black hole is framed with the disk rising to the right. */
  private roll: number = 0;
  private static readonly BLACK_HOLE_ROLL = -0.2;
  /**
   * Screen "up". Normally ecliptic north; for the black hole it turns to the disk's own axis, so
   * its accretion disk (in the galactic plane, ~60° from the ecliptic) reads as a horizon.
   */
  private upVec: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private tmpUp: THREE.Vector3 = new THREE.Vector3();
  private tmpQuat: THREE.Quaternion = new THREE.Quaternion();

  private updateUpVector(blackHole: boolean, rate: number): void {
    const target = this.tmpUp.set(0, 1, 0);
    const obj = this.transition ? this.transition.targetObject : this.focusedObject;
    if (blackHole && obj) {
      obj.getWorldQuaternion(this.tmpQuat);
      target.applyQuaternion(this.tmpQuat);
    }
    this.upVec.lerp(target, rate).normalize();
    this.camera.up.copy(this.upVec);
  }

  /** The flight in progress (for the HUD), or null when the camera is holding a shot. */
  public getTransit(): { progress: number; target: string } | null {
    // While another controller (surface view, horizon) owns the camera there is no flight, even if
    // one was interrupted: otherwise the HUD would stay in travel mode and hide the surface panel
    if (!this.transition || this.suspended) return null;
    return { progress: this.transitProgress, target: this.transition.targetBodyName };
  }

  /**
   * Long flights get the time they deserve: duration grows with the orders of magnitude crossed,
   * so a hop to a neighbouring moon stays brisk and a crossing of the system can breathe.
   */
  private flightDuration(baseMs: number, fromPivot: THREE.Vector3, toPivot: THREE.Vector3, r0: number, r1: number): number {
    if (baseMs < 1000) return baseMs;
    const travelSpan = Math.log10(1 + fromPivot.distanceTo(toPivot) / Math.max(1e-6, r0, r1));
    const zoomSpan = Math.abs(Math.log10(Math.max(1e-6, r1) / Math.max(1e-6, r0)));
    return Math.min(9000, Math.max(baseMs, 1800 + travelSpan * 1150 + zoomSpan * 380));
  }

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
  /** `damping` rescaled to the actual frame time (it is tuned for 60 fps). */
  private frameDamping: number = 0.12;
  private lastDampingTime = performance.now();

  // Free-look ("steer") offset applied on top of the composed shot: the observer turns their head
  // in place, like the reference footage, instead of orbiting the target
  private lookYaw: number = 0;
  private lookPitch: number = 0;
  private targetLookYaw: number = 0;
  private targetLookPitch: number = 0;
  private isLooking: boolean = false;
  private heldLookKeys: Set<string> = new Set();
  private lastLookUpdate: number = performance.now();
  private static readonly LOOK_KEY_RATE = 0.9; // rad/s at the observation lens
  private static readonly MAX_LOOK_PITCH = THREE.MathUtils.degToRad(80);

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
    const worldUp = this.upVec;

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
      const progress = this.transition.durationMs > 0
        ? Math.min(1.0, elapsed / this.transition.durationMs)
        : 1.0;
      this.transitProgress = progress;

      // Smootherstep: no velocity or acceleration jump at either end of the shot
      const ease = progress * progress * progress * (progress * (progress * 6 - 15) + 10);
      // 0 at both ends, 1 at mid-flight: drives the altitude arc, the lens breathing and the bank
      const flight = Math.sin(Math.PI * ease);

      // Real-time moving target tracking during transition
      if (this.transition.targetObject) {
        this.transition.targetObject.updateWorldMatrix(true, false);
        this.transition.targetObject.getWorldPosition(this.subjectAnchor);
      } else {
        this.subjectAnchor.set(0, 0, 0);
      }

      const start = this.transition.startSpherical;
      const r0 = Math.max(1e-6, start.radius);
      const r1 = Math.max(1e-6, this.transition.targetDistance);
      // How far the shot travels compared with the framing distances: a hop between neighbouring
      // moons stays low, a flight across the system climbs out until the worlds shrink to points
      const travel = this.transition.startPivot.distanceTo(this.subjectAnchor);
      const arc = Math.min(9.5, Math.log1p(travel / Math.max(r0, r1)) * 0.82);

      // Interpolate optical parameters; the lens widens at cruise for a sense of speed
      this.camera.fov = THREE.MathUtils.lerp(this.transition.startFov, this.transition.targetFov, ease)
        + 9.0 * flight * Math.min(1, arc / 1.6);
      this.currentNdcOffset.x = THREE.MathUtils.lerp(this.transition.startNdcOffsetX, this.transition.targetNdcOffsetX, ease);
      this.currentNdcOffset.y = THREE.MathUtils.lerp(this.transition.startNdcOffsetY, this.transition.targetNdcOffsetY, ease);

      // Interpolate spherical orbit coordinates: shortest way round, distance in log space so a
      // change of scale reads as a steady dolly rather than a last-frame plunge
      let dTheta = this.transition.targetTheta - start.theta;
      dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
      const curTheta = start.theta + dTheta * ease;
      const curPhi = THREE.MathUtils.lerp(start.phi, this.transition.targetPhi, ease);
      const curRadius = Math.exp(THREE.MathUtils.lerp(Math.log(r0), Math.log(r1), ease) + arc * flight);

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
      this.updateUpVector(/sagittarius/i.test(this.transition.targetBodyName), Math.min(1, 0.02 + ease * 0.08));
      this.camera.lookAt(this.aimPoint);
      this.applyLookOffset();
      // Bank gently into the turn, like a craft rather than a tripod
      const bank = Math.sign(dTheta) * Math.min(0.11, Math.abs(dTheta) * 0.045) * flight;
      const rollTarget = /sagittarius/i.test(this.transition.targetBodyName) ? CameraRig.BLACK_HOLE_ROLL : 0;
      this.roll += (rollTarget - this.roll) * Math.min(1, this.frameDamping * 0.35 + ease * 0.02);
      if (bank !== 0 || this.roll !== 0) this.camera.rotateZ(this.roll - bank);

      // Dynamic depth buffer calibration: razor-sharp closeups without z-fighting or skybox clipping
      const clearance = Math.max(this.focusedObject ? 1e-4 : 0.05, curRadius - this.focusedRadius);
      this.camera.near = Math.max(this.focusedObject ? 1e-5 : 0.04, Math.min(30.0 * this.farScale(), clearance * 0.08));
      this.camera.far = this.farPlane(curRadius);
      this.camera.updateProjectionMatrix();

      // During a flight the camera genuinely travels: sample absolute motion.
      this.trackMotion(this.tmpRelPos.copy(this.camera.position), curRadius, 'absolute');

      if (progress >= 1.0) {
        if (this.transition.onComplete) this.transition.onComplete();
        this.spherical.set(curRadius, curPhi, curTheta);
        this.targetSpherical.copy(this.spherical);
        this.panOffset.set(0, 0, 0);
        this.targetPanOffset.set(0, 0, 0);
        this.transition = null;
        this.transitProgress = 1;
      }
      return;
    }

    // --- 2. ACTIVE TRACKING & USER INTERACTION ---
    // Follow the tracked body in real time as it moves along its Keplerian orbit
    let currentAnchor = this.subjectAnchor;
    if (this.focusedObject) {
      this.focusedObject.updateWorldMatrix(true, false);
      this.focusedObject.getWorldPosition(this.subjectAnchor);

      // Seamless anchor handoff: as the observer zooms out well beyond the body (see handoffDistance),
      // the orbit pivot smoothly transfers from the individual body towards the Solar System barycenter (0,0,0).
      // For Sagittarius A*, preserve its Galactic Center anchor to allow wide deep-space black hole views.
      const r = this.spherical.radius;
      const isBlackHole = this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*';
      const h0 = this.handoffDistance();
      if (!isBlackHole && r > h0) {
        const handoffFactor = Math.min(1.0, (r - h0) / (h0 * 3.0));
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
    this.currentNdcOffset.x += (this.targetNdcOffset.x - this.currentNdcOffset.x) * this.frameDamping;
    this.currentNdcOffset.y += (this.targetNdcOffset.y - this.currentNdcOffset.y) * this.frameDamping;

    // Orbit pivot tracks effective anchor + smoothed pan offset
    this.panOffset.lerp(this.targetPanOffset, this.frameDamping);
    this.orbitPivot.copy(currentAnchor).add(this.panOffset);

    // Apply idle celestial drift if enabled and user has been idle for > 3s
    if (
      this.enableIdleDrift &&
      !this.isOrbiting &&
      !this.isPanning &&
      this.shotMode === 'cinematic_observation' &&
      !(this.altitudeInRadii() < 4)
    ) {
      const now = performance.now();
      if ((now - this.lastInteractionTime) > 3000) {
        if (this.isBlackHoleFocus()) {
          // A slow push-in towards the shadow, as in long-lens black hole footage
          this.targetSpherical.theta += 0.00002;
          this.targetSpherical.radius = Math.max(this.focusDistance * 0.7, this.targetSpherical.radius * (1 - 0.00005));
        } else {
          this.targetSpherical.theta += 0.00008; // Delicate, imperceptible celestial drift
        }
      }
    }

    // Smooth spherical coordinates
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * this.frameDamping;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * this.frameDamping;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * this.frameDamping;

    // Strict polar singularity protection: clamps phi between 0.02 and PI - 0.02
    this.spherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.spherical.phi));

    // Observer camera position in 3D world space
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.orbitPivot).add(offset);

    // Compute optical aim point ensuring the target is framed at currentNdcOffset
    const w = this.compositionWeight();
    this.aimPoint = this.calculateAimPoint(
      this.camera.position,
      this.orbitPivot,
      this.currentNdcOffset.x * w,
      this.currentNdcOffset.y * w,
      this.camera.fov,
      this.camera.aspect
    );
    this.updateUpVector(this.isBlackHoleFocus(), this.frameDamping * 0.4);
    this.camera.lookAt(this.aimPoint);
    this.applyLookOffset();
    const rollTarget = this.isBlackHoleFocus() ? CameraRig.BLACK_HOLE_ROLL : 0;
    this.roll += (rollTarget - this.roll) * this.frameDamping * 0.35;
    if (Math.abs(this.roll) > 1e-5) this.camera.rotateZ(this.roll);

    // Dynamic depth buffer calibration across 9 orders of magnitude
    const distToCenter = this.spherical.radius;
    const clearance = Math.max(this.focusedObject ? 1e-4 : 0.05, distToCenter - this.focusedRadius);
    // Close to a surface the near plane follows the altitude down (Planetary Explorer)
    this.camera.near = Math.max(this.focusedObject ? 1e-5 : 0.04, Math.min(30.0 * this.farScale(), clearance * 0.08));
    this.camera.far = this.farPlane(distToCenter);
    this.camera.updateProjectionMatrix();

    // While tracking a body, measure motion relative to the orbit pivot: simply following a planet
    // along its orbit is not "travel" and must not trigger speed streaks.
    this.trackMotion(this.tmpRelPos.subVectors(this.camera.position, this.orbitPivot), this.spherical.radius, 'relative');
  }

  /** Update velocity / zoom-rate telemetry from a position sample (absolute or pivot-relative). */
  private trackMotion(samplePos: THREE.Vector3, radius: number, basis: 'absolute' | 'relative'): void {
    const now = performance.now();
    const dt = Math.max(0.001, (now - this.lastUpdateTime) * 0.001);
    // Switching between absolute and pivot-relative sampling would produce a fake velocity spike
    if (basis !== this.motionBasis) {
      this.motionBasis = basis;
      this.hasMotionSample = false;
    }
    if (this.hasMotionSample) {
      this.currentVelocity.subVectors(samplePos, this.lastCameraPos).divideScalar(dt);
      if (this.lastRadius > 0.001) {
        this.zoomRate = (Math.log(radius) - Math.log(this.lastRadius)) / dt;
      }
    }
    this.hasMotionSample = true;
    this.lastCameraPos.copy(samplePos);
    this.lastRadius = radius;
    this.lastUpdateTime = now;
  }

  /** While true another controller (the surface observer) owns the camera and the input. */
  public suspended = false;

  /**
   * Adopt the camera's current pose (after another controller moved it) so the next flight or
   * drag continues smoothly from there.
   */
  public syncFromCamera(): void {
    this.transition = null;
    this.camera.up.set(0, 1, 0);
    this.upVec.set(0, 1, 0);
    if (this.focusedObject) {
      this.focusedObject.updateWorldMatrix(true, false);
      this.focusedObject.getWorldPosition(this.subjectAnchor);
    }
    this.orbitPivot.copy(this.subjectAnchor);
    this.panOffset.set(0, 0, 0);
    this.targetPanOffset.set(0, 0, 0);
    this.spherical.setFromVector3(new THREE.Vector3().subVectors(this.camera.position, this.orbitPivot));
    this.targetSpherical.copy(this.spherical);
    this.resetLook();
    this.lookYaw = 0;
    this.lookPitch = 0;
    this.hasMotionSample = false;
  }

  public update(): void {
    if (this.suspended) return;
    const now = performance.now();
    const dt = Math.min(0.25, Math.max(0.001, (now - this.lastDampingTime) / 1000));
    this.lastDampingTime = now;
    this.frameDamping = 1 - Math.pow(1 - this.damping, dt * 60);
    this.updateLook();
    this.updateCameraPosition();
  }

  /** Integrate held arrow keys and damp the free-look angles. */
  private updateLook(): void {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0, (now - this.lastLookUpdate) * 0.001));
    this.lastLookUpdate = now;

    if (this.heldLookKeys.size > 0) {
      const rate = CameraRig.LOOK_KEY_RATE * (this.camera.fov / OBSERVATION_FOV_DEG) * dt;
      if (this.heldLookKeys.has('ArrowLeft')) this.targetLookYaw += rate;
      if (this.heldLookKeys.has('ArrowRight')) this.targetLookYaw -= rate;
      if (this.heldLookKeys.has('ArrowUp')) this.targetLookPitch += rate;
      if (this.heldLookKeys.has('ArrowDown')) this.targetLookPitch -= rate;
      this.lastInteractionTime = now;
    }
    this.targetLookPitch = THREE.MathUtils.clamp(this.targetLookPitch, -CameraRig.MAX_LOOK_PITCH, CameraRig.MAX_LOOK_PITCH);

    this.lookYaw += (this.targetLookYaw - this.lookYaw) * this.frameDamping;
    this.lookPitch += (this.targetLookPitch - this.lookPitch) * this.frameDamping;
  }

  /** Turn the camera in place by the free-look angles (yaw about its up axis, then pitch). */
  private applyLookOffset(): void {
    if (Math.abs(this.lookYaw) < 1e-6 && Math.abs(this.lookPitch) < 1e-6) return;
    this.camera.rotateY(this.lookYaw);
    this.camera.rotateX(this.lookPitch);
  }

  private isBlackHoleFocus(): boolean {
    return !!this.focusedObject && (this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*');
  }

  /**
   * Camera distance from the focused body at which the pivot starts handing over to the Sun
   * (see HANDOFF_FRACTION). At least a few hundred units so moons of a planet stay in its frame.
   */
  private handoffDistance(): number {
    if (!this.focusedObject) return 0;
    this.focusedObject.getWorldPosition(this.tmpHandoff);
    return Math.max(400.0, this.tmpHandoff.length() * CameraRig.HANDOFF_FRACTION);
  }
  private tmpHandoff = new THREE.Vector3();

  /** 1 inside the Solar System, growing as the camera leaves it for the stars and the galaxy. */
  private farScale(): number {
    return Math.max(1, this.camera.position.length() / (60 * UNITS_PER_AU));
  }

  /** Far plane: past the sky sphere and the Milky Way shells, and from anywhere in the system past the Sun. */
  private farPlane(viewRadius: number): number {
    // The Milky Way sky shells reach 13,000 × COSMIC_SCALE; anything they extend past is clipped
    return Math.max(30000.0 * COSMIC_SCALE, this.camera.position.length() * 2.5, viewRadius * 35);
  }

  /** Closest permitted camera-to-centre distance for the current focus. */
  public minimumDistance(): number {
    if (this.isBlackHoleFocus()) return 65.0;
    if (!this.focusedObject) return 0.35;
    if (this.surfaceMinAltitude !== null) return this.focusedRadius + this.surfaceMinAltitude;
    return this.focusedRadius * 1.15;
  }

  /** Altitude above the focused body's surface in body radii (Infinity when nothing is focused). */
  public altitudeInRadii(radius: number = this.spherical.radius): number {
    if (!this.focusedObject || this.focusedRadius <= 0 || this.isBlackHoleFocus()) return Infinity;
    return Math.max(0, radius / this.focusedRadius - 1);
  }

  /**
   * Off-centre composition fades out as the camera descends towards a surface, so close-ups look
   * straight down at the point under the view centre (map-style), and returns as it climbs.
   */
  private compositionWeight(): number {
    const alt = this.altitudeInRadii();
    if (!isFinite(alt)) return 1;
    return THREE.MathUtils.smoothstep(alt, 0.25, 1.2);
  }

  /**
   * Rotate the camera's orbit offset by `q` (world space) — used to ride along with a rotating
   * body so the ground stays put under the camera, as in Google Earth.
   */
  public applyFrameRotation(q: THREE.Quaternion): void {
    if (this.transition) return;
    const v = new THREE.Vector3().setFromSpherical(this.spherical).applyQuaternion(q);
    const t = new THREE.Vector3().setFromSpherical(this.targetSpherical).applyQuaternion(q);
    this.spherical.setFromVector3(v);
    this.targetSpherical.setFromVector3(t);
    this.makeSphericalContinuous();
  }

  /** Keep target θ within ±π of the current θ so damping never spins the long way round. */
  private makeSphericalContinuous(): void {
    const twoPi = Math.PI * 2;
    while (this.targetSpherical.theta - this.spherical.theta > Math.PI) this.targetSpherical.theta -= twoPi;
    while (this.targetSpherical.theta - this.spherical.theta < -Math.PI) this.targetSpherical.theta += twoPi;
  }

  /**
   * Fly to look straight down at a surface point of a body (Planetary Explorer).
   * @param worldDir unit vector from the body's centre to the surface point (world space)
   * @param altitude camera altitude above the surface, render units
   */
  public focusSurfacePoint(
    object: THREE.Object3D,
    radius: number,
    worldDir: THREE.Vector3,
    altitude: number,
    durationMs: number = 2200
  ): void {
    this.focusedObject = object;
    this.focusedRadius = radius;
    this.shotMode = 'free_inspection';
    this.resetLook();
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }
    const distance = Math.max(this.minimumDistance(), radius + altitude);
    const targetSph = new THREE.Spherical().setFromVector3(worldDir.clone().normalize().multiplyScalar(distance));
    targetSph.phi = Math.max(0.02, Math.min(Math.PI - 0.02, targetSph.phi));
    // Take the short way round in azimuth
    while (targetSph.theta - this.spherical.theta > Math.PI) targetSph.theta -= Math.PI * 2;
    while (targetSph.theta - this.spherical.theta < -Math.PI) targetSph.theta += Math.PI * 2;
    this.targetNdcOffset.set(0, 0);
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
      targetBodyName: object.name,
      targetShotMode: 'free_inspection',
      targetFov: OBSERVATION_FOV_DEG,
      targetNdcOffsetX: 0,
      targetNdcOffsetY: 0,
      targetDistance: distance,
      targetTheta: targetSph.theta,
      targetPhi: targetSph.phi,
      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSph);
        this.targetSpherical.copy(targetSph);
        this.camera.fov = OBSERVATION_FOV_DEG;
        this.currentNdcOffset.set(0, 0);
      },
    };
  }

  /** Smoothly return the free-look to the composed shot. */
  public resetLook(): void {
    this.targetLookYaw = 0;
    this.targetLookPitch = 0;
  }

  public getLookAngles(): { yaw: number; pitch: number } {
    return { yaw: this.lookYaw, pitch: this.lookPitch };
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
    onComplete?: () => void,
    physicalRadiusKm?: number
  ): void {
    this.focusedObject = object;
    this.focusedRadius = radius;
    this.shotMode = 'cinematic_observation';
    if (physicalRadiusKm !== undefined) this.focusedPhysicalRadiusKm = physicalRadiusKm;
    // A new shot starts looking straight at its composition
    this.targetLookYaw = 0;
    this.targetLookPitch = 0;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    object.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    // Framing profile lookup
    const profile = BODY_FRAMING_PROFILES[bodyName] || (radius < 1.0 ? DEFAULT_MOON_FRAMING : DEFAULT_PLANET_FRAMING);
    this.targetNdcOffset.set(profile.ndcOffsetX, profile.ndcOffsetY);

    const isBlackHoleShot = bodyName === 'Sagittarius A*' || bodyName === 'Sgr A*' || bodyName === 'sagittarius_a_star';

    // Observation shots: distance from the body's real radius (see observationDistanceRatio) seen
    // through the wide observation lens. Other shots keep the coverage-based framing profile.
    let shotFov = profile.fov;
    let viewingDistance: number;
    if (physicalRadiusKm !== undefined && !isBlackHoleShot) {
      // Ring systems need room; stars are kept a little further off so the corona has space
      const minRatio = profile.effectiveRadiusMultiplier ? 2.9 : (bodyName === 'Sun' ? 1.6 : 1.25);
      viewingDistance = radius * observationDistanceRatio(physicalRadiusKm, minRatio);
      shotFov = OBSERVATION_FOV_DEG;
    } else {
      viewingDistance = CameraRig.calculateViewingDistance(radius, profile, profile.fov);
    }
    this.focusDistance = viewingDistance;

    // Direction to Sun (Sun sits at 0, 0, 0)
    const toSun = new THREE.Vector3().copy(worldPos).negate();
    const isSun = toSun.lengthSq() < 1 || bodyName === 'Sun';
    if (isSun) {
      toSun.set(0, 0, 1);
    } else {
      toSun.normalize();
    }

    let cameraOffset: THREE.Vector3;
    if (isSun) {
      cameraOffset = new THREE.Vector3(0, 0.40, 1.0).normalize().multiplyScalar(viewingDistance);
    } else if (bodyName === 'Saturn') {
      // Sunlit vantage lifted ~30° out of the ring plane, on the side of the rings the Sun lights,
      // so the globe, the open ring system and its shadow on the rings are all visible
      const q = new THREE.Quaternion();
      object.getWorldQuaternion(q);
      const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
      if (pole.dot(toSun) < 0) pole.negate();
      const base = CameraRig.chooseObservationVantage(toSun, profile.ndcOffsetX);
      base.addScaledVector(pole, -base.dot(pole)).normalize();
      cameraOffset = base.multiplyScalar(Math.cos(THREE.MathUtils.degToRad(30)))
        .addScaledVector(pole, Math.sin(THREE.MathUtils.degToRad(30)))
        .normalize()
        .multiplyScalar(viewingDistance);
    } else if (bodyName === 'Sagittarius A*' || bodyName === 'Sgr A*' || bodyName === 'sagittarius_a_star') {
      // Classic Gargantua / NASA observer inclination: ~14.5° elevation above equatorial accretion disk
      // In Sgr A*'s local frame: elevation angle ~14.5° (sin = 0.25, cos = 0.968), approaching limb on left
      const objQuat = new THREE.Quaternion();
      object.getWorldQuaternion(objQuat);
      // ~7° above the disk plane: nearly edge-on, so the far side of the disk is lensed into a
      // full halo over the shadow (the Gargantua view)
      const localDir = new THREE.Vector3(0.30, 0.125, 0.95).normalize();
      const worldDir = localDir.applyQuaternion(objQuat);
      cameraOffset = worldDir.multiplyScalar(viewingDistance);
    } else {
      // Sunlit three-quarter vantage, rotated about the Sun line so that the real Milky Way band
      // fills the open sky beside the planet (see chooseObservationVantage)
      cameraOffset = CameraRig.chooseObservationVantage(toSun, profile.ndcOffsetX).multiplyScalar(viewingDistance);
    }

    const targetSph = new THREE.Spherical().setFromVector3(cameraOffset);
    // Polar singularity safety
    targetSph.phi = Math.max(0.04, Math.min(Math.PI - 0.04, targetSph.phi));

    // Reset pan offset
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);

    durationMs = this.flightDuration(durationMs, this.orbitPivot, worldPos, this.spherical.radius, viewingDistance);

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
      targetFov: shotFov,
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
        this.camera.fov = shotFov;
        this.currentNdcOffset.set(profile.ndcOffsetX, profile.ndcOffsetY);
        if (onComplete) onComplete();
      }
    };
  }

  /**
   * Pick the observer's direction (unit vector from the planet towards the camera) for a sunlit
   * observation shot. Candidates keep a fixed ~55° phase angle (lit hemisphere, terminator and limb
   * all visible) and are rotated around the Sun–planet line. Each is scored by how close the open
   * part of the frame — the side opposite the off-centre planet — lies to the galactic plane, with
   * a bonus towards the bright galactic centre and a mild preference for looking slightly down.
   */
  public static chooseObservationVantage(toSun: THREE.Vector3, ndcOffsetX: number = -0.34): THREE.Vector3 {
    const s = toSun.clone().normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const a = new THREE.Vector3().crossVectors(worldUp, s);
    if (a.lengthSq() < 1e-8) a.set(1, 0, 0);
    a.normalize();
    const b = new THREE.Vector3().crossVectors(s, a).normalize();

    const gal = CoordinateFrames.galacticBasisThree();
    const ngp = new THREE.Vector3(...gal.z);
    const gc = new THREE.Vector3(...gal.x);

    const phase = THREE.MathUtils.degToRad(55.0);
    // The open sky sits on the opposite side of the frame from the planet
    const openSide = ndcOffsetX <= 0 ? 1 : -1;

    let best = new THREE.Vector3().copy(s).multiplyScalar(Math.cos(phase)).addScaledVector(a, Math.sin(phase));
    let bestScore = -Infinity;
    const dir = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const camUp = new THREE.Vector3();
    const openSky = new THREE.Vector3();

    for (let i = 0; i < 24; i++) {
      const alpha = (i / 24) * Math.PI * 2;
      dir.copy(s).multiplyScalar(Math.cos(phase))
        .addScaledVector(a, Math.sin(phase) * Math.cos(alpha))
        .addScaledVector(b, Math.sin(phase) * Math.sin(alpha))
        .normalize();
      if (Math.abs(dir.y) > 0.75) continue; // avoid near-polar views of the ecliptic

      forward.copy(dir).negate();
      right.crossVectors(forward, worldUp).normalize();
      camUp.crossVectors(right, forward).normalize();
      openSky.copy(forward).addScaledVector(right, 0.85 * openSide).normalize();

      const bandScore = 1.0 - Math.abs(openSky.dot(ngp));
      const coreScore = Math.max(0, openSky.dot(gc)) * 0.35;
      const elevationPenalty = Math.abs(dir.y - 0.25) * 0.4;
      const score = bandScore + coreScore - elevationPenalty;
      if (score > bestScore) {
        bestScore = score;
        best = dir.clone();
      }
    }
    return best.normalize();
  }

  public focusOn(object: THREE.Object3D, radius: number, durationMs: number = 1800): void {
    this.focusCinematic(object, radius, object.name, durationMs);
  }

  public resetToOverview(durationMs: number = 1600): void {
    this.resetLook();
    this.focusedObject = null;
    this.focusedRadius = 262.2;
    this.shotMode = 'deep_space_overview';
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);
    this.targetNdcOffset.set(0, 0);

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    const targetSpherical = new THREE.Spherical(SYSTEM_VIEW_DISTANCE, Math.PI * 0.30, Math.PI * 0.25);
    durationMs = this.flightDuration(durationMs, this.orbitPivot, CameraRig.ORIGIN_VEC, this.spherical.radius, SYSTEM_VIEW_DISTANCE);

    this.transition = {
      startPos: this.camera.position.clone(),
      startAimPoint: this.aimPoint.clone(),
      startFov: this.camera.fov,
      startNdcOffsetX: this.currentNdcOffset.x,
      startNdcOffsetY: this.currentNdcOffset.y,
      startPivot: this.orbitPivot.clone(),
      startSpherical: this.spherical.clone(),

      targetObject: null,
      targetRadius: 262.2,
      targetBodyName: 'Overview',
      targetShotMode: 'deep_space_overview',
      targetFov: 45.0,
      targetNdcOffsetX: 0.0,
      targetNdcOffsetY: 0.0,
      targetDistance: SYSTEM_VIEW_DISTANCE,
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
    preferredPhi?: number,
    preferredDirection?: THREE.Vector3
  ): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    let targetSpherical: THREE.Spherical;
    if (preferredDirection) {
      targetSpherical = new THREE.Spherical().setFromVector3(preferredDirection.clone().normalize().multiplyScalar(distance));
      targetSpherical.phi = Math.max(0.04, Math.min(Math.PI - 0.04, targetSpherical.phi));
    } else {
      const curTheta = this.targetSpherical.theta;
      const curPhi = preferredPhi !== undefined
        ? preferredPhi
        : Math.max(0.08, Math.min(Math.PI * 0.45, this.targetSpherical.phi));
      targetSpherical = new THREE.Spherical(distance, curPhi, curTheta);
    }

    this.shotMode = shotMode;
    this.targetPanOffset.set(0, 0, 0);

    const targetNdcX = shotMode === 'cinematic_observation' ? -0.34 : 0.0;
    const targetNdcY = 0.0;
    durationMs = this.flightDuration(durationMs, this.orbitPivot, this.orbitPivot, this.spherical.radius, distance);

    this.transition = {
      startPos: this.camera.position.clone(),
      startAimPoint: this.aimPoint.clone(),
      startFov: this.camera.fov,
      startNdcOffsetX: this.currentNdcOffset.x,
      startNdcOffsetY: this.currentNdcOffset.y,
      startPivot: this.orbitPivot.clone(),
      startSpherical: this.spherical.clone(),

      targetObject: distance < this.handoffDistance() ? this.focusedObject : null,
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
        if (distance >= this.handoffDistance()) {
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
    let targetDist = SYSTEM_VIEW_DISTANCE;
    let targetShot: CameraShotMode = 'scientific_overview';
    let targetFov = 45.0;
    let targetPhi: number | undefined = undefined;
    let targetDirection: THREE.Vector3 | undefined = undefined;

    switch (domain) {
      case 'planetary':
        targetDist = this.focusedRadius > 0 ? this.focusedRadius * 2.8 : 12.0;
        targetShot = 'cinematic_observation';
        targetFov = 40.0;
        break;
      case 'inner_system':
        // Out to Mars and the asteroid belt
        targetDist = 4.2 * UNITS_PER_AU;
        targetShot = 'scientific_overview';
        targetFov = 45.0;
        targetPhi = Math.PI * 0.32;
        break;
      case 'outer_system':
        // The giants and the Kuiper belt
        targetDist = SYSTEM_VIEW_DISTANCE;
        targetShot = 'deep_space_overview';
        targetFov = 46.0;
        targetPhi = Math.PI * 0.28;
        break;
      case 'interstellar':
        targetDist = 8200.0 * COSMIC_SCALE;
        targetShot = 'deep_space_overview';
        targetFov = 48.0;
        targetPhi = Math.PI * 0.26;
        break;
      case 'galactic':
        targetDist = 52000.0 * COSMIC_SCALE;
        targetShot = 'deep_space_overview';
        targetFov = 48.0;
        {
          // The galactic plane is inclined ~60° to the ecliptic, so an ecliptic-based elevation would
          // show the disk nearly edge-on. Look down from 35° off the north galactic pole, from the
          // anti-centre side, so the spiral disk spreads out beyond the Sun.
          const gal = CoordinateFrames.galacticBasisThree();
          const tilt = THREE.MathUtils.degToRad(35.0);
          targetDirection = new THREE.Vector3(...gal.z).multiplyScalar(Math.cos(tilt))
            .addScaledVector(new THREE.Vector3(...gal.x), -Math.sin(tilt));
        }
        break;
    }

    this.transitionToDistance(targetDist, targetFov, targetShot, durationMs, targetPhi, targetDirection);
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
    const fmtKm = (km: number) => `${Math.round(km).toLocaleString('en-US')} KM`;

    if (this.focusedObject && (this.focusedObject.name.includes('sagittarius') || this.focusedObject.name === 'Sagittarius A*')) {
      // Black-hole close-ups are drawn in units of the Schwarzschild radius
      const rs = d / DEFAULT_SGR_A_CONFIG.schwarzschildRadius;
      const km = rs * SAGITTARIUS_A_STAR_DATA.derivedParameters.schwarzschildRadiusKm;
      return { distance: d, formatted: `${rs.toFixed(1)} r_s (${fmtKm(km)})`, domain: 'planetary' };
    }

    // The Solar System is drawn to true scale: one conversion for everything inside it. Beyond it
    // the neighbour stars and the galaxy are drawn on their own stylised scales.
    const focusedOnBody = this.focusedObject !== null && d < this.handoffDistance();
    if (d < 30.0 || (focusedOnBody && d < 0.05 * UNITS_PER_AU)) {
      // Around a body, report altitude above its surface (as an observation camera would)
      if (this.focusedObject && this.focusedRadius > 0 && d > this.focusedRadius) {
        return { distance: d, formatted: `ALT ${fmtKm((d - this.focusedRadius) * KM_PER_UNIT)}`, domain: 'planetary' };
      }
      return { distance: d, formatted: fmtKm(d * KM_PER_UNIT), domain: 'planetary' };
    }
    if (d < 3500.0 * COSMIC_SCALE) {
      const au = d / UNITS_PER_AU;
      const domain = d < 6 * UNITS_PER_AU ? 'inner_system' : 'outer_system';
      return { distance: d, formatted: `${au.toFixed(au < 10 ? 2 : au < 1000 ? 1 : 0)} AU`, domain };
    }
    if (d < 25000.0 * COSMIC_SCALE) {
      // Local-neighbourhood star layer: 700 + 38 units per parsec (x the cosmic scale)
      const pc = Math.max(0, d / COSMIC_SCALE - Starfield.LOCAL_STAR_OFFSET) / Starfield.LOCAL_UNITS_PER_PC;
      return { distance: d, formatted: `${(pc * 3.26156).toFixed(1)} LY`, domain: 'interstellar' };
    }
    return { distance: d, formatted: `${(d / (GALAXY_UNITS_PER_KPC * COSMIC_SCALE)).toFixed(1)} KPC`, domain: 'galactic' };
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
    if (this.suspended) return;
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
        this.beginGrab(e.clientX, e.clientY);
      }
    } else if (e.button === 1) {
      this.isPanning = true;
    } else if (e.button === 2) {
      // Right-drag steers the observer's view in place
      this.isLooking = true;
    }

    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  private onMouseUp = (): void => {
    this.grabLocal = null;
    this.isOrbiting = false;
    this.isPanning = false;
    this.isLooking = false;
    this.lastInteractionTime = performance.now();
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (this.suspended) return;
    this.lastInteractionTime = performance.now();
    if (!this.isOrbiting && !this.isPanning && !this.isLooking) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    if (this.isLooking) {
      // Angular speed proportional to the lens so a drag moves the sky with the cursor
      const radPerPx = THREE.MathUtils.degToRad(this.camera.fov) / Math.max(1, this.domElement.clientHeight || 800);
      this.targetLookYaw += deltaX * radPerPx;
      this.targetLookPitch += deltaY * radPerPx;
      return;
    }

    if (this.isOrbiting) {
      // Near a globe the drag grabs the surface: the point under the cursor follows the cursor
      if (this.grabSurface(e.clientX, e.clientY)) return;
      const rotateSpeed = 0.005 * Math.min(1, Math.max(0.0005, this.altitudeInRadii()));
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
    if (this.suspended) return;
    e.preventDefault();
    this.lastInteractionTime = performance.now();

    if (this.transition) {
      this.transition = null;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.orbitPivot);
      this.spherical.setFromVector3(offset);
      this.targetSpherical.copy(this.spherical);
    }

    // Logarithmic zoom across 9 orders of magnitude. Around a body the zoom acts on altitude, so it
    // keeps slowing down all the way to the surface instead of stalling at a fixed distance.
    // Wheel/trackpad up (negative deltaY) zooms in, as in web maps.
    const lineScale = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
    const dy = THREE.MathUtils.clamp(e.deltaY * lineScale, -600, 600);
    // Faster away from bodies: true scale spans eleven orders of magnitude
    const close = this.focusedObject && this.targetSpherical.radius < this.focusedRadius * 40;
    const zoomFactor = Math.pow(0.92, -dy * (close ? 0.012 : 0.022));
    const minDistance = this.minimumDistance();
    const maxDistance = 180000.0 * COSMIC_SCALE;
    let next: number;
    if (this.focusedObject && !this.isBlackHoleFocus() && this.targetSpherical.radius < this.focusedRadius * 4) {
      const alt = this.targetSpherical.radius - this.focusedRadius;
      next = this.focusedRadius + alt * zoomFactor;
    } else {
      next = this.targetSpherical.radius * zoomFactor;
    }
    next = Math.max(minDistance, Math.min(maxDistance, next));
    this.zoomTowardCursor(e.clientX, e.clientY, this.targetSpherical.radius, next);
    this.targetSpherical.radius = next;
  };

  // --- Globe interaction helpers (web-map style) ---

  private raycaster = new THREE.Raycaster();
  private tmpNdc = new THREE.Vector2();
  private tmpSphere = new THREE.Sphere();

  /** World point where the ray through a client pixel meets the focused globe, or null. */
  private pickGlobe(clientX: number, clientY: number, out: THREE.Vector3, cam: THREE.Camera = this.camera): THREE.Vector3 | null {
    if (!this.focusedObject || this.isBlackHoleFocus()) return null;
    const rect = this.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    this.tmpNdc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.tmpNdc, cam);
    this.tmpSphere.set(this.orbitPivot, this.focusedRadius);
    return this.raycaster.ray.intersectSphere(this.tmpSphere, out);
  }

  /** Surface point grabbed at mouse-down, in the focused body's local frame (it rotates). */
  private grabLocal: THREE.Vector3 | null = null;
  private virtualCam = new THREE.PerspectiveCamera();

  /**
   * The camera as it will be once the damping reaches `sph`, looking at the globe centre (map
   * framing, no composition offset). Used to make drags and cursor zooms exact without waiting.
   */
  private virtualCameraAt(sph: THREE.Spherical): THREE.PerspectiveCamera {
    const v = this.virtualCam;
    v.fov = this.camera.fov;
    v.aspect = this.camera.aspect;
    v.near = this.camera.near;
    v.far = this.camera.far;
    v.updateProjectionMatrix();
    v.up.set(0, 1, 0);
    v.position.copy(this.orbitPivot).add(new THREE.Vector3().setFromSpherical(sph));
    v.lookAt(this.orbitPivot);
    v.updateMatrixWorld();
    return v;
  }

  /** Near a globe, interacting turns the editorial off-centre framing into a centred map view. */
  private enterMapFraming(): void {
    if (this.altitudeInRadii() < 4) this.targetNdcOffset.set(0, 0);
  }

  private beginGrab(x: number, y: number): void {
    this.grabLocal = null;
    if (!(this.altitudeInRadii() < 3) || !this.focusedObject) return;
    this.enterMapFraming();
    const p = this.pickGlobe(x, y, new THREE.Vector3());
    if (!p) return;
    this.focusedObject.updateWorldMatrix(true, false);
    this.grabLocal = this.focusedObject.worldToLocal(p);
  }

  /** Rotate the target orbit so the ray through (x,y) from the target camera hits world point `g`. */
  private steerTargetTo(x: number, y: number, g: THREE.Vector3): boolean {
    for (let iter = 0; iter < 2; iter++) {
      const cam = this.virtualCameraAt(this.targetSpherical);
      const h = this.pickGlobe(x, y, new THREE.Vector3(), cam);
      if (!h) return false;
      const hd = h.sub(this.orbitPivot).normalize();
      const gd = g.clone().sub(this.orbitPivot).normalize();
      // Rotating the camera rigidly about the centre by hd→gd carries the cursor ray onto g
      const q = new THREE.Quaternion().setFromUnitVectors(hd, gd);
      const r = this.targetSpherical.radius;
      const t = new THREE.Vector3().setFromSpherical(this.targetSpherical).applyQuaternion(q);
      this.targetSpherical.setFromVector3(t);
      this.targetSpherical.radius = r;
      this.targetSpherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.targetSpherical.phi));
      this.makeSphericalContinuous();
    }
    return true;
  }

  /**
   * Keep the grabbed surface point under the cursor (web-map drag). Returns false when nothing
   * was grabbed (cursor off the globe or camera far away) so the drag spins the view instead.
   */
  private grabSurface(x: number, y: number): boolean {
    if (!this.grabLocal || !this.focusedObject || !(this.altitudeInRadii() < 3)) return false;
    this.focusedObject.updateWorldMatrix(true, false);
    const g = this.focusedObject.localToWorld(this.grabLocal.clone());
    this.steerTargetTo(x, y, g);
    return true;
  }

  /** While zooming near a globe, keep the point under the cursor fixed on screen. */
  private zoomTowardCursor(clientX: number, clientY: number, fromRadius: number, toRadius: number): void {
    if (!(this.altitudeInRadii(fromRadius) < 4)) return;
    this.enterMapFraming();
    // The point the user is pointing at, as currently drawn
    const g = this.pickGlobe(clientX, clientY, new THREE.Vector3());
    if (!g) return;
    const saved = this.targetSpherical.radius;
    this.targetSpherical.radius = toRadius;
    if (!this.steerTargetTo(clientX, clientY, g)) this.targetSpherical.radius = saved;
    this.targetSpherical.radius = toRadius;
  }

  private onContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
  };

  // Touch Support
  private onTouchStart = (e: TouchEvent): void => {
    if (this.suspended) return;
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
    if (this.suspended) return;
    this.lastInteractionTime = performance.now();
    if (this.activeTouches.size === 1 && e.touches.length === 1) {
      const touch = e.touches[0];
      const prev = this.activeTouches.get(touch.identifier);
      if (prev) {
        const deltaX = touch.clientX - prev.x;
        const deltaY = touch.clientY - prev.y;
        const touchSpeed = 0.006 * Math.min(1, Math.max(0.0005, this.altitudeInRadii()));
        this.targetSpherical.theta -= deltaX * touchSpeed;
        this.targetSpherical.phi -= deltaY * touchSpeed;
        this.targetSpherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.targetSpherical.phi));
        this.activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
      }
    } else if (this.activeTouches.size >= 2 && e.touches.length >= 2) {
      const touches = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      if (this.initialPinchDist > 0) {
        const scale = this.initialPinchDist / dist;
        const minDistance = this.minimumDistance();
        let next = this.initialRadiusOnPinch * scale;
        if (this.focusedObject && !this.isBlackHoleFocus() && this.initialRadiusOnPinch < this.focusedRadius * 4) {
          next = this.focusedRadius + (this.initialRadiusOnPinch - this.focusedRadius) * scale;
        }
        this.targetSpherical.radius = Math.max(minDistance, Math.min(180000.0 * COSMIC_SCALE, next));
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

  private static readonly LOOK_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.suspended) return;
    if (!CameraRig.LOOK_KEYS.has(e.key)) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    this.heldLookKeys.add(e.key);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.heldLookKeys.delete(e.key);
  };

  private onWindowBlur = (): void => {
    this.heldLookKeys.clear();
    this.isLooking = false;
  };

  private onDoubleClick = (): void => {
    if (this.suspended) return;
    this.resetLook();
  };

  private setupEventListeners(element: HTMLElement): void {
    this.domElement = element;
    if (element && element.addEventListener) {
      element.addEventListener('mousedown', this.onMouseDown);
      element.addEventListener('wheel', this.onWheel, { passive: false });
      element.addEventListener('contextmenu', this.onContextMenu);
      element.addEventListener('touchstart', this.onTouchStart, { passive: true });
      element.addEventListener('dblclick', this.onDoubleClick);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('blur', this.onWindowBlur);
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
      this.domElement.removeEventListener('dblclick', this.onDoubleClick);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('blur', this.onWindowBlur);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
    }
  }
}
