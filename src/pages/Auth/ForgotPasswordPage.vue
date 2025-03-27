<script setup>
import {ref, computed} from "vue";
import {useAuthStore} from "src/stores/auth";
import {Notify} from "quasar";
import {useRouter} from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const email = ref(""); // Input field for email
const verificationCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const resetCodeRequired = ref(false); // Local state for the reset code requirement

const passwordRules = [
  val => !!val || "Password is required",
  val => val.length >= 8 || "Password must be at least 8 characters",
];

const isResetCodeRequired = computed(() => resetCodeRequired.value);

// Handle password reset request
const handlePasswordReset = async () => {
  loading.value = true;
  try {
    if (resetCodeRequired.value) {
      await verifyCodeAndResetPassword();
    } else {
      await requestPasswordReset();
    }
  } catch (error) {
    console.error("Error processing request:", error);
  } finally {
    loading.value = false;
  }
};

// Request Password Reset
const requestPasswordReset = async () => {
  try {
    await authStore.requestPasswordReset(email.value);
    resetCodeRequired.value = true; // Set to true after a successful request
  } catch (error) {
    console.error("Error requesting password reset:", error);
  }
};

// Verify Code and Reset Password
const verifyCodeAndResetPassword = async () => {
  try {
    await authStore.resetPassword({
      email: email.value,
      verification_code: verificationCode.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    });
    resetCodeRequired.value = false; // Reset state after successful reset
    router.push("/login");
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};

// Cancel Verification Process
const cancelResetProcess = () => {
  resetCodeRequired.value = false; // Reset local state
  verificationCode.value = ""; // Clear verification code input
  newPassword.value = ""; // Clear new password input
  confirmPassword.value = ""; // Clear confirm password input
  Notify.create({
    type: "info",
    message: "Password reset process canceled.",
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
        <q-input
          :readonly="isResetCodeRequired"
          stack-label
          v-model="email"
          label="Email"
          required
          type="email"
          filled
          clearable
          dense
        />

        <!-- Verification Code Input -->
        <q-input
          v-if="isResetCodeRequired"
          class="q-my-sm"
          stack-label
          v-model="verificationCode"
          label="Verification Code"
          type="number"
          filled
          dense
        />

        <!-- New Password Input -->
        <q-input
          v-if="isResetCodeRequired"
          class="q-my-sm"
          stack-label
          v-model="newPassword"
          label="New Password"
          type="password"
          :rules="passwordRules"
          filled
          dense
        />

        <!-- Confirm Password Input -->
        <q-input
          v-if="isResetCodeRequired"
          class="q-my-sm"
          stack-label
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          :rules="passwordRules"
          filled
          dense
        />

        <!-- Request/Reset Button -->
        <q-btn
          type="submit"
          color="primary"
          :label="isResetCodeRequired ? 'Reset Password' : 'Request Password Reset'"
          :loading="loading"
          unelevated
          class="full-width q-mt-md"
        />
        <q-btn
          v-if="!isResetCodeRequired"
          color="negative"
          label="Cancel"
          class="full-width q-mt-sm"
          :to="{name: 'login'}"
        />

        <!-- Cancel Button for Reset Process -->
        <q-btn
          v-if="isResetCodeRequired"
          color="negative"
          label="Cancel"
          class="full-width q-mt-sm"
          @click="cancelResetProcess"
        />
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
