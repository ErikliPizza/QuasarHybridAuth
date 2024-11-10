<template>
  <SettingPageFrame>
    <DynamicFormComponent v-model="form" @submit="handleFormSubmit"/>
  </SettingPageFrame>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getMe, updateEmail, updatePassword, updateTfa, updateUsername} from 'src/services/APIUtils';
import DynamicFormComponent from 'components/DynamicFormComponent.vue';
import SettingPageFrame from "components/Frames/SettingPageFrame.vue";
import {useAuthStore} from "stores/auth";

const auth = useAuthStore();

// Define the form state
const form = ref({
  name: {key: 'name', value: '', label: 'Username', icon: 'edit', type: 'text', pwProtected: false},
  email: {key: 'email', value: '', label: 'Email', icon: 'mail', type: 'email', pwProtected: true},
  password: {key: 'password', value: '', label: 'Password', icon: 'lock', type: 'password', pwProtected: true},
  tfa: {key: 'tfa', value: false, label: 'Two-Factor Authentication', icon: 'security', type: 'toggle', pwProtected: false},
});

// Fetch user information and populate form
onMounted(async () => {
  const user = await getMe();

  form.value.name.value = user.name;
  form.value.email.value = user.email;
  form.value.tfa.value = user.tfa;
});

const handleFormSubmit = async ({ key, data }, resolve) => {
  try {
    switch (key) {
      case 'name':
        await updateUsername(data.value);
        resolve({ success: true });
        break;
      case 'email':
        await updateEmail(data.value, data.password);
        resolve({ success: true });
        break;
      case 'password':
        await updatePassword(data.value, data.password);
        resolve({ success: true });
        break;
      case 'tfa':
        console.log(data.value);
        await updateTfa(data.value);
        resolve({ success: true });
        break;
      default:
        console.error(`Unknown form key: ${key}`);
        resolve({ success: false, error: 'Unknown form key' });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    const serverErrors = error?.response?.data?.errors || {};
    resolve({
      success: false,
      error: error?.response?.data?.message || 'Submission failed',
      errors: serverErrors,
    });
  }  finally {
    await auth.getUser();
  }
};

</script>
