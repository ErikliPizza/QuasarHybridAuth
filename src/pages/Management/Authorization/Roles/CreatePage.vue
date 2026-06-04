<script setup lang="ts">
import { useForm } from 'laravel-precognition-vue';
import CrudCards from 'src/components/UI/CrudCards.vue';
import RoleForm from 'src/features/roles/components/RoleForm.vue';
import { createRoleFormData } from 'src/features/roles/forms/formData';

const form = useForm('post', '/roles', createRoleFormData());

const submit = () => form.submit().then(() => form.reset());
</script>

<template>
  <CrudCards submit-label="Rol Oluştur" :processing="form.processing" @submit="submit"
    back-to="/authorization/roles">
    <RoleForm v-model="form" @submit="submit" />
  </CrudCards>
</template>
