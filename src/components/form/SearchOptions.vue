<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSearchOptionsFilters } from 'src/composables/searchOptions/useSearchOptionsFilters';
import type {
  SearchModelValue,
  SearchOption,
  SearchOptionsProps,
} from 'src/types/searchOptions';

defineOptions({ inheritAttrs: false });

const modelValue = defineModel<SearchModelValue>({ default: null });
const emit = defineEmits<{
  (event: 'selected-option', option: SearchOption | SearchOption[] | null): void;
}>();

const props = withDefaults(
  defineProps<SearchOptionsProps>(),
  {
    label: '',
    multiple: false,
    errorMessage: '',
    disable: false,
  },
);

const fetchedOptions = ref<SearchOption[] | null>(null);
const displayOptions = computed(() => fetchedOptions.value ?? props.initialOptions ?? []);
const loading = ref(false);
const { fetchOptions } = useSearchOptionsFilters({
  endpoint: () => props.endpoint,
  searchKey: () => props.searchKey,
  labelKey: () => props.optionLabelKey ?? props.searchKey,
  filters: () => props.filters,
});

function onUpdateModelValue(value: SearchModelValue) {
  if (props.multiple) {
    const values = Array.isArray(value) ? value : [];
    emit('selected-option', displayOptions.value.filter((option) => values.includes(option.id)));
    return;
  }

  emit('selected-option', displayOptions.value.find((option) => option.id === value) ?? null);
}

async function onFilter(
  val: string,
  update: (fn: () => void) => void,
  abort: () => void,
) {
  loading.value = true;
  try {
    const rows = await fetchOptions(val);
    update(() => {
      fetchedOptions.value = rows;
    });
  } catch {
    abort();
    fetchedOptions.value = [];
  } finally {
    loading.value = false;
  }
}
</script>


<template>
  <q-select v-model="modelValue" :options="displayOptions" :loading="loading" :use-chips="multiple" option-value="id"
    :disable="disable" option-label="label" map-options emit-value use-input :label="label" :multiple="multiple"
    @update:model-value="onUpdateModelValue" @filter="onFilter" input-debounce="500" :error="!!errorMessage"
    :error-message="errorMessage" outlined dense stack-label clearable v-bind="$attrs">
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          Sonuç bulunamadı
        </q-item-section>
      </q-item>
    </template>
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </q-select>
</template>
