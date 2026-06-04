<template>
  <div class="q-pa-xs">
    <DataTable ref="tableRef" :columns="columns" :column-filters="columnFilters" initial-sort-by="id"
      :initial-rows-per-page="10" api-url="/roles?include=permissions" title="Roller" table-id="role-table" initial-sort-desc
      create-route="roles.create" create-label="Rol Tanımla">
      <template #actions="{ row }">
        <TableRowActions :row="row" :edit-to="{ name: 'roles.edit', params: { id: row.id } }" @delete-row="defaultDelete" />
      </template>
    </DataTable>

    <q-banner inline-actions rounded class="bg-warning text-grey-8 q-ma-md">
      İzinler, bu role sahip kullanıcıların yetkilerini doğrudan <b class="text-dark">belirlemez</b>; bu rol için <b
        class="text-dark">önerilen izinleri</b> ifade eder.
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'components/table/DataTable.vue';
import DateCell from 'components/table/cells/DateCell.vue';
import { ref } from 'vue';
import { useTableActions } from 'src/composables/table/useTableActions';
import type { Role } from 'src/types/role';
import type { DataTableRef, FilterItem, QTableColumn } from 'src/types/quasarTable';
import ModalCell from 'components/table/cells/ModalCell.vue';
import TableRowActions from 'src/components/table/TableRowActions.vue';

const tableRef = ref<DataTableRef | null>(null);

const { defaultDelete } = useTableActions({
  confirmTitle: 'Rolü Sil',
  confirmMessage: 'Bu rolü silmek istiyor musunuz?',
  apiUrl: '/roles',
  onRefresh: () => {
    tableRef.value?.refresh();
  },
});

const columns: QTableColumn<Role>[] = [
  {
    name: 'actions',
    label: 'İşlemler',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  { name: 'name', label: 'Rol Adı', field: 'name', align: 'center', sortable: true },
  { name: 'description', label: 'Açıklama', field: 'description', align: 'center' },
  { name: 'permissions', label: 'İzinler', field: 'permissions', align: 'center', component: ModalCell },
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
  { type: 'text', key: 'name', label: 'Rol Adı' },
  { type: 'text', key: 'description', label: 'Açıklama' },
]);
</script>
