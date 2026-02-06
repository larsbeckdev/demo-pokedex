<template>
  <div class="card" :style="{ background: bg }" @click="$emit('open')">
    <div class="top">
      <div class="name">{{ pokemon.name }}</div>
      <div class="id">#{{ pokemon.id }}</div>
    </div>

    <img class="img" :src="pokemon.sprite" :alt="pokemon.name" loading="lazy" />

    <div class="types">
      <n-tag v-for="t in pokemon.types" :key="t" size="small" round>{{ t }}</n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ pokemon: any; bg: string }>();
defineEmits<{ (e: "open"): void }>();
</script>

<style scoped>
.card{
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: transform .12s ease, filter .12s ease;
  min-height: 170px;
  display:flex; flex-direction:column; gap:8px;
}
.card:hover{ transform: translateY(-2px); filter: brightness(1.03); }
.top{ display:flex; justify-content:space-between; align-items:baseline; }
.name{ font-weight:800; font-size: 16px; }
.id{ opacity:.75; font-weight:700; }
.img{ width: 100%; height: 110px; object-fit: contain; }
.types{ display:flex; gap:6px; flex-wrap: wrap; }
</style>
