<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDataFetcher } from 'src/composables/useDataFetcher';

import { getRole } from 'src/services/requests/role';
import { getPermissions, type PermissionsApiResponse } from 'src/services/requests/permission';
import { attachPermission, detachPermission } from 'src/services/requests/role';

import type { Role } from 'src/types/role';
import type { Permission } from 'src/types/permission';

const route = useRoute();
const roleId = Number(route.params.id);

const { data: role, loadData: loadRole } = useDataFetcher<Role>(() => getRole(roleId));

const { data: permissionsResponse, loadData: loadAllPermissions } =
  useDataFetcher<PermissionsApiResponse>(getPermissions);

const rolePermissions = computed<Permission[]>(() => {
  return role.value?.permissions ?? [];
});

const availablePermissions = computed<Permission[]>(() => {
  const all = permissionsResponse.value?.rows ?? [];
  if (!all.length) return [];
  const assignedIds = rolePermissions.value.map((rp) => rp.id);
  return all.filter((p) => !assignedIds.includes(p.id));
});

async function addPermission(permissionId: number) {
  try {
    await attachPermission(roleId, permissionId);
    await loadRole();
  } catch (error) {
    console.error('Ekleme hatası:', error);
  }
}

async function removePermission(permissionId: number) {
  try {
    await detachPermission(roleId, permissionId);
    await loadRole();
  } catch (error) {
    console.error('Silme hatası:', error);
  }
}

onMounted(async () => {
  await Promise.all([loadRole(), loadAllPermissions()]);
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-card flat bordered>
          <q-card-section class="text-h6">All permissions</q-card-section>
          <q-separator />
          <q-list v-if="availablePermissions.length">
            <q-item
              v-for="p in availablePermissions"
              :key="p.id"
              clickable
              v-ripple
              @click="addPermission(p.id)"
            >
              <q-item-section>{{ p.name }}</q-item-section>
              <q-item-section side>
                <q-icon name="add" color="positive" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="q-pa-md text-grey text-center">No permission to link</div>
        </q-card>
      </div>

      <div class="col-6">
        <q-card flat bordered>
          <q-card-section class="text-h6">Linked Permissions</q-card-section>
          <q-separator />
          <q-list v-if="rolePermissions.length">
            <q-item
              v-for="p in rolePermissions"
              :key="p.id"
              clickable
              v-ripple
              @click="removePermission(p.id)"
            >
              <q-item-section>{{ p.name }}</q-item-section>
              <q-item-section side>
                <q-icon name="remove" color="negative" />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="q-pa-md text-grey text-center">There is no permission linked to this role</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
