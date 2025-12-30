<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import type { QInputProps } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();

// Form state
const email = ref<string>('test@example.com');
const password = ref<string>('password');
const twoFactorCode = ref<string>('');
const loading = ref<boolean>(false);
const isPwd = ref<boolean>(true);

// Use the reactive state from the refactored store
const pendingTwoFactor = computed<boolean>(() => authStore.pendingTwoFactor);

const passwordRules: QInputProps['rules'] = [
  (val: string | number | null | undefined) => !!val || 'Password is required',
];

const login = async (): Promise<void> => {
  loading.value = true;
  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value,
    });

    // If 2FA is required, the UI will update via pendingTwoFactor computed
    if (result.requiresTwoFactor) {
      return;
    }

    // Login successful - redirect to home
    if (result.success) {
      await router.push('/');
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
  } finally {
    loading.value = false;
  }
};

const verifyTwoFactor = async (): Promise<void> => {
  loading.value = true;
  try {
    // The new method only needs the 2FA code - credentials are stored in the store
    await authStore.completeTwoFactorAuth(twoFactorCode.value);

    if (authStore.isAuthenticated) {
      await router.push('/');
    }
  } catch (error: unknown) {
    console.error('2FA verification error:', error);
    // Don't clear the code - allow retry
  } finally {
    loading.value = false;
  }
};

// Cancel Two-Factor Authentication Process
const cancelTwoFactor = (): void => {
  authStore.cancelTwoFactorAuth();
  twoFactorCode.value = '';
  Notify.create({
    type: 'info',
    message: 'Two-factor authentication canceled.',
  });
};
</script>

<template>
  <q-page class="flex flex-center">
    <!-- Login Content -->
    <div class="full-width q-px-md" style="max-width: 600px">
      <!-- Login Form -->
      <q-form @submit.prevent="pendingTwoFactor ? verifyTwoFactor() : login()">
        <!-- Email Input -->
        <q-input :readonly="pendingTwoFactor" stack-label v-model="email" label="Email" required type="email" filled
          clearable dense />

        <!-- Password Input -->
        <q-input v-if="!pendingTwoFactor" class="q-my-sm" stack-label v-model="password" label="Password"
          :type="isPwd ? 'password' : 'text'" :rules="passwordRules" filled dense>
          <template v-slot:append>
            <q-icon v-show="password" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="isPwd = !isPwd" />
          </template>
        </q-input>

        <!-- Two-Factor Authentication Input -->
        <q-input v-if="pendingTwoFactor" class="q-my-sm" stack-label v-model="twoFactorCode" label="Two-Factor Code"
          type="number" filled dense />

        <!-- Forgot Password Button -->
        <div class="flex justify-around">
          <div class="text-right q-mb-md">
            <q-btn v-if="!pendingTwoFactor" flat color="primary" label="Forgot Password?"
              :to="{ name: 'forgot-password' }" />
          </div>
          <div class="text-right q-mb-md">
            <q-btn v-if="!pendingTwoFactor" flat color="primary" label="Register" :to="{ name: 'register' }" />
          </div>
        </div>

        <!-- Login/Verify Button -->
        <q-btn type="submit" color="primary" :label="pendingTwoFactor ? 'Verify Code' : 'Login'" :loading="loading"
          unelevated class="full-width q-mt-md" />

        <!-- Cancel Button for 2FA -->
        <q-btn v-if="pendingTwoFactor" color="negative" label="Cancel" class="full-width q-mt-sm"
          @click="cancelTwoFactor" />
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
