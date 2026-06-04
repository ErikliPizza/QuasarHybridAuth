<template>
  <q-btn flat dense :icon="buttonIcon" :color="buttonColor">
    <q-menu auto-close anchor="top right" :class="menuClass">
      <q-list dense>
        <slot :row="row">
          <q-item v-if="showEdit && editTo" clickable :to="editTo">
            <ActionListItem :icon="editIcon" :text="editText" :color="editColor" />
          </q-item>

          <q-separator v-if="showEdit && editTo && showDelete" />

          <q-item v-if="showDelete" clickable @click="emitDeleteRow">
            <ActionListItem :icon="deleteIcon" :text="deleteText" :color="deleteColor" />
          </q-item>
        </slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import ActionListItem from 'components/table/ActionListItem.vue';

const props = withDefaults(
  defineProps<{
    row: { id: string | number };
    editTo?: RouteLocationRaw;
    showEdit?: boolean;
    showDelete?: boolean;
    buttonIcon?: string;
    buttonColor?: string;
    menuClass?: string;
    editIcon?: string;
    editText?: string;
    editColor?: string;
    deleteIcon?: string;
    deleteText?: string;
    deleteColor?: string;
  }>(),
  {
    showEdit: true,
    showDelete: true,
    buttonIcon: 'more_vert',
    menuClass: 'bg-grey-4',
    editIcon: 'edit',
    editText: 'Düzenle',
    editColor: 'grey-8',
    deleteIcon: 'delete',
    deleteText: 'Sil',
    deleteColor: 'grey-8',
  },
);

const emit = defineEmits<{
  deleteRow: [row: { id: string | number }];
}>();

const emitDeleteRow = () => {
  emit('deleteRow', props.row);
};
</script>
