<template>
  <n-space vertical size="large" class="wrap">
    <!-- Header Card -->
    <div class="headerCard">
      <!-- Top Row -->
      <div class="topRow">
        <n-space align="center" class="searchRow">
          <n-input
            v-model:value="queryModel"
            clearable
            placeholder="Name or ID (min. 3 chars)"
            class="searchInput" />
          <n-button
            type="primary"
            :disabled="!canSearch"
            @click="$emit('search')">
            Search
          </n-button>
        </n-space>
      </div>

      <!-- Filters -->
      <div class="filterRow">
        <n-select
          v-model:value="typesModel"
          multiple
          filterable
          clearable
          placeholder="Filter by type"
          :options="typeOptions"
          class="typeSelect" />

        <n-text v-if="noResults" type="warning"> No Pokémon found </n-text>
      </div>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PokemonTypeName } from "../types/pokemon";

const props = defineProps<{
  query: string;
  canSearch: boolean;
  selectedTypes: PokemonTypeName[];
  allTypes: PokemonTypeName[];
  noResults: boolean;
}>();

const emit = defineEmits<{
  (e: "update:query", v: string): void;
  (e: "update:selectedTypes", v: PokemonTypeName[]): void;
  (e: "search"): void;
}>();

const queryModel = computed({
  get: () => props.query,
  set: (v: string) => emit("update:query", v),
});

const typesModel = computed({
  get: () => props.selectedTypes,
  set: (v: PokemonTypeName[]) => emit("update:selectedTypes", v),
});

const typeOptions = computed(() =>
  props.allTypes.map((t) => ({ label: t, value: t })),
);
</script>

<style scoped>
.wrap {
  width: 100%;
}

.headerCard {
  padding: 20px 0px;
  border-radius: 14px;
  background: var(--n-color);
  border: 1px solid var(--n-border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Top Row */
.topRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.titleWrap {
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.subtitle {
  font-size: 13px;
  opacity: 0.65;
}

/* Search */
.searchRow {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.searchInput {
  width: 260px;
}

/* Filters */
.filterRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.typeSelect {
  min-width: 260px;
}
</style>
