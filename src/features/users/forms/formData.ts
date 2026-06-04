import { api } from 'src/boot/axios';
import type { ApiResourceResponse } from 'src/boot/axios';
import type { User, UserFormData } from 'src/types/user';
import {
  entitiesToInitialSearchOptions,
  entityToInitialSearchOptions,
} from 'src/utils/initialSearchOptions';

export const USER_FORM_DEFAULTS: UserFormData = {
  name: '',
  phone: '',
  email: '',
  role_id: null,
  permission_ids: [],
  tfa: 0,
  status: 1,
  password: '',
};

export const createUserFormData = (): UserFormData => ({
  ...USER_FORM_DEFAULTS,
});

export const mapUserToFormData = (user: User | null): UserFormData => ({
  name: user?.name ?? '',
  phone: user?.phone ?? '',
  email: user?.email ?? '',
  role_id: user?.role?.id ?? null,
  permission_ids: user?.permissions?.map((permission) => permission.id) ?? [],
  tfa: user?.tfa ? 1 : 0,
  status: user?.status ?? 1,
  password: '',
});

export async function getUser(id: number): Promise<User> {
  return (await api.get<ApiResourceResponse<User>>(`/users/${id}`)).data;
}

export function mapUserToInitialOptions(user: User | null) {
  return {
    role: entityToInitialSearchOptions(user?.role, 'description'),
    permissions: entitiesToInitialSearchOptions(user?.permissions, 'name'),
  };
}
