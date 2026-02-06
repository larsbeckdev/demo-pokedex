// src/features/pokedex/composables/usePokedex.ts

import { ref } from "vue";
import { fetchPokemonList, fetchPokemonDetail } from "../api/pokeApi";
import { getCached, setCached } from "../cache/resourceCache";

export function usePokedex() {
  const list = ref<any[]>([]);
  const loadingList = ref(false);
  const loadingDetail = ref(false);
  const error = ref<string | null>(null);
  const selected = ref<any | null>(null);

  async function loadList(limit = 30) {
    loadingList.value = true;
    error.value = null;

    try {
      const cacheKey = `list-${limit}`;
      const cached = getCached<any[]>(cacheKey);

      if (cached) {
        list.value = cached;
        return;
      }

      const data = await fetchPokemonList(limit);
      list.value = data.results;
      setCached(cacheKey, data.results);
    } catch (e: any) {
      error.value = e.message ?? "Unknown error";
    } finally {
      loadingList.value = false;
    }
  }

  async function loadDetail(pokemon: { url: string }) {
    loadingDetail.value = true;
    error.value = null;

    try {
      const cached = getCached<any>(pokemon.url);
      if (cached) {
        selected.value = cached;
        return;
      }

      const detail = await fetchPokemonDetail(pokemon.url);
      selected.value = detail;
      setCached(pokemon.url, detail);
    } catch (e: any) {
      error.value = e.message ?? "Unknown error";
    } finally {
      loadingDetail.value = false;
    }
  }

  function clearSelection() {
    selected.value = null;
  }

  return {
    list,
    selected,
    loadingList,
    loadingDetail,
    error,
    loadList,
    loadDetail,
    clearSelection,
  };
}
