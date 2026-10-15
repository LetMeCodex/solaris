import { describe, it, expect } from 'vitest';
import manifest from '../../public/voice/vela/manifest.json';
import { factIds, idsWith, SECRETS, VELA_LINES, secretsAt } from '../companion/knowledge';
import { SKY_DESTINATIONS } from '../ui/HUD/SkyDestinations';
import { LANDMARKS } from '../explorer/Landmarks';

const RECORDINGS = Object.keys(import.meta.glob('../../public/voice/vela/*.mp3')).map((k) => k.split('/').pop());

describe('Vela', () => {
  it('has a recording for every line she can say', () => {
    const m = manifest as Record<string, { file: string }>;
    for (const id of Object.keys(VELA_LINES)) {
      expect(m[id], id).toBeDefined();
      expect(RECORDINGS, id).toContain(m[id].file);
    }
  });

  it('never has two line ids that differ only in case (their files would collide on Windows/macOS)', () => {
    const seen = new Map<string, string>();
    for (const id of Object.keys(VELA_LINES)) {
      const k = id.toLowerCase();
      expect(seen.get(k), `${id} vs ${seen.get(k)}`).toBeUndefined();
      seen.set(k, id);
    }
  });

  it('has a spoken pitch for every secret, pointing only at places that exist', () => {
    for (const s of SECRETS) {
      expect(VELA_LINES[`secret.${s.id}`], s.id).toBeTruthy();
      const a = s.action;
      if (a.kind === 'sky') expect(SKY_DESTINATIONS.some((d) => d.body === a.body), s.id).toBe(true);
      if (a.kind === 'landmark') expect(LANDMARKS.some((l) => l.id === a.id), s.id).toBe(true);
    }
  });

  it('knows something about every major world and narrates every tour step', () => {
    for (const w of ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Sagittarius A*']) {
      expect(factIds(w).length, w).toBeGreaterThan(0);
    }
    expect(idsWith('tour.').length).toBe(13);
    expect(secretsAt('Saturn').length).toBeGreaterThan(1);
  });
});
