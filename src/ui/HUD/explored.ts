import { CatalogueManager } from '../../data/CatalogueManager';

export interface ExploredPart {
  label: string;
  done: number;
  total: number;
}

export interface ExploredStats {
  done: number;
  total: number;
  /** 0..100 */
  pct: number;
  parts: { worlds: ExploredPart; moons: ExploredPart; minor: ExploredPart };
}

/**
 * How much of the known Solar System you have been to: every planet, dwarf planet, moon and
 * catalogued minor body (the Sun is home base, not a destination), counted from the logbook.
 */
export function exploredStats(visited: string[]): ExploredStats {
  const seen = new Set(visited);
  const parts = {
    worlds: { label: 'Planets', done: 0, total: 0 },
    moons: { label: 'Moons', done: 0, total: 0 },
    minor: { label: 'Small worlds', done: 0, total: 0 },
  };
  for (const b of CatalogueManager.getAllBodies()) {
    if (b.category === 'star') continue;
    const part = b.category === 'planet' ? parts.worlds : b.category === 'moon' ? parts.moons : parts.minor;
    part.total++;
    if (seen.has(b.name)) part.done++;
  }
  const done = parts.worlds.done + parts.moons.done + parts.minor.done;
  const total = parts.worlds.total + parts.moons.total + parts.minor.total;
  return { done, total, pct: total ? (done / total) * 100 : 0, parts };
}

/** A friendly reading of the percentage: more decimals while it is small. */
export function fmtPct(p: number): string {
  if (p === 0) return '0';
  if (p < 1) return p.toFixed(2);
  if (p < 10) return p.toFixed(1);
  return Math.round(p).toString();
}
