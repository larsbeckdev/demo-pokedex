<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:5" responsive="screen">
    <n-grid-item v-for="p in items" :key="p.id">
      <PokedexCard :pokemon="p" :onOpen="() => onOpen(p.name)" />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from "naive-ui";
import PokedexCard from "./PokedexCard.vue";
import type { PokemonListItem } from "../model/types";

defineProps<{
  items: PokemonListItem[];
  onOpen: (name: string) => void;
}>();
</script>
