<script setup lang="ts">
import BaseTextField from 'src/components/form/BaseTextField.vue';
import type { RoleFormData } from 'src/types/role';

type RoleFormModel = RoleFormData & {
  processing: boolean;
  errors: Partial<Record<keyof RoleFormData, string>>;
};

const form = defineModel<RoleFormModel>('modelValue', {
  required: true,
});
const emit = defineEmits<{
  (event: 'submit'): void;
}>();
</script>

<template>
  <q-form class="q-pa-md row q-col-gutter-sm justify-center items-center" @submit.prevent="emit('submit')">
    <BaseTextField class="col-12 col-sm-6" v-model="form.name" label="Rol Adı" :error-message="form.errors.name" />

    <BaseTextField class="col-12 col-sm-6" v-model="form.description" label="Açıklama" type="textarea" rows="3"
      :error-message="form.errors.description" />
  </q-form>
</template>
