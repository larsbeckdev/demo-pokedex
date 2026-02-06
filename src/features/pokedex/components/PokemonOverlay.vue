<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="$emit('close')">
      <div class="panel" role="dialog" aria-modal="true">
        <div class="head">
          <div class="title">
            <div class="name">{{ displayName }}</div>
            <div class="id">#{{ pokemon?.id }}</div>
          </div>

          <n-space align="center">
            <n-button quaternary @click="$emit('prev')">←</n-button>
            <n-button quaternary @click="$emit('next')">→</n-button>
            <n-button secondary @click="$emit('close')">Close</n-button>
          </n-space>
        </div>

        <div class="body" v-if="pokemon">
          <div class="left">
            <img :src="img" :alt="displayName" />
            <n-space size="small">
              <n-tag v-for="t in pokemon.types" :key="t.type.name" size="small">
                {{ t.type.name }}
              </n-tag>
            </n-space>
          </div>

          <div class="right">
            <n-h3 style="margin: 0 0 8px">Stats</n-h3>
            <div class="stats">
              <div
                v-for="s in pokemon.stats"
                :key="s.stat.name"
                class="statRow">
                <div class="statName">{{ s.stat.name }}</div>
                <n-progress
                  type="line"
                  :percentage="toPct(s.base_stat)"
                  :show-indicator="false" />
                <div class="statVal">{{ s.base_stat }}</div>
              </div>
            </div>

            <n-divider />

            <n-space align="center" justify="space-between">
              <n-h3 style="margin: 0">Evolution</n-h3>
              <n-button size="small" :loading="loadingEvo" @click="loadEvo">
                Load evolution
              </n-button>
            </n-space>

            <div class="evo" v-if="evoNames.length">
              <n-tag v-for="n in evoNames" :key="n" size="small">{{ n }}</n-tag>
            </div>

            <n-text v-else depth="3" style="margin-top: 10px">
              Evolution is lazy-loaded (click button).
            </n-text>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch, ref } from "vue";
import type { EvolutionChain, PokemonDetail } from "../types/pokemon";
import { fetchEvolutionChainByUrl, fetchSpecies } from "../api/pokeApi";

const props = defineProps<{
  open: boolean;
  pokemon: PokemonDetail | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "next"): void;
  (e: "prev"): void;
}>();

const loadingEvo = ref(false);
const evoNames = ref<string[]>([]);

const displayName = computed(() => {
  const n = props.pokemon?.name ?? "";
  return n ? n.slice(0, 1).toUpperCase() + n.slice(1) : "";
});

const img = computed(() => {
  const p = props.pokemon;
  if (!p) return "";
  return (
    p.sprites.other?.["official-artwork"]?.front_default ||
    p.sprites.front_default ||
    ""
  );
});

function toPct(v: number) {
  const capped = Math.min(160, Math.max(0, v));
  return Math.round((capped / 160) * 100);
}

function setBodyLock(lock: boolean) {
  document.body.style.overflow = lock ? "hidden" : "";
}

watch(
  () => props.open,
  (v) => setBodyLock(v),
  { immediate: true },
);

onBeforeUnmount(() => setBodyLock(false));

function collectChainNames(chain: EvolutionChain["chain"]) {
  const names: string[] = [];
  let node: any = chain;
  while (node) {
    names.push(node.species.name);
    node = node.evolves_to?.[0];
  }
  return names;
}

async function loadEvo() {
  if (!props.pokemon) return;
  if (loadingEvo.value) return;

  loadingEvo.value = true;
  try {
    const species = await fetchSpecies(props.pokemon.id);
    const evo = await fetchEvolutionChainByUrl(species.evolution_chain.url);
    evoNames.value = collectChainNames(evo.chain);
  } finally {
    loadingEvo.value = false;
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  z-index: 9998;
  display: grid;
  place-content: center;
  padding: 16px;
}

.panel {
  width: min(980px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(20, 20, 20, 0.85);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
}

.title {
  display: grid;
  gap: 2px;
}
.name {
  font-weight: 900;
  font-size: 20px;
}
.id {
  opacity: 0.7;
  font-size: 12px;
}

.body {
  padding: 14px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 14px;
}

.left {
  display: grid;
  gap: 12px;
  justify-items: center;
  align-content: start;
}

.left img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.55));
}

.right {
  min-width: 0;
}

.stats {
  display: grid;
  gap: 10px;
}
.statRow {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  gap: 10px;
  align-items: center;
}
.statName {
  text-transform: lowercase;
  opacity: 0.9;
}
.statVal {
  text-align: right;
  opacity: 0.85;
}

.evo {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 720px) {
  .body {
    grid-template-columns: 1fr;
  }
  .statRow {
    grid-template-columns: 90px 1fr 36px;
  }
  .left img {
    width: 180px;
    height: 180px;
  }
}
</style>
