<template>
  <header class="bar">
    <div class="brand">
      <img class="logo" src="/favicon.svg" alt="Pokédex" />
      <div class="title">Pokédex</div>
    </div>

    <div class="search">
      <n-input
        v-model:value="model"
        placeholder="Search Pokémon (min. 3 chars)…"
        clearable />
      <n-button
        :disabled="model.trim().length < 3 || loading"
        @click="$emit('search')">
        Search
      </n-button>
    </div>

    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{ model: string; loading: boolean }>();
defineEmits<{ (e: "update:model", v: string): void; (e: "search"): void }>();
</script>

<style scoped>
.bar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--n-color);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
}
.logo {
  width: 28px;
  height: 28px;
}
.title {
  font-weight: 800;
  letter-spacing: 0.4px;
}
.search {
  display: flex;
  gap: 10px;
  width: min(520px, 100%);
}
@media (max-width: 520px) {
  .bar {
    flex-direction: column;
    align-items: stretch;
  }
  .brand {
    justify-content: center;
  }
}
</style>
