/**
 * Maps specified fields from a source object to a new object
 *
 * @param fields - Array of field names (keys) to extract from source
 * @param source - Source object to extract fields from
 * @returns New object containing only the specified fields
 *
 * @example
 * const profile = { id: 1, name: 'John', email: 'john@example.com', tfa: true };
 * const formData = mapFields(['name', 'email', 'tfa'], profile);
 * // Result: { name: 'John', email: 'john@example.com', tfa: true }
 */
export function mapFields<T extends Record<string, unknown>, K extends keyof T>(
  fields: K[],
  source: T,
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  fields.forEach((field) => {
    if (field in source) {
      result[field] = source[field];
    }
  });

  return result;
}
