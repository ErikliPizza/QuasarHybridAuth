<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  tableRef: {
    type: [Object, null],
    required: true
  }
})

type PanDetails = {
  delta: { x: number; y: number };
  isFirst?: boolean;
  isFinal?: boolean;
}

const fabPos = ref<[number,number]>([18, 18])
const draggingFab = ref(false)

function moveFab(ev: PanDetails): void {
  draggingFab.value = ev.isFirst !== true && !ev.isFinal

  fabPos.value = [
    fabPos.value[0] - ev.delta.x,
    fabPos.value[1] + ev.delta.y
  ]
}
const getScrollTarget = (): HTMLElement | null => {
  if (!props.tableRef?.$el) {
    return null;
  }
  return props.tableRef.$el.querySelector('.q-table__middle');
}
const scrollToTop = () => {
  const scrollTarget = getScrollTarget();
  if (scrollTarget) {
    scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
const scrollToBottom = () => {
  const scrollTarget = getScrollTarget();
  if (scrollTarget) {
    scrollTarget.scrollTo({ top: scrollTarget.scrollHeight, behavior: 'smooth' });
  }
}
</script>

<template>
  <q-page-sticky position="top-right" style="z-index: 7000" :offset="fabPos">
    <q-fab
      icon="swap_vert"
      direction="down"
      color="green"
      :disable="draggingFab"
      v-touch-pan.prevent.mouse="moveFab"
      padding="sm"
    >
      <q-fab-action padding="xs" @click="scrollToTop" color="primary" icon="arrow_upward" :disable="draggingFab" />
      <q-fab-action padding="xs" @click="scrollToBottom" color="primary" icon="arrow_downward" :disable="draggingFab" />
    </q-fab>
  </q-page-sticky>
</template>

<style scoped>

</style>
