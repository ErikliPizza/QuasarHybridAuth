import type { UserFormData } from 'src/types/user';

export const USER_FORM_STEP_FIELDS: Record<number, (keyof UserFormData)[]> = {
  1: ['name', 'phone', 'email', 'tfa', 'status', 'password'],
  2: ['role_id', 'permission_ids'],
};
