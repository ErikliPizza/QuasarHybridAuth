<template>
  <div class="q-pa-md">
    <q-btn
      color="teal"
      icon="add"
      label="Create Department"
      class="q-mb-md"
      dense
      :to="{ name: 'departments.create' }"
    />

    <DataTable
      ref="tableRef"
      :columns="columns"
      :column-filters="columnFilters"
      initial-sort-by="id"
      :initial-rows-per-page="10"
      api-url="/departments"
      title="Departments"
      table-id="department-table"
      initial-sort-desc
    >
      <template #actions="{ row }">
        <q-btn flat round dense icon="more_vert">
          <q-menu auto-close anchor="top right" class="bg-dark">
            <q-list style="min-width: 150px" class="text-white">
              <q-item clickable @click="editDepartment(row)">
                <ActionListItem icon="edit" text="Edit" />
              </q-item>
              <q-separator color="white" />
              <q-item clickable @click="defaultDelete(row)">
                <ActionListItem icon="delete" text="Delete" color="negative" />
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
import type { ApiDepartment } from 'src/types/department';
import type { QTableColumn } from 'quasar';
import { ref } from 'vue';
import type { DataTableRef, FilterItem } from 'src/types/QuasarTable';
import { useRouter } from 'vue-router';
import { formatDate } from 'src/utils/formatters';
import ActionListItem from 'components/table/ActionListItem.vue';

import { useTableActions } from 'src/composables/table/useTableActions';

const tableRef = ref<DataTableRef | null>(null);
const { defaultDelete } = useTableActions({
  confirmTitle: 'Delete Department',
  confirmMessage: 'Are you sure?',
  apiUrl: '/departments',
  onRefresh: () => {
    tableRef.value?.refresh();
  },
});

const router = useRouter();

const columns: QTableColumn<ApiDepartment>[] = [
  {
    name: 'actions',
    label: 'Actions',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  { name: 'id', label: 'ID', field: 'id', align: 'center' },
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  { name: 'description', label: 'Description', field: 'description', align: 'center' },
  {
    name: 'employees_count',
    label: 'Employee Count',
    field: 'employees_count',
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

const columnFilters = ref<FilterItem[]>([{ type: 'text', key: 'name', label: 'Name' }]);

function editDepartment(row: ApiDepartment) {
  void router.push({ name: 'departments.edit', params: { id: row.id } });
}
</script>
