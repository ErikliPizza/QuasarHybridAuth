<template>
  <MobileSheet :value="props.value" v-if="q.screen.lt.md">
    {{ displayValue }}
  </MobileSheet>

  <DesktopSheet :value="props.value" v-else>
    {{ displayValue }}
  </DesktopSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import MobileSheet from 'components/table/cells/partials/MobileSheet.vue';
import DesktopSheet from 'components/table/cells/partials/DesktopSheet.vue';

interface Props {
  /** The underlying value to pass into the sheet */
  value?: string | number | null
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
})

const q = useQuasar();

/**
 * Show the actual value or a placeholder ('-') when it's null/undefined
 */
const displayValue = computed<string | number>(() => {
  return props.value ?? '-'
})
</script>
