<template>
  <q-item-section>
    <div class="row items-center no-wrap">
      <q-icon v-if="icon" :name="icon" size="1.5rem" :color="color" class="q-mr-sm" />

      <span class="text-body2" :class="`text-${color}`">
        {{ text }}
      </span>
    </div>
  </q-item-section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    text: string;
    color?: string;
  }>(),
  {
    color: 'white',
  },
);
</script>
