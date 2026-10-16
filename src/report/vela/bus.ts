import type { Costume } from './sprite';

/**
 * How the report talks to Vela. Sections, terms, figures and sources ask her to say something
 * (optionally about an element on the page, which she flies to and points at); she decides how.
 */

export type Mood = 'calm' | 'happy' | 'excited' | 'thinking' | 'surprised' | 'scared' | 'love' | 'proud' | 'sleepy';

export interface Line {
  text: string;
  /** The element she is talking about: she flies beside it and points. */
  target?: Element | null;
  mood?: Mood;
  /** Higher interrupts lower; equal replaces. Section intros 1, hovers 2, clicks 3. */
  priority?: number;
  /** Seconds to keep the bubble open after typing (defaults from length). */
  hold?: number;
}

type Listener = (e: { type: 'say'; line: Line } | { type: 'costume'; costume: Costume } | { type: 'hush' } | { type: 'cheer' }) => void;

const listeners = new Set<Listener>();
let costume: Costume = 'none';

export const vela = {
  say(line: Line | string) {
    const l = typeof line === 'string' ? { text: line } : line;
    listeners.forEach((fn) => fn({ type: 'say', line: l }));
  },
  costume(c: Costume) {
    if (c === costume) return;
    costume = c;
    listeners.forEach((fn) => fn({ type: 'costume', costume: c }));
  },
  hush() {
    listeners.forEach((fn) => fn({ type: 'hush' }));
  },
  cheer() {
    listeners.forEach((fn) => fn({ type: 'cheer' }));
  },
  on(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
