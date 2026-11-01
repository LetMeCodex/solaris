import { OPEN } from './Open';
import { ACT_ONE } from './ActOne';
import { ACT_TWO } from './ActTwo';
import { ACT_THREE } from './ActThree';
import { BACK, LAST, WORLDS } from './Back';
import { END } from './End';
import { NUMBERS, type PageDef } from './registry';

export type { PageDef } from './registry';

const all: PageDef[] = [...OPEN, ...ACT_ONE, ...ACT_TWO, ...ACT_THREE, ...WORLDS, ...BACK, ...END, ...LAST];

all.forEach((p, i) => { p.n = i + 1; NUMBERS.set(p.id, i + 1); });
export const PAGES = all;
