<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null>({ default: null });

const props = withDefaults(
  defineProps<{
    label?: string;
    timePicker?: boolean;
    errorMessage?: string | undefined;
  }>(),
  { label: '', timePicker: false, errorMessage: '' },
);

const pad = (n: number) => String(n).padStart(2, '0');

function parse(val: string | null): Date | null {
  if (!val) return null;
  const d = new Date(val.replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d;
}

const display = computed(() => {
  const d = parse(model.value);
  if (!d) return '';
  const base = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  return props.timePicker ? `${base} ${pad(d.getHours())}:${pad(d.getMinutes())}` : base;
});

const pickerDate = computed(() => {
  const d = parse(model.value);
  return d ? `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}` : '';
});

const pickerTime = computed(() => {
  const d = parse(model.value);
  return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : '';
});

function parseText(text: string): string | null {
  const s = text.replace(/_/g, '').trim();
  if (!s) return null;
  if (props.timePicker) {
    const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]} ${m[4]}:${m[5]}:00` : null;
  }
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]} 00:00:00` : null;
}

function onTextChange(val: string | number | null) {
  model.value = parseText(String(val ?? ''));
}

function onDatePick(val: string | null) {
  if (!val) { model.value = null; return; }
  const prev = parse(model.value);
  const time = prev && props.timePicker
    ? `${pad(prev.getHours())}:${pad(prev.getMinutes())}:00`
    : '00:00:00';
  model.value = `${val.replace(/\//g, '-')} ${time}`;
}

function onTimePick(val: string | null) {
  if (!val) return;
  const d = parse(model.value) ?? new Date();
  model.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${val}:00`;
}
</script>


<template>
  <q-input :model-value="display" @change="onTextChange" :label="label" :error="!!errorMessage"
    :error-message="errorMessage" :mask="timePicker ? '##.##.#### ##:##' : '##.##.####'" fill-mask="_" outlined dense
    stack-label clearable @clear="model = null" v-bind="$attrs">
    <template #prepend>
      <div class="q-gutter-x-sm">
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date :model-value="pickerDate" @update:model-value="onDatePick" mask="YYYY/MM/DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Kapat" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>

        <q-icon name="access_time" class="cursor-pointer" v-if="timePicker">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time :model-value="pickerTime" @update:model-value="onTimePick" mask="HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Kapat" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </div>
    </template>

  </q-input>
</template>
