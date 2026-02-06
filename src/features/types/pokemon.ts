export type PokemonListItem = {
  name: string;
  url: string;
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

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
  types: { slot: number; type: { name: PokemonTypeName; url: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string; url: string }; is_hidden: boolean }[];
  species: { name: string; url: string };
};

export type PokemonSpecies = {
  evolution_chain: { url: string };
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
};

export type EvolutionChain = {
  chain: {
    species: { name: string; url: string };
    evolves_to: any[];
  };
};
