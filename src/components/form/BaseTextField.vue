<script setup lang="ts">
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label: string;
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
  <q-input :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :label="label"
    :error="!!errorMessage" :error-message="errorMessage" outlined dense stack-label v-bind="$attrs">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-input>
</template>
