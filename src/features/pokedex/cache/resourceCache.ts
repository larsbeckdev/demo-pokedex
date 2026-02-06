// src/features/pokedex/cache/resourceCache.ts

const cache = new Map<string, any>();

export function getCached<T>(key: string): T | undefined {
  return cache.get(key);
}

export function setCached<T>(key: string, value: T): void {
  cache.set(key, value);
}

export function clearCache() {
  cache.clear();
}
