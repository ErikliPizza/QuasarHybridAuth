<template>
  <q-layout view="hHh lpR fFf">
    <q-ajax-bar position="bottom" color="primary" size="10px" skip-hijack ref="loadingBar" />
    <!-- Header -->
    <q-header elevated class="bg-grey-3 text-grey-8 absolute" v-if="!mobile">
      <q-btn-group spread flat>
        <q-btn class="q-pa-md" :color="leftDrawerOpen ? 'info' : 'grey-8'" flat icon="settings"
          @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-btn flat no-caps class="col" :to="{ name: 'index' }" :color="isActive('index') ? 'primary' : 'grey-8'"
          icon="local_activity" />

        <q-btn class="q-pa-md" :color="rightDrawerOpen ? 'info' : 'grey-8'" flat icon="person"
          @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-btn-group>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <div class="q-pa-md bg-primary text-white">
          <div class="text-h6 text-weight-bold">Navigation</div>
          <div class="text-caption text-grey-2">Menu</div>
        </div>

        <q-separator />

        <NavigationMenu />
      </q-scroll-area>
    </q-drawer>

    <!-- Right Drawer -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered class="column">
      <div class="q-pa-md bg-primary text-white">
        <div class="text-h6 text-weight-bold">Profile</div>
        <div class="text-caption text-grey-2">Account Settings</div>
      </div>

      <q-separator />

      <q-scroll-area class="col">
        <q-list padding>
          <ProfileItem :avatar="authStore.user?.gravatar ?? ''" :name="authStore.user?.name ?? ''"
            :email="authStore.user?.email ?? ''" :to="{ name: 'profile' }" />

          <q-separator class="q-my-md" />
        </q-list>

        <NavigationMenu variant="profile" />
      </q-scroll-area>

      <LogoutItem :tfa-enabled="authStore.user?.tfa ?? false" @logout="logout" />

      <q-separator />

      <q-item class="q-pa-sm">
        <q-item-section>
          <q-item-label class="text-caption text-grey-6">
            {{ platform.userAgent }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="content-container" style="background-color: #f8f2f5">
      <q-page padding>
        <q-card class="shadow-12 scrollable-content">
          <router-view />
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Mobile Footer -->
    <q-footer elevated class="bg-grey-3 text-grey-8 absolute" v-if="mobile">
      <q-btn-group spread flat>
        <q-btn class="q-pa-md" flat icon="settings" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-btn class="q-pa-md" flat icon="local_activity" />
        <q-btn class="q-pa-md" flat icon="person" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-btn-group>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import LogoutItem from 'components/layouts/Partials/LogoutItem.vue';
import ProfileItem from 'components/layouts/Partials/ProfileItem.vue';
import NavigationMenu from 'components/layouts/Partials/NavigationMenu.vue';
import { Platform } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { ref, provide } from 'vue';
import { useRouter } from 'vue-router';
import type { QAjaxBar } from 'quasar';

defineOptions({
  name: 'MainLayout',
});

const authStore = useAuthStore();
const router = useRouter();
const platform = Platform;
const mobile = Platform.is.mobile;
const leftDrawerOpen = ref<boolean>(false);
const rightDrawerOpen = ref<boolean>(false);
const loadingBar = ref<QAjaxBar | null>(null);

// Provide the loading bar ref
provide('loadingBar', loadingBar);

const isActive = (routeName: string): boolean => router.currentRoute.value.name === routeName;

const logout = async (): Promise<void> => {
  await authStore.logout();
  await router.push({ name: 'login' });
};
</script>

<style>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.scrollable-content {
  overflow-y: auto;
  height: 90vh !important;
}
</style>
