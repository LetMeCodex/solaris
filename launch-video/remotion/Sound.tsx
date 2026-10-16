import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BEAT, SKY_SHIFT, bar, sec } from './theme';

/**
 * The film's sound design (the original set from capture/sfx.py): risers into the hits, sub drops
 * on them, whooshes on the big cuts, a tick on every journey cut.
 */
interface Cue {
  src: string;
  /** Film time, seconds. */
  at: number;
  len: number;
  vol: number;
}

const H = BEAT * 2;
const J = bar(2);
// The journey's cuts, outward from Mercury
const JOURNEY_CUTS = [J, J + H, bar(3), bar(4), bar(4) + H, bar(5), bar(5) + H, bar(6), bar(6) + H, bar(7), bar(7) + H, bar(8)];
// Everything from the nebulae on moves if a section is inserted before it
const late = (t: number) => t + SKY_SHIFT;

const CUES: Cue[] = [
  { src: 'riser.wav', at: 15.0 - 3.2, len: 3.3, vol: 0.55 },
  { src: 'impact.wav', at: 15.0, len: 4, vol: 0.9 },
  { src: 'whoosh.wav', at: bar(1) - 0.35, len: 1.6, vol: 0.5 },
  { src: 'whoosh.wav', at: bar(9) - 0.35, len: 1.6, vol: 0.35 },
  // The zoom-through into the Skies act
  { src: 'whoosh.wav', at: bar(11) - 0.5, len: 1.6, vol: 0.42 },
  { src: 'riser.wav', at: late(bar(14)) - 3.2, len: 3.3, vol: 0.4 },
  { src: 'impact.wav', at: late(bar(14)), len: 4, vol: 0.6 },
  { src: 'shimmer.wav', at: late(bar(17)), len: 5, vol: 0.45 },
  ...JOURNEY_CUTS.map((at) => ({ src: 'tick.wav', at, len: 0.4, vol: 0.32 })),
];

export const SoundDesign: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, sec(c.at))} durationInFrames={sec(c.len)} name={`sfx ${c.src}`} layout="none">
        <Audio src={staticFile(`audio/sfx/${c.src}`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);
