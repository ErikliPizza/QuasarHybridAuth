import { min, required } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';

// Define rules with custom messages
defineRule('required', required);
defineRule('min', min);

const length = 8;

export default {
  rules: {
    required: true,
    min: { length: length },
  },
  messages: {
    required: 'Password is required.',
    min: `Password must be at least ${length} characters long.`,
  },
};
