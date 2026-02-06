type CacheEntry<T> = { value: T; expiresAt: number };

const mem = new Map<string, CacheEntry<any>>();
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

export function getCached<T>(key: string): T | null {
  const m = mem.get(key);
  if (m && m.expiresAt > now()) return m.value;

  const ls = readLS<T>(key);
  if (ls && ls.expiresAt > now()) {
    mem.set(key, ls);
    return ls.value;
  }
  return null;
}

export function setCached<T>(key: string, value: T, ttlMs: number) {
  const entry: CacheEntry<T> = { value, expiresAt: now() + ttlMs };
  mem.set(key, entry);
  writeLS(key, entry);
}
