<template>
  <header class="bar">
    <div class="brand">
      <div class="title">Pokédex</div>
    </div>

    <div class="search">
      <n-input
        :value="safeValue"
        @update:value="onUpdate"
        placeholder="Search Pokémon (min. 3 chars)…"
        clearable />

      <n-button
        :disabled="safeValue.trim().length < 3 || loading"
        @click="$emit('search')">
        Search
      </n-button>
    </div>

    <slot />
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string; // optional, damit es nicht crasht
    loading: boolean;
  }>(),
  { modelValue: "" },
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "search"): void;
}>();

const safeValue = computed(() => props.modelValue ?? "");

function onUpdate(v: string) {
  emit("update:modelValue", v ?? "");
}
</script>
