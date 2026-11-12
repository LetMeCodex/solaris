import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RadioDirector, type RadioFlight, type RadioLine, type RadioOutput } from '../flight/audio/RadioDirector';
import { JET_RECORDINGS } from '../flight/JetAudio';
import radioLines from '../../scripts/radio_lines.json';
import radioManifest from '../../public/voice/radio/manifest.json';

// The director fetches its manifest on construction: here it gets a small one at once
const LINES: Record<string, RadioLine> = {
  'start.1': { file: 'start.1.mp3', seconds: 3, text: 'Ready.', speaker: 'pilot', mood: 'calm', trigger: 'start' },
  'mach1.1': { file: 'mach1.1.mp3', seconds: 3, text: 'Supersonic!', speaker: 'pilot', mood: 'joy', trigger: 'mach1' },
  'mach1.2': { file: 'mach1.2.mp3', seconds: 3, text: 'Mach one!', speaker: 'wing', mood: 'joy', trigger: 'mach1' },
  'react.joy.1': { file: 'r.mp3', seconds: 2, text: 'Hah!', speaker: 'wing', mood: 'joy', trigger: 'joy' },
  'country.IN': { file: 'in.mp3', seconds: 4, text: 'Welcome to India.', speaker: 'control', mood: 'info', trigger: 'country:India' },
  'terrain.1': { file: 't.mp3', seconds: 2, text: 'Pull up!', speaker: 'pilot', mood: 'fear', trigger: 'terrain' },
};

function flight(o: Partial<RadioFlight> = {}): RadioFlight {
  return {
    timeSec: 0, nearest: 'Earth', altKm: 5, radiusKm: 6371, speedMps: 200, mach: 0.6, air: 0.5, gLoad: 1, warning: 0,
    skyEvent: '', inCloud: false, sunUp: 0.5, lat: 20, lon: 78, country: '', atSea: false, earthDistKm: 6376, ...o,
  };
}

async function director(): Promise<{ d: RadioDirector; spoken: string[] }> {
  const spoken: string[] = [];
  const out: RadioOutput = {
    speak: (b) => {
      spoken.push((b as unknown as { id: string }).id);
      return 3;
    },
    decode: (data) => Promise.resolve({ id: new TextDecoder().decode(data) } as unknown as AudioBuffer),
    subtitle: () => undefined,
    muted: () => false,
  };
  const d = new RadioDirector(out);
  await vi.waitFor(() => expect((d as unknown as { loaded: boolean }).loaded).toBe(true));
  return { d, spoken };
}

/** Runs the director for `seconds` of flight at 60 Hz, with the flight state from `at`. */
async function run(d: RadioDirector, from: number, seconds: number, at: (t: number) => Partial<RadioFlight>): Promise<number> {
  let t = from;
  for (let i = 0; i < seconds * 60; i++, t += 1 / 60) d.update(flight({ timeSec: t, ...at(t) }));
  await new Promise((r) => setTimeout(r, 0));
  return t;
}

describe('RadioDirector', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      clear: () => store.clear(),
    });
    vi.stubGlobal('fetch', (url: string) => {
      if (url.endsWith('manifest.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(LINES) });
      const id = Object.keys(LINES).find((k) => url.endsWith(LINES[k].file)) ?? '?';
      return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new TextEncoder().encode(id).buffer) });
    });
  });

  it('opens with a start call, then stays quiet', async () => {
    const { d, spoken } = await director();
    await run(d, 0, 20, () => ({}));
    expect(spoken).toEqual(['start.1']);
  });

  it('calls Mach 1 once per crossing (hysteresis), never the line heard last', async () => {
    const { d, spoken } = await director();
    let t = await run(d, 0, 10, () => ({}));
    t = await run(d, t, 10, () => ({ mach: 1.1 }));
    expect(spoken.filter((s) => s.startsWith('mach1')).length).toBe(1);
    const first = spoken.find((s) => s.startsWith('mach1'));
    // Back under, over again after the cooldown: the other line
    t = await run(d, t, 5, () => ({ mach: 0.8 }));
    t = await run(d, t, 450, (tt) => ({ mach: tt > t + 420 ? 1.2 : 0.8 }));
    const calls = spoken.filter((s) => s.startsWith('mach1'));
    expect(calls.length).toBe(2);
    expect(calls[1]).not.toBe(first);
  });

  it('names the country once it has been under the jet a few seconds', async () => {
    const { d, spoken } = await director();
    let t = await run(d, 0, 10, () => ({}));
    t = await run(d, t, 2, () => ({ country: 'India' }));
    expect(spoken).not.toContain('country.IN');
    await run(d, t, 12, () => ({ country: 'India' }));
    expect(spoken).toContain('country.IN');
  });

  it('shouts about the ground at once, whatever else is on', async () => {
    const { d, spoken } = await director();
    await run(d, 0, 3.0, (t) => ({ warning: t > 2.6 ? 1 : 0 }));
    expect(spoken).toContain('terrain.1');
  });
});

describe('the recordings', () => {
  // (the files on disk, listed by Vite: the voices and the cockpit sounds)
  const voices = new Set(Object.keys(import.meta.glob('../../public/voice/radio/*.mp3')).map((p) => p.split('/').pop()));
  const sounds = new Set(Object.keys(import.meta.glob('../../public/audio/jet/*.mp3')).map((p) => p.split('/').pop()));
  const spec = radioLines as { lines: { id: string; trigger: string; speaker: string; text: string }[] };
  const manifest = radioManifest as unknown as Record<string, RadioLine>;

  it('has a take of every radio line, as written', () => {
    for (const line of spec.lines) {
      const take = manifest[line.id];
      expect(take, line.id).toBeDefined();
      expect(take.speaker).toBe(line.speaker);
      expect(take.trigger).toBe(line.trigger);
      expect(voices.has(take.file), take.file).toBe(true);
      expect(take.seconds).toBeGreaterThan(0.5);
      expect(take.seconds).toBeLessThan(15);
      // the subtitle is the line without its performed sounds ([laugh], [sigh] ...)
      expect(take.text).not.toMatch(/\[|\]/);
      expect(take.text).toBe(line.text.replace(/\[[a-z ]+\]/g, '').replace(/\s+/g, ' ').trim());
    }
    expect(Object.keys(manifest).length).toBe(spec.lines.length);
  });

  it('has every cockpit sound the jet plays', () => {
    for (const name of JET_RECORDINGS) expect(sounds.has(`${name}.mp3`), name).toBe(true);
  });
});
