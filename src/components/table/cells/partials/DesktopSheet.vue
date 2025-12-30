<template>
  <span class="truncate-inline">
    <slot />
    <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
      {{ props.value?.toString() }}
    </q-tooltip>
  </span>
</template>

<script setup lang="ts">
interface Props {
  value: string | number | null;
}

const props = defineProps<Props>();
</script>

<style scoped>
.truncate-inline {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
