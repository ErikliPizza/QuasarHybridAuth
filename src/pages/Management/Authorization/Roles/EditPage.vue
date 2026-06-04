<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import { onBeforeMount } from 'vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import RoleForm from 'src/features/roles/components/RoleForm.vue';
import { createRoleFormData, getRole, mapRoleToFormData } from 'src/features/roles/forms/formData';
import type { Role } from 'src/types/role';

const props = defineProps<{
  id: number;
}>();

const { data: role, loadData } = useDataFetcher<Role>(() => getRole(props.id));

const form = useForm('put', `/roles/${props.id}`, createRoleFormData());

onBeforeMount(async () => {
  await loadData();
  form.setData(mapRoleToFormData(role.value));
});

const submit = () => form.submit();
</script>

<template>
  <CrudCards v-if="role" submit-label="Güncelle" :processing="form.processing" @submit="submit"
    back-to="/authorization/roles">
    <RoleForm v-model="form" @submit="submit" />
  </CrudCards>
</template>
