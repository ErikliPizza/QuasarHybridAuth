import { api } from 'src/boot/axios';
import type { ApiResourceResponse } from 'src/boot/axios';
import type { Role, RoleFormData } from 'src/types/role';

export const ROLE_FORM_DEFAULTS: RoleFormData = {
  name: '',
  description: '',
};

export const createRoleFormData = (): RoleFormData => ({
  ...ROLE_FORM_DEFAULTS,
});

export const mapRoleToFormData = (role: Role | null): RoleFormData => ({
  name: role?.name ?? '',
  description: role?.description ?? '',
});

export async function getRole(id: number): Promise<Role> {
  return (await api.get<ApiResourceResponse<Role>>(`/roles/${id}`)).data;
}
