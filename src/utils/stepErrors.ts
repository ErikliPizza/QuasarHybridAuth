import { computed } from 'vue';
import type { Ref } from 'vue';

type FormWithErrors<T extends object> = { errors: Partial<Record<keyof T, string | undefined>> };

/**
 * Returns a computed that is `true` when any field belonging to the given step
 * has a validation error on the form.
 *
 * @param form      - Reactive ref to a form that exposes an `errors` object.
 * @param stepFields - Map of step number → array of field keys that belong to that step.
 * @param stepNum   - The step number to check.
 */
export function useStepHasError<T extends object>(
  form: Ref<FormWithErrors<T> | undefined>,
  stepFields: Record<number, (keyof T)[]>,
  stepNum: number,
) {
  return computed(() => stepFields[stepNum]?.some((field) => !!form.value?.errors[field]) ?? false);
}
