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
      <n-tag
        v-for="t in pokemon.types"
        :key="t.type.name"
        size="small"
        round
        :style="tagStyle(t.type.name as PokemonTypeName)">
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

function tagStyle(type: PokemonTypeName) {
  const c = typeColor[type];

  return {
    backgroundColor: `color-mix(in srgb, ${c} 18%, var(--ds-type-chip-bg))`,
    border: `1px solid color-mix(in srgb, ${c} 35%, var(--ds-type-chip-border))`,
    color: "var(--ds-text)",
    borderRadius: "var(--ds-radius-pill)",
    fontSize: "var(--ds-font-size-sm)",
    fontWeight: "var(--ds-font-weight-semibold)",
    padding: "2px 10px",
  };
}

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
  // fallback aus DS, statt hardcoded
  const fallbackTo = "var(--ds-card-gradient-to)";
  if (!t)
    return `linear-gradient(135deg, rgba(255,255,255,0.06), ${fallbackTo})`;
  const c = typeColor[t];
  return `linear-gradient(135deg, ${c}55, ${fallbackTo})`;
});
</script>

<style scoped>
.card {
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-lg);
  cursor: pointer;
  border: 1px solid var(--ds-card-border);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
  min-height: 190px;
  display: grid;
  gap: var(--ds-space-sm);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--ds-card-shadow-hover);
  border-color: var(--ds-card-border-hover);
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--ds-space-sm);
}

.name {
  font-weight: var(--ds-font-weight-black);
  font-size: var(--ds-font-size-lg);
  color: var(--ds-text);
}

.id {
  opacity: 0.7;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-muted);
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
  filter: drop-shadow(var(--ds-img-drop-shadow));
}
</style>
