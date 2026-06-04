<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import { onBeforeMount, ref } from 'vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import PermissionForm from 'src/features/permissions/components/PermissionForm.vue';
import {
  createPermissionFormData,
  getPermission,
  mapPermissionToFormData,
  mapPermissionToInitialOptions,
} from 'src/features/permissions/forms/formData';
import type { Permission } from 'src/types/permission';

const props = defineProps<{
  id: number;
}>();

const { data: permission, loadData } = useDataFetcher<Permission>(() => getPermission(props.id));

const form = useForm('put', `/permissions/${props.id}`, createPermissionFormData());
const initialOptions = ref<ReturnType<typeof mapPermissionToInitialOptions>>();

onBeforeMount(async () => {
  await loadData();
  form.setData(mapPermissionToFormData(permission.value));
  initialOptions.value = mapPermissionToInitialOptions(permission.value);
});

const submit = () => form.submit();
</script>

<template>
  <CrudCards v-if="permission" submit-label="Güncelle" :processing="form.processing" @submit="submit"
    back-to="/authorization/permissions">
    <PermissionForm v-model="form" :initial-options="initialOptions" @submit="submit" />
  </CrudCards>
</template>
