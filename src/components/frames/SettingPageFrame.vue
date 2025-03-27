<template>
  <div class="flex q-pa-md flex-center " style="height: calc(100vh - 48px)">
    <div class="frame">
      <slot/>
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  max-width: 1200px; /* Default max width for desktop */
}

/* Responsive max-width adjustments */
@media (max-width: 1200px) {
  .frame {
    max-width: 1000px;
  }
}

@media (max-width: 768px) {
  .frame {
    max-width: 600px;
  }
}
</style>
