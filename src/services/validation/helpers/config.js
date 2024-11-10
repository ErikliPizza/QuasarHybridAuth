export function configureValidation(messages = {}) {
  return {
    generateMessage: (context) => {
      // Attempt to get the custom message based on the rule name
      const message = messages[context.rule.name];

      // Return the message if it exists, or a default fallback
      return message || `The field ${context.field} is invalid`;
    }
  };
}
