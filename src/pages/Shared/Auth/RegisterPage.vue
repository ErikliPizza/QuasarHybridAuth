<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, QSpinnerDots } from 'quasar';
import { useAuthStore } from 'src/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref<string>('');
const password = ref<string>('');
const verificationCode = ref<string>('');
const loading = ref<boolean>(false);
const showConfirmation = ref<boolean>(false);
const resendDisabled = ref<boolean>(true);
const timer = ref<number>(180);

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
];

const codeRules = [
  (val: string) => !!val || 'Verification code is required',
  (val: string) => /^[0-9]{6}$/.test(val) || 'Verification code must be 6 digits',
];

// Pre-register function
const preRegister = async (): Promise<void> => {
  loading.value = true;
  try {
    await authStore.preRegister({
      email: email.value,
      password: password.value,
    });
    showConfirmation.value = true;
    startResendTimer();
  } catch (error) {
    console.error('Pre-registration error:', error);
  } finally {
    loading.value = false;
  }
};

// Register function to submit the code and complete the registration
const register = async (): Promise<void> => {
  loading.value = true;
  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      code: verificationCode.value,
    });
    await router.push({ name: 'login' });
  } catch (error) {
    console.error('Registration error:', error);
  } finally {
    loading.value = false;
  }
};

const cancelRegistration = (): void => {
  showConfirmation.value = false;
  verificationCode.value = '';
  Notify.create({
    type: 'info',
    message: 'Registration canceled.',
  });
};

const startResendTimer = (): void => {
  resendDisabled.value = true;
  timer.value = 180;

  const interval = setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      clearInterval(interval);
      resendDisabled.value = false;
    }
  }, 1000);
};
</script>

<template>
  <q-page class="flex flex-center">
    <div class="full-width q-px-md" style="max-width: 600px">
      <!-- Registration Form -->
      <q-form @submit.prevent="showConfirmation ? register() : preRegister()">
        <!-- Email Input -->
        <q-input
          v-model="email"
          label="Email"
          filled
          clearable
          dense
          :readonly="showConfirmation"
        />

        <!-- Password Input -->
        <q-input
          v-model="password"
          label="Password"
          :type="'password'"
          :rules="passwordRules"
          filled
          dense
          :readonly="showConfirmation"
        />

        <!-- Verification Code Input -->
        <q-input
          v-if="showConfirmation"
          v-model="verificationCode"
          label="Verification Code"
          :rules="codeRules"
          filled
          dense
          type="text"
        />

        <!-- Pre-Register / Register Button -->
        <q-btn
          type="submit"
          color="primary"
          :label="showConfirmation ? 'Register' : 'Send Verification Code'"
          :loading="loading"
          unelevated
          class="full-width q-mt-md"
        />

        <!-- Cancel Button for Registration -->
        <q-btn
          v-if="showConfirmation"
          color="negative"
          label="Cancel"
          class="full-width q-mt-sm"
          @click="cancelRegistration"
        />

        <!-- Resend Button -->
        <q-btn
          v-if="showConfirmation"
          color="blue-3"
          :label="`Resend Verification (${timer})`"
          :disabled="resendDisabled"
          class="full-width q-mt-sm"
          @click="preRegister"
        />

        <!-- Cancel Button for Pre-Registration -->
        <q-btn
          v-if="!showConfirmation"
          color="blue-4"
          label="Login"
          class="full-width q-mt-sm"
          :to="{ name: 'login' }"
        />

        <!-- Loading Spinner (Optional) -->
        <div class="flex flex-center">
          <q-spinner-dots v-if="loading" size="lg" color="primary" class="q-mt-md" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
