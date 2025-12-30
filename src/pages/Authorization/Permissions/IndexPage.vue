<template>
  <div class="q-pa-md">
    <q-btn
      color="teal"
      icon="add"
      label="Add new permission"
      class="q-mb-md"
      dense
      :to="{ name: 'permissions.create' }"
    />

    <DataTable
      ref="tableRef"
      :columns="columns"
      :column-filters="columnFilters"
      initial-sort-by="id"
      :initial-rows-per-page="10"
      api-url="/permissions"
      title="Permissions"
      table-id="permission-table"
      initial-sort-desc
    >
      <template #actions="{ row }">
        <q-btn flat round dense icon="more_vert">
          <q-menu auto-close anchor="top right" class="bg-dark">
            <q-list style="min-width: 150px" class="text-white">
              <q-item clickable @click="defaultDelete(row)">
                <ActionListItem icon="delete" text="Delete" color="negative"/>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'components/table/DataTable.vue';
import type {ApiPermission} from 'src/types/permission';
import type {QTableColumn} from 'quasar';
import {ref} from 'vue';
import type {DataTableRef, FilterItem} from 'src/types/QuasarTable';
import ActionListItem from 'components/table/ActionListItem.vue';
import {useTableActions} from 'src/composables/table/useTableActions';
import {formatDate} from 'src/utils/formatters';

const tableRef = ref<DataTableRef | null>(null);

const {defaultDelete} = useTableActions({
  confirmTitle: 'Delete Permission',
  confirmMessage: 'Are you sure?',
  apiUrl: '/permissions',
  onRefresh: () => {
    tableRef.value?.refresh();
  },
});


const columns: QTableColumn<ApiPermission>[] = [
  {
    name: 'actions',
    label: 'Actions',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'center',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'center',
  },
  {
    name: 'created_at',
    label: 'Created At',
    field: 'created_at',
    align: 'center',
    format: (val) => formatDate(val),
  },
];

const columnFilters = ref<FilterItem[]>([
  {type: 'text', key: 'name', label: 'Name'},
  {type: 'text', key: 'description', label: 'Description'},
]);
</script>
