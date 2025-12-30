<script setup lang="ts">
import { ref } from 'vue';
import { FormKit, FormKitSchema } from '@formkit/vue';
import { addDepartment, type CreateDepartmentPayload } from 'src/services/requests/department';
import type { Department } from 'src/types/department';
import type { FormKitNode } from '@formkit/core';
import { departmentSchema } from 'src/schemas/department';

const formData = ref<CreateDepartmentPayload>({
  name: '',
  description: '',
});

const handleSubmit = async (data: Department, node: FormKitNode) => {
  try {
    await addDepartment(data);
    node.reset();
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <q-page padding>
    <q-page-container>
      <q-card class="q-pa-lg" flat bordered>
        <q-card-section class="text-h6 text-center"> Create Department </q-card-section>
        <q-separator />
        <q-card-section>
          <FormKit
            type="form"
            v-model="formData"
            submit-label="Send"
            @submit="handleSubmit"
          >
            <div class="formkit-grid-layout">
              <FormKitSchema :schema="departmentSchema" />
            </div>
          </FormKit>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-page>
</template>
