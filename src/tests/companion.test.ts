import { describe, it, expect } from 'vitest';
import manifest from '../../public/voice/vela/manifest.json';
import { factIds, idsWith, lineText, SECRETS, VELA_LINES, secretsAt } from '../companion/knowledge';
import { EXPLORE_MILESTONES, exploreStatusId, FAREWELL } from '../ui/HUD/Companion';
import { SKY_DESTINATIONS } from '../ui/HUD/SkyDestinations';
import { LANDMARKS } from '../explorer/Landmarks';
import { TOUR_STEPS, tourVoice } from '../ui/HUD/Tour';

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
    expect(idsWith('tour.').length).toBe(TOUR_STEPS());
    for (let i = 0; i < TOUR_STEPS(); i++) expect(VELA_LINES[tourVoice(i)!], `step ${i}`).toBeTruthy();
    expect(secretsAt('Saturn').length).toBeGreaterThan(1);
  });

  it('only uses sounds the voice model can perform, and never shows them as text', () => {
    const known = new Set(['laugh', 'chuckle', 'sigh', 'gasp', 'sniff', 'crying', 'fear', 'whispering', 'surprised', 'happy', 'clear throat']);
    for (const [id, text] of Object.entries(VELA_LINES)) {
      for (const m of text.matchAll(/\[([^\]]+)\]/g)) expect(known.has(m[1]), `${id}: [${m[1]}]`).toBe(true);
      expect(lineText(id)).not.toMatch(/[[\]]/);
    }
  });

  it('has a line for every exploration milestone, every progress answer and the whole goodbye', () => {
    for (const p of EXPLORE_MILESTONES) expect(VELA_LINES[`explore.p${p}`], `explore.p${p}`).toBeTruthy();
    for (const p of [0, 3, 12, 30, 60, 80, 99]) expect(VELA_LINES[exploreStatusId(p)], String(p)).toBeTruthy();
    for (const id of [...FAREWELL, 'farewell.choice', 'farewell.later']) expect(VELA_LINES[id], id).toBeTruthy();
    expect(idsWith('giggle.').length).toBeGreaterThan(5);
    expect(idsWith('fright.').length).toBeGreaterThan(15);
    expect(Object.keys(VELA_LINES).length).toBeGreaterThanOrEqual(500);
  });
});
