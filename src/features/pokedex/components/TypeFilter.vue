<template>
  <n-select
    v-model:value="model"
    multiple
    clearable
    :options="options"
    placeholder="Filter by type…" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ types: string[]; modelValue: string[] }>();
const emit = defineEmits<{ (e: "update:modelValue", v: string[]): void }>();

const options = computed(() =>
  props.types.map((t) => ({ label: t, value: t })),
);

const model = computed({
  get: () => props.modelValue,
  set: (v: string[]) => emit("update:modelValue", v),
});
</script>
