export type NamedApiResource = { name: string; url: string };

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonListItem = {
  id: number;
  name: string;
  sprite: string | null;
  types: PokemonTypeName[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: any;
  };
  types: { slot: number; type: NamedApiResource }[];
  abilities: { ability: NamedApiResource; is_hidden: boolean; slot: number }[];
  stats: { base_stat: number; stat: NamedApiResource }[];
};
