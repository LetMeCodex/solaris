import { emitVela } from '../../companion/events';
import type { Postcard } from '../../data/Postcards';

/**
 * Your own pictures, kept in this browser (IndexedDB; nothing is uploaded). A shot taken while
 * standing on a world remembers exactly where and when, so you can step back into it.
 */

export interface Shot {
  id: string;
  at: number;
  blob: Blob;
  /** Where it was taken, for the label. */
  where: string;
  /** Set when it was taken from a surface: everything needed to return to it. */
  view: Postcard | null;
}

const DB = 'solaris-shots';
const STORE = 'shots';
export const SHOTS_CHANGED = 'solaris:shots-changed';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const r = fn(db.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export async function saveShot(shot: Omit<Shot, 'id' | 'at'>): Promise<void> {
  const first = (await listShots()).length === 0;
  const s: Shot = { ...shot, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() };
  await tx('readwrite', (st) => st.put(s));
  window.dispatchEvent(new Event(SHOTS_CHANGED));
  emitVela('shot', { first });
}

export async function listShots(): Promise<Shot[]> {
  try {
    const all = await tx<Shot[]>('readonly', (st) => st.getAll() as IDBRequest<Shot[]>);
    return all.sort((a, b) => b.at - a.at);
  } catch {
    return [];
  }
}

export async function deleteShot(id: string): Promise<void> {
  await tx('readwrite', (st) => st.delete(id));
  window.dispatchEvent(new Event(SHOTS_CHANGED));
}

export function downloadShot(s: Shot): void {
  const url = URL.createObjectURL(s.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solaris-${s.where.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date(s.at).toISOString().slice(0, 10)}.jpg`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
