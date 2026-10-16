import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { BEAT, FPS, SKY_SHIFT, bar, sec } from './theme';

/**
 * The film's sound design, scored to the picture. Every sound is synthesised by
 * capture/sfx.py and tuned to the soundtrack's key (D# minor pentatonic), so the effects play
 * as part of the music rather than on top of it.
 */
interface Cue {
  src: string;
  /** Film time, seconds. */
  at: number;
  vol: number;
  /** Seconds trimmed from the start of the file (to land a moment inside it on the cue). */
  trim?: number;
}

const H = BEAT * 2;
const J = bar(2);
// The journey's cuts, outward from Mercury (each gets the next note up the scale)
const JOURNEY_CUTS = [J, J + H, bar(3), bar(4), bar(4) + H, bar(5), bar(5) + H, bar(6), bar(6) + H, bar(7), bar(7) + H, bar(8)];
// Everything from the nebulae on moves if a section is inserted before it
const late = (t: number) => t + SKY_SHIFT;

/** The mark's build, scored: orbits sweep, worlds land, the star sparkles (frames match Logo.tsx). */
const logoBuild = (start: number, gain: number): Cue[] => [
  { src: 'orbit_a.wav', at: start + 4 / FPS, vol: 0.42 * gain },
  { src: 'orbit_b.wav', at: start + 8 / FPS, vol: 0.38 * gain },
  { src: 'drop_a.wav', at: start + 26 / FPS, vol: 0.5 * gain },
  { src: 'drop_b.wav', at: start + 30 / FPS, vol: 0.46 * gain },
  { src: 'sparkle.wav', at: start + 34 / FPS, vol: 0.48 * gain },
];

const CUES: Cue[] = [
  // Cold open: one note of light in the dark, a drone breathing under it, the Sun's roar
  { src: 'drone.wav', at: 0, vol: 0.3, trim: 0.4 },
  { src: 'photon.wav', at: 0.2, vol: 0.48 },
  { src: 'plasma.wav', at: 3.9, vol: 0.36 },

  // Into the title: the riser sucks into silence, the chord hits, the mark builds
  { src: 'riser.wav', at: 15.0 - 3.2, vol: 0.62 },
  { src: 'hit.wav', at: 15.0, vol: 0.92 },
  ...logoBuild(15.0, 1),

  // Follow the light: the warp passes right on the cut
  { src: 'warp.wav', at: bar(1) - 1.0, vol: 0.62 },

  // The journey: the light-clock rings one note higher at every world
  ...JOURNEY_CUTS.map((at, i) => ({ src: `note_${String(i).padStart(2, '0')}.wav`, at, vol: 0.4 })),

  // The interface: each screen arrives on a swoosh, each chapter on a chime
  { src: 'swoosh.wav', at: bar(9) - 0.3, vol: 0.42 },
  { src: 'chime.wav', at: bar(9) + 0.2, vol: 0.3 },
  { src: 'swoosh.wav', at: bar(10) - 0.3, vol: 0.38 },
  { src: 'chime.wav', at: bar(10) + 0.2, vol: 0.26 },
  // Skies of other worlds (when that act is in): the screen sucks us in and we land on Phobos,
  // a hushed pad under the alien skies, a reticle ping as each annotation draws on
  ...(SKY_SHIFT > 0
    ? [
        { src: 'zoom.wav', at: bar(11) - 1.0, vol: 0.62 },
        { src: 'skybed.wav', at: bar(11) - 0.3, vol: 0.4 },
        // Each sky shot lasts SKY_SHIFT / 4; its reticle draws on about 8 frames in
        ...[0, 1, 2, 3].map((k) => ({ src: `reticle_${k}.wav`, at: bar(11) + (k * SKY_SHIFT) / 4 + 8 / FPS, vol: 0.34 })),
      ]
    : []),
  // The nebulae: a reversed breath swelling into the cut (softer under Vela's line in the Skies act), a glint as we arrive
  { src: 'breath.wav', at: late(bar(11)) - 3.0, vol: SKY_SHIFT > 0 ? 0.32 : 0.5 },
  { src: 'glint.wav', at: late(bar(11)) - 0.15, vol: 0.4 },
  { src: 'glint.wav', at: late(bar(11) + H) - 0.15, vol: 0.3 },
  { src: 'swoosh.wav', at: late(bar(12)) - 0.3, vol: 0.38 },
  { src: 'chime.wav', at: late(bar(12)) + 0.2, vol: 0.26 },
  { src: 'swoosh.wav', at: late(bar(13)) - 0.3, vol: 0.38 },
  { src: 'chime.wav', at: late(bar(13)) + 0.2, vol: 0.26 },

  // And beyond: a second riser into a deeper hit, the years counted out, gravity
  { src: 'riser.wav', at: late(bar(14)) - 3.2, vol: 0.5 },
  { src: 'hit_deep.wav', at: late(bar(14)), vol: 0.8 },
  { src: 'count.wav', at: late(bar(15)) + 0.3, vol: 0.5 },
  { src: 'gravity.wav', at: late(bar(16)), vol: 0.6 },

  // The lockup: the chord blooms, the mark builds again, one bell after her last words
  { src: 'bloom.wav', at: late(bar(17)) - 0.15, vol: 0.55 },
  ...logoBuild(late(bar(17)), 0.7),
  { src: 'bell.wav', at: late(64.75), vol: 0.34 },
];

export const SoundDesign: React.FC = () => (
  <>
    {CUES.map((c, i) => (
      <Sequence key={i} from={Math.max(0, sec(c.at))} name={`sfx ${c.src}`} layout="none">
        <Audio src={staticFile(`audio/sfx/${c.src}`)} volume={c.vol} trimBefore={c.trim ? sec(c.trim) : undefined} />
      </Sequence>
    ))}
  </>
);
