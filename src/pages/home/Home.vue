<template>
  <n-space vertical size="large">
    <n-space align="center" justify="space-between">
      <div>
        <n-h2 style="margin: 0">Pokédex (simple)</n-h2>
        <n-text depth="3">Geladen: {{ list.length }}</n-text>
      </div>

      <n-space align="center">
        <n-input
          v-model:value="query"
          clearable
          placeholder="Suche (Name oder ID)"
          style="width: 260px" />
        <n-button :loading="loadingList" @click="loadList">Reload</n-button>
      </n-space>
    </n-space>

    <n-alert v-if="error" type="error" closable @close="error = null">
      {{ error }}
    </n-alert>

    <n-skeleton v-if="loadingList" text :repeat="8" />

    <n-grid
      v-else
      :x-gap="12"
      :y-gap="12"
      cols="1 s:2 m:3 l:4 xl:5"
      responsive="screen">
      <n-grid-item v-for="p in filtered" :key="p.id">
        <n-card hoverable style="cursor: pointer" @click="open(p.name)">
          <template #cover>
            <div style="display: flex; justify-content: center; padding: 16px">
              <img
                :src="p.sprite"
                :alt="p.name"
                width="96"
                height="96"
                loading="lazy" />
            </div>
          </template>

          <n-space vertical size="small">
            <n-text strong>#{{ p.id }} · {{ cap(p.name) }}</n-text>
            <n-space size="small" wrap>
              <n-tag v-for="t in p.types" :key="t" size="small">{{
                cap(t)
              }}</n-tag>
              <n-text v-if="p.types.length === 0" depth="3"
                >Typen laden beim Öffnen</n-text
              >
            </n-space>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- Detail Drawer -->
    <n-drawer
      :show="!!selected"
      placement="right"
      width="420"
      @update:show="close">
      <n-drawer-content
        :title="
          selected ? `#${selected.id} · ${cap(selected.name)}` : 'Pokémon'
        ">
        <n-spin v-if="loadingDetail" size="large" />

        <template v-else-if="selected">
          <n-space vertical size="large">
            <div style="display: flex; gap: 12px; align-items: center">
              <img
                v-if="selected.sprites.front_default"
                :src="selected.sprites.front_default"
                :alt="selected.name"
                width="96"
                height="96" />
              <div>
                <n-text depth="2">Height: {{ selected.height }}</n-text
                ><br />
                <n-text depth="2">Weight: {{ selected.weight }}</n-text>
              </div>
            </div>

            <div>
              <n-text strong>Typen</n-text>
              <n-space size="small" wrap style="margin-top: 8px">
                <n-tag
                  v-for="t in selected.types"
                  :key="t.type.name"
                  size="small">
                  {{ cap(t.type.name) }}
                </n-tag>
              </n-space>
            </div>

            <div>
              <n-text strong>Abilities</n-text>
              <n-ul style="margin-top: 8px">
                <n-li v-for="a in selected.abilities" :key="a.ability.name">
                  {{ cap(a.ability.name) }}
                  <n-text depth="3" v-if="a.is_hidden">(hidden)</n-text>
                </n-li>
              </n-ul>
            </div>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-space>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  NAlert,
  NButton,
  NCard,
  NDrawer,
  NDrawerContent,
  NGrid,
  NGridItem,
  NH2,
  NInput,
  NLi,
  NSkeleton,
  NSpace,
  NSpin,
  NTag,
  NText,
  NUl,
} from "naive-ui";

type Named = { name: string; url: string };

type PokemonListItem = {
  id: number;
  name: string;
  sprite: string;
  types: string[]; // wird beim Öffnen ergänzt
};

type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  types: { slot: number; type: Named }[];
  abilities: { ability: Named; is_hidden: boolean; slot: number }[];
};

const BASE = "https://pokeapi.co/api/v2";

const list = ref<PokemonListItem[]>([]);
const query = ref("");
const error = ref<string | null>(null);

const loadingList = ref(false);
const loadingDetail = ref(false);

const selected = ref<PokemonDetail | null>(null);

// simple caches (nur in-memory)
const detailCache = new Map<string, PokemonDetail>();
const typesCache = new Map<string, string[]>();

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function idFromUrl(url: string) {
  const m = url.match(/\/pokemon\/(\d+)\//);
  return m ? Number(m[1]) : -1;
}

function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

async function http<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

// lädt nur Namen+URLs (schnell) und baut daraus ID+Sprite
async function loadList() {
  loadingList.value = true;
  error.value = null;

  try {
    const res = await http<{ results: { name: string; url: string }[] }>(
      `${BASE}/pokemon?limit=151&offset=0`,
    );

    list.value = res.results
      .map((r) => {
        const id = idFromUrl(r.url);
        return {
          id,
          name: r.name,
          sprite: spriteUrl(id),
          types: typesCache.get(r.name) ?? [],
        };
      })
      .filter((p) => p.id > 0)
      .sort((a, b) => a.id - b.id);
  } catch (e: any) {
    error.value = e?.message ?? "Fehler beim Laden der Liste.";
  } finally {
    loadingList.value = false;
  }
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter(
    (p) => p.name.includes(q) || String(p.id).includes(q),
  );
});

async function open(name: string) {
  loadingDetail.value = true;
  error.value = null;

  try {
    const cached = detailCache.get(name);
    if (cached) {
      selected.value = cached;
      return;
    }

    const d = await http<PokemonDetail>(
      `${BASE}/pokemon/${encodeURIComponent(name)}`,
    );
    detailCache.set(name, d);
    selected.value = d;

    // Typen auch in die Liste zurückspiegeln (für Cards)
    const types = d.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name);

    typesCache.set(name, types);
    const item = list.value.find((x) => x.name === name);
    if (item) item.types = types;
  } catch (e: any) {
    error.value = e?.message ?? "Fehler beim Laden der Details.";
  } finally {
    loadingDetail.value = false;
  }
}

function close() {
  selected.value = null;
}

onMounted(loadList);
</script>
