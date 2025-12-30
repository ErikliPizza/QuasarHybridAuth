<script setup lang="ts" generic="T extends Record<string, any> & { id: string | number }">
/**
 * 1. IMPORTS
 */

import type { PropType } from 'vue';
// Vue & External Libs
import { computed, onMounted, ref } from 'vue';
import { Platform } from 'quasar';
// Composables
import { useTableData } from 'src/composables/table/useTableData';
import { useTableSelection } from 'src/composables/table/useTableSelection';
import { useTableSettings } from 'src/composables/table/useTableSettings';
import { useTableExport } from 'src/composables/table/useTableExport';
// Components
import FilterIterator from 'components/table/FilterIterator.vue';
import DefaultCell from 'components/table/cells/DefaultCell.vue';
import SeparatorControl from 'components/table/controls/SeparatorControl.vue';
import ViewControl from 'components/table/controls/ViewControl.vue';
import ColumnControl from 'components/table/controls/ColumnControl.vue';
import ScrollFabControl from 'components/table/controls/ScrollFabControl.vue';
import GestureHint from 'components/UI/GestureHint.vue';
// Types
import type { FilterItem, QTableColumn } from 'src/types/QuasarTable';

// 2. PROPS
const props = defineProps({
  tableId: {
    type: String,
    required: true,
  },
  columns: {
    type: Array as PropType<QTableColumn<T>[]>,
    required: true,
  },
  columnFilters: {
    type: Array as PropType<FilterItem[]>,
    required: true,
  },
  initialSortBy: {
    type: String,
    required: true,
  },
  initialSortDesc: {
    type: Boolean,
    default: false,
  },
  initialRowsPerPage: {
    type: Number,
    default: 10,
  },
  apiUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Items',
  },
  enableSelection: {
    type: String as PropType<'single' | 'multiple' | 'none'>,
    default: 'none',
  },
  flat: {
    type: Boolean,
    default: true,
  },
});

/**
 * COMPONENT STATE
 */

// UI Display State
const mobile: boolean = Platform.is.mobile;
const isDense = ref<boolean>(mobile);
const isGrid = ref<boolean>(false);
const tableSeparator = ref<'horizontal' | 'vertical' | 'cell' | 'none'>('horizontal');
const tableRef = ref(null);
const fullscreen = ref<boolean>(false);

// Column Configuration State
const draggableColumns = ref([...props.columns]);
const visibleColumnNames = ref(props.columns.map((col) => col.name));

/**
 * COMPOSABLE USAGE
 */

// Table Settings
const { saveSettings, loadSettings } = useTableSettings<T>(props.tableId, props.columns);

// Table Selection
const { selected, handleSelection } = useTableSelection<T>(tableRef);

// Table Data & Pagination
const { rows, loading, pagination, onRequest, onFilterChange } = useTableData<T>(
  props.apiUrl,
  props.initialSortBy,
  props.initialSortDesc,
  props.initialRowsPerPage,
  props.columnFilters,
);

// Table Export
const { exportToCsv } = useTableExport<T>();

/**
 * 5. COMPUTED PROPERTIES
 */

const orderedColumns = computed(() => {
  return draggableColumns.value.map((col) => {
    // Find the original column definition in props.columns to ensure all properties are present
    return props.columns.find((pCol) => pCol.name === col.name) || col;
  });
});

/**
 * METHODS
 */

// Handle saving settings when requested by ColumnControl
const handleSaveSettings = () => {
  saveSettings({
    draggableColumns: draggableColumns.value,
    visibleColumnNames: visibleColumnNames.value,
  });
};

// Handle view mode changes
const onViewClick = (param: number) => {
  switch (param) {
    case 1:
      isDense.value = false;
      isGrid.value = false;
      break;
    case 2:
      isDense.value = true;
      isGrid.value = false;
      break;
    case 3:
      isDense.value = false;
      isGrid.value = true;
      break;
  }
};

/**
 * LIFECYCLE HOOKS
 */
onMounted(async () => {
  // Load settings from localStorage
  const settings = loadSettings();
  if (settings) {
    draggableColumns.value = settings.draggableColumns;
    visibleColumnNames.value = settings.visibleColumnNames;
  }

  await onRequest(pagination.value);
});

function handleExportToCsv() {
  const data = selected.value.length ? selected.value : rows.value;

  exportToCsv(orderedColumns.value, visibleColumnNames.value, data as T[], props.tableId);
}

const refresh = async () => {
  await onRequest(pagination.value);
};

defineExpose({
  refresh,
});
</script>

<template>
  <ScrollFabControl :table-ref="tableRef" />

  <div class="table-container">
    <q-table
      ref="tableRef"
      row-key="id"
      :title="mobile ? '' : title"
      :fullscreen="fullscreen"
      class="virtual-scroll-table"
      :class="!fullscreen ? 'table-max-height' : ''"
      :flat="flat"
      bordered
      :dense="isDense"
      :grid="isGrid"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :loading="loading"
      :columns="orderedColumns"
      :rows="rows"
      :visible-columns="visibleColumnNames"
      :selection="enableSelection ?? 'multiple'"
      :separator="tableSeparator"
      @request="(requestProps) => onRequest(requestProps.pagination)"
      @selection="handleSelection"
      virtual-scroll
      :virtual-scroll-slice-size="30"
      :virtual-scroll-item-size="30"
      :virtual-scroll-buffer-size="100"
    >
      <template v-slot:top-right>
        <div class="row items-center justify-center q-mb-md">
          <FilterIterator :mobile="mobile" :filters="columnFilters" @filter="onFilterChange" />

          <q-separator vertical inset spaced v-if="!mobile" />

          <ColumnControl
            :columns="props.columns"
            :initial-columns="props.columns"
            v-model:modelValueOrder="draggableColumns"
            v-model:modelValueVisible="visibleColumnNames"
            :mobile="mobile"
            @saveSettings="handleSaveSettings"
          />

          <q-separator vertical inset spaced v-if="!mobile" />

          <ViewControl :mobile="mobile" @view="onViewClick" />

          <q-separator vertical inset spaced v-if="!mobile" />

          <SeparatorControl :mobile="mobile" @separator="tableSeparator = $event" />

          <q-separator vertical inset spaced v-if="!mobile" />

          <q-btn
            size="sm"
            flat
            color="green"
            icon="download"
            @click="handleExportToCsv"
            :label="mobile ? '' : 'CSV'"
          />

          <q-separator vertical inset spaced v-if="!mobile" />

          <q-btn
            size="sm"
            flat
            color="green"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
            :label="mobile ? '' : 'Tam Ekran'"
          />
        </div>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props">
          <slot v-if="props.col.name === 'actions'" name="actions" :row="props.row" />
          <component
            v-else
            :is="props.col.component || DefaultCell"
            :value="props.value"
            v-bind="props.col.componentProps"
          />
        </q-td>
      </template>
    </q-table>
  </div>

  <GestureHint
    v-if="enableSelection === 'multiple'"
    text="SHIFT ve CTRL tuşlarıyla gelişmiş seçim yapın"
    icon="keyboard"
    position="center"
    animation="pulse"
    platform="desktop"
    :duration="5000"
    hint-id="table-shift-select"
    background-color="rgba(25, 118, 210, 0.7)"
  />
</template>

<style lang="scss">
.table-container {
  position: relative;
}

.table-max-height {
  max-height: calc(100vh - 200px);
}

.virtual-scroll-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #fff;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }
}
</style>
