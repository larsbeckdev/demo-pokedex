import type {
  PokemonDetail,
  PokemonListItem,
  PokemonSpecies,
  EvolutionChain,
  PokemonTypeName,
} from "@/features/types/pokemon";
import { withCache } from "../cache/cache";
import { cacheKeys } from "../cache/keys";

const BASE = "https://pokeapi.co/api/v2";
const TTL_1D = 24 * 60 * 60 * 1000;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchPokemonList(offset: number, limit: number) {
  const url = `${BASE}/pokemon?offset=${offset}&limit=${limit}`;
  return withCache(cacheKeys.list(offset, limit), TTL_1D, async () => {
    const data = await fetchJson<{ results: PokemonListItem[] }>(url);
    return data.results;
  });
}

export function fetchPokemonDetail(nameOrId: string | number) {
  const url = `${BASE}/pokemon/${nameOrId}`;
  return withCache(cacheKeys.detail(nameOrId), TTL_1D, () =>
    fetchJson<PokemonDetail>(url),
  );
}

export function fetchTypes() {
  const url = `${BASE}/type`;
  return withCache(cacheKeys.types(), TTL_1D, async () => {
    const data = await fetchJson<{ results: { name: PokemonTypeName }[] }>(url);
    return data.results.map((t) => t.name);
  });
}

export function fetchSpecies(nameOrId: string | number) {
  const url = `${BASE}/pokemon-species/${nameOrId}`;
  return withCache(cacheKeys.species(nameOrId), TTL_1D, () =>
    fetchJson<PokemonSpecies>(url),
  );
}

export function fetchEvolutionChainByUrl(url: string) {
  return withCache(cacheKeys.evoChain(url), TTL_1D, () =>
    fetchJson<EvolutionChain>(url),
  );
}
