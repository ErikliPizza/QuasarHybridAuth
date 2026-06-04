<script setup lang="ts">
import type { Form } from 'laravel-precognition-vue';
import BaseTextField from 'src/components/form/BaseTextField.vue';
import type { ProfileFormData } from 'src/features/profile/forms/formData';

type ProfileFormModel = ProfileFormData & Form<ProfileFormData>;

const form = defineModel<ProfileFormModel>('modelValue', { required: true });
const emit = defineEmits<{
  (event: 'submit'): void;
}>();
</script>

<template>
  <q-form class="q-pa-md row q-col-gutter-sm justify-center items-center" @submit.prevent="emit('submit')">
    <BaseTextField class="col-12 col-sm-6" v-model="form.name" label="Ad Soyad"
      :error-message="form.errors.name" />

    <BaseTextField class="col-12 col-sm-6" v-model="form.email" label="E-posta" type="email"
      :error-message="form.errors.email" />

    <BaseTextField class="col-12 col-sm-6" v-model="form.phone" label="Telefon" :error-message="form.errors.phone"
      unmasked-value mask="(###) ### - ####" />

    <BaseTextField class="col-12 col-sm-6" v-model="form.password" label="Yeni Şifre" type="password"
      autocomplete="new-password" :error-message="form.errors.password" />
  </q-form>
</template>
