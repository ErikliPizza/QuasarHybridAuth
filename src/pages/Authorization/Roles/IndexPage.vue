<template>
  <div class="q-pa-md">
    <DataTable
      ref="tableRef"
      :columns="columns"
      :column-filters="columnFilters"
      initial-sort-by="id"
      :initial-rows-per-page="10"
      api-url="/roles"
      title="Roles"
      table-id="role-table"
      initial-sort-desc
    >
      <template #actions="{ row }">
        <q-btn flat round dense icon="more_vert">
          <q-menu auto-close anchor="top right" class="bg-dark">
            <q-list style="min-width: 150px" class="text-white">
              <q-item clickable @click="permissions(row)">
                <ActionListItem icon="security" text="Permissions" />
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
import type { Role } from 'src/types/role';
import type { QTableColumn } from 'quasar';
import { ref } from 'vue';
import type { FilterItem } from 'src/types/QuasarTable';
import { useRouter } from 'vue-router';
import ActionListItem from 'components/table/ActionListItem.vue';
import { formatDate } from 'src/utils/formatters';

const router = useRouter();

const columns: QTableColumn<Role>[] = [
  {
    name: 'actions',
    label: 'Actions',
    field: () => null,
    align: 'center',
    sortable: false,
  },
  { name: 'name', label: 'Name', field: 'name', align: 'center' },
  {
    name: 'created_at',
    label: 'Created At',
    field: 'created_at',
    align: 'center',
    format: (val) => formatDate(val),
  },
];

const columnFilters = ref<FilterItem[]>([{ type: 'text', key: 'name', label: 'Name' }]);

function permissions(row: Role) {
  void router.push({
    name: 'roles.permissions',
    params: { id: row.id },
  });
}
</script>
