import { describe, it, expect } from 'vitest';
import { toDms, toMgrs } from '../flight/TacticalHud';

/** Easting/northing from an independent Krüger-series UTM (Karney 2011), metres. */
const CASES: Array<[string, number, number, string, number, number]> = [
  ['Empire State Building', 40.74844, -73.985664, '18T WL', 85631.4, 11326.9],
  ['Sydney Opera House', -33.856784, 151.215297, '56H LH', 34900.3, 52290.5],
  ['India Gate', 28.6129, 77.2295, '43R GM', 17987.3, 67131.2],
  ['Everest', 27.988056, 86.925278, '45R VL', 92652.3, 95881.5],
];

describe('tactical HUD coordinates', () => {
  it.each(CASES)('MGRS of %s matches an independent UTM to a metre', (_name, lat, lon, square, e, n) => {
    const m = toMgrs(lat, lon);
    const [zb, sq, es, ns] = m.split(' ');
    expect(`${zb} ${sq}`).toBe(square);
    expect(Math.abs(Number(es) - Math.floor(e))).toBeLessThanOrEqual(1);
    expect(Math.abs(Number(ns) - Math.floor(n))).toBeLessThanOrEqual(1);
  });

  it('polar caps use UPS', () => {
    expect(toMgrs(88, 10)).toBe('UPS NORTH');
    expect(toMgrs(-85, 10)).toBe('UPS SOUTH');
  });

  it('formats degrees, minutes and seconds with hemispheres', () => {
    expect(toDms(40.74844, -73.985664)).toBe(`40°44'54.4"N  073°59'08.4"W`);
    expect(toDms(-33.5, 151.25)).toBe(`33°30'00.0"S  151°15'00.0"E`);
  });
});
