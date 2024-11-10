<template>
  <q-card flat bordered>
    <!-- Options List with Animation -->
    <q-slide-transition>
      <div v-if="!selectedForm">
        <q-list bordered>
          <q-item
            v-for="(option, index) in model"
            :key="index"
            clickable
            v-ripple
            @click="selectForm(option.key)"
          >
            <q-item-section>{{ option.label }}</q-item-section>
            <q-item-section side>
              <q-icon :name="option.icon" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>

    <!-- Form Transitions -->
    <q-slide-transition v-for="(option, index) in model" :key="'form-' + index">
      <q-form v-if="selectedForm === option.key" @submit.prevent="handleSubmit(option.key)">
        <!-- Handle nested fields or single fields -->
        <q-card-section>
          <template v-if="option.fields">
            <div v-for="(field, fieldKey) in option.fields" :key="fieldKey">
              <FieldRenderer
                :field="field"
                v-model="field.value"
                :error="errors[fieldKey]"
              />
            </div>
          </template>

          <template v-else>
            <FieldRenderer
              :field="option"
              v-model="option.value"
              :error="errors[option.key]"
            />
          </template>
        </q-card-section>

        <q-card-section align="right">
          <q-btn label="Save" type="submit" color="primary" />
          <q-btn label="Back" flat color="secondary" @click="clearSelection" />
        </q-card-section>
      </q-form>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import isEqual from 'lodash/isEqual';
import { cloneDeep } from "lodash";
import { useQuasar } from "quasar";
import { configure, validate } from 'vee-validate';
import { configureValidation } from "src/services/validation/helpers/config";
import FieldRenderer from "components/FieldRenderer.vue";

const $q = useQuasar();

const emit = defineEmits(['submit']);

// Define model prop and other refs
const model = defineModel({ type: Object });
const selectedForm = ref(null);
const initialFormState = ref({});
const password = ref(''); // Store password input
const errors = ref({}); // Store validation errors

// Function to select a form and store the initial state
const selectForm = (key) => {
  selectedForm.value = key;
  initialFormState.value = cloneDeep(model.value); // Deep copy using lodash
  errors.value = {}; // Reset errors when selecting a new form
};

// Function to clear selection after checking for changes
const clearSelection = () => {
  if (!isEqual(initialFormState.value, model.value)) {
    $q.dialog({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Do you really want to go back?',
      persistent: true,
      ok: {
        label: 'Yes',
        color: 'negative'
      },
      cancel: {
        label: 'No',
        color: 'primary'
      }
    }).onOk(() => {
      model.value = cloneDeep(initialFormState.value);
      selectedForm.value = null;
    }).onCancel(() => {
      // Handle the cancel action, if needed
    });
  } else {
    selectedForm.value = null;
  }
};

// Function to prompt for password when needed
const promptPassword = async () => {
  return new Promise((resolve) => {
    $q.dialog({
      title: 'Password Required',
      message: 'Please enter your password to confirm the changes.',
      prompt: {
        model: password,
        type: 'password'
      },
      cancel: true,
      persistent: true
    }).onOk(() => resolve(password.value))
      .onCancel(() => resolve(null));
  });
};

// Handle form submission
const handleSubmit = async (key) => {
  const option = model.value[key];
  let submissionData = { ...option };

  try {
    if (option.multiple) {
      const allValid = await handleMultipleFieldsValidation(option.fields, errors);
      if (!allValid) return; // Exit if any field is invalid
    } else {
      if (!option.skipValidation) {
        const valid = await handleSingleFieldValidation(option.value, key, errors);
        if (!valid) return; // Exit if field is invalid
      }
    }
  } catch (error) {
    console.error(`Validation error for ${key}:`, error);
  }

  // If the field is password protected, prompt for the password
  if (option.pwProtected) {
    const pw = await promptPassword();
    if (!pw) {
      // If the user cancels or doesn't provide a password, do nothing
      return;
    }
    submissionData = { ...option, password: pw };
  }

  const response = await new Promise((resolve) => {
    emit('submit', { key, data: submissionData }, resolve);
  });

  // Handle the response from the parent
  if (response.success) {
    selectedForm.value = null; // Close the form on success
  } else {
    // Clear previous errors
    errors.value = {};

    if (option.multiple && response.errors) {
      // Map server-side errors to individual fields
      for (const fieldKey in response.errors) {
        errors.value[fieldKey] = response.errors[fieldKey][0]; // Assuming errors are arrays
      }
    } else if (response.error) {
      // For single fields or general errors
      errors.value[key] = response.error;
    } else {
      // Default error message
      errors.value[key] = 'An error occurred during submission';
    }
  }
};


async function loadValidationSchema(key) {
  try {
    const validationSchema = (await import(`../services/validation/${key}Validation.js`)).default;
    if (!validationSchema) {
      throw new Error(`No validation schema found for ${key}`);
    }
    return validationSchema;
  } catch (error) {
    console.error(`Failed to load validation schema for ${key}:`, error);
    throw error;
  }
}
async function validateField(value, key) {
  try {
    const validationSchema = await loadValidationSchema(key);
    const { rules, messages } = validationSchema;

    // Configure custom messages for validation
    configure(configureValidation(messages));

    const { valid, errors: validationErrors } = await validate(value, rules);
    return { valid, validationError: valid ? '' : validationErrors[0] };
  } catch (error) {
    return { valid: false, validationError: `Validation failed for ${key}` };
  }
}
async function handleMultipleFieldsValidation(fields, errors) {
  let allValid = true;

  for (const fieldKey in fields) {
    const field = fields[fieldKey];

    // Skip validation if skipValidation is true
    if (field.skipValidation) {
      errors.value[fieldKey] = ''; // Clear any previous errors if skipping validation
      continue;
    }

    const { valid, validationError } = await validateField(field.value, fieldKey);

    if (!valid) {
      allValid = false;
      console.error(validationError);
      errors.value[fieldKey] = validationError; // Set the first validation error for the field
    } else {
      errors.value[fieldKey] = ''; // Clear errors if valid
    }
  }

  return allValid;
}

async function handleSingleFieldValidation(value, key, errors) {
  const { valid, validationError } = await validateField(value, key);
  if (!valid) {
    console.error(validationError);
    errors.value[key] = validationError;
  } else {
    errors.value[key] = ''; // Clear errors if valid
  }
  return valid;
}
</script>
