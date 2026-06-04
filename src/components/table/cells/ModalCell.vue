<template>
  <span class="truncate-inline" :class="{ 'text-caption': q.screen.lt.md }" @click="showModal = true">
    {{ displayValue }}
    <q-tooltip v-if="q.screen.gt.sm" anchor="bottom middle" self="top middle" :offset="[0, 8]">
      Tıklayarak detayları görüntüleyin
    </q-tooltip>
  </span>

  <q-dialog v-model="showModal">
    <div class="modal-detail-panel rounded-borders shadow-2"
      :class="q.dark.isActive ? 'bg-grey-9 text-grey-2' : 'bg-white text-grey-9'">
      <div class="row items-center q-px-md q-pt-md q-pb-sm">
        <div class="text-h6">Detaylar</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </div>

      <div class="scroll q-px-md q-pb-md" style="max-height: min(70vh, 640px)">
        <q-markup-table flat bordered class="modal-detail-table">
          <tbody>
            <template v-for="(section, sIdx) in modalSections" :key="sIdx">
              <tr v-if="section.title" class="section-header-row">
                <th colspan="2" class="text-left text-weight-medium">{{ section.title }}</th>
              </tr>
              <tr v-for="(entry, eIdx) in section.entries" :key="`${sIdx}-${eIdx}`">
                <td class="label-cell text-weight-medium">{{ entry.key ?? 'Değer' }}</td>
                <td class="value-text">{{ entry.value }}</td>
              </tr>
            </template>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

const { value = null } = defineProps<{
  value?: string | number | object | null;
}>();

const q = useQuasar();
const showModal = ref(false);
const EMPTY = '—';

function isRecord(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function humanizeKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function recordTitle(record: Record<string, unknown>, index: number): string {
  const { name, title } = record;
  if (typeof name === 'string' && name.trim()) return name;
  if (typeof title === 'string' && title.trim()) return title;
  return `Öğe ${index + 1}`;
}

function formatValue(val: unknown): string {
  if (val == null) return EMPTY;
  if (typeof val === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    }
    return val;
  }
  if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') {
    return String(val);
  }
  try { return JSON.stringify(val, null, 2); } catch { return EMPTY; }
}

function truncate(str: string, max = 50): string {
  return str.length > max ? `${str.substring(0, max)}…` : str;
}

type ModalEntry = { key?: string; value: string };
type ModalSection = { title?: string; entries: ModalEntry[] };

const toEntry = (val: unknown, key?: string): ModalEntry =>
  key ? { key, value: formatValue(val) } : { value: formatValue(val) };
const recordToEntries = (record: Record<string, unknown>): ModalEntry[] =>
  Object.entries(record).map(([k, v]) => toEntry(v, humanizeKey(k)));
const valueSection = (val: unknown): ModalSection => ({ entries: [toEntry(val)] });

const modalSections = computed<ModalSection[]>(() => {
  if (value == null) return [valueSection(EMPTY)];
  if (isRecord(value)) return [{ entries: recordToEntries(value) }];
  if (!Array.isArray(value)) return [valueSection(value)];
  if (!value.length) return [valueSection(EMPTY)];

  const withTitles = value.length > 1;
  return value.map((item, idx) => (
    isRecord(item)
      ? (withTitles
        ? { title: recordTitle(item, idx), entries: recordToEntries(item) }
        : { entries: recordToEntries(item) })
      : valueSection(item)
  ));
});

const displayValue = computed<string | number>(() => {
  if (value == null) return EMPTY;
  if (Array.isArray(value)) {
    if (value.length === 0) return EMPTY;
    return `${value.length} öğe`;
  }
  return truncate(formatValue(value));
});
</script>

<style scoped>
.truncate-inline {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-width: 200px;
  text-overflow: ellipsis;
  vertical-align: middle;
  cursor: pointer;
}

.value-text {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.modal-detail-panel {
  min-width: 320px;
  max-width: 90vw;
}

.modal-detail-table {
  width: 100%;
}

.modal-detail-table .label-cell {
  width: 38%;
  vertical-align: top;
}

.modal-detail-table :is(td, th) {
  vertical-align: top;
}

.section-header-row th {
  background: color-mix(in srgb, currentColor 8%, transparent);
}
</style>
