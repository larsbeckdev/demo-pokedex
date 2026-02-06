import { computed, reactive, ref } from "vue";
import {
  getPokemonDetailByName,
  getPokemonList,
  getPokemonTypes,
} from "../api/pokeApi";
import type {
  PokemonDetail,
  PokemonListItem,
  PokemonTypeName,
} from "../model/types";
import { detailToListItem, toIdFromPokemonUrl } from "../utils/pokemon";

type LoadState = "idle" | "loading" | "error";

const LIMIT = 30;

// simple singleton store (pro App einmal)
const state = reactive({
  count: 0,
  offset: 0,
  list: [] as PokemonListItem[],
  types: [] as PokemonTypeName[],
  selectedType: null as PokemonTypeName | null,
  query: "",
});

const listState = ref<LoadState>("idle");
const detailState = ref<LoadState>("idle");
const errorMessage = ref<string | null>(null);

const detailCache = new Map<string, PokemonDetail>();
const listItemCache = new Map<string, PokemonListItem>();

const selected = ref<PokemonDetail | null>(null);

async function loadTypes() {
  try {
    const res = await getPokemonTypes();
    // PokeAPI liefert auch "unknown"/"shadow" – optional rausfiltern
    state.types = res.results
      .map((r) => r.name)
      .filter((n) => n !== "unknown" && n !== "shadow") as PokemonTypeName[];
  } catch {
    // Types sind optional; kein hard fail
  }
}

async function loadNextPage() {
  if (listState.value === "loading") return;
  listState.value = "loading";
  errorMessage.value = null;

  try {
    const res = await getPokemonList(LIMIT, state.offset);
    state.count = res.count;

    // parallel Details laden (für Sprite & Typen)
    const names = res.results.map((r) => r.name);

    const items = await Promise.all(
      names.map(async (name) => {
        const cached = listItemCache.get(name);
        if (cached) return cached;

        const d = detailCache.get(name) ?? (await getPokemonDetailByName(name));
        detailCache.set(name, d);

        const item = detailToListItem(d);
        listItemCache.set(name, item);
        return item;
      }),
    );

    state.list.push(...items);
    state.offset += LIMIT;

    listState.value = "idle";
  } catch (e: any) {
    listState.value = "error";
    errorMessage.value = e?.message ?? "Fehler beim Laden der Pokémon.";
  }
}

async function refresh() {
  state.offset = 0;
  state.list = [];
  await loadNextPage();
}

async function openDetail(name: string) {
  detailState.value = "loading";
  errorMessage.value = null;

  try {
    const d = detailCache.get(name) ?? (await getPokemonDetailByName(name));
    detailCache.set(name, d);
    selected.value = d;
    detailState.value = "idle";
  } catch (e: any) {
    detailState.value = "error";
    errorMessage.value = e?.message ?? "Fehler beim Laden der Details.";
  }
}

function closeDetail() {
  selected.value = null;
}

const filteredList = computed(() => {
  const q = state.query.trim().toLowerCase();
  return state.list.filter((p) => {
    const matchesQuery = !q || p.name.includes(q) || String(p.id).includes(q);
    const matchesType =
      !state.selectedType || p.types.includes(state.selectedType);
    return matchesQuery && matchesType;
  });
});

const hasMore = computed(() => state.list.length < state.count);

export function usePokedexStore() {
  return {
    state,
    LIMIT,
    listState,
    detailState,
    errorMessage,
    selected,
    filteredList,
    hasMore,
    // actions
    loadTypes,
    loadNextPage,
    refresh,
    openDetail,
    closeDetail,
    toIdFromPokemonUrl,
  };
}
