import { describe, it, expect } from 'vitest';
import { TRACKS, trackFor } from '../audio/music';

describe('Soundtrack', () => {
  it('gives every world its own track', () => {
    for (const t of TRACKS) expect(TRACKS[trackFor(t.world)].world).toBe(t.world);
  });

  it('plays a planet\'s track at its moons, and something sensible everywhere else', () => {
    expect(TRACKS[trackFor('Moon')].world).toBe('Earth');
    expect(TRACKS[trackFor('Titan')].world).toBe('Saturn');
    expect(TRACKS[trackFor('Europa')].world).toBe('Jupiter');
    expect(TRACKS[trackFor('Charon')].world).toBe('Neptune');
    expect(TRACKS[trackFor('Pluto')].world).toBe('Neptune');
    expect(trackFor('Nowhere at all')).toBeGreaterThanOrEqual(0);
  });
});
