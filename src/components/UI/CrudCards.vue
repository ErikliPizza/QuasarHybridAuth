<script setup lang="ts">
withDefaults(
  defineProps<{
    submitLabel: string;
    processing?: boolean;
    backTo?: string;
    disable?: boolean;
  }>(),
  {
    processing: false,
    backTo: '/',
    disable: false,
  },
);

const emit = defineEmits<{
  submit: [];
}>();
</script>

<template>
  <q-card class="column no-wrap" style="max-height: min(90vh, 900px)">
    <q-card-actions class="q-gutter-sm justify-between q-pa-md">
      <q-btn icon="arrow_back" :to="backTo" color="grey-8" outline />
      <q-btn :label="submitLabel" no-caps color="primary" :loading="processing" :disable="disable"
        @click="emit('submit')" />
    </q-card-actions>

    <q-separator />

    <q-card-section class="col scroll q-pa-md">
      <slot />
    </q-card-section>
  </q-card>
</template>
