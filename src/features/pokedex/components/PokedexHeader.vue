<template>
  <n-space vertical size="large" class="wrap">
    <div class="headerCard">
      <div class="topRow">
        <n-space align="center" class="searchRow">
          <n-input
            v-model:value="draftQuery"
            clearable
            placeholder="Name (min. 3) oder ID (min. 1)"
            class="searchInput"
            @keyup.enter="onSearch"
            @clear="onClear" />

          <n-button
            type="primary"
            :disabled="!canSearchLocal"
            @click="onSearch">
            Search
          </n-button>
        </n-space>
      </div>

      <div class="filterRow">
        <n-select
          v-model:value="typesModel"
          multiple
          filterable
          clearable
          placeholder="Filter by type"
          :options="typeOptions"
          class="typeSelect" />

        <n-text v-if="noResults" type="warning">No Pokémon found</n-text>
      </div>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { PokemonTypeName } from "../types/pokemon";

const props = defineProps<{
  query: string;
  selectedTypes: PokemonTypeName[];
  allTypes: PokemonTypeName[];
  noResults: boolean;
}>();

const emit = defineEmits<{
  (e: "update:query", v: string): void;
  (e: "update:selectedTypes", v: PokemonTypeName[]): void;
  (e: "search"): void;
}>();

const draftQuery = ref(props.query ?? "");

watch(
  () => props.query,
  (v) => {
    draftQuery.value = v ?? "";
  },
);

const typesModel = computed({
  get: () => props.selectedTypes,
  set: (v: PokemonTypeName[]) => emit("update:selectedTypes", v),
});

const typeOptions = computed(() =>
  props.allTypes.map((t) => ({ label: t, value: t })),
);

const canSearchLocal = computed(() => {
  const q = (draftQuery.value ?? "").trim();

  if (/^\d+$/.test(q)) return q.length >= 1;

  return q.length >= 3;
});

function onSearch() {
  if (!canSearchLocal.value) return;

  const committed = (draftQuery.value ?? "").trim();
  emit("update:query", committed);
  emit("search");
}

function onClear() {
  draftQuery.value = "";
  emit("update:query", "");
}
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

.topRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.searchRow {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.searchInput {
  width: 260px;
}

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
