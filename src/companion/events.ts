/**
 * Things that happen around Solaris that Vela likes to know about, sent as window events so any
 * part of the app can tell her without being wired to her.
 */
export interface VelaEvents {
  /** A nebula visit began (its name) or ended (null). */
  nebula: string | null;
  /** The idle time-lapse started or stopped, on a surface or at the black hole. */
  timelapse: { on: boolean; where: 'surface' | 'horizon' };
  /** A picture was taken. */
  shot: { first: boolean };
  /** You stepped into a Gallery postcard. */
  postcard: string;
  /** The Settings drawer opened. */
  settings: true;
}

const PREFIX = 'solaris:vela:';

export function emitVela<K extends keyof VelaEvents>(type: K, detail: VelaEvents[K]): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PREFIX + type, { detail }));
}

export function onVela<K extends keyof VelaEvents>(type: K, fn: (detail: VelaEvents[K]) => void): () => void {
  const h = (e: Event) => fn((e as CustomEvent<VelaEvents[K]>).detail);
  window.addEventListener(PREFIX + type, h);
  return () => window.removeEventListener(PREFIX + type, h);
}
