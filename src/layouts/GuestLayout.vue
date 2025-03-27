<template>
  <q-layout view="hHh lpR fFf">
    <!-- Main Content -->
    <q-page-container class="content-container">
      <div class="scrollable-content">
        <router-view />
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup>

defineOptions({
  name: "GuestLayout",
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
