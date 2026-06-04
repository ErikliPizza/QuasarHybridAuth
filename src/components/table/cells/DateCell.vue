<template>
  <MobileSheet :value="formattedValue" v-if="q.screen.lt.md">
    {{ formattedValue }}
  </MobileSheet>

  <DesktopSheet :value="formattedValue" v-else>
    {{ formattedValue }}
  </DesktopSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import MobileSheet from 'components/table/cells/partials/MobileSheet.vue';
import DesktopSheet from 'components/table/cells/partials/DesktopSheet.vue';
import { formatDateTime } from 'src/utils/formatDateTime';

interface Props {
  /** The date value to format (string, number, or Date) */
  value?: string | number | Date | null;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
});

const q = useQuasar();

const formattedValue = computed<string>(() => {
  return formatDateTime(props.value, '-', { includeTime: true });
});
</script>
