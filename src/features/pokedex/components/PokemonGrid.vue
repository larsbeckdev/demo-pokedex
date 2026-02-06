<template>
  <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:5" responsive="screen">
    <n-gi v-for="p in items" :key="p.id">
      <PokemonCard :pokemon="p" @open="$emit('open', $event)" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import type { PokemonDetail } from "../types/pokemon";
import PokemonCard from "./PokemonCard.vue";

defineProps<{ items: PokemonDetail[] }>();
defineEmits<{ (e: "open", id: number): void }>();
</script>
