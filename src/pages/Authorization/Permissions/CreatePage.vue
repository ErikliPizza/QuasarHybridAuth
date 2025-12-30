<script setup lang="ts">
import { ref } from 'vue';
import { FormKit, FormKitSchema } from '@formkit/vue';
import type { FormKitNode } from '@formkit/core';
import { permissionSchema } from 'src/schemas/permission';
import type { Permission } from 'src/types/permission';
import { addPermission, type CreatePermissionPayload } from 'src/services/requests/permission';

const formData = ref<CreatePermissionPayload>({
  name: '',
  description: '',
});

const handleSubmit = async (data: Permission, node: FormKitNode) => {
  try {
    await addPermission(data);
    node.reset();
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg" flat bordered style="max-width: 800px; margin: auto">
      <q-card-section class="text-h6 text-center"> Create New Permission </q-card-section>
      <q-separator />
      <q-card-section>
        <FormKit type="form" v-model="formData" @submit="handleSubmit" submit-label="Send">
          <div class="formkit-grid-layout">
            <FormKitSchema :schema="permissionSchema" />
          </div>
        </FormKit>
      </q-card-section>
    </q-card>
  </q-page>
</template>
