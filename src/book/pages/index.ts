import { FRONT } from './Front';
import { CH01 } from './Ch01';
import { SCIENCE } from './Science';
import { CRAFT } from './Craft';
import { BACK, WORLDS } from './Back';
import { NUMBERS, type PageDef } from './registry';

export type { PageDef } from './registry';

const all: PageDef[] = [...FRONT, ...CH01, ...SCIENCE, ...CRAFT, ...WORLDS, ...BACK];

all.forEach((p, i) => { p.n = i + 1; NUMBERS.set(p.id, i + 1); });
export const PAGES = all;
