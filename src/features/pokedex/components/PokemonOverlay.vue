<template>
  <n-modal
    :show="show"
    preset="card"
    :mask-closable="true"
    @mask-click="$emit('close')">
    <div class="wrap" v-if="pokemon">
      <div class="head">
        <n-button quaternary @click="$emit('prev')">←</n-button>
        <div class="title">
          {{ pokemon.name }} <span class="id">#{{ pokemon.id }}</span>
        </div>
        <n-button quaternary @click="$emit('next')">→</n-button>
      </div>

      <div class="grid">
        <img class="img" :src="pokemon.sprite" :alt="pokemon.name" />
        <div class="info">
          <div class="row">
            <n-tag v-for="t in pokemon.types" :key="t" round>{{ t }}</n-tag>
          </div>

          <div class="stats">
            <div v-for="k in keys" :key="k" class="stat">
              <div class="label">{{ k }}</div>
              <n-progress type="line" :percentage="pct(pokemon.stats[k])" />
              <div class="val">{{ pokemon.stats[k] }}</div>
            </div>
          </div>

          <n-divider />

          <n-button
            :loading="evoLoading"
            :disabled="evoLoading || !!evo"
            @click="loadEvo">
            Load evolution chain (lazy)
          </n-button>

          <pre v-if="evo" class="evo">{{ pretty(evo) }}</pre>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  show: boolean;
  pokemon: any | null;
  loadEvolution: () => Promise<any>;
}>();

defineEmits<{ (e: "close"): void; (e: "next"): void; (e: "prev"): void }>();

const evo = ref<any | null>(null);
const evoLoading = ref(false);

const keys = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

function pct(v: number) {
  return Math.min(100, Math.round((v / 200) * 100));
}

function pretty(o: any) {
  return JSON.stringify(o, null, 2);
}

async function loadEvo() {
  evoLoading.value = true;
  try {
    evo.value = await props.loadEvolution();
  } finally {
    evoLoading.value = false;
  }
}
</script>

<style scoped>
.wrap {
  width: min(920px, 92vw);
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.title {
  font-weight: 900;
  font-size: 18px;
}
.id {
  opacity: 0.7;
  font-weight: 800;
  margin-left: 6px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 14px;
  margin-top: 10px;
}
.img {
  width: 100%;
  height: 260px;
  object-fit: contain;
}
.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat {
  display: grid;
  grid-template-columns: 140px 1fr 50px;
  gap: 10px;
  align-items: center;
}
.label {
  font-weight: 700;
  opacity: 0.9;
}
.val {
  text-align: right;
  font-weight: 800;
}
.evo {
  margin-top: 10px;
  max-height: 220px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 10px;
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .stat {
    grid-template-columns: 110px 1fr 44px;
  }
}
</style>
