<script setup lang="ts">
import { onMounted } from 'vue';

/**
 * Component providing UI for selecting the table's cell separator style.
 * Emits the selected separator style.
 * Persists selection to local storage.
 */

type SeparatorType = 'horizontal' | 'vertical' | 'cell' | 'none';

const STORAGE_KEY = 'table-separator-style';
const VALID_VALUES: SeparatorType[] = ['horizontal', 'vertical', 'cell', 'none'];

// Props definition
defineProps<{
  /** Hide label text on mobile */
  mobile: boolean;
}>();

// Emits definition
const emit = defineEmits<{
  /**
   * Emitted when a separator style is selected.
   * @param e
   * @param value The selected separator style
   */
  (e: 'separator', value: SeparatorType): void
}>();

/** Loads saved separator from local storage */
function getSavedSeparator(): SeparatorType {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && VALID_VALUES.includes(saved as SeparatorType)) {
    return saved as SeparatorType;
  }
  return 'horizontal'; // Default
}

/** Saves separator selection to local storage and emits */
function handleClick(value: SeparatorType) {
  localStorage.setItem(STORAGE_KEY, value);
  emit('separator', value);
}

// Emit saved separator on mount so parent gets the initial value
onMounted(() => {
  emit('separator', getSavedSeparator());
});
</script>

<template>
  <!-- Dropdown container for separator options -->
  <q-btn-dropdown size="sm" flat color="green" icon="format_shapes" :label="mobile ? '' : 'Kenarlık'">
    <q-list>
      <!-- Horizontal Separator Option -->
      <q-item clickable v-close-popup @click="handleClick('horizontal')">
        <q-item-section>
          <q-item-label caption>Yatay</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="border_horizontal" size="medium" />
        </q-item-section>
      </q-item>

      <!-- Vertical Separator Option -->
      <q-item clickable v-close-popup @click="handleClick('vertical')">
        <q-item-section>
          <q-item-label caption>Dikey</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="border_vertical" size="medium" />
        </q-item-section>
      </q-item>

      <!-- Cell Separator Option -->
      <q-item clickable v-close-popup @click="handleClick('cell')">
        <q-item-section>
          <q-item-label caption>Hücre</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="border_style" size="medium" />
        </q-item-section>
      </q-item>

      <!-- No Separator Option -->
      <q-item clickable v-close-popup @click="handleClick('none')">
        <q-item-section>
          <q-item-label caption>Kapalı</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="deselect" size="medium" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
