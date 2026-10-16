import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

// The music's beat grid (Helios Overture, 95.7 BPM): first downbeat at 16.37 s
export const BEAT = 0.6275;
export const BAR = BEAT * 4;
export const DOWNBEAT = 16.37;
/** Time of bar n (0 = the first downbeat), plus beats. */
export const bar = (n: number, beats = 0) => DOWNBEAT + n * BAR + beats * BEAT;

export const montserrat = loadMontserrat('normal', { weights: ['200', '300', '400', '500'], subsets: ['latin'] }).fontFamily;
export const serif = loadSerif('italic', { subsets: ['latin'] }).fontFamily;
export const serifUp = loadSerif('normal', { subsets: ['latin'] }).fontFamily;
export const mono = loadMono('normal', { weights: ['300', '400', '500'], subsets: ['latin'] }).fontFamily;

export const C = {
  ink: '#dcab76',
  inkHot: '#ffd9a6',
  night: '#050407',
  mint: '#6dfcc0',
  white: '#f3efe9',
  dim: 'rgba(243, 239, 233, 0.55)',
};
