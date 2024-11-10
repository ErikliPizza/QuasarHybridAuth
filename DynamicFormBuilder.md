# Dynamic Form Builder Pattern

## Overview

The **Dynamic Form Builder** provides a flexible approach for creating dynamic forms in Vue3 using Quasar. You define the structure of the form using a configuration object, enabling you to handle various field types and validation without hardcoding.

### Key Features:
- **Dynamic Rendering**: Forms are built from a configuration object.
- **Component Flexibility**: Supports standard inputs and custom components.
- **Password Protection**: Secure sensitive fields by prompting for passwords.
- **Validation**: Apply validation dynamically using external schemas.

---

## Form Structure

The form structure is defined using an object, where each key represents a form field. Below is an example structure and an explanation of its features.

### Example:
```js
const form = ref({
  name: { key: 'name', value: '', label: 'Organization Name', icon: 'edit', inputType: 'text', pwProtected: false },
  email: { key: 'email', value: '', label: 'Email', icon: 'mail', inputType: 'email', pwProtected: false },
  location: {
    multiple: true,
    key: 'locationGroup',
    label: 'Location Info',
    icon: 'map',
    fields: {
      address: { key: 'address', value: '', label: 'Street Address', inputType: 'text', pwProtected: false },
      coordinates: { key: 'coordinates', value: { lat: '', lng: '' }, component: markRaw(MapComponent), skipValidation: true }
    }
  }
});
```

### Structure Features:

| **Property**    | **Description**                                                            |
| --------------- |----------------------------------------------------------------------------|
| `key`           | Unique identifier for the form field.                                      |
| `value`         | Holds the current input value of the field.                                |
| `label`         | The label shown for the field.                                             |
| `inputType`     | Defines the input type (e.g., `text`, `email`).                            |
| `icon`          | The Quasar icon associated with the field. (Currently using Material Icon) |
| `pwProtected`   | If `true`, the field requires password confirmation before submitting.     |
| `component`     | Custom Vue component to render, instead of standard inputs.                |
| `multiple`      | Indicates the field contains nested fields (`fields`).                     |
| `fields`        | Nested fields inside a group.                                              |
| `skipValidation`| Skips validation for this field if `true`.                                 |


### How to Create a Form

### Basic Form
To create a simple form with text inputs:
```js
const form = ref({
  name: { key: 'name', value: '', label: 'Organization Name', inputType: 'text' },
  email: { key: 'email', value: '', label: 'Email Address', inputType: 'email' }
});
````
### Adding Custom Components
You can add custom components, like a map picker:
```js
const form = ref({
  location: { key: 'location', value: { lat: '', lng: '' }, label: 'Location', component: markRaw(MapComponent) }
});
```
### Nested Fields
To handle sections with multiple related fields:
```js
const form = ref({
  locationGroup: {
    key: 'locationGroup',
    label: 'Location Info',
    multiple: true,
    fields: {
      address: { key: 'address', value: '', label: 'Street Address', inputType: 'text' },
      coordinates: { key: 'coordinates', value: { lat: '', lng: '' }, component: markRaw(MapComponent) }
    }
  }
});
```

## Usage Example

In your parent component, you can use the `DynamicFormComponent` to render and handle form submissions:

```vue

<template>
  <DynamicFormComponent v-model="form" @submit="handleFormSubmit"/>
</template>

<script setup>
  import {onMounted, ref} from 'vue';
  import {getMe} from 'src/services/APIUtils';
  import DynamicFormComponent from 'components/DynamicFormBuilder/DynamicFormComponent.vue';
  import {updateEmail, updateUsername} from 'src/services/APIUtils';

  const form = ref({
    name: {key: 'name', value: '', label: 'User Name', inputType: 'text'},
    email: {key: 'email', value: '', label: 'Email Address', inputType: 'email', pwProtected: true}
  });

  onMounted(async () => {
    const user = await getMe();
    form.value.name.value = user.name;
    form.value.email.value = user.email;
  });

  const handleFormSubmit = async ({key, data}, resolve) => {
    try {
      switch (key) {
        case 'name':
          await updateUsername(data.value);
          resolve({success: true});
          break;
        case 'email':
          await updateEmail(data.value, data.password);
          resolve({success: true});
          break;
        default:
          console.error(`Unknown form key: ${key}`);
          resolve({success: false, error: 'Unknown form key'});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      resolve({success: false, error: error.response.data.message || 'Submission failed'});
    }
  };
</script>
```

## Conclusion

The **Dynamic Form Builder Pattern** simplifies the process of creating and managing dynamic forms, allowing you to scale forms without repetitive code. It provides flexibility, validation, and customization in an organized way.
