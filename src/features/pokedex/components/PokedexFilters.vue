<template>
  <n-space align="center" justify="space-between" wrap>
    <n-input
      v-model:value="store.state.query"
      placeholder="Suche nach Name oder ID (z.B. pikachu / 25)"
      clearable
      style="min-width: 320px" />

    <n-space align="center" wrap>
      <n-select
        v-model:value="store.state.selectedType"
        :options="typeOptions"
        placeholder="Typ filtern"
        clearable
        style="width: 220px" />
      <n-button
        @click="store.refresh()"
        :loading="store.listState.value === 'loading'">
        Neu laden
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NSpace, NInput, NSelect, NButton } from "naive-ui";
import { usePokedexStore } from "../store/usePokedexStore";
import { capitalize } from "../utils/pokemon";

const store = usePokedexStore();

const typeOptions = computed(() =>
  store.state.types.map((t) => ({ label: capitalize(t), value: t })),
);
</script>
