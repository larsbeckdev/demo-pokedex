<template>
  <div
    class="card"
    :style="{ background: bg }"
    @click="$emit('open', pokemon.id)">
    <div class="top">
      <div class="name">{{ displayName }}</div>
      <div class="id">#{{ pokemon.id }}</div>
    </div>

    <div class="imgWrap">
      <img :src="img" :alt="displayName" loading="lazy" />
    </div>

    <n-space size="small">
      <n-tag v-for="t in pokemon.types" :key="t.type.name" size="small">
        {{ t.type.name }}
      </n-tag>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PokemonDetail, PokemonTypeName } from "../types/pokemon";

const props = defineProps<{ pokemon: PokemonDetail }>();
defineEmits<{ (e: "open", id: number): void }>();

const displayName = computed(() => {
  const n = props.pokemon.name;
  return n.slice(0, 1).toUpperCase() + n.slice(1);
});

const img = computed(() => {
  return (
    props.pokemon.sprites.other?.["official-artwork"]?.front_default ||
    props.pokemon.sprites.front_default ||
    ""
  );
});

const type = computed(
  () => props.pokemon.types[0]?.type.name as PokemonTypeName | undefined,
);

const typeColor: Record<PokemonTypeName, string> = {
  normal: "#9E9E9E",
  fire: "#FF7043",
  water: "#42A5F5",
  electric: "#FFCA28",
  grass: "#66BB6A",
  ice: "#4DD0E1",
  fighting: "#EF5350",
  poison: "#AB47BC",
  ground: "#A1887F",
  flying: "#90A4AE",
  psychic: "#EC407A",
  bug: "#9CCC65",
  rock: "#8D6E63",
  ghost: "#7E57C2",
  dragon: "#5C6BC0",
  dark: "#616161",
  steel: "#78909C",
  fairy: "#F48FB1",
};

const bg = computed(() => {
  const t = type.value;
  if (!t) return "rgba(255,255,255,0.06)";
  const c = typeColor[t];
  return `linear-gradient(135deg, ${c}55, rgba(255,255,255,0.06))`;
});
</script>

<style scoped>
.card {
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
  min-height: 190px;
  display: grid;
  gap: 10px;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.2);
}
.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.name {
  font-weight: 800;
  font-size: 18px;
}
.id {
  opacity: 0.7;
  font-size: 12px;
}
.imgWrap {
  display: grid;
  place-content: center;
  height: 92px;
}
img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
}
</style>
