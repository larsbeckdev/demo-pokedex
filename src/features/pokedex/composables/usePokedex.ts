import { computed, reactive, ref } from "vue";
import {
  getPokemon,
  getPokemonPage,
  getSpecies,
  getTypes,
  getEvolutionChainByUrl,
} from "@/features/pokedex/api/pokeApi";

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  stats: Record<string, number>;
};

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

async function pMapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (t: T) => Promise<R>,
) {
  const out: R[] = [];
  let i = 0;

  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

function toPokemon(dto: any): Pokemon {
  const stats: Record<string, number> = {};
  for (const s of dto.stats) stats[s.stat.name] = s.base_stat;

  return {
    id: dto.id,
    name: cap(dto.name),
    types: dto.types.map((t: any) => t.type.name),
    sprite:
      dto.sprites?.other?.["official-artwork"]?.front_default ||
      dto.sprites?.front_default ||
      "",
    stats,
  };
}

export function usePokedex() {
  const pageSize = 30; // 20–40 (✅)
  const offset = ref(0);

  const isBootLoading = ref(true);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);

  const all = reactive<Pokemon[]>([]);
  const query = ref("");
  const selectedTypes = ref<string[]>([]);

  const types = ref<string[]>([]);
  const overlayOpen = ref(false);
  const activeId = ref<number | null>(null);

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase();
    return all.filter((p) => {
      const byText = !q || p.name.toLowerCase().includes(q);
      const byType =
        selectedTypes.value.length === 0 ||
        selectedTypes.value.every((t) => p.types.includes(t));
      return byText && byType;
    });
  });

  const activeIndex = computed(() =>
    filtered.value.findIndex((p) => p.id === activeId.value),
  );

  const activePokemon = computed(
    () => filtered.value[activeIndex.value] || null,
  );

  async function loadTypes() {
    const res = await getTypes();
    const names = res.results.map((r) => r.name);
    types.value = names.filter((n) => !["unknown", "shadow"].includes(n));
  }

  async function loadNextPage() {
    isLoadingMore.value = true;
    error.value = null;

    try {
      const page = await getPokemonPage(pageSize, offset.value);
      const details = await pMapLimit(page.results, 6, async (r) => {
        const dto = await getPokemon(r.name);
        return toPokemon(dto);
      });

      all.push(...details);
      offset.value += pageSize;
    } catch (e: any) {
      error.value = e?.message || "Failed to load Pokémon.";
    } finally {
      isLoadingMore.value = false;
    }
  }

  async function boot() {
    try {
      await loadTypes();
      await loadNextPage();
    } finally {
      isBootLoading.value = false;
    }
  }

  async function searchByName() {
    const q = query.value.trim().toLowerCase();
    if (q.length < 3) return;

    error.value = null;
    isLoadingMore.value = true;

    try {
      const dto = await getPokemon(q);
      const p = toPokemon(dto);
      const exists = all.some((x) => x.id === p.id);
      if (!exists) all.unshift(p);
      openOverlay(p.id);
    } catch {
      error.value = "No Pokémon found.";
    } finally {
      isLoadingMore.value = false;
    }
  }

  function openOverlay(id: number) {
    activeId.value = id;
    overlayOpen.value = true;
  }

  function closeOverlay() {
    overlayOpen.value = false;
  }

  function next() {
    const idx = activeIndex.value;
    if (idx < 0) return;
    activeId.value =
      filtered.value[(idx + 1) % filtered.value.length]?.id ?? null;
  }

  function prev() {
    const idx = activeIndex.value;
    if (idx < 0) return;
    activeId.value =
      filtered.value[(idx - 1 + filtered.value.length) % filtered.value.length]
        ?.id ?? null;
  }

  async function loadEvolutionForActive() {
    const p = activePokemon.value;
    if (!p) return null;

    const species = await getSpecies(p.id);
    const url = species?.evolution_chain?.url;
    if (!url) return null;

    return getEvolutionChainByUrl(url);
  }

  return {
    // state
    types,
    all,
    filtered,
    query,
    selectedTypes,
    isBootLoading,
    isLoadingMore,
    error,

    // overlay
    overlayOpen,
    activePokemon,

    // actions
    boot,
    loadNextPage,
    searchByName,
    openOverlay,
    closeOverlay,
    next,
    prev,
    loadEvolutionForActive,
  };
}
