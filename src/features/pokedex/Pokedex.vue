<template>
  <div class="page">
    <PokedexHeader
      :model="query"
      :loading="isLoadingMore"
      @search="searchByName">
      <TypeFilter v-model="selectedTypes" :types="types" />
    </PokedexHeader>

    <main class="main">
      <n-alert v-if="error" type="warning" :show-icon="true">{{
        error
      }}</n-alert>

      <div class="grid">
        <PokemonCard
          v-for="p in filtered"
          :key="p.id"
          :pokemon="p"
          :bg="typeBg(p.types)"
          @open="openOverlay(p.id)" />
      </div>

      <div class="footer">
        <n-button
          size="large"
          :loading="isLoadingMore"
          :disabled="isLoadingMore"
          @click="loadNextPage">
          Load more
        </n-button>
      </div>
    </main>

    <PokemonOverlay
      :show="overlayOpen"
      :pokemon="activePokemon"
      :load-evolution="loadEvolutionForActive"
      @close="closeOverlay"
      @next="next"
      @prev="prev" />

    <PokeballLoader v-if="isBootLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useHead } from "@vueuse/head";

import { usePokedex } from "@/features/pokedex/composables/usePokedex";
import PokeballLoader from "@/features/pokedex/components/PokeballLoader.vue";
import PokedexHeader from "@/features/pokedex/components/PokedexHeader.vue";
import PokemonCard from "@/features/pokedex/components/PokemonCard.vue";
import PokemonOverlay from "@/features/pokedex/components/PokemonOverlay.vue";
import TypeFilter from "@/features/pokedex/components/TypeFilter.vue";

useHead({ title: "Pokédex" });

const {
  types,
  filtered,
  query,
  selectedTypes,
  isBootLoading,
  isLoadingMore,
  error,
  overlayOpen,
  activePokemon,
  boot,
  loadNextPage,
  searchByName,
  openOverlay,
  closeOverlay,
  next,
  prev,
  loadEvolutionForActive,
} = usePokedex();

function typeBg(ts: string[]) {
  const t = ts[0] || "normal";
  const map: Record<string, string> = {
    fire: "linear-gradient(135deg, rgba(255,90,60,.35), rgba(255,255,255,.6))",
    water:
      "linear-gradient(135deg, rgba(60,140,255,.35), rgba(255,255,255,.6))",
    grass:
      "linear-gradient(135deg, rgba(60,200,120,.35), rgba(255,255,255,.6))",
    electric:
      "linear-gradient(135deg, rgba(255,220,60,.4), rgba(255,255,255,.6))",
    psychic:
      "linear-gradient(135deg, rgba(255,80,180,.35), rgba(255,255,255,.6))",
    ice: "linear-gradient(135deg, rgba(120,220,255,.35), rgba(255,255,255,.6))",
    dragon:
      "linear-gradient(135deg, rgba(120,80,255,.35), rgba(255,255,255,.6))",
    dark: "linear-gradient(135deg, rgba(30,30,40,.35), rgba(255,255,255,.6))",
    fairy:
      "linear-gradient(135deg, rgba(255,140,220,.35), rgba(255,255,255,.6))",
    normal:
      "linear-gradient(135deg, rgba(160,160,160,.28), rgba(255,255,255,.6))",
  };
  return map[t] || map.normal;
}

onMounted(boot);
</script>

<style scoped>
.page {
  min-height: 100vh;
}
.main {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 14px 16px 40px;
}
.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.footer {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 820px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 360px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
