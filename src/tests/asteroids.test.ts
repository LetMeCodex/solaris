import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createSeededRng, AsteroidBelt } from '../rendering/AsteroidBelt';
import { RenderSpaceTransform } from '../rendering/RenderSpaceTransform';

describe('AsteroidBelt — Determinism & Seeded Reproducibility', () => {
  it('generates identical sequence of numbers for identical seeds', () => {
    const rngA = createSeededRng(19890825);
    const rngB = createSeededRng(19890825);

    const valuesA = Array.from({ length: 50 }, () => rngA());
    const valuesB = Array.from({ length: 50 }, () => rngB());

    expect(valuesA).toEqual(valuesB);
  });

  it('generates distinct sequences for different seeds', () => {
    const rngA = createSeededRng(19890825);
    const rngB = createSeededRng(42);

    const valuesA = Array.from({ length: 50 }, () => rngA());
    const valuesB = Array.from({ length: 50 }, () => rngB());

    expect(valuesA).not.toEqual(valuesB);
  });

  it('creates reproducible asteroid belt instanced mesh with 3,200 elements', () => {
    const transform = new RenderSpaceTransform();
    const belt1 = new AsteroidBelt(transform, 19890825);
    const belt2 = new AsteroidBelt(transform, 19890825);

    expect(belt1.mesh.count).toBe(3200);
    expect(belt2.mesh.count).toBe(3200);

    // Matrix comparison for first few elements using THREE.Matrix4
    const mat1 = new THREE.Matrix4();
    const mat2 = new THREE.Matrix4();

    belt1.mesh.getMatrixAt(0, mat1);
    belt2.mesh.getMatrixAt(0, mat2);

    for (let i = 0; i < 16; i++) {
      expect(mat1.elements[i]).toBeCloseTo(mat2.elements[i], 5);
    }
  });
});
