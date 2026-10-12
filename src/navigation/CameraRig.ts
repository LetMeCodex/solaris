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

  // Spherical coordinates
  private spherical: THREE.Spherical = new THREE.Spherical(260, Math.PI * 0.35, Math.PI * 0.25);
  private targetOffset: THREE.Vector3 = new THREE.Vector3();

  // Focus lock
  public focusedObject: THREE.Object3D | null = null;
  public focusDistance: number = 30;

  // Transition state
  private transition: CameraTransition | null = null;

  // User input states
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };

  constructor(domElement: HTMLElement) {
    this.domElement = domElement;
    this.camera = new THREE.PerspectiveCamera(
      45,
      domElement.clientWidth / domElement.clientHeight,
      0.5,
      50000
    );
    this.updateCameraPosition();
    this.setupEventListeners(domElement);
  }

  private updateCameraPosition(): void {
    if (this.transition) {
      const now = performance.now();
      const elapsed = now - this.transition.startTime;
      const progress = Math.min(1.0, elapsed / this.transition.durationMs);
      
      // Smooth cubic ease-in-out
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(this.transition.startPos, this.transition.targetPos, ease);
      this.lookAtTarget.lerpVectors(this.transition.startLookAt, this.transition.targetLookAt, ease);
      this.camera.lookAt(this.lookAtTarget);

      if (progress >= 1.0) {
        if (this.transition.onComplete) this.transition.onComplete();
        this.transition = null;
        // Re-synchronize spherical coordinates from current position relative to target
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.lookAtTarget);
        this.spherical.setFromVector3(offset);
      }
      return;
    }

    if (this.focusedObject) {
      // Follow the tracked object as it moves along its orbit
      this.focusedObject.getWorldPosition(this.lookAtTarget);
    }

    this.targetOffset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.lookAtTarget).add(this.targetOffset);
    this.camera.lookAt(this.lookAtTarget);

    // Dynamic near/far plane scaling to prevent depth-fighting
    const distToCenter = this.camera.position.distanceTo(this.lookAtTarget);
    this.camera.near = Math.max(0.1, distToCenter * 0.005);
    this.camera.far = Math.max(2000, distToCenter * 20);
    this.camera.updateProjectionMatrix();
  }

  public update(): void {
    this.updateCameraPosition();
  }

  public focusOn(object: THREE.Object3D, radius: number, durationMs: number = 1400): void {
    this.focusedObject = object;
    // Scale viewing distance tailored to body size and ring extent:
    if (object.name.includes('Saturn')) {
      this.focusDistance = radius * 7.2; // Extra clearance for rings
    } else if (object.name.includes('Sun')) {
      this.focusDistance = radius * 3.8;
    } else if (radius < 1.5) {
      this.focusDistance = Math.max(2.5, radius * 5.5);
    } else {
      this.focusDistance = Math.max(14.0, radius * 5.6);
    }

    const worldPos = new THREE.Vector3();
    object.getWorldPosition(worldPos);

    // Compute sunlit framing vector:
    // The Sun is at (0, 0, 0). Vector from planet toward Sun is -worldPos.
    const toSun = new THREE.Vector3().copy(worldPos).negate();
    if (toSun.lengthSq() < 1) {
      // Focusing on the Sun itself
      toSun.set(0, 0, 1);
    } else {
      toSun.normalize();
    }

    // Place camera at a dramatic 40-degree angle from the Sun direction and elevated +Y
    const sideVec = new THREE.Vector3(-toSun.z, 0, toSun.x).normalize();
    const cameraOffset = new THREE.Vector3()
      .copy(toSun)
      .multiplyScalar(0.75)
      .addScaledVector(sideVec, 0.65)
      .add(new THREE.Vector3(0, 0.45, 0))
      .normalize()
      .multiplyScalar(this.focusDistance);

    const targetCameraPos = new THREE.Vector3().copy(worldPos).add(cameraOffset);
    const targetSpherical = new THREE.Spherical().setFromVector3(cameraOffset);

    this.transition = {
      startPos: this.camera.position.clone(),
      targetPos: targetCameraPos,
      startLookAt: this.lookAtTarget.clone(),
      targetLookAt: worldPos.clone(),
      startTime: performance.now(),
      durationMs,
      onComplete: () => {
        this.spherical.copy(targetSpherical);
      }
    };
  }

  public resetToOverview(durationMs: number = 1600): void {
    this.focusedObject = null;
    const targetSpherical = new THREE.Spherical(280, Math.PI * 0.32, Math.PI * 0.25);
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
        this.lookAtTarget.set(0, 0, 0);
      }
    };
  }

  private domElement: HTMLElement;
  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0 && e.button !== 2) return;
    this.isDragging = true;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  private onMouseUp = () => {
    this.isDragging = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    const rotateSpeed = 0.005;
    this.spherical.theta -= deltaX * rotateSpeed;
    this.spherical.phi -= deltaY * rotateSpeed;

    // Restrict phi to avoid polar singularity flip
    this.spherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, this.spherical.phi));
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const factor = 1.0 + e.deltaY * zoomSpeed;
    const minDistance = this.focusedObject ? this.focusDistance * 0.6 : 10.0;
    const maxDistance = 1500.0;

    this.spherical.radius = Math.max(minDistance, Math.min(maxDistance, this.spherical.radius * factor));
  };

  private setupEventListeners(element: HTMLElement): void {
    this.domElement = element;
    element.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    element.addEventListener('wheel', this.onWheel, { passive: false });
  }

  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public dispose(): void {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.domElement.removeEventListener('wheel', this.onWheel);
    }
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }
}
