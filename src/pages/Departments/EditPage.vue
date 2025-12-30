<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FormKit, FormKitSchema } from '@formkit/vue';
import type { FormKitNode } from '@formkit/core';
import { departmentSchema } from 'src/schemas/department';
import {
  getDepartment,
  updateDepartment,
  type UpdateDepartmentPayload,
} from 'src/services/requests/department';
import type { Department } from 'src/types/department';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { mapFields } from 'src/utils/mappers';

const props = defineProps<{ id: number }>();
const router = useRouter();

const formData = ref<UpdateDepartmentPayload>({});

const { data: department, loadData } = useDataFetcher<Department>(() => getDepartment(props.id));

onMounted(async () => {
  await loadData();
  if (department.value) {
    formData.value = mapFields(['name', 'description'], department.value);
  }
});

const handleSubmit = async (data: Department, node: FormKitNode) => {
  try {
    await updateDepartment(props.id, data);
    node.reset(data);
    router.back();
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <q-page padding>
    <q-page-container>
      <q-card class="q-pa-lg" flat bordered>
        <q-card-section class="text-h6 text-center"> Edit Department </q-card-section>
        <q-separator />
        <q-card-section>
          <FormKit
            type="form"
            v-model="formData"
            submit-label="Send"
            @submit="handleSubmit"
          >
            <FormKitSchema :schema="departmentSchema" />
          </FormKit>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-page>
</template>
