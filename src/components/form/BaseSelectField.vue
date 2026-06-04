<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label: string;
    options: readonly { label: string; value: string | number }[];
    errorMessage?: string | undefined;
  }>(),
  {
    error: false,
    errorMessage: '',
  },
);

defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();
</script>

<template>
  <q-select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :label="label"
    :options="options" :error="!!errorMessage" :error-message="errorMessage" option-value="value" option-label="label"
    emit-value map-options outlined dense stack-label v-bind="$attrs" />
</template>
