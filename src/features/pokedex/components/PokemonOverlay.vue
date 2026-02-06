<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="$emit('close')">
      <div class="panel" role="dialog" aria-modal="true">
        <div class="head">
          <div class="title">
            <div class="name">{{ displayName }}</div>
            <div class="id">#{{ pokemon?.id }}</div>
          </div>

          <!-- repositioned: header actions are now icon-only + close -->
          <div class="headActions">
            <n-button quaternary class="iconBtn" @click="$emit('prev')">
              <ChevronLeft :size="18" />
            </n-button>

            <n-button quaternary class="iconBtn" @click="$emit('next')">
              <ChevronRight :size="18" />
            </n-button>

            <n-button secondary class="closeBtn" @click="$emit('close')">
              <X :size="18" />
              <span class="closeLabel">Close</span>
            </n-button>
          </div>
        </div>

        <div class="body" v-if="pokemon">
          <div class="left">
            <img :src="img" :alt="displayName" />
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

            <!-- repositioned: evo header row + icon -->
            <div class="evoHead">
              <n-h3 style="margin: 0">Evolution</n-h3>
              <n-button size="small" :loading="loadingEvo" @click="loadEvo">
                <GitBranch :size="16" />
                <span>Load</span>
              </n-button>
            </div>

            <div class="evo" v-if="evoNames.length">
              <n-tag
                v-for="n in evoNames"
                :key="n"
                size="small"
                round
                :style="evoTagStyle">
                {{ n }}
              </n-tag>
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
import type {
  EvolutionChain,
  PokemonDetail,
  PokemonTypeName,
} from "../types/pokemon";
import { fetchEvolutionChainByUrl, fetchSpecies } from "../api/pokeApi";

// lucide icons
import { ChevronLeft, ChevronRight, X, GitBranch } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  pokemon: PokemonDetail | null;
}>();

defineEmits<{
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
  } as const;
}

const evoTagStyle = {
  backgroundColor: "var(--ds-type-chip-bg)",
  border: "1px solid var(--ds-type-chip-border)",
  color: "var(--ds-text)",
  borderRadius: "var(--ds-radius-pill)",
  fontSize: "var(--ds-font-size-sm)",
  fontWeight: "var(--ds-font-weight-semibold)",
  padding: "2px 10px",
} as const;
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--ds-overlay);
  backdrop-filter: blur(8px);
  z-index: 9998;
  display: grid;
  place-content: center;
  padding: var(--ds-space-lg);
}

.panel {
  width: 980px;
  /* width: var(--container-w); */
  /* min-width: 100%; */
  max-width: 1440px;
  border-radius: calc(var(--ds-radius-xl));
  border: 1px solid var(--ds-card-border);
  background: var(--ds-panel-bg);
  box-shadow: var(--ds-shadow-md);
  overflow: hidden;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--ds-space-md);
  padding: var(--ds-space-md) var(--ds-space-md);
  border-bottom: 1px solid var(--ds-border);
}

.title {
  display: grid;
  gap: 2px;
}

.name {
  font-weight: var(--ds-font-weight-black);
  font-size: var(--ds-font-size-xl);
  color: var(--ds-text);
}

.id {
  opacity: 0.7;
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-muted);
}

/* NEW: header action layout */
.headActions {
  display: flex;
  align-items: center;
  gap: var(--ds-space-xs);
}

.iconBtn {
  padding: 0 10px;
  min-width: 40px;
}

.closeBtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.closeLabel {
  display: inline;
}

.body {
  padding: var(--ds-space-md);
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--ds-space-md);
}

.left {
  display: grid;
  gap: var(--ds-space-md);
  justify-items: center;
  align-content: start;
}

.left img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(var(--ds-img-drop-shadow-strong));
}

.right {
  min-width: 0;
  color: var(--ds-text);
}

.stats {
  display: grid;
  gap: var(--ds-space-sm);
}

.statRow {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  gap: var(--ds-space-sm);
  align-items: center;
}

.statName {
  text-transform: lowercase;
  opacity: 0.9;
  color: var(--ds-text-muted);
}

.statVal {
  text-align: right;
  opacity: 0.85;
  color: var(--ds-text-muted);
}

/* NEW: evo header row */
.evoHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-sm);
}

.evo {
  margin-top: var(--ds-space-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-xs);
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

  /* mobile: icon-only close */
  .closeLabel {
    display: none;
  }
  .closeBtn {
    padding: 0 10px;
    min-width: 40px;
  }
}
</style>
