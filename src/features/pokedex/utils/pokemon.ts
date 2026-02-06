import type {
  PokemonDetail,
  PokemonListItem,
  PokemonTypeName,
} from "../model/types";

export function toIdFromPokemonUrl(url: string): number {
  // url endet i.d.R. mit .../pokemon/{id}/
  const m = url.match(/\/pokemon\/(\d+)\//);
  return m ? Number(m[1]) : -1;
}

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function normalizeType(t: string): PokemonTypeName {
  return t as PokemonTypeName;
}

export function detailToListItem(detail: PokemonDetail): PokemonListItem {
  return {
    id: detail.id,
    name: detail.name,
    sprite: detail.sprites.front_default ?? null,
    types: detail.types
      .sort((a, b) => a.slot - b.slot)
      .map((x) => normalizeType(x.type.name)),
  };
}
