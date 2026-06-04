<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import ProfileForm from 'src/features/profile/components/ProfileForm.vue';
import {
  createProfileFormData,
  getProfile,
  mapProfileToFormData,
} from 'src/features/profile/forms/formData';
import { useAuthStore } from 'src/stores/auth';
import type { Profile } from 'src/types/profile';
import { onBeforeMount } from 'vue';

const { data: profile, loadData, loading } = useDataFetcher<Profile>(() => getProfile());
const authStore = useAuthStore();

const form = useForm('put', '/profile', createProfileFormData());

onBeforeMount(async () => {
  await loadData();
  form.setData(mapProfileToFormData(profile.value));
});

const submit = () => form.submit().then(() => authStore.fetchCurrentUser());
</script>

<template>
  <CrudCards v-if="!loading" submit-label="Güncelle" :processing="form.processing" @submit="submit" back-to="/profile">
    <ProfileForm v-model="form" @submit="submit" />
  </CrudCards>
</template>
