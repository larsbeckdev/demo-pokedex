// src/features/pokedex/api/pokeApi.ts

const API_BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 30, offset = 0) {
  const res = await fetch(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
  );
  if (!res.ok) throw new Error("Failed to load Pokémon list");
  return res.json();
}

export async function fetchPokemonDetail(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load Pokémon detail");
  return res.json();
}
