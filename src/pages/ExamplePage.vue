<script setup lang="ts">
import { ref } from 'vue';
import type { FilterItem, QTableColumn } from 'src/types/QuasarTable';
import DataTable from 'components/table/DataTable.vue';

interface Dessert {
  id: string | number;
  name: string | number;
  calories: string | number;
  fat: string | number;
  carbs: string | number;
  protein: string | number;
  sodium: string | number;
  calcium: string | number;
  iron?: string | number;
}

const columns: QTableColumn<Dessert>[] = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  {
    name: 'name',
    label: 'Dessert (100g serving)',
    align: 'center',
    field: row => row.name,
    format: (val: unknown) => `${val as string | number}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true }
];

const columnFilters = ref<FilterItem[]>([
  { type: 'text', key: 'name', label: 'Full Name' },
  { type: 'text', key: 'calories', label: 'Calories' },
  {
    type: 'select',
    key: 'test',
    label: 'Test',
    options: [
      {
        label: 'Yüz',
        value: '100',
      },
      {
        label: 'İkiyüz',
        value: '200',
      },
    ],
  },
]);
</script>

<template>
  <div class="q-pa-md">
    <DataTable enable-selection="multiple" :columns="columns" :column-filters="columnFilters" initial-sort-by="id"
      :initial-sort-desc="false" :initial-rows-per-page="10" api-url="/treats" title="Treats"
      table-id="example-table" />
  </div>
</template>
