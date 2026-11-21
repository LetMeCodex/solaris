/**
 * Shared tile streaming infrastructure for Solaris:
 * 1. `Float32Pool` — memory-aligned TypedArray buffer pool for elevation rasters & mesh height grids.
 * 2. `LruCache<T>` — O(1) entry + byte-bounded LRU cache with pinning & residency grace windows.
 * 3. `PersistentTileStore` — optional Cache API / IndexedDB disk backing (graceful no-op in tests/SSR).
 * 4. `TileCache` — in-flight request deduplication, per-host concurrency limiter with priority queue,
 *    hysteresis-safe aborting (eliminates net::ERR_ABORTED thrashing), and Esri placeholder detection.
 * 5. `DemDecoder` — lazy Web Worker pool backed by `demDecode.worker.ts` with automatic safe
 *    main-thread fallback for Vitest/SSR/environments without Worker/OffscreenCanvas.
 */
import { perf, type QualityTier } from '../rendering/Performance';
import { decodeLerc1 } from './Lerc1';
import {
  decodeTerrariumRgba,
  decodeTrek8Rgba,
  type DemDecodeRequest,
  type DemDecodeResponse,
} from './demDecode.worker';

export interface Float32PoolStats {
  pooledBuffers: number;
  pooledBytes: number;
  hits: number;
  misses: number;
}

/**
 * Memory-aligned pool of `Float32Array` buffers bucketed by exact element count.
 * Eliminates repeated 256 KB / 1 MB GC allocations during high-speed DEM and terrain streaming.
 */
export class Float32Pool {
  private buckets = new Map<number, Float32Array[]>();
  private pooledBuffers = 0;
  private pooledBytes = 0;
  private hits = 0;
  private misses = 0;

  constructor(
    private readonly maxBytes: number = 32 * 1024 * 1024,
    private readonly maxPerBucket: number = 48
  ) {}

  public acquire(length: number, zeroFill = false): Float32Array {
    if (length <= 0) return new Float32Array(0);
    const list = this.buckets.get(length);
    if (list && list.length > 0) {
      const buf = list.pop()!;
      this.pooledBuffers--;
      this.pooledBytes -= buf.byteLength;
      this.hits++;
      if (zeroFill) buf.fill(0);
      return buf;
    }
    this.misses++;
    return new Float32Array(length);
  }

  public release(buf: Float32Array | null | undefined): void {
    if (!buf || buf.length === 0 || buf.byteLength === 0) return;
    if (buf.byteLength > this.maxBytes * 0.5) return;
    let list = this.buckets.get(buf.length);
    if (!list) {
      list = [];
      this.buckets.set(buf.length, list);
    }
    if (list.length >= this.maxPerBucket) return;
    if (this.pooledBytes + buf.byteLength > this.maxBytes) return;
    list.push(buf);
    this.pooledBuffers++;
    this.pooledBytes += buf.byteLength;
  }

  public clear(): void {
    this.buckets.clear();
    this.pooledBuffers = 0;
    this.pooledBytes = 0;
  }

