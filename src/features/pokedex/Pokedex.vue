<template>
  <div class="page">
    <PokeballLoader v-if="loadingInitial" />

    <n-space v-else vertical size="large" class="content">
      <PokedexHeader
        v-model:query="query"
        v-model:selectedTypes="selectedTypes"
        :all-types="allTypes"
        :can-search="canSearch"
        :no-results="!loadingMore && filtered.length === 0"
        @search="runSearch" />

      <n-alert v-if="error" type="error" closable @close="error = null">
        {{ error }}
      </n-alert>

      <PokemonGrid :items="filtered" @open="openOverlayById" />

      <n-space justify="center" style="padding: 10px 0 30px">
        <n-button
          size="large"
          :loading="loadingMore"
          :disabled="loadingMore"
          @click="loadPage">
          Load more
        </n-button>
      </n-space>
    </n-space>

    <PokemonOverlay
      :open="overlayOpen"
      :pokemon="overlayPokemon"
      @close="closeOverlay"
      @next="nextOverlay"
      @prev="prevOverlay" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { usePokedex } from "@/features/pokedex/composables/usePokedex";

import PokedexHeader from "@/features/pokedex/components/PokedexHeader.vue";
import PokemonGrid from "@/features/pokedex/components/PokemonGrid.vue";
import PokemonOverlay from "@/features/pokedex/components/PokemonOverlay.vue";
import PokeballLoader from "@/features/pokedex/components/PokeballLoader.vue";

const {
  loadingInitial,
  loadingMore,
  error,
  filtered,
  query,
  canSearch,
  selectedTypes,
  allTypes,
  overlayOpen,
  overlayPokemon,
  openOverlayById,
  closeOverlay,
  nextOverlay,
  prevOverlay,
  init,
  loadPage,
  runSearch,
} = usePokedex();

onMounted(init);
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  justify-items: center;
}
.content {
  width: min(1440px, 100%);
  padding: 18px;
}
</style>
