<script setup lang="ts">
import BaseSelectField from 'src/components/form/BaseSelectField.vue';
import BaseTextField from 'src/components/form/BaseTextField.vue';
import SearchOptions from 'src/components/form/SearchOptions.vue';
import { statusOptions, tfaOptions } from 'src/constants/enum-options';
import type { UserFormData } from 'src/types/user';
import type { mapUserToInitialOptions } from 'src/features/users/forms/formData';
import { USER_FORM_STEP_FIELDS } from 'src/features/users/forms/stepFields';
import { useStepHasError } from 'src/utils/stepErrors';
import { useStepperNavigation } from 'src/utils/useStepperNavigation';
import type { Form } from 'laravel-precognition-vue';
import { ref, watchEffect } from 'vue';
import { QStepper } from 'quasar';
import type { Permission } from 'src/types/permission';
import PermissionListBox from 'src/features/users/components/PermissionListBox.vue';

const step = ref(1);
const stepper = ref<InstanceType<typeof QStepper>>();
type UserFormModel = UserFormData & Form<UserFormData>;

const form = defineModel<UserFormModel>('modelValue', { required: true });
const isLastModel = defineModel<boolean>('isLast', { default: false });

const stepHasError = (stepNum: number) => useStepHasError(form, USER_FORM_STEP_FIELDS, stepNum);
const {
  isFirst,
  isLast: isLastStep,
  validating,
  onPrev,
  onNext,
} = useStepperNavigation(form, USER_FORM_STEP_FIELDS, step, stepper);

watchEffect(() => {
  isLastModel.value = isLastStep.value;
});


defineProps<{
  initialOptions?: ReturnType<typeof mapUserToInitialOptions> | undefined;
  permissions: Permission[];
}>();

</script>

<template>
  <q-stepper v-model="step" ref="stepper" contracted color="primary" animated keep-alive>
    <q-step :name="1" title="Kullanıcı Bilgileri" icon="person" :done="step > 1" :error="stepHasError(1).value">
      <div class="row q-col-gutter-sm justify-center items-center">
        <BaseTextField class="col-12 col-sm-4" v-model="form.name" label="Ad Soyad" :error-message="form.errors.name" />

        <BaseTextField class="col-12 col-sm-4" v-model="form.phone" label="Telefon" :error-message="form.errors.phone"
          unmasked-value mask="(###) ### - ####" />

        <BaseTextField class="col-12 col-sm-4" v-model="form.email" label="E-posta" type="email"
          :error-message="form.errors.email" />

        <BaseSelectField class="col-12 col-sm-4" v-model="form.tfa" label="2FA" :options="tfaOptions"
          :error-message="form.errors.tfa" />

        <BaseSelectField class="col-12 col-sm-4" v-model="form.status" label="Durum" :options="statusOptions"
          :error-message="form.errors.status" />

        <BaseTextField class="col-12 col-sm-6" v-model="form.password" label="Şifre" type="password"
          :error-message="form.errors.password" />
      </div>
    </q-step>

    <q-step :name="2" title="Güvenlik Ayarları" icon="security" :done="step > 2" :error="stepHasError(2).value">
      <div class="row q-col-gutter-sm justify-center">
        <SearchOptions class="col-12 col-sm-6" searchKey="description" endpoint="/roles"
          v-model="form.role_id" label="Unvan" :error-message="form.errors.role_id"
          :initial-options="initialOptions?.role" />

        <div class="col-12 col-sm-6">
          <PermissionListBox v-model="form.permission_ids" :permissions="permissions" />
        </div>
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation class="flex justify-between">
        <q-btn :disable="isFirst" flat color="primary" @click="onPrev()" label="Geri" no-caps />
        <q-btn :disable="isLastStep" flat color="primary" :loading="validating" @click="onNext()" label="İleri"
          no-caps />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>
