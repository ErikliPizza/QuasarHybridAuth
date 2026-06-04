<script setup lang="ts" generic="T extends Record<string, any> & { id: string | number }">
/**
 * Component providing UI for managing table column visibility and order.
 * Features drag-and-drop reordering, checkbox visibility toggling, and reset.
 * Uses v-model for order and visibility state synchronization with the parent.
 * Emits an event when settings should be saved (e.g., when the dropdown closes).
 */
import type { QTableColumn } from 'src/types/quasarTable';
import type { PropType } from 'vue';
import { computed } from 'vue';
import draggable from 'vuedraggable'

// Emits definition
const emit = defineEmits<{
  /** Emitted when the dropdown closes, signaling settings should be persisted */
  (e: 'saveSettings'): void;
}>();

// Props definition
const props = defineProps({
  /** All available column definitions (used for labels, required status, etc.) */
  columns: {
    type: Array as PropType<QTableColumn<T>[]>,
    required: true,
  },
  /** The original, un-ordered column array (used for reset functionality) */
  initialColumns: {
    type: Array as PropType<QTableColumn<T>[]>,
    required: true,
  },
  /** Hide label text on mobile */
  mobile: {
    type: Boolean,
    default: false,
  },
});

// Models for two-way binding with the parent component
/** v-model for the array of column definitions, controlling the order */
const orderModel = defineModel<QTableColumn<T>[]>("modelValueOrder", { required: true });
/** v-model for the array of visible column names */
const visibilityModel = defineModel<string[]>("modelValueVisible", { required: true });

/** Computed property holding the names of initially visible columns (for reset) */
const initialVisibleNames = computed(() => props.initialColumns.map(col => col.name));

/** Helper to find the full original column definition for display purposes */
const getOriginalColumn = (col: QTableColumn<T>, allColumns: QTableColumn<T>[]) => {
  return allColumns.find(c => c.name === col.name) ?? col;
};

/** Resets the column order and visibility to the initial state */
const handleReset = () => {
  orderModel.value = [...props.initialColumns];
  visibilityModel.value = initialVisibleNames.value;
};

</script>

<template>
  <!-- Dropdown container for column management -->
  <q-btn-dropdown size="sm" flat color="green" icon="view_column" :label="mobile ? '' : 'Sütunlar'"
    @hide="emit('saveSettings')">
    <!-- Reset Button -->
    <q-btn @click="handleReset" size="sm" class="full-width" icon="refresh" flat label="Sıfırla" color="orange" />
    <q-list>
      <!-- Draggable list for column reordering and visibility toggle -->
      <draggable item-key="name" v-model="orderModel" tag="div" v-bind="$attrs">
        <template #item="{ element: col }">
          <q-item tag="label" v-if="getOriginalColumn(col, props.columns)">
            <q-item-section>
              <q-item-label caption>{{ getOriginalColumn(col, props.columns).label }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-checkbox v-model="visibilityModel" :val="getOriginalColumn(col, props.columns).name"
                :disable="getOriginalColumn(col, props.columns).required" />
            </q-item-section>
          </q-item>
        </template>
      </draggable>
    </q-list>
  </q-btn-dropdown>
</template>
