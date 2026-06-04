<template>
  <q-chip dense square size="sm" :color="color" text-color="white"
    class="q-ma-none text-caption text-weight-medium">
    {{ displayValue }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ScoreTone = 'danger' | 'success';

const props = withDefaults(defineProps<{
  value?: number | string | null;
  min?: number;
  max?: number;
  tone?: ScoreTone;
  fallbackLabel?: string;
}>(), {
  value: null,
  min: 0,
  max: 100,
  tone: 'danger',
  fallbackLabel: '-',
});

const numericValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') return null;

  const parsed = Number(props.value);
  return Number.isFinite(parsed) ? parsed : null;
});

const ratio = computed(() => {
  if (numericValue.value === null) return null;

  const range = props.max - props.min;
  if (range <= 0) return 0;

  const normalized = (numericValue.value - props.min) / range;
  return Math.min(1, Math.max(0, normalized));
});

const color = computed(() => {
  if (ratio.value === null) return 'grey-5';

  if (props.tone === 'success') {
    if (ratio.value >= 0.75) return 'teal-7';
    if (ratio.value >= 0.5) return 'green-7';
    if (ratio.value >= 0.25) return 'orange-7';
    return 'red-7';
  }

  if (ratio.value >= 0.75) return 'red-7';
  if (ratio.value >= 0.5) return 'deep-orange-7';
  if (ratio.value >= 0.25) return 'orange-7';
  return 'teal-7';
});

const displayValue = computed(() => numericValue.value ?? props.fallbackLabel);
</script>
