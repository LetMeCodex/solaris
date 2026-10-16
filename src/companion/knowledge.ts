import LINES from './vela-lines.json';

/**
 * What Vela knows: every line she can say (src/companion/vela-lines.json, each one recorded in
 * public/voice/vela/), the hidden things Solaris can do, and helpers to choose what to say where.
 * Facts were checked against NASA / ESA fact sheets.
 */

export type CompanionAction =
  | { kind: 'fly'; body: string }
  | { kind: 'sky'; body: string; facing?: string }
  | { kind: 'landmark'; id: string; body: string }
  | { kind: 'horizon' }
  | { kind: 'lens'; name: 'cinematic' | 'fisheye' | 'clean' }
  | { kind: 'zoom'; domain: 'inner_system' | 'outer_system' | 'galactic' }
  | { kind: 'time'; rate: number }
  | { kind: 'tour' };

export const VELA_LINES = LINES as Record<string, string>;

/**
 * The subtitle for a line. Square-bracket tags like [laugh] or [sniff] are sounds in the recording
 * (her giggle, a gasp, a sniffle), so they never appear as text.
 */
export function lineText(id: string): string {
  return (VELA_LINES[id] ?? '').replace(/\[[a-z ]+\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

export const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/** Line ids with a prefix, e.g. idsWith('idle.'). */
export function idsWith(prefix: string): string[] {
  return Object.keys(VELA_LINES).filter((k) => k.startsWith(prefix));
}

/** Fun-fact lines for a world (arrive.<Body>.n). */
export function factIds(body: string): string[] {
  return idsWith(`arrive.${body}.`);
}

/* ----------------------------------------------------------------------------------------------
   Hidden things worth showing someone. The pitch is the recorded line `secret.<id>`.
   ---------------------------------------------------------------------------------------------- */
export interface Secret {
  id: string;
  /** Worlds where Vela offers this on arrival. */
  at: string[];
  /** Short choice label shown in her dialogue box. */
  label: string;
  action: CompanionAction;
}

export const SECRETS: Secret[] = [
  { id: 'pan', at: ['Pan'], label: 'Stand on Pan', action: { kind: 'sky', body: 'Pan', facing: 'Saturn' } },
  { id: 'mimas', at: ['Saturn', 'Mimas'], label: 'Stand on Mimas', action: { kind: 'sky', body: 'Mimas', facing: 'Saturn' } },
  { id: 'iapetus', at: ['Saturn', 'Iapetus'], label: 'Go to Iapetus', action: { kind: 'sky', body: 'Iapetus', facing: 'Saturn' } },
  { id: 'enceladus', at: ['Saturn', 'Enceladus'], label: 'Stand on Enceladus', action: { kind: 'sky', body: 'Enceladus', facing: 'Saturn' } },
  { id: 'moon-earth', at: ['Earth', 'Moon'], label: 'Stand on the Moon', action: { kind: 'sky', body: 'Moon', facing: 'Earth' } },
  { id: 'everest', at: ['Earth'], label: 'Fly to Everest', action: { kind: 'landmark', id: 'earth-everest', body: 'Earth' } },
  { id: 'apollo', at: ['Moon'], label: 'Tranquility Base', action: { kind: 'landmark', id: 'moon-tranquility', body: 'Moon' } },
  { id: 'olympus', at: ['Mars'], label: 'Fly over Olympus Mons', action: { kind: 'landmark', id: 'mars-olympus', body: 'Mars' } },
  { id: 'phobos', at: ['Mars', 'Phobos'], label: 'Stand on Phobos', action: { kind: 'sky', body: 'Phobos', facing: 'Mars' } },
  { id: 'mars-sky', at: ['Mars'], label: 'Stand on Mars', action: { kind: 'sky', body: 'Mars' } },
  { id: 'io', at: ['Jupiter', 'Io'], label: 'Stand on Io', action: { kind: 'sky', body: 'Io', facing: 'Jupiter' } },
  { id: 'europa', at: ['Jupiter', 'Europa'], label: 'Stand on Europa', action: { kind: 'sky', body: 'Europa', facing: 'Jupiter' } },
  { id: 'titan', at: ['Saturn', 'Titan'], label: 'Land on Titan', action: { kind: 'sky', body: 'Titan' } },
  { id: 'miranda', at: ['Uranus', 'Miranda'], label: 'Stand on Miranda', action: { kind: 'sky', body: 'Miranda', facing: 'Uranus' } },
  { id: 'triton', at: ['Neptune', 'Triton'], label: 'Stand on Triton', action: { kind: 'sky', body: 'Triton', facing: 'Neptune' } },
  { id: 'charon', at: ['Pluto', 'Charon'], label: 'Stand on Charon', action: { kind: 'sky', body: 'Charon', facing: 'Pluto' } },
  { id: 'horizon', at: ['Sagittarius A*'], label: 'Take me to the shore', action: { kind: 'horizon' } },
  { id: 'blackhole', at: ['Neptune', 'Pluto'], label: 'To the black hole', action: { kind: 'fly', body: 'Sagittarius A*' } },
  { id: 'fisheye', at: [], label: 'Fisheye lens', action: { kind: 'lens', name: 'fisheye' } },
  { id: 'true-scale', at: [], label: 'Show me everything', action: { kind: 'zoom', domain: 'outer_system' } },
  { id: 'time', at: [], label: 'A year per second', action: { kind: 'time', rate: 31536000 } },
];

export function secretsAt(body: string): Secret[] {
  return SECRETS.filter((s) => s.at.includes(body));
}

/** Destinations with a "beautiful" view, for "take me somewhere beautiful". */
export function beautifulPlaces(): Secret[] {
  return SECRETS.filter((s) => s.action.kind === 'sky' || s.action.kind === 'horizon' || s.action.kind === 'landmark');
}
