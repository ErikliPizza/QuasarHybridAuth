<template>
  <q-item class="q-ma-xs bg-blue-1 rounded-borders" clickable v-ripple :to="to">
    <q-item-section avatar>
      <q-avatar color="primary" text-color="white">
        <img :src="avatar" alt="avatar">
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label caption lines="1">{{ email }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="manage_accounts" color="primary" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface ProfileItemProps {
  avatar: string;
  name: string;
  email: string;
  to: RouteLocationRaw;
}

defineProps<ProfileItemProps>();
</script>
