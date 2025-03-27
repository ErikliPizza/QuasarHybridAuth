<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-grey-3 text-grey-8 absolute" v-if="!mobile">
      <q-btn-group spread flat>
        <q-btn class="q-pa-md" :color="leftDrawerOpen ? 'info' : 'grey-8'" flat icon="settings"
          @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-btn flat no-caps class="col" :to="{ name: 'index' }" :color="isActive('index') ? 'primary' : 'grey-8'"
          icon="local_activity" @click="main" />

        <q-btn class="q-pa-md" :color="rightDrawerOpen ? 'info' : 'grey-8'" flat icon="person"
          @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-btn-group>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="shadow-4">
      <q-img class="absolute-top" src="https://picsum.photos/1024/845" style="height: 150px" />

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <DrawerItem v-for="item in leftDrawerItems" :key="item.label" :icon="item.icon" :label="item.label"
            :to="item.to" :color="item.color || 'teal'" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Right Drawer -->
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="shadow-4">
      <q-img class="absolute-top" src="https://picsum.photos/1024/845" style="height: 150px" />

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <!-- Profile item -->
          <ProfileItem :avatar="$auth.user?.gravatar" :name="$auth.user?.name" :email="$auth.user?.email"
            :to="{ name: 'profile-settings' }" />

          <q-separator class="q-my-lg" inset />

          <div class="absolute-bottom">
            <!-- Logout item -->
            <LogoutItem :tfa-enabled="$auth.user?.tfa" @logout="logout" />

            <q-item>
              <q-item-section>
                <q-item-label class="text-caption text-grey-5 ellipsis">
                  {{ platform.userAgent }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="content-container">
      <div class="scrollable-content">
        <router-view />
      </div>
    </q-page-container>

    <!-- Mobile Footer -->
    <q-footer elevated class="bg-grey-3 text-grey-8 absolute" v-if="mobile">
      <q-btn-group spread flat>
        <q-btn class="q-pa-md" flat icon="settings" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-btn class="q-pa-md" flat icon="local_activity" @click="main" />
        <q-btn class="q-pa-md" flat icon="person" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-btn-group>
    </q-footer>
  </q-layout>
</template>

<script setup>
import DrawerItem from "components/layout/DrawerItem.vue";
import LogoutItem from "components/layout/LogoutItem.vue";
import ProfileItem from "components/layout/ProfileItem.vue";
import { Platform } from "quasar";
import { useAuthStore } from "stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "MainLayout",
});

const authStore = useAuthStore();
const router = useRouter();
const platform = Platform;
const mobile = Platform.is.capacitor || Platform.is.cordova;
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

// Left drawer items data
const leftDrawerItems = [
  {
    icon: "people",
    label: "Team",
    to: { name: "team" },
    color: "teal",
  },
  {
    icon: "help",
    label: "Help",
    to: "",
    color: "teal",
  },
];

const isActive = (routeName) => router.currentRoute.value.name === routeName;

const logout = async () => {
  await authStore.logout();
  router.push("/login");
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
  flex: 1;
  overflow-y: auto;
  height: 100%;
}
</style>
