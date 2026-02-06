<template>
  <n-drawer
    :show="!!detail"
    placement="right"
    width="420"
    @update:show="onClose">
    <n-drawer-content :title="headerTitle">
      <template v-if="loading">
        <n-spin size="large" />
      </template>

      <template v-else-if="detail">
        <n-space vertical size="large">
          <div style="display: flex; gap: 12px; align-items: center">
            <img
              v-if="detail.sprites.front_default"
              :src="detail.sprites.front_default"
              :alt="detail.name"
              width="96"
              height="96" />
            <div>
              <n-text depth="2">Height: {{ detail.height }}</n-text
              ><br />
              <n-text depth="2">Weight: {{ detail.weight }}</n-text>
            </div>
          </div>

          <div>
            <n-text strong>Typen</n-text>
            <n-space size="small" wrap style="margin-top: 8px">
              <n-tag v-for="t in typeNames" :key="t" size="small">{{
                cap(t)
              }}</n-tag>
            </n-space>
          </div>

          <div>
            <n-text strong>Abilities</n-text>
            <n-ul style="margin-top: 8px">
              <n-li v-for="a in detail.abilities" :key="a.ability.name">
                {{ cap(a.ability.name) }}
                <n-text depth="3" v-if="a.is_hidden">(hidden)</n-text>
              </n-li>
            </n-ul>
          </div>

          <div>
            <n-text strong>Stats</n-text>
            <n-space vertical style="margin-top: 8px">
              <div v-for="s in detail.stats" :key="s.stat.name">
                <n-text>{{ cap(s.stat.name) }}</n-text>
                <n-progress type="line" :percentage="pct(s.base_stat)" />
              </div>
            </n-space>
          </div>
        </n-space>
      </template>

      <template v-else>
        <n-text depth="3">Keine Details geladen.</n-text>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NSpin,
  NSpace,
  NText,
  NTag,
  NUl,
  NLi,
  NProgress,
} from "naive-ui";
import type { PokemonDetail } from "../model/types";
import { capitalize } from "../utils/pokemon";

const props = defineProps<{
  detail: PokemonDetail | null;
  loading: boolean;
  onClose: () => void;
}>();

const headerTitle = computed(() =>
  props.detail
    ? `#${props.detail.id} · ${capitalize(props.detail.name)}`
    : "Pokémon",
);

const typeNames = computed(() =>
  props.detail
    ? props.detail.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name)
    : [],
);

const cap = (s: string) => capitalize(s);
const pct = (baseStat: number) =>
  Math.max(0, Math.min(100, Math.round((baseStat / 200) * 100)));
</script>