  public stats(): Float32PoolStats {
    return {
      pooledBuffers: this.pooledBuffers,
      pooledBytes: this.pooledBytes,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

export const float32Pool = new Float32Pool();

export interface LruCacheOptions<T> {
  maxEntries: number;
  maxBytes?: number;
  /** Minimum residency window (ms) before soft eviction; bypassed if hard cap (1.5×) is hit. */
  minAgeMs?: number;
  onEvict?: (key: string, value: T) => void;
}

interface LruEntry<T> {
  value: T;
  bytes: number;
  lastUsed: number;
  pinned: boolean;
}

/** O(1) memory-aligned LRU cache supporting entry limits, byte limits, pinning, and eviction hooks. */
export class LruCache<T> {
  private map = new Map<string, LruEntry<T>>();
  private totalBytes = 0;
  private maxEntries: number;
  private maxBytes: number;
  private minAgeMs: number;
  private onEvict?: (key: string, value: T) => void;

  constructor(opts: LruCacheOptions<T>) {
    this.maxEntries = Math.max(1, opts.maxEntries);
    this.maxBytes = opts.maxBytes ?? Infinity;
    this.minAgeMs = opts.minAgeMs ?? 5000;
    this.onEvict = opts.onEvict;
  }

  public get size(): number {
    return this.map.size;
  }

  public get bytes(): number {
    return this.totalBytes;
  }

  public setLimits(maxEntries: number, maxBytes?: number): void {
    this.maxEntries = Math.max(1, maxEntries);
    if (maxBytes !== undefined) this.maxBytes = maxBytes;
    this.evict();
  }

  public has(key: string): boolean {
    return this.map.has(key);
  }

  public peek(key: string): T | undefined {
    return this.map.get(key)?.value;
  }

  public get(key: string, now = performance.now()): T | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    entry.lastUsed = now;
    // Move to MRU tail
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  public set(key: string, value: T, bytes = 0, now = performance.now()): void {
    const existing = this.map.get(key);
    const pinned = existing?.pinned ?? false;
    if (existing) {
      this.totalBytes -= existing.bytes;
      this.map.delete(key);
    }
    const safeBytes = Math.max(0, bytes);
    this.map.set(key, { value, bytes: safeBytes, lastUsed: now, pinned });
    this.totalBytes += safeBytes;
    this.evict(now);
  }

  public pin(key: string): void {
    const e = this.map.get(key);
    if (e) e.pinned = true;
  }

  public unpin(key: string): void {
    const e = this.map.get(key);
    if (e) e.pinned = false;
  }

  public delete(key: string, invokeEvict = false): boolean {
    const existing = this.map.get(key);
    if (!existing) return false;
    this.map.delete(key);
    this.totalBytes -= existing.bytes;
    if (invokeEvict) this.onEvict?.(key, existing.value);
    return true;
  }

  public clear(invokeEvict = true): void {
    if (invokeEvict && this.onEvict) {
      for (const [k, e] of this.map) this.onEvict(k, e.value);
    }
    this.map.clear();
    this.totalBytes = 0;
  }

  public *entries(): IterableIterator<[string, T]> {
    for (const [k, e] of this.map) yield [k, e.value];
  }

  public *values(): IterableIterator<T> {
    for (const e of this.map.values()) yield e.value;
  }

  public evict(now = performance.now()): void {
    if (this.map.size <= this.maxEntries && this.totalBytes <= this.maxBytes) return;
    const hardOver = this.map.size > this.maxEntries * 1.5 || this.totalBytes > this.maxBytes * 1.5;
    for (const [k, e] of this.map) {
      if (this.map.size <= this.maxEntries && this.totalBytes <= this.maxBytes) break;
      if (e.pinned) continue;
      if (!hardOver && now - e.lastUsed < this.minAgeMs) continue;
      this.map.delete(k);
      this.totalBytes -= e.bytes;
      this.onEvict?.(k, e.value);
    }
  }
}

const PERSIST_CACHE_NAME = 'solaris-tile-cache-v1';
const PERSIST_IDB_NAME = 'solaris-tile-idb-v1';
const PERSIST_IDB_STORE = 'tiles';
const PERSIST_MAX_ENTRIES = 600;

/**
 * Optional browser persistence using Cache API with IndexedDB fallback.
 * Gracefully no-ops in Vitest, Node/SSR, or storage-restricted contexts.
 */
class PersistentTileStore {
  private cachePromise: Promise<Cache | null> | null = null;
  private idbPromise: Promise<IDBDatabase | null> | null = null;
  private writes = 0;
  private disabled = false;

  private canUseCacheApi(): boolean {
    return (
      !this.disabled &&
      typeof caches !== 'undefined' &&
      typeof Request !== 'undefined' &&
      typeof Response !== 'undefined' &&
      typeof window !== 'undefined'
    );
  }

  private canUseIdb(): boolean {
    return !this.disabled && typeof indexedDB !== 'undefined' && typeof window !== 'undefined';
  }

  private openCache(): Promise<Cache | null> {
    if (!this.canUseCacheApi()) return Promise.resolve(null);
    if (!this.cachePromise) {
      this.cachePromise = caches.open(PERSIST_CACHE_NAME).catch(() => null);
    }
    return this.cachePromise;
  }

  private openIdb(): Promise<IDBDatabase | null> {
    if (!this.canUseIdb()) return Promise.resolve(null);
    if (!this.idbPromise) {
      this.idbPromise = new Promise<IDBDatabase | null>((resolve) => {
        try {
          const req = indexedDB.open(PERSIST_IDB_NAME, 1);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(PERSIST_IDB_STORE)) {
              db.createObjectStore(PERSIST_IDB_STORE, { keyPath: 'url' });
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }
    return this.idbPromise;
  }

  public async get(url: string): Promise<ArrayBuffer | null> {
    if (this.disabled) return null;
    try {
      const cache = await this.openCache();
      if (cache) {
        const match = await cache.match(url);
        if (match) return await match.arrayBuffer();
        return null;
      }
      const db = await this.openIdb();
      if (!db) return null;
      return await new Promise<ArrayBuffer | null>((resolve) => {
        try {
          const tx = db.transaction(PERSIST_IDB_STORE, 'readonly');
          const req = tx.objectStore(PERSIST_IDB_STORE).get(url);
          req.onsuccess = () => {
            const rec = req.result as { data?: ArrayBuffer } | undefined;
            resolve(rec?.data instanceof ArrayBuffer ? rec.data.slice(0) : null);
          };
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  public async put(url: string, data: ArrayBuffer, contentType = 'application/octet-stream'): Promise<void> {
    if (this.disabled || data.byteLength === 0) return;
    // Clone immediately so caller can transfer original ArrayBuffer to a Web Worker safely.
    const copy = data.slice(0);
    try {
      const cache = await this.openCache();
      if (cache) {
        const res = new Response(copy, {
          headers: { 'Content-Type': contentType, 'X-Solaris-Cached': String(Date.now()) },
        });
        await cache.put(url, res);
        if (++this.writes % 80 === 0) void this.pruneCache(cache);
        return;
      }
      const db = await this.openIdb();
      if (!db) return;
      await new Promise<void>((resolve) => {
        try {
          const tx = db.transaction(PERSIST_IDB_STORE, 'readwrite');
          tx.objectStore(PERSIST_IDB_STORE).put({ url, data: copy, ts: Date.now() });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    } catch {
      // Storage quota or private mode: degrade silently to in-memory only
      this.disabled = true;
    }
  }

  private async pruneCache(cache: Cache): Promise<void> {
    try {
      const keys = await cache.keys();
      if (keys.length <= PERSIST_MAX_ENTRIES) return;
      const excess = keys.length - PERSIST_MAX_ENTRIES;
      for (let i = 0; i < excess; i++) {
        await cache.delete(keys[i]);
      }
    } catch {
      // ignore pruning errors
    }
  }
}

export interface TileRequestOptions {
  /** Lower number = fetched first (e.g. coarse z<=3 anchors use negative priority; foreground uses distance). */
  priority?: number;
  /** Tile zoom level; coarse anchors (z <= 3) are protected from hysteresis aborts. */
  z?: number;
  /** Request timeout in milliseconds (default 15_000). */
  timeoutMs?: number;
  /** Grace window (ms) before aborting an unwanted in-flight request (default 500ms). */
  hysteresisMs?: number;
  /** Whether to read/write Cache API / IndexedDB persistence (default true for remote URLs). */
  persist?: boolean;
  /** Detect Esri World Imagery "Map data not yet available" grey ocean placeholder (default true). */
  detectEsriNoData?: boolean;
  /** Optional explicit per-host concurrency override. */
  hostLimit?: number;
}

export type TileFetchStatus = 'ok' | 'nodata' | 'aborted' | 'error';

export interface TileFetchResult<T> {
  status: TileFetchStatus;
  data: T | null;
  httpStatus?: number;
  fromCache?: boolean;
}

export interface TileCacheStats {
  hits: number;
  misses: number;
  coalesced: number;
  aborted: number;
  errors: number;
  persistedHits: number;
  inFlight: number;
  queued: number;
}

interface HostQueueState {
  running: number;
  queue: InFlightTask[];
}

interface InFlightTask {
  key: string;
  url: string;
  host: string;
  priority: number;
  z: number;
  timeoutMs: number;
  hysteresisMs: number;
  persist: boolean;
  detectEsriNoData: boolean;
  hostLimit?: number;
  state: 'queued' | 'running' | 'settled';
  wanted: boolean;
  controller?: AbortController;
  abortTimer?: ReturnType<typeof setTimeout>;
  timeoutTimer?: ReturnType<typeof setTimeout>;
  promise: Promise<TileFetchResult<ArrayBuffer>>;
  resolve: (result: TileFetchResult<ArrayBuffer>) => void;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_HYSTERESIS_MS = 500;
const ESRI_NODATA_ETAG = '"vvvvvvvvvvvvf"';
const ESRI_NODATA_BYTES = 2521;

const HOST_CONCURRENCY: Record<string, Record<QualityTier, number>> = {
  local: { low: 8, medium: 12, high: 16 },
  'server.arcgisonline.com': { low: 4, medium: 8, high: 12 },
  's3.amazonaws.com': { low: 4, medium: 6, high: 8 },
  'tiles.maps.eox.at': { low: 4, medium: 6, high: 8 },
  'gibs.earthdata.nasa.gov': { low: 4, medium: 6, high: 8 },
  'trek.nasa.gov': { low: 3, medium: 4, high: 4 },
  'astro.arcgis.com': { low: 4, medium: 6, high: 8 },
  'planetarymaps.usgs.gov': { low: 2, medium: 3, high: 4 },
};
const DEFAULT_HOST_CONCURRENCY: Record<QualityTier, number> = { low: 4, medium: 6, high: 8 };

function extractHost(url: string): string {
  if (!/^https?:\/\//i.test(url)) return 'local';
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return 'default';
  }
}

/**
 * Unified tile fetch scheduler with:
 * - In-flight request deduplication (coalesces identical tile keys)
 * - Per-host concurrency limiting with dynamic priority queue
 * - Hysteresis-safe aborting (drops queued requests cleanly; gives in-flight fetches a grace window)
 * - Optional Cache API / IndexedDB persistence
 * - Esri "Map data not yet available" placeholder detection
 */
export class TileCache {
  private tasks = new Map<string, InFlightTask>();
  private hosts = new Map<string, HostQueueState>();
  private rawCache: LruCache<ArrayBuffer>;
  private store = new PersistentTileStore();
  private fetchImpl?: typeof fetch;
  private stats: Omit<TileCacheStats, 'inFlight' | 'queued'> = {
    hits: 0,
    misses: 0,
    coalesced: 0,
    aborted: 0,
    errors: 0,
    persistedHits: 0,
  };

  constructor(opts?: {
    maxRawEntries?: number;
    maxRawBytes?: number;
    fetchImpl?: typeof fetch;
    disablePersistence?: boolean;
  }) {
    this.rawCache = new LruCache<ArrayBuffer>({
      maxEntries: opts?.maxRawEntries ?? 256,
      maxBytes: opts?.maxRawBytes ?? 48 * 1024 * 1024,
      minAgeMs: 5000,
    });
    this.fetchImpl = opts?.fetchImpl;
    if (opts?.disablePersistence) {
      (this.store as unknown as { disabled: boolean }).disabled = true;
    }
  }

  public hostConcurrencyLimit(host: string, override?: number): number {
    if (override !== undefined && override > 0) return Math.floor(override);
    const tier = perf.tier;
    return (HOST_CONCURRENCY[host] ?? DEFAULT_HOST_CONCURRENCY)[tier];
  }

  /**
   * Fetch raw bytes for a tile key with in-flight deduplication, per-host priority scheduling,
   * memory LRU + optional persistent cache, and hysteresis-safe cancellation.
   */
  public fetchBuffer(
    key: string,
    url: string,
    opts: TileRequestOptions = {}
  ): Promise<TileFetchResult<ArrayBuffer>> {
    const cached = this.rawCache.get(key);
    if (cached) {
      this.stats.hits++;
      return Promise.resolve({ status: 'ok', data: cached.slice(0), fromCache: true });
    }

    const existing = this.tasks.get(key);
    if (existing && existing.state !== 'settled') {
      this.stats.coalesced++;
      existing.wanted = true;
      if (existing.abortTimer) {
        clearTimeout(existing.abortTimer);
        existing.abortTimer = undefined;
      }
      const nextPriority = opts.priority ?? existing.priority;
      if (nextPriority < existing.priority) existing.priority = nextPriority;
      return existing.promise;
    }

    this.stats.misses++;
    const host = extractHost(url);
    let resolveFn!: (r: TileFetchResult<ArrayBuffer>) => void;
    const promise = new Promise<TileFetchResult<ArrayBuffer>>((resolve) => {
      resolveFn = resolve;
    });

    const task: InFlightTask = {
      key,
      url,
      host,
      priority: opts.priority ?? 100,
      z: opts.z ?? 10,
      timeoutMs: opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      hysteresisMs: opts.hysteresisMs ?? DEFAULT_HYSTERESIS_MS,
      persist: opts.persist ?? host !== 'local',
      detectEsriNoData: opts.detectEsriNoData ?? url.includes('arcgisonline.com'),
      hostLimit: opts.hostLimit,
      state: 'queued',
      wanted: true,
      promise,
      resolve: resolveFn,
    };

    this.tasks.set(key, task);
    const hq = this.getHostState(host);
    hq.queue.push(task);
    this.pumpHost(host);
    return promise;
  }

  /**
   * Fetch and decode an imagery tile off-thread into an `ImageBitmap` (with `HTMLImageElement`
   * fallback when `createImageBitmap` is unavailable).
   */
  public async fetchImageBitmap(
    key: string,
    url: string,
    opts: TileRequestOptions = {}
  ): Promise<TileFetchResult<ImageBitmap | HTMLImageElement>> {
    const res = await this.fetchBuffer(key, url, opts);
    if (res.status !== 'ok' || !res.data) {
      return { status: res.status, data: null, httpStatus: res.httpStatus, fromCache: res.fromCache };
    }
    try {
      const blob = new Blob([res.data]);
      if (typeof createImageBitmap === 'function') {
        const bmp = await createImageBitmap(blob);
        if (bmp.width <= 0 || bmp.height <= 0) {
          bmp.close();
          return { status: 'error', data: null, httpStatus: res.httpStatus };
        }
        return { status: 'ok', data: bmp, httpStatus: res.httpStatus, fromCache: res.fromCache };
      }
      if (typeof Image !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const objUrl = URL.createObjectURL(blob);
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const el = new Image();
          el.decoding = 'async';
          el.onload = () => {
            URL.revokeObjectURL(objUrl);
            resolve(el.naturalWidth > 0 && el.naturalHeight > 0 ? el : null);
          };
          el.onerror = () => {
            URL.revokeObjectURL(objUrl);
            resolve(null);
          };
          el.src = objUrl;
        });
        return img
          ? { status: 'ok', data: img, httpStatus: res.httpStatus, fromCache: res.fromCache }
          : { status: 'error', data: null, httpStatus: res.httpStatus };
      }
      return { status: 'error', data: null, httpStatus: res.httpStatus };
    } catch {
      return { status: 'error', data: null, httpStatus: res.httpStatus };
    }
  }

  /** Dynamically update priority of an active queued/in-flight request without canceling it. */
  public updatePriority(key: string, priority: number): void {
    const task = this.tasks.get(key);
    if (!task || task.state === 'settled') return;
    task.priority = priority;
    task.wanted = true;
    if (task.abortTimer) {
      clearTimeout(task.abortTimer);
      task.abortTimer = undefined;
    }
  }

  /**
   * Hysteresis-safe cancellation for a single tile key:
   * - If still queued (not yet sent on the wire): drops immediately with ZERO `net::ERR_ABORTED`.
   * - If already in-flight on the wire: protects coarse anchors (`z <= 3`) and waits `hysteresisMs`
   *   before aborting so momentary camera jitters never thrash connections.
   */
  public markUnwanted(key: string, hysteresisMs?: number): void {
    const task = this.tasks.get(key);
    if (!task || task.state === 'settled') return;
    if (task.state === 'queued') {
      const hq = this.hosts.get(task.host);
      if (hq) {
        const idx = hq.queue.indexOf(task);
        if (idx >= 0) hq.queue.splice(idx, 1);
      }
      this.settleTask(task, { status: 'aborted', data: null }, false);
      this.stats.aborted++;
      return;
    }
    // In-flight: protect coarse anchor tiles so fallback terrain always finishes promptly
    if (task.z <= 3) return;
    task.wanted = false;
    if (task.abortTimer) return;
    const delay = Math.max(0, hysteresisMs ?? task.hysteresisMs);
    task.abortTimer = setTimeout(() => {
      task.abortTimer = undefined;
      if (!task.wanted && task.state === 'running') {
        task.controller?.abort();
      }
    }, delay);
  }

  /**
   * Sync wanted tile keys for a given key prefix (e.g. `'img:'` or `'dem:'`):
   * cancels pending hysteresis aborts for wanted tiles and gracefully releases unwanted ones.
   */
  public keepWanted(wantedKeys: ReadonlySet<string>, prefix = '', hysteresisMs?: number): void {
    for (const task of [...this.tasks.values()]) {
      if (prefix && !task.key.startsWith(prefix)) continue;
      if (wantedKeys.has(task.key)) {
        task.wanted = true;
        if (task.abortTimer) {
          clearTimeout(task.abortTimer);
          task.abortTimer = undefined;
        }
      } else {
        this.markUnwanted(task.key, hysteresisMs);
      }
    }
  }

  /** Hard cancel all queued and in-flight requests (e.g. on body switch or layer disposal). */
  public cancelAll(prefix = ''): void {
    for (const task of [...this.tasks.values()]) {
      if (prefix && !task.key.startsWith(prefix)) continue;
      if (task.abortTimer) {
        clearTimeout(task.abortTimer);
        task.abortTimer = undefined;
      }
      if (task.state === 'queued') {
        const hq = this.hosts.get(task.host);
        if (hq) {
          const idx = hq.queue.indexOf(task);
          if (idx >= 0) hq.queue.splice(idx, 1);
        }
        this.settleTask(task, { status: 'aborted', data: null }, false);
        this.stats.aborted++;
      } else if (task.state === 'running') {
        task.wanted = false;
        task.controller?.abort();
      }
    }
  }

  public clearMemoryCache(): void {
    this.rawCache.clear(false);
  }

  public getStats(): TileCacheStats {
    let inFlight = 0;
    let queued = 0;
    for (const hq of this.hosts.values()) {
      inFlight += hq.running;
      queued += hq.queue.length;
    }
    return { ...this.stats, inFlight, queued };
  }

  private getHostState(host: string): HostQueueState {
    let hq = this.hosts.get(host);
    if (!hq) {
      hq = { running: 0, queue: [] };
      this.hosts.set(host, hq);
    }
    return hq;
  }

  private pumpHost(host: string): void {
    const hq = this.hosts.get(host);
    if (!hq) return;
    while (hq.queue.length > 0) {
      let bestIdx = 0;
      let bestPri = hq.queue[0].priority;
      for (let i = 1; i < hq.queue.length; i++) {
        if (hq.queue[i].priority < bestPri) {
          bestPri = hq.queue[i].priority;
          bestIdx = i;
        }
      }
      const next = hq.queue[bestIdx];
      const limit = this.hostConcurrencyLimit(host, next.hostLimit);
      if (hq.running >= limit) break;
      hq.queue.splice(bestIdx, 1);
      if (next.state !== 'queued') continue;
      this.runTask(next, hq);
    }
  }

  private runTask(task: InFlightTask, hq: HostQueueState): void {
    task.state = 'running';
    hq.running++;

    void (async () => {
      try {
        if (task.persist) {
          const persisted = await this.store.get(task.url);
          if (persisted && persisted.byteLength > 0) {
            if (task.state !== 'running') return;
            this.stats.persistedHits++;
            this.rawCache.set(task.key, persisted, persisted.byteLength);
            if (task.z <= 3) this.rawCache.pin(task.key);
            this.settleTask(task, { status: 'ok', data: persisted.slice(0), fromCache: true }, true);
            return;
          }
        }

        const doFetch = this.fetchImpl ?? (typeof fetch === 'function' ? fetch : null);
        if (!doFetch) {
          this.stats.errors++;
          this.settleTask(task, { status: 'error', data: null }, true);
          return;
        }

        const controller = new AbortController();
        task.controller = controller;
        task.timeoutTimer = setTimeout(() => controller.abort(), task.timeoutMs);

        const res = await doFetch(task.url, { signal: controller.signal, mode: task.host === 'local' ? 'same-origin' : 'cors' });
        if (!res.ok) {
          this.stats.errors++;
          this.settleTask(
            task,
            { status: res.status === 404 || res.status === 204 ? 'nodata' : 'error', data: null, httpStatus: res.status },
            true
          );
          return;
        }

        const etag = res.headers?.get?.('etag') ?? '';
        const contentLen = res.headers?.get?.('content-length') ?? '';
        if (task.detectEsriNoData && (etag === ESRI_NODATA_ETAG || (task.z >= 14 && contentLen === String(ESRI_NODATA_BYTES)))) {
          this.settleTask(task, { status: 'nodata', data: null, httpStatus: res.status }, true);
          return;
        }

        const buf = await res.arrayBuffer();
        if (buf.byteLength === 0) {
          this.settleTask(task, { status: 'nodata', data: null, httpStatus: res.status }, true);
          return;
        }
        if (task.detectEsriNoData && task.z >= 14 && buf.byteLength === ESRI_NODATA_BYTES) {
          this.settleTask(task, { status: 'nodata', data: null, httpStatus: res.status }, true);
          return;
        }

        this.rawCache.set(task.key, buf, buf.byteLength);
        if (task.z <= 3) this.rawCache.pin(task.key);
        if (task.persist) {
          const ct = res.headers?.get?.('content-type') ?? 'application/octet-stream';
          void this.store.put(task.url, buf, ct);
        }
        this.settleTask(task, { status: 'ok', data: buf.slice(0), httpStatus: res.status, fromCache: false }, true);
      } catch (err) {
        const isAbort =
          !task.wanted ||
          (err instanceof DOMException && err.name === 'AbortError') ||
          (err instanceof Error && err.name === 'AbortError');
        if (isAbort) {
          this.stats.aborted++;
          this.settleTask(task, { status: 'aborted', data: null }, true);
        } else {
          this.stats.errors++;
          this.settleTask(task, { status: 'error', data: null }, true);
        }
      }
    })();
  }

  private settleTask(task: InFlightTask, result: TileFetchResult<ArrayBuffer>, wasRunning: boolean): void {
    if (task.state === 'settled') return;
    task.state = 'settled';
    if (task.abortTimer) {
      clearTimeout(task.abortTimer);
      task.abortTimer = undefined;
    }
    if (task.timeoutTimer) {
      clearTimeout(task.timeoutTimer);
      task.timeoutTimer = undefined;
    }
    if (this.tasks.get(task.key) === task) {
      this.tasks.delete(task.key);
    }
    if (wasRunning) {
      const hq = this.hosts.get(task.host);
      if (hq) {
        hq.running = Math.max(0, hq.running - 1);
      }
    }
    task.resolve(result);
    if (wasRunning) this.pumpHost(task.host);
  }
}

export const tileCache = new TileCache();

export interface DecodedDem {
  heights: Float32Array;
  width: number;
  height: number;
}

interface PendingWorkerJob {
  resolve: (res: DecodedDem | null) => void;
  fallback: () => Promise<DecodedDem | null>;
}

interface WorkerSlot {
  worker: Worker;
  pending: Map<number, PendingWorkerJob>;
}

/**
 * Off-main-thread DEM decoder backed by a pool of `demDecode.worker.ts` Web Workers, with
 * automatic zero-config main-thread fallback for Vitest, SSR, or browsers lacking OffscreenCanvas.
 */
export class DemDecoder {
  private slots: WorkerSlot[] = [];
  private nextId = 1;
  private workerBroken = false;
  private workerPngBroken = false;
  private pngWorkerVerified = false;
  private fallbackCanvas: HTMLCanvasElement | null = null;
  private fallbackCtx: CanvasRenderingContext2D | null = null;

  private canSpawnWorker(): boolean {
    if (this.workerBroken) return false;
    return typeof Worker !== 'undefined' && typeof window !== 'undefined';
  }

  private canWorkerDecodePng(): boolean {
    return (
      !this.workerPngBroken &&
      this.canSpawnWorker() &&
      typeof OffscreenCanvas !== 'undefined' &&
      typeof createImageBitmap === 'function'
    );
  }

  private ensureWorkers(): WorkerSlot[] {
    if (!this.canSpawnWorker()) return [];
    const targetCount = perf.tier === 'low' ? 1 : 2;
    while (this.slots.length < targetCount) {
      try {
        const worker = new Worker(new URL('./demDecode.worker.ts', import.meta.url), { type: 'module' });
        const slot: WorkerSlot = { worker, pending: new Map() };
        worker.onmessage = (ev: MessageEvent<DemDecodeResponse>) => {
          const msg = ev.data;
          if (!msg) return;
          const job = slot.pending.get(msg.id);
          if (!job) return;
          slot.pending.delete(msg.id);
          if (msg.ok) {
            this.pngWorkerVerified = true;
            job.resolve({ heights: msg.heights, width: msg.width, height: msg.height });
          } else if (msg.fallbackMainThread) {
            this.workerPngBroken = true;
            void job.fallback().then(job.resolve);
          } else {
            job.resolve(null);
          }
        };
        worker.onerror = () => {
          this.workerBroken = true;
          const jobs = [...slot.pending.values()];
          slot.pending.clear();
          for (const j of jobs) void j.fallback().then(j.resolve);
          this.dispose();
        };
        this.slots.push(slot);
      } catch {
        this.workerBroken = true;
        return [];
      }
    }
    return this.slots;
  }

  private pickSlot(): WorkerSlot | null {
    const slots = this.ensureWorkers();
    if (slots.length === 0) return null;
    let best = slots[0];
    for (let i = 1; i < slots.length; i++) {
      if (slots[i].pending.size < best.pending.size) best = slots[i];
    }
    return best;
  }

  private postToWorker(
    slot: WorkerSlot,
    request: DemDecodeRequest,
    transfer: Transferable[],
    fallback: () => Promise<DecodedDem | null>
  ): Promise<DecodedDem | null> {
    return new Promise<DecodedDem | null>((resolve) => {
      slot.pending.set(request.id, { resolve, fallback });
      try {
        slot.worker.postMessage(request, transfer);
      } catch {
        slot.pending.delete(request.id);
        this.workerBroken = true;
        void fallback().then(resolve);
      }
    });
  }

  public decodeTerrarium(buffer: ArrayBuffer): Promise<DecodedDem | null> {
    if (buffer.byteLength === 0) return Promise.resolve(null);
    if (this.canWorkerDecodePng()) {
      const slot = this.pickSlot();
      if (slot) {
        // Keep a fallback clone only until the first PNG decode succeeds on OffscreenCanvas.
        const backup = this.pngWorkerVerified ? null : buffer.slice(0);
        const id = this.nextId++;
        return this.postToWorker(
          slot,
          { id, kind: 'terrarium', buffer },
          [buffer],
          () => this.decodePngMainThread(backup ?? new ArrayBuffer(0), 'terrarium', 0, 1)
        );
      }
    }
    return this.decodePngMainThread(buffer, 'terrarium', 0, 1);
  }

  public decodeLerc1(buffer: ArrayBuffer, scaleDivisor = 1): Promise<DecodedDem | null> {
    if (buffer.byteLength === 0) return Promise.resolve(null);
    if (this.canSpawnWorker()) {
      const slot = this.pickSlot();
      if (slot) {
        const backup = buffer.slice(0);
        const id = this.nextId++;
        return this.postToWorker(
          slot,
          { id, kind: 'lerc1', buffer, scaleDivisor },
          [buffer],
          () => Promise.resolve(this.decodeLerc1MainThread(backup, scaleDivisor))
        );
      }
    }
    return Promise.resolve(this.decodeLerc1MainThread(buffer, scaleDivisor));
  }

  public decodeTrek8(buffer: ArrayBuffer, a: number, b: number): Promise<DecodedDem | null> {
    if (buffer.byteLength === 0) return Promise.resolve(null);
    if (this.canWorkerDecodePng()) {
      const slot = this.pickSlot();
      if (slot) {
        const backup = this.pngWorkerVerified ? null : buffer.slice(0);
        const id = this.nextId++;
        return this.postToWorker(
          slot,
          { id, kind: 'trek8', buffer, a, b },
          [buffer],
          () => this.decodePngMainThread(backup ?? new ArrayBuffer(0), 'trek8', a, b)
        );
      }
    }
    return this.decodePngMainThread(buffer, 'trek8', a, b);
  }

  private decodeLerc1MainThread(buffer: ArrayBuffer, scaleDivisor: number): DecodedDem | null {
    try {
      const raster = decodeLerc1(buffer);
      if (scaleDivisor !== 1) {
        const p = raster.pixels;
        for (let i = 0; i < p.length; i++) p[i] /= scaleDivisor;
      }
      return { heights: raster.pixels, width: raster.width, height: raster.height };
    } catch {
      return null;
    }
  }

  private getFallbackContext(w: number, h: number): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null;
    if (!this.fallbackCanvas) {
      this.fallbackCanvas = document.createElement('canvas');
      this.fallbackCanvas.width = w;
      this.fallbackCanvas.height = h;
      this.fallbackCtx = this.fallbackCanvas.getContext('2d', { willReadFrequently: true });
    } else if (this.fallbackCanvas.width !== w || this.fallbackCanvas.height !== h) {
      this.fallbackCanvas.width = w;
      this.fallbackCanvas.height = h;
    }
    return this.fallbackCtx;
  }

  private async decodePngMainThread(
    buffer: ArrayBuffer,
    kind: 'terrarium' | 'trek8',
    a: number,
    b: number
  ): Promise<DecodedDem | null> {
    if (buffer.byteLength === 0 || typeof document === 'undefined') return null;
    try {
      const blob = new Blob([buffer], { type: 'image/png' });
      let source: ImageBitmap | HTMLImageElement | null = null;
      let w = 0;
      let h = 0;
      if (typeof createImageBitmap === 'function') {
        const bmp = await createImageBitmap(blob);
        source = bmp;
        w = bmp.width;
        h = bmp.height;
      } else if (typeof Image !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
        const objUrl = URL.createObjectURL(blob);
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const el = new Image();
          el.onload = () => {
            URL.revokeObjectURL(objUrl);
            resolve(el);
          };
          el.onerror = () => {
            URL.revokeObjectURL(objUrl);
            resolve(null);
          };
          el.src = objUrl;
        });
        if (!img) return null;
        source = img;
        w = img.naturalWidth || img.width;
        h = img.naturalHeight || img.height;
      }
      if (!source || w <= 0 || h <= 0) {
        if (source && 'close' in source && typeof source.close === 'function') source.close();
        return null;
      }
      try {
        const ctx = this.getFallbackContext(w, h);
        if (!ctx) return null;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(source, 0, 0, w, h);
        const rgba = ctx.getImageData(0, 0, w, h).data;
        const heights =
          kind === 'terrarium'
            ? decodeTerrariumRgba(rgba, w, h, float32Pool.acquire(w * h))
            : decodeTrek8Rgba(rgba, w, h, a, b);
        return { heights, width: w, height: h };
      } finally {
        if ('close' in source && typeof source.close === 'function') source.close();
      }
    } catch {
      return null;
    }
  }

  public dispose(): void {
    for (const slot of this.slots) {
      slot.worker.terminate();
      for (const job of slot.pending.values()) job.resolve(null);
      slot.pending.clear();
    }
    this.slots = [];
  }
}

export const demDecoder = new DemDecoder();
