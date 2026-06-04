<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import PermissionForm from 'src/features/permissions/components/PermissionForm.vue';
import { createPermissionFormData } from 'src/features/permissions/forms/formData';

const form = useForm('post', '/permissions', createPermissionFormData());

const submit = () => form.submit().then(() => form.reset());
</script>

<template>
  <CrudCards submit-label="İzin Oluştur" :processing="form.processing" @submit="submit"
    back-to="/authorization/permissions">
    <PermissionForm v-model="form" @submit="submit" />
  </CrudCards>
</template>
