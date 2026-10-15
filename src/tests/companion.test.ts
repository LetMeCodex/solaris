import { describe, it, expect } from 'vitest';
import { answer, arrivalLine, findBody, FACTS, SECRETS, Context } from '../companion/knowledge';
import { SKY_DESTINATIONS } from '../ui/HUD/SkyDestinations';
import { LANDMARKS } from '../explorer/Landmarks';

const ctx: Context = {
  current: 'Earth',
  lightFromEarthSec: null,
  info: (name) =>
    ({
      Earth: { radiusKm: 6371, aAU: 1, periodDays: 365.25, dayHours: 23.93 },
      Saturn: { radiusKm: 58232, aAU: 9.537, periodDays: 10759, dayHours: 10.66 },
      Venus: { radiusKm: 6051.8, aAU: 0.723, periodDays: 224.7, dayHours: -5832.5 },
    } as Record<string, { radiusKm: number; aAU: number; periodDays: number; dayHours: number }>)[name] ?? null,
};

describe('Vela understands', () => {
  it('finds worlds by name and alias', () => {
    expect(findBody('take me to the black hole')).toBe('Sagittarius A*');
    expect(findBody('how big is jupiter?')).toBe('Jupiter');
    expect(findBody('stand on the moon')).toBe('Moon');
    expect(findBody('tell me something')).toBeNull();
  });

  it('turns travel requests into flights', () => {
    expect(answer('take me to Saturn', ctx).action).toEqual({ kind: 'fly', body: 'Saturn' });
    expect(answer('lets go to the black hole', ctx).action).toEqual({ kind: 'fly', body: 'Sagittarius A*' });
  });

  it('answers size, distance, day and year with real numbers', () => {
    expect(answer('how big is saturn', ctx).text).toMatch(/116,464 kilometres/);
    expect(answer('how far is saturn', ctx).text).toMatch(/9\.5 astronomical units/);
    expect(answer('how long is a day on venus', ctx).text).toMatch(/backwards/);
    expect(answer('how long is a year on saturn', ctx).text).toMatch(/29 Earth years/);
  });

  it('offers a hidden view with a working action', () => {
    const r = answer('show me something hidden', { ...ctx, current: 'Saturn' });
    expect(r.chips?.[0].action).toBeDefined();
  });

  it('greets arrivals with a fact and, the first time, a secret', () => {
    const first = arrivalLine('Saturn', true)!;
    expect(first.chips?.[0].action?.kind).toBe('sky');
    expect(FACTS.Saturn.some((f) => first.text.startsWith(f))).toBe(true);
  });

  it('only points at sky views and landmarks that really exist', () => {
    for (const s of SECRETS) {
      const a = s.chip.action;
      if (a?.kind === 'sky') expect(SKY_DESTINATIONS.some((d) => d.body === a.body)).toBe(true);
      if (a?.kind === 'landmark') expect(LANDMARKS.some((l) => l.id === a.id)).toBe(true);
    }
  });
});
