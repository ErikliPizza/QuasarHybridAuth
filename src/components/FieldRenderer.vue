<template>
  <div class="">
    <!-- Handle dynamic component rendering -->
    <component
      :class="field.style ?? 'q-pa-none'"
      v-if="field.component"
      :is="field.component"
      v-model="model"
      v-bind="field.props"
      :error="error"
    ></component>

    <!-- Handle select input type -->
    <q-select
      :class="field.style ?? 'q-pa-none'"
      v-else-if="field.type === 'select'"
      v-model="model"
      :label="field.label"
      :options="field.options || []"
      outlined
      dense
      map-options
      emit-value
      :error="!!error"
      :error-message="error"
    />

    <!-- Handle standard input fields if no component is provided -->
    <q-input
      :class="field.style ?? 'q-pa-none'"
      v-else-if="field.type !== 'toggle'"
      v-model="model"
      :label="field.label"
      outlined
      dense
      :error="!!error"
      :error-message="error"
      :type="field.type"
      :mask="field.mask"
      fill-mask
    >
      <template v-slot:prepend v-if="field.prependIcon">
        <q-icon :name="field.prependIcon" />
      </template>
    </q-input>

    <q-toggle
      :class="field.style ?? 'q-pa-none'"
      v-else
      v-model="model"
      :label="field.label"
      :error="!!error"
      :error-message="error"
    />
  </div>
</template>

<script setup>
const model = defineModel({ type: [Object, String, Array, Boolean] });

defineProps({
  field: Object,  // Pass the entire field object
  error: String,
});
</script>
