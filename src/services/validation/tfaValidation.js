import { defineRule } from 'vee-validate';

// Define a custom rule that allows both true and false as valid values
defineRule('requiredToggle', (value) => {
  // If the value is false, true, or not undefined/null, it's valid
  if (value === true || value === false) {
    return true;
  }

  // Otherwise, trigger the validation error
  return 'Two-factor authentication is required.';
});

export default {
  rules: {
    requiredToggle: true,
  },
  messages: {
    requiredToggle: 'Two-factor authentication is required.',
  },
};
