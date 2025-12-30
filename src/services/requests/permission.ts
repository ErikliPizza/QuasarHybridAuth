import { api } from 'boot/axios';
import type { Permission } from 'src/types/permission';

export interface CreatePermissionPayload {
  name: string;
  description?: string | null;
}

export interface UpdatePermissionPayload {
  name?: string;
  description?: string | null;
}

export interface PermissionsApiResponse {
  success: boolean;
  rows: Permission[];
  rowsNumber: number;
}

export async function getPermissions(): Promise<PermissionsApiResponse> {
  return (await api.get('/permissions')).data;
}

export async function addPermission(payload: CreatePermissionPayload): Promise<Permission> {
  return (await api.post<{ permission: Permission }>('/permissions', payload)).data.permission;
}

export async function updatePermission(
  id: number,
  payload: UpdatePermissionPayload,
): Promise<Permission> {
  return (await api.put<{ permission: Permission }>(`/permissions/${id}`, payload)).data.permission;
}

export async function deletePermission(id: number): Promise<void> {
  return await api.delete(`/permissions/${id}`);
}

export async function getPermission(id: number): Promise<Permission> {
  return (await api.get<{ permission: Permission }>(`/permissions/${id}`)).data.permission;
}
