<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { getProfile } from 'src/services/requests/profile';
import type { Profile } from 'src/types/profile';
import { formatDate, formatGender } from 'src/utils/formatters';

const { data: profile, loadData } = useDataFetcher<Profile>(getProfile);

onMounted(async () => {
  await loadData();
});

interface FieldConfig {
  label: string;
  value: string | null;
}

const sections = computed<Record<string, FieldConfig[]>>(() => {
  if (!profile.value) return {};

  return {
    'Personal': [
      { label: 'Birth Date', value: formatDate(profile.value.birth_date) },
      { label: 'Gender', value: formatGender(profile.value.gender) },
    ],
    'Contact': [
      { label: 'Phone', value: profile.value.phone || '—' },
    ],
    'Additional': [
      { label: 'Created At', value: formatDate(profile.value.created_at) },
    ],
  };
});
</script>

<template>
  <q-page padding>
    <div v-if="profile" class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section class="row items-center q-gutter-md">
          <q-avatar size="80px">
            <img :src="profile.gravatar" :alt="profile.name" />
          </q-avatar>
          <div>
            <div class="text-h5 text-weight-medium">{{ profile.name }}</div>
            <div class="text-subtitle1 text-grey-7">{{ profile.email }}</div>
            <q-badge :color="profile.tfa ? 'positive' : 'grey-5'" :label="profile.tfa ? '2FA On' : '2FA Off'"
              class="q-mt-sm q-pa-xs" />
          </div>
          <q-space />
          <q-btn flat round icon="edit" :to="{ name: 'profile-edit' }">
            <q-tooltip>Düzenle</q-tooltip>
          </q-btn>
          <q-btn flat round icon="refresh" @click="loadData">
            <q-tooltip>Yenile</q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>

      <q-card v-for="(fields, title) in sections" :key="title" flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md">{{ title }}</div>
          <q-list separator>
            <q-item v-for="field in fields" :key="field.label">
              <q-item-section>
                <q-item-label caption>{{ field.label }}</q-item-label>
                <q-item-label>{{ field.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped></style>
