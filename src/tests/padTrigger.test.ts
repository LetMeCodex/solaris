import { describe, expect, it } from 'vitest';
import { triggerPull, type TriggerRest } from '../flight/PadTrigger';

describe('pad triggers', () => {
  const run = (values: number[], stepMs = 16): number[] => {
    let st: TriggerRest | undefined;
    return values.map((v, i) => {
      const r = triggerPull(st, v, i * stepMs);
      st = r.state;
      return r.pull;
    });
  };

  it('a worn trigger resting part-way in reads as released', () => {
    // The measured pad: RT resting at 0.24 from the start
    const pulls = run(new Array(600).fill(0.24));
    expect(Math.max(...pulls)).toBe(0);
  });

  it('a real pull still counts, full travel reads ~1', () => {
    const pulls = run([...new Array(60).fill(0.24), ...new Array(30).fill(1)]);
    expect(pulls[pulls.length - 1]).toBeGreaterThan(0.95);
  });

  it('a trigger that comes back to rest higher than before is released after holding still', () => {
    // Rest 0.02, pulled, then sticks at 0.2 on release
    const pulls = run([...new Array(30).fill(0.02), ...new Array(30).fill(1), ...new Array(200).fill(0.2)]);
    expect(pulls[pulls.length - 1]).toBe(0);
  });
});
