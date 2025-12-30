<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FormKit, FormKitSchema } from '@formkit/vue';
import { useDataFetcher } from 'src/composables/useDataFetcher';
import { getProfile, updateProfile } from 'src/services/requests/profile';
import { profileEditSchema } from 'src/schemas/profile';
import { mapFields } from 'src/utils/mappers';
import type { Profile } from 'src/types/profile';
import type { ProfileUpdatePayload } from 'src/services/requests/profile';

const loading = ref(false);

const router = useRouter();

const { data: profile, loadData } = useDataFetcher<Profile>(getProfile);

// Form data
const formData = ref<ProfileUpdatePayload>({});

// Load profile data and populate form
onMounted(async () => {
  await loadData();
  if (profile.value) {
    formData.value = mapFields(
      [
        'tfa',
        'birth_date',
        'gender',
        'phone',
      ],
      profile.value,
    );
  }
});


// Handle form submission
const handleSubmit = async (data: ProfileUpdatePayload) => {
  loading.value = true;
  try {
    await updateProfile(data);
    await router.push({ name: 'profile' });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

};
</script>

<template>
    <div v-if="profile" class="q-pa-md">
      <q-card class="q-pa-lg" flat bordered style="max-width: 800px; margin: auto">
        <q-card-section>
          <div class="text-h6 q-mb-md">Edit Profile</div>
          <FormKit type="form" v-model="formData" submit-label="Send" @submit="handleSubmit">
            <div class="formkit-grid-layout">
              <FormKitSchema :schema="profileEditSchema" />
            </div>
          </FormKit>
        </q-card-section>
      </q-card>
    </div>
</template>

<style scoped></style>
