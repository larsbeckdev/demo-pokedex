import { computed, ref, watch } from "vue";
import type { PokemonDetail, PokemonTypeName } from "../types/pokemon";
import {
  fetchPokemonDetail,
  fetchPokemonList,
  fetchTypes,
} from "../api/pokeApi";

const PAGE_SIZE = 24; 

function titleCase(name: string) {
  return name.slice(0, 1).toUpperCase() + name.slice(1);
}

export function usePokedex() {
  const loadingInitial = ref(true);
  const loadingMore = ref(false);
  const error = ref<string | null>(null);

  const queryDraft = ref("");
  const queryCommitted = ref("");

  const selectedTypes = ref<PokemonTypeName[]>([]);
  const allTypes = ref<PokemonTypeName[]>([]);

  const offset = ref(0);
  const items = ref<PokemonDetail[]>([]);

  const overlayOpen = ref(false);
  const overlayIndex = ref<number>(0);

  const canSearch = computed(() => {
    const q = queryDraft.value.trim();
    if (/^\d+$/.test(q)) return q.length >= 1; // ID
    return q.length >= 3; // Name
  });

  watch(queryDraft, (v) => {
    if (v.trim() === "") {
      queryCommitted.value = "";
      overlayIndex.value = 0;
    }
  });

  const filtered = computed(() => {
    const q = queryCommitted.value.trim().toLowerCase();
    const types = selectedTypes.value;

    return items.value.filter((p) => {
      let matchesQuery = true;

      if (q) {
        if (/^\d+$/.test(q)) {
          matchesQuery = String(p.id) === q; // ID
        } else {
          matchesQuery = p.name.toLowerCase().includes(q); // Name
        }
      }

      const pTypes = p.types.map((t) => t.type.name);
      const matchesTypes =
        types.length === 0 ? true : types.every((t) => pTypes.includes(t));

      return matchesQuery && matchesTypes;
    });
  });

  /* ---------------- API ---------------- */

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

  /* ---------------- SEARCH ---------------- */

  function runSearch() {
    if (!canSearch.value) return;

    queryCommitted.value = queryDraft.value.trim();
    overlayIndex.value = 0;
  }

  function clearSearch() {
    queryDraft.value = "";
    queryCommitted.value = "";
    overlayIndex.value = 0;
  }

  /* ---------------- OVERLAY ---------------- */

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

    // search 
    query: queryDraft,
    canSearch,
    runSearch,
    clearSearch,

    // filters
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

    // helpers
    titleCase,
  };
}
