<template>
  <q-item class="q-my-sm" clickable v-ripple :to="to">
    <q-item-section avatar top>
      <q-avatar :icon="icon" :color="color" text-color="white" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface DrawerItemProps {
  icon: string;
  label: string;
  to?: RouteLocationRaw;
  color?: string;
}

withDefaults(defineProps<DrawerItemProps>(), {
  to: '',
  color: 'primary'
});
</script>
