import { api } from 'src/boot/axios';
import type { ApiCollectionResponse, ApiResourceResponse } from 'src/boot/axios';
import type { Permission, PermissionFormData } from 'src/types/permission';
import { entityToInitialSearchOptions } from 'src/utils/initialSearchOptions';

export const PERMISSION_FORM_DEFAULTS: PermissionFormData = {
  name: '',
  description: '',
  action: '',
  role_id: null,
};

export const createPermissionFormData = (): PermissionFormData => ({
  ...PERMISSION_FORM_DEFAULTS,
});

export const mapPermissionToFormData = (permission: Permission | null): PermissionFormData => ({
  name: permission?.name ?? '',
  description: permission?.description ?? '',
  action: permission?.action ?? '',
  role_id: permission?.role_id ?? null,
});

export async function getPermission(id: number): Promise<Permission> {
  return (await api.get<ApiResourceResponse<Permission>>(`/permissions/${id}`)).data;
}

export async function getPermissions(): Promise<{ data: Permission[] }> {
  return (
    await api.get<ApiCollectionResponse<Permission>>('/permissions', {
      params: { include: 'role', page: { size: 999 } },
    })
  ).data;
}

export function mapPermissionToInitialOptions(permission: Permission | null) {
  return {
    role: entityToInitialSearchOptions(permission?.role, 'name'),
  };
}
