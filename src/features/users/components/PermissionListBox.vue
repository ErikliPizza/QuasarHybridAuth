<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Permission } from 'src/types/permission';

const props = defineProps<{ permissions: Permission[] }>();

const permissionIds = defineModel<number[] | null>({ required: true });

const selectedRoleId = ref<number | null>(null);

const groups = computed(() => {
  const map = new Map<number, { roleId: number; label: string; permissions: Permission[] }>();
  for (const p of props.permissions) {
    const rid = p.role_id;
    const r = p.role;
    if (rid == null || !r) continue;
    let g = map.get(rid);
    if (!g) {
      g = { roleId: rid, label: r.description, permissions: [] };
      map.set(rid, g);
    }
    g.permissions.push(p);
  }
  return [...map.values()];
});

const tabModel = computed({
  get() {
    const list = groups.value;
    const sel = selectedRoleId.value;
    if (sel != null && list.some((g) => g.roleId === sel)) return sel;
    return list[0]?.roleId;
  },
  set(v: number) {
    selectedRoleId.value = v;
  },
});

const checkboxModel = computed({
  get: () => permissionIds.value ?? [],
  set: (v) => {
    permissionIds.value = v;
  },
});

const optionItems = (list: Permission[]) =>
  list.map((p) => ({ label: p.description ?? p.name, value: p.id }));

function groupPermissionIds(g: { permissions: Permission[] }) {
  return g.permissions.map((p) => p.id);
}

function isAllGroupSelected(g: { permissions: Permission[] }) {
  const curr = permissionIds.value ?? [];
  const ids = groupPermissionIds(g);
  return ids.length > 0 && ids.every((id) => curr.includes(id));
}

function isSomeGroupSelected(g: { permissions: Permission[] }) {
  const curr = permissionIds.value ?? [];
  const ids = groupPermissionIds(g);
  const n = ids.filter((id) => curr.includes(id)).length;
  return n > 0 && n < ids.length;
}

function toggleSelectAllForGroup(g: { permissions: Permission[] }) {
  const gids = groupPermissionIds(g);
  const curr = permissionIds.value ?? [];
  if (isAllGroupSelected(g)) {
    permissionIds.value = curr.filter((id) => !gids.includes(id));
    return;
  }
  const set = new Set(curr);
  for (const id of gids) set.add(id);
  permissionIds.value = [...set];
}
</script>

<template>
  <q-card v-if="groups.length">
    <q-tabs v-model="tabModel" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab v-for="g in groups" :key="g.roleId" :name="g.roleId" :label="g.label" />
    </q-tabs>

    <q-separator />

    <q-tab-panels class="panel" v-model="tabModel" animated>
      <q-tab-panel v-for="g in groups" :key="g.roleId" :name="g.roleId">
        <div class="text-h6 q-mb-sm">{{ g.label }}</div>
        <q-checkbox class="q-mb-sm text-caption text-italic" dense :model-value="isAllGroupSelected(g)"
          :indeterminate="isSomeGroupSelected(g)" color="primary" label="Tümünü seç"
          @update:model-value="toggleSelectAllForGroup(g)" />
        <q-option-group v-model="checkboxModel" :options="optionItems(g.permissions)" type="checkbox" color="primary" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<style scoped>
.panel {
  max-height: 200px;
  overflow-y: auto;
}

@media (min-width: 600px) {
  .panel {
    max-height: 400px;
  }
}
</style>
