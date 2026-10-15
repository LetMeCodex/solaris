import * as THREE from 'three';

/**
 * Floating origin.
 *
 * At true scale the planets sit up to millions of units from the Sun, beyond what 32-bit floats on
 * the GPU can resolve finely (at Neptune a world-space coordinate is only good to ~0.1 unit, at
 * Sgr A* to several units). Every frame is therefore drawn with the camera moved to the origin and
 * the scene shifted by the opposite amount (see SolarSystemScene.render). Matrices are composed on
 * the CPU in double precision, so everything near the camera stays exact.
 *
 * Shaders that light things from the Sun must not assume it is at (0, 0, 0): they read its position
 * in the frame being drawn from this shared uniform.
 */
export const SUN_WORLD: THREE.IUniform<THREE.Vector3> = { value: new THREE.Vector3() };
