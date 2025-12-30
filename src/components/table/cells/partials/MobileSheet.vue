<template>
  <span
    class="truncate-inline text-caption cursor-pointer"
    :style="normalizedMaxWidth"
    @click="showDialog = true"
  >
    <slot />

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 250px">
        <q-card-section class="text-center">
          {{ props.value?.toString() }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  value: string | number | null;
  maxWidth?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 200,
});

const showDialog = ref(false);

const normalizedMaxWidth = computed(() => ({
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
}));
</script>

<style scoped>
.truncate-inline {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
