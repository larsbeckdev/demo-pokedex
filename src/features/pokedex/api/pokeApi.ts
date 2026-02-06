// src/features/pokedex/api/pokeApi.ts

import { getOrCreate } from "@/features/pokedex/cache/resourceCache";

const BASE = "https://pokeapi.co/api/v2";

const TTL = {
  list: 10 * 60_000,
  pokemon: 24 * 60 * 60_000,
  types: 24 * 60 * 60_000,
  species: 24 * 60 * 60_000,
  evo: 24 * 60 * 60_000,
};

async function fetchJson<T>(url: string, ttlMs: number): Promise<T> {
  return getOrCreate<T>(
    url,
    async () => {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return (await res.json()) as T;
    },
    ttlMs,
  );
}

export function getPokemonPage(limit: number, offset: number) {
  return fetchJson<{ results: { name: string; url: string }[] }>(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`,
    TTL.list,
  );
}

export function getPokemon(nameOrId: string | number) {
  return fetchJson<any>(`${BASE}/pokemon/${nameOrId}`, TTL.pokemon);
}

export function getTypes() {
  return fetchJson<{ results: { name: string; url: string }[] }>(
    `${BASE}/type`,
    TTL.types,
  );
}

export function getSpecies(nameOrId: string | number) {
  return fetchJson<any>(`${BASE}/pokemon-species/${nameOrId}`, TTL.species);
}

export function getEvolutionChainByUrl(url: string) {
  // url ist hier eine absolute PokeAPI URL
  return fetchJson<any>(url, TTL.evo);
}
