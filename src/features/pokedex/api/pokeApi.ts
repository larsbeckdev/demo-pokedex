import type { PokemonDetail, PokemonListResponse } from "../model/types";

const BASE = "https://pokeapi.co/api/v2";

async function http<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return (await res.json()) as T;
}

export function getPokemonList(limit: number, offset: number) {
  return http<PokemonListResponse>(
    `${BASE}/pokemon?limit=${limit}&offset=${offset}`,
  );
}

export function getPokemonDetailByName(name: string) {
  return http<PokemonDetail>(`${BASE}/pokemon/${encodeURIComponent(name)}`);
}

export function getPokemonTypes() {
  return http<{ results: { name: string; url: string }[] }>(`${BASE}/type`);
}
