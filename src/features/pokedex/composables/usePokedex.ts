import { computed, ref } from "vue";
import type { PokemonDetail, PokemonTypeName } from "../types/pokemon";
import {
  fetchPokemonDetail,
  fetchPokemonList,
  fetchTypes,
} from "../api/pokeApi";

const PAGE_SIZE = 24; // 20–40 ✅

function titleCase(name: string) {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

export function usePokedex() {
  const loadingInitial = ref(true);
  const loadingMore = ref(false);
  const error = ref<string | null>(null);

  const query = ref("");
  const selectedTypes = ref<PokemonTypeName[]>([]);
  const allTypes = ref<PokemonTypeName[]>([]);

  const offset = ref(0);
  const items = ref<PokemonDetail[]>([]);

  const overlayOpen = ref(false);
  const overlayIndex = ref<number>(0);

  const canSearch = computed(() => query.value.trim().length >= 3);

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    const types = selectedTypes.value;

    return items.value.filter((p) => {
      const matchesQuery =
        q.length < 3
          ? true
          : p.name.toLowerCase().includes(q) || String(p.id) === q;

      const pTypes = p.types.map((t) => t.type.name);
      const matchesTypes =
        types.length === 0 ? true : types.every((t) => pTypes.includes(t));

      return matchesQuery && matchesTypes;
    });
  });

  async function loadTypes() {
    allTypes.value = await fetchTypes();
  }

  async function loadPage() {
    error.value = null;
    loadingMore.value = true;

    try {
      const list = await fetchPokemonList(offset.value, PAGE_SIZE);

      const details = await Promise.all(
        list.map((x) => fetchPokemonDetail(x.name)),
      );

      items.value = [...items.value, ...details];
      offset.value += PAGE_SIZE;
    } catch (e: any) {
      error.value = e?.message ?? "Something went wrong.";
    } finally {
      loadingMore.value = false;
    }
  }

  async function init() {
    error.value = null;
    loadingInitial.value = true;

    try {
      await loadTypes();
      await loadPage();
    } catch (e: any) {
      error.value = e?.message ?? "Something went wrong.";
    } finally {
      loadingInitial.value = false;
    }
  }

  async function runSearch() {
    // requirement: Search via button only, min 3 chars ✅
    if (!canSearch.value) return;
    // We filter locally on already loaded cards.
    // (Optional: you can also fetch by exact name/id on demand.)
  }

  function openOverlayById(id: number) {
    const idx = filtered.value.findIndex((p) => p.id === id);
    if (idx < 0) return;
    overlayIndex.value = idx;
    overlayOpen.value = true;
  }

  function closeOverlay() {
    overlayOpen.value = false;
  }

  function nextOverlay() {
    const len = filtered.value.length;
    if (len === 0) return;
    overlayIndex.value = (overlayIndex.value + 1) % len;
  }

  function prevOverlay() {
    const len = filtered.value.length;
    if (len === 0) return;
    overlayIndex.value = (overlayIndex.value - 1 + len) % len;
  }

  const overlayPokemon = computed(
    () => filtered.value[overlayIndex.value] ?? null,
  );

  return {
    // state
    loadingInitial,
    loadingMore,
    error,
    items,
    filtered,

    query,
    canSearch,
    selectedTypes,
    allTypes,

    // overlay
    overlayOpen,
    overlayPokemon,
    openOverlayById,
    closeOverlay,
    nextOverlay,
    prevOverlay,

    // actions
    init,
    loadPage,
    runSearch,

    // helpers
    titleCase,
  };
}
