import { required, min } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';

// Define rules with custom messages
defineRule('required', required);
defineRule('min', min);

const length = 3;

export default {
  rules: {
    required: true,
    min: { length: length },
  },
  messages: {
    required: 'Name is required.',
    min: `Name must be at least ${length} characters long.`,
  },
};
