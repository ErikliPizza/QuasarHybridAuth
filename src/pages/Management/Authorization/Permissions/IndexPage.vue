<template>
  <div class="q-pa-xs">
    <DataTable ref="tableRef" :columns="columns" :column-filters="columnFilters" initial-sort-by="id"
      :initial-rows-per-page="10" api-url="/permissions?include=role" title="İzinler" table-id="permission-table" initial-sort-desc
      create-route="permissions.create" create-label="İzin Tanımla">
      <template #actions="{ row }">
        <TableRowActions :row="row" :edit-to="{ name: 'permissions.edit', params: { id: row.id } }" @delete-row="defaultDelete" />
      </template>
    </DataTable>

    <q-banner inline-actions rounded class="bg-warning text-grey-8 q-ma-md">
      "Rol" değeri, kullanıcı yetkisini doğrudan belirlemez; ilgili rol için <b class="text-dark">önerilen izni</b>
      ifade
      eder.
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'components/table/DataTable.vue';
import SearchOptions from 'src/components/form/SearchOptions.vue';
import DateCell from 'components/table/cells/DateCell.vue';
import { markRaw, ref } from 'vue';
import { useTableActions } from 'src/composables/table/useTableActions';
import type { Permission } from 'src/types/permission';
import type { DataTableRef, FilterItem, QTableColumn } from 'src/types/quasarTable';
import TableRowActions from 'src/components/table/TableRowActions.vue';

const tableRef = ref<DataTableRef | null>(null);

const { defaultDelete } = useTableActions({
  confirmTitle: 'İzni Sil',
  confirmMessage: 'Bu izni silmek istiyor musunuz?',
  apiUrl: '/permissions',
  onRefresh: () => {
    tableRef.value?.refresh();
  },
});

const columns: QTableColumn<Permission>[] = [
  {
    name: 'actions',
    label: 'İşlemler',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  { name: 'name', label: 'İzin Adı', field: 'name', align: 'center', sortable: true },
  { name: 'action', label: 'İşlem', field: 'action', align: 'center', sortable: true },
  { name: 'role', label: 'Rol', field: (row) => row.role?.name ?? '—', align: 'center' },
  { name: 'description', label: 'Açıklama', field: 'description', align: 'center' },
  {
    name: 'created_at',
    label: 'Oluşturma Tarihi',
    field: 'created_at',
    align: 'center',
    component: DateCell,
    sortable: true,
  },
];

const columnFilters = ref<FilterItem[]>([
  { type: 'text', key: 'name', label: 'İzin Adı' },
  { type: 'text', key: 'action', label: 'İşlem' },
  { type: 'text', key: 'description', label: 'Açıklama' },
  {
    type: 'component',
    key: 'role_id',
    label: 'Rol',
    component: markRaw(SearchOptions),
    componentProps: {
      multiple: true,
      endpoint: '/roles',
      searchKey: 'name',
    },
  },
]);
</script>
