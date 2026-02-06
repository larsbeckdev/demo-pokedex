<template>
  <n-space vertical size="large">
    <n-space align="center" justify="space-between">
      <div>
        <n-h2 style="margin: 0">Pokédex</n-h2>
        <n-text depth="3">
          Geladen: {{ store.state.list.length }} /
          {{ store.state.count || "…" }}
        </n-text>
      </div>

      <n-button
        tertiary
        @click="store.loadNextPage()"
        :disabled="!store.hasMore">
        Mehr laden
      </n-button>
    </n-space>

    <PokedexFilters />

    <n-alert v-if="store.errorMessage" type="error" closable>
      {{ store.errorMessage }}
    </n-alert>

    <n-skeleton
      v-if="
        store.listState.value === 'loading' && store.state.list.length === 0
      "
      text
      :repeat="6" />

    <PokedexGrid v-else :items="store.filteredList" :onOpen="onOpen" />

    <div style="display: flex; justify-content: center; padding: 16px 0">
      <n-button
        v-if="store.hasMore"
        @click="store.loadNextPage()"
        :loading="store.listState.value === 'loading'">
        Mehr laden
      </n-button>
      <n-text v-else depth="3">Ende erreicht.</n-text>
    </div>

    <PokedexDetailDrawer
      :detail="store.selected"
      :loading="store.detailState.value === 'loading'"
      :onClose="store.closeDetail" />
  </n-space>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { NSpace, NButton, NH2, NText, NAlert, NSkeleton } from "naive-ui";
import { usePokedexStore } from "./store/usePokedexStore";
import PokedexFilters from "../components/PokedexFilters.vue";
import PokedexGrid from "../components/PokedexGrid.vue";
import PokedexDetailDrawer from "../components/PokedexDetailDrawer.vue";

const store = usePokedexStore();

async function onOpen(name: string) {
  await store.openDetail(name);
}

onMounted(async () => {
  await store.loadTypes();
  if (store.state.list.length === 0) {
    await store.loadNextPage();
  }
});
</script>
