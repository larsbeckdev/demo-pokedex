type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const now = () => Date.now();

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (parsed.expiresAt <= now()) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, value: T, ttlMs: number) {
  const entry: CacheEntry<T> = { value, expiresAt: now() + ttlMs };
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

export function withCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = getCache<T>(key);
  if (cached) return Promise.resolve(cached);

  return loader().then((value) => {
    setCache(key, value, ttlMs);
    return value;
  });
}
