type CacheEntry<T> = { value: T; expiresAt: number };

const mem = new Map<string, CacheEntry<any>>();
const inFlight = new Map<string, Promise<any>>();
const PREFIX = "pdx_cache:";

function now() {
  return Date.now();
}

function readLS<T>(key: string): CacheEntry<T> | null {
  const raw = localStorage.getItem(PREFIX + key);
  return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
}

function writeLS<T>(key: string, entry: CacheEntry<T>) {
  localStorage.setItem(PREFIX + key, JSON.stringify(entry));
}

export function invalidate(key: string) {
  mem.delete(key);
  localStorage.removeItem(PREFIX + key);
}

export function getCachedEntry<T>(key: string): CacheEntry<T> | null {
  const m = mem.get(key);
  if (m) return m as CacheEntry<T>;

  const ls = readLS<T>(key);
  if (ls) {
    mem.set(key, ls);
    return ls;
  }
  return null;
}

export function getCached<T>(key: string): T | null {
  const e = getCachedEntry<T>(key);
  if (!e) return null;
  if (e.expiresAt > now()) return e.value;
  return null;
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  const entry: CacheEntry<T> = { value, expiresAt: now() + ttlMs };
  mem.set(key, entry);
  writeLS(key, entry);
}

export async function getOrCreate<T>(
  key: string,
  factory: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  const fresh = getCached<T>(key);
  if (fresh) return fresh;

  const running = inFlight.get(key);
  if (running) return running as Promise<T>;

  const p = (async () => {
    const val = await factory();
    setCached(key, val, ttlMs);
    return val;
  })().finally(() => inFlight.delete(key));

  inFlight.set(key, p);
  return p;
}

export async function getSWR<T>(
  key: string,
  factory: () => Promise<T>,
  ttlMs: number,
): Promise<T> {
  const entry = getCachedEntry<T>(key);

  if (entry && entry.expiresAt > now()) return entry.value;

  if (entry) {
    void getOrCreate(key, factory, ttlMs).catch(() => {});
    return entry.value;
  }

  return getOrCreate(key, factory, ttlMs);
}
