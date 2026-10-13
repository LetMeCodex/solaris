import * as THREE from 'three';

export interface CameraTransition {
  startPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  startLookAt: THREE.Vector3;
  targetLookAt: THREE.Vector3;
  startTime: number;
  durationMs: number;
  onComplete?: () => void;
}

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  public lookAtTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Current smoothed spherical coordinates
  private spherical: THREE.Spherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);
  // Target spherical coordinates for silky damping & inertia
  private targetSpherical: THREE.Spherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);

  // Pan offset in camera plane coordinates
  private panOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private targetPanOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  // Focus lock
  public focusedObject: THREE.Object3D | null = null;
  public focusDistance: number = 30;
  public focusedRadius: number = 2.8;

  // Transition state
  private transition: CameraTransition | null = null;

  // Mouse interaction state
  private isOrbiting: boolean = false;
  private isPanning: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };

  // Touch interaction state
  private activeTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist: number = 0;
  private initialRadiusOnPinch: number = 0;

  // Damping factor (0.1 = smooth inertial response)
  private readonly damping: number = 0.12;

  private domElement: HTMLElement;

  constructor(domElement: HTMLElement) {
    this.domElement = domElement;
    this.camera = new THREE.PerspectiveCamera(
      45,
      domElement.clientWidth / domElement.clientHeight,
      0.1,
      100000
    );
    this.updateCameraPosition();
    this.setupEventListeners(domElement);
  }

  private updateCameraPosition(): void {
    if (this.transition) {
      const now = performance.now();
      const elapsed = now - this.transition.startTime;
      const progress = Math.min(1.0, elapsed / this.transition.durationMs);

      // Smooth quintic ease-in-out curve
      const ease = progress < 0.5
        ? 16 * Math.pow(progress, 5)
        : 1 - Math.pow(-2 * progress + 2, 5) / 2;

      this.camera.position.lerpVectors(this.transition.startPos, this.transition.targetPos, ease);
      this.lookAtTarget.lerpVectors(this.transition.startLookAt, this.transition.targetLookAt, ease);
      this.camera.lookAt(this.lookAtTarget);
      this.camera.near = Math.max(0.02, this.focusedRadius * 0.05);
      this.camera.far = Math.max(30000, this.camera.position.distanceTo(this.lookAtTarget) * 25);
      this.camera.updateProjectionMatrix();

      if (progress >= 1.0) {
        if (this.transition.onComplete) this.transition.onComplete();
        this.transition = null;
        // Synchronize spherical coordinates from current position relative to target
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.lookAtTarget);
        this.spherical.setFromVector3(offset);
        this.targetSpherical.copy(this.spherical);
        this.panOffset.set(0, 0, 0);
        this.targetPanOffset.set(0, 0, 0);
      }
      return;
    }

    // Follow the tracked body in real time as it moves along its Keplerian orbit
    if (this.focusedObject) {
      this.focusedObject.updateWorldMatrix(true, false);
      this.focusedObject.getWorldPosition(this.lookAtTarget);
    } else {
      this.lookAtTarget.set(0, 0, 0);
    }

    // Apply smoothed pan offset
    this.panOffset.lerp(this.targetPanOffset, this.damping);
    this.lookAtTarget.add(this.panOffset);

    // Apply silky damping to spherical coordinates
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * this.damping;
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * this.damping;
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * this.damping;

    // Strict polar singularity protection: clamps phi between 0.02 and PI - 0.02
    this.spherical.phi = Math.max(0.02, Math.min(Math.PI - 0.02, this.spherical.phi));

    // Calculate 3D camera position from spherical offset
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.lookAtTarget).add(offset);
    this.camera.lookAt(this.lookAtTarget);

    // Dynamic depth buffer calibration: ensures extreme close-ups remain razor-sharp without z-fighting
    const distToCenter = this.spherical.radius;
    const clearance = Math.max(0.05, distToCenter - this.focusedRadius);
    this.camera.near = Math.max(0.02, clearance * 0.1);
    this.camera.far = Math.max(30000, distToCenter * 25);
    this.camera.updateProjectionMatrix();
  }

  public update(): void {
    this.updateCameraPosition();
  }

  /**
   * Focuses on a celestial body with cinematic framing.
   * Centers the body precisely at the orbit pivot so the user can freely inspect
   * every angle (day, night, north pole, south pole, terminator).
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

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      durationMs = 150;
    }

    object.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    // Sun vector (Sun sits at 0, 0, 0)
    const toSun = new THREE.Vector3().copy(worldPos).negate();
    const isSun = toSun.lengthSq() < 1 || bodyName === 'Sun';
    if (isSun) {
      toSun.set(0, 0, 1);
    } else {
      toSun.normalize();
    }

    let distanceFactor = 2.45;
    if (bodyName === 'Saturn') {
      distanceFactor = 3.6; // Majestic clearance for rings
    } else if (bodyName === 'Sun') {
      distanceFactor = 2.2;
    } else if (bodyName === 'Jupiter') {
      distanceFactor = 2.05; // Jupiter fills the screen with colossal curvature
    } else if (radius < 1.0) {
      distanceFactor = 2.8;
    }

    const viewingDistance = Math.max(2.4, radius * distanceFactor);
    this.focusDistance = viewingDistance;

    // Natural 3/4 sunlit initial vantage point
    const side = new THREE.Vector3(-toSun.z, 0, toSun.x).normalize();
    const up = new THREE.Vector3(0, 1, 0);

    let cameraOffset: THREE.Vector3;
    if (isSun) {
      cameraOffset = new THREE.Vector3(0, 0.4, 1.0).normalize().multiplyScalar(viewingDistance);
    } else if (bodyName === 'Saturn') {
      // 28° oblique tilt to view Saturn's rings and shadows
      cameraOffset = new THREE.Vector3()
        .copy(toSun).multiplyScalar(-0.45)
        .addScaledVector(side, 0.55)
        .addScaledVector(up, 0.55)
        .normalize()
        .multiplyScalar(viewingDistance);
    } else {
      // 3/4 illuminated angle showing both sunlight, atmosphere, and terminator
      cameraOffset = new THREE.Vector3()
        .copy(toSun).multiplyScalar(0.45)
        .addScaledVector(side, 0.65)
        .addScaledVector(up, 0.35)
        .normalize()
        .multiplyScalar(viewingDistance);
    }

    const targetCameraPos = new THREE.Vector3().copy(worldPos).add(cameraOffset);
    const targetSpherical = new THREE.Spherical().setFromVector3(cameraOffset);

    // Reset pan offset so orbit pivot is centered exactly on the planet
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);

    this.transition = {
      startPos: this.camera.position.clone(),
      targetPos: targetCameraPos,
      startLookAt: this.lookAtTarget.clone(),
      targetLookAt: worldPos.clone(),
      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSpherical);
        this.targetSpherical.copy(targetSpherical);
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
    this.targetPanOffset.set(0, 0, 0);
    this.panOffset.set(0, 0, 0);

    const targetSpherical = new THREE.Spherical(680, Math.PI * 0.30, Math.PI * 0.25);
    const targetPos = new THREE.Vector3().setFromSpherical(targetSpherical);

    this.transition = {
      startPos: this.camera.position.clone(),
      targetPos,
      startLookAt: this.lookAtTarget.clone(),
      targetLookAt: new THREE.Vector3(0, 0, 0),
      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSpherical);
        this.targetSpherical.copy(targetSpherical);
        this.lookAtTarget.set(0, 0, 0);
      }
    };
  }

  // --- INTERACTION CONTROLS ---

  private onMouseDown = (e: MouseEvent): void => {
    // Interruption: if a transition is in flight and user interacts, cancel it immediately
    if (this.transition) {
      this.transition = null;
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.lookAtTarget);
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
  };

  private onMouseMove = (e: MouseEvent): void => {
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

    if (this.transition) {
      this.transition = null;
    }

    const zoomFactor = Math.pow(0.95, e.deltaY * 0.015);
    const minDistance = this.focusedObject ? this.focusedRadius * 1.15 : 8.0;
    const maxDistance = 4500.0;

    this.targetSpherical.radius = Math.max(
      minDistance,
      Math.min(maxDistance, this.targetSpherical.radius * zoomFactor)
    );
  };

  private onContextMenu = (e: MouseEvent): void => {
    e.preventDefault(); // Prevent default browser context menu on right-click drag
  };

  // Touch Support
  private onTouchStart = (e: TouchEvent): void => {
    if (this.transition) this.transition = null;

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
        const minDistance = this.focusedObject ? this.focusedRadius * 1.15 : 8.0;
        this.targetSpherical.radius = Math.max(minDistance, Math.min(4500, this.initialRadiusOnPinch * scale));
      }
    }
  };

  private onTouchEnd = (e: TouchEvent): void => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.activeTouches.delete(e.changedTouches[i].identifier);
    }
    if (this.activeTouches.size < 2) {
      this.initialPinchDist = 0;
    }
  };

  private setupEventListeners(element: HTMLElement): void {
    this.domElement = element;
    element.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    element.addEventListener('wheel', this.onWheel, { passive: false });
    element.addEventListener('contextmenu', this.onContextMenu);

    element.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public dispose(): void {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.domElement.removeEventListener('wheel', this.onWheel);
      this.domElement.removeEventListener('contextmenu', this.onContextMenu);
      this.domElement.removeEventListener('touchstart', this.onTouchStart);
    }
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }
}
