<script setup lang="ts">
import { QInput } from 'quasar';
import { computed, nextTick, ref } from 'vue';
import debounce from 'lodash/debounce';
import type { FilterItem } from 'src/types/QuasarTable';
import GestureHint from 'components/UI/GestureHint.vue';

const dialog = ref(false);

const props = defineProps<{
  filters: FilterItem[];
  mobile: boolean;
}>();

const emit = defineEmits<{
  (e: 'filter'): void;
}>();

const performSearch = debounce(() => {
  emit('filter');
}, 500);

const activeFilters = computed(() =>
  props.filters.reduce((count, f) => count + (f.value != null ? 1 : 0), 0)
)

async function resetFilters () {
  props.filters.forEach(f => f.value = null);
  await nextTick();
  emit('filter');
}
function handleSwipe (newInfo: { direction: string; }) {
  if (newInfo.direction === 'down' && props.mobile) {
    dialog.value = false;
  }
}
</script>

<template>
  <q-btn
    @click="dialog = !dialog"
    size="sm"
    flat
    color="green"
    icon="search"
    :label="mobile ? '' : 'Tabloda Ara'"
  >
    <q-badge color="red" floating rounded :label="activeFilters" />
  </q-btn>

  <q-dialog v-model="dialog" :position="mobile ? 'bottom' : 'top'">
    <q-card v-touch-swipe.mouse="handleSwipe" style="width: 700px; max-width: 100vw;">
      <GestureHint
        text="Hızlıca kapatmak için aşağı kaydırın"
        icon="arrow_downward"
        position="center"
        animation="swipeDown"
        platform="mobile"
        :duration="1500"
        hint-id="table-filters"
        background-color="rgba(25, 118, 210, 0.7)"
        force-show
      />

      <q-toolbar>
        <q-icon name="manage_search" size="md"/>

        <q-toolbar-title class="text-weight-bold">Tabloda Ara</q-toolbar-title>
        <q-btn flat dense color="negative" icon="refresh" @click="resetFilters" :disable="activeFilters === 0" />
        <q-btn flat dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="row">
        <div v-for="(item) in filters" :key="item.key" class="col-lg-6 col-12">
          <q-input
            v-if="item.type === 'text'"
            :key="item.key"
            v-model="item.value"
            :label="item.label"
            dense
            outlined
            class="q-ma-sm"
            @update:model-value="performSearch"
          />

          <q-select
            v-else-if="item.type === 'select'"
            :key="item.key"
            v-model="item.value"
            :label="item.label"
            :options="item.options"
            emit-value
            clearable
            dense
            outlined
            class="q-ma-sm"
            @update:model-value="performSearch"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
