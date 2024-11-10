<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white absolute" v-if="!mobile">
      <q-tabs
        align="justify"
        v-model="tab"
        no-caps
        active-color="primary"
        class="bg-grey-3 text-grey-8"
      >
        <q-tab name="drawer-left" icon="settings" @click="toggleLeftDrawer"/>
        <q-tab name="index" icon="local_activity" @click="main"/>
        <q-tab name="drawer-right" icon="person" @click="toggleRightDrawer"/>
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="shadow-4">
      <q-img class="absolute-top" src="https://picsum.photos/1024/845" style="height: 150px" />

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item class="q-my-sm" clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="help" color="teal" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Help</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="shadow-4">
      <q-img class="absolute-top" src="https://picsum.photos/1024/845" style="height: 150px" />

      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>

          <q-item class="q-my-sm" clickable v-ripple :to="{name: 'profile-settings'}">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <img :src="$auth.user?.gravatar" alt="avatar">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ $auth.user?.name }}</q-item-label>
              <q-item-label caption lines="1">{{ $auth.user?.email }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="manage_accounts" color="primary" />
            </q-item-section>
          </q-item>

          <q-separator class="q-my-lg" inset />

          <div class="absolute-bottom">
            <q-item clickable v-ripple @click="logout">
              <q-item-section avatar top>
                <q-avatar icon="logout" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label caption>
                  2FA is
                  <span class="text-capitalize text-green" v-if="$auth.user?.tfa">ON</span>
                  <span class="text-capitalize text-red" v-else>OFF</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" color="red" />
                <q-tooltip anchor="center left" self="center right">
                  Two-Factor Authentication
                </q-tooltip>
              </q-item-section>
            </q-item>

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

    <q-footer v-if="mobile">
      <q-tabs
        v-model="tab"
        no-caps
        active-color="primary"
        class="bg-grey-3 text-grey-8"
      >
        <q-tab name="drawer-left" icon="settings" @click="toggleLeftDrawer"/>
        <q-tab name="index" icon="local_activity" @click="main"/>
        <q-tab name="drawer-right" icon="person" @click="toggleRightDrawer"/>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {useAuthStore} from "stores/auth";
import {Platform} from "quasar";

defineOptions({
  name: "MainLayout",
});
onMounted( () => {
  if (!mobile) {
    leftDrawerOpen.value = false;
    rightDrawerOpen.value = false;
  }
})

const authStore = useAuthStore();

const router = useRouter();
const platform = Platform;
const mobile = Platform.is.capacitor || Platform.is.cordova; // do not use authStore.mobile, that also check for the "electron" which is a desktop app.
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const route = useRoute();
const tab = ref(route.name ?? 'index');

const toggleLeftDrawer = () => {
  if (route.name === 'index') {
    tab.value = 'index';
  } else {
    tab.value = '';
  }
  rightDrawerOpen.value = false;
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const toggleRightDrawer = () => {
  if (route.name === 'index') {
    tab.value = 'index';
  } else {
    tab.value = '';
  }
  leftDrawerOpen.value = false;
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

const main = () => {
  router.push({name: 'index'});
}
const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

watch(() => route.name, () => {
  tab.value = route.name;
});
</script>

<style>
.content-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Fill the available viewport height */
  overflow: hidden; /* Prevent the entire page from scrolling */
}

/* Make only the main content area scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto; /* Enable vertical scrolling */
  height: 100%;
}
</style>
