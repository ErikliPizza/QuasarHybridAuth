<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { getPermissions } from 'src/features/permissions/forms/formData';
import UserForm from 'src/features/users/components/UserForm.vue';
import { createUserFormData, getUser, mapUserToFormData, mapUserToInitialOptions } from 'src/features/users/forms/formData';
import type { Permission } from 'src/types/permission';
import type { User } from 'src/types/user';
import { onBeforeMount, ref } from 'vue';

const props = defineProps<{
  id: number;
}>();

const { data: user, loadData, loading } = useDataFetcher<User>(() => getUser(props.id));
const { data: permissions, loadData: loadPermissions, loading: loadingPermissions } = useDataFetcher<{ data: Permission[] }>(() => getPermissions());

const form = useForm('put', `/users/${props.id}`, createUserFormData());
const initialOptions = ref<ReturnType<typeof mapUserToInitialOptions>>();
const isLast = ref(false);

onBeforeMount(async () => {
  await loadData();
  await loadPermissions();
  form.setData(mapUserToFormData(user.value));
  initialOptions.value = mapUserToInitialOptions(user.value);
});

const submit = () => form.submit();
</script>

<template>
  <CrudCards v-if="!loading && !loadingPermissions" submit-label="Güncelle" :processing="form.processing"
    :disable="!isLast" @submit="submit" back-to="/users/index">
    <UserForm v-model="form" :initial-options="initialOptions" :permissions="permissions?.data ?? []"
      v-model:is-last="isLast" @submit="submit" />
  </CrudCards>
</template>
