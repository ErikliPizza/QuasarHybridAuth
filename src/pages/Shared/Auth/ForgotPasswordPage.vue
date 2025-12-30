<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import type { QInputProps } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();

// Form state
const email = ref<string>('');
const verificationCode = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const loading = ref<boolean>(false);
const resetCodeRequired = ref<boolean>(false);

const passwordRules: QInputProps['rules'] = [
  (val: string | number | null | undefined) => !!val || 'Password is required',
  (val: string | number | null | undefined) =>
    (typeof val === 'string' && val.length >= 8) || 'Password must be at least 8 characters',
];

const isResetCodeRequired = computed<boolean>(() => resetCodeRequired.value);

// Handle password reset request
const handlePasswordReset = async (): Promise<void> => {
  loading.value = true;
  try {
    if (resetCodeRequired.value) {
      await verifyCodeAndResetPassword();
    } else {
      await requestPasswordReset();
    }
  } catch (error: unknown) {
    console.error('Error processing request:', error);
  } finally {
    loading.value = false;
  }
};

// Request Password Reset
const requestPasswordReset = async (): Promise<void> => {
  try {
    await authStore.requestPasswordReset(email.value);
    resetCodeRequired.value = true;
  } catch (error: unknown) {
    console.error('Error requesting password reset:', error);
  }
};

// Verify Code and Reset Password
const verifyCodeAndResetPassword = async (): Promise<void> => {
  if (newPassword.value !== confirmPassword.value) {
    Notify.create({
      type: 'negative',
      message: 'Passwords do not match.',
    });
    return;
  }

  try {
    // Use the renamed method from the refactored store
    await authStore.completePasswordReset({
      email: email.value,
      verification_code: verificationCode.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    });

    resetCodeRequired.value = false;
    await router.push('/auth/login');
  } catch (error: unknown) {
    console.error('Error resetting password:', error);
  }
};

// Cancel Verification Process
const cancelResetProcess = (): void => {
  resetCodeRequired.value = false;
  verificationCode.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  Notify.create({
    type: 'info',
    message: 'Password reset process canceled.',
  });
};
</script>

<template>
  <q-page class="flex flex-center">
    <!-- Password Reset Content -->
    <div class="full-width q-px-md" style="max-width: 600px">
      <!-- Password Reset Form -->
      <q-form @submit.prevent="handlePasswordReset">
        <!-- Email Input -->
        <q-input :readonly="isResetCodeRequired" stack-label v-model="email" label="Email" required type="email" filled
          clearable dense />

        <!-- Verification Code Input -->
        <q-input v-if="isResetCodeRequired" class="q-my-sm" stack-label v-model="verificationCode"
          label="Verification Code" type="number" filled dense />

        <!-- New Password Input -->
        <q-input v-if="isResetCodeRequired" class="q-my-sm" stack-label v-model="newPassword" label="New Password"
          type="password" :rules="passwordRules" filled dense />

        <!-- Confirm Password Input -->
        <q-input v-if="isResetCodeRequired" class="q-my-sm" stack-label v-model="confirmPassword"
          label="Confirm Password" type="password" :rules="passwordRules" filled dense />

        <!-- Request/Reset Button -->
        <q-btn type="submit" color="primary" :label="isResetCodeRequired ? 'Reset Password' : 'Request Password Reset'"
          :loading="loading" unelevated class="full-width q-mt-md" />
        <q-btn v-if="!isResetCodeRequired" color="negative" label="Cancel" class="full-width q-mt-sm"
          :to="{ name: 'login' }" />

        <!-- Cancel Button for Reset Process -->
        <q-btn v-if="isResetCodeRequired" color="negative" label="Cancel" class="full-width q-mt-sm"
          @click="cancelResetProcess" />
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
