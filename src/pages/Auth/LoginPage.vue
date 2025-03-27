<script setup>
import {computed, ref} from "vue";
import {useAuthStore} from "src/stores/auth";
import {useRouter} from "vue-router";
import {Notify} from "quasar";

const router = useRouter();
const authStore = useAuthStore();
const email = ref("test@example.com"); // Unified input for email - //todo delete mock data
const password = ref("password");
const twoFactorCode = ref(""); // Ref for 2FA code
const loading = ref(false);
const isPwd = ref(true);

// Use the reactive state directly from the store
const twoFactorRequired = computed(() => authStore.twoFactorRequired); // Computed to track store state

const passwordRules = [
  val => !!val || "Password is required",
  val => val.length >= 8 || "Password must be at least 8 characters",
];

const login = async () => {
  loading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    if (authStore.isAuthenticated) {
      router.push("/");
    }
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};

const verifyTwoFactor = async () => {
  loading.value = true;
  try {
    await authStore.verifyTwoFactor({
      email: email.value,
      two_factor_code: twoFactorCode.value,
    });
    if (authStore.isAuthenticated) {
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// Cancel Two-Factor Authentication Process
const cancelTwoFactor = () => {
  authStore.twoFactorRequired = false; // Reset 2FA state in the store
  twoFactorCode.value = ""; // Clear 2FA code input
  Notify.create({
    type: "info",
    message: "Two-factor authentication canceled.",
  });
};
</script>

<template>
  <q-page class="flex flex-center">
    <!-- Login Content -->
    <div class="full-width q-px-md" style="max-width: 600px">
      <!-- Login Form -->
      <q-form @submit.prevent="twoFactorRequired ? verifyTwoFactor() : login()">
        <!-- Email Input -->
        <q-input
          :readonly="twoFactorRequired"
          stack-label
          v-model="email"
          label="Email"
          required
          type="email"
          filled
          clearable
          dense
        />

        <!-- Password Input -->
        <q-input
          v-if="!twoFactorRequired"
          class="q-my-sm"
          stack-label
          v-model="password"
          label="Password"
          :type="isPwd ? 'password' : 'text'"
          :rules="passwordRules"
          filled
          dense
        >
          <template v-slot:append>
            <q-icon
              v-show="password"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <!-- Two-Factor Authentication Input -->
        <q-input
          v-if="twoFactorRequired"
          class="q-my-sm"
          stack-label
          v-model="twoFactorCode"
          label="Two-Factor Code"
          type="number"
          filled
          dense
        />
        <!-- Forgot Password Button -->
        <div class="flex justify-around">
          <div class="text-right q-mb-md">
            <q-btn
              flat
              color="primary"
              label="Forgot Password?"
              :to="{name: 'forgot-password'}"
              v-if="!twoFactorRequired"
            />
          </div>
          <div class="text-right q-mb-md">
            <q-btn
              flat
              color="primary"
              label="Register"
              :to="{name: 'register'}"
              v-if="!twoFactorRequired"
            />
          </div>
        </div>

        <!-- Login/Verify Button -->
        <q-btn
          type="submit"
          color="primary"
          :label="twoFactorRequired ? 'Verify Code' : 'Login'"
          :loading="loading"
          unelevated
          class="full-width q-mt-md"
        />

        <!-- Cancel Button for 2FA -->
        <q-btn
          v-if="twoFactorRequired"
          color="negative"
          label="Cancel"
          class="full-width q-mt-sm"
          @click="cancelTwoFactor"
        />
      </q-form>
    </div>
  </q-page>
</template>

<style scoped></style>
