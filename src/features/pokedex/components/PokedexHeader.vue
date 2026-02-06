<template>
  <header class="bar">
    <div class="brand">
      <!-- <img class="logo" src="/favicon.svg" alt="Pokédex" /> -->
      <div class="title">Pokédex</div>
    </div>

    <div class="search">
      <n-input
        :value="modelValue"
        @update:value="onUpdate"
        placeholder="Search Pokémon (min. 3 chars)…"
        clearable />
      <n-button
        :disabled="modelValue.trim().length < 3 || loading"
        @click="$emit('search')">
        Search
      </n-button>
    </div>

    <slot />
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "search"): void;
}>();

function onUpdate(v: string) {
  emit("update:modelValue", v);
}
</script>

<style scoped>
/* dein CSS wie gehabt */
</style>
