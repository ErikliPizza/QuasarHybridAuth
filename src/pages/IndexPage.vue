<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="max-width: 800px; width: 100%">
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h5">Auth Store Details</div>
          <q-btn color="primary" icon="refresh" label="Refresh User Info" :loading="loading" @click="refreshUser" />
        </div>
        <pre class="q-pa-md bg-grey-2 rounded-borders" style="overflow-x: auto">{{ authDetails }}</pre>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const $q = useQuasar();
const loading = ref(false);

const authDetails = computed(() => {
  return JSON.stringify(
    {
      isAuthenticated: authStore.isAuthenticated,
      isMobileApp: authStore.isMobileApp,
      user: authStore.user,
      hasToken: !!authStore.token,
      hasTwoFactorEnabled: authStore.hasTwoFactorEnabled,
      displayName: authStore.displayName,
      pendingTwoFactor: authStore.pendingTwoFactor,
    },
    null,
    2,
  );
});

const refreshUser = async () => {
  loading.value = true;
  try {
    await authStore.fetchCurrentUser();
    $q.notify({
      type: 'positive',
      message: 'User information refreshed successfully',
      position: 'top',
    });
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Failed to refresh user information',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
