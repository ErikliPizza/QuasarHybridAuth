<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {Notify, QSpinnerDots} from "quasar";
import {api} from "boot/axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const verificationCode = ref("");
const loading = ref(false);
const showConfirmation = ref(false); // Show confirmation section after pre-registration


const passwordRules = [
  val => !!val || "Password is required",
  val => val.length >= 8 || "Password must be at least 8 characters",
];
const codeRules = [
  val => !!val || "Verification code is required",
  val => /^[0-9]{6}$/.test(val) || "Verification code must be 6 digits",
];

// Pre-register function
const preRegister = async () => {
  loading.value = true;
  try {
    await api.post("/auth/preregister", {
      email: email.value,
      password: password.value,
    });
    showConfirmation.value = true;
    startResendTimer();
  } catch (error) {
    console.error("Pre-registration error:", error);
  } finally {
    loading.value = false;
  }
};

// Register function to submit the code and complete the registration
const register = async () => {
  loading.value = true;
  try {
    await api.post("/auth/register", {
      email: email.value,
      password: password.value,
      code: verificationCode.value,
    });

    router.push("/login");
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
};

const cancelRegistration = () => {
  showConfirmation.value = false;
  verificationCode.value = ""; // Clear 2FA code input
  Notify.create({
    type: "info",
    message: "Registration canceled.",
  });
};

const resendDisabled = ref(true); // Manage the disabled state of the resend button
const timer = ref(180); // Countdown timer in seconds
const startResendTimer = () => {
  resendDisabled.value = true;
  timer.value = 180; // Reset the timer to 60 seconds

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
          :to="{name: 'login'}"
        />

        <!-- Loading Spinner (Optional) -->
        <div class="flex flex-center">
          <q-spinner-dots v-if="loading" size="lg" color="primary" class="q-mt-md"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
