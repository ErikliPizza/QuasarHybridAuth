<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template>
  <q-inner-loading showing class="bg-white bg-opacity-80">
    <div class="column items-center q-gutter-sm">
      <q-spinner-gears size="50px" color="primary" />
      <div v-if="message" class="text-subtitle2 text-grey-7">
        {{ message }}
      </div>
    </div>
  </q-inner-loading>
</template>
