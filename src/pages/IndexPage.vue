<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />

    <q-card flat bordered class="my-card" v-if="authStore.mobile">
      <q-card-section>
        <div class="text-h6">Info</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-wrap"> Token:{{ token }} </q-card-section>

      <q-separator inset />

      <q-card-section>
        {{ $auth.user?.name }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {useAuthStore} from "stores/auth";

defineOptions({
  name: "IndexPage",
});

const authStore = useAuthStore();
const token = authStore.token;
</script>
<style scoped>
.my-card {
  overflow: hidden;
  padding: 1rem;
}

.text-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
