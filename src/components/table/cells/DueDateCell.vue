<template>
  <q-chip dense square size="sm" :color="color" text-color="white"
    class="q-ma-none text-caption text-weight-medium">
    {{ formattedValue }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDateTime, type DateLike } from 'src/utils/formatDateTime';

const props = withDefaults(defineProps<{
  value?: DateLike;
  warningDays?: number;
  dangerWhenPast?: boolean;
  includeTime?: boolean;
}>(), {
  value: null,
  warningDays: 3,
  dangerWhenPast: true,
  includeTime: true,
});

const date = computed(() => {
  if (!props.value) return null;

  const parsed = new Date(props.value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
});

const formattedValue = computed(() =>
  formatDateTime(props.value, '-', { includeTime: props.includeTime }),
);

const color = computed(() => {
  if (!date.value) return 'grey-5';

  const now = new Date();
  const diffMs = date.value.getTime() - now.getTime();
  const warningMs = props.warningDays * 24 * 60 * 60 * 1000;

  if (props.dangerWhenPast && diffMs < 0) return 'red-7';
  if (diffMs <= warningMs) return 'orange-7';

  return 'blue-grey-6';
});
</script>
