import { describe, it, expect } from 'vitest';
import { POSTCARDS } from '../data/Postcards';
import { CatalogueManager } from '../data/CatalogueManager';

const FILES = Object.keys(import.meta.glob('../../public/gallery/*.jpg')).map((k) => k.split('/').pop());

describe('Gallery postcards', () => {
  it('each has its picture and thumbnail, a real world, and a sane view', () => {
    const ids = new Set<string>();
    for (const p of POSTCARDS) {
      expect(ids.has(p.id), p.id).toBe(false);
      ids.add(p.id);
      expect(FILES, p.id).toContain(`${p.id}.jpg`);
      expect(FILES, p.id).toContain(`${p.id}_thumb.jpg`);
      expect(p.body === 'Sagittarius A*' || !!CatalogueManager.getBody(p.body), p.body).toBe(true);
      expect(Number.isNaN(Date.parse(p.utc)), p.id).toBe(false);
      expect(p.fov).toBeGreaterThan(0);
      expect(Math.abs(p.lat)).toBeLessThanOrEqual(90);
    }
  });
});
