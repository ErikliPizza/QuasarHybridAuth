<template>
  <q-chip dense square size="sm" :color="chip.color" :text-color="chip.textColor"
    class="q-ma-none text-caption text-weight-medium">
    {{ chip.label }}
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type EnumChipOption = {
  value: string | number;
  label: string;
  color: string;
  textColor?: string;
};

const props = withDefaults(defineProps<{
  value?: string | number | null;
  options: EnumChipOption[];
  fallbackColor?: string;
  fallbackTextColor?: string;
  fallbackLabel?: string;
}>(), {
  value: null,
  fallbackColor: 'grey-5',
  fallbackTextColor: 'white',
  fallbackLabel: '-',
});

const chip = computed(() => {
  const option = props.options.find((item) => item.value === props.value);

  return {
    label: option?.label ?? props.fallbackLabel,
    color: option?.color ?? props.fallbackColor,
    textColor: option?.textColor ?? props.fallbackTextColor,
  };
});
</script>
