<template>
  <n-space vertical size="large" class="wrap">
    <n-space align="center" justify="space-between" class="top">
  

      <n-space align="center" class="searchRow">
        <n-input
          v-model:value="queryModel"
          clearable
          placeholder="Search by name or ID (min. 3 chars)"
          style="width: 280px" />
        <n-button :disabled="!canSearch" @click="$emit('search')">
          Search
        </n-button>
      </n-space>
    </n-space>

    <n-space align="center" justify="space-between" class="filters">
      <n-select
        v-model:value="typesModel"
        multiple
        filterable
        clearable
        placeholder="Filter by type"
        :options="typeOptions"
        style="min-width: 280px" />
      <n-text v-if="noResults" type="warning"> No Pokémon found. </n-text>
    </n-space>
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
.top {
  width: 100%;
}
.logo {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-content: center;
  background: rgba(255, 255, 255, 0.08);
}
.searchRow {
  flex-wrap: wrap;
  justify-content: flex-end;
}
.filters {
  width: 100%;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
