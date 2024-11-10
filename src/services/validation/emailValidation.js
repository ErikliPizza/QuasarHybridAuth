import { email, required } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';

// Define rules with custom messages
defineRule('required', required);
defineRule('email', email);

export default {
  rules: {
    required: true,
    email: true,
  },
  messages: {
    required: 'Email is required.',
    email: 'Please enter a valid email address.',
  },
};
