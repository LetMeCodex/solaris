import * as THREE from 'three';

/**
 * Velocity-Aware Travel Particles
 * 
 * Renders near-field space motes and velocity streaks that react directly to
 * observer movement, camera translation, and logarithmic zooming.
 * 
 * - When stationary: subtle, almost imperceptible drifting cosmic motes.
 * - When traveling/zooming: motes stretch into elegant directional speed streaks
 *   aligned with observer trajectory, providing visceral tactile sense of scale and velocity
 *   without fake static tunnels or cartoon sci-fi warp effects.
 */
export class TravelParticles {
  public mesh: THREE.LineSegments;
  private count: number = 700;
  private positions: Float32Array;
  private colors: Float32Array;
  private relativePositions: Float32Array; // [x, y, z] relative to observer
  private radius: number = 110.0;
  private currentSpeed: number = 0;

  constructor() {
    this.positions = new Float32Array(this.count * 2 * 3);
    this.colors = new Float32Array(this.count * 2 * 3);
    this.relativePositions = new Float32Array(this.count * 3);

    // Initialize relative positions in a spherical volume
    for (let i = 0; i < this.count; i++) {
      const u = Math.random();
      const r = (0.2 + 0.8 * Math.cbrt(u)) * this.radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.relativePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      this.relativePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.relativePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.mesh = new THREE.LineSegments(geometry, material);
    this.mesh.name = 'velocity_travel_particles';
    this.mesh.frustumCulled = false;
  }

  /**
   * Updates particle positions and streak elongation based on camera state.
   */
  public update(
    cameraPos: THREE.Vector3,
    velocityVector: THREE.Vector3,
    zoomRate: number,
    deltaSec: number
  ): void {
    const velSpeed = velocityVector.length();
    const effectiveTravelSpeed = velSpeed + Math.abs(zoomRate) * 45.0;
    
    // Smooth speed damping
    // True-scale flights cross the system at ~10^5 units/s: the motes only need to read as "fast",
    // and moving them further than their box per frame would scramble them
    this.currentSpeed += (Math.min(420.0, effectiveTravelSpeed) - this.currentSpeed) * Math.min(1.0, deltaSec * 8.0);

    const isMoving = this.currentSpeed > 0.8;
    const streakLength = Math.min(28.0, this.currentSpeed * 0.16 + Math.abs(zoomRate) * 14.0);
    const alpha = Math.min(0.85, Math.max(0.08, (this.currentSpeed - 0.5) * 0.08));

    // Travel direction vector (pointing backwards for trail)
    let dirX = 0;
    let dirY = 0;
    let dirZ = -1;

    if (velSpeed > 0.01) {
      dirX = -velocityVector.x / velSpeed;
      dirY = -velocityVector.y / velSpeed;
      dirZ = -velocityVector.z / velSpeed;
    } else if (Math.abs(zoomRate) > 0.01) {
      // Pure radial zoom along camera line of sight
      const sign = zoomRate > 0 ? 1 : -1;
      dirZ = sign;
    }

    const posAttr = this.mesh.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = this.mesh.geometry.attributes.color as THREE.BufferAttribute;

    const boxSize = this.radius * 2;
    const halfBox = this.radius;

    for (let i = 0; i < this.count; i++) {
      const idx3 = i * 3;
      const v0 = i * 6;     // Head vertex
      const v1 = i * 6 + 3; // Tail vertex

      // Drift particle relative position if moving
      if (isMoving) {
        this.relativePositions[idx3] += dirX * this.currentSpeed * deltaSec * 0.5;
        this.relativePositions[idx3 + 1] += dirY * this.currentSpeed * deltaSec * 0.5;
        this.relativePositions[idx3 + 2] += dirZ * this.currentSpeed * deltaSec * 0.5;
      }

      // Wrap inside local box
      for (let c = 0; c < 3; c++) {
        if (this.relativePositions[idx3 + c] > halfBox) {
          this.relativePositions[idx3 + c] -= boxSize;
        } else if (this.relativePositions[idx3 + c] < -halfBox) {
          this.relativePositions[idx3 + c] += boxSize;
        }
      }

      const hx = cameraPos.x + this.relativePositions[idx3];
      const hy = cameraPos.y + this.relativePositions[idx3 + 1];
      const hz = cameraPos.z + this.relativePositions[idx3 + 2];

      // Head
      this.positions[v0] = hx;
      this.positions[v0 + 1] = hy;
      this.positions[v0 + 2] = hz;

      // Tail (stretched along travel vector)
      if (streakLength > 0.4) {
        this.positions[v1] = hx + dirX * streakLength;
        this.positions[v1 + 1] = hy + dirY * streakLength;
        this.positions[v1 + 2] = hz + dirZ * streakLength;
      } else {
        // Stationary: tiny mote
        this.positions[v1] = hx + 0.05;
        this.positions[v1 + 1] = hy + 0.05;
        this.positions[v1 + 2] = hz + 0.05;
      }

      // Color & alpha: subtle icy white / starlight blue
      const headBrightness = alpha * 1.2;
      const tailBrightness = alpha * 0.15;

      this.colors[v0] = 0.88 * headBrightness;
      this.colors[v0 + 1] = 0.92 * headBrightness;
      this.colors[v0 + 2] = 1.00 * headBrightness;

      this.colors[v1] = 0.65 * tailBrightness;
      this.colors[v1 + 1] = 0.80 * tailBrightness;
      this.colors[v1 + 2] = 0.95 * tailBrightness;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
