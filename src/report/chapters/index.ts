import type React from 'react';
import { Orbits } from './Orbits';
import { Scale } from './Scale';
import { Sky } from './Sky';
import { Sun, Ground, Skies, Nebulae, BlackHole } from './Worlds';
import { Companion, Sound, Interface } from './Companion';
import { Film, Bugs, Log, References, Colophon } from './Making';

export interface ChapterDef {
  id: string;
  n: string;
  short: string;
  Component: React.FC;
}

export const CHAPTERS: ChapterDef[] = [
  { id: 'orbits', n: '01', short: 'Where everything is', Component: Orbits },
  { id: 'scale', n: '02', short: 'Scale and precision', Component: Scale },
  { id: 'sky', n: '03', short: 'Stars and the galaxy', Component: Sky },
  { id: 'sun', n: '04', short: 'The Sun', Component: Sun },
  { id: 'ground', n: '05', short: 'Surface imagery', Component: Ground },
  { id: 'skies', n: '06', short: 'Other skies', Component: Skies },
  { id: 'nebulae', n: '07', short: 'Nebulae', Component: Nebulae },
  { id: 'blackhole', n: '08', short: 'Sagittarius A*', Component: BlackHole },
  { id: 'vela', n: '09', short: 'Vela', Component: Companion },
  { id: 'sound', n: '10', short: 'The soundtrack', Component: Sound },
  { id: 'interface', n: '11', short: 'The interface', Component: Interface },
  { id: 'film', n: '12', short: 'The launch film', Component: Film },
  { id: 'bugs', n: '13', short: 'What broke', Component: Bugs },
  { id: 'log', n: '14', short: 'Build log', Component: Log },
  { id: 'refs', n: '15', short: 'References', Component: References },
  { id: 'colophon', n: '16', short: 'Honesty', Component: Colophon },
];
