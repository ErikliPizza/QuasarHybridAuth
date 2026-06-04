<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { getPermissions } from 'src/features/permissions/forms/formData';
import UserForm from 'src/features/users/components/UserForm.vue';
import { createUserFormData } from 'src/features/users/forms/formData';
import type { Permission } from 'src/types/permission';
import { onBeforeMount, ref } from 'vue';
import CrudCards from 'src/components/UI/CrudCards.vue';

const form = useForm('post', '/users', createUserFormData());
const isLast = ref(false);
const { data: permissions, loadData, loading } = useDataFetcher<{ data: Permission[] }>(() => getPermissions());

onBeforeMount(async () => {
  await loadData();
});

const submit = () => form.submit().then(() => form.reset());
</script>

<template>
  <CrudCards v-if="!loading" submit-label="Oluştur" :processing="form.processing" :disable="!isLast" @submit="submit"
    back-to="/users/index">
    <UserForm v-model="form" :permissions="permissions?.data ?? []" v-model:is-last="isLast" @submit="submit" />
  </CrudCards>
</template>
