<script setup lang="ts">
import { onMounted } from 'vue';

/**
 * Component providing UI for selecting the table's view mode.
 * Emits the selected view mode (1: Comfy, 2: Compact, 3: Grid).
 * Persists selection to local storage.
 */

const STORAGE_KEY = 'table-view-mode';

// Props definition
defineProps<{
  /** Hide label text on mobile */
  mobile: boolean;
}>();

// Emits definition
const emit = defineEmits<{
  /**
   * Emitted when a view mode is selected.
   * @param e
   * @param value The selected view mode (1: Comfy, 2: Compact, 3: Grid)
   */
  (e: 'view', value: 1 | 2 | 3): void
}>();

/** Loads saved view from local storage */
function getSavedView(): 1 | 2 | 3 {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = parseInt(saved, 10);
    if (parsed >= 1 && parsed <= 3) {
      return parsed as 1 | 2 | 3;
    }
  }
  return 1; // Default to Comfy view
}

/** Saves view selection to local storage and emits */
function handleClick(value: 1 | 2 | 3) {
  localStorage.setItem(STORAGE_KEY, String(value));
  emit('view', value);
}

// Emit saved view on mount so parent gets the initial value
onMounted(() => {
  emit('view', getSavedView());
});
</script>

<template>
  <!-- Dropdown container for view options -->
  <q-btn-dropdown size="sm" flat color="green" icon="grid_view" :label="mobile ? '' : 'Görünüm'">
    <q-list>
      <!-- Comfy View Option -->
      <q-item clickable v-close-popup @click="handleClick(1)">
        <q-item-section>
          <q-item-label caption>Rahat</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="view_comfy_alt" size="medium" />
        </q-item-section>
      </q-item>

      <!-- Compact View Option -->
      <q-item clickable v-close-popup @click="handleClick(2)">
        <q-item-section>
          <q-item-label caption>Kompakt</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="view_compact_alt" size="medium" />
        </q-item-section>
      </q-item>

      <!-- Grid View Option -->
      <q-item clickable v-close-popup @click="handleClick(3)">
        <q-item-section>
          <q-item-label caption>Izgara</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="grid_view" size="medium" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
