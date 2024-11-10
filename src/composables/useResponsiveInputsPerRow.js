import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export function useResponsiveInputsPerRow(props) {
  const $q = useQuasar();
  const inputsPerRow = ref(3); // Default value

  // Function to set inputsPerRow based on the screen size
  const updateInputsPerRow = () => {
    if ($q.screen.xs) {
      inputsPerRow.value = props.inputPerRowXs;
    } else if ($q.screen.sm) {
      inputsPerRow.value = props.inputPerRowSm ?? props.inputPerRowLg;
    } else {
      inputsPerRow.value = props.inputPerRowLg;
    }
  };

  // Watch for screen size changes and update inputsPerRow accordingly
  watch(() => $q.screen.name, updateInputsPerRow);

  // Call it initially to set the correct value based on the initial screen size
  updateInputsPerRow();

  return { inputsPerRow };
}
