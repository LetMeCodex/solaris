import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { NEBULAE, nebulaBasis, nebulaDirection } from '../rendering/NebulaSky';

describe('Nebulae', () => {
  it('hang upright and unmirrored as seen from the Sun', () => {
    for (const spec of NEBULAE.filter((n) => n.roll === 0)) {
      const dir = nebulaDirection(spec);
      const { e, n } = nebulaBasis(dir, 0);
      // Looking out along dir with "up" = n, screen-right is dir × n: the picture's +u must point there
      const right = new THREE.Vector3().crossVectors(dir, n);
      expect(e.dot(right), spec.name).toBeGreaterThan(0.999);
      // Up leans to ecliptic north
      expect(n.y, spec.name).toBeGreaterThan(0);
    }
  });

  it('describe every one for a visit', () => {
    for (const spec of NEBULAE) {
      expect(spec.title.length, spec.name).toBeGreaterThan(3);
      expect(spec.blurb.length, spec.name).toBeGreaterThan(40);
    }
  });
});
