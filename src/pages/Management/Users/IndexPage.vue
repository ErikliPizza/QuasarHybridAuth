<template>
  <div class="q-pa-xs">
    <DataTable ref="tableRef" :columns="columns" :column-filters="columnFilters" initial-sort-by="id"
      :initial-rows-per-page="10" api-url="/users?include=role,permissions" title="Kullanıcılar" table-id="user-table" initial-sort-desc
      create-route="users.create" create-label="Kullanıcı Tanımla">
      <template #actions="{ row }">
        <TableRowActions :row="row" @delete-row="defaultDelete">
          <template #default>
            <q-item clickable :to="{ name: 'users.show', params: { id: row.id } }">
              <ActionListItem icon="edit" text="Düzenle" color="primary" />
            </q-item>

            <q-separator />

            <q-item clickable @click="defaultDelete(row)">
              <ActionListItem icon="delete" text="Sil" color="negative" />
            </q-item>
          </template>
        </TableRowActions>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'components/table/DataTable.vue';
import ActionListItem from 'components/table/ActionListItem.vue';
import DateCell from 'components/table/cells/DateCell.vue';
import ModalCell from 'components/table/cells/ModalCell.vue';
import SearchOptions from 'src/components/form/SearchOptions.vue';
import TableRowActions from 'src/components/table/TableRowActions.vue';
import { useTableActions } from 'src/composables/table/useTableActions';
import { statusOptions, tfaOptions } from 'src/constants/enum-options';
import type { DataTableRef, FilterItem, QTableColumn } from 'src/types/quasarTable';
import type { User } from 'src/types/user';
import { markRaw, ref } from 'vue';

const tableRef = ref<DataTableRef | null>(null);

const { defaultDelete } = useTableActions({
  confirmTitle: 'Kullanıcıyı Sil',
  confirmMessage: 'Bu kullanıcıyı silmek istiyor musunuz?',
  apiUrl: '/users',
  onRefresh: () => {
    tableRef.value?.refresh();
  },
});

const columns: QTableColumn<User>[] = [
  {
    name: 'actions',
    label: 'İşlemler',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  { name: 'role', label: 'Unvan', field: row => row.role?.description, align: 'center' },
  { name: 'permissions', label: 'İzinler', field: 'permissions', align: 'center', component: ModalCell },
  { name: 'name', label: 'Ad Soyad', field: 'name', align: 'center', sortable: true },
  { name: 'phone', label: 'Telefon', field: 'phone', align: 'center' },
  { name: 'email', label: 'E-posta', field: 'email', align: 'center' },
  {
    name: 'tfa',
    label: '2FA',
    field: 'tfa',
    align: 'center',
    sortable: true,
    format: val => (val ? 'Açık' : 'Kapalı'),
  },
  {
    name: 'last_login_at',
    label: 'Son Giriş',
    field: 'last_login_at',
    align: 'center',
    component: DateCell,
    sortable: true,
  },
  {
    name: 'status',
    label: 'Durum',
    field: 'status_label',
    align: 'center',
    sortable: true,
  },
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
  {
    type: 'component',
    key: 'role_id',
    label: 'Unvan Seçiniz',
    component: markRaw(SearchOptions),
    componentProps: {
      label: 'Unvanlar',
      endpoint: '/roles',
      searchKey: 'description',
      multiple: true,
    },
  },
  {
    type: 'component',
    key: 'permission_id',
    label: 'İzin Seçiniz',
    component: markRaw(SearchOptions),
    componentProps: {
      label: 'İzinler',
      endpoint: '/permissions',
      searchKey: 'name',
      multiple: true,
    },
  },
  { type: 'text', key: 'name', label: 'Ad Soyad' },
  { type: 'text', key: 'phone', label: 'Telefon', unmaskedValue: true, mask: '(###) ### - ####' },
  { type: 'text', key: 'email', label: 'E-posta' },
  { type: 'select', key: 'tfa', label: '2FA', options: tfaOptions as unknown as object[] },
  { type: 'select', key: 'status', label: 'Durum', options: statusOptions as unknown as object[] },
]);
</script>
