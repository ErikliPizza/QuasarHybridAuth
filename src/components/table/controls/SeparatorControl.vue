<script setup lang="ts">

/**
 * Component providing UI for selecting the table's cell separator style.
 * Emits the selected separator style.
 */

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
  (e: 'separator', value: 'horizontal' | 'vertical' | 'cell' | 'none'): void
}>();

/** Emits the selected separator value */
function handleClick(value: 'horizontal' | 'vertical' | 'cell' | 'none') {
  emit('separator', value);
}
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
