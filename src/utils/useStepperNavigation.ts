import { computed } from 'vue';
import type { Ref } from 'vue';
import type { QStepper } from 'quasar';
import type { Form } from 'laravel-precognition-vue';

type FormWithValidate<T extends Record<string, unknown>> = T & Form<T>;

/**
 * Encapsulates precognition-aware stepper navigation logic.
 * Derives first/last step from the stepFields keys — no need to hardcode max step.
 */
export function useStepperNavigation<T extends Record<string, unknown>>(
  form: Ref<FormWithValidate<T>>,
  stepFields: Record<number, Extract<keyof T, string>[]>,
  step: Ref<number>,
  stepper: Ref<InstanceType<typeof QStepper> | undefined>,
) {
  const steps = Object.keys(stepFields).map(Number);
  const firstStep = Math.min(...steps);
  const lastStep = Math.max(...steps);

  const isFirst = computed(() => step.value <= firstStep);
  const isLast = computed(() => step.value >= lastStep);
  const validating = computed(() => form.value.validating);

  const onPrev = () => stepper.value?.previous();

  const onNext = () =>
    form.value.validate({
      only: stepFields[step.value] ?? [],
      onSuccess: () => stepper.value?.next(),
    });

  return { isFirst, isLast, validating, onPrev, onNext };
}
