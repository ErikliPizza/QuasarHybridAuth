<script setup lang="ts">
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { getProfile, toggleProfileTfa } from 'src/features/profile/forms/formData';
import type { Profile } from 'src/types/profile';
import { computed, onBeforeMount, ref } from 'vue';
import ProfileItem from 'src/components/layouts/Partials/ProfileItem.vue';

type FieldRow = {
  label: string;
  value: string | number | boolean | null | undefined;
};

const { data: profile, loadData, loading } = useDataFetcher<Profile>(() => getProfile());
const togglingTfa = ref(false);

onBeforeMount(loadData);

async function onToggleTfa() {
  if (togglingTfa.value) return;
  togglingTfa.value = true;
  try {
    profile.value = await toggleProfileTfa();
  } finally {
    togglingTfa.value = false;
  }
}

const isVisible = (row: FieldRow): boolean => row.value != null && row.value !== '';

const rows = computed<FieldRow[]>(() => {
  const p = profile.value;
  return [
    { label: 'Unvan', value: p?.role?.description ?? p?.role?.name },
    { label: 'Ad Soyad', value: p?.name },
    { label: 'Telefon', value: p?.phone },
    { label: 'E-posta', value: p?.email },
  ].filter(isVisible);
});
</script>

<template>
  <q-card class="q-pa-md" v-if="!loading">
    <ProfileItem :avatar="profile?.gravatar ?? ''" :name="profile?.name ?? ''" :email="profile?.email ?? ''"
      :to="{ name: 'profile-edit' }" />

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-list class="row">
            <q-item v-for="item in rows" :key="item.label" class="col-12">
              <q-item-section>
                <q-item-label caption>{{ item.label }}</q-item-label>
                <q-item-label class="text-weight-medium">{{ item.value }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="col-12">
              <q-item-section>
                <q-item-label caption>2FA</q-item-label>
                <q-item-label class="text-weight-medium">
                  {{ profile?.tfa ? 'Açık' : 'Kapalı' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="!!profile?.tfa" :disable="togglingTfa" color="primary"
                  @update:model-value="onToggleTfa" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-expansion-item v-if="profile?.permissions?.length" label="İzinler" icon="key"
            header-class="text-weight-medium">
            <div class="q-pa-sm q-gutter-xs">
              <q-chip size="sm" v-for="permission in profile?.permissions" :key="permission.id"
                :label="permission.description ?? ''" />
            </div>
          </q-expansion-item>
        </q-card>
      </div>
    </div>
  </q-card>
</template>
