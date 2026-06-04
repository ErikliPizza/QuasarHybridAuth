<script setup lang="ts">
import BaseTextField from 'src/components/form/BaseTextField.vue';
import SearchOptions from 'src/components/form/SearchOptions.vue';
import type { PermissionFormData } from 'src/types/permission';
import type { mapPermissionToInitialOptions } from 'src/features/permissions/forms/formData';

type PermissionFormModel = PermissionFormData & {
  processing: boolean;
  errors: Partial<Record<keyof PermissionFormData, string>>;
};

const form = defineModel<PermissionFormModel>('modelValue', {
  required: true,
});
const emit = defineEmits<{
  (event: 'submit'): void;
}>();

defineProps<{
  initialOptions?: ReturnType<typeof mapPermissionToInitialOptions> | undefined;
}>();
</script>

<template>
  <q-form class="q-pa-md row q-col-gutter-sm justify-center items-center" @submit.prevent="emit('submit')">
    <BaseTextField class="col-12 col-sm-6" v-model="form.name" label="İzin Adı" :error-message="form.errors.name" />

    <BaseTextField class="col-12 col-sm-6" v-model="form.action" label="İşlem" :error-message="form.errors.action" />

    <SearchOptions class="col-12 col-sm-6" v-model="form.role_id" label="Rol" endpoint="/roles"
      search-key="name" :error-message="form.errors.role_id" :initial-options="initialOptions?.role" />

    <BaseTextField class="col-12" v-model="form.description" label="Açıklama" type="textarea" rows="3"
      :error-message="form.errors.description" />
  </q-form>
</template>
