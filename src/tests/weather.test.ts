import { describe, it, expect } from 'vitest';
import { Weather } from '../flight/Weather';

const sample = (world: string, lat: number, altKm: number) => {
  const counts: Record<string, number> = {};
  for (let lon = -180; lon < 180; lon += 6) {
    for (let h = 0; h < 40; h++) {
      const k = Weather.climate(world, lat, lon, altKm, h).kind;
      counts[k] = (counts[k] ?? 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (k: string) => (counts[k] ?? 0) / total;
};

describe('weather follows each world\'s climate', () => {
  it('rains most in the tropics and least in the subtropical deserts', () => {
    const tropics = sample('Earth', 3, 0.5);
    const subtropics = sample('Earth', 25, 0.5);
    const wetTropics = tropics('rain') + tropics('storm');
    const wetSub = subtropics('rain') + subtropics('storm');
    expect(wetTropics).toBeGreaterThan(wetSub * 1.8);
    expect(tropics('storm')).toBeGreaterThan(0);
  });

  it('snows towards the poles and above the freezing level, not in tropical lowlands', () => {
    expect(sample('Earth', 75, 0.5)('snow')).toBeGreaterThan(0.1);
    expect(sample('Earth', 5, 0.3)('snow')).toBe(0);
    expect(sample('Earth', 5, 7)('snow')).toBeGreaterThan(0.1);
  });

  it('gives Mars dust, Venus acid haze, Titan methane drizzle and the giants turbulence', () => {
    expect(sample('Mars', -40, 2)('dust')).toBe(1);
    expect(sample('Venus', 0, 55)('acid')).toBe(1);
    expect(sample('Titan', 10, 5)('methane')).toBeGreaterThan(0.2);
    expect(sample('Titan', 10, 40)('methane')).toBe(0);
    expect(sample('Jupiter', 20, 50)('turbulence')).toBe(1);
  });
});
