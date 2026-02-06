<template>
  <n-card hoverable :title="title" style="cursor: pointer" @click="onOpen">
    <template #cover>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        ">
        <img
          v-if="pokemon.sprite"
          :src="pokemon.sprite"
          :alt="pokemon.name"
          width="96"
          height="96"
          loading="lazy" />
        <div v-else style="height: 96px; display: flex; align-items: center">
          <n-text depth="3">Kein Sprite</n-text>
        </div>
      </div>
    </template>

    <n-space size="small" wrap>
      <n-tag v-for="t in pokemon.types" :key="t" size="small">
        {{ cap(t) }}
      </n-tag>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NCard, NSpace, NTag, NText } from "naive-ui";
import type { PokemonListItem } from "../model/types";
import { capitalize } from "../utils/pokemon";

const props = defineProps<{
  pokemon: PokemonListItem;
  onOpen: () => void;
}>();

const title = computed(
  () => `#${props.pokemon.id} · ${capitalize(props.pokemon.name)}`,
);
const cap = (s: string) => capitalize(s);
</script>
